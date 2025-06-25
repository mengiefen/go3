class MemberMailer < ApplicationMailer
  def invitation(member_id:, organization_id:, invitation_key:)
    @member = Member.find(member_id)
    @organization = Organization.find(organization_id)
    @signup_url = new_user_registration_url(invitation_key: invitation_key)
    
    mail(
      to: @member.email,
      subject: mailer_t("you_are_invited", organization_name: @organization.name)
    )
  end
end