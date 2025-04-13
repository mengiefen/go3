FactoryBot.define do
  factory :member do
    sequence(:email) { |n| "member#{n}@example.com" }
    name { "John Doe" }
    status { "active" }
    organization
  end
end 