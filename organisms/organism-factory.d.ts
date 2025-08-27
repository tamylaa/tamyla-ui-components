/**
 * Organism Factory
 * Convenience factory function for creating organism components
 */
export function OrganismFactory(type: any, props?: {}, id?: null): any;
/**
 * Global organism factory registry
 */
export const organismRegistry: OrganismFactoryRegistry;
export namespace OrganismTemplates {
    function searchPage(props?: {}): any;
    function contentDashboard(props?: {}): {
        render: (targetContainer?: any) => any;
        destroy: () => void;
        getElement: () => any;
        getSearchInterface: () => any;
    };
    function knowledgeExplorer(props?: {}): any;
    function mediaLibrary(props?: {}): any;
}
export namespace OrganismComposition {
    /**
     * Create multi-organism application layout
     */
    function createApplicationLayout(config: any): {
        element: HTMLDivElement;
        instances: any;
        destroy(): void;
    };
    /**
     * Create responsive organism grid
     */
    function createResponsiveOrganismGrid(organisms: any, options?: {}): {
        element: HTMLDivElement;
        instances: any;
        destroy(): void;
    };
    /**
     * Create tabbed organism interface
     */
    function createTabbedInterface(tabs: any, options?: {}): {
        element: HTMLDivElement;
        organisms: any;
        switchTab: (index: any) => void;
        destroy(): void;
    };
}
export default OrganismFactory;
/**
 * Organism Factory Registry
 * Central registry for all organism component factories
 */
declare class OrganismFactoryRegistry {
    factories: Map<any, any>;
    instances: Map<any, any>;
    /**
     * Register default organism factories
     */
    registerDefaults(): void;
    /**
     * Register an organism factory
     */
    register(name: any, factory: any): this;
    /**
     * Create organism component instance
     */
    create(type: any, props?: {}, id?: null): any;
    /**
     * Get registered factory
     */
    getFactory(type: any): any;
    /**
     * Get created instance
     */
    getInstance(id: any): any;
    /**
     * List all registered types
     */
    getTypes(): any[];
    /**
     * Destroy instance
     */
    destroyInstance(id: any): void;
    /**
     * Destroy all instances
     */
    destroyAll(): void;
}
import { SearchInterfaceFactory } from './search-interface/search-interface-system.js';
import { SearchInterfaceTemplates } from './search-interface/search-interface-system.js';
export { SearchInterfaceFactory, SearchInterfaceTemplates };
//# sourceMappingURL=organism-factory.d.ts.map