/**
 * Content Manager Application Controller
 * Business logic and interaction handling for content management
 */

import {
  createUploadProgressTemplate,
  createContentStatsTemplate,
  createEmptyStateTemplate,
  createLoadingTemplate
} from './content-manager-template.js';

/**
 * Content Manager Controller
 * Handles all business logic for content management application
 */
export class ContentManagerController {
  constructor(props = {}) {
    this.props = {
      // API Configuration
      apiBase: '/api/content',
      uploadEndpoint: '/api/upload',
      meilisearchUrl: '/api/search',

      // Feature Configuration
      maxFileSize: 25 * 1024 * 1024, // 25MB
      allowedFileTypes: ['pdf', 'doc', 'docx', 'txt', 'md', 'jpg', 'png', 'mp4', 'mp3'],
      selectionMode: true,

      // Event Handlers
      onContentLoad: null,
      onContentSelect: null,
      onContentUpload: null,
      onContentDelete: null,
      onAnalytics: null,

      ...props
    };

    this.state = {
      content: [],
      selectedContent: new Set(),
      isLoading: false,
      currentView: 'grid',
      sortBy: 'relevance',
      uploadProgress: new Map(),
      searchApplication: null
    };

    this.element = null;
  }

  /**
   * Initialize controller with DOM element
   */
  initialize(element) {
    this.element = element;
    this.setupEventListeners();
    this.loadContent();
    return this;
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    if (!this.element) return;

    // File upload
    const fileInput = this.element.querySelector('#file-upload');
    if (fileInput) {
      fileInput.addEventListener('change', this.handleFileUpload.bind(this));
    }

    // View controls
    const viewButtons = this.element.querySelectorAll('.view-button');
    viewButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const view = e.currentTarget.dataset.view;
        this.changeView(view);
      });
    });

    // Sort control
    const sortSelect = this.element.querySelector('.content-manager__sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.changeSortBy(e.target.value);
      });
    }

    // Selection actions
    const actionButtons = this.element.querySelectorAll('.action-button');
    actionButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const action = e.currentTarget.dataset.action;
        this.handleBulkAction(action);
      });
    });
  }

  /**
   * Load content from API
   */
  async loadContent() {
    this.setState({ isLoading: true });
    this.updateContentDisplay();

    try {
      const response = await fetch(`${this.props.apiBase}/list`);
      if (!response.ok) {
        throw new Error(`Failed to load content: ${response.statusText}`);
      }

      const content = await response.json();
      this.setState({
        content: content.items || [],
        isLoading: false
      });

      this.updateContentDisplay();

      if (this.props.onContentLoad) {
        this.props.onContentLoad(content);
      }

    } catch (error) {
      console.error('Error loading content:', error);
      this.setState({ isLoading: false });
      this.showError('Failed to load content. Please try again.');
    }
  }

  /**
   * Handle file upload
   */
  async handleFileUpload(event) {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    // Validate files
    const validFiles = files.filter(file => this.validateFile(file));
    if (validFiles.length === 0) {
      this.showError('No valid files selected. Please check file types and sizes.');
      return;
    }

    if (validFiles.length !== files.length) {
      this.showError(`${files.length - validFiles.length} files were skipped due to validation errors.`);
    }

    // Upload files
    const uploadPromises = validFiles.map(file => this.uploadFile(file));

    try {
      const results = await Promise.allSettled(uploadPromises);
      const successfulUploads = results
        .filter(result => result.status === 'fulfilled' && result.value.success)
        .map(result => result.value);

      if (successfulUploads.length > 0) {
        this.showSuccess(`Successfully uploaded ${successfulUploads.length} file(s).`);

        // Refresh content
        await this.loadContent();

        if (this.props.onContentUpload) {
          this.props.onContentUpload(successfulUploads);
        }
      }
    } catch (error) {
      this.showError('Some files failed to upload. Please try again.');
    }

    // Clear file input
    event.target.value = '';
  }

  /**
   * Validate individual file
   */
  validateFile(file) {
    // Check file size
    if (file.size > this.props.maxFileSize) {
      console.warn(`File ${file.name} exceeds maximum size limit`);
      return false;
    }

    // Check file type
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!this.props.allowedFileTypes.includes(extension)) {
      console.warn(`File ${file.name} has unsupported file type`);
      return false;
    }

    return true;
  }

  /**
   * Upload single file
   */
  async uploadFile(file) {
    const uploadId = `upload-${Date.now()}-${Math.random()}`;
    this.state.uploadProgress.set(uploadId, { file, progress: 0 });
    this.updateUploadProgress();

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('metadata', JSON.stringify({
        originalName: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString()
      }));

      const response = await fetch(this.props.uploadEndpoint, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();

      this.state.uploadProgress.delete(uploadId);
      this.updateUploadProgress();

      return { success: true, file, result };
    } catch (error) {
      console.error('Upload error:', error);
      this.state.uploadProgress.delete(uploadId);
      this.updateUploadProgress();

      return { success: false, file, error: error.message };
    }
  }

  /**
   * Update upload progress display
   */
  updateUploadProgress() {
    const progressContainer = this.element?.querySelector('#upload-progress');
    if (!progressContainer) return;

    const uploads = Array.from(this.state.uploadProgress.values());

    if (uploads.length === 0) {
      progressContainer.style.display = 'none';
      return;
    }

    progressContainer.style.display = 'block';
    progressContainer.innerHTML = createUploadProgressTemplate(uploads);
  }

  /**
   * Change view mode
   */
  changeView(view) {
    this.setState({ currentView: view });

    // Update button states
    const viewButtons = this.element?.querySelectorAll('.view-button');
    viewButtons?.forEach(button => {
      button.classList.toggle('view-button--active', button.dataset.view === view);
    });

    // Update content display
    this.updateContentDisplay();

    if (this.props.onAnalytics) {
      this.props.onAnalytics({
        type: 'view_change',
        view,
        timestamp: Date.now()
      });
    }
  }

  /**
   * Change sort order
   */
  changeSortBy(sortBy) {
    this.setState({ sortBy });

    // Apply sorting to search interface if available
    if (this.state.searchApplication) {
      const controller = this.state.searchApplication.getSearchInterface()?.getController();
      if (controller) {
        // Trigger re-search with new sort order
        const currentState = controller.getState();
        controller.search(currentState.query);
      }
    }

    this.updateContentDisplay();
  }

  /**
   * Handle content selection
   */
  handleContentSelection(contentId, selected = true) {
    if (selected) {
      this.state.selectedContent.add(contentId);
    } else {
      this.state.selectedContent.delete(contentId);
    }

    this.updateSelectionDisplay();

    if (this.props.onContentSelect) {
      this.props.onContentSelect({
        contentId,
        selected,
        selectedItems: Array.from(this.state.selectedContent)
      });
    }
  }

  /**
   * Handle bulk actions
   */
  async handleBulkAction(action) {
    const selectedItems = Array.from(this.state.selectedContent);
    if (selectedItems.length === 0) return;

    try {
      switch (action) {
      case 'download':
        await this.downloadSelectedItems(selectedItems);
        break;
      case 'share':
        await this.shareSelectedItems(selectedItems);
        break;
      case 'delete':
        await this.deleteSelectedItems(selectedItems);
        break;
      default:
        console.warn(`Unknown bulk action: ${action}`);
      }
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
      this.showError(`Failed to ${action} selected items.`);
    }
  }

  /**
   * Download selected items
   */
  async downloadSelectedItems(selectedItems) {
    // Implementation depends on API
    console.log('Downloading items:', selectedItems);
    this.showSuccess(`Started download of ${selectedItems.length} items.`);
  }

  /**
   * Share selected items
   */
  async shareSelectedItems(selectedItems) {
    // Implementation depends on sharing system
    console.log('Sharing items:', selectedItems);
    this.showSuccess(`Generated share links for ${selectedItems.length} items.`);
  }

  /**
   * Delete selected items
   */
  async deleteSelectedItems(selectedItems) {
    if (!confirm(`Are you sure you want to delete ${selectedItems.length} items?`)) {
      return;
    }

    try {
      const response = await fetch(`${this.props.apiBase}/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: selectedItems })
      });

      if (!response.ok) {
        throw new Error(`Delete failed: ${response.statusText}`);
      }

      // Remove from local state
      this.state.content = this.state.content.filter(
        item => !selectedItems.includes(item.id)
      );
      this.state.selectedContent.clear();

      this.updateContentDisplay();
      this.updateSelectionDisplay();
      this.showSuccess(`Deleted ${selectedItems.length} items.`);

      if (this.props.onContentDelete) {
        this.props.onContentDelete(selectedItems);
      }

    } catch (error) {
      throw error;
    }
  }

  /**
   * Update content display
   */
  updateContentDisplay() {
    const contentSection = this.element?.querySelector('.content-manager__results');
    if (!contentSection) return;

    if (this.state.isLoading) {
      contentSection.innerHTML = createLoadingTemplate();
      return;
    }

    if (this.state.content.length === 0) {
      contentSection.innerHTML = createEmptyStateTemplate();
      return;
    }

    // Content will be managed by search application
    // This is a placeholder for when content is displayed directly
    contentSection.innerHTML = '';
  }

  /**
   * Update selection display
   */
  updateSelectionDisplay() {
    const selectionActions = this.element?.querySelector('.content-manager__selection-actions');
    const selectionCount = this.element?.querySelector('.selection-count');

    if (!selectionActions || !selectionCount) return;

    const count = this.state.selectedContent.size;

    if (count > 0) {
      selectionActions.style.display = 'flex';
      selectionCount.textContent = `${count} selected`;
    } else {
      selectionActions.style.display = 'none';
    }
  }

  /**
   * Update content stats
   */
  updateContentStats() {
    const statsContainer = this.element?.querySelector('.content-stats');
    if (!statsContainer) return;

    const totalSize = this.state.content.reduce((sum, item) => sum + (item.size || 0), 0);
    const stats = {
      totalItems: this.state.content.length,
      totalSize,
      selectedCount: this.state.selectedContent.size
    };

    statsContainer.innerHTML = createContentStatsTemplate(stats);
  }

  /**
   * Set search application reference
   */
  setSearchApplication(searchApplication) {
    this.state.searchApplication = searchApplication;
  }

  /**
   * State management
   */
  setState(newState) {
    Object.assign(this.state, newState);
  }

  getState() {
    return { ...this.state };
  }

  /**
   * Utility functions
   */
  showSuccess(message) {
    // Could implement toast notifications here
    console.log('Success:', message);
  }

  showError(message) {
    // Could implement toast notifications here
    console.error('Error:', message);
  }

  /**
   * Cleanup
   */
  destroy() {
    // Remove event listeners and clean up resources
    this.element = null;
    this.state.uploadProgress.clear();
    this.state.selectedContent.clear();
  }
}
