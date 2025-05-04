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
end
