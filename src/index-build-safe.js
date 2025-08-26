/**
 * Build-safe exports for ui-components
 * Only exports components that are confirmed to build without issues
 */

// Core design tokens and utilities
export * from '../core/design-tokens.js';
export * from '../core/shared-utilities.js';

// Individual factory exports that we know exist
export { ButtonFactory } from '../atoms/button/button-system.js';
export { InputFactory } from '../atoms/input/input-system.js';
export { CardFactory } from '../atoms/card/card-system.js';
export { StatusIndicatorFactory } from '../atoms/status-indicator/status-indicator-system.js';

// Action card factory
export { ActionCardFactory } from '../molecules/action-card/action-card-system.js';

// Search bar factory (let's check if this exists)
// export { SearchBarFactory } from '../molecules/search-bar/search-bar-system.js';

// Enhanced Main UI System Factory
export { default as TamylaUISystem } from '../tamyla-ui-system.js';

// Version information
export const VERSION = '2.0.0';
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

// Component registry for dynamic loading
export const COMPONENT_REGISTRY = {
  atoms: {
    Button: () => import('../atoms/button/button-system.js'),
    Input: () => import('../atoms/input/input-system.js'),
    Card: () => import('../atoms/card/card-system.js'),
    StatusIndicator: () => import('../atoms/status-indicator/status-indicator-system.js')
  },
  molecules: {
    ActionCard: () => import('../molecules/action-card/action-card-system.js')
  }
};

// Default export for UMD builds
export default {
  ButtonFactory,
  InputFactory,
  CardFactory,
  StatusIndicatorFactory,
  ActionCardFactory,
  TamylaUISystem,
  VERSION,
  BUILD_DATE,
  FEATURES,
  COMPONENT_REGISTRY
};
