class IconSidebarComponent < ViewComponent::Base
  def initialize(active_item: nil)
    @active_item = active_item
  end

  def active?(item_id)
    @active_item == item_id
  end

  private

  def before_render
    @sidebar_items = [
      { id: 'organizations', icon: 'building', label: 'Organizations', path: organizations_path },
      { id: 'tasks', icon: 'clipboard-list', label: 'Tasks', path: tasks_path },
      { id: 'users', icon: 'users', label: 'Users', path: '#' },
      { id: 'campaigns', icon: 'megaphone', label: 'Campaigns', path: '#' },
      { id: 'analytics', icon: 'chart-bar', label: 'Analytics', path: '#' },
      { id: 'settings', icon: 'cog', label: 'Settings', path: '#' }
    ]
  end

  attr_reader :sidebar_items
end