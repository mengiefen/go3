import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input"]

  connect() {
    // Initialize with the current language
    this.currentLanguage = document.querySelector('select[name="user[language]"]').value
    console.log('Language switcher connected with initial language:', this.currentLanguage)
    
    // Load translations immediately when controller connects
    this.loadTranslations(this.currentLanguage)
  }

  switchLanguage(event) {
    const newLanguage = event.target.value
    console.log('Switching to language:', newLanguage)
    this.loadTranslations(newLanguage)
  }

  async loadTranslations(language) {
    // Get all unique translation keys from elements with data-i18n attribute
    const keys = Array.from(document.querySelectorAll('[data-i18n]'))
      .map(element => element.dataset.i18n)
      .filter((value, index, self) => self.indexOf(value) === index)
      .join(',')
    
    await this.updateAllTranslations(keys, language)
  }

  async updateAllTranslations(keys, language) {
    try {
      console.log('Fetching translations for language:', language)
      const response = await fetch(`/api/translations?locale=${language}&keys=${keys}`)
      
      if (response.ok) {
        const data = await response.json()
        const translations = data.translations
        
        // Update all elements with their translations
        document.querySelectorAll('[data-i18n]').forEach(element => {
          const key = element.dataset.i18n
          const translation = translations[key]
          
          if (translation && translation !== key) {
            if (element.tagName === 'INPUT' || element.tagName === 'BUTTON') {
              element.value = translation
            } else if (element.tagName === 'A') {
              element.textContent = translation
            } else {
              element.textContent = translation
            }
          } else {
            console.warn(`No translation found for key: ${key}`)
          }
        })

        // Update document direction for RTL languages
        const isRtl = ['ar', 'fa', 'ur'].includes(language)
        document.documentElement.dir = isRtl ? 'rtl' : 'ltr'
        document.documentElement.lang = language
        
        // Store the current language
        this.currentLanguage = language
      } else {
        console.error('Failed to fetch translations:', response.status)
      }
    } catch (error) {
      console.error('Error fetching translations:', error)
    }
  }
}