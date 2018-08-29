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

  get '/call', to: 'pages#call'

  get '/contacts', to: 'pages#index'
  post '/sessions', to: 'video_sessions#create'

  mount ActionCable.server, at: '/cable'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  get '/home', to: 'pages#home'


  get '/users/:id', to: 'users#show', as: :user
  get '/users/:id/edit', to: 'users#edit', as: :user_edit
  patch '/users/:id', to: 'users#update'
  delete '/users/:id', to: 'users#destroy'
end
