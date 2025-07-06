# frozen_string_literal: true

module NavigationSidebar
  class Component < ViewComponent::Base
    def initialize(
      navigation_type: "default",
      title: nil,
      categories: [],
      collapsible: true,
      search_enabled: false,
      controller_name: "navigation_sidebar",
      classes: ""
    )
      @navigation_type = navigation_type
      @title = title || default_title
      @categories = categories.presence || default_categories
      @collapsible = collapsible
      @search_enabled = search_enabled
      @controller_name = controller_name
      @classes = classes
    end

    private

    attr_reader :navigation_type, :title, :categories, :collapsible,
                :search_enabled, :controller_name, :classes

    def default_title
      navigation_type.to_s.upcase.gsub("_", " ")
    end

    def default_categories
      navigation_config[navigation_type.to_sym] || []
    end

    def navigation_config
      {
        organizations: [
          {
            name: "My Organizations",
            icon: "building",
            collapsed: false,
            items: [
              { id: "org-1", name: "Acme Corp", type: "organization", badge: nil },
              { id: "org-2", name: "Tech Solutions", type: "organization", badge: "new" },
              { id: "org-3", name: "Digital Agency", type: "organization", badge: nil }
            ]
          },
          {
            name: "Departments",
            icon: "users",
            collapsed: true,
            items: [
              { id: "dept-1", name: "Engineering", type: "department", badge: "12" },
              { id: "dept-2", name: "Marketing", type: "department", badge: nil },
              { id: "dept-3", name: "Sales", type: "department", badge: nil }
            ]
          }
        ],
        users: [
          {
            name: "Active Users",
            icon: "users",
            collapsed: false,
            items: [
              { id: "user-1", name: "John Doe", type: "user", badge: nil },
              { id: "user-2", name: "Jane Smith", type: "user", badge: "new" },
              { id: "user-3", name: "Bob Wilson", type: "user", badge: nil }
            ]
          },
          {
            name: "Admins",
            icon: "shield",
            collapsed: true,
            items: [
              { id: "admin-1", name: "Admin User", type: "admin", badge: nil },
              { id: "admin-2", name: "Super Admin", type: "admin", badge: nil }
            ]
          }
        ],
        campaigns: [
          {
            name: "Active Campaigns",
            icon: "megaphone",
            collapsed: false,
            items: [
              { id: "camp-1", name: "Summer Sale", type: "campaign", badge: "live" },
              { id: "camp-2", name: "Product Launch", type: "campaign", badge: nil }
            ]
          },
          {
            name: "Draft Campaigns",
            icon: "folder",
            collapsed: true,
            items: [
              { id: "draft-1", name: "Holiday Campaign", type: "campaign", badge: "draft" },
              { id: "draft-2", name: "Brand Awareness", type: "campaign", badge: "draft" }
            ]
          }
        ],
        analytics: [
          {
            name: "Reports",
            icon: "chart-bar",
            collapsed: false,
            items: [
              { id: "report-1", name: "User Engagement", type: "report", badge: nil },
              { id: "report-2", name: "Revenue Report", type: "report", badge: nil }
            ]
          },
          {
            name: "Dashboards",
            icon: "dashboard",
            collapsed: true,
            items: [
              { id: "dash-1", name: "Main Dashboard", type: "dashboard", badge: nil },
              { id: "dash-2", name: "Admin Dashboard", type: "dashboard", badge: nil }
            ]
          }
        ],
        settings: [
          {
            name: "General",
            icon: "cog",
            collapsed: false,
            items: [
              { id: "set-1", name: "Application Settings", type: "settings", badge: nil },
              { id: "set-2", name: "User Preferences", type: "settings", badge: nil }
            ]
          },
          {
            name: "Security",
            icon: "lock",
            collapsed: true,
            items: [
              { id: "sec-1", name: "Access Control", type: "security", badge: nil },
              { id: "sec-2", name: "Audit Logs", type: "security", badge: nil }
            ]
          }
        ],
        tasks: [
          {
            name: "Categories",
            icon: "folder",
            collapsed: false,
            items: [
              { id: "task-all", name: "All Tasks", type: "task_category", filter: "all", badge: "45" },
              { id: "task-general", name: "General", type: "task_category", filter: "general", badge: "12" },
              { id: "task-development", name: "Development", type: "task_category", filter: "development", badge: "8" },
              { id: "task-design", name: "Design", type: "task_category", filter: "design", badge: "5" }
            ]
          },
          {
            name: "Status",
            icon: "check-circle",
            collapsed: true,
            items: [
              { id: "task-pending", name: "Pending", type: "task_status", filter: "pending", badge: "20" },
              { id: "task-in_progress", name: "In Progress", type: "task_status", filter: "in_progress", badge: "10" },
              { id: "task-completed", name: "Completed", type: "task_status", filter: "completed", badge: "15" },
              { id: "task-cancelled", name: "Cancelled", type: "task_status", filter: "cancelled", badge: nil }
            ]
          },
          {
            name: "Priority",
            icon: "flag",
            collapsed: true,
            items: [
              { id: "task-urgent", name: "Urgent", type: "task_priority", filter: "urgent", badge: "3" },
              { id: "task-high", name: "High", type: "task_priority", filter: "high", badge: "8" },
              { id: "task-medium", name: "Medium", type: "task_priority", filter: "medium", badge: "20" },
              { id: "task-low", name: "Low", type: "task_priority", filter: "low", badge: "14" }
            ]
          }
        ]
      }
    end

    def controller_attributes
      {
        "data-controller" => controller_name,
        "data-#{controller_name}-collapsible-value" => collapsible.to_s,
        "data-#{controller_name}-search-enabled-value" => search_enabled.to_s
      }
    end

    def icon_svg(icon_name)
      icons = {
        "building" => '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>',
        "users" => '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>',
        "shield" => '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>',
        "megaphone" => '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>',
        "chart-bar" => '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>',
        "cog" => '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>',
        "lock" => '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>',
        "dashboard" => '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path></svg>',
        "folder" => '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>',
        "check-circle" => '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',
        "chevron-right" => '<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>',
        "chevron-down" => '<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>',
        "flag" => '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 2H21l-3 6 3 6h-8.5l-1-2H5a2 2 0 00-2 2zm9-13.5V9"></path></svg>'
      }

      icons[icon_name] || icons["folder"]
    end
  end
end
