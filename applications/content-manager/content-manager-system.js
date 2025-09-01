/**
 * Content Manager Application System
 * Modular factory for content management applications
 */

import { createContentManagerTemplate } from './content-manager-template.js';
import { ContentManagerController } from './content-manager-controller.js';

/**
 * Content Manager Application Factory
 * Creates modular content management applications with separated concerns
 */
export function ContentManagerApplicationFactory(props = {}) {
  const {
    // API Configuration
    apiBase = '/api/content',
    meilisearchUrl = '/api/search',
    uploadEndpoint = '/api/upload',

    // Feature Configuration
    selectionMode = true,
    showUpload = true,
    maxFileSize = 25 * 1024 * 1024, // 25MB
    allowedFileTypes = ['pdf', 'doc', 'docx', 'txt', 'md', 'jpg', 'png', 'mp4', 'mp3'],

    // Enhanced search features
    voiceSearch = true,
    naturalLanguage = true,
    smartFilters = true,

    // UI Configuration
    title = 'Content Manager',
    description = 'Manage and search your content library',
    currentView = 'grid', // 'grid', 'list', 'timeline'
    sortBy = 'relevance', // 'relevance', 'date', 'title', 'size'

    // Business Logic Handlers
    onContentLoad,
    onContentSelect,
    onContentUpload,
    onContentDelete,
    onAnalytics,

    // Container
    container = null
  } = props;

  let element = null;
  let controller = null;
  let searchApplication = null;

  /**
   * Factory API
   */
  const factory = {
    // Core methods
    render,
    destroy,

    // State management
    getController: () => controller,
    getSearchInterface: () => searchApplication,
    getElement: () => element,

    // Content management
    loadContent: () => controller?.loadContent(),
    refreshContent: () => controller?.loadContent(),
    getSelectedContent: () => controller?.getState().selectedContent,
    clearSelection: () => controller?.setState({ selectedContent: new Set() }),

    // View management
    changeView: (view) => controller?.changeView(view),
    changeSortBy: (sortBy) => controller?.changeSortBy(sortBy),

    // Upload management
    triggerUpload: () => element?.querySelector('#file-upload')?.click(),
    getUploadProgress: () => controller?.getState().uploadProgress
  };

  /**
   * Render the content manager application
   */
  function render(targetContainer = container) {
    if (!targetContainer) {
      console.error('ContentManagerApplication: No container provided');
      return factory;
    }

    // Create main element
    element = createElement();

    // Initialize controller
    controller = new ContentManagerController({
      apiBase,
      uploadEndpoint,
      meilisearchUrl,
      maxFileSize,
      allowedFileTypes,
      selectionMode,
      onContentLoad,
      onContentSelect,
      onContentUpload,
      onContentDelete,
      onAnalytics
    });

    controller.initialize(element);

    // Load CSS
    loadStyles();

    // Initialize enhanced search
    initializeSearchApplication();

    // Render to container
    if (typeof targetContainer === 'string') {
      targetContainer = document.querySelector(targetContainer);
    }

    if (targetContainer) {
      targetContainer.appendChild(element);
    }

    return factory;
  }

  /**
   * Create main element
   */
  function createElement() {
    const mainElement = document.createElement('div');
    mainElement.className = 'tmyl-content-manager-application';
    mainElement.setAttribute('role', 'application');
    mainElement.setAttribute('aria-label', title);

    mainElement.innerHTML = createContentManagerTemplate({
      title,
      description,
      showUpload,
      allowedFileTypes,
      currentView,
      sortBy,
      selectionMode
    });

    return mainElement;
  }

  /**
   * Load component styles
   */
  function loadStyles() {
    // CSS is now bundled with the main package, no need to dynamically load
    return;
  }

  /**
   * Initialize enhanced search application
   */
  async function initializeSearchApplication() {
    try {
      // Dynamic import to avoid circular dependencies
      const { EnhancedSearchApplicationFactory } = await import('../enhanced-search/enhanced-search-system.js');

      const searchContainer = element?.querySelector('.content-manager__search-section');
      if (!searchContainer) return;

      searchApplication = EnhancedSearchApplicationFactory({
        meilisearchUrl,
        apiBase,
        voiceEnabled: voiceSearch,
        naturalLanguage,
        smartFilters,
        title: '', // Don't show title in embedded mode
        description: '',
        placeholder: 'Search your content... Try "Find my presentation slides from last week"',
        onSearchResults: handleSearchResults,
        onContentSelection: handleContentSelection,
        onAnalytics,
        container: searchContainer
      });

      searchApplication.render();

      // Connect controller to search application
      if (controller) {
        controller.setSearchApplication(searchApplication);
      }

    } catch (error) {
      console.error('Failed to initialize search application:', error);
      // Fallback to basic content display
      displayBasicContent();
    }
  }

  /**
   * Handle search results from enhanced search
   */
  function handleSearchResults(results) {
    if (controller) {
      controller.setState({ content: results.items || [] });
      controller.updateContentDisplay();
      controller.updateContentStats();
    }

    if (onAnalytics) {
      onAnalytics({
        type: 'search_results',
        resultCount: results.items?.length || 0,
        query: results.query,
        timestamp: Date.now()
      });
    }
  }

  /**
   * Handle content selection from search interface
   */
  function handleContentSelection(data) {
    if (controller) {
      controller.handleContentSelection(data.contentId, data.selected);
    }
  }

  /**
   * Fallback content display
   */
  function displayBasicContent() {
    const searchSection = element?.querySelector('.content-manager__search-section');
    if (searchSection) {
      searchSection.innerHTML = `
        <div class="basic-search">
          <input type="search" placeholder="Basic search..." class="basic-search-input">
          <button class="basic-search-button">Search</button>
        </div>
      `;

      // Basic search functionality
      const searchInput = searchSection.querySelector('.basic-search-input');
      const searchButton = searchSection.querySelector('.basic-search-button');

      const performSearch = () => {
        const query = searchInput?.value?.trim();
        if (query && controller) {
          // Basic search implementation
          controller.loadContent();
        }
      };

      searchButton?.addEventListener('click', performSearch);
      searchInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
      });
    }
  }

  /**
   * Destroy the application
   */
  function destroy() {
    if (controller) {
      controller.destroy();
      controller = null;
    }

    if (searchApplication && searchApplication.destroy) {
      searchApplication.destroy();
      searchApplication = null;
    }

    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }

    element = null;
  }

  return factory;
}

/**
 * Utility function to create basic content manager
 */
export function createBasicContentManager(container, options = {}) {
  return ContentManagerApplicationFactory(options).render(container);
}

/**
 * Pre-configured content manager templates
 */
export const ContentManagerTemplates = {
  /**
   * Knowledge base content manager
   */
  knowledgeBase: (props = {}) => ContentManagerApplicationFactory({
    title: 'Knowledge Base',
    description: 'Manage your knowledge base content',
    allowedFileTypes: ['pdf', 'doc', 'docx', 'txt', 'md'],
    naturalLanguage: true,
    smartFilters: true,
    ...props
  }),

  /**
   * Media library content manager
   */
  mediaLibrary: (props = {}) => ContentManagerApplicationFactory({
    title: 'Media Library',
    description: 'Manage your media files',
    allowedFileTypes: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mp3', 'wav'],
    currentView: 'grid',
    ...props
  }),

  /**
   * Document archive content manager
   */
  documentArchive: (props = {}) => ContentManagerApplicationFactory({
    title: 'Document Archive',
    description: 'Manage archived documents',
    allowedFileTypes: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'],
    sortBy: 'date',
    ...props
  })
};

export default ContentManagerApplicationFactory;
