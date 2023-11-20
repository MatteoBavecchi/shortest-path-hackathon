# frozen_string_literal: true

Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  get '/shortest_path', to: 'paths#shortest_path'
end
