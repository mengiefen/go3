class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :confirmable, :lockable, :timeoutable, :trackable,
         :omniauthable, omniauth_providers: [:google_oauth2, :linkedin]
         
  # Validations
  validates :email, presence: true, uniqueness: true
  validates :first_name, :last_name, presence: true, on: :update
  validates :first_name, :last_name, length: { minimum: 2, maximum: 50 }, 
                                       format: { with: /\A[a-zA-Z\s\-']+\z/, message: "can only contain letters, spaces, hyphens, and apostrophes" }, 
                                       allow_blank: true
  validate :password_complexity, if: -> { encrypted_password_changed? || new_record? }
  
  # Callbacks
  before_save :ensure_otp_secret, if: :otp_required_for_login_changed?
  
  # Attributes
  attr_accessor :otp_code, :otp_code_attempt
  
  # Scopes
  scope :active, -> { where(active: true) }
  scope :inactive, -> { where(active: false) }
  
  # Class methods
  def self.from_omniauth(auth)
    Rails.logger.info("Processing OAuth data for provider: #{auth.provider}")
    
    # Find existing user by provider/uid or email
    user = find_by(provider: auth.provider, uid: auth.uid) 
    user ||= find_by(email: auth.info.email) if auth.info.email.present?
    
    if user
      Rails.logger.info("Found existing user: #{user.id}")
      # Update oauth credentials for existing user
      user.update(
        provider: auth.provider,
        uid: auth.uid,
        # Only update name if not already set
        first_name: user.first_name.blank? ? parse_first_name(auth) : user.first_name,
        last_name: user.last_name.blank? ? parse_last_name(auth) : user.last_name
      )
      return user
    end
    
    # Create new user from oauth data
    Rails.logger.info("Creating new user from OAuth data")
    user = create_from_oauth_data(auth)
    
    # Ensure the user is persisted before returning
    unless user.persisted?
      Rails.logger.error("Failed to persist social user: #{user.errors.full_messages.join(', ')}")
    end
    
    user
  end
  
  def self.create_from_oauth_data(auth)
    # Confirm we have an email which is required
    unless auth.info.email.present?
      Rails.logger.error("OAuth data missing required email: #{auth.to_json}")
      return User.new.tap { |u| u.errors.add(:email, "is required") }
    end
    
    # Create a secure random password
    generated_password = Devise.friendly_token[0, 20]
    
    user = User.new(
      provider: auth.provider,
      uid: auth.uid,
      email: auth.info.email,
      password: generated_password,
      first_name: parse_first_name(auth),
      last_name: parse_last_name(auth),
      avatar: auth.info.image
    )
    
    # Skip email confirmation for OAuth users
    user.skip_confirmation!
    
    # Save and log the result
    if user.save
      Rails.logger.info("Successfully created new user: #{user.id}")
      # Additional attributes that should be set for new social users
      user.update(
        active: true,
        sign_in_count: 1,
        current_sign_in_at: Time.current,
        last_sign_in_at: Time.current,
        current_sign_in_ip: Current.ip_address,
        last_sign_in_ip: Current.ip_address
      )
      
      # Send welcome email
      user.send_welcome_email
    else
      Rails.logger.error("Failed to create user: #{user.errors.full_messages.join(', ')}")
    end
    
    user
  end
  
  # Helper methods for parsing OAuth data
  def self.parse_first_name(auth)
    case auth.provider
    when 'linkedin'
      # LinkedIn might use name instead of first_name/last_name
      auth.info.first_name || auth.info.name&.split(" ")&.first || "LinkedIn"
    else
      # Google should provide first_name directly
      auth.info.first_name || auth.info.name&.split(" ")&.first || "User"
    end
  end
  
  def self.parse_last_name(auth)
    case auth.provider
    when 'linkedin'
      auth.info.last_name || 
        (auth.info.name.present? && auth.info.name.split(" ").size > 1 ? 
         auth.info.name.split(" ").drop(1).join(" ") : 
         "User")
    else
      auth.info.last_name || 
        (auth.info.name.present? && auth.info.name.split(" ").size > 1 ? 
         auth.info.name.split(" ").drop(1).join(" ") : 
         "User")
    end
  end
  
  # Sends a welcome email to a newly created user
  def send_welcome_email
    UserMailer.welcome_email(self).deliver_now
  rescue => e
    Rails.logger.error("Failed to send welcome email to #{email}: #{e.message}")
  end
  
  # MFA methods
  def otp_qr_code
    return nil unless otp_secret.present?
    issuer = "GO3"
    label = "#{issuer}:#{email}"
    uri = ROTP::TOTP.new(otp_secret, issuer: issuer).provisioning_uri(label)
    qrcode = RQRCode::QRCode.new(uri)
    qrcode.as_svg(module_size: 4)
  end
  
  def verify_otp(code)
    return false unless otp_secret.present?
    totp = ROTP::TOTP.new(otp_secret, issuer: "GO3")
    
    # Try with increasing drift windows
    [30, 60, 90, 120].each do |drift|
      result = totp.verify(code, drift_behind: drift, drift_ahead: drift)
      
      if result
        update(
          otp_verified: true,
          consumed_timestep: result
        )
        return true
      end
    end
    
    return false
  end
  
  def generate_otp_backup_codes
    codes = []
    10.times do
      codes << SecureRandom.hex(8)
    end
    update(otp_backup_codes: codes.join(','))
    codes
  end
  
  def verify_backup_code(code)
    return false unless otp_backup_codes.present?
    codes = otp_backup_codes.split(',')
    if codes.include?(code)
      new_codes = codes - [code]
      update(otp_backup_codes: new_codes.join(','))
      true
    else
      false
    end
  end
  
  # Preferences methods
  def locale
    preferences&.dig('preferred_locale') || "en"
  end
  
  def set_preference(key, value)
    new_preferences = preferences || {}
    new_preferences[key] = value
    update(preferences: new_preferences)
  end
  
  def get_preference(key, default = nil)
    preferences&.dig(key) || default
  end
  
  # Account methods
  def full_name
    [first_name, last_name].compact.join(' ')
  end
  
  def active_for_authentication?
    super && active?
  end
  
  def inactive_message
    active? ? super : :account_inactive
  end
  
  def deactivate
    update(active: false, deactivated_at: Time.current)
  end
  
  def reactivate
    update(active: true, deactivated_at: nil)
  end
  
  def log_security_event(event_type, metadata = {})
    events = JSON.parse(security_audit_log || '[]')
    events << {
      event_type: event_type,
      timestamp: Time.current,
      ip_address: Current.ip_address,
      user_agent: Current.user_agent,
      metadata: metadata
    }
    update(security_audit_log: events.to_json)
  end
  
  # Activity tracking
  def track_activity(activity_type)
    update(
      last_activity_type: activity_type,
      last_activity_at: Time.current
    )
  end
  
  # Class method to generate a random OTP secret
  def self.generate_otp_secret
    ROTP::Base32.random
  end
  
  # Get the TOTP object for the user
  def totp
    ROTP::TOTP.new(otp_secret, issuer: "GO3")
  end
  
  # Generate a URI for the QR code
  def otp_provisioning_uri(account_name)
    issuer = "GO3"
    ROTP::TOTP.new(otp_secret, issuer: issuer).provisioning_uri(account_name)
  end
  
  # Verify and consume a OTP
  def validate_and_consume_otp!(code)
    return false if code.blank?
    puts "DEBUG: Validating OTP code: #{code}"
    puts "DEBUG: OTP secret: #{otp_secret.present? ? 'Present' : 'Missing'}"
    
    # Create a TOTP verifier
    totp = ROTP::TOTP.new(otp_secret, issuer: "GO3")
    
    # Try with increasing drift windows
    [30, 60, 90, 120].each do |drift|
      puts "DEBUG: Trying with drift: #{drift} seconds"
      result = totp.verify(code.strip, drift_behind: drift, drift_ahead: drift)
      
      if result
        puts "DEBUG: OTP valid with drift: #{drift} seconds"
        update(consumed_timestep: result)
        return true
      end
    end
    
    puts "DEBUG: OTP invalid with all drift windows"
    return false
  end
  
  # Generate backup codes
  def generate_otp_backup_codes!
    codes = []
    10.times do
      codes << SecureRandom.hex(8)
    end
    self.otp_backup_codes = codes
    save!
    codes
  end
  
  # Verify and consume a backup code
  def validate_and_consume_backup_code!(code)
    return false if code.blank? || otp_backup_codes.blank?
    
    # Remove any spaces
    code = code.strip
    
    backup_codes = otp_backup_codes.is_a?(Array) ? otp_backup_codes : JSON.parse(otp_backup_codes.to_s)
    
    # Check if the code exists in the backup codes
    if backup_codes.include?(code)
      # Remove the used code
      remaining_codes = backup_codes - [code]
      update(otp_backup_codes: remaining_codes)
      true
    else
      false
    end
  end
  
  # OAuth methods
  def linked_providers
    return [] if provider.blank? || uid.blank?
    [provider]
  end
  
  def linked_to?(provider_name)
    provider == provider_name && uid.present?
  end
  
  def link_oauth_account(auth)
    return false unless auth.provider.present? && auth.uid.present?
    
    # Don't allow linking if already linked to a different provider
    if provider.present? && provider != auth.provider
      errors.add(:provider, "already linked to #{provider}")
      return false
    end
    
    # Update provider details
    update(
      provider: auth.provider,
      uid: auth.uid
    )
  end
  
  def unlink_oauth_account
    return false unless provider.present? && uid.present?
    
    # Ensure user has a password if unlinking
    if encrypted_password.blank?
      errors.add(:base, "You need to set a password before unlinking your social account")
      return false
    end
    
    update(provider: nil, uid: nil)
  end
  
  # Password strength validation method
  def password_complexity
    return if password.blank?
    
    # Check password complexity
    unless password.match?(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=~`{}\[\]|:;"'<>,.?\/])/)
      errors.add :password, "must include at least one lowercase letter, one uppercase letter, one digit, and one special character"
    end
    
    # Check for minimum length (already handled by Devise, but adding as a backup)
    if password.length < 8
      errors.add :password, "must be at least 8 characters long"
    end
    
    # Check for common patterns
    common_patterns = %w[qwerty asdfgh zxcvb 123456 password]
    if common_patterns.any? { |pattern| password.downcase.include?(pattern) }
      errors.add :password, "contains a common pattern. Please choose a more secure password."
    end
    
    # Check for personal information in password
    if first_name.present? && password.downcase.include?(first_name.downcase)
      errors.add :password, "should not contain your first name"
    end
    
    if last_name.present? && password.downcase.include?(last_name.downcase)
      errors.add :password, "should not contain your last name"
    end
    
    if email.present? && password.downcase.include?(email.split('@').first.downcase)
      errors.add :password, "should not contain your email username"
    end
  end
  
  private
  
  def ensure_otp_secret
    self.otp_secret = ROTP::Base32.random if otp_required_for_login? && otp_secret.blank?
  end
end
