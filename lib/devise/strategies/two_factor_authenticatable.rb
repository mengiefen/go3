require 'devise/strategies/authenticatable'

module Devise
  module Strategies
    class TwoFactorAuthenticatable < Authenticatable
      def valid?
        # Only validate if the user is signing in with OTP code
        super && params.dig(:user, :otp_code_attempt).present?
      end

      def authenticate!
        resource = mapping.to.find_for_database_authentication(authentication_hash)
        
        if resource && resource.otp_required_for_login? && validate_otp(resource)
          success!(resource)
        else
          fail!(:invalid_otp) if resource && resource.otp_required_for_login?
          pass # Let other strategies handle it if OTP is not enabled
        end
      end

      private

      def validate_otp(resource)
        if params.dig(:user, :otp_code_attempt) == 'backup_code'
          resource.verify_backup_code(params.dig(:user, :backup_code))
        else
          resource.verify_otp(params.dig(:user, :otp_code_attempt))
        end
      end
    end
  end
end

Warden::Strategies.add(:two_factor_authenticatable, Devise::Strategies::TwoFactorAuthenticatable) 