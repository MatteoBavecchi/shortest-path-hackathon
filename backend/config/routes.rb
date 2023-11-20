# frozen_string_literal: true

Rails.application.routes.draw do
  get '/shortest_path', to: 'paths#shortest_path'
end
