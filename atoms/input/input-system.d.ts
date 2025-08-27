/**
 * Input Factory - Creates input components with full modularity
 */
export class InputFactory {
    defaultProps: {
        variant: string;
        size: string;
        type: string;
        disabled: boolean;
        readonly: boolean;
        required: boolean;
        clearable: boolean;
        loading: boolean;
    };
    variants: string[];
    sizes: string[];
    inputTypes: string[];
    /**
     * Set shared foundation from main factory
     */
    setSharedFoundation(tokens: any, utilities: any): void;
    tokens: any;
    utilities: any;
    /**
     * Create an input component
     */
    create(props?: {}): Element | null;
    /**
     * Create multiple inputs at once
     */
    createMultiple(inputConfigs: any): any;
    /**
     * Create input using template shortcuts
     */
    createFromTemplate(templateName: any, props?: {}): Element | null;
    /**
     * Create form with multiple inputs
     */
    createForm(formConfig: any): HTMLFormElement;
    /**
     * Create input group (side by side inputs)
     */
    createGroup(groupConfig: any): HTMLDivElement;
    /**
     * Find the actual input element within a wrapper
     */
    findInputElement(element: any): any;
    /**
     * Check if element is an input element
     */
    isInputElement(element: any): boolean;
    /**
     * Attach appropriate controller based on input type
     */
    attachController(inputElement: any, config: any): InputController;
    /**
     * Setup accessibility attributes
     */
    setupAccessibility(element: any, config: any): void;
    /**
     * Generate unique ID
     */
    generateId(prefix?: string): string;
    /**
     * Validate configuration
     */
    validateConfig(config: any): void;
    /**
     * Get available variants
     */
    getVariants(): string[];
    /**
     * Get available sizes
     */
    getSizes(): string[];
    /**
     * Get available input types
     */
    getTypes(): string[];
    /**
     * Get available templates
     */
    getTemplates(): string[];
    /**
     * Set default properties
     */
    setDefaults(defaults: any): void;
    /**
     * Ensure CSS is loaded
     */
    ensureCSS(): void;
    /**
     * Get controller from input element
     */
    getController(inputElement: any): any;
    /**
     * Update input props dynamically
     */
    updateProps(element: any, newProps: any): void;
}
export function createInput(props: any): Element | null;
export function createPassword(props: any): Element | null;
export function createEmail(props: any): Element | null;
export function createSearch(props: any): Element | null;
export function createTextarea(props: any): Element | null;
export function createSelect(props: any): Element | null;
export function createFileInput(props: any): Element | null;
export const inputFactory: InputFactory;
export default InputFactory;
import { InputController } from './controllers/input-controller.js';
//# sourceMappingURL=input-system.d.ts.map