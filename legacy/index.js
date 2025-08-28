/**
 * Legacy Components Index
 *
 * ⚠️ DEPRECATED: These components are legacy React patterns.
 * ⚠️ Use modern modular adapters from core/adapters/ instead.
 *
 * This index is maintained for backward compatibility only.
 * New projects should use the modern component system.
 */

console.warn('⚠️ DEPRECATED: You are importing legacy components. Consider migrating to modern modular adapters from core/adapters/');

// Export legacy components for backward compatibility
export { default as TamylaEmailRecipients } from './TamylaEmailRecipients.js';
export { default as TamylaFileList } from './TamylaFileList.js';
export { default as TamylaModal } from './TamylaModal.js';
export { default as TamylaNotification } from './TamylaNotification.js';
export { default as TamylaInputGroup } from './TamylaInputGroup.js';

// Provide migration guidance
export const MIGRATION_GUIDE = {
  TamylaEmailRecipients: 'Use EmailRecipientsAdapter from core/adapters/',
  TamylaFileList: 'Use FileListAdapter from core/adapters/',
  TamylaModal: 'Use ModalAdapter from core/adapters/',
  TamylaNotification: 'Use NotificationAdapter from core/adapters/',
  TamylaInputGroup: 'Use modern input components from atoms/input-group/'
};
