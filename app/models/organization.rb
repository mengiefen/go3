class Organization < ApplicationRecord
  # Use acts_as_archival for soft delete
  acts_as_archival
  
  # Callbacks for archiving
  before_archive :archive_children
  after_unarchive :handle_unarchive
  
  # Remove default_scope and use explicit scopes for better control
  scope :active, -> { unarchived }
  
  # Will enable PaperTrail later
  has_paper_trail

  # Active Storage attachment
  has_one_attached :logo

  # Will enable Mobility for translations later
  extend Mobility
  translates :name, backend: :jsonb, fallbacks: true
  translates :description, backend: :jsonb, fallbacks: true

  # Ensure name is always initialized as a hash
  after_initialize :initialize_name
  before_validation :initialize_name

  # Associations
  belongs_to :parent, class_name: 'Organization', optional: true
  has_many :children, class_name: 'Organization', foreign_key: 'parent_id', dependent: :nullify
  has_many :departments, dependent: :nullify
  has_many :groups, dependent: :nullify
  has_many :roles, dependent: :nullify
  has_many :members, dependent: :destroy
  has_many :tasks, dependent: :destroy

  # Validations
  validate :no_circular_references
  validate :name_has_at_least_one_translation
  validate :name_translations_are_unique_within_parent_organization

  # Methods
  def ancestors
    chain = [self]
    current = self
    
    while current.parent.present?
      current = current.parent
      chain << current
    end
    
    chain
  end

  private

  def archive_children
    # Archive all children when this organization is archived
    children.each(&:archive)
    # Archive related entities if needed
    # departments.each(&:archive)
    # groups.each(&:archive)
    # roles.each(&:archive)
  end
  
  def handle_unarchive
    # You might want to implement logic to unarchive related records here
    # For now, we'll leave it up to the admin to manually restore related records
    Rails.logger.info "Organization #{id} has been restored (unarchived)"
  end

  def initialize_name
    write_attribute(:name, {}) if read_attribute(:name).nil?
  end
  
  def name_has_at_least_one_translation
    return if Mobility.available_locales.any? { |loc| name(locale: loc).present? }
    errors.add(:name, "must contain at least one translation")
  end

  def no_circular_references
    return unless parent_id_changed? && parent_id.present?
    
    current_parent = parent
    while current_parent.present?
      if current_parent.id == id
        errors.add(:parent_id, "circular reference detected")
        break
      end
      current_parent = current_parent.parent
    end
  end

  def name_translations_are_unique_within_parent_organization
    name_translations = read_attribute(:name) || {}
    name_translations.each do |locale, name_value|
      next if name_value.blank?
      next if parent.nil?
      Mobility.with_locale(locale) do
        if parent.children.where.not(id: id).where("name ->> ? = ?", locale.to_s, name_value).exists?
          errors.add(:name, "must be unique within the organization for locale #{locale}")
        end
      end
    end
  end
end
