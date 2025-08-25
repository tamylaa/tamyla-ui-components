/**
 * Input Group Atom Templates
 * Template generation for form field groupings
 */

/**
 * Create basic input group template
 */
export function createInputGroupTemplate(options = {}) {
  const {
    label = '',
    content = '',
    error = '',
    help = '',
    required = false,
    size = 'medium', // small, medium, large
    variant = 'default', // default, inline, compact
    disabled = false,
    loading = false,
    id = ''
  } = options;

  const groupClass = [
    'tmyl-input-group',
    size !== 'medium' ? `tmyl-input-group--${size}` : '',
    variant !== 'default' ? `tmyl-input-group--${variant}` : '',
    error ? 'tmyl-input-group--error' : '',
    disabled ? 'tmyl-input-group--disabled' : '',
    loading ? 'tmyl-input-group--loading' : ''
  ].filter(Boolean).join(' ');

  const labelId = id ? `${id}-label` : '';
  const errorId = id ? `${id}-error` : '';
  const helpId = id ? `${id}-help` : '';

  return `
    <div class="${groupClass}" role="group" ${labelId ? `aria-labelledby="${labelId}"` : ''}>
      ${label ? createLabel(label, required, labelId, id) : ''}
      <div class="tmyl-input-group__content ${content.includes('multiple') ? '' : 'tmyl-input-group__content--single'}">
        ${content}
      </div>
      ${error ? createError(error, errorId) : ''}
      ${help ? createHelp(help, helpId) : ''}
    </div>
  `.trim();
}

/**
 * Create label element
 */
function createLabel(text, required, labelId, forId) {
  const labelClass = [
    'tmyl-input-group__label',
    required ? 'tmyl-input-group__label--required' : ''
  ].filter(Boolean).join(' ');

  return `
    <label 
      class="${labelClass}"
      ${labelId ? `id="${labelId}"` : ''}
      ${forId ? `for="${forId}"` : ''}
    >
      ${text}
    </label>
  `;
}

/**
 * Create error message element
 */
function createError(message, errorId) {
  return `
    <div 
      class="tmyl-input-group__error" 
      role="alert" 
      aria-live="polite"
      ${errorId ? `id="${errorId}"` : ''}
    >
      ${message}
    </div>
  `;
}

/**
 * Create help text element
 */
function createHelp(text, helpId) {
  return `
    <div 
      class="tmyl-input-group__help"
      ${helpId ? `id="${helpId}"` : ''}
    >
      ${text}
    </div>
  `;
}

/**
 * Create text input with input group
 */
export function createTextInputGroup(options = {}) {
  const {
    label = '',
    placeholder = '',
    value = '',
    type = 'text', // text, email, password, tel, url
    name = '',
    id = '',
    required = false,
    disabled = false,
    readonly = false,
    minlength = '',
    maxlength = '',
    pattern = '',
    autocomplete = '',
    ...groupOptions
  } = options;

  const inputId = id || `input-${Date.now()}`;
  const errorId = groupOptions.error ? `${inputId}-error` : '';
  const helpId = groupOptions.help ? `${inputId}-help` : '';

  const inputAttributes = [
    `type="${type}"`,
    `id="${inputId}"`,
    name ? `name="${name}"` : '',
    placeholder ? `placeholder="${placeholder}"` : '',
    value ? `value="${value}"` : '',
    required ? 'required' : '',
    disabled ? 'disabled' : '',
    readonly ? 'readonly' : '',
    minlength ? `minlength="${minlength}"` : '',
    maxlength ? `maxlength="${maxlength}"` : '',
    pattern ? `pattern="${pattern}"` : '',
    autocomplete ? `autocomplete="${autocomplete}"` : '',
    'class="tmyl-input"',
    errorId ? `aria-describedby="${errorId}${helpId ? ` ${helpId}` : ''}"` : (helpId ? `aria-describedby="${helpId}"` : ''),
    groupOptions.error ? 'aria-invalid="true"' : ''
  ].filter(Boolean).join(' ');

  const inputElement = `<input ${inputAttributes} />`;

  return createInputGroupTemplate({
    ...groupOptions,
    label,
    content: inputElement,
    id: inputId
  });
}

/**
 * Create textarea with input group
 */
export function createTextareaInputGroup(options = {}) {
  const {
    label = '',
    placeholder = '',
    value = '',
    name = '',
    id = '',
    required = false,
    disabled = false,
    readonly = false,
    rows = 3,
    cols = '',
    minlength = '',
    maxlength = '',
    wrap = 'soft',
    resize = 'vertical', // none, both, horizontal, vertical
    ...groupOptions
  } = options;

  const textareaId = id || `textarea-${Date.now()}`;
  const errorId = groupOptions.error ? `${textareaId}-error` : '';
  const helpId = groupOptions.help ? `${textareaId}-help` : '';

  const textareaAttributes = [
    `id="${textareaId}"`,
    name ? `name="${name}"` : '',
    placeholder ? `placeholder="${placeholder}"` : '',
    required ? 'required' : '',
    disabled ? 'disabled' : '',
    readonly ? 'readonly' : '',
    `rows="${rows}"`,
    cols ? `cols="${cols}"` : '',
    minlength ? `minlength="${minlength}"` : '',
    maxlength ? `maxlength="${maxlength}"` : '',
    wrap ? `wrap="${wrap}"` : '',
    'class="tmyl-textarea"',
    resize !== 'vertical' ? `style="resize: ${resize};"` : '',
    errorId ? `aria-describedby="${errorId}${helpId ? ` ${helpId}` : ''}"` : (helpId ? `aria-describedby="${helpId}"` : ''),
    groupOptions.error ? 'aria-invalid="true"' : ''
  ].filter(Boolean).join(' ');

  const textareaElement = `<textarea ${textareaAttributes}>${value}</textarea>`;

  return createInputGroupTemplate({
    ...groupOptions,
    label,
    content: textareaElement,
    id: textareaId
  });
}

/**
 * Create select with input group
 */
export function createSelectInputGroup(options = {}) {
  const {
    label = '',
    name = '',
    id = '',
    required = false,
    disabled = false,
    multiple = false,
    size = '',
    options: selectOptions = [],
    value = '',
    placeholder = '',
    ...groupOptions
  } = options;

  const selectId = id || `select-${Date.now()}`;
  const errorId = groupOptions.error ? `${selectId}-error` : '';
  const helpId = groupOptions.help ? `${selectId}-help` : '';

  const selectAttributes = [
    `id="${selectId}"`,
    name ? `name="${name}"` : '',
    required ? 'required' : '',
    disabled ? 'disabled' : '',
    multiple ? 'multiple' : '',
    size ? `size="${size}"` : '',
    'class="tmyl-select"',
    errorId ? `aria-describedby="${errorId}${helpId ? ` ${helpId}` : ''}"` : (helpId ? `aria-describedby="${helpId}"` : ''),
    groupOptions.error ? 'aria-invalid="true"' : ''
  ].filter(Boolean).join(' ');

  const optionsHtml = [
    placeholder && !multiple ? `<option value="" disabled ${!value ? 'selected' : ''}>${placeholder}</option>` : '',
    ...selectOptions.map(option => {
      if (typeof option === 'string') {
        const selected = value === option ? 'selected' : '';
        return `<option value="${option}" ${selected}>${option}</option>`;
      } else {
        const selected = value === option.value ? 'selected' : '';
        const disabled = option.disabled ? 'disabled' : '';
        return `<option value="${option.value}" ${selected} ${disabled}>${option.label || option.value}</option>`;
      }
    })
  ].filter(Boolean).join('\n    ');

  const selectElement = `
    <select ${selectAttributes}>
      ${optionsHtml}
    </select>
  `;

  return createInputGroupTemplate({
    ...groupOptions,
    label,
    content: selectElement,
    id: selectId
  });
}

/**
 * Create checkbox with input group
 */
export function createCheckboxInputGroup(options = {}) {
  const {
    label = '',
    name = '',
    id = '',
    value = '',
    checked = false,
    required = false,
    disabled = false,
    ...groupOptions
  } = options;

  const checkboxId = id || `checkbox-${Date.now()}`;
  const errorId = groupOptions.error ? `${checkboxId}-error` : '';
  const helpId = groupOptions.help ? `${checkboxId}-help` : '';

  const checkboxAttributes = [
    'type="checkbox"',
    `id="${checkboxId}"`,
    name ? `name="${name}"` : '',
    value ? `value="${value}"` : '',
    checked ? 'checked' : '',
    required ? 'required' : '',
    disabled ? 'disabled' : '',
    'class="tmyl-checkbox"',
    errorId ? `aria-describedby="${errorId}${helpId ? ` ${helpId}` : ''}"` : (helpId ? `aria-describedby="${helpId}"` : ''),
    groupOptions.error ? 'aria-invalid="true"' : ''
  ].filter(Boolean).join(' ');

  const checkboxElement = `<input ${checkboxAttributes} />`;

  return createInputGroupTemplate({
    ...groupOptions,
    label,
    content: checkboxElement,
    variant: 'inline',
    id: checkboxId
  });
}

/**
 * Create radio group with input group
 */
export function createRadioInputGroup(options = {}) {
  const {
    label = '',
    name = '',
    options: radioOptions = [],
    value = '',
    required = false,
    disabled = false,
    inline = false,
    ...groupOptions
  } = options;

  const groupId = `radio-group-${Date.now()}`;
  const errorId = groupOptions.error ? `${groupId}-error` : '';
  const helpId = groupOptions.help ? `${groupId}-help` : '';

  const radioElements = radioOptions.map((option, index) => {
    const radioId = `${groupId}-${index}`;
    const optionValue = typeof option === 'string' ? option : option.value;
    const optionLabel = typeof option === 'string' ? option : option.label || option.value;
    const optionDisabled = (typeof option === 'object' && option.disabled) || disabled;
    const checked = value === optionValue;

    const radioAttributes = [
      'type="radio"',
      `id="${radioId}"`,
      name ? `name="${name}"` : '',
      `value="${optionValue}"`,
      checked ? 'checked' : '',
      required ? 'required' : '',
      optionDisabled ? 'disabled' : '',
      'class="tmyl-radio"',
      errorId ? `aria-describedby="${errorId}${helpId ? ` ${helpId}` : ''}"` : (helpId ? `aria-describedby="${helpId}"` : ''),
      groupOptions.error ? 'aria-invalid="true"' : ''
    ].filter(Boolean).join(' ');

    return `
      <div class="tmyl-radio-option ${inline ? 'tmyl-radio-option--inline' : ''}">
        <input ${radioAttributes} />
        <label for="${radioId}" class="tmyl-radio-label">${optionLabel}</label>
      </div>
    `;
  }).join('\n');

  return createInputGroupTemplate({
    ...groupOptions,
    label,
    content: `<div class="tmyl-radio-group" role="radiogroup">${radioElements}</div>`,
    id: groupId
  });
}

export default {
  createInputGroupTemplate,
  createTextInputGroup,
  createTextareaInputGroup,
  createSelectInputGroup,
  createCheckboxInputGroup,
  createRadioInputGroup
};
