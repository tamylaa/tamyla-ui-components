/**
 * Action Card Main Module
 * Modular action card component with separated concerns
 */

import { ACTION_CARD_CONFIG } from './config/action-card-config.js';
import { ActionCardController } from './controllers/action-card-controller-new.js';
import { getActionIcon, createIconElement } from './icons/action-card-icons-new.js';

/**
 * Template loader utility
 */
async function loadTemplate(templatePath) {
  try {
    const response = await fetch(templatePath);
    if (!response.ok) {
      throw new Error(`Failed to load template: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.error('Template loading error:', error);
    // Fallback inline template
    return `
      <div class="action-card-container">
        <div class="action-card-icon">
          <span class="icon-content"></span>
        </div>
        <div class="action-card-content">
          <h3 class="action-card-title"></h3>
          <p class="action-card-description"></p>
          <div class="action-card-progress" style="display: none;">
            <div class="progress-bar">
              <div class="progress-fill"></div>
            </div>
            <span class="progress-text"></span>
          </div>
        </div>
        <div class="action-card-reward">
          <span class="reward-badge"></span>
        </div>
        <div class="action-card-completion" style="display: none;">
          <span class="completion-badge">✓ Completed</span>
        </div>
      </div>
    `;
  }
}

/**
 * Style injection utility
 */
function injectStyles() {
  const styleId = 'action-card-styles';
  
  if (document.getElementById(styleId)) {
    return; // Already injected
  }

  const link = document.createElement('link');
  link.id = styleId;
  link.rel = 'stylesheet';
  link.href = './styles/action-card.css';
  
  // Fallback to inline styles if CSS file not found
  link.onerror = () => {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .tmyl-action-card {
        display: flex;
        align-items: center;
        background: #ffffff;
        border: 1px solid #e1e5e9;
        border-radius: 12px;
        padding: 16px;
        transition: all 0.2s ease;
        cursor: pointer;
        text-align: left;
        width: 100%;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
      }
      .tmyl-action-card:hover:not(.disabled) {
        border-color: #3b82f6;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
        transform: translateY(-1px);
      }
      /* Add more critical styles as needed */
    `;
    document.head.appendChild(style);
  };
  
  document.head.appendChild(link);
}

/**
 * Create Action Card
 * @param {Object} options - Configuration options
 * @returns {Promise<Object>} Action card instance
 */
export async function createActionCard(options = {}) {
  // Merge with defaults
  const config = { ...ACTION_CARD_CONFIG.defaults, ...options };
  
  // Validate configuration
  if (config.title && config.title.length > ACTION_CARD_CONFIG.validation.title.maxLength) {
    throw new Error(`Title too long. Max ${ACTION_CARD_CONFIG.validation.title.maxLength} characters.`);
  }

  // Inject styles
  injectStyles();

  // Load template
  const templatePath = options.templatePath || './templates/action-card.html';
  const templateHTML = await loadTemplate(templatePath);

  // Create element
  const element = document.createElement('button');
  element.className = `tmyl-action-card ${config.className || ''}`;
  element.setAttribute('data-id', config.id || `action-${Date.now()}`);
  element.innerHTML = templateHTML;

  // Create controller
  const controller = new ActionCardController(element, config);

  // Return public API
  return {
    element,
    controller,
    
    // Convenience methods
    complete: () => controller.complete(),
    updateProgress: (progress) => controller.updateProgress(progress),
    setDisabled: (disabled) => controller.setDisabled(disabled),
    reset: () => controller.reset(),
    destroy: () => controller.destroy(),
    
    // State accessors
    get completed() { return controller.isCompleted(); },
    get disabled() { return controller.isDisabled(); },
    get state() { return controller.getState(); },
    get xpEarned() { return controller.getXPEarned(); }
  };
}

/**
 * Create Action Card from preset
 * @param {string} presetId - ID of trading portal preset
 * @param {Object} overrides - Option overrides
 * @returns {Promise<Object>} Action card instance
 */
export async function createActionCardFromPreset(presetId, overrides = {}) {
  const preset = ACTION_CARD_CONFIG.tradingPortalPresets?.find(p => p.id === presetId);
  
  if (!preset) {
    throw new Error(`Preset not found: ${presetId}`);
  }

  return createActionCard({ ...preset, ...overrides });
}

/**
 * Action Card Manager
 * Manages multiple action cards with coordination
 */
export class ActionCardManager {
  constructor() {
    this.cards = new Map();
    this.totalXP = 0;
  }

  async addCard(id, options) {
    const card = await createActionCard({ ...options, id });
    
    // Listen for completion events
    card.element.addEventListener('actioncard:complete', (event) => {
      this.totalXP += event.detail.xpEarned;
      
      // Trigger manager-level event
      document.dispatchEvent(new CustomEvent('actionmanager:xp-gained', {
        detail: {
          cardId: id,
          xpGained: event.detail.xpEarned,
          totalXP: this.totalXP,
          manager: this
        }
      }));
    });

    this.cards.set(id, card);
    return card;
  }

  getCard(id) {
    return this.cards.get(id);
  }

  getAllCards() {
    return Array.from(this.cards.values());
  }

  getTotalXP() {
    return this.totalXP;
  }

  getCompletedCards() {
    return this.getAllCards().filter(card => card.completed);
  }

  resetAll() {
    this.cards.forEach(card => card.reset());
    this.totalXP = 0;
  }

  destroyAll() {
    this.cards.forEach(card => card.destroy());
    this.cards.clear();
    this.totalXP = 0;
  }
}

// Export additional utilities
export { ACTION_CARD_CONFIG, getActionIcon, createIconElement };
