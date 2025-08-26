/**
 * Action Card Icon Library
 * Centralized icon management for action cards
 */

export const ACTION_CARD_ICONS = {
  // Trading actions
  trade: '📈',
  buy: '🛒',
  sell: '💰',
  analyze: '📊',
  research: '🔍',
  
  // Portfolio actions
  portfolio: '💼',
  diversify: '🌐',
  rebalance: '⚖️',
  review: '👁️',
  
  // Learning actions
  learn: '📚',
  tutorial: '🎓',
  quiz: '❓',
  practice: '🎯',
  
  // Achievement actions
  milestone: '🏆',
  streak: '🔥',
  level: '⭐',
  badge: '🎖️',
  
  // Daily actions
  checkin: '✅',
  daily: '📅',
  routine: '🔄',
  habit: '💫',
  
  // Risk management
  risk: '⚠️',
  safety: '🛡️',
  alert: '🚨',
  monitor: '👀',
  
  // Social actions
  share: '📤',
  follow: '👥',
  discuss: '💬',
  community: '🌟'
};

/**
 * Icon SVG definitions for scalable icons
 */
export const ICON_SVGS = {
  trade: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
  </svg>`,
  
  portfolio: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>`,
  
  learn: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
  </svg>`,
  
  checkin: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
  </svg>`,
  
  risk: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
  </svg>`
};

/**
 * Get icon for action type
 */
export function getActionIcon(actionType, format = 'emoji') {
  const icon = ACTION_CARD_ICONS[actionType];
  
  if (format === 'svg') {
    return ICON_SVGS[actionType] || ICON_SVGS.trade;
  }
  
  return icon || ACTION_CARD_ICONS.trade;
}

/**
 * Create icon element
 */
export function createIconElement(iconType, options = {}) {
  const { format = 'emoji', size = '24px', className = '' } = options;
  
  if (format === 'svg') {
    const container = document.createElement('div');
    container.className = `action-icon svg-icon ${className}`;
    container.style.width = size;
    container.style.height = size;
    container.innerHTML = getActionIcon(iconType, 'svg');
    return container;
  } else {
    const span = document.createElement('span');
    span.className = `action-icon emoji-icon ${className}`;
    span.style.fontSize = size;
    span.textContent = getActionIcon(iconType, 'emoji');
    return span;
  }
}
