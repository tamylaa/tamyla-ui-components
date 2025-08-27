/**
 * File List Molecule Controller
 * File display and selection behavior management
 */
export class FileListController {
    constructor(options?: {});
    options: {
        selectable: boolean;
        multiSelect: boolean;
        showActions: boolean;
        sortable: boolean;
        filterable: boolean;
        dragAndDrop: boolean;
        defaultSortBy: string;
        defaultSortOrder: string;
    };
    element: any;
    files: any[];
    filteredFiles: any[];
    selectedFiles: Set<any>;
    draggedFiles: any[];
    state: {
        loading: boolean;
        sortBy: string;
        sortOrder: string;
        filter: string;
        view: string;
    };
    eventListeners: Map<any, any>;
    /**
     * Initialize the file list controller
     */
    initialize(element: any): this;
    /**
     * Bind event listeners
     */
    bindEvents(): void;
    /**
     * Add event listener with cleanup tracking
     */
    addEventListener(element: any, type: any, handler: any): void;
    /**
     * Setup accessibility attributes
     */
    setupAccessibility(): void;
    /**
     * Setup drag and drop if enabled
     */
    setupDragAndDrop(): void;
    /**
     * Handle item click
     */
    handleItemClick(event: any): void;
    /**
     * Handle keyboard navigation
     */
    handleKeyDown(event: any): void;
    /**
     * Handle checkbox change
     */
    handleCheckboxChange(event: any): void;
    /**
     * Handle action button clicks
     */
    handleActionClick(event: any): void;
    /**
     * Handle global keyboard shortcuts
     */
    handleGlobalKeyDown(event: any): void;
    /**
     * Handle drag over
     */
    handleDragOver(event: any): void;
    /**
     * Handle drag leave
     */
    handleDragLeave(event: any): void;
    /**
     * Handle file drop
     */
    handleDrop(event: any): void;
    /**
     * Handle drag start for file items
     */
    handleDragStart(event: any): void;
    /**
     * Handle drag end
     */
    handleDragEnd(event: any): void;
    /**
     * Focus navigation helpers
     */
    focusNextItem(currentItem: any): void;
    focusPreviousItem(currentItem: any): void;
    focusFirstItem(): void;
    focusLastItem(): void;
    /**
     * Get all file items
     */
    getFileItems(): any[];
    /**
     * Selection management
     */
    selectFile(fileId: any, clearOthers?: boolean): void;
    deselectFile(fileId: any): void;
    toggleSelection(fileId: any): void;
    selectRange(endFileId: any): void;
    selectAll(): void;
    clearSelection(): void;
    /**
     * Update item selection UI
     */
    updateItemSelection(fileId: any, selected: any): void;
    /**
     * File management
     */
    setFiles(files: any): void;
    addFile(file: any): void;
    removeFile(fileId: any): void;
    updateFile(fileId: any, updates: any): void;
    getFileById(fileId: any): any;
    /**
     * Filtering and sorting
     */
    setFilter(filter: any): void;
    applyFilter(): void;
    setSorting(sortBy: any, sortOrder?: string): void;
    sort(): void;
    /**
     * View management
     */
    setView(view: any): void;
    /**
     * Loading state
     */
    setLoading(loading?: boolean): void;
    /**
     * Get current state
     */
    getState(): {
        files: any[];
        filteredFiles: any[];
        selectedFiles: any[];
        loading: boolean;
        sortBy: string;
        sortOrder: string;
        filter: string;
        view: string;
    };
    /**
     * Get selected files data
     */
    getSelectedFiles(): any[];
    /**
     * Render the file list (if needed for updates)
     */
    render(): void;
    /**
     * Emit custom event
     */
    emit(eventName: any, detail: any): void;
    /**
     * Destroy the controller
     */
    destroy(): void;
}
export default FileListController;
//# sourceMappingURL=file-list-controller.d.ts.map