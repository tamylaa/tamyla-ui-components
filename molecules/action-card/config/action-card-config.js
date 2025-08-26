/**
 * Action Card Configuration
 * Centralized configuration for action card component
 */

export const ACTION_CARD_CONFIG = {
  // Default options
  defaults: {
    type: 'default',
    disabled: false,
    completed: false,
    showProgress: false,
    showReward: true,
    showCompletion: true
  },

  // XP reward tiers
  xpRewards: {
    low: 5,
    medium: 10,
    high: 15,
    premium: 25
  },

  // Animation timings
  animations: {
    hover: 200,
    complete: 500,
    progress: 300
  },

  // Size variants
  sizes: {
    small: {
      padding: '12px',
      iconSize: '32px',
      fontSize: '14px'
    },
    medium: {
      padding: '16px',
      iconSize: '48px',
      fontSize: '16px'
    },
    large: {
      padding: '20px',
      iconSize: '64px',
      fontSize: '18px'
    }
  },

  // Color themes
  themes: {
    default: {
      primary: '#3b82f6',
      background: '#ffffff',
      border: '#e1e5e9'
    },
    success: {
      primary: '#22c55e',
      background: '#f0fdf4',
      border: '#bbf7d0'
    },
    warning: {
      primary: '#f59e0b',
      background: '#fffbeb',
      border: '#fed7aa'
    },
    danger: {
      primary: '#ef4444',
      background: '#fef2f2',
      border: '#fecaca'
    }
  },

  // Validation rules
  validation: {
    title: {
      required: true,
      maxLength: 50
    },
    description: {
      maxLength: 150
    },
    progress: {
      min: 0,
      max: 100
    }
  }
};

/**
 * Default props for action cards
 */
export const defaultActionCardProps = {
  title: '',
  description: '',
  icon: '',
  reward: '',
  progress: null,
  status: 'available', // available, completed, locked, disabled
  color: 'primary',
  size: 'md',
  interactive: true,
  showProgress: false,
  showReward: true,
  analytics: false
};

/**
 * Valid configuration values
 */
export const actionCardConfig = {
  statuses: ['available', 'completed', 'locked', 'disabled'],
  colors: ['primary', 'secondary', 'success', 'warning', 'info'],
  sizes: ['sm', 'md', 'lg'],
  
  // Animation durations (in ms)
  animations: {
    ripple: 800,
    completion: 1000,
    hover: 200,
    focus: 150
  },
  
  // Accessibility settings
  accessibility: {
    tabIndex: {
      enabled: '0',
      disabled: '-1'
    },
    roles: {
      interactive: 'button',
      static: 'article'
    }
  },
  
  // CSS class prefixes
  classNames: {
    base: 'tmyl-action-card',
    status: 'tmyl-action-card--',
    color: 'tmyl-action-card--',
    size: 'tmyl-action-card--',
    interactive: 'tmyl-action-card--interactive',
    withProgress: 'tmyl-action-card--with-progress',
    hovering: 'tmyl-action-card--hovering',
    focused: 'tmyl-action-card--focused',
    completing: 'tmyl-action-card--completing'
  }
};

/**
 * Validation schemas
 */
export const actionCardValidation = {
  /**
   * Validate status value
   */
  validateStatus(status) {
    return actionCardConfig.statuses.includes(status);
  },

  /**
   * Validate color value
   */
  validateColor(color) {
    return actionCardConfig.colors.includes(color);
  },

  /**
   * Validate size value
   */
  validateSize(size) {
    return actionCardConfig.sizes.includes(size);
  },

  /**
   * Validate progress value
   */
  validateProgress(progress) {
    return progress === null || (typeof progress === 'number' && progress >= 0 && progress <= 100);
  },

  /**
   * Validate all props
   */
  validateProps(props) {
    const errors = [];
    
    if (!props.title || typeof props.title !== 'string') {
      errors.push('Title must be a non-empty string');
    }
    
    if (props.status && !this.validateStatus(props.status)) {
      errors.push(`Invalid status. Must be one of: ${actionCardConfig.statuses.join(', ')}`);
    }
    
    if (props.color && !this.validateColor(props.color)) {
      errors.push(`Invalid color. Must be one of: ${actionCardConfig.colors.join(', ')}`);
    }
    
    if (props.size && !this.validateSize(props.size)) {
      errors.push(`Invalid size. Must be one of: ${actionCardConfig.sizes.join(', ')}`);
    }
    
    if (props.progress !== undefined && !this.validateProgress(props.progress)) {
      errors.push('Progress must be null or a number between 0 and 100');
    }
    
    return errors;
  }
};

/**
 * Theme variations
 */
export const actionCardThemes = {
  default: {
    colors: actionCardConfig.colors,
    sizes: actionCardConfig.sizes
  },
  
  minimal: {
    colors: ['primary', 'secondary'],
    sizes: ['sm', 'md'],
    showReward: false,
    showProgress: false
  },
  
  gamified: {
    colors: ['success', 'warning', 'info'],
    sizes: ['md', 'lg'],
    showReward: true,
    showProgress: true,
    interactive: true
  }
};
