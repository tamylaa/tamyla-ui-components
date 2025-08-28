/**
 * Search Bar Factory System - Modular search-bar molecule creation
 * Creates search-bar components using atomic foundations and separated concerns
 */

import { designTokens } from '../../core/design-tokens.js';
import { sharedUtilities } from '../../core/shared-utilities.js';
import { createSearchBarTemplate, updateSearchBarState, searchBarTemplates } from './templates/search-bar-template.js';
import { SearchBarController } from './controllers/search-bar-controller.js';
import { InputFactory } from '../../atoms/input/input-system.js';
import { ButtonFactory } from '../../atoms/button/button-system.js';

/**
 * Search Bar Factory - Creates search-bar molecules with full atomic composition
 */
export class SearchBarFactory {
  constructor() {
    this.defaultProps = {
      placeholder: 'Search...',
      size: 'md',
      variant: 'primary',
      disabled: false,
      loading: false,
      voiceEnabled: false,
      clearable: true,
      showSubmitButton: true,
      suggestions: [],
      showSuggestions: false,
      maxSuggestions: 5
    };

    this.sizes = ['sm', 'md', 'lg', 'xl'];
    this.variants = ['primary', 'secondary', 'ghost'];

    // Initialize atomic factories
    this.inputFactory = new InputFactory();
    this.buttonFactory = new ButtonFactory();

    // Ensure CSS is loaded
    this.ensureCSS();
  }

  /**
   * Ensure CSS is loaded in the document
   */
  ensureCSS() {
    if (!document.querySelector('link[href*="search-bar.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = new URL('./styles/search-bar.css', import.meta.url).href;
      document.head.appendChild(link);
    }
  }

  /**
   * Create a search bar element with full functionality
   */
  create(props = {}) {
    const finalProps = { ...this.defaultProps, ...props };

    // Create container
    const container = document.createElement('div');
    container.innerHTML = createSearchBarTemplate(finalProps);
    const searchBar = container.firstElementChild;

    // Attach controller for behavior
    const controller = new SearchBarController(searchBar);
    searchBar._controller = controller;

    // Add event handlers if provided
    this.attachEventHandlers(searchBar, finalProps);

    return searchBar;
  }

  /**
   * Attach event handlers to search bar
   */
  attachEventHandlers(searchBar, props) {
    if (props.onSearch) {
      searchBar.addEventListener('tmyl-search-submit', props.onSearch);
    }

    if (props.onInput) {
      searchBar.addEventListener('tmyl-search-input', props.onInput);
    }

    if (props.onSuggestionSelect) {
      searchBar.addEventListener('tmyl-search-suggestion-select', props.onSuggestionSelect);
    }

    if (props.onVoiceStart) {
      searchBar.addEventListener('tmyl-search-voice-start', props.onVoiceStart);
    }

    if (props.onVoiceResult) {
      searchBar.addEventListener('tmyl-search-voice-result', props.onVoiceResult);
    }

    if (props.onClear) {
      searchBar.addEventListener('tmyl-search-clear', props.onClear);
    }

    if (props.onFocus) {
      searchBar.addEventListener('tmyl-search-focus', props.onFocus);
    }
  }

  /**
   * Create search bar with template shortcuts
   */
  createBasic(props = {}) {
    return this.create({
      ...props,
      voiceEnabled: false,
      showSubmitButton: false,
      clearable: false
    });
  }

  createWithVoice(props = {}) {
    return this.create({
      ...props,
      voiceEnabled: true
    });
  }

  createWithSuggestions(props = {}) {
    return this.create({
      ...props,
      showSuggestions: true,
      suggestions: props.suggestions || []
    });
  }

  createComplete(props = {}) {
    return this.create({
      ...props,
      voiceEnabled: true,
      showSuggestions: true,
      clearable: true,
      showSubmitButton: true
    });
  }

  createCompact(props = {}) {
    return this.create({
      ...props,
      size: 'sm',
      showSubmitButton: false
    });
  }

  /**
   * Create search bar for specific use cases
   */
  createGlobalSearch(props = {}) {
    return this.create({
      placeholder: 'Search everything...',
      voiceEnabled: true,
      showSuggestions: true,
      clearable: true,
      size: 'lg',
      ...props
    });
  }

  createContentSearch(props = {}) {
    return this.create({
      placeholder: 'Search content...',
      showSuggestions: true,
      clearable: true,
      ...props
    });
  }

  createQuickSearch(props = {}) {
    return this.create({
      placeholder: 'Quick search...',
      size: 'sm',
      showSubmitButton: false,
      clearable: true,
      ...props
    });
  }

  /**
   * Update existing search bar properties
   */
  update(searchBar, props) {
    updateSearchBarState(searchBar, props);
    return searchBar;
  }

  /**
   * Attach controller to existing search bar element
   */
  attachController(element, options = {}) {
    if (!element._controller) {
      const controller = new SearchBarController(element, options);
      element._controller = controller;
    }
    return element._controller;
  }

  /**
   * Create multiple search bars
   */
  createMultiple(searchBarConfigs) {
    return searchBarConfigs.map(config => this.create(config));
  }

  /**
   * Create search bar with specific suggestions
   */
  createWithRecentSearches(props = {}) {
    const recentSearches = this.getRecentSearches().map(search => ({
      text: search,
      type: 'recent'
    }));

    return this.create({
      ...props,
      suggestions: recentSearches,
      showSuggestions: true
    });
  }

  /**
   * Validation methods
   */
  validateProps(props) {
    const errors = [];

    if (props.size && !this.sizes.includes(props.size)) {
      errors.push(`Invalid size: ${props.size}. Must be one of: ${this.sizes.join(', ')}`);
    }

    if (props.variant && !this.variants.includes(props.variant)) {
      errors.push(`Invalid variant: ${props.variant}. Must be one of: ${this.variants.join(', ')}`);
    }

    if (props.maxSuggestions && (typeof props.maxSuggestions !== 'number' || props.maxSuggestions < 1)) {
      errors.push('maxSuggestions must be a positive number');
    }

    return errors;
  }

  /**
   * Accessibility helpers
   */
  makeAccessible(searchBar, options = {}) {
    const {
      label,
      describedBy,
      role = 'search',
      ariaExpanded,
      ariaLabel = 'Search'
    } = options;

    const form = searchBar.querySelector('.tmyl-search-bar__container');
    if (form) {
      form.setAttribute('role', role);
      form.setAttribute('aria-label', ariaLabel);
    }

    const input = searchBar.querySelector('.tmyl-search-bar__input input');
    if (input) {
      if (label) input.setAttribute('aria-label', label);
      if (describedBy) input.setAttribute('aria-describedby', describedBy);
      if (ariaExpanded !== undefined) input.setAttribute('aria-expanded', ariaExpanded);
    }

    return searchBar;
  }

  /**
   * Utility methods
   */
  getRecentSearches() {
    try {
      return JSON.parse(localStorage.getItem('tmyl-recent-searches')) || [];
    } catch {
      return [];
    }
  }

  clearRecentSearches() {
    try {
      localStorage.removeItem('tmyl-recent-searches');
    } catch {
      // Ignore localStorage errors
    }
  }

  /**
   * Integration with search services
   */
  createWithSearchService(searchService, props = {}) {
    const searchBar = this.create({
      ...props,
      showSuggestions: true
    });

    // Auto-wire to search service
    searchBar.addEventListener('tmyl-search-input', async (event) => {
      if (event.detail.shouldFetchSuggestions) {
        try {
          const suggestions = await searchService.getSuggestions(event.detail.query);
          this.update(searchBar, {
            suggestions,
            showSuggestions: suggestions.length > 0
          });
        } catch (error) {
          console.warn('Failed to fetch suggestions:', error);
        }
      }
    });

    searchBar.addEventListener('tmyl-search-submit', async (event) => {
      try {
        this.update(searchBar, { loading: true });
        const results = await searchService.search(event.detail.query);
        this.update(searchBar, { loading: false });

        // Dispatch results event
        searchBar.dispatchEvent(new CustomEvent('tmyl-search-results', {
          detail: { results, query: event.detail.query },
          bubbles: true
        }));
      } catch (error) {
        this.update(searchBar, { loading: false });
        console.error('Search failed:', error);
      }
    });

    return searchBar;
  }
}

// Create default factory instance
export const searchBarFactory = new SearchBarFactory();

// Convenience exports
export const {
  create: createSearchBar,
  createBasic,
  createWithVoice,
  createWithSuggestions,
  createComplete,
  createCompact,
  createGlobalSearch,
  createContentSearch,
  createQuickSearch
} = searchBarFactory;

// Export templates for direct usage
export { searchBarTemplates };

// Export controller for advanced usage
export { SearchBarController };
