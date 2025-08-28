/**
 * Action Card Templates
 * Separated template generation logic following single responsibility principle
 */

/**
 * Create the main card HTML template
 */
export function createActionCardTemplate(props) {
  return `
    <div class="tmyl-action-card__background"></div>
    <div class="tmyl-action-card__content">
      ${createIconTemplate(props)}
      ${createInfoTemplate(props)}
      ${createRewardTemplate(props)}
      ${createStatusIconTemplate(props)}
    </div>
    ${createInteractiveElements(props)}
  `;
}

/**
 * Create icon template
 */
function createIconTemplate(props) {
  if (!props.icon) return '';

  return `
    <div class="tmyl-action-card__icon" aria-hidden="true">
      ${props.icon}
    </div>
  `;
}

/**
 * Create info section template
 */
function createInfoTemplate(props) {
  return `
    <div class="tmyl-action-card__info">
      <h3 class="tmyl-action-card__title">${props.title}</h3>
      ${createDescriptionTemplate(props)}
      ${createProgressTemplate(props)}
    </div>
  `;
}

/**
 * Create description template
 */
function createDescriptionTemplate(props) {
  if (!props.description) return '';

  return `
    <p class="tmyl-action-card__description">${props.description}</p>
  `;
}

/**
 * Create progress template
 */
function createProgressTemplate(props) {
  if (!props.showProgress || props.progress === null) return '';

  return `
    <div class="tmyl-action-card__progress">
      <div class="tmyl-action-card__progress-bar">
        <div class="tmyl-action-card__progress-fill" style="width: ${props.progress}%"></div>
      </div>
      <span class="tmyl-action-card__progress-text">${props.progress}% complete</span>
    </div>
  `;
}

/**
 * Create reward template
 */
function createRewardTemplate(props) {
  if (!props.showReward || !props.reward) return '';

  return `
    <div class="tmyl-action-card__reward" aria-label="Reward: ${props.reward}">
      ${props.reward}
    </div>
  `;
}

/**
 * Create status icon template
 */
function createStatusIconTemplate(props) {
  switch (props.status) {
  case 'completed':
    return createCompletedIconTemplate();
  case 'locked':
    return createLockedIconTemplate();
  default:
    return '';
  }
}

/**
 * Create completed icon template
 */
function createCompletedIconTemplate() {
  return `
    <div class="tmyl-action-card__check" aria-hidden="true">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
      </svg>
    </div>
  `;
}

/**
 * Create locked icon template
 */
function createLockedIconTemplate() {
  return `
    <div class="tmyl-action-card__lock" aria-hidden="true">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM15.1 8H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
      </svg>
    </div>
  `;
}

/**
 * Create interactive elements template
 */
function createInteractiveElements(props) {
  if (!props.interactive) return '';

  return `
    <div class="tmyl-action-card__ripple-container"></div>
  `;
}

/**
 * Template configurations and variants
 */
export const actionCardTemplateConfigs = {
  sizes: ['sm', 'md', 'lg'],
  statuses: ['available', 'completed', 'locked', 'disabled'],
  colors: ['primary', 'secondary', 'success', 'warning', 'info']
};
