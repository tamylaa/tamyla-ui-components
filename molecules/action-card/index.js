/**
 * Action Card Module - Modular Architecture
 * Exports all action card components with proper separation of concerns
 */

// Main factory and system
export { ActionCardFactory, actionCardFactory } from './action-card-system.js';

// Templates
export { createActionCardTemplate, actionCardTemplateConfigs } from './templates/action-card-template.js';

// Controllers
export { ActionCardController, actionCardUtils } from './controllers/action-card-controller.js';

// Icons
export { actionCardIcons, iconUtils } from './icons/action-card-icons.js';

// Configuration
export {
  defaultActionCardProps,
  actionCardConfig,
  actionCardValidation,
  actionCardThemes
} from './config/action-card-config.js';

/**
 * Convenience exports for common use cases
 */
export const createActionCard = (props) => actionCardFactory.create(props);
export const createAvailableCard = (props) => actionCardFactory.createAvailable(props);
export const createCompletedCard = (props) => actionCardFactory.createCompleted(props);
export const createLockedCard = (props) => actionCardFactory.createLocked(props);
export const createProgressCard = (props) => actionCardFactory.createWithProgress(props);
