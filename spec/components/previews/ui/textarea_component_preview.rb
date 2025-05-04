class Ui::TextareaComponentPreview < ViewComponent::Preview
  # @param rows [Number] number
  # @param resize [Symbol] select {options: [none, vertical, horizontal, both]}
  # @param disabled [Boolean] toggle
  # @param readonly [Boolean] toggle
  # @param required [Boolean] toggle
  # @param error_state [Boolean] toggle
  # @param maxlength [Number] number
  def playground(rows: 4, resize: :vertical, disabled: false, readonly: false, required: false, error_state: false, maxlength: nil)
    render(Ui::TextareaComponent.new(
      name: "example",
      placeholder: "Enter your text here...",
      rows: rows,
      resize: resize,
      disabled: disabled,
      readonly: readonly,
      required: required,
      error_state: error_state,
      maxlength: maxlength
    )) do |component|
      component.with_label { "Textarea Label" }
      if error_state
        component.with_error { "This field contains an error" }
      else
        component.with_hint { "Helper text for this field" }
      end
    end
  end

  def default
    render(Ui::TextareaComponent.new(
      name: "default_example",
      placeholder: "Enter your message..."
    )) do |component|
      component.with_label { "Default Textarea" }
      component.with_hint { "Clean, simple textarea with default styling" }
    end
  end
  
  def resize_options
    render_with_template
  end
  
  def rows
    render_with_template
  end
  
  def states
    render_with_template
  end
  
  def with_error
    render(Ui::TextareaComponent.new(
      name: "error_example",
      value: "Invalid content",
      error_state: true
    )) do |component|
      component.with_label { "Message" }
      component.with_error { "Please enter a valid message" }
    end
  end
  
  def with_character_count
    render(Ui::TextareaComponent.new(
      name: "with_maxlength",
      maxlength: 150,
      placeholder: "Type here to see the character counter in action...",
      value: "This is an example of a textarea with a maximum length restriction. The character count will be displayed below and will change color as you approach the limit."
    )) do |component|
      component.with_label { "Limited Text" }
      component.with_hint { "Maximum 150 characters - watch the counter change color as you type more" }
    end
  end
end
