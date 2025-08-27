export function createSearchInterfaceController(element: any, options?: {}): {
    getState: () => {
        query: any;
        filters: any;
        results: never[];
        totalCount: number;
        currentPage: number;
        loading: boolean;
        error: null;
        selectedItems: Set<any>;
        sortBy: string;
        sortOrder: string;
        viewMode: string;
    };
    getResults: () => never[];
    getSelection: () => any[];
    search: (query: any) => void;
    setFilters: (filters: any) => void;
    clearFilters: () => void;
    refresh: () => Promise<void>;
    selectAll: () => void;
    clearSelection: () => void;
    destroy: () => void;
};
export namespace searchInterfaceUtils {
    /**
     * Create search API wrapper
     */
    function createSearchAPI(baseURL: any, options?: {}): (params: any) => Promise<any>;
    /**
     * Create local search function
     */
    function createLocalSearch(data: any): (params: any) => Promise<{
        results: any[];
        totalCount: number;
    }>;
}
//# sourceMappingURL=search-interface-controller.d.ts.map