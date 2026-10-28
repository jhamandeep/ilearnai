import type { Module } from '../../types'

export const mod: Module = {
  slug: 'what-ai-is',
  title: 'What AI is',
  description: 'Understand AI methods and outputs, compare rules with learning, follow the learning loop, and connect the parts of an AI service.',
  level: 'beginner',
  lessons: [
    {
      slug: 'the-four-circles',
      title: 'AI, machine learning, deep learning and generative AI',
      summary: 'Describe what an AI tool receives, produces, and learns. Use a familiar service task to separate model capabilities from human decisions.',
      minutes: 20,
      objectives: [
        'Explain how AI, machine learning, deep learning, and generative AI relate.',
        'Separate a tool’s method from the output it produces.',
        'Choose a rule, prediction, search, or generated draft for a familiar task.',
        'Name the evidence and human check needed before using a model output.',
      ],
      keyTerms: ['artificial-intelligence', 'machine-learning', 'deep-learning', 'generative-ai', 'neural-network', 'large-language-model', 'rule-based-system'],
      body: `
## What this lesson covers

This lesson helps you describe an AI tool without relying on marketing labels. You will separate its task, learning method, and output. You will also decide where a person must check the result.

You do not need code for this lesson. Keep one work example in mind: a service team answering questions about an organisation’s procedures.

## Why it matters

A service team wants to answer routine questions faster. Its manager considers an “AI assistant.” That name does not explain what the tool does. The team needs to know which information enters, what result comes out, and how staff use it.

Perhaps the team needs a better search box. Perhaps it needs to route requests to the right queue. Perhaps staff need a first draft of an answer. These are different tasks. They can use different methods, even inside one product.

Choosing the task first makes the discussion useful. You can compare the proposed tool with the existing process. You can ask whether its mistakes create extra work. You can also name the person responsible for checking each result.

The same thinking applies across fields. A retailer may prepare product descriptions. A teacher may adapt an exercise. A service desk may group incoming tickets. The details change, but you can still inspect the input, output, and review step.

:::video
id: i_LwzRVP7bg
why: Use the opening explanations of machine learning before the coding sections. Identify a model input and its expected output.
:::

## The idea with an example

> **Analogy.** A kitchen contains recipes, skilled cooks, and finished meals. A recipe describes a method; a meal describes an output. Calling something a “meal” does not tell you which method produced it. AI terms also describe different aspects of a system.

Artificial intelligence (AI) is a broad field of computer systems that perform tasks such as recognising patterns, planning, and generating language. Some approaches use explicit rules. Others learn patterns from data. A basic spreadsheet calculation is useful automation, but calling it AI usually adds little information.

Machine learning (ML) is an approach that fits a model to data. A model is a computational representation used to produce an output from an input. Training adjusts the model using examples or other feedback. Using the trained model on a new input is called inference.

Deep learning is machine learning that uses neural networks with multiple layers. A neural network transforms numerical inputs through connected calculations. Training adjusts numerical values called parameters. Deep learning can support classification, prediction, or generation.

Generative AI describes systems that create content, such as text, images, or audio. It describes an output capability. Modern language assistants commonly use deep neural networks. However, generative modelling is not limited to deep learning. Avoid treating these four terms as four exclusive product categories.

A single tool can therefore be both machine learning and generative AI. It can also use rules around the model. The labels overlap because they answer different questions.

Our fictional service team receives this request: “Where do I submit an expense receipt?” The approved procedure says to use the expense portal and attach a receipt. Consider three possible tools.

| Tool | Input | Output | What the team must check |
| --- | --- | --- | --- |
| A routing rule | A form with the category “expenses” | The finance-support queue | The rule matches the approved routing process |
| A learned classifier | The words in a request | A suggested request category | The category is correct on new requests |
| A drafting assistant | The question and approved procedure | A proposed answer | The answer matches the source and omits invented conditions |

A classifier predicts a category. The classifier might use a small statistical model or a deep neural network. Its job remains classification in either case. A drafting assistant creates wording. It might receive a category from the classifier before producing its answer.

Suppose the routing rule sends 20 correctly labelled forms to the finance queue. That shows the rule works for those forms. It says nothing about free-text requests with missing labels. A learned classifier could help with that messier input, but it needs examples and evaluation.

Now suppose a classifier assigns 18 of 20 new requests to the correct queue. The observed accuracy is 18 divided by 20, or 90%. Two requests still need correction. This small teaching sample does not establish performance on every department, language, or unusual request.

The drafting assistant has a different output to check. “Use the expense portal and attach your receipt” follows the fictional source. “Your expense will be paid tomorrow” adds a promise the source never made. Fluent wording does not make that promise true.

:::flow
title: A useful answer needs a task, evidence, and review
Staff question -> Approved guide: find the relevant procedure
Approved guide -> Draft answer: use the supplied evidence
Draft answer -> Staff review: check facts and missing conditions
Staff review -> Checked response: use the existing service process
:::

Follow the same request through the steps below. Notice where information becomes a draft and where a person checks it.

:::scenario
title: One expense question becomes a checked response
state: request=Where do I submit a receipt?, status=unanswered
step: A staff member opens the current expense procedure.
state: source=current approved procedure, status=evidence found
step: The assistant drafts an answer from the procedure.
state: output=Use the portal and attach the receipt, status=draft only
step: The staff member compares the draft with the source.
state: unsupported promises=none, status=checked
step: The staff member sends the checked guidance through the normal service process.
state: status=answered, payment approval=not decided
:::

## How it works

Use two questions instead of forcing every product into one circle. First ask what the system must produce. Then ask how it produces that result. Keep the surrounding work process visible too.

:::anim
title: Choose the task before choosing the AI label
context: A fictional service team wants to answer a question about submitting an expense receipt.
focus: Follow the question, the source, the proposed answer, and the person who checks it.
takeaway: A model can prepare an answer. The workflow must still establish which information is correct and who may act.
box question "Staff question" @ 130,180 size: 170x68 icon: user
box source "Approved guide" @ 370,180 size: 170x68 icon: database
box model "Drafting model" @ 620,180 size: 170x68 icon: model
box review "Staff review" @ 820,360 size: 170x68 icon: user
box answer "Checked response" @ 370,360 size: 180x68 icon: chat
text input "Where do I submit|an expense receipt?" @ 130,80 size: 18 color: grey
text draft "Use the portal.|Attach the receipt." @ 620,80 size: 18 color: teal
text check "Compare the wording|with the current source." @ 680,470 size: 18 color: grey

step: A staff member asks where to submit an expense receipt.
explain: Start with a specific task. A general request to add AI does not define success.
  show question, input
step: The workflow finds the current approved procedure.
explain: The model needs relevant evidence. A confident answer from memory can still be outdated or wrong.
  show source
  arrow question -> source : find evidence
step: The model drafts an answer using the supplied procedure.
explain: Drafting creates wording. It does not approve a payment or change the source policy.
  show model, draft
  arrow source -> model : source text
step: A staff member checks the draft against the source.
explain: The reviewer looks for invented promises, omitted conditions, and the wrong document version.
  show review, check
  arrow model -> review : proposed wording
step: The staff member shares the checked response.
explain: The final action uses the normal service process. The person remains responsible for the message.
  show answer
  arrow review -> answer : reviewed wording
  highlight answer
:::

1. Describe the result you need. Name a number, category, retrieved document, draft, or proposed action.
2. Identify the information available. Check whether the task has explicit rules, useful examples, or approved documents.
3. Inspect the method. Ask whether it follows rules, learns from data, or combines both.
4. Inspect the output separately. Ask whether it predicts a value, chooses a category, or generates content.
5. Define a check before using the result. Compare quality and effort with the current process.

| Question | Useful answer | Why it helps |
| --- | --- | --- |
| What work changes? | Staff prepare routine answers | Establishes a specific task |
| What does the model receive? | A question and an approved procedure | Makes the evidence visible |
| What does it return? | A draft with a source reference | Defines the output to inspect |
| Who checks it? | The member of staff handling the request | Gives the review an owner |
| What shows improvement? | Correct answers with less total preparation and correction time | Measures the whole task |

A source reference helps you inspect an answer, but the reference itself is not proof. Open the source. Check whether it supports the exact claim. Also check whether the source is current and applies to the request.

The distinction between training and inference prevents another common confusion. During training, the system adjusts model parameters. During inference, a trained model processes the supplied input. Adding a document to a prompt changes that input; it does not necessarily retrain the model.

A prompt is the information and instructions provided for a model interaction. A context window is the amount of input and generated material the model can handle in that interaction. A document outside the supplied context is not automatically available to the model. Products may add search and other tools to obtain information before answering.

You do not need to understand every mathematical detail to ask useful implementation questions. A manager can define acceptable answers. A team member can identify common exceptions. An architect can check which information the workflow can access. A delivery team can test the whole process on representative examples.

Greater model complexity is not automatically better. An exact rule may be appropriate when the condition is stable and explicit. Learned models can help when patterns are difficult to specify by hand. Generative tools can help prepare wording when a draft is the desired output. Each choice still needs a suitable test.

:::video
id: LPZh9BOjkQs
why: Watch how a language model produces text. Afterwards, explain why generating plausible words differs from checking a policy fact.
:::

## Try it

:::exercise
title: Design a small assistance task
task: Choose a repetitive task from your work or daily life. Write its input, desired output, available evidence, reviewer, and one unacceptable mistake. Decide whether a rule, prediction, search, or generated draft is useful. You can do this on paper in 5 minutes.
hint: Choose a narrow task, such as drafting a product description from a specification sheet. Do not begin with a tool name.
lang: text
solution:
Task: Draft a product description.
Input: Approved specifications for a 750 ml bottle.
Output: A short description that uses only those facts.
Evidence: Current product specification sheet.
Reviewer: The person responsible for product content.
Unacceptable mistake: Inventing a 24-hour insulation claim.
Approach: Generate a draft, then check every product claim.
A template may be enough if every description uses the same fixed fields.
:::

Explain your choice to another person. Ask them to identify one missing input or exception. Then revise the task description. This conversation often reveals more than comparing tool names alone.

## Common mistakes

- Mistake: treating AI, ML, deep learning, and generative AI as exclusive product categories. Fix: separate the method from the output capability.
- Mistake: assuming every useful automation needs a model. Fix: compare an explicit rule or template with the proposed model.
- Mistake: treating fluent wording as verified evidence. Fix: check the claims against suitable sources.
- Mistake: measuring only draft-generation time. Fix: include review, corrections, and the quality of the finished task.

## Check your understanding

:::quiz
title: Choose the useful explanation
q: A deep neural network classifies damaged product images. Which description fits?
* It uses deep learning for classification; it need not generate new content.
- It must be generative AI because all deep learning produces new content.
- It cannot be machine learning because it uses images.
why: Deep learning describes the method; classification describes the output task.
q: An assistant writes a response from an approved guide. Which check matters before using it?
- Whether the response sounds confident.
* Whether each claim follows from the current applicable source.
- Whether the response is longer than the source.
why: Confidence and length do not establish that a claim is supported.
q: A stable form field maps directly to one of three queues. What should the team compare first?
* A clear routing rule with the proposed model.
- The largest available model with no baseline.
- A text generator that invents a new queue for every form.
why: A rule may solve the exact task with less complexity and easier testing.
q: A model routes 18 of 20 new requests correctly. What can you conclude?
- Every future request will be routed correctly.
- The model is ready for every department.
* It achieved 90% accuracy on this small sample; broader evaluation is still needed.
why: The sample result does not establish performance on other populations or conditions.
q: You add a current procedure to a model prompt. What necessarily changes?
* The information available in this interaction.
- The model parameters are permanently retrained.
- Every future user automatically receives the same procedure.
why: Supplying context changes the interaction input; it does not necessarily change model parameters.
:::

## Go further

Use the chapter video sequence to compare an intuitive explanation with a longer worked lesson. The source links include Google’s introduction and terminology guide. Next, [Rules versus learning](/courses/ai-foundations/what-ai-is/rules-vs-learning) compares explicit instructions with a method learned from examples. For a work-focused route, explore [AI for your work](/for-work) and describe one bounded pilot in your own field.
`,
      links: [
        { label: 'Google: What is machine learning?', url: 'https://developers.google.com/machine-learning/intro-to-ml/what-is-ml', kind: 'docs' },
        { label: 'Google: Machine learning glossary', url: 'https://developers.google.com/machine-learning/glossary', kind: 'docs' },
        { label: 'Artificial intelligence (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Artificial_intelligence', kind: 'article' },
        { label: 'Machine learning (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Machine_learning', kind: 'article' },
        { label: 'Generative artificial intelligence (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Generative_artificial_intelligence', kind: 'article' },
        { label: 'Machine Learning Glossary (Google)', url: 'https://developers.google.com/machine-learning/glossary', kind: 'docs' },
      ],
    },
    {
      slug: 'rules-vs-learning',
      title: 'Rules versus learning',
      summary: 'After this lesson you can build the spam filter both as hand-written rules and as a model learned from 1,000 emails, and say when each approach wins.',
      minutes: 22,
      objectives: [
        'Write a rule-based spam filter in Python and show an email that breaks it.',
        'Compute a learned word score from counts on 1,000 labelled emails.',
        'Explain the difference between a rule a person writes and a rule a program learns.',
        'Choose rules or learning for a new task using a five-row decision table.',
      ],
      keyTerms: ['rule-based-system', 'machine-learning', 'training-data', 'model', 'prediction', 'program', 'algorithm'],
      body: `
## What this lesson covers

This lesson builds one spam filter two ways. First you write it as rules, in 10 lines of Python. Then you let a program learn it from 1,000 emails that a person already marked. You compare the two on the same emails and see where each one fails. At the end you can look at a new task and say whether rules or learning is the right tool.

## Why it matters

The whole of machine learning rests on one trade: a person stops writing the rule and instead collects examples. Every lesson after this one assumes you feel that trade in your hands. In the [Build the AI Ecosystem](/courses/build-ai-ecosystem/set-up-your-workshop/the-project-plan) track you will make the choice many times. The guardrails that block dangerous requests are rules. The model that answers questions is learned. The code that decides when to call a tool mixes both. The next lesson, [The learning loop](/courses/ai-foundations/what-ai-is/the-learning-loop), shows the exact steps a program takes to learn, using the house-price table.

:::video
id: i_LwzRVP7bg
why: Watch the first 12 minutes. The teacher defines machine learning as learning from examples, and introduces features and labels with a real data set. Stop when the code starts; you will return to this course in the next module.
:::

## The idea with an example

> **Analogy.** You want to teach a new worker to spot a ripe mango. One way is to write rules: yellow skin, a little soft, a sweet smell at the stem. The worker reads the rules and follows them. The other way is to show the worker 50 mangoes, say ripe or not ripe for each one, and let the worker work out the pattern. The first way is fast to start and easy to explain. The second way handles the strange green mango that is ripe anyway, because the worker saw one like it.

:::anim
title: One email scored two ways: by a written rule and by learned shares
context: The same email is checked using an explicit rule and numbers learned from example emails.
focus: Compare where each decision comes from. A learned score is still a quantity that needs evaluation.
takeaway: Choose a rule when the condition is clear; evaluate learned predictions when the patterns are less explicit.
rect w1 @ 230,150 size: 160x50 "free" color: yellow
rect w2 @ 480,150 size: 160x50 "meeting"
rect w3 @ 730,150 size: 160x50 "tomorrow"
num s1 = 0 @ 230,230 digits: 2 size: 26 color: blue
num s2 = 0 @ 480,230 digits: 2 size: 26 color: blue
num s3 = 0 @ 730,230 digits: 2 size: 26 color: blue
box rules "Rule filter" @ 200,340 size: 200x64 icon: code
box learned "Learned filter" @ 760,340 size: 200x64 icon: training
num total = 0 @ 480,340 prefix: "sum = " digits: 2 size: 26
num avg = 0 @ 480,420 prefix: "average = " digits: 2 size: 28 color: yellow
text line "spam if the average is above 0.5" @ 480,470 size: 16 color: grey
text rv "spam: wrong" @ 200,420 size: 20 color: red
text lv "normal: right" @ 760,420 size: 20 color: green

step: The email Free meeting tomorrow arrives. It has three words.
  show w1, w2, w3
step: The rule filter looks for the word free. It finds it, so it says spam. That is wrong.
  show rules
  arrow w1 -> rules : free
  show rv
step: The learned filter has a share for each word, counted from 1,000 marked emails. Nobody typed them.
  show learned
  show s1, s2, s3
  count s1 -> 0.87
  & count s2 -> 0.03
  & count s3 -> 0.10
step: It adds the three shares: 0.87 plus 0.03 plus 0.10 is 1.00.
  show total
  arrow s1 -> total
  arrow s2 -> total
  arrow s3 -> total
  & count total -> 1.00
step: Divide by the 3 known words. The average is 0.33, which is below the 0.5 line.
  show avg, line
  arrow total -> avg : "/ 3"
  & count avg -> 0.33
step: So the learned filter says normal. That is right: meeting and tomorrow pulled the score down.
  arrow avg -> learned : "below 0.5"
  show lv
  highlight w2, w3
  dim rules, rv
:::

A rule-based system is a program whose decisions follow if-then rules that a person wrote. Here is the spam filter as rules. The function takes the text of an email and returns True for spam.

:::code
lang: python
file: spam_rules.py
def is_spam_rules(text):
    text = text.lower()
    if "free" in text:
        return True
    if "prize" in text:
        return True
    if text.count("!") > 3:
        return True
    return False

print(is_spam_rules("Free prize! Click now"))       # True
print(is_spam_rules("Meeting tomorrow at 10"))      # False
print(is_spam_rules("Fr33 pr1ze, click now"))       # False, but it is spam
print(is_spam_rules("Feel free to join the meeting"))  # True, but it is not spam
:::

The first two answers are right. The last two are wrong, and they show the two ways rules fail. The third email spells free as fr33, so the rule does not match. The fourth email uses free in a normal sentence, so the rule matches when it should not. You can add rules to fix both. Then a spammer changes the spelling again, and a colleague writes free lunch in a meeting invite. The person who writes the rules is always one step behind.

Now the second way. Instead of writing rules, you collect training data. Training data is a set of examples with the right answers. Suppose you have 1,000 past emails, and a person marked each one as spam or normal. 300 are spam and 700 are normal. The program counts, for each word, how many spam emails and how many normal emails contain it. Here are the counts for 5 words.

| Word | In spam emails (of 300) | In normal emails (of 700) | Spam share |
| --- | --- | --- | --- |
| free | 240 | 35 | 240 / 275 = 0.87 |
| prize | 150 | 10 | 150 / 160 = 0.94 |
| click | 180 | 60 | 180 / 240 = 0.75 |
| tomorrow | 20 | 180 | 20 / 200 = 0.10 |
| meeting | 6 | 210 | 6 / 216 = 0.03 |

The spam share of a word is the number of spam emails that contain it, divided by the number of all emails that contain it. For the word free, that is 240 divided by 275, which is 0.87. A share near 1 means the word almost only appears in spam. A share near 0 means it almost only appears in normal mail. Nobody typed these numbers. The program computed them from the examples.

To score a new email, the program takes the share of each word it knows and averages them. If the average is above 0.5, the prediction is spam. A prediction is the output the model gives for one input. Take the email Free prize tomorrow. The shares are 0.87, 0.94 and 0.10. The average is 1.91 divided by 3, which is 0.64. That is above 0.5, so the prediction is spam. Take Meeting tomorrow. The shares are 0.03 and 0.10, the average is 0.065, so the prediction is normal.

:::flow
title: Two ways to build one filter
Person -> Rules: writes free, prize and 3 marks
Rules -> Verdict: checks each new email
Person -> 1,000 emails: marks each spam or normal
1,000 emails -> Word shares: counts give a share per word
Word shares -> Verdict: average the shares, compare to 0.5
:::

Press Next to score the email Free meeting tomorrow both ways. This is the email that breaks the rules.

:::scenario
title: Score the email Free meeting tomorrow
state: email=Free meeting tomorrow, rules=none, learned=none
step: The rule filter lowercases the text and looks for free. It finds it and returns True.
state: rules=spam (wrong)
step: The learned filter looks up the share of each word. free is 0.87, meeting is 0.03, tomorrow is 0.10.
state: shares=0.87 and 0.03 and 0.10
step: It averages the three shares. 0.87 plus 0.03 plus 0.10 is 1.00. Divided by 3 is 0.33.
state: average=0.33
step: 0.33 is below 0.5, so the learned filter predicts normal. The words meeting and tomorrow pulled the score down.
state: learned=normal (right)
:::

The learned filter got this one right, because the examples taught it that meeting and tomorrow are normal words. The rule filter cannot know that, because nobody wrote a rule about meeting. This is the heart of machine learning: the program learns a number for every word, and the numbers come from the data, not from a person.

## How it works

The learned filter has the same shape as every machine learning system. Here are its parts, which you will meet again in the next lesson as the learning loop.

1. Collect training data: 1,000 emails, each with the right answer.
2. Choose a model: a share for each word, and an average compared with 0.5. A model is a function with adjustable numbers that turns an input into a prediction. Here the adjustable numbers are the word shares.
3. Fit the model: compute each share from the counts. This step is the learning.
4. Predict: for a new email, look up the shares, average them and compare with 0.5.
5. Check: run the filter on emails it has not seen and count the mistakes.

Here is the learned filter in Python, with the counts from the table typed in as the training result.

:::code
lang: python
file: spam_learned.py
spam_count = {"free": 240, "prize": 150, "click": 180, "tomorrow": 20, "meeting": 6}
normal_count = {"free": 35, "prize": 10, "click": 60, "tomorrow": 180, "meeting": 210}

share = {}
for word in spam_count:
    share[word] = spam_count[word] / (spam_count[word] + normal_count[word])

def is_spam_learned(text):
    scores = []
    for word in text.lower().split():
        if word in share:
            scores.append(share[word])
    if not scores:
        return False
    return sum(scores) / len(scores) > 0.5

print(round(share["free"], 2), round(share["meeting"], 2))  # 0.87 0.03
print(is_spam_learned("Free prize tomorrow"))   # True
print(is_spam_learned("Meeting tomorrow"))      # False
print(is_spam_learned("Free meeting tomorrow"))  # False
:::

:::code
lang: text
0.87 0.03
True
False
False
:::

Notice what the program does not do. It does not know what free means. It does not know that prize is a noun. It only counts. The counts are the knowledge, and the knowledge grows when you add more marked emails. If spammers start to write fr33, the word fr33 soon appears in 50 spam emails and 0 normal ones, its share becomes 1.00, and the filter catches it. Nobody wrote a new rule.

The learned filter has limits too. It only knows words it has seen. The share ignores how common spam is overall, and the lesson [Conditional probability and Bayes' rule](/courses/math-from-zero/chance/conditional-and-bayes) shows how to fix that with the same 1,000 emails. And it needs the 1,000 marked emails to exist. Marking them is work that a person does. Learning moves the human work from writing rules to collecting and marking examples. It does not remove it.

### When rules win and when learning wins

Both approaches are tools. The table tells you which one to pick.

| Question about the task | Rules win | Learning wins |
| --- | --- | --- |
| Can a person state the rule exactly? | yes, such as a tax rate of 20 percent | no, such as what a ripe mango looks like |
| How many examples with answers exist? | few or none | thousands or more |
| Is the input clean or messy? | clean, such as a form field | messy, such as free text or photos |
| Must every decision be explained? | yes, such as a legal limit | a score is enough |
| Does the pattern change over time? | rarely | often, such as spam tricks |

Here is the house example through the same table. A person can state a rough rule: 3,000 per square metre. But the exact number is not known, the table gives 6 examples, and the price depends on size, city and garden in a messy way. Learning wins, and the learned number is about 3,020 per square metre. For the sales tax on that house, the rule is exact and written in law. Rules win, and nobody should learn a tax rate from examples.

Real systems mix the two. A bank uses a learned model to score a payment for fraud, and a rule to block any payment above 10,000 while the score is checked. A chat product uses a learned model to write answers, and rules to refuse some requests. When you build your own system, draw the line on purpose: rules where the rule is exact or the risk is high, learning where the pattern is messy and the examples are many.

### Bring the idea into a work decision

Consider a fictional service desk. A form has a required department field. An explicit rule can send “Finance” to the finance queue. The rule is easy to inspect because the field has an agreed meaning.

Now consider free-text requests such as “My receipt upload failed.” The department is not stated. A learned classifier could suggest a queue from examples. Staff must still check uncertain or unusual requests.

| Situation | First approach to compare | Evidence to collect |
| --- | --- | --- |
| Exact category already supplied | A routing rule | Correct routing for every allowed category |
| Category hidden in varied wording | A learned suggestion | Results on new requests and common exceptions |
| Missing essential information | Ask a clarifying question | Whether the reply resolves the uncertainty |

Do not use learning to hide an undefined process. First agree the categories and who owns them. Then compare the rule and model on the same examples. Include requests that belong to no available category. The system needs a way to leave these unassigned.

A manager can count corrections. A team member can explain the exceptions. A builder can implement the fallback. These contributions address the same work problem from different roles.

## Try it

:::exercise
title: Score three emails by hand, then in Python
task: Use the share table from this lesson. Score the emails "click the prize", "meeting tomorrow at 10" and "free click" by hand. Write the average share and the prediction for each. Then run spam_learned.py with the three emails added and check your answers.
hint: Only the words in the table count. In "meeting tomorrow at 10", the words at and 10 are unknown and are skipped. The average is the sum of the known shares divided by how many known words there are.
lang: text
solution:
"click the prize": click 0.75, prize 0.94. Average 1.69 / 2 = 0.845. Spam.
"meeting tomorrow at 10": meeting 0.03, tomorrow 0.10. Average 0.13 / 2 = 0.065. Normal.
"free click": free 0.87, click 0.75. Average 1.62 / 2 = 0.81. Spam.

In Python, add:
print(is_spam_learned("click the prize"))        # True
print(is_spam_learned("meeting tomorrow at 10"))  # False
print(is_spam_learned("free click"))             # True
:::

## Common mistakes

- Mistake: you think the learned filter understands English. Fix: it only counts which words appear with which label; the counts are the whole of its knowledge.
- Mistake: you think learning removes the human work. Fix: a person still has to mark 1,000 emails; learning moves the work from writing rules to collecting and marking examples.
- Mistake: you add rule after rule to a rule filter until nobody can read it. Fix: when the rules pass about 20 and still miss cases, the pattern is messy; switch to learning.
- Mistake: you learn something that should be a rule, such as a tax rate or a safety limit. Fix: if a person can state the rule exactly and the cost of error is high, write the rule.
- Mistake: you test the learned filter on the same 1,000 emails it learned from. Fix: keep some marked emails aside and test on those; the next lessons explain why.

## Check your understanding

:::quiz
title: Check: rules versus learning
q: A word appears in 90 spam emails and 10 normal emails. What is its spam share?
- 0.10
* 0.90
- 9.0
why: The share is 90 divided by the 100 emails that contain the word, which is 0.90.
q: The email "prize meeting" arrives. With the shares from the lesson, what does the learned filter predict?
* Normal, because (0.94 + 0.03) / 2 is 0.485, which is below 0.5
- Spam, because prize is in the email
- Spam, because 0.94 is above 0.5
why: The filter averages all known words, and 0.485 is below the 0.5 line, so the prediction is normal.
q: Spammers start to write fr33 instead of free. Which filter adapts without a person writing new code?
- The rule filter, because it lowercases the text
* The learned filter, once new marked emails with fr33 are added
- Neither
why: The learned filter gains a share for fr33 as soon as marked examples contain it; the rule filter needs a person to add a rule.
q: You must apply a 20 percent sales tax to every house price. Rules or learning?
* Rules, because the rate is exact and known
- Learning, because there are 6 examples
- Learning, because prices are messy
why: When a person can state the rule exactly and errors are costly, a written rule is correct and explainable.
q: Which human job does learning create that rules do not need?
- Writing the if statements
* Collecting and marking examples
- Running the program
why: Learning needs training data with the right answers, and a person has to produce those answers.
:::

## Go further

The links include Paul Graham's 2002 essay A Plan for Spam, which built a word-share filter very close to the one in this lesson and changed how email filters work. The Wikipedia page on naive Bayes spam filtering gives the proper version with base rates. The Google crash course has a short page on the same framing of rules versus learned models. The next lesson, [The learning loop](/courses/ai-foundations/what-ai-is/the-learning-loop), replaces the counting step with the general method that trains every model, from the price line to a large language model.
`,
      links: [
        { label: 'A Plan for Spam (Paul Graham)', url: 'https://www.paulgraham.com/spam.html', kind: 'article' },
        { label: 'Naive Bayes spam filtering (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering', kind: 'article' },
        { label: 'Introduction to Machine Learning (Google crash course)', url: 'https://developers.google.com/machine-learning/intro-to-ml', kind: 'course' },
        { label: 'Expert system (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Expert_system', kind: 'article' },
      ],
    },
    {
      slug: 'the-learning-loop',
      title: 'The learning loop',
      summary: 'After this lesson you can draw the one picture of machine learning, data, model, loss, update, evaluate, and run three steps of it by hand on the house-price table.',
      minutes: 25,
      objectives: [
        'Name the five parts of the learning loop: data, model, loss, update, evaluate.',
        'Compute the mean squared error of a one-parameter price model on the 6-row house table.',
        'Compute one update step by hand and explain what the learning rate does.',
        'Run the loop in Python and read the loss going down.',
        'Explain why evaluation uses a house that is not in the training data.',
      ],
      keyTerms: ['learning-loop', 'model', 'training-data', 'loss', 'parameter', 'training', 'learning-rate', 'evaluation'],
      body: `
## What this lesson covers

This lesson gives you the one picture that the whole field of machine learning fits into: data goes into a model, a loss measures how wrong the model is, an update makes the model a little less wrong, and evaluation checks the model on data it has not seen. You run this loop by hand on the 6-row house-price table, with one adjustable number, and watch the loss fall from 7,650 to 100 in 3 steps. At the end you can point at any machine learning system and name its five parts.

## Why it matters

Every model you will meet trains with this loop. The price line in [Predict a number: linear regression](/courses/ai-foundations/first-models/linear-regression) has 2 parameters. A small neural network in [Loss and gradient descent for a network](/courses/ai-foundations/neural-networks/loss-and-descent) has a few hundred. A large language model has billions, and its training in [How an LLM is made](/courses/ai-foundations/language-as-numbers/how-an-llm-is-made) is the same loop run on thousands of computers for months. If you understand the loop with one number, you understand it with a billion. The update step uses the slope idea from [Minimising a function by following the slope](/courses/math-from-zero/change-and-gradients/follow-the-slope), so read that lesson first if the word slope feels new. The next lesson, [The AI ecosystem map](/courses/ai-foundations/what-ai-is/the-ai-ecosystem-map), puts this loop in its place among all the other parts of a real system.

:::video
id: sDv4f4s2SB8
why: Watch the first 12 minutes. StatQuest fits a line to a few points by stepping the intercept downhill, which is the same update step this lesson does for the slope w. Stop when the video moves to two parameters.
:::

## The idea with an example

> **Analogy.** You are tuning a guitar string by ear. You pluck it and compare the note with a tuning fork: that is the loss, the gap between the sound and the target. If the note is too low, you turn the peg a little to tighten: that is the update. You pluck again. Each turn is smaller as you get close. If you turn too hard, you shoot past the note and must come back. After a few turns the string is in tune. Then you play a song to check that it sounds right in use: that is evaluation.

:::anim
title: Three update steps roll w down the loss curve
context: A small price model adjusts one parameter to reduce its error on example houses.
focus: Watch the parameter move, then compare the corresponding loss.
takeaway: Lower training loss is evidence about the training examples. Check separate examples before claiming useful generalisation.
axes ax @ 90,60 size: 540x400 x: 1.6,4.4 y: 0,16000 xlabel: "w" ylabel: "loss"
curve loss on ax = 7250*x^2 - 43800*x + 66250 color: blue label: "loss"
dot ball on ax @ 2,7650 r: 9 color: yellow
tangent tan on loss at 2 len: 0.5 color: orange
num wv = 2 @ 800,150 prefix: "w = " digits: 2 size: 30
num lossv = 7650 @ 800,220 prefix: "loss = " digits: 0 size: 26 color: blue
num slopev = -14800 @ 800,290 prefix: "slope = " digits: 0 size: 26 color: orange
text note "w moves by|minus 0.00005 times the slope" @ 800,380 size: 17 color: grey
text evalt "Test house, 80 m2:|model says 240, sold for 250" @ 800,460 size: 17 color: green

step: This curve is the loss for every value of w. Lower is better. The model cannot see it.
  show ax
  draw loss
step: Start with the guess w equals 2. The loss there is 7,650: every prediction is too low.
  show ball, wv, lossv
  pulse ball
step: The slope under the ball is minus 14,800. A negative slope means the loss falls when w grows.
  show tan, slopev
step: Update: w moves by minus 0.00005 times the slope, which is plus 0.74. The ball rolls to 2.74.
  show note
  walk ball along loss from 2 to 2.74 (2s)
  & tangent tan -> 2.74 (2s)
  & count wv -> 2.74 (2s)
  & count lossv -> 668 (2s)
  & count slopev -> -4070 (2s)
step: The loss is 668. The slope is smaller, so the step is smaller: w becomes 2.94, loss 140.
  walk ball along loss from 2.74 to 2.9435 (1.5s)
  & tangent tan -> 2.9435 (1.5s)
  & count wv -> 2.9435 (1.5s)
  & count lossv -> 140 (1.5s)
  & count slopev -> -1119 (1.5s)
step: One more step: w reaches 3.00 and the loss is 100. The slope is nearly zero, so the steps stop.
  walk ball along loss from 2.9435 to 2.9995 (1.5s)
  & tangent tan -> 2.9995 (1.5s)
  & count wv -> 2.9995 (1.5s)
  & count lossv -> 100 (1.5s)
  & count slopev -> -67 (1.5s)
  highlight ball
step: Evaluate on a house not in the table: 80 square metres. The model says 240; it sold for 250.
  hide note
  show evalt
  pulse evalt
:::

Here is the running example. The house-price table has 6 rows. To keep the numbers small, prices are in thousands of pounds, so 150000 becomes 150.

| id | size_m2 | price (thousands) |
| --- | --- | --- |
| 1 | 50 | 150 |
| 2 | 70 | 210 |
| 3 | 90 | 260 |
| 4 | 120 | 380 |
| 5 | 60 | 170 |
| 6 | 100 | 300 |

Data. The table is the training data: 6 examples, each with an input, the size, and a right answer, the price.

Model. A model is a function with adjustable numbers that turns an input into a prediction. The model here is the simplest one possible: price equals w times size. The number w is the only parameter. A parameter is an adjustable number inside a model that training changes. If w is 2, the model says a 50 square metre house costs 2 times 50, which is 100 thousand. We start with w equal to 2, which is a guess.

Loss. The loss is one number that says how wrong the model is on the training data. For each house, the error is the prediction minus the real price. With w equal to 2, house 1 is predicted at 100 and sold for 150, so the error is minus 50. The table gives all 6.

| House | size | price | prediction (w = 2) | error | error squared |
| --- | --- | --- | --- | --- | --- |
| 1 | 50 | 150 | 100 | -50 | 2500 |
| 2 | 70 | 210 | 140 | -70 | 4900 |
| 3 | 90 | 260 | 180 | -80 | 6400 |
| 4 | 120 | 380 | 240 | -140 | 19600 |
| 5 | 60 | 170 | 120 | -50 | 2500 |
| 6 | 100 | 300 | 200 | -100 | 10000 |

We square each error so that negative and positive errors do not cancel, and so that big errors count more. The squares add up to 45,900. Divided by 6 houses, that is 7,650. This number is the mean squared error (MSE), the most common loss for predicting a number. A loss of 7,650 is bad. The goal of training is to make it small.

Update. The update changes w to reduce the loss. Which way should w move? Every error is negative, which means every prediction is too low, so w must grow. By how much? The slope of the loss tells us. The slope of the mean squared error with respect to w is 2 divided by 6, times the sum over houses of error times size. For house 1 that product is minus 50 times 50, which is minus 2,500. The six products add up to minus 44,400. Times 2 divided by 6, the slope is minus 14,800. A negative slope means the loss goes down when w goes up, which agrees with the guess.

We do not move w by 14,800. We move it by the slope times a small number called the learning rate. The learning rate is 0.00005 here. The step is minus 0.00005 times minus 14,800, which is plus 0.74. So w becomes 2 plus 0.74, which is 2.74. Press Next to watch three updates in a row.

:::scenario
title: Three steps of the learning loop on the house table
state: w=2.00, loss=7650, slope=-14800
step: Predict with w equal to 2. All six predictions are too low. The loss is 7,650 and the slope is minus 14,800.
step: Update: w becomes 2 minus 0.00005 times minus 14,800, which is 2.74. Predict again. The loss falls to 668.
state: w=2.74, loss=668, slope=-4070
step: Update: w becomes 2.74 plus 0.2035, which is 2.94. The loss falls to 140. The slope is smaller because the model is close.
state: w=2.94, loss=140, slope=-1119
step: Update: w becomes 2.94 plus 0.056, which is 3.00. The loss is 100. Houses 3, 4 and 5 still miss by 10 to 20, because price depends on more than size.
state: w=3.00, loss=100, slope=-67
step: Evaluate: a new house of 80 square metres, not in the table, sold for 250. The model predicts 3.00 times 80, which is 240. The error on unseen data is 10.
state: test house=80 m2, prediction=240, real=250, test error=10
:::

Three steps took the loss from 7,650 to 100, and w from a guess of 2 to 3.00. The exact best value of w for this table is 3.02, and the loss cannot fall below about 97 with one parameter, because the city and the garden also move the price. A model with more parameters, which the next module builds, can go lower.

:::flow
title: The learning loop
Data -> Model: 6 sizes go in
Model -> Loss: 6 predictions meet 6 prices
Loss -> Update: the slope says which way to move w
Update -> Model: w moves from 2 to 2.74
Model -> Evaluate: test on a house not in the table
:::

## How it works

The loop is the same for every model. Here is the general form, with the house numbers beside each step.

1. Collect training data: examples with the right answers. Here, 6 sizes and 6 prices.
2. Choose a model and give its parameters starting values. Here, price equals w times size, with w equal to 2.
3. Predict on all the training data. Here, 6 predictions.
4. Compute the loss: one number from all the errors. Here, mean squared error, 7,650.
5. Compute the slope of the loss for each parameter. Here, minus 14,800 for w.
6. Update each parameter: subtract the learning rate times its slope. Here, w becomes 2.74.
7. Repeat steps 3 to 6 until the loss stops falling. Here, 3 steps.
8. Evaluate on data the model has not seen. Here, the 80 square metre house.

The formulas are short. The loss is
$$L(w) = \\frac{1}{6} \\sum_{i=1}^{6} (w \\cdot x_i - y_i)^2$$
which says: for each house i, multiply w by the size x and subtract the price y, square the result, add the six squares, and divide by 6. The update is
$$w \\leftarrow w - \\eta \\cdot \\frac{dL}{dw}$$
which says: the new w is the old w minus the learning rate eta times the slope of the loss. The slope for this loss is
$$\\frac{dL}{dw} = \\frac{2}{6} \\sum_{i=1}^{6} (w \\cdot x_i - y_i) \\cdot x_i$$
which says: for each house, multiply the error by the size, add the six products, and multiply by 2 over 6. This update rule is called gradient descent, and the lesson [Minimising a function by following the slope](/courses/math-from-zero/change-and-gradients/follow-the-slope) explains where it comes from.

| Part of the loop | Everyday name | In the house example | In a large language model |
| --- | --- | --- | --- |
| Data | the examples | 6 sizes and prices | trillions of words of text |
| Model | the guessing machine | price = w times size, 1 parameter | a transformer, billions of parameters |
| Loss | how wrong | mean squared error, 7,650 at the start | cross-entropy on the next token |
| Update | the nudge | gradient descent, learning rate 0.00005 | gradient descent with Adam, a tiny learning rate |
| Evaluate | the test | the 80 m2 house | held-out text and benchmarks |

Here is the whole loop in Python. It uses only lists and a for loop, so it runs anywhere.

:::code
lang: python
file: learning_loop.py
sizes = [50, 70, 90, 120, 60, 100]          # square metres
prices = [150, 210, 260, 380, 170, 300]     # thousands of pounds

w = 2.0            # the one parameter: thousands per square metre
learning_rate = 0.00005

for step in range(1, 4):
    predictions = [w * s for s in sizes]
    errors = [p - y for p, y in zip(predictions, prices)]
    loss = sum(e * e for e in errors) / len(errors)
    slope = 2 * sum(e * s for e, s in zip(errors, sizes)) / len(errors)
    print(f"step {step}: w = {w:.2f}, loss = {loss:.0f}, slope = {slope:.0f}")
    w = w - learning_rate * slope

predictions = [w * s for s in sizes]
loss = sum((p - y) ** 2 for p, y in zip(predictions, prices)) / len(prices)
print(f"after 3 steps: w = {w:.2f}, loss = {loss:.0f}")
print(f"new house of 80 m2: predicted {w * 80:.0f}, sold for 250")
:::

:::code
lang: text
step 1: w = 2.00, loss = 7650, slope = -14800
step 2: w = 2.74, loss = 668, slope = -4070
step 3: w = 2.94, loss = 140, slope = -1119
after 3 steps: w = 3.00, loss = 100
new house of 80 m2: predicted 240, sold for 250
:::

### The learning rate

The learning rate is the one number in the loop that you choose, and it decides whether training works. With 0.00005, w moves 2.00, 2.74, 2.94, 3.00: fast at first and gentle near the answer. With a learning rate ten times smaller, 0.000005, the first step moves w by only 0.074, and reaching 3 takes about 60 steps. With a learning rate ten times larger, 0.0005, the first step moves w by 7.4, to 9.4, which is far past 3. The next slope is huge and positive, the step throws w to a large negative number, and the loss grows at every step instead of falling. Too small is slow. Too large explodes. People try a few values and keep the one whose loss falls fastest without blowing up.

### Why evaluate on a house that is not in the table

The loss measures the model on the examples it learned from. That is not the question you care about. You care about the next house, the one the model has never seen. A model can fit its training data very well and still be bad on new data; the lesson [Overfitting, underfitting and cross-validation](/courses/ai-foundations/first-models/overfitting-and-generalisation) shows how. So you keep some examples out of training and measure on them at the end. Here the 80 square metre house is the test. The model predicts 240 and the house sold for 250. An error of 10 on unseen data, after training on only 6 rows, is a good sign.

### What improvement looks like outside the training loop

Imagine a fictional team forecasting the time needed to prepare service reports. Its first model misses the true preparation time by 12 minutes on average. After more training, the average training error falls to 3 minutes.

That improvement is not enough to approve the model. The team also checks reports that did not guide the training. Suppose their average error remains 11 minutes. The model has improved on familiar examples but has not shown a similar improvement on new work.

:::scenario
title: A better training score does not settle the work decision
state: training error=12 minutes, new-report error=11 minutes
step: Train on the existing examples and measure the training error again.
state: training error=3 minutes, new-report error=11 minutes
step: Evaluate on separate reports that did not guide the updates.
state: evidence=small improvement on new work
step: Inspect failures and revise the plan before using the forecast for staffing.
state: next action=investigate rather than assume success
:::

Keep the target definition stable. “Preparation time” could exclude waiting, review, or corrections. If people measure it differently, the model learns from inconsistent examples. Agree the meaning of the target before changing the training settings.

## Try it

:::exercise
title: Run the loop with a different learning rate
task: Save learning_loop.py and run it. Then change learning_rate to 0.0005 and run it again. Write down what happens to w and to the loss at each step. Then try 0.000005 and change range(1, 4) to range(1, 61) to see how many steps it needs.
hint: With 0.0005 the first step moves w by 7.4. Look at the sign of the slope on step 2. With 0.000005 the loss falls slowly; print only every tenth step if the output is long.
lang: text
solution:
With learning_rate = 0.0005:
step 1: w = 2.00, loss = 7650, slope = -14800
step 2: w = 9.40, loss = 295140, slope = 92500
step 3: w = -36.85, loss = 11525218, slope = -578125
after 3 steps: w = 252.21, loss = 450200145
The loss grows at every step. The learning rate is too large and w swings further each time.

With learning_rate = 0.000005 and 60 steps:
step 1: w = 2.00, loss = 7650
step 2: w = 2.07, loss = 6595
step 3: w = 2.14, loss = 5687
...
step 60: w = 3.01, loss = 98
w creeps from 2.00 toward 3.00. The learning rate is too small, so the loop needs 60 steps instead of 3.
:::

## Common mistakes

- Mistake: you think the model understands houses. Fix: the model is one multiplication; training only chose the number 3.00 because it made the squared errors small.
- Mistake: you add the raw errors instead of squaring them. Fix: positive and negative errors cancel when added, so a bad model can show a loss of 0; square the errors first.
- Mistake: you move w by the whole slope. Fix: the slope only gives the direction and a rough size; multiply it by a small learning rate, and lower the rate if the loss grows.
- Mistake: you report the loss on the training data as the quality of the model. Fix: measure on examples the model did not train on; that number is what the next house will look like.
- Mistake: you think more steps always help. Fix: once the loss stops falling, more steps change nothing with this model; a lower loss needs a better model or more data.

## Check your understanding

:::quiz
title: Check: the learning loop
q: With w equal to 2, every prediction is below the real price. What does the update do to w?
- Makes it smaller
* Makes it larger
- Leaves it unchanged
why: The slope is negative, so subtracting the learning rate times the slope increases w.
q: Which of these is the loss in the house example?
- The size of the house
* The average of the squared errors over the 6 houses
- The learning rate
why: The loss is one number that measures how wrong the model is on the training data; here it is the mean squared error.
q: The slope of the loss is minus 4,070 and the learning rate is 0.00005. By how much does w change?
- Minus 0.2035
* Plus 0.2035
- Plus 4,070
why: The change is minus the learning rate times the slope: minus 0.00005 times minus 4,070 is plus 0.2035.
q: You raise the learning rate and the loss goes 7,650, then 295,140, then 11 million. What happened?
- The data has an outlier
* The learning rate is too large and each step overshoots
- The model needs more parameters
why: A step that is too big throws w past the best value, and the next slope is even larger, so the loss grows.
q: After training, you test on a house that was not in the table. Why?
- Because the table is too small to test on
* Because the training loss does not tell you how the model does on new houses
- Because testing on the table would give a loss of 0
why: Evaluation on unseen data measures what matters: the error on the next house.
q: A large language model trains on trillions of words with billions of parameters. Which part of the loop is different from the house example?
- It has no loss
- It does not update parameters
* None of the five parts is missing; only the sizes are larger
why: The loop is the same: data, model, loss, update, evaluate; the model and data are much bigger.
:::

## Go further

The StatQuest video in the links walks the same descent with pictures, and the Google crash course page on loss shows mean squared error on a real data set with an interactive slider. The Wikipedia page on mean squared error gives the formula and its history. The next lesson, [The AI ecosystem map](/courses/ai-foundations/what-ai-is/the-ai-ecosystem-map), zooms out: the loop you just ran is one box, called training, in a map of nine parts that make a real AI system, and that map is what you build in the next track.
`,
      links: [
        { label: 'Gradient Descent, Step-by-Step (StatQuest)', url: 'https://www.youtube.com/watch?v=sDv4f4s2SB8', kind: 'video' },
        { label: 'Linear regression: loss (Google crash course)', url: 'https://developers.google.com/machine-learning/crash-course/linear-regression/loss', kind: 'course' },
        { label: 'Mean squared error (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Mean_squared_error', kind: 'article' },
        { label: 'Gradient descent (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Gradient_descent', kind: 'article' },
      ],
    },
    {
      slug: 'the-ai-ecosystem-map',
      title: 'The AI ecosystem map',
      summary: 'After this lesson you can draw the nine parts of a real AI system, follow one user question through them, and name which lesson of the next track builds each part.',
      minutes: 22,
      objectives: [
        'Name the nine parts of an AI system: data, training, models, serving, apps, agents, tools, evaluation and monitoring.',
        'Explain what each part does using one user question about the house table.',
        'Explain the difference between training, inference and serving.',
        'Choose which module of the Build the AI Ecosystem track builds each part.',
      ],
      keyTerms: ['inference', 'model-serving', 'agent', 'evaluation', 'monitoring', 'observability', 'tool-calling', 'pretraining'],
      body: `
## What this lesson covers

The learning loop from the last lesson is one box. A real AI product has nine. This lesson draws the map: data, training, models, serving, apps, agents, tools, evaluation and monitoring. You follow one user question through every box, and you see where the model sits and where the plain code sits. At the end you can name what each part does, and you can point at the lesson in the next track that builds it.

## Why it matters

This map is the plan for the [Build the AI Ecosystem](/courses/build-ai-ecosystem/set-up-your-workshop/the-project-plan) track. Every module in that track adds one or two boxes to the map until, in the [capstone](/courses/build-ai-ecosystem/ship-it/capstone), all nine run together on a real web address. When something breaks later, you will find the fault by asking which box it is in. When you read a job advert or a news story about AI, the words in it are the names of these boxes. The map also fixes a common confusion: most of an AI system is not the model. The model is one box. The other eight are data work, ordinary programs and measurement, and the next three modules of this track teach the model box while the next track teaches the rest.

:::video
id: F8NKVhkZZWI
why: Watch all 12 minutes. The speaker draws the agent and tools boxes from this map and explains the loop that connects them. Notice that the model is one part of the agent, not the whole of it.
:::

## The idea with an example

> **Analogy.** A restaurant is not a chef. It is a supply chain that brings ingredients, a kitchen where recipes are tested, a chef, a pass where plates wait to go out, a dining room where guests sit, waiters who take orders and fetch things, a till and a phone, food critics who score the place, and a manager who watches every night's numbers. The chef is the model. A great chef in a building with no supply chain, no waiters and no manager is not a restaurant.

The nine parts of an AI system map onto the restaurant one by one.

| Part | What it is | Restaurant | In the house example |
| --- | --- | --- | --- |
| Data | the raw material: documents, tables, labelled examples | the supply chain | the 6-row table and the text listings for each house |
| Training | the learning loop that turns data into a model | recipe testing in the kitchen | 3 steps of gradient descent that set w to 3.00 |
| Models | the trained files: parameters and the code to run them | the chef | the price line, and a large language model from a provider |
| Serving | running the model behind a network address for many users | the pass | a model server that answers requests over HTTP |
| Apps | what the user touches: a chat window, a web page | the dining room | a web page with a question box |
| Agents | a model in a loop that plans, acts and reads results | the waiter | code that decides to search the table before answering |
| Tools | functions the agent can call: search, calculate, read a file | the till and the phone | filter_houses, which returns matching rows |
| Evaluation | measuring quality on a test set before launch | the food critic | 20 questions with known answers, scored |
| Monitoring | watching errors, speed, cost and quality after launch | the manager's nightly numbers | a log line per request and a dashboard |

Here is the running example. The six houses now live in a system, and a user types: Which house has a garden and costs under 250 thousand? The right answer is house 2, the 70 square metre flat in Leeds at 210 thousand. Follow the question through the map. Press Play to watch the request path.

:::arch
title: The AI ecosystem: nine parts of one system
layer: Apps | Chat app, Agent, Tools
layer: Serving | Model server, Retrieval, Monitoring
layer: Models | Trained model, Evaluation
layer: Training | Training loop, Fine-tuning
layer: Data | Raw documents, Dataset
flow: Chat app -> Agent -> Retrieval -> Model server -> Trained model -> Model server -> Agent -> Tools -> Agent -> Chat app -> Monitoring
note: Agent = the loop that decides what to do next
note: Retrieval = finds the house listings most related to the question
note: Monitoring = logs every request with its time and cost
:::

The two bottom layers happen before any user arrives. Data is collected and cleaned. Training runs the learning loop and produces a trained model, and evaluation scores it. The three top layers happen every time a user asks something. This split has a name. Training is changing the parameters of a model. Inference is using a trained model with its parameters fixed to make a prediction. Serving is running inference for many users at once, behind a network address. Training happens once, or once a month. Inference happens a million times a day.

:::scenario
title: One question travels through the nine parts
state: question=garden and under 250, answer=none
step: The user types the question into the chat app, a web page with a text box. The app sends it to the agent over HTTP.
state: part=Apps
step: The agent reads the question and plans. It decides it needs the house data, so it asks retrieval for listings related to garden and price.
state: part=Agents, plan=look up houses
step: Retrieval compares the question with the stored listings and returns the 3 most related: houses 2, 3 and 4, which all have gardens.
state: part=Serving (retrieval), found=houses 2 and 3 and 4
step: The agent asks the model server to read the three listings and the question. The server runs inference on the trained model and returns a draft answer with a tool request: call filter_houses with garden yes and max price 250.
state: part=Models and Serving, tool request=filter_houses
step: The agent runs the tool. filter_houses is a 5-line Python function over the table. It returns house 2 only. The agent sends the result back to the model, which writes the final sentence.
state: part=Tools, tool result=house 2, answer=House 2 in Leeds at 210 thousand
step: The chat app shows the answer. Monitoring writes one log line: 812 input tokens, 64 output tokens, 1.4 seconds, cost and status ok.
state: part=Monitoring, latency=1.4 s, status=ok
:::

Count the boxes the question touched: apps, agents, serving, models, tools, monitoring. Data, training and evaluation were used earlier, when the system was built. The model ran twice and took about 1 second of the 1.4 seconds. Everything else was ordinary code of the kind you learned in the Start Here track: a web page, an HTTP request, a Python function, a log line.

:::timeline
title: Where the 1.4 seconds go
unit: seconds
lane Chat app
lane Agent
lane Retrieval
lane Model server
lane Tools
Chat app -> Agent: question @0
Agent -> Retrieval: find listings @0.05
Retrieval: search @0.05-0.15
Retrieval -> Agent: 3 listings @0.15
Agent -> Model server: listings and question @0.2
Model server: inference @0.2-0.8
Model server -> Agent: tool request @0.8
Tools: filter_houses @0.8-0.85
Agent -> Model server: tool result @0.85
Model server: inference @0.85-1.35
Model server -> Chat app: answer @1.4
:::

## How it works

Each part has a job, an input and an output. Read the list once now, and come back to it when you build each part.

:::anim
title: One question travels through the parts of the system in 1.4 seconds
context: One question passes through several parts of a teaching service.
focus: Follow the evidence and the request path. The displayed times are illustrative.
takeaway: A failed answer may come from the data, retrieval, prompt, model, or surrounding service.
num lat = 0 @ 120,130 prefix: "t = " suffix: " s" digits: 2 size: 34 color: yellow
box mon "Monitoring" @ 720,130 size: 180x64
num tin = 0 @ 720,200 suffix: " input tokens" size: 18 color: grey
num tout = 0 @ 720,228 suffix: " output tokens" size: 18 color: grey
box app "Chat app" @ 120,300 size: 170x64 icon: browser
box agent "Agent" @ 420,300 size: 170x64
box server "Model server" @ 720,300 size: 180x64 icon: server
box user "You" @ 120,450 size: 170x64 icon: user
box retr "Retrieval" @ 420,450 size: 170x64
box tool "Tool: filter_houses" @ 720,450 size: 220x64 icon: tool

step: You type: which house has a garden and costs under 250 thousand? The chat app sends it to the agent.
  show user, app, agent, lat
  arrow user -> app : question
  arrow app -> agent : HTTP
  & count lat -> 0.05
step: The agent plans. It needs house data, so it asks retrieval, which returns the three listings with gardens.
  show retr
  arrow agent -> retr : "garden, price"
  arrow retr -> agent : "houses 2, 3, 4"
  & count lat -> 0.15
step: The agent sends the listings and the question to the model server. Inference runs with fixed parameters.
  show server
  arrow agent -> server : prompt
  & count lat -> 0.8 (2s)
  highlight server
step: The model does not run tools. It returns a tool request: filter_houses, garden yes, max price 250.
  show tool
  arrow server -> agent : "tool request"
  restore server
step: The agent runs the tool, a 5-line Python function over the table. It returns house 2 only.
  arrow agent -> tool : "garden yes, max 250"
  arrow tool -> agent : "house 2"
  & count lat -> 0.85
step: The agent sends the result back. The model writes the final sentence: house 2 in Leeds, 210 thousand.
  send agent -> server : "tool result"
  send server -> agent : answer
  & count lat -> 1.35 (2s)
step: The chat app shows the answer. Monitoring writes one log line: 812 input tokens, 64 output tokens, 1.4 seconds.
  arrow agent -> app : answer
  arrow app -> user : answer
  & count lat -> 1.4
  show mon, tin, tout
  arrow agent -> mon : "log line"
  & count tin -> 812
  & count tout -> 64
  highlight mon
:::

1. Data. Collect documents, tables and examples. Clean them. Split them into training data and test data. Input: the world. Output: files on a disk.
2. Training. Run the learning loop on the training data. For a language model this has two stages: pretraining on a huge corpus, which you will never run yourself, and fine-tuning on your own examples, which you will. Input: data. Output: a trained model, a file of parameters.
3. Models. Store the trained model and the code that runs it. Most systems use a model from a provider over an API plus one small model they fine-tuned. Input: a prompt. Output: a prediction, such as the next token.
4. Serving. Load the model, accept requests over HTTP, batch them, cache repeated answers, return results. Input: many requests. Output: many responses, fast.
5. Apps. The chat window, the web page or the command line the user sees. Input: a person. Output: a request to the agent and an answer on screen.
6. Agents. A loop: read the task, decide, call a tool or the model, read the result, repeat until done or until a step limit. Input: a task. Output: a finished answer and a record of each step.
7. Tools. Ordinary functions the agent may call: search the documents, filter the table, run a calculation, read a file. Input: arguments the model chose. Output: a result the model reads.
8. Evaluation. Before launch, run a test set of questions with known answers and score the system. Input: the test set. Output: a number, such as 18 of 20 correct.
9. Monitoring. After launch, log every request, track speed, errors and cost, and sample answers for human review. Input: live traffic. Output: dashboards and alerts.

Monitoring produces one record per request. Here is the record for the house question. Every field is a number or a short string that a dashboard can add up.

:::code
lang: json
file: one_request.json
{
  "request_id": "req_000417",
  "question": "Which house has a garden and costs under 250 thousand?",
  "retrieved": ["house-2", "house-3", "house-4"],
  "tool_calls": ["filter_houses"],
  "model": "claude-sonnet-5-5",
  "input_tokens": 812,
  "output_tokens": 64,
  "latency_seconds": 1.4,
  "status": "ok"
}
:::

With one such line per request, you can answer the questions that matter in production. How many requests failed today? What is the slowest 1 percent? How many tokens did we buy this month? Which questions made the agent call a tool 5 times? Evaluation answers these questions once, before launch. Monitoring answers them every day.

### What the next track builds

The [Build the AI Ecosystem](/courses/build-ai-ecosystem/set-up-your-workshop/the-project-plan) track builds all nine parts, one module at a time, into one repository. The table names the lesson that adds each part.

| Part | Module in the next track | Lesson that builds it |
| --- | --- | --- |
| Models | Set up your workshop | [Call a model](/courses/build-ai-ecosystem/set-up-your-workshop/call-a-model) |
| Apps | Chat application | [A chat loop in the terminal](/courses/build-ai-ecosystem/chat-application/chat-loop) and [A web UI](/courses/build-ai-ecosystem/chat-application/web-ui) |
| Data | Retrieval over your own documents | [Loading and chunking documents](/courses/build-ai-ecosystem/retrieval-rag/load-and-chunk) |
| Serving (retrieval) | Retrieval over your own documents | [Embeddings and a vector store](/courses/build-ai-ecosystem/retrieval-rag/embed-and-store) |
| Evaluation | Retrieval over your own documents | [Evaluating RAG](/courses/build-ai-ecosystem/retrieval-rag/evaluate-rag) |
| Tools | Agents and tools | [Tool calling](/courses/build-ai-ecosystem/agents-and-tools/tool-calling) |
| Agents | Agents and tools | [The agent loop](/courses/build-ai-ecosystem/agents-and-tools/the-agent-loop) and [Guardrails](/courses/build-ai-ecosystem/agents-and-tools/guardrails) |
| Training | Train and fine-tune your own model | [Build a dataset](/courses/build-ai-ecosystem/train-your-own/build-a-dataset) and [Fine-tune a small open model with LoRA](/courses/build-ai-ecosystem/train-your-own/lora-fine-tune) |
| Serving (model) | Train and fine-tune your own model | [Evaluate and serve the fine-tuned model](/courses/build-ai-ecosystem/train-your-own/evaluate-and-serve) |
| Deployment | Ship it | [A Docker image for your service](/courses/build-ai-ecosystem/ship-it/dockerise) and [Deploy to a cloud](/courses/build-ai-ecosystem/ship-it/deploy) |
| Monitoring | Ship it | [Observability](/courses/build-ai-ecosystem/ship-it/observability) and [Cost control](/courses/build-ai-ecosystem/ship-it/cost-control) |

Before that track, the rest of this track fills in the model box. [Your first models](/courses/ai-foundations/first-models/linear-regression) trains the price line properly and measures it. [Neural networks](/courses/ai-foundations/neural-networks/a-neuron) replaces the one-number model with layers. [Language as numbers](/courses/ai-foundations/language-as-numbers/tokens) explains how a language model reads and writes text. [Using models](/courses/ai-foundations/using-models/prompting) teaches you to prompt, sample and choose a model. When you finish, you know the chef. The next track builds the restaurant.

### Use the map to find the source of a bad answer

A fictional help assistant gives an outdated address-change procedure. Several parts of the system could explain the mistake. The model is only one candidate.

| Check | What a failure suggests | Useful next action |
| --- | --- | --- |
| Is the current guide in the source collection? | Missing or stale source data | Update the approved collection |
| Did retrieval return that guide? | Search or filtering problem | Inspect the query and retrieved passages |
| Did the prompt contain the right passage? | Context-construction problem | Inspect what the model actually received |
| Does the answer follow the passage? | Unsupported generation | Revise the behaviour and evaluate again |

Inspect these steps in order. Retraining the model cannot fix a document that the workflow never supplies. A new prompt cannot make an obsolete source current. Record one failed request with its permitted inputs and outputs, then identify the stage responsible.

This gives the delivery team a specific repair task. It also helps a nontechnical process owner explain why the answer is unacceptable.

## Try it

:::exercise
title: Map a product you use
task: Pick one AI product you use, such as a phone assistant, a translation app or a code helper. On paper, draw the nine boxes. For each box write one line: what you think it contains for that product, or the word unknown. Then write which two boxes you think took the most human work to build.
hint: Start from what you can see, the app. Then ask what the app sends its request to, what that part reads, and what it calls. Data, training and evaluation are usually invisible to the user but took the most work.
lang: text
solution:
Example for a translation app:
Data: millions of sentence pairs in two languages, collected from books and websites
Training: pretraining a transformer on the pairs, then fine-tuning on corrected translations
Models: one large translation model per language group
Serving: model servers in data centres near the users, with a cache for common phrases
Apps: the phone app and the browser extension
Agents: probably none; one request, one answer
Tools: a dictionary lookup and a language detector
Evaluation: a test set of 5,000 sentences scored by human translators
Monitoring: logs of latency, errors and the share of translations users edit by hand
Most human work: data (collecting and cleaning pairs) and evaluation (human scoring).
:::

## Common mistakes

- Mistake: you think the AI system is the model. Fix: the model is one of nine parts; the other eight are data work, plain programs and measurement, and they take most of the work.
- Mistake: you mix up training and inference. Fix: training changes the parameters and happens rarely; inference uses fixed parameters and happens on every request.
- Mistake: you think an agent is a special kind of model. Fix: an agent is ordinary code that calls a model in a loop and runs tools; the model never runs a tool itself.
- Mistake: you think evaluation before launch is enough. Fix: the world changes after launch; monitoring is the only way to see the model start to fail.
- Mistake: you skip monitoring because the system works on your laptop. Fix: a system with no log lines cannot tell you what it costs or where it fails; add the log line before the first real user.

## Check your understanding

:::quiz
title: Check: the AI ecosystem map
q: A user asks a question and the system answers in 1.4 seconds. Which parts ran during those 1.4 seconds?
- Data, training and evaluation
* Apps, agents, serving, models, tools and monitoring
- Only the model
why: Data, training and evaluation happen before launch; the other six run on every request.
q: What is the difference between training and inference?
* Training changes the parameters; inference uses them with no change
- Training uses a GPU; inference uses a CPU
- Training is for language models; inference is for price models
why: The learning loop updates parameters; a trained model at inference time keeps its parameters fixed and only predicts.
q: The agent asks for filter_houses with garden yes and max price 250. Who runs the function?
- The model, inside the model server
* Your own code, in the agent loop
- The chat app
why: Tools are ordinary functions that your code runs when the model asks; the model only names the tool and the arguments.
q: Your system scored 18 of 20 on the test set in March. In June users complain that answers are wrong. Which part should have caught this?
- Evaluation
* Monitoring
- Training
why: Evaluation measured the system once before launch; monitoring watches it after launch and would show the error rate rising.
q: Which part of the map does the learning loop from the previous lesson belong to?
- Serving
- Agents
* Training
why: The loop that turns data into a trained model is the training box; the trained model then moves to the models box.
:::

## Go further

The Wikipedia page on MLOps in the links describes the training, serving and monitoring boxes as an industry practice. Google's Rules of Machine Learning is a list of 43 lessons from building such systems, and rules 1 to 10 match this map closely. The Hugging Face Hub documentation shows where models and datasets live in the open ecosystem, and the Anthropic documentation shows a hosted model API, which is the models box as most products use it. The next module, [Your first models](/courses/ai-foundations/first-models/linear-regression), goes back inside the model box and trains the house-price line with two parameters, then measures it properly.
`,
      links: [
        { label: 'MLOps (Wikipedia)', url: 'https://en.wikipedia.org/wiki/MLOps', kind: 'article' },
        { label: 'Rules of Machine Learning (Google)', url: 'https://developers.google.com/machine-learning/guides/rules-of-ml', kind: 'docs' },
        { label: 'Hugging Face Hub documentation', url: 'https://huggingface.co/docs/hub/index', kind: 'docs' },
        { label: 'Anthropic developer documentation', url: 'https://docs.anthropic.com/', kind: 'docs' },
      ],
    },
  ],
}
