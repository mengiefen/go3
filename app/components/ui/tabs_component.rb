# filepath: /home/baloz/uV/side-projects/Collab/go3/app/components/ui/tabs_component.rb
module Ui
  class TabsComponent < ViewComponent::Base
    renders_many :tab_triggers
    renders_many :tab_contents
    
    attr_reader :id, :active_tab
    
    def initialize(id:, active_tab: nil)
      @id = id
      @active_tab = active_tab
    end
    
    # TabTriggerComponent allows you to create individual tabs in a tabs list
    class TabTriggerComponent < ViewComponent::Base
      attr_reader :id, :label, :icon, :active, :panel_id
      
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
          class: "tab-trigger px-4 py-2 border-b-2 font-medium text-sm focus:outline-none",
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
    
    # TabContentComponent creates individual tab content panels
    class TabContentComponent < ViewComponent::Base
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
          class: "tab-content hidden",
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
