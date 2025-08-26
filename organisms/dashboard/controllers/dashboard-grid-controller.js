/**
 * Dashboard Grid Controller
 * Pure business logic for dashboard grid layout management
 */

import { DASHBOARD_WIDGET_CONFIG } from '../config/dashboard-widget-config.js';

export class DashboardGridController {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      columns: options.columns || DASHBOARD_WIDGET_CONFIG.grid.defaultColumns,
      gap: options.gap || DASHBOARD_WIDGET_CONFIG.grid.defaultGap,
      responsive: options.responsive !== false,
      autoResize: options.autoResize !== false,
      draggable: options.draggable || false,
      ...options
    };
    
    this.widgets = new Map();
    this.init();
  }

  init() {
    this.setupGrid();
    this.bindEvents();
  }

  setupGrid() {
    this.element.style.cssText = `
      display: grid;
      grid-template-columns: repeat(${this.options.columns}, 1fr);
      gap: ${this.options.gap};
      width: 100%;
    `;
    
    this.element.className = `tmyl-dashboard-grid ${this.options.responsive ? 'responsive' : ''}`;
  }

  bindEvents() {
    if (this.options.responsive) {
      window.addEventListener('resize', this.handleResize.bind(this));
    }
  }

  handleResize() {
    if (!this.options.autoResize) return;

    const width = this.element.offsetWidth;
    const breakpoints = DASHBOARD_WIDGET_CONFIG.grid.breakpoints;
    
    let newColumns = this.options.columns;
    
    if (width <= parseInt(breakpoints.mobile)) {
      newColumns = 1;
    } else if (width <= parseInt(breakpoints.tablet)) {
      newColumns = Math.min(this.options.columns, 6);
    }
    
    if (newColumns !== this.getCurrentColumns()) {
      this.setColumns(newColumns);
    }
  }

  getCurrentColumns() {
    const computedStyle = window.getComputedStyle(this.element);
    const gridColumns = computedStyle.gridTemplateColumns;
    return gridColumns.split(' ').length;
  }

  // Grid management methods
  setColumns(columns) {
    this.element.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    this.dispatchEvent('grid:columns-changed', { columns });
    return this;
  }

  setGap(gap) {
    this.element.style.gap = gap;
    this.dispatchEvent('grid:gap-changed', { gap });
    return this;
  }

  // Widget management methods
  addWidget(widgetElement, position = {}) {
    const {
      row = 'auto',
      column = 'auto',
      rowSpan = 1,
      columnSpan = 1
    } = position;

    // Generate unique ID
    const widgetId = widgetElement.getAttribute('data-widget-id') || 
                    `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    widgetElement.setAttribute('data-widget-id', widgetId);

    // Apply grid positioning
    widgetElement.style.gridRow = row === 'auto' ? 'auto' : `${row} / span ${rowSpan}`;
    widgetElement.style.gridColumn = column === 'auto' ? 'auto' : `${column} / span ${columnSpan}`;

    // Add to grid
    this.element.appendChild(widgetElement);

    // Store widget info
    this.widgets.set(widgetId, {
      element: widgetElement,
      position: { row, column, rowSpan, columnSpan }
    });

    this.dispatchEvent('grid:widget-added', { widgetId, position });
    return widgetId;
  }

  removeWidget(widgetId) {
    const widget = this.widgets.get(widgetId);
    if (!widget) return false;

    if (widget.element.parentNode) {
      widget.element.parentNode.removeChild(widget.element);
    }

    this.widgets.delete(widgetId);
    this.dispatchEvent('grid:widget-removed', { widgetId });
    return true;
  }

  moveWidget(widgetId, newPosition) {
    const widget = this.widgets.get(widgetId);
    if (!widget) return false;

    const {
      row = widget.position.row,
      column = widget.position.column,
      rowSpan = widget.position.rowSpan,
      columnSpan = widget.position.columnSpan
    } = newPosition;

    // Update element styles
    widget.element.style.gridRow = row === 'auto' ? 'auto' : `${row} / span ${rowSpan}`;
    widget.element.style.gridColumn = column === 'auto' ? 'auto' : `${column} / span ${columnSpan}`;

    // Update stored position
    widget.position = { row, column, rowSpan, columnSpan };

    this.dispatchEvent('grid:widget-moved', { widgetId, position: widget.position });
    return true;
  }

  getWidget(widgetId) {
    return this.widgets.get(widgetId);
  }

  getAllWidgets() {
    return Array.from(this.widgets.values());
  }

  clear() {
    this.widgets.forEach((widget, id) => {
      this.removeWidget(id);
    });
    
    this.dispatchEvent('grid:cleared');
    return this;
  }

  // Layout persistence
  getLayout() {
    const layout = [];
    this.widgets.forEach((widget, id) => {
      layout.push({
        id,
        position: { ...widget.position }
      });
    });
    return layout;
  }

  setLayout(layout) {
    layout.forEach(item => {
      this.moveWidget(item.id, item.position);
    });
    
    this.dispatchEvent('grid:layout-applied', { layout });
    return this;
  }

  // Validation
  validatePosition(position) {
    const { row, column, rowSpan = 1, columnSpan = 1 } = position;
    
    if (column !== 'auto' && (column < 1 || column + columnSpan - 1 > this.options.columns)) {
      return {
        valid: false,
        error: `Column position ${column} with span ${columnSpan} exceeds grid columns (${this.options.columns})`
      };
    }
    
    if (rowSpan < 1 || columnSpan < 1) {
      return {
        valid: false,
        error: 'Row span and column span must be at least 1'
      };
    }
    
    return { valid: true };
  }

  // Utility methods
  findEmptySpace(requiredColumns = 1, requiredRows = 1) {
    // Simple algorithm to find next available space
    // In a real implementation, this would be more sophisticated
    const occupiedSpaces = new Set();
    
    this.widgets.forEach(widget => {
      const { row, column, rowSpan, columnSpan } = widget.position;
      if (row !== 'auto' && column !== 'auto') {
        for (let r = row; r < row + rowSpan; r++) {
          for (let c = column; c < column + columnSpan; c++) {
            occupiedSpaces.add(`${r}-${c}`);
          }
        }
      }
    });

    // Find first available space
    for (let row = 1; row <= 20; row++) { // Limit search to 20 rows
      for (let column = 1; column <= this.options.columns - requiredColumns + 1; column++) {
        let spaceAvailable = true;
        
        for (let r = row; r < row + requiredRows; r++) {
          for (let c = column; c < column + requiredColumns; c++) {
            if (occupiedSpaces.has(`${r}-${c}`)) {
              spaceAvailable = false;
              break;
            }
          }
          if (!spaceAvailable) break;
        }
        
        if (spaceAvailable) {
          return { row, column };
        }
      }
    }
    
    return { row: 'auto', column: 'auto' };
  }

  // Event dispatching
  dispatchEvent(eventName, detail = {}) {
    this.element.dispatchEvent(new CustomEvent(eventName, {
      detail: { ...detail, grid: this }
    }));
  }

  // Public API
  getState() {
    return {
      columns: this.getCurrentColumns(),
      gap: this.element.style.gap,
      widgetCount: this.widgets.size,
      layout: this.getLayout()
    };
  }

  // Cleanup
  destroy() {
    if (this.options.responsive) {
      window.removeEventListener('resize', this.handleResize);
    }
    
    this.clear();
  }
}
