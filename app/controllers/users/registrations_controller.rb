# frozen_string_literal: true

class Users::RegistrationsController < Devise::RegistrationsController
  # before_action :configure_sign_up_params, only: [:create]
  before_action :configure_account_update_params, only: [:update]

  # GET /resource/sign_up
  # def new
  #   super
  # end

  # POST /resource
  # def create
  #   super
  # end

  # GET /resource/edit
  # def edit
  #   super
  # end

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
  # def destroy
  #   super
  # end

  # GET /resource/cancel
  # Forces the session data which is usually expired after sign
  # in to be expired now. This is useful if the user wants to
  # cancel oauth signing in/up in the middle of the process,
  # removing all OAuth session data.
  # def cancel
  #   super
  # end

  protected

  # Check if user is a social user without a password
  def skip_current_password_for_social_user?
    current_user.provider.present? && current_user.uid.present? && 
    (current_user.encrypted_password.blank? || 
     (!current_user.encrypted_password.blank? && params[:user][:current_password].blank? && params[:user][:password].present?))
  end

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_sign_up_params
  #   devise_parameter_sanitizer.permit(:sign_up, keys: [:attribute])
  # end

  # If you have extra params to permit, append them to the sanitizer.
  def configure_account_update_params
    devise_parameter_sanitizer.permit(:account_update, keys: [:first_name, :last_name, :avatar])
  end

  # Account update params without password fields
  def account_update_params_without_password
    params.require(:user).permit(:first_name, :last_name, :avatar, :email)
  end

  # Account update params without current password
  def account_update_params_without_current_password
    params.require(:user).permit(:first_name, :last_name, :avatar, :email, :password, :password_confirmation)
  end

  # The path used after sign up.
  # def after_sign_up_path_for(resource)
  #   super(resource)
  # end

  # The path used after sign up for inactive accounts.
  # def after_inactive_sign_up_path_for(resource)
  #   super(resource)
  # end
end
