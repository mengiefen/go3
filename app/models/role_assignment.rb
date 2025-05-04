class RoleAssignment < ApplicationRecord
  # Associations
  belongs_to :role
  belongs_to :member

  # Validations
  validates :role_id, presence: true
  validates :member_id, presence: true
  validate :unique_active_assignment
  validate :member_and_role_are_in_the_same_organization

  # Scopes
  scope :active, -> { where(finish_date: nil) }
  scope :inactive, -> { where.not(finish_date: nil) }

  # Callbacks
  before_validation :set_start_date, on: :create

  def active?
    finish_date.nil?
  end

  def inactive?
    !active?
  end

  private

  def set_start_date
    self.start_date ||= Time.current
  end

  def member_and_role_are_in_the_same_organization
    return if member.nil? || role.nil?
    if member.organization_id != role.organization_id
      errors.add(:base, "Member and Role must be in the same organization")
    end
  end

  def unique_active_assignment
    return if finish_date.present?
    if RoleAssignment.where(member_id: member_id, role_id: role_id, finish_date: nil).exists?
      errors.add(:role_id, "Role already assigned to this member")
    end
  end
end 
