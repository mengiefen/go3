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
  end
end 
