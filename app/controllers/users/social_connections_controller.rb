class Users::SocialConnectionsController < ApplicationController
  before_action :authenticate_user!
  before_action :validate_provider, only: [:destroy]
  
  # GET /users/social_connections
  def index
    @connected_providers = current_user.linked_providers
  end
  
  # DELETE /users/social_connections/:provider
  def destroy
    if current_user.encrypted_password.blank?
      redirect_to edit_user_registration_path, alert: "You need to set a password before unlinking your social account"
      return
    end
    
    if current_user.unlink_oauth_account
      redirect_to edit_user_registration_path, notice: "Successfully unlinked your #{params[:provider].titleize} account"
    else
      redirect_to edit_user_registration_path, alert: "Could not unlink your account: #{current_user.errors.full_messages.join(', ')}"
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
