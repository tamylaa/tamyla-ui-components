/**
 * File List Factory
 * Creates modular file display components with management features
 */
export function FileListFactory(props?: {}): {
    render: (targetContainer?: any) => any;
    refresh: () => any;
    destroy: () => void;
    setFiles: (newFiles: any) => any;
    addFile: (file: any) => any;
    removeFile: (fileId: any) => any;
    updateFile: (fileId: any, updates: any) => any;
    getFiles: () => any;
    getFile: (fileId: any) => any;
    selectFile: (fileId: any, clearOthers?: boolean) => any;
    deselectFile: (fileId: any) => any;
    toggleSelection: (fileId: any) => any;
    selectAll: () => any;
    clearSelection: () => any;
    getSelectedFiles: () => any;
    setView: (newView: any) => any;
    setLayout: (newLayout: any) => any;
    setSize: (newSize: any) => any;
    setFilter: (filter: any) => any;
    setSorting: (sortBy: any, sortOrder?: string) => any;
    sort: (compareFn: any) => any;
    setLoading: (loading?: boolean) => any;
    setDisabled: (disabled?: boolean) => any;
    setPage: (page: any) => any;
    setPageSize: (size: any) => any;
    getController: () => any;
    getElement: () => any;
    getState: () => any;
    isLoading: () => any;
};
/**
 * Convenience functions for common file list types
 */
/**
 * Create simple file list
 */
export function createSimpleFileList(files: any, options?: {}): {
    render: (targetContainer?: any) => any;
    refresh: () => any;
    destroy: () => void;
    setFiles: (newFiles: any) => any;
    addFile: (file: any) => any;
    removeFile: (fileId: any) => any;
    updateFile: (fileId: any, updates: any) => any;
    getFiles: () => any;
    getFile: (fileId: any) => any;
    selectFile: (fileId: any, clearOthers?: boolean) => any;
    deselectFile: (fileId: any) => any;
    toggleSelection: (fileId: any) => any;
    selectAll: () => any;
    clearSelection: () => any;
    getSelectedFiles: () => any;
    setView: (newView: any) => any;
    setLayout: (newLayout: any) => any;
    setSize: (newSize: any) => any;
    setFilter: (filter: any) => any;
    setSorting: (sortBy: any, sortOrder?: string) => any;
    sort: (compareFn: any) => any;
    setLoading: (loading?: boolean) => any;
    setDisabled: (disabled?: boolean) => any;
    setPage: (page: any) => any;
    setPageSize: (size: any) => any;
    getController: () => any;
    getElement: () => any;
    getState: () => any;
    isLoading: () => any;
};
/**
 * Create file grid
 */
export function createFileGrid(files: any, options?: {}): {
    render: (targetContainer?: any) => any;
    refresh: () => any;
    destroy: () => void;
    setFiles: (newFiles: any) => any;
    addFile: (file: any) => any;
    removeFile: (fileId: any) => any;
    updateFile: (fileId: any, updates: any) => any;
    getFiles: () => any;
    getFile: (fileId: any) => any;
    selectFile: (fileId: any, clearOthers?: boolean) => any;
    deselectFile: (fileId: any) => any;
    toggleSelection: (fileId: any) => any;
    selectAll: () => any;
    clearSelection: () => any;
    getSelectedFiles: () => any;
    setView: (newView: any) => any;
    setLayout: (newLayout: any) => any;
    setSize: (newSize: any) => any;
    setFilter: (filter: any) => any;
    setSorting: (sortBy: any, sortOrder?: string) => any;
    sort: (compareFn: any) => any;
    setLoading: (loading?: boolean) => any;
    setDisabled: (disabled?: boolean) => any;
    setPage: (page: any) => any;
    setPageSize: (size: any) => any;
    getController: () => any;
    getElement: () => any;
    getState: () => any;
    isLoading: () => any;
};
/**
 * Create file picker
 */
export function createFilePicker(files: any, options?: {}): {
    render: (targetContainer?: any) => any;
    refresh: () => any;
    destroy: () => void;
    setFiles: (newFiles: any) => any;
    addFile: (file: any) => any;
    removeFile: (fileId: any) => any;
    updateFile: (fileId: any, updates: any) => any;
    getFiles: () => any;
    getFile: (fileId: any) => any;
    selectFile: (fileId: any, clearOthers?: boolean) => any;
    deselectFile: (fileId: any) => any;
    toggleSelection: (fileId: any) => any;
    selectAll: () => any;
    clearSelection: () => any;
    getSelectedFiles: () => any;
    setView: (newView: any) => any;
    setLayout: (newLayout: any) => any;
    setSize: (newSize: any) => any;
    setFilter: (filter: any) => any;
    setSorting: (sortBy: any, sortOrder?: string) => any;
    sort: (compareFn: any) => any;
    setLoading: (loading?: boolean) => any;
    setDisabled: (disabled?: boolean) => any;
    setPage: (page: any) => any;
    setPageSize: (size: any) => any;
    getController: () => any;
    getElement: () => any;
    getState: () => any;
    isLoading: () => any;
};
/**
 * Create drag-drop file manager
 */
export function createFileManager(files?: any[], options?: {}): {
    render: (targetContainer?: any) => any;
    refresh: () => any;
    destroy: () => void;
    setFiles: (newFiles: any) => any;
    addFile: (file: any) => any;
    removeFile: (fileId: any) => any;
    updateFile: (fileId: any, updates: any) => any;
    getFiles: () => any;
    getFile: (fileId: any) => any;
    selectFile: (fileId: any, clearOthers?: boolean) => any;
    deselectFile: (fileId: any) => any;
    toggleSelection: (fileId: any) => any;
    selectAll: () => any;
    clearSelection: () => any;
    getSelectedFiles: () => any;
    setView: (newView: any) => any;
    setLayout: (newLayout: any) => any;
    setSize: (newSize: any) => any;
    setFilter: (filter: any) => any;
    setSorting: (sortBy: any, sortOrder?: string) => any;
    sort: (compareFn: any) => any;
    setLoading: (loading?: boolean) => any;
    setDisabled: (disabled?: boolean) => any;
    setPage: (page: any) => any;
    setPageSize: (size: any) => any;
    getController: () => any;
    getElement: () => any;
    getState: () => any;
    isLoading: () => any;
};
/**
 * File List Manager for handling multiple file lists
 */
export class FileListManager {
    fileLists: Map<any, any>;
    /**
     * Add file list to manager
     */
    add(name: any, fileList: any): this;
    /**
     * Remove file list from manager
     */
    remove(name: any): this;
    /**
     * Get file list by name
     */
    get(name: any): any;
    /**
     * Get all selected files across all lists
     */
    getAllSelectedFiles(): any[];
    /**
     * Clear all selections
     */
    clearAllSelections(): this;
    /**
     * Set loading state for all lists
     */
    setAllLoading(loading?: boolean): this;
    /**
     * Destroy all file lists
     */
    destroyAll(): void;
}
export namespace fileList {
    function simple(files: any, options: any): {
        render: (targetContainer?: any) => any;
        refresh: () => any;
        destroy: () => void;
        setFiles: (newFiles: any) => any;
        addFile: (file: any) => any;
        removeFile: (fileId: any) => any;
        updateFile: (fileId: any, updates: any) => any;
        getFiles: () => any;
        getFile: (fileId: any) => any;
        selectFile: (fileId: any, clearOthers?: boolean) => any;
        deselectFile: (fileId: any) => any;
        toggleSelection: (fileId: any) => any;
        selectAll: () => any;
        clearSelection: () => any;
        getSelectedFiles: () => any;
        setView: (newView: any) => any;
        setLayout: (newLayout: any) => any;
        setSize: (newSize: any) => any;
        setFilter: (filter: any) => any;
        setSorting: (sortBy: any, sortOrder?: string) => any;
        sort: (compareFn: any) => any;
        setLoading: (loading?: boolean) => any;
        setDisabled: (disabled?: boolean) => any;
        setPage: (page: any) => any;
        setPageSize: (size: any) => any;
        getController: () => any;
        getElement: () => any;
        getState: () => any;
        isLoading: () => any;
    };
    function grid(files: any, options: any): {
        render: (targetContainer?: any) => any;
        refresh: () => any;
        destroy: () => void;
        setFiles: (newFiles: any) => any;
        addFile: (file: any) => any;
        removeFile: (fileId: any) => any;
        updateFile: (fileId: any, updates: any) => any;
        getFiles: () => any;
        getFile: (fileId: any) => any;
        selectFile: (fileId: any, clearOthers?: boolean) => any;
        deselectFile: (fileId: any) => any;
        toggleSelection: (fileId: any) => any;
        selectAll: () => any;
        clearSelection: () => any;
        getSelectedFiles: () => any;
        setView: (newView: any) => any;
        setLayout: (newLayout: any) => any;
        setSize: (newSize: any) => any;
        setFilter: (filter: any) => any;
        setSorting: (sortBy: any, sortOrder?: string) => any;
        sort: (compareFn: any) => any;
        setLoading: (loading?: boolean) => any;
        setDisabled: (disabled?: boolean) => any;
        setPage: (page: any) => any;
        setPageSize: (size: any) => any;
        getController: () => any;
        getElement: () => any;
        getState: () => any;
        isLoading: () => any;
    };
    function picker(files: any, options: any): {
        render: (targetContainer?: any) => any;
        refresh: () => any;
        destroy: () => void;
        setFiles: (newFiles: any) => any;
        addFile: (file: any) => any;
        removeFile: (fileId: any) => any;
        updateFile: (fileId: any, updates: any) => any;
        getFiles: () => any;
        getFile: (fileId: any) => any;
        selectFile: (fileId: any, clearOthers?: boolean) => any;
        deselectFile: (fileId: any) => any;
        toggleSelection: (fileId: any) => any;
        selectAll: () => any;
        clearSelection: () => any;
        getSelectedFiles: () => any;
        setView: (newView: any) => any;
        setLayout: (newLayout: any) => any;
        setSize: (newSize: any) => any;
        setFilter: (filter: any) => any;
        setSorting: (sortBy: any, sortOrder?: string) => any;
        sort: (compareFn: any) => any;
        setLoading: (loading?: boolean) => any;
        setDisabled: (disabled?: boolean) => any;
        setPage: (page: any) => any;
        setPageSize: (size: any) => any;
        getController: () => any;
        getElement: () => any;
        getState: () => any;
        isLoading: () => any;
    };
    function manager(files: any, options: any): {
        render: (targetContainer?: any) => any;
        refresh: () => any;
        destroy: () => void;
        setFiles: (newFiles: any) => any;
        addFile: (file: any) => any;
        removeFile: (fileId: any) => any;
        updateFile: (fileId: any, updates: any) => any;
        getFiles: () => any;
        getFile: (fileId: any) => any;
        selectFile: (fileId: any, clearOthers?: boolean) => any;
        deselectFile: (fileId: any) => any;
        toggleSelection: (fileId: any) => any;
        selectAll: () => any;
        clearSelection: () => any;
        getSelectedFiles: () => any;
        setView: (newView: any) => any;
        setLayout: (newLayout: any) => any;
        setSize: (newSize: any) => any;
        setFilter: (filter: any) => any;
        setSorting: (sortBy: any, sortOrder?: string) => any;
        sort: (compareFn: any) => any;
        setLoading: (loading?: boolean) => any;
        setDisabled: (disabled?: boolean) => any;
        setPage: (page: any) => any;
        setPageSize: (size: any) => any;
        getController: () => any;
        getElement: () => any;
        getState: () => any;
        isLoading: () => any;
    };
}
export default FileListFactory;
//# sourceMappingURL=file-list-system.d.ts.map