"""Fit y = weight * x + bias using gradient descent. Standard library only."""

import argparse
import math


def positive_float(value):
    number = float(value)
    if not math.isfinite(number) or number <= 0:
        raise argparse.ArgumentTypeError("Use a finite number greater than zero.")
    return number


def positive_int(value):
    number = int(value)
    if number <= 0:
        raise argparse.ArgumentTypeError("Use a whole number greater than zero.")
    return number


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--learning-rate", type=positive_float, default=0.1)
    parser.add_argument("--steps", type=positive_int, default=100)
    args = parser.parse_args()

    # Synthetic data with an exact relationship. This illustrates optimisation,
    # not performance on real data or a held-out test.
    samples = [(x, 2 * x + 1) for x in (-2, -1, 0, 1, 2)]
    weight, bias = 0.0, 0.0
    print("Synthetic data: y = 2x + 1")
    print("step   weight     bias       mean squared error")
    for step in range(args.steps + 1):
        errors = [weight * x + bias - y for x, y in samples]
        # Multiplication yields inf on overflow; detect it before the next update.
        loss = sum(error * error for error in errors) / len(samples)
        if not math.isfinite(loss):
            raise SystemExit("Loss diverged. Try a smaller --learning-rate.")
        if step in (0, 1, 10, args.steps):
            print(f"{step:4d}   {weight:8.4f}   {bias:8.4f}   {loss:.6f}")
        if step == args.steps:
            break
        weight_gradient = 2 * sum(
            error * x for error, (x, _) in zip(errors, samples)
        ) / len(samples)
        bias_gradient = 2 * sum(errors) / len(samples)
        weight -= args.learning_rate * weight_gradient
        bias -= args.learning_rate * bias_gradient
    print(f"Prediction at x=3: {weight * 3 + bias:.4f}")
    print("This is a toy fit; it does not measure real-world prediction quality.")


if __name__ == "__main__":
    main()
