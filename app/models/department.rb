class Department < ApplicationRecord
  # Enable PaperTrail for versioning
  has_paper_trail

  # Enable Mobility for translations with fallback to English
  extend Mobility
  translates :name, backend: :jsonb, fallbacks: true
  translates :description, backend: :jsonb, fallbacks: true

  # Ensure name is always initialized as a hash
  after_initialize :initialize_name
  before_validation :initialize_name

  # Associations
  belongs_to :organization, optional: false
  has_many :roles, dependent: :nullify
  has_many :permissions, as: :grantee, dependent: :destroy

  # Validations
  validates :name, presence: true
  validate :name_has_at_least_one_translation

  def members
    Member.joins(:roles).where(roles: { department_id: id }).distinct
  end

  def member_in_department?(member)
    # Find if any role associated with this department is assigned to the member
    roles.joins(:role_assignments)
         .where(role_assignments: { assignee_id: member.id, assignee_type: member.class.name })
         .exists?
  end

  def add_role(role)
    return if roles.include?(role)

    if role.department.present?
      role.update(department: self)
    else
      roles << role
    end
  end

  def remove_role(role)
    return unless roles.include?(role)

    role.update(department: nil)
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