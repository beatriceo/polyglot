class ChangeColumnInRequests < ActiveRecord::Migration[5.2]
  def change
    change_column :requests, :accepted, :boolean, default: false
  end
end
