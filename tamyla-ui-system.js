/**
 * Tamyla UI Components System
 * Complete design system with atomic, molecular, organism, and application layers
 */

// Atomic Layer
import { AtomFactory, atomicRegistry } from './atoms/atom-factory.js';
import { ButtonFactory } from './atoms/button/button-system.js';
import { InputFactory } from './atoms/input/input-system.js';
import { CardFactory } from './atoms/card/card-system.js';

// Molecular Layer
import { MoleculeFactory, molecularRegistry } from './molecules/molecule-factory.js';
import { SearchBarFactory } from './molecules/search-bar/search-bar-system.js';
import { ContentCardFactory, ContentCardGridFactory } from './molecules/content-card/content-card-system.js';

// Organism Layer
import { OrganismFactory, organismRegistry } from './organisms/organism-factory.js';
import { SearchInterfaceFactory } from './organisms/search-interface/search-interface-system.js';

// Application Layer
import { EnhancedSearchApplicationFactory } from './applications/enhanced-search-application.js';
import { ContentManagerApplicationFactory } from './applications/content-manager-application.js';

/**
 * Tamyla UI System Registry
 * Central registry for all component factories across all layers
 */
class TamylaUISystemRegistry {
  constructor() {
    this.layers = {
      atoms: atomicRegistry,
      molecules: molecularRegistry,
      organisms: organismRegistry,
      applications: new Map()
    };
    
    this.instances = new Map();
    this.registerApplications();
  }

  /**
   * Register application factories
   */
  registerApplications() {
    this.layers.applications.set('enhanced-search', EnhancedSearchApplicationFactory);
    this.layers.applications.set('content-manager', ContentManagerApplicationFactory);
  }

  /**
   * Create component from any layer
   */
  create(layer, type, props = {}, id = null) {
    const registry = this.layers[layer];
    if (!registry) {
      throw new Error(`Unknown layer: ${layer}`);
    }

    let instance;
    if (layer === 'applications') {
      const Factory = registry.get(type);
      if (!Factory) {
        throw new Error(`Unknown ${layer} component type: ${type}`);
      }
      instance = Factory(props);
    } else {
      instance = registry.create(type, props, id);
    }

    if (id) {
      this.instances.set(id, { layer, type, instance });
    }

    return instance;
  }

  /**
   * Get component instance by ID
   */
  getInstance(id) {
    return this.instances.get(id)?.instance;
  }

  /**
   * Get all instances of a layer
   */
  getLayerInstances(layer) {
    return Array.from(this.instances.values())
      .filter(item => item.layer === layer)
      .map(item => item.instance);
  }

  /**
   * Destroy instance
   */
  destroyInstance(id) {
    const item = this.instances.get(id);
    if (item && item.instance && typeof item.instance.destroy === 'function') {
      item.instance.destroy();
    }
    this.instances.delete(id);
  }

  /**
   * Destroy all instances
   */
  destroyAll() {
    this.instances.forEach((item, id) => {
      this.destroyInstance(id);
    });
    this.instances.clear();
  }

  /**
   * Get available component types for a layer
   */
  getTypes(layer) {
    const registry = this.layers[layer];
    if (!registry) return [];
    
    if (layer === 'applications') {
      return Array.from(registry.keys());
    } else {
      return registry.getTypes();
    }
  }
}

/**
 * Global UI system registry
 */
export const tamylaUISystem = new TamylaUISystemRegistry();

/**
 * Unified Component Factory
 * Single entry point for creating any component
 */
export function TamylaFactory(layer, type, props = {}, id = null) {
  return tamylaUISystem.create(layer, type, props, id);
}

/**
 * Layer-specific factory shortcuts
 */
export const Tamyla = {
  // Atomic components
  Atom: (type, props, id) => TamylaFactory('atoms', type, props, id),
  Button: (props, id) => TamylaFactory('atoms', 'button', props, id),
  Input: (props, id) => TamylaFactory('atoms', 'input', props, id),
  Card: (props, id) => TamylaFactory('atoms', 'card', props, id),

  // Molecular components
  Molecule: (type, props, id) => TamylaFactory('molecules', type, props, id),
  SearchBar: (props, id) => TamylaFactory('molecules', 'search-bar', props, id),
  ContentCard: (props, id) => TamylaFactory('molecules', 'content-card', props, id),
  ContentGrid: (props, id) => TamylaFactory('molecules', 'content-card-grid', props, id),

  // Organism components
  Organism: (type, props, id) => TamylaFactory('organisms', type, props, id),
  SearchInterface: (props, id) => TamylaFactory('organisms', 'search-interface', props, id),

  // Application components
  Application: (type, props, id) => TamylaFactory('applications', type, props, id),
  EnhancedSearch: (props, id) => TamylaFactory('applications', 'enhanced-search', props, id),
  ContentManager: (props, id) => TamylaFactory('applications', 'content-manager', props, id)
};

/**
 * Design System Templates
 * Pre-configured combinations for common use cases
 */
export const TamylaTemplates = {
  /**
   * Complete search page
   */
  searchPage: (props = {}) => {
    const { container, ...rest } = props;
    
    const searchApp = Tamyla.EnhancedSearch({
      title: 'Search',
      description: 'Find content across your knowledge base',
      layout: 'vertical',
      voiceEnabled: true,
      naturalLanguage: true,
      smartFilters: true,
      ...rest
    });

    if (container) {
      searchApp.render(container);
    }

    return searchApp;
  },

  /**
   * Content management dashboard
   */
  contentDashboard: (props = {}) => {
    const { container, ...rest } = props;
    
    const contentManager = Tamyla.ContentManager({
      title: 'Content Manager',
      description: 'Manage and search your content library',
      selectionMode: true,
      showUpload: true,
      voiceSearch: true,
      naturalLanguage: true,
      smartFilters: true,
      ...rest
    });

    if (container) {
      contentManager.render(container);
    }

    return contentManager;
  },

  /**
   * Simple search widget
   */
  searchWidget: (props = {}) => {
    const { container, ...rest } = props;
    
    const searchInterface = Tamyla.SearchInterface({
      showHeader: false,
      showFilters: false,
      showResultsActions: false,
      size: 'compact',
      ...rest
    });

    if (container) {
      searchInterface.render(container);
    }

    return searchInterface;
  },

  /**
   * Media gallery
   */
  mediaGallery: (props = {}) => {
    const { container, mediaItems = [], ...rest } = props;
    
    const searchInterface = Tamyla.SearchInterface({
      title: 'Media Gallery',
      description: 'Browse and search your media files',
      showHeader: true,
      showFilters: true,
      searchProps: {
        placeholder: 'Search images, videos, audio...'
      },
      filters: [
        {
          key: 'mediaType',
          label: 'Media Type',
          type: 'select',
          options: [
            { value: 'all', label: 'All Media' },
            { value: 'image', label: 'Images' },
            { value: 'video', label: 'Videos' },
            { value: 'audio', label: 'Audio' }
          ]
        }
      ],
      ...rest
    });

    if (container) {
      searchInterface.render(container);
    }

    return searchInterface;
  },

  /**
   * Knowledge base explorer
   */
  knowledgeBase: (props = {}) => {
    const { container, ...rest } = props;
    
    const searchApp = Tamyla.EnhancedSearch({
      title: 'Knowledge Base',
      description: 'Explore your personal knowledge network',
      placeholder: 'Ask anything... "Find my notes about machine learning"',
      layout: 'horizontal',
      naturalLanguage: true,
      voiceEnabled: true,
      smartFilters: true,
      ...rest
    });

    if (container) {
      searchApp.render(container);
    }

    return searchApp;
  }
};

/**
 * Design System Utilities
 */
export const TamylaUtils = {
  /**
   * Initialize design system with global styles
   */
  init(options = {}) {
    const {
      cssVariables = true,
      globalStyles = true,
      container = document.head
    } = options;

    if (cssVariables) {
      this.injectCSSVariables(container);
    }

    if (globalStyles) {
      this.injectGlobalStyles(container);
    }
  },

  /**
   * Inject CSS variables for design tokens
   */
  injectCSSVariables(container = document.head) {
    const style = document.createElement('style');
    style.textContent = `
      :root {
        /* Colors */
        --tmyl-color-primary: #3b82f6;
        --tmyl-color-primary-hover: #2563eb;
        --tmyl-color-primary-light: #dbeafe;
        --tmyl-color-secondary: #64748b;
        --tmyl-color-success: #10b981;
        --tmyl-color-warning: #f59e0b;
        --tmyl-color-error: #ef4444;
        
        /* Surface colors */
        --tmyl-color-surface: #ffffff;
        --tmyl-color-surface-secondary: #f8fafc;
        --tmyl-color-surface-tertiary: #f1f5f9;
        
        /* Text colors */
        --tmyl-color-text: #1e293b;
        --tmyl-color-text-secondary: #64748b;
        --tmyl-color-text-tertiary: #94a3b8;
        --tmyl-color-text-inverse: #ffffff;
        
        /* Border colors */
        --tmyl-color-border: #e2e8f0;
        --tmyl-color-border-hover: #cbd5e1;
        --tmyl-color-border-focus: #3b82f6;
        
        /* Spacing */
        --tmyl-space-xs: 0.25rem;
        --tmyl-space-sm: 0.5rem;
        --tmyl-space-md: 1rem;
        --tmyl-space-lg: 1.5rem;
        --tmyl-space-xl: 2rem;
        --tmyl-space-2xl: 3rem;
        
        /* Typography */
        --tmyl-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        --tmyl-font-size-xs: 0.75rem;
        --tmyl-font-size-sm: 0.875rem;
        --tmyl-font-size-md: 1rem;
        --tmyl-font-size-lg: 1.125rem;
        --tmyl-font-size-xl: 1.25rem;
        --tmyl-font-size-2xl: 1.5rem;
        --tmyl-font-weight-normal: 400;
        --tmyl-font-weight-medium: 500;
        --tmyl-font-weight-semibold: 600;
        --tmyl-font-weight-bold: 700;
        --tmyl-line-height-tight: 1.25;
        --tmyl-line-height-normal: 1.5;
        --tmyl-line-height-relaxed: 1.75;
        
        /* Border radius */
        --tmyl-radius-sm: 0.25rem;
        --tmyl-radius-md: 0.375rem;
        --tmyl-radius-lg: 0.5rem;
        --tmyl-radius-xl: 0.75rem;
        --tmyl-radius-full: 9999px;
        
        /* Shadows */
        --tmyl-shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        --tmyl-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        --tmyl-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        --tmyl-shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        
        /* Transitions */
        --tmyl-transition-fast: 150ms ease;
        --tmyl-transition-normal: 250ms ease;
        --tmyl-transition-slow: 350ms ease;
        
        /* Z-index */
        --tmyl-z-dropdown: 1000;
        --tmyl-z-modal: 1050;
        --tmyl-z-tooltip: 1100;
      }

      /* Dark mode variables */
      @media (prefers-color-scheme: dark) {
        :root {
          --tmyl-color-surface: #1e293b;
          --tmyl-color-surface-secondary: #0f172a;
          --tmyl-color-surface-tertiary: #334155;
          --tmyl-color-text: #f8fafc;
          --tmyl-color-text-secondary: #cbd5e1;
          --tmyl-color-text-tertiary: #94a3b8;
          --tmyl-color-border: #334155;
          --tmyl-color-border-hover: #475569;
        }
      }
    `;
    container.appendChild(style);
  },

  /**
   * Inject global styles
   */
  injectGlobalStyles(container = document.head) {
    const style = document.createElement('style');
    style.textContent = `
      /* Global reset and base styles */
      * {
        box-sizing: border-box;
      }
      
      body {
        font-family: var(--tmyl-font-family);
        color: var(--tmyl-color-text);
        background: var(--tmyl-color-surface-secondary);
        line-height: var(--tmyl-line-height-normal);
        margin: 0;
        padding: 0;
      }
      
      /* Focus styles */
      *:focus {
        outline: 2px solid var(--tmyl-color-border-focus);
        outline-offset: 2px;
      }
      
      /* Reduce motion for accessibility */
      @media (prefers-reduced-motion: reduce) {
        * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
      
      /* High contrast mode support */
      @media (prefers-contrast: high) {
        * {
          border-width: 2px;
        }
      }
    `;
    container.appendChild(style);
  },

  /**
   * Create responsive grid layout
   */
  createResponsiveGrid(items, options = {}) {
    const {
      container,
      itemFactory,
      columns = { default: 1, sm: 2, md: 3, lg: 4 },
      gap = 'var(--tmyl-space-lg)'
    } = options;

    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gap = gap;
    grid.style.gridTemplateColumns = `repeat(${columns.default}, 1fr)`;

    // Add responsive styles
    const style = document.createElement('style');
    style.textContent = `
      @media (min-width: 640px) {
        .tmyl-responsive-grid { grid-template-columns: repeat(${columns.sm}, 1fr); }
      }
      @media (min-width: 768px) {
        .tmyl-responsive-grid { grid-template-columns: repeat(${columns.md}, 1fr); }
      }
      @media (min-width: 1024px) {
        .tmyl-responsive-grid { grid-template-columns: repeat(${columns.lg}, 1fr); }
      }
    `;
    document.head.appendChild(style);

    grid.className = 'tmyl-responsive-grid';

    // Add items
    items.forEach(item => {
      const component = itemFactory(item);
      const element = component.getElement ? component.getElement() : component;
      grid.appendChild(element);
    });

    if (container) {
      container.appendChild(grid);
    }

    return grid;
  },

  /**
   * Cleanup all system resources
   */
  cleanup() {
    tamylaUISystem.destroyAll();
  },

  /**
   * Get system statistics
   */
  getStats() {
    return {
      layers: Object.keys(tamylaUISystem.layers),
      instances: tamylaUISystem.instances.size,
      byLayer: {
        atoms: tamylaUISystem.getLayerInstances('atoms').length,
        molecules: tamylaUISystem.getLayerInstances('molecules').length,
        organisms: tamylaUISystem.getLayerInstances('organisms').length,
        applications: tamylaUISystem.getLayerInstances('applications').length
      }
    };
  }
};

/**
 * Export all individual factories for direct use
 */
export {
  // Atomic factories
  AtomFactory,
  ButtonFactory,
  InputFactory,
  CardFactory,
  
  // Molecular factories
  MoleculeFactory,
  SearchBarFactory,
  ContentCardFactory,
  ContentCardGridFactory,
  
  // Organism factories
  OrganismFactory,
  SearchInterfaceFactory,
  
  // Application factories
  EnhancedSearchApplicationFactory,
  ContentManagerApplicationFactory,
  
  // Registries
  atomicRegistry,
  molecularRegistry,
  organismRegistry,
  tamylaUISystem
};

/**
 * Default export - main factory system
 */
export default Tamyla;
