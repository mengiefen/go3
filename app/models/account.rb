class Account < ApplicationRecord
  has_paper_trail

  extend Mobility
  translates :name, backend: :jsonb, fallbacks: true

  belongs_to :ledger
  belongs_to :parent_account, class_name: "Account", foreign_key: "contra_for_id", optional: true
  has_many :contra_account, class_name: "Account", foreign_key: "contra_for_id", dependent: :nullify
  delegate :account_category, to: :ledger

  validates :code, presence: true, uniqueness: { scope: :ledger_id }
  validates :accepts_other_currencies, presence: true
end
