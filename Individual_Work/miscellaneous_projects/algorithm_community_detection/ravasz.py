import networkx as nx
import copy

def defineSimilarityMatrix(graph):

    similarityMatrix = {}

    def numCommonNeighbours(u, v):
        count = 0
        for adj1 in graph[u]:
            for adj2 in graph[v]:
                if adj1 == adj2:
                    count += 1
            if adj1 == v:
                count += 1

        return count

    def calculateEdgeSimilarity(u, v):
        j_uv = numCommonNeighbours(u,v)
        d_u = len(graph[u])
        d_v = len(graph[v])

        min_d = d_u
        if (d_v < d_u):
            min_d = d_v

        if (min_d == 0):
            retval = 0
        else:
            retval = j_uv/min_d
        return retval

    # Fill similarity matrix
    for u in graph.nodes:
        for v in graph.nodes:
            if u == v:
                similarityMatrix[(u,v)] = 0
                continue
            similarityMatrix[(u,v)] = calculateEdgeSimilarity(u,v)

    return similarityMatrix

def createGroups(vertices):

    groups = {}
    groupMatrix = {}

    # Create group
    label = 0
    for v in vertices:
        groups[label] = [v]
        label += 1

    # Create group similarity matrix
    for key1, value1 in groups.items():
        for key2, value2 in groups.items():
            groupMatrix[(key1, key2)] = 0

    return [groups, groupMatrix]

def calculateGroupSimilarity(groups, groupMatrix, simMatrix, option="average"):
    max_mode = False
    min_mode = False
    average_mode = False

    if (option == "average"):
        average_mode = True
    elif (option == "min"):
        min_mode = True
    elif (option == "max"):
        max_mode = True
    else:
        print("The option parameter was not properly specified. Should be either 'average','min' or'max'. Terminating.");
        return None

    if (average_mode):
        # For each group pair, calculate their similarity by calculating the average
        # of the similarity matrix scores between members of the two groups.
        for g1 in groups.keys():
            for g2 in groups.keys():
                if g1 != g2:
                    group1 = groups[g1]
                    group2 = groups[g2]

                    if (len(group1) == 0 or len(group2) == 0):
                        groupMatrix[(g1,g2)] = 0
                        continue


                    sumLinks = 0
                    numLinks = 0
                    for u in group1:
                        for v in group2:
                            sumLinks += simMatrix[(u,v)]
                            numLinks += 1

                    average = 0
                    if (numLinks != 0):
                        average = sumLinks/numLinks
                    groupMatrix[(g1,g2)] = average

    elif (min_mode):
        # For each group pair, calculate their similarity by calculating the minimum
        # of the similarity matrix scores between members of the two groups.
        for g1 in groups.keys():
            for g2 in groups.keys():
                if g1 != g2:
                    group1 = groups[g1]
                    group2 = groups[g2]

                    if (len(group1) == 0 or len(group2) == 0):
                        groupMatrix[(g1,g2)] = 0
                        continue

                    minimum = simMatrix[(group1[0], group2[0])]
                    for u in group1:
                        for v in group2:
                            newLink = simMatrix[(u,v)]

                            if (newLink < minimum):
                                minimum = newLink

                    groupMatrix[(g1,g2)] = minimum

    elif (max_mode):
        # For each group pair, calculate their similarity by calculating the maximum
        # of the similarity matrix scores between members of the two groups.
        for g1 in groups.keys():
            for g2 in groups.keys():
                if g1 != g2:
                    group1 = groups[g1]
                    group2 = groups[g2]

                    if (len(group1) == 0 or len(group2) == 0):
                        groupMatrix[(g1,g2)] = 0
                        continue

                    maximum = 0
                    for u in group1:
                        for v in group2:
                            newLink = simMatrix[(u,v)]

                            if (newLink > maximum):
                                maximum = newLink

                    groupMatrix[(g1,g2)] = maximum

def mergeGroups(groups, groupMatrix, similarityMatrix, option="average"):

    calculateGroupSimilarity(groups, groupMatrix, similarityMatrix, option)

    # Calculate greatest similarity value amongst groups
    highestSimilarity = 0
    for g1 in groups.keys():
        for g2 in groups.keys():
            if g1 != g2:
                similarity = groupMatrix[(g1,g2)]
                if similarity > highestSimilarity:
                    highestSimilarity = similarity

    # Merge the most similar pairs
    mergeDone = False
    for g1 in groups.keys():
        for g2 in groups.keys():
            if g1 != g2:
                similarity = groupMatrix[(g1,g2)]

                if similarity == highestSimilarity:
                    if mergeDone == True:
                        return
#                    print("Highest: " + str(highestSimilarity) + " Similarity: " + str(similarity))
#                    print("Merge " + str(g1) + " and " + str(g2))

                    group1 = groups[g1]
                    group2 = groups[g2]

                    group1.extend(group2)

                    while len(groups[g2]) > 0:
                        groups[g2].pop(-1)

                    mergeDone = True

def ravaszMethod(graph, option="average", partition=False):
        similarityMatrix = defineSimilarityMatrix(graph)

        result = createGroups(graph.nodes())
        grps = result[0]
        grpsMatrix = result[1]

        partitions = []

        # Keep iterating until the clustering no longer changes
        hasChanged = False
        while not hasChanged:
            grps_cpy = copy.deepcopy(grps)
            mergeGroups(grps, grpsMatrix, similarityMatrix, option)

            if partition==True:
                community = []
                for group in grps.values():
                    if len(group) > 0:
                        community.append(group)
                partitions.append(copy.deepcopy(community))

            noChangeCount = 0
            for label in grps.keys():
                sz1 = len(grps_cpy[label])
                sz2 = len(grps[label])
                if (sz1 != sz2):
                    hasChanged = False
                    break
                else:
                    noChangeCount += 1

            if (noChangeCount == len(grps)):
                hasChanged = True
        return partitions