require "spec_helper"
require File.expand_path("../../config/environment", __FILE__)
require "rspec/rails"
Dir[Rails.root.join("spec/support/**/*.rb")].each { |f| require f }
require "shoulda/matchers"

# Configure PaperTrail for testing
require 'paper_trail/frameworks/rspec'

Shoulda::Matchers.configure do |config|
  config.integrate do |with|
    with.test_framework :rspec
    with.library :rails
  end
end

RSpec.configure do |config|
  config.use_transactional_fixtures = true
  config.infer_spec_type_from_file_location!
  
  # Setup PaperTrail for testing
  config.before(:each) do
    PaperTrail.enabled = true
    PaperTrail.request.whodunnit = nil
    PaperTrail.request.controller_info = {}
  end
end
