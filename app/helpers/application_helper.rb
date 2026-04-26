module ApplicationHelper
  def supported_locale
    Rails.application.config.supported_locales
  end

  def default_locale
    Rails.application.config.default_locale
  end

  def rtl_locale?(code)
    supported_locale[code]&.dig(:rtl) || false
  end

  def current_rtl?
    rtl_locale?(I18n.locale.to_s)
  end

  def locale_dir
    rtl_locale?(I18n.locale.to_s) ? "rtl" : "ltr"
  end

  def contrast_color(hex_color)
    hex_color = "#ffffff" unless hex_color
    hex_color = hex_color.gsub("#", "")

    # Parse the RGB components
    r, g, b = hex_color.scan(/../).map(&:hex)

    # Calculate the relative luminance
    brightness = (r * 299 + g * 587 + b * 114) / 1000

    # Return black for light backgrounds, white for dark ones
    brightness > 128 ? "black" : "white"
  end

  def random_color
    "#%06x" % rand(0..0xffffff)
  end
end
