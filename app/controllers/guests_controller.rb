class GuestsController < ApplicationController
  include ModelControllerMethods
  before_filter :redirect_to_dashboard, :only => ['new', 'index', 'destroy', 'show']

  def edit
    @guest = current_account.guests.find(params[:id])

    respond_to do |format|
      format.html
      format.js { render :action => 'edit', :layout => false }
    end
  end
  
  def update
    @guest = Guest.find(params[:id])
          
    respond_to do |format|
      format.html {
        @guest.update_attributes(params[:guest])         
      }
      format.js { 
        if @guest.update_attributes(params[:guest])
          render :json => {
            :message => 'success', 
            :html_data => render_to_string(:partial => 'guests/guest_details', :locals => {:guest => @guest})
          }        
        else
          render :json => { 
            :message => 'failure',
            :details => @guest.errors.to_json
          }
        end
      }
    end
  end
  
  private
  
  def redirect_to_dashboard
    redirect_to root_url
  end

  protected

  def scoper
    current_account.guests
  end
end
