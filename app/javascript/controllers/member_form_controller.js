import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["name", "initial", "email", "inviteButton", "emailError"]

  connect() {
    this.initializeForm()
  }

  initializeForm() {
    // 1. Initials generation from name
    if (this.hasNameTarget && this.hasInitialTarget) {
      this.nameTarget.addEventListener('blur', this.generateInitials.bind(this))
    }

    // 2. Uppercase enforcement for initials
    if (this.hasInitialTarget) {
      this.initialTarget.addEventListener('input', this.enforceInitialsFormat.bind(this))
    }

    // 3. Email validation
    if (this.hasEmailTarget && this.hasInviteButtonTarget && this.hasEmailErrorTarget) {
      this.emailTarget.addEventListener('input', this.validateEmail.bind(this))
    }
  }

  generateInitials(event) {
    const nameInput = event.target
    const initialInput = this.initialTarget
    
    if (!initialInput.value) {
      const name = nameInput.value.trim()
      if (name.length > 0) {
        const words = name.split(/\s+/)
        let initials = ''
        
        if (words.length >= 2) {
          initials = words[0].charAt(0) + words[1].charAt(0)
        } else {
          initials = name.substring(0, 2)
        }
        
        initialInput.value = initials.toUpperCase()
      }
    }
  }

  enforceInitialsFormat(event) {
    const input = event.target
    input.value = input.value.toUpperCase()
    if (input.value.length > 2) {
      input.value = input.value.substring(0, 2)
    }
  }

  validateEmail(event) {
    const email = event.target.value.trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    
    if (email === '') {
      this.inviteButtonTarget.disabled = true
      this.emailErrorTarget.classList.add('hidden')
    } else if (emailRegex.test(email)) {
      this.inviteButtonTarget.disabled = false
      this.emailErrorTarget.classList.add('hidden')
    } else {
      this.inviteButtonTarget.disabled = true
      this.emailErrorTarget.classList.remove('hidden')
    }
  }
}
