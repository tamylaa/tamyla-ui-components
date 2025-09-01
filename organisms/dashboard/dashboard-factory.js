/**
 * Dashboard Factory
 * Factory wrapper for dashboard widgets and grids to integrate with unified UI factory
 */

import { createDashboardWidget, createDashboardGrid } from './dashboard-widget-patterns.js';

/**
 * Dashboard Factory
 * Creates dashboard components with unified factory pattern
 */
export function DashboardFactory(props = {}) {
  const {
    type = 'widget', // widget, grid
    title = '',
    size = 'medium',
    data = null,
    widgets = [],
    layout = 'grid',
    columns = 3,
    gap = '16px',
    container = null,
    ...otherOptions
  } = props;

  let element = null;
  let widgetInstances = new Map();

  /**
   * Create dashboard widget element
   */
  function createWidgetElement() {
    const widgetProps = {
      type: 'card',
      title,
      size,
      data,
      ...otherOptions
    };

    // Use the existing createDashboardWidget function
    const widgetInstance = createDashboardWidget(widgetProps);

    // Store reference for cleanup
    widgetInstances.set('main', widgetInstance);

    return widgetInstance.element || widgetInstance;
  }

  /**
   * Create dashboard grid element
   */
  function createGridElement() {
    const gridProps = {
      widgets,
      layout,
      columns,
      gap,
      ...otherOptions
    };

    // Use the existing createDashboardGrid function
    const gridInstance = createDashboardGrid(gridProps);

    // Store reference for cleanup
    widgetInstances.set('grid', gridInstance);

    return gridInstance.element || gridInstance;
  }

  /**
   * Create main element based on type
   */
  function createElement() {
    if (type === 'grid') {
      element = createGridElement();
    } else {
      element = createWidgetElement();
    }

    // Ensure we have a proper DOM element
    if (!element || typeof element.appendChild !== 'function') {
      // Fallback: create a wrapper element
      const wrapper = document.createElement('div');
      wrapper.className = 'tmyl-dashboard-wrapper';
      wrapper.setAttribute('data-type', type);

      if (element) {
        wrapper.appendChild(element);
      } else {
        wrapper.innerHTML = `
          <div class="dashboard-placeholder">
            <h3>Dashboard ${type.charAt(0).toUpperCase() + type.slice(1)}</h3>
            <p>Loading dashboard component...</p>
          </div>
        `;
      }

      element = wrapper;
    }

    return element;
  }

  /**
   * Render to container
   */
  function render(targetContainer = container) {
    if (!targetContainer) {
      throw new Error('Container element required for rendering dashboard');
    }

    if (!element) {
      createElement();
    }

    targetContainer.appendChild(element);
    return element;
  }

  /**
   * Update dashboard data
   */
  function updateData(newData) {
    if (type === 'widget') {
      const widgetInstance = widgetInstances.get('main');
      if (widgetInstance && typeof widgetInstance.updateData === 'function') {
        widgetInstance.updateData(newData);
      }
    } else if (type === 'grid') {
      const gridInstance = widgetInstances.get('grid');
      if (gridInstance && typeof gridInstance.updateWidgets === 'function') {
        gridInstance.updateWidgets(newData);
      }
    }
  }

  /**
   * Add widget to grid
   */
  function addWidget(widgetConfig) {
    if (type !== 'grid') return;

    const gridInstance = widgetInstances.get('grid');
    if (gridInstance && typeof gridInstance.addWidget === 'function') {
      gridInstance.addWidget(widgetConfig);
    }
  }

  /**
   * Remove widget from grid
   */
  function removeWidget(widgetId) {
    if (type !== 'grid') return;

    const gridInstance = widgetInstances.get('grid');
    if (gridInstance && typeof gridInstance.removeWidget === 'function') {
      gridInstance.removeWidget(widgetId);
    }
  }

  /**
   * Get widget instance
   */
  function getWidget(widgetId = 'main') {
    return widgetInstances.get(widgetId);
  }

  /**
   * Get element
   */
  function getElement() {
    if (!element) {
      createElement();
    }
    return element;
  }

  /**
   * Destroy and cleanup
   */
  function destroy() {
    // Destroy all widget instances
    widgetInstances.forEach(instance => {
      if (instance && typeof instance.destroy === 'function') {
        instance.destroy();
      }
    });
    widgetInstances.clear();

    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }

    element = null;
  }

  /**
   * Public API
   */
  return {
    // Core methods
    render,
    destroy,

    // Data management
    updateData,
    addWidget,
    removeWidget,

    // Element access
    getElement,
    getWidget,

    // Properties
    get props() {
      return {
        type,
        title,
        size,
        data,
        widgets,
        layout,
        columns,
        gap
      };
    }
  };
}

/**
 * Dashboard Templates
 * Pre-configured dashboard factories
 */
export const DashboardTemplates = {
  /**
   * Single widget
   */
  widget: (props = {}) => DashboardFactory({
    type: 'widget',
    ...props
  }),

  /**
   * Dashboard grid
   */
  grid: (props = {}) => DashboardFactory({
    type: 'grid',
    ...props
  }),

  /**
   * Analytics dashboard
   */
  analytics: (props = {}) => DashboardFactory({
    type: 'grid',
    title: 'Analytics Dashboard',
    columns: 4,
    widgets: [
      { type: 'metric', title: 'Total Users', data: { value: 0 } },
      { type: 'metric', title: 'Active Sessions', data: { value: 0 } },
      { type: 'chart', title: 'User Growth', data: null },
      { type: 'list', title: 'Recent Activity', data: [] }
    ],
    ...props
  }),

  /**
   * Trading dashboard
   */
  trading: (props = {}) => DashboardFactory({
    type: 'grid',
    title: 'Trading Dashboard',
    columns: 3,
    widgets: [
      { type: 'metric', title: 'Portfolio Value', data: { value: 0 } },
      { type: 'chart', title: 'Price Chart', data: null },
      { type: 'list', title: 'Open Orders', data: [] }
    ],
    ...props
  })
};
