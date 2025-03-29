class CustomFailure < Devise::FailureApp
  def respond
    if request.format.json?
      json_failure
    elsif request.format.turbo_stream?
      turbo_stream_failure
    else
      super
    end
    
    # Log security event
    log_security_event("authentication_failure") if warden_message != :timeout
  end

  def json_failure
    self.status = 401
    self.content_type = 'application/json'
    self.response_body = { error: i18n_message }.to_json
  end
  
  def turbo_stream_failure
    self.status = 401
    self.content_type = 'text/vnd.turbo-stream.html'
    self.response_body = Turbo::Streams::TagBuilder.new.replace(
      'flash', 
      partial: 'shared/flash', 
      locals: { flash: { alert: i18n_message } }
    )
  end
  
  private
  
  def log_security_event(event_type)
    # Find the user being attempted
    attempted_email = request.params.dig(:user, :email)
    user = attempted_email.present? ? User.find_by(email: attempted_email) : nil
    
    # Build metadata
    metadata = {
      ip_address: request.ip,
      user_agent: request.user_agent,
      email: attempted_email,
      reason: warden_message,
      path: request.path,
      timestamp: Time.current
    }
    
    # Log to appropriate places
    if user
      user.log_security_event(event_type, metadata)
    else
      # Log to a general security log when no user found
      Rails.logger.warn("Security Event [#{event_type}]: #{metadata.to_json}")
    end
  end
end 