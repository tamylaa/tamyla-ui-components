export namespace cssUtils {
    /**
     * Generate CSS custom properties from token values
     */
    function generateCSSVariables(tokens: any, prefix?: string): string;
    /**
     * Generate variant CSS classes
     */
    function generateVariantCSS(baseClass: any, variants: any): string;
    /**
     * Generate size variant CSS
     */
    function generateSizeCSS(baseClass: any, sizes: any): string;
    /**
     * Generate state CSS (hover, focus, etc.)
     */
    function generateStateCSS(baseClass: any, states: any): string;
}
export namespace domUtils {
    /**
     * Create element with classes and attributes
     */
    function createElement(tag: any, options?: {}): any;
    /**
     * Apply multiple CSS classes conditionally
     */
    function applyClasses(element: any, classMap: any): void;
    /**
     * Set multiple attributes at once
     */
    function setAttributes(element: any, attributes: any): void;
    /**
     * Create SVG icon element
     */
    function createIcon(iconSVG: any, options?: {}): HTMLSpanElement;
}
export namespace eventUtils {
    /**
     * Debounce function calls
     */
    function debounce(func: any, wait: any, immediate?: boolean): (...args: any[]) => void;
    /**
     * Throttle function calls
     */
    function throttle(func: any, limit: any): (...args: any[]) => void;
    /**
     * Add event listener with cleanup
     */
    function addListener(element: any, event: any, handler: any, options?: {}): () => void;
    /**
     * Create event emitter for components
     */
    function createEmitter(element: any): {
        emit(eventName: any, detail?: {}): CustomEvent<{}>;
        on(eventName: any, handler: any): () => void;
    };
}
export namespace validationUtils {
    /**
     * Validate component props
     */
    function validateProps(props: any, schema: any): any[];
    /**
     * Sanitize HTML content
     */
    function sanitizeHTML(html: any): string;
}
export namespace animationUtils {
    /**
     * Create loading spinner
     */
    function createSpinner(size?: string): HTMLSpanElement;
    /**
     * Animate element entrance
     */
    function animateIn(element: any, animation?: string): any;
}
export namespace a11yUtils {
    /**
     * Generate unique ID for form elements
     */
    function generateId(prefix?: string): string;
    /**
     * Set up ARIA attributes for form fields
     */
    function setupFormField(input: any, label: any, errorElement: any, helperElement: any): void;
    /**
     * Set up keyboard navigation
     */
    function setupKeyboardNav(element: any, options?: {}): () => void;
}
export namespace sharedUtilities {
    export { cssUtils as css };
    export { domUtils as dom };
    export { eventUtils as events };
    export { validationUtils as validation };
    export { animationUtils as animation };
    export { a11yUtils as a11y };
    export { designTokens as tokens };
    export { sharedVariants as variants };
    export { sharedStates as states };
}
export default sharedUtilities;
import { designTokens } from './design-tokens.js';
import { sharedVariants } from './design-tokens.js';
import { sharedStates } from './design-tokens.js';
//# sourceMappingURL=shared-utilities.d.ts.map