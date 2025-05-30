# frozen_string_literal: true

# HeaderComponent
#
# A reusable, accessible header component for application layouts.
# Supports slots for logo, search, notification (dropdown), and profile (popover).
#
# Usage:
#   render Ui::HeaderComponent.new do |header|
#     header.logo { ... }
#     header.search { ... }
#     header.notification { ... }
#     header.profile { ... }
#   end
#
# Follows accessibility and responsive design best practices.
#
# @see https://www.w3.org/WAI/ARIA/apg/patterns/navigation/
module Ui
  class HeaderComponent < ViewComponent::Base
    renders_one :logo
    renders_one :search
    renders_one :notification
    renders_one :profile

    # @param classes [String, nil] Additional CSS classes for the header
    # @return [Ui::HeaderComponent]
    def initialize(classes: nil)
      @classes = classes
    end

    private

    # @return [String, nil] Additional CSS classes for the header
    attr_reader :classes
  end
end 
