/**
 * Reward System - Main Module
 * Coordinated reward system with achievements, progress tracking, and notifications
 */

import AchievementController from './controllers/achievement-controller.js';
import ProgressController from './controllers/progress-controller.js';
import NotificationController from './controllers/notification-controller.js';
import { GAMIFICATION_PRESETS, XP_CONFIG, ACHIEVEMENT_CONFIG } from './config/reward-config.js';

class RewardSystem {
  constructor(options = {}) {
    this.options = {
      preset: 'beginner',
      autoInitialize: true,
      enableAchievements: true,
      enableProgress: true,
      enableNotifications: true,
      enableXP: true,
      enableLeveling: true,
      ...options
    };

    this.initialized = false;
    this.userData = {
      xp: 0,
      level: 1,
      achievements: new Map(),
      statistics: {
        totalXP: 0,
        achievementsEarned: 0,
        currentStreak: 0,
        maxStreak: 0,
        joinedAt: Date.now()
      }
    };

    // Initialize controllers
    this.controllers = {};
    
    if (this.options.autoInitialize) {
      this.initialize();
    }
  }

  /**
   * Initialize the reward system
   */
  async initialize() {
    if (this.initialized) return;

    try {
      // Load CSS styles
      await this.loadStyles();

      // Initialize controllers based on options
      if (this.options.enableAchievements) {
        this.controllers.achievements = new AchievementController({
          autoSave: true,
          trackProgress: true
        });
        this.bindAchievementEvents();
      }

      if (this.options.enableProgress) {
        this.controllers.progress = new ProgressController({
          enableAnimations: true,
          batchUpdates: true
        });
      }

      if (this.options.enableNotifications) {
        this.controllers.notifications = new NotificationController({
          maxVisible: 3,
          enableSound: true,
          enableAnimations: true
        });
      }

      // Load user data
      this.loadUserData();

      // Apply preset configuration
      if (this.options.preset) {
        this.applyPreset(this.options.preset);
      }

      this.initialized = true;
      this.emit('system:initialized');

    } catch (error) {
      console.error('Failed to initialize reward system:', error);
      throw error;
    }
  }

  /**
   * Load CSS styles
   */
  async loadStyles() {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/ui-components/organisms/rewards/styles/reward-system.css';
      
      link.onload = resolve;
      link.onerror = () => {
        console.warn('Failed to load reward system styles, using fallback');
        resolve(); // Don't fail initialization
      };
      
      document.head.appendChild(link);
    });
  }

  /**
   * Apply gamification preset
   */
  applyPreset(presetName) {
    const preset = GAMIFICATION_PRESETS[presetName];
    if (!preset) {
      console.warn(`Unknown preset: ${presetName}`);
      return;
    }

    // Apply XP multiplier
    this.xpMultiplier = preset.xpMultiplier || 1.0;

    // Configure notifications
    if (this.controllers.notifications && preset.notifications) {
      this.controllers.notifications.updateOptions({
        enableSound: preset.notifications.sound !== false
      });
    }

    this.emit('preset:applied', { preset: presetName, config: preset });
  }

  /**
   * Bind achievement controller events
   */
  bindAchievementEvents() {
    const achievements = this.controllers.achievements;
    
    achievements.on('achievement:earned', (data) => {
      this.handleAchievementEarned(data);
    });

    achievements.on('progress:updated', (data) => {
      this.handleProgressUpdated(data);
    });

    achievements.on('xp:awarded', (data) => {
      this.awardXP(data.points, data.source);
    });
  }

  /**
   * Handle achievement earned
   */
  handleAchievementEarned(data) {
    const { achievement, userProgress } = data;
    
    // Update statistics
    this.userData.statistics.achievementsEarned++;
    
    // Show notification
    if (this.controllers.notifications) {
      this.controllers.notifications.showAchievement(achievement);
    }

    // Check for level up
    this.checkLevelUp();
    
    this.emit('achievement:earned', data);
  }

  /**
   * Handle progress updated
   */
  handleProgressUpdated(data) {
    this.emit('progress:updated', data);
  }

  /**
   * Award XP points
   */
  awardXP(points, source = 'Unknown') {
    if (!this.options.enableXP) return;

    const multipliedPoints = Math.floor(points * (this.xpMultiplier || 1.0));
    const oldXP = this.userData.xp;
    const oldLevel = this.userData.level;
    
    this.userData.xp += multipliedPoints;
    this.userData.statistics.totalXP += multipliedPoints;

    // Show XP notification
    if (this.controllers.notifications) {
      this.controllers.notifications.showXP(multipliedPoints, source);
    }

    // Check for level up
    const levelData = this.checkLevelUp();
    
    this.emit('xp:awarded', {
      points: multipliedPoints,
      source,
      oldXP,
      newXP: this.userData.xp,
      levelUp: levelData ? true : false,
      level: this.userData.level
    });

    this.saveUserData();
    return multipliedPoints;
  }

  /**
   * Check and handle level up
   */
  checkLevelUp() {
    if (!this.options.enableLeveling) return null;

    const levelData = XP_CONFIG.getLevelFromXP(this.userData.xp);
    const oldLevel = this.userData.level;
    
    if (levelData.level > oldLevel) {
      this.userData.level = levelData.level;
      
      // Show level up notification
      if (this.controllers.notifications) {
        this.controllers.notifications.showLevelUp(levelData.level);
      }

      this.emit('level:up', {
        oldLevel,
        newLevel: levelData.level,
        xp: this.userData.xp,
        levelData
      });

      return levelData;
    }
    
    return null;
  }

  /**
   * Create achievement badge
   */
  createAchievementBadge(containerId, achievementId) {
    if (!this.controllers.achievements) {
      throw new Error('Achievement controller not initialized');
    }

    const achievement = this.controllers.achievements.achievements.get(achievementId);
    const progress = this.controllers.achievements.userProgress.get(achievementId);
    
    if (!achievement) {
      throw new Error(`Achievement not found: ${achievementId}`);
    }

    return this.renderAchievementBadge(containerId, achievement, progress);
  }

  /**
   * Render achievement badge
   */
  async renderAchievementBadge(containerId, achievement, progress) {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container not found: ${containerId}`);
    }

    // Load template
    const template = await this.loadTemplate('achievement-badge.html');
    
    // Create badge element
    const badgeElement = document.createElement('div');
    badgeElement.innerHTML = template;
    
    const badge = badgeElement.firstElementChild;
    
    // Apply data
    badge.classList.add(`rarity-${achievement.rarity.toLowerCase()}`);
    if (progress.earned) {
      badge.classList.add('earned');
    } else {
      badge.classList.add('locked');
    }

    // Fill content
    const icon = badge.querySelector('.badge-icon');
    const title = badge.querySelector('.badge-title');
    const description = badge.querySelector('.badge-description');
    const requirements = badge.querySelector('.badge-requirements');
    const earnedDate = badge.querySelector('.badge-earned-date');

    if (icon) icon.textContent = achievement.icon;
    if (title) title.textContent = achievement.title;
    if (description) description.textContent = achievement.description;
    
    if (requirements) {
      requirements.textContent = this.getRequirementsText(achievement);
    }
    
    if (earnedDate && progress.earned) {
      earnedDate.textContent = `Earned ${new Date(progress.earnedAt).toLocaleDateString()}`;
    }

    // Progress ring
    const progressRing = badge.querySelector('.progress-ring');
    if (progressRing && !progress.earned) {
      this.updateProgressRing(progressRing, progress.progress, this.getMaxProgress(achievement));
    }

    container.appendChild(badge);
    return badge;
  }

  /**
   * Create progress indicator
   */
  createProgress(containerId, config) {
    if (!this.controllers.progress) {
      throw new Error('Progress controller not initialized');
    }

    return this.controllers.progress.createProgress(containerId, config);
  }

  /**
   * Update progress
   */
  updateProgress(progressId, current, total = null) {
    if (!this.controllers.progress) return false;
    
    return this.controllers.progress.updateProgress(progressId, current, total);
  }

  /**
   * Show notification
   */
  showNotification(config) {
    if (!this.controllers.notifications) return null;
    
    return this.controllers.notifications.show(config);
  }

  /**
   * Track user action for achievements
   */
  trackAction(action, metadata = {}) {
    if (!this.controllers.achievements) return;

    // Common action mappings
    const actionMappings = {
      'trade_completed': { metric: 'trades_completed', increment: 1 },
      'module_completed': { metric: 'modules_completed', increment: 1 },
      'quiz_passed': { metric: 'quizzes_passed', increment: 1 },
      'forum_post': { metric: 'forum_posts', increment: 1 },
      'member_helped': { metric: 'members_helped', increment: 1 }
    };

    const mapping = actionMappings[action];
    if (mapping) {
      // Award XP for the action
      const xpSources = XP_CONFIG.sources;
      const xpAmount = xpSources[action.toUpperCase()] || 0;
      
      if (xpAmount > 0) {
        this.awardXP(xpAmount, action);
      }

      // Update relevant achievements
      this.updateAchievementsByMetric(mapping.metric, mapping.increment, metadata);
    }

    this.emit('action:tracked', { action, metadata });
  }

  /**
   * Update achievements by metric
   */
  updateAchievementsByMetric(metric, increment, metadata) {
    const achievements = this.controllers.achievements;
    
    achievements.achievements.forEach((achievement, id) => {
      const requirements = achievement.requirements;
      
      if (requirements.type === 'count' && requirements.metric === metric) {
        const currentProgress = achievements.userProgress.get(id).progress;
        achievements.updateProgress(id, currentProgress + increment, metadata);
      } else if (requirements.type === 'complex') {
        // Check if any condition uses this metric
        const hasMetric = requirements.conditions.some(condition => condition.metric === metric);
        if (hasMetric) {
          achievements.updateProgress(id, 1, metadata);
        }
      }
    });
  }

  /**
   * Get requirements text for achievement
   */
  getRequirementsText(achievement) {
    const { requirements } = achievement;
    
    switch (requirements.type) {
      case 'count':
        return `Complete ${requirements.target} ${requirements.metric.replace('_', ' ')}`;
      case 'condition':
        return `Meet specific condition: ${requirements.condition}`;
      case 'complex':
        return 'Meet multiple requirements';
      default:
        return 'Complete the requirements';
    }
  }

  /**
   * Get max progress for achievement
   */
  getMaxProgress(achievement) {
    const { requirements } = achievement;
    return requirements.type === 'count' ? requirements.target : 1;
  }

  /**
   * Update progress ring SVG
   */
  updateProgressRing(progressRing, current, total) {
    const circle = progressRing.querySelector('.circle');
    const percentage = progressRing.querySelector('.percentage');
    
    if (circle) {
      const radius = 30; // Based on SVG design
      const circumference = radius * 2 * Math.PI;
      const percent = (current / total) * 100;
      const offset = circumference - (percent / 100) * circumference;
      
      circle.style.strokeDasharray = `${circumference} ${circumference}`;
      circle.style.strokeDashoffset = offset;
    }
    
    if (percentage) {
      percentage.textContent = `${Math.round((current / total) * 100)}%`;
    }
  }

  /**
   * Load HTML template
   */
  async loadTemplate(templateName) {
    try {
      const response = await fetch(`/ui-components/organisms/rewards/templates/${templateName}`);
      if (!response.ok) throw new Error(`Failed to load template: ${templateName}`);
      return await response.text();
    } catch (error) {
      console.warn(`Failed to load template ${templateName}, using fallback`);
      return this.getFallbackTemplate(templateName);
    }
  }

  /**
   * Get fallback templates
   */
  getFallbackTemplate(templateName) {
    const templates = {
      'achievement-badge.html': `
        <div class="tmyl-achievement-badge">
          <div class="badge-icon">
            <div class="progress-ring">
              <svg class="circular-chart" width="64" height="64">
                <circle class="circle-bg" cx="32" cy="32" r="30"></circle>
                <circle class="circle" cx="32" cy="32" r="30"></circle>
              </svg>
              <div class="percentage">0%</div>
            </div>
          </div>
          <div class="badge-content">
            <h4 class="badge-title"></h4>
            <p class="badge-description"></p>
            <div class="badge-requirements"></div>
            <div class="badge-earned-date"></div>
          </div>
        </div>
      `,
      'progress-indicator.html': `
        <div class="tmyl-progress-indicator">
          <div class="progress-label"></div>
          <div class="progress-content"></div>
        </div>
      `,
      'reward-notification.html': `
        <div class="tmyl-reward-notification">
          <div class="notification-content">
            <div class="notification-icon"></div>
            <div class="notification-text">
              <div class="notification-title"></div>
              <div class="notification-message"></div>
              <div class="notification-value"></div>
            </div>
            <button class="notification-close">×</button>
          </div>
        </div>
      `
    };
    
    return templates[templateName] || '<div>Template not found</div>';
  }

  /**
   * Load user data
   */
  loadUserData() {
    try {
      const data = localStorage.getItem('tmyl_reward_system_user');
      if (data) {
        const parsed = JSON.parse(data);
        this.userData = { ...this.userData, ...parsed };
      }
    } catch (error) {
      console.warn('Failed to load user data:', error);
    }
  }

  /**
   * Save user data
   */
  saveUserData() {
    try {
      localStorage.setItem('tmyl_reward_system_user', JSON.stringify(this.userData));
    } catch (error) {
      console.warn('Failed to save user data:', error);
    }
  }

  /**
   * Get user statistics
   */
  getUserStats() {
    const levelData = XP_CONFIG.getLevelFromXP(this.userData.xp);
    const achievementStats = this.controllers.achievements ? 
      this.controllers.achievements.getStatistics() : {};
    
    return {
      ...this.userData.statistics,
      level: this.userData.level,
      xp: this.userData.xp,
      levelProgress: levelData,
      achievements: achievementStats
    };
  }

  /**
   * Reset all data
   */
  reset() {
    if (this.controllers.achievements) {
      this.controllers.achievements.reset();
    }
    
    if (this.controllers.notifications) {
      this.controllers.notifications.clearAll();
    }

    this.userData = {
      xp: 0,
      level: 1,
      achievements: new Map(),
      statistics: {
        totalXP: 0,
        achievementsEarned: 0,
        currentStreak: 0,
        maxStreak: 0,
        joinedAt: Date.now()
      }
    };
    
    this.saveUserData();
    this.emit('system:reset');
  }

  /**
   * Event system
   */
  on(event, callback) {
    if (!this.listeners) this.listeners = new Map();
    
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (!this.listeners) return;
    
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (!this.listeners) return;
    
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Destroy the reward system
   */
  destroy() {
    // Save data before destroying
    this.saveUserData();

    // Destroy controllers
    Object.values(this.controllers).forEach(controller => {
      if (typeof controller.destroy === 'function') {
        controller.destroy();
      }
    });

    // Clear references
    this.controllers = {};
    this.listeners = new Map();
    this.initialized = false;
    
    this.emit('system:destroyed');
  }
}

// Export the class and create a global instance
export default RewardSystem;

// Create global instance for easy access
if (typeof window !== 'undefined') {
  window.TamylaRewardSystem = RewardSystem;
}
