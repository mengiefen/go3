# frozen_string_literal: true

class Users::RegistrationsController < Devise::RegistrationsController
  before_action :configure_sign_up_params, only: [:create]
  before_action :configure_account_update_params, only: [:update]

  # GET /resource/sign_up
  def new
    super
  end

  # POST /resource
  def create
    # Make sure timezone is set from the browser detection
    if params[:user][:timezone].blank?
      params[:user][:timezone] = "UTC" # Default to UTC if no timezone detected
    end
    
    build_resource(sign_up_params)
    resource.save
    
    if resource.persisted?
      # Store the user's language preference
      resource.update(language: params[:user][:language]) if params[:user][:language].present?
      
      # Store email and language in session for confirmation pending page
      session[:user_email] = resource.email
      session[:user_language] = resource.language
      
      # Clear any existing flash messages
      flash.clear
      
      # Redirect to confirmation pending page
      redirect_to confirmation_pending_path
    else
      clean_up_passwords resource
      set_minimum_password_length
      respond_with resource
    end
  end

  # GET /confirmation_pending
  def confirmation_pending
    # Get email and language from session or params
    @email = session[:user_email] || params[:email]
    @language = session[:user_language] || params[:language] || I18n.default_locale
    
    # Set the locale for this request
    I18n.locale = @language.to_sym
  end

  # POST /resend_confirmation
  def resend_confirmation
    @email = params[:user][:email]
    @language = session[:user_language] || I18n.default_locale
    
    # Set the locale for this request
    I18n.locale = @language.to_sym
    
    # Find the user and resend confirmation
    if user = User.find_by(email: @email)
      user.send_confirmation_instructions
      flash[:notice] = t('email_confirmation.resend_success')
    else
      flash[:alert] = t('email_confirmation.resend_error')
    end
    
    redirect_to confirmation_pending_path
  end

  # GET /resource/edit
  def edit
    super
  end

  # PUT /resource
  # This is specifically modified to handle social users who want to set a password
  def update
    # If the user is a social user and doesn't have a password yet, we skip the current password requirement
    if skip_current_password_for_social_user?
      if params[:user][:password].present?
        # Set password_confirmation if only password is provided
        params[:user][:password_confirmation] = params[:user][:password] if params[:user][:password_confirmation].blank?
        resource.update_without_password(account_update_params_without_current_password)
      else
        resource.update_without_password(account_update_params_without_password)
      end

      if resource.errors.empty?
        set_flash_message :notice, :updated
        bypass_sign_in resource, scope: resource_name if sign_in_after_change_password?
        respond_with resource, location: after_update_path_for(resource)
      else
        respond_with resource
      end
    else
      super
    end
  end

  # DELETE /resource
  def destroy
    super
  end

  # GET /resource/cancel
  # Forces the session data which is usually expired after sign
  # in to be expired now. This is useful if the user wants to
  # cancel oauth signing in/up in the middle of the process,
  # removing all OAuth session data.
  def cancel
    super
  end

  protected

  # Check if user is a social user without a password
  def skip_current_password_for_social_user?
    current_user.provider.present? && current_user.uid.present? && 
    (current_user.encrypted_password.blank? || 
     (!current_user.encrypted_password.blank? && params[:user][:current_password].blank? && params[:user][:password].present?))
  end

  # If you have extra params to permit, append them to the sanitizer.
  def configure_sign_up_params
    devise_parameter_sanitizer.permit(:sign_up, keys: [:first_name, :last_name, :timezone, :language])
  end

  # If you have extra params to permit, append them to the sanitizer.
  def configure_account_update_params
    devise_parameter_sanitizer.permit(:account_update, keys: [:first_name, :last_name, :avatar, :timezone])
  end

  # Account update params without password fields
  def account_update_params_without_password
    params.require(:user).permit(:first_name, :last_name, :avatar, :email)
  end

  # Account update params without current password
  def account_update_params_without_current_password
    params.require(:user).permit(:first_name, :last_name, :avatar, :email, :password, :password_confirmation)
  end

  def after_sign_up_path_for(resource)
    # Redirect to confirmation pending page
    confirmation_pending_path
  end

  def after_inactive_sign_up_path_for(resource)
    # Redirect to confirmation pending page
    confirmation_pending_path
  end
end
