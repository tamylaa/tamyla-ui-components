/**
 * Notification Molecule System
 * Complete notification factory with stacking and management
 */

import {
  createNotificationTemplate,
  createNotificationContainer,
  createSuccessNotification,
  createErrorNotification,
  createWarningNotification,
  createInfoNotification,
  createLoadingNotification,
  createUndoNotification
} from './notification-template.js';
import { NotificationController } from './notification-controller.js';

/**
 * Notification Factory
 * Creates modular toast notifications with stacking support
 */
export function NotificationFactory(props = {}) {
  const {
    // Notification configuration
    type = 'info',
    title = '',
    message = '',
    duration = 4000,
    position = 'top-right',

    // Behavior
    showClose = true,
    showProgress = true,
    pauseOnHover = true,
    autoDismiss = true,

    // Actions
    actions = [],

    // Event handlers
    onShow,
    onHide,
    onClick,
    onAction,

    // Container
    container = null
  } = props;

  let element = null;
  let controller = null;
  let notificationContainer = null;

  /**
   * Factory API
   */
  const factory = {
    // Core methods
    render,
    show,
    hide,
    destroy,

    // Content management
    updateContent,
    setTitle,
    setMessage,
    setType,

    // Timing control
    pause,
    resume,
    extend,
    persist,

    // State management
    getController: () => controller,
    getElement: () => element,
    isVisible: () => controller?.getState().isVisible || false,
    getTimeRemaining: () => controller?.getTimeRemaining() || 0
  };

  /**
   * Render the notification
   */
  function render(targetContainer = container) {
    // Get or create notification container
    notificationContainer = getNotificationContainer(position, targetContainer);

    // Create notification element
    element = createElement();

    // Initialize controller
    controller = new NotificationController({
      type,
      title,
      message,
      duration,
      position,
      showClose,
      showProgress,
      pauseOnHover,
      autoDismiss,
      actions,
      onShow,
      onHide,
      onClick,
      onAction
    });

    controller.initialize(element);

    // Load CSS
    loadStyles();

    // Add to container
    notificationContainer.appendChild(element);

    return factory;
  }

  /**
   * Create notification element
   */
  function createElement() {
    const notificationElement = document.createElement('div');
    notificationElement.innerHTML = createNotificationTemplate({
      type,
      title,
      message,
      showClose,
      showProgress,
      duration,
      actions
    });

    // Return the actual notification (unwrap from container div)
    return notificationElement.firstElementChild;
  }

  /**
   * Get or create notification container
   */
  function getNotificationContainer(position, targetContainer = document.body) {
    const containerId = `tmyl-notifications-${position}`;
    let existingContainer = document.getElementById(containerId);

    if (!existingContainer) {
      const containerElement = document.createElement('div');
      containerElement.innerHTML = createNotificationContainer(position);
      existingContainer = containerElement.firstElementChild;

      if (typeof targetContainer === 'string') {
        targetContainer = document.querySelector(targetContainer);
      }

      (targetContainer || document.body).appendChild(existingContainer);
    }

    return existingContainer;
  }

  /**
   * Load component styles
   */
  function loadStyles() {
    const styleId = 'tmyl-notification-styles';

    if (!document.getElementById(styleId)) {
      const link = document.createElement('link');
      link.id = styleId;
      link.rel = 'stylesheet';
      link.href = new URL('./notification.css', import.meta.url).href;
      document.head.appendChild(link);
    }
  }

  /**
   * Show notification
   */
  function show() {
    if (controller) {
      controller.show();
    }
    return factory;
  }

  /**
   * Hide notification
   */
  function hide() {
    if (controller) {
      controller.hide();
    }
    return factory;
  }

  /**
   * Update notification content
   */
  function updateContent(newProps = {}) {
    if (controller) {
      controller.updateContent(newProps);
    }
    return factory;
  }

  /**
   * Set notification title
   */
  function setTitle(newTitle) {
    return updateContent({ title: newTitle });
  }

  /**
   * Set notification message
   */
  function setMessage(newMessage) {
    return updateContent({ message: newMessage });
  }

  /**
   * Set notification type
   */
  function setType(newType) {
    return updateContent({ type: newType });
  }

  /**
   * Pause auto-dismiss
   */
  function pause() {
    if (controller) {
      controller.pause();
    }
    return factory;
  }

  /**
   * Resume auto-dismiss
   */
  function resume() {
    if (controller) {
      controller.resume();
    }
    return factory;
  }

  /**
   * Extend auto-dismiss time
   */
  function extend(additionalTime = 2000) {
    if (controller) {
      controller.extend(additionalTime);
    }
    return factory;
  }

  /**
   * Make notification persistent
   */
  function persist() {
    if (controller) {
      controller.persist();
    }
    return factory;
  }

  /**
   * Destroy notification
   */
  function destroy() {
    if (controller) {
      controller.destroy();
      controller = null;
    }

    element = null;
    notificationContainer = null;
  }

  return factory;
}

/**
 * Convenience functions for common notification types
 */

/**
 * Show success notification
 */
export function showSuccess(message, options = {}) {
  const notification = NotificationFactory({
    type: 'success',
    title: options.title || 'Success',
    message,
    duration: options.duration || 3000,
    ...options
  });

  notification.render().show();
  return notification;
}

/**
 * Show error notification
 */
export function showError(message, options = {}) {
  const notification = NotificationFactory({
    type: 'error',
    title: options.title || 'Error',
    message,
    duration: options.duration || 5000,
    ...options
  });

  notification.render().show();
  return notification;
}

/**
 * Show warning notification
 */
export function showWarning(message, options = {}) {
  const notification = NotificationFactory({
    type: 'warning',
    title: options.title || 'Warning',
    message,
    duration: options.duration || 4000,
    ...options
  });

  notification.render().show();
  return notification;
}

/**
 * Show info notification
 */
export function showInfo(message, options = {}) {
  const notification = NotificationFactory({
    type: 'info',
    title: options.title || 'Information',
    message,
    duration: options.duration || 4000,
    ...options
  });

  notification.render().show();
  return notification;
}

/**
 * Show loading notification
 */
export function showLoading(message = 'Loading...', options = {}) {
  const notification = NotificationFactory({
    type: 'info',
    message,
    duration: 0, // No auto-dismiss
    showClose: false,
    showProgress: false,
    autoDismiss: false,
    ...options
  });

  notification.render().show();
  return notification;
}

/**
 * Show undo notification
 */
export function showUndo(message, onUndo, options = {}) {
  const notification = NotificationFactory({
    type: 'info',
    message,
    duration: options.duration || 5000,
    showClose: false,
    actions: [
      {
        text: options.undoText || 'Undo',
        action: 'undo',
        primary: true
      }
    ],
    onAction: (action) => {
      if (action === 'undo' && onUndo) {
        onUndo();
      }
      return true; // Allow auto-hide
    },
    ...options
  });

  notification.render().show();
  return notification;
}

/**
 * Notification Manager for handling multiple notifications
 */
export class NotificationManager {
  constructor(options = {}) {
    this.options = {
      maxNotifications: 5,
      defaultPosition: 'top-right',
      defaultDuration: 4000,
      stackOldest: 'remove', // 'remove' or 'hide'
      ...options
    };

    this.notifications = new Map();
    this.containers = new Map();
    this.idCounter = 0;
  }

  /**
   * Create and show notification
   */
  show(type, message, options = {}) {
    const id = this.generateId();
    const position = options.position || this.options.defaultPosition;

    // Check notification limit
    this.enforceLimit(position);

    const notification = NotificationFactory({
      type,
      message,
      duration: this.options.defaultDuration,
      position,
      onHide: () => {
        this.remove(id);
      },
      ...options
    });

    notification.render().show();

    this.notifications.set(id, {
      notification,
      position,
      timestamp: Date.now()
    });

    return { id, notification };
  }

  /**
   * Show success notification
   */
  success(message, options = {}) {
    return this.show('success', message, options);
  }

  /**
   * Show error notification
   */
  error(message, options = {}) {
    return this.show('error', message, { duration: 5000, ...options });
  }

  /**
   * Show warning notification
   */
  warning(message, options = {}) {
    return this.show('warning', message, options);
  }

  /**
   * Show info notification
   */
  info(message, options = {}) {
    return this.show('info', message, options);
  }

  /**
   * Hide notification by id
   */
  hide(id) {
    const item = this.notifications.get(id);
    if (item) {
      item.notification.hide();
    }
  }

  /**
   * Remove notification from manager
   */
  remove(id) {
    const item = this.notifications.get(id);
    if (item) {
      item.notification.destroy();
      this.notifications.delete(id);
    }
  }

  /**
   * Clear all notifications
   */
  clear(position = null) {
    if (position) {
      // Clear notifications for specific position
      this.notifications.forEach((item, id) => {
        if (item.position === position) {
          this.remove(id);
        }
      });
    } else {
      // Clear all notifications
      this.notifications.forEach((item, id) => {
        this.remove(id);
      });
    }
  }

  /**
   * Enforce notification limit
   */
  enforceLimit(position) {
    const positionNotifications = Array.from(this.notifications.entries())
      .filter(([id, item]) => item.position === position)
      .sort(([, a], [, b]) => a.timestamp - b.timestamp);

    while (positionNotifications.length >= this.options.maxNotifications) {
      const [oldestId] = positionNotifications.shift();

      if (this.options.stackOldest === 'remove') {
        this.remove(oldestId);
      } else {
        this.hide(oldestId);
      }
    }
  }

  /**
   * Generate unique notification id
   */
  generateId() {
    return `notification-${++this.idCounter}-${Date.now()}`;
  }

  /**
   * Get notification count
   */
  getCount(position = null) {
    if (position) {
      return Array.from(this.notifications.values())
        .filter(item => item.position === position).length;
    }
    return this.notifications.size;
  }

  /**
   * Check if position has notifications
   */
  hasNotifications(position) {
    return this.getCount(position) > 0;
  }
}

// Default notification manager instance
export const notificationManager = new NotificationManager();

// Convenience methods using default manager
export const toast = {
  success: (message, options) => notificationManager.success(message, options),
  error: (message, options) => notificationManager.error(message, options),
  warning: (message, options) => notificationManager.warning(message, options),
  info: (message, options) => notificationManager.info(message, options),
  loading: (message, options) => showLoading(message, options),
  undo: (message, onUndo, options) => showUndo(message, onUndo, options),
  clear: (position) => notificationManager.clear(position)
};

export default NotificationFactory;
