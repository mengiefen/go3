class MemberMailer < ApplicationMailer
  def invitation(member_id:, organization_id:, invitation_key:, locale:, email:)
    @member = Member.find(member_id)
    @organization = Organization.find(organization_id)
    @signup_url = "http://localhost:5000/app/signup?invitation_key=#{invitation_key}&locale=#{locale}&email=#{email}"

    mail(
      to: @member.email,
      subject: mailer_t("you_are_invited", organization_name: @organization.name)
    )
  end
end
