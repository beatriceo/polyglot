class ChatRoomsChannel < ApplicationCable::Channel
  def subscribed
    stream_from "chat_room_#{params[:room]}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
    puts "I am now destroyed"
    # redirect_to root_path
      #   ActionCable.server.broadcast('notifications', {
      # head: 302, # redirection code, just to make it clear what you're doing
      # path: chat_room_path(chat_room), # you'll need to use url_helpers, so include them in your file
      # body: { caller: other_caller.id }
      # }
    # redirect_to root_path
  end
end
