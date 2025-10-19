class CeneterType < ApplicationRecord
  has_paper_trail

  extend Mobility
  translates :name, backend: :jsonb, fallbacks: true

  belongs_to :organization
  has_many :centers, dependent: :destroy
end
