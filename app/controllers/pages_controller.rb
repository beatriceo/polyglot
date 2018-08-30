class PagesController < ApplicationController
  # skip_before_action :authenticate_user!, only: [:call]
  skip_before_action :verify_authenticity_token

  def call
  end

  def index
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
end
