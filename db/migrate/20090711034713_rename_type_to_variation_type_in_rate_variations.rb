class RenameTypeToVariationTypeInRateVariations < ActiveRecord::Migration
  def self.up
    rename_column :rate_variations, :type, :variation_type
  end

  def self.down
    rename_column :rate_variations, :variation_type, :type
  end
end
