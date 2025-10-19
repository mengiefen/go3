class Branch < ApplicationRecord
  has_paper_trail

  extend Mobility
  translates :name, backend: :jsonb, fallbacks: true

  belongs_to :organization
end
