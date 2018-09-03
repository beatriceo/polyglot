class ConnectionsController < ApplicationController
  def new
  end

  def create
    @connection = Connection.new
    @connection.user = current_user
    contact_user = User.find_by(email: params[:user][:email])
    @connection.contact = contact_user

    if @connection.save
      contact_message = nil
      if contact_user.first_name.nil? || contact_user.last_name.nil?
        contact_message = "#{contact_user.email}"
      else
        contact_message = "#{contact_user.first_name} #{contact_user.last_name}"
      end
      flash[:notice] = "Added #{contact_message} to contacts"
      redirect_to contacts_path
    else
      flash[:alert] = "Invalid email address!"
      render 'new'
    end
  end

  def destroy
    connection = current_user.connections.find_by(contact_id: params[:id].to_i)
    connection.destroy
    redirect_to root_path
  end
end
