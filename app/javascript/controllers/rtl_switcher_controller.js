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
    
    // Update the document direction
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr'
    
    // Add or remove RTL-specific classes
    if (isRtl) {
      document.documentElement.classList.add('rtl')
    } else {
      document.documentElement.classList.remove('rtl')
    }
  }

  isRtlLanguage(code) {
    const rtlLanguages = ['ar', 'fa', 'ur']
    return rtlLanguages.includes(code)
  }
} 