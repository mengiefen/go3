# filepath: /home/baloz/uV/side-projects/Collab/go3/spec/components/previews/ui/heading_component_preview.rb
class Ui::HeadingComponentPreview < ViewComponent::Preview
  # @param tag [Symbol] select {options: [h1, h2, h3, h4, h5, h6]}
  # @param color [Symbol] select {options: [default, light, muted, white, primary, success, warning, danger]}
  def playground(tag: :h1, color: :default)
    render Ui::HeadingComponent.new(
      tag: tag,
      color: color
    ) do
      "Sample Heading Text"
    end
  end

  def default
    render Ui::HeadingComponent.new do
      "Default h1 Heading"
    end
  end
  
  def all_levels
    render_with_template
  end
  
  def color_variants
    render_with_template
  end
  
  def with_custom_classes
    render Ui::HeadingComponent.new(
      tag: :h2,
      classes: "italic underline decoration-blue-500"
    ) do
      "Custom Styled Heading"
    end
  end
  
  def with_attributes
    render Ui::HeadingComponent.new(
      tag: :h2,
      id: "section-title",
      data: { controller: "scroll-to" }
    ) do
      "Heading with Custom Attributes"
    end
  end
end
