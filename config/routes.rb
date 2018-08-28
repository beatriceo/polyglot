Rails.application.routes.draw do
  get 'video_sessions/create'
  devise_for :users, path: '', path_names: { sign_out: 'logout'}
  devise_scope :user do
    get '/logout', to: 'devise/sessions#destroy'
  end
  root to: 'pages#home'
  get '/contacts', to: 'users#index'
  post '/sessions', to: 'video_sessions#create'

  mount ActionCable.server, at: '/cable'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  get '/home', to: 'pages#home'
end
