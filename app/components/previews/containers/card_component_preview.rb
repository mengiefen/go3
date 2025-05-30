class Containers::CardComponentPreview < ViewComponent::Preview
  # @!group Basic Cards

  # @label Default Card
  #
  # @description A basic card with content
  #
  # JSX-like usage:
  # ```erb
  # <%= Card() do %>
  #   <p>Card content here</p>
  # <% end %>
  # ```
  def default
    render Containers::CardComponent.new do
      tag.div(class: "p-2") do
        tag.p("This is a basic card with default styling.", class: "text-gray-700")
      end
    end
  end

  # @label Card with Title
  #
  # @description Card with a title in the header
  #
  # JSX-like usage:
  # ```erb
  # <%= Card(title: "User Profile") do %>
  #   <p>Card content here</p>
  # <% end %>
  # ```
  def with_title
    render Containers::CardComponent.new(title: "User Profile") do
      tag.div(class: "space-y-4") do
        safe_join([
          tag.div(class: "flex items-center space-x-4") do
            tag.div(class: "h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center") do
              tag.span("JD", class: "text-blue-600 font-medium")
            end
            tag.div do
              tag.h4("John Doe", class: "font-medium")
              tag.p("john.doe@example.com", class: "text-sm text-gray-500")
            end
          end,
          tag.p("Member since: January 2023", class: "text-sm text-gray-500")
        ])
      end
    end
  end

  # @!endgroup

  # @!group Card Variants

  # @label Highlighted Card
  #
  # @description Card with highlighted border
  #
  # JSX-like usage:
  # ```erb
  # <%= Card(title: "Featured", variant: :highlighted) do %>
  #   <p>This content is highlighted</p>
  # <% end %>
  # ```
  def highlighted
    render Containers::CardComponent.new(
      title: "Featured Content",
      variant: :highlighted
    ) do
      tag.p("This card has a highlighted border to draw attention to important content.", class: "text-gray-700")
    end
  end

  # @label Secondary Card
  #
  # @description Card with secondary styling
  #
  # JSX-like usage:
  # ```erb
  # <%= Card(title: "Notes", variant: :secondary) do %>
  #   <p>Secondary information</p>
  # <% end %>
  # ```
  def secondary
    render Containers::CardComponent.new(
      title: "Additional Notes",
      variant: :secondary
    ) do
      tag.p("This card uses secondary styling for less important information.", class: "text-gray-700")
    end
  end

  # @!endgroup

  # @!group Advanced Cards

  # @label Card with Actions
  #
  # @description Card with header and footer actions
  #
  # JSX-like usage:
  # ```erb
  # <%= Card(title: "User Profile") do |c| %>
  #   <% c.header_actions do %>
  #     <%= Button(variant: :ghost, icon: edit_icon) { "Edit" } %>
  #   <% end %>
  #   
  #   <p>Card content here</p>
  #   
  #   <% c.footer_actions do %>
  #     <%= Button(variant: :primary) { "Save" } %>
  #   <% end %>
  # <% end %>
  # ```
  def with_actions
    render Containers::CardComponent.new(title: "User Profile") do |c|
      c.header_actions do
        button_tag(class: "p-2 text-gray-400 hover:text-gray-500 rounded-full") do
          tag.svg(
            xmlns: "http://www.w3.org/2000/svg",
            class: "h-5 w-5",
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "currentColor"
          ) do
            tag.path(
              stroke_linecap: "round",
              stroke_linejoin: "round",
              stroke_width: "2",
              d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            )
          end
        end
      end

      tag.div(class: "space-y-4") do
        safe_join([
          tag.div(class: "flex items-center space-x-4") do
            tag.div(class: "h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center") do
              tag.span("JD", class: "text-blue-600 font-medium")
            end
            tag.div do
              tag.h4("Jane Smith", class: "font-medium")
              tag.p("jane.smith@example.com", class: "text-sm text-gray-500")
            end
          end,
          tag.div(class: "space-y-2") do
            tag.p("Role: Administrator", class: "text-sm text-gray-700")
            tag.p("Department: Engineering", class: "text-sm text-gray-700")
            tag.p("Location: New York Office", class: "text-sm text-gray-700")
          end
        ])
      end

      c.footer_actions do
        tag.div(class: "flex justify-end space-x-3") do
          safe_join([
            button_tag("Cancel", type: "button", class: "px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"),
            button_tag("Save Changes", type: "button", class: "px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700")
          ])
        end
      end
    end
  end

  # @label Complex Card Layout
  #
  # @description Card with complex content layout
  def complex
    render Containers::CardComponent.new(title: "Performance Metrics") do |c|
      c.header_actions do
        tag.div(class: "flex items-center space-x-2") do
          safe_join([
            tag.span("Last 30 days", class: "text-sm text-gray-500"),
            button_tag(class: "p-1 text-gray-400 hover:text-gray-500 rounded-full") do
              tag.svg(
                xmlns: "http://www.w3.org/2000/svg",
                class: "h-5 w-5",
                fill: "none",
                viewBox: "0 0 24 24",
                stroke: "currentColor"
              ) do
                tag.path(
                  stroke_linecap: "round",
                  stroke_linejoin: "round",
                  stroke_width: "2",
                  d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                )
              end
            end
          ])
        end
      end

      tag.div(class: "space-y-6") do
        safe_join([
          tag.div(class: "grid grid-cols-3 gap-4") do
            safe_join([
              tag.div(class: "p-4 bg-blue-50 rounded-lg") do
                safe_join([
                  tag.p("Visitors", class: "text-sm text-gray-500"),
                  tag.p("12,543", class: "text-2xl font-bold text-gray-900"),
                  tag.p(class: "text-sm text-green-600") do
                    safe_join([
                      tag.span("↑ 12%"),
                      tag.span(" vs last month", class: "text-gray-500")
                    ])
                  end
                ])
              end,
              tag.div(class: "p-4 bg-green-50 rounded-lg") do
                safe_join([
                  tag.p("Conversions", class: "text-sm text-gray-500"),
                  tag.p("3,675", class: "text-2xl font-bold text-gray-900"),
                  tag.p(class: "text-sm text-green-600") do
                    safe_join([
                      tag.span("↑ 8%"),
                      tag.span(" vs last month", class: "text-gray-500")
                    ])
                  end
                ])
              end,
              tag.div(class: "p-4 bg-yellow-50 rounded-lg") do
                safe_join([
                  tag.p("Bounce Rate", class: "text-sm text-gray-500"),
                  tag.p("42%", class: "text-2xl font-bold text-gray-900"),
                  tag.p(class: "text-sm text-red-600") do
                    safe_join([
                      tag.span("↓ 3%"),
                      tag.span(" vs last month", class: "text-gray-500")
                    ])
                  end
                ])
              end
            ])
          end,
          tag.div(class: "border-t border-gray-200 pt-4") do
            tag.p("Performance has improved over the last 30 days. Conversions are up while bounce rate has decreased slightly.", class: "text-sm text-gray-600")
          end
        ])
      end

      c.footer_actions do
        tag.a("View detailed report →", href: "#", class: "text-sm text-blue-600 hover:text-blue-800")
      end
    end
  end

  # @!endgroup
end 
