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
      pois = all_pois()
      from = pois.find { _1['id'] == from.to_s }
      to = pois.find { _1['id'] == to.to_s }
      # pois = pois.map do |poi|
      #   { poi['id'] => neighbours(poi: poi) }
      #   # TODO use DijkstraGraph to get the closest neighbour
      # end

      # returns the path as an ordered list of pois ids
      # path.map { _1[:id] }

      pois
    rescue StandardError => e
      p :ERROR, e
      nil
    end

    private

      def execute_query(query)
        p :QUERY, query
        response = LocatorAPI.post(URL.path, { query: query }.to_json, HEADERS)
        JSON.parse(response.body)['data']
      end

      def all_pois
        execute_query('query { pois { id uniqId latitude longitude} }')['pois']
      rescue StandardError => e
        p :ERROR, e
        []
      end

      def neighbours(poi:, distance: 93000)
        execute_query("query { poisByDistance(input: { distance: #{distance}, latitude: #{poi['latitude']}, longitude: #{poi['longitude']} }){ id uniqId distance }}")['poisByDistance'].drop 1
      rescue StandardError => e
        p :ERROR, e
        []
      end
  end
end
