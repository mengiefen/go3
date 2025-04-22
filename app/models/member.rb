class Member < ApplicationRecord
  # Will enable PaperTrail later
  has_paper_trail
  
  # Enable Mobility for translations with fallback to English
  extend Mobility
  translates :name, backend: :jsonb, fallbacks: true

  # Ensure name is always initialized as a hash
  after_initialize :initialize_name
  before_validation :initialize_name

  # Associations
  belongs_to :organization, optional: false
  belongs_to :user, optional: true
  has_many :role_assignments, -> { active }
  has_many :roles, through: :role_assignments, source: :role
  has_many :inactive_role_assignments, -> { inactive }, class_name: 'RoleAssignment'
  has_many :inactive_roles, through: :inactive_role_assignments, source: :role
  has_and_belongs_to_many :groups
  has_many :departments, through: :roles
  has_many :direct_permissions, as: :grantee, class_name: 'Permission'

  # Validations
  validates :email, presence: true, 
                    uniqueness: { scope: :organization_id },
                    format: { with: URI::MailTo::EMAIL_REGEXP }

  validate :name_has_at_least_one_translation

  # Scopes
  scope :active, -> { where(status: 'active') }
  scope :inactive, -> { where(status: 'inactive') }

  def all_permissions
    role_permissions = roles.includes(:permissions).flat_map(&:permissions)
    group_permissions = groups.includes(:permissions).flat_map(&:permissions)
    department_permissions = departments.includes(:permissions).flat_map(&:permissions)
    direct_permissions + role_permissions + group_permissions + department_permissions
  end

  private
  
  def initialize_name
    write_attribute(:name, {}) if read_attribute(:name).nil?
  end

  def name_has_at_least_one_translation
    return if Mobility.available_locales.any? { |loc| name(locale: loc).present? }
    errors.add(:name, "must contain at least one translation")
  end
end
