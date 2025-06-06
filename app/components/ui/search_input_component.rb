class Ui::SearchInputComponent < ViewComponent::Base
  def initialize(
    placeholder: "Search...",
    name: "q",
    value: nil,
    show_voice_input: true,
    html_options: {}
  )
    @placeholder = placeholder
    @name = name
    @value = value
    @show_voice_input = show_voice_input
    @html_options = html_options
  end
end 
