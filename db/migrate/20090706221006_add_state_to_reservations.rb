class AddStateToReservations < ActiveRecord::Migration
  def self.up
    add_column :reservations, :state, :string
  end

  def self.down
    remove_column :reservations, :state
  end
end
