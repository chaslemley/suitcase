class AddBaseRateAndEnabledToUnits < ActiveRecord::Migration
  def self.up
    add_column :units, :base_rate, :decimal, :precision => 10, :scale => 2, :default => 0.0
  end

  def self.down
    remove_column :units, :base_rate
  end
end
