class Group < ApplicationRecord
  # Enable PaperTrail for versioning
  has_paper_trail

  # Will enable Mobility for translations later
  extend Mobility
  translates :name, backend: :jsonb, fallbacks: true
  translates :description, backend: :jsonb, fallbacks: true

  # Ensure name is always initialized as a hash
  after_initialize :initialize_name
  before_validation :initialize_name

  # Associations
  belongs_to :organization, optional: false
  has_and_belongs_to_many :members
  has_many :permissions, as: :grantee

  # Validations
  validate :name_has_at_least_one_translation
  validate :name_translations_are_unique

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

  def initialize_name
    write_attribute(:name, {}) if read_attribute(:name).nil?
  end

  def name_has_at_least_one_translation
    return if Mobility.available_locales.any? { |loc| name(locale: loc).present? }
    errors.add(:name, "must contain at least one translation")
  end

  def name_translations_are_unique
    name_translations = read_attribute(:name) || {}
    name_translations.each do |locale, name_value|
      next if name_value.blank?
      Mobility.with_locale(locale) do
        if organization.groups.where.not(id: id).where("name ->> ? = ?", locale.to_s, name_value).exists?
          errors.add(:name, "must be unique within the organization for locale #{locale}")
        end
      end
    end
  end
end
