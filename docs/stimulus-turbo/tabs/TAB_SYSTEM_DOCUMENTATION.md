# Tab System Component Documentation

A modern, enterprise-ready tab system component built with ViewComponents and Stimulus.js for Rails applications.

## Features

- 🎨 **4 Built-in Themes**: Enterprise, VSCode, Chrome, and Minimal
- 📱 **Responsive Design**: Works seamlessly across desktop and mobile
- 🔄 **Tab Persistence**: Automatically saves and restores tabs via URL and localStorage
- 🎯 **Drag & Drop**: Reorder tabs with smooth animations
- 🎛️ **Rich Actions Menu**: Close active, close all, close others, close to right
- ⚡ **Turbo Integration**: Dynamic content loading with Turbo Frames
- 🌙 **Dark Mode**: Built-in dark mode support
- ♿ **Accessible**: ARIA compliant with keyboard navigation
- 📦 **No Dependencies**: Pure Stimulus.js, no external libraries
- 🔧 **Highly Configurable**: Extensive customization options

## Quick Start

### Basic Usage

```erb
<%= render TabSystem::Component.new(
  theme: :enterprise,
  show_icons: false,
  show_close_buttons: true,
  allow_reorder: true,
  show_actions_menu: true,
  controller_name: "tab-system"
) %>
```

### Add Tabs Programmatically

```javascript
// Get the tab system controller
const tabSystemElement = document.querySelector('[data-controller*="tab-system"]');
const tabSystemController = application.getControllerForElementAndIdentifier(
  tabSystemElement, 
  'tab-system'
);

// Add a new tab
tabSystemController.addTab(
  'tab-users-123',           // Unique tab ID
  'User Management',         // Tab title
  '<svg>...</svg>'          // Optional icon (HTML string)
);
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `theme` | Symbol | `:enterprise` | Visual theme (`vscode`, `chrome`, `minimal`, `enterprise`) |
| `show_icons` | Boolean | `false` | Display icons in tab titles |
| `show_close_buttons` | Boolean | `true` | Show close buttons on tabs |
| `allow_reorder` | Boolean | `true` | Enable drag-and-drop reordering |
| `show_actions_menu` | Boolean | `true` | Display the actions dropdown menu |
| `controller_name` | String | `"tab-system"` | Stimulus controller identifier |
| `classes` | String | `""` | Additional CSS classes |

## Themes

### Enterprise Theme (Recommended)
Modern, space-efficient design with overlapping tabs and subtle animations.

```erb
<%= render TabSystem::Component.new(theme: :enterprise) %>
```

**Features:**
- Overlapping tabs with rounded tops
- Text truncation with ellipsis
- Subtle hover effects and transitions
- Blue accent for active tabs
- Optimized for professional applications

### VSCode Theme
Classic editor-style tabs with rectangular design.

```erb
<%= render TabSystem::Component.new(theme: :vscode) %>
```

### Chrome Theme
Browser-style rounded tabs with smooth curves.

```erb
<%= render TabSystem::Component.new(theme: :chrome) %>
```

### Minimal Theme
Clean, borderless design with bottom underlines.

```erb
<%= render TabSystem::Component.new(theme: :minimal) %>
```

## JavaScript API

### Controller Methods

```javascript
// Add a new tab
tabSystemController.addTab(tabId, title, icon)

// Set active tab
tabSystemController.setActiveTab(tabId)

// Close specific tab
tabSystemController.closeTab(event) // or closeTabById(tabId)

// Close active tab
tabSystemController.closeActiveTab()

// Close all tabs
tabSystemController.closeAllTabs()

// Close other tabs (except active)
tabSystemController.closeOtherTabs()

// Close tabs to the right of active tab
tabSystemController.closeTabsToRight()

// Toggle icon display
tabSystemController.toggleIcons()

// Set tab loading state
tabSystemController.setTabLoading(tabId, isLoading)
```

### Events

The tab system dispatches custom events:

```javascript
// Listen for tab activation
element.addEventListener('tab-system:tab:activated', (event) => {
  console.log('Tab activated:', event.detail.tabId);
});

// Listen for tab closure
element.addEventListener('tab-system:tab:closed', (event) => {
  console.log('Tab closed:', event.detail.tabId);
});
```

## Integration with Navigation Sidebar

The tab system works seamlessly with the navigation sidebar component:

```javascript
// In your navigation sidebar controller
handleItemClick(event) {
  const tabSystemController = this.getTabSystemController();
  
  // Create tab from navigation item
  const tabId = this.generateTabId(contentType, contentId);
  const title = event.currentTarget.dataset.title;
  const icon = this.getIconForContentType(contentType);
  
  tabSystemController.addTab(tabId, title, icon);
}
```

## Content Loading with Turbo Frames

Tabs automatically create Turbo Frame containers for dynamic content loading:

```erb
<!-- Your content template -->
<%= turbo_frame_tag params[:frame_id] do %>
  <div class="p-6">
    <h1><%= @content.title %></h1>
    <p><%= @content.description %></p>
  </div>
<% end %>
```

## Styling Customization

### CSS Custom Properties

```css
:root {
  --tab-system-primary-color: #3b82f6;
  --tab-system-border-color: #e5e7eb;
  --tab-system-hover-color: #f3f4f6;
  --tab-system-active-bg: #ffffff;
}
```

### Custom Theme

Create your own theme by extending the `getTabClasses` method:

```javascript
// In your custom controller extending tab_system_controller
getTabClasses(isActive) {
  if (this.themeValue === 'custom') {
    const themeClasses = 'your-custom-inactive-classes';
    const activeClasses = 'your-custom-active-classes';
    return `${baseClasses} ${isActive ? activeClasses : themeClasses}`;
  }
  return super.getTabClasses(isActive);
}
```

## Accessibility

The tab system includes comprehensive accessibility features:

- **ARIA attributes**: `role`, `aria-selected`, `aria-controls`
- **Keyboard navigation**: Arrow keys, Enter, Space, Escape
- **Screen reader support**: Proper labeling and announcements
- **Focus management**: Logical tab order and focus indicators

### Keyboard Shortcuts

- `Ctrl/Cmd + W`: Close active tab
- `Ctrl/Cmd + Shift + W`: Close all tabs
- `Ctrl/Cmd + Alt + W`: Close other tabs
- `Arrow Keys`: Navigate between tabs
- `Enter/Space`: Activate tab
- `Escape`: Close dropdown menu

## Performance Considerations

- **Lazy Loading**: Content is loaded only when tabs are activated
- **Virtual Scrolling**: Large numbers of tabs are handled efficiently
- **Memory Management**: Closed tabs are properly cleaned up
- **Event Delegation**: Minimal event listeners for optimal performance

## Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **CSS Features**: CSS Grid, Flexbox, Custom Properties
- **JavaScript**: ES6+ features, Web Components support

## Migration from Legacy Tab Systems

### From VSCode Tabs Controller

```ruby
# Old
data: { controller: "vscode-tabs" }

# New
<%= render TabSystem::Component.new(
  theme: :vscode,
  controller_name: "tab-system"
) %>
```

### Method Mapping

| Legacy Method | New Method |
|---------------|------------|
| `addTab()` | `addTab()` |
| `focusTab()` | `setActiveTab()` |
| `closeTab()` | `closeTab()` or `closeTabById()` |
| `closeAllTabs()` | `closeAllTabs()` |

## Troubleshooting

### Common Issues

**Tabs not appearing:**
- Ensure the controller name matches: `data-controller="tab-system"`
- Check that targets are properly defined in the HTML template

**Content not loading:**
- Verify Turbo Frame URLs are correct
- Check Rails routes for content endpoints
- Ensure frame IDs are unique

**Styling issues:**
- Confirm Tailwind CSS is properly loaded
- Check for CSS conflicts with existing styles
- Verify theme-specific classes are applied

### Debug Mode

Enable debug logging:

```javascript
// In browser console
localStorage.setItem('tab-system-debug', 'true');
```

## Examples

### Basic Tab System

```erb
<div class="h-screen flex flex-col">
  <%= render TabSystem::Component.new %>
</div>
```

### With Custom Navigation Integration

```erb
<div class="flex h-screen">
  <!-- Sidebar -->
  <%= render NavigationSidebar::Component.new(
    controller_name: "navigation-sidebar"
  ) %>
  
  <!-- Tab System -->
  <%= render TabSystem::Component.new(
    theme: :enterprise,
    controller_name: "tab-system"
  ) %>
</div>
```

### Minimal Configuration

```erb
<%= render TabSystem::Component.new(
  theme: :minimal,
  show_icons: false,
  show_close_buttons: false,
  show_actions_menu: false
) %>
```

## Contributing

1. Follow the existing code style and patterns
2. Add tests for new features
3. Update documentation for API changes
4. Ensure accessibility compliance
5. Test across supported browsers

## License

This component is part of the GO3 ERP platform and follows the project's licensing terms.