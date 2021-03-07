import networkx as nx
import copy

def layer_BFS(graph, v_start):

    # Label all nodes except v_start as undiscovered
        labels = ["undiscovered"]
        nx.set_node_attributes(graph, labels, "status")
        vertices = graph.nodes(data=True)
        vertices[v_start]["status"] = "discovered"

        # Add v_start to the first layer
        layers = {0: [v_start]}

        # Prepare BFS queue
        queue = []
        queue.append(v_start)
        next_queue = []

        numDiscovered = 1
        layer_cnt = 1
        layers[layer_cnt] = []

        while len(queue) > 0:
            v = queue.pop(0)

            for u in graph[v]:
                if vertices[u]["status"] != "discovered":

                    vertices[u]["status"] = "discovered"
                    numDiscovered += 1

                    layers[layer_cnt].append(u)

                    next_queue.append(u)

            if (len(queue) == 0):
                queue = next_queue
                next_queue = []
                if len(layers[layer_cnt]) != 0:
                    layer_cnt += 1
                    layers[layer_cnt] = []

        if (len(layers[layer_cnt]) == 0):
            del layers[layer_cnt]

        return [layer_cnt, layers]

def betweeness_single_vertex(graph, v_start):
        result = layer_BFS(graph, v_start)
        numLayers = result[0]
        layers = result[1]

        # Create a dictionary to record the number of shortest paths from
        # each vertex to v_start
        numShortestPaths = {}

        # Initialize the dictionary
        for v in graph.nodes:
            numShortestPaths[v] = 0

        # Count the number of shortest paths from each vertex to v_start
        for i in range(numLayers):
            if (i >= 1):
                for v in layers[i]:
                    for u in graph[v]:
                        if u in layers[i-1]:
                            if (i > 1):
                                numShortestPaths[v] += numShortestPaths[u]
                            else:
                                numShortestPaths[v] += 1

        # Determine the flow along the edges from each vertex
        for i in range(numLayers):
                bottom = numLayers - 1 - i
                for v in layers[bottom]:

                    numPassing = 0

                    for u in graph[v]:
                        if bottom < numLayers - 1 and u in layers[bottom+1]:
                            numPassing += graph.edges[(v,u)]["flow"]

                    for u in graph[v]:
                        if bottom > 1 and u in layers[bottom-1]:
                            graph.edges[(v,u)]["flow"] += (numShortestPaths[u]/numShortestPaths[v])*(1+numPassing)
                        elif bottom == 1 and u in layers[bottom - 1]:
                            graph.edges[(v,u)]["flow"] += 1 + numPassing


# Girvan Newman Method Implementation
def betweeness_method(graph):

    for i in graph.edges():
        graph.edges[i]['flow'] = 0

    edge_flow_mapping = {}
    for e in graph.edges():
        edge_flow_mapping[e] = graph.edges[e]['flow']

    for n in graph.nodes:
        betweeness_single_vertex(graph, n)

        for e in edge_flow_mapping.keys():
            edge_flow_mapping[e] += graph.edges[e]['flow']
            graph.edges[e]['flow'] = 0

    # Halve the flows as one has double-counted them
    for e in edge_flow_mapping.keys():
            edge_flow_mapping[e] = edge_flow_mapping[e]*(0.5)


    return edge_flow_mapping

# Helper for Girven_Newman method
def getHighestBetweeness(flow_values):
    max = 0
    for value in flow_values:
        if (value > max):
            max = value
    return max

# (My Own) Girvan-Newman Algorithm
def my_girvan_newman(g, partition = False):
    
    partitions = []

    while g.number_of_edges() > 0:

        # Determine betweeness values
        edge_btwness_mapping = betweeness_method(g)
        max = getHighestBetweeness(edge_btwness_mapping.values())

        # Remove edges with the highest betweeness
        toRemove = []
        for e in g.edges():
            if edge_btwness_mapping[e] == max:
                toRemove.append(e)
                break

        for e in toRemove:
            g.remove_edge(e[0], e[1])

        if (partition == True):
            community_gen = nx.connected_components(g)
            community = []
            for group in community_gen:
                community.append(copy.deepcopy(group))
            partitions.append(community)

    return partitions
        # Print remaining edges every iteration
        #print(g.edges())

# (Original) Girvan-Newman Algorithm
def girvan_newman(g, partition=False):
    
    partitions = []

    while g.number_of_edges() > 0:

        # Determine betweeness values
        edge_btwness_mapping = nx.edge_betweenness_centrality(g)
        max = getHighestBetweeness(edge_btwness_mapping.values())

        # Remove node with the highest betweeness
        toRemove = []
        for e in g.edges():
            if edge_btwness_mapping[e] == max:
                toRemove.append(e)
                break

        for e in toRemove:
            g.remove_edge(e[0], e[1])

        if (partition == True):
            community_gen = nx.connected_components(g)
            community = []
            for group in community_gen:
                community.append(copy.deepcopy(group))
            partitions.append(community)
    
    
    return partitions
        # Print remaining edges every iteration
        #print(g.edges())


def create_traffic_graph():
    # Create the graph
    g = nx.Graph()
    g.add_node("Dean Park")
    g.add_node("Eastern Creek")
    g.add_node("Prestons")
    g.add_node("Airport")
    g.add_node("Strathfield")
    g.add_node("North Sydney")

    g.add_path(["Dean Park", "Eastern Creek", "Prestons", "Airport", "North Sydney"])
    g.add_edge("Dean Park", "North Sydney")
    g.add_edge("Eastern Creek", "Strathfield")

    g.add_edge("Strathfield", "Airport") # West Connex
    return g
