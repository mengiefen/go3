# frozen_string_literal: true

class Ui::PopoverComponentPreview < ViewComponent::Preview
  # Popover with click trigger
  def click_trigger
    render Ui::PopoverComponent.new(trigger: :click, position: :bottom) do |popover|
      popover.trigger { tag.button('Click me', class: 'px-4 py-2 bg-blue-600 text-white rounded') }
      popover.panel { tag.div('Popover content (click to open)', class: 'p-4') }
    end
  end

  # Popover with hover trigger
  def hover_trigger
    render Ui::PopoverComponent.new(trigger: :hover, position: :right) do |popover|
      popover.trigger { tag.button('Hover me', class: 'px-4 py-2 bg-green-600 text-white rounded') }
      popover.panel { tag.div('Popover content (hover to open)', class: 'p-4') }
    end
  end

  # Popover with a large panel
  def large_panel
    render Ui::PopoverComponent.new(trigger: :click, position: :bottom) do |popover|
      popover.trigger { tag.button('Show Details', class: 'px-4 py-2 bg-purple-600 text-white rounded') }
      popover.panel do
        tag.div(class: 'p-6 w-80') do
          tag.h3('Popover Title', class: 'text-lg font-bold mb-2') +
          tag.p('This is a larger popover panel with more content. You can use this for menus, details, or even forms.')
        end
      end
    end
  end

  # Popover with only an icon as the trigger
  def icon_trigger
    render Ui::PopoverComponent.new(trigger: :click, position: :bottom) do |popover|
      popover.trigger do
        ApplicationController.helpers.tag.button(class: 'p-2 rounded-full hover:bg-gray-100', aria: { label: 'More' }) do
          ApplicationController.helpers.tag.svg(xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', class: 'h-5 w-5') do
            ApplicationController.helpers.tag.path(stroke_linecap: 'round', stroke_linejoin: 'round', stroke_width: 2, d: 'M12 6v6m0 0v6m0-6h6m-6 0H6')
          end
        end
      end
      popover.panel { tag.div('Icon trigger popover', class: 'p-4') }
    end
  end

  # Popover with a form inside the panel
  def form_panel
    render Ui::PopoverComponent.new(trigger: :click, position: :bottom) do |popover|
      popover.trigger { tag.button('Open Form', class: 'px-4 py-2 bg-teal-600 text-white rounded') }
      popover.panel do
        tag.form(class: 'p-4 space-y-2') do
          tag.label('Email:', for: 'email', class: 'block text-sm font-medium text-gray-700') +
          tag.input(type: 'email', id: 'email', name: 'email', class: 'block w-full border border-gray-300 rounded px-2 py-1') +
          tag.button('Submit', type: 'submit', class: 'mt-2 px-3 py-1 bg-blue-600 text-white rounded')
        end
      end
    end
  end
end 
