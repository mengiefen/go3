# filepath: /home/baloz/uV/side-projects/Collab/go3/app/components/previews/forms/select_component_preview.rb
class Forms::SelectComponentPreview < ViewComponent::Preview
  # @param required [Boolean] toggle
  # @param disabled [Boolean] toggle
  # @param multiple [Boolean] toggle
  # @param error_state [Boolean] toggle
  def playground(
    required: false,
    disabled: false,
    multiple: false,
    error_state: false
  )
    render Forms::SelectComponent.new(
      name: "playground_select",
      options: [["Option 1", 1], ["Option 2", 2], ["Option 3", 3]],
      prompt: "Select an option",
      required: required,
      disabled: disabled,
      multiple: multiple,
      error_state: error_state
    ) do |component|
      component.with_label { "Select with playground options" }
      component.with_hint { "This is a hint text for the select" } unless error_state
      component.with_error { "This field has an error" } if error_state
    end
  end

  def default
    render Forms::SelectComponent.new(
      name: "default_select",
      options: [["Option 1", 1], ["Option 2", 2], ["Option 3", 3]],
      prompt: "Select an option"
    ) do |component|
      component.with_label { "Default Select" }
    end
  end

  def variants
    render_with_template
  end
  
  def states
    render_with_template
  end
  
  def with_hints_and_errors
    render_with_template
  end
  
  def multiple_select
    render_with_template
  end
end
