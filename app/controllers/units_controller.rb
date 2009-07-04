class UnitsController < ApplicationController
  include ModelControllerMethods
  
  def index    
    if params[:start_date] && params[:end_date]
      arrival = params[:start_date]
      departure = params[:end_date]
      
      @units = current_account.units.available Date.parse(arrival).to_s, Date.parse(departure).to_s
    else
      @units = current_account.units.all
    end
      
    respond_to do |format|
      format.json {
       message = "success"
       message = "No units available for this date range." if (@units.empty?)
       message = "Please enter a valid date range." unless (Unit.valid_date_range?(arrival, departure))
       
        render :json => {:message => message, :start_date => arrival, :end_date => departure, :units => @units }.to_json 
      }
      format.html 
    end
    
  end
  
  protected
  
    def scoper
      current_account.units
    end
  
end
