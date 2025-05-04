
class Forms::TextareaComponent < ViewComponent::Base
  renders_one :label
  renders_one :hint
  renders_one :error
  
  def initialize(
    name: nil,
    id: nil,
    value: nil,
    placeholder: nil,
    required: false,
    disabled: false,
    readonly: false,
    rows: 4,
    maxlength: nil,
    autofocus: false,
    resize: :vertical,
    error_state: false,
    classes: nil,
    container_classes: nil,
    **attrs
  )
    @name = name
    @id = id || name&.to_s&.gsub(/[\[\]]+/, '_')&.sub(/_$/, '')
    @value = value
    @placeholder = placeholder
    @required = required
    @disabled = disabled
    @readonly = readonly
    @rows = rows
    @maxlength = maxlength
    @autofocus = autofocus
    @resize = resize
    @error_state = error_state
    @classes = classes
    @container_classes = container_classes
    @attrs = attrs
  end
  
  private
  
  def textarea_classes
    [
      "block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500",
      resize_class,
      @error_state ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500" : "",
      @disabled ? "bg-gray-100 cursor-not-allowed opacity-75" : "",
      @classes
    ].compact.join(" ")
  end
  
  def resize_class
    case @resize
    when :none then "resize-none"
    when :vertical then "resize-y"
    when :horizontal then "resize-x"
    when :both then "resize"
    else "resize-y"
    end
  end
  
  def textarea_attributes
    {
      name: @name,
      id: @id,
      placeholder: @placeholder,
      required: @required,
      disabled: @disabled,
      readonly: @readonly,
      rows: @rows,
      maxlength: @maxlength,
      autofocus: @autofocus,
      class: textarea_classes,
      aria: {
        invalid: @error_state
      },
      **@attrs
    }.compact
  end
end
  

