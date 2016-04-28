%w[sinatra sinatra/reloader redis].each(&method(:require))

# Redis To Go
if ENV["REDISTOGO_URL"].nil?
    redis = Redis.new
else
    uri = URI.parse(ENV["REDISTOGO_URL"])
    redis = Redis.new(host:uri.host, port:uri.port, password:uri.password)
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

get '/redis' do
    last_access_at = nil # init
    last_access_at = redis.get 'LAST_ACCESS_AT'
    last_access_at ||= Time.now
    redis.set('LAST_ACCESS_AT', Time.now)
    "@#{ENV["REDISTOGO_URL"].nil? ? 'Local' : 'Heroku'}
    <br>
    #{ENV.to_a.to_s}
    <br>
    Last access at: #{last_access_at.to_s}
    <br>
    Current access at: #{Time.now.to_s}"
end
