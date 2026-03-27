FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "user#{n}@example.com" }
    password { "AAAaaa@123" }
    password_confirmation { "AAAaaa@123" }
    first_name { "John" }
    last_name { "Doe" }
    role { nil }
    confirmed_at { DateTime.now }
    trait :admin do
      role { 'GO3_ADMIN' }
    end
  end
end
