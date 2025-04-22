class Organization < ApplicationRecord
  # Will enable PaperTrail later
  has_paper_trail

  # Will enable Mobility for translations later
  extend Mobility
  translates :name, backend: :jsonb, fallbacks: true
  translates :description, backend: :jsonb, fallbacks: true

  # Ensure name is always initialized as a hash
  after_initialize :initialize_name
  before_validation :initialize_name

  # Associations
  belongs_to :parent, class_name: 'Organization', optional: true
  has_many :children, class_name: 'Organization', foreign_key: 'parent_id'
  has_many :departments
  has_many :groups
  has_many :roles
  has_many :members

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
