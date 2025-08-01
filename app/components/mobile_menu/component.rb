# frozen_string_literal: true

module MobileMenu
  class Component < ViewComponent::Base
    renders_one :actions

    def initialize(
      title: "GO3",
      show_back: false,
      current_context: nil,
      classes: ""
    )
      @title = title
      @show_back = show_back
      @current_context = current_context
      @classes = classes
    end

    private

    attr_reader :title, :show_back, :current_context, :classes

    def container_classes
      base = "lg:hidden fixed top-0 left-0 right-0 bg-white dark:bg-slate-900 shadow-sm z-40"
      "#{base} #{classes}".strip
    end
  end
end
