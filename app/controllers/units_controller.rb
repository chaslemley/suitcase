class UnitsController < ApplicationController
  include ModelControllerMethods
  
  protected
  
    def scoper
      current_account.units
    end
  
end
