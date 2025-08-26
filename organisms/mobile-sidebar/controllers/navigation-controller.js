/**
 * Navigation Controller
 * Handles navigation items, groups, badges, and interactions
 */

import { 
  NAV_ITEM_TYPES, 
  TRADING_PORTAL_PRESETS, 
  VALIDATION_RULES, 
  EVENT_TYPES 
} from '../config/sidebar-config.js';

class NavigationController {
  constructor(sidebarController, options = {}) {
    this.sidebar = sidebarController;
    this.navContainer = null;
    this.items = new Map();
    this.groups = new Map();
    
    this.options = {
      validateItems: true,
      enableGroups: true,
      enableBadges: true,
      enableKeyboardNavigation: true,
      closeOnNavigation: true,
      ...options
    };

    this.initialize();
  }

  /**
   * Initialize navigation controller
   */
  initialize() {
    this.navContainer = this.sidebar.elements.nav;
    if (!this.navContainer) {
      throw new Error('Navigation container not found in sidebar');
    }

    this.attachEventListeners();
    this.setupKeyboardNavigation();
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Navigation item clicks
    this.navContainer.addEventListener('click', (e) => {
      this.handleNavClick(e);
    });

    // Group toggle clicks
    this.navContainer.addEventListener('click', (e) => {
      if (e.target.closest('.nav-group-toggle')) {
        this.handleGroupToggle(e);
      }
    });
  }

  /**
   * Setup keyboard navigation
   */
  setupKeyboardNavigation() {
    if (!this.options.enableKeyboardNavigation) return;

    this.navContainer.addEventListener('keydown', (e) => {
      this.handleKeyNavigation(e);
    });
  }

  /**
   * Handle navigation click
   */
  handleNavClick(e) {
    const navLink = e.target.closest('.nav-link');
    if (!navLink) return;

    const navItem = navLink.closest('.nav-item');
    if (!navItem || navItem.classList.contains('disabled')) {
      e.preventDefault();
      return;
    }

    const itemId = navItem.getAttribute('data-id');
    const itemData = this.items.get(itemId);
    
    if (!itemData) return;

    // Emit navigation event
    const eventData = {
      id: itemId,
      item: itemData,
      href: navLink.getAttribute('href'),
      text: navLink.querySelector('.nav-text')?.textContent || '',
      element: navItem,
      event: e
    };

    this.sidebar.emit(EVENT_TYPES.NAV_ITEM_CLICKED, eventData);

    // Handle different item types
    switch (itemData.type) {
      case NAV_ITEM_TYPES.BUTTON:
        e.preventDefault();
        this.handleButtonClick(itemData, eventData);
        break;
        
      case NAV_ITEM_TYPES.LINK:
        this.handleLinkClick(itemData, eventData);
        break;
    }

    // Set as active if it's a navigation item
    if (itemData.type === NAV_ITEM_TYPES.LINK && !itemData.disabled) {
      this.setActive(itemId);
    }

    // Auto-close on navigation if enabled
    if (this.options.closeOnNavigation && this.shouldAutoClose(itemData, eventData)) {
      setTimeout(() => this.sidebar.close(), 100);
    }
  }

  /**
   * Handle button click
   */
  handleButtonClick(itemData, eventData) {
    if (itemData.action) {
      this.sidebar.emit(`action:${itemData.action}`, {
        ...eventData,
        action: itemData.action
      });
    }
  }

  /**
   * Handle link click
   */
  handleLinkClick(itemData, eventData) {
    // Allow default behavior for links
    // Custom handling can be added by listening to NAV_ITEM_CLICKED event
  }

  /**
   * Handle group toggle
   */
  handleGroupToggle(e) {
    e.preventDefault();
    e.stopPropagation();

    const toggle = e.target.closest('.nav-group-toggle');
    const group = toggle.closest('.nav-group');
    const groupId = group.getAttribute('data-id');
    const groupItems = group.querySelector('.nav-group-items');
    
    if (!groupItems) return;

    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    const newExpanded = !isExpanded;

    toggle.setAttribute('aria-expanded', newExpanded);
    groupItems.style.maxHeight = newExpanded ? `${groupItems.scrollHeight}px` : '0';

    // Update group state
    const groupData = this.groups.get(groupId);
    if (groupData) {
      groupData.expanded = newExpanded;
    }

    this.sidebar.emit(EVENT_TYPES.NAV_GROUP_TOGGLED, {
      groupId,
      expanded: newExpanded,
      group: groupData,
      element: group
    });
  }

  /**
   * Handle keyboard navigation
   */
  handleKeyNavigation(e) {
    const focusedItem = document.activeElement.closest('.nav-item, .nav-group');
    if (!focusedItem) return;

    let targetItem = null;

    switch (e.key) {
      case 'ArrowDown':
        targetItem = this.getNextNavigableItem(focusedItem);
        break;
      case 'ArrowUp':
        targetItem = this.getPreviousNavigableItem(focusedItem);
        break;
      case 'Enter':
      case ' ':
        if (focusedItem.classList.contains('nav-group')) {
          const toggle = focusedItem.querySelector('.nav-group-toggle');
          if (toggle) {
            e.preventDefault();
            toggle.click();
          }
        } else {
          const link = focusedItem.querySelector('.nav-link');
          if (link) {
            e.preventDefault();
            link.click();
          }
        }
        return;
    }

    if (targetItem) {
      e.preventDefault();
      const focusTarget = targetItem.querySelector('.nav-link, .nav-group-toggle');
      if (focusTarget) {
        focusTarget.focus();
      }
    }
  }

  /**
   * Get next navigable item
   */
  getNextNavigableItem(currentItem) {
    const allItems = Array.from(this.navContainer.querySelectorAll('.nav-item, .nav-group'));
    const currentIndex = allItems.indexOf(currentItem);
    
    if (currentIndex === -1) return null;
    
    for (let i = currentIndex + 1; i < allItems.length; i++) {
      const item = allItems[i];
      if (!item.classList.contains('disabled') && this.isItemVisible(item)) {
        return item;
      }
    }
    
    return null;
  }

  /**
   * Get previous navigable item
   */
  getPreviousNavigableItem(currentItem) {
    const allItems = Array.from(this.navContainer.querySelectorAll('.nav-item, .nav-group'));
    const currentIndex = allItems.indexOf(currentItem);
    
    if (currentIndex === -1) return null;
    
    for (let i = currentIndex - 1; i >= 0; i--) {
      const item = allItems[i];
      if (!item.classList.contains('disabled') && this.isItemVisible(item)) {
        return item;
      }
    }
    
    return null;
  }

  /**
   * Check if item is visible (not in collapsed group)
   */
  isItemVisible(item) {
    const parentGroup = item.closest('.nav-group-items');
    if (!parentGroup) return true;
    
    const toggle = parentGroup.parentElement.querySelector('.nav-group-toggle');
    return toggle && toggle.getAttribute('aria-expanded') === 'true';
  }

  /**
   * Should auto-close on navigation
   */
  shouldAutoClose(itemData, eventData) {
    // Don't close for buttons or disabled items
    if (itemData.type === NAV_ITEM_TYPES.BUTTON || itemData.disabled) {
      return false;
    }

    // Don't close for hash links
    const href = eventData.href;
    if (!href || href === '#' || href.startsWith('#')) {
      return false;
    }

    return true;
  }

  /**
   * Load navigation items from preset
   */
  loadPreset(presetName) {
    const preset = TRADING_PORTAL_PRESETS[presetName];
    if (!preset) {
      throw new Error(`Navigation preset not found: ${presetName}`);
    }

    this.setItems(preset.items);
    return this;
  }

  /**
   * Set navigation items
   */
  setItems(items) {
    this.clearItems();
    
    items.forEach(item => {
      if (this.options.validateItems && !this.validateItem(item)) {
        console.warn(`Invalid navigation item:`, item);
        return;
      }
      
      this.addItem(item);
    });
    
    this.renderNavigation();
    return this;
  }

  /**
   * Add single navigation item
   */
  addItem(item) {
    this.items.set(item.id, { ...item });
    
    if (item.type === NAV_ITEM_TYPES.GROUP) {
      this.groups.set(item.id, {
        ...item,
        expanded: item.expanded !== false
      });
    }
    
    return this;
  }

  /**
   * Remove navigation item
   */
  removeItem(itemId) {
    this.items.delete(itemId);
    this.groups.delete(itemId);
    
    const itemElement = this.navContainer.querySelector(`[data-id="${itemId}"]`);
    if (itemElement) {
      itemElement.remove();
    }
    
    return this;
  }

  /**
   * Update navigation item
   */
  updateItem(itemId, updates) {
    const item = this.items.get(itemId);
    if (!item) return false;

    const updatedItem = { ...item, ...updates };
    this.items.set(itemId, updatedItem);

    if (updatedItem.type === NAV_ITEM_TYPES.GROUP) {
      this.groups.set(itemId, updatedItem);
    }

    this.renderNavigation();
    return true;
  }

  /**
   * Clear all navigation items
   */
  clearItems() {
    this.items.clear();
    this.groups.clear();
    this.navContainer.innerHTML = '';
    return this;
  }

  /**
   * Render navigation
   */
  renderNavigation() {
    this.navContainer.innerHTML = '';
    
    this.items.forEach(item => {
      const element = this.createItemElement(item);
      if (element) {
        this.navContainer.appendChild(element);
      }
    });
  }

  /**
   * Create navigation item element
   */
  createItemElement(item) {
    switch (item.type) {
      case NAV_ITEM_TYPES.LINK:
      case NAV_ITEM_TYPES.BUTTON:
        return this.createNavItem(item);
      case NAV_ITEM_TYPES.GROUP:
        return this.createNavGroup(item);
      case NAV_ITEM_TYPES.SEPARATOR:
        return this.createSeparator(item);
      default:
        return null;
    }
  }

  /**
   * Create navigation item
   */
  createNavItem(item) {
    const li = document.createElement('li');
    li.className = 'nav-item';
    li.setAttribute('data-id', item.id);
    li.setAttribute('role', 'none');

    if (item.active) li.classList.add('active');
    if (item.disabled) li.classList.add('disabled');
    if (item.primary) li.classList.add('primary');
    if (item.danger) li.classList.add('danger');

    const link = document.createElement(item.type === NAV_ITEM_TYPES.BUTTON ? 'button' : 'a');
    link.className = 'nav-link';
    link.setAttribute('role', 'menuitem');
    link.setAttribute('tabindex', '-1');

    if (item.type === NAV_ITEM_TYPES.LINK) {
      link.href = item.href || '#';
    } else {
      link.type = 'button';
    }

    if (item.disabled) {
      link.setAttribute('aria-disabled', 'true');
    }

    // Icon
    if (item.icon) {
      const icon = document.createElement('span');
      icon.className = 'nav-icon';
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = item.icon;
      link.appendChild(icon);
    }

    // Text
    const text = document.createElement('span');
    text.className = 'nav-text';
    text.textContent = item.text;
    link.appendChild(text);

    // Badge
    if (item.badge) {
      const badge = document.createElement('span');
      badge.className = 'nav-badge';
      badge.setAttribute('aria-hidden', 'true');
      badge.textContent = item.badge;
      link.appendChild(badge);
    }

    // Indicator
    if (item.indicator !== false) {
      const indicator = document.createElement('span');
      indicator.className = 'nav-indicator';
      indicator.setAttribute('aria-hidden', 'true');
      indicator.innerHTML = `
        <svg class="indicator-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 12L10 8L6 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;
      link.appendChild(indicator);
    }

    li.appendChild(link);
    return li;
  }

  /**
   * Create navigation group
   */
  createNavGroup(item) {
    const li = document.createElement('li');
    li.className = 'nav-group';
    li.setAttribute('data-id', item.id);
    li.setAttribute('role', 'none');

    // Group header
    const header = document.createElement('div');
    header.className = 'nav-group-header';

    const title = document.createElement('span');
    title.className = 'nav-group-title';
    title.textContent = item.text;

    const toggle = document.createElement('button');
    toggle.className = 'nav-group-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-expanded', item.expanded ? 'true' : 'false');
    toggle.innerHTML = `
      <svg class="toggle-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;

    header.appendChild(title);
    header.appendChild(toggle);

    // Group items
    const itemsContainer = document.createElement('ul');
    itemsContainer.className = 'nav-group-items';
    itemsContainer.setAttribute('role', 'group');
    itemsContainer.style.maxHeight = item.expanded ? 'none' : '0';

    if (item.items && item.items.length > 0) {
      item.items.forEach(subItem => {
        const subElement = this.createNavItem(subItem);
        if (subElement) {
          itemsContainer.appendChild(subElement);
        }
      });
    }

    li.appendChild(header);
    li.appendChild(itemsContainer);
    return li;
  }

  /**
   * Create separator
   */
  createSeparator(item) {
    const li = document.createElement('li');
    li.className = 'nav-separator';
    li.setAttribute('data-id', item.id);
    li.setAttribute('role', 'separator');
    li.setAttribute('aria-hidden', 'true');
    return li;
  }

  /**
   * Set active navigation item
   */
  setActive(itemId) {
    // Remove active from all items
    this.navContainer.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });

    // Set active on target item
    const targetItem = this.navContainer.querySelector(`[data-id="${itemId}"]`);
    if (targetItem && targetItem.classList.contains('nav-item')) {
      targetItem.classList.add('active');
      
      // Update item data
      const itemData = this.items.get(itemId);
      if (itemData) {
        itemData.active = true;
      }

      // Remove active from other items in data
      this.items.forEach((item, id) => {
        if (id !== itemId && item.active) {
          item.active = false;
        }
      });

      return true;
    }

    return false;
  }

  /**
   * Set badge on navigation item
   */
  setBadge(itemId, badgeText) {
    const itemElement = this.navContainer.querySelector(`[data-id="${itemId}"]`);
    if (!itemElement) return false;

    let badge = itemElement.querySelector('.nav-badge');
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'nav-badge';
      badge.setAttribute('aria-hidden', 'true');
      
      const link = itemElement.querySelector('.nav-link');
      const indicator = link.querySelector('.nav-indicator');
      if (indicator) {
        link.insertBefore(badge, indicator);
      } else {
        link.appendChild(badge);
      }
    }

    badge.textContent = badgeText;

    // Update item data
    const itemData = this.items.get(itemId);
    if (itemData) {
      itemData.badge = badgeText;
    }

    return true;
  }

  /**
   * Remove badge from navigation item
   */
  removeBadge(itemId) {
    const itemElement = this.navContainer.querySelector(`[data-id="${itemId}"]`);
    if (!itemElement) return false;

    const badge = itemElement.querySelector('.nav-badge');
    if (badge) {
      badge.remove();
      
      // Update item data
      const itemData = this.items.get(itemId);
      if (itemData) {
        delete itemData.badge;
      }
      
      return true;
    }

    return false;
  }

  /**
   * Enable/disable navigation item
   */
  setDisabled(itemId, disabled = true) {
    const itemElement = this.navContainer.querySelector(`[data-id="${itemId}"]`);
    if (!itemElement) return false;

    const link = itemElement.querySelector('.nav-link');
    
    if (disabled) {
      itemElement.classList.add('disabled');
      link.setAttribute('aria-disabled', 'true');
    } else {
      itemElement.classList.remove('disabled');
      link.removeAttribute('aria-disabled');
    }

    // Update item data
    const itemData = this.items.get(itemId);
    if (itemData) {
      itemData.disabled = disabled;
    }

    return true;
  }

  /**
   * Validate navigation item
   */
  validateItem(item) {
    const rules = VALIDATION_RULES.navItem;
    
    for (const [field, rule] of Object.entries(rules)) {
      const value = item[field];
      
      if (rule.required && (value === undefined || value === null)) {
        console.error(`Missing required field: ${field}`);
        return false;
      }
      
      if (value !== undefined) {
        if (rule.type && typeof value !== rule.type) {
          console.error(`Invalid type for ${field}: expected ${rule.type}`);
          return false;
        }
        
        if (rule.enum && !rule.enum.includes(value)) {
          console.error(`Invalid value for ${field}: must be one of ${rule.enum.join(', ')}`);
          return false;
        }
        
        if (rule.minLength && value.length < rule.minLength) {
          console.error(`${field} too short: minimum ${rule.minLength} characters`);
          return false;
        }
      }
    }
    
    return true;
  }

  /**
   * Get navigation items
   */
  getItems() {
    return Array.from(this.items.values());
  }

  /**
   * Get item by ID
   */
  getItem(itemId) {
    return this.items.get(itemId);
  }

  /**
   * Get active item
   */
  getActiveItem() {
    for (const [id, item] of this.items) {
      if (item.active) {
        return { id, ...item };
      }
    }
    return null;
  }
}

export default NavigationController;
