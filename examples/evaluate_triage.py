"""Compare urgency thresholds on fictional, hand-authored support scores."""

import argparse
import math


# (ticket ID, reviewer label, invented model score)
# Scores are illustrative ranking values, not calibrated probabilities.
TICKETS = [
    ("T01", True, 0.97), ("T02", True, 0.91), ("T03", True, 0.84),
    ("T04", True, 0.72), ("T05", True, 0.55), ("T06", True, 0.22),
    ("T07", False, 0.67), ("T08", False, 0.51), ("T09", False, 0.42),
    ("T10", False, 0.30), ("T11", False, 0.18), ("T12", False, 0.06),
]


def threshold_value(value):
    number = float(value)
    if not math.isfinite(number) or not 0 <= number <= 1:
        raise argparse.ArgumentTypeError("Use a finite threshold between 0 and 1.")
    return number


def evaluate(threshold):
    counts = {"tp": 0, "fp": 0, "fn": 0, "tn": 0}
    for _, urgent, score in TICKETS:
        predicted_urgent = score >= threshold
        if urgent:
            counts["tp" if predicted_urgent else "fn"] += 1
        else:
            counts["fp" if predicted_urgent else "tn"] += 1
    return counts


def percentage(numerator, denominator):
    return f"{100 * numerator / denominator:.1f}%" if denominator else "n/a"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--threshold", type=threshold_value)
    args = parser.parse_args()
    thresholds = [args.threshold] if args.threshold is not None else [0.5, 0.8]
    print("12 fictional tickets; 6 urgent, 6 routine. No model has been trained.")
    for threshold in thresholds:
        c = evaluate(threshold)
        print(f"\nThreshold: {threshold:.2f}")
        print(f"TP={c['tp']} FP={c['fp']} FN={c['fn']} TN={c['tn']}")
        print("Precision:", percentage(c["tp"], c["tp"] + c["fp"]))
        print("Recall:   ", percentage(c["tp"], c["tp"] + c["fn"]))
        print("Accuracy: ", percentage(c["tp"] + c["tn"], len(TICKETS)))
        print(f"Illustrative error cost (10 x FN + FP): {10 * c['fn'] + c['fp']}")
    print("\nChoose thresholds on validation data, then assess a separate test set.")


if __name__ == "__main__":
    main()
