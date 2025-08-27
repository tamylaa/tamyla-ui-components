/**
 * Molecule Factory
 * Convenience factory function for creating molecular components
 */
export function MoleculeFactory(type: any, props?: {}, id?: null): any;
/**
 * Global molecular factory registry
 */
export const molecularRegistry: MolecularFactoryRegistry;
export namespace MolecularTemplates {
    function searchInterface(props?: {}): {
        render: (targetContainer?: any) => any;
        updateResults: (results: any) => void;
        destroy: () => void;
        getElement: () => any;
    };
    function contentBrowser(props?: {}): {
        render: (targetContainer?: any) => any;
        updateItems: (newItems: any) => void;
        destroy: () => void;
        getElement: () => any;
    };
    function mediaGallery(props?: {}): {
        render: (targetContainer?: any) => any;
        updateResults: (results: any) => void;
        destroy: () => void;
        getElement: () => any;
    };
    function documentExplorer(props?: {}): {
        render: (targetContainer?: any) => any;
        updateItems: (newItems: any) => void;
        destroy: () => void;
        getElement: () => any;
    };
}
export namespace MolecularComposition {
    /**
     * Create complex molecular layouts
     */
    function createLayout(config: any): {
        element: HTMLDivElement;
        instances: any;
        destroy(): void;
    };
    /**
     * Create responsive molecular grid
     */
    function createResponsiveGrid(components: any, options?: {}): {
        element: HTMLDivElement;
        instances: any;
        destroy(): void;
    };
}
export default MoleculeFactory;
/**
 * Molecular Factory Registry
 * Central registry for all molecular component factories
 */
declare class MolecularFactoryRegistry {
    factories: Map<any, any>;
    instances: Map<any, any>;
    /**
     * Register default molecular factories
     */
    registerDefaults(): void;
    /**
     * Register a molecular factory
     */
    register(name: any, factory: any): this;
    /**
     * Create molecular component instance
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
import { SearchBarFactory } from './search-bar/search-bar-system.js';
import { ContentCardFactory } from './content-card/content-card-system.js';
import { ContentCardGridFactory } from './content-card/content-card-system.js';
import { ContentCardTemplates } from './content-card/content-card-system.js';
export { SearchBarFactory, ContentCardFactory, ContentCardGridFactory, ContentCardTemplates };
//# sourceMappingURL=molecule-factory.d.ts.map