import { Controller } from '@hotwired/stimulus';

// Connects to data-controller="select"
export default class extends Controller {
  static targets = ['select', 'options', 'trigger', 'selectedItems', 'search', 'badge', 'value'];
  static values = {
    placeholder: String,
    multiple: Boolean,
    closeOnSelect: Boolean,
  };

  connect() {
    this.closeOnSelectValue = this.hasCloseOnSelectValue ? this.closeOnSelectValue : !this.multipleValue;
    this.clickOutsideHandler = this.clickOutside.bind(this);
    document.addEventListener('click', this.clickOutsideHandler);

    // Initialize the select
    this.updateSelectedDisplay();

    // Add keyboard navigation
    this.element.addEventListener('keydown', this.handleKeydown.bind(this));
  }

  disconnect() {
    document.removeEventListener('click', this.clickOutsideHandler);
  }

  clickOutside(event) {
    if (!this.element.contains(event.target) && this.isOpen()) {
      this.close();
    }
  }

  toggle(event) {
    event.stopPropagation();
    event.preventDefault();

    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    if (!this.hasOptionsTarget) return;

    this.optionsTarget.classList.remove('hidden');
    this.optionsTarget.classList.add('open');
    this.triggerTarget.setAttribute('aria-expanded', 'true');

    // Focus the search if it exists
    if (this.hasSearchTarget) {
      setTimeout(() => this.searchTarget.focus(), 50);
    }

    // Scroll to first selected option
    this.scrollToFirstSelected();
  }

  close() {
    if (!this.hasOptionsTarget || !this.hasTriggerTarget) return;

    this.optionsTarget.classList.add('hidden');
    this.optionsTarget.classList.remove('open');
    this.triggerTarget.setAttribute('aria-expanded', 'false');
  }

  isOpen() {
    if (!this.hasOptionsTarget) return false;
    return !this.optionsTarget.classList.contains('hidden');
  }
  search(event) {
    const searchTerm = event.target.value.toLowerCase();

    this.element.querySelectorAll('.option-item').forEach((item) => {
      const text = item.textContent.toLowerCase();
      item.classList.toggle('hidden', !text.includes(searchTerm));
    });
  }

  selectOption(event) {
    const optionItem = event.target.closest('.option-item');
    if (!optionItem) return;

    event.preventDefault();

    const value = optionItem.dataset.value;

    if (this.multipleValue) {
      const checkbox = optionItem.querySelector('input[type="checkbox"]');
      if (!checkbox) return;

      checkbox.checked = !checkbox.checked;

      // Update the hidden select
      const options = this.selectTarget.querySelectorAll('option');
      options.forEach((option) => {
        if (option.value === checkbox.value) {
          option.selected = checkbox.checked;
        }
      });

      this.updateSelectedDisplay();
      this.selectTarget.dispatchEvent(new Event('change', { bubbles: true }));

      if (this.closeOnSelectValue) {
        this.close();
      }
    } else {
      // Single select behavior
      this.selectTarget.value = value;
      this.updateSelectedDisplay();
      this.selectTarget.dispatchEvent(new Event('change', { bubbles: true }));
      this.close();
    }
  }

  updateSelectedDisplay() {
    if (!this.hasSelectedItemsTarget) return;

    // Clear current display
    this.selectedItemsTarget.innerHTML = '';

    const selectedOptions = Array.from(this.selectTarget.selectedOptions);

    if (selectedOptions.length === 0) {
      this.selectedItemsTarget.innerHTML = `<span class="text-gray-500">${this.placeholderValue || 'Select...'}</span>`;
      return;
    }

    if (this.multipleValue) {
      // Create badges for each selected option
      selectedOptions.forEach((option) => {
        const badge = document.createElement('span');
        badge.className =
          'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mr-1 mb-1';
        badge.setAttribute('data-select-target', 'badge');
        badge.setAttribute('data-value', option.value);

        badge.innerHTML = `
          ${option.textContent}
          <button type="button" class="ml-1 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-400 hover:text-blue-500 focus:outline-none focus:text-blue-500 transition-colors" data-action="click->select#removeItem" data-value="${option.value}">
            <span class="sr-only">Remove</span>
            <svg class="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
              <path stroke-linecap="round" stroke-width="1.5" d="M1 1l6 6m0-6L1 7" />
            </svg>
          </button>
        `;

        this.selectedItemsTarget.appendChild(badge);
      });
    } else {
      // Just show the selected option text for single select
      this.selectedItemsTarget.textContent = selectedOptions[0]?.textContent || this.placeholderValue;
    }
  }

  removeItem(event) {
    event.stopPropagation();
    const value = event.currentTarget.dataset.value;

    // Update the select element
    const options = this.selectTarget.querySelectorAll('option');
    options.forEach((option) => {
      if (option.value === value) {
        option.selected = false;
      }
    });

    // Update checkboxes
    this.element.querySelectorAll(`input[type="checkbox"][value="${value}"]`).forEach((checkbox) => {
      checkbox.checked = false;
    });

    this.updateSelectedDisplay();
    this.selectTarget.dispatchEvent(new Event('change', { bubbles: true }));
  }

  handleKeydown(event) {
    if (!this.isOpen()) {
      // Open on arrow down/up or space/enter
      if (['ArrowDown', 'ArrowUp', ' ', 'Enter'].includes(event.key)) {
        event.preventDefault();
        this.open();
      }
      return;
    }

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        this.close();
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.navigateOptions(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.navigateOptions(-1);
        break;
      case 'Enter':
      case ' ':
        if (this.hasSearchTarget && document.activeElement === this.searchTarget) {
          return; // Don't handle enter when search is focused
        }
        event.preventDefault();
        this.selectFocusedOption();
        break;
    }
  }

  navigateOptions(direction) {
    const options = Array.from(this.element.querySelectorAll('.option-item:not(.hidden)'));
    if (options.length === 0) return;

    // Find currently focused option
    const currentIndex = options.findIndex((opt) => opt.classList.contains('option-focused'));

    // Remove focus from current option
    options.forEach((opt) => opt.classList.remove('option-focused'));

    // Calculate new index
    let newIndex;
    if (currentIndex === -1) {
      // No option focused yet
      newIndex = direction > 0 ? 0 : options.length - 1;
    } else {
      newIndex = (currentIndex + direction + options.length) % options.length;
    }

    // Focus new option
    options[newIndex].classList.add('option-focused');
    options[newIndex].scrollIntoView({ block: 'nearest' });
  }

  selectFocusedOption() {
    const focusedOption = this.element.querySelector('.option-item.option-focused');
    if (focusedOption) {
      const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window,
      });
      focusedOption.dispatchEvent(event);
    }
  }

  scrollToFirstSelected() {
    const firstSelected = this.element.querySelector('.option-item input:checked');
    if (firstSelected) {
      const optionItem = firstSelected.closest('.option-item');
      if (optionItem) {
        setTimeout(() => optionItem.scrollIntoView({ block: 'nearest' }), 50);
      }
    }
  }

  stopPropagation(event) {
    event.stopPropagation();
  }

  clearAll(event) {
    event.stopPropagation();

    // Clear all selections in the native select
    Array.from(this.selectTarget.options).forEach((option) => {
      option.selected = false;
    });

    // Clear any checkboxes
    this.element.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
      checkbox.checked = false;
    });

    this.updateSelectedDisplay();
    this.selectTarget.dispatchEvent(new Event('change', { bubbles: true }));
  }
}
