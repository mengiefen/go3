class Api::TranslationsController < ApplicationController
  skip_before_action :authenticate_user!
  def index
    locale = params[:locale]
    keys = params[:keys].split(',')
    
    Rails.logger.debug "Received translation request for locale: #{locale}"
    Rails.logger.debug "Available locales: #{I18n.available_locales.inspect}"
    
    # Ensure locale is valid and available
    unless I18n.available_locales.include?(locale.to_sym)
      Rails.logger.warn "Invalid locale requested: #{locale}, falling back to #{I18n.default_locale}"
      locale = I18n.default_locale
    end
    
    # Force the locale for this request
    I18n.locale = locale.to_sym
    Rails.logger.debug "Set I18n.locale to: #{I18n.locale}"
    
    # Get translations for the requested keys
    translations = {}
    keys.each do |key|
      translation = I18n.t(key, default: key)
      translations[key] = translation
      Rails.logger.debug "Translation for #{key}: #{translation}"
    end
    
    # Log the translations for debugging
    Rails.logger.debug "Final translations for locale #{locale}: #{translations.inspect}"
    
    render json: { translations: translations }
  end
end