import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ["container"]

  connect() {
    this.element.scrollTop = this.element.scrollHeight;
  }
}