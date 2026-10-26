import type { Module } from '../../types'

export const mod: Module = {
  slug: 'first-models',
  title: 'Your first models',
  description: 'Linear regression by hand and in scikit-learn, error measures and the train-test split, logistic regression, trees and neighbours, and overfitting.',
  level: 'beginner',
  lessons: [
    {
      slug: 'linear-regression',
      title: 'Predict a number: linear regression',
      summary: 'After this lesson you can fit a straight line to 5 house prices by hand, read its coefficient and intercept, and get the same line from scikit-learn.',
      minutes: 24,
      objectives: [
        'Explain what linear regression predicts and what its two numbers, the coefficient and the intercept, mean.',
        'Compute the best line through 5 points by hand with the means method.',
        'Run LinearRegression in scikit-learn and read coef_ and intercept_.',
        'Predict the price of a new house from the fitted line.',
      ],
      keyTerms: ['linear regression', 'regression', 'coefficient', 'intercept', 'residual', 'scikit-learn', 'mean squared error'],
      before: [
        { label: 'Lines and slopes', to: '/courses/math-from-zero/numbers-and-functions/lines-and-slopes' },
        { label: 'The learning loop', to: '/courses/ai-foundations/what-ai-is/the-learning-loop' },
      ],
      body: `
## What this lesson covers

This lesson teaches the first real model: linear regression. Linear regression predicts a number by drawing the best straight line through the examples. You fit the line to 5 house prices by hand, with nothing more than averages and multiplication. Then you fit the same line in Python with the scikit-learn library and see that the computer finds the same 2 numbers. At the end you can predict the price of a house you have never seen.

## Why it matters

Every model on this site, from this line up to a large language model, does one thing. It takes numbers in, multiplies them by learned numbers, and gives a number out. Linear regression is that idea with no extras. The learned numbers are called coefficients. When you later meet the weights of a neural network, they are the same thing with a new name. The [learning loop](/courses/ai-foundations/what-ai-is/the-learning-loop) lesson showed the loop of data, model, loss, update and evaluate. This lesson is the first time you turn the whole loop by hand. The next lesson, [Measuring error and splitting data](/courses/ai-foundations/first-models/measuring-error), measures how good the line is.

:::video
id: nk2CQITm_eo
why: Watch the first 9 minutes. StatQuest draws the line through the points, shows the residuals as vertical sticks, and explains why we square them. Stop when R squared starts; this lesson does not need it.
:::

## The idea with an example

> **Analogy.** An estate agent with 20 years of experience looks at a house and says a price. She does not use a formula. She has seen thousands of houses, and in her head a bigger house means a higher price, at about so many pounds per square metre. Linear regression is that rule of thumb written as one line: price equals some amount per square metre, times the size, plus a fixed amount. Training is the process of finding the two amounts from the examples.

Here are the 5 houses you carry through this whole module. For each house you know the floor area in square metres and the sale price in thousands of pounds. The size is the feature, the input the model reads. The price is the label, the answer the model must predict.

| House | Size in m2 | Price in thousand pounds |
| --- | --- | --- |
| 1 | 40 | 110 |
| 2 | 60 | 150 |
| 3 | 80 | 220 |
| 4 | 100 | 250 |
| 5 | 120 | 310 |

Put the 5 points on a chart with size across and price up. They lie close to a straight line, but not exactly on one. Linear regression chooses the one line that passes closest to all 5 points. A line has 2 numbers. The slope says how much the price rises for each extra square metre. The intercept says where the line crosses the price axis, at size 0. In machine learning the slope is called a coefficient, so from now on this lesson uses that word.

The model is this formula.

$$\\text{price} = w \\times \\text{size} + b$$

In words: the predicted price is the coefficient w times the size, plus the intercept b. Training means finding the values of w and b. For these 5 houses the answer turns out to be w = 2.5 and b = 8. So the line is price = 2.5 times size + 8. Take a house of 90 square metres, which is not in the table. The line predicts 2.5 times 90 + 8, which is 225 + 8, which is 233 thousand pounds.

The diagram shows the path from the table to a prediction.

:::flow
title: From 5 houses to a price
Table -> Means: average size and price
Means -> Coefficient: slope from the spread
Coefficient -> Intercept: line through the means
Intercept -> Prediction: 2.5 x 90 + 8 = 233
:::

Press Next to compute the line by hand, one step at a time. The panel shows the numbers you have so far.

:::scenario
title: Fit the line to the 5 houses by hand
state: mean size=?, mean price=?, w=?, b=?
step: Average the sizes. 40 + 60 + 80 + 100 + 120 is 400, and 400 divided by 5 is 80.
state: mean size=80
step: Average the prices. 110 + 150 + 220 + 250 + 310 is 1040, and 1040 divided by 5 is 208.
state: mean price=208
step: For each house, subtract the mean size. The 5 differences are -40, -20, 0, 20 and 40.
state: size diffs=-40 -20 0 20 40
step: For each house, subtract the mean price. The 5 differences are -98, -58, 12, 42 and 102.
state: price diffs=-98 -58 12 42 102
step: Multiply each size difference by its price difference and add. 3920 + 1160 + 0 + 840 + 4080 is 10000.
state: top=10000
step: Square each size difference and add. 1600 + 400 + 0 + 400 + 1600 is 4000.
state: bottom=4000
step: Divide. The coefficient w is 10000 divided by 4000, which is 2.5.
state: w=2.5
step: The line passes through the two means. So b is 208 minus 2.5 times 80, which is 208 minus 200, which is 8.
state: b=8
step: Predict the 90 square metre house. 2.5 times 90 + 8 is 233.
state: prediction for 90 m2=233
:::

That is the whole of training for linear regression. You needed 2 averages, 10 subtractions, 10 multiplications and 1 division. A computer does the same arithmetic for a million houses in a fraction of a second.

## How it works

### Why these steps give the best line

For any line you could draw, each house has a residual. A residual is the real price minus the price the line predicts. The line price = 2.5 times size + 8 predicts 108 for house 1, so the residual is 110 minus 108, which is 2. The table lists all 5.

:::anim
title: Fit a line through 5 houses and predict a sixth
axes ax @ 90,50 size: 520x400 x: 20,130 y: 60,340 xlabel: "size in m2" ylabel: "price in thousand pounds"
dot h1 on ax @ 40,110 color: blue
dot h2 on ax @ 60,150 color: blue
dot h3 on ax @ 80,220 color: blue
dot h4 on ax @ 100,250 color: blue
dot h5 on ax @ 120,310 color: blue
dot m on ax @ 80,208 r: 9 color: yellow label: "mean: size 80 and price 208"
curve fit on ax = 2.5*x + 8 color: yellow label: "price = 2.5 x size + 8"
line r1 on ax from 40,108 to 40,110 color: red label: "2"
line r2 on ax from 60,158 to 60,150 color: red label: "-8"
line r3 on ax from 80,208 to 80,220 color: red label: "12"
line r4 on ax from 100,258 to 100,250 color: red label: "-8"
line r5 on ax from 120,308 to 120,310 color: red label: "2"
dot q on ax @ 40,108 r: 8 color: green label: "90 m2"
num msize = 0 @ 790,120 prefix: "mean size = " size: 20
num mprice = 0 @ 790,160 prefix: "mean price = " size: 20
num wv = 0 @ 790,225 prefix: "w = " digits: 1 size: 26 color: yellow
num bv = 0 @ 790,270 prefix: "b = " size: 26 color: yellow
text res "the residuals add up to 0|so square them first" @ 790,335 size: 16 color: red
num mse = 0 @ 790,390 prefix: "MSE = " size: 22 color: red
num pred = 108 @ 790,450 prefix: "price = " size: 28 color: green

step: Each house is one point: size across, price up. Here are the 5 houses.
  show ax, h1, h2, h3, h4, h5
step: Average the sizes and the prices. The mean point sits at size 80 and price 208.
  show msize, mprice
  count msize -> 80
  & count mprice -> 208
  show m
step: The best line passes through the mean point, with slope w = 2.5 and intercept b = 8.
  draw fit
  show wv, bv
  count wv -> 2.5
  & count bv -> 8
step: Each house sits a little off the line. The gaps are the residuals, and they add up to 0.
  draw r1, r2, r3, r4, r5
  show res
step: Square each residual, add, divide by 5: the MSE is 56. No other line gets a smaller MSE.
  show mse
  count mse -> 56
step: Now predict a 90 square metre house: slide along the line to size 90 and read 233.
  show q, pred
  walk q along fit from 40 to 90 (2s)
  & count pred -> 233 (2s)
  highlight q
:::

| House | Size | Real price | Predicted price | Residual |
| --- | --- | --- | --- | --- |
| 1 | 40 | 110 | 108 | 2 |
| 2 | 60 | 150 | 158 | -8 |
| 3 | 80 | 220 | 208 | 12 |
| 4 | 100 | 250 | 258 | -8 |
| 5 | 120 | 310 | 308 | 2 |

A good line has small residuals. But small in which sense? Adding the residuals is no good, because the plus and minus values cancel: here they add to exactly 0. So linear regression squares each residual first and adds the squares. The squares are 4, 64, 144, 64 and 4, and their sum is 280. Divide by 5 houses and you get 56. This number is the mean squared error (MSE), the average of the squared residuals. The best line is the line with the smallest MSE. The steps you did in the scenario are the formula that finds it directly, with no searching.

$$w = \\frac{\\sum (x_i - \\bar{x})(y_i - \\bar{y})}{\\sum (x_i - \\bar{x})^2}, \\qquad b = \\bar{y} - w\\,\\bar{x}$$

In words: the coefficient is the sum of each size difference times its price difference, divided by the sum of the squared size differences. The intercept is the mean price minus the coefficient times the mean size. The bar over a letter means its mean. The letter i numbers the houses from 1 to 5. Mathematicians call this method least squares, because it finds the least sum of squares.

Linear regression is the one model where a formula gives the answer in one go. For almost every later model there is no such formula. Instead the computer guesses w and b, measures the MSE, and nudges both numbers downhill. That method is [gradient descent](/courses/math-from-zero/change-and-gradients/follow-the-slope), and it would arrive at the same 2.5 and 8 here.

### What the two numbers mean

The coefficient 2.5 means that each extra square metre adds 2.5 thousand pounds, which is 2,500 pounds, to the predicted price. It is a rate, like a speed. The intercept 8 is the predicted price of a house with 0 square metres. No such house exists, so do not read a story into it. The line needs the intercept only to sit at the right height. A model with 2 features, say size and bedrooms, has 2 coefficients and 1 intercept. A model with 100 features has 100 coefficients. Each coefficient says how much the prediction changes when that one feature rises by 1 and the others stay still.

### The same line in scikit-learn

scikit-learn is the standard free Python library for models like this one. Install it once with pip, inside the virtual environment you set up in [Packages and pip](/courses/start-here/python-for-data/packages-and-pip).

:::code
lang: bash
pip install scikit-learn
:::

Every scikit-learn model follows the same 3 moves: create the model, call fit with the inputs and the answers, call predict on new inputs. The inputs go in as a list of rows, one row per house, even when each row holds only one number. That is why the sizes below are written as [[40], [60], ...] and not [40, 60, ...].

:::code
lang: python
file: line.py
from sklearn.linear_model import LinearRegression

sizes = [[40], [60], [80], [100], [120]]
prices = [110, 150, 220, 250, 310]

model = LinearRegression()
model.fit(sizes, prices)

print("coefficient:", model.coef_[0])
print("intercept:", model.intercept_)
print("prediction for 90 m2:", model.predict([[90]])[0])
:::

:::code
lang: text
coefficient: 2.5
intercept: 8.000000000000014
prediction for 90 m2: 233.00000000000003
:::

The computer gives 2.5 and 8, the same as your hand calculation. The tiny digits after 8.000000000000014 come from floating point arithmetic, which you met in [Numbers you will meet](/courses/math-from-zero/numbers-and-functions/numbers-you-will-meet). Treat them as 8. The attribute coef_ is a list with one number per feature, so coef_[0] is the coefficient of size. The attribute intercept_ is the single intercept. The trailing underscore is a scikit-learn habit that marks a value learned by fit.

To use 2 features, give each row 2 numbers. The code below adds the number of bedrooms. scikit-learn now learns 2 coefficients, one for size and one for bedrooms, and you read them from coef_ in the same order as the columns.

:::code
lang: python
file: two_features.py
from sklearn.linear_model import LinearRegression

rows = [[40, 1], [60, 2], [80, 3], [100, 3], [120, 4]]
prices = [110, 150, 220, 250, 310]

model = LinearRegression().fit(rows, prices)
print("coefficients:", model.coef_)
print("intercept:", model.intercept_)
print("90 m2 with 3 bedrooms:", model.predict([[90, 3]])[0])
:::

The numbers you get differ from 2.5 and 8, because the model now shares the explanation of the price between 2 features. That is normal. With 5 houses and 2 features the second coefficient is not reliable, and the next lessons show how to tell.

## Try it

:::exercise
title: Fit a line by hand to 3 points
task: Three flats of 30, 50 and 70 square metres sold for 90, 130 and 170 thousand pounds. Use paper. Find the mean size, the mean price, the coefficient and the intercept with the steps from the scenario. Then predict the price of a 60 square metre flat.
hint: The size differences are -20, 0 and 20. The price differences are -40, 0 and 40. The bottom of the fraction is 400 + 0 + 400.
lang: text
solution:
mean size = (30 + 50 + 70) / 3 = 50
mean price = (90 + 130 + 170) / 3 = 130
top = (-20)(-40) + (0)(0) + (20)(40) = 800 + 0 + 800 = 1600
bottom = 400 + 0 + 400 = 800
w = 1600 / 800 = 2
b = 130 - 2 x 50 = 30
line: price = 2 x size + 30
60 m2: 2 x 60 + 30 = 150 thousand pounds
:::

:::exercise
title: Check the flats in scikit-learn
task: Put the 3 flats from the first exercise into line.py in place of the 5 houses. Run the file. Confirm that coef_ is 2 and intercept_ is 30, and that the prediction for 60 square metres is 150.
hint: Keep the double brackets around each size. The prices list has no inner brackets.
lang: python
solution:
from sklearn.linear_model import LinearRegression

sizes = [[30], [50], [70]]
prices = [90, 130, 170]

model = LinearRegression().fit(sizes, prices)
print(model.coef_[0], model.intercept_)
print(model.predict([[60]])[0])
:::

## Common mistakes

- Mistake: you pass the sizes as a flat list [40, 60, 80] and scikit-learn raises an error about a 2D array. Fix: each example is a row, so write [[40], [60], [80]], one inner list per house.
- Mistake: you read the intercept 8 as the price of an empty plot. Fix: the intercept only sets the height of the line. The data has no house near 0 square metres, so the line says nothing about one.
- Mistake: you add the residuals to judge the line and get 0, so you think the line is perfect. Fix: residuals cancel in pairs; square them first, as mean squared error does.
- Mistake: you use the line for a 500 square metre mansion. Fix: trust the line only between the smallest and largest sizes it saw, 40 to 120. Far outside that range the straight-line pattern may not hold.
- Mistake: you believe the coefficient 2.5 proves that adding a square metre causes a 2,500 pound rise. Fix: the line describes a pattern in these 5 sales, not a cause; bigger houses may also have more bedrooms or better streets.

## Check your understanding

:::quiz
title: Check: linear regression
q: The line is price = 2.5 x size + 8, in thousand pounds. What does it predict for a 70 square metre house?
- 175
* 183
- 208
- 258
why: 2.5 times 70 is 175, and adding the intercept 8 gives 183.
q: What does the coefficient 2.5 tell you?
- A house of 2.5 square metres costs 8 thousand pounds
* Each extra square metre adds about 2.5 thousand pounds to the predicted price
- The line fits 2.5 of the 5 houses exactly
why: A coefficient is a rate: the change in the prediction for a rise of 1 in that feature.
q: House 3 is 80 square metres and sold for 220. The line predicts 208. What is the residual?
- -12
* 12
- 208
- 0
why: The residual is the real value minus the prediction: 220 minus 208 is 12.
q: Why does linear regression square the residuals before adding them?
- Squaring makes the numbers smaller
* Positive and negative residuals would cancel, and squaring removes the signs
- scikit-learn cannot add negative numbers
why: The residuals 2, -8, 12, -8 and 2 add to 0; their squares add to 280, which measures the real spread.
q: You fit a model on size and bedrooms together. How many numbers does fit learn?
- 1
- 2
* 3
- 5
why: One coefficient per feature, so 2, plus 1 intercept.
q: You move every house price in the table up by 10 thousand pounds and refit. What changes?
- The coefficient rises by 10
* The intercept rises by 10 and the coefficient stays 2.5
- Nothing changes
why: Shifting all prices by the same amount shifts the line up but does not change its slope.
:::

## Go further

The scikit-learn user guide page on linear models in the links shows the same LinearRegression class with its options. The Wikipedia page on simple linear regression gives the formula you used and a proof that it minimises the squared residuals. The StatQuest video covers the same ground with pictures. The next lesson, [Measuring error and splitting data](/courses/ai-foundations/first-models/measuring-error), turns the mean squared error of 56 into a fair test. It hides some houses from the model before training.
`,
      links: [
        { label: 'Linear models (scikit-learn user guide)', url: 'https://scikit-learn.org/stable/modules/linear_model.html', kind: 'docs' },
        { label: 'LinearRegression (scikit-learn API)', url: 'https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LinearRegression.html', kind: 'docs' },
        { label: 'Simple linear regression (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Simple_linear_regression', kind: 'article' },
        { label: 'Linear Regression, Clearly Explained (StatQuest)', url: 'https://www.youtube.com/watch?v=nk2CQITm_eo', kind: 'video' },
      ],
    },
    {
      slug: 'measuring-error',
      title: 'Measuring error and splitting data',
      summary: 'After this lesson you can compute MSE, RMSE and MAE for a model, split examples into a training set and a test set, and explain why you never test on training data.',
      minutes: 22,
      objectives: [
        'Compute mean squared error, root mean squared error and mean absolute error by hand from residuals.',
        'Choose which error measure to report and explain the difference to a non-technical person.',
        'Split the 5 houses into a training set and a test set, fit on one and measure on the other.',
        'Run train_test_split and the error functions in scikit-learn.',
      ],
      keyTerms: ['mean squared error', 'mean absolute error', 'root mean squared error', 'residual', 'train-test split', 'training set', 'test set'],
      before: [{ label: 'Predict a number: linear regression', to: '/courses/ai-foundations/first-models/linear-regression' }],
      body: `
## What this lesson covers

This lesson teaches how to say, with one number, how good a model is. You compute three error measures by hand: mean squared error, root mean squared error and mean absolute error. Then you learn the single most important habit in machine learning. You hide some examples from the model before training, and you measure the error only on those hidden examples. At the end you can run a fair test of any model in 6 lines of scikit-learn.

## Why it matters

A model that you cannot measure is a guess. Every decision later on this site, from picking a model to tuning it to deciding whether a change helped, is a comparison of error numbers. And the numbers are only honest when the model has not seen the answers. A model that is tested on the houses it trained on looks better than it is, sometimes much better. The next lesson, [Predict a category: logistic regression](/courses/ai-foundations/first-models/classification), needs the same split and adds error measures for yes-or-no answers.

:::video
id: fSytzGwwBVw
why: Watch the first 3 minutes. StatQuest shows why you must keep some data for testing and what goes wrong when you train and test on the same rows. The rest of the video is about cross-validation, which the last lesson of this module covers.
:::

## The idea with an example

> **Analogy.** A teacher writes 5 practice questions on the board and goes through the answers with the class. The next day she sets a test. If the test uses the same 5 questions, a student who memorised the answers scores full marks and has learned nothing. So she keeps a few questions back, never shows them in class, and uses only those to test. The practice questions are the training set. The questions she kept back are the test set.

Start with the line from the last lesson, price = 2.5 times size + 8, fitted on all 5 houses. Its residuals were 2, -8, 12, -8 and 2. How bad is that? You need one number, and there are three common ways to get it.

The mean squared error (MSE) squares each residual, adds the squares and divides by the count. The squares are 4, 64, 144, 64 and 4. Their sum is 280, and 280 divided by 5 is 56. The unit is thousand pounds squared, which nobody can picture. The root mean squared error (RMSE) takes the square root to fix that: the square root of 56 is about 7.5 thousand pounds. The mean absolute error (MAE) drops the minus signs instead of squaring. The absolute residuals are 2, 8, 12, 8 and 2. Their sum is 32, and 32 divided by 5 is 6.4 thousand pounds.

| Measure | Formula in words | Value for the line | Unit |
| --- | --- | --- | --- |
| MSE | average of the squared residuals | 56 | thousand pounds squared |
| RMSE | square root of the MSE | 7.5 | thousand pounds |
| MAE | average of the absolute residuals | 6.4 | thousand pounds |

But there is a problem with all three numbers. The line was fitted to these 5 houses, so it was built to make these residuals small. The number 56 says how well the line copies the houses it saw. It says nothing about the next house that comes on the market. To find that out, you must hide a house before fitting.

Here is the running example. Hide house 3, the 80 square metre house that sold for 220. Fit the line to the other 4 houses. Then ask the line to price house 3, and compare the answer with 220.

:::flow
title: A fair test with one hidden house
5 houses -> Split: hide house 3
Split -> Training set: houses 1 2 4 5
Split -> Test set: house 3
Training set -> Fit: line from 4 houses
Fit -> Test set: predict 205 for 80 m2
Test set -> Test error: 220 - 205 = 15
:::

Press Next to do the fit and the test by hand.

:::scenario
title: Train on 4 houses, test on 1
state: training=1 2 4 5, test=3
step: Average the 4 training sizes. 40 + 60 + 100 + 120 is 320, and 320 divided by 4 is 80.
state: mean size=80
step: Average the 4 training prices. 110 + 150 + 250 + 310 is 820, and 820 divided by 4 is 205.
state: mean price=205
step: Size differences: -40, -20, 20, 40. Price differences: -95, -55, 45, 105. Multiply pairs and add: 3800 + 1100 + 900 + 4200 is 10000.
state: top=10000
step: Square the size differences and add: 1600 + 400 + 400 + 1600 is 4000. So w is 10000 divided by 4000, which is 2.5.
state: w=2.5
step: b is 205 minus 2.5 times 80, which is 205 minus 200, which is 5. The training line is price = 2.5 x size + 5.
state: b=5
step: Residuals on the 4 training houses: 110 - 105 = 5, 150 - 155 = -5, 250 - 255 = -5, 310 - 305 = 5. Training MSE is (25 + 25 + 25 + 25) / 4, which is 25.
state: training MSE=25
step: Now the hidden house. The line predicts 2.5 x 80 + 5, which is 205. The real price is 220. The residual is 15.
state: test residual=15
step: Test MSE is 15 squared, which is 225. The test MAE is 15.
state: test MSE=225, test MAE=15
:::

The training MSE is 25. The test MSE is 225, nine times larger. This gap is the normal case, not an accident. A model always looks better on the examples it fitted than on new ones. The test number is the one that predicts how the model does in real use, so the test number is the one you report.

## How it works

### The three error measures

Every error measure starts from the residuals, the real values minus the predictions. The formulas use n for the number of examples, y for a real value and a y with a hat for a prediction.

:::anim
title: Train on 4 houses, test on the hidden fifth
axes ax @ 90,50 size: 520x400 x: 20,130 y: 60,340 xlabel: "size in m2" ylabel: "price in thousand pounds"
dot h1 on ax @ 40,110 color: blue
dot h2 on ax @ 60,150 color: blue
dot h3 on ax @ 80,220 color: blue label: "house 3"
dot h4 on ax @ 100,250 color: blue
dot h5 on ax @ 120,310 color: blue
curve fit on ax = 2.5*x + 5 color: yellow label: "price = 2.5 x size + 5"
line r1 on ax from 40,105 to 40,110 color: green label: "5"
line r2 on ax from 60,155 to 60,150 color: green label: "-5"
line r4 on ax from 100,255 to 100,250 color: green label: "-5"
line r5 on ax from 120,305 to 120,310 color: green label: "5"
dot p3 on ax @ 80,205 r: 6 color: red label: "predicted 205"
line r3 on ax from 80,205 to 80,220 color: red label: "15"
text t1 "Training set: 4 houses" @ 790,110 size: 18 color: green
text t2 "Test set: house 3, hidden" @ 790,150 size: 18 color: red
num trmse = 0 @ 790,240 prefix: "training MSE = " size: 24 color: green
num tres = 0 @ 790,320 prefix: "test residual = " size: 20 color: red
num temse = 0 @ 790,370 prefix: "test MSE = " size: 24 color: red
text t3 "9 times the training MSE" @ 790,440 size: 20 color: yellow

step: The 5 houses again. The question: how well does the line price a house it has never seen?
  show ax, h1, h2, h3, h4, h5
step: Hide house 3 before fitting. The other 4 houses are the training set.
  show t1, t2
  color h1, h2, h4, h5 green
  color h3 red
  dim h3
step: Fit the line to the 4 training houses only: price = 2.5 times size + 5.
  draw fit
step: Each training residual is 5 or minus 5. Square, add and divide by 4: training MSE 25.
  draw r1, r2, r4, r5
  show trmse
  count trmse -> 25
step: Now bring back house 3. The line predicts 205 for 80 square metres, but it sold for 220.
  restore h3
  show p3
  draw r3
  show tres
  count tres -> 15
step: The test residual is 15. Squared, the test MSE is 225, nine times the training MSE.
  show temse
  count temse -> 225
  show t3
  highlight temse
:::

$$\\text{MSE} = \\frac{1}{n}\\sum_{i=1}^{n}(y_i - \\hat{y}_i)^2, \\qquad \\text{RMSE} = \\sqrt{\\text{MSE}}, \\qquad \\text{MAE} = \\frac{1}{n}\\sum_{i=1}^{n}|y_i - \\hat{y}_i|$$

In words: MSE is the sum of the squared residuals divided by the count. RMSE is its square root. MAE is the sum of the residuals without their signs, divided by the count. The three measures agree on which of two models is better most of the time, but they weigh mistakes differently. Squaring makes one residual of 12 count as 144, while two residuals of 6 count as 36 each, 72 in total. So MSE and RMSE punish a single large miss much harder than MAE does. Use these rules to choose.

A small example makes the difference clear. Model A misses 4 flats by 5 each. Model B misses 3 flats by 0 and 1 flat by 20. Both have an MAE of 5. The MSE of model A is 25, and the MSE of model B is 400 divided by 4, which is 100. Suppose a single large miss is a disaster, such as a delivery that arrives 20 days late. Then MSE tells you to prefer model A. If only the total shortfall matters, MAE says the two are equal. Decide which story fits your problem before you pick the measure.

1. Use MSE while training, because that is what linear regression minimises and because its slope is easy to compute.
2. Report RMSE or MAE to people, because they are in the units of the answer, here thousand pounds.
3. Prefer MAE when a few examples have wild prices that you do not want to dominate the number.
4. Prefer RMSE when a large miss really is much worse than several small ones, such as in a budget forecast.

### Why the split works

The split separates two jobs. The training set teaches the model. The test set judges it. The model never sees a test answer until the judging, so it cannot have memorised it. With 5 houses you held out 1, which is 20 percent. With 1,000 houses you would hold out about 200, chosen at random so that both sets look alike. Random choice matters: if you held out the 5 biggest houses, the test set would ask questions the training set never covered.

| Set | Share | Job | Error on it is called |
| --- | --- | --- | --- |
| Training set | about 80 percent | fit the coefficients | training error, always optimistic |
| Test set | about 20 percent | judge the finished model, once | test error, the number to report |

The test set gives an honest number only if you use it once, at the end. Suppose you look at the test error, change the model, look again, and repeat 50 times. The test set has then quietly become a second training set. Your choices now fit its quirks. The last lesson in this module, [Overfitting, underfitting and cross-validation](/courses/ai-foundations/first-models/overfitting-and-generalisation), gives the method for tuning a model without touching the test set.

### The split and the measures in scikit-learn

The function train_test_split shuffles the rows and cuts them into two parts. The argument test_size=0.2 keeps 20 percent for the test set. The argument random_state=0 fixes the shuffle, so you get the same split every time you run the file. Any whole number works, and a different number gives a different split. The error functions take the real values first and the predictions second.

:::code
lang: python
file: split.py
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, mean_absolute_error

sizes = [[40], [60], [80], [100], [120]]
prices = [110, 150, 220, 250, 310]

X_train, X_test, y_train, y_test = train_test_split(
    sizes, prices, test_size=0.2, random_state=0
)
print("test house:", X_test, y_test)

model = LinearRegression().fit(X_train, y_train)

train_pred = model.predict(X_train)
test_pred = model.predict(X_test)
print("training MSE:", mean_squared_error(y_train, train_pred))
print("test MSE:", mean_squared_error(y_test, test_pred))
print("test MAE:", mean_absolute_error(y_test, test_pred))
:::

Run it. The first line shows which house the shuffle hid. Change random_state to 1, 2 and 3 and run again. The test house changes, and so do the error numbers, sometimes by a lot. With only 5 houses, one hidden house is a noisy judge. That is a real limit of tiny data sets, and the cross-validation lesson shows how to average over every possible hidden house. The capital X and small y are a habit from mathematics. X is a table of inputs with many columns, and y is a single column of answers.

To reproduce the hand calculation exactly, skip the shuffle and pick house 3 yourself.

:::code
lang: python
file: hold_out_house_3.py
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error

X_train = [[40], [60], [100], [120]]
y_train = [110, 150, 250, 310]
X_test = [[80]]
y_test = [220]

model = LinearRegression().fit(X_train, y_train)
print("line:", model.coef_[0], model.intercept_)
print("training MSE:", mean_squared_error(y_train, model.predict(X_train)))
print("test MSE:", mean_squared_error(y_test, model.predict(X_test)))
:::

:::code
lang: text
line: 2.5 5.000000000000014
training MSE: 25.0
test MSE: 225.0
:::

The computer agrees with the scenario. The training line is 2.5 times size + 5, the training MSE is 25 and the test MSE is 225.

## Try it

:::exercise
title: Three measures from residuals
task: A model for 4 flats has residuals 3, -1, -6 and 2, in thousand pounds. Use paper. Compute the MSE, the RMSE and the MAE. Then say which single residual contributes most to the MSE and what share of the total it is.
hint: Square each residual for the MSE: 9, 1, 36 and 4. Drop the signs for the MAE: 3, 1, 6 and 2.
lang: text
solution:
MSE = (9 + 1 + 36 + 4) / 4 = 50 / 4 = 12.5
RMSE = square root of 12.5 = about 3.5
MAE = (3 + 1 + 6 + 2) / 4 = 12 / 4 = 3
The residual -6 contributes 36 of 50, which is 72 percent of the MSE.
:::

:::exercise
title: Hide a different house
task: Edit hold_out_house_3.py so that the test house is house 5 (120 m2, 310) and the training set is houses 1 to 4. Run it. Write down the training line, the training MSE and the test MSE. Is the test error again larger than the training error?
hint: Move [120] and 310 from the training lists to the test lists, and put [80] and 220 back into training.
lang: python
solution:
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error

X_train = [[40], [60], [80], [100]]
y_train = [110, 150, 220, 250]
X_test = [[120]]
y_test = [310]

model = LinearRegression().fit(X_train, y_train)
print("line:", model.coef_[0], model.intercept_)
print("training MSE:", mean_squared_error(y_train, model.predict(X_train)))
print("test MSE:", mean_squared_error(y_test, model.predict(X_test)))
# line: 2.45 and 11, training MSE 67.5, test MSE 25
# This time the test error is smaller. With one test house the judge is noisy.
:::

## Common mistakes

- Mistake: you report the error on the training set and call the model good. Fix: fit on the training set, measure on the test set, and report only the test number.
- Mistake: you run train_test_split without random_state, get a different split on every run, and cannot explain why the error keeps changing. Fix: set random_state to a fixed number while you develop.
- Mistake: you tell your manager the MSE is 56 and she asks 56 what. Fix: report RMSE or MAE in the units of the answer, here about 7.5 or 6.4 thousand pounds.
- Mistake: you tune the model 30 times while watching the test error. Fix: the test set is for one final check; use a validation split or cross-validation for tuning.
- Mistake: you hold out the 5 largest houses to make the test hard. Fix: choose the test set at random so that it looks like the training set and like future data.

## Check your understanding

:::quiz
title: Check: error and the split
q: A model has residuals 4, -4, 4 and -4. What are its MSE and MAE?
- MSE 0, MAE 0
* MSE 16, MAE 4
- MSE 4, MAE 16
why: Each squared residual is 16 and each absolute residual is 4, so the averages are 16 and 4.
q: Two models have the same MAE of 5. Model A has residuals 5, 5, 5, 5. Model B has residuals 0, 0, 0, 20. Which has the higher MSE?
- Model A
* Model B
- They are equal
why: Model A has MSE 25; model B has MSE 400 divided by 4, which is 100, because squaring punishes the single miss of 20.
q: The training MSE is 25 and the test MSE is 225. What does the gap tell you?
- The test set has a mistake in it
* The model does worse on houses it has not seen, which is the normal case
- The model is underfitting
why: A fitted model always looks better on the data it fitted; the test number is the honest one.
q: You have 500 houses and use test_size=0.2. How many houses are in the test set?
- 20
* 100
- 400
why: 20 percent of 500 is 100 houses for testing and 400 for training.
q: You check the test error after every small change to the model, 40 times. What is the problem?
- The test set gets smaller each time
* Your choices now fit the test set, so its error is no longer an honest estimate
- Nothing, that is what the test set is for
why: Repeated use turns the test set into a second training set; keep it for one final check.
:::

## Go further

The scikit-learn pages on train_test_split and on the regression metrics in the links list every option and the exact formulas. The Wikipedia page on mean squared error adds the statistics view. The next lesson, [Predict a category: logistic regression](/courses/ai-foundations/first-models/classification), changes the question from how much to which. It brings its own error measures: accuracy, precision and recall.
`,
      links: [
        { label: 'train_test_split (scikit-learn API)', url: 'https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.train_test_split.html', kind: 'docs' },
        { label: 'Regression metrics (scikit-learn user guide)', url: 'https://scikit-learn.org/stable/modules/model_evaluation.html#regression-metrics', kind: 'docs' },
        { label: 'Mean squared error (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Mean_squared_error', kind: 'article' },
        { label: 'Cross Validation, Clearly Explained (StatQuest)', url: 'https://www.youtube.com/watch?v=fSytzGwwBVw', kind: 'video' },
      ],
    },
    {
      slug: 'classification',
      title: 'Predict a category: logistic regression',
      summary: 'After this lesson you can turn a weighted sum into a probability with the sigmoid, pick a threshold, and score a classifier with accuracy, precision, recall and a confusion matrix.',
      minutes: 25,
      objectives: [
        'Explain the difference between regression and classification with one example of each.',
        'Compute the sigmoid of a number by hand and read the result as a probability.',
        'Apply a threshold to probabilities and fill in a confusion matrix.',
        'Compute accuracy, precision and recall from the confusion matrix and choose which one to watch.',
        'Run LogisticRegression and the classification metrics in scikit-learn.',
      ],
      keyTerms: ['classification', 'logistic regression', 'sigmoid', 'threshold', 'accuracy', 'precision', 'recall', 'confusion matrix'],
      before: [
        { label: 'Predict a number: linear regression', to: '/courses/ai-foundations/first-models/linear-regression' },
        { label: 'Exponents and logarithms', to: '/courses/math-from-zero/numbers-and-functions/exponents-and-logs' },
      ],
      body: `
## What this lesson covers

This lesson changes the question. The last two lessons predicted a number: the price. This lesson predicts a category: will the house sell within 30 days, yes or no? A task with a category as the answer is called classification. You learn logistic regression. It is the straight line from the first lesson with one extra step, the sigmoid, which turns any number into a probability. Then you learn the four counts of a confusion matrix and the three scores you compute from them. At the end you can judge any yes-or-no model, including a spam filter or a medical test.

## Why it matters

Most AI decisions are classifications. Is this email spam? Is this transaction fraud? Which of 10,000 words comes next? A language model is a classifier with a very large number of categories. Logistic regression is the smallest classifier, and it is also exactly one neuron of a neural network, so you meet it again in [A neuron](/courses/ai-foundations/neural-networks/a-neuron). The scores in this lesson, accuracy, precision and recall, are the words you use whenever you evaluate a model. You use them again when you evaluate your own AI system in the project track. The next lesson, [Decision trees, random forests and nearest neighbours](/courses/ai-foundations/first-models/trees-and-neighbours), gives three other ways to classify.

:::video
id: yIYKR4sgzI8
why: Watch the first 6 minutes. StatQuest shows the S-shaped curve and why a straight line cannot give a probability. Note how the vertical axis changes from a number to a probability between 0 and 1.
:::

## The idea with an example

> **Analogy.** A doctor reads a patient's blood test. The result is a number, say 7.2. The doctor does not tell the patient a number. She turns it into a chance: "with 7.2 there is about an 80 percent chance you have the infection". Then she decides: above 50 percent, she prescribes the medicine. Logistic regression is this two-step habit. First squeeze a number into a chance between 0 and 1. Then compare the chance with a threshold and answer yes or no.

Here are the same 5 houses with a new label. The estate agent also recorded whether each house sold within 30 days. Small houses in this town sell fast, because first-time buyers compete for them.

| House | Size in m2 | Sold within 30 days |
| --- | --- | --- |
| 1 | 40 | yes |
| 2 | 60 | yes |
| 3 | 80 | yes |
| 4 | 100 | no |
| 5 | 120 | no |

A straight line cannot answer this. A line predicts 233 for 90 square metres, and 233 is not a yes or a no. Worse, a line goes below 0 and above 1 for sizes far enough out, and no chance can do that. Logistic regression keeps the line but passes its output through a function that squashes every number into the range 0 to 1. That function is the sigmoid, named after its S shape.

The model has two steps. Step one is the familiar line, which now produces a score called z.

$$z = w \\times \\text{size} + b$$

In words: z is the coefficient times the size, plus the intercept. For this town the trained values are w = -0.1 and b = 7.5. You can also write the line as z = 0.1 times (75 minus size). The coefficient is negative because a bigger house means a lower chance of a quick sale. A house of 75 square metres gets z = 0 and sits exactly on the fence.

Step two is the sigmoid, written with the Greek letter sigma.

$$p = \\sigma(z) = \\frac{1}{1 + e^{-z}}$$

In words: the probability p is 1 divided by 1 plus e to the power minus z. The letter e is the constant 2.718 from [Exponents and logarithms](/courses/math-from-zero/numbers-and-functions/exponents-and-logs). When z is 0, e to the power 0 is 1, so p is 1 divided by 2, which is 0.5. When z is large and positive, e to the power minus z is close to 0, so p is close to 1. When z is large and negative, e to the power minus z is huge, so p is close to 0. The table shows a few values worth remembering.

| z | e to the power minus z | p = sigmoid of z |
| --- | --- | --- |
| -4 | 54.6 | 0.018 |
| -2 | 7.39 | 0.119 |
| 0 | 1 | 0.5 |
| 1.5 | 0.223 | 0.818 |
| 2 | 0.135 | 0.881 |
| 4 | 0.018 | 0.982 |

The flow shows the two steps and the final decision for house 2.

:::flow
title: Logistic regression for a 60 m2 house
Size 60 -> Line: z = 0.1 x (75 - 60) = 1.5
Line -> Sigmoid: p = 1 / (1 + 0.223) = 0.818
Sigmoid -> Threshold: is 0.818 at least 0.5?
Threshold -> Answer: yes, quick sale
:::

Press Next to score all 5 houses by hand and count the hits and misses.

:::scenario
title: Score the 5 houses with threshold 0.5
state: threshold=0.5, correct=0, wrong=0
step: House 1, 40 m2. z = 0.1 x (75 - 40) = 3.5. p = 1 / (1 + 0.030) = 0.971. That is at least 0.5, so predict yes. Real answer yes. Correct.
state: house 1=yes vs yes, correct=1
step: House 2, 60 m2. z = 1.5. p = 1 / (1 + 0.223) = 0.818. Predict yes. Real answer yes. Correct.
state: house 2=yes vs yes, correct=2
step: House 3, 80 m2. z = 0.1 x (75 - 80) = -0.5. p = 1 / (1 + 1.649) = 0.378. Below 0.5, so predict no. Real answer yes. Wrong: a miss.
state: house 3=no vs yes, correct=2, wrong=1
step: House 4, 100 m2. z = -2.5. p = 1 / (1 + 12.18) = 0.076. Predict no. Real answer no. Correct.
state: house 4=no vs no, correct=3
step: House 5, 120 m2. z = -4.5. p = 1 / (1 + 90.0) = 0.011. Predict no. Real answer no. Correct.
state: house 5=no vs no, correct=4, wrong=1
step: Accuracy is correct divided by total: 4 / 5 = 0.8. The one mistake is a real yes that the model called no.
state: accuracy=0.8, misses=1, false alarms=0
:::

Four of five right, so the accuracy is 0.8, or 80 percent. But the one mistake has a type: the model said no to a house that really sold fast. That is a miss. The other kind of mistake, saying yes to a house that then sat unsold, is a false alarm. The model made none of those. Accuracy hides this difference, and the rest of the lesson gives you the tools to see it.

## How it works

### Training the line behind the sigmoid

Where did w = -0.1 and b = 7.5 come from? Training, as always, but with a twist. There is no one-step formula for logistic regression as there was for the straight line. Instead the computer starts with a guess and measures how far the probabilities are from the real answers. Then it nudges w and b downhill with [gradient descent](/courses/math-from-zero/change-and-gradients/follow-the-slope). The measure of distance is not the squared error. It is cross-entropy, which you met in [Surprise, entropy and cross-entropy](/courses/math-from-zero/chance/entropy-and-cross-entropy). Cross-entropy charges a large penalty when the model gives a probability near 0 to something that happened. scikit-learn does all of this inside fit, so you never write the loop yourself at this level.

:::anim
title: The sigmoid turns a size into a probability, then a threshold decides
axes ax @ 90,50 size: 520x400 x: 20,130 y: 0,1 xlabel: "size in m2" ylabel: "p = chance of a quick sale"
curve sig on ax = sigmoid(0.1*(75 - x)) color: blue label: "sigmoid"
line thr on ax from 20,0.5 to 130,0.5 color: yellow dashed label: "threshold 0.5"
dot h1 on ax @ 40,0.971 color: grey
dot h2 on ax @ 60,0.818 color: grey
dot h3 on ax @ 80,0.378 color: grey label: "house 3"
dot h4 on ax @ 100,0.076 color: grey
dot h5 on ax @ 120,0.011 color: grey
dot ball on ax @ 40,0.971 r: 10 color: yellow
num zv = 3.5 @ 790,140 prefix: "z = " digits: 1 size: 26
num pv = 0.971 @ 790,190 prefix: "p = " digits: 3 size: 26 color: blue
text yes "above 0.5: predict yes" @ 790,290 size: 18 color: green
text no "below 0.5: predict no" @ 790,290 size: 18 color: red
text miss "real answer yes: a miss" @ 790,335 size: 18 color: red
num acc = 0 @ 790,410 prefix: "accuracy = " digits: 1 size: 26 color: yellow
text note "one miss and no false alarm" @ 790,455 size: 18 color: grey

step: The line gives each size a score z. The sigmoid squashes z into a probability p between 0 and 1.
  show ax
  draw sig (2s)
step: The 5 houses sit on the curve at their sizes. The dashed line is the threshold, 0.5.
  show h1, h2, h3, h4, h5
  draw thr
step: House 1, 40 square metres: z = 3.5, p = 0.971. Above the threshold, so predict yes. Correct.
  show ball, zv, pv, yes
  color h1 green
step: Slide to house 2 at 60 square metres: z = 1.5 and p = 0.818. Predict yes. Correct.
  walk ball along sig from 40 to 60 (1.5s)
  & count zv -> 1.5 (1.5s)
  & count pv -> 0.818 (1.5s)
  color h2 green
step: House 3, 80 square metres: p = 0.378, below the line. Predict no. But it really sold fast: a miss.
  walk ball along sig from 60 to 80 (1.5s)
  & count zv -> -0.5 (1.5s)
  & count pv -> 0.378 (1.5s)
  hide yes
  show no, miss
  color h3 red
  pulse h3
step: Houses 4 and 5 give p = 0.076 and 0.011. Predict no, and both really were no. Correct.
  walk ball along sig from 80 to 120 (2s)
  & count zv -> -4.5 (2s)
  & count pv -> 0.011 (2s)
  color h4, h5 green
step: Four of five right: accuracy 0.8. The one error is a miss, not a false alarm.
  hide ball, no, miss
  show acc, note
  count acc -> 0.8
  highlight h3
:::

### The confusion matrix

A yes-or-no prediction can be right or wrong in 2 ways each, so there are 4 outcomes. Their names are long but exact. A true positive (TP) is a real yes that the model called yes. A false positive (FP) is a real no that the model called yes: a false alarm. A false negative (FN) is a real yes that the model called no: a miss. A true negative (TN) is a real no that the model called no. The 2 by 2 table of these counts is the confusion matrix. Rows are the real answers and columns are the predictions.

Five houses are too few to show the pattern. So here are 10 houses from a test set that the model never trained on. The table gives the probability the model assigned to each house and the real answer.

| House | Probability | Real answer | Prediction at 0.5 | Outcome |
| --- | --- | --- | --- | --- |
| A | 0.92 | yes | yes | TP |
| B | 0.85 | yes | yes | TP |
| C | 0.71 | yes | yes | TP |
| D | 0.64 | no | yes | FP |
| E | 0.55 | yes | yes | TP |
| F | 0.45 | yes | no | FN |
| G | 0.38 | yes | no | FN |
| H | 0.33 | no | no | TN |
| I | 0.20 | no | no | TN |
| J | 0.08 | no | no | TN |

Count the outcomes: 4 true positives, 1 false positive, 2 false negatives and 3 true negatives. The heat map is the confusion matrix. The diagonal from top left to bottom right holds the correct answers.

:::matrix
title: Confusion matrix for the 10 test houses at threshold 0.5
cols: predicted yes, predicted no
real yes: 4, 2
real no: 1, 3
:::

### Three scores from four counts

Three scores come straight from the matrix.

$$\\text{accuracy} = \\frac{TP + TN}{TP + TN + FP + FN}, \\quad \\text{precision} = \\frac{TP}{TP + FP}, \\quad \\text{recall} = \\frac{TP}{TP + FN}$$

In words: accuracy is the correct count divided by the total. Precision is, of the houses the model called yes, the share that really were yes. Recall is, of the houses that really were yes, the share the model found. For the 10 houses, accuracy is 7 divided by 10, which is 0.7. Precision is 4 divided by 5, which is 0.8. Recall is 4 divided by 6, which is 0.67.

1. Watch precision when a false alarm is expensive. A spam filter with low precision sends real mail to the junk folder.
2. Watch recall when a miss is expensive. A cancer screening test with low recall sends sick people home.
3. Watch accuracy only when the two categories are about equally common and both mistakes cost about the same.

Accuracy fails badly on rare categories. If 1 house in 100 is a quick sale, a model that always says no has 99 percent accuracy and finds nothing. Its recall is 0. Always report precision and recall next to accuracy.

### Moving the threshold

The threshold 0.5 is a choice, not a law. Lower it to 0.3 and the model says yes to every house with a probability of at least 0.3. That adds F, G and H to the yes column. Now the counts are 6 true positives, 2 false positives, 0 false negatives and 2 true negatives. Recall rises to 6 divided by 6, which is 1.0. Precision falls to 6 divided by 8, which is 0.75. Raise the threshold to 0.7 instead and only A, B and C are called yes. Precision is then 1.0, and recall is 3 divided by 6, which is 0.5.

| Threshold | TP | FP | FN | TN | Accuracy | Precision | Recall |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0.7 | 3 | 0 | 3 | 4 | 0.7 | 1.0 | 0.5 |
| 0.5 | 4 | 1 | 2 | 3 | 0.7 | 0.8 | 0.67 |
| 0.3 | 6 | 2 | 0 | 2 | 0.8 | 0.75 | 1.0 |

The model did not change. Only the cut-off moved. A low threshold finds more real positives and raises more false alarms. A high threshold does the opposite. You choose the threshold from the cost of each mistake, which is a business or medical question, not a mathematical one.

### In scikit-learn

The code fits logistic regression to the 5 houses and prints the probability for a new 90 square metre house. The method predict_proba returns 2 numbers per house, the probability of no and the probability of yes, so the code takes the second one. The coefficients you get are close to the hand values but not the same, because scikit-learn adds a small penalty on large coefficients by default. The last lesson in this module explains that penalty.

:::code
lang: python
file: quick_sale.py
from sklearn.linear_model import LogisticRegression

sizes = [[40], [60], [80], [100], [120]]
quick = [1, 1, 1, 0, 0]

model = LogisticRegression().fit(sizes, quick)
print("coefficient:", model.coef_[0][0], "intercept:", model.intercept_[0])
print("p(quick) for 90 m2:", model.predict_proba([[90]])[0][1])
print("prediction for 90 m2:", model.predict([[90]])[0])
:::

The second file scores the 10 test houses. The metric functions take the real answers first and the predictions second, the same order as in the last lesson. The predictions come from comparing each probability with the threshold.

:::code
lang: python
file: scores.py
from sklearn.metrics import confusion_matrix, accuracy_score, precision_score, recall_score

probs = [0.92, 0.85, 0.71, 0.64, 0.55, 0.45, 0.38, 0.33, 0.20, 0.08]
real = [1, 1, 1, 0, 1, 1, 1, 0, 0, 0]

for threshold in [0.7, 0.5, 0.3]:
    pred = [1 if p >= threshold else 0 for p in probs]
    tn, fp, fn, tp = confusion_matrix(real, pred).ravel()
    print("threshold", threshold, "TP", tp, "FP", fp, "FN", fn, "TN", tn)
    print("  accuracy", accuracy_score(real, pred))
    print("  precision", round(precision_score(real, pred), 2))
    print("  recall", round(recall_score(real, pred), 2))
:::

:::code
lang: text
threshold 0.7 TP 3 FP 0 FN 3 TN 4
  accuracy 0.7
  precision 1.0
  recall 0.5
threshold 0.5 TP 4 FP 1 FN 2 TN 3
  accuracy 0.7
  precision 0.8
  recall 0.67
threshold 0.3 TP 6 FP 2 FN 0 TN 2
  accuracy 0.8
  precision 0.75
  recall 1.0
:::

The output matches the table you built by hand. Note the order of the counts. The function confusion_matrix lists them as TN, FP, FN, TP when you flatten the table with ravel, so the code unpacks them in that order.

## Try it

:::exercise
title: Sigmoid by hand
task: Use paper and a calculator. A spam model gives an email the score z = 2. Compute e to the power minus 2, then the sigmoid. Decide the answer at threshold 0.5 and at threshold 0.9. Then repeat for z = -1.
hint: e to the power minus 2 is 1 divided by e squared, and e squared is about 7.39. For z = -1, e to the power 1 is about 2.718.
lang: text
solution:
z = 2: e^-2 = 1 / 7.39 = 0.135
p = 1 / (1 + 0.135) = 0.881
threshold 0.5: spam. threshold 0.9: not spam.

z = -1: e^1 = 2.718
p = 1 / (1 + 2.718) = 0.269
threshold 0.5: not spam. threshold 0.9: not spam.
:::

:::exercise
title: Fill in a confusion matrix
task: A test of 20 emails has 8 real spam. The filter marks 9 emails as spam, and 6 of those really are spam. Fill in TP, FP, FN and TN. Compute accuracy, precision and recall. Then say which score a user who hates losing real mail cares about most.
hint: TP is 6. FP is the marked emails that are not spam. FN is the real spam the filter missed. TN is whatever is left of the 20.
lang: text
solution:
TP = 6
FP = 9 - 6 = 3
FN = 8 - 6 = 2
TN = 20 - 6 - 3 - 2 = 9
accuracy = (6 + 9) / 20 = 0.75
precision = 6 / 9 = 0.67
recall = 6 / 8 = 0.75
A user who hates losing real mail cares about precision: 3 of the 9 flagged emails were real.
:::

## Common mistakes

- Mistake: you use LinearRegression for a yes-or-no label and get predictions like 1.3 and -0.2. Fix: use LogisticRegression, whose sigmoid keeps every output between 0 and 1.
- Mistake: you report 99 percent accuracy on a data set where 99 percent of answers are no. Fix: report precision and recall too; a model that always says no has 0 recall.
- Mistake: you treat the threshold 0.5 as part of the model. Fix: the model gives probabilities; the threshold is your decision, set by the cost of misses versus false alarms.
- Mistake: you read predict_proba and take the first number as the probability of yes. Fix: the columns are in category order, so for labels 0 and 1 the probability of 1 is the second number.
- Mistake: you mix up precision and recall. Fix: precision starts from what the model said yes to; recall starts from what really was yes.

## Check your understanding

:::quiz
title: Check: classification
q: The score z for a house is 0. What probability does the sigmoid give?
- 0
* 0.5
- 1
why: e to the power 0 is 1, so p is 1 divided by 1 plus 1.
q: A model gives a probability of 0.45 and the threshold is 0.5. The house did sell quickly. Which outcome is this?
- True positive
- False positive
* False negative
- True negative
why: The real answer was yes and the model said no, which is a miss, a false negative.
q: A test has TP 30, FP 10, FN 20 and TN 40. What is the recall?
- 0.75
* 0.6
- 0.7
- 0.4
why: Recall is TP divided by TP plus FN: 30 divided by 50 is 0.6.
q: You lower the threshold from 0.5 to 0.2. What usually happens?
- Precision rises and recall falls
* Recall rises and precision falls
- Both rise
why: More houses are called yes, so more real positives are found but more false alarms appear.
q: A hospital screens for a rare disease and a missed case is very costly. Which score matters most?
- Accuracy
- Precision
* Recall
why: Recall counts the share of real cases the test finds; a low recall means sick people are sent home.
q: Why does logistic regression need gradient descent when linear regression did not?
- Because it has more coefficients
* Because no one-step formula gives the coefficients that minimise cross-entropy
- Because scikit-learn does not support formulas
why: The sigmoid makes the loss non-linear in the coefficients, so the computer must search for the minimum.
:::

## Go further

The scikit-learn user guide section on logistic regression in the links explains the penalty option that makes the coefficients differ from the hand values. The classification metrics page defines every score, including the F1 score that combines precision and recall into one number. The Wikipedia page on the confusion matrix has a large table of every derived score. The next lesson, [Decision trees, random forests and nearest neighbours](/courses/ai-foundations/first-models/trees-and-neighbours), classifies and predicts prices with three models that use no formula at all.
`,
      links: [
        { label: 'Logistic regression (scikit-learn user guide)', url: 'https://scikit-learn.org/stable/modules/linear_model.html#logistic-regression', kind: 'docs' },
        { label: 'Classification metrics (scikit-learn user guide)', url: 'https://scikit-learn.org/stable/modules/model_evaluation.html#classification-metrics', kind: 'docs' },
        { label: 'Confusion matrix (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Confusion_matrix', kind: 'article' },
        { label: 'Logistic Regression, Clearly Explained (StatQuest)', url: 'https://www.youtube.com/watch?v=yIYKR4sgzI8', kind: 'video' },
      ],
    },
    {
      slug: 'trees-and-neighbours',
      title: 'Decision trees, random forests and nearest neighbours',
      summary: 'After this lesson you can price a house with a decision tree, a random forest and k-nearest neighbours, explain how each one learns without calculus, and run all three in scikit-learn.',
      minutes: 24,
      objectives: [
        'Explain how a decision tree chooses its questions and compute the best first split for the 5 houses by hand.',
        'Predict a price with k-nearest neighbours by hand for k = 1, 2 and 3.',
        'Explain why a random forest averages many trees and what the randomness is.',
        'Choose between a line, a tree, a forest and nearest neighbours for a given table of data.',
        'Run DecisionTreeRegressor, RandomForestRegressor and KNeighborsRegressor in scikit-learn.',
      ],
      keyTerms: ['decision tree', 'random forest', 'k-nearest neighbours', 'hyperparameter', 'euclidean distance', 'regression', 'classification'],
      before: [
        { label: 'Measuring error and splitting data', to: '/courses/ai-foundations/first-models/measuring-error' },
        { label: 'Adding, scaling and measuring vectors', to: '/courses/math-from-zero/vectors-and-matrices/vector-arithmetic' },
      ],
      body: `
## What this lesson covers

This lesson teaches three models that learn without any slope, gradient or formula. A decision tree asks a chain of yes-or-no questions. A random forest asks many trees and averages their answers. k-nearest neighbours looks up the most similar examples and copies them. You price a 95 square metre house with each one by hand, using the same 5 houses as before. At the end you can run all three in scikit-learn and say which one to try first on a new table of data.

## Why it matters

Not every problem is a straight line. House prices may jump at a certain size, flatten out, or depend on combinations of features that no line can express. Trees and neighbours follow any shape the data takes. For tables of numbers and categories, a random forest is still the model most practitioners try first in 2026, before any neural network. It needs almost no preparation and is hard to break. These models also make the ideas of the next lesson concrete. A deep tree and a 1-nearest-neighbour model are the clearest examples of a model that memorises. The next lesson, [Overfitting, underfitting and cross-validation](/courses/ai-foundations/first-models/overfitting-and-generalisation), shows what that costs.

:::video
id: _L39rN6gz7Y
why: Watch the first 10 minutes. StatQuest builds a classification tree one question at a time and shows how the training data decides each question. Watch for the word impurity: it is the classification version of the squared error used in this lesson.
:::

## The idea with an example

> **Analogy.** An estate agent prices a house in two ways. The first is a flowchart on her wall: is it under 70 square metres? Then about 130 thousand. Otherwise, is it under 110? Then about 235. Otherwise about 310. That flowchart is a decision tree. The second way is comparables: she finds the two or three recent sales most like this house and averages their prices. That is k-nearest neighbours. When she is unsure, she phones ten colleagues who each have their own flowchart, and she averages their answers. That is a random forest.

The 5 houses again, with sizes 40, 60, 80, 100 and 120 square metres and prices 110, 150, 220, 250 and 310 thousand pounds. The new house to price is 95 square metres. The line from the first lesson says 2.5 times 95 + 8, which is 245.5. Now watch the three new models price the same house.

### A decision tree

A decision tree is a set of questions arranged like an upside-down tree. The top question is the root. Each answer leads to another question or to a leaf, which holds a prediction. For a number, the prediction in a leaf is the mean of the training houses that landed there. This tree has 2 levels of questions and 3 leaves.

:::flow
title: A depth-2 decision tree for house prices
Size at most 70? -> Leaf A: yes, predict 130
Size at most 70? -> Size at most 110?: no
Size at most 110? -> Leaf B: yes, predict 235
Size at most 110? -> Leaf C: no, predict 310
:::

Leaf A holds houses 1 and 2, and the mean of 110 and 150 is 130. Leaf B holds houses 3 and 4, and the mean of 220 and 250 is 235. Leaf C holds house 5 alone, so it predicts 310. The 95 square metre house answers no to the first question and yes to the second, so it lands in leaf B and gets 235.

### k-nearest neighbours

k-nearest neighbours (kNN) has no training step at all. The model is the table. To predict, it measures the distance from the new house to every training house, keeps the k closest, and averages their prices. The letter k is a number you choose, such as 1, 2 or 3. With one feature the distance is the difference in size. With several features it is the [Euclidean distance](/courses/math-from-zero/vectors-and-matrices/vector-arithmetic) between the feature vectors.

| Training house | Size | Distance from 95 | Price |
| --- | --- | --- | --- |
| 4 | 100 | 5 | 250 |
| 3 | 80 | 15 | 220 |
| 5 | 120 | 25 | 310 |
| 2 | 60 | 35 | 150 |
| 1 | 40 | 55 | 110 |

With k = 1 the answer is the closest house alone: 250. With k = 2 it is the mean of 250 and 220, which is 235. With k = 3 it is the mean of 250, 220 and 310, which is 260. With k = 5 it is the mean of all 5 prices, 208, for every house whatever its size. Small k copies the nearest example; large k smooths everything to the average.

Press Next to run both models on the 95 square metre house.

:::scenario
title: Price a 95 m2 house with a tree and with neighbours
state: house=95 m2, tree=?, knn=?
step: Tree, root question: is 95 at most 70? No. Go right.
state: tree path=right
step: Tree, second question: is 95 at most 110? Yes. Land in leaf B.
state: tree path=right then left, leaf=B
step: Leaf B holds houses 3 and 4 with prices 220 and 250. The mean is 235. The tree predicts 235.
state: tree=235
step: Neighbours: compute the distance from 95 to each size. 5, 15, 25, 35 and 55.
state: distances=5 15 25 35 55
step: Keep the k = 2 closest: house 4 at distance 5 and house 3 at distance 15.
state: neighbours=house 4 and house 3
step: Average their prices: (250 + 220) / 2 = 235. kNN with k = 2 predicts 235.
state: knn=235
step: Compare: the line said 245.5, the tree 235 and kNN 235. All three agree within 11 thousand pounds.
state: line=245.5, tree=235, knn=235
:::

## How it works

### How a tree chooses its questions

Training a tree is a search for the best question at each step. For one feature, the only questions are "is size at most some cut?". The only cuts that matter lie between neighbouring sizes: 50, 70, 90 and 110. For each cut the tree splits the houses into two groups and predicts the mean in each group. Then it adds up the squared residuals of both groups. It keeps the cut with the smallest total. This is the same squared error as linear regression, applied to a split instead of a line.

:::anim
title: How a tree picks its first question
axes ax @ 90,50 size: 520x400 x: 20,130 y: 60,340 xlabel: "size in m2" ylabel: "price in thousand pounds"
dot h1 on ax @ 40,110 color: blue
dot h2 on ax @ 60,150 color: blue
dot h3 on ax @ 80,220 color: blue
dot h4 on ax @ 100,250 color: blue
dot h5 on ax @ 120,310 color: blue
line c50 on ax from 50,60 to 50,340 color: yellow dashed label: "cut 50"
line c70 on ax from 70,60 to 70,340 color: yellow dashed label: "cut 70"
line c90 on ax from 90,60 to 90,340 color: yellow dashed label: "cut 90"
line c110 on ax from 110,60 to 110,340 color: yellow dashed label: "cut 110"
line leafA on ax from 20,130 to 70,130 color: green label: "130"
line leafB on ax from 70,235 to 110,235 color: green label: "235"
line leafC on ax from 110,310 to 130,310 color: green label: "310"
num lmean = 0 @ 790,130 prefix: "left mean = " digits: 1 size: 22 color: green
num rmean = 0 @ 790,175 prefix: "right mean = " digits: 1 size: 22 color: purple
num total = 0 @ 790,260 prefix: "squared error = " size: 24 color: yellow
text best "smallest at cut 70" @ 790,320 size: 18 color: yellow
text leaves "leaf means 130 / 235 / 310" @ 790,400 size: 18 color: green

step: A tree asks one question: is the size at most a cut? Here are the 5 houses it must split.
  show ax, h1, h2, h3, h4, h5
step: Try the cut at 50. The left side predicts its mean, 110. The right side predicts 232.5.
  draw c50
  color h1 green
  color h2, h3, h4, h5 purple
  show lmean, rmean
  count lmean -> 110
  & count rmean -> 232.5
step: Score the cut: add the squared residuals of both sides. 0 plus 13275 is 13275.
  show total
  count total -> 13275
step: Move the cut to 70. The means become 130 and 260, and the score falls to 5000.
  hide c50
  draw c70
  color h2 green
  count lmean -> 130
  & count rmean -> 260
  & count total -> 5000
step: Move it to 90. The means are 160 and 280, and the score rises to 8000. Worse.
  hide c70
  draw c90
  color h3 green
  count lmean -> 160
  & count rmean -> 280
  & count total -> 8000
step: Move it to 110. The score rises again, to 12275. Worse still.
  hide c90
  draw c110
  color h4 green
  count lmean -> 182.5
  & count rmean -> 310
  & count total -> 12275
step: The cut at 70 has the smallest score, so the root question is: size at most 70?
  hide c110
  draw c70
  color h3, h4 purple
  count lmean -> 130
  & count rmean -> 260
  & count total -> 5000
  show best
step: The tree repeats the search on the right and cuts at 110. Three leaves predict 130, 235 and 310.
  draw c110
  draw leafA, leafB, leafC
  show leaves
:::

| Cut | Left prices | Right prices | Squared residuals, left plus right |
| --- | --- | --- | --- |
| 50 | 110 | 150, 220, 250, 310 | 0 + 13275 = 13275 |
| 70 | 110, 150 | 220, 250, 310 | 800 + 4200 = 5000 |
| 90 | 110, 150, 220 | 250, 310 | 6200 + 1800 = 8000 |
| 110 | 110, 150, 220, 250 | 310 | 12275 + 0 = 12275 |

Check one row. For the cut at 70, the left group 110 and 150 has mean 130 and residuals -20 and 20, whose squares add to 800. The right group 220, 250 and 310 has mean 260 and residuals -40, -10 and 50. Their squares add to 1600 + 100 + 2500, which is 4200. The total is 5000, the smallest in the table, so the root question is "size at most 70?". The tree then repeats the search inside each group. On the right group the cut at 110 gives 450 and the cut at 90 gives 1800. So the second question is "size at most 110?". With a third level the tree would split every house into its own leaf and have 0 training error. The depth is a setting you choose before training, called a hyperparameter, and the next lesson shows why 0 training error is a warning sign.

For a category label, the tree does the same search with a different score. It measures how mixed each group is, with a number called Gini impurity, and picks the cut that makes the groups purest. Take the quick-sale labels from the last lesson. The cut at 90 puts all 3 yes houses on the left and both no houses on the right, so one question is enough.

### Why a forest beats a tree

One deep tree follows its training houses too closely. A random forest grows many trees, often 100, and makes each one different in 2 ways. First, each tree trains on a random sample of the houses, drawn with replacement, so some houses appear twice and some not at all. Second, at each question each tree may look at only a random subset of the features. The forest then averages the predictions of all trees for a number, or takes a vote for a category. Each tree still memorises, but they memorise different quirks, and the quirks cancel in the average. The pattern that all trees share survives.

:::arch
title: A random forest of 3 trees
layer: Data | Random sample 1, Random sample 2, Random sample 3
layer: Trees | Tree 1, Tree 2, Tree 3
layer: Answer | Average
flow: Random sample 1 -> Tree 1 -> Average
note: Random sample 1 = 5 houses drawn with replacement, so some repeat
:::

### Which model when

| Model | Needs calculus | Needs features on the same scale | You can read it | Follows curved patterns | Memorises easily |
| --- | --- | --- | --- | --- | --- |
| Linear regression | no, a formula | no | yes, the coefficients | no | rarely |
| Decision tree | no | no | yes, the questions | yes | yes, when deep |
| Random forest | no | no | hard, 100 trees | yes | less than a tree |
| k-nearest neighbours | no | yes | partly, the neighbours | yes | yes, when k is small |

Two rows need a note. Nearest neighbours measures distance, so a feature in pounds and a feature in square metres must be rescaled first, or the pound differences swamp everything. Trees do not care about scale, because a question like "price at most 200000?" works whatever the units. Forests are the usual first try for a table; a line is the usual first try when you must explain the model to someone.

### In scikit-learn

The three models follow the same create, fit, predict pattern as the line. The settings in brackets are hyperparameters: max_depth is the number of question levels, n_neighbors is k, and n_estimators is the number of trees. random_state fixes the forest's random draws so that your output repeats.

:::code
lang: python
file: three_models.py
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.neighbors import KNeighborsRegressor

sizes = [[40], [60], [80], [100], [120]]
prices = [110, 150, 220, 250, 310]
new_house = [[95]]

tree = DecisionTreeRegressor(max_depth=2).fit(sizes, prices)
knn = KNeighborsRegressor(n_neighbors=2).fit(sizes, prices)
forest = RandomForestRegressor(n_estimators=100, random_state=0).fit(sizes, prices)

print("tree:", tree.predict(new_house)[0])
print("knn k=2:", knn.predict(new_house)[0])
print("forest:", forest.predict(new_house)[0])
:::

:::code
lang: text
tree: 235.0
knn k=2: 235.0
forest: 2xx.x   (a value in the 200s; it depends on the random draws)
:::

The tree and kNN give exactly the hand values. The forest gives a number near them that changes if you change random_state, because each tree saw a different sample. You can print a tree as text to check its questions. The code below fits a classification tree on the quick-sale labels and prints it. In the output, feature_0 means the first column, which is size, and class 1 means yes.

:::code
lang: python
file: print_tree.py
from sklearn.tree import DecisionTreeClassifier, export_text

sizes = [[40], [60], [80], [100], [120]]
quick = [1, 1, 1, 0, 0]

tree = DecisionTreeClassifier().fit(sizes, quick)
print(export_text(tree))
:::

:::code
lang: text
|--- feature_0 <= 90.00
|   |--- class: 1
|--- feature_0 >  90.00
|   |--- class: 0
:::

One question at 90, the midpoint between 80 and 100, separates the yes houses from the no houses, as the hand analysis predicted.

## Try it

:::exercise
title: Neighbours by hand
task: Use the 5 houses. Price a 50 square metre house with k-nearest neighbours for k = 1, k = 2 and k = 3. Then price it with the depth-2 tree from the lesson. Write all four answers in thousand pounds.
hint: The distances from 50 are 10, 10, 30, 50 and 70. Two houses tie for closest; take both.
lang: text
solution:
Distances: house 1 (40) = 10, house 2 (60) = 10, house 3 (80) = 30, house 4 (100) = 50, house 5 (120) = 70
k = 1: a tie between house 1 and house 2; take either, 110 or 150 (scikit-learn picks one of them)
k = 2: (110 + 150) / 2 = 130
k = 3: (110 + 150 + 220) / 3 = 160
Tree: 50 is at most 70, so leaf A, 130
:::

:::exercise
title: Change the depth and k
task: Edit three_models.py. Set max_depth=1 and then max_depth=5, and n_neighbors=1 and then n_neighbors=5. Run after each change and write down the prediction for 95 m2. Explain in one sentence why max_depth=5 and n_neighbors=1 give the same answer.
hint: A depth-5 tree on 5 houses puts every house in its own leaf. k = 1 copies the single closest house.
lang: text
solution:
max_depth=1: 260  (one question, size at most 70; right leaf mean of 220, 250, 310)
max_depth=5: 250  (every house in its own leaf; 95 lands with house 4)
n_neighbors=1: 250  (the closest house, 100 m2)
n_neighbors=5: 208  (the mean of all five prices)
Both the deep tree and k = 1 return the price of the single nearest training house,
because both have memorised the table.
:::

## Common mistakes

- Mistake: you grow a tree with no depth limit, get 0 training error, and celebrate. Fix: a tree with one house per leaf has memorised; set max_depth or a minimum leaf size and check the test error.
- Mistake: you run kNN on size in square metres and price in pounds together and get nonsense neighbours. Fix: scale the features to the same range first, with StandardScaler, before measuring distance.
- Mistake: you pick k = 1 because it fits the training data perfectly. Fix: k = 1 copies noise; try several k and keep the one with the best test error.
- Mistake: you expect the forest to print the same number on every machine. Fix: set random_state; without it the random samples differ on every run.
- Mistake: you read a tree's first question as the most important fact about houses. Fix: it is the question that reduced the error most on this training set; a slightly different sample may choose a different root.

## Check your understanding

:::quiz
title: Check: trees and neighbours
q: In the depth-2 tree, which leaf does a 115 square metre house reach, and what is the prediction?
- Leaf A, 130
- Leaf B, 235
* Leaf C, 310
why: 115 is more than 70 and more than 110, so it answers no twice and lands in leaf C.
q: With k = 3, what does kNN predict for a 65 square metre house?
- 130
* 160
- 208
- 235
why: The closest three are 60, 80 and 40, with prices 150, 220 and 110, whose mean is 160.
q: How does a regression tree choose its root question?
- It picks the feature with the largest values
* It tries every cut and keeps the one with the smallest total squared residual
- It asks about the mean of the label
why: Each cut splits the houses into two groups; the tree keeps the split whose group means fit best.
q: What are the two sources of randomness in a random forest?
- Random labels and random depths
* A random sample of examples for each tree and a random subset of features at each question
- A random threshold and a random learning rate
why: Each tree sees a different draw of houses and features, so their mistakes differ and cancel in the average.
q: Which model needs its features scaled to similar ranges before use?
- Decision tree
- Random forest
* k-nearest neighbours
why: kNN measures distance, and a feature with large numbers would dominate the distance.
q: A colleague wants a model she can explain to a client in one minute. Which is the best fit?
* A depth-2 decision tree
- A random forest of 500 trees
- kNN with k = 7
why: A shallow tree is a flowchart of 2 questions that anyone can follow.
:::

## Go further

The scikit-learn user guide pages on decision trees, ensembles and nearest neighbours in the links explain every setting and show plots of the fitted models. The Wikipedia page on random forests has the history and the reason the averaging works. The next lesson, [Overfitting, underfitting and cross-validation](/courses/ai-foundations/first-models/overfitting-and-generalisation), names the problem you saw with deep trees and k = 1. It also gives the method to pick depth and k honestly.
`,
      links: [
        { label: 'Decision trees (scikit-learn user guide)', url: 'https://scikit-learn.org/stable/modules/tree.html', kind: 'docs' },
        { label: 'Ensembles: random forests (scikit-learn user guide)', url: 'https://scikit-learn.org/stable/modules/ensemble.html', kind: 'docs' },
        { label: 'Nearest neighbors (scikit-learn user guide)', url: 'https://scikit-learn.org/stable/modules/neighbors.html', kind: 'docs' },
        { label: 'Random forest (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Random_forest', kind: 'article' },
        { label: 'Decision and Classification Trees, Clearly Explained (StatQuest)', url: 'https://www.youtube.com/watch?v=_L39rN6gz7Y', kind: 'video' },
      ],
    },
    {
      slug: 'overfitting-and-generalisation',
      title: 'Overfitting, underfitting and cross-validation',
      summary: 'After this lesson you can tell a memorising model from a learning one by comparing training and test error, run 5-fold cross-validation, and say what regularisation does.',
      minutes: 24,
      objectives: [
        'Explain overfitting and underfitting with the memorising student analogy and with the 5 houses.',
        'Diagnose a model from its training error and test error.',
        'Compute leave-one-out cross-validation for the straight line by hand and run cross_val_score in scikit-learn.',
        'Explain in one paragraph what regularisation adds to the loss and why it helps.',
      ],
      keyTerms: ['overfitting', 'underfitting', 'generalisation', 'cross-validation', 'regularisation', 'hyperparameter', 'test set'],
      before: [
        { label: 'Measuring error and splitting data', to: '/courses/ai-foundations/first-models/measuring-error' },
        { label: 'Decision trees, random forests and nearest neighbours', to: '/courses/ai-foundations/first-models/trees-and-neighbours' },
      ],
      body: `
## What this lesson covers

This lesson names the central danger of machine learning: a model that scores perfectly on its training data and fails on new data. That is overfitting. Its opposite, a model too simple to find the pattern, is underfitting. You see both on the 5 houses by fitting three models: a flat line, the straight line, and a curve that passes through every point. You learn to diagnose each case from two numbers, the training error and the test error. Then you learn cross-validation, which gives a steadier test number than one split, and regularisation, which holds a model back from memorising. At the end you can choose a model's settings without ever touching the test set.

## Why it matters

Everything you build later faces this trade-off. A neural network with millions of weights can memorise its whole training set. A fine-tuned language model can memorise its 200 examples and forget how to talk. The question is always the same: does the model generalise, meaning does it work on examples it has not seen? The tools in this lesson, the train-test gap, cross-validation and regularisation, are how you answer it. This lesson closes the module. The next module, [A neuron](/courses/ai-foundations/neural-networks/a-neuron), starts the neural networks that make the trade-off sharper.

:::video
id: EuBBz3bI-aA
why: Watch all 6 minutes. StatQuest fits a straight line and a wiggly curve to the same points and shows the curve win on training data and lose on test data. The video calls the two failures bias and variance; this lesson calls them underfitting and overfitting.
:::

## The idea with an example

> **Analogy.** Three students prepare for a mathematics test with the same 5 practice problems. The first student barely reads them and answers every question with the class average. The second works out the method behind the problems. The third memorises the 5 answers word for word. On the practice problems the third student scores 100 percent and the second scores 95. On the real test, with new problems, the second student scores 90, the first scores 20, and the third scores 30. The first student underfitted. The third overfitted. Only the second generalised.

:::anim
title: Three models learn 5 houses, then meet 2 new houses
axes ax @ 90,50 size: 520x400 x: 20,130 y: 60,420 xlabel: "size in m2" ylabel: "price in thousand pounds"
dot h1 on ax @ 40,110 color: blue
dot h2 on ax @ 60,150 color: blue
dot h3 on ax @ 80,220 color: blue
dot h4 on ax @ 100,250 color: blue
dot h5 on ax @ 120,310 color: blue
curve meanm on ax = 208 color: grey label: "mean: 208"
curve linem on ax = 2.5*x + 8 color: yellow label: "line"
curve poly on ax = 110 + 40*(x/20-2) + 15*(x/20-2)*(x/20-3) - 35/3*(x/20-2)*(x/20-3)*(x/20-4) + 35/6*(x/20-2)*(x/20-3)*(x/20-4)*(x/20-5) color: red label: "degree-4 curve"
dot t1 on ax @ 50,140 r: 8 color: green label: "new: 50 m2 sold 140"
dot t2 on ax @ 110,290 r: 8 color: green label: "new: 110 m2 sold 290"
line g1 on ax from 50,116 to 50,140 color: red label: "24"
line g2 on ax from 110,266 to 110,290 color: red label: "24"
dot ball on ax @ 50,116 r: 9 color: red
text cur "model: mean" @ 790,120 size: 20
num tr = 0 @ 790,180 prefix: "training MSE = " size: 22
num te = 0 @ 790,230 prefix: "test MSE = " size: 22 color: green
text diag "underfitting" @ 790,300 size: 22 color: yellow
num pv = 116 @ 790,400 prefix: "curve says " size: 22 color: red

step: The same 5 houses. Three models try to learn the pattern: a mean, a line and a degree-4 curve.
  show ax, h1, h2, h3, h4, h5
step: The mean model predicts 208 for every house. Training MSE 5056: too simple to see the pattern.
  draw meanm
  show cur, tr, diag
  count tr -> 5056
step: The straight line follows the trend. Its training MSE is 56.
  label cur "model: line"
  draw linem
  count tr -> 56
  label diag "fits well"
step: The degree-4 curve passes through all 5 points exactly. Training MSE 0. It looks perfect.
  label cur "model: curve"
  dim meanm, linem
  draw poly (2s)
  count tr -> 0
  label diag "perfect?"
step: Then 2 new houses sell: 50 square metres for 140, and 110 square metres for 290.
  show t1, t2
  pulse t1, t2
step: The line misses each by 7. Test MSE 49, about the same as training: it generalises.
  label cur "model: line"
  restore linem
  dim poly
  show te
  count tr -> 56
  & count te -> 49
  label diag "generalises"
step: The curve misses each by 24. Test MSE 557, eleven times the line. It memorised: overfitting.
  label cur "model: curve"
  restore poly
  dim linem
  draw g1, g2
  count tr -> 0
  & count te -> 557
  label diag "overfitting"
step: Ask the curve about a 20 square metre flat: it climbs to 310, more than a house 3 times bigger.
  show ball, pv
  walk ball along poly from 50 to 20 (2s)
  & count pv -> 310 (2s)
:::

Now the three students become three models for the 5 houses. The data is the same: sizes 40, 60, 80, 100 and 120 square metres, prices 110, 150, 220, 250 and 310 thousand pounds.

The first model ignores the size and predicts the mean price, 208, for every house. Its residuals are -98, -58, 12, 42 and 102. Their squares add to 25280, and the training mean squared error (MSE) is 25280 divided by 5, which is 5056.

The second model is the straight line from the first lesson, price = 2.5 times size + 8. Its training MSE is 56.

The third model is a curve with 5 numbers instead of 2. It is a polynomial of degree 4, which is a sum of terms up to size to the power 4. A degree-4 curve can pass exactly through any 5 points, so this model has a training MSE of exactly 0. It looks perfect.

Then 2 new houses sell. A 50 square metre house goes for 140, and a 110 square metre house goes for 290. These are the test set. Ask each model to price them.

| Model | Numbers learned | Training MSE | Prediction for 50 m2 | Prediction for 110 m2 | Test MSE |
| --- | --- | --- | --- | --- | --- |
| Mean | 1 | 5056 | 208 | 208 | 5674 |
| Straight line | 2 | 56 | 133 | 283 | 49 |
| Degree-4 curve | 5 | 0 | 116 | 266 | 557 |

The line misses each new house by 7, and its test MSE of 49 is about the same as its training MSE. The mean model is terrible on both sets. The curve was perfect on the training set. It is now off by 24 on each new house, and its test MSE is 11 times worse than the line. Ask the curve about a 20 square metre flat and it says 310, more than a house three times the size. The curve did not learn that bigger houses cost more. It learned the exact 5 points and bent itself wildly between and beyond them.

:::bars
title: Test MSE on the 2 new houses
unit: thousand pounds squared
Mean model: 5674
Straight line: 49
Degree-4 curve: 557
:::

Press Next to diagnose each model from its two numbers.

:::scenario
title: Diagnose three models from training and test error
state: model=mean, train MSE=5056, test MSE=5674
step: The mean model. Training error is high and test error is high. The model is too simple to see the pattern. Diagnosis: underfitting.
state: diagnosis=underfitting
step: The straight line. Training error 56 is low and test error 49 is about the same. The pattern it learned holds on new houses. Diagnosis: a good fit that generalises.
state: model=line, train MSE=56, test MSE=49, diagnosis=generalises
step: The degree-4 curve. Training error 0 is the lowest possible, but test error 557 is 11 times worse than the line. The model memorised the training points. Diagnosis: overfitting.
state: model=curve, train MSE=0, test MSE=557, diagnosis=overfitting
step: The rule: compare the two numbers. Both high means underfitting. A low training error with a much higher test error means overfitting. Both low and close means the model generalises.
state: rule=compare training error with test error
:::

## How it works

### The diagnosis in one picture

The flow turns the rule from the scenario into a procedure you run on any model.

:::flow
title: Diagnose a model from two errors
Fit the model -> Training error: measure on training set
Training error -> Test error: measure on test set
Test error -> Underfitting: both high
Test error -> Overfitting: test far above training
Test error -> Generalises: both low and close
Underfitting -> Bigger model: add features or depth
Overfitting -> Simpler model: fewer numbers, regularise, more data
:::

Model capacity is the dial. A model with more learned numbers, more tree depth, or a smaller k has more capacity and can fit more shapes. Turn the dial up from the mean model to the line and both errors fall. Turn it up further to the curve and the training error keeps falling, but the test error turns around and rises. The best setting is at the bottom of the test error curve. You can only see that curve by measuring on data the model did not train on.

| Setting | Low capacity, underfits | High capacity, overfits |
| --- | --- | --- |
| Polynomial | degree 0, the mean | degree 4 on 5 points |
| Decision tree | max_depth 1 | no depth limit |
| k-nearest neighbours | k equal to the number of examples | k = 1 |
| Random forest | very few trees | rarely overfits badly |
| Neural network | 1 small layer | many wide layers, trained for long |

The cures for overfitting come in 3 kinds. Get more data, because 500 houses leave far less room for a curve to wiggle between points than 5 do. Lower the capacity, by choosing a simpler model or a smaller depth or a larger k. Or regularise, which keeps the capacity but makes the model pay for using it.

### Cross-validation: a steadier test

In [Measuring error and splitting data](/courses/ai-foundations/first-models/measuring-error) you hid one house and got a test error of 225 for the line. In the exercise you hid a different house and got 25. One split with one test house swings by a factor of 9. Cross-validation fixes this by using every house as a test house in turn. Split the data into k equal folds. Train on all folds but one, test on the held-out fold, and record the error. Repeat with each fold held out. Average the k errors. With 5 houses and 5 folds, each fold is 1 house, and this special case is called leave-one-out.

:::matrix
title: Which house is the test house in each of 5 folds
cols: house 1, house 2, house 3, house 4, house 5
fold 1: 1, 0, 0, 0, 0
fold 2: 0, 1, 0, 0, 0
fold 3: 0, 0, 1, 0, 0
fold 4: 0, 0, 0, 1, 0
fold 5: 0, 0, 0, 0, 1
:::

Each fold fits a slightly different line to its 4 training houses, with the means method from the first lesson. The table lists the five lines and the five test errors; the fold that hides house 3 is the one you computed by hand before.

| Fold | Hidden house | Training line | Prediction | Real price | Squared error |
| --- | --- | --- | --- | --- | --- |
| 1 | 40 m2 | 2.55 x size + 3.0 | 105.0 | 110 | 25.0 |
| 2 | 60 m2 | 2.44 x size + 14.9 | 161.4 | 150 | 130.6 |
| 3 | 80 m2 | 2.5 x size + 5.0 | 205.0 | 220 | 225.0 |
| 4 | 100 m2 | 2.56 x size + 5.7 | 261.4 | 250 | 130.6 |
| 5 | 120 m2 | 2.45 x size + 11.0 | 305.0 | 310 | 25.0 |

The cross-validated MSE is the mean of the 5 squared errors. The sum 25 + 130.6 + 225 + 130.6 + 25 is 536.2, and 536.2 divided by 5 is 107.2. That number is a fairer estimate of how the line does on a new house than any single fold. It also sits between the lucky split of 25 and the unlucky split of 225, as an average should. Cross-validation costs k fits instead of 1. That is fine for a line and expensive for a large network. So practitioners use 5 or 10 folds and keep leave-one-out for tiny data sets.

The main use of cross-validation is choosing hyperparameters without touching the test set. To pick the depth of a tree, run cross-validation on the training set for depth 1, 2, 3 and 4. Keep the depth with the lowest average error. The test set stays sealed for the final number.

:::video
id: fSytzGwwBVw
why: Watch from 3 minutes to the end. StatQuest shows the folds rotating through the data and explains why the average over folds is more reliable than one split.
:::

:::code
lang: python
file: cross_val.py
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import cross_val_score, KFold

sizes = [[40], [60], [80], [100], [120]]
prices = [110, 150, 220, 250, 310]

folds = KFold(n_splits=5)
scores = cross_val_score(
    LinearRegression(), sizes, prices, cv=folds, scoring="neg_mean_squared_error"
)
print("MSE per fold:", [round(-s, 1) for s in scores])
print("cross-validated MSE:", round(-scores.mean(), 1))
:::

:::code
lang: text
MSE per fold: [25.0, 130.6, 225.0, 130.6, 25.0]
cross-validated MSE: 107.2
:::

scikit-learn reports scores where higher is better, so it gives the negative MSE; the code flips the sign back. KFold with 5 splits and no shuffle holds out the houses in table order, which matches the hand table. The code below checks the curve from the example with NumPy, which scikit-learn installs. The sizes are in tens of square metres. Fitting a degree-4 polynomial to numbers as large as 120 to the power 4 is numerically unstable.

:::code
lang: python
file: curve.py
import numpy as np

sizes = np.array([4, 6, 8, 10, 12])
prices = np.array([110, 150, 220, 250, 310])

curve = np.polyfit(sizes, prices, 4)
for size in [5, 11, 2]:
    print(size * 10, "m2:", round(np.polyval(curve, size), 1))
:::

:::code
lang: text
50 m2: 116.4
110 m2: 266.4
20 m2: 310.0
:::

### Regularisation in one paragraph

Regularisation lets a model keep its capacity but charges a price for using it. Ridge regression, the regularised form of linear regression, minimises the MSE plus a penalty: alpha times the sum of the squared coefficients. In words, the training loss is the usual squared error plus a cost for large coefficients. The curve that passes through all 5 houses needs huge coefficients to bend so sharply, so the penalty pushes it back towards a gentle shape. The number alpha is a hyperparameter: 0 means no penalty and plain least squares, and a large value flattens the model towards the mean. You pick alpha by cross-validation. Lasso is the same idea with the absolute values of the coefficients, and it can set some coefficients to exactly 0, which removes features. Neural networks use the same trick under the name weight decay. Logistic regression in scikit-learn applies a ridge penalty by default. That is why its coefficients in the classification lesson did not match the hand values exactly.

$$\\text{loss} = \\text{MSE} + \\alpha \\sum_j w_j^2$$

In words: the loss is the mean squared error plus alpha times the sum over every coefficient of its square. In scikit-learn, replace LinearRegression() with Ridge(alpha=1.0) and nothing else in your code changes.

## Try it

:::exercise
title: Diagnose from the numbers
task: Four models were trained on the same table. Model A has training RMSE 30 and test RMSE 31. Model B has training RMSE 2 and test RMSE 28. Model C has training RMSE 9 and test RMSE 10. Model D has training RMSE 0 and test RMSE 45. Use paper. Label each one underfitting, overfitting or generalising, and say which model you would ship.
hint: Compare the two numbers for each model. Close and low is good. Close and high is underfitting. A big gap is overfitting.
lang: text
solution:
A: 30 and 31, both high and close: underfitting
B: 2 and 28, large gap: overfitting
C: 9 and 10, both low and close: generalises
D: 0 and 45, largest gap: overfitting, worst of all
Ship model C. It has the lowest test error, which is the only number that predicts real use.
:::

:::exercise
title: Pick k by cross-validation
task: Edit cross_val.py. Replace LinearRegression() with KNeighborsRegressor(n_neighbors=k) from sklearn.neighbors, and run the cross-validation for k = 1, 2, 3 and 4. Print the cross-validated MSE for each k and say which k you would choose. Remember that with 5 houses each fold trains on only 4.
hint: Put the code in a for loop over k. With k = 4 every fold predicts the mean of the 4 training houses.
lang: python
solution:
from sklearn.neighbors import KNeighborsRegressor
from sklearn.model_selection import cross_val_score, KFold

sizes = [[40], [60], [80], [100], [120]]
prices = [110, 150, 220, 250, 310]
folds = KFold(n_splits=5)

for k in [1, 2, 3, 4]:
    scores = cross_val_score(
        KNeighborsRegressor(n_neighbors=k), sizes, prices, cv=folds,
        scoring="neg_mean_squared_error"
    )
    print("k =", k, "cross-validated MSE:", round(-scores.mean(), 1))
# The smallest MSE wins. On these 5 houses the small values of k do best,
# because the prices rise steadily with size and far neighbours mislead.
:::

## Common mistakes

- Mistake: you pick the model with the lowest training error. Fix: training error always favours the biggest model; pick by test error or cross-validated error.
- Mistake: you choose the tree depth by watching the test error and then report that same test error. Fix: choose depth by cross-validation on the training set; use the test set once at the end.
- Mistake: you see a training error of exactly 0 and think the model is finished. Fix: 0 training error on a small data set almost always means memorising; check the test error.
- Mistake: you fix overfitting by training the same model longer. Fix: longer training usually makes memorising worse; reduce capacity, regularise, or add data.
- Mistake: you set the regularisation strength alpha so high that the model predicts the mean for everything. Fix: alpha is a dial between overfitting and underfitting; pick it by cross-validation.

## Check your understanding

:::quiz
title: Check: overfitting and generalisation
q: A model has training MSE 3 and test MSE 90. What is the diagnosis?
- Underfitting
* Overfitting
- It generalises well
why: A tiny training error with a far larger test error means the model memorised the training set.
q: Which change most likely reduces overfitting of a decision tree?
- Remove the depth limit
* Set a smaller max_depth
- Train on fewer houses
why: Less depth means fewer leaves and less room to memorise single examples.
q: Why does 5-fold cross-validation give a better estimate than one train-test split?
- It uses more test houses in total, so the number is less affected by one lucky or unlucky hidden house
* It averages 5 test errors, each from a different hidden fold
- It trains the model 5 times longer
why: Every house serves as a test house once, and the average smooths out the luck of a single split.
q: The cross-validated MSE of the line is 107, yet one fold gave 25 and another gave 225. Which number should you report as the expected error on a new house?
- 25, the best fold
- 225, the worst fold
* 107, the average
why: The average over folds is the fair estimate; single folds swing with the house they hide.
q: What does the alpha term in ridge regression do?
- It increases the number of coefficients
* It penalises large coefficients so the fit stays smooth
- It removes the intercept
why: The loss becomes MSE plus alpha times the sum of squared coefficients, which pulls them towards 0.
q: The mean model predicts 208 for every house and has training MSE 5056. Its test MSE is 5674. Which word fits?
* Underfitting
- Overfitting
- Generalising
why: Both errors are high and close together, which means the model is too simple, not that it memorised.
:::

## Go further

The scikit-learn user guide pages on cross-validation and on ridge regression in the links show the tools from this lesson. They include plots of the error against alpha. The Wikipedia page on overfitting collects the history and the related ideas of bias and variance that the video uses. You have now trained, tested and tuned four kinds of model on one tiny table. The next module, [A neuron](/courses/ai-foundations/neural-networks/a-neuron), builds the unit of a neural network from pieces you already have. Those pieces are a weighted sum, a bias and a sigmoid.
`,
      links: [
        { label: 'Cross-validation (scikit-learn user guide)', url: 'https://scikit-learn.org/stable/modules/cross_validation.html', kind: 'docs' },
        { label: 'Ridge regression (scikit-learn user guide)', url: 'https://scikit-learn.org/stable/modules/linear_model.html#ridge-regression-and-classification', kind: 'docs' },
        { label: 'Overfitting (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Overfitting', kind: 'article' },
        { label: 'Bias and Variance (StatQuest)', url: 'https://www.youtube.com/watch?v=EuBBz3bI-aA', kind: 'video' },
      ],
    },
  ],
}
