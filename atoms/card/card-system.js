/**
 * Card Factory System - Modular card component creation
 * Creates card components using separated concerns (CSS, JS, HTML, Icons)
 */

import { designTokens } from '../../core/design-tokens.js';
import { sharedUtilities } from '../../core/shared-utilities.js';
import { createCardTemplate, updateCardState, cardTemplates } from './templates/card-template.js';
import { CardController, CardGroupController } from './controllers/card-controller.js';
import { cardIcons, getCardIcon } from './icons/card-icons.js';

/**
 * Card Factory - Creates card components with full modularity
 */
export class CardFactory {
  constructor() {
    this.defaultProps = {
      variant: 'default',
      size: 'md',
      padding: 'md',
      elevation: 'sm',
      interactive: false,
      selected: false,
      disabled: false
    };

    this.variants = [
      'default', 'outlined', 'filled', 'elevated', 'ghost'
    ];

    this.sizes = ['xs', 'sm', 'md', 'lg', 'xl'];
    this.paddings = ['none', 'xs', 'sm', 'md', 'lg', 'xl'];
    this.elevations = ['none', 'xs', 'sm', 'md', 'lg', 'xl'];

    // Ensure CSS is loaded
    this.ensureCSS();
  }

  /**
   * Ensure CSS is loaded in the document
   */
  ensureCSS() {
    if (!document.querySelector('link[href*="tmyl-card.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = new URL('./styles/tmyl-card.css', import.meta.url).href;
      document.head.appendChild(link);
    }
  }

  /**
   * Create a card element with all functionality
   */
  create(props = {}) {
    const finalProps = { ...this.defaultProps, ...props };
    
    // Create container
    const container = document.createElement('div');
    container.innerHTML = createCardTemplate(finalProps);
    const card = container.firstElementChild;

    // Attach controller for behavior if interactive
    if (finalProps.interactive) {
      const controller = new CardController(card);
      card._controller = controller;

      // Add event handlers if provided
      if (finalProps.onClick) {
        card.addEventListener('tmyl-card-click', finalProps.onClick);
      }
      if (finalProps.onAction) {
        card.addEventListener('tmyl-card-action', finalProps.onAction);
      }
    }

    return card;
  }

  /**
   * Create card with variant shortcuts
   */
  createDefault(props = {}) {
    return this.create({ ...props, variant: 'default' });
  }

  createOutlined(props = {}) {
    return this.create({ ...props, variant: 'outlined' });
  }

  createFilled(props = {}) {
    return this.create({ ...props, variant: 'filled' });
  }

  createElevated(props = {}) {
    return this.create({ ...props, variant: 'elevated', elevation: 'md' });
  }

  createGhost(props = {}) {
    return this.create({ ...props, variant: 'ghost' });
  }

  /**
   * Create interactive cards
   */
  createInteractive(props = {}) {
    return this.create({ ...props, interactive: true });
  }

  createSelectable(props = {}) {
    return this.create({ ...props, interactive: true, selectable: true });
  }

  /**
   * Create cards using templates
   */
  createBasic(props = {}) {
    const container = document.createElement('div');
    container.innerHTML = cardTemplates.basic(props);
    return container.firstElementChild;
  }

  createProduct(props = {}) {
    const container = document.createElement('div');
    container.innerHTML = cardTemplates.product(props);
    const card = container.firstElementChild;
    
    // Make interactive by default for product cards
    const controller = new CardController(card);
    card._controller = controller;
    
    return card;
  }

  createArticle(props = {}) {
    const container = document.createElement('div');
    container.innerHTML = cardTemplates.article(props);
    return container.firstElementChild;
  }

  createProfile(props = {}) {
    const container = document.createElement('div');
    container.innerHTML = cardTemplates.profile(props);
    return container.firstElementChild;
  }

  /**
   * Update existing card properties
   */
  update(card, props) {
    updateCardState(card, props);
    return card;
  }

  /**
   * Attach controller to existing card element
   */
  attachController(element, options = {}) {
    if (!element._controller) {
      const controller = new CardController(element, options);
      element._controller = controller;
    }
    return element._controller;
  }

  /**
   * Create multiple cards
   */
  createMultiple(cardConfigs) {
    return cardConfigs.map(config => this.create(config));
  }

  /**
   * Create card grid
   */
  createGrid(cards, gridProps = {}) {
    const grid = document.createElement('div');
    grid.className = 'tmyl-card-grid';
    
    const {
      columns = 'auto',
      gap = 'md',
      responsive = true,
      className = ''
    } = gridProps;

    if (className) {
      grid.className += ` ${className}`;
    }

    // Set CSS custom properties for grid
    if (columns !== 'auto') {
      grid.style.setProperty('--tmyl-grid-columns', columns);
    }
    grid.style.setProperty('--tmyl-grid-gap', `var(--tmyl-space-${gap})`);

    const cardElements = cards.map(cardConfig => 
      typeof cardConfig === 'object' ? this.create(cardConfig) : cardConfig
    );

    cardElements.forEach(card => grid.appendChild(card));
    
    return grid;
  }

  /**
   * Create card group with group selection behavior
   */
  createGroup(cards, groupProps = {}) {
    const group = document.createElement('div');
    group.className = 'tmyl-card-group';
    
    const {
      multiSelect = false,
      selectable = true,
      className = ''
    } = groupProps;

    if (className) {
      group.className += ` ${className}`;
    }

    const cardElements = cards.map(cardConfig => {
      const card = typeof cardConfig === 'object' ? this.create(cardConfig) : cardConfig;
      if (selectable && !card._controller) {
        this.attachController(card);
      }
      return card;
    });

    cardElements.forEach(card => group.appendChild(card));

    // Attach group controller
    const groupController = new CardGroupController(group, { multiSelect, selectable });
    group._groupController = groupController;
    
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

    if (props.padding && !this.paddings.includes(props.padding)) {
      errors.push(`Invalid padding: ${props.padding}. Must be one of: ${this.paddings.join(', ')}`);
    }

    if (props.elevation && !this.elevations.includes(props.elevation)) {
      errors.push(`Invalid elevation: ${props.elevation}. Must be one of: ${this.elevations.join(', ')}`);
    }

    return errors;
  }

  /**
   * Accessibility helpers
   */
  makeAccessible(card, options = {}) {
    const {
      label,
      describedBy,
      role,
      selected,
      disabled
    } = options;

    if (label) card.setAttribute('aria-label', label);
    if (describedBy) card.setAttribute('aria-describedby', describedBy);
    if (role) card.setAttribute('role', role);
    if (selected !== undefined) card.setAttribute('aria-selected', selected);
    if (disabled !== undefined) card.setAttribute('aria-disabled', disabled);

    return card;
  }
}

// Create default factory instance
export const cardFactory = new CardFactory();

// Convenience exports
export const { 
  create: createCard,
  createDefault,
  createOutlined,
  createFilled,
  createElevated,
  createGhost,
  createInteractive,
  createSelectable,
  createBasic,
  createProduct,
  createArticle,
  createProfile
} = cardFactory;

// Export components for direct usage
export { cardIcons, getCardIcon, CardController, CardGroupController };
