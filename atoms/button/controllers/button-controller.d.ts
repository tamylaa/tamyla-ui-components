/**
 * Factory function to create button controller
 */
export function createButtonController(element: any, config?: {}): ButtonController;
/**
 * Button Component Logic
 * Pure JavaScript logic for button behavior
 */
export class ButtonController {
    constructor(element: any);
    element: any;
    setupEventListeners(): void;
    handleClick(event: any): void;
    handleKeydown(event: any): void;
    isDisabled(): any;
    isLoading(): any;
    setLoading(loading: any): void;
    setDisabled(disabled: any): void;
    dispatchCustomEvent(eventName: any, detail?: {}): void;
    destroy(): void;
}
//# sourceMappingURL=button-controller.d.ts.map