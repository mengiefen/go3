# filepath: /home/baloz/uV/side-projects/Collab/go3/app/components/ui/tabs_modal_component.rb
module Ui
  class TabsModalComponent < ViewComponent::Base
    renders_many :tabs, "TabComponent"
    renders_many :panels, "PanelComponent"
    
    attr_reader :id, :title, :active_tab, :size, :full_screen
    
    def initialize(id:, title:, active_tab: nil, size: :md, full_screen: false)
      @id = id
      @title = title
      @active_tab = active_tab
      @size = size
      @full_screen = full_screen
    end
    
    def modal_size_class
      case @size
      when :sm then "max-w-sm"
      when :md then "max-w-md"
      when :lg then "max-w-lg"
      when :xl then "max-w-xl"
      when :"2xl" then "max-w-2xl"
      when :"3xl" then "max-w-3xl"
      when :"4xl" then "max-w-4xl"
      when :"5xl" then "max-w-5xl"
      when :"6xl" then "max-w-6xl"
      when :"7xl" then "max-w-7xl"
      when :full then "max-w-full"
      else "max-w-md"
      end
    end
    
    def full_screen_classes
      @full_screen ? "fixed inset-0 p-0" : "relative p-6"
    end
    
    class TabComponent < ViewComponent::Base
      attr_reader :id, :label, :icon, :panel_id, :active
      
      def initialize(id:, label:, icon: nil, active: false)
        @id = id
        @label = label
        @icon = icon
        @panel_id = "#{id}-panel"
        @active = active
      end
      
      def call
        content_tag :button,
          type: "button",
          id: id,
          class: "px-4 py-2 border-b-2 font-medium text-sm focus:outline-none",
          role: "tab",
          "aria-controls": panel_id,
          "aria-selected": active.to_s,
          "data-tabs-target": "tab",
          "data-action": "click->tabs#switch" do
            if icon.present?
              concat tag.span(class: "mr-2") { icon }
            end
            concat label
          end
      end
    end
    
    class PanelComponent < ViewComponent::Base
      attr_reader :id, :lazy_load_url
      
      def initialize(id:, lazy_load_url: nil)
        @id = "#{id}-panel"
        @lazy_load_url = lazy_load_url
      end
      
      def call
        panel_content = if lazy_load_url.present?
          tag.turbo_frame(
            id: "#{id}-frame",
            src: lazy_load_url,
            loading: "lazy",
            class: "w-full h-full"
          ) do
            tag.div(class: "flex justify-center items-center py-8") do
              tag.div(class: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500")
            end
          end
        else
          content
        end
        
        content_tag :div,
          id: id,
          class: "hidden",
          role: "tabpanel",
          tabindex: "0",
          "aria-hidden": "true",
          "data-tabs-target": "panel" do
            panel_content
          end
      end
    end
  end
end
