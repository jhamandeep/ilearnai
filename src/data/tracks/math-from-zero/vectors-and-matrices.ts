import type { Module } from '../../types'

export const mod: Module = {
  slug: 'vectors-and-matrices',
  title: 'Vectors and matrices',
  description: 'Lists of numbers, how to add, scale and compare them, and the tables of numbers that move them: the language every model speaks.',
  level: 'foundations',
  lessons: [
    {
      slug: 'what-a-vector-is',
      title: 'A vector is a list of numbers',
      summary: 'Write any measurable thing as a vector, read it as a point or an arrow, and check its dimension in Python.',
      minutes: 18,
      objectives: [
        'Explain what a vector is in one sentence and give an everyday example.',
        'Write a vector for an object from a fixed list of features.',
        'Read a 2-number vector as a point and as an arrow on a grid.',
        'Create a NumPy array and print its shape.',
      ],
      keyTerms: ['vector', 'component', 'dimension', 'scalar', 'coordinate', 'feature-vector', 'embedding'],
      body: `
## What this lesson covers

This lesson explains what a vector is. A vector is a list of numbers in a fixed order. You learn to see one vector in three ways: as a description of a thing, as a point, and as an arrow. After the lesson you can write a vector for any object you can measure, and you can create one in Python and read its shape.

## Why it matters

Every AI system turns its input into vectors. A grey photo becomes a vector of brightness values, one number per pixel. A word becomes an embedding, which is a vector of a few hundred numbers that a model learns so that similar words get similar vectors. A house in a price data set becomes a vector of its features. The model never sees the photo, the word or the house. It sees only the list of numbers.

This is the first lesson of the module. The next lesson, [Adding, scaling and measuring vectors](/courses/math-from-zero/vectors-and-matrices/vector-arithmetic), shows what you can do with two vectors. The lesson after that measures how similar two vectors are. That similarity is the heart of search, recommendation and retrieval systems. You need the idea of a vector first.

:::video
id: fNk_zzaMoSs
why: Watch the first 5 minutes. It shows the three views of a vector that this lesson describes: the list, the point and the arrow.
:::

## The idea with an example

> **Analogy.** A vector is like a recipe card with fixed slots. The card says "flour 300, sugar 100, eggs 2". The slots always come in the same order, so you can compare two cakes slot by slot. If you swap the numbers around, you get a different cake. A vector is a list of numbers with the same two rules: the order is fixed, and each slot has a meaning.

Take one concrete thing: a house. You decide to describe every house with 3 numbers, always in this order: the number of rooms, the number of floors, and the distance to the nearest school in kilometres. House A has 3 rooms, 2 floors and a school 1 kilometre away. The vector for House A is $h = [3, 2, 1]$. In words: the vector h is the list three, two, one.

Each number in the list is a component. The first component of h is 3. The third component is 1. The number of components is the dimension of the vector. The vector h has dimension 3, because it holds 3 numbers. A single number on its own, such as 3, is a scalar. A scalar is a number without a list around it.

House B has 4 rooms, 1 floor and a school 5 kilometres away, so $g = [4, 1, 5]$. House C is $c = [2, 2, 2]$. The grid below shows the three houses as three rows of numbers. Each row is one vector. Each column is one feature. A vector that lists the features of one object is a feature vector.

:::matrix
title: Three houses as three feature vectors
cols: rooms, floors, km to school
House A: 3, 2, 1
House B: 4, 1, 5
House C: 2, 2, 2
:::

Now look at the same idea with a picture. Drop the third number and keep only $[3, 2]$. Draw a grid on paper. Start at the corner where the two axes meet. That corner is the origin, the point $[0, 0]$. Move 3 steps to the right and 2 steps up. Mark the spot. The vector $[3, 2]$ is that point. Each component is a coordinate, which is a number that says how far to move along one axis. Now draw a line from the origin to the point and put an arrowhead on it. The vector $[3, 2]$ is also that arrow. The point and the arrow are two pictures of the same list of numbers.

The full vector $[3, 2, 1]$ needs three axes, like the corner of a room: along the wall, along the floor, and up. Move 3 along the first wall, 2 along the second wall, and 1 up. That point in the room is House A. Beyond 3 dimensions you cannot draw the picture any more. The list still works. A vector of dimension 300 is a list of 300 numbers. Every rule in this module works the same way for 2 numbers and for 300 numbers. Press Next to build the vector for House A step by step.

:::scenario
title: Build the feature vector for House A
state: list=[ ], dimension=0
step: Fix the order of the features: rooms first, then floors, then kilometres to school.
step: Count the rooms. There are 3. Write 3 in the first slot.
state: list=[3], dimension=1
step: Count the floors. There are 2. Write 2 in the second slot.
state: list=[3 2], dimension=2
step: Measure the distance to the school. It is 1 kilometre. Write 1 in the third slot.
state: list=[3 2 1], dimension=3
step: Read the list as a point: go 3 along the first axis, 2 along the second, and 1 up.
step: Read the list as an arrow: draw it from the origin to that point.
:::

The pipeline below shows the path from a real thing to the numbers a model reads.

:::flow
title: From a thing to a vector to a model
House -> Features: pick the features in a fixed order
Features -> Vector: write the numbers in a list
Vector -> Point: read each number as a coordinate
Vector -> Model: the model reads only the numbers
:::

## How it works

To write a vector for any object, follow four steps.

1. Choose the features and fix their order. Write the order down. Every object you describe later must use the same order.
2. Measure each feature and get one number for each.
3. Write the numbers in a list, inside square brackets, separated by commas.
4. Count the numbers. That count is the dimension.

Mathematicians write a vector with a bold or arrowed letter and number the components with a small index. The general form is $v = [v_1, v_2, \\ldots, v_n]$. In words: the vector v is the list of its components v one, v two, and so on up to v n, where n is the dimension. For House A, $v_1 = 3$, $v_2 = 2$ and $v_3 = 1$. Note that mathematics counts components from 1. Python counts from 0. In Python, the first component of h is h[0], and it equals 3.

Two vectors are equal only when they have the same dimension and every component matches in position. The vectors $[3, 2, 1]$ and $[1, 2, 3]$ hold the same three numbers but in a different order. They are different vectors. The first describes a house with 3 rooms. The second describes a house with 1 room. The zero vector is the vector with every component equal to 0, written $[0, 0, 0]$ in dimension 3. It sits at the origin.

| Object | Features in fixed order | Vector | Dimension |
| --- | --- | --- | --- |
| House A | rooms, floors, km to school | [3, 2, 1] | 3 |
| A point on paper | right, up | [3, 2] | 2 |
| A grey photo of 28 by 28 pixels | brightness of each pixel | 784 numbers | 784 |
| A word in a small language model | learned numbers | 300 numbers | 300 |

The table shows the same rule at four sizes. The photo has 28 rows of 28 pixels, which is 784 pixels. Each pixel gives one brightness number between 0 (black) and 255 (white). So the photo becomes one vector with 784 components. Nobody draws a picture with 784 axes. The list is enough.

In Python you store a vector in a NumPy array. NumPy is a library, which is a collection of ready-made code, for fast work with numbers. The array type holds numbers in a fixed order and knows its own shape. The shape of a vector is written as a pair with one entry, such as (3,), which means 3 components in one row. The code below builds House A and reads it back.

:::code
lang: python
file: vector.py
import numpy as np

h = np.array([3, 2, 1])   # House A: rooms, floors, km to school

print(h)
print("dimension:", h.shape[0])
print("shape:", h.shape)
print("first component (index 0):", h[0])
print("third component (index 2):", h[2])
:::

:::code
lang: text
[3 2 1]
dimension: 3
shape: (3,)
first component (index 0): 3
third component (index 2): 1
:::

A Python list, such as [3, 2, 1], can also hold the numbers. The difference matters in the next lesson. When you add two NumPy arrays, NumPy adds them component by component, which is what vector addition means. When you add two Python lists, Python glues them end to end into a longer list. Use np.array for vectors.

The bars below show the three components of House A side by side. A bar chart is one more picture of a vector: one bar per component.

:::bars
title: The three components of House A
Rooms: 3
Floors: 2
Km to school: 1
:::

## Try it

:::exercise
title: Describe two cups of coffee as vectors
task: Describe a cup of coffee with 3 features in this fixed order: millilitres of coffee, spoons of sugar, temperature in degrees Celsius. Cup A has 250 millilitres, 2 spoons and is 60 degrees. Cup B has 150 millilitres, 0 spoons and is 70 degrees. Write both vectors by hand. Then create both as NumPy arrays, print the shape of each, and print the second component of Cup A. Say what the second component means.
hint: Keep the order millilitres, sugar, temperature for both cups. In Python the second component has index 1.
lang: python
solution:
import numpy as np

cup_a = np.array([250, 2, 60])   # millilitres, spoons of sugar, degrees
cup_b = np.array([150, 0, 70])

print(cup_a.shape)   # (3,)
print(cup_b.shape)   # (3,)
print(cup_a[1])      # 2, the spoons of sugar in Cup A
:::

Do the exercise on paper first. Then type the code and compare. If the shapes differ, one cup has a missing or extra number.

## Common mistakes

- Mistake: you think the order of the numbers does not matter. Fix: the order is part of the vector. [3, 2, 1] and [1, 2, 3] describe different houses.
- Mistake: you mix the dimension with the size of the numbers. Fix: the dimension is the count of components. [300, 100, 2] has dimension 3, not 300.
- Mistake: you read h[1] in Python as the first component. Fix: Python counts from 0, so h[0] is the first component and h[1] is the second.
- Mistake: you think a vector must be something you can draw. Fix: a vector of dimension 784 is a valid vector. The list works even when the picture does not.
- Mistake: you add two Python lists and expect vector addition. Fix: use np.array so that addition works component by component.

## Check your understanding

:::quiz
title: Check: vectors
q: In Python, h = np.array([3, 2, 1]). What does h[2] return?
- 2
* 1
- 3
- An error
why: Python counts from 0, so h[0] is 3, h[1] is 2 and h[2] is 1.
q: A grey photo has 4 rows of 5 pixels. What is the dimension of its vector?
- 9
- 4
* 20
- 45
why: There are 4 times 5 equals 20 pixels, and each pixel gives one component.
q: Are [3, 2, 1] and [1, 2, 3] the same vector?
- Yes, they hold the same numbers
* No, the order is different
- Yes, when the dimension matches
why: Two vectors are equal only when every component matches in the same position.
q: Which description fits a scalar?
* A single number such as 7
- A list of numbers such as [7, 1]
- The arrow from the origin to a point
why: A scalar is one number on its own; a vector is a list of numbers.
q: You describe a house as [3, 2, 1] and a friend describes a house as [3, 2]. What is wrong?
- Nothing, both are valid for the same data set
* The dimensions differ, so the two houses are not described the same way
- The friend has the order wrong
why: Every object in one data set must use the same features in the same order, so the dimension must match.
:::

## Go further

The 3Blue1Brown lesson on vectors in the links gives the arrow picture with animation. The Khan Academy unit lets you practise reading coordinates. The NumPy beginner guide explains arrays and shapes in more depth. The next lesson, [Adding, scaling and measuring vectors](/courses/math-from-zero/vectors-and-matrices/vector-arithmetic), teaches you to add two vectors, to stretch one, and to measure its length.
`,
      links: [
        { label: '3Blue1Brown: Vectors, chapter 1 of Essence of linear algebra', url: 'https://www.3blue1brown.com/lessons/vectors', kind: 'video' },
        { label: 'Khan Academy: Vectors and spaces', url: 'https://www.khanacademy.org/math/linear-algebra/vectors-and-spaces', kind: 'course' },
        { label: 'NumPy: the absolute basics for beginners', url: 'https://numpy.org/doc/stable/user/absolute_beginners.html', kind: 'docs' },
        { label: 'Wikipedia: Euclidean vector', url: 'https://en.wikipedia.org/wiki/Euclidean_vector', kind: 'article' },
      ],
    },
    {
      slug: 'vector-arithmetic',
      title: 'Adding, scaling and measuring vectors',
      summary: 'Add two vectors, multiply a vector by a number, and compute the length of a vector and the distance between two vectors by hand.',
      minutes: 20,
      objectives: [
        'Compute the sum of two vectors component by component.',
        'Compute a scalar multiple of a vector and say what it does to the arrow.',
        'Compute the length of a vector with the Pythagorean theorem.',
        'Compute the distance between two vectors and check it in NumPy.',
      ],
      keyTerms: ['vector-addition', 'scalar-multiplication', 'norm', 'euclidean-distance', 'unit-vector', 'pythagorean-theorem'],
      body: `
## What this lesson covers

This lesson teaches the four basic operations on vectors: add two vectors, multiply a vector by a number, measure the length of a vector, and measure the distance between two vectors. You compute every result by hand with two small vectors. After the lesson you can do the same in NumPy and check your hand work.

## Why it matters

A model learns by moving vectors. In training, the model holds a vector of numbers called parameters. Each step adds a small correction vector to it. That is vector addition. The size of the step is a number that multiplies the correction. That is scalar multiplication. To decide whether two words or two documents are similar, a search system measures the distance between their vectors. That is the distance you compute here.

The previous lesson, [A vector is a list of numbers](/courses/math-from-zero/vectors-and-matrices/what-a-vector-is), gave you the list. This lesson gives you the arithmetic. The next lesson, [The dot product](/courses/math-from-zero/vectors-and-matrices/dot-product), builds on length to measure the angle between two vectors.

:::video
id: fNk_zzaMoSs
start: 300
why: Watch from 5 minutes to the end. It shows vector addition as placing arrows tip to tail and scaling as stretching an arrow.
:::

## The idea with an example

> **Analogy.** Think of a vector as a walk in a city with square blocks. The vector [3, 4] means walk 3 blocks east and 4 blocks north. Two walks one after the other add up: the east parts add, and the north parts add. Walking the same route twice doubles both parts. The straight-line distance from your start to your finish is the length of the vector, and a drone would fly it.

Use two vectors through the whole lesson: $a = [3, 4]$ and $b = [1, 2]$. In words: a is three, four, and b is one, two. Both have dimension 2, so you can draw them. Vector a is the arrow from the origin to the point 3 right and 4 up. Vector b is the arrow to 1 right and 2 up.

Vector addition adds the components in matching positions. The first component of the sum is $3 + 1 = 4$. The second component is $4 + 2 = 6$. So $a + b = [4, 6]$. In the picture, you place the tail of b at the tip of a. The arrow from the origin to the new tip is the sum. Vector subtraction works the same way with minus. The difference $a - b = [3 - 1, 4 - 2] = [2, 2]$. In words: a minus b is two, two. You can only add or subtract vectors of the same dimension.

Scalar multiplication multiplies every component by the same number. The scalar 2 gives $2a = [6, 8]$. The arrow keeps its direction and becomes twice as long. The scalar 0.5 gives $0.5a = [1.5, 2]$, which is half as long. A negative scalar flips the arrow: $-1 \\cdot a = [-3, -4]$ points the opposite way.

The length of a vector is the straight-line distance from the origin to its point. Mathematicians call this length the norm. For $a = [3, 4]$, draw the arrow. Then draw the 3-block path east and the 4-block path north. The three lines form a right-angled triangle. The Pythagorean theorem says that in a right-angled triangle the square of the longest side equals the sum of the squares of the other two sides. So the squared length is $3^2 + 4^2 = 9 + 16 = 25$. The length is $\\sqrt{25} = 5$. In words: the norm of a is five.

The distance between two vectors is the length of their difference. You already found $a - b = [2, 2]$. Its squared length is $2^2 + 2^2 = 8$. The distance is $\\sqrt{8} \\approx 2.83$. In words: a and b are about 2.83 units apart. Press Next to follow each step.

:::scenario
title: Add, scale and measure a=[3 4] and b=[1 2]
state: a=[3 4], b=[1 2]
step: Add the first components: 3 plus 1 is 4. Add the second components: 4 plus 2 is 6.
state: a+b=[4 6]
step: Multiply every component of a by 2: 3 times 2 is 6 and 4 times 2 is 8.
state: 2a=[6 8]
step: Square the components of a and add: 9 plus 16 is 25. Take the square root: 5.
state: length of a=5
step: Subtract b from a: 3 minus 1 is 2 and 4 minus 2 is 2.
state: a-b=[2 2]
step: Square and add: 4 plus 4 is 8. Take the square root: about 2.83.
state: distance=2.83
:::

The flow below shows the three operations that go into a distance.

:::flow
title: How a distance is computed
a and b -> Difference: subtract component by component
Difference -> Squares: square each component
Squares -> Sum: add the squares
Sum -> Distance: take the square root
:::

## How it works

Here are the four rules for vectors $u = [u_1, u_2, \\ldots, u_n]$ and $v = [v_1, v_2, \\ldots, v_n]$ and a scalar $c$.

1. Addition: $u + v = [u_1 + v_1, u_2 + v_2, \\ldots, u_n + v_n]$. In words: add the components that sit in the same position.
2. Scalar multiplication: $c \\cdot u = [c u_1, c u_2, \\ldots, c u_n]$. In words: multiply every component by c.
3. Norm: $\\|u\\| = \\sqrt{u_1^2 + u_2^2 + \\cdots + u_n^2}$. In words: square each component, add the squares, and take the square root.
4. Distance: $d(u, v) = \\|u - v\\|$. In words: the distance between u and v is the norm of their difference.

Rule 3 is the Pythagorean theorem extended to any dimension. In dimension 3, a vector such as $[1, 2, 2]$ has squared norm $1 + 4 + 4 = 9$ and norm $3$. In dimension 300 you square 300 numbers, add them, and take one square root. The rule never changes.

The table collects the results for the running example.

| Operation | Hand computation | Result |
| --- | --- | --- |
| a + b | [3 + 1, 4 + 2] | [4, 6] |
| a - b | [3 - 1, 4 - 2] | [2, 2] |
| 2a | [2 times 3, 2 times 4] | [6, 8] |
| norm of a | square root of 9 + 16 | 5 |
| norm of b | square root of 1 + 4 | about 2.24 |
| distance from a to b | square root of 4 + 4 | about 2.83 |

A unit vector is a vector with norm 1. You make one by dividing a vector by its own norm. For a, divide each component by 5: $a / 5 = [0.6, 0.8]$. Check: $0.36 + 0.64 = 1$, and the square root of 1 is 1. The unit vector keeps the direction of a and throws away its length. Search systems do this so that a long document and a short document with the same topic get the same direction. The next lesson uses this idea.

The bars compare the norms of the three vectors in the example.

:::bars
title: Norms of the vectors in this lesson
Vector a = [3, 4]: 5
Vector b = [1, 2]: 2.24
Vector a + b = [4, 6]: 7.21
Vector a - b = [2, 2]: 2.83
:::

Note that the norm of a plus b, which is about 7.21, is less than 5 plus 2.24. Two arrows that point in different directions add up to less than the sum of their lengths. The sum equals the sum of lengths only when the arrows point the same way.

The code below repeats every hand computation. The function np.linalg.norm computes the norm. The star symbol multiplies every component by a scalar.

:::code
lang: python
file: arithmetic.py
import numpy as np

a = np.array([3, 4])
b = np.array([1, 2])

print("a + b =", a + b)
print("a - b =", a - b)
print("2a    =", 2 * a)
print("norm of a =", np.linalg.norm(a))
print("norm of b =", round(np.linalg.norm(b), 2))
print("distance  =", round(np.linalg.norm(a - b), 2))
print("unit vector of a =", a / np.linalg.norm(a))
:::

:::code
lang: text
a + b = [4 6]
a - b = [2 2]
2a    = [6 8]
norm of a = 5.0
norm of b = 2.24
distance  = 2.83
unit vector of a = [0.6 0.8]
:::

## Try it

:::exercise
title: Three points on a map
task: Three shops sit at p = [0, 0], q = [6, 8] and r = [6, 0], with distances in hundreds of metres. By hand, compute the distance from p to q, from p to r and from q to r. Which two shops are closest? Then compute 0.5 times q and say where that point sits on the straight line from p to q. Check every answer with NumPy.
hint: The distance from p to q is the norm of q minus p. For a vector with components 6 and 8, square both, add, and take the square root.
lang: python
solution:
import numpy as np

p = np.array([0, 0])
q = np.array([6, 8])
r = np.array([6, 0])

print(np.linalg.norm(q - p))   # 10.0
print(np.linalg.norm(r - p))   # 6.0
print(np.linalg.norm(q - r))   # 8.0  so p and r are closest
print(0.5 * q)                 # [3. 4.]  the midpoint between p and q
:::

By hand: q minus p is [6, 8], with squared norm 36 + 64 = 100 and norm 10. r minus p is [6, 0] with norm 6. q minus r is [0, 8] with norm 8. The point 0.5q = [3, 4] sits halfway along the line from p to q.

## Common mistakes

- Mistake: you add a vector of dimension 2 to a vector of dimension 3. Fix: addition needs equal dimensions. Check the shapes first.
- Mistake: you compute the norm as the sum of the components, so [3, 4] gets norm 7. Fix: square first, add, and then take the square root. The norm of [3, 4] is 5.
- Mistake: you forget the square root and report 25 as the length. Fix: 25 is the squared norm. The norm is 5.
- Mistake: you think a negative scalar makes the vector shorter. Fix: the sign flips the direction. The size of the scalar sets the length.
- Mistake: you add two Python lists and get [3, 4, 1, 2]. Fix: use NumPy arrays, which add component by component.

## Check your understanding

:::quiz
title: Check: vector arithmetic
q: u = [2, 1] and v = [1, 3]. What is u + v?
- [3, 3]
* [3, 4]
- [2, 3]
- [1, -2]
why: Add the components in matching positions: 2 plus 1 is 3 and 1 plus 3 is 4.
q: What is the norm of [6, 8]?
- 14
- 100
* 10
- 48
why: Square and add: 36 plus 64 is 100. The square root of 100 is 10.
q: What is the distance between [5, 1] and [1, 1]?
* 4
- 6
- 2
- 16
why: The difference is [4, 0], whose norm is the square root of 16, which is 4.
q: What does multiplying a vector by -2 do to its arrow?
- Makes it half as long in the same direction
- Rotates it by 90 degrees
* Makes it twice as long and flips its direction
why: The size 2 doubles the length and the minus sign reverses the direction.
q: Why do search systems divide a vector by its norm?
- To make the vector shorter so it uses less memory
* To keep its direction and remove its length, so long and short documents compare fairly
- To round every component to 0 or 1
why: Dividing by the norm gives a unit vector that points the same way but has length 1.
:::

## Go further

The 3Blue1Brown video linked below animates addition and scaling. The Khan Academy page on vector magnitude gives more practice with the norm. The NumPy documentation for norm lists other norms you will meet later. The next lesson, [The dot product](/courses/math-from-zero/vectors-and-matrices/dot-product), combines two vectors into a single number that measures how much they point the same way.
`,
      links: [
        { label: '3Blue1Brown: Vectors, chapter 1 of Essence of linear algebra', url: 'https://www.3blue1brown.com/lessons/vectors', kind: 'video' },
        { label: 'Khan Academy: Vector magnitude and direction', url: 'https://www.khanacademy.org/math/precalculus/x9e81a4f98389efdf:vectors', kind: 'course' },
        { label: 'NumPy: numpy.linalg.norm', url: 'https://numpy.org/doc/stable/reference/generated/numpy.linalg.norm.html', kind: 'docs' },
        { label: 'Wikipedia: Euclidean distance', url: 'https://en.wikipedia.org/wiki/Euclidean_distance', kind: 'article' },
      ],
    },
    {
      slug: 'dot-product',
      title: 'The dot product',
      summary: 'Compute the dot product of two vectors, read it as a measure of agreement, and turn it into cosine similarity for three words.',
      minutes: 22,
      objectives: [
        'Compute the dot product of two vectors by hand.',
        'Explain what a positive, zero or negative dot product says about two arrows.',
        'Compute the cosine similarity of two vectors and read the result.',
        'Build a similarity grid for three words and check it in NumPy.',
      ],
      keyTerms: ['dot-product', 'cosine-similarity', 'orthogonal', 'angle-between-vectors', 'norm', 'embedding'],
      body: `
## What this lesson covers

This lesson teaches the dot product. The dot product takes two vectors of the same dimension and returns one number. You learn to compute it, to read its sign, and to turn it into cosine similarity, a score between -1 and 1 that says how much two vectors point the same way. You compute the similarity of three words by hand.

## Why it matters

Almost every number inside a neural network is a dot product. A neuron multiplies its inputs by its weights and adds the results. That is a dot product. A search engine that works with embeddings compares the query vector with every document vector. That comparison is cosine similarity, which is a dot product divided by two norms. When you understand this one operation, you can read the inside of a model.

The previous lesson gave you the norm. This lesson adds the dot product. The next lesson, [Matrices](/courses/math-from-zero/vectors-and-matrices/matrices), stacks many dot products into a table of numbers.

:::video
id: LyGKycYT2v0
why: Watch the first 6 minutes. It shows why the dot product measures how much one arrow points along another.
:::

## The idea with an example

> **Analogy.** Two people push a heavy box. If they push in the same direction, their efforts add up. If they push at a right angle to each other, one push does nothing for the other. If they push in opposite directions, they cancel. The dot product is a number that measures this agreement: large and positive for the same direction, zero for a right angle, and negative for opposite directions.

Start with the vectors from the previous lesson: $a = [3, 4]$ and $b = [1, 2]$. The dot product multiplies the components in matching positions and adds the products. First components: $3 \\times 1 = 3$. Second components: $4 \\times 2 = 8$. Add: $3 + 8 = 11$. So $a \\cdot b = 11$. In words: the dot product of a and b is eleven. The result is a scalar, a single number, not a vector.

Now check the sign rule with three short arrows. Take $e = [1, 0]$, which points right, and $f = [0, 1]$, which points up. Their dot product is $1 \\times 0 + 0 \\times 1 = 0$. The arrows meet at a right angle, and the dot product is zero. Two vectors with dot product zero are orthogonal, which means perpendicular. Now take $g = [-1, 0]$, which points left. Then $e \\cdot g = -1 + 0 = -1$. Opposite directions give a negative number.

The dot product grows when the vectors grow. Double a and the dot product with b doubles to 22, even though the directions have not changed. To measure direction only, divide the dot product by both norms. The result is the cosine similarity. For a and b: the norm of a is 5, and the norm of b is $\\sqrt{5} \\approx 2.236$. So the cosine similarity is $11 / (5 \\times 2.236) = 11 / 11.18 \\approx 0.98$. In words: the cosine similarity of a and b is about 0.98, which is very close to 1, so the two arrows point almost the same way.

Now apply the idea to words. Describe three words with 3 features in a fixed order: how much the word is an animal, how much it is a pet, how much it is a vehicle, each on a scale from 0 to 3. Choose cat = [3, 1, 0], dog = [3, 2, 0] and car = [0, 1, 3]. These are tiny embeddings that you wrote by hand. A real model learns hundreds of such numbers, but the arithmetic is the same.

Compute cat and dog. Dot product: $3 \\times 3 + 1 \\times 2 + 0 \\times 0 = 9 + 2 + 0 = 11$. Norm of cat: $\\sqrt{9 + 1 + 0} = \\sqrt{10} \\approx 3.162$. Norm of dog: $\\sqrt{9 + 4 + 0} = \\sqrt{13} \\approx 3.606$. Cosine similarity: $11 / (3.162 \\times 3.606) = 11 / 11.40 \\approx 0.96$. Cat and dog are very similar.

Compute cat and car. Dot product: $3 \\times 0 + 1 \\times 1 + 0 \\times 3 = 1$. Norm of car: $\\sqrt{0 + 1 + 9} = \\sqrt{10} \\approx 3.162$. Cosine similarity: $1 / (3.162 \\times 3.162) = 1 / 10 = 0.10$. Cat and car are not similar. Press Next to follow the cat and dog computation.

:::scenario
title: Cosine similarity of cat and dog
state: cat=[3 1 0], dog=[3 2 0]
step: Multiply matching components: 3 times 3 is 9, 1 times 2 is 2, 0 times 0 is 0.
state: products=[9 2 0]
step: Add the products: 9 plus 2 plus 0 is 11. This is the dot product.
state: dot=11
step: Norm of cat: square root of 9 plus 1 plus 0, which is the square root of 10, about 3.162.
state: norm cat=3.162
step: Norm of dog: square root of 9 plus 4 plus 0, which is the square root of 13, about 3.606.
state: norm dog=3.606
step: Multiply the norms: 3.162 times 3.606 is about 11.40.
state: product of norms=11.40
step: Divide the dot product by the product of norms: 11 divided by 11.40 is about 0.96.
state: cosine=0.96
:::

The grid below shows the cosine similarity of every pair. Each word has similarity 1 with itself.

:::matrix
title: Cosine similarity between three words
cols: cat, dog, car
cat: 1.00, 0.96, 0.10
dog: 0.96, 1.00, 0.18
car: 0.10, 0.18, 1.00
:::

The dog and car score is $2 / (3.606 \\times 3.162) = 2 / 11.40 \\approx 0.18$. It is a little higher than cat and car, because dog has a 2 in the pet slot, and car has a 1 there. The grid makes the structure visible: cat and dog form one group, and car stands apart.

## How it works

For vectors $u = [u_1, \\ldots, u_n]$ and $v = [v_1, \\ldots, v_n]$, the dot product is:

$$u \\cdot v = u_1 v_1 + u_2 v_2 + \\cdots + u_n v_n$$

In words: multiply the components that sit in the same position, then add all the products. The cosine similarity is:

$$\\cos(\\theta) = \\frac{u \\cdot v}{\\|u\\| \\, \\|v\\|}$$

In words: divide the dot product by the norm of u times the norm of v. The symbol theta is the angle between the two arrows, and the result is the cosine of that angle. You do not need trigonometry to use it. Read the result with the table below.

| Cosine similarity | Angle between arrows | Meaning |
| --- | --- | --- |
| 1 | 0 degrees | same direction |
| about 0.96 | about 16 degrees | almost the same direction |
| 0 | 90 degrees | orthogonal, no agreement |
| -1 | 180 degrees | opposite direction |

To compute cosine similarity by hand, follow four steps.

1. Compute the dot product.
2. Compute the norm of each vector.
3. Multiply the two norms.
4. Divide the dot product by that product.

The dot product also has a second reading: the dot product of u with itself is its squared norm, because $u \\cdot u = u_1^2 + \\cdots + u_n^2$. For $a = [3, 4]$: $a \\cdot a = 9 + 16 = 25 = 5^2$. So the norm is the square root of the dot product of a vector with itself. This is why one operation sits behind both length and similarity.

A neuron in a network does exactly step 1. It holds a weight vector $w$, receives an input vector $x$, and computes $w \\cdot x$ plus a constant. With $w = [3, 4]$ and $x = [1, 2]$, the neuron computes 11 plus its constant. Thousands of neurons do this at once, and the next two lessons show how to arrange that as a matrix.

The flow below shows the pipeline from two vectors to a similarity score.

:::flow
title: From two vectors to cosine similarity
u and v -> Products: multiply matching components
Products -> Dot product: add the products
u and v -> Norms: compute each norm
Norms -> Divisor: multiply the two norms
Dot product -> Cosine: divide by the divisor
Divisor -> Cosine: divide
:::

The code repeats the three-word example. The function np.dot computes the dot product.

:::code
lang: python
file: similarity.py
import numpy as np

cat = np.array([3, 1, 0])
dog = np.array([3, 2, 0])
car = np.array([0, 1, 3])

def cosine(u, v):
    return np.dot(u, v) / (np.linalg.norm(u) * np.linalg.norm(v))

print("cat . dog =", np.dot(cat, dog))
print("cat . car =", np.dot(cat, car))
print("cosine(cat, dog) =", round(cosine(cat, dog), 2))
print("cosine(cat, car) =", round(cosine(cat, car), 2))
print("cosine(dog, car) =", round(cosine(dog, car), 2))
:::

:::code
lang: text
cat . dog = 11
cat . car = 1
cosine(cat, dog) = 0.96
cosine(cat, car) = 0.1
cosine(dog, car) = 0.18
:::

The bars compare the three similarity scores. The gap between the first bar and the other two is what a search engine uses to rank results.

:::bars
title: Cosine similarity of the three word pairs
cat and dog: 0.96
dog and car: 0.18
cat and car: 0.10
:::

## Try it

:::exercise
title: Add a fourth word
task: Add the word bus with vector [0, 0, 3]. By hand, compute the cosine similarity of bus with car, with cat and with dog. Which word is bus closest to? Then extend the Python code to print the three scores and check your hand work.
hint: The norm of bus is the square root of 9, which is 3. The dot product of bus with car is 0 times 0 plus 0 times 1 plus 3 times 3.
lang: python
solution:
import numpy as np

cat = np.array([3, 1, 0])
dog = np.array([3, 2, 0])
car = np.array([0, 1, 3])
bus = np.array([0, 0, 3])

def cosine(u, v):
    return np.dot(u, v) / (np.linalg.norm(u) * np.linalg.norm(v))

print(round(cosine(bus, car), 2))   # 0.95
print(round(cosine(bus, cat), 2))   # 0.0
print(round(cosine(bus, dog), 2))   # 0.0
:::

By hand: bus dot car is 9, the norm of bus is 3, the norm of car is 3.162, so the cosine is 9 divided by 9.49, about 0.95. Bus dot cat is 0 and bus dot dog is 0, so those cosines are 0. Bus is orthogonal to both animals and close to car.

## Common mistakes

- Mistake: you multiply components across positions, such as 3 times 2 and 4 times 1. Fix: multiply only matching positions, first with first and second with second.
- Mistake: you report the dot product as a vector such as [3, 8]. Fix: the dot product adds the products, so the result is one number, 11.
- Mistake: you use the raw dot product to compare similarity across vectors of different lengths. Fix: divide by both norms to get cosine similarity, which depends on direction only.
- Mistake: you think a dot product of zero means the vectors are zero. Fix: it means the arrows are orthogonal. [1, 0] and [0, 1] are both non-zero and have dot product 0.
- Mistake: you expect cosine similarity above 1. Fix: cosine similarity always lies between -1 and 1. A result outside that range is an arithmetic error.

## Check your understanding

:::quiz
title: Check: dot product
q: What is [2, 3] dot [4, 1]?
- [8, 3]
* 11
- 10
- 24
why: Multiply matching positions, 2 times 4 is 8 and 3 times 1 is 3, then add to get 11.
q: What is the cosine similarity of [2, 0] and [5, 0]?
- 10
- 0
* 1
- 0.4
why: Both vectors point right, so the angle is 0 and the cosine is 1. The dot product 10 divided by the norms 2 times 5 confirms it.
q: The dot product of two non-zero vectors is 0. What does that tell you?
- The vectors are equal
* The arrows meet at a right angle
- One vector is the zero vector
why: A zero dot product between non-zero vectors means they are orthogonal.
q: Why does cosine similarity divide by the two norms?
- To make the result an integer
* To remove the effect of length so that only direction counts
- To make the result always positive
why: Dividing by the norms turns the vectors into unit vectors, so only the angle remains.
q: A neuron has weights [1, -1] and gets input [4, 4]. What is the dot product?
- 8
- 16
* 0
- -8
why: 1 times 4 plus negative 1 times 4 is 4 minus 4, which is 0.
:::

## Go further

The 3Blue1Brown lesson on dot products in the links explains the geometry with animations. The Wikipedia page on cosine similarity shows how search systems use it. The NumPy page for dot lists the exact rules the function follows. The next lesson, [Matrices](/courses/math-from-zero/vectors-and-matrices/matrices), arranges many vectors into one table and shows how a table can move a vector.
`,
      links: [
        { label: '3Blue1Brown: Dot products and duality', url: 'https://www.3blue1brown.com/lessons/dot-products', kind: 'video' },
        { label: 'Wikipedia: Cosine similarity', url: 'https://en.wikipedia.org/wiki/Cosine_similarity', kind: 'article' },
        { label: 'NumPy: numpy.dot', url: 'https://numpy.org/doc/stable/reference/generated/numpy.dot.html', kind: 'docs' },
        { label: 'Mathematics for Machine Learning, chapter 3 (free book)', url: 'https://mml-book.github.io/', kind: 'course' },
      ],
    },
    {
      slug: 'matrices',
      title: 'Matrices',
      summary: 'Read a matrix as a table of numbers with a shape, and see it as a machine that scales or rotates a vector.',
      minutes: 20,
      objectives: [
        'Read the shape of a matrix as rows by columns.',
        'Explain the two views of a matrix: a data table and a machine that moves vectors.',
        'Compute what a 2 by 2 matrix does to a 2-number vector by hand.',
        'Create a matrix in NumPy and check its shape and transpose.',
      ],
      keyTerms: ['matrix', 'shape', 'identity-matrix', 'linear-transformation', 'transpose', 'rotation-matrix', 'square-matrix'],
      body: `
## What this lesson covers

This lesson explains what a matrix is. A matrix is a rectangular table of numbers with rows and columns. You learn to read its shape, to see it as a stack of vectors, and to see it as a machine that takes a vector in and sends a vector out. You compute by hand what two small matrices do to the vector [3, 4].

## Why it matters

A neural network is a chain of matrices. Each layer holds one matrix of learned numbers. The input vector goes in, the matrix moves it, and a new vector comes out. The parameter count of a model, such as 7 billion, is mostly the count of numbers inside these matrices. When you understand a 2 by 2 matrix, you understand a 4096 by 4096 matrix. Only the size changes.

The previous lesson gave you the dot product. This lesson shows that a matrix acting on a vector is a stack of dot products. The next lesson, [Matrix multiplication by hand](/courses/math-from-zero/vectors-and-matrices/matrix-multiplication), gives the full rule for multiplying two matrices.

:::video
id: kYB8IZa5AuE
why: Watch the first 8 minutes. It shows a matrix as a machine that moves every point of the grid, which is the second view in this lesson.
:::

## The idea with an example

> **Analogy.** A spreadsheet is a table with rows and columns. Each row is one record and each column is one field. A matrix is a spreadsheet that holds only numbers. Now imagine a second kind of table: a settings panel on a photo editor with sliders for stretch and rotate. You feed a picture in and a changed picture comes out. A matrix is also that panel. The same table of numbers can be a record of data or a set of instructions for moving things.

Start with the first view. In the first lesson you described three houses as vectors: House A is [3, 2, 1], House B is [4, 1, 5] and House C is [2, 2, 2]. Stack them as rows. You get a matrix with 3 rows and 3 columns:

$$H = \\begin{bmatrix} 3 & 2 & 1 \\\\ 4 & 1 & 5 \\\\ 2 & 2 & 2 \\end{bmatrix}$$

In words: H is the table with first row three, two, one, second row four, one, five, and third row two, two, two. The shape of a matrix is the number of rows followed by the number of columns. The shape of H is 3 by 3. A matrix whose row count equals its column count is a square matrix. If you add a fourth house, the shape becomes 4 by 3. The number of rows is the number of objects, and the number of columns is the number of features. You can read any row as a vector, and you can read any column as a vector too. The first column, [3, 4, 2], lists the rooms of all three houses.

:::matrix
title: The data matrix H, one row per house
cols: rooms, floors, km to school
House A: 3, 2, 1
House B: 4, 1, 5
House C: 2, 2, 2
:::

Now the second view: a matrix as a machine. Use a 2 by 2 matrix and the vector $v = [3, 4]$ from the previous lessons. Here is a stretch matrix:

$$S = \\begin{bmatrix} 2 & 0 \\\\ 0 & 1 \\end{bmatrix}$$

In words: S has first row two, zero and second row zero, one. To apply S to v, take the dot product of each row of S with v. First row: $2 \\times 3 + 0 \\times 4 = 6$. Second row: $0 \\times 3 + 1 \\times 4 = 4$. The output vector is $[6, 4]$. In words: S sends three, four to six, four. The matrix doubled the first component and left the second alone. On a drawing, every point moves twice as far to the right, and the picture stretches sideways.

Here is a rotation matrix:

$$R = \\begin{bmatrix} 0 & -1 \\\\ 1 & 0 \\end{bmatrix}$$

In words: R has first row zero, minus one and second row one, zero. Apply R to v. First row: $0 \\times 3 + (-1) \\times 4 = -4$. Second row: $1 \\times 3 + 0 \\times 4 = 3$. The output is $[-4, 3]$. In words: R sends three, four to minus four, three. Check the norm: the squared norm of the output is $16 + 9 = 25$, so the norm is 5, the same as before. The arrow kept its length and turned a quarter turn, 90 degrees, to the left. A matrix that turns every vector by the same angle and keeps its length is a rotation matrix. Press Next to follow the rotation step by step.

:::scenario
title: Rotate v=[3 4] with the matrix R
state: R row 1=[0 -1], R row 2=[1 0], v=[3 4]
step: Take the dot product of row 1 with v: 0 times 3 plus minus 1 times 4 is minus 4.
state: output 1=-4
step: Take the dot product of row 2 with v: 1 times 3 plus 0 times 4 is 3.
state: output 2=3
step: Write the output vector: minus 4, 3.
state: output=[-4 3]
step: Check the norm: 16 plus 9 is 25, square root 5. The length did not change.
state: norm before=5, norm after=5
step: The arrow turned a quarter turn to the left. R is a rotation.
:::

A matrix that moves vectors this way is a linear transformation. The word linear means two things hold. Doubling the input doubles the output. And the output for a sum of two inputs is the sum of their outputs. Both follow from the dot product rule, because a dot product spreads over addition. Every grid line stays a straight line after the move, and the origin stays at the origin.

:::flow
title: A matrix as a machine
Input vector -> Row 1: dot product with row 1
Input vector -> Row 2: dot product with row 2
Row 1 -> Output vector: first component
Row 2 -> Output vector: second component
:::

## How it works

A matrix with $m$ rows and $n$ columns has shape $m \\times n$, read as m by n. Mathematicians write the entry in row $i$ and column $j$ as $A_{ij}$. In words: A sub i j is the number where row i meets column j. For the matrix S above, $S_{11} = 2$, $S_{12} = 0$, $S_{21} = 0$ and $S_{22} = 1$. Rows come first, columns second, always.

To apply an $m \\times n$ matrix $A$ to a vector $x$ of dimension $n$, follow three steps.

1. Check the shapes. The matrix has n columns, so the vector must have n components.
2. For each row of A, compute the dot product of that row with x.
3. Stack the m results into the output vector, which has dimension m.

The output vector has as many components as the matrix has rows. A 3 by 2 matrix takes a 2-number vector and returns a 3-number vector. The matrix changes the dimension. This is how a layer with 2 inputs and 3 neurons works.

| Matrix | Shape | What it does to [3, 4] | Output |
| --- | --- | --- | --- |
| S = [[2, 0], [0, 1]] | 2 by 2 | doubles the first component | [6, 4] |
| R = [[0, -1], [1, 0]] | 2 by 2 | turns a quarter turn left | [-4, 3] |
| I = [[1, 0], [0, 1]] | 2 by 2 | leaves the vector unchanged | [3, 4] |
| 2I = [[2, 0], [0, 2]] | 2 by 2 | doubles every component | [6, 8] |
| T = [[1, 0], [0, 1], [1, 1]] | 3 by 2 | copies both and adds a sum | [3, 4, 7] |

The matrix I is the identity matrix. It has 1 on the diagonal, which runs from the top left to the bottom right, and 0 everywhere else. It does nothing to any vector, in the same way that multiplying a number by 1 does nothing. Check: row 1 gives $1 \\times 3 + 0 \\times 4 = 3$ and row 2 gives $0 \\times 3 + 1 \\times 4 = 4$.

The transpose of a matrix swaps its rows and columns. The transpose of a 3 by 2 matrix is a 2 by 3 matrix. Mathematicians write it as $A^\\top$, read as A transpose. For the house matrix H, the transpose has one row per feature and one column per house. Code often transposes a data matrix to switch between the two readings.

The code below builds the matrices and applies them with the @ symbol. In NumPy, @ means apply the matrix to the vector by the dot product rule. The attribute .T gives the transpose.

:::code
lang: python
file: matrices.py
import numpy as np

H = np.array([[3, 2, 1],
              [4, 1, 5],
              [2, 2, 2]])
S = np.array([[2, 0],
              [0, 1]])
R = np.array([[0, -1],
              [1, 0]])
v = np.array([3, 4])

print("shape of H:", H.shape)
print("first column of H:", H[:, 0])
print("S @ v =", S @ v)
print("R @ v =", R @ v)
print("norm of R @ v =", np.linalg.norm(R @ v))
print("transpose of S:")
print(S.T)
:::

:::code
lang: text
shape of H: (3, 3)
first column of H: [3 4 2]
S @ v = [6 4]
R @ v = [-4  3]
norm of R @ v = 5.0
transpose of S:
[[2 0]
 [0 1]]
:::

The bars compare the norm of the output for the four 2 by 2 matrices in the table. Only the rotation and the identity keep the norm at 5.

:::bars
title: Norm of the output vector for input [3, 4]
Identity I: 5
Rotation R: 5
Stretch S: 7.21
Double 2I: 10
:::

## Try it

:::exercise
title: Build your own stretch and flip
task: Write a 2 by 2 matrix F that flips a vector left to right, so that [3, 4] becomes [-3, 4]. Then write a 2 by 2 matrix G that triples the second component and leaves the first alone. Apply both to [3, 4] by hand. Then check with NumPy and print the shape of each matrix.
hint: Each row of the matrix is a dot product with the input. A row of [1, 0] copies the first component. A row of [-1, 0] copies it with a minus sign.
lang: python
solution:
import numpy as np

v = np.array([3, 4])
F = np.array([[-1, 0],
              [ 0, 1]])
G = np.array([[1, 0],
              [0, 3]])

print(F @ v, F.shape)   # [-3  4] (2, 2)
print(G @ v, G.shape)   # [ 3 12] (2, 2)
:::

By hand, F row 1 gives minus 1 times 3 plus 0 times 4, which is minus 3, and row 2 gives 4. G row 1 gives 3, and row 2 gives 0 times 3 plus 3 times 4, which is 12.

## Common mistakes

- Mistake: you write the shape as columns by rows. Fix: rows come first. A matrix with 3 rows and 2 columns has shape 3 by 2.
- Mistake: you apply a 2 by 2 matrix to a 3-number vector. Fix: the number of columns must equal the dimension of the vector. Check shapes before you compute.
- Mistake: you take the dot product of the columns with the input instead of the rows. Fix: each output component is the dot product of one row with the input.
- Mistake: you think the identity matrix is a matrix of all ones. Fix: the identity has ones only on the diagonal and zeros elsewhere. A matrix of all ones changes every vector.
- Mistake: you expect a rotation to change the length. Fix: a rotation keeps every norm. Check the norm before and after to confirm you built a rotation.

## Check your understanding

:::quiz
title: Check: matrices
q: A matrix has 4 rows and 2 columns. What is its shape, and what dimension does its input vector need?
- Shape 2 by 4, input dimension 4
* Shape 4 by 2, input dimension 2
- Shape 4 by 2, input dimension 4
why: Shape is rows by columns, and the input dimension must equal the number of columns.
q: Apply [[1, 1], [0, 2]] to [3, 4]. What is the output?
- [3, 8]
- [4, 6]
* [7, 8]
- [3, 4]
why: Row 1 gives 1 times 3 plus 1 times 4, which is 7, and row 2 gives 0 times 3 plus 2 times 4, which is 8.
q: Apply the rotation [[0, -1], [1, 0]] to [1, 0]. Where does it land?
* [0, 1]
- [-1, 0]
- [1, 0]
- [0, -1]
why: Row 1 gives 0 times 1 plus minus 1 times 0, which is 0, and row 2 gives 1 times 1 plus 0 times 0, which is 1. The arrow turned from right to up.
q: What is the transpose of a 3 by 5 matrix?
- A 3 by 5 matrix with the same entries
* A 5 by 3 matrix whose rows are the original columns
- A 5 by 5 matrix
why: The transpose swaps rows and columns, so the shape becomes 5 by 3.
q: A 3 by 2 matrix is applied to a 2-number vector. What is the dimension of the output?
- 2
* 3
- 6
why: The output has one component per row, and the matrix has 3 rows.
:::

## Go further

The 3Blue1Brown lesson on linear transformations in the links shows the grid picture that this lesson describes in words. The Khan Academy matrix unit has practice on reading entries and shapes. The Wikipedia page on rotation matrices gives the general form for any angle. The next lesson, [Matrix multiplication by hand](/courses/math-from-zero/vectors-and-matrices/matrix-multiplication), multiplies two matrices together and builds a tiny neural network layer.
`,
      links: [
        { label: '3Blue1Brown: Linear transformations and matrices', url: 'https://www.3blue1brown.com/lessons/linear-transformations', kind: 'video' },
        { label: 'Khan Academy: Matrices', url: 'https://www.khanacademy.org/math/precalculus/x9e81a4f98389efdf:matrices', kind: 'course' },
        { label: 'Wikipedia: Rotation matrix', url: 'https://en.wikipedia.org/wiki/Rotation_matrix', kind: 'article' },
        { label: 'NumPy: numpy.ndarray.shape', url: 'https://numpy.org/doc/stable/reference/generated/numpy.ndarray.shape.html', kind: 'docs' },
      ],
    },
    {
      slug: 'matrix-multiplication',
      title: 'Matrix multiplication by hand',
      summary: 'Multiply matrices with the shape rule and the row-times-column rule, and compute one neural network layer by hand.',
      minutes: 24,
      objectives: [
        'Apply the shape rule to decide whether two matrices can be multiplied and what shape results.',
        'Compute a 2 by 2 matrix times a 2 by 1 vector and a 2 by 2 times a 2 by 2 product by hand.',
        'Explain why the order of a matrix product matters.',
        'Compute the output of a tiny neural network layer as a matrix multiply plus a bias.',
      ],
      keyTerms: ['matrix-multiplication', 'shape-rule', 'non-commutative', 'weight-matrix', 'linear-layer', 'matrix', 'dot-product'],
      body: `
## What this lesson covers

This lesson teaches you to multiply two matrices by hand. You learn the shape rule, which tells you when a product exists and what shape it has. You learn the row-times-column rule, which gives each entry. You then compute a tiny neural network layer with 2 inputs and 2 neurons as a matrix multiply plus a bias vector.

## Why it matters

Matrix multiplication is the single most common operation in AI. A graphics processing unit (GPU) is a chip built to multiply matrices fast. When a language model produces one word, it performs thousands of matrix multiplications. Training a model repeats them billions of times. When you can do one by hand, you can read the shapes in any model code and find the bugs that shapes reveal.

The previous lesson applied one matrix to one vector. This lesson applies one matrix to many vectors at once, which is the same as multiplying two matrices. It also shows what happens when you apply two matrices one after the other. This is the end of the module. The next module, [Rate of change](/courses/math-from-zero/change-and-gradients/rate-of-change), starts the calculus you need to train the layer you build here.

:::video
id: XkY2DOUCWMU
why: Watch the first 7 minutes. It shows that multiplying two matrices means doing one transformation after another.
:::

## The idea with an example

> **Analogy.** A matrix times a vector is like a vending machine: coins go in, a snack comes out. Multiplying two matrices is like putting two machines in a row. The output of the first becomes the input of the second. One combined machine does the work of both. The order matters: a machine that toasts bread and then butters it gives a different result from one that butters and then toasts.

Start with a 2 by 2 matrix and a 2 by 1 vector. A vector with 2 components is a matrix with 2 rows and 1 column when you stand it up. Use

$$A = \\begin{bmatrix} 1 & 2 \\\\ 3 & 4 \\end{bmatrix}, \\quad x = \\begin{bmatrix} 5 \\\\ 6 \\end{bmatrix}$$

In words: A has first row one, two and second row three, four, and x is the column five, six. The product $Ax$ has one entry per row of A. Row 1 times x: $1 \\times 5 + 2 \\times 6 = 5 + 12 = 17$. Row 2 times x: $3 \\times 5 + 4 \\times 6 = 15 + 24 = 39$. So $Ax = [17, 39]$. In words: A times x is seventeen, thirty-nine. This is the rule from the previous lesson: each output entry is the dot product of a row of A with x.

Now multiply two matrices. Use A and

$$B = \\begin{bmatrix} 1 & 0 \\\\ 2 & 1 \\end{bmatrix}$$

In words: B has first row one, zero and second row two, one. The product $AB$ is a 2 by 2 matrix. Each entry is the dot product of one row of A with one column of B. The columns of B are $[1, 2]$ and $[0, 1]$. Compute all four entries.

Row 1 of A with column 1 of B: $1 \\times 1 + 2 \\times 2 = 5$. Row 1 of A with column 2 of B: $1 \\times 0 + 2 \\times 1 = 2$. Row 2 of A with column 1 of B: $3 \\times 1 + 4 \\times 2 = 11$. Row 2 of A with column 2 of B: $3 \\times 0 + 4 \\times 1 = 4$. So

$$AB = \\begin{bmatrix} 5 & 2 \\\\ 11 & 4 \\end{bmatrix}$$

In words: A B has first row five, two and second row eleven, four. The entry in row i and column j of the product is row i of the left matrix dotted with column j of the right matrix. Press Next to see each entry.

:::scenario
title: Multiply A by B entry by entry
state: A row 1=[1 2], A row 2=[3 4], B col 1=[1 2], B col 2=[0 1]
step: Row 1 of A with column 1 of B: 1 times 1 plus 2 times 2 is 5. Write it in row 1 column 1.
state: AB row 1=[5 ?]
step: Row 1 of A with column 2 of B: 1 times 0 plus 2 times 1 is 2. Write it in row 1 column 2.
state: AB row 1=[5 2]
step: Row 2 of A with column 1 of B: 3 times 1 plus 4 times 2 is 11. Write it in row 2 column 1.
state: AB row 2=[11 ?]
step: Row 2 of A with column 2 of B: 3 times 0 plus 4 times 1 is 4. Write it in row 2 column 2.
state: AB row 2=[11 4]
step: Read the result: first row 5 and 2, second row 11 and 4.
:::

Now swap the order and compute $BA$. Row 1 of B with column 1 of A: $1 \\times 1 + 0 \\times 3 = 1$. Row 1 of B with column 2 of A: $1 \\times 2 + 0 \\times 4 = 2$. Row 2 of B with column 1 of A: $2 \\times 1 + 1 \\times 3 = 5$. Row 2 of B with column 2 of A: $2 \\times 2 + 1 \\times 4 = 8$. So $BA$ has first row one, two and second row five, eight. That is not the same as $AB$. Matrix multiplication is non-commutative, which means the order changes the result. For ordinary numbers, 3 times 4 equals 4 times 3. For matrices, this rule fails. The grid shows both products side by side.

:::matrix
title: The entries of AB (left two columns) and BA (right two columns)
cols: AB col 1, AB col 2, BA col 1, BA col 2
row 1: 5, 2, 1, 2
row 2: 11, 4, 5, 8
:::

## How it works

The shape rule comes first. You can multiply an $m \\times n$ matrix by an $n \\times p$ matrix, and the result is $m \\times p$. In words: the column count of the left matrix must equal the row count of the right matrix, and the result takes its rows from the left and its columns from the right. The inner numbers must match and then disappear. If they do not match, the product does not exist.

| Left shape | Right shape | Inner numbers match? | Result shape |
| --- | --- | --- | --- |
| 2 by 2 | 2 by 1 | yes, 2 and 2 | 2 by 1 |
| 2 by 2 | 2 by 2 | yes, 2 and 2 | 2 by 2 |
| 3 by 2 | 2 by 4 | yes, 2 and 2 | 3 by 4 |
| 2 by 3 | 2 by 3 | no, 3 and 2 | no product |
| 1 by 3 | 3 by 1 | yes, 3 and 3 | 1 by 1, a single number |

The last row is the dot product in disguise. A 1 by 3 row times a 3 by 1 column gives one number. Every entry of a matrix product is one such dot product.

To compute a product $C = AB$ by hand, follow four steps.

1. Check the shape rule. Write the shape of the result and draw an empty grid of that shape.
2. For the entry in row i and column j, take row i of A and column j of B.
3. Multiply matching components and add the products. Write the number in the grid.
4. Repeat for every cell.

The general formula is:

$$C_{ij} = A_{i1} B_{1j} + A_{i2} B_{2j} + \\cdots + A_{in} B_{nj}$$

In words: the entry of C in row i and column j is the sum over k of A in row i column k times B in row k column j. For a 2 by 2 product you compute 4 entries with 2 products each, so 8 multiplications. For a 1000 by 1000 product you compute a million entries with 1000 products each, so a billion multiplications. That is why GPUs exist.

Multiplying two matrices also means applying two transformations in a row. The product $AB$ applied to a vector x gives $A(Bx)$: first B moves x, then A moves the result. Read it from right to left. That is why the order matters. The flow shows the two paths.

:::flow
title: Two matrices in a row
x -> Bx: apply B first
Bx -> A(Bx): then apply A
x -> (AB)x: or apply the product AB once
A(Bx) -> Same result: equal
(AB)x -> Same result: equal
:::

Now build a tiny neural network layer. A linear layer takes an input vector, multiplies it by a weight matrix, and adds a bias vector. The weight matrix holds the numbers the model learns. The bias is a vector of constants added at the end. Use an input $x = [2, 1]$ with 2 features, a weight matrix with one row per neuron,

$$W = \\begin{bmatrix} 1 & 2 \\\\ 0 & 3 \\end{bmatrix}, \\quad b = \\begin{bmatrix} 1 \\\\ -2 \\end{bmatrix}$$

In words: W has first row one, two and second row zero, three, and the bias b is one, minus two. First compute $Wx$. Row 1: $1 \\times 2 + 2 \\times 1 = 4$. Row 2: $0 \\times 2 + 3 \\times 1 = 3$. So $Wx = [4, 3]$. Then add the bias: $[4 + 1, 3 - 2] = [5, 1]$. In words: the layer sends two, one to five, one. Each neuron computed one dot product plus one constant. The layer did both neurons with one matrix multiply. A real layer with 4096 inputs and 4096 neurons uses a 4096 by 4096 weight matrix and does the same thing.

:::code
lang: python
file: matmul.py
import numpy as np

A = np.array([[1, 2], [3, 4]])
B = np.array([[1, 0], [2, 1]])
x = np.array([5, 6])

print("A @ x =", A @ x)
print("A @ B =")
print(A @ B)
print("B @ A =")
print(B @ A)
print("shapes:", (np.ones((3, 2)) @ np.ones((2, 4))).shape)

# a tiny linear layer: 2 inputs, 2 neurons
W = np.array([[1, 2], [0, 3]])
b = np.array([1, -2])
inp = np.array([2, 1])
print("layer output =", W @ inp + b)
:::

:::code
lang: text
A @ x = [17 39]
A @ B =
[[ 5  2]
 [11  4]]
B @ A =
[[1 2]
 [5 8]]
shapes: (3, 4)
layer output = [5 1]
:::

The bars compare the number of multiplications for products of growing size. Each entry costs n multiplications, and there are n times n entries.

:::bars
title: Multiplications in an n by n times n by n product
unit: operations
n = 2: 8
n = 4: 64
n = 8: 512
n = 16: 4096
:::

## Try it

:::exercise
title: A layer with 3 neurons
task: A linear layer has 2 inputs and 3 neurons. Its weight matrix is W = [[1, 0], [1, 1], [2, -1]] and its bias is b = [0, 1, 1]. First use the shape rule to say what shape W must have and what dimension the output has. Then compute the output for the input x = [3, 2] by hand. Check with NumPy.
hint: W has one row per neuron and one column per input, so it is 3 by 2. Each output component is one row of W dotted with x, plus the matching bias.
lang: python
solution:
import numpy as np

W = np.array([[1, 0],
              [1, 1],
              [2, -1]])
b = np.array([0, 1, 1])
x = np.array([3, 2])

print(W.shape)       # (3, 2)
print(W @ x + b)     # [3 6 5]
:::

By hand: row 1 gives 1 times 3 plus 0 times 2, which is 3, plus bias 0 is 3. Row 2 gives 3 plus 2, which is 5, plus 1 is 6. Row 3 gives 6 minus 2, which is 4, plus 1 is 5. The output [3, 6, 5] has dimension 3, one component per neuron.

## Common mistakes

- Mistake: you multiply matching entries, so A times B gives [[1, 0], [6, 4]]. Fix: each entry is a full dot product of a row with a column, not one product of two entries.
- Mistake: you assume AB equals BA. Fix: compute both when the order matters. In this lesson AB has first row 5, 2 and BA has first row 1, 2.
- Mistake: you multiply a 2 by 3 matrix by another 2 by 3 matrix. Fix: the inner numbers must match. A 2 by 3 times a 3 by 2 works and gives 2 by 2.
- Mistake: you dot a row of the left matrix with a row of the right matrix. Fix: rows of the left matrix go with columns of the right matrix.
- Mistake: you forget the bias and report [4, 3] as the layer output. Fix: a linear layer adds the bias after the matrix multiply, giving [5, 1].

## Check your understanding

:::quiz
title: Check: matrix multiplication
q: What is the shape of a 3 by 2 matrix times a 2 by 5 matrix?
- 2 by 2
- 5 by 3
* 3 by 5
- The product does not exist
why: The inner numbers 2 and 2 match and disappear, leaving the outer numbers 3 and 5.
q: Compute [[2, 1], [0, 1]] times the vector [3, 4].
- [6, 4]
* [10, 4]
- [6, 5]
- [7, 4]
why: Row 1 gives 2 times 3 plus 1 times 4, which is 10, and row 2 gives 0 times 3 plus 1 times 4, which is 4.
q: What is the entry in row 2, column 1 of [[1, 2], [3, 4]] times [[0, 1], [1, 0]]?
- 3
* 4
- 7
- 1
why: Row 2 of the left matrix is [3, 4] and column 1 of the right matrix is [0, 1], so the entry is 0 plus 4, which is 4.
q: Can you multiply a 2 by 3 matrix by a 2 by 3 matrix?
- Yes, the result is 2 by 3
- Yes, the result is 3 by 3
* No, because 3 does not equal 2
why: The column count of the left matrix, 3, must equal the row count of the right matrix, 2, and it does not.
q: A linear layer has weight matrix [[1, 1], [2, 0]] and bias [0, 1]. What is its output for input [1, 2]?
- [3, 2]
* [3, 3]
- [1, 2]
- [2, 3]
why: The matrix gives [1 plus 2, 2 plus 0] which is [3, 2], and adding the bias gives [3, 3].
:::

## Go further

The 3Blue1Brown lesson on matrix multiplication as composition in the links shows two transformations in a row. The Wikipedia page on matrix multiplication gives the formal definition and its history. The NumPy page for matmul documents the @ operator. The next module, [Rate of change](/courses/math-from-zero/change-and-gradients/rate-of-change), begins calculus, which tells a model how to change the weight matrix to make better predictions.
`,
      links: [
        { label: '3Blue1Brown: Matrix multiplication as composition', url: 'https://www.3blue1brown.com/lessons/matrix-multiplication', kind: 'video' },
        { label: 'Wikipedia: Matrix multiplication', url: 'https://en.wikipedia.org/wiki/Matrix_multiplication', kind: 'article' },
        { label: 'NumPy: numpy.matmul', url: 'https://numpy.org/doc/stable/reference/generated/numpy.matmul.html', kind: 'docs' },
        { label: 'Khan Academy: Multiplying matrices', url: 'https://www.khanacademy.org/math/precalculus/x9e81a4f98389efdf:matrices/x9e81a4f98389efdf:multiplying-matrices-by-matrices/v/matrix-multiplication-intro', kind: 'course' },
      ],
    },
  ],
}
