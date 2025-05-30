# ✅ Component Library Development Plan (Rails 8 + ViewComponent + Tailwind 4)

This plan helps you build a reusable, maintainable, and interactive UI library **using AI assistance** to generate the code, and preview it in a Rails app.

---

## 🔧 Base Setup

- [ ] Setup Tailwind CSS 4 (with `config/tailwind.config.js`)
- [ ] Install and configure `ViewComponent` gem
- [ ] Install `Stimulus` via Rails 8 importmap/bundler
- [ ] Create a folder structure:

---

## Folder Structure

```
app/
├── components/
│   └── ui/
│       ├── button_component.rb
│       └── button_component.html.erb
├── views/
│   └── ui_library/
│       └── button.html.erb
previews/
└── ui/
    └── button_component_preview.rb

app/javascript/
└── controllers/
    ├── index.js                # auto-loads all controllers
    └── button_controller.js    # your custom controller
```

---

## 📦 Core Components (All Built with AI Help)

### Typography & Layout

- [ ] `Ui::HeadingComponent` — `<h1>` to `<h6>` with props
- [ ] `Ui::TextComponent` — paragraphs, muted, bold, small
- [ ] `Ui::CardComponent` — with slot-based header/body/footer
- [ ] `Ui::ContainerComponent` — for page layout spacing

---

### Navigation

- [ ] `Ui::NavbarComponent`
- [ ] `Ui::SidebarComponent`
- [ ] `Ui::BreadcrumbsComponent`
- [ ] `Ui::TabsComponent` (with Stimulus interactivity)

---

### Inputs & Forms

- [ ] `Ui::InputComponent`
- [ ] `Ui::TextareaComponent`
- [ ] `Ui::SelectComponent`
- [ ] `Ui::CheckboxComponent`
- [ ] `Ui::RadioGroupComponent`
- [ ] `Ui::SwitchComponent` (animated)

---

### Buttons

- [ ] `Ui::ButtonComponent` (variants: primary, secondary, danger, disabled, loading)
- [ ] `Ui::IconButtonComponent`
- [ ] `Ui::DropdownButtonComponent` (w/ Stimulus toggle)

---

### Feedback

- [ ] `Ui::AlertComponent` (info, success, warning, error)
- [ ] `Ui::ToastComponent` (auto-dismiss, stimulus-driven)
- [ ] `Ui::TooltipComponent`
- [ ] `Ui::ProgressBarComponent`
- [ ] `Ui::SpinnerComponent`

---

### Modals

- [ ] `Ui::ModalComponent` (w/ Stimulus: open/close, focus trap)
- [ ] `Ui::DialogComponent` (for confirmation modals)
- [ ] `Ui::DrawerComponent` (slide-in panel)

---

### Tables

- [ ] `Ui::TableComponent`
- [ ] `Ui::TableRowComponent`
- [ ] `Ui::DataTableComponent` (sortable headers via Stimulus)

---

### Utility

- [ ] `Ui::AvatarComponent`
- [ ] `Ui::BadgeComponent`
- [ ] `Ui::TagComponent`
- [ ] `Ui::DividerComponent`
- [ ] `Ui::IconComponent` (use `heroicons` or similar)

---

## 🧪 Previews and Documentation

- [ ] Create a custom preview engine or use `rails/view_components` path
- [ ] Create one preview file per component under `previews/ui/`
- [ ] Include:
  - Props/slots variations
  - Code samples (highlighted)
  - Live demos (interactive if applicable)
- [ ] Use `layout: false` for isolated component testing

---

## ✨ Interactivity via Stimulus

Attach a `Stimulus` controller to each interactive component:

- [ ] `tabs_controller.js` – switches tab panel
- [ ] `dropdown_controller.js` – show/hide menu
- [ ] `modal_controller.js` – open/close modal
- [ ] `toast_controller.js` – auto-dismiss
- [ ] `switch_controller.js` – toggles state
- [ ] `accordion_controller.js` – collapsible sections

---

## 🤖 Using AI to Generate Each Component

### For each component:

- [ ] Ask AI for Tailwind markup and possible variants
- [ ] Paste into ViewComponent Ruby file + `template`
- [ ] Extract configurable options as keyword arguments
- [ ] Add `preview` showing:
  - Normal
  - Disabled
  - Loading
  - With/without icon
  - Responsive examples

### Prompt Examples:

- “Generate a tailwind-styled modal dialog with open/close behavior”
- “Make a Rails ViewComponent for a toggle switch using stimulus”
- “Show how to build a tabbed interface with Tailwind and Stimulus”
- “Add ARIA attributes to make it accessible”

---

## 📚 Optional Additions

- [ ] Dark mode support
- [ ] Form validation message support
- [ ] ARIA roles and accessibility features
- [ ] Storybook-like page for browsing all components (custom `/ui-library` route)

---

## 🚀 Deployment Tips

- [ ] Host on `/rails/view_components` or custom `/ui-library`
- [ ] Automatically load all previews
- [ ] Add CI checks for component previews
- [ ] Use `Lookbook` gem if you want structured preview support later

```

```

## Preview Example

```ruby
# app/components/ui/button_component.rb
class Ui::ButtonComponent < ViewComponent::Base
  def initialize(label:, variant: :primary, size: :md, disabled: false)
    @label = label
    @variant = variant
    @size = size
    @disabled = disabled
  end

  def call
    content_tag(:button, class: button_classes, disabled: @disabled) do
      @label
    end
  end

  private

  def button_classes
    classes = "btn btn-#{@variant} btn-#{@size}"
    classes += " disabled" if @disabled
    classes
  end
end
```

```erb
<!-- app/components/ui/button_component.html.erb -->
<button class="<%= button_classes %>" <%= 'disabled' if @disabled %>>
  <%= @label %>
</button>
```

```ruby
# previews/ui/button_component_preview.rb
```
