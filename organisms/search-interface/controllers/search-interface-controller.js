/**
 * Search Interface Controller
 * Organism-level behavior orchestrating molecular components
 */

import { MoleculeFactory } from '../../../molecules/molecule-factory.js';
import {
  updateSearchInterfaceResults,
  updateSearchInterfaceLoading,
  updateSearchInterfaceError
} from '../templates/search-interface-template.js';

export function createSearchInterfaceController(element, options = {}) {
  const {
    searchAPI,
    initialQuery = '',
    initialFilters = {},
    debounceMs = 300,
    pageSize = 20,
    enableVoiceSearch = true,
    enableFiltering = true,
    enableSorting = true,
    onSearch,
    onResults,
    onError,
    onSelection,
    trackAnalytics = true
  } = options;

  const state = {
    query: initialQuery,
    filters: { ...initialFilters },
    results: [],
    totalCount: 0,
    currentPage: 1,
    loading: false,
    error: null,
    selectedItems: new Set(),
    sortBy: 'relevance',
    sortOrder: 'desc',
    viewMode: 'grid'
  };

  let searchBar = null;
  let contentGrid = null;
  let searchTimeout = null;
  let abortController = null;

  /**
   * Initialize search interface controller
   */
  function init() {
    initializeMolecularComponents();
    setupEventListeners();
    setupKeyboardShortcuts();

    // Perform initial search if query provided
    if (state.query) {
      performSearch();
    }
  }

  /**
   * Initialize molecular components
   */
  function initializeMolecularComponents() {
    const searchBarElement = element.querySelector('.tmyl-search-interface__search-bar .tmyl-search-bar');
    const contentGridElement = element.querySelector('.tmyl-search-interface__content-grid');

    if (searchBarElement) {
      // Create search bar controller
      searchBar = {
        element: searchBarElement,
        controller: searchBarElement._searchBarController || createSearchBarController(searchBarElement)
      };
    }

    if (contentGridElement) {
      // Initialize content grid
      contentGrid = {
        element: contentGridElement,
        selection: new Set()
      };
    }
  }

  /**
   * Create search bar controller if not exists
   */
  function createSearchBarController(searchBarElement) {
    const searchBarController = MoleculeFactory('search-bar', {
      value: state.query,
      showVoiceInput: enableVoiceSearch,
      onSearch: handleSearchInput,
      onVoiceSearch: handleVoiceSearch,
      onClear: handleSearchClear,
      container: null
    });

    return searchBarController.getController();
  }

  /**
   * Setup event listeners
   */
  function setupEventListeners() {
    // Search bar events
    if (searchBar) {
      searchBar.element.addEventListener('tmyl:search', handleSearchEvent);
      searchBar.element.addEventListener('tmyl:voice-search', handleVoiceSearchEvent);
      searchBar.element.addEventListener('tmyl:clear', handleClearEvent);
    }

    // Filter events
    setupFilterListeners();

    // Results action events
    setupResultsActionListeners();

    // Content grid events
    setupContentGridListeners();
  }

  /**
   * Setup filter event listeners
   */
  function setupFilterListeners() {
    const filterElements = element.querySelectorAll('[data-filter]');

    filterElements.forEach(filterElement => {
      const filterKey = filterElement.dataset.filter;

      filterElement.addEventListener('change', (event) => {
        handleFilterChange(filterKey, event.target.value, event.target.checked);
      });
    });
  }

  /**
   * Setup results action listeners
   */
  function setupResultsActionListeners() {
    const actionButtons = element.querySelectorAll('.tmyl-search-interface__results-actions .tmyl-button');

    actionButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        const action = event.target.dataset.action;
        const view = event.target.dataset.view;

        if (view) {
          handleViewModeChange(view);
        } else if (action) {
          handleResultsAction(action);
        }
      });
    });
  }

  /**
   * Setup content grid listeners
   */
  function setupContentGridListeners() {
    if (!contentGrid) return;

    contentGrid.element.addEventListener('click', (event) => {
      const card = event.target.closest('.tmyl-content-card');
      if (!card) return;

      const contentId = card.dataset.contentId;
      const actionButton = event.target.closest('.tmyl-content-card__actions .tmyl-button');

      if (actionButton) {
        handleContentAction(contentId, actionButton.dataset.action);
      } else if (card.classList.contains('tmyl-content-card--selectable')) {
        handleContentSelection(contentId, card);
      }
    });

    // Keyboard navigation
    contentGrid.element.addEventListener('keydown', handleGridKeyboard);
  }

  /**
   * Setup keyboard shortcuts
   */
  function setupKeyboardShortcuts() {
    element.addEventListener('keydown', (event) => {
      // Ctrl/Cmd + F: Focus search
      if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
        event.preventDefault();
        focusSearch();
      }

      // Ctrl/Cmd + A: Select all results
      if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
        event.preventDefault();
        selectAllResults();
      }

      // Escape: Clear selection
      if (event.key === 'Escape') {
        clearSelection();
      }
    });
  }

  /**
   * Handle search input
   */
  function handleSearchInput(query) {
    state.query = query;

    // Debounce search
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    searchTimeout = setTimeout(() => {
      performSearch();
    }, debounceMs);
  }

  /**
   * Handle search events
   */
  function handleSearchEvent(event) {
    handleSearchInput(event.detail.query);
  }

  /**
   * Handle voice search
   */
  function handleVoiceSearch(transcript) {
    state.query = transcript;
    performSearch();

    if (trackAnalytics) {
      trackEvent('voice_search', { transcript });
    }
  }

  /**
   * Handle voice search events
   */
  function handleVoiceSearchEvent(event) {
    handleVoiceSearch(event.detail.transcript);
  }

  /**
   * Handle search clear
   */
  function handleSearchClear() {
    state.query = '';
    state.results = [];
    state.totalCount = 0;
    updateResults();
  }

  /**
   * Handle clear events
   */
  function handleClearEvent(event) {
    handleSearchClear();
  }

  /**
   * Handle filter changes
   */
  function handleFilterChange(filterKey, value, checked) {
    if (checked !== undefined) {
      // Checkbox filter
      if (!state.filters[filterKey]) {
        state.filters[filterKey] = [];
      }

      if (checked) {
        state.filters[filterKey].push(value);
      } else {
        state.filters[filterKey] = state.filters[filterKey].filter(v => v !== value);
      }
    } else {
      // Select/radio filter
      state.filters[filterKey] = value;
    }

    performSearch();
  }

  /**
   * Handle view mode changes
   */
  function handleViewModeChange(viewMode) {
    state.viewMode = viewMode;

    // Update grid layout
    if (contentGrid) {
      contentGrid.element.className = contentGrid.element.className
        .replace(/tmyl-content-grid--\w+/g, '')
        .concat(` tmyl-content-grid--${viewMode}`);
    }

    // Update button states
    const viewButtons = element.querySelectorAll('[data-view]');
    viewButtons.forEach(button => {
      button.classList.toggle('tmyl-button--active', button.dataset.view === viewMode);
    });
  }

  /**
   * Handle results actions
   */
  function handleResultsAction(action) {
    switch (action) {
    case 'filter':
      toggleFilters();
      break;
    case 'sort':
      openSortMenu();
      break;
    case 'export':
      exportResults();
      break;
    case 'share':
      shareResults();
      break;
    }
  }

  /**
   * Handle content actions
   */
  function handleContentAction(contentId, action) {
    const content = state.results.find(r => r.id === contentId);
    if (!content) return;

    switch (action) {
    case 'view':
      viewContent(content);
      break;
    case 'download':
      downloadContent(content);
      break;
    case 'share':
      shareContent(content);
      break;
    case 'favorite':
      toggleFavorite(content);
      break;
    }

    if (trackAnalytics) {
      trackEvent('content_action', { action, contentId, contentType: content.type });
    }
  }

  /**
   * Handle content selection
   */
  function handleContentSelection(contentId, cardElement) {
    const isSelected = state.selectedItems.has(contentId);

    if (isSelected) {
      state.selectedItems.delete(contentId);
      cardElement.classList.remove('tmyl-content-card--selected');
    } else {
      state.selectedItems.add(contentId);
      cardElement.classList.add('tmyl-content-card--selected');
    }

    updateSelectionDisplay();

    if (onSelection) {
      onSelection(Array.from(state.selectedItems));
    }
  }

  /**
   * Handle grid keyboard navigation
   */
  function handleGridKeyboard(event) {
    const focusedCard = event.target.closest('.tmyl-content-card');
    if (!focusedCard) return;

    switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault();
      handleContentSelection(focusedCard.dataset.contentId, focusedCard);
      break;
    }
  }

  /**
   * Perform search request
   */
  async function performSearch() {
    // Cancel any ongoing search
    if (abortController) {
      abortController.abort();
    }

    abortController = new AbortController();

    try {
      setLoading(true);
      setError(null);

      const searchParams = {
        query: state.query,
        filters: state.filters,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
        page: state.currentPage,
        pageSize,
        signal: abortController.signal
      };

      let results;
      let totalCount;

      if (searchAPI) {
        const response = await searchAPI(searchParams);
        results = response.results || response.data || [];
        totalCount = response.totalCount || response.total || results.length;
      } else if (onSearch) {
        const response = await onSearch(searchParams);
        results = response.results || response.data || [];
        totalCount = response.totalCount || response.total || results.length;
      } else {
        throw new Error('No search API or handler provided');
      }

      state.results = results;
      state.totalCount = totalCount;

      updateResults();

      if (onResults) {
        onResults(results, totalCount);
      }

      if (trackAnalytics) {
        trackEvent('search_performed', {
          query: state.query,
          filters: state.filters,
          resultCount: totalCount
        });
      }

    } catch (error) {
      if (error.name === 'AbortError') return;

      console.error('Search error:', error);
      setError(error);

      if (onError) {
        onError(error);
      }
    } finally {
      setLoading(false);
      abortController = null;
    }
  }

  /**
   * Update results display
   */
  function updateResults() {
    updateSearchInterfaceResults(element, state.results, state.totalCount);

    // Reinitialize content grid events
    setupContentGridListeners();
  }

  /**
   * Set loading state
   */
  function setLoading(loading) {
    state.loading = loading;
    updateSearchInterfaceLoading(element, loading);
  }

  /**
   * Set error state
   */
  function setError(error) {
    state.error = error;
    updateSearchInterfaceError(element, error);
  }

  /**
   * Focus search input
   */
  function focusSearch() {
    const searchInput = element.querySelector('.tmyl-search-bar__input');
    if (searchInput) {
      searchInput.focus();
    }
  }

  /**
   * Select all results
   */
  function selectAllResults() {
    state.results.forEach(result => {
      state.selectedItems.add(result.id);
    });

    updateSelectionDisplay();

    if (onSelection) {
      onSelection(Array.from(state.selectedItems));
    }
  }

  /**
   * Clear selection
   */
  function clearSelection() {
    state.selectedItems.clear();
    updateSelectionDisplay();

    if (onSelection) {
      onSelection([]);
    }
  }

  /**
   * Update selection display
   */
  function updateSelectionDisplay() {
    const cards = element.querySelectorAll('.tmyl-content-card');

    cards.forEach(card => {
      const contentId = card.dataset.contentId;
      const isSelected = state.selectedItems.has(contentId);

      card.classList.toggle('tmyl-content-card--selected', isSelected);
      card.setAttribute('aria-selected', isSelected);
    });
  }

  /**
   * Toggle filters visibility
   */
  function toggleFilters() {
    const filtersElement = element.querySelector('.tmyl-search-interface__filters');
    if (filtersElement) {
      filtersElement.style.display = filtersElement.style.display === 'none' ? '' : 'none';
    }
  }

  /**
   * Open sort menu
   */
  function openSortMenu() {
    // Could implement dropdown menu here
    console.log('Sort menu opened');
  }

  /**
   * Export results
   */
  function exportResults() {
    const selectedResults = state.results.filter(r => state.selectedItems.has(r.id));
    const resultsToExport = selectedResults.length > 0 ? selectedResults : state.results;

    const csv = convertToCSV(resultsToExport);
    downloadFile(csv, 'search-results.csv', 'text/csv');
  }

  /**
   * Share results
   */
  function shareResults() {
    const url = buildShareableURL();

    if (navigator.share) {
      navigator.share({
        title: 'Search Results',
        url: url
      });
    } else {
      copyToClipboard(url);
    }
  }

  /**
   * View content
   */
  function viewContent(content) {
    if (content.url) {
      window.open(content.url, '_blank');
    }
  }

  /**
   * Download content
   */
  function downloadContent(content) {
    if (content.downloadUrl || content.url) {
      const link = document.createElement('a');
      link.href = content.downloadUrl || content.url;
      link.download = content.title || 'download';
      link.click();
    }
  }

  /**
   * Share content
   */
  function shareContent(content) {
    if (navigator.share) {
      navigator.share({
        title: content.title,
        text: content.description,
        url: content.url
      });
    } else {
      copyToClipboard(content.url || content.title);
    }
  }

  /**
   * Toggle favorite
   */
  function toggleFavorite(content) {
    // Implementation depends on favorites system
    console.log('Toggle favorite:', content.id);
  }

  /**
   * Track analytics event
   */
  function trackEvent(eventName, data) {
    // Integration with analytics system
    console.debug('Analytics event:', eventName, data);
  }

  /**
   * Helper functions
   */
  function convertToCSV(data) {
    const headers = ['Title', 'Description', 'Type', 'URL'];
    const rows = data.map(item => [
      item.title || '',
      item.description || '',
      item.type || '',
      item.url || ''
    ]);

    return [headers, ...rows].map(row =>
      row.map(field => `"${field.replace(/"/g, '""')}"`).join(',')
    ).join('\n');
  }

  function downloadFile(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  function buildShareableURL() {
    const params = new URLSearchParams({
      q: state.query,
      ...state.filters
    });
    return `${window.location.origin}${window.location.pathname}?${params}`;
  }

  function copyToClipboard(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
  }

  /**
   * Public API
   */
  const controller = {
    // State
    getState: () => ({ ...state }),
    getResults: () => state.results,
    getSelection: () => Array.from(state.selectedItems),

    // Actions
    search: (query) => {
      state.query = query;
      performSearch();
    },
    setFilters: (filters) => {
      state.filters = { ...filters };
      performSearch();
    },
    clearFilters: () => {
      state.filters = {};
      performSearch();
    },
    refresh: () => performSearch(),

    // Selection
    selectAll: selectAllResults,
    clearSelection,

    // Lifecycle
    destroy: () => {
      if (abortController) {
        abortController.abort();
      }
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    }
  };

  // Initialize
  init();

  return controller;
}

/**
 * Search interface utilities
 */
export const searchInterfaceUtils = {
  /**
   * Create search API wrapper
   */
  createSearchAPI(baseURL, options = {}) {
    const {
      headers = {},
      transform = (data) => data,
      errorHandler = (error) => { throw error; }
    } = options;

    return async function searchAPI(params) {
      try {
        const url = new URL(baseURL);
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.set(key, value);
          }
        });

        const response = await fetch(url.toString(), {
          headers: {
            'Content-Type': 'application/json',
            ...headers
          },
          signal: params.signal
        });

        if (!response.ok) {
          throw new Error(`Search failed: ${response.statusText}`);
        }

        const data = await response.json();
        return transform(data);
      } catch (error) {
        return errorHandler(error);
      }
    };
  },

  /**
   * Create local search function
   */
  createLocalSearch(data) {
    return function localSearch(params) {
      const { query, filters = {}, sortBy = 'relevance', sortOrder = 'desc' } = params;

      let results = [...data];

      // Apply text search
      if (query) {
        const searchTerms = query.toLowerCase().split(' ');
        results = results.filter(item => {
          const searchableText = [
            item.title,
            item.description,
            ...(item.tags || [])
          ].join(' ').toLowerCase();

          return searchTerms.every(term => searchableText.includes(term));
        });
      }

      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== '') {
          if (Array.isArray(value)) {
            results = results.filter(item =>
              value.some(v => item[key] === v || (item[key] && item[key].includes && item[key].includes(v)))
            );
          } else {
            results = results.filter(item => item[key] === value);
          }
        }
      });

      // Apply sorting
      results.sort((a, b) => {
        let comparison = 0;

        switch (sortBy) {
        case 'title':
          comparison = (a.title || '').localeCompare(b.title || '');
          break;
        case 'date':
          comparison = new Date(a.date || 0) - new Date(b.date || 0);
          break;
        case 'relevance':
        default:
          // Simple relevance based on query match count
          if (query) {
            const aMatches = (a.title + ' ' + a.description).toLowerCase().split(query.toLowerCase()).length - 1;
            const bMatches = (b.title + ' ' + b.description).toLowerCase().split(query.toLowerCase()).length - 1;
            comparison = bMatches - aMatches;
          }
          break;
        }

        return sortOrder === 'asc' ? comparison : -comparison;
      });

      return Promise.resolve({
        results,
        totalCount: results.length
      });
    };
  }
};
