/**
 * Achievement Controller
 * Handles achievement badge logic, progress tracking, and earning mechanics
 */

import { ACHIEVEMENT_CONFIG, XP_CONFIG, VALIDATION_RULES } from '../config/reward-config.js';

class AchievementController {
  constructor(options = {}) {
    this.achievements = new Map();
    this.userProgress = new Map();
    this.listeners = new Map();

    this.options = {
      autoSave: true,
      validateData: true,
      trackProgress: true,
      ...options
    };

    this.loadUserData();
    this.initializeAchievements();
  }

  /**
   * Initialize achievements from configuration
   */
  initializeAchievements() {
    Object.values(ACHIEVEMENT_CONFIG.templates).forEach(template => {
      this.registerAchievement(template);
    });
  }

  /**
   * Register a new achievement
   */
  registerAchievement(achievement) {
    if (this.options.validateData && !this.validateAchievement(achievement)) {
      throw new Error(`Invalid achievement data: ${achievement.id}`);
    }

    this.achievements.set(achievement.id, {
      ...achievement,
      registeredAt: Date.now()
    });

    // Initialize user progress if not exists
    if (!this.userProgress.has(achievement.id)) {
      this.userProgress.set(achievement.id, {
        id: achievement.id,
        progress: 0,
        earned: false,
        earnedAt: null,
        attempts: 0
      });
    }

    this.emit('achievement:registered', achievement);
    return achievement.id;
  }

  /**
   * Update progress for an achievement
   */
  updateProgress(achievementId, progress, metadata = {}) {
    const achievement = this.achievements.get(achievementId);
    if (!achievement) {
      console.warn(`Achievement not found: ${achievementId}`);
      return false;
    }

    const userProgress = this.userProgress.get(achievementId);
    if (userProgress.earned) {
      return false; // Already earned
    }

    const oldProgress = userProgress.progress;
    const newProgress = this.calculateProgress(achievement, progress, metadata);

    userProgress.progress = newProgress;
    userProgress.attempts++;
    userProgress.lastUpdated = Date.now();

    // Check if achievement is earned
    if (this.isAchievementEarned(achievement, newProgress, metadata)) {
      this.earnAchievement(achievementId);
    }

    this.emit('progress:updated', {
      achievementId,
      oldProgress,
      newProgress,
      metadata
    });

    if (this.options.autoSave) {
      this.saveUserData();
    }

    return true;
  }

  /**
   * Calculate progress based on achievement requirements
   */
  calculateProgress(achievement, value, metadata) {
    const { requirements } = achievement;

    switch (requirements.type) {
    case 'count':
      return Math.min(value, requirements.target);

    case 'condition':
      return this.evaluateCondition(requirements.condition, metadata) ? 1 : 0;

    case 'complex':
      return this.evaluateComplexRequirements(requirements.conditions, metadata);

    default:
      return value;
    }
  }

  /**
   * Check if achievement requirements are met
   */
  isAchievementEarned(achievement, progress, metadata) {
    const { requirements } = achievement;

    switch (requirements.type) {
    case 'count':
      return progress >= requirements.target;

    case 'condition':
      return progress === 1;

    case 'complex':
      return requirements.conditions.every(condition =>
        this.evaluateCondition(condition, metadata)
      );

    default:
      return false;
    }
  }

  /**
   * Evaluate a single condition
   */
  evaluateCondition(condition, metadata) {
    if (typeof condition === 'string') {
      // Named condition
      return this.evaluateNamedCondition(condition, metadata);
    }

    // Object condition with metric and operator
    const { metric, operator, value } = condition;
    const metricValue = metadata[metric] || 0;

    switch (operator) {
    case '>=': return metricValue >= value;
    case '<=': return metricValue <= value;
    case '>': return metricValue > value;
    case '<': return metricValue < value;
    case '==': return metricValue === value;
    case '!=': return metricValue !== value;
    default: return false;
    }
  }

  /**
   * Evaluate named conditions
   */
  evaluateNamedCondition(conditionName, metadata) {
    const conditions = {
      trade_before_9am: () => {
        const hour = new Date(metadata.timestamp || Date.now()).getHours();
        return hour < 9;
      },
      profitable_trade: () => metadata.profit > 0,
      weekend_trade: () => {
        const day = new Date(metadata.timestamp || Date.now()).getDay();
        return day === 0 || day === 6;
      },
      perfect_week: () => metadata.winRate === 1.0 && metadata.tradesThisWeek >= 5
    };

    return conditions[conditionName] ? conditions[conditionName]() : false;
  }

  /**
   * Evaluate complex requirements
   */
  evaluateComplexRequirements(conditions, metadata) {
    return conditions.every(condition => this.evaluateCondition(condition, metadata));
  }

  /**
   * Mark achievement as earned
   */
  earnAchievement(achievementId) {
    const achievement = this.achievements.get(achievementId);
    const userProgress = this.userProgress.get(achievementId);

    if (!achievement || userProgress.earned) {
      return false;
    }

    userProgress.earned = true;
    userProgress.earnedAt = Date.now();
    userProgress.progress = this.getMaxProgress(achievement);

    // Award XP points
    if (achievement.points) {
      this.awardXP(achievement.points, `Achievement: ${achievement.title}`);
    }

    this.emit('achievement:earned', {
      achievement,
      userProgress,
      timestamp: userProgress.earnedAt
    });

    if (this.options.autoSave) {
      this.saveUserData();
    }

    return true;
  }

  /**
   * Get maximum progress value for achievement
   */
  getMaxProgress(achievement) {
    const { requirements } = achievement;

    switch (requirements.type) {
    case 'count':
      return requirements.target;
    case 'condition':
    case 'complex':
      return 1;
    default:
      return 1;
    }
  }

  /**
   * Get achievement progress percentage
   */
  getProgressPercentage(achievementId) {
    const achievement = this.achievements.get(achievementId);
    const userProgress = this.userProgress.get(achievementId);

    if (!achievement || !userProgress) {
      return 0;
    }

    const maxProgress = this.getMaxProgress(achievement);
    return Math.round((userProgress.progress / maxProgress) * 100);
  }

  /**
   * Get all achievements for a category
   */
  getAchievementsByCategory(category) {
    return Array.from(this.achievements.values())
      .filter(achievement => achievement.category === category);
  }

  /**
   * Get all achievements by rarity
   */
  getAchievementsByRarity(rarity) {
    return Array.from(this.achievements.values())
      .filter(achievement => achievement.rarity === rarity);
  }

  /**
   * Get user's earned achievements
   */
  getEarnedAchievements() {
    return Array.from(this.userProgress.values())
      .filter(progress => progress.earned)
      .map(progress => ({
        ...this.achievements.get(progress.id),
        ...progress
      }));
  }

  /**
   * Get user's progress on all achievements
   */
  getAllProgress() {
    return Array.from(this.achievements.values()).map(achievement => ({
      ...achievement,
      ...this.userProgress.get(achievement.id)
    }));
  }

  /**
   * Award XP points to user
   */
  awardXP(points, source = 'Unknown') {
    this.emit('xp:awarded', { points, source, timestamp: Date.now() });
  }

  /**
   * Validate achievement data
   */
  validateAchievement(achievement) {
    const rules = VALIDATION_RULES.achievement;

    for (const [field, rule] of Object.entries(rules)) {
      const value = achievement[field];

      if (rule.required && (value === undefined || value === null)) {
        console.error(`Missing required field: ${field}`);
        return false;
      }

      if (value !== undefined) {
        if (rule.type && typeof value !== rule.type) {
          console.error(`Invalid type for ${field}: expected ${rule.type}`);
          return false;
        }

        if (rule.enum && !rule.enum.includes(value)) {
          console.error(`Invalid value for ${field}: must be one of ${rule.enum.join(', ')}`);
          return false;
        }

        if (rule.minLength && value.length < rule.minLength) {
          console.error(`${field} too short: minimum ${rule.minLength} characters`);
          return false;
        }

        if (rule.min && value < rule.min) {
          console.error(`${field} too small: minimum ${rule.min}`);
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Load user data from storage
   */
  loadUserData() {
    try {
      const data = localStorage.getItem('tmyl_achievement_progress');
      if (data) {
        const progress = JSON.parse(data);
        Object.entries(progress).forEach(([id, data]) => {
          this.userProgress.set(id, data);
        });
      }
    } catch (error) {
      console.warn('Failed to load achievement progress:', error);
    }
  }

  /**
   * Save user data to storage
   */
  saveUserData() {
    try {
      const progress = Object.fromEntries(this.userProgress);
      localStorage.setItem('tmyl_achievement_progress', JSON.stringify(progress));
    } catch (error) {
      console.warn('Failed to save achievement progress:', error);
    }
  }

  /**
   * Event system
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
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
   * Reset all achievement progress
   */
  reset() {
    this.userProgress.clear();
    this.saveUserData();
    this.emit('achievements:reset');
  }

  /**
   * Get achievement statistics
   */
  getStatistics() {
    const all = Array.from(this.achievements.values());
    const earned = this.getEarnedAchievements();

    return {
      total: all.length,
      earned: earned.length,
      completion: Math.round((earned.length / all.length) * 100),
      byCategory: this.getStatsByCategory(),
      byRarity: this.getStatsByRarity(),
      totalPoints: earned.reduce((sum, achievement) => sum + achievement.points, 0)
    };
  }

  /**
   * Get statistics by category
   */
  getStatsByCategory() {
    const stats = {};
    const earned = this.getEarnedAchievements();

    Object.keys(ACHIEVEMENT_CONFIG.categories).forEach(category => {
      const total = this.getAchievementsByCategory(category).length;
      const earnedCount = earned.filter(a => a.category === category).length;

      stats[category] = {
        total,
        earned: earnedCount,
        completion: total ? Math.round((earnedCount / total) * 100) : 0
      };
    });

    return stats;
  }

  /**
   * Get statistics by rarity
   */
  getStatsByRarity() {
    const stats = {};
    const earned = this.getEarnedAchievements();

    Object.keys(ACHIEVEMENT_CONFIG.rarities).forEach(rarity => {
      const total = this.getAchievementsByRarity(rarity).length;
      const earnedCount = earned.filter(a => a.rarity === rarity).length;

      stats[rarity] = {
        total,
        earned: earnedCount,
        completion: total ? Math.round((earnedCount / total) * 100) : 0
      };
    });

    return stats;
  }
}

export default AchievementController;
