module SubscriptionSystem

  # Set up some stuff for ApplicationController
  def self.included(base)
    base.send :before_filter, :login_required
    base.send :before_filter, :set_affiliate_cookie
    base.send :helper_method, :current_account, :admin?, :admin_subdomain?
    base.send :filter_parameter_logging, :password, :creditcard
  end
  
  protected
  
    def current_account
      @current_account ||= Account.find_by_full_domain(request.host)
      raise ActiveRecord::RecordNotFound unless @current_account
      @current_account
    end
    
    def admin?
      logged_in? && current_user.admin?
    end
    
    def admin_subdomain?
      request.subdomains.first == AppConfig['admin_subdomain']
    end

    def set_affiliate_cookie
      if !params[:ref].blank? && affiliate = SubscriptionAffiliate.find_by_token(params[:ref])
        cookies[:affiliate] = { :value => params[:ref], :expires => 1.month.from_now }
      end
    end

end