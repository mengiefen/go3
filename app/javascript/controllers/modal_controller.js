// filepath: /home/baloz/uV/side-projects/Collab/go3/app/javascript/controllers/modal_controller.js
import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  connect() {
    // Set up keyboard event handling for the modal
    document.addEventListener('keydown', this.handleKeydown.bind(this));

    // Trap focus within the modal
    this.setupFocusTrap();
  }

  disconnect() {
    // Clean up event listeners when the controller disconnects
    document.removeEventListener('keydown', this.handleKeydown.bind(this));
  }

  open() {
    // Show the modal
    this.element.classList.remove('hidden');

    // Prevent scrolling on the background
    document.body.classList.add('overflow-hidden');

    // Focus on the first focusable element
    this.focusFirstElement();
  }

  close() {
    // Hide the modal
    this.element.classList.add('hidden');

    // Re-enable scrolling
    document.body.classList.remove('overflow-hidden');

    // Dispatch a custom event
    this.element.dispatchEvent(new CustomEvent('modal:closed'));
  }

  handleKeydown(event) {
    // Only handle events when the modal is visible
    if (this.element.classList.contains('hidden')) return;

    // Close the modal when Escape key is pressed
    if (event.key === 'Escape') {
      this.close();
    }
  }

  setupFocusTrap() {
    // Set up focus trapping within the modal for accessibility
    const focusableElements = this.element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Handle tab key to trap focus
    this.element.addEventListener('keydown', (event) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        // If shift+tab and focus is on first element, move to last element
        if (document.activeElement === firstElement) {
          lastElement.focus();
          event.preventDefault();
        }
      } else {
        // If tab and focus is on last element, move to first element
        if (document.activeElement === lastElement) {
          firstElement.focus();
          event.preventDefault();
        }
      }
    });
  }

  focusFirstElement() {
    // Focus the first focusable element for accessibility
    setTimeout(() => {
      const focusableElement = this.element.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElement) {
        focusableElement.focus();
      }
    }, 50);
  }
}
