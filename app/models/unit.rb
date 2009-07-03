class Unit < ActiveRecord::Base
  belongs_to :account
  has_many :reservations
  
  validates_presence_of :name
  
  def self.available(arrival, departure)
    return [] if !valid_date_range?(arrival, departure)
          
    Unit.all - unavailable_units(arrival, departure)     
  end
  
  private
  
  def self.valid_date_range?(start_date, end_date)
    arrival = Date.parse start_date
    departure = Date.parse end_date
    today = Date.today
    
    departure > arrival && arrival >= today
  end
  
  def self.unavailable_units(arrival, departure)
    Unit.find(:all, :joins => :reservations, :conditions => [ '((((? >= start_date && ? < end_date) || (? > start_date && ? <= end_date)) || (? <= start_date && ? > end_date)))', arrival, arrival, departure, departure, arrival, departure ])
  end
end