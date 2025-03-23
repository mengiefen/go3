module Users
  class TwoFactorVerificationController < ApplicationController
    before_action :check_if_two_factor_auth_required
    
    def show
      # Display the 2FA verification form
    end
    
    def update
      # Verify the OTP code
      if current_user.validate_and_consume_otp!(params[:otp_code])
        warden.session(:user)['otp_verified'] = true
        sign_in :user, current_user, event: :authentication
        redirect_to stored_location_for(:user) || root_path, notice: "Successfully authenticated!"
      else
        flash.now[:alert] = "Invalid verification code. Please try again."
        render :show
      end
    end
    
    def verify_backup_code
      # Verify the backup code
      if current_user.validate_and_consume_backup_code!(params[:backup_code])
        warden.session(:user)['otp_verified'] = true
        sign_in :user, current_user, event: :authentication
        redirect_to stored_location_for(:user) || root_path, notice: "Successfully authenticated with backup code!"
      else
        flash.now[:alert] = "Invalid backup code. Please try again."
        render :show
      end
    end
    
    private
    
    def check_if_two_factor_auth_required
      unless current_user && current_user.otp_required_for_login
        redirect_to root_path
      end
    end
  end
end 