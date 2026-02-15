ENV["BUNDLE_GEMFILE"] ||= File.expand_path("../Gemfile", __dir__)

require "bundler/setup" # Set up gems listed in the Gemfile.

# Load environment variables early, before Rails configuration
# This ensures ENV vars are available when database.yml is parsed
require "dotenv/load"

require "bootsnap/setup" # Speed up boot time by caching expensive operations.
