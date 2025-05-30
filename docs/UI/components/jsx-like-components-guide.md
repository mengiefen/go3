# JSX-like ViewComponent Guide for GO3

This guide outlines how to create and use ViewComponents in a React JSX-like style, making the transition between React and Rails ViewComponents more intuitive for developers familiar with both ecosystems.

## Table of Contents

1. [Introduction](#introduction)
2. [Component Helper Methods](#component-helper-methods)
3. [Content Areas for Composition](#content-areas-for-composition)
4. [Combining Both Approaches](#combining-both-approaches)
5. [Implementation Guide](#implementation-guide)
6. [Advanced Techniques](#advanced-techniques)

## Introduction

Rails ViewComponent provides a component-based approach to building UIs, similar to React. While the syntax differs, we can create patterns that make ViewComponents feel more like JSX components.

This guide focuses on two main approaches:

1. **Component Helper Methods**: Creating PascalCase helper methods to invoke components
2. **Content Areas**: Using ViewComponent's content areas for composition patterns similar to React

## Component Helper Methods

### The Problem

Standard ViewComponent rendering can be verbose:

```erb
<%= render UI::ButtonComponent.new(variant: :primary, size: :md) do %>
  Click Me
<% end %>
```

This differs significantly from React's JSX:

```jsx
<Button variant="primary" size="md">
  Click Me
</Button>
```

### The Solution

Create helper methods with PascalCase names that render components:

```ruby
# app/helpers/component_helper.rb
module ComponentHelper
  def Button(props = {}, &block)
    render UI::ButtonComponent.new(**props), &block
  end

  def Card(props = {}, &block)
    render Containers::CardComponent.new(**props), &block
  end

  def SearchInput(props = {})
    render UI::SearchInputComponent.new(**props)
  end

  def TreeView(props = {}, &block)
    render DataDisplay::TreeViewComponent.new(**props), &block
  end

  def Modal(props = {}, &block)
    render Feedback::ModalComponent.new(**props), &block
  end

  # Add methods for all your components...
end
```

### Usage Examples

With these helpers, component usage becomes more declarative:

#### Button Component

```erb
<%# Traditional ViewComponent syntax %>
<%= render UI::ButtonComponent.new(variant: :primary, size: :md, disabled: false) do %>
  Click Me
<% end %>

<%# JSX-like syntax %>
<%= Button(variant: :primary, size: :md, disabled: false) do %>
  Click Me
<% end %>
```

#### Card Component

```erb
<%# Traditional ViewComponent syntax %>
<%= render Containers::CardComponent.new(title: "User Profile") do %>
  <p>Card content here</p>
<% end %>

<%# JSX-like syntax %>
<%= Card(title: "User Profile") do %>
  <p>Card content here</p>
<% end %>
```

#### Search Input Component

```erb
<%# Traditional ViewComponent syntax %>
<%= render UI::SearchInputComponent.new(placeholder: "Search orders...", name: "q") %>

<%# JSX-like syntax %>
<%= SearchInput(placeholder: "Search orders...", name: "q") %>
```

### Benefits

1. **Cleaner Templates**: Reduces boilerplate code
2. **Familiar Syntax**: Feels more like React JSX
3. **Improved Readability**: PascalCase clearly indicates components

## Content Areas for Composition

### The Problem

In React, you can nest components in a hierarchical way:

```jsx
<Layout>
  <Layout.Header>
    <Navbar />
  </Layout.Header>
  <Layout.Sidebar>
    <Menu />
  </Layout.Sidebar>
  <Layout.Content>
    <Dashboard />
  </Layout.Content>
</Layout>
```

Standard ViewComponent doesn't natively support this pattern.

### The Solution

ViewComponent's content areas allow for similar component composition patterns:

```ruby
# app/components/containers/page_layout_component.rb
class Containers::PageLayoutComponent < ViewComponent::Base
  renders_one :header
  renders_one :sidebar
  renders_one :content

  # Component implementation...
end
```

### Usage Examples

#### Page Layout Component

```erb
<%# Traditional ViewComponent with content areas %>
<%= render Containers::PageLayoutComponent.new do |c| %>
  <% c.header do %>
    <%= render UI::NavbarComponent.new %>
  <% end %>

  <% c.sidebar do %>
    <%= render UI::MenuComponent.new(items: menu_items) %>
  <% end %>

  <% c.content do %>
    <%= render Containers::DashboardComponent.new %>
  <% end %>
<% end %>
```

#### Card with Header Actions and Footer

```erb
<%# Traditional ViewComponent with content areas %>
<%= render Containers::CardComponent.new(title: "User Profile") do |c| %>
  <% c.header_actions do %>
    <%= render UI::ButtonComponent.new(variant: :ghost, icon: edit_icon) do %>
      Edit
    <% end %>
  <% end %>

  <p>User information here...</p>

  <% c.footer_actions do %>
    <%= render UI::ButtonComponent.new(variant: :primary) do %>
      Save Changes
    <% end %>
  <% end %>
<% end %>
```

### Benefits

1. **Structured Composition**: Clear relationship between parent and child components
2. **Semantic Markup**: Content is placed in specific, meaningful areas
3. **Flexible Design**: Components can be composed in various ways

## Combining Both Approaches

The real power comes from combining both approaches:

```erb
<%= PageLayout do |c| %>
  <% c.header do %>
    <%= Navbar(user: current_user) %>
  <% end %>

  <% c.sidebar do %>
    <%= Menu(items: sidebar_items) %>
  <% end %>

  <% c.content do %>
    <%= Card(title: "Dashboard") do |card| %>
      <% card.header_actions do %>
        <%= Button(variant: :ghost, icon: refresh_icon) do %>
          Refresh
        <% end %>
      <% end %>

      <p>Dashboard content here...</p>

      <% card.footer_actions do %>
        <%= Button(variant: :primary) do %>
          View Details
        <% end %>
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

This creates a cleaner, more React-like syntax while maintaining Rails conventions.

## Implementation Guide

### Step 1: Create the Component Helper Module

```ruby
# app/helpers/component_helper.rb
module ComponentHelper
  # Helper methods for layout components
  def PageLayout(props = {}, &block)
    render Containers::PageLayoutComponent.new(**props), &block
  end

  def Card(props = {}, &block)
    render Containers::CardComponent.new(**props), &block
  end

  # Helper methods for UI components
  def Button(props = {}, &block)
    render UI::ButtonComponent.new(**props), &block
  end

  def SearchInput(props = {})
    render UI::SearchInputComponent.new(**props)
  end

  def TreeView(props = {}, &block)
    render DataDisplay::TreeViewComponent.new(**props), &block
  end

  # Helper methods for feedback components
  def Modal(props = {}, &block)
    render Feedback::ModalComponent.new(**props), &block
  end

  def Toast(props = {})
    render Feedback::ToastComponent.new(**props)
  end

  # Add more helper methods as needed...
end
```

### Step 2: Include the Helper in Your Controllers or Views

```ruby
# app/controllers/application_controller.rb
class ApplicationController < ActionController::Base
  helper ComponentHelper
end
```

### Step 3: Design Components with Content Areas

When designing components, consider which parts might need to be customizable and add content areas accordingly:

```ruby
# app/components/containers/card_component.rb
class Containers::CardComponent < ViewComponent::Base
  renders_one :header_actions
  renders_one :footer_actions

  def initialize(title: nil, variant: :default)
    @title = title
    @variant = variant
  end

  # Rest of component implementation...
end
```

### Step 4: Document Component APIs with JSX-like Examples

In your component documentation or previews, include JSX-like examples:

````ruby
# app/components/previews/containers/card_component_preview.rb
class Containers::CardComponentPreview < ViewComponent::Preview
  # @!group Examples

  # @label Basic Card
  #
  # JSX-like usage:
  # ```erb
  # <%= Card(title: "User Profile") do %>
  #   <p>Card content here</p>
  # <% end %>
  # ```
  def basic
    render Containers::CardComponent.new(title: "User Profile") do
      tag.p "Card content here"
    end
  end

  # @label Card with Actions
  #
  # JSX-like usage:
  # ```erb
  # <%= Card(title: "User Profile") do |c| %>
  #   <% c.header_actions do %>
  #     <%= Button(variant: :ghost) { "Edit" } %>
  #   <% end %>
  #   <p>Card content here</p>
  # <% end %>
  # ```
  def with_actions
    render Containers::CardComponent.new(title: "User Profile") do |c|
      c.header_actions { tag.button "Edit", class: "..." }
      tag.p "Card content here"
    end
  end

  # @!endgroup
end
````

## Advanced Techniques

### Dynamic Component Resolution

For even more flexibility, you can create a generic component helper:

```ruby
# app/helpers/component_helper.rb
module ComponentHelper
  # Original component helpers...

  # Dynamic component resolver
  def Component(name, props = {}, &block)
    component_class = resolve_component_class(name)
    render component_class.new(**props), &block
  end

  private

  def resolve_component_class(name)
    # Convert snake_case or camelCase to PascalCase
    class_name = name.to_s.camelize

    # Try to find the component in common namespaces
    namespaces = ["UI", "Containers", "DataDisplay", "Feedback"]

    namespaces.each do |namespace|
      begin
        return "#{namespace}::#{class_name}Component".constantize
      rescue NameError
        next
      end
    end

    # Try without namespace
    begin
      return "#{class_name}Component".constantize
    rescue NameError
      raise "Could not find component: #{name}"
    end
  end
end
```

Usage:

```erb
<%= Component(:button, { variant: :primary }) do %>
  Click Me
<% end %>

<%= Component(:card, { title: "Profile" }) do %>
  Card content
<% end %>
```

### Components with HTML Options

Add support for HTML attributes in a React-like way:

```ruby
# app/helpers/component_helper.rb
module ComponentHelper
  def Button(props = {}, html_options = {}, &block)
    # Extract known props for the component
    component_props = props.slice(:variant, :size, :disabled, :loading)

    # Merge remaining props into html_options
    html_attrs = props.except(*component_props.keys).merge(html_options)

    # Add html_options to component props
    component_props[:html_options] = html_attrs unless html_attrs.empty?

    render UI::ButtonComponent.new(**component_props), &block
  end

  # More component methods...
end
```

This allows for syntax like:

```erb
<%= Button(
  variant: :primary,
  id: "save-button",
  data: { controller: "tooltip", action: "click->form#submit" }
) do %>
  Save
<% end %>
```

### Handling Event Handlers

While ViewComponent doesn't support passing event handlers directly, you can adopt a convention using Stimulus:

```erb
<%= Button(
  variant: :primary,
  data: { action: "click->form#submit" }
) do %>
  Submit
<% end %>
```

## Summary

This JSX-like ViewComponent approach combines the best of both worlds:

1. The simplicity and familiarity of React's JSX syntax
2. The power and server-rendered nature of Rails ViewComponents
3. The structure and composition patterns of modern component-based UIs

By using component helper methods and content areas, your Rails templates will be:

- More declarative
- Easier to read
- More maintainable
- More intuitive for developers coming from React

This approach is especially valuable for teams working with both React and Rails codebases, providing a more consistent developer experience across platforms.
