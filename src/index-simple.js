/**
 * Tamyla UI Components - Main Entry Point
 * Simplified imports for working build system
 */

/* eslint-disable no-console */

// Import the main UI system from root
export { default as TamylaUISystem } from '../tamyla-ui-system.js';

// Conditional exports using dynamic imports to preserve the original try/catch behavior
// This approach allows for optional components while being ESLint-friendly

// Create a module loader that handles optional imports
const optionalExports = {};

// Atoms - Load conditionally
try {
  const { ButtonFactory } = await import('../atoms/button/button-system.js');
  optionalExports.ButtonFactory = ButtonFactory;
} catch (e) {
  console.warn('ButtonFactory not available:', e.message);
}

try {
  const { InputFactory } = await import('../atoms/input/input-system.js');
  optionalExports.InputFactory = InputFactory;
} catch (e) {
  console.warn('InputFactory not available:', e.message);
}

try {
  const { CardFactory } = await import('../atoms/card/card-system.js');
  optionalExports.CardFactory = CardFactory;
} catch (e) {
  console.warn('CardFactory not available:', e.message);
}

// Molecules
try {
  const { ContentCardFactory } = await import('../molecules/content-card/content-card-system.js');
  optionalExports.ContentCardFactory = ContentCardFactory;
} catch (e) {
  console.warn('ContentCardFactory not available:', e.message);
}

// Applications
try {
  const { EnhancedSearchApplicationFactory } = await import('../applications/enhanced-search/enhanced-search-system.js');
  optionalExports.EnhancedSearchApplicationFactory = EnhancedSearchApplicationFactory;
} catch (e) {
  console.warn('EnhancedSearchApplicationFactory not available:', e.message);
}

try {
  const { CampaignSelectorSystem } = await import('../applications/campaign-selector/campaign-selector-system.js');
  optionalExports.CampaignSelectorSystem = CampaignSelectorSystem;
} catch (e) {
  console.warn('CampaignSelectorSystem not available:', e.message);
}

try {
  const { ContentManagerApplicationFactory } = await import('../applications/content-manager/content-manager-system.js');
  optionalExports.ContentManagerApplicationFactory = ContentManagerApplicationFactory;
} catch (e) {
  console.warn('ContentManagerApplicationFactory not available:', e.message);
}

// Export all successfully loaded components
export const {
  ButtonFactory,
  InputFactory,
  CardFactory,
  ContentCardFactory,
  EnhancedSearchApplicationFactory,
  CampaignSelectorSystem,
  ContentManagerApplicationFactory
} = optionalExports;

// Default export
export default {
  name: '@tamyla/ui-components',
  version: '1.0.0',
  description: 'Modular UI component system with atomic design principles',
  availableComponents: Object.keys(optionalExports)
};
