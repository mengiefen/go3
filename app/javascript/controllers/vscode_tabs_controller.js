import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ['tabBar', 'contentAreas', 'tab', 'content', 'noTabsIndicator', 'tabActions'];

  connect() {
    console.log('VSCode Tabs Controller connected');
    console.log('Available targets:', this.targets);
    console.log('Content areas element check:', document.getElementById('tab-content-areas'));
    
    this.openTabs = new Map(); // Store open tabs
    this.restoreTabsFromStorage();
  }

  hideWelcomeMessage() {
    // Hide the "No tabs open" indicator
    if (this.hasNoTabsIndicatorTarget) {
      this.noTabsIndicatorTarget.classList.add('hidden');
    }

    // Show tab actions
    if (this.hasTabActionsTarget) {
      this.tabActionsTarget.style.display = 'flex';
    }

    // Hide the welcome message
    const welcomeMessage = document.getElementById('welcome-message');
    if (welcomeMessage) {
      welcomeMessage.classList.add('hidden');
    }
  }

  showWelcomeMessage() {
    // Show the "No tabs open" indicator
    if (this.hasNoTabsIndicatorTarget) {
      this.noTabsIndicatorTarget.classList.remove('hidden');
    }

    // Hide tab actions
    if (this.hasTabActionsTarget) {
      this.tabActionsTarget.style.display = 'none';
    }

    // Show the welcome message
    const welcomeMessage = document.getElementById('welcome-message');
    if (welcomeMessage) {
      welcomeMessage.classList.remove('hidden');
    }
  }

  focusTab(event) {
    let tabId;

    if (typeof event === 'string') {
      // Called programmatically with tabId
      tabId = event;
    } else {
      // Called from click event
      event.stopPropagation();
      tabId = event.currentTarget.dataset.tabId;
    }

    this.setActiveTab(tabId);
  }

  // Method to activate a tab when its content is loaded
  activateLoadedTab(event) {
    const tabId = event.target.dataset.loadedTabId;
    if (tabId) {
      this.setActiveTab(tabId);
    }
  }

  // Save tabs to localStorage
  saveTabsToStorage() {
    const tabsData = Array.from(this.openTabs.entries()).map(([tabId, tabInfo]) => ({
      tabId,
      name: tabInfo.name,
      active: tabInfo.active,
    }));
    localStorage.setItem('openTabs', JSON.stringify(tabsData));
  }

  // Restore tabs from localStorage
  restoreTabsFromStorage() {
    const savedTabs = localStorage.getItem('openTabs');
    if (savedTabs) {
      try {
        const tabsData = JSON.parse(savedTabs);
        let activeTabId = null;

        tabsData.forEach((tabData) => {
          // Only restore tabs that we can actually recreate
          if (this.canRestoreTab(tabData.tabId)) {
            this.addTab(tabData.tabId, tabData.name);
            // Load the content for restored task tabs
            this.loadRestoredTabContent(tabData.tabId);
            if (tabData.active) {
              activeTabId = tabData.tabId;
            }
          }
        });

        // Activate the previously active tab if it exists
        if (activeTabId && this.openTabs.has(activeTabId)) {
          // Delay activation to ensure content is loaded
          setTimeout(() => {
            this.setActiveTab(activeTabId);
          }, 100);
        }
      } catch (error) {
        console.error('Error restoring tabs from localStorage:', error);
        localStorage.removeItem('openTabs');
      }
    }
  }

  // Load content for a restored tab
  loadRestoredTabContent(tabId) {
    if (tabId.startsWith('tab-tasks-')) {
      // Parse task tab ID to get filter info
      const parts = tabId.split('-');
      if (parts.length >= 4) {
        const filterType = parts[2]; // e.g., 'category'
        const filterValue = parts[3]; // e.g., 'development'

        // Find the tab name from openTabs
        const tabInfo = this.openTabs.get(tabId);
        const tabName = tabInfo ? tabInfo.name : `${filterType} ${filterValue}`;

        const url = `/tasks/content/${filterType}/${filterValue}?content_name=${encodeURIComponent(tabName)}&frame_id=frame-${tabId}`;

        // Create turbo frame for restored tab content
        const contentContainer = document.getElementById(tabId);
        if (contentContainer) {
          const turboFrame = document.createElement('turbo-frame');
          turboFrame.id = `frame-${tabId}`;
          turboFrame.src = url;
          turboFrame.dataset.turboFrameRequestsFormat = 'html';
          contentContainer.appendChild(turboFrame);
        }
      }
    }
  }

  // Check if we can restore a tab based on its ID format
  canRestoreTab(tabId) {
    // Only restore task tabs for now, as they don't require server-side content
    return tabId.startsWith('tab-tasks-');
  }

  // Generate unique tab ID to support multiple instances
  generateUniqueTabId(contentType, contentId) {
    return `tab-${contentType}-${contentId}-${Date.now()}`;
  }

  // Override addTab to save state
  addTab(tabId, tabName) {
    // Don't add if tab already exists
    if (this.openTabs.has(tabId)) {
      return;
    }

    // Create the tab content container first
    this.createTabContentContainer(tabId);

    // Hide welcome message and "No tabs open" indicator when first tab is added
    if (this.openTabs.size === 0) {
      this.hideWelcomeMessage();
    }

    // Create tab element
    const tabElement = document.createElement('div');
    tabElement.className =
      'tab-item flex items-center bg-slate-200 border-r border-slate-300 px-4 py-3 cursor-pointer hover:bg-slate-100 transition-all duration-200 group';
    tabElement.dataset.tabId = tabId;
    tabElement.dataset.vscodeTabsTarget = 'tab';
    tabElement.dataset.action = 'click->vscode-tabs#focusTab';

    tabElement.innerHTML = `
      <div class="flex items-center">
        <div class="w-3 h-3 bg-blue-400 rounded-full mr-3 opacity-60"></div>
        <span class="text-sm text-slate-700 font-medium mr-3 max-w-32 truncate">${tabName}</span>
        <button class="opacity-0 group-hover:opacity-100 ml-1 p-1 rounded hover:bg-slate-300 transition-all duration-200" 
                data-action="click->vscode-tabs#closeTab" 
                data-tab-id="${tabId}">
          <svg class="w-3 h-3 text-slate-500 hover:text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    `;

    // Add to tab bar
    this.tabBarTarget.appendChild(tabElement);

    // Store tab info
    this.openTabs.set(tabId, {
      element: tabElement,
      name: tabName,
      active: false,
    });

    // Save to localStorage
    this.saveTabsToStorage();
  }

  // Create individual tab content container
  createTabContentContainer(tabId) {
    console.log('Creating tab content container for:', tabId);
    
    // Check if container already exists
    const existing = document.getElementById(tabId);
    if (existing) {
      console.log('Container already exists for:', tabId);
      return existing;
    }
    
    const contentContainer = document.createElement('div');
    contentContainer.id = tabId;
    contentContainer.className = 'tab-content';
    contentContainer.dataset.vscodeTabsTarget = 'content';
    contentContainer.dataset.tabId = tabId;
    
    // Try different ways to find the content areas target
    let targetElement = null;
    
    try {
      targetElement = this.contentAreasTarget;
      console.log('Found contentAreasTarget via Stimulus:', targetElement);
    } catch (error) {
      console.log('contentAreasTarget not available via Stimulus, trying fallback');
    }
    
    if (!targetElement) {
      targetElement = document.getElementById('tab-content-areas');
      console.log('Found target via getElementById:', targetElement);
    }
    
    if (!targetElement) {
      targetElement = document.querySelector('[data-vscode-tabs-target="contentAreas"]');
      console.log('Found target via querySelector:', targetElement);
    }
    
    if (targetElement) {
      targetElement.appendChild(contentContainer);
      console.log('Successfully added container to DOM');
    } else {
      console.error('No target element found for content areas!');
    }
    
    return contentContainer;
  }

  // Override closeTab to save state
  closeTab(event) {
    event.stopPropagation();
    const tabId = event.currentTarget.dataset.tabId;

    // Remove tab element
    const tabElement = this.tabBarTarget.querySelector(`[data-tab-id="${tabId}"]`);
    if (tabElement) {
      tabElement.remove();
    }

    // Remove content container
    const contentElement = document.getElementById(tabId);
    if (contentElement) {
      contentElement.remove();
    }

    // Remove from open tabs
    const wasActive = this.openTabs.get(tabId)?.active;
    this.openTabs.delete(tabId);

    // Save to localStorage
    this.saveTabsToStorage();

    // If closed tab was active, focus another tab
    if (wasActive && this.openTabs.size > 0) {
      const firstTabId = Array.from(this.openTabs.keys())[0];
      this.focusTab(firstTabId);
    }

    // If no tabs left, show welcome message
    if (this.openTabs.size === 0) {
      this.showWelcomeMessage();
    }
  }

  // Override setActiveTab to save state
  setActiveTab(tabId) {
    console.log('Setting active tab:', tabId);

    // Update active states
    this.tabBarTarget.querySelectorAll('.tab-item').forEach((tab) => {
      if (tab.dataset.tabId === tabId) {
        tab.classList.remove('bg-slate-200');
        tab.classList.add('bg-white', 'border-b-2', 'border-blue-500', 'shadow-sm');
        // Make the close button always visible for active tab
        const closeBtn = tab.querySelector('button');
        if (closeBtn) closeBtn.classList.remove('opacity-0');
      } else {
        tab.classList.remove('bg-white', 'border-b-2', 'border-blue-500', 'shadow-sm');
        tab.classList.add('bg-slate-200');
      }
    });

    // Show corresponding content if it exists
    let contentAreasElement;
    try {
      contentAreasElement = this.contentAreasTarget;
    } catch (error) {
      contentAreasElement = document.getElementById('tab-content-areas');
    }
    
    const allContent = contentAreasElement ? contentAreasElement.querySelectorAll('.tab-content') : [];
    console.log('Found content elements:', allContent.length);

    allContent.forEach((content) => {
      if (content.id === tabId) {
        console.log('Showing content for:', tabId);
        content.classList.add('active');
      } else {
        content.classList.remove('active');
      }
    });

    // Update tab state
    this.openTabs.forEach((tab, id) => {
      tab.active = id === tabId;
    });

    // Save to localStorage
    this.saveTabsToStorage();
  }

  // Close all tabs
  closeAllTabs() {
    // Remove all tab elements
    this.tabTargets.forEach(tab => tab.remove());

    // Remove all content containers
    this.contentTargets.forEach(content => content.remove());

    // Clear the openTabs map
    this.openTabs.clear();

    // Clear localStorage
    this.saveTabsToStorage();

    // Show welcome message
    this.showWelcomeMessage();
  }
}
