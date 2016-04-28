%w[sinatra sinatra/reloader redis].each(&method(:require))

# Redis To Go
if ENV["REDISTOGO_URL"] != nil
    uri = URI.parse(ENV["REDISTOGO_URL"])
    redis = Redis.new host:uri.host, port:uri.port, password:uri.password
else
    redis = Redis.new host:'localhost', port:6379
end

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
