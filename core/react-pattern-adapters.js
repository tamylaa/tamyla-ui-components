/**
 * React Pattern Adapters
 * Legacy React components adapted to web components
 * Modularized from monolithic implementation
 */

// Import all adapters from separate modules
import { EmailRecipientsAdapter, emailRecipientsAdapter } from './adapters/email-recipients-adapter.js';
import { FileListAdapter, fileListAdapter } from './adapters/file-list-adapter.js';
import { ModalAdapter, modalAdapter } from './adapters/modal-adapter.js';
import { NotificationAdapter, notificationAdapter } from './adapters/notification-adapter.js';

// Export classes for direct instantiation
export {
  EmailRecipientsAdapter,
  FileListAdapter,
  ModalAdapter,
  NotificationAdapter
};

// Export singleton instances for convenience (legacy compatibility)
export {
  emailRecipientsAdapter,
  fileListAdapter,
  modalAdapter,
  notificationAdapter
};

// Maintain backward compatibility with old naming
export const notificationFactory = notificationAdapter;
