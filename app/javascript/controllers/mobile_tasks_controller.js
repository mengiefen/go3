import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ['list'];
  
  connect() {
    console.log('Mobile tasks controller connected');
    
    // Set up gestures
    this.setupSwipeGestures();
  }
  
  setFilter(event) {
    const filter = event.currentTarget.dataset.filter;
    console.log('Setting filter:', filter);
    
    // Update active state
    event.currentTarget.parentElement.querySelectorAll('button').forEach(btn => {
      btn.classList.remove('bg-blue-100', 'text-blue-700', 'dark:bg-blue-900', 'dark:text-blue-300');
      btn.classList.add('text-gray-600', 'dark:text-gray-400');
    });
    
    event.currentTarget.classList.remove('text-gray-600', 'dark:text-gray-400');
    event.currentTarget.classList.add('bg-blue-100', 'text-blue-700', 'dark:bg-blue-900', 'dark:text-blue-300');
    
    // Dispatch filter change
    this.dispatch('filter-change', { 
      detail: { filter },
      bubbles: true 
    });
  }
  
  showSort() {
    console.log('Showing sort options');
    
    // Show sort bottom sheet
    this.dispatch('show-sort', { bubbles: true });
  }
  
  createNew() {
    console.log('Creating new task');
    
    // Show create task form
    this.dispatch('create-new', { bubbles: true });
  }
  
  selectTask(event) {
    const taskId = event.currentTarget.dataset.taskId;
    console.log('Selecting task:', taskId);
    
    // Navigate to task detail
    this.dispatch('select', { 
      detail: { taskId },
      bubbles: true 
    });
  }
  
  toggleStatus(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const taskId = event.currentTarget.dataset.taskId;
    console.log('Toggling task status:', taskId);
    
    // Animate the change
    const taskCard = event.currentTarget.closest('[data-task-id]');
    taskCard.classList.add('opacity-50');
    
    // Update status
    this.dispatch('toggle-status', { 
      detail: { taskId },
      bubbles: true 
    });
    
    // Restore opacity after animation
    setTimeout(() => {
      taskCard.classList.remove('opacity-50');
    }, 300);
  }
  
  quickAdd(event) {
    const input = event.target;
    const title = input.value.trim();
    
    if (!title) return;
    
    console.log('Quick adding task:', title);
    
    // Clear input
    input.value = '';
    
    // Create task
    this.dispatch('quick-add', { 
      detail: { title },
      bubbles: true 
    });
    
    // Show success feedback
    this.showToast('Task added');
  }
  
  showAdvancedAdd() {
    console.log('Showing advanced add form');
    
    // Show full create form
    this.dispatch('show-advanced-add', { bubbles: true });
  }
  
  setupSwipeGestures() {
    let startX = 0;
    let currentX = 0;
    let currentCard = null;
    let swiping = false;
    
    this.element.addEventListener('touchstart', (e) => {
      const card = e.target.closest('[data-task-id]');
      if (card && !e.target.closest('button')) {
        startX = e.touches[0].clientX;
        currentCard = card;
        swiping = true;
      }
    });
    
    this.element.addEventListener('touchmove', (e) => {
      if (!swiping || !currentCard) return;
      
      currentX = e.touches[0].clientX;
      const diff = currentX - startX;
      
      // Prevent scrolling while swiping
      if (Math.abs(diff) > 10) {
        e.preventDefault();
      }
      
      // Apply transform
      if (Math.abs(diff) < 100) {
        currentCard.style.transform = `translateX(${diff}px)`;
        currentCard.style.opacity = 1 - Math.abs(diff) / 200;
      }
    });
    
    this.element.addEventListener('touchend', (e) => {
      if (!swiping || !currentCard) return;
      
      const diff = currentX - startX;
      const taskId = currentCard.dataset.taskId;
      
      // Reset transform
      currentCard.style.transform = '';
      currentCard.style.opacity = '';
      
      // Handle swipe actions
      if (diff > 80) {
        // Swipe right - mark complete
        this.dispatch('mark-complete', { 
          detail: { taskId },
          bubbles: true 
        });
      } else if (diff < -80) {
        // Swipe left - show actions
        this.dispatch('show-actions', { 
          detail: { taskId },
          bubbles: true 
        });
      }
      
      swiping = false;
      currentCard = null;
    });
  }
  
  showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-20 left-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg transform translate-y-full transition-transform';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
      toast.classList.remove('translate-y-full');
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
      toast.classList.add('translate-y-full');
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }
}