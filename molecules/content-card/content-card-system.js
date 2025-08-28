/**
 * Content Card System Factory
 * Molecular component orchestrating atomic components for content display
 */

import { createContentCardTemplate, contentCardTemplates } from './templates/content-card-template.js';
import { createContentCardController, contentCardUtils } from './controllers/content-card-controller.js';

/**
 * Content Card Factory
 * Creates complete content card molecules with atomic composition
 */
export function ContentCardFactory(props = {}) {
  const {
    content = {},
    variant = 'default',
    size = 'md',
    selectable = false,
    selected = false,
    disabled = false,
    loading = false,
    showActions = true,
    highlightTerms = [],
    lazy = true,
    trackInteractions = true,
    className = '',

    // Event handlers
    onSelect,
    onAction,
    onInteraction,
    onMediaError,
    onIntersection,

    // Container element
    container = null
  } = props;

  let element = null;
  let controller = null;

  /**
   * Create content card element
   */
  function createElement() {
    const template = createContentCardTemplate({
      content,
      variant,
      size,
      selectable,
      selected,
      disabled,
      loading,
      showActions,
      highlightTerms,
      className
    });

    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = template;
    element = tempContainer.firstElementChild;

    return element;
  }

  /**
   * Initialize controller
   */
  function initializeController() {
    if (!element) return;

    controller = createContentCardController(element, {
      onSelect,
      onAction,
      onInteraction,
      onMediaError,
      onIntersection,
      selectable,
      lazy,
      trackInteractions
    });

    // Store controller reference on element for external access
    element._contentCardController = controller;

    return controller;
  }

  /**
   * Render to container
   */
  function render(targetContainer = container) {
    if (!targetContainer) {
      throw new Error('Container element required for rendering');
    }

    if (!element) {
      createElement();
    }

    if (!controller) {
      initializeController();
    }

    targetContainer.appendChild(element);
    return element;
  }

  /**
   * Update content card properties
   */
  function update(newProps) {
    if (!element || !controller) return;

    // Update controller state
    if (newProps.selected !== undefined) {
      controller.setSelected(newProps.selected);
    }
    if (newProps.disabled !== undefined) {
      controller.setDisabled(newProps.disabled);
    }
    if (newProps.loading !== undefined) {
      controller.setLoading(newProps.loading);
    }
    if (newProps.highlightTerms !== undefined) {
      controller.setHighlightTerms(newProps.highlightTerms);
    }

    // For major structural changes, recreate the element
    if (newProps.content || newProps.variant || newProps.size || newProps.showActions) {
      const parent = element.parentNode;
      const newElement = ContentCardFactory({
        ...props,
        ...newProps,
        container: null
      }).getElement();

      if (parent) {
        parent.replaceChild(newElement, element);
      }

      // Cleanup old controller
      if (controller) {
        controller.destroy();
      }

      element = newElement;
      controller = element._contentCardController;
    }
  }

  /**
   * Remove from DOM and cleanup
   */
  function destroy() {
    if (controller) {
      controller.destroy();
      controller = null;
    }

    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }

    element = null;
  }

  /**
   * Get current element
   */
  function getElement() {
    if (!element) {
      createElement();
      initializeController();
    }
    return element;
  }

  /**
   * Get controller instance
   */
  function getController() {
    if (!controller && element) {
      initializeController();
    }
    return controller;
  }

  /**
   * Public API
   */
  return {
    // Lifecycle
    render,
    update,
    destroy,

    // Access
    getElement,
    getController,

    // Properties
    get props() {
      return {
        content,
        variant,
        size,
        selectable,
        selected,
        disabled,
        loading,
        showActions,
        highlightTerms,
        className
      };
    }
  };
}

/**
 * Content Card Grid Factory
 * Creates grids of content cards with management utilities
 */
export function ContentCardGridFactory(props = {}) {
  const {
    items = [],
    cardProps = {},
    gridProps = {},
    selectionManager = null,
    navigationEnabled = true,
    lazy = true,
    className = '',
    container = null
  } = props;

  let element = null;
  let cards = new Map();
  let selectionController = null;
  let navigationController = null;

  /**
   * Create grid container element
   */
  function createElement() {
    element = document.createElement('div');
    element.className = [
      'tmyl-content-card-grid',
      className
    ].filter(Boolean).join(' ');

    // Apply grid properties
    Object.entries(gridProps).forEach(([key, value]) => {
      if (key.startsWith('data-') || key.startsWith('aria-')) {
        element.setAttribute(key, value);
      } else if (key === 'style') {
        Object.assign(element.style, value);
      }
    });

    return element;
  }

  /**
   * Create content cards for items
   */
  function createCards() {
    if (!element) createElement();

    // Clear existing cards
    cards.forEach(card => card.destroy());
    cards.clear();
    element.innerHTML = '';

    // Create new cards
    items.forEach((item, index) => {
      const cardFactory = ContentCardFactory({
        ...cardProps,
        content: item,
        lazy: lazy && index > 20, // Only lazy load after first 20 items
        container: null
      });

      const cardElement = cardFactory.render(element);
      cards.set(item.id || index, cardFactory);
    });

    return cards;
  }

  /**
   * Initialize selection management
   */
  function initializeSelection() {
    if (!selectionManager) return;

    const cardElements = Array.from(element.querySelectorAll('.tmyl-content-card'));
    selectionController = contentCardUtils.createSelectionManager(cardElements, selectionManager);

    return selectionController;
  }

  /**
   * Initialize keyboard navigation
   */
  function initializeNavigation() {
    if (!navigationEnabled || !element) return;

    navigationController = contentCardUtils.createGridNavigation(element, {
      wrap: true,
      enterAction: 'select',
      onNavigate: (card, index) => {
        // Scroll card into view if needed
        card.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }
    });

    return navigationController;
  }

  /**
   * Render grid to container
   */
  function render(targetContainer = container) {
    if (!targetContainer) {
      throw new Error('Container element required for rendering grid');
    }

    if (!element) {
      createElement();
      createCards();
    }

    targetContainer.appendChild(element);

    // Initialize management features
    initializeSelection();
    initializeNavigation();

    return element;
  }

  /**
   * Add items to grid
   */
  function addItems(newItems, position = 'end') {
    newItems.forEach((item, index) => {
      const cardFactory = ContentCardFactory({
        ...cardProps,
        content: item,
        container: null
      });

      const cardElement = cardFactory.getElement();

      if (position === 'start') {
        element.insertBefore(cardElement, element.firstChild);
      } else {
        element.appendChild(cardElement);
      }

      cards.set(item.id || `new-${Date.now()}-${index}`, cardFactory);
    });

    // Reinitialize management features
    if (selectionController) {
      initializeSelection();
    }
    if (navigationController) {
      initializeNavigation();
    }
  }

  /**
   * Remove items from grid
   */
  function removeItems(itemIds) {
    itemIds.forEach(id => {
      const card = cards.get(id);
      if (card) {
        card.destroy();
        cards.delete(id);
      }
    });
  }

  /**
   * Update grid layout
   */
  function updateLayout(newGridProps) {
    if (!element) return;

    Object.assign(gridProps, newGridProps);

    // Apply new properties
    Object.entries(newGridProps).forEach(([key, value]) => {
      if (key.startsWith('data-') || key.startsWith('aria-')) {
        element.setAttribute(key, value);
      } else if (key === 'style') {
        Object.assign(element.style, value);
      }
    });
  }

  /**
   * Filter visible cards
   */
  function filterCards(predicate) {
    cards.forEach((card, id) => {
      const cardElement = card.getElement();
      const shouldShow = predicate(card.props.content, id);

      cardElement.style.display = shouldShow ? '' : 'none';
    });
  }

  /**
   * Update highlight terms for all cards
   */
  function setHighlightTerms(terms) {
    cards.forEach(card => {
      const controller = card.getController();
      if (controller) {
        controller.setHighlightTerms(terms);
      }
    });
  }

  /**
   * Get selection state
   */
  function getSelection() {
    return selectionController ? selectionController.getSelection() : [];
  }

  /**
   * Cleanup and destroy
   */
  function destroy() {
    cards.forEach(card => card.destroy());
    cards.clear();

    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }

    element = null;
    selectionController = null;
    navigationController = null;
  }

  /**
   * Public API
   */
  return {
    // Lifecycle
    render,
    destroy,

    // Content management
    addItems,
    removeItems,
    filterCards,
    setHighlightTerms,

    // Layout
    updateLayout,

    // Selection
    getSelection,

    // Access
    getElement: () => element,
    getCards: () => cards,
    getCard: (id) => cards.get(id)
  };
}

/**
 * Content Card Templates
 * Pre-configured content card factories for common use cases
 */
export const ContentCardTemplates = {
  /**
   * Search result card
   */
  searchResult: (content, props = {}) => ContentCardFactory({
    ...props,
    content,
    variant: 'default',
    size: 'md',
    selectable: true,
    showActions: true
  }),

  /**
   * Media preview card
   */
  mediaPreview: (content, props = {}) => ContentCardFactory({
    ...props,
    content,
    variant: 'media',
    size: 'lg',
    showActions: false
  }),

  /**
   * Compact list item
   */
  listItem: (content, props = {}) => ContentCardFactory({
    ...props,
    content,
    variant: 'compact',
    size: 'sm',
    showActions: false
  }),

  /**
   * Dashboard widget
   */
  widget: (content, props = {}) => ContentCardFactory({
    ...props,
    content,
    variant: 'widget',
    size: 'md',
    showActions: true
  }),

  /**
   * Gallery item
   */
  galleryItem: (content, props = {}) => ContentCardFactory({
    ...props,
    content,
    variant: 'gallery',
    size: 'square',
    selectable: true
  })
};

/**
 * Utility functions
 */
export const ContentCardHelpers = {
  /**
   * Create content card from various data formats
   */
  fromData(data, type = 'auto') {
    const contentTypes = {
      article: {
        type: 'article',
        title: data.title || data.headline,
        description: data.description || data.summary,
        author: data.author,
        date: data.publishedDate || data.date,
        url: data.url || data.link,
        tags: data.tags || data.categories,
        stats: {
          views: data.views,
          likes: data.likes,
          comments: data.comments
        }
      },

      file: {
        type: data.mimeType?.includes('image/') ? 'image' :
          data.mimeType?.includes('video/') ? 'video' : 'document',
        title: data.name || data.filename,
        description: data.description,
        url: data.url || data.downloadUrl,
        stats: {
          size: data.size,
          downloads: data.downloads
        }
      },

      user: {
        type: 'profile',
        title: data.name || data.displayName,
        description: data.bio || data.description,
        media: data.avatar ? { url: data.avatar, alt: data.name } : null,
        stats: {
          followers: data.followers,
          following: data.following
        }
      }
    };

    if (type === 'auto') {
      if (data.mimeType || data.size) type = 'file';
      else if (data.author || data.publishedDate) type = 'article';
      else if (data.bio || data.followers) type = 'user';
      else type = 'article';
    }

    return contentTypes[type] || data;
  },

  /**
   * Batch create cards from data array
   */
  fromDataArray(dataArray, type = 'auto', cardProps = {}) {
    return dataArray.map(data => {
      const content = this.fromData(data, type);
      return ContentCardFactory({ ...cardProps, content });
    });
  }
};

/**
 * Export main factory as default
 */
export default ContentCardFactory;
