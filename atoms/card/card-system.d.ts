/**
 * Card Factory - Creates card components with full modularity
 */
export class CardFactory {
    defaultProps: {
        variant: string;
        size: string;
        padding: string;
        elevation: string;
        interactive: boolean;
        selected: boolean;
        disabled: boolean;
    };
    variants: string[];
    sizes: string[];
    paddings: string[];
    elevations: string[];
    /**
     * Ensure CSS is loaded in the document
     */
    ensureCSS(): void;
    /**
     * Create a card element with all functionality
     */
    create(props?: {}): Element | null;
    /**
     * Create card with variant shortcuts
     */
    createDefault(props?: {}): Element | null;
    createOutlined(props?: {}): Element | null;
    createFilled(props?: {}): Element | null;
    createElevated(props?: {}): Element | null;
    createGhost(props?: {}): Element | null;
    /**
     * Create interactive cards
     */
    createInteractive(props?: {}): Element | null;
    createSelectable(props?: {}): Element | null;
    /**
     * Create cards using templates
     */
    createBasic(props?: {}): Element | null;
    createProduct(props?: {}): Element | null;
    createArticle(props?: {}): Element | null;
    createProfile(props?: {}): Element | null;
    /**
     * Update existing card properties
     */
    update(card: any, props: any): any;
    /**
     * Attach controller to existing card element
     */
    attachController(element: any, options?: {}): any;
    /**
     * Create multiple cards
     */
    createMultiple(cardConfigs: any): any;
    /**
     * Create card grid
     */
    createGrid(cards: any, gridProps?: {}): HTMLDivElement;
    /**
     * Create card group with group selection behavior
     */
    createGroup(cards: any, groupProps?: {}): HTMLDivElement;
    /**
     * Validation methods
     */
    validateProps(props: any): string[];
    /**
     * Accessibility helpers
     */
    makeAccessible(card: any, options?: {}): any;
}
export const cardFactory: CardFactory;
/**
 * Create a card element with all functionality
 */
export function createCard(props?: {}): Element | null;
/**
 * Create card with variant shortcuts
 */
export function createDefault(props?: {}): Element | null;
export function createOutlined(props?: {}): Element | null;
export function createFilled(props?: {}): Element | null;
export function createElevated(props?: {}): Element | null;
export function createGhost(props?: {}): Element | null;
/**
 * Create interactive cards
 */
export function createInteractive(props?: {}): Element | null;
export function createSelectable(props?: {}): Element | null;
/**
 * Create cards using templates
 */
export function createBasic(props?: {}): Element | null;
export function createProduct(props?: {}): Element | null;
export function createArticle(props?: {}): Element | null;
export function createProfile(props?: {}): Element | null;
import { cardIcons } from './icons/card-icons.js';
import { getCardIcon } from './icons/card-icons.js';
import { CardController } from './controllers/card-controller.js';
import { CardGroupController } from './controllers/card-controller.js';
export { cardIcons, getCardIcon, CardController, CardGroupController };
//# sourceMappingURL=card-system.d.ts.map