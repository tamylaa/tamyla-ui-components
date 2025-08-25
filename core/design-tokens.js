/**
 * Design Tokens - Shared foundation for all atomic components
 * These tokens ensure consistency across all atoms while allowing customization
 */

export const designTokens = {
  // Color system - shared across all atoms
  colors: {
    primary: {
      50: 'var(--tmyl-primary-50)',
      100: 'var(--tmyl-primary-100)',
      200: 'var(--tmyl-primary-200)',
      300: 'var(--tmyl-primary-300)',
      400: 'var(--tmyl-primary-400)',
      500: 'var(--tmyl-primary-500)',
      600: 'var(--tmyl-primary-600)',
      700: 'var(--tmyl-primary-700)',
      800: 'var(--tmyl-primary-800)',
      900: 'var(--tmyl-primary-900)',
      contrast: 'var(--tmyl-primary-contrast)'
    },
    neutral: {
      50: 'var(--tmyl-neutral-50)',
      100: 'var(--tmyl-neutral-100)',
      200: 'var(--tmyl-neutral-200)',
      300: 'var(--tmyl-neutral-300)',
      400: 'var(--tmyl-neutral-400)',
      500: 'var(--tmyl-neutral-500)',
      600: 'var(--tmyl-neutral-600)',
      700: 'var(--tmyl-neutral-700)',
      800: 'var(--tmyl-neutral-800)',
      900: 'var(--tmyl-neutral-900)'
    },
    semantic: {
      success: 'var(--tmyl-success-600)',
      warning: 'var(--tmyl-warning-600)',
      error: 'var(--tmyl-error-600)',
      info: 'var(--tmyl-info-600)'
    },
    surface: {
      primary: 'var(--tmyl-surface-primary)',
      secondary: 'var(--tmyl-surface-secondary)',
      tertiary: 'var(--tmyl-surface-tertiary)'
    },
    text: {
      primary: 'var(--tmyl-text-primary)',
      secondary: 'var(--tmyl-text-secondary)',
      tertiary: 'var(--tmyl-text-tertiary)',
      inverse: 'var(--tmyl-text-inverse)'
    },
    border: {
      primary: 'var(--tmyl-border-primary)',
      secondary: 'var(--tmyl-border-secondary)',
      focus: 'var(--tmyl-border-focus)'
    }
  },

  // Spacing system - consistent across all atoms
  spacing: {
    px: 'var(--tmyl-space-px)',
    0: 'var(--tmyl-space-0)',
    0.5: 'var(--tmyl-space-0_5)',
    1: 'var(--tmyl-space-1)',
    1.5: 'var(--tmyl-space-1_5)',
    2: 'var(--tmyl-space-2)',
    2.5: 'var(--tmyl-space-2_5)',
    3: 'var(--tmyl-space-3)',
    3.5: 'var(--tmyl-space-3_5)',
    4: 'var(--tmyl-space-4)',
    5: 'var(--tmyl-space-5)',
    6: 'var(--tmyl-space-6)',
    7: 'var(--tmyl-space-7)',
    8: 'var(--tmyl-space-8)',
    9: 'var(--tmyl-space-9)',
    10: 'var(--tmyl-space-10)',
    11: 'var(--tmyl-space-11)',
    12: 'var(--tmyl-space-12)',
    14: 'var(--tmyl-space-14)',
    16: 'var(--tmyl-space-16)',
    20: 'var(--tmyl-space-20)',
    24: 'var(--tmyl-space-24)',
    28: 'var(--tmyl-space-28)',
    32: 'var(--tmyl-space-32)'
  },

  // Size scales - standardized sizing for all atoms
  sizes: {
    xs: {
      height: '1.5rem',    // 24px
      padding: '0.25rem 0.5rem',
      fontSize: 'var(--tmyl-text-xs)',
      iconSize: '0.75rem'
    },
    sm: {
      height: '2rem',      // 32px
      padding: '0.375rem 0.75rem',
      fontSize: 'var(--tmyl-text-sm)',
      iconSize: '1rem'
    },
    md: {
      height: '2.5rem',    // 40px
      padding: '0.5rem 1rem',
      fontSize: 'var(--tmyl-text-base)',
      iconSize: '1.25rem'
    },
    lg: {
      height: '3rem',      // 48px
      padding: '0.75rem 1.5rem',
      fontSize: 'var(--tmyl-text-lg)',
      iconSize: '1.5rem'
    },
    xl: {
      height: '3.5rem',    // 56px
      padding: '1rem 2rem',
      fontSize: 'var(--tmyl-text-xl)',
      iconSize: '1.75rem'
    }
  },

  // Typography system - shared font properties
  typography: {
    fontFamily: {
      sans: 'var(--tmyl-font-sans)',
      mono: 'var(--tmyl-font-mono)'
    },
    fontSize: {
      xs: 'var(--tmyl-text-xs)',
      sm: 'var(--tmyl-text-sm)',
      base: 'var(--tmyl-text-base)',
      lg: 'var(--tmyl-text-lg)',
      xl: 'var(--tmyl-text-xl)',
      '2xl': 'var(--tmyl-text-2xl)',
      '3xl': 'var(--tmyl-text-3xl)',
      '4xl': 'var(--tmyl-text-4xl)'
    },
    fontWeight: {
      normal: 'var(--tmyl-font-normal)',
      medium: 'var(--tmyl-font-medium)',
      semibold: 'var(--tmyl-font-semibold)',
      bold: 'var(--tmyl-font-bold)'
    },
    lineHeight: {
      tight: 'var(--tmyl-leading-tight)',
      normal: 'var(--tmyl-leading-normal)',
      relaxed: 'var(--tmyl-leading-relaxed)'
    }
  },

  // Border radius system
  borderRadius: {
    none: '0',
    sm: 'var(--tmyl-radius-sm)',
    md: 'var(--tmyl-radius-md)',
    lg: 'var(--tmyl-radius-lg)',
    xl: 'var(--tmyl-radius-xl)',
    full: '9999px'
  },

  // Shadow system
  shadows: {
    none: 'none',
    xs: 'var(--tmyl-shadow-xs)',
    sm: 'var(--tmyl-shadow-sm)',
    md: 'var(--tmyl-shadow-md)',
    lg: 'var(--tmyl-shadow-lg)',
    xl: 'var(--tmyl-shadow-xl)',
    inner: 'var(--tmyl-shadow-inner)'
  },

  // Animation system
  animations: {
    transition: {
      fast: 'var(--tmyl-transition-fast)',
      normal: 'var(--tmyl-transition-normal)',
      slow: 'var(--tmyl-transition-slow)'
    },
    easing: {
      ease: 'ease',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
  },

  // Z-index system
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800
  }
};

// Shared variant configurations
export const sharedVariants = {
  // Standard variants that apply across all atoms
  primary: {
    backgroundColor: designTokens.colors.primary[600],
    color: designTokens.colors.primary.contrast,
    borderColor: designTokens.colors.primary[600]
  },
  secondary: {
    backgroundColor: designTokens.colors.neutral[100],
    color: designTokens.colors.text.primary,
    borderColor: designTokens.colors.border.primary
  },
  success: {
    backgroundColor: designTokens.colors.semantic.success,
    color: designTokens.colors.text.inverse,
    borderColor: designTokens.colors.semantic.success
  },
  warning: {
    backgroundColor: designTokens.colors.semantic.warning,
    color: designTokens.colors.text.inverse,
    borderColor: designTokens.colors.semantic.warning
  },
  error: {
    backgroundColor: designTokens.colors.semantic.error,
    color: designTokens.colors.text.inverse,
    borderColor: designTokens.colors.semantic.error
  },
  ghost: {
    backgroundColor: 'transparent',
    color: designTokens.colors.text.primary,
    borderColor: 'transparent'
  },
  outline: {
    backgroundColor: 'transparent',
    color: designTokens.colors.text.primary,
    borderColor: designTokens.colors.border.primary
  }
};

// State configurations
export const sharedStates = {
  hover: {
    transform: 'translateY(-1px)',
    transition: designTokens.animations.transition.fast
  },
  focus: {
    outline: 'none',
    borderColor: designTokens.colors.border.focus,
    boxShadow: `0 0 0 3px ${designTokens.colors.primary[100]}`
  },
  active: {
    transform: 'translateY(0)',
    transition: 'none'
  },
  disabled: {
    opacity: '0.5',
    cursor: 'not-allowed',
    pointerEvents: 'none'
  },
  loading: {
    cursor: 'wait',
    position: 'relative'
  }
};

export default designTokens;
