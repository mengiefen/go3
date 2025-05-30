module Navigation
  class PageTabsComponent < ViewComponent::Base
    renders_many :tabs

    attr_reader :current_path

    def initialize(current_path:)
      @current_path = current_path
    end

    def render?
      # Only render if we have tabs
      tabs.present?
    end

    # Tab class for managing individual page tabs
    class TabComponent < ViewComponent::Base
      attr_reader :title, :path, :active, :closable, :id

      def initialize(title:, path:, active: false, closable: true, id: nil)
        @title = title
        @path = path
        @active = active
        @closable = closable
        @id = id || "tab-#{SecureRandom.hex(4)}"
      end

      def call
        tag.div(
          class: "page-tab #{active ? 'active' : ''}",
          data: {
            id: id,
            path: path,
            title: title,
            active: active,
            tabs_target: "tab",
            action: "click->page-tabs#activate"
          }
        ) do
          concat tag.span(title, class: "tab-title")
          if closable
            concat tag.button(
              tag.i(class: "fas fa-times"),
              class: "close-tab",
              data: {
                action: "click->page-tabs#closeTab"
              }
            )
          end
        end
      end
    end
  end
end 