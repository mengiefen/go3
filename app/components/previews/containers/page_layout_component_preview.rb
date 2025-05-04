class Containers::PageLayoutComponentPreview < ViewComponent::Preview
  # @label Default Layout
  #
  # @description Shows a complete page layout with header, side panel, and main content
  #
  # JSX-like usage:
  # ```erb
  # <%= PageLayout do |c| %>
  #   <% c.header do %>
  #     <h1>Header Content</h1>
  #   <% end %>
  #
  #   <% c.side_panel do %>
  #     <nav>Sidebar Content</nav>
  #   <% end %>
  #
  #   <% c.main_content do %>
  #     <div>Main Content Area</div>
  #   <% end %>
  # <% end %>
  # ```
  def default
    render Containers::PageLayoutComponent.new do |c|
      c.header do
        tag.div(class: "p-4") do
          tag.h1("Dashboard", class: "text-xl font-bold")
        end
      end

      c.side_panel do
        tag.div(class: "p-4") do
          tag.nav(class: "space-y-2") do
            safe_join([
              tag.a("Dashboard", href: "#", class: "block px-4 py-2 rounded-md bg-blue-50 text-blue-600"),
              tag.a("Users", href: "#", class: "block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50"),
              tag.a("Settings", href: "#", class: "block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50")
            ])
          end
        end
      end

      c.main_content do
        tag.div(class: "space-y-6") do
          tag.h2("Welcome to Dashboard", class: "text-2xl font-bold text-gray-900")
          tag.p("This is the main content area of your application.", class: "text-gray-600")
        end
      end
    end
  end

  # @label Without Side Panel
  #
  # @description Page layout with the side panel hidden
  def without_side_panel
    render Containers::PageLayoutComponent.new(show_side_panel: false) do |c|
      c.header do
        tag.div(class: "p-4 flex justify-between items-center") do
          tag.h1("Full Width View", class: "text-xl font-bold")
          tag.button("Menu", class: "px-4 py-2 bg-blue-600 text-white rounded-md")
        end
      end

      c.main_content do
        tag.div(class: "space-y-6") do
          tag.h2("Full Width Content", class: "text-2xl font-bold text-gray-900")
          tag.p("This layout is useful for focused content pages or mobile views.", class: "text-gray-600")
        end
      end
    end
  end
end 
