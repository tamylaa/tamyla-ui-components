/**
 * File List Adapter
 * Adapted from legacy/TamylaFileList.js React selection patterns
 * Separated from monolithic react-pattern-adapters.js
 */

import { CardFactory } from '../../atoms/card/card-system.js';

/**
 * Advanced File List Factory
 * Creates file list components with selection state management and filtering
 */
export class FileListAdapter {
  constructor() {
    this.cardFactory = new CardFactory();
  }

  create(props = {}) {
    const {
      files = [],
      onSelect,
      selected = [],
      multiSelect = true,
      showSize = true,
      showDate = true,
      showPreview = false,
      sortBy = 'name', // 'name', 'size', 'date'
      sortOrder = 'asc',
      filterBy = 'all', // 'all', 'image', 'video', 'document'
      container = null,
      className = ''
    } = props;

    let element = null;
    let currentFiles = [...files];
    let currentSelected = [...selected];
    let currentSortBy = sortBy;
    let currentSortOrder = sortOrder;
    let currentFilterBy = filterBy;

    function createComponent() {
      element = document.createElement('div');
      element.className = `advanced-file-list ${className}`;
      
      // Create header with controls
      const header = createHeader();
      element.appendChild(header);
      
      // Create files container
      const filesContainer = document.createElement('div');
      filesContainer.className = 'files-container';
      element.appendChild(filesContainer);
      
      // Render files
      renderFiles();
      
      if (container) {
        container.appendChild(element);
      }
      
      return {
        element,
        getSelected: () => [...currentSelected],
        setSelected: (newSelected) => {
          currentSelected = [...newSelected];
          updateSelectionState();
        },
        getFiles: () => [...currentFiles],
        setFiles: (newFiles) => {
          currentFiles = [...newFiles];
          renderFiles();
        },
        addFile: (file) => {
          currentFiles.push(file);
          renderFiles();
        },
        removeFile: (fileId) => {
          currentFiles = currentFiles.filter(f => f.id !== fileId);
          currentSelected = currentSelected.filter(id => id !== fileId);
          renderFiles();
        },
        clearSelection: () => {
          currentSelected = [];
          updateSelectionState();
        },
        destroy: () => {
          if (element?.parentNode) {
            element.parentNode.removeChild(element);
          }
        }
      };
    }

    function createHeader() {
      const header = document.createElement('div');
      header.className = 'file-list-header';
      
      header.innerHTML = `
        <div class="file-list-info">
          <h3 class="file-list-title">Files (${currentFiles.length})</h3>
          <span class="selection-info">${currentSelected.length} selected</span>
        </div>
        <div class="file-list-controls">
          <select class="sort-select" value="${currentSortBy}">
            <option value="name">Sort by Name</option>
            <option value="size">Sort by Size</option>
            <option value="date">Sort by Date</option>
          </select>
          <select class="filter-select" value="${currentFilterBy}">
            <option value="all">All Files</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="document">Documents</option>
            <option value="audio">Audio</option>
          </select>
        </div>
      `;
      
      // Add event listeners
      const sortSelect = header.querySelector('.sort-select');
      const filterSelect = header.querySelector('.filter-select');
      
      sortSelect.addEventListener('change', handleSortChange);
      filterSelect.addEventListener('change', handleFilterChange);
      
      return header;
    }

    // File rendering with empty state
    function renderFiles() {
      const container = element.querySelector('.files-container');
      
      const sortedFiles = getSortedFiles();
      const filteredFiles = getFilteredFiles(sortedFiles);
      
      if (filteredFiles.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <div class="empty-icon">📁</div>
            <div class="empty-title">No files found</div>
            <div class="empty-message">
              ${currentFiles.length === 0 ? 'No files to display' : 'No files match the current filter'}
            </div>
          </div>
        `;
        return;
      }
      
      container.innerHTML = '';
      
      filteredFiles.forEach(file => {
        const fileCard = createFileCard(file);
        container.appendChild(fileCard);
      });
      
      updateSelectionState();
      updateHeaderInfo();
    }

    function createFileCard(file) {
      const cardContainer = document.createElement('div');
      cardContainer.className = 'file-card-container';
      
      const isSelected = currentSelected.includes(file.id || file.name);
      
      const card = this.cardFactory.create({
        variant: isSelected ? 'selected' : 'default',
        className: `file-card ${isSelected ? 'selected' : ''}`,
        onClick: () => handleFileSelect(file),
        container: cardContainer
      });
      
      // Add file content to card
      const fileContent = document.createElement('div');
      fileContent.className = 'file-content';
      fileContent.innerHTML = `
        <div class="file-icon">${getFileIcon(file)}</div>
        <div class="file-info">
          <div class="file-name">${file.name}</div>
          ${showSize && file.size ? `<div class="file-size">${formatFileSize(file.size)}</div>` : ''}
          ${showDate && file.date ? `<div class="file-date">${formatDate(file.date)}</div>` : ''}
        </div>
        ${isSelected ? '<div class="selection-indicator">✓</div>' : ''}
      `;
      
      card.element.appendChild(fileContent);
      
      return cardContainer;
    }

    // Selection handling
    function handleFileSelect(file) {
      const fileId = file.id || file.name;
      
      if (multiSelect) {
        if (currentSelected.includes(fileId)) {
          currentSelected = currentSelected.filter(id => id !== fileId);
        } else {
          currentSelected.push(fileId);
        }
      } else {
        currentSelected = currentSelected.includes(fileId) ? [] : [fileId];
      }
      
      updateSelectionState();
      
      if (onSelect) {
        onSelect({
          file,
          selected: currentSelected.includes(fileId),
          allSelected: currentSelected
        });
      }

      // Dispatch custom event
      element.dispatchEvent(new CustomEvent('file-select', {
        detail: { file, selected: currentSelected.includes(fileId), allSelected: currentSelected }
      }));
    }

    function updateSelectionState() {
      // Update visual selection state
      element.querySelectorAll('.file-card').forEach(card => {
        const fileContent = card.querySelector('.file-content');
        const fileName = fileContent.querySelector('.file-name').textContent;
        const file = currentFiles.find(f => f.name === fileName);
        const isSelected = currentSelected.includes(file?.id || fileName);
        
        card.classList.toggle('selected', isSelected);
        
        // Update selection indicator
        let indicator = card.querySelector('.selection-indicator');
        if (isSelected && !indicator) {
          indicator = document.createElement('div');
          indicator.className = 'selection-indicator';
          indicator.textContent = '✓';
          fileContent.appendChild(indicator);
        } else if (!isSelected && indicator) {
          indicator.remove();
        }
      });
      
      updateHeaderInfo();
    }

    function updateHeaderInfo() {
      const titleElement = element.querySelector('.file-list-title');
      const selectionInfo = element.querySelector('.selection-info');
      
      titleElement.textContent = `Files (${currentFiles.length})`;
      selectionInfo.textContent = `${currentSelected.length} selected`;
    }

    // Utility functions
    function getSortedFiles() {
      return [...currentFiles].sort((a, b) => {
        let aValue, bValue;
        
        switch (currentSortBy) {
          case 'size':
            aValue = a.size || 0;
            bValue = b.size || 0;
            break;
          case 'date':
            aValue = new Date(a.date || 0);
            bValue = new Date(b.date || 0);
            break;
          default:
            aValue = (a.name || '').toLowerCase();
            bValue = (b.name || '').toLowerCase();
        }
        
        if (currentSortOrder === 'desc') {
          return aValue < bValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }

    function getFilteredFiles(files) {
      if (currentFilterBy === 'all') return files;
      
      return files.filter(file => {
        const fileType = getFileType(file);
        return fileType === currentFilterBy;
      });
    }

    function getFileType(file) {
      const extension = (file.name || '').split('.').pop()?.toLowerCase();
      
      if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
        return 'image';
      }
      if (['mp4', 'avi', 'mov', 'wmv', 'flv'].includes(extension)) {
        return 'video';
      }
      if (['mp3', 'wav', 'ogg', 'flac'].includes(extension)) {
        return 'audio';
      }
      if (['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(extension)) {
        return 'document';
      }
      
      return 'other';
    }

    function getFileIcon(file) {
      const type = getFileType(file);
      const iconMap = {
        image: '🖼️',
        video: '🎬',
        audio: '🎵',
        document: '📄',
        other: '📁'
      };
      return iconMap[type];
    }

    function formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    function formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    }

    function handleSortChange(event) {
      currentSortBy = event.target.value;
      renderFiles();
    }

    function handleFilterChange(event) {
      currentFilterBy = event.target.value;
      renderFiles();
    }

    return createComponent.call(this);
  }
}

// Create singleton instance
export const fileListAdapter = new FileListAdapter();
