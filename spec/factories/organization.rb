FactoryBot.define do
  factory :organization do
    name { "Organization #{SecureRandom.uuid}" }
    
    after(:build) do |org, evaluator|
      if evaluator.name.is_a?(String)
        Mobility.with_locale(:en) { org.name = evaluator.name }
      elsif evaluator.name.is_a?(Hash)
        org.name = nil
        evaluator.name.each do |locale, name|
          Mobility.with_locale(locale) { org.name = name }
        end
      end
    end
  end
end 