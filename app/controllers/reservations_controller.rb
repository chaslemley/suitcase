class ReservationsController < ApplicationController
  include ModelControllerMethods
  
  def index
    @start = (params[:qd]) ? Date.parse(params[:qd]) : @start = Date.today
    @units = current_account.units.all
    @reservations = current_account.reservations.find_for_calendar(@start + 1.days, current_account.id)
    
    respond_to do |format|
      format.html     
      format.js { render :partial => 'reservations/calendar/calendar' }
    end
  end
  
  protected
  
  def scoper
    current_account.reservations
  end
  
end
