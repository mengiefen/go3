import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ['tabBar', 'contentAreas', 'tab', 'content', 'noTabsIndicator', 'tabActions'];
  static values = { textHideThreshold: { type: Number, default: 100 } };

  connect() {
    console.log('VSCode Tabs Controller connected');
    console.log('Available targets:', this.targets);
    console.log('Content areas element check:', document.getElementById('tab-content-areas'));
    
    this.openTabs = new Map(); // Store open tabs
    this.resizeObserver = null; // Store ResizeObserver instance
    
    // Handle browser back/forward navigation
    window.addEventListener('popstate', this.handlePopState.bind(this));
    
    // Setup resize observer for tab width detection
    this.setupTabWidthObserver();
    
    // Check URL for tabs to restore
    this.restoreTabsFromURL();
    
    // Restore tabs from storage only if URL doesn't have tabs
    if (this.openTabs.size === 0) {
      this.restoreTabsFromStorage();
    }
  }

  disconnect() {
    // Clean up event listener
    window.removeEventListener('popstate', this.handlePopState.bind(this));
    
    // Clean up resize observer
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  // Icon mapping for different content types
  getIconForContentType(tabId, contentType) {
    // Extract the base content type from the tab ID
    if (tabId.startsWith('tab-tasks-')) {
      return this.createIcon('tasks');
    } else if (tabId.startsWith('tab-task-edit-')) {
      return this.createIcon('task-edit');
    } else if (tabId.startsWith('tab-task-')) {
      return this.createIcon('task');
    }
    
    // Map content types to icons
    const iconMap = {
      'organization': 'building',
      'user': 'user',
      'admin': 'shield',
      'department': 'users',
      'campaign': 'megaphone',
      'report': 'chart-bar',
      'dashboard': 'dashboard',
      'settings': 'cog',
      'security': 'lock',
      'task': 'check-circle',
      'tasks': 'list',
      'task-edit': 'edit'
    };
    
    return this.createIcon(iconMap[contentType] || 'folder');
  }

  // Create SVG icon element
  createIcon(iconType) {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("class", "w-5 h-5 flex-shrink-0");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("stroke-width", "2");
    
    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    
    // Define paths for different icons
    const iconPaths = {
      'building': 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
      'user': 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      'shield': 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
      'users': 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
      'megaphone': 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z',
      'chart-bar': 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      'dashboard': 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z',
      'cog': 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
      'lock': 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
      'check-circle': 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      'list': 'M4 6h16M4 12h16M4 18h16',
      'edit': 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
      'folder': 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z'
    };
    
    path.setAttribute("d", iconPaths[iconType] || iconPaths['folder']);
    svg.appendChild(path);
    
    return svg;
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
    const contentContainer = document.getElementById(tabId);
    if (!contentContainer) {
      console.error('No content container found for tab:', tabId);
      return;
    }

    console.log('Loading content for restored tab:', tabId);
    let url;
    
    if (tabId.startsWith('tab-tasks-')) {
      // Parse task category tab ID to get filter info
      const parts = tabId.split('-');
      if (parts.length >= 4) {
        const filterType = parts[2]; // e.g., 'category'
        const filterValue = parts[3]; // e.g., 'development'

        // Find the tab name from openTabs
        const tabInfo = this.openTabs.get(tabId);
        const tabName = tabInfo ? tabInfo.name : `${filterType} ${filterValue}`;

        url = `/tasks/content/${filterType}/${filterValue}?content_name=${encodeURIComponent(tabName)}&frame_id=frame-${tabId}`;
      }
    } else if (tabId.startsWith('tab-task-edit-')) {
      // Parse task edit tab ID to get task ID
      const parts = tabId.split('-');
      if (parts.length >= 4) {
        const taskId = parts[3]; // Extract task ID
        url = `/tasks/${taskId}/edit?frame_id=frame-${tabId}`;
      }
    } else if (tabId.startsWith('tab-task-')) {
      // Parse individual task tab ID to get task ID
      const parts = tabId.split('-');
      if (parts.length >= 3) {
        const taskId = parts[2]; // Extract task ID
        url = `/tasks/${taskId}?frame_id=frame-${tabId}`;
      }
    } else {
      // Handle all other tab types (organization, user, etc.)
      const parts = tabId.split('-');
      if (parts.length >= 4) {
        const contentType = parts[1]; // e.g., 'organization', 'user'
        // Remove 'tab', contentType, and timestamp to get the content ID
        // For tab-organization-org-1-1234567890, we want 'org-1'
        const contentId = parts.slice(2, -1).join('-'); // Remove last part (timestamp)
        const tabInfo = this.openTabs.get(tabId);
        const contentName = tabInfo ? tabInfo.name : contentType;
        
        // Always use tab-demo route for non-task tabs
        url = `/tab-demo/content/${contentType}/${contentId}?content_name=${encodeURIComponent(contentName)}&frame_id=frame-${tabId}`;
      }
    }

    // Create turbo frame for restored tab content
    if (url) {
      console.log('Creating turbo frame with URL:', url);
      const turboFrame = document.createElement('turbo-frame');
      turboFrame.id = `frame-${tabId}`;
      turboFrame.src = url;
      turboFrame.dataset.turboFrameRequestsFormat = 'html';
      contentContainer.appendChild(turboFrame);
    } else {
      console.error('No URL generated for tab:', tabId);
    }
  }

  // Check if we can restore a tab based on its ID format
  canRestoreTab(tabId) {
    // Restore all tab types
    return tabId.startsWith('tab-');
  }

  // Handle browser back/forward navigation
  handlePopState(event) {
    console.log('Handling popstate event', event.state);
    
    if (event.state && event.state.tabs) {
      // Close all current tabs
      this.closeAllTabsWithoutHistory();
      
      // Restore tabs from state
      event.state.tabs.forEach(tabState => {
        this.addTab(tabState.tabId, tabState.name);
        this.loadRestoredTabContent(tabState.tabId);
      });
      
      // Set active tab
      if (event.state.activeTab) {
        setTimeout(() => {
          this.setActiveTab(event.state.activeTab);
        }, 100);
      }
    }
  }

  // Update URL when tabs change
  updateURL() {
    const tabs = Array.from(this.openTabs.entries()).map(([tabId, tabInfo]) => ({
      tabId,
      name: tabInfo.name,
      active: tabInfo.active
    }));
    
    const activeTab = tabs.find(tab => tab.active);
    const params = new URLSearchParams(window.location.search);
    
    // Clear existing tab parameters
    Array.from(params.keys()).forEach(key => {
      if (key.startsWith('tab_')) {
        params.delete(key);
      }
    });
    
    // Add current tabs to URL
    tabs.forEach((tab, index) => {
      const tabParts = tab.tabId.split('-');
      
      if (tab.tabId.startsWith('tab-tasks-')) {
        // Handle task category tabs
        const filterType = tabParts[2];
        const filterValue = tabParts[3];
        params.set(`tab_${index}`, `tasks-${filterType}:${filterValue}:${encodeURIComponent(tab.name)}`);
      } else if (tab.tabId.startsWith('tab-task-edit-')) {
        // Handle task edit tabs
        const taskId = tabParts[3];
        params.set(`tab_${index}`, `task-edit:${taskId}:${encodeURIComponent(tab.name)}`);
      } else if (tab.tabId.startsWith('tab-task-')) {
        // Handle individual task tabs
        const taskId = tabParts[2];
        params.set(`tab_${index}`, `task:${taskId}:${encodeURIComponent(tab.name)}`);
      } else if (tabParts.length >= 4) {
        // Handle all other tabs
        const contentType = tabParts[1];
        const contentId = tabParts.slice(2, -1).join('-');
        params.set(`tab_${index}`, `${contentType}:${contentId}:${encodeURIComponent(tab.name)}`);
      }
    });
    
    // Set active tab
    if (activeTab) {
      params.set('active_tab', tabs.indexOf(activeTab).toString());
    }
    
    const newURL = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState({ tabs, activeTab: activeTab?.tabId }, '', newURL);
  }

  // Restore tabs from URL parameters
  restoreTabsFromURL() {
    const params = new URLSearchParams(window.location.search);
    const tabsToRestore = [];
    let activeTabIndex = params.get('active_tab');
    
    // Find all tab parameters
    Array.from(params.entries()).forEach(([key, value]) => {
      if (key.startsWith('tab_')) {
        const index = parseInt(key.substring(4));
        const parts = value.split(':');
        
        if (parts.length >= 2) {
          const contentType = parts[0];
          const contentId = parts[1];
          const encodedName = parts.slice(2).join(':'); // Handle names with colons
          
          tabsToRestore[index] = {
            contentType,
            contentId,
            name: decodeURIComponent(encodedName || `${contentType} ${contentId}`)
          };
        }
      }
    });
    
    // Restore tabs in order
    tabsToRestore.forEach((tabData, index) => {
      if (tabData) {
        let tabId;
        
        if (tabData.contentType.startsWith('tasks-')) {
          // Handle task category tabs
          const filterType = tabData.contentType.substring(6);
          tabId = this.generateUniqueTabId(`tasks-${filterType}`, tabData.contentId);
        } else if (tabData.contentType === 'task-edit') {
          // Handle task edit tabs
          tabId = this.generateUniqueTabId('task-edit', tabData.contentId);
        } else if (tabData.contentType === 'task') {
          // Handle individual task tabs
          tabId = this.generateUniqueTabId('task', tabData.contentId);
        } else {
          // Handle all other tabs
          tabId = this.generateUniqueTabId(tabData.contentType, tabData.contentId);
        }
        
        this.addTab(tabId, tabData.name);
        this.loadRestoredTabContent(tabId);
        
        if (activeTabIndex !== null && parseInt(activeTabIndex) === index) {
          setTimeout(() => {
            this.setActiveTab(tabId);
          }, 100);
        }
      }
    });
  }

  // Close all tabs without updating history
  closeAllTabsWithoutHistory() {
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

    // Extract content type from tab ID
    const tabParts = tabId.split('-');
    let contentType = tabParts[1];
    if (tabId.startsWith('tab-tasks-')) {
      contentType = 'tasks';
    } else if (tabId.startsWith('tab-task-edit-')) {
      contentType = 'task-edit';
    } else if (tabId.startsWith('tab-task-')) {
      contentType = 'task';
    }

    // Create tab element
    const tabElement = document.createElement('div');
    tabElement.className = 'tab-item group cursor-pointer';
    tabElement.dataset.tabId = tabId;
    tabElement.dataset.vscodeTabsTarget = 'tab';
    tabElement.dataset.action = 'click->vscode-tabs#focusTab';
    tabElement.dataset.textHidden = 'false';

    // Create tab content with icon
    const tabContent = document.createElement('div');
    tabContent.className = 'tab-content-wrapper';
    
    // Add icon
    const iconWrapper = document.createElement('div');
    iconWrapper.className = 'tab-icon';
    const icon = this.getIconForContentType(tabId, contentType);
    icon.classList.add('text-slate-600');
    iconWrapper.appendChild(icon);
    tabContent.appendChild(iconWrapper);
    
    // Add text
    const textSpan = document.createElement('span');
    textSpan.className = 'tab-text';
    textSpan.textContent = tabName;
    textSpan.title = tabName; // Tooltip for long names
    tabContent.appendChild(textSpan);
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.className = 'tab-close';
    closeButton.dataset.action = 'click->vscode-tabs#closeTab';
    closeButton.dataset.tabId = tabId;
    closeButton.innerHTML = `
      <svg class="w-4 h-4 text-slate-500 hover:text-slate-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    `;
    tabContent.appendChild(closeButton);
    
    tabElement.appendChild(tabContent);
    
    // Add separator element for vertical line between tabs
    const separator = document.createElement('span');
    separator.className = 'tab-separator';
    tabElement.appendChild(separator);
    
    // Add curve elements for active tab styling
    const leftCurve = document.createElement('span');
    leftCurve.className = 'tab-curve-left';
    tabElement.appendChild(leftCurve);
    
    const rightCurve = document.createElement('span');
    rightCurve.className = 'tab-curve-right';
    tabElement.appendChild(rightCurve);

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
    
    // Update URL
    this.updateURL();
    
    // Check tab widths after adding new tab
    setTimeout(() => this.checkAllTabWidths(), 10);
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
    
    // Update URL
    this.updateURL();
    
    // Check tab widths after closing tab
    setTimeout(() => this.checkAllTabWidths(), 10);
  }

  // Override setActiveTab to save state
  setActiveTab(tabId) {
    console.log('Setting active tab:', tabId);

    // Update active states
    this.tabBarTarget.querySelectorAll('.tab-item').forEach((tab) => {
      if (tab.dataset.tabId === tabId) {
        tab.classList.remove('bg-slate-200');
        tab.classList.add('active', 'bg-white', 'shadow-sm');
        // Make the close button always visible for active tab
        const closeBtn = tab.querySelector('.tab-close');
        if (closeBtn) closeBtn.classList.remove('opacity-0');
      } else {
        tab.classList.remove('active', 'bg-white', 'shadow-sm');
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
    
    // Update URL
    this.updateURL();
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
    
    // Update URL
    this.updateURL();
  }

  // Setup ResizeObserver to monitor tab bar width
  setupTabWidthObserver() {
    if (!this.hasTabBarTarget) return;
    
    this.resizeObserver = new ResizeObserver(() => {
      this.checkAllTabWidths();
    });
    
    this.resizeObserver.observe(this.tabBarTarget);
  }

  // Check all tab widths and hide/show text as needed
  checkAllTabWidths() {
    if (!this.hasTabBarTarget) return;
    
    const tabs = this.tabBarTarget.querySelectorAll('.tab-item');
    const tabCount = tabs.length;
    
    // If no tabs, nothing to check
    if (tabCount === 0) return;
    
    // Calculate available width per tab
    const containerWidth = this.tabBarTarget.offsetWidth;
    const totalTabsWidth = Array.from(tabs).reduce((sum, tab) => sum + tab.offsetWidth, 0);
    
    // Check if we need to hide text
    const needsCompression = totalTabsWidth > containerWidth;
    const averageTabWidth = containerWidth / tabCount;
    
    // Define threshold for hiding text
    const TEXT_HIDE_THRESHOLD = this.textHideThresholdValue || 100;
    
    tabs.forEach(tab => {
      const textElement = tab.querySelector('.tab-text');
      if (!textElement) return;
      
      // Get actual tab width
      const tabWidth = tab.offsetWidth;
      
      // Hide or show text based on width and compression needs
      if (needsCompression && (tabWidth < TEXT_HIDE_THRESHOLD || averageTabWidth < TEXT_HIDE_THRESHOLD)) {
        tab.dataset.textHidden = 'true';
        // Add tooltip to tab when text is hidden
        if (!tab.title) {
          tab.title = textElement.textContent;
        }
      } else {
        tab.dataset.textHidden = 'false';
        // Remove tooltip when text is visible
        tab.removeAttribute('title');
      }
    });
  }
}
