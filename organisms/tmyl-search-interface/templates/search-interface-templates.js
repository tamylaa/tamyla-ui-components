/**
 * Search Interface Templates
 * Extracted template generation logic for better maintainability
 */

import { html } from 'lit';

/**
 * Render search header with search bar and actions
 */
export function renderSearchHeader(props) {
  const {
    currentQuery,
    enableVoiceSearch,
    loading,
    showFilters,
    onSearch,
    onSearchInput,
    onSuggestionsRequest,
    onToggleFilters
  } = props;

  return html`
    <div class="search-header">
      <div class="search-main">
        <tmyl-search-bar
          class="search-bar"
          .value="${currentQuery}"
          placeholder="Search content, documents, campaigns..."
          ?voice-enabled="${enableVoiceSearch}"
          ?loading="${loading}"
          clearable
          @tmyl-search="${onSearch}"
          @tmyl-search-input="${onSearchInput}"
          @tmyl-suggestions-request="${onSuggestionsRequest}"
        ></tmyl-search-bar>

        <div class="search-actions">
          <tmyl-button
            class="filter-toggle"
            variant="secondary"
            size="md"
            icon="chevron-down"
            @tmyl-click="${onToggleFilters}"
          >
            ${showFilters ? 'Hide' : 'Show'} Filters
          </tmyl-button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render filters section
 */
export function renderFilters(props) {
  const {
    showFilters,
    onUpdateFilter
  } = props;

  return html`
    <div class="filters-section ${showFilters ? '' : 'filters-section--hidden'}">
      <div class="filter-group">
        <label class="filter-label">Content Type</label>
        <select 
          class="filter-select"
          @change="${(e) => onUpdateFilter('type', e.target.value)}"
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
          @change="${(e) => onUpdateFilter('dateRange', e.target.value)}"
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
          @input="${(e) => onUpdateFilter('author', e.target.value)}"
        />
      </div>

      <div class="filter-group">
        <label class="filter-label">Tags</label>
        <input 
          type="text"
          class="filter-input"
          placeholder="Enter tags..."
          @input="${(e) => onUpdateFilter('tags', e.target.value)}"
        />
      </div>
    </div>
  `;
}

/**
 * Render results section with header and grid
 */
export function renderResultsSection(props) {
  const {
    loading,
    results,
    onRenderResultsHeader,
    onRenderResults,
    onRenderPagination
  } = props;

  return html`
    <div class="results-section" style="position: relative;">
      ${loading ? html`
        <div class="loading-overlay">
          <div class="loading-spinner"></div>
        </div>
      ` : ''}

      ${onRenderResultsHeader()}
      ${onRenderResults()}
      ${onRenderPagination()}
    </div>
  `;
}

/**
 * Render results header with info and controls
 */
export function renderResultsHeader(props) {
  const {
    results,
    loading,
    currentPage,
    pageSize,
    totalResults,
    currentQuery,
    selectedItems,
    viewMode,
    sortBy,
    sortDirection,
    onSetViewMode,
    onUpdateSort,
    onToggleSortDirection
  } = props;

  if (results.length === 0 && !loading) {
    return '';
  }

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalResults);

  return html`
    <div class="results-header">
      <div class="results-info">
        <span class="results-count">
          ${totalResults > 0 ? `${startItem}-${endItem} of ${totalResults}` : '0'} results
        </span>
        ${currentQuery ? html`
          <span>for "${currentQuery}"</span>
        ` : ''}
        ${selectedItems.length > 0 ? html`
          <span class="selection-info">
            (${selectedItems.length} selected)
          </span>
        ` : ''}
      </div>

      <div class="results-controls">
        ${renderViewModeToggle({ viewMode, onSetViewMode })}
        ${renderSortControls({ sortBy, sortDirection, onUpdateSort, onToggleSortDirection })}
      </div>
    </div>
  `;
}

/**
 * Render view mode toggle buttons
 */
export function renderViewModeToggle(props) {
  const { viewMode, onSetViewMode } = props;

  return html`
    <div class="view-mode-toggle">
      <button 
        class="view-mode-button ${viewMode === 'grid' ? 'view-mode-button--active' : ''}"
        @click="${() => onSetViewMode('grid')}"
        title="Grid view"
      >
        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
        </svg>
      </button>
      <button 
        class="view-mode-button ${viewMode === 'list' ? 'view-mode-button--active' : ''}"
        @click="${() => onSetViewMode('list')}"
        title="List view"
      >
        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path>
        </svg>
      </button>
    </div>
  `;
}

/**
 * Render sort controls
 */
export function renderSortControls(props) {
  const { sortBy, sortDirection, onUpdateSort, onToggleSortDirection } = props;

  return html`
    <div class="sort-controls">
      <select 
        class="sort-select"
        .value="${sortBy}"
        @change="${(e) => onUpdateSort(e.target.value)}"
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
        @tmyl-click="${onToggleSortDirection}"
        title="Toggle sort direction"
        style="transform: ${sortDirection === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)'}"
      ></tmyl-button>
    </div>
  `;
}

/**
 * Render results grid
 */
export function renderResults(props) {
  const {
    loading,
    results,
    viewMode,
    enableSelection,
    selectedItems,
    highlightTerms,
    onContentSelect,
    onContentAction,
    onRenderLoadingCards,
    onRenderEmptyState
  } = props;

  if (loading && results.length === 0) {
    return onRenderLoadingCards();
  }

  if (results.length === 0) {
    return onRenderEmptyState();
  }

  const gridClasses = [
    'results-grid',
    `results-grid--${viewMode}`,
    viewMode === 'list' && 'results-grid--compact'
  ].filter(Boolean).join(' ');

  return html`
    <div class="${gridClasses}">
      ${results.map(content => html`
        <tmyl-content-card
          .content="${content}"
          size="${viewMode === 'list' ? 'compact' : 'default'}"
          ?selectable="${enableSelection}"
          ?selected="${selectedItems.some(item => item.id === content.id)}"
          .highlightTerms="${highlightTerms}"
          @tmyl-content-select="${onContentSelect}"
          @tmyl-content-action="${onContentAction}"
        ></tmyl-content-card>
      `)}
    </div>
  `;
}

/**
 * Render empty state
 */
export function renderEmptyState(props) {
  const { currentQuery } = props;

  return html`
    <div class="empty-state">
      <div class="empty-state__icon">
        <svg viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path>
        </svg>
      </div>
      <div class="empty-state__title">
        ${currentQuery ? 'No results found' : 'Start searching'}
      </div>
      <div class="empty-state__description">
        ${currentQuery 
          ? `Try adjusting your search or filters to find what you're looking for.`
          : 'Use the search bar above to find content, documents, and campaigns.'
        }
      </div>
    </div>
  `;
}

/**
 * Render loading cards placeholder
 */
export function renderLoadingCards() {
  return html`
    <div class="results-grid results-grid--grid">
      ${Array(6).fill().map(() => html`
        <tmyl-card class="loading-card">
          <div class="loading-content">
            <div class="loading-skeleton loading-skeleton--title"></div>
            <div class="loading-skeleton loading-skeleton--text"></div>
            <div class="loading-skeleton loading-skeleton--text"></div>
          </div>
        </tmyl-card>
      `)}
    </div>
  `;
}

/**
 * Render pagination controls
 */
export function renderPagination(props) {
  const {
    currentPage,
    totalResults,
    pageSize,
    onPageChange
  } = props;

  if (totalResults <= pageSize) {
    return '';
  }

  const totalPages = Math.ceil(totalResults / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalResults);

  return html`
    <div class="pagination">
      <tmyl-button
        variant="ghost"
        size="sm"
        icon="chevron-left"
        ?disabled="${currentPage === 1}"
        @tmyl-click="${() => onPageChange(currentPage - 1)}"
        title="Previous page"
      ></tmyl-button>

      <span class="pagination-info">
        Page ${currentPage} of ${totalPages}
      </span>

      <tmyl-button
        variant="ghost"
        size="sm"
        icon="chevron-right"
        ?disabled="${currentPage === totalPages}"
        @tmyl-click="${() => onPageChange(currentPage + 1)}"
        title="Next page"
      ></tmyl-button>
    </div>
  `;
}

/**
 * Render bulk actions bar
 */
export function renderBulkActions(props) {
  const {
    selectedItems,
    enableSelection,
    onClearSelection,
    onBulkAction
  } = props;

  if (!enableSelection || selectedItems.length === 0) {
    return '';
  }

  return html`
    <div class="bulk-actions">
      <div class="bulk-actions-info">
        ${selectedItems.length} item${selectedItems.length !== 1 ? 's' : ''} selected
      </div>
      <div class="bulk-actions-buttons">
        <tmyl-button
          variant="ghost"
          size="sm"
          @tmyl-click="${onClearSelection}"
        >
          Clear Selection
        </tmyl-button>
        <tmyl-button
          variant="secondary"
          size="sm"
          @tmyl-click="${() => onBulkAction('export')}"
        >
          Export
        </tmyl-button>
        <tmyl-button
          variant="primary"
          size="sm"
          @tmyl-click="${() => onBulkAction('archive')}"
        >
          Archive
        </tmyl-button>
      </div>
    </div>
  `;
}
