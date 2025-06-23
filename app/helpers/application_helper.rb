module ApplicationHelper
  include ComponentHelper

  def supported_languages
    Rails.application.config.supported_languages
  end

  def default_language
    Rails.application.config.default_language
  end

  def language_name(code)
    supported_languages[code]&.dig(:name) || code
  end

  def rtl_language?(code)
    supported_languages[code]&.dig(:rtl) || false
  end

  def current_rtl?
    rtl_language?(I18n.locale)
  end

  def view_t(key, **options)
    controller_segments = controller_path.split('/')
    action_segment = action_name
    I18n.t("views.#{controller_segments.join('.')}.#{action_segment}.#{key}", **options )
  end
end
