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

  private

  def user_params
    params.require(:user).permit(
      :first_name, 
      :last_name, 
      :phone_number, 
      :address,
      :language,
      :timezone
    )
  end
end
