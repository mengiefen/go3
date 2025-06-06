// app/javascript/controllers/tabs_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["navigation", "tabList", "contentContainer"]
  static values = { 
    activeTabId: String,
    tabCounter: Number
  }

  connect() {
    console.log("Tabs controller connected")
    this.tabCounterValue = this.tabCounterValue || 0
    this.activeTabIdValue = this.activeTabIdValue || "welcome"
    
    // Check if we're loading a direct URL
    if (window.location.pathname !== '/') {
      const pathSegments = window.location.pathname.split('/').filter(p => p);
      const baseId = pathSegments[pathSegments.length - 1];
      this.createTab(document.title, window.location.href, baseId);
    } else {
      // Initialize with welcome tab
      this.initializeWelcomeTab()
    }
    
    // Listen for browser back/forward buttons
    window.addEventListener('popstate', this.handlePopState.bind(this))
  }

  handlePopState(event) {
    if (event.state && event.state.tabUrl) {
      const existingTab = this.tabListTarget.querySelector(`[data-tab-url="${event.state.tabUrl}"]`);
      if (existingTab) {
        this.switchToTab(existingTab.dataset.tabId);
      } else {
        const pathSegments = new URL(event.state.tabUrl).pathname.split('/').filter(p => p);
        const baseId = pathSegments[pathSegments.length - 1];
        this.createTab(event.state.tabTitle, event.state.tabUrl, baseId);
      }
    }
  }

  initializeWelcomeTab() {
    console.log("Initializing welcome tab")
    // The welcome tab is already in the HTML, just mark it as active
    const welcomeTab = this.tabListTarget.querySelector('.tab-item')
    if (welcomeTab) {
      welcomeTab.dataset.tabId = "welcome"
      welcomeTab.dataset.tabUrl = window.location.pathname
      welcomeTab.classList.add('active')
      // Also set the tabId on the close button
      const closeButton = welcomeTab.querySelector('button')
      if (closeButton) {
        closeButton.dataset.tabId = "welcome"
      }
    } else {
      // Create welcome tab if it doesn't exist
      this.createWelcomeTab()
    }
  }

  createWelcomeTab() {
    const welcomeTab = this.createTabElement("Welcome", "welcome", window.location.pathname)
    this.tabListTarget.appendChild(welcomeTab)
    
    // Create welcome content
    const welcomeContent = document.createElement('div')
    welcomeContent.dataset.tabId = "welcome"
    welcomeContent.style.display = 'block'
    welcomeContent.innerHTML = '<div class="text-center py-8"><p class="text-gray-600">Select a link from the sidebar</p></div>'
    this.contentContainerTarget.appendChild(welcomeContent)
  }

  // Method to create a new tab (will always create a new instance)
  createTab(title, url, baseId) {
    // Always create a unique tab ID by incrementing counter
    this.tabCounterValue += 1
    const uniqueTabId = `${baseId}_${this.tabCounterValue}`
    
    console.log(`Creating tab: ${title}, URL: ${url}, ID: ${uniqueTabId}`)
    
    // Create new tab element
    const tabElement = this.createTabElement(title, uniqueTabId, url)
    this.tabListTarget.appendChild(tabElement)
    
    // Set tab to loading state
    this.setTabLoadingState(tabElement, true)
    
    // Create and load content for the new tab
    this.createContentDiv(uniqueTabId, url, tabElement)
    
    // Switch to the new tab
    this.switchToTab(uniqueTabId)
    
    // Update browser URL
    this.updateBrowserUrl(url, title)
  }

  createTabElement(title, tabId, url) {
    const li = document.createElement('li')
    li.className = 'tab-item flex items-center gap-1 px-2 py-1 cursor-pointer whitespace-nowrap min-w-0 font-medium text-gray-700 hover:text-gray-900 transition-all duration-200'
    li.dataset.tabId = tabId
    li.dataset.tabUrl = url
    li.dataset.action = 'click->tabs#switchToTab'
    
    li.innerHTML = `
      <div class="flex items-center gap-2 min-w-0">
        <span class="truncate">${title}</span>
      </div>
      <button class="close-btn w-5 h-5 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 ml-2 flex-shrink-0 opacity-100 transform scale-100 transition-all duration-200 relative z-10" 
              data-action="click->tabs#closeTab"
              data-tab-id="${tabId}"
              type="button">
        <svg class="w-3 h-3 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    `
    
    return li
  }

  setTabLoadingState(tabElement, isLoading) {
    if (isLoading) {
      tabElement.classList.add('tab-loading')
      // Add a loading indicator to the tab title
      const titleSpan = tabElement.querySelector('span')
      if (titleSpan && !titleSpan.textContent.includes('...')) {
        titleSpan.textContent += '...'
      }
      
      // Ensure the entire tab remains clickable during loading
      tabElement.style.pointerEvents = 'auto'
      tabElement.style.opacity = '1'
      tabElement.style.zIndex = '1'
      
      // Ensure close button remains accessible during loading
      const closeButton = tabElement.querySelector('.close-btn')
      if (closeButton) {
        closeButton.style.opacity = '1'
        closeButton.style.pointerEvents = 'auto'
        closeButton.style.zIndex = '10'
      }
    } else {
      tabElement.classList.remove('tab-loading')
      // Remove loading indicator from title
      const titleSpan = tabElement.querySelector('span')
      if (titleSpan && titleSpan.textContent.endsWith('...')) {
        titleSpan.textContent = titleSpan.textContent.replace('...', '')
      }
      
      // Reset styles to default (let CSS take over)
      tabElement.style.pointerEvents = ''
      tabElement.style.opacity = ''
      tabElement.style.zIndex = ''
    }
  }

  createContentDiv(tabId, url, tabElement) {
    const contentDiv = document.createElement('div')
    contentDiv.dataset.tabId = tabId
    contentDiv.style.display = 'none'
    contentDiv.innerHTML = '<div class="flex items-center justify-center py-8"><div class="text-gray-500">Content will load here...</div></div>'
    
    this.contentContainerTarget.appendChild(contentDiv)
    console.log(`Created content div for tab: ${tabId}`)
    
    // Load content via fetch
    this.loadTabContent(contentDiv, url, tabElement)
  }

  async loadTabContent(contentDiv, url, tabElement) {
    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'text/html',
          'X-Requested-With': 'XMLHttpRequest',
          'X-Tab-Content': 'true'
        }
      })
      
      if (response.ok) {
        const html = await response.text()
        contentDiv.innerHTML = html
        console.log(`Loaded content for URL: ${url}`)
        
        // Remove loading state from tab
        this.setTabLoadingState(tabElement, false)
        
      } else {
        contentDiv.innerHTML = '<div class="text-center py-8 text-red-500">Error loading content</div>'
        console.error(`Failed to load content from ${url}`)
        
        // Remove loading state
        this.setTabLoadingState(tabElement, false)
      }
    } catch (error) {
      contentDiv.innerHTML = '<div class="text-center py-8 text-red-500">Error loading content</div>'
      console.error('Error fetching content:', error)
      
      // Remove loading state
      this.setTabLoadingState(tabElement, false)
    }
  }

  switchToTab(event) {
    const tabId = event.target ? event.target.closest('.tab-item').dataset.tabId : event
    console.log(`Switching to tab: ${tabId}`)
    
    // Hide all content divs
    this.contentContainerTarget.querySelectorAll('div[data-tab-id]').forEach(div => {
      div.style.display = 'none'
    })
    
    // Also hide the original turbo-frame if it exists (for backward compatibility)
    const originalFrame = this.contentContainerTarget.querySelector('turbo-frame:not([data-tab-id])')
    if (originalFrame) {
      originalFrame.style.display = 'none'
    }
    
    // Remove active class from all tabs
    this.tabListTarget.querySelectorAll('.tab-item').forEach(tab => {
      tab.classList.remove('active')
    })
    
    // Add active class to target tab
    const targetTab = this.tabListTarget.querySelector(`[data-tab-id="${tabId}"]`)
    if (targetTab) {
      targetTab.classList.add('active')
      this.activeTabIdValue = tabId
      
      // Show content for active tab
      if (tabId === 'welcome') {
        // Show welcome content (either original turbo-frame or welcome div)
        const welcomeContent = this.contentContainerTarget.querySelector('[data-tab-id="welcome"]')
        if (welcomeContent) {
          welcomeContent.style.display = 'block'
        } else if (originalFrame) {
          // Fallback to original frame for backward compatibility
          originalFrame.style.display = 'block'
        }
      } else {
        // Show the specific content div for this tab
        const contentDiv = this.contentContainerTarget.querySelector(`div[data-tab-id="${tabId}"]`)
        if (contentDiv) {
          contentDiv.style.display = 'block'
        }
      }
      
      // Update browser URL to match active tab
      const tabUrl = targetTab.dataset.tabUrl
      const tabTitle = targetTab.querySelector('span').textContent
      this.updateBrowserUrl(tabUrl, tabTitle)
    }
  }

  closeTab(event) {
    console.log("close tab is pressed");
    event.stopPropagation() // Prevent tab switching when clicking close button
    event.preventDefault() // Prevent any default behavior
    
    // Get tabId from the button itself or traverse up to find it
    let tabId = event.target.dataset.tabId
    if (!tabId) {
      // If clicked on SVG or path inside button, traverse up to find the button
      const button = event.target.closest('button[data-tab-id]')
      if (button) {
        tabId = button.dataset.tabId
      }
    }
    
    console.log(`Closing tab: ${tabId}`)
    
    // Don't close the welcome tab
    if (tabId === 'welcome') {
      console.log("Cannot close welcome tab")
      return
    }
    
    // If we still don't have a tabId, log error and return
    if (!tabId) {
      console.error("Could not determine tab ID for close operation")
      return
    }
    
    // Get tab element and add closing animation
    const tabElement = this.tabListTarget.querySelector(`[data-tab-id="${tabId}"]`)
    if (tabElement) {
      // Add closing animation
      tabElement.style.transform = 'translateX(-100%)'
      tabElement.style.opacity = '0'
      
      // Remove after animation completes
      setTimeout(() => {
        tabElement.remove()
      }, 200)
    }
    
    // Remove corresponding content div
    const contentDiv = this.contentContainerTarget.querySelector(`div[data-tab-id="${tabId}"]`)
    if (contentDiv) {
      contentDiv.remove()
      console.log(`Removed content div for tab: ${tabId}`)
    }
    
    // If we closed the active tab, switch to welcome tab
    if (this.activeTabIdValue === tabId) {
      this.switchToTab('welcome')
    }
  }

  handleSidebarClick(event) {
    event.preventDefault() // Prevent default link behavior
    
    const link = event.target.closest('a')
    const title = link.dataset.title
    const tabId = link.dataset.tabId
    const url = link.href
    
    console.log(`Sidebar clicked: ${title}, creating new tab instance`)
    
    this.createTab(title, url, tabId)
  }

  updateBrowserUrl(url, title) {
    // Update browser URL without reloading the page
    window.history.pushState({ tabUrl: url, tabTitle: title }, title, url)
    document.title = title
    console.log(`Browser URL updated to: ${url}`)
  }
}