# VSCode-Style Tabbed Interface with Stimulus & Turbo

This documentation covers the complete implementation of a scalable, VSCode-style tabbed interface using Stimulus controllers and Turbo Frames. The system supports multiple instances of the same content, proper isolation, and persistent state management.

## 📁 Documentation Structure

- **[README.md](README.md)** - This overview and quick start guide
- **[architecture.md](architecture.md)** - Detailed architectural decisions and design patterns
- **[implementation.md](implementation.md)** - Complete implementation guide with code examples
- **[api-reference.md](api-reference.md)** - Controller methods, targets, and configuration options
- **[troubleshooting.md](troubleshooting.md)** - Common issues and debugging guide
- **[examples.md](examples.md)** - Real-world usage examples and patterns

## 🚀 Quick Start

### 1. Basic Setup

Add the VSCode tabs controller to your page:

```erb
<div class="h-screen flex bg-slate-50" data-controller="vscode-tabs">
  <!-- Tab Bar -->
  <div data-vscode-tabs-target="tabBar"></div>
  
  <!-- Content Areas -->
  <div id="tab-content-areas" data-vscode-tabs-target="contentAreas">
    <!-- Individual tab containers will be added here -->
  </div>
</div>
```

### 2. Create Tabs Programmatically

```javascript
// Get the tabs controller
const tabsController = this.application.getControllerForElementAndIdentifier(
  document.querySelector('[data-controller="vscode-tabs"]'),
  'vscode-tabs'
);

// Generate unique tab ID
const tabId = tabsController.generateUniqueTabId('content-type', 'content-id');

// Add new tab
tabsController.addTab(tabId, 'Tab Name');

// Load content via Turbo Frame
const contentContainer = document.getElementById(tabId);
const turboFrame = document.createElement('turbo-frame');
turboFrame.src = '/your/content/url';
contentContainer.appendChild(turboFrame);
```

### 3. Server-Side Response

```erb
<!-- app/views/your_controller/content.html.erb -->
<turbo-frame id="<%= params[:frame_id] %>">
  <!-- Your content here -->
  <div class="p-6">
    <h1>Content Title</h1>
    <p>Content body...</p>
  </div>
</turbo-frame>
```

## ✨ Key Features

- **Multiple Instances**: Open multiple tabs of the same content type
- **Unique Tab IDs**: Timestamp-based unique identifiers prevent conflicts
- **Turbo Frame Integration**: Seamless content loading without page refreshes
- **Persistent State**: Tab state survives page reloads via localStorage
- **Event-Driven**: Proper event handling eliminates race conditions
- **Isolated Containers**: Each tab has its own DOM container
- **Responsive Design**: Works on desktop and mobile devices

## 🏗️ Architecture Overview

The system consists of three main components:

1. **VSCode Tabs Controller** (`vscode_tabs_controller.js`)
   - Manages tab creation, activation, and removal
   - Handles unique ID generation
   - Manages localStorage persistence

2. **Secondary Sidebar Controller** (`secondary_sidebar_controller.js`) 
   - Triggers tab creation from sidebar interactions
   - Handles content type routing
   - Manages Turbo Frame loading

3. **Server-Side Integration**
   - Controllers that respond with Turbo Frame content
   - Proper frame ID matching for seamless loading

## 📊 Benefits Over Traditional Approaches

| Feature | Traditional Tabs | VSCode-Style Tabs |
|---------|------------------|-------------------|
| Multiple Instances | ❌ Blocked by deduplication | ✅ Unlimited instances |
| Content Isolation | ❌ Single container overlap | ✅ Per-tab containers |
| Race Conditions | ❌ setTimeout hacks | ✅ Event-driven loading |
| Scalability | ❌ Breaks with complexity | ✅ Scales infinitely |
| State Persistence | ❌ Lost on reload | ✅ Survives reloads |
| Performance | ❌ DOM pollution | ✅ Clean separation |

## 🔗 Integration Examples

### Tasks Management
```erb
<!-- Sidebar triggers -->
<div data-action="click->secondary-sidebar#openTab"
     data-content-type="task_category"
     data-content-id="development"
     data-content-name="Development Tasks">
  Development
</div>
```

### Dynamic Content Loading
```ruby
# app/controllers/tasks_controller.rb
def tab_content
  @tasks = current_tasks.by_category(params[:filter_value])
  @frame_id = params[:frame_id]
  
  respond_to do |format|
    format.html { render 'tab_content' }
  end
end
```

## 🎯 Use Cases

- **Project Management**: Multiple project views simultaneously
- **Code Editors**: Multiple file tabs like VSCode
- **Data Analysis**: Compare multiple datasets
- **Admin Dashboards**: Monitor multiple metrics
- **E-commerce**: Compare multiple products
- **Content Management**: Edit multiple articles

## 🔧 Configuration

The system is highly configurable through Stimulus values and CSS classes:

```javascript
// Configure tab behavior
static values = {
  maxTabs: { type: Number, default: 10 },
  persistState: { type: Boolean, default: true },
  autoClose: { type: Boolean, default: false }
}
```

## 📝 Next Steps

1. Read the [Architecture Guide](architecture.md) for design decisions
2. Follow the [Implementation Guide](implementation.md) for step-by-step setup
3. Check [Examples](examples.md) for real-world patterns
4. Use [API Reference](api-reference.md) for detailed method documentation

## 🤝 Contributing

When extending this system:

1. Maintain the unique ID generation pattern
2. Always use event-driven content loading
3. Ensure proper Turbo Frame structure
4. Add comprehensive tests for new features
5. Update documentation for any API changes

---

*This documentation covers the complete VSCode-style tabbed interface implementation. For questions or issues, refer to the troubleshooting guide or create an issue.*