# frozen_string_literal: true

class PathsController < ApplicationController
  def shortest_path
    shortest_path = GetShortestPath.call(from: params[:from], to: params[:to])
    render json: shortest_path
  end
end
