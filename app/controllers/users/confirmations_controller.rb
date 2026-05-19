# frozen_string_literal: true

class Users::ConfirmationsController < Devise::ConfirmationsController
  def show
    self.resource = resource_class.confirm_by_token(params[:confirmation_token])
    yield resource if block_given?

    if resource.errors.empty?
      sign_in(resource)
      render json: resource, only: %i[id email confirmation_sent_at], status: :ok
    else
      render json: { errors: resource.errors.full_messages }, status: :unprocessable_content
    end
  end
end
