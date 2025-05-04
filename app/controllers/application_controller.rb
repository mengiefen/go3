class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  include Pundit::Authorization
  
  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  before_action :set_current_attributes
  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :store_user_location!, if: :storable_location?
  before_action :set_locale
  
  protected
  
  def configure_permitted_parameters
    # Sign up params
    devise_parameter_sanitizer.permit(:sign_up, keys: [
      :first_name, :last_name, :email, :password, :password_confirmation
    ])
    
    # Account update params
    devise_parameter_sanitizer.permit(:account_update, keys: [
      :first_name, :last_name, :email, :password, :password_confirmation, 
      :current_password, :job_title, :avatar, :timezone, :preferred_locale
    ])
    
    # Sign in params
    devise_parameter_sanitizer.permit(:sign_in, keys: [
      :email, :password, :otp_code_attempt, :backup_code
    ])
  end
  
  # Redirect after sign in
  def after_sign_in_path_for(resource)
    # If user has 2FA enabled but not yet verified for this session
    if resource.otp_required_for_login? && !session[:otp_verified]
      users_two_factor_verification_path
    else
      # Track sign in activity
      resource.track_activity("sign_in")
      
      # Log security event
      resource.log_security_event("sign_in_success", {
        ip_address: request.ip,
        user_agent: request.user_agent
      })
      
      # Return to stored location or default
      stored_location_for(resource) || root_path
    end
  end
  
  private
  
  def user_not_authorized
    flash[:alert] = "You are not authorized to perform this action."
    redirect_to(request.referrer || root_path)
  end
  
  def set_current_attributes
    Current.ip_address = request.ip
    Current.user_agent = request.user_agent
    Current.request_id = request.uuid
    Current.user = current_user
  end

  def set_locale
    I18n.locale = if user_signed_in?
                    current_user.locale
                  else
                    http_accept_language.compatible_language_from(I18n.available_locales) || I18n.default_locale
                  end
  end
  
  def storable_location?
    request.get? && 
    is_navigational_format? && 
    !devise_controller? && 
    !request.xhr? && 
    !turbo_frame_request? &&
    !request.format.turbo_stream?
  end
  
  def store_user_location!
    # Store the current location for redirect after sign in
    store_location_for(:user, request.fullpath)
  end
  
  def turbo_frame_request?
    request.headers["Turbo-Frame"].present?
  end
end
