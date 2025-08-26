/**
 * Button Component Logic
 * Pure JavaScript logic for button behavior
 */

export class ButtonController {
  constructor(element) {
    this.element = element;
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.element.addEventListener('click', this.handleClick.bind(this));
    this.element.addEventListener('keydown', this.handleKeydown.bind(this));
  }

  handleClick(event) {
    if (this.isDisabled() || this.isLoading()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.dispatchCustomEvent('tmyl-click', {
      originalEvent: event
    });
  }

  handleKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.handleClick(event);
    }
  }

  isDisabled() {
    return this.element.hasAttribute('disabled') || 
           this.element.disabled === true;
  }

  isLoading() {
    return this.element.hasAttribute('loading') || 
           this.element.loading === true;
  }

  setLoading(loading) {
    if (loading) {
      this.element.setAttribute('loading', '');
      this.element.classList.add('tmyl-button--loading');
    } else {
      this.element.removeAttribute('loading');
      this.element.classList.remove('tmyl-button--loading');
    }
  }

  setDisabled(disabled) {
    if (disabled) {
      this.element.setAttribute('disabled', '');
      this.element.disabled = true;
    } else {
      this.element.removeAttribute('disabled');
      this.element.disabled = false;
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
    this.element.removeEventListener('click', this.handleClick);
    this.element.removeEventListener('keydown', this.handleKeydown);
  }
}

/**
 * Factory function to create button controller
 */
export function createButtonController(element, config = {}) {
  return new ButtonController(element, config);
}
