/**
 * Notification Molecule Controller
 * Complete notification behavior management with timing and stacking
 */

export class NotificationController {
  constructor(props = {}) {
    this.props = {
      // Notification configuration
      type: 'info',
      title: '',
      message: '',
      duration: 4000,
      position: 'top-right',
      
      // Behavior
      showClose: true,
      showProgress: true,
      pauseOnHover: true,
      autoDismiss: true,
      
      // Actions
      actions: [],
      
      // Event handlers
      onShow: null,
      onHide: null,
      onClick: null,
      onAction: null,
      
      ...props
    };

    this.state = {
      isVisible: false,
      isExiting: false,
      isPaused: false,
      timeRemaining: this.props.duration
    };

    this.element = null;
    this.container = null;
    this.dismissTimer = null;
    this.startTime = null;
    this.pausedTime = null;
  }

  /**
   * Initialize notification controller
   */
  initialize(element) {
    this.element = element;
    this.setupEventListeners();
    this.setupProgressTracking();
    return this;
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    if (!this.element) return;

    // Close button
    const closeButton = this.element.querySelector('[data-notification-close]');
    if (closeButton) {
      closeButton.addEventListener('click', this.hide.bind(this));
    }

    // Action buttons
    const actionButtons = this.element.querySelectorAll('[data-notification-action]');
    actionButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const action = e.currentTarget.dataset.notificationAction;
        this.handleAction(action, e);
      });
    });

    // Click handler for entire notification
    this.element.addEventListener('click', (e) => {
      // Don't trigger if clicking on buttons
      if (e.target.tagName === 'BUTTON') return;
      
      if (this.props.onClick) {
        this.props.onClick(e);
      }
    });

    // Pause on hover
    if (this.props.pauseOnHover) {
      this.element.addEventListener('mouseenter', this.pause.bind(this));
      this.element.addEventListener('mouseleave', this.resume.bind(this));
    }

    // Keyboard accessibility
    this.element.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  /**
   * Setup progress tracking for auto-dismiss
   */
  setupProgressTracking() {
    if (!this.props.autoDismiss || this.props.duration <= 0) return;

    const progressBar = this.element?.querySelector('.tmyl-notification__progress');
    if (progressBar) {
      // Reset animation
      progressBar.style.animation = 'none';
      progressBar.offsetHeight; // Trigger reflow
      progressBar.style.animation = `notificationProgress ${this.props.duration}ms linear forwards`;
    }
  }

  /**
   * Handle keyboard navigation
   */
  handleKeyDown(event) {
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        this.hide();
        break;
      case 'Enter':
      case ' ':
        // Handle Enter/Space on action buttons
        const activeElement = document.activeElement;
        if (activeElement && activeElement.hasAttribute('data-notification-action')) {
          activeElement.click();
        }
        break;
    }
  }

  /**
   * Handle action button clicks
   */
  handleAction(action, event) {
    if (this.props.onAction) {
      const result = this.props.onAction(action, event);
      
      // If onAction returns false, don't hide notification
      if (result === false) {
        return;
      }
    }

    // Auto-hide after action (unless prevented)
    this.hide();
  }

  /**
   * Show notification
   */
  show() {
    if (this.state.isVisible) return this;

    this.setState({ isVisible: true, isExiting: false });

    if (this.element) {
      this.element.classList.add('tmyl-notification--entering');
      this.element.classList.remove('tmyl-notification--exiting');
    }

    // Start auto-dismiss timer
    if (this.props.autoDismiss && this.props.duration > 0) {
      this.startDismissTimer();
    }

    // Trigger show event
    if (this.props.onShow) {
      this.props.onShow();
    }

    return this;
  }

  /**
   * Hide notification with animation
   */
  async hide() {
    if (!this.state.isVisible || this.state.isExiting) return this;

    this.setState({ isExiting: true });

    // Clear dismiss timer
    this.clearDismissTimer();

    // Add exit animation
    if (this.element) {
      this.element.classList.add('tmyl-notification--exiting');
      this.element.classList.remove('tmyl-notification--entering');
    }

    // Wait for animation to complete
    await new Promise(resolve => setTimeout(resolve, 200));

    // Actually hide notification
    this.setState({ isVisible: false, isExiting: false });

    // Remove from DOM
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }

    // Trigger hide event
    if (this.props.onHide) {
      this.props.onHide();
    }

    return this;
  }

  /**
   * Pause auto-dismiss timer
   */
  pause() {
    if (!this.props.autoDismiss || this.state.isPaused) return this;

    this.setState({ isPaused: true });
    this.pausedTime = Date.now();
    
    // Clear timer
    this.clearDismissTimer();

    // Pause CSS animation
    const progressBar = this.element?.querySelector('.tmyl-notification__progress');
    if (progressBar) {
      progressBar.style.animationPlayState = 'paused';
    }

    return this;
  }

  /**
   * Resume auto-dismiss timer
   */
  resume() {
    if (!this.props.autoDismiss || !this.state.isPaused) return this;

    this.setState({ isPaused: false });

    // Calculate remaining time
    if (this.pausedTime && this.startTime) {
      const elapsed = this.pausedTime - this.startTime;
      this.state.timeRemaining = Math.max(0, this.props.duration - elapsed);
    }

    // Resume timer with remaining time
    if (this.state.timeRemaining > 0) {
      this.startDismissTimer(this.state.timeRemaining);
    }

    // Resume CSS animation
    const progressBar = this.element?.querySelector('.tmyl-notification__progress');
    if (progressBar) {
      progressBar.style.animationPlayState = 'running';
      
      // Update animation duration to remaining time
      if (this.state.timeRemaining < this.props.duration) {
        progressBar.style.animationDuration = `${this.state.timeRemaining}ms`;
      }
    }

    return this;
  }

  /**
   * Start dismiss timer
   */
  startDismissTimer(duration = this.props.duration) {
    this.clearDismissTimer();
    this.startTime = Date.now();
    
    this.dismissTimer = setTimeout(() => {
      this.hide();
    }, duration);
  }

  /**
   * Clear dismiss timer
   */
  clearDismissTimer() {
    if (this.dismissTimer) {
      clearTimeout(this.dismissTimer);
      this.dismissTimer = null;
    }
  }

  /**
   * Update notification content
   */
  updateContent(props = {}) {
    // Update props
    Object.assign(this.props, props);

    // Update title
    if (props.title !== undefined) {
      const titleElement = this.element?.querySelector('.tmyl-notification__title');
      if (titleElement) {
        titleElement.textContent = props.title;
      }
    }

    // Update message
    if (props.message !== undefined) {
      const messageElement = this.element?.querySelector('.tmyl-notification__message');
      if (messageElement) {
        messageElement.textContent = props.message;
      }
    }

    // Update type
    if (props.type !== undefined) {
      const currentType = this.element?.dataset.notificationType;
      if (currentType && this.element) {
        this.element.classList.remove(`tmyl-notification--${currentType}`);
        this.element.classList.add(`tmyl-notification--${props.type}`);
        this.element.dataset.notificationType = props.type;
      }
    }

    return this;
  }

  /**
   * Extend auto-dismiss duration
   */
  extend(additionalTime = 2000) {
    if (!this.props.autoDismiss || this.state.isPaused) return this;

    // Clear current timer
    this.clearDismissTimer();

    // Calculate new duration
    const elapsed = this.startTime ? Date.now() - this.startTime : 0;
    const newDuration = Math.max(additionalTime, this.props.duration - elapsed + additionalTime);

    // Start new timer
    this.startDismissTimer(newDuration);

    return this;
  }

  /**
   * Make notification persistent (disable auto-dismiss)
   */
  persist() {
    this.props.autoDismiss = false;
    this.clearDismissTimer();

    // Hide progress bar
    const progressBar = this.element?.querySelector('.tmyl-notification__progress');
    if (progressBar) {
      progressBar.style.display = 'none';
    }

    return this;
  }

  /**
   * State management
   */
  setState(newState) {
    Object.assign(this.state, newState);
  }

  getState() {
    return { ...this.state };
  }

  /**
   * Get remaining time before auto-dismiss
   */
  getTimeRemaining() {
    if (!this.props.autoDismiss || this.state.isPaused) {
      return this.state.timeRemaining;
    }

    if (this.startTime) {
      const elapsed = Date.now() - this.startTime;
      return Math.max(0, this.props.duration - elapsed);
    }

    return this.props.duration;
  }

  /**
   * Cleanup
   */
  destroy() {
    this.clearDismissTimer();
    
    // Remove from DOM immediately
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    
    // Clear references
    this.element = null;
    this.container = null;
  }
}
