/**
 * Search Interface System Factory
 * Complete search interface organism with molecular composition
 */

import { createSearchInterfaceTemplate, searchInterfaceTemplates } from './templates/search-interface-template.js';
import { createSearchInterfaceController, searchInterfaceUtils } from './controllers/search-interface-controller.js';
import { MoleculeFactory } from '../../molecules/molecule-factory.js';

/**
 * Search Interface Factory
 * Creates complete search interface organisms with molecular composition
 */
export function SearchInterfaceFactory(props = {}) {
  const {
    title = '',
    description = '',
    searchProps = {},
    filters = [],
    initialQuery = '',
    initialFilters = {},
    searchAPI = null,
    onSearch = null,
    onResults = null,
    onError = null,
    onSelection = null,
    
    // Interface options
    showHeader = true,
    showFilters = false,
    showResultsActions = true,
    layout = 'vertical',
    size = 'default',
    className = '',
    
    // Behavior options
    debounceMs = 300,
    pageSize = 20,
    enableVoiceSearch = true,
    enableFiltering = true,
    enableSorting = true,
    trackAnalytics = true,
    
    // Container
    container = null
  } = props;

  let element = null;
  let controller = null;
  let molecularComponents = new Map();

  /**
   * Create search interface element
   */
  function createElement() {
    const template = createSearchInterfaceTemplate({
      title,
      description,
      searchProps: {
        value: initialQuery,
        showVoiceInput: enableVoiceSearch,
        ...searchProps
      },
      showHeader,
      showFilters,
      filters,
      showResultsActions,
      layout,
      size,
      className,
      resultsCount: 0,
      results: [],
      loading: false,
      error: null
    });

    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = template;
    element = tempContainer.firstElementChild;

    return element;
  }

  /**
   * Initialize molecular components
   */
  function initializeMolecularComponents() {
    if (!element) return;

    // Initialize search bar molecule
    const searchBarContainer = element.querySelector('.tmyl-search-interface__search-bar');
    if (searchBarContainer) {
      const searchBar = MoleculeFactory('search-bar', {
        value: initialQuery,
        showVoiceInput: enableVoiceSearch,
        showAdvancedFilters: false,
        container: searchBarContainer,
        ...searchProps
      });
      
      molecularComponents.set('searchBar', searchBar);
    }

    return molecularComponents;
  }

  /**
   * Initialize controller
   */
  function initializeController() {
    if (!element) return;

    controller = createSearchInterfaceController(element, {
      searchAPI,
      initialQuery,
      initialFilters,
      debounceMs,
      pageSize,
      enableVoiceSearch,
      enableFiltering,
      enableSorting,
      onSearch,
      onResults,
      onError,
      onSelection,
      trackAnalytics
    });

    // Store controller reference on element
    element._searchInterfaceController = controller;

    return controller;
  }

  /**
   * Render to container
   */
  function render(targetContainer = container) {
    if (!targetContainer) {
      throw new Error('Container element required for rendering');
    }

    if (!element) {
      createElement();
    }

    targetContainer.appendChild(element);

    // Initialize molecular components after DOM insertion
    initializeMolecularComponents();
    
    if (!controller) {
      initializeController();
    }

    return element;
  }

  /**
   * Update search interface properties
   */
  function update(newProps) {
    if (!element || !controller) return;

    // Update filters
    if (newProps.filters !== undefined) {
      controller.setFilters(newProps.filters);
    }

    // Perform new search
    if (newProps.query !== undefined) {
      controller.search(newProps.query);
    }

    // For major structural changes, recreate
    if (newProps.layout || newProps.size || newProps.showFilters !== undefined) {
      const parent = element.parentNode;
      const newElement = SearchInterfaceFactory({
        ...props,
        ...newProps,
        container: null
      }).getElement();
      
      if (parent) {
        parent.replaceChild(newElement, element);
      }
      
      // Cleanup old components
      cleanup();
      
      element = newElement;
      controller = element._searchInterfaceController;
    }
  }

  /**
   * Perform search
   */
  function search(query, filters = {}) {
    if (controller) {
      controller.search(query);
      if (Object.keys(filters).length > 0) {
        controller.setFilters(filters);
      }
    }
  }

  /**
   * Clear search and results
   */
  function clear() {
    if (controller) {
      controller.search('');
      controller.clearFilters();
      controller.clearSelection();
    }
  }

  /**
   * Get current results
   */
  function getResults() {
    return controller ? controller.getResults() : [];
  }

  /**
   * Get current selection
   */
  function getSelection() {
    return controller ? controller.getSelection() : [];
  }

  /**
   * Get current state
   */
  function getState() {
    return controller ? controller.getState() : {};
  }

  /**
   * Cleanup and destroy
   */
  function cleanup() {
    // Destroy molecular components
    molecularComponents.forEach(component => {
      if (component && typeof component.destroy === 'function') {
        component.destroy();
      }
    });
    molecularComponents.clear();

    // Destroy controller
    if (controller) {
      controller.destroy();
      controller = null;
    }
  }

  /**
   * Remove from DOM and cleanup
   */
  function destroy() {
    cleanup();

    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }

    element = null;
  }

  /**
   * Get element
   */
  function getElement() {
    if (!element) {
      createElement();
      initializeMolecularComponents();
      initializeController();
    }
    return element;
  }

  /**
   * Get controller
   */
  function getController() {
    if (!controller && element) {
      initializeController();
    }
    return controller;
  }

  /**
   * Public API
   */
  return {
    // Lifecycle
    render,
    update,
    destroy,
    
    // Actions
    search,
    clear,
    
    // Data access
    getResults,
    getSelection,
    getState,
    
    // Element access
    getElement,
    getController,
    
    // Properties
    get props() {
      return {
        title,
        description,
        searchProps,
        filters,
        initialQuery,
        initialFilters,
        showHeader,
        showFilters,
        showResultsActions,
        layout,
        size,
        className
      };
    }
  };
}

/**
 * Search Interface Templates
 * Pre-configured search interface factories
 */
export const SearchInterfaceTemplates = {
  /**
   * Simple search widget
   */
  simple: (props = {}) => SearchInterfaceFactory({
    ...props,
    showHeader: false,
    showFilters: false,
    showResultsActions: false,
    size: 'compact',
    layout: 'vertical'
  }),

  /**
   * Full-featured search interface
   */
  advanced: (props = {}) => SearchInterfaceFactory({
    ...props,
    showHeader: true,
    showFilters: true,
    showResultsActions: true,
    size: 'default',
    layout: 'vertical',
    enableVoiceSearch: true,
    enableFiltering: true,
    enableSorting: true
  }),

  /**
   * Dashboard search widget
   */
  dashboard: (props = {}) => SearchInterfaceFactory({
    ...props,
    showHeader: false,
    showFilters: false,
    showResultsActions: false,
    size: 'compact',
    pageSize: 10
  }),

  /**
   * Media search interface
   */
  media: (props = {}) => SearchInterfaceFactory({
    ...props,
    showHeader: true,
    showFilters: true,
    showResultsActions: true,
    searchProps: {
      placeholder: 'Search media files...',
      ...props.searchProps
    },
    filters: [
      {
        key: 'type',
        label: 'Type',
        type: 'select',
        options: [
          { value: 'image', label: 'Images' },
          { value: 'video', label: 'Videos' },
          { value: 'audio', label: 'Audio' },
          { value: 'document', label: 'Documents' }
        ]
      },
      ...props.filters || []
    ]
  }),

  /**
   * Document search interface
   */
  documents: (props = {}) => SearchInterfaceFactory({
    ...props,
    showHeader: true,
    showFilters: true,
    showResultsActions: true,
    searchProps: {
      placeholder: 'Search documents...',
      ...props.searchProps
    },
    filters: [
      {
        key: 'format',
        label: 'Format',
        type: 'checkbox',
        options: [
          { value: 'pdf', label: 'PDF' },
          { value: 'doc', label: 'Word' },
          { value: 'txt', label: 'Text' },
          { value: 'md', label: 'Markdown' }
        ]
      },
      {
        key: 'size',
        label: 'Size',
        type: 'select',
        options: [
          { value: 'small', label: 'Small (< 1MB)' },
          { value: 'medium', label: 'Medium (1-10MB)' },
          { value: 'large', label: 'Large (> 10MB)' }
        ]
      },
      ...props.filters || []
    ]
  }),

  /**
   * Content search interface
   */
  content: (props = {}) => SearchInterfaceFactory({
    ...props,
    showHeader: true,
    showFilters: true,
    showResultsActions: true,
    searchProps: {
      placeholder: 'Search all content...',
      showVoiceInput: true,
      ...props.searchProps
    },
    filters: [
      {
        key: 'category',
        label: 'Category',
        type: 'select',
        options: [
          { value: 'article', label: 'Articles' },
          { value: 'note', label: 'Notes' },
          { value: 'bookmark', label: 'Bookmarks' },
          { value: 'file', label: 'Files' }
        ]
      },
      {
        key: 'date',
        label: 'Date Range',
        type: 'select',
        options: [
          { value: 'today', label: 'Today' },
          { value: 'week', label: 'This Week' },
          { value: 'month', label: 'This Month' },
          { value: 'year', label: 'This Year' }
        ]
      },
      ...props.filters || []
    ]
  })
};

/**
 * Search Interface Composition Utilities
 */
export const SearchInterfaceComposition = {
  /**
   * Create multi-tabbed search interface
   */
  createTabbedSearch(tabs, options = {}) {
    const { container, activeTab = 0 } = options;
    
    const tabbedContainer = document.createElement('div');
    tabbedContainer.className = 'tmyl-tabbed-search-interface';
    
    // Create tab navigation
    const tabNav = document.createElement('div');
    tabNav.className = 'tmyl-tabbed-search__nav';
    
    const tabContent = document.createElement('div');
    tabContent.className = 'tmyl-tabbed-search__content';
    
    const searchInterfaces = tabs.map((tab, index) => {
      // Create tab button
      const tabButton = document.createElement('button');
      tabButton.className = `tmyl-tabbed-search__tab ${index === activeTab ? 'tmyl-tabbed-search__tab--active' : ''}`;
      tabButton.textContent = tab.label;
      tabButton.addEventListener('click', () => switchTab(index));
      tabNav.appendChild(tabButton);
      
      // Create search interface
      const searchInterface = SearchInterfaceFactory({
        ...tab.props,
        container: null
      });
      
      const tabPanel = document.createElement('div');
      tabPanel.className = `tmyl-tabbed-search__panel ${index === activeTab ? 'tmyl-tabbed-search__panel--active' : ''}`;
      searchInterface.render(tabPanel);
      tabContent.appendChild(tabPanel);
      
      return { searchInterface, button: tabButton, panel: tabPanel };
    });
    
    function switchTab(index) {
      searchInterfaces.forEach((item, i) => {
        const isActive = i === index;
        item.button.classList.toggle('tmyl-tabbed-search__tab--active', isActive);
        item.panel.classList.toggle('tmyl-tabbed-search__panel--active', isActive);
      });
    }
    
    tabbedContainer.appendChild(tabNav);
    tabbedContainer.appendChild(tabContent);
    
    if (container) {
      container.appendChild(tabbedContainer);
    }
    
    return {
      element: tabbedContainer,
      interfaces: searchInterfaces.map(item => item.searchInterface),
      switchTab,
      destroy() {
        searchInterfaces.forEach(item => item.searchInterface.destroy());
        if (tabbedContainer.parentNode) {
          tabbedContainer.parentNode.removeChild(tabbedContainer);
        }
      }
    };
  },

  /**
   * Create search interface with side filters
   */
  createSideFilterSearch(props = {}) {
    const { filterProps = {}, searchProps = {}, ...rest } = props;
    
    return SearchInterfaceFactory({
      ...rest,
      layout: 'horizontal',
      showFilters: true,
      searchProps: {
        showAdvancedFilters: false,
        ...searchProps
      },
      ...filterProps
    });
  },

  /**
   * Create unified search across multiple sources
   */
  createUnifiedSearch(sources, options = {}) {
    const {
      container,
      searchProps = {},
      onResults = () => {},
      ...rest
    } = options;
    
    const unifiedSearch = SearchInterfaceFactory({
      ...rest,
      searchProps: {
        placeholder: 'Search across all sources...',
        ...searchProps
      },
      onSearch: async (params) => {
        try {
          // Search all sources in parallel
          const searchPromises = sources.map(async (source) => {
            try {
              const results = await source.search(params);
              return {
                source: source.name,
                results: results.results || [],
                totalCount: results.totalCount || 0
              };
            } catch (error) {
              console.warn(`Search failed for source ${source.name}:`, error);
              return {
                source: source.name,
                results: [],
                totalCount: 0,
                error
              };
            }
          });
          
          const sourceResults = await Promise.all(searchPromises);
          
          // Combine and deduplicate results
          const allResults = [];
          const seenIds = new Set();
          
          sourceResults.forEach(({ source, results, error }) => {
            if (error) return;
            
            results.forEach(result => {
              const id = result.id || `${source}-${result.title}`;
              if (!seenIds.has(id)) {
                seenIds.add(id);
                allResults.push({
                  ...result,
                  _source: source,
                  id
                });
              }
            });
          });
          
          const totalCount = allResults.length;
          
          onResults(allResults, totalCount);
          
          return {
            results: allResults,
            totalCount,
            sources: sourceResults
          };
        } catch (error) {
          console.error('Unified search error:', error);
          throw error;
        }
      },
      container
    });
    
    return unifiedSearch;
  }
};

/**
 * Export utilities
 */
export { searchInterfaceUtils };

/**
 * Export main factory as default
 */
export default SearchInterfaceFactory;
