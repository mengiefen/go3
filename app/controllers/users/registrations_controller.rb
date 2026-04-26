class Users::RegistrationsController < Devise::RegistrationsController
  include ActionController::MimeResponds
  respond_to :json

  skip_before_action :verify_authenticity_token

  def create
    build_resource(sign_up_params)
    resource.save

    if resource.persisted?
      render json: resource, only: %i[id email first_name last_name confirmed timezone locale confirmed_at confirmation_sent_at], status: :ok
    else
      render json: { errors: resource.errors.full_messages }, status: :unprocessable_content
    end
  end

  def sign_up_params
    params.permit(:email, :password, :password_confirmation, :first_name, :last_name, :timezone, :locale)
  end
end
