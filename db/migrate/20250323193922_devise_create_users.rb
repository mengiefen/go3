# frozen_string_literal: true

class DeviseCreateUsers < ActiveRecord::Migration[8.0]
  def change
    create_table :users do |t|
      ## Database authenticatable
      t.string :email,              null: false, default: ""
      t.string :encrypted_password, null: false, default: ""

      ## Recoverable
      t.string   :reset_password_token
      t.datetime :reset_password_sent_at

      ## Rememberable
      t.datetime :remember_created_at

      ## Trackable
      t.integer  :sign_in_count, default: 0, null: false
      t.datetime :current_sign_in_at
      t.datetime :last_sign_in_at
      t.string   :current_sign_in_ip
      t.string   :last_sign_in_ip

      ## Confirmable
      t.string   :confirmation_token
      t.datetime :confirmed_at
      t.datetime :confirmation_sent_at
      t.string   :unconfirmed_email # Only if using reconfirmable

      ## Lockable
      t.integer  :failed_attempts, default: 0, null: false # Only if lock strategy is :failed_attempts
      t.string   :unlock_token # Only if unlock strategy is :email or :both
      t.datetime :locked_at

      ## OmniAuth
      t.string   :provider
      t.string   :uid

      ## Multi-factor Authentication
      t.string   :otp_secret
      t.boolean  :otp_required_for_login, default: false
      t.boolean  :otp_verified, default: false
      t.integer  :consumed_timestep
      t.string   :otp_backup_codes
      t.string   :phone_number
      t.boolean  :phone_verified, default: false
      
      ## User Profile
      t.string   :first_name
      t.string   :last_name
      t.string   :job_title
      t.date     :birth_date
      t.string   :avatar
      t.string   :timezone
      t.string   :preferred_locale, default: "en"
      t.jsonb    :preferences, default: {}, null: false
      t.boolean  :active, default: true
      t.datetime :deactivated_at
      
      ## Security
      t.datetime :password_changed_at
      t.string   :security_audit_log
      t.string   :last_activity_type
      t.datetime :last_activity_at

      t.timestamps null: false
    end

    add_index :users, :email,                unique: true
    add_index :users, :reset_password_token, unique: true
    add_index :users, :confirmation_token,   unique: true
    add_index :users, :unlock_token,         unique: true
    add_index :users, :otp_secret,           unique: true
    add_index :users, [:provider, :uid],     unique: true, where: "provider IS NOT NULL AND uid IS NOT NULL"
    add_index :users, [:first_name, :last_name]
    add_index :users, :phone_number
    add_index :users, :active
  end
end
