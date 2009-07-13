class RateVariationsController < ApplicationController
  def index
    @unit = Unit.find(params[:unit_id])
    @rate_variations = @unit.rate_variations.find(:all, :order => 'start_date')
    
  end
  
  def new
    @unit = Unit.find(params[:unit_id])
    @rate_variation = @unit.rate_variations.build
    
    respond_to do |format|
      format.html
      format.js { render :action => 'new', :layout => false }
    end
  end
  
  def create
    @unit = Unit.find(params[:unit_id])
    @rate_variation = @unit.rate_variations.new(params[:rate_variation])
    
    @rate_variation.save
    
    if @rate_variation.save  #success
      respond_to do |format|
        format.html
        format.js { 
          render :json => { 
            :message => 'success',
            :html_data => render_to_string(:partial => 'rate_variation', :locals => {:rate_variation => @rate_variation})
          }
        }
      end
    else #failure
      respond_to do |format|
        format.html
        format.js {  
          render :json => { 
            :message => 'failure',
            :details => @rate_variation.errors.to_json
          } 
        }
      end
    end
  end
  
  def edit
    @unit = Unit.find(params[:unit_id])
    @rate_variation = @unit.rate_variations.find(params[:id])
    
    respond_to do |format|
      format.html
      format.js { render :action => 'edit', :layout => false }
    end
  end
  
  def update
    # raise params.to_yaml
    @unit = Unit.find(params[:unit_id])
    @rate_variation = RateVariation.find(params[:id])

    if @rate_variation.update_attributes(params[:rate_variation])  #success
      respond_to do |format|
        format.html
        format.js { 
          render :json => { 
            :message => 'success',
            :html_data => render_to_string(:partial => 'rate_variation', :locals => {:rate_variation => @rate_variation})
          }
        }
      end
    else #failure
      respond_to do |format|
        format.html
        format.js {  
          render :json => { 
            :message => 'failure',
            :details => @rate_variation.errors.to_json
          } 
        }
      end
    end
  end
  
  def destroy
    @unit = Unit.find(params[:unit_id])
    @rate_variation = @unit.rate_variations.find(params[:id])
    
    @rate_variation.destroy
    
    if @rate_variation.destroy  #success
      respond_to do |format|
        format.html
        format.js { 
          render :json => { 
            :message => 'success'
            # :html_data => render_to_string(:partial => 'rate_variation', :locals => {:rate_variation => @rate_variation})
          }
        }
      end
    else #failure
      respond_to do |format|
        format.html
        format.js {  
          render :json => { 
            :message => 'failure',
            :details => @rate_variation.errors.to_json
          } 
        }
      end
    end
  end

end
