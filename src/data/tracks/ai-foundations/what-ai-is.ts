import type { Module } from '../../types'

export const mod: Module = {
  slug: 'what-ai-is',
  title: 'What AI is',
  description: 'The four nested circles of AI, rules versus learning, the learning loop on the house-price table, and a map of the whole AI ecosystem.',
  level: 'beginner',
  lessons: [
    {
      slug: 'the-four-circles',
      title: 'AI, machine learning, deep learning and generative AI',
      summary: 'After this lesson you can place any AI product into one of four nested circles and give one example of each.',
      minutes: 20,
      objectives: [
        'Explain the four nested circles: artificial intelligence, machine learning, deep learning and generative AI.',
        'Give one concrete example for each circle using the spam filter and the house-price table.',
        'Choose the right circle for a product by asking three questions.',
        'Name five events in the history of AI and the circle each one belongs to.',
      ],
      keyTerms: ['artificial-intelligence', 'machine-learning', 'deep-learning', 'generative-ai', 'neural-network', 'large-language-model', 'rule-based-system'],
      body: `
## What this lesson covers

This lesson explains four words that people use as if they mean one thing: artificial intelligence, machine learning, deep learning and generative AI. They do not mean one thing. They are four circles, one inside the other, and each smaller circle adds one idea to the circle around it. At the end you can place any AI product you meet into the right circle, and you can give one example of each circle from the spam filter and the house-price table you already know.

## Why it matters

You are going to build a complete AI system in the [Build the AI Ecosystem](/courses/build-ai-ecosystem/set-up-your-workshop/the-project-plan) track. That system uses parts from all four circles. The chat model is generative AI. The retrieval step uses deep learning to turn text into vectors. The evaluation step is plain machine learning. The guardrails around the agent are hand-written rules, which is the oldest kind of AI. If you can name the circle a part belongs to, you know what that part needs: rules written by a person, or examples, or a neural network, or a model that produces text. The next lesson, [Rules versus learning](/courses/ai-foundations/what-ai-is/rules-vs-learning), looks closely at the line between the first two circles.

:::video
id: PeMlggyqz0Y
why: Watch all 100 seconds. The video names machine learning, neural networks and deep learning in a row. After this lesson, watch it again and place each thing it mentions into a circle.
:::

## The idea with an example

> **Analogy.** Every car is a vehicle, but not every vehicle is a car. Every electric car is a car, but not every car is electric. Every self-driving electric car is an electric car, but most electric cars do not drive themselves. Vehicles, cars, electric cars and self-driving electric cars are four circles, one inside the other. AI, machine learning, deep learning and generative AI nest in the same way.

Artificial intelligence (AI) is the outer circle. AI is any program that does a task which needs intelligence when a person does it. Sorting mail into spam and not spam needs a little intelligence. Guessing the price of a house needs some. Playing chess needs a lot. A program that does any of these counts as AI, no matter how it works inside.

The first running example is the spam filter. In the outer circle, a person writes rules. The rule-based filter says: if the email contains the word prize, or the word free, or more than 3 exclamation marks, mark it as spam. A rule-based system is a program whose decisions follow if-then rules that a person wrote. This is AI. It is not machine learning, because the program did not learn anything. A person did the learning and wrote it down.

Machine learning (ML) is the second circle. A machine learning program learns its rules from examples instead of having a person write them. Take the 1,000 emails that a person already marked as spam or not spam. A machine learning spam filter counts how often each word appears in spam and in normal mail. It finds on its own that the word free appears in 240 of the 300 spam emails but in only 35 of the 700 normal ones. Nobody wrote that rule. The program found it in the data.

The second running example is the house-price table from the Start Here track. It has 6 rows. Each row has the size of a house in square metres and its price.

| id | size_m2 | bedrooms | city | garden | price |
| --- | --- | --- | --- | --- | --- |
| 1 | 50 | 1 | Leeds | no | 150000 |
| 2 | 70 | 2 | Leeds | yes | 210000 |
| 3 | 90 | 3 | York | yes | 260000 |
| 4 | 120 | 4 | York | yes | 380000 |
| 5 | 60 | 2 | Leeds | no | 170000 |
| 6 | 100 | 3 | York | no | 300000 |

A rule-based price guesser is a person who says: a house costs 3,000 per square metre. A machine learning price guesser takes the 6 rows and finds the number of pounds per square metre that fits them best, which turns out to be about 3,020. Same task, different circle. The person guessed the rule; the program learned it from the data.

Deep learning is the third circle. Deep learning is machine learning where the model is a neural network with many layers. A neural network is a model built from layers of simple units, where each unit multiplies its inputs by weights, adds them up, and applies a squashing function. Many layers stacked together can read raw data: the pixels of a photo, the sound of a voice, or the full text of an email. The word-count spam filter needs a person to decide that words are the thing to count. A deep learning spam filter reads the raw characters and finds its own features, so it can also catch the misspelling fr33 pr1ze. For the house, a deep learning model could look at the photo of the house and estimate the price from the picture alone.

Generative AI is the fourth and smallest circle. Generative AI is deep learning where the model produces new content, such as text, images, sound or code. All the models so far only score or sort an input: spam or not spam, a price. A generative model writes something that did not exist. Give it row 3 of the house table and it writes: Family house with 3 bedrooms and a garden on a quiet street in York. A large language model (LLM) is a generative model that produces text one token at a time. The chat assistants you have used are large language models.

:::flow
title: Each circle adds one idea to the circle around it
Any program -> AI: does a task that needs intelligence
AI -> Machine learning: learns its rules from examples
Machine learning -> Deep learning: uses a neural network with many layers
Deep learning -> Generative AI: produces new content
:::

Press Next to follow one spam email through all four circles. The panel shows what each circle does with the same input.

:::scenario
title: One email meets the four circles
state: email=Free prize! Click now, verdict=none
step: The rule-based filter checks its list. The word free is on the list, so the rule fires.
state: circle=AI (rules), verdict=spam, reason=rule for the word free
step: The machine learning filter looks up its learned word scores. The word free scored 0.87 and prize scored 0.94 on 1,000 examples.
state: circle=machine learning, verdict=spam, reason=learned scores 0.87 and 0.94
step: The deep learning filter reads the raw characters through 12 layers. It also catches the variant fr33 pr1ze that the first two filters miss.
state: circle=deep learning, verdict=spam, reason=pattern in raw text
step: A generative model is asked to reply. It writes a polite refusal in one sentence. It produced new text instead of a verdict.
state: circle=generative AI, verdict=spam, output=a written reply
:::

The circles also tell a story in time. The outer circle is the oldest. Each inner circle became practical later, because it needed more data and more computing power than the one before it.

:::timeline
title: When each circle became practical (years after 1950)
unit: years
lane AI
lane Machine learning
lane Deep learning
lane Generative AI
AI: rules and search programs @6-75
Machine learning: learning from examples @36-75
Deep learning: many-layer networks @62-75
Generative AI: models that write and draw @70-75
:::

Here is the history of the field in ten lines. The last column names the circle.

| Year | Event | Circle |
| --- | --- | --- |
| 1950 | Alan Turing asks whether a machine can think and proposes a test | AI |
| 1956 | A summer workshop at Dartmouth College names the field artificial intelligence | AI |
| 1958 | Frank Rosenblatt builds the perceptron, a one-layer neural network | ML |
| 1986 | Backpropagation, the method that trains many-layer networks, becomes widely known | DL |
| 1997 | Deep Blue, a rule and search program, beats the world chess champion | AI |
| 2012 | AlexNet, a deep network, wins the ImageNet photo contest by a wide margin | DL |
| 2017 | The transformer design is published in the paper Attention Is All You Need | DL |
| 2020 | GPT-3 shows that a large language model can do many tasks from a text prompt | GenAI |
| 2022 | ChatGPT puts a chat model in front of 100 million people in 2 months | GenAI |
| 2025 | Agents: models that call tools and run multi-step tasks become common products | GenAI |

## How it works

To place a product in a circle, ask three questions in order. Each yes moves you one circle inward.

:::anim
title: Three questions move a product inward through the four circles
box ai "AI|(rules)" @ 145,440 size: 150x64 icon: code
box ml "Machine|learning" @ 370,440 size: 150x64 icon: training
box dl "Deep|learning" @ 595,440 size: 150x64 icon: network
box genai "Generative|AI" @ 820,440 size: 150x64 icon: chat
rect chat @ 145,340 size: 170x50 "Chat assistant" color: yellow
rect face @ 145,250 size: 170x50 "Face unlock" color: teal
rect chess @ 145,160 size: 170x50 "Chess program" color: grey
text q1 "Question 1: does it learn its rules from examples?" @ 480,80 size: 19 color: yellow
text q2 "Question 2: is the model a neural network with many layers?" @ 480,80 size: 19 color: yellow
text q3 "Question 3: does it produce new content?" @ 480,80 size: 19 color: yellow
text done "Each yes moves a product one circle inward" @ 480,80 size: 19 color: grey

step: The four circles lie side by side. AI, the outer circle, is on the left.
  show ai, ml, dl, genai
step: Take a chat assistant. Question 1: does it learn its rules from examples? Yes, so it moves inward.
  show chat, q1
  arrow ai -> ml : yes
  & move chat -> 370,340
step: Question 2: is the model a neural network with many layers? Yes. One circle further in.
  hide q1
  show q2
  arrow ml -> dl : yes
  & move chat -> 595,340
step: Question 3: does it produce new content? Yes. A chat assistant is generative AI.
  hide q2
  show q3
  arrow dl -> genai : yes
  & move chat -> 820,340
  highlight genai
step: Face unlock learns and uses many layers, but only answers yes or no. It stops at deep learning.
  hide q3
  restore genai
  show face
  send ai -> ml : yes
  & move face -> 370,250
  send ml -> dl : yes
  & move face -> 595,250
  highlight dl
step: A chess program follows rules a person wrote. It does not learn, so it stays in the outer circle.
  restore dl
  show chess, done
  pulse chess
  highlight ai
:::

1. Does the program learn its rules from examples, or did a person write every rule? If a person wrote every rule, the product is AI only. Stop here. If it learns, it is at least machine learning.
2. Is the model a neural network with many layers? If not, it is classic machine learning, such as the word-count spam filter or the line through the house prices. If yes, it is deep learning.
3. Does the model produce new content, such as text, images or sound? If not, it is deep learning that scores or sorts. If yes, it is generative AI.

The table applies the three questions to common products.

| Product | Learns from examples? | Many-layer network? | Produces content? | Circle |
| --- | --- | --- | --- | --- |
| A chess program that searches moves | no | no | no | AI |
| A route planner in a map app | no | no | no | AI |
| A spam filter with learned word scores | yes | no | no | Machine learning |
| The price line through the 6 houses | yes | no | no | Machine learning |
| Face unlock on a phone | yes | yes | no | Deep learning |
| Speech to text | yes | yes | no | Deep learning |
| A chat assistant | yes | yes | yes | Generative AI |
| An image generator | yes | yes | yes | Generative AI |

The three questions fit in a small Python function. Run it on your own computer and change the three answers.

:::code
lang: python
file: circles.py
def which_circle(learns, deep, generates):
    if not learns:
        return "AI (rules written by a person)"
    if not deep:
        return "Machine learning"
    if not generates:
        return "Deep learning"
    return "Generative AI"

print(which_circle(learns=False, deep=False, generates=False))  # chess program
print(which_circle(learns=True, deep=False, generates=False))   # word-count spam filter
print(which_circle(learns=True, deep=True, generates=False))    # face unlock
print(which_circle(learns=True, deep=True, generates=True))     # chat assistant
:::

:::code
lang: text
AI (rules written by a person)
Machine learning
Deep learning
Generative AI
:::

Two more facts help you read news about AI. First, the border of the outer circle moves. A calculator does arithmetic faster than any person, but nobody calls it AI today. A route planner was called AI in 1990 and is now a normal map feature. When a task becomes ordinary, people stop calling it AI. Second, the inner circles do not replace the outer ones. A chat assistant is generative AI, but the system around it uses rules to block some requests and plain machine learning to rank results. A real product uses all four circles at once.

The word model appears in every circle from machine learning inward. A model is a function with adjustable numbers that turns an input into a prediction. The price line has 1 adjustable number. The word-count spam filter has 1 number per word. A large language model has billions. The next lessons in this module explain where those numbers come from.

## Try it

:::exercise
title: Sort eight products into circles
task: Use paper. For each product, answer the three questions and write the circle. The products are: a thermostat that turns the heating on below 18 degrees; a bank program that flags a card payment as fraud using 2 million past payments; a translation app; the autocomplete that suggests the next word on your phone keyboard; a vacuum robot that follows walls; a photo app that groups pictures by the face in them; a program that writes a short poem; a spreadsheet formula that adds a column.
hint: Start with question 1 for every product. A thermostat and a spreadsheet formula do not learn. A translation app and a poem writer produce new text.
lang: text
solution:
Thermostat: does not learn, and the task needs no intelligence. Not AI (a plain program).
Fraud flag from 2 million payments: learns, usually a classic model or a tree. Machine learning.
Translation app: learns, deep network, produces new text. Generative AI.
Keyboard autocomplete: learns, a small language model, produces the next word. Generative AI.
Wall-following vacuum robot: hand-written rules. AI (rules).
Photo app that groups faces: learns, deep network, does not produce content. Deep learning.
Poem writer: learns, deep network, produces text. Generative AI.
Spreadsheet formula: does not learn, no intelligence needed. Not AI.
:::

## Common mistakes

- Mistake: you use AI and machine learning as two names for one thing. Fix: machine learning is the inner circle that learns from examples; a chess program with hand-written rules is AI but not machine learning.
- Mistake: you think deep learning is a different field from machine learning. Fix: deep learning is machine learning with a many-layer neural network as the model; the learning loop is the same.
- Mistake: you think every neural network is generative. Fix: face unlock uses a deep network and only answers yes or no; generative models produce new content.
- Mistake: you think generative AI replaced the older circles. Fix: a chat product uses rules for safety, classic machine learning for ranking, and a deep network for embeddings, all at once.
- Mistake: you think a bigger circle means a better method. Fix: the circles describe what a method needs, not how good it is; a 10-line rule filter beats a deep network when the rule is exact and the data is tiny.

## Check your understanding

:::quiz
title: Check: the four circles
q: A hospital program follows 200 if-then rules written by doctors to suggest a diagnosis. Which circle is it in?
* AI only, because a person wrote every rule
- Machine learning, because it makes decisions
- Deep learning, because 200 rules is a lot
why: The program did not learn from examples, so it stays in the outer circle no matter how many rules it has.
q: A program reads the 6-row house table and finds that 3,020 per square metre fits best. Which circle?
- AI only
* Machine learning
- Generative AI
why: The program learned the number from examples; the model is a single line, not a many-layer network.
q: Which product is deep learning but not generative AI?
- A chatbot that writes answers
* A camera app that recognises your face
- A thermostat with a rule at 18 degrees
why: Face recognition uses a many-layer network but only answers who is in the picture; it produces no new content.
q: A model is given row 3 of the house table and writes a two-sentence listing. What is the smallest circle it belongs to?
- Machine learning
- Deep learning
* Generative AI
why: The model produced new text, which is the one idea that generative AI adds.
q: Why does a route planner count as AI in 1990 but not in a 2026 map app?
- Route planners stopped using algorithms
* The task became ordinary, so people stopped calling it AI
- Route planners now use rules instead of learning
why: The border of the outer circle moves as tasks become routine; the program did not change its nature.
:::

## Go further

The Wikipedia pages in the links give the long history behind the ten-line table, and the Google machine learning glossary is a good place to look up any word from this module. Read the first section of the artificial intelligence page and the first section of the machine learning page, and notice how each one defines its circle. The next lesson, [Rules versus learning](/courses/ai-foundations/what-ai-is/rules-vs-learning), takes the spam filter and builds it both ways, as rules and as a learned model, so you can see exactly where the first circle ends and the second begins.
`,
      links: [
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
