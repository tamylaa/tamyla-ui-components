/**
 * Campaign Selector Templates
 * Modular template system following atomic design principles
 */

export const campaignSelectorTemplates = {
  
  /**
   * Create main header template
   */
  createHeader(campaignType) {
    return `
      <div class="campaign-header">
        <div class="campaign-header-content">
          <h2 class="campaign-title">Select Campaign Content</h2>
          <p class="campaign-subtitle">Choose the best content for your ${campaignType} campaign</p>
        </div>
      </div>
    `;
  },

  /**
   * Create tabs container template
   */
  createTabsContainer() {
    return `
      <div class="campaign-tabs" id="campaign-tabs">
        <button class="campaign-tab active" data-tab="search">
          🔍 Search Content
        </button>
        <button class="campaign-tab" data-tab="recommendations">
          ⭐ AI Recommendations
          <span class="tab-badge">Smart</span>
        </button>
        <button class="campaign-tab" data-tab="templates">
          📋 Templates
        </button>
      </div>
    `;
  },

  /**
   * Create search tab content template
   */
  createSearchTab() {
    return `
      <div class="tab-content active" data-tab="search">
        <div class="search-container" id="search-container">
          <!-- Enhanced search will be mounted here -->
        </div>
        <div class="filters-section" id="filters-section">
          <!-- Filters will be rendered here -->
        </div>
        <div class="content-grid" id="search-results">
          <!-- Search results will be rendered here -->
        </div>
      </div>
    `;
  },

  /**
   * Create recommendations tab content template
   */
  createRecommendationsTab() {
    return `
      <div class="tab-content" data-tab="recommendations">
        <div class="recommendations-header">
          <h3>AI-Powered Content Recommendations</h3>
          <p>Based on your campaign type and historical performance data</p>
        </div>
        <div class="content-grid" id="recommendations-results">
          <!-- Recommendations will be rendered here -->
        </div>
      </div>
    `;
  },

  /**
   * Create templates tab content template
   */
  createTemplatesTab() {
    return `
      <div class="tab-content" data-tab="templates">
        <div class="templates-header">
          <h3>Pre-built Campaign Templates</h3>
          <p>Ready-to-use content collections for common campaign types</p>
        </div>
        <div class="content-grid" id="templates-results">
          <!-- Templates will be rendered here -->
        </div>
      </div>
    `;
  },

  /**
   * Create filter group template
   */
  createFilterGroup(filter) {
    const optionsHTML = filter.options.map(option => 
      `<option value="${option.value}">${option.label}</option>`
    ).join('');

    return `
      <div class="filter-group">
        <label class="filter-label">${filter.label}</label>
        <select class="filter-select" name="${filter.name}">
          ${optionsHTML}
        </select>
      </div>
    `;
  },

  /**
   * Create selection summary template
   */
  createSelectionSummary(maxSelections) {
    return `
      <div class="selection-summary">
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
      </div>
    `;
  },

  /**
   * Create selected item template
   */
  createSelectedItem(item, performanceLevel) {
    const icon = this.getContentIcon(item.category);
    const performanceClass = performanceLevel?.level || 'unknown';
    const performanceLabel = performanceLevel?.label || 'Unknown';

    return `
      <div class="selected-item" data-id="${item.id}">
        <span class="item-icon">${icon}</span>
        <span class="item-name">${item.title || item.original_filename}</span>
        <span class="item-performance ${performanceClass}">
          ${performanceLabel}
        </span>
        <button class="remove-item" data-id="${item.id}">×</button>
      </div>
    `;
  },

  /**
   * Create selection insights template
   */
  createSelectionInsights(summary) {
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
          <span class="insight-label">Est. Reach:</span>
          <span class="insight-value">${summary.estimatedReach?.toLocaleString() || 'Unknown'}</span>
        </div>
      </div>
    `;
  },

  /**
   * Create empty state template
   */
  createEmptyState(title = 'No content found', message = 'Try adjusting your search terms or filters') {
    return `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <div class="empty-title">${title}</div>
        <div class="empty-message">${message}</div>
      </div>
    `;
  },

  /**
   * Create loading state template
   */
  createLoadingState(message = 'Loading content...') {
    return `
      <div class="loading-state">
        <div class="loading-spinner"></div>
        <div class="loading-message">${message}</div>
      </div>
    `;
  },

  /**
   * Utility: Get content icon
   */
  getContentIcon(category) {
    const iconMap = {
      image: '🖼️',
      video: '🎬',
      audio: '🎵',
      document: '📄',
      default: '📁'
    };
    return iconMap[category] || iconMap.default;
  }
};

export function createCampaignSelectorTemplate(campaignType, maxSelections) {
  return `
    <div class="campaign-selector-app">
      ${campaignSelectorTemplates.createHeader(campaignType)}
      ${campaignSelectorTemplates.createTabsContainer()}
      <div class="campaign-content-area">
        ${campaignSelectorTemplates.createSearchTab()}
        ${campaignSelectorTemplates.createRecommendationsTab()}
        ${campaignSelectorTemplates.createTemplatesTab()}
      </div>
      ${campaignSelectorTemplates.createSelectionSummary(maxSelections)}
    </div>
  `;
}
