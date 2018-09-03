class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  # before_action :authenticate_user!
  protect_from_forgery unless: -> { request.format.json? } # Only accept json

  def after_sign_in_path_for(resource)
    contacts_path
  end

  def default_url_options
    { host: ENV["HOST"] || "localhost:3000" }
  end
end
