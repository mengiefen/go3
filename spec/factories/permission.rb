FactoryBot.define do
  factory :permission do
    permission_code { "user.read" }
    
    association :subject, factory: :role
    association :target, factory: :user, required: false
    organization
    
    trait :with_target do
      association :target, factory: :user
    end
    
    trait :expired do
      expires_at { 1.day.ago }
    end
    
    trait :future_expiry do
      expires_at { 1.month.from_now }
    end
  end
end 