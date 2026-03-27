class MembersController < ApplicationController
  before_action :authenticate_user!

  def index
    authorize current_member
    members = current_organization.members
    render json: members.order(id: :desc), status: :ok
  end

  def show
    authorize current_member
    member = current_organization.members.find_by_id(params[:id])
    render json: { errors: [ controller_t("not_found") ] }, status: :not_found unless member
    # Tech debt: Add translation
    render json: member, status: :ok
  end

  def create
    authorize current_member

    member = Member.new(organization: current_organization)
    member.assign_attributes(member_params)
    if member.save
      if params[:invite]
        invite(member)
      end

      render json: member, status: :ok
    end
  end

  def update
    authorize current_member
    member = Member.find_by(id: params[:id])
    if member.update(member_params)
      if params[:invite]
        invite(member)
      end

      render json: member, status: :ok
    end
  end

  def set_as_admin
    authorize current_member
    member = Member.find_by(id: params[:id])
    Permission.find_or_create_by(organization: member.organization, grantee: member, code: Permission::ORG_ADMIN)

    render json: member, status: :ok
  end

  def revoke_admin
    authorize current_member
    member = Member.find_by(id: params[:id])
    Permission.where(organization: member.organization, grantee: member, code: Permission::ORG_ADMIN).destroy_all

    render json: member, status: :ok
  end

  def resend_invitation
    authorize current_member
    member = Member.find_by(id: params[:id])
    render json: { errors: controller_t("already_joined") }, status: :unprocessable_content if member.joined_at.present?
    # Tech debt: Add translation
    invite(member)
    render json: member, status: :ok
  end

  def archive
    authorize current_member
    member = Member.find_by(id: params[:id])
    member.archive!
    render json: member, status: :ok
  end

  def unarchive
    authorize current_member
    member = Member.find_by(id: params[:id])
    member.unarchive!
    render json: member, status: :ok
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

  def invite(member)
    invitation_key = SecureRandom.alphanumeric(10)
    member.update!(
      invited_at: Time.current,
      invitation_key: invitation_key
    )

    MemberMailer.invitation(
      member_id: member.id,
      organization_id: current_organization.id,
      invitation_key: invitation_key,
      language: member.organization.language
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
end
