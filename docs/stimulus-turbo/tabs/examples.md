# Real-World Examples

Practical examples and patterns for implementing the VSCode-style tabbed interface in different scenarios.

## 📊 Task Management System

Complete example of a task management interface with categories, filters, and multiple instances.

### Sidebar Configuration

```ruby
# app/components/secondary_sidebar_component.rb
class SecondarySidebarComponent < ViewComponent::Base
  def initialize(sidebar_type: 'organizations')
    @sidebar_type = sidebar_type
  end

  private

  def task_sidebar_content
    {
      title: 'TASK MANAGEMENT',
      categories: [
        {
          name: 'Categories',
          collapsed: false,
          items: [
            { id: 'all-tasks', name: 'All Tasks', type: 'task_category', filter: 'all', icon: 'list' },
            { id: 'development', name: 'Development', type: 'task_category', filter: 'development', icon: 'code' },
            { id: 'design', name: 'Design', type: 'task_category', filter: 'design', icon: 'palette' },
            { id: 'marketing', name: 'Marketing', type: 'task_category', filter: 'marketing', icon: 'megaphone' },
            { id: 'sales', name: 'Sales', type: 'task_category', filter: 'sales', icon: 'chart' },
            { id: 'support', name: 'Support', type: 'task_category', filter: 'support', icon: 'help' }
          ]
        },
        {
          name: 'Status Filters',
          collapsed: true,
          items: [
            { id: 'pending', name: 'Pending', type: 'task_status', filter: 'pending', icon: 'clock' },
            { id: 'in-progress', name: 'In Progress', type: 'task_status', filter: 'in_progress', icon: 'play' },
            { id: 'review', name: 'Under Review', type: 'task_status', filter: 'review', icon: 'eye' },
            { id: 'completed', name: 'Completed', type: 'task_status', filter: 'completed', icon: 'check' },
            { id: 'cancelled', name: 'Cancelled', type: 'task_status', filter: 'cancelled', icon: 'x' }
          ]
        },
        {
          name: 'Priority Levels',
          collapsed: true,
          items: [
            { id: 'urgent', name: 'Urgent', type: 'task_priority', filter: 'urgent', icon: 'fire' },
            { id: 'high', name: 'High Priority', type: 'task_priority', filter: 'high', icon: 'arrow-up' },
            { id: 'medium', name: 'Medium Priority', type: 'task_priority', filter: 'medium', icon: 'minus' },
            { id: 'low', name: 'Low Priority', type: 'task_priority', filter: 'low', icon: 'arrow-down' }
          ]
        },
        {
          name: 'Team Views',
          collapsed: true,
          items: [
            { id: 'my-tasks', name: 'My Tasks', type: 'task_assignee', filter: 'current_user', icon: 'user' },
            { id: 'team-tasks', name: 'Team Tasks', type: 'task_assignee', filter: 'team', icon: 'users' },
            { id: 'unassigned', name: 'Unassigned', type: 'task_assignee', filter: 'unassigned', icon: 'user-x' }
          ]
        }
      ]
    }
  end
end
```

### Enhanced Controller with Task-Specific Logic

```ruby
# app/controllers/tasks_controller.rb
class TasksController < ApplicationController
  before_action :set_organization
  before_action :set_task, only: [:show, :edit, :update, :destroy, :complete]

  def index
    # Main tabbed interface page
  end

  def tab_content
    @filter_type = params[:filter_type]
    @filter_value = params[:filter_value]
    @content_name = params[:content_name]
    @frame_id = params[:frame_id]
    
    # Build base query
    @tasks = current_organization_tasks.includes(:user, :assignee)
    
    # Apply filters based on type
    case @filter_type
    when 'category'
      @tasks = @filter_value == 'all' ? @tasks : @tasks.where(category: @filter_value)
    when 'status'
      @tasks = @tasks.where(status: @filter_value)
    when 'priority'
      @tasks = @tasks.where(priority: @filter_value)
    when 'assignee'
      @tasks = filter_by_assignee(@tasks, @filter_value)
    when 'date_range'
      @tasks = filter_by_date_range(@tasks, @filter_value)
    end
    
    # Apply sorting and pagination
    @tasks = @tasks.order(created_at: :desc).limit(50)
    
    # Calculate statistics
    @task_stats = calculate_task_statistics(@tasks)
    
    respond_to do |format|
      format.html { render 'tab_content' }
    end
  end

  def sidebar_content
    @sidebar_type = params[:sidebar_type]
    
    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: turbo_stream.update("secondary-sidebar", 
          render_to_string(SecondarySidebarComponent.new(sidebar_type: @sidebar_type))
        )
      end
    end
  end

  private

  def filter_by_assignee(tasks, filter_value)
    case filter_value
    when 'current_user'
      tasks.where(assignee: current_user)
    when 'team'
      team_member_ids = current_user.team_members.pluck(:id)
      tasks.where(assignee_id: team_member_ids)
    when 'unassigned'
      tasks.where(assignee: nil)
    else
      tasks
    end
  end

  def filter_by_date_range(tasks, filter_value)
    case filter_value
    when 'today'
      tasks.where(created_at: Date.current.beginning_of_day..Date.current.end_of_day)
    when 'this_week'
      tasks.where(created_at: Date.current.beginning_of_week..Date.current.end_of_week)
    when 'this_month'
      tasks.where(created_at: Date.current.beginning_of_month..Date.current.end_of_month)
    when 'overdue'
      tasks.where('due_date < ?', Date.current).where.not(status: ['completed', 'cancelled'])
    else
      tasks
    end
  end

  def calculate_task_statistics(tasks)
    {
      total: tasks.count,
      by_status: tasks.group(:status).count,
      by_priority: tasks.group(:priority).count,
      overdue: tasks.where('due_date < ?', Date.current).where.not(status: ['completed', 'cancelled']).count
    }
  end

  def current_organization_tasks
    @organization.tasks
  end

  def set_organization
    @organization = current_user.organizations.first # Adjust based on your logic
  end

  def set_task
    @task = current_organization_tasks.find(params[:id])
  end
end
```

### Enhanced Tab Content with Statistics

```erb
<!-- app/views/tasks/tab_content.html.erb -->
<turbo-frame id="<%= @frame_id %>">
  <div class="w-full h-full bg-white">
    <div class="h-full flex flex-col">
      <!-- Header with statistics -->
      <div class="flex-shrink-0 p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h1 class="text-2xl font-bold text-slate-800 mb-2"><%= @content_name %></h1>
            <div class="flex items-center space-x-6 text-sm text-slate-600">
              <span><%= pluralize(@task_stats[:total], 'task') %> total</span>
              <% if @task_stats[:overdue] > 0 %>
                <span class="text-red-600 font-medium">
                  <%= pluralize(@task_stats[:overdue], 'overdue task') %>
                </span>
              <% end %>
            </div>
          </div>
          
          <!-- Action buttons -->
          <div class="flex space-x-3">
            <%= link_to new_task_path, 
                class: "inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors",
                data: { turbo_frame: "task_form_modal" } do %>
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              New Task
            <% end %>
            
            <button class="inline-flex items-center px-4 py-2 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
              </svg>
              Filter
            </button>
          </div>
        </div>
        
        <!-- Quick stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <% @task_stats[:by_status].each do |status, count| %>
            <div class="bg-white rounded-lg border border-slate-200 p-3">
              <div class="text-lg font-semibold text-slate-900"><%= count %></div>
              <div class="text-sm text-slate-600 capitalize"><%= status.humanize %></div>
            </div>
          <% end %>
        </div>
      </div>
      
      <!-- Scrollable content area -->
      <div class="flex-1 overflow-y-auto">
        <div class="p-6">
          <% if @tasks.any? %>
            <%= render 'task_grid', tasks: @tasks %>
          <% else %>
            <%= render 'empty_state', filter_type: @filter_type, filter_value: @filter_value %>
          <% end %>
        </div>
      </div>
    </div>
  </div>
</turbo-frame>
```

## 📁 File Manager Example

Example of a file browser with folder navigation and file previews.

### File Browser Controller

```javascript
// app/javascript/controllers/file_browser_controller.js
import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ['breadcrumb', 'fileList', 'preview'];
  static values = { currentPath: String };

  connect() {
    this.loadDirectory(this.currentPathValue || '/');
  }

  openFolder(event) {
    const folderPath = event.currentTarget.dataset.path;
    const folderName = event.currentTarget.dataset.name;
    
    // Create tab for folder
    const tabsController = this.getTabsController();
    if (tabsController) {
      const tabId = tabsController.generateUniqueTabId('folder', folderPath);
      tabsController.addTab(tabId, folderName);
      
      // Load folder content
      this.loadFolderInTab(tabId, folderPath);
    }
  }

  openFile(event) {
    const filePath = event.currentTarget.dataset.path;
    const fileName = event.currentTarget.dataset.name;
    const fileType = event.currentTarget.dataset.type;
    
    // Create tab for file
    const tabsController = this.getTabsController();
    if (tabsController) {
      const tabId = tabsController.generateUniqueTabId('file', filePath);
      tabsController.addTab(tabId, fileName);
      
      // Load file content based on type
      this.loadFileInTab(tabId, filePath, fileType);
    }
  }

  loadFolderInTab(tabId, folderPath) {
    const container = document.getElementById(tabId);
    if (container) {
      const frame = document.createElement('turbo-frame');
      frame.id = `frame-${tabId}`;
      frame.src = `/files/browse?path=${encodeURIComponent(folderPath)}&frame_id=frame-${tabId}`;
      
      frame.addEventListener('turbo:frame-load', () => {
        this.getTabsController()?.setActiveTab(tabId);
      });
      
      container.appendChild(frame);
    }
  }

  loadFileInTab(tabId, filePath, fileType) {
    const container = document.getElementById(tabId);
    if (container) {
      const frame = document.createElement('turbo-frame');
      frame.id = `frame-${tabId}`;
      
      // Different URLs based on file type
      if (['image', 'video', 'audio'].includes(fileType)) {
        frame.src = `/files/preview?path=${encodeURIComponent(filePath)}&frame_id=frame-${tabId}`;
      } else if (['text', 'code'].includes(fileType)) {
        frame.src = `/files/edit?path=${encodeURIComponent(filePath)}&frame_id=frame-${tabId}`;
      } else {
        frame.src = `/files/view?path=${encodeURIComponent(filePath)}&frame_id=frame-${tabId}`;
      }
      
      frame.addEventListener('turbo:frame-load', () => {
        this.getTabsController()?.setActiveTab(tabId);
      });
      
      container.appendChild(frame);
    }
  }

  getTabsController() {
    return this.application.getControllerForElementAndIdentifier(
      document.querySelector('[data-controller="vscode-tabs"]'),
      'vscode-tabs'
    );
  }
}
```

### File Manager Layout

```erb
<!-- app/views/files/index.html.erb -->
<div class="h-screen flex bg-slate-50" data-controller="vscode-tabs">
  <!-- Sidebar with file tree -->
  <div class="w-64 bg-slate-800 text-white" data-controller="file-browser">
    <%= render 'file_tree' %>
  </div>
  
  <!-- Main tabbed area -->
  <div class="flex-1 flex flex-col">
    <!-- Tab bar -->
    <div class="h-12 bg-slate-100 border-b flex items-center" data-vscode-tabs-target="tabBar">
      <div class="flex items-center h-full px-4 text-slate-500 text-sm">
        No files open
      </div>
    </div>
    
    <!-- Content areas -->
    <div class="flex-1 relative" id="tab-content-areas" data-vscode-tabs-target="contentAreas">
      <div id="welcome-message" class="absolute inset-0 flex items-center justify-center">
        <div class="text-center">
          <h2 class="text-2xl font-bold text-slate-800 mb-4">File Manager</h2>
          <p class="text-slate-600">Select a file or folder from the sidebar to get started.</p>
        </div>
      </div>
    </div>
  </div>
</div>
```

## 🏪 E-commerce Product Comparison

Example of comparing multiple products in separate tabs.

### Product Comparison Setup

```javascript
// app/javascript/controllers/product_browser_controller.js
export default class extends Controller {
  compareProduct(event) {
    const productId = event.currentTarget.dataset.productId;
    const productName = event.currentTarget.dataset.productName;
    
    const tabsController = this.getTabsController();
    if (tabsController) {
      const tabId = tabsController.generateUniqueTabId('product', productId);
      tabsController.addTab(tabId, `${productName} - Compare`);
      
      // Load product comparison view
      this.loadProductComparison(tabId, productId);
    }
  }

  loadProductComparison(tabId, productId) {
    const container = document.getElementById(tabId);
    if (container) {
      const frame = document.createElement('turbo-frame');
      frame.id = `frame-${tabId}`;
      frame.src = `/products/${productId}/compare?frame_id=frame-${tabId}`;
      
      frame.addEventListener('turbo:frame-load', () => {
        this.getTabsController()?.setActiveTab(tabId);
        this.trackProductView(productId);
      });
      
      container.appendChild(frame);
    }
  }

  trackProductView(productId) {
    // Analytics tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', 'product_view', {
        'product_id': productId,
        'view_type': 'comparison_tab'
      });
    }
  }
}
```

## 📊 Dashboard with Multiple Data Views

Example of a dashboard where users can open multiple data views simultaneously.

### Dashboard Controller

```ruby
# app/controllers/dashboard_controller.rb
class DashboardController < ApplicationController
  def index
    # Main dashboard page
  end

  def widget_content
    @widget_type = params[:widget_type]
    @widget_config = JSON.parse(params[:widget_config] || '{}')
    @frame_id = params[:frame_id]
    @time_range = params[:time_range] || '7d'
    
    @data = case @widget_type
    when 'sales_chart'
      fetch_sales_data(@time_range)
    when 'user_analytics'
      fetch_user_analytics(@time_range)
    when 'revenue_breakdown'
      fetch_revenue_data(@time_range)
    when 'performance_metrics'
      fetch_performance_metrics(@time_range)
    else
      {}
    end
    
    respond_to do |format|
      format.html { render "widgets/#{@widget_type}" }
    end
  end

  private

  def fetch_sales_data(time_range)
    # Implement your data fetching logic
    {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Sales',
          data: [120, 190, 300, 500, 200, 300, 450]
        }
      ]
    }
  end
end
```

### Widget Dashboard Layout

```erb
<!-- app/views/dashboard/index.html.erb -->
<div class="h-screen flex bg-slate-50" data-controller="vscode-tabs">
  <!-- Widget sidebar -->
  <div class="w-80 bg-white border-r" data-controller="dashboard-widgets">
    <div class="p-6">
      <h2 class="text-lg font-bold mb-4">Dashboard Widgets</h2>
      
      <div class="space-y-2">
        <% [
          { type: 'sales_chart', name: 'Sales Overview', icon: 'chart-line' },
          { type: 'user_analytics', name: 'User Analytics', icon: 'users' },
          { type: 'revenue_breakdown', name: 'Revenue Breakdown', icon: 'dollar-sign' },
          { type: 'performance_metrics', name: 'Performance Metrics', icon: 'activity' }
        ].each do |widget| %>
          <div class="p-3 border rounded-lg cursor-pointer hover:bg-slate-50"
               data-action="click->dashboard-widgets#openWidget"
               data-widget-type="<%= widget[:type] %>"
               data-widget-name="<%= widget[:name] %>">
            <div class="flex items-center">
              <i class="fas fa-<%= widget[:icon] %> mr-3 text-blue-500"></i>
              <span class="font-medium"><%= widget[:name] %></span>
            </div>
          </div>
        <% end %>
      </div>
    </div>
  </div>
  
  <!-- Main dashboard area -->
  <div class="flex-1 flex flex-col">
    <!-- Tab bar -->
    <div class="h-12 bg-white border-b flex items-center" data-vscode-tabs-target="tabBar">
      <div class="flex items-center h-full px-4 text-slate-500 text-sm">
        No widgets open
      </div>
    </div>
    
    <!-- Widget content areas -->
    <div class="flex-1 relative bg-slate-50" id="tab-content-areas" data-vscode-tabs-target="contentAreas">
      <div id="welcome-message" class="absolute inset-0 flex items-center justify-center">
        <div class="text-center">
          <h2 class="text-3xl font-bold text-slate-800 mb-4">Analytics Dashboard</h2>
          <p class="text-slate-600">Select widgets from the sidebar to build your custom dashboard.</p>
        </div>
      </div>
    </div>
  </div>
</div>
```

## 🎨 Advanced Customizations

### Custom Tab Icons Based on Content Type

```javascript
// Enhanced VSCodeTabsController with custom icons
addTab(tabId, tabName, contentType = 'default') {
  // ... existing code ...
  
  const iconHtml = this.getIconForContentType(contentType);
  
  tabElement.innerHTML = `
    <div class="flex items-center">
      ${iconHtml}
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
}

getIconForContentType(contentType) {
  const icons = {
    'task_category': '<svg class="w-4 h-4 mr-2 text-blue-500">...</svg>',
    'file_folder': '<svg class="w-4 h-4 mr-2 text-yellow-500">...</svg>',
    'file_image': '<svg class="w-4 h-4 mr-2 text-green-500">...</svg>',
    'file_code': '<svg class="w-4 h-4 mr-2 text-purple-500">...</svg>',
    'product': '<svg class="w-4 h-4 mr-2 text-indigo-500">...</svg>',
    'user': '<svg class="w-4 h-4 mr-2 text-pink-500">...</svg>',
    'default': '<div class="w-3 h-3 bg-blue-400 rounded-full mr-3 opacity-60"></div>'
  };
  
  return icons[contentType] || icons['default'];
}
```

### Tab Context Menu

```javascript
// Add right-click context menu to tabs
addTab(tabId, tabName, contentType = 'default') {
  // ... existing code ...
  
  tabElement.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    this.showTabContextMenu(event, tabId);
  });
}

showTabContextMenu(event, tabId) {
  const contextMenu = document.createElement('div');
  contextMenu.className = 'absolute bg-white border border-slate-200 rounded-lg shadow-lg py-2 z-50';
  contextMenu.style.left = `${event.clientX}px`;
  contextMenu.style.top = `${event.clientY}px`;
  
  const menuItems = [
    { label: 'Close Tab', action: () => this.closeTabById(tabId) },
    { label: 'Close Others', action: () => this.closeOtherTabs(tabId) },
    { label: 'Close All', action: () => this.closeAllTabs() },
    { label: 'Duplicate Tab', action: () => this.duplicateTab(tabId) }
  ];
  
  menuItems.forEach(item => {
    const menuItem = document.createElement('div');
    menuItem.className = 'px-4 py-2 hover:bg-slate-100 cursor-pointer text-sm';
    menuItem.textContent = item.label;
    menuItem.addEventListener('click', () => {
      item.action();
      document.body.removeChild(contextMenu);
    });
    contextMenu.appendChild(menuItem);
  });
  
  document.body.appendChild(contextMenu);
  
  // Remove menu when clicking elsewhere
  document.addEventListener('click', () => {
    if (document.body.contains(contextMenu)) {
      document.body.removeChild(contextMenu);
    }
  }, { once: true });
}
```

These examples demonstrate the flexibility and power of the VSCode-style tabbed interface system across different use cases and domains.