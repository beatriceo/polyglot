class VideoSessionsController < ApplicationController
  def create
    #  HTTP status code 200 with an empty body
    head :no_content
    ActionCable.server.broadcast "video_session_channel", session_params
  end

  private

  def session_params
    # SDP = Session description protocol (codec info from client)
    # Candidate = ICE candidates (e.g. TURN and STUN server)
    params.permit(:type, :from, :to, :sdp, :candidate)
  end
end
