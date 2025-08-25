/**
 * Card Template Generator
 * Pure HTML template generation for card component
 */

import { getCardIcon } from '../icons/card-icons.js';

export function createCardTemplate(props) {
  const {
    variant = 'default',
    size = 'md',
    padding = 'md',
    elevation = 'sm',
    interactive = false,
    selected = false,
    disabled = false,
    header = '',
    children = '',
    footer = '',
    image = '',
    icon = '',
    title = '',
    subtitle = '',
    actions = []
  } = props;

  const classes = [
    'tmyl-card',
    `tmyl-card--${variant}`,
    `tmyl-card--${size}`,
    `tmyl-card--padding-${padding}`,
    `tmyl-card--elevation-${elevation}`,
    interactive && 'tmyl-card--interactive',
    selected && 'tmyl-card--selected',
    disabled && 'tmyl-card--disabled'
  ].filter(Boolean).join(' ');

  const imageHtml = image ? `
    <div class="tmyl-card__image">
      <img src="${image}" alt="" loading="lazy" />
    </div>
  ` : '';

  const iconHtml = icon ? `
    <div class="tmyl-card__icon">
      ${getCardIcon(icon)}
    </div>
  ` : '';

  const headerHtml = (header || title || subtitle || icon) ? `
    <div class="tmyl-card__header">
      ${iconHtml}
      ${title ? `<h3 class="tmyl-card__title">${title}</h3>` : ''}
      ${subtitle ? `<p class="tmyl-card__subtitle">${subtitle}</p>` : ''}
      ${header}
    </div>
  ` : '';

  const contentHtml = children ? `
    <div class="tmyl-card__content">
      ${children}
    </div>
  ` : '';

  const actionsHtml = (actions.length > 0 || footer) ? `
    <div class="tmyl-card__footer">
      ${footer}
      ${actions.length > 0 ? `
        <div class="tmyl-card__actions">
          ${actions.map(action => `
            <button 
              class="tmyl-card__action tmyl-button tmyl-button--${action.variant || 'ghost'} tmyl-button--sm"
              data-action="${action.name || ''}"
            >
              ${action.label}
            </button>
          `).join('')}
        </div>
      ` : ''}
    </div>
  ` : '';

  return `
    <div 
      class="${classes}"
      ${interactive ? 'tabindex="0" role="button"' : ''}
      ${disabled ? 'aria-disabled="true"' : ''}
      ${selected ? 'aria-selected="true"' : ''}
    >
      ${imageHtml}
      ${headerHtml}
      ${contentHtml}
      ${actionsHtml}
    </div>
  `;
}

export function updateCardState(element, props) {
  const card = element.querySelector('.tmyl-card');
  if (!card) return;

  // Update classes
  const classes = [
    'tmyl-card',
    `tmyl-card--${props.variant || 'default'}`,
    `tmyl-card--${props.size || 'md'}`,
    `tmyl-card--padding-${props.padding || 'md'}`,
    `tmyl-card--elevation-${props.elevation || 'sm'}`,
    props.interactive && 'tmyl-card--interactive',
    props.selected && 'tmyl-card--selected',
    props.disabled && 'tmyl-card--disabled'
  ].filter(Boolean).join(' ');

  card.className = classes;

  // Update attributes
  if (props.disabled) {
    card.setAttribute('aria-disabled', 'true');
  } else {
    card.removeAttribute('aria-disabled');
  }

  if (props.selected) {
    card.setAttribute('aria-selected', 'true');
  } else {
    card.removeAttribute('aria-selected');
  }
}

// Template shortcuts for common card types
export const cardTemplates = {
  basic: (props) => createCardTemplate({
    variant: 'default',
    padding: 'md',
    elevation: 'sm',
    ...props
  }),

  elevated: (props) => createCardTemplate({
    variant: 'default',
    padding: 'lg',
    elevation: 'md',
    ...props
  }),

  outlined: (props) => createCardTemplate({
    variant: 'outlined',
    padding: 'md',
    elevation: 'none',
    ...props
  }),

  interactive: (props) => createCardTemplate({
    variant: 'default',
    padding: 'md',
    elevation: 'sm',
    interactive: true,
    ...props
  }),

  product: (props) => createCardTemplate({
    variant: 'default',
    padding: 'md',
    elevation: 'sm',
    interactive: true,
    ...props
  }),

  article: (props) => createCardTemplate({
    variant: 'default',
    padding: 'lg',
    elevation: 'sm',
    ...props
  }),

  profile: (props) => createCardTemplate({
    variant: 'default',
    padding: 'lg',
    elevation: 'sm',
    ...props
  })
};
