/**
 * Reward System Factory
 * Factory wrapper for the RewardSystem class to integrate with unified UI factory
 */

import RewardSystem from './reward-system.js';

/**
 * Reward System Factory
 * Creates reward system instances with unified factory pattern
 */
export function RewardSystemFactory(props = {}) {
  const {
    preset = 'beginner',
    autoInitialize = true,
    enableAchievements = true,
    enableProgress = true,
    enableNotifications = true,
    enableXP = true,
    enableLeveling = true,
    container = null,
    ...otherOptions
  } = props;

  let rewardSystem = null;
  let element = null;

  /**
   * Create reward system element
   */
  function createElement() {
    // Create container element for reward system UI
    element = document.createElement('div');
    element.className = 'tmyl-reward-system';
    element.setAttribute('data-preset', preset);

    // Create basic structure
    element.innerHTML = `
      <div class="tmyl-reward-system__header">
        <h3 class="tmyl-reward-system__title">Reward System</h3>
        <div class="tmyl-reward-system__stats">
          <div class="tmyl-reward-system__level">Level: <span class="level-value">1</span></div>
          <div class="tmyl-reward-system__xp">XP: <span class="xp-value">0</span></div>
        </div>
      </div>
      <div class="tmyl-reward-system__content">
        <div class="tmyl-reward-system__achievements">
          <h4>Achievements</h4>
          <div class="achievements-list"></div>
        </div>
        <div class="tmyl-reward-system__progress">
          <h4>Progress</h4>
          <div class="progress-list"></div>
        </div>
      </div>
    `;

    return element;
  }

  /**
   * Initialize reward system
   */
  function initializeRewardSystem() {
    if (!rewardSystem) {
      rewardSystem = new RewardSystem({
        preset,
        autoInitialize,
        enableAchievements,
        enableProgress,
        enableNotifications,
        enableXP,
        enableLeveling,
        ...otherOptions
      });

      // Set up event listeners to update UI
      if (rewardSystem && typeof rewardSystem.on === 'function') {
        rewardSystem.on('achievement:earned', (achievement) => {
          updateAchievementsList();
        });

        rewardSystem.on('level:up', (level) => {
          updateLevelDisplay(level);
        });

        rewardSystem.on('xp:gained', (xp) => {
          updateXPDisplay(xp);
        });
      }
    }
  }

  /**
   * Update achievements list in UI
   */
  function updateAchievementsList() {
    if (!element || !rewardSystem) return;

    const achievementsList = element.querySelector('.achievements-list');
    if (!achievementsList) return;

    const achievements = rewardSystem.getAchievements ? rewardSystem.getAchievements() : [];
    achievementsList.innerHTML = achievements.map(achievement => `
      <div class="achievement-item ${achievement.earned ? 'earned' : 'locked'}">
        <span class="achievement-icon">${achievement.icon || '🏆'}</span>
        <span class="achievement-title">${achievement.title}</span>
        ${achievement.earned ? '<span class="earned-badge">✓</span>' : ''}
      </div>
    `).join('');
  }

  /**
   * Update level display
   */
  function updateLevelDisplay(level) {
    if (!element) return;
    const levelValue = element.querySelector('.level-value');
    if (levelValue) {
      levelValue.textContent = level || 1;
    }
  }

  /**
   * Update XP display
   */
  function updateXPDisplay(xp) {
    if (!element) return;
    const xpValue = element.querySelector('.xp-value');
    if (xpValue) {
      xpValue.textContent = xp || 0;
    }
  }

  /**
   * Render to container
   */
  function render(targetContainer = container) {
    if (!targetContainer) {
      throw new Error('Container element required for rendering reward system');
    }

    if (!element) {
      createElement();
    }

    targetContainer.appendChild(element);

    if (!rewardSystem) {
      initializeRewardSystem();
    }

    // Initial UI updates
    updateAchievementsList();
    updateLevelDisplay(rewardSystem?.userData?.level || 1);
    updateXPDisplay(rewardSystem?.userData?.xp || 0);

    return element;
  }

  /**
   * Get reward system instance
   */
  function getRewardSystem() {
    if (!rewardSystem) {
      initializeRewardSystem();
    }
    return rewardSystem;
  }

  /**
   * Get element
   */
  function getElement() {
    if (!element) {
      createElement();
    }
    return element;
  }

  /**
   * Award XP
   */
  function awardXP(amount) {
    if (rewardSystem && typeof rewardSystem.awardXP === 'function') {
      rewardSystem.awardXP(amount);
      updateXPDisplay(rewardSystem.userData.xp);
    }
  }

  /**
   * Check achievement
   */
  function checkAchievement(achievementId) {
    if (rewardSystem && typeof rewardSystem.checkAchievement === 'function') {
      return rewardSystem.checkAchievement(achievementId);
    }
    return false;
  }

  /**
   * Get user data
   */
  function getUserData() {
    return rewardSystem ? rewardSystem.userData : null;
  }

  /**
   * Get achievements
   */
  function getAchievements() {
    return rewardSystem && typeof rewardSystem.getAchievements === 'function'
      ? rewardSystem.getAchievements()
      : [];
  }

  /**
   * Destroy and cleanup
   */
  function destroy() {
    if (rewardSystem && typeof rewardSystem.destroy === 'function') {
      rewardSystem.destroy();
    }

    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }

    rewardSystem = null;
    element = null;
  }

  /**
   * Public API
   */
  return {
    // Core methods
    render,
    destroy,

    // Reward system methods
    awardXP,
    checkAchievement,
    getUserData,
    getAchievements,

    // Element access
    getElement,
    getRewardSystem,

    // Properties
    get props() {
      return {
        preset,
        autoInitialize,
        enableAchievements,
        enableProgress,
        enableNotifications,
        enableXP,
        enableLeveling
      };
    }
  };
}

/**
 * Reward System Templates
 * Pre-configured reward system factories
 */
export const RewardSystemTemplates = {
  /**
   * Beginner preset
   */
  beginner: (props = {}) => RewardSystemFactory({
    preset: 'beginner',
    ...props
  }),

  /**
   * Advanced preset
   */
  advanced: (props = {}) => RewardSystemFactory({
    preset: 'advanced',
    ...props
  }),

  /**
   * Expert preset
   */
  expert: (props = {}) => RewardSystemFactory({
    preset: 'expert',
    ...props
  }),

  /**
   * Minimal preset (achievements only)
   */
  minimal: (props = {}) => RewardSystemFactory({
    preset: 'minimal',
    enableProgress: false,
    enableXP: false,
    enableLeveling: false,
    ...props
  })
};
