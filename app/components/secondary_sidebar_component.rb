class SecondarySidebarComponent < ViewComponent::Base
  def initialize(sidebar_type: 'organizations')
    @sidebar_type = sidebar_type
    @content = sidebar_content_for(sidebar_type)
  end

  private

  attr_reader :sidebar_type, :content

  def sidebar_content_for(type)
    case type
    when 'organizations'
      {
        title: 'ORGANIZATIONS',
        categories: [
          {
            name: 'My Organizations',
            collapsed: false,
            items: [
              { id: 'org-1', name: 'Acme Corp', type: 'organization' },
              { id: 'org-2', name: 'Tech Solutions', type: 'organization' },
              { id: 'org-3', name: 'Digital Agency', type: 'organization' }
            ]
          },
          {
            name: 'Departments',
            collapsed: true,
            items: [
              { id: 'dept-1', name: 'Engineering', type: 'department' },
              { id: 'dept-2', name: 'Marketing', type: 'department' },
              { id: 'dept-3', name: 'Sales', type: 'department' }
            ]
          }
        ]
      }
    when 'users'
      {
        title: 'USERS',
        categories: [
          {
            name: 'Active Users',
            collapsed: false,
            items: [
              { id: 'user-1', name: 'John Doe', type: 'user' },
              { id: 'user-2', name: 'Jane Smith', type: 'user' },
              { id: 'user-3', name: 'Bob Wilson', type: 'user' }
            ]
          },
          {
            name: 'Admins',
            collapsed: true,
            items: [
              { id: 'admin-1', name: 'Admin User', type: 'admin' },
              { id: 'admin-2', name: 'Super Admin', type: 'admin' }
            ]
          }
        ]
      }
    when 'campaigns'
      {
        title: 'CAMPAIGNS',
        categories: [
          {
            name: 'Active Campaigns',
            collapsed: false,
            items: [
              { id: 'camp-1', name: 'Summer Sale', type: 'campaign' },
              { id: 'camp-2', name: 'Product Launch', type: 'campaign' }
            ]
          },
          {
            name: 'Draft Campaigns',
            collapsed: true,
            items: [
              { id: 'draft-1', name: 'Holiday Campaign', type: 'campaign' },
              { id: 'draft-2', name: 'Brand Awareness', type: 'campaign' }
            ]
          }
        ]
      }
    when 'analytics'
      {
        title: 'ANALYTICS',
        categories: [
          {
            name: 'Reports',
            collapsed: false,
            items: [
              { id: 'report-1', name: 'User Engagement', type: 'report' },
              { id: 'report-2', name: 'Revenue Report', type: 'report' }
            ]
          },
          {
            name: 'Dashboards',
            collapsed: true,
            items: [
              { id: 'dash-1', name: 'Main Dashboard', type: 'dashboard' },
              { id: 'dash-2', name: 'Admin Dashboard', type: 'dashboard' }
            ]
          }
        ]
      }
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
              { id: 'task-marketing', name: 'Marketing', type: 'task_category', filter: 'marketing' },
              { id: 'task-sales', name: 'Sales', type: 'task_category', filter: 'sales' },
              { id: 'task-support', name: 'Support', type: 'task_category', filter: 'support' },
              { id: 'task-admin', name: 'Admin', type: 'task_category', filter: 'admin' }
            ]
          },
          {
            name: 'Status',
            collapsed: true,
            items: [
              { id: 'task-pending', name: 'Pending', type: 'task_status', filter: 'pending' },
              { id: 'task-in_progress', name: 'In Progress', type: 'task_status', filter: 'in_progress' },
              { id: 'task-completed', name: 'Completed', type: 'task_status', filter: 'completed' },
              { id: 'task-cancelled', name: 'Cancelled', type: 'task_status', filter: 'cancelled' }
            ]
          },
          {
            name: 'Priority',
            collapsed: true,
            items: [
              { id: 'task-urgent', name: 'Urgent', type: 'task_priority', filter: 'urgent' },
              { id: 'task-high', name: 'High', type: 'task_priority', filter: 'high' },
              { id: 'task-medium', name: 'Medium', type: 'task_priority', filter: 'medium' },
              { id: 'task-low', name: 'Low', type: 'task_priority', filter: 'low' }
            ]
          }
        ]
      }
    when 'settings'
      {
        title: 'SETTINGS',
        categories: [
          {
            name: 'General',
            collapsed: false,
            items: [
              { id: 'set-1', name: 'Application Settings', type: 'settings' },
              { id: 'set-2', name: 'User Preferences', type: 'settings' }
            ]
          },
          {
            name: 'Security',
            collapsed: true,
            items: [
              { id: 'sec-1', name: 'Access Control', type: 'security' },
              { id: 'sec-2', name: 'Audit Logs', type: 'security' }
            ]
          }
        ]
      }
    else
      { title: 'EXPLORER', categories: [] }
    end
  end
end