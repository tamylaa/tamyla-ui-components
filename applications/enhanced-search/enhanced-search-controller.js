/**
 * Enhanced Search Application - Controller System
 * Comprehensive behavior management following atomic design principles
 */

import { EnhancedSearchTemplates } from './enhanced-search-template.js';
import { OrganismFactory } from '../../organisms/organism-factory.js';

/**
 * Enhanced Search Application Controller
 * Manages all application-level interactions and business logic
 */
export class EnhancedSearchController {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      // API Configuration
      meilisearchUrl: '/api/search',
      apiBase: '/api/content',

      // Feature Configuration
      voiceEnabled: true,
      naturalLanguage: true,
      smartFilters: true,
      recentSearches: true,
      searchSuggestions: true,

      // UI Configuration
      placeholder: 'Search content... Try "Find PDFs about coffee from last month"',
      layout: 'vertical',
      viewMode: 'grid',
      perPage: 20,

      // Business Logic
      enableAnalytics: true,
      enableAutoComplete: true,
      enableExport: false,

      ...options
    };

    // State management
    this.state = {
      query: '',
      results: [],
      filters: {},
      sorting: 'relevance',
      viewMode: this.options.viewMode,
      currentPage: 1,
      totalPages: 0,
      totalResults: 0,
      isLoading: false,
      error: null,
      searchTime: 0,
      recentSearches: this.loadRecentSearches(),
      selectedItems: new Set(),
      analytics: {
        searchCount: 0,
        totalSearchTime: 0,
        popularTerms: new Map()
      }
    };

    // Component instances
    this.searchInterface = null;
    this.searchAPI = null;

    // Event handlers (bound to maintain context)
    this.boundHandlers = {
      handleSearch: this.handleSearch.bind(this),
      handleViewModeChange: this.handleViewModeChange.bind(this),
      handleSortChange: this.handleSortChange.bind(this),
      handlePageChange: this.handlePageChange.bind(this),
      handleFilterChange: this.handleFilterChange.bind(this),
      handleContentSelection: this.handleContentSelection.bind(this),
      handleBulkAction: this.handleBulkAction.bind(this),
      handleRecentSearchClick: this.handleRecentSearchClick.bind(this),
      handleKeyboardNavigation: this.handleKeyboardNavigation.bind(this),
      handleExport: this.handleExport.bind(this)
    };

    this.initialize();
  }

  /**
   * Initialize the controller
   */
  async initialize() {
    try {
      await this.initializeSearchAPI();
      this.setupEventListeners();
      this.setupKeyboardNavigation();
      this.setupOrganismComponents();

      // Load initial state
      await this.loadInitialData();

      this.emit('initialized', { controller: this });
    } catch (error) {
      console.error('Enhanced Search Controller initialization failed:', error);
      this.handleError(error);
    }
  }

  /**
   * Initialize search API
   */
  async initializeSearchAPI() {
    this.searchAPI = {
      search: async (query, options = {}) => {
        const searchParams = new URLSearchParams({
          q: query,
          page: options.page || 1,
          limit: options.limit || this.options.perPage,
          sort: options.sort || this.state.sorting,
          ...options.filters
        });

        const response = await fetch(`${this.options.meilisearchUrl}?${searchParams}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.getAuthToken()}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Search failed: ${response.statusText}`);
        }

        return response.json();
      },

      advancedSearch: async (searchRequest) => {
        const response = await fetch(`${this.options.meilisearchUrl}/advanced`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.getAuthToken()}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(searchRequest)
        });

        if (!response.ok) {
          throw new Error(`Advanced search failed: ${response.statusText}`);
        }

        return response.json();
      },

      getSuggestions: async (query) => {
        const response = await fetch(`${this.options.meilisearchUrl}/suggestions?q=${encodeURIComponent(query)}`, {
          headers: {
            'Authorization': `Bearer ${this.getAuthToken()}`
          }
        });

        if (!response.ok) return [];

        const data = await response.json();
        return data.suggestions || [];
      }
    };
  }

  /**
   * Setup organism components
   */
  setupOrganismComponents() {
    // Create search interface organism
    const searchContainer = this.element.querySelector('[data-search-container]');
    if (searchContainer) {
      this.searchInterface = OrganismFactory.createSearchInterface({
        placeholder: this.options.placeholder,
        enableVoice: this.options.voiceEnabled,
        enableSuggestions: this.options.searchSuggestions,
        onSearch: this.boundHandlers.handleSearch,
        onSuggestionRequest: this.handleSuggestionRequest.bind(this),
        container: searchContainer
      });
    }

    // Create content grid/list organisms
    const resultsContainer = this.element.querySelector('[data-results-container]');
    if (resultsContainer) {
      this.setupResultsDisplay(resultsContainer);
    }

    // Create filters organism
    const filtersContainer = this.element.querySelector('[data-filters-container]');
    if (filtersContainer) {
      this.setupFiltersDisplay(filtersContainer);
    }
  }

  /**
   * Setup results display
   */
  setupResultsDisplay(container) {
    // This will be populated when results are loaded
    this.resultsContainer = container;
    this.updateResultsDisplay();
  }

  /**
   * Setup filters display
   */
  setupFiltersDisplay(container) {
    // Create filter components based on available data
    this.filtersContainer = container;
    // Filters will be populated dynamically based on search results
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // View mode controls
    this.element.querySelectorAll('[data-view-mode]').forEach(button => {
      button.addEventListener('click', this.boundHandlers.handleViewModeChange);
    });

    // Sort controls
    const sortSelect = this.element.querySelector('.tmyl-enhanced-search__sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', this.boundHandlers.handleSortChange);
    }

    // Pagination controls
    this.element.addEventListener('click', (event) => {
      if (event.target.matches('[data-page]')) {
        this.boundHandlers.handlePageChange(event);
      }
    });

    // Recent searches
    this.element.addEventListener('click', (event) => {
      if (event.target.matches('.tmyl-enhanced-search__recent-search')) {
        this.boundHandlers.handleRecentSearchClick(event);
      }
    });

    // Export controls
    this.element.addEventListener('click', (event) => {
      if (event.target.matches('[data-export-type]')) {
        this.boundHandlers.handleExport(event);
      }
    });

    // Error retry
    this.element.addEventListener('click', (event) => {
      if (event.target.matches('.tmyl-enhanced-search__error-retry')) {
        this.retryLastSearch();
      }
    });

    // Page size change
    const pageSizeSelect = this.element.querySelector('.tmyl-enhanced-search__pagination-size-select');
    if (pageSizeSelect) {
      pageSizeSelect.addEventListener('change', (event) => {
        this.options.perPage = parseInt(event.target.value);
        this.state.currentPage = 1;
        this.performSearch(this.state.query);
      });
    }
  }

  /**
   * Setup keyboard navigation
   */
  setupKeyboardNavigation() {
    this.element.addEventListener('keydown', this.boundHandlers.handleKeyboardNavigation);
  }

  /**
   * Handle keyboard navigation
   */
  handleKeyboardNavigation(event) {
    // Handle global keyboard shortcuts
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
      case 'f':
        event.preventDefault();
        this.focusSearchInput();
        break;
      case 'k':
        event.preventDefault();
        this.focusSearchInput();
        break;
      case 'a':
        if (event.shiftKey) {
          event.preventDefault();
          this.selectAllResults();
        }
        break;
      case 'e':
        if (this.options.enableExport) {
          event.preventDefault();
          this.handleExport({ target: { dataset: { exportType: 'csv' } } });
        }
        break;
      }
    }

    // Handle arrow key navigation for results
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      this.handleResultNavigation(event);
    }
  }

  /**
   * Handle result navigation with keyboard
   */
  handleResultNavigation(event) {
    const results = this.element.querySelectorAll('[data-content-item]');
    const focusedElement = document.activeElement;
    const currentIndex = Array.from(results).indexOf(focusedElement);

    if (currentIndex === -1) return;

    let newIndex = currentIndex;
    const isGridView = this.state.viewMode === 'grid';
    const itemsPerRow = isGridView ? this.calculateItemsPerRow() : 1;

    switch (event.key) {
    case 'ArrowUp':
      newIndex = isGridView ? currentIndex - itemsPerRow : currentIndex - 1;
      break;
    case 'ArrowDown':
      newIndex = isGridView ? currentIndex + itemsPerRow : currentIndex + 1;
      break;
    case 'ArrowLeft':
      if (isGridView) newIndex = currentIndex - 1;
      break;
    case 'ArrowRight':
      if (isGridView) newIndex = currentIndex + 1;
      break;
    }

    if (newIndex >= 0 && newIndex < results.length) {
      event.preventDefault();
      results[newIndex].focus();
    }
  }

  /**
   * Calculate items per row for grid navigation
   */
  calculateItemsPerRow() {
    const gridContainer = this.element.querySelector('.tmyl-enhanced-search__results-grid');
    if (!gridContainer) return 3;

    const containerWidth = gridContainer.offsetWidth;
    const itemWidth = 350; // Approximate item width
    const gap = 24; // Gap between items

    return Math.floor((containerWidth + gap) / (itemWidth + gap));
  }

  /**
   * Handle search execution
   */
  async handleSearch(searchData) {
    const { query, filters = {}, engine = 'auto' } = searchData;

    this.state.query = query;
    this.state.filters = { ...this.state.filters, ...filters };
    this.state.currentPage = 1;

    await this.performSearch(query);
  }

  /**
   * Perform search operation
   */
  async performSearch(query) {
    if (!query.trim()) {
      this.clearResults();
      return;
    }

    this.setLoadingState(true);
    const startTime = performance.now();

    try {
      const searchOptions = {
        page: this.state.currentPage,
        limit: this.options.perPage,
        sort: this.state.sorting,
        filters: this.state.filters
      };

      let results;

      // Determine search method based on query complexity
      if (this.isAdvancedQuery(query)) {
        results = await this.searchAPI.advancedSearch({
          query,
          ...searchOptions
        });
      } else {
        results = await this.searchAPI.search(query, searchOptions);
      }

      const searchTime = performance.now() - startTime;
      this.state.searchTime = Math.round(searchTime);

      this.updateSearchResults(results);
      this.updateAnalytics(query, searchTime, results.hits?.length || 0);
      this.saveRecentSearch(query);

    } catch (error) {
      console.error('Search failed:', error);
      this.handleError(error);
    } finally {
      this.setLoadingState(false);
    }
  }

  /**
   * Check if query requires advanced search
   */
  isAdvancedQuery(query) {
    // Check for natural language patterns
    const patterns = [
      /\b(find|show|get|search)\b.*\b(from|in|during|before|after)\b/i,
      /\b(last|past|recent)\s+(week|month|year|day)\b/i,
      /\b(type|format|extension):\w+\b/i,
      /\b(by|from|author):\w+\b/i
    ];

    return patterns.some(pattern => pattern.test(query));
  }

  /**
   * Update search results display
   */
  updateSearchResults(results) {
    this.state.results = results.hits || results.results || [];
    this.state.totalResults = results.estimatedTotalHits || results.total || 0;
    this.state.totalPages = Math.ceil(this.state.totalResults / this.options.perPage);

    this.updateResultsDisplay();
    this.updatePagination();
    this.updateFiltersFromResults(results);
  }

  /**
   * Update results display
   */
  updateResultsDisplay() {
    if (!this.resultsContainer) return;

    if (this.state.results.length === 0) {
      this.resultsContainer.innerHTML = EnhancedSearchTemplates.emptyState({
        title: this.state.query ? 'No results found' : 'Start searching',
        message: this.state.query ?
          'Try adjusting your search terms or filters' :
          'Enter a search query to find content'
      });
      return;
    }

    // Create results container with current view mode
    this.resultsContainer.innerHTML = EnhancedSearchTemplates.resultsContainer({
      viewMode: this.state.viewMode,
      results: this.state.results,
      total: this.state.totalResults,
      searchTime: this.state.searchTime
    });

    // Mount organism components for results
    this.mountResultsOrganisms();
  }

  /**
   * Mount organism components for results
   */
  mountResultsOrganisms() {
    const resultsElement = this.element.querySelector(`[data-view-mode="${this.state.viewMode}"]`);
    if (!resultsElement) return;

    // Create content cards for each result
    if (this.state.viewMode === 'grid') {
      this.createContentCardGrid(resultsElement);
    } else {
      this.createContentCardList(resultsElement);
    }
  }

  /**
   * Create content card grid
   */
  createContentCardGrid(container) {
    this.contentGrid = OrganismFactory.createContentCardGrid({
      items: this.state.results,
      selectable: true,
      viewMode: 'grid',
      onItemSelect: this.boundHandlers.handleContentSelection,
      onItemAction: this.handleContentAction.bind(this),
      container
    });
  }

  /**
   * Create content card list
   */
  createContentCardList(container) {
    this.contentList = OrganismFactory.createContentCardGrid({
      items: this.state.results,
      selectable: true,
      viewMode: 'list',
      onItemSelect: this.boundHandlers.handleContentSelection,
      onItemAction: this.handleContentAction.bind(this),
      container
    });
  }

  /**
   * Handle view mode change
   */
  handleViewModeChange(event) {
    const newViewMode = event.target.dataset.viewMode;
    if (!newViewMode || newViewMode === this.state.viewMode) return;

    // Update UI state
    this.element.querySelectorAll('[data-view-mode]').forEach(btn => {
      btn.classList.toggle('tmyl-enhanced-search__view-toggle--active',
        btn.dataset.viewMode === newViewMode);
    });

    this.state.viewMode = newViewMode;
    this.updateResultsDisplay();

    this.emit('viewModeChanged', { viewMode: newViewMode });
  }

  /**
   * Handle sort change
   */
  handleSortChange(event) {
    this.state.sorting = event.target.value;
    this.state.currentPage = 1;
    this.performSearch(this.state.query);

    this.emit('sortChanged', { sorting: this.state.sorting });
  }

  /**
   * Handle page change
   */
  handlePageChange(event) {
    const newPage = parseInt(event.target.dataset.page);
    if (!newPage || newPage === this.state.currentPage) return;

    this.state.currentPage = newPage;
    this.performSearch(this.state.query);

    this.emit('pageChanged', { page: newPage });
  }

  /**
   * Handle filter change
   */
  handleFilterChange(filterData) {
    this.state.filters = { ...this.state.filters, ...filterData };
    this.state.currentPage = 1;
    this.performSearch(this.state.query);

    this.emit('filtersChanged', { filters: this.state.filters });
  }

  /**
   * Handle content selection
   */
  handleContentSelection(selectionData) {
    const { item, selected, selectedItems } = selectionData;

    this.state.selectedItems = selectedItems;

    this.updateBulkActionControls();
    this.emit('contentSelected', { item, selected, totalSelected: selectedItems.size });
  }

  /**
   * Handle content action
   */
  handleContentAction(actionData) {
    const { action, item } = actionData;

    switch (action) {
    case 'view':
      this.viewContent(item);
      break;
    case 'download':
      this.downloadContent(item);
      break;
    case 'share':
      this.shareContent(item);
      break;
    case 'edit':
      this.editContent(item);
      break;
    default:
      console.warn('Unknown content action:', action);
    }

    this.emit('contentAction', actionData);
  }

  /**
   * Handle bulk action
   */
  handleBulkAction(event) {
    const action = event.target.dataset.bulkAction;
    const selectedItems = Array.from(this.state.selectedItems);

    if (selectedItems.length === 0) {
      this.showMessage('No items selected', 'warning');
      return;
    }

    switch (action) {
    case 'download':
      this.downloadMultipleItems(selectedItems);
      break;
    case 'share':
      this.shareMultipleItems(selectedItems);
      break;
    case 'delete':
      this.deleteMultipleItems(selectedItems);
      break;
    default:
      console.warn('Unknown bulk action:', action);
    }

    this.emit('bulkAction', { action, items: selectedItems });
  }

  /**
   * Handle recent search click
   */
  handleRecentSearchClick(event) {
    const query = event.target.dataset.searchQuery;
    if (!query) return;

    // Update search interface
    if (this.searchInterface && this.searchInterface.setQuery) {
      this.searchInterface.setQuery(query);
    }

    this.performSearch(query);
  }

  /**
   * Handle suggestion request
   */
  async handleSuggestionRequest(query) {
    if (!this.options.searchSuggestions || query.length < 2) return [];

    try {
      const suggestions = await this.searchAPI.getSuggestions(query);
      return suggestions;
    } catch (error) {
      console.error('Failed to get suggestions:', error);
      return [];
    }
  }

  /**
   * Handle export
   */
  async handleExport(event) {
    const exportType = event.target.dataset.exportType;
    const selectedItems = Array.from(this.state.selectedItems);
    const itemsToExport = selectedItems.length > 0 ? selectedItems : this.state.results;

    if (itemsToExport.length === 0) {
      this.showMessage('No items to export', 'warning');
      return;
    }

    try {
      this.setLoadingState(true, 'Preparing export...');

      switch (exportType) {
      case 'csv':
        await this.exportAsCSV(itemsToExport);
        break;
      case 'json':
        await this.exportAsJSON(itemsToExport);
        break;
      default:
        throw new Error(`Unknown export type: ${exportType}`);
      }

      this.showMessage(`Exported ${itemsToExport.length} items as ${exportType.toUpperCase()}`, 'success');
    } catch (error) {
      console.error('Export failed:', error);
      this.showMessage('Export failed', 'error');
    } finally {
      this.setLoadingState(false);
    }
  }

  /**
   * Export as CSV
   */
  async exportAsCSV(items) {
    const headers = ['Title', 'Summary', 'Type', 'Upload Date', 'File Size'];
    const rows = items.map(item => [
      item.title || 'Untitled',
      item.summary || '',
      item.mimeType || '',
      item.uploadedAt || '',
      item.fileSize || ''
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field.toString().replace(/"/g, '""')}"`).join(','))
      .join('\n');

    this.downloadFile(csvContent, 'search-results.csv', 'text/csv');
  }

  /**
   * Export as JSON
   */
  async exportAsJSON(items) {
    const jsonContent = JSON.stringify({
      query: this.state.query,
      filters: this.state.filters,
      totalResults: this.state.totalResults,
      exportedAt: new Date().toISOString(),
      results: items
    }, null, 2);

    this.downloadFile(jsonContent, 'search-results.json', 'application/json');
  }

  /**
   * Download file helper
   */
  downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  /**
   * Update pagination display
   */
  updatePagination() {
    const paginationContainer = this.element.querySelector('.tmyl-enhanced-search__pagination');
    if (!paginationContainer) return;

    if (this.state.totalPages <= 1) {
      paginationContainer.style.display = 'none';
      return;
    }

    paginationContainer.style.display = '';
    paginationContainer.innerHTML = EnhancedSearchTemplates.pagination({
      currentPage: this.state.currentPage,
      totalPages: this.state.totalPages,
      perPage: this.options.perPage,
      total: this.state.totalResults
    });
  }

  /**
   * Update filters from search results
   */
  updateFiltersFromResults(results) {
    if (!this.filtersContainer || !results.facets) return;

    // Create dynamic filters based on facets
    const filterElements = Object.entries(results.facets).map(([key, values]) => {
      return this.createFilterGroup(key, values);
    }).join('');

    this.filtersContainer.innerHTML = filterElements;
    this.setupFilterEventListeners();
  }

  /**
   * Create filter group
   */
  createFilterGroup(key, values) {
    const options = Object.entries(values).map(([value, count]) =>
      `<label class="tmyl-enhanced-search__filter-option">
         <input type="checkbox" value="${value}" data-filter-key="${key}">
         <span>${value} (${count})</span>
       </label>`
    ).join('');

    return `
      <div class="tmyl-enhanced-search__filter-group">
        <h4 class="tmyl-enhanced-search__filter-title">${this.formatFilterKey(key)}</h4>
        <div class="tmyl-enhanced-search__filter-options">
          ${options}
        </div>
      </div>
    `;
  }

  /**
   * Format filter key for display
   */
  formatFilterKey(key) {
    return key.replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace(/_/g, ' ');
  }

  /**
   * Setup filter event listeners
   */
  setupFilterEventListeners() {
    this.filtersContainer.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      checkbox.addEventListener('change', (event) => {
        const key = event.target.dataset.filterKey;
        const value = event.target.value;
        const checked = event.target.checked;

        if (!this.state.filters[key]) {
          this.state.filters[key] = [];
        }

        if (checked) {
          this.state.filters[key].push(value);
        } else {
          this.state.filters[key] = this.state.filters[key].filter(v => v !== value);
          if (this.state.filters[key].length === 0) {
            delete this.state.filters[key];
          }
        }

        this.handleFilterChange({});
      });
    });
  }

  /**
   * Update bulk action controls
   */
  updateBulkActionControls() {
    const bulkControls = this.element.querySelector('.tmyl-enhanced-search__bulk-controls');
    if (!bulkControls) return;

    const selectedCount = this.state.selectedItems.size;

    if (selectedCount === 0) {
      bulkControls.style.display = 'none';
    } else {
      bulkControls.style.display = 'flex';
      const countElement = bulkControls.querySelector('.tmyl-enhanced-search__selected-count');
      if (countElement) {
        countElement.textContent = `${selectedCount} selected`;
      }
    }
  }

  /**
   * Update analytics
   */
  updateAnalytics(query, searchTime, resultCount) {
    if (!this.options.enableAnalytics) return;

    this.state.analytics.searchCount++;
    this.state.analytics.totalSearchTime += searchTime;

    // Track popular terms
    const terms = query.toLowerCase().split(/\s+/);
    terms.forEach(term => {
      if (term.length > 2) {
        const count = this.state.analytics.popularTerms.get(term) || 0;
        this.state.analytics.popularTerms.set(term, count + 1);
      }
    });

    // Send analytics to backend if configured
    if (this.options.analyticsEndpoint) {
      this.sendAnalytics({
        query,
        searchTime,
        resultCount,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Send analytics data
   */
  async sendAnalytics(data) {
    try {
      await fetch(this.options.analyticsEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify(data)
      });
    } catch (error) {
      console.error('Failed to send analytics:', error);
    }
  }

  /**
   * Save recent search
   */
  saveRecentSearch(query) {
    const search = {
      query,
      timestamp: new Date().toISOString()
    };

    // Remove duplicate
    this.state.recentSearches = this.state.recentSearches.filter(s => s.query !== query);

    // Add to beginning
    this.state.recentSearches.unshift(search);

    // Limit to 10 recent searches
    this.state.recentSearches = this.state.recentSearches.slice(0, 10);

    // Save to localStorage
    try {
      localStorage.setItem('tmyl-recent-searches', JSON.stringify(this.state.recentSearches));
    } catch (error) {
      console.warn('Failed to save recent searches:', error);
    }

    // Update UI
    this.updateRecentSearchesDisplay();
  }

  /**
   * Load recent searches
   */
  loadRecentSearches() {
    try {
      const saved = localStorage.getItem('tmyl-recent-searches');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.warn('Failed to load recent searches:', error);
      return [];
    }
  }

  /**
   * Update recent searches display
   */
  updateRecentSearchesDisplay() {
    const container = this.element.querySelector('.tmyl-enhanced-search__recent-searches');
    if (!container) return;

    container.innerHTML = EnhancedSearchTemplates.recentSearchesSection({
      searches: this.state.recentSearches
    });
  }

  /**
   * Load initial data
   */
  async loadInitialData() {
    // Load any initial search or filters from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const initialQuery = urlParams.get('q');

    if (initialQuery) {
      if (this.searchInterface && this.searchInterface.setQuery) {
        this.searchInterface.setQuery(initialQuery);
      }
      await this.performSearch(initialQuery);
    }
  }

  /**
   * Utility methods
   */

  setLoadingState(loading, message = 'Searching...') {
    this.state.isLoading = loading;

    if (loading) {
      this.resultsContainer.innerHTML = EnhancedSearchTemplates.loadingState({ message });
    }
  }

  clearResults() {
    this.state.results = [];
    this.state.totalResults = 0;
    this.state.totalPages = 0;
    this.state.currentPage = 1;
    this.updateResultsDisplay();
    this.updatePagination();
  }

  handleError(error) {
    this.state.error = error;

    if (this.resultsContainer) {
      this.resultsContainer.innerHTML = EnhancedSearchTemplates.errorState({
        title: 'Search Error',
        message: error.message || 'Something went wrong while searching',
        showRetry: true
      });
    }

    this.emit('error', { error });
  }

  retryLastSearch() {
    if (this.state.query) {
      this.performSearch(this.state.query);
    }
  }

  focusSearchInput() {
    if (this.searchInterface && this.searchInterface.focus) {
      this.searchInterface.focus();
    }
  }

  selectAllResults() {
    if (this.contentGrid && this.contentGrid.selectAll) {
      this.contentGrid.selectAll();
    } else if (this.contentList && this.contentList.selectAll) {
      this.contentList.selectAll();
    }
  }

  getAuthToken() {
    // Get auth token from your auth system
    return localStorage.getItem('auth_token') || '';
  }

  showMessage(message, type = 'info') {
    // Show notification message
    this.emit('message', { message, type });
  }

  /**
   * Content action methods
   */

  viewContent(item) {
    window.open(`/content/${item.id}`, '_blank');
  }

  downloadContent(item) {
    window.open(`/api/content/${item.id}/download`, '_blank');
  }

  shareContent(item) {
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: item.summary,
        url: `/content/${item.id}`
      });
    } else {
      // Fallback to copy URL
      navigator.clipboard.writeText(`${window.location.origin}/content/${item.id}`);
      this.showMessage('Link copied to clipboard', 'success');
    }
  }

  editContent(item) {
    window.open(`/content/${item.id}/edit`, '_blank');
  }

  downloadMultipleItems(items) {
    // Create download links for multiple items
    items.forEach(item => {
      setTimeout(() => this.downloadContent(item), 100);
    });
  }

  shareMultipleItems(items) {
    const urls = items.map(item => `${window.location.origin}/content/${item.id}`);
    const text = `Multiple files:\n${urls.join('\n')}`;

    if (navigator.share) {
      navigator.share({
        title: `${items.length} files`,
        text
      });
    } else {
      navigator.clipboard.writeText(text);
      this.showMessage('Links copied to clipboard', 'success');
    }
  }

  async deleteMultipleItems(items) {
    if (!confirm(`Delete ${items.length} items? This action cannot be undone.`)) {
      return;
    }

    try {
      const deletePromises = items.map(item =>
        fetch(`/api/content/${item.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${this.getAuthToken()}` }
        })
      );

      await Promise.all(deletePromises);

      // Refresh search results
      this.performSearch(this.state.query);
      this.showMessage(`Deleted ${items.length} items`, 'success');

    } catch (error) {
      console.error('Delete failed:', error);
      this.showMessage('Delete failed', 'error');
    }
  }

  /**
   * Event system
   */

  emit(eventName, data) {
    const event = new CustomEvent(`tmyl-enhanced-search:${eventName}`, {
      detail: data,
      bubbles: true
    });
    this.element.dispatchEvent(event);
  }

  on(eventName, handler) {
    this.element.addEventListener(`tmyl-enhanced-search:${eventName}`, handler);
  }

  off(eventName, handler) {
    this.element.removeEventListener(`tmyl-enhanced-search:${eventName}`, handler);
  }

  /**
   * Public API methods
   */

  search(query, options = {}) {
    return this.handleSearch({ query, ...options });
  }

  setFilters(filters) {
    this.state.filters = filters;
    this.performSearch(this.state.query);
  }

  getState() {
    return { ...this.state };
  }

  getResults() {
    return [...this.state.results];
  }

  getSelectedItems() {
    return Array.from(this.state.selectedItems);
  }

  clearSelection() {
    this.state.selectedItems.clear();
    this.updateBulkActionControls();
  }

  /**
   * Cleanup
   */
  destroy() {
    // Clean up event listeners
    Object.values(this.boundHandlers).forEach(handler => {
      this.element.removeEventListener('click', handler);
      this.element.removeEventListener('change', handler);
      this.element.removeEventListener('keydown', handler);
    });

    // Clean up organism components
    if (this.searchInterface && this.searchInterface.destroy) {
      this.searchInterface.destroy();
    }
    if (this.contentGrid && this.contentGrid.destroy) {
      this.contentGrid.destroy();
    }
    if (this.contentList && this.contentList.destroy) {
      this.contentList.destroy();
    }

    // Clear state
    this.state = null;
    this.options = null;
    this.element = null;
  }
}

/**
 * Enhanced Search Controller Utilities
 */
export const EnhancedSearchControllerUtils = {
  /**
   * Create controller with error handling
   */
  createController(element, options = {}) {
    try {
      return new EnhancedSearchController(element, options);
    } catch (error) {
      console.error('Failed to create Enhanced Search Controller:', error);
      throw error;
    }
  },

  /**
   * Validate controller options
   */
  validateOptions(options) {
    const errors = [];

    if (options.meilisearchUrl && typeof options.meilisearchUrl !== 'string') {
      errors.push('meilisearchUrl must be a string');
    }

    if (options.perPage && (!Number.isInteger(options.perPage) || options.perPage < 1)) {
      errors.push('perPage must be a positive integer');
    }

    return errors;
  },

  /**
   * Get default options
   */
  getDefaultOptions() {
    return {
      meilisearchUrl: '/api/search',
      apiBase: '/api/content',
      voiceEnabled: true,
      naturalLanguage: true,
      smartFilters: true,
      recentSearches: true,
      searchSuggestions: true,
      placeholder: 'Search content...',
      layout: 'vertical',
      viewMode: 'grid',
      perPage: 20,
      enableAnalytics: true,
      enableAutoComplete: true,
      enableExport: false
    };
  }
};

export default EnhancedSearchController;
