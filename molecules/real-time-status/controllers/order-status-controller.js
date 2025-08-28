/**
 * Order Status Controller
 * Handles order tracking and status updates
 */

import {
  STATUS_TYPES,
  EVENT_TYPES,
  validateConfig,
  getStatusConfig
} from '../config/status-config.js';

export default class OrderStatusController {
  constructor(orderData = {}, options = {}) {
    // Validate and merge configuration
    const validation = validateConfig(options, 'orderStatus');
    if (!validation.isValid) {
      throw new Error(`Invalid configuration: ${validation.errors.join(', ')}`);
    }

    this.options = validation.config;
    this.orderData = this._validateOrderData(orderData);
    this.element = null;
    this.listeners = new Map();
    this.refreshIntervalId = null;
    this.initialized = false;

    this.initialize();
  }

  /**
   * Validate order data
   */
  _validateOrderData(data) {
    const defaults = {
      id: 'ORD-' + Date.now(),
      symbol: 'UNKNOWN',
      type: 'market',
      side: 'buy',
      quantity: 0,
      price: 0,
      filledQuantity: 0,
      status: STATUS_TYPES.PENDING,
      timestamp: new Date().toISOString(),
      metadata: {}
    };

    return { ...defaults, ...data };
  }

  /**
   * Initialize the order status component
   */
  async initialize() {
    if (this.initialized) return;

    try {
      // Load template
      this.element = await this.createOrderElement();

      // Set initial status and data
      this.updateOrderData(this.orderData, { notifyChange: false });

      // Setup auto refresh if enabled
      if (this.options.autoRefresh && this.options.refreshInterval) {
        this.startAutoRefresh();
      }

      // Bind events
      this.bindEvents();

      this.initialized = true;
      this.emit(EVENT_TYPES.COMPONENT_INITIALIZED, { controller: this });

    } catch (error) {
      console.error('Failed to initialize order status:', error);
      this.emit(EVENT_TYPES.COMPONENT_ERROR, { error, controller: this });
      throw error;
    }
  }

  /**
   * Create order element from template
   */
  async createOrderElement() {
    try {
      const response = await fetch('/ui-components/molecules/real-time-status/templates/order-status.html');
      const templateHtml = await response.text();

      const template = document.createElement('template');
      template.innerHTML = templateHtml;

      return template.content.firstElementChild.cloneNode(true);

    } catch (error) {
      console.warn('Failed to load external template, using fallback');
      return this.createFallbackElement();
    }
  }

  /**
   * Create fallback element
   */
  createFallbackElement() {
    const order = document.createElement('div');
    order.className = 'tmyl-order-status';
    order.setAttribute('data-testid', 'order-status');

    order.innerHTML = `
      <div class="order-header">
        <div class="order-info">
          <span class="order-id" data-testid="order-id"></span>
          <span class="order-symbol" data-testid="order-symbol"></span>
        </div>
        <div class="order-status-badge">
          <span class="status-icon" data-testid="order-status-icon"></span>
          <span class="status-text" data-testid="order-status-text"></span>
        </div>
      </div>
      
      <div class="order-details">
        <div class="order-detail-row">
          <span class="detail-label">Type:</span>
          <span class="detail-value" data-testid="order-type"></span>
        </div>
        <div class="order-detail-row">
          <span class="detail-label">Quantity:</span>
          <span class="detail-value" data-testid="order-quantity"></span>
        </div>
        <div class="order-detail-row">
          <span class="detail-label">Price:</span>
          <span class="detail-value" data-testid="order-price"></span>
        </div>
        <div class="order-detail-row">
          <span class="detail-label">Time:</span>
          <span class="detail-value" data-testid="order-timestamp"></span>
        </div>
      </div>
      
      <div class="order-progress" data-testid="order-progress">
        <div class="progress-bar">
          <div class="progress-fill"></div>
        </div>
        <div class="progress-text">
          <span class="filled-amount" data-testid="filled-amount"></span>
          <span class="total-amount" data-testid="total-amount"></span>
        </div>
      </div>
      
      <div class="order-actions">
        <button class="order-action-btn cancel-btn" data-testid="cancel-order" type="button">
          <span class="btn-icon">❌</span>
          <span class="btn-text">Cancel</span>
        </button>
        <button class="order-action-btn modify-btn" data-testid="modify-order" type="button">
          <span class="btn-icon">✏️</span>
          <span class="btn-text">Modify</span>
        </button>
      </div>
    `;

    return order;
  }

  /**
   * Bind event handlers
   */
  bindEvents() {
    if (!this.element) return;

    // Cancel button
    const cancelBtn = this.element.querySelector('[data-testid="cancel-order"]');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        this.handleCancelOrder();
      });
    }

    // Modify button
    const modifyBtn = this.element.querySelector('[data-testid="modify-order"]');
    if (modifyBtn) {
      modifyBtn.addEventListener('click', () => {
        this.handleModifyOrder();
      });
    }

    // Order card click
    this.element.addEventListener('click', (event) => {
      if (!event.target.closest('.order-action-btn')) {
        this.emit(EVENT_TYPES.ORDER_PLACED, {
          order: this.orderData,
          element: this.element,
          controller: this,
          originalEvent: event
        });
      }
    });
  }

  /**
   * Update order data and display
   */
  updateOrderData(newData, options = {}) {
    const { notifyChange = true } = options;
    const oldData = { ...this.orderData };

    // Merge new data
    this.orderData = { ...this.orderData, ...newData };

    if (!this.element) return false;

    // Update element attributes
    this.element.setAttribute('data-status', this.orderData.status);
    this.element.setAttribute('data-order-id', this.orderData.id);

    // Update header information
    this.updateHeaderElements();

    // Update detail rows
    this.updateDetailElements();

    // Update progress
    this.updateProgressElements();

    // Update action buttons
    this.updateActionButtons();

    // Update status styling
    this.updateStatusStyling();

    // Notify change
    if (notifyChange && oldData.status !== this.orderData.status) {
      const eventType = this._getOrderEventType(this.orderData.status);
      this.emit(eventType, {
        oldData,
        newData: this.orderData,
        timestamp: new Date().toISOString(),
        element: this.element,
        controller: this
      });
    }

    return true;
  }

  /**
   * Update header elements
   */
  updateHeaderElements() {
    const orderIdEl = this.element.querySelector('[data-testid="order-id"]');
    const orderSymbolEl = this.element.querySelector('[data-testid="order-symbol"]');
    const statusIconEl = this.element.querySelector('[data-testid="order-status-icon"]');
    const statusTextEl = this.element.querySelector('[data-testid="order-status-text"]');

    const statusConfig = getStatusConfig(this.orderData.status);

    if (orderIdEl) orderIdEl.textContent = this.orderData.id;
    if (orderSymbolEl) orderSymbolEl.textContent = this.orderData.symbol;
    if (statusIconEl) statusIconEl.textContent = statusConfig.icon;
    if (statusTextEl) statusTextEl.textContent = statusConfig.text;
  }

  /**
   * Update detail elements
   */
  updateDetailElements() {
    const typeEl = this.element.querySelector('[data-testid="order-type"]');
    const quantityEl = this.element.querySelector('[data-testid="order-quantity"]');
    const priceEl = this.element.querySelector('[data-testid="order-price"]');
    const timestampEl = this.element.querySelector('[data-testid="order-timestamp"]');

    if (typeEl) {
      typeEl.textContent = `${this.orderData.side.toUpperCase()} ${this.orderData.type.toUpperCase()}`;
    }

    if (quantityEl) {
      quantityEl.textContent = this.orderData.quantity.toLocaleString();
    }

    if (priceEl) {
      const price = typeof this.orderData.price === 'number'
        ? this.orderData.price.toFixed(2)
        : this.orderData.price;
      priceEl.textContent = `$${price}`;
    }

    if (timestampEl) {
      timestampEl.textContent = new Date(this.orderData.timestamp).toLocaleTimeString();
    }
  }

  /**
   * Update progress elements
   */
  updateProgressElements() {
    if (!this.options.showProgress) {
      const progressEl = this.element.querySelector('[data-testid="order-progress"]');
      if (progressEl) progressEl.style.display = 'none';
      return;
    }

    const progressFillEl = this.element.querySelector('.progress-fill');
    const filledAmountEl = this.element.querySelector('[data-testid="filled-amount"]');
    const totalAmountEl = this.element.querySelector('[data-testid="total-amount"]');

    const fillPercentage = this.orderData.quantity > 0
      ? (this.orderData.filledQuantity / this.orderData.quantity) * 100
      : 0;

    if (progressFillEl) {
      progressFillEl.style.width = `${fillPercentage}%`;
    }

    if (filledAmountEl) {
      filledAmountEl.textContent = this.orderData.filledQuantity.toLocaleString();
    }

    if (totalAmountEl) {
      totalAmountEl.textContent = this.orderData.quantity.toLocaleString();
    }
  }

  /**
   * Update action buttons
   */
  updateActionButtons() {
    const cancelBtn = this.element.querySelector('[data-testid="cancel-order"]');
    const modifyBtn = this.element.querySelector('[data-testid="modify-order"]');

    if (!this.options.showActions) {
      const actionsEl = this.element.querySelector('.order-actions');
      if (actionsEl) actionsEl.style.display = 'none';
      return;
    }

    // Cancel button state
    if (cancelBtn) {
      const canCancel = this.options.allowCancel &&
        [STATUS_TYPES.PENDING, STATUS_TYPES.CONNECTING].includes(this.orderData.status);
      cancelBtn.disabled = !canCancel;
      cancelBtn.style.opacity = canCancel ? '1' : '0.5';
    }

    // Modify button state
    if (modifyBtn) {
      const canModify = this.options.allowModify &&
        [STATUS_TYPES.PENDING].includes(this.orderData.status);
      modifyBtn.disabled = !canModify;
      modifyBtn.style.opacity = canModify ? '1' : '0.5';
    }
  }

  /**
   * Update status styling
   */
  updateStatusStyling() {
    const statusConfig = getStatusConfig(this.orderData.status);
    const badge = this.element.querySelector('.order-status-badge');

    if (badge) {
      badge.style.setProperty('--status-color', statusConfig.color);
      badge.style.setProperty('--status-bg', statusConfig.bgColor);
      badge.style.setProperty('--status-border', statusConfig.borderColor);
    }
  }

  /**
   * Get order event type based on status
   */
  _getOrderEventType(status) {
    switch (status) {
    case STATUS_TYPES.PENDING:
      return EVENT_TYPES.ORDER_PLACED;
    case STATUS_TYPES.FILLED:
      return EVENT_TYPES.ORDER_FILLED;
    case STATUS_TYPES.CANCELLED:
      return EVENT_TYPES.ORDER_CANCELLED;
    case STATUS_TYPES.REJECTED:
      return EVENT_TYPES.ORDER_REJECTED;
    default:
      return EVENT_TYPES.STATUS_UPDATE;
    }
  }

  /**
   * Handle cancel order action
   */
  handleCancelOrder() {
    if (!this.options.allowCancel) return;

    this.emit(EVENT_TYPES.ORDER_CANCELLED, {
      order: this.orderData,
      action: 'cancel',
      controller: this
    });
  }

  /**
   * Handle modify order action
   */
  handleModifyOrder() {
    if (!this.options.allowModify) return;

    this.emit(EVENT_TYPES.ORDER_MODIFIED, {
      order: this.orderData,
      action: 'modify',
      controller: this
    });
  }

  /**
   * Start auto refresh
   */
  startAutoRefresh() {
    this.stopAutoRefresh();

    this.refreshIntervalId = setInterval(() => {
      this.emit(EVENT_TYPES.STATUS_UPDATE, {
        order: this.orderData,
        action: 'refresh',
        controller: this
      });
    }, this.options.refreshInterval);
  }

  /**
   * Stop auto refresh
   */
  stopAutoRefresh() {
    if (this.refreshIntervalId) {
      clearInterval(this.refreshIntervalId);
      this.refreshIntervalId = null;
    }
  }

  /**
   * Update order status
   */
  updateStatus(newStatus, metadata = {}) {
    this.updateOrderData({
      status: newStatus,
      ...metadata,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Get current state
   */
  getState() {
    return {
      order: { ...this.orderData },
      options: { ...this.options },
      initialized: this.initialized,
      autoRefreshing: !!this.refreshIntervalId,
      element: this.element
    };
  }

  /**
   * Update options
   */
  updateOptions(newOptions) {
    const validation = validateConfig({ ...this.options, ...newOptions }, 'orderStatus');
    if (!validation.isValid) {
      throw new Error(`Invalid options: ${validation.errors.join(', ')}`);
    }

    this.options = validation.config;

    // Re-apply display with new options
    if (this.element) {
      this.updateOrderData(this.orderData, { notifyChange: false });

      // Update auto refresh
      if (this.options.autoRefresh && this.options.refreshInterval) {
        this.startAutoRefresh();
      } else {
        this.stopAutoRefresh();
      }
    }
  }

  /**
   * Get element for DOM insertion
   */
  getElement() {
    return this.element;
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
    this.stopAutoRefresh();

    if (this.element) {
      this.element.remove();
      this.element = null;
    }

    this.listeners.clear();
    this.initialized = false;

    this.emit(EVENT_TYPES.COMPONENT_DESTROYED, { controller: this });
  }
}
