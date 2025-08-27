export function createContentCardController(element: any, options?: {}): {
    getState: () => {
        selected: boolean;
        disabled: boolean;
        loading: boolean;
        highlightTerms: never[];
        interacted: boolean;
        visible: boolean;
        mediaLoaded: boolean;
    };
    setSelected: (selected: any) => void;
    setDisabled: (disabled: any) => void;
    setLoading: (loading: any) => void;
    setHighlightTerms: (terms: any) => void;
    toggleSelection: () => void;
    destroy: () => void;
};
export namespace contentCardUtils {
    /**
     * Create selection manager for multiple cards
     */
    function createSelectionManager(cards: any, options?: {}): {
        selectCard(cardId: any): void;
        deselectCard(cardId: any): void;
        toggleCard(cardId: any): void;
        selectAll(): void;
        deselectAll(): void;
        getSelection(): any[];
        updateUI(): void;
    };
    /**
     * Create keyboard navigation for card grids
     */
    function createGridNavigation(container: any, options?: {}): {
        focusCard: (index: any) => void;
        getCurrentIndex: () => number;
        getCardCount: () => number;
    };
}
//# sourceMappingURL=content-card-controller.d.ts.map