/**
 * Content Card Template Generator
 * Pure HTML template generation for content-card molecule
 */

import { cardTemplates } from '../../../atoms/card/templates/card-template.js';
import { createButtonTemplate } from '../../../atoms/button/templates/button-template.js';

export function createContentCardTemplate(props) {
  const {
    content = {},
    variant = 'default',
    size = 'md',
    selectable = false,
    selected = false,
    disabled = false,
    loading = false,
    showActions = true,
    highlightTerms = [],
    className = ''
  } = props;

  const {
    id,
    title = 'Untitled Content',
    description = '',
    type = 'content',
    author = '',
    date = '',
    tags = [],
    stats = {},
    actions = [],
    media = null,
    url = null
  } = content;

  const classes = [
    'tmyl-content-card',
    `tmyl-content-card--${size}`,
    selectable && 'tmyl-content-card--selectable',
    selected && 'tmyl-content-card--selected',
    disabled && 'tmyl-content-card--disabled',
    loading && 'tmyl-content-card--loading',
    className
  ].filter(Boolean).join(' ');

  // Highlight search terms in text
  const highlightText = (text) => {
    if (!highlightTerms.length || !text) return text;
    
    let highlightedText = text;
    highlightTerms.forEach(term => {
      const regex = new RegExp(`(${term})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<span class="tmyl-content-card__highlight">$1</span>');
    });
    return highlightedText;
  };

  // Create card content
  const cardContent = `
    ${selectable ? '<div class="tmyl-content-card__selection-indicator"></div>' : ''}
    
    ${media ? `
      <div class="tmyl-content-card__media">
        <img src="${media.url}" alt="${media.alt || title}" loading="lazy" />
        ${media.duration ? `
          <div class="tmyl-content-card__media-overlay">
            <div class="tmyl-content-card__media-info">${media.duration}</div>
          </div>
        ` : ''}
      </div>
    ` : ''}

    <div class="tmyl-content-card__header">
      <div class="tmyl-content-card__meta">
        <div class="tmyl-content-card__type">
          <div class="tmyl-content-card__type-icon">
            ${getContentTypeIcon(type)}
          </div>
          ${type}
        </div>
        ${author ? `<span>by ${author}</span>` : ''}
        ${date ? `<span>${formatDate(date)}</span>` : ''}
      </div>
      
      <h3 class="tmyl-content-card__title">
        ${url ? `<a href="${url}" target="_blank" rel="noopener noreferrer">` : ''}
        ${highlightText(title)}
        ${url ? '</a>' : ''}
      </h3>
      
      ${description ? `
        <div class="tmyl-content-card__description tmyl-content-card__description--truncated">
          ${highlightText(description)}
        </div>
      ` : ''}
    </div>

    ${(tags.length || Object.keys(stats).length) ? `
      <div class="tmyl-content-card__details">
        ${tags.length ? `
          <div class="tmyl-content-card__tags">
            ${tags.map(tag => `
              <span class="tmyl-content-card__tag">${tag}</span>
            `).join('')}
          </div>
        ` : ''}
        
        ${Object.keys(stats).length ? `
          <div class="tmyl-content-card__stats">
            ${Object.entries(stats).map(([key, value]) => `
              <div class="tmyl-content-card__stat">
                <div class="tmyl-content-card__stat-icon">
                  ${getStatIcon(key)}
                </div>
                <span>${formatStatValue(key, value)}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    ` : ''}

    ${showActions && actions.length ? `
      <div class="tmyl-content-card__footer">
        <div class="tmyl-content-card__actions">
          ${actions.map(action => createButtonTemplate({
            variant: action.variant || 'ghost',
            size: 'sm',
            text: action.label,
            icon: action.icon,
            disabled: disabled,
            'data-action': action.action,
            'data-content-id': id
          })).join('')}
        </div>
      </div>
    ` : ''}
  `;

  // Use atomic card template as foundation
  return `
    <div class="${classes}" data-content-id="${id || ''}" ${selectable ? 'tabindex="0"' : ''}>
      ${cardTemplates.basic({
        variant,
        size,
        interactive: selectable,
        className: 'tmyl-content-card__card',
        children: cardContent
      })}
    </div>
  `;
}

/**
 * Update content card state
 */
export function updateContentCardState(element, props) {
  const card = element.querySelector('.tmyl-content-card__card');
  
  if (!card) return;

  // Update selection state
  if (props.selected !== undefined) {
    if (props.selected) {
      element.classList.add('tmyl-content-card--selected');
      element.setAttribute('aria-selected', 'true');
    } else {
      element.classList.remove('tmyl-content-card--selected');
      element.removeAttribute('aria-selected');
    }
  }

  // Update disabled state
  if (props.disabled !== undefined) {
    if (props.disabled) {
      element.classList.add('tmyl-content-card--disabled');
      element.setAttribute('aria-disabled', 'true');
    } else {
      element.classList.remove('tmyl-content-card--disabled');
      element.removeAttribute('aria-disabled');
    }
  }

  // Update loading state
  if (props.loading !== undefined) {
    if (props.loading) {
      element.classList.add('tmyl-content-card--loading');
    } else {
      element.classList.remove('tmyl-content-card--loading');
    }
  }

  // Update highlight terms
  if (props.highlightTerms) {
    const title = element.querySelector('.tmyl-content-card__title');
    const description = element.querySelector('.tmyl-content-card__description');
    
    [title, description].forEach(el => {
      if (el && el.dataset.originalText) {
        el.innerHTML = highlightText(el.dataset.originalText, props.highlightTerms);
      }
    });
  }
}

/**
 * Template shortcuts for common content patterns
 */
export const contentCardTemplates = {
  article: (props) => createContentCardTemplate({
    ...props,
    content: {
      type: 'article',
      ...props.content
    }
  }),
  
  document: (props) => createContentCardTemplate({
    ...props,
    content: {
      type: 'document',
      ...props.content
    }
  }),
  
  video: (props) => createContentCardTemplate({
    ...props,
    content: {
      type: 'video',
      ...props.content
    }
  }),
  
  image: (props) => createContentCardTemplate({
    ...props,
    content: {
      type: 'image',
      ...props.content
    }
  }),

  compact: (props) => createContentCardTemplate({
    ...props,
    size: 'compact',
    showActions: false
  }),

  detailed: (props) => createContentCardTemplate({
    ...props,
    size: 'detailed',
    showActions: true
  }),

  selectable: (props) => createContentCardTemplate({
    ...props,
    selectable: true
  }),

  grid: (contentItems, props = {}) => {
    return contentItems.map(content => createContentCardTemplate({
      ...props,
      content
    })).join('');
  }
};

/**
 * Get icon for content type
 */
function getContentTypeIcon(type) {
  const icons = {
    article: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd"></path></svg>`,
    document: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd"></path></svg>`,
    video: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path></svg>`,
    image: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path></svg>`,
    podcast: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 010 1.414A4.98 4.98 0 0117 10a4.98 4.98 0 01-1.343 2.243 1 1 0 11-1.414-1.414A2.98 2.98 0 0015 10a2.98 2.98 0 00-.757-1.829 1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>`,
    content: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>`
  };
  
  return icons[type] || icons.content;
}

/**
 * Get icon for stat type
 */
function getStatIcon(statType) {
  const icons = {
    views: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path></svg>`,
    downloads: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>`,
    likes: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path></svg>`,
    comments: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"></path></svg>`,
    shares: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"></path></svg>`,
    duration: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path></svg>`,
    size: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clip-rule="evenodd"></path></svg>`
  };
  
  return icons[statType] || icons.views;
}

/**
 * Format stat values for display
 */
function formatStatValue(statType, value) {
  if (typeof value !== 'number') return value;
  
  switch (statType) {
    case 'size':
      return formatFileSize(value);
    case 'duration':
      return formatDuration(value);
    default:
      return value.toLocaleString();
  }
}

/**
 * Format file size in bytes to human readable
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Format duration in seconds to human readable
 */
function formatDuration(seconds) {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

/**
 * Format date for display
 */
function formatDate(date) {
  if (typeof date === 'string') {
    const d = new Date(date);
    return d.toLocaleDateString();
  }
  return date.toLocaleDateString();
}

/**
 * Highlight search terms in text
 */
function highlightText(text, terms) {
  if (!terms.length || !text) return text;
  
  let highlightedText = text;
  terms.forEach(term => {
    const regex = new RegExp(`(${term})`, 'gi');
    highlightedText = highlightedText.replace(regex, '<span class="tmyl-content-card__highlight">$1</span>');
  });
  return highlightedText;
}
