Rails.application.routes.draw do

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

  get '/establish_call/:contact_id', to: 'pages#establish_call', as: 'establish_call'

  post '/accept_call', to: 'pages#accept_call', as: 'accept_call/'

  patch '/accept_call/:request_id', to: 'requests#update', as: 'update_request'

  get '/contacts', to: 'pages#index'
  get '/setting', to: 'users#setting'
  post '/sessions', to: 'video_sessions#create'

  post '/chat_rooms/chat_room_sessions', to: 'chat_rooms#create'

  resources :chat_rooms, only: [ :show ] do
    # testing action cable
    post '/cable_testing', to: 'pages#cable_testing'
    post '/send_message', to: 'pages#send_message'
    post '/translate', to: 'pages#translate'
  end

  mount ActionCable.server, at: '/cable'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  get '/home', to: 'pages#home'

  get '/users/:id', to: 'users#show', as: :user
  get '/users/:id/edit', to: 'users#edit', as: :user_edit
  patch '/users/:id', to: 'users#update'
  delete '/users/:id', to: 'users#destroy'

  resources :connections, only: [:create, :destroy]
  get '/add_contact', to: 'connections#new', as: :add_contact
end
