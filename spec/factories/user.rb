FactoryBot.define do
  factory :user do
    email { "user_#{SecureRandom.alphanumeric(6)}@example.com" }
    password { "AAAaaa@123" }
    password_confirmation { "AAAaaa@123" }
    first_name { "John" }
    last_name { "Doe" }
    role { nil }
    confirmed_at { DateTime.now }
    locale { "en" }
    trait :admin do
      role { 'GO3_ADMIN' }
    end
  end
end
