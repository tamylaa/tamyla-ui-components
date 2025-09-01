/**
 * TmylSearchInterface - Refactored Modular Component
 * Complete search interface with separated concerns
 * Usage: <tmyl-search-interface></tmyl-search-interface>
 */

import { LitElement, html } from 'lit';
import { SearchInterfaceController, searchInterfaceUtils } from './controllers/search-interface-controller.js';
import {
  renderSearchHeader,
  renderFilters,
  renderResultsSection,
  renderResultsHeader,
  renderResults,
  renderEmptyState,
  renderLoadingCards,
  renderPagination,
  renderBulkActions
} from './templates/search-interface-templates.js';
import {
  defaultSearchInterfaceProps,
  searchInterfaceConfig,
  searchInterfaceValidation
} from './config/search-interface-config.js';

// Import external CSS
// CSS is now bundled with the main package, no need to dynamically load
// const cssLink = new URL('./styles/tmyl-search-interface.css', import.meta.url).href;
// const styleSheet = new CSSStyleSheet();
// fetch(cssLink).then(response => response.text()).then(css => {
//   styleSheet.replaceSync(css);
// });

export class TmylSearchInterface extends LitElement {
  static properties = {
    loading: { type: Boolean },
    results: { type: Array },
    totalResults: { type: Number, attribute: 'total-results' },
    currentPage: { type: Number, attribute: 'current-page' },
    pageSize: { type: Number, attribute: 'page-size' },
    currentQuery: { type: String, attribute: 'current-query' },
    filters: { type: Object },
    selectedItems: { type: Array, attribute: 'selected-items' },
    viewMode: { type: String, attribute: 'view-mode' },
    sortBy: { type: String, attribute: 'sort-by' },
    sortDirection: { type: String, attribute: 'sort-direction' },
    enableVoiceSearch: { type: Boolean, attribute: 'enable-voice-search' },
    enableSelection: { type: Boolean, attribute: 'enable-selection' },
    showFilters: { type: Boolean, attribute: 'show-filters' },
    searchDebounceMs: { type: Number, attribute: 'search-debounce-ms' },
    trackAnalytics: { type: Boolean, attribute: 'track-analytics' },
    searchAPI: { type: Object }
  };

  static styles = [styleSheet];

  constructor() {
    super();

    // Initialize with defaults
    Object.assign(this, defaultSearchInterfaceProps);

    // Initialize controller
    this.controller = new SearchInterfaceController(this);

    // Validate initial props
    this.validateProps();
  }

  /**
   * Validate component properties
   */
  validateProps() {
    const errors = searchInterfaceValidation.validateProps(this);
    if (errors.length > 0) {
      console.warn('TmylSearchInterface validation errors:', errors);
    }
  }

  /**
   * Main render method - now clean and focused
   */
  render() {
    return html`
      <div class="search-interface">
        ${this._renderSearchHeader()}
        ${this.showFilters ? this._renderFilters() : ''}
        ${this._renderResultsSection()}
        ${this._renderBulkActions()}
      </div>
    `;
  }

  /**
   * Render search header using separated template
   */
  _renderSearchHeader() {
    return renderSearchHeader({
      currentQuery: this.currentQuery,
      enableVoiceSearch: this.enableVoiceSearch,
      loading: this.loading,
      showFilters: this.showFilters,
      onSearch: this._handleSearch.bind(this),
      onSearchInput: this._handleSearchInput.bind(this),
      onSuggestionsRequest: this._handleSuggestionsRequest.bind(this),
      onToggleFilters: this._toggleFilters.bind(this)
    });
  }

  /**
   * Render filters using separated template
   */
  _renderFilters() {
    return renderFilters({
      showFilters: this.showFilters,
      onUpdateFilter: this._updateFilter.bind(this)
    });
  }

  /**
   * Render results section using separated template
   */
  _renderResultsSection() {
    return renderResultsSection({
      loading: this.loading,
      results: this.results,
      onRenderResultsHeader: this._renderResultsHeader.bind(this),
      onRenderResults: this._renderResults.bind(this),
      onRenderPagination: this._renderPagination.bind(this)
    });
  }

  /**
   * Render results header using separated template
   */
  _renderResultsHeader() {
    return renderResultsHeader({
      results: this.results,
      loading: this.loading,
      currentPage: this.currentPage,
      pageSize: this.pageSize,
      totalResults: this.totalResults,
      currentQuery: this.currentQuery,
      selectedItems: this.selectedItems,
      viewMode: this.viewMode,
      sortBy: this.sortBy,
      sortDirection: this.sortDirection,
      onSetViewMode: this._setViewMode.bind(this),
      onUpdateSort: this._updateSort.bind(this),
      onToggleSortDirection: this._toggleSortDirection.bind(this)
    });
  }

  /**
   * Render results using separated template
   */
  _renderResults() {
    return renderResults({
      loading: this.loading,
      results: this.results,
      viewMode: this.viewMode,
      enableSelection: this.enableSelection,
      selectedItems: this.selectedItems,
      highlightTerms: this._getHighlightTerms(),
      onContentSelect: this._handleContentSelect.bind(this),
      onContentAction: this._handleContentAction.bind(this),
      onRenderLoadingCards: this._renderLoadingCards.bind(this),
      onRenderEmptyState: this._renderEmptyState.bind(this)
    });
  }

  /**
   * Render empty state using separated template
   */
  _renderEmptyState() {
    return renderEmptyState({
      currentQuery: this.currentQuery
    });
  }

  /**
   * Render loading cards using separated template
   */
  _renderLoadingCards() {
    return renderLoadingCards();
  }

  /**
   * Render pagination using separated template
   */
  _renderPagination() {
    return renderPagination({
      currentPage: this.currentPage,
      totalResults: this.totalResults,
      pageSize: this.pageSize,
      onPageChange: this._changePage.bind(this)
    });
  }

  /**
   * Render bulk actions using separated template
   */
  _renderBulkActions() {
    return renderBulkActions({
      selectedItems: this.selectedItems,
      enableSelection: this.enableSelection,
      onClearSelection: this._clearSelection.bind(this),
      onBulkAction: this._handleBulkAction.bind(this)
    });
  }

  /**
   * Event handlers - delegate to controller
   */
  _handleSearch(event) {
    this.controller.handleSearch(event);
  }

  _handleSearchInput(event) {
    this.controller.handleSearchInput(event);
  }

  _handleSuggestionsRequest(event) {
    this.controller.handleSuggestionsRequest(event);
  }

  _updateFilter(filterKey, value) {
    this.controller.updateFilter(filterKey, value);
  }

  _toggleFilters() {
    this.controller.toggleFilters();
  }

  _setViewMode(mode) {
    this.controller.setViewMode(mode);
  }

  _updateSort(sortBy) {
    this.controller.updateSort(sortBy);
  }

  _toggleSortDirection() {
    this.controller.toggleSortDirection();
  }

  _handleContentSelect(event) {
    this.controller.handleContentSelect(event);
  }

  _handleContentAction(event) {
    this.controller.handleContentAction(event);
  }

  _changePage(page) {
    this.controller.changePage(page);
  }

  _clearSelection() {
    this.controller.clearSelection();
  }

  _handleBulkAction(action) {
    this.controller.handleBulkAction(action);
  }

  _getHighlightTerms() {
    return this.controller.getHighlightTerms();
  }

  /**
   * Public API methods
   */

  /**
   * Programmatically trigger a search
   */
  search(query, filters = {}) {
    this.currentQuery = query;
    this.filters = { ...this.filters, ...filters };
    this.controller.performSearch(query);
  }

  /**
   * Clear current search and results
   */
  clearSearch() {
    this.currentQuery = '';
    this.results = [];
    this.totalResults = 0;
    this.selectedItems = [];
    this.currentPage = 1;
  }

  /**
   * Update results externally
   */
  updateResults(results, total = null) {
    this.results = results;
    this.totalResults = total !== null ? total : results.length;
  }

  /**
   * Lifecycle - cleanup controller on disconnect
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.controller) {
      this.controller.destroy();
    }
  }
}

// Register the custom element
customElements.define('tmyl-search-interface', TmylSearchInterface);
