class DataDisplay::TreeViewComponent < ViewComponent::Base
  renders_many :nodes, "NodeComponent"

  def initialize(show_connectors: true)
    @show_connectors = show_connectors
  end

  # Node component definition
  class NodeComponent < ViewComponent::Base
    renders_many :nodes, "DataDisplay::TreeViewComponent::NodeComponent"
    renders_one :actions

    def initialize(id:, label:, expanded: false)
      @id = id
      @label = label
      @expanded = expanded
    end
  end
end 
