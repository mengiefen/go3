FactoryBot.define do
  factory :group do
    organization { Organization.first || create(:organization) }

    name { "Group #{SecureRandom.uuid}" }
    
    after(:build) do |group, evaluator|
      if evaluator.name.is_a?(String)
        Mobility.with_locale(:en) { group.name = evaluator.name }
      elsif evaluator.name.is_a?(Hash)
        group.name = nil
        evaluator.name.each do |locale, name|
          Mobility.with_locale(locale) { group.name = name }
        end
      end
    end
  end
end