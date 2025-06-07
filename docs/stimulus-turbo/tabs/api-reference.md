# API Reference

Complete reference for the VSCode-style tabbed interface controllers, methods, and configuration options.

## VSCodeTabsController

The main controller that manages tab lifecycle, content containers, and state persistence.

### Targets

| Target | Description | Required |
|--------|-------------|----------|
| `tabBar` | Container for tab headers | ✅ Yes |
| `contentAreas` | Container for tab content areas | ✅ Yes |
| `tab` | Individual tab elements | No (auto-generated) |
| `content` | Individual content containers | No (auto-generated) |

### Values

| Value | Type | Default | Description |
|-------|------|---------|-------------|
| `maxTabs` | Number | 10 | Maximum number of tabs allowed |
| `persistState` | Boolean | true | Whether to save tab state to localStorage |
| `autoClose` | Boolean | false | Auto-close oldest tab when max reached |

### Methods

#### `generateUniqueTabId(contentType, contentId)`

Generates a unique tab identifier that supports multiple instances.

**Parameters:**
- `contentType` (string): Type of content (e.g., 'tasks', 'users')
- `contentId` (string): Unique identifier for the content

**Returns:** `string` - Unique tab ID in format `tab-{contentType}-{contentId}-{timestamp}`

**Example:**
```javascript
const tabId = controller.generateUniqueTabId('tasks-category', 'development');
// Returns: "tab-tasks-category-development-1648722123456"
```

#### `addTab(tabId, tabName)`

Creates a new tab with the specified ID and name.

**Parameters:**
- `tabId` (string): Unique identifier for the tab
- `tabName` (string): Display name for the tab

**Returns:** `void`

**Side Effects:**
- Creates tab element in tab bar
- Creates content container
- Updates internal tab state
- Persists state to localStorage

**Example:**
```javascript
controller.addTab('tab-tasks-dev-123', 'Development Tasks');
```

#### `setActiveTab(tabId)`

Activates the specified tab and shows its content.

**Parameters:**
- `tabId` (string): ID of the tab to activate

**Returns:** `void`

**Side Effects:**
- Updates tab visual states
- Shows/hides content containers
- Updates localStorage
- Dispatches custom events

**Example:**
```javascript
controller.setActiveTab('tab-tasks-dev-123');
```

#### `focusTab(event|tabId)`

Event handler or programmatic method to focus a tab.

**Parameters:**
- `event` (Event): Click event from tab element, OR
- `tabId` (string): ID of tab to focus

**Returns:** `void`

**Example:**
```javascript
// Called via event
<div data-action="click->vscode-tabs#focusTab">

// Called programmatically  
controller.focusTab('tab-tasks-dev-123');
```

#### `closeTab(event)`

Closes a tab and removes it from the interface.

**Parameters:**
- `event` (Event): Click event from close button

**Returns:** `void`

**Side Effects:**
- Removes tab element from DOM
- Removes content container from DOM
- Updates internal state
- Focuses another tab if needed
- Shows welcome message if no tabs remain

**Example:**
```html
<button data-action="click->vscode-tabs#closeTab" data-tab-id="tab-123">×</button>
```

#### `closeAllTabs()`

Closes all open tabs at once.

**Parameters:** None

**Returns:** `void`

**Side Effects:**
- Removes all tab elements from DOM
- Removes all content containers from DOM
- Clears internal state and localStorage
- Shows welcome message
- Hides tab actions

**Example:**
```html
<button data-action="click->vscode-tabs#closeAllTabs">Close All</button>
```

#### `createTabContentContainer(tabId)`

Creates an isolated container for tab content.

**Parameters:**
- `tabId` (string): Unique identifier for the tab

**Returns:** `HTMLElement` - The created container element

**Side Effects:**
- Adds container to contentAreas target
- Sets up proper CSS classes and data attributes

**Example:**
```javascript
const container = controller.createTabContentContainer('tab-123');
// Creates: <div id="tab-123" class="tab-content" data-tab-id="tab-123"></div>
```

#### `hideWelcomeMessage()` / `showWelcomeMessage()`

Controls visibility of the welcome message when no tabs are open.

**Parameters:** None

**Returns:** `void`

**Side Effects:**
- Toggles visibility of welcome message and "no tabs" indicator

#### `saveTabsToStorage()` / `restoreTabsFromStorage()`

Manages tab state persistence across browser sessions.

**Parameters:** None

**Returns:** `void`

**Storage Format:**
```javascript
[
  {
    tabId: "tab-tasks-category-development-1648722123456",
    name: "Development Tasks",
    active: true
  }
]
```

## SecondarySidebarController

Controller for sidebar interactions that trigger tab creation.

### Targets

| Target | Description |
|--------|-------------|
| `chevron` | Collapse/expand icons |
| `categoryItems` | Category item containers |

### Methods

#### `toggleCategory(event)`

Toggles the expanded/collapsed state of a sidebar category.

**Parameters:**
- `event` (Event): Click event on category header

**Returns:** `void`

**Example:**
```html
<div data-action="click->secondary-sidebar#toggleCategory" 
     data-category-name="Tasks">
```

#### `openTab(event)`

Creates a new tab from sidebar item interaction.

**Parameters:**
- `event` (Event): Click event on sidebar item

**Required Data Attributes:**
- `data-content-type`: Type of content to load
- `data-content-id`: Unique identifier for content
- `data-content-name`: Display name for the tab

**Returns:** `void`

**Example:**
```html
<div data-action="click->secondary-sidebar#openTab"
     data-content-type="task_category"
     data-content-id="development"
     data-content-name="Development Tasks">
```

#### `createNewTab(contentType, contentId, contentName)`

Internal method that handles the tab creation process.

**Parameters:**
- `contentType` (string): Type of content
- `contentId` (string): Content identifier
- `contentName` (string): Display name

**Returns:** `void`

**Side Effects:**
- Generates unique tab ID
- Creates tab via VSCodeTabsController
- Sets up Turbo Frame for content loading
- Handles event-driven activation

## Custom Events

The system dispatches custom events for integration with other components.

### Tab Events

#### `tab:created`

Fired when a new tab is successfully created.

**Detail:**
```javascript
{
  tabId: "tab-tasks-category-development-1648722123456",
  contentType: "task_category",
  contentId: "development",
  tabName: "Development Tasks"
}
```

#### `tab:activated`

Fired when a tab becomes active.

**Detail:**
```javascript
{
  tabId: "tab-tasks-category-development-1648722123456",
  previousTabId: "tab-tasks-status-pending-1648722098765"
}
```

#### `tab:closed`

Fired when a tab is closed.

**Detail:**
```javascript
{
  tabId: "tab-tasks-category-development-1648722123456",
  wasActive: true
}
```

#### `tabs:empty`

Fired when the last tab is closed.

**Detail:**
```javascript
{
  timestamp: 1648722123456
}
```

### Usage Example

```javascript
// Listen for tab events
document.addEventListener('tab:created', (event) => {
  console.log('New tab created:', event.detail.tabId);
  // Track analytics, update UI, etc.
});

document.addEventListener('tab:activated', (event) => {
  console.log('Tab activated:', event.detail.tabId);
  // Update breadcrumbs, sync state, etc.
});
```

## CSS Classes

### Tab Content

| Class | Description |
|-------|-------------|
| `.tab-content` | Base styles for tab content containers |
| `.tab-content.active` | Styles for the active tab content |
| `.tab-item` | Base styles for tab headers |
| `.tab-item.active` | Styles for the active tab header |

### States

| Class | Description |
|-------|-------------|
| `.hidden` | Hides elements (welcome message, collapsed categories) |
| `.opacity-0` | Transparent elements (close buttons) |
| `.rotate-90` | Rotated chevron icons |

## Configuration Options

### Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Stimulus | 60+ | 60+ | 10+ | 79+ |
| Turbo Frames | 60+ | 60+ | 10+ | 79+ |
| CSS Grid | 57+ | 52+ | 10+ | 16+ |
| localStorage | All | All | All | All |

### Performance Limits

| Setting | Recommended | Maximum |
|---------|-------------|---------|
| Max Tabs | 10 | 50 |
| Content Size | 1MB | 5MB |
| localStorage | 5MB | 10MB |

### Memory Usage

| Component | Typical | With 10 Tabs | With 50 Tabs |
|-----------|---------|--------------|--------------|
| Controller | 50KB | 100KB | 500KB |
| DOM Nodes | 20 | 200 | 1000 |
| Event Listeners | 5 | 50 | 250 |

## Error Handling

### Common Error Scenarios

#### Missing Target Element

```javascript
// Error: Missing target element "contentAreas" for "vscode-tabs" controller
// Solution: Ensure proper data-vscode-tabs-target="contentAreas" attribute
```

#### Turbo Frame Mismatch

```javascript
// Error: The response did not contain the expected <turbo-frame id="frame-123">
// Solution: Ensure server response includes matching turbo-frame with correct ID
```

#### LocalStorage Quota Exceeded

```javascript
// Error: QuotaExceededError
// Solution: Implement storage cleanup or reduce persisted data
try {
  localStorage.setItem('openTabs', JSON.stringify(tabsData));
} catch (error) {
  if (error.name === 'QuotaExceededError') {
    this.cleanupOldTabs();
    localStorage.setItem('openTabs', JSON.stringify(tabsData));
  }
}
```

## Testing

### Unit Test Examples

```javascript
// Test tab creation
test('creates unique tab IDs', () => {
  const controller = new VSCodeTabsController();
  const id1 = controller.generateUniqueTabId('tasks', 'dev');
  const id2 = controller.generateUniqueTabId('tasks', 'dev');
  
  expect(id1).not.toEqual(id2);
  expect(id1).toMatch(/^tab-tasks-dev-\d+$/);
});

// Test tab activation
test('activates correct tab', () => {
  const controller = new VSCodeTabsController();
  controller.addTab('tab-1', 'Tab 1');
  controller.addTab('tab-2', 'Tab 2');
  
  controller.setActiveTab('tab-2');
  
  expect(controller.openTabs.get('tab-2').active).toBe(true);
  expect(controller.openTabs.get('tab-1').active).toBe(false);
});
```

### Integration Test Examples

```ruby
# RSpec system test
feature 'Tabbed Interface' do
  scenario 'opens multiple task tabs' do
    visit tasks_path
    
    # Open first tab
    within('[data-controller="secondary-sidebar"]') do
      click_on 'Development'
    end
    
    expect(page).to have_css('[data-tab-id^="tab-tasks-category-development"]')
    
    # Open second instance
    within('[data-controller="secondary-sidebar"]') do
      click_on 'Development'  
    end
    
    expect(page).to have_css('[data-vscode-tabs-target="tab"]', count: 2)
  end
end
```

This API reference provides comprehensive documentation for integrating and extending the VSCode-style tabbed interface system.