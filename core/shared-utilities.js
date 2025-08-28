/**
 * Shared Utilities - Common functionality for all atomic components
 * Provides consistent behavior and patterns across the design system
 */

import { designTokens, sharedVariants, sharedStates } from './design-tokens.js';

/**
 * CSS Generation Utilities
 */
export const cssUtils = {
  /**
   * Generate CSS custom properties from token values
   */
  generateCSSVariables(tokens, prefix = '--tmyl') {
    const css = [];

    function processTokens(obj, path = []) {
      Object.entries(obj).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          processTokens(value, [...path, key]);
        } else {
          const varName = `${prefix}-${[...path, key].join('-')}`;
          css.push(`  ${varName}: ${value};`);
        }
      });
    }

    processTokens(tokens);
    return css.join('\n');
  },

  /**
   * Generate variant CSS classes
   */
  generateVariantCSS(baseClass, variants) {
    const css = [];

    Object.entries(variants).forEach(([variantName, styles]) => {
      css.push(`.${baseClass}--${variantName} {`);
      Object.entries(styles).forEach(([property, value]) => {
        const cssProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase();
        css.push(`  ${cssProperty}: ${value};`);
      });
      css.push('}');
    });

    return css.join('\n');
  },

  /**
   * Generate size variant CSS
   */
  generateSizeCSS(baseClass, sizes) {
    const css = [];

    Object.entries(sizes).forEach(([sizeName, sizeConfig]) => {
      css.push(`.${baseClass}--${sizeName} {`);
      css.push(`  height: ${sizeConfig.height};`);
      css.push(`  padding: ${sizeConfig.padding};`);
      css.push(`  font-size: ${sizeConfig.fontSize};`);
      css.push('}');

      // Icon sizing within this size variant
      css.push(`.${baseClass}--${sizeName} .${baseClass}__icon {`);
      css.push(`  width: ${sizeConfig.iconSize};`);
      css.push(`  height: ${sizeConfig.iconSize};`);
      css.push('}');
    });

    return css.join('\n');
  },

  /**
   * Generate state CSS (hover, focus, etc.)
   */
  generateStateCSS(baseClass, states) {
    const css = [];

    Object.entries(states).forEach(([stateName, styles]) => {
      const selector = stateName === 'hover' ? ':hover' :
        stateName === 'focus' ? ':focus' :
          stateName === 'active' ? ':active' :
            `.${baseClass}--${stateName}`;

      css.push(`.${baseClass}${selector} {`);
      Object.entries(styles).forEach(([property, value]) => {
        const cssProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase();
        css.push(`  ${cssProperty}: ${value};`);
      });
      css.push('}');
    });

    return css.join('\n');
  }
};

/**
 * DOM Manipulation Utilities
 */
export const domUtils = {
  /**
   * Create element with classes and attributes
   */
  createElement(tag, options = {}) {
    const element = document.createElement(tag);

    if (options.className) {
      element.className = options.className;
    }

    if (options.attributes) {
      Object.entries(options.attributes).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          element.setAttribute(key, value);
        }
      });
    }

    if (options.content) {
      if (typeof options.content === 'string') {
        element.textContent = options.content;
      } else {
        element.appendChild(options.content);
      }
    }

    if (options.innerHTML) {
      element.innerHTML = options.innerHTML;
    }

    return element;
  },

  /**
   * Apply multiple CSS classes conditionally
   */
  applyClasses(element, classMap) {
    Object.entries(classMap).forEach(([className, condition]) => {
      if (condition) {
        element.classList.add(className);
      } else {
        element.classList.remove(className);
      }
    });
  },

  /**
   * Set multiple attributes at once
   */
  setAttributes(element, attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        element.removeAttribute(key);
      } else if (typeof value === 'boolean') {
        if (value) {
          element.setAttribute(key, '');
        } else {
          element.removeAttribute(key);
        }
      } else {
        element.setAttribute(key, value);
      }
    });
  },

  /**
   * Create SVG icon element
   */
  createIcon(iconSVG, options = {}) {
    const wrapper = document.createElement('span');
    wrapper.className = `tmyl-icon ${options.className || ''}`;
    wrapper.innerHTML = iconSVG;

    // Apply icon-specific attributes
    const svg = wrapper.querySelector('svg');
    if (svg) {
      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('focusable', 'false');
      if (options.size) {
        svg.style.width = options.size;
        svg.style.height = options.size;
      }
    }

    return wrapper;
  }
};

/**
 * Event Handling Utilities
 */
export const eventUtils = {
  /**
   * Debounce function calls
   */
  debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func(...args);
    };
  },

  /**
   * Throttle function calls
   */
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * Add event listener with cleanup
   */
  addListener(element, event, handler, options = {}) {
    element.addEventListener(event, handler, options);

    // Return cleanup function
    return () => {
      element.removeEventListener(event, handler, options);
    };
  },

  /**
   * Create event emitter for components
   */
  createEmitter(element) {
    return {
      emit(eventName, detail = {}) {
        const event = new CustomEvent(eventName, {
          detail,
          bubbles: true,
          cancelable: true
        });
        element.dispatchEvent(event);
        return event;
      },

      on(eventName, handler) {
        return eventUtils.addListener(element, eventName, handler);
      }
    };
  }
};

/**
 * Validation Utilities
 */
export const validationUtils = {
  /**
   * Validate component props
   */
  validateProps(props, schema) {
    const errors = [];

    Object.entries(schema).forEach(([key, rules]) => {
      const value = props[key];

      if (rules.required && (value === undefined || value === null)) {
        errors.push(`${key} is required`);
      }

      if (value !== undefined && rules.type && typeof value !== rules.type) {
        errors.push(`${key} must be of type ${rules.type}`);
      }

      if (value !== undefined && rules.enum && !rules.enum.includes(value)) {
        errors.push(`${key} must be one of: ${rules.enum.join(', ')}`);
      }

      if (value !== undefined && rules.pattern && !rules.pattern.test(value)) {
        errors.push(`${key} does not match required pattern`);
      }
    });

    return errors;
  },

  /**
   * Sanitize HTML content
   */
  sanitizeHTML(html) {
    const temp = document.createElement('div');
    temp.textContent = html;
    return temp.innerHTML;
  }
};

/**
 * Animation Utilities
 */
export const animationUtils = {
  /**
   * Create loading spinner
   */
  createSpinner(size = '1rem') {
    const spinner = document.createElement('span');
    spinner.className = 'tmyl-spinner';
    spinner.style.cssText = `
      display: inline-block;
      width: ${size};
      height: ${size};
      border: 2px solid currentColor;
      border-radius: 50%;
      border-top-color: transparent;
      animation: tmyl-spin 1s linear infinite;
    `;

    // Ensure spin animation is defined
    if (!document.querySelector('#tmyl-spinner-styles')) {
      const style = document.createElement('style');
      style.id = 'tmyl-spinner-styles';
      style.textContent = `
        @keyframes tmyl-spin {
          to { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }

    return spinner;
  },

  /**
   * Animate element entrance
   */
  animateIn(element, animation = 'fadeIn') {
    const animations = {
      fadeIn: [
        { opacity: 0 },
        { opacity: 1 }
      ],
      slideIn: [
        { transform: 'translateY(10px)', opacity: 0 },
        { transform: 'translateY(0)', opacity: 1 }
      ],
      scaleIn: [
        { transform: 'scale(0.95)', opacity: 0 },
        { transform: 'scale(1)', opacity: 1 }
      ]
    };

    const keyframes = animations[animation] || animations.fadeIn;

    return element.animate(keyframes, {
      duration: 200,
      easing: 'cubic-bezier(0, 0, 0.2, 1)',
      fill: 'forwards'
    });
  }
};

/**
 * Accessibility Utilities
 */
export const a11yUtils = {
  /**
   * Generate unique ID for form elements
   */
  generateId(prefix = 'tmyl') {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  },

  /**
   * Set up ARIA attributes for form fields
   */
  setupFormField(input, label, errorElement, helperElement) {
    const id = input.id || a11yUtils.generateId('input');
    input.id = id;

    if (label) {
      label.setAttribute('for', id);
    }

    const describedBy = [];

    if (helperElement) {
      const helperId = helperElement.id || a11yUtils.generateId('helper');
      helperElement.id = helperId;
      describedBy.push(helperId);
    }

    if (errorElement) {
      const errorId = errorElement.id || a11yUtils.generateId('error');
      errorElement.id = errorId;
      describedBy.push(errorId);
      input.setAttribute('aria-invalid', 'true');
    } else {
      input.removeAttribute('aria-invalid');
    }

    if (describedBy.length > 0) {
      input.setAttribute('aria-describedby', describedBy.join(' '));
    } else {
      input.removeAttribute('aria-describedby');
    }
  },

  /**
   * Set up keyboard navigation
   */
  setupKeyboardNav(element, options = {}) {
    const {
      onEnter = () => {},
      onEscape = () => {},
      onArrowUp = () => {},
      onArrowDown = () => {}
    } = options;

    return eventUtils.addListener(element, 'keydown', (event) => {
      switch (event.key) {
      case 'Enter':
        event.preventDefault();
        onEnter(event);
        break;
      case 'Escape':
        onEscape(event);
        break;
      case 'ArrowUp':
        event.preventDefault();
        onArrowUp(event);
        break;
      case 'ArrowDown':
        event.preventDefault();
        onArrowDown(event);
        break;
      }
    });
  }
};

/**
 * Combined shared utilities export
 */
export const sharedUtilities = {
  css: cssUtils,
  dom: domUtils,
  events: eventUtils,
  validation: validationUtils,
  animation: animationUtils,
  a11y: a11yUtils,
  tokens: designTokens,
  variants: sharedVariants,
  states: sharedStates
};

export default sharedUtilities;
