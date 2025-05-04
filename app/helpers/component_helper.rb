module ComponentHelper
  # Layout components
  def PageLayout(props = {}, &block)
    render Containers::PageLayoutComponent.new(**props), &block
  end

  def Card(props = {}, &block)
    render Containers::CardComponent.new(**props), &block
  end

  # UI components
  def Button(props = {}, &block)
    render UI::ButtonComponent.new(**props), &block
  end

  def SearchInput(props = {})
    render UI::SearchInputComponent.new(**props)
  end

  # Data display components
  def TreeView(props = {}, &block)
    render DataDisplay::TreeViewComponent.new(**props), &block
  end

  # Feedback components
  def Modal(props = {}, &block)
    render Feedback::ModalComponent.new(**props), &block
  end

  # Dynamic component resolver
  def Component(name, props = {}, &block)
    component_class = resolve_component_class(name)
    render component_class.new(**props), &block
  end

  private

  def resolve_component_class(name)
    # Convert snake_case or camelCase to PascalCase
    class_name = name.to_s.camelize

    # Try to find the component in common namespaces
    namespaces = ["UI", "Containers", "DataDisplay", "Feedback"]

    namespaces.each do |namespace|
      begin
        return "#{namespace}::#{class_name}Component".constantize
      rescue NameError
        next
      end
    end

    # Try without namespace
    begin
      return "#{class_name}Component".constantize
    rescue NameError
      raise "Could not find component: #{name}"
    end
  end
end 
