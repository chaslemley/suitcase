module ReservationsHelper
  def print_reservation_action(reservation)
    actions = []
    events = Reservation.state_machine(:state).events
    
    events.valid_for(reservation).each do |e|
      method = ""
      
      case e.name
        when :confirm
          method = confirm_reservation_path(reservation)
        when :cancel
          method = cancel_reservation_path(reservation)
        when :check_in
          method = check_in_reservation_path(reservation)
        when :check_out
          method = check_out_reservation_path(reservation)
      end
      
      actions << (link_to "#{e.name.to_s.humanize} this Reservation", method, :method => "put")
    end
    
    if actions.size > 0
      actions.join(", ")
    else
      "This reservation has been cancelled and the status cannot be changed."
    end
  end
end
