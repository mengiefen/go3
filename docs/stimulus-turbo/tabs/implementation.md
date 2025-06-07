# Implementation Guide

This guide provides step-by-step instructions for implementing the VSCode-style tabbed interface in your Rails application.

## 📋 Prerequisites

- Rails 7+ with Hotwire (Turbo + Stimulus)
- ViewComponent (optional but recommended)
- Tailwind CSS (for provided styling)

## 🚀 Step 1: Create the VSCode Tabs Controller

Create `app/javascript/controllers/vscode_tabs_controller.js`:

```javascript
import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ['tabBar', 'contentAreas', 'tab', 'content'];

  connect() {
    console.log('VSCode Tabs Controller connected');
    this.openTabs = new Map(); // Store open tabs
    this.restoreTabsFromStorage();
  }

  // Generate unique tab ID to support multiple instances
  generateUniqueTabId(contentType, contentId) {
    return `tab-${contentType}-${contentId}-${Date.now()}`;
  }

  // Add new tab to the interface
  addTab(tabId, tabName) {
    // Don't add if tab already exists
    if (this.openTabs.has(tabId)) {
      return;
    }

    // Create the tab content container first
    this.createTabContentContainer(tabId);

    // Hide welcome message when first tab is added
    if (this.openTabs.size === 0) {
      this.hideWelcomeMessage();
    }

    // Create tab element
    const tabElement = document.createElement('div');
    tabElement.className = 'tab-item flex items-center bg-slate-200 border-r border-slate-300 px-4 py-3 cursor-pointer hover:bg-slate-100 transition-all duration-200 group';
    tabElement.dataset.tabId = tabId;
    tabElement.dataset.vscodeTabsTarget = 'tab';
    tabElement.dataset.action = 'click->vscode-tabs#focusTab';

    tabElement.innerHTML = `
      <div class="flex items-center">
        <div class="w-3 h-3 bg-blue-400 rounded-full mr-3 opacity-60"></div>
        <span class="text-sm text-slate-700 font-medium mr-3 max-w-32 truncate">${tabName}</span>
        <button class="opacity-0 group-hover:opacity-100 ml-1 p-1 rounded hover:bg-slate-300 transition-all duration-200" 
                data-action="click->vscode-tabs#closeTab" 
                data-tab-id="${tabId}">
          <svg class="w-3 h-3 text-slate-500 hover:text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    `;

    // Add to tab bar
    this.tabBarTarget.appendChild(tabElement);

    // Store tab info
    this.openTabs.set(tabId, {
      element: tabElement,
      name: tabName,
      active: false,
    });

    // Save to localStorage
    this.saveTabsToStorage();
  }

  // Create individual tab content container
  createTabContentContainer(tabId) {
    console.log('Creating tab content container for:', tabId);
    
    // Check if container already exists
    const existing = document.getElementById(tabId);
    if (existing) {
      console.log('Container already exists for:', tabId);
      return existing;
    }
    
    const contentContainer = document.createElement('div');
    contentContainer.id = tabId;
    contentContainer.className = 'tab-content';
    contentContainer.dataset.vscodeTabsTarget = 'content';
    contentContainer.dataset.tabId = tabId;
    
    // Try different ways to find the content areas target
    let targetElement = null;
    
    try {
      targetElement = this.contentAreasTarget;
      console.log('Found contentAreasTarget via Stimulus:', targetElement);
    } catch (error) {
      console.log('contentAreasTarget not available via Stimulus, trying fallback');
    }
    
    if (!targetElement) {
      targetElement = document.getElementById('tab-content-areas');
      console.log('Found target via getElementById:', targetElement);
    }
    
    if (!targetElement) {
      targetElement = document.querySelector('[data-vscode-tabs-target="contentAreas"]');
      console.log('Found target via querySelector:', targetElement);
    }
    
    if (targetElement) {
      targetElement.appendChild(contentContainer);
      console.log('Successfully added container to DOM');
    } else {
      console.error('No target element found for content areas!');
    }
    
    return contentContainer;
  }

  // Focus/activate a tab
  focusTab(event) {
    let tabId;

    if (typeof event === 'string') {
      tabId = event;
    } else {
      event.stopPropagation();
      tabId = event.currentTarget.dataset.tabId;
    }

    this.setActiveTab(tabId);
  }

  // Set active tab and manage visibility
  setActiveTab(tabId) {
    console.log('Setting active tab:', tabId);

    // Update tab header active states
    this.tabBarTarget.querySelectorAll('.tab-item').forEach((tab) => {
      if (tab.dataset.tabId === tabId) {
        tab.classList.remove('bg-slate-200');
        tab.classList.add('bg-white', 'border-b-2', 'border-blue-500', 'shadow-sm');
        const closeBtn = tab.querySelector('button');
        if (closeBtn) closeBtn.classList.remove('opacity-0');
      } else {
        tab.classList.remove('bg-white', 'border-b-2', 'border-blue-500', 'shadow-sm');
        tab.classList.add('bg-slate-200');
      }
    });

    // Show corresponding content
    let contentAreasElement;
    try {
      contentAreasElement = this.contentAreasTarget;
    } catch (error) {
      contentAreasElement = document.getElementById('tab-content-areas');
    }
    
    const allContent = contentAreasElement ? contentAreasElement.querySelectorAll('.tab-content') : [];
    console.log('Found content elements:', allContent.length);

    allContent.forEach((content) => {
      if (content.id === tabId) {
        console.log('Showing content for:', tabId);
        content.classList.add('active');
      } else {
        content.classList.remove('active');
      }
    });

    // Update tab state
    this.openTabs.forEach((tab, id) => {
      tab.active = id === tabId;
    });

    // Save to localStorage
    this.saveTabsToStorage();
  }

  // Close tab
  closeTab(event) {
    event.stopPropagation();
    const tabId = event.currentTarget.dataset.tabId;

    // Remove tab element
    const tabElement = this.tabBarTarget.querySelector(`[data-tab-id="${tabId}"]`);
    if (tabElement) {
      tabElement.remove();
    }

    // Remove content container
    const contentElement = document.getElementById(tabId);
    if (contentElement) {
      contentElement.remove();
    }

    // Remove from open tabs
    const wasActive = this.openTabs.get(tabId)?.active;
    this.openTabs.delete(tabId);

    // Save to localStorage
    this.saveTabsToStorage();

    // If closed tab was active, focus another tab
    if (wasActive && this.openTabs.size > 0) {
      const firstTabId = Array.from(this.openTabs.keys())[0];
      this.focusTab(firstTabId);
    }

    // If no tabs left, show welcome message
    if (this.openTabs.size === 0) {
      this.showWelcomeMessage();
    }
  }

  // Hide/show welcome message
  hideWelcomeMessage() {
    const noTabsIndicator = this.tabBarTarget.querySelector('.flex.items-center.h-full');
    if (noTabsIndicator) noTabsIndicator.classList.add('hidden');
    
    const welcomeMessage = document.getElementById('welcome-message');
    if (welcomeMessage) welcomeMessage.classList.add('hidden');
  }

  showWelcomeMessage() {
    const noTabsIndicator = this.tabBarTarget.querySelector('.flex.items-center.h-full');
    if (noTabsIndicator) noTabsIndicator.classList.remove('hidden');
    
    const welcomeMessage = document.getElementById('welcome-message');
    if (welcomeMessage) welcomeMessage.classList.remove('hidden');
  }

  // Save tabs to localStorage
  saveTabsToStorage() {
    const tabsData = Array.from(this.openTabs.entries()).map(([tabId, tabInfo]) => ({
      tabId,
      name: tabInfo.name,
      active: tabInfo.active,
    }));
    localStorage.setItem('openTabs', JSON.stringify(tabsData));
  }

  // Restore tabs from localStorage
  restoreTabsFromStorage() {
    const savedTabs = localStorage.getItem('openTabs');
    if (savedTabs) {
      try {
        const tabsData = JSON.parse(savedTabs);
        let activeTabId = null;

        tabsData.forEach((tabData) => {
          if (this.canRestoreTab(tabData.tabId)) {
            this.addTab(tabData.tabId, tabData.name);
            this.loadRestoredTabContent(tabData.tabId);
            if (tabData.active) {
              activeTabId = tabData.tabId;
            }
          }
        });

        if (activeTabId && this.openTabs.has(activeTabId)) {
          setTimeout(() => {
            this.setActiveTab(activeTabId);
          }, 100);
        }
      } catch (error) {
        console.error('Error restoring tabs from localStorage:', error);
        localStorage.removeItem('openTabs');
      }
    }
  }

  // Check if we can restore a tab
  canRestoreTab(tabId) {
    return tabId.startsWith('tab-tasks-');
  }

  // Load content for restored tab
  loadRestoredTabContent(tabId) {
    if (tabId.startsWith('tab-tasks-')) {
      const parts = tabId.split('-');
      if (parts.length >= 4) {
        const filterType = parts[2];
        const filterValue = parts[3];
        const tabInfo = this.openTabs.get(tabId);
        const tabName = tabInfo ? tabInfo.name : `${filterType} ${filterValue}`;
        const url = `/tasks/content/${filterType}/${filterValue}?content_name=${encodeURIComponent(tabName)}&frame_id=frame-${tabId}`;

        const contentContainer = document.getElementById(tabId);
        if (contentContainer) {
          const turboFrame = document.createElement('turbo-frame');
          turboFrame.id = `frame-${tabId}`;
          turboFrame.src = url;
          contentContainer.appendChild(turboFrame);
        }
      }
    }
  }
}
```

## 🚀 Step 2: Create the Secondary Sidebar Controller

Create `app/javascript/controllers/secondary_sidebar_controller.js`:

```javascript
import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ['chevron', 'categoryItems'];

  toggleCategory(event) {
    const categoryName = event.currentTarget.dataset.categoryName;
    const chevron = event.currentTarget.querySelector('[data-secondary-sidebar-target="chevron"]');
    const items = event.currentTarget.nextElementSibling;

    if (items.classList.contains('hidden')) {
      items.classList.remove('hidden');
      chevron.classList.add('rotate-90');
    } else {
      items.classList.add('hidden');
      chevron.classList.remove('rotate-90');
    }
  }

  openTab(event) {
    const contentType = event.currentTarget.dataset.contentType;
    const contentId = event.currentTarget.dataset.contentId;
    const contentName = event.currentTarget.dataset.contentName;

    // Always create new tab (allow multiple instances)
    console.log('Creating new tab for:', contentType, contentId, contentName);
    this.createNewTab(contentType, contentId, contentName);
  }

  createNewTab(contentType, contentId, contentName) {
    let url, tabId;

    // Get tabs controller reference
    const tabsController = this.application.getControllerForElementAndIdentifier(
      document.querySelector('[data-controller="vscode-tabs"]'),
      'vscode-tabs'
    );

    // Generate unique tab ID to support multiple instances
    if (contentType.startsWith('task_')) {
      const filterType = contentType.replace('task_', '');
      tabId = tabsController ? tabsController.generateUniqueTabId(`tasks-${filterType}`, contentId) : `tab-tasks-${filterType}-${contentId}-${Date.now()}`;
      url = `/tasks/content/${filterType}/${contentId}?content_name=${encodeURIComponent(contentName)}&frame_id=frame-${tabId}`;
    } else {
      tabId = tabsController ? tabsController.generateUniqueTabId(contentType, contentId) : `tab-${contentType}-${contentId}-${Date.now()}`;
      url = `/tab-demo/content/${contentType}/${contentId}?content_name=${encodeURIComponent(contentName)}&frame_id=frame-${tabId}`;
    }

    // Add tab to tab bar
    if (tabsController) {
      tabsController.addTab(tabId, contentName || `${contentType} ${contentId}`);
      console.log('Tab added with ID:', tabId);
    }

    // Small delay to ensure DOM is updated
    setTimeout(() => {
      // Load content via Turbo Frame
      const contentContainer = document.getElementById(tabId);
      console.log('Looking for container:', tabId, 'Found:', contentContainer);
      if (contentContainer) {
        // Create turbo frame for this tab
        const turboFrame = document.createElement('turbo-frame');
        turboFrame.id = `frame-${tabId}`;
        turboFrame.src = url;
        turboFrame.dataset.loadedTabId = tabId;
        
        // Listen for frame load event
        turboFrame.addEventListener('turbo:frame-load', (event) => {
          console.log('Frame loaded for tab:', tabId);
          if (tabsController) {
            tabsController.setActiveTab(tabId);
          }
        });
        
        // Add frame to content container
        contentContainer.appendChild(turboFrame);
      } else {
        console.error('Content container not found for tab:', tabId);
      }
    }, 10);
  }
}
```

## 🚀 Step 3: Add CSS Styles

Add to `app/assets/stylesheets/app.css`:

```css
/* Tab content visibility management */
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
  display: block;
}

/* Tab item styles */
.tab-item {
  min-width: 120px;
  max-width: 200px;
}

.tab-item:hover .opacity-0 {
  opacity: 100;
}

/* Responsive tab design */
@media (max-width: 768px) {
  .tab-item {
    min-width: 100px;
    font-size: 0.875rem;
  }
  
  .tab-item span {
    max-width: 80px;
  }
}
```

## 🚀 Step 4: Create the HTML Layout

Create your main page layout (e.g., `app/views/tasks/index.html.erb`):

```erb
<div class="h-screen flex bg-slate-50" data-controller="vscode-tabs">
  <!-- Primary Icon Sidebar -->
  <%= render(IconSidebarComponent.new(active_item: 'tasks')) %>
  
  <!-- Secondary Sidebar -->
  <%= turbo_frame_tag "secondary-sidebar" do %>
    <%= render(SecondarySidebarComponent.new(sidebar_type: 'tasks')) %>
  <% end %>
  
  <!-- Main Content Area -->
  <div class="flex-1 flex flex-col bg-white shadow-xl">
    <!-- Tab Bar -->
    <div class="h-12 bg-gradient-to-r from-slate-100 to-slate-200 border-b border-slate-300 flex items-center overflow-x-auto shadow-sm" 
         data-vscode-tabs-target="tabBar">
      <!-- Tabs will be added here dynamically -->
      <div class="flex items-center h-full px-4 text-slate-500 text-sm font-medium">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        No tabs open
      </div>
    </div>
    
    <!-- Content Areas Container -->
    <div class="flex-1 overflow-auto relative" 
         id="tab-content-areas"
         data-vscode-tabs-target="contentAreas">
      
      <!-- Welcome message when no tabs are open -->
      <div id="welcome-message" class="absolute inset-0 flex items-center justify-center">
        <div class="text-center max-w-md">
          <div class="mx-auto w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
            </svg>
          </div>
          <h2 class="text-3xl font-bold text-slate-800 mb-4">Task Management</h2>
          <p class="text-slate-600 text-lg leading-relaxed">
            Select a task category from the sidebar to open a new tab and start managing your tasks.
          </p>
        </div>
      </div>
      
      <!-- Individual tab content containers will be dynamically added here -->
    </div>
  </div>
</div>
```

## 🚀 Step 5: Create the Secondary Sidebar Component

Create `app/components/secondary_sidebar_component.rb`:

```ruby
class SecondarySidebarComponent < ViewComponent::Base
  def initialize(sidebar_type: 'organizations')
    @sidebar_type = sidebar_type
  end

  private

  attr_reader :sidebar_type

  def sidebar_content
    case sidebar_type
    when 'tasks'
      {
        title: 'TASKS',
        categories: [
          {
            name: 'Categories',
            collapsed: false,
            items: [
              { id: 'task-all', name: 'All Tasks', type: 'task_category', filter: 'all' },
              { id: 'task-general', name: 'General', type: 'task_category', filter: 'general' },
              { id: 'task-development', name: 'Development', type: 'task_category', filter: 'development' },
              { id: 'task-design', name: 'Design', type: 'task_category', filter: 'design' },
              { id: 'task-marketing', name: 'Marketing', type: 'task_category', filter: 'marketing' }
            ]
          },
          {
            name: 'Status',
            collapsed: true,
            items: [
              { id: 'task-pending', name: 'Pending', type: 'task_status', filter: 'pending' },
              { id: 'task-in_progress', name: 'In Progress', type: 'task_status', filter: 'in_progress' },
              { id: 'task-completed', name: 'Completed', type: 'task_status', filter: 'completed' }
            ]
          }
        ]
      }
    else
      # Other sidebar types...
    end
  end
end
```

Create the component template `app/components/secondary_sidebar_component.html.erb`:

```erb
<div class="w-72 h-full bg-gradient-to-b from-slate-800 via-slate-850 to-slate-800 text-white flex flex-col shadow-2xl border-r border-slate-700" 
     data-controller="secondary-sidebar">
  
  <!-- Header -->
  <div class="p-6 border-b border-slate-700">
    <h2 class="text-lg font-bold text-white tracking-wide"><%= sidebar_content[:title] %></h2>
  </div>
  
  <!-- Categories -->
  <div class="flex-1 overflow-y-auto">
    <% sidebar_content[:categories].each do |category| %>
      <div class="mb-6">
        <!-- Category Header -->
        <div class="px-4 py-3 cursor-pointer hover:bg-slate-700/50 transition-colors duration-200"
             data-action="click->secondary-sidebar#toggleCategory"
             data-category-name="<%= category[:name] %>">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              <%= category[:name] %>
            </span>
            <svg class="w-4 h-4 text-slate-400 transition-transform duration-200 <%= 'rotate-90' unless category[:collapsed] %>" 
                 data-secondary-sidebar-target="chevron"
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
        </div>
        
        <!-- Category Items -->
        <div class="<%= 'hidden' if category[:collapsed] %>">
          <% category[:items].each do |item| %>
            <div class="group mx-4 mb-1 px-4 py-2.5 cursor-pointer rounded-lg transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-blue-500/10 hover:shadow-md"
                 data-action="click->secondary-sidebar#openTab"
                 data-content-type="<%= item[:type] %>"
                 data-content-id="<%= item[:filter] || item[:id] %>"
                 data-content-name="<%= item[:name] %>">
              <div class="flex items-center">
                <!-- Icon based on type -->
                <% case item[:type] %>
                <% when 'task_category' %>
                  <svg class="w-3.5 h-3.5 text-blue-400 group-hover:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                <% when 'task_status' %>
                  <svg class="w-3.5 h-3.5 text-green-400 group-hover:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                <% end %>
                
                <span class="ml-3 text-sm text-slate-200 group-hover:text-white font-medium">
                  <%= item[:name] %>
                </span>
              </div>
            </div>
          <% end %>
        </div>
      </div>
    <% end %>
  </div>
</div>
```

## 🚀 Step 6: Create the Controller Actions

Update your controller (e.g., `app/controllers/tasks_controller.rb`):

```ruby
class TasksController < ApplicationController
  def index
    # Main page with tab interface
  end

  def tab_content
    @filter_type = params[:filter_type] # 'category', 'status', 'priority'
    @filter_value = params[:filter_value]
    @content_name = params[:content_name]
    @frame_id = params[:frame_id]
    
    # Filter tasks based on type
    @tasks = current_tasks.includes(:user)
    case @filter_type
    when 'category'
      @tasks = @filter_value == 'all' ? @tasks : @tasks.by_category(@filter_value)
    when 'status'
      @tasks = @tasks.by_status(@filter_value)
    when 'priority'
      @tasks = @tasks.by_priority(@filter_value)
    end
    @tasks = @tasks.order(created_at: :desc)

    respond_to do |format|
      format.html { render 'tab_content' }
    end
  end

  private

  def current_tasks
    # Your task filtering logic here
    Task.all
  end
end
```

## 🚀 Step 7: Create the Tab Content View

Create `app/views/tasks/tab_content.html.erb`:

```erb
<turbo-frame id="<%= @frame_id %>">
  <%= render partial: 'task_tab_content', locals: {
    tasks: @tasks,
    content_name: @content_name,
    filter_type: @filter_type,
    filter_value: @filter_value
  } %>
</turbo-frame>
```

Create the partial `app/views/tasks/_task_tab_content.html.erb`:

```erb
<div class="w-full h-full bg-white">
  <div class="h-full overflow-y-auto">
    <div class="p-6">
      <!-- Header with task info -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-slate-800 mb-2"><%= content_name %></h1>
          <p class="text-slate-600"><%= pluralize(tasks.count, 'task') %> found</p>
        </div>
        <div class="flex space-x-3">
          <%= link_to new_task_path, 
              class: "inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700",
              data: { turbo_frame: "task_form_modal" } do %>
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            New Task
          <% end %>
        </div>
      </div>
      
      <!-- Tasks Grid -->
      <% if tasks.any? %>
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <% tasks.each do |task| %>
            <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-4 hover:shadow-md transition-shadow">
              <!-- Task content here -->
              <h3 class="text-lg font-medium text-slate-900">
                <%= link_to task.title, task_path(task), class: "hover:text-blue-600" %>
              </h3>
              <p class="mt-1 text-sm text-slate-600"><%= truncate(task.description, length: 100) %></p>
              <!-- Add more task details as needed -->
            </div>
          <% end %>
        </div>
      <% else %>
        <div class="text-center py-12">
          <h3 class="text-sm font-medium text-slate-900">No tasks found</h3>
          <p class="mt-1 text-sm text-slate-500">No tasks match the current filter criteria.</p>
        </div>
      <% end %>
    </div>
  </div>
</div>
```

## 🚀 Step 8: Add Routes

Update `config/routes.rb`:

```ruby
Rails.application.routes.draw do
  resources :tasks do
    collection do
      get "sidebar/:sidebar_type", to: "tasks#sidebar_content", as: :sidebar
      get "content/:filter_type/:filter_value", to: "tasks#tab_content", as: :tab_content
    end
  end
  
  # Other routes...
end
```

## ✅ Step 9: Test the Implementation

1. Navigate to `/tasks`
2. Click on sidebar items (Categories, Status filters)
3. Verify that:
   - Tabs are created with unique IDs
   - Content loads via Turbo Frames
   - Multiple instances of same content work
   - Tab state persists across page reloads
   - Tabs can be closed properly

## 🔧 Customization Options

### Custom Tab Icons
```javascript
// In createTabElement method, customize the icon:
const iconHtml = this.getIconForContentType(contentType);
tabElement.innerHTML = `
  <div class="flex items-center">
    ${iconHtml}
    <span class="text-sm text-slate-700 font-medium mr-3">${tabName}</span>
    <!-- Close button -->
  </div>
`;
```

### Tab Limits
```javascript
// Add tab limit in addTab method:
static values = { maxTabs: { type: Number, default: 10 } }

addTab(tabId, tabName) {
  if (this.openTabs.size >= this.maxTabsValue) {
    this.closeOldestTab();
  }
  // Continue with tab creation...
}
```

### Custom Events
```javascript
// Dispatch custom events for integration:
this.dispatch('tab:created', { detail: { tabId, contentType } });
this.dispatch('tab:activated', { detail: { tabId } });
this.dispatch('tab:closed', { detail: { tabId } });
```

## 🎯 Next Steps

1. Add drag-and-drop tab reordering
2. Implement tab context menus
3. Add keyboard shortcuts
4. Create tab groups/workspaces
5. Add tab preview on hover

This implementation provides a solid foundation for a scalable, VSCode-style tabbed interface that can be extended based on your specific needs.