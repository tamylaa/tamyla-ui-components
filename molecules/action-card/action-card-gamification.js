/**
 * Action Card Component with Gamification
 * Implements Trading Portal's reward-based action patterns
 * Single responsibility: Display actionable cards with XP rewards and visual feedback
 */

import { ENHANCED_TOKENS } from '../../core/design-tokens.js';

/**
 * Create an Action Card with gamification elements
 * @param {Object} options - Action card configuration
 * @returns {HTMLElement} Action card element with reward system
 */
export function createActionCard(options = {}) {
  const {
    id = `action-${Date.now()}`,
    title = 'Action',
    description = '',
    icon = '⚡',
    reward = '+0 XP',
    color = ENHANCED_TOKENS.colors.primary.bg,
    onClick,
    disabled = false,
    completed = false,
    progress = null, // 0-100 for progress indicators
    className = ''
  } = options;

  const card = document.createElement('button');
  card.className = `tmyl-action-card ${className} ${completed ? 'completed' : ''} ${disabled ? 'disabled' : ''}`;
  card.setAttribute('data-id', id);
  card.disabled = disabled;

  // Create card structure
  card.innerHTML = `
    <div class="action-card-icon" style="color: ${color}">
      ${icon}
    </div>
    <div class="action-card-content">
      <h3 class="action-card-title">${title}</h3>
      <p class="action-card-description">${description}</p>
      ${progress !== null ? `
        <div class="action-card-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${progress}%"></div>
          </div>
          <span class="progress-text">${progress}% Complete</span>
        </div>
      ` : ''}
    </div>
    <div class="action-card-reward ${completed ? 'earned' : ''}">
      ${completed ? '✅' : reward}
    </div>
    ${completed ? '<div class="completion-badge">🏆</div>' : ''}
  `;

  // Add click handler with visual feedback
  if (onClick && !disabled) {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Add click animation
      card.classList.add('clicking');
      setTimeout(() => card.classList.remove('clicking'), 150);
      
      // Call handler with card data
      onClick({
        id,
        title,
        description,
        reward,
        element: card
      });
    });
  }

  // Add hover effects
  if (!disabled) {
    card.addEventListener('mouseenter', () => {
      card.style.setProperty('--hover-color', color);
    });
  }

  return card;
}

/**
 * Create Action Card Grid Container
 * @param {Object} options - Grid configuration
 * @returns {HTMLElement} Grid container for action cards
 */
export function createActionCardGrid(options = {}) {
  const {
    columns = 'auto-fit',
    minWidth = '280px',
    gap = ENHANCED_TOKENS.spacing.lg,
    className = ''
  } = options;

  const grid = document.createElement('div');
  grid.className = `tmyl-action-card-grid ${className}`;
  grid.style.cssText = `
    display: grid;
    grid-template-columns: repeat(${columns}, minmax(${minWidth}, 1fr));
    gap: ${gap};
    width: 100%;
  `;

  return grid;
}

/**
 * Predefined Action Cards from Trading Portal patterns
 */
export const TRADING_PORTAL_ACTIONS = {
  uploadContent: {
    id: 'upload-content',
    title: 'Upload Content',
    description: 'Add new files to your library',
    icon: '📎',
    color: '#667eea',
    reward: '+10 XP'
  },
  
  testComponents: {
    id: 'test-components',
    title: 'Test Enhanced Components',
    description: 'Try new features and improvements',
    icon: '🧪',
    color: '#00d2ff',
    reward: '+15 XP'
  },
  
  enhancedTrading: {
    id: 'enhanced-trading',
    title: 'Enhanced Trading',
    description: 'Real-time trading dashboard',
    icon: '📈',
    color: '#4ecdc4',
    reward: '+20 XP'
  },
  
  viewAnalytics: {
    id: 'view-analytics',
    title: 'View Analytics',
    description: 'Check your performance',
    icon: '📊',
    color: '#764ba2',
    reward: '+5 XP'
  },
  
  dailySummary: {
    id: 'daily-summary',
    title: 'Daily Summary',
    description: 'See your dashboard overview',
    icon: '📋',
    color: '#f093fb',
    reward: '+3 XP'
  },
  
  achievements: {
    id: 'achievements',
    title: 'View Achievements',
    description: 'Check your milestones',
    icon: '🏆',
    color: '#f5576c',
    reward: '+2 XP'
  }
};

/**
 * Action Card Manager - handles state and interactions
 */
export class ActionCardManager {
  constructor() {
    this.cards = new Map();
    this.completedActions = new Set();
    this.onActionComplete = null;
  }

  /**
   * Register an action card
   */
  register(card, options) {
    this.cards.set(options.id, { card, options });
    return this;
  }

  /**
   * Mark action as completed
   */
  completeAction(actionId, earnedXP = 0) {
    const cardData = this.cards.get(actionId);
    if (!cardData) return false;

    this.completedActions.add(actionId);
    cardData.card.classList.add('completed');
    
    // Update reward display
    const rewardElement = cardData.card.querySelector('.action-card-reward');
    if (rewardElement) {
      rewardElement.textContent = '✅';
      rewardElement.classList.add('earned');
    }

    // Add completion badge
    if (!cardData.card.querySelector('.completion-badge')) {
      const badge = document.createElement('div');
      badge.className = 'completion-badge';
      badge.textContent = '🏆';
      cardData.card.appendChild(badge);
    }

    // Trigger completion callback
    if (this.onActionComplete) {
      this.onActionComplete({
        actionId,
        earnedXP,
        title: cardData.options.title
      });
    }

    return true;
  }

  /**
   * Update progress for an action
   */
  updateProgress(actionId, progress) {
    const cardData = this.cards.get(actionId);
    if (!cardData) return false;

    const progressFill = cardData.card.querySelector('.progress-fill');
    const progressText = cardData.card.querySelector('.progress-text');
    
    if (progressFill) {
      progressFill.style.width = `${progress}%`;
    }
    
    if (progressText) {
      progressText.textContent = `${progress}% Complete`;
    }

    // Auto-complete at 100%
    if (progress >= 100 && !this.completedActions.has(actionId)) {
      setTimeout(() => this.completeAction(actionId), 500);
    }

    return true;
  }

  /**
   * Get completion status
   */
  isCompleted(actionId) {
    return this.completedActions.has(actionId);
  }

  /**
   * Get total XP earned
   */
  getTotalXP() {
    let total = 0;
    for (const actionId of this.completedActions) {
      const cardData = this.cards.get(actionId);
      if (cardData) {
        const xpMatch = cardData.options.reward.match(/\+(\d+)/);
        if (xpMatch) {
          total += parseInt(xpMatch[1]);
        }
      }
    }
    return total;
  }
}
