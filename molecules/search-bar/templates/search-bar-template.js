/**
 * Search Bar Template Generator
 * Pure HTML template generation for search-bar molecule
 */

import { inputTemplates } from '../../atoms/input/templates/input-template.js';
import { createButtonTemplate } from '../../atoms/button/templates/button-template.js';

export function createSearchBarTemplate(props) {
  const {
    placeholder = 'Search...',
    value = '',
    size = 'md',
    disabled = false,
    loading = false,
    voiceEnabled = false,
    clearable = true,
    showSubmitButton = true,
    suggestions = [],
    showSuggestions = false,
    maxSuggestions = 5,
    className = ''
  } = props;

  const classes = [
    'tmyl-search-bar',
    `tmyl-search-bar--${size}`,
    loading && 'tmyl-search-bar--loading',
    disabled && 'tmyl-search-bar--disabled',
    className
  ].filter(Boolean).join(' ');

  // Create search input
  const searchInput = inputTemplates.search({
    placeholder,
    value,
    size,
    disabled,
    variant: 'primary',
    className: `tmyl-search-bar__input${voiceEnabled ? ' tmyl-search-bar__input--with-voice' : ''}`
  });

  // Create action buttons
  const actionButtons = [];
  
  if (clearable && value) {
    actionButtons.push(createButtonTemplate({
      variant: 'ghost',
      size: 'sm',
      icon: 'x',
      className: 'tmyl-search-bar__action-button tmyl-search-bar__clear-button',
      'aria-label': 'Clear search',
      'data-action': 'clear'
    }));
  }

  if (voiceEnabled) {
    actionButtons.push(createButtonTemplate({
      variant: 'ghost',
      size: 'sm',
      icon: 'microphone',
      className: 'tmyl-search-bar__action-button tmyl-search-bar__voice-button',
      'aria-label': 'Voice search',
      'data-action': 'voice'
    }));
  }

  // Create submit button
  const submitButton = showSubmitButton ? createButtonTemplate({
    variant: 'primary',
    size,
    icon: 'search',
    text: size === 'sm' ? '' : 'Search',
    className: 'tmyl-search-bar__submit-button',
    type: 'submit',
    disabled,
    loading,
    'data-action': 'submit'
  }) : '';

  // Create suggestions dropdown
  const suggestionsHtml = showSuggestions && suggestions.length ? `
    <div class="tmyl-search-bar__suggestions tmyl-search-bar__suggestions--visible">
      ${suggestions.slice(0, maxSuggestions).map((suggestion, index) => `
        <div class="tmyl-search-bar__suggestion" data-suggestion-index="${index}" data-action="select-suggestion">
          <div class="tmyl-search-bar__suggestion-icon">
            ${getSuggestionIcon(suggestion.type)}
          </div>
          <div class="tmyl-search-bar__suggestion-text">${suggestion.text}</div>
          ${suggestion.type ? `<div class="tmyl-search-bar__suggestion-type">${suggestion.type}</div>` : ''}
        </div>
      `).join('')}
    </div>
  ` : `<div class="tmyl-search-bar__suggestions"></div>`;

  return `
    <div class="${classes}">
      <form class="tmyl-search-bar__container" role="search">
        <div class="tmyl-search-bar__input-wrapper">
          ${searchInput}
          ${actionButtons.length ? `
            <div class="tmyl-search-bar__actions">
              ${actionButtons.join('')}
            </div>
          ` : ''}
          ${suggestionsHtml}
        </div>
        ${submitButton}
      </form>
    </div>
  `;
}

/**
 * Update search bar state
 */
export function updateSearchBarState(element, props) {
  const container = element.querySelector('.tmyl-search-bar__container');
  const input = element.querySelector('.tmyl-search-bar__input input');
  const suggestions = element.querySelector('.tmyl-search-bar__suggestions');
  
  if (!container || !input) return;

  // Update input value
  if (props.value !== undefined) {
    input.value = props.value;
  }

  // Update loading state
  if (props.loading !== undefined) {
    const submitButton = element.querySelector('[data-action="submit"]');
    if (submitButton) {
      if (props.loading) {
        submitButton.classList.add('tmyl-button--loading');
        submitButton.disabled = true;
      } else {
        submitButton.classList.remove('tmyl-button--loading');
        submitButton.disabled = false;
      }
    }
  }

  // Update suggestions
  if (props.suggestions && suggestions) {
    const showSuggestions = props.showSuggestions && props.suggestions.length > 0;
    suggestions.className = `tmyl-search-bar__suggestions${showSuggestions ? ' tmyl-search-bar__suggestions--visible' : ''}`;
    
    if (showSuggestions) {
      suggestions.innerHTML = props.suggestions.slice(0, props.maxSuggestions || 5).map((suggestion, index) => `
        <div class="tmyl-search-bar__suggestion" data-suggestion-index="${index}" data-action="select-suggestion">
          <div class="tmyl-search-bar__suggestion-icon">
            ${getSuggestionIcon(suggestion.type)}
          </div>
          <div class="tmyl-search-bar__suggestion-text">${suggestion.text}</div>
          ${suggestion.type ? `<div class="tmyl-search-bar__suggestion-type">${suggestion.type}</div>` : ''}
        </div>
      `).join('');
    }
  }

  // Update voice button state
  if (props.isListening !== undefined) {
    const voiceButton = element.querySelector('.tmyl-search-bar__voice-button');
    if (voiceButton) {
      if (props.isListening) {
        voiceButton.classList.add('tmyl-search-bar__voice-button--listening');
      } else {
        voiceButton.classList.remove('tmyl-search-bar__voice-button--listening');
      }
    }
  }
}

/**
 * Template shortcuts for common patterns
 */
export const searchBarTemplates = {
  basic: (props) => createSearchBarTemplate({ ...props, voiceEnabled: false, showSubmitButton: false }),
  
  withVoice: (props) => createSearchBarTemplate({ ...props, voiceEnabled: true }),
  
  withSuggestions: (props) => createSearchBarTemplate({ 
    ...props, 
    showSuggestions: true,
    suggestions: props.suggestions || []
  }),
  
  complete: (props) => createSearchBarTemplate({ 
    ...props, 
    voiceEnabled: true, 
    showSuggestions: true,
    clearable: true,
    showSubmitButton: true
  }),

  compact: (props) => createSearchBarTemplate({ 
    ...props, 
    size: 'sm',
    showSubmitButton: false
  })
};

/**
 * Get icon for suggestion type
 */
function getSuggestionIcon(type) {
  const icons = {
    recent: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path></svg>`,
    suggestion: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg>`,
    content: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd"></path></svg>`,
    user: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>`
  };
  
  return icons[type] || icons.suggestion;
}
