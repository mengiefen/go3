import { Controller } from "@hotwired/stimulus";
import Sortable from "sortablejs";

// Connects to data-controller="page-tabs"
export default class extends Controller {
  static targets = ["tabsList", "tab", "content", "frame"];
  static values = {
    currentPath: String,
    tabs: { type: Array, default: [] },
  };

  connect() {
    this.tabsValue = JSON.parse(localStorage.getItem("pageTabs") || "[]");
    this.initSortable();
    this.restoreTabs();
    
    // Listen for browser popstate event (back/forward buttons)
    window.addEventListener("popstate", this.handlePopState.bind(this));
    
    // Listen for link clicks to intercept navigation
    document.addEventListener("click", this.handleLinkClick.bind(this));
    
    // Listen for tab frame load
    this.frameTarget.addEventListener("turbo:frame-load", this.handleFrameLoad.bind(this));
  }
  
  disconnect() {
    window.removeEventListener("popstate", this.handlePopState);
    document.removeEventListener("click", this.handleLinkClick);
    if (this.hasFrameTarget) {
      this.frameTarget.removeEventListener("turbo:frame-load", this.handleFrameLoad);
    }
  }
  
  // Initialize the sortable.js library for drag-and-drop tab reordering
  initSortable() {
    if (this.hasTabsListTarget) {
      this.sortable = new Sortable(this.tabsListTarget, {
        animation: 150,
        draggable: ".page-tab",
        onEnd: this.handleTabReorder.bind(this)
      });
    }
  }
  
  // Restore tabs from localStorage
  restoreTabs() {
    // Clear existing tabs first
    this.tabsListTarget.innerHTML = "";
    
    if (this.tabsValue.length === 0) {
      // If no tabs, open the current page as a tab
      this.openTab(document.title, this.currentPathValue);
      return;
    }
    
    // Restore all tabs from storage
    this.tabsValue.forEach(tab => {
      const tabElement = this.createTabElement(tab.title, tab.path, tab.id);
      this.tabsListTarget.appendChild(tabElement);
    });
    
    // Activate the tab matching current path
    const activeTab = this.tabsValue.find(tab => tab.path === this.currentPathValue);
    if (activeTab) {
      this.activateTabById(activeTab.id);
    } else {
      // If no matching tab, open the current page as a new tab
      this.openTab(document.title, this.currentPathValue);
    }
  }
  
  // Handle browser back/forward buttons
  handlePopState(event) {
    const path = window.location.pathname + window.location.search;
    const tab = this.tabsValue.find(tab => tab.path === path);
    
    if (tab) {
      this.activateTabById(tab.id, false); // Don't push state again
    } else {
      this.openTab(document.title, path, false); // Don't push state again
    }
  }
  
  // Intercept link clicks to open in tabs
  handleLinkClick(event) {
    // Skip if the user doesn't want tabbed navigation
    if (!document.body.classList.contains('tabbed-navigation')) return;
    
    // Only intercept internal links that aren't in our tab bar
    const link = event.target.closest('a');
    if (!link) return;
    
    // Skip if the link has data-turbo="false" or is a download
    if (link.getAttribute('data-turbo') === 'false' || link.hasAttribute('download')) return;
    
    // Skip external links, anchor links, or links with target
    const url = new URL(link.href, window.location.origin);
    if (
      url.origin !== window.location.origin ||
      url.pathname === window.location.pathname && url.hash ||
      link.target
    ) return;
    
    // Skip links inside the tab bar
    if (this.tabsListTarget.contains(link)) return;
    
    // At this point, we have a valid internal link, so prevent default and handle it
    event.preventDefault();
    
    // Get the page title - best effort from link text or current document title
    const title = link.textContent.trim() || document.title;
    
    // Check if this path is already open in a tab
    const path = url.pathname + url.search;
    const existingTab = this.tabsValue.find(tab => tab.path === path);
    
    if (existingTab) {
      this.activateTabById(existingTab.id);
    } else {
      this.openTab(title, path);
    }
  }
  
  // Handle the frame content loading
  handleFrameLoad(event) {
    // Update the title of the current tab based on the loaded page
    const pageTitle = document.title;
    const activeTabId = this.getActiveTab()?.id;
    
    if (activeTabId) {
      const tabIndex = this.tabsValue.findIndex(tab => tab.id === activeTabId);
      if (tabIndex !== -1) {
        this.tabsValue[tabIndex].title = pageTitle;
        this.persistTabs();
        
        // Update the title in the DOM
        const tabElement = this.tabTargets.find(t => t.dataset.id === activeTabId);
        if (tabElement) {
          const titleSpan = tabElement.querySelector('.tab-title');
          if (titleSpan) titleSpan.textContent = pageTitle;
        }
      }
    }
  }
  
  // Handler for tab reordering via drag and drop
  handleTabReorder(event) {
    // Get the new order of tabs
    const tabElements = Array.from(this.tabTargets);
    const newTabsValue = tabElements.map(tab => {
      const id = tab.dataset.id;
      return this.tabsValue.find(t => t.id === id);
    });
    
    this.tabsValue = newTabsValue;
    this.persistTabs();
  }
  
  // Activate a tab when clicked
  activate(event) {
    const tab = event.currentTarget;
    const tabId = tab.dataset.id;
    this.activateTabById(tabId);
  }
  
  // Activate a tab by its ID
  activateTabById(id, pushState = true) {
    const tab = this.tabsValue.find(t => t.id === id);
    if (!tab) return;
    
    // Update the active tab in the DOM
    this.tabTargets.forEach(t => {
      t.classList.toggle('active', t.dataset.id === id);
    });
    
    // Update the frame source
    this.frameTarget.src = tab.path;
    
    // Update the browser URL if needed
    if (pushState) {
      history.pushState({}, "", tab.path);
    }
    
    // Update tab data
    this.tabsValue.forEach(t => {
      t.active = t.id === id;
    });
    
    this.persistTabs();
  }
  
  // Close a tab
  closeTab(event) {
    event.stopPropagation(); // Don't activate the tab when closing
    
    const tab = event.currentTarget.closest('.page-tab');
    const tabId = tab.dataset.id;
    
    // Find the tab index
    const tabIndex = this.tabsValue.findIndex(t => t.id === tabId);
    if (tabIndex === -1) return;
    
    // Check if it's the active tab
    const isActive = this.tabsValue[tabIndex].active;
    
    // Remove the tab
    this.tabsValue.splice(tabIndex, 1);
    tab.remove();
    
    // If we closed the active tab, activate another one
    if (isActive && this.tabsValue.length > 0) {
      // Activate the tab that was active before this one, or the next one, or the last one
      const newTabIndex = Math.min(tabIndex, this.tabsValue.length - 1);
      this.activateTabById(this.tabsValue[newTabIndex].id);
    }
    
    // If we closed the last tab, go to the home page
    if (this.tabsValue.length === 0) {
      visit("/");
    }
    
    this.persistTabs();
  }
  
  // Close all tabs
  closeAll() {
    this.tabsValue = [];
    this.tabsListTarget.innerHTML = "";
    this.persistTabs();
    visit("/");
  }
  
  // Close all tabs except the active one
  closeOthers() {
    const activeTab = this.getActiveTab();
    if (!activeTab) return;
    
    this.tabsValue = [activeTab];
    this.tabsListTarget.innerHTML = "";
    
    const tabElement = this.createTabElement(activeTab.title, activeTab.path, activeTab.id);
    this.tabsListTarget.appendChild(tabElement);
    this.persistTabs();
  }
  
  // Close tabs to the right of the active tab
  closeRight() {
    const activeTab = this.getActiveTab();
    if (!activeTab) return;
    
    const activeIndex = this.tabsValue.findIndex(t => t.id === activeTab.id);
    if (activeIndex === -1) return;
    
    // Remove tabs to the right
    this.tabsValue = this.tabsValue.slice(0, activeIndex + 1);
    
    // Update the DOM
    this.tabTargets.forEach((tab, index) => {
      if (index > activeIndex) {
        tab.remove();
      }
    });
    
    this.persistTabs();
  }
  
  // Close tabs to the left of the active tab
  closeLeft() {
    const activeTab = this.getActiveTab();
    if (!activeTab) return;
    
    const activeIndex = this.tabsValue.findIndex(t => t.id === activeTab.id);
    if (activeIndex === -1) return;
    
    // Remove tabs to the left
    this.tabsValue = this.tabsValue.slice(activeIndex);
    
    // Update the DOM
    this.tabTargets.forEach((tab, index) => {
      if (index < activeIndex) {
        tab.remove();
      }
    });
    
    this.persistTabs();
  }
  
  // Open a new tab with the given title and path
  openTab(title, path, pushState = true) {
    // Generate a unique ID for the tab
    const id = `tab-${Date.now()}`;
    
    // Create the tab data
    const tab = { id, title, path, active: true };
    
    // Deactivate all existing tabs
    this.tabsValue.forEach(t => {
      t.active = false;
    });
    
    // Add the new tab
    this.tabsValue.push(tab);
    
    // Create and add the tab element
    const tabElement = this.createTabElement(title, path, id);
    this.tabsListTarget.appendChild(tabElement);
    
    // Update all tab elements to reflect the active state
    this.tabTargets.forEach(t => {
      t.classList.toggle('active', t.dataset.id === id);
    });
    
    // Update the frame source
    this.frameTarget.src = path;
    
    // Update the browser URL if needed
    if (pushState) {
      history.pushState({}, "", path);
    }
    
    this.persistTabs();
  }
  
  // Helper to create a tab element
  createTabElement(title, path, id) {
    const tab = document.createElement('div');
    tab.className = 'page-tab';
    tab.dataset.id = id;
    tab.dataset.path = path;
    tab.dataset.pageTabsTarget = 'tab';
    tab.dataset.action = 'click->page-tabs#activate';
    
    const titleSpan = document.createElement('span');
    titleSpan.className = 'tab-title';
    titleSpan.textContent = title;
    tab.appendChild(titleSpan);
    
    const closeButton = document.createElement('button');
    closeButton.className = 'close-tab';
    closeButton.dataset.action = 'click->page-tabs#closeTab';
    
    const closeIcon = document.createElement('i');
    closeIcon.className = 'fas fa-times';
    closeButton.appendChild(closeIcon);
    
    tab.appendChild(closeButton);
    
    return tab;
  }
  
  // Get the currently active tab
  getActiveTab() {
    return this.tabsValue.find(tab => tab.active);
  }
  
  // Persist tabs to localStorage
  persistTabs() {
    localStorage.setItem("pageTabs", JSON.stringify(this.tabsValue));
  }
} 