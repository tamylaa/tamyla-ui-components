/**
 * Tamyla Design System - Main Export File
 * Central hub for importing all design system components
 */

// Core Design System
import './core/tokens.css';
import './core/utilities.css';

// Atoms - Basic building blocks
export { TmylButton } from './atoms/tmyl-button.js';
export { TmylInput } from './atoms/tmyl-input.js';
export { TmylCard } from './atoms/tmyl-card.js';

// Molecules - Composed components
export { TmylSearchBar } from './molecules/tmyl-search-bar.js';
export { TmylContentCard } from './molecules/tmyl-content-card.js';

// Organisms - Complete interfaces
export { TmylSearchInterface } from './organisms/tmyl-search-interface.js';

// Enhanced Components - Re-export from src for full feature access
export * from './src/index.js';

// Auto-register all custom elements when this module is imported
console.log('🎨 Tamyla Design System loaded');
console.log('📦 Components: Button, Input, Card, SearchBar, ContentCard, SearchInterface');
console.log('🎯 Atomic Design: Atoms → Molecules → Organisms');
console.log('✨ Ready to build consistent, modular interfaces');

/**
 * Usage Examples:
 * 
 * // Import everything
 * import './ui-components/index.js';
 * 
 * // Or import specific components
 * import { TmylButton, TmylSearchBar } from './ui-components/index.js';
 * 
 * // Use in HTML
 * <tmyl-search-bar voice-enabled></tmyl-search-bar>
 * <tmyl-button variant="primary">Click me</tmyl-button>
 * 
 * // Component composition
 * <tmyl-search-interface 
 *   enable-voice-search
 *   enable-selection
 *   show-filters
 * ></tmyl-search-interface>
 */
