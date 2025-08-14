module Ui
  class BadgeComponent < ViewComponent::Base
    VARIANT_CLASSES = {
      primary: "bg-blue-100 text-blue-800",
      secondary: "bg-gray-100 text-gray-800",
      success: "bg-green-100 text-green-800",
      danger: "bg-red-100 text-red-800",
      warning: "bg-yellow-100 text-yellow-800",
      info: "bg-cyan-100 text-cyan-800",
      light: "bg-gray-50 text-gray-600",
      dark: "bg-gray-700 text-white"
    }.freeze

    SIZE_CLASSES = {
      xs: "text-xs px-1.5 py-0.5",
      sm: "text-xs px-2 py-0.5",
      md: "text-sm px-2.5 py-0.5",
      lg: "text-base px-3 py-1"
    }.freeze

    def initialize(
      variant: :primary,
      size: :md,
      rounded: true,
      dot: false,
      classes: nil,
      **attrs
    )
      @variant = variant.to_sym
      @size = size.to_sym
      @rounded = rounded
      @dot = dot
      @classes = classes
      @attrs = attrs
    end

    private

    def container_classes
      [
        "inline-flex items-center font-medium",
        VARIANT_CLASSES[@variant],
        SIZE_CLASSES[@size],
        @rounded ? "rounded-full" : "rounded",
        @classes
      ].compact.join(" ")
    end
  end
end
