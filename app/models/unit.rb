class Unit < ActiveRecord::Base
  belongs_to :account
  has_many :reservations
  
  validates_presence_of :name
end
