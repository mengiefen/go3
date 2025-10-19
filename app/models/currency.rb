class Currency < ApplicationRecord
  has_paper_trail

  extend Mobility
  translates :name, backend: :jsonb, fallbacks: true

  belongs_to :organization

  validates :abr, presence: true, uniqueness: { scope: :organization_id }
  validates :decimal_digits, presence: true
end
