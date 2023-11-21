class FetchPoisJob < ApplicationJob
  queue_as :default

  def perform
    GetShortestPath.call(from: '295', to: '370')
  end
end
