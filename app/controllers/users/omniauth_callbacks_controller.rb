class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  skip_before_action :verify_authenticity_token, only: []
  
  def passthru
    Rails.logger.error("OmniAuth Passthru Error - Provider: #{request.path.split('/').last}")
    Rails.logger.error("Available providers: #{OmniAuth::Strategies.constants}")
    super
  end
  
  def google_oauth2
    Rails.logger.info("Google OAuth callback initiated")
    handle_oauth("Google")
  end
  
  def linkedin
    handle_oauth("LinkedIn")
  end
  
  def failure
    Rails.logger.error("OmniAuth failure: #{failure_message}")
    
    # Log security event
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
    Rails.logger.info("Processing #{provider} OAuth callback")
    
    # Debug - log the auth hash without sensitive data
    if request.env["omniauth.auth"].present?
      safe_auth_hash = request.env["omniauth.auth"].to_hash
      safe_auth_hash["credentials"]&.delete("token")
      safe_auth_hash["credentials"]&.delete("refresh_token")
      Rails.logger.debug("Auth hash (sanitized): #{safe_auth_hash.to_json}")
    else
      Rails.logger.error("No omniauth.auth data in request environment!")
    end
    
    begin
      @user = User.from_omniauth(request.env["omniauth.auth"])
      
      if @user.persisted?
        # Log security event
        @user.log_security_event("social_login_success", {
          provider: provider,
          ip_address: request.ip,
          user_agent: request.user_agent
        })
        
        sign_in_and_redirect @user, event: :authentication
        set_flash_message(:notice, :success, kind: provider) if is_navigational_format?
      else
        # Log security event
        log_security_event("social_login_failure", {
          provider: provider,
          reason: "User not persisted: #{@user.errors.full_messages.join(', ')}",
          email: request.env["omniauth.auth"].dig("info", "email"),
          ip_address: request.ip,
          user_agent: request.user_agent
        })
        
        # Store OAuth data in session for signup
        session["devise.#{provider.downcase}_data"] = request.env["omniauth.auth"].except("extra")
        redirect_to new_user_registration_url, alert: "There was a problem signing you in with #{provider}. Please register or try signing in with a different method."
      end
    rescue => e
      Rails.logger.error("Error in #{provider} oauth callback: #{e.message}\n#{e.backtrace.join("\n")}")
      log_security_event("social_login_error", {
        provider: provider,
        error: e.message,
        ip_address: request.ip,
        user_agent: request.user_agent
      })
      redirect_to new_user_session_path, alert: "An unexpected error occurred with #{provider} authentication. Please try again or use a different sign-in method."
    end
  end
  
  def log_security_event(event_type, metadata = {})
    Rails.logger.warn("Security Event [#{event_type}]: #{metadata.to_json}")
  end
  
  def failure_message
    params[:message] || "unknown error"
  end
end 
