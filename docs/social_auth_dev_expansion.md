# Social Authentication Developer Guide

This documentation provides a comprehensive guide for implementing, maintaining, and extending social authentication in our application.

## Table of Contents

1. [Overview](#overview)
2. [Current Implementation](#current-implementation)
3. [Authentication Flow](#authentication-flow)
4. [Configuration](#configuration)
5. [User Model Integration](#user-model-integration)
6. [Controllers](#controllers)
7. [Views](#views)
8. [Security Considerations](#security-considerations)
9. [Extending with Additional Providers](#extending-with-additional-providers)
10. [Troubleshooting](#troubleshooting)
11. [API Reference](#api-reference)

## Overview

Our application uses OAuth2-based social authentication to provide users with convenient login options. Currently, we support:

- Google (OAuth2)
- LinkedIn (OAuth2)

The implementation is built on top of the Devise authentication framework and uses OmniAuth strategies to handle provider-specific authentication flows.

## Current Implementation

The social authentication system consists of:

- Devise for core authentication
- OmniAuth for provider strategy management
- Provider-specific OmniAuth strategies (e.g., `omniauth-google-oauth2`, `omniauth-linkedin-oauth2`)
- Custom controllers to handle authentication callbacks
- User model extensions to process OAuth user data
- UI components for login and account management

## Authentication Flow

The authentication flow follows this process:

1. User clicks on a social login button (e.g., "Sign in with Google")
2. User is redirected to the provider's authentication page
3. User authenticates with the provider and grants permissions
4. Provider redirects back to our application's callback URL
5. OmniAuth processes the callback and extracts user information
6. Our application creates or updates the user record
7. User is signed in and redirected to the appropriate page

### Sequence Diagram

```
┌───────┐          ┌─────────────┐          ┌──────────┐          ┌───────────┐
│  User │          │ Application │          │ OmniAuth │          │  Provider │
└───┬───┘          └──────┬──────┘          └────┬─────┘          └─────┬─────┘
    │                     │                      │                      │
    │ Click "Sign in with │                      │                      │
    │ Google/LinkedIn"    │                      │                      │
    │────────────────────>│                      │                      │
    │                     │                      │                      │
    │                     │ Initialize OAuth     │                      │
    │                     │ strategy             │                      │
    │                     │─────────────────────>│                      │
    │                     │                      │                      │
    │                     │                      │ Redirect to provider │
    │                     │<─────────────────────│                      │
    │                     │                      │                      │
    │    Redirect to      │                      │                      │
    │    provider         │                      │                      │
    │<────────────────────│                      │                      │
    │                     │                      │                      │
    │ Authenticate with   │                      │                      │
    │ provider            │                      │                      │
    │──────────────────────────────────────────────────────────────────>│
    │                     │                      │                      │
    │                     │                      │                      │
    │    Redirect to      │                      │                      │
    │    callback URL     │                      │                      │
    │<──────────────────────────────────────────────────────────────────│
    │                     │                      │                      │
    │ Provider callback   │                      │                      │
    │ with auth data      │                      │                      │
    │────────────────────>│                      │                      │
    │                     │                      │                      │
    │                     │ Process OAuth data   │                      │
    │                     │─────────────────────>│                      │
    │                     │                      │                      │
    │                     │ Return auth hash     │                      │
    │                     │<─────────────────────│                      │
    │                     │                      │                      │
    │                     │ Create/update user   │                      │
    │                     │ and sign in          │                      │
    │                     │──────┐               │                      │
    │                     │      │               │                      │
    │                     │<─────┘               │                      │
    │                     │                      │                      │
    │ Redirect to         │                      │                      │
    │ dashboard           │                      │                      │
    │<────────────────────│                      │                      │
    │                     │                      │                      │
┌───┴───┐          ┌──────┴──────┐          ┌────┴─────┐          ┌─────┴─────┐
│  User │          │ Application │          │ OmniAuth │          │  Provider │
└───────┘          └─────────────┘          └──────────┘          └───────────┘
```

## Configuration

### Provider Registration

Before implementing social authentication, you need to register your application with each provider:

#### Google

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Create an OAuth 2.0 Client ID
5. Configure the authorized redirect URI: `http://your-app-domain/users/auth/google_oauth2/callback`
6. Note the Client ID and Client Secret

#### LinkedIn

1. Go to the [LinkedIn Developer Portal](https://www.linkedin.com/developers/)
2. Create a new app
3. Configure the application settings
4. Add the redirect URI: `http://your-app-domain/users/auth/linkedin/callback`
5. Request access to the necessary API products
6. Note the Client ID and Client Secret

### Environment Variables

Store the credentials securely as environment variables:

```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
```

### OmniAuth Configuration

OmniAuth is configured in `config/initializers/omniauth.rb`:

```ruby
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
```

### Devise Configuration

Devise is configured in `config/initializers/devise.rb`:

```ruby
# OmniAuth configuration
config.omniauth :google_oauth2, ENV['GOOGLE_CLIENT_ID'], ENV['GOOGLE_CLIENT_SECRET'], {
  scope: 'email,profile',
  prompt: 'select_account'
}

config.omniauth :linkedin, ENV['LINKEDIN_CLIENT_ID'], ENV['LINKEDIN_CLIENT_SECRET'], {
  scope: 'r_emailaddress r_liteprofile',
  fields: ['id', 'first-name', 'last-name', 'picture-url', 'email-address']
}
```

## User Model Integration

The User model is extended to handle social authentication data:

```ruby
class User < ApplicationRecord
  # Enable OmniAuth with supported providers
  devise :omniauthable, omniauth_providers: [:google_oauth2, :linkedin]

  # Process OAuth data and create/update user
  def self.from_omniauth(auth)
    # Find existing user by provider/uid or email
    user = find_by(provider: auth.provider, uid: auth.uid)
    user ||= find_by(email: auth.info.email) if auth.info.email.present?

    if user
      # Update existing user with OAuth data
      user.update(
        provider: auth.provider,
        uid: auth.uid,
        first_name: user.first_name.blank? ? parse_first_name(auth) : user.first_name,
        last_name: user.last_name.blank? ? parse_last_name(auth) : user.last_name
      )
      return user
    end

    # Create new user from OAuth data
    create_from_oauth_data(auth)
  end

  # Helper methods for parsing OAuth data
  def self.parse_first_name(auth)
    case auth.provider
    when 'linkedin'
      auth.info.first_name || auth.info.name&.split(" ")&.first || "LinkedIn"
    else
      auth.info.first_name || auth.info.name&.split(" ")&.first || "User"
    end
  end

  def self.parse_last_name(auth)
    case auth.provider
    when 'linkedin'
      auth.info.last_name ||
        (auth.info.name.present? && auth.info.name.split(" ").size > 1 ?
         auth.info.name.split(" ").drop(1).join(" ") :
         "User")
    else
      auth.info.last_name ||
        (auth.info.name.present? && auth.info.name.split(" ").size > 1 ?
         auth.info.name.split(" ").drop(1).join(" ") :
         "User")
    end
  end

  # Add/check social connections
  def linked_to?(provider)
    self.provider == provider && self.uid.present?
  end

  def link_oauth_account(auth)
    update(provider: auth.provider, uid: auth.uid)
  end

  def unlink_oauth_account
    update(provider: nil, uid: nil)
  end
end
```

## Controllers

### OmniAuth Callbacks Controller

The OmniAuth callbacks controller (`app/controllers/users/omniauth_callbacks_controller.rb`) handles the OAuth callbacks from each provider:

```ruby
class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def passthru
    Rails.logger.error("OmniAuth Passthru Error - Provider: #{request.path.split('/').last}")
    Rails.logger.error("Available providers: #{OmniAuth::Strategies.constants}")
    super
  end

  def google_oauth2
    handle_oauth("Google")
  end

  def linkedin
    handle_oauth("LinkedIn")
  end

  def failure
    # Handle authentication failures
    log_security_event("social_login_failure", {
      provider: params[:strategy],
      reason: failure_message,
      ip_address: request.ip,
      user_agent: request.user_agent
    })

    redirect_to root_path, alert: "Authentication failed: #{failure_message}"
  end

  private

  def handle_oauth(provider)
    # Process OAuth data and sign in user
    @user = User.from_omniauth(request.env["omniauth.auth"])

    if @user.persisted?
      sign_in_and_redirect @user, event: :authentication
      set_flash_message(:notice, :success, kind: provider) if is_navigational_format?
    else
      # Store OAuth data in session for signup
      session["devise.#{provider.downcase}_data"] = request.env["omniauth.auth"].except("extra")
      redirect_to new_user_registration_url, alert: "There was a problem signing you in with #{provider}."
    end
  end
end
```

### Social Connections Controller

The social connections controller (`app/controllers/users/social_connections_controller.rb`) manages user social connections:

```ruby
class Users::SocialConnectionsController < ApplicationController
  before_action :authenticate_user!

  # Show connected social accounts
  def index
    @connected_providers = current_user.linked_providers
  end

  # Remove social connection
  def destroy
    if current_user.encrypted_password.blank?
      redirect_to edit_user_registration_path, alert: "You need to set a password before unlinking your social account"
      return
    end

    if current_user.unlink_oauth_account
      redirect_to edit_user_registration_path, notice: "Successfully unlinked your #{params[:provider].titleize} account"
    else
      redirect_to edit_user_registration_path, alert: "Could not unlink your account"
    end
  end

  private

  def validate_provider
    allowed_providers = %w[google_oauth2 linkedin]
    unless allowed_providers.include?(params[:provider])
      redirect_to edit_user_registration_path, alert: "Invalid provider"
    end
  end
end
```

## Views

### Login Buttons

Social login buttons are implemented in `app/views/users/sessions/new.html.erb`:

```erb
<div class="mt-6 grid grid-cols-2 gap-3">
  <% if devise_mapping.omniauthable? %>
    <%= button_to user_google_oauth2_omniauth_authorize_path, data: { turbo: false }, class: "auth-button google" do %>
      <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
        <!-- Google icon SVG content -->
      </svg>
      <span>Google</span>
    <% end %>

    <%= button_to user_linkedin_omniauth_authorize_path, data: { turbo: false }, class: "auth-button linkedin" do %>
      <svg class="h-5 w-5 text-[#0A66C2]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <!-- LinkedIn icon SVG content -->
      </svg>
      <span>LinkedIn</span>
    <% end %>
  <% end %>
</div>
```

### Account Management

Social connections management is implemented in `app/views/users/registrations/edit.html.erb`:

```erb
<div class="social-connections">
  <h3>Connected Accounts</h3>

  <!-- Google -->
  <div class="connection">
    <div class="provider-info">
      <svg class="icon google"><!-- Google icon SVG --></svg>
      <span>Google</span>
    </div>
    <% if current_user.linked_to?('google_oauth2') %>
      <span class="connected">Connected</span>
      <%= button_to "Unlink", destroy_social_connections_path('google_oauth2'), method: :delete, class: "unlink" %>
    <% else %>
      <%= button_to "Connect", user_google_oauth2_omniauth_authorize_path, data: { turbo: false }, class: "connect" %>
    <% end %>
  </div>

  <!-- LinkedIn -->
  <div class="connection">
    <div class="provider-info">
      <svg class="icon linkedin"><!-- LinkedIn icon SVG --></svg>
      <span>LinkedIn</span>
    </div>
    <% if current_user.linked_to?('linkedin') %>
      <span class="connected">Connected</span>
      <%= button_to "Unlink", destroy_social_connections_path('linkedin'), method: :delete, class: "unlink" %>
    <% else %>
      <%= button_to "Connect", user_linkedin_omniauth_authorize_path, data: { turbo: false }, class: "connect" %>
    <% end %>
  </div>
</div>
```

## Security Considerations

### CSRF Protection

Our application uses the `omniauth-rails_csrf_protection` gem to protect against Cross-Site Request Forgery (CSRF) attacks. This gem ensures that OmniAuth request flows include CSRF tokens.

### Environment Variables

Sensitive provider credentials (client IDs and secrets) are stored as environment variables instead of being hardcoded in the application.

### Session Security

OAuth data stored in the session is limited to exclude sensitive information:

```ruby
session["devise.#{provider.downcase}_data"] = request.env["omniauth.auth"].except("extra")
```

### Account Linking Protection

When unlinking a social account, we ensure that the user has set a password first, to prevent account lockouts:

```ruby
if current_user.encrypted_password.blank?
  redirect_to edit_user_registration_path, alert: "You need to set a password before unlinking your social account"
  return
end
```

## Extending with Additional Providers

To add a new provider to the social authentication system:

1. **Add the OmniAuth strategy gem** in `Gemfile`:

   ```ruby
   gem 'omniauth-new-provider'
   ```

2. **Configure the provider** in `config/initializers/devise.rb`:

   ```ruby
   config.omniauth :new_provider, ENV['NEW_PROVIDER_CLIENT_ID'], ENV['NEW_PROVIDER_CLIENT_SECRET'], {
     scope: 'email,profile',
     # Additional provider-specific options
   }
   ```

3. **Update the User model** in `app/models/user.rb`:

   ```ruby
   devise :omniauthable, omniauth_providers: [:google_oauth2, :linkedin, :new_provider]

   # Update parse methods to handle the new provider
   def self.parse_first_name(auth)
     case auth.provider
     # ...
     when 'new_provider'
       # Provider-specific logic
     # ...
     end
   end
   ```

4. **Add the callback method** in `app/controllers/users/omniauth_callbacks_controller.rb`:

   ```ruby
   def new_provider
     handle_oauth("New Provider")
   end
   ```

5. **Update the `validate_provider` method** in `app/controllers/users/social_connections_controller.rb`:

   ```ruby
   def validate_provider
     allowed_providers = %w[google_oauth2 linkedin new_provider]
     # ...
   end
   ```

6. **Add UI elements** for the new provider in the views.

## Troubleshooting

### Common Issues

#### "Not found. Authentication passthru"

This error often occurs when the OmniAuth route exists but the provider strategy is not properly initialized. Check:

- The provider gem is installed
- The provider is configured in Devise
- The provider name matches in all places (config, callbacks, etc.)

#### "invalid_credentials" Error

This typically means there's an issue with the provider credentials. Check:

- Environment variables are set correctly
- Redirect URIs in the provider's developer console match your application
- Your application has been granted the requested scopes

#### Missing Email from Provider

Some providers might not return an email by default. You can:

- Request additional scopes
- Implement a fallback mechanism to prompt for email if missing
- Use a different unique identifier for the user

## API Reference

### Auth Hash Structure

The auth hash returned by OmniAuth typically follows this structure:

```ruby
{
  provider: 'google_oauth2',
  uid: '123456789',
  info: {
    name: 'John Doe',
    email: 'john@example.com',
    first_name: 'John',
    last_name: 'Doe',
    image: 'https://lh3.googleusercontent.com/...'
  },
  credentials: {
    token: 'TOKEN',
    refresh_token: 'REFRESH_TOKEN',
    expires_at: 1496120719,
    expires: true
  },
  extra: {
    # Additional provider-specific data
  }
}
```

### Routes

| Path                                  | Method   | Description                           |
| ------------------------------------- | -------- | ------------------------------------- |
| `/users/auth/:provider`               | GET/POST | Initiate OAuth process for a provider |
| `/users/auth/:provider/callback`      | GET/POST | OAuth callback from provider          |
| `/users/social_connections`           | GET      | View connected social accounts        |
| `/users/social_connections/:provider` | DELETE   | Remove a social connection            |

### User Model Methods

| Method                              | Description                             |
| ----------------------------------- | --------------------------------------- |
| `User.from_omniauth(auth)`          | Process OAuth data and find/create user |
| `User.create_from_oauth_data(auth)` | Create a new user from OAuth data       |
| `User.parse_first_name(auth)`       | Extract first name from provider data   |
| `User.parse_last_name(auth)`        | Extract last name from provider data    |
| `user.linked_to?(provider)`         | Check if user is linked to a provider   |
| `user.link_oauth_account(auth)`     | Link a provider to existing account     |
| `user.unlink_oauth_account`         | Remove provider link from account       |

---

Created by: Development Team
Last Updated: March 28, 2025
