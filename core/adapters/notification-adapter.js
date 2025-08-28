/**
 * Notification Adapter
 * Adapted from legacy/TamylaNotification.js React patterns
 * Separated from monolithic react-pattern-adapters.js
 */

/**
 * Notification Factory
 * Creates notification components with auto-dismiss timing and type-based styling
 */
export class NotificationAdapter {
  constructor() {
    this.notifications = new Map();
    this.container = null;
    this.createContainer();
  }

  createContainer() {
    // Check if container already exists
    this.container = document.getElementById('notifications-container');

    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'notifications-container';
      this.container.id = 'notifications-container';
      document.body.appendChild(this.container);
    }
  }

  create(props = {}) {
    const {
      type = 'info', // 'info', 'success', 'warning', 'error'
      message = '',
      duration = 4000,
      persistent = false,
      actions = [],
      onClose,
      id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    } = props;

    let element = null;
    let timeoutId = null;

    function createNotification() {
      element = document.createElement('div');
      element.className = `notification notification-${type}`;
      element.dataset.id = id;

      // Create content
      const content = document.createElement('div');
      content.className = 'notification-content';

      // Add icon based on type
      const icon = document.createElement('span');
      icon.className = 'notification-icon';
      icon.textContent = getTypeIcon(type);
      content.appendChild(icon);

      // Add message
      const messageElement = document.createElement('span');
      messageElement.className = 'notification-message';
      messageElement.textContent = message;
      content.appendChild(messageElement);

      element.appendChild(content);

      // Add actions if provided
      if (actions.length > 0) {
        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'notification-actions';

        actions.forEach(action => {
          const button = document.createElement('button');
          button.className = `notification-action action-${action.variant || 'primary'}`;
          button.textContent = action.label;
          button.addEventListener('click', () => {
            if (action.onClick) action.onClick();
            close();
          });
          actionsContainer.appendChild(button);
        });

        element.appendChild(actionsContainer);
      }

      // Add close button
      const closeButton = document.createElement('button');
      closeButton.className = 'notification-close';
      closeButton.innerHTML = '×';
      closeButton.setAttribute('aria-label', 'Close notification');
      closeButton.addEventListener('click', close);
      element.appendChild(closeButton);

      // Add to container
      this.container.appendChild(element);
      this.notifications.set(id, element);

      // Auto-dismiss timer
      if (!persistent && duration > 0) {
        timeoutId = setTimeout(close, duration);
      }

      // Animate in
      requestAnimationFrame(() => {
        element.classList.add('notification-enter');
      });

      // Dispatch creation event
      element.dispatchEvent(new CustomEvent('notification-created', {
        detail: { id, type, message }
      }));

      return {
        element,
        close,
        extend: (additionalTime) => {
          if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(close, additionalTime);
          }
        },
        getId: () => id,
        getType: () => type
      };
    }

    function close() {
      if (!element || !element.parentNode) return;

      // Clear timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Animate out
      element.classList.add('notification-exit');

      setTimeout(() => {
        if (element && element.parentNode) {
          element.parentNode.removeChild(element);
        }
        this.notifications.delete(id);

        // Dispatch close event
        document.dispatchEvent(new CustomEvent('notification-closed', {
          detail: { id, type, message }
        }));

        if (onClose) {
          onClose();
        }
      }, 300);
    }

    function getTypeIcon(type) {
      const iconMap = {
        info: 'ℹ️',
        success: '✅',
        warning: '⚠️',
        error: '❌'
      };
      return iconMap[type] || iconMap.info;
    }

    return createNotification.call(this);
  }

  // Convenience methods
  info(message, options = {}) {
    return this.create({ ...options, type: 'info', message });
  }

  success(message, options = {}) {
    return this.create({ ...options, type: 'success', message });
  }

  warning(message, options = {}) {
    return this.create({ ...options, type: 'warning', message });
  }

  error(message, options = {}) {
    return this.create({ ...options, type: 'error', message, duration: 6000 });
  }

  // Enhanced methods
  confirm(message, options = {}) {
    return new Promise((resolve) => {
      this.create({
        ...options,
        type: 'warning',
        message,
        persistent: true,
        actions: [
          {
            label: 'Cancel',
            variant: 'secondary',
            onClick: () => resolve(false)
          },
          {
            label: 'Confirm',
            variant: 'primary',
            onClick: () => resolve(true)
          }
        ]
      });
    });
  }

  prompt(message, defaultValue = '', options = {}) {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'text';
      input.value = defaultValue;
      input.className = 'notification-input';

      const container = document.createElement('div');
      container.appendChild(document.createTextNode(message));
      container.appendChild(document.createElement('br'));
      container.appendChild(input);

      this.create({
        ...options,
        type: 'info',
        message: '',
        persistent: true,
        actions: [
          {
            label: 'Cancel',
            variant: 'secondary',
            onClick: () => resolve(null)
          },
          {
            label: 'OK',
            variant: 'primary',
            onClick: () => resolve(input.value)
          }
        ],
        onOpen: () => {
          setTimeout(() => input.focus(), 100);
        }
      });
    });
  }

  clearAll() {
    this.notifications.forEach(notification => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    });
    this.notifications.clear();
  }

  clearByType(type) {
    this.notifications.forEach((notification, id) => {
      if (notification.classList.contains(`notification-${type}`)) {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
        this.notifications.delete(id);
      }
    });
  }

  getCount() {
    return this.notifications.size;
  }

  getActiveNotifications() {
    return Array.from(this.notifications.entries()).map(([id, element]) => ({
      id,
      element,
      type: element.className.match(/notification-(\w+)/)?.[1] || 'unknown'
    }));
  }
}

// Create singleton instance
export const notificationAdapter = new NotificationAdapter();
