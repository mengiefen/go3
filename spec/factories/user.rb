FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "user#{n}@example.com" }
    password { "password123" }
    password_confirmation { "password123" }
    first_name { "John" }
    last_name { "Doe" }
    tenant
    role { nil }
    
    trait :admin do
      role { 'GO3_ADMIN' }
    end
  end
end 