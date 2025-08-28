/**
 * Dashboard Widget Controller
 * Pure business logic for dashboard widget management
 */

import { DASHBOARD_WIDGET_CONFIG } from '../config/dashboard-widget-config.js';

export class DashboardWidgetController {
  constructor(element, options = {}) {
    this.element = element;
    this.options = { ...DASHBOARD_WIDGET_CONFIG.defaults, ...options };
    this.state = {
      loading: this.options.loading,
      error: this.options.error,
      collapsed: false,
      data: this.options.data || null
    };

    this.refreshTimer = null;
    this.init();
  }

  init() {
    this.bindEvents();
    this.render();
    this.startAutoRefresh();
  }

  bindEvents() {
    // Collapse/expand button
    const collapseBtn = this.element.querySelector('.widget-collapse');
    if (collapseBtn) {
      collapseBtn.addEventListener('click', this.toggleCollapse.bind(this));
    }

    // Refresh button
    const refreshBtn = this.element.querySelector('.widget-refresh');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', this.refresh.bind(this));
    }

    // Action buttons
    this.element.addEventListener('click', this.handleActionClick.bind(this));

    // Table sorting
    if (this.options.type === 'table') {
      this.element.addEventListener('click', this.handleTableSort.bind(this));
    }

    // List item actions
    if (this.options.type === 'list') {
      this.element.addEventListener('click', this.handleListAction.bind(this));
    }
  }

  async render() {
    this.updateTitle();
    this.updateActions();
    await this.renderContent();
  }

  updateTitle() {
    const titleEl = this.element.querySelector('.widget-title');
    if (titleEl && this.options.title) {
      titleEl.textContent = this.options.title;
    }
  }

  updateActions() {
    const actionsContainer = this.element.querySelector('.widget-actions');
    if (!actionsContainer) return;

    // Clear existing actions
    const customActions = actionsContainer.querySelectorAll('.widget-action');
    customActions.forEach(action => action.remove());

    // Add custom actions
    if (this.options.actions && this.options.actions.length > 0) {
      this.options.actions.forEach(action => {
        const button = document.createElement('button');
        button.className = 'widget-action';
        button.setAttribute('data-action', action.id);
        button.title = action.title || action.label;
        button.textContent = action.icon || action.label;

        // Insert before collapse/refresh buttons
        const collapseBtn = actionsContainer.querySelector('.widget-collapse');
        if (collapseBtn) {
          actionsContainer.insertBefore(button, collapseBtn);
        } else {
          actionsContainer.appendChild(button);
        }
      });
    }
  }

  async renderContent() {
    const bodyEl = this.element.querySelector('.widget-body');
    if (!bodyEl) return;

    // Show loading state
    if (this.state.loading) {
      this.showLoading();
      return;
    }

    // Show error state
    if (this.state.error) {
      this.showError(this.state.error);
      return;
    }

    // Hide loading/error states
    this.hideLoading();
    this.hideError();

    // Render based on widget type
    try {
      switch (this.options.type) {
      case 'metric':
        this.renderMetric(bodyEl);
        break;
      case 'chart':
        this.renderChart(bodyEl);
        break;
      case 'list':
        this.renderList(bodyEl);
        break;
      case 'table':
        this.renderTable(bodyEl);
        break;
      default:
        this.renderCard(bodyEl);
      }
    } catch (error) {
      console.error('Render error:', error);
      this.setError(DASHBOARD_WIDGET_CONFIG.errors.RENDER_FAILED);
    }
  }

  renderMetric(container) {
    if (!this.state.data) {
      container.innerHTML = '<div class="widget-empty">No data available</div>';
      return;
    }

    const { value, label, change, format = 'number' } = this.state.data;

    let formattedValue = value;
    if (format === 'currency') {
      formattedValue = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(value);
    } else if (format === 'percentage') {
      formattedValue = `${value}%`;
    } else if (format === 'number') {
      formattedValue = new Intl.NumberFormat('en-US').format(value);
    }

    const metricHtml = `
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

    container.innerHTML = metricHtml;
  }

  renderChart(container) {
    const { chartType = 'line', datasets = [], labels = [] } = this.state.data || {};

    // Placeholder for chart integration
    container.innerHTML = `
      <div class="chart-container">
        <div class="chart-placeholder">
          <div class="chart-type">${chartType.toUpperCase()} CHART</div>
          <div class="chart-data-points">${datasets.length} datasets, ${labels.length} points</div>
          <div class="chart-note">Chart integration ready for Chart.js or D3</div>
        </div>
      </div>
    `;
  }

  renderList(container) {
    const { items = [], showIcons = true, showActions = false } = this.state.data || {};

    if (items.length === 0) {
      container.innerHTML = '<div class="widget-empty">No items to display</div>';
      return;
    }

    const listHtml = items.map(item => `
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

    container.innerHTML = `<div class="widget-list">${listHtml}</div>`;
  }

  renderTable(container) {
    const { columns = [], rows = [], sortable = true } = this.state.data || {};

    if (columns.length === 0 || rows.length === 0) {
      container.innerHTML = '<div class="widget-empty">No data to display</div>';
      return;
    }

    const headerHtml = columns.map(col => `
      <th class="table-header ${sortable ? 'sortable' : ''}" data-column="${col.key}">
        <span class="header-text">${col.label}</span>
        ${sortable ? '<span class="sort-indicator">↕</span>' : ''}
      </th>
    `).join('');

    const rowsHtml = rows.map(row => `
      <tr class="table-row" data-id="${row.id || ''}">
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
            <tr class="table-header-row">${headerHtml}</tr>
          </thead>
          <tbody class="table-body">${rowsHtml}</tbody>
        </table>
      </div>
    `;
  }

  renderCard(container) {
    const { content = '', html = '' } = this.state.data || {};
    container.innerHTML = html || `<div class="card-content">${content}</div>`;
  }

  // State management methods
  setLoading(loading) {
    this.state.loading = loading;

    if (loading) {
      this.element.classList.add('loading');
      this.showLoading();
    } else {
      this.element.classList.remove('loading');
      this.hideLoading();
    }
  }

  setError(error) {
    this.state.error = error;

    if (error) {
      this.element.classList.add('error');
      this.showError(error);
    } else {
      this.element.classList.remove('error');
      this.hideError();
    }
  }

  clearError() {
    this.setError(null);
  }

  updateData(newData) {
    this.state.data = newData;
    this.renderContent();
  }

  // UI state methods
  showLoading() {
    const loadingEl = this.element.querySelector('.widget-loading');
    if (loadingEl) {
      loadingEl.style.display = 'flex';
    }
  }

  hideLoading() {
    const loadingEl = this.element.querySelector('.widget-loading');
    if (loadingEl) {
      loadingEl.style.display = 'none';
    }
  }

  showError(message) {
    const errorEl = this.element.querySelector('.widget-error');
    const messageEl = this.element.querySelector('.error-message');

    if (errorEl && messageEl) {
      messageEl.textContent = message;
      errorEl.style.display = 'flex';
    }
  }

  hideError() {
    const errorEl = this.element.querySelector('.widget-error');
    if (errorEl) {
      errorEl.style.display = 'none';
    }
  }

  // Event handlers
  toggleCollapse() {
    this.state.collapsed = !this.state.collapsed;

    if (this.state.collapsed) {
      this.element.classList.add('collapsed');
      const collapseBtn = this.element.querySelector('.widget-collapse');
      if (collapseBtn) collapseBtn.textContent = '+';
    } else {
      this.element.classList.remove('collapsed');
      const collapseBtn = this.element.querySelector('.widget-collapse');
      if (collapseBtn) collapseBtn.textContent = '−';
    }

    if (this.options.onCollapse) {
      this.options.onCollapse(this.state.collapsed, this);
    }

    this.dispatchEvent('widget:collapse', { collapsed: this.state.collapsed });
  }

  async refresh() {
    if (!this.options.onRefresh) return false;

    this.setLoading(true);
    this.clearError();

    try {
      const newData = await this.options.onRefresh(this);
      this.updateData(newData);

      this.dispatchEvent('widget:refresh', { data: newData });
      return true;
    } catch (error) {
      console.error('Refresh failed:', error);
      this.setError(error.message || DASHBOARD_WIDGET_CONFIG.errors.DATA_FETCH_FAILED);

      this.dispatchEvent('widget:error', { error });
      return false;
    } finally {
      this.setLoading(false);
    }
  }

  handleActionClick(event) {
    const actionBtn = event.target.closest('.widget-action');
    if (!actionBtn) return;

    const actionId = actionBtn.getAttribute('data-action');
    const action = this.options.actions?.find(a => a.id === actionId);

    if (action && action.handler) {
      action.handler(this);
    }

    this.dispatchEvent('widget:action', { actionId, action });
  }

  handleTableSort(event) {
    const sortHeader = event.target.closest('.sortable');
    if (!sortHeader) return;

    const column = sortHeader.getAttribute('data-column');
    this.dispatchEvent('widget:sort', { column });
  }

  handleListAction(event) {
    const itemAction = event.target.closest('.item-action');
    if (!itemAction) return;

    const actionId = itemAction.getAttribute('data-action');
    const itemId = itemAction.getAttribute('data-item');

    this.dispatchEvent('widget:item-action', { actionId, itemId });
  }

  // Auto-refresh functionality
  startAutoRefresh() {
    if (this.options.refreshInterval > 0 && this.options.onRefresh) {
      this.refreshTimer = setInterval(() => {
        this.refresh();
      }, this.options.refreshInterval);
    }
  }

  stopAutoRefresh() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  // Event dispatching
  dispatchEvent(eventName, detail = {}) {
    this.element.dispatchEvent(new CustomEvent(eventName, {
      detail: { ...detail, widget: this }
    }));
  }

  // Public API
  getState() {
    return { ...this.state };
  }

  isLoading() {
    return this.state.loading;
  }

  hasError() {
    return !!this.state.error;
  }

  isCollapsed() {
    return this.state.collapsed;
  }

  getData() {
    return this.state.data;
  }

  // Cleanup
  destroy() {
    this.stopAutoRefresh();

    // Remove event listeners
    // (In a real implementation, we'd store references to bound functions)

    if (this.element.parentNode && this.options.removeOnDestroy) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}
