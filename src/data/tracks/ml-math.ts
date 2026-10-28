import type { Track } from '../types'

export const track: Track = {
  slug: 'ml-math',
  title: 'ML Mathematics',
  tagline: 'The linear algebra, probability, and calculus behind the models.',
  description:
    'Enough mathematics to read any paper on the research track without skipping the equations: linear algebra, calculus, probability, information theory, optimisation, and the path from a linear model to a trained network.',
  accent: 'var(--accent-math)',
  status: 'live',
  level: 'intermediate',
  order: 5,
  audience: 'Learners who finished the maths foundations and want the real derivations behind training.',
  outcome: 'Follow and reproduce the mathematics in machine-learning papers: gradients, probability, optimisation and information theory.',
  prerequisites: ['math-from-zero'],
  modules: [
    {
      slug: 'linear-algebra',
      title: 'Linear algebra',
      description: 'Matrices as maps, eigenvalues, the singular value decomposition, projections, and the chain rule as matrix products.',
      level: 'intermediate',
      lessons: [
        {
          slug: 'matrices-as-maps',
          title: 'Matrices as linear maps',
          summary: 'A matrix is a function that moves vectors, and its columns show where the basis vectors land.',
          minutes: 14,
          objectives: [
            'Compute a matrix-vector product by hand for a 2 by 2 matrix.',
            'Read the columns of a matrix as the images of the basis vectors.',
            'Explain why matrix multiplication is function composition.',
            'Describe a linear layer in a neural network as a linear map.',
          ],
          keyTerms: ['matrix', 'vector', 'linear map', 'basis', 'column space', 'composition', 'linear layer'],
          body: `
## What this lesson covers

This lesson explains a matrix as a function, not as a grid of numbers. The function takes a vector and returns a vector. You will compute where a matrix sends the basis vectors, and you will see why multiplying two matrices composes two functions.

## Why it matters

Every linear layer in a neural network is a matrix. The layer multiplies an input vector by a weight matrix and adds a bias. A model with 32 layers is a chain of 32 such maps with nonlinear steps between them. If you can read a matrix as a map, you can read any architecture diagram and every equation in the research track.

:::video
id: kYB8IZa5AuE
why: Watch the whole video, 11 minutes. It animates the unit square under a matrix and shows the columns as the images of the basis vectors, the same picture as the parallelogram in this lesson.
:::

## The idea with an example

Take the matrix:

$$W = \\begin{pmatrix} 2 & 0 \\\\ 1 & 1 \\end{pmatrix}$$

Apply it to the first basis vector $e_1 = [1, 0]$. The product $W e_1$ is the first column, $[2, 1]$. Apply it to $e_2 = [0, 1]$. The product is the second column, $[0, 1]$. So the matrix sends $e_1$ to $[2, 1]$ and $e_2$ to $[0, 1]$. The columns are the images of the basis vectors.

The grid shows the matrix W with one column for each basis vector image.

:::matrix
title: The matrix W, one column per basis vector image
cols: image of e1, image of e2
row 1: 2, 0
row 2: 1, 1
:::

Now apply $W$ to any vector, say $x = [3, 2]$. Write $x$ as $3 e_1 + 2 e_2$. The map is linear, so $W x = 3 W e_1 + 2 W e_2 = 3 [2, 1] + 2 [0, 1] = [6, 5]$. Check by the usual rule: row 1 gives $2 \\times 3 + 0 \\times 2 = 6$, and row 2 gives $1 \\times 3 + 1 \\times 2 = 5$. Both methods agree.

Press Next to compute W x by hand.

:::scenario
title: Compute W x for x = [3, 2]
state: x=[3 2], W e1=[2 1], W e2=[0 1]
step: Write x as 3 times e1 plus 2 times e2.
step: Scale the first column by 3 and the second column by 2.
state: 3 W e1=[6 3], 2 W e2=[0 2]
step: Add the two scaled columns. The result is [6, 5].
state: W x=[6 5]
step: Check with the row rule. Row 1 gives 2 times 3 plus 0 times 2. Row 2 gives 1 times 3 plus 1 times 2.
state: row 1=6, row 2=5
:::

Picture the unit square with corners at $[0, 0]$, $[1, 0]$, $[0, 1]$, and $[1, 1]$. The map sends it to a parallelogram with corners at $[0, 0]$, $[2, 1]$, $[0, 1]$, and $[2, 2]$. The map stretches and shears the plane. Every linear map does something of this kind: it keeps the origin fixed, keeps lines straight, and keeps parallel lines parallel.

The table lists each corner of the unit square and the point where the map sends it.

| Corner | Image under W |
| --- | --- |
| [0, 0] | [0, 0] |
| [1, 0] | [2, 1] |
| [0, 1] | [0, 1] |
| [1, 1] | [2, 2] |

## How it works


:::anim
title: Compute W x for x = [3, 2]
# Worked values and narration follow the scenario in this lesson.
text heading "Compute W x for x = [3, 2]" @ 480,48 size: 23 color: white
text legend "WORKED EXAMPLE · FOLLOW EACH CHANGE" @ 480,80 size: 13 color: grey
num scene = 1 @ 850,145 prefix: "Scene " size: 16 color: grey
dot cursor @ 100,145 r: 8 color: blue
dot mark0 @ 100,145 r: 3 color: grey
dot mark1 @ 250,145 r: 3 color: grey
dot mark2 @ 400,145 r: 3 color: grey
dot mark3 @ 550,145 r: 3 color: grey
dot mark4 @ 700,145 r: 3 color: grey
rect card0 @ 180,255 size: 260x120 color: blue
text key0 "" @ 180,222 size: 16 color: grey
text value0 "" @ 180,267 size: 20 color: white
rect card1 @ 480,255 size: 260x120 color: blue
text key1 "" @ 480,222 size: 16 color: grey
text value1 "" @ 480,267 size: 20 color: white
rect card2 @ 780,255 size: 260x120 color: blue
text key2 "" @ 780,222 size: 16 color: grey
text value2 "" @ 780,267 size: 20 color: white
rect card3 @ 180,405 size: 260x120 color: blue
text key3 "" @ 180,372 size: 16 color: grey
text value3 "" @ 180,417 size: 20 color: white
rect card4 @ 480,405 size: 260x120 color: blue
text key4 "" @ 480,372 size: 16 color: grey
text value4 "" @ 480,417 size: 20 color: white
rect card5 @ 780,405 size: 260x120 color: blue
text key5 "" @ 780,372 size: 16 color: grey
text value5 "" @ 780,417 size: 20 color: white

step: Start with the example's initial values.
  show heading, legend, scene, cursor, mark0, mark1, mark2, mark3, mark4, card0, key0, value0, card1, key1, value1, card2, key2, value2, card3, key3, value3, card4, key4, value4, card5, key5, value5
  label key0 "x"
  & label value0 "[3 2]"
  & highlight card0
  label key1 "W e1"
  & label value1 "[2 1]"
  & highlight card1
  label key2 "W e2"
  & label value2 "[0 1]"
  & highlight card2

step: Write x as 3 times e1 plus 2 times e2.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 250,145 (0.6s)
  & count scene -> 2 (0.6s)
  label key0 "x"
  & label value0 "[3 2]"
  label key1 "W e1"
  & label value1 "[2 1]"
  label key2 "W e2"
  & label value2 "[0 1]"

step: Scale the first column by 3 and the second column by 2.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 400,145 (0.6s)
  & count scene -> 3 (0.6s)
  label key0 "3 W e1"
  & label value0 "[6 3]"
  & highlight card0
  label key1 "2 W e2"
  & label value1 "[0 2]"
  & highlight card1
  label key2 "x"
  & label value2 "[3 2]"
  label key3 "W e1"
  & label value3 "[2 1]"
  label key4 "W e2"
  & label value4 "[0 1]"

step: Add the two scaled columns.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 550,145 (0.6s)
  & count scene -> 4 (0.6s)
  label key0 "W x"
  & label value0 "[6 5]"
  & highlight card0
  label key1 "3 W e1"
  & label value1 "[6 3]"
  label key2 "2 W e2"
  & label value2 "[0 2]"
  label key3 "x"
  & label value3 "[3 2]"
  label key4 "W e1"
  & label value4 "[2 1]"
  label key5 "W e2"
  & label value5 "[0 1]"

step: Check with the row rule.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 700,145 (0.6s)
  & count scene -> 5 (0.6s)
  label key0 "row 1"
  & label value0 "6"
  & highlight card0
  label key1 "row 2"
  & label value1 "5"
  & highlight card1
  label key2 "W x"
  & label value2 "[6 5]"
  label key3 "3 W e1"
  & label value3 "[6 3]"
  label key4 "2 W e2"
  & label value4 "[0 2]"
  label key5 "x"
  & label value5 "[3 2]"
:::

A matrix $W$ with $m$ rows and $n$ columns is a map from $\\mathbb{R}^n$ to $\\mathbb{R}^m$:

$$y = W x, \\qquad y_i = \\sum_{j=1}^{n} W_{ij}\\, x_j$$

$x$ is the input vector with $n$ entries. $y$ is the output vector with $m$ entries. $W_{ij}$ is the entry in row $i$ and column $j$. The sum says that output $i$ is a weighted combination of all inputs, with the weights from row $i$.

A map is linear when it satisfies two rules:

- $W(x + z) = W x + W z$ for any vectors $x$ and $z$.
- $W(c x) = c\\, W x$ for any number $c$.

The set of all outputs $W x$ is the column space. It is the span of the columns. If the columns are not independent, the column space is smaller than $\\mathbb{R}^m$, and the map loses information.

Matrix multiplication is composition. If $A$ maps $\\mathbb{R}^n$ to $\\mathbb{R}^m$ and $B$ maps $\\mathbb{R}^m$ to $\\mathbb{R}^p$, then $BA$ maps $\\mathbb{R}^n$ to $\\mathbb{R}^p$. It applies $A$ first and $B$ second. The order matters: $AB$ and $BA$ are different maps, and one of them may not even be defined.

The diagram shows the input vector pass through A and then through B.

:::flow
title: The product B A applies A first and B second
x in R^n -> Map A: input x
Map A -> Map B: A x in R^m
Map B -> y in R^p: B A x
:::

To compute a product $BA$ by hand:

1. Check that the number of columns of $B$ equals the number of rows of $A$.
2. For each column $a_j$ of $A$, compute $B a_j$.
3. Place the result as column $j$ of $BA$.

A linear layer computes $y = W x + b$. The bias $b$ shifts the output, so the layer is affine, not strictly linear. A network stacks layers with a nonlinearity between them, because a stack of linear maps with no nonlinearity is one linear map.

Note: a weight matrix of shape 4096 by 4096 is a map from 4096 inputs to 4096 outputs with 16.8 million entries.

The bars compare the entry count of that matrix with the entry count of its bias.

:::bars
title: Weights in one 4096 by 4096 linear layer
Matrix entries: 16777216
Bias entries: 4096
:::

The program computes the lesson's example.

:::code
lang: python
file: matrices_as_maps.py
import numpy as np

W = np.array([[2, 0],
              [1, 1]])
e1 = np.array([1, 0])
e2 = np.array([0, 1])
x = np.array([3, 2])

print("W e1 =", W @ e1)          # first column [2 1]
print("W e2 =", W @ e2)          # second column [0 1]
print("W x  =", W @ x)           # [6 5]
print("3 W e1 + 2 W e2 =", 3 * (W @ e1) + 2 * (W @ e2))

# matrix multiplication is composition: apply W, then B
B = np.array([[0, 1],
              [1, 0]])          # swaps the two coordinates
print("B (W x) =", B @ (W @ x))
print("(B W) x =", (B @ W) @ x)
print("W B == B W ?", np.array_equal(W @ B, B @ W))
:::

## Try it

:::exercise
title: Apply W to new vectors and compose it with itself
task: Use the matrix W from the lesson, with rows [2, 0] and [1, 1]. Compute W x by hand for x = [1, 1] and for x = [-1, 2], once by scaling the columns and once by the row rule. Then compute the matrix W W by placing W times each column of W side by side. Check that (W W) x equals W (W x) for x = [3, 2]. Confirm every result with NumPy.
hint: W x for x = [1, 1] is column 1 plus column 2. For the product W W, the first column is W applied to [2, 1] and the second column is W applied to [0, 1].
lang: python
solution:
import numpy as np

W = np.array([[2, 0],
              [1, 1]])
# by hand: W [1, 1] = [2, 1] + [0, 1] = [2, 2]
# by hand: W [-1, 2] = -[2, 1] + 2 [0, 1] = [-2, 1]
print(W @ np.array([1, 1]))     # [2 2]
print(W @ np.array([-1, 2]))    # [-2 1]

# W W: first column is W [2, 1] = [4, 3], second is W [0, 1] = [0, 1]
WW = W @ W
print(WW)                        # [[4 0] [3 1]]
x = np.array([3, 2])
print(WW @ x, W @ (W @ x))       # both [12 11]
:::

## Common mistakes

- Mistake: you read $W x$ as row times vector in the wrong order. Fix: output $i$ uses row $i$ of $W$.
- Mistake: you assume $AB = BA$. Fix: check the shapes and compute both; they differ in general.
- Mistake: you stack linear layers with no nonlinearity. Fix: the stack collapses to one matrix; add a nonlinearity.
- Mistake: you forget the bias when you count weights. Fix: a layer has $mn + m$ weights.

## Check your understanding

Answer each question before you open the explanation.

:::quiz
title: Check: matrices as maps
q: What is the first column of a matrix W?
- The output of W for the input [1, 1]
* The image of the first basis vector e1
- The first row of W transposed
why: W e1 picks out column 1, so the columns are the images of the basis vectors.
q: With W having rows [2, 0] and [1, 1], what is W x for x = [1, 1]?
- [2, 1]
* [2, 2]
- [3, 1]
- [1, 2]
why: Column 1 plus column 2 is [2, 1] + [0, 1] = [2, 2].
q: What does the product B A do to an input vector?
- It applies B first and then A
* It applies A first and then B
- It applies A and B at the same time and adds the results
why: Matrix multiplication is composition, and the matrix nearest the vector acts first.
q: A layer maps 300 inputs to 200 outputs. How many weights does it have, including the bias?
- 500
- 60,000
* 60,200
- 90,000
why: The matrix has 200 times 300 = 60,000 entries and the bias adds 200 more.
q: Three linear layers are stacked with no nonlinearity between them. What does the stack compute?
* One linear map, the product of the three matrices
- A curved boundary with three bends
- A map that is linear only for small inputs
why: A product of linear maps is a linear map, so without a nonlinearity depth adds nothing.
:::

## Go further

The 3Blue1Brown series on linear algebra shows every idea in this lesson as an animation. Strang's course at MIT OpenCourseWare builds the subject from the column picture. The Mathematics for Machine Learning book has a chapter on linear maps with exercises. Immersive Linear Algebra lets you drag the vectors.
`,
          links: [
            { label: '3Blue1Brown', url: 'https://www.youtube.com/@3blue1brown', kind: 'video' },
            { label: 'MIT 18.06 Linear Algebra (Strang)', url: 'https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/', kind: 'course' },
            { label: 'Mathematics for Machine Learning (book)', url: 'https://mml-book.github.io/', kind: 'article' },
            { label: 'Immersive Linear Algebra', url: 'http://immersivemath.com/ila/index.html', kind: 'article' },
          ],
        },
        {
          slug: 'eigenvalues',
          title: 'Eigenvalues and eigenvectors',
          summary: 'An eigenvector keeps its direction under a map, and its eigenvalue says how much the map stretches it.',
          minutes: 16,
          objectives: [
            'Compute the eigenvalues of a 2 by 2 matrix from the characteristic equation.',
            'Find an eigenvector for a given eigenvalue.',
            'Explain what repeated multiplication by a matrix does to a vector.',
            'Connect eigenvalues to the stability of a recurrence and to the curvature of a loss.',
          ],
          keyTerms: ['eigenvalue', 'eigenvector', 'characteristic equation', 'diagonalisation', 'symmetric matrix', 'Hessian'],
          body: `
## What this lesson covers

This lesson explains eigenvalues and eigenvectors. For a square matrix, an eigenvector is a direction that the map does not rotate. The eigenvalue is the factor by which the map stretches that direction. You will compute both for a 2 by 2 matrix.

## Why it matters

Eigenvalues explain what happens when a map is applied many times. A recurrent network applies the same matrix at every step, and the eigenvalues decide whether the state explodes or fades. The Hessian, the matrix of second derivatives of the loss, has eigenvalues that set the largest safe learning rate. Principal component analysis uses the eigenvectors of the covariance matrix.

:::video
id: PFDu9oVAE-g
why: Watch the whole video, 17 minutes. Look for the moment the animation shows a vector that keeps its line while the rest of the plane turns; that line is an eigenvector and the stretch factor is its eigenvalue.
:::

## The idea with an example

Take the matrix:

$$A = \\begin{pmatrix} 2 & 1 \\\\ 1 & 2 \\end{pmatrix}$$

Apply it to $v = [1, 1]$. The result is $[3, 3] = 3 v$. The map stretched $v$ by 3 and did not turn it. So $[1, 1]$ is an eigenvector with eigenvalue 3.

Apply it to $u = [1, -1]$. The result is $[1, -1] = 1 u$. So $[1, -1]$ is an eigenvector with eigenvalue 1.

The grid shows the matrix A.

:::matrix
title: The symmetric matrix A
cols: col 1, col 2
row 1: 2, 1
row 2: 1, 2
:::

Now apply $A$ to a vector that is not an eigenvector, say $x = [1, 0]$. Write $x$ in terms of the eigenvectors: $x = \\tfrac{1}{2} v + \\tfrac{1}{2} u$. Then $A x = \\tfrac{1}{2} (3 v) + \\tfrac{1}{2} (1 u) = [2, 1]$. Apply $A$ ten times: $A^{10} x = \\tfrac{1}{2} 3^{10} v + \\tfrac{1}{2} u$. The first term is about 29,500 times $v$ and the second is still $\\tfrac{1}{2} u$. After many steps, the output points almost exactly along $v$. The largest eigenvalue wins.

Press Next to apply A to x step by step.

:::scenario
title: Repeated multiplication of x = [1, 0] by A
state: x=[1 0], v part=0.5, u part=0.5
step: Write x as half of v plus half of u.
step: Apply A once. The v part grows by 3 and the u part stays the same. The result is [2, 1].
state: A x=[2 1], v part=1.5, u part=0.5
step: Apply A again. The v part is now 4.5 times v. The result is [5, 4].
state: A^2 x=[5 4], v part=4.5, u part=0.5
step: After ten applications the v part is about 29,500 and the u part is still 0.5. The output points along v.
state: A^10 x=[29525 29524], v part=29524.5, u part=0.5
:::

The bars compare the growth of each eigenvector direction after ten steps.

:::bars
title: Growth factor after ten applications of A
Direction v (eigenvalue 3): 59049
Direction u (eigenvalue 1): 1
:::

That is the whole story of repeated multiplication. Each eigenvector direction grows or shrinks by its own eigenvalue, and the largest one dominates.

## How it works


:::anim
title: Repeated multiplication of x = [1, 0] by A
# Worked values and narration follow the scenario in this lesson.
text heading "Repeated multiplication of x = [1, 0] by A" @ 480,48 size: 23 color: white
text legend "WORKED EXAMPLE · FOLLOW EACH CHANGE" @ 480,80 size: 13 color: grey
num scene = 1 @ 850,145 prefix: "Scene " size: 16 color: grey
dot cursor @ 100,145 r: 8 color: blue
dot mark0 @ 100,145 r: 3 color: grey
dot mark1 @ 250,145 r: 3 color: grey
dot mark2 @ 400,145 r: 3 color: grey
dot mark3 @ 550,145 r: 3 color: grey
dot mark4 @ 700,145 r: 3 color: grey
rect card0 @ 180,255 size: 260x120 color: blue
text key0 "" @ 180,222 size: 16 color: grey
text value0 "" @ 180,267 size: 20 color: white
rect card1 @ 480,255 size: 260x120 color: blue
text key1 "" @ 480,222 size: 16 color: grey
text value1 "" @ 480,267 size: 20 color: white
rect card2 @ 780,255 size: 260x120 color: blue
text key2 "" @ 780,222 size: 16 color: grey
text value2 "" @ 780,267 size: 20 color: white
rect card3 @ 180,405 size: 260x120 color: blue
text key3 "" @ 180,372 size: 16 color: grey
text value3 "" @ 180,417 size: 20 color: white
rect card4 @ 480,405 size: 260x120 color: blue
text key4 "" @ 480,372 size: 16 color: grey
text value4 "" @ 480,417 size: 20 color: white
rect card5 @ 780,405 size: 260x120 color: blue
text key5 "" @ 780,372 size: 16 color: grey
text value5 "" @ 780,417 size: 20 color: white

step: Start with the example's initial values.
  show heading, legend, scene, cursor, mark0, mark1, mark2, mark3, mark4, card0, key0, value0, card1, key1, value1, card2, key2, value2, card3, key3, value3, card4, key4, value4, card5, key5, value5
  label key0 "x"
  & label value0 "[1 0]"
  & highlight card0
  label key1 "v part"
  & label value1 "0.5"
  & highlight card1
  label key2 "u part"
  & label value2 "0.5"
  & highlight card2

step: Write x as half of v plus half of u.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 250,145 (0.6s)
  & count scene -> 2 (0.6s)
  label key0 "x"
  & label value0 "[1 0]"
  label key1 "v part"
  & label value1 "0.5"
  label key2 "u part"
  & label value2 "0.5"

step: Apply A once.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 400,145 (0.6s)
  & count scene -> 3 (0.6s)
  label key0 "A x"
  & label value0 "[2 1]"
  & highlight card0
  label key1 "v part"
  & label value1 "1.5"
  & highlight card1
  label key2 "u part"
  & label value2 "0.5"
  label key3 "x"
  & label value3 "[1 0]"

step: Apply A again.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 550,145 (0.6s)
  & count scene -> 4 (0.6s)
  label key0 "A^2 x"
  & label value0 "[5 4]"
  & highlight card0
  label key1 "v part"
  & label value1 "4.5"
  & highlight card1
  label key2 "u part"
  & label value2 "0.5"
  label key3 "A x"
  & label value3 "[2 1]"
  label key4 "x"
  & label value4 "[1 0]"

step: After ten applications the v part is about 29,500 and the u part is still 0.5.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 700,145 (0.6s)
  & count scene -> 5 (0.6s)
  label key0 "A^10 x"
  & label value0 "[29525 29524]"
  & highlight card0
  label key1 "v part"
  & label value1 "29524.5"
  & highlight card1
  label key2 "u part"
  & label value2 "0.5"
  label key3 "A^2 x"
  & label value3 "[5 4]"
  label key4 "A x"
  & label value4 "[2 1]"
  label key5 "x"
  & label value5 "[1 0]"
:::

The definition is:

$$A v = \\lambda v, \\qquad v \\neq 0$$

$A$ is a square matrix. $v$ is an eigenvector. $\\lambda$ is the eigenvalue. The equation says the map sends $v$ to a multiple of itself.

To find the eigenvalues of a 2 by 2 matrix by hand:

1. Write $A - \\lambda I$, where $I$ is the identity matrix.
2. Compute its determinant. For a 2 by 2 matrix $\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$ the determinant is $ad - bc$.
3. Set the determinant to zero. This is the characteristic equation.
4. Solve for $\\lambda$.
5. For each $\\lambda$, solve $(A - \\lambda I) v = 0$ for $v$.

For the example: $\\det(A - \\lambda I) = (2 - \\lambda)^2 - 1 = 0$, so $\\lambda = 3$ or $\\lambda = 1$. For $\\lambda = 3$, the equation $(A - 3I) v = 0$ gives $-v_1 + v_2 = 0$, so $v = [1, 1]$ up to scale.

The table lists both eigenpairs of A.

| Eigenvalue | Eigenvector | A times the eigenvector |
| --- | --- | --- |
| 3 | [1, 1] | [3, 3] |
| 1 | [1, -1] | [1, -1] |

A symmetric matrix, one with $A = A^\\top$, always has real eigenvalues and eigenvectors at right angles to each other. Covariance matrices and Hessians are symmetric. For such a matrix, write $A = Q \\Lambda Q^\\top$. $Q$ holds the eigenvectors as columns. $\\Lambda$ is diagonal with the eigenvalues. This is diagonalisation. In the eigenvector basis, the map is a plain stretch along each axis.

Two uses in machine learning:

- Recurrence: a state $h_t = A h_{t-1}$ explodes if any eigenvalue has size above 1 and fades if all have size below 1.
- Curvature: for a loss with Hessian $H$, gradient descent is stable only if the learning rate is below $2 / \\lambda_{\\max}$, where $\\lambda_{\\max}$ is the largest eigenvalue of $H$.

Note: a general matrix can have complex eigenvalues. A rotation by 90 degrees has no real eigenvector, because every direction turns.

The program computes the lesson's example.

:::code
lang: python
file: eigenvalues.py
import numpy as np

A = np.array([[2.0, 1.0],
              [1.0, 2.0]])
values, vectors = np.linalg.eig(A)
print("eigenvalues:", values)              # [3. 1.]
print("eigenvectors (columns):")
print(np.round(vectors, 3))                # [0.707 0.707] and [-0.707 0.707]

v = np.array([1.0, 1.0])
print("A v =", A @ v, "= 3 v")

# repeated multiplication: the largest eigenvalue wins
x = np.array([1.0, 0.0])
for step in range(10):
    x = A @ x
print("A^10 x =", x)                       # [29525 29524]
print("direction:", np.round(x / np.linalg.norm(x), 4))
:::

## Try it

:::exercise
title: Find the eigenpairs of a non-symmetric matrix
task: Take the matrix A with rows [4, 1] and [2, 3]. Write the characteristic equation and solve it for the two eigenvalues. Find an eigenvector for each. Then compute A applied to [1, 0] ten times without a computer: write [1, 0] as a combination of the two eigenvectors and scale each part by its eigenvalue to the power 10. Check the direction of the result with NumPy.
hint: The determinant of A minus lambda I is (4 - lambda)(3 - lambda) - 2. For an eigenvalue, solve (A - lambda I) v = 0 and read off the ratio of v1 to v2.
lang: text
solution:
Characteristic equation: (4 - lambda)(3 - lambda) - 2 = lambda^2 - 7 lambda + 10 = 0.
Roots: lambda = 5 and lambda = 2.

For lambda = 5: (4 - 5) v1 + 1 v2 = 0, so v2 = v1. Eigenvector v = [1, 1].
Check: A [1, 1] = [5, 5] = 5 [1, 1].
For lambda = 2: (4 - 2) v1 + 1 v2 = 0, so v2 = -2 v1. Eigenvector u = [1, -2].
Check: A [1, -2] = [2, -4] = 2 [1, -2].
The two eigenvectors are not at right angles: [1, 1] dot [1, -2] = -1. A is not symmetric.

Write [1, 0] = a v + b u: a + b = 1 and a - 2b = 0, so b = 1/3 and a = 2/3.
A^10 [1, 0] = (2/3) 5^10 v + (1/3) 2^10 u
            = 6510416.7 [1, 1] + 341.3 [1, -2]
            = [6510758, 6509734].
The result points almost exactly along v = [1, 1], because 5^10 is far larger than 2^10.

NumPy check:
import numpy as np
A = np.array([[4.0, 1.0], [2.0, 3.0]])
x = np.array([1.0, 0.0])
for _ in range(10):
    x = A @ x
print(x, x / x.sum())
:::

## Common mistakes

- Mistake: you treat the zero vector as an eigenvector. Fix: eigenvectors are nonzero by definition.
- Mistake: you expect eigenvectors of a non-symmetric matrix to be orthogonal. Fix: only symmetric matrices guarantee that.
- Mistake: you scale the eigenvector and think the eigenvalue changes. Fix: any multiple of an eigenvector has the same eigenvalue.
- Mistake: you compute eigenvalues of a large matrix with the characteristic polynomial. Fix: use a numerical library.

## Check your understanding

Answer each question before you open the explanation.

:::quiz
title: Check: eigenvalues
q: An eigenvector v has eigenvalue 2. What is A applied three times to v?
- 6 v
* 8 v
- 2 v
- v
why: Each application multiplies v by 2, so three applications give 2 times 2 times 2 = 8 times v.
q: What are the eigenvalues of a diagonal matrix with diagonal entries 5, 1, and 0.2?
- Only 5, the largest entry
* 5, 1, and 0.2
- 1, 1, and 1
why: A diagonal matrix stretches each axis by its diagonal entry, so each axis is an eigenvector with that entry as eigenvalue.
q: A recurrent state follows h(t) = A h(t-1). Which eigenvalues of A make the state explode?
* Any eigenvalue with size greater than 1
- Only negative eigenvalues
- Any eigenvalue with size less than 1
why: The part of the state along an eigenvector grows by that eigenvalue every step, so a size above 1 means growth without bound.
q: The largest eigenvalue of the Hessian of a loss is 50. Which learning rate is stable?
- 0.1
- 0.05
* 0.02
why: Gradient descent is stable only below 2 divided by the largest eigenvalue, which is 2 / 50 = 0.04.
q: For which matrices are the eigenvectors guaranteed to be at right angles to each other?
- Any square matrix
* Symmetric matrices
- Matrices with positive entries
- Diagonalisable matrices
why: Symmetric matrices have real eigenvalues and orthogonal eigenvectors; other matrices can have eigenvectors at any angle.
:::

## Go further

The 3Blue1Brown video on eigenvectors gives the geometric picture. Strang's lectures 21 and 22 cover eigenvalues and diagonalisation. The Shlens tutorial on principal component analysis is the standard application. The numpy linear algebra documentation shows how to compute them.
`,
          links: [
            { label: '3Blue1Brown', url: 'https://www.youtube.com/@3blue1brown', kind: 'video' },
            { label: 'MIT 18.06 Linear Algebra (Strang)', url: 'https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/', kind: 'course' },
            { label: 'A Tutorial on Principal Component Analysis (Shlens, 2014)', url: 'https://arxiv.org/abs/1404.1100', kind: 'paper' },
            { label: 'NumPy linear algebra documentation', url: 'https://numpy.org/doc/stable/reference/routines.linalg.html', kind: 'docs' },
          ],
        },
        {
          slug: 'svd-in-depth',
          title: 'The singular value decomposition',
          summary: 'Every matrix is a rotation, a stretch along perpendicular axes, and a rotation, and the stretch factors rank its directions.',
          minutes: 18,
          objectives: [
            'State the singular value decomposition (SVD) and the shape of each factor.',
            'Compute the singular values of a 2 by 2 matrix through its Gram matrix.',
            'Build the best rank-1 approximation of a matrix.',
            'Explain how low-rank adaptation (LoRA) uses the SVD picture.',
          ],
          keyTerms: ['SVD', 'singular value', 'rank', 'low-rank approximation', 'LoRA', 'orthogonal matrix', 'Frobenius norm'],
          body: `
## What this lesson covers

This lesson explains the singular value decomposition (SVD). The SVD works for any matrix, square or not. It splits the matrix into three factors: a rotation, a stretch, and a rotation. You will compute the singular values of a small matrix and build its best low-rank approximation.

## Why it matters

The SVD tells you how much information a matrix carries and in which directions. Low-rank adaptation (LoRA) fine-tunes a model with a rank-8 update because most of the useful change lives in a few directions. Compression, recommendation, and principal component analysis all use the SVD. When a paper says "the update is low rank", this lesson is what it means.

## The idea with an example

Take the matrix:

$$M = \\begin{pmatrix} 3 & 0 \\\\ 4 & 5 \\end{pmatrix}$$

Form the Gram matrix $M^\\top M$:

$$M^\\top M = \\begin{pmatrix} 25 & 20 \\\\ 20 & 25 \\end{pmatrix}$$

This matrix is symmetric. Its eigenvalues are $45$ and $5$, with eigenvectors $[1, 1]$ and $[1, -1]$ scaled to length one. The singular values of $M$ are the square roots: $\\sigma_1 = \\sqrt{45} \\approx 6.71$ and $\\sigma_2 = \\sqrt{5} \\approx 2.24$.

The grid shows the Gram matrix with its symmetric entries.

:::matrix
title: Gram matrix M transpose M
cols: col 1, col 2
row 1: 25, 20
row 2: 20, 25
:::

Press Next to compute the singular values by hand.

:::scenario
title: Singular values of M from the Gram matrix
state: M=[3 0; 4 5]
step: Form M transpose M. Entry (1, 1) is 3 times 3 plus 4 times 4, which is 25. Entry (1, 2) is 4 times 5, which is 20.
state: Gram=[25 20; 20 25]
step: Solve the characteristic equation (25 - lambda)^2 - 400 = 0. The roots are 45 and 5.
state: lambda 1=45, lambda 2=5
step: Take square roots. Sigma 1 is 6.71 and sigma 2 is 2.24.
state: sigma 1=6.71, sigma 2=2.24
step: Find the unit eigenvectors [0.71, 0.71] and [0.71, -0.71]. These are the columns of V.
state: v1=[0.71 0.71], v2=[0.71 -0.71]
step: Compute u1 as M v1 divided by sigma 1, which is [0.32, 0.95]. Compute u2 as M v2 divided by sigma 2, which is [0.95, -0.32].
state: u1=[0.32 0.95], u2=[0.95 -0.32]
:::

Read this as a picture. $M$ takes the unit circle to an ellipse. The long axis of the ellipse has length 6.71. The short axis has length 2.24. The eigenvectors of $M^\\top M$ are the input directions that land on the two axes.

The ratio of the two singular values is 3. The first direction carries three times more stretch than the second. If you keep only the first direction, you keep most of what the matrix does. The sum of squared singular values is $45 + 5 = 50$, and the first direction holds 90 percent of it.

The bars compare the squared singular values.

:::bars
title: Squared singular values of M
Sigma 1 squared: 45 (90 percent)
Sigma 2 squared: 5 (10 percent)
:::

## How it works


:::anim
title: Singular values of M from the Gram matrix
# Worked values and narration follow the scenario in this lesson.
text heading "Singular values of M from the Gram matrix" @ 480,48 size: 23 color: white
text legend "WORKED EXAMPLE · FOLLOW EACH CHANGE" @ 480,80 size: 13 color: grey
num scene = 1 @ 850,145 prefix: "Scene " size: 16 color: grey
dot cursor @ 100,145 r: 8 color: blue
dot mark0 @ 100,145 r: 3 color: grey
dot mark1 @ 220,145 r: 3 color: grey
dot mark2 @ 340,145 r: 3 color: grey
dot mark3 @ 460,145 r: 3 color: grey
dot mark4 @ 580,145 r: 3 color: grey
dot mark5 @ 700,145 r: 3 color: grey
rect card0 @ 180,255 size: 260x120 color: blue
text key0 "" @ 180,222 size: 16 color: grey
text value0 "" @ 180,267 size: 20 color: white
rect card1 @ 480,255 size: 260x120 color: blue
text key1 "" @ 480,222 size: 16 color: grey
text value1 "" @ 480,267 size: 20 color: white
rect card2 @ 780,255 size: 260x120 color: blue
text key2 "" @ 780,222 size: 16 color: grey
text value2 "" @ 780,267 size: 20 color: white
rect card3 @ 180,405 size: 260x120 color: blue
text key3 "" @ 180,372 size: 16 color: grey
text value3 "" @ 180,417 size: 20 color: white
rect card4 @ 480,405 size: 260x120 color: blue
text key4 "" @ 480,372 size: 16 color: grey
text value4 "" @ 480,417 size: 20 color: white
rect card5 @ 780,405 size: 260x120 color: blue
text key5 "" @ 780,372 size: 16 color: grey
text value5 "" @ 780,417 size: 20 color: white

step: Start with the example's initial values.
  show heading, legend, scene, cursor, mark0, mark1, mark2, mark3, mark4, mark5, card0, key0, value0, card1, key1, value1, card2, key2, value2, card3, key3, value3, card4, key4, value4, card5, key5, value5
  label key0 "M"
  & label value0 "[3 0; 4 5]"
  & highlight card0

step: Form M transpose M.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 220,145 (0.6s)
  & count scene -> 2 (0.6s)
  label key0 "Gram"
  & label value0 "[25 20; 20 25]"
  & highlight card0
  label key1 "M"
  & label value1 "[3 0; 4 5]"

step: Solve the characteristic equation (25 - lambda)^2 - 400 = 0.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 340,145 (0.6s)
  & count scene -> 3 (0.6s)
  label key0 "lambda 1"
  & label value0 "45"
  & highlight card0
  label key1 "lambda 2"
  & label value1 "5"
  & highlight card1
  label key2 "Gram"
  & label value2 "[25 20; 20 25]"
  label key3 "M"
  & label value3 "[3 0; 4 5]"

step: Take square roots.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 460,145 (0.6s)
  & count scene -> 4 (0.6s)
  label key0 "sigma 1"
  & label value0 "6.71"
  & highlight card0
  label key1 "sigma 2"
  & label value1 "2.24"
  & highlight card1
  label key2 "lambda 1"
  & label value2 "45"
  label key3 "lambda 2"
  & label value3 "5"
  label key4 "Gram"
  & label value4 "[25 20; 20 25]"
  label key5 "M"
  & label value5 "[3 0; 4 5]"

step: Find the unit eigenvectors [0.71, 0.71] and [0.71, -0.71].
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 580,145 (0.6s)
  & count scene -> 5 (0.6s)
  label key0 "v1"
  & label value0 "[0.71 0.71]"
  & highlight card0
  label key1 "v2"
  & label value1 "[0.71 -0.71]"
  & highlight card1
  label key2 "sigma 1"
  & label value2 "6.71"
  label key3 "sigma 2"
  & label value3 "2.24"
  label key4 "lambda 1"
  & label value4 "45"
  label key5 "lambda 2"
  & label value5 "5"

step: Compute u1 as M v1 divided by sigma 1, which is [0.32, 0.95].
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 700,145 (0.6s)
  & count scene -> 6 (0.6s)
  label key0 "u1"
  & label value0 "[0.32 0.95]"
  & highlight card0
  label key1 "u2"
  & label value1 "[0.95 -0.32]"
  & highlight card1
  label key2 "v1"
  & label value2 "[0.71 0.71]"
  label key3 "v2"
  & label value3 "[0.71 -0.71]"
  label key4 "sigma 1"
  & label value4 "6.71"
  label key5 "sigma 2"
  & label value5 "2.24"
:::

The SVD of an $m \\times n$ matrix is:

$$M = U \\Sigma V^\\top$$

$U$ is an $m \\times m$ orthogonal matrix, a rotation of the output space. $\\Sigma$ is an $m \\times n$ matrix with the singular values on its diagonal, in decreasing order, and zeros elsewhere. $V$ is an $n \\times n$ orthogonal matrix, a rotation of the input space. The map $M$ does three things in order: rotate by $V^\\top$, stretch each axis by $\\sigma_i$, rotate by $U$.

The diagram shows the three steps that M applies to an input vector.

:::flow
title: M = U Sigma V transpose as three steps
Input x -> Rotate by V^T: turn to the axes
Rotate by V^T -> Stretch by Sigma: scale by 6.71 and 2.24
Stretch by Sigma -> Rotate by U: turn to the output
Rotate by U -> Output M x: result
:::

To compute the SVD of a small matrix by hand:

1. Form $M^\\top M$.
2. Find its eigenvalues $\\lambda_i$ and unit eigenvectors $v_i$. These eigenvectors are the columns of $V$.
3. Set $\\sigma_i = \\sqrt{\\lambda_i}$.
4. Compute $u_i = M v_i / \\sigma_i$ for each nonzero $\\sigma_i$. These are the columns of $U$.

The rank of $M$ is the number of nonzero singular values. The best rank-$k$ approximation keeps the first $k$ terms:

$$M_k = \\sum_{i=1}^{k} \\sigma_i\\, u_i\\, v_i^\\top$$

Each term $u_i v_i^\\top$ is a rank-1 matrix. The Eckart-Young theorem says no other rank-$k$ matrix is closer to $M$ in the Frobenius norm, the square root of the sum of squared entries. The error is $\\sqrt{\\sigma_{k+1}^2 + \\dots + \\sigma_r^2}$.

LoRA applies this picture to fine-tuning. A weight update $\\Delta W$ for a 4096 by 4096 matrix has 16.8 million entries. LoRA writes $\\Delta W = B A$ with $B$ of shape 4096 by 8 and $A$ of shape 8 by 4096. That is a rank-8 matrix with 65,536 entries, 256 times fewer. The method works because the measured singular values of real updates fall fast.

The table compares the full update with the rank-8 update.

| Update | Shape | Entries |
| --- | --- | --- |
| Full update | 4096 by 4096 | 16,777,216 |
| LoRA factor B | 4096 by 8 | 32,768 |
| LoRA factor A | 8 by 4096 | 32,768 |
| LoRA total | rank 8 | 65,536 |

The bars compare the two entry counts.

:::bars
title: Entries to train for one 4096 by 4096 weight matrix
Full update: 16777216
LoRA rank 8: 65536 (256 times fewer)
:::

Note: the SVD of a symmetric positive matrix is its eigendecomposition. For a general matrix the two are different, and the SVD always exists.

The program computes the lesson's example.

:::code
lang: python
file: svd.py
import numpy as np

M = np.array([[3.0, 0.0],
              [4.0, 5.0]])
U, s, Vt = np.linalg.svd(M)
print("singular values:", np.round(s, 3))          # [6.708 2.236]
gram_eigs = np.sort(np.linalg.eigvalsh(M.T @ M))[::-1]
print("sqrt of Gram eigenvalues:", np.round(np.sqrt(gram_eigs), 3))

# share of the squared sum held by the first direction
print("share of sigma 1 squared:", s[0] ** 2 / (s ** 2).sum())   # 0.9

# best rank-1 approximation and its error
M1 = s[0] * np.outer(U[:, 0], Vt[0, :])
print("rank-1 approximation:")
print(np.round(M1, 3))
print("Frobenius error:", round(np.linalg.norm(M - M1), 3))  # 2.236 = sigma 2

# rebuild M from the three factors
print("U Sigma V^T == M ?", np.allclose(U @ np.diag(s) @ Vt, M))
:::

## Try it

:::exercise
title: Singular values of a shear
task: Take the shear matrix M with rows [1, 1] and [0, 1]. Form the Gram matrix M transpose M. Solve its characteristic equation and take square roots to get the two singular values. Then compute the share of the squared sum that a rank-1 approximation keeps. Check the singular values with np.linalg.svd.
hint: The Gram matrix has rows [1, 1] and [1, 2]. Its characteristic equation is lambda^2 - 3 lambda + 1 = 0. The roots involve the square root of 5.
lang: text
solution:
M transpose M: entry (1, 1) is 1, entry (1, 2) is 1, entry (2, 2) is 1 + 1 = 2.
Gram = rows [1, 1] and [1, 2].
Characteristic equation: (1 - lambda)(2 - lambda) - 1 = lambda^2 - 3 lambda + 1 = 0.
Roots: lambda = (3 + sqrt 5) / 2 = 2.618 and lambda = (3 - sqrt 5) / 2 = 0.382.
Singular values: sigma 1 = sqrt 2.618 = 1.618 and sigma 2 = sqrt 0.382 = 0.618.
Note that sigma 1 times sigma 2 = 1, which equals the determinant of M.

Squared sum: 2.618 + 0.382 = 3.
Share kept by rank 1: 2.618 / 3 = 0.873, about 87 percent.
Error of the rank-1 approximation in the Frobenius norm: sigma 2 = 0.618.

NumPy check:
import numpy as np
M = np.array([[1.0, 1.0], [0.0, 1.0]])
print(np.linalg.svd(M)[1])      # [1.618 0.618]
:::

## Common mistakes

- Mistake: you use eigenvalues of a non-square matrix. Fix: non-square matrices have no eigenvalues; use singular values.
- Mistake: you keep singular values in random order. Fix: sort them from largest to smallest before truncating.
- Mistake: you confuse rank with size. Fix: a 1000 by 1000 matrix can have rank 1.
- Mistake: you compute $M^\\top M$ in floating point for a large matrix. Fix: it squares the condition number; use a library SVD routine.

## Check your understanding

Answer each question before you open the explanation.

:::quiz
title: Check: the SVD
q: A matrix has singular values 10, 1, and 0.1. What share of the squared sum does a rank-1 approximation keep?
- About 90 percent
* About 99 percent
- About 50 percent
why: The squares are 100, 1, and 0.01, and 100 divided by 101.01 is about 0.99.
q: What are the columns of V in M = U Sigma V transpose?
- The rows of M scaled to length one
* Unit eigenvectors of M transpose M
- The eigenvectors of M
- The columns of M divided by the singular values
why: The SVD recipe finds V from the symmetric Gram matrix M transpose M, and the singular values are the square roots of its eigenvalues.
q: A LoRA update writes Delta W = B A with B of shape 4096 by 8 and A of shape 8 by 4096. What is the rank of Delta W at most?
- 4096
- 16
* 8
- 1
why: A product through an 8-dimensional middle space cannot have rank above 8.
q: What is the Frobenius error of the best rank-k approximation?
* The square root of the sum of the squared singular values after the k-th
- The k-th singular value
- The sum of all singular values divided by k
why: The Eckart-Young theorem gives the error as the root of the squared tail of singular values.
q: What is the rank of a 1000 by 1000 matrix whose every row equals [1, 2, 3, and so on up to 1000]?
- 1000
- 2
* 1
why: Every row is a multiple of one row, so only one singular value is nonzero.
:::

## Go further

Strang's lecture on the SVD is the clearest derivation. The LoRA paper has the measurements of low-rank structure in real updates. The Shlens tutorial connects the SVD to principal component analysis. The PyTorch linalg documentation lists the SVD routine and its options.
`,
          links: [
            { label: 'MIT 18.06 Linear Algebra (Strang)', url: 'https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/', kind: 'course' },
            { label: 'LoRA: Low-Rank Adaptation of Large Language Models (Hu et al., 2021)', url: 'https://arxiv.org/abs/2106.09685', kind: 'paper' },
            { label: 'A Tutorial on Principal Component Analysis (Shlens, 2014)', url: 'https://arxiv.org/abs/1404.1100', kind: 'paper' },
            { label: 'PyTorch torch.linalg documentation', url: 'https://pytorch.org/docs/stable/linalg.html', kind: 'docs' },
          ],
        },
        {
          slug: 'projections',
          title: 'Projections and least squares',
          summary: 'A projection finds the closest point in a subspace, and least squares is a projection of the targets onto the column space.',
          minutes: 15,
          objectives: [
            'Project a vector onto a line by hand.',
            'Write the projection matrix for a subspace from its basis.',
            'Derive the least squares solution as a projection.',
            'Explain why the residual is orthogonal to the subspace.',
          ],
          keyTerms: ['projection', 'orthogonal', 'subspace', 'least squares', 'residual', 'normal equations', 'dot product'],
          body: `
## What this lesson covers

This lesson explains orthogonal projection, the operation that finds the closest point in a subspace to a given vector. It then shows that linear regression by least squares is a projection. You will project a vector onto a line and solve a tiny regression by hand.

## Why it matters

Projection is the geometry behind fitting. Every linear regression, every attention output, and every low-rank approximation is a projection of some kind. Attention projects the input into query, key, and value subspaces. The SVD truncation from the previous lesson is a projection onto the top singular directions. The residual, the part left over, is what the model has not explained.

:::video
id: LyGKycYT2v0
why: Watch the whole video, 14 minutes. It shows the dot product as a projection onto a line, which is the first computation in this lesson, and explains why the formula is symmetric.
:::

## The idea with an example

Take the line through the origin in the direction $a = [1, 2]$. Take the vector $b = [3, 1]$. Which point on the line is closest to $b$?

The closest point is a multiple of $a$, call it $\\hat{b} = c\\, a$. The error $b - c\\, a$ must be perpendicular to the line. Perpendicular means the dot product with $a$ is zero:

$$a \\cdot (b - c\\, a) = 0 \\quad \\Rightarrow \\quad c = \\frac{a \\cdot b}{a \\cdot a} = \\frac{3 + 2}{1 + 4} = 1$$

So $\\hat{b} = [1, 2]$ and the residual is $b - \\hat{b} = [2, -1]$. Check: $[1, 2] \\cdot [2, -1] = 2 - 2 = 0$. The residual is perpendicular to the line.

Press Next to project b onto the line step by step.

:::scenario
title: Project b = [3, 1] onto the line through a = [1, 2]
state: a=[1 2], b=[3 1]
step: Compute the dot product of a and b. It is 1 times 3 plus 2 times 1, which is 5.
state: a dot b=5
step: Compute the dot product of a with itself. It is 1 plus 4, which is 5.
state: a dot a=5
step: Divide. The coefficient c is 5 / 5 = 1.
state: c=1
step: Scale a by c. The projection is [1, 2].
state: projection=[1 2]
step: Subtract the projection from b. The residual is [2, -1], and its dot product with a is 2 - 2 = 0.
state: residual=[2 -1], a dot residual=0
:::

The bars compare the squared lengths of b, its projection, and its residual.

:::bars
title: Squared lengths in the projection of b
b: 10
Projection: 5
Residual: 5
:::

Now a regression. You have three data points $(x, y)$: $(0, 1)$, $(1, 2)$, $(2, 2)$. Fit $y = w x + v$. Write the three equations as a matrix equation $A \\theta = y$ with:

$$A = \\begin{pmatrix} 0 & 1 \\\\ 1 & 1 \\\\ 2 & 1 \\end{pmatrix}, \\quad y = \\begin{pmatrix} 1 \\\\ 2 \\\\ 2 \\end{pmatrix}, \\quad \\theta = \\begin{pmatrix} w \\\\ v \\end{pmatrix}$$

Three equations and two unknowns have no exact solution. The best $\\theta$ makes $A \\theta$ the projection of $y$ onto the column space of $A$. Solve $A^\\top A\\, \\theta = A^\\top y$: $A^\\top A = \\begin{pmatrix} 5 & 3 \\\\ 3 & 3 \\end{pmatrix}$ and $A^\\top y = [6, 5]$. The solution is $w = 0.5$ and $v = 1.17$. The fitted line passes as close as possible to all three points in the squared sense.

The grid shows the Gram matrix for the regression.

:::matrix
title: Gram matrix A transpose A for the three data points
cols: w, v
w: 5, 3
v: 3, 3
:::

The table compares each target with its fitted value.

| x | y | Fitted y | Residual |
| --- | --- | --- | --- |
| 0 | 1 | 1.17 | -0.17 |
| 1 | 2 | 1.67 | 0.33 |
| 2 | 2 | 2.17 | -0.17 |

## How it works


:::anim
title: Project b = [3, 1] onto the line through a = [1, 2]
# Worked values and narration follow the scenario in this lesson.
text heading "Project b = [3, 1] onto the line through a = [1, 2]" @ 480,48 size: 23 color: white
text legend "WORKED EXAMPLE · FOLLOW EACH CHANGE" @ 480,80 size: 13 color: grey
num scene = 1 @ 850,145 prefix: "Scene " size: 16 color: grey
dot cursor @ 100,145 r: 8 color: blue
dot mark0 @ 100,145 r: 3 color: grey
dot mark1 @ 220,145 r: 3 color: grey
dot mark2 @ 340,145 r: 3 color: grey
dot mark3 @ 460,145 r: 3 color: grey
dot mark4 @ 580,145 r: 3 color: grey
dot mark5 @ 700,145 r: 3 color: grey
rect card0 @ 180,255 size: 260x120 color: blue
text key0 "" @ 180,222 size: 16 color: grey
text value0 "" @ 180,267 size: 20 color: white
rect card1 @ 480,255 size: 260x120 color: blue
text key1 "" @ 480,222 size: 16 color: grey
text value1 "" @ 480,267 size: 20 color: white
rect card2 @ 780,255 size: 260x120 color: blue
text key2 "" @ 780,222 size: 16 color: grey
text value2 "" @ 780,267 size: 20 color: white
rect card3 @ 180,405 size: 260x120 color: blue
text key3 "" @ 180,372 size: 16 color: grey
text value3 "" @ 180,417 size: 20 color: white
rect card4 @ 480,405 size: 260x120 color: blue
text key4 "" @ 480,372 size: 16 color: grey
text value4 "" @ 480,417 size: 20 color: white
rect card5 @ 780,405 size: 260x120 color: blue
text key5 "" @ 780,372 size: 16 color: grey
text value5 "" @ 780,417 size: 20 color: white

step: Start with the example's initial values.
  show heading, legend, scene, cursor, mark0, mark1, mark2, mark3, mark4, mark5, card0, key0, value0, card1, key1, value1, card2, key2, value2, card3, key3, value3, card4, key4, value4, card5, key5, value5
  label key0 "a"
  & label value0 "[1 2]"
  & highlight card0
  label key1 "b"
  & label value1 "[3 1]"
  & highlight card1

step: Compute the dot product of a and b.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 220,145 (0.6s)
  & count scene -> 2 (0.6s)
  label key0 "a dot b"
  & label value0 "5"
  & highlight card0
  label key1 "a"
  & label value1 "[1 2]"
  label key2 "b"
  & label value2 "[3 1]"

step: Compute the dot product of a with itself.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 340,145 (0.6s)
  & count scene -> 3 (0.6s)
  label key0 "a dot a"
  & label value0 "5"
  & highlight card0
  label key1 "a dot b"
  & label value1 "5"
  label key2 "a"
  & label value2 "[1 2]"
  label key3 "b"
  & label value3 "[3 1]"

step: Divide.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 460,145 (0.6s)
  & count scene -> 4 (0.6s)
  label key0 "c"
  & label value0 "1"
  & highlight card0
  label key1 "a dot a"
  & label value1 "5"
  label key2 "a dot b"
  & label value2 "5"
  label key3 "a"
  & label value3 "[1 2]"
  label key4 "b"
  & label value4 "[3 1]"

step: Scale a by c.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 580,145 (0.6s)
  & count scene -> 5 (0.6s)
  label key0 "projection"
  & label value0 "[1 2]"
  & highlight card0
  label key1 "c"
  & label value1 "1"
  label key2 "a dot a"
  & label value2 "5"
  label key3 "a dot b"
  & label value3 "5"
  label key4 "a"
  & label value4 "[1 2]"
  label key5 "b"
  & label value5 "[3 1]"

step: Subtract the projection from b.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 700,145 (0.6s)
  & count scene -> 6 (0.6s)
  label key0 "residual"
  & label value0 "[2 -1]"
  & highlight card0
  label key1 "a dot residual"
  & label value1 "0"
  & highlight card1
  label key2 "projection"
  & label value2 "[1 2]"
  label key3 "c"
  & label value3 "1"
  label key4 "a dot a"
  & label value4 "5"
  label key5 "a dot b"
  & label value5 "5"
:::

The projection of $b$ onto the column space of a matrix $A$ with independent columns is:

$$\\hat{b} = A (A^\\top A)^{-1} A^\\top b$$

$A$ holds a basis of the subspace as columns. $A^\\top A$ is the Gram matrix of the basis. The matrix $P = A (A^\\top A)^{-1} A^\\top$ is the projection matrix. It satisfies $P^2 = P$, because projecting twice changes nothing.

The least squares problem minimises $\\| A \\theta - y \\|^2$. Its solution comes from the normal equations:

$$A^\\top A\\, \\theta = A^\\top y$$

$\\theta$ is the vector of weights. The equations say the residual $y - A \\theta$ is orthogonal to every column of $A$.

To solve least squares by hand:

1. Build $A$ with one row per data point and one column per feature, plus a column of ones for the bias.
2. Compute $A^\\top A$ and $A^\\top y$.
3. Solve the normal equations for $\\theta$.
4. Compute the residual and check it is orthogonal to the columns of $A$.

When the columns of $A$ are orthonormal, $A^\\top A = I$, and the projection is $A A^\\top b$. Each coordinate is a dot product $a_i \\cdot b$. That is the case for the SVD basis, which is why truncating the SVD is a projection.

Note: for large problems, solve least squares with a QR or SVD routine, not with the normal equations. The Gram matrix squares the condition number.

The program computes the lesson's example.

:::code
lang: python
file: projections.py
import numpy as np

# project b onto the line through a
a = np.array([1.0, 2.0])
b = np.array([3.0, 1.0])
c = (a @ b) / (a @ a)
proj = c * a
residual = b - proj
print("c =", c, "projection =", proj, "residual =", residual)
print("residual dot a =", residual @ a)       # 0

# least squares for the three points (0, 1), (1, 2), (2, 2)
A = np.array([[0.0, 1.0],
              [1.0, 1.0],
              [2.0, 1.0]])
y = np.array([1.0, 2.0, 2.0])
theta = np.linalg.solve(A.T @ A, A.T @ y)       # normal equations
print("w, v =", np.round(theta, 3))             # [0.5 1.167]
fitted = A @ theta
print("fitted =", np.round(fitted, 3))
print("residual =", np.round(y - fitted, 3))
print("A^T residual =", np.round(A.T @ (y - fitted), 6))   # [0 0]
print("lstsq agrees:", np.allclose(np.linalg.lstsq(A, y, rcond=None)[0], theta))
:::

## Try it

:::exercise
title: Project a vector and fit a line
task: First, project b = [2, 3] onto the line through a = [1, 1] by hand and write the residual. Second, fit the line y = w x + v to the points (0, 0), (1, 1), and (2, 3) with the normal equations. Compute A transpose A and A transpose y, solve the two equations, and list the three residuals. Check that the residual vector is orthogonal to both columns of A. Confirm with NumPy.
hint: For the fit, A has rows [0, 1], [1, 1], [2, 1]. A transpose A has rows [5, 3] and [3, 3]. A transpose y is [7, 4].
lang: python
solution:
import numpy as np

# part 1: c = (a dot b) / (a dot a) = 5 / 2 = 2.5
a = np.array([1.0, 1.0]); b = np.array([2.0, 3.0])
c = (a @ b) / (a @ a)
print(c * a, b - c * a)            # [2.5 2.5] and [-0.5 0.5]

# part 2: 5 w + 3 v = 7 and 3 w + 3 v = 4, so w = 1.5 and v = -1/6
A = np.array([[0.0, 1.0], [1.0, 1.0], [2.0, 1.0]])
y = np.array([0.0, 1.0, 3.0])
theta = np.linalg.solve(A.T @ A, A.T @ y)
print(np.round(theta, 3))          # [1.5 -0.167]
r = y - A @ theta
print(np.round(r, 3))              # [0.167 -0.333 0.167]
print(np.round(A.T @ r, 6))        # [0 0]
:::

## Common mistakes

- Mistake: you project onto a line without dividing by $a \\cdot a$. Fix: the coefficient is $(a \\cdot b) / (a \\cdot a)$.
- Mistake: you forget the column of ones. Fix: without it the fitted line passes through the origin.
- Mistake: you expect the residual to be zero. Fix: with more points than weights, a nonzero residual is normal.
- Mistake: you invert $A^\\top A$ when the columns are dependent. Fix: remove the dependent column or use a pseudo-inverse.

## Check your understanding

Answer each question before you open the explanation.

:::quiz
title: Check: projections and least squares
q: What is the projection of [4, 0] onto the direction [1, 1]?
- [4, 4]
* [2, 2]
- [4, 0]
- [1, 1]
why: The coefficient is (4 + 0) / (1 + 1) = 2, and 2 times [1, 1] is [2, 2].
q: What does P squared equal P mean for a projection matrix P?
* Projecting twice gives the same point as projecting once
- The projection has determinant 1
- The projection is its own inverse
why: Once a vector lies in the subspace, projecting it again leaves it where it is.
q: In least squares, what is the residual y minus A theta orthogonal to?
- The target vector y
* Every column of A
- The vector theta
why: The normal equations say A transpose times the residual is zero, which is orthogonality to each column.
q: You fit a line to 3 points with 2 weights and get a nonzero residual. What does this show?
- The normal equations were solved wrongly
- The columns of A are dependent
* The points do not lie on one line, which is the normal case
why: More equations than unknowns rarely have an exact solution; least squares finds the closest fit.
q: You forget the column of ones in A. What happens to the fitted line?
* It is forced to pass through the origin
- It becomes horizontal
- It fits exactly
why: The column of ones carries the intercept v; without it the model is y = w x with no offset.
:::

## Go further

Strang's lectures 15 and 16 cover projections and least squares in this order. The Mathematics for Machine Learning book has a chapter on projections with the regression application. The 3Blue1Brown series covers the dot product geometry. The scikit-learn documentation shows least squares as a fitted model.
`,
          links: [
            { label: 'MIT 18.06 Linear Algebra (Strang)', url: 'https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/', kind: 'course' },
            { label: 'Mathematics for Machine Learning (book)', url: 'https://mml-book.github.io/', kind: 'article' },
            { label: '3Blue1Brown', url: 'https://www.youtube.com/@3blue1brown', kind: 'video' },
            { label: 'scikit-learn linear models documentation', url: 'https://scikit-learn.org/stable/modules/linear_model.html', kind: 'docs' },
          ],
        },
        {
          slug: 'gradients',
          title: 'Gradients and the chain rule at scale',
          summary: 'Backpropagation multiplies Jacobian matrices in reverse order, which is cheap when there is one output and many inputs.',
          minutes: 17,
          objectives: [
            'Write the chain rule for a chain of linear maps as a product of Jacobians.',
            'Explain why reverse-mode differentiation is cheaper than forward mode for a scalar loss.',
            'Trace a backward pass through a two-layer linear network by hand.',
            'Compute the gradient of a loss with respect to a weight matrix.',
          ],
          keyTerms: ['gradient', 'Jacobian', 'chain rule', 'backpropagation', 'reverse mode', 'vector-Jacobian product', 'automatic differentiation'],
          body: `
## What this lesson covers

This lesson treats the chain rule as matrix multiplication. A network is a chain of maps. Its derivative is a product of Jacobian matrices, one per map. The order in which you multiply them decides the cost. You will trace a backward pass through a two-layer network with small matrices.

## Why it matters

Backpropagation is the algorithm that trains every neural network. It is the chain rule applied in reverse order. The reverse order is the reason training a model with a billion weights costs about twice the forward pass, not a billion times. Automatic differentiation libraries such as PyTorch implement exactly what this lesson traces.

:::video
id: tIeHLnjs5U8
why: Watch the whole video, 10 minutes. It writes out the chain rule for one weight in a tiny network and shows why the gradient at each layer is the product of the factors above it, the same product this lesson writes as matrices.
:::

## The idea with an example

Take a network with input $x \\in \\mathbb{R}^2$, hidden layer $h = W_1 x$, output $y = W_2 h$, and loss $L = \\tfrac{1}{2} \\| y \\|^2$. Use:

$$W_1 = \\begin{pmatrix} 1 & 0 \\\\ 1 & 1 \\end{pmatrix}, \\quad W_2 = \\begin{pmatrix} 2 & 0 \\end{pmatrix}, \\quad x = \\begin{pmatrix} 1 \\\\ 2 \\end{pmatrix}$$

Forward pass: $h = W_1 x = [1, 3]$. Then $y = W_2 h = 2$. Then $L = \\tfrac{1}{2} \\times 4 = 2$.

The diagram shows the forward values and the backward gradients through the two layers.

:::flow
title: Forward pass and backward pass
x -> W1: x = [1, 2]
W1 -> W2: h = [1, 3]
W2 -> Loss: y = 2
Loss -> W2: y bar = 2
W2 -> W1: h bar = [4, 0]
W1 -> x: x bar = [4, 0]
:::

Backward pass. Start from the loss and move toward the input:

1. The derivative of $L$ with respect to $y$ is $y$ itself: $\\bar{y} = 2$.
2. The derivative with respect to $h$ is $\\bar{h} = W_2^\\top \\bar{y} = [4, 0]$.
3. The derivative with respect to $x$ is $\\bar{x} = W_1^\\top \\bar{h} = [4, 0]$.

The bar notation means "gradient of the loss with respect to". Each step multiplies the incoming gradient by the transpose of one weight matrix. The chain runs backward.

The weight gradients come from the same quantities. The gradient with respect to $W_2$ is $\\bar{y}\\, h^\\top = [4, 6]$. The gradient with respect to $W_1$ is $\\bar{h}\\, x^\\top$, a 2 by 2 matrix with first row $[4, 8]$ and second row $[0, 0]$. The second row is zero because $W_2$ ignores the second hidden unit.

Press Next to follow the gradient from the loss back to the input.

:::scenario
title: Backward pass through two linear layers
state: h=[1 3], y=2, L=2
step: Start at the loss. The gradient of L with respect to y is y itself, so y bar is 2.
state: y bar=2
step: Multiply by W2 transpose. W2 is [2, 0], so h bar is [4, 0].
state: h bar=[4 0]
step: Multiply by W1 transpose. Its rows are [1, 1] and [0, 1], so x bar is [4, 0].
state: x bar=[4 0]
step: Form the weight gradient for W2 as y bar times h transpose. It is [4, 6].
state: W2 grad=[4 6]
step: Form the weight gradient for W1 as h bar times x transpose. Row 1 is [4, 8] and row 2 is [0, 0].
state: W1 grad=[4 8; 0 0]
:::

The grid shows the gradient of W1 with its zero second row.

:::matrix
title: Gradient of the loss with respect to W1
cols: col 1, col 2
row 1: 4, 8
row 2: 0, 0
:::

The table lists each quantity in the pass with its shape.

| Quantity | Value | Entries |
| --- | --- | --- |
| x | [1, 2] | 2 |
| h | [1, 3] | 2 |
| y | 2 | 1 |
| y bar | 2 | 1 |
| h bar | [4, 0] | 2 |
| x bar | [4, 0] | 2 |

## How it works


:::anim
title: Backward pass through two linear layers
# Worked values and narration follow the scenario in this lesson.
text heading "Backward pass through two linear layers" @ 480,48 size: 23 color: white
text legend "WORKED EXAMPLE · FOLLOW EACH CHANGE" @ 480,80 size: 13 color: grey
num scene = 1 @ 850,145 prefix: "Scene " size: 16 color: grey
dot cursor @ 100,145 r: 8 color: blue
dot mark0 @ 100,145 r: 3 color: grey
dot mark1 @ 220,145 r: 3 color: grey
dot mark2 @ 340,145 r: 3 color: grey
dot mark3 @ 460,145 r: 3 color: grey
dot mark4 @ 580,145 r: 3 color: grey
dot mark5 @ 700,145 r: 3 color: grey
rect card0 @ 180,255 size: 260x120 color: blue
text key0 "" @ 180,222 size: 16 color: grey
text value0 "" @ 180,267 size: 20 color: white
rect card1 @ 480,255 size: 260x120 color: blue
text key1 "" @ 480,222 size: 16 color: grey
text value1 "" @ 480,267 size: 20 color: white
rect card2 @ 780,255 size: 260x120 color: blue
text key2 "" @ 780,222 size: 16 color: grey
text value2 "" @ 780,267 size: 20 color: white
rect card3 @ 180,405 size: 260x120 color: blue
text key3 "" @ 180,372 size: 16 color: grey
text value3 "" @ 180,417 size: 20 color: white
rect card4 @ 480,405 size: 260x120 color: blue
text key4 "" @ 480,372 size: 16 color: grey
text value4 "" @ 480,417 size: 20 color: white
rect card5 @ 780,405 size: 260x120 color: blue
text key5 "" @ 780,372 size: 16 color: grey
text value5 "" @ 780,417 size: 20 color: white

step: Start with the example's initial values.
  show heading, legend, scene, cursor, mark0, mark1, mark2, mark3, mark4, mark5, card0, key0, value0, card1, key1, value1, card2, key2, value2, card3, key3, value3, card4, key4, value4, card5, key5, value5
  label key0 "h"
  & label value0 "[1 3]"
  & highlight card0
  label key1 "y"
  & label value1 "2"
  & highlight card1
  label key2 "L"
  & label value2 "2"
  & highlight card2

step: Start at the loss.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 220,145 (0.6s)
  & count scene -> 2 (0.6s)
  label key0 "y bar"
  & label value0 "2"
  & highlight card0
  label key1 "h"
  & label value1 "[1 3]"
  label key2 "y"
  & label value2 "2"
  label key3 "L"
  & label value3 "2"

step: Multiply by W2 transpose.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 340,145 (0.6s)
  & count scene -> 3 (0.6s)
  label key0 "h bar"
  & label value0 "[4 0]"
  & highlight card0
  label key1 "y bar"
  & label value1 "2"
  label key2 "h"
  & label value2 "[1 3]"
  label key3 "y"
  & label value3 "2"
  label key4 "L"
  & label value4 "2"

step: Multiply by W1 transpose.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 460,145 (0.6s)
  & count scene -> 4 (0.6s)
  label key0 "x bar"
  & label value0 "[4 0]"
  & highlight card0
  label key1 "h bar"
  & label value1 "[4 0]"
  label key2 "y bar"
  & label value2 "2"
  label key3 "h"
  & label value3 "[1 3]"
  label key4 "y"
  & label value4 "2"
  label key5 "L"
  & label value5 "2"

step: Form the weight gradient for W2 as y bar times h transpose.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 580,145 (0.6s)
  & count scene -> 5 (0.6s)
  label key0 "W2 grad"
  & label value0 "[4 6]"
  & highlight card0
  label key1 "x bar"
  & label value1 "[4 0]"
  label key2 "h bar"
  & label value2 "[4 0]"
  label key3 "y bar"
  & label value3 "2"
  label key4 "h"
  & label value4 "[1 3]"
  label key5 "y"
  & label value5 "2"

step: Form the weight gradient for W1 as h bar times x transpose.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 700,145 (0.6s)
  & count scene -> 6 (0.6s)
  label key0 "W1 grad"
  & label value0 "[4 8; 0 0]"
  & highlight card0
  label key1 "W2 grad"
  & label value1 "[4 6]"
  label key2 "x bar"
  & label value2 "[4 0]"
  label key3 "h bar"
  & label value3 "[4 0]"
  label key4 "y bar"
  & label value4 "2"
  label key5 "h"
  & label value5 "[1 3]"
:::

A chain of maps $x \\to h \\to y \\to L$ has the derivative:

$$\\frac{\\partial L}{\\partial x} = \\frac{\\partial L}{\\partial y}\\, \\frac{\\partial y}{\\partial h}\\, \\frac{\\partial h}{\\partial x}$$

Each factor is a Jacobian, the matrix of all partial derivatives of one map's outputs with respect to its inputs. For a linear map $h = W x$, the Jacobian $\\partial h / \\partial x$ is $W$. For the loss $L$, which is a scalar, $\\partial L / \\partial y$ is a row vector.

The product can be computed in two orders. Forward mode starts at the input and multiplies matrix by matrix. For a layer with $n$ inputs and $n$ outputs, each step costs $n^3$. Reverse mode starts at the loss, where the Jacobian is a single row, and multiplies row by matrix. Each step costs $n^2$. For a scalar loss and millions of inputs, reverse mode wins by a factor of $n$.

The bars compare the cost of one layer step in each mode for n = 1,000.

:::bars
title: Operations per layer for n = 1,000
Forward mode (n cubed): 1000000000
Reverse mode (n squared): 1000000
:::

The operation that reverse mode performs at each layer is the vector-Jacobian product:

$$\\bar{x} = J^\\top \\bar{h}$$

$J$ is the Jacobian of the layer. $\\bar{h}$ is the gradient flowing in from above. $\\bar{x}$ is the gradient flowing out to the layer below. For a linear layer $J = W$, so the product is $W^\\top \\bar{h}$.

To run backpropagation through a chain of linear layers:

1. Run the forward pass and store every intermediate vector.
2. Set $\\bar{y}$ to the gradient of the loss with respect to the output.
3. For each layer from last to first, compute $\\bar{x} = W^\\top \\bar{h}$ and the weight gradient $\\bar{h}\\, x^\\top$.
4. Pass $\\bar{x}$ to the layer below as its $\\bar{h}$.

The stored vectors from step 1 are the memory cost of training. The activation memory grows with batch size and sequence length.

Note: a nonlinearity between layers adds a diagonal Jacobian. The lesson on backpropagation by hand in the last module covers it.

The program computes the lesson's example.

:::code
lang: python
file: backward_two_layers.py
import numpy as np

W1 = np.array([[1.0, 0.0],
               [1.0, 1.0]])
W2 = np.array([[2.0, 0.0]])
x = np.array([1.0, 2.0])

# forward pass, store every intermediate
h = W1 @ x                     # [1 3]
y = W2 @ h                     # [2]
L = 0.5 * (y @ y)              # 2
print("h =", h, "y =", y, "L =", L)

# backward pass: multiply by transposes, last layer first
y_bar = y                      # dL/dy = y
h_bar = W2.T @ y_bar           # [4 0]
x_bar = W1.T @ h_bar           # [4 0]
print("y_bar =", y_bar, "h_bar =", h_bar, "x_bar =", x_bar)

# weight gradients: incoming gradient times input transpose
W2_grad = np.outer(y_bar, h)   # [[4 6]]
W1_grad = np.outer(h_bar, x)   # [[4 8] [0 0]]
print("W2 grad =", W2_grad)
print("W1 grad =")
print(W1_grad)
:::

## Try it

:::exercise
title: Change the output layer and redo the backward pass
task: Keep W1 with rows [1, 0] and [1, 1] and the input x = [1, 2], but change W2 to [1, 1]. Run the forward pass to get h, y, and the loss L = half of y squared. Then run the backward pass by hand: y bar, h bar, x bar, the gradient of W2, and the gradient of W1. Explain in one sentence why the second row of the W1 gradient is no longer zero. Check with NumPy.
hint: h does not change. y bar equals y. h bar is W2 transpose times y bar, which now has two nonzero entries.
lang: python
solution:
import numpy as np

W1 = np.array([[1.0, 0.0], [1.0, 1.0]])
W2 = np.array([[1.0, 1.0]])
x = np.array([1.0, 2.0])
h = W1 @ x                 # [1 3]
y = W2 @ h                 # [4]
L = 0.5 * (y @ y)          # 8
y_bar = y                  # [4]
h_bar = W2.T @ y_bar       # [4 4]
x_bar = W1.T @ h_bar       # [8 4]
print(h, y, L, h_bar, x_bar)
print(np.outer(y_bar, h))  # W2 grad [[4 12]]
print(np.outer(h_bar, x))  # W1 grad [[4 8] [4 8]]
# Row 2 is nonzero because W2 now reads the second hidden unit,
# so the gradient flows back into it.
:::

## Common mistakes

- Mistake: you multiply by $W$ instead of $W^\\top$ in the backward pass. Fix: the backward map is the transpose.
- Mistake: you discard the forward activations. Fix: the weight gradient $\\bar{h}\\, x^\\top$ needs $x$.
- Mistake: you run forward mode to train a network. Fix: with a scalar loss, reverse mode is cheaper by the number of inputs.
- Mistake: you get a gradient matrix of the wrong shape. Fix: the gradient of $W$ has the same shape as $W$.

## Check your understanding

Answer each question before you open the explanation.

:::quiz
title: Check: gradients at scale
q: What is the Jacobian of h = W x with respect to x?
- W transpose
* W
- The identity matrix
- x transpose
why: Each output of a linear map is a row of W dotted with x, so the matrix of partial derivatives is W itself.
q: A network has one scalar loss and one million inputs. Which mode of differentiation is cheaper?
- Forward mode
* Reverse mode
- Both cost the same
why: Reverse mode starts from the single row of the loss and multiplies row by matrix at every layer, which avoids matrix by matrix products.
q: In the lesson's network, h bar is [4, 0] and x is [1, 2]. What is the gradient of W1?
- Rows [4, 0] and [8, 0]
* Rows [4, 8] and [0, 0]
- Rows [4, 0] and [0, 0]
- Rows [1, 2] and [0, 0]
why: The weight gradient is h bar times x transpose, which puts 4 times [1, 2] in row 1 and 0 times [1, 2] in row 2.
q: What is the shape of the gradient of the loss with respect to a 4096 by 1024 weight matrix?
- 1024 by 4096
* 4096 by 1024
- 4096 by 4096
why: The gradient of a parameter always has the same shape as the parameter.
q: Why does training store every activation from the forward pass?
- To check the loss curve later
* Because the weight gradient at each layer multiplies the incoming gradient by that layer's input
- To allow forward mode as a fallback
why: The gradient of W is h bar times x transpose, and x is the stored input of that layer.
:::

## Go further

The automatic differentiation survey by Baydin and colleagues explains forward and reverse mode with full detail. The matrix calculus paper by Parr and Howard builds up every rule you need. Karpathy's micrograd implements reverse mode in 100 lines. The PyTorch autograd documentation shows how the library records the chain.
`,
          links: [
            { label: 'Automatic Differentiation in Machine Learning: a Survey (Baydin et al., 2015)', url: 'https://arxiv.org/abs/1502.05767', kind: 'paper' },
            { label: 'The Matrix Calculus You Need For Deep Learning (Parr and Howard, 2018)', url: 'https://arxiv.org/abs/1802.01528', kind: 'paper' },
            { label: 'micrograd', url: 'https://github.com/karpathy/micrograd', kind: 'repo' },
            { label: 'PyTorch autograd documentation', url: 'https://pytorch.org/docs/stable/autograd.html', kind: 'docs' },
          ],
        },
      ],
    },
    {
      slug: 'calculus',
      title: 'Calculus',
      description: 'Derivatives, the chain rule, gradients, and Jacobians: the tools that turn a loss into an update.',
      level: 'intermediate',
      lessons: [
        {
          slug: 'derivatives',
          title: 'Derivatives as local slopes',
          summary: 'A derivative is the slope of a function at one point, and it predicts how the output changes for a small change in input.',
          minutes: 13,
          objectives: [
            'Compute a derivative from the limit definition for a simple function.',
            'Apply the power, sum, and product rules.',
            'Use the derivative to predict a change in output from a small change in input.',
            'Explain what a zero derivative means for a loss function.',
          ],
          keyTerms: ['derivative', 'slope', 'limit', 'power rule', 'product rule', 'stationary point', 'linear approximation'],
          body: `
## What this lesson covers

This lesson explains the derivative of a function of one variable. The derivative is a slope. It says how fast the output changes when the input changes a little. You will compute a derivative from the definition and then with the standard rules.

## Why it matters

Training a model means lowering a loss. The derivative of the loss tells you which direction lowers it and by how much per step. Every optimiser in the optimisation module uses this number. The activation functions in a network, such as the sigmoid and the rectified linear unit, are chosen for the shape of their derivatives.

:::video
id: 9vKqVkMQHKk
why: Watch the whole video, 17 minutes. It shrinks the step size in the same way as the scenario in this lesson and shows why the slope at one point makes sense.
:::

## The idea with an example

Take the function $f(x) = x^2$. At $x = 3$, the output is 9. Move the input to $3.1$. The output is $9.61$. The change in output is $0.61$ for a change in input of $0.1$. The ratio is $6.1$.

Now move the input to $3.01$. The output is $9.0601$. The ratio is $0.0601 / 0.01 = 6.01$. Make the step smaller again and the ratio approaches 6. The derivative of $x^2$ at $x = 3$ is 6.

Press Next to shrink the step and watch the ratio.

:::scenario
title: Slope of x squared at x = 3 from smaller steps
state: x=3, f(x)=9
step: Take a step of 0.1. The output is 9.61 and the change is 0.61. The ratio is 6.1.
state: step=0.1, ratio=6.1
step: Take a step of 0.01. The output is 9.0601. The ratio is 6.01.
state: step=0.01, ratio=6.01
step: Take a step of 0.001. The output is 9.006001. The ratio is 6.001.
state: step=0.001, ratio=6.001
step: The ratio approaches 6 as the step shrinks. The derivative at x = 3 is 6.
state: derivative=6
:::

The bars compare the ratio for each step size with the true slope.

:::bars
title: Slope estimate for each step size
Step 0.1: 6.1
Step 0.01: 6.01
Step 0.001: 6.001
Limit: 6
:::

Use the derivative to predict. At $x = 3$ with slope 6, a step of $0.05$ should change the output by about $6 \\times 0.05 = 0.3$. The true change is $3.05^2 - 9 = 0.3025$. The prediction is close because the function is almost a straight line over a small step. This is the linear approximation.

Now interpret a loss. Suppose a loss $L(w)$ has derivative $-2$ at the current weight $w$. The loss falls when $w$ increases, at a rate of 2 per unit. To lower the loss, increase $w$. If the derivative were $+2$, decrease $w$. If the derivative were 0, the loss is flat at this point, and a small step in either direction changes it only in second order.

## How it works


:::anim
title: Slope of x squared at x = 3 from smaller steps
# Worked values and narration follow the scenario in this lesson.
text heading "Slope of x squared at x = 3 from smaller steps" @ 480,48 size: 23 color: white
text legend "WORKED EXAMPLE · FOLLOW EACH CHANGE" @ 480,80 size: 13 color: grey
num scene = 1 @ 850,145 prefix: "Scene " size: 16 color: grey
dot cursor @ 100,145 r: 8 color: blue
dot mark0 @ 100,145 r: 3 color: grey
dot mark1 @ 250,145 r: 3 color: grey
dot mark2 @ 400,145 r: 3 color: grey
dot mark3 @ 550,145 r: 3 color: grey
dot mark4 @ 700,145 r: 3 color: grey
rect card0 @ 180,255 size: 260x120 color: blue
text key0 "" @ 180,222 size: 16 color: grey
text value0 "" @ 180,267 size: 20 color: white
rect card1 @ 480,255 size: 260x120 color: blue
text key1 "" @ 480,222 size: 16 color: grey
text value1 "" @ 480,267 size: 20 color: white
rect card2 @ 780,255 size: 260x120 color: blue
text key2 "" @ 780,222 size: 16 color: grey
text value2 "" @ 780,267 size: 20 color: white
rect card3 @ 180,405 size: 260x120 color: blue
text key3 "" @ 180,372 size: 16 color: grey
text value3 "" @ 180,417 size: 20 color: white
rect card4 @ 480,405 size: 260x120 color: blue
text key4 "" @ 480,372 size: 16 color: grey
text value4 "" @ 480,417 size: 20 color: white

step: Start with the example's initial values.
  show heading, legend, scene, cursor, mark0, mark1, mark2, mark3, mark4, card0, key0, value0, card1, key1, value1, card2, key2, value2, card3, key3, value3, card4, key4, value4
  label key0 "x"
  & label value0 "3"
  & highlight card0
  label key1 "f(x)"
  & label value1 "9"
  & highlight card1

step: Take a step of 0.1.
  restore card0, card1, card2, card3, card4
  move cursor -> 250,145 (0.6s)
  & count scene -> 2 (0.6s)
  label key0 "step"
  & label value0 "0.1"
  & highlight card0
  label key1 "ratio"
  & label value1 "6.1"
  & highlight card1
  label key2 "x"
  & label value2 "3"
  label key3 "f(x)"
  & label value3 "9"

step: Take a step of 0.01.
  restore card0, card1, card2, card3, card4
  move cursor -> 400,145 (0.6s)
  & count scene -> 3 (0.6s)
  label key0 "step"
  & label value0 "0.01"
  & highlight card0
  label key1 "ratio"
  & label value1 "6.01"
  & highlight card1
  label key2 "x"
  & label value2 "3"
  label key3 "f(x)"
  & label value3 "9"

step: Take a step of 0.001.
  restore card0, card1, card2, card3, card4
  move cursor -> 550,145 (0.6s)
  & count scene -> 4 (0.6s)
  label key0 "step"
  & label value0 "0.001"
  & highlight card0
  label key1 "ratio"
  & label value1 "6.001"
  & highlight card1
  label key2 "x"
  & label value2 "3"
  label key3 "f(x)"
  & label value3 "9"

step: The ratio approaches 6 as the step shrinks.
  restore card0, card1, card2, card3, card4
  move cursor -> 700,145 (0.6s)
  & count scene -> 5 (0.6s)
  label key0 "derivative"
  & label value0 "6"
  & highlight card0
  label key1 "step"
  & label value1 "0.001"
  label key2 "ratio"
  & label value2 "6.001"
  label key3 "x"
  & label value3 "3"
  label key4 "f(x)"
  & label value4 "9"
:::

The derivative is defined as a limit:

$$f'(x) = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}$$

$f'(x)$ is the derivative at $x$. $h$ is a small step. The fraction is the slope of the line through two nearby points. The limit is the slope when the two points merge.

The rules you need for machine learning:

| Function | Derivative |
| --- | --- |
| $x^n$ | $n x^{n-1}$ |
| $e^x$ | $e^x$ |
| $\\ln x$ | $1 / x$ |
| $f(x) + g(x)$ | $f'(x) + g'(x)$ |
| $c\\, f(x)$ | $c\\, f'(x)$ |
| $f(x)\\, g(x)$ | $f'(x)\\, g(x) + f(x)\\, g'(x)$ |

To differentiate a polynomial by hand:

1. Split the function into terms with the sum rule.
2. Apply the power rule to each term.
3. Keep the constants in front of each term.
4. Drop any constant term, because its derivative is zero.

For $f(x) = 3x^2 + 2x + 7$: the terms give $6x$, $2$, and $0$. So $f'(x) = 6x + 2$.

The diagram shows the path from the polynomial to its derivative.

:::flow
title: Differentiate 3x^2 + 2x + 7 term by term
f -> Sum rule: 3x^2 + 2x + 7
Sum rule -> Power rule: 3x^2 and 2x
Sum rule -> Constant rule: 7
Power rule -> f prime: 6x + 2
Constant rule -> f prime: 0
:::

The linear approximation is:

$$f(x + h) \\approx f(x) + f'(x)\\, h$$

The approximation is exact for a straight line and good for a small $h$ on any smooth function. Gradient descent takes a step $h = -\\eta f'(x)$ with a small learning rate $\\eta$, so the predicted change is $-\\eta f'(x)^2$, which is never positive.

A point where $f'(x) = 0$ is a stationary point. It can be a minimum, a maximum, or a flat point between two slopes. The second derivative, the slope of the slope, tells which: positive means a minimum.

Note: the sigmoid $\\sigma(x) = 1 / (1 + e^{-x})$ has derivative $\\sigma(x)(1 - \\sigma(x))$, which is at most 0.25. That small slope is the cause of vanishing gradients in deep sigmoid networks.

The bars compare the largest slope of the sigmoid with the slope of the rectified linear unit.

:::bars
title: Largest derivative of two activation functions
Sigmoid: 0.25
Rectified linear unit (positive input): 1
:::

The program computes the lesson's example.

:::code
lang: python
file: derivative.py
def f(x):
    return x ** 2

x = 3.0
for step in [0.1, 0.01, 0.001, 0.0001]:
    ratio = (f(x + step) - f(x)) / step
    print("step", step, "ratio", round(ratio, 5))
# the ratios approach 6, the derivative of x squared at 3

# linear approximation: predict f(3.05) from the slope
slope = 2 * x
print("predicted change", round(slope * 0.05, 4), "true change", round(f(3.05) - f(3), 4))

# the derivative of 3x^2 + 2x + 7 at a few points
def g(x):
    return 3 * x ** 2 + 2 * x + 7

def g_prime(x):
    return 6 * x + 2

for x in [0, 1, 2]:
    numeric = (g(x + 1e-6) - g(x - 1e-6)) / 2e-6
    print("x =", x, "rule", g_prime(x), "numeric", round(numeric, 4))
:::

## Try it

:::exercise
title: Differentiate a cubic and predict a change
task: Take f(x) = x cubed minus 2x. Use the power and sum rules to write its derivative. Evaluate the derivative at x = 2. Then use the linear approximation to predict the change in f when x moves from 2 to 2.01, and compare with the exact change. Finally, find the two points where the derivative is zero and say which one is a minimum. Check the numbers with Python.
hint: The derivative is 3 x squared minus 2. The second derivative is 6x, and its sign tells you which stationary point is a minimum.
lang: python
solution:
def f(x):
    return x ** 3 - 2 * x

def f_prime(x):
    return 3 * x ** 2 - 2

print(f_prime(2))                       # 10
predicted = f_prime(2) * 0.01           # 0.1
exact = f(2.01) - f(2)                  # 0.100601
print(round(predicted, 6), round(exact, 6))

# stationary points: 3 x^2 = 2, so x = plus or minus sqrt(2/3) = 0.8165
root = (2 / 3) ** 0.5
print(round(root, 4), round(-root, 4))
# second derivative 6x is positive at +0.8165, so that point is the minimum
print(6 * root > 0, 6 * -root > 0)
:::

## Common mistakes

- Mistake: you apply the power rule to $e^x$. Fix: the exponent is the variable; the derivative is $e^x$.
- Mistake: you differentiate a product term by term. Fix: use the product rule.
- Mistake: you use a large step with the linear approximation. Fix: the approximation holds for small steps only.
- Mistake: you treat every zero derivative as a minimum. Fix: check the second derivative.

## Check your understanding

Answer each question before you open the explanation.

:::quiz
title: Check: derivatives
q: What is the derivative of x cubed at x = 2?
- 6
- 8
* 12
- 4
why: The power rule gives 3 x squared, and 3 times 4 is 12.
q: A loss has derivative +4 at the current weight. Which change lowers the loss?
* Decrease the weight
- Increase the weight
- Keep the weight; the loss is at a minimum
why: A positive slope means the loss rises as the weight rises, so moving the weight down lowers it.
q: f(x) = x squared has slope 6 at x = 3. What change in f does the linear approximation predict for a step of 0.02?
- 0.06
* 0.12
- 0.6
why: The predicted change is slope times step, which is 6 times 0.02 = 0.12.
q: What is the largest value of the derivative of the sigmoid?
- 1
- 0.5
* 0.25
why: The sigmoid derivative is sigma times (1 minus sigma), which peaks at 0.5 times 0.5 = 0.25.
q: The derivative of a function is zero at x = 1 and the second derivative there is negative. What is x = 1?
- A minimum
* A maximum
- A point where the function is undefined
why: A zero slope with the slope falling means the function rises then falls, which is a maximum.
:::

## Go further

The 3Blue1Brown series on calculus gives the geometric view of each rule. The MIT single variable calculus course covers derivatives in its first unit. Khan Academy has practice problems for each rule. The Deep Learning book's numerical computation chapter connects derivatives to optimisation.
`,
          links: [
            { label: '3Blue1Brown', url: 'https://www.youtube.com/@3blue1brown', kind: 'video' },
            { label: 'MIT 18.01SC Single Variable Calculus', url: 'https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/', kind: 'course' },
            { label: 'Khan Academy calculus', url: 'https://www.khanacademy.org/math/calculus-1', kind: 'course' },
            { label: 'Deep Learning book, chapter 4: Numerical Computation', url: 'https://www.deeplearningbook.org/contents/numerical.html', kind: 'article' },
          ],
        },
        {
          slug: 'chain-rule',
          title: 'The chain rule',
          summary: 'The derivative of a function of a function is the product of the two derivatives, and that rule is the whole of backpropagation.',
          minutes: 14,
          objectives: [
            'Apply the chain rule to a function with two nested layers.',
            'Differentiate the sigmoid of a linear function.',
            'Trace a chain of three functions and multiply the local derivatives.',
            'Explain why a long chain of small derivatives gives a vanishing gradient.',
          ],
          keyTerms: ['chain rule', 'composition', 'local derivative', 'sigmoid', 'vanishing gradient', 'backpropagation'],
          body: `
## What this lesson covers

This lesson explains the chain rule, the rule for differentiating a function built from other functions. It is the single rule that backpropagation applies over and over. You will apply it to a nested function and to a sigmoid neuron.

## Why it matters

A neural network is a composition: a linear map, then a nonlinearity, then another linear map, and so on. The chain rule says the derivative of the whole is the product of the derivatives of the parts. That product is what the backward pass computes. The vanishing gradient problem, which shaped a decade of architecture design, is a direct consequence of multiplying many small numbers.

:::video
id: YG15m2VwSjA
why: Watch the whole video, 16 minutes. The chain rule section shows the inner and outer derivatives as two separate stretches that multiply, which is the picture behind the sigmoid neuron in this lesson.
:::

## The idea with an example

Take $f(x) = (3x + 1)^2$. This is a square applied to a linear function. Name the inner function $u = 3x + 1$. Then $f = u^2$.

The derivative of $u^2$ with respect to $u$ is $2u$. The derivative of $3x + 1$ with respect to $x$ is 3. The chain rule multiplies them: $f'(x) = 2u \\times 3 = 6(3x + 1)$. At $x = 1$, $u = 4$ and $f'(1) = 24$.

The diagram shows the forward values and then the local derivatives along the chain.

:::flow
title: Chain rule on f(x) = (3x + 1) squared at x = 1
x -> u: u = 3x + 1 = 4
u -> f: f = u squared = 16
f -> u: df/du = 2u = 8
u -> x: du/dx = 3, product 24
:::

Check with a small step. At $x = 1$, $f = 16$. At $x = 1.01$, $f = (4.03)^2 = 16.2409$. The ratio is $0.2409 / 0.01 = 24.09$, close to 24.

Now a neuron. The output is $y = \\sigma(wx + b)$ with the sigmoid $\\sigma(z) = 1 / (1 + e^{-z})$. Take $w = 2$, $b = -1$, $x = 1$. The inner value is $z = 1$. The sigmoid gives $\\sigma(1) \\approx 0.731$. The derivative of the sigmoid is $\\sigma(z)(1 - \\sigma(z)) \\approx 0.197$. The derivative of $z$ with respect to $w$ is $x = 1$. By the chain rule, $\\partial y / \\partial w \\approx 0.197 \\times 1 = 0.197$. With respect to $b$ it is $0.197 \\times 1$. With respect to $x$ it is $0.197 \\times w = 0.393$.

Press Next to apply the chain rule to the sigmoid neuron.

:::scenario
title: Derivatives of y = sigmoid(w x + b) with w = 2, b = -1, x = 1
state: w=2, b=-1, x=1
step: Compute the inner value z = w x + b = 2 - 1 = 1.
state: z=1
step: Apply the sigmoid. y = 1 / (1 + e^-1) = 0.731.
state: y=0.731
step: Compute the local derivative of the sigmoid, y (1 - y) = 0.731 times 0.269 = 0.197.
state: dy/dz=0.197
step: Multiply by dz/dw = x = 1. The derivative with respect to w is 0.197.
state: dy/dw=0.197
step: Multiply by dz/db = 1 and by dz/dx = w = 2. The derivatives are 0.197 and 0.393.
state: dy/db=0.197, dy/dx=0.393
:::

The table lists the local derivatives and the product along each path.

| Path | Local derivatives | Product |
| --- | --- | --- |
| w | 0.197 and x = 1 | 0.197 |
| b | 0.197 and 1 | 0.197 |
| x | 0.197 and w = 2 | 0.393 |

Each factor is a local derivative. The chain rule says: compute every local derivative, then multiply along the path.

## How it works


:::anim
title: Derivatives of y = sigmoid(w x + b) with w = 2, b = -1, x = 1
# Worked values and narration follow the scenario in this lesson.
text heading "Derivatives of y = sigmoid(w x + b) with w = 2, b = -1, x = 1" @ 480,48 size: 23 color: white
text legend "WORKED EXAMPLE · FOLLOW EACH CHANGE" @ 480,80 size: 13 color: grey
num scene = 1 @ 850,145 prefix: "Scene " size: 16 color: grey
dot cursor @ 100,145 r: 8 color: blue
dot mark0 @ 100,145 r: 3 color: grey
dot mark1 @ 220,145 r: 3 color: grey
dot mark2 @ 340,145 r: 3 color: grey
dot mark3 @ 460,145 r: 3 color: grey
dot mark4 @ 580,145 r: 3 color: grey
dot mark5 @ 700,145 r: 3 color: grey
rect card0 @ 180,255 size: 260x120 color: blue
text key0 "" @ 180,222 size: 16 color: grey
text value0 "" @ 180,267 size: 20 color: white
rect card1 @ 480,255 size: 260x120 color: blue
text key1 "" @ 480,222 size: 16 color: grey
text value1 "" @ 480,267 size: 20 color: white
rect card2 @ 780,255 size: 260x120 color: blue
text key2 "" @ 780,222 size: 16 color: grey
text value2 "" @ 780,267 size: 20 color: white
rect card3 @ 180,405 size: 260x120 color: blue
text key3 "" @ 180,372 size: 16 color: grey
text value3 "" @ 180,417 size: 20 color: white
rect card4 @ 480,405 size: 260x120 color: blue
text key4 "" @ 480,372 size: 16 color: grey
text value4 "" @ 480,417 size: 20 color: white
rect card5 @ 780,405 size: 260x120 color: blue
text key5 "" @ 780,372 size: 16 color: grey
text value5 "" @ 780,417 size: 20 color: white

step: Start with the example's initial values.
  show heading, legend, scene, cursor, mark0, mark1, mark2, mark3, mark4, mark5, card0, key0, value0, card1, key1, value1, card2, key2, value2, card3, key3, value3, card4, key4, value4, card5, key5, value5
  label key0 "w"
  & label value0 "2"
  & highlight card0
  label key1 "b"
  & label value1 "-1"
  & highlight card1
  label key2 "x"
  & label value2 "1"
  & highlight card2

step: Compute the inner value z = w x + b = 2 - 1 = 1.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 220,145 (0.6s)
  & count scene -> 2 (0.6s)
  label key0 "z"
  & label value0 "1"
  & highlight card0
  label key1 "w"
  & label value1 "2"
  label key2 "b"
  & label value2 "-1"
  label key3 "x"
  & label value3 "1"

step: Apply the sigmoid.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 340,145 (0.6s)
  & count scene -> 3 (0.6s)
  label key0 "y"
  & label value0 "0.731"
  & highlight card0
  label key1 "z"
  & label value1 "1"
  label key2 "w"
  & label value2 "2"
  label key3 "b"
  & label value3 "-1"
  label key4 "x"
  & label value4 "1"

step: Compute the local derivative of the sigmoid, y (1 - y) = 0.731 times 0.269 = 0.197.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 460,145 (0.6s)
  & count scene -> 4 (0.6s)
  label key0 "dy/dz"
  & label value0 "0.197"
  & highlight card0
  label key1 "y"
  & label value1 "0.731"
  label key2 "z"
  & label value2 "1"
  label key3 "w"
  & label value3 "2"
  label key4 "b"
  & label value4 "-1"
  label key5 "x"
  & label value5 "1"

step: Multiply by dz/dw = x = 1.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 580,145 (0.6s)
  & count scene -> 5 (0.6s)
  label key0 "dy/dw"
  & label value0 "0.197"
  & highlight card0
  label key1 "dy/dz"
  & label value1 "0.197"
  label key2 "y"
  & label value2 "0.731"
  label key3 "z"
  & label value3 "1"
  label key4 "w"
  & label value4 "2"
  label key5 "b"
  & label value5 "-1"

step: Multiply by dz/db = 1 and by dz/dx = w = 2.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 700,145 (0.6s)
  & count scene -> 6 (0.6s)
  label key0 "dy/db"
  & label value0 "0.197"
  & highlight card0
  label key1 "dy/dx"
  & label value1 "0.393"
  & highlight card1
  label key2 "dy/dw"
  & label value2 "0.197"
  label key3 "dy/dz"
  & label value3 "0.197"
  label key4 "y"
  & label value4 "0.731"
  label key5 "z"
  & label value5 "1"
:::

For $f(x) = g(h(x))$ the chain rule is:

$$f'(x) = g'(h(x))\\, h'(x)$$

$g$ is the outer function. $h$ is the inner function. $g'(h(x))$ is the derivative of the outer function evaluated at the inner value. $h'(x)$ is the derivative of the inner function.

For a chain of three, $f = g(h(k(x)))$:

$$f'(x) = g'(h(k(x)))\\, h'(k(x))\\, k'(x)$$

To apply the chain rule by hand:

1. Name each nested function from the inside out: $u_1 = k(x)$, $u_2 = h(u_1)$, $u_3 = g(u_2)$.
2. Compute each value in the forward direction.
3. Compute each local derivative at its own input: $k'(x)$, $h'(u_1)$, $g'(u_2)$.
4. Multiply the local derivatives.

Step 2 is the forward pass. Steps 3 and 4 are the backward pass. Backpropagation stores the forward values because step 3 needs them.

Now consider a chain of 20 sigmoid layers. Each local derivative is at most 0.25. The product of 20 such factors is at most $0.25^{20} \\approx 10^{-12}$. The gradient at the first layer is almost zero, and that layer stops learning. This is the vanishing gradient. The rectified linear unit has derivative 1 for positive inputs, so its chain does not shrink. Residual connections add a path with derivative 1 around each layer. Both fixes follow from the chain rule.

The bars compare the largest local derivative that each kind of layer passes on.

:::bars
title: Largest local derivative per layer
Sigmoid layer: 0.25
Rectified linear unit: 1
Residual path: 1
:::

Note: the chain rule for many variables uses the same idea with a sum over paths. The next lesson covers it.

The program computes the lesson's example.

:::code
lang: python
file: chain_rule.py
import math

# f(x) = (3x + 1)^2 at x = 1
x = 1.0
u = 3 * x + 1                      # inner value 4
df_du = 2 * u                      # outer derivative 8
du_dx = 3                          # inner derivative
print("f'(1) =", df_du * du_dx)    # 24
f = lambda x: (3 * x + 1) ** 2
print("finite difference:", round((f(1.01) - f(1.0)) / 0.01, 2))

# sigmoid neuron y = sigmoid(w x + b)
def sigmoid(z):
    return 1 / (1 + math.exp(-z))

w, b, x = 2.0, -1.0, 1.0
z = w * x + b                      # 1
y = sigmoid(z)                     # 0.731
dy_dz = y * (1 - y)                # 0.197
print("dy/dw =", round(dy_dz * x, 3))
print("dy/db =", round(dy_dz * 1, 3))
print("dy/dx =", round(dy_dz * w, 3))

# vanishing gradient: 20 sigmoid layers at their best slope
print("0.25 ** 20 =", 0.25 ** 20)
:::

## Try it

:::exercise
title: Apply the chain rule to a new nest and a new neuron
task: Part 1: differentiate f(x) = (x squared + 1) cubed with the chain rule and evaluate the derivative at x = 1. Part 2: for the neuron y = sigmoid(w x + b) with w = 1, b = 0, and x = 2, compute z, y, the local derivative of the sigmoid, and the three derivatives of y with respect to w, b, and x. Confirm both parts with a finite difference in Python.
hint: In part 1 the inner function is u = x squared + 1 with derivative 2x, and the outer function is u cubed with derivative 3 u squared. In part 2, sigmoid(2) is about 0.881.
lang: python
solution:
import math

# part 1: u = x^2 + 1 = 2 at x = 1; f' = 3 u^2 * 2x = 3 * 4 * 2 = 24
f = lambda x: (x ** 2 + 1) ** 3
print(round((f(1.0001) - f(0.9999)) / 0.0002, 3))     # 24.0

# part 2
sig = lambda z: 1 / (1 + math.exp(-z))
w, b, x = 1.0, 0.0, 2.0
z = w * x + b                     # 2
y = sig(z)                        # 0.881
local = y * (1 - y)               # 0.105
print(round(local * x, 3), round(local, 3), round(local * w, 3))
# dy/dw = 0.210, dy/db = 0.105, dy/dx = 0.105
y_of_w = lambda w: sig(w * x + b)
print(round((y_of_w(1.0001) - y_of_w(0.9999)) / 0.0002, 3))   # 0.21
:::

## Common mistakes

- Mistake: you evaluate the outer derivative at $x$ instead of at $h(x)$. Fix: feed the inner value to the outer derivative.
- Mistake: you forget the inner derivative. Fix: every nesting contributes a factor.
- Mistake: you treat $\\sigma(z)$ and $\\sigma'(z)$ as the same. Fix: $\\sigma' = \\sigma(1 - \\sigma)$.
- Mistake: you stack many sigmoid layers and wonder why the first layer does not train. Fix: the gradient vanished; use a rectified unit or residual connections.

## Check your understanding

Answer each question before you open the explanation.

:::quiz
title: Check: the chain rule
q: What is the derivative of (2x + 3) cubed?
- 3 (2x + 3) squared
* 6 (2x + 3) squared
- 2 (2x + 3) squared
- 6 x squared
why: The outer derivative 3 (2x + 3) squared is multiplied by the inner derivative 2.
q: For y = sigmoid(w x + b), what is the derivative of y with respect to b?
- x times sigma(z)
* sigma(z) times (1 minus sigma(z))
- w times sigma(z) times (1 minus sigma(z))
why: The derivative of z with respect to b is 1, so only the local sigmoid derivative remains.
q: A chain has local derivatives 0.5, 0.2, and 4. What is the derivative of the whole chain?
- 4.7
- 0.1
* 0.4
why: The chain rule multiplies the local derivatives: 0.5 times 0.2 times 4 = 0.4.
q: Why does the first layer of a deep sigmoid network stop learning?
- Its weights are too large
* The gradient is a product of many factors at most 0.25, which is almost zero
- The sigmoid has no derivative
why: Twenty factors of 0.25 give about 10 to the power minus 12, so the update at the first layer is negligible.
q: How does a residual connection help the gradient?
- It doubles the learning rate
- It removes the need for a nonlinearity
* It adds a path whose local derivative is 1
why: The gradient can pass through the identity path without shrinking at each layer.
:::

## Go further

The 3Blue1Brown calculus series has a visual chain rule episode. The MIT single variable course covers it in the first unit. Nielsen's online book derives backpropagation from the chain rule with pictures. Karpathy's micrograd applies the rule node by node in code.
`,
          links: [
            { label: '3Blue1Brown', url: 'https://www.youtube.com/@3blue1brown', kind: 'video' },
            { label: 'MIT 18.01SC Single Variable Calculus', url: 'https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/', kind: 'course' },
            { label: 'Neural Networks and Deep Learning, chapter 2 (Nielsen)', url: 'http://neuralnetworksanddeeplearning.com/chap2.html', kind: 'article' },
            { label: 'micrograd', url: 'https://github.com/karpathy/micrograd', kind: 'repo' },
          ],
        },
        {
          slug: 'gradients-and-jacobians',
          title: 'Gradients and Jacobians',
          summary: 'The gradient collects the partial derivatives of a scalar function, and the Jacobian does the same for a vector function.',
          minutes: 16,
          objectives: [
            'Compute partial derivatives and assemble the gradient of a two-variable function.',
            'Explain why the gradient points in the direction of steepest ascent.',
            'Write the Jacobian of a small vector function and state its shape.',
            'Apply the multivariable chain rule as a Jacobian product.',
          ],
          keyTerms: ['partial derivative', 'gradient', 'Jacobian', 'directional derivative', 'steepest ascent', 'chain rule', 'Hessian'],
          body: `
## What this lesson covers

This lesson extends derivatives to functions of many inputs. A partial derivative is the slope along one input. The gradient collects the partial derivatives of a scalar function. The Jacobian collects them for a vector function. You will compute both for small examples and use the multivariable chain rule.

## Why it matters

A loss is a function of millions of weights. Its gradient is a vector with one entry per weight, and gradient descent moves against it. Every layer of a network is a vector function, and its Jacobian is what the chain rule multiplies. The terms gradient and Jacobian appear on almost every page of a deep learning paper.

## The idea with an example

Take $f(x, y) = x^2 + 3xy$. To get the partial derivative with respect to $x$, treat $y$ as a constant: $\\partial f / \\partial x = 2x + 3y$. To get the partial with respect to $y$, treat $x$ as a constant: $\\partial f / \\partial y = 3x$.

The gradient stacks them: $\\nabla f = [2x + 3y, 3x]$. At the point $(1, 2)$, the gradient is $[8, 3]$.

Press Next to compute the gradient at (1, 2) by hand.

:::scenario
title: Gradient of f(x, y) = x^2 + 3xy at (1, 2)
state: x=1, y=2
step: Hold y fixed and differentiate with respect to x. The partial derivative is 2x + 3y.
state: df/dx=2x + 3y
step: Hold x fixed and differentiate with respect to y. The partial derivative is 3x.
state: df/dy=3x
step: Substitute x = 1 and y = 2. The first partial derivative is 2 + 6 = 8. The second is 3.
state: df/dx=8, df/dy=3
step: Stack the two numbers. The gradient is [8, 3] and its length is about 8.54.
state: gradient=[8 3], length=8.54
:::

The gradient points uphill. To see this, move from $(1, 2)$ by a small step of length 0.1 in a few directions and watch the change in $f$:

| Direction | Step | Change in $f$ |
| --- | --- | --- |
| Along $x$ | $[0.1, 0]$ | about $0.8$ |
| Along $y$ | $[0, 0.1]$ | about $0.3$ |
| Along the gradient | $[0.094, 0.035]$ | about $0.85$ |
| Against the gradient | $[-0.094, -0.035]$ | about $-0.85$ |

The step along the gradient gives the largest rise. The step against it gives the largest fall. The change in any direction $d$ is the dot product $\\nabla f \\cdot d$, which is largest when $d$ lines up with $\\nabla f$.

The bars compare the change in f for each direction of the step.

:::bars
title: Change in f for a step of length 0.1 from (1, 2)
Along x: 0.8
Along y: 0.3
Along the gradient: 0.85
Against the gradient: -0.85
:::

Now a vector function. Take $g(x, y) = [x y,\\ x + y^2]$. It has two outputs and two inputs, so it has four partial derivatives. The Jacobian puts output $i$ in row $i$ and input $j$ in column $j$:

$$J_g = \\begin{pmatrix} y & x \\\\ 1 & 2y \\end{pmatrix}$$

At $(1, 2)$ the Jacobian is $\\begin{pmatrix} 2 & 1 \\\\ 1 & 4 \\end{pmatrix}$. It is the matrix of the linear map that best approximates $g$ near that point.

The grid shows the Jacobian of g at (1, 2), with one row per output and one column per input.

:::matrix
title: Jacobian of g at (1, 2)
cols: d/dx, d/dy
output xy: 2, 1
output x + y^2: 1, 4
:::

## How it works


:::anim
title: Gradient of f(x, y) = x^2 + 3xy at (1, 2)
# Worked values and narration follow the scenario in this lesson.
text heading "Gradient of f(x, y) = x^2 + 3xy at (1, 2)" @ 480,48 size: 23 color: white
text legend "WORKED EXAMPLE · FOLLOW EACH CHANGE" @ 480,80 size: 13 color: grey
num scene = 1 @ 850,145 prefix: "Scene " size: 16 color: grey
dot cursor @ 100,145 r: 8 color: blue
dot mark0 @ 100,145 r: 3 color: grey
dot mark1 @ 250,145 r: 3 color: grey
dot mark2 @ 400,145 r: 3 color: grey
dot mark3 @ 550,145 r: 3 color: grey
dot mark4 @ 700,145 r: 3 color: grey
rect card0 @ 180,255 size: 260x120 color: blue
text key0 "" @ 180,222 size: 16 color: grey
text value0 "" @ 180,267 size: 20 color: white
rect card1 @ 480,255 size: 260x120 color: blue
text key1 "" @ 480,222 size: 16 color: grey
text value1 "" @ 480,267 size: 20 color: white
rect card2 @ 780,255 size: 260x120 color: blue
text key2 "" @ 780,222 size: 16 color: grey
text value2 "" @ 780,267 size: 20 color: white
rect card3 @ 180,405 size: 260x120 color: blue
text key3 "" @ 180,372 size: 16 color: grey
text value3 "" @ 180,417 size: 20 color: white
rect card4 @ 480,405 size: 260x120 color: blue
text key4 "" @ 480,372 size: 16 color: grey
text value4 "" @ 480,417 size: 20 color: white
rect card5 @ 780,405 size: 260x120 color: blue
text key5 "" @ 780,372 size: 16 color: grey
text value5 "" @ 780,417 size: 20 color: white

step: Start with the example's initial values.
  show heading, legend, scene, cursor, mark0, mark1, mark2, mark3, mark4, card0, key0, value0, card1, key1, value1, card2, key2, value2, card3, key3, value3, card4, key4, value4, card5, key5, value5
  label key0 "x"
  & label value0 "1"
  & highlight card0
  label key1 "y"
  & label value1 "2"
  & highlight card1

step: Hold y fixed and differentiate with respect to x.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 250,145 (0.6s)
  & count scene -> 2 (0.6s)
  label key0 "df/dx"
  & label value0 "2x + 3y"
  & highlight card0
  label key1 "x"
  & label value1 "1"
  label key2 "y"
  & label value2 "2"

step: Hold x fixed and differentiate with respect to y.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 400,145 (0.6s)
  & count scene -> 3 (0.6s)
  label key0 "df/dy"
  & label value0 "3x"
  & highlight card0
  label key1 "df/dx"
  & label value1 "2x + 3y"
  label key2 "x"
  & label value2 "1"
  label key3 "y"
  & label value3 "2"

step: Substitute x = 1 and y = 2.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 550,145 (0.6s)
  & count scene -> 4 (0.6s)
  label key0 "df/dx"
  & label value0 "8"
  & highlight card0
  label key1 "df/dy"
  & label value1 "3"
  & highlight card1
  label key2 "x"
  & label value2 "1"
  label key3 "y"
  & label value3 "2"

step: Stack the two numbers.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 700,145 (0.6s)
  & count scene -> 5 (0.6s)
  label key0 "gradient"
  & label value0 "[8 3]"
  & highlight card0
  label key1 "length"
  & label value1 "8.54"
  & highlight card1
  label key2 "df/dx"
  & label value2 "8"
  label key3 "df/dy"
  & label value3 "3"
  label key4 "x"
  & label value4 "1"
  label key5 "y"
  & label value5 "2"
:::

For a scalar function $f$ of $n$ inputs, the gradient is:

$$\\nabla f = \\left[ \\frac{\\partial f}{\\partial x_1}, \\dots, \\frac{\\partial f}{\\partial x_n} \\right]$$

Each entry is the slope along one input with the others held fixed. The directional derivative along a unit vector $d$ is $\\nabla f \\cdot d$.

For a vector function $g$ with $m$ outputs and $n$ inputs, the Jacobian is the $m \\times n$ matrix:

$$J_{ij} = \\frac{\\partial g_i}{\\partial x_j}$$

The gradient of a scalar function is the Jacobian with one row.

The multivariable chain rule for $f(g(x))$ is:

$$J_{f \\circ g} = J_f\\, J_g$$

$J_f$ is the Jacobian of the outer function at $g(x)$. $J_g$ is the Jacobian of the inner function at $x$. The shapes line up: if $g$ maps $n$ to $m$ and $f$ maps $m$ to $p$, the product is $p \\times n$.

To apply it by hand:

1. Compute the inner value $u = g(x)$.
2. Write $J_g$ at $x$ and $J_f$ at $u$.
3. Multiply $J_f J_g$.

For a scalar loss $L$ of a layer output $h = g(x)$, the chain rule gives $\\nabla_x L = J_g^\\top \\nabla_h L$. That transpose is why backpropagation multiplies by the transpose of each weight matrix.

The Hessian is the Jacobian of the gradient. It is an $n \\times n$ symmetric matrix of second derivatives. Its eigenvalues give the curvature of the loss in each direction.

Note: the linear approximation in many variables is $f(x + d) \\approx f(x) + \\nabla f \\cdot d$. Gradient descent relies on it at every step.

The program computes the lesson's example.

:::code
lang: python
file: jacobian.py
import torch

# gradient of f(x, y) = x^2 + 3xy at (1, 2)
p = torch.tensor([1.0, 2.0], requires_grad=True)
f = p[0] ** 2 + 3 * p[0] * p[1]
f.backward()
print("gradient:", p.grad)                 # [8. 3.]

# directional derivative along the unit vector d
d = p.grad / p.grad.norm()
print("steepest ascent rate:", (p.grad @ d).item())     # 8.54
print("rate along x:", (p.grad @ torch.tensor([1.0, 0.0])).item())

# Jacobian of g(x, y) = [x y, x + y^2] at (1, 2)
def g(v):
    x, y = v[0], v[1]
    return torch.stack([x * y, x + y ** 2])

J = torch.autograd.functional.jacobian(g, torch.tensor([1.0, 2.0]))
print("Jacobian:")
print(J)                                   # [[2. 1.] [1. 4.]]
print("shape:", tuple(J.shape))            # (2, 2): outputs by inputs
:::

## Try it

:::exercise
title: Compute a gradient and a Jacobian on paper
task: Take f(x, y) = x y squared + 3x. Compute both partial derivatives and the gradient at the point (2, 1). Then compute the rate of change of f along the unit direction d = [0.6, 0.8]. Next, take g(x, y) = [x squared y, x + y]. Write its Jacobian in general and evaluate it at (2, 1). Finally, state the shape of the Jacobian of a map from 4 inputs to 3 outputs.
hint: For the partial with respect to x, treat y as a constant number. The rate along d is the dot product of the gradient with d. Rows of a Jacobian are outputs and columns are inputs.
lang: text
solution:
df/dx = y^2 + 3, which is 1 + 3 = 4 at (2, 1).
df/dy = 2 x y, which is 2 times 2 times 1 = 4 at (2, 1).
Gradient at (2, 1): [4, 4].

Rate along d = [0.6, 0.8]: 4 times 0.6 + 4 times 0.8 = 2.4 + 3.2 = 5.6.
The largest possible rate is the length of the gradient, sqrt(32) = 5.66, along [0.707, 0.707].

Jacobian of g(x, y) = [x^2 y, x + y]:
row 1 (output x^2 y): [2 x y, x^2]
row 2 (output x + y):  [1, 1]
At (2, 1): row 1 is [4, 4] and row 2 is [1, 1].

A map from 4 inputs to 3 outputs has a 3 by 4 Jacobian: 3 rows for the outputs and 4 columns for the inputs.
:::

## Common mistakes

- Mistake: you differentiate with respect to $x$ and let $y$ vary. Fix: hold every other input fixed.
- Mistake: you put inputs in rows and outputs in columns of the Jacobian. Fix: rows are outputs, columns are inputs.
- Mistake: you multiply Jacobians in the wrong order. Fix: the outer Jacobian goes on the left.
- Mistake: you think the gradient points toward the minimum. Fix: it points uphill, and only locally.

## Check your understanding

Answer each question before you open the explanation.

:::quiz
title: Check: gradients and Jacobians
q: What is the gradient of f(x, y) = x squared y at the point (1, 3)?
- [2, 1]
* [6, 1]
- [3, 1]
- [6, 3]
why: The partial with respect to x is 2 x y = 6 and the partial with respect to y is x squared = 1.
q: What is the shape of the Jacobian of a map from 5 inputs to 3 outputs?
- 5 by 3
* 3 by 5
- 5 by 5
why: Rows are outputs and columns are inputs, so the Jacobian has 3 rows and 5 columns.
q: In which direction does a function rise fastest at a point?
* Along the gradient
- Along the x axis
- Against the gradient
- Along any direction with a positive partial derivative
why: The change along a unit direction d is the gradient dotted with d, which is largest when d points along the gradient.
q: For a scalar loss L of a layer output h = g(x), how does the gradient reach x?
- Multiply the gradient at h by the Jacobian of g
* Multiply the gradient at h by the transpose of the Jacobian of g
- Add the Jacobian of g to the gradient at h
why: The chain rule with a scalar on top gives J transpose times the gradient, which is why backpropagation uses transposes.
q: What is the Hessian?
- The gradient of a vector function
* The Jacobian of the gradient, a symmetric matrix of second derivatives
- The inverse of the Jacobian
why: Differentiating each entry of the gradient with respect to each input gives the matrix of second derivatives.
:::

## Go further

The MIT multivariable calculus course covers partial derivatives and the gradient in its second unit. The Parr and Howard paper covers every Jacobian rule used in deep learning. The 3Blue1Brown channel has a visual treatment of the gradient. The JAX autodiff cookbook shows Jacobian-vector and vector-Jacobian products in code.
`,
          links: [
            { label: 'MIT 18.02SC Multivariable Calculus', url: 'https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/', kind: 'course' },
            { label: 'The Matrix Calculus You Need For Deep Learning (Parr and Howard, 2018)', url: 'https://arxiv.org/abs/1802.01528', kind: 'paper' },
            { label: '3Blue1Brown', url: 'https://www.youtube.com/@3blue1brown', kind: 'video' },
            { label: 'JAX autodiff cookbook', url: 'https://jax.readthedocs.io/en/latest/notebooks/autodiff_cookbook.html', kind: 'docs' },
          ],
        },
      ],
    },
    {
      slug: 'probability',
      title: 'Probability',
      description: 'Random variables, Bayes rule, expectation and variance, and the distributions that appear in every model.',
      level: 'intermediate',
      lessons: [
        {
          slug: 'random-variables',
          title: 'Random variables and distributions',
          summary: 'A random variable assigns a number to each outcome, and its distribution says how likely each number is.',
          minutes: 14,
          objectives: [
            'Define a random variable and write its probability mass function for a small example.',
            'Distinguish a discrete distribution from a continuous density.',
            'Compute a joint, a marginal, and a conditional probability from a table.',
            'Explain what a language model outputs as a distribution over tokens.',
          ],
          keyTerms: ['random variable', 'probability mass function', 'probability density', 'joint distribution', 'marginal', 'conditional probability', 'softmax'],
          body: `
## What this lesson covers

This lesson introduces random variables and their distributions. It covers discrete and continuous cases, and the joint, marginal, and conditional distributions of two variables. You will compute each from a small table.

## Why it matters

A language model is a conditional distribution over the next token given the previous tokens. Sampling, temperature, and top-p all act on that distribution. The loss that trains the model is a function of the probability it assigns to the true token. If you can read a distribution table, you can read a model's output.

:::video
id: 2MuDZIAzBMY
why: Watch the first 30 minutes. The lecture builds probability from counting outcomes, which is how the die table in this lesson is built. You can stop before the combinatorics proofs.
:::

## The idea with an example

Roll a fair six-sided die. The outcome is a number from 1 to 6. Define a random variable $X$ as the outcome. Its probability mass function gives each value a probability of $1/6$. Define another random variable $Y = 1$ if the roll is even and $Y = 0$ if the roll is odd. Then $P(Y = 1) = 1/2$.

Now consider two variables together. Let $A$ be "the roll is at most 2" and keep $Y$ as above. Build the joint table by counting outcomes:

| | $Y = 0$ (odd) | $Y = 1$ (even) | Row total |
| --- | --- | --- | --- |
| $A = 1$ (roll 1 or 2) | 1/6 | 1/6 | 2/6 |
| $A = 0$ (roll 3 to 6) | 2/6 | 2/6 | 4/6 |
| Column total | 3/6 | 3/6 | 1 |

The cells are the joint probabilities $P(A, Y)$. The row totals are the marginal $P(A)$. The column totals are the marginal $P(Y)$. The conditional probability $P(Y = 1 \\mid A = 1)$ is the cell divided by the row total: $(1/6) / (2/6) = 1/2$.

The grid shows the same joint table as a heat map.

:::matrix
title: Joint probabilities P(A, Y) from the die
cols: Y = 0 (odd), Y = 1 (even)
A = 1 (roll 1 or 2): 0.167, 0.167
A = 0 (roll 3 to 6): 0.333, 0.333
:::

Press Next to build the marginal and the conditional from the joint table.

:::scenario
title: From joint to marginal to conditional
state: joint A1 Y0=1/6, joint A1 Y1=1/6, joint A0 Y0=2/6, joint A0 Y1=2/6
step: Count the outcomes for each cell. Roll 1 is odd and at most 2, so it goes to the cell A1 Y0. Each of the six rolls fills one cell.
step: Sum each row to get the marginal of A. P(A = 1) is 1/6 + 1/6 = 2/6.
state: P(A1)=2/6, P(A0)=4/6
step: Sum each column to get the marginal of Y. P(Y = 1) is 1/6 + 2/6 = 3/6.
state: P(Y1)=3/6, P(Y0)=3/6
step: Divide the cell by the row total. P(Y = 1 given A = 1) is (1/6) / (2/6) = 1/2.
state: P(Y1 given A1)=1/2
step: Check independence. P(A1) times P(Y1) is (2/6)(3/6) = 1/6, which equals the joint cell. The variables are independent.
state: independent=yes
:::

A language model works the same way. Given the prompt "The cat sat on the", the model outputs a distribution over the next token: "mat" with 0.4, "floor" with 0.2, "sofa" with 0.1, and the rest spread over the other tokens. That is a conditional distribution $P(\\text{next} \\mid \\text{prompt})$ over a vocabulary of 100,000 values.

The bars compare the probabilities the model gives to the top three tokens.

:::bars
title: Next-token distribution after "The cat sat on the"
mat: 0.4
floor: 0.2
sofa: 0.1
all other tokens: 0.3
:::

## How it works


:::anim
title: From joint to marginal to conditional
# Worked values and narration follow the scenario in this lesson.
text heading "From joint to marginal to conditional" @ 480,48 size: 23 color: white
text legend "WORKED EXAMPLE · FOLLOW EACH CHANGE" @ 480,80 size: 13 color: grey
num scene = 1 @ 850,145 prefix: "Scene " size: 16 color: grey
dot cursor @ 100,145 r: 8 color: blue
dot mark0 @ 100,145 r: 3 color: grey
dot mark1 @ 220,145 r: 3 color: grey
dot mark2 @ 340,145 r: 3 color: grey
dot mark3 @ 460,145 r: 3 color: grey
dot mark4 @ 580,145 r: 3 color: grey
dot mark5 @ 700,145 r: 3 color: grey
rect card0 @ 180,255 size: 260x120 color: blue
text key0 "" @ 180,222 size: 16 color: grey
text value0 "" @ 180,267 size: 20 color: white
rect card1 @ 480,255 size: 260x120 color: blue
text key1 "" @ 480,222 size: 16 color: grey
text value1 "" @ 480,267 size: 20 color: white
rect card2 @ 780,255 size: 260x120 color: blue
text key2 "" @ 780,222 size: 16 color: grey
text value2 "" @ 780,267 size: 20 color: white
rect card3 @ 180,405 size: 260x120 color: blue
text key3 "" @ 180,372 size: 16 color: grey
text value3 "" @ 180,417 size: 20 color: white
rect card4 @ 480,405 size: 260x120 color: blue
text key4 "" @ 480,372 size: 16 color: grey
text value4 "" @ 480,417 size: 20 color: white
rect card5 @ 780,405 size: 260x120 color: blue
text key5 "" @ 780,372 size: 16 color: grey
text value5 "" @ 780,417 size: 20 color: white

step: Start with the example's initial values.
  show heading, legend, scene, cursor, mark0, mark1, mark2, mark3, mark4, mark5, card0, key0, value0, card1, key1, value1, card2, key2, value2, card3, key3, value3, card4, key4, value4, card5, key5, value5
  label key0 "joint A1 Y0"
  & label value0 "1/6"
  & highlight card0
  label key1 "joint A1 Y1"
  & label value1 "1/6"
  & highlight card1
  label key2 "joint A0 Y0"
  & label value2 "2/6"
  & highlight card2
  label key3 "joint A0 Y1"
  & label value3 "2/6"
  & highlight card3

step: Count the outcomes for each cell.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 220,145 (0.6s)
  & count scene -> 2 (0.6s)
  label key0 "joint A1 Y0"
  & label value0 "1/6"
  label key1 "joint A1 Y1"
  & label value1 "1/6"
  label key2 "joint A0 Y0"
  & label value2 "2/6"
  label key3 "joint A0 Y1"
  & label value3 "2/6"

step: Sum each row to get the marginal of A.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 340,145 (0.6s)
  & count scene -> 3 (0.6s)
  label key0 "P(A1)"
  & label value0 "2/6"
  & highlight card0
  label key1 "P(A0)"
  & label value1 "4/6"
  & highlight card1
  label key2 "joint A1 Y0"
  & label value2 "1/6"
  label key3 "joint A1 Y1"
  & label value3 "1/6"
  label key4 "joint A0 Y0"
  & label value4 "2/6"
  label key5 "joint A0 Y1"
  & label value5 "2/6"

step: Sum each column to get the marginal of Y.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 460,145 (0.6s)
  & count scene -> 4 (0.6s)
  label key0 "P(Y1)"
  & label value0 "3/6"
  & highlight card0
  label key1 "P(Y0)"
  & label value1 "3/6"
  & highlight card1
  label key2 "P(A1)"
  & label value2 "2/6"
  label key3 "P(A0)"
  & label value3 "4/6"
  label key4 "joint A1 Y0"
  & label value4 "1/6"
  label key5 "joint A1 Y1"
  & label value5 "1/6"

step: Divide the cell by the row total.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 580,145 (0.6s)
  & count scene -> 5 (0.6s)
  label key0 "P(Y1 given A1)"
  & label value0 "1/2"
  & highlight card0
  label key1 "P(Y1)"
  & label value1 "3/6"
  label key2 "P(Y0)"
  & label value2 "3/6"
  label key3 "P(A1)"
  & label value3 "2/6"
  label key4 "P(A0)"
  & label value4 "4/6"
  label key5 "joint A1 Y0"
  & label value5 "1/6"

step: Check independence.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 700,145 (0.6s)
  & count scene -> 6 (0.6s)
  label key0 "independent"
  & label value0 "yes"
  & highlight card0
  label key1 "P(Y1 given A1)"
  & label value1 "1/2"
  label key2 "P(Y1)"
  & label value2 "3/6"
  label key3 "P(Y0)"
  & label value3 "3/6"
  label key4 "P(A1)"
  & label value4 "2/6"
  label key5 "P(A0)"
  & label value5 "4/6"
:::

A random variable $X$ maps each outcome of an experiment to a number. For a discrete variable, the probability mass function $p(x) = P(X = x)$ satisfies:

$$p(x) \\ge 0, \\qquad \\sum_x p(x) = 1$$

For a continuous variable, a density $f(x)$ replaces the mass function. Probabilities come from areas: $P(a \\le X \\le b) = \\int_a^b f(x)\\, dx$. The density at one point is not a probability and can exceed 1.

For two variables the three distributions are related by:

$$P(X = x) = \\sum_y P(X = x, Y = y), \\qquad P(Y = y \\mid X = x) = \\frac{P(X = x, Y = y)}{P(X = x)}$$

The first equation is marginalisation: sum the joint over the other variable. The second is conditioning: divide the joint by the marginal of the given variable.

To build the three from data:

1. Count how often each pair $(x, y)$ occurs. Divide by the total to get the joint.
2. Sum each row to get the marginal of $X$. Sum each column to get the marginal of $Y$.
3. Divide each cell by its row total to get $P(Y \\mid X)$.

Two variables are independent when $P(X, Y) = P(X) P(Y)$ for every pair. In the die table, $P(A = 1, Y = 1) = 1/6$ and $P(A = 1) P(Y = 1) = (2/6)(1/2) = 1/6$. These two variables are independent.

A model turns scores into a distribution with the softmax function, which makes every value positive and the sum equal to one.

Note: a token sequence of length $T$ has probability $P(t_1) P(t_2 \\mid t_1) \\cdots P(t_T \\mid t_1, \\dots, t_{T-1})$. This is the chain rule of probability, and it is why a model only needs the next-token conditional.

The program computes the lesson's example.

:::code
lang: python
file: joint_table.py
from fractions import Fraction

rolls = [1, 2, 3, 4, 5, 6]
A = lambda r: 1 if r <= 2 else 0       # roll is at most 2
Y = lambda r: 1 if r % 2 == 0 else 0   # roll is even

joint = {}
for r in rolls:
    key = (A(r), Y(r))
    joint[key] = joint.get(key, 0) + Fraction(1, 6)
for key in sorted(joint):
    print("P(A =", key[0], ", Y =", key[1], ") =", joint[key])

p_A1 = joint[(1, 0)] + joint[(1, 1)]           # row total
p_Y1 = joint[(0, 1)] + joint[(1, 1)]           # column total
print("P(A = 1) =", p_A1, " P(Y = 1) =", p_Y1)
print("P(Y = 1 | A = 1) =", joint[(1, 1)] / p_A1)
print("independent:", joint[(1, 1)] == p_A1 * p_Y1)

# a model output is a conditional distribution over tokens
next_token = {"mat": 0.4, "floor": 0.2, "sofa": 0.1, "other": 0.3}
print("sums to one:", abs(sum(next_token.values()) - 1.0) < 1e-9)
:::

## Try it

:::exercise
title: Build a joint table that is not independent
task: Keep the fair die and Y = 1 for an even roll. Define a new variable B = 1 when the roll is at most 3. Build the 2 by 2 joint table of B and Y by counting rolls. Compute the marginals P(B = 1) and P(Y = 1), the conditional P(Y = 1 given B = 1), and check whether B and Y are independent. Confirm with Python using the fractions module.
hint: Rolls 1, 2, and 3 have B = 1. Among them only roll 2 is even.
lang: python
solution:
from fractions import Fraction

# by counting: B1 Y0 has rolls 1 and 3 (2/6), B1 Y1 has roll 2 (1/6),
# B0 Y0 has roll 5 (1/6), B0 Y1 has rolls 4 and 6 (2/6)
joint = {}
for r in range(1, 7):
    key = (1 if r <= 3 else 0, 1 if r % 2 == 0 else 0)
    joint[key] = joint.get(key, 0) + Fraction(1, 6)
p_B1 = joint[(1, 0)] + joint[(1, 1)]          # 3/6
p_Y1 = joint[(0, 1)] + joint[(1, 1)]          # 3/6
print(p_B1, p_Y1)
print(joint[(1, 1)] / p_B1)                   # P(Y=1 | B=1) = 1/3
print(joint[(1, 1)], p_B1 * p_Y1)             # 1/6 versus 1/4
print(joint[(1, 1)] == p_B1 * p_Y1)           # False: not independent
:::

## Common mistakes

- Mistake: you read a density value as a probability. Fix: probabilities for continuous variables are areas.
- Mistake: you divide by the wrong total when conditioning. Fix: divide by the marginal of the variable after the bar.
- Mistake: you assume two variables are independent because they seem unrelated. Fix: check $P(X, Y) = P(X) P(Y)$ on the table.
- Mistake: you forget that a distribution must sum to one. Fix: normalise after every change to the scores.

## Check your understanding

Answer each question before you open the explanation.

:::quiz
title: Check: random variables
q: In the die table, what is P(A = 0 given Y = 0)?
- 1/3
- 1/2
* 2/3
- 1/6
why: The cell P(A = 0, Y = 0) is 2/6 and the column total P(Y = 0) is 3/6, so the ratio is 2/3.
q: How do you get the marginal of Y from a joint table?
- Divide each cell by its row total
* Add up each column
- Take the largest cell in each column
why: Marginalising sums the joint over the other variable, which for Y means adding down each column.
q: A continuous density has value 3 at x = 0.5. What does this tell you?
- The probability that X equals 0.5 is 3
- The density is invalid because it exceeds 1
* Probability near 0.5 is high, but any single point has probability zero
why: Densities give probabilities through areas, so a density can exceed 1 and a point has no area.
q: Two variables have P(X = 1) = 0.5, P(Y = 1) = 0.4, and P(X = 1, Y = 1) = 0.3. Are they independent?
- Yes, because 0.3 is less than both marginals
* No, because 0.5 times 0.4 = 0.2 is not 0.3
- Not enough information
why: Independence requires the joint to equal the product of the marginals for every pair of values.
q: What does a language model output at each step?
- The single most likely token
* A conditional distribution over the whole vocabulary given the prompt
- A probability for the prompt
why: Sampling, temperature and top-p all act on this distribution of next-token probabilities.
:::

## Go further

Seeing Theory shows distributions as interactive pictures. The Harvard Statistics 110 course builds probability from counting. The Deep Learning book's probability chapter covers the definitions used in machine learning. The StatQuest channel has short videos on each concept.
`,
          links: [
            { label: 'Seeing Theory', url: 'https://seeing-theory.brown.edu/', kind: 'article' },
            { label: 'Harvard Statistics 110: Probability', url: 'https://projects.iq.harvard.edu/stat110', kind: 'course' },
            { label: 'Deep Learning book, chapter 3: Probability and Information Theory', url: 'https://www.deeplearningbook.org/contents/prob.html', kind: 'article' },
            { label: 'StatQuest', url: 'https://www.youtube.com/@statquest', kind: 'video' },
          ],
        },
        {
          slug: 'bayes-rule',
          title: 'Bayes rule',
          summary: 'Bayes rule turns the probability of evidence given a cause into the probability of the cause given the evidence.',
          minutes: 15,
          objectives: [
            'State Bayes rule and name the prior, likelihood, posterior, and evidence.',
            'Compute a posterior probability for a medical test by hand.',
            'Explain why a rare condition gives many false positives even with a good test.',
            'Describe how a classifier output is a posterior over classes.',
          ],
          keyTerms: ['Bayes rule', 'prior', 'likelihood', 'posterior', 'evidence', 'base rate', 'conditional probability'],
          body: `
## What this lesson covers

This lesson explains Bayes rule, the formula that reverses a conditional probability. It names the four parts of the rule and works through a test for a rare condition. You will compute a posterior by counting and then by the formula.

## Why it matters

Bayes rule is the logic of updating a belief with evidence. A classifier that outputs $P(\\text{class} \\mid \\text{input})$ outputs a posterior. A spam filter, a diagnosis model, and a retrieval reranker all compute one. The rule also explains a common error: a test that is right 99 percent of the time can still be wrong most of the time it says yes.

:::video
id: HZGCoVF3YvM
why: Watch the whole video, 15 minutes. It draws Bayes rule as areas of a square, which is the counting method in this lesson, and explains why the base rate matters so much.
:::

## The idea with an example

A condition affects 1 person in 1,000. A test detects it in 99 percent of people who have it. The test also gives a false positive for 1 percent of people who do not have it. A person tests positive. What is the probability that the person has the condition?

Count a population of 100,000 people:

| Group | Count | Test positive |
| --- | --- | --- |
| Have the condition | 100 | 99 |
| Do not have it | 99,900 | 999 |
| Total | 100,000 | 1,098 |

Out of 1,098 positive tests, 99 are true. The probability is $99 / 1{,}098 \\approx 0.09$. A positive test means a 9 percent chance of the condition, not 99 percent. The false positives from the large healthy group outnumber the true positives from the small affected group.

The grid shows the four counts as a confusion table.

:::matrix
title: Confusion table for 100,000 people
cols: test positive, test negative
have the condition: 99, 1
do not have it: 999, 98901
:::

Now the formula. The prior is $P(C) = 0.001$. The likelihood is $P(+ \\mid C) = 0.99$. The false positive rate is $P(+ \\mid \\neg C) = 0.01$. The evidence is $P(+) = 0.99 \\times 0.001 + 0.01 \\times 0.999 = 0.01098$. The posterior is $0.99 \\times 0.001 / 0.01098 \\approx 0.09$. The two methods agree.

Press Next to apply Bayes rule with the formula.

:::scenario
title: Posterior after one positive test
state: prior=0.001, likelihood=0.99, false positive rate=0.01
step: Multiply the prior by the likelihood. 0.001 times 0.99 is 0.00099.
state: prior times likelihood=0.00099
step: Multiply the complement of the prior by the false positive rate. 0.999 times 0.01 is 0.00999.
state: healthy times false positive=0.00999
step: Add the two products to get the evidence P(+) = 0.01098.
state: evidence=0.01098
step: Divide the first product by the evidence. The posterior is 0.00099 / 0.01098 = 0.09.
state: posterior=0.09
step: Use 0.09 as the new prior for a second positive test. The new posterior is 0.0891 / (0.0891 + 0.0091) = 0.91.
state: prior=0.09, posterior=0.91
:::

A second positive test changes the picture. Use the posterior 0.09 as the new prior. The new posterior is $0.99 \\times 0.09 / (0.99 \\times 0.09 + 0.01 \\times 0.91) \\approx 0.91$. Two pieces of evidence move the belief from 0.1 percent to 91 percent.

The bars compare the belief before and after each test.

:::bars
title: Probability of the condition
Before any test: 0.001
After one positive test: 0.09
After two positive tests: 0.91
:::

## How it works


:::anim
title: Posterior after one positive test
# Worked values and narration follow the scenario in this lesson.
text heading "Posterior after one positive test" @ 480,48 size: 23 color: white
text legend "WORKED EXAMPLE · FOLLOW EACH CHANGE" @ 480,80 size: 13 color: grey
num scene = 1 @ 850,145 prefix: "Scene " size: 16 color: grey
dot cursor @ 100,145 r: 8 color: blue
dot mark0 @ 100,145 r: 3 color: grey
dot mark1 @ 220,145 r: 3 color: grey
dot mark2 @ 340,145 r: 3 color: grey
dot mark3 @ 460,145 r: 3 color: grey
dot mark4 @ 580,145 r: 3 color: grey
dot mark5 @ 700,145 r: 3 color: grey
rect card0 @ 180,255 size: 260x120 color: blue
text key0 "" @ 180,222 size: 16 color: grey
text value0 "" @ 180,267 size: 20 color: white
rect card1 @ 480,255 size: 260x120 color: blue
text key1 "" @ 480,222 size: 16 color: grey
text value1 "" @ 480,267 size: 20 color: white
rect card2 @ 780,255 size: 260x120 color: blue
text key2 "" @ 780,222 size: 16 color: grey
text value2 "" @ 780,267 size: 20 color: white
rect card3 @ 180,405 size: 260x120 color: blue
text key3 "" @ 180,372 size: 16 color: grey
text value3 "" @ 180,417 size: 20 color: white
rect card4 @ 480,405 size: 260x120 color: blue
text key4 "" @ 480,372 size: 16 color: grey
text value4 "" @ 480,417 size: 20 color: white
rect card5 @ 780,405 size: 260x120 color: blue
text key5 "" @ 780,372 size: 16 color: grey
text value5 "" @ 780,417 size: 20 color: white

step: Start with the example's initial values.
  show heading, legend, scene, cursor, mark0, mark1, mark2, mark3, mark4, mark5, card0, key0, value0, card1, key1, value1, card2, key2, value2, card3, key3, value3, card4, key4, value4, card5, key5, value5
  label key0 "prior"
  & label value0 "0.001"
  & highlight card0
  label key1 "likelihood"
  & label value1 "0.99"
  & highlight card1
  label key2 "false positive rate"
  & label value2 "0.01"
  & highlight card2

step: Multiply the prior by the likelihood.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 220,145 (0.6s)
  & count scene -> 2 (0.6s)
  label key0 "prior times likelihood"
  & label value0 "0.00099"
  & highlight card0
  label key1 "prior"
  & label value1 "0.001"
  label key2 "likelihood"
  & label value2 "0.99"
  label key3 "false positive rate"
  & label value3 "0.01"

step: Multiply the complement of the prior by the false positive rate.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 340,145 (0.6s)
  & count scene -> 3 (0.6s)
  label key0 "healthy times false|positive"
  & label value0 "0.00999"
  & highlight card0
  label key1 "prior times likelihood"
  & label value1 "0.00099"
  label key2 "prior"
  & label value2 "0.001"
  label key3 "likelihood"
  & label value3 "0.99"
  label key4 "false positive rate"
  & label value4 "0.01"

step: Add the two products to get the evidence P(+) = 0.01098.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 460,145 (0.6s)
  & count scene -> 4 (0.6s)
  label key0 "evidence"
  & label value0 "0.01098"
  & highlight card0
  label key1 "healthy times false|positive"
  & label value1 "0.00999"
  label key2 "prior times likelihood"
  & label value2 "0.00099"
  label key3 "prior"
  & label value3 "0.001"
  label key4 "likelihood"
  & label value4 "0.99"
  label key5 "false positive rate"
  & label value5 "0.01"

step: Divide the first product by the evidence.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 580,145 (0.6s)
  & count scene -> 5 (0.6s)
  label key0 "posterior"
  & label value0 "0.09"
  & highlight card0
  label key1 "evidence"
  & label value1 "0.01098"
  label key2 "healthy times false|positive"
  & label value2 "0.00999"
  label key3 "prior times likelihood"
  & label value3 "0.00099"
  label key4 "prior"
  & label value4 "0.001"
  label key5 "likelihood"
  & label value5 "0.99"

step: Use 0.09 as the new prior for a second positive test.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 700,145 (0.6s)
  & count scene -> 6 (0.6s)
  label key0 "prior"
  & label value0 "0.09"
  & highlight card0
  label key1 "posterior"
  & label value1 "0.91"
  & highlight card1
  label key2 "evidence"
  & label value2 "0.01098"
  label key3 "healthy times false|positive"
  & label value3 "0.00999"
  label key4 "prior times likelihood"
  & label value4 "0.00099"
  label key5 "likelihood"
  & label value5 "0.99"
:::

Bayes rule is:

$$P(C \\mid E) = \\frac{P(E \\mid C)\\, P(C)}{P(E)}$$

$P(C \\mid E)$ is the posterior, the probability of the cause given the evidence. $P(E \\mid C)$ is the likelihood, the probability of the evidence given the cause. $P(C)$ is the prior, the probability of the cause before the evidence. $P(E)$ is the evidence, the total probability of seeing $E$.

The evidence expands by marginalisation:

$$P(E) = \\sum_c P(E \\mid c)\\, P(c)$$

The sum runs over every possible cause $c$. This term makes the posterior sum to one across causes.

To apply Bayes rule by hand:

1. Write down the prior for each cause.
2. Write down the likelihood of the evidence under each cause.
3. Multiply prior by likelihood for each cause.
4. Add the products to get the evidence.
5. Divide each product by the evidence to get the posterior.

A classifier learns $P(\\text{class} \\mid x)$ directly from labelled data. Its output follows the same rule. If the training set has 1 percent positives and the deployment population has 10 percent, the learned prior is wrong and the posterior is too low. Correct it by multiplying the odds by the ratio of priors.

Note: the posterior from one piece of evidence becomes the prior for the next. Repeated updates with independent evidence multiply the likelihoods.

The program computes the lesson's example.

:::code
lang: python
file: bayes.py
def posterior(prior, likelihood, false_positive_rate):
    # probability of the condition after one positive test
    true_pos = prior * likelihood
    false_pos = (1 - prior) * false_positive_rate
    evidence = true_pos + false_pos
    return true_pos / evidence

p = 0.001
p1 = posterior(p, 0.99, 0.01)
print("after one positive test:", round(p1, 3))      # 0.09
p2 = posterior(p1, 0.99, 0.01)
print("after two positive tests:", round(p2, 3))     # 0.91

# the same answer by counting 100,000 people
people = 100_000
have = people * p
true_positives = have * 0.99                         # 99
false_positives = (people - have) * 0.01             # 999
print("positives:", true_positives + false_positives, "of which true:", true_positives)
print("fraction true:", round(true_positives / (true_positives + false_positives), 3))
:::

## Try it

:::exercise
title: A less rare condition and a weaker test
task: A condition affects 2 percent of people. A test detects it 90 percent of the time and gives a false positive 5 percent of the time. Compute the posterior probability of the condition after one positive test, both by counting a population of 10,000 people and by the formula. Then use that posterior as the new prior and compute the belief after a second positive test. Check both numbers with the posterior function from the lesson.
hint: In 10,000 people, 200 have the condition and 180 of them test positive. Of the 9,800 others, 490 test positive.
lang: python
solution:
def posterior(prior, likelihood, fpr):
    tp = prior * likelihood
    fp = (1 - prior) * fpr
    return tp / (tp + fp)

# counting: 180 true positives out of 180 + 490 = 670 positives
print(round(180 / 670, 3))                   # 0.269
p1 = posterior(0.02, 0.90, 0.05)
print(round(p1, 3))                          # 0.269
p2 = posterior(p1, 0.90, 0.05)
print(round(p2, 3))                          # 0.869
# two positive tests move the belief from 2 percent to 87 percent
:::

## Common mistakes

- Mistake: you read $P(+ \\mid C)$ as $P(C \\mid +)$. Fix: the two conditionals differ; Bayes rule converts between them.
- Mistake: you ignore the base rate. Fix: the prior decides the answer when the condition is rare.
- Mistake: you forget the evidence term. Fix: divide by $P(E)$, or the posteriors do not sum to one.
- Mistake: you deploy a classifier to a population with a different class balance. Fix: adjust the output odds by the prior ratio.

## Check your understanding

Answer each question before you open the explanation.

:::quiz
title: Check: Bayes rule
q: With prior 0.5, likelihood 0.8, and false positive rate 0.2, what is the posterior after a positive test?
- 0.5
- 0.64
* 0.8
- 0.4
why: The two products are 0.4 and 0.1, and 0.4 divided by 0.5 is 0.8.
q: What is the evidence P(E) in Bayes rule?
- The probability of the cause before seeing data
* The total probability of the evidence summed over every cause
- The probability of the evidence given the cause
why: The evidence is the sum of likelihood times prior over all causes, and it makes the posteriors sum to one.
q: A test is right 99 percent of the time but only 9 percent of positive results are true. Why?
- The test has a bug
* The condition is rare, so false positives from the large healthy group outnumber true positives
- The likelihood was computed in the wrong direction
why: With a prior of 1 in 1,000, the healthy group is 999 times larger and its 1 percent false positives dominate.
q: Why does a second positive test raise the belief from 9 percent to 91 percent?
* The first posterior becomes the prior, and a prior of 0.09 is 90 times larger than 0.001
- The second test is more accurate than the first
- The evidence term is dropped on the second update
why: Each update multiplies the odds by the same likelihood ratio, and the second update starts from much higher odds.
q: A classifier is trained on data with 1 percent positives and deployed where 10 percent are positive. What happens to its outputs?
- They are unchanged, because the model learned the likelihood
* They are too low, because the learned prior is wrong
- They are too high, because the model sees more positives
why: The output is a posterior that includes the training prior, so a different deployment prior needs a correction of the odds.
:::

## Go further

The 3Blue1Brown channel has a visual video on Bayes rule with the counting method. The Harvard Statistics 110 course covers conditional probability in its early lectures. Seeing Theory has an interactive Bayes page. The Deep Learning book's probability chapter states the rule in the notation used in papers.
`,
          links: [
            { label: '3Blue1Brown', url: 'https://www.youtube.com/@3blue1brown', kind: 'video' },
            { label: 'Harvard Statistics 110: Probability', url: 'https://projects.iq.harvard.edu/stat110', kind: 'course' },
            { label: 'Seeing Theory', url: 'https://seeing-theory.brown.edu/', kind: 'article' },
            { label: 'Deep Learning book, chapter 3: Probability and Information Theory', url: 'https://www.deeplearningbook.org/contents/prob.html', kind: 'article' },
          ],
        },
        {
          slug: 'expectation-and-variance',
          title: 'Expectation and variance',
          summary: 'Expectation is the probability-weighted average of a random variable, and variance measures its spread around that average.',
          minutes: 14,
          objectives: [
            'Compute the expectation and variance of a discrete random variable.',
            'Use linearity of expectation to simplify a sum of random variables.',
            'Explain why the variance of a sample mean falls with the sample size.',
            'Describe where expectation and variance appear in a training loop.',
          ],
          keyTerms: ['expectation', 'variance', 'standard deviation', 'linearity of expectation', 'sample mean', 'Monte Carlo estimate', 'batch size'],
          body: `
## What this lesson covers

This lesson explains expectation and variance. Expectation is the average value of a random variable, weighted by probability. Variance measures how far the variable spreads from that average. You will compute both for a die and for a weighted coin, and see what they mean for a batch gradient.

## Why it matters

Every loss is an expectation over the data distribution, estimated by an average over a batch. The gradient of a batch is a random variable whose variance depends on the batch size. The optimisation module uses this fact to set batch size and learning rate together. Variance also drives the design of the layer normalisation and initialisation rules.

:::video
id: SzZ6GpcfoQY
why: Watch the whole video, 14 minutes. It computes the mean and variance of a small sample in the same order as the die table in this lesson. Note the difference between a population variance and a sample estimate.
:::

## The idea with an example

Roll a fair die and call the outcome $X$. The expectation is the sum of each value times its probability:

$$E[X] = \\frac{1 + 2 + 3 + 4 + 5 + 6}{6} = 3.5$$

The die never shows 3.5. The expectation is the long-run average over many rolls.

The variance measures spread. Subtract the mean from each value, square the result, and take the weighted average:

| Value | Deviation | Squared |
| --- | --- | --- |
| 1 | -2.5 | 6.25 |
| 2 | -1.5 | 2.25 |
| 3 | -0.5 | 0.25 |
| 4 | 0.5 | 0.25 |
| 5 | 1.5 | 2.25 |
| 6 | 2.5 | 6.25 |

The average of the squared column is $17.5 / 6 \\approx 2.92$. That is the variance. The standard deviation is the square root, about 1.71. It has the same units as the variable.

The grid shows the deviation and the squared deviation for each face.

:::matrix
title: Deviation from the mean 3.5 for each face of the die
cols: 1, 2, 3, 4, 5, 6
deviation: -2.5, -1.5, -0.5, 0.5, 1.5, 2.5
squared: 6.25, 2.25, 0.25, 0.25, 2.25, 6.25
:::

Press Next to compute the variance with the shortcut formula.

:::scenario
title: Variance of a fair die by the shortcut formula
state: values=1 to 6, probability=1/6 each
step: Compute E[X]. The sum 1 + 2 + 3 + 4 + 5 + 6 = 21, divided by 6, is 3.5.
state: E[X]=3.5
step: Compute E[X^2]. The sum 1 + 4 + 9 + 16 + 25 + 36 = 91, divided by 6, is 15.17.
state: E[X^2]=15.17
step: Square the mean. 3.5 times 3.5 is 12.25.
state: E[X]^2=12.25
step: Subtract. 15.17 - 12.25 = 2.92. This is the variance.
state: variance=2.92
step: Take the square root. The standard deviation is 1.71.
state: standard deviation=1.71
:::

Now a weighted coin that gives 1 with probability $p = 0.3$ and 0 otherwise. The expectation is $0.3$. The variance is $p(1 - p) = 0.21$. Flip the coin 100 times and take the average. The expectation of the average is still $0.3$. Its variance is $0.21 / 100 = 0.0021$, and its standard deviation is about 0.046. The average of 100 flips sits within about 0.05 of the truth most of the time. The average of 10,000 flips sits within about 0.005.

The bars compare the standard deviation of the sample mean for three sample sizes.

:::bars
title: Standard deviation of the average of n coin flips with p = 0.3
1 flip: 0.458
100 flips: 0.046
10000 flips: 0.0046
:::

## How it works


:::anim
title: Variance of a fair die by the shortcut formula
# Worked values and narration follow the scenario in this lesson.
text heading "Variance of a fair die by the shortcut formula" @ 480,48 size: 23 color: white
text legend "WORKED EXAMPLE · FOLLOW EACH CHANGE" @ 480,80 size: 13 color: grey
num scene = 1 @ 850,145 prefix: "Scene " size: 16 color: grey
dot cursor @ 100,145 r: 8 color: blue
dot mark0 @ 100,145 r: 3 color: grey
dot mark1 @ 220,145 r: 3 color: grey
dot mark2 @ 340,145 r: 3 color: grey
dot mark3 @ 460,145 r: 3 color: grey
dot mark4 @ 580,145 r: 3 color: grey
dot mark5 @ 700,145 r: 3 color: grey
rect card0 @ 180,255 size: 260x120 color: blue
text key0 "" @ 180,222 size: 16 color: grey
text value0 "" @ 180,267 size: 20 color: white
rect card1 @ 480,255 size: 260x120 color: blue
text key1 "" @ 480,222 size: 16 color: grey
text value1 "" @ 480,267 size: 20 color: white
rect card2 @ 780,255 size: 260x120 color: blue
text key2 "" @ 780,222 size: 16 color: grey
text value2 "" @ 780,267 size: 20 color: white
rect card3 @ 180,405 size: 260x120 color: blue
text key3 "" @ 180,372 size: 16 color: grey
text value3 "" @ 180,417 size: 20 color: white
rect card4 @ 480,405 size: 260x120 color: blue
text key4 "" @ 480,372 size: 16 color: grey
text value4 "" @ 480,417 size: 20 color: white
rect card5 @ 780,405 size: 260x120 color: blue
text key5 "" @ 780,372 size: 16 color: grey
text value5 "" @ 780,417 size: 20 color: white

step: Start with the example's initial values.
  show heading, legend, scene, cursor, mark0, mark1, mark2, mark3, mark4, mark5, card0, key0, value0, card1, key1, value1, card2, key2, value2, card3, key3, value3, card4, key4, value4, card5, key5, value5
  label key0 "values"
  & label value0 "1 to 6"
  & highlight card0
  label key1 "probability"
  & label value1 "1/6 each"
  & highlight card1

step: Compute E[X].
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 220,145 (0.6s)
  & count scene -> 2 (0.6s)
  label key0 "E[X]"
  & label value0 "3.5"
  & highlight card0
  label key1 "values"
  & label value1 "1 to 6"
  label key2 "probability"
  & label value2 "1/6 each"

step: Compute E[X^2].
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 340,145 (0.6s)
  & count scene -> 3 (0.6s)
  label key0 "E[X^2]"
  & label value0 "15.17"
  & highlight card0
  label key1 "E[X]"
  & label value1 "3.5"
  label key2 "values"
  & label value2 "1 to 6"
  label key3 "probability"
  & label value3 "1/6 each"

step: Square the mean.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 460,145 (0.6s)
  & count scene -> 4 (0.6s)
  label key0 "E[X]^2"
  & label value0 "12.25"
  & highlight card0
  label key1 "E[X^2]"
  & label value1 "15.17"
  label key2 "E[X]"
  & label value2 "3.5"
  label key3 "values"
  & label value3 "1 to 6"
  label key4 "probability"
  & label value4 "1/6 each"

step: Subtract.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 580,145 (0.6s)
  & count scene -> 5 (0.6s)
  label key0 "variance"
  & label value0 "2.92"
  & highlight card0
  label key1 "E[X]^2"
  & label value1 "12.25"
  label key2 "E[X^2]"
  & label value2 "15.17"
  label key3 "E[X]"
  & label value3 "3.5"
  label key4 "values"
  & label value4 "1 to 6"
  label key5 "probability"
  & label value5 "1/6 each"

step: Take the square root.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 700,145 (0.6s)
  & count scene -> 6 (0.6s)
  label key0 "standard deviation"
  & label value0 "1.71"
  & highlight card0
  label key1 "variance"
  & label value1 "2.92"
  label key2 "E[X]^2"
  & label value2 "12.25"
  label key3 "E[X^2]"
  & label value3 "15.17"
  label key4 "E[X]"
  & label value4 "3.5"
  label key5 "values"
  & label value5 "1 to 6"
:::

The expectation of a discrete random variable is:

$$E[X] = \\sum_x x\\, p(x)$$

$x$ runs over the values of the variable. $p(x)$ is the probability of each value. For a function $g$ of the variable, $E[g(X)] = \\sum_x g(x)\\, p(x)$.

The variance is:

$$\\mathrm{Var}[X] = E\\big[(X - E[X])^2\\big] = E[X^2] - E[X]^2$$

The second form is easier to compute by hand. For the die, $E[X^2] = 91 / 6 \\approx 15.17$ and $E[X]^2 = 12.25$, so the variance is $2.92$.

Two rules do most of the work in practice:

- Linearity: $E[aX + bY] = a\\, E[X] + b\\, E[Y]$ for any random variables, dependent or not.
- Variance of independent sums: $\\mathrm{Var}[X + Y] = \\mathrm{Var}[X] + \\mathrm{Var}[Y]$ when $X$ and $Y$ are independent.

From these rules, the sample mean of $n$ independent draws has expectation $E[X]$ and variance $\\mathrm{Var}[X] / n$. The standard deviation falls as $1 / \\sqrt{n}$. To halve the error, take four times the samples.

To compute expectation and variance from a table:

1. Multiply each value by its probability and sum. This is $E[X]$.
2. Multiply each squared value by its probability and sum. This is $E[X^2]$.
3. Subtract $E[X]^2$ from $E[X^2]$. This is the variance.

In training, the true loss is $E[\\ell(\\theta, x)]$ over the data distribution. The batch loss is the sample mean over $n$ examples. Its gradient has variance proportional to $1 / n$. A larger batch gives a less noisy gradient, which allows a larger learning rate. This is a Monte Carlo estimate, an average of random samples that stands in for an expectation.

The diagram shows how a batch gradient estimates the true gradient.

:::flow
title: A batch gradient is a Monte Carlo estimate
Data distribution -> Batch of n: sample n examples
Batch of n -> Per-example loss: compute each loss
Per-example loss -> Sample mean: average over n
Sample mean -> Batch gradient: variance falls as 1/n
:::

Note: the expectation can be undefined. A distribution with a heavy tail can have infinite variance, and the sample mean then does not settle down.

The program computes the lesson's example.

:::code
lang: python
file: expectation.py
import numpy as np

values = np.arange(1, 7)
p = np.full(6, 1 / 6)
mean = (values * p).sum()
second_moment = (values ** 2 * p).sum()
var = second_moment - mean ** 2
print("E[X] =", mean, "E[X^2] =", round(second_moment, 3))
print("Var[X] =", round(var, 3), "std =", round(np.sqrt(var), 3))

# the average of n coin flips with p = 0.3 settles down as 1/sqrt(n)
rng = np.random.default_rng(0)
for n in [1, 100, 10_000]:
    flips = rng.random((2000, n)) < 0.3          # 2000 repeats of n flips
    averages = flips.mean(axis=1)
    print("n =", n, "std of the average =", round(averages.std(), 4),
          "theory =", round(np.sqrt(0.3 * 0.7 / n), 4))
:::

## Try it

:::exercise
title: Expectation and variance of a four-sided die
task: A fair four-sided die shows 1, 2, 3, or 4. Compute E[X], E[X squared], the variance, and the standard deviation by hand with the shortcut formula. Then state the variance and the standard deviation of the average of 25 independent rolls. Check your numbers with a short NumPy simulation of 25 rolls repeated 5,000 times.
hint: E[X squared] is (1 + 4 + 9 + 16) / 4. The variance of an average of n draws is the variance divided by n.
lang: python
solution:
import numpy as np

# E[X] = 10 / 4 = 2.5, E[X^2] = 30 / 4 = 7.5
# Var = 7.5 - 6.25 = 1.25, std = 1.118
# average of 25 rolls: Var = 1.25 / 25 = 0.05, std = 0.224
rng = np.random.default_rng(1)
rolls = rng.integers(1, 5, size=(5000, 25))
averages = rolls.mean(axis=1)
print(round(averages.mean(), 3))          # about 2.5
print(round(averages.var(), 4))           # about 0.05
print(round(averages.std(), 4))           # about 0.224
:::

## Common mistakes

- Mistake: you expect the random variable to equal its expectation. Fix: the expectation is a long-run average, not a typical value.
- Mistake: you add standard deviations of independent variables. Fix: add variances, then take the square root.
- Mistake: you apply the variance sum rule to dependent variables. Fix: it needs independence; otherwise add the covariance.
- Mistake: you double the batch size and expect half the noise. Fix: the standard deviation falls by $\\sqrt{2}$, not by 2.

## Check your understanding

Answer each question before you open the explanation.

:::quiz
title: Check: expectation and variance
q: What is E[2X + 1] for a fair six-sided die?
- 7
* 8
- 3.5
- 6
why: Linearity gives 2 times 3.5 plus 1, which is 8.
q: A variable has variance 4. What is the variance of the mean of 16 independent draws?
- 4
- 1
* 0.25
- 0.5
why: The variance of a sample mean is the variance divided by n, which is 4 / 16 = 0.25.
q: You grow the batch size by 100 times. What happens to the standard deviation of the batch gradient?
- It falls by 100 times
* It falls by 10 times
- It does not change
why: The standard deviation falls as 1 over the square root of n, and the square root of 100 is 10.
q: X and Y are independent with standard deviations 3 and 4. What is the standard deviation of X + Y?
- 7
* 5
- 12
why: Variances add for independent variables: 9 + 16 = 25, and its square root is 5.
q: What is a batch loss in a training loop?
- The exact expected loss over the data distribution
* A Monte Carlo estimate of the expected loss, averaged over n samples
- The loss of the single hardest example
why: The true loss is an expectation, and the batch average is a sample mean that stands in for it.
:::

## Go further

Seeing Theory has an interactive page on expectation and variance. The Harvard Statistics 110 course covers both with many worked problems. The StatQuest channel has short explanations. The Deep Learning book's probability chapter lists the rules in machine learning notation.
`,
          links: [
            { label: 'Seeing Theory', url: 'https://seeing-theory.brown.edu/', kind: 'article' },
            { label: 'Harvard Statistics 110: Probability', url: 'https://projects.iq.harvard.edu/stat110', kind: 'course' },
            { label: 'StatQuest', url: 'https://www.youtube.com/@statquest', kind: 'video' },
            { label: 'Deep Learning book, chapter 3: Probability and Information Theory', url: 'https://www.deeplearningbook.org/contents/prob.html', kind: 'article' },
          ],
        },
        {
          slug: 'common-distributions',
          title: 'Common distributions',
          summary: 'Four distributions cover most of machine learning: Bernoulli, categorical, Gaussian, and the softmax output of a model.',
          minutes: 15,
          objectives: [
            'Write the mass or density function of the Bernoulli, categorical, and Gaussian distributions.',
            'Compute the mean and variance of each from its parameters.',
            'Explain why the Gaussian appears as the limit of many small effects.',
            'Match each distribution to the model output it describes.',
          ],
          keyTerms: ['Bernoulli', 'categorical', 'Gaussian', 'normal distribution', 'central limit theorem', 'softmax', 'temperature', 'initialisation'],
          body: `
## What this lesson covers

This lesson covers the distributions that appear most often in machine learning. The Bernoulli models a yes or no outcome. The categorical models one choice among many. The Gaussian models a continuous quantity with a centre and a spread. You will compute the mean and variance of each and connect each to a model output.

## Why it matters

A binary classifier outputs a Bernoulli. A language model outputs a categorical over the vocabulary. Weights are initialised from a Gaussian, and noise in a diffusion model is Gaussian. The loss function for each output type comes from the matching distribution, as the statistics module shows. Knowing the four distributions means knowing the output layer of every model.

:::video
id: KpKog-L9veg
why: Watch the whole video, 12 minutes. It computes a softmax from raw scores exactly as the scenario in this lesson does, and shows why the outputs form a valid categorical distribution.
:::

## The idea with an example

A spam filter looks at one email and outputs $p = 0.8$. The label is a Bernoulli random variable: spam with probability 0.8 and not spam with probability 0.2. The mean is $0.8$ and the variance is $0.8 \\times 0.2 = 0.16$.

A language model looks at a prompt and outputs scores for four tokens: $[2.0, 1.0, 0.0, -1.0]$. Softmax turns the scores into a categorical distribution:

| Token | Score | $e^{\\text{score}}$ | Probability |
| --- | --- | --- | --- |
| A | 2.0 | 7.39 | 0.64 |
| B | 1.0 | 2.72 | 0.24 |
| C | 0.0 | 1.00 | 0.09 |
| D | -1.0 | 0.37 | 0.03 |

The column of $e^{\\text{score}}$ sums to 11.48, and each probability is the entry divided by that sum. Divide every score by a temperature of 2 before softmax and the probabilities move toward $[0.45, 0.27, 0.17, 0.10]$. A higher temperature flattens the distribution.

Press Next to compute the softmax by hand.

:::scenario
title: Softmax of the scores [2, 1, 0, -1]
state: scores=[2 1 0 -1]
step: Exponentiate each score. e^2 = 7.39, e^1 = 2.72, e^0 = 1.00, and e^-1 = 0.37.
state: exponentials=[7.39 2.72 1.00 0.37]
step: Add the exponentials. The sum is 11.48.
state: sum=11.48
step: Divide each exponential by the sum. The probabilities are 0.64, 0.24, 0.09, and 0.03.
state: probabilities=[0.64 0.24 0.09 0.03]
step: Check that the probabilities sum to one. 0.64 + 0.24 + 0.09 + 0.03 = 1.00.
state: total=1.00
step: Divide the scores by a temperature of 2 and repeat. The probabilities move to 0.45, 0.27, 0.17, and 0.10.
state: temperature=2, probabilities=[0.45 0.27 0.17 0.10]
:::

The grid shows the probabilities at temperature 1 and at temperature 2.

:::matrix
title: Softmax output at two temperatures
cols: A, B, C, D
temperature 1: 0.64, 0.24, 0.09, 0.03
temperature 2: 0.45, 0.27, 0.17, 0.10
:::

The bars compare the four probabilities at temperature 1.

:::bars
title: Categorical distribution over the four tokens
A: 0.64
B: 0.24
C: 0.09
D: 0.03
:::

A weight in a new network is drawn from a Gaussian with mean 0 and standard deviation 0.02. About 68 percent of weights fall within $\\pm 0.02$ and about 95 percent fall within $\\pm 0.04$. The Gaussian is the natural choice because the sum of many small independent effects tends to a Gaussian. That result is the central limit theorem, and it is why the sample mean of any distribution with finite variance looks Gaussian for a large sample.

The bars compare the share of weights inside each band around zero.

:::bars
title: Share of Gaussian weights with standard deviation 0.02
unit: percent
Within 0.02: 68
Within 0.04: 95
Within 0.06: 99.7
:::

## How it works


:::anim
title: Softmax of the scores [2, 1, 0, -1]
# Worked values and narration follow the scenario in this lesson.
text heading "Softmax of the scores [2, 1, 0, -1]" @ 480,48 size: 23 color: white
text legend "WORKED EXAMPLE · FOLLOW EACH CHANGE" @ 480,80 size: 13 color: grey
num scene = 1 @ 850,145 prefix: "Scene " size: 16 color: grey
dot cursor @ 100,145 r: 8 color: blue
dot mark0 @ 100,145 r: 3 color: grey
dot mark1 @ 220,145 r: 3 color: grey
dot mark2 @ 340,145 r: 3 color: grey
dot mark3 @ 460,145 r: 3 color: grey
dot mark4 @ 580,145 r: 3 color: grey
dot mark5 @ 700,145 r: 3 color: grey
rect card0 @ 180,255 size: 260x120 color: blue
text key0 "" @ 180,222 size: 16 color: grey
text value0 "" @ 180,267 size: 20 color: white
rect card1 @ 480,255 size: 260x120 color: blue
text key1 "" @ 480,222 size: 16 color: grey
text value1 "" @ 480,267 size: 20 color: white
rect card2 @ 780,255 size: 260x120 color: blue
text key2 "" @ 780,222 size: 16 color: grey
text value2 "" @ 780,267 size: 20 color: white
rect card3 @ 180,405 size: 260x120 color: blue
text key3 "" @ 180,372 size: 16 color: grey
text value3 "" @ 180,417 size: 20 color: white
rect card4 @ 480,405 size: 260x120 color: blue
text key4 "" @ 480,372 size: 16 color: grey
text value4 "" @ 480,417 size: 20 color: white
rect card5 @ 780,405 size: 260x120 color: blue
text key5 "" @ 780,372 size: 16 color: grey
text value5 "" @ 780,417 size: 20 color: white

step: Start with the example's initial values.
  show heading, legend, scene, cursor, mark0, mark1, mark2, mark3, mark4, mark5, card0, key0, value0, card1, key1, value1, card2, key2, value2, card3, key3, value3, card4, key4, value4, card5, key5, value5
  label key0 "scores"
  & label value0 "[2 1 0 -1]"
  & highlight card0

step: Exponentiate each score.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 220,145 (0.6s)
  & count scene -> 2 (0.6s)
  label key0 "exponentials"
  & label value0 "[7.39 2.72 1.00 0.37]"
  & highlight card0
  label key1 "scores"
  & label value1 "[2 1 0 -1]"

step: Add the exponentials.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 340,145 (0.6s)
  & count scene -> 3 (0.6s)
  label key0 "sum"
  & label value0 "11.48"
  & highlight card0
  label key1 "exponentials"
  & label value1 "[7.39 2.72 1.00 0.37]"
  label key2 "scores"
  & label value2 "[2 1 0 -1]"

step: Divide each exponential by the sum.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 460,145 (0.6s)
  & count scene -> 4 (0.6s)
  label key0 "probabilities"
  & label value0 "[0.64 0.24 0.09 0.03]"
  & highlight card0
  label key1 "sum"
  & label value1 "11.48"
  label key2 "exponentials"
  & label value2 "[7.39 2.72 1.00 0.37]"
  label key3 "scores"
  & label value3 "[2 1 0 -1]"

step: Check that the probabilities sum to one.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 580,145 (0.6s)
  & count scene -> 5 (0.6s)
  label key0 "total"
  & label value0 "1.00"
  & highlight card0
  label key1 "probabilities"
  & label value1 "[0.64 0.24 0.09 0.03]"
  label key2 "sum"
  & label value2 "11.48"
  label key3 "exponentials"
  & label value3 "[7.39 2.72 1.00 0.37]"
  label key4 "scores"
  & label value4 "[2 1 0 -1]"

step: Divide the scores by a temperature of 2 and repeat.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 700,145 (0.6s)
  & count scene -> 6 (0.6s)
  label key0 "temperature"
  & label value0 "2"
  & highlight card0
  label key1 "probabilities"
  & label value1 "[0.45 0.27 0.17 0.10]"
  & highlight card1
  label key2 "total"
  & label value2 "1.00"
  label key3 "sum"
  & label value3 "11.48"
  label key4 "exponentials"
  & label value4 "[7.39 2.72 1.00 0.37]"
  label key5 "scores"
  & label value5 "[2 1 0 -1]"
:::

The three distributions and their parameters:

| Distribution | Parameters | Mass or density | Mean | Variance |
| --- | --- | --- | --- | --- |
| Bernoulli | $p$ | $p^x (1 - p)^{1 - x}$ for $x \\in \\{0, 1\\}$ | $p$ | $p(1 - p)$ |
| Categorical | $p_1, \\dots, p_K$ | $p_k$ for outcome $k$ | one-hot mean $p$ | $p_k(1 - p_k)$ per entry |
| Gaussian | $\\mu, \\sigma^2$ | $\\frac{1}{\\sqrt{2\\pi\\sigma^2}} e^{-(x - \\mu)^2 / 2\\sigma^2}$ | $\\mu$ | $\\sigma^2$ |

$p$ is a probability. $p_k$ is the probability of outcome $k$, and the $K$ values sum to one. $\\mu$ is the centre of the Gaussian and $\\sigma$ is its standard deviation.

The softmax function with temperature $\\tau$ is:

$$p_k = \\frac{e^{z_k / \\tau}}{\\sum_{j=1}^{K} e^{z_j / \\tau}}$$

$z_k$ is the score for outcome $k$. $\\tau$ is the temperature. As $\\tau$ goes to zero, the distribution puts all its mass on the largest score. As $\\tau$ grows, the distribution becomes uniform.

To sample from a categorical by hand:

1. Compute the cumulative sums of the probabilities: $0.64, 0.88, 0.97, 1.00$.
2. Draw a uniform random number $u$ between 0 and 1.
3. Return the first outcome whose cumulative sum exceeds $u$.

Matching output types to distributions:

- A yes or no label: Bernoulli, with a sigmoid output.
- One of $K$ classes or tokens: categorical, with a softmax output.
- A real-valued target such as a price: Gaussian, with a linear output and squared error.

Note: a multivariate Gaussian over a vector has a mean vector and a covariance matrix. Its eigenvectors give the directions of greatest spread, which is where principal component analysis comes from.

The program computes the lesson's example.

:::code
lang: python
file: distributions.py
import numpy as np

def softmax(scores, temperature=1.0):
    z = np.array(scores) / temperature
    e = np.exp(z - z.max())          # subtract the max for safety
    return e / e.sum()

scores = [2.0, 1.0, 0.0, -1.0]
print("T = 1:", np.round(softmax(scores), 2))        # [0.64 0.24 0.09 0.03]
print("T = 2:", np.round(softmax(scores, 2.0), 2))   # [0.45 0.27 0.17 0.10]
print("T = 0.1:", np.round(softmax(scores, 0.1), 3))

# Bernoulli with p = 0.8: mean p, variance p (1 - p)
p = 0.8
print("Bernoulli mean", p, "variance", round(p * (1 - p), 2))

# Gaussian weights with std 0.02: share inside each band
rng = np.random.default_rng(0)
w = rng.normal(0.0, 0.02, size=1_000_000)
for band in [0.02, 0.04, 0.06]:
    print("within", band, ":", round((np.abs(w) < band).mean() * 100, 1), "percent")
:::

## Try it

:::exercise
title: Softmax at two temperatures
task: A model outputs scores [3, 1, 0] for three tokens. Compute the softmax probabilities by hand at temperature 1 and at temperature 0.5. Say which temperature makes the distribution sharper. Then compute the mean and variance of a Bernoulli with p = 0.1. Check the softmax numbers with the softmax function from the lesson.
hint: At temperature 0.5 the scores become [6, 2, 0]. e to the power 3 is 20.09, e to the power 6 is 403.4.
lang: python
solution:
import numpy as np

def softmax(scores, temperature=1.0):
    z = np.array(scores) / temperature
    e = np.exp(z - z.max())
    return e / e.sum()

# T = 1: exponentials 20.09, 2.72, 1.00, sum 23.80
print(np.round(softmax([3, 1, 0]), 3))         # [0.844 0.114 0.042]
# T = 0.5: scores [6, 2, 0], exponentials 403.4, 7.39, 1.00, sum 411.8
print(np.round(softmax([3, 1, 0], 0.5), 3))    # [0.980 0.018 0.002]
# temperature 0.5 is sharper: more mass on the top token
print(0.1, round(0.1 * 0.9, 2))                # Bernoulli mean 0.1, variance 0.09
:::

## Common mistakes

- Mistake: you use squared error for a yes or no label. Fix: use the Bernoulli loss, which is binary cross-entropy.
- Mistake: you apply softmax to probabilities instead of scores. Fix: softmax takes raw scores, often called logits.
- Mistake: you set the temperature to zero and still expect diversity. Fix: temperature zero always picks the top score.
- Mistake: you initialise weights with a large standard deviation. Fix: scale the standard deviation by the input width.

## Check your understanding

Answer each question before you open the explanation.

:::quiz
title: Check: common distributions
q: What is the variance of a Bernoulli with p = 0.5?
- 0.5
* 0.25
- 1
- 0
why: The variance is p (1 - p) = 0.5 times 0.5 = 0.25.
q: What does a temperature above 1 do to a softmax distribution?
- It sharpens it toward the top score
* It flattens it toward uniform
- It leaves it unchanged but rescales the logits
why: Dividing the scores by a large number shrinks the gaps between them, so the exponentials become more equal.
q: Scores are [1, 1, 1, 1]. What are the softmax probabilities?
* 0.25 each
- 1 each
- 0.5 for the first two and 0 for the rest
why: Equal scores give equal exponentials, and four equal values normalise to 0.25.
q: Which distribution matches a model that predicts one token out of 50,000?
- Bernoulli
- Gaussian
* Categorical
why: One choice among K classes is a categorical distribution, with softmax producing its K probabilities.
q: Why are weights initialised from a Gaussian centred at 0 with a small spread?
- Because the Gaussian has the largest variance
* Because sums of many small independent effects tend to a Gaussian, and a small spread around 0 keeps activations stable
- Because the Gaussian is the only distribution with a mean
why: The central limit theorem makes the Gaussian natural, and the small standard deviation keeps the layer outputs in range.
:::

## Go further

Seeing Theory has an interactive gallery of distributions. The Deep Learning book's probability chapter covers each distribution in machine learning notation. The PyTorch distributions documentation shows how to sample and score each one in code. The StatQuest channel explains the Gaussian and the central limit theorem with pictures.
`,
          links: [
            { label: 'Seeing Theory', url: 'https://seeing-theory.brown.edu/', kind: 'article' },
            { label: 'Deep Learning book, chapter 3: Probability and Information Theory', url: 'https://www.deeplearningbook.org/contents/prob.html', kind: 'article' },
            { label: 'PyTorch torch.distributions documentation', url: 'https://pytorch.org/docs/stable/distributions.html', kind: 'docs' },
            { label: 'StatQuest', url: 'https://www.youtube.com/@statquest', kind: 'video' },
          ],
        },
      ],
    },
    {
      slug: 'statistics-and-information',
      title: 'Statistics and information',
      description: 'Maximum likelihood, entropy, cross-entropy, and KL divergence: where loss functions come from.',
      level: 'intermediate',
      lessons: [
        {
          slug: 'maximum-likelihood',
          title: 'Maximum likelihood estimation',
          summary: 'Maximum likelihood picks the parameters under which the observed data is most probable, and it produces most loss functions.',
          minutes: 16,
          objectives: [
            'Write the likelihood and the log-likelihood of a dataset.',
            'Derive the maximum likelihood estimate for a coin by hand.',
            'Explain why the log turns a product into a sum.',
            'Show that squared error is maximum likelihood under Gaussian noise.',
          ],
          keyTerms: ['likelihood', 'log-likelihood', 'maximum likelihood', 'negative log-likelihood', 'parameter', 'squared error', 'independent and identically distributed'],
          body: `
## What this lesson covers

This lesson explains maximum likelihood estimation (MLE). The method chooses the parameters that make the observed data most probable. You will derive the estimate for a coin by hand, and then see that squared error and cross-entropy both come from the same principle.

## Why it matters

Almost every loss in deep learning is a negative log-likelihood. Language models minimise the negative log-likelihood of the next token. Regression minimises the negative log-likelihood under Gaussian noise. When a paper introduces a new loss, the first question is which likelihood it corresponds to. The method also gives a recipe: write the probability of the data, take the log, and minimise the negative.

:::video
id: pYxNSUDSFH4
why: Watch the whole video, 5 minutes. It separates probability, which fixes the parameter and varies the data, from likelihood, which fixes the data and varies the parameter. That distinction is the whole first half of this lesson.
:::

## The idea with an example

Flip a coin 10 times and observe 7 heads and 3 tails. What is the probability of heads, $p$?

The probability of this exact sequence under a given $p$ is $p^7 (1 - p)^3$. This is the likelihood. It is a function of $p$ with the data fixed. Compute it for a few values:

| $p$ | $p^7 (1 - p)^3$ |
| --- | --- |
| 0.5 | 0.00098 |
| 0.6 | 0.00179 |
| 0.7 | 0.00222 |
| 0.8 | 0.00168 |

The likelihood is largest near $p = 0.7$. That is the maximum likelihood estimate, and it matches the fraction of heads.

The bars compare the likelihood at each value of p.

:::bars
title: Likelihood of 7 heads in 10 flips, times 1,000
p = 0.5: 0.98
p = 0.6: 1.79
p = 0.7: 2.22
p = 0.8: 1.68
:::

Now derive it. Take the log: $\\ell(p) = 7 \\ln p + 3 \\ln(1 - p)$. The log turns the product into a sum and does not move the maximum. Differentiate: $\\ell'(p) = 7 / p - 3 / (1 - p)$. Set it to zero: $7(1 - p) = 3p$, so $p = 0.7$. The estimate is the count of heads divided by the total.

Press Next to derive the estimate step by step.

:::scenario
title: Maximum likelihood for 7 heads in 10 flips
state: heads=7, tails=3
step: Write the likelihood p^7 (1 - p)^3.
state: likelihood=p^7 (1 - p)^3
step: Take the log. The log-likelihood is 7 ln p + 3 ln(1 - p).
state: log-likelihood=7 ln p + 3 ln(1 - p)
step: Differentiate with respect to p. The derivative is 7 / p - 3 / (1 - p).
state: derivative=7/p - 3/(1 - p)
step: Set the derivative to zero. 7 (1 - p) = 3 p, so 7 = 10 p.
state: equation=7 = 10 p
step: Solve. p = 0.7, the fraction of heads.
state: estimate=0.7
:::

Minimising the negative log-likelihood $-\\ell(p)$ gives the same answer. That negative log-likelihood is the loss.

## How it works


:::anim
title: Maximum likelihood for 7 heads in 10 flips
# Worked values and narration follow the scenario in this lesson.
text heading "Maximum likelihood for 7 heads in 10 flips" @ 480,48 size: 23 color: white
text legend "WORKED EXAMPLE · FOLLOW EACH CHANGE" @ 480,80 size: 13 color: grey
num scene = 1 @ 850,145 prefix: "Scene " size: 16 color: grey
dot cursor @ 100,145 r: 8 color: blue
dot mark0 @ 100,145 r: 3 color: grey
dot mark1 @ 220,145 r: 3 color: grey
dot mark2 @ 340,145 r: 3 color: grey
dot mark3 @ 460,145 r: 3 color: grey
dot mark4 @ 580,145 r: 3 color: grey
dot mark5 @ 700,145 r: 3 color: grey
rect card0 @ 180,255 size: 260x120 color: blue
text key0 "" @ 180,222 size: 16 color: grey
text value0 "" @ 180,267 size: 20 color: white
rect card1 @ 480,255 size: 260x120 color: blue
text key1 "" @ 480,222 size: 16 color: grey
text value1 "" @ 480,267 size: 20 color: white
rect card2 @ 780,255 size: 260x120 color: blue
text key2 "" @ 780,222 size: 16 color: grey
text value2 "" @ 780,267 size: 20 color: white
rect card3 @ 180,405 size: 260x120 color: blue
text key3 "" @ 180,372 size: 16 color: grey
text value3 "" @ 180,417 size: 20 color: white
rect card4 @ 480,405 size: 260x120 color: blue
text key4 "" @ 480,372 size: 16 color: grey
text value4 "" @ 480,417 size: 20 color: white
rect card5 @ 780,405 size: 260x120 color: blue
text key5 "" @ 780,372 size: 16 color: grey
text value5 "" @ 780,417 size: 20 color: white

step: Start with the example's initial values.
  show heading, legend, scene, cursor, mark0, mark1, mark2, mark3, mark4, mark5, card0, key0, value0, card1, key1, value1, card2, key2, value2, card3, key3, value3, card4, key4, value4, card5, key5, value5
  label key0 "heads"
  & label value0 "7"
  & highlight card0
  label key1 "tails"
  & label value1 "3"
  & highlight card1

step: Write the likelihood p^7 (1 - p)^3.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 220,145 (0.6s)
  & count scene -> 2 (0.6s)
  label key0 "likelihood"
  & label value0 "p^7 (1 - p)^3"
  & highlight card0
  label key1 "heads"
  & label value1 "7"
  label key2 "tails"
  & label value2 "3"

step: Take the log.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 340,145 (0.6s)
  & count scene -> 3 (0.6s)
  label key0 "log-likelihood"
  & label value0 "7 ln p + 3 ln(1 - p)"
  & highlight card0
  label key1 "likelihood"
  & label value1 "p^7 (1 - p)^3"
  label key2 "heads"
  & label value2 "7"
  label key3 "tails"
  & label value3 "3"

step: Differentiate with respect to p.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 460,145 (0.6s)
  & count scene -> 4 (0.6s)
  label key0 "derivative"
  & label value0 "7/p - 3/(1 - p)"
  & highlight card0
  label key1 "log-likelihood"
  & label value1 "7 ln p + 3 ln(1 - p)"
  label key2 "likelihood"
  & label value2 "p^7 (1 - p)^3"
  label key3 "heads"
  & label value3 "7"
  label key4 "tails"
  & label value4 "3"

step: Set the derivative to zero.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 580,145 (0.6s)
  & count scene -> 5 (0.6s)
  label key0 "equation"
  & label value0 "7 = 10 p"
  & highlight card0
  label key1 "derivative"
  & label value1 "7/p - 3/(1 - p)"
  label key2 "log-likelihood"
  & label value2 "7 ln p + 3 ln(1 - p)"
  label key3 "likelihood"
  & label value3 "p^7 (1 - p)^3"
  label key4 "heads"
  & label value4 "7"
  label key5 "tails"
  & label value5 "3"

step: Solve.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 700,145 (0.6s)
  & count scene -> 6 (0.6s)
  label key0 "estimate"
  & label value0 "0.7"
  & highlight card0
  label key1 "equation"
  & label value1 "7 = 10 p"
  label key2 "derivative"
  & label value2 "7/p - 3/(1 - p)"
  label key3 "log-likelihood"
  & label value3 "7 ln p + 3 ln(1 - p)"
  label key4 "likelihood"
  & label value4 "p^7 (1 - p)^3"
  label key5 "heads"
  & label value5 "7"
:::

For a dataset of $n$ independent and identically distributed examples $x_1, \\dots, x_n$ and a model with parameters $\\theta$, the likelihood is:

$$L(\\theta) = \\prod_{i=1}^{n} p(x_i \\mid \\theta)$$

$p(x_i \\mid \\theta)$ is the probability the model assigns to example $i$. The product follows from independence. The log-likelihood is:

$$\\ell(\\theta) = \\sum_{i=1}^{n} \\ln p(x_i \\mid \\theta)$$

The maximum likelihood estimate is $\\hat{\\theta} = \\arg\\max_\\theta \\ell(\\theta)$. The loss used in training is $-\\ell(\\theta) / n$, the average negative log-likelihood.

To derive a loss from a likelihood:

1. Write the probability of one example under the model.
2. Take the log.
3. Sum over the dataset and negate.
4. Drop terms that do not depend on $\\theta$.

The diagram shows the four steps that turn a likelihood into a loss.

:::flow
title: From a likelihood to a training loss
Model probability -> Log: take the log of one example
Log -> Sum: add over n examples
Sum -> Negate: multiply by -1
Negate -> Drop constants: remove terms without theta
Drop constants -> Loss: average negative log-likelihood
:::

Apply the recipe to regression. Suppose the target is $y = f_\\theta(x) + \\epsilon$ with Gaussian noise $\\epsilon$ of variance $\\sigma^2$. The probability of one target is the Gaussian density at $y$ with mean $f_\\theta(x)$. Its log is $-(y - f_\\theta(x))^2 / 2\\sigma^2$ plus a constant. Step 4 drops the constant and the factor $1 / 2\\sigma^2$. The loss is the sum of squared errors. Squared error is maximum likelihood under Gaussian noise.

Apply it to classification. The model outputs a probability $q_k$ for each class. The probability of the true class $y$ is $q_y$. The negative log is $-\\ln q_y$. Summed over the data, this is the cross-entropy loss. The next lesson explains the name.

The table lists the loss that each likelihood produces.

| Output type | Likelihood | Loss after the recipe |
| --- | --- | --- |
| Real value | Gaussian with fixed variance | squared error |
| Yes or no label | Bernoulli | binary cross-entropy |
| One class among K | categorical | cross-entropy |

The log matters for numbers as well as for algebra. A product of 1,000 probabilities below 0.1 is below $10^{-1000}$, which no floating-point format can hold. The sum of 1,000 logs is a number near $-2{,}300$, which is easy.

Note: maximum likelihood with little data overfits. With 1 flip that lands heads, the estimate is $p = 1$. A prior on $\\theta$ fixes this and gives maximum a posteriori estimation.

The program computes the lesson's example.

:::code
lang: python
file: mle_coin.py
import numpy as np

heads, tails = 7, 3
p = np.linspace(0.01, 0.99, 99)
likelihood = p ** heads * (1 - p) ** tails
log_likelihood = heads * np.log(p) + tails * np.log(1 - p)

best = p[np.argmax(likelihood)]
print("maximum likelihood p:", round(best, 2))                 # 0.7
print("same maximum from the log:", round(p[np.argmax(log_likelihood)], 2))
for value in [0.5, 0.6, 0.7, 0.8]:
    L = value ** heads * (1 - value) ** tails
    print("p =", value, "likelihood =", round(L, 5))

# why the log matters for numbers: 1,000 probabilities of 0.1
probs = np.full(1000, 0.1)
print("product:", np.prod(probs))              # underflows to 0.0
print("sum of logs:", np.log(probs).sum())     # -2302.6
:::

## Try it

:::exercise
title: Maximum likelihood for a different coin
task: A coin shows 3 heads in 12 flips. Write the likelihood and the log-likelihood as functions of p. Differentiate the log-likelihood, set the derivative to zero, and solve for p. Then compute the log-likelihood at your estimate and at p = 0.5 to confirm the estimate is higher. Check with a NumPy grid search.
hint: The derivative of 3 ln p + 9 ln(1 - p) is 3 / p minus 9 / (1 - p). Set it to zero and cross-multiply.
lang: python
solution:
import numpy as np

# log-likelihood: 3 ln p + 9 ln(1 - p)
# derivative zero: 3 (1 - p) = 9 p, so 3 = 12 p and p = 0.25
ll = lambda p: 3 * np.log(p) + 9 * np.log(1 - p)
print(round(ll(0.25), 3), round(ll(0.5), 3))     # -6.748 versus -8.318
grid = np.linspace(0.01, 0.99, 99)
print(round(grid[np.argmax(ll(grid))], 2))       # 0.25
:::

## Common mistakes

- Mistake: you multiply probabilities in floating point. Fix: sum log probabilities.
- Mistake: you treat the likelihood as a probability over $\\theta$. Fix: it is a function of $\\theta$ with the data fixed; it need not sum to one.
- Mistake: you keep constants in the loss and wonder why the gradient scale differs. Fix: drop terms without $\\theta$; only the gradient direction matters.
- Mistake: you use squared error for a label in $\\{0, 1\\}$. Fix: the Bernoulli likelihood gives binary cross-entropy.

## Check your understanding

Answer each question before you open the explanation.

:::quiz
title: Check: maximum likelihood
q: A coin shows 2 heads in 8 flips. What is the maximum likelihood estimate of p?
- 0.5
* 0.25
- 0.2
- 0.75
why: The estimate is the count of heads divided by the total: 2 / 8 = 0.25.
q: Which noise model turns maximum likelihood into squared error?
* Gaussian noise with fixed variance
- Bernoulli noise
- Uniform noise
why: The log of a Gaussian density is minus the squared error over 2 sigma squared plus a constant.
q: Why does taking the log not move the maximum of the likelihood?
- Because the log of a product is zero
* Because the log is an increasing function, so it preserves the order of values
- Because the log removes the parameter
why: If L(a) is bigger than L(b) then ln L(a) is bigger than ln L(b), so the argmax is the same.
q: Why do training programs sum log probabilities instead of multiplying probabilities?
- Sums are faster on a GPU
* A product of thousands of small probabilities underflows to zero in floating point
- Multiplication is not defined for probabilities
why: 1,000 factors of 0.1 give 10 to the minus 1,000, which no float can hold, but the sum of logs is about minus 2,300.
q: A model outputs probability q for the true class. What is its maximum likelihood loss on that example?
- q
- 1 minus q
* minus ln q
why: The loss is the negative log-likelihood, which for one example is the negative log of the probability of the true class.
:::

## Go further

The Deep Learning book's machine learning basics chapter derives maximum likelihood and its relation to the common losses. The StatQuest channel has a clear series on likelihood. The Stanford CS229 notes cover the regression and classification derivations. The MacKay book treats inference from first principles and is free online.
`,
          links: [
            { label: 'Deep Learning book, chapter 5: Machine Learning Basics', url: 'https://www.deeplearningbook.org/contents/ml.html', kind: 'article' },
            { label: 'StatQuest', url: 'https://www.youtube.com/@statquest', kind: 'video' },
            { label: 'Stanford CS229: Machine Learning', url: 'https://cs229.stanford.edu/', kind: 'course' },
            { label: 'Information Theory, Inference, and Learning Algorithms (MacKay)', url: 'http://www.inference.org.uk/mackay/itila/', kind: 'article' },
          ],
        },
        {
          slug: 'entropy-and-cross-entropy',
          title: 'Entropy and cross-entropy',
          summary: 'Entropy is the average surprise of a distribution, and cross-entropy is the average surprise when you use the wrong distribution.',
          minutes: 16,
          objectives: [
            'Compute the entropy of a small discrete distribution in bits and in nats.',
            'Compute the cross-entropy between a true distribution and a model distribution.',
            'Explain why cross-entropy is at least as large as entropy.',
            'Convert a language model loss into perplexity.',
          ],
          keyTerms: ['entropy', 'cross-entropy', 'surprise', 'bit', 'nat', 'perplexity', 'one-hot'],
          body: `
## What this lesson covers

This lesson explains entropy and cross-entropy. Entropy measures how unpredictable a distribution is. Cross-entropy measures how many bits a model spends to encode data from another distribution. You will compute both for a four-token example and convert a loss into perplexity.

## Why it matters

The loss reported by every language model is a cross-entropy. The perplexity on a model card is the exponential of that loss. The floor $E$ in a scaling law is the entropy of the text. If you understand entropy, you understand what a loss of 2.0 means and why no model reaches 0.

:::video
id: 6ArSys5qHAU
why: Watch the whole video, 10 minutes. It shows cross-entropy as the negative log of the probability assigned to the true class and compares it with squared error. Note that the video uses natural logs, as training code does.
:::

## The idea with an example

Define the surprise of an outcome with probability $p$ as $-\\log_2 p$ bits. An outcome with probability $1/2$ has surprise 1 bit. An outcome with probability $1/8$ has surprise 3 bits. A certain outcome has surprise 0.

Take a true distribution over four tokens: $P = [0.5, 0.25, 0.125, 0.125]$. The entropy is the average surprise:

| Token | $p$ | Surprise (bits) | $p \\times$ surprise |
| --- | --- | --- | --- |
| A | 0.5 | 1 | 0.5 |
| B | 0.25 | 2 | 0.5 |
| C | 0.125 | 3 | 0.375 |
| D | 0.125 | 3 | 0.375 |

The entropy is $1.75$ bits. A uniform distribution over four tokens would have entropy 2 bits. The skewed distribution is more predictable, so it has lower entropy.

Now a model that predicts $Q = [0.25, 0.25, 0.25, 0.25]$ for the same tokens. The cross-entropy weights the model's surprise by the true probabilities. Every model surprise is 2 bits, so the cross-entropy is $2$ bits. The model spends 2 bits per token where 1.75 would do. The extra 0.25 bits is the price of the wrong model.

Try a second model, $Q' = [0.4, 0.3, 0.2, 0.1]$. Its surprises are $1.32, 1.74, 2.32, 3.32$ bits. Weight them by $P$: $0.66 + 0.43 + 0.29 + 0.42 = 1.80$ bits. This model is closer to the truth and pays less. No model pays less than 1.75, and only $Q = P$ pays exactly 1.75.

Press Next to compute the cross-entropy of Q prime term by term.

:::scenario
title: Cross-entropy of Q prime = [0.4, 0.3, 0.2, 0.1] under P
state: P=[0.5 0.25 0.125 0.125], Q prime=[0.4 0.3 0.2 0.1]
step: Compute the surprise of each token under Q prime. The negative log base 2 of 0.4 is 1.32 bits.
state: surprises=[1.32 1.74 2.32 3.32]
step: Weight each surprise by the true probability. 0.5 times 1.32 is 0.66.
state: term A=0.66
step: Repeat for B, C, and D. 0.25 times 1.74 is 0.43. 0.125 times 2.32 is 0.29. 0.125 times 3.32 is 0.42.
state: term B=0.43, term C=0.29, term D=0.42
step: Add the four terms. The cross-entropy is 1.80 bits.
state: cross-entropy=1.80
step: Compare with the entropy of P, 1.75 bits. The gap of 0.05 bits is the price of the wrong model.
state: entropy=1.75, gap=0.05
:::

The grid shows the surprise in bits of each model for each token.

:::matrix
title: Surprise in bits under P, Q, and Q prime
cols: A, B, C, D
true P: 1, 2, 3, 3
uniform Q: 2, 2, 2, 2
Q prime: 1.32, 1.74, 2.32, 3.32
:::

The bars compare the bits per token that each model pays.

:::bars
title: Bits per token
unit: bits
Entropy of P (the floor): 1.75
Q prime: 1.80
Uniform Q: 2
:::

## How it works


:::anim
title: Cross-entropy of Q prime = [0.4, 0.3, 0.2, 0.1] under P
# Worked values and narration follow the scenario in this lesson.
text heading "Cross-entropy of Q prime = [0.4, 0.3, 0.2, 0.1] under P" @ 480,48 size: 23 color: white
text legend "WORKED EXAMPLE · FOLLOW EACH CHANGE" @ 480,80 size: 13 color: grey
num scene = 1 @ 850,145 prefix: "Scene " size: 16 color: grey
dot cursor @ 100,145 r: 8 color: blue
dot mark0 @ 100,145 r: 3 color: grey
dot mark1 @ 220,145 r: 3 color: grey
dot mark2 @ 340,145 r: 3 color: grey
dot mark3 @ 460,145 r: 3 color: grey
dot mark4 @ 580,145 r: 3 color: grey
dot mark5 @ 700,145 r: 3 color: grey
rect card0 @ 180,255 size: 260x120 color: blue
text key0 "" @ 180,222 size: 16 color: grey
text value0 "" @ 180,267 size: 20 color: white
rect card1 @ 480,255 size: 260x120 color: blue
text key1 "" @ 480,222 size: 16 color: grey
text value1 "" @ 480,267 size: 20 color: white
rect card2 @ 780,255 size: 260x120 color: blue
text key2 "" @ 780,222 size: 16 color: grey
text value2 "" @ 780,267 size: 20 color: white
rect card3 @ 180,405 size: 260x120 color: blue
text key3 "" @ 180,372 size: 16 color: grey
text value3 "" @ 180,417 size: 20 color: white
rect card4 @ 480,405 size: 260x120 color: blue
text key4 "" @ 480,372 size: 16 color: grey
text value4 "" @ 480,417 size: 20 color: white
rect card5 @ 780,405 size: 260x120 color: blue
text key5 "" @ 780,372 size: 16 color: grey
text value5 "" @ 780,417 size: 20 color: white

step: Start with the example's initial values.
  show heading, legend, scene, cursor, mark0, mark1, mark2, mark3, mark4, mark5, card0, key0, value0, card1, key1, value1, card2, key2, value2, card3, key3, value3, card4, key4, value4, card5, key5, value5
  label key0 "P"
  & label value0 "[0.5 0.25 0.125 0.125]"
  & highlight card0
  label key1 "Q prime"
  & label value1 "[0.4 0.3 0.2 0.1]"
  & highlight card1

step: Compute the surprise of each token under Q prime.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 220,145 (0.6s)
  & count scene -> 2 (0.6s)
  label key0 "surprises"
  & label value0 "[1.32 1.74 2.32 3.32]"
  & highlight card0
  label key1 "P"
  & label value1 "[0.5 0.25 0.125 0.125]"
  label key2 "Q prime"
  & label value2 "[0.4 0.3 0.2 0.1]"

step: Weight each surprise by the true probability.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 340,145 (0.6s)
  & count scene -> 3 (0.6s)
  label key0 "term A"
  & label value0 "0.66"
  & highlight card0
  label key1 "surprises"
  & label value1 "[1.32 1.74 2.32 3.32]"
  label key2 "P"
  & label value2 "[0.5 0.25 0.125 0.125]"
  label key3 "Q prime"
  & label value3 "[0.4 0.3 0.2 0.1]"

step: Repeat for B, C, and D.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 460,145 (0.6s)
  & count scene -> 4 (0.6s)
  label key0 "term B"
  & label value0 "0.43"
  & highlight card0
  label key1 "term C"
  & label value1 "0.29"
  & highlight card1
  label key2 "term D"
  & label value2 "0.42"
  & highlight card2
  label key3 "term A"
  & label value3 "0.66"
  label key4 "surprises"
  & label value4 "[1.32 1.74 2.32 3.32]"
  label key5 "P"
  & label value5 "[0.5 0.25 0.125 0.125]"

step: Add the four terms.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 580,145 (0.6s)
  & count scene -> 5 (0.6s)
  label key0 "cross-entropy"
  & label value0 "1.80"
  & highlight card0
  label key1 "term B"
  & label value1 "0.43"
  label key2 "term C"
  & label value2 "0.29"
  label key3 "term D"
  & label value3 "0.42"
  label key4 "term A"
  & label value4 "0.66"
  label key5 "surprises"
  & label value5 "[1.32 1.74 2.32 3.32]"

step: Compare with the entropy of P, 1.75 bits.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 700,145 (0.6s)
  & count scene -> 6 (0.6s)
  label key0 "entropy"
  & label value0 "1.75"
  & highlight card0
  label key1 "gap"
  & label value1 "0.05"
  & highlight card1
  label key2 "cross-entropy"
  & label value2 "1.80"
  label key3 "term B"
  & label value3 "0.43"
  label key4 "term C"
  & label value4 "0.29"
  label key5 "term D"
  & label value5 "0.42"
:::

The entropy of a distribution $P$ is:

$$H(P) = -\\sum_x P(x) \\log P(x)$$

$P(x)$ is the probability of outcome $x$. With $\\log_2$ the unit is bits. With the natural log the unit is nats, and 1 nat is about 1.44 bits. Training code uses nats.

The cross-entropy of $Q$ relative to $P$ is:

$$H(P, Q) = -\\sum_x P(x) \\log Q(x)$$

$Q(x)$ is the model's probability. The true distribution $P$ sets the weights, and the model's $Q$ sets the surprise. Gibbs' inequality states that $H(P, Q) \\ge H(P)$, with equality only when $Q = P$.

In training, $P$ is a one-hot distribution over the true token, with probability 1 on the observed token and 0 elsewhere. The sum collapses to one term:

$$H(P, Q) = -\\log Q(y)$$

$y$ is the observed token. This is the negative log-likelihood from the maximum likelihood lesson. Averaged over all tokens in a dataset, it is the training loss.

To convert a loss into perplexity:

1. Take the average cross-entropy per token in nats, say 2.0.
2. Compute $e^{2.0} \\approx 7.4$.
3. Read the result as the effective number of equally likely choices per token.

A perplexity of 7.4 means the model is as uncertain as a fair 7.4-sided die at each token. A uniform model over 50,000 tokens has perplexity 50,000 and loss $\\ln 50{,}000 \\approx 10.8$ nats.

Note: the entropy of real text is not zero. Several continuations are often valid. That is why a scaling law has an irreducible term.

The program computes the lesson's example.

:::code
lang: python
file: entropy.py
import numpy as np

def entropy_bits(p):
    p = np.array(p)
    return -(p * np.log2(p)).sum()

def cross_entropy_bits(p, q):
    p, q = np.array(p), np.array(q)
    return -(p * np.log2(q)).sum()

P = [0.5, 0.25, 0.125, 0.125]
Q = [0.25, 0.25, 0.25, 0.25]
Q2 = [0.4, 0.3, 0.2, 0.1]
print("H(P) =", entropy_bits(P), "bits")                      # 1.75
print("H(P, Q uniform) =", cross_entropy_bits(P, Q), "bits")  # 2.0
print("H(P, Q prime) =", round(cross_entropy_bits(P, Q2), 3)) # 1.80

# one-hot target: the sum collapses to one term, in nats
q_true = 0.1
print("loss for q = 0.1:", round(-np.log(q_true), 3), "nats")
# loss to perplexity
for loss in [2.0, 3.0, np.log(50_000)]:
    print("loss", round(loss, 2), "nats -> perplexity", round(np.exp(loss), 1))
:::

## Try it

:::exercise
title: Entropy, cross-entropy and perplexity for three tokens
task: The true distribution over three tokens is P = [0.7, 0.2, 0.1]. Compute its entropy in bits. Then compute the cross-entropy of a uniform model Q = [1/3, 1/3, 1/3] under P. Explain why the cross-entropy is larger than the entropy. Finally, a language model reports a loss of 1.5 nats per token; convert it to perplexity. Check your numbers with the functions from the lesson.
hint: The surprise of 0.7 is 0.515 bits, of 0.2 is 2.322 bits, and of 0.1 is 3.322 bits. Every uniform surprise is log2 of 3 = 1.585 bits.
lang: python
solution:
import numpy as np

P = np.array([0.7, 0.2, 0.1])
Q = np.full(3, 1 / 3)
H = -(P * np.log2(P)).sum()
print(round(H, 3))                          # 1.157 bits
H_PQ = -(P * np.log2(Q)).sum()
print(round(H_PQ, 3))                       # 1.585 bits
# the cross-entropy is larger because the uniform model wastes bits
# on tokens that P makes unlikely; only Q = P reaches the floor
print(round(np.exp(1.5), 2))                # perplexity 4.48
:::

## Common mistakes

- Mistake: you mix bits and nats. Fix: pick one base and state it; training losses are in nats.
- Mistake: you put the model distribution in the weights. Fix: the true distribution $P$ weights, and the model $Q$ is inside the log.
- Mistake: you compare perplexities across different tokenisers. Fix: perplexity per token depends on the tokeniser; compare per byte instead.
- Mistake: you expect the loss to reach zero. Fix: the entropy of the data is the floor.

## Check your understanding

Answer each question before you open the explanation.

:::quiz
title: Check: entropy and cross-entropy
q: What is the entropy of a fair coin in bits?
- 0.5
* 1
- 2
why: Each outcome has probability 1/2 and surprise 1 bit, so the average surprise is 1 bit.
q: A model assigns probability 0.1 to the true token. What is its loss on that token in nats?
- 0.1
- 1.0
* About 2.3
- About 3.3
why: The loss is the negative natural log of 0.1, which is 2.303 nats.
q: A loss of 3.0 nats per token corresponds to which perplexity?
- 3
- 8
* About 20
why: Perplexity is e to the power of the loss, and e cubed is about 20.1.
q: Why can cross-entropy never be smaller than entropy?
- Because the model distribution is always uniform
* Because any model other than the true distribution spends extra bits, by Gibbs' inequality
- Because entropy is measured in nats and cross-entropy in bits
why: The true distribution gives the shortest average code, and any other Q adds a non-negative gap.
q: Why does the loss of a language model never reach zero?
- The learning rate is too small
* Real text has entropy: several continuations are often valid
- The tokeniser adds noise
why: The entropy of the data is the floor of the cross-entropy, and natural text is not fully predictable.
:::

## Go further

Colah's visual information theory post explains entropy with pictures of code lengths. The MacKay book covers entropy and coding from the start. The Deep Learning book's probability chapter has the definitions in machine learning notation. The 3Blue1Brown channel has a video on information and entropy.
`,
          links: [
            { label: 'Visual Information Theory (Olah)', url: 'https://colah.github.io/posts/2015-09-Visual-Information/', kind: 'article' },
            { label: 'Information Theory, Inference, and Learning Algorithms (MacKay)', url: 'http://www.inference.org.uk/mackay/itila/', kind: 'article' },
            { label: 'Deep Learning book, chapter 3: Probability and Information Theory', url: 'https://www.deeplearningbook.org/contents/prob.html', kind: 'article' },
            { label: '3Blue1Brown', url: 'https://www.youtube.com/@3blue1brown', kind: 'video' },
          ],
        },
        {
          slug: 'kl-divergence',
          title: 'KL divergence',
          summary: 'KL divergence is the extra cost of using a model distribution instead of the true one, and it is the penalty in RLHF.',
          minutes: 15,
          objectives: [
            'Compute the Kullback-Leibler (KL) divergence between two small distributions.',
            'Show that KL divergence equals cross-entropy minus entropy.',
            'Explain why KL divergence is not symmetric and what each direction penalises.',
            'Describe how a KL penalty keeps a fine-tuned policy near its reference.',
          ],
          keyTerms: ['KL divergence', 'cross-entropy', 'entropy', 'asymmetric', 'reference model', 'RLHF', 'DPO'],
          body: `
## What this lesson covers

This lesson explains the Kullback-Leibler (KL) divergence, a measure of the difference between two distributions. It connects KL divergence to cross-entropy and entropy, shows that it is not symmetric, and explains its role as a penalty in alignment training. You will compute it for two four-token distributions.

## Why it matters

The RLHF objective and the DPO loss both contain a KL term that holds a policy close to a reference model. The number of nats a policy has drifted is the main signal of reward hacking. KL divergence also appears in variational autoencoders, in distillation, and in the definition of mutual information. It is the standard way to say how far one distribution is from another.

## The idea with an example

Use the distributions from the cross-entropy lesson. The true distribution is $P = [0.5, 0.25, 0.125, 0.125]$ with entropy 1.75 bits. The uniform model $Q = [0.25, 0.25, 0.25, 0.25]$ has cross-entropy 2 bits. The KL divergence is the gap:

$$D_{\\mathrm{KL}}(P \\,\\|\\, Q) = H(P, Q) - H(P) = 2 - 1.75 = 0.25 \\text{ bits}$$

Compute it directly to confirm. For each token, take $P(x) \\log_2 (P(x) / Q(x))$:

| Token | $P$ | $Q$ | $P \\log_2(P / Q)$ |
| --- | --- | --- | --- |
| A | 0.5 | 0.25 | 0.5 |
| B | 0.25 | 0.25 | 0 |
| C | 0.125 | 0.25 | -0.125 |
| D | 0.125 | 0.25 | -0.125 |

The sum is $0.25$ bits. Individual terms can be negative, but the total is never negative.

The grid shows P, Q, and the term each token adds to the divergence.

:::matrix
title: Terms of KL(P || Q) in bits
cols: A, B, C, D
P: 0.5, 0.25, 0.125, 0.125
Q: 0.25, 0.25, 0.25, 0.25
P log2(P/Q): 0.5, 0, -0.125, -0.125
:::

Now swap the roles and compute $D_{\\mathrm{KL}}(Q \\,\\|\\, P)$. The terms are $Q(x) \\log_2(Q(x) / P(x))$: $-0.25, 0, 0.25, 0.25$. The sum is $0.25$ bits. In this example the two directions happen to agree. They do not in general. Change $Q$ to $[0.5, 0.5, 0, 0]$. Then $D_{\\mathrm{KL}}(P \\,\\|\\, Q)$ is infinite, because $P$ gives mass to tokens C and D where $Q$ gives none. But $D_{\\mathrm{KL}}(Q \\,\\|\\, P) = 0.5 \\log_2(0.5 / 0.5) + 0.5 \\log_2(0.5 / 0.25) = 0.5$ bits. The direction matters.

Press Next to compute both directions for the second Q.

:::scenario
title: Both directions of KL divergence for Q = [0.5, 0.5, 0, 0]
state: P=[0.5 0.25 0.125 0.125], Q=[0.5 0.5 0 0]
step: Compute KL(P || Q). Token A gives 0.5 times log2(0.5 / 0.5) = 0.
state: term A=0
step: Token B gives 0.25 times log2(0.25 / 0.5) = -0.25.
state: term B=-0.25
step: Tokens C and D have P above zero and Q equal to zero. The ratio is infinite, so KL(P || Q) is infinite.
state: KL(P || Q)=infinite
step: Compute KL(Q || P). Token A gives 0. Token B gives 0.5 times log2(0.5 / 0.25) = 0.5.
state: term A=0, term B=0.5
step: Tokens C and D have Q equal to zero, so they add 0. KL(Q || P) is 0.5 bits.
state: KL(Q || P)=0.5
:::

The bars compare the finite divergences in this lesson.

:::bars
title: KL divergence in bits
unit: bits
KL(P || Q) for uniform Q: 0.25
KL(Q || P) for uniform Q: 0.25
KL(Q || P) for Q = [0.5, 0.5, 0, 0]: 0.5
:::

## How it works


:::anim
title: Both directions of KL divergence for Q = [0.5, 0.5, 0, 0]
# Worked values and narration follow the scenario in this lesson.
text heading "Both directions of KL divergence for Q = [0.5, 0.5, 0, 0]" @ 480,48 size: 23 color: white
text legend "WORKED EXAMPLE · FOLLOW EACH CHANGE" @ 480,80 size: 13 color: grey
num scene = 1 @ 850,145 prefix: "Scene " size: 16 color: grey
dot cursor @ 100,145 r: 8 color: blue
dot mark0 @ 100,145 r: 3 color: grey
dot mark1 @ 220,145 r: 3 color: grey
dot mark2 @ 340,145 r: 3 color: grey
dot mark3 @ 460,145 r: 3 color: grey
dot mark4 @ 580,145 r: 3 color: grey
dot mark5 @ 700,145 r: 3 color: grey
rect card0 @ 180,255 size: 260x120 color: blue
text key0 "" @ 180,222 size: 16 color: grey
text value0 "" @ 180,267 size: 20 color: white
rect card1 @ 480,255 size: 260x120 color: blue
text key1 "" @ 480,222 size: 16 color: grey
text value1 "" @ 480,267 size: 20 color: white
rect card2 @ 780,255 size: 260x120 color: blue
text key2 "" @ 780,222 size: 16 color: grey
text value2 "" @ 780,267 size: 20 color: white
rect card3 @ 180,405 size: 260x120 color: blue
text key3 "" @ 180,372 size: 16 color: grey
text value3 "" @ 180,417 size: 20 color: white
rect card4 @ 480,405 size: 260x120 color: blue
text key4 "" @ 480,372 size: 16 color: grey
text value4 "" @ 480,417 size: 20 color: white
rect card5 @ 780,405 size: 260x120 color: blue
text key5 "" @ 780,372 size: 16 color: grey
text value5 "" @ 780,417 size: 20 color: white

step: Start with the example's initial values.
  show heading, legend, scene, cursor, mark0, mark1, mark2, mark3, mark4, mark5, card0, key0, value0, card1, key1, value1, card2, key2, value2, card3, key3, value3, card4, key4, value4, card5, key5, value5
  label key0 "P"
  & label value0 "[0.5 0.25 0.125 0.125]"
  & highlight card0
  label key1 "Q"
  & label value1 "[0.5 0.5 0 0]"
  & highlight card1

step: Compute KL(P || Q).
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 220,145 (0.6s)
  & count scene -> 2 (0.6s)
  label key0 "term A"
  & label value0 "0"
  & highlight card0
  label key1 "P"
  & label value1 "[0.5 0.25 0.125 0.125]"
  label key2 "Q"
  & label value2 "[0.5 0.5 0 0]"

step: Token B gives 0.25 times log2(0.25 / 0.5) = -0.25.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 340,145 (0.6s)
  & count scene -> 3 (0.6s)
  label key0 "term B"
  & label value0 "-0.25"
  & highlight card0
  label key1 "term A"
  & label value1 "0"
  label key2 "P"
  & label value2 "[0.5 0.25 0.125 0.125]"
  label key3 "Q"
  & label value3 "[0.5 0.5 0 0]"

step: Tokens C and D have P above zero and Q equal to zero.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 460,145 (0.6s)
  & count scene -> 4 (0.6s)
  label key0 "KL(P || Q)"
  & label value0 "infinite"
  & highlight card0
  label key1 "term B"
  & label value1 "-0.25"
  label key2 "term A"
  & label value2 "0"
  label key3 "P"
  & label value3 "[0.5 0.25 0.125 0.125]"
  label key4 "Q"
  & label value4 "[0.5 0.5 0 0]"

step: Compute KL(Q || P).
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 580,145 (0.6s)
  & count scene -> 5 (0.6s)
  label key0 "term A"
  & label value0 "0"
  label key1 "term B"
  & label value1 "0.5"
  & highlight card1
  label key2 "KL(P || Q)"
  & label value2 "infinite"
  label key3 "P"
  & label value3 "[0.5 0.25 0.125 0.125]"
  label key4 "Q"
  & label value4 "[0.5 0.5 0 0]"

step: Tokens C and D have Q equal to zero, so they add 0.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 700,145 (0.6s)
  & count scene -> 6 (0.6s)
  label key0 "KL(Q || P)"
  & label value0 "0.5"
  & highlight card0
  label key1 "term A"
  & label value1 "0"
  label key2 "term B"
  & label value2 "0.5"
  label key3 "KL(P || Q)"
  & label value3 "infinite"
  label key4 "P"
  & label value4 "[0.5 0.25 0.125 0.125]"
  label key5 "Q"
  & label value5 "[0.5 0.5 0 0]"
:::

The definition is:

$$D_{\\mathrm{KL}}(P \\,\\|\\, Q) = \\sum_x P(x) \\log \\frac{P(x)}{Q(x)}$$

$P$ is the distribution that sets the weights. $Q$ is the distribution under test. The ratio inside the log compares the two at each outcome. The divergence is zero only when $P = Q$ everywhere, and it is never negative.

The decomposition is:

$$D_{\\mathrm{KL}}(P \\,\\|\\, Q) = H(P, Q) - H(P)$$

Minimising cross-entropy over $Q$ is the same as minimising KL divergence, because $H(P)$ does not depend on $Q$. That is why training with cross-entropy moves the model toward the data distribution.

The two directions penalise different things:

- $D_{\\mathrm{KL}}(P \\,\\|\\, Q)$ is infinite if $Q$ gives zero mass where $P$ has mass. Minimising it makes $Q$ cover everything $P$ covers.
- $D_{\\mathrm{KL}}(Q \\,\\|\\, P)$ is infinite if $Q$ gives mass where $P$ has none. Minimising it makes $Q$ stay inside the support of $P$.

In RLHF the penalty is $D_{\\mathrm{KL}}(\\pi \\,\\|\\, \\pi_{\\text{ref}})$, the second kind. The policy $\\pi$ sets the weights, so the penalty counts answers the policy produces and the reference finds unlikely. The policy cannot invent new behaviour that the reference would never produce without paying for it.

To estimate the KL penalty during training:

1. Sample an answer from the policy.
2. For each token, compute $\\log \\pi(t) - \\log \\pi_{\\text{ref}}(t)$.
3. Sum over the tokens of the answer.
4. Average over many sampled answers.

The diagram shows how the penalty is estimated during training.

:::flow
title: Estimate the KL penalty for one answer
Prompt -> Policy: sample an answer
Policy -> Log-prob difference: log pi(t) per token
Prompt -> Reference: score the same answer
Reference -> Log-prob difference: log pi ref(t) per token
Log-prob difference -> Sum over tokens: one number per answer
Sum over tokens -> KL estimate: average over answers
:::

Note: the penalty is reported in nats. A drift of 10 nats means the policy's answers are on average $e^{10}$ times more likely under the policy than under the reference.

The program computes the lesson's example.

:::code
lang: python
file: kl.py
import numpy as np

def kl_bits(p, q):
    total = 0.0
    for pi, qi in zip(p, q):
        if pi == 0:
            continue                  # 0 log 0 counts as 0
        if qi == 0:
            return float("inf")       # P has mass where Q has none
        total += pi * np.log2(pi / qi)
    return total

P = [0.5, 0.25, 0.125, 0.125]
Q = [0.25, 0.25, 0.25, 0.25]
print("KL(P || Q) =", kl_bits(P, Q), "bits")        # 0.25
print("KL(Q || P) =", kl_bits(Q, P), "bits")        # 0.25

Q2 = [0.5, 0.5, 0.0, 0.0]
print("KL(P || Q2) =", kl_bits(P, Q2))              # inf
print("KL(Q2 || P) =", kl_bits(Q2, P), "bits")      # 0.5

# cross-entropy minus entropy gives the same number
H = -(np.array(P) * np.log2(P)).sum()
H_PQ = -(np.array(P) * np.log2(Q)).sum()
print("H(P, Q) - H(P) =", H_PQ - H)                 # 0.25
:::

## Try it

:::exercise
title: Both directions for a new pair of distributions
task: Take P = [0.7, 0.2, 0.1] and Q = [0.5, 0.3, 0.2]. Compute KL(P || Q) and KL(Q || P) in bits by hand, term by term. Say whether the two numbers are equal. Then change Q to [0.7, 0.3, 0] and state which direction becomes infinite and why. Check with the kl_bits function from the lesson.
hint: log2(1.4) is 0.485, log2(2/3) is -0.585, log2(0.5) is -1, log2(1.5) is 0.585.
lang: python
solution:
import numpy as np

def kl_bits(p, q):
    total = 0.0
    for pi, qi in zip(p, q):
        if pi == 0:
            continue
        if qi == 0:
            return float("inf")
        total += pi * np.log2(pi / qi)
    return total

P = [0.7, 0.2, 0.1]
Q = [0.5, 0.3, 0.2]
# KL(P || Q): 0.7 * 0.485 + 0.2 * (-0.585) + 0.1 * (-1) = 0.340 - 0.117 - 0.100 = 0.123
# KL(Q || P): 0.5 * (-0.485) + 0.3 * 0.585 + 0.2 * 1 = -0.243 + 0.176 + 0.200 = 0.133
print(round(kl_bits(P, Q), 3), round(kl_bits(Q, P), 3))   # not equal
Q2 = [0.7, 0.3, 0.0]
print(kl_bits(P, Q2), round(kl_bits(Q2, P), 3))
# KL(P || Q2) is infinite: P gives mass to the third token and Q2 gives none
:::

## Common mistakes

- Mistake: you treat KL divergence as a distance and assume symmetry. Fix: check which distribution sets the weights.
- Mistake: you compute $\\log(P / Q)$ where $Q = 0$. Fix: add a small floor to $Q$, or use the other direction.
- Mistake: you report cross-entropy and call it KL divergence. Fix: subtract the entropy of the data.
- Mistake: you sample from the reference to estimate the RLHF penalty. Fix: sample from the policy, because the policy sets the weights.

## Check your understanding

Answer each question before you open the explanation.

:::quiz
title: Check: KL divergence
q: What is KL(P || P)?
* Zero
- One bit
- The entropy of P
why: Every ratio P(x) / P(x) is 1, and log 1 is 0.
q: Cross-entropy is 2.4 nats and entropy is 2.1 nats. What is the KL divergence?
- 4.5 nats
- 2.4 nats
* 0.3 nats
why: KL divergence equals cross-entropy minus entropy: 2.4 - 2.1 = 0.3.
q: P = [0.5, 0.5] and Q = [1, 0]. Which statement is true?
- Both directions are finite
* KL(P || Q) is infinite and KL(Q || P) is 1 bit
- KL(Q || P) is infinite and KL(P || Q) is 1 bit
why: P has mass on the second outcome where Q has none, so KL(P || Q) diverges; KL(Q || P) is 1 times log2(1 / 0.5) = 1 bit.
q: Which direction of KL divergence stops an RLHF policy from inventing behaviour the reference never shows?
- KL(reference || policy)
* KL(policy || reference)
- Either direction, they are the same
why: With the policy setting the weights, any answer the policy produces and the reference finds unlikely adds a large penalty.
q: Why does minimising cross-entropy over Q move the model toward the data distribution?
- Because cross-entropy is symmetric
* Because cross-entropy equals KL divergence plus the fixed entropy of the data
- Because the entropy of the data goes to zero
why: H(P) does not depend on Q, so the only part that changes is the KL divergence, which is zero only at Q = P.
:::

## Go further

Colah's visual information theory post builds up to KL divergence with pictures. The DPO paper uses the KL penalty throughout its derivation. The MacKay book has the formal properties and proofs. The Deep Learning book's probability chapter has the definition with the asymmetry illustrated.
`,
          links: [
            { label: 'Visual Information Theory (Olah)', url: 'https://colah.github.io/posts/2015-09-Visual-Information/', kind: 'article' },
            { label: 'Direct Preference Optimization (Rafailov et al., 2023)', url: 'https://arxiv.org/abs/2305.18290', kind: 'paper' },
            { label: 'Information Theory, Inference, and Learning Algorithms (MacKay)', url: 'http://www.inference.org.uk/mackay/itila/', kind: 'article' },
            { label: 'Deep Learning book, chapter 3: Probability and Information Theory', url: 'https://www.deeplearningbook.org/contents/prob.html', kind: 'article' },
          ],
        },
      ],
    },
    {
      slug: 'optimisation',
      title: 'Optimisation',
      description: 'Gradient descent, the learning rate, momentum, Adam, and the convexity that decides whether a minimum is the minimum.',
      level: 'intermediate',
      lessons: [
        {
          slug: 'gradient-descent',
          title: 'Gradient descent',
          summary: 'Gradient descent moves the weights a small step against the gradient, and repeats until the loss stops falling.',
          minutes: 15,
          objectives: [
            'Run three steps of gradient descent by hand on a one-variable loss.',
            'Explain why the step goes against the gradient.',
            'Distinguish full-batch, mini-batch, and stochastic gradient descent.',
            'Read a loss curve and identify divergence, a plateau, and convergence.',
          ],
          keyTerms: ['gradient descent', 'learning rate', 'stochastic gradient descent', 'mini-batch', 'loss curve', 'convergence', 'step'],
          body: `
## What this lesson covers

This lesson explains gradient descent, the algorithm that trains almost every model. It takes a step against the gradient, measures the loss again, and repeats. You will run three steps by hand on a simple loss and see what happens with a step that is too large.

## Why it matters

Every training run is a loop of gradient descent steps. The learning rate, the batch size, and the schedule are the hyperparameters that a researcher tunes most often. A loss curve is the main diagnostic of a run. This lesson gives the mental model that makes a loss curve readable.

:::video
id: sDv4f4s2SB8
why: Watch the whole video, 23 minutes. It runs gradient descent on a one-parameter loss with the same step rule as this lesson, and shows how the step shrinks as the slope shrinks.
:::

## The idea with an example

Take the loss $L(w) = (w - 3)^2$. The minimum is at $w = 3$. The derivative is $L'(w) = 2(w - 3)$. Start at $w = 0$ with learning rate $\\eta = 0.25$.

Each step computes $w \\leftarrow w - \\eta L'(w)$:

| Step | $w$ | $L'(w)$ | New $w$ | Loss |
| --- | --- | --- | --- | --- |
| 1 | 0 | -6 | 1.5 | 2.25 |
| 2 | 1.5 | -3 | 2.25 | 0.5625 |
| 3 | 2.25 | -1.5 | 2.625 | 0.1406 |

The gradient is negative, so the step moves $w$ to the right, toward 3. Each step halves the distance to the minimum. The loss falls by a factor of 4 each step.

Press Next to run the three steps with the state panel.

:::scenario
title: Gradient descent on L(w) = (w - 3)^2 with learning rate 0.25
state: w=0, gradient=-6, loss=9
step: Start at w = 0. The gradient is 2(0 - 3) = -6 and the loss is 9.
step: Subtract 0.25 times -6. The new w is 1.5 and the loss is 2.25.
state: w=1.5, gradient=-3, loss=2.25
step: Subtract 0.25 times -3. The new w is 2.25 and the loss is 0.5625.
state: w=2.25, gradient=-1.5, loss=0.5625
step: Subtract 0.25 times -1.5. The new w is 2.625 and the loss is 0.1406.
state: w=2.625, gradient=-0.75, loss=0.1406
step: Each step halves the distance to 3 and divides the loss by 4.
:::

The bars compare the loss after each step.

:::bars
title: Loss per step with learning rate 0.25
Start: 9
Step 1: 2.25
Step 2: 0.5625
Step 3: 0.1406
:::

Now try $\\eta = 1.25$. From $w = 0$, the first step gives $w = 0 + 1.25 \\times 6 = 7.5$. The distance to the minimum grew from 3 to 4.5. The second step gives $w = 7.5 - 1.25 \\times 9 = -3.75$. The weights swing wider each step and the loss grows. The run has diverged. For this loss, any $\\eta$ above 1 diverges, and $\\eta = 0.5$ reaches the minimum in one step.

The bars compare the loss after one step for three learning rates.

:::bars
title: Loss after one step from w = 0
Learning rate 0.25: 2.25
Learning rate 0.5: 0
Learning rate 1.25: 20.25 (diverges)
:::

## How it works


:::anim
title: Gradient descent on L(w) = (w - 3)^2 with learning rate 0.25
# Worked values and narration follow the scenario in this lesson.
text heading "Gradient descent on L(w) = (w - 3)^2 with learning rate 0.25" @ 480,48 size: 23 color: white
text legend "WORKED EXAMPLE · FOLLOW EACH CHANGE" @ 480,80 size: 13 color: grey
num scene = 1 @ 850,145 prefix: "Scene " size: 16 color: grey
dot cursor @ 100,145 r: 8 color: blue
dot mark0 @ 100,145 r: 3 color: grey
dot mark1 @ 220,145 r: 3 color: grey
dot mark2 @ 340,145 r: 3 color: grey
dot mark3 @ 460,145 r: 3 color: grey
dot mark4 @ 580,145 r: 3 color: grey
dot mark5 @ 700,145 r: 3 color: grey
rect card0 @ 180,260 size: 260x120 color: blue
text key0 "" @ 180,227 size: 16 color: grey
text value0 "" @ 180,272 size: 20 color: white
rect card1 @ 480,260 size: 260x120 color: blue
text key1 "" @ 480,227 size: 16 color: grey
text value1 "" @ 480,272 size: 20 color: white
rect card2 @ 780,260 size: 260x120 color: blue
text key2 "" @ 780,227 size: 16 color: grey
text value2 "" @ 780,272 size: 20 color: white

step: Start with the example's initial values.
  show heading, legend, scene, cursor, mark0, mark1, mark2, mark3, mark4, mark5, card0, key0, value0, card1, key1, value1, card2, key2, value2
  label key0 "w"
  & label value0 "0"
  & highlight card0
  label key1 "gradient"
  & label value1 "-6"
  & highlight card1
  label key2 "loss"
  & label value2 "9"
  & highlight card2

step: Start at w = 0.
  restore card0, card1, card2
  move cursor -> 220,145 (0.6s)
  & count scene -> 2 (0.6s)
  label key0 "w"
  & label value0 "0"
  label key1 "gradient"
  & label value1 "-6"
  label key2 "loss"
  & label value2 "9"

step: Subtract 0.25 times -6.
  restore card0, card1, card2
  move cursor -> 340,145 (0.6s)
  & count scene -> 3 (0.6s)
  label key0 "w"
  & label value0 "1.5"
  & highlight card0
  label key1 "gradient"
  & label value1 "-3"
  & highlight card1
  label key2 "loss"
  & label value2 "2.25"
  & highlight card2

step: Subtract 0.25 times -3.
  restore card0, card1, card2
  move cursor -> 460,145 (0.6s)
  & count scene -> 4 (0.6s)
  label key0 "w"
  & label value0 "2.25"
  & highlight card0
  label key1 "gradient"
  & label value1 "-1.5"
  & highlight card1
  label key2 "loss"
  & label value2 "0.5625"
  & highlight card2

step: Subtract 0.25 times -1.5.
  restore card0, card1, card2
  move cursor -> 580,145 (0.6s)
  & count scene -> 5 (0.6s)
  label key0 "w"
  & label value0 "2.625"
  & highlight card0
  label key1 "gradient"
  & label value1 "-0.75"
  & highlight card1
  label key2 "loss"
  & label value2 "0.1406"
  & highlight card2

step: Each step halves the distance to 3 and divides the loss by 4.
  restore card0, card1, card2
  move cursor -> 700,145 (0.6s)
  & count scene -> 6 (0.6s)
  label key0 "w"
  & label value0 "2.625"
  label key1 "gradient"
  & label value1 "-0.75"
  label key2 "loss"
  & label value2 "0.1406"
:::

The update is:

$$w_{t+1} = w_t - \\eta\\, \\nabla L(w_t)$$

$w_t$ is the weight vector at step $t$. $\\eta$ is the learning rate. $\\nabla L(w_t)$ is the gradient of the loss. The gradient points uphill, so the negative sign moves downhill. The linear approximation predicts a loss change of $-\\eta \\| \\nabla L \\|^2$, which is never positive for a small enough step.

To run gradient descent by hand:

1. Choose a starting point $w_0$ and a learning rate $\\eta$.
2. Compute the gradient at the current point.
3. Subtract $\\eta$ times the gradient from the weights.
4. Compute the loss at the new point.
5. If the loss rose, reduce $\\eta$ and repeat the step.
6. Stop when the loss changes by less than a chosen tolerance.

The diagram shows one loop of gradient descent.

:::flow
title: One step of the training loop
Weights w -> Loss L(w): forward pass
Loss L(w) -> Gradient: differentiate
Gradient -> Step: multiply by minus eta
Step -> Weights w: subtract the step
:::

The gradient over a full dataset of millions of examples is expensive. Three variants trade accuracy for cost:

- Full-batch: use every example per step. Exact gradient, slow steps.
- Mini-batch: use a random subset, often 32 to several thousand examples. Noisy gradient, fast steps.
- Stochastic: use one example per step. Very noisy, very fast.

Mini-batch is the standard. The noise is a sample mean with variance proportional to $1 / B$, where $B$ is the batch size. A larger batch allows a larger learning rate.

Reading a loss curve:

- A curve that rises or shows spikes means the learning rate is too high.
- A flat curve from the start means the learning rate is too low, or the gradient is zero because of a bug.
- A curve that falls, then flattens at a high value, is a plateau. A warm restart or a schedule change may help.
- A smooth fall that levels off at a low value is convergence.

Caution: a loss that goes to zero on the training set while the validation loss rises is overfitting, not success.

The program computes the lesson's example.

:::code
lang: python
file: gradient_descent.py
def loss(w):
    return (w - 3) ** 2

def grad(w):
    return 2 * (w - 3)

def run(eta, steps=3, w=0.0):
    print("learning rate", eta)
    for t in range(1, steps + 1):
        g = grad(w)
        w = w - eta * g
        print("  step", t, "w =", round(w, 4), "loss =", round(loss(w), 4))
    return w

run(0.25)      # halves the distance each step
run(0.5)       # reaches w = 3 in one step
run(1.25)      # diverges: the loss grows every step
:::

## Try it

:::exercise
title: Gradient descent on a steeper bowl
task: Take the loss L(w) = 2 (w - 3) squared, whose derivative is 4 (w - 3). Start at w = 0 with learning rate 0.1 and run three steps by hand, writing the gradient, the new w, and the loss at each step. Then find the learning rate that reaches w = 3 in exactly one step, and the smallest learning rate at which the run no longer converges. Check with the run function from the lesson.
hint: Each step multiplies the distance to 3 by (1 - 4 eta). One step lands on 3 when that factor is 0. The run stops converging when the factor reaches -1.
lang: python
solution:
def loss(w):
    return 2 * (w - 3) ** 2

def grad(w):
    return 4 * (w - 3)

def run(eta, steps=3, w=0.0):
    for t in range(1, steps + 1):
        g = grad(w)
        w = w - eta * g
        print(eta, t, round(w, 4), round(loss(w), 4))
    return w

run(0.1)     # w: 1.2, 1.92, 2.352; loss: 6.48, 2.333, 0.84
run(0.25)    # factor 1 - 4 * 0.25 = 0: lands on 3 in one step
run(0.5)     # factor -1: w swings between 0 and 6 forever
# any learning rate of 0.5 or more fails to converge
:::

## Common mistakes

- Mistake: you step along the gradient. Fix: subtract the gradient; it points uphill.
- Mistake: you keep a learning rate that made the loss spike. Fix: reduce it by a factor of 3 to 10.
- Mistake: you evaluate the loss on the same batch you just stepped on. Fix: use a held-out batch for the diagnostic.
- Mistake: you use batch size 1 on a GPU. Fix: a mini-batch uses the hardware and reduces noise.

## Check your understanding

Answer each question before you open the explanation.

:::quiz
title: Check: gradient descent
q: For L(w) = (w - 3) squared and learning rate 0.5, where does one step from w = 0 land?
- At w = 1.5
* At w = 3
- At w = 6
- At w = -3
why: The gradient at 0 is -6, and 0 minus 0.5 times -6 is 3.
q: Why does the update subtract the gradient?
- Because the gradient is always negative
* Because the gradient points uphill and the step must go downhill
- Because subtraction keeps the weights small
why: The gradient is the direction of steepest rise, so moving against it lowers the loss for a small step.
q: A loss curve shows sharp spikes and then rises. What is the most likely cause?
- The batch size is too large
* The learning rate is too high
- The model has too few weights
why: Steps that overshoot the minimum make the loss jump, and repeated overshoots make it grow.
q: You double the batch size. What happens to the noise in the gradient?
- The standard deviation halves
* The variance halves and the standard deviation falls by the square root of 2
- Nothing; noise depends only on the learning rate
why: A batch gradient is a sample mean, and its variance is proportional to 1 over the batch size.
q: The training loss reaches almost zero while the validation loss rises. What is happening?
- The run has converged successfully
* The model is overfitting the training set
- The learning rate is too low
why: A loss that falls only on the data the model was fitted to is memorisation, not generalisation.
:::

## Go further

The CS231n notes on optimisation cover gradient descent with figures. Ruder's overview compares the variants. The 3Blue1Brown channel has a visual episode on gradient descent for networks. The PyTorch optim documentation lists the optimisers and their arguments.
`,
          links: [
            { label: 'CS231n: Optimization', url: 'https://cs231n.github.io/optimization-1/', kind: 'course' },
            { label: 'An overview of gradient descent optimization algorithms (Ruder, 2016)', url: 'https://arxiv.org/abs/1609.04747', kind: 'paper' },
            { label: '3Blue1Brown', url: 'https://www.youtube.com/@3blue1brown', kind: 'video' },
            { label: 'PyTorch torch.optim documentation', url: 'https://pytorch.org/docs/stable/optim.html', kind: 'docs' },
          ],
        },
        {
          slug: 'learning-rate',
          title: 'The learning rate and its schedule',
          summary: 'The learning rate sets the step size, curvature sets its upper limit, and a schedule changes it over the run.',
          minutes: 15,
          objectives: [
            'Compute the largest stable learning rate for a quadratic loss from its curvature.',
            'Describe warmup, cosine decay, and the warmup-stable-decay schedule.',
            'Run a learning rate range test and read its result.',
            'Explain why the learning rate must decay to reach a low loss with a noisy gradient.',
          ],
          keyTerms: ['learning rate', 'curvature', 'warmup', 'cosine decay', 'schedule', 'range test', 'Hessian'],
          body: `
## What this lesson covers

This lesson explains how to choose a learning rate and how to change it during a run. It connects the stable step size to the curvature of the loss, then covers warmup, decay, and the range test. You will compute a stability limit and sketch a schedule.

## Why it matters

The learning rate is the most important hyperparameter. A rate that is twice too large diverges. A rate that is ten times too small wastes the compute budget. The schedule decides the final loss: the Chinchilla result that corrected Kaplan was a schedule difference. Every scaling law experiment and every fine-tuning run starts with this choice.

## The idea with an example

Take a loss with two weights: $L(w_1, w_2) = 50 w_1^2 + w_2^2$. The loss is a long narrow valley. The curvature along $w_1$ is 100, and along $w_2$ it is 2. These are the second derivatives.

Gradient descent on a quadratic with curvature $c$ is stable only if $\\eta < 2 / c$. Along $w_1$ the limit is $2 / 100 = 0.02$. Along $w_2$ the limit is $2 / 2 = 1$. The learning rate must satisfy the stricter limit, so $\\eta < 0.02$.

Now watch the slow direction. With $\\eta = 0.019$, each step along $w_2$ multiplies the distance to the minimum by $1 - 0.019 \\times 2 = 0.962$. To shrink that distance by a factor of 1,000 takes about 180 steps. Along $w_1$ the same rate reaches the minimum in a few steps. The ratio of the two curvatures, 50, is the condition number. A large condition number forces a small rate and a slow run. Momentum and Adam, in the next lesson, attack this problem.

Press Next to follow both directions step by step.

:::scenario
title: Gradient descent on the valley with learning rate 0.019
state: w1=1, w2=10
step: Start at w1 = 1 and w2 = 10. The gradient along w1 is 100 w1 = 100. Along w2 it is 2 w2 = 20.
step: Take one step. w1 becomes 1 - 0.019 times 100 = -0.9. w2 becomes 10 - 0.019 times 20 = 9.62.
state: w1=-0.9, w2=9.62
step: Take a second step. w1 flips to 0.81 and w2 falls to 9.25. The fast direction bounces, and the slow direction crawls.
state: w1=0.81, w2=9.25
step: After 50 steps the w1 distance is 0.9 to the power 50, about 0.005. The w2 distance is 10 times 0.962 to the power 50, about 1.44.
state: w1=0.005, w2=1.44
step: After 180 steps the w2 distance is about 0.01. The slow direction sets the length of the run.
state: w2=0.01
:::

The bars compare the number of steps each direction needs to shrink its distance by 1,000.

:::bars
title: Steps to shrink the distance to the minimum by 1,000
unit: steps
Along w1 (curvature 100): 66
Along w2 (curvature 2): 180
:::

Noise adds a second limit. With a mini-batch gradient, the step has a random part of size $\\eta$ times the gradient noise. At a fixed rate the weights jitter around the minimum and the loss stops falling. Decay the rate and the jitter shrinks.

## How it works


:::anim
title: Gradient descent on the valley with learning rate 0.019
# Worked values and narration follow the scenario in this lesson.
text heading "Gradient descent on the valley with learning rate 0.019" @ 480,48 size: 23 color: white
text legend "WORKED EXAMPLE · FOLLOW EACH CHANGE" @ 480,80 size: 13 color: grey
num scene = 1 @ 850,145 prefix: "Scene " size: 16 color: grey
dot cursor @ 100,145 r: 8 color: blue
dot mark0 @ 100,145 r: 3 color: grey
dot mark1 @ 220,145 r: 3 color: grey
dot mark2 @ 340,145 r: 3 color: grey
dot mark3 @ 460,145 r: 3 color: grey
dot mark4 @ 580,145 r: 3 color: grey
dot mark5 @ 700,145 r: 3 color: grey
rect card0 @ 180,260 size: 260x120 color: blue
text key0 "" @ 180,227 size: 16 color: grey
text value0 "" @ 180,272 size: 20 color: white
rect card1 @ 480,260 size: 260x120 color: blue
text key1 "" @ 480,227 size: 16 color: grey
text value1 "" @ 480,272 size: 20 color: white

step: Start with the example's initial values.
  show heading, legend, scene, cursor, mark0, mark1, mark2, mark3, mark4, mark5, card0, key0, value0, card1, key1, value1
  label key0 "w1"
  & label value0 "1"
  & highlight card0
  label key1 "w2"
  & label value1 "10"
  & highlight card1

step: Start at w1 = 1 and w2 = 10.
  restore card0, card1
  move cursor -> 220,145 (0.6s)
  & count scene -> 2 (0.6s)
  label key0 "w1"
  & label value0 "1"
  label key1 "w2"
  & label value1 "10"

step: Take one step.
  restore card0, card1
  move cursor -> 340,145 (0.6s)
  & count scene -> 3 (0.6s)
  label key0 "w1"
  & label value0 "-0.9"
  & highlight card0
  label key1 "w2"
  & label value1 "9.62"
  & highlight card1

step: Take a second step.
  restore card0, card1
  move cursor -> 460,145 (0.6s)
  & count scene -> 4 (0.6s)
  label key0 "w1"
  & label value0 "0.81"
  & highlight card0
  label key1 "w2"
  & label value1 "9.25"
  & highlight card1

step: After 50 steps the w1 distance is 0.9 to the power 50, about 0.005.
  restore card0, card1
  move cursor -> 580,145 (0.6s)
  & count scene -> 5 (0.6s)
  label key0 "w1"
  & label value0 "0.005"
  & highlight card0
  label key1 "w2"
  & label value1 "1.44"
  & highlight card1

step: After 180 steps the w2 distance is about 0.01.
  restore card0, card1
  move cursor -> 700,145 (0.6s)
  & count scene -> 6 (0.6s)
  label key0 "w2"
  & label value0 "0.01"
  & highlight card0
  label key1 "w1"
  & label value1 "0.005"
:::

For a quadratic loss with Hessian $H$, the stability condition is:

$$\\eta < \\frac{2}{\\lambda_{\\max}(H)}$$

$\\lambda_{\\max}(H)$ is the largest eigenvalue of the Hessian, the curvature in the sharpest direction. Deep networks are not quadratic, but the condition holds locally, and training tends to settle at a sharpness where $\\lambda_{\\max} \\approx 2 / \\eta$.

A standard schedule has three parts:

1. Warmup: raise the rate linearly from near zero to the peak over the first 1 to 5 percent of steps. Early gradients are large and the Adam statistics are unreliable, and warmup prevents an early divergence.
2. Stable or cosine phase: hold the peak, or follow a cosine curve from the peak toward a small final value.
3. Decay: reduce the rate to about 10 percent of the peak, or to zero, over the last part of the run. The decay removes the gradient noise and gives the final drop in loss.

The table lists the three phases with their share of the run.

| Phase | Share of the run | Learning rate |
| --- | --- | --- |
| Warmup | first 1 to 5 percent | rises from near 0 to the peak |
| Stable or cosine | middle | the peak, or a cosine curve from the peak |
| Decay | last part | falls to 10 percent of the peak or to 0 |

The diagram shows the three phases of a schedule over a run of 1,000 steps.

:::timeline
title: Warmup, stable, decay over 1,000 steps
unit: steps
lane Rate
lane Loss
Rate: warmup to the peak @0-50
Rate: hold the peak @50-800
Rate: decay to 10 percent @800-1000
Loss: falls fast @0-300
Loss: jitters at the noise floor @300-800
Loss: final drop @800-1000
:::

The cosine schedule after warmup is:

$$\\eta_t = \\eta_{\\min} + \\tfrac{1}{2}(\\eta_{\\max} - \\eta_{\\min})\\left(1 + \\cos\\frac{\\pi t}{T}\\right)$$

$t$ is the current step. $T$ is the total number of steps after warmup. $\\eta_{\\max}$ is the peak rate and $\\eta_{\\min}$ is the final rate. The warmup-stable-decay schedule replaces the cosine with a flat phase and a short sharp decay, which lets one run serve several budgets.

To run a range test:

1. Start a short run with a tiny learning rate, such as $10^{-7}$.
2. Multiply the rate by a constant every step so it grows exponentially.
3. Record the loss at each rate.
4. Plot loss against rate on a log axis. The loss falls, flattens, then rises sharply.
5. Pick the peak rate one order of magnitude below the point where the loss rises.

Note: the best peak rate shrinks as the model grows. Rules such as muP scale the rate with width so that a rate tuned on a small model transfers to a large one.

The program computes the lesson's example.

:::code
lang: python
file: learning_rate.py
import math

# the valley L = 50 w1^2 + w2^2: curvatures 100 and 2, limit 2 / 100 = 0.02
def run(eta, steps):
    w1, w2 = 1.0, 10.0
    for _ in range(steps):
        w1 -= eta * 100 * w1
        w2 -= eta * 2 * w2
    return w1, w2

for eta in [0.019, 0.021]:
    w1, w2 = run(eta, 50)
    print("eta", eta, "after 50 steps: w1 =", round(w1, 4), "w2 =", round(w2, 3))

# steps for the slow direction to shrink by 1,000 at eta = 0.019
factor = 1 - 0.019 * 2
print("steps along w2:", math.ceil(math.log(1 / 1000) / math.log(factor)))

# a warmup then cosine schedule over 1,000 steps
def schedule(t, total=1000, warmup=50, peak=0.02, final=0.002):
    if t < warmup:
        return peak * t / warmup
    progress = (t - warmup) / (total - warmup)
    return final + 0.5 * (peak - final) * (1 + math.cos(math.pi * progress))

for t in [0, 25, 50, 300, 525, 800, 1000]:
    print("step", t, "rate", round(schedule(t), 5))
:::

## Try it

:::exercise
title: Stability limit and condition number of a new valley
task: Take the loss L = 20 w1 squared + 2 w2 squared. Write the curvature along each weight, the largest stable learning rate, and the condition number. With learning rate 0.045, compute the factor by which each distance to the minimum changes per step, and estimate the number of steps the slow direction needs to shrink by 1,000. Then check with the run function from the lesson, adapted to the new curvatures.
hint: The curvatures are the second derivatives: 40 and 4. The per-step factor along a direction with curvature c is 1 minus eta times c, and a negative factor means the weight flips sign each step.
lang: python
solution:
import math

# curvatures 40 and 4, limit eta < 2 / 40 = 0.05, condition number 10
eta = 0.045
fast = 1 - eta * 40        # -0.8: flips sign, shrinks by 0.8 each step
slow = 1 - eta * 4         # 0.82: shrinks by 0.82 each step
print(round(fast, 2), round(slow, 2))
print(math.ceil(math.log(1 / 1000) / math.log(slow)))   # about 35 steps

def run(eta, steps):
    w1, w2 = 1.0, 10.0
    for _ in range(steps):
        w1 -= eta * 40 * w1
        w2 -= eta * 4 * w2
    return w1, w2

print(run(0.045, 35))      # both distances are small
print(run(0.055, 35))      # w1 has blown up: above the limit
:::

## Common mistakes

- Mistake: you skip warmup for a large model. Fix: use at least a few hundred warmup steps.
- Mistake: you end a run at the peak rate. Fix: decay the rate; the last drop in loss comes from decay.
- Mistake: you compare two runs with different schedules and credit the architecture. Fix: match the schedule to the run length for both.
- Mistake: you reuse the rate from a small model on a model ten times wider. Fix: run a range test again, or use a width-aware rule.

## Check your understanding

Answer each question before you open the explanation.

:::quiz
title: Check: the learning rate
q: A loss has largest curvature 400. What is the largest stable learning rate?
- 0.05
- 0.02
* Below 0.005
- Below 0.0025
why: The stability limit is 2 divided by the largest curvature, which is 2 / 400 = 0.005.
q: Why does the loss stop falling at a fixed learning rate with mini-batches?
- The gradient becomes exactly zero
* The gradient noise makes the weights jitter at a size set by the rate
- The model has run out of capacity
why: Each step has a random part proportional to the rate, so the weights wander near the minimum until the rate decays.
q: What does warmup protect against?
- Overfitting late in the run
* Divergence from large early gradients and unreliable optimiser statistics
- A plateau in the middle of the run
why: The first steps see large gradients and poorly estimated Adam averages, and a small rate keeps them from blowing up.
q: A valley has curvatures 100 and 2. With the largest stable rate, which direction decides the length of the run?
- The direction with curvature 100
* The direction with curvature 2
- Both take the same number of steps
why: The rate is capped by the sharp direction, so the flat direction shrinks by only a few percent per step.
q: In a learning rate range test, where do you pick the peak rate?
- At the rate where the loss is lowest
* About one order of magnitude below the rate where the loss starts to rise sharply
- At the largest rate tested
why: The lowest point of the curve is already close to divergence; backing off gives a safe margin.
:::

## Go further

The cyclical learning rates paper introduced the range test. The SGDR paper introduced cosine decay with restarts. The deep learning tuning playbook gives a practical procedure for choosing the rate and schedule. The CS231n notes cover schedules in context.
`,
          links: [
            { label: 'Cyclical Learning Rates for Training Neural Networks (Smith, 2015)', url: 'https://arxiv.org/abs/1506.01186', kind: 'paper' },
            { label: 'SGDR: Stochastic Gradient Descent with Warm Restarts (Loshchilov and Hutter, 2016)', url: 'https://arxiv.org/abs/1608.03983', kind: 'paper' },
            { label: 'Deep Learning Tuning Playbook', url: 'https://github.com/google-research/tuning_playbook', kind: 'repo' },
            { label: 'CS231n: Neural Networks Part 3', url: 'https://cs231n.github.io/neural-networks-3/', kind: 'course' },
          ],
        },
        {
          slug: 'momentum-and-adam',
          title: 'Momentum and Adam',
          summary: 'Momentum averages past gradients to cross narrow valleys, and Adam also rescales each weight by its own gradient size.',
          minutes: 17,
          objectives: [
            'Run two steps of momentum by hand and compare with plain gradient descent.',
            'Write the Adam update and explain each of its two running averages.',
            'Explain the bias correction in the first steps of Adam.',
            'Choose between stochastic gradient descent with momentum and Adam for a task.',
          ],
          keyTerms: ['momentum', 'Adam', 'exponential moving average', 'bias correction', 'AdamW', 'weight decay', 'condition number'],
          body: `
## What this lesson covers

This lesson explains momentum and Adam, the two optimiser ideas behind almost all training. Momentum keeps a running average of gradients. Adam adds a running average of squared gradients and divides by it. You will run both by hand on a narrow valley and see why they beat plain gradient descent.

## Why it matters

Transformers train with Adam or its weight-decay variant AdamW. The optimiser state is two extra copies of the weights, which sets the memory budget of a training job. The hyperparameters $\\beta_1$, $\\beta_2$, and $\\epsilon$ appear in every training configuration. Knowing what each running average does lets you read a configuration and debug a run that stalls.

## The idea with an example

Return to the valley $L(w_1, w_2) = 50 w_1^2 + w_2^2$. Plain gradient descent with $\\eta = 0.019$ moves fast along $w_1$ and crawls along $w_2$.

Momentum keeps a velocity $v$ and updates it with each gradient. Start at $w_2 = 10$ with velocity 0, $\\eta = 0.019$, and momentum $\\beta = 0.9$. The gradient along $w_2$ is $2 w_2 = 20$.

| Step | Gradient | Velocity $v = 0.9 v + g$ | Step $-\\eta v$ | New $w_2$ |
| --- | --- | --- | --- | --- |
| 1 | 20 | 20 | -0.38 | 9.62 |
| 2 | 19.24 | 37.24 | -0.71 | 8.91 |
| 3 | 17.82 | 51.34 | -0.98 | 7.93 |

The step grows each time because the gradient keeps pointing the same way. In the limit, the velocity reaches $g / (1 - \\beta) = 10 g$, so momentum moves ten times faster along a direction with a steady gradient. Along $w_1$, the gradient flips sign at each step, the velocity averages toward zero, and the oscillation damps. The valley no longer forces a tiny rate.

Press Next to run the momentum steps with the state panel.

:::scenario
title: Momentum along w2 with learning rate 0.019 and beta = 0.9
state: w2=10, v=0
step: Start at w2 = 10 with velocity 0. The gradient is 2 times 10 = 20.
state: g=20
step: Update the velocity to 0.9 times 0 plus 20 = 20. Step by -0.019 times 20 = -0.38. w2 is 9.62.
state: v=20, w2=9.62
step: The gradient is 19.24. The velocity is 0.9 times 20 plus 19.24 = 37.24. The step is -0.71 and w2 is 8.91.
state: g=19.24, v=37.24, w2=8.91
step: The gradient is 17.82. The velocity is 0.9 times 37.24 plus 17.82 = 51.34. The step is -0.98 and w2 is 7.93.
state: g=17.82, v=51.34, w2=7.93
step: In the limit the velocity reaches 10 times the gradient. Momentum moves ten times faster than plain descent here.
state: limit of v=10 times g
:::

The bars compare the size of each momentum step with the plain gradient step.

:::bars
title: Step size along w2
Plain descent: 0.38
Momentum step 1: 0.38
Momentum step 2: 0.71
Momentum step 3: 0.98
Momentum in the limit: 3.8
:::

Adam goes further. It keeps a second average $s$ of the squared gradient per weight and divides the step by $\\sqrt{s}$. Along $w_1$ the gradients are large, so the step is scaled down. Along $w_2$ the gradients are small, so the step is scaled up. Each weight gets its own effective learning rate, and the step size is about $\\eta$ in every direction no matter the gradient scale.

## How it works


:::anim
title: Momentum along w2 with learning rate 0.019 and beta = 0.9
# Worked values and narration follow the scenario in this lesson.
text heading "Momentum along w2 with learning rate 0.019 and beta = 0.9" @ 480,48 size: 23 color: white
text legend "WORKED EXAMPLE · FOLLOW EACH CHANGE" @ 480,80 size: 13 color: grey
num scene = 1 @ 850,145 prefix: "Scene " size: 16 color: grey
dot cursor @ 100,145 r: 8 color: blue
dot mark0 @ 100,145 r: 3 color: grey
dot mark1 @ 220,145 r: 3 color: grey
dot mark2 @ 340,145 r: 3 color: grey
dot mark3 @ 460,145 r: 3 color: grey
dot mark4 @ 580,145 r: 3 color: grey
dot mark5 @ 700,145 r: 3 color: grey
rect card0 @ 180,255 size: 260x120 color: blue
text key0 "" @ 180,222 size: 16 color: grey
text value0 "" @ 180,267 size: 20 color: white
rect card1 @ 480,255 size: 260x120 color: blue
text key1 "" @ 480,222 size: 16 color: grey
text value1 "" @ 480,267 size: 20 color: white
rect card2 @ 780,255 size: 260x120 color: blue
text key2 "" @ 780,222 size: 16 color: grey
text value2 "" @ 780,267 size: 20 color: white
rect card3 @ 180,405 size: 260x120 color: blue
text key3 "" @ 180,372 size: 16 color: grey
text value3 "" @ 180,417 size: 20 color: white

step: Start with the example's initial values.
  show heading, legend, scene, cursor, mark0, mark1, mark2, mark3, mark4, mark5, card0, key0, value0, card1, key1, value1, card2, key2, value2, card3, key3, value3
  label key0 "w2"
  & label value0 "10"
  & highlight card0
  label key1 "v"
  & label value1 "0"
  & highlight card1

step: Start at w2 = 10 with velocity 0.
  restore card0, card1, card2, card3
  move cursor -> 220,145 (0.6s)
  & count scene -> 2 (0.6s)
  label key0 "g"
  & label value0 "20"
  & highlight card0
  label key1 "w2"
  & label value1 "10"
  label key2 "v"
  & label value2 "0"

step: Update the velocity to 0.9 times 0 plus 20 = 20.
  restore card0, card1, card2, card3
  move cursor -> 340,145 (0.6s)
  & count scene -> 3 (0.6s)
  label key0 "v"
  & label value0 "20"
  & highlight card0
  label key1 "w2"
  & label value1 "9.62"
  & highlight card1
  label key2 "g"
  & label value2 "20"

step: The gradient is 19.24.
  restore card0, card1, card2, card3
  move cursor -> 460,145 (0.6s)
  & count scene -> 4 (0.6s)
  label key0 "g"
  & label value0 "19.24"
  & highlight card0
  label key1 "v"
  & label value1 "37.24"
  & highlight card1
  label key2 "w2"
  & label value2 "8.91"
  & highlight card2

step: The gradient is 17.82.
  restore card0, card1, card2, card3
  move cursor -> 580,145 (0.6s)
  & count scene -> 5 (0.6s)
  label key0 "g"
  & label value0 "17.82"
  & highlight card0
  label key1 "v"
  & label value1 "51.34"
  & highlight card1
  label key2 "w2"
  & label value2 "7.93"
  & highlight card2

step: In the limit the velocity reaches 10 times the gradient.
  restore card0, card1, card2, card3
  move cursor -> 700,145 (0.6s)
  & count scene -> 6 (0.6s)
  label key0 "limit of v"
  & label value0 "10 times g"
  & highlight card0
  label key1 "g"
  & label value1 "17.82"
  label key2 "v"
  & label value2 "51.34"
  label key3 "w2"
  & label value3 "7.93"
:::

Momentum:

$$v_t = \\beta v_{t-1} + \\nabla L(w_t), \\qquad w_{t+1} = w_t - \\eta v_t$$

$v_t$ is the velocity. $\\beta$ is the momentum coefficient, often 0.9. The velocity is an exponential moving average of past gradients with a memory of about $1 / (1 - \\beta)$ steps.

Adam:

$$m_t = \\beta_1 m_{t-1} + (1 - \\beta_1) g_t, \\qquad s_t = \\beta_2 s_{t-1} + (1 - \\beta_2) g_t^2$$

$$\\hat{m}_t = \\frac{m_t}{1 - \\beta_1^t}, \\qquad \\hat{s}_t = \\frac{s_t}{1 - \\beta_2^t}, \\qquad w_{t+1} = w_t - \\eta \\frac{\\hat{m}_t}{\\sqrt{\\hat{s}_t} + \\epsilon}$$

$g_t$ is the gradient at step $t$. $m_t$ is the average gradient, with $\\beta_1$ often 0.9. $s_t$ is the average squared gradient, with $\\beta_2$ often 0.95 to 0.999. The squares and the division are per weight. $\\epsilon$ is a small constant, often $10^{-8}$, that prevents division by zero. $\\hat{m}_t$ and $\\hat{s}_t$ are the bias-corrected averages.

The bias correction matters at the start. Both averages start at zero. After one step, $m_1 = 0.1 g_1$, which is ten times too small. Dividing by $1 - \\beta_1^1 = 0.1$ restores $g_1$. After many steps the correction factor approaches 1 and does nothing.

To run one Adam step by hand:

1. Compute the gradient $g_t$.
2. Update $m_t$ and $s_t$.
3. Divide each by its correction factor.
4. Compute the step as $\\eta$ times $\\hat{m}_t$ divided by $\\sqrt{\\hat{s}_t} + \\epsilon$.
5. Subtract the step from the weights.

The diagram shows the path of one gradient through the Adam update.

:::flow
title: One Adam step
Gradient g -> Average m: beta1 = 0.9
Gradient g -> Average s: beta2 = 0.95, uses g squared
Average m -> Bias correction: divide by 1 - beta1^t
Average s -> Bias correction: divide by 1 - beta2^t
Bias correction -> Step: eta times m hat over root s hat
Step -> Weights: subtract the step
:::

AdamW adds weight decay as a separate term: $w_{t+1} = w_t - \\eta (\\text{Adam step} + \\lambda w_t)$. The decay pulls weights toward zero at a rate that does not depend on the gradient scale. Decay inside the gradient would be rescaled by $\\sqrt{\\hat{s}_t}$ and lose its meaning.

Choose between the two:

- Stochastic gradient descent with momentum: convolutional networks on images, where it often generalises slightly better.
- Adam or AdamW: transformers and any model with gradients of very different scales across layers.

Note: Adam stores $m$ and $s$ for every weight. In 32-bit, that is 8 bytes per weight on top of the weights and gradients.

The table compares the memory per weight for each optimiser in 32-bit.

| Optimiser | Optimiser state per weight | Bytes per weight with weights and gradients |
| --- | --- | --- |
| Plain gradient descent | none | 8 |
| Momentum | v | 12 |
| Adam or AdamW | m and s | 16 |

The bars compare the three memory costs.

:::bars
title: Bytes per weight in 32-bit training
unit: bytes
Plain gradient descent: 8
Momentum: 12
Adam or AdamW: 16
:::

The program computes the lesson's example.

:::code
lang: python
file: momentum_adam.py
import math

# momentum along w2 of the valley L = 50 w1^2 + w2^2
eta, beta = 0.019, 0.9
w2, v = 10.0, 0.0
for step in range(1, 4):
    g = 2 * w2
    v = beta * v + g
    w2 = w2 - eta * v
    print("momentum step", step, "g =", round(g, 2), "v =", round(v, 2), "w2 =", round(w2, 3))
print("limit of v for a constant gradient g: g /", round(1 - beta, 1), "= 10 g")

# one Adam step with bias correction
beta1, beta2, eps = 0.9, 0.95, 1e-8
m, s, t = 0.0, 0.0, 1
g = 20.0
m = beta1 * m + (1 - beta1) * g          # 2.0, ten times too small
s = beta2 * s + (1 - beta2) * g ** 2     # 20.0
m_hat = m / (1 - beta1 ** t)             # 20.0, corrected
s_hat = s / (1 - beta2 ** t)             # 400.0
step = eta * m_hat / (math.sqrt(s_hat) + eps)
print("Adam step size:", round(step, 4), "about eta in every direction")
:::

## Try it

:::exercise
title: Momentum with a shorter memory, then one Adam step
task: Repeat the three momentum steps along w2 from the lesson, starting at w2 = 10 with learning rate 0.019, but with beta = 0.5 instead of 0.9. Write the gradient, the velocity, and the new w2 at each step, and state the limiting velocity for a constant gradient. Then compute the first Adam step for the same gradient of 20 with beta1 = 0.9, beta2 = 0.95, and learning rate 0.019, and show that the step is about 0.019. Check with Python.
hint: With beta = 0.5 the velocity is 0.5 times the old velocity plus the gradient, and the limit is g / (1 - 0.5) = 2 g. In Adam the bias correction divides m by 0.1 and s by 0.05.
lang: python
solution:
import math

eta, beta = 0.019, 0.5
w2, v = 10.0, 0.0
for step in range(1, 4):
    g = 2 * w2
    v = beta * v + g
    w2 -= eta * v
    print(step, round(g, 2), round(v, 2), round(w2, 3))
# step 1: g 20, v 20, w2 9.62; step 2: g 19.24, v 29.24, w2 9.064
# step 3: g 18.13, v 32.75, w2 8.442; limit v = 2 g

g = 20.0
m = 0.1 * g                     # 2
s = 0.05 * g ** 2               # 20
m_hat, s_hat = m / 0.1, s / 0.05        # 20 and 400
print(round(eta * m_hat / (math.sqrt(s_hat) + 1e-8), 4))   # 0.019
:::

## Common mistakes

- Mistake: you set $\\beta_2 = 0.999$ for a large transformer. Fix: a shorter memory, such as 0.95, reacts faster to gradient spikes.
- Mistake: you add weight decay to the loss with Adam. Fix: use AdamW, which decays the weights directly.
- Mistake: you remove the bias correction. Fix: the first steps are then too small, and warmup must be longer.
- Mistake: you reuse an Adam learning rate for stochastic gradient descent. Fix: the two differ by orders of magnitude; tune each.

## Check your understanding

Answer each question before you open the explanation.

:::quiz
title: Check: momentum and Adam
q: With beta = 0.9 and a constant gradient g, what is the limiting velocity?
- g
- 0.9 g
* 10 g
- 0.1 g
why: The velocity settles where v = 0.9 v + g, which gives v = g / 0.1 = 10 g.
q: What is m hat after the first Adam step with beta1 = 0.9?
- 0.1 times g1
* g1
- 0.9 times g1
why: m1 is 0.1 g1 and the bias correction divides by 1 - 0.9 = 0.1, which restores g1.
q: Why does AdamW apply weight decay outside the Adam step?
- To save memory
* So the decay is not rescaled by the gradient statistics
- Because Adam cannot handle a decay term in the gradient
why: Decay inside the gradient would be divided by the root of s hat and lose its fixed strength.
q: How many bytes per weight does 32-bit Adam use for weights, gradients and optimiser state?
- 8
- 12
* 16
why: Weights and gradients take 4 bytes each, and the two averages m and s add 4 bytes each.
q: Along a direction where the gradient flips sign every step, what does momentum do?
- It doubles the step each time
* It averages the gradients toward zero and damps the oscillation
- It stops moving altogether
why: Alternating signs cancel in the running average, so the velocity stays small in that direction.
:::

## Go further

The Adam paper gives the algorithm and its convergence analysis. The AdamW paper explains the decoupled weight decay. The Distill article on momentum has interactive figures of the valley problem. Ruder's overview compares all the common optimisers.
`,
          links: [
            { label: 'Adam: A Method for Stochastic Optimization (Kingma and Ba, 2014)', url: 'https://arxiv.org/abs/1412.6980', kind: 'paper' },
            { label: 'Decoupled Weight Decay Regularization (Loshchilov and Hutter, 2017)', url: 'https://arxiv.org/abs/1711.05101', kind: 'paper' },
            { label: 'Why Momentum Really Works (Distill)', url: 'https://distill.pub/2017/momentum/', kind: 'article' },
            { label: 'An overview of gradient descent optimization algorithms (Ruder, 2016)', url: 'https://arxiv.org/abs/1609.04747', kind: 'paper' },
          ],
        },
        {
          slug: 'convexity',
          title: 'Convexity and the loss landscape',
          summary: 'A convex loss has one minimum that gradient descent always finds, and a deep network loss is not convex but behaves well in practice.',
          minutes: 14,
          objectives: [
            'Test whether a one-variable function is convex with the second derivative.',
            'Explain why gradient descent on a convex loss reaches the global minimum.',
            'Name two convex losses and one non-convex loss used in machine learning.',
            'Describe what is known about the loss landscape of deep networks.',
          ],
          keyTerms: ['convex', 'global minimum', 'local minimum', 'saddle point', 'second derivative', 'loss landscape', 'Hessian'],
          body: `
## What this lesson covers

This lesson explains convexity, the property that makes an optimisation problem easy. A convex function has no local minimum other than the global one. You will test convexity with the second derivative, see which machine learning losses are convex, and learn what replaces convexity in deep networks.

## Why it matters

Linear regression and logistic regression have convex losses. Any learning rate below the stability limit finds the best weights, and two runs reach the same answer. Deep networks have non-convex losses, and the guarantee is gone. Knowing which case you are in tells you whether a bad result is a bad model or a bad run.

:::video
id: kV1ru-Inzl4
why: Watch the first 20 minutes. Boyd explains why convex problems are the ones you can always solve, which is the guarantee this lesson states for linear and logistic regression.
:::

## The idea with an example

A function is convex when the line between any two points on its graph lies above the graph. Take $f(x) = x^2$. Pick $x = -1$ and $x = 3$. The function values are 1 and 9. The midpoint of the line is at $x = 1$ with height 5. The function at $x = 1$ is 1, which is below 5. The line is above the graph, as convexity requires.

Now take $g(x) = x^4 - 4x^2$. At $x = -2$ and $x = 2$ the values are both 0. The midpoint of the line is at $x = 0$ with height 0. The function at $x = 0$ is also 0. Try $x = -2$ and $x = 0$: values 0 and 0, midpoint $x = -1$ with line height 0 and function value $-3$. Below the line so far. Try $x = -1$ and $x = 1$: values $-3$ and $-3$, midpoint $x = 0$ with line height $-3$ and function value 0. The function is above the line. The function is not convex. It has two minima at $x = \\pm\\sqrt{2}$ and a local maximum at 0.

Gradient descent on $g$ from $x = 0.1$ moves right and lands at $\\sqrt{2}$. From $x = -0.1$ it lands at $-\\sqrt{2}$. Both are global minima here, but in a general non-convex function one of them could be worse. The starting point decides the outcome.

Press Next to run the midpoint test on g.

:::scenario
title: Midpoint test on g(x) = x^4 - 4x^2
state: g(-2)=0, g(0)=0, g(2)=0
step: Pick x = -2 and x = 2. Both values are 0, so the line between them is flat at height 0. The function at the midpoint 0 is 0. No violation yet.
state: pair=-2 and 2, line height=0, g at midpoint=0
step: Pick x = -2 and x = 0. The line is flat at 0. The function at the midpoint -1 is 1 - 4 = -3. It lies below the line.
state: pair=-2 and 0, line height=0, g at midpoint=-3
step: Pick x = -1 and x = 1. Both values are -3, so the line is flat at -3. The function at the midpoint 0 is 0. It lies above the line.
state: pair=-1 and 1, line height=-3, g at midpoint=0
step: One pair breaks the rule, so g is not convex. Check with the second derivative 12 x^2 - 8, which is -8 at x = 0.
state: second derivative at 0=-8, convex=no
:::

The second derivative gives a quick test. For $f$, $f''(x) = 2 > 0$ everywhere, so $f$ is convex. For $g$, $g''(x) = 12x^2 - 8$, which is negative near 0. So $g$ is not convex.

The table lists the midpoint test for each pair of points.

| Function | Points | Line height at midpoint | Function at midpoint | Line above graph? |
| --- | --- | --- | --- | --- |
| $x^2$ | -1 and 3 | 5 | 1 | yes |
| $x^4 - 4x^2$ | -2 and 0 | 0 | -3 | yes |
| $x^4 - 4x^2$ | -1 and 1 | -3 | 0 | no |

The bars compare the second derivative of g at three points.

:::bars
title: Second derivative of g(x) = x^4 - 4x^2
At x = 0: -8
At x = 1: 4
At x = 2: 40
:::

## How it works


:::anim
title: Midpoint test on g(x) = x^4 - 4x^2
# Worked values and narration follow the scenario in this lesson.
text heading "Midpoint test on g(x) = x^4 - 4x^2" @ 480,48 size: 23 color: white
text legend "WORKED EXAMPLE · FOLLOW EACH CHANGE" @ 480,80 size: 13 color: grey
num scene = 1 @ 850,145 prefix: "Scene " size: 16 color: grey
dot cursor @ 100,145 r: 8 color: blue
dot mark0 @ 100,145 r: 3 color: grey
dot mark1 @ 250,145 r: 3 color: grey
dot mark2 @ 400,145 r: 3 color: grey
dot mark3 @ 550,145 r: 3 color: grey
dot mark4 @ 700,145 r: 3 color: grey
rect card0 @ 180,255 size: 260x120 color: blue
text key0 "" @ 180,222 size: 16 color: grey
text value0 "" @ 180,267 size: 20 color: white
rect card1 @ 480,255 size: 260x120 color: blue
text key1 "" @ 480,222 size: 16 color: grey
text value1 "" @ 480,267 size: 20 color: white
rect card2 @ 780,255 size: 260x120 color: blue
text key2 "" @ 780,222 size: 16 color: grey
text value2 "" @ 780,267 size: 20 color: white
rect card3 @ 180,405 size: 260x120 color: blue
text key3 "" @ 180,372 size: 16 color: grey
text value3 "" @ 180,417 size: 20 color: white
rect card4 @ 480,405 size: 260x120 color: blue
text key4 "" @ 480,372 size: 16 color: grey
text value4 "" @ 480,417 size: 20 color: white
rect card5 @ 780,405 size: 260x120 color: blue
text key5 "" @ 780,372 size: 16 color: grey
text value5 "" @ 780,417 size: 20 color: white

step: Start with the example's initial values.
  show heading, legend, scene, cursor, mark0, mark1, mark2, mark3, mark4, card0, key0, value0, card1, key1, value1, card2, key2, value2, card3, key3, value3, card4, key4, value4, card5, key5, value5
  label key0 "g(-2)"
  & label value0 "0"
  & highlight card0
  label key1 "g(0)"
  & label value1 "0"
  & highlight card1
  label key2 "g(2)"
  & label value2 "0"
  & highlight card2

step: Pick x = -2 and x = 2.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 250,145 (0.6s)
  & count scene -> 2 (0.6s)
  label key0 "pair"
  & label value0 "-2 and 2"
  & highlight card0
  label key1 "line height"
  & label value1 "0"
  & highlight card1
  label key2 "g at midpoint"
  & label value2 "0"
  & highlight card2
  label key3 "g(-2)"
  & label value3 "0"
  label key4 "g(0)"
  & label value4 "0"
  label key5 "g(2)"
  & label value5 "0"

step: Pick x = -2 and x = 0.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 400,145 (0.6s)
  & count scene -> 3 (0.6s)
  label key0 "pair"
  & label value0 "-2 and 0"
  & highlight card0
  label key1 "line height"
  & label value1 "0"
  label key2 "g at midpoint"
  & label value2 "-3"
  & highlight card2
  label key3 "g(-2)"
  & label value3 "0"
  label key4 "g(0)"
  & label value4 "0"
  label key5 "g(2)"
  & label value5 "0"

step: Pick x = -1 and x = 1.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 550,145 (0.6s)
  & count scene -> 4 (0.6s)
  label key0 "pair"
  & label value0 "-1 and 1"
  & highlight card0
  label key1 "line height"
  & label value1 "-3"
  & highlight card1
  label key2 "g at midpoint"
  & label value2 "0"
  & highlight card2
  label key3 "g(-2)"
  & label value3 "0"
  label key4 "g(0)"
  & label value4 "0"
  label key5 "g(2)"
  & label value5 "0"

step: One pair breaks the rule, so g is not convex.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 700,145 (0.6s)
  & count scene -> 5 (0.6s)
  label key0 "second derivative at 0"
  & label value0 "-8"
  & highlight card0
  label key1 "convex"
  & label value1 "no"
  & highlight card1
  label key2 "pair"
  & label value2 "-1 and 1"
  label key3 "line height"
  & label value3 "-3"
  label key4 "g at midpoint"
  & label value4 "0"
  label key5 "g(-2)"
  & label value5 "0"
:::

A function $f$ is convex when for all $x$, $y$ and all $t$ in $[0, 1]$:

$$f(t x + (1 - t) y) \\le t f(x) + (1 - t) f(y)$$

The left side is the function at a point between $x$ and $y$. The right side is the line between the function values. For a twice-differentiable function of one variable, convexity is the same as $f''(x) \\ge 0$ everywhere. For many variables, it is the same as the Hessian having no negative eigenvalues.

The grid shows the Hessian of the valley loss from the learning-rate lesson, with both eigenvalues positive.

:::matrix
title: Hessian of 50 w1^2 + w2^2
cols: w1, w2
w1: 100, 0
w2: 0, 2
:::

To test convexity by hand:

1. Compute the second derivative, or the Hessian.
2. Check its sign, or the signs of the Hessian's eigenvalues, over the domain.
3. If none is negative, the function is convex.

The diagram shows the test as a sequence of checks.

:::flow
title: Test a function for convexity
Function f -> Second derivative: differentiate twice
Second derivative -> Sign check: over the whole domain
Sign check -> Convex: never negative
Sign check -> Not convex: negative somewhere
Convex -> Global minimum: any local minimum is global
:::

Three facts about convex functions:

- Any local minimum is a global minimum.
- A sum of convex functions is convex. A sum over examples keeps convexity.
- A convex function of a linear map is convex. So the loss of a linear model is convex when the per-example loss is.

Squared error on a linear model is convex. Cross-entropy on a logistic or softmax model is convex. Any loss on a network with a hidden layer and a nonlinearity is not convex, because the hidden units can be permuted, and every permutation is a different minimum with the same loss.

Deep network landscapes have structure of their own. Most stationary points in high dimension are saddle points, with some directions up and some down, and gradient descent escapes them with a little noise. Minima found by training tend to be connected by paths of low loss. Wide, flat minima often generalise better than sharp ones. These are empirical findings, not theorems, and they are why non-convex training works in practice.

Note: a convex problem can still be slow. A condition number of a million makes gradient descent crawl even with a single minimum.

The program computes the lesson's example.

:::code
lang: python
file: convexity.py
def midpoint_test(f, a, b):
    # True when the line between a and b lies above the graph at the midpoint
    line = 0.5 * (f(a) + f(b))
    return f(0.5 * (a + b)) <= line

f = lambda x: x ** 2
g = lambda x: x ** 4 - 4 * x ** 2

print("x^2 on -1 and 3:", midpoint_test(f, -1, 3))          # True
print("g on -2 and 0:", midpoint_test(g, -2, 0))            # True
print("g on -1 and 1:", midpoint_test(g, -1, 1))            # False: not convex

def second_derivative(f, x, h=1e-4):
    return (f(x + h) - 2 * f(x) + f(x - h)) / h ** 2

for x in [0.0, 1.0, 2.0]:
    print("g'' at", x, "=", round(second_derivative(g, x), 2))   # -8, 4, 40

# gradient descent on g from two starts lands in two different minima
for w in [0.1, -0.1]:
    for _ in range(200):
        w -= 0.01 * (4 * w ** 3 - 8 * w)
    print("start", "right" if w > 0 else "left", "-> w =", round(w, 4))   # +-1.4142
:::

## Try it

:::exercise
title: Test two functions for convexity
task: Decide whether h(x) = x cubed minus 3x and k(x) = x to the fourth plus 2 x squared are convex. For each, compute the second derivative and find where it is negative, if anywhere. For h, also run the midpoint test on the pair x = -2 and x = 0 and show the violation. Then say what gradient descent on h does from a start at x = -1. Check your second derivatives numerically with the function from the lesson.
hint: The second derivative of h is 6x. The second derivative of k is 12 x squared + 4. For the midpoint test, h(-2) = -2, h(0) = 0, and h(-1) = 2.
lang: text
solution:
h(x) = x^3 - 3x: h'(x) = 3x^2 - 3 and h''(x) = 6x.
h'' is negative for every x below 0, so h is not convex.
Midpoint test on -2 and 0: the line height at the midpoint -1 is (h(-2) + h(0)) / 2 = (-2 + 0) / 2 = -1.
The function at -1 is (-1)^3 - 3(-1) = -1 + 3 = 2, which is above the line. Violation.

k(x) = x^4 + 2x^2: k'(x) = 4x^3 + 4x and k''(x) = 12x^2 + 4.
k'' is at least 4 everywhere, never negative, so k is convex with its one minimum at x = 0.

Gradient descent on h from x = -1: h'(-1) = 3 - 3 = 0, so the gradient is zero and the step is zero.
The point x = -1 is a stationary point, but h''(-1) = -6 is negative, so it is a local maximum.
Any small nudge moves the weight away: left toward minus infinity (h has no lower bound), right toward the local minimum at x = 1.

Numerical check:
g2 = lambda f, x, h=1e-4: (f(x + h) - 2 * f(x) + f(x - h)) / h ** 2
print(g2(lambda x: x ** 3 - 3 * x, -1.0))      # -6
print(g2(lambda x: x ** 4 + 2 * x ** 2, 0.0))  # 4
:::

## Common mistakes

- Mistake: you assume a loss with one visible minimum is convex. Fix: check the second derivative over the whole domain.
- Mistake: you blame a bad result on a local minimum without evidence. Fix: run several seeds; if they agree, the model is the limit.
- Mistake: you expect two runs of a deep network to find the same weights. Fix: they find different weights with similar loss.
- Mistake: you treat a saddle point as a minimum because the gradient is zero. Fix: check the Hessian for a negative eigenvalue.

## Check your understanding

Answer each question before you open the explanation.

:::quiz
title: Check: convexity
q: Is f(x) = e to the power x convex?
* Yes, its second derivative is e to the x, which is positive everywhere
- No, it has no minimum
- Only for positive x
why: A function with a non-negative second derivative everywhere is convex, even if it never reaches a minimum.
q: Why is the loss of a network with one hidden layer not convex?
- Because the loss function is cross-entropy
* Because swapping two hidden units gives a different set of weights with the same loss, so there are many separate minima
- Because the learning rate is not constant
why: A convex function cannot have two separate minima with equal value, but every permutation of hidden units is such a minimum.
q: g(x) = x to the fourth minus 4 x squared has second derivative 12 x squared minus 8. Where is it negative?
- For all x
* For x between about -0.82 and 0.82
- For x greater than 2
why: 12 x squared minus 8 is below zero when x squared is below 2/3, which is the region around 0.
q: In a high-dimensional loss, which kind of stationary point is most common?
- Local minima
- Local maxima
* Saddle points
why: A point needs every curvature to have the same sign to be a minimum or maximum, which is rare in many dimensions.
q: Two training runs of a deep network with different seeds give different weights but the same loss. What does this show?
- One run has a bug
* The loss is non-convex and has many minima of similar quality
- The learning rate was too high
why: Non-convex landscapes have many minima, and empirical work shows they are often connected by low-loss paths.
:::

## Go further

Boyd and Vandenberghe's book is the standard text on convex optimisation and is free online. The loss landscape visualisation paper shows what deep network losses look like along random directions. The saddle point paper explains why saddles, not local minima, are the obstacle in high dimension. The CS231n notes relate these ideas to practice.
`,
          links: [
            { label: 'Convex Optimization (Boyd and Vandenberghe)', url: 'https://web.stanford.edu/~boyd/cvxbook/', kind: 'article' },
            { label: 'Visualizing the Loss Landscape of Neural Nets (Li et al., 2017)', url: 'https://arxiv.org/abs/1712.09913', kind: 'paper' },
            { label: 'Identifying and attacking the saddle point problem (Dauphin et al., 2014)', url: 'https://arxiv.org/abs/1406.2572', kind: 'paper' },
            { label: 'CS231n: Optimization', url: 'https://cs231n.github.io/optimization-1/', kind: 'course' },
          ],
        },
      ],
    },
    {
      slug: 'linear-models-to-networks',
      title: 'From linear models to networks',
      description: 'Logistic regression, softmax regression, the multilayer perceptron, and a full backward pass by hand.',
      level: 'intermediate',
      lessons: [
        {
          slug: 'logistic-regression',
          title: 'Logistic regression',
          summary: 'Logistic regression passes a linear score through a sigmoid to get a probability, and trains it with binary cross-entropy.',
          minutes: 16,
          objectives: [
            'Compute the output of a logistic model for one input by hand.',
            'Derive the gradient of binary cross-entropy with respect to the weights.',
            'Run one gradient descent step on a two-example dataset.',
            'Explain why the decision boundary of logistic regression is a straight line.',
          ],
          keyTerms: ['logistic regression', 'sigmoid', 'logit', 'binary cross-entropy', 'decision boundary', 'gradient descent', 'bias'],
          body: `
## What this lesson covers

This lesson explains logistic regression, the simplest classifier that outputs a probability. It computes a linear score, passes it through the sigmoid, and trains with binary cross-entropy. You will compute an output, derive the gradient, and run one training step by hand.

## Why it matters

Logistic regression is the output layer of every binary classifier, including the reward model in RLHF. The Bradley-Terry loss on a pair of answers is logistic regression on the score difference. The gradient you derive here, prediction minus target, reappears in softmax regression and in every network output layer.

:::video
id: yIYKR4sgzI8
why: Watch the whole video, 9 minutes. It shows the sigmoid curve and the straight-line decision boundary, and explains why the output is read as a probability. The gradient derivation is in this lesson, not the video.
:::

## The idea with an example

A model predicts whether an email is spam from two features: the number of links $x_1$ and the number of exclamation marks $x_2$. The weights are $w = [0.5, 1.0]$ and the bias is $b = -2$.

Take an email with $x = [2, 1]$. The linear score, called the logit, is $z = 0.5 \\times 2 + 1.0 \\times 1 - 2 = 0$. The sigmoid $\\sigma(z) = 1 / (1 + e^{-z})$ maps the score to a probability: $\\sigma(0) = 0.5$. The model is unsure.

The diagram shows the path from the features to the loss for the first email.

:::flow
title: Logistic regression on one email
x = [2, 1] -> Logit z: w dot x + b = 0
Logit z -> Sigmoid: 1 / (1 + e^-z)
Sigmoid -> y hat = 0.5: probability of spam
y hat = 0.5 -> Loss: -ln 0.5 = 0.69
:::

Take a second email with $x = [4, 3]$. The logit is $2 + 3 - 2 = 3$. The probability is $\\sigma(3) \\approx 0.95$. The model says spam.

Suppose the first email is spam ($y = 1$) and the second is not ($y = 0$). The loss for each is the negative log of the probability assigned to the true label. For the first, $-\\ln 0.5 \\approx 0.69$. For the second, $-\\ln(1 - 0.95) \\approx 3.0$. The second email is a confident mistake, and it costs much more.

The table lists the logit, the probability, the label, and the loss for both emails.

| Email | Logit | Probability | Label | Loss |
| --- | --- | --- | --- | --- |
| 1 | 0 | 0.5 | 1 (spam) | 0.69 |
| 2 | 3 | 0.95 | 0 (not spam) | 3.0 |

The bars compare the loss of the two emails.

:::bars
title: Loss per email
Email 1 (unsure and correct): 0.69
Email 2 (confident and wrong): 3.0
:::

Now one gradient step. The gradient of the loss with respect to the weights for one example is $(\\hat{y} - y)\\, x$, where $\\hat{y}$ is the predicted probability. For the first email, $(0.5 - 1) \\times [2, 1] = [-1, -0.5]$. For the second, $(0.95 - 0) \\times [4, 3] = [3.8, 2.85]$. The average is $[1.4, 1.18]$. With learning rate 0.1, the new weights are $[0.5 - 0.14, 1.0 - 0.118] = [0.36, 0.88]$. The weights fell, because the confident mistake pushed harder than the uncertain correct case.

Press Next to run the gradient step on both emails.

:::scenario
title: One gradient step with learning rate 0.1
state: w=[0.5 1.0], b=-2
step: Compute the error for email 1. The prediction is 0.5 and the label is 1, so the error is -0.5.
state: error 1=-0.5
step: Compute the error for email 2. The prediction is 0.95 and the label is 0, so the error is 0.95.
state: error 2=0.95
step: Multiply each error by its input. Email 1 gives -0.5 times [2, 1] = [-1, -0.5]. Email 2 gives 0.95 times [4, 3] = [3.8, 2.85].
state: gradient 1=[-1 -0.5], gradient 2=[3.8 2.85]
step: Average the two. The weight gradient is [1.4, 1.18]. The bias gradient is the average error, 0.225.
state: weight gradient=[1.4 1.18], bias gradient=0.225
step: Subtract 0.1 times each gradient. The new weights are [0.36, 0.88] and the new bias is -2.02.
state: w=[0.36 0.88], b=-2.02
:::

## How it works


:::anim
title: One gradient step with learning rate 0.1
# Worked values and narration follow the scenario in this lesson.
text heading "One gradient step with learning rate 0.1" @ 480,48 size: 23 color: white
text legend "WORKED EXAMPLE · FOLLOW EACH CHANGE" @ 480,80 size: 13 color: grey
num scene = 1 @ 850,145 prefix: "Scene " size: 16 color: grey
dot cursor @ 100,145 r: 8 color: blue
dot mark0 @ 100,145 r: 3 color: grey
dot mark1 @ 220,145 r: 3 color: grey
dot mark2 @ 340,145 r: 3 color: grey
dot mark3 @ 460,145 r: 3 color: grey
dot mark4 @ 580,145 r: 3 color: grey
dot mark5 @ 700,145 r: 3 color: grey
rect card0 @ 180,255 size: 260x120 color: blue
text key0 "" @ 180,222 size: 16 color: grey
text value0 "" @ 180,267 size: 20 color: white
rect card1 @ 480,255 size: 260x120 color: blue
text key1 "" @ 480,222 size: 16 color: grey
text value1 "" @ 480,267 size: 20 color: white
rect card2 @ 780,255 size: 260x120 color: blue
text key2 "" @ 780,222 size: 16 color: grey
text value2 "" @ 780,267 size: 20 color: white
rect card3 @ 180,405 size: 260x120 color: blue
text key3 "" @ 180,372 size: 16 color: grey
text value3 "" @ 180,417 size: 20 color: white
rect card4 @ 480,405 size: 260x120 color: blue
text key4 "" @ 480,372 size: 16 color: grey
text value4 "" @ 480,417 size: 20 color: white
rect card5 @ 780,405 size: 260x120 color: blue
text key5 "" @ 780,372 size: 16 color: grey
text value5 "" @ 780,417 size: 20 color: white

step: Start with the example's initial values.
  show heading, legend, scene, cursor, mark0, mark1, mark2, mark3, mark4, mark5, card0, key0, value0, card1, key1, value1, card2, key2, value2, card3, key3, value3, card4, key4, value4, card5, key5, value5
  label key0 "w"
  & label value0 "[0.5 1.0]"
  & highlight card0
  label key1 "b"
  & label value1 "-2"
  & highlight card1

step: Compute the error for email 1.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 220,145 (0.6s)
  & count scene -> 2 (0.6s)
  label key0 "error 1"
  & label value0 "-0.5"
  & highlight card0
  label key1 "w"
  & label value1 "[0.5 1.0]"
  label key2 "b"
  & label value2 "-2"

step: Compute the error for email 2.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 340,145 (0.6s)
  & count scene -> 3 (0.6s)
  label key0 "error 2"
  & label value0 "0.95"
  & highlight card0
  label key1 "error 1"
  & label value1 "-0.5"
  label key2 "w"
  & label value2 "[0.5 1.0]"
  label key3 "b"
  & label value3 "-2"

step: Multiply each error by its input.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 460,145 (0.6s)
  & count scene -> 4 (0.6s)
  label key0 "gradient 1"
  & label value0 "[-1 -0.5]"
  & highlight card0
  label key1 "gradient 2"
  & label value1 "[3.8 2.85]"
  & highlight card1
  label key2 "error 2"
  & label value2 "0.95"
  label key3 "error 1"
  & label value3 "-0.5"
  label key4 "w"
  & label value4 "[0.5 1.0]"
  label key5 "b"
  & label value5 "-2"

step: Average the two.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 580,145 (0.6s)
  & count scene -> 5 (0.6s)
  label key0 "weight gradient"
  & label value0 "[1.4 1.18]"
  & highlight card0
  label key1 "bias gradient"
  & label value1 "0.225"
  & highlight card1
  label key2 "gradient 1"
  & label value2 "[-1 -0.5]"
  label key3 "gradient 2"
  & label value3 "[3.8 2.85]"
  label key4 "error 2"
  & label value4 "0.95"
  label key5 "error 1"
  & label value5 "-0.5"

step: Subtract 0.1 times each gradient.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 700,145 (0.6s)
  & count scene -> 6 (0.6s)
  label key0 "w"
  & label value0 "[0.36 0.88]"
  & highlight card0
  label key1 "b"
  & label value1 "-2.02"
  & highlight card1
  label key2 "weight gradient"
  & label value2 "[1.4 1.18]"
  label key3 "bias gradient"
  & label value3 "0.225"
  label key4 "gradient 1"
  & label value4 "[-1 -0.5]"
  label key5 "gradient 2"
  & label value5 "[3.8 2.85]"
:::

The model is:

$$\\hat{y} = \\sigma(w \\cdot x + b), \\qquad \\sigma(z) = \\frac{1}{1 + e^{-z}}$$

$x$ is the input vector. $w$ is the weight vector. $b$ is the bias. $\\hat{y}$ is the predicted probability of the positive class.

The loss for one example with label $y \\in \\{0, 1\\}$ is binary cross-entropy:

$$\\mathcal{L} = -\\big[y \\ln \\hat{y} + (1 - y) \\ln(1 - \\hat{y})\\big]$$

When $y = 1$ only the first term remains. When $y = 0$ only the second remains. This is the negative log-likelihood of a Bernoulli, from the maximum likelihood lesson.

The gradient simplifies because the sigmoid derivative is $\\sigma(1 - \\sigma)$. Apply the chain rule from the loss to $\\hat{y}$, then to $z$, then to $w$:

$$\\frac{\\partial \\mathcal{L}}{\\partial w} = (\\hat{y} - y)\\, x, \\qquad \\frac{\\partial \\mathcal{L}}{\\partial b} = \\hat{y} - y$$

The factor $\\hat{y} - y$ is the error. A correct and confident prediction has a small error and a small gradient.

To train by hand:

1. For each example, compute $z$, $\\hat{y}$, and the error $\\hat{y} - y$.
2. Multiply each error by its input and average over the batch. This is the weight gradient.
3. Average the errors. This is the bias gradient.
4. Subtract the learning rate times each gradient.
5. Repeat until the loss stops falling.

The decision boundary is where $\\hat{y} = 0.5$, which is where $z = 0$. The equation $w \\cdot x + b = 0$ is a straight line in two dimensions and a flat plane in more. Logistic regression cannot separate classes that need a curved boundary. That limit is the reason for hidden layers.

Note: the loss is convex in $w$ and $b$, so gradient descent reaches the global minimum from any start.

The program computes the lesson's example.

:::code
lang: python
file: logistic.py
import numpy as np

def sigmoid(z):
    return 1 / (1 + np.exp(-z))

X = np.array([[2.0, 1.0],      # email 1: 2 links, 1 exclamation mark
              [4.0, 3.0]])     # email 2
y = np.array([1.0, 0.0])       # spam, not spam
w = np.array([0.5, 1.0])
b = -2.0

z = X @ w + b                              # [0 3]
y_hat = sigmoid(z)                         # [0.5 0.953]
loss = -(y * np.log(y_hat) + (1 - y) * np.log(1 - y_hat))
print("logits", z, "probabilities", np.round(y_hat, 3))
print("loss per email", np.round(loss, 2), "mean", round(loss.mean(), 3))

error = y_hat - y                          # [-0.5 0.953]
w_grad = (error[:, None] * X).mean(axis=0) # [1.4 1.18]
b_grad = error.mean()                      # 0.226
eta = 0.1
w = w - eta * w_grad
b = b - eta * b_grad
print("new w", np.round(w, 3), "new b", round(b, 3))
:::

## Try it

:::exercise
title: One gradient step on a third email
task: Use the original weights w = [0.5, 1.0] and bias b = -2. A third email has features x = [1, 3] and label y = 0. Compute the logit, the probability, and the loss by hand. Then compute the error, the weight gradient, and the bias gradient for this one email, and take a step with learning rate 0.1. Finally, write the equation of the decision boundary line for the original weights. Check with NumPy.
hint: The logit is 0.5 + 3 - 2 = 1.5 and sigmoid(1.5) is about 0.818. The boundary is where the logit is 0.
lang: python
solution:
import numpy as np

sigmoid = lambda z: 1 / (1 + np.exp(-z))
w, b = np.array([0.5, 1.0]), -2.0
x, y = np.array([1.0, 3.0]), 0.0
z = x @ w + b                   # 1.5
y_hat = sigmoid(z)              # 0.818
loss = -np.log(1 - y_hat)       # 1.701
print(z, round(y_hat, 3), round(loss, 3))
error = y_hat - y               # 0.818
print(np.round(error * x, 3), round(error, 3))       # [0.818 2.453] and 0.818
print(np.round(w - 0.1 * error * x, 3), round(b - 0.1 * error, 3))
# new w = [0.418, 0.755], new b = -2.082
# boundary: 0.5 x1 + 1.0 x2 - 2 = 0, that is x2 = 2 - 0.5 x1
:::

## Common mistakes

- Mistake: you use squared error on the probability. Fix: use binary cross-entropy; its gradient is simpler and the loss is convex.
- Mistake: you compute $\\ln 0$ when $\\hat{y}$ rounds to 0 or 1. Fix: compute the loss from the logit with a numerically stable formula.
- Mistake: you forget the bias. Fix: without it the boundary must pass through the origin.
- Mistake: you expect a straight boundary to fit a ring-shaped class. Fix: add features or a hidden layer.

## Check your understanding

Answer each question before you open the explanation.

:::quiz
title: Check: logistic regression
q: What is sigmoid(0)?
- 0
* 0.5
- 1
why: 1 divided by (1 + e to the power 0) is 1 / 2.
q: What is the weight gradient for one example with prediction 0.2, label 1, and input [1, 2]?
- [0.8, 1.6]
* [-0.8, -1.6]
- [0.2, 0.4]
- [-0.2, -0.4]
why: The gradient is (prediction minus label) times the input: (0.2 - 1) times [1, 2].
q: Where is the decision boundary of logistic regression?
- Where the probability is 1
* Where the logit w dot x + b equals 0
- Where the loss is smallest
why: The probability is 0.5 exactly when the logit is 0, and that equation is a straight line.
q: A confident wrong prediction of 0.95 for a label of 0 has loss 3.0, and an unsure correct one has loss 0.69. What does this show about the loss?
- The loss is symmetric in the prediction
* The loss grows fast as the probability of the true label approaches 0
- The loss only counts mistakes
why: The negative log of 0.05 is much larger than the negative log of 0.5, so confident errors dominate the gradient.
q: Why can logistic regression not fit a ring-shaped class?
- Its learning rate is fixed
* Its boundary is a straight line or flat plane
- Its loss is convex
why: A ring needs a curved boundary, which requires new features or a hidden layer.
:::

## Go further

The Stanford CS229 notes derive logistic regression and its gradient in full. The StatQuest channel has a series on logistic regression with pictures. The scikit-learn documentation shows the model with regularisation options. The Deep Learning book's machine learning basics chapter places it among the other linear models.
`,
          links: [
            { label: 'Stanford CS229: Machine Learning', url: 'https://cs229.stanford.edu/', kind: 'course' },
            { label: 'StatQuest', url: 'https://www.youtube.com/@statquest', kind: 'video' },
            { label: 'scikit-learn linear models documentation', url: 'https://scikit-learn.org/stable/modules/linear_model.html', kind: 'docs' },
            { label: 'Deep Learning book, chapter 5: Machine Learning Basics', url: 'https://www.deeplearningbook.org/contents/ml.html', kind: 'article' },
          ],
        },
        {
          slug: 'softmax-regression',
          title: 'Softmax regression',
          summary: 'Softmax regression extends logistic regression to many classes, and its gradient is again prediction minus target.',
          minutes: 15,
          objectives: [
            'Compute softmax probabilities from a vector of logits by hand.',
            'Compute the cross-entropy loss for a one-hot target.',
            'Derive the gradient of the loss with respect to the logits.',
            'Explain why the output layer of a language model is softmax regression.',
          ],
          keyTerms: ['softmax', 'logit', 'cross-entropy', 'one-hot', 'output layer', 'vocabulary', 'log-sum-exp'],
          body: `
## What this lesson covers

This lesson explains softmax regression, the model for choosing one class among many. It computes one logit per class, turns the logits into probabilities with softmax, and trains with cross-entropy. You will compute the probabilities, the loss, and the gradient for a three-class example.

## Why it matters

The output layer of a language model is softmax regression over the vocabulary. The logits come from the final hidden state times an embedding matrix. The loss is cross-entropy against the next token. The gradient at the logits, prediction minus one-hot target, is the first step of every backward pass through a transformer.

:::video
id: KpKog-L9veg
why: Watch the whole video, 12 minutes. It computes softmax from three raw scores and explains why the outputs sum to one, which is the first step of the scenario in this lesson.
:::

## The idea with an example

A model classifies an image as cat, dog, or bird. It computes three logits: $z = [2.0, 1.0, 0.1]$. Softmax exponentiates each logit and divides by the sum:

| Class | Logit | $e^{z}$ | Probability |
| --- | --- | --- | --- |
| Cat | 2.0 | 7.39 | 0.66 |
| Dog | 1.0 | 2.72 | 0.24 |
| Bird | 0.1 | 1.11 | 0.10 |

The sum of the exponentials is 11.22, and each probability is the entry divided by that sum. The probabilities add to one.

The bars compare the three class probabilities.

:::bars
title: Softmax output for logits [2.0, 1.0, 0.1]
Cat: 0.66
Dog: 0.24
Bird: 0.10
:::

Suppose the true class is dog. The one-hot target is $y = [0, 1, 0]$. The cross-entropy loss is the negative log of the probability of the true class: $-\\ln 0.24 \\approx 1.43$.

The gradient with respect to the logits is the prediction minus the target: $[0.66, 0.24, 0.10] - [0, 1, 0] = [0.66, -0.76, 0.10]$. The gradient is positive for cat and bird, so a descent step lowers those logits. It is negative for dog, so a step raises that logit. The entries of the gradient sum to zero, because the probabilities and the target each sum to one.

The grid shows the probabilities, the one-hot target, and the logit gradient.

:::matrix
title: Probabilities, target, and gradient at the logits
cols: cat, dog, bird
probability p: 0.66, 0.24, 0.10
target y: 0, 1, 0
gradient p - y: 0.66, -0.76, 0.10
:::

Press Next to run the forward and backward pass by hand.

:::scenario
title: Forward and backward pass for logits [2.0, 1.0, 0.1] with true class dog
state: logits=[2.0 1.0 0.1]
step: Subtract the largest logit, 2.0, from every logit. The shifted logits are [0, -1, -1.9]. The probabilities do not change.
state: shifted=[0 -1 -1.9]
step: Exponentiate. e^0 = 1.00, e^-1 = 0.37, and e^-1.9 = 0.15. The sum is 1.52.
state: exponentials=[1.00 0.37 0.15], sum=1.52
step: Divide by the sum. The probabilities are [0.66, 0.24, 0.10].
state: p=[0.66 0.24 0.10]
step: Read the probability of the true class, dog, which is 0.24. The loss is -ln 0.24 = 1.43.
state: loss=1.43
step: Subtract the one-hot target [0, 1, 0] from p. The logit gradient is [0.66, -0.76, 0.10].
state: gradient=[0.66 -0.76 0.10]
:::

## How it works


:::anim
title: Forward and backward pass for logits [2.0, 1.0, 0.1] with true class dog
# Worked values and narration follow the scenario in this lesson.
text heading "Forward and backward pass for logits [2.0, 1.0, 0.1] with true|class dog" @ 480,48 size: 23 color: white
text legend "WORKED EXAMPLE · FOLLOW EACH CHANGE" @ 480,80 size: 13 color: grey
num scene = 1 @ 850,145 prefix: "Scene " size: 16 color: grey
dot cursor @ 100,145 r: 8 color: blue
dot mark0 @ 100,145 r: 3 color: grey
dot mark1 @ 220,145 r: 3 color: grey
dot mark2 @ 340,145 r: 3 color: grey
dot mark3 @ 460,145 r: 3 color: grey
dot mark4 @ 580,145 r: 3 color: grey
dot mark5 @ 700,145 r: 3 color: grey
rect card0 @ 180,255 size: 260x120 color: blue
text key0 "" @ 180,222 size: 16 color: grey
text value0 "" @ 180,267 size: 20 color: white
rect card1 @ 480,255 size: 260x120 color: blue
text key1 "" @ 480,222 size: 16 color: grey
text value1 "" @ 480,267 size: 20 color: white
rect card2 @ 780,255 size: 260x120 color: blue
text key2 "" @ 780,222 size: 16 color: grey
text value2 "" @ 780,267 size: 20 color: white
rect card3 @ 180,405 size: 260x120 color: blue
text key3 "" @ 180,372 size: 16 color: grey
text value3 "" @ 180,417 size: 20 color: white
rect card4 @ 480,405 size: 260x120 color: blue
text key4 "" @ 480,372 size: 16 color: grey
text value4 "" @ 480,417 size: 20 color: white
rect card5 @ 780,405 size: 260x120 color: blue
text key5 "" @ 780,372 size: 16 color: grey
text value5 "" @ 780,417 size: 20 color: white

step: Start with the example's initial values.
  show heading, legend, scene, cursor, mark0, mark1, mark2, mark3, mark4, mark5, card0, key0, value0, card1, key1, value1, card2, key2, value2, card3, key3, value3, card4, key4, value4, card5, key5, value5
  label key0 "logits"
  & label value0 "[2.0 1.0 0.1]"
  & highlight card0

step: Subtract the largest logit, 2.0, from every logit.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 220,145 (0.6s)
  & count scene -> 2 (0.6s)
  label key0 "shifted"
  & label value0 "[0 -1 -1.9]"
  & highlight card0
  label key1 "logits"
  & label value1 "[2.0 1.0 0.1]"

step: Exponentiate.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 340,145 (0.6s)
  & count scene -> 3 (0.6s)
  label key0 "exponentials"
  & label value0 "[1.00 0.37 0.15]"
  & highlight card0
  label key1 "sum"
  & label value1 "1.52"
  & highlight card1
  label key2 "shifted"
  & label value2 "[0 -1 -1.9]"
  label key3 "logits"
  & label value3 "[2.0 1.0 0.1]"

step: Divide by the sum.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 460,145 (0.6s)
  & count scene -> 4 (0.6s)
  label key0 "p"
  & label value0 "[0.66 0.24 0.10]"
  & highlight card0
  label key1 "exponentials"
  & label value1 "[1.00 0.37 0.15]"
  label key2 "sum"
  & label value2 "1.52"
  label key3 "shifted"
  & label value3 "[0 -1 -1.9]"
  label key4 "logits"
  & label value4 "[2.0 1.0 0.1]"

step: Read the probability of the true class, dog, which is 0.24.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 580,145 (0.6s)
  & count scene -> 5 (0.6s)
  label key0 "loss"
  & label value0 "1.43"
  & highlight card0
  label key1 "p"
  & label value1 "[0.66 0.24 0.10]"
  label key2 "exponentials"
  & label value2 "[1.00 0.37 0.15]"
  label key3 "sum"
  & label value3 "1.52"
  label key4 "shifted"
  & label value4 "[0 -1 -1.9]"
  label key5 "logits"
  & label value5 "[2.0 1.0 0.1]"

step: Subtract the one-hot target [0, 1, 0] from p.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 700,145 (0.6s)
  & count scene -> 6 (0.6s)
  label key0 "gradient"
  & label value0 "[0.66 -0.76 0.10]"
  & highlight card0
  label key1 "loss"
  & label value1 "1.43"
  label key2 "p"
  & label value2 "[0.66 0.24 0.10]"
  label key3 "exponentials"
  & label value3 "[1.00 0.37 0.15]"
  label key4 "sum"
  & label value4 "1.52"
  label key5 "shifted"
  & label value5 "[0 -1 -1.9]"
:::

For $K$ classes with logits $z_1, \\dots, z_K$, the softmax is:

$$p_k = \\frac{e^{z_k}}{\\sum_{j=1}^{K} e^{z_j}}$$

$p_k$ is the probability of class $k$. The denominator normalises the probabilities to sum to one. Logistic regression is the case $K = 2$ with one logit fixed at zero.

The logits come from a linear map, $z = W x + b$, where $W$ has one row per class. For a language model, $x$ is the final hidden state of width $d$ and $W$ is the output embedding matrix of shape $V \\times d$, with $V$ the vocabulary size.

The cross-entropy loss with a one-hot target $y$ is:

$$\\mathcal{L} = -\\sum_{k=1}^{K} y_k \\ln p_k = -\\ln p_{\\text{true}}$$

The gradient with respect to the logits is:

$$\\frac{\\partial \\mathcal{L}}{\\partial z_k} = p_k - y_k$$

The derivation uses the fact that $\\ln p_k = z_k - \\ln \\sum_j e^{z_j}$. The derivative of the second term with respect to $z_k$ is $p_k$. The weight gradient follows by the chain rule: $\\partial \\mathcal{L} / \\partial W = (p - y)\\, x^\\top$.

To compute one forward and backward pass by hand:

1. Compute the logits $z = W x + b$.
2. Subtract the largest logit from every logit. This does not change the probabilities and prevents overflow.
3. Exponentiate and normalise to get $p$.
4. Compute the loss $-\\ln p_{\\text{true}}$.
5. Compute the logit gradient $p - y$.
6. Compute the weight gradient $(p - y)\\, x^\\top$ and the bias gradient $p - y$.

Step 2 is the log-sum-exp trick. With logits near 1,000, $e^{1000}$ overflows, but $e^{1000 - 1000} = 1$ is fine.

For a vocabulary of 128,000 and a width of 4,096, the output layer has 524 million weights, and the softmax over the vocabulary is a large part of the compute at each step. Temperature divides the logits before softmax and controls how spread out the distribution is.

Note: the cross-entropy loss for softmax regression is convex in $W$. The logits are a linear function of $x$, and the loss is a convex function of the logits.

The program computes the lesson's example.

:::code
lang: python
file: softmax_regression.py
import numpy as np
import torch
import torch.nn.functional as F

z = np.array([2.0, 1.0, 0.1])
y = np.array([0.0, 1.0, 0.0])              # true class is dog

shifted = z - z.max()                      # log-sum-exp trick
p = np.exp(shifted) / np.exp(shifted).sum()
loss = -np.log(p[1])
grad = p - y
print("probabilities", np.round(p, 3))     # [0.659 0.242 0.099]
print("loss", round(loss, 3))              # 1.417
print("logit gradient", np.round(grad, 3), "sums to", round(grad.sum(), 6))

# PyTorch applies softmax inside the loss: feed it raw logits
logits = torch.tensor([[2.0, 1.0, 0.1]], requires_grad=True)
target = torch.tensor([1])
torch_loss = F.cross_entropy(logits, target)
torch_loss.backward()
print("torch loss", round(torch_loss.item(), 3))
print("torch gradient", logits.grad.numpy().round(3))
:::

## Try it

:::exercise
title: Forward and backward for a new set of logits
task: A model outputs logits [1, 2, 3] and the true class is the first one. Subtract the maximum logit, exponentiate, and normalise to get the three probabilities. Compute the cross-entropy loss. Compute the logit gradient p minus y and check that its entries sum to zero. Say which logit the descent step raises. Check with the NumPy code from the lesson.
hint: After subtracting 3 the logits are [-2, -1, 0] with exponentials 0.135, 0.368, and 1. The sum is 1.503.
lang: python
solution:
import numpy as np

z = np.array([1.0, 2.0, 3.0])
y = np.array([1.0, 0.0, 0.0])
shifted = z - z.max()
p = np.exp(shifted) / np.exp(shifted).sum()
print(np.round(p, 3))                 # [0.09 0.245 0.665]
print(round(-np.log(p[0]), 3))        # loss 2.408
grad = p - y
print(np.round(grad, 3), round(grad.sum(), 6))   # [-0.91 0.245 0.665], sum 0
# the first entry is negative, so a descent step raises the first logit
:::

## Common mistakes

- Mistake: you apply softmax twice. Fix: the loss function often includes softmax; feed it raw logits.
- Mistake: you exponentiate large logits and get infinity. Fix: subtract the maximum logit first.
- Mistake: you use a sigmoid per class and expect the probabilities to sum to one. Fix: sigmoid per class is for labels that can co-occur; softmax is for one class.
- Mistake: you store the full probability vector for every token in a long sequence. Fix: compute the loss in chunks when the vocabulary is large.

## Check your understanding

Answer each question before you open the explanation.

:::quiz
title: Check: softmax regression
q: What are the softmax probabilities of logits [0, 0, 0]?
- [1, 0, 0]
* One third each
- [0, 0, 0]
why: Equal logits give equal exponentials, and three equal values normalise to 1/3.
q: What is the logit gradient when p = [0.1, 0.8, 0.1] and the true class is the second?
- [0.1, 0.8, 0.1]
* [0.1, -0.2, 0.1]
- [-0.1, 0.2, -0.1]
- [0, 1, 0]
why: The gradient is p minus the one-hot target [0, 1, 0].
q: Why subtract the maximum logit before exponentiating?
- To make the probabilities sum to one
* To prevent overflow without changing the probabilities
- To make the largest probability exactly 1
why: Softmax is unchanged by a shift of all logits, and a shift of the maximum to 0 keeps every exponential at most 1.
q: What happens if you apply softmax to the logits and then pass the result to a loss that applies softmax again?
* The probabilities are squashed toward uniform and training is slowed
- Nothing; softmax is idempotent
- The loss becomes negative
why: Softmax of values between 0 and 1 gives nearly equal outputs, so the gradient signal shrinks.
q: An output layer maps a hidden state of width 4,096 to a vocabulary of 128,000. How many weights does the matrix have?
- 132,096
- 4,096 squared
* About 524 million
why: 128,000 times 4,096 is 524,288,000.
:::

## Go further

The CS231n notes on linear classification derive the softmax loss and compare it with the hinge loss. The Stanford CS229 notes cover the generalisation from logistic regression. The PyTorch documentation for the cross-entropy loss explains how it takes logits directly. Karpathy's channel builds the output layer of a language model from scratch.
`,
          links: [
            { label: 'CS231n: Linear Classification', url: 'https://cs231n.github.io/linear-classify/', kind: 'course' },
            { label: 'Stanford CS229: Machine Learning', url: 'https://cs229.stanford.edu/', kind: 'course' },
            { label: 'PyTorch torch.nn documentation', url: 'https://pytorch.org/docs/stable/nn.html', kind: 'docs' },
            { label: 'Andrej Karpathy', url: 'https://www.youtube.com/@AndrejKarpathy', kind: 'video' },
          ],
        },
        {
          slug: 'mlp',
          title: 'The multilayer perceptron',
          summary: 'A hidden layer with a nonlinearity lets a model draw a curved boundary, and stacking layers builds a deep network.',
          minutes: 16,
          objectives: [
            'Compute the forward pass of a one-hidden-layer network by hand.',
            'Explain why a network with no nonlinearity collapses to a linear model.',
            'Solve the exclusive-or (XOR) problem with two hidden units.',
            'Count the weights of a multilayer perceptron (MLP) from its layer sizes.',
          ],
          keyTerms: ['multilayer perceptron', 'hidden layer', 'nonlinearity', 'rectified linear unit', 'XOR', 'universal approximation', 'activation'],
          body: `
## What this lesson covers

This lesson explains the multilayer perceptron (MLP), a stack of linear layers with a nonlinearity between each pair. It shows why the nonlinearity is needed and solves the exclusive-or (XOR) problem, which no linear model can solve. You will trace a forward pass with small integer weights.

## Why it matters

The MLP is the feed-forward block inside every transformer layer and holds about two thirds of a language model's weights. The same structure appears in reward model heads, in value networks, and in the classifier on top of an embedding. Understanding one hidden layer is enough to read any architecture diagram.

:::video
id: aircAruvnKk
why: Watch the whole video, 19 minutes. It shows hidden units as feature detectors that switch on for parts of an input, which is what the two ReLU units do for the XOR problem in this lesson.
:::

## The idea with an example

The XOR problem has four inputs and labels:

| $x_1$ | $x_2$ | Label |
| --- | --- | --- |
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

The positive cases are $(0, 1)$ and $(1, 0)$. No straight line separates them from $(0, 0)$ and $(1, 1)$. Logistic regression fails on this data.

Add a hidden layer with two units and the rectified linear unit (ReLU), the function $\\mathrm{ReLU}(z) = \\max(0, z)$. Set the first hidden unit to $h_1 = \\mathrm{ReLU}(x_1 + x_2)$ and the second to $h_2 = \\mathrm{ReLU}(x_1 + x_2 - 1)$. Compute both for each input:

| Input | $h_1$ | $h_2$ | Output $h_1 - 2 h_2$ |
| --- | --- | --- | --- |
| (0, 0) | 0 | 0 | 0 |
| (0, 1) | 1 | 0 | 1 |
| (1, 0) | 1 | 0 | 1 |
| (1, 1) | 2 | 1 | 0 |

The output $h_1 - 2 h_2$ matches the labels exactly. The hidden unit $h_2$ switches on only when both inputs are on, and the output layer subtracts it. The ReLU is the key: without it, $h_2 = x_1 + x_2 - 1$ for all inputs, the output is a linear function of $x$, and the table cannot be matched.

The grid shows the hidden weight matrix W1 and the bias, one row per hidden unit.

:::matrix
title: Hidden weights W1 and bias b1 of the XOR network
cols: x1, x2, bias
h1: 1, 1, 0
h2: 1, 1, -1
:::

The diagram shows the forward pass for the input (1, 1).

:::flow
title: Forward pass of the XOR network for input (1, 1)
x1 = 1 -> h1: weight 1
x2 = 1 -> h1: weight 1
x1 = 1 -> h2: weight 1
x2 = 1 -> h2: weight 1, bias -1
h1 -> Output: h1 = 2, weight 1
h2 -> Output: h2 = 1, weight -2
:::

In the hidden space $(h_1, h_2)$, the four points become $(0, 0)$, $(1, 0)$, $(1, 0)$, and $(2, 1)$. A straight line separates them. The hidden layer moved the data into a space where a linear model works.

Press Next to trace the forward pass for each of the four inputs.

:::scenario
title: Forward pass of the XOR network
state: h1=ReLU(x1 + x2), h2=ReLU(x1 + x2 - 1), output=h1 - 2 h2
step: Input (0, 0). h1 = ReLU(0) = 0 and h2 = ReLU(-1) = 0. The output is 0.
state: input=(0 0), h1=0, h2=0, output=0
step: Input (0, 1). h1 = ReLU(1) = 1 and h2 = ReLU(0) = 0. The output is 1.
state: input=(0 1), h1=1, h2=0, output=1
step: Input (1, 0). The sums are the same as for (0, 1). The output is 1.
state: input=(1 0), h1=1, h2=0, output=1
step: Input (1, 1). h1 = ReLU(2) = 2 and h2 = ReLU(1) = 1. The output is 2 - 2 = 0.
state: input=(1 1), h1=2, h2=1, output=0
step: All four outputs match the labels. Without the ReLU, h2 would be -1 for input (0, 0) and the output would be 2, not 0.
:::

## How it works


:::anim
title: Forward pass of the XOR network
# Worked values and narration follow the scenario in this lesson.
text heading "Forward pass of the XOR network" @ 480,48 size: 23 color: white
text legend "WORKED EXAMPLE · FOLLOW EACH CHANGE" @ 480,80 size: 13 color: grey
num scene = 1 @ 850,145 prefix: "Scene " size: 16 color: grey
dot cursor @ 100,145 r: 8 color: blue
dot mark0 @ 100,145 r: 3 color: grey
dot mark1 @ 220,145 r: 3 color: grey
dot mark2 @ 340,145 r: 3 color: grey
dot mark3 @ 460,145 r: 3 color: grey
dot mark4 @ 580,145 r: 3 color: grey
dot mark5 @ 700,145 r: 3 color: grey
rect card0 @ 180,255 size: 260x120 color: blue
text key0 "" @ 180,222 size: 16 color: grey
text value0 "" @ 180,267 size: 20 color: white
rect card1 @ 480,255 size: 260x120 color: blue
text key1 "" @ 480,222 size: 16 color: grey
text value1 "" @ 480,267 size: 20 color: white
rect card2 @ 780,255 size: 260x120 color: blue
text key2 "" @ 780,222 size: 16 color: grey
text value2 "" @ 780,267 size: 20 color: white
rect card3 @ 180,405 size: 260x120 color: blue
text key3 "" @ 180,372 size: 16 color: grey
text value3 "" @ 180,417 size: 20 color: white

step: Start with the example's initial values.
  show heading, legend, scene, cursor, mark0, mark1, mark2, mark3, mark4, mark5, card0, key0, value0, card1, key1, value1, card2, key2, value2, card3, key3, value3
  label key0 "h1"
  & label value0 "ReLU(x1 + x2)"
  & highlight card0
  label key1 "h2"
  & label value1 "ReLU(x1 + x2 - 1)"
  & highlight card1
  label key2 "output"
  & label value2 "h1 - 2 h2"
  & highlight card2

step: Input (0, 0).
  restore card0, card1, card2, card3
  move cursor -> 220,145 (0.6s)
  & count scene -> 2 (0.6s)
  label key0 "input"
  & label value0 "(0 0)"
  & highlight card0
  label key1 "h1"
  & label value1 "0"
  & highlight card1
  label key2 "h2"
  & label value2 "0"
  & highlight card2
  label key3 "output"
  & label value3 "0"
  & highlight card3

step: Input (0, 1).
  restore card0, card1, card2, card3
  move cursor -> 340,145 (0.6s)
  & count scene -> 3 (0.6s)
  label key0 "input"
  & label value0 "(0 1)"
  & highlight card0
  label key1 "h1"
  & label value1 "1"
  & highlight card1
  label key2 "h2"
  & label value2 "0"
  label key3 "output"
  & label value3 "1"
  & highlight card3

step: Input (1, 0).
  restore card0, card1, card2, card3
  move cursor -> 460,145 (0.6s)
  & count scene -> 4 (0.6s)
  label key0 "input"
  & label value0 "(1 0)"
  & highlight card0
  label key1 "h1"
  & label value1 "1"
  label key2 "h2"
  & label value2 "0"
  label key3 "output"
  & label value3 "1"

step: Input (1, 1).
  restore card0, card1, card2, card3
  move cursor -> 580,145 (0.6s)
  & count scene -> 5 (0.6s)
  label key0 "input"
  & label value0 "(1 1)"
  & highlight card0
  label key1 "h1"
  & label value1 "2"
  & highlight card1
  label key2 "h2"
  & label value2 "1"
  & highlight card2
  label key3 "output"
  & label value3 "0"
  & highlight card3

step: All four outputs match the labels.
  restore card0, card1, card2, card3
  move cursor -> 700,145 (0.6s)
  & count scene -> 6 (0.6s)
  label key0 "input"
  & label value0 "(1 1)"
  label key1 "h1"
  & label value1 "2"
  label key2 "h2"
  & label value2 "1"
  label key3 "output"
  & label value3 "0"
:::

A one-hidden-layer MLP computes:

$$h = \\phi(W_1 x + b_1), \\qquad \\hat{y} = W_2 h + b_2$$

$x$ is the input of width $n$. $W_1$ has shape $m \\times n$ and $b_1$ has width $m$, where $m$ is the hidden width. $\\phi$ is the nonlinearity, applied to each entry. $W_2$ has shape $k \\times m$ for $k$ outputs. The output feeds a sigmoid, a softmax, or nothing, depending on the task.

Without $\\phi$, the model is $W_2 (W_1 x + b_1) + b_2 = (W_2 W_1) x + (W_2 b_1 + b_2)$, a single linear map. Depth adds nothing. With $\\phi$, each hidden unit is a feature that switches on over a half-space, and the output combines these features into a boundary made of flat pieces. More hidden units give more pieces. The universal approximation theorem says that one hidden layer of enough width can approximate any continuous function on a bounded region.

Common choices for $\\phi$:

| Function | Formula | Derivative |
| --- | --- | --- |
| ReLU | $\\max(0, z)$ | 1 if $z > 0$, else 0 |
| Sigmoid | $1 / (1 + e^{-z})$ | $\\sigma(z)(1 - \\sigma(z))$ |
| GELU | $z\\, \\Phi(z)$ with $\\Phi$ the Gaussian cumulative function | smooth, near 1 for large $z$ |

To count the weights:

1. For each layer, multiply the input width by the output width and add the output width for the bias.
2. Sum over the layers.

A network with widths 4096, 16384, and 4096, the shape of a transformer feed-forward block, has $4096 \\times 16384 + 16384 + 16384 \\times 4096 + 4096 \\approx 134$ million weights.

The bars compare the weight count of each part of the block.

:::bars
title: Weights in a 4096 to 16384 to 4096 feed-forward block
W1 (4096 by 16384): 67108864
W2 (16384 by 4096): 67108864
Both biases: 20480
:::

Note: the transformer feed-forward block applies this MLP to each token separately. Tokens mix only in attention.

The program computes the lesson's example.

:::code
lang: python
file: xor_mlp.py
import numpy as np

def relu(z):
    return np.maximum(0, z)

W1 = np.array([[1.0, 1.0],
               [1.0, 1.0]])
b1 = np.array([0.0, -1.0])
W2 = np.array([[1.0, -2.0]])
b2 = np.array([0.0])

X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]], dtype=float)
labels = np.array([0, 1, 1, 0])

h = relu(X @ W1.T + b1)              # hidden activations, one row per input
out = h @ W2.T + b2
for x, hh, o, lab in zip(X, h, out, labels):
    print("input", x, "hidden", hh, "output", o[0], "label", lab)

# without the ReLU the stack collapses to one linear map
linear_out = (X @ W1.T + b1) @ W2.T + b2
print("no nonlinearity:", linear_out.ravel())        # [2 1 1 0]: wrong for (0, 0)

# count the weights of a 4096 -> 16384 -> 4096 block
print("weights:", 4096 * 16384 + 16384 + 16384 * 4096 + 4096)
:::

## Try it

:::exercise
title: Make the same hidden layer compute NOT XOR
task: Keep the hidden layer of the lesson: h1 = ReLU(x1 + x2) and h2 = ReLU(x1 + x2 - 1). Choose new output weights and an output bias so the network outputs 1 for (0, 0) and (1, 1) and 0 for (0, 1) and (1, 0). Write the output for all four inputs in a table. Then count the weights of this network, including biases. Check with the NumPy code from the lesson.
hint: The lesson's output h1 minus 2 h2 gives XOR. You want 1 minus XOR. A bias in the output layer is allowed.
lang: python
solution:
import numpy as np

relu = lambda z: np.maximum(0, z)
W1 = np.array([[1.0, 1.0], [1.0, 1.0]])
b1 = np.array([0.0, -1.0])
W2 = np.array([[-1.0, 2.0]])      # minus the XOR output
b2 = np.array([1.0])              # plus one
X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]], dtype=float)
h = relu(X @ W1.T + b1)
print((h @ W2.T + b2).ravel())    # [1 0 0 1]
# weights: hidden 2 * 2 + 2 = 6, output 2 * 1 + 1 = 3, total 9
:::

## Common mistakes

- Mistake: you stack three linear layers with no nonlinearity. Fix: add $\\phi$ after each hidden layer.
- Mistake: you apply the nonlinearity to the final output before a softmax loss. Fix: feed raw logits to the loss.
- Mistake: you initialise all weights to the same value. Fix: hidden units with equal weights stay equal; use random initialisation.
- Mistake: you use a sigmoid in a deep stack and the early layers do not train. Fix: use ReLU or GELU to keep the gradient alive.

## Check your understanding

Answer each question before you open the explanation.

:::quiz
title: Check: the multilayer perceptron
q: What does a network with no nonlinearity compute?
- A curved boundary
* A single linear map
- A lookup table
why: The product of the weight matrices is one matrix, so the stack is one linear layer.
q: In the XOR solution, which hidden unit switches on only when both inputs are on?
- h1 = ReLU(x1 + x2)
* h2 = ReLU(x1 + x2 - 1)
- Both units
why: h2 has bias -1, so its pre-activation is positive only when x1 + x2 is at least 2.
q: How many weights does a layer from 10 inputs to 5 outputs have, including the bias?
- 50
* 55
- 15
- 60
why: The matrix has 10 times 5 = 50 entries and the bias adds 5.
q: Every hidden unit of a layer is initialised with the same weights. What happens during training?
- The layer trains faster
* The units stay identical, so the layer acts as one unit
- The gradient is zero
why: Identical units receive identical gradients and never separate; random initialisation breaks the symmetry.
q: For input (1, 1), the lesson's hidden layer gives h = [2, 1]. What is the output h1 minus 2 h2?
- 2
- 1
* 0
why: 2 minus 2 times 1 is 0, which matches the XOR label for (1, 1).
:::

## Go further

The CS231n notes on neural networks cover the architecture and the activation functions. Nielsen's online book builds the MLP from the perceptron with a visual proof of universal approximation. The 3Blue1Brown channel has a four-part series on a small MLP. The Kaiming initialisation paper explains how to scale the initial weights for ReLU.
`,
          links: [
            { label: 'CS231n: Neural Networks Part 1', url: 'https://cs231n.github.io/neural-networks-1/', kind: 'course' },
            { label: 'Neural Networks and Deep Learning (Nielsen)', url: 'http://neuralnetworksanddeeplearning.com/', kind: 'article' },
            { label: '3Blue1Brown', url: 'https://www.youtube.com/@3blue1brown', kind: 'video' },
            { label: 'Delving Deep into Rectifiers (He et al., 2015)', url: 'https://arxiv.org/abs/1502.01852', kind: 'paper' },
          ],
        },
        {
          slug: 'backprop-by-hand',
          title: 'Backpropagation by hand',
          summary: 'A full backward pass through a one-hidden-layer network, one number at a time, from the loss to every weight.',
          minutes: 20,
          objectives: [
            'Run a complete forward pass through a two-input, two-hidden-unit, one-output network.',
            'Compute the gradient of the loss with respect to every weight and bias.',
            'Apply the ReLU gradient rule at the hidden layer.',
            'Check a hand-computed gradient with a finite difference.',
          ],
          keyTerms: ['backpropagation', 'forward pass', 'backward pass', 'chain rule', 'ReLU', 'finite difference', 'gradient check'],
          body: `
## What this lesson covers

This lesson runs backpropagation on a tiny network with every number written out. The network has two inputs, two hidden units with ReLU, one sigmoid output, and binary cross-entropy loss. You will compute the forward pass, then the gradient of every weight, then check one gradient with a finite difference.

## Why it matters

Automatic differentiation libraries hide the backward pass. When training fails, you need to know what the library computes. A gradient check with finite differences is the standard way to test a custom layer. Doing the pass once by hand makes every later debugging session shorter.

:::video
id: tIeHLnjs5U8
why: Watch the whole video, 10 minutes. It derives the gradient for one weight through a sigmoid and a cost, which is the output layer of the network in this lesson. Pause and match each factor with a step of the backward pass here.
:::

## The idea with an example

The network and its weights:

- Input $x = [1, 2]$, label $y = 1$.
- Hidden layer: $W_1 = \\begin{pmatrix} 1 & -1 \\\\ 0 & 1 \\end{pmatrix}$, $b_1 = [0, -1]$, nonlinearity ReLU.
- Output layer: $w_2 = [2, -1]$, $b_2 = 0$, nonlinearity sigmoid.

Forward pass, step by step:

1. Hidden pre-activation: $z_1 = W_1 x + b_1 = [1 - 2 + 0,\\ 0 + 2 - 1] = [-1, 1]$.
2. Hidden activation: $h = \\mathrm{ReLU}(z_1) = [0, 1]$.
3. Output logit: $z_2 = w_2 \\cdot h + b_2 = 0 - 1 + 0 = -1$.
4. Prediction: $\\hat{y} = \\sigma(-1) \\approx 0.269$.
5. Loss: $\\mathcal{L} = -\\ln 0.269 \\approx 1.313$.

The diagram shows the computation graph with the forward values.

:::flow
title: Computation graph of the tiny network
x = [1, 2] -> z1: W1 x + b1 = [-1, 1]
z1 -> h: ReLU gives [0, 1]
h -> z2: w2 dot h + b2 = -1
z2 -> y hat: sigmoid gives 0.269
y hat -> Loss: -ln 0.269 = 1.313
:::

Backward pass, from the loss toward the input:

1. Gradient at the logit: $\\bar{z}_2 = \\hat{y} - y = 0.269 - 1 = -0.731$.
2. Output weight gradient: $\\bar{w}_2 = \\bar{z}_2\\, h = -0.731 \\times [0, 1] = [0, -0.731]$. Bias gradient: $\\bar{b}_2 = -0.731$.
3. Gradient at the hidden activation: $\\bar{h} = \\bar{z}_2\\, w_2 = -0.731 \\times [2, -1] = [-1.462, 0.731]$.
4. Gradient at the hidden pre-activation: multiply by the ReLU derivative, which is 1 where $z_1 > 0$ and 0 elsewhere. $z_1 = [-1, 1]$, so the mask is $[0, 1]$. $\\bar{z}_1 = [0, 0.731]$.
5. Hidden weight gradient: $\\bar{W}_1 = \\bar{z}_1\\, x^\\top$. Row 1 is $0 \\times [1, 2] = [0, 0]$. Row 2 is $0.731 \\times [1, 2] = [0.731, 1.462]$. Bias gradient: $\\bar{b}_1 = [0, 0.731]$.

The first hidden unit was off, so it receives no gradient and its weights do not change this step. The second unit was on, and its gradient is positive, so a descent step lowers its weights. That lowers $h_2$, which raises the logit through the negative weight $-1$, which raises $\\hat{y}$ toward the label 1.

Press Next to follow the gradient through each layer.

:::scenario
title: Backward pass with every number
state: y hat=0.269, y=1, h=[0 1], z1=[-1 1]
step: Start at the logit. The gradient is y hat minus y, which is -0.731.
state: z2 bar=-0.731
step: Compute the output weight gradient as z2 bar times h, which is [0, -0.731]. The bias gradient is -0.731.
state: w2 bar=[0 -0.731], b2 bar=-0.731
step: Pass the gradient to the hidden activation. h bar is z2 bar times w2, which is [-1.462, 0.731].
state: h bar=[-1.462 0.731]
step: Apply the ReLU mask [0, 1] from z1. z1 bar is [0, 0.731].
state: mask=[0 1], z1 bar=[0 0.731]
step: Compute the hidden weight gradient as z1 bar times x transpose. Row 1 is [0, 0] and row 2 is [0.731, 1.462]. The bias gradient is [0, 0.731].
state: W1 bar=[0 0; 0.731 1.462], b1 bar=[0 0.731]
:::

The grid shows the gradient of W1 with the zero row of the unit that was off.

:::matrix
title: Gradient of the hidden weights W1
cols: x1, x2
unit 1 (off): 0, 0
unit 2 (on): 0.731, 1.462
:::

The bars compare the gradient size of each weight in the network.

:::bars
title: Gradient size per weight
W1 row 1 (both entries): 0
W1[2, 1]: 0.731
W1[2, 2]: 1.462
b1[2]: 0.731
w2[2]: 0.731
b2: 0.731
:::

## How it works


:::anim
title: Backward pass with every number
# Worked values and narration follow the scenario in this lesson.
text heading "Backward pass with every number" @ 480,48 size: 23 color: white
text legend "WORKED EXAMPLE · FOLLOW EACH CHANGE" @ 480,80 size: 13 color: grey
num scene = 1 @ 850,145 prefix: "Scene " size: 16 color: grey
dot cursor @ 100,145 r: 8 color: blue
dot mark0 @ 100,145 r: 3 color: grey
dot mark1 @ 220,145 r: 3 color: grey
dot mark2 @ 340,145 r: 3 color: grey
dot mark3 @ 460,145 r: 3 color: grey
dot mark4 @ 580,145 r: 3 color: grey
dot mark5 @ 700,145 r: 3 color: grey
rect card0 @ 180,255 size: 260x120 color: blue
text key0 "" @ 180,222 size: 16 color: grey
text value0 "" @ 180,267 size: 20 color: white
rect card1 @ 480,255 size: 260x120 color: blue
text key1 "" @ 480,222 size: 16 color: grey
text value1 "" @ 480,267 size: 20 color: white
rect card2 @ 780,255 size: 260x120 color: blue
text key2 "" @ 780,222 size: 16 color: grey
text value2 "" @ 780,267 size: 20 color: white
rect card3 @ 180,405 size: 260x120 color: blue
text key3 "" @ 180,372 size: 16 color: grey
text value3 "" @ 180,417 size: 20 color: white
rect card4 @ 480,405 size: 260x120 color: blue
text key4 "" @ 480,372 size: 16 color: grey
text value4 "" @ 480,417 size: 20 color: white
rect card5 @ 780,405 size: 260x120 color: blue
text key5 "" @ 780,372 size: 16 color: grey
text value5 "" @ 780,417 size: 20 color: white

step: Start with the example's initial values.
  show heading, legend, scene, cursor, mark0, mark1, mark2, mark3, mark4, mark5, card0, key0, value0, card1, key1, value1, card2, key2, value2, card3, key3, value3, card4, key4, value4, card5, key5, value5
  label key0 "y hat"
  & label value0 "0.269"
  & highlight card0
  label key1 "y"
  & label value1 "1"
  & highlight card1
  label key2 "h"
  & label value2 "[0 1]"
  & highlight card2
  label key3 "z1"
  & label value3 "[-1 1]"
  & highlight card3

step: Start at the logit.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 220,145 (0.6s)
  & count scene -> 2 (0.6s)
  label key0 "z2 bar"
  & label value0 "-0.731"
  & highlight card0
  label key1 "y hat"
  & label value1 "0.269"
  label key2 "y"
  & label value2 "1"
  label key3 "h"
  & label value3 "[0 1]"
  label key4 "z1"
  & label value4 "[-1 1]"

step: Compute the output weight gradient as z2 bar times h, which is [0, -0.731].
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 340,145 (0.6s)
  & count scene -> 3 (0.6s)
  label key0 "w2 bar"
  & label value0 "[0 -0.731]"
  & highlight card0
  label key1 "b2 bar"
  & label value1 "-0.731"
  & highlight card1
  label key2 "z2 bar"
  & label value2 "-0.731"
  label key3 "y hat"
  & label value3 "0.269"
  label key4 "y"
  & label value4 "1"
  label key5 "h"
  & label value5 "[0 1]"

step: Pass the gradient to the hidden activation.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 460,145 (0.6s)
  & count scene -> 4 (0.6s)
  label key0 "h bar"
  & label value0 "[-1.462 0.731]"
  & highlight card0
  label key1 "w2 bar"
  & label value1 "[0 -0.731]"
  label key2 "b2 bar"
  & label value2 "-0.731"
  label key3 "z2 bar"
  & label value3 "-0.731"
  label key4 "y hat"
  & label value4 "0.269"
  label key5 "y"
  & label value5 "1"

step: Apply the ReLU mask [0, 1] from z1.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 580,145 (0.6s)
  & count scene -> 5 (0.6s)
  label key0 "mask"
  & label value0 "[0 1]"
  & highlight card0
  label key1 "z1 bar"
  & label value1 "[0 0.731]"
  & highlight card1
  label key2 "h bar"
  & label value2 "[-1.462 0.731]"
  label key3 "w2 bar"
  & label value3 "[0 -0.731]"
  label key4 "b2 bar"
  & label value4 "-0.731"
  label key5 "z2 bar"
  & label value5 "-0.731"

step: Compute the hidden weight gradient as z1 bar times x transpose.
  restore card0, card1, card2, card3, card4, card5
  move cursor -> 700,145 (0.6s)
  & count scene -> 6 (0.6s)
  label key0 "W1 bar"
  & label value0 "[0 0; 0.731 1.462]"
  & highlight card0
  label key1 "b1 bar"
  & label value1 "[0 0.731]"
  & highlight card1
  label key2 "mask"
  & label value2 "[0 1]"
  label key3 "z1 bar"
  & label value3 "[0 0.731]"
  label key4 "h bar"
  & label value4 "[-1.462 0.731]"
  label key5 "w2 bar"
  & label value5 "[0 -0.731]"
:::

The backward pass applies two rules at each layer:

$$\\bar{x} = W^\\top \\bar{z}, \\qquad \\bar{W} = \\bar{z}\\, x^\\top, \\qquad \\bar{b} = \\bar{z}$$

$\\bar{z}$ is the gradient of the loss at the layer's pre-activation. $x$ is the layer's input. $\\bar{x}$ is the gradient passed down. For a nonlinearity $\\phi$ between layers, $\\bar{z} = \\bar{h} \\odot \\phi'(z)$, where $\\odot$ multiplies entry by entry.

The full procedure:

1. Run the forward pass. Store every pre-activation and activation.
2. Compute the gradient at the output logit. For sigmoid with cross-entropy and for softmax with cross-entropy, it is $\\hat{y} - y$.
3. For each layer from last to first: compute the weight and bias gradients from $\\bar{z}$ and the stored input, then compute $\\bar{x} = W^\\top \\bar{z}$, then multiply by the derivative of the nonlinearity below.
4. Update every weight with the optimiser.

To check a gradient with a finite difference:

1. Pick one weight, say $W_1[2, 1] = 0$, whose computed gradient is 0.731.
2. Add a small $\\epsilon = 10^{-4}$ to it and recompute the loss. With $W_1[2, 1] = 0.0001$, $z_1[2] = 1.0001$, $h_2 = 1.0001$, $z_2 = -1.0001$, and the loss rises to about $1.313334$.
3. Subtract $\\epsilon$ and recompute. The loss falls to about $1.313187$.
4. The estimate is $(1.313334 - 1.313187) / (2 \\times 10^{-4}) \\approx 0.73$.

The table compares the hand-computed gradient with the finite-difference estimate.

| Weight | Hand gradient | Loss at plus epsilon | Loss at minus epsilon | Estimate |
| --- | --- | --- | --- | --- |
| W1[2, 1] | 0.731 | 1.313334 | 1.313187 | 0.73 |

The estimate matches the hand-computed gradient. Run this check on every new layer you write.

Caution: use the centred difference with both plus and minus $\\epsilon$. The one-sided version has an error proportional to $\\epsilon$, and the centred version has an error proportional to $\\epsilon^2$.

The program computes the lesson's example.

:::code
lang: python
file: backprop_by_hand.py
import numpy as np

def forward(W1, b1, w2, b2, x, y):
    z1 = W1 @ x + b1
    h = np.maximum(0, z1)
    z2 = w2 @ h + b2
    y_hat = 1 / (1 + np.exp(-z2))
    loss = -(y * np.log(y_hat) + (1 - y) * np.log(1 - y_hat))
    return z1, h, z2, y_hat, loss

W1 = np.array([[1.0, -1.0], [0.0, 1.0]]); b1 = np.array([0.0, -1.0])
w2 = np.array([2.0, -1.0]); b2 = 0.0
x = np.array([1.0, 2.0]); y = 1.0

z1, h, z2, y_hat, loss = forward(W1, b1, w2, b2, x, y)
print("z1", z1, "h", h, "z2", z2, "y_hat", round(y_hat, 3), "loss", round(loss, 3))

z2_bar = y_hat - y                       # -0.731
w2_bar = z2_bar * h                      # [0 -0.731]
h_bar = z2_bar * w2                      # [-1.462 0.731]
z1_bar = h_bar * (z1 > 0)                # ReLU mask [0 1]
W1_bar = np.outer(z1_bar, x)             # [[0 0] [0.731 1.462]]
print("W1 gradient:")
print(np.round(W1_bar, 3))
print("b1", np.round(z1_bar, 3), "w2", np.round(w2_bar, 3), "b2", round(z2_bar, 3))

# finite-difference check on W1[1, 0]
eps = 1e-4
Wp = W1.copy(); Wp[1, 0] += eps
Wm = W1.copy(); Wm[1, 0] -= eps
estimate = (forward(Wp, b1, w2, b2, x, y)[4] - forward(Wm, b1, w2, b2, x, y)[4]) / (2 * eps)
print("hand", round(W1_bar[1, 0], 4), "finite difference", round(estimate, 4))
:::

## Try it

:::exercise
title: Redo the backward pass with the other label
task: Keep every weight and the input x = [1, 2] from the lesson, but change the label to y = 0. The forward pass does not change, so y hat is still 0.269. Compute the gradient at the logit, then the gradients of w2, b2, h, z1, W1, and b1. State in one sentence which direction the second hidden unit's weights move now and why. Check one entry of the W1 gradient with a centred finite difference using the forward function from the lesson.
hint: The only change is the first step: z2 bar is now 0.269 minus 0 = +0.269. Every later number flips sign.
lang: python
solution:
import numpy as np

W1 = np.array([[1.0, -1.0], [0.0, 1.0]]); b1 = np.array([0.0, -1.0])
w2 = np.array([2.0, -1.0]); x = np.array([1.0, 2.0])
z1 = W1 @ x + b1; h = np.maximum(0, z1)        # [-1 1], [0 1]
y_hat = 0.269; y = 0.0
z2_bar = y_hat - y                              # 0.269
w2_bar = z2_bar * h                             # [0 0.269]
b2_bar = z2_bar                                 # 0.269
h_bar = z2_bar * w2                             # [0.538 -0.269]
z1_bar = h_bar * (z1 > 0)                       # [0 -0.269]
W1_bar = np.outer(z1_bar, x)                    # [[0 0] [-0.269 -0.538]]
b1_bar = z1_bar                                 # [0 -0.269]
print(np.round(W1_bar, 3), np.round(b1_bar, 3), np.round(w2_bar, 3), round(b2_bar, 3))
# The second unit's weights now rise (negative gradient), which raises h2,
# lowers the logit through the weight -1, and pushes y hat toward the label 0.
:::

## Common mistakes

- Mistake: you forget the ReLU mask. Fix: gradient flows only through units with positive pre-activation.
- Mistake: you use the activation instead of the pre-activation for the mask. Fix: the mask is $z > 0$; for ReLU they agree, but for other functions they do not.
- Mistake: you compute $\\bar{W}$ as $x\\, \\bar{z}^\\top$ and get a transposed shape. Fix: $\\bar{W}$ must have the shape of $W$.
- Mistake: you set $\\epsilon$ to $10^{-10}$ in the finite difference. Fix: rounding error dominates; use $10^{-4}$ to $10^{-6}$ in 64-bit.

## Check your understanding

Answer each question before you open the explanation.

:::quiz
title: Check: backpropagation by hand
q: What is the gradient at the logit for a sigmoid output with cross-entropy loss?
- y hat times (1 minus y hat)
* y hat minus y
- minus ln y hat
why: The sigmoid derivative cancels against the loss derivative, leaving prediction minus label.
q: Why does the first hidden unit get zero gradient in the example?
- Its weights are zero
* Its pre-activation is negative, so the ReLU mask is 0
- It is not connected to the output
why: The ReLU derivative is 0 for negative inputs, so nothing flows back through that unit.
q: h bar is [-1.462, 0.731] and z1 is [-1, 1]. What is z1 bar?
- [-1.462, 0.731]
* [0, 0.731]
- [-1.462, 0]
- [0, 0]
why: The ReLU mask from z1 is [0, 1], and multiplying entry by entry zeroes the first component.
q: The centred finite difference uses epsilon = 0.0001. How does its error scale?
- Proportional to epsilon
* Proportional to epsilon squared
- It has no error
why: The centred formula cancels the first-order error term, leaving an error of order epsilon squared.
q: You compute W bar as x times z bar transpose and get a matrix of the wrong shape. What is the correct formula?
* z bar times x transpose, which has the shape of W
- x transpose times z bar
- W transpose times z bar
why: The gradient of a weight matrix must have the same shape as the matrix, and z bar outer x gives rows for outputs and columns for inputs.
:::

## Go further

Nielsen's chapter 2 derives the four backpropagation equations with the same notation. Karpathy's post on understanding backprop lists the failure modes you can only see by hand. The CS231n notes on backpropagation include a worked example with a computational graph. The micrograd repository implements all of this in 100 lines you can step through.
`,
          links: [
            { label: 'Neural Networks and Deep Learning, chapter 2 (Nielsen)', url: 'http://neuralnetworksanddeeplearning.com/chap2.html', kind: 'article' },
            { label: 'Yes you should understand backprop (Karpathy)', url: 'https://karpathy.medium.com/yes-you-should-understand-backprop-e2f06eab496b', kind: 'article' },
            { label: 'CS231n: Backpropagation', url: 'https://cs231n.github.io/optimization-2/', kind: 'course' },
            { label: 'micrograd', url: 'https://github.com/karpathy/micrograd', kind: 'repo' },
          ],
        },
      ],
    },
  ],
}
