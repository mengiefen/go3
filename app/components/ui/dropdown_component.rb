# frozen_string_literal: true

module Ui
  class DropdownComponent < ViewComponent::Base
    renders_one :button
    renders_many :items
    renders_one :search_input
    renders_one :button_text

    # Explicit method for adding an item rather than using alias_method
    def item(&block)
      items(&block)
    end

    attr_reader :id, :position, :width, :align, :searchable, :selected_class, :update_button_text

    def initialize(id: nil, position: :bottom, width: :auto, align: :start, searchable: false, selected_class: 'bg-indigo-100', update_button_text: false)
      @id = id || "dropdown-#{SecureRandom.hex(4)}"
      @position = position.to_sym # can be :bottom, :top, :left, :right
      @width = width # can be :auto, :full or a specific value like "200px"
      @align = align.to_sym # can be :start, :end, :center
      @searchable = !!searchable # ensure boolean
      @selected_class = selected_class
      @update_button_text = update_button_text == true # Force to boolean true or false
    end

    private

    def dropdown_position_classes
      case position
      when :top
        "bottom-full mb-2"
      when :right
        "left-full ml-2"
      when :left
        "right-full mr-2"
      else # default :bottom
        "top-full mt-2"
      end
    end

    def dropdown_width_classes
      case width
      when :auto
        "min-w-[200px]"
      when :full
        "w-full"
      else
        width.is_a?(String) ? "w-[#{width}]" : "min-w-[200px]"
      end
    end

    def dropdown_align_classes
      case align
      when :end
        "right-0"
      when :center
        "left-1/2 -translate-x-1/2"
      else # default :start
        "left-0"
      end
    end
  end
end
