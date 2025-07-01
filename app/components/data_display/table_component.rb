# app/components/data_display/table_component.rb
class DataDisplay::TableComponent < ViewComponent::Base
  renders_many :rows, "RowComponent"

  def initialize(columns: [], turbo_frame_target: nil, class_list: "")
    @columns = columns
    @turbo_frame_target = turbo_frame_target
    @class_list = class_list
  end

  class RowComponent < ViewComponent::Base
    def initialize(**options)
      @options = options
    end

    def call
      content
    end
  end
end