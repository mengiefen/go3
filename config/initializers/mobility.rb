# Configure Mobility for translations
Mobility.configure do
  plugins do
    backend :jsonb
    active_record
    reader
    writer
    presence
    cache
    fallbacks
  end
end

# Configure I18n fallbacks
require "i18n/backend/fallbacks"
I18n.fallbacks.map(fr: :en) 