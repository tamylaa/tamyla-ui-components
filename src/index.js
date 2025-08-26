/**
 * Main entry point for Tamyla UI Components
 * Provides access to all components and utilities
 */

// Core utilities and design system
export * from '../core/design-tokens.js';
export * from '../core/shared-utilities.js';
export { default as ReactPatternAdapters } from '../core/react-pattern-adapters.js';

// Atomic Design System Exports
export * from '../atoms/atom-factory.js';
export * from '../molecules/molecule-factory.js';
export * from '../organisms/organism-factory.js';

// Individual Atom Components
export { ButtonFactory } from '../atoms/button/button-system.js';
export { InputFactory } from '../atoms/input/input-system.js';
export { CardFactory } from '../atoms/card/card-system.js';

// Individual Molecule Components
export { ContentCardFactory } from './molecules/content-card/content-card-system.js';

// Application Components
export { EnhancedSearchApplicationFactory } from './applications/enhanced-search/enhanced-search-system.js';
export { CampaignSelectorSystem } from './applications/campaign-selector/campaign-selector-system.js';
export { ContentManagerApplicationFactory } from './applications/content-manager/content-manager-system.js';

// Legacy React Pattern Components (for reference)
export { 
  TamylaEmailRecipients,
  TamylaFileList, 
  TamylaModal,
  TamylaNotification
} from './legacy/index.js';

// Main UI System Factory
export { default as TamylaUISystem } from './tamyla-ui-system.js';

// Version information
export const VERSION = '1.0.0';
export const BUILD_DATE = new Date().toISOString();

// Component registry for dynamic loading
export const COMPONENT_REGISTRY = {
  // Atoms
  atoms: {
    Button: () => import('./atoms/button/button-system.js'),
    Input: () => import('./atoms/input/input-system.js'),
    Card: () => import('./atoms/card/card-system.js')
  },
  
  // Molecules  
  molecules: {
    ContentCard: () => import('./molecules/content-card/content-card-system.js'),
    SearchBar: () => import('./molecules/search-bar/search-bar-system.js'),
    EmailRecipients: () => import('./molecules/email-recipients/email-recipients-system.js'),
    FileList: () => import('./molecules/file-list/file-list-system.js'),
    Notification: () => import('./molecules/notification/notification-system.js')
  },
  
  // Applications
  applications: {
    EnhancedSearch: () => import('./applications/enhanced-search/enhanced-search-system.js'),
    CampaignSelector: () => import('./applications/campaign-selector/campaign-selector-system.js'),
    ContentManager: () => import('./applications/content-manager/content-manager-system.js')
  }
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
  DesignTokens: () => import('./core/design-tokens.js'),
  SharedUtilities: () => import('./core/shared-utilities.js'),
  ReactPatternAdapters: () => import('./core/react-pattern-adapters.js'),
  
  // Factories
  AtomFactory: () => import('./atoms/atom-factory.js'),
  MoleculeFactory: () => import('./molecules/molecule-factory.js'),
  OrganismFactory: () => import('./organisms/organism-factory.js'),
  
  // Applications
  EnhancedSearch: () => import('./applications/enhanced-search/enhanced-search-system.js'),
  CampaignSelector: () => import('./applications/campaign-selector/campaign-selector-system.js'),
  ContentManager: () => import('./applications/content-manager/content-manager-system.js'),
  
  // Utilities
  loadComponent,
  getAvailableComponents,
  initializeTamylaUI,
  
  // Metadata
  VERSION,
  BUILD_DATE,
  COMPONENT_REGISTRY
};
