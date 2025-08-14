FactoryBot.define do
  factory :task do
    title { "MyString" }
    description { "MyText" }
    status { "MyString" }
    priority { "MyString" }
    category { "MyString" }
    due_date { "2025-05-31 12:18:09" }
    completed_at { "2025-05-31 12:18:09" }
    user { nil }
    organization { nil }
  end
end
