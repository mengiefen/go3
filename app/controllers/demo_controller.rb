class DemoController < ApplicationController
  skip_before_action :authenticate_user!
  layout "demo"

  def index
  end
end
