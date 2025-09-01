/**
 * Input Factory System - Modular input component creation
 * Creates input components using separated concerns (CSS, JS, HTML, Icons)
 */

import { designTokens } from '../../core/design-tokens.js';
import { sharedUtilities } from '../../core/shared-utilities.js';
import { inputTemplates, createCompleteInputHTML } from './templates/input-template.js';
import {
  InputController,
  PasswordInputController,
  SearchInputController,
  FileInputController
} from './controllers/input-controller.js';
import { inputIcons } from './icons/input-icons.js';

/**
 * Input Factory - Creates input components with full modularity
 */
export class InputFactory {
  constructor() {
    this.defaultProps = {
      variant: 'primary',
      size: 'md',
      type: 'text',
      disabled: false,
      readonly: false,
      required: false,
      clearable: false,
      loading: false
    };

    this.variants = [
      'primary', 'secondary', 'success', 'warning', 'error',
      'ghost', 'minimal'
    ];

    this.sizes = ['xs', 'sm', 'md', 'lg', 'xl'];

    this.inputTypes = [
      'text', 'email', 'password', 'tel', 'url', 'search',
      'number', 'date', 'time', 'datetime-local', 'month', 'week',
      'textarea', 'select', 'file'
    ];

    // Ensure CSS is loaded
    this.ensureCSS();
  }

  /**
   * Set shared foundation from main factory
   */
  setSharedFoundation(tokens, utilities) {
    this.tokens = tokens;
    this.utilities = utilities;
  }

  /**
   * Create an input component
   */
  create(props = {}) {
    const config = { ...this.defaultProps, ...props };

    // Validate configuration
    this.validateConfig(config);

    // Create the input element
    const inputHTML = createCompleteInputHTML(config);

    // Parse HTML and get the input element
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = inputHTML;
    const element = tempContainer.firstElementChild;

    // Find the actual input/textarea/select element
    const inputElement = this.findInputElement(element);

    // Attach controller if needed
    if (config.interactive !== false) {
      this.attachController(inputElement, config);
    }

    // Set up accessibility
    this.setupAccessibility(element, config);

    // Return the complete component
    return element;
  }

  /**
   * Create multiple inputs at once
   */
  createMultiple(inputConfigs) {
    return inputConfigs.map(config => this.create(config));
  }

  /**
   * Create input using template shortcuts
   */
  createFromTemplate(templateName, props = {}) {
    const template = inputTemplates[templateName];
    if (!template) {
      throw new Error(`Template "${templateName}" not found. Available: ${Object.keys(inputTemplates).join(', ')}`);
    }

    const inputHTML = template(props);
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = inputHTML;
    const element = tempContainer.firstElementChild;

    const inputElement = this.findInputElement(element);
    if (props.interactive !== false) {
      this.attachController(inputElement, { templateName, ...props });
    }

    return element;
  }

  /**
   * Create form with multiple inputs
   */
  createForm(formConfig) {
    const { fields = [], className = '', ...formProps } = formConfig;

    const form = document.createElement('form');
    form.className = `tmyl-form ${className}`;

    // Apply form attributes
    Object.entries(formProps).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        form.setAttribute(key, value);
      }
    });

    // Create and add fields
    fields.forEach(fieldConfig => {
      const field = this.create(fieldConfig);
      form.appendChild(field);
    });

    return form;
  }

  /**
   * Create input group (side by side inputs)
   */
  createGroup(groupConfig) {
    const {
      inputs = [],
      orientation = 'horizontal',
      className = ''
    } = groupConfig;

    const container = document.createElement('div');
    container.className = `tmyl-input-stack ${orientation === 'vertical' ? 'tmyl-input-stack--vertical' : ''} ${className}`;

    inputs.forEach(inputConfig => {
      const input = this.create(inputConfig);
      container.appendChild(input);
    });

    return container;
  }

  /**
   * Find the actual input element within a wrapper
   */
  findInputElement(element) {
    // If element is the input itself
    if (this.isInputElement(element)) {
      return element;
    }

    // Search for input element within wrapper
    const inputElement = element.querySelector('input, textarea, select');
    if (!inputElement) {
      throw new Error('No input element found in the created component');
    }

    return inputElement;
  }

  /**
   * Check if element is an input element
   */
  isInputElement(element) {
    const inputTags = ['INPUT', 'TEXTAREA', 'SELECT'];
    return inputTags.includes(element.tagName);
  }

  /**
   * Attach appropriate controller based on input type
   */
  attachController(inputElement, config) {
    let controller;

    switch (config.type) {
    case 'password':
      controller = new PasswordInputController(inputElement, config);
      break;
    case 'search':
      controller = new SearchInputController(inputElement, config);
      break;
    case 'file':
      controller = new FileInputController(inputElement, config);
      break;
    default:
      controller = new InputController(inputElement, config);
    }

    // Store controller reference on element
    inputElement._tmylController = controller;

    return controller;
  }

  /**
   * Setup accessibility attributes
   */
  setupAccessibility(element, config) {
    const inputElement = this.findInputElement(element);
    const wrapper = inputElement.closest('.tmyl-input-group');

    if (!wrapper) return;

    // Find label, helper, and error elements
    const label = wrapper.querySelector('.tmyl-input__label');
    const helper = wrapper.querySelector('.tmyl-input__helper');
    const error = wrapper.querySelector('.tmyl-input__error');

    // Generate IDs if needed
    if (!inputElement.id && (label || helper || error)) {
      inputElement.id = this.generateId('input');
    }

    // Associate label
    if (label && inputElement.id) {
      label.setAttribute('for', inputElement.id);
    }

    // Set up aria-describedby
    const describedBy = [];
    if (helper) {
      if (!helper.id) helper.id = this.generateId('helper');
      describedBy.push(helper.id);
    }
    if (error) {
      if (!error.id) error.id = this.generateId('error');
      describedBy.push(error.id);
    }

    if (describedBy.length > 0) {
      inputElement.setAttribute('aria-describedby', describedBy.join(' '));
    }

    // Set aria-invalid if there's an error
    if (error) {
      inputElement.setAttribute('aria-invalid', 'true');
    }

    // Set aria-required if required
    if (config.required) {
      inputElement.setAttribute('aria-required', 'true');
    }
  }

  /**
   * Generate unique ID
   */
  generateId(prefix = 'tmyl') {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Validate configuration
   */
  validateConfig(config) {
    const errors = [];

    if (config.variant && !this.variants.includes(config.variant)) {
      errors.push(`Invalid variant: ${config.variant}. Available: ${this.variants.join(', ')}`);
    }

    if (config.size && !this.sizes.includes(config.size)) {
      errors.push(`Invalid size: ${config.size}. Available: ${this.sizes.join(', ')}`);
    }

    if (config.type && !this.inputTypes.includes(config.type)) {
      errors.push(`Invalid type: ${config.type}. Available: ${this.inputTypes.join(', ')}`);
    }

    if (errors.length > 0) {
      throw new Error(`Input configuration errors: ${errors.join(', ')}`);
    }
  }

  /**
   * Get available variants
   */
  getVariants() {
    return [...this.variants];
  }

  /**
   * Get available sizes
   */
  getSizes() {
    return [...this.sizes];
  }

  /**
   * Get available input types
   */
  getTypes() {
    return [...this.inputTypes];
  }

  /**
   * Get available templates
   */
  getTemplates() {
    return Object.keys(inputTemplates);
  }

  /**
   * Set default properties
   */
  setDefaults(defaults) {
    this.defaultProps = { ...this.defaultProps, ...defaults };
  }

  /**
   * Ensure CSS is loaded
   */
  ensureCSS() {
    // CSS is now bundled with the main package, no need to dynamically load
    return;
  }

  /**
   * Get controller from input element
   */
  getController(inputElement) {
    return inputElement._tmylController || null;
  }

  /**
   * Update input props dynamically
   */
  updateProps(element, newProps) {
    const inputElement = this.findInputElement(element);
    const controller = this.getController(inputElement);

    // Update basic attributes
    Object.entries(newProps).forEach(([key, value]) => {
      switch (key) {
      case 'value':
        if (controller) {
          controller.setValue(value);
        } else {
          inputElement.value = value;
        }
        break;
      case 'disabled':
        inputElement.disabled = value;
        if (controller) {
          value ? controller.disable() : controller.enable();
        }
        break;
      case 'loading':
        if (controller) {
          controller.setLoading(value);
        }
        break;
      case 'error':
        if (controller) {
          controller.setError(value);
        }
        break;
      default:
        if (value !== null && value !== undefined) {
          inputElement.setAttribute(key, value);
        } else {
          inputElement.removeAttribute(key);
        }
      }
    });

    // Update classes for variant/size changes
    if (newProps.variant || newProps.size) {
      const wrapper = inputElement.closest('.tmyl-input');
      if (wrapper) {
        // Remove old classes
        wrapper.className = wrapper.className.replace(/tmyl-input--\w+/g, '');

        // Add new classes
        const variant = newProps.variant || this.defaultProps.variant;
        const size = newProps.size || this.defaultProps.size;
        wrapper.classList.add(`tmyl-input--${variant}`, `tmyl-input--${size}`);
      }
    }
  }
}

// Convenience methods for direct usage
export const createInput = (props) => new InputFactory().create(props);
export const createPassword = (props) => new InputFactory().createFromTemplate('password', props);
export const createEmail = (props) => new InputFactory().createFromTemplate('email', props);
export const createSearch = (props) => new InputFactory().createFromTemplate('search', props);
export const createTextarea = (props) => new InputFactory().create({ type: 'textarea', ...props });
export const createSelect = (props) => new InputFactory().create({ type: 'select', ...props });
export const createFileInput = (props) => new InputFactory().createFromTemplate('fileUpload', props);

// Export singleton factory
export const inputFactory = new InputFactory();

/**
 * Usage Examples:
 *
 * // Basic input creation
 * const input = createInput({
 *   type: 'email',
 *   label: 'Email',
 *   placeholder: 'Enter your email',
 *   required: true
 * });
 *
 * // Using templates
 * const passwordInput = createPassword({
 *   label: 'Password',
 *   toggleVisibility: true,
 *   strengthMeter: true
 * });
 *
 * // Factory-based creation
 * const form = inputFactory.createForm({
 *   fields: [
 *     { type: 'text', name: 'name', label: 'Name', required: true },
 *     { type: 'email', name: 'email', label: 'Email', required: true },
 *     { type: 'password', name: 'password', label: 'Password', required: true }
 *   ]
 * });
 *
 * // Input group
 * const addressGroup = inputFactory.createGroup({
 *   inputs: [
 *     { type: 'text', placeholder: 'Street', className: 'flex-2' },
 *     { type: 'text', placeholder: 'City', className: 'flex-1' },
 *     { type: 'text', placeholder: 'ZIP', className: 'flex-1' }
 *   ]
 * });
 *
 * // Update props dynamically
 * inputFactory.updateProps(input, {
 *   loading: true,
 *   disabled: true
 * });
 */

export default InputFactory;
