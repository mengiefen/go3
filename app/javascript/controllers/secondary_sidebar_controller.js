import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["chevron", "categoryItems"]

  toggleCategory(event) {
    const categoryName = event.currentTarget.dataset.categoryName
    const chevron = event.currentTarget.querySelector('[data-secondary-sidebar-target="chevron"]')
    const items = event.currentTarget.nextElementSibling
    
    if (items.classList.contains('hidden')) {
      items.classList.remove('hidden')
      chevron.classList.add('rotate-90')
    } else {
      items.classList.add('hidden')
      chevron.classList.remove('rotate-90')
    }
  }

  openTab(event) {
    const contentType = event.currentTarget.dataset.contentType
    const contentId = event.currentTarget.dataset.contentId
    const contentName = event.currentTarget.dataset.contentName
    
    // Check if tab already exists
    const tabsController = this.application.getControllerForElementAndIdentifier(
      document.querySelector('[data-controller="vscode-tabs"]'), 
      "vscode-tabs"
    )
    
    if (tabsController) {
      const existingTabId = `tab-${contentType}-${contentId}`
      const existingTab = document.getElementById(existingTabId)
      
      if (existingTab) {
        // Focus existing tab
        console.log('Focusing existing tab:', existingTabId)
        tabsController.setActiveTab(existingTabId)
        return
      }
    }
    
    // Create new tab
    console.log('Creating new tab for:', contentType, contentId, contentName)
    this.createNewTab(contentType, contentId, contentName)
  }

  createNewTab(contentType, contentId, contentName) {
    const url = `/tab-demo/content/${contentType}/${contentId}?content_name=${encodeURIComponent(contentName)}`
    const tabId = `tab-${contentType}-${contentId}`
    
    // Add tab to tab bar first
    const tabsController = this.application.getControllerForElementAndIdentifier(
      document.querySelector('[data-controller="vscode-tabs"]'), 
      "vscode-tabs"
    )
    
    if (tabsController) {
      tabsController.addTab(tabId, contentName || `${contentType} ${contentId}`)
      // Immediately focus the new tab (even before content loads)
      tabsController.setActiveTab(tabId)
    }
    
    // Load content via Turbo
    fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'text/vnd.turbo-stream.html',
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
    .then(response => response.text())
    .then(html => {
      Turbo.renderStreamMessage(html)
      
      // Re-activate the tab after content is loaded to ensure it's visible
      setTimeout(() => {
        if (tabsController) {
          tabsController.setActiveTab(tabId)
        }
      }, 50)
    })
    .catch(error => {
      console.error('Error loading tab content:', error)
    })
  }
}