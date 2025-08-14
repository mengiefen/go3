class ConversationParticipant < ApplicationRecord
  belongs_to :conversation
  belongs_to :user

  before_create :set_joined_at

  private

  def set_joined_at
    self.joined_at ||= Time.current
  end
end
