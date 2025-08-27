/**
 * Content Manager Application Templates
 * HTML template generation for content management interface
 */
/**
 * Main application template
 */
export function createContentManagerTemplate(props?: {}): string;
/**
 * Upload section template
 */
export function createUploadSection(showUpload: any, allowedFileTypes: any): string;
/**
 * View controls template
 */
export function createViewControls(currentView: any, sortBy: any): string;
/**
 * Selection actions template
 */
export function createSelectionActions(selectionMode: any): "" | "\n    <div class=\"content-manager__selection-actions\" style=\"display: none;\">\n      <span class=\"selection-count\">0 selected</span>\n      <button class=\"action-button action-button--secondary\" \n              data-action=\"download\"\n              title=\"Download selected items\">\n        Download\n      </button>\n      <button class=\"action-button action-button--secondary\" \n              data-action=\"share\"\n              title=\"Share selected items\">\n        Share\n      </button>\n      <button class=\"action-button action-button--danger\" \n              data-action=\"delete\"\n              title=\"Delete selected items\">\n        Delete\n      </button>\n    </div>\n  ";
/**
 * Upload progress template
 */
export function createUploadProgressTemplate(uploads: any): any;
/**
 * Empty state template
 */
export function createEmptyStateTemplate(hasSearchQuery?: boolean): "\n      <div class=\"content-manager__empty\">\n        <svg class=\"empty-icon\" viewBox=\"0 0 64 64\" fill=\"currentColor\">\n          <path d=\"M32 2C15.431 2 2 15.431 2 32s13.431 30 30 30 30-13.431 30-30S48.569 2 32 2zm0 54C17.664 56 6 44.336 6 30S17.664 4 32 4s26 11.664 26 26-11.664 26-26 26z\"/>\n          <path d=\"M26.5 20.5c-3.314 0-6 2.686-6 6s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6zm0 8c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2z\"/>\n          <path d=\"M43.5 34.5l-8-8c-.781-.781-2.047-.781-2.828 0l-8 8c-.781.781-.781 2.047 0 2.828l8 8c.391.391.902.586 1.414.586s1.023-.195 1.414-.586l8-8c.781-.781.781-2.047 0-2.828z\"/>\n        </svg>\n        <h3 class=\"empty-title\">No matching content found</h3>\n        <p class=\"empty-description\">Try adjusting your search terms or filters</p>\n      </div>\n    " | "\n    <div class=\"content-manager__empty\">\n      <svg class=\"empty-icon\" viewBox=\"0 0 64 64\" fill=\"currentColor\">\n        <path d=\"M50 8H14c-3.3 0-6 2.7-6 6v36c0 3.3 2.7 6 6 6h36c3.3 0 6-2.7 6-6V14c0-3.3-2.7-6-6-6zM14 12h36c1.1 0 2 .9 2 2v28l-8-8c-1.1-1.1-3.1-1.1-4.2 0l-10 10-4-4c-1.1-1.1-3.1-1.1-4.2 0l-10 10V14c0-1.1.9-2 2-2z\"/>\n        <circle cx=\"20\" cy=\"20\" r=\"4\"/>\n      </svg>\n      <h3 class=\"empty-title\">No content yet</h3>\n      <p class=\"empty-description\">Upload files to get started with your content library</p>\n    </div>\n  ";
/**
 * Loading state template
 */
export function createLoadingTemplate(): string;
/**
 * Content stats template
 */
export function createContentStatsTemplate(stats: any): string;
//# sourceMappingURL=content-manager-template.d.ts.map