class JournalEntry < ApplicationRecord
  has_paper_trail

  extend Mobility
  translates :description, backend: :jsonb, fallbacks: true

  belongs_to :fiscal_year
  belongs_to :organization
  belongs_to :creator
  has_many :journal_entry_items, dependent: :destroy

  enum :state, { draft: 1, posted: 2, approved: 3, finalized: 4 }
  enum :entry_type, { normal: 1, beginning: 2, ending: 3 }

  validates :date, presence: true
  validates :effective_date, presence: true
  validates :fiscal_year, presence: true
  validates :organization, presence: true
  validates :creator, presence: true

  # mind translation when creating this validations
  # validate :date_is_in_fiscal_year
end
