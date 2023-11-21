# frozen_string_literal: true

class DijkstraGraph
  attr_reader :graph, :nodes, :previous, :distance # getter methods

  INFINITY = Float::INFINITY

  def initialize
    @graph = {} # the graph // {node => { edge1 => weight, edge2 => weight}, node2 => ...
    @nodes = Set.new
  end

  # connect each node with target and weight
  def connect_graph(source, target, weight)
    if !graph.has_key?(source)
      graph[source] = { target => weight }
    else
      graph[source][target] = weight
    end
    nodes << source
  end

  # connect each node bidirectional
  def add_edge(source, target, weight)
    connect_graph(source, target, weight) # directional graph
    connect_graph(target, source, weight) # non directed graph (inserts the other edge too)
  end

  # based of wikipedia's pseudocode: http://en.wikipedia.org/wiki/Dijkstra's_algorithm

  def dijkstra(source)
    @distance = {}
    @previous = {}
    nodes.each do |node| # initialization
      @distance[node] = INFINITY # Unknown distance from source to vertex
      @previous[node] = -1 # Previous node in optimal path from source
    end

    @distance[source] = 0 # Distance from source to source

    queue = Set.new
    queue << source

    until queue.empty?
      u = queue.min_by { |n| @distance[n] }

      break if @distance[u] == INFINITY

      queue.delete(u)

      graph[u].keys.each do |vertex|
        alt = @distance[u] + graph[u][vertex]

        next unless alt < @distance[vertex]

        @distance[vertex] = alt
        @previous[vertex] = u # A shorter path to v has been found
        queue << vertex
      end

    end
  end

  # To find the full shortest route to a node

  def find_path(dest)
    find_path @previous[dest] if @previous[dest] != -1
    @path ||= []
    @path << dest
  end

  # Gets all shortests paths using dijkstra

  def all_shortest_paths(source)
    @graph_paths = []
    @source = source
    dijkstra source
    nodes.each do |dest|
      @path = []

      find_path dest

      actual_distance = if @distance[dest] != INFINITY
                          @distance[dest]
                        else
                          'no path'
                        end
      @graph_paths << "Target(#{dest})  #{@path.join('-->')} : #{actual_distance}"
    end
    @graph_paths
  end

  def shortest_path(source, dest)
    @graph_paths = []
    @source = source
    dijkstra source

    @path = []

    find_path dest

    actual_distance = if @distance[dest] != INFINITY
                        @distance[dest].round
                      else
                        'no path'
                      end
    { path: @path, total_distance: actual_distance }
  end

  def print_result
    @graph_paths.each do |graph|
      puts graph
    end
  end

  def shortest_path_with_intermediates(stops = [])
    full_path = []
    stops.each_cons(2) do |a|
      full_path << shortest_path(a[0], a[1])
    end
    full_path
  end

  def shortest_path_with_autonomy_and_recharge(start, goal, autonomy_limit, recharge_points = nil)
    distances = Hash.new(Float::INFINITY)
    distances[start] = 0
    priority_queue = [[0, start, 0, []]] # [total distance, current node, autonomy used, stops]

    until priority_queue.empty?
      priority_queue.sort! # Sort the queue based on the first element (total distance)
      total_dist, current, autonomy_used, stops = priority_queue.shift

      # Check if reached the goal
      if current == goal
        # Reached the goal, break out of the loop
        break
      end

      graph[current].each do |neighbor, weight|
        new_autonomy = autonomy_used + weight
        new_stops = stops.dup

        # Check if autonomy limit is not exceeded
        next unless new_autonomy <= autonomy_limit

        new_distance = distances[current] + weight

        # Check if the neighbor is a recharge point
        if recharge_points.nil? || recharge_points.include?(neighbor)
          new_stops.push(neighbor)
          new_autonomy = 0 # Reset autonomy at recharge points
        end

        if new_distance < distances[neighbor]
          distances[neighbor] = new_distance
          priority_queue.push([new_distance, neighbor, new_autonomy, new_stops])
        end
      end
    end

    # Now, distances hash contains the shortest distances from start to each node
    # You can extract the shortest path from start to goal if it exists
    return nil if distances[goal] == Float::INFINITY

    # No path found within autonomy limit

    # Reconstruct the path from the distances hash
    path = []
    current = goal
    until current == start
      path.unshift(current)
      graph[current].each do |neighbor, weight|
        if distances[current] == distances[neighbor] + weight
          current = neighbor
          break
        end
      end
    end
    path.unshift(start)

    # Return the path and stops
    { path: path, stops: stops }
  end
end
