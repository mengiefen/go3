class Member < ApplicationRecord
  # Will enable PaperTrail later
  # has_paper_trail
  
  # Associations
  belongs_to :organization, optional: false
  has_many :role_assignments, as: :assignee
  has_many :roles, through: :role_assignments
  has_many :permissions, as: :grantee
  has_and_belongs_to_many :groups

  # Validations
  validates :email, presence: true, 
                    uniqueness: { scope: :organization_id },
                    format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :name, presence: true

  # Scopes
  scope :active, -> { where(status: 'active') }
  scope :inactive, -> { where(status: 'inactive') }
end
