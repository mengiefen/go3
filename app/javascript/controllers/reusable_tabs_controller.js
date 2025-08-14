import { Controller } from '@hotwired/stimulus';

console.log('=== REUSABLE TABS CONTROLLER FILE LOADED ===');

export default class extends Controller {
  connect() {
    console.log('Reusable tabs controller connected to element:', this.element);
    console.log('Element data-controller:', this.element.dataset.controller);
    
    // Get reference to the TabSystem controller
    this.tabSystemController = this.application.getControllerForElementAndIdentifier(
      this.element,
      'tab-system'
    );
    
    console.log('Initial tab system controller lookup:', this.tabSystemController);
    
    if (!this.tabSystemController) {
      // If TabSystem controller hasn't connected yet, wait a bit
      console.log('TabSystem controller not found, waiting...');
      setTimeout(() => {
        this.tabSystemController = this.application.getControllerForElementAndIdentifier(
          this.element,
          'tab-system'
        );
        console.log('After timeout, tab system controller:', this.tabSystemController);
        if (!this.tabSystemController) {
          console.error('TabSystem controller still not found after waiting');
        } else {
          console.log('TabSystem controller found after waiting!');
        }
      }, 100);
    } else {
      console.log('TabSystem controller found immediately!');
    }
  }

  // Delegate methods to TabSystem controller
  addTab(tabId, tabName) {
    console.log('=== REUSABLE TABS: addTab called ===');
    console.log('tabId:', tabId, 'tabName:', tabName);
    console.log('tabSystemController available:', !!this.tabSystemController);
    
    if (!this.tabSystemController) {
      console.error('TabSystem controller not found');
      return;
    }
    
    // Get icon based on content type
    const icon = this.getIconForTab(tabId);
    console.log('Generated icon:', icon);
    console.log('Calling tabSystemController.addTab...');
    this.tabSystemController.addTab(tabId, tabName, icon);
  }

  generateUniqueTabId(contentType, contentId) {
    if (!this.tabSystemController) {
      console.error('TabSystem controller not found');
      return `tab-${contentType}-${contentId}-${Date.now()}`;
    }
    
    return this.tabSystemController.generateUniqueTabId(contentType, contentId);
  }

  setTabLoading(tabId, isLoading) {
    if (!this.tabSystemController) {
      console.error('TabSystem controller not found');
      return;
    }
    
    this.tabSystemController.setTabLoading(tabId, isLoading);
  }

  setActiveTab(tabId) {
    if (!this.tabSystemController) {
      console.error('TabSystem controller not found');
      return;
    }
    
    this.tabSystemController.setActiveTab(tabId);
  }

  // Get icon for tab based on ID
  getIconForTab(tabId) {
    let contentType = '';
    
    if (tabId.includes('organization')) {
      contentType = 'organization';
    } else if (tabId.includes('user')) {
      contentType = 'user';
    } else if (tabId.includes('admin')) {
      contentType = 'admin';
    } else if (tabId.includes('department')) {
      contentType = 'department';
    } else if (tabId.includes('campaign')) {
      contentType = 'campaign';
    } else if (tabId.includes('report')) {
      contentType = 'report';
    } else if (tabId.includes('tasks')) {
      contentType = 'tasks';
    } else if (tabId.includes('task')) {
      contentType = 'task';
    }
    
    return this.tabSystemController ? this.tabSystemController.getIconForContentType(contentType) : null;
  }
}