require 'swagger_helper'

RSpec.describe 'Users::Sessions API', type: :request do
  include Devise::Test::IntegrationHelpers

  let!(:user) do
    User.create!(
      email: 'john.doe@example.com',
      password: 'AAAaaa@123',
      password_confirmation: 'AAAaaa@123',
      first_name: 'John',
      last_name: 'Doe',
      confirmed_at: DateTime.now
    )
  end

  path '/users/sign_in' do
    post 'Log in with username and password' do
      tags 'Authentication'
      consumes 'application/json'
      produces 'application/json'

      parameter name: :params, in: :body, schema: {
        type: :object,
        properties: {
          user: {
            type: :object,
            properties: {
              email: { type: :string, example: 'john.doe@example.com' },
              password: { type: :string, example: 'AAAaaa@123' }
            }
          }
        }
      }

      response '200', 'Logged in successfully' do
        schema type: :object,
               properties: {
                  id: { type: :integer, example: 1 },
                  email: { type: :string, example: 'john.doe@example.com' }
               }

        let(:params) do
          {
            user: {
              email: 'john.doe@example.com',
              password: 'AAAaaa@123'
            }
          }
        end

        run_test! do |response|
          data = JSON.parse(response.body)
          expect(data['id']).to be > 0
          expect(data['email']).to eq 'john.doe@example.com'
        end
      end
    end
  end

  path '/users/sign_out' do
    delete 'Log out' do
      tags 'Authentication'
      consumes 'application/json'
      produces 'application/json'

      parameter name: :params, in: :body, schema: {
        type: :object,
        properties: {
          user: {
            type: :object,
            properties: {
              email: { type: :string, example: 'john.doe@example.com' }
            }
          }
        }
      }

      response '200', 'Logged out successfully' do
        schema type: :object,
               properties: {
                  message: { type: :string, example: "Signed out" }
               }

        let(:params) { { user: { email: 'john.doe@example.com' } } }

        before { sign_in(user) }

        run_test! do |response|
          data = JSON.parse(response.body)
          expect(data['message']).to eq "Signed out"
        end
      end
    end
  end
end
