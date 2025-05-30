class Users::SettingsController < ApplicationController
  before_action :authenticate_user!

  def edit
    # Uses current_user
  end

  def update
    if current_user.update(settings_params)
      redirect_to edit_users_settings_path, notice: 'Your settings were successfully updated.'
    else
      render :edit, status: :unprocessable_entity
    end
  end
  
  def destroy_account
    # Log the account deletion event
    current_user.log_security_event('account_deletion_requested', { 
      ip_address: request.remote_ip, 
      user_agent: request.user_agent
    })
    
    # Revoke all sessions for current user
    current_user.update(active: false)
    
    # Schedule account for deletion
    # In a real application, you might want to implement a delayed deletion
    # process that gives users time to change their mind
    current_user.update(deactivated_at: Time.current)
    
    # Sign out the user
    sign_out(current_user)
    
    # Redirect with message
    redirect_to root_path, notice: 'Your account has been scheduled for deletion. We are sorry to see you go.'
  end

  private

  def settings_params
    params.require(:user).permit(:email, :use_tabbed_navigation)
  end
end
