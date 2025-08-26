/**
 * Action Card Controller
 * Pure business logic for action card component
 */

import { ACTION_CARD_CONFIG } from '../config/action-card-config.js';

export class ActionCardController {
  constructor(element, options = {}) {
    this.element = element;
    this.options = { ...ACTION_CARD_CONFIG.defaults, ...options };
    this.state = {
      completed: this.options.completed,
      disabled: this.options.disabled,
      progress: this.options.progress || 0,
      xpEarned: 0
    };
    
    this.init();
  }

  init() {
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    this.element.addEventListener('click', this.handleClick.bind(this));
  }

  handleClick(event) {
    if (this.state.disabled || this.state.completed) {
      event.preventDefault();
      return;
    }

    this.execute();
  }

  execute() {
    if (this.options.onExecute) {
      const result = this.options.onExecute(this);
      
      // Handle promise or direct result
      if (result && typeof result.then === 'function') {
        this.setLoading(true);
        result
          .then(() => this.complete())
          .catch((error) => this.handleError(error))
          .finally(() => this.setLoading(false));
      } else if (result !== false) {
        this.complete();
      }
    } else {
      this.complete();
    }
  }

  complete() {
    if (this.state.completed) return;

    this.state.completed = true;
    this.state.xpEarned = this.options.xpReward || 0;
    
    this.element.classList.add('completed', 'completing');
    
    // Remove completing animation after it finishes
    setTimeout(() => {
      this.element.classList.remove('completing');
    }, ACTION_CARD_CONFIG.animations.complete);

    // Show completion elements
    const completionEl = this.element.querySelector('.action-card-completion');
    if (completionEl) {
      completionEl.style.display = 'block';
    }

    // Trigger completion callback
    if (this.options.onComplete) {
      this.options.onComplete(this);
    }

    // Dispatch event
    this.element.dispatchEvent(new CustomEvent('actioncard:complete', {
      detail: {
        id: this.options.id,
        xpEarned: this.state.xpEarned,
        controller: this
      }
    }));
  }

  updateProgress(progress) {
    if (this.state.completed) return;

    this.state.progress = Math.max(0, Math.min(100, progress));
    
    const progressFill = this.element.querySelector('.progress-fill');
    const progressText = this.element.querySelector('.progress-text');
    
    if (progressFill) {
      progressFill.style.width = `${this.state.progress}%`;
    }
    
    if (progressText) {
      progressText.textContent = `${Math.round(this.state.progress)}% Complete`;
    }

    // Auto-complete at 100%
    if (this.state.progress >= 100) {
      setTimeout(() => this.complete(), 200);
    }

    // Trigger progress callback
    if (this.options.onProgress) {
      this.options.onProgress(this.state.progress, this);
    }
  }

  setDisabled(disabled) {
    this.state.disabled = disabled;
    
    if (disabled) {
      this.element.classList.add('disabled');
      this.element.setAttribute('disabled', 'true');
    } else {
      this.element.classList.remove('disabled');
      this.element.removeAttribute('disabled');
    }
  }

  setLoading(loading) {
    if (loading) {
      this.element.classList.add('loading');
      this.setDisabled(true);
    } else {
      this.element.classList.remove('loading');
      this.setDisabled(this.options.disabled);
    }
  }

  handleError(error) {
    console.error('Action card execution failed:', error);
    
    if (this.options.onError) {
      this.options.onError(error, this);
    }

    // Dispatch error event
    this.element.dispatchEvent(new CustomEvent('actioncard:error', {
      detail: {
        error,
        controller: this
      }
    }));
  }

  render() {
    // Update element with current state
    const titleEl = this.element.querySelector('.action-card-title');
    const descEl = this.element.querySelector('.action-card-description');
    const iconEl = this.element.querySelector('.icon-content');
    const rewardEl = this.element.querySelector('.reward-badge');
    const progressContainer = this.element.querySelector('.action-card-progress');

    if (titleEl && this.options.title) {
      titleEl.textContent = this.options.title;
    }

    if (descEl && this.options.description) {
      descEl.textContent = this.options.description;
    }

    if (iconEl && this.options.icon) {
      iconEl.textContent = this.options.icon;
    }

    if (rewardEl && this.options.xpReward) {
      rewardEl.textContent = `+${this.options.xpReward} XP`;
    }

    if (progressContainer && this.options.showProgress) {
      progressContainer.style.display = 'block';
      this.updateProgress(this.state.progress);
    }

    // Apply initial state
    if (this.state.completed) {
      this.element.classList.add('completed');
      const completionEl = this.element.querySelector('.action-card-completion');
      if (completionEl) {
        completionEl.style.display = 'block';
      }
    }

    if (this.state.disabled) {
      this.setDisabled(true);
    }
  }

  // Public API methods
  getState() {
    return { ...this.state };
  }

  getXPEarned() {
    return this.state.xpEarned;
  }

  isCompleted() {
    return this.state.completed;
  }

  isDisabled() {
    return this.state.disabled;
  }

  reset() {
    this.state.completed = false;
    this.state.progress = 0;
    this.state.xpEarned = 0;
    
    this.element.classList.remove('completed', 'completing');
    
    const completionEl = this.element.querySelector('.action-card-completion');
    if (completionEl) {
      completionEl.style.display = 'none';
    }

    this.render();
  }

  destroy() {
    // Clean up event listeners
    this.element.removeEventListener('click', this.handleClick);
    
    // Remove from DOM if needed
    if (this.element.parentNode && this.options.removeOnDestroy) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}
