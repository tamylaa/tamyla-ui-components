# Campaign Selector Application

A modular campaign content selection system following atomic design principles with React-inspired patterns.

## Overview

The Campaign Selector provides an intelligent interface for selecting content for marketing campaigns. It includes AI-powered recommendations, advanced filtering, and performance insights.

## Architecture

```
campaign-selector/
├── services/           # Business logic layer
│   ├── campaign-analytics.js      # Performance scoring & AI recommendations
│   ├── content-filter-engine.js   # Multi-dimensional filtering
│   └── selection-manager.js       # React-inspired selection state
├── templates/          # HTML generation layer  
│   └── campaign-selector-template.js
├── controllers/        # User interaction layer
│   └── campaign-selector-controller.js
├── styles/            # Styling layer
│   └── campaign-selector.css
└── campaign-selector-system.js    # Main orchestrator
```

## Key Features

### 🎯 Smart Content Selection
- Multi-content type support (Blog Posts, Videos, Images, Documents)
- Performance-based recommendations
- AI-powered content suggestions
- Maximum selection limits with validation

### 📊 Performance Analytics
- Real-time engagement metrics
- Performance scoring algorithms
- Selection insights and recommendations
- Reach estimation and analytics

### 🔍 Advanced Filtering
- Content type filtering
- Performance level filtering
- Date range filtering
- Real-time filter application

### 📱 Modern UI/UX
- Responsive design system
- Tabbed interface (Content/Recommendations/Templates)
- Card-based content display
- Interactive selection indicators

## Usage

### Basic Implementation

```javascript
import { CampaignSelectorSystem } from './campaign-selector-system.js';

const campaignSelector = new CampaignSelectorSystem({
  maxSelections: 10,
  showPerformanceInsights: true,
  enableRecommendations: true,
  enableTemplates: true
});

// Render in container
campaignSelector.render(document.getElementById('campaign-container'));

// Listen for selection changes
campaignSelector.on('selectionChanged', (event) => {
  console.log('Selected content:', event.selections);
  console.log('Performance insights:', event.insights);
});
```

### Advanced Configuration

```javascript
const campaignSelector = new CampaignSelectorSystem({
  // Selection Configuration
  maxSelections: 15,
  showPerformanceInsights: true,
  
  // Feature Toggles
  enableRecommendations: true,
  enableTemplates: true,
  
  // Custom Styling
  theme: 'dark',
  customColors: {
    primary: '#3B82F6',
    success: '#10B981',
    warning: '#F59E0B'
  }
});
```

## API Reference

### Main System

#### Constructor Options
- `maxSelections` (number): Maximum items that can be selected (default: 10)
- `showPerformanceInsights` (boolean): Show performance analytics (default: true)
- `enableRecommendations` (boolean): Enable AI recommendations tab (default: true)
- `enableTemplates` (boolean): Enable templates tab (default: true)

#### Methods
- `render(container)`: Render the application in the specified container
- `getSelectedContent()`: Get array of currently selected content items
- `clearSelections()`: Clear all current selections
- `addContent(newContent)`: Add new content items to the library
- `updateFilters(filters)`: Update active filters programmatically
- `destroy()`: Clean up the application instance

#### Events
- `selectionChanged`: Fired when content selection changes
  - `event.selections`: Array of selected content items
  - `event.insights`: Performance insights object

### Services Layer

#### CampaignAnalytics
- Performance scoring algorithms
- AI recommendation generation
- Insights calculation and analysis

#### ContentFilterEngine  
- Multi-dimensional content filtering
- Real-time filter application
- React-inspired filter state management

#### SelectionManager
- React-style selection state management
- Selection validation and limits
- Event-driven selection updates

## Integration Examples

### With Existing Content Systems

```javascript
// Load content from existing API
const content = await fetch('/api/content').then(r => r.json());

// Initialize with external content
campaignSelector.addContent(content.items);

// Sync selections with external system
campaignSelector.on('selectionChanged', async (event) => {
  await fetch('/api/campaigns/selections', {
    method: 'POST',
    body: JSON.stringify(event.selections)
  });
});
```

### With Notification Systems

```javascript
// Integrate with existing notification system
campaignSelector.on('selectionLimitReached', () => {
  NotificationSystem.show('Maximum selections reached', 'warning');
});
```

## Styling

The application uses a comprehensive CSS-in-JS architecture with:

- CSS custom properties for theming
- Responsive design patterns
- Modern flexbox/grid layouts
- Smooth transitions and animations
- Mobile-first responsive approach

### Custom Styling

```css
:root {
  --campaign-primary: #your-brand-color;
  --campaign-border-radius: 12px;
  --campaign-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}
```

## React Pattern Integration

This application leverages excellent React patterns extracted from the legacy folder:

- **Event-driven architecture** inspired by React hooks
- **Unidirectional data flow** for predictable state management  
- **Component composition** patterns for modularity
- **Declarative rendering** approach

## Performance

- **Lazy loading** for large content libraries
- **Virtual scrolling** for performance with 1000+ items
- **Debounced filtering** for smooth user experience
- **Optimized re-rendering** with selective DOM updates

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Follow atomic design principles
2. Maintain separation of concerns (services/templates/controllers/styles)
3. Use React-inspired patterns for state management
4. Include comprehensive JSDoc documentation
5. Add unit tests for new features

## License

MIT License - See main project LICENSE file
