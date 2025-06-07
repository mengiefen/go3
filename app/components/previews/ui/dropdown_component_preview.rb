# frozen_string_literal: true

module Ui
  class DropdownComponentPreview < ViewComponent::Preview
    # @!group Positions

    # @label Bottom (Default)
    def bottom
      render(Ui::DropdownComponent.new(position: :bottom)) do |dropdown|
        dropdown.button { render_button("Dropdown (Bottom)") }
        dropdown.item { render_item("Profile", "#profile") }
        dropdown.item { render_item("Settings", "#settings") }
        dropdown.item { render_item("Sign out", "#sign-out") }
      end
    end

    # @label Top
    def top
      render(Ui::DropdownComponent.new(position: :top)) do |dropdown|
        dropdown.button { render_button("Dropdown (Top)") }
        dropdown.item { render_item("Profile", "#profile") }
        dropdown.item { render_item("Settings", "#settings") }
        dropdown.item { render_item("Sign out", "#sign-out") }
      end
    end

    # @label Left
    def left
      render(Ui::DropdownComponent.new(position: :left)) do |dropdown|
        dropdown.button { render_button("Dropdown (Left)") }
        dropdown.item { render_item("Profile", "#profile") }
        dropdown.item { render_item("Settings", "#settings") }
        dropdown.item { render_item("Sign out", "#sign-out") }
      end
    end

    # @label Right
    def right
      render(Ui::DropdownComponent.new(position: :right)) do |dropdown|
        dropdown.button { render_button("Dropdown (Right)") }
        dropdown.item { render_item("Profile", "#profile") }
        dropdown.item { render_item("Settings", "#settings") }
        dropdown.item { render_item("Sign out", "#sign-out") }
      end
    end

    # @!endgroup

    # @!group Alignment

    # @label Start-aligned (Default)
    def align_start
      render(Ui::DropdownComponent.new(align: :start)) do |dropdown|
        dropdown.button { render_button("Start-aligned") }
        dropdown.item { render_item("Profile", "#profile") }
        dropdown.item { render_item("Settings", "#settings") }
        dropdown.item { render_item("Sign out", "#sign-out") }
      end
    end

    # @label End-aligned
    def align_end
      render(Ui::DropdownComponent.new(align: :end)) do |dropdown|
        dropdown.button { render_button("End-aligned") }
        dropdown.item { render_item("Profile", "#profile") }
        dropdown.item { render_item("Settings", "#settings") }
        dropdown.item { render_item("Sign out", "#sign-out") }
      end
    end

    # @label Center-aligned
    def align_center
      render(Ui::DropdownComponent.new(align: :center)) do |dropdown|
        dropdown.button { render_button("Center-aligned") }
        dropdown.item { render_item("Profile", "#profile") }
        dropdown.item { render_item("Settings", "#settings") }
        dropdown.item { render_item("Sign out", "#sign-out") }
      end
    end

    # @!endgroup

    # @!group Width

    # @label Auto width (Default)
    def width_auto
      render(Ui::DropdownComponent.new(width: :auto)) do |dropdown|
        dropdown.button { render_button("Auto width") }
        dropdown.item { render_item("Profile", "#profile") }
        dropdown.item { render_item("Settings", "#settings") }
        dropdown.item { render_item("Sign out", "#sign-out") }
      end
    end

    # @label Full width
    def width_full
      render(Ui::DropdownComponent.new(width: :full)) do |dropdown|
        dropdown.button { render_button("Full width") }
        dropdown.item { render_item("Profile", "#profile") }
        dropdown.item { render_item("Settings", "#settings") }
        dropdown.item { render_item("Sign out", "#sign-out") }
      end
    end

    # @label Custom width
    def width_custom
      render(Ui::DropdownComponent.new(width: "300px")) do |dropdown|
        dropdown.button { render_button("Custom width (300px)") }
        dropdown.item { render_item("Profile", "#profile") }
        dropdown.item { render_item("Settings", "#settings") }
        dropdown.item { render_item("Sign out", "#sign-out") }
      end
    end

    # @!endgroup

    # @!group With Custom Elements

    # @label With custom button
    def with_custom_button
      render_with_template
    end

    # @label With dividers
    def with_dividers
      render_with_template
    end

    # @label With icons
    def with_icons
      render_with_template
    end
    
    # @label Button Text Update Test
    def button_text_update_test
      render_with_template
    end
    
    # @label Simple Button Update
    def simple_button_update
      render_with_template
    end
    
    # @label Basic Update Test
    def basic_update_test
      render_with_template
    end

    # @!endgroup
    
    # @!group Special Features
    
    # @label With Search
    def with_search
      render(Ui::DropdownComponent.new(searchable: true)) do |dropdown|
        dropdown.button { render_button("Searchable Dropdown") }
        dropdown.item { render_item("Apple", "#apple") }
        dropdown.item { render_item("Banana", "#banana") }
        dropdown.item { render_item("Cherry", "#cherry") }
        dropdown.item { render_item("Date", "#date") }
        dropdown.item { render_item("Elderberry", "#elderberry") }
        dropdown.item { render_item("Fig", "#fig") }
        dropdown.item { render_item("Grape", "#grape") }
      end
    end
    
    # @label With Button Text Update
    def with_button_text_update
      render(Ui::DropdownComponent.new(update_button_text: true)) do |dropdown|
        dropdown.button { render_button("Select an option") }
        dropdown.item { render_item("Profile", "#profile", "profile") }
        dropdown.item { render_item("Settings", "#settings", "settings") }
        dropdown.item { render_item("Sign out", "#sign-out", "sign-out") }
      end
    end
    
    # @label With Search and Button Text Update
    def with_search_and_button_text_update
      render(Ui::DropdownComponent.new(searchable: true, update_button_text: true)) do |dropdown|
        dropdown.button { render_button("Select a fruit") }
        dropdown.item { render_item("Apple", "#apple", "apple") }
        dropdown.item { render_item("Banana", "#banana", "banana") }
        dropdown.item { render_item("Cherry", "#cherry", "cherry") }
        dropdown.item { render_item("Date", "#date", "date") }
        dropdown.item { render_item("Elderberry", "#elderberry", "elderberry") }
      end
    end
    
    # @!endgroup

    private

    def render_button(text)
      tag.button(class: "inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500") do
        concat tag.span(text)
        concat tag.svg(class: "-mr-1 ml-2 h-5 w-5", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", "aria-hidden": true) do
          tag.path("fill-rule": "evenodd", d: "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z", "clip-rule": "evenodd")
        end
      end
    end

    def render_item(text, href = "#", data_value = nil)
      options = {
        href: href, 
        class: "text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100", 
        role: "menuitem"
      }
      
      options["data-value"] = data_value if data_value
      
      tag.a(text, **options)
    end
  end
end
