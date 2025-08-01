FactoryBot.define do
  factory :message do
    conversation { nil }
    sender { nil }
    body { "MyText" }
    reply_to { nil }
  end
end
