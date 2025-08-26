/**
 * Connection Manager Controller
 * Handles real-time connection monitoring and status management
 */

import { 
  STATUS_TYPES,
  EVENT_TYPES,
  UPDATE_INTERVALS,
  validateConfig
} from '../config/status-config.js';

export default class ConnectionManagerController {
  constructor(options = {}) {
    // Validate and merge configuration
    const validation = validateConfig(options, 'connectionManager');
    if (!validation.isValid) {
      throw new Error(`Invalid configuration: ${validation.errors.join(', ')}`);
    }
    
    this.options = validation.config;
    this.indicators = new Set();
    this.banners = new Set();
    this.currentStatus = STATUS_TYPES.OFFLINE;
    this.listeners = new Map();
    this.isMonitoring = false;
    this.intervalId = null;
    this.retryCount = 0;
    this.lastCheckTime = null;
    this.connectionHistory = [];
    
    if (this.options.autoStart) {
      this.startMonitoring();
    }
  }

  /**
   * Register a status indicator for automatic updates
   */
  register(component) {
    if (component.getState) {
      // It's a status indicator controller
      this.indicators.add(component);
      component.updateStatus(this.currentStatus, { notifyChange: false });
    } else if (component.setStatus) {
      // It's a banner controller
      this.banners.add(component);
      component.setStatus(this.currentStatus, { notifyChange: false });
    } else {
      console.warn('Invalid component registered with connection manager');
      return false;
    }
    
    this.emit(EVENT_TYPES.LIST_ITEM_ADDED, {
      component,
      status: this.currentStatus,
      manager: this
    });
    
    return this;
  }

  /**
   * Unregister a component
   */
  unregister(component) {
    const wasIndicator = this.indicators.delete(component);
    const wasBanner = this.banners.delete(component);
    
    if (wasIndicator || wasBanner) {
      this.emit(EVENT_TYPES.LIST_ITEM_REMOVED, {
        component,
        manager: this
      });
    }
    
    return this;
  }

  /**
   * Start monitoring connection status
   */
  startMonitoring() {
    if (this.isMonitoring) return this;
    
    this.isMonitoring = true;
    this.retryCount = 0;
    
    // Immediate check
    this._checkConnection();
    
    // Set up periodic checks
    this.intervalId = setInterval(() => {
      this._checkConnection();
    }, this.options.checkInterval);
    
    this.emit(EVENT_TYPES.CONNECTION_RETRY, {
      status: 'started',
      manager: this
    });
    
    return this;
  }

  /**
   * Stop monitoring
   */
  stopMonitoring() {
    this.isMonitoring = false;
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    this.emit(EVENT_TYPES.CONNECTION_RETRY, {
      status: 'stopped',
      manager: this
    });
    
    return this;
  }

  /**
   * Manually set status for all registered components
   */
  setStatus(status, metadata = {}) {
    const oldStatus = this.currentStatus;
    this.currentStatus = status;
    this.lastCheckTime = new Date();
    
    // Add to connection history
    this.connectionHistory.push({
      status,
      timestamp: this.lastCheckTime,
      metadata
    });
    
    // Keep only last 100 entries
    if (this.connectionHistory.length > 100) {
      this.connectionHistory = this.connectionHistory.slice(-100);
    }
    
    // Update all registered indicators
    this.indicators.forEach(indicator => {
      try {
        indicator.updateStatus(status);
      } catch (error) {
        console.error('Error updating indicator:', error);
      }
    });
    
    // Update all registered banners
    this.banners.forEach(banner => {
      try {
        banner.setStatus(status, metadata);
      } catch (error) {
        console.error('Error updating banner:', error);
      }
    });
    
    // Emit status change event
    if (oldStatus !== status) {
      const eventType = this._getStatusEventType(status);
      this.emit(eventType, {
        oldStatus,
        newStatus: status,
        timestamp: this.lastCheckTime.toISOString(),
        metadata,
        manager: this
      });
      
      this.emit(EVENT_TYPES.STATUS_CHANGED, {
        oldStatus,
        newStatus: status,
        timestamp: this.lastCheckTime.toISOString(),
        metadata,
        manager: this
      });
    }
    
    return this;
  }

  /**
   * Get appropriate event type for status
   */
  _getStatusEventType(status) {
    switch (status) {
      case STATUS_TYPES.LIVE:
        return EVENT_TYPES.CONNECTION_ESTABLISHED;
      case STATUS_TYPES.OFFLINE:
        return EVENT_TYPES.CONNECTION_LOST;
      case STATUS_TYPES.CONNECTING:
        return EVENT_TYPES.CONNECTION_RETRY;
      default:
        return EVENT_TYPES.STATUS_UPDATE;
    }
  }

  /**
   * Check connection status
   */
  async _checkConnection() {
    try {
      // Set connecting status if not already live
      if (this.currentStatus !== STATUS_TYPES.LIVE) {
        this.setStatus(STATUS_TYPES.CONNECTING, { 
          attempt: this.retryCount + 1,
          maxAttempts: this.options.retryAttempts
        });
      }
      
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.options.timeout);
      
      // Make health check request
      const response = await fetch(this.options.endpoint, {
        signal: controller.signal,
        method: 'GET',
        cache: 'no-cache',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      
      clearTimeout(timeoutId);
      
      // Check response
      if (response.ok) {
        const responseData = await response.json().catch(() => ({}));
        
        this.setStatus(STATUS_TYPES.LIVE, {
          responseTime: Date.now() - this.lastCheckTime?.getTime(),
          response: responseData,
          retryCount: this.retryCount
        });
        
        // Reset retry count on successful connection
        this.retryCount = 0;
        
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
    } catch (error) {
      await this._handleConnectionError(error);
    }
  }

  /**
   * Handle connection errors with retry logic
   */
  async _handleConnectionError(error) {
    this.retryCount++;
    
    const metadata = {
      error: error.message,
      attempt: this.retryCount,
      maxAttempts: this.options.retryAttempts,
      nextRetry: null
    };
    
    // Check if we should retry
    if (this.retryCount < this.options.retryAttempts) {
      // Calculate next retry time
      const retryDelay = this.options.retryDelay * Math.pow(2, this.retryCount - 1); // Exponential backoff
      metadata.nextRetry = new Date(Date.now() + retryDelay);
      
      this.setStatus(STATUS_TYPES.CONNECTING, metadata);
      
      // Schedule retry
      setTimeout(() => {
        if (this.isMonitoring) {
          this._checkConnection();
        }
      }, retryDelay);
      
    } else {
      // Max retries reached
      this.setStatus(STATUS_TYPES.OFFLINE, metadata);
      
      // Reset retry count for next monitoring cycle
      setTimeout(() => {
        this.retryCount = 0;
      }, this.options.checkInterval);
    }
  }

  /**
   * Force immediate connection check
   */
  async checkNow() {
    return await this._checkConnection();
  }

  /**
   * Retry connection (reset retry count)
   */
  async retry() {
    this.retryCount = 0;
    return await this.checkNow();
  }

  /**
   * Get current state
   */
  getState() {
    return {
      status: this.currentStatus,
      isMonitoring: this.isMonitoring,
      retryCount: this.retryCount,
      lastCheckTime: this.lastCheckTime,
      registeredIndicators: this.indicators.size,
      registeredBanners: this.banners.size,
      options: { ...this.options }
    };
  }

  /**
   * Get connection history
   */
  getHistory(limit = 10) {
    return this.connectionHistory.slice(-limit);
  }

  /**
   * Get connection statistics
   */
  getStats() {
    const history = this.connectionHistory;
    if (history.length === 0) return null;
    
    const totalChecks = history.length;
    const successfulChecks = history.filter(entry => entry.status === STATUS_TYPES.LIVE).length;
    const failedChecks = history.filter(entry => entry.status === STATUS_TYPES.OFFLINE).length;
    const uptime = totalChecks > 0 ? (successfulChecks / totalChecks) * 100 : 0;
    
    // Calculate average response time for successful checks
    const successfulEntries = history.filter(entry => 
      entry.status === STATUS_TYPES.LIVE && entry.metadata?.responseTime
    );
    const avgResponseTime = successfulEntries.length > 0
      ? successfulEntries.reduce((sum, entry) => sum + entry.metadata.responseTime, 0) / successfulEntries.length
      : null;
    
    return {
      totalChecks,
      successfulChecks,
      failedChecks,
      uptime: Math.round(uptime * 100) / 100,
      avgResponseTime: avgResponseTime ? Math.round(avgResponseTime) : null,
      currentStatus: this.currentStatus,
      isMonitoring: this.isMonitoring,
      lastCheck: this.lastCheckTime
    };
  }

  /**
   * Update configuration
   */
  updateOptions(newOptions) {
    const validation = validateConfig({ ...this.options, ...newOptions }, 'connectionManager');
    if (!validation.isValid) {
      throw new Error(`Invalid options: ${validation.errors.join(', ')}`);
    }
    
    const oldOptions = { ...this.options };
    this.options = validation.config;
    
    // Restart monitoring if interval changed
    if (this.isMonitoring && oldOptions.checkInterval !== this.options.checkInterval) {
      this.stopMonitoring();
      this.startMonitoring();
    }
    
    return this;
  }

  /**
   * Event system
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
    return this;
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
    return this;
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Cleanup and destroy
   */
  destroy() {
    this.stopMonitoring();
    
    // Cleanup all registered components
    this.indicators.forEach(indicator => {
      if (typeof indicator.destroy === 'function') {
        indicator.destroy();
      }
    });
    
    this.banners.forEach(banner => {
      if (typeof banner.destroy === 'function') {
        banner.destroy();
      }
    });
    
    this.indicators.clear();
    this.banners.clear();
    this.listeners.clear();
    this.connectionHistory = [];
    
    this.emit(EVENT_TYPES.COMPONENT_DESTROYED, { manager: this });
  }
}
