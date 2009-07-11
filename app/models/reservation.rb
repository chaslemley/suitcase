class Reservation < ActiveRecord::Base
  belongs_to :unit
  belongs_to :guest
  belongs_to :account
  
  validates_presence_of :start_date, :end_date, :unit
  validate :start_date_must_occur_before_end_date
  validate :unit_is_available_on_create, :on => :create
  validate :unit_is_available_on_update, :on => :update
  validate :unit_must_belong_to_this_account
  
  attr_accessor :length, :length_of_stay
  
  state_machine :state, :initial => :reserved do    
    event :confirm do
      transition all => :confirmed
    end
    
    event :check_in do
      transition all => :checked_in
    end
    
    event :check_out do
      transition all => :checked_out
    end
    
    event :cancel do
      transition all => :cancelled
    end
  end
  
  
  def self.find_for_calendar(start_date, account_id)
    res_array = {}
    reservations = Reservation.find(:all, :conditions => ['((start_date between ? and ? || end_date between ? and ?) || (start_date < ? && end_date > ?)) && state != "cancelled"', 
      start_date.to_s, (start_date + 14.days).to_s, start_date.to_s, (start_date + 14.days).to_s, start_date.to_s, (start_date + 14.days).to_s])
    
    reservations.each do |r|
      if r.start_date < start_date - 1.days
        calendar_start_date = start_date - 1.days
      else
        calendar_start_date = r.start_date
      end
      
      r.length = (r.end_date - calendar_start_date)
      
      res_array["#{r.unit_id}_#{calendar_start_date.strftime("%F")}"] = r
    end
      
    res_array
  end
  
  def length_of_stay
    end_date - start_date
  end
  
  def start_date_must_occur_before_end_date
    errors.add(:start_date, "must occur before end date") if (start_date && end_date) && (start_date > end_date)
  end
  
  def unit_is_available_on_create
    errors.add(:unit, "is not available for this date range") if !self.id && unit && !(unit.is_available?(start_date, end_date))
  end
  
  def unit_is_available_on_update
    errors.add(:unit, "is not available for this date range") if unit && !(unit.is_available_on_update?(start_date, end_date, self))
  end
  
  def unit_must_belong_to_this_account
    errors.add(:unit, "is invalid") if unit && (unit.account != self.account)
  end
  
  def price
    p = length_of_stay.to_i * unit.base_rate
    p *= (1 + self.account.tax_rate)
  end
  
  def to_s
    "#{unit.name} (#{start_date.strftime('%b %d, %Y')} - #{end_date.strftime('%b %d, %Y')})"
  end
end