# Troubleshooting Guide

Common issues and solutions when working with the VSCode-style tabbed interface.

## 🚨 Common Errors

### 1. Missing Target Element Error

**Error Message:**
```
Error: Missing target element "contentAreas" for "vscode-tabs" controller
```

**Causes:**
- Missing `data-vscode-tabs-target="contentAreas"` attribute
- Incorrect target name (case-sensitive)
- Element not present when controller connects

**Solutions:**

✅ **Check HTML Structure:**
```erb
<!-- ❌ Wrong: Missing target attribute -->
<div id="tab-content-areas"></div>

<!-- ✅ Correct: With target attribute -->
<div id="tab-content-areas" data-vscode-tabs-target="contentAreas"></div>
```

✅ **Verify Controller Declaration:**
```erb
<!-- ❌ Wrong: Missing controller -->
<div class="h-screen flex">

<!-- ✅ Correct: With controller -->
<div class="h-screen flex" data-controller="vscode-tabs">
```

✅ **Check Target Names Match:**
```javascript
// In controller
static targets = ['tabBar', 'contentAreas', 'tab', 'content'];

// In HTML - must match exactly (case-sensitive)
data-vscode-tabs-target="contentAreas"  // ✅ Correct
data-vscode-tabs-target="contentareas"  // ❌ Wrong case
data-vscode-tabs-target="content-areas" // ❌ Wrong format
```

### 2. Turbo Frame Not Found Error

**Error Message:**
```
The response (200) did not contain the expected <turbo-frame id="frame-tab-123"> and will be ignored
```

**Causes:**
- Server response missing turbo-frame wrapper
- Frame ID mismatch between request and response
- Incorrect frame ID generation

**Solutions:**

✅ **Server Response Must Include Frame:**
```erb
<!-- app/views/tasks/tab_content.html.erb -->
<turbo-frame id="<%= @frame_id %>">
  <%= render partial: 'task_tab_content', locals: { tasks: @tasks } %>
</turbo-frame>
```

✅ **Controller Must Pass Frame ID:**
```ruby
# app/controllers/tasks_controller.rb
def tab_content
  @frame_id = params[:frame_id]  # ← Must capture this
  # ... rest of action
end
```

✅ **JavaScript Must Send Frame ID:**
```javascript
// Ensure frame ID is passed in URL
const url = `/tasks/content/${filterType}/${contentId}?frame_id=frame-${tabId}`;
turboFrame.src = url;
```

### 3. ActionController::UnknownFormat Error

**Error Message:**
```
ActionController::UnknownFormat in TasksController#tab_content
```

**Causes:**
- Turbo Frame requests sending incorrect Accept headers
- Controller expecting specific format that doesn't match request
- Missing format handling in respond_to block

**Solutions:**

✅ **Force HTML Format in Controller:**
```ruby
# app/controllers/tasks_controller.rb
def tab_content
  @filter_type = params[:filter_type]
  @filter_value = params[:filter_value]
  @content_name = params[:content_name]
  @frame_id = params[:frame_id]
  
  # ... filtering logic ...
  
  # Force HTML format for turbo-frame requests
  render 'tab_content', locals: {
    tasks: @tasks,
    content_name: @content_name,
    filter_type: @filter_type,
    filter_value: @filter_value
  }, formats: [:html]
end
```

✅ **Add Format Hint to Turbo Frame:**
```javascript
// In secondary_sidebar_controller.js
const turboFrame = document.createElement('turbo-frame');
turboFrame.id = `frame-${tabId}`;
turboFrame.src = url;
turboFrame.dataset.turboFrameRequestsFormat = 'html';
```

✅ **Consistent Frame Loading for Restored Tabs:**
```javascript
// In vscode_tabs_controller.js - loadRestoredTabContent method
const contentContainer = document.getElementById(tabId);
if (contentContainer) {
  const turboFrame = document.createElement('turbo-frame');
  turboFrame.id = `frame-${tabId}`;
  turboFrame.src = url;
  turboFrame.dataset.turboFrameRequestsFormat = 'html';
  contentContainer.appendChild(turboFrame);
}
```

### 4. Content Not Loading

**Symptoms:**
- Tabs create but show empty content
- No network requests to load content
- Content container exists but is empty

**Debugging Steps:**

1. **Check Network Tab:**
   - Are requests being made to the content URL?
   - What is the response status and content?

2. **Verify Container Creation:**
```javascript
// Add debugging in createTabContentContainer
console.log('Container created:', contentContainer);
console.log('Parent element:', this.contentAreasTarget);
```

3. **Check Turbo Frame Setup:**
```javascript
// Add debugging in createNewTab
console.log('Turbo frame created:', turboFrame);
console.log('Frame src:', turboFrame.src);
```

**Common Solutions:**

✅ **Verify Routes:**
```ruby
# config/routes.rb
resources :tasks do
  collection do
    get "content/:filter_type/:filter_value", to: "tasks#tab_content"
  end
end
```

✅ **Check Controller Action:**
```ruby
def tab_content
  @tasks = current_tasks.by_category(params[:filter_value])
  
  respond_to do |format|
    format.html { render 'tab_content' }  # Must render view, not redirect
  end
end
```

### 4. Multiple Instances Not Working

**Symptoms:**
- Second click on same sidebar item focuses existing tab instead of creating new one
- Tab IDs are not unique

**Cause:**
- Deduplication logic still active
- Using static tab IDs instead of unique ones

**Solution:**

✅ **Remove Deduplication Logic:**
```javascript
// ❌ Wrong: Checks for existing tabs
if (existingTab) {
  tabsController.setActiveTab(existingTabId);
  return;
}

// ✅ Correct: Always create new tab
console.log('Creating new tab for:', contentType, contentId, contentName);
this.createNewTab(contentType, contentId, contentName);
```

✅ **Use Unique ID Generation:**
```javascript
// ❌ Wrong: Static IDs
const tabId = `tab-${contentType}-${contentId}`;

// ✅ Correct: Unique IDs
const tabId = controller.generateUniqueTabId(contentType, contentId);
```

### 5. Tabs Not Persisting Across Reloads

**Symptoms:**
- Tabs disappear when page is refreshed
- No tabs restored from localStorage

**Debugging:**
1. Check browser localStorage:
   ```javascript
   console.log(localStorage.getItem('openTabs'));
   ```

2. Verify restoration is called:
   ```javascript
   // In connect() method
   connect() {
     console.log('Controller connected, restoring tabs...');
     this.restoreTabsFromStorage();
   }
   ```

**Solutions:**

✅ **Ensure Save is Called:**
```javascript
addTab(tabId, tabName) {
  // ... tab creation logic
  
  // Must save after each change
  this.saveTabsToStorage();
}
```

✅ **Handle Restoration Errors:**
```javascript
restoreTabsFromStorage() {
  const savedTabs = localStorage.getItem('openTabs');
  if (savedTabs) {
    try {
      const tabsData = JSON.parse(savedTabs);
      // ... restoration logic
    } catch (error) {
      console.error('Error restoring tabs:', error);
      localStorage.removeItem('openTabs'); // Clear corrupted data
    }
  }
}
```

## 🔧 Performance Issues

### Slow Tab Creation

**Symptoms:**
- Delay between clicking sidebar item and tab appearing
- Browser freezes during tab creation

**Solutions:**

✅ **Optimize Container Creation:**
```javascript
createTabContentContainer(tabId) {
  // Use document fragments for batch DOM updates
  const fragment = document.createDocumentFragment();
  const container = document.createElement('div');
  container.id = tabId;
  container.className = 'tab-content';
  fragment.appendChild(container);
  
  this.contentAreasTarget.appendChild(fragment);
  return container;
}
```

✅ **Debounce Rapid Clicks:**
```javascript
openTab(event) {
  if (this.isCreatingTab) return;
  this.isCreatingTab = true;
  
  this.createNewTab(contentType, contentId, contentName);
  
  setTimeout(() => {
    this.isCreatingTab = false;
  }, 100);
}
```

### Memory Leaks

**Symptoms:**
- Browser memory usage increases over time
- Performance degrades with many tab operations

**Solutions:**

✅ **Clean Up Event Listeners:**
```javascript
closeTab(event) {
  const tabId = event.currentTarget.dataset.tabId;
  
  // Remove all event listeners
  const contentElement = document.getElementById(tabId);
  if (contentElement) {
    const turboFrame = contentElement.querySelector('turbo-frame');
    if (turboFrame) {
      turboFrame.removeEventListener('turbo:frame-load', this.frameLoadHandler);
    }
    contentElement.remove();
  }
}
```

✅ **Limit Tab Count:**
```javascript
static values = { maxTabs: { type: Number, default: 10 } }

addTab(tabId, tabName) {
  if (this.openTabs.size >= this.maxTabsValue) {
    this.closeOldestTab();
  }
  // ... continue with tab creation
}

closeOldestTab() {
  const oldestTabId = Array.from(this.openTabs.keys())[0];
  this.forceCloseTab(oldestTabId);
}
```

## 🎨 Styling Issues

### Tabs Not Visible

**Symptoms:**
- Tab bar appears empty
- Tabs created but not displayed

**Solutions:**

✅ **Check CSS Classes:**
```css
/* Ensure tab items are visible */
.tab-item {
  display: flex;
  min-width: 120px;
  background-color: #e2e8f0; /* slate-200 */
}

/* Ensure active state is visible */
.tab-item.active {
  background-color: white;
  border-bottom: 2px solid #3b82f6; /* blue-500 */
}
```

✅ **Verify Container Styles:**
```css
/* Tab bar must have proper layout */
[data-vscode-tabs-target="tabBar"] {
  display: flex;
  overflow-x: auto;
  min-height: 48px;
}
```

### Content Not Showing

**Symptoms:**
- Tab content exists in DOM but not visible
- Content appears but in wrong position

**Solutions:**

✅ **Check Content Visibility:**
```css
.tab-content {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: auto;
}

.tab-content.active {
  display: block; /* Must override display: none */
}
```

✅ **Verify Container Layout:**
```css
/* Content areas container must be positioned */
[data-vscode-tabs-target="contentAreas"] {
  position: relative;
  flex: 1;
  overflow: hidden;
}
```

## 🔍 Debugging Tools

### Console Debugging

Add these debugging utilities to your controller:

```javascript
// Add to VSCodeTabsController
debug() {
  console.group('VSCode Tabs Debug Info');
  console.log('Open tabs:', this.openTabs.size);
  console.log('Tabs data:', Array.from(this.openTabs.entries()));
  console.log('DOM containers:', document.querySelectorAll('.tab-content').length);
  console.log('Active tab:', this.getActiveTab()?.id);
  console.groupEnd();
}

getActiveTab() {
  for (const [tabId, tabInfo] of this.openTabs) {
    if (tabInfo.active) return { id: tabId, ...tabInfo };
  }
  return null;
}

// Call debug() in browser console to inspect state
```

### Visual Debugging

Add temporary visual indicators:

```css
/* Temporary debugging styles */
.tab-content {
  border: 2px solid red !important;
}

.tab-content.active {
  border-color: green !important;
}

[data-vscode-tabs-target="contentAreas"] {
  background: yellow !important;
  opacity: 0.5;
}
```

### Network Debugging

Monitor Turbo Frame requests:

```javascript
// Add to secondary_sidebar_controller.js
createNewTab(contentType, contentId, contentName) {
  console.log('Creating tab:', { contentType, contentId, contentName });
  
  // ... existing code ...
  
  turboFrame.addEventListener('turbo:frame-load', (event) => {
    console.log('✅ Frame loaded successfully:', tabId);
  });
  
  turboFrame.addEventListener('turbo:frame-error', (event) => {
    console.error('❌ Frame load error:', tabId, event);
  });
}
```

## 📱 Mobile/Responsive Issues

### Tabs Overflow on Mobile

**Solution:**
```css
@media (max-width: 768px) {
  [data-vscode-tabs-target="tabBar"] {
    overflow-x: auto;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE/Edge */
  }
  
  [data-vscode-tabs-target="tabBar"]::-webkit-scrollbar {
    display: none; /* Chrome/Safari */
  }
  
  .tab-item {
    min-width: 100px;
    font-size: 0.875rem;
    flex-shrink: 0;
  }
}
```

### Touch Interaction Issues

**Solution:**
```css
/* Improve touch targets */
.tab-item {
  min-height: 44px; /* iOS minimum touch target */
  touch-action: manipulation;
}

button[data-action*="closeTab"] {
  min-width: 32px;
  min-height: 32px;
}
```

## 🛠️ Development Tips

### Enable Verbose Logging

```javascript
// Add to controller connect() method
connect() {
  this.debug = true; // Enable debug mode
  if (this.debug) {
    console.log('VSCode Tabs Controller connected with debugging enabled');
  }
  // ... rest of connect logic
}

// Use throughout controller
if (this.debug) console.log('Tab created:', tabId);
```

### Hot Reloading Issues

If changes aren't reflected during development:

```bash
# Clear Rails cache
rails tmp:clear

# Restart Rails server
rails server

# Clear browser cache and localStorage
# Open DevTools > Application > Clear Storage
```

### Testing in Different Browsers

Common browser-specific issues:

| Browser | Issue | Solution |
|---------|-------|----------|
| Safari | localStorage timing | Add `setTimeout` before save |
| Firefox | CSS Grid support | Use flexbox fallback |
| Edge | Event listener cleanup | Use `AbortController` |
| Chrome | Memory usage | Implement tab limits |

This troubleshooting guide should help resolve most common issues with the tabbed interface system.