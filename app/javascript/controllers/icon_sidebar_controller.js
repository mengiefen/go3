import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  connect() {
    // Load active item from localStorage or use default
    const savedActive = localStorage.getItem('iconSidebarActive') || 'organizations';
    this.setActiveItem(savedActive);
    
    // Load the saved sidebar content on page load
    const activeButton = this.element.querySelector(`button[data-item-id="${savedActive}"]`);
    if (activeButton && activeButton.dataset.sidebarType) {
      // Trigger sidebar load for the saved active item
      this.loadSidebar(activeButton.dataset.sidebarType);
    }
  }

  selectSidebar(event) {
    event.preventDefault();
    const button = event.currentTarget;
    const itemId = button.dataset.itemId;
    const sidebarType = button.dataset.sidebarType;
    
    // Update active state
    this.setActiveItem(itemId);
    
    // Save to localStorage
    localStorage.setItem('iconSidebarActive', itemId);
    
    // Dispatch event for sidebar change
    this.dispatch('item:selected', { 
      detail: { 
        itemId, 
        sidebarType 
      } 
    });
    
    // Update secondary sidebar using turbo stream
    if (sidebarType) {
      this.loadSidebar(sidebarType);
    }
  }

  goHome(event) {
    window.location.href = '/';
  }

  setActiveItem(itemId) {
    // Remove active state from all buttons
    this.element.querySelectorAll('button[data-item-id]').forEach(btn => {
      btn.classList.remove('bg-blue-500', 'text-white');
      btn.classList.add('hover:bg-slate-200', 'dark:hover:bg-slate-800', 'text-slate-600', 'dark:text-slate-400');
      
      // Remove active indicator
      const indicator = btn.querySelector('.absolute.left-0');
      if (indicator) {
        indicator.remove();
      }
    });
    
    // Add active state to selected button
    const activeButton = this.element.querySelector(`button[data-item-id="${itemId}"]`);
    if (activeButton) {
      activeButton.classList.add('bg-blue-500', 'text-white');
      activeButton.classList.remove('hover:bg-slate-200', 'dark:hover:bg-slate-800', 'text-slate-600', 'dark:text-slate-400');
      
      // Add active indicator
      const indicator = document.createElement('div');
      indicator.className = 'absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full -ml-4';
      activeButton.appendChild(indicator);
    }
  }
  
  loadSidebar(sidebarType) {
    const currentPath = window.location.pathname;
    let sidebarUrl = '';
    
    if (currentPath.includes('tab-demo')) {
      sidebarUrl = `/tab-demo/sidebar/${sidebarType}`;
    } else if (currentPath.includes('reusable-tabs-demo')) {
      sidebarUrl = `/reusable-tabs-demo/sidebar/${sidebarType}`;
    }
    
    console.log('Loading sidebar:', { sidebarType, currentPath });
    console.log('Determined sidebar URL:', sidebarUrl);
    
    if (sidebarUrl) {
      console.log('Fetching sidebar content from:', sidebarUrl);
      fetch(sidebarUrl, {
        headers: {
          'Accept': 'text/vnd.turbo-stream.html',
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(turboStream => {
        console.log('Received turbo stream response:', turboStream.substring(0, 200) + '...');
        
        // Apply the turbo stream
        if (window.Turbo && turboStream.trim()) {
          window.Turbo.renderStreamMessage(turboStream);
          console.log('Turbo stream applied successfully');
        } else {
          console.error('No Turbo available or empty response');
        }
      })
      .catch(error => {
        console.error('Error loading sidebar content:', error);
      });
    }
  }
}