/**
 * Content Card Controller
 * Behavior and interaction logic for content-card molecule
 */

import { createButtonController } from '../../atoms/button/controllers/button-controller.js';
import { updateContentCardState } from '../templates/content-card-template.js';

export function createContentCardController(element, options = {}) {
  const {
    onSelect,
    onAction,
    onInteraction,
    onMediaError,
    onIntersection,
    selectable = false,
    lazy = true,
    trackInteractions = true
  } = options;

  const state = {
    selected: false,
    disabled: false,
    loading: false,
    highlightTerms: [],
    interacted: false,
    visible: false,
    mediaLoaded: false
  };

  let intersectionObserver = null;
  let clickTimeout = null;
  let touchStartTime = null;

  /**
   * Initialize content card controller
   */
  function init() {
    setupEventListeners();
    setupAccessibility();
    setupButtons();
    setupLazyLoading();
    setupIntersectionObserver();
  }

  /**
   * Setup all event listeners
   */
  function setupEventListeners() {
    if (selectable) {
      setupSelectionHandlers();
    }
    
    setupKeyboardHandlers();
    setupMouseHandlers();
    setupTouchHandlers();
    setupMediaHandlers();
  }

  /**
   * Setup selection interaction handlers
   */
  function setupSelectionHandlers() {
    element.addEventListener('click', handleClick);
    element.addEventListener('keydown', handleKeydown);
    
    // Double click handling
    element.addEventListener('dblclick', handleDoubleClick);
  }

  /**
   * Handle click events
   */
  function handleClick(event) {
    // Don't handle clicks on action buttons
    if (event.target.closest('.tmyl-content-card__actions')) {
      return;
    }

    // Don't handle clicks on links
    if (event.target.closest('a')) {
      return;
    }

    if (state.disabled) {
      event.preventDefault();
      return;
    }

    if (selectable) {
      // Clear any existing timeout for double-click detection
      if (clickTimeout) {
        clearTimeout(clickTimeout);
        clickTimeout = null;
        return; // This is a double-click
      }

      // Set timeout to distinguish single vs double click
      clickTimeout = setTimeout(() => {
        clickTimeout = null;
        toggleSelection();
      }, 300);
    }

    trackInteraction('click');
  }

  /**
   * Handle double click events
   */
  function handleDoubleClick(event) {
    if (event.target.closest('.tmyl-content-card__actions') || 
        event.target.closest('a')) {
      return;
    }

    if (state.disabled) {
      event.preventDefault();
      return;
    }

    trackInteraction('doubleClick');
    
    if (onInteraction) {
      onInteraction({
        type: 'doubleClick',
        element,
        contentId: getContentId(),
        state: { ...state }
      });
    }
  }

  /**
   * Handle keyboard events
   */
  function handleKeydown(event) {
    if (state.disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (selectable) {
          toggleSelection();
        }
        trackInteraction('keyboard');
        break;
      
      case 'Escape':
        if (state.selected) {
          setSelected(false);
        }
        break;
    }
  }

  /**
   * Setup mouse interaction handlers
   */
  function setupMouseHandlers() {
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('mousedown', handleMouseDown);
    element.addEventListener('mouseup', handleMouseUp);
  }

  /**
   * Handle mouse enter
   */
  function handleMouseEnter() {
    if (state.disabled) return;
    
    element.classList.add('tmyl-content-card--hover');
    trackInteraction('hover');
  }

  /**
   * Handle mouse leave
   */
  function handleMouseLeave() {
    element.classList.remove('tmyl-content-card--hover');
    element.classList.remove('tmyl-content-card--active');
  }

  /**
   * Handle mouse down
   */
  function handleMouseDown() {
    if (state.disabled) return;
    element.classList.add('tmyl-content-card--active');
  }

  /**
   * Handle mouse up
   */
  function handleMouseUp() {
    element.classList.remove('tmyl-content-card--active');
  }

  /**
   * Setup touch interaction handlers
   */
  function setupTouchHandlers() {
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchend', handleTouchEnd);
    element.addEventListener('touchcancel', handleTouchCancel);
  }

  /**
   * Handle touch start
   */
  function handleTouchStart(event) {
    if (state.disabled) return;
    
    touchStartTime = Date.now();
    element.classList.add('tmyl-content-card--active');
  }

  /**
   * Handle touch end
   */
  function handleTouchEnd(event) {
    element.classList.remove('tmyl-content-card--active');
    
    if (touchStartTime && Date.now() - touchStartTime > 500) {
      // Long press detected
      handleLongPress(event);
    }
    
    touchStartTime = null;
  }

  /**
   * Handle touch cancel
   */
  function handleTouchCancel() {
    element.classList.remove('tmyl-content-card--active');
    touchStartTime = null;
  }

  /**
   * Handle long press
   */
  function handleLongPress(event) {
    trackInteraction('longPress');
    
    if (onInteraction) {
      onInteraction({
        type: 'longPress',
        element,
        contentId: getContentId(),
        state: { ...state }
      });
    }
  }

  /**
   * Setup keyboard navigation handlers
   */
  function setupKeyboardHandlers() {
    if (selectable) {
      element.setAttribute('tabindex', '0');
      element.setAttribute('role', 'option');
    }
  }

  /**
   * Setup accessibility attributes
   */
  function setupAccessibility() {
    const contentId = getContentId();
    const title = element.querySelector('.tmyl-content-card__title');
    
    if (contentId) {
      element.setAttribute('data-content-id', contentId);
    }
    
    if (title) {
      element.setAttribute('aria-labelledby', `content-title-${contentId}`);
      title.id = `content-title-${contentId}`;
    }
    
    if (selectable) {
      element.setAttribute('aria-selected', 'false');
    }
  }

  /**
   * Setup button controllers for action buttons
   */
  function setupButtons() {
    const buttons = element.querySelectorAll('.tmyl-content-card__actions .tmyl-button');
    
    buttons.forEach(button => {
      const controller = createButtonController(button, {
        onClick: (buttonElement) => {
          const action = buttonElement.dataset.action;
          const contentId = buttonElement.dataset.contentId;
          
          if (onAction) {
            onAction({
              action,
              contentId,
              element: buttonElement,
              cardElement: element
            });
          }
        }
      });
    });
  }

  /**
   * Setup media lazy loading
   */
  function setupLazyLoading() {
    if (!lazy) return;
    
    const media = element.querySelector('.tmyl-content-card__media img');
    if (!media) return;
    
    // Store original src and replace with placeholder
    const originalSrc = media.src;
    media.dataset.src = originalSrc;
    media.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjFmNWY5Ii8+PC9zdmc+';
    
    // Load image when card becomes visible
    const loadImage = () => {
      if (state.mediaLoaded) return;
      
      const img = new Image();
      img.onload = () => {
        media.src = originalSrc;
        media.classList.add('tmyl-content-card__media--loaded');
        state.mediaLoaded = true;
      };
      img.onerror = () => {
        media.classList.add('tmyl-content-card__media--error');
        if (onMediaError) {
          onMediaError({
            element: media,
            src: originalSrc,
            cardElement: element
          });
        }
      };
      img.src = originalSrc;
    };
    
    // Load immediately if already visible
    if (isInViewport(element)) {
      loadImage();
    } else {
      // Will be loaded by intersection observer
      element._loadImage = loadImage;
    }
  }

  /**
   * Setup media event handlers
   */
  function setupMediaHandlers() {
    const media = element.querySelector('.tmyl-content-card__media img');
    if (!media) return;
    
    media.addEventListener('load', () => {
      media.classList.add('tmyl-content-card__media--loaded');
    });
    
    media.addEventListener('error', () => {
      media.classList.add('tmyl-content-card__media--error');
      if (onMediaError) {
        onMediaError({
          element: media,
          src: media.src,
          cardElement: element
        });
      }
    });
  }

  /**
   * Setup intersection observer for visibility tracking
   */
  function setupIntersectionObserver() {
    if (typeof IntersectionObserver === 'undefined') return;
    
    intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const wasVisible = state.visible;
        state.visible = entry.isIntersecting;
        
        if (entry.isIntersecting && !wasVisible) {
          // Card became visible
          element.classList.add('tmyl-content-card--visible');
          
          // Load lazy media
          if (element._loadImage) {
            element._loadImage();
            delete element._loadImage;
          }
          
          trackInteraction('visible');
          
          if (onIntersection) {
            onIntersection({
              type: 'visible',
              element,
              contentId: getContentId(),
              state: { ...state }
            });
          }
        } else if (!entry.isIntersecting && wasVisible) {
          // Card became hidden
          element.classList.remove('tmyl-content-card--visible');
          
          if (onIntersection) {
            onIntersection({
              type: 'hidden',
              element,
              contentId: getContentId(),
              state: { ...state }
            });
          }
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px'
    });
    
    intersectionObserver.observe(element);
  }

  /**
   * Toggle selection state
   */
  function toggleSelection() {
    setSelected(!state.selected);
  }

  /**
   * Set selection state
   */
  function setSelected(selected) {
    if (state.selected === selected) return;
    
    state.selected = selected;
    updateContentCardState(element, { selected });
    
    if (onSelect) {
      onSelect({
        selected,
        contentId: getContentId(),
        element,
        state: { ...state }
      });
    }
  }

  /**
   * Set disabled state
   */
  function setDisabled(disabled) {
    if (state.disabled === disabled) return;
    
    state.disabled = disabled;
    updateContentCardState(element, { disabled });
  }

  /**
   * Set loading state
   */
  function setLoading(loading) {
    if (state.loading === loading) return;
    
    state.loading = loading;
    updateContentCardState(element, { loading });
  }

  /**
   * Update highlight terms
   */
  function setHighlightTerms(terms) {
    state.highlightTerms = terms;
    updateContentCardState(element, { highlightTerms: terms });
  }

  /**
   * Track user interactions
   */
  function trackInteraction(type) {
    if (!trackInteractions) return;
    
    if (!state.interacted && type !== 'visible') {
      state.interacted = true;
    }
    
    // Could integrate with analytics here
    console.debug(`Content card interaction: ${type}`, {
      contentId: getContentId(),
      type,
      timestamp: Date.now()
    });
  }

  /**
   * Get content ID from element
   */
  function getContentId() {
    return element.dataset.contentId;
  }

  /**
   * Check if element is in viewport
   */
  function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  /**
   * Cleanup function
   */
  function destroy() {
    if (intersectionObserver) {
      intersectionObserver.disconnect();
      intersectionObserver = null;
    }
    
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      clickTimeout = null;
    }
  }

  /**
   * Public API
   */
  const controller = {
    // State management
    getState: () => ({ ...state }),
    setSelected,
    setDisabled,
    setLoading,
    setHighlightTerms,
    
    // Methods
    toggleSelection,
    
    // Lifecycle
    destroy
  };

  // Initialize
  init();
  
  return controller;
}

/**
 * Content card interaction utilities
 */
export const contentCardUtils = {
  /**
   * Create selection manager for multiple cards
   */
  createSelectionManager(cards, options = {}) {
    const { multiSelect = false, onSelectionChange } = options;
    const selection = new Set();
    
    return {
      selectCard(cardId) {
        if (!multiSelect) {
          selection.clear();
        }
        selection.add(cardId);
        this.updateUI();
      },
      
      deselectCard(cardId) {
        selection.delete(cardId);
        this.updateUI();
      },
      
      toggleCard(cardId) {
        if (selection.has(cardId)) {
          this.deselectCard(cardId);
        } else {
          this.selectCard(cardId);
        }
      },
      
      selectAll() {
        cards.forEach(card => {
          const id = card.dataset.contentId;
          if (id) selection.add(id);
        });
        this.updateUI();
      },
      
      deselectAll() {
        selection.clear();
        this.updateUI();
      },
      
      getSelection() {
        return Array.from(selection);
      },
      
      updateUI() {
        cards.forEach(card => {
          const id = card.dataset.contentId;
          const controller = card._contentCardController;
          if (controller && id) {
            controller.setSelected(selection.has(id));
          }
        });
        
        if (onSelectionChange) {
          onSelectionChange(Array.from(selection));
        }
      }
    };
  },

  /**
   * Create keyboard navigation for card grids
   */
  createGridNavigation(container, options = {}) {
    const { 
      wrap = true,
      enterAction = 'select',
      onNavigate
    } = options;
    
    let currentIndex = 0;
    
    function getCards() {
      return Array.from(container.querySelectorAll('.tmyl-content-card'));
    }
    
    function updateFocus(index) {
      const cards = getCards();
      const card = cards[index];
      
      if (card) {
        card.focus();
        currentIndex = index;
        
        if (onNavigate) {
          onNavigate(card, index);
        }
      }
    }
    
    container.addEventListener('keydown', (event) => {
      const cards = getCards();
      if (!cards.length) return;
      
      let newIndex = currentIndex;
      
      switch (event.key) {
        case 'ArrowRight':
          event.preventDefault();
          newIndex = currentIndex + 1;
          if (newIndex >= cards.length) {
            newIndex = wrap ? 0 : cards.length - 1;
          }
          break;
          
        case 'ArrowLeft':
          event.preventDefault();
          newIndex = currentIndex - 1;
          if (newIndex < 0) {
            newIndex = wrap ? cards.length - 1 : 0;
          }
          break;
          
        case 'ArrowDown':
          event.preventDefault();
          // Calculate grid columns based on container width
          const cardWidth = cards[0].offsetWidth;
          const containerWidth = container.offsetWidth;
          const columns = Math.floor(containerWidth / cardWidth);
          
          newIndex = currentIndex + columns;
          if (newIndex >= cards.length) {
            newIndex = wrap ? newIndex % cards.length : cards.length - 1;
          }
          break;
          
        case 'ArrowUp':
          event.preventDefault();
          const cardWidth2 = cards[0].offsetWidth;
          const containerWidth2 = container.offsetWidth;
          const columns2 = Math.floor(containerWidth2 / cardWidth2);
          
          newIndex = currentIndex - columns2;
          if (newIndex < 0) {
            newIndex = wrap ? cards.length + newIndex : 0;
          }
          break;
          
        case 'Home':
          event.preventDefault();
          newIndex = 0;
          break;
          
        case 'End':
          event.preventDefault();
          newIndex = cards.length - 1;
          break;
      }
      
      if (newIndex !== currentIndex) {
        updateFocus(newIndex);
      }
    });
    
    return {
      focusCard: updateFocus,
      getCurrentIndex: () => currentIndex,
      getCardCount: () => getCards().length
    };
  }
};
