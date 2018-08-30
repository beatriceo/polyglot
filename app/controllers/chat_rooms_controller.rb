class ChatRoomsController < ApplicationController

  def show
    @chat_room = ChatRoom.find(params[:id])
  end

  def create

  end
end
