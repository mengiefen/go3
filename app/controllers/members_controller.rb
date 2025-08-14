class MembersController < ApplicationController
  include TabContent
  before_action :authenticate_user!

  def index
    authorize current_member
    @members = current_organization.members.to_a.sort_by do |member|
      [
        member.archived? ? 1 : 0,       # unarchived first
        member.org_admin? ? 0 : 1,      # admins first
        -member.created_at.to_i         # newer first
      ]
    end
  end

  def new
    authorize current_member
    @member = Member.new(organization: current_organization)
  end

  def edit
    authorize current_member
    @member = Member.find_by(id: params[:id])
  end

  def create
    authorize current_member

    @member = Member.new(organization: current_organization)
    @member.assign_attributes(member_params)
    if @member.save
      if params[:invite]
        invite
      end

      Turbo::StreamsChannel.broadcast_append_to(
        "members_list",
        target: "members_list",
        partial: "members/member_row",
        locals: { member: @member }
      )

      render turbo_stream: [
        turbo_stream.append("members_list", partial: "members/member_row", locals: { member: @member }),
        turbo_stream.replace("modal", "<turbo-frame id='modal'/>")
      ]
    end
  end

  def update
    authorize current_member
    @member = Member.find_by(id: params[:id])
    if @member.update(member_params)
      if params[:invite]
        invite
      end

      broadcast_member_update

      render turbo_stream: [
        updated_row,
        turbo_stream.replace("modal", "<turbo-frame id='modal'/>")
      ]
    end
  end

  def set_as_admin
    authorize current_member
    @member = Member.find_by(id: params[:id])
    Permission.find_or_create_by(organization: @member.organization, grantee: @member, code: Permission::ORG_ADMIN)
    broadcast_member_update
    stream_updated_row
  end

  def revoke_admin
    authorize current_member
    @member = Member.find_by(id: params[:id])
    Permission.where(organization: @member.organization, grantee: @member, code: Permission::ORG_ADMIN).destroy_all
    broadcast_member_update
    stream_updated_row
  end

  def resend_invitation
    authorize current_member
    @member = Member.find_by(id: params[:id])
    invite
    broadcast_member_update
    stream_updated_row
  end

  def archive
    authorize current_member
    @member = Member.find_by(id: params[:id])
    @member.archive!
    broadcast_member_update
    stream_updated_row
  end

  def unarchive
    authorize current_member
    @member = Member.find_by(id: params[:id])
    @member.unarchive!
    broadcast_member_update
    stream_updated_row
  end

  def export
    authorize current_member
    @members = current_organization.members.to_a.sort_by do |member|
      [
        member.archived? ? 1 : 0,       # unarchived first
        member.org_admin? ? 0 : 1,      # admins first
        -member.created_at.to_i         # newer first
      ]
    end

    respond_to do |format|
      format.xlsx do
        response.headers["Content-Disposition"] = "attachment; filename=members_#{current_organization.name.parameterize}_#{Date.current}.xlsx"
      end
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
      invitation_key: invitation_key,
      language: @member.organization.language
    ).deliver_later
  end

  def member_params
    params.require(:member).permit(
      :name,
      :email,
      :initial,
      :color
    )
  end

  def stream_updated_row
    render turbo_stream: updated_row
  end

  def updated_row
    turbo_stream.replace(
      "member_row_#{@member.id}",
      partial: "members/member_row",
      locals: { member: @member }
    )
  end

  def broadcast_member_update
    Turbo::StreamsChannel.broadcast_replace_to(
      "members_list",
      target: "member_row_#{@member.id}",
      partial: "members/member_row",
      locals: { member: @member }
    )
  end
end
