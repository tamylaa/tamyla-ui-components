# UI Components Reuse Guide

Generated: 2025-08-26T10:15:37.125Z  
Version: 2.0.0  
Status: **READY_FOR_REUSE**

## ✅ Your components are ready for cross-project reuse!

### What you have:
- ✅ Cross-framework compatibility (React, Vue, Angular, Vanilla)
- ✅ ESM module system with tree-shaking
- ✅ Atomic design structure (atoms, molecules, organisms, applications)
- ✅ Individual component imports for optimal bundle size
- ✅ CSS integration with utility classes
- ✅ TypeScript definitions ready
- ✅ Git repository with proper ignore patterns

## 🚀 How to use in other projects:

### Option 1: NPM Package (Recommended)
```bash
# Publish to NPM (one time)
npm publish

# Install in other projects
npm install @tamyla/ui-components
```

```javascript
// Use in any project
import { Button, Card } from '@tamyla/ui-components';
import '@tamyla/ui-components/dist/tamyla-ui.css';

const button = Button.create({ text: 'Click me' });
document.body.appendChild(button);
```

### Option 2: Direct Copy
```bash
# Copy specific components
cp -r ui-components/atoms/button other-project/src/components/
cp -r ui-components/molecules/content-card other-project/src/components/
```

### Option 3: Git Submodule
```bash
# In other projects
git submodule add <your-repo-url> src/ui-components
```

### Option 4: CDN (for static sites)
```html
<link rel="stylesheet" href="./ui-components/dist/tamyla-ui.css">
<script type="module" src="./ui-components/dist/tamyla-ui.esm.js"></script>
```

## 🎯 Next Steps:
- Run: npm run dev (start development server)
- Run: npm run storybook (component documentation)
- Run: npm run test (run component tests)
- Customize components for your brand
- Publish to NPM for team distribution

## 🔧 Framework-Specific Examples:

### React Project
```jsx
import { ButtonReact } from '@tamyla/ui-components/react';

function App() {
  return <ButtonReact variant="primary">Hello</ButtonReact>;
}
```

### Vue Project
```vue
<template>
  <div ref="buttonContainer"></div>
</template>

<script>
import { Button } from '@tamyla/ui-components';

export default {
  mounted() {
    const button = Button.create({ text: 'Vue Button' });
    this.$refs.buttonContainer.appendChild(button);
  }
}
</script>
```

### Angular Project
```typescript
import { Component, ElementRef } from '@angular/core';
import { Button } from '@tamyla/ui-components';

@Component({
  template: '<div #buttonContainer></div>'
})
export class MyComponent {
  constructor(private el: ElementRef) {
    const button = Button.create({ text: 'Angular Button' });
    this.el.nativeElement.appendChild(button);
  }
}
```

---
Your UI components are production-ready! 🎉
