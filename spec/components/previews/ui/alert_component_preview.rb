# filepath: /home/baloz/uV/side-projects/Collab/go3/spec/components/previews/ui/alert_component_preview.rb
class Ui::AlertComponentPreview < ViewComponent::Preview
  # @param variant [Symbol] select {options: [info, success, warning, error]}
  # @param dismissible [Boolean] toggle
  def playground(variant: :info, dismissible: false)
    render Ui::AlertComponent.new(
      variant: variant,
      dismissible: dismissible,
      title: "Alert Title"
    ) do
      "This is an example alert message with important information."
    end
  end

  def default
    render Ui::AlertComponent.new do
      "This is a default info alert."
    end
  end
  
  def variants
    render_with_template
  end
  
  def with_title
    render Ui::AlertComponent.new(
      title: "Important Information"
    ) do
      "This alert has a title."
    end
  end
  
  def dismissible
    render Ui::AlertComponent.new(
      dismissible: true
    ) do
      "This alert can be dismissed."
    end
  end
  
  def with_custom_icon
    render(Ui::AlertComponent.new) do |component|
      component.with_icon do
        tag.svg(xmlns: "http://www.w3.org/2000/svg", class: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor") do
          tag.path(fill_rule: "evenodd", d: "M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z", clip_rule: "evenodd")
        end
      end
      "This alert has a custom icon."
    end
  end
  
  def with_action
    render(Ui::AlertComponent.new) do |component|
      component.with_action do
        render(Ui::ButtonComponent.new(variant: :primary, size: :sm)) { "Take Action" }
      end
      "This alert has an action button."
    end
  end
end
