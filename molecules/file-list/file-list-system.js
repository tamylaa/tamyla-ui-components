/**
 * File List Molecule System
 * Complete file display and management factory
 */

import {
  createFileListTemplate,
  createFileItem,
  createDragDropFileList,
  createPaginatedFileList
} from './file-list-template.js';
import { FileListController } from './file-list-controller.js';

/**
 * File List Factory
 * Creates modular file display components with management features
 */
export function FileListFactory(props = {}) {
  const {
    // Data
    files = [],
    
    // Display options
    layout = 'list', // list, grid, compact
    size = 'medium', // small, medium, large
    showSize = true,
    showDate = false,
    showType = false,
    showCheckboxes = false,
    showActions = false,
    
    // Behavior
    selectable = true,
    multiSelect = false,
    sortable = true,
    filterable = true,
    dragAndDrop = false,
    
    // Selection
    selected = [],
    
    // Pagination
    paginated = false,
    itemsPerPage = 10,
    currentPage = 1,
    
    // States
    loading = false,
    disabled = false,
    
    // Messages
    emptyMessage = 'No files found',
    emptySubtext = 'Upload files to get started',
    
    // Sorting
    defaultSortBy = 'name',
    defaultSortOrder = 'asc',
    
    // Event handlers
    onFileClick,
    onFileSelect,
    onFileAction,
    onFilesDropped,
    onSelectionChange,
    
    // Container
    container = null,
    id = ''
  } = props;

  let element = null;
  let controller = null;

  /**
   * Factory API
   */
  const factory = {
    // Core methods
    render,
    refresh,
    destroy,
    
    // File management
    setFiles,
    addFile,
    removeFile,
    updateFile,
    getFiles,
    getFile,
    
    // Selection management
    selectFile,
    deselectFile,
    toggleSelection,
    selectAll,
    clearSelection,
    getSelectedFiles,
    
    // View management
    setView,
    setLayout,
    setSize,
    
    // Filtering and sorting
    setFilter,
    setSorting,
    sort,
    
    // State management
    setLoading,
    setDisabled,
    
    // Pagination
    setPage,
    setPageSize,
    
    // Getters
    getController: () => controller,
    getElement: () => element,
    getState: () => controller?.getState() || {},
    isLoading: () => controller?.getState().loading || false
  };

  /**
   * Render the file list
   */
  function render(targetContainer = container) {
    // Create element
    element = createElement();
    
    // Initialize controller
    controller = new FileListController({
      selectable,
      multiSelect,
      showActions,
      sortable,
      filterable,
      dragAndDrop,
      defaultSortBy,
      defaultSortOrder
    });
    
    controller.initialize(element);

    // Set initial files
    if (files.length > 0) {
      controller.setFiles(files);
    }

    // Set initial selection
    if (selected.length > 0) {
      selected.forEach(fileId => {
        controller.selectFile(fileId, false);
      });
    }

    // Bind event handlers
    bindEventHandlers();

    // Load CSS
    loadStyles();

    // Add to container
    if (typeof targetContainer === 'string') {
      targetContainer = document.querySelector(targetContainer);
    }
    
    if (targetContainer) {
      targetContainer.appendChild(element);
    }

    return factory;
  }

  /**
   * Create file list element
   */
  function createElement() {
    const listId = id || `file-list-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    let template;

    if (dragAndDrop) {
      template = createDragDropFileList({
        files,
        layout,
        size,
        showSize,
        showDate,
        showType,
        showCheckboxes,
        showActions,
        selectable,
        multiSelect,
        selected,
        disabled,
        loading,
        emptyMessage,
        emptySubtext,
        id: listId
      });
    } else if (paginated) {
      const totalPages = Math.ceil(files.length / itemsPerPage);
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const pageFiles = files.slice(startIndex, endIndex);

      template = createPaginatedFileList({
        files: pageFiles,
        currentPage,
        totalPages,
        itemsPerPage,
        totalItems: files.length,
        layout,
        size,
        showSize,
        showDate,
        showType,
        showCheckboxes,
        showActions,
        selectable,
        multiSelect,
        selected,
        disabled,
        loading,
        emptyMessage,
        emptySubtext,
        id: listId
      });
    } else {
      template = createFileListTemplate({
        files,
        layout,
        size,
        showSize,
        showDate,
        showType,
        showCheckboxes,
        showActions,
        selectable,
        multiSelect,
        selected,
        disabled,
        loading,
        emptyMessage,
        emptySubtext,
        id: listId
      });
    }
    
    const wrapper = document.createElement('div');
    wrapper.innerHTML = template;
    
    return wrapper.firstElementChild;
  }

  /**
   * Bind event handlers
   */
  function bindEventHandlers() {
    if (!element) return;

    // File interactions
    element.addEventListener('tmyl-file-list:fileClick', (e) => {
      if (onFileClick) onFileClick(e.detail);
    });

    element.addEventListener('tmyl-file-list:fileActivate', (e) => {
      if (onFileSelect) onFileSelect(e.detail);
    });

    element.addEventListener('tmyl-file-list:fileAction', (e) => {
      if (onFileAction) onFileAction(e.detail);
    });

    element.addEventListener('tmyl-file-list:filesDropped', (e) => {
      if (onFilesDropped) onFilesDropped(e.detail);
    });

    element.addEventListener('tmyl-file-list:selectionChange', (e) => {
      if (onSelectionChange) onSelectionChange(e.detail);
    });

    // Pagination events
    if (paginated) {
      element.addEventListener('click', (e) => {
        if (e.target.classList.contains('tmyl-pagination-btn--prev')) {
          setPage(Math.max(1, currentPage - 1));
        } else if (e.target.classList.contains('tmyl-pagination-btn--next')) {
          const totalPages = Math.ceil(files.length / itemsPerPage);
          setPage(Math.min(totalPages, currentPage + 1));
        }
      });

      const pageSizeSelect = element.querySelector('.tmyl-pagination-size');
      if (pageSizeSelect) {
        pageSizeSelect.addEventListener('change', (e) => {
          setPageSize(parseInt(e.target.value));
        });
      }
    }
  }

  /**
   * Load component styles
   */
  function loadStyles() {
    const styleId = 'tmyl-file-list-styles';
    
    if (!document.getElementById(styleId)) {
      const link = document.createElement('link');
      link.id = styleId;
      link.rel = 'stylesheet';
      link.href = new URL('./file-list.css', import.meta.url).href;
      document.head.appendChild(link);
    }
  }

  /**
   * Refresh the file list display
   */
  function refresh() {
    if (controller) {
      controller.render();
    }
    return factory;
  }

  /**
   * File management methods
   */
  function setFiles(newFiles) {
    if (controller) {
      controller.setFiles(newFiles);
    }
    return factory;
  }

  function addFile(file) {
    if (controller) {
      controller.addFile(file);
    }
    return factory;
  }

  function removeFile(fileId) {
    if (controller) {
      controller.removeFile(fileId);
    }
    return factory;
  }

  function updateFile(fileId, updates) {
    if (controller) {
      controller.updateFile(fileId, updates);
    }
    return factory;
  }

  function getFiles() {
    return controller ? controller.getState().files : [];
  }

  function getFile(fileId) {
    return controller ? controller.getFileById(fileId) : null;
  }

  /**
   * Selection management methods
   */
  function selectFile(fileId, clearOthers = false) {
    if (controller) {
      controller.selectFile(fileId, clearOthers);
    }
    return factory;
  }

  function deselectFile(fileId) {
    if (controller) {
      controller.deselectFile(fileId);
    }
    return factory;
  }

  function toggleSelection(fileId) {
    if (controller) {
      controller.toggleSelection(fileId);
    }
    return factory;
  }

  function selectAll() {
    if (controller) {
      controller.selectAll();
    }
    return factory;
  }

  function clearSelection() {
    if (controller) {
      controller.clearSelection();
    }
    return factory;
  }

  function getSelectedFiles() {
    return controller ? controller.getSelectedFiles() : [];
  }

  /**
   * View management methods
   */
  function setView(newView) {
    if (controller) {
      controller.setView(newView);
    }
    return factory;
  }

  function setLayout(newLayout) {
    return setView(newLayout);
  }

  function setSize(newSize) {
    if (element) {
      element.className = element.className
        .replace(/tmyl-file-list--\w+/g, '')
        .trim();
      
      if (newSize !== 'medium') {
        element.classList.add(`tmyl-file-list--${newSize}`);
      }
    }
    return factory;
  }

  /**
   * Filtering and sorting methods
   */
  function setFilter(filter) {
    if (controller) {
      controller.setFilter(filter);
    }
    return factory;
  }

  function setSorting(sortBy, sortOrder = 'asc') {
    if (controller) {
      controller.setSorting(sortBy, sortOrder);
    }
    return factory;
  }

  function sort(compareFn) {
    if (controller && compareFn) {
      const files = controller.getState().files;
      files.sort(compareFn);
      controller.setFiles(files);
    }
    return factory;
  }

  /**
   * State management methods
   */
  function setLoading(loading = true) {
    if (controller) {
      controller.setLoading(loading);
    }
    return factory;
  }

  function setDisabled(disabled = true) {
    if (element) {
      element.classList.toggle('tmyl-file-list--disabled', disabled);
    }
    return factory;
  }

  /**
   * Pagination methods
   */
  function setPage(page) {
    if (paginated) {
      currentPage = page;
      // Re-render with new page
      const newElement = createElement();
      element.parentNode?.replaceChild(newElement, element);
      element = newElement;
      controller.initialize(element);
      bindEventHandlers();
    }
    return factory;
  }

  function setPageSize(size) {
    if (paginated) {
      itemsPerPage = size;
      currentPage = 1; // Reset to first page
      setPage(1);
    }
    return factory;
  }

  /**
   * Destroy the file list
   */
  function destroy() {
    if (controller) {
      controller.destroy();
      controller = null;
    }

    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
    
    element = null;
  }

  return factory;
}

/**
 * Convenience functions for common file list types
 */

/**
 * Create simple file list
 */
export function createSimpleFileList(files, options = {}) {
  return FileListFactory({
    files,
    layout: 'list',
    selectable: true,
    showSize: true,
    ...options
  });
}

/**
 * Create file grid
 */
export function createFileGrid(files, options = {}) {
  return FileListFactory({
    files,
    layout: 'grid',
    selectable: true,
    showSize: true,
    showType: true,
    ...options
  });
}

/**
 * Create file picker
 */
export function createFilePicker(files, options = {}) {
  return FileListFactory({
    files,
    layout: 'list',
    selectable: true,
    multiSelect: true,
    showCheckboxes: true,
    showSize: true,
    showDate: true,
    ...options
  });
}

/**
 * Create drag-drop file manager
 */
export function createFileManager(files = [], options = {}) {
  return FileListFactory({
    files,
    layout: 'list',
    selectable: true,
    multiSelect: true,
    showCheckboxes: true,
    showActions: true,
    dragAndDrop: true,
    showSize: true,
    showDate: true,
    showType: true,
    ...options
  });
}

/**
 * File List Manager for handling multiple file lists
 */
export class FileListManager {
  constructor() {
    this.fileLists = new Map();
  }

  /**
   * Add file list to manager
   */
  add(name, fileList) {
    this.fileLists.set(name, fileList);
    return this;
  }

  /**
   * Remove file list from manager
   */
  remove(name) {
    const fileList = this.fileLists.get(name);
    if (fileList) {
      fileList.destroy();
      this.fileLists.delete(name);
    }
    return this;
  }

  /**
   * Get file list by name
   */
  get(name) {
    return this.fileLists.get(name);
  }

  /**
   * Get all selected files across all lists
   */
  getAllSelectedFiles() {
    const allSelected = [];
    
    this.fileLists.forEach((fileList, name) => {
      const selected = fileList.getSelectedFiles();
      if (selected.length > 0) {
        allSelected.push({ name, files: selected });
      }
    });

    return allSelected;
  }

  /**
   * Clear all selections
   */
  clearAllSelections() {
    this.fileLists.forEach(fileList => {
      fileList.clearSelection();
    });
    return this;
  }

  /**
   * Set loading state for all lists
   */
  setAllLoading(loading = true) {
    this.fileLists.forEach(fileList => {
      fileList.setLoading(loading);
    });
    return this;
  }

  /**
   * Destroy all file lists
   */
  destroyAll() {
    this.fileLists.forEach(fileList => {
      fileList.destroy();
    });
    
    this.fileLists.clear();
  }
}

// Default convenience functions
export const fileList = {
  simple: (files, options) => createSimpleFileList(files, options),
  grid: (files, options) => createFileGrid(files, options),
  picker: (files, options) => createFilePicker(files, options),
  manager: (files, options) => createFileManager(files, options)
};

export default FileListFactory;
