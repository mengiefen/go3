module Ui
  class AvatarComponent < ViewComponent::Base
    SIZE_CLASSES = {
      xs: "h-6 w-6 text-xs",
      sm: "h-8 w-8 text-sm",
      md: "h-10 w-10 text-base",
      lg: "h-12 w-12 text-lg",
      xl: "h-16 w-16 text-xl",
      "2xl": "h-20 w-20 text-2xl",
      "3xl": "h-24 w-24 text-3xl"
    }.freeze

    def initialize(
      src: nil,
      alt: "",
      size: :md,
      shape: :circle,
      status: nil,
      initials: nil,
      icon: nil,
      color: nil,
      classes: nil,
      **attrs
    )
      @src = src
      @alt = alt
      @size = size.to_sym
      @shape = shape.to_sym
      @status = status
      @initials = initials
      @icon = icon
      @color = generate_color(color)
      @classes = classes
      @attrs = attrs
    end

    private

    def container_classes
      [
        SIZE_CLASSES[@size],
        @shape == :circle ? "rounded-full" : "rounded-md",
        "relative inline-flex items-center justify-center flex-shrink-0",
        @classes
      ].compact.join(" ")
    end

    def generate_color(color)
      return color if color

      # Generate a consistent color based on the initials or alt text
      seed = (@initials || @alt).to_s
      colors = ["bg-blue-100 text-blue-800", 
                "bg-red-100 text-red-800", 
                "bg-green-100 text-green-800", 
                "bg-yellow-100 text-yellow-800", 
                "bg-purple-100 text-purple-800", 
                "bg-pink-100 text-pink-800", 
                "bg-indigo-100 text-indigo-800"]
      
      return "bg-gray-100 text-gray-800" if seed.empty?
      
      # Use a hash function to get a consistent index
      index = 0
      seed.each_byte { |b| index = (index + b) % colors.length }
      colors[index]
    end

    def status_classes
      case @status
      when :online then "bg-green-400"
      when :offline then "bg-gray-400"
      when :busy then "bg-red-400"
      when :away then "bg-yellow-400"
      else ""
      end
    end

    def status_dot_size
      case @size
      when :xs, :sm then "h-2 w-2"
      when :md, :lg then "h-3 w-3"
      else "h-4 w-4"
      end
    end

    def status_position
      "absolute bottom-0 right-0 transform translate-y-1/4 -translate-x-1/4"
    end
  end
end
