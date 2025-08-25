/**
 * Enhanced Search Application - Template Generation System
 * Modular template generation following atomic design principles
 */

/**
 * Enhanced Search Application Templates
 * Comprehensive template system for search application components
 */
export const EnhancedSearchTemplates = {
  /**
   * Main application template
   */
  application(props = {}) {
    const {
      title = 'Enhanced Search',
      description = 'Intelligent content discovery with natural language processing',
      layout = 'vertical',
      showSidebar = true,
      showAnalytics = false
    } = props;

    return `
      <div class="tmyl-enhanced-search" data-layout="${layout}">
        ${this.header({ title, description })}
        ${showSidebar ? this.sidebar() : ''}
        ${this.main()}
        ${this.footer()}
        ${showAnalytics ? this.analytics() : ''}
      </div>
    `;
  },

  /**
   * Header section template
   */
  header(props = {}) {
    const {
      title = 'Enhanced Search',
      description = 'Intelligent content discovery',
      showLogo = false,
      logoUrl = '',
      breadcrumbs = []
    } = props;

    return `
      <header class="tmyl-enhanced-search__header">
        ${showLogo ? `<img src="${logoUrl}" alt="Logo" class="tmyl-enhanced-search__logo">` : ''}
        ${breadcrumbs.length > 0 ? this.breadcrumbs(breadcrumbs) : ''}
        <h1 class="tmyl-enhanced-search__title">${title}</h1>
        <p class="tmyl-enhanced-search__description">${description}</p>
        <div class="tmyl-enhanced-search__search-section" data-search-container>
          <!-- Search bar will be mounted here -->
        </div>
      </header>
    `;
  },

  /**
   * Breadcrumbs template
   */
  breadcrumbs(breadcrumbs = []) {
    if (!breadcrumbs.length) return '';

    const breadcrumbItems = breadcrumbs.map((crumb, index) => {
      const isLast = index === breadcrumbs.length - 1;
      const link = isLast ? crumb.name : `<a href="${crumb.url}" class="tmyl-enhanced-search__breadcrumb-link">${crumb.name}</a>`;
      
      return `
        <span class="tmyl-enhanced-search__breadcrumb ${isLast ? 'tmyl-enhanced-search__breadcrumb--current' : ''}">
          ${link}
        </span>
      `;
    }).join('<span class="tmyl-enhanced-search__breadcrumb-separator">/</span>');

    return `
      <nav class="tmyl-enhanced-search__breadcrumbs" aria-label="Breadcrumb">
        ${breadcrumbItems}
      </nav>
    `;
  },

  /**
   * Sidebar template
   */
  sidebar(props = {}) {
    const {
      showRecentSearches = true,
      showFilters = true,
      showSavedSearches = false,
      customSections = []
    } = props;

    return `
      <aside class="tmyl-enhanced-search__sidebar">
        ${showFilters ? this.filtersSection() : ''}
        ${showRecentSearches ? this.recentSearchesSection() : ''}
        ${showSavedSearches ? this.savedSearchesSection() : ''}
        ${customSections.map(section => this.customSection(section)).join('')}
      </aside>
    `;
  },

  /**
   * Filters section template
   */
  filtersSection(props = {}) {
    const {
      title = 'Filters',
      filters = []
    } = props;

    return `
      <div class="tmyl-enhanced-search__filter-group">
        <h3 class="tmyl-enhanced-search__filter-title">${title}</h3>
        <div class="tmyl-enhanced-search__filters" data-filters-container>
          <!-- Filters will be mounted here -->
        </div>
      </div>
    `;
  },

  /**
   * Recent searches section template
   */
  recentSearchesSection(props = {}) {
    const {
      title = 'Recent Searches',
      searches = [],
      maxItems = 5
    } = props;

    const searchItems = searches.slice(0, maxItems).map(search => 
      `<li class="tmyl-enhanced-search__recent-search" 
           data-search-query="${search.query}"
           title="${search.query} - ${search.timestamp}">
         ${search.query}
       </li>`
    ).join('');

    return `
      <div class="tmyl-enhanced-search__filter-group">
        <h3 class="tmyl-enhanced-search__filter-title">${title}</h3>
        <ul class="tmyl-enhanced-search__recent-searches">
          ${searchItems}
          ${searches.length === 0 ? 
            '<li class="tmyl-enhanced-search__recent-search tmyl-enhanced-search__recent-search--empty">No recent searches</li>' : 
            ''
          }
        </ul>
      </div>
    `;
  },

  /**
   * Saved searches section template
   */
  savedSearchesSection(props = {}) {
    const {
      title = 'Saved Searches',
      searches = []
    } = props;

    const searchItems = searches.map(search => 
      `<li class="tmyl-enhanced-search__saved-search" 
           data-search-id="${search.id}">
         <span class="tmyl-enhanced-search__saved-search-name">${search.name}</span>
         <button class="tmyl-enhanced-search__saved-search-delete" 
                 data-search-id="${search.id}"
                 aria-label="Delete saved search">×</button>
       </li>`
    ).join('');

    return `
      <div class="tmyl-enhanced-search__filter-group">
        <h3 class="tmyl-enhanced-search__filter-title">${title}</h3>
        <ul class="tmyl-enhanced-search__saved-searches">
          ${searchItems}
          ${searches.length === 0 ? 
            '<li class="tmyl-enhanced-search__saved-search tmyl-enhanced-search__saved-search--empty">No saved searches</li>' : 
            ''
          }
        </ul>
      </div>
    `;
  },

  /**
   * Custom section template
   */
  customSection(section = {}) {
    const {
      title = 'Custom Section',
      content = '',
      className = ''
    } = section;

    return `
      <div class="tmyl-enhanced-search__filter-group ${className}">
        <h3 class="tmyl-enhanced-search__filter-title">${title}</h3>
        <div class="tmyl-enhanced-search__custom-content">
          ${content}
        </div>
      </div>
    `;
  },

  /**
   * Main content area template
   */
  main(props = {}) {
    const {
      showControls = true,
      showPagination = true
    } = props;

    return `
      <main class="tmyl-enhanced-search__main">
        ${showControls ? this.controls() : ''}
        <div class="tmyl-enhanced-search__results" data-results-container>
          ${this.loadingState()}
        </div>
        ${showPagination ? this.pagination() : ''}
      </main>
    `;
  },

  /**
   * Controls section template
   */
  controls(props = {}) {
    const {
      viewModes = ['grid', 'list'],
      sortOptions = [
        { value: 'relevance', label: 'Relevance' },
        { value: 'date', label: 'Date' },
        { value: 'title', label: 'Title' }
      ],
      showExport = false
    } = props;

    const viewToggles = viewModes.map(mode => 
      `<button class="tmyl-enhanced-search__view-toggle" 
               data-view-mode="${mode}"
               aria-label="Switch to ${mode} view">
         <span class="tmyl-enhanced-search__view-icon tmyl-enhanced-search__view-icon--${mode}"></span>
         ${mode}
       </button>`
    ).join('');

    const sortOptionElements = sortOptions.map(option => 
      `<option value="${option.value}">${option.label}</option>`
    ).join('');

    return `
      <div class="tmyl-enhanced-search__controls">
        <div class="tmyl-enhanced-search__view-controls">
          ${viewToggles}
        </div>
        <div class="tmyl-enhanced-search__sort-controls">
          <label for="sort-select" class="tmyl-enhanced-search__sort-label">Sort by:</label>
          <select id="sort-select" class="tmyl-enhanced-search__sort-select">
            ${sortOptionElements}
          </select>
        </div>
        ${showExport ? this.exportControls() : ''}
      </div>
    `;
  },

  /**
   * Export controls template
   */
  exportControls() {
    return `
      <div class="tmyl-enhanced-search__export-controls">
        <button class="tmyl-enhanced-search__export-btn" data-export-type="csv">
          Export CSV
        </button>
        <button class="tmyl-enhanced-search__export-btn" data-export-type="json">
          Export JSON
        </button>
      </div>
    `;
  },

  /**
   * Results container template
   */
  resultsContainer(props = {}) {
    const {
      viewMode = 'grid',
      results = [],
      total = 0,
      searchTime = 0
    } = props;

    if (results.length === 0) {
      return this.emptyState();
    }

    return `
      <div class="tmyl-enhanced-search__results-wrapper">
        ${this.resultsHeader({ total, searchTime })}
        <div class="tmyl-enhanced-search__results-${viewMode}" data-view-mode="${viewMode}">
          <!-- Results will be mounted here by organism components -->
        </div>
      </div>
    `;
  },

  /**
   * Results header template
   */
  resultsHeader(props = {}) {
    const {
      total = 0,
      searchTime = 0,
      currentPage = 1,
      perPage = 20
    } = props;

    const startResult = ((currentPage - 1) * perPage) + 1;
    const endResult = Math.min(currentPage * perPage, total);

    return `
      <div class="tmyl-enhanced-search__results-header">
        <span class="tmyl-enhanced-search__results-count">
          ${total > 0 ? `Showing ${startResult}-${endResult} of ${total} results` : 'No results found'}
        </span>
        <span class="tmyl-enhanced-search__results-time">
          ${searchTime > 0 ? `(${searchTime}ms)` : ''}
        </span>
      </div>
    `;
  },

  /**
   * Loading state template
   */
  loadingState(props = {}) {
    const {
      message = 'Searching...',
      showSpinner = true
    } = props;

    return `
      <div class="tmyl-enhanced-search__loading">
        ${showSpinner ? '<div class="tmyl-enhanced-search__loading-spinner"></div>' : ''}
        <p class="tmyl-enhanced-search__loading-message">${message}</p>
      </div>
    `;
  },

  /**
   * Empty state template
   */
  emptyState(props = {}) {
    const {
      title = 'No results found',
      message = 'Try adjusting your search terms or filters',
      showSuggestions = true,
      suggestions = [
        'Check your spelling',
        'Try more general keywords',
        'Remove some filters'
      ]
    } = props;

    const suggestionsList = showSuggestions && suggestions.length > 0 ? `
      <ul class="tmyl-enhanced-search__empty-suggestions">
        ${suggestions.map(suggestion => 
          `<li class="tmyl-enhanced-search__empty-suggestion">${suggestion}</li>`
        ).join('')}
      </ul>
    ` : '';

    return `
      <div class="tmyl-enhanced-search__empty">
        <div class="tmyl-enhanced-search__empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <h3 class="tmyl-enhanced-search__empty-title">${title}</h3>
        <p class="tmyl-enhanced-search__empty-message">${message}</p>
        ${suggestionsList}
      </div>
    `;
  },

  /**
   * Error state template
   */
  errorState(props = {}) {
    const {
      title = 'Search Error',
      message = 'Something went wrong while searching',
      showRetry = true,
      errorCode = '',
      technical = false
    } = props;

    return `
      <div class="tmyl-enhanced-search__error">
        <h3 class="tmyl-enhanced-search__error-title">${title}</h3>
        <p class="tmyl-enhanced-search__error-message">${message}</p>
        ${errorCode && technical ? `<code class="tmyl-enhanced-search__error-code">${errorCode}</code>` : ''}
        ${showRetry ? '<button class="tmyl-enhanced-search__error-retry">Try Again</button>' : ''}
      </div>
    `;
  },

  /**
   * Pagination template
   */
  pagination(props = {}) {
    const {
      currentPage = 1,
      totalPages = 1,
      perPage = 20,
      total = 0,
      showPageSize = true
    } = props;

    if (totalPages <= 1) return '';

    const prevDisabled = currentPage === 1;
    const nextDisabled = currentPage === totalPages;

    // Generate page numbers with ellipsis logic
    const pageNumbers = this.generatePageNumbers(currentPage, totalPages);

    const pageElements = pageNumbers.map(page => {
      if (page === '...') {
        return '<span class="tmyl-enhanced-search__pagination-ellipsis">...</span>';
      }
      
      const isActive = page === currentPage;
      return `
        <button class="tmyl-enhanced-search__pagination-page ${isActive ? 'tmyl-enhanced-search__pagination-page--active' : ''}"
                data-page="${page}"
                ${isActive ? 'aria-current="page"' : ''}>
          ${page}
        </button>
      `;
    }).join('');

    const pageSizeSelector = showPageSize ? `
      <div class="tmyl-enhanced-search__pagination-size">
        <label for="page-size-select">Items per page:</label>
        <select id="page-size-select" class="tmyl-enhanced-search__pagination-size-select">
          <option value="10" ${perPage === 10 ? 'selected' : ''}>10</option>
          <option value="20" ${perPage === 20 ? 'selected' : ''}>20</option>
          <option value="50" ${perPage === 50 ? 'selected' : ''}>50</option>
          <option value="100" ${perPage === 100 ? 'selected' : ''}>100</option>
        </select>
      </div>
    ` : '';

    return `
      <nav class="tmyl-enhanced-search__pagination" aria-label="Search results pagination">
        <div class="tmyl-enhanced-search__pagination-info">
          Page ${currentPage} of ${totalPages} (${total} total items)
        </div>
        <div class="tmyl-enhanced-search__pagination-controls">
          <button class="tmyl-enhanced-search__pagination-prev" 
                  data-page="${currentPage - 1}"
                  ${prevDisabled ? 'disabled' : ''}>
            Previous
          </button>
          ${pageElements}
          <button class="tmyl-enhanced-search__pagination-next" 
                  data-page="${currentPage + 1}"
                  ${nextDisabled ? 'disabled' : ''}>
            Next
          </button>
        </div>
        ${pageSizeSelector}
      </nav>
    `;
  },

  /**
   * Generate page numbers for pagination with ellipsis
   */
  generatePageNumbers(currentPage, totalPages) {
    const delta = 2; // Number of pages to show around current page
    const pages = [];
    
    // Always show first page
    pages.push(1);
    
    // Calculate range around current page
    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta);
    
    // Add ellipsis if there's a gap after first page
    if (rangeStart > 2) {
      pages.push('...');
    }
    
    // Add pages around current page
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }
    
    // Add ellipsis if there's a gap before last page
    if (rangeEnd < totalPages - 1) {
      pages.push('...');
    }
    
    // Always show last page (if more than 1 page)
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  },

  /**
   * Analytics section template
   */
  analytics(props = {}) {
    const {
      searchStats = {},
      insights = [],
      showDetails = false
    } = props;

    const insightTags = insights.map(insight => 
      `<span class="tmyl-enhanced-search__insight-tag">${insight}</span>`
    ).join('');

    return `
      <div class="tmyl-enhanced-search__analytics">
        <h3>Search Analytics</h3>
        <p>Search performance and insights</p>
        ${insightTags ? `<div class="tmyl-enhanced-search__insights">${insightTags}</div>` : ''}
        ${showDetails ? this.analyticsDetails(searchStats) : ''}
      </div>
    `;
  },

  /**
   * Analytics details template
   */
  analyticsDetails(stats = {}) {
    const {
      totalSearches = 0,
      avgResponseTime = 0,
      popularTerms = [],
      successRate = 0
    } = stats;

    return `
      <div class="tmyl-enhanced-search__analytics-details">
        <div class="tmyl-enhanced-search__stat">
          <span class="tmyl-enhanced-search__stat-value">${totalSearches}</span>
          <span class="tmyl-enhanced-search__stat-label">Total Searches</span>
        </div>
        <div class="tmyl-enhanced-search__stat">
          <span class="tmyl-enhanced-search__stat-value">${avgResponseTime}ms</span>
          <span class="tmyl-enhanced-search__stat-label">Avg Response</span>
        </div>
        <div class="tmyl-enhanced-search__stat">
          <span class="tmyl-enhanced-search__stat-value">${successRate}%</span>
          <span class="tmyl-enhanced-search__stat-label">Success Rate</span>
        </div>
      </div>
    `;
  },

  /**
   * Footer template
   */
  footer(props = {}) {
    const {
      showStats = true,
      showInfo = true,
      customLinks = []
    } = props;

    const links = customLinks.map(link => 
      `<a href="${link.url}" class="tmyl-enhanced-search__footer-link">${link.label}</a>`
    ).join(' | ');

    return `
      <footer class="tmyl-enhanced-search__footer">
        ${showStats ? this.footerStats() : ''}
        ${showInfo ? `<div class="tmyl-enhanced-search__footer-info">
          Enhanced Search Application
          ${links ? ` | ${links}` : ''}
        </div>` : ''}
      </footer>
    `;
  },

  /**
   * Footer stats template
   */
  footerStats(props = {}) {
    const {
      totalDocuments = 0,
      lastUpdated = '',
      searchEngines = ['Meilisearch', 'Vectorize']
    } = props;

    return `
      <div class="tmyl-enhanced-search__stats">
        <div class="tmyl-enhanced-search__stat">
          <span class="tmyl-enhanced-search__stat-value">${totalDocuments.toLocaleString()}</span>
          <span class="tmyl-enhanced-search__stat-label">Documents</span>
        </div>
        <div class="tmyl-enhanced-search__stat">
          <span class="tmyl-enhanced-search__stat-value">${searchEngines.length}</span>
          <span class="tmyl-enhanced-search__stat-label">Search Engines</span>
        </div>
        <div class="tmyl-enhanced-search__stat">
          <span class="tmyl-enhanced-search__stat-value">${lastUpdated || 'Now'}</span>
          <span class="tmyl-enhanced-search__stat-label">Last Updated</span>
        </div>
      </div>
    `;
  }
};

/**
 * Enhanced Search Template Utilities
 */
export const EnhancedSearchTemplateUtils = {
  /**
   * Create template with proper accessibility
   */
  createAccessibleTemplate(templateHtml, options = {}) {
    const {
      role = '',
      ariaLabel = '',
      ariaDescribedBy = '',
      tabIndex = null
    } = options;

    const attributes = [];
    if (role) attributes.push(`role="${role}"`);
    if (ariaLabel) attributes.push(`aria-label="${ariaLabel}"`);
    if (ariaDescribedBy) attributes.push(`aria-describedby="${ariaDescribedBy}"`);
    if (tabIndex !== null) attributes.push(`tabindex="${tabIndex}"`);

    if (attributes.length === 0) return templateHtml;

    // Add attributes to the root element
    return templateHtml.replace(/^(\s*<[^>]+)/, `$1 ${attributes.join(' ')}`);
  },

  /**
   * Sanitize content for safe HTML insertion
   */
  sanitizeContent(content) {
    if (typeof content !== 'string') return '';
    
    return content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  },

  /**
   * Generate unique IDs for template elements
   */
  generateId(prefix = 'tmyl-search') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },

  /**
   * Validate template props
   */
  validateProps(props, schema) {
    const errors = [];
    
    for (const [key, rules] of Object.entries(schema)) {
      const value = props[key];
      
      if (rules.required && (value === undefined || value === null)) {
        errors.push(`Missing required prop: ${key}`);
      }
      
      if (value !== undefined && rules.type && typeof value !== rules.type) {
        errors.push(`Invalid type for prop ${key}: expected ${rules.type}, got ${typeof value}`);
      }
    }
    
    return errors;
  }
};

export default EnhancedSearchTemplates;
