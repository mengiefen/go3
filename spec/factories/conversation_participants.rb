FactoryBot.define do
  factory :conversation_participant do
    conversation { nil }
    user { nil }
    joined_at { "2025-07-19 08:22:15" }
    include_past_messages { false }
    left_at { "2025-07-19 08:22:15" }
  end
end
