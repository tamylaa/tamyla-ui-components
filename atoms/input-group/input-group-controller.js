/**
 * Input Group Atom Controller
 * Form field grouping behavior and validation management
 */

export class InputGroupController {
  constructor(options = {}) {
    this.options = {
      autoValidate: true,
      validateOnChange: true,
      validateOnBlur: true,
      showValidationIcons: true,
      debounceValidation: 300,
      ...options
    };

    this.element = null;
    this.inputElement = null;
    this.labelElement = null;
    this.errorElement = null;
    this.helpElement = null;

    this.state = {
      isValid: true,
      isDirty: false,
      isTouched: false,
      isLoading: false,
      value: '',
      errors: [],
      validationRules: []
    };

    this.validationTimeout = null;
    this.eventListeners = new Map();
  }

  /**
   * Initialize the input group controller
   */
  initialize(element) {
    if (!element) {
      throw new Error('InputGroup: Element is required for initialization');
    }

    this.element = element;
    this.findElements();
    this.bindEvents();
    this.setupInitialState();
    this.setupAccessibility();

    return this;
  }

  /**
   * Find child elements
   */
  findElements() {
    this.inputElement = this.element.querySelector('input, textarea, select');
    this.labelElement = this.element.querySelector('.tmyl-input-group__label');
    this.errorElement = this.element.querySelector('.tmyl-input-group__error');
    this.helpElement = this.element.querySelector('.tmyl-input-group__help');
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    if (this.inputElement) {
      this.addEventListener(this.inputElement, 'input', this.handleInput.bind(this));
      this.addEventListener(this.inputElement, 'change', this.handleChange.bind(this));
      this.addEventListener(this.inputElement, 'blur', this.handleBlur.bind(this));
      this.addEventListener(this.inputElement, 'focus', this.handleFocus.bind(this));
      this.addEventListener(this.inputElement, 'keydown', this.handleKeyDown.bind(this));
    }

    if (this.labelElement) {
      this.addEventListener(this.labelElement, 'click', this.handleLabelClick.bind(this));
    }
  }

  /**
   * Add event listener with cleanup tracking
   */
  addEventListener(element, type, handler) {
    element.addEventListener(type, handler);

    if (!this.eventListeners.has(element)) {
      this.eventListeners.set(element, []);
    }
    this.eventListeners.get(element).push({ type, handler });
  }

  /**
   * Setup initial state
   */
  setupInitialState() {
    if (this.inputElement) {
      this.state.value = this.inputElement.value || '';
      this.updateState({ value: this.state.value });
    }
  }

  /**
   * Setup accessibility attributes
   */
  setupAccessibility() {
    if (this.inputElement) {
      // Link input to error message
      if (this.errorElement && !this.inputElement.getAttribute('aria-describedby')) {
        const errorId = this.errorElement.id || `error-${Date.now()}`;
        this.errorElement.id = errorId;

        const existingDescribedBy = this.inputElement.getAttribute('aria-describedby') || '';
        const describedBy = existingDescribedBy
          ? `${existingDescribedBy} ${errorId}`
          : errorId;

        this.inputElement.setAttribute('aria-describedby', describedBy);
      }

      // Link input to help text
      if (this.helpElement && this.helpElement.id) {
        const helpId = this.helpElement.id;
        const existingDescribedBy = this.inputElement.getAttribute('aria-describedby') || '';

        if (!existingDescribedBy.includes(helpId)) {
          const describedBy = existingDescribedBy
            ? `${existingDescribedBy} ${helpId}`
            : helpId;

          this.inputElement.setAttribute('aria-describedby', describedBy);
        }
      }
    }
  }

  /**
   * Handle input events
   */
  handleInput(event) {
    const value = event.target.value;
    this.updateState({
      value,
      isDirty: true
    });

    if (this.options.validateOnChange && this.options.autoValidate) {
      this.debouncedValidate();
    }

    this.emit('input', { value, element: this.element });
  }

  /**
   * Handle change events
   */
  handleChange(event) {
    const value = event.target.value;
    this.updateState({ value });

    if (this.options.validateOnChange && this.options.autoValidate) {
      this.validate();
    }

    this.emit('change', { value, element: this.element });
  }

  /**
   * Handle blur events
   */
  handleBlur(event) {
    this.updateState({ isTouched: true });

    if (this.options.validateOnBlur && this.options.autoValidate) {
      this.validate();
    }

    this.emit('blur', { value: this.state.value, element: this.element });
  }

  /**
   * Handle focus events
   */
  handleFocus(event) {
    this.emit('focus', { value: this.state.value, element: this.element });
  }

  /**
   * Handle keydown events
   */
  handleKeyDown(event) {
    if (event.key === 'Enter') {
      this.validate();
      this.emit('submit', { value: this.state.value, element: this.element });
    }

    this.emit('keydown', {
      key: event.key,
      value: this.state.value,
      element: this.element
    });
  }

  /**
   * Handle label click
   */
  handleLabelClick(event) {
    if (this.inputElement) {
      this.inputElement.focus();
    }
  }

  /**
   * Update component state
   */
  updateState(newState) {
    const oldState = { ...this.state };
    this.state = { ...this.state, ...newState };

    // Update UI based on state changes
    this.updateErrorDisplay();
    this.updateValidationClasses();

    this.emit('stateChange', {
      oldState,
      newState: this.state,
      element: this.element
    });
  }

  /**
   * Debounced validation
   */
  debouncedValidate() {
    if (this.validationTimeout) {
      clearTimeout(this.validationTimeout);
    }

    this.validationTimeout = setTimeout(() => {
      this.validate();
    }, this.options.debounceValidation);
  }

  /**
   * Validate the input
   */
  validate() {
    if (!this.inputElement) return true;

    const value = this.inputElement.value;
    const errors = [];

    // Required validation
    if (this.inputElement.hasAttribute('required') && !value.trim()) {
      errors.push('This field is required');
    }

    // Type-specific validation
    if (value && this.inputElement.type === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errors.push('Please enter a valid email address');
      }
    }

    if (value && this.inputElement.type === 'url') {
      try {
        new URL(value);
      } catch {
        errors.push('Please enter a valid URL');
      }
    }

    // Length validation
    const minLength = this.inputElement.getAttribute('minlength');
    if (minLength && value.length < parseInt(minLength)) {
      errors.push(`Must be at least ${minLength} characters`);
    }

    const maxLength = this.inputElement.getAttribute('maxlength');
    if (maxLength && value.length > parseInt(maxLength)) {
      errors.push(`Must be no more than ${maxLength} characters`);
    }

    // Pattern validation
    const pattern = this.inputElement.getAttribute('pattern');
    if (pattern && value && !new RegExp(pattern).test(value)) {
      errors.push('Please match the requested format');
    }

    // Custom validation rules
    for (const rule of this.state.validationRules) {
      const result = rule.validate(value, this.inputElement);
      if (result !== true) {
        errors.push(typeof result === 'string' ? result : rule.message);
      }
    }

    const isValid = errors.length === 0;

    this.updateState({
      isValid,
      errors
    });

    this.emit('validate', {
      isValid,
      errors,
      value,
      element: this.element
    });

    return isValid;
  }

  /**
   * Update error display
   */
  updateErrorDisplay() {
    if (!this.errorElement) return;

    if (this.state.errors.length > 0) {
      this.errorElement.textContent = this.state.errors[0];
      this.errorElement.style.display = 'block';

      if (this.inputElement) {
        this.inputElement.setAttribute('aria-invalid', 'true');
      }
    } else {
      this.errorElement.style.display = 'none';

      if (this.inputElement) {
        this.inputElement.removeAttribute('aria-invalid');
      }
    }
  }

  /**
   * Update validation classes
   */
  updateValidationClasses() {
    if (!this.element) return;

    this.element.classList.toggle('tmyl-input-group--error', !this.state.isValid);
    this.element.classList.toggle('tmyl-input-group--valid', this.state.isValid && this.state.isDirty);
    this.element.classList.toggle('tmyl-input-group--touched', this.state.isTouched);
    this.element.classList.toggle('tmyl-input-group--dirty', this.state.isDirty);
  }

  /**
   * Add validation rule
   */
  addValidationRule(rule) {
    if (typeof rule.validate !== 'function') {
      throw new Error('Validation rule must have a validate function');
    }

    this.state.validationRules.push(rule);

    if (this.options.autoValidate && this.state.isDirty) {
      this.validate();
    }

    return this;
  }

  /**
   * Remove validation rule
   */
  removeValidationRule(ruleName) {
    this.state.validationRules = this.state.validationRules.filter(
      rule => rule.name !== ruleName
    );

    if (this.options.autoValidate) {
      this.validate();
    }

    return this;
  }

  /**
   * Set loading state
   */
  setLoading(loading = true) {
    this.updateState({ isLoading: loading });
    this.element.classList.toggle('tmyl-input-group--loading', loading);

    if (this.inputElement) {
      this.inputElement.disabled = loading;
    }

    return this;
  }

  /**
   * Set error message
   */
  setError(message) {
    this.updateState({
      isValid: !message,
      errors: message ? [message] : []
    });

    return this;
  }

  /**
   * Clear errors
   */
  clearErrors() {
    this.updateState({
      isValid: true,
      errors: []
    });

    return this;
  }

  /**
   * Get form data
   */
  getValue() {
    return this.state.value;
  }

  /**
   * Set form value
   */
  setValue(value) {
    if (this.inputElement) {
      this.inputElement.value = value;
      this.updateState({ value });

      if (this.options.autoValidate) {
        this.validate();
      }
    }

    return this;
  }

  /**
   * Reset the input group
   */
  reset() {
    if (this.inputElement) {
      this.inputElement.value = '';
    }

    this.updateState({
      isValid: true,
      isDirty: false,
      isTouched: false,
      value: '',
      errors: []
    });

    return this;
  }

  /**
   * Get state
   */
  getState() {
    return { ...this.state };
  }

  /**
   * Emit custom event
   */
  emit(eventName, detail) {
    if (this.element) {
      const event = new CustomEvent(`tmyl-input-group:${eventName}`, {
        detail,
        bubbles: true,
        cancelable: true
      });

      this.element.dispatchEvent(event);
    }
  }

  /**
   * Destroy the controller
   */
  destroy() {
    // Clear validation timeout
    if (this.validationTimeout) {
      clearTimeout(this.validationTimeout);
    }

    // Remove event listeners
    this.eventListeners.forEach((listeners, element) => {
      listeners.forEach(({ type, handler }) => {
        element.removeEventListener(type, handler);
      });
    });

    this.eventListeners.clear();

    // Clear references
    this.element = null;
    this.inputElement = null;
    this.labelElement = null;
    this.errorElement = null;
    this.helpElement = null;
  }
}

export default InputGroupController;
