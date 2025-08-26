/**
 * Organism Factory System
 * Central orchestrator for all organism components
 */

import { SearchInterfaceFactory, SearchInterfaceTemplates } from './search-interface/search-interface-system.js';

/**
 * Organism Factory Registry
 * Central registry for all organism component factories
 */
class OrganismFactoryRegistry {
  constructor() {
    this.factories = new Map();
    this.instances = new Map();
    this.registerDefaults();
  }

  /**
   * Register default organism factories
   */
  registerDefaults() {
    this.register('search-interface', SearchInterfaceFactory);
  }

  /**
   * Register an organism factory
   */
  register(name, factory) {
    this.factories.set(name, factory);
    return this;
  }

  /**
   * Create organism component instance
   */
  create(type, props = {}, id = null) {
    const Factory = this.factories.get(type);
    
    if (!Factory) {
      throw new Error(`Unknown organism component type: ${type}`);
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
 * Global organism factory registry
 */
export const organismRegistry = new OrganismFactoryRegistry();

/**
 * Organism Factory
 * Convenience factory function for creating organism components
 */
export function OrganismFactory(type, props = {}, id = null) {
  return organismRegistry.create(type, props, id);
}

/**
 * Organism Component Templates
 * Pre-configured organism component combinations
 */
export const OrganismTemplates = {
  /**
   * Full application search page
   */
  searchPage: (props = {}) => {
    const {
      title = 'Search',
      description = 'Find content across your knowledge base',
      searchAPI,
      onResults,
      container = null
    } = props;

    return OrganismFactory('search-interface', {
      title,
      description,
      showHeader: true,
      showFilters: true,
      showResultsActions: true,
      layout: 'vertical',
      size: 'expanded',
      enableVoiceSearch: true,
      enableFiltering: true,
      enableSorting: true,
      searchAPI,
      onResults,
      filters: [
        {
          key: 'type',
          label: 'Content Type',
          type: 'select',
          options: [
            { value: 'all', label: 'All Types' },
            { value: 'article', label: 'Articles' },
            { value: 'document', label: 'Documents' },
            { value: 'note', label: 'Notes' },
            { value: 'bookmark', label: 'Bookmarks' }
          ]
        },
        {
          key: 'date',
          label: 'Date Range',
          type: 'select',
          options: [
            { value: 'any', label: 'Any Time' },
            { value: 'today', label: 'Today' },
            { value: 'week', label: 'This Week' },
            { value: 'month', label: 'This Month' },
            { value: 'year', label: 'This Year' }
          ]
        },
        {
          key: 'tags',
          label: 'Tags',
          type: 'checkbox',
          options: [
            { value: 'important', label: 'Important' },
            { value: 'reference', label: 'Reference' },
            { value: 'todo', label: 'To Do' },
            { value: 'archive', label: 'Archive' }
          ]
        }
      ],
      container
    });
  },

  /**
   * Content management dashboard
   */
  contentDashboard: (props = {}) => {
    const {
      searchAPI,
      onResults,
      container = null
    } = props;

    let element = null;
    let searchInterface = null;
    let statsWidgets = [];

    function createElement() {
      element = document.createElement('div');
      element.className = 'tmyl-content-dashboard';
      
      // Create stats section
      const statsSection = document.createElement('div');
      statsSection.className = 'tmyl-content-dashboard__stats';
      
      // Create search section
      const searchSection = document.createElement('div');
      searchSection.className = 'tmyl-content-dashboard__search';
      
      element.appendChild(statsSection);
      element.appendChild(searchSection);
      
      return element;
    }

    function render(targetContainer = container) {
      if (!targetContainer) {
        throw new Error('Container required for content dashboard');
      }

      if (!element) {
        createElement();
      }

      // Create search interface
      searchInterface = OrganismFactory('search-interface', {
        title: 'Content Library',
        description: 'Search and manage your content',
        showHeader: true,
        showFilters: true,
        showResultsActions: true,
        layout: 'vertical',
        size: 'default',
        searchAPI,
        onResults: (results, count) => {
          updateStats(results, count);
          if (onResults) onResults(results, count);
        },
        container: element.querySelector('.tmyl-content-dashboard__search')
      });
      searchInterface.render();

      targetContainer.appendChild(element);
      return element;
    }

    function updateStats(results, count) {
      // Update dashboard statistics
      const statsSection = element.querySelector('.tmyl-content-dashboard__stats');
      if (statsSection) {
        statsSection.innerHTML = `
          <div class="tmyl-dashboard-stat">
            <div class="tmyl-dashboard-stat__value">${count}</div>
            <div class="tmyl-dashboard-stat__label">Total Items</div>
          </div>
          <div class="tmyl-dashboard-stat">
            <div class="tmyl-dashboard-stat__value">${new Set(results.map(r => r.type)).size}</div>
            <div class="tmyl-dashboard-stat__label">Content Types</div>
          </div>
          <div class="tmyl-dashboard-stat">
            <div class="tmyl-dashboard-stat__value">${results.filter(r => r.date && new Date(r.date) > new Date(Date.now() - 7*24*60*60*1000)).length}</div>
            <div class="tmyl-dashboard-stat__label">Added This Week</div>
          </div>
        `;
      }
    }

    function destroy() {
      if (searchInterface) searchInterface.destroy();
      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    }

    return { render, destroy, getElement: () => element, getSearchInterface: () => searchInterface };
  },

  /**
   * Knowledge base explorer
   */
  knowledgeExplorer: (props = {}) => {
    const {
      searchAPI,
      onResults,
      container = null
    } = props;

    return OrganismFactory('search-interface', {
      title: 'Knowledge Base',
      description: 'Explore your personal knowledge network',
      showHeader: true,
      showFilters: true,
      showResultsActions: true,
      layout: 'horizontal',
      size: 'expanded',
      enableVoiceSearch: true,
      searchAPI,
      onResults,
      filters: [
        {
          key: 'category',
          label: 'Category',
          type: 'select',
          options: [
            { value: 'research', label: 'Research' },
            { value: 'learning', label: 'Learning' },
            { value: 'projects', label: 'Projects' },
            { value: 'ideas', label: 'Ideas' },
            { value: 'reference', label: 'Reference' }
          ]
        },
        {
          key: 'connections',
          label: 'Connections',
          type: 'checkbox',
          options: [
            { value: 'linked', label: 'Linked Content' },
            { value: 'related', label: 'Related Items' },
            { value: 'recent', label: 'Recently Viewed' }
          ]
        }
      ],
      container
    });
  },

  /**
   * Media library browser
   */
  mediaLibrary: (props = {}) => {
    const {
      searchAPI,
      onResults,
      container = null
    } = props;

    return OrganismFactory('search-interface', {
      title: 'Media Library',
      description: 'Browse and search your media files',
      showHeader: true,
      showFilters: true,
      showResultsActions: true,
      layout: 'vertical',
      size: 'expanded',
      searchProps: {
        placeholder: 'Search images, videos, audio...'
      },
      searchAPI,
      onResults,
      filters: [
        {
          key: 'mediaType',
          label: 'Media Type',
          type: 'radio',
          options: [
            { value: 'all', label: 'All Media' },
            { value: 'image', label: 'Images' },
            { value: 'video', label: 'Videos' },
            { value: 'audio', label: 'Audio' }
          ]
        },
        {
          key: 'format',
          label: 'Format',
          type: 'checkbox',
          options: [
            { value: 'jpg', label: 'JPEG' },
            { value: 'png', label: 'PNG' },
            { value: 'mp4', label: 'MP4' },
            { value: 'mp3', label: 'MP3' }
          ]
        },
        {
          key: 'size',
          label: 'File Size',
          type: 'select',
          options: [
            { value: 'small', label: 'Small (< 1MB)' },
            { value: 'medium', label: 'Medium (1-10MB)' },
            { value: 'large', label: 'Large (> 10MB)' }
          ]
        }
      ],
      container
    });
  }
};

/**
 * Organism Composition Utilities
 */
export const OrganismComposition = {
  /**
   * Create multi-organism application layout
   */
  createApplicationLayout(config) {
    const { organisms, layout, container } = config;
    
    const layoutElement = document.createElement('div');
    layoutElement.className = `tmyl-application-layout tmyl-application-layout--${layout.type}`;
    
    // Apply layout styles
    if (layout.grid) {
      layoutElement.style.display = 'grid';
      if (layout.grid.areas) {
        layoutElement.style.gridTemplateAreas = layout.grid.areas;
      }
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
    
    // Create organisms
    const instances = organisms.map(organism => {
      const instance = OrganismFactory(organism.type, organism.props, organism.id);
      const wrapper = document.createElement('div');
      wrapper.className = `tmyl-application-layout__organism ${organism.className || ''}`;
      
      if (organism.gridArea) {
        wrapper.style.gridArea = organism.gridArea;
      }
      
      instance.render(wrapper);
      layoutElement.appendChild(wrapper);
      
      return { instance, wrapper, config: organism };
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
   * Create responsive organism grid
   */
  createResponsiveOrganismGrid(organisms, options = {}) {
    const {
      breakpoints = {
        sm: '768px',
        md: '1024px',
        lg: '1280px'
      },
      columns = {
        default: 1,
        sm: 1,
        md: 2,
        lg: 2
      },
      gap = '2rem',
      container = null
    } = options;

    return this.createApplicationLayout({
      type: 'responsive-grid',
      layout: {
        grid: {
          columns: `repeat(${columns.default}, 1fr)`,
          gap
        }
      },
      organisms,
      container
    });
  },

  /**
   * Create tabbed organism interface
   */
  createTabbedInterface(tabs, options = {}) {
    const { container, activeTab = 0 } = options;
    
    const tabbedContainer = document.createElement('div');
    tabbedContainer.className = 'tmyl-tabbed-organism-interface';
    
    // Create tab navigation
    const tabNav = document.createElement('div');
    tabNav.className = 'tmyl-tabbed-organism__nav';
    
    const tabContent = document.createElement('div');
    tabContent.className = 'tmyl-tabbed-organism__content';
    
    const organisms = tabs.map((tab, index) => {
      // Create tab button
      const tabButton = document.createElement('button');
      tabButton.className = `tmyl-tabbed-organism__tab ${index === activeTab ? 'tmyl-tabbed-organism__tab--active' : ''}`;
      tabButton.textContent = tab.label;
      tabButton.addEventListener('click', () => switchTab(index));
      tabNav.appendChild(tabButton);
      
      // Create organism
      const organism = OrganismFactory(tab.type, {
        ...tab.props,
        container: null
      });
      
      const tabPanel = document.createElement('div');
      tabPanel.className = `tmyl-tabbed-organism__panel ${index === activeTab ? 'tmyl-tabbed-organism__panel--active' : ''}`;
      organism.render(tabPanel);
      tabContent.appendChild(tabPanel);
      
      return { organism, button: tabButton, panel: tabPanel };
    });
    
    function switchTab(index) {
      organisms.forEach((item, i) => {
        const isActive = i === index;
        item.button.classList.toggle('tmyl-tabbed-organism__tab--active', isActive);
        item.panel.classList.toggle('tmyl-tabbed-organism__panel--active', isActive);
      });
    }
    
    tabbedContainer.appendChild(tabNav);
    tabbedContainer.appendChild(tabContent);
    
    if (container) {
      container.appendChild(tabbedContainer);
    }
    
    return {
      element: tabbedContainer,
      organisms: organisms.map(item => item.organism),
      switchTab,
      destroy() {
        organisms.forEach(item => item.organism.destroy());
        if (tabbedContainer.parentNode) {
          tabbedContainer.parentNode.removeChild(tabbedContainer);
        }
      }
    };
  }
};

/**
 * Export individual factories for direct use
 */
export {
  SearchInterfaceFactory,
  SearchInterfaceTemplates
};

/**
 * Default export - main factory function
 */
export default OrganismFactory;
