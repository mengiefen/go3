module Alerts
  class AlertComponent < ViewComponent::Base
    VARIANT_CLASSES = {
      info: "bg-blue-50 text-blue-800 border-blue-200",
      success: "bg-green-50 text-green-800 border-green-200",
      warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
      error: "bg-red-50 text-red-800 border-red-200"
    }.freeze

    ICON_CLASSES = {
      info: "text-blue-400",
      success: "text-green-400",
      warning: "text-yellow-400",
      error: "text-red-400"
    }.freeze

    renders_one :action
    renders_one :icon

    def initialize(
      variant: :info,
      dismissible: false, 
      title: nil,
      classes: nil,
      data: {},
      **attrs
    )
      @variant = variant.to_sym
      @dismissible = dismissible
      @title = title
      @classes = classes
      @data = data
      @attrs = attrs
    end

    private

    def default_icon
      case @variant
      when :info
        %(<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>).html_safe
      when :success
        %(<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>).html_safe
      when :warning
        %(<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>).html_safe
      when :error
        %(<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>).html_safe
      end
    end

    def container_classes
      [
        "border rounded-md p-4",
        VARIANT_CLASSES[@variant],
        @classes
      ].compact.join(" ")
    end

    def icon_classes
      ICON_CLASSES[@variant]
    end

    def stimulus_attributes
      return {} unless @dismissible
      
      {
        data: {
          controller: "alert",
          action: "click->alert#dismiss"
        }
      }
    end
  end
end
