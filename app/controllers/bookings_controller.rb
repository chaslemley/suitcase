class BookingsController < ApplicationController
  skip_before_filter :login_required
  
  def index
    if params[:start_date] && params[:end_date]
      @arrival = Date.parse(params[:start_date])
      @departure = Date.parse(params[:end_date])
      
      @units = current_account.units.available @arrival.to_s, @departure.to_s
    else
      @units = []
    end
      
    respond_to do |format|
      format.json {
       message = "success"
       message = "No units available for this date range." if (@units.empty?)
       message = "Please enter a valid date range." unless (Unit.valid_date_range?(@arrival, @departure))
       
        render :json => {:message => message, :start_date => @arrival, :end_date => @departure, :units => @units }.to_json 
      }
      format.html
    end
  end

  def new
    @reservation = current_account.reservations.new
    @reservation.start_date = params[:start_date]
    @reservation.end_date = params[:end_date]
    @reservation.unit = current_account.units.find(params[:unit_id])
    
    @guest = current_account.guests.new
  end

  def create
    build_reservation_and_guest(params)

    respond_to do |format|
      format.html {
        if @guest.save
          flash[:notice] = 'Reservation Saved'
          render :action => 'booking_completed'
        else
          render :action => 'new'
        end
      }
      format.js {
        if @guest.save
          flash[:notice] = "Reservation for <strong>#{@guest.name}</strong> successfully saved."
          render :json => {"message" => "success", "details" => flash[:notice], "start_date" => @reservation.start_date.strftime("%Y-%m-%d")}.to_json
        else
          render :json =>  {"message" => "failure", "details" => combine_error_arrays(@guest.errors, @reservation.errors)}.to_json
        end
      }
    end
  end
  
  def scripts
    @domain = current_account.full_domain
        
    respond_to do |format|
      format.js
    end
  end
  
  private
  
  def build_reservation_and_guest(params)
    @reservation = current_account.reservations.new(params[:reservation])  
    @guest = current_account.guests.new(params[:guest])

    @guest.reservations << @reservation
    
  end
  
end
