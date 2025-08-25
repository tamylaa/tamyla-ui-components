/**
 * React Components Export
 * Pre-built React wrappers for all Tamyla UI components
 */

import { createReactWrapper } from './wrapper.js';

// Atom Components
export const Button = createReactWrapper(
  () => import('../../atoms/button/button-system.js'),
  { variant: 'primary' }
);

export const Input = createReactWrapper(
  () => import('../../atoms/input/input-system.js'),
  { type: 'text' }
);

export const Card = createReactWrapper(
  () => import('../../atoms/card/card-system.js'),
  {}
);

// Molecule Components
export const ContentCard = createReactWrapper(
  () => import('../../molecules/content-card/content-card-system.js'),
  {}
);

export const SearchBar = createReactWrapper(
  () => import('../../molecules/search-bar/search-bar-system.js'),
  {}
);

// Application Components
export const EnhancedSearch = createReactWrapper(
  () => import('../../applications/enhanced-search/enhanced-search-system.js'),
  {
    features: {
      voiceSearch: true,
      smartFilters: true,
      realTimeResults: true
    }
  }
);

export const CampaignSelector = createReactWrapper(
  () => import('../../applications/campaign-selector/campaign-selector-system.js'),
  {
    maxSelections: 10,
    showPerformanceInsights: true
  }
);

export const ContentManager = createReactWrapper(
  () => import('../../applications/content-manager/content-manager-system.js'),
  {
    selectionMode: true,
    showUpload: true
  }
);

// Custom React Components with enhanced integration
export function TamylaButton({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  ...props 
}) {
  const buttonRef = useRef(null);

  const handleClick = useCallback((e) => {
    onClick?.(e);
  }, [onClick]);

  return (
    <Button
      ref={buttonRef}
      variant={variant}
      size={size}
      disabled={disabled}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Button>
  );
}

export function TamylaCampaignSelector({
  onSelectionChanged,
  maxSelections = 10,
  enableRecommendations = true,
  ...props
}) {
  const selectorRef = useRef(null);

  const handleMount = useCallback((instance) => {
    if (instance && onSelectionChanged) {
      instance.on('selectionChanged', onSelectionChanged);
    }
  }, [onSelectionChanged]);

  return (
    <CampaignSelector
      ref={selectorRef}
      maxSelections={maxSelections}
      enableRecommendations={enableRecommendations}
      onMount={handleMount}
      {...props}
    />
  );
}

// Export wrapper utilities
export { 
  createReactWrapper, 
  useTamylaComponent, 
  TamylaUIProvider, 
  useTamylaUI 
} from './wrapper.js';

// Default export for convenience
export default {
  // Atoms
  Button,
  Input,
  Card,
  
  // Molecules
  ContentCard,
  SearchBar,
  
  // Applications
  EnhancedSearch,
  CampaignSelector,
  ContentManager,
  
  // Enhanced Components
  TamylaButton,
  TamylaCampaignSelector,
  
  // Utilities
  createReactWrapper,
  useTamylaComponent,
  TamylaUIProvider,
  useTamylaUI
};
