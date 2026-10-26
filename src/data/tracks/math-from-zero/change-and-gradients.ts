import type { Module } from '../../types'

export const mod: Module = {
  slug: 'change-and-gradients',
  title: 'Change: derivatives and gradients',
  description: 'How fast a function changes, the five rules that compute it, how to walk downhill to the minimum, and how the same walk works with many variables.',
  level: 'foundations',
  lessons: [
    {
      slug: 'rate-of-change',
      title: 'Rate of change',
      summary: 'After this lesson you can compute an average rate of change, shrink the interval, and read off the derivative as the slope of the tangent line.',
      minutes: 22,
      objectives: [
        'Compute the average rate of change of a function between two points.',
        'Explain the difference between average speed and the speed on a speedometer.',
        'Compute the derivative of t squared at a point by shrinking the interval.',
        'Explain what the sign of a derivative tells you about a function.',
      ],
      keyTerms: ['derivative', 'average-rate-of-change', 'instantaneous-rate-of-change', 'tangent-line', 'secant-line', 'limit'],
      body: `
## What this lesson covers

This lesson teaches one idea: the derivative. The derivative of a function at a point is how fast the output changes there. You start with the average rate of change between two points, which is a division you already know. Then you shrink the gap between the points until the average settles on one number. That number is the derivative. At the end you can compute the derivative of the function p(t) = t squared at t = 1 by hand, and you get the answer 2.

## Why it matters

Training an artificial intelligence (AI) model means changing numbers inside the model until its mistakes are small. To know which way to change a number, the training program asks one question. If I move this number a little, does the error go up or down, and how fast? The derivative answers exactly that question. Every model you meet later on this site, from a line fitted to 5 points to a large language model, learns by computing derivatives. A large language model (LLM) is a program that predicts the next word. It has billions of numbers inside, and training computes a derivative for every one of them.

This lesson gives you the idea with one variable. The next lesson, [Derivative rules you need](/courses/math-from-zero/change-and-gradients/derivative-rules), gives you five rules so you never need to shrink an interval by hand again. The lesson after that, [Minimising a function by following the slope](/courses/math-from-zero/change-and-gradients/follow-the-slope), uses the derivative to walk downhill to the lowest point of a function. That walk is the heart of all model training. You met slope in [Lines and slopes](/courses/math-from-zero/numbers-and-functions/lines-and-slopes). This lesson extends slope from straight lines to curves.

:::video
id: 9vKqVkMQHKk
why: Watch the first 9 minutes. The video uses a moving car and the same shrinking interval that this lesson uses. Listen for the phrase "the slope of the tangent line".
:::

## The idea with an example

> **Analogy.** You drive 120 kilometres in 2 hours. Your average speed is 60 kilometres per hour. But at any one moment your speedometer might show 40 or 90. The average speed is a division: distance divided by time. The speedometer speed is the speed right now, at one instant. The derivative is the mathematical version of the speedometer.

Here is the running example for the whole lesson. A small toy car starts from rest and speeds up. After t seconds its position is p(t) = t squared metres. The letter p stands for position and t stands for time. The table gives the position at the first 5 whole seconds.

| Time t (seconds) | 0 | 1 | 2 | 3 | 4 |
| --- | --- | --- | --- | --- | --- |
| Position p(t) (metres) | 0 | 1 | 4 | 9 | 16 |

The car is not moving at a steady speed. In the first second it moves 1 metre. In the fourth second it moves 16 minus 9, which is 7 metres. The car speeds up. So the question "how fast is the car moving" has a different answer at every instant. We want the speed at exactly t = 1.

### Step 1: the average rate of change

First we compute an average. Pick two times, t = 1 and t = 3. The position changes from 1 metre to 9 metres, so it changes by 8 metres. The time changes by 2 seconds. The average rate of change is the change in output divided by the change in input.

$$\\text{average rate} = \\frac{p(3) - p(1)}{3 - 1} = \\frac{9 - 1}{2} = 4$$

In words: the position at time 3 minus the position at time 1, divided by 3 minus 1, equals 8 divided by 2, which is 4. The average speed between t = 1 and t = 3 is 4 metres per second. On a graph of p(t), this number is the slope of the straight line through the two points (1, 1) and (3, 9). A straight line through two points on a curve is called a secant line. So the average rate of change is the slope of a secant line.

### Step 2: shrink the interval

An average over 2 seconds hides what happens at t = 1 exactly. So we move the second point closer to t = 1 and compute the average again. Each row of the next table keeps the first point at t = 1 and moves the second point closer.

| Second point | Change in position | Change in time | Average rate |
| --- | --- | --- | --- |
| t = 3 | 9 - 1 = 8 | 2 | 4 |
| t = 2 | 4 - 1 = 3 | 1 | 3 |
| t = 1.5 | 2.25 - 1 = 1.25 | 0.5 | 2.5 |
| t = 1.1 | 1.21 - 1 = 0.21 | 0.1 | 2.1 |
| t = 1.01 | 1.0201 - 1 = 0.0201 | 0.01 | 2.01 |
| t = 1.001 | 1.002001 - 1 = 0.002001 | 0.001 | 2.001 |

The averages are 4, 3, 2.5, 2.1, 2.01 and 2.001. They get closer and closer to 2. They never pass 2. The bars show the same numbers.

:::bars
title: Average speed over a shrinking interval from t = 1
unit: metres per second
Interval of 2 s: 4
Interval of 1 s: 3
Interval of 0.5 s: 2.5
Interval of 0.1 s: 2.1
Interval of 0.01 s: 2.01
:::

### Step 3: read off the limit

We cannot set the gap to 0, because then we divide 0 by 0, which has no meaning. Instead we read off the number the averages approach. That number is called the limit. Here the limit is 2. So the speed of the car at exactly t = 1 is 2 metres per second. This is the instantaneous rate of change at t = 1, and it has a shorter name: the derivative of p at t = 1. We write it as p prime of 1 equals 2.

$$p'(1) = 2$$

In words: the derivative of p at 1 is 2. On the graph, the secant lines turn into one line as the second point slides toward the first. That final line touches the curve at (1, 1) without crossing it. It is called the tangent line. Its slope is 2. So the derivative is the slope of the tangent line.

:::flow
title: From two points to the derivative
Two points -> Average rate: divide the rise by the run
Average rate -> Shrink the gap: move the second point closer
Shrink the gap -> Limit: read the number the averages approach
Limit -> Derivative: the slope of the tangent line
:::

Press Next to follow the shrinking interval one step at a time. The panel shows the gap, called h, and the current average.

:::scenario
title: Shrinking the interval at t = 1 for p(t) = t squared
state: h=2, average=?
step: Set the second point at t = 1 + h with h = 2. Compute p(3) - p(1), which is 8, and divide by 2.
state: h=2, average=4
step: Shrink h to 1. The second point is t = 2. Compute 4 - 1 = 3 and divide by 1.
state: h=1, average=3
step: Shrink h to 0.5. The second point is t = 1.5. Compute 2.25 - 1 = 1.25 and divide by 0.5.
state: h=0.5, average=2.5
step: Shrink h to 0.1. The second point is t = 1.1. Compute 1.21 - 1 = 0.21 and divide by 0.1.
state: h=0.1, average=2.1
step: Shrink h to 0.01. Compute 1.0201 - 1 = 0.0201 and divide by 0.01.
state: h=0.01, average=2.01
step: The averages head for 2. Read off the limit. The derivative of p at t = 1 is 2.
state: h=0, derivative=2
:::

## How it works

The procedure above works for any function f and any point x. Here it is as a list of steps.

:::anim
title: The secant line slides into the tangent at t = 1
axes ax @ 110,60 size: 540x400 x: 0,4 y: 0,16 xlabel: "t (seconds)" ylabel: "p (metres)"
curve p on ax = x^2 color: blue label: "p(t) = t squared"
dot a on ax @ 1,1 r: 8 color: yellow label: "(1, 1)"
dot b on ax @ 3,9 r: 8 color: green
line sec on ax from 1,1 to 3,9 color: orange
tangent tan on p at 1 len: 1.2 color: yellow label: slope
num h = 2 @ 790,180 prefix: "gap h = " digits: 2 size: 26
num avg = 4 @ 790,250 prefix: "average = " digits: 2 size: 26 color: orange
text t1 "rise / run = 8 / 2" @ 790,310 size: 17 color: grey
text t2 "The averages head for 2|and never pass it" @ 790,310 size: 17 color: grey
text t3 "p prime of 1 = 2" @ 790,400 size: 24 color: yellow

step: The car's position is p(t) = t squared. We want its speed at exactly t = 1.
  show ax
  draw p
  show a
step: A second point at t = 3 makes a gap h of 2. The line through both is a secant.
  show b, h
  draw sec
step: The slope of the secant is the rise over the run: 8 metres over 2 seconds, which is 4.
  show avg, t1
  pulse sec
step: Shrink the gap. Slide the second point to t = 2. The average falls to 3.
  hide t1
  walk b along p from 3 to 2 (1.5s)
  & vector sec -> 2,4 (1.5s)
  & count h -> 1 (1.5s)
  & count avg -> 3 (1.5s)
step: Shrink again to t = 1.5, then to t = 1.1. The averages go 2.5, then 2.1.
  walk b along p from 2 to 1.5 (1.2s)
  & vector sec -> 1.5,2.25 (1.2s)
  & count h -> 0.5 (1.2s)
  & count avg -> 2.5 (1.2s)
  walk b along p from 1.5 to 1.1 (1.2s)
  & vector sec -> 1.1,1.21 (1.2s)
  & count h -> 0.1 (1.2s)
  & count avg -> 2.1 (1.2s)
step: With h = 0.01 the average is 2.01. The averages head for 2 and never pass it.
  show t2
  walk b along p from 1.1 to 1.01 (1.2s)
  & vector sec -> 1.01,1.0201 (1.2s)
  & count h -> 0.01 (1.2s)
  & count avg -> 2.01 (1.2s)
step: At the limit the secant becomes the tangent at (1, 1). Its slope, 2, is the derivative.
  hide sec, b
  show tan
  count h -> 0 (1s)
  & count avg -> 2 (1s)
  show t3
  highlight a
:::

1. Choose the point x where you want the rate of change.
2. Choose a small gap h and compute the output at x + h and at x.
3. Subtract: f(x + h) minus f(x). This is the rise.
4. Divide the rise by h. This is the average rate of change over the gap.
5. Make h smaller and repeat. Read off the number the averages approach. That is the derivative, written f prime of x.

$$f'(x) = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}$$

In words: the derivative of f at x is the limit, as h goes to 0, of f at x plus h minus f at x, all divided by h. The symbol lim is short for limit. The arrow under it says which quantity shrinks and toward what.

### The derivative at every point at once

For the toy car we found the derivative at one point. A little algebra gives it at every point at the same time. Write x for the time to keep the letters general. The output at x + h is (x + h) squared, which expands to x squared plus 2xh plus h squared. Subtract x squared and the rise is 2xh plus h squared. Divide by h and the average rate is 2x plus h. As h shrinks to 0, this approaches 2x. So the derivative of x squared is 2x at every x. At x = 1 that gives 2, which matches the table. At x = 3 it gives 6. The next lesson turns this result into a rule.

### Reading the sign of the derivative

The derivative is a number with a sign, and the sign carries meaning. The table lists the three cases.

| Derivative at x | What the function does at x | Picture |
| --- | --- | --- |
| positive | output grows as x grows | the curve goes uphill from left to right |
| negative | output shrinks as x grows | the curve goes downhill from left to right |
| zero | output is flat for an instant | the top of a hill or the bottom of a valley |

Here is a preview of the function that the rest of this module uses. Take f(x) = (x minus 3) squared. At x = 0, the output is 9. Use a gap of h = 0.1. The output at 0.1 is 2.9 squared, which is 8.41. The rise is 8.41 minus 9, which is minus 0.59. Divide by 0.1 and the average rate is minus 5.9. The exact derivative at 0 is minus 6, and you will compute it in the next lesson. The sign is negative. So at x = 0, moving x to the right makes f smaller. That single fact, "the slope tells you which way is downhill", is what the lesson on gradient descent uses.

### Computing the averages with code

A short Python program does the shrinking for you. It prints the average rate for 5 values of h. The expression x ** 2 means x to the power 2.

:::code
lang: python
file: shrink.py
def p(t):
    return t ** 2

x = 1.0
for h in [2, 1, 0.5, 0.1, 0.01]:
    average = (p(x + h) - p(x)) / h
    print("h =", h, "average rate =", average)
:::

:::code
lang: text
h = 2 average rate = 4.0
h = 1 average rate = 3.0
h = 0.5 average rate = 2.5
h = 0.1 average rate = 2.100000000000002
h = 0.01 average rate = 2.0100000000000007
:::

The last two lines show a tiny error in the 15th decimal place. The computer stores decimals with a fixed number of bits, so 1.21 minus 1 is not exactly 0.21. You met this in [Numbers you will meet](/courses/math-from-zero/numbers-and-functions/numbers-you-will-meet). The error does not change the answer: the averages still head for 2.

## Try it

:::exercise
title: The speed at t = 3
task: Use paper or a calculator. For the toy car with p(t) = t squared, compute the average rate of change from t = 3 to a second point. Use the second points t = 4, t = 3.5, t = 3.1 and t = 3.01. Then read off the derivative at t = 3.
hint: For t = 3.1, the position is 3.1 squared, which is 9.61. The rise is 9.61 - 9 = 0.61 and the gap is 0.1.
lang: text
solution:
t = 4:    (16 - 9) / 1 = 7
t = 3.5:  (12.25 - 9) / 0.5 = 6.5
t = 3.1:  (9.61 - 9) / 0.1 = 6.1
t = 3.01: (9.0601 - 9) / 0.01 = 6.01
The averages approach 6. The derivative at t = 3 is 6.
This matches the rule: the derivative of t squared is 2t, and 2 times 3 is 6.
:::

:::exercise
title: Change the function in the program
task: Open shrink.py and change the function p so that it returns (t - 3) ** 2. Set x = 0.0. Run the program. Read off the number the averages approach. Say whether the slope is uphill or downhill.
hint: The first line of output should show an average of minus 4 for h = 2, because p(2) is 1 and p(0) is 9.
lang: python
solution:
def p(t):
    return (t - 3) ** 2

x = 0.0
for h in [2, 1, 0.5, 0.1, 0.01]:
    average = (p(x + h) - p(x)) / h
    print("h =", h, "average rate =", average)

# Output approaches -6. The slope is negative, so the curve goes downhill at x = 0.
:::

## Common mistakes

- Mistake: you set h to exactly 0 and try to divide. Fix: 0 divided by 0 has no value; you shrink h and read off the number the averages approach.
- Mistake: you think the derivative is one number for the whole function. Fix: the derivative is a number at each point; for the car it is 2 at t = 1 and 6 at t = 3.
- Mistake: you mix up average speed with the speed right now. Fix: average speed uses two points and a secant line; the derivative uses one point and a tangent line.
- Mistake: you ignore the sign of the derivative. Fix: a negative derivative means the output shrinks as x grows; the sign is the whole point for gradient descent.
- Mistake: you think the tiny error 2.100000000000002 means the method is wrong. Fix: that is floating-point rounding in the computer; the mathematics gives exactly 2.1.

## Check your understanding

:::quiz
title: Check: rate of change
q: For p(t) = t squared, what is the average rate of change between t = 2 and t = 4?
- 4
* 6
- 8
- 12
why: The position goes from 4 to 16, a rise of 12, over a gap of 2 seconds, and 12 divided by 2 is 6.
q: The averages for a shrinking interval are 7, 6.5, 6.1 and 6.01. What is the derivative?
- 7
- 6.01
* 6
- 0
why: The derivative is the limit, the number the averages approach, which is 6.
q: The derivative of a function at x = 5 is minus 3. What does that tell you?
- The output at x = 5 is minus 3
* Near x = 5, the output falls as x grows
- The function has its minimum at x = 5
why: A negative derivative means the curve goes downhill from left to right at that point; it says nothing about the output value itself.
q: Which line has the derivative as its slope?
- The secant line through two points on the curve
* The tangent line that touches the curve at one point
- The line from the origin to the point
why: Secant slopes are averages; as the two points merge, the secant becomes the tangent, whose slope is the derivative.
q: The derivative of x squared is 2x. What is the speed of the toy car at t = 2.5?
- 2.5
- 6.25
* 5
- 2
why: Put t = 2.5 into 2t: 2 times 2.5 is 5 metres per second.
:::

## Go further

The 3Blue1Brown video series in the links shows the tangent line animation that this lesson could only describe in words. The Wikipedia page on the derivative goes deeper on limits and on notation. The Khan Academy unit has many short practice problems on average and instantaneous rates. The next lesson, [Derivative rules you need](/courses/math-from-zero/change-and-gradients/derivative-rules), replaces the shrinking table with five rules you can apply in seconds, and it computes the derivative of (x minus 3) squared exactly.
`,
      links: [
        { label: 'Essence of calculus (3Blue1Brown)', url: 'https://www.3blue1brown.com/topics/calculus', kind: 'course' },
        { label: 'Derivative (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Derivative', kind: 'article' },
        { label: 'Differential calculus (Khan Academy)', url: 'https://www.khanacademy.org/math/differential-calculus', kind: 'course' },
        { label: 'The paradox of the derivative (3Blue1Brown video)', url: 'https://www.youtube.com/watch?v=9vKqVkMQHKk', kind: 'video' },
      ],
    },
    {
      slug: 'derivative-rules',
      title: 'Derivative rules you need',
      summary: 'After this lesson you can differentiate any polynomial and any function built from one function inside another, using the power, constant, sum, product and chain rules.',
      minutes: 24,
      objectives: [
        'Compute the derivative of a power of x with the power rule.',
        'Compute the derivative of a sum of terms with the constant and sum rules.',
        'Compute the derivative of a product of two functions with the product rule.',
        'Compute the derivative of a function inside a function with the chain rule.',
        'Check a derivative by shrinking an interval in Python.',
      ],
      keyTerms: ['derivative', 'power-rule', 'constant-rule', 'sum-rule', 'product-rule', 'chain-rule'],
      body: `
## What this lesson covers

The last lesson found a derivative by shrinking an interval and reading off a limit. That works, but it is slow. This lesson gives you five rules that produce the derivative directly: the power rule, the constant rule, the sum rule, the product rule and the chain rule. Each rule comes with one numeric example that you can check by hand. At the end you can differentiate f(x) = (x minus 3) squared in two different ways and get 2(x minus 3) both times.

## Why it matters

A model's error is a function of the numbers inside the model. That function is built from small pieces: squares, sums, products, and functions placed inside other functions. The five rules in this lesson cover all of those pieces. Programs like PyTorch apply exactly these rules, millions of times per second, to compute the derivatives that training needs. The chain rule in particular is the engine of backpropagation, the method that trains neural networks. You will meet it again in [Backpropagation](/courses/ai-foundations/neural-networks/backpropagation).

The next lesson, [Minimising a function by following the slope](/courses/math-from-zero/change-and-gradients/follow-the-slope), needs one result from this lesson: the derivative of (x minus 3) squared is 2(x minus 3). Everything else here builds up to that one line.

:::video
id: YG15m2VwSjA
why: Watch the first 8 minutes. The video shows the sum rule and the product rule as areas and the chain rule as one function feeding into another. You can stop when the examples with sine start.
:::

## The idea with an example

> **Analogy.** Converting money between three currencies is the chain rule in disguise. Suppose 1 dollar buys 2 euros and 1 euro buys 3 units of a third currency. Then 1 dollar buys 2 times 3, which is 6 units. You multiply the two rates. The derivative is a rate too. When one function feeds its output into another, you multiply their rates in the same way.

Here is the running example. We build a small collection of functions and find the derivative of each one. The last function in the collection is f(x) = (x minus 3) squared, the function that the rest of this module uses. The table shows the functions and the answers. The rest of the lesson shows how to get each answer.

| Function | Derivative | Derivative at x = 2 | Rule used |
| --- | --- | --- | --- |
| x squared | 2x | 4 | power |
| x cubed | 3x squared | 12 | power |
| 5 | 0 | 0 | constant |
| 3x squared + 2x + 5 | 6x + 2 | 14 | constant, sum, power |
| x times (x + 3) | 2x + 3 | 7 | product |
| (2x + 1) squared | 4(2x + 1) | 20 | chain |
| (x - 3) squared | 2(x - 3) | -2 | chain |

Each rule turns one kind of expression into its derivative. The flow shows the order in which you apply them to a compound expression. You work from the outside in: first split sums, then pull out constant factors, then apply the power rule or the chain rule to each piece.

:::flow
title: Taking a derivative apart
Expression -> Split sums: one term at a time
Split sums -> Pull out constants: keep the factor in front
Pull out constants -> Power or chain: differentiate each piece
Power or chain -> Add the pieces: the derivative
:::

Press Next to watch the chain rule work on the last row of the table, f(x) = (x minus 3) squared, at x = 0. The panel shows the inner part, the outer slope and the final answer.

:::scenario
title: The chain rule on f(x) = (x - 3) squared at x = 0
state: x=0, inner=?, outer slope=?, inner slope=?
step: Name the inner function. It is u = x - 3. At x = 0, u is -3.
state: inner=-3
step: Name the outer function. It squares its input: f = u squared.
state: outer=u squared
step: Differentiate the outer function with respect to u. The power rule gives 2u. At u = -3 that is -6.
state: outer slope=-6
step: Differentiate the inner function with respect to x. The derivative of x - 3 is 1.
state: inner slope=1
step: Multiply the two slopes: -6 times 1 is -6. The derivative of f at x = 0 is -6.
state: derivative=-6
:::

The last lesson estimated this derivative as minus 5.9 with a gap of 0.1. The chain rule gives the exact value, minus 6, in five short steps.

## How it works

Each rule below has three parts: the rule in symbols, the rule in words, and one numeric example. Work each example on paper as you read.

:::anim
title: The chain rule multiplies the inner and outer rates
box xin "x" @ 150,170 size: 150x64 icon: none
box inner "inner part|u = x - 3" @ 480,170 size: 220x64 icon: none
box outer "outer part|f = u squared" @ 800,170 size: 200x64 icon: none
num fval = 0 @ 800,270 prefix: "f = " size: 26 color: blue
text lab1 "u changes by 1|per unit of x" @ 480,330 size: 16 color: grey
num rin = 0 @ 480,390 prefix: "inner slope = " size: 26 color: green
text lab2 "f changes by 2u|per unit of u" @ 800,330 size: 16 color: grey
num rout = 0 @ 800,390 prefix: "outer slope = " size: 26 color: green
text mult "multiply the rates: -6 times 1" @ 480,440 size: 16 color: grey
num prod = 0 @ 480,480 prefix: "f prime of 0 = " size: 30 color: yellow
text formula "f prime of x = 2(x - 3)" @ 175,480 size: 18 color: yellow

step: A function inside a function: x goes into the inner part, and its output u goes into the outer part.
  show xin, inner, outer
  arrow xin -> inner : x
  arrow inner -> outer : u
step: Put in x = 0. The inner part gives u = -3. The outer part squares it: f = 9.
  label xin "x = 0"
  send xin -> inner : 0
  send inner -> outer : -3
  show fval
  count fval -> 9
step: The inner rate: u grows by 1 when x grows by 1. The inner slope is 1.
  highlight inner
  show lab1, rin
  count rin -> 1
step: The outer rate: u squared changes by 2u per unit of u. At u = -3 that is -6.
  restore inner
  highlight outer
  show lab2, rout
  count rout -> -6
step: Like the currency chain, multiply the two rates: -6 times 1 is -6.
  restore outer
  show mult, prod
  arrow rin -> prod : 1
  arrow rout -> prod : -6
  count prod -> -6
  pulse prod
step: The same chain at any x gives 2(x - 3). At x = 0 that is exactly -6.
  hide lab1, lab2, mult
  show formula
  highlight prod
:::

### 1. The power rule

$$\\frac{d}{dx} x^n = n x^{n-1}$$

In words: the derivative of x to the power n is n times x to the power n minus 1. The power comes down in front and the new power is one less. For x squared, n is 2, so the derivative is 2 times x to the power 1, which is 2x. For x cubed, n is 3, so the derivative is 3x squared. At x = 2, the derivative of x cubed is 3 times 4, which is 12. For x on its own, n is 1, and the derivative is 1 times x to the power 0, which is 1. The last lesson proved the case n = 2 by shrinking an interval. The rule holds for every n.

### 2. The constant rule

The constant rule has two halves. First, the derivative of a constant on its own is 0. The number 5 does not change when x changes, so its rate of change is 0. Second, a constant factor in front of a function stays in front of the derivative.

$$\\frac{d}{dx} \\big( c \\cdot g(x) \\big) = c \\cdot g'(x)$$

In words: the derivative of a constant c times g is c times the derivative of g. For 3x squared, the derivative of x squared is 2x, so the derivative of 3x squared is 3 times 2x, which is 6x. At x = 2 that is 12. The toy car from the last lesson had p(t) = t squared. A car with p(t) = 3t squared moves 3 times as fast at every instant.

### 3. The sum rule

$$\\frac{d}{dx} \\big( g(x) + k(x) \\big) = g'(x) + k'(x)$$

In words: the derivative of a sum is the sum of the derivatives. You differentiate each term on its own and add the results. Take 3x squared plus 2x plus 5. The three terms give 6x, 2 and 0. Add them: the derivative is 6x plus 2. At x = 2 that is 12 plus 2, which is 14. The sum rule works because slopes add. If one curve rises at 12 per unit and another at 2 per unit, their sum rises at 14 per unit.

With these three rules you can differentiate any polynomial. A polynomial is a sum of terms, each a constant times a power of x. Most of the functions in this course are polynomials or are built from them.

### 4. The product rule

Sometimes a function is a product of two parts that both contain x. The derivative of a product is not the product of the derivatives. The correct rule has two terms.

$$\\frac{d}{dx} \\big( u \\cdot v \\big) = u' v + u v'$$

In words: the derivative of u times v is u prime times v, plus u times v prime. Each part takes a turn being differentiated while the other stays as it is. Take g(x) = x times (x plus 3). Let u be x and v be x plus 3. Then u prime is 1 and v prime is 1. The rule gives 1 times (x plus 3) plus x times 1, which is 2x plus 3. At x = 2 that is 7. You can check this. Expand g to x squared plus 3x and use the sum and power rules: 2x plus 3. The two methods agree.

### 5. The chain rule

The chain rule handles a function inside a function. Call the inside part u. The outside part takes u and produces the output.

$$\\frac{d}{dx} f\\big(u(x)\\big) = f'(u) \\cdot u'(x)$$

In words: the derivative of f of u of x is the outer derivative, taken at u, times the inner derivative. This is the currency chain from the analogy. The outer function says how fast the output changes when u changes. The inner function says how fast u changes when x changes. Multiply the rates.

Take h(x) = (2x plus 1) squared. The inner function is u = 2x plus 1 and the outer function squares. The outer derivative is 2u, which is 2(2x plus 1). The inner derivative is 2. Multiply: 4(2x plus 1). At x = 2, that is 4 times 5, which is 20. Check by expanding: (2x plus 1) squared is 4x squared plus 4x plus 1, whose derivative is 8x plus 4, which is 4(2x plus 1). The two methods agree again.

### The function for the rest of the module

Now the function that the next two lessons use: f(x) = (x minus 3) squared. Do it both ways.

- Chain rule: the inner function is u = x minus 3 with derivative 1; the outer function squares with derivative 2u. The product is 2(x minus 3) times 1, which is 2(x minus 3).
- Expand first: (x minus 3) squared is x squared minus 6x plus 9. The sum and power rules give 2x minus 6, which is 2(x minus 3).

$$f'(x) = 2(x - 3)$$

In words: the derivative of f at x is 2 times x minus 3. At x = 0 it is minus 6, so the curve goes downhill. At x = 3 it is 0, so the curve is flat there. At x = 5 it is 4, so the curve goes uphill. The point x = 3 where the slope is 0 is the bottom of the valley, and the next lesson walks down to it.

### Checking a rule with code

You can always check a derivative by shrinking an interval, as in the last lesson. The program below does that with a gap of 0.0001 and compares the result with the rule's answer for three functions at x = 2. The expression lambda x: ... is a short way to write a small function in Python.

:::code
lang: python
file: check_rules.py
def numeric_derivative(f, x, h=0.0001):
    return (f(x + h) - f(x)) / h

examples = [
    ("3x^2 + 2x + 5", lambda x: 3 * x**2 + 2 * x + 5, lambda x: 6 * x + 2),
    ("x(x + 3)", lambda x: x * (x + 3), lambda x: 2 * x + 3),
    ("(x - 3)^2", lambda x: (x - 3) ** 2, lambda x: 2 * (x - 3)),
]

for name, f, rule in examples:
    print(name, "rule:", rule(2.0), "numeric:", round(numeric_derivative(f, 2.0), 3))
:::

:::code
lang: text
3x^2 + 2x + 5 rule: 14.0 numeric: 14.0
x(x + 3) rule: 7.0 numeric: 7.0
(x - 3)^2 rule: -2.0 numeric: -2.0
:::

The numeric value is rounded to 3 decimal places because the small gap leaves a small error. The rule gives the exact value. When you train a model later, a library computes these rules for you, but the habit of checking one derivative by hand catches many bugs.

## Try it

:::exercise
title: Differentiate three functions by hand
task: Use paper. Find the derivative of each function and evaluate it at x = 1. (a) 4x cubed minus x plus 7. (b) (x + 2) times (x - 1). (c) (3x - 1) squared. For (b), use the product rule and then check by expanding.
hint: For (c) the inner function is 3x - 1, whose derivative is 3. The outer function squares, so the outer derivative is 2 times the inner.
lang: text
solution:
(a) 12x^2 - 1.          At x = 1: 12 - 1 = 11.
(b) Product rule: 1 * (x - 1) + (x + 2) * 1 = 2x + 1.   At x = 1: 3.
    Check: expand to x^2 + x - 2, derivative 2x + 1. Same.
(c) Chain rule: 2 * (3x - 1) * 3 = 6(3x - 1).            At x = 1: 12.
:::

:::exercise
title: Add your own function to the checker
task: Open check_rules.py and add a fourth example to the list: the function (3x - 1) squared with the rule 6(3x - 1). Run the program and confirm that the rule and the numeric value agree at x = 2.
hint: Copy one line of the examples list and change the three parts: the name, the function and the rule.
lang: python
solution:
("(3x - 1)^2", lambda x: (3 * x - 1) ** 2, lambda x: 6 * (3 * x - 1)),
# Added inside the examples list. Output line:
# (3x - 1)^2 rule: 30.0 numeric: 30.0
:::

## Common mistakes

- Mistake: you forget to lower the power. You write the derivative of x cubed as 3x cubed. Fix: the power comes down in front and the new power is one less: 3x squared.
- Mistake: you differentiate a product by multiplying the two derivatives. Fix: use u prime v plus u v prime; for x(x + 3) that gives 2x + 3, not 1.
- Mistake: you apply the chain rule but forget the inner derivative. For (2x + 1) squared you stop at 2(2x + 1). Fix: multiply by the inner derivative 2 to get 4(2x + 1).
- Mistake: you give the derivative of a constant as the constant. Fix: a constant does not change, so its derivative is 0.
- Mistake: you treat the derivative of (x - 3) squared as 2x. Fix: the inner function is x minus 3, so the answer is 2(x minus 3), which is 2x minus 6.

## Check your understanding

:::quiz
title: Check: derivative rules
q: What is the derivative of 5x to the power 4?
- 5x cubed
* 20x cubed
- 20x to the power 4
- 4x cubed
why: The power 4 comes down and multiplies the constant 5, giving 20, and the new power is 3.
q: What is the derivative of x squared plus 7x plus 10 at x = 1?
- 2
* 9
- 18
- 10
why: The derivative is 2x plus 7, and at x = 1 that is 9; the constant 10 contributes 0.
q: Which expression is the derivative of x times (x minus 4)?
- 1 times 1
* (x - 4) + x
- x times (x - 4)
why: By the product rule, u prime v plus u v prime is 1 times (x minus 4) plus x times 1, which is 2x minus 4.
q: A function is (5x + 2) squared. Which rule do you need, and what is the derivative?
- Product rule; 2(5x + 2)
- Power rule; 2(5x + 2)
* Chain rule; 10(5x + 2)
why: One function sits inside another, so you multiply the outer derivative 2(5x + 2) by the inner derivative 5.
q: The derivative of f(x) = (x - 3) squared is 2(x - 3). At which x is the slope 0?
- x = 0
- x = -3
* x = 3
- x = 6
why: 2(x minus 3) is 0 only when x minus 3 is 0, which is x = 3, the bottom of the valley.
q: At x = 5, the derivative of (x - 3) squared is 4. Which way is downhill?
* Toward smaller x
- Toward larger x
- Neither; the curve is flat
why: A positive slope means the output grows as x grows, so moving to larger x goes uphill and moving to smaller x goes downhill.
:::

## Go further

The Wikipedia page on differentiation rules in the links is a complete reference, including rules this lesson skips, such as the quotient rule and the rules for exponentials. The 3Blue1Brown chain rule video shows the rules as pictures. The PyTorch autograd tutorial shows a library applying these same rules to a model. The next lesson, [Minimising a function by following the slope](/courses/math-from-zero/change-and-gradients/follow-the-slope), takes the one result f prime of x equals 2(x minus 3) and uses it to walk to the bottom of the valley.
`,
      links: [
        { label: 'Differentiation rules (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Differentiation_rules', kind: 'article' },
        { label: 'Chain rule (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Chain_rule', kind: 'article' },
        { label: 'Visualizing the chain rule and product rule (3Blue1Brown video)', url: 'https://www.youtube.com/watch?v=YG15m2VwSjA', kind: 'video' },
        { label: 'Automatic differentiation with torch.autograd (PyTorch docs)', url: 'https://pytorch.org/tutorials/beginner/basics/autogradqs_tutorial.html', kind: 'docs' },
      ],
    },
    {
      slug: 'follow-the-slope',
      title: 'Minimising a function by following the slope',
      summary: 'After this lesson you can run gradient descent by hand on f(x) = (x - 3) squared, choose a learning rate, and recognise when the steps converge or blow up.',
      minutes: 25,
      objectives: [
        'Explain why the slope tells you which way is downhill.',
        'Compute three gradient descent steps by hand with a given learning rate.',
        'Compare learning rates of 0.1, 0.5 and 1.2 on the same function.',
        'Recognise convergence and divergence from a list of values.',
        'Run a gradient descent loop in Python and read its output.',
      ],
      keyTerms: ['gradient-descent', 'learning-rate', 'minimum', 'update-rule', 'convergence', 'divergence'],
      body: `
## What this lesson covers

This lesson teaches gradient descent, the method that finds the lowest point of a function by taking small steps downhill. You use one function the whole way through: f(x) = (x minus 3) squared, whose lowest point is at x = 3. You already know its derivative from the last lesson: 2(x minus 3). You start at x = 0 and walk toward 3 with three different step sizes, called learning rates: 0.1, 0.5 and 1.2. At the end you can run the walk by hand and in Python, and you can tell from the numbers whether a learning rate is too small, too large or about right.

## Why it matters

Training a model is gradient descent. The function is the model's error, called the loss. The inputs are the numbers inside the model, called parameters. Training starts the parameters at random values, computes the slope of the loss, and steps downhill. It repeats this millions of times. Every training run you ever start has a learning rate, and the most common reason a run fails is a learning rate that is too large or too small. This lesson lets you see both failures on a function small enough to do on paper.

The next lesson, [Many variables: partial derivatives and the gradient](/courses/math-from-zero/change-and-gradients/gradients-many-variables), does the same walk with two inputs instead of one. In [Loss and gradient descent for a network](/courses/ai-foundations/neural-networks/loss-and-descent) you apply the same walk to a real model.

:::video
id: sDv4f4s2SB8
why: Watch the first 12 minutes. StatQuest runs gradient descent on a line fitted to data, with the same update rule and the same learning rate idea. Notice that the steps get smaller as the slope gets smaller.
:::

## The idea with an example

> **Analogy.** You stand on a hillside in thick fog. You cannot see the valley, but you can feel the slope under your feet. You take a step in the downhill direction. Then you feel the slope again and take another step. Where the ground is steep you take bigger steps, and where it is nearly flat you take small ones. When the ground feels flat in every direction, you are at the bottom. The size of your stride is the learning rate.

The function for this lesson is f(x) = (x minus 3) squared. It is a valley with its bottom at x = 3, where f is 0. Everywhere else f is positive, because a square is never negative. The table gives a few values.

| x | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| f(x) = (x - 3) squared | 9 | 4 | 1 | 0 | 1 | 4 | 9 |
| slope f prime of x = 2(x - 3) | -6 | -4 | -2 | 0 | 2 | 4 | 6 |

Pretend you do not know the answer is 3. You only know how to compute f and its slope at any x. You start at x = 0. The slope there is minus 6. A negative slope means f falls as x grows, so downhill is to the right. The slope also says how steep the ground is: 6 units of fall per unit of x. Gradient descent uses both facts. It moves x in the direction opposite to the slope, by an amount proportional to the slope.

$$x_{\\text{new}} = x_{\\text{old}} - \\eta \\cdot f'(x_{\\text{old}})$$

In words: the new x equals the old x minus the learning rate times the slope at the old x. The Greek letter eta stands for the learning rate. This line is the update rule. The minus sign makes the step go against the slope, which is downhill. The learning rate scales the step.

### Three learning rates on the same function

Set the learning rate to 0.1. At x = 0 the slope is minus 6. The step is 0.1 times minus 6, which is minus 0.6. Subtract it: the new x is 0 minus (minus 0.6), which is 0.6. The function fell from 9 to 5.76. Feel the slope again at 0.6: it is 2 times (0.6 minus 3), which is minus 4.8. The step is minus 0.48, so the next x is 1.08. Keep going. The table shows 5 steps.

| Step | x | f(x) | slope 2(x - 3) | step = 0.1 times slope |
| --- | --- | --- | --- | --- |
| 0 | 0 | 9 | -6 | -0.6 |
| 1 | 0.6 | 5.76 | -4.8 | -0.48 |
| 2 | 1.08 | 3.6864 | -3.84 | -0.384 |
| 3 | 1.464 | 2.3593 | -3.072 | -0.3072 |
| 4 | 1.7712 | 1.5099 | -2.4576 | -0.2458 |
| 5 | 2.01696 | 0.9664 | -1.96608 | -0.1966 |

Every step moves x closer to 3 and makes f smaller. The steps shrink as the slope shrinks, exactly like the hiker near the bottom of the valley. After 10 steps x is 2.678, and after 20 steps it is 2.965. The walk converges: the values settle toward 3. But it is slow.

Now set the learning rate to 0.5. At x = 0 the slope is minus 6. The step is 0.5 times minus 6, which is minus 3. The new x is 0 plus 3, which is 3. The function is 0 and the slope is 0. The walk is finished in one step. This is luck: for this particular valley, 0.5 is the perfect stride. No real training problem lets you know the perfect stride in advance.

Now set the learning rate to 1.2. At x = 0 the slope is minus 6. The step is 1.2 times minus 6, which is minus 7.2. The new x is 7.2. You jumped straight over the valley and landed on the far slope, higher than where you started: f is 17.64. At 7.2 the slope is 8.4. The step is 1.2 times 8.4, which is 10.08. The new x is 7.2 minus 10.08, which is minus 2.88, and f is 34.57. The third step lands at 11.232 with f at 67.77. Every step lands farther from 3 than the last. The walk diverges.

:::bars
title: Value of f after 3 steps from x = 0
unit: value of f
Start (no steps): 9
Learning rate 0.1: 2.36
Learning rate 0.5: 0
Learning rate 1.2: 67.77
:::

Press Next to follow the learning rate 0.1 walk one step at a time. The panel shows x, the value of f and the slope after each step.

:::scenario
title: Gradient descent on f(x) = (x - 3) squared with learning rate 0.1
state: x=0, f=9, slope=-6
step: Compute the slope at x = 0: 2 times (0 - 3) is -6. Negative, so downhill is to the right.
state: step=-0.6
step: Multiply the slope by the learning rate: 0.1 times -6 is -0.6. Subtract it from x: 0 - (-0.6) is 0.6.
state: x=0.6, f=5.76, slope=-4.8
step: Compute the slope at 0.6: 2 times (0.6 - 3) is -4.8. The step is -0.48. The new x is 1.08.
state: x=1.08, f=3.6864, slope=-3.84
step: Compute the slope at 1.08: -3.84. The step is -0.384. The new x is 1.464.
state: x=1.464, f=2.3593, slope=-3.072
step: The slope is smaller each time, so the steps are smaller each time. The walk is closing in on x = 3.
state: distance to 3=1.536
:::

Now the same walk with learning rate 1.2.

:::scenario
title: Gradient descent with learning rate 1.2
state: x=0, f=9, slope=-6
step: The step is 1.2 times -6, which is -7.2. The new x is 0 + 7.2 = 7.2. The walk jumped over the valley.
state: x=7.2, f=17.64, slope=8.4
step: The slope is now positive, so downhill is to the left. The step is 1.2 times 8.4 = 10.08. The new x is 7.2 - 10.08 = -2.88.
state: x=-2.88, f=34.57, slope=-11.76
step: Downhill is to the right again. The step is 1.2 times -11.76 = -14.112. The new x is 11.232.
state: x=11.232, f=67.77, slope=16.464
step: Each landing is farther from 3 than the last, and f grows. The walk diverges. The learning rate is too large.
state: distance to 3=8.232
:::

## How it works

Gradient descent is a loop. Here are the steps in general form for any function f with a known derivative.

:::anim
title: Three learning rates on f(x) = (x - 3) squared
axes ax @ 110,60 size: 540x400 x: -3.5,7.5 y: 0,36 xlabel: "x" ylabel: "f(x)"
curve f on ax = (x-3)^2 color: blue label: "f(x) = (x - 3) squared"
dot ball on ax @ 0,9 r: 9 color: yellow
tangent tan on f at 0 len: 1.2 color: orange label: slope
num rate = 0.1 @ 790,130 prefix: "learning rate = " digits: 1 size: 24 color: green
num xv = 0 @ 790,200 prefix: "x = " digits: 3 size: 26
num fv = 9 @ 790,260 prefix: "f = " digits: 2 size: 22 color: blue
num stp = 0 @ 790,320 prefix: "step = " digits: 3 size: 22 color: orange
text t1 "step = rate times slope|new x = old x - step" @ 790,410 size: 16 color: grey
text t2 "the steps shrink|as the slope shrinks" @ 790,410 size: 16 color: grey
text t3 "one perfect stride|for this valley" @ 790,410 size: 16 color: green
text t4 "each landing is farther|from 3: the walk diverges" @ 790,410 size: 16 color: red

step: The valley is (x - 3) squared. Start at x = 0: f is 9 and the slope is -6.
  show ax
  draw f
  show ball, tan, xv, fv
step: With learning rate 0.1 the step is 0.1 times -6, which is -0.6. Subtract it: x becomes 0.6.
  show rate, stp, t1
  count stp -> -0.6
  walk ball along f from 0 to 0.6 (1.5s)
  & tangent tan -> 0.6 (1.5s)
  & count xv -> 0.6 (1.5s)
  & count fv -> 5.76 (1.5s)
step: Feel the slope again: -4.8. The next steps are -0.48 and -0.384. The steps shrink as the slope shrinks.
  hide t1
  show t2
  count stp -> -0.48 (0.8s)
  walk ball along f from 0.6 to 1.08 (1.2s)
  & tangent tan -> 1.08 (1.2s)
  & count xv -> 1.08 (1.2s)
  & count fv -> 3.69 (1.2s)
  count stp -> -0.384 (0.8s)
  walk ball along f from 1.08 to 1.464 (1.2s)
  & tangent tan -> 1.464 (1.2s)
  & count xv -> 1.464 (1.2s)
  & count fv -> 2.36 (1.2s)
step: Start again at x = 0 with learning rate 0.5. The step is 0.5 times -6, which is -3.
  hide t2
  count rate -> 0.5 (0.8s)
  move ball -> 0,9 (1.2s)
  & tangent tan -> 0 (1.2s)
  & count xv -> 0 (1.2s)
  & count fv -> 9 (1.2s)
  count stp -> -3 (0.8s)
step: One stride lands exactly at x = 3. The slope is 0 and f is 0: finished in one step.
  show t3
  walk ball along f from 0 to 3 (2s)
  & tangent tan -> 3 (2s)
  & count xv -> 3 (2s)
  & count fv -> 0 (2s)
  pulse ball
step: Start again with learning rate 1.2. The step is -7.2, so x jumps over the valley to 7.2.
  hide t3
  count rate -> 1.2 (0.8s)
  move ball -> 0,9 (1.2s)
  & tangent tan -> 0 (1.2s)
  & count xv -> 0 (1.2s)
  & count fv -> 9 (1.2s)
  count stp -> -7.2 (0.8s)
  move ball -> 7.2,17.64 (2s)
  & tangent tan -> 7.2 (2s)
  & count xv -> 7.2 (2s)
  & count fv -> 17.64 (2s)
step: The slope is now 8.4 and the step 10.08. x lands at -2.88, f grows to 34.57. The walk diverges.
  count stp -> 10.08 (0.8s)
  move ball -> -2.88,34.57 (2.5s)
  & tangent tan -> -2.88 (2.5s)
  & count xv -> -2.88 (2.5s)
  & count fv -> 34.57 (2.5s)
  show t4
  color ball red
:::

1. Choose a starting x. In training, this is a random value.
2. Compute the slope f prime of x at the current x.
3. Compute the step: learning rate times slope.
4. Update: new x equals old x minus the step.
5. Stop when the slope is close to 0, or when you have done a fixed number of steps. Otherwise go back to step 2.

:::flow
title: The gradient descent loop
Current x -> Slope: compute f prime of x
Slope -> Step: multiply by the learning rate
Step -> New x: subtract the step from x
New x -> Current x: repeat until the slope is near 0
:::

### Why the three learning rates behave so differently

For this one function you can see the whole story in one line of algebra. The distance from x to the bottom is x minus 3. After one step the new distance is the old distance minus the learning rate times 2 times the old distance. Factor out the old distance.

$$x_{\\text{new}} - 3 = (1 - 2\\eta)(x_{\\text{old}} - 3)$$

In words: the new distance to the bottom equals 1 minus 2 times the learning rate, all multiplied by the old distance. So each step multiplies the distance by a fixed factor. The factor decides everything.

| Learning rate | Factor 1 - 2 times rate | Distance after each step from 3 | What you see |
| --- | --- | --- | --- |
| 0.1 | 0.8 | 3, 2.4, 1.92, 1.536, 1.229 | converges, slowly |
| 0.25 | 0.5 | 3, 1.5, 0.75, 0.375, 0.1875 | converges, halving each step |
| 0.5 | 0 | 3, 0, 0, 0 | reaches the bottom in one step |
| 1.0 | -1 | 3, -3, 3, -3 | bounces between 0 and 6 forever |
| 1.2 | -1.4 | 3, -4.2, 5.88, -8.232 | diverges |

A factor between 0 and 1 shrinks the distance: the walk converges. A factor between minus 1 and 0 also converges, but the walk jumps across the valley on each step. A factor of exactly minus 1 bounces forever. A factor below minus 1 grows the distance: the walk diverges. For f(x) = (x minus 3) squared, any learning rate below 1 converges and any learning rate above 1 diverges.

Real loss functions are not as tidy. They curve differently in different places, so no single factor describes them. But the three behaviours are the same. A loss that falls slowly and steadily means the learning rate is small. A loss that falls, then jumps up, then grows means the learning rate is too large. Most practical work starts with a small learning rate like 0.001 and raises it carefully.

### The loop in Python

The program below runs the loop for a chosen learning rate and prints each step. Change the value of rate to try 0.1, 0.5 and 1.2. The function f and its derivative are written as two small Python functions.

:::code
lang: python
file: descent.py
def f(x):
    return (x - 3) ** 2

def slope(x):
    return 2 * (x - 3)

rate = 0.1
x = 0.0
for step in range(1, 6):
    x = x - rate * slope(x)
    print("step", step, "x =", round(x, 4), "f(x) =", round(f(x), 4))
:::

:::code
lang: text
step 1 x = 0.6 f(x) = 5.76
step 2 x = 1.08 f(x) = 3.6864
step 3 x = 1.464 f(x) = 2.3593
step 4 x = 1.7712 f(x) = 1.5099
step 5 x = 2.017 f(x) = 0.9664
:::

The output matches the hand-computed table. Set rate to 1.2 and the printed x values are 7.2, minus 2.88, 11.232, minus 8.5248 and 19.1347. Set it to 0.5 and the first line already shows x = 3.0 and f(x) = 0.0.

## Try it

:::exercise
title: Walk with learning rate 0.25
task: Use paper. Start at x = 0 on f(x) = (x - 3) squared with learning rate 0.25. Compute 4 steps. For each step write the slope, the step and the new x. Then say how far from 3 you are after step 4.
hint: At x = 0 the slope is -6 and the step is 0.25 times -6, which is -1.5. The new x is 1.5. Each later step halves the remaining distance.
lang: text
solution:
step 1: slope -6,    step -1.5,    x = 1.5
step 2: slope -3,    step -0.75,   x = 2.25
step 3: slope -1.5,  step -0.375,  x = 2.625
step 4: slope -0.75, step -0.1875, x = 2.8125
Distance to 3 after step 4: 0.1875
:::

:::exercise
title: Start on the other side of the valley
task: Open descent.py. Change the start to x = 10.0 and keep rate = 0.1. Before you run it, predict the sign of the first step. Then run it and check the first two values of x.
hint: At x = 10 the slope is 2 times (10 - 3), which is 14. A positive slope means downhill is to the left, so x must decrease.
lang: text
solution:
Prediction: the slope is +14, the step is +1.4, so x decreases.
step 1 x = 8.6 f(x) = 31.36
step 2 x = 7.48 f(x) = 20.0704
The distance to 3 is 7, then 5.6, then 4.48: multiplied by 0.8 each step, as before.
:::

## Common mistakes

- Mistake: you add the step instead of subtracting it, and the walk goes uphill. Fix: the update rule is x minus the learning rate times the slope; the minus sign points downhill.
- Mistake: you see the loss jump up after a step and think the code is broken. Fix: a loss that rises after a step is the sign of a learning rate that is too large; lower it.
- Mistake: you pick a tiny learning rate to be safe and stop after 5 steps. Fix: a tiny learning rate needs many more steps; check that the loss is still falling before you stop.
- Mistake: you think the one-step result at learning rate 0.5 is a general trick. Fix: it works only because this function is a perfect parabola; real losses have no known perfect stride.
- Mistake: you stop when x stops changing much and assume you found the lowest point. Fix: the slope is also near 0 at the top of a hill or on a flat shelf; check that f went down.

## Check your understanding

:::quiz
title: Check: gradient descent
q: On f(x) = (x - 3) squared, you are at x = 5 with learning rate 0.1. What is the next x?
- 5.4
* 4.6
- 4.2
- 3
why: The slope at 5 is 2 times (5 minus 3), which is 4; the step is 0.4; and 5 minus 0.4 is 4.6.
q: Why does the update rule subtract the learning rate times the slope?
- To keep x positive
* Because moving against the slope goes downhill
- Because the slope is always negative
why: A positive slope means uphill is to the right, so you move left; subtracting a positive step does exactly that.
q: A training run prints the loss 9, 17.6, 34.6, 67.8. What is happening?
- The learning rate is too small
* The learning rate is too large and the steps diverge
- The run has converged
why: The loss grows at every step, which means each step overshoots and lands higher; the learning rate must come down.
q: With learning rate 0.1 the distance to the bottom goes 3, 2.4, 1.92, 1.536. What is it after the next step?
- 1.2
* 1.2288
- 1.6
- 0.8
why: Each step multiplies the distance by 0.8, and 1.536 times 0.8 is 1.2288.
q: What is the learning rate 1.0 going to do on f(x) = (x - 3) squared starting at 0?
- Reach 3 in one step
- Converge slowly
* Bounce between 0 and 6 forever
- Diverge to larger and larger values
why: The factor 1 minus 2 times 1.0 is minus 1, so the distance flips sign each step without shrinking.
q: Near the bottom of the valley, what happens to the size of each step?
* It gets smaller, because the slope gets smaller
- It stays the same, because the learning rate is fixed
- It gets larger, because the function is lower
why: The step is the learning rate times the slope, and the slope goes to 0 at the bottom.
:::

## Go further

The Wikipedia page on gradient descent in the links covers the history and the many variants, such as momentum and Adam, that training libraries use. Chapter 4 of the Deep Learning book explains why learning rates are hard to choose for real functions. The StatQuest video repeats the walk on a line fitted to data. The next lesson, [Many variables: partial derivatives and the gradient](/courses/math-from-zero/change-and-gradients/gradients-many-variables), replaces the single slope with a vector of slopes, one per input, and takes the same downhill step in two dimensions.
`,
      links: [
        { label: 'Gradient descent (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Gradient_descent', kind: 'article' },
        { label: 'Numerical computation, chapter 4 of Deep Learning (Goodfellow, Bengio, Courville)', url: 'https://www.deeplearningbook.org/contents/numerical.html', kind: 'article' },
        { label: 'Gradient descent, step by step (StatQuest video)', url: 'https://www.youtube.com/watch?v=sDv4f4s2SB8', kind: 'video' },
        { label: 'Learning rate (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Learning_rate', kind: 'article' },
      ],
    },
    {
      slug: 'gradients-many-variables',
      title: 'Many variables: partial derivatives and the gradient',
      summary: 'After this lesson you can compute partial derivatives of a function of two inputs, assemble them into the gradient vector, and take one gradient descent step in two dimensions.',
      minutes: 25,
      objectives: [
        'Compute the partial derivatives of f(x, y) = x squared plus 2y squared.',
        'Write the gradient as a vector and evaluate it at a point.',
        'Explain why the gradient points in the direction of steepest ascent.',
        'Compute one gradient descent step in two dimensions by hand.',
        'Run a two-variable descent loop in Python.',
      ],
      keyTerms: ['multivariable-function', 'partial-derivative', 'gradient', 'steepest-ascent', 'vector', 'gradient-descent', 'learning-rate'],
      body: `
## What this lesson covers

The last two lessons used a function with one input, x. A model has many inputs: every parameter is one. This lesson teaches how the derivative and gradient descent extend to many inputs. You learn the partial derivative, which is the slope along one input while the others stay fixed, and the gradient, which is the vector of all the partial derivatives. The running example is f(x, y) = x squared plus 2y squared, a bowl with its bottom at (0, 0). At the end you can compute its gradient at the point (3, 1), which is the vector [6, 4], and take one descent step to (2.4, 0.6).

## Why it matters

A small neural network has thousands of parameters. A large language model has billions. The loss is a function of all of them at once. Training needs one number per parameter: how much the loss changes when that one parameter moves a little. That number is a partial derivative. The list of all of them is the gradient. The update rule from the last lesson works unchanged: subtract the learning rate times the gradient. The only difference is that x is now a vector. You met vectors in [A vector is a list of numbers](/courses/math-from-zero/vectors-and-matrices/what-a-vector-is) and you scaled and subtracted them in [Adding, scaling and measuring vectors](/courses/math-from-zero/vectors-and-matrices/vector-arithmetic). This lesson puts those operations to work.

This is the last lesson of the module. The next module, [Chance: probability and statistics](/courses/math-from-zero/chance/probability-basics), gives the other half of the mathematics a model needs. In [The learning loop](/courses/ai-foundations/what-ai-is/the-learning-loop) you see the gradient take its place in the full picture of training.

:::video
id: IHZwWFHWa-w
why: Watch from 3 minutes to 10 minutes. The video shows the loss of a real network as a landscape and explains the gradient as the direction of steepest ascent. Listen for the sentence about the negative gradient.
:::

## The idea with an example

> **Analogy.** You are the hiker in the fog again, but now the hill has two directions: east-west and north-south. You test the slope with one foot toward the east. You test it again with one foot toward the north. The two tests give two numbers. Put them together and they make one arrow that points straight uphill. To go down, walk in the exact opposite direction of that arrow.

The running example is a function with two inputs. A function with two or more inputs and one output is called a multivariable function.

$$f(x, y) = x^2 + 2y^2$$

In words: f of x and y equals x squared plus 2 times y squared. Put in x = 3 and y = 1: 9 plus 2 is 11. Put in x = 0 and y = 0: the output is 0. The output can never be negative, so (0, 0) is the bottom. The graph of f is a surface, like a bowl that is steeper in the y direction than in the x direction. A heat map shows the surface from above: each cell is the value of f at that x and y.

:::matrix
title: Values of f(x, y) = x squared + 2y squared
cols: x=-2, x=-1, x=0, x=1, x=2
y=-2: 12, 9, 8, 9, 12
y=-1: 6, 3, 2, 3, 6
y=0: 4, 1, 0, 1, 4
y=1: 6, 3, 2, 3, 6
y=2: 12, 9, 8, 9, 12
:::

Read the row y = 0. Moving from x = 0 to x = 1 raises f by 1. Read the column x = 0. Moving from y = 0 to y = 1 raises f by 2. The bowl rises faster along y than along x. The partial derivatives measure exactly this, but at a single point instead of over a whole unit.

### The two partial derivatives

A partial derivative is the derivative with respect to one input while every other input is held fixed. To compute the partial derivative with respect to x, treat y as a constant and use the rules from [Derivative rules you need](/courses/math-from-zero/change-and-gradients/derivative-rules). In x squared plus 2y squared, the term 2y squared is a constant when y is fixed, so its derivative is 0. The term x squared has derivative 2x.

$$\\frac{\\partial f}{\\partial x} = 2x$$

In words: the partial derivative of f with respect to x equals 2x. The curly symbol is a special d that means "partial". Now hold x fixed and differentiate with respect to y. The term x squared is a constant and gives 0. The term 2y squared gives 2 times 2y, which is 4y.

$$\\frac{\\partial f}{\\partial y} = 4y$$

In words: the partial derivative of f with respect to y equals 4y. At the point (3, 1), the two partial derivatives are 2 times 3, which is 6, and 4 times 1, which is 4. So at (3, 1) the bowl rises at 6 per unit along x and at 4 per unit along y.

### The gradient

The gradient is the vector whose components are the partial derivatives, in order. It is written with an upside-down triangle called nabla.

$$\\nabla f(x, y) = \\left[ 2x, \\; 4y \\right]$$

In words: the gradient of f at x and y is the vector with components 2x and 4y. At (3, 1) it is [6, 4]. The gradient is a vector, so it has a direction and a length. Its direction is the direction in which f grows fastest from that point. Its length says how fast. This is the arrow from the analogy, and the direction it points is called the direction of steepest ascent.

:::flow
title: From a point to the gradient to the next point
Point (x, y) -> Partial in x: treat y as a constant
Point (x, y) -> Partial in y: treat x as a constant
Partial in x -> Gradient: first component
Partial in y -> Gradient: second component
Gradient -> New point: subtract learning rate times gradient
:::

### One descent step

The update rule is the one from the last lesson, with vectors in place of numbers. Use learning rate 0.1 and start at (3, 1).

$$(x, y)_{\\text{new}} = (x, y)_{\\text{old}} - \\eta \\, \\nabla f(x, y)_{\\text{old}}$$

In words: the new point equals the old point minus the learning rate times the gradient at the old point. The learning rate times the gradient is 0.1 times [6, 4], which is [0.6, 0.4]. Subtract it from (3, 1): the new point is (2.4, 0.6). Check the value of f: 2.4 squared is 5.76, and 2 times 0.6 squared is 0.72, so f is 6.48. It fell from 11 to 6.48. Press Next to follow the step.

:::scenario
title: One gradient descent step on f(x, y) = x squared + 2y squared
state: x=3, y=1, f=11
step: Compute the partial derivative with respect to x: 2 times 3 is 6.
state: partial x=6
step: Compute the partial derivative with respect to y: 4 times 1 is 4.
state: partial y=4
step: Assemble the gradient vector: [6, 4]. It points uphill.
state: gradient=[6, 4]
step: Multiply by the learning rate 0.1: [0.6, 0.4]. Subtract from the point: (3 - 0.6, 1 - 0.4).
state: x=2.4, y=0.6
step: Compute the new value of f: 5.76 + 0.72 = 6.48. It fell from 11.
state: f=6.48
:::

## How it works

The procedure extends to any number of inputs. For a function of n inputs, there are n partial derivatives and the gradient has n components.

:::anim
title: Two partial derivatives make one gradient, and one descent step
axes ax @ 110,80 size: 540x345 x: -1,10 y: -1,6 xlabel: "x" ylabel: "y"
dot bottom on ax @ 0,0 r: 7 color: grey label: "bottom (0, 0)"
dot pt on ax @ 3,1 r: 9 color: yellow
vector px on ax from 3,1 to 9,1 color: blue label: "partial x = 6"
vector py on ax from 3,1 to 3,5 color: green label: "partial y = 4"
vector grad on ax from 3,1 to 9,5 color: yellow label: "gradient = [6, 4]"
num xv = 3 @ 790,150 prefix: "x = " digits: 2 size: 24
num yv = 1 @ 790,200 prefix: "y = " digits: 2 size: 24
num fv = 11 @ 790,260 prefix: "f = " digits: 2 size: 26 color: blue
num gx = 0 @ 790,330 prefix: "2x = " size: 22 color: blue
num gy = 0 @ 790,380 prefix: "4y = " size: 22 color: green
text t1 "f(x, y) = x squared + 2y squared" @ 380,470 size: 17 color: grey
text t2 "0.1 times [6, 4] = [0.6, 0.4]" @ 790,450 size: 16 color: grey
text t3 "new point = (3 - 0.6, 1 - 0.4)" @ 790,450 size: 16 color: grey
text t4 "x shrinks by 0.8 and y by 0.6|on every step" @ 790,450 size: 16 color: grey

step: The bowl has its bottom at (0, 0). Start at (3, 1), where f is 11.
  show ax, t1, bottom, pt, xv, yv, fv
step: Hold y fixed and feel the slope along x. The partial derivative is 2x, which is 6 here.
  show gx
  draw px
  & count gx -> 6 (1.2s)
step: Hold x fixed and feel the slope along y. The partial derivative is 4y, which is 4.
  show gy
  draw py
  & count gy -> 4 (1.2s)
step: Put the two numbers together: the gradient [6, 4]. It points straight uphill, away from the bottom.
  draw grad
  hide px, py
  pulse grad
step: Multiply the gradient by the learning rate 0.1. The arrow shrinks to [0.6, 0.4].
  show t2
  vector grad -> 3.6,1.4 (1.5s)
  & label grad "0.1 times gradient" (1.5s)
step: Subtract it: the arrow flips to point downhill. The point moves to (2.4, 0.6) and f falls to 6.48.
  hide t2
  show t3
  vector grad -> 2.4,0.6 (1.5s)
  & label grad "minus the step" (1.5s)
  move pt -> 2.4,0.6 (1.5s)
  & count xv -> 2.4 (1.5s)
  & count yv -> 0.6 (1.5s)
  & count fv -> 6.48 (1.5s)
  & count gx -> 4.8 (1.5s)
  & count gy -> 2.4 (1.5s)
step: Repeat. Each step multiplies x by 0.8 and y by 0.6, so the point heads for the bottom.
  hide grad, t3
  show t4
  move pt -> 1.92,0.36 (1.2s)
  & count xv -> 1.92 (1.2s)
  & count yv -> 0.36 (1.2s)
  & count fv -> 3.95 (1.2s)
  & count gx -> 3.84 (1.2s)
  & count gy -> 1.44 (1.2s)
  move pt -> 1.536,0.216 (1.2s)
  & count xv -> 1.54 (1.2s)
  & count yv -> 0.22 (1.2s)
  & count fv -> 2.45 (1.2s)
  & count gx -> 3.07 (1.2s)
  & count gy -> 0.86 (1.2s)
  highlight bottom
:::

1. Write down the function.
2. For each input, treat all the other inputs as constants and differentiate with the usual rules. This gives one partial derivative per input.
3. Evaluate every partial derivative at the current point. Put the numbers in a list in the same order as the inputs. This list is the gradient at that point.
4. Multiply the gradient by the learning rate.
5. Subtract the result from the current point, component by component. This is the new point.
6. Repeat from step 3 until the gradient is close to the zero vector.

### Why the gradient points straight uphill

The claim that the gradient is the direction of steepest ascent is easy to test with numbers. At (3, 1) take three tiny steps of the same length, 0.1, in three directions, and measure how much f rises. The gradient direction is [6, 4] scaled to length 1, which is about [0.832, 0.555]. The table shows the three tests.

| Direction of the step | New point | New f | Rise from 11 |
| --- | --- | --- | --- |
| along x only, [1, 0] | (3.1, 1) | 11.61 | 0.61 |
| along y only, [0, 1] | (3, 1.1) | 11.42 | 0.42 |
| along the gradient, [0.832, 0.555] | (3.0832, 1.0555) | 11.734 | 0.734 |

The step along the gradient raises f the most. Any other direction of the same length raises it less. So the gradient points uphill in the steepest way, and minus the gradient points downhill in the steepest way. That is why the update rule subtracts the gradient. Each component of the gradient also tells you something on its own: the 6 says x matters more than y at this point, so the step moves x more than y.

### Several steps, and the link to one variable

Run the update a few times from (3, 1) with learning rate 0.1. The table lists the points.

| Step | x | y | gradient [2x, 4y] | f(x, y) |
| --- | --- | --- | --- | --- |
| 0 | 3 | 1 | [6, 4] | 11 |
| 1 | 2.4 | 0.6 | [4.8, 2.4] | 6.48 |
| 2 | 1.92 | 0.36 | [3.84, 1.44] | 3.9456 |
| 3 | 1.536 | 0.216 | [3.072, 0.864] | 2.4526 |

Look at each column on its own. The x values go 3, 2.4, 1.92, 1.536: each is 0.8 times the last, the same factor you saw in the last lesson for a learning rate of 0.1. The y values go 1, 0.6, 0.36, 0.216: each is 0.6 times the last, because the bowl is steeper in y. In two dimensions, gradient descent is one-dimensional gradient descent on each input at the same time. Both inputs head for 0, so the point heads for the bottom at (0, 0). With a million inputs the same thing happens in a million columns at once.

### The loop in Python

The program stores the point as a list of two numbers and the gradient as another list. The update subtracts component by component.

:::code
lang: python
file: descent2d.py
def f(x, y):
    return x**2 + 2 * y**2

def gradient(x, y):
    return [2 * x, 4 * y]

rate = 0.1
point = [3.0, 1.0]
for step in range(1, 4):
    g = gradient(point[0], point[1])
    point = [point[0] - rate * g[0], point[1] - rate * g[1]]
    value = f(point[0], point[1])
    print("step", step, "point =", [round(p, 4) for p in point], "f =", round(value, 4))
:::

:::code
lang: text
step 1 point = [2.4, 0.6] f = 6.48
step 2 point = [1.92, 0.36] f = 3.9456
step 3 point = [1.536, 0.216] f = 2.4526
:::

The output matches the hand-computed table. In a real training program, the list point has millions of entries and a library computes the gradient for you. The loop looks the same.

## Try it

:::exercise
title: A bowl that is not centred at zero
task: Use paper. Take g(x, y) = (x - 3) squared + (y + 1) squared. Find both partial derivatives. Evaluate the gradient at (0, 0). Then take one step with learning rate 0.1 and compute g before and after the step.
hint: For the x partial, treat (y + 1) squared as a constant. The chain rule on (x - 3) squared gives 2(x - 3), as in the last lesson. The y partial is 2(y + 1).
lang: text
solution:
Partial in x: 2(x - 3).   Partial in y: 2(y + 1).
Gradient at (0, 0): [2(0 - 3), 2(0 + 1)] = [-6, 2].
Step: 0.1 times [-6, 2] = [-0.6, 0.2].
New point: (0 - (-0.6), 0 - 0.2) = (0.6, -0.2).
g before: 9 + 1 = 10.   g after: 5.76 + 0.64 = 6.4.
The bottom is at (3, -1), and the step moved toward it in both inputs.
:::

:::exercise
title: Change the function in the program
task: Open descent2d.py. Change f and gradient to the function g from the previous exercise. Start at point = [0.0, 0.0] and run 3 steps with rate 0.1. Check that the first printed point is [0.6, -0.2].
hint: The gradient function should return [2 * (x - 3), 2 * (y + 1)].
lang: python
solution:
def f(x, y):
    return (x - 3)**2 + (y + 1)**2

def gradient(x, y):
    return [2 * (x - 3), 2 * (y + 1)]

# Output:
# step 1 point = [0.6, -0.2] f = 6.4
# step 2 point = [1.08, -0.36] f = 4.096
# step 3 point = [1.464, -0.488] f = 2.6214
:::

## Common mistakes

- Mistake: when you differentiate with respect to x, you also differentiate the y terms. Fix: hold y fixed; a term with only y in it is a constant and gives 0.
- Mistake: you write the gradient components in the wrong order. Fix: the order of the gradient matches the order of the inputs, so [partial in x, partial in y].
- Mistake: you step along the gradient and the loss goes up. Fix: the gradient points uphill; the update rule subtracts it.
- Mistake: you use one learning rate for x and a different one for y by accident. Fix: the same learning rate multiplies every component; the gradient itself makes the steps differ in size.
- Mistake: you think a zero gradient always means the lowest point. Fix: the gradient is also zero at the top of a hill and at a saddle, where the surface goes up one way and down another; check that the loss went down.

## Check your understanding

:::quiz
title: Check: partial derivatives and the gradient
q: What is the partial derivative of f(x, y) = x squared + 2y squared with respect to y?
- 2x
- 2y
* 4y
- 2x + 4y
why: Hold x fixed so x squared gives 0, and the derivative of 2y squared is 2 times 2y, which is 4y.
q: What is the gradient of f(x, y) = x squared + 2y squared at the point (1, 2)?
- [1, 2]
- [2, 4]
* [2, 8]
- [2, 2]
why: The gradient is [2x, 4y], and at (1, 2) that is [2, 8].
q: The gradient at a point is [2, 8]. In which direction does f fall fastest?
- Along [2, 8]
* Along [-2, -8]
- Along [8, 2]
why: The gradient points in the direction of steepest ascent, so its opposite is the direction of steepest descent.
q: You are at (1, 2) with gradient [2, 8] and learning rate 0.1. What is the next point?
- (1.2, 2.8)
* (0.8, 1.2)
- (0.9, 1.9)
- (0, 0)
why: The step is 0.1 times [2, 8], which is [0.2, 0.8], and (1 minus 0.2, 2 minus 0.8) is (0.8, 1.2).
q: A model has 1,000 parameters. How many components does the gradient of its loss have?
- 1
- 2
* 1,000
- 1,000,000
why: There is one partial derivative per parameter, and the gradient lists all of them.
q: Why does the y value shrink faster than the x value in the descent on x squared + 2y squared?
- Because y starts smaller
* Because the bowl is steeper in y, so the y partial is larger
- Because the learning rate for y is larger
why: The partial in y is 4y against 2x in x, so each step removes a larger fraction of y than of x with the same learning rate.
:::

## Go further

The Wikipedia pages on the gradient and on partial derivatives in the links go deeper on notation and on functions of three or more inputs. The 3Blue1Brown video shows the gradient of a real network's loss. The PyTorch tutorial on automatic differentiation shows a library computing gradients with the same rules you used by hand. This lesson ends the module. The next module, [Chance: probability and statistics](/courses/math-from-zero/chance/probability-basics), begins with the other tool every model needs: a way to talk about uncertainty. When you reach [Loss and gradient descent for a network](/courses/ai-foundations/neural-networks/loss-and-descent), every step of that lesson is a step you took here.
`,
      links: [
        { label: 'Gradient (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Gradient', kind: 'article' },
        { label: 'Partial derivative (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Partial_derivative', kind: 'article' },
        { label: 'Gradient descent, how neural networks learn (3Blue1Brown video)', url: 'https://www.youtube.com/watch?v=IHZwWFHWa-w', kind: 'video' },
        { label: 'Automatic differentiation with torch.autograd (PyTorch docs)', url: 'https://pytorch.org/tutorials/beginner/basics/autogradqs_tutorial.html', kind: 'docs' },
      ],
    },
  ],
}
