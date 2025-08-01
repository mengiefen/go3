import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ["submitButton", "userIds"]

  static values = {
    selectedUserIds: {
      type: Array, 
      default: []
    }
  }

  connect() {
    this.selectedUserIdsValue.splice(0, this.selectedUserIdsValue.length)
  }

  toggle(e) {
    let id = e.currentTarget.getAttribute("id")
    if (this.selectedUserIdsValue.includes(id)) {
      this.selectedUserIdsValue.splice(this.selectedUserIdsValue.indexOf(id), 1)
      e.currentTarget.classList.remove("selected")
    } else {
      this.selectedUserIdsValue.push(id)
      e.currentTarget.classList.add("selected")
    }
    this.userIdsTarget.value = this.selectedUserIdsValue;
    this.checkSelectedUsers();
  }

  search(e) {
    let searchText = e.target.value.toLowerCase();
    
    let items = this.element.querySelectorAll("li")

    items.forEach(item => {
      if (item.textContent.toLowerCase().includes(searchText)) {
        item.classList.remove("hidden")
      } else {
        item.classList.add("hidden")
      }
    })
  }

  checkSelectedUsers() {
    if (this.selectedUserIdsValue.length == 0) {
      this.submitButtonTarget.disabled = true
      this.submitButtonTarget.classList.remove('opacity-50', 'cursor-not-allowed')
    } else { 
      this.submitButtonTarget.disabled = false
      this.submitButtonTarget.classList.remove('opacity-50', 'cursor-not-allowed')
    }
  }
}