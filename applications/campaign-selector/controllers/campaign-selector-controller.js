/**
 * Campaign Selector Controller
 * Handles all user interactions and state management
 */

import { CampaignAnalytics } from '../services/campaign-analytics.js';
import { ContentFilterEngine } from '../services/content-filter-engine.js';
import { SelectionManager } from '../services/selection-manager.js';
import { campaignSelectorTemplates } from '../templates/campaign-selector-template.js';

export class CampaignSelectorController {
  constructor(options = {}) {
    this.options = options;
    this.element = null;
    this.currentTab = 'search';

    // Initialize services
    this.analytics = new CampaignAnalytics();
    this.filterEngine = new ContentFilterEngine();
    this.selectionManager = new SelectionManager(options.maxSelections || 10);

    // Bind methods
    this.handleTabSwitch = this.handleTabSwitch.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleSearchResults = this.handleSearchResults.bind(this);
    this.handleSelectionChange = this.handleSelectionChange.bind(this);
    this.handleContentSelect = this.handleContentSelect.bind(this);
    this.handleClearSelection = this.handleClearSelection.bind(this);
    this.handlePreviewCampaign = this.handlePreviewCampaign.bind(this);
    this.handleUseContent = this.handleUseContent.bind(this);
  }

  /**
   * Initialize the controller with DOM element
   */
  init(element) {
    this.element = element;
    this.setupEventListeners();
    this.setupServices();
    this.loadInitialData();
  }

  /**
   * Setup event listeners for user interactions
   */
  setupEventListeners() {
    if (!this.element) return;

    // Tab switching
    const tabs = this.element.querySelectorAll('.campaign-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', this.handleTabSwitch);
    });

    // Filter changes
    const filterSelects = this.element.querySelectorAll('.filter-select');
    filterSelects.forEach(select => {
      select.addEventListener('change', this.handleFilterChange);
    });

    // Action buttons
    const clearButton = this.element.querySelector('#clear-selection');
    const previewButton = this.element.querySelector('#preview-campaign');
    const useButton = this.element.querySelector('#use-content');

    clearButton?.addEventListener('click', this.handleClearSelection);
    previewButton?.addEventListener('click', this.handlePreviewCampaign);
    useButton?.addEventListener('click', this.handleUseContent);
  }

  /**
   * Setup service integrations
   */
  setupServices() {
    // Selection manager events
    this.selectionManager.addListener(this.handleSelectionChange);
  }

  /**
   * Load initial data for the application
   */
  async loadInitialData() {
    try {
      // Load recommendations if enabled
      if (this.options.enableRecommendations) {
        await this.loadRecommendations();
      }

      // Initialize filters
      this.renderFilters();

    } catch (error) {
      console.error('Failed to load initial data:', error);
      this.notifyError('Failed to load initial data');
    }
  }

  /**
   * Handle tab switching
   */
  handleTabSwitch(event) {
    const targetTab = event.target.dataset.tab;
    if (!targetTab || targetTab === this.currentTab) return;

    // Update tab visual state
    this.element.querySelectorAll('.campaign-tab').forEach(tab => {
      tab.classList.remove('active');
    });
    event.target.classList.add('active');

    // Update content visibility
    this.element.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });

    const targetContent = this.element.querySelector(`[data-tab="${targetTab}"]`);
    if (targetContent) {
      targetContent.classList.add('active');
    }

    this.currentTab = targetTab;

    // Load content for the active tab
    this.loadTabContent(targetTab);
  }

  /**
   * Load content for specific tab
   */
  async loadTabContent(tabName) {
    switch (tabName) {
    case 'recommendations':
      if (!this.hasRecommendations()) {
        await this.loadRecommendations();
      }
      break;
    case 'templates':
      await this.loadTemplates();
      break;
    }
  }

  /**
   * Handle filter changes
   */
  handleFilterChange(event) {
    const filterName = event.target.name;
    const filterValue = event.target.value;

    this.filterEngine.updateFilter(filterName, filterValue);

    // Re-apply filters to current results
    this.applyCurrentFilters();
  }

  /**
   * Handle search results from enhanced search
   */
  handleSearchResults(results) {
    const filteredResults = this.filterEngine.applyFilters(results.hits || results);
    this.renderContentGrid(filteredResults, 'search-results');
  }

  /**
   * Handle selection changes
   */
  handleSelectionChange(event) {
    if (event.type === 'selection-changed') {
      this.updateSelectionDisplay(event.summary, event.selectedItems);

      // Notify parent application
      if (this.options.onSelectionChanged) {
        this.options.onSelectionChanged(event);
      }
    } else if (event.type === 'selection-error') {
      this.notifyError(event.message);
    }
  }

  /**
   * Handle content item selection
   */
  handleContentSelect(item) {
    this.selectionManager.toggleSelection(item);
  }

  /**
   * Handle clear selection
   */
  handleClearSelection() {
    this.selectionManager.clearSelection();
  }

  /**
   * Handle preview campaign
   */
  handlePreviewCampaign() {
    const selectedItems = this.selectionManager.getSelectedItems();

    if (this.options.onPreviewCampaign) {
      this.options.onPreviewCampaign({
        content: selectedItems,
        campaignType: this.options.campaignType
      });
    }
  }

  /**
   * Handle use selected content
   */
  handleUseContent() {
    const selectedItems = this.selectionManager.getSelectedItems();

    if (this.options.onContentSelected) {
      this.options.onContentSelected({
        content: selectedItems,
        campaignType: this.options.campaignType
      });
    }
  }

  /**
   * Load AI recommendations
   */
  async loadRecommendations() {
    try {
      this.showLoading('recommendations-results', 'Loading AI recommendations...');

      const recommendations = await this.analytics.generateRecommendations(
        this.options.campaignType,
        this.options.apiBase
      );

      this.renderContentGrid(recommendations, 'recommendations-results');
      this.updateTabBadge('recommendations', recommendations.length);

    } catch (error) {
      console.error('Failed to load recommendations:', error);
      this.showError('recommendations-results', 'Failed to load recommendations');
    }
  }

  /**
   * Load campaign templates
   */
  async loadTemplates() {
    try {
      this.showLoading('templates-results', 'Loading templates...');

      const response = await fetch(`${this.options.apiBase}/templates?type=${this.options.campaignType}`);
      const data = await response.json();

      this.renderContentGrid(data.templates || [], 'templates-results');

    } catch (error) {
      console.error('Failed to load templates:', error);
      this.showError('templates-results', 'Failed to load templates');
    }
  }

  /**
   * Render content grid
   */
  renderContentGrid(content, containerId) {
    const container = this.element.querySelector(`#${containerId}`);
    if (!container) return;

    if (content.length === 0) {
      container.innerHTML = campaignSelectorTemplates.createEmptyState();
      return;
    }

    // Clear container and render content cards
    container.innerHTML = '';

    content.forEach(item => {
      const cardContainer = document.createElement('div');
      cardContainer.className = 'content-card-container';

      // Use ContentCard molecule for consistent rendering
      this.renderContentCard(item, cardContainer);
      container.appendChild(cardContainer);
    });
  }

  /**
   * Render individual content card
   */
  renderContentCard(item, container) {
    // This would use the ContentCardFactory from molecules
    // For now, create a simple implementation
    const isSelected = this.selectionManager.isSelected(item.id);
    const performance = this.analytics.getPerformanceLevel(item.engagement_score || 0);

    container.innerHTML = `
      <div class="content-card ${isSelected ? 'selected' : ''}" data-id="${item.id}">
        <div class="content-thumbnail">
          ${campaignSelectorTemplates.getContentIcon(item.category)}
        </div>
        <div class="content-info">
          <div class="content-title">${item.title || item.original_filename}</div>
          <div class="content-meta">
            <span class="performance-badge ${performance.level}">${performance.label}</span>
            <span class="content-date">${this.formatDate(item.created_at)}</span>
          </div>
        </div>
        ${isSelected ? '<div class="selection-indicator">✓</div>' : ''}
      </div>
    `;

    // Add click listener
    const card = container.querySelector('.content-card');
    card.addEventListener('click', () => this.handleContentSelect(item));
  }

  /**
   * Render filters section
   */
  renderFilters() {
    const filtersContainer = this.element.querySelector('#filters-section');
    if (!filtersContainer) return;

    const filterOptions = this.filterEngine.getFilterOptions();

    filtersContainer.innerHTML = Object.entries(filterOptions).map(([name, options]) =>
      campaignSelectorTemplates.createFilterGroup({
        name,
        label: this.capitalizeFirst(name.replace(/([A-Z])/g, ' $1')),
        options
      })
    ).join('');

    // Re-attach event listeners
    filtersContainer.querySelectorAll('.filter-select').forEach(select => {
      select.addEventListener('change', this.handleFilterChange);
    });
  }

  /**
   * Update selection display
   */
  updateSelectionDisplay(summary, selectedItems) {
    // Update count
    const countElement = this.element.querySelector('.selection-count');
    if (countElement) {
      countElement.textContent = `${summary.count} / ${summary.maxCount}`;
    }

    // Update selected items list
    const selectedItemsContainer = this.element.querySelector('#selected-items');
    if (selectedItemsContainer) {
      selectedItemsContainer.innerHTML = selectedItems.map(item => {
        const performance = this.analytics.getPerformanceLevel(item.engagement_score || 0);
        return campaignSelectorTemplates.createSelectedItem(item, performance);
      }).join('');

      // Add remove listeners
      selectedItemsContainer.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const item = selectedItems.find(i => i.id === btn.dataset.id);
          if (item) this.selectionManager.toggleSelection(item);
        });
      });
    }

    // Update insights
    const insightsContainer = this.element.querySelector('#selection-insights');
    if (insightsContainer) {
      insightsContainer.innerHTML = campaignSelectorTemplates.createSelectionInsights(summary);
    }

    // Update action buttons
    const previewButton = this.element.querySelector('#preview-campaign');
    const useButton = this.element.querySelector('#use-content');

    if (previewButton) previewButton.disabled = summary.count === 0;
    if (useButton) useButton.disabled = summary.count === 0;
  }

  /**
   * Apply current filters to displayed content
   */
  applyCurrentFilters() {
    // This would re-filter and re-render the current tab's content
    // Implementation depends on the current tab and available data
    console.log('Applying filters:', this.filterEngine.filters);
  }

  /**
   * Utility methods
   */
  showLoading(containerId, message) {
    const container = this.element.querySelector(`#${containerId}`);
    if (container) {
      container.innerHTML = campaignSelectorTemplates.createLoadingState(message);
    }
  }

  showError(containerId, message) {
    const container = this.element.querySelector(`#${containerId}`);
    if (container) {
      container.innerHTML = campaignSelectorTemplates.createEmptyState('Error', message);
    }
  }

  updateTabBadge(tabName, count) {
    const tab = this.element.querySelector(`[data-tab="${tabName}"]`);
    if (tab) {
      const badge = tab.querySelector('.tab-badge');
      if (badge) badge.textContent = count;
    }
  }

  hasRecommendations() {
    const container = this.element.querySelector('#recommendations-results');
    return container && container.children.length > 0;
  }

  formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return date.toLocaleDateString();
  }

  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  notifyError(message) {
    if (this.options.onError) {
      this.options.onError(message);
    } else {
      console.error('Campaign Selector Error:', message);
    }
  }

  /**
   * Cleanup method
   */
  destroy() {
    // Remove event listeners and cleanup
    if (this.element) {
      this.element.removeEventListener('click', this.handleTabSwitch);
      // ... other cleanup
    }
  }
}
