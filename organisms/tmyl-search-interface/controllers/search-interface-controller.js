/**
 * Search Interface Controller
 * Handles business logic, state management, and interactions
 */

/**
 * Search Interface Controller Class
 */
export class SearchInterfaceController {
  constructor(component) {
    this.component = component;
    this.searchDebounceTimer = null;
    this.isDestroyed = false;
  }

  /**
   * Handle search input with debouncing
   */
  handleSearchInput(event) {
    const query = event.detail.value;

    // Clear existing timer
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }

    // Debounce search
    this.searchDebounceTimer = setTimeout(() => {
      this.performSearch(query);
    }, this.component.searchDebounceMs || 300);
  }

  /**
   * Handle immediate search (e.g., on Enter key)
   */
  handleSearch(event) {
    const query = event.detail.value;

    // Clear debounce timer
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
      this.searchDebounceTimer = null;
    }

    this.performSearch(query);
  }

  /**
   * Perform the actual search
   */
  async performSearch(query) {
    if (this.isDestroyed) return;

    this.component.currentQuery = query;
    this.component.currentPage = 1;
    this.component.loading = true;

    try {
      // Dispatch search event for external handling
      this.component.dispatchEvent(new CustomEvent('tmyl-search-start', {
        detail: { query, filters: this.component.filters }
      }));

      // If searchAPI is provided, use it
      if (this.component.searchAPI) {
        const results = await this.component.searchAPI.search({
          query,
          filters: this.component.filters,
          page: this.component.currentPage,
          pageSize: this.component.pageSize,
          sortBy: this.component.sortBy,
          sortDirection: this.component.sortDirection
        });

        this.updateResults(results);
      }

      // Track analytics
      this.trackSearch(query);

    } catch (error) {
      console.error('Search error:', error);
      this.component.dispatchEvent(new CustomEvent('tmyl-search-error', {
        detail: { error, query }
      }));
    } finally {
      this.component.loading = false;
    }
  }

  /**
   * Update search results
   */
  updateResults(results) {
    this.component.results = results.items || results.data || [];
    this.component.totalResults = results.total || results.count || 0;

    this.component.dispatchEvent(new CustomEvent('tmyl-search-complete', {
      detail: {
        results: this.component.results,
        total: this.component.totalResults,
        query: this.component.currentQuery
      }
    }));
  }

  /**
   * Handle filter updates
   */
  updateFilter(filterKey, value) {
    const filters = { ...this.component.filters };

    if (value === '' || value === null || value === undefined) {
      delete filters[filterKey];
    } else {
      filters[filterKey] = value;
    }

    this.component.filters = filters;
    this.performSearch(this.component.currentQuery);
  }

  /**
   * Toggle filters visibility
   */
  toggleFilters() {
    this.component.showFilters = !this.component.showFilters;

    this.component.dispatchEvent(new CustomEvent('tmyl-filters-toggle', {
      detail: { visible: this.component.showFilters }
    }));
  }

  /**
   * Set view mode
   */
  setViewMode(mode) {
    this.component.viewMode = mode;

    this.component.dispatchEvent(new CustomEvent('tmyl-view-mode-change', {
      detail: { viewMode: mode }
    }));
  }

  /**
   * Update sort settings
   */
  updateSort(sortBy) {
    this.component.sortBy = sortBy;
    this.performSearch(this.component.currentQuery);
  }

  /**
   * Toggle sort direction
   */
  toggleSortDirection() {
    this.component.sortDirection = this.component.sortDirection === 'asc' ? 'desc' : 'asc';
    this.performSearch(this.component.currentQuery);
  }

  /**
   * Handle content selection
   */
  handleContentSelect(event) {
    const content = event.detail.content;
    const isSelected = event.detail.selected;

    let selectedItems = [...this.component.selectedItems];

    if (isSelected) {
      if (!selectedItems.find(item => item.id === content.id)) {
        selectedItems.push(content);
      }
    } else {
      selectedItems = selectedItems.filter(item => item.id !== content.id);
    }

    this.component.selectedItems = selectedItems;

    this.component.dispatchEvent(new CustomEvent('tmyl-selection-change', {
      detail: { selectedItems, content, isSelected }
    }));
  }

  /**
   * Handle content actions
   */
  handleContentAction(event) {
    const { action, content } = event.detail;

    this.component.dispatchEvent(new CustomEvent('tmyl-content-action', {
      detail: { action, content }
    }));
  }

  /**
   * Handle pagination
   */
  changePage(page) {
    if (page < 1 || page > Math.ceil(this.component.totalResults / this.component.pageSize)) {
      return;
    }

    this.component.currentPage = page;
    this.performSearch(this.component.currentQuery);
  }

  /**
   * Clear selection
   */
  clearSelection() {
    this.component.selectedItems = [];

    this.component.dispatchEvent(new CustomEvent('tmyl-selection-clear', {
      detail: {}
    }));
  }

  /**
   * Handle bulk actions
   */
  handleBulkAction(action) {
    const selectedItems = [...this.component.selectedItems];

    this.component.dispatchEvent(new CustomEvent('tmyl-bulk-action', {
      detail: { action, selectedItems }
    }));
  }

  /**
   * Handle suggestions request
   */
  async handleSuggestionsRequest(event) {
    const { query, callback } = event.detail;

    try {
      if (this.component.searchAPI && this.component.searchAPI.getSuggestions) {
        const suggestions = await this.component.searchAPI.getSuggestions(query);
        callback(suggestions);
      }
    } catch (error) {
      console.error('Suggestions error:', error);
      callback([]);
    }
  }

  /**
   * Get highlight terms for content cards
   */
  getHighlightTerms() {
    if (!this.component.currentQuery) return [];

    return this.component.currentQuery
      .split(/\s+/)
      .filter(term => term.length > 2)
      .map(term => term.toLowerCase());
  }

  /**
   * Track search analytics
   */
  trackSearch(query) {
    if (this.component.trackAnalytics && window.tamylaAnalytics) {
      window.tamylaAnalytics.track('search_performed', {
        query,
        filters: this.component.filters,
        resultCount: this.component.totalResults,
        timestamp: Date.now()
      });
    }
  }

  /**
   * Clean up resources
   */
  destroy() {
    this.isDestroyed = true;

    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
      this.searchDebounceTimer = null;
    }
  }
}

/**
 * Search Interface Utilities
 */
export const searchInterfaceUtils = {
  /**
   * Validate search interface props
   */
  validateProps(props) {
    const errors = [];

    if (props.pageSize && (typeof props.pageSize !== 'number' || props.pageSize < 1)) {
      errors.push('pageSize must be a positive number');
    }

    if (props.searchDebounceMs && (typeof props.searchDebounceMs !== 'number' || props.searchDebounceMs < 0)) {
      errors.push('searchDebounceMs must be a non-negative number');
    }

    if (props.viewMode && !['grid', 'list'].includes(props.viewMode)) {
      errors.push('viewMode must be either "grid" or "list"');
    }

    return errors;
  },

  /**
   * Format result count for display
   */
  formatResultCount(total, current, pageSize) {
    if (total === 0) return '0 results';

    const start = ((current - 1) * pageSize) + 1;
    const end = Math.min(current * pageSize, total);

    return `${start}-${end} of ${total} results`;
  },

  /**
   * Calculate total pages
   */
  calculateTotalPages(totalResults, pageSize) {
    return Math.ceil(totalResults / pageSize);
  },

  /**
   * Build search params object
   */
  buildSearchParams(component) {
    return {
      query: component.currentQuery,
      filters: component.filters,
      page: component.currentPage,
      pageSize: component.pageSize,
      sortBy: component.sortBy,
      sortDirection: component.sortDirection
    };
  }
};
