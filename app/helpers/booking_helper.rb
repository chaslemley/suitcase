module BookingHelper
  def length_of_stay(start_date, end_date)
    pluralize(end_date - start_date, "night")
  end
end
