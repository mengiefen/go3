class MembersController < ApplicationController
  before_action :authenticate_user!

  def index
    authorize current_member
    @members = current_organization.members
  end
end