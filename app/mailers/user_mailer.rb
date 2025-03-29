class UserMailer < ApplicationMailer
  default from: 'notifications@example.com'
  
  def welcome_email(user)
    @user = user
    @url = new_user_session_url
    Rails.logger.info("Generating welcome email for #{user.email} with URL: #{@url}")
    mail(to: @user.email, subject: 'Welcome to GO3!')
  end
end 
