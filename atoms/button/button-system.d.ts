/**
 * Enhanced Button Factory - World-class button components with Trading Portal sophistication
 */
export class ButtonFactory {
    defaultProps: {
        variant: string;
        size: string;
        disabled: boolean;
        loading: boolean;
        fullWidth: boolean;
        icon: string;
        iconPosition: string;
        elevation: boolean;
        rippleEffect: boolean;
        focusRing: boolean;
        accessibility: boolean;
        hapticFeedback: boolean;
        analyticsTracking: boolean;
    };
    variants: string[];
    sizes: string[];
    /**
     * Ensure CSS is loaded in the document
     */
    ensureCSS(): void;
    /**
     * Enhanced create method with Trading Portal sophistication
     * Creates buttons with micro-interactions, accessibility, and premium polish
     */
    create(props?: {}): Element | null;
    /**
     * Validate props for enhanced experience
     */
    validateProps(props: any): void;
    /**
     * Validation methods
     */
    validateProps(props: any): string[];
    /**
     * Attach Trading Portal micro-interactions
     */
    attachEnhancedInteractions(button: any, props: any): void;
    /**
     * Enhanced accessibility from Trading Portal patterns
     */
    enhanceAccessibility(button: any, props: any): void;
    /**
     * Track button clicks for analytics
     */
    trackButtonClick(props: any, event: any): void;
    /**
     * Create button with shorthand methods
     */
    createPrimary(props?: {}): Element | null;
    createSecondary(props?: {}): Element | null;
    createGhost(props?: {}): Element | null;
    createDanger(props?: {}): Element | null;
    createSuccess(props?: {}): Element | null;
    /**
     * Create button with icon shortcuts
     */
    createWithIcon(iconName: any, props?: {}): Element | null;
    createIconOnly(iconName: any, props?: {}): Element | null;
    /**
     * Update existing button properties
     */
    update(button: any, props: any): any;
    /**
     * Attach controller to existing button element
     */
    attachController(element: any): any;
    /**
     * Create multiple buttons
     */
    createMultiple(buttonConfigs: any): any;
    /**
     * Create button group
     */
    createGroup(buttons: any, groupProps?: {}): HTMLDivElement;
    /**
     * Accessibility helpers
     */
    makeAccessible(button: any, options?: {}): any;
}
export const buttonFactory: ButtonFactory;
/**
 * Enhanced create method with Trading Portal sophistication
 * Creates buttons with micro-interactions, accessibility, and premium polish
 */
export function createButton(props?: {}): Element | null;
/**
 * Create button with shorthand methods
 */
export function createPrimary(props?: {}): Element | null;
export function createSecondary(props?: {}): Element | null;
export function createGhost(props?: {}): Element | null;
export function createDanger(props?: {}): Element | null;
export function createSuccess(props?: {}): Element | null;
/**
 * Create button with icon shortcuts
 */
export function createWithIcon(iconName: any, props?: {}): Element | null;
export function createIconOnly(iconName: any, props?: {}): Element | null;
import { buttonIcons } from './icons/button-icons.js';
import { getButtonIcon } from './icons/button-icons.js';
import { ButtonController } from './controllers/button-controller.js';
export { buttonIcons, getButtonIcon, ButtonController };
//# sourceMappingURL=button-system.d.ts.map