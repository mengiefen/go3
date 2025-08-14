import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input", "row"]

  filter() {
    const query = this.inputTarget.value.toLowerCase().trim()
    this.rowTargets.forEach((row) => {
      const name = row.children[0].innerText.toLowerCase()
      const email = row.children[2].innerText.toLowerCase()
      row.style.display = name.includes(query) || email.includes(query) ? "" : "none"
    })
  }
}