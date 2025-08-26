/**
 * Modal Adapter
 * Adapted from legacy/TamylaModal.js React patterns
 * Separated from monolithic react-pattern-adapters.js
 */

import { ButtonFactory } from '../../atoms/button/button-system.js';

/**
 * Advanced Modal Factory
 * Creates modal components with backdrop handling and size variants
 */
export class ModalAdapter {
  constructor() {
    this.buttonFactory = new ButtonFactory();
  }

  create(props = {}) {
    const {
      open = false,
      title = '',
      children = '',
      actions = [],
      size = 'md', // 'sm', 'md', 'lg', 'xl', 'full'
      closable = true,
      backdropClose = true,
      persistent = false,
      onClose,
      onOpen,
      className = ''
    } = props;

    let element = null;
    let isOpen = open;

    function createModal() {
      element = document.createElement('div');
      element.className = `advanced-modal-backdrop ${className}`;
      element.style.display = isOpen ? 'flex' : 'none';
      
      // Create modal container
      const modalContainer = document.createElement('div');
      modalContainer.className = `advanced-modal advanced-modal-${size}`;
      
      // Create header
      if (title || closable) {
        const header = createHeader();
        modalContainer.appendChild(header);
      }
      
      // Create body
      const body = document.createElement('div');
      body.className = 'advanced-modal-body';
      
      if (typeof children === 'string') {
        body.innerHTML = children;
      } else if (children instanceof Element) {
        body.appendChild(children);
      }
      
      modalContainer.appendChild(body);
      
      // Create actions footer
      if (actions.length > 0) {
        const footer = createFooter();
        modalContainer.appendChild(footer);
      }
      
      element.appendChild(modalContainer);
      
      // Add event listeners
      setupEventListeners();
      
      // Add to document
      document.body.appendChild(element);
      
      // Focus management
      if (isOpen) {
        handleOpen();
      }
      
      return {
        element,
        open: () => openModal(),
        close: () => closeModal(),
        toggle: () => isOpen ? closeModal() : openModal(),
        setContent: (newContent) => {
          body.innerHTML = '';
          if (typeof newContent === 'string') {
            body.innerHTML = newContent;
          } else if (newContent instanceof Element) {
            body.appendChild(newContent);
          }
        },
        setTitle: (newTitle) => {
          const titleElement = element.querySelector('.advanced-modal-title');
          if (titleElement) {
            titleElement.textContent = newTitle;
          }
        },
        isOpen: () => isOpen,
        destroy: () => {
          // Clean up event listeners
          document.removeEventListener('keydown', handleKeyDown);
          
          // Remove from DOM
          if (element?.parentNode) {
            element.parentNode.removeChild(element);
          }
          
          // Restore body scroll
          document.body.style.overflow = '';
        }
      };
    }

    function createHeader() {
      const header = document.createElement('div');
      header.className = 'advanced-modal-header';
      
      if (title) {
        const titleElement = document.createElement('h2');
        titleElement.className = 'advanced-modal-title';
        titleElement.textContent = title;
        header.appendChild(titleElement);
      }
      
      if (closable) {
        const closeButton = document.createElement('button');
        closeButton.className = 'advanced-modal-close';
        closeButton.innerHTML = '×';
        closeButton.setAttribute('aria-label', 'Close modal');
        closeButton.addEventListener('click', closeModal);
        header.appendChild(closeButton);
      }
      
      return header;
    }

    function createFooter() {
      const footer = document.createElement('div');
      footer.className = 'advanced-modal-footer';
      
      actions.forEach(action => {
        const buttonContainer = document.createElement('div');
        
        const button = this.buttonFactory.create({
          variant: action.variant || 'secondary',
          size: action.size || 'md',
          label: action.label,
          onClick: () => {
            if (action.onClick) {
              const result = action.onClick();
              
              // If onClick returns a promise, handle it
              if (result && typeof result.then === 'function') {
                result.then(() => {
                  if (action.close !== false) {
                    closeModal();
                  }
                }).catch((error) => {
                  console.error('Modal action error:', error);
                });
              } else {
                if (action.close !== false) {
                  closeModal();
                }
              }
            } else if (action.close !== false) {
              closeModal();
            }
          },
          container: buttonContainer
        });
        
        footer.appendChild(buttonContainer);
      });
      
      return footer;
    }

    function setupEventListeners() {
      // Backdrop click handling
      if (backdropClose) {
        element.addEventListener('click', (e) => {
          if (e.target === element) {
            closeModal();
          }
        });
      }
      
      // Escape key handling
      document.addEventListener('keydown', handleKeyDown);
      
      // Prevent modal container clicks from closing
      const modalContainer = element.querySelector('.advanced-modal');
      modalContainer.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }

    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen && closable && !persistent) {
        closeModal();
      }
    }

    function openModal() {
      if (isOpen) return;
      
      isOpen = true;
      element.style.display = 'flex';
      
      // Focus management
      handleOpen();
      
      // Dispatch event
      element.dispatchEvent(new CustomEvent('modal-open', {
        detail: { modal: element }
      }));
      
      if (onOpen) {
        onOpen();
      }
    }

    function closeModal() {
      if (!isOpen || persistent) return;
      
      isOpen = false;
      element.style.display = 'none';
      
      // Focus management
      handleClose();
      
      // Dispatch event
      element.dispatchEvent(new CustomEvent('modal-close', {
        detail: { modal: element }
      }));
      
      if (onClose) {
        onClose();
      }
    }

    function handleOpen() {
      // Store previously focused element
      element._previousFocus = document.activeElement;
      
      // Focus first focusable element in modal
      setTimeout(() => {
        const focusable = element.querySelector('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusable) {
          focusable.focus();
        }
      }, 100);
      
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
    }

    function handleClose() {
      // Restore focus
      if (element._previousFocus && element._previousFocus.focus) {
        element._previousFocus.focus();
      }
      
      // Restore scrolling
      document.body.style.overflow = '';
    }

    return createModal.call(this);
  }

  /**
   * Create specific modal types
   */
  createConfirmModal(props = {}) {
    return this.create({
      size: 'sm',
      title: props.title || 'Confirm Action',
      children: props.message || 'Are you sure?',
      actions: [
        {
          label: 'Cancel',
          variant: 'secondary',
          onClick: props.onCancel
        },
        {
          label: props.confirmLabel || 'Confirm',
          variant: props.confirmVariant || 'primary',
          onClick: props.onConfirm
        }
      ],
      ...props
    });
  }

  createAlertModal(props = {}) {
    return this.create({
      size: 'sm',
      title: props.title || 'Alert',
      children: props.message || '',
      actions: [
        {
          label: 'OK',
          variant: 'primary',
          onClick: props.onOK
        }
      ],
      ...props
    });
  }
}

// Create singleton instance
export const modalAdapter = new ModalAdapter();
