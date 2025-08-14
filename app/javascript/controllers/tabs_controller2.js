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
    
    // Initialize with welcome tab
    this.initializeWelcomeTab()
  }

  initializeWelcomeTab() {
    console.log("Initializing welcome tab")
    // The welcome tab is already in the HTML, just mark it as active
    const welcomeTab = this.tabListTarget.querySelector('.tab-item')
    if (welcomeTab) {
      welcomeTab.dataset.tabId = "welcome"
      welcomeTab.classList.add('active')
    }
  }

  // Method to create a new tab (will be called from sidebar links later)
  createTab(title, url, tabId) {
    console.log(`Creating tab: ${title}, URL: ${url}, ID: ${tabId}`)
    
    // Check if tab already exists
    const existingTab = this.tabListTarget.querySelector(`[data-tab-id="${tabId}"]`)
    if (existingTab) {
      console.log("Tab already exists, switching to it")
      this.switchToTab(tabId)
      return
    }

    // Create new tab element
    const tabElement = this.createTabElement(title, tabId)
    this.tabListTarget.appendChild(tabElement)
    
    // Switch to the new tab
    this.switchToTab(tabId)
  }

  createTabElement(title, tabId) {
    const li = document.createElement('li')
    li.className = 'tab-item bg-white border border-gray-300 px-4 py-2 cursor-pointer hover:bg-gray-50'
    li.style.cssText = 'border-bottom: none; margin-right: 2px;'
    li.dataset.tabId = tabId
    li.dataset.action = 'click->tabs#switchToTab'
    
    li.innerHTML = `
      <span>${title}</span>
      <button class="ml-2 text-gray-500 hover:text-gray-700" 
              style="background: none; border: none; font-size: 14px;"
              data-action="click->tabs#closeTab"
              data-tab-id="${tabId}">×</button>
    `
    
    return li
  }

  switchToTab(event) {
    const tabId = event.target ? event.target.closest('.tab-item').dataset.tabId : event
    console.log(`Switching to tab: ${tabId}`)
    
    // Remove active class from all tabs
    this.tabListTarget.querySelectorAll('.tab-item').forEach(tab => {
      tab.classList.remove('active')
    })
    
    // Add active class to clicked tab
    const targetTab = this.tabListTarget.querySelector(`[data-tab-id="${tabId}"]`)
    if (targetTab) {
      targetTab.classList.add('active')
      this.activeTabIdValue = tabId
    }
  }

  closeTab(event) {
    event.stopPropagation() // Prevent tab switching when clicking close button
    const tabId = event.target.dataset.tabId
    console.log(`Closing tab: ${tabId}`)
    
    // Don't close the welcome tab
    if (tabId === 'welcome') {
      console.log("Cannot close welcome tab")
      return
    }
    
    // Remove tab element
    const tabElement = this.tabListTarget.querySelector(`[data-tab-id="${tabId}"]`)
    if (tabElement) {
      tabElement.remove()
    }
    
    // If we closed the active tab, switch to welcome tab
    if (this.activeTabIdValue === tabId) {
      this.switchToTab('welcome')
    }
  }
}