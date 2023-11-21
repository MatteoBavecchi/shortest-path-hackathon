# frozen_string_literal: true

require 'net/http'

class PathRetriever::GetShortestPathWithStages < PathRetriever::Base
  class << self
    #
    # Calculates the shortest path
    #
    # @param stops [Array<ID>] ordered list of stops
    #
    # @return [[ID]] ordered list of point ids
    #
    def call(stops:)
      @graph_struct = DijkstraGraph.new
      fetch_all do |response, poi|
        pois = JSON.parse(response.body)['data']['poisByDistance'].drop 1
        pois.each { |neighbour| @graph_struct.add_edge(poi['id'], neighbour['id'], neighbour['distance']) }
      end

      r = @graph_struct.shortest_path_with_intermediates(stops)
      pp r
      r
    rescue StandardError => e
      p :GetShortestPath_ERROR, e
      nil
    end
  end
end
