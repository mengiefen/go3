FactoryBot.define do
  factory :organization do
    sequence(:name) { |n| { "en" => "Org #{n} #{SecureRandom.uuid}" } }
    description { { en: "Organization description" } }
    is_tenant { false }
    
    trait :as_tenant do
      is_tenant { true }
    end
    
    factory :tenant do
      is_tenant { true }
    end
    
    trait :with_parent do
      association :parent, factory: :organization
    end
  end
end 