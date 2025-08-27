/**
 * Search Interface Factory
 * Creates complete search interface organisms with molecular composition
 */
export function SearchInterfaceFactory(props?: {}): {
    render: (targetContainer?: any) => any;
    update: (newProps: any) => void;
    destroy: () => void;
    search: (query: any, filters?: {}) => void;
    clear: () => void;
    getResults: () => any;
    getSelection: () => any;
    getState: () => any;
    getElement: () => any;
    getController: () => any;
    readonly props: {
        title: any;
        description: any;
        searchProps: any;
        filters: any;
        initialQuery: any;
        initialFilters: any;
        showHeader: any;
        showFilters: any;
        showResultsActions: any;
        layout: any;
        size: any;
        className: any;
    };
};
export namespace SearchInterfaceTemplates {
    function simple(props?: {}): {
        render: (targetContainer?: any) => any;
        update: (newProps: any) => void;
        destroy: () => void;
        search: (query: any, filters?: {}) => void;
        clear: () => void;
        getResults: () => any;
        getSelection: () => any;
        getState: () => any;
        getElement: () => any;
        getController: () => any;
        readonly props: {
            title: any;
            description: any;
            searchProps: any;
            filters: any;
            initialQuery: any;
            initialFilters: any;
            showHeader: any;
            showFilters: any;
            showResultsActions: any;
            layout: any;
            size: any;
            className: any;
        };
    };
    function advanced(props?: {}): {
        render: (targetContainer?: any) => any;
        update: (newProps: any) => void;
        destroy: () => void;
        search: (query: any, filters?: {}) => void;
        clear: () => void;
        getResults: () => any;
        getSelection: () => any;
        getState: () => any;
        getElement: () => any;
        getController: () => any;
        readonly props: {
            title: any;
            description: any;
            searchProps: any;
            filters: any;
            initialQuery: any;
            initialFilters: any;
            showHeader: any;
            showFilters: any;
            showResultsActions: any;
            layout: any;
            size: any;
            className: any;
        };
    };
    function dashboard(props?: {}): {
        render: (targetContainer?: any) => any;
        update: (newProps: any) => void;
        destroy: () => void;
        search: (query: any, filters?: {}) => void;
        clear: () => void;
        getResults: () => any;
        getSelection: () => any;
        getState: () => any;
        getElement: () => any;
        getController: () => any;
        readonly props: {
            title: any;
            description: any;
            searchProps: any;
            filters: any;
            initialQuery: any;
            initialFilters: any;
            showHeader: any;
            showFilters: any;
            showResultsActions: any;
            layout: any;
            size: any;
            className: any;
        };
    };
    function media(props?: {}): {
        render: (targetContainer?: any) => any;
        update: (newProps: any) => void;
        destroy: () => void;
        search: (query: any, filters?: {}) => void;
        clear: () => void;
        getResults: () => any;
        getSelection: () => any;
        getState: () => any;
        getElement: () => any;
        getController: () => any;
        readonly props: {
            title: any;
            description: any;
            searchProps: any;
            filters: any;
            initialQuery: any;
            initialFilters: any;
            showHeader: any;
            showFilters: any;
            showResultsActions: any;
            layout: any;
            size: any;
            className: any;
        };
    };
    function documents(props?: {}): {
        render: (targetContainer?: any) => any;
        update: (newProps: any) => void;
        destroy: () => void;
        search: (query: any, filters?: {}) => void;
        clear: () => void;
        getResults: () => any;
        getSelection: () => any;
        getState: () => any;
        getElement: () => any;
        getController: () => any;
        readonly props: {
            title: any;
            description: any;
            searchProps: any;
            filters: any;
            initialQuery: any;
            initialFilters: any;
            showHeader: any;
            showFilters: any;
            showResultsActions: any;
            layout: any;
            size: any;
            className: any;
        };
    };
    function content(props?: {}): {
        render: (targetContainer?: any) => any;
        update: (newProps: any) => void;
        destroy: () => void;
        search: (query: any, filters?: {}) => void;
        clear: () => void;
        getResults: () => any;
        getSelection: () => any;
        getState: () => any;
        getElement: () => any;
        getController: () => any;
        readonly props: {
            title: any;
            description: any;
            searchProps: any;
            filters: any;
            initialQuery: any;
            initialFilters: any;
            showHeader: any;
            showFilters: any;
            showResultsActions: any;
            layout: any;
            size: any;
            className: any;
        };
    };
}
export namespace SearchInterfaceComposition {
    /**
     * Create multi-tabbed search interface
     */
    function createTabbedSearch(tabs: any, options?: {}): {
        element: HTMLDivElement;
        interfaces: any;
        switchTab: (index: any) => void;
        destroy(): void;
    };
    /**
     * Create search interface with side filters
     */
    function createSideFilterSearch(props?: {}): {
        render: (targetContainer?: any) => any;
        update: (newProps: any) => void;
        destroy: () => void;
        search: (query: any, filters?: {}) => void;
        clear: () => void;
        getResults: () => any;
        getSelection: () => any;
        getState: () => any;
        getElement: () => any;
        getController: () => any;
        readonly props: {
            title: any;
            description: any;
            searchProps: any;
            filters: any;
            initialQuery: any;
            initialFilters: any;
            showHeader: any;
            showFilters: any;
            showResultsActions: any;
            layout: any;
            size: any;
            className: any;
        };
    };
    /**
     * Create unified search across multiple sources
     */
    function createUnifiedSearch(sources: any, options?: {}): {
        render: (targetContainer?: any) => any;
        update: (newProps: any) => void;
        destroy: () => void;
        search: (query: any, filters?: {}) => void;
        clear: () => void;
        getResults: () => any;
        getSelection: () => any;
        getState: () => any;
        getElement: () => any;
        getController: () => any;
        readonly props: {
            title: any;
            description: any;
            searchProps: any;
            filters: any;
            initialQuery: any;
            initialFilters: any;
            showHeader: any;
            showFilters: any;
            showResultsActions: any;
            layout: any;
            size: any;
            className: any;
        };
    };
}
export { searchInterfaceUtils };
export default SearchInterfaceFactory;
import { searchInterfaceUtils } from './controllers/search-interface-controller.js';
//# sourceMappingURL=search-interface-system.d.ts.map