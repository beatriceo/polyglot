class PagesController < ApplicationController
  # skip_before_action :authenticate_user!, only: [:call]
  skip_before_action :verify_authenticity_token

  def call
  end

  def index
    @contact = Connection.new
  end

  def home
  end


  def cable_testing
    chatroom = 'chat_room_' + params[:chat_room_id]
    puts params
    ActionCable.server.broadcast(chatroom, { message: 'test' })
    head :ok
  end

  def establish_call
    head :ok
    puts "params: #{params}"
    chat_room = ChatRoom.create!
    puts "Created chat room with id: #{chat_room.id}"
    chat_room_participation = ChatRoomParticipation.create!(chat_room: chat_room, user: current_user)
    puts "Created chat room participation with user: #{current_user.email} assigned to chat_room #{chat_room.id}"
    puts "Subscribed user to chat room"

    contact = User.find(params[:contact_id])
    request = Request.create!(chat_room: chat_room, user: contact)
    puts "Made a request to call #{contact.email}"
    ActionCable.server.broadcast('notifications', {
      message: {
        user_id: contact.id,
        chat_room_id: chat_room.id
      }
    })
  end

  def accept_call
    puts "-----------------------------------------"
    puts params
    puts "IT WORKED"
    chat_room = ChatRoom.find(params[:chat_room_id])
    request = Request.where("user_id = ? AND chat_room_id = ?", current_user.id, chat_room.id)

    request[0].accepted = true
    puts "create new chat room participation"
    chat_room_participation = ChatRoomParticipation.create!(chat_room: chat_room, user: current_user)
    puts "Created chat room participation with user: #{current_user.email} assigned to chat_room #{chat_room.id}"

    other_caller = chat_room.users.find { |u| u != current_user } # remember to update this later
    puts ">>>>>>>>>>>>>>>>>>>>>>>>>>>>..HHHHHHHHH"
    puts other_caller
    puts ">>>>>>>>>>>>>>>>>>>>>>>>>>>>..HHHHHHHHH"
    # redirect caller to chat room
    ActionCable.server.broadcast('notifications', {
      head: 302, # redirection code, just to make it clear what you're doing
      path: chat_room_path(chat_room), # you'll need to use url_helpers, so include them in your file
      body: { caller: other_caller.id }
      }
      # other_caller, # or however you identify your subscriber
    )
    # redirect callee to chat room
    redirect_to chat_room_path(chat_room)
    # broadcast another message to caller
    # head: 302

  end
end
