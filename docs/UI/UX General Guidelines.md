- When there are no other specific directives, create components with UI and UX choices that match the rest of the app, and replicate choices made elsewhere.

- When there are no other specific directives or no alternative, use pre-built components in place of creating new ones.

- User interactions should minimize the number of steps to completion.

- Dangerous or irreversible user interactions should always include a warning dialog describing the action taken, the consequences of the action, and to get confirmation of the action.

- Prefer intuitive controls over written descriptions. The more intuitive the interface, the less we have to describe or train users or add informational text descriptions. 

- Colors should restricted to only globally defined color pallets and should stay consistent in use across the system.

  - Primary (#006DB3 blue): Current tabs, primary action/buttons, links, and other selected/primary items. 

  - Info (#36AEFC blue): Important informational pieces, successful operations

  - Default (grey): Unimportant actions, cancel buttons, back buttons

  - Warning (#ffcc00 gold/yellow): Important actions or info that should immediately draw the user’s immediate attention, errors.

  - Danger (#ff4100 red): Dangerous actions (removing important data irreversibly), catastrophic information

  - Body background (#F3F5F7 very light blue)

  - Panel background (white)

- Use Grid for layout and Flex for alignment. All page layouts should up 100% of the page and not scroll, with no scrollbar (Scrolling content should be inside panes in the layout).

- Pages should include a responsive layout for desktop and mobile responsiveness unless intentionally omitted from mobile use. 

