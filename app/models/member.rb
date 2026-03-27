class Member < ApplicationRecord
  # Will enable PaperTrail later
  has_paper_trail
  acts_as_archival

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
  has_many :inactive_role_assignments, -> { inactive }, class_name: "RoleAssignment"
  has_many :inactive_roles, through: :inactive_role_assignments, source: :role
  has_and_belongs_to_many :groups
  has_many :departments, through: :roles
  has_many :direct_permissions, as: :grantee, class_name: "Permission"

  # Validations
  validates :email,
            uniqueness: { scope: :organization_id, allow_blank: true },
            format: { with: URI::MailTo::EMAIL_REGEXP, allow_blank: true }

  validate :name_has_at_least_one_translation

  def serializable_hash(options = {})
    options = options ? options.dup : {}
    options[:methods] = %i[org_admin? status localized_status]
    super(options)
  end

  def all_permissions
    collections = [ roles, groups, departments ]

    (direct_permissions + collections.sum([]) { |c| c.includes(:permissions).flat_map(&:permissions) }).uniq
  end

  def is_go3_admin?
    user&.is_go3_admin?
  end

  def status
    return "archived" if self.archived?
    return "joined" if joined_at.present?
    return "invited" if invited_at.present?
    "not_invited"
  end

  def localized_status
    model_t("status.#{status}")
  end

  def has_permission?(code)
    return true if is_go3_admin?
    all_permissions.any? { |perm| perm.code == code && organization == perm.organization }
  end

  def org_admin?
    has_permission?(Permission::ORG_ADMIN)
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
