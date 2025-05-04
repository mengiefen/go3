module Ui
  class InputComponent < ViewComponent::Base
    renders_one :label
    renders_one :hint
    renders_one :error
    renders_one :prefix
    renders_one :suffix
    
    def initialize(
      type: :text,
      name: nil,
      id: nil,
      value: nil,
      placeholder: nil,
      required: false,
      disabled: false,
      readonly: false,
      autocomplete: nil,
      min: nil,
      max: nil,
      step: nil,
      pattern: nil,
      size: :md,
      error_state: false,
      classes: nil,
      container_classes: nil,
      **attrs
    )
      @type = type
      @name = name
      @id = id || name&.to_s&.gsub(/[\[\]]+/, '_')&.sub(/_$/, '')
      @value = value
      @placeholder = placeholder
      @required = required
      @disabled = disabled
      @readonly = readonly
      @autocomplete = autocomplete
      @min = min
      @max = max
      @step = step
      @pattern = pattern
      @size = size.to_sym
      @error_state = error_state
      @classes = classes
      @container_classes = container_classes
      @attrs = attrs
    end
    
    private
    
    def input_classes
      [
        "block w-full rounded border-gray-300 border focus:border-blue-500 focus:ring-blue-500",
        size_classes,
        @error_state ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500" : "",
        @disabled ? "bg-gray-100 cursor-not-allowed opacity-75" : "",
        @classes
      ].compact.join(" ")
    end
    
    def size_classes
      case @size
      when :xs then "text-xs py-1 px-2"
      when :sm then "text-sm py-1.5 px-3"
      when :md then "text-base py-2 px-4"
      when :lg then "text-lg py-2.5 px-5"
      else "text-base py-2 px-4"
      end
    end
    
    def wrapper_classes
      [
        "relative rounded",
        @container_classes
      ].compact.join(" ")
    end
    
    def input_attributes
      {
        type: @type,
        name: @name,
        id: @id,
        value: @value,
        placeholder: @placeholder,
        required: @required,
        disabled: @disabled,
        readonly: @readonly,
        autocomplete: @autocomplete,
        min: @min,
        max: @max,
        step: @step,
        pattern: @pattern,
        class: input_classes,
        aria: {
          invalid: @error_state
        },
        **@attrs
      }.compact
    end
  end
end
