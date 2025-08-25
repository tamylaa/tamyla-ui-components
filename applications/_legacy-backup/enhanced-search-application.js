/**
 * Enhanced Search Application
 * Application-level component using modular atomic design architecture
 * 
 * @deprecated Use enhanced-search/enhanced-search-system.js for new implementations
 * This file is maintained for backward compatibility
 */

import { EnhancedSearchApplicationFactory as ModularEnhancedSearchFactory } from './enhanced-search/enhanced-search-system.js';

/**
 * Enhanced Search Application Factory (Legacy)
 * @deprecated - Use ModularEnhancedSearchFactory from enhanced-search-system.js
 */
export function EnhancedSearchApplicationFactory(props = {}) {
  console.warn('EnhancedSearchApplicationFactory is deprecated. Use enhanced-search/enhanced-search-system.js instead.');
  return ModularEnhancedSearchFactory(props);
}

/**
 * Legacy Enhanced Search Application Factory (Original Implementation)
 * Preserved for reference and migration purposes
 */
export function LegacyEnhancedSearchApplicationFactory(props = {}) {
  const {
    // API Configuration
    meilisearchUrl = '/api/search',
    apiBase = '/api/content',
    
    // Feature Configuration
    voiceEnabled = true,
    naturalLanguage = true,
    smartFilters = true,
    recentSearches = true,
    searchSuggestions = true,
    
    // UI Configuration
    placeholder = 'Search content... Try "Find PDFs about coffee from last month"',
    title = 'Enhanced Search',
    description = 'Intelligent content discovery with natural language processing',
    layout = 'vertical',
    
    // Business Logic Handlers
    onSearchResults,
    onContentSelection,
    onAnalytics,
    
    // Container
    container = null
  } = props;

  let searchInterface = null;
  let element = null;
  let searchAPI = null;
  let recentSearchesData = [];

  /**
   * Initialize search API
   */
  function initializeSearchAPI() {
    searchAPI = searchInterfaceUtils.createSearchAPI(meilisearchUrl, {
      headers: {
        'Content-Type': 'application/json'
      },
      transform: (data) => {
        // Transform Meilisearch response to our format
        return {
          results: data.hits?.map(hit => ({
            id: hit.id || hit.objectID,
            title: hit.title || hit.name,
            description: hit.description || hit.content,
            type: hit.type || 'content',
            url: hit.url,
            author: hit.author,
            date: hit.created_at || hit.date,
            tags: hit.tags || [],
            stats: {
              views: hit.views || 0,
              downloads: hit.downloads || 0,
              size: hit.size
            },
            _highlightResult: hit._highlightResult
          })) || [],
          totalCount: data.nbHits || data.estimatedTotalHits || 0,
          facets: data.facetDistribution || {},
          processingTimeMs: data.processingTimeMs
        };
      },
      errorHandler: (error) => {
        console.error('Search API error:', error);
        
        // Fallback to local search if API fails
        return {
          results: [],
          totalCount: 0,
          error: error.message
        };
      }
    });

    return searchAPI;
  }

  /**
   * Create enhanced search interface
   */
  function createSearchInterface() {
    searchInterface = OrganismTemplates.searchPage({
      title,
      description,
      searchAPI,
      searchProps: {
        placeholder,
        showVoiceInput: voiceEnabled,
        showAdvancedFilters: smartFilters
      },
      enableVoiceSearch: voiceEnabled,
      enableFiltering: smartFilters,
      enableSorting: true,
      layout,
      onSearch: handleSearch,
      onResults: handleResults,
      onSelection: handleSelection,
      onError: handleError,
      filters: [
        {
          key: 'type',
          label: 'Content Type',
          type: 'select',
          options: [
            { value: '', label: 'All Types' },
            { value: 'article', label: 'Articles' },
            { value: 'document', label: 'Documents' },
            { value: 'note', label: 'Notes' },
            { value: 'image', label: 'Images' },
            { value: 'video', label: 'Videos' },
            { value: 'audio', label: 'Audio' }
          ]
        },
        {
          key: 'date_range',
          label: 'Date Range',
          type: 'select',
          options: [
            { value: '', label: 'Any Time' },
            { value: 'today', label: 'Today' },
            { value: 'week', label: 'This Week' },
            { value: 'month', label: 'This Month' },
            { value: 'quarter', label: 'This Quarter' },
            { value: 'year', label: 'This Year' }
          ]
        },
        {
          key: 'file_format',
          label: 'File Format',
          type: 'checkbox',
          options: [
            { value: 'pdf', label: 'PDF' },
            { value: 'doc', label: 'Word' },
            { value: 'txt', label: 'Text' },
            { value: 'md', label: 'Markdown' },
            { value: 'html', label: 'HTML' }
          ]
        },
        {
          key: 'size_range',
          label: 'File Size',
          type: 'select',
          options: [
            { value: '', label: 'Any Size' },
            { value: 'small', label: 'Small (< 1MB)' },
            { value: 'medium', label: 'Medium (1-10MB)' },
            { value: 'large', label: 'Large (> 10MB)' }
          ]
        }
      ],
      container: null
    });

    return searchInterface;
  }

  /**
   * Handle search requests with natural language processing
   */
  async function handleSearch(params) {
    try {
      const { query, filters } = params;
      
      // Process natural language query if enabled
      let processedQuery = query;
      if (naturalLanguage && query) {
        processedQuery = await processNaturalLanguageQuery(query);
      }
      
      // Add to recent searches
      if (recentSearches && query.trim()) {
        addToRecentSearches(query);
      }
      
      // Perform the search
      const searchParams = {
        ...params,
        query: processedQuery,
        filters: processFilters(filters)
      };
      
      const results = await searchAPI(searchParams);
      
      // Track analytics
      if (onAnalytics) {
        onAnalytics({
          type: 'search',
          query,
          processedQuery,
          filters,
          resultCount: results.totalCount,
          processingTime: results.processingTimeMs
        });
      }
      
      return results;
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  }

  /**
   * Handle search results
   */
  function handleResults(results, totalCount) {
    if (onSearchResults) {
      onSearchResults(results, totalCount);
    }
    
    // Update search suggestions if enabled
    if (searchSuggestions) {
      updateSearchSuggestions(results);
    }
  }

  /**
   * Handle content selection
   */
  function handleSelection(selectedIds) {
    if (onContentSelection) {
      const selectedContent = searchInterface.getResults()
        .filter(result => selectedIds.includes(result.id));
      
      onContentSelection(selectedContent, selectedIds);
    }
    
    // Track selection analytics
    if (onAnalytics) {
      onAnalytics({
        type: 'selection',
        selectedCount: selectedIds.length,
        selectedIds
      });
    }
  }

  /**
   * Handle search errors
   */
  function handleError(error) {
    console.error('Search interface error:', error);
    
    // Could implement fallback search here
    if (onAnalytics) {
      onAnalytics({
        type: 'error',
        error: error.message,
        timestamp: Date.now()
      });
    }
  }

  /**
   * Process natural language query
   */
  async function processNaturalLanguageQuery(query) {
    try {
      // Simple natural language processing
      // In a real implementation, this could use NLP APIs
      
      let processedQuery = query.toLowerCase();
      
      // Extract date filters from natural language
      const datePatterns = {
        'today': { date_range: 'today' },
        'this week': { date_range: 'week' },
        'last week': { date_range: 'week' },
        'this month': { date_range: 'month' },
        'last month': { date_range: 'month' },
        'this year': { date_range: 'year' }
      };
      
      Object.entries(datePatterns).forEach(([pattern, filter]) => {
        if (processedQuery.includes(pattern)) {
          // Apply the filter automatically
          searchInterface.getController()?.setFilters({ ...searchInterface.getState().filters, ...filter });
          // Remove the date reference from query
          processedQuery = processedQuery.replace(pattern, '').trim();
        }
      });
      
      // Extract file type filters
      const typePatterns = {
        'pdf': { type: 'document', file_format: ['pdf'] },
        'document': { type: 'document' },
        'image': { type: 'image' },
        'video': { type: 'video' },
        'audio': { type: 'audio' },
        'note': { type: 'note' },
        'article': { type: 'article' }
      };
      
      Object.entries(typePatterns).forEach(([pattern, filter]) => {
        if (processedQuery.includes(pattern)) {
          searchInterface.getController()?.setFilters({ ...searchInterface.getState().filters, ...filter });
          processedQuery = processedQuery.replace(new RegExp(`\\b${pattern}s?\\b`, 'gi'), '').trim();
        }
      });
      
      // Clean up the query
      processedQuery = processedQuery
        .replace(/\s+/g, ' ')
        .replace(/^\s*about\s+/i, '')
        .replace(/^\s*find\s+/i, '')
        .replace(/^\s*search\s+for\s+/i, '')
        .trim();
      
      return processedQuery;
    } catch (error) {
      console.warn('Natural language processing failed:', error);
      return query;
    }
  }

  /**
   * Process and normalize filters
   */
  function processFilters(filters) {
    const processedFilters = { ...filters };
    
    // Convert date range filters to actual date filters
    if (processedFilters.date_range) {
      const now = new Date();
      let startDate = null;
      
      switch (processedFilters.date_range) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'quarter':
          const quarter = Math.floor(now.getMonth() / 3);
          startDate = new Date(now.getFullYear(), quarter * 3, 1);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
      }
      
      if (startDate) {
        processedFilters.created_at = `>= ${startDate.toISOString()}`;
      }
      
      delete processedFilters.date_range;
    }
    
    // Convert size range filters
    if (processedFilters.size_range) {
      switch (processedFilters.size_range) {
        case 'small':
          processedFilters.size = '< 1048576'; // < 1MB
          break;
        case 'medium':
          processedFilters.size = '>= 1048576 AND < 10485760'; // 1-10MB
          break;
        case 'large':
          processedFilters.size = '>= 10485760'; // > 10MB
          break;
      }
      
      delete processedFilters.size_range;
    }
    
    return processedFilters;
  }

  /**
   * Manage recent searches
   */
  function addToRecentSearches(query) {
    recentSearchesData = recentSearchesData.filter(item => item.query !== query);
    recentSearchesData.unshift({
      query,
      timestamp: Date.now(),
      count: 1
    });
    
    // Keep only last 10 searches
    recentSearchesData = recentSearchesData.slice(0, 10);
    
    // Store in localStorage if available
    try {
      localStorage.setItem('tmyl-recent-searches', JSON.stringify(recentSearchesData));
    } catch (error) {
      console.warn('Failed to save recent searches:', error);
    }
  }

  /**
   * Load recent searches
   */
  function loadRecentSearches() {
    try {
      const stored = localStorage.getItem('tmyl-recent-searches');
      if (stored) {
        recentSearchesData = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load recent searches:', error);
      recentSearchesData = [];
    }
    
    return recentSearchesData;
  }

  /**
   * Update search suggestions
   */
  function updateSearchSuggestions(results) {
    // Extract common terms from results for suggestions
    const suggestions = new Set();
    
    results.forEach(result => {
      // Add tags as suggestions
      if (result.tags) {
        result.tags.forEach(tag => suggestions.add(tag));
      }
      
      // Add keywords from title
      if (result.title) {
        const words = result.title.split(/\s+/).filter(word => word.length > 3);
        words.forEach(word => suggestions.add(word.toLowerCase()));
      }
    });
    
    // Store suggestions for autocomplete
    try {
      localStorage.setItem('tmyl-search-suggestions', JSON.stringify(Array.from(suggestions).slice(0, 50)));
    } catch (error) {
      console.warn('Failed to save search suggestions:', error);
    }
  }

  /**
   * Render application
   */
  function render(targetContainer = container) {
    if (!targetContainer) {
      throw new Error('Container element required for rendering');
    }

    if (!element) {
      element = document.createElement('div');
      element.className = 'tmyl-enhanced-search-application';
    }

    // Initialize search API
    initializeSearchAPI();
    
    // Create search interface
    createSearchInterface();
    
    // Load recent searches
    loadRecentSearches();
    
    // Render to container
    searchInterface.render(element);
    targetContainer.appendChild(element);
    
    return element;
  }

  /**
   * Destroy application
   */
  function destroy() {
    if (searchInterface) {
      searchInterface.destroy();
      searchInterface = null;
    }
    
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
    
    element = null;
    searchAPI = null;
  }

  /**
   * Public API
   */
  return {
    // Lifecycle
    render,
    destroy,
    
    // Actions
    search: (query, filters = {}) => {
      if (searchInterface) {
        searchInterface.search(query);
        if (Object.keys(filters).length > 0) {
          searchInterface.getController()?.setFilters(filters);
        }
      }
    },
    
    clear: () => {
      if (searchInterface) {
        searchInterface.clear();
      }
    },
    
    // Data access
    getResults: () => searchInterface?.getResults() || [],
    getSelection: () => searchInterface?.getSelection() || [],
    getRecentSearches: () => recentSearchesData,
    
    // Element access
    getElement: () => element,
    getSearchInterface: () => searchInterface
  };
}

/**
 * Enhanced Search Application Templates
 */
export const EnhancedSearchApplicationTemplates = {
  /**
   * Knowledge base search
   */
  knowledgeBase: (props = {}) => EnhancedSearchApplicationFactory({
    ...props,
    title: 'Knowledge Base Search',
    description: 'Search your personal knowledge network with natural language',
    placeholder: 'Ask anything... "Find my notes about machine learning from last month"',
    naturalLanguage: true,
    voiceEnabled: true,
    smartFilters: true
  }),

  /**
   * Document search
   */
  documents: (props = {}) => EnhancedSearchApplicationFactory({
    ...props,
    title: 'Document Search',
    description: 'Find documents across all your files and folders',
    placeholder: 'Search documents... "Find PDFs about project planning"',
    naturalLanguage: true,
    smartFilters: true
  }),

  /**
   * Media search
   */
  media: (props = {}) => EnhancedSearchApplicationFactory({
    ...props,
    title: 'Media Search',
    description: 'Discover images, videos, and audio files',
    placeholder: 'Search media... "Find vacation photos from summer 2023"',
    naturalLanguage: true,
    voiceEnabled: true
  }),

  /**
   * Simple search widget
   */
  widget: (props = {}) => EnhancedSearchApplicationFactory({
    ...props,
    title: '',
    description: '',
    layout: 'compact',
    placeholder: 'Search...',
    naturalLanguage: false,
    smartFilters: false
  })
};

/**
 * Default export
 */
export default EnhancedSearchApplicationFactory;
