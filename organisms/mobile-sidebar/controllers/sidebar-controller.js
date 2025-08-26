/**
 * Sidebar Controller
 * Handles core sidebar functionality including animations, state management, and lifecycle
 */

import { 
  SIDEBAR_CONFIG, 
  ANIMATION_PRESETS, 
  RESPONSIVE_CONFIG, 
  VALIDATION_RULES, 
  EVENT_TYPES 
} from '../config/sidebar-config.js';

class SidebarController {
  constructor(options = {}) {
    this.options = {
      position: SIDEBAR_CONFIG.positions.LEFT,
      width: SIDEBAR_CONFIG.dimensions.DEFAULT_WIDTH,
      backdrop: true,
      closeOnBackdrop: SIDEBAR_CONFIG.behavior.CLOSE_ON_BACKDROP,
      closeOnEscape: SIDEBAR_CONFIG.behavior.CLOSE_ON_ESCAPE,
      closeOnNavigation: SIDEBAR_CONFIG.behavior.CLOSE_ON_NAVIGATION,
      animationDuration: SIDEBAR_CONFIG.animations.DURATION,
      animationEasing: SIDEBAR_CONFIG.animations.EASING,
      swipeGestures: SIDEBAR_CONFIG.behavior.SWIPE_GESTURES,
      swipeThreshold: SIDEBAR_CONFIG.behavior.SWIPE_THRESHOLD,
      focusManagement: SIDEBAR_CONFIG.behavior.FOCUS_MANAGEMENT,
      validateOptions: true,
      ...options
    };

    // State
    this.isOpen = false;
    this.isAnimating = false;
    this.isDestroyed = false;
    this.focusTrap = null;
    this.lastFocusedElement = null;

    // Elements
    this.overlay = null;
    this.sidebar = null;
    this.backdrop = null;

    // Event listeners storage
    this.listeners = new Map();
    this.eventHandlers = new Map();

    // Touch handling
    this.touchState = {
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      isDragging: false
    };

    // Initialize if options are valid
    if (this.options.validateOptions && !this.validateOptions()) {
      throw new Error('Invalid sidebar options');
    }

    this.initialize();
  }

  /**
   * Initialize the sidebar
   */
  initialize() {
    this.createSidebarStructure();
    this.attachEventListeners();
    this.setupResponsiveHandling();
    this.setupAccessibility();
    
    this.emit(EVENT_TYPES.SIDEBAR_OPENING, { controller: this });
  }

  /**
   * Create sidebar DOM structure
   */
  createSidebarStructure() {
    // Create overlay
    this.overlay = document.createElement('div');
    this.overlay.className = `tmyl-mobile-sidebar-overlay position-${this.options.position}`;
    this.overlay.style.display = 'none';

    // Create backdrop if enabled
    if (this.options.backdrop) {
      this.backdrop = document.createElement('div');
      this.backdrop.className = 'sidebar-backdrop';
      this.overlay.appendChild(this.backdrop);
    }

    // Create sidebar
    this.sidebar = document.createElement('nav');
    this.sidebar.className = `tmyl-mobile-sidebar sidebar-${this.options.position}`;
    this.sidebar.setAttribute('role', 'navigation');
    this.sidebar.setAttribute('aria-label', 'Mobile navigation');
    this.sidebar.setAttribute('aria-hidden', 'true');
    this.sidebar.style.width = this.options.width;

    // Create sidebar structure from template
    this.loadSidebarTemplate();

    this.overlay.appendChild(this.sidebar);
    document.body.appendChild(this.overlay);
  }

  /**
   * Load sidebar template
   */
  async loadSidebarTemplate() {
    try {
      const response = await fetch('/ui-components/organisms/mobile-sidebar/templates/sidebar-overlay.html');
      if (!response.ok) throw new Error('Template not found');
      
      const template = await response.text();
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = template;
      
      // Extract sidebar content
      const sidebarContent = tempDiv.querySelector('.tmyl-mobile-sidebar');
      if (sidebarContent) {
        this.sidebar.innerHTML = sidebarContent.innerHTML;
      }
    } catch (error) {
      console.warn('Failed to load sidebar template, using fallback');
      this.createFallbackTemplate();
    }
  }

  /**
   * Create fallback template
   */
  createFallbackTemplate() {
    this.sidebar.innerHTML = `
      <div class="sidebar-header">
        <div class="header-content"></div>
        <button class="sidebar-close" aria-label="Close sidebar" type="button">
          <span class="close-icon" aria-hidden="true">×</span>
        </button>
      </div>
      <div class="sidebar-body">
        <ul class="sidebar-nav" role="menubar"></ul>
      </div>
      <div class="sidebar-footer">
        <div class="footer-content"></div>
      </div>
    `;
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Close button
    const closeButton = this.sidebar.querySelector('.sidebar-close');
    if (closeButton) {
      this.addEventHandler(closeButton, 'click', () => this.close());
    }

    // Backdrop click
    if (this.options.closeOnBackdrop && this.backdrop) {
      this.addEventHandler(this.backdrop, 'click', () => this.close());
    }

    // Escape key
    if (this.options.closeOnEscape) {
      this.addEventHandler(document, 'keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
        }
      });
    }

    // Touch events for swipe gestures
    if (this.options.swipeGestures) {
      this.setupTouchEvents();
    }

    // Window resize
    this.addEventHandler(window, 'resize', () => {
      this.handleResize();
    });
  }

  /**
   * Setup touch events for swipe gestures
   */
  setupTouchEvents() {
    this.addEventHandler(this.sidebar, 'touchstart', (e) => {
      this.handleTouchStart(e);
    }, { passive: true });

    this.addEventHandler(this.sidebar, 'touchmove', (e) => {
      this.handleTouchMove(e);
    }, { passive: false });

    this.addEventHandler(this.sidebar, 'touchend', (e) => {
      this.handleTouchEnd(e);
    }, { passive: true });
  }

  /**
   * Handle touch start
   */
  handleTouchStart(e) {
    if (!this.isOpen) return;

    const touch = e.touches[0];
    this.touchState = {
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      currentY: touch.clientY,
      isDragging: false
    };
  }

  /**
   * Handle touch move
   */
  handleTouchMove(e) {
    if (!this.isOpen || e.touches.length !== 1) return;

    const touch = e.touches[0];
    this.touchState.currentX = touch.clientX;
    this.touchState.currentY = touch.clientY;

    const deltaX = this.touchState.currentX - this.touchState.startX;
    const deltaY = this.touchState.currentY - this.touchState.startY;

    // Check if this is a horizontal swipe
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      this.touchState.isDragging = true;
      
      // Prevent scrolling during drag
      e.preventDefault();
      
      // Check if swipe is in closing direction
      const isClosingSwipe = (this.options.position === 'left' && deltaX < -this.options.swipeThreshold) ||
                            (this.options.position === 'right' && deltaX > this.options.swipeThreshold);

      if (isClosingSwipe) {
        this.emit(EVENT_TYPES.SWIPE_DETECTED, { 
          direction: this.options.position === 'left' ? 'left' : 'right',
          deltaX,
          controller: this 
        });
      }
    }
  }

  /**
   * Handle touch end
   */
  handleTouchEnd(e) {
    if (!this.touchState.isDragging) return;

    const deltaX = this.touchState.currentX - this.touchState.startX;
    const isClosingSwipe = (this.options.position === 'left' && deltaX < -this.options.swipeThreshold) ||
                          (this.options.position === 'right' && deltaX > this.options.swipeThreshold);

    if (isClosingSwipe) {
      this.close();
    }

    this.touchState.isDragging = false;
  }

  /**
   * Setup responsive handling
   */
  setupResponsiveHandling() {
    this.updateResponsiveBehavior();
  }

  /**
   * Update responsive behavior based on screen size
   */
  updateResponsiveBehavior() {
    const width = window.innerWidth;
    const breakpoints = RESPONSIVE_CONFIG.breakpoints;

    if (width <= breakpoints.mobile) {
      this.sidebar.style.width = RESPONSIVE_CONFIG.sidebarWidths.mobile;
      this.options.closeOnNavigation = RESPONSIVE_CONFIG.behavior.autoCloseOnNavigation.mobile;
    } else if (width <= breakpoints.tablet) {
      this.sidebar.style.width = RESPONSIVE_CONFIG.sidebarWidths.tablet;
      this.options.closeOnNavigation = RESPONSIVE_CONFIG.behavior.autoCloseOnNavigation.tablet;
    } else {
      this.sidebar.style.width = this.options.width;
      this.options.closeOnNavigation = RESPONSIVE_CONFIG.behavior.autoCloseOnNavigation.desktop;
    }
  }

  /**
   * Handle window resize
   */
  handleResize() {
    this.updateResponsiveBehavior();
    this.emit(EVENT_TYPES.RESIZE_DETECTED, { 
      width: window.innerWidth,
      height: window.innerHeight,
      controller: this 
    });
  }

  /**
   * Setup accessibility features
   */
  setupAccessibility() {
    if (!this.options.focusManagement) return;

    // Create focus trap
    this.createFocusTrap();
  }

  /**
   * Create focus trap
   */
  createFocusTrap() {
    const focusableElements = this.sidebar.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    this.focusTrap = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };
  }

  /**
   * Open sidebar
   */
  async open() {
    if (this.isOpen || this.isAnimating || this.isDestroyed) {
      return false;
    }

    this.emit(EVENT_TYPES.SIDEBAR_OPENING, { controller: this });
    
    this.isAnimating = true;
    this.lastFocusedElement = document.activeElement;

    // Show overlay
    this.overlay.style.display = 'flex';
    this.sidebar.setAttribute('aria-hidden', 'false');

    // Force reflow
    this.overlay.offsetHeight;

    // Start animation
    await this.animateIn();

    this.isOpen = true;
    this.isAnimating = false;

    // Focus management
    if (this.options.focusManagement) {
      this.trapFocus();
      const firstFocusable = this.sidebar.querySelector('button, a, [tabindex]:not([tabindex="-1"])');
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }

    this.emit(EVENT_TYPES.SIDEBAR_OPENED, { controller: this });
    return true;
  }

  /**
   * Close sidebar
   */
  async close() {
    if (!this.isOpen || this.isAnimating || this.isDestroyed) {
      return false;
    }

    this.emit(EVENT_TYPES.SIDEBAR_CLOSING, { controller: this });

    this.isAnimating = true;

    // Release focus trap
    if (this.options.focusManagement) {
      this.releaseFocus();
    }

    // Start animation
    await this.animateOut();

    // Hide overlay
    this.overlay.style.display = 'none';
    this.sidebar.setAttribute('aria-hidden', 'true');

    this.isOpen = false;
    this.isAnimating = false;

    // Restore focus
    if (this.lastFocusedElement && this.options.focusManagement) {
      this.lastFocusedElement.focus();
      this.lastFocusedElement = null;
    }

    this.emit(EVENT_TYPES.SIDEBAR_CLOSED, { controller: this });
    return true;
  }

  /**
   * Toggle sidebar
   */
  async toggle() {
    return this.isOpen ? await this.close() : await this.open();
  }

  /**
   * Animate sidebar in
   */
  animateIn() {
    return new Promise((resolve) => {
      this.overlay.classList.add('opening');
      this.sidebar.classList.add('sliding-in');

      setTimeout(() => {
        this.overlay.classList.remove('opening');
        this.sidebar.classList.remove('sliding-in');
        this.overlay.classList.add('open');
        this.sidebar.classList.add('open');
        resolve();
      }, this.options.animationDuration);
    });
  }

  /**
   * Animate sidebar out
   */
  animateOut() {
    return new Promise((resolve) => {
      this.overlay.classList.remove('open');
      this.sidebar.classList.remove('open');
      this.overlay.classList.add('closing');
      this.sidebar.classList.add('sliding-out');

      setTimeout(() => {
        this.overlay.classList.remove('closing');
        this.sidebar.classList.remove('sliding-out');
        resolve();
      }, this.options.animationDuration);
    });
  }

  /**
   * Trap focus within sidebar
   */
  trapFocus() {
    if (this.focusTrap) {
      document.addEventListener('keydown', this.focusTrap);
    }
  }

  /**
   * Release focus trap
   */
  releaseFocus() {
    if (this.focusTrap) {
      document.removeEventListener('keydown', this.focusTrap);
    }
  }

  /**
   * Add event handler and store for cleanup
   */
  addEventHandler(element, event, handler, options = {}) {
    element.addEventListener(event, handler, options);
    
    if (!this.eventHandlers.has(element)) {
      this.eventHandlers.set(element, []);
    }
    
    this.eventHandlers.get(element).push({ event, handler, options });
  }

  /**
   * Validate options
   */
  validateOptions() {
    const rules = VALIDATION_RULES.sidebar;
    
    for (const [key, rule] of Object.entries(rules)) {
      const value = this.options[key];
      
      if (rule.required && value === undefined) {
        console.error(`Missing required option: ${key}`);
        return false;
      }
      
      if (value !== undefined) {
        if (rule.type && typeof value !== rule.type) {
          console.error(`Invalid type for ${key}: expected ${rule.type}`);
          return false;
        }
        
        if (rule.enum && !rule.enum.includes(value)) {
          console.error(`Invalid value for ${key}: must be one of ${rule.enum.join(', ')}`);
          return false;
        }
        
        if (rule.pattern && !rule.pattern.test(value)) {
          console.error(`Invalid format for ${key}`);
          return false;
        }
        
        if (rule.min && value < rule.min) {
          console.error(`${key} too small: minimum ${rule.min}`);
          return false;
        }
        
        if (rule.max && value > rule.max) {
          console.error(`${key} too large: maximum ${rule.max}`);
          return false;
        }
      }
    }
    
    return true;
  }

  /**
   * Get sidebar state
   */
  getState() {
    return {
      isOpen: this.isOpen,
      isAnimating: this.isAnimating,
      isDestroyed: this.isDestroyed,
      position: this.options.position,
      width: this.options.width
    };
  }

  /**
   * Update options
   */
  updateOptions(newOptions) {
    this.options = { ...this.options, ...newOptions };
    
    // Update responsive behavior if width changed
    if (newOptions.width) {
      this.updateResponsiveBehavior();
    }
    
    // Update animation settings
    if (newOptions.animationDuration) {
      this.sidebar.style.transitionDuration = `${newOptions.animationDuration}ms`;
    }
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
   * Destroy sidebar and cleanup
   */
  destroy() {
    if (this.isDestroyed) return;

    // Close if open
    if (this.isOpen) {
      this.close();
    }

    // Remove event listeners
    this.eventHandlers.forEach((handlers, element) => {
      handlers.forEach(({ event, handler, options }) => {
        element.removeEventListener(event, handler, options);
      });
    });

    // Release focus trap
    this.releaseFocus();

    // Remove from DOM
    if (this.overlay && this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
    }

    // Clear references
    this.overlay = null;
    this.sidebar = null;
    this.backdrop = null;
    this.eventHandlers.clear();
    this.listeners.clear();

    this.isDestroyed = true;
  }

  /**
   * Get elements for advanced customization
   */
  get elements() {
    return {
      overlay: this.overlay,
      sidebar: this.sidebar,
      backdrop: this.backdrop,
      header: this.sidebar?.querySelector('.sidebar-header'),
      body: this.sidebar?.querySelector('.sidebar-body'),
      footer: this.sidebar?.querySelector('.sidebar-footer'),
      nav: this.sidebar?.querySelector('.sidebar-nav')
    };
  }
}

export default SidebarController;
