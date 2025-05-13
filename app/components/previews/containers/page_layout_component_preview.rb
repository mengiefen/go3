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

      c.with_side_panel do
        # Direct HTML approach to ensure content appears
        <<-HTML.html_safe
          <div class="p-4">
            <nav class="space-y-2">
              <a href="#" class="block px-4 py-2 rounded-md bg-blue-50 text-blue-600 flex items-center">
                <i class="fas fa-home mr-2"></i>
                Dashboard
              </a>
              <a href="#" class="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50 flex items-center">
                <i class="fas fa-users mr-2"></i>
                Users
              </a>
              <a href="#" class="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50 flex items-center">
                <i class="fas fa-cog mr-2"></i>
                Settings
              </a>
            </nav>
          </div>
        HTML
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
          tag.button(class: "px-4 py-2 bg-blue-600 text-white rounded-md flex items-center") do
            safe_join([
              tag.i(class: "fas fa-bars mr-2"),
              "Menu"
            ])
          end
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
  
  # @label Scrolling Test
  #
  # @description Tests independent scrolling of side panel and main content with many items
  def scrolling_test
    render(Containers::PageLayoutComponent.new) do |c|
      c.header do
        tag.div(class: "p-4") do
          tag.h1("Scrolling Test", class: "text-xl font-bold")
        end
      end

      c.with_side_panel do
        <<-HTML.html_safe
        <div class="p-4">
          <h3 class="text-lg font-medium mb-4">Navigation</h3>
          <nav class="space-y-1">
            #{(1..30).map do |i|
              item_icon = case i % 5
                         when 0 then "fa-file"
                         when 1 then "fa-folder"
                         when 2 then "fa-chart-bar"
                         when 3 then "fa-user"
                         when 4 then "fa-cog"
                         end

              %(<a href="#item-#{i}" class="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50 flex items-center">
                <i class="fas #{item_icon} mr-2"></i>
                Menu Item #{i}
              </a>)
            end.join("\n")}
          </nav>
        </div>
        HTML
      end

      c.main_content do
        tag.div(class: "space-y-8") do
          # Header section
          tag.div(class: "mb-8") do
            tag.h2("Scrollable Content Test", class: "text-2xl font-bold text-gray-900")
            tag.p("This example tests the independent scrolling behavior of the side panel and main content area.", 
              class: "text-gray-600 mt-2")
          end
          
          # Generate many content sections to test scrolling
          sections = (1..20).map do |i|
            tag.div(id: "item-#{i}", class: "p-6 bg-white rounded-lg shadow-md") do
              safe_join([
                tag.h3(class: "text-xl font-semibold mb-4 flex items-center") do
                  safe_join([
                    tag.i(class: "fas fa-bookmark mr-2 text-blue-500"),
                    "Section #{i}"
                  ])
                end,
                tag.p("This is content section #{i}. It contains text that should be scrollable independently from the side panel.", 
                  class: "text-gray-600 mb-4"),
                tag.div(class: "flex space-x-2") do
                  safe_join([
                    tag.span(class: "px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center") do
                      safe_join([
                        tag.i(class: "fas fa-tag mr-1"),
                        "Tag #{i}.1"
                      ])
                    end,
                    tag.span(class: "px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs flex items-center") do
                      safe_join([
                        tag.i(class: "fas fa-tag mr-1"),
                        "Tag #{i}.2"
                      ])
                    end,
                    tag.span(class: "px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs flex items-center") do
                      safe_join([
                        tag.i(class: "fas fa-tag mr-1"),
                        "Tag #{i}.3"
                      ])
                    end
                  ])
                end
              ])
            end
          end
          safe_join(sections)
        end
      end
    end
  end
  
  # @label RTL Layout With Scrolling
  #
  # @description Tests RTL support with scrollable content
  def rtl_scrolling_test
    render(Containers::PageLayoutComponent.new(rtl: true)) do |c|
      c.header do
        tag.div(class: "p-4") do
          tag.h1("RTL Scrolling Test", class: "text-xl font-bold")
        end
      end

      c.with_side_panel do
        <<-HTML.html_safe
        <div class="p-4 text-right">
          <h3 class="text-lg font-medium mb-4">التنقل</h3>
          <nav class="space-y-1">
            #{(1..30).map do |i|
              item_icon = case i % 5
                         when 0 then "fa-file"
                         when 1 then "fa-folder"
                         when 2 then "fa-chart-bar"
                         when 3 then "fa-user"
                         when 4 then "fa-cog"
                         end

              %(<a href="#rtl-item-#{i}" class="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50 flex items-center justify-end">
                <span class="ml-2">عنصر القائمة #{i}</span>
                <i class="fas #{item_icon}"></i>
              </a>)
            end.join("\n")}
          </nav>
        </div>
        HTML
      end

      c.main_content do
        <<-HTML.html_safe
        <div class="space-y-8 text-right">
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-gray-900">اختبار المحتوى القابل للتمرير</h2>
            <p class="text-gray-600 mt-2">يختبر هذا المثال سلوك التمرير المستقل للوحة الجانبية ومنطقة المحتوى الرئيسية.</p>
          </div>
          
          #{(1..20).map do |i|
            %(
            <div id="rtl-item-#{i}" class="p-6 bg-white rounded-lg shadow-md">
              <h3 class="text-xl font-semibold mb-4 flex items-center justify-end">
                <span>القسم #{i}</span>
                <i class="fas fa-bookmark ml-2 text-blue-500"></i>
              </h3>
              <p class="text-gray-600 mb-4">هذا هو قسم المحتوى #{i}. يحتوي على نص يجب أن يكون قابلاً للتمرير بشكل مستقل عن اللوحة الجانبية.</p>
              <div class="flex space-x-2 justify-end">
                <span class="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs flex items-center">
                  <span>وسم #{i}.3</span>
                  <i class="fas fa-tag ml-1"></i>
                </span>
                <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs flex items-center">
                  <span>وسم #{i}.2</span>
                  <i class="fas fa-tag ml-1"></i>
                </span>
                <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center">
                  <span>وسم #{i}.1</span>
                  <i class="fas fa-tag ml-1"></i>
                </span>
              </div>
            </div>
            )
          end.join("\n")}
        </div>
        HTML
      end
    end
  end
end 

