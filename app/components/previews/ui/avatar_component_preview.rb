# filepath: /home/baloz/uV/side-projects/Collab/go3/spec/components/previews/ui/avatar_component_preview.rb
class Ui::AvatarComponentPreview < ViewComponent::Preview
  # @param size [Symbol] select {options: [xs, sm, md, lg, xl, 2xl, 3xl]}
  # @param shape [Symbol] select {options: [circle, square]}
  # @param status [Symbol] select {options: [nil, online, offline, busy, away]}
  def playground(size: :md, shape: :circle, status: nil)
    render Ui::AvatarComponent.new(
      src: "https://i.pravatar.cc/300",
      alt: "User Avatar",
      size: size,
      shape: shape,
      status: status
    )
  end

  def default
    render Ui::AvatarComponent.new(
      src: "https://i.pravatar.cc/300",
      alt: "Default Avatar"
    )
  end
  
  def sizes
    render_with_template
  end
  
  def shapes
    render_with_template
  end
  
  def with_status
    render_with_template
  end
  
  def with_initials
    render_with_template
  end
  
  def with_icon
    render Ui::AvatarComponent.new(
      icon: %(<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
      </svg>).html_safe,
      color: "blue",
      alt: "User Icon"
    )
  end
  
  def with_custom_colors
    render_with_template
  end
end
