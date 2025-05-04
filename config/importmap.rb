
# Tailwind CSS
pin "tailwindcss" # @4.1.5

# Add Alpine.js
pin "alpinejs", to: "https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"

# Add Luxon for advanced timezone handling
pin "luxon", to: "https://cdn.skypack.dev/luxon@3.4.4"



# Fontawesome 
pin "@fortawesome/fontawesome-free", to: "@fortawesome--fontawesome-free.js" # @6.7.2

# Pin controllers individually
pin "application", preload: true
pin "@hotwired/turbo-rails", to: "turbo.min.js", preload: true
pin "@hotwired/stimulus", to: "stimulus.min.js", preload: true
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js", preload: true
pin "@rails/activestorage", to: "activestorage.esm.js", preload: true
pin_all_from "app/javascript/controllers", under: "controllers"

