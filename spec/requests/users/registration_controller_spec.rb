require 'swagger_helper'

RSpec.describe 'Users::Registrations API', type: :request do
  path '/users' do
    post 'Sign up as a new user' do
      tags 'Authentication'
      consumes 'application/json'
      produces 'application/json'

      parameter name: :params, in: :body, schema: {
        type: :object,
        properties: {
          email: { type: :string, example: 'john.doe@example.com' },
          first_name: { type: :string, example: 'John' },
          last_name: { type: :string, example: 'Doe' },
          timezone: { type: :string, example: 'UTC' },
          locale: { type: :string, example: 'en' }
        }
      }

      response '200', 'User created successfully' do
        schema type: :object,
               properties: {
                  id: { type: :integer, example: 1 },
                  email: { type: :string, example: 'john.doe@example.com' },
                  first_name: { type: :string, example: 'John' },
                  last_name: { type: :string, example: 'Doe' },
                  timezone: { type: :string, example: 'UTC' },
                  locale: { type: :string, example: 'en' },
                  confirmation_sent_at: { type: :string, example: '2026-02-22T19:18:12.729Z' }
               }

        let(:params) do
          {
            email: 'john.doe@example.com',
            password: 'AAAaaa@123',
            password_confirmation: 'AAAaaa@123',
            first_name: 'John',
            last_name: 'Doe',
            timezone: 'UTC',
            locale: 'en'
          }
        end

        before { allow_any_instance_of(ActionMailer::MessageDelivery).to receive(:deliver_now).and_return(true) }

        run_test! do |response|
          data = JSON.parse(response.body)
          expect(data['id']).to be > 0
          expect(data['confirmed_at']).to be_nil
          expect(data['confirmation_sent_at']).not_to be_nil
        end
      end
    end
  end
end
