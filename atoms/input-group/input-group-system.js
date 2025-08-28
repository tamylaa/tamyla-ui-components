/**
 * Input Group Atom System
 * Complete form field grouping factory with validation and accessibility
 */

import {
  createInputGroupTemplate,
  createTextInputGroup,
  createTextareaInputGroup,
  createSelectInputGroup,
  createCheckboxInputGroup,
  createRadioInputGroup
} from './input-group-template.js';
import { InputGroupController } from './input-group-controller.js';

/**
 * Input Group Factory
 * Creates modular form field groups with separated concerns
 */
export function InputGroupFactory(props = {}) {
  const {
    // Input configuration
    type = 'text', // text, textarea, select, checkbox, radio, email, password, tel, url
    label = '',
    placeholder = '',
    value = '',
    name = '',
    id = '',

    // Behavior
    required = false,
    disabled = false,
    readonly = false,
    autoValidate = true,
    validateOnChange = true,
    validateOnBlur = true,

    // Styling
    size = 'medium', // small, medium, large
    variant = 'default', // default, inline, compact

    // Content
    error = '',
    help = '',

    // Validation
    validationRules = [],

    // Select/Radio specific
    options = [],
    multiple = false,

    // Textarea specific
    rows = 3,
    resize = 'vertical',

    // Event handlers
    onInput,
    onChange,
    onBlur,
    onFocus,
    onValidate,
    onSubmit,

    // Container
    container = null
  } = props;

  let element = null;
  let controller = null;

  /**
   * Factory API
   */
  const factory = {
    // Core methods
    render,
    focus,
    blur,
    destroy,

    // Value management
    getValue,
    setValue,
    reset,

    // Validation management
    validate,
    addValidationRule,
    removeValidationRule,
    setError,
    clearErrors,

    // State management
    setLoading,
    setDisabled,
    setReadonly,

    // Getters
    getController: () => controller,
    getElement: () => element,
    getState: () => controller?.getState() || {},
    isValid: () => controller?.getState().isValid || true
  };

  /**
   * Render the input group
   */
  function render(targetContainer = container) {
    // Create element based on type
    element = createElement();

    // Initialize controller
    controller = new InputGroupController({
      autoValidate,
      validateOnChange,
      validateOnBlur,
      onInput,
      onChange,
      onBlur,
      onFocus,
      onValidate,
      onSubmit
    });

    controller.initialize(element);

    // Add validation rules
    validationRules.forEach(rule => {
      controller.addValidationRule(rule);
    });

    // Load CSS
    loadStyles();

    // Set initial value if provided
    if (value) {
      controller.setValue(value);
    }

    // Set initial error if provided
    if (error) {
      controller.setError(error);
    }

    // Add to container
    if (typeof targetContainer === 'string') {
      targetContainer = document.querySelector(targetContainer);
    }

    if (targetContainer) {
      targetContainer.appendChild(element);
    }

    return factory;
  }

  /**
   * Create input group element
   */
  function createElement() {
    const inputId = id || `input-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    let template;
    const baseOptions = {
      label,
      id: inputId,
      name: name || inputId,
      value,
      placeholder,
      required,
      disabled,
      readonly,
      size,
      variant,
      error,
      help
    };

    switch (type) {
    case 'textarea':
      template = createTextareaInputGroup({
        ...baseOptions,
        rows,
        resize
      });
      break;

    case 'select':
      template = createSelectInputGroup({
        ...baseOptions,
        options,
        multiple
      });
      break;

    case 'checkbox':
      template = createCheckboxInputGroup({
        ...baseOptions,
        checked: !!value
      });
      break;

    case 'radio':
      template = createRadioInputGroup({
        ...baseOptions,
        options,
        value
      });
      break;

    default:
      template = createTextInputGroup({
        ...baseOptions,
        type
      });
      break;
    }

    const wrapper = document.createElement('div');
    wrapper.innerHTML = template;

    return wrapper.firstElementChild;
  }

  /**
   * Load component styles
   */
  function loadStyles() {
    const styleId = 'tmyl-input-group-styles';

    if (!document.getElementById(styleId)) {
      const link = document.createElement('link');
      link.id = styleId;
      link.rel = 'stylesheet';
      link.href = new URL('./input-group.css', import.meta.url).href;
      document.head.appendChild(link);
    }
  }

  /**
   * Focus the input
   */
  function focus() {
    if (controller && controller.inputElement) {
      controller.inputElement.focus();
    }
    return factory;
  }

  /**
   * Blur the input
   */
  function blur() {
    if (controller && controller.inputElement) {
      controller.inputElement.blur();
    }
    return factory;
  }

  /**
   * Get input value
   */
  function getValue() {
    return controller ? controller.getValue() : '';
  }

  /**
   * Set input value
   */
  function setValue(newValue) {
    if (controller) {
      controller.setValue(newValue);
    }
    return factory;
  }

  /**
   * Reset the input group
   */
  function reset() {
    if (controller) {
      controller.reset();
    }
    return factory;
  }

  /**
   * Validate the input
   */
  function validate() {
    return controller ? controller.validate() : true;
  }

  /**
   * Add validation rule
   */
  function addValidationRule(rule) {
    if (controller) {
      controller.addValidationRule(rule);
    }
    return factory;
  }

  /**
   * Remove validation rule
   */
  function removeValidationRule(ruleName) {
    if (controller) {
      controller.removeValidationRule(ruleName);
    }
    return factory;
  }

  /**
   * Set error message
   */
  function setError(message) {
    if (controller) {
      controller.setError(message);
    }
    return factory;
  }

  /**
   * Clear errors
   */
  function clearErrors() {
    if (controller) {
      controller.clearErrors();
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
   * Set disabled state
   */
  function setDisabled(disabled = true) {
    if (controller && controller.inputElement) {
      controller.inputElement.disabled = disabled;
      element.classList.toggle('tmyl-input-group--disabled', disabled);
    }
    return factory;
  }

  /**
   * Set readonly state
   */
  function setReadonly(readonly = true) {
    if (controller && controller.inputElement) {
      controller.inputElement.readonly = readonly;
      element.classList.toggle('tmyl-input-group--readonly', readonly);
    }
    return factory;
  }

  /**
   * Destroy the input group
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
 * Convenience functions for common input types
 */

/**
 * Create text input group
 */
export function createTextInput(label, options = {}) {
  return InputGroupFactory({
    type: 'text',
    label,
    ...options
  });
}

/**
 * Create email input group
 */
export function createEmailInput(label, options = {}) {
  return InputGroupFactory({
    type: 'email',
    label,
    placeholder: options.placeholder || 'Enter email address',
    ...options
  });
}

/**
 * Create password input group
 */
export function createPasswordInput(label, options = {}) {
  return InputGroupFactory({
    type: 'password',
    label,
    placeholder: options.placeholder || 'Enter password',
    ...options
  });
}

/**
 * Create textarea input group
 */
export function createTextareaInput(label, options = {}) {
  return InputGroupFactory({
    type: 'textarea',
    label,
    placeholder: options.placeholder || 'Enter text',
    ...options
  });
}

/**
 * Create select input group
 */
export function createSelectInput(label, options = [], inputOptions = {}) {
  return InputGroupFactory({
    type: 'select',
    label,
    options,
    ...inputOptions
  });
}

/**
 * Create checkbox input group
 */
export function createCheckboxInput(label, options = {}) {
  return InputGroupFactory({
    type: 'checkbox',
    label,
    variant: 'inline',
    ...options
  });
}

/**
 * Create radio group input
 */
export function createRadioInput(label, options = [], inputOptions = {}) {
  return InputGroupFactory({
    type: 'radio',
    label,
    options,
    ...inputOptions
  });
}

/**
 * Input Group Manager for handling multiple related inputs
 */
export class InputGroupManager {
  constructor(options = {}) {
    this.options = {
      validateOnSubmit: true,
      showSummaryErrors: true,
      scrollToFirstError: true,
      ...options
    };

    this.inputGroups = new Map();
    this.formElement = null;
  }

  /**
   * Add input group to manager
   */
  add(name, inputGroup) {
    this.inputGroups.set(name, inputGroup);

    // Listen for validation events
    if (inputGroup.getElement()) {
      inputGroup.getElement().addEventListener('tmyl-input-group:validate', (e) => {
        this.handleValidation(name, e.detail);
      });
    }

    return this;
  }

  /**
   * Remove input group from manager
   */
  remove(name) {
    const inputGroup = this.inputGroups.get(name);
    if (inputGroup) {
      inputGroup.destroy();
      this.inputGroups.delete(name);
    }
    return this;
  }

  /**
   * Get input group by name
   */
  get(name) {
    return this.inputGroups.get(name);
  }

  /**
   * Validate all input groups
   */
  validateAll() {
    let isValid = true;
    const errors = {};

    this.inputGroups.forEach((inputGroup, name) => {
      const groupValid = inputGroup.validate();
      if (!groupValid) {
        isValid = false;
        errors[name] = inputGroup.getState().errors;
      }
    });

    if (!isValid && this.options.scrollToFirstError) {
      this.scrollToFirstError();
    }

    return { isValid, errors };
  }

  /**
   * Get form data from all input groups
   */
  getFormData() {
    const data = {};

    this.inputGroups.forEach((inputGroup, name) => {
      data[name] = inputGroup.getValue();
    });

    return data;
  }

  /**
   * Set form data for all input groups
   */
  setFormData(data) {
    Object.entries(data).forEach(([name, value]) => {
      const inputGroup = this.inputGroups.get(name);
      if (inputGroup) {
        inputGroup.setValue(value);
      }
    });

    return this;
  }

  /**
   * Reset all input groups
   */
  resetAll() {
    this.inputGroups.forEach(inputGroup => {
      inputGroup.reset();
    });

    return this;
  }

  /**
   * Handle validation events
   */
  handleValidation(name, validationResult) {
    // Emit form-level validation event
    if (this.formElement) {
      const event = new CustomEvent('form:validation', {
        detail: { name, ...validationResult },
        bubbles: true
      });

      this.formElement.dispatchEvent(event);
    }
  }

  /**
   * Scroll to first error
   */
  scrollToFirstError() {
    for (const [name, inputGroup] of this.inputGroups) {
      if (!inputGroup.isValid()) {
        const element = inputGroup.getElement();
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
          inputGroup.focus();
          break;
        }
      }
    }
  }

  /**
   * Destroy all input groups
   */
  destroyAll() {
    this.inputGroups.forEach(inputGroup => {
      inputGroup.destroy();
    });

    this.inputGroups.clear();
  }
}

// Default convenience functions
export const inputGroup = {
  text: (label, options) => createTextInput(label, options),
  email: (label, options) => createEmailInput(label, options),
  password: (label, options) => createPasswordInput(label, options),
  textarea: (label, options) => createTextareaInput(label, options),
  select: (label, options, inputOptions) => createSelectInput(label, options, inputOptions),
  checkbox: (label, options) => createCheckboxInput(label, options),
  radio: (label, options, inputOptions) => createRadioInput(label, options, inputOptions)
};

export default InputGroupFactory;
