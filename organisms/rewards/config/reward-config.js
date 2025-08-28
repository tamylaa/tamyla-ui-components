/**
 * Reward System Configuration
 * Centralized configuration for achievements, progress tracking, and notifications
 */

// Achievement Configuration
const ACHIEVEMENT_CONFIG = {
  rarities: {
    COMMON: {
      name: 'Common',
      color: '#6b7280',
      borderColor: '#d1d5db',
      glow: false
    },
    UNCOMMON: {
      name: 'Uncommon',
      color: '#16a34a',
      borderColor: '#86efac',
      glow: false
    },
    RARE: {
      name: 'Rare',
      color: '#2563eb',
      borderColor: '#93c5fd',
      glow: true
    },
    EPIC: {
      name: 'Epic',
      color: '#7c3aed',
      borderColor: '#c4b5fd',
      glow: true
    },
    LEGENDARY: {
      name: 'Legendary',
      color: '#f59e0b',
      borderColor: '#fcd34d',
      glow: true,
      gradient: true
    }
  },

  categories: {
    TRADING: {
      name: 'Trading',
      icon: '📈',
      description: 'Trading activity achievements'
    },
    LEARNING: {
      name: 'Learning',
      icon: '🎓',
      description: 'Educational milestone achievements'
    },
    SOCIAL: {
      name: 'Social',
      icon: '👥',
      description: 'Community engagement achievements'
    },
    STREAKS: {
      name: 'Streaks',
      icon: '🔥',
      description: 'Consistency and streak achievements'
    },
    MILESTONES: {
      name: 'Milestones',
      icon: '🏆',
      description: 'Major milestone achievements'
    }
  },

  templates: {
    first_trade: {
      id: 'first_trade',
      title: 'First Trade',
      description: 'Complete your first trade',
      icon: '💰',
      category: 'TRADING',
      rarity: 'COMMON',
      points: 100,
      requirements: {
        type: 'count',
        target: 1,
        metric: 'trades_completed'
      }
    },
    early_bird: {
      id: 'early_bird',
      title: 'Early Bird',
      description: 'Trade before 9 AM',
      icon: '🌅',
      category: 'TRADING',
      rarity: 'UNCOMMON',
      points: 150,
      requirements: {
        type: 'condition',
        condition: 'trade_before_9am'
      }
    },
    knowledge_seeker: {
      id: 'knowledge_seeker',
      title: 'Knowledge Seeker',
      description: 'Complete 10 learning modules',
      icon: '📚',
      category: 'LEARNING',
      rarity: 'RARE',
      points: 300,
      requirements: {
        type: 'count',
        target: 10,
        metric: 'modules_completed'
      }
    },
    community_leader: {
      id: 'community_leader',
      title: 'Community Leader',
      description: 'Help 50 community members',
      icon: '👑',
      category: 'SOCIAL',
      rarity: 'EPIC',
      points: 500,
      requirements: {
        type: 'count',
        target: 50,
        metric: 'members_helped'
      }
    },
    trading_master: {
      id: 'trading_master',
      title: 'Trading Master',
      description: 'Achieve 90% win rate over 100 trades',
      icon: '🎯',
      category: 'TRADING',
      rarity: 'LEGENDARY',
      points: 1000,
      requirements: {
        type: 'complex',
        conditions: [
          { metric: 'trades_completed', operator: '>=', value: 100 },
          { metric: 'win_rate', operator: '>=', value: 0.9 }
        ]
      }
    }
  }
};

// Progress Indicator Configuration
const PROGRESS_CONFIG = {
  types: {
    LINEAR: 'linear',
    CIRCULAR: 'circular',
    STEPS: 'steps'
  },

  sizes: {
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large'
  },

  colors: {
    PRIMARY: 'primary',
    SUCCESS: 'success',
    WARNING: 'warning',
    DANGER: 'danger'
  },

  animations: {
    enabled: true,
    duration: 300,
    easing: 'ease'
  },

  defaults: {
    type: 'LINEAR',
    size: 'MEDIUM',
    color: 'PRIMARY',
    showPercentage: true,
    animated: true
  },

  formatters: {
    percentage: (value, total) => `${Math.round((value / total) * 100)}%`,
    count: (value, total) => `${value}/${total}`,
    xp: (value, total) => `${value} XP / ${total} XP`,
    level: (value, total) => `Level ${value}`,
    custom: (value, total, format) => format.replace('{value}', value).replace('{total}', total)
  }
};

// Notification Configuration
const NOTIFICATION_CONFIG = {
  types: {
    XP: {
      name: 'XP Gained',
      icon: '⭐',
      duration: 3000,
      sound: 'xp_gain.mp3'
    },
    ACHIEVEMENT: {
      name: 'Achievement Unlocked',
      icon: '🏆',
      duration: 5000,
      sound: 'achievement.mp3'
    },
    LEVEL: {
      name: 'Level Up',
      icon: '📈',
      duration: 4000,
      sound: 'level_up.mp3'
    },
    BADGE: {
      name: 'Badge Earned',
      icon: '🎖️',
      duration: 4000,
      sound: 'badge.mp3'
    }
  },

  positions: {
    TOP_LEFT: 'top-left',
    TOP_RIGHT: 'top-right',
    BOTTOM_LEFT: 'bottom-left',
    BOTTOM_RIGHT: 'bottom-right',
    CENTER: 'center'
  },

  defaults: {
    position: 'TOP_RIGHT',
    duration: 3000,
    closable: true,
    sound: true,
    animation: true
  },

  limits: {
    maxVisible: 3,
    queueSize: 10,
    minDisplayTime: 1000
  },

  templates: {
    xp_gained: {
      title: 'XP Gained!',
      message: 'You earned {amount} XP',
      type: 'XP'
    },
    achievement_unlocked: {
      title: 'Achievement Unlocked!',
      message: '{achievement_name}',
      type: 'ACHIEVEMENT'
    },
    level_up: {
      title: 'Level Up!',
      message: 'You reached level {level}',
      type: 'LEVEL'
    },
    badge_earned: {
      title: 'Badge Earned!',
      message: 'You earned the {badge_name} badge',
      type: 'BADGE'
    }
  }
};

// XP and Leveling Configuration
const XP_CONFIG = {
  baseXP: 1000,
  multiplier: 1.5,
  maxLevel: 100,

  sources: {
    TRADE_COMPLETED: 50,
    PROFITABLE_TRADE: 100,
    STREAK_DAY: 25,
    MODULE_COMPLETED: 75,
    QUIZ_PASSED: 40,
    COMMUNITY_HELP: 30,
    FORUM_POST: 20,
    ACHIEVEMENT_UNLOCK: 200
  },

  bonuses: {
    FIRST_DAILY: 1.5,
    WEEKEND: 1.2,
    STREAK_MULTIPLIER: 0.1,
    PERFECT_WEEK: 2.0
  },

  levelFormula: (level) => Math.floor(XP_CONFIG.baseXP * Math.pow(XP_CONFIG.multiplier, level - 1)),

  getXPForLevel: (targetLevel) => {
    let totalXP = 0;
    for (let level = 1; level < targetLevel; level++) {
      totalXP += XP_CONFIG.levelFormula(level);
    }
    return totalXP;
  },

  getLevelFromXP: (xp) => {
    let level = 1;
    let requiredXP = 0;

    while (level <= XP_CONFIG.maxLevel) {
      const levelXP = XP_CONFIG.levelFormula(level);
      if (requiredXP + levelXP > xp) break;
      requiredXP += levelXP;
      level++;
    }

    return {
      level: level,
      currentXP: xp - requiredXP,
      requiredXP: XP_CONFIG.levelFormula(level),
      totalXP: xp
    };
  }
};

// Gamification Presets
const GAMIFICATION_PRESETS = {
  beginner: {
    name: 'Beginner Trader',
    achievements: ['first_trade', 'early_bird'],
    xpMultiplier: 1.5,
    notifications: {
      frequency: 'high',
      types: ['XP', 'ACHIEVEMENT', 'LEVEL']
    }
  },

  intermediate: {
    name: 'Developing Trader',
    achievements: ['knowledge_seeker', 'community_leader'],
    xpMultiplier: 1.2,
    notifications: {
      frequency: 'medium',
      types: ['ACHIEVEMENT', 'LEVEL', 'BADGE']
    }
  },

  advanced: {
    name: 'Expert Trader',
    achievements: ['trading_master'],
    xpMultiplier: 1.0,
    notifications: {
      frequency: 'low',
      types: ['ACHIEVEMENT', 'LEVEL']
    }
  },

  competitive: {
    name: 'Competitive Mode',
    achievements: Object.keys(ACHIEVEMENT_CONFIG.templates),
    xpMultiplier: 2.0,
    notifications: {
      frequency: 'high',
      types: ['XP', 'ACHIEVEMENT', 'LEVEL', 'BADGE'],
      sound: true
    },
    leaderboards: true,
    streaks: true
  }
};

// Validation Rules
const VALIDATION_RULES = {
  achievement: {
    id: { required: true, type: 'string', minLength: 3 },
    title: { required: true, type: 'string', minLength: 1 },
    description: { required: true, type: 'string', minLength: 1 },
    icon: { required: true, type: 'string' },
    category: { required: true, enum: Object.keys(ACHIEVEMENT_CONFIG.categories) },
    rarity: { required: true, enum: Object.keys(ACHIEVEMENT_CONFIG.rarities) },
    points: { required: true, type: 'number', min: 0 }
  },

  progress: {
    current: { required: true, type: 'number', min: 0 },
    total: { required: true, type: 'number', min: 1 },
    type: { required: false, enum: Object.values(PROGRESS_CONFIG.types) },
    color: { required: false, enum: Object.values(PROGRESS_CONFIG.colors) }
  },

  notification: {
    title: { required: true, type: 'string', minLength: 1 },
    message: { required: true, type: 'string', minLength: 1 },
    type: { required: true, enum: Object.keys(NOTIFICATION_CONFIG.types) },
    duration: { required: false, type: 'number', min: 1000, max: 10000 }
  }
};

// Export configuration
export {
  ACHIEVEMENT_CONFIG,
  PROGRESS_CONFIG,
  NOTIFICATION_CONFIG,
  XP_CONFIG,
  GAMIFICATION_PRESETS,
  VALIDATION_RULES
};
