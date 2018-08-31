class AddColumnsToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :language, :string
    add_column :users, :caption_font, :string
    add_column :users, :caption_font_size, :integer
    add_column :users, :enable_transcript, :boolean
  end
end
