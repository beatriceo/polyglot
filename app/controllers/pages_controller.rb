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

  def translate
    require 'google/cloud/translate'

    keyfile = ENV["TRANSLATION_CREDENTIALS"]
    creds = Google::Cloud::Translate::Credentials.new(keyfile)

    translate = Google::Cloud::Translate.new(
      project_id: ENV["PROJECT_ID"],
      credentials: creds
    )
    original = params[:original]
    target = params[:target]
    text = params[:text]
    translation = translate.translate(text, { from: original, to: target })
    translation.text.gsub!("&#39;", "'")
    ActionCable.server.broadcast "chat_room_#{params[:chat_room_id]}", {
      translation: translation,
      input: params[:input],
      userId: current_user.id
    }
  end


  def cable_testing
    chatroom = 'chat_room_' + params[:chat_room_id]
    puts params
    user_info = {}

    if current_user.first_name.nil? || current_user.last_name.nil?
      user_info[:name] = current_user.email
    else
      user_info[:name] = "#{current_user.first_name} #{current_user.last_name}"
    end

    ActionCable.server.broadcast(chatroom, {
      chat_message: {
        message: 'test',
        user_info: user_info,
        time_stamp: Time.now }
      })
    head :ok
  end


  def send_message
    puts params
    chatroom = 'chat_room_' + params[:chat_room_id]
    puts params
    user_info = {}

    if current_user.first_name.nil? || current_user.last_name.nil?
      user_info[:name] = current_user.email
    else
      user_info[:name] = "#{current_user.first_name} #{current_user.last_name}"
    end

    ActionCable.server.broadcast(chatroom, {
      chat_message: {
        message: params[:message],
        user_info: user_info,
        time_stamp: Time.now.strftime("%H:%M") }
      })
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

    caller_info = nil
    if current_user.first_name.nil? || current_user.last_name.nil?
      caller_info = current_user.email
    else
      caller_info = "#{current_user.first_name} #{current_user.last_name}"
    end

    caller_photo = "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
    unless current_user.photo.url.nil?
      caller_photo = current_user.photo.url
    end

    ActionCable.server.broadcast('notifications', {
      message: {
        user_id: contact.id,
        chat_room_id: chat_room.id,
        caller_info: caller_info,
        caller_photo: caller_photo
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
