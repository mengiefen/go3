# frozen_string_literal: true

module MobileLayout
  class Component < ViewComponent::Base
    renders_one :main_content
    
    def initialize(
      active_tab: 'home',
      show_search: true,
      classes: ""
    )
      @active_tab = active_tab
      @show_search = show_search
      @classes = classes
    end

    private

    attr_reader :active_tab, :show_search, :classes

    def container_classes
      base = "min-h-screen bg-gray-50 dark:bg-gray-950 lg:hidden"
      "#{base} #{classes}".strip
    end
  end
end