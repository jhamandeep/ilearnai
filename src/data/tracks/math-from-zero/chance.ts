import type { Module } from '../../types'

export const mod: Module = {
  slug: 'chance',
  title: 'Chance: probability and statistics',
  description: 'Probability from dice and cards; conditional probability and Bayes with a spam filter; mean and variance on a 6-number list; the distributions you will meet; and entropy and cross-entropy, the loss that trains every classifier.',
  level: 'foundations',
  lessons: [
    {
      slug: 'probability-basics',
      title: 'Probability basics',
      summary: 'After this lesson you can compute the probability of a simple event by counting outcomes, and use the complement to answer "at least one" questions.',
      minutes: 22,
      objectives: [
        'Explain what an outcome, a sample space and an event are, using a die and a deck of cards.',
        'Compute a probability as favourable outcomes divided by all outcomes.',
        'Explain why every probability lies between 0 and 1 and why all outcomes add up to 1.',
        'Compute the probability of a complementary event with 1 minus P(A).',
        'Compute the probability that two independent events both happen.',
      ],
      keyTerms: ['probability', 'outcome', 'sample-space', 'event', 'complementary-event', 'independence'],
      body: `
## What this lesson covers

This lesson teaches the one idea behind all of probability: count the outcomes you want, and divide by all the outcomes that can happen. You learn the words outcome, sample space, event and complement. You practise on one die, two dice and a deck of 52 cards. At the end you can answer questions such as "what is the chance of at least one 6 in two rolls" with a short calculation.

## Why it matters

Every artificial intelligence (AI) model is a machine that outputs probabilities. A spam filter outputs the probability that an email is spam. A language model outputs the probability of each possible next word. When you train a model later on this site, you measure how far its probabilities are from the truth. You cannot read those numbers without the basics in this lesson. The next lesson, [Conditional probability and Bayes' rule](/courses/math-from-zero/chance/conditional-and-bayes), uses the same counting idea to update a probability when you get new information.

:::video
id: pYxNSUDSFH4
why: Watch the first 3 minutes. StatQuest shows probability as the share of a whole, which is exactly the counting idea in this lesson. The second half, about likelihood, is for a later lesson. You can stop there.
:::

## The idea with an example

> **Analogy.** A probability is a share of a pie. The whole pie is everything that can happen, and it always equals 1. An event is one slice. A slice can be tiny, such as 1/52 for one card, or large, such as 1/2 for a red card. A slice can never be bigger than the pie, so no probability is bigger than 1. A slice can never be less than nothing, so no probability is below 0.

Here is the running example. You hold one fair six-sided die. The word fair means that each face is equally likely. When you roll it, exactly one face lands on top. Each of those faces is an outcome. An outcome is one single thing that can happen. The list of all outcomes is the sample space. For one die the sample space has 6 outcomes: 1, 2, 3, 4, 5 and 6.

An event is a set of outcomes you care about. "Roll a 4" is an event with one outcome. "Roll an even number" is an event with three outcomes: 2, 4 and 6. "Roll a number below 7" is an event with all six outcomes. The probability of an event is the number of outcomes in the event divided by the number of outcomes in the sample space. We write the probability of an event A as P(A).

$$P(A) = \\frac{\\text{number of outcomes in } A}{\\text{number of outcomes in the sample space}}$$

In words: the probability of A equals the count of outcomes where A happens, divided by the count of all outcomes. This rule works when every outcome is equally likely, which is true for fair dice and a shuffled deck.

| Event | Outcomes in the event | Count | Probability |
| --- | --- | --- | --- |
| Roll a 4 | 4 | 1 | 1/6, about 0.167 |
| Roll an even number | 2, 4, 6 | 3 | 3/6 = 0.5 |
| Roll a 5 or a 6 | 5, 6 | 2 | 2/6, about 0.333 |
| Roll a 7 | none | 0 | 0/6 = 0 |
| Roll a number below 7 | 1, 2, 3, 4, 5, 6 | 6 | 6/6 = 1 |

The last two rows show the two limits. An event that cannot happen has probability 0. An event that must happen has probability 1. Every other event sits between those two numbers. You can write a probability as a fraction, a decimal or a percent: 1/2, 0.5 and 50 percent all mean the same thing. In this course we use decimals most of the time, because models output decimals.

The flow diagram shows the three steps you take for every probability question.

:::flow
title: The counting method
Question -> Sample space: list every outcome
Sample space -> Event: pick the outcomes you want
Event -> Probability: divide the count by the total
Probability -> Check: is it between 0 and 1?
:::

Press Next to compute the probability of an even roll one step at a time.

:::scenario
title: The probability of an even roll
state: sample space=?, event=?, probability=?
step: Write the sample space for one die. It has 6 outcomes.
state: sample space=1 2 3 4 5 6
step: Mark the outcomes that are even. There are 3 of them.
state: event=2 4 6
step: Divide the count in the event by the count in the sample space: 3 divided by 6.
state: probability=3/6
step: Simplify. 3/6 is 1/2, which is 0.5. Check that it lies between 0 and 1. It does.
state: probability=0.5
:::

## How it works

### The three rules

Every probability obeys three rules. You can check any answer against them.

1. A probability is never below 0 and never above 1. If you compute 1.3, you made a mistake.
2. The probabilities of all the outcomes in the sample space add up to 1. For a die, 1/6 added six times is 6/6, which is 1.
3. If two events cannot both happen, the probability that one or the other happens is the sum of their probabilities. "Roll a 5" and "roll a 6" cannot both happen on one roll, so P(5 or 6) = 1/6 + 1/6 = 2/6.

### The complement

The complement of an event A is the event that A does not happen. We write it as "not A". Because A either happens or does not, the two probabilities add up to 1.

$$P(\\text{not } A) = 1 - P(A)$$

In words: the probability that A does not happen equals 1 minus the probability that A happens. For the die, P(not a 6) = 1 - 1/6 = 5/6. The complement is the most useful trick in this lesson. Questions that ask for "at least one" are hard to count directly and easy to count through the complement, as you see next.

### Two dice and independence

Now roll two dice, one red and one blue. Each die still has 6 outcomes. The pair has 6 times 6, which is 36, outcomes. The table shows the sample space as a grid. Each cell is one outcome, written as red then blue.

| | blue 1 | blue 2 | blue 3 | blue 4 | blue 5 | blue 6 |
| --- | --- | --- | --- | --- | --- | --- |
| red 1 | 1,1 | 1,2 | 1,3 | 1,4 | 1,5 | 1,6 |
| red 2 | 2,1 | 2,2 | 2,3 | 2,4 | 2,5 | 2,6 |
| red 3 | 3,1 | 3,2 | 3,3 | 3,4 | 3,5 | 3,6 |
| red 4 | 4,1 | 4,2 | 4,3 | 4,4 | 4,5 | 4,6 |
| red 5 | 5,1 | 5,2 | 5,3 | 5,4 | 5,5 | 5,6 |
| red 6 | 6,1 | 6,2 | 6,3 | 6,4 | 6,5 | 6,6 |

The event "both dice show 6" has one cell, so its probability is 1/36. There is a faster way to see this. The red die does not affect the blue die. Two events are independent when one does not change the probability of the other. For independent events, the probability that both happen is the product of the two probabilities.

$$P(A \\text{ and } B) = P(A) \\times P(B) \\quad \\text{when } A \\text{ and } B \\text{ are independent}$$

In words: for independent events, the probability of both equals the first probability times the second. So P(red 6 and blue 6) = 1/6 times 1/6 = 1/36. The grid and the product rule agree.

Now the "at least one" question. What is the probability of at least one 6 in two rolls? Counting directly means counting the last row, the last column, and taking care not to count the corner cell twice: 6 + 6 - 1 = 11 cells, so 11/36. The complement is easier. "At least one 6" fails only when neither die shows a 6. P(red not 6) is 5/6, P(blue not 6) is 5/6, and the dice are independent, so P(no 6 at all) = 5/6 times 5/6 = 25/36. Then P(at least one 6) = 1 - 25/36 = 11/36, about 0.306. Both ways give the same answer.

The heat map shows the probability of each total when you add the two dice. The total 7 is most likely, because 6 of the 36 cells add up to 7.

:::matrix
title: Probability of each total of two dice, in 36ths
cols: total 2, total 3, total 4, total 5, total 6, total 7
count: 1, 2, 3, 4, 5, 6
:::

### Cards

A standard deck has 52 cards. There are 4 suits: hearts, diamonds, clubs and spades. Hearts and diamonds are red; clubs and spades are black. Each suit has 13 ranks: ace, 2 to 10, jack, queen and king. If you shuffle well and draw one card, each of the 52 outcomes is equally likely.

| Event | Count | Probability |
| --- | --- | --- |
| The card is a heart | 13 | 13/52 = 0.25 |
| The card is red | 26 | 26/52 = 0.5 |
| The card is a king | 4 | 4/52, about 0.077 |
| The card is the king of hearts | 1 | 1/52, about 0.019 |
| The card is not a king | 48 | 1 - 4/52 = 48/52, about 0.923 |

Cards show something dice do not. If you draw a card and do not put it back, the second draw is not independent of the first. The deck now has 51 cards, and the counts changed. The probability of two kings in a row is 4/52 for the first king, times 3/51 for a second king from the 3 kings left in 51 cards. That product is 12/2652, about 0.0045. The next lesson gives this idea a name: conditional probability.

### Probability in code

You can check any probability by running the experiment many times on a computer. The share of runs where the event happens gets close to the probability as the number of runs grows. This is called a simulation. The code rolls two dice 100,000 times and counts how often at least one 6 appears. If you have not started the Python track yet, read the code as a recipe and come back to run it later.

:::code
lang: python
file: two_dice.py
import random

runs = 100000
hits = 0
for i in range(runs):
    red = random.randint(1, 6)
    blue = random.randint(1, 6)
    if red == 6 or blue == 6:
        hits = hits + 1

print("share with at least one 6:", hits / runs)
print("exact answer 11/36:", 11 / 36)
:::

:::code
lang: text
share with at least one 6: 0.30611
exact answer 11/36: 0.3055555555555556
:::

Your number will differ a little each run, because the rolls are random. With 100,000 runs it lands within about 0.005 of 11/36. This is the first time on the site that a computer estimates a probability by counting. Training a model does something related: it counts how often things happen in data and turns the counts into probabilities.

## Try it

:::exercise
title: Count the outcomes
task: Use paper and the two-dice grid above. Answer three questions. What is the probability that the two dice show the same number? What is the probability that the total is 10 or more? What is the probability that neither die shows a 1?
hint: For the first question, count the diagonal cells. For the third, use independence: P(red not 1) times P(blue not 1).
lang: text
solution:
Same number: the cells 1,1 2,2 3,3 4,4 5,5 6,6 are 6 cells out of 36.
P = 6/36 = 1/6, about 0.167.

Total 10 or more: the cells 4,6 5,5 6,4 5,6 6,5 6,6 are 6 cells.
P = 6/36 = 1/6, about 0.167.

Neither die shows a 1: P(red not 1) = 5/6, P(blue not 1) = 5/6.
P = 5/6 x 5/6 = 25/36, about 0.694.
Check on the grid: remove the first row and the first column; 25 cells remain.
:::

:::exercise
title: At least one head
task: You flip a fair coin 3 times. What is the probability of at least one head? Use the complement. Then change the code above to flip 3 coins 100,000 times and check your answer.
hint: At least one head fails only when all 3 flips are tails. Each tail has probability 1/2 and the flips are independent.
lang: python
solution:
import random

runs = 100000
hits = 0
for i in range(runs):
    flips = [random.randint(0, 1) for k in range(3)]   # 1 means head
    if sum(flips) >= 1:
        hits = hits + 1

print("simulated:", hits / runs)
print("exact:", 1 - (1 / 2) ** 3)   # 1 - 1/8 = 7/8 = 0.875
:::

## Common mistakes

- Mistake: you add probabilities for events that can happen together. Fix: the sum rule is only for events that cannot both happen; for "at least one", use the complement.
- Mistake: you think a 6 is "due" after five rolls without one. Fix: each roll of a fair die is independent; the probability of a 6 is 1/6 every time, whatever happened before.
- Mistake: you multiply probabilities for events that are not independent, such as two cards drawn without replacement. Fix: after the first draw, recount the deck. The second king is 3/51, not 4/52.
- Mistake: you get a probability above 1 or below 0 and keep going. Fix: stop and recount; those values are impossible, so a step is wrong.
- Mistake: you count "at least one 6 in two rolls" as 1/6 + 1/6 = 2/6. Fix: that double counts the cell where both dice show 6; the answer is 11/36.

## Check your understanding

:::quiz
title: Check: probability basics
q: You roll one fair die. What is the probability of a number greater than 4?
- 1/6
* 2/6
- 4/6
why: The outcomes greater than 4 are 5 and 6, which is 2 outcomes out of 6.
q: You draw one card from a full deck. What is the probability that it is not a heart?
- 13/52
- 26/52
* 39/52
why: 13 cards are hearts, so 52 - 13 = 39 are not; or use 1 - 13/52.
q: You roll two dice. What is the probability that both show an even number?
- 1/2
* 1/4
- 1/6
- 1/36
why: Each die is even with probability 3/6 = 1/2, and the dice are independent, so 1/2 times 1/2 = 1/4.
q: A friend computes P(A) = 0.4 and P(not A) = 0.7. What do you know?
- Both numbers can be right if A is rare
* At least one number is wrong, because P(A) + P(not A) must equal 1
- The numbers are right, and A and not A are independent
why: An event and its complement always add up to exactly 1, and 0.4 + 0.7 = 1.1.
q: You flip a fair coin 4 times. What is the probability of at least one tail?
- 1/16
- 1/2
* 15/16
why: The complement, all 4 heads, has probability (1/2) to the power 4 = 1/16, so at least one tail is 1 - 1/16 = 15/16.
q: You draw two cards without putting the first back. Which statement is true?
- The second draw is independent of the first
* The second draw depends on the first, because the deck changed
- Both draws have exactly the same probabilities for every event
why: Removing a card changes the counts, so the second probabilities change. Independence fails.
:::

## Go further

The Khan Academy unit in the links has many short practice problems on dice, cards and coins. The Wikipedia page on probability gives the history and the formal rules. Stanford CS109 lecture 1 is a full university lecture that starts from counting, exactly as this lesson did; watch it when you want more depth. The next lesson, [Conditional probability and Bayes' rule](/courses/math-from-zero/chance/conditional-and-bayes), asks what happens to a probability when you learn a clue, and uses it to build a spam filter from 1,000 emails.
`,
      links: [
        { label: 'Probability (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Probability', kind: 'article' },
        { label: 'Basic probability (Khan Academy)', url: 'https://www.khanacademy.org/math/statistics-probability/probability-library', kind: 'course' },
        { label: 'Stanford CS109 Probability, lecture 1 (YouTube)', url: 'https://www.youtube.com/watch?v=2MuDZIAzBMY', kind: 'video' },
        { label: 'Independence (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Independence_(probability_theory)', kind: 'article' },
      ],
    },
    {
      slug: 'conditional-and-bayes',
      title: "Conditional probability and Bayes' rule",
      summary: 'After this lesson you can update a probability when you learn a clue, and build a one-word spam filter from a table of 1,000 emails.',
      minutes: 24,
      objectives: [
        'Explain what P(A|B) means and compute it by counting only the cases where B is true.',
        "Compute P(spam | the word free) from a table of 1,000 emails, both by counting and with Bayes' rule.",
        "Write Bayes' rule in symbols and in words.",
        'Explain why the base rate matters, with a rare-case example.',
        'Recognise independence as the case where the clue changes nothing.',
      ],
      keyTerms: ['conditional-probability', 'bayes-rule', 'base-rate', 'independence', 'event', 'probability'],
      body: `
## What this lesson covers

This lesson teaches one question: how does a probability change when you learn something new? The answer is conditional probability, written P(A|B) and read "the probability of A given B". You learn to compute it by counting, and then by Bayes' rule, which reverses a conditional probability. The running example is a table of 1,000 emails. At the end you can build a spam filter that uses one word, and explain why a rare event stays rare even after a strong clue.

## Why it matters

A spam filter, a medical test and a language model all do the same thing. They take a clue and update a probability. A language model asks: given the words so far, what is the probability of each next word? That "given" is conditional probability. Bayes' rule is also how a model's probabilities are read in practice: a strong clue cannot overcome a tiny base rate. The previous lesson, [Probability basics](/courses/math-from-zero/chance/probability-basics), gave you counting. The next lesson, [Random variables, mean, variance, standard deviation](/courses/math-from-zero/chance/mean-variance), turns outcomes into numbers so you can average them.

:::video
id: HZGCoVF3YvM
why: Watch all 15 minutes. 3Blue1Brown draws Bayes' rule as areas of a rectangle, which is the same picture as the email table in this lesson. Pause at the librarian example and try to guess the answer before it is revealed.
:::

## The idea with an example

> **Analogy.** A conditional probability is a zoom. You start with a whole room of people. Someone says "only look at the people wearing glasses". You zoom in on that group and forget everyone else. Now you ask your question again, inside the smaller group. P(A|B) is the share of A inside the group where B is true.

Here is the running example. A company collects 1,000 emails and sorts each one by hand into spam or not spam. It also records whether the email contains the word "free". The table holds the four counts.

| | Contains "free" | Does not contain "free" | Total |
| --- | --- | --- | --- |
| Spam | 150 | 50 | 200 |
| Not spam | 40 | 760 | 800 |
| Total | 190 | 810 | 1,000 |

Read the table before you continue. 200 of the 1,000 emails are spam, so the base rate of spam is 200/1,000 = 0.2. A base rate is how common something is before you look at any clue. The word "free" appears in 190 emails. Most of those, 150, are spam, but 40 normal emails also say "free".

A new email arrives and it contains the word "free". What is the probability that it is spam? This is a conditional probability: P(spam | free). To compute it, zoom in on the column where "free" is true. That column has 190 emails. Of those, 150 are spam. So P(spam | free) = 150/190, about 0.789. Before you saw the word, the probability of spam was 0.2. After you saw it, the probability is 0.789. The clue moved the probability a lot.

:::flow
title: Zooming in on the clue
1,000 emails -> 190 with free: keep only the column where the clue is true
190 with free -> 150 spam: count the spam inside that column
150 spam -> P(spam|free): divide 150 by 190
P(spam|free) -> 0.789: the updated probability
:::

Press Next to follow the zoom one step at a time.

:::scenario
title: Updating the probability of spam
state: emails=1000, spam=200, P(spam)=0.2
step: Before any clue, 200 of 1,000 emails are spam. The base rate is 0.2.
step: The new email contains the word free. Zoom in on the 190 emails that contain free.
state: emails=190
step: Count the spam inside the zoomed group. 150 of the 190 are spam.
state: spam=150
step: Divide 150 by 190. The probability of spam, given the word free, is about 0.789.
state: P(spam|free)=0.789
step: Compare with the base rate. The clue raised the probability from 0.2 to 0.789.
:::

## How it works

### The definition

The zoom has a formula. The probability of A given B is the probability that both happen, divided by the probability of B.

$$P(A \\mid B) = \\frac{P(A \\text{ and } B)}{P(B)}$$

In words: the probability of A given B equals the probability of A and B together, divided by the probability of B. Check it on the table. P(spam and free) = 150/1,000 = 0.15. P(free) = 190/1,000 = 0.19. Divide: 0.15 / 0.19 = 0.789. The formula and the zoom give the same answer, because dividing both counts by 1,000 does not change the ratio.

The direction matters. P(spam | free) and P(free | spam) are different questions with different answers. P(free | spam) zooms in on the spam row: 150 of the 200 spam emails contain "free", so P(free | spam) = 150/200 = 0.75. Swapping the two is one of the most common errors in reasoning, and the next section shows how to move between them correctly.

| Question | Zoom in on | Count | Probability |
| --- | --- | --- | --- |
| P(spam) | all 1,000 emails | 200 spam | 0.2 |
| P(free) | all 1,000 emails | 190 with free | 0.19 |
| P(spam and free) | all 1,000 emails | 150 | 0.15 |
| P(spam given free) | the 190 with free | 150 spam | 0.789 |
| P(free given spam) | the 200 spam | 150 with free | 0.75 |
| P(spam given no free) | the 810 without free | 50 spam | 0.062 |

The last row shows that the absence of a clue is also a clue. An email without "free" is spam with probability only 0.062, below the base rate of 0.2.

### Bayes' rule

In many real problems you know P(free | spam) and not P(spam | free). You can measure how often spam says "free" by reading a pile of known spam. But you want the other direction: when a new email says "free", how likely is spam? Bayes' rule reverses the condition.

$$P(A \\mid B) = \\frac{P(B \\mid A) \\times P(A)}{P(B)}$$

In words: the probability of A given B equals the probability of B given A, times the base rate of A, divided by the probability of B. Each piece has a name. P(A) is the prior, the base rate before the clue. P(B | A) is how likely the clue is when A is true. P(B) is how likely the clue is overall. P(A | B) is the posterior, the probability after the clue.

Apply it to the emails with A = spam and B = free. P(free | spam) = 0.75. P(spam) = 0.2. P(free) = 0.19. Multiply 0.75 by 0.2 to get 0.15, then divide by 0.19 to get 0.789. The rule gives the same number as the zoom. That is the point: the rule is counting written as a formula.

Where does P(B) come from when you do not have the full table? You build it from the two rows. The clue can appear in spam or in normal email, so add the two paths.

$$P(B) = P(B \\mid A) \\times P(A) + P(B \\mid \\text{not } A) \\times P(\\text{not } A)$$

In words: the probability of the clue equals the clue-rate in spam times the share of spam, plus the clue-rate in normal email times the share of normal email. With numbers: 0.75 times 0.2 is 0.15, and 40/800 = 0.05 times 0.8 is 0.04. The sum is 0.19, which matches the table.

1. Write down the base rate P(A). Here it is 0.2.
2. Write down the clue-rate in each group: P(B | A) = 0.75 and P(B | not A) = 0.05.
3. Compute P(B) as the sum of the two paths: 0.15 + 0.04 = 0.19.
4. Divide the A path by the total: 0.15 / 0.19 = 0.789.

### Why the base rate matters

Now change one number. Suppose spam is rare: only 1 percent of email. Keep the clue exactly as strong: "free" appears in 75 percent of spam and 5 percent of normal email. Take 10,000 emails so the counts stay whole.

| | Contains "free" | Does not contain "free" | Total |
| --- | --- | --- | --- |
| Spam | 75 | 25 | 100 |
| Not spam | 495 | 9,405 | 9,900 |
| Total | 570 | 9,430 | 10,000 |

Zoom in on the 570 emails with "free". Only 75 are spam. P(spam | free) = 75/570, about 0.13. The clue is as strong as before, but the answer fell from 0.789 to 0.13. Most emails with "free" are now normal emails, because there are so many normal emails that even a 5 percent rate produces 495 of them. This is the base rate effect. A clue multiplies the odds; it does not replace the starting point. Medical tests show the same effect: a test for a rare disease that is 95 percent accurate still gives mostly false alarms when the disease is rare.

### Independence, again

The previous lesson defined independent events as events that do not affect each other. Conditional probability gives a sharper test. A and B are independent when P(A | B) = P(A), which means the clue changes nothing. In the first table, P(spam | free) = 0.789 and P(spam) = 0.2, so spam and "free" are not independent. The word is a useful clue. If a word appeared in 20 percent of spam and 20 percent of normal email, then P(spam | word) would equal 0.2, and the word would be useless as a clue.

### The rule in code

The code applies Bayes' rule to both tables. Change the numbers and watch the posterior move.

:::code
lang: python
file: bayes.py
def posterior(prior, clue_given_a, clue_given_not_a):
    p_clue = clue_given_a * prior + clue_given_not_a * (1 - prior)
    return clue_given_a * prior / p_clue

# common spam: base rate 0.2
print("P(spam | free), base rate 0.20:", round(posterior(0.20, 0.75, 0.05), 3))
# rare spam: base rate 0.01, same clue
print("P(spam | free), base rate 0.01:", round(posterior(0.01, 0.75, 0.05), 3))
:::

:::code
lang: text
P(spam | free), base rate 0.20: 0.789
P(spam | free), base rate 0.01: 0.132
:::

A real spam filter uses hundreds of words instead of one and multiplies their effects. That design is called naive Bayes, and it was the first filter that worked. You will meet it again in the AI foundations track as the simplest learned classifier.

## Try it

:::exercise
title: A second clue
task: Use the first table of 1,000 emails. The company also records the word "meeting". It appears in 10 of the 200 spam emails and in 400 of the 800 normal emails. A new email contains "meeting". Compute P(spam | meeting) by zooming in, and then with Bayes' rule. Is "meeting" a clue for spam or against it?
hint: Zoom in on the 410 emails that contain meeting. For Bayes, P(meeting | spam) = 10/200 and P(meeting | not spam) = 400/800.
lang: text
solution:
Zoom: 410 emails contain meeting; 10 of them are spam.
P(spam | meeting) = 10/410, about 0.024.

Bayes: P(meeting | spam) = 0.05, P(spam) = 0.2, so the spam path is 0.01.
P(meeting | not spam) = 0.5, P(not spam) = 0.8, so the normal path is 0.40.
P(meeting) = 0.01 + 0.40 = 0.41.
P(spam | meeting) = 0.01 / 0.41, about 0.024.

The word lowers the probability from 0.2 to 0.024. It is a clue against spam.
:::

:::exercise
title: The rare disease
task: A disease affects 1 person in 1,000. A test is positive for 99 percent of people who have the disease and for 2 percent of people who do not. You test positive. Compute the probability that you have the disease. Use a table of 100,000 people, then check with the posterior function above.
hint: 100 of the 100,000 people have the disease. Count positives in both groups, then zoom in on the positives.
lang: python
solution:
# Table: 100 have the disease, 99 of them test positive.
# 99,900 do not, 2 percent of them is 1,998 false positives.
# Positives: 99 + 1,998 = 2,097. P(disease | positive) = 99 / 2097, about 0.047.

def posterior(prior, clue_given_a, clue_given_not_a):
    p_clue = clue_given_a * prior + clue_given_not_a * (1 - prior)
    return clue_given_a * prior / p_clue

print(round(posterior(0.001, 0.99, 0.02), 3))   # 0.047
:::

## Common mistakes

- Mistake: you swap P(spam | free) and P(free | spam) because they sound alike. Fix: say which group you zoom in on; "given free" means you count inside the emails that contain free.
- Mistake: you ignore the base rate and report the clue strength as the answer. Fix: multiply by the prior and divide by the total probability of the clue; a rare event stays fairly rare after one clue.
- Mistake: you compute P(B) from only one row. Fix: the clue can come from both groups, so add the spam path and the normal path.
- Mistake: you treat a word that is common in both groups as a strong clue. Fix: check P(A | B) against P(A); if they are equal, the clue is useless and the events are independent.
- Mistake: you report a posterior above 1 after a multiplication. Fix: a posterior is a probability; recheck that you divided by P(B).

## Check your understanding

:::quiz
title: Check: conditional probability and Bayes
q: In the first table, what is P(free | not spam)?
- 40/190
* 40/800
- 40/1000
why: "Given not spam" means you zoom in on the 800 normal emails, and 40 of them contain free.
q: P(A | B) = 0.3 and P(A) = 0.3. What do you know about A and B?
- B makes A more likely
* B tells you nothing about A; they are independent
- B makes A impossible
why: When the conditional probability equals the base rate, the clue changes nothing, which is the definition of independence.
q: A clue is equally strong in two towns. In town X, 50 percent of emails are spam; in town Y, 1 percent are. After seeing the clue, where is P(spam | clue) higher?
* Town X, because the base rate is higher
- Town Y, because rare things are more surprising
- The same in both, because the clue is equally strong
why: Bayes' rule multiplies the clue by the prior, so a higher base rate gives a higher posterior for the same clue.
q: You know P(B | A) = 0.9, P(A) = 0.1 and P(B) = 0.3. What is P(A | B)?
- 0.027
* 0.3
- 0.9
why: Bayes' rule gives 0.9 times 0.1 divided by 0.3, which is 0.09 / 0.3 = 0.3.
q: Why can a 95 percent accurate test for a rare disease give mostly false alarms?
- Because the test is broken for rare diseases
* Because the many healthy people produce more false positives than the few sick people produce true positives
- Because 95 percent is below the base rate
why: With a tiny base rate, even a 5 percent error rate on the large healthy group outnumbers the correct positives from the small sick group.
:::

## Go further

The 3Blue1Brown video in the links is the clearest picture of Bayes' rule; the Wikipedia page gives the full statement and history. The naive Bayes article shows how the one-word filter grows into a real one. The next lesson, [Random variables, mean, variance, standard deviation](/courses/math-from-zero/chance/mean-variance), stops asking about yes-or-no events and starts asking about numbers: what is the average outcome, and how spread out are the outcomes around it?
`,
      links: [
        { label: "Bayes' theorem (Wikipedia)", url: 'https://en.wikipedia.org/wiki/Bayes%27_theorem', kind: 'article' },
        { label: 'Conditional probability (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Conditional_probability', kind: 'article' },
        { label: "Bayes theorem, the geometry of changing beliefs (3Blue1Brown)", url: 'https://www.youtube.com/watch?v=HZGCoVF3YvM', kind: 'video' },
        { label: 'Naive Bayes spam filtering (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering', kind: 'article' },
      ],
    },
    {
      slug: 'mean-variance',
      title: 'Random variables, mean, variance, standard deviation',
      summary: 'After this lesson you can compute the mean, variance and standard deviation of a short list by hand, and explain what each number tells you.',
      minutes: 23,
      objectives: [
        'Explain what a random variable is, using the number on a die.',
        'Compute the mean of a 6-number list and the expectation of a die.',
        'Compute the variance and the standard deviation of the same list by hand.',
        'Explain why the standard deviation is in the same units as the data and the variance is not.',
        'Compare two lists with the same mean and different spread.',
      ],
      keyTerms: ['random-variable', 'expectation', 'variance', 'standard-deviation', 'outcome', 'probability'],
      body: `
## What this lesson covers

This lesson turns outcomes into numbers and then describes a whole list of numbers with two values. The first value is the mean, which says where the centre is. The second is the variance, or its square root, the standard deviation, which says how spread out the numbers are. You compute all three by hand on one list of 6 numbers and on a fair die. At the end you can look at any column of data and say what is typical and what is unusual.

## Why it matters

Training a model is the act of making an average small. The loss you will meet later is the mean of many errors. Data preparation subtracts the mean and divides by the standard deviation of every column, so that all features sit on the same scale; this step is called standardisation, and models train badly without it. The previous lesson, [Conditional probability and Bayes' rule](/courses/math-from-zero/chance/conditional-and-bayes), worked with yes-or-no events. This lesson works with numbers. The next lesson, [Distributions you will meet](/courses/math-from-zero/chance/distributions), uses the mean and the standard deviation to describe the bell curve.

:::video
id: SzZ6GpcfoQY
why: Watch all 14 minutes. StatQuest computes the mean, variance and standard deviation on a small set of points, with the same steps as this lesson. Note the part about dividing by n minus 1; this lesson explains when that matters.
:::

## The idea with an example

> **Analogy.** The mean is the balance point of a seesaw. Put the numbers on a plank at their positions, each as an equal weight. The mean is the place where the plank balances. The standard deviation says how far from the balance point the weights sit on average. Two planks can balance at the same point with the weights huddled in the middle or spread to the ends.

A random variable is a number whose value depends on a random outcome. The number on a die is a random variable: it can be 1, 2, 3, 4, 5 or 6, each with probability 1/6. The number of emails you get in a day is a random variable too. You do not know it in advance, but it has a pattern, and the mean and the variance describe that pattern.

Here is the running example. A person counts the emails they receive on 6 days. The list is 3, 5, 6, 6, 8 and 14. Each number is one observation of the random variable "emails per day".

### The mean

The mean is the sum of the numbers divided by how many there are. We write the mean of a list as $\\bar{x}$, said "x bar", and the number of items as $n$.

$$\\bar{x} = \\frac{x_1 + x_2 + \\dots + x_n}{n}$$

In words: add up every number, then divide by the count. For the list: 3 + 5 + 6 + 6 + 8 + 14 = 42, and 42 / 6 = 7. The mean is 7 emails per day. Notice that no day had exactly 7 emails. The mean is a summary, not a value from the list.

For a random variable with known probabilities, the same idea is called the expectation or expected value, written $E[X]$. You multiply each value by its probability and add up.

$$E[X] = \\sum_{i} x_i \\, P(x_i)$$

In words: the expectation equals each possible value times its probability, added over all values. For a fair die, each value has probability 1/6, so E[X] = (1 + 2 + 3 + 4 + 5 + 6) / 6 = 21 / 6 = 3.5. The expectation of a die is 3.5, a value the die can never show. Over many rolls, the average of the rolls gets close to 3.5. The mean of a list and the expectation of a random variable are the same idea; the list version gives each number the probability 1/n.

### The variance and the standard deviation

Two lists can share a mean and look nothing alike. The list 6, 7, 7, 7, 7, 8 also adds up to 42 and has mean 7. But its numbers hug the mean, while the email list reaches from 3 to 14. The variance measures this spread. To compute it, measure how far each number is from the mean, square each distance, and average the squares.

$$\\text{Var}(X) = \\frac{(x_1 - \\bar{x})^2 + (x_2 - \\bar{x})^2 + \\dots + (x_n - \\bar{x})^2}{n}$$

In words: subtract the mean from each number, square each result, add the squares, and divide by the count. The table does this for the email list.

| Value | Value minus mean | Squared |
| --- | --- | --- |
| 3 | 3 - 7 = -4 | 16 |
| 5 | 5 - 7 = -2 | 4 |
| 6 | 6 - 7 = -1 | 1 |
| 6 | 6 - 7 = -1 | 1 |
| 8 | 8 - 7 = 1 | 1 |
| 14 | 14 - 7 = 7 | 49 |
| Sum | 0 | 72 |

The squares add up to 72, and 72 / 6 = 12. The variance is 12. Look at the middle column: the distances add up to 0. They always do, because the mean is the balance point, and the negative distances cancel the positive ones. That is why the formula squares each distance. Squaring makes every term positive, and it also makes a large distance count much more: the day with 14 emails contributes 49 of the 72.

The variance is in squared units: 12 emails squared, which means nothing to a person. The standard deviation fixes this by taking the square root.

$$\\sigma = \\sqrt{\\text{Var}(X)}$$

In words: the standard deviation is the square root of the variance. The symbol is the Greek letter sigma. For the email list, the standard deviation is $\\sqrt{12}$, about 3.46 emails. Read it like this: on a typical day, the count is about 3.5 emails away from the mean of 7.

The flow shows the whole computation in order.

:::flow
title: From a list to its standard deviation
List -> Mean: add the numbers and divide by n
Mean -> Distances: subtract the mean from each number
Distances -> Squares: square each distance
Squares -> Variance: average the squares
Variance -> Std deviation: take the square root
:::

Press Next to compute all three values on the email list.

:::scenario
title: Mean, variance and standard deviation of 3, 5, 6, 6, 8, 14
state: sum=?, mean=?, variance=?, sd=?
step: Add the six numbers: 3 + 5 + 6 + 6 + 8 + 14.
state: sum=42
step: Divide the sum by 6 to get the mean.
state: mean=7
step: Subtract 7 from each number: -4, -2, -1, -1, 1, 7. They add up to 0.
state: distances=-4 -2 -1 -1 1 7
step: Square each distance: 16, 4, 1, 1, 1, 49. Add them: 72.
state: squares sum=72
step: Divide 72 by 6 to get the variance.
state: variance=12
step: Take the square root of 12 to get the standard deviation.
state: sd=3.46
:::

## How it works

### Two lists, one mean

Compute the same numbers for the hugging list 6, 7, 7, 7, 7, 8. The mean is 42 / 6 = 7. The distances are -1, 0, 0, 0, 0, 1. The squares are 1, 0, 0, 0, 0, 1, with sum 2. The variance is 2 / 6, about 0.33, and the standard deviation is about 0.58. The two lists share a mean of 7, but one has a standard deviation of 3.46 and the other of 0.58. A person with the first inbox cannot plan their day; a person with the second one can.

:::bars
title: Standard deviation of two lists with mean 7
unit: emails
List 3 5 6 6 8 14: 3.46
List 6 7 7 7 7 8: 0.58
:::

### The expectation and variance of a die

For a random variable with probabilities, the variance uses the expectation in place of the mean, and weights each squared distance by its probability. For a fair die, E[X] = 3.5. The distances are -2.5, -1.5, -0.5, 0.5, 1.5 and 2.5. The squares are 6.25, 2.25, 0.25, 0.25, 2.25 and 6.25, with sum 17.5. Each has probability 1/6, so the variance is 17.5 / 6, about 2.92, and the standard deviation is about 1.71. A single roll lands, on average, about 1.7 away from 3.5.

| Quantity | Email list | Fair die |
| --- | --- | --- |
| Values | 3, 5, 6, 6, 8, 14 | 1, 2, 3, 4, 5, 6 |
| Weight of each value | 1/6 each (one list item) | 1/6 each (probability) |
| Mean or expectation | 7 | 3.5 |
| Variance | 12 | 2.92 |
| Standard deviation | 3.46 | 1.71 |

### Dividing by n or by n minus 1

You will see two versions of the variance formula. The one above divides by n. It is right when the list is the whole population, or when the probabilities are known, as for the die. When the list is a small sample from a larger population, statisticians divide by n minus 1 instead. The reason is that a sample tends to sit a little closer to its own mean than to the true mean, so dividing by n gives a variance that is slightly too small. For the email list, dividing by 5 gives 72 / 5 = 14.4 and a standard deviation of about 3.79. With 6 numbers the two versions differ a lot; with 1,000 numbers they differ by a tenth of a percent. In machine learning code you will meet both. The important thing is to know which one a library uses, and the code below shows how to check.

### Why the mean can mislead

The mean follows the extremes. Replace the 14 in the email list with 50. The sum becomes 78 and the mean becomes 13, higher than 5 of the 6 values. The median, which is the middle value after sorting, stays at 6. When a list has a few huge values, such as incomes or file sizes, report the median with the mean. The standard deviation jumps too: with 50 in the list it rises to about 16.7. A large standard deviation is a warning that the mean alone does not describe the data.

### The computation in code

Python has a statistics module in its standard library. The functions pvariance and pstdev divide by n, which is the population version used above. The functions variance and stdev divide by n minus 1.

:::code
lang: python
file: spread.py
import statistics

emails = [3, 5, 6, 6, 8, 14]

print("mean:", statistics.mean(emails))
print("variance (divide by n):", statistics.pvariance(emails))
print("std deviation (divide by n):", round(statistics.pstdev(emails), 2))
print("variance (divide by n-1):", statistics.variance(emails))

# the expectation and variance of a fair die, from its probabilities
values = [1, 2, 3, 4, 5, 6]
probs = [1 / 6] * 6
mean = sum(v * p for v, p in zip(values, probs))
var = sum((v - mean) ** 2 * p for v, p in zip(values, probs))
print("die expectation:", mean, "variance:", round(var, 2))
:::

:::code
lang: text
mean: 7
variance (divide by n): 12
std deviation (divide by n): 3.46
variance (divide by n-1): 14.4
die expectation: 3.5 variance: 2.92
:::

### Standardisation

Models work with many columns at once, such as a house price in hundreds of thousands and a room count under 10. A column with large numbers can drown out the others. The fix is to subtract the mean from each value and divide by the standard deviation. The new column has mean 0 and standard deviation 1. For the email list, the day with 14 emails becomes (14 - 7) / 3.46, about 2.02: that day was about two standard deviations above the mean. The day with 3 becomes (3 - 7) / 3.46, about -1.16. These are called z-scores, and the next lesson shows why a z-score of 2 is rare.

## Try it

:::exercise
title: Compute by hand
task: A student records the minutes it took to solve 6 puzzles: 4, 8, 9, 11, 12, 16. On paper, compute the mean, the variance (divide by n) and the standard deviation. Then say which puzzle time is most unusual.
hint: The sum is 60. Make a table with three columns like the one in the lesson. The squares should add up to 82.
lang: text
solution:
Sum: 4 + 8 + 9 + 11 + 12 + 16 = 60. Mean: 60 / 6 = 10.
Distances: -6, -2, -1, 1, 2, 6. They add up to 0.
Squares: 36, 4, 1, 1, 4, 36. Sum: 82.
Variance: 82 / 6 = 13.67. Standard deviation: square root of 13.67 = 3.70.
Most unusual: 4 and 16 are both 6 away from the mean, about 1.6 standard deviations.
:::

:::exercise
title: Check the computer
task: Put the puzzle times into the spread.py program in place of the email list. Confirm your hand answers. Then replace 16 with 40 and watch what happens to the mean and the standard deviation.
hint: Only the list line needs to change. Use pvariance and pstdev to match the divide-by-n version.
lang: python
solution:
import statistics

times = [4, 8, 9, 11, 12, 16]
print(statistics.mean(times), statistics.pvariance(times), round(statistics.pstdev(times), 2))
# 10 13.666... 3.7

times = [4, 8, 9, 11, 12, 40]
print(statistics.mean(times), round(statistics.pstdev(times), 2))
# 14 11.9  -> the mean is now above 5 of the 6 values and the spread tripled
:::

## Common mistakes

- Mistake: you average the distances from the mean without squaring and get 0. Fix: the distances always cancel; square them first, then average.
- Mistake: you report the variance as the spread in the original units. Fix: the variance is in squared units; take the square root to get the standard deviation.
- Mistake: you expect the mean to be one of the values. Fix: the mean is a balance point; a die has expectation 3.5 and never shows 3.5.
- Mistake: you mix the divide-by-n and divide-by-n-minus-1 versions and get two different answers. Fix: pick one on purpose; use n for a full population or known probabilities, and n minus 1 for a sample.
- Mistake: you trust the mean of a list with one huge value. Fix: look at the standard deviation and the median; if the standard deviation is large, the mean alone misleads.

## Check your understanding

:::quiz
title: Check: mean, variance and standard deviation
q: A list is 2, 4, 6, 8. What is its mean?
- 4
* 5
- 6
why: The sum is 20 and there are 4 numbers, so the mean is 20 / 4 = 5.
q: Two lists have the same mean. List A has standard deviation 1 and list B has standard deviation 9. Which statement is true?
- List A has larger values
* List B's values sit further from the mean on average
- List B has more values
why: The standard deviation measures spread around the mean, not size or count.
q: What is the variance of the list 5, 5, 5, 5?
* 0
- 5
- 25
why: Every value equals the mean, so every distance is 0, and the average of the squares is 0.
q: You flip a fair coin and win 10 if it shows heads and 0 if it shows tails. What is the expectation of your winnings?
- 0
* 5
- 10
why: The expectation is 10 times 0.5 plus 0 times 0.5, which is 5.
q: Why does the variance formula square the distances from the mean?
- To make the numbers bigger so they are easier to read
* So that negative and positive distances do not cancel, and large distances count more
- Because the mean is always positive
why: Without squaring, the distances add up to 0 for every list; squaring also gives extra weight to far-away values.
q: A feature column has mean 50 and standard deviation 5. A value of 65 becomes which z-score after standardisation?
- 1
- 15
* 3
why: Subtract the mean and divide by the standard deviation: (65 - 50) / 5 = 3.
:::

## Go further

The StatQuest video in the links is the best 14 minutes on this topic. The Wikipedia pages on variance and standard deviation go into the sample versus population question in detail. The Python statistics module documentation lists every function used here. The next lesson, [Distributions you will meet](/courses/math-from-zero/chance/distributions), describes the shapes that random variables take, and shows that for the bell curve the mean and the standard deviation are all you need.
`,
      links: [
        { label: 'Mean, variance and standard deviation (StatQuest)', url: 'https://www.youtube.com/watch?v=SzZ6GpcfoQY', kind: 'video' },
        { label: 'Variance (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Variance', kind: 'article' },
        { label: 'Standard deviation (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Standard_deviation', kind: 'article' },
        { label: 'statistics module (Python docs)', url: 'https://docs.python.org/3/library/statistics.html', kind: 'docs' },
      ],
    },
    {
      slug: 'distributions',
      title: 'Distributions you will meet',
      summary: 'After this lesson you can recognise the uniform, Bernoulli, categorical and normal distributions, and turn three raw scores into a categorical distribution with softmax.',
      minutes: 24,
      objectives: [
        'Explain what a probability distribution is and check that its probabilities add up to 1.',
        'Describe the uniform, Bernoulli, categorical and normal distributions with one example each.',
        'Use the 68-95-99.7 rule to say how rare a value is under a normal distribution.',
        'Compute softmax by hand on the three scores 2, 1 and 0.',
        'Explain why a model outputs a categorical distribution instead of one answer.',
      ],
      keyTerms: ['distribution', 'uniform-distribution', 'bernoulli-distribution', 'categorical-distribution', 'normal-distribution', 'softmax', 'random-variable'],
      body: `
## What this lesson covers

This lesson introduces the four distributions you will meet most often in AI. A distribution is the full list of what a random variable can be and how likely each value is. You meet the uniform distribution of a fair die, the Bernoulli distribution of a coin, the categorical distribution of a model choosing between classes, and the normal distribution, which is the bell curve. You also learn softmax, the function that turns raw scores into a categorical distribution. At the end you can compute softmax by hand on three scores.

## Why it matters

A classifier does not answer "cat". It answers with a categorical distribution: cat 0.665, dog 0.245, bird 0.090. A language model outputs a categorical distribution over every word it knows, and sampling picks the next word from it. The weights of a neural network start as random draws from a normal distribution. The previous lesson, [Random variables, mean, variance, standard deviation](/courses/math-from-zero/chance/mean-variance), gave you the mean and the standard deviation; this lesson shows that these two numbers fully describe the normal distribution. The next lesson, [Surprise, entropy and cross-entropy](/courses/math-from-zero/chance/entropy-and-cross-entropy), measures how good a predicted distribution is.

:::video
id: KpKog-L9veg
why: Watch all 11 minutes. StatQuest computes softmax on three raw scores, the same way the running example does below. Note that the output values always add up to 1.
:::

## The idea with an example

> **Analogy.** A distribution is a recipe for a bag of marbles. The uniform recipe says: equal numbers of each colour. The Bernoulli recipe says: two colours, with a chosen share of red. The categorical recipe says: any number of colours, each with its own share. The normal recipe is different: the marbles are numbered, and the numbers crowd around a centre and thin out on both sides. In every case, one draw from the bag is one outcome.

A probability distribution assigns a probability to every value a random variable can take. For a variable with a finite list of values, the distribution is a table. Each probability is between 0 and 1, and all of them add up to 1. Here is the distribution of a fair die.

| Value | 1 | 2 | 3 | 4 | 5 | 6 |
| --- | --- | --- | --- | --- | --- | --- |
| Probability | 1/6 | 1/6 | 1/6 | 1/6 | 1/6 | 1/6 |

Every probability is the same, so this is a uniform distribution. Uniform means "spread evenly". The uniform distribution is the distribution of knowing nothing: no value is favoured over another.

Here is the running example for softmax. An image classifier looks at a photo and must say whether it shows a cat, a dog or a bird. Inside, the model computes one raw score per class. The scores for this photo are 2 for cat, 1 for dog and 0 for bird. A raw score is any number, positive or negative, and the three do not add up to anything useful. Softmax turns them into a distribution.

Softmax has two steps. First, raise the number e to the power of each score. The number e is about 2.718, and you met it in the lesson on exponents. Raising e to a power makes every score positive, and it makes gaps bigger. Second, divide each result by the sum of all of them, so the results add up to 1.

| Class | Score | e to the score | Divided by the sum 11.107 |
| --- | --- | --- | --- |
| cat | 2 | 7.389 | 0.665 |
| dog | 1 | 2.718 | 0.245 |
| bird | 0 | 1.000 | 0.090 |
| Sum | | 11.107 | 1.000 |

The model now says: cat with probability 0.665, dog with 0.245, bird with 0.090. This is a categorical distribution with three values. The order of the scores is kept: cat had the highest score and has the highest probability. The gaps grew: the scores were evenly spaced, 1 apart, but the probabilities are not.

:::flow
title: Softmax on the scores 2, 1, 0
Scores 2 1 0 -> Exponentials: raise e to each score
Exponentials -> Sum 11.107: add the three results
Sum 11.107 -> Probabilities: divide each by the sum
Probabilities -> Check: 0.665 + 0.245 + 0.090 = 1
:::

Press Next to compute softmax step by step.

:::scenario
title: Softmax by hand
state: cat=2, dog=1, bird=0
step: Start with the three raw scores from the model: 2, 1 and 0.
step: Raise e to each score. e squared is 7.389, e to the 1 is 2.718, e to the 0 is 1.
state: cat=7.389, dog=2.718, bird=1.000
step: Add the three results: 7.389 + 2.718 + 1.000 = 11.107.
state: sum=11.107
step: Divide each result by 11.107.
state: cat=0.665, dog=0.245, bird=0.090
step: Check the sum. 0.665 + 0.245 + 0.090 = 1.000, so this is a valid distribution.
:::

## How it works

### The four distributions

| Distribution | What it describes | Parameters | Example |
| --- | --- | --- | --- |
| Uniform | n values, all equally likely | the number of values n | a fair die, n = 6 |
| Bernoulli | one yes-or-no trial | the success probability p | a coin, p = 0.5; an email being spam, p = 0.2 |
| Categorical | one trial with k choices | k probabilities that add up to 1 | the classifier: cat 0.665, dog 0.245, bird 0.090 |
| Normal | a continuous number that crowds around a centre | the mean and the standard deviation | adult heights: mean 170 cm, standard deviation 10 cm |

1. The uniform distribution over n values gives each value probability 1/n. The die is uniform with n = 6. A computer function such as random.random() gives a uniform number between 0 and 1, and every random process in a program starts from it.
2. The Bernoulli distribution has two outcomes. Call them 1 and 0, or success and failure. The probability of 1 is p and the probability of 0 is 1 - p. A spam filter that outputs 0.789 is stating a Bernoulli distribution: spam with probability 0.789, not spam with 0.211. The expectation of a Bernoulli variable is p, and its variance is p times (1 - p). For a fair coin, the variance is 0.25.
3. The categorical distribution extends Bernoulli to k outcomes. A die is categorical with k = 6 and equal probabilities, which makes it uniform too. The classifier is categorical with k = 3. A language model is categorical with k equal to the size of its vocabulary, often around 100,000.
4. The normal distribution describes a continuous variable, which is a number that can take any value in a range, such as a height. It has no table, because there are infinitely many values. Instead it has a curve, the bell curve, and the probability of landing in a range is the area under the curve over that range. Two numbers set the curve: the mean, where the peak sits, and the standard deviation, how wide the bell is.

If you repeat a Bernoulli trial n times and count the successes, the count follows the binomial distribution. The number of heads in 10 coin flips is binomial. It sits between the Bernoulli and the normal: for large n its shape becomes a bell. The StatQuest video in the links shows it with a worked example.

### The normal distribution and the 68-95-99.7 rule

Take adult heights with mean 170 cm and standard deviation 10 cm. The normal distribution says how heights spread around 170. About 68 percent of people are within 1 standard deviation of the mean, between 160 and 180 cm. About 95 percent are within 2 standard deviations, between 150 and 190. About 99.7 percent are within 3, between 140 and 200. These three numbers are worth remembering. They let you judge any value by its z-score from the previous lesson, which is the distance from the mean in standard deviations.

:::matrix
title: Share of a normal distribution in each band, in percent
cols: below -3, -3 to -2, -2 to -1, -1 to 0, 0 to 1, 1 to 2, 2 to 3, above 3
share: 0.1, 2.1, 13.6, 34.1, 34.1, 13.6, 2.1, 0.1
:::

The grid shows the bands in standard deviations. A height of 195 cm is 2.5 standard deviations above the mean. Fewer than 1 percent of people are that tall, because the bands above 2 hold only 2.1 + 0.1 = 2.2 percent. Models use this rule when they look for unusual values in data: a z-score beyond 3 is a candidate outlier.

The normal distribution appears everywhere for a reason. When you add up many small independent effects, the sum tends toward a bell curve, whatever the effects looked like on their own. This is called the central limit theorem. Heights add up genes and nutrition. Measurement errors add up small disturbances. The average of many dice rolls is nearly normal. That is why the normal distribution is the default guess when nothing else is known, and why neural network weights are drawn from it at the start of training.

### Softmax in general

For a list of k scores $z_1, z_2, \\dots, z_k$, softmax gives the probability of class i as:

$$p_i = \\frac{e^{z_i}}{e^{z_1} + e^{z_2} + \\dots + e^{z_k}}$$

In words: raise e to the score of class i, then divide by the sum of e raised to every score. Three facts follow. The probabilities add up to 1, because each is a share of the same sum. The biggest score gets the biggest probability, because e to a bigger power is bigger. And adding the same number to every score changes nothing, because the shared factor cancels in the division; the scores 12, 11, 10 give the same probabilities as 2, 1, 0.

Scaling the scores does change the result. Multiply the scores by 2 to get 4, 2, 0. Then e to the 4 is 54.6, e to the 2 is 7.39, e to the 0 is 1, with sum 63.0, and the probabilities become 0.867, 0.117 and 0.016. The distribution is sharper: the model is more confident. Divide the scores by 2 to get 1, 0.5, 0, and the probabilities become 0.506, 0.307 and 0.186, which is flatter. The number you divide the scores by is called the temperature, and it is a setting you will adjust when you use a language model.

| Scores | cat | dog | bird | Shape |
| --- | --- | --- | --- | --- |
| 1, 0.5, 0 (temperature 2) | 0.506 | 0.307 | 0.186 | flatter |
| 2, 1, 0 (temperature 1) | 0.665 | 0.245 | 0.090 | the running example |
| 4, 2, 0 (temperature 0.5) | 0.867 | 0.117 | 0.016 | sharper |

### Distributions in code

The code computes softmax on the three scores and draws samples from each distribution. Run it twice; the samples change and the softmax does not.

:::code
lang: python
file: distributions.py
import math
import random

scores = [2, 1, 0]
exps = [math.exp(z) for z in scores]
total = sum(exps)
probs = [x / total for x in exps]
print("softmax:", [round(p, 3) for p in probs], "sum:", round(sum(probs), 3))

print("uniform die:", random.randint(1, 6))
print("bernoulli p=0.2:", 1 if random.random() < 0.2 else 0)
print("categorical:", random.choices(["cat", "dog", "bird"], weights=probs)[0])
print("normal mean 170 sd 10:", round(random.gauss(170, 10), 1))
:::

:::code
lang: text
softmax: [0.665, 0.245, 0.09] sum: 1.0
uniform die: 4
bernoulli p=0.2: 0
categorical: cat
normal mean 170 sd 10: 176.3
:::

The last three lines will differ on your computer. Over many runs, the categorical line says cat about 66.5 percent of the time, and the normal line stays between 150 and 190 about 95 percent of the time.

## Try it

:::exercise
title: Softmax on new scores
task: A model gives the scores 3, 1 and 1 for cat, dog and bird. Compute softmax by hand with e to the 3 = 20.09 and e to the 1 = 2.718. Then compute it for the scores 0, 0, 0. What shape does the second result have?
hint: Add the three exponentials first. For 0, 0, 0, every exponential is 1.
lang: text
solution:
Scores 3, 1, 1:
exponentials 20.09, 2.718, 2.718; sum 25.53
probabilities 0.787, 0.106, 0.106

Scores 0, 0, 0:
exponentials 1, 1, 1; sum 3
probabilities 0.333, 0.333, 0.333
This is the uniform distribution: the model has no preference.
:::

:::exercise
title: How rare is it?
task: Exam scores follow a normal distribution with mean 60 and standard deviation 8. Use the 68-95-99.7 rule. About what share of students score above 76? About what share score between 52 and 68? Then run random.gauss(60, 8) 10,000 times in Python and count how many results are above 76.
hint: Convert each score to a z-score first: (76 - 60) / 8 = 2.
lang: python
solution:
# Above 76 is above 2 standard deviations: about 2.5 percent (half of the 5 percent outside).
# Between 52 and 68 is within 1 standard deviation: about 68 percent.
import random

count = sum(1 for i in range(10000) if random.gauss(60, 8) > 76)
print(count / 10000)   # about 0.023
:::

## Common mistakes

- Mistake: you read the raw scores 2, 1, 0 as probabilities. Fix: raw scores can be any numbers; only after softmax do they add up to 1.
- Mistake: you think softmax keeps the gaps between scores. Fix: softmax keeps the order but stretches the gaps; 2, 1, 0 becomes 0.665, 0.245, 0.090.
- Mistake: you ask for the probability that a height is exactly 170.000 cm. Fix: a continuous variable has probability 0 at any single point; ask for a range, such as 169 to 171.
- Mistake: you treat the 68-95-99.7 rule as true for every distribution. Fix: it holds for the normal distribution; a die or an income list has a different shape.
- Mistake: you think a sharper softmax means a more accurate model. Fix: sharpness is confidence, not correctness; a model can be confidently wrong, and the next lesson measures that.

## Check your understanding

:::quiz
title: Check: distributions and softmax
q: Which table is a valid probability distribution over three values?
- 0.5, 0.5, 0.5
* 0.2, 0.3, 0.5
- 0.6, 0.6, -0.2
why: The probabilities must each lie between 0 and 1 and add up to exactly 1; only the second does.
q: A model outputs the scores 5, 5 and 5 for three classes. What does softmax give?
- 5, 5, 5
* 1/3, 1/3, 1/3
- 1, 0, 0
why: Equal scores give equal exponentials, so each class gets an equal share: the uniform distribution.
q: The scores 2, 1, 0 give probabilities 0.665, 0.245, 0.090. What do the scores 102, 101, 100 give?
* The same probabilities
- Probabilities close to 1, 0, 0
- Probabilities close to 1/3 each
why: Adding the same constant to every score cancels in the division, so softmax does not change.
q: Test times are normal with mean 40 minutes and standard deviation 5. About what share of people take between 30 and 50 minutes?
- 68 percent
* 95 percent
- 99.7 percent
why: 30 and 50 are each 2 standard deviations from 40, and about 95 percent of a normal distribution lies within 2 standard deviations.
q: A spam filter outputs 0.789 for one email. Which distribution is it stating?
- A uniform distribution over 2 values
* A Bernoulli distribution with p = 0.789
- A normal distribution with mean 0.789
why: One yes-or-no outcome with a given probability of yes is a Bernoulli distribution.
q: You multiply all three scores by 3 before softmax. What happens to the distribution?
- It stays the same
- It becomes flatter
* It becomes sharper, with more probability on the top class
why: Scaling the scores up widens the gaps between exponentials, so the biggest class takes a larger share.
:::

## Go further

The StatQuest videos in the links cover softmax and the binomial distribution with worked numbers. The Wikipedia page on the normal distribution explains the 68-95-99.7 rule and the central limit theorem. The softmax page lists the properties used here. The next lesson, [Surprise, entropy and cross-entropy](/courses/math-from-zero/chance/entropy-and-cross-entropy), takes the classifier's distribution 0.665, 0.245, 0.090 and asks the question that training depends on: how wrong is it, as a single number?
`,
      links: [
        { label: 'Softmax (StatQuest)', url: 'https://www.youtube.com/watch?v=KpKog-L9veg', kind: 'video' },
        { label: 'Binomial distribution (StatQuest)', url: 'https://www.youtube.com/watch?v=8idr1WZ1A7Q', kind: 'video' },
        { label: 'Normal distribution (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Normal_distribution', kind: 'article' },
        { label: 'Softmax function (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Softmax_function', kind: 'article' },
        { label: 'random module (Python docs)', url: 'https://docs.python.org/3/library/random.html', kind: 'docs' },
      ],
    },
    {
      slug: 'entropy-and-cross-entropy',
      title: 'Surprise, entropy and cross-entropy',
      summary: 'After this lesson you can compute the surprise of an outcome in bits, the entropy of a coin and a die, and the cross-entropy loss of a 3-class prediction.',
      minutes: 25,
      objectives: [
        'Compute the surprise of an outcome as minus the log base 2 of its probability.',
        'Compute the entropy of a fair coin, a biased coin and a fair die.',
        'Explain why the uniform distribution has the highest entropy.',
        'Compute the cross-entropy loss for the prediction 0.665, 0.245, 0.090 when the true class is cat, and when it is bird.',
        'Explain why cross-entropy is the training loss for every classifier and language model.',
      ],
      keyTerms: ['surprise', 'entropy', 'cross-entropy', 'categorical-distribution', 'softmax', 'kl-divergence', 'probability'],
      body: `
## What this lesson covers

This lesson gives a number to the idea of being surprised. A likely outcome carries little surprise; an unlikely one carries a lot. The average surprise of a distribution is its entropy, measured in bits. When a model predicts a distribution and the truth arrives, the surprise of the truth under the model's prediction is the cross-entropy. That number is the loss that trains almost every classifier and every language model. You compute all three by hand on a coin, a die and the 3-class classifier from the previous lesson.

## Why it matters

When you train a model later on this site, you will watch one number go down: the loss. For classifiers and language models that number is cross-entropy. If you know what it measures, you can read a training curve, tell when a model is confidently wrong, and understand why perplexity is reported for language models. The previous lesson, [Distributions you will meet](/courses/math-from-zero/chance/distributions), produced the prediction cat 0.665, dog 0.245, bird 0.090 with softmax. This lesson scores it. It is the last lesson of the mathematics track; the AI foundations track uses this loss from its first model onward.

:::video
id: 6ArSys5qHAU
why: Watch all 10 minutes. StatQuest computes cross-entropy for a 3-class prediction, exactly the running example of this lesson. Note that the video uses the natural logarithm; this lesson starts with log base 2 and explains the difference.
:::

## The idea with an example

> **Analogy.** Surprise is the length of the news story. "The sun rose this morning" is no story at all: everyone expected it. "It snowed in the desert" is a long story, because nobody expected it. The less likely the event, the more there is to tell. Entropy is the average story length for a source of news. A fair coin produces short stories; a lottery produces one very long story and many empty ones.

The running example starts with a fair coin. Heads has probability 0.5. When it lands heads, how surprised are you? The surprise of an outcome with probability p is defined as:

$$\\text{surprise}(p) = -\\log_2(p)$$

In words: the surprise equals minus the logarithm, base 2, of the probability. The logarithm base 2 of a number is the power you raise 2 to in order to get that number. You met logarithms in the lesson on exponents. For p = 0.5, log base 2 of 0.5 is -1, because 2 to the power -1 is 0.5. Minus that is 1. So a fair coin landing heads has a surprise of 1 bit. The unit is the bit, the same bit as in a computer, and the match is not an accident: 1 bit is exactly what it takes to tell someone which of 2 equally likely things happened.

| Probability of the outcome | Surprise in bits | Why |
| --- | --- | --- |
| 1 | 0 | 2 to the power 0 is 1; a sure thing carries no news |
| 0.5 | 1 | 2 to the power -1 is 0.5 |
| 0.25 | 2 | 2 to the power -2 is 0.25 |
| 0.125 | 3 | 2 to the power -3 is 0.125 |
| 1/6, about 0.167 | 2.585 | 2 to the power -2.585 is 1/6 |
| 0.01 | 6.644 | a 1-in-100 event is a long story |

The minus sign is there because logarithms of numbers below 1 are negative, and surprise should be positive. The table shows the pattern: each time the probability halves, the surprise grows by 1 bit. A probability of 0 would give infinite surprise. That matters for models: a model must never give the true answer probability 0, or its loss explodes.

:::bars
title: Surprise of an outcome, by its probability
unit: bits
p = 1: 0
p = 0.5: 1
p = 0.25: 2
p = 0.125: 3
p = 0.01: 6.64
:::

### Entropy: the average surprise

Entropy is the expected surprise of a distribution. Take each outcome, multiply its probability by its surprise, and add up.

$$H = -\\sum_{i} p_i \\log_2(p_i)$$

In words: the entropy equals the sum over all outcomes of the probability times the surprise of that outcome. For the fair coin, both outcomes have probability 0.5 and surprise 1 bit, so H = 0.5 times 1 + 0.5 times 1 = 1 bit. A fair coin has 1 bit of entropy: on average, you need 1 bit to report a flip.

Now a biased coin that lands heads with probability 0.9. Heads has surprise -log2(0.9) = 0.152 bits; it is barely news. Tails has surprise -log2(0.1) = 3.322 bits; it is a real story. The entropy is 0.9 times 0.152 + 0.1 times 3.322 = 0.137 + 0.332 = 0.469 bits. The biased coin has less than half the entropy of the fair coin. It is more predictable, so on average there is less to report.

A fair die has 6 outcomes with probability 1/6 and surprise 2.585 bits each. The entropy is 6 times 1/6 times 2.585 = 2.585 bits. That is log base 2 of 6. For any uniform distribution over n outcomes, the entropy is log base 2 of n, and no other distribution over n outcomes has higher entropy. The uniform distribution is the most unpredictable one.

:::flow
title: From probability to loss
Probability -> Surprise: take minus the log base 2
Surprise -> Entropy: average over the true distribution
Surprise -> Cross-entropy: average over the model's predictions
Cross-entropy -> Training: lower it by changing the model
:::

Press Next to compute the entropy of the biased coin.

:::scenario
title: Entropy of a coin with P(heads) = 0.9
state: P(heads)=0.9, P(tails)=0.1
step: Compute the surprise of heads: minus log base 2 of 0.9.
state: surprise(heads)=0.152
step: Compute the surprise of tails: minus log base 2 of 0.1.
state: surprise(tails)=3.322
step: Weight each surprise by its probability: 0.9 times 0.152 and 0.1 times 3.322.
state: weighted=0.137 and 0.332
step: Add the two weighted surprises.
state: entropy=0.469 bits
step: Compare with the fair coin, which has entropy 1 bit. The biased coin is more predictable.
:::

## How it works

### Cross-entropy: surprise under the wrong distribution

Entropy uses one distribution, the true one. Cross-entropy uses two. The truth follows a distribution p, but you predict a distribution q and you are surprised according to q. The cross-entropy is the average surprise you feel.

$$H(p, q) = -\\sum_{i} p_i \\log_2(q_i)$$

In words: the cross-entropy equals the sum over outcomes of the true probability times the surprise under the predicted probability. If your prediction q equals the truth p, the cross-entropy equals the entropy. If your prediction is wrong, the cross-entropy is larger. It is never smaller. The gap between the cross-entropy and the entropy is called the Kullback-Leibler (KL) divergence, and it measures how far q is from p.

Now the running example. The classifier predicted cat 0.665, dog 0.245, bird 0.090 for a photo. The photo shows a cat. The true distribution p is cat 1, dog 0, bird 0, because the truth is certain. Put it into the formula. The terms for dog and bird vanish, because their true probability is 0. Only the cat term survives:

$$H(p, q) = -1 \\times \\log_2(0.665) = 0.589 \\text{ bits}$$

In words: when the truth is one class, the cross-entropy is the surprise of that class under the model's prediction. The model gave the right answer probability 0.665, so the loss is 0.589 bits. Now suppose the same photo showed a bird. The model gave bird only 0.090, so the loss is -log2(0.090) = 3.474 bits. The same prediction gets a low loss for one truth and a high loss for another. That is what you want from a loss: it punishes confidence in the wrong answer.

| True class | Model's probability for it | Cross-entropy in bits | Cross-entropy in nats |
| --- | --- | --- | --- |
| cat | 0.665 | 0.589 | 0.408 |
| dog | 0.245 | 2.029 | 1.406 |
| bird | 0.090 | 3.474 | 2.408 |
| any class, if the model gave it 1.0 | 1.0 | 0 | 0 |

The last column uses the natural logarithm, with base e, instead of base 2. Training code almost always uses the natural logarithm, and the unit is then called a nat instead of a bit. Nothing else changes: the order of the rows is the same, and a nat is just 1.443 bits. When a training log says the loss is 0.408, read it as 0.408 nats, which is 0.589 bits.

### The loss over a batch

A model sees many examples at once. The loss reported in training is the mean cross-entropy over the batch. Suppose a batch holds 3 photos. The model gives the true class of the first photo probability 0.665, of the second 0.5, and of the third 0.1. The three surprises in bits are 0.589, 1 and 3.322, and their mean is 4.911 / 3 = 1.637 bits. Training changes the model's parameters a little so that this mean falls. The mean from the previous lessons and the surprise from this one meet in that single number.

1. For each example, take the model's probability for the true class.
2. Take minus the logarithm of that probability. This is the example's loss.
3. Average the losses over the batch.
4. Adjust the model to make the average smaller, then repeat with the next batch.

### Why cross-entropy and not accuracy

Accuracy counts how often the top class is right. It is what you report, but it is a poor loss for training. Accuracy does not change when the model moves cat from 0.51 to 0.9; both are a correct top pick. Cross-entropy does change, from 0.971 bits to 0.152 bits, so it keeps rewarding the model for becoming more sure of right answers. And when the model is wrong, cross-entropy says how wrong: bird at 0.09 costs 3.474 bits, bird at 0.3 costs 1.737 bits. A smooth number that always points toward a better model is what the gradient lessons need, and cross-entropy is that number.

### Perplexity

Language models report perplexity instead of cross-entropy. Perplexity is 2 raised to the cross-entropy in bits, or e raised to it in nats. A cross-entropy of 2.585 bits gives perplexity 6: the model is as unsure as a fair die with 6 faces. A perplexity of 20 means the model is, on average, choosing between 20 equally likely words. Lower is better, and the smallest possible perplexity is 1, when every prediction is certain and right.

### The computation in code

The code computes surprise, entropy and cross-entropy for the examples in this lesson. The function math.log2 gives the logarithm base 2, and math.log gives the natural logarithm.

:::code
lang: python
file: entropy.py
import math

def surprise(p):
    return -math.log2(p)

def entropy(probs):
    return sum(p * surprise(p) for p in probs if p > 0)

print("fair coin:", entropy([0.5, 0.5]), "bits")
print("biased coin:", round(entropy([0.9, 0.1]), 3), "bits")
print("fair die:", round(entropy([1 / 6] * 6), 3), "bits")

prediction = {"cat": 0.665, "dog": 0.245, "bird": 0.090}
for truth in ["cat", "dog", "bird"]:
    bits = surprise(prediction[truth])
    nats = -math.log(prediction[truth])
    print("truth", truth, "loss", round(bits, 3), "bits,", round(nats, 3), "nats")

batch = [0.665, 0.5, 0.1]   # model's probability for the true class of 3 photos
print("batch loss:", round(sum(surprise(p) for p in batch) / len(batch), 3), "bits")
:::

:::code
lang: text
fair coin: 1.0 bits
biased coin: 0.469 bits
fair die: 2.585 bits
truth cat loss 0.589 bits, 0.408 nats
truth dog loss 2.029 bits, 1.406 nats
truth bird loss 3.474 bits, 2.408 nats
batch loss: 1.637 bits
:::

## Try it

:::exercise
title: Entropy of three distributions
task: Compute the entropy in bits of these three distributions over cat, dog and bird: A = 1/3, 1/3, 1/3; B = 0.665, 0.245, 0.090; C = 1, 0, 0. Use log2(1/3) = -1.585, log2(0.665) = -0.589, log2(0.245) = -2.029 and log2(0.090) = -3.474. Put them in order from most to least uncertain.
hint: For C, the outcome with probability 0 contributes nothing, and the outcome with probability 1 has surprise 0.
lang: text
solution:
A: 3 x (1/3 x 1.585) = 1.585 bits. This is log2(3), the maximum for 3 outcomes.
B: 0.665 x 0.589 + 0.245 x 2.029 + 0.090 x 3.474
   = 0.392 + 0.497 + 0.313 = 1.202 bits.
C: 1 x 0 = 0 bits. A certain outcome has no uncertainty.
Order: A (1.585) > B (1.202) > C (0).
:::

:::exercise
title: Which model is better?
task: Two models predict the same 4 photos. The true classes are cat, cat, dog, bird. Model 1 gives the true class probabilities 0.6, 0.7, 0.5, 0.4. Model 2 gives 0.9, 0.9, 0.9, 0.05. Both get the top class right on the first 3 photos. Compute the mean cross-entropy in bits for each model and say which is better. Then check with the entropy.py functions.
hint: Compute minus log2 of each probability and average. log2(0.05) is about -4.32.
lang: python
solution:
import math

m1 = [0.6, 0.7, 0.5, 0.4]
m2 = [0.9, 0.9, 0.9, 0.05]
for name, probs in [("model 1", m1), ("model 2", m2)]:
    loss = sum(-math.log2(p) for p in probs) / len(probs)
    print(name, round(loss, 3), "bits")
# model 1: 0.975 bits    model 2: 1.194 bits
# Model 1 is better. Model 2 is more confident on 3 photos but its
# 0.05 on the bird costs 4.32 bits, more than its other gains.
:::

## Common mistakes

- Mistake: you drop the minus sign and get a negative entropy. Fix: logarithms of probabilities are negative, so the formula includes a minus sign; entropy and cross-entropy are never negative.
- Mistake: you include the terms for the classes that did not happen when the truth is one class. Fix: their true probability is 0, so they contribute nothing; the loss is only minus the log of the probability given to the true class.
- Mistake: you compare a loss in bits with a loss in nats. Fix: check which logarithm the code uses; multiply nats by 1.443 to get bits.
- Mistake: you think a lower entropy means a better model. Fix: entropy describes a distribution's uncertainty; cross-entropy against the truth measures how good a prediction is. A confident model with low entropy can still be wrong and have high cross-entropy.
- Mistake: you let the model output exactly 0 for a class. Fix: minus the log of 0 is infinite; softmax never outputs an exact 0, and code adds a tiny number before the logarithm to be safe.

## Check your understanding

:::quiz
title: Check: surprise, entropy and cross-entropy
q: An outcome has probability 0.125. What is its surprise?
- 0.125 bits
- 1 bit
* 3 bits
why: 2 to the power -3 is 0.125, so minus log base 2 of 0.125 is 3.
q: Which of these coins has the highest entropy?
- P(heads) = 0.9
- P(heads) = 0.99
* P(heads) = 0.5
why: The uniform distribution has the highest entropy for its number of outcomes; the fair coin has 1 bit, the others less.
q: A model gives the true class probability 0.25. What is the cross-entropy loss for that example, in bits?
- 0.25
* 2
- 4
why: The loss is minus log base 2 of the probability given to the true class, and 2 to the power -2 is 0.25.
q: The same prediction, cat 0.665, dog 0.245, bird 0.090, is scored against two photos: one is a cat and one is a bird. Which statement is true?
- Both losses are equal, because the prediction is the same
* The bird photo has a higher loss, because the model gave bird a smaller probability
- The cat photo has a higher loss, because cat has the biggest probability
why: The loss is the surprise of the true class; bird had 0.090, which is far more surprising than cat at 0.665.
q: Why is cross-entropy preferred over accuracy as a training loss?
- Accuracy cannot be computed for 3 or more classes
* Cross-entropy changes smoothly as the probabilities change, so it always shows which direction improves the model
- Cross-entropy is always smaller than accuracy
why: Accuracy stays flat while the top class is unchanged; cross-entropy rewards every increase in the true class's probability.
q: A language model has a cross-entropy of 3 bits per word. What is its perplexity?
- 3
* 8
- 1.5
why: Perplexity is 2 raised to the cross-entropy in bits, and 2 to the power 3 is 8.
:::

## Go further

The StatQuest video in the links walks through cross-entropy on a 3-class example with the natural logarithm. The Wikipedia pages on entropy and cross-entropy give the full definitions, and the Shannon paper in the links is the 1948 origin of the bit as a unit of information; read its first two pages. This is the end of the mathematics track. You can now count probabilities, update them with clues, average and measure spread, recognise the common distributions, and score a prediction. The AI foundations track starts with [AI, machine learning, deep learning and generative AI](/courses/ai-foundations/what-ai-is/the-four-circles), and its first classifier is trained by lowering the cross-entropy you computed here.
`,
      links: [
        { label: 'Cross entropy (StatQuest)', url: 'https://www.youtube.com/watch?v=6ArSys5qHAU', kind: 'video' },
        { label: 'Entropy, information theory (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Entropy_(information_theory)', kind: 'article' },
        { label: 'Cross-entropy (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Cross-entropy', kind: 'article' },
        { label: 'A Mathematical Theory of Communication, Shannon 1948', url: 'https://people.math.harvard.edu/~ctm/home/text/others/shannon/entropy/entropy.pdf', kind: 'paper' },
      ],
    },
  ],
}
