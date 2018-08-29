class AddColumnToConnections < ActiveRecord::Migration[5.2]
  def change
    add_column :connections, :room_id, :string
  end
end
