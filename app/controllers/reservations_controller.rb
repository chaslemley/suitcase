class ReservationsController < ApplicationController
  include ModelControllerMethods
  
  def index
    @start = (params[:qd]) ? Date.parse(params[:qd]) : @start = Date.today
    @units = current_account.units.all
    @reservations = current_account.reservations.find_for_calendar(@start + 1.days, current_account.id)
    
    @reservation = Reservation.new
    @guest = Guest.new
    
    
    respond_to do |format|
      format.html     
      format.js { render :partial => 'reservations/calendar/calendar' }
    end
  end
  
  def create
    build_reservation_and_guest(params)
    
    respond_to do |format|
      format.html {
        if @guest.save
          flash[:notice] = 'Reservation Saved'
          redirect_to root_path
        else
          render :action => 'new'
        end
      }
      format.js {
        if @guest.save
            flash[:notice] = 'Reservation Saved'
            render :json => {"message" => "success", "details" => flash[:notice]}.to_json
        else
          render :json =>  {"message" => "failure", "details" => combine_error_arrays(@guest.errors, @reservation.errors)}.to_json
        end
      }
    end
    
  end
  
  private
  
  def build_reservation_and_guest(params)
    @reservation = current_account.reservations.new(params[:reservation])  
    @guest = current_account.guests.new(params[:guest])

    @guest.reservations << @reservation
  end
  
  protected
  
  def scoper
    current_account.reservations
  end
  
end
