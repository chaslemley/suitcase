class RateVariationsController < ApplicationController
  def index
    @unit = Unit.find(params[:unit_id])
    @rate_variations = @unit.rate_variations.find(:all, :order => 'start_date')
    
  end
  
  def new
    @unit = Unit.find(params[:unit_id])
    @rate_variation = @unit.rate_variations.build
  end
  
  def create
    @unit = Unit.find(params[:unit_id])
    @rate_variation = @unit.rate_variations.new(params[:rate_variation])
    
    @rate_variation.save
  end
  
  def edit
    @unit = Unit.find(params[:unit_id])
    @rate_variation = @unit.rate_variations.find(params[:id])
  end
  
  def update
    @unit = Unit.find(params[:unit_id])
    @rate_variation = @unit.rate_variations.find(params[:id])

    @rate_variation.update_attributes(params[:rate_variation])         
  end
  
  def destroy
    @unit = Unit.find(params[:unit_id])
    @rate_variation = @unit.rate_variations.find(params[:id])
    
    @rate_variation.destroy
  end

end
