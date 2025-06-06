import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ['input', 'clearButton'];

  connect() {
    this.toggleClearButton();
  }

  debounce() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.submit();
    }, 300);

    this.toggleClearButton();
  }

  clear() {
    this.inputTarget.value = '';
    this.inputTarget.focus();
    this.toggleClearButton();
    this.submit();
  }

  startVoiceInput() {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice recognition is not supported in your browser.');
      return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      this.inputTarget.value = transcript;
      this.toggleClearButton();
      this.submit();
    };

    recognition.start();
  }

  submit() {
    const form = this.element.closest('form');
    if (form) {
      form.requestSubmit();
    }
  }

  toggleClearButton() {
    if (this.hasClearButtonTarget) {
      this.clearButtonTarget.classList.toggle('hidden', !this.inputTarget.value);
    }
  }
}
