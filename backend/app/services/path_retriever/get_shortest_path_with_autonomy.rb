# frozen_string_literal: true

require 'net/http'

RECHARGING_POINTS = %w[341 342 302 310 343 332 364 296 292 304 327 284 282 372 349 308
                       368 353 275 299 351 286 279 328 307 294 347 306 350 366 325 277 280 285 371 370 287 329 278 311 346 281 272 314 357 361 330 362 367 271]

class PathRetriever::GetShortestPathWithAutonomy < PathRetriever::Base
  class << self
    #
    # Calculates the shortest path between two points
    #
    # @param from [ID] starting point
    # @param to [ID] destination point
    # @param autonomy_limit [Number] autonomy limit in meter
    #
    # @return [[ID]] ordered list of point ids
    #
    def call(from:, to:, autonomy_limit:)
      @graph_struct = DijkstraGraph.new

      fetch_all do |response, poi|
        pois = JSON.parse(response.body)['data']['poisByDistance'].drop 1
        pois.each { |neighbour| @graph_struct.add_edge(poi['id'], neighbour['id'], neighbour['distance']) }
      end

      @graph_struct.shortest_path_with_autonomy_and_recharge(from, to, autonomy_limit, RECHARGING_POINTS)
    rescue StandardError => e
      p :call__error, e
      nil
    end
  end
end
