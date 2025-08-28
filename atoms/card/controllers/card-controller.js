/**
 * Card Component Logic
 * Pure JavaScript logic for card behavior
 */

export class CardController {
  constructor(element) {
    this.element = element;
    this.isInteractive = this.element.hasAttribute('tabindex');
    this.setupEventListeners();
  }

  setupEventListeners() {
    if (this.isInteractive) {
      this.element.addEventListener('click', this.handleClick.bind(this));
      this.element.addEventListener('keydown', this.handleKeydown.bind(this));
      this.element.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
      this.element.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
      this.element.addEventListener('focus', this.handleFocus.bind(this));
      this.element.addEventListener('blur', this.handleBlur.bind(this));
    }

    // Handle action button clicks
    const actionButtons = this.element.querySelectorAll('[data-action]');
    actionButtons.forEach(button => {
      button.addEventListener('click', this.handleActionClick.bind(this));
    });
  }

  handleClick(event) {
    if (this.isDisabled()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    // Don't trigger card click if action button was clicked
    if (event.target.closest('[data-action]')) {
      return;
    }

    this.toggleSelected();
    this.dispatchCustomEvent('tmyl-card-click', {
      originalEvent: event,
      selected: this.isSelected()
    });
  }

  handleActionClick(event) {
    event.stopPropagation(); // Prevent card click

    if (this.isDisabled()) {
      event.preventDefault();
      return;
    }

    const actionName = event.target.getAttribute('data-action');
    this.dispatchCustomEvent('tmyl-card-action', {
      action: actionName,
      originalEvent: event
    });
  }

  handleKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.handleClick(event);
    }
  }

  handleMouseEnter(event) {
    if (!this.isDisabled()) {
      this.element.classList.add('tmyl-card--hover');
      this.dispatchCustomEvent('tmyl-card-hover', { entering: true });
    }
  }

  handleMouseLeave(event) {
    this.element.classList.remove('tmyl-card--hover');
    this.dispatchCustomEvent('tmyl-card-hover', { entering: false });
  }

  handleFocus(event) {
    if (!this.isDisabled()) {
      this.element.classList.add('tmyl-card--focus');
      this.dispatchCustomEvent('tmyl-card-focus', { focused: true });
    }
  }

  handleBlur(event) {
    this.element.classList.remove('tmyl-card--focus');
    this.dispatchCustomEvent('tmyl-card-focus', { focused: false });
  }

  isDisabled() {
    return this.element.hasAttribute('aria-disabled') &&
           this.element.getAttribute('aria-disabled') === 'true';
  }

  isSelected() {
    return this.element.hasAttribute('aria-selected') &&
           this.element.getAttribute('aria-selected') === 'true';
  }

  setSelected(selected) {
    if (selected) {
      this.element.setAttribute('aria-selected', 'true');
      this.element.classList.add('tmyl-card--selected');
    } else {
      this.element.removeAttribute('aria-selected');
      this.element.classList.remove('tmyl-card--selected');
    }

    this.dispatchCustomEvent('tmyl-card-selection-change', {
      selected: selected
    });
  }

  toggleSelected() {
    this.setSelected(!this.isSelected());
  }

  setDisabled(disabled) {
    if (disabled) {
      this.element.setAttribute('aria-disabled', 'true');
      this.element.classList.add('tmyl-card--disabled');
      this.element.removeAttribute('tabindex');
    } else {
      this.element.removeAttribute('aria-disabled');
      this.element.classList.remove('tmyl-card--disabled');
      if (this.isInteractive) {
        this.element.setAttribute('tabindex', '0');
      }
    }
  }

  setElevation(elevation) {
    // Remove existing elevation classes
    const elevationClasses = ['none', 'xs', 'sm', 'md', 'lg', 'xl'];
    elevationClasses.forEach(e => {
      this.element.classList.remove(`tmyl-card--elevation-${e}`);
    });

    // Add new elevation class
    if (elevation && elevation !== 'none') {
      this.element.classList.add(`tmyl-card--elevation-${elevation}`);
    }
  }

  dispatchCustomEvent(eventName, detail = {}) {
    this.element.dispatchEvent(new CustomEvent(eventName, {
      detail,
      bubbles: true,
      composed: true
    }));
  }

  destroy() {
    if (this.isInteractive) {
      this.element.removeEventListener('click', this.handleClick);
      this.element.removeEventListener('keydown', this.handleKeydown);
      this.element.removeEventListener('mouseenter', this.handleMouseEnter);
      this.element.removeEventListener('mouseleave', this.handleMouseLeave);
      this.element.removeEventListener('focus', this.handleFocus);
      this.element.removeEventListener('blur', this.handleBlur);
    }

    const actionButtons = this.element.querySelectorAll('[data-action]');
    actionButtons.forEach(button => {
      button.removeEventListener('click', this.handleActionClick);
    });
  }
}

/**
 * Card Group Controller - Manages multiple cards as a group
 */
export class CardGroupController {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      multiSelect: false,
      selectable: true,
      ...options
    };
    this.cards = [];
    this.setupCards();
  }

  setupCards() {
    const cardElements = this.container.querySelectorAll('.tmyl-card');
    cardElements.forEach(cardElement => {
      const controller = new CardController(cardElement);
      cardElement._controller = controller;
      this.cards.push(controller);

      if (this.options.selectable) {
        cardElement.addEventListener('tmyl-card-click', this.handleCardSelection.bind(this));
      }
    });
  }

  handleCardSelection(event) {
    const clickedCard = event.target;
    const clickedController = clickedCard._controller;

    if (!this.options.multiSelect) {
      // Single select - deselect all others
      this.cards.forEach(controller => {
        if (controller.element !== clickedCard) {
          controller.setSelected(false);
        }
      });
    }

    this.dispatchGroupEvent('tmyl-card-group-selection', {
      selectedCards: this.getSelectedCards(),
      changedCard: clickedCard
    });
  }

  getSelectedCards() {
    return this.cards
      .filter(controller => controller.isSelected())
      .map(controller => controller.element);
  }

  selectAll() {
    if (this.options.multiSelect) {
      this.cards.forEach(controller => controller.setSelected(true));
    }
  }

  deselectAll() {
    this.cards.forEach(controller => controller.setSelected(false));
  }

  dispatchGroupEvent(eventName, detail = {}) {
    this.container.dispatchEvent(new CustomEvent(eventName, {
      detail,
      bubbles: true,
      composed: true
    }));
  }

  destroy() {
    this.cards.forEach(controller => controller.destroy());
    this.cards = [];
  }
}
