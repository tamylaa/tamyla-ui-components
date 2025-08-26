/**
 * Enhanced Status Indicator Component - Trading Portal Real-time Patterns
 * Professional status indicators with animations and semantic meaning
 */

import { designTokens } from '../../core/design-tokens.js';
import { sharedUtilities } from '../../core/shared-utilities.js';

/**
 * Status Indicator Factory - Creates professional status indicators
 */
export class StatusIndicatorFactory {
  constructor() {
    this.defaultProps = {
      status: 'pending',
      text: '',
      size: 'md',
      animated: true,
      showDot: true,
      showText: true,
      uppercase: true,
      interactive: false,
      analytics: false
    };

    // Trading Portal status types
    this.statusTypes = [
      'pending',     // Yellow - waiting/processing
      'filled',      // Green - completed successfully
      'cancelled',   // Red - cancelled/failed
      'rejected',    // Red - rejected/declined
      'active',      // Blue - currently active
      'inactive',    // Gray - inactive/disabled
      'warning',     // Orange - warning state
      'info',        // Light blue - informational
      'success',     // Green - success state
      'error',       // Red - error state
      'connecting',  // Animated - establishing connection
      'connected',   // Green - connected/online
      'disconnected' // Red - disconnected/offline
    ];

    this.sizes = ['xs', 'sm', 'md', 'lg'];

    // Ensure CSS is loaded
    this.ensureCSS();
  }

  /**
   * Ensure CSS is loaded
   */
  ensureCSS() {
    if (!document.querySelector('link[href*="tmyl-status-indicator.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = new URL('./styles/tmyl-status-indicator.css', import.meta.url).href;
      document.head.appendChild(link);
    }
  }

  /**
   * Create enhanced status indicator
   */
  create(props = {}) {
    const finalProps = { ...this.defaultProps, ...props };
    
    // Validate status type
    if (!this.statusTypes.includes(finalProps.status)) {
      console.warn(`Invalid status type: ${finalProps.status}. Using 'pending'.`);
      finalProps.status = 'pending';
    }

    // Create status container
    const statusElement = document.createElement('span');
    statusElement.className = this.buildStatusClasses(finalProps);
    
    // Set up accessibility
    this.setupAccessibility(statusElement, finalProps);
    
    // Create status structure
    statusElement.innerHTML = this.createStatusTemplate(finalProps);
    
    // Attach interactions if interactive
    if (finalProps.interactive) {
      this.attachInteractions(statusElement, finalProps);
    }
    
    return statusElement;
  }

  /**
   * Build CSS classes for the status indicator
   */
  buildStatusClasses(props) {
    return [
      'tmyl-status',
      `tmyl-status--${props.status}`,
      `tmyl-status--${props.size}`,
      props.animated && 'tmyl-status--animated',
      props.interactive && 'tmyl-status--interactive',
      !props.showText && 'tmyl-status--dot-only',
      props.uppercase && 'tmyl-status--uppercase'
    ].filter(Boolean).join(' ');
  }

  /**
   * Setup accessibility features
   */
  setupAccessibility(element, props) {
    element.setAttribute('role', 'status');
    element.setAttribute('aria-live', 'polite');
    
    const statusText = props.text || this.getDefaultStatusText(props.status);
    element.setAttribute('aria-label', `Status: ${statusText}`);
    
    if (props.interactive) {
      element.setAttribute('tabindex', '0');
      element.setAttribute('role', 'button');
    }
  }

  /**
   * Get default text for status type
   */
  getDefaultStatusText(status) {
    const statusTexts = {
      pending: 'Pending',
      filled: 'Filled',
      cancelled: 'Cancelled',
      rejected: 'Rejected',
      active: 'Active',
      inactive: 'Inactive',
      warning: 'Warning',
      info: 'Info',
      success: 'Success',
      error: 'Error',
      connecting: 'Connecting',
      connected: 'Connected',
      disconnected: 'Disconnected'
    };
    
    return statusTexts[status] || status;
  }

  /**
   * Create status HTML template
   */
  createStatusTemplate(props) {
    const statusText = props.text || this.getDefaultStatusText(props.status);
    
    return `
      ${props.showDot ? `
        <span class="tmyl-status__dot" aria-hidden="true"></span>
      ` : ''}
      
      ${props.showText ? `
        <span class="tmyl-status__text">${statusText}</span>
      ` : ''}
      
      ${props.status === 'connecting' ? `
        <span class="tmyl-status__spinner" aria-hidden="true"></span>
      ` : ''}
    `;
  }

  /**
   * Attach interactions for interactive status indicators
   */
  attachInteractions(element, props) {
    // Click handling
    element.addEventListener('click', (e) => {
      if (props.analytics) {
        this.trackStatusClick(props);
      }
      
      if (props.onClick) {
        props.onClick(e);
      }
      
      // Custom event
      element.dispatchEvent(new CustomEvent('tmyl-status-click', {
        detail: { status: props.status, element }
      }));
    });

    // Keyboard interaction
    element.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        element.click();
      }
    });

    // Hover effects
    element.addEventListener('mouseenter', () => {
      element.classList.add('tmyl-status--hovering');
    });

    element.addEventListener('mouseleave', () => {
      element.classList.remove('tmyl-status--hovering');
    });
  }

  /**
   * Track status clicks for analytics
   */
  trackStatusClick(props) {
    if (window.tamylaAnalytics) {
      window.tamylaAnalytics.track('status_indicator_click', {
        status: props.status,
        text: props.text,
        timestamp: Date.now()
      });
    }
  }

  /**
   * Update status dynamically
   */
  updateStatus(element, newStatus, newText = null) {
    // Remove old status class
    const oldStatusClass = Array.from(element.classList).find(cls => cls.startsWith('tmyl-status--') && this.statusTypes.includes(cls.replace('tmyl-status--', '')));
    if (oldStatusClass) {
      element.classList.remove(oldStatusClass);
    }
    
    // Add new status class
    element.classList.add(`tmyl-status--${newStatus}`);
    
    // Update text if provided
    if (newText !== null) {
      const textElement = element.querySelector('.tmyl-status__text');
      if (textElement) {
        textElement.textContent = newText;
      }
    }
    
    // Update accessibility
    const statusText = newText || this.getDefaultStatusText(newStatus);
    element.setAttribute('aria-label', `Status: ${statusText}`);
    
    // Add update animation
    element.classList.add('tmyl-status--updating');
    setTimeout(() => {
      element.classList.remove('tmyl-status--updating');
    }, 300);
  }

  /**
   * Create status with pulse animation for real-time updates
   */
  createRealTime(props = {}) {
    return this.create({
      ...props,
      animated: true,
      status: props.status || 'connecting'
    });
  }

  /**
   * Shorthand creation methods for common statuses
   */
  createPending(props = {}) {
    return this.create({ ...props, status: 'pending' });
  }

  createSuccess(props = {}) {
    return this.create({ ...props, status: 'success' });
  }

  createError(props = {}) {
    return this.create({ ...props, status: 'error' });
  }

  createWarning(props = {}) {
    return this.create({ ...props, status: 'warning' });
  }

  createConnected(props = {}) {
    return this.create({ ...props, status: 'connected', animated: true });
  }

  createDisconnected(props = {}) {
    return this.create({ ...props, status: 'disconnected' });
  }

  /**
   * Create status badge for Trading Portal style
   */
  createBadge(props = {}) {
    return this.create({
      ...props,
      size: 'sm',
      uppercase: true,
      showDot: false
    });
  }
}

// Export factory instance
export const statusIndicatorFactory = new StatusIndicatorFactory();
