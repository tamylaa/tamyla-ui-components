/**
 * Email Recipients Adapter
 * Adapted from legacy/TamylaEmailRecipients.js React patterns
 * Separated from monolithic react-pattern-adapters.js
 */

import { InputFactory } from '../../atoms/input/input-system.js';
import { ButtonFactory } from '../../atoms/button/button-system.js';

/**
 * Email Recipients Factory
 * Creates email recipient input components with chip-based multi-value pattern
 */
export class EmailRecipientsAdapter {
  constructor() {
    this.inputFactory = new InputFactory();
    this.buttonFactory = new ButtonFactory();
  }

  create(props = {}) {
    const {
      value = [],
      onChange,
      placeholder = 'Add recipient email',
      maxRecipients = 50,
      allowDuplicates = false,
      validateEmail = true,
      container = null,
      className = ''
    } = props;

    let element = null;
    let currentValue = [...value];
    let inputElement = null;

    function createComponent() {
      element = document.createElement('div');
      element.className = `email-recipients ${className}`;
      
      // Create input using atomic Input
      const inputContainer = document.createElement('div');
      inputContainer.className = 'email-input-container';
      
      inputElement = this.inputFactory.create({
        type: 'email',
        placeholder,
        onKeyDown: handleKeyDown,
        onBlur: handleBlur,
        container: inputContainer
      });

      // Create add button using atomic Button
      const addButtonContainer = document.createElement('div');
      const addButton = this.buttonFactory.create({
        variant: 'primary',
        size: 'sm',
        label: 'Add',
        onClick: handleAdd,
        container: addButtonContainer
      });

      // Create chips container
      const chipsContainer = document.createElement('div');
      chipsContainer.className = 'email-chips';

      // Assemble component
      element.appendChild(chipsContainer);
      element.appendChild(inputContainer);
      element.appendChild(addButtonContainer);

      // Render initial chips
      renderChips();

      if (container) {
        container.appendChild(element);
      }

      return {
        element,
        getValue: () => [...currentValue],
        setValue: (newValue) => {
          currentValue = [...newValue];
          renderChips();
        },
        addEmail: (email) => addEmail(email),
        removeEmail: (email) => removeEmail(email),
        clear: () => {
          currentValue = [];
          renderChips();
          triggerChange();
        },
        destroy: () => {
          if (element?.parentNode) {
            element.parentNode.removeChild(element);
          }
        }
      };
    }

    // Email validation (extracted from legacy)
    function isValidEmail(email) {
      if (!validateEmail) return true;
      return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
    }

    // Add email with validation
    function addEmail(email) {
      const trimmedEmail = email.trim();
      
      if (!trimmedEmail) return false;
      
      if (!isValidEmail(trimmedEmail)) {
        showError('Invalid email format');
        return false;
      }
      
      if (!allowDuplicates && currentValue.includes(trimmedEmail)) {
        showError('Email already added');
        return false;
      }
      
      if (currentValue.length >= maxRecipients) {
        showError(`Maximum ${maxRecipients} recipients allowed`);
        return false;
      }
      
      currentValue.push(trimmedEmail);
      renderChips();
      triggerChange();
      return true;
    }

    // Remove email
    function removeEmail(emailToRemove) {
      currentValue = currentValue.filter(email => email !== emailToRemove);
      renderChips();
      triggerChange();
    }

    // Render chips (like React component render)
    function renderChips() {
      const chipsContainer = element.querySelector('.email-chips');
      
      chipsContainer.innerHTML = currentValue.map(email => `
        <span class="email-chip" data-email="${email}">
          <span class="chip-text">${email}</span>
          <button class="chip-remove" data-email="${email}" aria-label="Remove ${email}">×</button>
        </span>
      `).join('');

      // Add event listeners to remove buttons
      chipsContainer.querySelectorAll('.chip-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          removeEmail(btn.dataset.email);
        });
      });
    }

    // Event handlers
    function handleKeyDown(event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        handleAdd();
      }
    }

    function handleBlur() {
      // Optional: Add email on blur
      const inputValue = inputElement.getValue();
      if (inputValue.trim()) {
        handleAdd();
      }
    }

    function handleAdd() {
      const inputValue = inputElement.getValue();
      if (addEmail(inputValue)) {
        inputElement.setValue('');
      }
    }

    function triggerChange() {
      if (onChange) {
        onChange([...currentValue]);
      }
    }

    function showError(message) {
      // Could integrate with notification system
      console.error('EmailRecipients:', message);
      
      // Dispatch error event for external handling
      if (element) {
        element.dispatchEvent(new CustomEvent('email-recipients-error', {
          detail: { message, currentValue }
        }));
      }
    }

    return createComponent.call(this);
  }
}

// Create singleton instance
export const emailRecipientsAdapter = new EmailRecipientsAdapter();
