import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ['container', 'select', 'options', 'search', 'selectedItems', 'template'];
  static values = {
    open: Boolean,
    placeholderText: String,
  };

  connect() {
    console.log('Multiselect controller connected');
    // Initialize the component
    this.placeholderTextValue = this.placeholderTextValue || 'Select options...';
    this.openValue = false;
    this.updateSelectedDisplay();

    // Close dropdown when clicking outside
    this.outsideClickHandler = this.closeOnOutsideClick.bind(this);
    document.addEventListener('click', this.outsideClickHandler);
  }

  disconnect() {
    document.removeEventListener('click', this.outsideClickHandler);
  }

  toggle(event) {
    console.log('Toggle called', this.openValue);
    event.preventDefault();
    event.stopPropagation(); // Stop event propagation
    this.openValue = !this.openValue;

    console.log('New openValue:', this.openValue);
    console.log('Options element:', this.optionsTarget);

    if (this.openValue) {
      this.optionsTarget.classList.remove('hidden');
      this.optionsTarget.style.display = 'block'; // Force display
      if (this.hasSearchTarget) {
        this.searchTarget.focus();
      }
    } else {
      this.optionsTarget.classList.add('hidden');
      this.optionsTarget.style.display = 'none';
    }
  }

  closeOnOutsideClick(event) {
    if (this.openValue && !this.containerTarget.contains(event.target)) {
      this.openValue = false;
      this.optionsTarget.classList.add('hidden');
    }
  }

  selectOption(event) {
    const checkbox = event.target.closest('input[type="checkbox"]');
    if (!checkbox) return;

    const select = this.selectTarget;
    const option = select.querySelector(`option[value="${checkbox.value}"]`);

    if (option) {
      option.selected = checkbox.checked;
    }

    // Dispatch change event so form validations work
    select.dispatchEvent(new Event('change', { bubbles: true }));

    this.updateSelectedDisplay();
  }

  removeOption(event) {
    const value = event.currentTarget.dataset.value;
    const select = this.selectTarget;
    const option = select.querySelector(`option[value="${value}"]`);

    if (option) {
      option.selected = false;

      // Also update the checkbox if it exists
      const checkbox = this.optionsTarget.querySelector(`input[value="${value}"]`);
      if (checkbox) {
        checkbox.checked = false;
      }
    }

    // Dispatch change event
    select.dispatchEvent(new Event('change', { bubbles: true }));

    this.updateSelectedDisplay();
  }

  updateSelectedDisplay() {
    const select = this.selectTarget;
    const selectedOptions = Array.from(select.selectedOptions);
    const selectedContainer = this.selectedItemsTarget;

    selectedContainer.innerHTML = '';

    if (selectedOptions.length === 0) {
      const placeholder = document.createElement('span');
      placeholder.className = 'text-gray-500';
      placeholder.textContent = this.placeholderTextValue;
      selectedContainer.appendChild(placeholder);
      return;
    }

    selectedOptions.forEach((option) => {
      const tag = document.createElement('span');
      tag.className =
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2 mb-1';
      tag.innerHTML = `
        ${option.text}
        <button type="button" data-value="${option.value}" data-action="click->multiselect#removeOption" class="ml-1 inline-flex text-blue-400 focus:outline-none">
          <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </button>
      `;
      selectedContainer.appendChild(tag);
    });
  }

  search() {
    if (!this.hasSearchTarget) return;

    const query = this.searchTarget.value.toLowerCase();
    const checkboxes = this.optionsTarget.querySelectorAll('.option-item');

    checkboxes.forEach((item) => {
      const text = item.textContent.toLowerCase();
      if (text.includes(query)) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  }
}
