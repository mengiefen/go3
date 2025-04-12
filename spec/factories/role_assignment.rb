FactoryBot.define do
  factory :role_assignment do
    association :role
    association :member
    start_date { Time.current }
    finish_date { nil }
    
    trait :inactive do
      finish_date { 1.day.ago }
    end
    
    trait :expired do
      finish_date { 1.day.ago }
    end
    
    trait :future_expiry do
      expires_at { 1.month.from_now }
    end
    
    trait :with_group_assignee do
      association :assignee, factory: :group
    end
  end
end 