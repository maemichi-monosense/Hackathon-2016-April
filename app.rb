%w[sinatra sinatra/reloader].each(&method(:require))
require_relative 'sinatra_ssl'

set :environment, :production
set :port, 443
set :ssl_certificate, './server.crt'
set :ssl_key, './server.key'

get '/' do
    # @title = 'Hackathon'
    # @text = 'モノセンス合宿2016年4月'
    html :index
end

def html(view)
    File.read(File.join('public', "#{view.to_s}.html"))
    # send_file File.join(settings.public_folder, "#{view.to_s}.html")
end

get '/pwd' do
    Dir.pwd
end
