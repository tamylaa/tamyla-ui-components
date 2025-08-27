export class CampaignSelectorController {
    constructor(options?: {});
    options: {};
    element: any;
    currentTab: string;
    analytics: CampaignAnalytics;
    filterEngine: ContentFilterEngine;
    selectionManager: SelectionManager;
    /**
     * Handle tab switching
     */
    handleTabSwitch(event: any): void;
    /**
     * Handle filter changes
     */
    handleFilterChange(event: any): void;
    /**
     * Handle search results from enhanced search
     */
    handleSearchResults(results: any): void;
    /**
     * Handle selection changes
     */
    handleSelectionChange(event: any): void;
    /**
     * Handle content item selection
     */
    handleContentSelect(item: any): void;
    /**
     * Handle clear selection
     */
    handleClearSelection(): void;
    /**
     * Handle preview campaign
     */
    handlePreviewCampaign(): void;
    /**
     * Handle use selected content
     */
    handleUseContent(): void;
    /**
     * Initialize the controller with DOM element
     */
    init(element: any): void;
    /**
     * Setup event listeners for user interactions
     */
    setupEventListeners(): void;
    /**
     * Setup service integrations
     */
    setupServices(): void;
    /**
     * Load initial data for the application
     */
    loadInitialData(): Promise<void>;
    /**
     * Load content for specific tab
     */
    loadTabContent(tabName: any): Promise<void>;
    /**
     * Load AI recommendations
     */
    loadRecommendations(): Promise<void>;
    /**
     * Load campaign templates
     */
    loadTemplates(): Promise<void>;
    /**
     * Render content grid
     */
    renderContentGrid(content: any, containerId: any): void;
    /**
     * Render individual content card
     */
    renderContentCard(item: any, container: any): void;
    /**
     * Render filters section
     */
    renderFilters(): void;
    /**
     * Update selection display
     */
    updateSelectionDisplay(summary: any, selectedItems: any): void;
    /**
     * Apply current filters to displayed content
     */
    applyCurrentFilters(): void;
    /**
     * Utility methods
     */
    showLoading(containerId: any, message: any): void;
    showError(containerId: any, message: any): void;
    updateTabBadge(tabName: any, count: any): void;
    hasRecommendations(): any;
    formatDate(dateString: any): string;
    capitalizeFirst(str: any): any;
    notifyError(message: any): void;
    /**
     * Cleanup method
     */
    destroy(): void;
}
import { CampaignAnalytics } from '../services/campaign-analytics.js';
import { ContentFilterEngine } from '../services/content-filter-engine.js';
import { SelectionManager } from '../services/selection-manager.js';
//# sourceMappingURL=campaign-selector-controller.d.ts.map