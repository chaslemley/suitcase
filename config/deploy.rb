## Sets up local => server ssh ##
# If you aren't deploying to /u/apps/#{application} on the target
# servers (which is the default), you can specify the actual location
# via the :deploy_to variable:
# set :deploy_to, "/var/www/#{application}"

set :application, "suitcase"
set :deploy_to, "/home/suitdeploy/#{application}"
set :user, "suitdeploy"
set :use_sudo, false
set :password, "f45TYw2#r2Sda"

## Sets up server => repository##
# If you aren't using Subversion to manage your source code, specify
# your SCM below:
# set :scm, :subversion
set :scm, :git
set :repository,  "git@github.com:chaslemley/suitcase.git";
#ssh_options[:forward_agent] = true
set :branch, "master"




## Assigns the location of each server ##
role :app, "173.45.238.95"
role :web, "173.45.238.95"
role :db,  "173.45.238.95", :primary => true


set :rails_env, :production

## Sets up tasks after deploy ##
# restarts passager
namespace :deploy do
 task :restart do
   run "touch #{current_path}/tmp/restart.txt"
 end
#establishessymbolic links  
 task :symlink_shared do
   run "ln -nfs #{shared_path}/config/database.yml #{release_path}/config/database.yml"
 end
 
end  

after 'deploy:update_code', 'deploy:symlink_shared'