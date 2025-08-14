# Page Layout 

Main page layout is the very top level component that contains all other components in it. 

## Desktop Mode
In desktop mode we have:
- A header at the top
- A side panel (at left by default, or at right for RTL languages)
- A main content panel

The side panel is expandable/collapsible and resizable by drag and drop with configurable minimum and maximum width. When collapsed, the side panel remains visible but with a narrow width, showing only icons.

The side panel includes a toggle button inside it for expanding and collapsing. All icons use Font Awesome for consistent styling.

Side panel and main panel are scrollable separately and not together, providing independent scrolling experiences.

## Mobile Mode
In mobile mode:
- The side panel is hidden by default and can be opened by clicking a hamburger menu button in the header
- The header is accessible only when scrolling to the top (not fixed)

## RTL Support
The component has built-in RTL (Right-to-Left) support:
- In RTL mode, the side panel is positioned on the right
- The toggle button direction and resize handle position are automatically adjusted for RTL

## Usage
The component is implemented using Stimulus controllers:
- collapsible-panel controller: Handles the expand/collapse functionality
- resizable-panel controller: Handles the resize functionality

The component saves the panel's expanded/collapsed state and width to localStorage for persistence between page visits. 

