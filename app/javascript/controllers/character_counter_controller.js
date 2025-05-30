import { Controller } from '@hotwired/stimulus';

// Connects to data-controller="character-counter"
export default class extends Controller {
  static targets = ['counter'];
  static values = {
    textareaId: String,
    max: Number,
  };

  connect() {
    this.textarea = document.getElementById(this.textareaIdValue);
    if (this.textarea) {
      this.updateCounter();
      this.textarea.addEventListener('input', this.updateCounter.bind(this));
    }
  }

  disconnect() {
    if (this.textarea) {
      this.textarea.removeEventListener('input', this.updateCounter.bind(this));
    }
  }

  updateCounter() {
    const currentLength = this.textarea.value.length;
    this.counterTarget.textContent = `${currentLength}/${this.maxValue}`;

    // Add visual indication when approaching limit
    if (currentLength >= this.maxValue * 0.9) {
      this.counterTarget.classList.add('text-amber-500');

      if (currentLength >= this.maxValue) {
        this.counterTarget.classList.remove('text-amber-500');
        this.counterTarget.classList.add('text-red-500');
      }
    } else {
      this.counterTarget.classList.remove('text-amber-500', 'text-red-500');
    }
  }
}
