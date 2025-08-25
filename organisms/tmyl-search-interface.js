/**
 * TmylSearchInterface - Organism Search Component
 * Complete search interface combining search bar, filters, and results
 * Usage: <tmyl-search-interface></tmyl-search-interface>
 */

import { LitElement, html, css } from 'lit';
import './molecules/tmyl-search-bar.js';
import './molecules/tmyl-content-card.js';
import './atoms/tmyl-button.js';
import './atoms/tmyl-card.js';

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
    showFilters: { type: Boolean, attribute: 'show-filters' }
  };

  static styles = css`
    :host {
      display: block;
      font-family: var(--tmyl-font-sans);
      max-width: var(--tmyl-content-max-width);
      margin: 0 auto;
      padding: var(--tmyl-space-4);
    }

    .search-interface {
      display: flex;
      flex-direction: column;
      gap: var(--tmyl-space-6);
    }

    .search-header {
      display: flex;
      flex-direction: column;
      gap: var(--tmyl-space-4);
    }

    .search-main {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--tmyl-space-4);
    }

    .search-bar {
      flex: 1;
      max-width: 600px;
    }

    .search-actions {
      display: flex;
      gap: var(--tmyl-space-2);
      align-items: center;
    }

    .filter-toggle {
      white-space: nowrap;
    }

    .filters-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--tmyl-space-4);
      padding: var(--tmyl-space-4);
      background-color: var(--tmyl-bg-secondary);
      border-radius: var(--tmyl-radius-lg);
      border: 1px solid var(--tmyl-border-primary);
    }

    .filters-section--hidden {
      display: none;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: var(--tmyl-space-2);
    }

    .filter-label {
      font-size: var(--tmyl-text-sm);
      font-weight: var(--tmyl-font-medium);
      color: var(--tmyl-text-primary);
    }

    .filter-select,
    .filter-input {
      padding: var(--tmyl-space-2) var(--tmyl-space-3);
      border: 1px solid var(--tmyl-border-primary);
      border-radius: var(--tmyl-radius-md);
      background-color: var(--tmyl-surface-primary);
      font-size: var(--tmyl-text-sm);
      color: var(--tmyl-text-primary);
    }

    .filter-select:focus,
    .filter-input:focus {
      outline: none;
      border-color: var(--tmyl-border-focus);
      box-shadow: var(--tmyl-shadow-focus);
    }

    .results-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--tmyl-space-4);
      flex-wrap: wrap;
    }

    .results-info {
      display: flex;
      align-items: center;
      gap: var(--tmyl-space-4);
      color: var(--tmyl-text-secondary);
      font-size: var(--tmyl-text-sm);
    }

    .results-count {
      font-weight: var(--tmyl-font-medium);
    }

    .selection-info {
      color: var(--tmyl-primary-600);
      font-weight: var(--tmyl-font-medium);
    }

    .results-controls {
      display: flex;
      align-items: center;
      gap: var(--tmyl-space-3);
    }

    .view-mode-toggle {
      display: flex;
      background-color: var(--tmyl-bg-secondary);
      border-radius: var(--tmyl-radius-md);
      padding: var(--tmyl-space-1);
      gap: var(--tmyl-space-1);
    }

    .view-mode-button {
      padding: var(--tmyl-space-1_5) var(--tmyl-space-2);
      border: none;
      background: transparent;
      border-radius: var(--tmyl-radius-sm);
      cursor: pointer;
      color: var(--tmyl-text-tertiary);
      transition: var(--tmyl-transition-fast);
    }

    .view-mode-button--active {
      background-color: var(--tmyl-surface-primary);
      color: var(--tmyl-text-primary);
      box-shadow: var(--tmyl-shadow-xs);
    }

    .sort-controls {
      display: flex;
      align-items: center;
      gap: var(--tmyl-space-2);
    }

    .sort-select {
      padding: var(--tmyl-space-1_5) var(--tmyl-space-2);
      border: 1px solid var(--tmyl-border-primary);
      border-radius: var(--tmyl-radius-md);
      background-color: var(--tmyl-surface-primary);
      font-size: var(--tmyl-text-sm);
      color: var(--tmyl-text-primary);
      min-width: 140px;
    }

    .results-grid {
      display: grid;
      gap: var(--tmyl-space-4);
    }

    .results-grid--grid {
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    }

    .results-grid--list {
      grid-template-columns: 1fr;
    }

    .results-grid--compact {
      gap: var(--tmyl-space-2);
    }

    .empty-state {
      text-align: center;
      padding: var(--tmyl-space-12) var(--tmyl-space-4);
      color: var(--tmyl-text-tertiary);
    }

    .empty-state__icon {
      width: 4rem;
      height: 4rem;
      margin: 0 auto var(--tmyl-space-4);
      color: var(--tmyl-text-disabled);
    }

    .empty-state__icon svg {
      width: 100%;
      height: 100%;
      fill: currentColor;
    }

    .empty-state__title {
      font-size: var(--tmyl-text-xl);
      font-weight: var(--tmyl-font-semibold);
      color: var(--tmyl-text-secondary);
      margin-bottom: var(--tmyl-space-2);
    }

    .empty-state__description {
      font-size: var(--tmyl-text-base);
      line-height: var(--tmyl-leading-relaxed);
      max-width: 400px;
      margin: 0 auto;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: var(--tmyl-space-2);
      margin-top: var(--tmyl-space-6);
    }

    .pagination-info {
      color: var(--tmyl-text-tertiary);
      font-size: var(--tmyl-text-sm);
      margin: 0 var(--tmyl-space-4);
    }

    .bulk-actions {
      position: sticky;
      bottom: var(--tmyl-space-4);
      background-color: var(--tmyl-surface-elevated);
      border: 1px solid var(--tmyl-border-primary);
      border-radius: var(--tmyl-radius-lg);
      padding: var(--tmyl-space-4);
      box-shadow: var(--tmyl-shadow-lg);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--tmyl-space-4);
      margin-top: var(--tmyl-space-4);
      z-index: var(--tmyl-z-sticky);
    }

    .bulk-actions--hidden {
      display: none;
    }

    .bulk-actions-info {
      font-size: var(--tmyl-text-sm);
      color: var(--tmyl-text-secondary);
    }

    .bulk-actions-buttons {
      display: flex;
      gap: var(--tmyl-space-2);
    }

    /* Loading states */
    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(255, 255, 255, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: var(--tmyl-z-dropdown);
      border-radius: var(--tmyl-radius-lg);
    }

    .loading-spinner {
      width: 2rem;
      height: 2rem;
      border: 3px solid var(--tmyl-border-primary);
      border-top-color: var(--tmyl-primary-500);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    /* Responsive design */
    @media (max-width: 768px) {
      :host {
        padding: var(--tmyl-space-2);
      }

      .search-main {
        flex-direction: column;
        align-items: stretch;
      }

      .search-bar {
        max-width: none;
      }

      .results-header {
        flex-direction: column;
        align-items: stretch;
        gap: var(--tmyl-space-2);
      }

      .results-controls {
        justify-content: space-between;
      }

      .filters-section {
        grid-template-columns: 1fr;
      }

      .results-grid--grid {
        grid-template-columns: 1fr;
      }

      .bulk-actions {
        flex-direction: column;
        gap: var(--tmyl-space-2);
      }
    }
  `;

  constructor() {
    super();
    this.loading = false;
    this.results = [];
    this.totalResults = 0;
    this.currentPage = 1;
    this.pageSize = 12;
    this.currentQuery = '';
    this.filters = {};
    this.selectedItems = [];
    this.viewMode = 'grid';
    this.sortBy = 'relevance';
    this.sortDirection = 'desc';
    this.enableVoiceSearch = true;
    this.enableSelection = true;
    this.showFilters = false;
  }

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

  _renderSearchHeader() {
    return html`
      <div class="search-header">
        <div class="search-main">
          <tmyl-search-bar
            class="search-bar"
            .value="${this.currentQuery}"
            placeholder="Search content, documents, campaigns..."
            ?voice-enabled="${this.enableVoiceSearch}"
            ?loading="${this.loading}"
            clearable
            @tmyl-search="${this._handleSearch}"
            @tmyl-search-input="${this._handleSearchInput}"
            @tmyl-suggestions-request="${this._handleSuggestionsRequest}"
          ></tmyl-search-bar>

          <div class="search-actions">
            <tmyl-button
              class="filter-toggle"
              variant="secondary"
              size="md"
              icon="chevron-down"
              @tmyl-click="${this._toggleFilters}"
            >
              ${this.showFilters ? 'Hide' : 'Show'} Filters
            </tmyl-button>
          </div>
        </div>
      </div>
    `;
  }

  _renderFilters() {
    return html`
      <div class="filters-section ${this.showFilters ? '' : 'filters-section--hidden'}">
        <div class="filter-group">
          <label class="filter-label">Content Type</label>
          <select 
            class="filter-select"
            @change="${(e) => this._updateFilter('type', e.target.value)}"
          >
            <option value="">All Types</option>
            <option value="document">Documents</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="presentation">Presentations</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">Date Range</label>
          <select 
            class="filter-select"
            @change="${(e) => this._updateFilter('dateRange', e.target.value)}"
          >
            <option value="">Any Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">Author</label>
          <input 
            type="text"
            class="filter-input"
            placeholder="Filter by author..."
            @input="${(e) => this._updateFilter('author', e.target.value)}"
          />
        </div>

        <div class="filter-group">
          <label class="filter-label">Tags</label>
          <input 
            type="text"
            class="filter-input"
            placeholder="Enter tags..."
            @input="${(e) => this._updateFilter('tags', e.target.value)}"
          />
        </div>
      </div>
    `;
  }

  _renderResultsSection() {
    return html`
      <div class="results-section" style="position: relative;">
        ${this.loading ? html`
          <div class="loading-overlay">
            <div class="loading-spinner"></div>
          </div>
        ` : ''}

        ${this._renderResultsHeader()}
        ${this._renderResults()}
        ${this._renderPagination()}
      </div>
    `;
  }

  _renderResultsHeader() {
    if (this.results.length === 0 && !this.loading) {
      return '';
    }

    const startItem = (this.currentPage - 1) * this.pageSize + 1;
    const endItem = Math.min(this.currentPage * this.pageSize, this.totalResults);

    return html`
      <div class="results-header">
        <div class="results-info">
          <span class="results-count">
            ${this.totalResults > 0 ? `${startItem}-${endItem} of ${this.totalResults}` : '0'} results
          </span>
          ${this.currentQuery ? html`
            <span>for "${this.currentQuery}"</span>
          ` : ''}
          ${this.selectedItems.length > 0 ? html`
            <span class="selection-info">
              (${this.selectedItems.length} selected)
            </span>
          ` : ''}
        </div>

        <div class="results-controls">
          <div class="view-mode-toggle">
            <button 
              class="view-mode-button ${this.viewMode === 'grid' ? 'view-mode-button--active' : ''}"
              @click="${() => this._setViewMode('grid')}"
              title="Grid view"
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
              </svg>
            </button>
            <button 
              class="view-mode-button ${this.viewMode === 'list' ? 'view-mode-button--active' : ''}"
              @click="${() => this._setViewMode('list')}"
              title="List view"
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path>
              </svg>
            </button>
          </div>

          <div class="sort-controls">
            <select 
              class="sort-select"
              .value="${this.sortBy}"
              @change="${(e) => this._updateSort(e.target.value)}"
            >
              <option value="relevance">Relevance</option>
              <option value="date">Date</option>
              <option value="title">Title</option>
              <option value="author">Author</option>
              <option value="size">Size</option>
            </select>
            
            <tmyl-button
              variant="ghost"
              size="sm"
              icon="chevron-down"
              @tmyl-click="${this._toggleSortDirection}"
              title="Toggle sort direction"
              style="transform: ${this.sortDirection === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)'}"
            ></tmyl-button>
          </div>
        </div>
      </div>
    `;
  }

  _renderResults() {
    if (this.loading && this.results.length === 0) {
      return this._renderLoadingCards();
    }

    if (this.results.length === 0) {
      return this._renderEmptyState();
    }

    const gridClasses = [
      'results-grid',
      `results-grid--${this.viewMode}`,
      this.viewMode === 'list' && 'results-grid--compact'
    ].filter(Boolean).join(' ');

    return html`
      <div class="${gridClasses}">
        ${this.results.map(content => html`
          <tmyl-content-card
            .content="${content}"
            size="${this.viewMode === 'list' ? 'compact' : 'default'}"
            ?selectable="${this.enableSelection}"
            ?selected="${this.selectedItems.some(item => item.id === content.id)}"
            .highlightTerms="${this._getHighlightTerms()}"
            @tmyl-content-select="${this._handleContentSelect}"
            @tmyl-content-action="${this._handleContentAction}"
          ></tmyl-content-card>
        `)}
      </div>
    `;
  }

  _renderEmptyState() {
    return html`
      <div class="empty-state">
        <div class="empty-state__icon">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path>
          </svg>
        </div>
        <div class="empty-state__title">
          ${this.currentQuery ? 'No results found' : 'Start searching'}
        </div>
        <div class="empty-state__description">
          ${this.currentQuery 
            ? `We couldn't find any content matching "${this.currentQuery}". Try adjusting your search terms or filters.`
            : 'Enter a search term to find content, documents, and campaigns.'
          }
        </div>
      </div>
    `;
  }

  _renderLoadingCards() {
    return html`
      <div class="results-grid results-grid--${this.viewMode}">
        ${Array(6).fill(0).map(() => html`
          <tmyl-content-card
            .content="${{ title: 'Loading...', description: 'Loading content...' }}"
            size="${this.viewMode === 'list' ? 'compact' : 'default'}"
          ></tmyl-content-card>
        `)}
      </div>
    `;
  }

  _renderPagination() {
    if (this.totalResults <= this.pageSize) {
      return '';
    }

    const totalPages = Math.ceil(this.totalResults / this.pageSize);
    const startItem = (this.currentPage - 1) * this.pageSize + 1;
    const endItem = Math.min(this.currentPage * this.pageSize, this.totalResults);

    return html`
      <div class="pagination">
        <tmyl-button
          variant="secondary"
          size="sm"
          ?disabled="${this.currentPage === 1}"
          @tmyl-click="${() => this._goToPage(this.currentPage - 1)}"
        >
          Previous
        </tmyl-button>

        <span class="pagination-info">
          Page ${this.currentPage} of ${totalPages}
        </span>

        <tmyl-button
          variant="secondary"
          size="sm"
          ?disabled="${this.currentPage === totalPages}"
          @tmyl-click="${() => this._goToPage(this.currentPage + 1)}"
        >
          Next
        </tmyl-button>
      </div>
    `;
  }

  _renderBulkActions() {
    return html`
      <div class="bulk-actions ${this.selectedItems.length === 0 ? 'bulk-actions--hidden' : ''}">
        <div class="bulk-actions-info">
          ${this.selectedItems.length} item${this.selectedItems.length !== 1 ? 's' : ''} selected
        </div>
        
        <div class="bulk-actions-buttons">
          <tmyl-button
            variant="primary"
            size="sm"
            @tmyl-click="${() => this._handleBulkAction('add-to-campaign')}"
          >
            Add to Campaign
          </tmyl-button>
          
          <tmyl-button
            variant="secondary"
            size="sm"
            icon="download"
            @tmyl-click="${() => this._handleBulkAction('download')}"
          >
            Download
          </tmyl-button>
          
          <tmyl-button
            variant="ghost"
            size="sm"
            @tmyl-click="${this._clearSelection}"
          >
            Clear Selection
          </tmyl-button>
        </div>
      </div>
    `;
  }

  // Event handlers
  _handleSearch(e) {
    this.currentQuery = e.detail.query;
    this.currentPage = 1;
    this._performSearch();
  }

  _handleSearchInput(e) {
    // Handle real-time search input if needed
    this._dispatchEvent('tmyl-search-input', e.detail);
  }

  _handleSuggestionsRequest(e) {
    this._dispatchEvent('tmyl-suggestions-request', e.detail);
  }

  _handleContentSelect(e) {
    const { content, selected } = e.detail;
    
    if (selected) {
      this.selectedItems = [...this.selectedItems, content];
    } else {
      this.selectedItems = this.selectedItems.filter(item => item.id !== content.id);
    }

    this._dispatchEvent('tmyl-selection-change', {
      selectedItems: this.selectedItems,
      item: content,
      selected
    });
  }

  _handleContentAction(e) {
    this._dispatchEvent('tmyl-content-action', e.detail);
  }

  _handleBulkAction(action) {
    this._dispatchEvent('tmyl-bulk-action', {
      action,
      items: this.selectedItems
    });
  }

  _toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  _updateFilter(key, value) {
    this.filters = { ...this.filters, [key]: value };
    this.currentPage = 1;
    this._performSearch();
  }

  _setViewMode(mode) {
    this.viewMode = mode;
    this._dispatchEvent('tmyl-view-mode-change', { viewMode: mode });
  }

  _updateSort(sortBy) {
    this.sortBy = sortBy;
    this._performSearch();
  }

  _toggleSortDirection() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this._performSearch();
  }

  _goToPage(page) {
    this.currentPage = page;
    this._performSearch();
  }

  _clearSelection() {
    this.selectedItems = [];
    this._dispatchEvent('tmyl-selection-change', {
      selectedItems: [],
      cleared: true
    });
  }

  _performSearch() {
    this._dispatchEvent('tmyl-search-request', {
      query: this.currentQuery,
      filters: this.filters,
      page: this.currentPage,
      pageSize: this.pageSize,
      sortBy: this.sortBy,
      sortDirection: this.sortDirection
    });
  }

  _getHighlightTerms() {
    return this.currentQuery ? this.currentQuery.split(' ').filter(term => term.length > 2) : [];
  }

  _dispatchEvent(eventName, detail = {}) {
    this.dispatchEvent(new CustomEvent(eventName, {
      detail,
      bubbles: true,
      composed: true
    }));
  }

  // Public API methods
  setResults(results, totalResults = null) {
    this.results = results;
    if (totalResults !== null) {
      this.totalResults = totalResults;
    }
    this.loading = false;
  }

  setLoading(loading) {
    this.loading = loading;
  }

  setSuggestions(suggestions) {
    const searchBar = this.shadowRoot.querySelector('tmyl-search-bar');
    if (searchBar) {
      searchBar.setSuggestions(suggestions);
    }
  }

  clearResults() {
    this.results = [];
    this.totalResults = 0;
    this.currentPage = 1;
    this.selectedItems = [];
  }
}

customElements.define('tmyl-search-interface', TmylSearchInterface);
