import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ['panel', 'toggle', 'icon'];
  static values = {
    expanded: { type: Boolean, default: true },
    mobileBreakpoint: { type: Number, default: 768 }, // Breakpoint for mobile view in pixels
  };

  connect() {
    this.checkMobileView();
    window.addEventListener('resize', this.checkMobileView.bind(this));
    
    // Initialize from saved state if available
    const savedState = localStorage.getItem('sidebarExpanded');
    if (savedState !== null) {
      this.expandedValue = savedState === 'true';
    }
    
    this.updateUI();
  }

  disconnect() {
    window.removeEventListener('resize', this.checkMobileView.bind(this));
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
        this.panelTarget.classList.remove('hidden', 'w-0');
        
        // For desktop view, restore proper width
        if (!this.isMobileView) {
          // Restore the width from localStorage if available
          const savedWidth = localStorage.getItem('sidebarWidth');
          if (savedWidth) {
            this.panelTarget.style.width = savedWidth;
          } else {
            // Default width if no saved width
            this.panelTarget.classList.add('w-72');
          }
        } else {
          // For mobile, just use default width
          this.panelTarget.classList.add('w-72');
        }
      } else {
        // Just hide in mobile view, collapse to small width in desktop
        if (this.isMobileView) {
          this.panelTarget.classList.add('hidden');
        } else {
          this.panelTarget.classList.remove('w-72');
          this.panelTarget.classList.add('w-0');
          this.panelTarget.style.width = '0px';
        }
      }
    }

    // Update all icon targets
    this.iconTargets.forEach(icon => {
      // Mobile hamburger menu icon
      if (icon.closest('button').classList.contains('md:hidden')) {
        icon.innerHTML = '☰';
        return;
      }
      
      // Panel toggle icon
      if (this.expandedValue) {
        // Direction depends on RTL
        const isRTL = document.querySelector('.rtl') !== null;
        icon.innerHTML = isRTL ? '&rarr;' : '&larr;';
      } else {
        const isRTL = document.querySelector('.rtl') !== null;
        icon.innerHTML = isRTL ? '&larr;' : '&rarr;';
      }
    });
  }
} 