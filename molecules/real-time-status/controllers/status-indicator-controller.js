/**
 * Status Indicator Controller
 * Handles core status indicator functionality
 */

import {
  STATUS_CONFIGS,
  EVENT_TYPES,
  validateConfig,
  getStatusConfig
} from '../config/status-config.js';

export default class StatusIndicatorController {
  constructor(options = {}) {
    // Validate and merge configuration
    const validation = validateConfig(options, 'statusIndicator');
    if (!validation.isValid) {
      throw new Error(`Invalid configuration: ${validation.errors.join(', ')}`);
    }

    this.options = validation.config;
    this.element = null;
    this.currentStatus = this.options.status;
    this.listeners = new Map();
    this.intervalId = null;
    this.initialized = false;

    this.initialize();
  }

  /**
   * Initialize the status indicator
   */
  async initialize() {
    if (this.initialized) return;

    try {
      // Load template
      this.element = await this.createIndicatorElement();

      // Set initial status
      this.updateStatus(this.currentStatus, { notifyChange: false });

      // Setup timestamp updates if enabled
      if (this.options.showTimestamp && this.options.updateInterval) {
        this.startTimestampUpdates();
      }

      // Bind events
      this.bindEvents();

      this.initialized = true;
      this.emit(EVENT_TYPES.COMPONENT_INITIALIZED, { controller: this });

    } catch (error) {
      console.error('Failed to initialize status indicator:', error);
      this.emit(EVENT_TYPES.COMPONENT_ERROR, { error, controller: this });
      throw error;
    }
  }

  /**
   * Create indicator element from template
   */
  async createIndicatorElement() {
    try {
      // Try to load external template
      const response = await fetch('/ui-components/molecules/real-time-status/templates/status-indicator.html');
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
   * Create fallback element if template loading fails
   */
  createFallbackElement() {
    const indicator = document.createElement('div');
    indicator.className = 'tmyl-status-indicator';
    indicator.setAttribute('data-testid', 'status-indicator');

    indicator.innerHTML = `
      <div class="status-content">
        <span class="status-icon" data-testid="status-icon"></span>
        <span class="status-text" data-testid="status-text"></span>
        <span class="status-timestamp" data-testid="status-timestamp"></span>
      </div>
      <div class="status-pulse-ring" data-testid="pulse-ring"></div>
      <div class="status-tooltip" data-testid="status-tooltip" role="tooltip">
        <div class="tooltip-content">
          <div class="tooltip-title"></div>
          <div class="tooltip-details"></div>
          <div class="tooltip-timestamp"></div>
        </div>
        <div class="tooltip-arrow"></div>
      </div>
    `;

    return indicator;
  }

  /**
   * Bind event handlers
   */
  bindEvents() {
    if (!this.element) return;

    // Handle hover for tooltips
    this.element.addEventListener('mouseenter', () => {
      this.updateTooltip();
    });

    // Handle click events
    this.element.addEventListener('click', (event) => {
      this.emit(EVENT_TYPES.STATUS_UPDATE, {
        status: this.currentStatus,
        element: this.element,
        controller: this,
        originalEvent: event
      });
    });

    // Handle keyboard navigation
    this.element.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.element.click();
      }
    });
  }

  /**
   * Update status
   */
  updateStatus(newStatus, options = {}) {
    const { animated = this.options.animated, notifyChange = true } = options;

    if (!STATUS_CONFIGS[newStatus]) {
      console.warn(`Unknown status: ${newStatus}`);
      return false;
    }

    const oldStatus = this.currentStatus;
    const config = getStatusConfig(newStatus);

    // Update internal state
    this.currentStatus = newStatus;

    if (!this.element) return false;

    // Update element attributes and classes
    this.element.setAttribute('data-status', newStatus);
    this.element.classList.add(`size-${this.options.size}`);

    if (this.options.className) {
      this.element.classList.add(this.options.className);
    }

    // Toggle pulse animation
    this.element.classList.toggle('pulsing', config.pulse && animated);

    // Update content elements
    this.updateContentElements(config);

    // Update CSS custom properties
    this.updateStyles(config);

    // Add change animation
    if (animated && oldStatus !== newStatus) {
      this.playChangeAnimation();
    }

    // Update tooltip
    this.updateTooltip();

    // Notify change
    if (notifyChange) {
      this.emit(EVENT_TYPES.STATUS_CHANGED, {
        oldStatus,
        newStatus,
        timestamp: new Date().toISOString(),
        element: this.element,
        controller: this
      });
    }

    return true;
  }

  /**
   * Update content elements
   */
  updateContentElements(config) {
    const iconEl = this.element.querySelector('.status-icon');
    const textEl = this.element.querySelector('.status-text');
    const timestampEl = this.element.querySelector('.status-timestamp');

    // Update icon
    if (iconEl && this.options.showIcon) {
      iconEl.textContent = config.icon;
      iconEl.style.display = '';
    } else if (iconEl) {
      iconEl.style.display = 'none';
    }

    // Update text
    if (textEl && this.options.showText) {
      textEl.textContent = config.text;
      textEl.style.display = '';
    } else if (textEl) {
      textEl.style.display = 'none';
    }

    // Update timestamp
    if (timestampEl && this.options.showTimestamp) {
      timestampEl.textContent = new Date().toLocaleTimeString();
      timestampEl.style.display = '';
    } else if (timestampEl) {
      timestampEl.style.display = 'none';
    }
  }

  /**
   * Update CSS custom properties
   */
  updateStyles(config) {
    this.element.style.setProperty('--status-color', config.color);
    this.element.style.setProperty('--status-bg', config.bgColor);
    this.element.style.setProperty('--status-border', config.borderColor);
  }

  /**
   * Play change animation
   */
  playChangeAnimation() {
    this.element.classList.add('status-changing');
    setTimeout(() => {
      this.element.classList.remove('status-changing');
    }, 300);
  }

  /**
   * Update tooltip content
   */
  updateTooltip() {
    const tooltip = this.element.querySelector('.status-tooltip');
    if (!tooltip) return;

    const config = getStatusConfig(this.currentStatus);
    const titleEl = tooltip.querySelector('.tooltip-title');
    const detailsEl = tooltip.querySelector('.tooltip-details');
    const timestampEl = tooltip.querySelector('.tooltip-timestamp');

    if (titleEl) {
      titleEl.textContent = `Status: ${config.text}`;
    }

    if (detailsEl) {
      detailsEl.textContent = `Category: ${config.category || 'Unknown'}`;
    }

    if (timestampEl) {
      timestampEl.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
    }
  }

  /**
   * Start timestamp updates
   */
  startTimestampUpdates() {
    this.stopTimestampUpdates(); // Clear any existing interval

    this.intervalId = setInterval(() => {
      const timestampEl = this.element?.querySelector('.status-timestamp');
      if (timestampEl && this.options.showTimestamp) {
        timestampEl.textContent = new Date().toLocaleTimeString();
      }

      // Update tooltip timestamp
      this.updateTooltip();
    }, this.options.updateInterval);
  }

  /**
   * Stop timestamp updates
   */
  stopTimestampUpdates() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Get current state
   */
  getState() {
    return {
      status: this.currentStatus,
      config: getStatusConfig(this.currentStatus),
      options: { ...this.options },
      initialized: this.initialized,
      element: this.element
    };
  }

  /**
   * Update options
   */
  updateOptions(newOptions) {
    const validation = validateConfig({ ...this.options, ...newOptions }, 'statusIndicator');
    if (!validation.isValid) {
      throw new Error(`Invalid options: ${validation.errors.join(', ')}`);
    }

    const oldOptions = { ...this.options };
    this.options = validation.config;

    // Re-apply current status with new options
    if (this.element) {
      this.updateStatus(this.currentStatus, { notifyChange: false });

      // Update timestamp interval if changed
      if (oldOptions.updateInterval !== this.options.updateInterval) {
        if (this.options.showTimestamp && this.options.updateInterval) {
          this.startTimestampUpdates();
        } else {
          this.stopTimestampUpdates();
        }
      }
    }
  }

  /**
   * Set custom tooltip content
   */
  setTooltip(title, details) {
    const tooltip = this.element?.querySelector('.status-tooltip');
    if (!tooltip) return false;

    const titleEl = tooltip.querySelector('.tooltip-title');
    const detailsEl = tooltip.querySelector('.tooltip-details');

    if (titleEl) titleEl.textContent = title;
    if (detailsEl) detailsEl.textContent = details;

    return true;
  }

  /**
   * Show/hide tooltip
   */
  showTooltip(show = true) {
    const tooltip = this.element?.querySelector('.status-tooltip');
    if (!tooltip) return false;

    tooltip.style.opacity = show ? '1' : '0';
    tooltip.style.visibility = show ? 'visible' : 'hidden';

    return true;
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
    this.stopTimestampUpdates();

    if (this.element) {
      this.element.remove();
      this.element = null;
    }

    this.listeners.clear();
    this.initialized = false;

    this.emit(EVENT_TYPES.COMPONENT_DESTROYED, { controller: this });
  }
}
