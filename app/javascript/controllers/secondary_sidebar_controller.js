import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ['chevron', 'categoryItems'];

  toggleCategory(event) {
    const categoryName = event.currentTarget.dataset.categoryName;
    const chevron = event.currentTarget.querySelector('[data-secondary-sidebar-target="chevron"]');
    const items = event.currentTarget.nextElementSibling;

    if (items.classList.contains('hidden')) {
      items.classList.remove('hidden');
      chevron.classList.add('rotate-90');
    } else {
      items.classList.add('hidden');
      chevron.classList.remove('rotate-90');
    }
  }

  openTab(event) {
    const contentType = event.currentTarget.dataset.contentType;
    const contentId = event.currentTarget.dataset.contentId;
    const contentName = event.currentTarget.dataset.contentName;

    // Always create new tab (allow multiple instances)
    console.log('Creating new tab for:', contentType, contentId, contentName);
    this.createNewTab(contentType, contentId, contentName);
  }

  createNewTab(contentType, contentId, contentName) {
    let url, tabId;

    // Get tabs controller reference
    const tabsController = this.application.getControllerForElementAndIdentifier(
      document.querySelector('[data-controller="vscode-tabs"]'),
      'vscode-tabs'
    );

    // Generate unique tab ID to support multiple instances
    if (contentType.startsWith('task_')) {
      const filterType = contentType.replace('task_', '');
      tabId = tabsController ? tabsController.generateUniqueTabId(`tasks-${filterType}`, contentId) : `tab-tasks-${filterType}-${contentId}-${Date.now()}`;
      url = `/tasks/content/${filterType}/${contentId}?content_name=${encodeURIComponent(contentName)}&frame_id=frame-${tabId}`;
    } else {
      tabId = tabsController ? tabsController.generateUniqueTabId(contentType, contentId) : `tab-${contentType}-${contentId}-${Date.now()}`;
      url = `/tab-demo/content/${contentType}/${contentId}?content_name=${encodeURIComponent(contentName)}&frame_id=frame-${tabId}`;
    }

    // Add tab to tab bar
    if (tabsController) {
      tabsController.addTab(tabId, contentName || `${contentType} ${contentId}`);
      console.log('Tab added with ID:', tabId);
    }

    // Small delay to ensure DOM is updated
    setTimeout(() => {
      // Load content via Turbo Frame
      const contentContainer = document.getElementById(tabId);
      console.log('Looking for container:', tabId, 'Found:', contentContainer);
      if (contentContainer) {
      // Create turbo frame for this tab
      const turboFrame = document.createElement('turbo-frame');
      turboFrame.id = `frame-${tabId}`;
      turboFrame.src = url;
      turboFrame.dataset.loadedTabId = tabId;
      
      // Listen for frame load event
      turboFrame.addEventListener('turbo:frame-load', (event) => {
        console.log('Frame loaded for tab:', tabId);
        if (tabsController) {
          tabsController.setActiveTab(tabId);
        }
      });
      
      // Add frame to content container
      contentContainer.appendChild(turboFrame);
      } else {
        console.error('Content container not found for tab:', tabId);
      }
    }, 10);
  }
}
