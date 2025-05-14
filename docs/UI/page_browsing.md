# Page browsing
The idea of this page browsing system is to create a better user experience and easier navigation between pages. 

We will use tabs to show opened pages and easily navigating between them without openning new tabs in browser. Similar to concept of other applications that use tabs (like google chrome and vs code). 

For example assume we have a list of organizations (/organizations) opened in a tab in the main panel of the pafe layout. then we want to open the organization page of an organization (/organizations/1), in this case we will open a new tab but users can still go to the previous tab and open a new organization page (/organizations/2). They can even open another page from menu like user settings page (users/settings/edit). 

We will have only one active tab at each time unless there is no open tab. when an active tab is closed the tab that was active before that should become active. The URL of the active tab should be showb in the browser URL so people can share or bookmark it. 

This is going to be the default system but users can still disable it in the user settings page and have only one page without tab that occupies the entire main panel in the layout. In this case instead of showing list of tabs at the top we only show the full title of the page. we may need a boolean field in the users table for this.

In the mobile view we do not have tabbing system and we will have only one page. 

While a content of a new page is being loaded that style should be descriptive like the blue spinning circle in browsers. 

All tabs should have a title and close button, when the title is too long by hovering on the title we should see the entire title in a tooltip. 

We should also have controls to close all tabs, close all but xurrent tab, and close all tabs to the right or left(in rtl view). 

When leving a tab and coming back to it the state of the page including unsaved data and scroll height should be preserved. 

When using back button on the browser it should go to the previous active tab.

Tabs should be reorderable by drag and drop. 

The style of tab should be creative and modern, consider all state (active, inactive, loading, hovering, etc)