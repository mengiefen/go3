module Ui
  class HeadingComponent < ViewComponent::Base
    HEADING_CLASSES = {
      h1: "text-4xl font-extrabold tracking-tight",
      h2: "text-3xl font-bold tracking-tight",
      h3: "text-2xl font-bold",
      h4: "text-xl font-bold",
      h5: "text-lg font-bold",
      h6: "text-base font-bold"
    }.freeze

    COLOR_CLASSES = {
      default: "text-gray-900",
      light: "text-gray-700",
      muted: "text-gray-500",
      white: "text-white",
      primary: "text-blue-600",
      success: "text-green-600",
      warning: "text-yellow-600",
      danger: "text-red-600"
    }.freeze

    def initialize(
      tag: :h1,
      color: :default,
      classes: nil,
      **attrs
    )
      @tag = tag.to_sym
      @color = color.to_sym
      @classes = classes
      @attrs = attrs
    end

    def call
      content_tag @tag, content, class: classes, **@attrs
    end

    private

    def classes
      [
        HEADING_CLASSES[@tag],
        COLOR_CLASSES[@color],
        @classes
      ].compact.join(" ")
    end
  end
end
