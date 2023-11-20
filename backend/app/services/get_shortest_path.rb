# frozen_string_literal: true

class GetShortestPath
  class << self
    #
    # Calculates the shortest path between two points
    #
    # @param from [ID] starting point
    # @param to [ID] destination point
    #
    # @return [[ID]] ordered list of points ids
    #
    def call(from:, to:)
      # TODO get all pois from https://stg.locatorapi.io/pois
      # all_pois = get_all_pois()

      # TODO use DijkstraGraph to get closest point recursively
      # path = DijkstraGraph.new()

      # returns the path as an ordered list of pois ids
      # path.map { _1[:id] }
      [1, 2, 3]
    end
  end
end
