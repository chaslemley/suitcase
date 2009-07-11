class RateVariation < ActiveRecord::Base
  belongs_to :unit
  
  validates_presence_of :unit, :start_date, :end_date, :variation_type, :amount, :days_of_week
  
  def to_s
    "Every #{process_day_string} between #{start_date.strftime('%b %d, %Y')} and #{end_date.strftime('%b %d, %Y')} the rate #{variation_type}s by $#{"%05.2f" % amount}."
  end
  
  def applies_to_day?(day_of_week)
    case day_of_week
    when 'Sunday'
      days_of_week[0] == 49
    when 'Monday'          
      days_of_week[1] == 49
    when 'Tuesday'         
      days_of_week[2] == 49
    when 'Wednesday'       
      days_of_week[3] == 49
    when 'Thursday'        
      days_of_week[4] == 49
    when 'Friday'          
      days_of_week[5] == 49
    when 'Saturday'        
      days_of_week[6] == 49
    end
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
