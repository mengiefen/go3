# filepath: /home/baloz/uV/side-projects/Collab/go3/app/components/previews/ui/input_component_preview.rb
class Forms::InputComponentPreview < ViewComponent::Preview
  # @param type [Symbol] select {options: [text, email, password, number, tel, url, search, date, time, datetime-local, month, week]}
  # @param size [Symbol] select {options: [sm, md, lg]}
  # @param disabled [Boolean] toggle
  # @param readonly [Boolean] toggle
  # @param required [Boolean] toggle
  # @param error_state [Boolean] toggle
  def playground(type: :text, size: :md, disabled: false, readonly: false, required: false, error_state: false)
    render(Forms::InputComponent.new(
      type: type,
      name: "example",
      placeholder: "Enter value...",
      size: size,
      disabled: disabled,
      readonly: readonly,
      required: required,
      error_state: error_state
    )) do |component|
      component.with_label { "Input Label" }
      if error_state
        component.with_error { "This field contains an error" }
      else
        component.with_hint { "Helper text for this field" }
      end
    end
  end

  def default
    render(Forms::InputComponent.new(
      name: "default_example",
      placeholder: "Enter text..."
    )) do |component|
      component.with_label { "Default Input" }
    end
  end
  
  def input_types
    render_with_template
  end
  
  def sizes
    render_with_template
  end
  
  def states
    render_with_template
  end
  
  def with_prefix_and_suffix
    render_with_template
  end
  
  def with_error
    render(Forms::InputComponent.new(
      name: "error_example",
      value: "Invalid input",
      error_state: true
    )) do |component|
      component.with_label { "Email Address" }
      component.with_error { "Please enter a valid email address" }
    end
  end
end
