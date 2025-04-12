FactoryBot.define do
  factory :department do
    sequence(:name) { |n| { en: "Department #{n}" } }
    description { { en: "Department description" } }
    organization
  end
end 