require_relative "boot"

# Load dotenv for environment variables
require 'dotenv/load' if File.exist?(File.join(File.dirname(__FILE__), '..', '.env'))

require "rails/all"
require "devise"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Go3
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 8.0

    # Please, add to the `ignore` list any other `lib` subdirectories that do
    # not contain `.rb` files, or that should not be reloaded or eager loaded.
    # Common ones are `templates`, `generators`, or `middleware`, for example.
    config.autoload_lib(ignore: %w[assets tasks])

    # Configure Active Storage image processor fallbacks
    # Use vips for processing variants by default, fallback to mini_magick
    config.active_storage.variant_processor = :vips
    config.active_storage.web_image_content_types = %w[image/png image/jpeg image/gif image/webp]

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")
  end
end
