# frozen_string_literal: true

class Ui::ButtonComponentPreview < ViewComponent::Preview
  # @param variant [Symbol] select {options: [primary, secondary, success, danger, warning, info, light, dark, link]}
  # @param size [Symbol] select {options: [xs, sm, md, lg, xl]}
  # @param full_width [Boolean] toggle
  # @param disabled [Boolean] toggle
  # @param loading [Boolean] toggle
  def playground(
    variant: :primary, 
    size: :md, 
    full_width: false, 
    disabled: false, 
    loading: false
  )
    render Ui::ButtonComponent.new(
      variant: variant,
      size: size,
      full_width: full_width,
      disabled: disabled,
      loading: loading
    ) do
      "Button Text"
    end
  end

  def default
    render Ui::ButtonComponent.new do
      "Default Button"
    end
  end

  def variants
    render_with_template
  end

  def sizes
    render_with_template
  end

  def states
    render_with_template
  end

  def with_icon
    render_with_template
  end

  # Primary button
  def primary
    render Ui::ButtonComponent.new(variant: :primary) { "Primary" }
  end

  # Icon button variant
  def icon_button
    render Ui::ButtonComponent.new(variant: :icon, icon: icon_svg, aria: { label: "Settings" })
  end

  # Icon button with different sizes
  def icon_button_sizes
    buttons = [
      render(Ui::ButtonComponent.new(variant: :icon, size: :xs, icon: icon_svg, aria: { label: "XS" })),
      render(Ui::ButtonComponent.new(variant: :icon, size: :sm, icon: icon_svg, aria: { label: "SM" })),
      render(Ui::ButtonComponent.new(variant: :icon, size: :md, icon: icon_svg, aria: { label: "MD" })),
      render(Ui::ButtonComponent.new(variant: :icon, size: :lg, icon: icon_svg, aria: { label: "LG" })),
      render(Ui::ButtonComponent.new(variant: :icon, size: :xl, icon: icon_svg, aria: { label: "XL" }))
    ]
    safe_join(buttons, " ")
  end

  private

  def icon_svg
    # Simple gear/settings icon
    ApplicationController.helpers.tag.svg(
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      viewBox: "0 0 24 24",
      stroke: "currentColor",
      class: "h-5 w-5"
    ) do
      ApplicationController.helpers.tag.path(
        stroke_linecap: "round",
        stroke_linejoin: "round",
        stroke_width: 2,
        d: "M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-1.1 0-2-.9-2-2h4c0 1.1-.9 2-2 2zm6.36-2.36l-1.41-1.41c.36-.54.59-1.19.59-1.89s-.23-1.35-.59-1.89l1.41-1.41c.78.78.78 2.05 0 2.83zm-12.72 0c-.78-.78-.78-2.05 0-2.83l1.41 1.41c-.36.54-.59 1.19-.59 1.89s.23 1.35.59 1.89l-1.41 1.41z"
      )
    end
  end
end
