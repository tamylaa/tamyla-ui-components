/**
 * Unified Component Factory
 * Single entry point for creating any component
 */
export function TamylaFactory(layer: any, type: any, props?: {}, id?: null): any;
/**
 * Global UI system registry
 */
export const tamylaUISystem: TamylaUISystemRegistry;
export namespace Tamyla {
    function Atom(type: any, props: any, id: any): any;
    function Button(props: any, id: any): any;
    function Input(props: any, id: any): any;
    function Card(props: any, id: any): any;
    function Molecule(type: any, props: any, id: any): any;
    function SearchBar(props: any, id: any): any;
    function ContentCard(props: any, id: any): any;
    function ContentGrid(props: any, id: any): any;
    function Organism(type: any, props: any, id: any): any;
    function SearchInterface(props: any, id: any): any;
    function Application(type: any, props: any, id: any): any;
    function EnhancedSearch(props: any, id: any): any;
    function ContentManager(props: any, id: any): any;
}
export namespace TamylaTemplates {
    function searchPage(props?: {}): any;
    function contentDashboard(props?: {}): any;
    function searchWidget(props?: {}): any;
    function mediaGallery(props?: {}): any;
    function knowledgeBase(props?: {}): any;
}
export namespace TamylaUtils {
    /**
     * Initialize design system with global styles
     */
    function init(options?: {}): void;
    /**
     * Inject CSS variables for design tokens
     */
    function injectCSSVariables(container?: HTMLHeadElement): void;
    /**
     * Inject global styles
     */
    function injectGlobalStyles(container?: HTMLHeadElement): void;
    /**
     * Create responsive grid layout
     */
    function createResponsiveGrid(items: any, options?: {}): HTMLDivElement;
    /**
     * Cleanup all system resources
     */
    function cleanup(): void;
    /**
     * Get system statistics
     */
    function getStats(): {
        layers: string[];
        instances: number;
        byLayer: {
            atoms: number;
            molecules: number;
            organisms: number;
            applications: number;
        };
    };
}
export default Tamyla;
/**
 * Tamyla UI System Registry
 * Central registry for all component factories across all layers
 */
declare class TamylaUISystemRegistry {
    layers: {
        atoms: {};
        molecules: {
            factories: Map<any, any>;
            instances: Map<any, any>;
            registerDefaults(): void;
            register(name: any, factory: any): any;
            create(type: any, props?: {}, id?: null): any;
            getFactory(type: any): any;
            getInstance(id: any): any;
            getTypes(): any[];
            destroyInstance(id: any): void;
            destroyAll(): void;
        };
        organisms: {
            factories: Map<any, any>;
            instances: Map<any, any>;
            registerDefaults(): void;
            register(name: any, factory: any): any;
            create(type: any, props?: {}, id?: null): any;
            getFactory(type: any): any;
            getInstance(id: any): any;
            getTypes(): any[];
            destroyInstance(id: any): void; /**
             * Create component from any layer
             */
            destroyAll(): void;
        };
        applications: Map<any, any>;
    };
    instances: Map<any, any>;
    /**
     * Register application factories
     */
    registerApplications(): void;
    /**
     * Create component from any layer
     */
    create(layer: any, type: any, props?: {}, id?: null): any;
    /**
     * Get component instance by ID
     */
    getInstance(id: any): any;
    /**
     * Get all instances of a layer
     */
    getLayerInstances(layer: any): any[];
    /**
     * Destroy instance
     */
    destroyInstance(id: any): void;
    /**
     * Destroy all instances
     */
    destroyAll(): void;
    /**
     * Get available component types for a layer
     */
    getTypes(layer: any): any;
}
import { AtomFactory } from './atoms/atom-factory.js';
import { ButtonFactory } from './atoms/button/button-system.js';
import { InputFactory } from './atoms/input/input-system.js';
import { CardFactory } from './atoms/card/card-system.js';
import { MoleculeFactory } from './molecules/molecule-factory.js';
import { SearchBarFactory } from './molecules/search-bar/search-bar-system.js';
import { ContentCardFactory } from './molecules/content-card/content-card-system.js';
import { ContentCardGridFactory } from './molecules/content-card/content-card-system.js';
import { OrganismFactory } from './organisms/organism-factory.js';
import { SearchInterfaceFactory } from './organisms/search-interface/search-interface-system.js';
import { EnhancedSearchApplicationFactory } from './applications/index.js';
import { ContentManagerApplicationFactory } from './applications/index.js';
import { atomicRegistry } from './atoms/atom-factory.js';
import { molecularRegistry } from './molecules/molecule-factory.js';
import { organismRegistry } from './organisms/organism-factory.js';
export { AtomFactory, ButtonFactory, InputFactory, CardFactory, MoleculeFactory, SearchBarFactory, ContentCardFactory, ContentCardGridFactory, OrganismFactory, SearchInterfaceFactory, EnhancedSearchApplicationFactory, ContentManagerApplicationFactory, atomicRegistry, molecularRegistry, organismRegistry };
//# sourceMappingURL=tamyla-ui-system.d.ts.map