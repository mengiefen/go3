class Current < ActiveSupport::CurrentAttributes
  attribute :user
  attribute :ip_address
  attribute :user_agent
  attribute :request_id
  attribute :organization
end 