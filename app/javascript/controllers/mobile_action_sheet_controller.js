import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ['backdrop', 'sheet'];
  
  connect() {
    console.log('Mobile action sheet controller connected');
    
    // Auto-show on connect
    setTimeout(() => this.show(), 10);
  }
  
  show() {
    // Show backdrop
    this.backdropTarget.classList.remove('opacity-0');
    this.backdropTarget.classList.add('opacity-100');
    
    // Show sheet
    this.sheetTarget.classList.remove('translate-y-full');
    this.sheetTarget.classList.add('translate-y-0');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }
  
  close() {
    // Hide backdrop
    this.backdropTarget.classList.add('opacity-0');
    this.backdropTarget.classList.remove('opacity-100');
    
    // Hide sheet
    this.sheetTarget.classList.add('translate-y-full');
    this.sheetTarget.classList.remove('translate-y-0');
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Remove element after animation
    setTimeout(() => {
      this.element.remove();
    }, 300);
  }
  
  disconnect() {
    // Restore body scroll if sheet was open
    document.body.style.overflow = '';
  }
}