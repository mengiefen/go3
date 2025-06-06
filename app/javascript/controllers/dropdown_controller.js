import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ['menu', 'button', 'item', 'search', 'searchInput', 'buttonText'];
  static classes = ['active', 'inactive', 'selected'];
  static values = {
    searchable: Boolean,
    selectedIndex: Number,
    updateButtonText: Boolean,
  };

  connect() {
    this.selectedIndexValue = this.selectedIndexValue || -1;
  }

  toggle(event) {
    event.stopPropagation();
    this.menuTarget.classList.toggle(this.activeClass);
    this.menuTarget.classList.toggle(this.inactiveClass);

    // Update aria-expanded state
    const expanded = this.buttonTarget.getAttribute('aria-expanded') === 'true';
    this.buttonTarget.setAttribute('aria-expanded', !expanded);

    // Focus search input if dropdown is opened and searchable
    if (!expanded && this.hasSearchInputTarget) {
      setTimeout(() => this.searchInputTarget.focus(), 50);
    }
  }

  hide(event) {
    // Only hide if clicking outside the dropdown
    if (!this.element.contains(event.target)) {
      this.menuTarget.classList.remove(this.activeClass);
      this.menuTarget.classList.add(this.inactiveClass);
      this.buttonTarget.setAttribute('aria-expanded', 'false');
    }
  }

  select(event) {
    event.preventDefault();
    event.stopPropagation();

    // Get the selected item
    const selectedItem = event.currentTarget;

    // Update selected state
    this.updateSelectedItem(selectedItem);

    // Get the selected text and any relevant data
    // Find the actual link/text element within the item if it's a container
    let textElement = selectedItem;
    if (selectedItem.querySelector('a')) {
      textElement = selectedItem.querySelector('a');
    }

    const selectedText = textElement.textContent.trim();
    const selectedValue = textElement.dataset.value || textElement.getAttribute('data-value');

    console.log('Selected item:', selectedItem);
    console.log('Selected text:', selectedText);
    console.log('Update button text value:', this.updateButtonTextValue);
    if (this.updateButtonTextValue) {
      console.log('Updating button text to:', selectedText);
      if (this.hasButtonTextTarget) {
        // If we have a specific button text target, update it
        this.buttonTextTarget.textContent = selectedText;
      } else {
        // Otherwise update the button content directly
        // Preserve any icons or other elements by first checking for a span
        const buttonTextSpan = this.buttonTarget.querySelector('span:first-child');
        if (buttonTextSpan) {
          buttonTextSpan.textContent = selectedText;
        } else {
          // If there's no span, we need to be careful not to override icons
          // Check if there's an icon (svg) or other elements we should preserve
          const icon = this.buttonTarget.querySelector('svg');
          if (icon) {
            // If there's an icon, we need to replace text content but keep the icon
            // First, clear everything
            const buttonContent = this.buttonTarget.innerHTML;
            const iconContent = icon.outerHTML;

            // Create a text wrapper span if it doesn't exist
            this.buttonTarget.innerHTML = `<span>${selectedText}</span> ${iconContent}`;
          } else {
            // If no special elements, just update the text
            this.buttonTarget.textContent = selectedText;
          }
        }
      }
    }

    // Dispatch a custom event to let parent components know about the selection
    const selectEvent = new CustomEvent('dropdown:selected', {
      bubbles: true,
      detail: {
        text: selectedText,
        value: selectedValue,
        item: selectedItem,
      },
    });
    this.element.dispatchEvent(selectEvent);

    // Hide the dropdown
    this.menuTarget.classList.remove(this.activeClass);
    this.menuTarget.classList.add(this.inactiveClass);
    this.buttonTarget.setAttribute('aria-expanded', 'false');
  }

  updateSelectedItem(selectedItem) {
    // Remove selected class from all items
    if (this.hasSelectedClass) {
      this.itemTargets.forEach((item) => {
        item.classList.remove(this.selectedClass);
        item.setAttribute('aria-selected', 'false');
      });
    }

    // Add selected class to the chosen item
    if (selectedItem && this.hasSelectedClass) {
      selectedItem.classList.add(this.selectedClass);
      selectedItem.setAttribute('aria-selected', 'true');

      // Update selected index
      this.selectedIndexValue = this.itemTargets.indexOf(selectedItem);
    }
  }

  search(event) {
    if (!this.hasItemTarget) return;

    const searchText = event.target.value.toLowerCase();

    // Filter items based on search text
    this.itemTargets.forEach((item) => {
      const itemText = item.textContent.toLowerCase();
      const display = itemText.includes(searchText) ? 'block' : 'none';
      item.style.display = display;
    });
  }

  clearSearch() {
    if (this.hasSearchInputTarget) {
      this.searchInputTarget.value = '';

      // Show all items
      this.itemTargets.forEach((item) => {
        item.style.display = 'block';
      });

      this.searchInputTarget.focus();
    }
  }
}
