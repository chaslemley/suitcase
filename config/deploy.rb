## Sets up local => server ssh ##
# If you aren't deploying to /u/apps/#{application} on the target
# servers (which is the default), you can specify the actual location
# via the eploy_to variable:
# set eploy_to, "/var/www/#{application}"

set :application, "suitcase"
set eploy_to, "/home/suitdeploy/#{application}"
set :user, "suitdeploy"
set :use_sudo, false

## Sets up server => repository##
# If you aren't using Subversion to manage your source code, specify
# your SCM below:
# set cm, ubversion
set cm, :git
set :repository,  "git@github.com:chaslemley/suitcase.git";
#ssh_options[:forward_agent] = true
set :branch, "master"




## Assigns the location of each server ##
role :app, "173.45.238.95"
role :web, "173.45.238.95"
role b,  "173.45.238.95", rimary => true


set :rails_env, roduction

## Sets up tasks after deploy ##
# restarts passager
namespace eploy do
 task :restart do
   run "touch #{current_path}/tmp/restart.txt"
 end
#establishessymbolic links  
 task ymlink_shared do
   run "ln -nfs #{shared_path}/config/database.yml #{release_path}/config/database.yml"
 end
 
end  

after 'deploy:update_code', 'deploy:symlink_shared'