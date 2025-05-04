class Permission < ApplicationRecord
  has_paper_trail

  # Associations
  belongs_to :grantee, polymorphic: true
  belongs_to :organization

  # Validations
  validates :code, presence: true
  validates :grantee, presence: true
  validates :grantee_id, uniqueness: { scope: [:grantee_type, :code] }

  def permitted_users
    users = []
    organization.users.includes(:members).each do |user|
      member = user.members.where(organization_id: organization.id).first
      next unless member
      users << user if member.all_permissions.include?(self)
    end

    users
  end
end 