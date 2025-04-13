class Permission < ApplicationRecord
  # Associations
  belongs_to :grantee, polymorphic: true
  belongs_to :target, polymorphic: true, optional: true

  # Validations
  validates :permission_code, presence: true
end 