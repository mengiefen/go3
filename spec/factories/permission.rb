FactoryBot.define do
  factory :permission do
    organization { Organization.first || create(:organization) }
  end
end 