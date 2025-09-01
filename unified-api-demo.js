/**
 * UNIFIED API DEMO - Shows the new single-entry-point API
 */

import { UI } from './src/ui-factory.js';

// Demo: Create various components using the unified API
console.log('🎯 Tamyla UI Components - Unified API Demo');
console.log('==========================================');

// 1. Basic component creation
console.log('\n1. Basic Components:');
const button = UI.create('button', { variant: 'primary', text: 'Click Me!' });
console.log('✅ Button created:', button.tagName, button.textContent);

const input = UI.create('input', { type: 'email', label: 'Email Address', placeholder: 'user@example.com' });
console.log('✅ Input created:', input.tagName, input.getAttribute('type'));

const card = UI.create('card', { title: 'Demo Card', content: 'This is a demo card', variant: 'elevated' });
console.log('✅ Card created:', card.tagName, card.querySelector('h3')?.textContent);

// 2. Batch creation
console.log('\n2. Batch Creation:');
const components = UI.createMultiple([
  { type: 'button', props: { text: 'Save', variant: 'primary' } },
  { type: 'button', props: { text: 'Cancel', variant: 'secondary' } },
  { type: 'input', props: { placeholder: 'Search...' } }
]);
console.log('✅ Batch created:', components.length, 'components');

// 3. Available types
console.log('\n3. Available Component Types:');
const types = UI.getAvailableTypes();
console.log('✅ Atoms:', types.atoms.join(', '));
console.log('✅ Molecules:', types.molecules.join(', '));
console.log('✅ Organisms:', types.organisms.join(', '));

// 4. Variants
console.log('\n4. Component Variants:');
const buttonVariants = UI.getVariants('button');
console.log('✅ Button variants:', buttonVariants.join(', '));

// 5. Error handling
console.log('\n5. Error Handling:');
try {
  UI.create('nonexistent-component', {});
} catch (error) {
  console.log('✅ Error caught:', error.message);
}

console.log('\n🎉 Unified API Demo Complete!');
console.log('==========================================');
console.log('✨ Benefits:');
console.log('   • Single entry point for all components');
console.log('   • Consistent API patterns');
console.log('   • Type-safe and predictable');
console.log('   • AI-developer friendly');
console.log('   • Easy to maintain and extend');
