/**
 * File List Molecule Templates
 * Template generation for file display and management
 */

/**
 * Create file list template
 */
export function createFileListTemplate(options = {}) {
  const {
    files = [],
    layout = 'list', // list, grid, compact
    size = 'medium', // small, medium, large
    showSize = true,
    showDate = false,
    showType = false,
    showCheckboxes = false,
    showActions = false,
    selectable = true,
    multiSelect = false,
    selected = [],
    disabled = false,
    loading = false,
    emptyMessage = 'No files found',
    emptySubtext = 'Upload files to get started',
    id = ''
  } = options;

  const containerClass = [
    'tmyl-file-list',
    layout !== 'list' ? `tmyl-file-list--${layout}` : '',
    size !== 'medium' ? `tmyl-file-list--${size}` : '',
    disabled ? 'tmyl-file-list--disabled' : '',
    loading ? 'tmyl-file-list--loading' : ''
  ].filter(Boolean).join(' ');

  if (files.length === 0) {
    return createEmptyState(emptyMessage, emptySubtext, containerClass, id);
  }

  return `
    <div 
      class="${containerClass}" 
      role="listbox"
      aria-label="File list"
      ${multiSelect ? 'aria-multiselectable="true"' : ''}
      ${id ? `id="${id}"` : ''}
    >
      ${files.map((file, index) =>
    createFileItem(file, {
      index,
      showSize,
      showDate,
      showType,
      showCheckboxes,
      showActions,
      selectable,
      selected: selected.includes(file.id || file.name),
      layout
    })
  ).join('')}
    </div>
  `.trim();
}

/**
 * Create empty state template
 */
function createEmptyState(message, subtext, containerClass, id) {
  return `
    <div 
      class="${containerClass}" 
      ${id ? `id="${id}"` : ''}
      role="region"
      aria-label="Empty file list"
    >
      <div class="tmyl-file-list__empty">
        <div class="tmyl-file-list__empty-icon">📁</div>
        <div class="tmyl-file-list__empty-text">${message}</div>
        ${subtext ? `<div class="tmyl-file-list__empty-subtext">${subtext}</div>` : ''}
      </div>
    </div>
  `;
}

/**
 * Create file item template
 */
export function createFileItem(file, options = {}) {
  const {
    index = 0,
    showSize = true,
    showDate = false,
    showType = false,
    showCheckboxes = false,
    showActions = false,
    selectable = true,
    selected = false,
    layout = 'list'
  } = options;

  const fileId = file.id || file.name || `file-${index}`;
  const fileName = file.name || 'Untitled';
  const fileSize = file.size ? formatFileSize(file.size) : '';
  const fileDate = file.lastModified || file.dateModified ?
    formatDate(new Date(file.lastModified || file.dateModified)) : '';
  const fileType = getFileType(fileName);
  const fileIcon = getFileIcon(fileName, fileType);

  const itemClass = [
    'tmyl-file-list__item',
    selected ? 'tmyl-file-list__item--selected' : '',
    file.disabled ? 'tmyl-file-list__item--disabled' : ''
  ].filter(Boolean).join(' ');

  return `
    <div 
      class="${itemClass}"
      role="option"
      aria-selected="${selected}"
      tabindex="${selectable ? '0' : '-1'}"
      data-file-id="${fileId}"
      data-file-name="${fileName}"
      data-file-type="${fileType}"
      ${file.disabled ? 'aria-disabled="true"' : ''}
    >
      ${showCheckboxes ? createCheckbox(fileId, selected) : ''}
      
      <div class="tmyl-file-list__icon tmyl-file-list__icon--${fileType}">
        ${fileIcon}
      </div>
      
      <div class="tmyl-file-list__content">
        <div class="tmyl-file-list__name" title="${fileName}">
          ${fileName}
        </div>
        
        ${(showSize || showDate || showType) ? `
          <div class="tmyl-file-list__meta">
            ${showSize && fileSize ? `<span class="tmyl-file-list__size">${fileSize}</span>` : ''}
            ${showDate && fileDate ? `<span class="tmyl-file-list__date">${fileDate}</span>` : ''}
            ${showType ? `<span class="tmyl-file-list__type">${fileType}</span>` : ''}
          </div>
        ` : ''}
      </div>
      
      ${showActions ? createFileActions(file) : ''}
    </div>
  `;
}

/**
 * Create checkbox for file selection
 */
function createCheckbox(fileId, selected) {
  return `
    <input 
      type="checkbox" 
      class="tmyl-file-list__checkbox"
      id="checkbox-${fileId}"
      ${selected ? 'checked' : ''}
      aria-label="Select file"
    />
  `;
}

/**
 * Create file actions
 */
function createFileActions(file) {
  const actions = [
    { icon: '👁', label: 'Preview', action: 'preview' },
    { icon: '⬇', label: 'Download', action: 'download' },
    { icon: '🗑', label: 'Delete', action: 'delete' }
  ];

  return `
    <div class="tmyl-file-list__actions">
      ${actions.map(action => `
        <button 
          type="button"
          class="tmyl-file-list__action"
          data-action="${action.action}"
          aria-label="${action.label} file"
          title="${action.label}"
        >
          ${action.icon}
        </button>
      `).join('')}
    </div>
  `;
}

/**
 * Get file type from filename
 */
function getFileType(filename) {
  if (!filename) return 'document';

  const ext = filename.split('.').pop()?.toLowerCase();

  const typeMap = {
    // Images
    jpg: 'image', jpeg: 'image', png: 'image', gif: 'image',
    webp: 'image', svg: 'image', bmp: 'image', ico: 'image',

    // Documents
    pdf: 'document', doc: 'document', docx: 'document',
    txt: 'document', rtf: 'document', odt: 'document',

    // Spreadsheets
    xls: 'document', xlsx: 'document', csv: 'document', ods: 'document',

    // Presentations
    ppt: 'document', pptx: 'document', odp: 'document',

    // Archives
    zip: 'archive', rar: 'archive', '7z': 'archive',
    tar: 'archive', gz: 'archive', bz2: 'archive',

    // Videos
    mp4: 'video', avi: 'video', mov: 'video', wmv: 'video',
    flv: 'video', webm: 'video', mkv: 'video',

    // Audio
    mp3: 'audio', wav: 'audio', flac: 'audio', aac: 'audio',
    ogg: 'audio', wma: 'audio', m4a: 'audio',

    // Code
    js: 'document', ts: 'document', html: 'document', css: 'document',
    json: 'document', xml: 'document', yml: 'document', yaml: 'document'
  };

  return typeMap[ext] || 'document';
}

/**
 * Get file icon based on type
 */
function getFileIcon(filename, type) {
  const iconMap = {
    image: '🖼️',
    document: '📄',
    archive: '📦',
    video: '🎥',
    audio: '🎵',
    folder: '📁'
  };

  // Special cases for specific files
  if (filename) {
    const ext = filename.split('.').pop()?.toLowerCase();
    const specialIcons = {
      pdf: '📋',
      doc: '📝', docx: '📝',
      xls: '📊', xlsx: '📊', csv: '📊',
      ppt: '📈', pptx: '📈',
      zip: '🗜️', rar: '🗜️',
      mp4: '🎬', avi: '🎬',
      mp3: '🎧', wav: '🎧'
    };

    if (specialIcons[ext]) {
      return specialIcons[ext];
    }
  }

  return iconMap[type] || iconMap.document;
}

/**
 * Format file size
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Format date
 */
function formatDate(date) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return 'Today';
  } else if (days === 1) {
    return 'Yesterday';
  } else if (days < 7) {
    return `${days} days ago`;
  } else {
    return date.toLocaleDateString();
  }
}

/**
 * Create file list with drag and drop
 */
export function createDragDropFileList(options = {}) {
  const {
    acceptedTypes = '*',
    multiple = true,
    maxFiles = null,
    maxSize = null,
    ...listOptions
  } = options;

  const fileList = createFileListTemplate(listOptions);

  return `
    <div class="tmyl-file-list-container">
      <div 
        class="tmyl-file-dropzone"
        data-accepted-types="${acceptedTypes}"
        data-multiple="${multiple}"
        data-max-files="${maxFiles || ''}"
        data-max-size="${maxSize || ''}"
      >
        <input 
          type="file" 
          class="tmyl-file-input"
          ${multiple ? 'multiple' : ''}
          accept="${acceptedTypes}"
          style="display: none;"
        />
        
        <div class="tmyl-dropzone-overlay">
          <div class="tmyl-dropzone-content">
            <span class="tmyl-dropzone-icon">📎</span>
            <span class="tmyl-dropzone-text">Drop files here or click to browse</span>
          </div>
        </div>
        
        ${fileList}
      </div>
    </div>
  `;
}

/**
 * Create file list with pagination
 */
export function createPaginatedFileList(options = {}) {
  const {
    currentPage = 1,
    totalPages = 1,
    itemsPerPage = 10,
    totalItems = 0,
    showPageInfo = true,
    showPageSize = true,
    pageSizes = [10, 25, 50, 100],
    ...listOptions
  } = options;

  const fileList = createFileListTemplate(listOptions);

  return `
    <div class="tmyl-file-list-paginated">
      ${fileList}
      
      ${totalPages > 1 ? `
        <div class="tmyl-file-list-pagination">
          ${showPageInfo ? `
            <div class="tmyl-pagination-info">
              Showing ${((currentPage - 1) * itemsPerPage) + 1}-${Math.min(currentPage * itemsPerPage, totalItems)} of ${totalItems} files
            </div>
          ` : ''}
          
          <div class="tmyl-pagination-controls">
            <button 
              type="button" 
              class="tmyl-pagination-btn tmyl-pagination-btn--prev"
              ${currentPage === 1 ? 'disabled' : ''}
              aria-label="Previous page"
            >
              ‹ Previous
            </button>
            
            <span class="tmyl-pagination-pages">
              Page ${currentPage} of ${totalPages}
            </span>
            
            <button 
              type="button" 
              class="tmyl-pagination-btn tmyl-pagination-btn--next"
              ${currentPage === totalPages ? 'disabled' : ''}
              aria-label="Next page"
            >
              Next ›
            </button>
          </div>
          
          ${showPageSize ? `
            <select class="tmyl-pagination-size" aria-label="Items per page">
              ${pageSizes.map(size => `
                <option value="${size}" ${size === itemsPerPage ? 'selected' : ''}>
                  ${size} per page
                </option>
              `).join('')}
            </select>
          ` : ''}
        </div>
      ` : ''}
    </div>
  `;
}

export default {
  createFileListTemplate,
  createFileItem,
  createDragDropFileList,
  createPaginatedFileList
};
