/**
 * Input Controller - Pure event handling and behavior logic
 * Framework-agnostic input functionality that can be attached to any input element
 */

import { inputIcons } from '../icons/input-icons.js';

/**
 * Base Input Controller - Handles common input behaviors
 */
export class InputController {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      // Default options
      validateOnBlur: true,
      validateOnInput: false,
      clearable: false,
      autoComplete: true,
      debounceDelay: 300,
      maxLength: null,
      minLength: null,
      pattern: null,
      required: false,
      ...options
    };

    this.validators = [];
    this.listeners = [];
    this.debounceTimer = null;
    this.value = element.value || '';

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupValidation();
    this.setupClearButton();
    this.setupAutoResize();
    this.emitReady();
  }

  setupEventListeners() {
    // Input event with debouncing
    this.addListener('input', (event) => {
      this.value = event.target.value;
      this.handleInput(event);

      if (this.options.validateOnInput) {
        this.debounceValidation();
      }

      this.updateClearButton();
      this.handleAutoResize();
    });

    // Blur event for validation
    this.addListener('blur', (event) => {
      if (this.options.validateOnBlur) {
        this.validate();
      }
      this.emit('blur', { value: this.value });
    });

    // Focus event
    this.addListener('focus', (event) => {
      this.emit('focus', { value: this.value });
    });

    // Keydown for special handling
    this.addListener('keydown', (event) => {
      this.handleKeydown(event);
    });

    // Paste event
    this.addListener('paste', (event) => {
      setTimeout(() => {
        this.value = event.target.value;
        this.handleInput(event);
        this.validate();
      }, 0);
    });
  }

  setupValidation() {
    // Add built-in validators based on options
    if (this.options.required) {
      this.addValidator((value) => {
        if (!value || value.trim() === '') {
          return 'This field is required';
        }
        return null;
      });
    }

    if (this.options.minLength) {
      this.addValidator((value) => {
        if (value && value.length < this.options.minLength) {
          return `Minimum length is ${this.options.minLength} characters`;
        }
        return null;
      });
    }

    if (this.options.maxLength) {
      this.addValidator((value) => {
        if (value && value.length > this.options.maxLength) {
          return `Maximum length is ${this.options.maxLength} characters`;
        }
        return null;
      });
    }

    if (this.options.pattern) {
      this.addValidator((value) => {
        if (value && !this.options.pattern.test(value)) {
          return 'Please enter a valid format';
        }
        return null;
      });
    }

    // Email validation for email inputs
    if (this.element.type === 'email') {
      this.addValidator((value) => {
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Please enter a valid email address';
        }
        return null;
      });
    }

    // URL validation for url inputs
    if (this.element.type === 'url') {
      this.addValidator((value) => {
        if (value) {
          try {
            new URL(value);
          } catch {
            return 'Please enter a valid URL';
          }
        }
        return null;
      });
    }
  }

  setupClearButton() {
    if (!this.options.clearable) return;

    const wrapper = this.element.closest('.tmyl-input');
    if (!wrapper) return;

    let clearButton = wrapper.querySelector('.tmyl-input__clear');
    if (!clearButton) {
      clearButton = document.createElement('button');
      clearButton.type = 'button';
      clearButton.className = 'tmyl-input__clear';
      clearButton.innerHTML = inputIcons.x;
      clearButton.setAttribute('aria-label', 'Clear input');
      wrapper.appendChild(clearButton);
    }

    clearButton.addEventListener('click', () => {
      this.clear();
    });

    this.clearButton = clearButton;
    this.updateClearButton();
  }

  setupAutoResize() {
    if (this.element.tagName !== 'TEXTAREA') return;
    if (!this.element.closest('.tmyl-textarea--auto-resize')) return;

    this.handleAutoResize();
  }

  handleInput(event) {
    this.emit('input', {
      value: this.value,
      event
    });
  }

  handleKeydown(event) {
    // Enter key handling
    if (event.key === 'Enter') {
      if (this.element.tagName !== 'TEXTAREA' || event.ctrlKey || event.metaKey) {
        this.emit('enter', { value: this.value, event });
      }
    }

    // Escape key handling
    if (event.key === 'Escape') {
      this.element.blur();
      this.emit('escape', { value: this.value, event });
    }

    this.emit('keydown', { key: event.key, value: this.value, event });
  }

  handleAutoResize() {
    if (this.element.tagName !== 'TEXTAREA') return;

    // Reset height to auto to get the scrollHeight
    this.element.style.height = 'auto';

    // Set height to scrollHeight to fit content
    this.element.style.height = this.element.scrollHeight + 'px';
  }

  updateClearButton() {
    if (!this.clearButton) return;

    if (this.value && !this.element.disabled && !this.element.readOnly) {
      this.clearButton.style.display = 'block';
    } else {
      this.clearButton.style.display = 'none';
    }
  }

  debounceValidation() {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.validate();
    }, this.options.debounceDelay);
  }

  // Public Methods
  addValidator(validator) {
    if (typeof validator === 'function') {
      this.validators.push(validator);
    }
  }

  removeValidator(validator) {
    const index = this.validators.indexOf(validator);
    if (index > -1) {
      this.validators.splice(index, 1);
    }
  }

  validate() {
    const errors = [];

    for (const validator of this.validators) {
      const error = validator(this.value);
      if (error) {
        errors.push(error);
      }
    }

    const isValid = errors.length === 0;
    this.setError(isValid ? null : errors[0]);

    this.emit('validate', {
      isValid,
      errors,
      value: this.value
    });

    return isValid;
  }

  setError(errorMessage) {
    const wrapper = this.element.closest('.tmyl-input-group, .tmyl-input');
    if (!wrapper) return;

    // Remove existing error
    const existingError = wrapper.querySelector('.tmyl-input__error');
    if (existingError) {
      existingError.remove();
    }

    // Remove error classes
    this.element.classList.remove('tmyl-input--error');
    wrapper.classList.remove('tmyl-input--error');

    if (errorMessage) {
      // Add error message
      const errorElement = document.createElement('div');
      errorElement.className = 'tmyl-input__error';
      errorElement.innerHTML = `
        ${inputIcons.exclamation}
        <span>${errorMessage}</span>
      `;

      // Insert after input or wrapper
      const insertAfter = wrapper.querySelector('.tmyl-input') || this.element;
      insertAfter.parentNode.insertBefore(errorElement, insertAfter.nextSibling);

      // Add error classes
      this.element.classList.add('tmyl-input--error');
      wrapper.classList.add('tmyl-input--error');

      // Set aria attributes
      if (!errorElement.id) {
        errorElement.id = `${this.element.id || 'input'}-error`;
      }
      this.element.setAttribute('aria-describedby', errorElement.id);
      this.element.setAttribute('aria-invalid', 'true');
    } else {
      this.element.removeAttribute('aria-invalid');
    }
  }

  setValue(newValue) {
    this.value = newValue;
    this.element.value = newValue;
    this.updateClearButton();
    this.handleAutoResize();
    this.emit('change', { value: this.value });
  }

  clear() {
    this.setValue('');
    this.element.focus();
    this.emit('clear');
  }

  focus() {
    this.element.focus();
  }

  blur() {
    this.element.blur();
  }

  disable() {
    this.element.disabled = true;
    this.updateClearButton();
  }

  enable() {
    this.element.disabled = false;
    this.updateClearButton();
  }

  setLoading(loading) {
    const wrapper = this.element.closest('.tmyl-input');
    if (!wrapper) return;

    if (loading) {
      wrapper.classList.add('tmyl-input--loading');

      let loadingElement = wrapper.querySelector('.tmyl-input__loading');
      if (!loadingElement) {
        loadingElement = document.createElement('span');
        loadingElement.className = 'tmyl-input__loading';
        loadingElement.innerHTML = '<span class="tmyl-spinner"></span>';
        wrapper.appendChild(loadingElement);
      }
    } else {
      wrapper.classList.remove('tmyl-input--loading');
      const loadingElement = wrapper.querySelector('.tmyl-input__loading');
      if (loadingElement) {
        loadingElement.remove();
      }
    }
  }

  // Event handling
  addListener(event, handler) {
    this.element.addEventListener(event, handler);
    this.listeners.push({ event, handler });
  }

  emit(eventName, detail = {}) {
    const event = new CustomEvent(`tmyl-input:${eventName}`, {
      detail: { ...detail, controller: this },
      bubbles: true,
      cancelable: true
    });
    this.element.dispatchEvent(event);
    return event;
  }

  emitReady() {
    this.emit('ready', { value: this.value });
  }

  // Cleanup
  destroy() {
    // Remove all event listeners
    this.listeners.forEach(({ event, handler }) => {
      this.element.removeEventListener(event, handler);
    });

    // Clear timers
    clearTimeout(this.debounceTimer);

    // Remove clear button
    if (this.clearButton) {
      this.clearButton.remove();
    }

    this.emit('destroy');
  }
}

/**
 * Specialized Input Controllers
 */

// Password Input Controller
export class PasswordInputController extends InputController {
  constructor(element, options = {}) {
    super(element, {
      toggleVisibility: true,
      strengthMeter: false,
      ...options
    });

    this.isVisible = false;
    this.setupPasswordFeatures();
  }

  setupPasswordFeatures() {
    if (this.options.toggleVisibility) {
      this.setupVisibilityToggle();
    }

    if (this.options.strengthMeter) {
      this.setupStrengthMeter();
    }
  }

  setupVisibilityToggle() {
    const wrapper = this.element.closest('.tmyl-input');
    if (!wrapper) return;

    const toggleButton = document.createElement('button');
    toggleButton.type = 'button';
    toggleButton.className = 'tmyl-input__toggle';
    toggleButton.innerHTML = inputIcons.eye;
    toggleButton.setAttribute('aria-label', 'Toggle password visibility');

    toggleButton.addEventListener('click', () => {
      this.toggleVisibility();
    });

    wrapper.appendChild(toggleButton);
    this.toggleButton = toggleButton;
  }

  toggleVisibility() {
    this.isVisible = !this.isVisible;
    this.element.type = this.isVisible ? 'text' : 'password';

    if (this.toggleButton) {
      this.toggleButton.innerHTML = this.isVisible ? inputIcons.eyeOff : inputIcons.eye;
      this.toggleButton.setAttribute('aria-label',
        this.isVisible ? 'Hide password' : 'Show password'
      );
    }

    this.emit('visibility-toggle', { isVisible: this.isVisible });
  }

  setupStrengthMeter() {
    // Add password strength validation
    this.addValidator((value) => {
      const strength = this.calculateStrength(value);
      this.updateStrengthMeter(strength);
      return null; // Don't show as error, just visual feedback
    });
  }

  calculateStrength(password) {
    let score = 0;

    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    return {
      score,
      level: score < 2 ? 'weak' : score < 4 ? 'medium' : 'strong'
    };
  }

  updateStrengthMeter(strength) {
    // Implementation depends on UI requirements
    this.emit('strength-change', strength);
  }
}

// Search Input Controller
export class SearchInputController extends InputController {
  constructor(element, options = {}) {
    super(element, {
      clearable: true,
      debounceDelay: 300,
      minSearchLength: 1,
      ...options
    });

    this.searchHistory = [];
    this.suggestions = [];
  }

  handleInput(event) {
    super.handleInput(event);

    if (this.value.length >= this.options.minSearchLength) {
      this.debounceSearch();
    } else {
      this.clearSuggestions();
    }
  }

  debounceSearch() {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      this.performSearch();
    }, this.options.debounceDelay);
  }

  performSearch() {
    this.emit('search', {
      query: this.value,
      history: this.searchHistory
    });
  }

  addToHistory(query) {
    if (query && !this.searchHistory.includes(query)) {
      this.searchHistory.unshift(query);
      this.searchHistory = this.searchHistory.slice(0, 10); // Keep last 10
    }
  }

  setSuggestions(suggestions) {
    this.suggestions = suggestions;
    this.emit('suggestions-update', { suggestions });
  }

  clearSuggestions() {
    this.suggestions = [];
    this.emit('suggestions-clear');
  }
}

// File Input Controller
export class FileInputController extends InputController {
  constructor(element, options = {}) {
    super(element, {
      maxFiles: null,
      maxSize: null, // in bytes
      allowedTypes: null, // array of mime types
      ...options
    });

    this.files = [];
    this.setupFileHandling();
  }

  setupFileHandling() {
    this.addListener('change', (event) => {
      this.handleFileSelection(event);
    });

    // Drag and drop support
    const wrapper = this.element.closest('.tmyl-file-input');
    if (wrapper) {
      this.setupDragAndDrop(wrapper);
    }
  }

  handleFileSelection(event) {
    const files = Array.from(event.target.files);
    const validFiles = this.validateFiles(files);

    this.files = validFiles;
    this.updateFileDisplay();

    this.emit('files-selected', {
      files: validFiles,
      rejected: files.filter(f => !validFiles.includes(f))
    });
  }

  validateFiles(files) {
    return files.filter(file => {
      // Check file count
      if (this.options.maxFiles && files.length > this.options.maxFiles) {
        this.emit('validation-error', {
          type: 'max-files',
          limit: this.options.maxFiles
        });
        return false;
      }

      // Check file size
      if (this.options.maxSize && file.size > this.options.maxSize) {
        this.emit('validation-error', {
          type: 'file-size',
          file,
          limit: this.options.maxSize
        });
        return false;
      }

      // Check file type
      if (this.options.allowedTypes && !this.options.allowedTypes.includes(file.type)) {
        this.emit('validation-error', {
          type: 'file-type',
          file,
          allowed: this.options.allowedTypes
        });
        return false;
      }

      return true;
    });
  }

  setupDragAndDrop(wrapper) {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      wrapper.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
    });

    wrapper.addEventListener('dragenter', () => {
      wrapper.classList.add('tmyl-file-input--drag-over');
    });

    wrapper.addEventListener('dragleave', () => {
      wrapper.classList.remove('tmyl-file-input--drag-over');
    });

    wrapper.addEventListener('drop', (e) => {
      wrapper.classList.remove('tmyl-file-input--drag-over');
      const files = Array.from(e.dataTransfer.files);
      const validFiles = this.validateFiles(files);

      this.files = validFiles;
      this.updateFileDisplay();

      this.emit('files-dropped', {
        files: validFiles,
        rejected: files.filter(f => !validFiles.includes(f))
      });
    });
  }

  updateFileDisplay() {
    const wrapper = this.element.closest('.tmyl-file-input');
    const textElement = wrapper?.querySelector('.tmyl-file-input__text');

    if (textElement) {
      if (this.files.length === 0) {
        textElement.textContent = this.options.placeholder || 'Choose file...';
      } else if (this.files.length === 1) {
        textElement.textContent = this.files[0].name;
      } else {
        textElement.textContent = `${this.files.length} files selected`;
      }
    }
  }
}

export default {
  InputController,
  PasswordInputController,
  SearchInputController,
  FileInputController
};
