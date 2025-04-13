class Organization < ApplicationRecord
  # Will enable PaperTrail later
  # has_paper_trail

  # Will enable Mobility for translations later
  # extend Mobility
  # translates :name, type: :jsonb
  # translates :description, type: :jsonb

  # Associations
  belongs_to :parent, class_name: 'Organization', optional: true
  has_many :children, class_name: 'Organization', foreign_key: 'parent_id'
  has_many :departments
  has_many :groups
  has_many :roles
  has_many :members

  # Validations
  validates :name, presence: true
  validate :name_has_at_least_one_translation
  validate :no_circular_references
  validates :name, uniqueness: { scope: :parent_id }

  # Scopes
  scope :tenants, -> { where(is_tenant: true) }

  # Methods
  def ancestor_chain
    chain = [self]
    current = self
    
    while current.parent.present?
      current = current.parent
      chain << current
    end
    
    chain
  end

  private

  def name_has_at_least_one_translation
    if name.blank? || !name.is_a?(Hash) || name.values.all?(&:blank?)
      errors.add(:name, "must contain at least one translation")
    end
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
end
