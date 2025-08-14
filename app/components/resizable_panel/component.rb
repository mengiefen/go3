# frozen_string_literal: true

module ResizablePanel
  class Component < ViewComponent::Base
    def initialize(
      direction: :horizontal,
      min_size: 200,
      max_size: 600,
      default_size: 300,
      handle_position: :end,
      persist_size: true,
      storage_key: nil,
      controller_name: "resizable-panel",
      classes: "",
      handle_classes: ""
    )
      @direction = direction
      @min_size = min_size
      @max_size = max_size
      @default_size = default_size
      @handle_position = handle_position
      @persist_size = persist_size
      @storage_key = storage_key || "resizable_panel_#{object_id}"
      @controller_name = controller_name
      @classes = classes
      @handle_classes = handle_classes
    end

    private

    attr_reader :direction, :min_size, :max_size, :default_size,
                :handle_position, :persist_size, :storage_key,
                :controller_name, :classes, :handle_classes

    def panel_classes
      base_classes = "relative"

      size_classes = if horizontal?
        "h-full"
      else
        "w-full"
      end

      "#{base_classes} #{size_classes} #{classes}".strip
    end

    def handle_base_classes
      if horizontal?
        "absolute top-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-500/20 transition-colors"
      else
        "absolute left-0 right-0 h-2 cursor-row-resize hover:bg-blue-500/20 transition-colors"
      end
    end

    def handle_position_classes
      if horizontal?
        handle_at_start? ? "left-0" : "right-0"
      else
        handle_at_start? ? "top-0" : "bottom-0"
      end
    end

    def handle_indicator_classes
      if horizontal?
        "absolute top-0 bottom-0 w-0.5 bg-slate-300 dark:bg-slate-600 left-1/2 -translate-x-1/2"
      else
        "absolute left-0 right-0 h-0.5 bg-slate-300 dark:bg-slate-600 top-1/2 -translate-y-1/2"
      end
    end

    def controller_attributes
      {
        "data-controller" => controller_name,
        "data-#{controller_name}-direction-value" => direction.to_s,
        "data-#{controller_name}-min-size-value" => min_size.to_s,
        "data-#{controller_name}-max-size-value" => max_size.to_s,
        "data-#{controller_name}-default-size-value" => default_size.to_s,
        "data-#{controller_name}-handle-position-value" => handle_position.to_s,
        "data-#{controller_name}-persist-size-value" => persist_size.to_s,
        "data-#{controller_name}-storage-key-value" => storage_key
      }
    end

    def horizontal?
      direction == :horizontal
    end

    def handle_at_start?
      handle_position == :start
    end

    def initial_style
      if horizontal?
        "width: #{default_size}px;"
      else
        "height: #{default_size}px;"
      end
    end
  end
end
