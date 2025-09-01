/**
 * UNIFIED UI FACTORY - Single Entry Point for All Components
 *
 * This is the PRIMARY API for the UI library. All components should be created
 * through this factory for consistency and ease of use.
 *
 * Usage:
 * ```javascript
 * import { UI } from '@tamyla/ui-components';
 *
 * const button = UI.create('button', { variant: 'primary', text: 'Click' });
 * const input = UI.create('input', { type: 'email', label: 'Email' });
 * const search = UI.create('search-interface', { enableVoice: true });
 * ```
 */

// Import all component factories
import { atomFactory } from '../atoms/atom-factory.js';
import { molecularRegistry } from '../molecules/molecule-factory.js';
import { organismRegistry } from '../organisms/organism-factory.js';

// Import design tokens and utilities
import { designTokens } from '../core/design-tokens.js';
import { sharedUtilities } from '../core/shared-utilities.js';

/**
 * UNIFIED UI FACTORY - The single source of truth for component creation
 */
export class UnifiedUIFactory {
  constructor() {
    this.atomFactory = atomFactory;
    this.moleculeFactory = molecularRegistry;
    this.organismFactory = organismRegistry;

    // Initialize shared foundation
    this.initializeSharedFoundation();
  }

  /**
   * Initialize shared foundation across all factories
   */
  initializeSharedFoundation() {
    // Set shared foundation for atom factory
    if (this.atomFactory.setupSharedFoundation) {
      this.atomFactory.setupSharedFoundation();
    }

    // Set shared foundation for molecule factory
    if (this.moleculeFactory.setSharedFoundation) {
      this.moleculeFactory.setSharedFoundation(designTokens, sharedUtilities);
    }

    // Set shared foundation for organism factory
    if (this.organismFactory.setSharedFoundation) {
      this.organismFactory.setSharedFoundation(designTokens, sharedUtilities);
    }
  }

  /**
   * PRIMARY API: Create any component type
   *
   * @param {string} type - Component type ('button', 'input', 'card', 'search-interface', etc.)
   * @param {object} props - Component properties
   * @returns {HTMLElement} - The created component element
   */
  create(type, props = {}) {
    // Validate inputs
    if (typeof type !== 'string') {
      throw new Error('Component type must be a string');
    }

    // Route to appropriate factory based on component type
    const componentType = type.toLowerCase();

    // Atoms
    if (['button', 'input', 'card', 'status-indicator', 'input-group'].includes(componentType)) {
      return this.atomFactory.create(componentType, props);
    }

    // Molecules
    if (['search-bar', 'action-card', 'content-card', 'file-list', 'notification'].includes(componentType)) {
      return this.moleculeFactory.create(componentType, props);
    }

    // Organisms
    if (['search-interface', 'reward-system', 'dashboard', 'modal'].includes(componentType)) {
      const instance = this.organismFactory.create(componentType, props);
      // Return the DOM element from the organism instance
      return instance.getElement();
    }

    // Applications
    if (['enhanced-search', 'campaign-selector', 'content-manager'].includes(componentType)) {
      return this.createApplication(componentType, props);
    }

    throw new Error(`Unknown component type: ${type}. Available types: button, input, card, status-indicator, input-group, search-bar, action-card, content-card, file-list, notification, search-interface, reward-system, modal, enhanced-search, campaign-selector, content-manager`);
  }

  /**
   * Create application components
   */
  createApplication(type, props = {}) {
    // Dynamic import for applications (code splitting)
    const appModules = {
      'enhanced-search': () => import('../applications/enhanced-search/enhanced-search-system.js'),
      'campaign-selector': () => import('../applications/campaign-selector/campaign-selector-system.js'),
      'content-manager': () => import('../applications/content-manager/content-manager-system.js')
    };

    const loader = appModules[type];
    if (!loader) {
      throw new Error(`Unknown application type: ${type}`);
    }

    // For now, return a placeholder - applications need special handling
    return this.createPlaceholder(type, props);
  }

  /**
   * Create placeholder for components that need special handling
   */
  createPlaceholder(type, props = {}) {
    const placeholder = document.createElement('div');
    placeholder.className = `tmyl-placeholder tmyl-placeholder--${type}`;
    placeholder.setAttribute('data-component-type', type);
    placeholder.innerHTML = `
      <div style="padding: 20px; border: 2px dashed #ccc; border-radius: 8px; text-align: center; color: #666;">
        <h4>${type.replace('-', ' ').toUpperCase()}</h4>
        <p>Component will be rendered here</p>
        <small>Props: ${JSON.stringify(props, null, 2)}</small>
      </div>
    `;
    return placeholder;
  }

  /**
   * Get available component types
   */
  getAvailableTypes() {
    return {
      atoms: ['button', 'input', 'card', 'status-indicator', 'input-group'],
      molecules: ['search-bar', 'action-card', 'content-card', 'file-list', 'notification'],
      organisms: ['search-interface', 'reward-system', 'modal'],
      applications: ['enhanced-search', 'campaign-selector', 'content-manager']
    };
  }

  /**
   * Get component variants (if available)
   */
  getVariants(type) {
    const componentType = type.toLowerCase();

    // Try atom factory first
    if (['button', 'input', 'card', 'status-indicator', 'input-group'].includes(componentType)) {
      return this.atomFactory.getVariants(componentType);
    }

    // Try molecule factory
    if (['search-bar', 'action-card', 'content-card', 'file-list', 'notification'].includes(componentType)) {
      return this.moleculeFactory.getVariants ? this.moleculeFactory.getVariants(componentType) : [];
    }

    // Try organism factory
    if (['search-interface', 'reward-system', 'modal', 'dashboard'].includes(componentType)) {
      return this.organismFactory.getVariants ? this.organismFactory.getVariants(componentType) : [];
    }

    return [];
  }

  /**
   * Batch create multiple components
   */
  createMultiple(componentConfigs) {
    if (!Array.isArray(componentConfigs)) {
      throw new Error('createMultiple expects an array of component configurations');
    }

    return componentConfigs.map(({ type, props }) => this.create(type, props));
  }

  /**
   * Create themed component
   */
  createThemed(type, theme, props = {}) {
    const themedProps = {
      ...props,
      'data-theme': theme,
      className: `${props.className || ''} tmyl-theme-${theme}`.trim()
    };

    return this.create(type, themedProps);
  }
}

// Create singleton instance
export const UI = new UnifiedUIFactory();

// Convenience exports for direct usage (maintains backward compatibility)
export const createButton = (props) => UI.create('button', props);
export const createInput = (props) => UI.create('input', props);
export const createCard = (props) => UI.create('card', props);
export const createSearchInterface = (props) => UI.create('search-interface', props);
