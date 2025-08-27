/**
 * Content Filter Service
 * Advanced content filtering engine with React-inspired patterns
 */
export class ContentFilterEngine {
    filters: {
        contentType: string;
        performance: string;
        recency: string;
        topics: never[];
        tags: never[];
    };
    /**
     * Apply multi-dimensional filtering
     * Inspired by React filtering patterns in legacy components
     */
    applyFilters(content: any, filters?: {
        contentType: string;
        performance: string;
        recency: string;
        topics: never[];
        tags: never[];
    }): any[];
    getRecencyCutoff(recency: any): any;
    updateFilter(filterName: any, value: any): {
        contentType: string;
        performance: string;
        recency: string;
        topics: never[];
        tags: never[];
    };
    getFilterOptions(): {
        contentType: {
            value: string;
            label: string;
        }[];
        performance: {
            value: string;
            label: string;
        }[];
        recency: {
            value: string;
            label: string;
        }[];
    };
    getPerformanceLevel(score: any): {
        level: string;
        label: string;
    };
}
//# sourceMappingURL=content-filter-engine.d.ts.map