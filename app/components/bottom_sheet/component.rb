# frozen_string_literal: true

module BottomSheet
  class Component < ViewComponent::Base
    renders_one :header
    renders_one :content
    renders_one :actions
    
    def initialize(
      id: "bottom-sheet",
      height: :auto, # :auto, :half, :full
      dismissible: true,
      show_handle: true,
      classes: ""
    )
      @id = id
      @height = height
      @dismissible = dismissible
      @show_handle = show_handle
      @classes = classes
    end

    private

    attr_reader :id, :height, :dismissible, :show_handle, :classes

    def container_classes
      base = "fixed inset-x-0 bottom-0 z-50 transform translate-y-full transition-transform duration-300 ease-out"
      height_classes = case height
                      when :half
                        "h-1/2"
                      when :full
                        "h-full"
                      else
                        "max-h-[90vh]"
                      end
      "#{base} #{height_classes} #{classes}".strip
    end

    def sheet_classes
      "bg-white dark:bg-gray-900 rounded-t-2xl shadow-xl h-full flex flex-col"
    end
  end
end