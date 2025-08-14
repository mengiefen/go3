import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ['searchBar'];

  connect() {
    console.log('Mobile layout controller connected');
    
    // Set up touch gestures
    this.setupTouchGestures();
    
    // Handle safe area insets for iOS
    this.handleSafeArea();
  }

  navigate(event) {
    const tab = event.params.tab;
    console.log('Navigating to:', tab);
    
    // Update active state
    event.currentTarget.parentElement.querySelectorAll('button').forEach(btn => {
      btn.classList.remove('text-blue-500');
      btn.classList.add('text-gray-600', 'dark:text-gray-400');
    });
    
    event.currentTarget.classList.remove('text-gray-600', 'dark:text-gray-400');
    event.currentTarget.classList.add('text-blue-500');
    
    // Dispatch navigation event
    this.dispatch('navigate', { 
      detail: { tab },
      bubbles: true 
    });
    
    // Handle navigation
    switch(tab) {
      case 'home':
        this.loadHomeContent();
        break;
      case 'orgs':
        this.loadOrganizations();
        break;
      case 'tasks':
        this.loadTasks();
        break;
      case 'team':
        this.loadTeam();
        break;
      case 'more':
        this.showMoreOptions();
        break;
    }
  }

  search(event) {
    const query = event.target.value;
    console.log('Searching for:', query);
    
    // Debounce search
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.performSearch(query);
    }, 300);
  }

  performSearch(query) {
    if (query.length < 2) return;
    
    // Show search results in a bottom sheet
    this.dispatch('show-search-results', { 
      detail: { query },
      bubbles: true 
    });
  }

  primaryAction() {
    console.log('Primary action triggered');
    
    // Show action sheet with options
    this.dispatch('show-action-sheet', { bubbles: true });
  }

  setupTouchGestures() {
    let touchStartX = 0;
    let touchEndX = 0;
    
    this.element.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });
    
    this.element.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    });
    
    this.handleSwipe = () => {
      const swipeDistance = touchEndX - touchStartX;
      
      // Swipe right to go back
      if (swipeDistance > 100) {
        this.dispatch('swipe-right', { bubbles: true });
      }
      
      // Swipe left for actions
      if (swipeDistance < -100) {
        this.dispatch('swipe-left', { bubbles: true });
      }
    };
  }

  handleSafeArea() {
    // Add padding for iOS safe areas
    const root = document.documentElement;
    root.style.setProperty('--safe-area-inset-top', 'env(safe-area-inset-top)');
    root.style.setProperty('--safe-area-inset-bottom', 'env(safe-area-inset-bottom)');
  }

  loadHomeContent() {
    // Update URL for demo
    const url = new URL(window.location);
    url.searchParams.set('mobile_tab', 'home');
    window.location.href = url.toString();
  }

  loadOrganizations() {
    // Update URL for demo
    const url = new URL(window.location);
    url.searchParams.set('mobile_tab', 'orgs');
    window.location.href = url.toString();
  }

  loadTasks() {
    // Update URL for demo
    const url = new URL(window.location);
    url.searchParams.set('mobile_tab', 'tasks');
    window.location.href = url.toString();
  }

  loadTeam() {
    // Update URL for demo
    const url = new URL(window.location);
    url.searchParams.set('mobile_tab', 'team');
    window.location.href = url.toString();
  }

  showMoreOptions() {
    // Show more options in bottom sheet
    this.dispatch('show-more-options', { bubbles: true });
  }
}