%w[sinatra sinatra/reloader].each(&method(:require))

get '/' do
    'Hello, Sinatra!'
end
