/**
 * Notification Molecule Templates
 * HTML template generation for toast notifications
 */

/**
 * Main notification template
 */
export function createNotificationTemplate(props = {}) {
  const {
    type = 'info',
    title = '',
    message = '',
    showClose = true,
    showProgress = true,
    duration = 4000,
    actions = []
  } = props;

  const hasActions = actions && actions.length > 0;
  const hasTitle = title && title.trim() !== '';

  return `
    <div class="tmyl-notification tmyl-notification--${type} tmyl-notification--entering" 
         role="alert" 
         aria-live="polite"
         data-notification-type="${type}">
      
      ${createNotificationIcon(type)}
      
      <div class="tmyl-notification__content">
        ${hasTitle ? `<h4 class="tmyl-notification__title">${title}</h4>` : ''}
        <p class="tmyl-notification__message">${message}</p>
        ${hasActions ? createNotificationActions(actions) : ''}
      </div>
      
      ${showClose ? createCloseButton() : ''}
      ${showProgress && duration > 0 ? createProgressBar(duration) : ''}
    </div>
  `;
}

/**
 * Notification icon template
 */
export function createNotificationIcon(type) {
  const icons = {
    success: `
      <svg class="tmyl-notification__icon" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
      </svg>
    `,
    warning: `
      <svg class="tmyl-notification__icon" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
    `,
    error: `
      <svg class="tmyl-notification__icon" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
      </svg>
    `,
    info: `
      <svg class="tmyl-notification__icon" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
      </svg>
    `
  };

  return icons[type] || icons.info;
}

/**
 * Close button template
 */
export function createCloseButton() {
  return `
    <button class="tmyl-notification__close" 
            type="button" 
            aria-label="Close notification"
            data-notification-close>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
        <path d="M6.75 6l3.25-3.25-.75-.75L6 5.25 2.75 2l-.75.75L5.25 6 2 9.25l.75.75L6 6.75l3.25 3.25.75-.75L6.75 6z"/>
      </svg>
    </button>
  `;
}

/**
 * Progress bar template
 */
export function createProgressBar(duration) {
  return `
    <div class="tmyl-notification__progress" 
         style="--notification-duration: ${duration}ms"></div>
  `;
}

/**
 * Notification actions template
 */
export function createNotificationActions(actions) {
  if (!actions || actions.length === 0) return '';

  const actionButtons = actions.map(action => {
    const classes = [
      'tmyl-notification__action',
      action.primary ? 'tmyl-notification__action--primary' : ''
    ].filter(Boolean).join(' ');

    return `
      <button class="${classes}" 
              type="button"
              data-notification-action="${action.action || ''}"
              ${action.disabled ? 'disabled' : ''}>
        ${action.text}
      </button>
    `;
  }).join('');

  return `
    <div class="tmyl-notification__actions">
      ${actionButtons}
    </div>
  `;
}

/**
 * Notification container template
 */
export function createNotificationContainer(position = 'top-right') {
  return `
    <div class="tmyl-notification-container tmyl-notification-container--${position}" 
         id="tmyl-notifications-${position}"
         aria-live="polite"
         aria-label="Notifications">
    </div>
  `;
}

/**
 * Pre-configured notification templates
 */

/**
 * Success notification template
 */
export function createSuccessNotification(props = {}) {
  return createNotificationTemplate({
    type: 'success',
    title: 'Success',
    ...props
  });
}

/**
 * Error notification template
 */
export function createErrorNotification(props = {}) {
  return createNotificationTemplate({
    type: 'error',
    title: 'Error',
    ...props
  });
}

/**
 * Warning notification template
 */
export function createWarningNotification(props = {}) {
  return createNotificationTemplate({
    type: 'warning',
    title: 'Warning',
    ...props
  });
}

/**
 * Info notification template
 */
export function createInfoNotification(props = {}) {
  return createNotificationTemplate({
    type: 'info',
    title: 'Information',
    ...props
  });
}

/**
 * Loading notification template
 */
export function createLoadingNotification(props = {}) {
  const {
    message = 'Loading...',
    showProgress = false,
    duration = 0 // No auto-dismiss for loading
  } = props;

  return `
    <div class="tmyl-notification tmyl-notification--info tmyl-notification--entering" 
         role="status" 
         aria-live="polite"
         data-notification-type="loading">
      
      <div class="tmyl-notification__icon">
        <div style="width: 1.25rem; height: 1.25rem; border: 2px solid currentColor; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
      </div>
      
      <div class="tmyl-notification__content">
        <p class="tmyl-notification__message">${message}</p>
      </div>
      
      ${showProgress && duration > 0 ? createProgressBar(duration) : ''}
    </div>
  `;
}

/**
 * Undo notification template
 */
export function createUndoNotification(props = {}) {
  const {
    message = 'Action completed',
    undoText = 'Undo',
    duration = 5000
  } = props;

  return createNotificationTemplate({
    type: 'info',
    message,
    duration,
    showClose: false,
    actions: [
      {
        text: undoText,
        action: 'undo',
        primary: true
      }
    ],
    ...props
  });
}
