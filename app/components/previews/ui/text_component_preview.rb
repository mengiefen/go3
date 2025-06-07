# filepath: /home/baloz/uV/side-projects/Collab/go3/app/components/previews/ui/text_component_preview.rb
class Ui::TextComponentPreview < ViewComponent::Preview
  # @param size [Symbol] select {options: [xs, sm, base, lg, xl, 2xl]}
  # @param color [Symbol] select {options: [default, muted, light, white, primary, success, warning, danger]}
  # @param weight [Symbol] select {options: [thin, extralight, light, normal, medium, semibold, bold, extrabold, black]}
  # @param leading [Symbol] select {options: [none, tight, snug, normal, relaxed, loose]}
  def playground(size: :base, color: :default, weight: :normal, leading: :normal)
    render Ui::TextComponent.new(
      size: size,
      color: color,
      weight: weight,
      leading: leading
    ) do
      "This is a sample text paragraph that demonstrates the various text styling options available in the Text component. You can adjust the size, color, weight, and line height using the parameters above."
    end
  end

  def default
    render Ui::TextComponent.new do
      "This is a default text paragraph with normal size, weight, and line height."
    end
  end
  
  def sizes
    render_with_template
  end
  
  def colors
    render_with_template
  end
  
  def weights
    render_with_template
  end
  
  def line_heights
    render_with_template
  end
  
  def combinations
    render_with_template
  end
end
