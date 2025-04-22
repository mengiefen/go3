# spec/factories/departments.rb
FactoryBot.define do
  factory :department do
    organization { Organization.first || create(:organization) }

    name { "Department #{SecureRandom.uuid}" }

    abbreviation { (0..3).map { ('A'..'Z').to_a.sample }.join }

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