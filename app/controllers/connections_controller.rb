class ConnectionsController < ApplicationController
  def new

  end

  def create
    @connection = Connection.new
    @connection.user = current_user
    contact_user = User.find_by(email: params[:user][:email])
    @connection.contact = contact_user

    if @connection.save
        redirect_to contacts_path
    else

    end
  end
end
