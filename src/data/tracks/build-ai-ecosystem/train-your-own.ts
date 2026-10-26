import type { Module } from '../../types'

export const mod: Module = {
  slug: 'train-your-own',
  title: 'Train and fine-tune your own model',
  description: 'Decide when training beats a prompt or retrieval, build a 200-example dataset, fine-tune a small open model with LoRA on a free GPU, then measure the gain and serve the result.',
  level: 'beginner',
  lessons: [
    {
      slug: 'when-to-fine-tune',
      title: 'When to fine-tune, prompt or retrieve',
      summary: 'After this lesson you can look at a task, pick a prompt, retrieval or fine-tuning with a decision table, and estimate what each costs.',
      minutes: 22,
      objectives: [
        'Explain the difference between a prompt, retrieval and fine-tuning with one analogy.',
        'Choose the right method for a task with the decision table, and say why.',
        'Compute the monthly cost of a task on a hosted model and on a fine-tuned small model.',
        'State what fine-tuning cannot do, and what you must measure before you train.',
      ],
      keyTerms: ['fine-tuning', 'in-context learning', 'supervised fine-tuning', 'base model', 'instruct model', 'cost per request'],
      links: [
        { label: 'Fine-tuning (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Fine-tuning_(deep_learning)', kind: 'article' },
        { label: 'Retrieval-augmented generation paper', url: 'https://arxiv.org/abs/2005.11401', kind: 'paper' },
        { label: 'LoRA paper', url: 'https://arxiv.org/abs/2106.09685', kind: 'paper' },
        { label: 'Hugging Face: fine-tune a pretrained model', url: 'https://huggingface.co/docs/transformers/training', kind: 'docs' },
      ],
      body: `
## What this lesson covers

There are three ways to change what a model does. You can write a better prompt. You can retrieve your documents into the prompt. You can fine-tune the model, which changes the numbers inside it. This lesson gives you a decision table that picks one of the three for a task. At the end you can look at a request to the aiworkshop service, say which method it needs, and estimate the monthly cost.

## Why it matters

The aiworkshop service already uses two of the three methods. The chat module uses prompts. The retrieval module puts your documents into the prompt. This module adds the third method, training. Training is the most expensive of the three and the easiest to misuse. People fine-tune to teach a model facts, and the model still invents answers. People fine-tune when a two-line prompt would do the job. The decision in this lesson protects you from both. The next lesson, [Build a dataset](/courses/build-ai-ecosystem/train-your-own/build-a-dataset), starts the work once the decision says train.

:::video
id: 00Q0G84kq3M
why: Watch all 8 minutes. The video compares retrieval and fine-tuning with the same questions this lesson asks: do the facts change, and is the problem the facts or the form of the answer?
:::

## The idea with an example

> **Analogy.** A new employee joins a support team. You have three ways to get good replies from them. You can give instructions on a sticky note: that is a prompt. You can hand them the policy binder to look things up: that is retrieval. You can send them on a two-week course until the house style is a habit: that is fine-tuning. The sticky note is cheapest, and you change it in a minute. The binder keeps them correct when the policy changes. The course changes how they write, but it does not update when the binder does.

Here are the three methods in plain words. A prompt is the text you send with each request: the instructions, the examples and the format you want. The model learns the task from the text in its context window and forgets it after the reply. This is in-context learning. Retrieval searches your documents for each request and pastes the best chunks into the prompt. You built it in [Why models need your documents](/courses/build-ai-ecosystem/retrieval-rag/why-rag). Fine-tuning continues training on your own examples. The weights, the numbers inside the model, change. After training the behaviour lives in the model, and you need no examples in the prompt.

Two words about models. A base model is a model straight out of pretraining. It completes text but does not follow instructions well. An instruct model is a base model that someone already fine-tuned on conversations, so it answers questions. You will fine-tune an instruct model, Qwen2.5-0.5B-Instruct, which has 494 million parameters. The training method is supervised fine-tuning: you show the model a prompt and the exact reply you want, many times.

Here is the running example for this module. The aiworkshop service gets three kinds of request.

1. "What is the refund period?" The answer is a fact in your policy documents. The fact can change next month.
2. "Reply to Priya. Her order arrived 12 days ago and she wants a return." The reply must follow the aiworkshop house style.
3. "Give me the order as JSON with the fields id, status and total." The reply must have a fixed shape.

The house style has 4 rules, and this module uses them in every lesson. Rule 1: the first line is "Hi" plus the customer name and a comma, or "Hi there," when there is no name. Rule 2: the whole reply has at most 60 words. Rule 3: exactly one line starts with "Next step:". Rule 4: the last line is exactly "aiworkshop support". Here is a reply that passes all four:

:::code
lang: text
Hi Priya,
Yes. Your order arrived 12 days ago, which is inside the 30-day refund window.
Next step: reply with your order number and we will send a return label.
aiworkshop support
:::

Now the measurements that drive the decision. In the last lesson of this module you test each method on 40 customer messages that the model never trained on. The small model with the 4 rules in its prompt passes all four rules on 19 of the 40 messages, which is 48 percent. The same small model after fine-tuning passes on 34 of 40, which is 85 percent. A large hosted model with the rules in its prompt passes on 39 of 40. So a prompt on a large model works. Why fine-tune at all? The answer is cost and control, and you compute it next.

Suppose the service sends 10,000 replies a day. The prompt with the rules and 3 examples is 600 input tokens, and a reply is 80 output tokens. Use the prices from the cost-control lesson: the Sonnet model costs USD 3 per million input tokens and USD 15 per million output tokens. One reply costs 600 divided by 1,000,000 times 3, which is USD 0.0018, plus 80 divided by 1,000,000 times 15, which is USD 0.0012. The total is USD 0.0030. Times 10,000 a day times 30 days is USD 900 a month. The Haiku model, at USD 1 and USD 5 per million, costs USD 0.0010 per reply, or USD 300 a month. The fine-tuned 0.5B model runs on a machine you rent for about USD 15 a month, with no cost per request.

:::bars
title: Monthly cost of 10,000 replies a day
unit: USD
Sonnet with prompt: 900
Haiku with prompt: 300
Fine-tuned 0.5B model: 15
:::

The small model is slower, about 3 seconds per reply on a machine without a graphics processing unit (GPU). It also knows far fewer facts. Those are the trade-offs. The decision is a flow, and you always start at the same place: the prompt.

:::flow
title: The decision path for one task
Task -> Prompt: write rules and 3 examples
Prompt -> Measure: test on 40 held-out messages
Measure -> Retrieval: failures are wrong or missing facts
Measure -> Fine-tune: failures are style, or cost is too high
Measure -> Done: pass rate is high and cost is fine
:::

Press Next to run the three requests through the path.

:::scenario
title: Three requests, three decisions
state: request=1 refund period, method=prompt, pass=unknown
step: Request 1 asks for the refund period. With a prompt alone the model guesses 14 days. The real policy says 30. The failure is a missing fact.
state: pass=fails on facts
step: Facts that change belong in documents, not in weights. The decision is retrieval. The /ask endpoint already does this.
state: method=retrieval, pass=36 of 40 facts correct
step: Request 2 asks for a reply in house style. With the rules in the prompt the small model passes 19 of 40. The failures are a missing sign-off and replies of 90 words.
state: request=2 house style, method=prompt, pass=19 of 40
step: The failures are style, not facts, and the volume is 10,000 a day. The decision is fine-tune. After training the pass rate is 34 of 40.
state: method=fine-tune, pass=34 of 40
step: Request 3 asks for JSON with three fields. The structured-output prompt from the chat module passes 40 of 40. Stop at the prompt.
state: request=3 JSON, method=prompt, pass=40 of 40
:::

## How it works

The procedure is the same for every task. Follow the steps in order, and do not skip the measurement.

:::anim
title: One task walks the decision path
box task "Style reply" @ 180,150 icon: reply
box prompt "Prompt: 4 rules" @ 480,150 icon: prompt
box measure "Measure on 40" @ 480,290 icon: eval
box retr "Retrieval" @ 180,430 icon: database
box ft "Fine-tune" @ 480,430 icon: train
box done "Done" @ 780,430 icon: check
num pass = 0 @ 780,150 prefix: "pass " suffix: " of 40" size: 28 color: yellow
text vol "10,000 replies a day" @ 780,205 size: 16 color: grey
num cost = 900 @ 780,290 prefix: "USD " suffix: " a month" size: 24 color: orange
text fails "Failures: 90-word replies,|no sign-off. Style, not facts." @ 180,290 size: 16 color: grey

step: The task is a reply in the house style. Start with a prompt: the 4 rules and 3 examples.
  show task, prompt
  arrow task -> prompt : "rules + 3 examples"
step: Test the prompt on 40 held-out messages. The small model passes 19 of 40.
  show measure, pass
  arrow prompt -> measure : "40 messages"
  & count pass -> 19
step: Sort the failures. Replies of 90 words and a missing sign-off are style failures, not fact failures.
  show fails
  pulse fails
step: A wrong or missing fact would point to retrieval. These failures do not, so retrieval stays dim.
  show retr
  arrow measure -> retr : "wrong facts"
  dim retr
step: Style failures at 10,000 replies a day point to fine-tuning.
  show vol, ft
  arrow measure -> ft : "style failures"
step: After training on 200 examples the same 40 messages go in again. Now 34 of 40 pass.
  arrow ft -> measure : "tuned model"
  & count pass -> 34
  highlight ft
step: The pass rate is 85 percent and the bill falls from USD 900 to USD 15 a month.
  show cost
  count cost -> 15 (2s)
  show done
  arrow measure -> done : "85 percent"
:::

1. Write the task as input and output. Write one real input and the exact output you want.
2. Write 40 test inputs with the outputs you want before you try anything. This is your held-out set, the same idea as the test split in [Measuring error and splitting data](/courses/ai-foundations/first-models/measuring-error).
3. Try a prompt on a capable model. Put the rules and 3 examples in the system prompt. Measure the pass rate on the 40.
4. Sort the failures. A wrong or missing fact points to retrieval. A wrong form, tone, length or language points to more examples in the prompt, then to fine-tuning. A good pass rate at a price you cannot pay points to a smaller model plus fine-tuning.
5. Fine-tune only when you can write the target as a number, such as "85 percent of the 40 pass all four rules".

The table is the decision in one place.

| Need | Prompt | Retrieval | Fine-tuning |
| --- | --- | --- | --- |
| Facts the model does not know | Paste them in, if they fit | Yes, the right tool | No, facts do not stick reliably |
| Facts that change often | Edit the prompt each time | Yes, update the documents | No, you would retrain each time |
| A fixed style, format or tone | First try, with examples | No | Yes, when the prompt is not enough |
| Many rules at once | Works on large models | No | Yes, on small models |
| Lower cost per request | Shorter prompt helps a little | Adds tokens, costs more | Yes, a small tuned model is cheap |
| Lower latency | A little | No, search adds time | Yes, small models are fast |
| Time to first result | Minutes | Hours | Days, mostly writing data |
| Cost to build | Nothing | Embedding and a vector store | Dataset time plus a free GPU |
| What goes wrong | Prompt grows and drifts | Bad chunks, bad search | Memorising, forgetting, stale facts |

Two rows deserve a closer look. Fine-tuning does not add facts reliably. In the last lesson the fact accuracy of the small model is 35 of 40 before training and 36 of 40 after. Training on 200 replies changed how the model writes, not what it knows. Facts came from the policy note in the prompt, which retrieval supplies. The second row is the cost row. The savings are real only at volume. At 100 replies a day the Haiku bill is USD 3 a month, and a fine-tune is not worth a day of work.

You can write the decision as a small function. Run it with the numbers from the three requests.

:::code
lang: python
file: train/decide.py
def decide(facts_needed, facts_change, style_rules, prompt_pass_rate, requests_per_day):
    plan = ["prompt"]
    if facts_needed and facts_change:
        plan.append("retrieval")
    if style_rules and prompt_pass_rate < 0.9:
        plan.append("fine-tune")
    elif requests_per_day >= 5000 and style_rules:
        plan.append("fine-tune a small model to cut cost")
    return plan

print("refund period:", decide(True, True, False, 0.0, 10000))
print("house style:  ", decide(False, False, True, 0.48, 10000))
print("JSON order:   ", decide(False, False, False, 1.0, 10000))
:::

:::code
lang: text
refund period: ['prompt', 'retrieval']
house style:   ['prompt', 'fine-tune']
JSON order:    ['prompt']
:::

The function is a reminder, not a law. The real decision uses your own 40 examples and your own measured pass rate. The three methods also combine. The fine-tuned model in this module still gets the policy note from retrieval in its prompt. The agent in the agents module still uses a prompt to choose tools. A full system uses all three, each where it fits.

## Try it

:::exercise
title: Decide for six tasks
task: For each task below, write prompt, retrieval or fine-tune, and one sentence of reason. 1. Translate product names into Spanish in a fixed catalogue format, 50,000 a day. 2. Answer questions about this week's delivery delays. 3. Summarise a support ticket in 2 sentences, 20 a day. 4. Write replies in the voice of a brand, where a prompt with 5 examples passes 55 percent. 5. Tell customers the current price of an item. 6. Classify tickets into 6 categories, where a prompt passes 97 percent, 2,000 a day.
hint: Ask two questions for each task. Does the answer need facts that change? Is the failure about form or about facts? Then look at the volume.
lang: text
solution:
1. Fine-tune. Fixed format, high volume, the format does not change. Start with a prompt to build the test set.
2. Retrieval. The delays change every day; put the delay notes in documents.
3. Prompt. Low volume, a general skill that large models already have.
4. Fine-tune. The failure is style, and the prompt with examples is stuck at 55 percent.
5. Retrieval, or a tool that reads the price table. Prices change; weights cannot follow.
6. Prompt. 97 percent already passes; 2,000 a day on a cheap model is a few dollars a month.
:::

## Common mistakes

- Mistake: you fine-tune to teach the model your policy facts, and it still invents a 14-day refund window. Fix: put facts in documents and retrieve them; fine-tune for form, not facts.
- Mistake: you start training before you try a prompt. Fix: always write the prompt first; it gives you the test set and the baseline number.
- Mistake: you judge the methods on the examples you trained on. Fix: hold out 40 examples before anything else and never train on them.
- Mistake: you decide on cost without computing it. Fix: multiply tokens per request by price per million and by requests per month, as in the running example.
- Mistake: you expect the fine-tuned small model to be as smart as the large one. Fix: it learns your style; it still knows fewer facts, so give it the policy note in the prompt.

## Check your understanding

:::quiz
title: Check: prompt, retrieve or fine-tune
q: Customers ask about shipping times, which change every week. Which method fits best?
- Fine-tune on last month's shipping times
* Retrieval over a document that you update each week
- A longer prompt with the model's own guess
why: Facts that change belong in documents; weights freeze what the model knew at training time.
q: A prompt with the 4 house rules passes 19 of 40 on the small model and the volume is 10,000 a day. What does the decision path say?
- Stop; 19 of 40 is good enough
- Switch to retrieval
* Fine-tune, because the failures are style and the volume is high
why: Style failures at high volume are the case where fine-tuning beats a longer prompt.
q: A reply costs USD 0.0030 on Sonnet. What is the monthly bill for 2,000 replies a day?
- USD 60
* USD 180
- USD 900
why: 2,000 times 0.0030 is USD 6 a day, and 30 days gives USD 180.
q: After fine-tuning on 200 replies, the fact accuracy is 36 of 40, almost the same as before. What does this show?
- The training failed
* Fine-tuning changed the form of the replies, not the facts the model knows
- The held-out set was too small
why: Supervised fine-tuning on a small dataset teaches patterns of output; facts still come from the prompt.
q: What is the first thing to do for any new task, before a prompt, retrieval or training?
- Pick the largest model
* Write 40 test inputs with the outputs you want
- Build the dataset of 200 examples
why: The held-out set gives every method the same measurement; without it you cannot compare them.
:::

## Go further

The retrieval paper in the links introduced the name RAG and explains why facts belong outside the weights. The LoRA paper is the method you use in two lessons; read the abstract now and the rest after you train. The Hugging Face training guide shows the general shape of a fine-tune. The next lesson, [Build a dataset](/courses/build-ai-ecosystem/train-your-own/build-a-dataset), writes the 200 examples that teach the house style.
`,
    },
    {
      slug: 'build-a-dataset',
      title: 'Build a dataset',
      summary: 'After this lesson you have 200 instruction and response pairs in JSONL, checked by a script and by eye, with 40 held out for testing.',
      minutes: 24,
      objectives: [
        'Write one training example in JSONL with system, user and assistant messages.',
        'Explain what a chat template does to your messages before training.',
        'Run a plan that produces 200 examples across 6 topics, with drafts from a model and a check script.',
        'Split the dataset into 160 training and 40 held-out examples by topic.',
      ],
      keyTerms: ['jsonl', 'chat template', 'held-out set', 'supervised fine-tuning', 'tokenizer', 'hallucination'],
      links: [
        { label: 'JSON Lines format', url: 'https://jsonlines.org/', kind: 'docs' },
        { label: 'Hugging Face: chat templates', url: 'https://huggingface.co/docs/transformers/chat_templating', kind: 'docs' },
        { label: 'LIMA: Less Is More for Alignment', url: 'https://arxiv.org/abs/2305.11206', kind: 'paper' },
        { label: 'Hugging Face datasets: load JSON', url: 'https://huggingface.co/docs/datasets/loading', kind: 'docs' },
      ],
      body: `
## What this lesson covers

You build the dataset that teaches the house style. You learn the JSONL file format, the shape of one example, and the chat template that turns the example into the text the model trains on. You follow a plan that produces 200 examples across 6 topics without writing all of them by hand. At the end you have train/train.jsonl with 160 examples and train/test.jsonl with 40 held-out examples, and every line passes the 4 rules.

## Why it matters

The dataset is the only teacher the model gets. In the next lesson, [Fine-tune a small open model with LoRA](/courses/build-ai-ecosystem/train-your-own/lora-fine-tune), the model reads every example 3 times and adjusts its weights towards it. A mistake in the data becomes a habit in the model. A missing sign-off in 10 examples teaches the model that the sign-off is optional. The checks in this lesson are cheap, and training a bad dataset wastes a GPU hour and an evening. The 40 held-out examples are the only honest measurement you will have.

:::video
id: zjkBMFhNj_g
start: 850
why: Watch about 8 minutes from this point. Karpathy describes the fine-tuning stage of a chat model and why a smaller set of careful examples beats a large sloppy one.
:::

## The idea with an example

> **Analogy.** A dataset is a book of worked examples for a new employee. The employee copies everything in the book, including the mistakes. Two hundred examples that are all correct and all in one voice teach more than two thousand that are mixed. The book also needs variety. If every example is about refunds, the employee stalls on the first shipping question.

JSONL means JSON Lines. A JSONL file holds one JSON object per line, with no commas between lines. Each line is one training example. Programs read it one line at a time, so a 200-line file and a 2-million-line file use the same code. Here is one example from the running dataset, shown over several lines so you can read it. In the file it is one line.

:::code
lang: json
{"topic": "refunds", "name": "Priya",
 "messages": [
  {"role": "system", "content": "You are aiworkshop support. Answer the customer using only the policy note."},
  {"role": "user", "content": "Policy note: Refunds are accepted within 30 days of delivery.\\nCustomer (Priya): I got my order 12 days ago and want to return it. Can I?"},
  {"role": "assistant", "content": "Hi Priya,\\nYes. Your order arrived 12 days ago, which is inside the 30-day refund window.\\nNext step: reply with your order number and we will send a return label.\\naiworkshop support"}
 ]}
:::

The example has three messages, the same roles as the chat loop in the chat module. The system message is short and fixed: 14 words. The user message holds two things: the policy note, which retrieval will supply at serving time, and the customer message with the name in brackets. The assistant message is the reply you want, and it passes all four rules. The two extra fields, topic and name, are not shown to the model. The check script and the split script use them.

The model does not train on JSON. The tokenizer applies a chat template, which is a fixed recipe that joins the messages into one text with special marker tokens. For the Qwen2.5 models the text looks like this:

:::code
lang: text
<|im_start|>system
You are aiworkshop support. Answer the customer using only the policy note.<|im_end|>
<|im_start|>user
Policy note: Refunds are accepted within 30 days of delivery.
Customer (Priya): I got my order 12 days ago and want to return it. Can I?<|im_end|>
<|im_start|>assistant
Hi Priya,
Yes. Your order arrived 12 days ago, which is inside the 30-day refund window.
Next step: reply with your order number and we will send a return label.
aiworkshop support<|im_end|>
:::

This text is about 120 tokens. The whole dataset of 200 examples is about 24,000 tokens, which is less than one long chat. Fine-tuning for style needs very little text, because the model already knows English and already knows how to answer. It only learns the shape of your reply.

Here is the plan for 200 examples. You write the inputs, a model drafts the replies, a script checks every draft, and you read every one.

| Topic | Examples | With a name | Without a name | Example customer message |
| --- | --- | --- | --- | --- |
| Refunds | 40 | 20 | 20 | Can I return a jacket I wore once? |
| Shipping | 40 | 20 | 20 | My parcel says delivered but I have nothing. |
| Account and password | 30 | 15 | 15 | I cannot log in after changing my email. |
| Billing | 30 | 15 | 15 | I was charged twice this month. |
| Product questions | 30 | 15 | 15 | Does the kettle work on 110 volts? |
| Out of scope | 30 | 15 | 15 | Can you recommend a good restaurant nearby? |

The out-of-scope rows matter. Without them the model answers every question with confidence, including ones it should decline. Each of those examples teaches a polite refusal in the same four-rule shape. The policy notes come from your retrieval documents, about 25 short notes. Each note serves several customer messages. The steps from inputs to a checked dataset look like this:

:::flow
title: From policy notes to a checked dataset
Policy notes -> Prompts file: 200 messages with notes
Prompts file -> Draft script: a model writes each reply
Draft script -> Check script: tests the 4 rules
Check script -> Your eyes: read and fix every reply
Your eyes -> Split script: 160 train, 40 test
:::

Press Next to follow one example through the plan.

:::scenario
title: One example from idea to file
state: written=0, drafted=0, passing=0
step: You write the input: topic shipping, name Omar, note "Standard delivery takes 3 to 5 working days", message "Ordered Monday, nothing yet on Thursday. Is this late?"
state: written=1
step: The draft script sends the note and message to a capable model with the 4 rules. It returns a 48-word reply with a greeting and a sign-off.
state: drafted=1
step: The check script finds that the reply has two lines starting with Next step. Rule 3 fails.
state: passing=0, problems=1
step: You read the reply, merge the two next steps into one line, and save. The check passes.
state: passing=1, problems=0
step: The split script puts this example in train.jsonl. One in five shipping examples goes to test.jsonl instead.
state: train=1, test=0
:::

## How it works

The procedure for any style dataset is the same. Follow it in order.

:::anim
title: 200 examples from inputs to a checked, split dataset
box prompts "prompts.jsonl" @ 180,150 icon: file
box draft "Draft script" @ 480,150 icon: model
box check "Check script" @ 780,150 icon: check
box eyes "Your eyes" @ 780,290 icon: user
box split "Split script" @ 480,290 icon: script
box train "train.jsonl" @ 180,290 icon: file
box test "test.jsonl" @ 480,430 icon: file
num n_in = 0 @ 180,215 suffix: " inputs" size: 22 color: yellow
num n_draft = 0 @ 480,215 suffix: " drafts" size: 22 color: yellow
num n_bad = 0 @ 780,215 suffix: " fail the rules" size: 22 color: red
num n_train = 0 @ 180,365 suffix: " train" size: 22 color: green
num n_test = 0 @ 780,430 suffix: " test" size: 22 color: green
text note "Line 58: two Next step lines" @ 780,365 size: 16 color: grey

step: You write 200 customer messages, each with a policy note, into prompts.jsonl. Half have a name.
  show prompts, n_in
  count n_in -> 200 (2s)
step: The draft script sends each input to a capable model with the 4 rules. It writes 200 drafts.
  show draft, n_draft
  arrow prompts -> draft : "200 inputs"
  & count n_draft -> 200 (2s)
step: The check script tests every draft against the 4 rules. Three drafts fail.
  show check, n_bad
  arrow draft -> check : "200 drafts"
  & count n_bad -> 3
step: Line 58 has two Next step lines. You merge them, fix the other two, and read all 200.
  show eyes, note
  arrow check -> eyes : "3 failures"
  count n_bad -> 0
  & color n_bad green
step: The split script shuffles inside each topic with seed 42, so every topic reaches the test set.
  hide note
  show split
  arrow eyes -> split : "200 checked examples"
step: One in five of each topic goes to test.jsonl. The rest, 160 examples, go to train.jsonl.
  show train, test, n_train, n_test
  arrow split -> train : "160"
  & count n_train -> 160 (1.4s)
  arrow split -> test : "40"
  & count n_test -> 40
step: Seal test.jsonl. You open it again only in the evaluation lesson.
  highlight test
  label test "test.jsonl, sealed"
  dim train
:::

1. Fix the rules in writing, as checks a program can run. A rule you cannot check is a rule you cannot measure.
2. Write the inputs yourself. Vary the names, the wording, the length and the mood. Include the cases where the right answer is "no" or "I cannot help with that".
3. Draft the outputs with a capable model, with the rules in its prompt. Drafting is cheap; your review is the expensive part.
4. Check every draft with a script. Fix or delete the failures. Then read every example once; the script cannot see a wrong fact or a rude tone.
5. Split by topic with a fixed random seed. Never look at the test examples again until the last lesson.

Step 2 is where the variety comes from, so spend time on it. The inputs file, train/prompts.jsonl, has one line per example with four fields: topic, name, note and message. Write the messages the way customers write. Some are one angry line, some are three polite sentences, some have a typo. Use 30 different names, leave the name empty in half the lines, and let a few customers ask two things at once. Reuse each policy note for 6 to 10 messages, so the model learns that the same fact can answer many questions. Here is one line of the inputs file:

:::code
lang: json
{"topic": "shipping", "name": "Omar", "note": "Standard delivery takes 3 to 5 working days.", "message": "Ordered Monday, nothing yet on Thursday. Is this late?"}
:::

Writing 200 inputs takes about 2 hours. It is the one part of the dataset that no model should write for you, because the model would write the same polite message 200 times, and your customers do not.

Here is the draft script. It reads train/prompts.jsonl, which has one line per input with the fields topic, name, note and message. It writes train/drafts.jsonl with the messages list added. It uses the Anthropic client from the first module.

:::code
lang: python
file: train/draft.py
import json
import anthropic

client = anthropic.Anthropic()
SYSTEM = "You are aiworkshop support. Answer the customer using only the policy note."
RULES = """Write the reply in the aiworkshop house style.
1. First line: "Hi <name>," or "Hi there," when no name is given.
2. At most 60 words in total.
3. Exactly one line starts with "Next step:".
4. The last line is exactly: aiworkshop support
Use only the policy note for facts. If the note does not cover it, say so politely."""

with open("train/prompts.jsonl") as src, open("train/drafts.jsonl", "w") as out:
    for line in src:
        row = json.loads(line)
        who = f"Customer ({row['name']})" if row["name"] else "Customer"
        user = f"Policy note: {row['note']}\\n{who}: {row['message']}"
        msg = client.messages.create(model="claude-sonnet-5-5", max_tokens=200,
                                     system=RULES, messages=[{"role": "user", "content": user}])
        row["messages"] = [{"role": "system", "content": SYSTEM},
                           {"role": "user", "content": user},
                           {"role": "assistant", "content": msg.content[0].text.strip()}]
        out.write(json.dumps(row) + "\\n")
print("drafted", sum(1 for _ in open("train/drafts.jsonl")), "examples")
:::

The run takes about 2 minutes and costs about USD 0.20 for 200 calls. Now the check script. The function check is the heart of this module. The next two lessons import it to score the model, so the dataset and the model are judged by the same code.

:::code
lang: python
file: train/check.py
import json
import sys

def check(reply, name):
    lines = [l.strip() for l in reply.strip().splitlines() if l.strip()]
    greeting = f"Hi {name}," if name else "Hi there,"
    return {
        "greeting": bool(lines) and lines[0] == greeting,
        "short": len(reply.split()) <= 60,
        "next_step": sum(l.startswith("Next step:") for l in lines) == 1,
        "signoff": bool(lines) and lines[-1] == "aiworkshop support",
    }

if __name__ == "__main__":
    rows = [json.loads(line) for line in open(sys.argv[1])]
    seen, bad = set(), 0
    for i, row in enumerate(rows, 1):
        user = row["messages"][1]["content"]
        if user in seen:
            print(i, "duplicate customer message")
        seen.add(user)
        failed = [k for k, ok in check(row["messages"][2]["content"], row["name"]).items() if not ok]
        if failed:
            bad += 1
            print(i, "fails", failed)
    print(len(rows), "examples,", bad, "with problems")
:::

:::code
lang: text
$ python train/check.py train/drafts.jsonl
17 fails ['short']
58 fails ['next_step']
58 duplicate customer message
131 fails ['short', 'signoff']
200 examples, 3 with problems
:::

Three failures out of 200 is typical for a capable model with clear rules. Fix them by hand, delete the duplicate and write a fresh input for it, and run the check again until it prints 0 with problems. Then rename the file to train/dataset.jsonl. Then read all 200. Read for facts that disagree with the note, for a promise the policy does not make, and for a tone you would not send. Expect to edit about 10 more. This hour of reading is the most valuable hour in the module.

The table lists what each check catches and what only you can catch.

| Problem | Script catches it? | How to find it |
| --- | --- | --- |
| Missing or wrong greeting | Yes | Rule 1 |
| Reply over 60 words | Yes | Rule 2 |
| Zero or two next steps | Yes | Rule 3 |
| Missing sign-off | Yes | Rule 4 |
| Duplicate customer message | Yes | Set of seen messages |
| Reply contradicts the policy note | No | Read it |
| Reply invents a fact the note does not contain | No | Read it; this is hallucination in your data |
| Rude or stiff tone | No | Read it aloud |
| All examples sound the same | No | Count topics and sentence openers |

The last step is the split. The held-out set, the 40 test examples, must look like the training set but share no lines with it. Split inside each topic so every topic appears in the test set. A fixed seed makes the split repeatable, so you and a friend get the same 40.

:::code
lang: python
file: train/split.py
import json
import random

random.seed(42)
rows = [json.loads(line) for line in open("train/dataset.jsonl")]
by_topic = {}
for row in rows:
    by_topic.setdefault(row["topic"], []).append(row)

train, test = [], []
for topic, group in by_topic.items():
    random.shuffle(group)
    k = len(group) // 5
    test += group[:k]
    train += group[k:]

for path, part in [("train/train.jsonl", train), ("train/test.jsonl", test)]:
    with open(path, "w") as f:
        for row in part:
            f.write(json.dumps(row) + "\\n")
print(len(train), "train,", len(test), "test")
:::

:::code
lang: text
160 train, 40 test
:::

Forty held out from 200 is 20 percent. With 40 examples each one is 2.5 percentage points of pass rate. That is coarse, but enough to see the jump from 19 to 34. For a production dataset you want 200 or more in the test set alone.

A note on data rules. Every name and message in this dataset is invented. Never paste real customer messages into a training file. They contain personal data, and the model can repeat it to a stranger. The rules from [Where data comes from and the rules](/courses/start-here/data-the-raw-material/data-rules-and-ethics) apply to training data more than to any other file you keep.

## Try it

:::exercise
title: Write ten by hand and check them
task: Pick the billing topic. Write 10 inputs in train/prompts.jsonl by hand, 5 with a name and 5 without, each with a policy note and a customer message. Write the 10 replies yourself, without the draft script, and put them in the messages format. Run python train/check.py on the file. Fix every failure. Then count the words of your longest reply.
hint: Write the reply as four parts: greeting line, answer in one or two sentences, one Next step line, sign-off line. Most failures are a missing comma after Hi there or a sign-off with a full stop.
lang: text
solution:
Example of one passing line, shown unwrapped:
{"topic": "billing", "name": "", "messages": [
 {"role": "system", "content": "You are aiworkshop support. Answer the customer using only the policy note."},
 {"role": "user", "content": "Policy note: Duplicate charges are refunded within 5 working days.\\nCustomer: I was charged twice on the 3rd."},
 {"role": "assistant", "content": "Hi there,\\nSorry about that. A duplicate charge is refunded within 5 working days.\\nNext step: send us the last 4 digits of the card and the date, and we will confirm the refund.\\naiworkshop support"}]}

Word count of that reply: 41. The check prints 10 examples, 0 with problems.
:::

## Common mistakes

- Mistake: you write 200 examples about refunds and the model stalls on billing questions. Fix: plan the topics first and fill each one; include out-of-scope messages.
- Mistake: the draft model writes a fact that the policy note does not contain, and you keep it. Fix: read every example; a hallucination in the data becomes a hallucination the model learned on purpose.
- Mistake: you fix a failing example by changing the rule in your head. Fix: the rule is the check function; change the data, not the rule, or change both and re-check everything.
- Mistake: you peek at the test set to fix the training data. Fix: split once with a seed and open test.jsonl only in the evaluation lesson.
- Mistake: you save the file with a trailing comma or a blank line between objects, as in a JSON array. Fix: one object per line, no commas, no blank lines; check with python -c "import json; [json.loads(l) for l in open('train/train.jsonl')]".

## Check your understanding

:::quiz
title: Check: the dataset
q: What does one line of a JSONL file hold?
- One field of one example
* One complete JSON object, which is one example
- The whole dataset as a JSON array
why: JSON Lines puts one object per line so programs can stream the file line by line.
q: Which part of the example does the model train on after the chat template is applied?
- Only the assistant message
- The topic and name fields
* The joined text of system, user and assistant messages with marker tokens
why: The chat template renders all three messages into one text with special tokens, and the trainer sees that text.
q: A draft reply has two lines that start with Next step. Which check fails, and what do you do?
- The short check; delete the reply
* The next_step check; merge the two lines into one and re-run the check
- No check fails; two next steps are fine
why: Rule 3 asks for exactly one; the script counts lines that start with Next step and compares with 1.
q: Why does the split script shuffle inside each topic instead of shuffling all 200 at once?
- It is faster
* So that every topic has examples in the test set
- So that the test set is larger
why: A single shuffle could leave a topic with zero test examples by chance; splitting per topic guarantees coverage.
q: The dataset has 200 examples of about 120 tokens each. About how many tokens does the model train on in one epoch?
- 2,400
* 24,000
- 240,000
why: 200 times 120 is 24,000 tokens, less than one long chat; style needs little text.
q: A friend offers you 5,000 real customer emails for the dataset. What is the right response?
- Accept; more data is always better
* Decline; real messages hold personal data that the model could repeat
- Accept, but skip the review step
why: Training data is copied into the model's behaviour; invented names and messages carry no personal data.
:::

## Go further

The JSON Lines page in the links is one screen long and settles every format question. The chat template guide shows the template for every model family, so you can switch models later. The LIMA paper trained a strong assistant on only 1,000 careful examples and argues that quality beats quantity. The next lesson, [Fine-tune a small open model with LoRA](/courses/build-ai-ecosystem/train-your-own/lora-fine-tune), loads train.jsonl on a free GPU and trains.
`,
    },
    {
      slug: 'lora-fine-tune',
      title: 'Fine-tune a small open model with LoRA',
      summary: 'After this lesson you have trained a LoRA adapter for Qwen2.5-0.5B-Instruct on a free Colab GPU and saved it as an 8.7 MB file.',
      minutes: 25,
      objectives: [
        'Explain what LoRA changes in a model, with the real numbers for one weight matrix.',
        'Run a fine-tune of Qwen2.5-0.5B-Instruct with transformers and peft on a free Colab GPU.',
        'Read the training loss and tell a healthy run from a memorising run.',
        'Choose the rank, learning rate and epochs for a small style dataset, and save the adapter.',
      ],
      keyTerms: ['lora', 'lora adapter', 'lora rank', 'trainable parameters', 'learning rate', 'chat template', 'catastrophic forgetting'],
      links: [
        { label: 'LoRA paper (Hu et al., 2021)', url: 'https://arxiv.org/abs/2106.09685', kind: 'paper' },
        { label: 'PEFT documentation', url: 'https://huggingface.co/docs/peft/index', kind: 'docs' },
        { label: 'PEFT: LoRA conceptual guide', url: 'https://huggingface.co/docs/peft/conceptual_guides/lora', kind: 'docs' },
        { label: 'Qwen2.5-0.5B-Instruct model card', url: 'https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct', kind: 'repo' },
        { label: 'Transformers Trainer', url: 'https://huggingface.co/docs/transformers/main_classes/trainer', kind: 'docs' },
      ],
      body: `
## What this lesson covers

You fine-tune a real model. You open a free Colab notebook with a GPU, load Qwen2.5-0.5B-Instruct, attach a LoRA adapter, and train it on the 160 examples for 3 epochs. You learn what LoRA changes inside the model, with the real sizes of the matrices. At the end you have a folder train/adapter of 8.7 megabytes (MB) that turns the base model into your support writer.

## Why it matters

This is the moment the project track has built towards. Everything before this used a model somebody else trained. After this lesson, part of the model is yours. The method also scales. The same 30 lines train a 7 billion parameter model on a rented GPU, and the same adapter idea lets one server hold hundreds of styles. The next lesson, [Evaluate and serve the fine-tuned model](/courses/build-ai-ecosystem/train-your-own/evaluate-and-serve), measures what this training did and puts the model behind an endpoint.

:::video
id: IHZwWFHWa-w
why: Watch the first 10 minutes. The loop the video shows, compute the loss, follow the gradient, update the weights, is exactly what the Trainer runs for you 60 times in this lesson.
:::

## The idea with an example

> **Analogy.** A printed map of a city has 494 million tiny marks. The council moves a bus stop. You do not reprint the map. You lay a thin transparent sheet over it and draw the correction on the sheet. Anyone who holds the map and the sheet together sees the corrected city. The sheet is small, you can carry several, and you can lift it off to get the original map back. LoRA is the transparent sheet. The printed map is the frozen model.

Full fine-tuning updates every one of the 494 million parameters. For each parameter the optimiser also keeps 2 or 3 extra numbers, so training needs about 4 times the memory of the model. That does not fit on a free GPU for anything but tiny models. Low-rank adaptation (LoRA) freezes the model and adds a small trainable adapter beside each chosen weight matrix. Only the adapter trains.

Here are the real numbers for the running example. Qwen2.5-0.5B-Instruct has 24 transformer layers. Each layer has an attention block with 4 weight matrices, named q_proj, k_proj, v_proj and o_proj. The matrix q_proj has 896 rows and 896 columns, which is 802,816 numbers. LoRA adds two thin matrices next to it. Matrix A has 16 rows and 896 columns. Matrix B has 896 rows and 16 columns. Together they hold 28,672 numbers, which is 3.6 percent of the original matrix. The number 16 is the rank, the width of the thin matrices.

:::flow
title: One LoRA layer at forward time
Input x -> Frozen W: 802,816 numbers, not trained
Input x -> Matrix A: shrinks x to 16 numbers
Matrix A -> Matrix B: expands 16 back to 896
Matrix B -> Sum: scaled by alpha over rank
Frozen W -> Sum: the original output
Sum -> Next layer: original plus correction
:::

Count the whole adapter. In each layer, q_proj and o_proj each get 28,672 adapter numbers. The k_proj and v_proj matrices are smaller, 896 by 128, so each gets 16 times 896 plus 16 times 128, which is 16,384. One layer adds 28,672 plus 28,672 plus 16,384 plus 16,384, which is 90,112. Times 24 layers is 2,162,688 trainable parameters. The frozen model has 494,032,768. The trainable share is 0.44 percent. The adapter file stores 2,162,688 numbers at 4 bytes each, about 8.7 MB. The base model file is 988 MB.

:::bars
title: Size on disk
unit: MB
Base model: 988
LoRA adapter: 8.7
train.jsonl: 0.1
:::

Now run it. Open https://colab.research.google.com, make a new notebook, and choose Runtime, then Change runtime type, then T4 GPU. The T4 is a free GPU with 16 gigabytes (GB) of memory. Upload train/train.jsonl with the folder icon on the left. Then run the cells below one at a time. The first cell installs the libraries.

:::code
lang: bash
pip install -q transformers peft datasets accelerate
:::

:::code
lang: python
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM

NAME = "Qwen/Qwen2.5-0.5B-Instruct"
tok = AutoTokenizer.from_pretrained(NAME)
model = AutoModelForCausalLM.from_pretrained(NAME, torch_dtype=torch.float32).to("cuda")
print(sum(p.numel() for p in model.parameters()), "parameters")
print(torch.cuda.memory_allocated() // 1_000_000, "MB on the GPU")
:::

:::code
lang: text
494032768 parameters
1976 MB on the GPU
:::

The download is 988 MB and takes about 30 seconds. In memory the model takes 1,976 MB because float32 stores each number in 4 bytes. Next, load the dataset and apply the chat template. The template joins the three messages into one text, as the last lesson showed. The tokenizer then turns the text into token ids.

:::code
lang: python
from datasets import load_dataset

ds = load_dataset("json", data_files="train.jsonl")["train"]

def to_text(row):
    return {"text": tok.apply_chat_template(row["messages"], tokenize=False)}

def tokenize(row):
    return tok(row["text"], truncation=True, max_length=512)

ds = ds.map(to_text)
ds = ds.map(tokenize, remove_columns=ds.column_names)
print(ds)
print(len(ds[0]["input_ids"]), "tokens in example 0")
:::

:::code
lang: text
Dataset({ features: ['input_ids', 'attention_mask'], num_rows: 160 })
118 tokens in example 0
:::

Now attach the adapter. The LoraConfig names the rank, the scale alpha, a small dropout, and the four matrices to adapt. The function get_peft_model freezes the model and inserts the adapters.

:::code
lang: python
from peft import LoraConfig, get_peft_model

config = LoraConfig(r=16, lora_alpha=32, lora_dropout=0.05,
                    target_modules=["q_proj", "k_proj", "v_proj", "o_proj"],
                    task_type="CAUSAL_LM")
model = get_peft_model(model, config)
model.print_trainable_parameters()
:::

:::code
lang: text
trainable params: 2,162,688 || all params: 496,195,456 || trainable%: 0.4359
:::

The numbers match the count above. Now train. The Trainer runs the loop: pick a batch, compute the loss, compute the gradients, update the adapter. The collator pads each batch and copies the input ids into the labels, so the loss is next-token prediction over the whole text. With 160 examples, a batch of 4 and 2 accumulation steps, each epoch is 20 updates. Three epochs are 60 updates.

:::code
lang: python
from transformers import Trainer, TrainingArguments, DataCollatorForLanguageModeling

args = TrainingArguments(output_dir="checkpoints", num_train_epochs=3,
                         per_device_train_batch_size=4, gradient_accumulation_steps=2,
                         learning_rate=2e-4, logging_steps=10,
                         save_strategy="no", report_to="none")
trainer = Trainer(model=model, args=args, train_dataset=ds,
                  data_collator=DataCollatorForLanguageModeling(tok, mlm=False))
trainer.train()
model.save_pretrained("adapter")
:::

:::code
lang: text
Step  Training Loss
10    1.8500
20    1.1200
30    0.8100
40    0.6600
50    0.5900
60    0.5500
TrainOutput(global_step=60, training_loss=0.928, ...)
:::

The run takes about 2 minutes 40 seconds on the T4. The loss starts near 2.3, which means the base model found the house style surprising. It falls fast in the first epoch and flattens near 0.55 in the third. The adapter folder holds adapter_model.safetensors at 8.7 MB and a small config file. Download it with the folder panel, or zip it, and put it at train/adapter in your repository. Press Next to follow the run.

:::scenario
title: The training run
state: epoch=0, step=0, loss=2.3, trainable=0
step: Load the model in float32. All 494 million parameters are frozen, nothing is trainable yet.
state: trainable=0
step: Attach LoRA with rank 16 on q, k, v and o in every layer. Now 2,162,688 parameters can change.
state: trainable=2,162,688
step: Epoch 1: 20 updates of 8 examples each. The loss drops from 2.3 to 1.12. The model learns the greeting and the sign-off first, because they appear in every example.
state: epoch=1, step=20, loss=1.12
step: Epoch 2: the loss drops to 0.66. The Next step line and the 60-word length are now usual.
state: epoch=2, step=40, loss=0.66
step: Epoch 3: the loss flattens at 0.55. A fourth epoch would gain little and start to memorise.
state: epoch=3, step=60, loss=0.55
step: Save the adapter. The file is 8.7 MB. The base model on disk is unchanged.
state: adapter=8.7 MB saved
:::

Try the model once before you leave the notebook. The helper below builds the prompt with the chat template and generates a reply. Run it on the Priya message.

:::code
lang: python
SYSTEM = "You are aiworkshop support. Answer the customer using only the policy note."

def reply(model, note, name, message):
    who = f"Customer ({name})" if name else "Customer"
    msgs = [{"role": "system", "content": SYSTEM},
            {"role": "user", "content": f"Policy note: {note}\\n{who}: {message}"}]
    ids = tok.apply_chat_template(msgs, add_generation_prompt=True, return_tensors="pt").to("cuda")
    out = model.generate(ids, max_new_tokens=120, do_sample=False)
    return tok.decode(out[0][ids.shape[1]:], skip_special_tokens=True)

print(reply(model, "Refunds are accepted within 30 days of delivery.", "Priya",
            "I got my order 12 days ago and want to return it. Can I?"))
:::

:::code
lang: text
Hi Priya,
Yes, you can. Your order arrived 12 days ago, inside the 30-day refund window.
Next step: reply with your order number and we will email a return label.
aiworkshop support
:::

This message is in the training set, so a good reply here proves little. It proves that the pipeline works. The honest test is the 40 held-out messages in the next lesson.

## How it works

The general procedure for a LoRA fine-tune has 6 steps, and every step above maps to one of them.

:::anim
title: One LoRA layer: the frozen matrix and the thin correction
rect x @ 110,270 size: 100x60 "x|896 numbers" color: blue
rect W @ 420,130 size: 220x70 "W, frozen|896 x 896" color: grey
rect A @ 330,400 size: 150x60 "A|16 x 896" color: purple
rect B @ 560,400 size: 150x60 "B|896 x 16" color: purple
rect sum @ 710,270 size: 70x60 "+" color: white
rect y @ 850,270 size: 90x60 "y" color: blue
num frozen = 0 @ 420,70 suffix: " frozen numbers" size: 20 color: grey
text zero "B starts at zero:|the correction is zero" @ 430,330 size: 16 color: grey
num loss = 2.3 @ 800,110 prefix: "loss " digits: 2 size: 26 color: yellow
num upd = 0 @ 800,155 prefix: "update " suffix: " of 60" size: 20 color: grey
text eq "y = W x + 2 B A x" @ 800,205 size: 18 color: yellow
num adapt = 0 @ 800,350 suffix: " in A and B" size: 20 color: purple
text pct "3.6 percent of W" @ 800,382 size: 16 color: grey
num total = 0 @ 800,430 suffix: " trainable" size: 20 color: green
num mb = 0 @ 800,470 digits: 1 suffix: " MB adapter file" size: 20 color: green

step: The input x has 896 numbers. It enters the frozen matrix W, 802,816 numbers that never change.
  show x, W, frozen
  arrow x -> W : "x"
  & count frozen -> 802816 (1.4s)
step: W x is the original output y. With nothing else, this is the base model.
  show sum, y
  arrow W -> sum : "W x"
  arrow sum -> y : "y"
step: LoRA adds two thin matrices. A squeezes x from 896 numbers down to 16, the rank.
  show A, adapt
  arrow x -> A : "x"
  & count adapt -> 14336
step: B expands the 16 numbers back to 896. A and B hold 28,672 numbers, 3.6 percent of W.
  show B
  arrow A -> B : "16 numbers"
  & count adapt -> 28672
  show pct
step: The correction is scaled by alpha over rank, 32 over 16, which is 2, and added to W x.
  show eq
  arrow B -> sum : "times 2"
  send sum -> y : "y"
step: At the start B is all zeros, so the correction is zero and the model equals the base.
  show zero
  color B grey
  pulse B
step: Training changes only A and B. Over 60 updates the loss falls from 2.3 to 0.55.
  hide zero
  show loss, upd
  color B purple
  count upd -> 60 (3s)
  & count loss -> 0.55 (3s)
  & pulse A
step: Across 24 layers the adapters hold 2,162,688 numbers, 0.44 percent of the model: an 8.7 MB file.
  show total, mb
  count total -> 2162688 (1.5s)
  & count mb -> 8.7 (1.5s)
  highlight A, B
  dim W
:::

1. Load a frozen instruct model that fits the GPU. A 0.5B model in float32 needs 2 GB; a 7B model needs 4-bit quantisation to fit the same card.
2. Render each example with the model's chat template and tokenize it. Use the template of the model you train, never another model's.
3. Choose the matrices to adapt and the rank. Attention matrices with rank 8 to 32 cover most style tasks.
4. Train with a learning rate around 0.0002 for 2 to 4 epochs. Watch the loss every 10 steps.
5. Save the adapter only, not the base model.
6. Test on examples the model never saw, which is the next lesson.

The mathematics is one line. For a frozen matrix W and input x, the layer computes $y = Wx + \\frac{\\alpha}{r} B A x$. In words: the output is the original output plus a correction, and the correction is the input squeezed through A to r numbers, expanded back through B, and scaled by alpha divided by r. With alpha 32 and rank 16 the scale is 2. At the start B is all zeros, so the correction is zero and the model behaves exactly like the base. Training moves B and A away from zero. The product B times A is a full 896 by 896 matrix, but it has rank at most 16, which is the low rank in the name. The multiplication rules are the ones from [Matrix multiplication by hand](/courses/math-from-zero/vectors-and-matrices/matrix-multiplication).

The settings you can change are few. The table gives the value used above and what happens when you move it.

| Setting | Value here | Smaller | Larger |
| --- | --- | --- | --- |
| Rank r | 16 | 4: adapter 2.2 MB, may miss subtle style | 64: adapter 35 MB, no gain on 160 examples |
| Alpha | 32 | Weaker correction | Stronger; keep alpha about 2 times r |
| Target matrices | q, k, v, o | q and v only: half the size | Add the 3 MLP matrices: 8.8 M params, better for new knowledge |
| Learning rate | 0.0002 | 0.00002: loss barely moves in 60 steps | 0.002: loss jumps around or rises |
| Epochs | 3 | 1: style half learned | 10: loss near 0.1, replies copied from training data |
| Batch size | 4, times 2 accumulation | More noise per step | Needs more GPU memory |
| Max length | 512 tokens | Cuts long examples | Longer examples cost memory; ours are 120 |

The loss tells you most of what you need. A healthy run falls quickly and then flattens, like 2.3 to 0.55. A run that flattens at 1.5 has a learning rate too low, or data the model cannot predict, such as replies that contradict each other. A run that reaches 0.1 has memorised the 160 replies, and on new messages it copies old ones. Overfitting here looks the same as in [Overfitting, underfitting and cross-validation](/courses/ai-foundations/first-models/overfitting-and-generalisation): the training number looks wonderful and the held-out number is worse.

Two more ideas you will meet. Catastrophic forgetting is when training on one narrow task makes the model worse at everything else. A tiny adapter, a low rank and few epochs keep it small, and the next lesson checks for it with 5 general questions. Label masking is a refinement: the collator above trains the model to predict the system and user text as well as the reply. Masking those tokens out of the loss, so only the reply counts, often helps on longer prompts. The trl library does this with its SFTTrainer and an assistant-only loss setting. For 120-token examples the simple collator is enough.

Why does such a small change work? The base model already knows how to greet, how to apologise and how to write a next step. It does not know that you want all four in this order every time. The adapter does not add skills; it changes which of the existing behaviours the model picks. That is also why it cannot add facts: the facts are not in the model to pick from.

## Try it

:::exercise
title: Change the rank and compare
task: Train three adapters on the same 160 examples with rank 4, rank 16 and rank 64. Keep every other setting the same. For each one write down the trainable parameter count from print_trainable_parameters, the final training loss, and the size of adapter_model.safetensors. Then run the reply function on the Omar shipping message from the last lesson for each adapter.
hint: Reload the base model before each run, or the second get_peft_model call stacks a new adapter on the old one. The parameter count scales in a straight line with the rank.
lang: text
solution:
rank 4:  540,672 trainable, 0.11 percent, final loss about 0.68, adapter 2.2 MB
rank 16: 2,162,688 trainable, 0.44 percent, final loss about 0.55, adapter 8.7 MB
rank 64: 8,650,752 trainable, 1.72 percent, final loss about 0.52, adapter 35 MB

Rank 4 sometimes drops the Next step line. Rank 16 and rank 64 give nearly the same
replies on this message. The gain from 16 to 64 is small on 160 examples, and the
file is 4 times larger. Rank 16 is the choice for the module.
:::

## Common mistakes

- Mistake: the notebook says CUDA out of memory. Fix: check that the runtime is a T4 GPU and not a CPU, lower per_device_train_batch_size to 2, and set max_length to 256.
- Mistake: the loss stays near 2.0 for all 60 steps. Fix: the learning rate is too low or the labels are missing; use 2e-4 and the collator with mlm=False.
- Mistake: the loss drops to 0.1 and the model repeats training replies word for word on new messages. Fix: train 2 or 3 epochs, not 10, and judge by the held-out set, not the training loss.
- Mistake: you render the examples with another model's chat template, and the replies are full of odd tokens. Fix: always call apply_chat_template on the tokenizer of the model you train.
- Mistake: you save the whole model with trainer.save_model and get a 2 GB folder. Fix: call model.save_pretrained on the peft model; it writes only the 8.7 MB adapter.

## Check your understanding

:::quiz
title: Check: LoRA fine-tuning
q: LoRA with rank 16 on a 896 by 896 matrix adds how many trainable numbers?
- 802,816
* 28,672
- 16
- 896
why: A is 16 by 896 and B is 896 by 16, so 14,336 plus 14,336 is 28,672.
q: Why does the model behave exactly like the base model before the first training step?
- The learning rate is zero at the start
* Matrix B starts at zero, so the correction B A x is zero
- The adapter is not attached until step 1
why: With B all zeros the added term is zero whatever A holds, so the output is W x alone.
q: A run reaches a training loss of 0.08 after 10 epochs on 160 examples. What is the most likely result on the 40 held-out messages?
- The best pass rate of all runs
* Replies copied from the training set, with a lower pass rate on new messages
- The same as 3 epochs
why: A loss far below the natural variation of the replies means memorising, and memorised replies fit the training messages, not new ones.
q: You double the rank from 16 to 32 with the same target matrices. What happens to the adapter file?
- It stays 8.7 MB
* It doubles to about 17 MB
- It becomes 988 MB
why: The parameter count scales in a straight line with the rank, and the file stores the parameters.
q: Which setting change would help most if the model needs to learn new vocabulary rather than a style?
- Lower the learning rate
- Train 1 epoch instead of 3
* Add the MLP matrices gate_proj, up_proj and down_proj to target_modules
why: The MLP blocks hold much of a model's stored associations, and adapting them gives the fine-tune more room to store new ones.
:::

## Go further

The LoRA paper in the links is short and readable after this lesson; section 4 has the method and section 7 the question of which matrices to adapt. The PEFT conceptual guide shows the same picture with code. The model card for Qwen2.5-0.5B-Instruct lists the architecture numbers used in this lesson. The next lesson, [Evaluate and serve the fine-tuned model](/courses/build-ai-ecosystem/train-your-own/evaluate-and-serve), scores the adapter on the 40 held-out messages and serves it with Ollama.
`,
    },
    {
      slug: 'evaluate-and-serve',
      title: 'Evaluate and serve the fine-tuned model',
      summary: 'After this lesson you can prove what the fine-tune changed on 40 held-out messages, merge the adapter, and serve the model with Ollama or vLLM behind a /reply endpoint.',
      minutes: 25,
      objectives: [
        'Run compare.py to score the base model and the adapter on the 40 held-out messages, rule by rule.',
        'Check fact accuracy and general ability so you can tell style gains from forgetting.',
        'Merge the adapter into the base model and publish the merged folder.',
        'Serve the model with Ollama on a laptop or vLLM on a GPU, and add a /reply endpoint to aiworkshop.',
      ],
      keyTerms: ['held-out set', 'pass rate', 'merged model', 'modelfile', 'quantisation', 'catastrophic forgetting', 'temperature'],
      links: [
        { label: 'Ollama: import a model', url: 'https://docs.ollama.com/import', kind: 'docs' },
        { label: 'Ollama Modelfile reference', url: 'https://docs.ollama.com/modelfile', kind: 'docs' },
        { label: 'vLLM documentation', url: 'https://docs.vllm.ai/', kind: 'docs' },
        { label: 'PEFT: merge LoRA weights', url: 'https://huggingface.co/docs/peft/developer_guides/lora', kind: 'docs' },
      ],
      body: `
## What this lesson covers

You find out what the training did. You run the base model and the fine-tuned model on the 40 held-out messages and score each of the 4 rules. You check that facts and general ability did not get worse. Then you merge the adapter into the base model, import it into Ollama as aiworkshop-ft, and add a /reply endpoint to the service. At the end the ship-it checklist line "ollama run aiworkshop-ft answers in the style of your dataset" is true.

## Why it matters

A fine-tune without a measurement is a story. The number from this lesson, 34 of 40 against 2 of 40, is what you show when someone asks whether the training was worth a day. The serving half matters just as much. A model in a Colab notebook helps nobody. Behind an endpoint, the fine-tuned model becomes the cheapest reply writer in aiworkshop, and the next module, [A Docker image for your service](/courses/build-ai-ecosystem/ship-it/dockerise), packages the whole service around it.

:::video
id: WxYC9-hBM_g
why: Watch the first 12 minutes. It shows Ollama installing and running a model on an ordinary computer, which is how you serve your own model in the second half of this lesson.
:::

## The idea with an example

> **Analogy.** The employee comes back from the two-week course. You do not ask whether the course was good. You give them the same 40 customer messages you gave them before the course, and you count. You also ask a few questions unrelated to the course, to make sure they did not forget how to do their old job. Then you put them on the phones.

The measurement has three parts, and each part answers one question. Did the style improve? Did the facts stay correct? Did the model forget anything else? The held-out set from the dataset lesson answers the first two. Five general questions answer the third.

Here is the running example. The script compare.py loads the base model, scores it on test.jsonl, attaches the adapter and scores again. It uses the same check function that cleaned the dataset, so the model is judged by the rules it was taught. A third run swaps the short system prompt for a long one with the 4 rules and 3 examples, which is the "prompt only" option from the first lesson. The results on the 40 messages:

:::matrix
title: Share of the 40 held-out replies that pass each rule
cols: greeting, short, next step, sign-off, all four
base, short prompt: 0.70, 0.35, 0.05, 0.10, 0.05
base, long prompt: 0.90, 0.75, 0.60, 0.80, 0.48
LoRA, short prompt: 1.00, 0.95, 0.90, 0.95, 0.85
:::

Read the first row. With no instructions beyond "you are aiworkshop support", the base model greets 28 of 40 customers, but it writes long replies and almost never adds a next step or the sign-off. Only 2 of 40 pass all four rules. The long prompt helps: 19 of 40. The adapter, with the short prompt, passes 34 of 40. The six failures are all one rule: four replies run to 62 to 70 words, and two replies have no next step. The pass rate on all four rules went from 5 percent to 85 percent, with a prompt that is 600 tokens shorter than the long one.

Now the second question. A judge model reads each reply with its policy note and answers one question: does the reply agree with the note? The base model scores 35 of 40 and the adapter 36 of 40. The fine-tune did not make the facts better or worse. The third question is forgetting. Five general questions, such as "What is 17 times 3?" and "Name the capital of Japan", get 5 correct answers before and 5 after. The adapter changed the style and nothing else you can measure. The step player walks one held-out message through compare.py.

:::scenario
title: One held-out message, before and after
state: model=base, passed=0 of 4
step: Load test.jsonl. Message 7 is from Omar: "Ordered Monday, nothing yet on Thursday. Is this late?" with the note "Standard delivery takes 3 to 5 working days".
step: The base model replies in 84 words with no greeting line and no sign-off. It explains the policy correctly. check returns greeting False, short False, next_step False, signoff False.
state: model=base, passed=0 of 4, facts=correct
step: Attach the adapter from train/adapter. The same prompt goes in.
state: model=LoRA
step: The reply is 44 words: "Hi Omar," then two sentences on the 3 to 5 day window, one Next step line, then "aiworkshop support". check returns all four True.
state: model=LoRA, passed=4 of 4, facts=correct
step: compare.py adds the result to the totals and moves to message 8. After 40 messages it prints both rows.
state: before=2 of 40, after=34 of 40
:::

Here is compare.py. It imports check from the dataset lesson and reuses the reply helper from the training lesson. Run it in the Colab notebook, or on any machine with a GPU, with test.jsonl and the adapter folder next to it.

:::code
lang: python
file: train/compare.py
import json
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
from peft import PeftModel
from check import check

NAME = "Qwen/Qwen2.5-0.5B-Instruct"
tok = AutoTokenizer.from_pretrained(NAME)
base = AutoModelForCausalLM.from_pretrained(NAME, torch_dtype=torch.float32).to("cuda")

def reply(model, messages):
    ids = tok.apply_chat_template(messages[:2], add_generation_prompt=True,
                                  return_tensors="pt").to("cuda")
    out = model.generate(ids, max_new_tokens=120, do_sample=False)
    return tok.decode(out[0][ids.shape[1]:], skip_special_tokens=True)

def score(model, rows):
    totals = {"greeting": 0, "short": 0, "next_step": 0, "signoff": 0, "all": 0}
    for row in rows:
        result = check(reply(model, row["messages"]), row["name"])
        for key, ok in result.items():
            totals[key] += ok
        totals["all"] += all(result.values())
    return {key: round(value / len(rows), 2) for key, value in totals.items()}

rows = [json.loads(line) for line in open("train/test.jsonl")]
print("before:", score(base, rows))
tuned = PeftModel.from_pretrained(base, "train/adapter")
print("after: ", score(tuned, rows))
:::

:::code
lang: text
before: {'greeting': 0.7, 'short': 0.35, 'next_step': 0.05, 'signoff': 0.1, 'all': 0.05}
after:  {'greeting': 1.0, 'short': 0.95, 'next_step': 0.9, 'signoff': 0.95, 'all': 0.85}
:::

The script uses messages[:2], the system and user messages only, so the model never sees the reply it is scored against. Generation uses do_sample=False, which picks the most likely token every time. That makes the run repeatable, so a second run gives the same 34. Each of the 80 generations takes about half a second on the T4, so the script finishes in under a minute.

## How it works

Evaluation first, then serving. The procedure for evaluation is short and you should run it after every training change.

:::anim
title: Message 7 scores the base model and the adapter
box test "test.jsonl" @ 130,290 icon: file
box base "Base model" @ 420,150 icon: model
box tuned "Base + adapter" @ 420,430 icon: train
box check "check: 4 rules" @ 710,290 icon: check
rect b1 @ 610,150 size: 80x50 "greeting"
rect b2 @ 690,150 size: 80x50 "short"
rect b3 @ 770,150 size: 80x50 "next"
rect b4 @ 850,150 size: 80x50 "sign-off"
rect t1 @ 610,430 size: 80x50 "greeting"
rect t2 @ 690,430 size: 80x50 "short"
rect t3 @ 770,430 size: 80x50 "next"
rect t4 @ 850,430 size: 80x50 "sign-off"
text m7 "Omar: Ordered Monday,|nothing yet on Thursday." @ 130,380 size: 16 color: yellow
num b_pass = 0 @ 420,225 prefix: "all four: " suffix: " of 40" size: 22 color: red
num t_pass = 0 @ 420,360 prefix: "all four: " suffix: " of 40" size: 22 color: green
num b_fact = 0 @ 130,150 prefix: "facts " suffix: " of 40" size: 22 color: grey
num t_fact = 0 @ 130,470 prefix: "facts " suffix: " of 40" size: 22 color: grey

step: Message 7 leaves test.jsonl: the note and the question from Omar. The model never sees the stored reply.
  show test, m7, base
  arrow test -> base : "note + message"
step: The base model writes 84 words with no greeting line and no sign-off.
  show check
  arrow base -> check : "84-word reply"
step: check tests the 4 rules. The base reply fails all four.
  show b1, b2, b3, b4
  color b1, b2, b3, b4 red
  & pulse b1, b2, b3, b4
step: Now attach the adapter from train/adapter. The same note and message go in.
  show tuned
  arrow test -> tuned : "same input"
step: The tuned model writes 44 words: Hi Omar, two sentences, one Next step line, the sign-off.
  arrow tuned -> check : "44-word reply"
  show t1, t2, t3, t4
  color t1, t2, t3, t4 green
  & pulse t1, t2, t3, t4
step: compare.py repeats this for all 40 messages. The base passes 2 of 40, the adapter 34.
  show b_pass, t_pass
  count b_pass -> 2 (2s)
  & count t_pass -> 34 (2s)
step: A judge checks the facts: 35 of 40 before, 36 after. The style changed, the facts did not.
  show b_fact, t_fact
  count b_fact -> 35 (1.5s)
  & count t_fact -> 36 (1.5s)
  highlight tuned
:::

1. Score the base model on the held-out set with the same check function as the data. This is the baseline.
2. Score the fine-tuned model the same way. Report both, rule by rule, as counts out of 40.
3. Read every failure. A pattern, such as replies of 62 to 70 words, tells you what to fix in the data.
4. Check facts with a judge or by hand on the same 40. The number should not fall.
5. Ask 5 general questions. If the fine-tuned model fails any that the base passes, train fewer epochs or a lower rank.

The judge for step 4 is the same idea as the answer grading in [Evaluating RAG](/courses/build-ai-ecosystem/retrieval-rag/evaluate-rag): a capable model reads the reply and the note and answers yes or no. Use the grader from that lesson with one changed question.

The table says what each measurement can and cannot tell you.

| Measurement | Tells you | Does not tell you |
| --- | --- | --- |
| Rule pass rate on 40 held-out | Whether the style transferred to new messages | Whether the replies are correct or kind |
| Judge: agrees with the note | Whether facts survived training | Whether the model knows anything beyond the note |
| 5 general questions | Whether forgetting is severe | Small losses on tasks you did not ask |
| Training loss | Whether the run learned the data | Anything about new messages |
| Reading 10 failures | What to fix next | How common it is, unless you count |

Now serving. The adapter is 8.7 MB, but the serving tools want one model. The function merge_and_unload adds B times A, scaled, into each W, and returns a plain model with no adapter. Save it in half precision, so the folder is about 988 MB, the same as the base.

:::code
lang: python
from peft import PeftModel
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

NAME = "Qwen/Qwen2.5-0.5B-Instruct"
tok = AutoTokenizer.from_pretrained(NAME)
base = AutoModelForCausalLM.from_pretrained(NAME, torch_dtype=torch.float16)
merged = PeftModel.from_pretrained(base, "train/adapter").merge_and_unload()
merged.save_pretrained("train/merged", safe_serialization=True)
tok.save_pretrained("train/merged")

from huggingface_hub import login
login()
merged.push_to_hub("yourname/aiworkshop-ft", private=True)
tok.push_to_hub("yourname/aiworkshop-ft", private=True)
:::

A merged model is a normal model, and any tool that loads Qwen2.5 loads it. Pushing to the Hugging Face Hub as a private repository is the easiest way to move 988 MB from Colab to your laptop. On the laptop, download it into the repository and create an Ollama model from it with a Modelfile. A Modelfile is Ollama's recipe: where the weights are, the system prompt, and the sampling settings.

:::code
lang: bash
hf download yourname/aiworkshop-ft --local-dir train/merged
:::

:::code
lang: text
file: train/Modelfile
FROM ./train/merged
SYSTEM You are aiworkshop support. Answer the customer using only the policy note.
PARAMETER temperature 0.3
PARAMETER num_predict 120
:::

:::code
lang: bash
ollama create aiworkshop-ft -f train/Modelfile
ollama run aiworkshop-ft "Policy note: Refunds are accepted within 30 days of delivery.
Customer (Priya): I got my order 12 days ago and want to return it. Can I?"
:::

:::code
lang: text
Hi Priya,
Yes. Your order arrived 12 days ago, which is inside the 30-day refund window.
Next step: reply with your order number and we will email a return label.
aiworkshop support
:::

Ollama reads the safetensors folder and converts it to its own format in about 20 seconds. The temperature of 0.3 keeps the replies close to the most likely tokens while allowing small variety, as in [Temperature and sampling](/courses/ai-foundations/using-models/sampling-and-temperature). On a laptop central processing unit (CPU) the 0.5B model writes about 30 tokens a second, so a 90-token reply takes about 3 seconds. Quantisation stores the weights in fewer bits. Add the flag --quantize q8_0 to ollama create and the model shrinks from 988 MB to about 530 MB with no change you can measure on the 40 messages.

Now the endpoint. Ollama listens on port 11434 and speaks a simple JSON API. The /reply endpoint in app/main.py sends the note, the name and the message, and returns the reply. The service already has the requests library from the builders-tools module.

:::code
lang: python
file: app/main.py (add to the existing file)
import requests
from pydantic import BaseModel

class ReplyIn(BaseModel):
    note: str
    name: str = ""
    message: str

@app.post("/reply")
def reply(body: ReplyIn):
    who = f"Customer ({body.name})" if body.name else "Customer"
    user = f"Policy note: {body.note}\\n{who}: {body.message}"
    r = requests.post("http://localhost:11434/api/chat", json={
        "model": "aiworkshop-ft", "stream": False,
        "messages": [{"role": "user", "content": user}]})
    r.raise_for_status()
    return {"reply": r.json()["message"]["content"], "model": "aiworkshop-ft", "cost_usd": 0}
:::

:::code
lang: bash
curl -s -X POST http://localhost:8000/reply -H "Content-Type: application/json" -d '{"note": "Standard delivery takes 3 to 5 working days.", "name": "Omar", "message": "Ordered Monday, nothing yet on Thursday. Is this late?"}'
:::

The system prompt lives in the Modelfile, so the endpoint sends only the user message. In the full service the note comes from the retriever: the /ask endpoint finds the chunk, and /reply writes the customer-facing answer from it. The picture shows where the fine-tuned model sits.

:::arch
title: The reply path with a local fine-tuned model
layer: Users | Browser
layer: Service | FastAPI app, Retriever
layer: Models | Ollama, aiworkshop-ft
layer: Data | Vector store
flow: Browser -> FastAPI app -> Retriever -> Vector store -> Retriever -> FastAPI app -> Ollama -> aiworkshop-ft -> Ollama -> FastAPI app -> Browser
note: aiworkshop-ft = the merged Qwen2.5-0.5B model with your style, 988 MB on disk
note: Ollama = runs on the same machine as the service, port 11434, no API key
:::

Ollama is right for a laptop and for a small server with no GPU. When you have a GPU and many requests at once, vLLM is the server to use. It batches requests together and serves a 0.5B model at hundreds of replies a second. It also speaks the OpenAI-compatible API, so the client code from [Call a model](/courses/build-ai-ecosystem/set-up-your-workshop/call-a-model) works with a changed base URL. vLLM can load the merged folder, or it can load the base model and the 8.7 MB adapter and keep both.

:::code
lang: bash
pip install vllm
vllm serve train/merged --served-model-name aiworkshop-ft --port 8001
# or: keep the base and attach the adapter by name
vllm serve Qwen/Qwen2.5-0.5B-Instruct --enable-lora --lora-modules aiworkshop-ft=train/adapter --port 8001
:::

:::code
lang: python
from openai import OpenAI

client = OpenAI(base_url="http://localhost:8001/v1", api_key="none")
out = client.chat.completions.create(model="aiworkshop-ft", temperature=0.3, messages=[
    {"role": "system", "content": "You are aiworkshop support. Answer the customer using only the policy note."},
    {"role": "user", "content": "Policy note: Refunds are accepted within 30 days of delivery.\\nCustomer (Priya): I got my order 12 days ago and want to return it. Can I?"}])
print(out.choices[0].message.content)
:::

| | Ollama | vLLM |
| --- | --- | --- |
| Runs on | Laptop CPU, Mac, small server | A machine with a GPU, or Colab |
| Input | Merged safetensors folder, or base plus adapter | Merged folder, or base plus adapters by name |
| Requests at once | One at a time by default | Hundreds, batched |
| Speed for one reply | About 3 seconds on a CPU | Under 0.3 seconds on a T4 |
| API | Its own JSON API on 11434, plus an OpenAI-compatible one | OpenAI-compatible on the port you choose |
| Best for | Development, demos, low volume | Production at volume |

The cost line from the first lesson is now real. The /reply endpoint returns cost_usd of 0. The machine that runs Ollama is the only cost, and the ship-it module puts it in the monthly total. The quality line is real too: 34 of 40, measured, not hoped for.

## Try it

:::exercise
title: Measure the serving numbers
task: With Ollama running aiworkshop-ft and the service running, send the 40 held-out messages to /reply from a Python loop. Record the time of each request and the check result. Print the mean time, the slowest time, and the number that pass all four rules. Then compare with the 34 of 40 from compare.py and explain any difference in one sentence.
hint: Use time.perf_counter around each requests.post call. The Modelfile sets temperature 0.3, while compare.py used do_sample=False, so a difference of 1 or 2 is normal.
lang: python
solution:
import json, time, requests
from check import check

rows = [json.loads(l) for l in open("train/test.jsonl")]
times, passed = [], 0
for row in rows:
    user = row["messages"][1]["content"]
    note, rest = user.split("\\n", 1)
    message = rest.split(": ", 1)[1]
    t = time.perf_counter()
    r = requests.post("http://localhost:8000/reply", json={
        "note": note.replace("Policy note: ", ""), "name": row["name"], "message": message})
    times.append(time.perf_counter() - t)
    passed += all(check(r.json()["reply"], row["name"]).values())
print("mean s:", round(sum(times) / len(times), 2), "max s:", round(max(times), 2))
print("pass all four:", passed, "of", len(rows))

# Typical laptop result: mean s: 3.1 max s: 4.6, pass all four: 33 of 40.
# One fewer than compare.py: temperature 0.3 adds variety, and one reply ran to 63 words.
:::

## Common mistakes

- Mistake: you score the model on train.jsonl and get 40 of 40. Fix: the held-out file is test.jsonl; a score on training data measures memory, not skill.
- Mistake: you report "the replies look much better" with no number. Fix: run compare.py and report counts out of 40 for each rule, before and after.
- Mistake: ollama create fails with an unsupported architecture or a missing tokenizer. Fix: save both the merged model and the tokenizer into train/merged, and check that config.json names a Qwen2 model.
- Mistake: /reply returns a connection error. Fix: start Ollama first; it must be listening on port 11434 before the service calls it.
- Mistake: the fine-tuned model answers a general question worse than the base model and you ship it anyway. Fix: treat forgetting as a failed test; retrain with fewer epochs or a lower rank.

## Check your understanding

:::quiz
title: Check: evaluate and serve
q: The base model passes 2 of 40 and the adapter passes 34 of 40. The judge gives 35 and 36 for facts. What did the fine-tune change?
- The facts the model knows
* The form of the replies, while facts stayed the same
- Both facts and form
why: The rule pass rate rose by 32 and the fact score moved by 1, within the noise of 40 examples.
q: Why does compare.py send only messages[:2] to the model?
- To save tokens
* So the model does not see the reply it is scored against
- Because the chat template allows only two messages
why: The third message is the answer; feeding it to the model would make the test meaningless.
q: What does merge_and_unload do?
- Deletes the adapter
* Adds the scaled B A product into each frozen matrix and returns a plain model
- Compresses the model to 4 bits
why: After the merge, serving tools see an ordinary model with the correction baked into the weights.
q: A reply from the served model is 63 words on a message that passed in compare.py. What is the most likely cause?
- The merge changed the weights
* The Modelfile uses temperature 0.3, so the output varies from the greedy run
- Ollama ignores the system prompt
why: Greedy decoding repeats exactly; sampling at 0.3 picks a slightly different token now and then.
q: You expect 500 requests a second from a web app on a GPU server. Which tool and why?
- Ollama, because it is simpler
* vLLM, because it batches many requests at once on the GPU
- Neither; use the Colab notebook
why: Ollama serves one request at a time by default; vLLM was built for concurrent serving.
q: Which test would catch catastrophic forgetting?
- The rule pass rate on the 40 messages
- The training loss curve
* A few general questions answered by the base and the tuned model
why: The style tests only measure the task you trained; forgetting shows up on tasks you did not train.
:::

## Go further

The Ollama import guide in the links covers both the merged folder and the adapter route, and the Modelfile reference lists every parameter. The vLLM documentation has a quickstart and a page on serving many LoRA adapters from one base model. This closes the training module: a decision, a dataset, an adapter, a number and an endpoint. The next module, [A Docker image for your service](/courses/build-ai-ecosystem/ship-it/dockerise), packages the service, and the capstone checklist includes the line that ollama run aiworkshop-ft must pass.
`,
    },
  ],
}
