/**
 * Campaign Selector System
 * Modular content selection application for campaigns
 * Now properly organized following atomic design principles
 */

import { CampaignAnalytics } from './services/campaign-analytics.js';
import { ContentFilterEngine } from './services/content-filter-engine.js';
import { SelectionManager } from './services/selection-manager.js';
import { CampaignSelectorTemplate } from './templates/campaign-selector-template.js';
import { CampaignSelectorController } from './controllers/campaign-selector-controller.js';

export class CampaignSelectorSystem {
  constructor(options = {}) {
    this.options = {
      maxSelections: 10,
      showPerformanceInsights: true,
      enableRecommendations: true,
      enableTemplates: true,
      ...options
    };

    this.container = null;
    this.data = {
      content: [],
      templates: [],
      contentTypes: ['Blog Posts', 'Videos', 'Images', 'Documents'],
      performanceLevels: ['High', 'Medium', 'Low']
    };

    this.state = {
      currentTab: 'content',
      loading: false,
      contentLoaded: false
    };

    // Initialize modular services
    this.analytics = new CampaignAnalytics(this.options);
    this.filterEngine = new ContentFilterEngine();
    this.selectionManager = new SelectionManager(this.options.maxSelections);
    this.templates = new CampaignSelectorTemplate();
    this.controller = new CampaignSelectorController(this);

    this.initialize();
  }

  initialize() {
    this.setupEventListeners();
    this.loadInitialData();
  }

  setupEventListeners() {
    // Set up global selection manager listeners
    this.selectionManager.on('selectionChange', (selections) => {
      this.handleSelectionChange(selections);
    });

    this.selectionManager.on('selectionLimitReached', () => {
      this.showMessage(`Maximum ${this.options.maxSelections} items can be selected`, 'warning');
    });

    // Set up filter engine listeners
    this.filterEngine.on('filtersChanged', (filteredContent) => {
      this.renderContent(filteredContent);
    });
  }

  async loadInitialData() {
    this.setState({ loading: true });

    try {
      // Load content from API or mock data
      const [content, templates] = await Promise.all([
        this.loadContent(),
        this.loadTemplates()
      ]);

      this.data.content = content;
      this.data.templates = templates;

      // Initialize services with content
      this.filterEngine.setContent(content);
      this.analytics.setContent(content);

      this.setState({ 
        loading: false, 
        contentLoaded: true 
      });

      // Render initial state
      this.renderContent(content);
      this.updateSelectionSummary();

    } catch (error) {
      console.error('Failed to load initial data:', error);
      this.setState({ loading: false });
      this.showMessage('Failed to load content. Please try again.', 'error');
    }
  }

  async loadContent() {
    // Mock data for demonstration
    return [
      {
        id: 'content-1',
        title: 'Ultimate Guide to Digital Marketing in 2024',
        type: 'Blog Posts',
        performance: 'High',
        engagement: 850,
        reach: 15000,
        thumbnail: '📝',
        publishDate: '2024-01-15',
        author: 'Sarah Johnson'
      },
      {
        id: 'content-2',
        title: 'Product Demo: New Features Overview',
        type: 'Videos',
        performance: 'High',
        engagement: 1200,
        reach: 25000,
        thumbnail: '🎥',
        publishDate: '2024-01-20',
        author: 'Mike Chen'
      },
      {
        id: 'content-3',
        title: 'Brand Identity Guidelines 2024',
        type: 'Documents',
        performance: 'Medium',
        engagement: 340,
        reach: 8000,
        thumbnail: '📄',
        publishDate: '2024-01-10',
        author: 'Design Team'
      },
      {
        id: 'content-4',
        title: 'Customer Success Stories Compilation',
        type: 'Images',
        performance: 'High',
        engagement: 950,
        reach: 18000,
        thumbnail: '📸',
        publishDate: '2024-01-25',
        author: 'Customer Success'
      },
      {
        id: 'content-5',
        title: 'Weekly Marketing Newsletter Template',
        type: 'Documents',
        performance: 'Medium',
        engagement: 420,
        reach: 12000,
        thumbnail: '📧',
        publishDate: '2024-01-12',
        author: 'Marketing Team'
      },
      {
        id: 'content-6',
        title: 'Social Media Strategy Workshop',
        type: 'Videos',
        performance: 'Low',
        engagement: 180,
        reach: 5000,
        thumbnail: '📱',
        publishDate: '2024-01-08',
        author: 'Social Media Team'
      }
    ];
  }

  async loadTemplates() {
    // Mock templates for demonstration
    return [
      {
        id: 'template-1',
        title: 'Weekly Newsletter Template',
        type: 'Email Campaign',
        performance: 'High',
        engagement: 720,
        reach: 22000,
        thumbnail: '📧',
        category: 'Newsletter'
      },
      {
        id: 'template-2',
        title: 'Product Launch Announcement',
        type: 'Social Media',
        performance: 'High',
        engagement: 1100,
        reach: 35000,
        thumbnail: '🚀',
        category: 'Product Launch'
      },
      {
        id: 'template-3',
        title: 'Customer Feedback Survey',
        type: 'Email Campaign',
        performance: 'Medium',
        engagement: 440,
        reach: 15000,
        thumbnail: '📊',
        category: 'Survey'
      }
    ];
  }

  render(container) {
    if (!container) return;
    
    this.container = container;
    this.container.innerHTML = this.templates.generateMainLayout();

    // Initialize controller with rendered DOM
    this.controller.initialize(container);

    // Initial render based on current state
    if (this.state.loading) {
      this.renderLoadingState();
    } else if (this.state.contentLoaded) {
      this.renderContent(this.data.content);
      this.updateSelectionSummary();
    }
  }

  renderLoadingState() {
    const contentArea = this.container?.querySelector('.content-grid');
    if (contentArea) {
      contentArea.innerHTML = this.templates.generateLoadingState();
    }
  }

  renderContent(content = []) {
    const contentArea = this.container?.querySelector('.content-grid');
    if (!contentArea) return;

    if (content.length === 0) {
      contentArea.innerHTML = this.templates.generateEmptyState('content');
      return;
    }

    const contentHTML = content.map(item => 
      this.templates.generateContentCard(
        item, 
        this.selectionManager.isSelected(item.id)
      )
    ).join('');

    contentArea.innerHTML = contentHTML;
  }

  renderTemplates(templates = []) {
    const templatesArea = this.container?.querySelector('#templates-tab .content-grid');
    if (!templatesArea) return;

    if (templates.length === 0) {
      templatesArea.innerHTML = this.templates.generateEmptyState('templates');
      return;
    }

    const templatesHTML = templates.map(template => 
      this.templates.generateContentCard(
        template, 
        this.selectionManager.isSelected(template.id)
      )
    ).join('');

    templatesArea.innerHTML = templatesHTML;
  }

  renderRecommendations() {
    const recommendationsArea = this.container?.querySelector('#recommendations-tab .content-grid');
    if (!recommendationsArea) return;

    const recommendations = this.analytics.generateRecommendations(
      this.data.content,
      this.selectionManager.getSelectedItems()
    );

    if (recommendations.length === 0) {
      recommendationsArea.innerHTML = this.templates.generateEmptyState('recommendations');
      return;
    }

    const recommendationsHTML = recommendations.map(item => 
      this.templates.generateContentCard(
        item, 
        this.selectionManager.isSelected(item.id)
      )
    ).join('');

    recommendationsArea.innerHTML = recommendationsHTML;
  }

  handleSelectionChange(selections) {
    // Update UI to reflect selections
    this.updateSelectionIndicators();
    this.updateSelectionSummary();

    // Update recommendations based on new selections
    if (this.state.currentTab === 'recommendations') {
      this.renderRecommendations();
    }

    // Emit event for external listeners
    this.emit('selectionChanged', {
      selections: selections,
      insights: this.analytics.generateInsights(selections)
    });
  }

  updateSelectionIndicators() {
    const cards = this.container?.querySelectorAll('.content-card');
    cards?.forEach(card => {
      const cardId = card.dataset.id;
      const isSelected = this.selectionManager.isSelected(cardId);
      
      card.classList.toggle('selected', isSelected);
      
      const indicator = card.querySelector('.selection-indicator');
      if (isSelected && !indicator) {
        const indicatorHTML = this.templates.generateSelectionIndicator();
        card.insertAdjacentHTML('afterbegin', indicatorHTML);
      } else if (!isSelected && indicator) {
        indicator.remove();
      }
    });
  }

  updateSelectionSummary() {
    const summaryArea = this.container?.querySelector('.selection-summary');
    if (!summaryArea) return;

    const selections = this.selectionManager.getSelectedItems();
    const insights = this.analytics.generateInsights(selections);

    summaryArea.innerHTML = this.templates.generateSelectionSummary(
      selections,
      insights,
      this.options.maxSelections
    );
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
  }

  showMessage(message, type = 'info') {
    // Integration point for notification system
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // Could integrate with existing notification system
    if (window.TamylaNotification) {
      window.TamylaNotification.show(message, type);
    }
  }

  // Event emitter functionality
  on(event, callback) {
    if (!this.events) this.events = {};
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);
  }

  emit(event, data) {
    if (!this.events || !this.events[event]) return;
    this.events[event].forEach(callback => callback(data));
  }

  // Public API methods
  getSelectedContent() {
    return this.selectionManager.getSelectedItems();
  }

  clearSelections() {
    this.selectionManager.clearAll();
  }

  addContent(newContent) {
    this.data.content = [...this.data.content, ...newContent];
    this.filterEngine.setContent(this.data.content);
    this.analytics.setContent(this.data.content);
    
    if (this.state.currentTab === 'content') {
      this.renderContent(this.filterEngine.getFilteredContent());
    }
  }

  updateFilters(filters) {
    this.filterEngine.updateFilters(filters);
  }

  destroy() {
    if (this.container) {
      this.container.innerHTML = '';
    }
    this.events = {};
  }
}
