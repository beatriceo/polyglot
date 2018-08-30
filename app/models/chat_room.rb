class ChatRoom < ApplicationRecord
  has_many :chat_room_participations
  has_many :users, through: :chat_room_participations
  has_many :requests
end
