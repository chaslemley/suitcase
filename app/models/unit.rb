class Unit < ActiveRecord::Base
  belongs_to :account
  has_many :reservations, :dependent => :destroy
  
  validates_presence_of :name
  
  has_attached_file :photo, :styles => { :small => "150x150>", :medium => "200x200>"}
  
  validates_attachment_size :photo, :less_than => 2.megabytes
    
  def self.available(arrival, departure)
    return [] if !valid_date_range?(arrival, departure)
          
    Unit.all - unavailable_units(arrival, departure)     
  end
  
  
  def is_available? arrival, departure
    !Unit.unavailable_units(arrival, departure).include?(self)
  end
  
  def is_available_on_update? arrival, departure, reservation
    !Unit.unavailable_units_on_update(arrival, departure, reservation).include?(self)
  end
  
  def rate arrival, departure
    (departure - arrival).to_i * base_rate
  end
  
  private
  
  def self.valid_date_range?(start_date, end_date)
    arrival = Date.parse start_date
    departure = Date.parse end_date
    today = Date.today
    
    departure > arrival && arrival >= today
  end
  
  def self.unavailable_units(arrival, departure)
    Unit.find(:all, :joins => :reservations, :conditions => [ '((((? >= start_date && ? < end_date) || (? > start_date && ? <= end_date)) || (? <= start_date && ? > end_date))) && state != "cancelled"', arrival, arrival, departure, departure, arrival, departure ])
  end
  
  def self.unavailable_units_on_update(arrival, departure, reservation)
    Unit.find(:all, :joins => :reservations, :conditions => [ '((((? >= start_date && ? < end_date) || (? > start_date && ? <= end_date)) || (? <= start_date && ? > end_date))) && state != "cancelled" && reservations.id != ?', arrival, arrival, departure, departure, arrival, departure, reservation.id ])
  end
end