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
  validates :abbreviation, presence: true
  validate :name_has_at_least_one_translation
  validate :name_translations_are_unique

  def members
    Member.joins(:roles).where(roles: { department_id: id }).distinct
  end

  def member_in_department?(member)
    # Find if any role associated with this department is assigned to the member
    roles.joins(:role_assignments)
         .where(role_assignments: { member_id: member.id })
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

  def name_translations_are_unique
    name_translations = read_attribute(:name) || {}
    name_translations.each do |locale, name_value|
      next if name_value.blank?
      Mobility.with_locale(locale) do
        if organization.departments.where.not(id: id).where("name ->> ? = ?", locale.to_s, name_value).exists?
          errors.add(:name, "must be unique within the organization for locale #{locale}")
        end
      end
    end
  end
end 