# frozen_string_literal: true

require 'net/http'

class PathRetriever::Base
  URL = URI('https://stg.locatorapi.io/api/graphql')
  HEADERS = {
    'Authorization': 'Bearer c3dbd8793636e5b9e173601bdb0bb191',
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }.freeze
  LocatorAPI = Net::HTTP.new(URL.host, URL.port)
  LocatorAPI.use_ssl = true

  class << self
    def fetch_all(&block)
      hydra = Typhoeus::Hydra.hydra
      all_pois.map do |poi|
        request = neighbours(poi: poi)
        request.on_headers do |response|
          raise 'Request failed' if response.code != 200
        end
        if block_given?
          request.on_complete do |response|
            block.call(response, poi)
          end
        end
        hydra.queue request
      end
      hydra.run
    rescue StandardError => e
      p :fetch_all__error, e
      nil
    end

    private

    def execute_query(query)
      response = LocatorAPI.post(URL.path, { query: query }.to_json, HEADERS)
      JSON.parse(response.body)['data']
    rescue StandardError => e
      p :execute_query__error, e
      []
    end

    def all_pois
      execute_query('query { pois { id uniqId latitude longitude} }')['pois']
    end

    def neighbours(poi:, distance: 93_000)
      Typhoeus::Request.new(
        URL,
        method: :post,
        body: { query: "query { poisByDistance(input: { distance: #{distance}, latitude: #{poi['latitude']}, longitude: #{poi['longitude']} }){ id uniqId distance }}" }.to_json,
        headers: HEADERS
      )
      # execute_query("query { poisByDistance(input: { distance: #{distance}, latitude: #{poi['latitude']}, longitude: #{poi['longitude']} }){ id uniqId distance }}")['poisByDistance'].drop 1
    rescue StandardError => e
      p :neighbours__error, e
      []
    end
  end
end
