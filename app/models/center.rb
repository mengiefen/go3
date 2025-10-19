class Center < ApplicationRecord
  has_paper_trail

  extend Mobility
  translates :name, backend: :jsonb, fallbacks: true

  belongs_to :center_type
  belongs_to :centerable, polymorphic: true

  validates :code, presence: true, uniqueness: { scope: :organization_id }
end
