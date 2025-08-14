module Forms
  class TranslatableInputComponent < ViewComponent::Base
    def initialize(form:, field_name:, primary_language:, available_languages:)
      @form = form
      @field_name = field_name
      @primary_language = primary_language
      @available_languages = available_languages
      @modal_id = "translation-modal-#{field_name}-#{SecureRandom.hex(4)}"
    end

    def single_language?
      @available_languages.size == 1
    end

    def get_translation_value(language)
      begin
        field_value = @form.object.send(@field_name)
        return "" if field_value.nil?

        if field_value.is_a?(Hash)
          field_value[language.to_s] || field_value[language.to_sym] || ""
        elsif field_value.is_a?(String)
          # If it's a string, it might be a legacy value or the current locale value
          # Return it only if it's for the primary language, otherwise empty
          language.to_s == @primary_language.to_s ? field_value : ""
        else
          ""
        end
      rescue => e
        # If anything goes wrong, return empty string
        Rails.logger.warn "Error getting translation value for #{@field_name} in #{language}: #{e.message}"
        ""
      end
    end
  end
end
