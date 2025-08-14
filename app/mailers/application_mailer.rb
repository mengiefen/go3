class ApplicationMailer < ActionMailer::Base
  default from: "from@example.com"
  layout "mailer"
  helper_method :mailer_template_t

  # Set defaults for URL generation in emails
  def default_url_options
    { host: Rails.application.config.action_mailer.default_url_options[:host],
      protocol: Rails.application.config.action_mailer.default_url_options[:protocol] || "http" }
  end

  def mailer_t(key, **options)
    mailer_segments = self.class.name.underscore.split("/")
    mailer_segments[-1] = mailer_segments[-1]
    action_segment = action_name

    I18n.t("mailers.#{mailer_segments.join('.')}.#{action_segment}.#{key}", **options)
  end

  def mailer_template_t(key, **options)
    I18n.t("mailers.#{self.class.name.underscore}.#{action_name}.template.#{key}", **options)
  end
end
