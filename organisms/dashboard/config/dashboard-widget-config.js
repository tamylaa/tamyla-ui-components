/**
 * Dashboard Widget Configuration
 * Centralized configuration for dashboard widgets
 */

export const DASHBOARD_WIDGET_CONFIG = {
  // Default widget options
  defaults: {
    type: 'card',
    size: 'medium',
    loading: false,
    error: null,
    resizable: false,
    movable: false,
    collapsible: true,
    refreshInterval: 0
  },

  // Widget types
  types: {
    card: {
      template: 'dashboard-widget.html',
      renderer: 'renderCard'
    },
    metric: {
      template: 'metric-widget.html',
      renderer: 'renderMetric'
    },
    chart: {
      template: 'dashboard-widget.html',
      renderer: 'renderChart'
    },
    list: {
      template: 'list-widget.html',
      renderer: 'renderList'
    },
    table: {
      template: 'table-widget.html',
      renderer: 'renderTable'
    }
  },

  // Size configurations
  sizes: {
    small: {
      minHeight: '120px',
      defaultColumns: 2,
      defaultRows: 1
    },
    medium: {
      minHeight: '200px',
      defaultColumns: 3,
      defaultRows: 2
    },
    large: {
      minHeight: '300px',
      defaultColumns: 4,
      defaultRows: 3
    },
    xl: {
      minHeight: '400px',
      defaultColumns: 6,
      defaultRows: 4
    }
  },

  // Grid configuration
  grid: {
    defaultColumns: 12,
    defaultGap: '16px',
    breakpoints: {
      mobile: '768px',
      tablet: '1024px',
      desktop: '1200px'
    }
  },

  // Animation timings
  animations: {
    hover: 200,
    collapse: 300,
    refresh: 500,
    loading: 1000
  },

  // Validation rules
  validation: {
    title: {
      required: true,
      maxLength: 50
    },
    refreshInterval: {
      min: 1000, // Minimum 1 second
      max: 300000 // Maximum 5 minutes
    }
  },

  // Error messages
  errors: {
    TEMPLATE_LOAD_FAILED: 'Failed to load widget template',
    DATA_FETCH_FAILED: 'Failed to fetch widget data',
    RENDER_FAILED: 'Failed to render widget content',
    INVALID_TYPE: 'Invalid widget type specified',
    INVALID_SIZE: 'Invalid widget size specified'
  }
};

/**
 * Trading Portal Dashboard Presets
 */
export const TRADING_PORTAL_WIDGET_PRESETS = {
  portfolio: {
    type: 'metric',
    title: 'Portfolio Value',
    size: 'medium',
    data: {
      value: 125000,
      label: 'Total Value',
      change: 5.2,
      format: 'currency'
    },
    refreshInterval: 30000 // 30 seconds
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
    },
    refreshInterval: 10000 // 10 seconds
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
    },
    refreshInterval: 60000 // 1 minute
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
    },
    refreshInterval: 15000 // 15 seconds
  },

  dailyPnL: {
    type: 'metric',
    title: 'Daily P&L',
    size: 'small',
    data: {
      value: 2450.75,
      label: 'Today\'s Gain',
      change: 12.3,
      format: 'currency'
    },
    refreshInterval: 5000 // 5 seconds
  },

  openPositions: {
    type: 'metric',
    title: 'Open Positions',
    size: 'small',
    data: {
      value: 8,
      label: 'Active Trades',
      format: 'number'
    },
    refreshInterval: 30000 // 30 seconds
  }
};

/**
 * Dashboard Layout Presets
 */
export const DASHBOARD_LAYOUTS = {
  trading: {
    name: 'Trading Dashboard',
    description: 'Comprehensive trading overview',
    widgets: [
      { id: 'portfolio', preset: 'portfolio', position: { row: 1, column: 1, columnSpan: 3 } },
      { id: 'dailyPnL', preset: 'dailyPnL', position: { row: 1, column: 4, columnSpan: 2 } },
      { id: 'openPositions', preset: 'openPositions', position: { row: 1, column: 6, columnSpan: 2 } },
      { id: 'marketChart', preset: 'marketChart', position: { row: 2, column: 1, columnSpan: 8 } },
      { id: 'recentTrades', preset: 'recentTrades', position: { row: 3, column: 1, columnSpan: 6 } },
      { id: 'watchlist', preset: 'watchlist', position: { row: 3, column: 7, columnSpan: 6 } }
    ]
  },

  analytics: {
    name: 'Analytics Dashboard',
    description: 'Performance analysis and metrics',
    widgets: [
      { id: 'portfolio', preset: 'portfolio', position: { row: 1, column: 1, columnSpan: 4 } },
      { id: 'marketChart', preset: 'marketChart', position: { row: 1, column: 5, columnSpan: 8 } },
      { id: 'watchlist', preset: 'watchlist', position: { row: 2, column: 1, columnSpan: 12 } }
    ]
  },

  minimal: {
    name: 'Minimal Dashboard',
    description: 'Essential metrics only',
    widgets: [
      { id: 'portfolio', preset: 'portfolio', position: { row: 1, column: 1, columnSpan: 6 } },
      { id: 'dailyPnL', preset: 'dailyPnL', position: { row: 1, column: 7, columnSpan: 6 } }
    ]
  }
};
