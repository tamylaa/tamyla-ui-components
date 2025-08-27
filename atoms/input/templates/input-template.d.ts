/**
 * Generate basic input HTML structure
 */
export function createInputHTML(options?: {}): string;
/**
 * Generate textarea HTML structure
 */
export function createTextareaHTML(options?: {}): string;
/**
 * Generate select HTML structure
 */
export function createSelectHTML(options?: {}): string;
/**
 * Generate input wrapper with label, helper text, and error
 */
export function createInputWrapperHTML(options?: {}): string;
/**
 * Generate input with icon
 */
export function createInputWithIconHTML(options?: {}): string;
/**
 * Generate file input HTML
 */
export function createFileInputHTML(options?: {}): string;
/**
 * Generate input group (multiple inputs)
 */
export function createInputGroupHTML(options?: {}): string;
/**
 * Generate complete input with all features
 */
export function createCompleteInputHTML(options?: {}): string;
export namespace inputTemplates {
    function email(options?: {}): string;
    function password(options?: {}): string;
    function name(options?: {}): string;
    function phone(options?: {}): string;
    function search(options?: {}): string;
    function currency(options?: {}): string;
    function date(options?: {}): string;
    function fileUpload(options?: {}): string;
    function message(options?: {}): string;
}
declare namespace _default {
    export { createInputHTML };
    export { createTextareaHTML };
    export { createSelectHTML };
    export { createInputWrapperHTML };
    export { createInputWithIconHTML };
    export { createFileInputHTML };
    export { createInputGroupHTML };
    export { createCompleteInputHTML };
    export { inputTemplates };
}
export default _default;
//# sourceMappingURL=input-template.d.ts.map