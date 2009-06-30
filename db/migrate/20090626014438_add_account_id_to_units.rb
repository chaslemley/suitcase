class AddAccountIdToUnits < ActiveRecord::Migration
  def self.up
    add_column :units, :account_id, :integer
  end

  def self.down
    remove_column :units, :account_id
  end
end
