FactoryBot.define do
  factory :permission do
    permission_code { "user.read" }
    association :grantee, factory: :role
  end
end 