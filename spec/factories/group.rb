FactoryBot.define do
  factory :group do
    sequence(:name) { |n| { en: "Group #{n}" } }
    description { { en: "Group description" } }
    organization
  end
end 