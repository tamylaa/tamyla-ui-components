

/**
 * Modal Controller
 * Manages modal state and behavior
 */

export class ModalController {
  constructor(options = {}) {
    this.options = {
      size: 'md',
      type: 'default',
      showClose: true,
      closeOnBackdrop: true,
      closeOnEscape: true,
      focusTrap: true,
      restoreFocus: true,
      onOpen: null,
      onClose: null,
      ...options
    };

    this.state = {
      isOpen: false,
      isLoading: false,
      lastFocusedElement: null
    };

    this.element = null;
    this.backdrop = null;
    this.setupEventListeners();
  }

  /**
   * Initialize the controller with an element
   */
  initialize(element) {
    this.element = element;
    this.setupElementEventListeners();
  }

  /**
   * Setup element-specific event listeners
   */
  setupElementEventListeners() {
    if (!this.element) return;

    // Close button event listener
    const closeButton = this.element.querySelector('.tmyl-modal-close, [data-modal-close]');
    if (closeButton && this.options.showClose) {
      closeButton.addEventListener('click', () => this.close());
    }
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Close on escape key
    if (this.options.closeOnEscape) {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.state.isOpen) {
          this.close();
        }
      });
    }
  }

  /**
   * Open the modal
   */
  open() {
    if (this.state.isOpen) return;

    // Store last focused element for focus restoration
    if (this.options.restoreFocus) {
      this.state.lastFocusedElement = document.activeElement;
    }

    this.state.isOpen = true;

    // Create backdrop if needed
    if (this.options.closeOnBackdrop) {
      this.createBackdrop();
    }

    // Focus trap setup
    if (this.options.focusTrap) {
      this.setupFocusTrap();
    }

    // Call onOpen callback
    if (this.options.onOpen) {
      this.options.onOpen();
    }
  }

  /**
   * Close the modal
   */
  close() {
    if (!this.state.isOpen) return;

    this.state.isOpen = false;

    // Remove backdrop
    if (this.backdrop) {
      this.backdrop.remove();
      this.backdrop = null;
    }

    // Restore focus
    if (this.options.restoreFocus && this.state.lastFocusedElement) {
      this.state.lastFocusedElement.focus();
    }

    // Call onClose callback
    if (this.options.onClose) {
      this.options.onClose();
    }
  }

  /**
   * Create backdrop element
   */
  createBackdrop() {
    this.backdrop = document.createElement('div');
    this.backdrop.className = 'tmyl-modal-backdrop';
    this.backdrop.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    this.backdrop.addEventListener('click', () => {
      if (this.options.closeOnBackdrop) {
        this.close();
      }
    });

    document.body.appendChild(this.backdrop);
  }

  /**
   * Setup focus trap
   */
  setupFocusTrap() {
    // Basic focus trap implementation
    const focusableElements = this.element?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements && focusableElements.length > 0) {
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      this.element?.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement.focus();
              e.preventDefault();
            }
          }
        }
      });
    }
  }

  /**
   * Set modal element reference
   */
  setElement(element) {
    this.element = element;
  }

  /**
   * Get current state
   */
  getState() {
    return { ...this.state };
  }

  /**
   * Set modal content
   */
  setContent(content) {
    if (this.element) {
      const contentElement = this.element.querySelector('.tmyl-modal-content, .tmyl-modal-body');
      if (contentElement) {
        if (typeof content === 'string') {
          contentElement.innerHTML = content;
        } else if (content instanceof HTMLElement) {
          contentElement.innerHTML = '';
          contentElement.appendChild(content);
        }
      }
    }
  }

  /**
   * Set modal title
   */
  setTitle(title) {
    if (this.element) {
      const titleElement = this.element.querySelector('.tmyl-modal-title, .tmyl-modal-header h2');
      if (titleElement) {
        titleElement.textContent = title;
      }
    }
  }

  /**
   * Set loading state
   */
  setLoading(loading) {
    this.state.isLoading = loading;
  }

  /**
   * Destroy controller
   */
  destroy() {
    this.close();
    // Clean up event listeners if needed
  }
}