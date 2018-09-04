class ChatRoomsController < ApplicationController

  def show
    @chat_room = ChatRoom.find(params[:id])
  end

  def create
    #  HTTP status code 200 with an empty body
    head :no_content
    puts ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>11123213213213123213"
    puts params
    puts ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>11123213213213123213"

    ActionCable.server.broadcast "chat_room_#{params[:room]}", session_params
  end

  def destroy
    # chat_room = ChatRoom.find(params[:id])
    # chat_room.destroy
    ActionCable.server.broadcast "chat_room_#{params[:id]}", { hangUp: true }
    head :ok
  end

  private

  def session_params
    # SDP = Session description protocol (codec info from client)
    # Candidate = ICE candidates (e.g. TURN and STUN server)
    params.permit(:type, :from, :to, :sdp, :candidate, :room)
  end
end
