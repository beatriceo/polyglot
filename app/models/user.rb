class User < ApplicationRecord

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  has_many :connections
  has_many :chat_room_participations
  has_many :chat_rooms, through: :chat_room_participations
  has_many :requests

  validates :email, uniqueness: true

  mount_uploader :photo, PhotoUploader

  def contacts
    self.connections.map do |connection|
      connection.contact
    end
  end
end
