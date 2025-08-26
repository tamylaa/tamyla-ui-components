/**
 * Notification Controller
 * Handles reward notifications, queueing, positioning, and animations
 */

import { NOTIFICATION_CONFIG, VALIDATION_RULES } from '../config/reward-config.js';

class NotificationController {
  constructor(options = {}) {
    this.notifications = new Map();
    this.queue = [];
    this.visibleCount = 0;
    this.nextId = 1;
    
    this.options = {
      maxVisible: NOTIFICATION_CONFIG.limits.maxVisible,
      queueSize: NOTIFICATION_CONFIG.limits.queueSize,
      defaultPosition: NOTIFICATION_CONFIG.defaults.position,
      defaultDuration: NOTIFICATION_CONFIG.defaults.duration,
      enableSound: NOTIFICATION_CONFIG.defaults.sound,
      enableAnimations: NOTIFICATION_CONFIG.defaults.animation,
      validateData: true,
      ...options
    };

    this.initializeContainer();
    this.bindEvents();
  }

  /**
   * Initialize notification containers for each position
   */
  initializeContainer() {
    this.containers = {};
    
    Object.values(NOTIFICATION_CONFIG.positions).forEach(position => {
      const container = document.createElement('div');
      container.id = `tmyl-notifications-${position}`;
      container.className = `tmyl-notification-container position-${position}`;
      container.style.cssText = `
        position: fixed;
        z-index: 10000;
        pointer-events: none;
      `;
      
      // Position the container
      this.positionContainer(container, position);
      
      document.body.appendChild(container);
      this.containers[position] = container;
    });
  }

  /**
   * Position notification container
   */
  positionContainer(container, position) {
    switch (position) {
      case NOTIFICATION_CONFIG.positions.TOP_LEFT:
        container.style.top = '20px';
        container.style.left = '20px';
        break;
      case NOTIFICATION_CONFIG.positions.TOP_RIGHT:
        container.style.top = '20px';
        container.style.right = '20px';
        break;
      case NOTIFICATION_CONFIG.positions.BOTTOM_LEFT:
        container.style.bottom = '20px';
        container.style.left = '20px';
        break;
      case NOTIFICATION_CONFIG.positions.BOTTOM_RIGHT:
        container.style.bottom = '20px';
        container.style.right = '20px';
        break;
      case NOTIFICATION_CONFIG.positions.CENTER:
        container.style.top = '50%';
        container.style.left = '50%';
        container.style.transform = 'translate(-50%, -50%)';
        break;
    }
  }

  /**
   * Show a notification
   */
  show(notificationData) {
    if (this.options.validateData && !this.validateNotification(notificationData)) {
      throw new Error('Invalid notification data');
    }

    const notification = {
      id: this.nextId++,
      title: notificationData.title,
      message: notificationData.message,
      type: notificationData.type || 'XP',
      icon: notificationData.icon || NOTIFICATION_CONFIG.types[notificationData.type]?.icon,
      duration: notificationData.duration || this.options.defaultDuration,
      position: notificationData.position || this.options.defaultPosition,
      closable: notificationData.closable !== false,
      sound: notificationData.sound !== false && this.options.enableSound,
      value: notificationData.value,
      metadata: notificationData.metadata || {},
      createdAt: Date.now()
    };

    // Add to queue or show immediately
    if (this.visibleCount >= this.options.maxVisible) {
      this.addToQueue(notification);
    } else {
      this.displayNotification(notification);
    }

    return notification.id;
  }

  /**
   * Add notification to queue
   */
  addToQueue(notification) {
    if (this.queue.length >= this.options.queueSize) {
      // Remove oldest queued notification
      this.queue.shift();
    }
    
    this.queue.push(notification);
  }

  /**
   * Display notification immediately
   */
  displayNotification(notification) {
    const element = this.createNotificationElement(notification);
    const container = this.containers[notification.position];
    
    if (!container) {
      console.error(`Invalid notification position: ${notification.position}`);
      return;
    }

    // Add to DOM
    container.appendChild(element);
    this.notifications.set(notification.id, {
      ...notification,
      element,
      container
    });

    this.visibleCount++;

    // Animate in
    if (this.options.enableAnimations) {
      this.animateIn(element);
    } else {
      element.classList.add('showing');
    }

    // Play sound
    if (notification.sound) {
      this.playNotificationSound(notification.type);
    }

    // Auto-hide timer
    if (notification.duration > 0) {
      setTimeout(() => {
        this.hide(notification.id);
      }, notification.duration);
    }

    // Show next queued notification
    this.processQueue();
  }

  /**
   * Create notification DOM element
   */
  createNotificationElement(notification) {
    const element = document.createElement('div');
    element.className = `tmyl-reward-notification notification-${notification.type.toLowerCase()} position-${notification.position}`;
    element.style.pointerEvents = 'auto';

    // Create content structure
    const content = document.createElement('div');
    content.className = 'notification-content';

    // Icon
    const iconElement = document.createElement('div');
    iconElement.className = 'notification-icon';
    iconElement.textContent = notification.icon || '🎉';

    // Text content
    const textElement = document.createElement('div');
    textElement.className = 'notification-text';

    const titleElement = document.createElement('div');
    titleElement.className = 'notification-title';
    titleElement.textContent = notification.title;

    const messageElement = document.createElement('div');
    messageElement.className = 'notification-message';
    messageElement.textContent = notification.message;

    textElement.appendChild(titleElement);
    textElement.appendChild(messageElement);

    // Value (for XP, points, etc.)
    if (notification.value !== undefined) {
      const valueElement = document.createElement('div');
      valueElement.className = 'notification-value';
      valueElement.textContent = this.formatValue(notification);
      textElement.appendChild(valueElement);
    }

    content.appendChild(iconElement);
    content.appendChild(textElement);

    // Close button
    if (notification.closable) {
      const closeButton = document.createElement('button');
      closeButton.className = 'notification-close';
      closeButton.innerHTML = '×';
      closeButton.addEventListener('click', () => {
        this.hide(notification.id);
      });
      content.appendChild(closeButton);
    }

    element.appendChild(content);
    return element;
  }

  /**
   * Format notification value
   */
  formatValue(notification) {
    const { type, value } = notification;
    
    switch (type.toLowerCase()) {
      case 'xp':
        return `+${value} XP`;
      case 'achievement':
        return '';
      case 'level':
        return `Level ${value}`;
      case 'badge':
        return '';
      default:
        return value ? `+${value}` : '';
    }
  }

  /**
   * Animate notification in
   */
  animateIn(element) {
    // Start hidden
    element.style.opacity = '0';
    element.style.transform = 'translateY(-20px)';
    
    // Trigger animation
    requestAnimationFrame(() => {
      element.classList.add('showing');
      element.style.transition = 'all 0.3s ease';
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    });
  }

  /**
   * Animate notification out
   */
  animateOut(element, callback) {
    if (!this.options.enableAnimations) {
      element.classList.add('hiding');
      setTimeout(callback, 50);
      return;
    }

    element.classList.add('hiding');
    element.style.transition = 'all 0.3s ease';
    element.style.opacity = '0';
    element.style.transform = 'translateY(-20px)';
    
    setTimeout(callback, 300);
  }

  /**
   * Hide notification
   */
  hide(notificationId) {
    const notification = this.notifications.get(notificationId);
    if (!notification) return;

    this.animateOut(notification.element, () => {
      // Remove from DOM
      if (notification.element.parentNode) {
        notification.element.parentNode.removeChild(notification.element);
      }
      
      // Clean up
      this.notifications.delete(notificationId);
      this.visibleCount--;
      
      // Process queue
      this.processQueue();
    });
  }

  /**
   * Process notification queue
   */
  processQueue() {
    if (this.queue.length > 0 && this.visibleCount < this.options.maxVisible) {
      const notification = this.queue.shift();
      this.displayNotification(notification);
    }
  }

  /**
   * Play notification sound
   */
  playNotificationSound(type) {
    const soundConfig = NOTIFICATION_CONFIG.types[type];
    if (!soundConfig || !soundConfig.sound) return;

    try {
      // Create audio element
      const audio = new Audio(`/sounds/${soundConfig.sound}`);
      audio.volume = 0.3;
      audio.play().catch(error => {
        console.warn('Failed to play notification sound:', error);
      });
    } catch (error) {
      console.warn('Audio not supported or failed to load:', error);
    }
  }

  /**
   * Show XP notification
   */
  showXP(amount, source = '') {
    return this.show({
      title: 'XP Gained!',
      message: source || 'You earned experience points',
      type: 'XP',
      value: amount,
      metadata: { source }
    });
  }

  /**
   * Show achievement notification
   */
  showAchievement(achievement) {
    return this.show({
      title: 'Achievement Unlocked!',
      message: achievement.title,
      type: 'ACHIEVEMENT',
      icon: achievement.icon,
      duration: 5000,
      metadata: { achievement }
    });
  }

  /**
   * Show level up notification
   */
  showLevelUp(level, xp = null) {
    return this.show({
      title: 'Level Up!',
      message: `Congratulations! You reached level ${level}`,
      type: 'LEVEL',
      value: level,
      duration: 4000,
      metadata: { level, xp }
    });
  }

  /**
   * Show badge notification
   */
  showBadge(badge) {
    return this.show({
      title: 'Badge Earned!',
      message: badge.name || 'You earned a new badge',
      type: 'BADGE',
      icon: badge.icon,
      duration: 4000,
      metadata: { badge }
    });
  }

  /**
   * Show custom notification
   */
  showCustom(config) {
    return this.show(config);
  }

  /**
   * Clear all notifications
   */
  clearAll() {
    // Hide all visible notifications
    this.notifications.forEach((notification, id) => {
      this.hide(id);
    });
    
    // Clear queue
    this.queue = [];
  }

  /**
   * Clear notifications by type
   */
  clearByType(type) {
    this.notifications.forEach((notification, id) => {
      if (notification.type === type) {
        this.hide(id);
      }
    });
    
    // Remove from queue
    this.queue = this.queue.filter(notification => notification.type !== type);
  }

  /**
   * Validate notification data
   */
  validateNotification(notification) {
    const rules = VALIDATION_RULES.notification;
    
    for (const [field, rule] of Object.entries(rules)) {
      const value = notification[field];
      
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
        
        if (rule.max && value > rule.max) {
          console.error(`${field} too large: maximum ${rule.max}`);
          return false;
        }
      }
    }
    
    return true;
  }

  /**
   * Bind global events
   */
  bindEvents() {
    // Handle window resize
    window.addEventListener('resize', () => {
      this.repositionContainers();
    });

    // Handle escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.clearAll();
      }
    });
  }

  /**
   * Reposition containers on window resize
   */
  repositionContainers() {
    Object.entries(this.containers).forEach(([position, container]) => {
      this.positionContainer(container, position);
    });
  }

  /**
   * Get notification statistics
   */
  getStatistics() {
    return {
      visible: this.visibleCount,
      queued: this.queue.length,
      total: this.notifications.size + this.queue.length,
      byType: this.getStatsByType()
    };
  }

  /**
   * Get statistics by type
   */
  getStatsByType() {
    const stats = {};
    
    // Count visible notifications
    this.notifications.forEach(notification => {
      const type = notification.type;
      stats[type] = (stats[type] || 0) + 1;
    });
    
    // Count queued notifications
    this.queue.forEach(notification => {
      const type = notification.type;
      stats[type] = (stats[type] || 0) + 1;
    });
    
    return stats;
  }

  /**
   * Update notification options
   */
  updateOptions(newOptions) {
    this.options = { ...this.options, ...newOptions };
  }

  /**
   * Destroy notification system
   */
  destroy() {
    // Clear all notifications
    this.clearAll();
    
    // Remove containers
    Object.values(this.containers).forEach(container => {
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    });
    
    // Remove event listeners
    window.removeEventListener('resize', this.repositionContainers);
    
    // Clear data
    this.notifications.clear();
    this.queue = [];
    this.containers = {};
  }
}

export default NotificationController;
