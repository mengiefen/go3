class AccountCategory < ApplicationRecord
  has_paper_trail

  extend Mobility
  translates :name, backend: :jsonb, fallbacks: true

  belongs_to :organization
  has_many :ledgers, dependent: :destroy
  has_many :accounts, through: :ledgers

  validates :code, presence: true, uniqueness: { scope: :organization_id }

  enum :type, { balance_sheet: 1, income_statement: 2, temp: 3 }
end
