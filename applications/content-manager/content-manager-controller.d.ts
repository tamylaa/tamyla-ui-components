/**
 * Content Manager Controller
 * Handles all business logic for content management application
 */
export class ContentManagerController {
    constructor(props?: {});
    props: {
        apiBase: string;
        uploadEndpoint: string;
        meilisearchUrl: string;
        maxFileSize: number;
        allowedFileTypes: string[];
        selectionMode: boolean;
        onContentLoad: null;
        onContentSelect: null;
        onContentUpload: null;
        onContentDelete: null;
        onAnalytics: null;
    };
    state: {
        content: never[];
        selectedContent: Set<any>;
        isLoading: boolean;
        currentView: string;
        sortBy: string;
        uploadProgress: Map<any, any>;
        searchApplication: null;
    };
    element: any;
    /**
     * Initialize controller with DOM element
     */
    initialize(element: any): this;
    /**
     * Setup event listeners
     */
    setupEventListeners(): void;
    /**
     * Load content from API
     */
    loadContent(): Promise<void>;
    /**
     * Handle file upload
     */
    handleFileUpload(event: any): Promise<void>;
    /**
     * Validate individual file
     */
    validateFile(file: any): boolean;
    /**
     * Upload single file
     */
    uploadFile(file: any): Promise<{
        success: boolean;
        file: any;
        result: any;
        error?: undefined;
    } | {
        success: boolean;
        file: any;
        error: any;
        result?: undefined;
    }>;
    /**
     * Update upload progress display
     */
    updateUploadProgress(): void;
    /**
     * Change view mode
     */
    changeView(view: any): void;
    /**
     * Change sort order
     */
    changeSortBy(sortBy: any): void;
    /**
     * Handle content selection
     */
    handleContentSelection(contentId: any, selected?: boolean): void;
    /**
     * Handle bulk actions
     */
    handleBulkAction(action: any): Promise<void>;
    /**
     * Download selected items
     */
    downloadSelectedItems(selectedItems: any): Promise<void>;
    /**
     * Share selected items
     */
    shareSelectedItems(selectedItems: any): Promise<void>;
    /**
     * Delete selected items
     */
    deleteSelectedItems(selectedItems: any): Promise<void>;
    /**
     * Update content display
     */
    updateContentDisplay(): void;
    /**
     * Update selection display
     */
    updateSelectionDisplay(): void;
    /**
     * Update content stats
     */
    updateContentStats(): void;
    /**
     * Set search application reference
     */
    setSearchApplication(searchApplication: any): void;
    /**
     * State management
     */
    setState(newState: any): void;
    getState(): {
        content: never[];
        selectedContent: Set<any>;
        isLoading: boolean;
        currentView: string;
        sortBy: string;
        uploadProgress: Map<any, any>;
        searchApplication: null;
    };
    /**
     * Utility functions
     */
    showSuccess(message: any): void;
    showError(message: any): void;
    /**
     * Cleanup
     */
    destroy(): void;
}
//# sourceMappingURL=content-manager-controller.d.ts.map