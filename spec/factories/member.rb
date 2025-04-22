FactoryBot.define do
  factory :member do
    organization { Organization.first || create(:organization) }

    name { "Member #{SecureRandom.uuid}" }

    email { "email#{ rand(1..100) }@test.com" }
    
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