class ReservationsController < ApplicationController
  include ModelControllerMethods

  def index
    mode = (request.session[:view]) ? request.session[:view] : "calendar"
    mode = (params[:mode]) ? params[:mode] : mode
    
    session[:view] = mode
        
    @reservation = Reservation.new
    @guest = Guest.new
    
    if(mode == "table")
      @partial = "reservations/table/table"
      table_mode
    else   
      @partial = "reservations/calendar/calendar"
      calendar_mode
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
          flash[:notice] = "Reservation for <strong>#{@guest.name}</strong> successfully saved."
          render :json => {"message" => "success", "details" => flash[:notice], "start_date" => @reservation.start_date.strftime("%Y-%m-%d")}.to_json
        else
          render :json =>  {"message" => "failure", "details" => combine_error_arrays(@guest.errors, @reservation.errors)}.to_json
        end
      }
    end
  end
  
  def new
    build_reservation_and_guest(params)
    
    respond_to do |format|
      format.html { render :action => 'new' }
      format.js { render :action => 'new', :layout => false }
    end
    
  end

  def edit
    @reservation = current_account.reservations.find(params[:id])

    respond_to do |format|
      format.html
      format.js { render :action => 'edit', :layout => false }
    end
  end
  
  def update
     @reservation = current_account.reservations.find(params[:id])

      respond_to do |format|
        format.html {
          @reservation.update_attributes(params[:reservation])         
        }
        format.js { 
          if @reservation.update_attributes(params[:reservation])
            render :json => {
              :message => 'success', 
              :html_data => render_to_string(:partial => 'reservations/reservation_details', :locals => {:reservation => @reservation}),
              :start_date => @reservation.start_date.strftime("%Y-%m-%d")
            }        
          else
            render :json => { 
              :message => 'failure',
              :details => @reservation.errors.to_json
            }
          end
        }
      end
  end
  
  def update_status
    @reservation = current_account.reservations.find(params[:id])
    
    respond_to do |format|
      format.html {
        @reservation.update_attributes(params[:reservation])         
      }
      format.js { 
        if @reservation.update_attributes(params[:reservation])
          render :json => {
            :message => 'success',
            :status_value => @reservation.state,
            :status_message => @reservation.state.humanize
          }        
        else
          render :json => { 
            :message => 'failure',
            :details => @reservation.errors.to_json
          }
        end
      }
    end
  end

  def show
    @reservation = current_account.reservations.find(params[:id])

    respond_to do |format|
      format.html
      format.js { render :action => 'show', :layout => false }
    end
  end
    
  private
  
  def calendar_mode
    @start = (params[:qd]) ? Date.parse(params[:qd]) : @start = Date.today
    @units = current_account.units.all
    @reservations = current_account.reservations.find_for_calendar(@start + 1.days, current_account.id)

    respond_to do |format|
      format.html     
      format.js { render :partial => 'reservations/calendar/calendar' }
    end
    
  end
  
  def table_mode
    @reservations = current_account.reservations.find(:all, :order => "created_at desc")

    respond_to do |format|
      format.html     
      format.js { render :partial => 'reservations/table/table' }
    end
    
  end
  

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
