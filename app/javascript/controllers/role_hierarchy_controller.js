import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ['toggle', 'children']

  connect() {
    console.log('Role hierarchy controller connected')
  }

  toggle(event) {
    event.preventDefault()
    const roleId = event.currentTarget.dataset.roleId
    const toggleButton = event.currentTarget
    const childrenRow = this.element.querySelector(`.children-${roleId}`)
    
    if (childrenRow) {
      // Toggle visibility
      childrenRow.classList.toggle('hidden')
      
      // Toggle icon rotation
      if (childrenRow.classList.contains('hidden')) {
        toggleButton.innerHTML = '<i class="fas fa-plus border border-gray-300 rounded p-1 text-xs leading-3"></i>'
      } else {
        toggleButton.innerHTML = '<i class="fas fa-minus border border-gray-300 rounded p-1  text-xs leading-3"></i>'
      }
    }
  }
}
