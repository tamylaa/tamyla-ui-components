/**
 * Card Component Logic
 * Pure JavaScript logic for card behavior
 */
export class CardController {
    constructor(element: any);
    element: any;
    isInteractive: any;
    setupEventListeners(): void;
    handleClick(event: any): void;
    handleActionClick(event: any): void;
    handleKeydown(event: any): void;
    handleMouseEnter(event: any): void;
    handleMouseLeave(event: any): void;
    handleFocus(event: any): void;
    handleBlur(event: any): void;
    isDisabled(): any;
    isSelected(): any;
    setSelected(selected: any): void;
    toggleSelected(): void;
    setDisabled(disabled: any): void;
    setElevation(elevation: any): void;
    dispatchCustomEvent(eventName: any, detail?: {}): void;
    destroy(): void;
}
/**
 * Card Group Controller - Manages multiple cards as a group
 */
export class CardGroupController {
    constructor(container: any, options?: {});
    container: any;
    options: {
        multiSelect: boolean;
        selectable: boolean;
    };
    cards: any[];
    setupCards(): void;
    handleCardSelection(event: any): void;
    getSelectedCards(): any[];
    selectAll(): void;
    deselectAll(): void;
    dispatchGroupEvent(eventName: any, detail?: {}): void;
    destroy(): void;
}
//# sourceMappingURL=card-controller.d.ts.map