class Group < ApplicationRecord
  # Enable PaperTrail for versioning
  has_paper_trail

  # Will enable Mobility for translations later
  # extend Mobility
  # translates :name, type: :jsonb
  # translates :description, type: :jsonb

  # Associations
  belongs_to :organization, optional: false
  has_and_belongs_to_many :members
  has_many :permissions, as: :grantee

  # Validations
  validates :name, presence: true
  validates :name, uniqueness: { scope: :organization_id }
  validate :name_has_at_least_one_translation

  # Methods
  def add_member(member)
    members << member unless members.include?(member)
  end

  def remove_member(member)
    members.delete(member) if members.include?(member)
  end

  def member_in_group?(member)
    members.include?(member)
  end

  private

  def name_has_at_least_one_translation
    if name.blank? || !name.is_a?(Hash) || name.values.all?(&:blank?)
      errors.add(:name, "must contain at least one translation")
    end
  end
end
