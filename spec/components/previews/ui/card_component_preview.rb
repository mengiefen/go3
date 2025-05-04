# filepath: /home/baloz/uV/side-projects/Collab/go3/spec/components/previews/ui/card_component_preview.rb
class Ui::CardComponentPreview < ViewComponent::Preview
  # @param padding [Boolean] toggle
  # @param shadow [Symbol] select {options: [none, sm, md, lg, xl]}
  # @param rounded [Symbol] select {options: [none, sm, md, lg, xl, full]}
  # @param border [Boolean] toggle
  def playground(padding: true, shadow: :md, rounded: :md, border: false)
    render(Ui::CardComponent.new(
      padding: padding,
      shadow: shadow,
      rounded: rounded,
      border: border
    )) do
      tag.div(class: "h-24 flex items-center justify-center") do
        "Card Content"
      end
    end
  end

  def default
    render(Ui::CardComponent.new) do
      tag.p(class: "text-gray-700") do
        "This is a default card with medium shadow and rounded corners."
      end
    end
  end
  
  def with_header_and_footer
    render_with_template
  end
  
  def variants
    render_with_template
  end
  
  def without_padding
    render(Ui::CardComponent.new(padding: false)) do
      tag.div(class: "h-24 bg-gray-100 flex items-center justify-center") do
        "Card without padding"
      end
    end
  end
  
  def with_border
    render(Ui::CardComponent.new(border: true)) do
      tag.p(class: "text-gray-700") do
        "This card has a border instead of a shadow."
      end
    end
  end
end
