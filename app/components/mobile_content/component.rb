# frozen_string_literal: true

module MobileContent
  class Component < ViewComponent::Base
    def initialize(
      classes: ""
    )
      @classes = classes
    end

    private

    attr_reader :classes

    def container_classes
      base = "sm:hidden flex-1 overflow-auto bg-white dark:bg-slate-900"
      "#{base} #{classes}".strip
    end
  end
end
