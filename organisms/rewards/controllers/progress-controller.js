/**
 * Progress Controller
 * Handles progress indicators, animations, and display logic
 */

import { PROGRESS_CONFIG, VALIDATION_RULES } from '../config/reward-config.js';

class ProgressController {
  constructor(options = {}) {
    this.progressBars = new Map();
    this.animationQueue = [];
    this.isAnimating = false;
    
    this.options = {
      enableAnimations: true,
      batchUpdates: true,
      validateData: true,
      ...options
    };
  }

  /**
   * Create a new progress indicator
   */
  createProgress(containerId, config) {
    if (this.options.validateData && !this.validateProgressConfig(config)) {
      throw new Error('Invalid progress configuration');
    }

    const progressData = {
      id: containerId,
      current: config.current || 0,
      total: config.total || 100,
      type: config.type || PROGRESS_CONFIG.defaults.type,
      size: config.size || PROGRESS_CONFIG.defaults.size,
      color: config.color || PROGRESS_CONFIG.defaults.color,
      label: config.label || '',
      showPercentage: config.showPercentage !== false,
      animated: config.animated !== false,
      formatter: config.formatter || 'percentage',
      steps: config.steps || [],
      container: document.getElementById(containerId),
      createdAt: Date.now()
    };

    if (!progressData.container) {
      throw new Error(`Container not found: ${containerId}`);
    }

    this.progressBars.set(containerId, progressData);
    this.renderProgress(containerId);
    
    return containerId;
  }

  /**
   * Update progress value
   */
  updateProgress(progressId, current, total = null, options = {}) {
    const progress = this.progressBars.get(progressId);
    if (!progress) {
      console.warn(`Progress indicator not found: ${progressId}`);
      return false;
    }

    const oldCurrent = progress.current;
    const oldTotal = progress.total;

    progress.current = Math.max(0, current);
    if (total !== null) {
      progress.total = Math.max(1, total);
    }

    // Ensure current doesn't exceed total
    progress.current = Math.min(progress.current, progress.total);

    if (options.animated !== false && progress.animated && this.options.enableAnimations) {
      this.animateProgress(progressId, oldCurrent, progress.current, options.duration);
    } else {
      this.renderProgress(progressId);
    }

    return true;
  }

  /**
   * Animate progress change
   */
  animateProgress(progressId, fromValue, toValue, duration = PROGRESS_CONFIG.animations.duration) {
    const progress = this.progressBars.get(progressId);
    if (!progress) return;

    // Add to animation queue
    this.animationQueue.push({
      progressId,
      fromValue,
      toValue,
      duration,
      startTime: null
    });

    if (!this.isAnimating) {
      this.processAnimationQueue();
    }
  }

  /**
   * Process animation queue
   */
  processAnimationQueue() {
    if (this.animationQueue.length === 0) {
      this.isAnimating = false;
      return;
    }

    this.isAnimating = true;
    const animation = this.animationQueue.shift();
    
    if (animation.startTime === null) {
      animation.startTime = performance.now();
    }

    const animateFrame = (currentTime) => {
      const elapsed = currentTime - animation.startTime;
      const progress = Math.min(elapsed / animation.duration, 1);
      
      // Easing function (ease-out)
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      
      const currentValue = animation.fromValue + 
        (animation.toValue - animation.fromValue) * easedProgress;

      // Update display
      const progressData = this.progressBars.get(animation.progressId);
      if (progressData) {
        this.updateProgressDisplay(animation.progressId, currentValue);
      }

      if (progress < 1) {
        requestAnimationFrame(animateFrame);
      } else {
        // Animation complete, process next
        setTimeout(() => this.processAnimationQueue(), 50);
      }
    };

    requestAnimationFrame(animateFrame);
  }

  /**
   * Render complete progress indicator
   */
  renderProgress(progressId) {
    const progress = this.progressBars.get(progressId);
    if (!progress) return;

    const { container, type } = progress;
    
    // Clear existing content
    container.innerHTML = '';
    
    // Add CSS classes
    container.className = `tmyl-progress-indicator type-${type} size-${progress.size} color-${progress.color}`;

    // Add label if provided
    if (progress.label) {
      const label = document.createElement('div');
      label.className = 'progress-label';
      label.textContent = progress.label;
      container.appendChild(label);
    }

    // Render based on type
    switch (type) {
      case PROGRESS_CONFIG.types.LINEAR:
        this.renderLinearProgress(container, progress);
        break;
      case PROGRESS_CONFIG.types.CIRCULAR:
        this.renderCircularProgress(container, progress);
        break;
      case PROGRESS_CONFIG.types.STEPS:
        this.renderStepsProgress(container, progress);
        break;
    }
  }

  /**
   * Render linear progress bar
   */
  renderLinearProgress(container, progress) {
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-linear';

    const track = document.createElement('div');
    track.className = 'progress-track';

    const fill = document.createElement('div');
    fill.className = 'progress-fill';
    
    const percentage = (progress.current / progress.total) * 100;
    fill.style.width = `${percentage}%`;

    track.appendChild(fill);
    progressContainer.appendChild(track);

    if (progress.showPercentage) {
      const value = document.createElement('div');
      value.className = 'progress-value';
      value.textContent = this.formatValue(progress);
      progressContainer.appendChild(value);
    }

    container.appendChild(progressContainer);
  }

  /**
   * Render circular progress indicator
   */
  renderCircularProgress(container, progress) {
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-circular';

    const size = this.getCircularSize(progress.size);
    const strokeWidth = size > 100 ? 6 : 4;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const percentage = (progress.current / progress.total) * 100;
    const offset = circumference - (percentage / 100) * circumference;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('circular-chart');
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);

    // Background circle
    const bgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    bgCircle.classList.add('circle-bg');
    bgCircle.setAttribute('cx', size / 2);
    bgCircle.setAttribute('cy', size / 2);
    bgCircle.setAttribute('r', radius);
    bgCircle.setAttribute('stroke-width', strokeWidth);

    // Progress circle
    const progressCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    progressCircle.classList.add('circle');
    progressCircle.setAttribute('cx', size / 2);
    progressCircle.setAttribute('cy', size / 2);
    progressCircle.setAttribute('r', radius);
    progressCircle.setAttribute('stroke-width', strokeWidth);
    progressCircle.setAttribute('stroke-dasharray', circumference);
    progressCircle.setAttribute('stroke-dashoffset', offset);

    svg.appendChild(bgCircle);
    svg.appendChild(progressCircle);
    progressContainer.appendChild(svg);

    if (progress.showPercentage) {
      const percentageText = document.createElement('div');
      percentageText.className = 'progress-percentage';
      percentageText.textContent = this.formatValue(progress);
      progressContainer.appendChild(percentageText);
    }

    container.appendChild(progressContainer);
  }

  /**
   * Render steps progress indicator
   */
  renderStepsProgress(container, progress) {
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-steps';

    const steps = progress.steps || this.generateDefaultSteps(progress.total);
    const currentStep = Math.floor((progress.current / progress.total) * steps.length);

    steps.forEach((step, index) => {
      const stepElement = document.createElement('div');
      stepElement.className = 'progress-step';

      if (index < currentStep) {
        stepElement.classList.add('completed');
      } else if (index === currentStep) {
        stepElement.classList.add('current');
      }

      const indicator = document.createElement('div');
      indicator.className = 'step-indicator';
      indicator.textContent = step.icon || (index + 1);

      const label = document.createElement('div');
      label.className = 'step-label';
      label.textContent = step.label || `Step ${index + 1}`;

      stepElement.appendChild(indicator);
      stepElement.appendChild(label);

      progressContainer.appendChild(stepElement);

      // Add connector except for last step
      if (index < steps.length - 1) {
        const connector = document.createElement('div');
        connector.className = 'step-connector';
        if (index < currentStep) {
          connector.classList.add('completed');
        }
        progressContainer.appendChild(connector);
      }
    });

    container.appendChild(progressContainer);
  }

  /**
   * Update only the progress display (for animations)
   */
  updateProgressDisplay(progressId, currentValue) {
    const progress = this.progressBars.get(progressId);
    if (!progress) return;

    const percentage = (currentValue / progress.total) * 100;
    const { container, type } = progress;

    switch (type) {
      case PROGRESS_CONFIG.types.LINEAR:
        const fill = container.querySelector('.progress-fill');
        if (fill) {
          fill.style.width = `${percentage}%`;
        }
        break;

      case PROGRESS_CONFIG.types.CIRCULAR:
        const circle = container.querySelector('.circle');
        if (circle) {
          const radius = parseFloat(circle.getAttribute('r'));
          const circumference = radius * 2 * Math.PI;
          const offset = circumference - (percentage / 100) * circumference;
          circle.setAttribute('stroke-dashoffset', offset);
        }
        break;

      case PROGRESS_CONFIG.types.STEPS:
        this.updateStepsDisplay(container, currentValue, progress.total, progress.steps);
        break;
    }

    // Update value display
    if (progress.showPercentage) {
      const valueElement = container.querySelector('.progress-value, .progress-percentage');
      if (valueElement) {
        valueElement.textContent = this.formatValue({
          ...progress,
          current: currentValue
        });
      }
    }
  }

  /**
   * Update steps display
   */
  updateStepsDisplay(container, currentValue, total, steps) {
    const stepElements = container.querySelectorAll('.progress-step');
    const connectors = container.querySelectorAll('.step-connector');
    const currentStep = Math.floor((currentValue / total) * stepElements.length);

    stepElements.forEach((element, index) => {
      element.classList.remove('completed', 'current');
      
      if (index < currentStep) {
        element.classList.add('completed');
      } else if (index === currentStep) {
        element.classList.add('current');
      }
    });

    connectors.forEach((connector, index) => {
      connector.classList.toggle('completed', index < currentStep);
    });
  }

  /**
   * Format progress value
   */
  formatValue(progress) {
    const { current, total, formatter } = progress;
    
    if (typeof formatter === 'function') {
      return formatter(current, total);
    }

    const formatters = PROGRESS_CONFIG.formatters;
    
    switch (formatter) {
      case 'percentage':
        return formatters.percentage(current, total);
      case 'count':
        return formatters.count(current, total);
      case 'xp':
        return formatters.xp(current, total);
      case 'level':
        return formatters.level(current, total);
      default:
        if (typeof formatter === 'string') {
          return formatters.custom(current, total, formatter);
        }
        return formatters.percentage(current, total);
    }
  }

  /**
   * Generate default steps for steps progress
   */
  generateDefaultSteps(total) {
    const stepCount = Math.min(total, 5); // Max 5 steps by default
    const steps = [];
    
    for (let i = 0; i < stepCount; i++) {
      steps.push({
        label: `Step ${i + 1}`,
        icon: i + 1
      });
    }
    
    return steps;
  }

  /**
   * Get circular progress size
   */
  getCircularSize(size) {
    const sizes = {
      small: 80,
      medium: 120,
      large: 160
    };
    
    return sizes[size] || sizes.medium;
  }

  /**
   * Validate progress configuration
   */
  validateProgressConfig(config) {
    const rules = VALIDATION_RULES.progress;
    
    for (const [field, rule] of Object.entries(rules)) {
      const value = config[field];
      
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
        
        if (rule.min && value < rule.min) {
          console.error(`${field} too small: minimum ${rule.min}`);
          return false;
        }
      }
    }
    
    return true;
  }

  /**
   * Remove progress indicator
   */
  removeProgress(progressId) {
    const progress = this.progressBars.get(progressId);
    if (progress && progress.container) {
      progress.container.innerHTML = '';
      progress.container.className = '';
    }
    
    this.progressBars.delete(progressId);
    
    // Remove from animation queue
    this.animationQueue = this.animationQueue.filter(
      animation => animation.progressId !== progressId
    );
  }

  /**
   * Get progress data
   */
  getProgress(progressId) {
    return this.progressBars.get(progressId);
  }

  /**
   * Get all progress indicators
   */
  getAllProgress() {
    return Array.from(this.progressBars.values());
  }

  /**
   * Set progress color
   */
  setColor(progressId, color) {
    const progress = this.progressBars.get(progressId);
    if (progress) {
      progress.color = color;
      progress.container.className = progress.container.className
        .replace(/color-\w+/, `color-${color}`);
    }
  }

  /**
   * Set progress size
   */
  setSize(progressId, size) {
    const progress = this.progressBars.get(progressId);
    if (progress) {
      progress.size = size;
      progress.container.className = progress.container.className
        .replace(/size-\w+/, `size-${size}`);
      
      // Re-render if circular (size affects SVG)
      if (progress.type === PROGRESS_CONFIG.types.CIRCULAR) {
        this.renderProgress(progressId);
      }
    }
  }

  /**
   * Reset progress to zero
   */
  reset(progressId) {
    this.updateProgress(progressId, 0);
  }

  /**
   * Complete progress (set to 100%)
   */
  complete(progressId) {
    const progress = this.progressBars.get(progressId);
    if (progress) {
      this.updateProgress(progressId, progress.total);
    }
  }
}

export default ProgressController;
