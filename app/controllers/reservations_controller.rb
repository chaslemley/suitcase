class ReservationsController < ApplicationController
  include ModelControllerMethods
  
  def index
    #self.instance_variable_set('@' + self.controller_name, scoper.find(:all, :order => 'unit_id'))
    
    if params[:qd]
       @start = Date.parse(params[:qd])
    else
      @start = Date.today     
    end

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
