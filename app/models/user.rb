class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :confirmable, :lockable, :timeoutable, :trackable,
         :omniauthable, omniauth_providers: [:google_oauth2, :facebook, :apple, :linkedin]
         
  # Validations
  validates :email, presence: true, uniqueness: true
  validates :first_name, :last_name, presence: true, on: :update
  
  # Callbacks
  before_save :ensure_otp_secret, if: :otp_required_for_login_changed?
  
  # Attributes
  attr_accessor :otp_code, :otp_code_attempt
  
  # Scopes
  scope :active, -> { where(active: true) }
  scope :inactive, -> { where(active: false) }
  
  # Class methods
  def self.from_omniauth(auth)
    where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      user.email = auth.info.email
      user.password = Devise.friendly_token[0, 20]
      user.first_name = auth.info.first_name || auth.info.name.split(" ").first
      user.last_name = auth.info.last_name || auth.info.name.split(" ").last
      user.avatar = auth.info.image
      user.skip_confirmation!
    end
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
  
  private
  
  def ensure_otp_secret
    self.otp_secret = ROTP::Base32.random if otp_required_for_login? && otp_secret.blank?
  end
end
