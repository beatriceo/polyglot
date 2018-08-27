class CreateConnections < ActiveRecord::Migration[5.2]
  def change
    create_table :connections do |t|
      t.references :user, foreign_key: true, index: true
      t.references :contact, foreign_key: { to_table: :users }, index: true
    end
  end
end
