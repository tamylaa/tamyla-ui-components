/**
 * Input Templates - Pure HTML generation functions
 * Framework-agnostic template generation for input components
 */

import { inputIcons } from '../icons/input-icons.js';

/**
 * Generate basic input HTML structure
 */
export function createInputHTML(options = {}) {
  const {
    type = 'text',
    value = '',
    placeholder = '',
    id = '',
    name = '',
    disabled = false,
    readonly = false,
    required = false,
    autocomplete = '',
    pattern = '',
    minlength,
    maxlength,
    min,
    max,
    step,
    className = ''
  } = options;

  const attributes = [
    `type="${type}"`,
    value && `value="${value}"`,
    placeholder && `placeholder="${placeholder}"`,
    id && `id="${id}"`,
    name && `name="${name}"`,
    disabled && 'disabled',
    readonly && 'readonly',
    required && 'required',
    autocomplete && `autocomplete="${autocomplete}"`,
    pattern && `pattern="${pattern}"`,
    minlength && `minlength="${minlength}"`,
    maxlength && `maxlength="${maxlength}"`,
    min && `min="${min}"`,
    max && `max="${max}"`,
    step && `step="${step}"`,
    `class="tmyl-input__field ${className}"`
  ].filter(Boolean).join(' ');

  return `<input ${attributes}>`;
}

/**
 * Generate textarea HTML structure
 */
export function createTextareaHTML(options = {}) {
  const {
    value = '',
    placeholder = '',
    id = '',
    name = '',
    disabled = false,
    readonly = false,
    required = false,
    rows = 4,
    cols,
    minlength,
    maxlength,
    wrap = 'soft',
    resize = 'vertical',
    autoResize = false,
    className = ''
  } = options;

  const attributes = [
    placeholder && `placeholder="${placeholder}"`,
    id && `id="${id}"`,
    name && `name="${name}"`,
    disabled && 'disabled',
    readonly && 'readonly',
    required && 'required',
    rows && `rows="${rows}"`,
    cols && `cols="${cols}"`,
    minlength && `minlength="${minlength}"`,
    maxlength && `maxlength="${maxlength}"`,
    wrap && `wrap="${wrap}"`,
    `class="tmyl-input__field ${className}"`,
    `style="resize: ${resize}"`
  ].filter(Boolean).join(' ');

  return `<textarea ${attributes}>${value}</textarea>`;
}

/**
 * Generate select HTML structure
 */
export function createSelectHTML(options = {}) {
  const {
    options: selectOptions = [],
    value = '',
    placeholder = 'Select an option...',
    id = '',
    name = '',
    disabled = false,
    required = false,
    multiple = false,
    size,
    className = ''
  } = options;

  const attributes = [
    id && `id="${id}"`,
    name && `name="${name}"`,
    disabled && 'disabled',
    required && 'required',
    multiple && 'multiple',
    size && `size="${size}"`,
    `class="tmyl-input__field ${className}"`
  ].filter(Boolean).join(' ');

  const optionsHTML = [
    placeholder && !multiple && `<option value="" disabled ${!value ? 'selected' : ''}>${placeholder}</option>`,
    ...selectOptions.map(option => {
      if (typeof option === 'string') {
        const selected = value === option ? 'selected' : '';
        return `<option value="${option}" ${selected}>${option}</option>`;
      } else {
        const selected = value === option.value ? 'selected' : '';
        const disabled = option.disabled ? 'disabled' : '';
        return `<option value="${option.value}" ${selected} ${disabled}>${option.label}</option>`;
      }
    })
  ].filter(Boolean).join('\n    ');

  return `<select ${attributes}>
    ${optionsHTML}
  </select>`;
}

/**
 * Generate input wrapper with label, helper text, and error
 */
export function createInputWrapperHTML(options = {}) {
  const {
    inputHTML = '',
    label = '',
    helperText = '',
    errorText = '',
    required = false,
    id = '',
    className = ''
  } = options;

  const labelHTML = label ? `
    <label class="tmyl-input__label ${required ? 'tmyl-input__label--required' : ''}" ${id ? `for="${id}"` : ''}>
      ${label}
    </label>
  ` : '';

  const helperHTML = helperText ? `
    <div class="tmyl-input__helper" ${id ? `id="${id}-helper"` : ''}>
      ${helperText}
    </div>
  ` : '';

  const errorHTML = errorText ? `
    <div class="tmyl-input__error" ${id ? `id="${id}-error"` : ''}>
      ${inputIcons.exclamation}
      <span>${errorText}</span>
    </div>
  ` : '';

  return `
    <div class="tmyl-input-group ${className}">
      ${labelHTML}
      ${inputHTML}
      ${errorText ? errorHTML : helperHTML}
    </div>
  `.trim();
}

/**
 * Generate input with icon
 */
export function createInputWithIconHTML(options = {}) {
  const {
    inputHTML = '',
    icon = '',
    iconPosition = 'left',
    clearable = false,
    loading = false,
    className = ''
  } = options;

  const iconHTML = icon ? `
    <span class="tmyl-input__icon tmyl-input__icon--${iconPosition}">
      ${inputIcons[icon] || icon}
    </span>
  ` : '';

  const clearHTML = clearable ? `
    <button type="button" class="tmyl-input__clear" aria-label="Clear input">
      ${inputIcons.x}
    </button>
  ` : '';

  const loadingHTML = loading ? `
    <span class="tmyl-input__loading">
      <span class="tmyl-spinner"></span>
    </span>
  ` : '';

  const modifierClasses = [
    icon && iconPosition === 'left' && 'tmyl-input--with-icon-left',
    icon && iconPosition === 'right' && 'tmyl-input--with-icon-right',
    clearable && 'tmyl-input--clearable',
    loading && 'tmyl-input--loading'
  ].filter(Boolean).join(' ');

  return `
    <div class="tmyl-input ${modifierClasses} ${className}">
      ${iconHTML}
      ${inputHTML}
      ${clearHTML}
      ${loadingHTML}
    </div>
  `.trim();
}

/**
 * Generate file input HTML
 */
export function createFileInputHTML(options = {}) {
  const {
    id = '',
    name = '',
    accept = '',
    multiple = false,
    disabled = false,
    required = false,
    placeholder = 'Choose file...',
    buttonText = 'Browse',
    className = ''
  } = options;

  const fileInputId = id || `file-input-${Math.random().toString(36).substr(2, 9)}`;

  const attributes = [
    `type="file"`,
    `id="${fileInputId}"`,
    name && `name="${name}"`,
    accept && `accept="${accept}"`,
    multiple && 'multiple',
    disabled && 'disabled',
    required && 'required'
  ].filter(Boolean).join(' ');

  return `
    <div class="tmyl-file-input ${className}">
      <input ${attributes}>
      <label for="${fileInputId}" class="tmyl-file-input__content">
        <span class="tmyl-file-input__text">${placeholder}</span>
        <span class="tmyl-file-input__button">${buttonText}</span>
      </label>
    </div>
  `.trim();
}

/**
 * Generate input group (multiple inputs)
 */
export function createInputGroupHTML(options = {}) {
  const {
    inputs = [],
    orientation = 'horizontal',
    className = ''
  } = options;

  const orientationClass = orientation === 'vertical' ? 'tmyl-input-stack--vertical' : '';

  const inputsHTML = inputs.map(input => {
    if (typeof input === 'string') {
      return input;
    } else {
      // Generate input based on configuration
      return createCompleteInputHTML(input);
    }
  }).join('\n    ');

  return `
    <div class="tmyl-input-stack ${orientationClass} ${className}">
      ${inputsHTML}
    </div>
  `.trim();
}

/**
 * Generate complete input with all features
 */
export function createCompleteInputHTML(options = {}) {
  const {
    type = 'text',
    variant = 'primary',
    size = 'md',
    label = '',
    helperText = '',
    errorText = '',
    icon = '',
    iconPosition = 'left',
    clearable = false,
    loading = false,
    className = '',
    wrapperClassName = '',
    ...inputProps
  } = options;

  // Generate the base input
  let inputHTML;
  if (type === 'textarea') {
    inputHTML = createTextareaHTML(inputProps);
  } else if (type === 'select') {
    inputHTML = createSelectHTML(inputProps);
  } else if (type === 'file') {
    return createFileInputHTML({ ...inputProps, className });
  } else {
    inputHTML = createInputHTML({ type, ...inputProps });
  }

  // Wrap with icon/features if needed
  if (icon || clearable || loading) {
    inputHTML = createInputWithIconHTML({
      inputHTML,
      icon,
      iconPosition,
      clearable,
      loading,
      className: `tmyl-input--${variant} tmyl-input--${size} ${className}`
    });
  } else {
    inputHTML = `<div class="tmyl-input tmyl-input--${variant} tmyl-input--${size} ${className}">${inputHTML}</div>`;
  }

  // Wrap with label/helper/error if needed
  if (label || helperText || errorText) {
    inputHTML = createInputWrapperHTML({
      inputHTML,
      label,
      helperText,
      errorText,
      required: inputProps.required,
      id: inputProps.id,
      className: wrapperClassName
    });
  }

  return inputHTML;
}

// Template collections for common patterns
export const inputTemplates = {
  // Authentication forms
  email: (options = {}) => createCompleteInputHTML({
    type: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
    icon: 'email',
    autocomplete: 'email',
    required: true,
    ...options
  }),

  password: (options = {}) => createCompleteInputHTML({
    type: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
    icon: 'lock',
    autocomplete: 'current-password',
    required: true,
    ...options
  }),

  // Contact forms
  name: (options = {}) => createCompleteInputHTML({
    type: 'text',
    label: 'Name',
    placeholder: 'Enter your name',
    icon: 'user',
    autocomplete: 'name',
    required: true,
    ...options
  }),

  phone: (options = {}) => createCompleteInputHTML({
    type: 'tel',
    label: 'Phone',
    placeholder: 'Enter your phone number',
    icon: 'phone',
    autocomplete: 'tel',
    ...options
  }),

  // Search
  search: (options = {}) => createCompleteInputHTML({
    type: 'search',
    placeholder: 'Search...',
    icon: 'search',
    clearable: true,
    ...options
  }),

  // Financial
  currency: (options = {}) => createCompleteInputHTML({
    type: 'number',
    label: 'Amount',
    placeholder: '0.00',
    icon: 'currency',
    step: '0.01',
    min: '0',
    ...options
  }),

  // Date/Time
  date: (options = {}) => createCompleteInputHTML({
    type: 'date',
    label: 'Date',
    icon: 'calendar',
    ...options
  }),

  // File uploads
  fileUpload: (options = {}) => createFileInputHTML({
    placeholder: 'Choose file to upload...',
    buttonText: 'Browse',
    ...options
  }),

  // Comments/Messages
  message: (options = {}) => createCompleteInputHTML({
    type: 'textarea',
    label: 'Message',
    placeholder: 'Enter your message...',
    rows: 4,
    ...options
  })
};

export default {
  createInputHTML,
  createTextareaHTML,
  createSelectHTML,
  createInputWrapperHTML,
  createInputWithIconHTML,
  createFileInputHTML,
  createInputGroupHTML,
  createCompleteInputHTML,
  inputTemplates
};
