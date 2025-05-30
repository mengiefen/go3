module Containers
  class CardComponent < ViewComponent::Base
    renders_one :header
    renders_one :footer
    renders_one :header_actions
    renders_one :footer_actions
    
    def initialize(
      padding: true,
      shadow: :md,
      rounded: :md,
      border: false,
      classes: nil,
      title: nil,
      variant: :default,
      **attrs
    )
      @padding = padding
      @shadow = shadow
      @rounded = rounded
      @border = border
      @classes = classes
      @attrs = attrs
      @title = title
      @variant = variant
    end
    
    private
    
    def container_classes
      [
        "bg-white",
        shadow_class,
        rounded_class,
        border_class,
        @classes
      ].compact.join(" ")
    end
    
    def content_classes
      @padding ? "p-4" : ""
    end
    
    def shadow_class
      case @shadow
      when :none then ""
      when :sm then "shadow-sm"
      when :md then "shadow"
      when :lg then "shadow-lg"
      when :xl then "shadow-xl"
      when :"2xl" then "shadow-2xl"
      else "shadow"
      end
    end
    
    def rounded_class
      case @rounded
      when :none then ""
      when :sm then "rounded-sm"
      when :md then "rounded-md"
      when :lg then "rounded-lg"
      when :xl then "rounded-xl"
      when :full then "rounded-full"
      else "rounded-md"
      end
    end
    
    def border_class
      @border ? "border border-gray-200" : ""
    end

    def card_classes
      class_names(
        "rounded-lg overflow-hidden",
        {
          "bg-white border border-gray-200 shadow-sm": @variant == :default,
          "bg-white border-2 border-blue-500": @variant == :highlighted,
          "bg-gray-50 border border-gray-300": @variant == :secondary
        }
      )
    end
  end
end
