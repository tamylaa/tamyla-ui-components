/**
 * Real-time Status Configuration
 * Centralized settings, presets, and validation for status components
 */

// ================================
// Status Type Definitions
// ================================

export const STATUS_TYPES = {
  // Connection statuses
  LIVE: 'live',
  OFFLINE: 'offline',
  CONNECTING: 'connecting',
  
  // Order statuses
  PENDING: 'pending',
  FILLED: 'filled',
  CANCELLED: 'cancelled',
  REJECTED: 'rejected',
  
  // Session statuses
  OPEN: 'open',
  CLOSED: 'closed',
  PRE_MARKET: 'pre-market',
  AFTER_HOURS: 'after-hours'
};

// ================================
// Status Configurations
// ================================

export const STATUS_CONFIGS = {
  [STATUS_TYPES.LIVE]: {
    icon: '🟢',
    text: 'Live',
    color: '#10b981',
    bgColor: '#d1fae5',
    borderColor: '#a7f3d0',
    pulse: true,
    priority: 1,
    category: 'connection'
  },
  
  [STATUS_TYPES.OFFLINE]: {
    icon: '🔴',
    text: 'Offline',
    color: '#ef4444',
    bgColor: '#fee2e2',
    borderColor: '#fecaca',
    pulse: false,
    priority: 5,
    category: 'connection'
  },
  
  [STATUS_TYPES.CONNECTING]: {
    icon: '🟡',
    text: 'Connecting',
    color: '#f59e0b',
    bgColor: '#fef3c7',
    borderColor: '#fde68a',
    pulse: true,
    priority: 3,
    category: 'connection'
  },
  
  [STATUS_TYPES.PENDING]: {
    icon: '⏳',
    text: 'Pending',
    color: '#8b5cf6',
    bgColor: '#e7d3ff',
    borderColor: '#ddd6fe',
    pulse: true,
    priority: 2,
    category: 'order'
  },
  
  [STATUS_TYPES.FILLED]: {
    icon: '✅',
    text: 'Filled',
    color: '#10b981',
    bgColor: '#d1fae5',
    borderColor: '#a7f3d0',
    pulse: false,
    priority: 1,
    category: 'order'
  },
  
  [STATUS_TYPES.CANCELLED]: {
    icon: '❌',
    text: 'Cancelled',
    color: '#6b7280',
    bgColor: '#f3f4f6',
    borderColor: '#e5e7eb',
    pulse: false,
    priority: 4,
    category: 'order'
  },
  
  [STATUS_TYPES.REJECTED]: {
    icon: '🚫',
    text: 'Rejected',
    color: '#ef4444',
    bgColor: '#fee2e2',
    borderColor: '#fecaca',
    pulse: false,
    priority: 5,
    category: 'order'
  },
  
  [STATUS_TYPES.OPEN]: {
    icon: '🔔',
    text: 'Market Open',
    color: '#10b981',
    bgColor: '#d1fae5',
    borderColor: '#a7f3d0',
    pulse: false,
    priority: 1,
    category: 'session'
  },
  
  [STATUS_TYPES.CLOSED]: {
    icon: '🔕',
    text: 'Market Closed',
    color: '#6b7280',
    bgColor: '#f3f4f6',
    borderColor: '#e5e7eb',
    pulse: false,
    priority: 3,
    category: 'session'
  },
  
  [STATUS_TYPES.PRE_MARKET]: {
    icon: '🌅',
    text: 'Pre-Market',
    color: '#f59e0b',
    bgColor: '#fef3c7',
    borderColor: '#fde68a',
    pulse: true,
    priority: 2,
    category: 'session'
  },
  
  [STATUS_TYPES.AFTER_HOURS]: {
    icon: '🌙',
    text: 'After Hours',
    color: '#8b5cf6',
    bgColor: '#e7d3ff',
    borderColor: '#ddd6fe',
    pulse: true,
    priority: 2,
    category: 'session'
  }
};

// ================================
// Component Size Options
// ================================

export const SIZE_OPTIONS = {
  SM: 'sm',
  MD: 'md',
  LG: 'lg'
};

// ================================
// Update Intervals (milliseconds)
// ================================

export const UPDATE_INTERVALS = {
  FAST: 1000,      // 1 second
  NORMAL: 5000,    // 5 seconds
  SLOW: 30000,     // 30 seconds
  TIMESTAMP: 1000  // For timestamp updates
};

// ================================
// Trading Portal Presets
// ================================

export const TRADING_PORTAL_PRESETS = {
  // Connection monitoring presets
  connectionMonitor: {
    type: 'status-indicator',
    status: STATUS_TYPES.OFFLINE,
    animated: true,
    showTimestamp: true,
    showIcon: true,
    showText: true,
    size: SIZE_OPTIONS.MD,
    updateInterval: UPDATE_INTERVALS.FAST,
    autoConnect: true,
    endpoint: '/api/health'
  },
  
  quickConnection: {
    type: 'status-indicator',
    status: STATUS_TYPES.OFFLINE,
    animated: true,
    showTimestamp: false,
    showIcon: true,
    showText: false,
    size: SIZE_OPTIONS.SM,
    updateInterval: UPDATE_INTERVALS.NORMAL
  },
  
  // Order status presets
  orderTracking: {
    type: 'order-status',
    status: STATUS_TYPES.PENDING,
    showProgress: true,
    showActions: true,
    allowCancel: true,
    allowModify: true,
    autoRefresh: true,
    refreshInterval: UPDATE_INTERVALS.FAST
  },
  
  orderSummary: {
    type: 'order-status',
    status: STATUS_TYPES.FILLED,
    showProgress: false,
    showActions: false,
    allowCancel: false,
    allowModify: false,
    autoRefresh: false
  },
  
  // Session monitoring presets
  tradingSession: {
    type: 'trading-session',
    market: 'NYSE',
    timezone: 'America/New_York',
    showCountdown: true,
    showActions: true,
    autoUpdate: true,
    updateInterval: UPDATE_INTERVALS.NORMAL
  },
  
  marketOverview: {
    type: 'trading-session',
    market: 'NASDAQ',
    timezone: 'America/New_York',
    showCountdown: false,
    showActions: false,
    autoUpdate: true,
    updateInterval: UPDATE_INTERVALS.SLOW
  },
  
  // Banner presets
  connectionBanner: {
    type: 'connection-banner',
    status: STATUS_TYPES.OFFLINE,
    showProgress: true,
    showActions: true,
    allowRetry: true,
    allowDismiss: true,
    autoHide: false
  },
  
  alertBanner: {
    type: 'connection-banner',
    status: STATUS_TYPES.CONNECTING,
    showProgress: false,
    showActions: false,
    allowRetry: false,
    allowDismiss: true,
    autoHide: true,
    autoHideDelay: 5000
  },
  
  // List presets
  statusDashboard: {
    type: 'status-list',
    showFilters: true,
    showControls: true,
    allowAdd: true,
    allowRemove: true,
    groupByCategory: true,
    sortByPriority: true,
    maxItems: 50
  },
  
  simpleList: {
    type: 'status-list',
    showFilters: false,
    showControls: false,
    allowAdd: false,
    allowRemove: false,
    groupByCategory: false,
    sortByPriority: true,
    maxItems: 10
  }
};

// ================================
// Market Configurations
// ================================

export const MARKET_CONFIGS = {
  NYSE: {
    name: 'New York Stock Exchange',
    timezone: 'America/New_York',
    openTime: '09:30',
    closeTime: '16:00',
    preMarketStart: '04:00',
    afterHoursEnd: '20:00',
    currency: 'USD',
    country: 'US'
  },
  
  NASDAQ: {
    name: 'NASDAQ',
    timezone: 'America/New_York',
    openTime: '09:30',
    closeTime: '16:00',
    preMarketStart: '04:00',
    afterHoursEnd: '20:00',
    currency: 'USD',
    country: 'US'
  },
  
  LSE: {
    name: 'London Stock Exchange',
    timezone: 'Europe/London',
    openTime: '08:00',
    closeTime: '16:30',
    preMarketStart: '05:00',
    afterHoursEnd: '17:30',
    currency: 'GBP',
    country: 'UK'
  },
  
  TSE: {
    name: 'Tokyo Stock Exchange',
    timezone: 'Asia/Tokyo',
    openTime: '09:00',
    closeTime: '15:00',
    preMarketStart: '08:00',
    afterHoursEnd: '15:30',
    currency: 'JPY',
    country: 'JP'
  }
};

// ================================
// Event Types
// ================================

export const EVENT_TYPES = {
  // Status events
  STATUS_CHANGED: 'status:changed',
  STATUS_UPDATE: 'status:update',
  
  // Connection events
  CONNECTION_ESTABLISHED: 'connection:established',
  CONNECTION_LOST: 'connection:lost',
  CONNECTION_RETRY: 'connection:retry',
  
  // Order events
  ORDER_PLACED: 'order:placed',
  ORDER_FILLED: 'order:filled',
  ORDER_CANCELLED: 'order:cancelled',
  ORDER_REJECTED: 'order:rejected',
  ORDER_MODIFIED: 'order:modified',
  
  // Session events
  MARKET_OPENED: 'session:opened',
  MARKET_CLOSED: 'session:closed',
  PREMARKET_STARTED: 'session:premarket',
  AFTERHOURS_STARTED: 'session:afterhours',
  
  // UI events
  BANNER_SHOWN: 'banner:shown',
  BANNER_DISMISSED: 'banner:dismissed',
  BANNER_RETRY: 'banner:retry',
  
  LIST_FILTERED: 'list:filtered',
  LIST_REFRESHED: 'list:refreshed',
  LIST_ITEM_ADDED: 'list:item-added',
  LIST_ITEM_REMOVED: 'list:item-removed',
  
  // Component events
  COMPONENT_INITIALIZED: 'component:initialized',
  COMPONENT_DESTROYED: 'component:destroyed',
  COMPONENT_ERROR: 'component:error'
};

// ================================
// Validation Rules
// ================================

export const VALIDATION_RULES = {
  status: {
    required: true,
    type: 'string',
    enum: Object.values(STATUS_TYPES),
    message: 'Status must be one of the predefined status types'
  },
  
  size: {
    required: false,
    type: 'string',
    enum: Object.values(SIZE_OPTIONS),
    default: SIZE_OPTIONS.MD,
    message: 'Size must be sm, md, or lg'
  },
  
  updateInterval: {
    required: false,
    type: 'number',
    min: 100,
    max: 300000,
    default: UPDATE_INTERVALS.NORMAL,
    message: 'Update interval must be between 100ms and 5 minutes'
  },
  
  endpoint: {
    required: false,
    type: 'string',
    pattern: /^\/api\/[\w\-\/]+$/,
    default: '/api/health',
    message: 'Endpoint must be a valid API path'
  },
  
  market: {
    required: false,
    type: 'string',
    enum: Object.keys(MARKET_CONFIGS),
    default: 'NYSE',
    message: 'Market must be one of the supported markets'
  },
  
  timezone: {
    required: false,
    type: 'string',
    pattern: /^[A-Za-z]+\/[A-Za-z_]+$/,
    message: 'Timezone must be in IANA timezone format'
  }
};

// ================================
// Default Configurations
// ================================

export const DEFAULT_CONFIG = {
  statusIndicator: {
    status: STATUS_TYPES.OFFLINE,
    animated: true,
    showTimestamp: false,
    showIcon: true,
    showText: true,
    size: SIZE_OPTIONS.MD,
    updateInterval: null,
    className: '',
    autoConnect: false
  },
  
  connectionBanner: {
    status: STATUS_TYPES.OFFLINE,
    showProgress: true,
    showActions: true,
    allowRetry: true,
    allowDismiss: true,
    autoHide: false,
    autoHideDelay: 0,
    className: ''
  },
  
  orderStatus: {
    status: STATUS_TYPES.PENDING,
    showProgress: true,
    showActions: true,
    allowCancel: true,
    allowModify: true,
    autoRefresh: false,
    refreshInterval: UPDATE_INTERVALS.FAST,
    className: ''
  },
  
  tradingSession: {
    market: 'NYSE',
    showCountdown: true,
    showActions: true,
    autoUpdate: true,
    updateInterval: UPDATE_INTERVALS.NORMAL,
    className: ''
  },
  
  statusList: {
    showFilters: true,
    showControls: true,
    allowAdd: false,
    allowRemove: false,
    groupByCategory: false,
    sortByPriority: true,
    maxItems: 100,
    className: ''
  },
  
  connectionManager: {
    checkInterval: UPDATE_INTERVALS.NORMAL,
    endpoint: '/api/health',
    timeout: 3000,
    retryAttempts: 3,
    retryDelay: 1000,
    autoStart: false
  }
};

// ================================
// Utility Functions
// ================================

/**
 * Validate configuration object
 */
export function validateConfig(config, type) {
  const errors = [];
  const rules = VALIDATION_RULES;
  const defaults = DEFAULT_CONFIG[type] || {};
  
  // Merge with defaults
  const validatedConfig = { ...defaults, ...config };
  
  // Validate each property
  Object.entries(rules).forEach(([key, rule]) => {
    const value = validatedConfig[key];
    
    // Check required fields
    if (rule.required && (value === undefined || value === null)) {
      errors.push(`${key} is required`);
      return;
    }
    
    // Skip validation if value is undefined and not required
    if (value === undefined && !rule.required) {
      if (rule.default !== undefined) {
        validatedConfig[key] = rule.default;
      }
      return;
    }
    
    // Type validation
    if (rule.type && typeof value !== rule.type) {
      errors.push(`${key} must be of type ${rule.type}`);
      return;
    }
    
    // Enum validation
    if (rule.enum && !rule.enum.includes(value)) {
      errors.push(`${key} must be one of: ${rule.enum.join(', ')}`);
      return;
    }
    
    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value)) {
      errors.push(rule.message || `${key} format is invalid`);
      return;
    }
    
    // Range validation
    if (rule.min !== undefined && value < rule.min) {
      errors.push(`${key} must be at least ${rule.min}`);
      return;
    }
    
    if (rule.max !== undefined && value > rule.max) {
      errors.push(`${key} must be at most ${rule.max}`);
      return;
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    config: validatedConfig
  };
}

/**
 * Get preset configuration
 */
export function getPreset(presetName) {
  return TRADING_PORTAL_PRESETS[presetName] || null;
}

/**
 * Get status configuration
 */
export function getStatusConfig(status) {
  return STATUS_CONFIGS[status] || STATUS_CONFIGS[STATUS_TYPES.OFFLINE];
}

/**
 * Get market configuration
 */
export function getMarketConfig(market) {
  return MARKET_CONFIGS[market] || MARKET_CONFIGS.NYSE;
}

/**
 * Check if market is currently open
 */
export function isMarketOpen(market = 'NYSE') {
  const config = getMarketConfig(market);
  const now = new Date();
  const tz = config.timezone;
  
  // This is a simplified check - in production, you'd use a proper date library
  const currentTime = now.toLocaleTimeString('en-US', { 
    timeZone: tz, 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  return currentTime >= config.openTime && currentTime <= config.closeTime;
}

/**
 * Get next market event
 */
export function getNextMarketEvent(market = 'NYSE') {
  const config = getMarketConfig(market);
  const isOpen = isMarketOpen(market);
  
  return {
    isOpen,
    nextEvent: isOpen ? 'close' : 'open',
    nextTime: isOpen ? config.closeTime : config.openTime,
    timezone: config.timezone
  };
}

// Export all configurations
export default {
  STATUS_TYPES,
  STATUS_CONFIGS,
  SIZE_OPTIONS,
  UPDATE_INTERVALS,
  TRADING_PORTAL_PRESETS,
  MARKET_CONFIGS,
  EVENT_TYPES,
  VALIDATION_RULES,
  DEFAULT_CONFIG,
  validateConfig,
  getPreset,
  getStatusConfig,
  getMarketConfig,
  isMarketOpen,
  getNextMarketEvent
};
