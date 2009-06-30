class Guest < ActiveRecord::Base
  has_many :reservations
  
  def name
    "#{first_name} #{last_name}"
  end
end
