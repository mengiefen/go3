# UI Component Preview Issues (Header & Popover)

## Context

- The previews for both the Header and Popover components are not displaying any content.
- Files reviewed:
  - `app/components/ui/popover_component.html.erb`
  - `app/components/ui/header_component.html.erb`
  - `app/components/ui/header_component.rb`

---

## 1. PopoverComponent (`popover_component.html.erb`)

### **Current Implementation**

```erb
<div
  id="<%= id %>"
  class="relative inline-block bg-red-500"
  data-controller="popover"
  data-popover-trigger-type-value="<%= trigger_type %>"
>
  <div
    data-action="<%= trigger_type == :hover ? 'mouseenter->popover#open mouseleave->popover#close' : 'click->popover#toggle' %>"
    data-popover-target="trigger"
    aria-haspopup="true"
    aria-expanded="false"
    tabindex="0"
  >
    <%= trigger %>
  </div>
  <div
    class="hidden absolute z-20 <%= popover_position_classes %> min-w-[200px] rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
    data-popover-target="panel"
    role="dialog"
    aria-modal="false"
    tabindex="-1"
  >
    <%= panel %>
  </div>
</div>
```

### **Possible Issues**

- The `trigger` and `panel` slots may not be set or rendered in the preview, or may be `nil`.
- If the preview uses the wrong constant or does not use `render` for the component, nothing will be rendered.
- The `bg-red-500` class is present for debugging but does not affect slot rendering.
- If the preview is not passing blocks for `trigger` and `panel`, the slots will be empty.
- If the ViewComponent version is old or slot syntax is incorrect, slots may not render.

### **Possible Solutions**

- Double-check that the preview uses the correct `Ui::PopoverComponent` constant and passes both `trigger` and `panel` blocks.
- Ensure the preview uses `render` for all components.
- Add fallback content or error messages in the ERB for easier debugging (e.g., `<%= trigger || 'No trigger slot' %>`).
- Confirm the ViewComponent version supports `renders_one` slots as used.

---

## 2. HeaderComponent (`header_component.html.erb`, `header_component.rb`)

### **Current Implementation**

- `header_component.html.erb` uses:
  ```erb
  <% if logo %> ... <%= logo %> ... <% end %>
  <% if search %> ... <%= search %> ... <% end %>
  <% if notification %> ... <%= notification %> ... <% end %>
  <% if profile %> ... <%= profile %> ... <% end %>
  ```
- `header_component.rb` uses `renders_one` for all slots.

### **Possible Issues**

- If the preview uses the wrong constant for any slot component (e.g., `UI::SearchInputComponent` instead of `Ui::SearchInputComponent`), the slot will be empty.
- If the preview does not use `render` for slot components, nothing will be rendered.
- If the slot blocks are not passed, the slot will be empty.
- If a slot component raises an error, it may prevent the rest of the header from rendering.
- If the ViewComponent version is old or slot syntax is incorrect, slots may not render.

### **Possible Solutions**

- Double-check all slot component references in the preview for correct casing and usage of `render`.
- Add fallback content in the ERB for easier debugging (e.g., `<%= logo || 'No logo slot' %>`).
- Confirm the ViewComponent version supports `renders_one` as used.
- Add logging or debugging output in the preview to confirm slot blocks are being executed.

---

## **Next Steps for Debugging**

1. **Check all preview files for correct constant names and use of `render`.**
2. **Add fallback content in the ERB templates for slots to visually debug missing content.**
3. **Check the ViewComponent version and slot syntax compatibility.**
4. **Add logging or temporary output in previews to confirm slot blocks are being executed.**
5. **If issues persist, create minimal test previews for each slot/component to isolate the problem.**

---

_Documented for next-day debugging and resolution._
