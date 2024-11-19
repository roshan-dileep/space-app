import numpy as np

def confidence_calc(logprobs):
    prob_beforeavg = []

    # Loop through each logprob
    for logprob in logprobs:
        prob_beforeavg.append(np.exp(logprob))  # Add the exponentiated logprob to the list

    # Calculate average probability
    avg_probs = sum(prob_beforeavg) / len(prob_beforeavg) if prob_beforeavg else 0

    return avg_probs
