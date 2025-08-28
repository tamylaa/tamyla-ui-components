/**
 * Applications Entry Point
 * Provides access to all application components
 */

// Application imports
export { EnhancedSearchApplicationFactory } from './enhanced-search/enhanced-search-system.js';
export { CampaignSelectorSystem } from './campaign-selector/campaign-selector-system.js';
export { ContentManagerApplicationFactory } from './content-manager/content-manager-system.js';

// Application metadata
export const AVAILABLE_APPLICATIONS = [
  'enhanced-search',
  'campaign-selector',
  'content-manager'
];

// Dynamic application loader
export async function loadApplication(appName) {
  const appMap = {
    'enhanced-search': () => import('./enhanced-search/enhanced-search-system.js'),
    'campaign-selector': () => import('./campaign-selector/campaign-selector-system.js'),
    'content-manager': () => import('./content-manager/content-manager-system.js')
  };

  const loader = appMap[appName];
  if (!loader) {
    throw new Error(`Application '${appName}' not found. Available applications: ${AVAILABLE_APPLICATIONS.join(', ')}`);
  }

  try {
    const module = await loader();
    return module.default || module[Object.keys(module)[0]];
  } catch (error) {
    console.error(`Failed to load application '${appName}':`, error);
    throw error;
  }
}

// Application configuration helpers
export const APPLICATION_CONFIGS = {
  'enhanced-search': {
    name: 'Enhanced Search',
    description: 'Advanced search interface with AI-powered features',
    version: '1.0.0',
    dependencies: ['atoms/button', 'atoms/input', 'molecules/search-bar']
  },

  'campaign-selector': {
    name: 'Campaign Selector',
    description: 'Intelligent campaign content selection system',
    version: '1.0.0',
    dependencies: ['atoms/button', 'atoms/card', 'molecules/content-card']
  },

  'content-manager': {
    name: 'Content Manager',
    description: 'Comprehensive content management application',
    version: '1.0.0',
    dependencies: ['atoms/button', 'atoms/input', 'enhanced-search']
  }
};

// Get application information
export function getApplicationInfo(appName) {
  return APPLICATION_CONFIGS[appName] || null;
}

// Check application dependencies
export function getApplicationDependencies(appName) {
  const config = APPLICATION_CONFIGS[appName];
  return config ? config.dependencies : [];
}

// Batch application loader
export async function loadApplications(appNames) {
  const results = {};

  for (const appName of appNames) {
    try {
      results[appName] = await loadApplication(appName);
    } catch (error) {
      console.warn(`Failed to load application '${appName}':`, error.message);
      results[appName] = null;
    }
  }

  return results;
}

// Application factory function
export async function createApplication(appName, container, options = {}) {
  try {
    const ApplicationClass = await loadApplication(appName);

    if (appName === 'enhanced-search') {
      return ApplicationClass(options);
    } else if (appName === 'campaign-selector') {
      const app = new ApplicationClass(options);
      if (container) app.render(container);
      return app;
    } else if (appName === 'content-manager') {
      return ApplicationClass(options);
    }

    throw new Error(`Unknown application instantiation pattern for '${appName}'`);

  } catch (error) {
    console.error(`Failed to create application '${appName}':`, error);
    throw error;
  }
}

// Default export for UMD compatibility
export default {
  EnhancedSearch: () => import('./enhanced-search/enhanced-search-system.js'),
  CampaignSelector: () => import('./campaign-selector/campaign-selector-system.js'),
  ContentManager: () => import('./content-manager/content-manager-system.js'),
  loadApplication,
  loadApplications,
  createApplication,
  getApplicationInfo,
  getApplicationDependencies,
  AVAILABLE_APPLICATIONS,
  APPLICATION_CONFIGS
};
