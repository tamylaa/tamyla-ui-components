/**
 * Campaign Selector Application - Business Logic Factory
 * Extracted and modernized from legacy campaign-content-selector.js
 * Uses atomic design principles with React-inspired patterns from legacy/
 */

import { EnhancedSearchApplicationFactory } from '../enhanced-search/enhanced-search-system.js';
import { ContentCardFactory } from '../../molecules/content-card/content-card-system.js';
import { ButtonFactory } from '../../atoms/button/button-system.js';

/**
 * Campaign Performance Analytics Engine
 * Extracted from legacy campaign selector business logic
 */
export class CampaignAnalytics {
  constructor() {
    this.performanceThresholds = {
      high: 0.8,
      medium: 0.6,
      low: 0.0
    };
  }

  /**
   * Calculate performance level based on engagement score
   * Legacy algorithm preserved for consistency
   */
  getPerformanceLevel(score) {
    if (score >= this.performanceThresholds.high) {
      return { level: 'high', label: 'High', color: '#10B981' };
    }
    if (score >= this.performanceThresholds.medium) {
      return { level: 'medium', label: 'Good', color: '#F59E0B' };
    }
    return { level: 'low', label: 'Low', color: '#EF4444' };
  }

  /**
   * Smart content recommendation algorithm
   * Combines performance metrics with campaign context
   */
  async generateRecommendations(campaignType, apiBase) {
    try {
      const response = await fetch(`${apiBase}/recommendations?type=${campaignType}&algorithm=v2`);
      const data = await response.json();
      
      return this.enhanceRecommendations(data.recommendations || []);
    } catch (error) {
      console.error('Recommendation engine failed:', error);
      return [];
    }
  }

  /**
   * Enhance recommendations with performance insights
   */
  enhanceRecommendations(recommendations) {
    return recommendations.map(rec => ({
      ...rec,
      performance: this.getPerformanceLevel(rec.engagement_score || 0),
      confidenceScore: Math.min(rec.confidence * 100, 100),
      reasonSummary: this.generateReasonSummary(rec)
    }));
  }

  generateReasonSummary(recommendation) {
    const reasons = [];
    if (recommendation.engagement_score > 0.7) reasons.push('High engagement');
    if (recommendation.recent_performance) reasons.push('Trending content');
    if (recommendation.topic_match > 0.8) reasons.push('Perfect topic match');
    
    return reasons.join(' • ') || 'AI recommendation';
  }
}

/**
 * Advanced Content Filter Engine
 * React-inspired state management from legacy/TamylaFileList patterns
 */
export class ContentFilterEngine {
  constructor() {
    this.filters = {
      contentType: 'all',
      performance: 'all',
      recency: 'all',
      topics: [],
      tags: []
    };
  }

  /**
   * Apply multi-dimensional filtering
   * Inspired by React filtering patterns in legacy components
   */
  applyFilters(content, filters = this.filters) {
    let filtered = [...content];

    // Content type filter
    if (filters.contentType !== 'all') {
      filtered = filtered.filter(item => item.category === filters.contentType);
    }

    // Performance filter
    if (filters.performance !== 'all') {
      const analytics = new CampaignAnalytics();
      filtered = filtered.filter(item => {
        const performance = analytics.getPerformanceLevel(item.engagement_score || 0);
        return performance.level === filters.performance;
      });
    }

    // Recency filter
    if (filters.recency !== 'all') {
      const cutoffDays = this.getRecencyCutoff(filters.recency);
      const cutoffDate = new Date(Date.now() - cutoffDays * 24 * 60 * 60 * 1000);
      
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.created_at || item.uploadedAt);
        return itemDate >= cutoffDate;
      });
    }

    return filtered;
  }

  getRecencyCutoff(recency) {
    const recencyMap = {
      'week': 7,
      'month': 30,
      'quarter': 90,
      'year': 365
    };
    return recencyMap[recency] || 365;
  }

  updateFilter(filterName, value) {
    this.filters[filterName] = value;
    return { ...this.filters };
  }
}

/**
 * Smart Selection Manager
 * React-inspired selection patterns from legacy/TamylaFileList
 */
export class SelectionManager {
  constructor(maxSelections = 10) {
    this.maxSelections = maxSelections;
    this.selectedContent = new Map();
    this.listeners = new Set();
  }

  /**
   * Toggle selection with validation
   * Pattern inspired by legacy React components
   */
  toggleSelection(item) {
    if (this.selectedContent.has(item.id)) {
      this.selectedContent.delete(item.id);
    } else {
      if (this.selectedContent.size >= this.maxSelections) {
        this.notifyError(`Maximum ${this.maxSelections} items can be selected`);
        return false;
      }
      this.selectedContent.set(item.id, item);
    }
    
    this.notifyChange();
    return true;
  }

  getSelectedItems() {
    return Array.from(this.selectedContent.values());
  }

  getSelectionSummary() {
    const selected = this.getSelectedItems();
    const analytics = new CampaignAnalytics();
    
    return {
      count: selected.length,
      maxCount: this.maxSelections,
      averagePerformance: this.calculateAveragePerformance(selected, analytics),
      contentTypes: this.getContentTypeBreakdown(selected),
      estimatedReach: this.estimateReach(selected)
    };
  }

  calculateAveragePerformance(items, analytics) {
    if (items.length === 0) return null;
    
    const totalScore = items.reduce((sum, item) => 
      sum + (item.engagement_score || 0), 0);
    
    const avgScore = totalScore / items.length;
    return analytics.getPerformanceLevel(avgScore);
  }

  getContentTypeBreakdown(items) {
    const breakdown = {};
    items.forEach(item => {
      breakdown[item.category] = (breakdown[item.category] || 0) + 1;
    });
    return breakdown;
  }

  estimateReach(items) {
    // Simplified reach estimation algorithm
    const baseReach = items.reduce((sum, item) => 
      sum + (item.historical_reach || 1000), 0);
    
    return Math.floor(baseReach * 0.8); // Conservative estimate
  }

  clearSelection() {
    this.selectedContent.clear();
    this.notifyChange();
  }

  // React-inspired event system
  addListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyChange() {
    this.listeners.forEach(callback => callback({
      type: 'selection-changed',
      summary: this.getSelectionSummary(),
      selectedItems: this.getSelectedItems()
    }));
  }

  notifyError(message) {
    this.listeners.forEach(callback => callback({
      type: 'selection-error',
      message
    }));
  }
}

/**
 * Campaign Selector Application Factory
 * Modern atomic design with extracted business logic
 */
export function CampaignSelectorApplicationFactory(props = {}) {
  const {
    container = null,
    campaignType = 'general',
    apiBase = '/api/content',
    meilisearchUrl = '/api/search',
    maxSelections = 10,
    
    // Feature toggles
    enableRecommendations = true,
    enablePerformanceAnalytics = true,
    enableTemplates = true,
    
    // Event handlers
    onContentSelected,
    onPreviewCampaign,
    onSelectionChanged,
    onError
  } = props;

  // Initialize business logic engines
  const analytics = new CampaignAnalytics();
  const filterEngine = new ContentFilterEngine();
  const selectionManager = new SelectionManager(maxSelections);
  
  let application = null;

  // Build the application using atomic composition
  function createApplication() {
    if (!container) {
      console.error('CampaignSelector: Container element required');
      return null;
    }

    // Create main container
    application = document.createElement('div');
    application.className = 'campaign-selector-app';
    
    // Apply styles (extracted and modernized)
    applyCampaignSelectorStyles(application);
    
    // Build header section
    const header = createHeader(campaignType);
    application.appendChild(header);
    
    // Build tabs system
    const tabsContainer = createTabsSystem();
    application.appendChild(tabsContainer);
    
    // Build content sections
    const contentArea = createContentArea();
    application.appendChild(contentArea);
    
    // Build selection summary (React-inspired from legacy patterns)
    const selectionSummary = createSelectionSummary();
    application.appendChild(selectionSummary);
    
    // Mount to container
    container.appendChild(application);
    
    // Initialize event system
    setupEventHandlers();
    
    // Load initial data
    loadInitialData();
    
    return {
      element: application,
      analytics,
      filterEngine,
      selectionManager,
      updateContent: renderContent,
      destroy: cleanup
    };
  }

  function createHeader(campaignType) {
    const header = document.createElement('div');
    header.className = 'campaign-header';
    header.innerHTML = `
      <div class="campaign-header-content">
        <h2 class="campaign-title">Select Campaign Content</h2>
        <p class="campaign-subtitle">Choose the best content for your ${campaignType} campaign</p>
      </div>
    `;
    return header;
  }

  function createTabsSystem() {
    // Use atomic button components for tabs
    const buttonFactory = new ButtonFactory();
    
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'campaign-tabs';
    
    const tabs = [
      { id: 'search', label: '🔍 Search Content', active: true },
      { id: 'recommendations', label: '⭐ AI Recommendations', badge: 'Smart' },
      { id: 'templates', label: '📋 Templates' }
    ];
    
    tabs.forEach(tab => {
      const tabButton = buttonFactory.create({
        variant: tab.active ? 'primary' : 'secondary',
        size: 'lg',
        label: tab.label,
        onClick: () => switchTab(tab.id),
        className: `campaign-tab ${tab.active ? 'active' : ''}`,
        container: tabsContainer
      });
      
      if (tab.badge) {
        const badge = document.createElement('span');
        badge.className = 'tab-badge';
        badge.textContent = tab.badge;
        tabButton.element.appendChild(badge);
      }
    });
    
    return tabsContainer;
  }

  function createContentArea() {
    const contentArea = document.createElement('div');
    contentArea.className = 'campaign-content-area';
    
    // Search tab content
    const searchTab = createSearchTab();
    contentArea.appendChild(searchTab);
    
    // Recommendations tab content  
    const recommendationsTab = createRecommendationsTab();
    contentArea.appendChild(recommendationsTab);
    
    // Templates tab content
    const templatesTab = createTemplatesTab();
    contentArea.appendChild(templatesTab);
    
    return contentArea;
  }

  function createSearchTab() {
    const searchTab = document.createElement('div');
    searchTab.className = 'tab-content active';
    searchTab.dataset.tab = 'search';
    
    // Enhanced search integration
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    
    const enhancedSearch = EnhancedSearchApplicationFactory({
      container: searchContainer,
      meilisearchUrl,
      onResults: handleSearchResults,
      placeholder: 'Search content for your campaign...',
      voiceEnabled: true,
      naturalLanguage: true
    });
    
    searchTab.appendChild(searchContainer);
    
    // Filters section
    const filtersSection = createFiltersSection();
    searchTab.appendChild(filtersSection);
    
    // Results grid
    const resultsGrid = document.createElement('div');
    resultsGrid.className = 'content-grid';
    resultsGrid.id = 'search-results';
    searchTab.appendChild(resultsGrid);
    
    return searchTab;
  }

  function createFiltersSection() {
    const filtersSection = document.createElement('div');
    filtersSection.className = 'filters-section';
    
    const filters = [
      {
        name: 'contentType',
        label: 'Content Type',
        options: [
          { value: 'all', label: 'All Types' },
          { value: 'image', label: 'Images' },
          { value: 'video', label: 'Videos' },
          { value: 'document', label: 'Documents' },
          { value: 'audio', label: 'Audio' }
        ]
      },
      {
        name: 'performance',
        label: 'Performance',
        options: [
          { value: 'all', label: 'All Performance' },
          { value: 'high', label: 'High Performing' },
          { value: 'medium', label: 'Good Performance' },
          { value: 'low', label: 'Needs Boost' }
        ]
      },
      {
        name: 'recency',
        label: 'Recency',
        options: [
          { value: 'all', label: 'All Time' },
          { value: 'week', label: 'Past Week' },
          { value: 'month', label: 'Past Month' },
          { value: 'quarter', label: 'Past Quarter' }
        ]
      }
    ];
    
    filters.forEach(filter => {
      const filterGroup = createFilterGroup(filter);
      filtersSection.appendChild(filterGroup);
    });
    
    return filtersSection;
  }

  function createFilterGroup(filter) {
    const group = document.createElement('div');
    group.className = 'filter-group';
    
    const label = document.createElement('label');
    label.className = 'filter-label';
    label.textContent = filter.label;
    
    const select = document.createElement('select');
    select.className = 'filter-select';
    select.name = filter.name;
    
    filter.options.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option.value;
      optionElement.textContent = option.label;
      select.appendChild(optionElement);
    });
    
    select.addEventListener('change', handleFilterChange);
    
    group.appendChild(label);
    group.appendChild(select);
    
    return group;
  }

  function createSelectionSummary() {
    // React-inspired component pattern from legacy/
    const summary = document.createElement('div');
    summary.className = 'selection-summary';
    summary.innerHTML = `
      <div class="summary-header">
        <h3>Selected Content (<span class="selection-count">0 / ${maxSelections}</span>)</h3>
        <div class="summary-actions">
          <button class="btn-secondary" id="clear-selection">Clear All</button>
          <button class="btn-outline" id="preview-campaign" disabled>Preview Campaign</button>
          <button class="btn-primary" id="use-content" disabled>Use Selected Content</button>
        </div>
      </div>
      <div class="selected-items-container">
        <div class="selected-items" id="selected-items"></div>
        <div class="selection-insights" id="selection-insights"></div>
      </div>
    `;
    
    return summary;
  }

  // Event Handlers
  function setupEventHandlers() {
    // Selection manager events (React-inspired)
    selectionManager.addListener(handleSelectionChange);
    
    // Action buttons
    const clearButton = application.querySelector('#clear-selection');
    const previewButton = application.querySelector('#preview-campaign');
    const useButton = application.querySelector('#use-content');
    
    clearButton?.addEventListener('click', () => selectionManager.clearSelection());
    previewButton?.addEventListener('click', handlePreviewCampaign);
    useButton?.addEventListener('click', handleUseSelectedContent);
  }

  function handleSearchResults(results) {
    const filteredResults = filterEngine.applyFilters(results.hits || results);
    renderContentGrid(filteredResults, 'search-results');
  }

  function handleFilterChange(event) {
    const filterName = event.target.name;
    const filterValue = event.target.value;
    
    filterEngine.updateFilter(filterName, filterValue);
    
    // Re-apply filters to current results
    // This would trigger a re-render of the current tab's content
    applyCurrentFilters();
  }

  function handleSelectionChange(event) {
    if (event.type === 'selection-changed') {
      updateSelectionDisplay(event.summary, event.selectedItems);
      
      // Notify parent application
      if (onSelectionChanged) {
        onSelectionChanged(event);
      }
    } else if (event.type === 'selection-error' && onError) {
      onError(event.message);
    }
  }

  function updateSelectionDisplay(summary, selectedItems) {
    // Update count
    const countElement = application.querySelector('.selection-count');
    countElement.textContent = `${summary.count} / ${summary.maxCount}`;
    
    // Update selected items list (React-inspired rendering)
    const selectedItemsContainer = application.querySelector('#selected-items');
    selectedItemsContainer.innerHTML = selectedItems.map(item => `
      <div class="selected-item" data-id="${item.id}">
        <span class="item-icon">${getContentIcon(item.category)}</span>
        <span class="item-name">${item.title || item.original_filename}</span>
        <span class="item-performance ${summary.averagePerformance?.level || 'unknown'}">
          ${summary.averagePerformance?.label || 'Unknown'}
        </span>
        <button class="remove-item" data-id="${item.id}">×</button>
      </div>
    `).join('');
    
    // Add remove listeners
    selectedItemsContainer.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const item = selectedItems.find(i => i.id === btn.dataset.id);
        if (item) selectionManager.toggleSelection(item);
      });
    });
    
    // Update insights
    const insightsContainer = application.querySelector('#selection-insights');
    insightsContainer.innerHTML = renderSelectionInsights(summary);
    
    // Update action buttons
    const previewButton = application.querySelector('#preview-campaign');
    const useButton = application.querySelector('#use-content');
    
    previewButton.disabled = summary.count === 0;
    useButton.disabled = summary.count === 0;
  }

  function renderContentGrid(content, containerId) {
    const container = application.querySelector(`#${containerId}`);
    if (!container) return;
    
    if (content.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🔍</div>
          <div class="empty-title">No content found</div>
          <div class="empty-message">Try adjusting your search terms or filters</div>
        </div>
      `;
      return;
    }
    
    // Use ContentCard molecules for consistent rendering
    container.innerHTML = '';
    
    content.forEach(item => {
      const cardContainer = document.createElement('div');
      cardContainer.className = 'content-card-container';
      
      const card = ContentCardFactory({
        content: item,
        selectable: true,
        selected: selectionManager.selectedContent.has(item.id),
        onSelect: () => selectionManager.toggleSelection(item),
        highlightTerms: [], // Could be populated from search query
        container: cardContainer
      });
      
      container.appendChild(cardContainer);
    });
  }

  // Utility functions
  function getContentIcon(category) {
    const iconMap = {
      image: '🖼️',
      video: '🎬',
      audio: '🎵',
      document: '📄',
      default: '📁'
    };
    return iconMap[category] || iconMap.default;
  }

  function renderSelectionInsights(summary) {
    if (summary.count === 0) {
      return '<p class="no-insights">Select content to see insights</p>';
    }
    
    const contentTypes = Object.entries(summary.contentTypes)
      .map(([type, count]) => `${count} ${type}${count > 1 ? 's' : ''}`)
      .join(', ');
    
    return `
      <div class="insights-grid">
        <div class="insight-item">
          <span class="insight-label">Content Mix:</span>
          <span class="insight-value">${contentTypes}</span>
        </div>
        <div class="insight-item">
          <span class="insight-label">Avg Performance:</span>
          <span class="insight-value ${summary.averagePerformance?.level || 'unknown'}">
            ${summary.averagePerformance?.label || 'Unknown'}
          </span>
        </div>
        <div class="insight-item">
          <span class="insight-label">Est. Reach:</span>
          <span class="insight-value">${summary.estimatedReach?.toLocaleString() || 'Unknown'}</span>
        </div>
      </div>
    `;
  }

  async function loadInitialData() {
    if (enableRecommendations) {
      await loadRecommendations();
    }
  }

  async function loadRecommendations() {
    try {
      const recommendations = await analytics.generateRecommendations(campaignType, apiBase);
      renderContentGrid(recommendations, 'recommendations-results');
      
      // Update tab badge
      const tab = application.querySelector('[data-tab="recommendations"]');
      if (tab) {
        const badge = tab.querySelector('.tab-badge');
        if (badge) badge.textContent = recommendations.length;
      }
    } catch (error) {
      console.error('Failed to load recommendations:', error);
      if (onError) onError('Failed to load AI recommendations');
    }
  }

  function cleanup() {
    if (application && application.parentNode) {
      application.parentNode.removeChild(application);
    }
  }

  // Initialize and return the application
  return createApplication();
}

/**
 * Apply modern campaign selector styles
 * Extracted and improved from legacy styles
 */
function applyCampaignSelectorStyles(container) {
  const styleId = 'campaign-selector-styles';
  
  if (document.getElementById(styleId)) {
    return; // Styles already loaded
  }
  
  const styles = document.createElement('style');
  styles.id = styleId;
  styles.textContent = `
    .campaign-selector-app {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .campaign-header {
      background: linear-gradient(135deg, #3B82F6, #2563EB);
      color: white;
      padding: 24px;
      text-align: center;
    }
    
    .campaign-title {
      font-size: 20px;
      font-weight: 600;
      margin: 0 0 8px 0;
    }
    
    .campaign-subtitle {
      font-size: 14px;
      opacity: 0.9;
      margin: 0;
    }
    
    .campaign-tabs {
      display: flex;
      border-bottom: 1px solid #E5E7EB;
      background: #F9FAFB;
    }
    
    .campaign-tab {
      flex: 1;
      position: relative;
    }
    
    .tab-badge {
      background: #6B7280;
      color: white;
      font-size: 12px;
      padding: 2px 8px;
      border-radius: 10px;
      margin-left: 8px;
    }
    
    .filters-section {
      display: flex;
      gap: 16px;
      padding: 16px 24px;
      border-bottom: 1px solid #E5E7EB;
      flex-wrap: wrap;
    }
    
    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    
    .filter-label {
      font-size: 12px;
      font-weight: 600;
      color: #6B7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .filter-select {
      padding: 8px 12px;
      border: 1px solid #D1D5DB;
      border-radius: 6px;
      background: white;
      font-size: 14px;
      cursor: pointer;
      min-width: 140px;
    }
    
    .filter-select:focus {
      outline: none;
      border-color: #3B82F6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    .content-grid {
      display: grid;
      gap: 16px;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      padding: 24px;
    }
    
    .selection-summary {
      position: sticky;
      bottom: 0;
      background: white;
      border-top: 1px solid #E5E7EB;
      padding: 20px 24px;
    }
    
    .summary-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    
    .summary-actions {
      display: flex;
      gap: 12px;
    }
    
    .selected-items {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 16px;
      max-height: 200px;
      overflow-y: auto;
    }
    
    .selected-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 12px;
      background: #F3F4F6;
      border-radius: 6px;
      font-size: 14px;
    }
    
    .item-performance {
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
    }
    
    .item-performance.high {
      background: #DCFCE7;
      color: #166534;
    }
    
    .item-performance.medium {
      background: #FEF3C7;
      color: #92400E;
    }
    
    .item-performance.low {
      background: #FEE2E2;
      color: #991B1B;
    }
    
    .remove-item {
      background: none;
      border: none;
      color: #6B7280;
      cursor: pointer;
      font-size: 16px;
      padding: 4px;
      border-radius: 4px;
      margin-left: auto;
    }
    
    .remove-item:hover {
      background: #EF4444;
      color: white;
    }
    
    .insights-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }
    
    .insight-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      background: #F9FAFB;
      border-radius: 6px;
    }
    
    .insight-label {
      font-size: 12px;
      color: #6B7280;
      font-weight: 500;
    }
    
    .insight-value {
      font-weight: 600;
      color: #1F2937;
    }
    
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #6B7280;
    }
    
    .empty-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }
    
    .empty-title {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 8px;
      color: #374151;
    }
    
    .tab-content {
      display: none;
    }
    
    .tab-content.active {
      display: block;
    }
    
    /* Mobile responsive */
    @media (max-width: 768px) {
      .campaign-tabs {
        flex-direction: column;
      }
      
      .filters-section {
        flex-direction: column;
        gap: 12px;
      }
      
      .content-grid {
        grid-template-columns: 1fr;
      }
      
      .summary-actions {
        flex-direction: column;
      }
      
      .insights-grid {
        grid-template-columns: 1fr;
      }
    }
  `;
  
  document.head.appendChild(styles);
}
