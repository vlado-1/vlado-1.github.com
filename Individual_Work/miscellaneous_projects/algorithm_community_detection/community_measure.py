import networkx as nx

# Calculates the conductance score of a community
def calculateConductance(partition, graph):
    # max_conductance = 0

    # for group in partition:
    #     if (len(group) == 1 or len(group) == len(graph.nodes())):
    #         continue

    #     group_conductance = nx.conductance(graph, group)
    #     if group_conductance > max_conductance:
    #         max_conductance = group_conductance    
    
    # if (max_conductance == 0):
    #     return 1

    average_conductance = 0
    count = 0

    for group in partition:
        if (len(group) == 1 or len(group) == len(graph.nodes())):
            average_conductance += 1
            count += 1   
            continue

        average_conductance += nx.conductance(graph, group)
        count += 1

    return average_conductance/count