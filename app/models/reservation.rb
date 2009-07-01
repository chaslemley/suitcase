class Reservation < ActiveRecord::Base
  belongs_to :unit
  belongs_to :guest
  belongs_to :account
  
  attr_accessor :length, :length_of_stay
  
  def self.find_for_calendar(start_date, account_id)
    res_array = {}
    reservations = Reservation.find(:all, :conditions => ['((start_date between ? and ? || end_date between ? and ?) || (start_date < ? && end_date > ?))', 
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
end