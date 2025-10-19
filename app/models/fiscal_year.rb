class FiscalYear < ApplicationRecord
  has_paper_trail

  extend Mobility
  translates :name, backend: :jsonb, fallbacks: true

  belongs_to :organization

  # mind translation when creating this validations
  # validates :start_date_before_finish_date
  # validates :no_overlap_with_other_fiscal_years
end
