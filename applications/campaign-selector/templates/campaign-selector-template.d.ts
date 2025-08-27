export function createCampaignSelectorTemplate(campaignType: any, maxSelections: any): string;
/**
 * Template function
 */
export function CampaignSelectorTemplate(props?: {}): string;
export namespace campaignSelectorTemplates {
    /**
     * Create main header template
     */
    function createHeader(campaignType: any): string;
    /**
     * Create tabs container template
     */
    function createTabsContainer(): string;
    /**
     * Create search tab content template
     */
    function createSearchTab(): string;
    /**
     * Create recommendations tab content template
     */
    function createRecommendationsTab(): string;
    /**
     * Create templates tab content template
     */
    function createTemplatesTab(): string;
    /**
     * Create filter group template
     */
    function createFilterGroup(filter: any): string;
    /**
     * Create selection summary template
     */
    function createSelectionSummary(maxSelections: any): string;
    /**
     * Create selected item template
     */
    function createSelectedItem(item: any, performanceLevel: any): string;
    /**
     * Create selection insights template
     */
    function createSelectionInsights(summary: any): string;
    /**
     * Create empty state template
     */
    function createEmptyState(title?: string, message?: string): string;
    /**
     * Create loading state template
     */
    function createLoadingState(message?: string): string;
    /**
     * Utility: Get content icon
     */
    function getContentIcon(category: any): any;
}
//# sourceMappingURL=campaign-selector-template.d.ts.map