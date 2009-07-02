class Guest < ActiveRecord::Base
  has_many :reservations
  
  validates_presence_of :first_name, :last_name, :email
  
  def name
    "#{first_name} #{last_name}"
  end
end
