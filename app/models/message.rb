class Message < ApplicationRecord
  belongs_to :conversation
  belongs_to :sender, polymorphic: true
  belongs_to :reply_to, class_name: "Message", optional: true

  has_many :replies, class_name: "Message", foreign_key: :reply_to_id, dependent: :nullify
  has_many :message_receipts, dependent: :destroy
end
