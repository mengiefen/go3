import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ['category', 'categoryContent', 'chevron', 'searchInput'];
  static values = {
    collapsible: { type: Boolean, default: true },
    searchEnabled: { type: Boolean, default: false }
  };

  connect() {
    console.log('Reusable NavigationSidebar controller connected');
    this.loadCollapsedState();
  }

  toggleCategory(event) {
    if (!this.collapsibleValue) return;
    
    const categoryIndex = event.currentTarget.dataset.categoryIndex;
    const categoryContent = this.categoryContentTargets[categoryIndex];
    const chevron = this.chevronTargets[categoryIndex];
    
    if (!categoryContent || !chevron) return;
    
    const isCollapsed = categoryContent.classList.contains('hidden');
    
    if (isCollapsed) {
      // Expanding - remove hidden and add rotate-90
      categoryContent.classList.remove('hidden');
      chevron.classList.add('rotate-90');
    } else {
      // Collapsing - add hidden and remove rotate-90
      categoryContent.classList.add('hidden');
      chevron.classList.remove('rotate-90');
    }
    
    // Save collapsed state
    this.saveCollapsedState(categoryIndex, !isCollapsed);
  }

  openTab(event) {
    const contentType = event.currentTarget.dataset.contentType;
    const contentId = event.currentTarget.dataset.contentId;
    const contentName = event.currentTarget.dataset.contentName;

    // Remove active class from all items
    this.element.querySelectorAll('.navigation-item').forEach(el => {
      el.classList.remove('bg-blue-50', 'dark:bg-blue-900/20', 'text-blue-600', 'dark:text-blue-400');
    });
    
    // Add active class to selected item
    event.currentTarget.classList.add('bg-blue-50', 'dark:bg-blue-900/20', 'text-blue-600', 'dark:text-blue-400');

    // Always create new tab (allow multiple instances)
    console.log('Creating new tab for:', contentType, contentId, contentName);
    this.createNewTab(contentType, contentId, contentName);
  }

  createNewTab(contentType, contentId, contentName) {
    let url, tabId;

    // Find the tab system controller directly
    const tabsElement = document.querySelector('[data-controller*="tab-system"]');
    console.log('=== DEBUG: Looking for tab-system element ===');
    console.log('tabsElement:', tabsElement);
    console.log('tabsElement controllers:', tabsElement?.dataset.controller);
    
    if (!tabsElement) {
      console.error('No element with tab-system controller found');
      return;
    }
    
    const tabsController = this.application.getControllerForElementAndIdentifier(
      tabsElement,
      'tab-system'
    );
    
    console.log('tabsController:', tabsController);
    
    if (!tabsController) {
      console.error('Tab system controller not found');
      return;
    }

    // Generate unique tab ID to support multiple instances
    if (contentType.startsWith('task_')) {
      // Keep the full type name for task-related content
      tabId = tabsController.generateUniqueTabId(`tasks-${contentType}`, contentId);
      url = `/reusable-tabs-demo/content/${contentType}/${contentId}?content_name=${encodeURIComponent(contentName)}&frame_id=frame-${tabId}`;
    } else {
      tabId = tabsController.generateUniqueTabId(contentType, contentId);
      url = `/reusable-tabs-demo/content/${contentType}/${contentId}?content_name=${encodeURIComponent(contentName)}&frame_id=frame-${tabId}`;
    }

    // Get icon from tab system controller
    const icon = tabsController.getIconForContentType(contentType);
    
    // Add tab to tab bar
    tabsController.addTab(tabId, contentName || `${contentType} ${contentId}`, icon);
    console.log('Tab added with ID:', tabId, 'with icon:', icon);

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

  search(event) {
    if (!this.searchEnabledValue) return;
    
    const searchTerm = event.target.value.toLowerCase();
    
    this.categoryTargets.forEach((category, categoryIndex) => {
      const items = category.querySelectorAll('.navigation-item');
      let hasVisibleItems = false;
      
      items.forEach(item => {
        const itemText = item.textContent.toLowerCase();
        if (itemText.includes(searchTerm)) {
          item.style.display = 'block';
          hasVisibleItems = true;
        } else {
          item.style.display = 'none';
        }
      });
      
      // Show/hide category based on whether it has visible items
      if (hasVisibleItems) {
        category.style.display = 'block';
        // Expand category if searching
        if (searchTerm && this.collapsibleValue) {
          const categoryContent = this.categoryContentTargets[categoryIndex];
          const chevron = this.chevronTargets[categoryIndex];
          
          if (categoryContent && categoryContent.classList.contains('hidden')) {
            categoryContent.classList.remove('hidden');
            if (chevron) {
              chevron.classList.add('rotate-90');
            }
          }
        }
      } else {
        category.style.display = searchTerm ? 'none' : 'block';
      }
    });
  }

  loadCollapsedState() {
    const savedState = localStorage.getItem('reusableNavigationSidebarCollapsed');
    if (!savedState) return;
    
    try {
      const collapsedState = JSON.parse(savedState);
      
      this.categoryContentTargets.forEach((content, index) => {
        if (collapsedState[index] === true) {
          content.classList.add('hidden');
          if (this.chevronTargets[index]) {
            this.chevronTargets[index].classList.remove('rotate-90');
          }
        } else if (collapsedState[index] === false) {
          content.classList.remove('hidden');
          if (this.chevronTargets[index]) {
            this.chevronTargets[index].classList.add('rotate-90');
          }
        }
      });
    } catch (e) {
      console.error('Error loading collapsed state:', e);
    }
  }

  saveCollapsedState(categoryIndex, isCollapsed) {
    const savedState = localStorage.getItem('reusableNavigationSidebarCollapsed');
    let collapsedState = {};
    
    try {
      if (savedState) {
        collapsedState = JSON.parse(savedState);
      }
    } catch (e) {
      console.error('Error parsing collapsed state:', e);
    }
    
    collapsedState[categoryIndex] = isCollapsed;
    localStorage.setItem('reusableNavigationSidebarCollapsed', JSON.stringify(collapsedState));
  }

  // Reset search and collapsed states
  reset() {
    // Clear search
    if (this.hasSearchInputTarget) {
      this.searchInputTarget.value = '';
      this.search({ target: this.searchInputTarget });
    }
    
    // Reset collapsed states
    localStorage.removeItem('reusableNavigationSidebarCollapsed');
    this.categoryContentTargets.forEach((content, index) => {
      content.classList.remove('hidden');
      if (this.chevronTargets[index]) {
        this.chevronTargets[index].classList.add('rotate-90');
      }
    });
  }
}