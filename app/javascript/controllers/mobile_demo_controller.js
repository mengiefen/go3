import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  connect() {
    console.log('Mobile demo controller connected');
    
    // Listen for navigation events
    this.element.addEventListener('mobile-layout:navigate', (event) => {
      const tab = event.detail.tab;
      console.log('Navigating to tab:', tab);
      
      // Update URL with the mobile tab parameter
      const url = new URL(window.location);
      url.searchParams.set('mobile_tab', tab);
      
      // Navigate to the new URL
      window.location.href = url.toString();
    });
  }
}