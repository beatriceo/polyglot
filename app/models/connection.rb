class Connection < ApplicationRecord
  belongs_to :user
  belongs_to :contact, class_name: 'User', foreign_key: 'contact_id'

  after_create :create_inverted_connection

  private

  def create_inverted_connection
    unless Connection.where('user_id = ? and contact_id = ?', self.contact.id, self.user.id).length > 0
      inverted = Connection.create!(user: self.contact, contact: self.user)
    end
  end
end
