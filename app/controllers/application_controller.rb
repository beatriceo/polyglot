class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  before_action :authenticate_user!
  protect_from_forgery unless: -> { request.format.json? } # Only accept json
end
