# frozen_string_literal: true

class Ui::HeaderComponentPreview < ViewComponent::Preview
  def default
    render Ui::HeaderComponent.new do |header|
      header.logo do
        tag.div(class: "flex items-center") do
          tag.svg(class: "h-8 w-auto text-indigo-600", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke_width: 1.5, stroke: "currentColor") do
            tag.path(stroke_linecap: "round", stroke_linejoin: "round", d: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z")
          end
        end
      end
      header.search do
        render Ui::SearchInputComponent.new(placeholder: "Search...", name: "q")
      end
      header.notification do
        render Ui::DropdownComponent.new(id: "notif-dropdown", position: :bottom, width: :auto, align: :end) do |dropdown|
          dropdown.button do
            tag.button(class: "relative p-2 text-gray-500 hover:text-gray-700 focus:outline-none", aria: { label: "Notifications" }) do
              tag.svg(class: "h-6 w-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg") do
                tag.path(stroke_linecap: "round", stroke_linejoin: "round", stroke_width: 2, d: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9")
              end
              tag.span(class: "absolute top-0 right-0 inline-flex items-center justify-center px-1 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full", style: "font-size: 0.7rem;") { "3" }
            end
          end
          dropdown.item { tag.div(class: "px-4 py-2 text-sm text-gray-700") { "No new notifications" } }
        end
      end
      header.profile do
        render Ui::PopoverComponent.new(trigger: :click, position: :bottom) do |popover|
          popover.trigger do
            tag.button(class: "flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2", aria: { label: "Open user menu" }) do
              tag.span(class: "sr-only") { "Open user menu" } +
              tag.div(class: "h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white") { "A" }
            end
          end
          popover.panel do
            tag.div(class: "py-1") do
              tag.a("Your Profile", href: "#", class: "block px-4 py-2 text-sm text-gray-700") +
              tag.a("Account Settings", href: "#", class: "block px-4 py-2 text-sm text-gray-700") +
              tag.a("Sign out", href: "#", class: "block px-4 py-2 text-sm text-gray-700")
            end
          end
        end
      end
    end
  end

  # Header with only logo
  def logo_only
    render Ui::HeaderComponent.new do |header|
      header.logo do
        tag.div(class: "flex items-center") do
          tag.svg(class: "h-8 w-auto text-indigo-600", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke_width: 1.5, stroke: "currentColor") do
            tag.path(stroke_linecap: "round", stroke_linejoin: "round", d: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z")
          end
        end
      end
    end
  end

  # Header with logo and search
  def logo_and_search
    render Ui::HeaderComponent.new do |header|
      header.logo do
        tag.div(class: "flex items-center") do
          tag.svg(class: "h-8 w-auto text-indigo-600", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke_width: 1.5, stroke: "currentColor") do
            tag.path(stroke_linecap: "round", stroke_linejoin: "round", d: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z")
          end
        end
      end
      header.search do
        render Ui::SearchInputComponent.new(placeholder: "Search...", name: "q")
      end
    end
  end

  # Header with all slots (logo, search, notification, profile)
  def full
    render Ui::HeaderComponent.new do |header|
      header.logo do
        tag.div(class: "flex items-center") do
          tag.svg(class: "h-8 w-auto text-indigo-600", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke_width: 1.5, stroke: "currentColor") do
            tag.path(stroke_linecap: "round", stroke_linejoin: "round", d: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z")
          end
        end
      end
      header.search do
        render Ui::SearchInputComponent.new(placeholder: "Search...", name: "q")
      end
      header.notification do
        render Ui::DropdownComponent.new(id: "notif-dropdown", position: :bottom, width: :auto, align: :end) do |dropdown|
          dropdown.button do
            tag.button(class: "relative p-2 text-gray-500 hover:text-gray-700 focus:outline-none", aria: { label: "Notifications" }) do
              tag.svg(class: "h-6 w-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg") do
                tag.path(stroke_linecap: "round", stroke_linejoin: "round", stroke_width: 2, d: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9")
              end
              tag.span(class: "absolute top-0 right-0 inline-flex items-center justify-center px-1 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full", style: "font-size: 0.7rem;") { "3" }
            end
          end
          dropdown.item { tag.div(class: "px-4 py-2 text-sm text-gray-700") { "No new notifications" } }
        end
      end
      header.profile do
        render Ui::PopoverComponent.new(trigger: :click, position: :bottom) do |popover|
          popover.trigger do
            tag.button(class: "flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2", aria: { label: "Open user menu" }) do
              tag.span(class: "sr-only") { "Open user menu" } +
              tag.div(class: "h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white") { "A" }
            end
          end
          popover.panel do
            tag.div(class: "py-1") do
              tag.a("Your Profile", href: "#", class: "block px-4 py-2 text-sm text-gray-700") +
              tag.a("Account Settings", href: "#", class: "block px-4 py-2 text-sm text-gray-700") +
              tag.a("Sign out", href: "#", class: "block px-4 py-2 text-sm text-gray-700")
            end
          end
        end
      end
    end
  end
end 
