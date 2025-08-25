/**
 * Button Factory System - Modular button component creation
 * Creates button components using separated concerns (CSS, JS, HTML, Icons)
 */

import { designTokens } from '../../core/design-tokens.js';
import { sharedUtilities } from '../../core/shared-utilities.js';
import { createButtonTemplate, updateButtonState } from './templates/button-template.js';
import { ButtonController } from './controllers/button-controller.js';
import { buttonIcons, getButtonIcon } from './icons/button-icons.js';

/**
 * Button Factory - Creates button components with full modularity
 */
export class ButtonFactory {
  constructor() {
    this.defaultProps = {
      variant: 'primary',
      size: 'md',
      disabled: false,
      loading: false,
      fullWidth: false,
      icon: '',
      iconPosition: 'left'
    };

    this.variants = [
      'primary', 'secondary', 'ghost', 'danger', 'success'
    ];

    this.sizes = ['sm', 'md', 'lg', 'xl'];

    // Ensure CSS is loaded
    this.ensureCSS();
  }

  /**
   * Ensure CSS is loaded in the document
   */
  ensureCSS() {
    if (!document.querySelector('link[href*="tmyl-button.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = new URL('./styles/tmyl-button.css', import.meta.url).href;
      document.head.appendChild(link);
    }
  }

  /**
   * Create a button element with all functionality
   */
  create(props = {}) {
    const finalProps = { ...this.defaultProps, ...props };
    
    // Create container
    const container = document.createElement('div');
    container.innerHTML = createButtonTemplate(finalProps);
    const button = container.firstElementChild;

    // Attach controller for behavior
    const controller = new ButtonController(button);
    button._controller = controller;

    // Add click handler if provided
    if (finalProps.onClick) {
      button.addEventListener('tmyl-click', finalProps.onClick);
    }

    return button;
  }

  /**
   * Create button with shorthand methods
   */
  createPrimary(props = {}) {
    return this.create({ ...props, variant: 'primary' });
  }

  createSecondary(props = {}) {
    return this.create({ ...props, variant: 'secondary' });
  }

  createGhost(props = {}) {
    return this.create({ ...props, variant: 'ghost' });
  }

  createDanger(props = {}) {
    return this.create({ ...props, variant: 'danger' });
  }

  createSuccess(props = {}) {
    return this.create({ ...props, variant: 'success' });
  }

  /**
   * Create button with icon shortcuts
   */
  createWithIcon(iconName, props = {}) {
    return this.create({ ...props, icon: iconName });
  }

  createIconOnly(iconName, props = {}) {
    return this.create({ 
      ...props, 
      icon: iconName, 
      children: '', 
      'aria-label': props['aria-label'] || iconName 
    });
  }

  /**
   * Update existing button properties
   */
  update(button, props) {
    updateButtonState(button, props);
    return button;
  }

  /**
   * Attach controller to existing button element
   */
  attachController(element) {
    if (!element._controller) {
      const controller = new ButtonController(element);
      element._controller = controller;
    }
    return element._controller;
  }

  /**
   * Create multiple buttons
   */
  createMultiple(buttonConfigs) {
    return buttonConfigs.map(config => this.create(config));
  }

  /**
   * Create button group
   */
  createGroup(buttons, groupProps = {}) {
    const group = document.createElement('div');
    group.className = 'tmyl-button-group';
    
    if (groupProps.className) {
      group.className += ` ${groupProps.className}`;
    }

    const buttonElements = buttons.map(buttonConfig => 
      typeof buttonConfig === 'object' ? this.create(buttonConfig) : buttonConfig
    );

    buttonElements.forEach(button => group.appendChild(button));
    
    return group;
  }

  /**
   * Validation methods
   */
  validateProps(props) {
    const errors = [];

    if (props.variant && !this.variants.includes(props.variant)) {
      errors.push(`Invalid variant: ${props.variant}. Must be one of: ${this.variants.join(', ')}`);
    }

    if (props.size && !this.sizes.includes(props.size)) {
      errors.push(`Invalid size: ${props.size}. Must be one of: ${this.sizes.join(', ')}`);
    }

    return errors;
  }

  /**
   * Accessibility helpers
   */
  makeAccessible(button, options = {}) {
    const {
      label,
      describedBy,
      expanded,
      controls,
      pressed
    } = options;

    if (label) button.setAttribute('aria-label', label);
    if (describedBy) button.setAttribute('aria-describedby', describedBy);
    if (expanded !== undefined) button.setAttribute('aria-expanded', expanded);
    if (controls) button.setAttribute('aria-controls', controls);
    if (pressed !== undefined) button.setAttribute('aria-pressed', pressed);

    return button;
  }
}

// Create default factory instance
export const buttonFactory = new ButtonFactory();

// Convenience exports
export const { 
  create: createButton,
  createPrimary,
  createSecondary, 
  createGhost,
  createDanger,
  createSuccess,
  createWithIcon,
  createIconOnly
} = buttonFactory;

// Export components for direct usage
export { buttonIcons, getButtonIcon, ButtonController };
