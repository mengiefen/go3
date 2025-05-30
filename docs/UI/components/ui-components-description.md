# GO3 UI Components Specification with Rails ViewComponent, Tailwind CSS and Hotwire

## Overview

This document describes the UI components to be used in the GO3 Organization Management interface. All components are built using Ruby on Rails ViewComponent, Tailwind CSS, and Hotwire (Stimulus, Turbo Frames, Turbo Streams). These components follow the established UX guidelines with strict adherence to the color palette and design principles. The components are designed to be reusable, accessible, and optimized for 2025 UI/UX standards.

## Technology Stack

- **ViewComponent**: For component-based architecture and encapsulation
- **Tailwind CSS v4**: For styling through utility classes
- **Stimulus.js**: For JavaScript behavior in components
- **Turbo**: For navigation and form submission without full page reloads
  - Turbo Frames: For partial page updates
  - Turbo Streams: For real-time updates
  - Turbo Drive: For accelerated navigation between pages

## Design System Foundations

### Color Palette

- **Primary**: #006DB3 (blue) - Use for primary actions, current tabs, links, selected items
- **Info**: #36AEFC (lighter blue) - Use for informational elements, success states
- **Default**: Gray variants - Use for secondary actions, cancel buttons, back buttons
- **Warning**: #ffcc00 (gold/yellow) - Use for attention-grabbing elements, warnings
- **Danger**: #ff4100 (red) - Use for dangerous actions, critical errors
- **Background**: #F3F5F7 (very light blue) - Main page background
- **Panel Background**: White (light mode) / #2A3142 (dark mode)
- **Dark Mode Background**: #1E2233 (dark blue)

### Typography

- **Font Family**: System UI font stack with fallbacks
- **Scale**:
  - Heading 1: 24px/1.2, 600 weight (page titles)
  - Heading 2: 20px/1.3, 600 weight (section headers)
  - Heading 3: 16px/1.4, 600 weight (card titles)
  - Body: 14px/1.5, 400 weight (main text)
  - Small: 12px/1.5, 400 weight (auxiliary text)
- **Hierarchy**: Maintain consistent font weights and sizes throughout
- **Line Height**: 1.5 for body text, 1.2-1.4 for headings

### Spacing System

- Based on 4px unit scale: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px
- Consistent spacing between related elements
- Inner padding of containers: minimum 16px
- Content separation: 24px between major sections
- Form field spacing: 16px between fields

### Layout Principles

- **Grid-Based Layout**: 12-column grid for main layout
- **Flex For Alignment**: Use within grid cells for element alignment
- **Full Page Utilization**: Layouts fill 100% of available space
- **Contained Scrolling**: Page doesn't scroll; content areas within the layout scroll

## ViewComponent Implementation Guidelines

### Component Organization

Components should be organized in a hierarchical structure in the `app/components` directory:

```
app/components/
├── ui/                  # Basic UI components (buttons, inputs, etc.)
├── containers/          # Layout components (cards, panels, etc.)
├── data_display/        # Components for data rendering (tables, lists)
├── feedback/            # Notification components (alerts, toasts)
├── forms/               # Form-related components
└── specialized/         # Domain-specific components
```

### Component Structure

Each component should follow this structure:

1. **Ruby Class** (`app/components/ui/button_component.rb`):

   - Define initialization parameters with keyword arguments
   - Include necessary logic and helper methods
   - Use private methods for internal functionality

2. **Template** (`app/components/ui/button_component.html.erb`):

   - Keep minimal logic in templates
   - Use Tailwind CSS classes for styling
   - Implement ARIA attributes for accessibility

3. **Stimulus Controller** (when needed):

   - Place in `app/javascript/controllers` directory
   - Follow Stimulus controller naming conventions
   - Use private methods for internal functionality

4. **Preview** (`app/components/previews/ui/button_component_preview.rb`):

   - Include examples of all component variants
   - Document usage patterns
   - Show different states (enabled, disabled, loading, etc.)

5. **Tests** (`spec/components/ui/button_component_spec.rb`):
   - Test rendering with different parameters
   - Test conditional logic
   - Verify accessibility attributes

### Tailwind CSS Best Practices

1. **Use `class_names` helper for conditional classes**:

   ```ruby
   class_names(
     "rounded-md px-4 py-2 text-sm font-medium",
     {
       "bg-blue-600 text-white hover:bg-blue-700": variant == :primary,
       "bg-white border border-gray-300 text-gray-700": variant == :secondary,
       "opacity-50 cursor-not-allowed": disabled
     }
   )
   ```

2. **Create custom Tailwind variants for Turbo**:

   ```javascript
   // tailwind.config.js
   module.exports = {
     // ...
     plugins: [
       function ({ addVariant }) {
         addVariant('turbo-frame', 'turbo-frame[src] &');
       },
     ],
   };
   ```

3. **Use data attributes for Stimulus integration**:

   ```erb
   <div class="group/navigation">
     <ul class="hidden group-data-show-menu/navigation:block">
       <!-- menu items -->
     </ul>
   </div>
   ```

4. **Add micro-interaction delays for better UX**:
   ```html
   <li class="transition duration-200 delay-75 hover:bg-gray-50">Item</li>
   ```

## Component Specifications

### 1. Layout Components

#### PageLayout Component

```
┌─────────────────────────────────────────────────────────────┐
│ Header                                                      │
├─────────────┬───────────────────────────────────────────────┤
│             │                                               │
│  SidePanel  │                 MainContent                   │
│             │                                               │
│             │                                               │
│             │                                               │
│             │                                               │
│             │                                               │
└─────────────┴───────────────────────────────────────────────┘
```

**Ruby Class**:

```ruby
# app/components/containers/page_layout_component.rb
class Containers::PageLayoutComponent < ViewComponent::Base
  renders_one :header
  renders_one :side_panel
  renders_one :main_content

  def initialize(show_side_panel: true)
    @show_side_panel = show_side_panel
  end
end
```

**Template**:

```erb
<%# app/components/containers/page_layout_component.html.erb %>
<div class="flex h-screen flex-col">
  <header class="bg-white border-b border-gray-200 z-10">
    <%= header %>
  </header>

  <div class="flex flex-1 overflow-hidden">
    <% if @show_side_panel %>
      <aside data-controller="resizable-panel" class="w-72 overflow-y-auto border-r border-gray-200 bg-white">
        <%= side_panel %>
      </aside>
    <% end %>

    <main class="flex-1 overflow-y-auto bg-gray-50 p-6">
      <%= main_content %>
    </main>
  </div>
</div>
```

**Usage**:

```erb
<%= render Containers::PageLayoutComponent.new do |c| %>
  <% c.header do %>
    <%= render HeaderComponent.new(title: "Organization Management") %>
  <% end %>

  <% c.side_panel do %>
    <%= render SidePanelComponent.new %>
  <% end %>

  <% c.main_content do %>
    <h1>Main Content</h1>
    <!-- Page content -->
  <% end %>
<% end %>
```

#### Card Component

```
┌─────────────────────────────────────────┐
│ [Title]                         [⋮]     │
│ ─────────────────────────────────────── │
│                                         │
│                Content                  │
│                                         │
│                                         │
│ ─────────────────────────────────────── │
│ [Footer Actions]                        │
└─────────────────────────────────────────┘
```

**Ruby Class**:

```ruby
# app/components/containers/card_component.rb
class Containers::CardComponent < ViewComponent::Base
  renders_one :header_actions
  renders_one :footer_actions

  def initialize(title: nil, variant: :default)
    @title = title
    @variant = variant
  end

  def card_classes
    class_names(
      "rounded-lg overflow-hidden",
      {
        "bg-white border border-gray-200 shadow-sm": @variant == :default,
        "bg-white border-2 border-blue-500": @variant == :highlighted,
        "bg-gray-50 border border-gray-300": @variant == :secondary
      }
    )
  end
end
```

**Template**:

```erb
<%# app/components/containers/card_component.html.erb %>
<div class="<%= card_classes %>">
  <% if @title || header_actions? %>
    <div class="px-4 py-3 flex items-center justify-between border-b border-gray-200">
      <% if @title %>
        <h3 class="text-base font-semibold text-gray-900"><%= @title %></h3>
      <% end %>
      <% if header_actions? %>
        <div class="flex items-center space-x-2">
          <%= header_actions %>
        </div>
      <% end %>
    </div>
  <% end %>

  <div class="px-4 py-4">
    <%= content %>
  </div>

  <% if footer_actions? %>
    <div class="px-4 py-3 bg-gray-50 border-t border-gray-200">
      <%= footer_actions %>
    </div>
  <% end %>
</div>
```

### 2. Input & Form Components

#### SearchInput Component

```
┌───────────────────────────────────────┐
│                               🔍 🎙️    │
└───────────────────────────────────────┘
```

**Ruby Class**:

```ruby
# app/components/ui/search_input_component.rb
class UI::SearchInputComponent < ViewComponent::Base
  def initialize(
    placeholder: "Search...",
    name: "q",
    value: nil,
    show_voice_input: true,
    html_options: {}
  )
    @placeholder = placeholder
    @name = name
    @value = value
    @show_voice_input = show_voice_input
    @html_options = html_options
  end
end
```

**Template**:

```erb
<%# app/components/ui/search_input_component.html.erb %>
<div data-controller="search-input" class="relative">
  <input
    type="text"
    name="<%= @name %>"
    value="<%= @value %>"
    placeholder="<%= @placeholder %>"
    class="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
    data-action="input->search-input#debounce"
    data-search-input-target="input"
    <%= tag.attributes(@html_options) %>
  >
  <div class="absolute inset-y-0 right-0 flex items-center pr-3">
    <button type="button" class="text-gray-400 hover:text-gray-600" data-action="click->search-input#clear">
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-search-input-target="clearButton">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>
    <% if @show_voice_input %>
      <button type="button" class="ml-1 text-gray-400 hover:text-gray-600" data-action="click->search-input#startVoiceInput">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
        </svg>
      </button>
    <% end %>
  </div>
</div>
```

**Stimulus Controller**:

```javascript
// app/javascript/controllers/search_input_controller.js
import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ['input', 'clearButton'];

  connect() {
    this.toggleClearButton();
  }

  debounce() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.submit();
    }, 300);

    this.toggleClearButton();
  }

  clear() {
    this.inputTarget.value = '';
    this.inputTarget.focus();
    this.toggleClearButton();
    this.submit();
  }

  startVoiceInput() {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice recognition is not supported in your browser.');
      return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      this.inputTarget.value = transcript;
      this.toggleClearButton();
      this.submit();
    };

    recognition.start();
  }

  submit() {
    this.element.closest('form')?.requestSubmit();
  }

  toggleClearButton() {
    if (this.hasClearButtonTarget) {
      this.clearButtonTarget.classList.toggle('hidden', !this.inputTarget.value);
    }
  }
}
```

### 3. Data Display Components

#### TreeView Component

```
┌──────────────────────────────────────────────────────────┐
│ ▼ Parent Item                                     [⋮]    │
│   │                                                      │
│   ├─ ▶ Child Item 1                              [⋮]    │
│   │                                                      │
│   └─ ▼ Child Item 2                              [⋮]    │
│       │                                                  │
│       └─ ▶ Grandchild Item                       [⋮]    │
└──────────────────────────────────────────────────────────┘
```

**Ruby Class**:

```ruby
# app/components/data_display/tree_view_component.rb
class DataDisplay::TreeViewComponent < ViewComponent::Base
  renders_many :nodes, "NodeComponent"

  def initialize(show_connectors: true)
    @show_connectors = show_connectors
  end

  # Node component definition
  class NodeComponent < ViewComponent::Base
    renders_many :nodes, "DataDisplay::TreeViewComponent::NodeComponent"
    renders_one :actions

    def initialize(id:, label:, expanded: false)
      @id = id
      @label = label
      @expanded = expanded
    end
  end
end
```

**Template**:

```erb
<%# app/components/data_display/tree_view_component.html.erb %>
<div class="tree-view" data-controller="tree-view">
  <ul class="space-y-1">
    <% nodes.each do |node| %>
      <%= node %>
    <% end %>
  </ul>
</div>
```

**Node Template**:

```erb
<%# app/components/data_display/tree_view_component/node_component.html.erb %>
<li class="relative" data-tree-view-target="node" data-id="<%= @id %>">
  <div class="flex items-center">
    <% if nodes.any? %>
      <button type="button"
              class="mr-1 h-5 w-5 flex items-center justify-center text-gray-400 hover:text-gray-500"
              data-tree-view-target="toggle"
              data-action="click->tree-view#toggleNode">
        <% if @expanded %>
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        <% else %>
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        <% end %>
      </button>
    <% else %>
      <div class="mr-1 w-5"></div>
    <% end %>

    <span class="flex-1 truncate"><%= @label %></span>

    <% if actions? %>
      <div class="ml-4">
        <%= actions %>
      </div>
    <% end %>
  </div>

  <% if nodes.any? %>
    <ul class="ml-6 mt-1 <%= 'hidden' unless @expanded %>"
        data-tree-view-target="children">
      <% nodes.each do |node| %>
        <%= node %>
      <% end %>
    </ul>
  <% end %>
</li>
```

**Stimulus Controller**:

```javascript
// app/javascript/controllers/tree_view_controller.js
import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ['node', 'toggle', 'children'];

  toggleNode(event) {
    const toggle = event.currentTarget;
    const node = toggle.closest("[data-tree-view-target='node']");
    const children = node.querySelector("[data-tree-view-target='children']");

    if (children) {
      children.classList.toggle('hidden');

      // Update the toggle icon
      const isExpanded = !children.classList.contains('hidden');
      toggle.innerHTML = isExpanded
        ? '<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>'
        : '<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>';

      // Save expanded state
      this.saveExpandedState(node.dataset.id, isExpanded);
    }
  }

  // Private methods

  #saveExpandedState(nodeId, isExpanded) {
    const storageKey = 'treeView-expandedNodes';
    let expandedNodes = JSON.parse(localStorage.getItem(storageKey) || '{}');

    expandedNodes[nodeId] = isExpanded;
    localStorage.setItem(storageKey, JSON.stringify(expandedNodes));
  }
}
```

### 4. Action Components

#### Button Component

```
┌────────────────┐
│ [Icon] Label   │
└────────────────┘
```

**Ruby Class**:

```ruby
# app/components/ui/button_component.rb
class UI::ButtonComponent < ViewComponent::Base
  def initialize(
    variant: :primary,
    size: :md,
    type: :button,
    icon: nil,
    icon_position: :left,
    disabled: false,
    loading: false,
    full_width: false,
    html_options: {}
  )
    @variant = variant
    @size = size
    @type = type
    @icon = icon
    @icon_position = icon_position
    @disabled = disabled
    @loading = loading
    @full_width = full_width
    @html_options = html_options
  end

  def button_classes
    class_names(
      "inline-flex items-center justify-center font-medium rounded-md",
      size_classes,
      variant_classes,
      {
        "w-full": @full_width,
        "opacity-50 cursor-not-allowed": @disabled || @loading
      }
    )
  end

  private

  def size_classes
    {
      sm: "px-2.5 py-1.5 text-xs",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base"
    }[@size]
  end

  def variant_classes
    {
      primary: "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
      secondary: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
      danger: "bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500",
      ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    }[@variant]
  end
end
```

**Template**:

```erb
<%# app/components/ui/button_component.html.erb %>
<button
  type="<%= @type %>"
  class="<%= button_classes %>"
  <%= "disabled" if @disabled || @loading %>
  <%= tag.attributes(@html_options) %>
>
  <% if @loading %>
    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 <%= @icon_position == :left ? '' : 'order-2 ml-2 -mr-1' %>" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  <% elsif @icon && @icon_position == :left %>
    <span class="mr-2"><%= @icon %></span>
  <% end %>

  <%= content %>

  <% if @icon && @icon_position == :right && !@loading %>
    <span class="ml-2"><%= @icon %></span>
  <% end %>
</button>
```

### 5. Specialized Components

#### Modal Component (with Turbo Frame)

**Ruby Class**:

```ruby
# app/components/feedback/modal_component.rb
class Feedback::ModalComponent < ViewComponent::Base
  renders_one :header
  renders_one :footer

  def initialize(id: "modal", size: :md)
    @id = id
    @size = size
  end

  def size_classes
    {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      full: "max-w-4xl"
    }[@size] || "max-w-md"
  end
end
```

**Template**:

```erb
<%# app/components/feedback/modal_component.html.erb %>
<turbo-frame id="<%= @id %>">
  <div
    data-controller="modal"
    data-action="turbo:submit-end->modal#hideOnSubmit keydown.esc->modal#hide"
    class="fixed inset-0 z-50 overflow-y-auto"
    role="dialog"
    tabindex="-1"
    aria-modal="true"
  >
    <!-- Backdrop -->
    <div
      class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
      data-action="click->modal#hide"
    ></div>

    <!-- Modal panel -->
    <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
      <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full <%= size_classes %>">
        <!-- Close button -->
        <div class="absolute top-0 right-0 pt-4 pr-4 block">
          <button
            type="button"
            class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            data-action="modal#hide"
          >
            <span class="sr-only">Close</span>
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Header (optional) -->
        <% if header? %>
          <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <%= header %>
            </div>
          </div>
        <% end %>

        <!-- Body -->
        <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <%= content %>
        </div>

        <!-- Footer (optional) -->
        <% if footer? %>
          <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <%= footer %>
          </div>
        <% end %>
      </div>
    </div>
  </div>
</turbo-frame>
```

**Stimulus Controller**:

```javascript
// app/javascript/controllers/modal_controller.js
import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  connect() {
    this.element.focus();
    document.body.classList.add('overflow-hidden');
  }

  disconnect() {
    document.body.classList.remove('overflow-hidden');
    this.#modalTurboFrame.src = null;
  }

  hide(event) {
    event.preventDefault();
    this.element.remove();
  }

  hideOnSubmit(event) {
    if (event.detail.success) {
      this.hide(event);
    }
  }

  // Private

  get #modalTurboFrame() {
    return document.querySelector(`turbo-frame#${this.element.closest('turbo-frame').id}`);
  }
}
```

## Utility Helpers

Create a set of helper methods to simplify component rendering:

```ruby
# app/helpers/component_helper.rb
module ComponentHelper
  def ui_button(**options, &block)
    render UI::ButtonComponent.new(**options), &block
  end

  def ui_card(**options, &block)
    render Containers::CardComponent.new(**options), &block
  end

  def ui_search(**options)
    render UI::SearchInputComponent.new(**options)
  end

  def ui_modal(**options, &block)
    render Feedback::ModalComponent.new(**options), &block
  end

  # More component helpers...
end
```

## Testing Components

Each component should have corresponding tests:

```ruby
# spec/components/ui/button_component_spec.rb
require "rails_helper"

RSpec.describe UI::ButtonComponent, type: :component do
  it "renders a primary button by default" do
    render_inline(described_class.new) { "Click me" }

    expect(page).to have_css("button[type='button']", text: "Click me")
    expect(page).to have_css("button.bg-blue-600.text-white")
  end

  it "renders a secondary button" do
    render_inline(described_class.new(variant: :secondary)) { "Click me" }

    expect(page).to have_css("button.bg-white.border-gray-300")
  end

  it "renders a disabled button" do
    render_inline(described_class.new(disabled: true)) { "Click me" }

    expect(page).to have_css("button[disabled]")
    expect(page).to have_css("button.opacity-50.cursor-not-allowed")
  end

  it "renders a loading button" do
    render_inline(described_class.new(loading: true)) { "Click me" }

    expect(page).to have_css("button[disabled]")
    expect(page).to have_css("button svg.animate-spin")
    expect(page).to have_text("Click me")
  end
end
```

## Component Previews with Lookbook

Use Lookbook for component documentation and previews:

```ruby
# app/components/previews/ui/button_component_preview.rb
class UI::ButtonComponentPreview < ViewComponent::Preview
  # @!group Variants

  # @label Primary
  def primary
    render UI::ButtonComponent.new(variant: :primary) do
      "Primary Button"
    end
  end

  # @label Secondary
  def secondary
    render UI::ButtonComponent.new(variant: :secondary) do
      "Secondary Button"
    end
  end

  # @label Danger
  def danger
    render UI::ButtonComponent.new(variant: :danger) do
      "Danger Button"
    end
  end

  # @!endgroup

  # @!group Sizes

  # @label Small
  def small
    render UI::ButtonComponent.new(size: :sm) do
      "Small Button"
    end
  end

  # @label Medium
  def medium
    render UI::ButtonComponent.new(size: :md) do
      "Medium Button"
    end
  end

  # @label Large
  def large
    render UI::ButtonComponent.new(size: :lg) do
      "Large Button"
    end
  end

  # @!endgroup

  # @!group States

  # @label Disabled
  def disabled
    render UI::ButtonComponent.new(disabled: true) do
      "Disabled Button"
    end
  end

  # @label Loading
  def loading
    render UI::ButtonComponent.new(loading: true) do
      "Loading Button"
    end
  end

  # @!endgroup
end
```

## Accessibility Guidelines

All components must adhere to these accessibility standards:

1. **Keyboard Navigation**: All interactive elements must be usable with keyboard only
2. **Screen Reader Support**: Appropriate ARIA roles, labels, and states
3. **Focus Management**: Visible focus indicators that follow the tab order
4. **Color Contrast**: Minimum 4.5:1 contrast ratio for text, 3:1 for UI elements
5. **Reduced Motion**: Respect user's motion preference settings
6. **Text Sizing**: Support for text resizing up to 200% without loss of functionality
7. **Alternative Text**: For all non-decorative images and icons
8. **Error Identification**: Clear error messages and form validation

## Responsive Design

Components should adapt to these breakpoints:

- **Mobile**: < 768px
- **Tablet**: 768px - 1199px
- **Desktop**: 1200px+

Each component should have specific responsive behaviors documented, including:

- Layout changes at different breakpoints
- Touch-optimized interactions for mobile
- Simplified views for smaller screens
- Adaptive font sizes and spacing

## Micro-interactions

Subtle animations and feedback should be used to enhance the user experience:

- **Hover States**: Gentle scaling or color change (0.2s transition)
- **Loading States**: Skeleton loaders instead of spinners where possible
- **Transitions**: 0.2-0.3s duration for most transitions
- **Feedback**: Visual confirmation for user actions
- **Focus Rings**: Customized focus indicators that match design language
- **Form Input**: Interactive validation with real-time feedback

## Implementation Notes

- Use ViewComponent for all UI components
- Implement Tailwind CSS for styling through utility classes
- Create reusable Stimulus controllers for interactive behaviors
- Use Turbo Frames for modal dialogs and partial page updates
- Implement Turbo Streams for real-time updates
- Follow Hotwire best practices for SPA-like experiences
- Ensure all components have comprehensive tests and previews

---

This documentation should be treated as a living specification that evolves with the application's needs. All components should follow these guidelines and be built with ViewComponent, Tailwind CSS, and Hotwire technologies to create a consistent, accessible, and modern user interface.
