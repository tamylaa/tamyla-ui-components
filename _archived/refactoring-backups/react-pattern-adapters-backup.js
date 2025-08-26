/**
 * React Pattern Adapter for Atomic Design System
 * Leverages excellent patterns from legacy/ folder across our modern atomic components
 */

/**
 * Legacy React Pattern Analysis & Modern Implementation
 * 
 * From legacy/TamylaEmailRecipients.js: 
 * - Chip-based multi-value input pattern
 * - Email validation logic
 * - Add/remove interaction patterns
 * 
 * From legacy/TamylaFileList.js:
 * - Selection state management
 * - Empty state handling
 * - File display patterns
 * 
 * From legacy/TamylaModal.js:
 * - Backdrop click handling
 * - Size variants
 * - Action composition
 * 
 * From legacy/TamylaNotification.js:
 * - Auto-dismiss timing
 * - Type-based styling
 * - Clean event handling
 */

import { InputFactory } from '../../atoms/input/input-system.js';
import { ButtonFactory } from '../../atoms/button/button-system.js';
import { CardFactory } from '../../atoms/card/card-system.js';

/**
 * Email Recipients Molecule
 * Adapted from legacy/TamylaEmailRecipients.js React patterns
 */
export class EmailRecipientsFactory {
  constructor() {
    this.inputFactory = new InputFactory();
    this.buttonFactory = new ButtonFactory();
  }

  create(props = {}) {
    const {
      value = [],
      onChange,
      placeholder = 'Add recipient email',
      maxRecipients = 50,
      allowDuplicates = false,
      validateEmail = true,
      container = null,
      className = ''
    } = props;

    let element = null;
    let currentValue = [...value];
    let inputElement = null;

    function createComponent() {
      element = document.createElement('div');
      element.className = `email-recipients ${className}`;
      
      // Create input using atomic Input
      const inputContainer = document.createElement('div');
      inputContainer.className = 'email-input-container';
      
      inputElement = this.inputFactory.create({
        type: 'email',
        placeholder,
        onKeyDown: handleKeyDown,
        onBlur: handleBlur,
        container: inputContainer
      });

      // Create add button using atomic Button
      const addButtonContainer = document.createElement('div');
      const addButton = this.buttonFactory.create({
        variant: 'primary',
        size: 'sm',
        label: 'Add',
        onClick: handleAdd,
        container: addButtonContainer
      });

      // Create chips container
      const chipsContainer = document.createElement('div');
      chipsContainer.className = 'email-chips';

      // Assemble component
      element.appendChild(chipsContainer);
      element.appendChild(inputContainer);
      element.appendChild(addButtonContainer);

      // Render initial chips
      renderChips();

      if (container) {
        container.appendChild(element);
      }

      return {
        element,
        getValue: () => [...currentValue],
        setValue: (newValue) => {
          currentValue = [...newValue];
          renderChips();
        },
        addEmail: (email) => addEmail(email),
        removeEmail: (email) => removeEmail(email),
        clear: () => {
          currentValue = [];
          renderChips();
          triggerChange();
        },
        destroy: () => {
          if (element?.parentNode) {
            element.parentNode.removeChild(element);
          }
        }
      };
    }

    // React pattern: Email validation (extracted from legacy)
    function isValidEmail(email) {
      if (!validateEmail) return true;
      return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
    }

    // React pattern: Add email with validation
    function addEmail(email) {
      const trimmedEmail = email.trim();
      
      if (!trimmedEmail) return false;
      
      if (!isValidEmail(trimmedEmail)) {
        showError('Invalid email format');
        return false;
      }
      
      if (!allowDuplicates && currentValue.includes(trimmedEmail)) {
        showError('Email already added');
        return false;
      }
      
      if (currentValue.length >= maxRecipients) {
        showError(`Maximum ${maxRecipients} recipients allowed`);
        return false;
      }
      
      currentValue.push(trimmedEmail);
      renderChips();
      triggerChange();
      return true;
    }

    // React pattern: Remove email
    function removeEmail(emailToRemove) {
      currentValue = currentValue.filter(email => email !== emailToRemove);
      renderChips();
      triggerChange();
    }

    // React pattern: Render chips (like React component render)
    function renderChips() {
      const chipsContainer = element.querySelector('.email-chips');
      
      chipsContainer.innerHTML = currentValue.map(email => `
        <span class="email-chip" data-email="${email}">
          <span class="chip-text">${email}</span>
          <button class="chip-remove" data-email="${email}" aria-label="Remove ${email}">×</button>
        </span>
      `).join('');

      // Add event listeners to remove buttons
      chipsContainer.querySelectorAll('.chip-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          removeEmail(btn.dataset.email);
        });
      });
    }

    // React pattern: Event handlers
    function handleKeyDown(event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        handleAdd();
      }
    }

    function handleBlur() {
      // Optional: Add email on blur
      const inputValue = inputElement.getValue();
      if (inputValue.trim()) {
        handleAdd();
      }
    }

    function handleAdd() {
      const inputValue = inputElement.getValue();
      if (addEmail(inputValue)) {
        inputElement.setValue('');
      }
    }

    function triggerChange() {
      if (onChange) {
        onChange([...currentValue]);
      }
    }

    function showError(message) {
      // Could integrate with notification system
      console.error('EmailRecipients:', message);
    }

    return createComponent.call(this);
  }
}

/**
 * Advanced File List Molecule  
 * Adapted from legacy/TamylaFileList.js React selection patterns
 */
export class AdvancedFileListFactory {
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
          <select class="sort-select">
            <option value="name">Sort by Name</option>
            <option value="size">Sort by Size</option>
            <option value="date">Sort by Date</option>
          </select>
          <select class="filter-select">
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

    // React pattern: File rendering with empty state
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

    // React pattern: Selection handling
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
      const selectionInfo = element.querySelector('.selection-info');
      selectionInfo.textContent = `${currentSelected.length} selected`;
    }

    // Utility functions (React pattern: helper methods)
    function getSortedFiles() {
      return [...currentFiles].sort((a, b) => {
        let aValue, bValue;
        
        switch (sortBy) {
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
        
        if (sortOrder === 'desc') {
          return aValue < bValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }

    function getFilteredFiles(files) {
      if (filterBy === 'all') return files;
      
      return files.filter(file => {
        const fileType = getFileType(file);
        return fileType === filterBy;
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
      sortBy = event.target.value;
      renderFiles();
    }

    function handleFilterChange(event) {
      filterBy = event.target.value;
      renderFiles();
    }

    return createComponent.call(this);
  }
}

/**
 * Advanced Modal System
 * Adapted from legacy/TamylaModal.js React patterns  
 */
export class AdvancedModalFactory {
  constructor() {
    this.buttonFactory = new ButtonFactory();
  }

  create(props = {}) {
    const {
      open = false,
      title = '',
      children = '',
      actions = [],
      size = 'md', // 'sm', 'md', 'lg', 'xl', 'full'
      closable = true,
      backdropClose = true,
      persistent = false,
      onClose,
      onOpen,
      className = ''
    } = props;

    let element = null;
    let isOpen = open;

    function createModal() {
      element = document.createElement('div');
      element.className = `advanced-modal-backdrop ${className}`;
      element.style.display = isOpen ? 'flex' : 'none';
      
      // Create modal container
      const modalContainer = document.createElement('div');
      modalContainer.className = `advanced-modal advanced-modal-${size}`;
      
      // Create header
      if (title || closable) {
        const header = createHeader();
        modalContainer.appendChild(header);
      }
      
      // Create body
      const body = document.createElement('div');
      body.className = 'advanced-modal-body';
      
      if (typeof children === 'string') {
        body.innerHTML = children;
      } else if (children instanceof Element) {
        body.appendChild(children);
      }
      
      modalContainer.appendChild(body);
      
      // Create actions footer
      if (actions.length > 0) {
        const footer = createFooter();
        modalContainer.appendChild(footer);
      }
      
      element.appendChild(modalContainer);
      
      // Add event listeners
      setupEventListeners();
      
      // Add to document
      document.body.appendChild(element);
      
      // Focus management
      if (isOpen) {
        handleOpen();
      }
      
      return {
        element,
        open: () => openModal(),
        close: () => closeModal(),
        toggle: () => isOpen ? closeModal() : openModal(),
        setContent: (newContent) => {
          body.innerHTML = '';
          if (typeof newContent === 'string') {
            body.innerHTML = newContent;
          } else if (newContent instanceof Element) {
            body.appendChild(newContent);
          }
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
      header.className = 'advanced-modal-header';
      
      if (title) {
        const titleElement = document.createElement('h2');
        titleElement.className = 'advanced-modal-title';
        titleElement.textContent = title;
        header.appendChild(titleElement);
      }
      
      if (closable) {
        const closeButton = document.createElement('button');
        closeButton.className = 'advanced-modal-close';
        closeButton.innerHTML = '×';
        closeButton.setAttribute('aria-label', 'Close modal');
        closeButton.addEventListener('click', closeModal);
        header.appendChild(closeButton);
      }
      
      return header;
    }

    function createFooter() {
      const footer = document.createElement('div');
      footer.className = 'advanced-modal-footer';
      
      actions.forEach(action => {
        const buttonContainer = document.createElement('div');
        
        const button = this.buttonFactory.create({
          variant: action.variant || 'secondary',
          size: action.size || 'md',
          label: action.label,
          onClick: () => {
            if (action.onClick) {
              action.onClick();
            }
            if (action.close !== false) {
              closeModal();
            }
          },
          container: buttonContainer
        });
        
        footer.appendChild(buttonContainer);
      });
      
      return footer;
    }

    function setupEventListeners() {
      // Backdrop click handling (React pattern)
      if (backdropClose) {
        element.addEventListener('click', (e) => {
          if (e.target === element) {
            closeModal();
          }
        });
      }
      
      // Escape key handling
      document.addEventListener('keydown', handleKeyDown);
      
      // Prevent modal container clicks from closing
      const modalContainer = element.querySelector('.advanced-modal');
      modalContainer.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }

    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen && closable && !persistent) {
        closeModal();
      }
    }

    function openModal() {
      if (isOpen) return;
      
      isOpen = true;
      element.style.display = 'flex';
      
      // Focus management
      handleOpen();
      
      if (onOpen) {
        onOpen();
      }
    }

    function closeModal() {
      if (!isOpen || persistent) return;
      
      isOpen = false;
      element.style.display = 'none';
      
      // Focus management
      handleClose();
      
      if (onClose) {
        onClose();
      }
    }

    function handleOpen() {
      // Store previously focused element
      element._previousFocus = document.activeElement;
      
      // Focus first focusable element in modal
      setTimeout(() => {
        const focusable = element.querySelector('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusable) {
          focusable.focus();
        }
      }, 100);
      
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
    }

    function handleClose() {
      // Restore focus
      if (element._previousFocus && element._previousFocus.focus) {
        element._previousFocus.focus();
      }
      
      // Restore scrolling
      document.body.style.overflow = '';
    }

    return createModal.call(this);
  }
}

/**
 * Notification System
 * Adapted from legacy/TamylaNotification.js React patterns
 */
export class NotificationFactory {
  constructor() {
    this.notifications = new Map();
    this.container = null;
    this.createContainer();
  }

  createContainer() {
    this.container = document.createElement('div');
    this.container.className = 'notifications-container';
    this.container.id = 'notifications-container';
    document.body.appendChild(this.container);
  }

  create(props = {}) {
    const {
      type = 'info', // 'info', 'success', 'warning', 'error'
      message = '',
      duration = 4000,
      persistent = false,
      actions = [],
      onClose,
      id = Date.now().toString()
    } = props;

    let element = null;
    let timeoutId = null;

    function createNotification() {
      element = document.createElement('div');
      element.className = `notification notification-${type}`;
      element.dataset.id = id;
      
      // Create content
      const content = document.createElement('div');
      content.className = 'notification-content';
      
      // Add icon based on type
      const icon = document.createElement('span');
      icon.className = 'notification-icon';
      icon.textContent = getTypeIcon(type);
      content.appendChild(icon);
      
      // Add message
      const messageElement = document.createElement('span');
      messageElement.className = 'notification-message';
      messageElement.textContent = message;
      content.appendChild(messageElement);
      
      element.appendChild(content);
      
      // Add actions if provided
      if (actions.length > 0) {
        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'notification-actions';
        
        actions.forEach(action => {
          const button = document.createElement('button');
          button.className = `notification-action action-${action.variant || 'primary'}`;
          button.textContent = action.label;
          button.addEventListener('click', () => {
            if (action.onClick) action.onClick();
            close();
          });
          actionsContainer.appendChild(button);
        });
        
        element.appendChild(actionsContainer);
      }
      
      // Add close button
      const closeButton = document.createElement('button');
      closeButton.className = 'notification-close';
      closeButton.innerHTML = '×';
      closeButton.setAttribute('aria-label', 'Close notification');
      closeButton.addEventListener('click', close);
      element.appendChild(closeButton);
      
      // Add to container
      this.container.appendChild(element);
      this.notifications.set(id, element);
      
      // Auto-dismiss timer (React pattern)
      if (!persistent && duration > 0) {
        timeoutId = setTimeout(close, duration);
      }
      
      // Animate in
      requestAnimationFrame(() => {
        element.classList.add('notification-enter');
      });
      
      return {
        element,
        close,
        extend: (additionalTime) => {
          if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(close, additionalTime);
          }
        }
      };
    }

    function close() {
      if (!element || !element.parentNode) return;
      
      // Clear timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      // Animate out
      element.classList.add('notification-exit');
      
      setTimeout(() => {
        if (element && element.parentNode) {
          element.parentNode.removeChild(element);
        }
        this.notifications.delete(id);
        
        if (onClose) {
          onClose();
        }
      }, 300);
    }

    function getTypeIcon(type) {
      const iconMap = {
        info: 'ℹ️',
        success: '✅',
        warning: '⚠️',
        error: '❌'
      };
      return iconMap[type] || iconMap.info;
    }

    return createNotification.call(this);
  }

  // Convenience methods
  info(message, options = {}) {
    return this.create({ ...options, type: 'info', message });
  }

  success(message, options = {}) {
    return this.create({ ...options, type: 'success', message });
  }

  warning(message, options = {}) {
    return this.create({ ...options, type: 'warning', message });
  }

  error(message, options = {}) {
    return this.create({ ...options, type: 'error', message, duration: 6000 });
  }

  clearAll() {
    this.notifications.forEach(notification => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    });
    this.notifications.clear();
  }
}

// Apply styles for React-inspired components
function applyReactPatternStyles() {
  const styleId = 'react-pattern-styles';
  
  if (document.getElementById(styleId)) {
    return;
  }
  
  const styles = document.createElement('style');
  styles.id = styleId;
  styles.textContent = `
    /* Email Recipients Styles */
    .email-recipients {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
      padding: 8px;
      border: 1px solid #D1D5DB;
      border-radius: 6px;
      background: white;
      min-height: 40px;
    }
    
    .email-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      flex: 1;
    }
    
    .email-chip {
      display: flex;
      align-items: center;
      gap: 4px;
      background: #EFF6FF;
      color: #1E40AF;
      padding: 4px 8px;
      border-radius: 16px;
      font-size: 14px;
      border: 1px solid #BFDBFE;
    }
    
    .chip-remove {
      background: none;
      border: none;
      color: #6B7280;
      cursor: pointer;
      font-size: 16px;
      padding: 0;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .chip-remove:hover {
      background: #EF4444;
      color: white;
    }
    
    .email-input-container {
      flex: 1;
      min-width: 150px;
    }
    
    /* Advanced File List Styles */
    .advanced-file-list {
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      background: white;
      overflow: hidden;
    }
    
    .file-list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      background: #F9FAFB;
      border-bottom: 1px solid #E5E7EB;
    }
    
    .file-list-info h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }
    
    .selection-info {
      font-size: 14px;
      color: #6B7280;
    }
    
    .file-list-controls {
      display: flex;
      gap: 12px;
    }
    
    .sort-select, .filter-select {
      padding: 6px 12px;
      border: 1px solid #D1D5DB;
      border-radius: 4px;
      background: white;
      font-size: 14px;
    }
    
    .files-container {
      padding: 16px;
      max-height: 400px;
      overflow-y: auto;
    }
    
    .file-card {
      margin-bottom: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .file-card.selected {
      background: #EFF6FF !important;
      border-color: #3B82F6 !important;
    }
    
    .file-content {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      position: relative;
    }
    
    .file-icon {
      font-size: 24px;
      width: 32px;
      text-align: center;
    }
    
    .file-info {
      flex: 1;
    }
    
    .file-name {
      font-weight: 500;
      margin-bottom: 4px;
    }
    
    .file-size, .file-date {
      font-size: 12px;
      color: #6B7280;
    }
    
    .selection-indicator {
      position: absolute;
      top: 8px;
      right: 8px;
      background: #10B981;
      color: white;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
    }
    
    /* Advanced Modal Styles */
    .advanced-modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      animation: backdropFadeIn 0.2s ease-out;
    }
    
    .advanced-modal {
      background: white;
      border-radius: 8px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      display: flex;
      flex-direction: column;
      max-height: 90vh;
      animation: modalSlideIn 0.3s ease-out;
    }
    
    .advanced-modal-sm { max-width: 400px; }
    .advanced-modal-md { max-width: 600px; }
    .advanced-modal-lg { max-width: 800px; }
    .advanced-modal-xl { max-width: 1000px; }
    .advanced-modal-full { 
      width: 95vw; 
      height: 95vh; 
      max-width: none; 
      max-height: none; 
    }
    
    .advanced-modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px 16px;
      border-bottom: 1px solid #E5E7EB;
    }
    
    .advanced-modal-title {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }
    
    .advanced-modal-close {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #6B7280;
      padding: 0;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .advanced-modal-close:hover {
      background: #F3F4F6;
      color: #374151;
    }
    
    .advanced-modal-body {
      padding: 24px;
      overflow-y: auto;
      flex: 1;
    }
    
    .advanced-modal-footer {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      padding: 16px 24px;
      border-top: 1px solid #E5E7EB;
      background: #F9FAFB;
    }
    
    /* Notification Styles */
    .notifications-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 2000;
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-width: 400px;
    }
    
    .notification {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      position: relative;
      transform: translateX(100%);
      opacity: 0;
      transition: all 0.3s ease;
    }
    
    .notification-enter {
      transform: translateX(0);
      opacity: 1;
    }
    
    .notification-exit {
      transform: translateX(100%);
      opacity: 0;
    }
    
    .notification-info {
      background: #EFF6FF;
      border-left: 4px solid #3B82F6;
      color: #1E40AF;
    }
    
    .notification-success {
      background: #F0FDF4;
      border-left: 4px solid #10B981;
      color: #065F46;
    }
    
    .notification-warning {
      background: #FFFBEB;
      border-left: 4px solid #F59E0B;
      color: #92400E;
    }
    
    .notification-error {
      background: #FEF2F2;
      border-left: 4px solid #EF4444;
      color: #991B1B;
    }
    
    .notification-content {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1;
    }
    
    .notification-icon {
      font-size: 16px;
    }
    
    .notification-message {
      font-size: 14px;
      line-height: 1.4;
    }
    
    .notification-close {
      background: none;
      border: none;
      color: currentColor;
      cursor: pointer;
      font-size: 18px;
      padding: 4px;
      border-radius: 4px;
      opacity: 0.7;
    }
    
    .notification-close:hover {
      opacity: 1;
      background: rgba(0, 0, 0, 0.1);
    }
    
    .notification-actions {
      display: flex;
      gap: 8px;
      margin-top: 8px;
    }
    
    .notification-action {
      padding: 4px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
    }
    
    .action-primary {
      background: currentColor;
      color: white;
    }
    
    .action-secondary {
      background: transparent;
      color: currentColor;
      border: 1px solid currentColor;
    }
    
    /* Animation keyframes */
    @keyframes backdropFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes modalSlideIn {
      from {
        transform: translateY(-20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    
    /* Empty state styles */
    .empty-state {
      text-align: center;
      padding: 40px 20px;
      color: #6B7280;
    }
    
    .empty-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }
    
    .empty-title {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 8px;
      color: #374151;
    }
    
    .empty-message {
      font-size: 14px;
      line-height: 1.5;
    }
  `;
  
  document.head.appendChild(styles);
}

// Initialize styles when module is loaded
applyReactPatternStyles();

// Create global instances
export const emailRecipientsFactory = new EmailRecipientsFactory();
export const advancedFileListFactory = new AdvancedFileListFactory();
export const advancedModalFactory = new AdvancedModalFactory();
export const notificationFactory = new NotificationFactory();

// Export factory classes for custom instances
export {
  EmailRecipientsFactory,
  AdvancedFileListFactory,
  AdvancedModalFactory,
  NotificationFactory
};
