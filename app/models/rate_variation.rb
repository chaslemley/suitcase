class RateVariation < ActiveRecord::Base
  belongs_to :unit
  
  validates_presence_of :unit, :start_date, :end_date, :variation_type, :amount, :days_of_week
  
  def to_s
    "Every #{process_day_string} between #{start_date.strftime('%b %d, %Y')} and #{end_date.strftime('%b %d, %Y')} the rate #{variation_type}s by $#{"%05.2f" % amount}."
  end
  
  private
  
  def process_day_string
    case days_of_week
      when '1000000'  
        'Sunday'  
      when '0100000' 
        'Monday'
      when '0010000'  
        'Tuesday'  
      when '0001000' 
        'Wednesday' 
      when '0000100' 
        'Thursday'
      when '0000010' 
        'Friday' 
      when '0000001' 
        'Saturday'
      when '1111111'
        'day'
      when '0000011'
        'Friday and Saturday'
      when '1111100'
        'Sunday through Thursday'
      else
        'error'
    end
  end
  
  
end
