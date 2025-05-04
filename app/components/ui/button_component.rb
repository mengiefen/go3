module Ui
  class ButtonComponent < ViewComponent::Base
    VARIANT_CLASSES = {
      primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
      secondary: "bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-400",
      success: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
      danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
      warning: "bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-400",
      info: "bg-cyan-500 hover:bg-cyan-600 text-white focus:ring-cyan-400",
      light: "bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 focus:ring-gray-300",
      dark: "bg-gray-800 hover:bg-gray-900 text-white focus:ring-gray-700",
      link: "bg-transparent hover:underline text-blue-600 hover:text-blue-800 focus:ring-blue-400"
    }.freeze

    SIZE_CLASSES = {
      xs: "px-2 py-1 text-xs",
      sm: "px-2.5 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-5 py-2.5 text-lg",
      xl: "px-6 py-3 text-xl"
    }.freeze

    def initialize(
      variant: :primary,
      size: :md,
      type: :button,
      full_width: false,
      disabled: false,
      loading: false,
      icon: nil,
      icon_position: :left,
      classes: nil,
      aria: {},
      **attrs
    )
      @variant = variant.to_sym
      @size = size.to_sym
      @type = type
      @full_width = full_width
      @disabled = disabled
      @loading = loading
      @icon = icon
      @icon_position = icon_position
      @classes = classes
      @aria = aria
      @attrs = attrs
    end

    def call
      content_tag :button, 
        button_content,
        **button_attributes
    end

    private

    def button_content
      return spinner if @loading && !content

      if @icon && @loading
        icon_with_content_and_spinner
      elsif @icon
        icon_with_content
      elsif @loading
        spinner_with_content
      else
        content
      end
    end

    def icon_with_content
      if @icon_position == :left
        safe_join([icon_element, content_with_spacing])
      else
        safe_join([content_with_spacing, icon_element])
      end
    end

    def icon_with_content_and_spinner
      if @icon_position == :left
        safe_join([spinner, content_with_spacing])
      else
        safe_join([content_with_spacing, spinner])
      end
    end

    def spinner_with_content
      safe_join([spinner, content_with_spacing])
    end
    
    def spinner
      tag.span class: "spinner-border animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" do
        tag.span(class: "sr-only") { "Loading..." }
      end
    end

    def content_with_spacing
      return content unless content.present?
      
      tag.span class: "mx-1" do
        content
      end
    end

    def icon_element
      tag.span class: "w-5 h-5" do
        @icon
      end
    end

    def button_attributes
      {
        type: @type,
        disabled: @disabled || @loading,
        class: classes,
        **@aria,
        **@attrs
      }
    end

    def classes
      [
        "inline-flex items-center justify-center font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-150 ease-in-out",
        VARIANT_CLASSES[@variant],
        SIZE_CLASSES[@size],
        @full_width ? "w-full" : "",
        @disabled ? "opacity-60 cursor-not-allowed" : "",
        @classes
      ].compact.join(" ")
    end
  end
end
