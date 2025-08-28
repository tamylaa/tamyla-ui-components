/**
 * Molecule Factory System
 * Central orchestrator for all molecular components
 */

import { SearchBarFactory } from './search-bar/search-bar-system.js';
import { ContentCardFactory, ContentCardGridFactory, ContentCardTemplates } from './content-card/content-card-system.js';

/**
 * Molecular Factory Registry
 * Central registry for all molecular component factories
 */
class MolecularFactoryRegistry {
  constructor() {
    this.factories = new Map();
    this.instances = new Map();
    this.registerDefaults();
  }

  /**
   * Register default molecular factories
   */
  registerDefaults() {
    this.register('search-bar', SearchBarFactory);
    this.register('content-card', ContentCardFactory);
    this.register('content-card-grid', ContentCardGridFactory);
  }

  /**
   * Register a molecular factory
   */
  register(name, factory) {
    this.factories.set(name, factory);
    return this;
  }

  /**
   * Create molecular component instance
   */
  create(type, props = {}, id = null) {
    const Factory = this.factories.get(type);

    if (!Factory) {
      throw new Error(`Unknown molecular component type: ${type}`);
    }

    const instance = Factory(props);

    if (id) {
      this.instances.set(id, instance);
    }

    return instance;
  }

  /**
   * Get registered factory
   */
  getFactory(type) {
    return this.factories.get(type);
  }

  /**
   * Get created instance
   */
  getInstance(id) {
    return this.instances.get(id);
  }

  /**
   * List all registered types
   */
  getTypes() {
    return Array.from(this.factories.keys());
  }

  /**
   * Destroy instance
   */
  destroyInstance(id) {
    const instance = this.instances.get(id);
    if (instance && typeof instance.destroy === 'function') {
      instance.destroy();
    }
    this.instances.delete(id);
  }

  /**
   * Destroy all instances
   */
  destroyAll() {
    this.instances.forEach((instance, id) => {
      this.destroyInstance(id);
    });
    this.instances.clear();
  }
}

/**
 * Global molecular factory registry
 */
export const molecularRegistry = new MolecularFactoryRegistry();

/**
 * Molecule Factory
 * Convenience factory function for creating molecular components
 */
export function MoleculeFactory(type, props = {}, id = null) {
  return molecularRegistry.create(type, props, id);
}

/**
 * Molecular Component Templates
 * Pre-configured molecular component combinations
 */
export const MolecularTemplates = {
  /**
   * Search interface with results
   */
  searchInterface: (props = {}) => {
    const {
      searchProps = {},
      gridProps = {},
      onSearch,
      onSelect,
      container = null
    } = props;

    let searchBar = null;
    let contentGrid = null;
    let element = null;

    function createElement() {
      element = document.createElement('div');
      element.className = 'tmyl-search-interface';
      return element;
    }

    function render(targetContainer = container) {
      if (!targetContainer) {
        throw new Error('Container required for search interface');
      }

      if (!element) {
        createElement();
      }

      // Create search bar
      searchBar = MoleculeFactory('search-bar', {
        ...searchProps,
        onSearch: (query, filters) => {
          if (onSearch) {
            onSearch(query, filters).then(results => {
              if (contentGrid) {
                updateResults(results);
              }
            });
          }
        },
        container: element
      });
      searchBar.render();

      // Create content grid
      contentGrid = MoleculeFactory('content-card-grid', {
        ...gridProps,
        selectionManager: {
          multiSelect: true,
          onSelectionChange: onSelect
        },
        container: element
      });
      contentGrid.render();

      targetContainer.appendChild(element);
      return element;
    }

    function updateResults(results) {
      if (contentGrid) {
        contentGrid.destroy();
        contentGrid = MoleculeFactory('content-card-grid', {
          ...gridProps,
          items: results,
          selectionManager: {
            multiSelect: true,
            onSelectionChange: onSelect
          },
          container: element
        });
        contentGrid.render(element);
      }
    }

    function destroy() {
      if (searchBar) searchBar.destroy();
      if (contentGrid) contentGrid.destroy();
      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    }

    return { render, updateResults, destroy, getElement: () => element };
  },

  /**
   * Content browser with filters
   */
  contentBrowser: (props = {}) => {
    const {
      initialItems = [],
      filterProps = {},
      gridProps = {},
      onFilter,
      onSelect,
      container = null
    } = props;

    let filterBar = null;
    let contentGrid = null;
    let element = null;
    let allItems = [...initialItems];

    function createElement() {
      element = document.createElement('div');
      element.className = 'tmyl-content-browser';
      return element;
    }

    function render(targetContainer = container) {
      if (!targetContainer) {
        throw new Error('Container required for content browser');
      }

      if (!element) {
        createElement();
      }

      // Create filter bar (using search bar for now)
      filterBar = MoleculeFactory('search-bar', {
        ...filterProps,
        placeholder: 'Filter content...',
        showVoiceInput: false,
        onSearch: (query) => {
          const filtered = allItems.filter(item =>
            item.title?.toLowerCase().includes(query.toLowerCase()) ||
            item.description?.toLowerCase().includes(query.toLowerCase())
          );

          if (contentGrid) {
            contentGrid.filterCards(item =>
              filtered.some(f => f.id === item.id)
            );
          }

          if (onFilter) {
            onFilter(filtered, query);
          }
        },
        container: element
      });
      filterBar.render();

      // Create content grid
      contentGrid = MoleculeFactory('content-card-grid', {
        ...gridProps,
        items: allItems,
        selectionManager: {
          multiSelect: true,
          onSelectionChange: onSelect
        },
        container: element
      });
      contentGrid.render();

      targetContainer.appendChild(element);
      return element;
    }

    function updateItems(newItems) {
      allItems = [...newItems];
      if (contentGrid) {
        contentGrid.destroy();
        contentGrid = MoleculeFactory('content-card-grid', {
          ...gridProps,
          items: allItems,
          selectionManager: {
            multiSelect: true,
            onSelectionChange: onSelect
          },
          container: element
        });
        contentGrid.render(element);
      }
    }

    function destroy() {
      if (filterBar) filterBar.destroy();
      if (contentGrid) contentGrid.destroy();
      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    }

    return { render, updateItems, destroy, getElement: () => element };
  },

  /**
   * Media gallery with search
   */
  mediaGallery: (props = {}) => {
    const {
      mediaItems = [],
      searchProps = {},
      galleryProps = {},
      onSearch,
      onSelect,
      container = null
    } = props;

    return MolecularTemplates.searchInterface({
      searchProps: {
        placeholder: 'Search media...',
        ...searchProps
      },
      gridProps: {
        items: mediaItems,
        cardProps: {
          variant: 'gallery',
          size: 'square',
          selectable: true
        },
        ...galleryProps
      },
      onSearch: onSearch || ((query) => {
        return Promise.resolve(
          mediaItems.filter(item =>
            item.title?.toLowerCase().includes(query.toLowerCase()) ||
            item.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
          )
        );
      }),
      onSelect,
      container
    });
  },

  /**
   * Document explorer
   */
  documentExplorer: (props = {}) => {
    const {
      documents = [],
      searchProps = {},
      explorerProps = {},
      onSearch,
      onSelect,
      container = null
    } = props;

    return MolecularTemplates.contentBrowser({
      initialItems: documents,
      filterProps: {
        placeholder: 'Search documents...',
        ...searchProps
      },
      gridProps: {
        cardProps: {
          variant: 'document',
          size: 'md',
          selectable: true,
          showActions: true
        },
        ...explorerProps
      },
      onFilter: onSearch,
      onSelect,
      container
    });
  }
};

/**
 * Molecular Composition Utilities
 */
export const MolecularComposition = {
  /**
   * Create complex molecular layouts
   */
  createLayout(config) {
    const { type, components, layout, container } = config;

    const layoutElement = document.createElement('div');
    layoutElement.className = `tmyl-molecular-layout tmyl-molecular-layout--${type}`;

    // Apply layout styles
    if (layout.grid) {
      layoutElement.style.display = 'grid';
      if (layout.grid.columns) {
        layoutElement.style.gridTemplateColumns = layout.grid.columns;
      }
      if (layout.grid.rows) {
        layoutElement.style.gridTemplateRows = layout.grid.rows;
      }
      if (layout.grid.gap) {
        layoutElement.style.gap = layout.grid.gap;
      }
    }

    // Create components
    const instances = components.map(comp => {
      const instance = MoleculeFactory(comp.type, comp.props, comp.id);
      const wrapper = document.createElement('div');
      wrapper.className = `tmyl-molecular-layout__item ${comp.className || ''}`;

      if (comp.gridArea) {
        wrapper.style.gridArea = comp.gridArea;
      }

      instance.render(wrapper);
      layoutElement.appendChild(wrapper);

      return { instance, wrapper, config: comp };
    });

    if (container) {
      container.appendChild(layoutElement);
    }

    return {
      element: layoutElement,
      instances,
      destroy() {
        instances.forEach(({ instance }) => {
          if (instance.destroy) instance.destroy();
        });
        if (layoutElement.parentNode) {
          layoutElement.parentNode.removeChild(layoutElement);
        }
      }
    };
  },

  /**
   * Create responsive molecular grid
   */
  createResponsiveGrid(components, options = {}) {
    const {
      breakpoints = {
        sm: '768px',
        md: '1024px',
        lg: '1280px'
      },
      columns = {
        default: 1,
        sm: 2,
        md: 3,
        lg: 4
      },
      gap = '1rem',
      container = null
    } = options;

    return this.createLayout({
      type: 'responsive-grid',
      layout: {
        grid: {
          columns: `repeat(${columns.default}, 1fr)`,
          gap
        }
      },
      components,
      container
    });
  }
};

/**
 * Export individual factories for direct use
 */
export {
  SearchBarFactory,
  ContentCardFactory,
  ContentCardGridFactory,
  ContentCardTemplates
};

/**
 * Default export - main factory function
 */
export default MoleculeFactory;
