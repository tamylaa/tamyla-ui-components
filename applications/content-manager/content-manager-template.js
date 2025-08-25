/**
 * Content Manager Application Templates
 * HTML template generation for content management interface
 */

/**
 * Main application template
 */
export function createContentManagerTemplate(props = {}) {
  const {
    title = 'Content Manager',
    description = '',
    showUpload = true,
    allowedFileTypes = ['pdf', 'doc', 'docx', 'txt', 'md', 'jpg', 'png', 'mp4', 'mp3'],
    currentView = 'grid',
    sortBy = 'relevance',
    selectionMode = true
  } = props;

  return `
    <div class="content-manager__header">
      <div class="content-manager__header-info">
        <h1 class="content-manager__title">${title}</h1>
        ${description ? `<p class="content-manager__description">${description}</p>` : ''}
      </div>
      
      <div class="content-manager__actions">
        ${createUploadSection(showUpload, allowedFileTypes)}
        ${createViewControls(currentView, sortBy)}
        ${createSelectionActions(selectionMode)}
      </div>
    </div>
    
    <div class="content-manager__search-section">
      <!-- Enhanced search will be rendered here -->
    </div>
    
    <div class="content-manager__content">
      <div class="content-manager__content-header">
        <div class="content-stats">
          <span class="content-count">0 items</span>
          <span class="separator">•</span>
          <span class="storage-usage">0 MB used</span>
        </div>
      </div>
      
      <div class="content-manager__results">
        <!-- Content results will be managed by search application -->
      </div>
    </div>
    
    <div class="upload-progress" id="upload-progress">
      <!-- Upload progress will be rendered here -->
    </div>
  `;
}

/**
 * Upload section template
 */
export function createUploadSection(showUpload, allowedFileTypes) {
  if (!showUpload) return '';

  return `
    <div class="content-manager__upload-section">
      <input type="file" 
             id="file-upload" 
             class="content-manager__file-input" 
             multiple 
             accept="${allowedFileTypes.map(type => `.${type}`).join(',')}" />
      <label for="file-upload" class="content-manager__upload-button">
        <svg class="upload-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
        </svg>
        Upload Files
      </label>
    </div>
  `;
}

/**
 * View controls template
 */
export function createViewControls(currentView, sortBy) {
  return `
    <div class="content-manager__view-controls">
      <div class="content-manager__view-toggle">
        <button class="view-button ${currentView === 'grid' ? 'view-button--active' : ''}" 
                data-view="grid"
                title="Grid View">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
          </svg>
        </button>
        <button class="view-button ${currentView === 'list' ? 'view-button--active' : ''}" 
                data-view="list"
                title="List View">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path>
          </svg>
        </button>
        <button class="view-button ${currentView === 'timeline' ? 'view-button--active' : ''}" 
                data-view="timeline"
                title="Timeline View">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
          </svg>
        </button>
      </div>
      
      <select class="content-manager__sort-select" title="Sort by">
        <option value="relevance" ${sortBy === 'relevance' ? 'selected' : ''}>Relevance</option>
        <option value="date" ${sortBy === 'date' ? 'selected' : ''}>Date</option>
        <option value="title" ${sortBy === 'title' ? 'selected' : ''}>Title</option>
        <option value="size" ${sortBy === 'size' ? 'selected' : ''}>Size</option>
        <option value="type" ${sortBy === 'type' ? 'selected' : ''}>File Type</option>
      </select>
    </div>
  `;
}

/**
 * Selection actions template
 */
export function createSelectionActions(selectionMode) {
  if (!selectionMode) return '';

  return `
    <div class="content-manager__selection-actions" style="display: none;">
      <span class="selection-count">0 selected</span>
      <button class="action-button action-button--secondary" 
              data-action="download"
              title="Download selected items">
        Download
      </button>
      <button class="action-button action-button--secondary" 
              data-action="share"
              title="Share selected items">
        Share
      </button>
      <button class="action-button action-button--danger" 
              data-action="delete"
              title="Delete selected items">
        Delete
      </button>
    </div>
  `;
}

/**
 * Upload progress template
 */
export function createUploadProgressTemplate(uploads) {
  if (!uploads || uploads.length === 0) return '';

  return uploads.map(upload => `
    <div class="upload-item">
      <span class="upload-filename">${upload.file.name}</span>
      <div class="upload-progress-bar">
        <div class="upload-progress-fill" style="width: ${upload.progress || 0}%"></div>
      </div>
      <span class="upload-status">${formatUploadStatus(upload)}</span>
    </div>
  `).join('');
}

/**
 * Empty state template
 */
export function createEmptyStateTemplate(hasSearchQuery = false) {
  if (hasSearchQuery) {
    return `
      <div class="content-manager__empty">
        <svg class="empty-icon" viewBox="0 0 64 64" fill="currentColor">
          <path d="M32 2C15.431 2 2 15.431 2 32s13.431 30 30 30 30-13.431 30-30S48.569 2 32 2zm0 54C17.664 56 6 44.336 6 30S17.664 4 32 4s26 11.664 26 26-11.664 26-26 26z"/>
          <path d="M26.5 20.5c-3.314 0-6 2.686-6 6s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6zm0 8c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2z"/>
          <path d="M43.5 34.5l-8-8c-.781-.781-2.047-.781-2.828 0l-8 8c-.781.781-.781 2.047 0 2.828l8 8c.391.391.902.586 1.414.586s1.023-.195 1.414-.586l8-8c.781-.781.781-2.047 0-2.828z"/>
        </svg>
        <h3 class="empty-title">No matching content found</h3>
        <p class="empty-description">Try adjusting your search terms or filters</p>
      </div>
    `;
  }

  return `
    <div class="content-manager__empty">
      <svg class="empty-icon" viewBox="0 0 64 64" fill="currentColor">
        <path d="M50 8H14c-3.3 0-6 2.7-6 6v36c0 3.3 2.7 6 6 6h36c3.3 0 6-2.7 6-6V14c0-3.3-2.7-6-6-6zM14 12h36c1.1 0 2 .9 2 2v28l-8-8c-1.1-1.1-3.1-1.1-4.2 0l-10 10-4-4c-1.1-1.1-3.1-1.1-4.2 0l-10 10V14c0-1.1.9-2 2-2z"/>
        <circle cx="20" cy="20" r="4"/>
      </svg>
      <h3 class="empty-title">No content yet</h3>
      <p class="empty-description">Upload files to get started with your content library</p>
    </div>
  `;
}

/**
 * Loading state template
 */
export function createLoadingTemplate() {
  return `
    <div class="content-manager__loading">
      <div class="loading-spinner"></div>
    </div>
  `;
}

/**
 * Content stats template
 */
export function createContentStatsTemplate(stats) {
  const {
    totalItems = 0,
    totalSize = 0,
    selectedCount = 0
  } = stats;

  return `
    <div class="content-stats">
      <span class="content-count">${totalItems} item${totalItems !== 1 ? 's' : ''}</span>
      <span class="separator">•</span>
      <span class="storage-usage">${formatFileSize(totalSize)} used</span>
      ${selectedCount > 0 ? `
        <span class="separator">•</span>
        <span class="selection-info">${selectedCount} selected</span>
      ` : ''}
    </div>
  `;
}

/**
 * Utility functions for templates
 */
function formatUploadStatus(upload) {
  if (upload.error) return 'Error';
  if (upload.progress === 100) return 'Complete';
  if (upload.progress > 0) return `${Math.round(upload.progress)}%`;
  return 'Pending';
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
