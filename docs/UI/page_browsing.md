# Page browsing

The idea of this page browsing system is to create a better user experience and easier navigation between pages.

We will use tabs to show opened pages and easily navigating between them without openning new tabs in browser. Similar to concept of other applications that use tabs (like google chrome and vs code).

For example assume we have a list of organizations (/organizations) opened in a tab in the main panel of the page layout. then we want to open the organization page of an organization (/organizations/1), in this case we will open a new tab but users can still go to the previous tab and open a new organization page (/organizations/2). They can even open another page from menu like user settings page (users/settings/edit).

We will have only one active tab at each time unless there is no open tab. when an active tab is closed the tab that was active before that should become active. The URL of the active tab should be show in the browser URL so people can share or bookmark it.

This is going to be the default system but users can still disable it in the user settings page and have only one page without tab that occupies the entire main panel in the layout. In this case instead of showing list of tabs at the top we only show the full title of the page. we may need a boolean field in the users table for this.

In the mobile view we do not have tabbing system and we will have only one page.

While a content of a new page is being loaded that style should be descriptive like the blue spinning circle in browsers.

All tabs should have a title and close button, when the title is too long by hovering on the title we should see the entire title in a tooltip.

We should also have controls to close all tabs, close all but current tab, and close all tabs to the right or left(in rtl view).

When leving a tab and coming back to it the state of the page including unsaved data and scroll height should be preserved.

When using back button on the browser it should go to the previous active tab.

Tabs should be reorderable by drag and drop.

The style of tab should be creative and modern, consider all state (active, inactive, loading, hovering, etc)

# Action plan

> **Summary**
> You’ll scaffold a **TabsComponent** (ViewComponent) to render the tab bar and frame containers, backed by a **Stimulus** controller that:
>
> 1. Manages the tabs array (open, close, reorder, activate) in memory.
> 2. Shows/hides `<div>` contents to preserve state (no unload).
> 3. Uses **Turbo Frames** for lazy loading content.
> 4. Calls `history.pushState`/`Turbo.visit()` to sync URLs.
> 5. Integrates **SortableJS** (via `stimulus-sortable`) for drag‑and‑drop reordering.
> 6. Exposes “close all”, “close others”, etc., through controller actions.
> 7. Reads a `use_tabbed_navigation` flag on the User model to toggle the entire system.
> 8. Falls back to single‑page view on mobile via CSS media queries.

---

## 1. Architecture & Core Components

### 1.1 ViewComponent for Tabs Bar

Build a **`TabsComponent`** that:

- Renders the list of open tabs (titles + close icons)
- Wraps each tab’s content in a `<div data-tab-id="…">` container
- Outputs a `<turbo-frame>` wrapper if you want per‑tab lazy loading
- Reads `current_user.use_tabbed_navigation` to decide between tabbed vs full‑page layouts

Use the official ViewComponent gem for this:

> ViewComponent is a mature, actively‑maintained framework for encapsulating view logic in Rails apps ([GitHub][1], [ViewComponent][2]).

### 1.2 Stimulus Controller for Tab Logic

Create a **`tabs_controller.js`** under `app/javascript/controllers/` that:

- Keeps an array of `{ id, title, url, element }` for each open tab
- Provides actions: `open`, `activate`, `close`, `closeOthers`, `closeAll`, `closeLeft`, `closeRight`
- Uses `this.showTab(id)` / `this.hideTab(id)` to toggle visibility rather than removing nodes (preserves state)
- On `activate`, calls `Turbo.visit(url)` to update the browser’s URL + history ([Hotwire Discussion][3]).

---

## 2. Tab Content Loading & State Preservation

### 2.1 Turbo Frames for Lazy Loading

Wrap each new tab’s content in a `<turbo-frame id="tab_<id>" src="<url>">…</turbo-frame>`.

- The first time a tab opens, Turbo fetches the frame via AJAX; subsequent activations simply show the cached frame.
- Use `data-action="turbo:frame-load->tabs#onFrameLoad"` if you need to hook into load events ([Stack Overflow][4]).

### 2.2 Keeping Inactive Tabs In‑DOM

By **hiding** (`.hidden`/`display: none`) inactive tab containers rather than removing them, you automatically preserve:

- **Scroll position**
- **Form inputs / unsaved data**
- **Stimulus controller state**
  This mirrors how VS Code/Chrome keep background tabs alive ([Colby.so][5]).

---

## 3. URL & Browser History Integration

- **Activating** a tab → `Turbo.visit(tab.url)` (updates history, address bar).
- **Closing** an active tab → call `history.back()` or manually `pushState` to previous tab’s URL.
- Listen for `popstate` to re‑activate the correct tab in your Stimulus controller.

---

## 4. Drag‑and‑Drop Reordering

Integrate **SortableJS** via the Stimulus wrapper **`stimulus-sortable`**:

1. Add `yarn add sortablejs stimulus-sortable`
2. In your `tabs_controller.js`, import and initialize Sortable on the `<ul>` tab list ([stimulus-components.com][6], [Medium][7]).
3. On `sortable:update`, reorder your internal `tabs` array and re‑render or re‑append `<li>` elements to reflect the new order.

---

## 5. Close‑Controls (Bulk Actions)

In your Tabs Stimulus controller, implement:

- **`closeAll`**: iterate and close every tab
- **`closeOthers(currentId)`**: close all except `currentId`
- **`closeLeft` / `closeRight`**: use the index of `currentId` in the `tabs` array to close all with lower/higher indexes

Wire these to UI dropdown buttons in the component.

---

## 6. User‑Configurable Toggle & Mobile Fallback

- Add a boolean `use_tabbed_navigation` to your `users` table (migration + model).
- In your `application.html.erb` layout, conditionally render either:

  - The **TabsComponent** (when `true`)
  - A **single full‑page** component with just `yield` (when `false`)

- For **mobile**, use a CSS media query (or Rails device detection gem) to disable tabs entirely and show only the active frame full‑width.

---

## 7. Testing & Monitoring

- **System tests** (Capybara + Selenium): open/close/reorder tabs, bookmark/share URLs, back/forward behavior.
- **Stimulus controller unit tests** (Jest or similar) for internal tab‑array logic.
- **Performance**: cap maximum open tabs or lazy‑destroy older tabs if memory grows too large.

---

## 8. Additional Resources & References

| Topic                                  | Link                                                                                                                                                                     |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Turbo Frames & Drive Handbook          | [https://turbo.hotwired.dev/](https://turbo.hotwired.dev/)                                                                                                               |
| Stimulus Handbook                      | [https://stimulus.hotwired.dev/](https://stimulus.hotwired.dev/)                                                                                                         |
| ViewComponent Official Docs            | [https://viewcomponent.org/](https://viewcomponent.org/) ([ViewComponent][2])                                                                                            |
| stimulus-sortable (SortableJS wrapper) | [https://www.stimulus-components.com/docs/stimulus-sortable/](https://www.stimulus-components.com/docs/stimulus-sortable/) ([stimulus-components.com][6])                |
| Turbo Frame Events in Stimulus         | [https://stackoverflow.com/q/79028401](https://stackoverflow.com/q/79028401) ([Stack Overflow][4])                                                                       |
| Tabbed Interface Example               | [https://colby.so/posts/remotely-loading-tab-content-with-rails-and-hotwire](https://colby.so/posts/remotely-loading-tab-content-with-rails-and-hotwire) ([Colby.so][5]) |

---

By following this plan, you’ll leverage **Hotwire’s Turbo** for navigation speed, **Stimulus** for all the client‑side logic, and **ViewComponent** for clean, testable view code—while keeping your implementation maintainable and performant. Let me know if you’d like scaffolding snippets, deeper dive into any step, or help wiring up the Stimulus tests!

[1]: https://github.com/ViewComponent/view_component?utm_source=chatgpt.com 'ViewComponent/view_component: A framework for ... - GitHub'
[2]: https://viewcomponent.org/?utm_source=chatgpt.com 'ViewComponent: Overview'
[3]: https://discuss.hotwired.dev/t/how-do-i-use-turbo-frames-to-create-tab-navigation/1820?utm_source=chatgpt.com 'How do I use turbo frames to create tab navigation?'

[4]: https://stackoverflow.com/questions/79028401/how-do-i-use-the-turboframe-load-event-with-hotwire-and-stimulus-in-rails?utm_source=chatgpt.com "How do I use the \"turbo:frame-load\" event with Hotwire and Stimulus ..."
[5]: https://colby.so/posts/remotely-loading-tab-content-with-rails-and-hotwire?utm_source=chatgpt.com "Remotely loading tabbed content with Ruby on Rails and Hotwire"
[6]: https://www.stimulus-components.com/docs/stimulus-sortable/?utm_source=chatgpt.com "Sortable | Stimulus Components"
[7]: https://medium.com/%40tomas.valent/drag-and-drop-sortable-items-with-sortablejs-and-stimulusjs-rails-7-afa9ca465f78?utm_source=chatgpt.com "Drag and Drop sortable items with SortableJS and StimulusJS Rails 7"
