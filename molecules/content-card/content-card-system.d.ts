/**
 * Content Card Factory
 * Creates complete content card molecules with atomic composition
 */
export function ContentCardFactory(props?: {}): {
    render: (targetContainer?: any) => any;
    update: (newProps: any) => void;
    destroy: () => void;
    getElement: () => any;
    getController: () => any;
    readonly props: {
        content: any;
        variant: any;
        size: any;
        selectable: any;
        selected: any;
        disabled: any;
        loading: any;
        showActions: any;
        highlightTerms: any;
        className: any;
    };
};
/**
 * Content Card Grid Factory
 * Creates grids of content cards with management utilities
 */
export function ContentCardGridFactory(props?: {}): {
    render: (targetContainer?: any) => any;
    destroy: () => void;
    addItems: (newItems: any, position?: string) => void;
    removeItems: (itemIds: any) => void;
    filterCards: (predicate: any) => void;
    setHighlightTerms: (terms: any) => void;
    updateLayout: (newGridProps: any) => void;
    getSelection: () => any;
    getElement: () => any;
    getCards: () => Map<any, any>;
    getCard: (id: any) => any;
};
export namespace ContentCardTemplates {
    function searchResult(content: any, props?: {}): {
        render: (targetContainer?: any) => any;
        update: (newProps: any) => void;
        destroy: () => void;
        getElement: () => any;
        getController: () => any;
        readonly props: {
            content: any;
            variant: any;
            size: any;
            selectable: any;
            selected: any;
            disabled: any;
            loading: any;
            showActions: any;
            highlightTerms: any;
            className: any;
        };
    };
    function mediaPreview(content: any, props?: {}): {
        render: (targetContainer?: any) => any;
        update: (newProps: any) => void;
        destroy: () => void;
        getElement: () => any;
        getController: () => any;
        readonly props: {
            content: any;
            variant: any;
            size: any;
            selectable: any;
            selected: any;
            disabled: any;
            loading: any;
            showActions: any;
            highlightTerms: any;
            className: any;
        };
    };
    function listItem(content: any, props?: {}): {
        render: (targetContainer?: any) => any;
        update: (newProps: any) => void;
        destroy: () => void;
        getElement: () => any;
        getController: () => any;
        readonly props: {
            content: any;
            variant: any;
            size: any;
            selectable: any;
            selected: any;
            disabled: any;
            loading: any;
            showActions: any;
            highlightTerms: any;
            className: any;
        };
    };
    function widget(content: any, props?: {}): {
        render: (targetContainer?: any) => any;
        update: (newProps: any) => void;
        destroy: () => void;
        getElement: () => any;
        getController: () => any;
        readonly props: {
            content: any;
            variant: any;
            size: any;
            selectable: any;
            selected: any;
            disabled: any;
            loading: any;
            showActions: any;
            highlightTerms: any;
            className: any;
        };
    };
    function galleryItem(content: any, props?: {}): {
        render: (targetContainer?: any) => any;
        update: (newProps: any) => void;
        destroy: () => void;
        getElement: () => any;
        getController: () => any;
        readonly props: {
            content: any;
            variant: any;
            size: any;
            selectable: any;
            selected: any;
            disabled: any;
            loading: any;
            showActions: any;
            highlightTerms: any;
            className: any;
        };
    };
}
export namespace ContentCardHelpers {
    /**
     * Create content card from various data formats
     */
    function fromData(data: any, type?: string): any;
    /**
     * Batch create cards from data array
     */
    function fromDataArray(dataArray: any, type?: string, cardProps?: {}): any;
}
export default ContentCardFactory;
//# sourceMappingURL=content-card-system.d.ts.map