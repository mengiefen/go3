import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ['backdrop', 'navigationPanel'];

  connect() {
    console.log('Mobile menu controller connected');
    
    // Listen for sidebar state changes
    this.sidebarOpen = false;
    
    // Add keyboard event listener
    this.handleKeydownBound = this.handleKeydown.bind(this);
    document.addEventListener('keydown', this.handleKeydownBound);
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
    this.updateSidebarState();
  }

  closeSidebar() {
    this.sidebarOpen = false;
    this.updateSidebarState();
  }

  updateSidebarState() {
    if (this.sidebarOpen) {
      // Show navigation panel
      if (this.hasNavigationPanelTarget) {
        this.navigationPanelTarget.classList.remove('-translate-x-full');
      }
      
      // Show backdrop
      if (this.hasBackdropTarget) {
        this.backdropTarget.classList.remove('hidden');
      }
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Load navigation content if needed
      this.loadNavigationContent();
    } else {
      // Hide navigation panel
      if (this.hasNavigationPanelTarget) {
        this.navigationPanelTarget.classList.add('-translate-x-full');
      }
      
      // Hide backdrop
      if (this.hasBackdropTarget) {
        this.backdropTarget.classList.add('hidden');
      }
      
      // Restore body scroll
      document.body.style.overflow = '';
    }
    
    // Dispatch event for other components
    this.dispatch('sidebar-toggled', { detail: { open: this.sidebarOpen } });
  }
  
  loadNavigationContent() {
    // Load the secondary sidebar content into the navigation panel
    const secondarySidebar = document.getElementById('secondary-sidebar');
    if (secondarySidebar && this.hasNavigationPanelTarget) {
      // Clone the navigation sidebar content
      const content = secondarySidebar.cloneNode(true);
      content.id = 'mobile-navigation-content';
      
      // Clear and append to navigation panel
      this.navigationPanelTarget.innerHTML = '';
      this.navigationPanelTarget.appendChild(content);
    }
  }
  
  goBack() {
    // Handle back navigation
    window.history.back();
  }

  // Close sidebar on escape key
  handleKeydown(event) {
    if (event.key === 'Escape' && this.sidebarOpen) {
      this.closeSidebar();
    }
  }

  disconnect() {
    // Restore body scroll if sidebar was open
    document.body.style.overflow = '';
    
    // Remove keyboard event listener
    if (this.handleKeydownBound) {
      document.removeEventListener('keydown', this.handleKeydownBound);
    }
  }
}