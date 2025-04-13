class Role < ApplicationRecord
  # Will enable PaperTrail later
  # has_paper_trail

  # Will enable Mobility for translations later
  # extend Mobility
  # translates :name, type: :jsonb
  # translates :description, type: :jsonb

  # Associations
  belongs_to :organization, optional: false
  belongs_to :department, optional: true
  belongs_to :parent, class_name: 'Role', optional: true
  has_many :children, class_name: 'Role', foreign_key: 'parent_id'
  has_many :permissions, as: :grantee
  has_many :role_assignments

  # Validations
  validates :name, presence: true
  validates :name, uniqueness: { scope: :organization_id }
  validate :name_has_at_least_one_translation
  validate :no_circular_references

  # Scopes
  scope :active, -> { where(active: true) }

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

  def all_permissions
    # Collect permissions from self and all ancestors
    ancestor_chain.map(&:permissions).flatten
  end

  def member
    assignment = role_assignments.active.first
    assignment&.assignee
  end

  def assign_member(member)
    return false if member.nil? || member.organization_id != organization_id
    
    # Close previous assignment if exists
    role_assignments.active.each do |assignment|
      assignment.update(finish_date: Time.current)
    end
    
    # Create new assignment
    role_assignments.create(
      assignee: member,
      organization: organization,
      start_date: Time.current
    )
    
    true
  end

  def unassign_member
    role_assignments.active.each do |assignment|
      assignment.update(finish_date: Time.current)
    end
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
