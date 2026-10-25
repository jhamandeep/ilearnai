import type { Module } from '../../types'

export const mod: Module = {
  slug: 'numbers-and-functions',
  title: 'Numbers and functions',
  description: 'The kinds of numbers you will meet in AI, functions as machines that turn an input into an output, straight lines as the first model, and the powers and logarithms behind loss curves and learning rates.',
  level: 'foundations',
  lessons: [
    {
      slug: 'numbers-you-will-meet',
      title: 'Numbers you will meet',
      summary: 'After this lesson you can read every number in an AI training report: integers, negatives, decimals, fractions, percents and scientific notation.',
      minutes: 22,
      objectives: [
        'Name the kind of each number in a training report: integer, negative, decimal, fraction or percent.',
        'Convert between a fraction, a decimal and a percent by hand.',
        'Read and write a very large or very small number in scientific notation, such as 3e-4.',
        'Round a number to a given number of decimal places and say why rounding changes the value.',
        'Explain in two sentences why a computer stores 0.1 only approximately.',
      ],
      keyTerms: ['integer', 'negative number', 'decimal', 'fraction', 'percent', 'scientific notation', 'rounding', 'floating point'],
      body: `
## What this lesson covers

This lesson is a tour of the kinds of numbers you meet when you build an AI system. You learn to read integers, negative numbers, decimals, fractions, percents and numbers written in scientific notation, such as 3e-4. You also learn how to round a number, and why a computer cannot store the number 0.1 exactly. At the end you can read every line of a real training report and say what each number means.

## Why it matters

A program that trains an AI model prints numbers all the time. It prints how many parameters the model has, how big each learning step is, how often the model is right, and how wrong it still is. These numbers come in different shapes. One is 7,000,000,000. One is 0.0003, which the program prints as 3e-4. One is 92.5%. If one of these shapes confuses you, the whole report is noise. If you can read all of them, the report tells you a story.

This is the first lesson of the module. The next lesson, [Functions as machines](/courses/math-from-zero/numbers-and-functions/functions-as-machines), puts these numbers into machines that turn one number into another. Every AI model is such a machine. You need to read the numbers first.

## The idea with an example

> **Analogy.** Numbers are like coins and notes in a wallet. A 5 euro note and 5 cents in coins are both money, but you count them in different ways. A note for a very large amount would be silly to print, so banks write a transfer as a short code instead. Numbers work the same way. An integer, a decimal and a number in scientific notation are all numbers. Each shape is the best way to write one kind of amount.

Here is the running example for this lesson. A training program finishes one round of training and prints this report card. The rest of the lesson reads it line by line.

:::code
lang: text
file: report.txt
parameters:     7,000,000,000
learning rate:  3e-4
accuracy:       92.5%
test share:     1/5
loss:           0.0417
change:         -0.8
:::

The report holds six numbers, and each one has a different shape. The table names the shape of each number and says what it means for the model.

| Line | Number | Shape | What it means |
| --- | --- | --- | --- |
| parameters | 7,000,000,000 | integer | the model has 7 billion adjustable numbers inside it |
| learning rate | 3e-4 | scientific notation, equal to 0.0003 | how big each learning step is |
| accuracy | 92.5% | percent, equal to 0.925 | the model is right on 92.5 of every 100 examples |
| test share | 1/5 | fraction, equal to 0.2 | one fifth of the data is kept back for testing |
| loss | 0.0417 | decimal | how wrong the model still is; lower is better |
| change | -0.8 | negative number | accuracy went down by 0.8 points since last week |

Four of these numbers say the same kind of thing in different clothes. The fraction 1/5, the decimal 0.2 and the percent 20% are the same amount. The diagram shows how to move between the three forms, and how a decimal becomes scientific notation.

:::flow
title: One amount, four ways to write it
Fraction -> Decimal: divide the top by the bottom
Decimal -> Percent: multiply by 100
Percent -> Fraction: put it over 100
Decimal -> Scientific: move the point and count the moves
:::

Press Next to read the report card one line at a time. The panel shows what you know about the model after each line.

:::scenario
title: Reading the report card
state: known=nothing
step: Read the parameters line. The number 7,000,000,000 has no decimal point and no minus sign, so it is an integer. The commas only group the digits in threes.
state: size=7 billion numbers
step: Read the learning rate line. The code 3e-4 means 3 times 10 to the power of minus 4. Move the decimal point in 3.0 four places to the left and get 0.0003.
state: step size=0.0003
step: Read the accuracy line. The percent sign means out of 100. So 92.5% is 92.5 out of 100, which is the decimal 0.925.
state: right=92.5 of 100
step: Read the test share line. The fraction 1/5 means 1 divided by 5. That is the decimal 0.2 and the percent 20%.
state: test data=20%
step: Read the loss line. The number 0.0417 is a decimal between 0 and 1. It is small, which is good, because loss measures how wrong the model is.
state: wrongness=0.0417
step: Read the change line. The minus sign means the number is below zero. Accuracy dropped by 0.8 points. Someone should look at why.
state: trend=down by 0.8
:::

## How it works

Each shape of number has a few rules. The rules below go from the simplest shape to the most compact one.

### Integers and negative numbers

An integer is a whole number with no fractional part. The numbers 0, 1, 2, 17 and 7,000,000,000 are integers. The numbers -1 and -350 are integers too. A negative number is a number less than zero, written with a minus sign in front. You meet negative numbers whenever something can go down as well as up: a change in accuracy, a temperature, a bank balance, or a weight inside a model.

The simplest way to picture negative numbers is the number line. Zero sits in the middle. Positive numbers go to the right, negative numbers go to the left. The number -0.8 sits a little to the left of zero. The number -3 sits further left. Further left means smaller, so -3 is smaller than -0.8, even though 3 is bigger than 0.8.

Two rules cover almost every calculation with negative numbers. First, adding a negative number is the same as subtracting: 92.5 plus -0.8 is 92.5 minus 0.8, which is 91.7. Second, multiplying two negative numbers gives a positive number: -2 times -3 is 6. Multiplying a positive by a negative gives a negative: 2 times -3 is -6.

### Decimals

A decimal is a number written with a decimal point, such as 0.0417 or 92.5. The digits to the left of the point count whole units. The digits to the right count tenths, hundredths, thousandths and so on. Each place to the right is worth one tenth of the place before it. In 0.0417, the digit 4 sits in the hundredths place, so it is worth 4 hundredths. The digit 1 is worth 1 thousandth. The digit 7 is worth 7 ten-thousandths.

| Number | Units | Tenths | Hundredths | Thousandths | Ten-thousandths |
| --- | --- | --- | --- | --- | --- |
| 92.5 | 92 | 5 | 0 | 0 | 0 |
| 0.2 | 0 | 2 | 0 | 0 | 0 |
| 0.0417 | 0 | 0 | 4 | 1 | 7 |
| 0.0003 | 0 | 0 | 0 | 0 | 3 |

Decimals compare by place, from the left. The number 0.2 is bigger than 0.0417, because 0.2 has a 2 in the tenths place and 0.0417 has a 0 there. Beginners often think 0.0417 is bigger because it has more digits. More digits does not mean a bigger number.

### Fractions and percents

A fraction is one number divided by another, written one over the other. The fraction 1/5 means 1 divided by 5. The number on top is the numerator, and the number on the bottom is the denominator. To turn a fraction into a decimal, do the division: 1 divided by 5 is 0.2. To turn 3/4 into a decimal, divide 3 by 4 and get 0.75.

A percent is a fraction with 100 on the bottom. The word percent means per hundred. So 92.5% is 92.5 over 100, which is the decimal 0.925. To go from a decimal to a percent, multiply by 100 and add the sign: 0.2 becomes 20%. To go from a percent to a decimal, divide by 100: 92.5% becomes 0.925. AI reports mix the two forms. A program might print accuracy as 0.925 in one place and as 92.5% in another. They are the same number.

Percent points and percent are different. If accuracy goes from 92.5% to 91.7%, it fell by 0.8 percent points. That is the change line in the report. It did not fall by 0.8 percent of itself, which would be a much smaller drop of about 0.74 points.

### Scientific notation

Very large and very small numbers are hard to read when written out in full. The number 7,000,000,000 has 9 zeros, and 0.0003 has 3 zeros after the point. Scientific notation writes a number as a small number times a power of 10. A power of 10 is 10 multiplied by itself some number of times: 10 to the power of 3 is 10 times 10 times 10, which is 1,000.

The number 7,000,000,000 is 7 times 1,000,000,000, and 1,000,000,000 is 10 to the power of 9. So in scientific notation it is $7 \\times 10^{9}$, which you read as 7 times 10 to the power of 9. Programs cannot print the small raised 9, so they write the same thing as 7e9. The letter e here means times 10 to the power of. It has nothing to do with the number e that you meet in the last lesson of this module.

A negative power of 10 means a small number. The number 10 to the power of minus 4 is 1 divided by 10,000, which is 0.0001. So 3e-4 is 3 times 0.0001, which is 0.0003. The rule in words: for a positive power, move the decimal point that many places to the right. For a negative power, move it that many places to the left.

| Written out | Scientific notation | Program form | Rule |
| --- | --- | --- | --- |
| 7,000,000,000 | $7 \\times 10^{9}$ | 7e9 | point moves 9 places right |
| 1,000 | $1 \\times 10^{3}$ | 1e3 | point moves 3 places right |
| 0.0003 | $3 \\times 10^{-4}$ | 3e-4 | point moves 4 places left |
| 0.000001 | $1 \\times 10^{-6}$ | 1e-6 | point moves 6 places left |

Python reads and writes this form directly. The snippet below prints the report card numbers from Python. It also shows that 3e-4 and 0.0003 are the same value.

:::code
lang: python
file: numbers.py
parameters = 7_000_000_000      # underscores group digits, like commas
learning_rate = 3e-4            # 3 times 10 to the power of minus 4
accuracy = 92.5 / 100           # percent to decimal
test_share = 1 / 5              # fraction to decimal
loss = 0.0417
change = -0.8

print(parameters)
print(learning_rate == 0.0003)
print(accuracy, test_share)
print(accuracy + change / 100)
:::

:::code
lang: text
7000000000
True
0.925 0.2
0.917
:::

### Rounding

Rounding replaces a number with a nearby number that has fewer digits. To round to 2 decimal places, look at the third decimal digit. If it is 5 or more, increase the second digit by 1. If it is 4 or less, leave the second digit alone. Then drop everything after the second digit. The loss 0.0417 rounded to 2 decimal places is 0.04, because the third digit is 1. Rounded to 3 decimal places it is 0.042, because the fourth digit is 7.

Rounding throws information away. If a program prints a loss of 0.04 this round and 0.04 next round, the loss may still have moved from 0.0417 to 0.0351. When you compare two numbers that look equal, ask how many digits the program kept. Python rounds with the round function: round(0.0417, 2) gives 0.04.

### Floating point in one paragraph

A computer stores a decimal number in a fixed number of bits, usually 64. This format is called floating point. It is scientific notation in binary: a sign, some digits, and a power of 2 instead of a power of 10. Most decimals cannot be written exactly with a power of 2, in the same way that 1/3 cannot be written exactly as a decimal. So the computer stores the nearest value it can. The number 0.1 is stored as a value very close to 0.1 but not equal to it. This is why 0.1 plus 0.2 gives 0.30000000000000004 in Python. The error is tiny, about 1 part in 10,000,000,000,000,000, and it does not matter for AI. It only matters when you test two decimals for exact equality. Compare them with a small tolerance instead.

:::code
lang: python
print(0.1 + 0.2)
print(0.1 + 0.2 == 0.3)
print(abs((0.1 + 0.2) - 0.3) < 1e-9)
print(round(0.0417, 2), round(0.0417, 3))
:::

:::code
lang: text
0.30000000000000004
False
True
0.04 0.042
:::

## Try it

:::exercise
title: Rewrite each number
task: Use paper. A second training report says: parameters 1.3e10, learning rate 0.00005, accuracy 0.875, test share 3/20, change -1.25. Write the parameters as a plain integer. Write the learning rate in program form, such as 3e-4. Write the accuracy as a percent. Write the test share as a decimal and as a percent. Then say whether the model got better or worse.
hint: For 1.3e10, move the point 10 places to the right and fill with zeros. For 0.00005, count how many places the point moves to reach 5.0. For 3/20, divide 3 by 20.
lang: text
solution:
parameters: 13,000,000,000 (13 billion)
learning rate: 5e-5 (5 times 10 to the power of minus 5)
accuracy: 87.5%
test share: 0.15, which is 15%
change: -1.25 is below zero, so accuracy fell by 1.25 points. The model got worse.
:::

:::exercise
title: Check the floating point error
task: Open Python. Add 0.1 to itself 10 times with a loop and print the total. Then print whether the total equals 1.0. Then print the total rounded to 2 decimal places.
hint: Start with total = 0.0 and use for i in range(10). Compare with == on one line and round on another.
lang: python
solution:
total = 0.0
for i in range(10):
    total = total + 0.1
print(total)
print(total == 1.0)
print(round(total, 2))
# prints 0.9999999999999999, False, 1.0
:::

## Common mistakes

- Mistake: you think 0.0417 is bigger than 0.2 because it has more digits. Fix: compare decimals place by place from the left; 0.2 has a 2 in the tenths place and wins.
- Mistake: you read 3e-4 as 3 minus 4 or as 3 times e. Fix: the e in a program means times 10 to the power of; 3e-4 is 0.0003.
- Mistake: you think -3 is bigger than -0.8 because 3 is bigger than 0.8. Fix: on the number line -3 is further left, so it is smaller.
- Mistake: you mix percent points with percent. Fix: a drop from 92.5% to 91.7% is 0.8 percent points; say points when you subtract two percents.
- Mistake: you test two decimals with == and get False when they look equal. Fix: floating point rounds, so compare with a tolerance such as abs(a - b) < 1e-9.

## Check your understanding

:::quiz
title: Check: numbers you will meet
q: A program prints a learning rate of 2e-3. What is the value as a plain decimal?
- 0.2
* 0.002
- 2000
- -6
why: The e means times 10 to the power of, and a power of minus 3 moves the point 3 places to the left: 0.002.
q: Which number is the smallest?
- 0.05
- 0.009
* -0.5
- 0.1
why: Any negative number is smaller than any positive number; -0.5 sits to the left of zero on the number line.
q: Accuracy is 0.875. How does the same value look as a percent?
- 0.875%
- 8.75%
* 87.5%
why: Multiply a decimal by 100 to get a percent: 0.875 times 100 is 87.5.
q: The test share is 3/20 of the data. What fraction of the data is left for training?
- 3/20
- 17/3
* 17/20
why: The whole is 20/20, and 20/20 minus 3/20 leaves 17/20, which is 85%.
q: Two runs print a loss of 0.04 after rounding to 2 decimal places. Which statement is certain?
- The two losses are exactly equal
* Both losses are between 0.035 and 0.045
- Both losses are exactly 0.040
why: Rounding to 2 places hides the later digits; any value from 0.035 up to just under 0.045 rounds to 0.04.
q: Why does 0.1 + 0.2 == 0.3 give False in Python?
- Python has a bug in addition
- 0.3 is not a valid number
* The computer stores 0.1, 0.2 and 0.3 as the nearest binary values, and the tiny errors do not cancel
why: Floating point uses powers of 2, so most decimals are stored approximately; compare with a tolerance instead.
:::

## Go further

The Python tutorial page on floating point arithmetic in the links explains the 0.1 plus 0.2 result in more detail, with pictures of the stored bits. The Wikipedia pages on scientific notation and on percentages give more examples to practise with. The next lesson, [Functions as machines](/courses/math-from-zero/numbers-and-functions/functions-as-machines), takes the numbers from this lesson and puts them through a machine: a function that turns an input number into an output number.
`,
      links: [
        { label: 'Floating Point Arithmetic: Issues and Limitations (Python docs)', url: 'https://docs.python.org/3/tutorial/floatingpoint.html', kind: 'docs' },
        { label: 'Scientific notation (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Scientific_notation', kind: 'article' },
        { label: 'Percentage (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Percentage', kind: 'article' },
        { label: 'Integer (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Integer', kind: 'article' },
      ],
    },
    {
      slug: 'functions-as-machines',
      title: 'Functions as machines',
      summary: 'After this lesson you can read f(x) notation, build a table and a graph for a function, and chain two functions together.',
      minutes: 22,
      objectives: [
        'Explain what a function is with the machine picture: one input in, one output out.',
        'Read and write the notation f(x) and compute f(5) for a given rule.',
        'Build a table of values and draw the graph of a simple function by hand.',
        'Compose two functions and show that the order matters.',
        'Write the same function in Python and print its table of values.',
      ],
      keyTerms: ['function', 'input', 'output', 'table of values', 'graph', 'composition'],
      body: `
## What this lesson covers

This lesson explains what a function is. A function is a rule that takes an input and gives back exactly one output. You learn to read the notation f(x), to build a table of values, to draw a graph, and to chain two functions so that the output of one becomes the input of the next. At the end you can describe any AI model in one sentence: it is a function.

## Why it matters

Every AI model is a function. A spam filter takes an email and gives back a number between 0 and 1. A language model takes a list of tokens and gives back the probability of each next token. A house price model takes the size of a house and gives back a price. Training a model means finding the rule inside the function. Using a model means putting an input through the function. When you read f(x) in a paper or a tutorial, you see the same idea as the taxi meter in this lesson.

The next lesson, [Lines and slopes](/courses/math-from-zero/numbers-and-functions/lines-and-slopes), looks at the simplest useful family of functions, the straight line. That line is your first model. This lesson gives you the words to talk about it.

:::video
id: aircAruvnKk
why: Watch the first 4 minutes. The speaker shows a network that takes 784 numbers in and gives 10 numbers out, and he calls the whole thing a function. You do not need to follow the details of the layers yet.
:::

## The idea with an example

> **Analogy.** A function is a machine with one slot in and one slot out. A juicer is a function: oranges go in, juice comes out. The same oranges always give the same juice. You do not need to know what happens inside to use it. You only need to know what goes in and what comes out. A function in mathematics is the same, but the things that go in and out are numbers.

Here is the running example. A taxi charges 3 euros to start and then 2 euros for every kilometre. The price depends on the distance. Put a distance in, get a price out. In words, the rule is: double the distance and add 3. For a ride of 5 kilometres, the price is 2 times 5 plus 3, which is 13 euros.

Mathematics writes this machine as

$$f(x) = 2x + 3$$

which you read as: f of x equals 2 times x plus 3. The letter f is the name of the machine. The letter x is the input. The expression 2x + 3 is the rule. The whole thing f(x) is the output for that input. To find the price of a 5 kilometre ride, replace every x with 5 and compute: f(5) = 2 times 5 plus 3 = 13.

:::flow
title: The taxi meter as a machine
Distance 5 km -> Double it: 10
Double it -> Add 3: 13
Add 3 -> Price: 13 euros
:::

The diagram shows one input going through the machine. A table of values shows many inputs at once. You choose some inputs, put each one through the rule, and write the output next to it.

| Distance x (km) | Rule 2x + 3 | Price f(x) (euros) |
| --- | --- | --- |
| 0 | 2 times 0 plus 3 | 3 |
| 1 | 2 times 1 plus 3 | 5 |
| 2 | 2 times 2 plus 3 | 7 |
| 3 | 2 times 3 plus 3 | 9 |
| 5 | 2 times 5 plus 3 | 13 |
| 10 | 2 times 10 plus 3 | 23 |

Press Next to put the number 5 through the machine step by step. Then watch a second machine take the result.

:::scenario
title: Put 5 through f, then through a tip machine
state: x=5, f(x)=?, t=?
step: Start with the input x = 5, a ride of 5 kilometres.
step: Apply the rule of f. Double 5 to get 10, then add 3 to get 13. So f(5) = 13.
state: f(x)=13
step: Define a second machine t that adds a 10 percent tip: t(p) = 1.1 times p.
step: Feed the output of f into t. Compute t(13) = 1.1 times 13 = 14.3. The ride with tip costs 14.3 euros.
state: t(f(5))=14.3
step: Try the other order. First t(5) = 5.5, then f(5.5) = 2 times 5.5 plus 3 = 14. The answer differs, so order matters.
state: f(t(5))=14
:::

## How it works

### The three parts of a function

A function has three parts: a set of allowed inputs, a rule, and the outputs the rule produces. The table lists the parts for the taxi meter and for two AI models. The AI models have the same shape as the taxi meter. Only the inputs, the rule and the outputs are bigger.

| Function | Input | Rule | Output |
| --- | --- | --- | --- |
| taxi meter f | distance in km, a number 0 or more | double it and add 3 | price in euros |
| spam filter | one email as a list of numbers | millions of multiplications and additions | a number from 0 to 1 |
| house price model | size of a house in square metres | multiply by a slope and add an intercept | price in thousands |

One rule is strict: each input gives exactly one output. The taxi meter cannot charge 13 euros for one 5 kilometre ride and 15 euros for another. If a rule can give two different outputs for the same input, it is not a function. A random number generator is not a function of its input, because the same request gives different answers. This strictness is what lets you trust a model: the same input always gives the same output.

### Reading and writing f(x)

The notation f(x) packs three facts into four characters: the name f, the input x, and the fact that the output depends on x. You can use any letters. The rule g(t) = 5t means a machine named g with an input named t. The rule price(d) = 2d + 3 is the taxi meter again with longer names. Programmers use long names, mathematicians use short ones. The meaning is the same.

To evaluate a function means to compute its output for one input. Follow three steps.

1. Write the rule with the input letter: f(x) = 2x + 3.
2. Replace every copy of the input letter with the number: f(5) = 2 times 5 plus 3.
3. Do the arithmetic in the usual order, multiplication before addition: 10 plus 3 is 13.

The order of arithmetic matters in step 3. In 2x + 3 you multiply first and then add. If you add first, you get 2 times 8, which is 16, and that is a different machine. When a rule has brackets, do what is inside the brackets first.

### Tables and graphs

A table of values lists some inputs and their outputs. It is the simplest way to see what a function does. A graph draws the same table as points. The input goes along the horizontal axis, from left to right. The output goes up the vertical axis. Each row of the table becomes one point: the row with x = 5 and f(x) = 13 becomes the point 5 across and 13 up.

For the taxi meter, the points are (0, 3), (1, 5), (2, 7), (3, 9), (5, 13) and (10, 23). If you draw them on squared paper and join them, you get a straight line. Every time x goes up by 1, the output goes up by 2. That constant step is why the line is straight. Functions with other rules give curves. The function g(x) = x times x gives the points (0, 0), (1, 1), (2, 4), (3, 9), which bend upward faster and faster.

A graph lets you read the function backwards. Find 9 on the vertical axis, move right to the line, and drop down to the horizontal axis. You land on 3. So a 9 euro ride was 3 kilometres long. Later in this site you read loss curves the same way. A loss curve is the graph of a function whose input is the training step and whose output is how wrong the model is.

### Composition: one machine feeding another

Composition means connecting two machines so that the output of the first becomes the input of the second. In the scenario above, the taxi meter f feeds the tip machine t. Mathematics writes the chain as

$$t(f(x)) = 1.1 \\times (2x + 3)$$

which you read as: t of f of x equals 1.1 times the quantity 2x plus 3. You read it from the inside out. The inner function f runs first, and its output goes into t. For x = 5, the inner machine gives 13, and the outer machine gives 14.3.

Order matters. The chain f(t(x)) runs the tip machine first and then the meter. For x = 5 it gives f(5.5) = 14. The two chains are different functions, because 14.3 is not 14. In words: adding 10 percent to the whole fare is not the same as adding 10 percent to the distance. A neural network is a long chain of this kind. Each layer is a function, and the network is the composition of all its layers. The order of the layers is part of the design.

:::flow
title: Two machines in a chain
Input 5 -> Meter f: 2x + 3
Meter f -> Tip t: 13
Tip t -> Output: 14.3
:::

### The same function in Python

Python writes a function with the word def. The name goes after def, the input goes in brackets, and the word return gives back the output. The snippet below defines the taxi meter, prints its table of values, and composes it with the tip machine.

:::code
lang: python
file: taxi.py
def f(x):
    return 2 * x + 3

def t(p):
    return 1.1 * p

for x in [0, 1, 2, 3, 5, 10]:
    print(x, f(x))

print(t(f(5)))
print(f(t(5)))
:::

:::code
lang: text
0 3
1 5
2 7
3 9
5 13
10 23
14.3
14.0
:::

The line t(f(5)) is composition written in code. Python evaluates the inside first, exactly as mathematics does. You can chain as many functions as you like: h(g(f(x))) runs f, then g, then h.

## Try it

:::exercise
title: A new meter
task: Use paper. A different taxi company charges 4 euros to start and 1.5 euros per kilometre. Write its rule as g(x). Build a table of values for x = 0, 2, 4, 6 and 8. Then find which company is cheaper for a 2 kilometre ride and for an 8 kilometre ride, using f(x) = 2x + 3 for the first company.
hint: The start fee is the number you add. The price per kilometre is the number you multiply by x. Compute both f and g at 2 and at 8.
lang: text
solution:
g(x) = 1.5x + 4

x: 0  2  4  6   8
g: 4  7  10 13  16

At 2 km: f(2) = 7 and g(2) = 7. Same price.
At 8 km: f(8) = 19 and g(8) = 16. Company g is cheaper.
:::

:::exercise
title: Compose in Python
task: Open Python. Define square(x) that returns x times x and add_one(x) that returns x plus 1. Print square(add_one(3)) and add_one(square(3)). Explain in one sentence why the two answers differ.
hint: Evaluate from the inside out. add_one(3) is 4, so square(add_one(3)) is square(4).
lang: python
solution:
def square(x):
    return x * x

def add_one(x):
    return x + 1

print(square(add_one(3)))   # square(4) = 16
print(add_one(square(3)))   # add_one(9) = 10
# The order differs: adding first then squaring is not the same as squaring first then adding.
:::

## Common mistakes

- Mistake: you read f(x) as f times x. Fix: f(x) means the output of the machine named f when the input is x; nothing is multiplied.
- Mistake: you add before you multiply in 2x + 3 and get f(5) = 16. Fix: multiply first, then add; f(5) is 13.
- Mistake: you read t(f(x)) from left to right and run t first. Fix: read from the inside out; the inner function runs first.
- Mistake: you think a function must be a formula. Fix: a table, a graph, a lookup list or a trained model is a function too, as long as each input has one output.
- Mistake: you swap the axes on a graph. Fix: the input goes along the horizontal axis and the output goes up the vertical axis.

## Check your understanding

:::quiz
title: Check: functions as machines
q: The rule is h(x) = 3x - 1. What is h(4)?
- 7
* 11
- 12
- 3
why: Replace x with 4 and multiply first: 3 times 4 is 12, minus 1 is 11.
q: A machine gives 13 for the input 5 on Monday and 15 for the input 5 on Tuesday. Is it a function of its input?
- Yes, because it always gives a number
* No, because one input gives two different outputs
- Yes, because 13 and 15 are close
why: A function must give exactly one output for each input; two outputs for the same input break the rule.
q: On the graph of the taxi meter f(x) = 2x + 3 you find the height 11. What input is below it?
- 3
* 4
- 5
why: Solve 2x + 3 = 11: subtract 3 to get 2x = 8, so x = 4.
q: With f(x) = 2x + 3 and t(p) = 1.1p, what is f(t(10))?
- 25.3
* 25
- 23
why: The inner function runs first: t(10) = 11, then f(11) = 22 + 3 = 25.
q: Which sentence describes a trained spam filter correctly?
- It is a table of every email ever sent
* It is a function that takes an email as numbers and returns one number between 0 and 1
- It is a random rule that changes with each email
why: A model is a function: the same input email always gives the same output score.
:::

## Go further

The Wikipedia page on functions in the links gives the formal definition and many pictures. The Khan Academy unit on functions has short practice problems on evaluating and graphing. The Python tutorial section on defining functions shows more about def and return. The next lesson, [Lines and slopes](/courses/math-from-zero/numbers-and-functions/lines-and-slopes), studies the family of functions that look like the taxi meter: multiply by one number and add another. Those two numbers are the first model you will fit.
`,
      links: [
        { label: 'Function (mathematics) (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Function_(mathematics)', kind: 'article' },
        { label: 'Function composition (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Function_composition', kind: 'article' },
        { label: 'Functions (Khan Academy)', url: 'https://www.khanacademy.org/math/algebra/x2f8bb11595b61c86:functions', kind: 'course' },
        { label: 'Defining Functions (Python tutorial)', url: 'https://docs.python.org/3/tutorial/controlflow.html#defining-functions', kind: 'docs' },
      ],
    },
    {
      slug: 'lines-and-slopes',
      title: 'Lines and slopes',
      summary: 'After this lesson you can read y = mx + b, compute a slope from two points, and fit a line by eye to 5 points to make your first model.',
      minutes: 24,
      objectives: [
        'Explain what the slope and the intercept of a line mean in everyday words.',
        'Compute the slope of a line from two points as rise over run.',
        'Write the equation y = mx + b for a line and use it to predict a value.',
        'Fit a line by eye to 5 data points and measure how wrong it is.',
        'Compute the predictions and the total error of a line in Python.',
      ],
      keyTerms: ['linear function', 'slope', 'intercept', 'prediction error', 'graph', 'average rate of change'],
      body: `
## What this lesson covers

This lesson is about the straight line, the simplest function that can make a prediction. You learn the equation y = mx + b, what the slope m and the intercept b mean, and how to compute a slope from two points. Then you fit a line by eye to 5 house prices and measure how wrong it is. That fitted line is your first model.

## Why it matters

The first model you build in this site, in the lesson [Predict a number: linear regression](/courses/ai-foundations/first-models/linear-regression), is a straight line through data. Training that model means choosing a slope and an intercept. A neural network is a stack of many such lines with small bends between them. Even the loss curve you watch while a model trains has a slope, and that slope tells you whether training is going well.

The previous lesson, [Functions as machines](/courses/math-from-zero/numbers-and-functions/functions-as-machines), gave you the taxi meter f(x) = 2x + 3. That machine is a line. This lesson explains the two numbers in it and shows how to find them from data instead of from a price list.

:::video
id: nk2CQITm_eo
why: Watch the first 8 minutes. The speaker draws points, draws a line through them, and measures the vertical gaps between the points and the line. Those gaps are the prediction errors that you compute by hand in this lesson.
:::

## The idea with an example

> **Analogy.** A straight line is like a fixed-rate price list. A plumber charges a call-out fee and then a fixed amount per hour. The call-out fee is the price when no work is done yet. The rate per hour is how fast the price climbs. Two numbers describe the whole price list. In mathematics the call-out fee is the intercept and the rate per hour is the slope.

Here is the running example. You have the sizes and the prices of 5 houses in one town. Size is in square metres and price is in thousands of euros.

| House | Size x (square metres) | Price y (thousands) |
| --- | --- | --- |
| A | 50 | 150 |
| B | 70 | 200 |
| C | 90 | 240 |
| D | 110 | 290 |
| E | 130 | 330 |

You want a rule that predicts the price of a sixth house from its size. Look at the table. When size goes up by 20, price goes up by about 40 to 50. The pattern is close to a straight line. So the rule has the shape of the taxi meter: multiply the size by a number, then add a number. In mathematics the line is written

$$y = mx + b$$

which you read as: y equals m times x plus b. The letter m is the slope, the amount y goes up when x goes up by 1. The letter b is the intercept, the value of y when x is 0. The flow diagram shows the line as a machine.

:::flow
title: A line as a machine
Size x -> Multiply by m: slope step
Multiply by m -> Add b: intercept step
Add b -> Price y: prediction
:::

Fitting a line by eye means guessing m and b, checking how far the predictions are from the real prices, and adjusting. Press Next to fit the line in three guesses. The panel tracks the current slope, intercept and total error.

:::scenario
title: Fit a line by eye to the 5 houses
state: m=?, b=?, total error=?
step: First guess. Take slope 2 and intercept 50, so y = 2x + 50. Predict each house: 150, 190, 230, 270, 310.
state: m=2, b=50
step: Compare with the real prices 150, 200, 240, 290, 330. The gaps are 0, 10, 10, 20, 20. Add the sizes of the gaps: total error 60.
state: total error=60
step: Every gap is positive and the gaps grow with size. The line is too flat. Raise the slope.
step: Second guess. Take slope 2.5 and intercept 20, so y = 2.5x + 20. Predictions: 145, 195, 245, 295, 345. Gaps: 5, 5, -5, -5, -15. Total error 35.
state: m=2.5, b=20, total error=35
step: Now the line is a little too steep at the top. Lower the slope a bit and raise the intercept.
step: Third guess. Take slope 2.3 and intercept 35, so y = 2.3x + 35. Predictions: 150, 196, 242, 288, 334. Gaps: 0, 4, -2, 2, -4. Total error 12.
state: m=2.3, b=35, total error=12
step: The gaps are small and mixed in sign. Stop here. The model is y = 2.3x + 35.
:::

The third guess is your first model. Give it a size and it gives a price. For a house of 100 square metres, it predicts 2.3 times 100 plus 35, which is 265 thousand euros. The bars compare the total error of the three guesses.

:::bars
title: Total error of three lines on the 5 houses
unit: thousands of euros
y = 2x + 50: 60
y = 2.5x + 20: 35
y = 2.3x + 35: 12
:::

## How it works

### Slope: rise over run

The slope measures how fast y changes when x changes. To compute it, pick two points on the line. Subtract the y values to get the rise, the vertical change. Subtract the x values in the same order to get the run, the horizontal change. Divide the rise by the run.

$$m = \\frac{y_2 - y_1}{x_2 - x_1}$$

In words: the slope equals the second y minus the first y, divided by the second x minus the first x. Take houses A and E. The rise is 330 minus 150, which is 180. The run is 130 minus 50, which is 80. The slope is 180 divided by 80, which is 2.25. In everyday words: in this town, each extra square metre adds about 2.25 thousand euros to the price. The slope is a rate, the same idea as a speed or a price per kilometre.

The table shows what different slopes look like.

| Slope m | What it means | Example line |
| --- | --- | --- |
| 2.25 | y goes up 2.25 for every 1 of x; the line climbs to the right | house prices against size |
| 1 | y goes up 1 for every 1 of x; a 45 degree climb | y = x |
| 0 | y does not change; the line is flat | y = 5 |
| -3 | y goes down 3 for every 1 of x; the line falls to the right | remaining fuel against distance |

A negative slope means the line falls as you move right. The sign tells you the direction, the size tells you the steepness. Between two points on a curve, the same rise-over-run calculation gives the average rate of change. The lesson [Rate of change](/courses/math-from-zero/change-and-gradients/rate-of-change) builds on exactly this computation.

### Intercept: where the line starts

The intercept b is the value of y when x is 0. On a graph it is the height where the line crosses the vertical axis. For the model y = 2.3x + 35, the intercept is 35. Read literally, it says a house of 0 square metres costs 35 thousand euros. That sounds silly, and it is a reminder that a model is only trustworthy inside the range of its data. The intercept is still useful. It shifts the whole line up or down without changing its tilt.

Once you have a slope and one point, you can find the intercept. Use house A, where x is 50 and y is 150, and the slope 2.25. Put them into y = mx + b: 150 = 2.25 times 50 plus b, so 150 = 112.5 plus b, so b = 37.5. The line through A and E is y = 2.25x + 37.5. It is close to the line you fitted by eye, which is a good sign.

### Prediction error

A model is only as good as its gaps. The prediction error for one point is the real value minus the predicted value. For house B under y = 2.3x + 35, the real price is 200 and the prediction is 196, so the error is 4. A positive error means the real value is above the line. A negative error means it is below.

To judge the whole line, add up the sizes of the errors, ignoring the signs. That is the total error you tracked in the scenario. Two rules make the fitting work. First, if most errors have the same sign, the line is on the wrong side of the data: move the intercept. Second, if the errors grow with x, the slope is wrong: tilt the line. The linear regression lesson later replaces your eye with a formula that finds the smallest error directly, but it measures the error in the same way.

### Numbered steps to fit a line by eye

1. Draw the points on squared paper, with x across and y up.
2. Lay a ruler through the cloud of points so that about half the points are above it and half below.
3. Read the height where the ruler crosses the vertical axis. That is b.
4. Pick two points on the ruler, far apart. Compute rise over run. That is m.
5. Write y = mx + b. Predict each real point and write down the errors.
6. If the errors share a sign, move b. If they grow with x, change m. Repeat once or twice.

### The same fitting in Python

The snippet below defines the line as a function with the slope and the intercept as inputs. It prints the prediction and the error for each house, then the total error. Change m and b and run it again to fit the line yourself.

:::code
lang: python
file: fit_by_eye.py
sizes = [50, 70, 90, 110, 130]
prices = [150, 200, 240, 290, 330]

def predict(m, b, x):
    return m * x + b

def total_error(m, b):
    total = 0
    for x, y in zip(sizes, prices):
        pred = round(predict(m, b, x), 2)   # round away floating point noise
        gap = y - pred
        print(x, y, pred, gap)
        total = total + abs(gap)
    return total

print("total", total_error(2.3, 35))
print("100 square metres:", predict(2.3, 35, 100))
:::

:::code
lang: text
50 150 150.0 0.0
70 200 196.0 4.0
90 240 242.0 -2.0
110 290 288.0 2.0
130 330 334.0 -4.0
total 12.0
100 square metres: 265.0
:::

The zip function walks through the two lists together, one house at a time. The abs function drops the sign of the gap. When you train a real model later, the computer runs a loop like this one millions of times, nudging m and b each time to make the total smaller.

## Try it

:::exercise
title: Fit a line to 5 new points
task: Use paper. Five students record hours of study x and test score y: (1, 52), (2, 58), (3, 67), (4, 71), (5, 80). Compute the slope through the first and the last point. Find the intercept from the first point. Write the line. Then predict the score for 6 hours and compute the error at x = 3.
hint: Rise is 80 minus 52. Run is 5 minus 1. For the intercept, put x = 1 and y = 52 into y = mx + b and solve for b.
lang: text
solution:
rise = 80 - 52 = 28, run = 5 - 1 = 4, slope m = 28 / 4 = 7
intercept: 52 = 7 times 1 + b, so b = 45
line: y = 7x + 45
6 hours: 7 times 6 + 45 = 87
error at x = 3: real 67, predicted 7 times 3 + 45 = 66, error = 1
:::

:::exercise
title: Beat the eye
task: Open Python and paste the fit_by_eye.py snippet. Try at least three pairs of m and b and record the total error of each. Find a pair with a total error below 12.
hint: The errors for m = 2.3 and b = 35 are 0, 4, -2, 2, -4. Try a slope between 2.2 and 2.3 and an intercept between 35 and 42.
lang: python
solution:
# One answer among many:
print("total", total_error(2.25, 38.5))
# predictions 151, 196, 241, 286, 331 give gaps -1, 4, -1, 4, -1
# total 11, which is below 12
:::

## Common mistakes

- Mistake: you compute the run as x1 minus x2 but the rise as y2 minus y1. Fix: subtract both in the same order, or the sign of the slope flips.
- Mistake: you read the intercept as the smallest y in the data. Fix: the intercept is y at x = 0, which may sit outside the data entirely.
- Mistake: you fit a line so that it passes through the first point exactly and ignore the rest. Fix: aim for small errors on all points, with about half above and half below.
- Mistake: you add the errors with their signs and get 0 for a bad line. Fix: positive and negative errors cancel; add their sizes with abs.
- Mistake: you use the line far outside the data, such as a house of 1,000 square metres. Fix: a line fitted on 50 to 130 square metres is only trustworthy near that range.

## Check your understanding

:::quiz
title: Check: lines and slopes
q: A line passes through (2, 10) and (6, 22). What is its slope?
- 2
* 3
- 4
- 12
why: Rise is 22 minus 10, which is 12; run is 6 minus 2, which is 4; 12 divided by 4 is 3.
q: In y = 2.3x + 35 for house prices, what does 35 mean?
- The price per square metre
* The predicted price when the size is 0, which shifts the whole line up
- The largest error
why: The intercept is the value of y at x = 0; it moves the line up or down without tilting it.
q: Your line gives errors of 8, 9, 7, 10 and 9 on five points. What should you change first?
- The slope, because the errors are large
* The intercept, because every error has the same sign
- Nothing, because the errors are similar
why: Errors that all share a sign mean the line sits below the data; raising the intercept fixes that.
q: Using y = 2.3x + 35, what price does the model predict for a house of 80 square metres?
- 184
* 219
- 219.5
- 265
why: 2.3 times 80 is 184, plus 35 is 219.
q: A line has slope -3. What happens to y when x increases by 2?
- y increases by 6
* y decreases by 6
- y decreases by 3
why: Slope is the change in y per 1 of x; a change of 2 in x gives 2 times -3, which is -6.
:::

## Go further

The Wikipedia page on linear equations in the links explains the slope-intercept form and the other ways to write a line. The Khan Academy unit on slope has practice problems with pictures. StatQuest's linear regression video, embedded above, shows how a formula replaces your eye. The next lesson, [Exponents and logarithms](/courses/math-from-zero/numbers-and-functions/exponents-and-logs), leaves straight lines for curves that double or halve, and introduces the log scale that makes those curves straight again.
`,
      links: [
        { label: 'Linear equation (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Linear_equation', kind: 'article' },
        { label: 'Slope (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Slope', kind: 'article' },
        { label: 'Slope-intercept form (Khan Academy)', url: 'https://www.khanacademy.org/math/algebra/x2f8bb11595b61c86:forms-of-linear-equations', kind: 'course' },
        { label: 'Linear Regression, Clearly Explained (StatQuest)', url: 'https://www.youtube.com/watch?v=nk2CQITm_eo', kind: 'video' },
      ],
    },
    {
      slug: 'exponents-and-logs',
      title: 'Exponents and logarithms',
      summary: 'After this lesson you can compute powers and roots, undo a power with a logarithm, and explain why loss curves and learning rates use a log scale.',
      minutes: 24,
      objectives: [
        'Compute a power such as 2 to the 10 and a root such as the square root of 81 by hand.',
        'Explain what a logarithm is as the inverse of a power, and compute log base 10 of 1,000.',
        'Explain what the number e is in two sentences and where it appears in AI.',
        'Read a loss curve on a log scale and say why the straight line means steady progress.',
        'Compute powers, roots and logarithms in Python with the math module.',
      ],
      keyTerms: ['exponent', 'root', "Euler's number", 'logarithm', 'log scale', 'loss curve', 'learning rate'],
      body: `
## What this lesson covers

This lesson explains repeated multiplication and how to undo it. A power multiplies a number by itself a set number of times. A root and a logarithm each undo a power in a different way. You also meet the special number e and the log scale. At the end you can read a training loss curve drawn on a log scale, and you can say why learning rates come in steps of 10.

## Why it matters

Three things in every AI project live on a log scale. The first is the loss curve, the graph of how wrong the model is over training. It drops fast at the start and slowly later, and on a normal scale the slow part is invisible. The second is the learning rate, which engineers try at values such as 0.1, 0.01 and 0.001, not 0.1, 0.2 and 0.3. The third is model size, which goes from millions to billions of parameters, a range no normal axis can show. Logarithms turn all three into straight lines and even steps.

This is the last lesson of the module. The next module, [A vector is a list of numbers](/courses/math-from-zero/vectors-and-matrices/what-a-vector-is), moves from single numbers to lists of numbers. The lesson [Minimising a function by following the slope](/courses/math-from-zero/change-and-gradients/follow-the-slope) uses the learning rates from this lesson.

## The idea with an example

> **Analogy.** Folding a sheet of paper doubles its thickness every time. One fold gives 2 layers, two folds give 4, ten folds give 1,024. A power counts the layers from the number of folds. A logarithm asks the reverse question: how many folds give 1,024 layers? The answer is 10. Powers go forward from folds to layers, logarithms go backward from layers to folds.

Here is the running example. You train a model and record its loss every 1,000 steps. The loss halves each time.

| Training step | Loss |
| --- | --- |
| 0 | 8 |
| 1,000 | 4 |
| 2,000 | 2 |
| 3,000 | 1 |
| 4,000 | 0.5 |
| 5,000 | 0.25 |
| 6,000 | 0.125 |

The model is improving at a steady rate: every 1,000 steps the loss halves. But look at the bars below, which draw the losses on a normal scale. The first bar towers over the rest. The last three bars are almost invisible, even though the halving continues. A normal scale hides steady progress when the numbers get small.

:::bars
title: Loss on a normal scale
unit: loss
Step 0: 8
Step 1000: 4
Step 2000: 2
Step 3000: 1
Step 4000: 0.5
Step 5000: 0.25
Step 6000: 0.125
:::

The fix is to ask a different question about each loss: 2 to the power of what gives this loss? For 8 the answer is 3, because 2 times 2 times 2 is 8. For 4 it is 2. For 1 it is 0. For 0.5 it is -1, because 0.5 is 1 divided by 2. This question is the logarithm base 2. The table of logarithms goes 3, 2, 1, 0, -1, -2, -3. It drops by exactly 1 every 1,000 steps. On a log scale the loss curve is a straight line with slope -1 per 1,000 steps. The straight line is what tells you training is going well.

:::flow
title: A power goes forward, a log goes back
Exponent 3 -> Power of 2: 2 x 2 x 2
Power of 2 -> Loss 8: the result
Loss 8 -> Log base 2: how many 2s?
Log base 2 -> Exponent 3: the answer
:::

Press Next to undo a power by hand. The panel counts the divisions.

:::scenario
title: Find log base 10 of 1,000 by counting
state: number=1000, divisions=0
step: You want log base 10 of 1,000. Ask: how many times must 10 multiply itself to make 1,000? Count by dividing 1,000 by 10 until you reach 1.
step: Divide 1,000 by 10 and get 100. That is one division.
state: number=100, divisions=1
step: Divide 100 by 10 and get 10. That is two divisions.
state: number=10, divisions=2
step: Divide 10 by 10 and get 1. That is three divisions. Stop at 1.
state: number=1, divisions=3
step: Three divisions, so log base 10 of 1,000 is 3. Check it forward: 10 to the power of 3 is 10 x 10 x 10 = 1,000.
state: log10(1000)=3
:::

## How it works

### Powers

A power is repeated multiplication. The expression $2^{10}$, which you read as 2 to the power of 10, means 2 multiplied by itself 10 times. The number 2 is the base. The small raised 10 is the exponent. The result is 1,024. Programs write a power with two stars: 2 ** 10. The number 10 to the power of 9 from the first lesson is a power with base 10.

Three special exponents trip up beginners. An exponent of 1 gives the base itself: 2 to the power of 1 is 2. An exponent of 0 gives 1 for any base: 2 to the power of 0 is 1. A negative exponent means 1 divided by the power: 2 to the power of minus 3 is 1 divided by 8, which is 0.125. The loss at step 6,000 is 2 to the power of minus 3.

| Expression | Read as | Value | Why |
| --- | --- | --- | --- |
| $2^{3}$ | 2 to the power of 3 | 8 | 2 x 2 x 2 |
| $2^{1}$ | 2 to the power of 1 | 2 | one copy of 2 |
| $2^{0}$ | 2 to the power of 0 | 1 | no copies; the empty product is 1 |
| $2^{-1}$ | 2 to the power of minus 1 | 0.5 | 1 divided by 2 |
| $2^{-3}$ | 2 to the power of minus 3 | 0.125 | 1 divided by 8 |
| $10^{-4}$ | 10 to the power of minus 4 | 0.0001 | 1 divided by 10,000 |

Two rules let you combine powers without computing them. When you multiply powers with the same base, add the exponents: $2^{3} \\times 2^{4} = 2^{7}$. In words: 2 to the 3 times 2 to the 4 equals 2 to the 7, because 8 times 16 is 128. When you raise a power to a power, multiply the exponents: 2 to the 3, all to the power of 2, is 2 to the 6, which is 64.

### Roots

A root undoes a power by asking for the base. The square root of 81 is the number that gives 81 when multiplied by itself. The answer is 9, because 9 times 9 is 81. Mathematics writes it as $\\sqrt{81} = 9$. The cube root asks the same about three copies: the cube root of 8 is 2.

A root is also a power with a fraction as its exponent. The square root of x is x to the power of one half. In Python you can write 81 ** 0.5 or use math.sqrt(81), and both give 9.0. You meet square roots when you compute the length of a vector in the next module, and when you compute a standard deviation in the chance module.

### Logarithms

A logarithm undoes a power by asking for the exponent. The logarithm base 10 of 1,000 is the exponent you put on 10 to get 1,000. The answer is 3. Mathematics writes it as

$$\\log_{10}(1000) = 3$$

which you read as: log base 10 of 1,000 equals 3. The general rule in words: log base b of x is the exponent that b needs to produce x. The scenario above found it by counting divisions. For numbers that are not exact powers, the answer is a decimal: log base 10 of 500 is about 2.7, because 500 sits between 100 and 1,000.

Two bases matter in practice. Base 2 counts doublings, as in the loss example. Base 10 counts zeros: log base 10 of 7,000,000,000 is about 9.85, which tells you the number has 10 digits. A logarithm of a number below 1 is negative, because you need a negative exponent to get below 1. Log base 10 of 0.0003 is about -3.5.

Logarithms turn multiplication into addition. The log of a product is the sum of the logs: $\\log(a \\times b) = \\log(a) + \\log(b)$. In words: the log of a times b equals the log of a plus the log of b. This is why a halving loss becomes a straight line. Each halving multiplies the loss by one half, which subtracts 1 from the log base 2. Steady multiplication becomes steady subtraction, and steady subtraction is a straight line.

### The number e

The number e is about 2.718. It is the base that nature and calculus prefer. If a quantity grows by 100 percent per year, but the growth is paid out continuously instead of once at the end, the quantity multiplies by e each year instead of by 2. The number e makes the slope of the growth curve equal to its height, which keeps the calculus simple. The logarithm with base e is called the natural logarithm and is written ln. In Python, math.log(x) with no second argument is the natural logarithm, and math.e holds the number itself. The cross-entropy loss that trains language models is a natural logarithm of a probability, so a loss of 0.0417 means the model gave the right answer a probability of e to the power of minus 0.0417, which is about 0.96. The letter e in 3e-4 is not this number.

### Log scale for learning rates

A learning rate is the size of each step the training program takes. Common values are 0.1, 0.01, 0.001 and 0.0001. Each value is 10 times smaller than the one before. On a normal axis these four points crowd together near zero. On a log base 10 axis they sit at -1, -2, -3 and -4, with even gaps. Engineers search for a learning rate on this scale because the effect of a learning rate depends on its ratio to the neighbours, not on its difference. Going from 0.1 to 0.01 changes training as much as going from 0.01 to 0.001.

| Learning rate | Scientific notation | Log base 10 |
| --- | --- | --- |
| 0.1 | 1e-1 | -1 |
| 0.01 | 1e-2 | -2 |
| 0.001 | 1e-3 | -3 |
| 0.0001 | 1e-4 | -4 |

The same idea covers model sizes. A model with 7 billion parameters and one with 70 billion sit one unit apart on a log base 10 axis. Papers draw model size and compute on log axes for this reason, and straight lines on those plots are the scaling laws you will read about at Level 3.

### Powers and logs in Python

The math module holds the functions you need. The snippet prints the running example with its log base 2, then checks the values from this lesson.

:::code
lang: python
file: logs.py
import math

for step in range(0, 7000, 1000):
    loss = 8 * 0.5 ** (step / 1000)
    print(step, loss, math.log2(loss))

print(2 ** 10, 2 ** 0, 2 ** -3)
print(math.sqrt(81), 81 ** 0.5)
print(math.log10(1000), math.log10(500))
print(math.e, math.log(math.e))
print(math.exp(-0.0417))
:::

:::code
lang: text
0 8.0 3.0
1000 4.0 2.0
2000 2.0 1.0
3000 1.0 0.0
4000 0.5 -1.0
5000 0.25 -2.0
6000 0.125 -3.0
1024 1 0.125
9.0 9.0
3.0 2.6989700043360187
2.718281828459045 1.0
0.9591574846601116
:::

The loop computes the loss with a power: 8 times one half to the power of the number of thousands of steps. The log base 2 column drops by 1 each row, which is the straight line you saw in the table. The last line shows that math.exp undoes math.log: e to the power of minus 0.0417 is about 0.96.

## Try it

:::exercise
title: Powers and logs on paper
task: Use paper. Compute 3 to the power of 4, 5 to the power of 0, and 10 to the power of minus 2. Then compute log base 2 of 64, log base 10 of 1,000,000, and the square root of 144. Finally, say how many times a loss of 16 must halve to reach 0.25.
hint: For log base 2 of 64, count how many times you divide 64 by 2 to reach 1. For the last question, count halvings from 16 down to 0.25, or compute log base 2 of 16 minus log base 2 of 0.25.
lang: text
solution:
3 to the power of 4 = 3 x 3 x 3 x 3 = 81
5 to the power of 0 = 1
10 to the power of minus 2 = 1 / 100 = 0.01
log base 2 of 64 = 6, because 2 x 2 x 2 x 2 x 2 x 2 = 64
log base 10 of 1,000,000 = 6, because the number has 6 zeros
square root of 144 = 12
16 to 0.25: 16, 8, 4, 2, 1, 0.5, 0.25 is 6 halvings. Check: log2(16) - log2(0.25) = 4 - (-2) = 6
:::

:::exercise
title: Make a learning rate ladder
task: Open Python. Print a ladder of 7 learning rates from 0.1 down to 0.0000001, each 10 times smaller than the one before, and next to each print its log base 10. Use a loop and a power of 10, not a typed list.
hint: 10 ** -k gives 0.1 for k = 1. Loop k from 1 to 7. Use math.log10 for the second column.
lang: python
solution:
import math

for k in range(1, 8):
    rate = 10 ** -k
    print(rate, math.log10(rate))
# 0.1 -1.0, 0.01 -2.0, 0.001 -3.0 and so on down to 1e-07 -7.0
:::

## Common mistakes

- Mistake: you compute 2 to the power of 3 as 2 times 3, which is 6. Fix: a power multiplies the base by itself; 2 x 2 x 2 is 8.
- Mistake: you think 2 to the power of 0 is 0. Fix: any base to the power of 0 is 1.
- Mistake: you think a negative exponent gives a negative number. Fix: a negative exponent means 1 divided by the power, so 2 to the minus 3 is 0.125, which is positive.
- Mistake: you read a flat section at the bottom of a loss curve on a normal scale and conclude training has stopped. Fix: draw the loss on a log scale; a straight line there means the loss is still halving at a steady rate.
- Mistake: you confuse the e in 3e-4 with the number e. Fix: in a printed number, e means times 10 to the power of; the number e is 2.718 and appears as math.e in code.

## Check your understanding

:::quiz
title: Check: exponents and logarithms
q: What is 2 to the power of 5?
- 10
* 32
- 25
- 7
why: Multiply 2 by itself 5 times: 2, 4, 8, 16, 32.
q: What is log base 10 of 10,000?
- 10,000
* 4
- 1,000
why: 10 needs the exponent 4 to make 10,000, which has 4 zeros.
q: A loss drops from 1 to 0.001 over training. On a log base 10 scale, how far does it fall?
- 0.999 units
* 3 units
- 1,000 units
why: log base 10 of 1 is 0 and log base 10 of 0.001 is -3, so the drop is 3 units.
q: Two learning rates, 0.01 and 0.001, are how far apart on a log base 10 axis?
- 0.009 units
* 1 unit
- 10 units
why: Their logs are -2 and -3, so they are 1 unit apart, the same as 0.1 and 0.01.
q: What is 5 to the power of minus 2?
- -25
- -10
* 0.04
why: A negative exponent means 1 divided by the power: 1 / 25 = 0.04.
q: A loss curve on a log scale is a straight line going down. What does that mean?
- The loss stopped improving
* The loss shrinks by the same factor every fixed number of steps
- The loss goes down by the same amount every step
why: A straight line in log space means steady multiplication by a factor below 1, such as halving every 1,000 steps.
:::

## Go further

The Wikipedia pages on exponentiation and on logarithms in the links give the full set of rules and the history. The page on logarithmic scale shows real charts drawn both ways. The Python math module documentation lists every function used in this lesson. This lesson ends the module. The next module, [A vector is a list of numbers](/courses/math-from-zero/vectors-and-matrices/what-a-vector-is), moves from one number to a list of numbers, which is how a model sees every input.
`,
      links: [
        { label: 'Exponentiation (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Exponentiation', kind: 'article' },
        { label: 'Logarithm (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Logarithm', kind: 'article' },
        { label: 'Logarithmic scale (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Logarithmic_scale', kind: 'article' },
        { label: 'math module (Python docs)', url: 'https://docs.python.org/3/library/math.html', kind: 'docs' },
      ],
    },
  ],
}
