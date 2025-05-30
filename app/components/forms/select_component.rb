class Forms::SelectComponent < ViewComponent::Base
  renders_one :label
  renders_one :hint
  renders_one :error
  
  def initialize(
    name: nil,
    id: nil,
    options: [],
    selected: nil,
    prompt: nil,
    required: false,
    disabled: false,
    multiple: false,
    size: nil,
    error_state: false,
    classes: nil,
    container_classes: nil,
    enhanced: true,
    placeholder: nil,
    close_on_select: nil,
    searchable: true,
    clear_button: true,
    max_items_showing: nil,
    color: "blue",
    variant: "default",
    **attrs
  )
    @name = name
    @id = id || name&.to_s&.gsub(/[\[\]]+/, '_')&.sub(/_$/, '')
    @options = options
    @selected = selected
    @prompt = prompt
    @required = required
    @disabled = disabled
    @multiple = multiple
    @size = size
    @error_state = error_state
    @classes = classes
    @container_classes = container_classes
    @enhanced = enhanced
    @placeholder = placeholder || prompt || (@multiple ? "Select options..." : "Select an option...")
    @close_on_select = close_on_select.nil? ? !@multiple : close_on_select
    @searchable = searchable
    @clear_button = clear_button
    @max_items_showing = max_items_showing
    @color = color
    @variant = variant
    @attrs = attrs
  end
  
  private
  
  def select_classes
    [
      "block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 transition duration-150 ease-in-out",
      "focus:ring-#{@color}-500",
      @error_state ? "pr-10 text-red-900 ring-red-300 placeholder:text-red-300 focus:ring-red-500" : "",
      @disabled ? "bg-gray-50 text-gray-500 cursor-not-allowed" : "",      
      @multiple && @enhanced ? "" : "appearance-none",
      @enhanced ? "sr-only" : "", # Hide the original select for enhanced UI but keep it accessible
      @classes
    ].compact.join(" ")
  end
  
  def select_attributes
    {
      name: @name,
      id: @id,
      required: @required,
      disabled: @disabled,
      multiple: @multiple,
      size: @size,
      class: select_classes,
      aria: {
        invalid: @error_state,
        hidden: @enhanced
      },
      **@attrs
    }.compact
  end
  
  def trigger_classes
    base_classes = [
      "relative w-full rounded-md py-2 pl-3 pr-10 text-left shadow-sm ring-1 ring-inset focus:outline-none focus:ring-2 sm:text-sm sm:leading-6 transition-all duration-150 ease-in-out",
      "focus:ring-#{@color}-500 dark:focus:ring-#{@color}-400",
    ]
    
    case @variant
    when "default"
      base_classes << "bg-white dark:bg-gray-800 ring-gray-300 dark:ring-gray-700"
      base_classes << (@error_state ? "ring-red-300 dark:ring-red-700 text-red-900 dark:text-red-400 focus:ring-red-500" : "")
    when "outline"
      base_classes << "bg-transparent ring-gray-300 dark:ring-gray-700"
      base_classes << (@error_state ? "ring-red-300 dark:ring-red-700 text-red-900 dark:text-red-400 focus:ring-red-500" : "")
    when "filled"
      base_classes << "bg-gray-50 dark:bg-gray-900 ring-gray-300 dark:ring-gray-700"
      base_classes << (@error_state ? "ring-red-300 dark:ring-red-700 bg-red-50 dark:bg-red-900 text-red-900 dark:text-red-400 focus:ring-red-500" : "")
    when "underline"
      base_classes = []
      base_classes << "w-full border-0 border-b-2 border-gray-300 dark:border-gray-700 bg-transparent py-2 pl-0 pr-10 focus:border-#{@color}-500 dark:focus:border-#{@color}-400 focus:ring-0"
      base_classes << (@error_state ? "border-red-300 dark:border-red-700 text-red-900 dark:text-red-400 focus:border-red-500" : "")
    end
    
    base_classes << (@disabled ? "bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 cursor-not-allowed opacity-75" : "cursor-pointer")
    
    base_classes.compact.join(" ")
  end
  
  def options_panel_classes
    [
      "absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm",
      "hidden", # Initially hidden
      "animate-dropdown-in"
    ].compact.join(" ")
  end
  
  def search_input_classes
    [
      "block w-full rounded-md px-3 py-2 text-sm leading-5 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500",
      "border-0 border-b border-gray-200 dark:border-gray-700 focus:border-#{@color}-500 dark:focus:border-#{@color}-400 focus:ring-0",
      "bg-transparent transition-all duration-150 ease-in-out"
    ].compact.join(" ")
  end
  
  def option_item_classes
    [
      "relative cursor-pointer select-none",
      "px-3 py-2 rounded-md", # Added rounded corners for better hover effect
      "transition-all duration-150 ease-in-out",
      "flex items-center"
    ].compact.join(" ")
  end
  
  def checkbox_classes
    [
      "h-4 w-4 rounded mr-2 transition-colors duration-150 ease-in-out",
      "text-#{@color}-600 dark:text-#{@color}-500 border-gray-300 dark:border-gray-600 focus:ring-#{@color}-500 dark:focus:ring-#{@color}-400"
    ].compact.join(" ")
  end
  
  def badge_classes
    [
      "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mr-1.5 mb-1",
      "bg-#{@color}-100 dark:bg-#{@color}-800 text-#{@color}-800 dark:text-#{@color}-200",
      "transition-all duration-150 ease-in-out"
    ].compact.join(" ")
  end
  
  def badge_remove_button_classes
    [
      "ml-1 h-4 w-4 rounded-full inline-flex items-center justify-center",
      "text-#{@color}-400 hover:text-#{@color}-500 dark:text-#{@color}-300 dark:hover:text-#{@color}-200",
      "focus:outline-none focus:text-#{@color}-500 dark:focus:text-#{@color}-300",
      "transition-colors duration-150 ease-in-out"
    ].compact.join(" ")
  end
  
  def clear_button_classes
    [
      "absolute inset-y-0 right-0 flex items-center pr-8",
      "text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400",
      "transition-colors duration-150 ease-in-out"
    ].compact.join(" ")
  end
  
  def has_selected_options?
    @selected.present? && @selected != [] && @selected != ""
  end
  
  def should_show_clear_button?
    @clear_button && !@disabled && has_selected_options?
  end
  
  def stimulus_controller_data
    {
      controller: "select",
      select_placeholder_value: @placeholder,
      select_multiple_value: @multiple,
      select_close_on_select_value: @close_on_select
    }
  end
  
  def dropdown_icon
    <<-SVG.strip
      <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" clip-rule="evenodd" />
      </svg>
    SVG
  end
  
  def clear_icon
    <<-SVG.strip
      <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
      </svg>
    SVG
  end
  
  def search_icon
    <<-SVG.strip
      <svg class="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
      </svg>
    SVG
  end
end

