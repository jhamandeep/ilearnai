# Review questions

[Learning hub](../README.md) · [AI primer](ai-primer.md)

Answer aloud or write a sentence before opening each answer. Give an example from your own work when possible.

<details>
<summary>1. What is the difference between a model and an AI application?</summary>

A model transforms inputs into outputs. An application also manages sources, permissions, the interface, evaluation, workflow, and failures. A useful model is one part of a useful service.

[Revisit the explanation](ai-primer.md#what-ai-actually-does).
</details>

<details>
<summary>2. When is a fixed rule a better starting point?</summary>

When the task has an explicit, stable rule that is straightforward to implement and check. For example, validating a required form field does not need a language model. Compare a model with that baseline when the task involves patterns or ambiguity.

[Revisit the explanation](ai-primer.md#what-ai-actually-does).
</details>

<details>
<summary>3. Why is time to resolution a risky feature for predicting urgency on arrival?</summary>

It is not available at the time of the prediction. Including it can leak future information and inflate evaluation results.

[Revisit data and labels](ai-primer.md#data-features-and-labels).
</details>

<details>
<summary>4. Why have validation data as well as a final test?</summary>

Validation data guides choices such as model settings and thresholds. The final test provides a more independent check after those choices. Repeatedly tuning against the final test reduces that independence.

[Revisit evaluation](ai-primer.md#training-and-evaluation).
</details>

<details>
<summary>5. Does a lower training loss prove that the model is better?</summary>

It shows a better fit to the training objective on those examples. Check unseen data and task-level measures before concluding that the model is more useful.

[Run the gradient experiment](../examples/README.md#fit-a-line).
</details>

<details>
<summary>6. Why can a larger learning rate make learning worse?</summary>

A step may move past a useful region and increase the loss. Repeating oversized steps can make optimisation unstable.

[Revisit the worked gradient step](ai-primer.md#learning-from-error).
</details>

<details>
<summary>7. Is a token always a word?</summary>

No. A tokenizer may split text into subwords, characters, punctuation, or other units. The same text can have different token counts under different tokenizers.

[Revisit tokens](ai-primer.md#tokens-and-attention).
</details>

<details>
<summary>8. When should I investigate retrieval before fine-tuning?</summary>

When answers depend on an authoritative document collection, especially one that changes. Retrieval can supply the relevant source at request time. Fine-tuning may help repeated behaviour, but it does not replace source freshness and evidence checks.

[Compare the approaches](ai-primer.md#prompting-retrieval-and-fine-tuning).
</details>

<details>
<summary>9. Does attaching a citation prove an answer is supported?</summary>

No. Check that the cited passage exists, is applicable, and actually supports the claim. A correct-looking link can accompany an unsupported statement.

[Review the document assistant tests](projects/document-assistant.md#4-build-an-evaluation-set).
</details>

<details>
<summary>10. Why can two thresholds have equal accuracy but very different usefulness?</summary>

They can make different kinds of errors. One may create extra review; another may miss urgent cases. The confusion matrix and workflow costs reveal what the aggregate accuracy hides.

[Compare the triage thresholds](projects/support-triage.md#4-compare-two-thresholds).
</details>

<details>
<summary>11. A model's weights fit in memory. What else must you estimate?</summary>

Caches, activations, runtime workspaces, and overhead, followed by measurements of latency and throughput for realistic inputs, outputs, and concurrency.

[Work through the capacity estimate](infrastructure.md#worked-capacity-estimate).
</details>

<details>
<summary>12. What makes a pilot result useful even when it fails?</summary>

A bounded comparison can show that the sources are unsuitable, corrections erase the time saving, or the current process performs better. Documenting that result helps choose the next experiment or avoid an unhelpful rollout.

[Write a pilot brief](ai-at-work.md#copy-this-pilot-brief).
</details>
