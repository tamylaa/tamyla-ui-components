/**
 * Dashboard Widget Main Module
 * Modular dashboard widget system with separated concerns
 */

import { DASHBOARD_WIDGET_CONFIG, TRADING_PORTAL_WIDGET_PRESETS, DASHBOARD_LAYOUTS } from './config/dashboard-widget-config.js';
import { DashboardWidgetController } from './controllers/dashboard-widget-controller.js';
import { DashboardGridController } from './controllers/dashboard-grid-controller.js';

/**
 * Template loader utility
 */
async function loadTemplate(templateName) {
  const templatePath = `./templates/${templateName}`;
  
  try {
    const response = await fetch(templatePath);
    if (!response.ok) {
      throw new Error(`Failed to load template: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.error('Template loading error:', error);
    
    // Fallback templates
    const fallbacks = {
      'dashboard-widget.html': `
        <div class="widget-container">
          <div class="widget-header">
            <h3 class="widget-title"></h3>
            <div class="widget-actions">
              <button class="widget-collapse">−</button>
              <button class="widget-refresh">⟳</button>
            </div>
          </div>
          <div class="widget-content">
            <div class="widget-loading" style="display: none;">Loading...</div>
            <div class="widget-error" style="display: none;"></div>
            <div class="widget-body"></div>
          </div>
        </div>
      `,
      'metric-widget.html': `
        <div class="metric-display">
          <div class="metric-value"></div>
          <div class="metric-label"></div>
          <div class="metric-change" style="display: none;"></div>
        </div>
      `
    };
    
    return fallbacks[templateName] || fallbacks['dashboard-widget.html'];
  }
}

/**
 * Style injection utility
 */
function injectStyles() {
  const styleId = 'dashboard-widget-styles';
  
  if (document.getElementById(styleId)) {
    return; // Already injected
  }

  const link = document.createElement('link');
  link.id = styleId;
  link.rel = 'stylesheet';
  link.href = './styles/dashboard-widget.css';
  
  // Fallback to inline styles if CSS file not found
  link.onerror = () => {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .tmyl-dashboard-widget {
        background: #ffffff;
        border: 1px solid #e1e5e9;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        overflow: hidden;
        height: 100%;
        display: flex;
        flex-direction: column;
      }
      .widget-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 20px;
        border-bottom: 1px solid #e1e5e9;
        background: #f8f9fa;
      }
      .widget-content {
        flex: 1;
        padding: 20px;
        display: flex;
        flex-direction: column;
      }
      /* Add more critical styles as needed */
    `;
    document.head.appendChild(style);
  };
  
  document.head.appendChild(link);
}

/**
 * Create Dashboard Widget
 * @param {Object} options - Configuration options
 * @returns {Promise<Object>} Widget instance
 */
export async function createDashboardWidget(options = {}) {
  // Validate widget type
  const widgetType = options.type || DASHBOARD_WIDGET_CONFIG.defaults.type;
  if (!DASHBOARD_WIDGET_CONFIG.types[widgetType]) {
    throw new Error(`${DASHBOARD_WIDGET_CONFIG.errors.INVALID_TYPE}: ${widgetType}`);
  }

  // Validate widget size
  const widgetSize = options.size || DASHBOARD_WIDGET_CONFIG.defaults.size;
  if (!DASHBOARD_WIDGET_CONFIG.sizes[widgetSize]) {
    throw new Error(`${DASHBOARD_WIDGET_CONFIG.errors.INVALID_SIZE}: ${widgetSize}`);
  }

  // Merge with defaults
  const config = { ...DASHBOARD_WIDGET_CONFIG.defaults, ...options };

  // Validate configuration
  if (config.title && config.title.length > DASHBOARD_WIDGET_CONFIG.validation.title.maxLength) {
    throw new Error(`Title too long. Max ${DASHBOARD_WIDGET_CONFIG.validation.title.maxLength} characters.`);
  }

  // Inject styles
  injectStyles();

  // Load template
  const templateConfig = DASHBOARD_WIDGET_CONFIG.types[widgetType];
  const templateHTML = await loadTemplate(templateConfig.template);

  // Create element
  const element = document.createElement('div');
  element.className = `tmyl-dashboard-widget widget-${widgetType} size-${widgetSize} ${config.className || ''}`;
  element.setAttribute('role', 'region');
  element.setAttribute('aria-label', `Dashboard widget: ${config.title || 'Widget'}`);
  element.innerHTML = templateHTML;

  // Add conditional classes
  if (config.resizable) element.classList.add('resizable');
  if (config.movable) element.classList.add('movable');

  // Create controller
  const controller = new DashboardWidgetController(element, config);

  // Return public API
  return {
    element,
    controller,
    
    // Convenience methods
    refresh: () => controller.refresh(),
    updateData: (data) => controller.updateData(data),
    setLoading: (loading) => controller.setLoading(loading),
    setError: (error) => controller.setError(error),
    clearError: () => controller.clearError(),
    toggleCollapse: () => controller.toggleCollapse(),
    destroy: () => controller.destroy(),
    
    // State accessors
    get loading() { return controller.isLoading(); },
    get error() { return controller.hasError(); },
    get collapsed() { return controller.isCollapsed(); },
    get data() { return controller.getData(); },
    get state() { return controller.getState(); }
  };
}

/**
 * Create Dashboard Grid
 * @param {Object} options - Grid configuration
 * @returns {Object} Grid instance
 */
export function createDashboardGrid(options = {}) {
  // Create grid element
  const element = document.createElement('div');
  element.className = `tmyl-dashboard-grid ${options.className || ''}`;

  // Create controller
  const controller = new DashboardGridController(element, options);

  // Return public API
  return {
    element,
    controller,
    
    // Widget management
    addWidget: (widget, position) => controller.addWidget(widget.element || widget, position),
    removeWidget: (widgetId) => controller.removeWidget(widgetId),
    moveWidget: (widgetId, position) => controller.moveWidget(widgetId, position),
    getWidget: (widgetId) => controller.getWidget(widgetId),
    getAllWidgets: () => controller.getAllWidgets(),
    clear: () => controller.clear(),
    
    // Grid management
    setColumns: (columns) => controller.setColumns(columns),
    setGap: (gap) => controller.setGap(gap),
    
    // Layout management
    getLayout: () => controller.getLayout(),
    setLayout: (layout) => controller.setLayout(layout),
    
    // Utilities
    findEmptySpace: (cols, rows) => controller.findEmptySpace(cols, rows),
    
    // State accessors
    get state() { return controller.getState(); }
  };
}

/**
 * Create Widget from Preset
 * @param {string} presetId - Preset identifier
 * @param {Object} overrides - Option overrides
 * @returns {Promise<Object>} Widget instance
 */
export async function createWidgetFromPreset(presetId, overrides = {}) {
  const preset = TRADING_PORTAL_WIDGET_PRESETS[presetId];
  
  if (!preset) {
    throw new Error(`Widget preset not found: ${presetId}`);
  }

  return createDashboardWidget({ ...preset, ...overrides });
}

/**
 * Dashboard Manager
 * High-level dashboard management with layout persistence
 */
export class DashboardManager {
  constructor(container, options = {}) {
    this.container = container;
    this.options = options;
    
    // Create grid
    this.grid = createDashboardGrid({
      columns: options.columns || 12,
      responsive: options.responsive !== false,
      draggable: options.draggable || false,
      ...options.gridOptions
    });
    
    this.container.appendChild(this.grid.element);
    this.widgets = new Map();
    this.activeLayout = null;
  }

  // Widget management
  async addWidget(config, position) {
    const widget = await createDashboardWidget(config);
    const widgetId = this.grid.addWidget(widget, position);
    
    // Store widget reference
    this.widgets.set(widgetId, widget);
    
    // Listen for widget events
    widget.element.addEventListener('widget:refresh', this.handleWidgetEvent.bind(this));
    widget.element.addEventListener('widget:error', this.handleWidgetEvent.bind(this));
    
    return { id: widgetId, widget };
  }

  async addWidgetFromPreset(presetId, position, overrides = {}) {
    const preset = TRADING_PORTAL_WIDGET_PRESETS[presetId];
    if (!preset) {
      throw new Error(`Preset not found: ${presetId}`);
    }

    return this.addWidget({ ...preset, ...overrides }, position);
  }

  removeWidget(widgetId) {
    const widget = this.widgets.get(widgetId);
    if (widget) {
      widget.destroy();
      this.widgets.delete(widgetId);
      return this.grid.removeWidget(widgetId);
    }
    return false;
  }

  getWidget(widgetId) {
    return this.widgets.get(widgetId);
  }

  // Layout management
  async loadLayout(layoutId) {
    const layout = DASHBOARD_LAYOUTS[layoutId];
    if (!layout) {
      throw new Error(`Layout not found: ${layoutId}`);
    }

    // Clear existing widgets
    this.clearAllWidgets();

    // Add widgets from layout
    for (const widgetConfig of layout.widgets) {
      const { id, preset, position, ...overrides } = widgetConfig;
      await this.addWidgetFromPreset(preset, position, { id, ...overrides });
    }

    this.activeLayout = layoutId;
    return true;
  }

  async loadTradingPortalDashboard() {
    return this.loadLayout('trading');
  }

  async loadAnalyticsDashboard() {
    return this.loadLayout('analytics');
  }

  async loadMinimalDashboard() {
    return this.loadLayout('minimal');
  }

  // Layout persistence
  saveLayout(name = 'custom') {
    const layout = {
      name,
      created: new Date().toISOString(),
      grid: this.grid.getLayout(),
      widgets: {}
    };

    // Save widget configurations
    this.widgets.forEach((widget, id) => {
      const element = widget.element;
      layout.widgets[id] = {
        type: this.getWidgetType(element),
        title: element.querySelector('.widget-title')?.textContent || '',
        size: this.getWidgetSize(element),
        data: widget.data
      };
    });

    localStorage.setItem(`dashboard-layout-${name}`, JSON.stringify(layout));
    return true;
  }

  loadSavedLayout(name = 'custom') {
    const saved = localStorage.getItem(`dashboard-layout-${name}`);
    if (!saved) return false;

    try {
      const layout = JSON.parse(saved);
      
      // Clear current dashboard
      this.clearAllWidgets();
      
      // Recreate widgets
      layout.grid.forEach(async (item) => {
        const widgetConfig = layout.widgets[item.id];
        if (widgetConfig) {
          await this.addWidget(widgetConfig, item.position);
        }
      });
      
      return true;
    } catch (err) {
      console.error('Failed to load saved layout:', err);
      return false;
    }
  }

  // Utility methods
  clearAllWidgets() {
    this.widgets.forEach((widget, id) => {
      this.removeWidget(id);
    });
  }

  refreshAllWidgets() {
    this.widgets.forEach(widget => {
      if (widget.refresh) {
        widget.refresh();
      }
    });
  }

  getWidgetType(element) {
    const classes = element.className.split(' ');
    const typeClass = classes.find(cls => cls.startsWith('widget-'));
    return typeClass ? typeClass.replace('widget-', '') : 'card';
  }

  getWidgetSize(element) {
    const classes = element.className.split(' ');
    const sizeClass = classes.find(cls => cls.startsWith('size-'));
    return sizeClass ? sizeClass.replace('size-', '') : 'medium';
  }

  handleWidgetEvent(event) {
    // Central event handling for all widgets
    console.log('Widget event:', event.type, event.detail);
  }

  // Public API
  getState() {
    return {
      activeLayout: this.activeLayout,
      widgetCount: this.widgets.size,
      gridState: this.grid.state
    };
  }

  destroy() {
    this.clearAllWidgets();
    this.grid.controller.destroy();
  }
}

// Export configuration and presets
export { DASHBOARD_WIDGET_CONFIG, TRADING_PORTAL_WIDGET_PRESETS, DASHBOARD_LAYOUTS };
