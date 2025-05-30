# filepath: /home/baloz/uV/side-projects/Collab/go3/spec/components/previews/ui/badge_component_preview.rb
class Ui::BadgeComponentPreview < ViewComponent::Preview
  # @param variant [Symbol] select {options: [primary, secondary, success, danger, warning, info, light, dark]}
  # @param size [Symbol] select {options: [xs, sm, md, lg]}
  # @param rounded [Boolean] toggle
  # @param dot [Boolean] toggle
  def playground(variant: :primary, size: :md, rounded: true, dot: false)
    render Ui::BadgeComponent.new(
      variant: variant,
      size: size,
      rounded: rounded,
      dot: dot
    ) do
      "Badge Text"
    end
  end

  def default
    render Ui::BadgeComponent.new do
      "Default Badge"
    end
  end
  
  def variants
    render_with_template
  end
  
  def sizes
    render_with_template
  end
  
  def rounded_vs_square
    render_with_template
  end
  
  def with_dot
    render Ui::BadgeComponent.new(dot: true) do
      "Badge with Dot"
    end
  end
  
  def with_custom_classes
    render Ui::BadgeComponent.new(classes: "border-2 border-blue-500") do
      "Custom Badge"
    end
  end
end
