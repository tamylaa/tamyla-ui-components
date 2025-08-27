export namespace EnhancedSearchTemplates {
    /**
     * Main application template
     */
    function application(props?: {}): string;
    /**
     * Header section template
     */
    function header(props?: {}): string;
    /**
     * Breadcrumbs template
     */
    function breadcrumbs(breadcrumbs?: any[]): string;
    /**
     * Sidebar template
     */
    function sidebar(props?: {}): string;
    /**
     * Filters section template
     */
    function filtersSection(props?: {}): string;
    /**
     * Recent searches section template
     */
    function recentSearchesSection(props?: {}): string;
    /**
     * Saved searches section template
     */
    function savedSearchesSection(props?: {}): string;
    /**
     * Custom section template
     */
    function customSection(section?: {}): string;
    /**
     * Main content area template
     */
    function main(props?: {}): string;
    /**
     * Controls section template
     */
    function controls(props?: {}): string;
    /**
     * Export controls template
     */
    function exportControls(): string;
    /**
     * Results container template
     */
    function resultsContainer(props?: {}): string;
    /**
     * Results header template
     */
    function resultsHeader(props?: {}): string;
    /**
     * Loading state template
     */
    function loadingState(props?: {}): string;
    /**
     * Empty state template
     */
    function emptyState(props?: {}): string;
    /**
     * Error state template
     */
    function errorState(props?: {}): string;
    /**
     * Pagination template
     */
    function pagination(props?: {}): string;
    /**
     * Generate page numbers for pagination with ellipsis
     */
    function generatePageNumbers(currentPage: any, totalPages: any): any[];
    /**
     * Analytics section template
     */
    function analytics(props?: {}): string;
    /**
     * Analytics details template
     */
    function analyticsDetails(stats?: {}): string;
    /**
     * Footer template
     */
    function footer(props?: {}): string;
    /**
     * Footer stats template
     */
    function footerStats(props?: {}): string;
}
export namespace EnhancedSearchTemplateUtils {
    /**
     * Create template with proper accessibility
     */
    function createAccessibleTemplate(templateHtml: any, options?: {}): any;
    /**
     * Sanitize content for safe HTML insertion
     */
    function sanitizeContent(content: any): string;
    /**
     * Generate unique IDs for template elements
     */
    function generateId(prefix?: string): string;
    /**
     * Validate template props
     */
    function validateProps(props: any, schema: any): string[];
}
export default EnhancedSearchTemplates;
//# sourceMappingURL=enhanced-search-template.d.ts.map