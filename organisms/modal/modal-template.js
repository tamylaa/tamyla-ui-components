/**
 * Modal Organism Templates
 * HTML template generation for modal dialogs
 */

/**
 * Main modal template
 */
export function createModalTemplate(props = {}) {
  const {
    title = '',
    size = 'md',
    type = 'default',
    showClose = true,
    loading = false
  } = props;

  const modalClasses = [
    'tmyl-modal',
    `tmyl-modal--${size}`,
    type !== 'default' ? `tmyl-modal--${type}` : '',
    loading ? 'tmyl-modal--loading' : ''
  ].filter(Boolean).join(' ');

  return `
    <div class="tmyl-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="${modalClasses}" tabindex="-1">
        ${createModalHeader(title, showClose)}
        ${createModalBody(loading)}
        ${createModalActions()}
      </div>
    </div>
  `;
}

/**
 * Modal header template
 */
export function createModalHeader(title, showClose = true) {
  if (!title && !showClose) return '';

  return `
    <div class="tmyl-modal__header">
      ${title ? `<h2 class="tmyl-modal__title" id="modal-title">${title}</h2>` : ''}
      ${showClose ? `
        <button class="tmyl-modal__close" 
                type="button" 
                aria-label="Close modal"
                data-modal-close>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z"/>
            <path d="M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z"/>
          </svg>
        </button>
      ` : ''}
    </div>
  `;
}

/**
 * Modal body template
 */
export function createModalBody(loading = false) {
  if (loading) {
    return `
      <div class="tmyl-modal__body">
        <div class="tmyl-modal__spinner"></div>
      </div>
    `;
  }

  return `
    <div class="tmyl-modal__body" data-modal-body>
      <!-- Content will be inserted here -->
    </div>
  `;
}

/**
 * Modal actions template
 */
export function createModalActions() {
  return `
    <div class="tmyl-modal__actions" data-modal-actions style="display: none;">
      <!-- Action buttons will be inserted here -->
    </div>
  `;
}

/**
 * Action button template
 */
export function createActionButton(props = {}) {
  const {
    text = 'Button',
    variant = 'secondary',
    action = '',
    disabled = false,
    autofocus = false
  } = props;

  const classes = [
    'tmyl-modal__action',
    `tmyl-modal__action--${variant}`
  ].join(' ');

  return `
    <button class="${classes}" 
            type="button"
            data-modal-action="${action}"
            ${disabled ? 'disabled' : ''}
            ${autofocus ? 'autofocus' : ''}>
      ${text}
    </button>
  `;
}

/**
 * Confirm dialog template
 */
export function createConfirmTemplate(props = {}) {
  const {
    title = 'Confirm Action',
    message = 'Are you sure?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'warning'
  } = props;

  const iconMap = {
    warning: `
      <svg width="48" height="48" viewBox="0 0 48 48" fill="#f59e0b">
        <path d="M24 2L2 42h44L24 2zm0 6l18 32H6l18-32z"/>
        <path d="M22 18h4v12h-4z"/>
        <circle cx="24" cy="34" r="2"/>
      </svg>
    `,
    error: `
      <svg width="48" height="48" viewBox="0 0 48 48" fill="#ef4444">
        <circle cx="24" cy="24" r="20"/>
        <path d="M16 16l16 16m0-16L16 32" stroke="white" stroke-width="2"/>
      </svg>
    `,
    info: `
      <svg width="48" height="48" viewBox="0 0 48 48" fill="#3b82f6">
        <circle cx="24" cy="24" r="20"/>
        <path d="M24 16v8m0 4h.01" stroke="white" stroke-width="2"/>
      </svg>
    `
  };

  return `
    <div class="tmyl-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="tmyl-modal tmyl-modal--md tmyl-modal--confirm">
        <div class="tmyl-modal__header">
          <h2 class="tmyl-modal__title" id="modal-title">${title}</h2>
        </div>
        <div class="tmyl-modal__body">
          <div style="margin-bottom: 1rem; display: flex; justify-content: center;">
            ${iconMap[type] || iconMap.warning}
          </div>
          <p style="margin: 0; text-align: center; font-size: 1rem; line-height: 1.5;">
            ${message}
          </p>
        </div>
        <div class="tmyl-modal__actions">
          <button class="tmyl-modal__action tmyl-modal__action--secondary" 
                  type="button" 
                  data-modal-action="cancel">
            ${cancelText}
          </button>
          <button class="tmyl-modal__action tmyl-modal__action--${type === 'error' ? 'danger' : 'primary'}" 
                  type="button" 
                  data-modal-action="confirm"
                  autofocus>
            ${confirmText}
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Alert dialog template
 */
export function createAlertTemplate(props = {}) {
  const {
    title = 'Alert',
    message = 'Something happened',
    buttonText = 'OK',
    type = 'info'
  } = props;

  const iconMap = {
    success: `
      <svg width="48" height="48" viewBox="0 0 48 48" fill="#10b981">
        <circle cx="24" cy="24" r="20"/>
        <path d="M16 24l6 6 12-12" stroke="white" stroke-width="2" fill="none"/>
      </svg>
    `,
    warning: `
      <svg width="48" height="48" viewBox="0 0 48 48" fill="#f59e0b">
        <path d="M24 2L2 42h44L24 2zm0 6l18 32H6l18-32z"/>
        <path d="M22 18h4v12h-4z"/>
        <circle cx="24" cy="34" r="2"/>
      </svg>
    `,
    error: `
      <svg width="48" height="48" viewBox="0 0 48 48" fill="#ef4444">
        <circle cx="24" cy="24" r="20"/>
        <path d="M16 16l16 16m0-16L16 32" stroke="white" stroke-width="2"/>
      </svg>
    `,
    info: `
      <svg width="48" height="48" viewBox="0 0 48 48" fill="#3b82f6">
        <circle cx="24" cy="24" r="20"/>
        <path d="M24 16v8m0 4h.01" stroke="white" stroke-width="2"/>
      </svg>
    `
  };

  return `
    <div class="tmyl-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="tmyl-modal tmyl-modal--sm tmyl-modal--${type}">
        <div class="tmyl-modal__header">
          <h2 class="tmyl-modal__title" id="modal-title">${title}</h2>
        </div>
        <div class="tmyl-modal__body">
          <div style="margin-bottom: 1rem; display: flex; justify-content: center;">
            ${iconMap[type] || iconMap.info}
          </div>
          <p style="margin: 0; text-align: center; font-size: 1rem; line-height: 1.5;">
            ${message}
          </p>
        </div>
        <div class="tmyl-modal__actions">
          <button class="tmyl-modal__action tmyl-modal__action--primary" 
                  type="button" 
                  data-modal-action="ok"
                  autofocus>
            ${buttonText}
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Form modal template
 */
export function createFormModalTemplate(props = {}) {
  const {
    title = 'Form',
    size = 'md',
    submitText = 'Submit',
    cancelText = 'Cancel'
  } = props;

  return `
    <div class="tmyl-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="tmyl-modal tmyl-modal--${size}">
        <div class="tmyl-modal__header">
          <h2 class="tmyl-modal__title" id="modal-title">${title}</h2>
          <button class="tmyl-modal__close" 
                  type="button" 
                  aria-label="Close modal"
                  data-modal-close>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z"/>
              <path d="M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z"/>
            </svg>
          </button>
        </div>
        <form data-modal-form>
          <div class="tmyl-modal__body" data-modal-body>
            <!-- Form content will be inserted here -->
          </div>
          <div class="tmyl-modal__actions">
            <button class="tmyl-modal__action tmyl-modal__action--secondary" 
                    type="button" 
                    data-modal-action="cancel">
              ${cancelText}
            </button>
            <button class="tmyl-modal__action tmyl-modal__action--primary" 
                    type="submit" 
                    data-modal-action="submit">
              ${submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

/**
 * Loading modal template
 */
export function createLoadingModalTemplate(props = {}) {
  const {
    title = 'Loading...',
    message = 'Please wait'
  } = props;

  return `
    <div class="tmyl-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="tmyl-modal tmyl-modal--sm tmyl-modal--loading">
        <div class="tmyl-modal__header">
          <h2 class="tmyl-modal__title" id="modal-title">${title}</h2>
        </div>
        <div class="tmyl-modal__body">
          <div class="tmyl-modal__spinner"></div>
          ${message ? `<p style="text-align: center; margin-top: 1rem; color: #6b7280;">${message}</p>` : ''}
        </div>
      </div>
    </div>
  `;
}
