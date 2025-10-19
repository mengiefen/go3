class Ledger < ApplicationRecord
  has_paper_trail

  extend Mobility
  translates :name, backend: :jsonb, fallbacks: true

  belongs_to :account_category
  belongs_to :parent_ledger, class_name: "Ledger", foreign_key: "contra_for_id", optional: true
  has_many :contra_ledgers, class_name: "Ledger", foreign_key: "contra_for_id", dependent: :nullify
  has_many :accounts, dependent: :destroy

  validates :code, presence: true, uniqueness: { scope: :account_category_id }

  enum :balance_type, { debit: 1, credit: 2 }
  enum :unexpected_balance, { accept: 1, warn: 2, disallow: 3 }

  validates :balance_type, presence: true
  validates :unexpected_balance, presence: true
end
