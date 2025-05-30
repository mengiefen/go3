# frozen_string_literal: true

module Navigation
  class PageTabsComponentPreview < ViewComponent::Preview
    # @!group Basic Examples
    
    # @label Basic Single Tab
    # @render_with_template
    def basic
      render Navigation::PageTabsComponent.new(current_path: "/dashboard") do |c|
        c.with_tab(title: "Dashboard", path: "/dashboard", active: true, closable: true)
      end
    end
    
    # @label Multiple Tabs
    # @render_with_template
    def multiple_tabs
      render Navigation::PageTabsComponent.new(current_path: "/organizations/1") do |c|
        c.with_tab(title: "Dashboard", path: "/dashboard", active: false)
        c.with_tab(title: "Organizations", path: "/organizations", active: false)
        c.with_tab(title: "Sample Organization", path: "/organizations/1", active: true)
        c.with_tab(title: "User Settings", path: "/users/settings/edit", active: false)
      end
    end
    
    # @!group Tab States
    
    # @label With Long Tab Titles
    # @render_with_template
    def with_long_titles
      render Navigation::PageTabsComponent.new(current_path: "/dashboard") do |c|
        c.with_tab(title: "Dashboard Home Page", path: "/dashboard", active: true)
        c.with_tab(title: "Organizations Management Dashboard", path: "/organizations", active: false)
        c.with_tab(title: "This is a very long tab title that will be truncated", path: "/very-long-path", active: false)
      end
    end
    
    # @label Non-closable Tab
    # @render_with_template
    def non_closable_tabs
      render Navigation::PageTabsComponent.new(current_path: "/dashboard") do |c|
        c.with_tab(title: "Dashboard", path: "/dashboard", active: true, closable: false)
        c.with_tab(title: "Organizations", path: "/organizations", active: false, closable: true)
      end
    end
    
    # @!group Interactions
    
    # @label Draggable Tabs (Drag & Drop)
    # @render_with_template
    def draggable_tabs
      render Navigation::PageTabsComponent.new(current_path: "/organizations/1") do |c|
        c.with_tab(title: "Dashboard", path: "/dashboard", active: false)
        c.with_tab(title: "Organizations", path: "/organizations", active: false)
        c.with_tab(title: "Sample Organization", path: "/organizations/1", active: true)
        c.with_tab(title: "User Profile", path: "/users/profile", active: false)
      end
    end
    
    # @!group Tab Actions
    
    # @label Tab Actions Menu
    # @render_with_template
    def tab_actions
      render Navigation::PageTabsComponent.new(current_path: "/organizations/1") do |c|
        c.with_tab(title: "Dashboard", path: "/dashboard", active: false)
        c.with_tab(title: "Organizations", path: "/organizations", active: false)
        c.with_tab(title: "Sample Organization", path: "/organizations/1", active: true)
        c.with_tab(title: "User Profile", path: "/users/profile", active: false)
        c.with_tab(title: "Settings", path: "/users/settings/edit", active: false)
      end
    end
    
    # @!group User Preferences
    
    # @label Toggle Tabbed Navigation
    # @render_with_template
    def user_preference
      render_with_template
    end
    
    # @!group Responsive
    
    # @label Mobile View
    # @render_with_template
    def mobile_view
      render_with_template
    end
  end
end 