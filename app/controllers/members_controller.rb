class MembersController < ApplicationController
  before_action :authenticate_user!

  def index
    authorize current_member
    @members = current_organization.members
  end

  def new
    authorize current_member
    @member = Member.new(organization: current_organization)
  end

  def create
    authorize current_member
    
    @member = Member.new(organization: current_organization)
    @member.assign_attributes(create_params)
    if @member.save
      if params[:invite]
        invite
      end

      render turbo_stream: [
        turbo_stream.append("members_list", partial: "members/member_row", locals: { member: @member }),
        turbo_stream.replace("modal", "<turbo-frame id='modal'/>")
      ]
    end
  end

  private

  def invite
    invitation_key = SecureRandom.alphanumeric(10)
    @member.update!(
      invited_at: Time.current,
      invitation_key: invitation_key
    )
    
    MemberMailer.invitation(
      member_id: @member.id,
      organization_id: current_organization.id,
      invitation_key: invitation_key
    ).deliver_later
  end
  
  def create_params
    params.require(:member).permit(
      :name,
      :email,
      :initial,
      :color
    )
  end
end