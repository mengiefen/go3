import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static values = { id: Number, title: String };

  openEditTab(event) {
    // Prevent default behavior
    event.preventDefault();
    
    console.log('Opening edit tab for task:', this.idValue, this.titleValue);

    // Get VSCode tabs controller
    const tabsController = this.application.getControllerForElementAndIdentifier(
      document.querySelector('[data-controller="vscode-tabs"]'),
      'vscode-tabs'
    );

    if (!tabsController) {
      console.error('VSCode tabs controller not found');
      return;
    }

    // Generate unique tab ID for editing this task
    const tabId = tabsController.generateUniqueTabId('task-edit', this.idValue);
    
    // Create the URL for loading task edit form
    const url = `/tasks/${this.idValue}/edit?frame_id=frame-${tabId}`;

    // Add tab to tab bar
    tabsController.addTab(tabId, `Edit: ${this.titleValue || `Task #${this.idValue}`}`);

    // Create and load content
    setTimeout(() => {
      const contentContainer = document.getElementById(tabId);
      if (contentContainer) {
        // Create turbo frame for editing task
        const turboFrame = document.createElement('turbo-frame');
        turboFrame.id = `frame-${tabId}`;
        turboFrame.src = url;
        turboFrame.dataset.turboFrameRequestsFormat = 'html';
        
        // Listen for frame load event
        turboFrame.addEventListener('turbo:frame-load', () => {
          console.log('Edit task frame loaded:', tabId);
          tabsController.setActiveTab(tabId);
        });
        
        // Add frame to content container
        contentContainer.appendChild(turboFrame);
      }
    }, 10);
  }
}