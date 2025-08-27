/**
 * Enhanced Search Application Factory
 * Creates complete, feature-rich search applications with atomic design composition
 */
export function EnhancedSearchApplicationFactory(props?: {}): {
    element: HTMLDivElement;
    controller: EnhancedSearchController;
    mount: (targetContainer: any) => void;
    unmount: () => void;
    destroy: () => void;
    search: (query: any, options?: {}) => any;
    setFilters: (filters: any) => any;
    getState: () => any;
    getResults: () => any;
    on: (eventName: any, handler: any) => void;
    off: (eventName: any, handler: any) => void;
};
export namespace EnhancedSearchPresets {
    /**
     * Standard search application
     */
    function standard(props?: {}): {
        element: HTMLDivElement;
        controller: EnhancedSearchController;
        mount: (targetContainer: any) => void;
        unmount: () => void;
        destroy: () => void;
        search: (query: any, options?: {}) => any;
        setFilters: (filters: any) => any;
        getState: () => any;
        getResults: () => any;
        on: (eventName: any, handler: any) => void;
        off: (eventName: any, handler: any) => void;
    };
    /**
     * Advanced search application with all features
     */
    function advanced(props?: {}): {
        element: HTMLDivElement;
        controller: EnhancedSearchController;
        mount: (targetContainer: any) => void;
        unmount: () => void;
        destroy: () => void;
        search: (query: any, options?: {}) => any;
        setFilters: (filters: any) => any;
        getState: () => any;
        getResults: () => any;
        on: (eventName: any, handler: any) => void;
        off: (eventName: any, handler: any) => void;
    };
    /**
     * Minimal search application
     */
    function minimal(props?: {}): {
        element: HTMLDivElement;
        controller: EnhancedSearchController;
        mount: (targetContainer: any) => void;
        unmount: () => void;
        destroy: () => void;
        search: (query: any, options?: {}) => any;
        setFilters: (filters: any) => any;
        getState: () => any;
        getResults: () => any;
        on: (eventName: any, handler: any) => void;
        off: (eventName: any, handler: any) => void;
    };
    /**
     * Corporate/enterprise search application
     */
    function enterprise(props?: {}): {
        element: HTMLDivElement;
        controller: EnhancedSearchController;
        mount: (targetContainer: any) => void;
        unmount: () => void;
        destroy: () => void;
        search: (query: any, options?: {}) => any;
        setFilters: (filters: any) => any;
        getState: () => any;
        getResults: () => any;
        on: (eventName: any, handler: any) => void;
        off: (eventName: any, handler: any) => void;
    };
    /**
     * Mobile-optimized search application
     */
    function mobile(props?: {}): {
        element: HTMLDivElement;
        controller: EnhancedSearchController;
        mount: (targetContainer: any) => void;
        unmount: () => void;
        destroy: () => void;
        search: (query: any, options?: {}) => any;
        setFilters: (filters: any) => any;
        getState: () => any;
        getResults: () => any;
        on: (eventName: any, handler: any) => void;
        off: (eventName: any, handler: any) => void;
    };
}
/**
 * Enhanced Search Application Manager
 * Manages multiple search application instances
 */
export class EnhancedSearchApplicationManager {
    applications: Map<any, any>;
    defaultContainer: any;
    /**
     * Create and register application
     */
    create(id: any, props?: {}): {
        element: HTMLDivElement;
        controller: EnhancedSearchController;
        mount: (targetContainer: any) => void;
        unmount: () => void;
        destroy: () => void;
        search: (query: any, options?: {}) => any;
        setFilters: (filters: any) => any;
        getState: () => any;
        getResults: () => any;
        on: (eventName: any, handler: any) => void;
        off: (eventName: any, handler: any) => void;
    };
    /**
     * Get application by id
     */
    get(id: any): any;
    /**
     * Remove application
     */
    remove(id: any): boolean;
    /**
     * Get all applications
     */
    getAll(): any[];
    /**
     * Set default container for new applications
     */
    setDefaultContainer(container: any): void;
    /**
     * Create application with auto-generated id
     */
    createAuto(props?: {}): {
        element: HTMLDivElement;
        controller: EnhancedSearchController;
        mount: (targetContainer: any) => void;
        unmount: () => void;
        destroy: () => void;
        search: (query: any, options?: {}) => any;
        setFilters: (filters: any) => any;
        getState: () => any;
        getResults: () => any;
        on: (eventName: any, handler: any) => void;
        off: (eventName: any, handler: any) => void;
    };
    /**
     * Destroy all applications
     */
    destroyAll(): void;
    /**
     * Get application statistics
     */
    getStats(): {
        totalApplications: number;
        totalSearches: any;
        averageResults: number;
    };
}
export namespace EnhancedSearchApplicationUtils {
    /**
     * Validate application configuration
     */
    function validateConfig(config: any): string[];
    /**
     * Get recommended configuration for use case
     */
    function getRecommendedConfig(useCase: any): any;
    /**
     * Auto-detect optimal configuration
     */
    function autoDetectConfig(container: any): {
        showSidebar: boolean;
        layout: string;
        viewMode: string;
        perPage: number;
        darkMode: boolean;
        voiceEnabled: boolean;
        keyboardShortcuts: boolean;
    };
    /**
     * Performance monitoring
     */
    function createPerformanceMonitor(app: any): {
        getStats: () => {
            averageSearchTime: number;
            totalSearches: number;
            errorRate: number;
        };
        reset: () => void;
    };
}
export const searchApplicationManager: EnhancedSearchApplicationManager;
export default EnhancedSearchApplicationFactory;
import { EnhancedSearchController } from './enhanced-search-controller.js';
//# sourceMappingURL=enhanced-search-system.d.ts.map