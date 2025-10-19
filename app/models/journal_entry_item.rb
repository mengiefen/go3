class JournalEntryItem < ApplicationRecord
  has_paper_trail

  extend Mobility
  translates :description, backend: :jsonb, fallbacks: true

  belongs_to :journal_entry
  belongs_to :account
  belongs_to :center1
  belongs_to :center2
  belongs_to :center3
  belongs_to :center4
  belongs_to :center5
  belongs_to :center6
  belongs_to :currency

  delegate :ledger, to: :account
  delegate :account_category, to: :ledger
end
