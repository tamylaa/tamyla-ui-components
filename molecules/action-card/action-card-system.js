/**
 * Enhanced Action Card Component - Trading Portal Gamification Patterns
 * Premium interactive cards with rewards, progress, and micro-interactions
 */

import { designTokens } from '../../core/design-tokens.js';
import { sharedUtilities } from '../../core/shared-utilities.js';
import { createActionCardTemplate } from './templates/action-card-template.js';
import { ActionCardController, actionCardUtils } from './controllers/action-card-controller.js';
import { defaultActionCardProps, actionCardConfig, actionCardValidation } from './config/action-card-config.js';

/**
 * Action Card Factory - Creates gamified action cards with Trading Portal sophistication
 */
export class ActionCardFactory {
  constructor() {
    this.defaultProps = defaultActionCardProps;
    this.config = actionCardConfig;
    this.validation = actionCardValidation;

    // Ensure CSS is loaded
    this.ensureCSS();
  }

  /**
   * Ensure CSS is loaded
   */
  ensureCSS() {
    if (!document.querySelector('link[href*="tmyl-action-card.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = new URL('./styles/tmyl-action-card.css', import.meta.url).href;
      document.head.appendChild(link);
    }
  }

  /**
   * Create enhanced action card with Trading Portal patterns
   */
  create(props = {}) {
    const finalProps = { ...this.defaultProps, ...props };
    
    // Validate props
    const validationErrors = this.validation.validateProps(finalProps);
    if (validationErrors.length > 0) {
      console.warn('Action Card validation errors:', validationErrors);
    }
    
    // Create card container
    const card = document.createElement('div');
    card.className = actionCardUtils.buildCardClasses(finalProps);
    
    // Create card structure
    card.innerHTML = createActionCardTemplate(finalProps);
    
    // Attach controller for interactions and state management
    const controller = new ActionCardController(card, finalProps);
    
    // Store controller reference for later access
    card._actionCardController = controller;
    
    return card;
  }

  /**
   * Update card progress
   */
  updateProgress(card, progress) {
    const controller = card._actionCardController;
    if (controller) {
      controller.updateProgress(progress);
    }
  }

  /**
   * Mark card as completed
   */
  markAsCompleted(card) {
    const controller = card._actionCardController;
    if (controller) {
      controller.markAsCompleted();
    }
  }

  /**
   * Destroy card and cleanup resources
   */
  destroy(card) {
    const controller = card._actionCardController;
    if (controller) {
      controller.destroy();
      delete card._actionCardController;
    }
  }

  /**
   * Shorthand creation methods
   */
  createAvailable(props) {
    return this.create({ ...props, status: 'available' });
  }

  createCompleted(props) {
    return this.create({ ...props, status: 'completed' });
  }

  createLocked(props) {
    return this.create({ ...props, status: 'locked' });
  }

  createWithProgress(props) {
    return this.create({ ...props, showProgress: true });
  }
}

// Export factory instance
export const actionCardFactory = new ActionCardFactory();
