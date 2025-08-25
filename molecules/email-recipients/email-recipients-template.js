/**
 * Email Recipients Molecule Templates
 * Template generation for email chip input management
 */

/**
 * Create email recipients template
 */
export function createEmailRecipientsTemplate(options = {}) {
  const {
    emails = [],
    placeholder = 'Add recipient email',
    addButtonText = 'Add',
    size = 'medium', // small, medium, large
    disabled = false,
    loading = false,
    error = false,
    showAddButton = true,
    maxEmails = null,
    id = ''
  } = options;

  const containerClass = [
    'tmyl-email-recipients',
    size !== 'medium' ? `tmyl-email-recipients--${size}` : '',
    emails.length === 0 ? 'tmyl-email-recipients--empty' : '',
    disabled ? 'tmyl-email-recipients--disabled' : '',
    loading ? 'tmyl-email-recipients--loading' : '',
    error ? 'tmyl-email-recipients--error' : ''
  ].filter(Boolean).join(' ');

  const inputId = id ? `${id}-input` : `email-input-${Date.now()}`;

  return `
    <div 
      class="${containerClass}" 
      role="group" 
      aria-label="Email recipients"
      ${id ? `id="${id}"` : ''}
      data-max-emails="${maxEmails || ''}"
    >
      ${emails.map(email => createEmailChip(email)).join('')}
      <input 
        type="email" 
        class="tmyl-email-input"
        id="${inputId}"
        placeholder="${placeholder}"
        ${disabled ? 'disabled' : ''}
        aria-label="Add email recipient"
        autocomplete="email"
        spellcheck="false"
      />
      ${showAddButton ? `
        <button 
          type="button" 
          class="tmyl-email-add"
          ${disabled ? 'disabled' : ''}
          aria-label="Add email recipient"
        >
          ${addButtonText}
        </button>
      ` : ''}
    </div>
  `.trim();
}

/**
 * Create email chip element
 */
export function createEmailChip(email, options = {}) {
  const {
    removable = true,
    valid = true,
    duplicate = false
  } = options;

  const chipClass = [
    'tmyl-email-chip',
    !valid ? 'tmyl-email-chip--invalid' : '',
    duplicate ? 'tmyl-email-chip--duplicate' : ''
  ].filter(Boolean).join(' ');

  const chipId = `chip-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  return `
    <span 
      class="${chipClass}" 
      data-email="${email}"
      id="${chipId}"
      role="option"
      aria-selected="true"
      ${!valid ? 'aria-invalid="true"' : ''}
      ${duplicate ? 'aria-describedby="duplicate-warning"' : ''}
    >
      <span class="tmyl-email-chip__email" title="${email}">${email}</span>
      ${removable ? `
        <button 
          type="button" 
          class="tmyl-email-chip__remove"
          aria-label="Remove ${email}"
          data-email="${email}"
          tabindex="0"
        >×</button>
      ` : ''}
    </span>
  `;
}

/**
 * Create email recipients with input group wrapper
 */
export function createEmailRecipientsGroup(options = {}) {
  const {
    label = 'Email Recipients',
    required = false,
    error = '',
    help = '',
    ...recipientsOptions
  } = options;

  const groupId = `email-group-${Date.now()}`;
  const errorId = error ? `${groupId}-error` : '';
  const helpId = help ? `${groupId}-help` : '';

  const labelClass = [
    'tmyl-input-group__label',
    required ? 'tmyl-input-group__label--required' : ''
  ].filter(Boolean).join(' ');

  return `
    <div class="tmyl-input-group ${error ? 'tmyl-input-group--error' : ''}" role="group">
      ${label ? `
        <label class="${labelClass}" for="${groupId}">
          ${label}
        </label>
      ` : ''}
      
      ${createEmailRecipientsTemplate({
        ...recipientsOptions,
        id: groupId,
        error: !!error
      })}
      
      ${error ? `
        <div 
          class="tmyl-input-group__error" 
          id="${errorId}"
          role="alert" 
          aria-live="polite"
        >
          ${error}
        </div>
      ` : ''}
      
      ${help ? `
        <div class="tmyl-input-group__help" id="${helpId}">
          ${help}
        </div>
      ` : ''}
    </div>
  `;
}

/**
 * Create bulk email input template
 */
export function createBulkEmailTemplate(options = {}) {
  const {
    placeholder = 'Paste multiple emails (separated by commas, semicolons, or line breaks)',
    showParseButton = true,
    parseButtonText = 'Parse Emails',
    id = ''
  } = options;

  const textareaId = id ? `${id}-bulk` : `bulk-email-${Date.now()}`;

  return `
    <div class="tmyl-bulk-email-input">
      <textarea 
        class="tmyl-bulk-textarea"
        id="${textareaId}"
        placeholder="${placeholder}"
        rows="4"
        aria-label="Bulk email input"
      ></textarea>
      ${showParseButton ? `
        <button 
          type="button" 
          class="tmyl-bulk-parse"
          aria-label="Parse emails from text"
        >
          ${parseButtonText}
        </button>
      ` : ''}
    </div>
  `;
}

/**
 * Create email validation message template
 */
export function createValidationMessage(type, count = 0) {
  const messages = {
    invalid: `${count} invalid email${count !== 1 ? 's' : ''} detected`,
    duplicate: `${count} duplicate email${count !== 1 ? 's' : ''} found`,
    maxReached: `Maximum number of emails reached`,
    empty: 'At least one email is required',
    success: `${count} email${count !== 1 ? 's' : ''} added successfully`
  };

  const iconMap = {
    invalid: '⚠',
    duplicate: '⚠',
    maxReached: '⚠',
    empty: '⚠',
    success: '✓'
  };

  const typeClass = type === 'success' ? 'success' : 'warning';

  return `
    <div class="tmyl-validation-message tmyl-validation-message--${typeClass}" role="alert">
      <span class="tmyl-validation-icon">${iconMap[type]}</span>
      <span class="tmyl-validation-text">${messages[type] || type}</span>
    </div>
  `;
}

/**
 * Create email suggestions dropdown template
 */
export function createEmailSuggestionsTemplate(suggestions = [], options = {}) {
  const {
    query = '',
    maxSuggestions = 5,
    showDomainSuggestions = true
  } = options;

  const filteredSuggestions = suggestions
    .filter(suggestion => 
      suggestion.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, maxSuggestions);

  // Add domain suggestions if enabled and query looks like partial email
  const domainSuggestions = [];
  if (showDomainSuggestions && query.includes('@') && !query.includes('.')) {
    const [localPart, domain] = query.split('@');
    const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    
    commonDomains.forEach(commonDomain => {
      if (commonDomain.startsWith(domain)) {
        domainSuggestions.push(`${localPart}@${commonDomain}`);
      }
    });
  }

  const allSuggestions = [...filteredSuggestions, ...domainSuggestions];

  if (allSuggestions.length === 0) {
    return '';
  }

  return `
    <div class="tmyl-email-suggestions" role="listbox" aria-label="Email suggestions">
      ${allSuggestions.map((suggestion, index) => `
        <div 
          class="tmyl-email-suggestion" 
          role="option"
          tabindex="0"
          data-email="${suggestion}"
          aria-selected="false"
          id="suggestion-${index}"
        >
          ${highlightQuery(suggestion, query)}
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * Highlight query in suggestion text
 */
function highlightQuery(text, query) {
  if (!query) return text;
  
  const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

/**
 * Escape special regex characters
 */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Create email import template
 */
export function createEmailImportTemplate(options = {}) {
  const {
    supportedFormats = ['CSV', 'TXT', 'JSON'],
    dragAndDrop = true,
    id = ''
  } = options;

  const importId = id ? `${id}-import` : `email-import-${Date.now()}`;

  return `
    <div class="tmyl-email-import" id="${importId}">
      ${dragAndDrop ? `
        <div class="tmyl-email-dropzone" role="button" tabindex="0" aria-label="Drag and drop email file or click to select">
          <div class="tmyl-dropzone-content">
            <span class="tmyl-dropzone-icon">📧</span>
            <span class="tmyl-dropzone-text">Drag and drop email file here</span>
            <span class="tmyl-dropzone-subtext">or click to select file</span>
            <span class="tmyl-dropzone-formats">Supported: ${supportedFormats.join(', ')}</span>
          </div>
        </div>
      ` : ''}
      
      <input 
        type="file" 
        class="tmyl-email-file-input"
        accept=".csv,.txt,.json"
        aria-label="Select email file"
        style="display: none;"
      />
      
      <div class="tmyl-import-actions">
        <button type="button" class="tmyl-import-browse">
          Browse Files
        </button>
        <button type="button" class="tmyl-import-clear" disabled>
          Clear
        </button>
      </div>
    </div>
  `;
}

/**
 * Create email statistics template
 */
export function createEmailStatsTemplate(stats = {}) {
  const {
    total = 0,
    valid = 0,
    invalid = 0,
    duplicates = 0
  } = stats;

  return `
    <div class="tmyl-email-stats">
      <div class="tmyl-stat">
        <span class="tmyl-stat-label">Total:</span>
        <span class="tmyl-stat-value">${total}</span>
      </div>
      <div class="tmyl-stat">
        <span class="tmyl-stat-label">Valid:</span>
        <span class="tmyl-stat-value tmyl-stat-value--success">${valid}</span>
      </div>
      ${invalid > 0 ? `
        <div class="tmyl-stat">
          <span class="tmyl-stat-label">Invalid:</span>
          <span class="tmyl-stat-value tmyl-stat-value--error">${invalid}</span>
        </div>
      ` : ''}
      ${duplicates > 0 ? `
        <div class="tmyl-stat">
          <span class="tmyl-stat-label">Duplicates:</span>
          <span class="tmyl-stat-value tmyl-stat-value--warning">${duplicates}</span>
        </div>
      ` : ''}
    </div>
  `;
}

export default {
  createEmailRecipientsTemplate,
  createEmailChip,
  createEmailRecipientsGroup,
  createBulkEmailTemplate,
  createValidationMessage,
  createEmailSuggestionsTemplate,
  createEmailImportTemplate,
  createEmailStatsTemplate
};
