import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ['node', 'toggle', 'children'];

  toggleNode(event) {
    const toggle = event.currentTarget;
    const node = toggle.closest("[data-tree-view-target='node']");
    const children = node.querySelector("[data-tree-view-target='children']");

    if (children) {
      children.classList.toggle('hidden');

      // Update the toggle icon
      const isExpanded = !children.classList.contains('hidden');
      toggle.innerHTML = isExpanded
        ? '<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>'
        : '<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>';

      // Save expanded state
      this.saveExpandedState(node.dataset.id, isExpanded);
    }
  }

  // Private methods
  saveExpandedState(nodeId, isExpanded) {
    const storageKey = 'treeView-expandedNodes';
    let expandedNodes = JSON.parse(localStorage.getItem(storageKey) || '{}');

    expandedNodes[nodeId] = isExpanded;
    localStorage.setItem(storageKey, JSON.stringify(expandedNodes));
  }
}
