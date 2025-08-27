/**
 * Content Manager Application Factory
 * Creates modular content management applications with separated concerns
 */
export function ContentManagerApplicationFactory(props?: {}): {
    render: (targetContainer?: any) => any;
    destroy: () => void;
    getController: () => any;
    getSearchInterface: () => any;
    getElement: () => any;
    loadContent: () => any;
    refreshContent: () => any;
    getSelectedContent: () => any;
    clearSelection: () => any;
    changeView: (view: any) => any;
    changeSortBy: (sortBy: any) => any;
    triggerUpload: () => any;
    getUploadProgress: () => any;
};
/**
 * Utility function to create basic content manager
 */
export function createBasicContentManager(container: any, options?: {}): {
    render: (targetContainer?: any) => any;
    destroy: () => void;
    getController: () => any;
    getSearchInterface: () => any;
    getElement: () => any;
    loadContent: () => any;
    refreshContent: () => any;
    getSelectedContent: () => any;
    clearSelection: () => any;
    changeView: (view: any) => any;
    changeSortBy: (sortBy: any) => any;
    triggerUpload: () => any;
    getUploadProgress: () => any;
};
export namespace ContentManagerTemplates {
    function knowledgeBase(props?: {}): {
        render: (targetContainer?: any) => any;
        destroy: () => void;
        getController: () => any;
        getSearchInterface: () => any;
        getElement: () => any;
        loadContent: () => any;
        refreshContent: () => any;
        getSelectedContent: () => any;
        clearSelection: () => any;
        changeView: (view: any) => any;
        changeSortBy: (sortBy: any) => any;
        triggerUpload: () => any;
        getUploadProgress: () => any;
    };
    function mediaLibrary(props?: {}): {
        render: (targetContainer?: any) => any;
        destroy: () => void;
        getController: () => any;
        getSearchInterface: () => any;
        getElement: () => any;
        loadContent: () => any;
        refreshContent: () => any;
        getSelectedContent: () => any;
        clearSelection: () => any;
        changeView: (view: any) => any;
        changeSortBy: (sortBy: any) => any;
        triggerUpload: () => any;
        getUploadProgress: () => any;
    };
    function documentArchive(props?: {}): {
        render: (targetContainer?: any) => any;
        destroy: () => void;
        getController: () => any;
        getSearchInterface: () => any;
        getElement: () => any;
        loadContent: () => any;
        refreshContent: () => any;
        getSelectedContent: () => any;
        clearSelection: () => any;
        changeView: (view: any) => any;
        changeSortBy: (sortBy: any) => any;
        triggerUpload: () => any;
        getUploadProgress: () => any;
    };
}
export default ContentManagerApplicationFactory;
//# sourceMappingURL=content-manager-system.d.ts.map