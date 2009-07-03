class GuestsController < ApplicationController
  include ModelControllerMethods

  def index
    self.instance_variable_set('@' + self.controller_name,
    scoper.find(:all, :order => 'last_name'))
  end

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

  protected

  def scoper
    current_account.guests
  end
end
