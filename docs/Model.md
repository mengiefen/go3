# Database Models for ERP SAAS Platform

This document outlines the database schema for the ERP SAAS platform, including all tables, relationships, fields, indexes, and storage specifications.

## Core Models

### 1. Authentication & User Management

#### Users
The foundation of the authentication system, representing individuals who can access the platform.

```ruby
create_table "users", force: :cascade do |t|
  t.string "email", null: false, index: { unique: true }
  t.string "password_digest", null: false
  t.string "confirmation_token", index: true
  t.datetime "confirmation_sent_at"
  t.datetime "confirmed_at"
  t.string "reset_password_token", index: true
  t.datetime "reset_password_sent_at"
  t.integer "failed_attempts", default: 0, null: false
  t.string "unlock_token", index: true
  t.datetime "locked_at"
  t.string "otp_secret"
  t.boolean "otp_required_for_login", default: false
  t.integer "consumed_timestep"
  t.string "recovery_codes", array: true
  t.string "preferred_locale", default: "en"
  t.jsonb "preferences", default: {}, null: false
  t.datetime "last_sign_in_at"
  t.inet "last_sign_in_ip"
  t.timestamps
  t.index ["email"], name: "index_users_on_email", unique: true
end
```

#### Social Accounts
Linking users with third-party authentication providers like Google, Facebook, Apple, and LinkedIn.

```ruby
create_table "social_accounts", force: :cascade do |t|
  t.references :user, null: false, foreign_key: true, index: true
  t.string "provider", null: false
  t.string "uid", null: false
  t.string "token"
  t.string "refresh_token"
  t.datetime "expires_at"
  t.jsonb "auth_data", default: {}, null: false
  t.timestamps
  t.index ["provider", "uid"], name: "index_social_accounts_on_provider_and_uid", unique: true
end
```

#### Sessions
Track active user sessions, allowing for secure authentication and multi-device management.

```ruby
create_table "sessions", force: :cascade do |t|
  t.references :user, null: false, foreign_key: true, index: true
  t.string "user_agent"
  t.string "ip_address"
  t.datetime "last_active_at"
  t.string "token", null: false
  t.timestamps
  t.index ["token"], name: "index_sessions_on_token", unique: true
end
```

#### Device Tokens
For storing mobile device tokens to support push notifications.

```ruby
create_table "device_tokens", force: :cascade do |t|
  t.references :user, null: false, foreign_key: true, index: true
  t.string "token", null: false
  t.string "platform", null: false # ios, android, web
  t.string "device_identifier"
  t.timestamps
  t.index ["token"], name: "index_device_tokens_on_token", unique: true
end
```

### 2. Organizations & Members

#### Organizations
The central entity representing businesses of all sizes.

```ruby
create_table "organizations", force: :cascade do |t|
  t.jsonb "name_translations", default: {}, null: false # {'en': 'Acme Inc.', 'fr': 'Acme Inc.', 'fa': 'شرکت اکمی'}
  t.references :parent, foreign_key: { to_table: :organizations }, index: true
  t.boolean "is_trial", default: true, null: false
  t.datetime "trial_end_date"
  t.boolean "active", default: true, null: false
  t.string "slug", null: false, index: { unique: true }
  t.string "timezone", default: "UTC", null: false
  t.string "default_locale", default: "en", null: false
  t.string "logo_url"
  t.jsonb "settings", default: {}, null: false
  t.string "domain"
  t.timestamps
  t.index "((name_translations ->> 'en'))", name: "index_organizations_on_name_en"
end
```

#### Members
Users within an organization, can be employees or external contributors.

```ruby
create_table "members", force: :cascade do |t|
  t.jsonb "first_name_translations", default: {}, null: false
  t.jsonb "last_name_translations", default: {}, null: false
  t.references :organization, null: false, foreign_key: true, index: true
  t.string "email", null: false
  t.datetime "invitation_sent_at"
  t.datetime "joined_at"
  t.references :user, foreign_key: true, index: true
  t.boolean "active", default: true, null: false
  t.string "invitation_token", index: true
  t.datetime "invitation_accepted_at"
  t.jsonb "position_translations", default: {}, null: false
  t.string "phone"
  t.timestamps
  t.index ["organization_id", "email"], name: "index_members_on_organization_id_and_email", unique: true
  t.index "((first_name_translations ->> 'en'))", name: "index_members_on_first_name_en"
  t.index "((last_name_translations ->> 'en'))", name: "index_members_on_last_name_en"
end
```

#### Roles
Positions/roles within an organization to define member responsibilities and permissions.

```ruby
create_table "roles", force: :cascade do |t|
  t.jsonb "name_translations", default: {}, null: false # {'en': 'Finance Manager', 'fa': 'مدیر مالی'}
  t.references :parent, foreign_key: { to_table: :roles }, index: true
  t.references :organization, null: false, foreign_key: true, index: true
  t.references :member, foreign_key: true, index: true
  t.timestamps
  t.index ["organization_id"], name: "index_roles_on_organization_id"
  t.index "((name_translations ->> 'en'))", name: "index_roles_on_name_en"
end
```

### 3. Permissions & Authorization

#### Permissions
Define specific actions that can be performed within the system.

```ruby
create_table "permissions", force: :cascade do |t|
  t.jsonb "name_translations", default: {}, null: false
  t.string "resource_type"
  t.string "action", null: false
  t.jsonb "description_translations", default: {}, null: false
  t.timestamps
  t.index ["action", "resource_type"], name: "index_permissions_on_action_and_resource_type", unique: true
  t.index "((name_translations ->> 'en'))", name: "index_permissions_on_name_en"
end
```

#### Permissionables (Polymorphic Association)
A unified permission assignment system for users, roles, and user groups.

```ruby
create_table "permissionables", force: :cascade do |t|
  t.references :permission, null: false, foreign_key: true, index: true
  t.references :permissionable, polymorphic: true, null: false, index: true
  t.references :organization, null: false, foreign_key: true, index: true
  t.timestamps
  t.index ["permission_id", "permissionable_type", "permissionable_id", "organization_id"], 
    name: "index_unique_permissionables", unique: true
end
```

#### User Groups
Groups of members for simplified permission assignment.

```ruby
create_table "user_groups", force: :cascade do |t|
  t.jsonb "name_translations", default: {}, null: false
  t.references :organization, null: false, foreign_key: true, index: true
  t.jsonb "description_translations", default: {}, null: false
  t.timestamps
  t.index ["organization_id"], name: "index_user_groups_on_organization_id"
  t.index "((name_translations ->> 'en'))", name: "index_user_groups_on_name_en", unique: true
end
```

#### User Group Members
Join table connecting members to user groups.

```ruby
create_table "user_group_members", force: :cascade do |t|
  t.references :user_group, null: false, foreign_key: true, index: true
  t.references :member, null: false, foreign_key: true, index: true
  t.timestamps
  t.index ["user_group_id", "member_id"], name: "index_user_group_members_on_user_group_id_and_member_id", unique: true
end
```

### 4. Internationalization & Localization

#### Translatable Content
For longer or more complex translatable content that isn't suitable for the JSONB approach.

```ruby
create_table "translatable_contents", force: :cascade do |t|
  t.string "translatable_type", null: false
  t.bigint "translatable_id", null: false
  t.string "field_name", null: false
  t.jsonb "translations", default: {}, null: false # {'en': 'Long content...', 'fa': 'محتوای طولانی...'}
  t.timestamps
  t.index ["translatable_type", "translatable_id", "field_name"], name: "index_translatable_contents_unique", unique: true
end
```

#### Locales
Available languages in the system.

```ruby
create_table "locales", force: :cascade do |t|
  t.string "code", null: false
  t.jsonb "name_translations", default: {}, null: false # {'en': 'English', 'fa': 'انگلیسی'}
  t.boolean "is_default", default: false, null: false
  t.boolean "active", default: true, null: false
  t.boolean "is_rtl", default: false, null: false
  t.timestamps
  t.index ["code"], name: "index_locales_on_code", unique: true
end
```

### 5. Notifications

#### Notifications
Track notifications sent to users.

```ruby
create_table "notifications", force: :cascade do |t|
  t.references :recipient, polymorphic: true, null: false, index: true
  t.string "type", null: false
  t.jsonb "params", default: {}, null: false
  t.datetime "read_at"
  t.datetime "interacted_at"
  t.timestamps
  t.index ["recipient_type", "recipient_id", "read_at"], name: "index_notifications_on_recipient_and_read"
end
```

#### Notification Preferences
User preferences for notifications by type and channel.

```ruby
create_table "notification_preferences", force: :cascade do |t|
  t.references :user, null: false, foreign_key: true, index: true
  t.string "notification_type", null: false
  t.boolean "email_enabled", default: true, null: false
  t.boolean "sms_enabled", default: false, null: false
  t.boolean "push_enabled", default: true, null: false
  t.boolean "in_app_enabled", default: true, null: false
  t.timestamps
  t.index ["user_id", "notification_type"], name: "index_notification_preferences_on_user_id_and_type", unique: true
end
```

### 6. File Management

#### Files
Track files uploaded to the system.

```ruby
create_table "files", force: :cascade do |t|
  t.jsonb "name_translations", default: {}, null: false
  t.string "content_type"
  t.integer "byte_size"
  t.string "checksum"
  t.references :attachable, polymorphic: true, index: true
  t.references :uploaded_by, foreign_key: { to_table: :users }, index: true
  t.string "storage_service" # local, s3, azure, gcs
  t.string "storage_key" # path or key in storage service
  t.boolean "is_public", default: false, null: false
  t.jsonb "metadata", default: {}, null: false
  t.datetime "virus_scanned_at"
  t.boolean "virus_scan_passed"
  t.timestamps
  t.index "((name_translations ->> 'en'))", name: "index_files_on_name_en"
end
```

#### File Access Logs
Audit trail for file access.

```ruby
create_table "file_access_logs", force: :cascade do |t|
  t.references :file, null: false, foreign_key: true, index: true
  t.references :user, null: false, foreign_key: true, index: true
  t.string "action", null: false # download, view, share
  t.inet "ip_address"
  t.string "user_agent"
  t.timestamps
  t.index ["file_id", "created_at"], name: "index_file_access_logs_on_file_id_and_created_at"
end
```

### 7. Subscription & Payment Management

#### Plans
Defines the available subscription plans in the system.

```ruby
create_table "plans", force: :cascade do |t|
  t.jsonb "name_translations", default: {}, null: false
  t.jsonb "description_translations", default: {}, null: false
  t.string "code", null: false # unique identifier for the plan
  t.integer "price_cents", default: 0, null: false
  t.string "price_currency", default: "USD", null: false
  t.string "billing_cycle", null: false # monthly, quarterly, yearly
  t.integer "trial_days", default: 0, null: false
  t.jsonb "features", default: {}, null: false # hash of features and limits
  t.integer "user_limit", default: 0, null: false
  t.integer "storage_limit_mb", default: 0, null: false
  t.boolean "active", default: true, null: false
  t.timestamps
  t.index ["code"], name: "index_plans_on_code", unique: true
  t.index "((name_translations ->> 'en'))", name: "index_plans_on_name_en"
end
```

#### Subscriptions
Tracks organization subscriptions to plans.

```ruby
create_table "subscriptions", force: :cascade do |t|
  t.references :organization, null: false, foreign_key: true, index: true
  t.references :plan, null: false, foreign_key: true, index: true
  t.datetime "starts_at", null: false
  t.datetime "ends_at"
  t.string "status", null: false # active, canceled, past_due, trialing, expired
  t.datetime "trial_ends_at"
  t.string "cancellation_reason"
  t.datetime "canceled_at"
  t.string "payment_provider" # stripe, paypal, etc
  t.string "payment_provider_subscription_id"
  t.jsonb "payment_provider_data", default: {}, null: false
  t.boolean "auto_renew", default: true, null: false
  t.datetime "next_billing_at"
  t.integer "current_period_start_at"
  t.integer "current_period_end_at"
  t.timestamps
  t.index ["organization_id", "status"], name: "index_subscriptions_on_organization_id_and_status"
  t.index ["payment_provider", "payment_provider_subscription_id"], name: "index_subscriptions_on_payment_provider", unique: true
end
```

#### PaymentMethods
Stores information about customer payment methods.

```ruby
create_table "payment_methods", force: :cascade do |t|
  t.references :organization, null: false, foreign_key: true, index: true
  t.string "payment_provider", null: false # stripe, paypal, crypto, etc
  t.string "payment_provider_method_id"
  t.jsonb "payment_provider_data", default: {}, null: false
  t.string "card_type" # visa, mastercard, etc
  t.string "last_four"
  t.integer "expiry_month"
  t.integer "expiry_year"
  t.boolean "is_default", default: false, null: false
  t.string "crypto_currency" # btc, eth, etc
  t.string "crypto_wallet_address"
  t.timestamps
  t.index ["organization_id", "is_default"], name: "index_payment_methods_on_organization_id_and_is_default"
  t.index ["payment_provider", "payment_provider_method_id"], name: "index_payment_methods_on_payment_provider", unique: true, where: "payment_provider_method_id IS NOT NULL"
end
```

#### CryptoWallets
Platform cryptocurrency wallets for receiving payments.

```ruby
create_table "crypto_wallets", force: :cascade do |t|
  t.string "currency", null: false # btc, eth, etc
  t.string "address", null: false
  t.string "name", null: false
  t.boolean "active", default: true, null: false
  t.jsonb "configuration", default: {}, null: false # API keys, connection info, etc.
  t.timestamps
  t.index ["currency", "address"], name: "index_crypto_wallets_on_currency_and_address", unique: true
end
```

#### CryptoTransactions
Records cryptocurrency payment transactions.

```ruby
create_table "crypto_transactions", force: :cascade do |t|
  t.references :organization, null: false, foreign_key: true, index: true
  t.references :payment, foreign_key: true, index: true
  t.references :invoice, foreign_key: true, index: true
  t.string "blockchain", null: false # ethereum, bitcoin, etc
  t.string "transaction_hash", null: false
  t.string "from_address", null: false
  t.string "to_address", null: false
  t.string "currency", null: false # BTC, ETH, USDC, etc
  t.decimal "amount", precision: 24, scale: 8, null: false
  t.decimal "exchange_rate", precision: 24, scale: 8
  t.string "exchange_rate_currency", default: "USD"
  t.decimal "fiat_amount", precision: 10, scale: 2
  t.integer "confirmations", default: 0
  t.string "status", null: false # pending, confirmed, failed
  t.datetime "confirmed_at"
  t.jsonb "transaction_data", default: {}, null: false
  t.timestamps
  t.index ["blockchain", "transaction_hash"], name: "index_crypto_transactions_on_blockchain_and_hash", unique: true
end
```

#### Invoices
Records detailed invoice information.

```ruby
create_table "invoices", force: :cascade do |t|
  t.references :organization, null: false, foreign_key: true, index: true
  t.references :subscription, foreign_key: true, index: true
  t.string "invoice_number", null: false
  t.integer "amount_cents", default: 0, null: false
  t.string "amount_currency", default: "USD", null: false
  t.integer "tax_cents", default: 0, null: false
  t.integer "total_cents", default: 0, null: false
  t.string "status", null: false # draft, open, paid, void, uncollectible
  t.datetime "due_date"
  t.datetime "paid_at"
  t.string "payment_provider" # stripe, paypal, etc
  t.string "payment_provider_invoice_id"
  t.jsonb "payment_provider_data", default: {}, null: false
  t.jsonb "billing_address", default: {}, null: false
  t.string "billing_email"
  t.string "pdf_url"
  t.timestamps
  t.index ["invoice_number"], name: "index_invoices_on_invoice_number", unique: true
  t.index ["organization_id", "status"], name: "index_invoices_on_organization_id_and_status"
end
```

#### InvoiceItems
Line items associated with invoices.

```ruby
create_table "invoice_items", force: :cascade do |t|
  t.references :invoice, null: false, foreign_key: true, index: true
  t.jsonb "description_translations", default: {}, null: false
  t.integer "quantity", default: 1, null: false
  t.integer "unit_price_cents", default: 0, null: false
  t.string "unit_price_currency", default: "USD", null: false
  t.integer "amount_cents", default: 0, null: false
  t.timestamps
end
```

#### Payments
Records payment transactions.

```ruby
create_table "payments", force: :cascade do |t|
  t.references :organization, null: false, foreign_key: true, index: true
  t.references :invoice, foreign_key: true, index: true
  t.references :payment_method, foreign_key: true, index: true
  t.integer "amount_cents", default: 0, null: false
  t.string "amount_currency", default: "USD", null: false
  t.string "status", null: false # succeeded, pending, failed
  t.string "payment_provider" # stripe, paypal, crypto, etc
  t.string "payment_provider_payment_id"
  t.jsonb "payment_provider_data", default: {}, null: false
  t.string "error_code"
  t.string "error_message"
  t.string "payment_type", default: "fiat" # fiat, crypto
  t.timestamps
  t.index ["payment_provider", "payment_provider_payment_id"], name: "index_payments_on_payment_provider", unique: true, where: "payment_provider_payment_id IS NOT NULL"
end
```

#### DemoData
Configuration for demo/trial account data generation.

```ruby
create_table "demo_data_templates", force: :cascade do |t|
  t.jsonb "name_translations", default: {}, null: false
  t.string "industry_code"
  t.jsonb "configuration", default: {}, null: false # Configuration for what data to generate
  t.boolean "active", default: true, null: false
  t.jsonb "included_modules", default: {}, null: false # Modules to enable for this demo
  t.timestamps
  t.index ["industry_code"], name: "index_demo_data_templates_on_industry_code"
  t.index "((name_translations ->> 'en'))", name: "index_demo_data_templates_on_name_en"
end
```

## Integration with Rails 8 Authentication

The Rails 8 built-in authentication generator provides a solid foundation, but our model extends it with:

1. **Enhanced User Model**: Additional fields for locale preference, account locking, and MFA
2. **Session Management**: Tracking user sessions across devices
3. **Social Authentication**: Integration with multiple providers
4. **Multi-Factor Authentication**: TOTP, SMS, and email verification options

Implementation notes:
- Use Rails 8 `has_secure_password` for password hashing
- Leverage Rails 8 session management and enhance with database-backed sessions
- Store sensitive data (OTP secrets, tokens) securely using encryption

## Multi-Tenancy Implementation

The platform uses organization-based multi-tenancy with:

1. **Data Isolation**: Each organization's data is isolated through application-level controls
2. **Shared Database**: Single database with organization_id references
3. **Organization Hierarchy**: Parent-child relationships for enterprise customers
4. **Cross-Organization Access**: Members can belong to multiple organizations

## Translations with JSONB

We use a hybrid approach for translations:

### JSONB Translation Fields
For shorter translatable attributes like names, titles, and labels, we use JSONB fields directly in the model:

```ruby
class Organization < ApplicationRecord
  # name_translations = {'en': 'Acme Inc.', 'fr': 'Acme Inc.', 'fa': 'شرکت اکمی'}
  
  def name(locale = I18n.locale)
    locale = locale.to_s
    name_translations[locale] || name_translations[I18n.default_locale.to_s] || name_translations.values.first
  end
  
  def name=(value, locale = I18n.locale)
    locale = locale.to_s
    self.name_translations = name_translations.merge(locale => value)
  end
end
```

**Advantages:**
1. **Simpler Queries**: No need to join with a separate translations table
2. **Performance**: Faster access for retrieving all translations of a field at once
3. **Improved Search**: Indexing specific language keys for efficient searching
4. **Flexibility**: Easy to add new languages without schema changes

### Translatable Content Table
For longer or more complex content, we use a dedicated table:

```ruby
class Article < ApplicationRecord
  has_many :translatable_contents, as: :translatable
  
  def content(locale = I18n.locale)
    content_translation = translatable_contents.find_by(field_name: 'content')
    return nil unless content_translation
    
    locale = locale.to_s
    content_translation.translations[locale] || 
      content_translation.translations[I18n.default_locale.to_s] || 
      content_translation.translations.values.first
  end
end
```

## Unified Permission System

We implement a polymorphic permission association through the `permissionables` table:

```ruby
class Permission < ApplicationRecord
  has_many :permissionables
  has_many :user_permissionables, -> { where(permissionable_type: 'User') }, class_name: 'Permissionable'
  has_many :role_permissionables, -> { where(permissionable_type: 'Role') }, class_name: 'Permissionable'
  has_many :user_group_permissionables, -> { where(permissionable_type: 'UserGroup') }, class_name: 'Permissionable'
  
  has_many :users, through: :user_permissionables, source: :permissionable, source_type: 'User'
  has_many :roles, through: :role_permissionables, source: :permissionable, source_type: 'Role'
  has_many :user_groups, through: :user_group_permissionables, source: :permissionable, source_type: 'UserGroup'
end

class User < ApplicationRecord
  has_many :permissionables, as: :permissionable
  has_many :permissions, through: :permissionables
end

class Role < ApplicationRecord
  has_many :permissionables, as: :permissionable
  has_many :permissions, through: :permissionables
end

class UserGroup < ApplicationRecord
  has_many :permissionables, as: :permissionable
  has_many :permissions, through: :permissionables
end
```

**Advantages:**
1. **Unified Permission Checking**: Common code path for all permission types
2. **Flexibility**: Easily add permissions to new entity types
3. **Simplified Authorization**: Authorization code works the same for all permissionable types
4. **Reduced Redundancy**: Consolidated permission logic

## Subscription and Payment Management

### Subscription Management

The platform implements a flexible subscription model with:

1. **Plan Configuration**: Multiple plans with different feature sets and limits
2. **Trial Support**: Automatic trial period management with full feature access
3. **Multi-Currency**: Support for multiple currencies with Money gem
4. **Billing Cycles**: Monthly, quarterly, or annual billing cycles
5. **Auto-Renewal**: Automatic subscription renewal with pre-notification

```ruby
class Organization < ApplicationRecord
  has_many :subscriptions
  has_one :active_subscription, -> { where(status: 'active') }, class_name: 'Subscription'
  has_many :payment_methods
  has_one :default_payment_method, -> { where(is_default: true) }, class_name: 'PaymentMethod'
  has_many :invoices
  has_many :payments
  
  def subscription_active?
    active_subscription.present? || trial_active?
  end
  
  def trial_active?
    is_trial && (trial_end_date.nil? || trial_end_date > Time.current)
  end
  
  def subscription_features
    return {} unless active_subscription&.plan
    active_subscription.plan.features
  end
  
  def can_access_feature?(feature_code)
    return true if trial_active?
    subscription_active? && subscription_features[feature_code]
  end
end
```

### Payment Gateway Integration

The platform provides a unified payment processing interface that supports multiple payment gateways:

```ruby
module PaymentProviders
  class Base
    def initialize(organization)
      @organization = organization
    end
    
    # Interface methods to be implemented by specific providers
    def create_customer; end
    def create_subscription(plan_id, payment_method_id); end
    def cancel_subscription(subscription_id); end
    def create_payment_method(params); end
    def process_payment(amount, payment_method_id, invoice_id = nil); end
    def create_invoice(subscription_id); end
  end
  
  class Stripe < Base
    # Stripe-specific implementations
  end
  
  class PayPal < Base
    # PayPal-specific implementations
  end
  
  class Cryptocurrency < Base
    # Implementation for crypto payments
    def initialize(organization, blockchain_provider = nil)
      super(organization)
      @blockchain_provider = blockchain_provider || determine_default_provider
    end
    
    def create_payment_method(params)
      # Create a crypto payment method record (stored address)
    end
    
    def process_payment(amount, crypto_currency, invoice_id = nil)
      # Generate payment address and track transaction
    end
    
    def verify_payment(transaction_hash)
      # Verify transaction on blockchain
    end
    
    private
    
    def determine_default_provider
      # Select appropriate blockchain API provider
    end
  end
  
  # Factory method to get appropriate provider
  def self.for_provider(provider_name, organization)
    case provider_name.to_s
    when 'stripe'
      Stripe.new(organization)
    when 'paypal'
      PayPal.new(organization)
    when 'crypto'
      Cryptocurrency.new(organization)
    else
      raise "Unknown payment provider: #{provider_name}"
    end
  end
end
```

### Demo Data Generation

For trial accounts, the platform automatically generates realistic demo data:

```ruby
class DemoDataGenerator
  def initialize(organization, template_code)
    @organization = organization
    @template = DemoDataTemplate.find_by(industry_code: template_code, active: true)
  end
  
  def generate
    ActiveRecord::Base.transaction do
      generate_members
      generate_roles
      generate_user_groups
      generate_financial_data if @template.included_modules['finance']
      generate_inventory_data if @template.included_modules['inventory']
      generate_hr_data if @template.included_modules['hr']
      # Additional modules as configured in the template
    end
  end
  
  private
  
  def generate_members
    # Create demo members based on template configuration
  end
  
  def generate_roles
    # Create demo roles based on template configuration
  end
  
  # Additional private generation methods
end
```

## Database Considerations

### Indexing Strategy
- Foreign keys are indexed
- Composite indexes on frequently queried combinations
- Unique indexes to enforce data integrity
- JSONB indexes for frequently queried translation fields (`->> 'en'`)

### PostgreSQL-Specific Features
- JSONB for translations, preferences, and metadata
- Array types for recovery codes and other array data
- Consider using PostgreSQL schemas for larger enterprise customers

### Performance Optimizations
- Use counter caches for frequently counted relationships
- Implement database-level constraints for data integrity
- Leverage database functions for complex operations
- Create GIN indexes for JSONB fields that need full-text search

## File Storage

### Active Storage Configuration

```ruby
# config/storage.yml
local:
  service: Disk
  root: <%= Rails.root.join("storage") %>

amazon:
  service: S3
  access_key_id: <%= Rails.application.credentials.dig(:aws, :access_key_id) %>
  secret_access_key: <%= Rails.application.credentials.dig(:aws, :secret_access_key) %>
  region: <%= Rails.application.credentials.dig(:aws, :region) %>
  bucket: <%= Rails.application.credentials.dig(:aws, :bucket) %>
  public: false
  upload:
    cache_control: "private, max-age=<%= 1.day.to_i %>"
    server_side_encryption: "AES256"
```

### Security Measures
- Files are private by default
- Access control through application authorization
- Signed URLs with expiration for temporary access
- Virus scanning before storage

## Additional Considerations

### Database Evolution Strategy
1. **Rails Migrations**: Use standard Rails migrations for schema changes
2. **Feature Flags**: Use feature flags for gradual rollout of schema changes
3. **Zero Downtime Migrations**: Plan for zero downtime migrations for production

### Data Archiving and Retention
- Implement soft deletes for most models
- Create archive tables for long-term storage of historical data
- Implement data retention policies based on compliance requirements

### Backup and Recovery
- Regular database backups (at least daily)
- Point-in-time recovery capability
- Store backups in multiple geographic regions
- Test restoration procedures regularly

## Recommended Improvements

Based on the project requirements, the following improvements are recommended:

1. **Enhanced MFA**: Add backup codes and device management for MFA
2. **Login Tracking**: Track login attempts and suspicious activities
3. **Audit Logging**: Track all important data changes
4. **Rate Limiting**: Implement database-backed rate limiting for authentication
5. **Translation Management**: Add tools for managing JSONB translations
6. **File Processing Pipeline**: Add processing states for file uploads
7. **Organization Plans/Tiers**: Add support for subscription plans and feature limitations
8. **Background Job Tracking**: Track job execution and status
9. **API Authentication**: Add support for API tokens and OAuth authorization
10. **Payment Analytics**: Add reporting and analytics for subscription and payment data
11. **Revenue Recognition**: Implement revenue recognition rules for accounting
12. **Tax Calculation Integration**: Add integration with tax calculation services
13. **Subscription Upgrade/Downgrade Workflows**: Implement proration and migration between plans
14. **Cryptocurrency Support**: Enhance cryptocurrency payment processing with exchange rate management and multi-chain support
15. **Regulatory Compliance**: Implement KYC and AML compliance for cryptocurrency transactions 