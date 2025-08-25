/**
 * Atoms Entry Point
 * Provides access to all atomic components
 */

export { AtomFactory, createAtom } from './atom-factory.js';

// Individual atom exports
export { ButtonFactory } from './button/button-system.js';
export { InputFactory } from './input/input-system.js';
export { CardFactory } from './card/card-system.js';

// Atom utilities
export const AVAILABLE_ATOMS = [
  'button',
  'input', 
  'card'
];

// Dynamic atom loader
export async function loadAtom(atomName) {
  const atomMap = {
    button: () => import('./button/button-system.js'),
    input: () => import('./input/input-system.js'),
    card: () => import('./card/card-system.js')
  };
  
  const loader = atomMap[atomName];
  if (!loader) {
    throw new Error(`Atom '${atomName}' not found. Available atoms: ${AVAILABLE_ATOMS.join(', ')}`);
  }
  
  try {
    const module = await loader();
    return module.default || module[Object.keys(module)[0]];
  } catch (error) {
    console.error(`Failed to load atom '${atomName}':`, error);
    throw error;
  }
}

// Batch atom loader
export async function loadAtoms(atomNames) {
  const results = {};
  
  for (const atomName of atomNames) {
    try {
      results[atomName] = await loadAtom(atomName);
    } catch (error) {
      console.warn(`Failed to load atom '${atomName}':`, error.message);
      results[atomName] = null;
    }
  }
  
  return results;
}

// Default export for UMD compatibility
export default {
  AtomFactory: () => import('./atom-factory.js'),
  Button: () => import('./button/button-system.js'),
  Input: () => import('./input/input-system.js'),
  Card: () => import('./card/card-system.js'),
  loadAtom,
  loadAtoms,
  AVAILABLE_ATOMS
};
