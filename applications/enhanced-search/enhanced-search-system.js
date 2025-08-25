/**
 * Enhanced Search Application - System Factory
 * Complete modular system following atomic design principles
 */

import { EnhancedSearchTemplates } from './enhanced-search-template.js';
import { EnhancedSearchController } from './enhanced-search-controller.js';

/**
 * Enhanced Search Application Factory
 * Creates complete, feature-rich search applications with atomic design composition
 */
export function EnhancedSearchApplicationFactory(props = {}) {
  const {
    // Container
    container = null,
    
    // API Configuration
    meilisearchUrl = '/api/search',
    apiBase = '/api/content',
    analyticsEndpoint = '/api/analytics',
    
    // Feature Configuration
    voiceEnabled = true,
    naturalLanguage = true,
    smartFilters = true,
    recentSearches = true,
    searchSuggestions = true,
    enableAnalytics = true,
    enableAutoComplete = true,
    enableExport = false,
    
    // UI Configuration
    title = 'Enhanced Search',
    description = 'Intelligent content discovery with natural language processing',
    placeholder = 'Search content... Try "Find PDFs about coffee from last month"',
    layout = 'vertical',
    viewMode = 'grid',
    perPage = 20,
    showSidebar = true,
    showLogo = false,
    logoUrl = '',
    breadcrumbs = [],
    
    // Styling
    theme = 'default',
    darkMode = 'auto',
    customStyles = '',
    
    // Event Handlers
    onSearch = null,
    onResults = null,
    onContentSelection = null,
    onError = null,
    onAnalytics = null,
    
    // Advanced Options
    searchEngines = ['meilisearch', 'vectorize'],
    cacheResults = true,
    debounceDelay = 300,
    maxRecentSearches = 10,
    
    // Accessibility
    ariaLabel = 'Enhanced search application',
    announceResults = true,
    keyboardShortcuts = true
  } = props;

  let element = null;
  let controller = null;
  let styleSheet = null;

  /**
   * Create the enhanced search application
   */
  function create() {
    try {
      element = createApplicationElement();
      styleSheet = createStyleSheet();
      controller = createController();
      
      if (container) {
        mount(container);
      }
      
      return {
        element,
        controller,
        mount,
        unmount,
        destroy,
        search,
        setFilters,
        getState,
        getResults,
        on,
        off
      };
    } catch (error) {
      console.error('Enhanced Search Application creation failed:', error);
      throw error;
    }
  }

  /**
   * Create application element
   */
  function createApplicationElement() {
    const appElement = document.createElement('div');
    appElement.setAttribute('role', 'application');
    appElement.setAttribute('aria-label', ariaLabel);
    appElement.setAttribute('data-enhanced-search-app', '');
    
    // Apply theme classes
    appElement.className = `tmyl-enhanced-search tmyl-enhanced-search--theme-${theme}`;
    if (darkMode !== 'auto') {
      appElement.classList.add(`tmyl-enhanced-search--${darkMode ? 'dark' : 'light'}`);
    }

    // Generate application template
    appElement.innerHTML = EnhancedSearchTemplates.application({
      title,
      description,
      layout,
      showSidebar,
      showAnalytics: enableAnalytics
    });

    // Add custom styles if provided
    if (customStyles) {
      const customStyleElement = document.createElement('style');
      customStyleElement.textContent = customStyles;
      appElement.appendChild(customStyleElement);
    }

    return appElement;
  }

  /**
   * Create stylesheet
   */
  function createStyleSheet() {
    // CSS is imported separately, but we could inject dynamic styles here
    const style = document.createElement('style');
    style.setAttribute('data-enhanced-search-styles', '');
    
    // Add dynamic theme variables
    const themeVars = generateThemeVariables();
    style.textContent = `:root { ${themeVars} }`;
    
    document.head.appendChild(style);
    return style;
  }

  /**
   * Generate theme variables
   */
  function generateThemeVariables() {
    const vars = [];
    
    // Apply theme-specific color overrides
    if (theme === 'corporate') {
      vars.push('--color-primary: #1a365d');
      vars.push('--color-accent: #3182ce');
    } else if (theme === 'modern') {
      vars.push('--color-primary: #667eea');
      vars.push('--color-accent: #764ba2');
    } else if (theme === 'minimal') {
      vars.push('--color-primary: #2d3748');
      vars.push('--color-accent: #4a5568');
    }
    
    return vars.join('; ');
  }

  /**
   * Create controller
   */
  function createController() {
    const controllerOptions = {
      meilisearchUrl,
      apiBase,
      analyticsEndpoint,
      voiceEnabled,
      naturalLanguage,
      smartFilters,
      recentSearches,
      searchSuggestions,
      enableAnalytics,
      enableAutoComplete,
      enableExport,
      placeholder,
      layout,
      viewMode,
      perPage,
      searchEngines,
      cacheResults,
      debounceDelay,
      maxRecentSearches,
      announceResults,
      keyboardShortcuts
    };

    const searchController = new EnhancedSearchController(element, controllerOptions);

    // Set up event forwarding
    setupEventForwarding(searchController);

    return searchController;
  }

  /**
   * Setup event forwarding from controller to factory
   */
  function setupEventForwarding(searchController) {
    // Forward search events
    if (onSearch) {
      searchController.on('search', (event) => {
        onSearch(event.detail);
      });
    }

    // Forward results events
    if (onResults) {
      searchController.on('resultsUpdated', (event) => {
        onResults(event.detail);
      });
    }

    // Forward content selection events
    if (onContentSelection) {
      searchController.on('contentSelected', (event) => {
        onContentSelection(event.detail);
      });
    }

    // Forward error events
    if (onError) {
      searchController.on('error', (event) => {
        onError(event.detail);
      });
    }

    // Forward analytics events
    if (onAnalytics) {
      searchController.on('analyticsEvent', (event) => {
        onAnalytics(event.detail);
      });
    }
  }

  /**
   * Mount to container
   */
  function mount(targetContainer) {
    if (!targetContainer) {
      throw new Error('Container is required for mounting');
    }

    targetContainer.appendChild(element);
    
    // Trigger mounted event
    element.dispatchEvent(new CustomEvent('tmyl-enhanced-search:mounted', {
      detail: { factory: create },
      bubbles: true
    }));
  }

  /**
   * Unmount from container
   */
  function unmount() {
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
      
      // Trigger unmounted event
      element.dispatchEvent(new CustomEvent('tmyl-enhanced-search:unmounted', {
        detail: { factory: create },
        bubbles: true
      }));
    }
  }

  /**
   * Public API methods
   */
  
  function search(query, options = {}) {
    if (!controller) {
      throw new Error('Controller not initialized');
    }
    return controller.search(query, options);
  }

  function setFilters(filters) {
    if (!controller) {
      throw new Error('Controller not initialized');
    }
    return controller.setFilters(filters);
  }

  function getState() {
    if (!controller) {
      throw new Error('Controller not initialized');
    }
    return controller.getState();
  }

  function getResults() {
    if (!controller) {
      throw new Error('Controller not initialized');
    }
    return controller.getResults();
  }

  function on(eventName, handler) {
    if (!element) {
      throw new Error('Element not initialized');
    }
    element.addEventListener(`tmyl-enhanced-search:${eventName}`, handler);
  }

  function off(eventName, handler) {
    if (!element) {
      throw new Error('Element not initialized');
    }
    element.removeEventListener(`tmyl-enhanced-search:${eventName}`, handler);
  }

  /**
   * Cleanup and destroy
   */
  function destroy() {
    try {
      // Destroy controller
      if (controller && controller.destroy) {
        controller.destroy();
      }

      // Remove stylesheet
      if (styleSheet && styleSheet.parentNode) {
        styleSheet.parentNode.removeChild(styleSheet);
      }

      // Unmount element
      unmount();

      // Clear references
      element = null;
      controller = null;
      styleSheet = null;
    } catch (error) {
      console.error('Enhanced Search Application cleanup failed:', error);
    }
  }

  // Return factory instance
  return create();
}

/**
 * Enhanced Search Application Presets
 * Pre-configured application setups for common use cases
 */
export const EnhancedSearchPresets = {
  /**
   * Standard search application
   */
  standard(props = {}) {
    return EnhancedSearchApplicationFactory({
      title: 'Content Search',
      description: 'Search and discover your content',
      showSidebar: true,
      enableAnalytics: true,
      enableExport: false,
      theme: 'default',
      ...props
    });
  },

  /**
   * Advanced search application with all features
   */
  advanced(props = {}) {
    return EnhancedSearchApplicationFactory({
      title: 'Advanced Content Discovery',
      description: 'Intelligent search with natural language processing',
      voiceEnabled: true,
      naturalLanguage: true,
      smartFilters: true,
      enableAnalytics: true,
      enableExport: true,
      searchEngines: ['meilisearch', 'vectorize'],
      theme: 'modern',
      ...props
    });
  },

  /**
   * Minimal search application
   */
  minimal(props = {}) {
    return EnhancedSearchApplicationFactory({
      title: 'Search',
      description: '',
      showSidebar: false,
      enableAnalytics: false,
      enableExport: false,
      recentSearches: false,
      theme: 'minimal',
      layout: 'compact',
      ...props
    });
  },

  /**
   * Corporate/enterprise search application
   */
  enterprise(props = {}) {
    return EnhancedSearchApplicationFactory({
      title: 'Enterprise Content Search',
      description: 'Secure content discovery for enterprise environments',
      enableAnalytics: true,
      enableExport: true,
      searchEngines: ['meilisearch', 'vectorize'],
      theme: 'corporate',
      announceResults: true,
      keyboardShortcuts: true,
      ...props
    });
  },

  /**
   * Mobile-optimized search application
   */
  mobile(props = {}) {
    return EnhancedSearchApplicationFactory({
      title: 'Search',
      showSidebar: false,
      layout: 'compact',
      viewMode: 'list',
      perPage: 10,
      voiceEnabled: true,
      theme: 'minimal',
      ...props
    });
  }
};

/**
 * Enhanced Search Application Manager
 * Manages multiple search application instances
 */
export class EnhancedSearchApplicationManager {
  constructor() {
    this.applications = new Map();
    this.defaultContainer = null;
  }

  /**
   * Create and register application
   */
  create(id, props = {}) {
    if (this.applications.has(id)) {
      throw new Error(`Application with id '${id}' already exists`);
    }

    const app = EnhancedSearchApplicationFactory(props);
    this.applications.set(id, app);
    
    return app;
  }

  /**
   * Get application by id
   */
  get(id) {
    return this.applications.get(id);
  }

  /**
   * Remove application
   */
  remove(id) {
    const app = this.applications.get(id);
    if (app) {
      app.destroy();
      this.applications.delete(id);
      return true;
    }
    return false;
  }

  /**
   * Get all applications
   */
  getAll() {
    return Array.from(this.applications.values());
  }

  /**
   * Set default container for new applications
   */
  setDefaultContainer(container) {
    this.defaultContainer = container;
  }

  /**
   * Create application with auto-generated id
   */
  createAuto(props = {}) {
    const id = `search-app-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    if (this.defaultContainer && !props.container) {
      props.container = this.defaultContainer;
    }
    
    return this.create(id, props);
  }

  /**
   * Destroy all applications
   */
  destroyAll() {
    this.applications.forEach(app => app.destroy());
    this.applications.clear();
  }

  /**
   * Get application statistics
   */
  getStats() {
    const apps = Array.from(this.applications.values());
    
    return {
      totalApplications: apps.length,
      totalSearches: apps.reduce((sum, app) => {
        const state = app.getState();
        return sum + (state.analytics?.searchCount || 0);
      }, 0),
      averageResults: apps.reduce((sum, app) => {
        const results = app.getResults();
        return sum + results.length;
      }, 0) / Math.max(apps.length, 1)
    };
  }
}

/**
 * Enhanced Search Application Utilities
 */
export const EnhancedSearchApplicationUtils = {
  /**
   * Validate application configuration
   */
  validateConfig(config) {
    const errors = [];
    
    if (config.meilisearchUrl && typeof config.meilisearchUrl !== 'string') {
      errors.push('meilisearchUrl must be a string');
    }
    
    if (config.perPage && (!Number.isInteger(config.perPage) || config.perPage < 1)) {
      errors.push('perPage must be a positive integer');
    }
    
    if (config.searchEngines && !Array.isArray(config.searchEngines)) {
      errors.push('searchEngines must be an array');
    }
    
    if (config.theme && !['default', 'modern', 'minimal', 'corporate'].includes(config.theme)) {
      errors.push('theme must be one of: default, modern, minimal, corporate');
    }
    
    return errors;
  },

  /**
   * Get recommended configuration for use case
   */
  getRecommendedConfig(useCase) {
    const configs = {
      'content-discovery': {
        naturalLanguage: true,
        smartFilters: true,
        enableAnalytics: true,
        searchEngines: ['meilisearch', 'vectorize']
      },
      'document-search': {
        showSidebar: true,
        enableExport: true,
        viewMode: 'list',
        smartFilters: true
      },
      'media-library': {
        viewMode: 'grid',
        enableExport: true,
        smartFilters: true,
        perPage: 50
      },
      'knowledge-base': {
        naturalLanguage: true,
        enableAnalytics: true,
        recentSearches: true,
        searchSuggestions: true
      }
    };
    
    return configs[useCase] || {};
  },

  /**
   * Auto-detect optimal configuration
   */
  autoDetectConfig(container) {
    const config = {};
    
    // Detect container size for responsive settings
    if (container) {
      const width = container.offsetWidth;
      
      if (width < 768) {
        config.showSidebar = false;
        config.layout = 'compact';
        config.viewMode = 'list';
        config.perPage = 10;
      } else if (width < 1200) {
        config.showSidebar = true;
        config.viewMode = 'list';
        config.perPage = 20;
      } else {
        config.showSidebar = true;
        config.viewMode = 'grid';
        config.perPage = 30;
      }
    }
    
    // Detect dark mode preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      config.darkMode = true;
    }
    
    // Detect touch device
    if ('ontouchstart' in window) {
      config.voiceEnabled = true;
      config.keyboardShortcuts = false;
    }
    
    return config;
  },

  /**
   * Performance monitoring
   */
  createPerformanceMonitor(app) {
    const monitor = {
      searchTimes: [],
      renderTimes: [],
      errorCount: 0
    };
    
    app.on('search', (event) => {
      const startTime = performance.now();
      
      app.on('resultsUpdated', (resultsEvent) => {
        const endTime = performance.now();
        monitor.searchTimes.push(endTime - startTime);
      });
    });
    
    app.on('error', () => {
      monitor.errorCount++;
    });
    
    return {
      getStats: () => ({
        averageSearchTime: monitor.searchTimes.reduce((a, b) => a + b, 0) / monitor.searchTimes.length || 0,
        totalSearches: monitor.searchTimes.length,
        errorRate: monitor.errorCount / monitor.searchTimes.length || 0
      }),
      reset: () => {
        monitor.searchTimes = [];
        monitor.renderTimes = [];
        monitor.errorCount = 0;
      }
    };
  }
};

// Create singleton manager instance
export const searchApplicationManager = new EnhancedSearchApplicationManager();

// Export factory as default
export default EnhancedSearchApplicationFactory;
