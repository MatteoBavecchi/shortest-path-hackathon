# frozen_string_literal: true

require 'net/http'

RECHARGING_POINTS = ["341","342","302","310","343","332","364","296","292","304","327","284","282","372","349","308","368","353","275","299","351","286","279","328","307","294","347","306","350","366","325","277","280","285","371","370","287","329","278","311","346","281","272","314","357","361","330","362","367","271"]

class GetShortestPathWithAutonomy
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
    # @param autonomy_limit [Number] autonomy limit in meter
    #
    # @return [[ID]] ordered list of point ids
    #
    def call(from:, to:, autonomy_limit:)
      graph_struct = DijkstraGraph.new
      hydra = Typhoeus::Hydra.hydra
      all_pois.map do |poi|
        request = neighbours(poi: poi)
        request.on_headers do |response|
          if response.code != 200
            raise "Request failed"
          end
        end
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

      r = graph_struct.shortest_path_with_autonomy_and_recharge(from, to, autonomy_limit, RECHARGING_POINTS)
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
