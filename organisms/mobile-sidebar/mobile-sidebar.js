/**
 * Mobile Sidebar - Main Module
 * Coordinated mobile sidebar system with navigation, templates, and animations
 */

import SidebarController from './controllers/sidebar-controller.js';
import NavigationController from './controllers/navigation-controller.js';
import TemplateController from './controllers/template-controller.js';
import {
  SIDEBAR_CONFIG,
  TRADING_PORTAL_PRESETS,
  HEADER_PRESETS,
  FOOTER_PRESETS,
  EVENT_TYPES
} from './config/sidebar-config.js';

class MobileSidebar {
  constructor(options = {}) {
    this.options = {
      position: SIDEBAR_CONFIG.positions.LEFT,
      width: SIDEBAR_CONFIG.dimensions.DEFAULT_WIDTH,
      backdrop: true,
      closeOnBackdrop: true,
      closeOnEscape: true,
      closeOnNavigation: true,
      animationDuration: SIDEBAR_CONFIG.animations.DURATION,
      swipeGestures: true,
      focusManagement: true,
      enableNavigation: true,
      enableTemplates: true,
      autoLoadStyles: true,
      preset: null,
      headerPreset: null,
      footerPreset: null,
      navigationPreset: null,
      ...options
    };

    this.initialized = false;
    this.controllers = {};
    this.listeners = new Map();

    if (this.options.autoLoadStyles) {
      this.loadStyles();
    }

    this.initialize();
  }

  /**
   * Initialize the mobile sidebar system
   */
  async initialize() {
    if (this.initialized) return;

    try {
      // Initialize core sidebar controller
      this.controllers.sidebar = new SidebarController({
        position: this.options.position,
        width: this.options.width,
        backdrop: this.options.backdrop,
        closeOnBackdrop: this.options.closeOnBackdrop,
        closeOnEscape: this.options.closeOnEscape,
        animationDuration: this.options.animationDuration,
        swipeGestures: this.options.swipeGestures,
        focusManagement: this.options.focusManagement
      });

      // Initialize navigation controller
      if (this.options.enableNavigation) {
        this.controllers.navigation = new NavigationController(this.controllers.sidebar, {
          closeOnNavigation: this.options.closeOnNavigation
        });

        this.bindNavigationEvents();
      }

      // Initialize template controller
      if (this.options.enableTemplates) {
        this.controllers.template = new TemplateController(this.controllers.sidebar);
        this.bindTemplateEvents();
      }

      // Bind core events
      this.bindCoreEvents();

      // Apply presets if specified
      await this.applyPresets();

      this.initialized = true;
      this.emit(EVENT_TYPES.SIDEBAR_OPENING, { sidebar: this });

    } catch (error) {
      console.error('Failed to initialize mobile sidebar:', error);
      throw error;
    }
  }

  /**
   * Load CSS styles
   */
  async loadStyles() {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/ui-components/organisms/mobile-sidebar/styles/mobile-sidebar.css';

      link.onload = resolve;
      link.onerror = () => {
        console.warn('Failed to load mobile sidebar styles, using fallback');
        resolve(); // Don't fail initialization
      };

      document.head.appendChild(link);
    });
  }

  /**
   * Apply configuration presets
   */
  async applyPresets() {
    // Apply navigation preset
    if (this.options.navigationPreset && this.controllers.navigation) {
      this.controllers.navigation.loadPreset(this.options.navigationPreset);
    }

    // Apply header preset
    if (this.options.headerPreset && this.controllers.template) {
      await this.controllers.template.setHeaderPreset(this.options.headerPreset);
    }

    // Apply footer preset
    if (this.options.footerPreset && this.controllers.template) {
      await this.controllers.template.setFooterPreset(this.options.footerPreset);
    }
  }

  /**
   * Bind core sidebar events
   */
  bindCoreEvents() {
    const sidebar = this.controllers.sidebar;

    sidebar.on(EVENT_TYPES.SIDEBAR_OPENED, (data) => {
      this.emit(EVENT_TYPES.SIDEBAR_OPENED, data);
    });

    sidebar.on(EVENT_TYPES.SIDEBAR_CLOSED, (data) => {
      this.emit(EVENT_TYPES.SIDEBAR_CLOSED, data);
    });

    sidebar.on(EVENT_TYPES.SIDEBAR_OPENING, (data) => {
      this.emit(EVENT_TYPES.SIDEBAR_OPENING, data);
    });

    sidebar.on(EVENT_TYPES.SIDEBAR_CLOSING, (data) => {
      this.emit(EVENT_TYPES.SIDEBAR_CLOSING, data);
    });

    sidebar.on(EVENT_TYPES.SWIPE_DETECTED, (data) => {
      this.emit(EVENT_TYPES.SWIPE_DETECTED, data);
    });

    sidebar.on(EVENT_TYPES.RESIZE_DETECTED, (data) => {
      this.emit(EVENT_TYPES.RESIZE_DETECTED, data);
    });
  }

  /**
   * Bind navigation events
   */
  bindNavigationEvents() {
    const sidebar = this.controllers.sidebar;

    sidebar.on(EVENT_TYPES.NAV_ITEM_CLICKED, (data) => {
      this.emit(EVENT_TYPES.NAV_ITEM_CLICKED, data);
      this.handleNavItemClick(data);
    });

    sidebar.on(EVENT_TYPES.NAV_GROUP_TOGGLED, (data) => {
      this.emit(EVENT_TYPES.NAV_GROUP_TOGGLED, data);
    });

    // Handle action events
    sidebar.on(/^action:/, (data) => {
      this.handleAction(data);
    });
  }

  /**
   * Bind template events
   */
  bindTemplateEvents() {
    const sidebar = this.controllers.sidebar;

    sidebar.on(EVENT_TYPES.HEADER_ACTION, (data) => {
      this.emit(EVENT_TYPES.HEADER_ACTION, data);
    });

    sidebar.on(EVENT_TYPES.FOOTER_ACTION, (data) => {
      this.emit(EVENT_TYPES.FOOTER_ACTION, data);
      this.handleFooterAction(data);
    });
  }

  /**
   * Handle navigation item click
   */
  handleNavItemClick(data) {
    // Default handling - can be overridden by event listeners
    if (data.item.type === 'button' && data.item.action) {
      this.emit(`action:${data.item.action}`, data);
    }
  }

  /**
   * Handle footer actions
   */
  handleFooterAction(data) {
    // Default handling for common actions
    switch (data.action) {
    case 'toggle-dark-mode':
      this.toggleDarkMode();
      break;
    case 'show-feedback':
      this.emit('action:show-feedback', data);
      break;
    }
  }

  /**
   * Handle generic actions
   */
  handleAction(data) {
    // Default handling for common actions
    switch (data.action) {
    case 'logout':
      this.emit('action:logout', data);
      break;
    case 'quick-trade':
      this.emit('action:quick-trade', data);
      break;
    }
  }

  /**
   * Toggle dark mode
   */
  toggleDarkMode() {
    document.documentElement.classList.toggle('dark-mode');
    this.emit('action:dark-mode-toggled', {
      isDark: document.documentElement.classList.contains('dark-mode')
    });
  }

  // ================================
  // Public API Methods
  // ================================

  /**
   * Open sidebar
   */
  async open() {
    return await this.controllers.sidebar.open();
  }

  /**
   * Close sidebar
   */
  async close() {
    return await this.controllers.sidebar.close();
  }

  /**
   * Toggle sidebar
   */
  async toggle() {
    return await this.controllers.sidebar.toggle();
  }

  /**
   * Check if sidebar is open
   */
  isOpen() {
    return this.controllers.sidebar.isOpen;
  }

  /**
   * Get sidebar state
   */
  getState() {
    return this.controllers.sidebar.getState();
  }

  // ================================
  // Navigation API
  // ================================

  /**
   * Set navigation items
   */
  setNavigationItems(items) {
    if (!this.controllers.navigation) {
      throw new Error('Navigation controller not initialized');
    }
    return this.controllers.navigation.setItems(items);
  }

  /**
   * Load navigation preset
   */
  loadNavigationPreset(presetName) {
    if (!this.controllers.navigation) {
      throw new Error('Navigation controller not initialized');
    }
    return this.controllers.navigation.loadPreset(presetName);
  }

  /**
   * Add navigation item
   */
  addNavigationItem(item) {
    if (!this.controllers.navigation) {
      throw new Error('Navigation controller not initialized');
    }
    return this.controllers.navigation.addItem(item);
  }

  /**
   * Remove navigation item
   */
  removeNavigationItem(itemId) {
    if (!this.controllers.navigation) {
      throw new Error('Navigation controller not initialized');
    }
    return this.controllers.navigation.removeItem(itemId);
  }

  /**
   * Set active navigation item
   */
  setActiveItem(itemId) {
    if (!this.controllers.navigation) {
      throw new Error('Navigation controller not initialized');
    }
    return this.controllers.navigation.setActive(itemId);
  }

  /**
   * Set badge on navigation item
   */
  setBadge(itemId, badgeText) {
    if (!this.controllers.navigation) {
      throw new Error('Navigation controller not initialized');
    }
    return this.controllers.navigation.setBadge(itemId, badgeText);
  }

  /**
   * Remove badge from navigation item
   */
  removeBadge(itemId) {
    if (!this.controllers.navigation) {
      throw new Error('Navigation controller not initialized');
    }
    return this.controllers.navigation.removeBadge(itemId);
  }

  /**
   * Enable/disable navigation item
   */
  setItemDisabled(itemId, disabled = true) {
    if (!this.controllers.navigation) {
      throw new Error('Navigation controller not initialized');
    }
    return this.controllers.navigation.setDisabled(itemId, disabled);
  }

  /**
   * Get navigation items
   */
  getNavigationItems() {
    if (!this.controllers.navigation) return [];
    return this.controllers.navigation.getItems();
  }

  /**
   * Get active navigation item
   */
  getActiveItem() {
    if (!this.controllers.navigation) return null;
    return this.controllers.navigation.getActiveItem();
  }

  // ================================
  // Template API
  // ================================

  /**
   * Set header template
   */
  async setHeader(templateType, data = {}) {
    if (!this.controllers.template) {
      throw new Error('Template controller not initialized');
    }
    return await this.controllers.template.setHeader(templateType, data);
  }

  /**
   * Set footer template
   */
  async setFooter(templateType, data = {}) {
    if (!this.controllers.template) {
      throw new Error('Template controller not initialized');
    }
    return await this.controllers.template.setFooter(templateType, data);
  }

  /**
   * Set header from preset
   */
  async setHeaderPreset(presetName) {
    if (!this.controllers.template) {
      throw new Error('Template controller not initialized');
    }
    return await this.controllers.template.setHeaderPreset(presetName);
  }

  /**
   * Set footer from preset
   */
  async setFooterPreset(presetName) {
    if (!this.controllers.template) {
      throw new Error('Template controller not initialized');
    }
    return await this.controllers.template.setFooterPreset(presetName);
  }

  /**
   * Update header data
   */
  updateHeaderData(newData) {
    if (!this.controllers.template) {
      throw new Error('Template controller not initialized');
    }
    return this.controllers.template.updateHeaderData(newData);
  }

  /**
   * Update footer data
   */
  updateFooterData(newData) {
    if (!this.controllers.template) {
      throw new Error('Template controller not initialized');
    }
    return this.controllers.template.updateFooterData(newData);
  }

  /**
   * Clear header
   */
  clearHeader() {
    if (!this.controllers.template) return false;
    return this.controllers.template.clearHeader();
  }

  /**
   * Clear footer
   */
  clearFooter() {
    if (!this.controllers.template) return false;
    return this.controllers.template.clearFooter();
  }

  // ================================
  // Configuration API
  // ================================

  /**
   * Update sidebar options
   */
  updateOptions(newOptions) {
    this.options = { ...this.options, ...newOptions };

    if (this.controllers.sidebar) {
      this.controllers.sidebar.updateOptions(newOptions);
    }
  }

  /**
   * Get available presets
   */
  getAvailablePresets() {
    return {
      navigation: Object.keys(TRADING_PORTAL_PRESETS),
      header: Object.keys(HEADER_PRESETS),
      footer: Object.keys(FOOTER_PRESETS)
    };
  }

  // ================================
  // Event System
  // ================================

  /**
   * Add event listener
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
    return this;
  }

  /**
   * Remove event listener
   */
  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
    return this;
  }

  /**
   * Emit event
   */
  emit(event, data) {
    // Handle regex event patterns
    if (typeof event === 'string' && event.includes(':')) {
      this.listeners.forEach((callbacks, listenerEvent) => {
        if (listenerEvent instanceof RegExp && listenerEvent.test(event)) {
          callbacks.forEach(callback => {
            try {
              callback(data);
            } catch (error) {
              console.error(`Error in event listener for ${event}:`, error);
            }
          });
        }
      });
    }

    // Handle exact event matches
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  // ================================
  // Utility Methods
  // ================================

  /**
   * Get sidebar elements
   */
  get elements() {
    return this.controllers.sidebar?.elements || {};
  }

  /**
   * Get controllers (for advanced usage)
   */
  get controllerInstances() {
    return this.controllers;
  }

  /**
   * Destroy sidebar and cleanup
   */
  destroy() {
    // Destroy controllers
    Object.values(this.controllers).forEach(controller => {
      if (typeof controller.destroy === 'function') {
        controller.destroy();
      }
    });

    // Clear references
    this.controllers = {};
    this.listeners.clear();
    this.initialized = false;

    this.emit(EVENT_TYPES.SIDEBAR_CLOSED);
  }
}

// ================================
// Sidebar Manager
// ================================

/**
 * Mobile Sidebar Manager
 * Manages multiple sidebars and provides global controls
 */
class MobileSidebarManager {
  constructor() {
    this.sidebars = new Map();
    this.activeSidebar = null;
  }

  /**
   * Register a sidebar
   */
  register(id, sidebar) {
    this.sidebars.set(id, sidebar);

    // Listen for open events
    sidebar.on(EVENT_TYPES.SIDEBAR_OPENED, () => {
      this.activeSidebar = id;
      // Close other sidebars
      this.sidebars.forEach((otherSidebar, otherId) => {
        if (otherId !== id && otherSidebar.isOpen()) {
          otherSidebar.close();
        }
      });
    });

    sidebar.on(EVENT_TYPES.SIDEBAR_CLOSED, () => {
      if (this.activeSidebar === id) {
        this.activeSidebar = null;
      }
    });

    return this;
  }

  /**
   * Get sidebar by ID
   */
  get(id) {
    return this.sidebars.get(id);
  }

  /**
   * Close all sidebars
   */
  closeAll() {
    this.sidebars.forEach(sidebar => {
      if (sidebar.isOpen()) {
        sidebar.close();
      }
    });
  }

  /**
   * Get active sidebar ID
   */
  getActive() {
    return this.activeSidebar;
  }

  /**
   * Remove sidebar
   */
  remove(id) {
    const sidebar = this.sidebars.get(id);
    if (sidebar) {
      sidebar.destroy();
      this.sidebars.delete(id);

      if (this.activeSidebar === id) {
        this.activeSidebar = null;
      }
    }
  }

  /**
   * Destroy all sidebars
   */
  destroy() {
    this.sidebars.forEach((sidebar, id) => {
      this.remove(id);
    });
  }
}

// Export classes
export default MobileSidebar;
export { MobileSidebarManager };

// Create global instances for easy access
if (typeof window !== 'undefined') {
  window.TamylaMobileSidebar = MobileSidebar;
  window.TamylaSidebarManager = new MobileSidebarManager();
}
