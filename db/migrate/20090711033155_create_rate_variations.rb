class CreateRateVariations < ActiveRecord::Migration
  def self.up
    create_table :rate_variations do |t|
      t.integer :unit_id
      t.date :start_date
      t.date :end_date
      t.string :description
      t.string :type
      t.decimal :amount, :precision => 10, :scale => 2, :default => 0.0
      t.string :days_of_week

      t.timestamps
    end
  end

  def self.down
    drop_table :rate_variations
  end
end
