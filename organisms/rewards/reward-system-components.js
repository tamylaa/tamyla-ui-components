/**
 * Reward System Components
 * Implements Trading Portal's gamification and achievement patterns
 * Single responsibility: Achievement badges, progress indicators, and reward notifications
 */

import { ENHANCED_TOKENS } from '../../core/design-tokens.js';

/**
 * Create Achievement Badge
 * @param {Object} options - Badge configuration
 * @returns {Object} Badge controller with element and methods
 */
export function createAchievementBadge(options = {}) {
  const {
    type = 'earned', // earned, locked, progress
    title = '',
    description = '',
    icon = '🏆',
    progress = 0, // 0-100 for progress type
    rarity = 'common', // common, uncommon, rare, epic, legendary
    earned = false,
    earnedDate = null,
    requirements = '',
    className = '',
    onClick
  } = options;

  const badge = document.createElement('div');
  badge.className = `tmyl-achievement-badge badge-${type} rarity-${rarity} ${className}`;
  badge.setAttribute('role', 'img');
  badge.setAttribute('aria-label', `Achievement: ${title}`);

  if (!earned && type !== 'progress') {
    badge.classList.add('locked');
  }

  let badgeContent = `
    <div class="badge-icon">
      <span class="icon">${icon}</span>
      ${type === 'progress' ? `
        <div class="progress-ring">
          <svg viewBox="0 0 36 36" class="circular-chart">
            <path class="circle-bg"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path class="circle"
              stroke-dasharray="${progress}, 100"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div class="percentage">${Math.round(progress)}%</div>
        </div>
      ` : ''}
    </div>
    <div class="badge-content">
      <h4 class="badge-title">${title}</h4>
      <p class="badge-description">${description}</p>
      ${requirements ? `<div class="badge-requirements">${requirements}</div>` : ''}
      ${earnedDate ? `<div class="badge-earned-date">Earned: ${earnedDate}</div>` : ''}
    </div>
  `;

  badge.innerHTML = badgeContent;

  // Methods
  const methods = {
    /**
     * Update progress (for progress type badges)
     */
    updateProgress(newProgress) {
      if (type !== 'progress') return false;

      const progressRing = badge.querySelector('.circle');
      const percentageDisplay = badge.querySelector('.percentage');

      if (progressRing && percentageDisplay) {
        progressRing.style.strokeDasharray = `${newProgress}, 100`;
        percentageDisplay.textContent = `${Math.round(newProgress)}%`;

        // Check if completed
        if (newProgress >= 100) {
          this.markAsEarned(new Date().toLocaleDateString());
        }

        return true;
      }

      return false;
    },

    /**
     * Mark badge as earned
     */
    markAsEarned(date = null) {
      badge.classList.remove('locked');
      badge.classList.add('earned');

      // Add earned date
      if (date) {
        let earnedDateEl = badge.querySelector('.badge-earned-date');
        if (!earnedDateEl) {
          earnedDateEl = document.createElement('div');
          earnedDateEl.className = 'badge-earned-date';
          badge.querySelector('.badge-content').appendChild(earnedDateEl);
        }
        earnedDateEl.textContent = `Earned: ${date}`;
      }

      // Trigger celebration animation
      badge.classList.add('earning-animation');
      setTimeout(() => {
        badge.classList.remove('earning-animation');
      }, 1000);

      // Dispatch event
      badge.dispatchEvent(new CustomEvent('badge-earned', {
        detail: { title, date, badge: methods }
      }));

      return true;
    },

    /**
     * Update badge content
     */
    updateContent({ title: newTitle, description: newDescription, requirements: newRequirements }) {
      if (newTitle) {
        const titleEl = badge.querySelector('.badge-title');
        if (titleEl) titleEl.textContent = newTitle;
      }

      if (newDescription) {
        const descEl = badge.querySelector('.badge-description');
        if (descEl) descEl.textContent = newDescription;
      }

      if (newRequirements) {
        let reqEl = badge.querySelector('.badge-requirements');
        if (!reqEl) {
          reqEl = document.createElement('div');
          reqEl.className = 'badge-requirements';
          badge.querySelector('.badge-content').appendChild(reqEl);
        }
        reqEl.textContent = newRequirements;
      }

      return true;
    },

    /**
     * Get badge element
     */
    get element() { return badge; }
  };

  // Event handlers
  if (onClick) {
    badge.addEventListener('click', () => onClick(methods));
    badge.style.cursor = 'pointer';
  }

  return methods;
}

/**
 * Create Progress Indicator
 * @param {Object} options - Progress configuration
 * @returns {Object} Progress controller with element and methods
 */
export function createProgressIndicator(options = {}) {
  const {
    type = 'linear', // linear, circular, steps
    value = 0, // 0-100
    max = 100,
    showValue = true,
    showLabel = true,
    label = 'Progress',
    color = 'primary',
    size = 'medium', // small, medium, large
    animated = true,
    steps = [], // For steps type: [{label: 'Step 1', completed: true}, ...]
    className = ''
  } = options;

  const container = document.createElement('div');
  container.className = `tmyl-progress-indicator progress-${type} size-${size} color-${color} ${className}`;
  container.setAttribute('role', 'progressbar');
  container.setAttribute('aria-valuenow', value);
  container.setAttribute('aria-valuemin', '0');
  container.setAttribute('aria-valuemax', max);

  if (showLabel && label) {
    container.setAttribute('aria-label', label);
  }

  let progressContent = '';

  if (showLabel && label) {
    progressContent += `<div class="progress-label">${label}</div>`;
  }

  if (type === 'linear') {
    progressContent += `
      <div class="progress-track">
        <div class="progress-fill" style="width: ${(value / max) * 100}%"></div>
      </div>
    `;

    if (showValue) {
      progressContent += `<div class="progress-value">${value}/${max}</div>`;
    }
  } else if (type === 'circular') {
    const percentage = (value / max) * 100;
    const strokeDasharray = `${percentage} ${100 - percentage}`;

    progressContent += `
      <div class="progress-circle">
        <svg viewBox="0 0 36 36" class="circular-chart">
          <path class="circle-bg"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path class="circle"
            stroke-dasharray="${strokeDasharray}"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        ${showValue ? `<div class="progress-percentage">${Math.round(percentage)}%</div>` : ''}
      </div>
    `;
  } else if (type === 'steps') {
    progressContent += '<div class="progress-steps">';

    steps.forEach((step, index) => {
      const isCompleted = step.completed ? 'completed' : '';
      const isCurrent = index === steps.findIndex(s => !s.completed) ? 'current' : '';

      progressContent += `
        <div class="progress-step ${isCompleted} ${isCurrent}">
          <div class="step-indicator">
            ${step.completed ? '✓' : index + 1}
          </div>
          <div class="step-label">${step.label}</div>
        </div>
      `;

      // Add connector except for last step
      if (index < steps.length - 1) {
        progressContent += `<div class="step-connector ${isCompleted}"></div>`;
      }
    });

    progressContent += '</div>';
  }

  container.innerHTML = progressContent;

  // Methods
  const methods = {
    /**
     * Update progress value
     */
    updateValue(newValue) {
      const clampedValue = Math.max(0, Math.min(max, newValue));

      container.setAttribute('aria-valuenow', clampedValue);

      if (type === 'linear') {
        const fill = container.querySelector('.progress-fill');
        if (fill) {
          fill.style.width = `${(clampedValue / max) * 100}%`;
        }

        const valueDisplay = container.querySelector('.progress-value');
        if (valueDisplay && showValue) {
          valueDisplay.textContent = `${clampedValue}/${max}`;
        }
      } else if (type === 'circular') {
        const percentage = (clampedValue / max) * 100;
        const circle = container.querySelector('.circle');
        if (circle) {
          circle.style.strokeDasharray = `${percentage} ${100 - percentage}`;
        }

        const percentageDisplay = container.querySelector('.progress-percentage');
        if (percentageDisplay && showValue) {
          percentageDisplay.textContent = `${Math.round(percentage)}%`;
        }
      }

      // Trigger completion event
      if (clampedValue >= max) {
        container.dispatchEvent(new CustomEvent('progress-complete', {
          detail: { value: clampedValue, max, progress: methods }
        }));
      }

      return true;
    },

    /**
     * Update steps (for steps type)
     */
    updateSteps(newSteps) {
      if (type !== 'steps') return false;

      const stepsContainer = container.querySelector('.progress-steps');
      if (!stepsContainer) return false;

      let stepsContent = '';
      newSteps.forEach((step, index) => {
        const isCompleted = step.completed ? 'completed' : '';
        const isCurrent = index === newSteps.findIndex(s => !s.completed) ? 'current' : '';

        stepsContent += `
          <div class="progress-step ${isCompleted} ${isCurrent}">
            <div class="step-indicator">
              ${step.completed ? '✓' : index + 1}
            </div>
            <div class="step-label">${step.label}</div>
          </div>
        `;

        if (index < newSteps.length - 1) {
          stepsContent += `<div class="step-connector ${isCompleted}"></div>`;
        }
      });

      stepsContainer.innerHTML = stepsContent;
      return true;
    },

    /**
     * Update label
     */
    updateLabel(newLabel) {
      const labelEl = container.querySelector('.progress-label');
      if (labelEl) {
        labelEl.textContent = newLabel;
        container.setAttribute('aria-label', newLabel);
        return true;
      }
      return false;
    },

    /**
     * Get current value
     */
    getValue() {
      return parseInt(container.getAttribute('aria-valuenow')) || 0;
    },

    /**
     * Reset progress
     */
    reset() {
      return this.updateValue(0);
    },

    /**
     * Complete progress
     */
    complete() {
      return this.updateValue(max);
    },

    /**
     * Get element
     */
    get element() { return container; }
  };

  return methods;
}

/**
 * Create Reward Notification
 * @param {Object} options - Notification configuration
 * @returns {Object} Notification controller with element and methods
 */
export function createRewardNotification(options = {}) {
  const {
    type = 'xp', // xp, achievement, level, badge
    title = '',
    message = '',
    value = '',
    icon = '⭐',
    duration = 4000,
    position = 'top-right', // top-left, top-right, bottom-left, bottom-right, center
    animated = true,
    autoHide = true,
    onShow,
    onHide,
    onClick
  } = options;

  const notification = document.createElement('div');
  notification.className = `tmyl-reward-notification notification-${type} position-${position}`;
  notification.setAttribute('role', 'alert');
  notification.style.display = 'none';

  notification.innerHTML = `
    <div class="notification-content">
      <div class="notification-icon">${icon}</div>
      <div class="notification-text">
        <h4 class="notification-title">${title}</h4>
        <p class="notification-message">${message}</p>
        ${value ? `<div class="notification-value">${value}</div>` : ''}
      </div>
      <button class="notification-close" aria-label="Close notification">×</button>
    </div>
  `;

  // Add to document
  document.body.appendChild(notification);

  let hideTimeout;

  // Methods
  const methods = {
    /**
     * Show notification
     */
    show() {
      notification.style.display = 'block';

      if (animated) {
        // Force reflow
        notification.offsetHeight;
        notification.classList.add('showing');
      }

      if (onShow) onShow(methods);

      // Auto-hide
      if (autoHide && duration > 0) {
        hideTimeout = setTimeout(() => {
          this.hide();
        }, duration);
      }

      // Dispatch event
      notification.dispatchEvent(new CustomEvent('notification-shown', {
        detail: { notification: methods }
      }));

      return this;
    },

    /**
     * Hide notification
     */
    hide() {
      if (hideTimeout) {
        clearTimeout(hideTimeout);
        hideTimeout = null;
      }

      if (animated) {
        notification.classList.add('hiding');
        setTimeout(() => {
          notification.style.display = 'none';
          notification.classList.remove('showing', 'hiding');
        }, 300);
      } else {
        notification.style.display = 'none';
      }

      if (onHide) onHide(methods);

      // Dispatch event
      notification.dispatchEvent(new CustomEvent('notification-hidden', {
        detail: { notification: methods }
      }));

      return this;
    },

    /**
     * Update content
     */
    updateContent({ title: newTitle, message: newMessage, value: newValue, icon: newIcon }) {
      if (newTitle) {
        const titleEl = notification.querySelector('.notification-title');
        if (titleEl) titleEl.textContent = newTitle;
      }

      if (newMessage) {
        const messageEl = notification.querySelector('.notification-message');
        if (messageEl) messageEl.textContent = newMessage;
      }

      if (newValue !== undefined) {
        let valueEl = notification.querySelector('.notification-value');
        if (!valueEl && newValue) {
          valueEl = document.createElement('div');
          valueEl.className = 'notification-value';
          notification.querySelector('.notification-text').appendChild(valueEl);
        }
        if (valueEl) {
          valueEl.textContent = newValue;
        }
      }

      if (newIcon) {
        const iconEl = notification.querySelector('.notification-icon');
        if (iconEl) iconEl.textContent = newIcon;
      }

      return this;
    },

    /**
     * Destroy notification
     */
    destroy() {
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }

      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    },

    /**
     * Get element
     */
    get element() { return notification; }
  };

  // Event handlers
  const closeButton = notification.querySelector('.notification-close');
  if (closeButton) {
    closeButton.addEventListener('click', methods.hide);
  }

  if (onClick) {
    notification.addEventListener('click', () => onClick(methods));
    notification.style.cursor = 'pointer';
  }

  return methods;
}

/**
 * Trading Portal Achievement Presets
 */
export const TRADING_PORTAL_ACHIEVEMENTS = [
  {
    id: 'first-trade',
    title: 'First Trade',
    description: 'Execute your first successful trade',
    icon: '🎯',
    rarity: 'common',
    requirements: 'Complete 1 trade'
  },
  {
    id: 'volume-master',
    title: 'Volume Master',
    description: 'Trade over $10,000 in volume',
    icon: '📈',
    rarity: 'uncommon',
    requirements: 'Reach $10,000 in trading volume'
  },
  {
    id: 'streak-keeper',
    title: 'Streak Keeper',
    description: 'Maintain a 7-day trading streak',
    icon: '🔥',
    rarity: 'rare',
    requirements: 'Trade for 7 consecutive days'
  },
  {
    id: 'portfolio-builder',
    title: 'Portfolio Builder',
    description: 'Diversify across 10+ instruments',
    icon: '💼',
    rarity: 'epic',
    requirements: 'Hold 10 different instruments'
  },
  {
    id: 'legendary-trader',
    title: 'Legendary Trader',
    description: 'Achieve 90%+ success rate over 100 trades',
    icon: '👑',
    rarity: 'legendary',
    requirements: '90% success rate over 100 trades'
  }
];

/**
 * Reward System Manager
 * Manages achievements, progress tracking, and notifications
 */
export class RewardSystemManager {
  constructor() {
    this.achievements = new Map();
    this.progress = new Map();
    this.notifications = [];
  }

  /**
   * Register achievement
   */
  registerAchievement(id, config) {
    const badge = createAchievementBadge(config);
    this.achievements.set(id, badge);
    return badge;
  }

  /**
   * Unlock achievement
   */
  unlockAchievement(id, showNotification = true) {
    const badge = this.achievements.get(id);
    if (!badge) return false;

    badge.markAsEarned(new Date().toLocaleDateString());

    if (showNotification) {
      const notification = createRewardNotification({
        type: 'achievement',
        title: 'Achievement Unlocked!',
        message: badge.element.querySelector('.badge-title').textContent,
        icon: '🏆',
        duration: 5000
      });

      notification.show();
      this.notifications.push(notification);
    }

    return true;
  }

  /**
   * Update progress
   */
  updateProgress(id, value) {
    const progressIndicator = this.progress.get(id);
    if (progressIndicator) {
      progressIndicator.updateValue(value);
      return true;
    }
    return false;
  }

  /**
   * Show XP notification
   */
  showXPGain(amount) {
    const notification = createRewardNotification({
      type: 'xp',
      title: 'XP Gained!',
      message: 'Experience points earned',
      value: `+${amount} XP`,
      icon: '⭐',
      duration: 3000
    });

    notification.show();
    this.notifications.push(notification);
    return notification;
  }

  /**
   * Clear all notifications
   */
  clearNotifications() {
    this.notifications.forEach(notification => {
      notification.destroy();
    });
    this.notifications = [];
  }
}
