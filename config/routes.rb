Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Device routes with custom controllers
  devise_for :users, controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations',
    passwords: 'users/passwords',
    confirmations: 'users/confirmations',
    unlocks: 'users/unlocks',
    omniauth_callbacks: 'users/omniauth_callbacks'
  }

  # Two-factor authentication
  resource :two_factor, only: [:new, :create, :show, :update], controller: 'users/two_factor' do
    get :backup_codes
  end
  
  delete 'two_factor', to: 'users/two_factor#destroy', as: :disable_two_factor
  
  # Two Factor Verification during login
  resource :two_factor_verification, only: [:show, :update], controller: 'users/two_factor_verification' do
    post :verify_backup_code
  end
  
  # Social connections management
  resources :social_connections, only: [:index], controller: 'users/social_connections' do
    delete ':provider', to: 'users/social_connections#destroy', on: :collection, as: :destroy
  end

  # Letter Opener Web UI (development only)
  mount LetterOpenerWeb::Engine, at: "/letter_opener" if Rails.env.development?

  # Defines the root path route ("/")
  root "home#index"
end
