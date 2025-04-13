class RoleAssignment < ApplicationRecord
  # Will enable PaperTrail later
  # has_paper_trail

  # Associations
  belongs_to :role
  belongs_to :assignee, polymorphic: true
  belongs_to :organization

  # Validations
  validates :role_id, uniqueness: { scope: [:assignee_id, :assignee_type, :finish_date], 
                                   if: -> { finish_date.nil? } }
  validate :assignee_in_same_organization

  # Scopes
  scope :active, -> { where(finish_date: nil) }
  scope :inactive, -> { where.not(finish_date: nil) }

  # Callbacks
  before_validation :set_start_date, on: :create

  private

  def set_start_date
    self.start_date ||= Time.current
  end

  def assignee_in_same_organization
    if assignee && organization && assignee.organization_id != organization_id
      errors.add(:assignee, "must belong to the same organization as the role assignment")
    end
  end
end 
