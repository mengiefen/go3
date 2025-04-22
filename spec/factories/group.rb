FactoryBot.define do
  factory :group do
    organization { Organization.first || create(:organization) }

    name { "Group #{SecureRandom.uuid}" }
    
    after(:build) do |department, evaluator|
      if evaluator.name.is_a?(String)
        Mobility.with_locale(:en) { department.name = evaluator.name }
      elsif evaluator.name.is_a?(Hash)
        department.name = nil
        evaluator.name.each do |locale, name|
          Mobility.with_locale(locale) { department.name = name }
        end
      end
    end
  end
end