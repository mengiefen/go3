require 'swagger_helper'

RSpec.describe 'Users::Confirmations API', type: :request do
  let(:user) do
    User.create!(
      email: 'john.doe@example.com',
      password: 'AAAaaa@123',
      password_confirmation: 'AAAaaa@123',
      first_name: 'John',
      last_name: 'Doe',
      confirmed_at: nil
    )
  end

  path '/users/confirmation' do
    get 'Confirm user email' do
      tags 'Authentication'
      produces 'application/json'

      parameter name: :confirmation_token, in: :query, type: :string, description: 'Email confirmation token', example: '6vo7qV45ZqqiaomixcG6'

      response '200', 'Email confirmed successfully' do
        schema type: :object,
               properties: {
                  id: { type: :integer, example: 1 },
                  email: { type: :string, example: 'john.doe@example.com' },
                  confirmation_sent_at: { type: :string, example: '2026-02-22T19:18:12.729Z' }
               }

        let(:confirmation_token) { user.confirmation_token }

        run_test! do |response|
          data = JSON.parse(response.body)

          expect(data['id']).to eq(user.id)
          expect(data['email']).to eq(user.email)
          expect(data['confirmation_sent_at']).not_to be_nil

          user.reload
          expect(user.confirmed?).to be true
        end
      end
    end
  end
end
