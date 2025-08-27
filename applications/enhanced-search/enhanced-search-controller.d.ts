/**
 * Enhanced Search Application Controller
 * Manages all application-level interactions and business logic
 */
export class EnhancedSearchController {
    constructor(element: any, options?: {});
    element: any;
    options: {
        meilisearchUrl: string;
        apiBase: string;
        voiceEnabled: boolean;
        naturalLanguage: boolean;
        smartFilters: boolean;
        recentSearches: boolean;
        searchSuggestions: boolean;
        placeholder: string;
        layout: string;
        viewMode: string;
        perPage: number;
        enableAnalytics: boolean;
        enableAutoComplete: boolean;
        enableExport: boolean;
    };
    state: {
        query: string;
        results: never[];
        filters: {};
        sorting: string;
        viewMode: string;
        currentPage: number;
        totalPages: number;
        totalResults: number;
        isLoading: boolean;
        error: null;
        searchTime: number;
        recentSearches: any;
        selectedItems: Set<any>;
        analytics: {
            searchCount: number;
            totalSearchTime: number;
            popularTerms: Map<any, any>;
        };
    };
    searchInterface: any;
    searchAPI: {
        search: (query: any, options?: {}) => Promise<any>;
        advancedSearch: (searchRequest: any) => Promise<any>;
        getSuggestions: (query: any) => Promise<any>;
    } | null;
    boundHandlers: {
        handleSearch: (searchData: any) => Promise<void>;
        handleViewModeChange: (event: any) => void;
        handleSortChange: (event: any) => void;
        handlePageChange: (event: any) => void;
        handleFilterChange: (filterData: any) => void;
        handleContentSelection: (selectionData: any) => void;
        handleBulkAction: (event: any) => void;
        handleRecentSearchClick: (event: any) => void;
        handleKeyboardNavigation: (event: any) => void;
        handleExport: (event: any) => Promise<void>;
    };
    /**
     * Initialize the controller
     */
    initialize(): Promise<void>;
    /**
     * Initialize search API
     */
    initializeSearchAPI(): Promise<void>;
    /**
     * Setup organism components
     */
    setupOrganismComponents(): void;
    /**
     * Setup results display
     */
    setupResultsDisplay(container: any): void;
    resultsContainer: any;
    /**
     * Setup filters display
     */
    setupFiltersDisplay(container: any): void;
    filtersContainer: any;
    /**
     * Setup event listeners
     */
    setupEventListeners(): void;
    /**
     * Setup keyboard navigation
     */
    setupKeyboardNavigation(): void;
    /**
     * Handle keyboard navigation
     */
    handleKeyboardNavigation(event: any): void;
    /**
     * Handle result navigation with keyboard
     */
    handleResultNavigation(event: any): void;
    /**
     * Calculate items per row for grid navigation
     */
    calculateItemsPerRow(): number;
    /**
     * Handle search execution
     */
    handleSearch(searchData: any): Promise<void>;
    /**
     * Perform search operation
     */
    performSearch(query: any): Promise<void>;
    /**
     * Check if query requires advanced search
     */
    isAdvancedQuery(query: any): boolean;
    /**
     * Update search results display
     */
    updateSearchResults(results: any): void;
    /**
     * Update results display
     */
    updateResultsDisplay(): void;
    /**
     * Mount organism components for results
     */
    mountResultsOrganisms(): void;
    /**
     * Create content card grid
     */
    createContentCardGrid(container: any): void;
    contentGrid: any;
    /**
     * Create content card list
     */
    createContentCardList(container: any): void;
    contentList: any;
    /**
     * Handle view mode change
     */
    handleViewModeChange(event: any): void;
    /**
     * Handle sort change
     */
    handleSortChange(event: any): void;
    /**
     * Handle page change
     */
    handlePageChange(event: any): void;
    /**
     * Handle filter change
     */
    handleFilterChange(filterData: any): void;
    /**
     * Handle content selection
     */
    handleContentSelection(selectionData: any): void;
    /**
     * Handle content action
     */
    handleContentAction(actionData: any): void;
    /**
     * Handle bulk action
     */
    handleBulkAction(event: any): void;
    /**
     * Handle recent search click
     */
    handleRecentSearchClick(event: any): void;
    /**
     * Handle suggestion request
     */
    handleSuggestionRequest(query: any): Promise<any>;
    /**
     * Handle export
     */
    handleExport(event: any): Promise<void>;
    /**
     * Export as CSV
     */
    exportAsCSV(items: any): Promise<void>;
    /**
     * Export as JSON
     */
    exportAsJSON(items: any): Promise<void>;
    /**
     * Download file helper
     */
    downloadFile(content: any, filename: any, mimeType: any): void;
    /**
     * Update pagination display
     */
    updatePagination(): void;
    /**
     * Update filters from search results
     */
    updateFiltersFromResults(results: any): void;
    /**
     * Create filter group
     */
    createFilterGroup(key: any, values: any): string;
    /**
     * Format filter key for display
     */
    formatFilterKey(key: any): any;
    /**
     * Setup filter event listeners
     */
    setupFilterEventListeners(): void;
    /**
     * Update bulk action controls
     */
    updateBulkActionControls(): void;
    /**
     * Update analytics
     */
    updateAnalytics(query: any, searchTime: any, resultCount: any): void;
    /**
     * Send analytics data
     */
    sendAnalytics(data: any): Promise<void>;
    /**
     * Save recent search
     */
    saveRecentSearch(query: any): void;
    /**
     * Load recent searches
     */
    loadRecentSearches(): any;
    /**
     * Update recent searches display
     */
    updateRecentSearchesDisplay(): void;
    /**
     * Load initial data
     */
    loadInitialData(): Promise<void>;
    /**
     * Utility methods
     */
    setLoadingState(loading: any, message?: string): void;
    clearResults(): void;
    handleError(error: any): void;
    retryLastSearch(): void;
    focusSearchInput(): void;
    selectAllResults(): void;
    getAuthToken(): string;
    showMessage(message: any, type?: string): void;
    /**
     * Content action methods
     */
    viewContent(item: any): void;
    downloadContent(item: any): void;
    shareContent(item: any): void;
    editContent(item: any): void;
    downloadMultipleItems(items: any): void;
    shareMultipleItems(items: any): void;
    deleteMultipleItems(items: any): Promise<void>;
    /**
     * Event system
     */
    emit(eventName: any, data: any): void;
    on(eventName: any, handler: any): void;
    off(eventName: any, handler: any): void;
    /**
     * Public API methods
     */
    search(query: any, options?: {}): Promise<void>;
    setFilters(filters: any): void;
    getState(): {
        query: string;
        results: never[];
        filters: {};
        sorting: string;
        viewMode: string;
        currentPage: number;
        totalPages: number;
        totalResults: number;
        isLoading: boolean;
        error: null;
        searchTime: number;
        recentSearches: any;
        selectedItems: Set<any>;
        analytics: {
            searchCount: number;
            totalSearchTime: number;
            popularTerms: Map<any, any>;
        };
    };
    getResults(): never[];
    getSelectedItems(): any[];
    clearSelection(): void;
    /**
     * Cleanup
     */
    destroy(): void;
}
export namespace EnhancedSearchControllerUtils {
    /**
     * Create controller with error handling
     */
    function createController(element: any, options?: {}): EnhancedSearchController;
    /**
     * Validate controller options
     */
    function validateOptions(options: any): string[];
    /**
     * Get default options
     */
    function getDefaultOptions(): {
        meilisearchUrl: string;
        apiBase: string;
        voiceEnabled: boolean;
        naturalLanguage: boolean;
        smartFilters: boolean;
        recentSearches: boolean;
        searchSuggestions: boolean;
        placeholder: string;
        layout: string;
        viewMode: string;
        perPage: number;
        enableAnalytics: boolean;
        enableAutoComplete: boolean;
        enableExport: boolean;
    };
}
export default EnhancedSearchController;
//# sourceMappingURL=enhanced-search-controller.d.ts.map