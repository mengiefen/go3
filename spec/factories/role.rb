FactoryBot.define do
  factory :role do
    organization { Organization.first || create(:organization) }
    department { organization.departments.first || create(:department, organization: organization) }

    name { "Role #{SecureRandom.uuid}" }

    after(:build) do |role, evaluator|
      if evaluator.name.is_a?(String)
        Mobility.with_locale(:en) { role.name = evaluator.name }
      elsif evaluator.name.is_a?(Hash)
        role.name = nil
        evaluator.name.each do |locale, name|
          Mobility.with_locale(locale) { role.name = name }
        end
      end
    end
    
    trait :inactive do
      active { false }
    end
  end
end 