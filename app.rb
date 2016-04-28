%w[sinatra sinatra/reloader].each(&method(:require))

set :environment, :production
set :port, 80

get '/' do
    @title = 'Hackathon'
    @text = 'モノセンス合宿2016年4月'
    erb :index
end
