# frozen_string_literal: true

require 'net/http'

class PathRetriever::GetShortestPath < PathRetriever::Base
  class << self
    #
    # Calculates the shortest path between two points
    #
    # @param from [ID] starting point
    # @param to [ID] destination point
    #
    # @return [[ID]] ordered list of point ids
    #
    def call(from:, to:)
      @graph_struct = DijkstraGraph.new
      fetch_all do |response, poi|
        pois = JSON.parse(response.body)['data']['poisByDistance'].drop 1
        pois.each { |neighbour| @graph_struct.add_edge(poi['id'], neighbour['id'], neighbour['distance']) }
      end

      r = @graph_struct.shortest_path(from, to)
      pp r
      r
    rescue StandardError => e
      p :call__error, e
      p e.backtrace
      nil
    end
  end
end
