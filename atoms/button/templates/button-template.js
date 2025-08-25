/**
 * Button Template Generator
 * Pure HTML template generation for button component
 */

import { getButtonIcon } from '../icons/button-icons.js';

export function createButtonTemplate(props) {
  const {
    variant = 'primary',
    size = 'md',
    icon = '',
    iconPosition = 'left',
    loading = false,
    disabled = false,
    fullWidth = false,
    children = ''
  } = props;

  const classes = [
    'tmyl-button',
    `tmyl-button--${variant}`,
    `tmyl-button--${size}`,
    loading && 'tmyl-button--loading',
    fullWidth && 'tmyl-button--full-width'
  ].filter(Boolean).join(' ');

  const iconHtml = icon ? `
    <span class="tmyl-button__icon">
      ${getButtonIcon(icon)}
    </span>
  ` : '';

  const loadingSpinner = loading ? `
    <div class="tmyl-button__loading-spinner"></div>
  ` : '';

  return `
    <button 
      class="${classes}"
      ${disabled ? 'disabled' : ''}
      ${loading ? 'aria-busy="true"' : ''}
      type="button"
    >
      ${loadingSpinner}
      ${iconPosition === 'left' ? iconHtml : ''}
      ${children}
      ${iconPosition === 'right' ? iconHtml : ''}
    </button>
  `;
}

export function updateButtonState(element, props) {
  const button = element.querySelector('button');
  if (!button) return;

  // Update classes
  const classes = [
    'tmyl-button',
    `tmyl-button--${props.variant || 'primary'}`,
    `tmyl-button--${props.size || 'md'}`,
    props.loading && 'tmyl-button--loading',
    props.fullWidth && 'tmyl-button--full-width'
  ].filter(Boolean).join(' ');

  button.className = classes;

  // Update attributes
  if (props.disabled) {
    button.setAttribute('disabled', '');
  } else {
    button.removeAttribute('disabled');
  }

  if (props.loading) {
    button.setAttribute('aria-busy', 'true');
  } else {
    button.removeAttribute('aria-busy');
  }
}
