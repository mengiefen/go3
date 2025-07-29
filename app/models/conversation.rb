class Conversation < ApplicationRecord
  belongs_to :organization

  has_many :conversation_participants, dependent: :destroy
  has_many :participants, through: :conversation_participants, source: :user
  has_many :messages, dependent: :destroy

  def active_participants
    participants.joins(:conversation_participants)
      .where(conversation_participants: { conversation_id: id, left_at: nil })
  end

  def title(for_user)
    return name if is_group?
    contact = participants.reject { |participant| participant.id == for_user.id }.first || for_user
    contact.full_name
  end
end
