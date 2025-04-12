FactoryBot.define do
  factory :role do
    sequence(:name) { |n| { en: "Role #{n}" } }
    description { { en: "Role description" } }
    active { true }
    organization
    department { nil }
    
    trait :with_department do
      department { association :department, organization: organization }
    end
    
    trait :inactive do
      active { false }
    end
  end
end 