class AddTaxRateToAccounts < ActiveRecord::Migration
  def self.up
    add_column :accounts, :tax_rate, :decimal, :precision => 10, :scale => 2, :default => 0.0
  end

  def self.down
    remove_column :accounts, :tax_rate
  end
end
