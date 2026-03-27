FactoryBot.define do
  factory :member do
    organization { Organization.first || create(:organization) }

    name { "Member #{SecureRandom.uuid}" }

    email { "email#{ rand(1..1000) }@test.com" }

    trait :invited do
      invited_at { DateTime.now }
    end

    trait :joined do
      invited_at { DateTime.now - 1.day }
      joined_at { DateTime.now }
    end

    after(:build) do |member, evaluator|
      if evaluator.name.is_a?(String)
        Mobility.with_locale(:en) { member.name = evaluator.name }
      elsif evaluator.name.is_a?(Hash)
        member.name = nil
        evaluator.name.each do |locale, name|
          Mobility.with_locale(locale) { member.name = name }
        end
      end
    end
  end
end
