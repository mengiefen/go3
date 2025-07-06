import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  navigate(event) {
    const item = event.params.item;
    console.log('Navigating to:', item);
    
    // Dispatch custom event for navigation
    this.dispatch('navigate', { 
      detail: { item },
      bubbles: true 
    });
    
    // Handle specific navigation
    switch(item) {
      case 'home':
        // Navigate to home
        window.location.href = '/';
        break;
      case 'organizations':
        // Show organizations panel
        this.showOrganizationsPanel();
        break;
      case 'members':
        // Navigate to members
        window.location.href = '/members';
        break;
      case 'menu':
        // Show menu sheet
        this.showMenuSheet();
        break;
    }
  }
  
  showOrganizationsPanel() {
    // Trigger the mobile menu to show organizations
    const mobileMenu = document.querySelector('[data-controller~="mobile-menu"]');
    if (mobileMenu) {
      const controller = this.application.getControllerForElementAndIdentifier(mobileMenu, 'mobile-menu');
      if (controller) {
        controller.toggleSidebar();
      }
    }
  }
  
  showMenuSheet() {
    // Show a bottom sheet with more options
    this.dispatch('show-menu-sheet', { bubbles: true });
  }
}