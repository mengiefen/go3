module Ui
  class TextComponent < ViewComponent::Base
    SIZE_CLASSES = {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl"
    }.freeze

    COLOR_CLASSES = {
      default: "text-gray-900",
      muted: "text-gray-500",
      light: "text-gray-400",
      white: "text-white",
      primary: "text-blue-600",
      success: "text-green-600",
      warning: "text-yellow-600",
      danger: "text-red-600"
    }.freeze

    WEIGHT_CLASSES = {
      thin: "font-thin",
      extralight: "font-extralight",
      light: "font-light",
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
      extrabold: "font-extrabold",
      black: "font-black"
    }.freeze

    LEADING_CLASSES = {
      none: "leading-none",
      tight: "leading-tight",
      snug: "leading-snug",
      normal: "leading-normal",
      relaxed: "leading-relaxed",
      loose: "leading-loose"
    }.freeze

    def initialize(
      tag: :p,
      size: :base,
      color: :default,
      weight: :normal,
      leading: :normal,
      tracking: nil,
      align: nil,
      truncate: false,
      italic: false,
      underline: false,
      line_clamp: nil,
      classes: nil,
      **attrs
    )
      @tag = tag
      @size = size.to_sym
      @color = color.to_sym
      @weight = weight.to_sym
      @leading = leading.to_sym
      @tracking = tracking
      @align = align
      @truncate = truncate
      @italic = italic
      @underline = underline
      @line_clamp = line_clamp
      @classes = classes
      @attrs = attrs
    end

    def call
      content_tag @tag, content, class: classes, **@attrs
    end

    private

    def classes
      [
        SIZE_CLASSES[@size],
        COLOR_CLASSES[@color],
        WEIGHT_CLASSES[@weight],
        LEADING_CLASSES[@leading],
        @tracking ? "tracking-#{@tracking}" : nil,
        @align ? "text-#{@align}" : nil,
        @truncate ? "truncate" : nil,
        @italic ? "italic" : nil,
        @underline ? "underline" : nil,
        @line_clamp ? "line-clamp-#{@line_clamp}" : nil,
        @classes
      ].compact.join(" ")
    end
  end
end
