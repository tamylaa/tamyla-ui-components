/**
 * Minimal Tamyla UI Components Export
 * Just the essential components for NPM publishing
 */

// Basic Button component
export function createButton(props = {}) {
  const button = document.createElement('button');
  button.className = 'tamyla-button';
  button.textContent = props.text || 'Button';
  if (props.onClick) button.onclick = props.onClick;
  return button;
}

// Basic Input component
export function createInput(props = {}) {
  const input = document.createElement('input');
  input.className = 'tamyla-input';
  input.type = props.type || 'text';
  input.placeholder = props.placeholder || '';
  input.value = props.value || '';
  return input;
}

// Basic Card component
export function createCard(props = {}) {
  const card = document.createElement('div');
  card.className = 'tamyla-card';
  
  if (props.title) {
    const title = document.createElement('h3');
    title.textContent = props.title;
    card.appendChild(title);
  }
  
  if (props.content) {
    const content = document.createElement('div');
    content.textContent = props.content;
    card.appendChild(content);
  }
  
  return card;
}

// Component factory
export function TamylaUI(type, props) {
  switch(type) {
    case 'button': return createButton(props);
    case 'input': return createInput(props);
    case 'card': return createCard(props);
    default: throw new Error(`Unknown component type: ${type}`);
  }
}

// Default export
export default {
  createButton,
  createInput,
  createCard,
  TamylaUI
};
