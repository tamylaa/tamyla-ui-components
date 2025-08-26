/**
 * Adapters Index
 * Clean exports for all adapter modules
 */

export { EmailRecipientsAdapter, emailRecipientsAdapter } from './email-recipients-adapter.js';
export { FileListAdapter, fileListAdapter } from './file-list-adapter.js';
export { ModalAdapter, modalAdapter } from './modal-adapter.js';
export { NotificationAdapter, notificationAdapter } from './notification-adapter.js';

// Legacy compatibility
export { notificationAdapter as notificationFactory } from './notification-adapter.js';
