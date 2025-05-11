  module Containers
  class PageLayoutComponent < ViewComponent::Base
    renders_one :header
    renders_one :side_panel
    renders_one :main_content

    def initialize(show_side_panel: true)
      @show_side_panel = show_side_panel
    end
  end
  
end 
