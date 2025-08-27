/**
 * Base Input Controller - Handles common input behaviors
 */
export class InputController {
    constructor(element: any, options?: {});
    element: any;
    options: {
        validateOnBlur: boolean;
        validateOnInput: boolean;
        clearable: boolean;
        autoComplete: boolean;
        debounceDelay: number;
        maxLength: null;
        minLength: null;
        pattern: null;
        required: boolean;
    };
    validators: any[];
    listeners: any[];
    debounceTimer: NodeJS.Timeout | null;
    value: any;
    init(): void;
    setupEventListeners(): void;
    setupValidation(): void;
    setupClearButton(): void;
    clearButton: any;
    setupAutoResize(): void;
    handleInput(event: any): void;
    handleKeydown(event: any): void;
    handleAutoResize(): void;
    updateClearButton(): void;
    debounceValidation(): void;
    addValidator(validator: any): void;
    removeValidator(validator: any): void;
    validate(): boolean;
    setError(errorMessage: any): void;
    setValue(newValue: any): void;
    clear(): void;
    focus(): void;
    blur(): void;
    disable(): void;
    enable(): void;
    setLoading(loading: any): void;
    addListener(event: any, handler: any): void;
    emit(eventName: any, detail?: {}): CustomEvent<{
        controller: this;
    }>;
    emitReady(): void;
    destroy(): void;
}
/**
 * Specialized Input Controllers
 */
export class PasswordInputController extends InputController {
    isVisible: boolean;
    setupPasswordFeatures(): void;
    setupVisibilityToggle(): void;
    toggleButton: HTMLButtonElement | undefined;
    toggleVisibility(): void;
    setupStrengthMeter(): void;
    calculateStrength(password: any): {
        score: number;
        level: string;
    };
    updateStrengthMeter(strength: any): void;
}
export class SearchInputController extends InputController {
    searchHistory: any[];
    suggestions: any[];
    debounceSearch(): void;
    searchTimer: NodeJS.Timeout | undefined;
    performSearch(): void;
    addToHistory(query: any): void;
    setSuggestions(suggestions: any): void;
    clearSuggestions(): void;
}
export class FileInputController extends InputController {
    files: any[];
    setupFileHandling(): void;
    handleFileSelection(event: any): void;
    validateFiles(files: any): any;
    setupDragAndDrop(wrapper: any): void;
    updateFileDisplay(): void;
}
declare namespace _default {
    export { InputController };
    export { PasswordInputController };
    export { SearchInputController };
    export { FileInputController };
}
export default _default;
//# sourceMappingURL=input-controller.d.ts.map