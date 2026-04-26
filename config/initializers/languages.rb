# Define supported languages for the application
Rails.application.config.supported_locales = {
  "en" => { name: "English", rtl: false },
  "fr" => { name: "Français", rtl: false },
  "es" => { name: "Español", rtl: false },
  "de" => { name: "Deutsch", rtl: false },
  "zh" => { name: "中文", rtl: false },
  "ja" => { name: "日本語", rtl: false },
  "ar" => { name: "العربية", rtl: true },
  "fa" => { name: "فارسی", rtl: true },
  "ur" => { name: "اردو", rtl: true }
}.freeze

# Define default locale
Rails.application.config.default_locale = "en"
