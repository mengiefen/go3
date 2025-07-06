# GO3 ERP Implementation Examples

Practical examples and patterns for implementing the GO3 ERP tab system with mobile-first responsive design and enterprise workflows.

## 📊 ERP Task Management System

Complete example of an enterprise task management interface with ERP workflows, priorities, and department-based organization.

### Mobile Task Management Component

```ruby
# app/components/mobile_tasks/component.rb
module MobileTasks
  class Component < ViewComponent::Base
    def initialize(tasks: [], filter: 'all', current_user: nil)
      @tasks = tasks
      @filter = filter
      @current_user = current_user
    end

    private

    attr_reader :tasks, :filter, :current_user

    def filtered_tasks
      case filter
      when 'my_tasks'
        tasks.select { |task| task[:assignee]&.dig(:name) == 'You' }
      when 'urgent'
        tasks.select { |task| task[:priority] == 'urgent' }
      when 'pending'
        tasks.select { |task| task[:status] == 'pending' }
      else
        tasks
      end
    end

    def priority_color(priority)
      case priority
      when 'urgent' then 'bg-red-500'
      when 'high' then 'bg-orange-500'
      when 'medium' then 'bg-yellow-500'
      when 'low' then 'bg-green-500'
      else 'bg-gray-500'
      end
    end

    def status_badge_class(status)
      case status
      when 'completed'
        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      when 'in_progress'
        'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      when 'pending'
        'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
      else
        'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
      end
    end
  end
end
```

### Desktop Tab Content Template

```erb
<!-- app/views/reusable_tabs_demo/tab_contents/tasks.html.erb -->
<%= turbo_frame_tag frame_id do %>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
    <!-- Header with gradient -->
    <div class="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold"><%= content_name %></h2>
          <p class="text-blue-100 mt-1">ERP task management and workflow tracking</p>
        </div>
        <div class="bg-white/10 backdrop-blur-sm rounded-lg p-3">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- ERP Task Content -->
    <div class="p-6">
      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <div class="flex items-center">
            <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Active Workflows</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">18</p>
            </div>
          </div>
        </div>
        <!-- Additional stats... -->
      </div>

      <!-- Recent ERP Tasks -->
      <div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent ERP Workflows</h3>
        <div class="space-y-3">
          <% [
            { title: "Process Q4 Financial Audit", priority: "high", status: "in_progress", assignee: "Sarah Mitchell", due: "Today" },
            { title: "Employee Payroll Processing", priority: "urgent", status: "pending", assignee: "Michelle Carter", due: "Tomorrow" },
            { title: "Inventory Reconciliation", priority: "medium", status: "completed", assignee: "Antonio Silva", due: "Yesterday" }
          ].each do |task| %>
            <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <h4 class="font-medium text-gray-900 dark:text-white"><%= task[:title] %></h4>
                  <div class="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <span class="flex items-center">
                      <span class="w-2 h-2 rounded-full mr-2 <%= task[:priority] == 'urgent' ? 'bg-red-500' : task[:priority] == 'high' ? 'bg-orange-500' : 'bg-yellow-500' %>"></span>
                      <%= task[:priority].capitalize %> priority
                    </span>
                    <span>Assigned to <%= task[:assignee] %></span>
                    <span>Due <%= task[:due] %></span>
                  </div>
                </div>
              </div>
            </div>
          <% end %>
        </div>
      </div>
    </div>
  </div>
<% end %>
```

### Organization Management Component

```ruby
# app/components/mobile_organizations/component.rb
module MobileOrganizations
  class Component < ViewComponent::Base
    def initialize(organizations: [], active_org_id: nil, can_create: false)
      @organizations = organizations
      @active_org_id = active_org_id
      @can_create = can_create
    end

    private

    attr_reader :organizations, :active_org_id, :can_create

    def status_badge_class(status)
      case status
      when 'active'
        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      when 'pending'
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      when 'inactive'
        'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
      else
        'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
      end
    end
  end
end
```

## 🏗️ Mobile Layout Integration

### Mobile Layout Component

```ruby
# app/components/mobile_layout/component.rb
module MobileLayout
  class Component < ViewComponent::Base
    renders_one :main_content

    def initialize(active_tab: 'home')
      @active_tab = active_tab
    end

    private

    attr_reader :active_tab

    def navigation_items
      [
        { key: 'home', name: 'Home', icon: 'home-icon' },
        { key: 'orgs', name: 'Organizations', icon: 'office-building' },
        { key: 'tasks', name: 'Tasks', icon: 'clipboard-list' },
        { key: 'team', name: 'Team', icon: 'users' },
        { key: 'more', name: 'More', icon: 'dots-horizontal' }
      ]
    end

    def active_tab?(key)
      active_tab == key
    end
  end
end
```

### Mobile Layout Template

```erb
<!-- app/components/mobile_layout/component.html.erb -->
<div class="h-screen flex flex-col bg-gray-50 dark:bg-gray-900" data-controller="mobile-layout">
  <!-- Top Header -->
  <div class="sticky top-0 z-20 backdrop-blur-lg bg-white/90 dark:bg-gray-900/90 border-b border-gray-100 dark:border-gray-800">
    <div class="px-4 py-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <span class="text-white text-sm font-bold">G3</span>
          </div>
          <h1 class="text-lg font-semibold text-gray-900 dark:text-white">GO3 Platform</h1>
        </div>
        <button class="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>

  <!-- Main Content -->
  <div class="flex-1 overflow-auto">
    <%= main_content %>
  </div>

  <!-- Bottom Navigation -->
  <div class="border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg">
    <div class="flex justify-around py-2">
      <% navigation_items.each do |item| %>
        <%= link_to reusable_tabs_demo_full_implementation_path(mobile_tab: item[:key]), 
            class: "flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-200 #{active_tab?(item[:key]) ? 'bg-blue-50 dark:bg-blue-900/30' : ''}" do %>
          <div class="w-6 h-6 mb-1 <%= active_tab?(item[:key]) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400' %>">
            <!-- Icon SVG -->
          </div>
          <span class="text-xs font-medium <%= active_tab?(item[:key]) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400' %>">
            <%= item[:name] %>
          </span>
        <% end %>
      <% end %>
    </div>
  </div>
</div>
```

## 🎯 Team Management Component

### Team Component Implementation

```ruby
# app/components/mobile_team/component.rb
module MobileTeam
  class Component < ViewComponent::Base
    def initialize(team_members: [], departments: [], current_user: nil)
      @team_members = team_members
      @departments = departments
      @current_user = current_user
    end

    private

    attr_reader :team_members, :departments, :current_user

    def online_status_color(member)
      if member[:is_online]
        'bg-green-400'
      elsif member[:status] == 'away'
        'bg-yellow-400'
      else
        'bg-gray-400'
      end
    end

    def department_member_count(department_name)
      team_members.count { |member| member[:department] == department_name }
    end
  end
end
```

## 🔧 Desktop Tab System Integration

### TabSystem Component Usage

```erb
<!-- app/views/reusable_tabs_demo/full_implementation.html.erb -->
<%= render TabSystem::Component.new(
  theme: :enterprise,
  show_icons: false,
  show_close_buttons: true,
  allow_reorder: true,
  show_actions_menu: true,
  controller_name: "tab-system",
  classes: "shadow-xl"
) %>
```

### Navigation Sidebar Integration

```erb
<%= render NavigationSidebar::Component.new(
  navigation_type: 'organizations',
  collapsible: true,
  search_enabled: false,
  controller_name: "reusable-navigation-sidebar"
) %>
```

## 📱 Responsive Design Patterns

### Mobile-First Approach

```erb
<!-- Mobile Layout (visible on mobile only) -->
<div class="lg:hidden" data-controller="mobile-demo">
  <%= render MobileLayout::Component.new(active_tab: active_tab) do |layout| %>
    <% layout.with_main_content do %>
      <!-- Mobile-specific components -->
    <% end %>
  <% end %>
</div>

<!-- Desktop Layout (hidden on mobile) -->
<div class="hidden lg:flex h-screen flex-col bg-slate-50 dark:bg-slate-900">
  <!-- Desktop tab system -->
</div>
```

### ERP Data Structure

```ruby
# Example ERP task data
tasks: [
  {
    id: 1,
    title: "Process Q4 Financial Audit",
    description: "Review and approve quarterly financial statements for compliance",
    status: 'pending',
    priority: 'high',
    due_date: Date.today,
    tags: ['finance', 'audit'],
    assignee: { name: 'Sarah Mitchell', role: 'Financial Controller' }
  },
  {
    id: 2,
    title: "Update Employee Payroll",
    description: "Process monthly payroll for Global Tech Solutions",
    status: 'in_progress',
    priority: 'urgent',
    due_date: Date.today,
    assignee: { name: 'You' }
  }
]

# Example organization data
organizations: [
  {
    id: 1,
    name: "Global Tech Solutions",
    description: "Enterprise technology and consulting services",
    member_count: 324,
    status: 'active',
    favorite: true
  },
  {
    id: 2,
    name: "Acme Manufacturing Corp",
    description: "Industrial manufacturing and supply chain",
    member_count: 186,
    status: 'active'
  }
]
```

## 🎨 Enterprise Styling

### GO3 Color Palette

```css
/* Primary Colors */
--go3-primary: #006DB3;
--go3-info: #36AEFC;
--go3-warning: #ffcc00;
--go3-danger: #ff4100;

/* Usage in Tailwind */
.bg-go3-primary { background-color: #006DB3; }
.text-go3-info { color: #36AEFC; }
```

### Component Styling Patterns

```erb
<!-- Professional header with gradient -->
<div class="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
  <h2 class="text-2xl font-bold">ERP Dashboard</h2>
</div>

<!-- Card with subtle shadows -->
<div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
  <!-- Content -->
</div>

<!-- Status indicators -->
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
  Active
</span>
```

This documentation covers the complete GO3 ERP tab system implementation with real examples from the codebase, showing both mobile and desktop patterns for enterprise resource planning workflows.