// app/javascript/controllers/popover_controller.js
// Stimulus controller for Ui::PopoverComponent
// Supports click and hover triggers, accessibility, and focus management.

import { Controller } from '@hotwired/stimulus';

/**
 * PopoverController
 *
 * Usage: data-controller="popover"
 *        data-popover-trigger-type-value="click|hover"
 *
 * Handles ARIA attributes, focus, and accessibility.
 */
export default class extends Controller {
  static targets = ['trigger', 'panel'];
  static values = {
    triggerType: { type: String, default: 'click' },
  };

  connect() {
    this._open = false;
    this._handleDocumentClick = this._handleDocumentClick.bind(this);
    this._handleEscape = this._handleEscape.bind(this);
    this._setupTrigger();
  }

  disconnect() {
    this._removeListeners();
  }

  // --- Public Stimulus Actions ---

  toggle(event) {
    event.preventDefault();
    this._open ? this.close() : this.open();
  }

  open(event) {
    if (event) event.preventDefault();
    if (this._open) return;
    this._open = true;
    this.panelTarget.classList.remove('hidden');
    this.triggerTarget.setAttribute('aria-expanded', 'true');
    document.addEventListener('mousedown', this._handleDocumentClick);
    document.addEventListener('keydown', this._handleEscape);
    // Focus management: move focus to panel if interactive
    if (this.panelTarget.tabIndex >= 0) {
      this.panelTarget.focus();
    }
  }

  close(event) {
    if (event) event.preventDefault();
    if (!this._open) return;
    this._open = false;
    this.panelTarget.classList.add('hidden');
    this.triggerTarget.setAttribute('aria-expanded', 'false');
    document.removeEventListener('mousedown', this._handleDocumentClick);
    document.removeEventListener('keydown', this._handleEscape);
    // Optionally return focus to trigger
    if (this.triggerTarget.tabIndex >= 0) {
      this.triggerTarget.focus();
    }
  }

  // --- Private ---

  _setupTrigger() {
    if (this.triggerTypeValue === 'hover') {
      this.triggerTarget.addEventListener('mouseenter', this.open.bind(this));
      this.triggerTarget.addEventListener('mouseleave', this.close.bind(this));
      this.panelTarget.addEventListener('mouseenter', this.open.bind(this));
      this.panelTarget.addEventListener('mouseleave', this.close.bind(this));
    }
  }

  _removeListeners() {
    document.removeEventListener('mousedown', this._handleDocumentClick);
    document.removeEventListener('keydown', this._handleEscape);
    if (this.triggerTypeValue === 'hover') {
      this.triggerTarget.removeEventListener('mouseenter', this.open.bind(this));
      this.triggerTarget.removeEventListener('mouseleave', this.close.bind(this));
      this.panelTarget.removeEventListener('mouseenter', this.open.bind(this));
      this.panelTarget.removeEventListener('mouseleave', this.close.bind(this));
    }
  }

  _handleDocumentClick(event) {
    if (!this.element.contains(event.target)) {
      this.close();
    }
  }

  _handleEscape(event) {
    if (event.key === 'Escape' || event.keyCode === 27) {
      this.close();
    }
  }
}
