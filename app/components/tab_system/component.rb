# frozen_string_literal: true

module TabSystem
  class Component < ViewComponent::Base
    def initialize(
      theme: :vscode,
      show_icons: true,
      show_close_buttons: true,
      allow_reorder: true,
      show_actions_menu: true,
      controller_name: "tab-system",
      classes: ""
    )
      Rails.logger.info "=== TabSystem::Component initializing with controller_name: #{controller_name} ==="
      @theme = theme
      @show_icons = show_icons
      @show_close_buttons = show_close_buttons
      @allow_reorder = allow_reorder
      @show_actions_menu = show_actions_menu
      @controller_name = controller_name
      @classes = classes
    end

    private

    attr_reader :theme, :show_icons, :show_close_buttons, :allow_reorder,
                :show_actions_menu, :controller_name, :classes

    def container_classes
      base = "flex-1 flex flex-col bg-white dark:bg-slate-900 shadow-xl"
      "#{base} #{classes}".strip
    end

    def tab_bar_classes
      case theme
      when :enterprise
        "relative h-12 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 overflow-hidden"
      else
        "relative h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700"
      end
    end

    def tab_wrapper_classes
      "flex items-center h-full w-full"
    end

    def tab_scroll_area_classes
      "flex-1 min-w-0 overflow-hidden"
    end

    def tab_list_classes
      case theme
      when :enterprise
        "flex items-center overflow-x-auto h-full scrollbar-hide pl-2"
      else
        "flex items-center overflow-x-auto h-full scrollbar-hide"
      end
    end

    def tab_item_base_classes
      base = "group relative flex items-center h-full px-4 mr-px cursor-pointer transition-all duration-200"
      base += " min-w-[120px] max-w-[200px] text-sm font-medium whitespace-nowrap"
      base
    end

    def tab_item_theme_classes
      case theme
      when :vscode
        "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 " \
        "border-t-2 border-transparent border-r border-l border-slate-200 dark:border-slate-700 " \
        "hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-200"
      when :chrome
        "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 " \
        "rounded-t-lg mx-1 hover:bg-slate-200 dark:hover:bg-slate-700"
      when :minimal
        "text-slate-600 dark:text-slate-400 " \
        "border-b-2 border-transparent hover:border-slate-300 dark:hover:border-slate-600"
      end
    end

    def tab_item_active_classes
      case theme
      when :vscode
        "bg-white dark:bg-slate-900 text-slate-900 dark:text-white " \
        "border-t-blue-500 dark:border-t-blue-400 shadow-sm z-10"
      when :chrome
        "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-lg z-10"
      when :minimal
        "text-slate-900 dark:text-white border-b-blue-500 dark:border-b-blue-400"
      end
    end

    def tab_icon_classes
      "w-4 h-4 mr-2 flex-shrink-0"
    end

    def tab_text_classes
      "flex-1 overflow-hidden text-ellipsis"
    end

    def tab_close_button_classes
      "w-4 h-4 ml-2 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 " \
      "transition-opacity duration-200 hover:bg-red-500 hover:text-white"
    end

    def tab_loading_classes
      "absolute inset-0 flex items-center justify-center bg-white/90 dark:bg-slate-900/90"
    end

    def no_tabs_indicator_classes
      "flex items-center h-full px-4 text-slate-500 dark:text-slate-400 text-sm font-medium"
    end

    def tab_actions_classes
      "flex items-center px-3 space-x-2 bg-slate-50 dark:bg-slate-800 flex-shrink-0"
    end

    def content_area_classes
      "flex-1 overflow-auto relative bg-white dark:bg-slate-900"
    end

    def tab_content_classes
      "absolute inset-0 overflow-auto"
    end

    def tab_content_hidden_classes
      "hidden"
    end

    def tab_content_active_classes
      "block"
    end

    def welcome_message_classes
      "absolute inset-0 flex items-center justify-center"
    end

    def controller_attributes
      {
        "data-tab-system-show-icons-value" => show_icons.to_s,
        "data-tab-system-show-close-buttons-value" => show_close_buttons.to_s,
        "data-tab-system-allow-reorder-value" => allow_reorder.to_s,
        "data-tab-system-theme-value" => theme.to_s,
        "data-#{controller_name}-show-icons-value" => show_icons.to_s,
        "data-#{controller_name}-theme-value" => theme.to_s
      }
    end
  end
end