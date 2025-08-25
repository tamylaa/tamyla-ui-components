/**
 * File List Molecule Controller
 * File display and selection behavior management
 */

export class FileListController {
  constructor(options = {}) {
    this.options = {
      selectable: true,
      multiSelect: false,
      showActions: false,
      sortable: true,
      filterable: true,
      dragAndDrop: false,
      defaultSortBy: 'name',
      defaultSortOrder: 'asc',
      ...options
    };

    this.element = null;
    this.files = [];
    this.filteredFiles = [];
    this.selectedFiles = new Set();
    this.draggedFiles = [];
    
    this.state = {
      loading: false,
      sortBy: this.options.defaultSortBy,
      sortOrder: this.options.defaultSortOrder,
      filter: '',
      view: 'list' // list, grid, compact
    };

    this.eventListeners = new Map();
  }

  /**
   * Initialize the file list controller
   */
  initialize(element) {
    if (!element) {
      throw new Error('FileList: Element is required for initialization');
    }

    this.element = element;
    this.bindEvents();
    this.setupAccessibility();
    this.setupDragAndDrop();

    return this;
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // File item interactions
    this.addEventListener(this.element, 'click', this.handleItemClick.bind(this));
    this.addEventListener(this.element, 'keydown', this.handleKeyDown.bind(this));
    this.addEventListener(this.element, 'change', this.handleCheckboxChange.bind(this));

    // Action button clicks
    this.addEventListener(this.element, 'click', this.handleActionClick.bind(this));

    // Selection management
    this.addEventListener(document, 'keydown', this.handleGlobalKeyDown.bind(this));
  }

  /**
   * Add event listener with cleanup tracking
   */
  addEventListener(element, type, handler) {
    element.addEventListener(type, handler);
    
    if (!this.eventListeners.has(element)) {
      this.eventListeners.set(element, []);
    }
    this.eventListeners.get(element).push({ type, handler });
  }

  /**
   * Setup accessibility attributes
   */
  setupAccessibility() {
    if (this.element) {
      this.element.setAttribute('role', 'listbox');
      this.element.setAttribute('aria-label', 'File list');
      
      if (this.options.multiSelect) {
        this.element.setAttribute('aria-multiselectable', 'true');
      }
    }
  }

  /**
   * Setup drag and drop if enabled
   */
  setupDragAndDrop() {
    if (!this.options.dragAndDrop) return;

    // File drop events
    this.addEventListener(this.element, 'dragover', this.handleDragOver.bind(this));
    this.addEventListener(this.element, 'dragleave', this.handleDragLeave.bind(this));
    this.addEventListener(this.element, 'drop', this.handleDrop.bind(this));

    // File item drag events
    this.addEventListener(this.element, 'dragstart', this.handleDragStart.bind(this));
    this.addEventListener(this.element, 'dragend', this.handleDragEnd.bind(this));
  }

  /**
   * Handle item click
   */
  handleItemClick(event) {
    const item = event.target.closest('.tmyl-file-list__item');
    if (!item || item.classList.contains('tmyl-file-list__item--disabled')) return;

    // Ignore clicks on action buttons or checkboxes
    if (event.target.closest('.tmyl-file-list__action, .tmyl-file-list__checkbox')) {
      return;
    }

    const fileId = item.dataset.fileId;
    const file = this.getFileById(fileId);
    
    if (!file) return;

    if (this.options.selectable) {
      if (this.options.multiSelect && (event.ctrlKey || event.metaKey)) {
        this.toggleSelection(fileId);
      } else if (this.options.multiSelect && event.shiftKey) {
        this.selectRange(fileId);
      } else {
        this.selectFile(fileId, !this.options.multiSelect);
      }
    }

    this.emit('fileClick', { file, fileId, event });
  }

  /**
   * Handle keyboard navigation
   */
  handleKeyDown(event) {
    const item = event.target.closest('.tmyl-file-list__item');
    if (!item) return;

    const fileId = item.dataset.fileId;
    
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (this.options.selectable) {
          this.toggleSelection(fileId);
        }
        this.emit('fileActivate', { fileId, file: this.getFileById(fileId) });
        break;

      case 'ArrowDown':
        event.preventDefault();
        this.focusNextItem(item);
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.focusPreviousItem(item);
        break;

      case 'Home':
        event.preventDefault();
        this.focusFirstItem();
        break;

      case 'End':
        event.preventDefault();
        this.focusLastItem();
        break;

      case 'Escape':
        this.clearSelection();
        break;
    }
  }

  /**
   * Handle checkbox change
   */
  handleCheckboxChange(event) {
    if (!event.target.classList.contains('tmyl-file-list__checkbox')) return;

    const item = event.target.closest('.tmyl-file-list__item');
    const fileId = item?.dataset.fileId;
    
    if (fileId) {
      if (event.target.checked) {
        this.selectFile(fileId, false);
      } else {
        this.deselectFile(fileId);
      }
    }
  }

  /**
   * Handle action button clicks
   */
  handleActionClick(event) {
    if (!event.target.classList.contains('tmyl-file-list__action')) return;

    event.stopPropagation();
    
    const item = event.target.closest('.tmyl-file-list__item');
    const action = event.target.dataset.action;
    const fileId = item?.dataset.fileId;
    const file = this.getFileById(fileId);

    if (file && action) {
      this.emit('fileAction', { action, file, fileId });
    }
  }

  /**
   * Handle global keyboard shortcuts
   */
  handleGlobalKeyDown(event) {
    if (!this.element.contains(document.activeElement)) return;

    if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
      event.preventDefault();
      this.selectAll();
    }
  }

  /**
   * Handle drag over
   */
  handleDragOver(event) {
    event.preventDefault();
    this.element.classList.add('tmyl-file-list--drag-over');
  }

  /**
   * Handle drag leave
   */
  handleDragLeave(event) {
    if (!this.element.contains(event.relatedTarget)) {
      this.element.classList.remove('tmyl-file-list--drag-over');
    }
  }

  /**
   * Handle file drop
   */
  handleDrop(event) {
    event.preventDefault();
    this.element.classList.remove('tmyl-file-list--drag-over');

    const files = Array.from(event.dataTransfer.files);
    if (files.length > 0) {
      this.emit('filesDropped', { files });
    }
  }

  /**
   * Handle drag start for file items
   */
  handleDragStart(event) {
    const item = event.target.closest('.tmyl-file-list__item');
    if (!item) return;

    const fileId = item.dataset.fileId;
    this.draggedFiles = this.selectedFiles.has(fileId) 
      ? Array.from(this.selectedFiles)
      : [fileId];

    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', this.draggedFiles.join(','));
  }

  /**
   * Handle drag end
   */
  handleDragEnd(event) {
    this.draggedFiles = [];
  }

  /**
   * Focus navigation helpers
   */
  focusNextItem(currentItem) {
    const items = this.getFileItems();
    const currentIndex = items.indexOf(currentItem);
    const nextItem = items[currentIndex + 1];
    
    if (nextItem) {
      nextItem.focus();
    }
  }

  focusPreviousItem(currentItem) {
    const items = this.getFileItems();
    const currentIndex = items.indexOf(currentItem);
    const prevItem = items[currentIndex - 1];
    
    if (prevItem) {
      prevItem.focus();
    }
  }

  focusFirstItem() {
    const items = this.getFileItems();
    if (items.length > 0) {
      items[0].focus();
    }
  }

  focusLastItem() {
    const items = this.getFileItems();
    if (items.length > 0) {
      items[items.length - 1].focus();
    }
  }

  /**
   * Get all file items
   */
  getFileItems() {
    return Array.from(this.element.querySelectorAll('.tmyl-file-list__item'));
  }

  /**
   * Selection management
   */
  selectFile(fileId, clearOthers = true) {
    if (clearOthers) {
      this.clearSelection();
    }
    
    this.selectedFiles.add(fileId);
    this.updateItemSelection(fileId, true);
    this.emit('selectionChange', { 
      selected: Array.from(this.selectedFiles),
      file: this.getFileById(fileId)
    });
  }

  deselectFile(fileId) {
    this.selectedFiles.delete(fileId);
    this.updateItemSelection(fileId, false);
    this.emit('selectionChange', { 
      selected: Array.from(this.selectedFiles)
    });
  }

  toggleSelection(fileId) {
    if (this.selectedFiles.has(fileId)) {
      this.deselectFile(fileId);
    } else {
      this.selectFile(fileId, !this.options.multiSelect);
    }
  }

  selectRange(endFileId) {
    const items = this.getFileItems();
    const selectedArray = Array.from(this.selectedFiles);
    const lastSelectedId = selectedArray[selectedArray.length - 1];
    
    if (!lastSelectedId) {
      this.selectFile(endFileId);
      return;
    }

    const startIndex = items.findIndex(item => item.dataset.fileId === lastSelectedId);
    const endIndex = items.findIndex(item => item.dataset.fileId === endFileId);
    
    if (startIndex !== -1 && endIndex !== -1) {
      const min = Math.min(startIndex, endIndex);
      const max = Math.max(startIndex, endIndex);
      
      for (let i = min; i <= max; i++) {
        const fileId = items[i].dataset.fileId;
        this.selectedFiles.add(fileId);
        this.updateItemSelection(fileId, true);
      }
      
      this.emit('selectionChange', { selected: Array.from(this.selectedFiles) });
    }
  }

  selectAll() {
    if (!this.options.multiSelect) return;

    this.clearSelection();
    
    this.filteredFiles.forEach(file => {
      const fileId = file.id || file.name;
      this.selectedFiles.add(fileId);
      this.updateItemSelection(fileId, true);
    });

    this.emit('selectionChange', { selected: Array.from(this.selectedFiles) });
  }

  clearSelection() {
    this.selectedFiles.forEach(fileId => {
      this.updateItemSelection(fileId, false);
    });
    
    this.selectedFiles.clear();
    this.emit('selectionChange', { selected: [] });
  }

  /**
   * Update item selection UI
   */
  updateItemSelection(fileId, selected) {
    const item = this.element.querySelector(`[data-file-id="${fileId}"]`);
    if (!item) return;

    item.classList.toggle('tmyl-file-list__item--selected', selected);
    item.setAttribute('aria-selected', selected.toString());

    const checkbox = item.querySelector('.tmyl-file-list__checkbox');
    if (checkbox) {
      checkbox.checked = selected;
    }
  }

  /**
   * File management
   */
  setFiles(files) {
    this.files = files;
    this.applyFilter();
    this.sort();
    this.render();
  }

  addFile(file) {
    this.files.push(file);
    this.applyFilter();
    this.sort();
    this.render();
  }

  removeFile(fileId) {
    this.files = this.files.filter(file => 
      (file.id || file.name) !== fileId
    );
    
    this.selectedFiles.delete(fileId);
    this.applyFilter();
    this.render();
  }

  updateFile(fileId, updates) {
    const file = this.files.find(f => (f.id || f.name) === fileId);
    if (file) {
      Object.assign(file, updates);
      this.applyFilter();
      this.sort();
      this.render();
    }
  }

  getFileById(fileId) {
    return this.files.find(file => (file.id || file.name) === fileId);
  }

  /**
   * Filtering and sorting
   */
  setFilter(filter) {
    this.state.filter = filter;
    this.applyFilter();
    this.render();
  }

  applyFilter() {
    if (!this.state.filter) {
      this.filteredFiles = [...this.files];
      return;
    }

    const filter = this.state.filter.toLowerCase();
    this.filteredFiles = this.files.filter(file => {
      return file.name?.toLowerCase().includes(filter) ||
             file.type?.toLowerCase().includes(filter);
    });
  }

  setSorting(sortBy, sortOrder = 'asc') {
    this.state.sortBy = sortBy;
    this.state.sortOrder = sortOrder;
    this.sort();
    this.render();
  }

  sort() {
    this.filteredFiles.sort((a, b) => {
      let aValue = a[this.state.sortBy];
      let bValue = b[this.state.sortBy];

      // Handle different data types
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue?.toLowerCase() || '';
      } else if (typeof aValue === 'number') {
        aValue = aValue || 0;
        bValue = bValue || 0;
      } else if (aValue instanceof Date) {
        aValue = aValue.getTime();
        bValue = bValue?.getTime() || 0;
      }

      let result = 0;
      if (aValue < bValue) result = -1;
      else if (aValue > bValue) result = 1;

      return this.state.sortOrder === 'desc' ? -result : result;
    });
  }

  /**
   * View management
   */
  setView(view) {
    this.state.view = view;
    this.element.className = this.element.className
      .replace(/tmyl-file-list--\w+/g, '')
      .trim();
    
    if (view !== 'list') {
      this.element.classList.add(`tmyl-file-list--${view}`);
    }
  }

  /**
   * Loading state
   */
  setLoading(loading = true) {
    this.state.loading = loading;
    this.element.classList.toggle('tmyl-file-list--loading', loading);
  }

  /**
   * Get current state
   */
  getState() {
    return {
      ...this.state,
      files: this.files,
      filteredFiles: this.filteredFiles,
      selectedFiles: Array.from(this.selectedFiles)
    };
  }

  /**
   * Get selected files data
   */
  getSelectedFiles() {
    return Array.from(this.selectedFiles).map(fileId => 
      this.getFileById(fileId)
    ).filter(Boolean);
  }

  /**
   * Render the file list (if needed for updates)
   */
  render() {
    // This would trigger a re-render with the current filtered files
    this.emit('render', { 
      files: this.filteredFiles,
      state: this.getState()
    });
  }

  /**
   * Emit custom event
   */
  emit(eventName, detail) {
    if (this.element) {
      const event = new CustomEvent(`tmyl-file-list:${eventName}`, {
        detail,
        bubbles: true,
        cancelable: true
      });

      this.element.dispatchEvent(event);
    }
  }

  /**
   * Destroy the controller
   */
  destroy() {
    // Remove event listeners
    this.eventListeners.forEach((listeners, element) => {
      listeners.forEach(({ type, handler }) => {
        element.removeEventListener(type, handler);
      });
    });

    this.eventListeners.clear();

    // Clear references
    this.element = null;
    this.files = [];
    this.filteredFiles = [];
    this.selectedFiles.clear();
  }
}

export default FileListController;
