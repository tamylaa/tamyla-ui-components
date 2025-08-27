/**
 * Input Group Factory
 * Creates modular form field groups with separated concerns
 */
export function InputGroupFactory(props?: {}): {
    render: (targetContainer?: any) => any;
    focus: () => any;
    blur: () => any;
    destroy: () => void;
    getValue: () => any;
    setValue: (newValue: any) => any;
    reset: () => any;
    validate: () => any;
    addValidationRule: (rule: any) => any;
    removeValidationRule: (ruleName: any) => any;
    setError: (message: any) => any;
    clearErrors: () => any;
    setLoading: (loading?: boolean) => any;
    setDisabled: (disabled?: boolean) => any;
    setReadonly: (readonly?: boolean) => any;
    getController: () => any;
    getElement: () => any;
    getState: () => any;
    isValid: () => any;
};
/**
 * Convenience functions for common input types
 */
/**
 * Create text input group
 */
export function createTextInput(label: any, options?: {}): {
    render: (targetContainer?: any) => any;
    focus: () => any;
    blur: () => any;
    destroy: () => void;
    getValue: () => any;
    setValue: (newValue: any) => any;
    reset: () => any;
    validate: () => any;
    addValidationRule: (rule: any) => any;
    removeValidationRule: (ruleName: any) => any;
    setError: (message: any) => any;
    clearErrors: () => any;
    setLoading: (loading?: boolean) => any;
    setDisabled: (disabled?: boolean) => any;
    setReadonly: (readonly?: boolean) => any;
    getController: () => any;
    getElement: () => any;
    getState: () => any;
    isValid: () => any;
};
/**
 * Create email input group
 */
export function createEmailInput(label: any, options?: {}): {
    render: (targetContainer?: any) => any;
    focus: () => any;
    blur: () => any;
    destroy: () => void;
    getValue: () => any;
    setValue: (newValue: any) => any;
    reset: () => any;
    validate: () => any;
    addValidationRule: (rule: any) => any;
    removeValidationRule: (ruleName: any) => any;
    setError: (message: any) => any;
    clearErrors: () => any;
    setLoading: (loading?: boolean) => any;
    setDisabled: (disabled?: boolean) => any;
    setReadonly: (readonly?: boolean) => any;
    getController: () => any;
    getElement: () => any;
    getState: () => any;
    isValid: () => any;
};
/**
 * Create password input group
 */
export function createPasswordInput(label: any, options?: {}): {
    render: (targetContainer?: any) => any;
    focus: () => any;
    blur: () => any;
    destroy: () => void;
    getValue: () => any;
    setValue: (newValue: any) => any;
    reset: () => any;
    validate: () => any;
    addValidationRule: (rule: any) => any;
    removeValidationRule: (ruleName: any) => any;
    setError: (message: any) => any;
    clearErrors: () => any;
    setLoading: (loading?: boolean) => any;
    setDisabled: (disabled?: boolean) => any;
    setReadonly: (readonly?: boolean) => any;
    getController: () => any;
    getElement: () => any;
    getState: () => any;
    isValid: () => any;
};
/**
 * Create textarea input group
 */
export function createTextareaInput(label: any, options?: {}): {
    render: (targetContainer?: any) => any;
    focus: () => any;
    blur: () => any;
    destroy: () => void;
    getValue: () => any;
    setValue: (newValue: any) => any;
    reset: () => any;
    validate: () => any;
    addValidationRule: (rule: any) => any;
    removeValidationRule: (ruleName: any) => any;
    setError: (message: any) => any;
    clearErrors: () => any;
    setLoading: (loading?: boolean) => any;
    setDisabled: (disabled?: boolean) => any;
    setReadonly: (readonly?: boolean) => any;
    getController: () => any;
    getElement: () => any;
    getState: () => any;
    isValid: () => any;
};
/**
 * Create select input group
 */
export function createSelectInput(label: any, options?: any[], inputOptions?: {}): {
    render: (targetContainer?: any) => any;
    focus: () => any;
    blur: () => any;
    destroy: () => void;
    getValue: () => any;
    setValue: (newValue: any) => any;
    reset: () => any;
    validate: () => any;
    addValidationRule: (rule: any) => any;
    removeValidationRule: (ruleName: any) => any;
    setError: (message: any) => any;
    clearErrors: () => any;
    setLoading: (loading?: boolean) => any;
    setDisabled: (disabled?: boolean) => any;
    setReadonly: (readonly?: boolean) => any;
    getController: () => any;
    getElement: () => any;
    getState: () => any;
    isValid: () => any;
};
/**
 * Create checkbox input group
 */
export function createCheckboxInput(label: any, options?: {}): {
    render: (targetContainer?: any) => any;
    focus: () => any;
    blur: () => any;
    destroy: () => void;
    getValue: () => any;
    setValue: (newValue: any) => any;
    reset: () => any;
    validate: () => any;
    addValidationRule: (rule: any) => any;
    removeValidationRule: (ruleName: any) => any;
    setError: (message: any) => any;
    clearErrors: () => any;
    setLoading: (loading?: boolean) => any;
    setDisabled: (disabled?: boolean) => any;
    setReadonly: (readonly?: boolean) => any;
    getController: () => any;
    getElement: () => any;
    getState: () => any;
    isValid: () => any;
};
/**
 * Create radio group input
 */
export function createRadioInput(label: any, options?: any[], inputOptions?: {}): {
    render: (targetContainer?: any) => any;
    focus: () => any;
    blur: () => any;
    destroy: () => void;
    getValue: () => any;
    setValue: (newValue: any) => any;
    reset: () => any;
    validate: () => any;
    addValidationRule: (rule: any) => any;
    removeValidationRule: (ruleName: any) => any;
    setError: (message: any) => any;
    clearErrors: () => any;
    setLoading: (loading?: boolean) => any;
    setDisabled: (disabled?: boolean) => any;
    setReadonly: (readonly?: boolean) => any;
    getController: () => any;
    getElement: () => any;
    getState: () => any;
    isValid: () => any;
};
/**
 * Input Group Manager for handling multiple related inputs
 */
export class InputGroupManager {
    constructor(options?: {});
    options: {
        validateOnSubmit: boolean;
        showSummaryErrors: boolean;
        scrollToFirstError: boolean;
    };
    inputGroups: Map<any, any>;
    formElement: any;
    /**
     * Add input group to manager
     */
    add(name: any, inputGroup: any): this;
    /**
     * Remove input group from manager
     */
    remove(name: any): this;
    /**
     * Get input group by name
     */
    get(name: any): any;
    /**
     * Validate all input groups
     */
    validateAll(): {
        isValid: boolean;
        errors: {};
    };
    /**
     * Get form data from all input groups
     */
    getFormData(): {};
    /**
     * Set form data for all input groups
     */
    setFormData(data: any): this;
    /**
     * Reset all input groups
     */
    resetAll(): this;
    /**
     * Handle validation events
     */
    handleValidation(name: any, validationResult: any): void;
    /**
     * Scroll to first error
     */
    scrollToFirstError(): void;
    /**
     * Destroy all input groups
     */
    destroyAll(): void;
}
export namespace inputGroup {
    function text(label: any, options: any): {
        render: (targetContainer?: any) => any;
        focus: () => any;
        blur: () => any;
        destroy: () => void;
        getValue: () => any;
        setValue: (newValue: any) => any;
        reset: () => any;
        validate: () => any;
        addValidationRule: (rule: any) => any;
        removeValidationRule: (ruleName: any) => any;
        setError: (message: any) => any;
        clearErrors: () => any;
        setLoading: (loading?: boolean) => any;
        setDisabled: (disabled?: boolean) => any;
        setReadonly: (readonly?: boolean) => any;
        getController: () => any;
        getElement: () => any;
        getState: () => any;
        isValid: () => any;
    };
    function email(label: any, options: any): {
        render: (targetContainer?: any) => any;
        focus: () => any;
        blur: () => any;
        destroy: () => void;
        getValue: () => any;
        setValue: (newValue: any) => any;
        reset: () => any;
        validate: () => any;
        addValidationRule: (rule: any) => any;
        removeValidationRule: (ruleName: any) => any;
        setError: (message: any) => any;
        clearErrors: () => any;
        setLoading: (loading?: boolean) => any;
        setDisabled: (disabled?: boolean) => any;
        setReadonly: (readonly?: boolean) => any;
        getController: () => any;
        getElement: () => any;
        getState: () => any;
        isValid: () => any;
    };
    function password(label: any, options: any): {
        render: (targetContainer?: any) => any;
        focus: () => any;
        blur: () => any;
        destroy: () => void;
        getValue: () => any;
        setValue: (newValue: any) => any;
        reset: () => any;
        validate: () => any;
        addValidationRule: (rule: any) => any;
        removeValidationRule: (ruleName: any) => any;
        setError: (message: any) => any;
        clearErrors: () => any;
        setLoading: (loading?: boolean) => any;
        setDisabled: (disabled?: boolean) => any;
        setReadonly: (readonly?: boolean) => any;
        getController: () => any;
        getElement: () => any;
        getState: () => any;
        isValid: () => any;
    };
    function textarea(label: any, options: any): {
        render: (targetContainer?: any) => any;
        focus: () => any;
        blur: () => any;
        destroy: () => void;
        getValue: () => any;
        setValue: (newValue: any) => any;
        reset: () => any;
        validate: () => any;
        addValidationRule: (rule: any) => any;
        removeValidationRule: (ruleName: any) => any;
        setError: (message: any) => any;
        clearErrors: () => any;
        setLoading: (loading?: boolean) => any;
        setDisabled: (disabled?: boolean) => any;
        setReadonly: (readonly?: boolean) => any;
        getController: () => any;
        getElement: () => any;
        getState: () => any;
        isValid: () => any;
    };
    function select(label: any, options: any, inputOptions: any): {
        render: (targetContainer?: any) => any;
        focus: () => any;
        blur: () => any;
        destroy: () => void;
        getValue: () => any;
        setValue: (newValue: any) => any;
        reset: () => any;
        validate: () => any;
        addValidationRule: (rule: any) => any;
        removeValidationRule: (ruleName: any) => any;
        setError: (message: any) => any;
        clearErrors: () => any;
        setLoading: (loading?: boolean) => any;
        setDisabled: (disabled?: boolean) => any;
        setReadonly: (readonly?: boolean) => any;
        getController: () => any;
        getElement: () => any;
        getState: () => any;
        isValid: () => any;
    };
    function checkbox(label: any, options: any): {
        render: (targetContainer?: any) => any;
        focus: () => any;
        blur: () => any;
        destroy: () => void;
        getValue: () => any;
        setValue: (newValue: any) => any;
        reset: () => any;
        validate: () => any;
        addValidationRule: (rule: any) => any;
        removeValidationRule: (ruleName: any) => any;
        setError: (message: any) => any;
        clearErrors: () => any;
        setLoading: (loading?: boolean) => any;
        setDisabled: (disabled?: boolean) => any;
        setReadonly: (readonly?: boolean) => any;
        getController: () => any;
        getElement: () => any;
        getState: () => any;
        isValid: () => any;
    };
    function radio(label: any, options: any, inputOptions: any): {
        render: (targetContainer?: any) => any;
        focus: () => any;
        blur: () => any;
        destroy: () => void;
        getValue: () => any;
        setValue: (newValue: any) => any;
        reset: () => any;
        validate: () => any;
        addValidationRule: (rule: any) => any;
        removeValidationRule: (ruleName: any) => any;
        setError: (message: any) => any;
        clearErrors: () => any;
        setLoading: (loading?: boolean) => any;
        setDisabled: (disabled?: boolean) => any;
        setReadonly: (readonly?: boolean) => any;
        getController: () => any;
        getElement: () => any;
        getState: () => any;
        isValid: () => any;
    };
}
export default InputGroupFactory;
//# sourceMappingURL=input-group-system.d.ts.map