/**
 * Search Interface Configuration
 * Centralized configuration and default values
 */

/**
 * Default properties for search interface
 */
export const defaultSearchInterfaceProps = {
  loading: false,
  results: [],
  totalResults: 0,
  currentPage: 1,
  pageSize: 20,
  currentQuery: '',
  filters: {},
  selectedItems: [],
  viewMode: 'grid',
  sortBy: 'relevance',
  sortDirection: 'desc',
  enableVoiceSearch: true,
  enableSelection: false,
  showFilters: false,
  searchDebounceMs: 300,
  trackAnalytics: true
};

/**
 * Configuration constants
 */
export const searchInterfaceConfig = {
  // Valid view modes
  viewModes: ['grid', 'list'],
  
  // Valid sort options
  sortOptions: ['relevance', 'date', 'title', 'author', 'size'],
  
  // Valid sort directions
  sortDirections: ['asc', 'desc'],
  
  // Page size options
  pageSizeOptions: [10, 20, 50, 100],
  
  // Debounce timing
  debounce: {
    search: 300,
    filter: 500
  },
  
  // Loading states
  loadingStates: {
    searching: 'searching',
    loading: 'loading',
    idle: 'idle',
    error: 'error'
  },
  
  // Filter types
  filterTypes: {
    select: 'select',
    input: 'input',
    multiSelect: 'multiSelect',
    dateRange: 'dateRange'
  },
  
  // Content types
  contentTypes: [
    { value: 'document', label: 'Documents' },
    { value: 'image', label: 'Images' },
    { value: 'video', label: 'Videos' },
    { value: 'presentation', label: 'Presentations' },
    { value: 'spreadsheet', label: 'Spreadsheets' },
    { value: 'audio', label: 'Audio' }
  ],
  
  // Date range options
  dateRangeOptions: [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ],
  
  // Bulk actions
  bulkActions: [
    { id: 'export', label: 'Export', icon: 'download' },
    { id: 'archive', label: 'Archive', icon: 'archive' },
    { id: 'delete', label: 'Delete', icon: 'trash', variant: 'danger' },
    { id: 'share', label: 'Share', icon: 'share' }
  ]
};

/**
 * Filter definitions
 */
export const searchInterfaceFilters = {
  contentType: {
    type: 'select',
    label: 'Content Type',
    options: searchInterfaceConfig.contentTypes,
    placeholder: 'All Types'
  },
  
  dateRange: {
    type: 'select',
    label: 'Date Range',
    options: searchInterfaceConfig.dateRangeOptions,
    placeholder: 'Any Time'
  },
  
  author: {
    type: 'input',
    label: 'Author',
    placeholder: 'Filter by author...'
  },
  
  tags: {
    type: 'input',
    label: 'Tags',
    placeholder: 'Enter tags...'
  },
  
  size: {
    type: 'select',
    label: 'File Size',
    options: [
      { value: 'small', label: 'Small (< 1MB)' },
      { value: 'medium', label: 'Medium (1-10MB)' },
      { value: 'large', label: 'Large (> 10MB)' }
    ],
    placeholder: 'Any Size'
  }
};

/**
 * Search interface validation rules
 */
export const searchInterfaceValidation = {
  /**
   * Validate view mode
   */
  validateViewMode(viewMode) {
    return searchInterfaceConfig.viewModes.includes(viewMode);
  },

  /**
   * Validate sort option
   */
  validateSortBy(sortBy) {
    return searchInterfaceConfig.sortOptions.includes(sortBy);
  },

  /**
   * Validate sort direction
   */
  validateSortDirection(direction) {
    return searchInterfaceConfig.sortDirections.includes(direction);
  },

  /**
   * Validate page size
   */
  validatePageSize(pageSize) {
    return typeof pageSize === 'number' && pageSize > 0 && pageSize <= 1000;
  },

  /**
   * Validate current page
   */
  validateCurrentPage(page, totalPages) {
    return typeof page === 'number' && page >= 1 && page <= Math.max(1, totalPages);
  },

  /**
   * Validate debounce timing
   */
  validateDebounceMs(ms) {
    return typeof ms === 'number' && ms >= 0 && ms <= 5000;
  },

  /**
   * Validate all props
   */
  validateProps(props) {
    const errors = [];

    if (props.viewMode && !this.validateViewMode(props.viewMode)) {
      errors.push(`Invalid viewMode: ${props.viewMode}. Must be one of: ${searchInterfaceConfig.viewModes.join(', ')}`);
    }

    if (props.sortBy && !this.validateSortBy(props.sortBy)) {
      errors.push(`Invalid sortBy: ${props.sortBy}. Must be one of: ${searchInterfaceConfig.sortOptions.join(', ')}`);
    }

    if (props.sortDirection && !this.validateSortDirection(props.sortDirection)) {
      errors.push(`Invalid sortDirection: ${props.sortDirection}. Must be one of: ${searchInterfaceConfig.sortDirections.join(', ')}`);
    }

    if (props.pageSize !== undefined && !this.validatePageSize(props.pageSize)) {
      errors.push('pageSize must be a positive number not exceeding 1000');
    }

    if (props.searchDebounceMs !== undefined && !this.validateDebounceMs(props.searchDebounceMs)) {
      errors.push('searchDebounceMs must be a number between 0 and 5000');
    }

    return errors;
  }
};

/**
 * Search interface themes
 */
export const searchInterfaceThemes = {
  default: {
    spacing: 'comfortable',
    density: 'normal',
    animations: true
  },
  
  compact: {
    spacing: 'compact',
    density: 'high',
    animations: false,
    pageSize: 50
  },
  
  minimal: {
    spacing: 'minimal',
    density: 'low',
    showFilters: false,
    enableSelection: false,
    viewMode: 'list'
  }
};

/**
 * Event names used by the search interface
 */
export const searchInterfaceEvents = {
  searchStart: 'tmyl-search-start',
  searchComplete: 'tmyl-search-complete',
  searchError: 'tmyl-search-error',
  filtersToggle: 'tmyl-filters-toggle',
  viewModeChange: 'tmyl-view-mode-change',
  selectionChange: 'tmyl-selection-change',
  selectionClear: 'tmyl-selection-clear',
  contentAction: 'tmyl-content-action',
  bulkAction: 'tmyl-bulk-action'
};
