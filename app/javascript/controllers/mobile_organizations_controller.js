import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ['list'];
  
  connect() {
    console.log('Mobile organizations controller connected');
    
    // Set up pull-to-refresh
    this.setupPullToRefresh();
    
    // Set up swipe actions
    this.setupSwipeActions();
  }
  
  search(event) {
    const query = event.target.value;
    console.log('Searching organizations:', query);
    
    // Debounce search
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.performSearch(query);
    }, 300);
  }
  
  performSearch(query) {
    // In a real app, this would make an API call
    // For now, dispatch an event
    this.dispatch('search', { 
      detail: { query },
      bubbles: true 
    });
  }
  
  selectOrg(event) {
    const orgId = event.currentTarget.dataset.orgId;
    console.log('Selecting organization:', orgId);
    
    // Add selection animation
    event.currentTarget.classList.add('ring-2', 'ring-blue-500');
    
    // Navigate to org detail
    setTimeout(() => {
      this.dispatch('select', { 
        detail: { orgId },
        bubbles: true 
      });
    }, 150);
  }
  
  showActions(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const orgId = event.currentTarget.dataset.orgId;
    console.log('Showing actions for org:', orgId);
    
    // Show action sheet
    this.dispatch('show-actions', { 
      detail: { orgId },
      bubbles: true 
    });
  }
  
  createNew() {
    console.log('Creating new organization');
    
    // Show create form in bottom sheet
    this.dispatch('create-new', { bubbles: true });
  }
  
  setupPullToRefresh() {
    let startY = 0;
    let currentY = 0;
    let pulling = false;
    
    this.listTarget.addEventListener('touchstart', (e) => {
      if (this.listTarget.scrollTop === 0) {
        startY = e.touches[0].clientY;
        pulling = true;
      }
    });
    
    this.listTarget.addEventListener('touchmove', (e) => {
      if (!pulling) return;
      
      currentY = e.touches[0].clientY;
      const diff = currentY - startY;
      
      if (diff > 0 && this.listTarget.scrollTop === 0) {
        e.preventDefault();
        
        // Show pull indicator
        const pullDistance = Math.min(diff * 0.5, 80);
        this.listTarget.style.transform = `translateY(${pullDistance}px)`;
        
        if (diff > 100) {
          this.listTarget.classList.add('refresh-ready');
        }
      }
    });
    
    this.listTarget.addEventListener('touchend', (e) => {
      if (!pulling) return;
      
      pulling = false;
      const diff = currentY - startY;
      
      // Reset transform
      this.listTarget.style.transform = '';
      this.listTarget.classList.remove('refresh-ready');
      
      // Trigger refresh if pulled enough
      if (diff > 100) {
        this.refresh();
      }
    });
  }
  
  setupSwipeActions() {
    let startX = 0;
    let currentX = 0;
    let currentCard = null;
    
    this.element.addEventListener('touchstart', (e) => {
      const card = e.target.closest('[data-org-id]');
      if (card) {
        startX = e.touches[0].clientX;
        currentCard = card;
      }
    });
    
    this.element.addEventListener('touchmove', (e) => {
      if (!currentCard) return;
      
      currentX = e.touches[0].clientX;
      const diff = currentX - startX;
      
      // Swipe left to show actions
      if (diff < -50) {
        currentCard.classList.add('show-actions');
      } else {
        currentCard.classList.remove('show-actions');
      }
    });
    
    this.element.addEventListener('touchend', (e) => {
      currentCard = null;
    });
  }
  
  refresh() {
    console.log('Refreshing organizations list');
    
    // Show loading state
    this.element.classList.add('refreshing');
    
    // In a real app, this would fetch fresh data
    setTimeout(() => {
      this.element.classList.remove('refreshing');
      this.dispatch('refreshed', { bubbles: true });
    }, 1000);
  }
}