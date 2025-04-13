require 'securerandom'

FactoryBot.define do
  factory :group do
    sequence(:name) do |n| 
      { en: "Group #{n}-#{Time.now.to_f}-#{SecureRandom.hex(8)}" }
    end
    description { { en: "Group description" } }
    association :organization

    trait :with_members do
      transient do
        members_count { 3 }
      end

      after(:create) do |group, evaluator|
        create_list(:member, evaluator.members_count, organization: group.organization).each do |member|
          group.add_member(member)
        end
      end
    end
  end
end 