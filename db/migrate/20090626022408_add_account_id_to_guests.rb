class AddAccountIdToGuests < ActiveRecord::Migration
  def self.up
    add_column :guests, :account_id, :integer
  end

  def self.down
    remove_column :guests, :account_id
  end
end
