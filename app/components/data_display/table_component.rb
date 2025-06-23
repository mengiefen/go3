class DataDisplay::TableComponent < ViewComponent::Base
  def initialize(columns:[] , rows: [])
    @columns = columns
    @rows = rows
  end
end 
