/**
 * Input Group Atom Controller
 * Form field grouping behavior and validation management
 */
export class InputGroupController {
    constructor(options?: {});
    options: {
        autoValidate: boolean;
        validateOnChange: boolean;
        validateOnBlur: boolean;
        showValidationIcons: boolean;
        debounceValidation: number;
    };
    element: any;
    inputElement: any;
    labelElement: any;
    errorElement: any;
    helpElement: any;
    state: {
        isValid: boolean;
        isDirty: boolean;
        isTouched: boolean;
        isLoading: boolean;
        value: string;
        errors: never[];
        validationRules: never[];
    };
    validationTimeout: NodeJS.Timeout | null;
    eventListeners: Map<any, any>;
    /**
     * Initialize the input group controller
     */
    initialize(element: any): this;
    /**
     * Find child elements
     */
    findElements(): void;
    /**
     * Bind event listeners
     */
    bindEvents(): void;
    /**
     * Add event listener with cleanup tracking
     */
    addEventListener(element: any, type: any, handler: any): void;
    /**
     * Setup initial state
     */
    setupInitialState(): void;
    /**
     * Setup accessibility attributes
     */
    setupAccessibility(): void;
    /**
     * Handle input events
     */
    handleInput(event: any): void;
    /**
     * Handle change events
     */
    handleChange(event: any): void;
    /**
     * Handle blur events
     */
    handleBlur(event: any): void;
    /**
     * Handle focus events
     */
    handleFocus(event: any): void;
    /**
     * Handle keydown events
     */
    handleKeyDown(event: any): void;
    /**
     * Handle label click
     */
    handleLabelClick(event: any): void;
    /**
     * Update component state
     */
    updateState(newState: any): void;
    /**
     * Debounced validation
     */
    debouncedValidate(): void;
    /**
     * Validate the input
     */
    validate(): boolean;
    /**
     * Update error display
     */
    updateErrorDisplay(): void;
    /**
     * Update validation classes
     */
    updateValidationClasses(): void;
    /**
     * Add validation rule
     */
    addValidationRule(rule: any): this;
    /**
     * Remove validation rule
     */
    removeValidationRule(ruleName: any): this;
    /**
     * Set loading state
     */
    setLoading(loading?: boolean): this;
    /**
     * Set error message
     */
    setError(message: any): this;
    /**
     * Clear errors
     */
    clearErrors(): this;
    /**
     * Get form data
     */
    getValue(): string;
    /**
     * Set form value
     */
    setValue(value: any): this;
    /**
     * Reset the input group
     */
    reset(): this;
    /**
     * Get state
     */
    getState(): {
        isValid: boolean;
        isDirty: boolean;
        isTouched: boolean;
        isLoading: boolean;
        value: string;
        errors: never[];
        validationRules: never[];
    };
    /**
     * Emit custom event
     */
    emit(eventName: any, detail: any): void;
    /**
     * Destroy the controller
     */
    destroy(): void;
}
export default InputGroupController;
//# sourceMappingURL=input-group-controller.d.ts.map