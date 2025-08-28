/**
 * Content Manager Application
 * Application-level component for content management with enhanced search
 */

import { OrganismFactory, OrganismTemplates } from '../../organisms/organism-factory.js';
import { EnhancedSearchApplicationFactory } from './enhanced-search-application.js';

/**
 * Content Manager Application Factory
 * Creates complete content management applications with business logic
 */
export function ContentManagerApplicationFactory(props = {}) {
  const {
    // API Configuration
    apiBase = '/api/content',
    meilisearchUrl = '/api/search',
    uploadEndpoint = '/api/upload',

    // Feature Configuration
    selectionMode = true,
    showUpload = true,
    maxFileSize = 25 * 1024 * 1024, // 25MB
    allowedFileTypes = ['pdf', 'doc', 'docx', 'txt', 'md', 'jpg', 'png', 'mp4', 'mp3'],

    // Enhanced search features
    voiceSearch = true,
    naturalLanguage = true,
    smartFilters = true,

    // UI Configuration
    title = 'Content Manager',
    description = 'Manage and search your content library',
    currentView = 'grid', // 'grid', 'list', 'timeline'
    sortBy = 'relevance', // 'relevance', 'date', 'title', 'size'

    // Business Logic Handlers
    onContentLoad,
    onContentSelect,
    onContentUpload,
    onContentDelete,
    onAnalytics,

    // Container
    container = null
  } = props;

  let element = null;
  let searchApplication = null;
  let contentData = [];
  let selectedContent = new Set();

  const state = {
    content: [],
    selectedContent: new Set(),
    isLoading: false,
    currentView,
    sortBy,
    uploadProgress: new Map()
  };

  /**
   * Create main element structure
   */
  function createElement() {
    element = document.createElement('div');
    element.className = 'tmyl-content-manager-application';

    element.innerHTML = `
      <div class="content-manager__header">
        <div class="content-manager__title-section">
          <h1 class="content-manager__title">${title}</h1>
          ${description ? `<p class="content-manager__description">${description}</p>` : ''}
        </div>
        
        <div class="content-manager__actions">
          ${showUpload ? `
            <div class="content-manager__upload-section">
              <input type="file" id="file-upload" class="content-manager__file-input" multiple 
                     accept="${allowedFileTypes.map(type => `.${type}`).join(',')}" />
              <label for="file-upload" class="content-manager__upload-button">
                <svg class="upload-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                </svg>
                Upload Files
              </label>
              <div class="content-manager__upload-progress" style="display: none;"></div>
            </div>
          ` : ''}
          
          <div class="content-manager__view-controls">
            <div class="content-manager__view-toggle">
              <button class="view-button ${currentView === 'grid' ? 'view-button--active' : ''}" data-view="grid">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                </svg>
              </button>
              <button class="view-button ${currentView === 'list' ? 'view-button--active' : ''}" data-view="list">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path>
                </svg>
              </button>
              <button class="view-button ${currentView === 'timeline' ? 'view-button--active' : ''}" data-view="timeline">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
                </svg>
              </button>
            </div>
            
            <select class="content-manager__sort-select">
              <option value="relevance" ${sortBy === 'relevance' ? 'selected' : ''}>Relevance</option>
              <option value="date" ${sortBy === 'date' ? 'selected' : ''}>Date</option>
              <option value="title" ${sortBy === 'title' ? 'selected' : ''}>Title</option>
              <option value="size" ${sortBy === 'size' ? 'selected' : ''}>Size</option>
            </select>
          </div>
          
          ${selectionMode ? `
            <div class="content-manager__selection-actions" style="display: none;">
              <span class="selection-count">0 selected</span>
              <button class="action-button action-button--secondary" data-action="download">Download</button>
              <button class="action-button action-button--secondary" data-action="share">Share</button>
              <button class="action-button action-button--danger" data-action="delete">Delete</button>
            </div>
          ` : ''}
        </div>
      </div>
      
      <div class="content-manager__search-section">
        <!-- Enhanced search will be rendered here -->
      </div>
      
      <div class="content-manager__content-section">
        <!-- Content results will be managed by search application -->
      </div>
      
      <div class="content-manager__status-bar">
        <div class="status-info">
          <span class="content-count">0 items</span>
          <span class="storage-usage">Storage: 0 MB used</span>
        </div>
      </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = getContentManagerStyles();
    element.appendChild(style);

    return element;
  }

  /**
   * Initialize enhanced search application
   */
  function initializeSearchApplication() {
    const searchContainer = element.querySelector('.content-manager__search-section');

    searchApplication = EnhancedSearchApplicationFactory({
      meilisearchUrl,
      apiBase,
      voiceEnabled: voiceSearch,
      naturalLanguage,
      smartFilters,
      title: '', // Don't show title in embedded mode
      description: '',
      placeholder: 'Search your content... Try "Find my presentation slides from last week"',
      onSearchResults: handleSearchResults,
      onContentSelection: handleContentSelection,
      onAnalytics,
      container: searchContainer
    });

    searchApplication.render();
    return searchApplication;
  }

  /**
   * Setup event listeners
   */
  function setupEventListeners() {
    // File upload
    if (showUpload) {
      const fileInput = element.querySelector('#file-upload');
      fileInput?.addEventListener('change', handleFileUpload);
    }

    // View controls
    const viewButtons = element.querySelectorAll('.view-button');
    viewButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const view = e.currentTarget.dataset.view;
        changeView(view);
      });
    });

    // Sort control
    const sortSelect = element.querySelector('.content-manager__sort-select');
    sortSelect?.addEventListener('change', (e) => {
      changeSortBy(e.target.value);
    });

    // Selection actions
    if (selectionMode) {
      const actionButtons = element.querySelectorAll('[data-action]');
      actionButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          const action = e.currentTarget.dataset.action;
          handleSelectionAction(action);
        });
      });
    }
  }

  /**
   * Load initial content
   */
  async function loadContent() {
    try {
      state.isLoading = true;
      updateLoadingState();

      const response = await fetch(`${apiBase}/list`);
      if (!response.ok) {
        throw new Error(`Failed to load content: ${response.statusText}`);
      }

      const data = await response.json();
      contentData = data.content || data.items || [];
      state.content = contentData;

      updateContentDisplay();
      updateStatusBar();

      if (onContentLoad) {
        onContentLoad(contentData);
      }
    } catch (error) {
      console.error('Failed to load content:', error);
      showError('Failed to load content. Please try again.');
    } finally {
      state.isLoading = false;
      updateLoadingState();
    }
  }

  /**
   * Handle search results
   */
  function handleSearchResults(results, totalCount) {
    state.content = results;
    updateContentDisplay();
    updateStatusBar();
  }

  /**
   * Handle content selection
   */
  function handleContentSelection(selectedContent, selectedIds) {
    state.selectedContent = new Set(selectedIds);
    updateSelectionDisplay();

    if (onContentSelect) {
      onContentSelect(selectedContent, selectedIds);
    }
  }

  /**
   * Handle file upload
   */
  async function handleFileUpload(event) {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    // Validate files
    const validFiles = files.filter(file => {
      if (file.size > maxFileSize) {
        showError(`File "${file.name}" is too large. Maximum size is ${formatFileSize(maxFileSize)}.`);
        return false;
      }

      const extension = file.name.split('.').pop()?.toLowerCase();
      if (!allowedFileTypes.includes(extension)) {
        showError(`File type "${extension}" is not allowed.`);
        return false;
      }

      return true;
    });

    if (!validFiles.length) return;

    // Upload files
    const uploadPromises = validFiles.map(file => uploadFile(file));

    try {
      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(result => result.success);

      if (successfulUploads.length > 0) {
        showSuccess(`Successfully uploaded ${successfulUploads.length} file(s).`);

        // Refresh content
        await loadContent();

        if (onContentUpload) {
          onContentUpload(successfulUploads);
        }
      }
    } catch (error) {
      showError('Some files failed to upload. Please try again.');
    }

    // Clear file input
    event.target.value = '';
  }

  /**
   * Upload single file
   */
  async function uploadFile(file) {
    const uploadId = `upload-${Date.now()}-${Math.random()}`;
    state.uploadProgress.set(uploadId, { file, progress: 0 });
    updateUploadProgress();

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('metadata', JSON.stringify({
        originalName: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString()
      }));

      const response = await fetch(uploadEndpoint, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();

      state.uploadProgress.delete(uploadId);
      updateUploadProgress();

      return { success: true, file, result };
    } catch (error) {
      console.error('Upload error:', error);
      state.uploadProgress.delete(uploadId);
      updateUploadProgress();

      return { success: false, file, error: error.message };
    }
  }

  /**
   * Change view mode
   */
  function changeView(view) {
    state.currentView = view;

    // Update button states
    const viewButtons = element.querySelectorAll('.view-button');
    viewButtons.forEach(button => {
      button.classList.toggle('view-button--active', button.dataset.view === view);
    });

    // Update content display
    updateContentDisplay();

    if (onAnalytics) {
      onAnalytics({
        type: 'view_change',
        view,
        timestamp: Date.now()
      });
    }
  }

  /**
   * Change sort order
   */
  function changeSortBy(sortBy) {
    state.sortBy = sortBy;

    // Apply sorting to search interface if available
    if (searchApplication) {
      const controller = searchApplication.getSearchInterface()?.getController();
      if (controller) {
        // Trigger re-search with new sort order
        const currentState = controller.getState();
        controller.search(currentState.query);
      }
    }

    updateContentDisplay();
  }

  /**
   * Handle selection actions
   */
  async function handleSelectionAction(action) {
    const selectedItems = Array.from(state.selectedContent);
    if (!selectedItems.length) return;

    const selectedContent = state.content.filter(item => selectedItems.includes(item.id));

    switch (action) {
    case 'download':
      await downloadSelectedContent(selectedContent);
      break;
    case 'share':
      await shareSelectedContent(selectedContent);
      break;
    case 'delete':
      await deleteSelectedContent(selectedContent);
      break;
    }

    if (onAnalytics) {
      onAnalytics({
        type: 'bulk_action',
        action,
        itemCount: selectedItems.length,
        timestamp: Date.now()
      });
    }
  }

  /**
   * Download selected content
   */
  async function downloadSelectedContent(content) {
    if (content.length === 1) {
      // Single file download
      const item = content[0];
      if (item.downloadUrl || item.url) {
        const link = document.createElement('a');
        link.href = item.downloadUrl || item.url;
        link.download = item.title || 'download';
        link.click();
      }
    } else {
      // Multiple files - create zip
      try {
        const response = await fetch(`${apiBase}/download/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: content.map(item => item.id) })
        });

        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `content-${Date.now()}.zip`;
          link.click();
          URL.revokeObjectURL(url);
        }
      } catch (error) {
        showError('Failed to download files. Please try again.');
      }
    }
  }

  /**
   * Share selected content
   */
  async function shareSelectedContent(content) {
    if (navigator.share && content.length === 1) {
      const item = content[0];
      try {
        await navigator.share({
          title: item.title,
          text: item.description,
          url: item.url
        });
      } catch (error) {
        // Fallback to clipboard
        copyToClipboard(item.url || item.title);
      }
    } else {
      // Copy URLs to clipboard
      const urls = content.map(item => item.url || item.title).join('\n');
      copyToClipboard(urls);
      showSuccess('Links copied to clipboard');
    }
  }

  /**
   * Delete selected content
   */
  async function deleteSelectedContent(content) {
    const confirmed = confirm(`Are you sure you want to delete ${content.length} item(s)? This action cannot be undone.`);
    if (!confirmed) return;

    try {
      const response = await fetch(`${apiBase}/delete/bulk`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: content.map(item => item.id) })
      });

      if (response.ok) {
        showSuccess(`Successfully deleted ${content.length} item(s).`);

        // Clear selection
        state.selectedContent.clear();
        updateSelectionDisplay();

        // Refresh content
        await loadContent();

        if (onContentDelete) {
          onContentDelete(content);
        }
      } else {
        throw new Error(`Delete failed: ${response.statusText}`);
      }
    } catch (error) {
      showError('Failed to delete items. Please try again.');
    }
  }

  /**
   * Update content display based on current view
   */
  function updateContentDisplay() {
    // The content display is now handled by the search application
    // This method can be used for view-specific adjustments

    const contentSection = element.querySelector('.content-manager__content-section');
    if (contentSection) {
      contentSection.className = `content-manager__content-section content-manager__content-section--${state.currentView}`;
    }
  }

  /**
   * Update selection display
   */
  function updateSelectionDisplay() {
    if (!selectionMode) return;

    const selectionActions = element.querySelector('.content-manager__selection-actions');
    const selectionCount = element.querySelector('.selection-count');

    const count = state.selectedContent.size;

    if (selectionActions) {
      selectionActions.style.display = count > 0 ? 'flex' : 'none';
    }

    if (selectionCount) {
      selectionCount.textContent = `${count} selected`;
    }
  }

  /**
   * Update status bar
   */
  function updateStatusBar() {
    const contentCount = element.querySelector('.content-count');
    const storageUsage = element.querySelector('.storage-usage');

    if (contentCount) {
      contentCount.textContent = `${state.content.length} items`;
    }

    if (storageUsage) {
      const totalSize = state.content.reduce((sum, item) => sum + (item.size || 0), 0);
      storageUsage.textContent = `Storage: ${formatFileSize(totalSize)} used`;
    }
  }

  /**
   * Update loading state
   */
  function updateLoadingState() {
    element.classList.toggle('content-manager--loading', state.isLoading);
  }

  /**
   * Update upload progress
   */
  function updateUploadProgress() {
    const progressContainer = element.querySelector('.content-manager__upload-progress');
    if (!progressContainer) return;

    const uploads = Array.from(state.uploadProgress.values());

    if (uploads.length === 0) {
      progressContainer.style.display = 'none';
      return;
    }

    progressContainer.style.display = 'block';
    progressContainer.innerHTML = uploads.map(upload => `
      <div class="upload-item">
        <span class="upload-filename">${upload.file.name}</span>
        <div class="upload-progress-bar">
          <div class="upload-progress-fill" style="width: ${upload.progress}%"></div>
        </div>
      </div>
    `).join('');
  }

  /**
   * Utility functions
   */
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  function copyToClipboard(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    } else {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
  }

  function showSuccess(message) {
    // Could implement toast notifications here
    console.log('Success:', message);
  }

  function showError(message) {
    // Could implement toast notifications here
    console.error('Error:', message);
  }

  /**
   * Get component styles
   */
  function getContentManagerStyles() {
    return `
      .tmyl-content-manager-application {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: #f8fafc;
      }

      .content-manager__header {
        background: white;
        border-bottom: 1px solid #e2e8f0;
        padding: 1.5rem 2rem;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 2rem;
      }

      .content-manager__title {
        margin: 0;
        font-size: 1.875rem;
        font-weight: 700;
        color: #1e293b;
      }

      .content-manager__description {
        margin: 0.25rem 0 0 0;
        color: #64748b;
        font-size: 0.875rem;
      }

      .content-manager__actions {
        display: flex;
        gap: 1rem;
        align-items: center;
        flex-wrap: wrap;
      }

      .content-manager__upload-section {
        position: relative;
      }

      .content-manager__file-input {
        display: none;
      }

      .content-manager__upload-button {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background: #3b82f6;
        color: white;
        border-radius: 0.375rem;
        cursor: pointer;
        font-size: 0.875rem;
        font-weight: 500;
        transition: background-color 0.2s;
      }

      .content-manager__upload-button:hover {
        background: #2563eb;
      }

      .upload-icon {
        width: 1rem;
        height: 1rem;
      }

      .content-manager__view-toggle {
        display: flex;
        border: 1px solid #e2e8f0;
        border-radius: 0.375rem;
        overflow: hidden;
      }

      .view-button {
        padding: 0.5rem;
        border: none;
        background: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
      }

      .view-button svg {
        width: 1rem;
        height: 1rem;
        color: #64748b;
      }

      .view-button--active {
        background: #3b82f6;
      }

      .view-button--active svg {
        color: white;
      }

      .content-manager__sort-select {
        padding: 0.5rem;
        border: 1px solid #e2e8f0;
        border-radius: 0.375rem;
        background: white;
        font-size: 0.875rem;
      }

      .content-manager__selection-actions {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        padding: 0.5rem 1rem;
        background: #eff6ff;
        border: 1px solid #bfdbfe;
        border-radius: 0.375rem;
      }

      .selection-count {
        font-size: 0.875rem;
        color: #1e40af;
        font-weight: 500;
      }

      .action-button {
        padding: 0.25rem 0.75rem;
        border: 1px solid transparent;
        border-radius: 0.25rem;
        font-size: 0.75rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
      }

      .action-button--secondary {
        background: white;
        border-color: #e2e8f0;
        color: #374151;
      }

      .action-button--danger {
        background: #fef2f2;
        border-color: #fecaca;
        color: #dc2626;
      }

      .content-manager__search-section {
        padding: 1.5rem 2rem;
        background: white;
        border-bottom: 1px solid #e2e8f0;
      }

      .content-manager__content-section {
        flex: 1;
        padding: 1.5rem 2rem;
      }

      .content-manager__status-bar {
        background: white;
        border-top: 1px solid #e2e8f0;
        padding: 0.75rem 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .status-info {
        display: flex;
        gap: 2rem;
        font-size: 0.875rem;
        color: #64748b;
      }

      .content-manager--loading {
        pointer-events: none;
        opacity: 0.6;
      }

      .content-manager__upload-progress {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 0.375rem;
        margin-top: 0.5rem;
        padding: 0.5rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        z-index: 10;
      }

      .upload-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.25rem;
      }

      .upload-filename {
        font-size: 0.75rem;
        color: #374151;
        min-width: 100px;
      }

      .upload-progress-bar {
        flex: 1;
        height: 4px;
        background: #e2e8f0;
        border-radius: 2px;
        overflow: hidden;
      }

      .upload-progress-fill {
        height: 100%;
        background: #3b82f6;
        transition: width 0.3s;
      }

      @media (max-width: 768px) {
        .content-manager__header {
          flex-direction: column;
          align-items: stretch;
        }

        .content-manager__actions {
          justify-content: space-between;
        }
      }
    `;
  }

  /**
   * Render application
   */
  function render(targetContainer = container) {
    if (!targetContainer) {
      throw new Error('Container element required for rendering');
    }

    if (!element) {
      createElement();
    }

    targetContainer.appendChild(element);

    // Initialize components after DOM insertion
    initializeSearchApplication();
    setupEventListeners();

    // Load initial content
    loadContent();

    return element;
  }

  /**
   * Destroy application
   */
  function destroy() {
    if (searchApplication) {
      searchApplication.destroy();
      searchApplication = null;
    }

    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }

    element = null;
    contentData = [];
    selectedContent.clear();
  }

  /**
   * Public API
   */
  return {
    // Lifecycle
    render,
    destroy,

    // Actions
    refresh: loadContent,
    search: (query, filters = {}) => {
      if (searchApplication) {
        searchApplication.search(query, filters);
      }
    },

    // Data access
    getContent: () => state.content,
    getSelectedContent: () => Array.from(state.selectedContent),

    // Element access
    getElement: () => element,
    getSearchApplication: () => searchApplication
  };
}

/**
 * Default export
 */
export default ContentManagerApplicationFactory;
