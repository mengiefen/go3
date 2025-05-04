import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ['panel', 'backdrop', 'input', 'content', 'triggerContainer', 'defaultTrigger', 'scopeButton'];
  static values = {
    shortcut: String,
    display: String,
  };

  connect() {
    // Set up keyboard listener for shortcut
    if (this.hasShortcutValue && this.shortcutValue) {
      document.addEventListener('keydown', this.handleKeydown.bind(this));
    }
  }

  disconnect() {
    // Clean up event listeners when controller is disconnected
    if (this.hasShortcutValue && this.shortcutValue) {
      document.removeEventListener('keydown', this.handleKeydown.bind(this));
    }
  }
  handleKeydown(event) {
    // Check for Ctrl+K or custom shortcut
    if (this.hasShortcutValue && this.shortcutValue) {
      const key = this.shortcutValue.toUpperCase();

      if ((event.ctrlKey || event.metaKey) && event.key.toUpperCase() === key) {
        event.preventDefault();
        this.open();
        return;
      }
    }

    // Handle Escape key for closing the search panel
    if (event.key === 'Escape') {
      // Only handle ESC if our search is open
      const isOpen = !this.panelTarget.classList.contains('opacity-0');
      if (isOpen) {
        event.preventDefault();
        this.close();
      }
    }
  }

  open() {
    // Show search panel and backdrop
    this.panelTarget.classList.remove('opacity-0', 'pointer-events-none');

    if (this.hasBackdropTarget) {
      this.backdropTarget.classList.remove('opacity-0', 'pointer-events-none');
    }

    // Focus the search input
    setTimeout(() => {
      this.inputTarget.focus();
    }, 50);

    // Add overflow hidden to body for modal style
    if (this.displayValue === 'modal') {
      document.body.style.overflow = 'hidden';
    }
  }

  close(event) {
    // Hide search panel and backdrop
    this.panelTarget.classList.add('opacity-0', 'pointer-events-none');

    if (this.hasBackdropTarget) {
      this.backdropTarget.classList.add('opacity-0', 'pointer-events-none');
    }

    // Remove focus
    this.inputTarget.blur();

    // Restore body overflow
    if (this.displayValue === 'modal') {
      document.body.style.overflow = '';
    }

    // Clear input
    this.inputTarget.value = '';
  }

  toggleScope(event) {
    // Toggle between page and global search
    const clickedButton = event.currentTarget;
    const scope = clickedButton.dataset.scope;

    // Update button states
    this.scopeButtonTargets.forEach((button) => {
      if (button.dataset.scope === scope) {
        button.dataset.state = 'active';
      } else {
        button.dataset.state = 'inactive';
      }
    });

    // Here you would implement logic to change search scope
    // For example, re-run the search with the new scope
    this.inputTarget.focus();
  }

  handleInput(event) {
    // Handle input changes - in a real app, this would trigger search
    const query = event.currentTarget.value.trim();

    // This is where you'd implement actual search logic
    // For example, making an AJAX request to a search endpoint
    console.log(`Searching for: ${query}`);

    // For demo purposes, we're just clearing the content if the input is empty
    if (query === '') {
      // Reset content to empty state
    }
  }
}
