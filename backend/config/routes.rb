# frozen_string_literal: true

Rails.application.routes.draw do
  get '/shortest_path', to: 'paths#shortest_path'
  get '/shortest_path_with_stages', to: 'paths#shortest_path_with_stages'
  get '/shortest_path_with_autonomy', to: 'paths#shortest_path_with_autonomy'
end
