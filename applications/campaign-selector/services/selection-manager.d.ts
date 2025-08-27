/**
 * Selection Manager Service
 * Smart selection management with React-inspired patterns
 */
export class SelectionManager {
    constructor(maxSelections?: number);
    maxSelections: number;
    selectedContent: Map<any, any>;
    listeners: Set<any>;
    /**
     * Toggle selection with validation
     * Pattern inspired by legacy React components
     */
    toggleSelection(item: any): boolean;
    getSelectedItems(): any[];
    getSelectionSummary(): {
        count: number;
        maxCount: number;
        contentTypes: {};
        estimatedReach: number;
    };
    getContentTypeBreakdown(items: any): {};
    estimateReach(items: any): number;
    clearSelection(): void;
    isSelected(itemId: any): boolean;
    addListener(callback: any): () => boolean;
    notifyChange(): void;
    notifyError(message: any): void;
}
//# sourceMappingURL=selection-manager.d.ts.map