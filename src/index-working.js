/**
 * Tamyla UI Components - Main Entry Point
 * Simplified exports for build system
 */

// Main UI System - this definitely exists in root
import TamylaUISystem from '../tamyla-ui-system.js';

// Simple component interface
const TamylaUI = {
  // Core system
  System: TamylaUISystem,
  
  // Factory methods for components
  createButton: (options) => {
    console.log('Button factory called with:', options);
    const button = document.createElement('button');
    button.textContent = options?.text || 'Button';
    button.className = 'tamyla-button';
    return button;
  },
  
  createInput: (options) => {
    console.log('Input factory called with:', options);
    const input = document.createElement('input');
    input.type = options?.type || 'text';
    input.placeholder = options?.placeholder || '';
    input.className = 'tamyla-input';
    return input;
  },
  
  createCard: (options) => {
    console.log('Card factory called with:', options);
    const card = document.createElement('div');
    card.className = 'tamyla-card';
    if (options?.title) {
      const title = document.createElement('h3');
      title.textContent = options.title;
      card.appendChild(title);
    }
    if (options?.content) {
      const content = document.createElement('p');
      content.textContent = options.content;
      card.appendChild(content);
    }
    return card;
  },
  
  // Version info
  version: '1.0.0',
  name: '@tamyla/ui-components'
};

// Named exports
export const Button = { create: TamylaUI.createButton };
export const Input = { create: TamylaUI.createInput };
export const Card = { create: TamylaUI.createCard };
export const System = TamylaUISystem;

// Default export
export default TamylaUI;
