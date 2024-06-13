import os
import datetime
import matplotlib.pyplot as plt
import sys

# py plotter.py $valid_openfga_result_file_path $invalid_openfga_result_file_path $no_openfga_result_file_path

if __name__ == "__main__":
    
    ### Experiment constants
    experiment_time = 5  # in seconds
    clients_amount = 10
    
    ### Reading from the file
    exp_data = []
    for i in range(3):
        with open(sys.argv[i+1], 'rb') as f:
            results = []
            lines = f.readlines()
            for line in lines:
                results.append(int(line.split()[0]))
        exp_data.append(results)

    ### Plot drawing
    fig, axes = plt.subplots(1, 1)    
    ax = axes
    title = f"Number of handled requests in\n{experiment_time}s period from {clients_amount} clients in 10 tests"
    agent_labels = ["Valid OpenFGA", "Invalid OpenFGA", "No OpenFGA"]
    ax.boxplot(
        exp_data,
        labels=agent_labels
        )
    ax.set_title(title)

    ### Plot saving
    if not os.path.exists("./graphs"):
        os.makedirs("./graphs")
    now = datetime.datetime.now()
    current_date = (
        f"{now.year}_{now.month}_{now.day}_{now.hour}_{now.minute}_{now.second}"
    )
    # plt.subplots_adjust(left=0.2,
    #                 bottom=0.05, 
    #                 right=0.8, 
    #                 top=0.95, 
    #                 wspace=0.4, 
    #                 hspace=0.4)
    # fig.set_size_inches(3, 4)
    fig.savefig(f"./graphs/compilation_graph_{current_date}.png", dpi=100)