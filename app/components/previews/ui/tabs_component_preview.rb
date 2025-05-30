module Ui
  class TabsComponentPreview < ViewComponent::Preview
    # @!group Tabs Variations
    
    # @label Basic Tabs
    # @description A basic implementation of tabs with static content
    def basic
      render_with_template
    end
    
    # @label Tabs with Icons
    # @description Tabs with icon and text labels
    def with_icons
      render_with_template
    end
    
    # @label Tabs with Lazy Loading
    # @description Tabs with content loaded via Turbo Frames
    def with_lazy_loading
      render_with_template
    end
    
    # Hidden preview method to provide content for lazy tab 1
    def lazy_tab_1_content
      render_with_template(layout: false)
    end
    
    # Hidden preview method to provide content for lazy tab 2
    def lazy_tab_2_content
      render_with_template(layout: false)
    end
    
    # @!endgroup
  end
end
