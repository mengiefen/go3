import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static values = { id: Number, title: String };

  openTab(event) {
    // Prevent default link behavior
    event.preventDefault();
    
    console.log('Opening task tab:', this.idValue, this.titleValue);

    // Get VSCode tabs controller
    const tabsController = this.application.getControllerForElementAndIdentifier(
      document.querySelector('[data-controller="vscode-tabs"]'),
      'vscode-tabs'
    );

    if (!tabsController) {
      console.error('VSCode tabs controller not found');
      return;
    }

    // Generate unique tab ID for this task
    const tabId = tabsController.generateUniqueTabId('task', this.idValue);
    
    // Create the URL for loading task details
    const url = `/tasks/${this.idValue}?frame_id=frame-${tabId}`;

    // Add tab to tab bar
    tabsController.addTab(tabId, this.titleValue || `Task #${this.idValue}`);

    // Create and load content
    setTimeout(() => {
      const contentContainer = document.getElementById(tabId);
      if (contentContainer) {
        // Create turbo frame for this task
        const turboFrame = document.createElement('turbo-frame');
        turboFrame.id = `frame-${tabId}`;
        turboFrame.src = url;
        turboFrame.dataset.turboFrameRequestsFormat = 'html';
        
        // Listen for frame load event
        turboFrame.addEventListener('turbo:frame-load', () => {
          console.log('Task frame loaded:', tabId);
          tabsController.setActiveTab(tabId);
        });
        
        // Add frame to content container
        contentContainer.appendChild(turboFrame);
      }
    }, 10);
  }

  stopPropagation(event) {
    // Stop event propagation for action buttons
    event.stopPropagation();
  }

  openEditTab(event) {
    // Prevent default behavior and stop propagation
    event.preventDefault();
    event.stopPropagation();
    
    const taskId = event.currentTarget.dataset.taskId;
    const taskTitle = event.currentTarget.dataset.taskTitle;
    
    console.log('Opening edit tab for task:', taskId, taskTitle);

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
    const tabId = tabsController.generateUniqueTabId('task-edit', taskId);
    
    // Create the URL for loading task edit form
    const url = `/tasks/${taskId}/edit?frame_id=frame-${tabId}`;

    // Add tab to tab bar
    tabsController.addTab(tabId, `Edit: ${taskTitle || `Task #${taskId}`}`);

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