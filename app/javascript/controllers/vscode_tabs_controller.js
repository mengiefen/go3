import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["tabBar", "contentArea", "tab", "content"]

  connect() {
    this.openTabs = new Map() // Store open tabs
  }

  addTab(tabId, tabName) {
    // Don't add if tab already exists
    if (this.openTabs.has(tabId)) {
      return
    }

    // Hide welcome message and "No tabs open" indicator when first tab is added
    if (this.openTabs.size === 0) {
      this.hideWelcomeMessage()
    }

    // Create tab element
    const tabElement = document.createElement('div')
    tabElement.className = 'tab-item flex items-center bg-slate-200 border-r border-slate-300 px-4 py-3 cursor-pointer hover:bg-slate-100 transition-all duration-200 group'
    tabElement.dataset.tabId = tabId
    tabElement.dataset.vscodeTabsTarget = 'tab'
    tabElement.dataset.action = 'click->vscode-tabs#focusTab'
    
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
    `

    // Add to tab bar
    this.tabBarTarget.appendChild(tabElement)
    
    // Store tab info
    this.openTabs.set(tabId, {
      element: tabElement,
      name: tabName,
      active: false
    })
  }

  // Helper method to set active tab without event handling
  setActiveTab(tabId) {
    console.log('Setting active tab:', tabId)
    
    // Update active states
    this.tabBarTarget.querySelectorAll('.tab-item').forEach(tab => {
      if (tab.dataset.tabId === tabId) {
        tab.classList.remove('bg-slate-200')
        tab.classList.add('bg-white', 'border-b-2', 'border-blue-500', 'shadow-sm')
        // Make the close button always visible for active tab
        const closeBtn = tab.querySelector('button')
        if (closeBtn) closeBtn.classList.remove('opacity-0')
      } else {
        tab.classList.remove('bg-white', 'border-b-2', 'border-blue-500', 'shadow-sm')
        tab.classList.add('bg-slate-200')
      }
    })

    // Show corresponding content if it exists
    const allContent = this.contentAreaTarget.querySelectorAll('.tab-content')
    console.log('Found content elements:', allContent.length)
    
    allContent.forEach(content => {
      if (content.id === tabId) {
        console.log('Showing content for:', tabId)
        content.classList.remove('hidden')
      } else {
        content.classList.add('hidden')
      }
    })

    // Update tab state
    this.openTabs.forEach((tab, id) => {
      tab.active = (id === tabId)
    })
  }

  hideWelcomeMessage() {
    // Hide the "No tabs open" indicator
    const noTabsIndicator = this.tabBarTarget.querySelector('.flex.items-center.h-full')
    if (noTabsIndicator) {
      noTabsIndicator.classList.add('hidden')
    }
    
    // Hide the welcome message
    const welcomeMessage = this.contentAreaTarget.querySelector('.absolute.inset-0.flex.items-center.justify-center')
    if (welcomeMessage) {
      welcomeMessage.classList.add('hidden')
    }
  }

  showWelcomeMessage() {
    // Show the "No tabs open" indicator
    const noTabsIndicator = this.tabBarTarget.querySelector('.flex.items-center.h-full')
    if (noTabsIndicator) {
      noTabsIndicator.classList.remove('hidden')
    }
    
    // Show the welcome message
    const welcomeMessage = this.contentAreaTarget.querySelector('.absolute.inset-0.flex.items-center.justify-center')
    if (welcomeMessage) {
      welcomeMessage.classList.remove('hidden')
    }
  }

  focusTab(event) {
    let tabId
    
    if (typeof event === 'string') {
      // Called programmatically with tabId
      tabId = event
    } else {
      // Called from click event
      event.stopPropagation()
      tabId = event.currentTarget.dataset.tabId
    }

    this.setActiveTab(tabId)
  }

  closeTab(event) {
    event.stopPropagation()
    const tabId = event.currentTarget.dataset.tabId
    
    // Remove tab element
    const tabElement = this.tabBarTarget.querySelector(`[data-tab-id="${tabId}"]`)
    if (tabElement) {
      tabElement.remove()
    }

    // Remove content
    const contentElement = document.getElementById(tabId)
    if (contentElement) {
      contentElement.remove()
    }

    // Remove from open tabs
    const wasActive = this.openTabs.get(tabId)?.active
    this.openTabs.delete(tabId)

    // If closed tab was active, focus another tab
    if (wasActive && this.openTabs.size > 0) {
      const firstTabId = Array.from(this.openTabs.keys())[0]
      this.focusTab(firstTabId)
    }

    // If no tabs left, show welcome message
    if (this.openTabs.size === 0) {
      this.showWelcomeMessage()
    }
  }

  // Method to activate a tab when its content is loaded
  activateLoadedTab(event) {
    const tabId = event.target.dataset.loadedTabId
    if (tabId) {
      this.setActiveTab(tabId)
    }
  }
}