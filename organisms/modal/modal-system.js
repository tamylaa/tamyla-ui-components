/**
 * Modal Organism System
 * Complete modal factory with atomic composition and accessibility
 */

import {
  createModalTemplate,
  createConfirmTemplate,
  createAlertTemplate,
  createFormModalTemplate,
  createLoadingModalTemplate,
  createActionButton
} from './modal-template.js';
import { ModalController } from './modal-controller.js';

/**
 * Modal Factory
 * Creates modular modal dialogs with separated concerns
 */
export function ModalFactory(props = {}) {
  const {
    // Modal configuration
    title = '',
    content = '',
    size = 'md', // sm, md, lg, xl, fullscreen
    type = 'default', // default, confirm, alert, form, loading
    showClose = true,

    // Behavior
    closeOnBackdrop = true,
    closeOnEscape = true,
    focusTrap = true,
    restoreFocus = true,

    // Actions
    actions = [],

    // Event handlers
    onOpen,
    onClose,
    onConfirm,
    onCancel,
    onSubmit,
    onAction,

    // Container
    container = document.body
  } = props;

  let element = null;
  let controller = null;

  /**
   * Factory API
   */
  const factory = {
    // Core methods
    render,
    open,
    close,
    destroy,

    // Content management
    setContent,
    setTitle,
    setActions,
    setLoading,

    // State management
    getController: () => controller,
    getElement: () => element,
    isOpen: () => controller?.getState().isOpen || false,

    // Convenience methods
    confirm: confirmAction,
    cancel: cancelAction
  };

  /**
   * Render the modal
   */
  function render(targetContainer = container) {
    if (!targetContainer) {
      console.error('Modal: No container provided');
      return factory;
    }

    // Create element based on type
    element = createElement();

    // Initialize controller
    controller = new ModalController({
      size,
      type,
      showClose,
      closeOnBackdrop,
      closeOnEscape,
      focusTrap,
      restoreFocus,
      onOpen,
      onClose,
      onConfirm,
      onCancel,
      onSubmit,
      onAction
    });

    controller.initialize(element);

    // Load CSS
    loadStyles();

    // Set initial content and actions
    if (content) setContent(content);
    if (actions.length > 0) setActions(actions);

    // Append to container
    if (typeof targetContainer === 'string') {
      targetContainer = document.querySelector(targetContainer);
    }

    if (targetContainer) {
      targetContainer.appendChild(element);
    }

    return factory;
  }

  /**
   * Create modal element
   */
  function createElement() {
    const modalElement = document.createElement('div');
    modalElement.className = 'tmyl-modal-container';
    modalElement.style.display = 'none';

    // Generate template based on type
    let template;
    switch (type) {
    case 'confirm':
      template = createConfirmTemplate(props);
      break;
    case 'alert':
      template = createAlertTemplate(props);
      break;
    case 'form':
      template = createFormModalTemplate(props);
      break;
    case 'loading':
      template = createLoadingModalTemplate(props);
      break;
    default:
      template = createModalTemplate({ title, size, type, showClose });
    }

    modalElement.innerHTML = template;
    return modalElement;
  }

  /**
   * Load component styles
   */
  function loadStyles() {
    const styleId = 'tmyl-modal-styles';

    if (!document.getElementById(styleId)) {
      const link = document.createElement('link');
      link.id = styleId;
      link.rel = 'stylesheet';
      link.href = new URL('./modal.css', import.meta.url).href;
      document.head.appendChild(link);
    }
  }

  /**
   * Open modal
   */
  function open() {
    if (controller) {
      controller.open();
    }
    return factory;
  }

  /**
   * Close modal
   */
  function close() {
    if (controller) {
      controller.close();
    }
    return factory;
  }

  /**
   * Set modal content
   */
  function setContent(newContent) {
    if (controller) {
      controller.setContent(newContent);
    }
    return factory;
  }

  /**
   * Set modal title
   */
  function setTitle(newTitle) {
    if (controller) {
      controller.setTitle(newTitle);
    }
    return factory;
  }

  /**
   * Set modal actions
   */
  function setActions(newActions) {
    if (controller) {
      controller.setActions(newActions);
    }
    return factory;
  }

  /**
   * Set loading state
   */
  function setLoading(loading = true) {
    if (controller) {
      controller.setLoading(loading);
    }
    return factory;
  }

  /**
   * Confirm action
   */
  function confirmAction(data = null) {
    if (controller) {
      controller.confirm(data);
    }
    return factory;
  }

  /**
   * Cancel action
   */
  function cancelAction() {
    if (controller) {
      controller.cancel();
    }
    return factory;
  }

  /**
   * Destroy modal
   */
  function destroy() {
    if (controller) {
      controller.destroy();
      controller = null;
    }

    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }

    element = null;
  }

  return factory;
}

/**
 * Convenience functions for common modal types
 */

/**
 * Show confirmation dialog
 */
export function showConfirm(options = {}) {
  const {
    title = 'Confirm Action',
    message = 'Are you sure?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'warning',
    onConfirm,
    onCancel
  } = options;

  const modal = ModalFactory({
    type: 'confirm',
    title,
    message,
    confirmText,
    cancelText,
    modalType: type,
    onConfirm: (data) => {
      const result = onConfirm ? onConfirm(data) : true;
      if (result !== false) {
        modal.destroy();
      }
      return result;
    },
    onCancel: () => {
      const result = onCancel ? onCancel() : true;
      if (result !== false) {
        modal.destroy();
      }
      return result;
    }
  });

  modal.render().open();
  return modal;
}

/**
 * Show alert dialog
 */
export function showAlert(options = {}) {
  const {
    title = 'Alert',
    message = 'Something happened',
    buttonText = 'OK',
    type = 'info',
    onClose
  } = options;

  const modal = ModalFactory({
    type: 'alert',
    title,
    message,
    buttonText,
    modalType: type,
    onConfirm: () => {
      const result = onClose ? onClose() : true;
      if (result !== false) {
        modal.destroy();
      }
      return result;
    }
  });

  modal.render().open();
  return modal;
}

/**
 * Show loading modal
 */
export function showLoading(options = {}) {
  const {
    title = 'Loading...',
    message = 'Please wait',
    closeOnBackdrop = false,
    closeOnEscape = false
  } = options;

  const modal = ModalFactory({
    type: 'loading',
    title,
    message,
    closeOnBackdrop,
    closeOnEscape,
    showClose: false
  });

  modal.render().open();
  return modal;
}

/**
 * Show form modal
 */
export function showForm(options = {}) {
  const {
    title = 'Form',
    content = '',
    size = 'md',
    submitText = 'Submit',
    cancelText = 'Cancel',
    onSubmit,
    onCancel
  } = options;

  const modal = ModalFactory({
    type: 'form',
    title,
    content,
    size,
    submitText,
    cancelText,
    onSubmit: (data) => {
      const result = onSubmit ? onSubmit(data) : true;
      if (result !== false) {
        modal.destroy();
      }
      return result;
    },
    onCancel: () => {
      const result = onCancel ? onCancel() : true;
      if (result !== false) {
        modal.destroy();
      }
      return result;
    }
  });

  modal.render().open();
  return modal;
}

/**
 * Modal manager for handling multiple modals
 */
export class ModalManager {
  constructor() {
    this.modals = new Map();
    this.zIndexBase = 2000;
  }

  /**
   * Create and register a modal
   */
  create(id, options = {}) {
    if (this.modals.has(id)) {
      console.warn(`Modal with id "${id}" already exists`);
      return this.modals.get(id);
    }

    const modal = ModalFactory({
      ...options,
      onClose: () => {
        if (options.onClose) options.onClose();
        this.close(id);
      }
    });

    this.modals.set(id, modal);
    return modal;
  }

  /**
   * Open modal by id
   */
  open(id) {
    const modal = this.modals.get(id);
    if (modal) {
      // Set z-index higher than other open modals
      const element = modal.getElement();
      if (element) {
        const backdrop = element.querySelector('.tmyl-modal-backdrop');
        if (backdrop) {
          backdrop.style.zIndex = this.zIndexBase + this.modals.size;
        }
      }

      modal.open();
    }
    return modal;
  }

  /**
   * Close modal by id
   */
  close(id) {
    const modal = this.modals.get(id);
    if (modal) {
      modal.close();
    }
  }

  /**
   * Close all modals
   */
  closeAll() {
    this.modals.forEach(modal => modal.close());
  }

  /**
   * Destroy modal by id
   */
  destroy(id) {
    const modal = this.modals.get(id);
    if (modal) {
      modal.destroy();
      this.modals.delete(id);
    }
  }

  /**
   * Destroy all modals
   */
  destroyAll() {
    this.modals.forEach(modal => modal.destroy());
    this.modals.clear();
  }

  /**
   * Get modal by id
   */
  get(id) {
    return this.modals.get(id);
  }

  /**
   * Check if modal exists
   */
  has(id) {
    return this.modals.has(id);
  }
}

// Default modal manager instance
export const modalManager = new ModalManager();

export default ModalFactory;
