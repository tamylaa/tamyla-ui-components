/**
 * Real-time Status Indicator Component
 * Implements Trading Portal's live status patterns with animations
 * Single responsibility: Display connection status with real-time updates
 */

import { ENHANCED_TOKENS } from '../../core/design-tokens.js';

/**
 * Status types with their visual configurations
 */
const STATUS_CONFIGS = {
  live: {
    icon: '🟢',
    text: 'Live',
    color: '#10b981',
    bgColor: '#d1fae5',
    pulse: true
  },
  offline: {
    icon: '🔴',
    text: 'Offline',
    color: '#ef4444',
    bgColor: '#fee2e2',
    pulse: false
  },
  connecting: {
    icon: '🟡',
    text: 'Connecting',
    color: '#f59e0b',
    bgColor: '#fef3c7',
    pulse: true
  },
  pending: {
    icon: '⏳',
    text: 'Pending',
    color: '#8b5cf6',
    bgColor: '#e7d3ff',
    pulse: true
  },
  filled: {
    icon: '✅',
    text: 'Filled',
    color: '#10b981',
    bgColor: '#d1fae5',
    pulse: false
  },
  cancelled: {
    icon: '❌',
    text: 'Cancelled',
    color: '#6b7280',
    bgColor: '#f3f4f6',
    pulse: false
  },
  rejected: {
    icon: '🚫',
    text: 'Rejected',
    color: '#ef4444',
    bgColor: '#fee2e2',
    pulse: false
  }
};

/**
 * Create Real-time Status Indicator
 * @param {Object} options - Status indicator configuration
 * @returns {HTMLElement} Status indicator element
 */
export function createStatusIndicator(options = {}) {
  const {
    status = 'offline',
    animated = true,
    showTimestamp = false,
    showIcon = true,
    showText = true,
    size = 'md', // sm, md, lg
    updateInterval = null,
    onStatusChange,
    className = ''
  } = options;

  const config = STATUS_CONFIGS[status] || STATUS_CONFIGS.offline;
  
  const indicator = document.createElement('div');
  indicator.className = `tmyl-status-indicator size-${size} ${className} ${config.pulse && animated ? 'pulsing' : ''}`;
  indicator.setAttribute('data-status', status);
  
  // Build indicator content
  const content = [];
  
  if (showIcon) {
    content.push(`<span class="status-icon">${config.icon}</span>`);
  }
  
  if (showText) {
    content.push(`<span class="status-text">${config.text}</span>`);
  }
  
  if (showTimestamp) {
    content.push(`<span class="status-timestamp">${new Date().toLocaleTimeString()}</span>`);
  }
  
  indicator.innerHTML = content.join('');
  
  // Apply dynamic styles
  indicator.style.setProperty('--status-color', config.color);
  indicator.style.setProperty('--status-bg', config.bgColor);
  
  // Store update interval if provided
  if (updateInterval && showTimestamp) {
    const intervalId = setInterval(() => {
      const timestampEl = indicator.querySelector('.status-timestamp');
      if (timestampEl) {
        timestampEl.textContent = new Date().toLocaleTimeString();
      }
    }, updateInterval);
    
    // Store interval ID for cleanup
    indicator._intervalId = intervalId;
  }
  
  // Store status change callback
  indicator._onStatusChange = onStatusChange;
  
  return indicator;
}

/**
 * Update status indicator
 * @param {HTMLElement} indicator - Status indicator element
 * @param {string} newStatus - New status to set
 * @param {Object} options - Update options
 */
export function updateStatusIndicator(indicator, newStatus, options = {}) {
  const { animated = true, notifyChange = true } = options;
  const config = STATUS_CONFIGS[newStatus] || STATUS_CONFIGS.offline;
  const oldStatus = indicator.getAttribute('data-status');
  
  // Update attributes and classes
  indicator.setAttribute('data-status', newStatus);
  indicator.classList.toggle('pulsing', config.pulse && animated);
  
  // Update content
  const iconEl = indicator.querySelector('.status-icon');
  const textEl = indicator.querySelector('.status-text');
  const timestampEl = indicator.querySelector('.status-timestamp');
  
  if (iconEl) iconEl.textContent = config.icon;
  if (textEl) textEl.textContent = config.text;
  if (timestampEl) timestampEl.textContent = new Date().toLocaleTimeString();
  
  // Update styles
  indicator.style.setProperty('--status-color', config.color);
  indicator.style.setProperty('--status-bg', config.bgColor);
  
  // Add change animation
  if (animated && oldStatus !== newStatus) {
    indicator.classList.add('status-changing');
    setTimeout(() => indicator.classList.remove('status-changing'), 300);
  }
  
  // Notify change if callback exists
  if (notifyChange && indicator._onStatusChange) {
    indicator._onStatusChange({
      oldStatus,
      newStatus,
      timestamp: new Date().toISOString(),
      element: indicator
    });
  }
}

/**
 * Connection Status Manager
 * Handles real-time connection monitoring
 */
export class ConnectionStatusManager {
  constructor(options = {}) {
    this.indicators = new Set();
    this.currentStatus = 'offline';
    this.checkInterval = options.checkInterval || 5000;
    this.endpoint = options.endpoint || '/api/health';
    this.onStatusChange = options.onStatusChange;
    this.isMonitoring = false;
    this._intervalId = null;
  }

  /**
   * Register a status indicator for automatic updates
   */
  register(indicator) {
    this.indicators.add(indicator);
    // Set initial status
    updateStatusIndicator(indicator, this.currentStatus, { notifyChange: false });
    return this;
  }

  /**
   * Unregister a status indicator
   */
  unregister(indicator) {
    this.indicators.delete(indicator);
    // Cleanup interval if it exists
    if (indicator._intervalId) {
      clearInterval(indicator._intervalId);
    }
    return this;
  }

  /**
   * Start monitoring connection status
   */
  startMonitoring() {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this._checkConnection();
    
    this._intervalId = setInterval(() => {
      this._checkConnection();
    }, this.checkInterval);
  }

  /**
   * Stop monitoring
   */
  stopMonitoring() {
    this.isMonitoring = false;
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
  }

  /**
   * Manually set status for all registered indicators
   */
  setStatus(status) {
    const oldStatus = this.currentStatus;
    this.currentStatus = status;
    
    // Update all registered indicators
    this.indicators.forEach(indicator => {
      updateStatusIndicator(indicator, status);
    });
    
    // Global status change callback
    if (this.onStatusChange && oldStatus !== status) {
      this.onStatusChange({
        oldStatus,
        newStatus: status,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Check connection status
   */
  async _checkConnection() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(this.endpoint, {
        signal: controller.signal,
        method: 'GET',
        cache: 'no-cache'
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        this.setStatus('live');
      } else {
        this.setStatus('offline');
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        this.setStatus('connecting');
      } else {
        this.setStatus('offline');
      }
    }
  }

  /**
   * Cleanup resources
   */
  destroy() {
    this.stopMonitoring();
    this.indicators.forEach(indicator => {
      if (indicator._intervalId) {
        clearInterval(indicator._intervalId);
      }
    });
    this.indicators.clear();
  }
}

/**
 * Trading Portal Status Patterns
 * Predefined status configurations from Trading Portal
 */
export const TRADING_PORTAL_STATUSES = {
  // Connection statuses
  liveConnection: {
    status: 'live',
    animated: true,
    showTimestamp: true,
    showIcon: true,
    showText: true
  },
  
  offlineConnection: {
    status: 'offline',
    animated: false,
    showTimestamp: true,
    showIcon: true,
    showText: true
  },
  
  // Order statuses
  orderPending: {
    status: 'pending',
    animated: true,
    showTimestamp: false,
    showIcon: true,
    showText: true
  },
  
  orderFilled: {
    status: 'filled',
    animated: false,
    showTimestamp: true,
    showIcon: true,
    showText: true
  },
  
  orderCancelled: {
    status: 'cancelled',
    animated: false,
    showTimestamp: true,
    showIcon: true,
    showText: true
  }
};
