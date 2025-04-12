FactoryBot.define do
  factory :organization do
    sequence(:name) { |n| { en: "Organization #{n}" } }
    description { { en: "Organization description" } }
    is_tenant { false }
  end
end 