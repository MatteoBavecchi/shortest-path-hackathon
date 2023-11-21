# frozen_string_literal: true

class FetchPoisJob < ApplicationJob
  queue_as :default

  def perform
    PathRetriever::Base.fetch_all
  end
end
