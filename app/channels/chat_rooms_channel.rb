class ChatRoomsChannel < ApplicationCable::Channel
  def subscribed
    stream_from "chat_room_#{params[:room]}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
