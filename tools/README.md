# Developer Tools for @tamyla/ui-components

This directory contains developer tools to enhance the development experience with the @tamyla/ui-components library.

## Available Tools

### 1. Component Explorer (`component-explorer.html`)

An interactive web-based tool for discovering and exploring all available UI components.

**Features:**
- 🔍 Search and filter components by name or category
- 📊 Component statistics and categorization
- 👀 Live component previews
- 📋 Copy code examples with one click
- 🎨 Visual component gallery with descriptions

**Usage:**
1. Open `tools/component-explorer.html` in your web browser
2. Browse components by category (Atoms, Molecules, Organisms)
3. Use the search bar to find specific components
4. Click "Preview" to see live component examples
5. Click "Copy Code" to copy usage examples

**Requirements:**
- Modern web browser with ES6 module support
- Access to the built `dist/tamyla-ui.esm.js` file

### 2. Enhanced TypeScript Definitions (`types/enhanced-ui.d.ts`)

Comprehensive TypeScript definitions providing excellent IntelliSense and type checking.

**Features:**
- 🎯 Full type safety for all component props
- 💡 IntelliSense autocompletion for component types and variants
- 🔧 Method overloads for better type inference
- 📚 Detailed JSDoc comments for all props and methods

**Usage:**
```typescript
import { UI } from '@tamyla/ui-components';
import type { ButtonProps, SearchInterfaceProps } from '@tamyla/ui-components/types/enhanced-ui';

// Full IntelliSense support
const button = UI.create('button', {
  text: 'Click me!',
  variant: 'primary', // IntelliSense shows available variants
  onClick: (event) => console.log('Clicked!')
});

// Type-safe props
const searchProps: SearchInterfaceProps = {
  title: 'Search',
  placeholder: 'Enter your query...',
  enableVoice: true,
  onSearch: (query, filters) => {
    // Fully typed parameters
  }
};
```

**Integration:**
- Include in your `tsconfig.json`:
```json
{
  "compilerOptions": {
    "types": ["@tamyla/ui-components/types/enhanced-ui"]
  }
}
```

### 3. Automated Test Suite (`test/unified-ui-test-suite.js`)

Comprehensive test suite for validating the unified UI factory API.

**Features:**
- ✅ 25+ automated test cases
- 🎯 Component creation validation
- 🔍 Method availability testing
- 🚨 Error handling verification
- 📊 Test results with detailed reporting

**Usage:**
```bash
# Run tests in browser
open test/test-runner.html

# Or run programmatically
import { runUnifiedUITests } from './test/unified-ui-test-suite.js';
const results = await runUnifiedUITests();
console.log(results);
```

## Development Workflow

### Setting Up Development Environment

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd ui-platform/packages/ui-components
npm install
```

2. **Build the library:**
```bash
npm run build
```

3. **Explore components:**
```bash
# Open component explorer
open tools/component-explorer.html
```

4. **Run tests:**
```bash
# Open test runner
open test/test-runner.html
```

### Using the Unified API

The library provides a single, consistent API for all components:

```javascript
import { UI } from '@tamyla/ui-components';

// Create any component
const button = UI.create('button', {
  text: 'Click me!',
  variant: 'primary'
});

const search = UI.create('search-interface', {
  title: 'Search',
  enableVoice: true
});

// Get available types
const types = UI.getAvailableTypes();
console.log(types.atoms);     // ['button', 'input', 'card', ...]
console.log(types.organisms); // ['search-interface', 'reward-system', ...]
```

### TypeScript Integration

For full TypeScript support:

```typescript
import { UI } from '@tamyla/ui-components';
import type { ButtonProps, SearchInterfaceProps } from '@tamyla/ui-components/types/enhanced-ui';

// Type-safe component creation
const button: HTMLElement = UI.create('button', {
  text: 'Type-safe button',
  variant: 'primary',
  onClick: (event) => {
    // event is properly typed
  }
});
```

## Component Categories

### Atoms
Basic building blocks:
- `button` - Interactive buttons with variants
- `input` - Form input fields
- `card` - Content containers
- `status-indicator` - Status display components

### Molecules
Combinations of atoms:
- `search-bar` - Search input with optional features
- `action-card` - Cards with primary actions
- `notification` - Toast-style notifications

### Organisms
Complex components combining molecules:
- `search-interface` - Complete search functionality
- `reward-system` - Gamification components
- `dashboard` - Data visualization layouts

## Best Practices

### 1. Use the Unified API
Always use `UI.create()` instead of direct component instantiation for consistency.

### 2. Leverage TypeScript
Import the enhanced type definitions for better development experience:
```typescript
import type { ComponentProps, ComponentType } from '@tamyla/ui-components/types/enhanced-ui';
```

### 3. Test Your Components
Use the automated test suite to validate component behavior:
```javascript
import { runUnifiedUITests } from './test/unified-ui-test-suite.js';
const results = await runUnifiedUITests();
// Check results for any failures
```

### 4. Explore Components
Use the component explorer to understand available options and their usage patterns.

## Troubleshooting

### Component Not Found
If a component type is not available:
1. Check `UI.getAvailableTypes()` for available components
2. Ensure the component is properly registered in the factory
3. Verify the build output includes the component

### TypeScript Errors
If you encounter TypeScript issues:
1. Ensure you're importing the enhanced type definitions
2. Check that your `tsconfig.json` includes the types
3. Verify component props match the defined interfaces

### Build Issues
If the build fails:
1. Run `npm run build` to rebuild the library
2. Check for any TypeScript compilation errors
3. Ensure all dependencies are installed

## Contributing

When adding new components:
1. Add component definition to the appropriate factory
2. Update the enhanced TypeScript definitions
3. Add test cases to the test suite
4. Update component explorer with new component info
5. Update this documentation

## Support

For issues or questions:
- Check the component explorer for usage examples
- Review the test suite for expected behavior
- Consult the enhanced TypeScript definitions for prop details
