Rails.application.routes.draw do
  get 'video_sessions/create'
  devise_for :users, path: '', path_names: { sign_out: 'logout'}
  devise_scope :user do
    get '/logout', to: 'devise/sessions#destroy'
  end

  authenticated :user do
    root to: "pages#index"
  end

  unauthenticated :user do
    root to: "pages#home"
  end

  get '/contacts', to: 'pages#index'
  post '/sessions', to: 'video_sessions#create'

  mount ActionCable.server, at: '/cable'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  get '/home', to: 'pages#home'
end
