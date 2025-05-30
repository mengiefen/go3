# frozen_string_literal: true

# PopoverComponent
#
# A reusable, accessible popover component for UI overlays, supporting click or hover triggers.
#
# Usage:
#   render Ui::PopoverComponent.new(trigger: :click, position: :bottom) do |popover|
#     popover.trigger { ... } # trigger button or element
#     popover.panel { ... }   # popover content
#   end
#
# Options:
#   - trigger: :click or :hover (default: :click)
#   - position: :top, :bottom, :left, :right (default: :bottom)
#
# Follows accessibility best practices (ARIA roles, focus management).
#
# @see https://www.w3.org/WAI/ARIA/apg/patterns/dialogmodal/
module Ui
  class PopoverComponent < ViewComponent::Base
    renders_one :trigger
    renders_one :panel

    attr_reader :id, :trigger_type, :position

    # @param trigger [Symbol] The trigger type (:click or :hover)
    # @param position [Symbol] The popover position (:top, :bottom, :left, :right)
    # @param id [String, nil] Optional DOM id for the popover
    # @return [Ui::PopoverComponent]
    def initialize(trigger: :click, position: :bottom, id: nil)
      @trigger_type = trigger.to_sym
      @position = position.to_sym
      @id = id || "popover-#{SecureRandom.hex(4)}"
    end

    private

    # @return [String] Tailwind CSS classes for popover position
    def popover_position_classes
      case position
      when :top
        "bottom-full mb-2"
      when :right
        "left-full ml-2"
      when :left
        "right-full mr-2"
      else # :bottom
        "top-full mt-2"
      end
    end
  end
end 
