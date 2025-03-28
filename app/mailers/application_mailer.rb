class ApplicationMailer < ActionMailer::Base
  default from: "from@example.com"
  layout "mailer"
  
  # Set defaults for URL generation in emails
  def default_url_options
    { host: Rails.application.config.action_mailer.default_url_options[:host],
      protocol: Rails.application.config.action_mailer.default_url_options[:protocol] || 'http' }
  end
end
