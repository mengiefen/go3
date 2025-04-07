class Users::ProfilesController < ApplicationController
  before_action :authenticate_user!
  
  def show
    # Automatically uses current_user
  end

  def edit
    # Automatically uses current_user
  end

  def update
    if current_user.update(user_params)
      redirect_to users_profile_path, notice: 'Your profile was successfully updated.'
    else
      render :edit, status: :unprocessable_entity
    end
  end
  
  def remove_avatar
    current_user.avatar.purge
    redirect_to edit_users_profile_path, notice: 'Profile picture was successfully removed.'
  end

  private

  def user_params
    params.require(:user).permit(
      :first_name, 
      :last_name, 
      :phone_number, 
      :address,
      :language,
      :timezone,
      :avatar
    )
  end
end
