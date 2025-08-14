import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = {
    rtl: Boolean
  }

  connect() {
    this.updateDirection()
  }

  updateDirection() {
    const languageSelect = document.querySelector('select[name="user[language]"]')
    const selectedLanguage = languageSelect.value
    const isRtl = this.isRtlLanguage(selectedLanguage)
    
    // Update the RTL value
    this.rtlValue = isRtl
    
    // Update the body direction
    let body = document.getElementsByTagName("body")[0]
    body.setAttribute("dir", isRtl ? "rtl" : "ltr")
  }

  isRtlLanguage(code) {
    const rtlLanguages = ['ar', 'fa', 'ur']
    return rtlLanguages.includes(code)
  }
} 