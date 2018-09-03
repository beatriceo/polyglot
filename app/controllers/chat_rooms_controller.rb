SPEECH = Speech.new(
  creds: JSON.parse(File.read(ENV["STREAMING_CREDENTIALS"])),
  host_lang: "en",
  recieve_lang: "fr"
  )

while true
  SPEECH.stream
end

class ChatRoomsController < ApplicationController

  def show
    @chat_room = ChatRoom.find(params[:id])
  end

  def create
    #  HTTP status code 200 with an empty body

    SPEECH.write_to_stream(params[:audio]) unless params[:audio].nil?

    ActionCable.server.broadcast "chat_room_#{params[:room]}", session_params

    head :no_content
  end

  private

  def session_params
    # SDP = Session description protocol (codec info from client)
    # Candidate = ICE candidates (e.g. TURN and STUN server)
    params.permit(:type, :from, :to, :sdp, :candidate, :room)
  end



end




