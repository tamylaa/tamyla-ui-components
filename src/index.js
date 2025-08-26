/**
 * Main entry point for Enhanced Tamyla UI Components v2.0.0
 * World-class components integrating Trading Portal sophistication
 * Features: micro-interactions, accessibility excellence, premium polish
 */

// Core utilities and enhanced design system
export * from '../core/design-tokens.js';
export * from '../core/shared-utilities.js';
export { default as ReactPatternAdapters } from '../core/react-pattern-adapters.js';

// Enhanced Atomic Design System Exports
export * from '../atoms/atom-factory.js';
export * from '../molecules/molecule-factory.js';
export * from '../organisms/organism-factory.js';

// Enhanced Individual Atom Components with Trading Portal patterns
export { ButtonFactory } from '../atoms/button/button-system.js';
export { InputFactory } from '../atoms/input/input-system.js';
export { CardFactory } from '../atoms/card/card-system.js';
export { StatusIndicatorFactory, statusIndicatorFactory } from '../atoms/status-indicator/status-indicator-system.js';

// Enhanced Molecule Components with sophisticated interactions
export { ActionCardFactory, actionCardFactory } from '../molecules/action-card/action-card-system.js';

// Application Components
export { EnhancedSearchApplicationFactory } from '../applications/enhanced-search/enhanced-search-system.js';
export { CampaignSelectorSystem } from '../applications/campaign-selector/campaign-selector-system.js';
export { ContentManagerApplicationFactory } from '../applications/content-manager/content-manager-system.js';

// Legacy React Pattern Components (for backward compatibility)
// Note: JSX components excluded from vanilla JS build - available separately as React components
// export { 
//   TamylaEmailRecipients, // JSX - excluded from build
//   TamylaFileList,        // JSX - excluded from build
//   TamylaModal,           // JSX - excluded from build
//   TamylaNotification     // JSX - excluded from build
// } from '../legacy/index.js';

// Enhanced Main UI System Factory
export { default as TamylaUISystem } from '../tamyla-ui-system.js';

// Enhanced Version information
export const VERSION = '2.0.0'; // Major upgrade with Trading Portal integration
export const BUILD_DATE = new Date().toISOString();
export const FEATURES = [
  'Trading Portal micro-interactions',
  'Enhanced accessibility (WCAG 2.1 AA)', 
  'Gamification components',
  'Real-time status indicators',
  'Premium visual polish',
  'Mobile-optimized touch targets',
  'Reduced motion support',
  'High contrast compatibility'
];

// Enhanced Component registry for dynamic loading
export const COMPONENT_REGISTRY = {
  // Enhanced Atoms with Trading Portal patterns
  atoms: {
    Button: () => import('../atoms/button/button-system.js'),
    Input: () => import('../atoms/input/input-system.js'),
    Card: () => import('../atoms/card/card-system.js'),
    StatusIndicator: () => import('../atoms/status-indicator/status-indicator-system.js')
  },
  
  // Enhanced Molecules with sophisticated interactions
  molecules: {
    ActionCard: () => import('../molecules/action-card/action-card-system.js')
  },
  
  // Enhanced Applications with complete workflows
  applications: {
    EnhancedSearch: () => import('../applications/enhanced-search/enhanced-search-system.js'),
    CampaignSelector: () => import('../applications/campaign-selector/campaign-selector-system.js'),
    ContentManager: () => import('../applications/content-manager/content-manager-system.js')
  }
};

// Trading Portal Integration Utilities
export const TradingPortalIntegration = {
  /**
   * Initialize enhanced components with Trading Portal patterns
   */
  initialize(config = {}) {
    const defaultConfig = {
      enableMicroInteractions: true,
      enableAnalytics: false,
      enableHapticFeedback: false,
      theme: 'light',
      accessibility: {
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        highContrast: window.matchMedia('(prefers-contrast: high)').matches,
        largeText: window.matchMedia('(prefers-font-size: large)').matches
      }
    };

    const finalConfig = { ...defaultConfig, ...config };
    
    // Set global configuration
    window.tamylaUIConfig = finalConfig;
    
    // Initialize CSS custom properties based on config
    this.applyThemeConfiguration(finalConfig);
    
    return finalConfig;
  },

  /**
   * Apply theme configuration to CSS custom properties
   */
  applyThemeConfiguration(config) {
    const root = document.documentElement;
    
    if (config.accessibility.reducedMotion) {
      root.style.setProperty('--tmyl-transition-fast', 'none');
      root.style.setProperty('--tmyl-transition-base', 'none');
    }
    
    if (config.accessibility.highContrast) {
      root.style.setProperty('--tmyl-shadow-focus', '0 0 0 3px #ffff00');
    }
    
    if (config.theme === 'dark') {
      // Apply dark theme variables
      root.style.setProperty('--tmyl-action-card-bg', '#1f1f1f');
      root.style.setProperty('--tmyl-button-primary-bg', '#4285f4');
    }
  },

  /**
   * Create enhanced component with Trading Portal patterns
   */
  createEnhanced(componentType, factory, props = {}) {
    const config = window.tamylaUIConfig || {};
    
    const enhancedProps = {
      ...props,
      elevation: config.enableMicroInteractions !== false,
      rippleEffect: config.enableMicroInteractions !== false,
      analytics: config.enableAnalytics || false,
      hapticFeedback: config.enableHapticFeedback || false,
      accessibility: config.accessibility || {}
    };

    return factory.create(enhancedProps);
  }
};

// Convenience functions for common Trading Portal patterns
export const createTradingPortalButton = (props) => {
  const buttonFactory = new ButtonFactory();
  return TradingPortalIntegration.createEnhanced('button', buttonFactory, props);
};

export const createTradingPortalActionCard = (props) => {
  return TradingPortalIntegration.createEnhanced('actionCard', actionCardFactory, props);
};

export const createTradingPortalStatus = (props) => {
  return TradingPortalIntegration.createEnhanced('status', statusIndicatorFactory, props);
};

// Dynamic component loader
export async function loadComponent(category, name) {
  const loader = COMPONENT_REGISTRY[category]?.[name];
  if (!loader) {
    throw new Error(`Component ${category}/${name} not found in registry`);
  }
  
  try {
    const module = await loader();
    return module.default || module;
  } catch (error) {
    console.error(`Failed to load component ${category}/${name}:`, error);
    throw error;
  }
}

// Utility function to get all available components
export function getAvailableComponents() {
  return Object.keys(COMPONENT_REGISTRY).reduce((acc, category) => {
    acc[category] = Object.keys(COMPONENT_REGISTRY[category]);
    return acc;
  }, {});
}

// Configuration and theming utilities  
export const TAMYLA_UI_CONFIG = {
  theme: {
    primary: '#3B82F6',
    secondary: '#64748B',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444'
  },
  
  breakpoints: {
    sm: '640px',
    md: '768px', 
    lg: '1024px',
    xl: '1280px'
  },
  
  animation: {
    duration: '200ms',
    easing: 'ease-in-out'
  }
};

// Global initialization function
export function initializeTamylaUI(config = {}) {
  // Merge user config with defaults
  const mergedConfig = { ...TAMYLA_UI_CONFIG, ...config };
  
  // Apply global CSS custom properties
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    
    // Apply theme colors
    Object.entries(mergedConfig.theme).forEach(([key, value]) => {
      root.style.setProperty(`--tamyla-${key}`, value);
    });
    
    // Apply animation settings
    root.style.setProperty('--tamyla-animation-duration', mergedConfig.animation.duration);
    root.style.setProperty('--tamyla-animation-easing', mergedConfig.animation.easing);
  }
  
  return mergedConfig;
}

// Default export for UMD builds
export default {
  // Core
  DesignTokens: () => import('../core/design-tokens.js'),
  SharedUtilities: () => import('../core/shared-utilities.js'),
  ReactPatternAdapters: () => import('../core/react-pattern-adapters.js'),
  
  // Factories
  AtomFactory: () => import('../atoms/atom-factory.js'),
  MoleculeFactory: () => import('../molecules/molecule-factory.js'),
  OrganismFactory: () => import('../organisms/organism-factory.js'),
  
  // Enhanced components
  ButtonFactory: () => import('../atoms/button/button-system.js'),
  ActionCardFactory: () => import('../molecules/action-card/action-card-system.js'),
  StatusIndicatorFactory: () => import('../atoms/status-indicator/status-indicator-system.js'),
  
  // Applications
  EnhancedSearch: () => import('../applications/enhanced-search/enhanced-search-system.js'),
  CampaignSelector: () => import('../applications/campaign-selector/campaign-selector-system.js'),
  ContentManager: () => import('../applications/content-manager/content-manager-system.js'),
  
  // Utilities
  loadComponent,
  getAvailableComponents,
  initializeTamylaUI,
  TradingPortalIntegration,
  
  // Convenience functions
  createTradingPortalButton,
  createTradingPortalActionCard,
  createTradingPortalStatus,
  
  // Metadata
  VERSION,
  BUILD_DATE,
  FEATURES,
  COMPONENT_REGISTRY
};
