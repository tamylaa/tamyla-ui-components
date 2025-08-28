/**
 * Mobile Sidebar Configuration
 * Centralized configuration for sidebar behavior, animations, and presets
 */

// Sidebar Configuration
const SIDEBAR_CONFIG = {
  positions: {
    LEFT: 'left',
    RIGHT: 'right'
  },

  animations: {
    DURATION: 300,
    EASING: 'cubic-bezier(0.4, 0, 0.2, 1)',
    BACKDROP_BLUR: true
  },

  dimensions: {
    DEFAULT_WIDTH: '280px',
    MAX_WIDTH: '85vw',
    MOBILE_BREAKPOINT: 768,
    SMALL_MOBILE_BREAKPOINT: 480
  },

  behavior: {
    CLOSE_ON_BACKDROP: true,
    CLOSE_ON_ESCAPE: true,
    CLOSE_ON_NAVIGATION: true,
    FOCUS_MANAGEMENT: true,
    SWIPE_GESTURES: true,
    SWIPE_THRESHOLD: 50
  },

  accessibility: {
    FOCUS_TRAP: true,
    ARIA_LABELS: true,
    KEYBOARD_NAVIGATION: true,
    HIGH_CONTRAST_SUPPORT: true,
    REDUCED_MOTION_SUPPORT: true
  }
};

// Navigation Item Types
const NAV_ITEM_TYPES = {
  LINK: 'link',
  BUTTON: 'button',
  GROUP: 'group',
  SEPARATOR: 'separator'
};

// Header Template Types
const HEADER_TEMPLATES = {
  SIMPLE: 'simple',
  PROFILE: 'profile',
  TRADING: 'trading',
  CUSTOM: 'custom'
};

// Footer Template Types
const FOOTER_TEMPLATES = {
  SIMPLE: 'simple',
  ACTIONS: 'actions',
  STATUS: 'status',
  TRADING: 'trading',
  CUSTOM: 'custom'
};

// Trading Portal Navigation Presets
const TRADING_PORTAL_PRESETS = {
  main: {
    name: 'Main Navigation',
    items: [
      {
        id: 'dashboard',
        type: NAV_ITEM_TYPES.LINK,
        text: 'Dashboard',
        icon: '📊',
        href: '/dashboard',
        active: false
      },
      {
        id: 'trades',
        type: NAV_ITEM_TYPES.LINK,
        text: 'Trades',
        icon: '📈',
        href: '/trades',
        active: false
      },
      {
        id: 'portfolio',
        type: NAV_ITEM_TYPES.LINK,
        text: 'Portfolio',
        icon: '💼',
        href: '/portfolio',
        active: false
      },
      {
        id: 'analytics',
        type: NAV_ITEM_TYPES.LINK,
        text: 'Analytics',
        icon: '📊',
        href: '/analytics',
        active: false
      },
      {
        id: 'separator-1',
        type: NAV_ITEM_TYPES.SEPARATOR
      },
      {
        id: 'documents',
        type: NAV_ITEM_TYPES.LINK,
        text: 'Documents',
        icon: '📄',
        href: '/documents',
        active: false
      },
      {
        id: 'reports',
        type: NAV_ITEM_TYPES.LINK,
        text: 'Reports',
        icon: '📋',
        href: '/reports',
        active: false
      },
      {
        id: 'separator-2',
        type: NAV_ITEM_TYPES.SEPARATOR
      },
      {
        id: 'settings',
        type: NAV_ITEM_TYPES.LINK,
        text: 'Settings',
        icon: '⚙️',
        href: '/settings',
        active: false
      }
    ]
  },

  trading: {
    name: 'Trading Navigation',
    items: [
      {
        id: 'live-trading',
        type: NAV_ITEM_TYPES.LINK,
        text: 'Live Trading',
        icon: '🚀',
        href: '/trading/live',
        active: false,
        badge: 'LIVE'
      },
      {
        id: 'positions',
        type: NAV_ITEM_TYPES.LINK,
        text: 'Open Positions',
        icon: '📍',
        href: '/trading/positions',
        active: false
      },
      {
        id: 'orders',
        type: NAV_ITEM_TYPES.LINK,
        text: 'Orders',
        icon: '📝',
        href: '/trading/orders',
        active: false
      },
      {
        id: 'watchlist',
        type: NAV_ITEM_TYPES.LINK,
        text: 'Watchlist',
        icon: '👁️',
        href: '/trading/watchlist',
        active: false
      },
      {
        id: 'separator-1',
        type: NAV_ITEM_TYPES.SEPARATOR
      },
      {
        id: 'analysis-group',
        type: NAV_ITEM_TYPES.GROUP,
        text: 'Analysis Tools',
        icon: '🔍',
        expanded: true,
        items: [
          {
            id: 'chart-analysis',
            type: NAV_ITEM_TYPES.LINK,
            text: 'Chart Analysis',
            icon: '📊',
            href: '/analysis/charts',
            active: false
          },
          {
            id: 'technical-indicators',
            type: NAV_ITEM_TYPES.LINK,
            text: 'Technical Indicators',
            icon: '📈',
            href: '/analysis/indicators',
            active: false
          },
          {
            id: 'market-scanner',
            type: NAV_ITEM_TYPES.LINK,
            text: 'Market Scanner',
            icon: '🔍',
            href: '/analysis/scanner',
            active: false
          }
        ]
      }
    ]
  },

  admin: {
    name: 'Admin Navigation',
    items: [
      {
        id: 'users',
        type: NAV_ITEM_TYPES.LINK,
        text: 'User Management',
        icon: '👥',
        href: '/admin/users',
        active: false
      },
      {
        id: 'system',
        type: NAV_ITEM_TYPES.LINK,
        text: 'System Health',
        icon: '⚡',
        href: '/admin/system',
        active: false
      },
      {
        id: 'logs',
        type: NAV_ITEM_TYPES.LINK,
        text: 'Audit Logs',
        icon: '📋',
        href: '/admin/logs',
        active: false
      },
      {
        id: 'configuration',
        type: NAV_ITEM_TYPES.LINK,
        text: 'Configuration',
        icon: '⚙️',
        href: '/admin/config',
        active: false
      }
    ]
  },

  mobile_quick: {
    name: 'Mobile Quick Access',
    items: [
      {
        id: 'quick-trade',
        type: NAV_ITEM_TYPES.BUTTON,
        text: 'Quick Trade',
        icon: '⚡',
        action: 'quick-trade',
        primary: true
      },
      {
        id: 'balance',
        type: NAV_ITEM_TYPES.LINK,
        text: 'Account Balance',
        icon: '💰',
        href: '/account/balance',
        active: false
      },
      {
        id: 'notifications',
        type: NAV_ITEM_TYPES.LINK,
        text: 'Notifications',
        icon: '🔔',
        href: '/notifications',
        active: false,
        badge: '3'
      },
      {
        id: 'separator-1',
        type: NAV_ITEM_TYPES.SEPARATOR
      },
      {
        id: 'support',
        type: NAV_ITEM_TYPES.LINK,
        text: 'Support',
        icon: '💬',
        href: '/support',
        active: false
      },
      {
        id: 'logout',
        type: NAV_ITEM_TYPES.BUTTON,
        text: 'Sign Out',
        icon: '🚪',
        action: 'logout',
        danger: true
      }
    ]
  }
};

// Header Configuration Presets
const HEADER_PRESETS = {
  simple_brand: {
    template: HEADER_TEMPLATES.SIMPLE,
    data: {
      logo: '📈',
      text: 'Trading Portal'
    }
  },

  user_profile: {
    template: HEADER_TEMPLATES.PROFILE,
    data: {
      avatar: '/assets/images/default-avatar.jpg',
      name: 'John Doe',
      role: 'Trader',
      status: 'online'
    }
  },

  trading_status: {
    template: HEADER_TEMPLATES.TRADING,
    data: {
      status: 'Market Open',
      balance: '$12,345.67',
      statusType: 'success'
    }
  }
};

// Footer Configuration Presets
const FOOTER_PRESETS = {
  simple_copyright: {
    template: FOOTER_TEMPLATES.SIMPLE,
    data: {
      text: '© 2025 Trading Portal. All rights reserved.'
    }
  },

  action_buttons: {
    template: FOOTER_TEMPLATES.ACTIONS,
    data: {
      actions: [
        {
          icon: '🌙',
          text: 'Dark Mode',
          action: 'toggle-dark-mode'
        },
        {
          icon: '💬',
          text: 'Feedback',
          action: 'show-feedback'
        }
      ]
    }
  },

  system_status: {
    template: FOOTER_TEMPLATES.STATUS,
    data: {
      version: 'v2.1.4',
      server: 'Online',
      serverStatus: 'success'
    }
  },

  trading_summary: {
    template: FOOTER_TEMPLATES.TRADING,
    data: {
      pnl: '+$234.56',
      pnlType: 'positive',
      positions: '3',
      positionsLabel: 'Open Positions'
    }
  }
};

// Animation Presets
const ANIMATION_PRESETS = {
  fast: {
    duration: 200,
    easing: 'cubic-bezier(0.4, 0, 1, 1)'
  },

  normal: {
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
  },

  slow: {
    duration: 500,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  },

  bounce: {
    duration: 400,
    easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  }
};

// Responsive Breakpoints
const RESPONSIVE_CONFIG = {
  breakpoints: {
    mobile: 480,
    tablet: 768,
    desktop: 1024,
    large: 1200
  },

  sidebarWidths: {
    mobile: '100vw',
    tablet: '320px',
    desktop: '280px',
    large: '300px'
  },

  behavior: {
    autoCloseOnNavigation: {
      mobile: true,
      tablet: true,
      desktop: false
    },

    swipeGestures: {
      mobile: true,
      tablet: true,
      desktop: false
    }
  }
};

// Validation Rules
const VALIDATION_RULES = {
  sidebar: {
    position: {
      required: false,
      enum: Object.values(SIDEBAR_CONFIG.positions),
      default: SIDEBAR_CONFIG.positions.LEFT
    },
    width: {
      required: false,
      type: 'string',
      pattern: /^\d+(px|%|vw)$/,
      default: SIDEBAR_CONFIG.dimensions.DEFAULT_WIDTH
    },
    animationDuration: {
      required: false,
      type: 'number',
      min: 100,
      max: 1000,
      default: SIDEBAR_CONFIG.animations.DURATION
    }
  },

  navItem: {
    id: {
      required: true,
      type: 'string',
      minLength: 1
    },
    type: {
      required: true,
      enum: Object.values(NAV_ITEM_TYPES)
    },
    text: {
      required: true,
      type: 'string',
      minLength: 1
    },
    href: {
      required: false,
      type: 'string'
    },
    icon: {
      required: false,
      type: 'string'
    }
  },

  header: {
    template: {
      required: true,
      enum: Object.values(HEADER_TEMPLATES)
    },
    data: {
      required: true,
      type: 'object'
    }
  },

  footer: {
    template: {
      required: true,
      enum: Object.values(FOOTER_TEMPLATES)
    },
    data: {
      required: true,
      type: 'object'
    }
  }
};

// Event Types
const EVENT_TYPES = {
  SIDEBAR_OPENED: 'sidebar:opened',
  SIDEBAR_CLOSED: 'sidebar:closed',
  SIDEBAR_OPENING: 'sidebar:opening',
  SIDEBAR_CLOSING: 'sidebar:closing',
  NAV_ITEM_CLICKED: 'nav:item:clicked',
  NAV_GROUP_TOGGLED: 'nav:group:toggled',
  HEADER_ACTION: 'header:action',
  FOOTER_ACTION: 'footer:action',
  SWIPE_DETECTED: 'swipe:detected',
  RESIZE_DETECTED: 'resize:detected'
};

// Export configuration
export {
  SIDEBAR_CONFIG,
  NAV_ITEM_TYPES,
  HEADER_TEMPLATES,
  FOOTER_TEMPLATES,
  TRADING_PORTAL_PRESETS,
  HEADER_PRESETS,
  FOOTER_PRESETS,
  ANIMATION_PRESETS,
  RESPONSIVE_CONFIG,
  VALIDATION_RULES,
  EVENT_TYPES
};
