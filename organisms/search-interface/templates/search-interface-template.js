/**
 * Search Interface Template
 * Complete search interface organism template
 */

import { createSearchBarTemplate } from '../../molecules/search-bar/templates/search-bar-template.js';
import { createContentCardTemplate } from '../../molecules/content-card/templates/content-card-template.js';
import { createButtonTemplate } from '../atoms/button/templates/button-template.js';

export function createSearchInterfaceTemplate(props) {
  const {
    title = '',
    description = '',
    searchProps = {},
    resultsCount = 0,
    results = [],
    loading = false,
    error = null,
    showHeader = true,
    showFilters = false,
    filters = [],
    showResultsActions = true,
    layout = 'vertical',
    size = 'default',
    className = ''
  } = props;

  const classes = [
    'tmyl-search-interface',
    `tmyl-search-interface--${layout}`,
    `tmyl-search-interface--${size}`,
    loading && 'tmyl-search-interface--loading',
    error && 'tmyl-search-interface--error',
    className
  ].filter(Boolean).join(' ');

  return `
    <div class="${classes}">
      ${showHeader ? `
        <div class="tmyl-search-interface__header">
          ${title ? `<h2 class="tmyl-search-interface__title">${title}</h2>` : ''}
          ${description ? `<p class="tmyl-search-interface__description">${description}</p>` : ''}
        </div>
      ` : ''}

      <div class="tmyl-search-interface__controls">
        <div class="tmyl-search-interface__search-bar">
          ${createSearchBarTemplate({
            placeholder: 'Search content...',
            showVoiceInput: true,
            showAdvancedFilters: false,
            ...searchProps
          })}
        </div>

        ${showFilters && filters.length ? `
          <div class="tmyl-search-interface__filters">
            ${filters.map(filter => createFilterGroup(filter)).join('')}
          </div>
        ` : ''}
      </div>

      <div class="tmyl-search-interface__results">
        ${showResultsActions || resultsCount > 0 ? `
          <div class="tmyl-search-interface__results-header">
            ${resultsCount > 0 ? `
              <div class="tmyl-search-interface__results-count">
                ${formatResultsCount(resultsCount)}
              </div>
            ` : ''}
            
            ${showResultsActions ? `
              <div class="tmyl-search-interface__results-actions">
                ${createButtonTemplate({
                  variant: 'ghost',
                  size: 'sm',
                  icon: 'grid',
                  'aria-label': 'Grid view',
                  'data-view': 'grid'
                })}
                ${createButtonTemplate({
                  variant: 'ghost',
                  size: 'sm',
                  icon: 'list',
                  'aria-label': 'List view',
                  'data-view': 'list'
                })}
                ${createButtonTemplate({
                  variant: 'ghost',
                  size: 'sm',
                  icon: 'filter',
                  'aria-label': 'Filter options',
                  'data-action': 'filter'
                })}
                ${createButtonTemplate({
                  variant: 'ghost',
                  size: 'sm',
                  icon: 'sort',
                  'aria-label': 'Sort options',
                  'data-action': 'sort'
                })}
              </div>
            ` : ''}
          </div>
        ` : ''}

        <div class="tmyl-search-interface__content-grid">
          ${createResultsContent({ results, loading, error, resultsCount })}
        </div>
      </div>
    </div>
  `;
}

/**
 * Create results content based on state
 */
function createResultsContent({ results, loading, error, resultsCount }) {
  if (error) {
    return createErrorState(error);
  }

  if (loading) {
    return createLoadingState();
  }

  if (resultsCount === 0) {
    return createEmptyState();
  }

  return createResultsGrid(results);
}

/**
 * Create filter group
 */
function createFilterGroup(filter) {
  const { type, label, options = [], selected = [] } = filter;

  switch (type) {
    case 'select':
      return `
        <div class="tmyl-search-interface__filter-group">
          <label class="tmyl-search-interface__filter-label">${label}</label>
          <select class="tmyl-filter-select" data-filter="${filter.key}">
            <option value="">All ${label}</option>
            ${options.map(option => `
              <option value="${option.value}" ${selected.includes(option.value) ? 'selected' : ''}>
                ${option.label}
              </option>
            `).join('')}
          </select>
        </div>
      `;

    case 'checkbox':
      return `
        <div class="tmyl-search-interface__filter-group">
          <span class="tmyl-search-interface__filter-label">${label}</span>
          <div class="tmyl-filter-checkboxes">
            ${options.map(option => `
              <label class="tmyl-filter-checkbox">
                <input type="checkbox" value="${option.value}" ${selected.includes(option.value) ? 'checked' : ''} data-filter="${filter.key}">
                <span>${option.label}</span>
              </label>
            `).join('')}
          </div>
        </div>
      `;

    case 'radio':
      return `
        <div class="tmyl-search-interface__filter-group">
          <span class="tmyl-search-interface__filter-label">${label}</span>
          <div class="tmyl-filter-radios">
            ${options.map(option => `
              <label class="tmyl-filter-radio">
                <input type="radio" name="${filter.key}" value="${option.value}" ${selected.includes(option.value) ? 'checked' : ''}>
                <span>${option.label}</span>
              </label>
            `).join('')}
          </div>
        </div>
      `;

    default:
      return '';
  }
}

/**
 * Create results grid
 */
function createResultsGrid(results) {
  if (!results.length) {
    return createEmptyState();
  }

  return `
    <div class="tmyl-content-grid" role="grid" aria-label="Search results">
      ${results.map(result => createContentCardTemplate({
        content: result,
        variant: 'default',
        size: 'md',
        selectable: true,
        showActions: true
      })).join('')}
    </div>
  `;
}

/**
 * Create empty state
 */
function createEmptyState() {
  return `
    <div class="tmyl-search-interface__empty" role="status" aria-live="polite">
      <div class="tmyl-search-interface__empty-icon">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
      </div>
      <h3 class="tmyl-search-interface__empty-title">No results found</h3>
      <p class="tmyl-search-interface__empty-description">
        Try adjusting your search terms or filters to find what you're looking for.
      </p>
    </div>
  `;
}

/**
 * Create loading state
 */
function createLoadingState() {
  return `
    <div class="tmyl-search-interface__loading" role="status" aria-live="polite">
      <div class="tmyl-content-grid">
        ${Array.from({ length: 6 }, () => createLoadingCard()).join('')}
      </div>
    </div>
  `;
}

/**
 * Create loading card placeholder
 */
function createLoadingCard() {
  return `
    <div class="tmyl-content-card tmyl-content-card--loading">
      <div class="tmyl-content-card__loading-placeholder">
        <div class="tmyl-loading-skeleton tmyl-loading-skeleton--title"></div>
        <div class="tmyl-loading-skeleton tmyl-loading-skeleton--text"></div>
        <div class="tmyl-loading-skeleton tmyl-loading-skeleton--text"></div>
      </div>
    </div>
  `;
}

/**
 * Create error state
 */
function createErrorState(error) {
  return `
    <div class="tmyl-search-interface__error" role="alert">
      <div class="tmyl-search-interface__empty-icon">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      </div>
      <h3 class="tmyl-search-interface__empty-title">Search Error</h3>
      <p class="tmyl-search-interface__empty-description">
        ${error.message || 'An error occurred while searching. Please try again.'}
      </p>
      ${createButtonTemplate({
        variant: 'primary',
        size: 'sm',
        text: 'Try Again',
        'data-action': 'retry'
      })}
    </div>
  `;
}

/**
 * Format results count for display
 */
function formatResultsCount(count) {
  if (count === 0) return 'No results';
  if (count === 1) return '1 result';
  if (count < 1000) return `${count} results`;
  if (count < 1000000) return `${(count / 1000).toFixed(1)}K results`;
  return `${(count / 1000000).toFixed(1)}M results`;
}

/**
 * Update search interface template with new data
 */
export function updateSearchInterfaceResults(element, newResults, resultsCount) {
  const contentGrid = element.querySelector('.tmyl-search-interface__content-grid');
  const resultsCountElement = element.querySelector('.tmyl-search-interface__results-count');
  
  if (contentGrid) {
    contentGrid.innerHTML = createResultsContent({ 
      results: newResults, 
      loading: false, 
      error: null, 
      resultsCount 
    });
  }
  
  if (resultsCountElement) {
    resultsCountElement.textContent = formatResultsCount(resultsCount);
  }
}

/**
 * Update search interface loading state
 */
export function updateSearchInterfaceLoading(element, loading) {
  const contentGrid = element.querySelector('.tmyl-search-interface__content-grid');
  
  if (loading) {
    element.classList.add('tmyl-search-interface--loading');
    if (contentGrid) {
      contentGrid.innerHTML = createLoadingState();
    }
  } else {
    element.classList.remove('tmyl-search-interface--loading');
  }
}

/**
 * Update search interface error state
 */
export function updateSearchInterfaceError(element, error) {
  const contentGrid = element.querySelector('.tmyl-search-interface__content-grid');
  
  if (error) {
    element.classList.add('tmyl-search-interface--error');
    if (contentGrid) {
      contentGrid.innerHTML = createErrorState(error);
    }
  } else {
    element.classList.remove('tmyl-search-interface--error');
  }
}

/**
 * Search interface template variants
 */
export const searchInterfaceTemplates = {
  /**
   * Simple search interface
   */
  simple: (props) => createSearchInterfaceTemplate({
    ...props,
    showHeader: false,
    showFilters: false,
    showResultsActions: false,
    layout: 'vertical',
    size: 'compact'
  }),

  /**
   * Advanced search interface
   */
  advanced: (props) => createSearchInterfaceTemplate({
    ...props,
    showHeader: true,
    showFilters: true,
    showResultsActions: true,
    layout: 'vertical',
    size: 'default'
  }),

  /**
   * Horizontal layout search interface
   */
  horizontal: (props) => createSearchInterfaceTemplate({
    ...props,
    layout: 'horizontal',
    showFilters: true
  }),

  /**
   * Dashboard search widget
   */
  widget: (props) => createSearchInterfaceTemplate({
    ...props,
    showHeader: false,
    showFilters: false,
    showResultsActions: false,
    size: 'compact'
  })
};
