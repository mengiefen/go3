import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["dropdown"]

  connect() {
    document.addEventListener("click", this.hide.bind(this))
    this.dropdownTarget.addEventListener("click", this.handleClickInside.bind(this))
  }

  disconnect() {
    document.removeEventListener("click", this.hide.bind(this))
    this.dropdownTarget.removeEventListener("click", this.handleClickInside.bind(this))
  }

  toggle() {
    this.dropdownTarget.classList.toggle("hidden")
  }

  hide(event) {
    if (!this.element.contains(event.target)) {
      this.dropdownTarget.classList.add("hidden")
    }
  }

  handleClickInside(event) {
    const tag = event.target.tagName.toLowerCase()
    if (tag === "a" || tag === "button") {
      this.dropdownTarget.classList.add("hidden")
    }
  }
}
