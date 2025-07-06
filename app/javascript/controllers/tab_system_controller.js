import { Controller } from '@hotwired/stimulus';

console.log('=== TAB SYSTEM CONTROLLER FILE LOADED ===');

export default class extends Controller {
  static targets = ['tabList', 'noTabsIndicator', 'tabActions', 'contentArea', 'welcomeMessage'];
  static values = {
    showIcons: { type: Boolean, default: false },
    showCloseButtons: { type: Boolean, default: true },
    allowReorder: { type: Boolean, default: true },
    theme: { type: String, default: 'enterprise' }
  };

  connect() {
    console.log('TabSystem controller connected to element:', this.element);
    console.log('Element data-controller:', this.element.dataset.controller);
    console.log('Available targets:', this.targets);
    this.tabs = new Map(); // Map of tabId -> { title, icon, isActive, isLoading }
    this.activeTabId = null;
    this.tabCounter = 0;
    
    // Load persisted state
    this.loadPersistedState();
  }

  // Add a new tab
  addTab(tabId, title, icon = null) {
    console.log('=== TAB SYSTEM: addTab called ===');
    console.log('tabId:', tabId, 'title:', title, 'icon:', icon);
    console.log('Current tabs:', Array.from(this.tabs.keys()));
    console.log('Has tabListTarget:', this.hasTabListTarget);
    console.log('Has contentAreaTarget:', this.hasContentAreaTarget);
    
    if (this.tabs.has(tabId)) {
      // Tab already exists, just activate it
      console.log('Tab already exists, activating...');
      this.setActiveTab(tabId);
      return;
    }

    // Create tab data
    const tabData = {
      title,
      icon,
      isActive: false,
      isLoading: false
    };

    // Store tab data
    this.tabs.set(tabId, tabData);

    // Create tab element
    const tabElement = this.createTabElement(tabId, tabData);
    
    // Hide no tabs indicator
    if (this.hasNoTabsIndicatorTarget) {
      this.noTabsIndicatorTarget.style.display = 'none';
    }

    // Show tab actions
    if (this.hasTabActionsTarget) {
      this.tabActionsTarget.style.display = '';
    }

    // Add tab to tab list
    this.tabListTarget.appendChild(tabElement);

    // Create content container
    const contentContainer = this.createContentContainer(tabId);
    this.contentAreaTarget.appendChild(contentContainer);

    // Hide welcome message
    if (this.hasWelcomeMessageTarget) {
      this.welcomeMessageTarget.style.display = 'none';
    }

    // Activate the new tab
    this.setActiveTab(tabId);
    
    // Persist state and update URL
    this.persistState();
    this.updateURL();
  }

  // Create tab element
  createTabElement(tabId, tabData) {
    const tab = document.createElement('div');
    tab.dataset.tabId = tabId;
    tab.dataset.tabSystemTarget = 'tab';
    tab.className = this.getTabClasses(false);
    tab.setAttribute('data-action', 'click->tab-system#selectTab');

    // Tab content wrapper
    const tabContent = document.createElement('div');
    tabContent.className = 'flex items-center';

    // Icon
    if (this.showIconsValue && tabData.icon) {
      const iconWrapper = document.createElement('div');
      iconWrapper.className = 'w-4 h-4 mr-2 flex-shrink-0';
      iconWrapper.innerHTML = tabData.icon;
      tabContent.appendChild(iconWrapper);
    }

    // Title
    const titleSpan = document.createElement('span');
    titleSpan.className = 'tab-title overflow-hidden text-ellipsis whitespace-nowrap flex-1 text-xs';
    titleSpan.textContent = tabData.title;
    tabContent.appendChild(titleSpan);

    // Close button
    if (this.showCloseButtonsValue) {
      const closeButton = document.createElement('button');
      
      // Different close button styles based on theme
      let closeButtonClasses = '';
      if (this.themeValue === 'enterprise') {
        closeButtonClasses = 'w-3.5 h-3.5 ml-1.5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400';
      } else {
        closeButtonClasses = 'w-3.5 h-3.5 ml-1.5 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-500 hover:text-white';
      }
      
      closeButton.className = closeButtonClasses;
      closeButton.setAttribute('data-action', 'click->tab-system#closeTab');
      closeButton.setAttribute('data-tab-id', tabId);
      if (this.themeValue === 'enterprise') {
        closeButton.innerHTML = `
          <svg class="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        `;
      } else {
        closeButton.innerHTML = `
          <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        `;
      }
      closeButton.onclick = (e) => e.stopPropagation();
      tabContent.appendChild(closeButton);
    }

    tab.appendChild(tabContent);
    return tab;
  }

  // Create content container
  createContentContainer(tabId) {
    const container = document.createElement('div');
    container.id = tabId;
    container.className = 'absolute inset-0 overflow-auto hidden';
    container.dataset.tabContentId = tabId;
    return container;
  }

  // Get tab classes based on theme and state
  getTabClasses(isActive) {
    const baseClasses = 'group relative flex items-center h-full cursor-pointer transition-all duration-200 text-xs font-medium whitespace-nowrap';
    
    let themeClasses = '';
    let activeClasses = '';

    switch (this.themeValue) {
      case 'vscode':
        themeClasses = 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-t-2 border-transparent border-r border-l border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-200 px-4 mr-px min-w-[120px] max-w-[200px]';
        activeClasses = 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-t-blue-500 dark:border-t-blue-400 shadow-sm z-10 px-4 mr-px min-w-[120px] max-w-[200px]';
        break;
      case 'chrome':
        themeClasses = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-t-lg mx-1 hover:bg-slate-200 dark:hover:bg-slate-700 px-4 min-w-[120px] max-w-[200px]';
        activeClasses = 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-lg z-10 px-4 mx-1 min-w-[120px] max-w-[200px]';
        break;
      case 'minimal':
        themeClasses = 'text-slate-600 dark:text-slate-400 border-b-2 border-transparent hover:border-slate-300 dark:hover:border-slate-600 px-4 min-w-[120px] max-w-[200px]';
        activeClasses = 'text-slate-900 dark:text-white border-b-blue-500 dark:border-b-blue-400 px-4 min-w-[120px] max-w-[200px]';
        break;
      case 'enterprise':
        themeClasses = 'text-slate-600 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-200 rounded-t-md -mr-1 mt-0.5 px-3 py-1.5 min-w-[100px] max-w-[180px] border border-slate-200/60 dark:border-slate-600/60 border-b-0 relative transition-all duration-200 backdrop-blur-sm';
        activeClasses = 'text-blue-700 dark:text-blue-300 bg-white dark:bg-slate-900 rounded-t-md -mr-1 mt-0.5 px-3 py-1.5 min-w-[100px] max-w-[180px] font-semibold shadow-lg border border-blue-200 dark:border-blue-400 border-b-0 relative z-10 transition-all duration-200';
        break;
    }

    return `${baseClasses} ${isActive ? activeClasses : themeClasses}`;
  }

  // Set active tab
  setActiveTab(tabId) {
    if (!this.tabs.has(tabId)) return;

    // Deactivate current active tab
    if (this.activeTabId) {
      const prevTab = this.element.querySelector(`[data-tab-id="${this.activeTabId}"]`);
      const prevContent = document.getElementById(this.activeTabId);
      
      if (prevTab) {
        prevTab.className = this.getTabClasses(false);
      }
      
      if (prevContent) {
        prevContent.classList.add('hidden');
      }
      
      const prevTabData = this.tabs.get(this.activeTabId);
      if (prevTabData) {
        prevTabData.isActive = false;
      }
    }

    // Activate new tab
    const newTab = this.element.querySelector(`[data-tab-id="${tabId}"]`);
    const newContent = document.getElementById(tabId);
    
    if (newTab) {
      newTab.className = this.getTabClasses(true);
    }
    
    if (newContent) {
      newContent.classList.remove('hidden');
    }
    
    const newTabData = this.tabs.get(tabId);
    if (newTabData) {
      newTabData.isActive = true;
    }

    this.activeTabId = tabId;

    // Dispatch event
    this.dispatch('tab:activated', { detail: { tabId } });
    
    // Persist state and update URL (only when manually setting active, not during initial load)
    this.persistState();
    this.updateURL();
  }

  // Set tab loading state
  setTabLoading(tabId, isLoading) {
    const tabData = this.tabs.get(tabId);
    if (!tabData) return;

    tabData.isLoading = isLoading;
    const tabElement = this.element.querySelector(`[data-tab-id="${tabId}"]`);
    
    if (tabElement) {
      if (isLoading) {
        tabElement.classList.add('animate-pulse');
        const iconWrapper = tabElement.querySelector('.w-4.h-4.mr-2');
        if (iconWrapper) {
          iconWrapper.innerHTML = `
            <svg class="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          `;
        }
      } else {
        tabElement.classList.remove('animate-pulse');
        const iconWrapper = tabElement.querySelector('.w-4.h-4.mr-2');
        if (iconWrapper && tabData.icon) {
          iconWrapper.innerHTML = tabData.icon;
        }
      }
    }
  }

  // Select tab (click handler)
  selectTab(event) {
    const tabElement = event.currentTarget;
    const tabId = tabElement.dataset.tabId;
    this.setActiveTab(tabId);
  }

  // Close tab
  closeTab(event) {
    event.stopPropagation();
    const tabId = event.currentTarget.dataset.tabId;
    
    if (!this.tabs.has(tabId)) return;

    // Remove tab element
    const tabElement = this.element.querySelector(`[data-tab-id="${tabId}"]`);
    if (tabElement) {
      tabElement.remove();
    }

    // Remove content container
    const contentContainer = document.getElementById(tabId);
    if (contentContainer) {
      contentContainer.remove();
    }

    // Remove from tabs map
    this.tabs.delete(tabId);

    // If this was the active tab, activate another one
    if (this.activeTabId === tabId) {
      this.activeTabId = null;
      
      // Try to activate the next tab
      const remainingTabs = Array.from(this.tabs.keys());
      if (remainingTabs.length > 0) {
        this.setActiveTab(remainingTabs[remainingTabs.length - 1]);
      }
    }

    // Show no tabs indicator if no tabs left
    if (this.tabs.size === 0) {
      if (this.hasNoTabsIndicatorTarget) {
        this.noTabsIndicatorTarget.style.display = '';
      }
      if (this.hasTabActionsTarget) {
        this.tabActionsTarget.style.display = 'none';
      }
      if (this.hasWelcomeMessageTarget) {
        this.welcomeMessageTarget.style.display = '';
      }
    }

    // Dispatch event
    this.dispatch('tab:closed', { detail: { tabId } });
    
    // Persist state and update URL
    this.persistState();
    this.updateURL();
  }

  // Close active tab
  closeActiveTab() {
    console.log('=== closeActiveTab called ===');
    console.log('Active tab ID:', this.activeTabId);
    if (this.activeTabId) {
      // Find the active tab
      const tabElement = this.element.querySelector(`[data-tab-id="${this.activeTabId}"]`);
      console.log('Found tab element:', tabElement);
      if (tabElement) {
        // Simulate closeTab event
        this.closeTab({ 
          stopPropagation: () => {},
          currentTarget: { dataset: { tabId: this.activeTabId } }
        });
      }
    }
  }

  // Close all tabs
  closeAllTabs() {
    console.log('closeAllTabs called');
    // Get all tab IDs before starting to close them
    const allTabIds = Array.from(this.tabs.keys());
    
    // Close each tab without individual persistence calls
    allTabIds.forEach(tabId => {
      // Remove tab element
      const tabElement = this.element.querySelector(`[data-tab-id="${tabId}"]`);
      if (tabElement) {
        tabElement.remove();
      }

      // Remove content container
      const contentContainer = document.getElementById(tabId);
      if (contentContainer) {
        contentContainer.remove();
      }

      // Remove from tabs map
      this.tabs.delete(tabId);

      // Dispatch event
      this.dispatch('tab:closed', { detail: { tabId } });
    });
    
    // Clear active tab
    this.activeTabId = null;
    
    // Ensure welcome message is shown
    if (this.hasNoTabsIndicatorTarget) {
      this.noTabsIndicatorTarget.style.display = '';
    }
    if (this.hasTabActionsTarget) {
      this.tabActionsTarget.style.display = 'none';
    }
    if (this.hasWelcomeMessageTarget) {
      this.welcomeMessageTarget.style.display = '';
    }
    
    // Update state once at the end
    this.persistState();
    this.updateURL();
  }

  // Close other tabs
  closeOtherTabs() {
    console.log('=== closeOtherTabs called ===');
    console.log('Active tab ID:', this.activeTabId);
    if (!this.activeTabId) return;
    
    // Get all tab IDs except the active one
    const otherTabIds = Array.from(this.tabs.keys()).filter(id => id !== this.activeTabId);
    console.log('Other tab IDs to close:', otherTabIds);
    
    // Close each tab
    otherTabIds.forEach(tabId => {
      this.closeTabById(tabId);
    });
    
    // Update state
    this.persistState();
    this.updateURL();
  }

  // Close tabs to the right
  closeTabsToRight() {
    console.log('=== closeTabsToRight called ===');
    console.log('Active tab ID:', this.activeTabId);
    if (!this.activeTabId) return;
    
    const tabElements = Array.from(this.tabListTarget.querySelectorAll('[data-tab-id]'));
    const activeIndex = tabElements.findIndex(el => el.dataset.tabId === this.activeTabId);
    console.log('Active tab index:', activeIndex);
    
    if (activeIndex === -1) return;
    
    // Get all tab IDs to the right of the active tab
    const tabsToClose = [];
    for (let i = activeIndex + 1; i < tabElements.length; i++) {
      tabsToClose.push(tabElements[i].dataset.tabId);
    }
    console.log('Tabs to close (to the right):', tabsToClose);
    
    // Close each tab
    tabsToClose.forEach(tabId => {
      this.closeTabById(tabId);
    });
    
    // Update state
    this.persistState();
    this.updateURL();
  }

  // Helper method to close a tab by its ID
  closeTabById(tabId) {
    if (!this.tabs.has(tabId)) return;

    // Remove tab element
    const tabElement = this.element.querySelector(`[data-tab-id="${tabId}"]`);
    if (tabElement) {
      tabElement.remove();
    }

    // Remove content container
    const contentContainer = document.getElementById(tabId);
    if (contentContainer) {
      contentContainer.remove();
    }

    // Remove from tabs map
    this.tabs.delete(tabId);

    // If this was the active tab, activate another one
    if (this.activeTabId === tabId) {
      this.activeTabId = null;
      
      // Try to activate the next tab
      const remainingTabs = Array.from(this.tabs.keys());
      if (remainingTabs.length > 0) {
        this.setActiveTabWithoutPersistence(remainingTabs[remainingTabs.length - 1]);
      }
    }

    // Dispatch event
    this.dispatch('tab:closed', { detail: { tabId } });
  }

  // Helper method to set active tab without triggering persistence (to avoid duplicate calls)
  setActiveTabWithoutPersistence(tabId) {
    if (!this.tabs.has(tabId)) return;

    // Deactivate current active tab
    if (this.activeTabId) {
      const prevTab = this.element.querySelector(`[data-tab-id="${this.activeTabId}"]`);
      const prevContent = document.getElementById(this.activeTabId);
      
      if (prevTab) {
        prevTab.className = this.getTabClasses(false);
      }
      
      if (prevContent) {
        prevContent.classList.add('hidden');
      }
      
      const prevTabData = this.tabs.get(this.activeTabId);
      if (prevTabData) {
        prevTabData.isActive = false;
      }
    }

    // Activate new tab
    const newTab = this.element.querySelector(`[data-tab-id="${tabId}"]`);
    const newContent = document.getElementById(tabId);
    
    if (newTab) {
      newTab.className = this.getTabClasses(true);
    }
    
    if (newContent) {
      newContent.classList.remove('hidden');
    }
    
    const newTabData = this.tabs.get(tabId);
    if (newTabData) {
      newTabData.isActive = true;
    }

    this.activeTabId = tabId;

    // Dispatch event
    this.dispatch('tab:activated', { detail: { tabId } });
  }

  // Toggle icons
  toggleIcons() {
    this.showIconsValue = !this.showIconsValue;
    
    // Update all tab icons
    this.tabs.forEach((tabData, tabId) => {
      const tabElement = this.element.querySelector(`[data-tab-id="${tabId}"]`);
      if (tabElement) {
        const iconWrapper = tabElement.querySelector('.w-4.h-4.mr-2');
        
        if (this.showIconsValue && tabData.icon && !iconWrapper) {
          // Add icon
          const newIconWrapper = document.createElement('div');
          newIconWrapper.className = 'w-4 h-4 mr-2 flex-shrink-0';
          newIconWrapper.innerHTML = tabData.icon;
          const tabContent = tabElement.querySelector('.flex.items-center');
          tabContent.insertBefore(newIconWrapper, tabContent.firstChild);
        } else if (!this.showIconsValue && iconWrapper) {
          // Remove icon
          iconWrapper.remove();
        }
      }
    });
  }

  // Generate unique tab ID
  generateUniqueTabId(prefix, suffix = '') {
    this.tabCounter++;
    const parts = ['tab', prefix];
    if (suffix) {
      parts.push(suffix);
    }
    parts.push(this.tabCounter);
    return parts.join('-');
  }

  // Get icon for content type
  getIconForContentType(contentType) {
    const icons = {
      'organization': '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>',
      'user': '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>',
      'tasks': '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>',
      'task': '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',
      'admin': '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path></svg>',
      'department': '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>',
      'campaign': '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>',
      'report': '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>',
      'default': '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>'
    };
    
    return icons[contentType] || icons.default;
  }

  // URL and persistence methods
  updateURL() {
    const tabs = Array.from(this.tabs.entries()).map(([tabId, tabData]) => ({
      tabId,
      title: tabData.title,
      isActive: tabData.isActive
    }));
    
    const activeTab = tabs.find(tab => tab.isActive);
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
      
      if (tabParts.length >= 4) {
        // Parse tab ID: tab-contentType-contentId-counter
        const contentType = tabParts[1];
        const contentId = tabParts.slice(2, -1).join('-'); // Remove counter part
        params.set(`tab_${index}`, `${contentType}:${contentId}:${encodeURIComponent(tab.title)}`);
      }
    });
    
    // Set active tab
    if (activeTab) {
      params.set('active_tab', tabs.indexOf(activeTab).toString());
    }
    
    const newURL = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState({ tabs, activeTab: activeTab?.tabId }, '', newURL);
  }

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
          const encodedTitle = parts.slice(2).join(':');
          
          tabsToRestore[index] = {
            contentType,
            contentId,
            title: decodeURIComponent(encodedTitle || `${contentType} ${contentId}`)
          };
        }
      }
    });
    
    // Restore tabs in order if any exist
    if (tabsToRestore.length > 0) {
      console.log('Restoring tabs from URL:', tabsToRestore);
      
      tabsToRestore.forEach((tabData, index) => {
        if (tabData) {
          const tabId = this.generateUniqueTabId(tabData.contentType, tabData.contentId);
          const icon = this.getIconForContentType(tabData.contentType);
          
          // Add tab to tab bar
          this.addTabToDOM(tabId, tabData.title, icon);
          
          // Load content for restored tab
          this.loadRestoredTabContent(tabId, tabData);
          
          if (activeTabIndex !== null && parseInt(activeTabIndex) === index) {
            setTimeout(() => {
              this.setActiveTab(tabId);
            }, 100);
          }
        }
      });
    }
  }

  addTabToDOM(tabId, title, icon) {
    // Create tab data
    const tabData = {
      title,
      icon,
      isActive: false,
      isLoading: false
    };

    // Store tab data
    this.tabs.set(tabId, tabData);

    // Create tab element
    const tabElement = this.createTabElement(tabId, tabData);
    
    // Hide no tabs indicator
    if (this.hasNoTabsIndicatorTarget) {
      this.noTabsIndicatorTarget.style.display = 'none';
    }

    // Show tab actions
    if (this.hasTabActionsTarget) {
      this.tabActionsTarget.style.display = '';
    }

    // Add tab to tab list
    this.tabListTarget.appendChild(tabElement);

    // Create content container
    const contentContainer = this.createContentContainer(tabId);
    this.contentAreaTarget.appendChild(contentContainer);

    // Hide welcome message
    if (this.hasWelcomeMessageTarget) {
      this.welcomeMessageTarget.style.display = 'none';
    }
  }

  loadRestoredTabContent(tabId, tabData) {
    const contentContainer = document.getElementById(tabId);
    if (!contentContainer) {
      console.error('No content container found for tab:', tabId);
      return;
    }

    // Generate URL for content
    const url = `/reusable-tabs-demo/content/${tabData.contentType}/${tabData.contentId}?content_name=${encodeURIComponent(tabData.title)}&frame_id=frame-${tabId}`;
    
    console.log('Loading restored tab content:', url);
    
    // Add loading state
    this.setTabLoading(tabId, true);
    contentContainer.classList.add('content-loading');
    
    // Create turbo frame
    const turboFrame = document.createElement('turbo-frame');
    turboFrame.id = `frame-${tabId}`;
    turboFrame.src = url;
    turboFrame.dataset.loadedTabId = tabId;
    turboFrame.dataset.turboFrameRequestsFormat = 'html';
    
    // Listen for frame load events
    turboFrame.addEventListener('turbo:frame-load', () => {
      console.log('Restored frame loaded for tab:', tabId);
      this.setTabLoading(tabId, false);
      contentContainer.classList.remove('content-loading');
    });
    
    turboFrame.addEventListener('turbo:frame-missing', () => {
      console.error('Restored frame failed to load for tab:', tabId);
      this.setTabLoading(tabId, false);
      contentContainer.classList.remove('content-loading');
      contentContainer.innerHTML = '<div class="p-4 text-red-600">Failed to load content</div>';
    });
    
    contentContainer.appendChild(turboFrame);
  }

  persistState() {
    try {
      const state = {
        tabs: Array.from(this.tabs.entries()).map(([id, data]) => ({
          id,
          title: data.title,
          icon: data.icon,
          isActive: data.isActive
        })),
        activeTabId: this.activeTabId,
        tabCounter: this.tabCounter
      };
      localStorage.setItem('reusableTabSystemState', JSON.stringify(state));
    } catch (e) {
      console.warn('Could not persist tab state:', e);
    }
  }

  loadPersistedState() {
    try {
      const savedState = localStorage.getItem('reusableTabSystemState');
      if (!savedState) {
        // Try to restore from URL if no localStorage
        this.restoreTabsFromURL();
        return;
      }

      const state = JSON.parse(savedState);
      this.tabCounter = state.tabCounter || 0;

      // Check if URL has tabs, if so, prioritize URL over localStorage
      const params = new URLSearchParams(window.location.search);
      const hasUrlTabs = Array.from(params.keys()).some(key => key.startsWith('tab_'));
      
      if (hasUrlTabs) {
        this.restoreTabsFromURL();
      }
    } catch (e) {
      console.warn('Could not load persisted tab state:', e);
      this.restoreTabsFromURL();
    }
  }

}