# spec/factories/departments.rb
FactoryBot.define do
  factory :department do
    association :organization

    transient do
      # Default to English name, but allow override
      name_translations { { "en" => "Department #{SecureRandom.uuid}" } }
    end

    after(:build) do |department, evaluator|
      # Set translations using Mobility
      evaluator.name_translations.each do |locale, name|
        Mobility.with_locale(locale) { department.name = name }
      end
    end

    trait :invalid do
      # Explicitly set empty name for validation testing
      after(:build) do |department, _evaluator|
        Mobility.with_locale(:en) { department.name = nil }
        department.instance_variable_set(:@name_translations, {})
      end
    end
  end
end