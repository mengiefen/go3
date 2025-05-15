// filepath: /home/baloz/uV/side-projects/Collab/go3/app/javascript/controllers/tabs_controller.js
import { Controller } from '@hotwired/stimulus';

// Connects to data-controller="tabs"
export default class extends Controller {
  static targets = ['tab', 'panel'];
  static values = {
    activeTab: { type: String, default: '' },
    tabParam: { type: String, default: 'tab' },
  };

  connect() {
    if (this.activeTabValue === '') {
      // If no active tab is specified, activate the first tab
      this.activateTab(this.tabTargets[0]);
    } else {
      // Find the tab with the matching id and activate it
      const tab = this.tabTargets.find((tab) => tab.id === this.activeTabValue);
      if (tab) {
        this.activateTab(tab);
      } else {
        // Fall back to the first tab if the specified tab doesn't exist
        this.activateTab(this.tabTargets[0]);
      }
    }
  }

  // Tab click handler
  switch(event) {
      event.preventDefault();
    this.activateTab(event.currentTarget);

    // Update URL if needed to maintain tab state
    if (this.tabParamValue) {
      const url = new URL(window.location);
      url.searchParams.set(this.tabParamValue, event.currentTarget.id);
      window.history.pushState({}, '', url);
    }
  }

  // Method to activate a specific tab
  activateTab(tab) {
    // Update active tab value
    this.activeTabValue = tab.id;

    // Deactivate all tabs and panels
    this.tabTargets.forEach((t) => {
      t.classList.remove('active', 'border-blue-500', 'text-blue-600');
      t.classList.add('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300');
      t.setAttribute('aria-selected', 'false');
    });

    this.panelTargets.forEach((panel) => {
      panel.classList.add('hidden');
      panel.setAttribute('aria-hidden', 'true');
    });

    // Activate the selected tab
    tab.classList.remove('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300');
    tab.classList.add('active', 'border-blue-500', 'text-blue-600');
    tab.setAttribute('aria-selected', 'true');

    // Find and show the corresponding panel
    const panelId = tab.getAttribute('aria-controls');
    const panel = this.panelTargets.find((p) => p.id === panelId);

    if (panel) {
      panel.classList.remove('hidden');
      panel.setAttribute('aria-hidden', 'false');
    }
  }
}
