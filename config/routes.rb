Rails.application.routes.draw do
  get 'video_sessions/create'
  devise_for :users
  root to: 'pages#home'

  post '/sessions', to: 'video_sessions#create'

  mount ActionCable.server, at: '/cable'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
