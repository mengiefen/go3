module Containers
  class PageLayoutComponent < ViewComponent::Base
    renders_one :header
    renders_one :side_panel
    renders_one :main_content
    renders_one :toggle_button

    def initialize(show_side_panel: true, rtl: false, min_side_panel_width: 200, max_side_panel_width: 500)
      @show_side_panel = show_side_panel
      @rtl = rtl
      @min_side_panel_width = min_side_panel_width
      @max_side_panel_width = max_side_panel_width
    end
    
    # Helper methods for icons to ensure consistent usage
    def chevron_left_icon
      '<i class="fas fa-chevron-left"></i>'.html_safe
    end
    
    def chevron_right_icon
      '<i class="fas fa-chevron-right"></i>'.html_safe
    end
    
    def bars_icon
      '<i class="fas fa-bars"></i>'.html_safe
    end
  end
end 
