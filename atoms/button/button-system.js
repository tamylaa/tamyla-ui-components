/**
 * Enhanced Button Factory System - World-Class Button Components
 * Integrates Trading Portal's sophisticated patterns with modern architecture
 * Creates buttons with micro-interactions, accessibility, and premium polish
 */

import { designTokens } from '../../core/design-tokens.js';
import { sharedUtilities } from '../../core/shared-utilities.js';
import { createButtonTemplate, updateButtonState } from './templates/button-template.js';
import { ButtonController } from './controllers/button-controller.js';
import { buttonIcons, getButtonIcon } from './icons/button-icons.js';

/**
 * Enhanced Button Factory - World-class button components with Trading Portal sophistication
 */
export class ButtonFactory {
  constructor() {
    this.defaultProps = {
      variant: 'primary',
      size: 'md',
      disabled: false,
      loading: false,
      fullWidth: false,
      icon: '',
      iconPosition: 'left',
      // Enhanced Trading Portal patterns
      elevation: true,        // Hover elevation micro-interaction
      rippleEffect: true,     // Click ripple feedback
      focusRing: true,        // Enhanced focus indicator
      accessibility: true,    // Full WCAG compliance
      hapticFeedback: false,  // For mobile devices
      analyticsTracking: false // Optional click tracking
    };

    // Enhanced variants from Trading Portal analysis
    this.variants = [
      'primary',      // Main call-to-action
      'secondary',    // Secondary actions
      'ghost',        // Subtle actions
      'danger',       // Destructive actions
      'success',      // Positive confirmations
      'warning',      // Caution actions
      'info',         // Information actions
      'action-card',  // Gamification style from Trading Portal
      'status-pending',   // Status indicators from Trading Portal
      'status-filled',
      'status-cancelled'
    ];

    // Enhanced sizes with Trading Portal accessibility
    this.sizes = ['xs', 'sm', 'md', 'lg', 'xl'];

    // Ensure CSS is loaded
    this.ensureCSS();
  }

  /**
   * Ensure CSS is loaded in the document
   */
  ensureCSS() {
    // CSS is now bundled with the main package, no need to dynamically load
    return;
  }

  /**
   * Enhanced create method with Trading Portal sophistication
   * Creates buttons with micro-interactions, accessibility, and premium polish
   */
  create(props = {}) {
    const finalProps = { ...this.defaultProps, ...props };

    // Validate props for enhanced experience
    this.validateProps(finalProps);

    // Create container with enhanced structure
    const container = document.createElement('div');
    container.innerHTML = createButtonTemplate(finalProps);
    const button = container.firstElementChild;

    // Enhanced Trading Portal micro-interactions
    this.attachEnhancedInteractions(button, finalProps);

    // Attach enhanced controller for sophisticated behavior
    const controller = new ButtonController(button);
    controller.enableTradingPortalPatterns(finalProps);
    button._controller = controller;

    // Enhanced click handler with analytics and haptics
    if (finalProps.onClick) {
      button.addEventListener('tmyl-click', (e) => {
        // Analytics tracking if enabled
        if (finalProps.analyticsTracking) {
          this.trackButtonClick(finalProps, e);
        }

        // Haptic feedback on mobile if enabled
        if (finalProps.hapticFeedback && 'vibrate' in navigator) {
          navigator.vibrate(50);
        }

        finalProps.onClick(e);
      });
    }

    // Enhanced accessibility from Trading Portal
    this.enhanceAccessibility(button, finalProps);

    return button;
  }

  /**
   * Validate props for enhanced experience
   */
  validateProps(props) {
    if (!this.variants.includes(props.variant)) {
      console.warn(`Invalid button variant: ${props.variant}. Using 'primary'.`);
      props.variant = 'primary';
    }

    if (!this.sizes.includes(props.size)) {
      console.warn(`Invalid button size: ${props.size}. Using 'md'.`);
      props.size = 'md';
    }
  }

  /**
   * Attach Trading Portal micro-interactions
   */
  attachEnhancedInteractions(button, props) {
    // Hover elevation effect from Trading Portal
    if (props.elevation) {
      button.addEventListener('mouseenter', () => {
        if (!button.disabled && !button.classList.contains('tmyl-button--loading')) {
          button.style.transform = 'translateY(-1px)';
          button.style.boxShadow = 'var(--tmyl-shadow-md)';
        }
      });

      button.addEventListener('mouseleave', () => {
        button.style.transform = '';
        button.style.boxShadow = '';
      });
    }

    // Click ripple effect
    if (props.rippleEffect) {
      button.addEventListener('click', (e) => {
        const ripple = document.createElement('span');
        ripple.className = 'tmyl-button__ripple';

        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';

        button.appendChild(ripple);

        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    }

    // Active state micro-feedback from Trading Portal
    button.addEventListener('mousedown', () => {
      if (!button.disabled) {
        button.style.transform = props.elevation ? 'translateY(1px)' : 'scale(0.98)';
      }
    });

    button.addEventListener('mouseup', () => {
      setTimeout(() => {
        button.style.transform = props.elevation ? 'translateY(-1px)' : '';
      }, 100);
    });
  }

  /**
   * Enhanced accessibility from Trading Portal patterns
   */
  enhanceAccessibility(button, props) {
    // Ensure minimum touch target size (Trading Portal standard)
    const minSize = 44; // WCAG requirement
    const computedStyle = window.getComputedStyle(button);
    const currentHeight = parseInt(computedStyle.height);

    if (currentHeight < minSize) {
      button.style.minHeight = minSize + 'px';
    }

    // Enhanced focus management
    if (props.focusRing) {
      button.addEventListener('focus', () => {
        button.classList.add('tmyl-button--focused');
      });

      button.addEventListener('blur', () => {
        button.classList.remove('tmyl-button--focused');
      });
    }

    // Enhanced keyboard interaction
    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!button.disabled && !button.classList.contains('tmyl-button--loading')) {
          button.click();
        }
      }
    });

    // Screen reader enhancements
    if (props.loading) {
      button.setAttribute('aria-busy', 'true');
      button.setAttribute('aria-describedby', 'button-loading-description');
    }

    if (props.disabled) {
      button.setAttribute('aria-disabled', 'true');
    }
  }

  /**
   * Track button clicks for analytics
   */
  trackButtonClick(props, event) {
    const analyticsData = {
      component: 'button',
      variant: props.variant,
      size: props.size,
      text: props.text || '',
      timestamp: Date.now(),
      userAgent: navigator.userAgent
    };

    // Send to analytics service
    if (window.tamylaAnalytics && typeof window.tamylaAnalytics.track === 'function') {
      window.tamylaAnalytics.track('button_click', analyticsData);
    }
  }

  /**
   * Create button with shorthand methods
   */
  createPrimary(props = {}) {
    return this.create({ ...props, variant: 'primary' });
  }

  createSecondary(props = {}) {
    return this.create({ ...props, variant: 'secondary' });
  }

  createGhost(props = {}) {
    return this.create({ ...props, variant: 'ghost' });
  }

  createDanger(props = {}) {
    return this.create({ ...props, variant: 'danger' });
  }

  createSuccess(props = {}) {
    return this.create({ ...props, variant: 'success' });
  }

  /**
   * Create button with icon shortcuts
   */
  createWithIcon(iconName, props = {}) {
    return this.create({ ...props, icon: iconName });
  }

  createIconOnly(iconName, props = {}) {
    return this.create({
      ...props,
      icon: iconName,
      children: '',
      'aria-label': props['aria-label'] || iconName
    });
  }

  /**
   * Update existing button properties
   */
  update(button, props) {
    updateButtonState(button, props);
    return button;
  }

  /**
   * Attach controller to existing button element
   */
  attachController(element) {
    if (!element._controller) {
      const controller = new ButtonController(element);
      element._controller = controller;
    }
    return element._controller;
  }

  /**
   * Create multiple buttons
   */
  createMultiple(buttonConfigs) {
    return buttonConfigs.map(config => this.create(config));
  }

  /**
   * Create button group
   */
  createGroup(buttons, groupProps = {}) {
    const group = document.createElement('div');
    group.className = 'tmyl-button-group';

    if (groupProps.className) {
      group.className += ` ${groupProps.className}`;
    }

    const buttonElements = buttons.map(buttonConfig =>
      typeof buttonConfig === 'object' ? this.create(buttonConfig) : buttonConfig
    );

    buttonElements.forEach(button => group.appendChild(button));

    return group;
  }

  /**
   * Validation methods
   */
  validateProps(props) {
    const errors = [];

    if (props.variant && !this.variants.includes(props.variant)) {
      errors.push(`Invalid variant: ${props.variant}. Must be one of: ${this.variants.join(', ')}`);
    }

    if (props.size && !this.sizes.includes(props.size)) {
      errors.push(`Invalid size: ${props.size}. Must be one of: ${this.sizes.join(', ')}`);
    }

    return errors;
  }

  /**
   * Accessibility helpers
   */
  makeAccessible(button, options = {}) {
    const {
      label,
      describedBy,
      expanded,
      controls,
      pressed
    } = options;

    if (label) button.setAttribute('aria-label', label);
    if (describedBy) button.setAttribute('aria-describedby', describedBy);
    if (expanded !== undefined) button.setAttribute('aria-expanded', expanded);
    if (controls) button.setAttribute('aria-controls', controls);
    if (pressed !== undefined) button.setAttribute('aria-pressed', pressed);

    return button;
  }
}

// Create default factory instance
export const buttonFactory = new ButtonFactory();

// Convenience exports
export const {
  create: createButton,
  createPrimary,
  createSecondary,
  createGhost,
  createDanger,
  createSuccess,
  createWithIcon,
  createIconOnly
} = buttonFactory;

// Export components for direct usage
export { buttonIcons, getButtonIcon, ButtonController };
