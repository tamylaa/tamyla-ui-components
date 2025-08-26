# Tamyla UI Components

**📦 NPM Package:** `@tamyla/ui-components@1.0.0`  
**🔗 GitHub:** https://github.com/tamylaa/tamyla-ui-components  
**✅ Status:** Production Ready - Published and Certified

A modular, reusable, and composable UI component library built with atomic design principles. Each component is designed to be plug-and-play with a consistent visual language throughout the entire system.

## 🚀 Quick Start

```bash
npm install @tamyla/ui-components
```

```javascript
import { createButton, createInput, createCard, TamylaUI } from '@tamyla/ui-components';

// Create components
const button = createButton({ text: 'Click me!' });
const input = createInput({ placeholder: 'Type here...' });
const card = createCard({ title: 'My Card', content: 'Card content' });

// Or use the factory
const factoryButton = TamylaUI('button', { text: 'Factory button' });
```

## 📚 Documentation

- **📋 [Complete Implementation Summary](./COMPLETE_IMPLEMENTATION_SUMMARY.md)** - Full project overview and achievements
- **🔧 [Future Development Process](./FUTURE_DEVELOPMENT_PROCESS.md)** - Guidelines for making changes and maintaining quality
- **📖 [Reuse Guide](./REUSE_GUIDE.md)** - How to use these components in other projects
- **🏗️ [Build System Documentation](./COMPLETE_BUILD_SYSTEM.md)** - Technical build system details
- **🚀 [Certification System](./CERTIFICATION_SYSTEM_README.md)** - Quality assurance process

## 🎯 Design Philosophy

Instead of monolithic, standalone components, this design system follows atomic design methodology:

- **Atoms**: Basic building blocks (buttons, inputs, cards)
- **Molecules**: Combinations of atoms (search bars, content cards)
- **Organisms**: Complete interface sections (search interfaces, dashboards)

## 🏗️ Architecture

```
ui-components/
├── core/
│   ├── tokens.css          # Design tokens (colors, spacing, typography)
│   └── utilities.css       # Utility classes for rapid development
├── atoms/
│   ├── tmyl-button.js      # Versatile button component
│   ├── tmyl-input.js       # Input field with variants
│   └── tmyl-card.js        # Container component
├── molecules/
│   ├── tmyl-search-bar.js  # Search with voice & suggestions
│   └── tmyl-content-card.js # Content display with actions
├── organisms/
│   └── tmyl-search-interface.js # Complete search experience
├── demo.html               # Interactive component showcase
├── index.js               # Main export file
└── README.md              # This file
```

## 🚀 Quick Start

### 1. Basic Setup

```html
<!DOCTYPE html>
<html>
<head>
    <!-- Load core design tokens -->
    <link rel="stylesheet" href="./ui-components/core/tokens.css">
    <link rel="stylesheet" href="./ui-components/core/utilities.css">
</head>
<body>
    <!-- Use components -->
    <tmyl-search-bar voice-enabled clearable></tmyl-search-bar>
    <tmyl-button variant="primary" size="lg">Get Started</tmyl-button>
    
    <!-- Load component library -->
    <script type="module" src="./ui-components/index.js"></script>
</body>
</html>
```

### 2. Module Import

```javascript
// Import entire design system
import './ui-components/index.js';

// Or import specific components
import { TmylButton, TmylSearchBar } from './ui-components/index.js';
```

### 3. Component Usage

```html
<!-- Atoms: Basic building blocks -->
<tmyl-button variant="primary" icon="search" loading>Search</tmyl-button>
<tmyl-input label="Email" type="email" icon="email" clearable></tmyl-input>
<tmyl-card variant="elevated" hover clickable>Content here</tmyl-card>

<!-- Molecules: Composite components -->
<tmyl-search-bar 
    placeholder="Search content..." 
    voice-enabled
    clearable
></tmyl-search-bar>

<tmyl-content-card 
    .content="${contentObj}"
    selectable
    show-actions
></tmyl-content-card>

<!-- Organisms: Complete interfaces -->
<tmyl-search-interface 
    enable-voice-search
    enable-selection
    show-filters
></tmyl-search-interface>
```

## 🎨 Design Tokens

The system uses CSS custom properties for consistent theming:

```css
/* Colors */
--tmyl-primary-500: #3B82F6;
--tmyl-success-500: #22C55E;
--tmyl-error-500: #EF4444;

/* Typography */
--tmyl-text-base: 1rem;
--tmyl-font-semibold: 600;

/* Spacing */
--tmyl-space-4: 1rem;
--tmyl-space-6: 1.5rem;

/* Shadows */
--tmyl-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
```

## 📦 Component Reference

### Atoms

#### TmylButton
```html
<tmyl-button 
    variant="primary|secondary|ghost|danger|success"
    size="sm|md|lg|xl"
    icon="search|plus|download|etc"
    loading
    disabled
    full-width
>Button Text</tmyl-button>
```

**Events**: `tmyl-click`

#### TmylInput
```html
<tmyl-input 
    type="text|email|password|etc"
    label="Field Label"
    placeholder="Placeholder text"
    icon="email|search|lock|etc"
    error-text="Error message"
    helper-text="Help text"
    clearable
    required
></tmyl-input>
```

**Events**: `tmyl-input`, `tmyl-change`, `tmyl-focus`, `tmyl-blur`, `tmyl-clear`

#### TmylCard
```html
<tmyl-card 
    variant="flat|outlined|elevated|raised"
    padding="none|sm|md|lg|xl"
    clickable
    hover
>
    <div slot="header">Header content</div>
    <div>Main content</div>
    <div slot="footer">Footer content</div>
</tmyl-card>
```

**Events**: `tmyl-card-click`

### Molecules

#### TmylSearchBar
```html
<tmyl-search-bar 
    placeholder="Search..."
    voice-enabled
    clearable
    .suggestions="${suggestionsArray}"
    show-suggestions
></tmyl-search-bar>
```

**Events**: `tmyl-search`, `tmyl-search-input`, `tmyl-suggestions-request`, `tmyl-voice-result`

**Methods**: `focus()`, `clear()`, `setSuggestions(array)`

#### TmylContentCard
```html
<tmyl-content-card 
    .content="${contentObject}"
    size="compact|default|detailed"
    selectable
    selected
    show-actions
    .highlightTerms="${['search', 'term']}"
></tmyl-content-card>
```

**Events**: `tmyl-content-select`, `tmyl-content-action`

### Organisms

#### TmylSearchInterface
```html
<tmyl-search-interface 
    enable-voice-search
    enable-selection
    show-filters
    view-mode="grid|list"
    .results="${resultsArray}"
    .filters="${filtersObject}"
></tmyl-search-interface>
```

**Events**: `tmyl-search-request`, `tmyl-suggestions-request`, `tmyl-content-select`, `tmyl-content-action`, `tmyl-bulk-action`

**Methods**: `setResults(array, total)`, `setLoading(boolean)`, `setSuggestions(array)`, `clearResults()`

## 🎧 Voice Search Integration

The design system includes built-in voice search capabilities:

```javascript
// Voice search is automatically enabled when supported
searchBar.addEventListener('tmyl-voice-result', (e) => {
    console.log('Voice input:', e.detail.transcript);
});

// Voice recognition errors
searchBar.addEventListener('tmyl-voice-error', (e) => {
    console.log('Voice error:', e.detail.error);
});
```

## 🎯 Event Handling

All components emit custom events with detailed payloads:

```javascript
// Search events
searchInterface.addEventListener('tmyl-search-request', (e) => {
    const { query, filters, page, sortBy } = e.detail;
    // Perform search API call
});

// Selection events
searchInterface.addEventListener('tmyl-content-select', (e) => {
    const { content, selected } = e.detail;
    // Handle content selection
});

// Bulk actions
searchInterface.addEventListener('tmyl-bulk-action', (e) => {
    const { action, items } = e.detail;
    // Handle bulk operations
});
```

## 🎨 Customization

### Theme Customization
```css
:root {
    /* Override default tokens */
    --tmyl-primary-500: #your-brand-color;
    --tmyl-border-radius: 8px;
    --tmyl-font-sans: 'Your Font', sans-serif;
}
```

### Component Customization
```css
/* Target specific components */
tmyl-button {
    --tmyl-button-height-md: 3rem;
}

tmyl-search-bar {
    --tmyl-search-bar-height: 4rem;
}
```

## 📱 Responsive Design

All components are responsive by default with mobile-first design:

```css
/* Automatic responsive behavior */
.tmyl-grid-cols-3 {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

/* Breakpoint utilities */
@media (max-width: 768px) {
    .tmyl-md\:hidden { display: none; }
}
```

## ♿ Accessibility

The design system includes accessibility features:

- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Focus Management**: Visible focus indicators and logical tab order
- **Color Contrast**: WCAG compliant color combinations
- **Reduced Motion**: Respects `prefers-reduced-motion` setting

## 🔄 Integration Examples

### Meilisearch Integration
```javascript
import { TmylSearchInterface } from './ui-components/index.js';

const searchInterface = document.querySelector('tmyl-search-interface');

searchInterface.addEventListener('tmyl-search-request', async (e) => {
    const { query, filters, page } = e.detail;
    
    try {
        searchInterface.setLoading(true);
        const response = await fetch('/api/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, filters, page })
        });
        
        const { results, total } = await response.json();
        searchInterface.setResults(results, total);
    } catch (error) {
        console.error('Search failed:', error);
        searchInterface.setResults([], 0);
    }
});
```

### Campaign Integration
```javascript
searchInterface.addEventListener('tmyl-bulk-action', async (e) => {
    if (e.detail.action === 'add-to-campaign') {
        const contentIds = e.detail.items.map(item => item.id);
        
        // Add to campaign API call
        await fetch('/api/campaigns/add-content', {
            method: 'POST',
            body: JSON.stringify({ contentIds })
        });
        
        alert(`Added ${contentIds.length} items to campaign`);
    }
});
```

## 🧪 Development

### Running the Demo
```bash
# Serve the demo locally
npx http-server . -p 8080

# Open in browser
open http://localhost:8080/ui-components/demo.html
```

### Creating New Components

1. **Atoms**: Single-purpose, reusable components
2. **Molecules**: Combinations of atoms with specific functionality  
3. **Organisms**: Complex components that form complete interface sections

```javascript
// New component template
import { LitElement, html, css } from 'lit';

export class TmylNewComponent extends LitElement {
    static properties = {
        // Define reactive properties
    };
    
    static styles = css`
        /* Use design tokens */
        :host {
            font-family: var(--tmyl-font-sans);
            color: var(--tmyl-text-primary);
        }
    `;
    
    render() {
        return html`<!-- Template -->`;
    }
}

customElements.define('tmyl-new-component', TmylNewComponent);
```

## 🤝 Contributing

1. Follow atomic design principles
2. Use design tokens for all styling
3. Emit meaningful custom events
4. Include accessibility features
5. Write comprehensive documentation
6. Test responsive behavior

## 📄 License

This design system is part of the Tamyla platform and follows the project's licensing terms.

---

**Built with ❤️ for the Tamyla ecosystem**

*Modular • Reusable • Consistent • Accessible*
