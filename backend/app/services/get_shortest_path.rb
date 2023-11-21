# frozen_string_literal: true

require 'net/http'

class GetShortestPath
  URL = URI('https://stg.locatorapi.io/api/graphql')
  HEADERS = {
    'Authorization': 'Bearer c3dbd8793636e5b9e173601bdb0bb191',
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }.freeze
  LocatorAPI = Net::HTTP.new(URL.host, URL.port)
  LocatorAPI.use_ssl = true

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
      graph_struct = DijkstraGraph.new
      hydra = Typhoeus::Hydra.hydra
      all_pois.map do |poi|
        request = neighbours(poi: poi)
        request.on_complete do |response|
          pois = JSON.parse(response.body)["data"]['poisByDistance'].drop 1
          pois.each { |neighbour| graph_struct.add_edge(poi['id'], neighbour['id'], neighbour['distance']) }
        end
        hydra.queue request

        # neighbours(poi: poi).each do |neighbour|
        #   graph_struct.add_edge(poi['id'], neighbour['id'], neighbour['distance'])
        # end
      end
      hydra.run

      from = '295'
      to = '370'
      r = graph_struct.shortest_path(from, to)
      pp r
      r
    rescue StandardError => e
      p :GetShortestPath_ERROR, e
      nil
    end

    private

      def execute_query(query)
        p :QUERY, query
        response = LocatorAPI.post(URL.path, { query: query }.to_json, HEADERS)
        JSON.parse(response.body)['data']
      rescue StandardError => e
        p :QUERY_ERROR, e
        []
      end

      def all_pois
        execute_query('query { pois { id uniqId latitude longitude} }')['pois']
      end

      def neighbours(poi:, distance: 93000)
        Typhoeus::Request.new(
          URL,
          method: :post,
          body: { query: "query { poisByDistance(input: { distance: #{distance}, latitude: #{poi['latitude']}, longitude: #{poi['longitude']} }){ id uniqId distance }}" }.to_json,
          headers: HEADERS
        )
        # execute_query("query { poisByDistance(input: { distance: #{distance}, latitude: #{poi['latitude']}, longitude: #{poi['longitude']} }){ id uniqId distance }}")['poisByDistance'].drop 1
      rescue StandardError => e
        p :ERROR, e
        []
      end
  end
end
