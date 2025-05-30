import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ['panel', 'toggle', 'icon'];
  static values = {
    expanded: { type: Boolean, default: true },
    mobileBreakpoint: { type: Number, default: 768 }, // Breakpoint for mobile view in pixels
  };

  connect() {
    // Check if the layout is RTL
    this.isRTL = document.querySelector('.rtl') !== null || 
                 document.documentElement.dir === 'rtl';
    
    this.checkMobileView();
    window.addEventListener('resize', this.checkMobileView.bind(this));
    
    // Initialize from saved state if available
    const savedState = localStorage.getItem('sidebarExpanded');
    if (savedState !== null) {
      this.expandedValue = savedState === 'true';
    }
    
    this.updateUI();
    
    // Add custom CSS for collapsed panel
    this.addCollapsedStyles();
  }

  disconnect() {
    window.removeEventListener('resize', this.checkMobileView.bind(this));
  }

  addCollapsedStyles() {
    // Only add these styles once
    if (document.getElementById('collapsible-panel-styles')) return;
    
    const styleElement = document.createElement('style');
    styleElement.id = 'collapsible-panel-styles';
    
    // CSS to handle narrow collapsed state
    styleElement.textContent = `
      .panel-collapsed {
        width: 48px !important;
      }
      
      .panel-collapsed .collapse-when-narrow {
        display: none;
      }
    `;
    
    document.head.appendChild(styleElement);
  }

  checkMobileView() {
    this.isMobileView = window.innerWidth < this.mobileBreakpointValue;
    
    // In mobile view, default to collapsed
    if (this.isMobileView && !this.hasInitializedMobile) {
      this.expandedValue = false;
      this.hasInitializedMobile = true;
    }
    
    this.updateUI();
  }

  toggle() {
    this.expandedValue = !this.expandedValue;
    localStorage.setItem('sidebarExpanded', this.expandedValue.toString());
    this.updateUI();
  }

  updateUI() {
    if (this.hasPanelTarget) {
      if (this.expandedValue) {
        // Expanded state
        this.panelTarget.classList.remove('panel-collapsed', 'hidden');
        
        // For desktop view, restore proper width
        if (!this.isMobileView) {
          // Restore the width from localStorage if available
          const savedWidth = localStorage.getItem('sidebarWidth');
          if (savedWidth) {
            this.panelTarget.style.width = savedWidth;
          } else {
            // Default width if no saved width
            this.panelTarget.style.width = '288px'; // w-72 equivalent
          }
        } else {
          // For mobile, just use default width
          this.panelTarget.style.width = '288px'; // w-72 equivalent
        }
      } else {
        // Collapsed state
        if (this.isMobileView) {
          // In mobile view, completely hide the panel
          this.panelTarget.classList.add('hidden');
        } else {
          // In desktop view, collapse to narrow panel
          this.panelTarget.classList.add('panel-collapsed');
          this.panelTarget.classList.remove('hidden');
        }
      }
    }

    // Update all icon targets
    this.iconTargets.forEach(icon => {
      // Mobile hamburger menu icon
      if (icon.closest('button').classList.contains('md:hidden')) {
        // Always show bars for mobile menu
        this.updateFontAwesomeIcon(icon, 'fa-bars');
        return;
      }
      
      // Panel toggle icon - use different icons based on state
      if (this.expandedValue) {
        // Direction depends on RTL
        this.updateFontAwesomeIcon(icon, this.isRTL ? 'fa-chevron-right' : 'fa-chevron-left');
      } else {
        this.updateFontAwesomeIcon(icon, this.isRTL ? 'fa-chevron-left' : 'fa-chevron-right');
      }
    });
  }
  
  // Better helper to update Font Awesome icon classes
  updateFontAwesomeIcon(iconElement, newIconClass) {
    // Get all classes
    const classes = [...iconElement.classList];
    
    // Remove any existing fa-* classes except fas/far/fab base classes
    classes.forEach(className => {
      if (className.startsWith('fa-') && !['fas', 'far', 'fab', 'fa'].includes(className)) {
        iconElement.classList.remove(className);
      }
    });
    
    // Add the new icon class
    iconElement.classList.add(newIconClass);
    
    // Ensure we have a base class (fas - solid)
    if (!classes.some(c => ['fas', 'far', 'fab', 'fa'].includes(c))) {
      iconElement.classList.add('fas');
    }
  }
} 