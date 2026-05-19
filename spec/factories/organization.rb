FactoryBot.define do
  factory :organization do
    name { { en: "Organization #{SecureRandom.uuid}" } }

    after(:build) do |organization, evaluator|
      name_value = evaluator.name
      if name_value.is_a?(String)
        default_locale = organization.locale || I18n.default_locale
        organization.write_attribute(:name, { default_locale => name_value })
      elsif name_value.is_a?(Hash)
        organization.write_attribute(:name, name_value)
      else
        organization.name = { "en" => "Test Organization" }
      end
    end
  end
end
