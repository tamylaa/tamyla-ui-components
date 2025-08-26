/**
 * Dashboard Widget Patterns
 * Implements Trading Portal's dashboard layout and widget system
 * Single responsibility: Grid layouts, card hovering, data visualization, and modular dashboard components
 */

import { ENHANCED_TOKENS } from '../core/design-tokens.js';

/**
 * Create Dashboard Widget
 * @param {Object} options - Widget configuration
 * @returns {Object} Widget controller with element and methods
 */
export function createDashboardWidget(options = {}) {
  const {
    type = 'card', // card, chart, metric, list, table
    title = '',
    size = 'medium', // small, medium, large, xl
    data = null,
    refreshInterval = 0,
    loading = false,
    error = null,
    actions = [],
    resizable = false,
    movable = false,
    collapsible = true,
    className = '',
    onRefresh,
    onResize,
    onMove,
    onCollapse
  } = options;

  const widget = document.createElement('div');
  widget.className = `tmyl-dashboard-widget widget-${type} size-${size} ${className}`;
  widget.setAttribute('role', 'region');
  widget.setAttribute('aria-label', `Dashboard widget: ${title}`);
  
  if (resizable) widget.classList.add('resizable');
  if (movable) widget.classList.add('movable');
  
  // Widget structure
  let widgetContent = `
    <div class="widget-header">
      <h3 class="widget-title">${title}</h3>
      <div class="widget-actions">
        ${actions.map(action => `
          <button class="widget-action" data-action="${action.id}" title="${action.title || action.label}">
            ${action.icon || action.label}
          </button>
        `).join('')}
        ${collapsible ? '<button class="widget-collapse" title="Collapse widget">−</button>' : ''}
        ${onRefresh ? '<button class="widget-refresh" title="Refresh data">⟳</button>' : ''}
      </div>
    </div>
    <div class="widget-content">
      ${loading ? '<div class="widget-loading">Loading...</div>' : ''}
      ${error ? `<div class="widget-error">${error}</div>` : ''}
      <div class="widget-body"></div>
    </div>
  `;
  
  widget.innerHTML = widgetContent;
  
  // State management
  let isCollapsed = false;
  let isLoading = loading;
  let currentData = data;
  let refreshTimer = null;
  
  // Methods
  const methods = {
    /**
     * Update widget data
     */
    updateData(newData) {
      currentData = newData;
      this.render();
      return this;
    },
    
    /**
     * Render widget content based on type and data
     */
    render() {
      const body = widget.querySelector('.widget-body');
      if (!body) return this;
      
      // Clear existing content
      body.innerHTML = '';
      
      if (isLoading) {
        body.innerHTML = '<div class="widget-loading">Loading...</div>';
        return this;
      }
      
      if (error) {
        body.innerHTML = `<div class="widget-error">${error}</div>`;
        return this;
      }
      
      if (!currentData) {
        body.innerHTML = '<div class="widget-empty">No data available</div>';
        return this;
      }
      
      // Render based on widget type
      switch (type) {
        case 'metric':
          this.renderMetric(body);
          break;
        case 'chart':
          this.renderChart(body);
          break;
        case 'list':
          this.renderList(body);
          break;
        case 'table':
          this.renderTable(body);
          break;
        default:
          this.renderCard(body);
      }
      
      return this;
    },
    
    /**
     * Render metric widget
     */
    renderMetric(container) {
      const { value, label, change, trend, format = 'number' } = currentData;
      
      let formattedValue = value;
      if (format === 'currency') {
        formattedValue = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(value);
      } else if (format === 'percentage') {
        formattedValue = `${value}%`;
      }
      
      container.innerHTML = `
        <div class="metric-display">
          <div class="metric-value">${formattedValue}</div>
          <div class="metric-label">${label}</div>
          ${change !== undefined ? `
            <div class="metric-change ${change >= 0 ? 'positive' : 'negative'}">
              <span class="change-indicator">${change >= 0 ? '▲' : '▼'}</span>
              <span class="change-value">${Math.abs(change)}%</span>
            </div>
          ` : ''}
        </div>
      `;
    },
    
    /**
     * Render chart widget (placeholder for chart library integration)
     */
    renderChart(container) {
      const { chartType = 'line', datasets = [], labels = [] } = currentData;
      
      container.innerHTML = `
        <div class="chart-container">
          <div class="chart-placeholder">
            <div class="chart-type">${chartType.toUpperCase()} CHART</div>
            <div class="chart-data-points">${datasets.length} datasets, ${labels.length} points</div>
            <div class="chart-note">Chart integration ready for Chart.js or similar</div>
          </div>
        </div>
      `;
    },
    
    /**
     * Render list widget
     */
    renderList(container) {
      const { items = [], showIcons = true, showActions = false } = currentData;
      
      const listHTML = items.map(item => `
        <div class="list-item" data-id="${item.id || ''}">
          ${showIcons && item.icon ? `<span class="item-icon">${item.icon}</span>` : ''}
          <div class="item-content">
            <div class="item-title">${item.title || item.name}</div>
            ${item.description ? `<div class="item-description">${item.description}</div>` : ''}
            ${item.value ? `<div class="item-value">${item.value}</div>` : ''}
          </div>
          ${showActions && item.actions ? `
            <div class="item-actions">
              ${item.actions.map(action => `
                <button class="item-action" data-action="${action.id}" data-item="${item.id}">
                  ${action.icon || action.label}
                </button>
              `).join('')}
            </div>
          ` : ''}
        </div>
      `).join('');
      
      container.innerHTML = `<div class="widget-list">${listHTML}</div>`;
    },
    
    /**
     * Render table widget
     */
    renderTable(container) {
      const { columns = [], rows = [], sortable = true } = currentData;
      
      const headerHTML = columns.map(col => `
        <th class="${sortable ? 'sortable' : ''}" data-column="${col.key}">
          ${col.label}
          ${sortable ? '<span class="sort-indicator"></span>' : ''}
        </th>
      `).join('');
      
      const rowsHTML = rows.map(row => `
        <tr data-id="${row.id || ''}">
          ${columns.map(col => `
            <td data-column="${col.key}">
              ${col.format ? col.format(row[col.key]) : row[col.key]}
            </td>
          `).join('')}
        </tr>
      `).join('');
      
      container.innerHTML = `
        <div class="widget-table-container">
          <table class="widget-table">
            <thead>
              <tr>${headerHTML}</tr>
            </thead>
            <tbody>${rowsHTML}</tbody>
          </table>
        </div>
      `;
    },
    
    /**
     * Render card widget (default)
     */
    renderCard(container) {
      const { content = '', html = '' } = currentData;
      container.innerHTML = html || `<div class="card-content">${content}</div>`;
    },
    
    /**
     * Set loading state
     */
    setLoading(loading) {
      isLoading = loading;
      if (loading) {
        widget.classList.add('loading');
      } else {
        widget.classList.remove('loading');
      }
      this.render();
      return this;
    },
    
    /**
     * Set error state
     */
    setError(errorMessage) {
      error = errorMessage;
      if (errorMessage) {
        widget.classList.add('error');
      } else {
        widget.classList.remove('error');
      }
      this.render();
      return this;
    },
    
    /**
     * Clear error
     */
    clearError() {
      return this.setError(null);
    },
    
    /**
     * Refresh widget data
     */
    async refresh() {
      if (!onRefresh) return false;
      
      this.setLoading(true);
      
      try {
        const newData = await onRefresh();
        this.updateData(newData);
        this.clearError();
        return true;
      } catch (err) {
        this.setError(err.message || 'Failed to refresh data');
        return false;
      } finally {
        this.setLoading(false);
      }
    },
    
    /**
     * Collapse/expand widget
     */
    toggleCollapse() {
      isCollapsed = !isCollapsed;
      
      if (isCollapsed) {
        widget.classList.add('collapsed');
        widget.querySelector('.widget-collapse').textContent = '+';
      } else {
        widget.classList.remove('collapsed');
        widget.querySelector('.widget-collapse').textContent = '−';
      }
      
      if (onCollapse) onCollapse(isCollapsed);
      
      // Dispatch event
      widget.dispatchEvent(new CustomEvent('widget-collapse', {
        detail: { collapsed: isCollapsed, widget: methods }
      }));
      
      return this;
    },
    
    /**
     * Start auto-refresh
     */
    startAutoRefresh() {
      if (refreshInterval > 0 && onRefresh) {
        refreshTimer = setInterval(() => {
          this.refresh();
        }, refreshInterval);
      }
      return this;
    },
    
    /**
     * Stop auto-refresh
     */
    stopAutoRefresh() {
      if (refreshTimer) {
        clearInterval(refreshTimer);
        refreshTimer = null;
      }
      return this;
    },
    
    /**
     * Update widget title
     */
    setTitle(newTitle) {
      const titleEl = widget.querySelector('.widget-title');
      if (titleEl) {
        titleEl.textContent = newTitle;
        widget.setAttribute('aria-label', `Dashboard widget: ${newTitle}`);
      }
      return this;
    },
    
    /**
     * Resize widget
     */
    setSize(newSize) {
      widget.classList.remove(`size-${size}`);
      widget.classList.add(`size-${newSize}`);
      
      if (onResize) onResize(newSize);
      
      return this;
    },
    
    /**
     * Destroy widget
     */
    destroy() {
      this.stopAutoRefresh();
      
      if (widget.parentNode) {
        widget.parentNode.removeChild(widget);
      }
    },
    
    /**
     * Get widget element
     */
    get element() { return widget; },
    
    /**
     * Get widget data
     */
    get data() { return currentData; },
    
    /**
     * Check if collapsed
     */
    get collapsed() { return isCollapsed; }
  };
  
  // Event handlers
  
  // Action buttons
  widget.addEventListener('click', (e) => {
    const actionBtn = e.target.closest('.widget-action');
    if (actionBtn) {
      const actionId = actionBtn.getAttribute('data-action');
      const action = actions.find(a => a.id === actionId);
      if (action && action.handler) {
        action.handler(methods);
      }
      return;
    }
    
    // Collapse button
    if (e.target.closest('.widget-collapse')) {
      methods.toggleCollapse();
      return;
    }
    
    // Refresh button
    if (e.target.closest('.widget-refresh')) {
      methods.refresh();
      return;
    }
    
    // Table sorting
    const sortHeader = e.target.closest('.sortable');
    if (sortHeader && type === 'table') {
      const column = sortHeader.getAttribute('data-column');
      // Dispatch sort event
      widget.dispatchEvent(new CustomEvent('widget-sort', {
        detail: { column, widget: methods }
      }));
    }
    
    // List item actions
    const itemAction = e.target.closest('.item-action');
    if (itemAction) {
      const actionId = itemAction.getAttribute('data-action');
      const itemId = itemAction.getAttribute('data-item');
      
      widget.dispatchEvent(new CustomEvent('widget-item-action', {
        detail: { action: actionId, item: itemId, widget: methods }
      }));
    }
  });
  
  // Initialize
  methods.render();
  if (refreshInterval > 0) {
    methods.startAutoRefresh();
  }
  
  return methods;
}

/**
 * Create Dashboard Grid
 * @param {Object} options - Grid configuration
 * @returns {Object} Grid controller with element and methods
 */
export function createDashboardGrid(options = {}) {
  const {
    columns = 12,
    gap = '16px',
    responsive = true,
    autoResize = true,
    draggable = false,
    className = ''
  } = options;

  const grid = document.createElement('div');
  grid.className = `tmyl-dashboard-grid ${className}`;
  grid.style.cssText = `
    display: grid;
    grid-template-columns: repeat(${columns}, 1fr);
    gap: ${gap};
    width: 100%;
  `;
  
  if (responsive) {
    grid.classList.add('responsive');
  }
  
  const widgets = new Map();
  
  // Methods
  const methods = {
    /**
     * Add widget to grid
     */
    addWidget(widget, position = {}) {
      const {
        row = 'auto',
        column = 'auto',
        rowSpan = 1,
        columnSpan = 1
      } = position;
      
      const widgetElement = widget.element || widget;
      
      widgetElement.style.gridRow = row === 'auto' ? 'auto' : `${row} / span ${rowSpan}`;
      widgetElement.style.gridColumn = column === 'auto' ? 'auto' : `${column} / span ${columnSpan}`;
      
      grid.appendChild(widgetElement);
      
      // Generate ID if widget doesn't have one
      const widgetId = widgetElement.getAttribute('data-widget-id') || `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      widgetElement.setAttribute('data-widget-id', widgetId);
      
      widgets.set(widgetId, {
        element: widgetElement,
        controller: widget,
        position: { row, column, rowSpan, columnSpan }
      });
      
      return widgetId;
    },
    
    /**
     * Remove widget from grid
     */
    removeWidget(widgetId) {
      const widget = widgets.get(widgetId);
      if (widget) {
        if (widget.element.parentNode) {
          widget.element.parentNode.removeChild(widget.element);
        }
        widgets.delete(widgetId);
        return true;
      }
      return false;
    },
    
    /**
     * Move widget to new position
     */
    moveWidget(widgetId, newPosition) {
      const widget = widgets.get(widgetId);
      if (!widget) return false;
      
      const {
        row = widget.position.row,
        column = widget.position.column,
        rowSpan = widget.position.rowSpan,
        columnSpan = widget.position.columnSpan
      } = newPosition;
      
      widget.element.style.gridRow = row === 'auto' ? 'auto' : `${row} / span ${rowSpan}`;
      widget.element.style.gridColumn = column === 'auto' ? 'auto' : `${column} / span ${columnSpan}`;
      
      widget.position = { row, column, rowSpan, columnSpan };
      
      return true;
    },
    
    /**
     * Get widget by ID
     */
    getWidget(widgetId) {
      return widgets.get(widgetId);
    },
    
    /**
     * Get all widgets
     */
    getAllWidgets() {
      return Array.from(widgets.values());
    },
    
    /**
     * Update grid columns
     */
    setColumns(newColumns) {
      grid.style.gridTemplateColumns = `repeat(${newColumns}, 1fr)`;
      return this;
    },
    
    /**
     * Update grid gap
     */
    setGap(newGap) {
      grid.style.gap = newGap;
      return this;
    },
    
    /**
     * Clear all widgets
     */
    clear() {
      widgets.forEach((widget, id) => {
        this.removeWidget(id);
      });
      return this;
    },
    
    /**
     * Get grid layout configuration
     */
    getLayout() {
      const layout = [];
      widgets.forEach((widget, id) => {
        layout.push({
          id,
          position: widget.position
        });
      });
      return layout;
    },
    
    /**
     * Apply layout configuration
     */
    setLayout(layout) {
      layout.forEach(item => {
        this.moveWidget(item.id, item.position);
      });
      return this;
    },
    
    /**
     * Get grid element
     */
    get element() { return grid; }
  };
  
  return methods;
}

/**
 * Trading Portal Dashboard Presets
 */
export const TRADING_PORTAL_WIDGETS = {
  portfolio: {
    type: 'metric',
    title: 'Portfolio Value',
    size: 'medium',
    data: {
      value: 125000,
      label: 'Total Value',
      change: 5.2,
      format: 'currency'
    }
  },
  
  recentTrades: {
    type: 'list',
    title: 'Recent Trades',
    size: 'large',
    data: {
      items: [
        { id: '1', title: 'AAPL', description: 'Buy 100 shares', value: '+$15,000', icon: '📈' },
        { id: '2', title: 'GOOGL', description: 'Sell 50 shares', value: '+$12,500', icon: '📉' },
        { id: '3', title: 'TSLA', description: 'Buy 25 shares', value: '+$8,750', icon: '📈' }
      ],
      showIcons: true
    }
  },
  
  marketChart: {
    type: 'chart',
    title: 'Market Overview',
    size: 'xl',
    data: {
      chartType: 'line',
      datasets: [
        { label: 'S&P 500', data: [4100, 4150, 4200, 4180, 4220] }
      ],
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
    }
  },
  
  watchlist: {
    type: 'table',
    title: 'Watchlist',
    size: 'large',
    data: {
      columns: [
        { key: 'symbol', label: 'Symbol' },
        { key: 'price', label: 'Price', format: (val) => `$${val}` },
        { key: 'change', label: 'Change', format: (val) => `${val >= 0 ? '+' : ''}${val}%` }
      ],
      rows: [
        { id: '1', symbol: 'AAPL', price: 175.50, change: 2.3 },
        { id: '2', symbol: 'GOOGL', price: 2850.00, change: -1.2 },
        { id: '3', symbol: 'TSLA', price: 720.00, change: 4.1 }
      ],
      sortable: true
    }
  }
};

/**
 * Dashboard Manager
 * High-level dashboard management and layout persistence
 */
export class DashboardManager {
  constructor(container) {
    this.container = container;
    this.grid = createDashboardGrid({
      columns: 12,
      responsive: true,
      draggable: true
    });
    
    this.container.appendChild(this.grid.element);
    this.widgets = new Map();
  }
  
  /**
   * Create and add widget to dashboard
   */
  addWidget(config, position) {
    const widget = createDashboardWidget(config);
    const widgetId = this.grid.addWidget(widget, position);
    this.widgets.set(widgetId, widget);
    
    return { id: widgetId, widget };
  }
  
  /**
   * Remove widget from dashboard
   */
  removeWidget(widgetId) {
    const widget = this.widgets.get(widgetId);
    if (widget) {
      widget.destroy();
      this.widgets.delete(widgetId);
      return this.grid.removeWidget(widgetId);
    }
    return false;
  }
  
  /**
   * Load Trading Portal preset dashboard
   */
  loadTradingPortalDashboard() {
    this.grid.clear();
    this.widgets.clear();
    
    // Add preset widgets
    this.addWidget(TRADING_PORTAL_WIDGETS.portfolio, { row: 1, column: 1, columnSpan: 3 });
    this.addWidget(TRADING_PORTAL_WIDGETS.marketChart, { row: 1, column: 4, columnSpan: 9 });
    this.addWidget(TRADING_PORTAL_WIDGETS.recentTrades, { row: 2, column: 1, columnSpan: 6 });
    this.addWidget(TRADING_PORTAL_WIDGETS.watchlist, { row: 2, column: 7, columnSpan: 6 });
    
    return this;
  }
  
  /**
   * Save dashboard layout
   */
  saveLayout(name = 'default') {
    const layout = {
      grid: this.grid.getLayout(),
      widgets: {}
    };
    
    this.widgets.forEach((widget, id) => {
      layout.widgets[id] = {
        type: widget.element.classList.contains('widget-metric') ? 'metric' :
              widget.element.classList.contains('widget-chart') ? 'chart' :
              widget.element.classList.contains('widget-list') ? 'list' :
              widget.element.classList.contains('widget-table') ? 'table' : 'card',
        title: widget.element.querySelector('.widget-title')?.textContent || '',
        data: widget.data
      };
    });
    
    localStorage.setItem(`dashboard-layout-${name}`, JSON.stringify(layout));
    return true;
  }
  
  /**
   * Load dashboard layout
   */
  loadLayout(name = 'default') {
    const saved = localStorage.getItem(`dashboard-layout-${name}`);
    if (!saved) return false;
    
    try {
      const layout = JSON.parse(saved);
      
      // Clear current dashboard
      this.grid.clear();
      this.widgets.clear();
      
      // Recreate widgets
      layout.grid.forEach(item => {
        const widgetConfig = layout.widgets[item.id];
        if (widgetConfig) {
          const widget = createDashboardWidget(widgetConfig);
          this.grid.addWidget(widget, item.position);
          this.widgets.set(item.id, widget);
        }
      });
      
      return true;
    } catch (err) {
      console.error('Failed to load dashboard layout:', err);
      return false;
    }
  }
  
  /**
   * Refresh all widgets
   */
  refreshAll() {
    this.widgets.forEach(widget => {
      if (widget.refresh) {
        widget.refresh();
      }
    });
  }
}
