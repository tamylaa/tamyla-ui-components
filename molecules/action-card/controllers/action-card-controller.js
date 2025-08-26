/**
 * Action Card Controller
 * Handles interactions, state management, and business logic
 */

/**
 * Action Card Controller Class
 */
export class ActionCardController {
  constructor(element, props) {
    this.element = element;
    this.props = props;
    this.isDestroyed = false;
    
    this.init();
  }

  /**
   * Initialize controller
   */
  init() {
    this.setupAccessibility();
    this.attachEventListeners();
  }

  /**
   * Setup accessibility features
   */
  setupAccessibility() {
    this.element.setAttribute('role', this.props.interactive ? 'button' : 'article');
    this.element.setAttribute('tabindex', this.props.status === 'disabled' ? '-1' : '0');
    
    if (this.props.status === 'completed') {
      this.element.setAttribute('aria-label', `${this.props.title} - Completed`);
    } else if (this.props.status === 'locked') {
      this.element.setAttribute('aria-label', `${this.props.title} - Locked`);
      this.element.setAttribute('aria-disabled', 'true');
    }
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    if (!this.props.interactive || this.props.status === 'disabled' || this.props.status === 'locked') {
      return;
    }

    this.setupHoverEffects();
    this.setupClickHandling();
    this.setupKeyboardInteraction();
    this.setupFocusManagement();
  }

  /**
   * Setup hover effects
   */
  setupHoverEffects() {
    this.element.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
    this.element.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
  }

  /**
   * Setup click handling
   */
  setupClickHandling() {
    this.element.addEventListener('click', this.handleClick.bind(this));
  }

  /**
   * Setup keyboard interaction
   */
  setupKeyboardInteraction() {
    this.element.addEventListener('keydown', this.handleKeydown.bind(this));
  }

  /**
   * Setup focus management
   */
  setupFocusManagement() {
    this.element.addEventListener('focus', this.handleFocus.bind(this));
    this.element.addEventListener('blur', this.handleBlur.bind(this));
  }

  /**
   * Handle mouse enter
   */
  handleMouseEnter() {
    if (this.props.status === 'available') {
      this.element.classList.add('tmyl-action-card--hovering');
    }
  }

  /**
   * Handle mouse leave
   */
  handleMouseLeave() {
    this.element.classList.remove('tmyl-action-card--hovering');
  }

  /**
   * Handle click events
   */
  handleClick(event) {
    if (this.props.status !== 'available') return;
    
    this.createRippleEffect(event);
    this.trackAnalytics();
    this.triggerCallbacks(event);
    this.dispatchCustomEvent(event);
  }

  /**
   * Handle keyboard events
   */
  handleKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.element.click();
    }
  }

  /**
   * Handle focus events
   */
  handleFocus() {
    this.element.classList.add('tmyl-action-card--focused');
  }

  /**
   * Handle blur events
   */
  handleBlur() {
    this.element.classList.remove('tmyl-action-card--focused');
  }

  /**
   * Create ripple effect on interaction
   */
  createRippleEffect(event) {
    const rippleContainer = this.element.querySelector('.tmyl-action-card__ripple-container');
    if (!rippleContainer) return;

    const ripple = document.createElement('span');
    ripple.className = 'tmyl-action-card__ripple';
    
    const rect = this.element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.5;
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    rippleContainer.appendChild(ripple);
    
    setTimeout(() => {
      if (!this.isDestroyed && ripple.parentNode) {
        ripple.remove();
      }
    }, 800);
  }

  /**
   * Track analytics
   */
  trackAnalytics() {
    if (this.props.analytics && window.tamylaAnalytics) {
      window.tamylaAnalytics.track('action_card_click', {
        title: this.props.title,
        status: this.props.status,
        color: this.props.color,
        reward: this.props.reward,
        timestamp: Date.now()
      });
    }
  }

  /**
   * Trigger callback functions
   */
  triggerCallbacks(event) {
    if (this.props.onClick) {
      this.props.onClick(event);
    }
  }

  /**
   * Dispatch custom event
   */
  dispatchCustomEvent(event) {
    this.element.dispatchEvent(new CustomEvent('tmyl-action-card-click', {
      detail: { props: this.props, element: this.element }
    }));
  }

  /**
   * Update progress
   */
  updateProgress(progress) {
    const progressFill = this.element.querySelector('.tmyl-action-card__progress-fill');
    const progressText = this.element.querySelector('.tmyl-action-card__progress-text');
    
    if (progressFill) {
      progressFill.style.width = progress + '%';
    }
    
    if (progressText) {
      progressText.textContent = `${progress}% complete`;
    }
    
    if (progress >= 100) {
      this.markAsCompleted();
    }
  }

  /**
   * Mark card as completed
   */
  markAsCompleted() {
    this.element.classList.remove('tmyl-action-card--available');
    this.element.classList.add('tmyl-action-card--completed');
    this.element.setAttribute('aria-label', this.element.querySelector('.tmyl-action-card__title').textContent + ' - Completed');
    
    this.element.classList.add('tmyl-action-card--completing');
    setTimeout(() => {
      if (!this.isDestroyed) {
        this.element.classList.remove('tmyl-action-card--completing');
      }
    }, 1000);
  }

  /**
   * Destroy controller and cleanup
   */
  destroy() {
    this.isDestroyed = true;
    // Event listeners will be automatically removed when element is removed from DOM
  }
}

/**
 * Action Card Utilities
 */
export const actionCardUtils = {
  /**
   * Build CSS classes for the card
   */
  buildCardClasses(props) {
    return [
      'tmyl-action-card',
      `tmyl-action-card--${props.status}`,
      `tmyl-action-card--${props.color}`,
      `tmyl-action-card--${props.size}`,
      props.interactive && 'tmyl-action-card--interactive',
      props.showProgress && 'tmyl-action-card--with-progress'
    ].filter(Boolean).join(' ');
  },

  /**
   * Validate props
   */
  validateProps(props) {
    const errors = [];
    
    if (!props.title) {
      errors.push('Title is required');
    }
    
    if (props.status && !['available', 'completed', 'locked', 'disabled'].includes(props.status)) {
      errors.push('Invalid status value');
    }
    
    if (props.color && !['primary', 'secondary', 'success', 'warning', 'info'].includes(props.color)) {
      errors.push('Invalid color value');
    }
    
    if (props.size && !['sm', 'md', 'lg'].includes(props.size)) {
      errors.push('Invalid size value');
    }
    
    return errors;
  }
};
