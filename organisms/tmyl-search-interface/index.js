/**
 * Search Interface Module - Modular Architecture
 * Exports all search interface components with proper separation of concerns
 */

// Main component
export { TmylSearchInterface } from './tmyl-search-interface-refactored.js';

// Templates
export {
  renderSearchHeader,
  renderFilters,
  renderResultsSection,
  renderResultsHeader,
  renderViewModeToggle,
  renderSortControls,
  renderResults,
  renderEmptyState,
  renderLoadingCards,
  renderPagination,
  renderBulkActions
} from './templates/search-interface-templates.js';

// Controller
export { SearchInterfaceController, searchInterfaceUtils } from './controllers/search-interface-controller.js';

// Configuration
export {
  defaultSearchInterfaceProps,
  searchInterfaceConfig,
  searchInterfaceFilters,
  searchInterfaceValidation,
  searchInterfaceThemes,
  searchInterfaceEvents
} from './config/search-interface-config.js';

/**
 * Convenience function to create a search interface
 */
export function createSearchInterface(props = {}) {
  const element = document.createElement('tmyl-search-interface');

  // Set properties
  Object.keys(props).forEach(key => {
    if (key in element) {
      element[key] = props[key];
    } else {
      // Convert camelCase to kebab-case for attributes
      const attrName = key.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
      element.setAttribute(attrName, props[key]);
    }
  });

  return element;
}
