/**
 * Atom System Factory - Main entry point for all atoms
 */
export class AtomFactory extends BaseAtomFactory {
    button: ButtonFactory;
    input: InputFactory;
    card: CardFactory;
    setupSharedFoundation(): void;
    /**
     * Create any atom type dynamically
     */
    create(type: any, props?: {}): any;
    /**
     * Create multiple atoms at once
     */
    createMultiple(atomConfigs: any): any;
    /**
     * Get available variants for any atom type
     */
    getVariants(type: any): any;
    /**
     * Get shared design tokens
     */
    getDesignTokens(): {
        colors: {
            primary: {
                50: string;
                100: string;
                200: string;
                300: string;
                400: string;
                500: string;
                600: string;
                700: string;
                800: string;
                900: string;
                contrast: string;
            };
            neutral: {
                50: string;
                100: string;
                200: string;
                300: string;
                400: string;
                500: string;
                600: string;
                700: string;
                800: string;
                900: string;
            };
            semantic: {
                success: string;
                warning: string;
                error: string;
                info: string;
            };
            surface: {
                primary: string;
                secondary: string;
                tertiary: string;
            };
            text: {
                primary: string;
                secondary: string;
                tertiary: string;
                inverse: string;
            };
            border: {
                primary: string;
                secondary: string;
                focus: string;
            };
        };
        spacing: {
            px: string;
            0: string;
            0.5: string;
            1: string;
            1.5: string;
            2: string;
            2.5: string;
            3: string;
            3.5: string;
            4: string;
            5: string;
            6: string;
            7: string;
            8: string;
            9: string;
            10: string;
            11: string;
            12: string;
            14: string;
            16: string;
            20: string;
            24: string;
            28: string;
            32: string;
        };
        sizes: {
            xs: {
                height: string;
                padding: string;
                fontSize: string;
                iconSize: string;
            };
            sm: {
                height: string;
                padding: string;
                fontSize: string;
                iconSize: string;
            };
            md: {
                height: string;
                padding: string;
                fontSize: string;
                iconSize: string;
            };
            lg: {
                height: string;
                padding: string;
                fontSize: string;
                iconSize: string;
            };
            xl: {
                height: string;
                padding: string;
                fontSize: string;
                iconSize: string;
            };
        };
        typography: {
            fontFamily: {
                sans: string;
                mono: string;
            };
            fontSize: {
                xs: string;
                sm: string;
                base: string;
                lg: string;
                xl: string;
                '2xl': string;
                '3xl': string;
                '4xl': string;
            };
            fontWeight: {
                normal: string;
                medium: string;
                semibold: string;
                bold: string;
            };
            lineHeight: {
                tight: string;
                normal: string;
                relaxed: string;
            };
        };
        borderRadius: {
            none: string;
            sm: string;
            md: string;
            lg: string;
            xl: string;
            full: string;
        };
        shadows: {
            none: string;
            xs: string;
            sm: string;
            md: string;
            lg: string;
            xl: string;
            inner: string;
        };
        animations: {
            transition: {
                fast: string;
                normal: string;
                slow: string;
            };
            easing: {
                ease: string;
                easeIn: string;
                easeOut: string;
                easeInOut: string;
            };
        };
        zIndex: {
            hide: number;
            auto: string;
            base: number;
            docked: number;
            dropdown: number;
            sticky: number;
            banner: number;
            overlay: number;
            modal: number;
            popover: number;
            skipLink: number;
            toast: number;
            tooltip: number;
        };
    };
    /**
     * Create themed variant of any atom
     */
    createThemed(type: any, theme: any, props?: {}): any;
    /**
     * Batch create atoms with shared properties
     */
    createBatch(type: any, sharedProps?: {}, variations?: any[]): any[];
}
/**
 * Specialized Atom Collections for common patterns
 */
export class AtomCollections {
    constructor(atomFactory: any);
    factory: any;
    /**
     * Create form element collection
     */
    createFormElements(config: any): {
        fields: any;
        actions: never[];
    };
    /**
     * Create card grid collection
     */
    createCardGrid(items: any, cardProps?: {}): any;
    /**
     * Create button group collection
     */
    createButtonGroup(buttons: any, groupProps?: {}): {
        container: HTMLDivElement;
        buttons: any;
    };
    createButtonGroupContainer(props: any): HTMLDivElement;
}
/**
 * Atom Theme System
 */
export class AtomThemeSystem {
    themes: Map<any, any>;
    registerDefaultThemes(): void;
    register(name: any, config: any): void;
    get(name: any): any;
    apply(atomFactory: any, themeName: any): void;
}
export const atomFactory: AtomFactory;
export const atomCollections: AtomCollections;
export const atomThemes: AtomThemeSystem;
export function createAtom(type: any, props: any): any;
export function createButton(props: any): any;
export function createInput(props: any): any;
export function createCard(props: any): any;
export namespace compose {
    function form(config: any): {
        fields: any;
        actions: never[];
    };
    function grid(items: any, cardProps: any): any;
    function buttonGroup(buttons: any, groupProps: any): {
        container: HTMLDivElement;
        buttons: any;
    };
}
/**
 * Usage Examples:
 *
 * // Simple creation
 * const button = createButton({ variant: 'primary', text: 'Click me' });
 * const input = createInput({ type: 'email', label: 'Email', required: true });
 * const card = createCard({ variant: 'elevated', content: 'Hello world' });
 *
 * // Factory-based creation
 * const atoms = atomFactory.createMultiple([
 *   { type: 'button', props: { variant: 'primary', text: 'Save' } },
 *   { type: 'button', props: { variant: 'secondary', text: 'Cancel' } }
 * ]);
 *
 * // Themed creation
 * atomThemes.apply(atomFactory, 'minimal');
 * const minimalButton = createButton({ text: 'Minimal' }); // Uses minimal theme
 *
 * // Composition patterns
 * const form = compose.form({
 *   fields: [
 *     { type: 'text', label: 'Name', required: true },
 *     { type: 'email', label: 'Email', required: true }
 *   ],
 *   submitButton: { text: 'Submit' },
 *   cancelButton: { text: 'Cancel' }
 * });
 */
/**
 * Generic export for atomicRegistry
 */
export const atomicRegistry: {};
/**
 * Base Atom Factory - Shared functionality for all atoms
 */
declare class BaseAtomFactory {
    tokens: {
        colors: {
            primary: {
                50: string;
                100: string;
                200: string;
                300: string;
                400: string;
                500: string;
                600: string;
                700: string;
                800: string;
                900: string;
                contrast: string;
            };
            neutral: {
                50: string;
                100: string;
                200: string;
                300: string;
                400: string;
                500: string;
                600: string;
                700: string;
                800: string;
                900: string;
            };
            semantic: {
                success: string;
                warning: string;
                error: string;
                info: string;
            };
            surface: {
                primary: string;
                secondary: string;
                tertiary: string;
            };
            text: {
                primary: string;
                secondary: string;
                tertiary: string;
                inverse: string;
            };
            border: {
                primary: string;
                secondary: string;
                focus: string;
            };
        };
        spacing: {
            px: string;
            0: string;
            0.5: string;
            1: string;
            1.5: string;
            2: string;
            2.5: string;
            3: string;
            3.5: string;
            4: string;
            5: string;
            6: string;
            7: string;
            8: string;
            9: string;
            10: string;
            11: string;
            12: string;
            14: string;
            16: string;
            20: string;
            24: string;
            28: string;
            32: string;
        };
        sizes: {
            xs: {
                height: string;
                padding: string;
                fontSize: string;
                iconSize: string;
            };
            sm: {
                height: string;
                padding: string;
                fontSize: string;
                iconSize: string;
            };
            md: {
                height: string;
                padding: string;
                fontSize: string;
                iconSize: string;
            };
            lg: {
                height: string;
                padding: string;
                fontSize: string;
                iconSize: string;
            };
            xl: {
                height: string;
                padding: string;
                fontSize: string;
                iconSize: string;
            };
        };
        typography: {
            fontFamily: {
                sans: string;
                mono: string;
            };
            fontSize: {
                xs: string;
                sm: string;
                base: string;
                lg: string;
                xl: string;
                '2xl': string;
                '3xl': string;
                '4xl': string;
            };
            fontWeight: {
                normal: string;
                medium: string;
                semibold: string;
                bold: string;
            };
            lineHeight: {
                tight: string;
                normal: string;
                relaxed: string;
            };
        };
        borderRadius: {
            none: string;
            sm: string;
            md: string;
            lg: string;
            xl: string;
            full: string;
        };
        shadows: {
            none: string;
            xs: string;
            sm: string;
            md: string;
            lg: string;
            xl: string;
            inner: string;
        };
        animations: {
            transition: {
                fast: string;
                normal: string;
                slow: string;
            };
            easing: {
                ease: string;
                easeIn: string;
                easeOut: string;
                easeInOut: string;
            };
        };
        zIndex: {
            hide: number;
            auto: string;
            base: number;
            docked: number;
            dropdown: number;
            sticky: number;
            banner: number;
            overlay: number;
            modal: number;
            popover: number;
            skipLink: number;
            toast: number;
            tooltip: number;
        };
    };
    utilities: {
        css: {
            generateCSSVariables(tokens: any, prefix?: string): string;
            generateVariantCSS(baseClass: any, variants: any): string;
            generateSizeCSS(baseClass: any, sizes: any): string;
            generateStateCSS(baseClass: any, states: any): string;
        };
        dom: {
            createElement(tag: any, options?: {}): any;
            applyClasses(element: any, classMap: any): void;
            setAttributes(element: any, attributes: any): void;
            createIcon(iconSVG: any, options?: {}): HTMLSpanElement;
        };
        events: {
            debounce(func: any, wait: any, immediate?: boolean): (...args: any[]) => void;
            throttle(func: any, limit: any): (...args: any[]) => void;
            addListener(element: any, event: any, handler: any, options?: {}): () => void;
            createEmitter(element: any): {
                emit(eventName: any, detail?: {}): CustomEvent<{}>;
                on(eventName: any, handler: any): () => void;
            };
        };
        validation: {
            validateProps(props: any, schema: any): any[];
            sanitizeHTML(html: any): string;
        };
        animation: {
            createSpinner(size?: string): HTMLSpanElement;
            animateIn(element: any, animation?: string): any;
        };
        a11y: {
            generateId(prefix?: string): string;
            setupFormField(input: any, label: any, errorElement: any, helperElement: any): void;
            setupKeyboardNav(element: any, options?: {}): () => void;
        };
        tokens: {
            colors: {
                primary: {
                    50: string;
                    100: string;
                    200: string;
                    300: string;
                    400: string;
                    500: string;
                    600: string;
                    700: string;
                    800: string;
                    900: string;
                    contrast: string;
                };
                neutral: {
                    50: string;
                    100: string;
                    200: string;
                    300: string;
                    400: string;
                    500: string;
                    600: string;
                    700: string;
                    800: string;
                    900: string;
                };
                semantic: {
                    success: string;
                    warning: string;
                    error: string;
                    info: string;
                };
                surface: {
                    primary: string;
                    secondary: string;
                    tertiary: string;
                };
                text: {
                    primary: string;
                    secondary: string;
                    tertiary: string;
                    inverse: string;
                };
                border: {
                    primary: string;
                    secondary: string;
                    focus: string;
                };
            };
            spacing: {
                px: string;
                0: string;
                0.5: string;
                1: string;
                1.5: string;
                2: string;
                2.5: string;
                3: string;
                3.5: string;
                4: string;
                5: string;
                6: string;
                7: string;
                8: string;
                9: string;
                10: string;
                11: string;
                12: string;
                14: string;
                16: string;
                20: string;
                24: string;
                28: string;
                32: string;
            };
            sizes: {
                xs: {
                    height: string;
                    padding: string;
                    fontSize: string;
                    iconSize: string;
                };
                sm: {
                    height: string;
                    padding: string;
                    fontSize: string;
                    iconSize: string;
                };
                md: {
                    height: string;
                    padding: string;
                    fontSize: string;
                    iconSize: string;
                };
                lg: {
                    height: string;
                    padding: string;
                    fontSize: string;
                    iconSize: string;
                };
                xl: {
                    height: string;
                    padding: string;
                    fontSize: string;
                    iconSize: string;
                };
            };
            typography: {
                fontFamily: {
                    sans: string;
                    mono: string;
                };
                fontSize: {
                    xs: string;
                    sm: string;
                    base: string;
                    lg: string;
                    xl: string;
                    '2xl': string;
                    '3xl': string;
                    '4xl': string;
                };
                fontWeight: {
                    normal: string;
                    medium: string;
                    semibold: string;
                    bold: string;
                };
                lineHeight: {
                    tight: string;
                    normal: string;
                    relaxed: string;
                };
            };
            borderRadius: {
                none: string;
                sm: string;
                md: string;
                lg: string;
                xl: string;
                full: string;
            };
            shadows: {
                none: string;
                xs: string;
                sm: string;
                md: string;
                lg: string;
                xl: string;
                inner: string;
            };
            animations: {
                transition: {
                    fast: string;
                    normal: string;
                    slow: string;
                };
                easing: {
                    ease: string;
                    easeIn: string;
                    easeOut: string;
                    easeInOut: string;
                };
            };
            zIndex: {
                hide: number;
                auto: string;
                base: number;
                docked: number;
                dropdown: number;
                sticky: number;
                banner: number;
                overlay: number;
                modal: number;
                popover: number;
                skipLink: number;
                toast: number;
                tooltip: number;
            };
        };
        variants: {
            primary: {
                backgroundColor: string;
                color: string;
                borderColor: string;
            };
            secondary: {
                backgroundColor: string;
                color: string;
                borderColor: string;
            };
            success: {
                backgroundColor: string;
                color: string;
                borderColor: string;
            };
            warning: {
                backgroundColor: string;
                color: string;
                borderColor: string;
            };
            error: {
                backgroundColor: string;
                color: string;
                borderColor: string;
            };
            ghost: {
                backgroundColor: string;
                color: string;
                borderColor: string;
            };
            outline: {
                backgroundColor: string;
                color: string;
                borderColor: string;
            };
        };
        states: {
            hover: {
                transform: string;
                transition: string;
            };
            focus: {
                outline: string;
                borderColor: string;
                boxShadow: string;
            };
            active: {
                transform: string;
                transition: string;
            };
            disabled: {
                opacity: string;
                cursor: string;
                pointerEvents: string;
            };
            loading: {
                cursor: string;
                position: string;
            };
        };
    };
    commonProps: {
        size: string;
        disabled: boolean;
        className: string;
        id: null;
        'data-testid': null;
    };
    /**
     * Merge props with defaults and common properties
     */
    mergeProps(props?: {}, defaults?: {}): {
        size: string;
        disabled: boolean;
        className: string;
        id: null;
        'data-testid': null;
    };
    /**
     * Generate consistent class names
     */
    buildClassName(base: any, variant: any, size: any, additional?: any[]): string;
    /**
     * Apply consistent attributes
     */
    applyAttributes(element: any, props: any): void;
    /**
     * Set up consistent event handling
     */
    setupEventHandling(element: any, events?: {}): void;
}
import { ButtonFactory } from './button/button-system.js';
import { InputFactory } from './input/input-system.js';
import { CardFactory } from './card/card-system.js';
export {};
//# sourceMappingURL=atom-factory.d.ts.map