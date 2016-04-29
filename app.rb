%w[sinatra sinatra/reloader redis json net/http].each(&method(:require))

# Redis To Go
if ENV["REDISTOGO_URL"].nil?
    redis = Redis.new
else
    uri = URI.parse(ENV["REDISTOGO_URL"])
    redis = Redis.new(host:uri.host, port:uri.port, password:uri.password)
end

get '/' do
    html :index
end

def html(view)
    File.read(File.join('public', "#{view.to_s}.html"))
end

get '/api/v0/id/set' do
    JSON.pretty_generate redis.smembers('id-set')
end

put '/api/v0/id/registration' do
    request.body.rewind
    request_payload = JSON.parse(request.body.read)
    id = request_payload['id']
    redis.sadd('id-set', id)
    status 200
end

get '/api/v0/push/message' do
    JSON.pretty_generate {title:redis.get('push.title'), text:redis.get('push.text')}
end

put '/api/v0/push/message' do
    request.body.rewind
    request_payload = JSON.parse(request.body.read)
    title = request_payload['title']
    text = request_payload['text']
    redis.set('push.title', title)
    redis.set('push.text', text)
    status 200
end

def gcm_push(ids)
    gcm_uri = 'https://android.googleapis.com/gcm/send'
    api_key = 'AIzaSyBkesBWycrfZIBjivDrXqk3WNvvw1sV52U'

    uri = URI.parse(gcm_uri)
    req = Net::HTTP::Post.new(uri.path, initheader = {
        'Authorization' => "key=#{api_key}",
        'Content-Type' => 'application/json',
    })
    req.body = {registration_ids:ids, collapse_key:'1', 'data.message' => 'posted from gcm'}.to_json

    https = Net::HTTP.new(uri.host, uri.port)
    https.use_ssl = true
    https.set_debug_output $stderr

    res = https.request(req)
    res.body
end

post '/api/v0/push/message' do
    ids = redis.smembers 'id-set'
    gcm_push ids
    status 201
end

get '/management' do
    html :management
end