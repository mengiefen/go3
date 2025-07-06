import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ['backdrop'];
  static values = { dismissible: Boolean };

  connect() {
    console.log('Bottom sheet controller connected');
    
    this.touchStartY = 0;
    this.currentY = 0;
    this.isDragging = false;
  }

  show() {
    // Show backdrop
    if (this.hasBackdropTarget) {
      this.backdropTarget.classList.remove('opacity-0', 'pointer-events-none');
      this.backdropTarget.classList.add('opacity-100', 'pointer-events-auto');
    }
    
    // Show sheet
    this.element.classList.remove('translate-y-full');
    this.element.classList.add('translate-y-0');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Dispatch event
    this.dispatch('shown');
  }

  close() {
    if (!this.dismissibleValue) return;
    
    // Hide backdrop
    if (this.hasBackdropTarget) {
      this.backdropTarget.classList.add('opacity-0', 'pointer-events-none');
      this.backdropTarget.classList.remove('opacity-100', 'pointer-events-auto');
    }
    
    // Hide sheet
    this.element.classList.add('translate-y-full');
    this.element.classList.remove('translate-y-0');
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Dispatch event
    this.dispatch('hidden');
  }

  handleTouchStart(event) {
    if (!this.dismissibleValue) return;
    
    this.touchStartY = event.touches[0].clientY;
    this.isDragging = true;
    
    // Remove transition during drag
    this.element.style.transition = 'none';
  }

  handleTouchMove(event) {
    if (!this.isDragging) return;
    
    this.currentY = event.touches[0].clientY;
    const deltaY = this.currentY - this.touchStartY;
    
    // Only allow dragging down
    if (deltaY > 0) {
      this.element.style.transform = `translateY(${deltaY}px)`;
    }
  }

  handleTouchEnd(event) {
    if (!this.isDragging) return;
    
    this.isDragging = false;
    const deltaY = this.currentY - this.touchStartY;
    
    // Restore transition
    this.element.style.transition = '';
    this.element.style.transform = '';
    
    // If dragged more than 100px, close the sheet
    if (deltaY > 100) {
      this.close();
    }
  }

  // Handle escape key
  handleKeydown(event) {
    if (event.key === 'Escape' && this.dismissibleValue) {
      this.close();
    }
  }

  disconnect() {
    // Restore body scroll if sheet was open
    document.body.style.overflow = '';
  }
}