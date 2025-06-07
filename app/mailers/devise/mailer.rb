# frozen_string_literal: true

class Devise::Mailer < Devise.parent_mailer.constantize
  include Devise::Mailers::Helpers
  include Rails.application.routes.url_helpers

  def confirmation_instructions(record, token, opts = {})
    # Set the locale based on the user's language preference
    I18n.with_locale(record.language) do
      @token = token
      @resource = record
      @email = record.email
      @confirmation_url = user_confirmation_url(confirmation_token: @token)
      
      # Use the localized template
      mail(to: @email, subject: I18n.t('devise.mailer.confirmation_instructions.subject'))
    end
  end
end 