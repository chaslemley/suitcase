class AddAffiliates < ActiveRecord::Migration
  def self.up
    create_table :subscription_affiliates, :force => true do |t|
      t.string   :name
      t.decimal  :rate, :precision => 6, :scale => 4, :default => 0.0
      t.datetime :created_at
      t.datetime :updated_at
      t.string   :token
    end
    
    add_index :subscription_affiliates, :token
    
    add_column :subscriptions, :subscription_affiliate_id, :integer
    add_column :subscription_payments, :subscription_affiliate_id, :integer
    add_column :subscription_payments, :affiliate_amount, :decimal, :precision => 6, :scale => 2, :default => 0.0
  end

  def self.down
    remove_column :subscription_payments, :affiliate_amount
    remove_column :subscription_payments, :subscription_affiliate_id
    remove_column :subscriptions, :subscription_affiliate_id
    drop_table :subscription_affiliates
  end
end
