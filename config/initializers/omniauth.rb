# OmniAuth security configuration

# Allow both GET and POST requests, but POST is recommended for security
OmniAuth.config.allowed_request_methods = [:get, :post]

# Protect against request forgery for all providers
OmniAuth.config.logger = Rails.logger

# Use a custom failure app
OmniAuth.config.on_failure = proc { |env|
  OmniAuth::FailureEndpoint.new(env).redirect_to_failure
}

# Explicitly require LinkedIn OAuth2 strategy
require 'omniauth-linkedin-oauth2'

# LinkedIn OAuth2 strategy specific configuration
module OmniAuth
  module Strategies
    class LinkedIn < OmniAuth::Strategies::OAuth2
      def token_params
        super.tap do |params|
          params[:client_secret] = options.client_secret
        end
      end
    end
  end
end

# In test environment, mock external providers
if Rails.env.test?
  OmniAuth.config.test_mode = true
  # Add mock responses as needed for tests
end 
