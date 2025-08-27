/**
 * Search Bar Factory - Creates search-bar molecules with full atomic composition
 */
export class SearchBarFactory {
    defaultProps: {
        placeholder: string;
        size: string;
        variant: string;
        disabled: boolean;
        loading: boolean;
        voiceEnabled: boolean;
        clearable: boolean;
        showSubmitButton: boolean;
        suggestions: never[];
        showSuggestions: boolean;
        maxSuggestions: number;
    };
    sizes: string[];
    variants: string[];
    inputFactory: InputFactory;
    buttonFactory: ButtonFactory;
    /**
     * Ensure CSS is loaded in the document
     */
    ensureCSS(): void;
    /**
     * Create a search bar element with full functionality
     */
    create(props?: {}): Element | null;
    /**
     * Attach event handlers to search bar
     */
    attachEventHandlers(searchBar: any, props: any): void;
    /**
     * Create search bar with template shortcuts
     */
    createBasic(props?: {}): Element | null;
    createWithVoice(props?: {}): Element | null;
    createWithSuggestions(props?: {}): Element | null;
    createComplete(props?: {}): Element | null;
    createCompact(props?: {}): Element | null;
    /**
     * Create search bar for specific use cases
     */
    createGlobalSearch(props?: {}): Element | null;
    createContentSearch(props?: {}): Element | null;
    createQuickSearch(props?: {}): Element | null;
    /**
     * Update existing search bar properties
     */
    update(searchBar: any, props: any): any;
    /**
     * Attach controller to existing search bar element
     */
    attachController(element: any, options?: {}): any;
    /**
     * Create multiple search bars
     */
    createMultiple(searchBarConfigs: any): any;
    /**
     * Create search bar with specific suggestions
     */
    createWithRecentSearches(props?: {}): Element | null;
    /**
     * Validation methods
     */
    validateProps(props: any): string[];
    /**
     * Accessibility helpers
     */
    makeAccessible(searchBar: any, options?: {}): any;
    /**
     * Utility methods
     */
    getRecentSearches(): any;
    clearRecentSearches(): void;
    /**
     * Integration with search services
     */
    createWithSearchService(searchService: any, props?: {}): Element | null;
}
export const searchBarFactory: SearchBarFactory;
/**
 * Create a search bar element with full functionality
 */
export function createSearchBar(props?: {}): Element | null;
/**
 * Create search bar with template shortcuts
 */
export function createBasic(props?: {}): Element | null;
export function createWithVoice(props?: {}): Element | null;
export function createWithSuggestions(props?: {}): Element | null;
export function createComplete(props?: {}): Element | null;
export function createCompact(props?: {}): Element | null;
/**
 * Create search bar for specific use cases
 */
export function createGlobalSearch(props?: {}): Element | null;
export function createContentSearch(props?: {}): Element | null;
export function createQuickSearch(props?: {}): Element | null;
import { InputFactory } from '../../atoms/input/input-system.js';
import { ButtonFactory } from '../../atoms/button/button-system.js';
import { searchBarTemplates } from './templates/search-bar-template.js';
import { SearchBarController } from './controllers/search-bar-controller.js';
export { searchBarTemplates, SearchBarController };
//# sourceMappingURL=search-bar-system.d.ts.map