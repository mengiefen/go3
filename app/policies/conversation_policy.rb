class ConversationPolicy < ApplicationPolicy
  def show?
    record.active_participants.exists?(user.id)
  end
end
