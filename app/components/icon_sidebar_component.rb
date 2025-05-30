class IconSidebarComponent < ViewComponent::Base
  def initialize
    @sidebar_items = [
      { id: 'organizations', icon: 'building', label: 'Organizations', active: true },
      { id: 'users', icon: 'users', label: 'Users', active: false },
      { id: 'campaigns', icon: 'megaphone', label: 'Campaigns', active: false },
      { id: 'analytics', icon: 'chart-bar', label: 'Analytics', active: false },
      { id: 'settings', icon: 'cog', label: 'Settings', active: false }
    ]
  end

  private

  attr_reader :sidebar_items
end