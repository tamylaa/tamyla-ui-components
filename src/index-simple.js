/**
 * Tamyla UI Components - Main Entry Point
 * Simplified imports for working build system
 */

// Import the main UI system from root
export { default as TamylaUISystem } from '../tamyla-ui-system.js';

// Import individual component factories that exist
// Atoms
try {
  export { ButtonFactory } from '../atoms/button/button-system.js';
} catch (e) {
  console.warn('ButtonFactory not available');
}

try {
  export { InputFactory } from '../atoms/input/input-system.js';
} catch (e) {
  console.warn('InputFactory not available');
}

try {
  export { CardFactory } from '../atoms/card/card-system.js';
} catch (e) {
  console.warn('CardFactory not available');
}

// Molecules
try {
  export { ContentCardFactory } from '../molecules/content-card/content-card-system.js';
} catch (e) {
  console.warn('ContentCardFactory not available');
}

// Applications
try {
  export { EnhancedSearchApplicationFactory } from '../applications/enhanced-search/enhanced-search-system.js';
} catch (e) {
  console.warn('EnhancedSearchApplicationFactory not available');
}

try {
  export { CampaignSelectorSystem } from '../applications/campaign-selector/campaign-selector-system.js';
} catch (e) {
  console.warn('CampaignSelectorSystem not available');
}

try {
  export { ContentManagerApplicationFactory } from '../applications/content-manager/content-manager-system.js';
} catch (e) {
  console.warn('ContentManagerApplicationFactory not available');
}

// Default export
export default {
  name: '@tamyla/ui-components',
  version: '1.0.0',
  description: 'Modular UI component system with atomic design principles'
};
