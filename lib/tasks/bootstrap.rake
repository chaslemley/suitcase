namespace :db do
  desc 'Load an initial set of data'
  task :bootstrap => :environment do
    puts 'Creating tables...'
    Rake::Task["db:drop"].invoke
    Rake::Task["db:create"].invoke
    Rake::Task["db:migrate"].invoke
    
    puts 'Loading data...'
    if SubscriptionPlan.count == 0
      plans = [
        { 'name' => 'Free', 'amount' => 0, 'user_limit' => 2 },
        { 'name' => 'Basic', 'amount' => 10, 'user_limit' => 5 },
        { 'name' => 'Premium', 'amount' => 30, 'user_limit' => nil }
      ].collect do |plan|
        SubscriptionPlan.create(plan)
      end
    end
    puts "Creating user..."
    user = User.create(:name => 'Test', :login => 'test', :password => 'test', :password_confirmation => 'test', :email => 'test@example.com')
    puts "Creating account..."
     a = Account.new(:name => 'Test Account', :domain => 'suitcase.local', :plan => SubscriptionPlan.first, :user => user)
     puts "Creating Subscription...."
     s = Subscription.new(:amount => 0, :subscription_plan => SubscriptionPlan.first, :account => a)
    a.subscription = s
    a.full_domain = 'suitcase.local'
    s.save
    a.save
    puts "Creating units...."
    
    unit = Unit.create(:name => "The First Unit", :base_rate => 25.00, :description => "This is our first unit", :account => a)
    unit = Unit.create(:name => "The Second Unit", :base_rate => 25.00, :description => "This is our second unit", :account => a)
    unit = Unit.create(:name => "The Third Unit", :base_rate => 25.00, :description => "This is our third unit", :account => a)
    unit = Unit.create(:name => "The Fourth Unit", :base_rate => 25.00, :description => "This is our fourth unit", :account => a)
    unit = Unit.create(:name => "The Fifth Unit", :base_rate => 25.00, :description => "This is our fifth unit", :account => a)
    unit = Unit.create(:name => "The Sixth Unit", :base_rate => 25.00, :description => "This is our sixth unit", :account => a)


    
    puts 'Changing secret in environment.rb...'
    new_secret = ActiveSupport::SecureRandom.hex(64)
    config_file_name = File.join(RAILS_ROOT, 'config', 'environment.rb')
    config_file_data = File.read(config_file_name)
    File.open(config_file_name, 'w') do |file|
      file.write(config_file_data.sub('9cb7f8ec7e560956b38e35e5e3005adf68acaf1f64600950e2f7dc9e6485d6d9c65566d193204316936b924d7cc72f54cad84b10a70a0257c3fd16e732152565', new_secret))
    end
    
    puts "All done!  You can now login to the test account at the localhost domain with the login test and password test.\n\n"
  end
end