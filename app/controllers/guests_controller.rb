class GuestsController < ApplicationController
  include ModelControllerMethods
  
  def index
    self.instance_variable_set('@' + self.controller_name,
      scoper.find(:all, :order => 'last_name'))
  end
  
  protected
  
    def scoper
      current_account.guests
    end
end
