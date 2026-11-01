# Small Python experiments

[Learning hub](../README.md) · [AI primer](../docs/ai-primer.md)

These examples run with **Python 3.10+ and the standard library**. They use fictional or synthetic data, need no network or API key, and do not install anything. Run commands from the repository root. On Windows, substitute `py -3` for `python3` if needed.

## Fit a line

```bash
python3 examples/linear_regression.py
python3 examples/linear_regression.py --learning-rate 0.02 --steps 100
```

The default run starts with mean squared error 9, learns weight approximately 2 and bias approximately 1, and prints a prediction of 7.0000 at `x=3`. The smaller learning rate approaches the same solution more slowly.

**Exercise:** try `--learning-rate 0.6`. Why does the loss increase? Read [learning from error](../docs/ai-primer.md#learning-from-error). The toy relationship is exact; this script demonstrates optimisation rather than held-out model evaluation.

## Retrieve evidence

```bash
python3 examples/document_search.py "How do I reset my password?"
python3 examples/document_search.py "volcano"
python3 examples/document_search.py "recover credentials"
```

The first query returns the fictional `password-reset` passage with two shared keywords. The other two return “No matching evidence.” The last query illustrates a limitation: its meaning is related to the password task, but its words do not match.

**Exercise:** add a fictional document and a question that should retrieve it. Then add an unrelated question containing one shared word. Observe why a search score is not an answer-quality score.

This is a lexical baseline with simple English tokenisation. It has no embeddings, LLM, access control, or document ingestion service. The [document assistant design](../docs/projects/document-assistant.md) explains those next steps.

## Compare triage decisions

```bash
python3 examples/evaluate_triage.py
python3 examples/evaluate_triage.py --threshold 0.2
```

The default run prints:

| Threshold | True positives | False positives | False negatives | True negatives | Precision | Recall |
| --- | --- | --- | --- | --- | --- | --- |
| 0.50 | 5 | 2 | 1 | 4 | 71.4% | 83.3% |
| 0.80 | 3 | 0 | 3 | 6 | 100.0% | 50.0% |

**Exercise:** compare thresholds of 0, 0.2, and 1. Which urgent tickets are missed? What happens to precision when nothing is flagged? The script prints `n/a` for a metric with a zero denominator.

The scores are hand-authored, not outputs from a trained model or calibrated probabilities. The illustrative error cost weights a missed urgent ticket ten times as much as a false alarm; it is not a financial estimate. See the [support triage project](../docs/projects/support-triage.md).
