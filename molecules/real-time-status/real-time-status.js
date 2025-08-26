/**
 * Real-time Status - Main Module
 * Comprehensive real-time status system for Trading Portal integration
 */

import StatusIndicatorController from './controllers/status-indicator-controller.js';
import ConnectionManagerController from './controllers/connection-manager-controller.js';
import OrderStatusController from './controllers/order-status-controller.js';
import { 
  STATUS_TYPES,
  STATUS_CONFIGS,
  TRADING_PORTAL_PRESETS,
  EVENT_TYPES,
  validateConfig,
  getPreset,
  getStatusConfig,
  getMarketConfig,
  isMarketOpen,
  getNextMarketEvent
} from './config/status-config.js';

class RealTimeStatus {
  constructor(options = {}) {
    this.options = {
      type: 'status-indicator', // status-indicator, connection-banner, order-status, trading-session, status-list
      preset: null,
      autoLoadStyles: true,
      autoConnect: false,
      globalManager: true,
      ...options
    };

    this.initialized = false;
    this.controller = null;
    this.listeners = new Map();

    if (this.options.autoLoadStyles) {
      this.loadStyles();
    }

    this.initialize();
  }

  /**
   * Initialize the real-time status system
   */
  async initialize() {
    if (this.initialized) return;

    try {
      // Apply preset if specified
      if (this.options.preset) {
        const presetConfig = getPreset(this.options.preset);
        if (presetConfig) {
          this.options = { ...this.options, ...presetConfig };
        }
      }

      // Create appropriate controller based on type
      switch (this.options.type) {
        case 'status-indicator':
          this.controller = new StatusIndicatorController(this.options);
          break;
        
        case 'connection-banner':
          this.controller = await this.createConnectionBanner();
          break;
        
        case 'order-status':
          this.controller = new OrderStatusController(this.options.orderData || {}, this.options);
          break;
        
        case 'trading-session':
          this.controller = await this.createTradingSession();
          break;
        
        case 'status-list':
          this.controller = await this.createStatusList();
          break;
        
        default:
          throw new Error(`Unknown component type: ${this.options.type}`);
      }

      // Bind controller events
      this.bindControllerEvents();

      // Register with global manager if enabled
      if (this.options.globalManager && typeof window !== 'undefined') {
        this.registerWithGlobalManager();
      }

      // Auto-connect if enabled
      if (this.options.autoConnect) {
        this.connect();
      }

      this.initialized = true;
      this.emit(EVENT_TYPES.COMPONENT_INITIALIZED, { status: this });

    } catch (error) {
      console.error('Failed to initialize real-time status:', error);
      this.emit(EVENT_TYPES.COMPONENT_ERROR, { error, status: this });
      throw error;
    }
  }

  /**
   * Load CSS styles
   */
  async loadStyles() {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/ui-components/molecules/real-time-status/styles/real-time-status.css';
      
      link.onload = resolve;
      link.onerror = () => {
        console.warn('Failed to load real-time status styles, using fallback');
        resolve(); // Don't fail initialization
      };
      
      document.head.appendChild(link);
    });
  }

  /**
   * Create connection banner controller
   */
  async createConnectionBanner() {
    // For now, delegate to status indicator with banner styling
    // In a full implementation, you'd create a dedicated BannerController
    const bannerController = new StatusIndicatorController({
      ...this.options,
      showTimestamp: false,
      size: 'lg',
      className: 'connection-banner-style'
    });

    // Add banner-specific methods
    bannerController.setProgress = (percentage) => {
      const element = bannerController.getElement();
      const progressFill = element?.querySelector('.progress-fill');
      if (progressFill) {
        progressFill.style.width = `${percentage}%`;
      }
    };

    bannerController.showRetryButton = (show = true) => {
      const element = bannerController.getElement();
      const retryBtn = element?.querySelector('.banner-retry-btn');
      if (retryBtn) {
        retryBtn.style.display = show ? '' : 'none';
      }
    };

    return bannerController;
  }

  /**
   * Create trading session controller
   */
  async createTradingSession() {
    const market = this.options.market || 'NYSE';
    const marketConfig = getMarketConfig(market);
    const isOpen = isMarketOpen(market);
    const nextEvent = getNextMarketEvent(market);

    // Create a specialized session controller
    const sessionController = new StatusIndicatorController({
      ...this.options,
      status: isOpen ? STATUS_TYPES.OPEN : STATUS_TYPES.CLOSED,
      showTimestamp: true,
      showText: true
    });

    // Add session-specific data
    sessionController.marketConfig = marketConfig;
    sessionController.nextEvent = nextEvent;

    // Add session-specific methods
    sessionController.updateMarketStatus = () => {
      const currentlyOpen = isMarketOpen(market);
      const newStatus = currentlyOpen ? STATUS_TYPES.OPEN : STATUS_TYPES.CLOSED;
      sessionController.updateStatus(newStatus);
    };

    sessionController.getTimeToNextEvent = () => {
      const now = new Date();
      const nextTime = nextEvent.nextTime;
      // Calculate time difference (simplified)
      return { hours: 0, minutes: 0, seconds: 0 }; // Placeholder
    };

    // Auto-update market status if enabled
    if (this.options.autoUpdate) {
      setInterval(() => {
        sessionController.updateMarketStatus();
      }, this.options.updateInterval || 30000);
    }

    return sessionController;
  }

  /**
   * Create status list controller
   */
  async createStatusList() {
    // Create a list manager that handles multiple status items
    const listController = {
      items: new Map(),
      element: null,
      listeners: new Map(),

      async initialize() {
        this.element = await this.createElement();
        return this;
      },

      async createElement() {
        try {
          const response = await fetch('/ui-components/molecules/real-time-status/templates/status-list.html');
          const templateHtml = await response.text();
          
          const template = document.createElement('template');
          template.innerHTML = templateHtml;
          
          return template.content.firstElementChild.cloneNode(true);
        } catch (error) {
          // Fallback element
          const list = document.createElement('div');
          list.className = 'tmyl-status-list';
          list.innerHTML = `
            <div class="status-list-header">
              <h3 class="list-title">System Status</h3>
              <div class="list-controls"></div>
            </div>
            <div class="status-list-content"></div>
          `;
          return list;
        }
      },

      addItem(id, statusItem) {
        this.items.set(id, statusItem);
        const content = this.element?.querySelector('.status-list-content');
        if (content && statusItem.getElement) {
          content.appendChild(statusItem.getElement());
        }
      },

      removeItem(id) {
        const item = this.items.get(id);
        if (item) {
          if (item.getElement) {
            item.getElement().remove();
          }
          this.items.delete(id);
        }
      },

      getElement() {
        return this.element;
      },

      getState() {
        return {
          itemCount: this.items.size,
          items: Array.from(this.items.keys())
        };
      },

      destroy() {
        this.items.forEach(item => {
          if (typeof item.destroy === 'function') {
            item.destroy();
          }
        });
        this.items.clear();
        if (this.element) {
          this.element.remove();
        }
      }
    };

    await listController.initialize();
    return listController;
  }

  /**
   * Bind controller events to main instance
   */
  bindControllerEvents() {
    if (!this.controller) return;

    // Forward all controller events
    const eventTypes = Object.values(EVENT_TYPES);
    eventTypes.forEach(eventType => {
      if (typeof this.controller.on === 'function') {
        this.controller.on(eventType, (data) => {
          this.emit(eventType, { ...data, status: this });
        });
      }
    });
  }

  /**
   * Register with global manager
   */
  registerWithGlobalManager() {
    if (!window.TamylaStatusManager) {
      window.TamylaStatusManager = new RealTimeStatusManager();
    }
    window.TamylaStatusManager.register(this);
  }

  /**
   * Connect to monitoring (for connection-related components)
   */
  connect() {
    if (this.options.type === 'status-indicator' && this.options.autoConnect) {
      // Create a connection manager if not exists
      if (!this.connectionManager) {
        this.connectionManager = new ConnectionManagerController({
          checkInterval: this.options.updateInterval || 5000,
          endpoint: this.options.endpoint || '/api/health',
          autoStart: true
        });
        
        this.connectionManager.register(this.controller);
      }
    }
  }

  /**
   * Disconnect from monitoring
   */
  disconnect() {
    if (this.connectionManager) {
      this.connectionManager.unregister(this.controller);
      this.connectionManager.destroy();
      this.connectionManager = null;
    }
  }

  // ================================
  // Public API Methods
  // ================================

  /**
   * Update status
   */
  updateStatus(status, metadata = {}) {
    if (this.controller && typeof this.controller.updateStatus === 'function') {
      return this.controller.updateStatus(status, metadata);
    }
    return false;
  }

  /**
   * Get current status
   */
  getStatus() {
    if (this.controller && typeof this.controller.getState === 'function') {
      return this.controller.getState();
    }
    return null;
  }

  /**
   * Update order data (for order status components)
   */
  updateOrder(orderData) {
    if (this.controller && typeof this.controller.updateOrderData === 'function') {
      return this.controller.updateOrderData(orderData);
    }
    return false;
  }

  /**
   * Add status item (for list components)
   */
  addStatusItem(id, itemConfig) {
    if (this.controller && typeof this.controller.addItem === 'function') {
      const statusItem = new RealTimeStatus(itemConfig);
      this.controller.addItem(id, statusItem);
      return statusItem;
    }
    return null;
  }

  /**
   * Remove status item (for list components)
   */
  removeStatusItem(id) {
    if (this.controller && typeof this.controller.removeItem === 'function') {
      return this.controller.removeItem(id);
    }
    return false;
  }

  /**
   * Set tooltip content
   */
  setTooltip(title, details) {
    if (this.controller && typeof this.controller.setTooltip === 'function') {
      return this.controller.setTooltip(title, details);
    }
    return false;
  }

  /**
   * Get DOM element
   */
  getElement() {
    if (this.controller && typeof this.controller.getElement === 'function') {
      return this.controller.getElement();
    }
    return null;
  }

  /**
   * Update configuration
   */
  updateOptions(newOptions) {
    this.options = { ...this.options, ...newOptions };
    
    if (this.controller && typeof this.controller.updateOptions === 'function') {
      this.controller.updateOptions(newOptions);
    }
    
    return this;
  }

  // ================================
  // Event System
  // ================================

  /**
   * Add event listener
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
    return this;
  }

  /**
   * Remove event listener
   */
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

  /**
   * Emit event
   */
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
    this.disconnect();
    
    if (this.controller && typeof this.controller.destroy === 'function') {
      this.controller.destroy();
    }
    
    this.listeners.clear();
    this.initialized = false;
    
    this.emit(EVENT_TYPES.COMPONENT_DESTROYED, { status: this });
  }
}

// ================================
// Status Manager
// ================================

/**
 * Real-time Status Manager
 * Global manager for all status components
 */
class RealTimeStatusManager {
  constructor() {
    this.components = new Map();
    this.globalConnectionManager = null;
  }

  /**
   * Register a status component
   */
  register(statusComponent) {
    const id = this.generateId();
    this.components.set(id, statusComponent);
    
    // Auto-register with global connection manager for connection-related components
    if (statusComponent.options.type === 'status-indicator' && statusComponent.options.autoConnect) {
      this.ensureGlobalConnectionManager();
      if (statusComponent.controller) {
        this.globalConnectionManager.register(statusComponent.controller);
      }
    }
    
    return id;
  }

  /**
   * Unregister a status component
   */
  unregister(id) {
    const component = this.components.get(id);
    if (component) {
      if (this.globalConnectionManager && component.controller) {
        this.globalConnectionManager.unregister(component.controller);
      }
      this.components.delete(id);
    }
  }

  /**
   * Ensure global connection manager exists
   */
  ensureGlobalConnectionManager() {
    if (!this.globalConnectionManager) {
      this.globalConnectionManager = new ConnectionManagerController({
        checkInterval: 5000,
        endpoint: '/api/health',
        autoStart: true
      });
    }
  }

  /**
   * Get all components of a specific type
   */
  getByType(type) {
    return Array.from(this.components.values()).filter(
      component => component.options.type === type
    );
  }

  /**
   * Update all components with new status
   */
  updateAll(status, metadata = {}) {
    this.components.forEach(component => {
      component.updateStatus(status, metadata);
    });
  }

  /**
   * Generate unique ID
   */
  generateId() {
    return 'status_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Get global connection stats
   */
  getGlobalStats() {
    if (this.globalConnectionManager) {
      return this.globalConnectionManager.getStats();
    }
    return null;
  }

  /**
   * Destroy all components
   */
  destroy() {
    this.components.forEach(component => {
      component.destroy();
    });
    this.components.clear();
    
    if (this.globalConnectionManager) {
      this.globalConnectionManager.destroy();
      this.globalConnectionManager = null;
    }
  }
}

// ================================
// Factory Functions
// ================================

/**
 * Create status indicator
 */
export function createStatusIndicator(options = {}) {
  return new RealTimeStatus({
    type: 'status-indicator',
    ...options
  });
}

/**
 * Create connection banner
 */
export function createConnectionBanner(options = {}) {
  return new RealTimeStatus({
    type: 'connection-banner',
    ...options
  });
}

/**
 * Create order status
 */
export function createOrderStatus(orderData, options = {}) {
  return new RealTimeStatus({
    type: 'order-status',
    orderData,
    ...options
  });
}

/**
 * Create trading session
 */
export function createTradingSession(options = {}) {
  return new RealTimeStatus({
    type: 'trading-session',
    ...options
  });
}

/**
 * Create status list
 */
export function createStatusList(options = {}) {
  return new RealTimeStatus({
    type: 'status-list',
    ...options
  });
}

// Export main class and utilities
export default RealTimeStatus;
export { RealTimeStatusManager };

// Export configuration constants
export {
  STATUS_TYPES,
  STATUS_CONFIGS,
  TRADING_PORTAL_PRESETS,
  EVENT_TYPES
};

// Create global instances for easy access
if (typeof window !== 'undefined') {
  window.TamylaRealTimeStatus = RealTimeStatus;
  window.TamylaStatusManager = new RealTimeStatusManager();
  
  // Export factory functions globally
  window.createStatusIndicator = createStatusIndicator;
  window.createConnectionBanner = createConnectionBanner;
  window.createOrderStatus = createOrderStatus;
  window.createTradingSession = createTradingSession;
  window.createStatusList = createStatusList;
}
