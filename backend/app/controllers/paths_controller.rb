# frozen_string_literal: true

class PathsController < ApplicationController
  def shortest_path
    shortest_path = PathRetriever::GetShortestPath.call(from: params[:from], to: params[:to])
    render json: shortest_path
  end

  def shortest_path_with_stages
    shortest_path = PathRetriever::GetShortestPathWithStages.call(stops: params[:stops])
    render json: shortest_path
  end

  def shortest_path_with_autonomy
    shortest_path = PathRetriever::GetShortestPathWithAutonomy.call(from: params[:from], to: params[:to], autonomy_limit: params[:autonomy_limit].to_f)
    render json: shortest_path
  end
end
