export class CampaignSelectorSystem {
    constructor(options?: {});
    options: {
        maxSelections: number;
        showPerformanceInsights: boolean;
        enableRecommendations: boolean;
        enableTemplates: boolean;
    };
    container: any;
    data: {
        content: never[];
        templates: never[];
        contentTypes: string[];
        performanceLevels: string[];
    };
    state: {
        currentTab: string;
        loading: boolean;
        contentLoaded: boolean;
    };
    analytics: CampaignAnalytics;
    filterEngine: ContentFilterEngine;
    selectionManager: SelectionManager;
    templates: any;
    controller: CampaignSelectorController;
    initialize(): void;
    setupEventListeners(): void;
    loadInitialData(): Promise<void>;
    loadContent(): Promise<{
        id: string;
        title: string;
        type: string;
        performance: string;
        engagement: number;
        reach: number;
        thumbnail: string;
        publishDate: string;
        author: string;
    }[]>;
    loadTemplates(): Promise<{
        id: string;
        title: string;
        type: string;
        performance: string;
        engagement: number;
        reach: number;
        thumbnail: string;
        category: string;
    }[]>;
    render(container: any): void;
    renderLoadingState(): void;
    renderContent(content?: any[]): void;
    renderTemplates(templates?: any[]): void;
    renderRecommendations(): void;
    handleSelectionChange(selections: any): void;
    updateSelectionIndicators(): void;
    updateSelectionSummary(): void;
    setState(newState: any): void;
    showMessage(message: any, type?: string): void;
    on(event: any, callback: any): void;
    events: {} | undefined;
    emit(event: any, data: any): void;
    getSelectedContent(): any[];
    clearSelections(): void;
    addContent(newContent: any): void;
    updateFilters(filters: any): void;
    destroy(): void;
}
import { CampaignAnalytics } from './services/campaign-analytics.js';
import { ContentFilterEngine } from './services/content-filter-engine.js';
import { SelectionManager } from './services/selection-manager.js';
import { CampaignSelectorController } from './controllers/campaign-selector-controller.js';
//# sourceMappingURL=campaign-selector-system.d.ts.map