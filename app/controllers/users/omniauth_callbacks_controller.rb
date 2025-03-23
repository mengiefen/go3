class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  skip_before_action :verify_authenticity_token, only: [:apple]
  
  def google_oauth2
    handle_oauth("Google")
  end
  
  def facebook
    handle_oauth("Facebook")
  end
  
  def apple
    handle_oauth("Apple")
  end
  
  def linkedin
    handle_oauth("LinkedIn")
  end
  
  def failure
    redirect_to root_path, alert: "Authentication failed, please try again"
  end
  
  private
  
  def handle_oauth(provider)
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
      Rails.logger.warn("Security Event [social_login_failure]: #{request.env["omniauth.auth"].to_json}")
      
      # Store OAuth data in session for signup
      session["devise.#{provider.downcase}_data"] = request.env["omniauth.auth"].except("extra")
      redirect_to new_user_registration_url, alert: "There was a problem signing you in with #{provider}. Please register or try signing in with a different method."
    end
  end
end 