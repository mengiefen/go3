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
    const tabsElement = document.querySelector('[data-controller="vscode-tabs"]');
    if (!tabsElement) {
      console.error('No element with data-controller="vscode-tabs" found');
      return;
    }
    
    const tabsController = this.application.getControllerForElementAndIdentifier(
      tabsElement,
      'vscode-tabs'
    );
    
    if (!tabsController) {
      console.error('VSCode tabs controller not found');
      return;
    }

    // Generate unique tab ID to support multiple instances
    if (contentType.startsWith('task_')) {
      const filterType = contentType.replace('task_', '');
      tabId = tabsController.generateUniqueTabId(`tasks-${filterType}`, contentId);
      url = `/tasks/content/${filterType}/${contentId}?content_name=${encodeURIComponent(contentName)}&frame_id=frame-${tabId}`;
    } else {
      tabId = tabsController.generateUniqueTabId(contentType, contentId);
      url = `/tab-demo/content/${contentType}/${contentId}?content_name=${encodeURIComponent(contentName)}&frame_id=frame-${tabId}`;
    }

    // Add tab to tab bar
    tabsController.addTab(tabId, contentName || `${contentType} ${contentId}`);
    console.log('Tab added with ID:', tabId);

    // Small delay to ensure DOM is updated
    setTimeout(() => {
      // Load content via Turbo Frame
      const contentContainer = document.getElementById(tabId);
      console.log('Looking for container:', tabId, 'Found:', contentContainer);
      if (contentContainer) {
      // Add loading state to content immediately
      contentContainer.classList.add('content-loading');
      
      // Add loading state to tab after it's created (optional, don't break if it fails)
      setTimeout(() => {
        try {
          tabsController.setTabLoading(tabId, true);
        } catch (e) {
          console.warn('Could not set tab loading state:', e);
        }
      }, 50);
      
      // Create turbo frame for this tab
      const turboFrame = document.createElement('turbo-frame');
      turboFrame.id = `frame-${tabId}`;
      turboFrame.src = url;
      turboFrame.dataset.loadedTabId = tabId;
      turboFrame.dataset.turboFrameRequestsFormat = 'html';
      
      // Listen for frame load start
      turboFrame.addEventListener('turbo:before-frame-render', () => {
        console.log('Frame starting to load for tab:', tabId);
      });
      
      // Listen for frame load event
      turboFrame.addEventListener('turbo:frame-load', () => {
        console.log('Frame loaded for tab:', tabId);
        // Remove loading states
        try {
          tabsController.setTabLoading(tabId, false);
          tabsController.setActiveTab(tabId);
        } catch (e) {
          console.warn('Error removing loading state:', e);
        }
        contentContainer.classList.remove('content-loading');
      });
      
      // Listen for frame error
      turboFrame.addEventListener('turbo:frame-missing', () => {
        console.error('Frame failed to load for tab:', tabId);
        try {
          tabsController.setTabLoading(tabId, false);
        } catch (e) {
          console.warn('Error removing loading state on error:', e);
        }
        contentContainer.classList.remove('content-loading');
        contentContainer.innerHTML = '<div class="p-4 text-red-600">Failed to load content</div>';
      });
      
      // Add frame to content container
      contentContainer.appendChild(turboFrame);
      } else {
        console.error('Content container not found for tab:', tabId);
      }
    }, 10);
  }
}
