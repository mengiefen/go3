class Api::EchoController < ApplicationController
  protect_from_forgery with: :exception

  def create
    render json: {
      received: params[:message]
    }
  end
end
