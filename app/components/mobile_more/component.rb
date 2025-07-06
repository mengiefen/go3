# frozen_string_literal: true

module MobileMore
  class Component < ViewComponent::Base
    def initialize(
      user: nil,
      classes: ""
    )
      @user = user
      @classes = classes
    end

    private

    attr_reader :user, :classes

    def menu_items
      [
        {
          title: "Account Settings",
          icon: "user-circle",
          description: "Manage your profile and preferences",
          path: "#settings"
        },
        {
          title: "Notifications",
          icon: "bell",
          description: "Configure notification preferences",
          path: "#notifications",
          badge: 3
        },
        {
          title: "Security",
          icon: "shield-check",
          description: "Two-factor authentication and security",
          path: "#security"
        },
        {
          title: "Help & Support",
          icon: "question-mark-circle",
          description: "Get help and contact support",
          path: "#help"
        },
        {
          title: "About",
          icon: "information-circle",
          description: "Version and legal information",
          path: "#about"
        }
      ]
    end

    def icon_svg(icon_name)
      case icon_name
      when "user-circle"
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>'
      when "bell"
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>'
      when "shield-check"
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>'
      when "question-mark-circle"
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>'
      when "information-circle"
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>'
      else
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>'
      end
    end
  end
end