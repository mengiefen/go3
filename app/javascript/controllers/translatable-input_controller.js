import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static values = {
    modal: String,
    primaryLanguage: String,
  };

  connect() {
    console.log("TranslatableInput controller connected");
    this.setupSync();
  }

  setupSync() {
    // Get the primary language input (outside modal) - nested attribute structure
    const primaryInput = this.element.querySelector(`input[name*="[${this.primaryLanguageValue}]"]`);
    
    // Get the primary language input inside the modal
    const modal = document.getElementById(this.modalValue);
    const modalPrimaryInput = modal.querySelector(`input[name*="[${this.primaryLanguageValue}]"]`);
    
    if (primaryInput && modalPrimaryInput) {
      // Sync primary input to modal input
      primaryInput.addEventListener('input', (e) => {
        modalPrimaryInput.value = e.target.value;
      });
      
      // Sync modal input to primary input
      modalPrimaryInput.addEventListener('input', (e) => {
        primaryInput.value = e.target.value;
      });
    }
  }

  showModal() {
    const modal = document.getElementById(this.modalValue);
    modal.classList.remove("hidden");
    
    // Sync the current primary input value to modal before showing
    const primaryInput = this.element.querySelector(`input[name*="[${this.primaryLanguageValue}]"]`);
    const modalPrimaryInput = modal.querySelector(`input[name*="[${this.primaryLanguageValue}]"]`);
    
    if (primaryInput && modalPrimaryInput) {
      modalPrimaryInput.value = primaryInput.value;
    }
    
    // Focus on the first input in the modal
    const firstInput = modal.querySelector('input[type="text"]');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  }
}