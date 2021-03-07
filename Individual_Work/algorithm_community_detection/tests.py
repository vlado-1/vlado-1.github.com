import matplotlib.pyplot as plt
import time as t
import copy
import networkx as nx
from girvan_newman import my_girvan_newman, girvan_newman, create_traffic_graph
from ravasz import ravaszMethod
from networkx.algorithms import community
from memory_profiler import memory_usage
from community_measure import calculateConductance

def generateInputSizes(startSize, maxSize, gap):
    # Clear old input sizes
    input_size = []
    # Assign new input sizes
    i = startSize
    while i < maxSize:
        input_size.append(i)
        i += gap

    return input_size

def plotQuality(maxInputSize, gap):
    best_quality_scores_mygn = []
    best_quality_scores_rvsz = []
    expected_quality_score = []    
    input_size = generateInputSizes(81, maxInputSize, gap)

    for n in input_size:
        tau1 = 3
        tau2 = 1.5
        mu = 0.4
        g1 = nx.algorithms.community.LFR_benchmark_graph(n, tau1, tau2, mu, average_degree=4, min_community=8, seed=10)
        print("Created LFR graph of size: " + str(n))

        g2 = copy.deepcopy(g1)

        partitions = my_girvan_newman(g2, partition=True)
        scores = []
        for p in partitions:
            scores.append(calculateConductance(p, g1))
        
        best_quality_scores_mygn.append(min(scores))

        partitions = ravaszMethod(g1, partition=True)
        scores = []
        for p in partitions:
            scores.append(calculateConductance(p, g1))
        
        best_quality_scores_rvsz.append(min(scores))

        communities = {frozenset(g1.nodes[v]['community']) for v in g1}
        partition = []
        for group in communities:
            partition.append(list(group))

        expected_quality_score.append(calculateConductance(partition, g1))
        print("(Quality) Complete for input size: " + str(n), end="\r")

    plt.plot(input_size, best_quality_scores_mygn, "b-", label="Girvan Newman (My Implementation)")
    plt.plot(input_size, best_quality_scores_rvsz, "r-", label="Ravasz Method (My Implementation)")
    plt.plot(input_size, expected_quality_score, "y-", label="Expected Conductance")
    plt.xlabel("Input Size")
    plt.ylabel("Average Conductance in Community")
    plt.legend()

    plt.show()
    return

def plotSpace(maxInputSize, gap):
    space_ravasz = []
    space_my_girvan_newman = []
    space_nx_girvan_newman = []
    input_size = generateInputSizes(4, maxInputSize, gap)

    
    for n in input_size:
        g1 = nx.connected_watts_strogatz_graph(n,3, 0.5)
        g2 = copy.deepcopy(g1)
        g3 = copy.deepcopy(g1)

        args = [g1]
        memory_over_time = memory_usage((ravaszMethod, args), interval=0.1)
        space_ravasz.append(max(memory_over_time))

        args = [g2]
        memory_over_times = memory_usage((my_girvan_newman, args), interval=0.1)
        space_my_girvan_newman.append(max(memory_over_times))

        args = [g3]
        memory_over_times = memory_usage((girvan_newman, args), interval=0.1)
        space_nx_girvan_newman.append(max(memory_over_times))
        
        print("(Space) Complete for input size: " + str(n), end="\r")
    
    # Create plot of times
    fig, axs = plt.subplots(3, 1)

    for ax in axs.flat:
        ax.set(xlabel="",ylabel='Space (MB)')
    axs.flat[2].set(xlabel='Input Size (number of nodes)')

    axs[0].tick_params(axis='x', which='both', bottom=False, top=False, labelbottom=False)
    axs[1].tick_params(axis='x', which='both', bottom=False, top=False, labelbottom=False)


    # Plot just girvan newman
    axs[0].plot(input_size, space_my_girvan_newman, "b-", label="Girvan-Newman Method (My Implementation)")
    axs[0].plot(input_size, space_nx_girvan_newman, "y-", label="Girvan-Newman Method (NetworkX)")
    axs[0].set_title('Space Consumption')
    axs[0].legend()

    # Plot just Ravasz
    axs[1].plot(input_size, space_ravasz, "r-", label="Ravasz Algorithm (My Implementation)")
    axs[1].legend()

    # Plot Girvan Newman against Ravasz
    axs[2].plot(input_size, space_ravasz, "r-", label="Ravasz Algorithm (My Implementation)")
    axs[2].plot(input_size, space_my_girvan_newman, "b-", label="Girvan Newman (My Implementation)")
    axs[2].legend()
    
    plt.show()

def plotTime(maxInputSize, gap):
    time_girvan_newman = []
    time_girvan_newman_networkx = []
    time_girvan_newman_upper_bound = []
    time_ravasz_av = []
    time_ravasz_upper_bound = []
    input_size = generateInputSizes(4, maxInputSize, gap)
    
    for n in input_size:
        g1 = nx.complete_graph(n)#connected_watts_strogatz_graph(n,3, 0.5)
        g2 = copy.deepcopy(g1)
        g3 = copy.deepcopy(g1)
        numEdges = len(g1.edges())

        # My Implementation of Girvan Newman
        start = t.time()
        my_girvan_newman(g1)
        end = t.time()
        time_girvan_newman.append(end-start)

        # NetworkX Girvan Newman
        start = t.time()
        girvan_newman(g2)
        end = t.time()
        time_girvan_newman_networkx.append(end - start)

        # Ravasz
        start = t.time()
        ravaszMethod(g3)
        end = t.time()
        time_ravasz_av.append(end-start)

        # Upper Bounds
        time_girvan_newman_upper_bound.append((1/500000)*((numEdges)**2)*n)
        time_ravasz_upper_bound.append((1/500000)*(n)**3)

        print("(TIME) Complete for input size: " + str(n), end="\r")
    # Create plot of times
    fig, axs = plt.subplots(3, 1)    
    for ax in axs.flat:
        ax.set(xlabel="",ylabel='Time (Sec)')
    axs.flat[2].set(xlabel='Input Size (number of nodes)')

    axs[0].tick_params(axis='x', which='both', bottom=False, top=False, labelbottom=False)
    axs[1].tick_params(axis='x', which='both', bottom=False, top=False, labelbottom=False)
    
    # Plot just girvan newman
    axs[0].plot(input_size, time_girvan_newman, "b-", label="Girvan-Newman Method (My Implementation)")
    axs[0].plot(input_size, time_girvan_newman_networkx, "y-", label="Girvan-Newman Method (NetworkX)")
    axs[0].plot(input_size, time_girvan_newman_upper_bound, "g-", label="Girvan-Newman Method (Bound)")
    axs[0].set_title('Running Time')
    axs[0].legend()

    # Plot just Ravasz
    axs[1].plot(input_size, time_ravasz_av, "r-", label="Ravasz Average Algorithm (My Implementation)")
    axs[1].plot(input_size, time_ravasz_upper_bound, "g-", label="Ravasz Algorithm (Upper Bound)")
    axs[1].legend()

    # Plot Girvan Newman against Ravasz
    axs[2].plot(input_size, time_ravasz_av, "r-", label="Ravasz Algorithm (My Implementation)")
    axs[2].plot(input_size, time_girvan_newman, "b-", label="Girvan Newman (My Implementation)")
    axs[2].plot(input_size, time_girvan_newman_networkx, "y-", label="Girvan-Newman Method (NetworkX)")
    axs[2].legend()
    
    plt.show()

def main():
    plotSpace(300, 25) # Make sure gaps are large when using it
    plotTime(30,1)
    plotQuality(90,1)

if __name__ == "__main__":
    main()