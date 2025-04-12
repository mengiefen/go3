FactoryBot.define do
  factory :member do
    sequence(:email) { |n| "member#{n}@example.com" }
    password { "password123" }
    password_confirmation { "password123" }
    first_name { "John" }
    last_name { "Doe" }
    sequence(:employee_id) { |n| "EMP-#{n}" }
    status { "active" }
    organization
  end
end 