import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["activeIndicator"]
  
  connect() {
    // Check localStorage for previously active sidebar
    const savedSidebarType = localStorage.getItem('activeSidebarType')
    
    if (savedSidebarType) {
      // Restore saved state
      const savedSidebarItem = this.element.querySelector(`[data-sidebar-type="${savedSidebarType}"]`)
      if (savedSidebarItem) {
        this.selectSidebar({ currentTarget: savedSidebarItem })
        return
      }
    }
    
    // Check if there's already an active sidebar item, if not, initialize with first one
    const activeItem = this.element.querySelector('.bg-gradient-to-br.from-blue-500.to-blue-600')
    if (activeItem) {
      // There's already an active item set by the component, load its sidebar
      const sidebarType = activeItem.dataset.sidebarType
      // Save this to localStorage
      localStorage.setItem('activeSidebarType', sidebarType)
      this.loadSecondarySidebar(sidebarType)
    } else {
      // No active item, initialize with the first sidebar
      const defaultSidebar = this.element.querySelector('[data-sidebar-type="organizations"]')
      this.selectSidebar({ currentTarget: defaultSidebar })
    }
  }

  selectSidebar(event) {
    const sidebarType = event.currentTarget.dataset.sidebarType
    
    // Save to localStorage
    localStorage.setItem('activeSidebarType', sidebarType)
    
    // Update active state - remove active from all items
    this.element.querySelectorAll('.icon-sidebar-item').forEach(item => {
      item.classList.remove('bg-gradient-to-br', 'from-blue-500', 'to-blue-600', 'text-white', 'shadow-lg', 'shadow-blue-500/25')
      item.classList.add('text-slate-400', 'hover:bg-slate-700', 'hover:text-white')
      
      // Hide active indicator
      const indicator = item.querySelector('[data-icon-sidebar-target="activeIndicator"]')
      if (indicator) {
        indicator.classList.remove('opacity-100')
        indicator.classList.add('opacity-0')
      }
    })
    
    // Add active state to clicked item
    event.currentTarget.classList.remove('text-slate-400', 'hover:bg-slate-700', 'hover:text-white')
    event.currentTarget.classList.add('bg-gradient-to-br', 'from-blue-500', 'to-blue-600', 'text-white', 'shadow-lg', 'shadow-blue-500/25')
    
    // Show active indicator for clicked item
    const activeIndicator = event.currentTarget.querySelector('[data-icon-sidebar-target="activeIndicator"]')
    if (activeIndicator) {
      activeIndicator.classList.remove('opacity-0')
      activeIndicator.classList.add('opacity-100')
    }
    
    // Load secondary sidebar content
    this.loadSecondarySidebar(sidebarType)
  }

  loadSecondarySidebar(sidebarType) {
    let url
    
    // Route to appropriate controller based on sidebar type
    switch(sidebarType) {
      case 'tasks':
        url = `/tasks/sidebar/${sidebarType}`
        break
      default:
        url = `/tab-demo/sidebar/${sidebarType}`
        break
    }
    
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
    })
    .catch(error => {
      console.error('Error loading secondary sidebar:', error)
    })
  }
}