/**
 * Atomic Design System Factory
 * Central factory for creating all atomic UI elements with shared foundation
 * 
 * Hierarchy:
 * AtomFactory (Base) → ButtonFactory, InputFactory, CardFactory
 * Each factory shares common design tokens but has specialized behavior
 */

// Import shared foundations
import { designTokens } from '../core/design-tokens.js';
import { sharedUtilities } from '../core/shared-utilities.js';

// Import specialized factories
import { ButtonFactory } from './button/button-system.js';
import { InputFactory } from './input/input-system.js';
import { CardFactory } from './card/card-system.js';

/**
 * Base Atom Factory - Shared functionality for all atoms
 */
class BaseAtomFactory {
  constructor() {
    this.tokens = designTokens;
    this.utilities = sharedUtilities;
    this.commonProps = {
      size: 'md',
      disabled: false,
      className: '',
      id: null,
      'data-testid': null
    };
  }

  /**
   * Merge props with defaults and common properties
   */
  mergeProps(props = {}, defaults = {}) {
    return {
      ...this.commonProps,
      ...defaults,
      ...props
    };
  }

  /**
   * Generate consistent class names
   */
  buildClassName(base, variant, size, additional = []) {
    const classes = [
      `tmyl-${base}`,
      variant && `tmyl-${base}--${variant}`,
      size && `tmyl-${base}--${size}`,
      ...additional
    ].filter(Boolean);
    
    return classes.join(' ');
  }

  /**
   * Apply consistent attributes
   */
  applyAttributes(element, props) {
    Object.entries(props).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (typeof value === 'boolean') {
          if (value) element.setAttribute(key, '');
        } else {
          element.setAttribute(key, value);
        }
      }
    });
  }

  /**
   * Set up consistent event handling
   */
  setupEventHandling(element, events = {}) {
    Object.entries(events).forEach(([event, handler]) => {
      if (typeof handler === 'function') {
        element.addEventListener(event, handler);
      }
    });
  }
}

/**
 * Atom System Factory - Main entry point for all atoms
 */
export class AtomFactory extends BaseAtomFactory {
  constructor() {
    super();
    
    // Initialize specialized factories
    this.button = new ButtonFactory();
    this.input = new InputFactory();
    this.card = new CardFactory();
    
    // Set up shared foundation for all factories
    this.setupSharedFoundation();
  }

  setupSharedFoundation() {
    [this.button, this.input, this.card].forEach(factory => {
      factory.setSharedFoundation(this.tokens, this.utilities);
    });
  }

  /**
   * Create any atom type dynamically
   */
  create(type, props = {}) {
    const factories = {
      button: this.button,
      input: this.input,
      card: this.card
    };

    const factory = factories[type];
    if (!factory) {
      throw new Error(`Unknown atom type: ${type}. Available: ${Object.keys(factories).join(', ')}`);
    }

    return factory.create(props);
  }

  /**
   * Create multiple atoms at once
   */
  createMultiple(atomConfigs) {
    return atomConfigs.map(({ type, props }) => this.create(type, props));
  }

  /**
   * Get available variants for any atom type
   */
  getVariants(type) {
    const factories = {
      button: this.button,
      input: this.input,
      card: this.card
    };

    const factory = factories[type];
    return factory ? factory.getVariants() : [];
  }

  /**
   * Get shared design tokens
   */
  getDesignTokens() {
    return this.tokens;
  }

  /**
   * Create themed variant of any atom
   */
  createThemed(type, theme, props = {}) {
    const themedProps = {
      ...props,
      className: `${props.className || ''} tmyl-theme-${theme}`.trim()
    };
    
    return this.create(type, themedProps);
  }

  /**
   * Batch create atoms with shared properties
   */
  createBatch(type, sharedProps = {}, variations = []) {
    return variations.map(variation => 
      this.create(type, { ...sharedProps, ...variation })
    );
  }
}

/**
 * Specialized Atom Collections for common patterns
 */
export class AtomCollections {
  constructor(atomFactory) {
    this.factory = atomFactory;
  }

  /**
   * Create form element collection
   */
  createFormElements(config) {
    const { fields, submitButton, cancelButton } = config;
    
    const elements = {
      fields: fields.map(field => this.factory.create('input', field)),
      actions: []
    };

    if (submitButton) {
      elements.actions.push(
        this.factory.create('button', { 
          variant: 'primary', 
          type: 'submit',
          ...submitButton 
        })
      );
    }

    if (cancelButton) {
      elements.actions.push(
        this.factory.create('button', { 
          variant: 'secondary', 
          type: 'button',
          ...cancelButton 
        })
      );
    }

    return elements;
  }

  /**
   * Create card grid collection
   */
  createCardGrid(items, cardProps = {}) {
    return items.map(item => 
      this.factory.create('card', { 
        ...cardProps, 
        content: item 
      })
    );
  }

  /**
   * Create button group collection
   */
  createButtonGroup(buttons, groupProps = {}) {
    return {
      container: this.createButtonGroupContainer(groupProps),
      buttons: buttons.map(button => this.factory.create('button', button))
    };
  }

  createButtonGroupContainer(props) {
    const container = document.createElement('div');
    container.className = `tmyl-button-group ${props.className || ''}`;
    
    if (props.orientation === 'vertical') {
      container.classList.add('tmyl-button-group--vertical');
    }
    
    return container;
  }
}

/**
 * Atom Theme System
 */
export class AtomThemeSystem {
  constructor() {
    this.themes = new Map();
    this.registerDefaultThemes();
  }

  registerDefaultThemes() {
    this.register('primary', {
      button: { variant: 'primary' },
      input: { variant: 'primary' },
      card: { variant: 'elevated' }
    });

    this.register('minimal', {
      button: { variant: 'ghost' },
      input: { variant: 'minimal' },
      card: { variant: 'flat' }
    });

    this.register('bold', {
      button: { variant: 'primary', size: 'lg' },
      input: { variant: 'primary', size: 'lg' },
      card: { variant: 'raised', padding: 'xl' }
    });
  }

  register(name, config) {
    this.themes.set(name, config);
  }

  get(name) {
    return this.themes.get(name);
  }

  apply(atomFactory, themeName) {
    const theme = this.get(themeName);
    if (!theme) return;

    // Apply theme defaults to each factory
    Object.entries(theme).forEach(([atomType, defaults]) => {
      if (atomFactory[atomType] && atomFactory[atomType].setDefaults) {
        atomFactory[atomType].setDefaults(defaults);
      }
    });
  }
}

// Create singleton instances
export const atomFactory = new AtomFactory();
export const atomCollections = new AtomCollections(atomFactory);
export const atomThemes = new AtomThemeSystem();

// Convenience exports for direct usage
export const createAtom = (type, props) => atomFactory.create(type, props);
export const createButton = (props) => atomFactory.create('button', props);
export const createInput = (props) => atomFactory.create('input', props);
export const createCard = (props) => atomFactory.create('card', props);

// Advanced composition helpers
export const compose = {
  form: (config) => atomCollections.createFormElements(config),
  grid: (items, cardProps) => atomCollections.createCardGrid(items, cardProps),
  buttonGroup: (buttons, groupProps) => atomCollections.createButtonGroup(buttons, groupProps)
};

/**
 * Usage Examples:
 * 
 * // Simple creation
 * const button = createButton({ variant: 'primary', text: 'Click me' });
 * const input = createInput({ type: 'email', label: 'Email', required: true });
 * const card = createCard({ variant: 'elevated', content: 'Hello world' });
 * 
 * // Factory-based creation
 * const atoms = atomFactory.createMultiple([
 *   { type: 'button', props: { variant: 'primary', text: 'Save' } },
 *   { type: 'button', props: { variant: 'secondary', text: 'Cancel' } }
 * ]);
 * 
 * // Themed creation
 * atomThemes.apply(atomFactory, 'minimal');
 * const minimalButton = createButton({ text: 'Minimal' }); // Uses minimal theme
 * 
 * // Composition patterns
 * const form = compose.form({
 *   fields: [
 *     { type: 'text', label: 'Name', required: true },
 *     { type: 'email', label: 'Email', required: true }
 *   ],
 *   submitButton: { text: 'Submit' },
 *   cancelButton: { text: 'Cancel' }
 * });
 */


/**
 * Generic export for atomicRegistry
 */
export const atomicRegistry = {};