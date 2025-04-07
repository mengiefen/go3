import { Controller } from "@hotwired/stimulus"
import { DateTime } from "luxon"
import { clientTimeZone } from "./timezones"

// Connects to data-controller="timezone"
export default class extends Controller {
  static targets = ["input", "select"]
  
  connect() {
    this.detectTimezone()
  }
  
  detectTimezone() {
    try {
      // Use our enhanced timezone detection
      const detectedTimezone = clientTimeZone()
      
      if (!detectedTimezone) {
        console.error("Enhanced timezone detection failed")
        // Fall back to Luxon if our detection fails
        this.fallbackTimezoneDetection()
        return
      }
      
      console.log("Detected timezone:", detectedTimezone)
      
      // For signup forms, make sure we set the timezone in the hidden input field
      if (this.hasInputTarget) {
        console.log("Setting timezone on input target:", detectedTimezone.name)
        this.inputTarget.value = detectedTimezone.name
      } else {
        console.warn("No input target found for timezone")
        // Try to create a hidden input if we don't have a target
        this.createHiddenInput(detectedTimezone.name)
      }
      
      // Update select dropdown if it exists
      this.updateSelectWithDetectedTimezone(detectedTimezone)
    } catch (e) {
      console.error('Timezone detection error:', e)
      // Fall back to Luxon if our detection fails
      this.fallbackTimezoneDetection()
    }
  }
  
  fallbackTimezoneDetection() {
    try {
      // Get browser's timezone using Luxon
      const timezone = DateTime.now().zoneName
      
      if (!timezone) {
        console.error("Timezone detection failed - Luxon couldn't determine timezone")
        return
      }
      
      console.log("Detected timezone with Luxon:", timezone)
      
      // Create hidden input field for the timezone on forms
      this.createHiddenInput(timezone)
      
      // Update select dropdown if it exists
      this.updateSelectElement(timezone)
    } catch (e) {
      console.error('Fallback timezone detection error:', e)
    }
  }

  updateSelectWithDetectedTimezone(detectedTimezone) {
    // Find timezone select elements
    const timezoneSelects = document.querySelectorAll('select[id$="_timezone"]')
    
    if (timezoneSelects.length === 0) return
    
    timezoneSelects.forEach(select => {
      const options = Array.from(select.options)
      
      // Try to find the option that matches our detected timezone name
      const match = options.find(option => 
        option.text.includes(detectedTimezone.name) || 
        option.value.includes(detectedTimezone.name)
      )
      
      if (match) {
        select.value = match.value
        return
      }
      
      // Fall back to the standard matching algorithm
      this.updateSelectElement(detectedTimezone.name)
    })
  }
  
  createHiddenInput(timezone) {
    // Look for forms that might need the timezone information
    const forms = document.querySelectorAll('form')
    
    forms.forEach(form => {
      // Don't add to forms that shouldn't have timezone (like search forms)
      if (form.method === 'get') return
      
      // Create or update hidden timezone field
      let timezoneField = form.querySelector('input[name="user[timezone]"]')
      if (!timezoneField) {
        timezoneField = document.createElement('input')
        timezoneField.type = 'hidden'
        timezoneField.name = 'user[timezone]'
        form.appendChild(timezoneField)
      }
      
      // Set the timezone value
      timezoneField.value = timezone
    })
  }
  
  updateSelectElement(timezone) {
    // Find timezone select elements
    const timezoneSelects = document.querySelectorAll('select[id$="_timezone"]')
    
    if (timezoneSelects.length === 0) return
    
    timezoneSelects.forEach(select => {
      const options = Array.from(select.options)
      
      // Try exact matching first
      const exactMatch = options.find(option => option.text === timezone || option.value === timezone)
      
      if (exactMatch) {
        select.value = exactMatch.value
        return
      }
      
      // Try to match using Luxon's comprehensive timezone information
      this.findBestTimezoneMatch(select, timezone)
    })
  }
  
  findBestTimezoneMatch(select, timezone) {
    const options = Array.from(select.options)
    const now = DateTime.now()
    
    // Get current timezone info from Luxon
    const currentZone = now.setZone(timezone)
    
    if (!currentZone.isValid) {
      console.error(`Invalid timezone: ${timezone}`)
      return
    }
    
    // Get current offset in minutes
    const offsetMinutes = currentZone.offset
    const offsetHours = offsetMinutes / 60
    
    // Format strings for matching
    const offsetFormatted = `${offsetHours >= 0 ? '+' : ''}${offsetHours}`
    const offsetFormattedWithColon = `${offsetHours >= 0 ? '+' : ''}${Math.floor(Math.abs(offsetHours))}:${Math.abs(offsetMinutes % 60).toString().padStart(2, '0')}`
    const zoneName = currentZone.zoneName
    const zoneAbbr = currentZone.toFormat('ZZZZ') // Abbreviated zone name
    
    // Try matching by offset first (most reliable across all timezones)
    let match = options.find(option => {
      const text = option.text.toLowerCase()
      return text.includes(`utc${offsetFormatted}`) || 
             text.includes(`utc ${offsetFormatted}`) || 
             text.includes(`gmt${offsetFormatted}`) ||
             text.includes(`gmt ${offsetFormatted}`) ||
             text.includes(`${offsetFormatted}:00`) ||
             text.includes(offsetFormattedWithColon)
    })
    
    if (match) {
      select.value = match.value
      return
    }
    
    // Try matching by zone abbreviation
    match = options.find(option => {
      return option.text.includes(zoneAbbr)
    })
    
    if (match) {
      select.value = match.value
      return
    }
    
    // Try matching by continent/city parts
    const parts = zoneName.split('/')
    if (parts.length > 1) {
      const continent = parts[0]
      const location = parts[1].replace(/_/g, ' ')
      
      // Try matching by location (city) first
      match = options.find(option => option.text.toLowerCase().includes(location.toLowerCase()))
      
      if (match) {
        select.value = match.value
        return
      }
      
      // Then try by continent
      match = options.find(option => {
        const text = option.text.toLowerCase()
        // Handle special case for Americas vs America
        if (continent.toLowerCase() === 'america') {
          return text.includes('america') || text.includes('americas')
        }
        return text.includes(continent.toLowerCase())
      })
      
      if (match) {
        select.value = match.value
        return
      }
    }
    
    // As a last resort, find the closest matching offset if no name match found
    this.findClosestOffsetMatch(select, offsetMinutes)
  }
  
  findClosestOffsetMatch(select, targetOffsetMinutes) {
    const options = Array.from(select.options)
    let closestOption = null
    let closestDiff = Infinity
    
    options.forEach(option => {
      // Try to parse the offset from the option text
      // Look for patterns like "UTC+5", "GMT-8", "(GMT+05:30)", etc.
      const offsetMatches = option.text.match(/(UTC|GMT)?([+-])(\d{1,2})(?::(\d{2}))?/i)
      
      if (offsetMatches) {
        const sign = offsetMatches[2] === '+' ? 1 : -1
        const hours = parseInt(offsetMatches[3], 10) || 0
        const minutes = parseInt(offsetMatches[4], 10) || 0
        const totalMinutes = sign * (hours * 60 + minutes)
        
        const diff = Math.abs(totalMinutes - targetOffsetMinutes)
        if (diff < closestDiff) {
          closestDiff = diff
          closestOption = option
        }
      }
    })
    
    if (closestOption) {
      select.value = closestOption.value
    }
  }
} 