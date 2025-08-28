/**
 * Search Bar Component Logic
 * Pure JavaScript logic for search-bar molecule behavior
 */

export class SearchBarController {
  constructor(element) {
    this.element = element;
    this.form = element.querySelector('.tmyl-search-bar__container');
    this.input = element.querySelector('.tmyl-search-bar__input input');
    this.suggestions = element.querySelector('.tmyl-search-bar__suggestions');

    this.state = {
      value: this.input?.value || '',
      isListening: false,
      highlightedIndex: -1,
      recentSearches: this.getRecentSearches()
    };

    this.debounceTimer = null;
    this.recognition = null;

    this.setupEventListeners();
    this.initializeVoiceSearch();
  }

  setupEventListeners() {
    if (!this.form || !this.input) return;

    // Form submission
    this.form.addEventListener('submit', this.handleSubmit.bind(this));

    // Input events
    this.input.addEventListener('input', this.handleInput.bind(this));
    this.input.addEventListener('keydown', this.handleKeydown.bind(this));
    this.input.addEventListener('focus', this.handleFocus.bind(this));
    this.input.addEventListener('blur', this.handleBlur.bind(this));

    // Action button clicks
    this.element.addEventListener('click', this.handleClick.bind(this));

    // Suggestion interactions
    if (this.suggestions) {
      this.suggestions.addEventListener('click', this.handleSuggestionClick.bind(this));
      this.suggestions.addEventListener('mouseover', this.handleSuggestionHover.bind(this));
    }

    // Click outside to close suggestions
    document.addEventListener('click', this.handleDocumentClick.bind(this));
  }

  handleSubmit(event) {
    event.preventDefault();

    const value = this.input.value.trim();
    if (!value) return;

    this.saveToRecentSearches(value);
    this.hideSuggestions();

    this.dispatchCustomEvent('tmyl-search-submit', {
      query: value,
      suggestions: this.getCurrentSuggestions()
    });
  }

  handleInput(event) {
    const value = event.target.value;
    this.state.value = value;

    // Clear debounce timer
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    // Update clear button visibility
    this.updateClearButtonVisibility(value);

    // Debounce search suggestions
    this.debounceTimer = setTimeout(() => {
      this.dispatchCustomEvent('tmyl-search-input', {
        query: value,
        shouldFetchSuggestions: value.length >= 2
      });
    }, 300);
  }

  handleKeydown(event) {
    const suggestions = this.getCurrentSuggestions();

    switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      this.highlightNextSuggestion(suggestions.length);
      break;

    case 'ArrowUp':
      event.preventDefault();
      this.highlightPreviousSuggestion(suggestions.length);
      break;

    case 'Enter':
      if (this.state.highlightedIndex >= 0 && suggestions.length > 0) {
        event.preventDefault();
        this.selectSuggestion(suggestions[this.state.highlightedIndex]);
      }
      break;

    case 'Escape':
      this.hideSuggestions();
      this.input.blur();
      break;

    case 'Tab':
      this.hideSuggestions();
      break;
    }
  }

  handleFocus(event) {
    if (this.state.value.length >= 2) {
      this.showSuggestions();
    }

    this.dispatchCustomEvent('tmyl-search-focus', {
      query: this.state.value
    });
  }

  handleBlur(event) {
    // Delay hiding suggestions to allow for suggestion clicks
    setTimeout(() => {
      this.hideSuggestions();
    }, 150);
  }

  handleClick(event) {
    const action = event.target.closest('[data-action]')?.getAttribute('data-action');

    switch (action) {
    case 'clear':
      this.clearSearch();
      break;

    case 'voice':
      this.toggleVoiceSearch();
      break;

    case 'submit':
      this.form.dispatchEvent(new Event('submit'));
      break;
    }
  }

  handleSuggestionClick(event) {
    const suggestionElement = event.target.closest('.tmyl-search-bar__suggestion');
    if (!suggestionElement) return;

    const index = parseInt(suggestionElement.getAttribute('data-suggestion-index'));
    const suggestions = this.getCurrentSuggestions();

    if (suggestions[index]) {
      this.selectSuggestion(suggestions[index]);
    }
  }

  handleSuggestionHover(event) {
    const suggestionElement = event.target.closest('.tmyl-search-bar__suggestion');
    if (!suggestionElement) return;

    const index = parseInt(suggestionElement.getAttribute('data-suggestion-index'));
    this.highlightSuggestion(index);
  }

  handleDocumentClick(event) {
    if (!this.element.contains(event.target)) {
      this.hideSuggestions();
    }
  }

  // Voice Search Methods
  initializeVoiceSearch() {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new webkitSpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.state.isListening = true;
        this.updateVoiceButtonState(true);
        this.dispatchCustomEvent('tmyl-search-voice-start');
      };

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        this.input.value = transcript;
        this.state.value = transcript;
        this.updateClearButtonVisibility(transcript);

        this.dispatchCustomEvent('tmyl-search-voice-result', {
          transcript,
          confidence: event.results[0][0].confidence
        });
      };

      this.recognition.onend = () => {
        this.state.isListening = false;
        this.updateVoiceButtonState(false);
        this.dispatchCustomEvent('tmyl-search-voice-end');
      };

      this.recognition.onerror = (event) => {
        this.state.isListening = false;
        this.updateVoiceButtonState(false);
        this.dispatchCustomEvent('tmyl-search-voice-error', {
          error: event.error
        });
      };
    }
  }

  toggleVoiceSearch() {
    if (!this.recognition) return;

    if (this.state.isListening) {
      this.recognition.stop();
    } else {
      this.recognition.start();
    }
  }

  // Suggestion Methods
  showSuggestions() {
    if (this.suggestions) {
      this.suggestions.classList.add('tmyl-search-bar__suggestions--visible');
    }
  }

  hideSuggestions() {
    if (this.suggestions) {
      this.suggestions.classList.remove('tmyl-search-bar__suggestions--visible');
    }
    this.state.highlightedIndex = -1;
    this.updateHighlightedSuggestion();
  }

  highlightNextSuggestion(total) {
    this.state.highlightedIndex = Math.min(this.state.highlightedIndex + 1, total - 1);
    this.updateHighlightedSuggestion();
  }

  highlightPreviousSuggestion(total) {
    this.state.highlightedIndex = Math.max(this.state.highlightedIndex - 1, -1);
    this.updateHighlightedSuggestion();
  }

  highlightSuggestion(index) {
    this.state.highlightedIndex = index;
    this.updateHighlightedSuggestion();
  }

  updateHighlightedSuggestion() {
    const suggestionElements = this.suggestions?.querySelectorAll('.tmyl-search-bar__suggestion') || [];

    suggestionElements.forEach((element, index) => {
      if (index === this.state.highlightedIndex) {
        element.classList.add('tmyl-search-bar__suggestion--highlighted');
      } else {
        element.classList.remove('tmyl-search-bar__suggestion--highlighted');
      }
    });
  }

  selectSuggestion(suggestion) {
    this.input.value = suggestion.text;
    this.state.value = suggestion.text;
    this.hideSuggestions();
    this.updateClearButtonVisibility(suggestion.text);

    this.dispatchCustomEvent('tmyl-search-suggestion-select', {
      suggestion,
      query: suggestion.text
    });

    // Auto-submit if it's a complete suggestion
    if (suggestion.autoSubmit !== false) {
      this.form.dispatchEvent(new Event('submit'));
    }
  }

  getCurrentSuggestions() {
    const suggestionElements = this.suggestions?.querySelectorAll('.tmyl-search-bar__suggestion') || [];
    return Array.from(suggestionElements).map(element => ({
      text: element.querySelector('.tmyl-search-bar__suggestion-text')?.textContent || '',
      type: element.querySelector('.tmyl-search-bar__suggestion-type')?.textContent || ''
    }));
  }

  // State Management
  clearSearch() {
    this.input.value = '';
    this.state.value = '';
    this.hideSuggestions();
    this.updateClearButtonVisibility('');
    this.input.focus();

    this.dispatchCustomEvent('tmyl-search-clear');
  }

  updateClearButtonVisibility(value) {
    const clearButton = this.element.querySelector('[data-action="clear"]');
    if (clearButton) {
      clearButton.style.display = value ? 'flex' : 'none';
    }
  }

  updateVoiceButtonState(isListening) {
    const voiceButton = this.element.querySelector('.tmyl-search-bar__voice-button');
    if (voiceButton) {
      if (isListening) {
        voiceButton.classList.add('tmyl-search-bar__voice-button--listening');
      } else {
        voiceButton.classList.remove('tmyl-search-bar__voice-button--listening');
      }
    }
  }

  // Recent Searches
  getRecentSearches() {
    try {
      return JSON.parse(localStorage.getItem('tmyl-recent-searches')) || [];
    } catch {
      return [];
    }
  }

  saveToRecentSearches(query) {
    const recent = this.getRecentSearches();
    const filtered = recent.filter(item => item !== query);
    const updated = [query, ...filtered].slice(0, 10);

    try {
      localStorage.setItem('tmyl-recent-searches', JSON.stringify(updated));
    } catch {
      // Ignore localStorage errors
    }
  }

  // Public API
  setValue(value) {
    this.input.value = value;
    this.state.value = value;
    this.updateClearButtonVisibility(value);
  }

  getValue() {
    return this.state.value;
  }

  focus() {
    this.input.focus();
  }

  blur() {
    this.input.blur();
  }

  // Event Dispatching
  dispatchCustomEvent(eventName, detail = {}) {
    this.element.dispatchEvent(new CustomEvent(eventName, {
      detail,
      bubbles: true,
      composed: true
    }));
  }

  // Cleanup
  destroy() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    if (this.recognition) {
      this.recognition.abort();
    }

    document.removeEventListener('click', this.handleDocumentClick);
  }
}
