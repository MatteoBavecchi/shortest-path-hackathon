# frozen_string_literal: true

class DijkstraGraph
  attr_reader :graph, :nodes, :previous, :distance #getter methods
  INFINITY = 1 << 64

  def initialize
    @graph = {} # the graph // {node => { edge1 => weight, edge2 => weight}, node2 => ...
    @nodes = Set.new
  end

# connect each node with target and weight
  def connect_graph(source, target, weight)
    if (!graph.has_key?(source))
      graph[source] = {target => weight}
    else
      graph[source][target] = weight
    end
    nodes << source
  end

# connect each node bidirectional
  def add_edge(source, target, weight)
    connect_graph(source, target, weight) #directional graph
    connect_graph(target, source, weight) #non directed graph (inserts the other edge too)
  end


# based of wikipedia's pseudocode: http://en.wikipedia.org/wiki/Dijkstra's_algorithm


  def dijkstra(source)
    @distance={}
    @previous={}
    nodes.each do |node|#initialization
      @distance[node] = INFINITY #Unknown distance from source to vertex
      @previous[node] = -1 #Previous node in optimal path from source
    end

    @distance[source] = 0 #Distance from source to source

    queue = Set.new
    queue << source

    while !queue.empty?
      u = queue.min_by{|n| @distance[n]}

      if (@distance[u] == INFINITY)
        break
      end

      queue.delete(u)

      graph[u].keys.each do |vertex|
        alt = @distance[u] + graph[u][vertex]

        if (alt < @distance[vertex])
          @distance[vertex] = alt
          @previous[vertex] = u  #A shorter path to v has been found
          queue << vertex
        end

      end

    end

  end


# To find the full shortest route to a node

  def find_path(dest)
    if @previous[dest] != -1
      find_path @previous[dest]
    end
    @path ||= []
    @path << dest
  end


# Gets all shortests paths using dijkstra

  def all_shortest_paths(source)
    @graph_paths=[]
    @source = source
    dijkstra source
    nodes.each do |dest|
      @path=[]

      find_path dest

      actual_distance=if @distance[dest] != INFINITY
                        @distance[dest]
                      else
                        "no path"
                      end
      @graph_paths<< "Target(#{dest})  #{@path.join("-->")} : #{actual_distance}"
    end
    @graph_paths
  end

  def shortest_path(source, dest)
    @graph_paths=[]
    @source = source
    dijkstra source

    @path=[]

    find_path dest

    actual_distance=if @distance[dest] != INFINITY
                      @distance[dest]
                    else
                      "no path"
                    end
    @path
  end

  # print result

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

end

