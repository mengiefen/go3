FactoryBot.define do
  factory :role_assignment do
    role
    member

    start_date { Time.current }
    finish_date { nil }
    
    trait :inactive do
      finish_date { 1.day.ago }
    end
  end
end 