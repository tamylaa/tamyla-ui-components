/**
 * Mobile Sidebar Component
 * Implements Trading Portal's mobile navigation patterns
 * Single responsibility: Mobile-optimized sidebar with slide animations and touch optimization
 */

import { ENHANCED_TOKENS } from '../core/design-tokens.js';

/**
 * Create Mobile Sidebar
 * @param {Object} options - Sidebar configuration
 * @returns {Object} Sidebar controller with element and methods
 */
export function createMobileSidebar(options = {}) {
  const {
    position = 'left', // left, right
    width = '280px',
    backdrop = true,
    closeOnBackdrop = true,
    closeOnEscape = true,
    animationDuration = 300,
    items = [],
    header = null,
    footer = null,
    className = '',
    onOpen,
    onClose,
    onItemClick
  } = options;

  // Create sidebar structure
  const overlay = document.createElement('div');
  overlay.className = `tmyl-mobile-sidebar-overlay ${className}`;
  overlay.style.display = 'none';

  const sidebar = document.createElement('nav');
  sidebar.className = `tmyl-mobile-sidebar sidebar-${position}`;
  sidebar.setAttribute('role', 'navigation');
  sidebar.setAttribute('aria-label', 'Mobile navigation');
  sidebar.style.width = width;

  // Build sidebar content
  let sidebarContent = '';
  
  // Header
  if (header) {
    sidebarContent += `
      <div class="sidebar-header">
        ${typeof header === 'string' ? header : ''}
        <button class="sidebar-close" aria-label="Close sidebar">
          <span class="close-icon">×</span>
        </button>
      </div>
    `;
  } else {
    sidebarContent += `
      <div class="sidebar-header">
        <button class="sidebar-close" aria-label="Close sidebar">
          <span class="close-icon">×</span>
        </button>
      </div>
    `;
  }
  
  // Navigation items
  if (items.length > 0) {
    sidebarContent += '<ul class="sidebar-nav">';
    items.forEach(item => {
      const isActive = item.active ? 'active' : '';
      const isDisabled = item.disabled ? 'disabled' : '';
      
      sidebarContent += `
        <li class="nav-item ${isActive} ${isDisabled}" data-id="${item.id || ''}">
          <a href="${item.href || '#'}" class="nav-link" ${item.disabled ? 'aria-disabled="true"' : ''}>
            ${item.icon ? `<span class="nav-icon">${item.icon}</span>` : ''}
            <span class="nav-text">${item.text}</span>
            ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
          </a>
        </li>
      `;
    });
    sidebarContent += '</ul>';
  }
  
  // Footer
  if (footer) {
    sidebarContent += `
      <div class="sidebar-footer">
        ${typeof footer === 'string' ? footer : ''}
      </div>
    `;
  }
  
  sidebar.innerHTML = sidebarContent;
  
  // Add sidebar to overlay
  if (backdrop) {
    const backdropDiv = document.createElement('div');
    backdropDiv.className = 'sidebar-backdrop';
    overlay.appendChild(backdropDiv);
  }
  overlay.appendChild(sidebar);
  
  // Add to document
  document.body.appendChild(overlay);
  
  // State management
  let isOpen = false;
  let isAnimating = false;
  
  // Animation helper
  const animate = (show) => {
    if (isAnimating) return Promise.resolve();
    
    isAnimating = true;
    
    return new Promise(resolve => {
      if (show) {
        overlay.style.display = 'flex';
        
        // Force reflow
        overlay.offsetHeight;
        
        overlay.classList.add('opening');
        sidebar.classList.add('sliding-in');
        
        setTimeout(() => {
          overlay.classList.remove('opening');
          sidebar.classList.remove('sliding-in');
          overlay.classList.add('open');
          sidebar.classList.add('open');
          isAnimating = false;
          resolve();
        }, animationDuration);
      } else {
        overlay.classList.remove('open');
        sidebar.classList.remove('open');
        overlay.classList.add('closing');
        sidebar.classList.add('sliding-out');
        
        setTimeout(() => {
          overlay.style.display = 'none';
          overlay.classList.remove('closing');
          sidebar.classList.remove('sliding-out');
          isAnimating = false;
          resolve();
        }, animationDuration);
      }
    });
  };
  
  // Methods
  const methods = {
    /**
     * Open sidebar
     */
    async open() {
      if (isOpen || isAnimating) return false;
      
      isOpen = true;
      await animate(true);
      
      // Focus management
      const firstFocusable = sidebar.querySelector('button, a, [tabindex]:not([tabindex="-1"])');
      if (firstFocusable) {
        firstFocusable.focus();
      }
      
      if (onOpen) onOpen();
      
      // Dispatch event
      sidebar.dispatchEvent(new CustomEvent('sidebar-opened', {
        detail: { sidebar: methods }
      }));
      
      return true;
    },
    
    /**
     * Close sidebar
     */
    async close() {
      if (!isOpen || isAnimating) return false;
      
      isOpen = false;
      await animate(false);
      
      if (onClose) onClose();
      
      // Dispatch event
      sidebar.dispatchEvent(new CustomEvent('sidebar-closed', {
        detail: { sidebar: methods }
      }));
      
      return true;
    },
    
    /**
     * Toggle sidebar
     */
    async toggle() {
      return isOpen ? await this.close() : await this.open();
    },
    
    /**
     * Check if sidebar is open
     */
    isOpen() {
      return isOpen;
    },
    
    /**
     * Update navigation items
     */
    updateItems(newItems) {
      const navContainer = sidebar.querySelector('.sidebar-nav');
      if (!navContainer) return false;
      
      let navContent = '';
      newItems.forEach(item => {
        const isActive = item.active ? 'active' : '';
        const isDisabled = item.disabled ? 'disabled' : '';
        
        navContent += `
          <li class="nav-item ${isActive} ${isDisabled}" data-id="${item.id || ''}">
            <a href="${item.href || '#'}" class="nav-link" ${item.disabled ? 'aria-disabled="true"' : ''}>
              ${item.icon ? `<span class="nav-icon">${item.icon}</span>` : ''}
              <span class="nav-text">${item.text}</span>
              ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
            </a>
          </li>
        `;
      });
      
      navContainer.innerHTML = navContent;
      return true;
    },
    
    /**
     * Set active item
     */
    setActive(itemId) {
      sidebar.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
      });
      
      const targetItem = sidebar.querySelector(`[data-id="${itemId}"]`);
      if (targetItem) {
        targetItem.classList.add('active');
        return true;
      }
      
      return false;
    },
    
    /**
     * Add badge to item
     */
    setBadge(itemId, badgeText) {
      const targetItem = sidebar.querySelector(`[data-id="${itemId}"]`);
      if (!targetItem) return false;
      
      let badge = targetItem.querySelector('.nav-badge');
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'nav-badge';
        targetItem.querySelector('.nav-link').appendChild(badge);
      }
      
      badge.textContent = badgeText;
      return true;
    },
    
    /**
     * Remove badge from item
     */
    removeBadge(itemId) {
      const targetItem = sidebar.querySelector(`[data-id="${itemId}"]`);
      if (!targetItem) return false;
      
      const badge = targetItem.querySelector('.nav-badge');
      if (badge) {
        badge.remove();
        return true;
      }
      
      return false;
    },
    
    /**
     * Destroy sidebar
     */
    destroy() {
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    },
    
    // Expose elements for advanced customization
    get element() { return overlay; },
    get sidebar() { return sidebar; }
  };
  
  // Event handlers
  
  // Close button
  const closeButton = sidebar.querySelector('.sidebar-close');
  if (closeButton) {
    closeButton.addEventListener('click', methods.close);
  }
  
  // Backdrop click
  if (closeOnBackdrop && backdrop) {
    const backdropDiv = overlay.querySelector('.sidebar-backdrop');
    if (backdropDiv) {
      backdropDiv.addEventListener('click', methods.close);
    }
  }
  
  // Escape key
  if (closeOnEscape) {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        methods.close();
      }
    };
    document.addEventListener('keydown', handleEscape);
    
    // Store handler for cleanup
    methods._escapeHandler = handleEscape;
  }
  
  // Navigation item clicks
  sidebar.addEventListener('click', (e) => {
    const navLink = e.target.closest('.nav-link');
    if (!navLink) return;
    
    const navItem = navLink.closest('.nav-item');
    if (!navItem || navItem.classList.contains('disabled')) {
      e.preventDefault();
      return;
    }
    
    const itemId = navItem.getAttribute('data-id');
    const href = navLink.getAttribute('href');
    
    // Call item click handler
    if (onItemClick) {
      const shouldContinue = onItemClick({
        id: itemId,
        href,
        text: navLink.querySelector('.nav-text')?.textContent || '',
        element: navItem,
        event: e
      });
      
      // If handler returns false, prevent default
      if (shouldContinue === false) {
        e.preventDefault();
      }
    }
    
    // Auto-close on navigation (unless it's just a hash)
    if (href && href !== '#' && !href.startsWith('#')) {
      setTimeout(() => methods.close(), 100);
    }
  });
  
  // Touch events for swipe gestures
  let touchStartX = 0;
  let touchStartY = 0;
  
  sidebar.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  });
  
  sidebar.addEventListener('touchmove', (e) => {
    if (!isOpen) return;
    
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    const deltaX = touchX - touchStartX;
    const deltaY = touchY - touchStartY;
    
    // If swipe is more horizontal than vertical and in the close direction
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      const isClosingSwipe = (position === 'left' && deltaX < -50) || 
                            (position === 'right' && deltaX > 50);
      
      if (isClosingSwipe) {
        e.preventDefault();
        methods.close();
      }
    }
  });
  
  return methods;
}

/**
 * Trading Portal Mobile Navigation Items
 * Predefined navigation patterns from Trading Portal
 */
export const TRADING_PORTAL_NAV_ITEMS = [
  {
    id: 'dashboard',
    text: 'Dashboard',
    icon: '📊',
    href: '/dashboard',
    active: false
  },
  {
    id: 'trades',
    text: 'Trades',
    icon: '📈',
    href: '/trades',
    active: false
  },
  {
    id: 'portfolio',
    text: 'Portfolio',
    icon: '💼',
    href: '/portfolio',
    active: false
  },
  {
    id: 'documents',
    text: 'Documents',
    icon: '📄',
    href: '/documents',
    active: false
  },
  {
    id: 'analytics',
    text: 'Analytics',
    icon: '📊',
    href: '/analytics',
    active: false
  },
  {
    id: 'settings',
    text: 'Settings',
    icon: '⚙️',
    href: '/settings',
    active: false
  }
];

/**
 * Mobile Sidebar Manager
 * Manages multiple sidebars and provides global controls
 */
export class MobileSidebarManager {
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
    sidebar.sidebar.addEventListener('sidebar-opened', () => {
      this.activeSidebar = id;
      // Close other sidebars
      this.sidebars.forEach((otherSidebar, otherId) => {
        if (otherId !== id && otherSidebar.isOpen()) {
          otherSidebar.close();
        }
      });
    });
    
    sidebar.sidebar.addEventListener('sidebar-closed', () => {
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
}
