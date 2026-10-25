import type { Module } from '../../types'

export const mod: Module = {
  slug: 'neural-networks',
  title: 'Neural networks',
  description: 'One neuron, then a 2-2-1 network computed by hand: forward pass, loss, one gradient step, backpropagation, and the same network trained in PyTorch.',
  level: 'beginner',
  lessons: [
    {
      slug: 'a-neuron',
      title: 'A neuron',
      summary: 'After this lesson you can compute the output of one neuron by hand from its inputs, weights, bias and activation function.',
      minutes: 20,
      objectives: [
        'Explain what the weights and the bias of a neuron do, with a scoring-sheet analogy.',
        'Compute the weighted sum of a neuron by hand for two inputs.',
        'Compute ReLU and sigmoid for a given number and say when each is used.',
        'Write a Python function that computes one neuron.',
      ],
      keyTerms: ['neuron', 'weight', 'bias', 'weighted-sum', 'activation-function', 'relu', 'sigmoid'],
      body: `
## What this lesson covers

This lesson explains the smallest part of a neural network, the neuron. A neuron takes some numbers in, multiplies each one by a weight, adds a bias, and applies a fixed rule called an activation function. You compute one neuron by hand with real numbers, then you write it in 6 lines of Python. At the end you can look at any neuron, with any weights, and say what number comes out.

## Why it matters

Every model in the rest of this site is made of neurons. A large language model has billions of them, but each one does the same small calculation you learn here. If you can compute one neuron by hand, you can read any network diagram and know what the boxes do. This module carries one small network through five lessons. This lesson builds its first neuron. The next lesson, [Layers and the forward pass](/courses/ai-foundations/neural-networks/layers-and-forward-pass), connects 3 neurons into that network.

:::video
id: CqOfi41LfDw
why: Watch the first 8 minutes. StatQuest draws a neuron as a box with weights on its input lines and a bias inside. Notice that the drawing is the same formula as this lesson, with different numbers.
:::

## The idea with an example

> **Analogy.** A neuron is a judge with a scoring sheet. Each contestant shows two things, say a dance and a song. The judge thinks the dance matters twice as much as the song, so the dance score counts with weight 1 and the song score with weight 0.5. The judge is also strict and takes 1 point off every total: that is the bias. Finally, the judge never gives a negative score; anything below 0 becomes 0. That last rule is the activation function.

A neuron is a small formula with three kinds of numbers. The inputs are the numbers that come in. The weights are the numbers the neuron multiplies each input by. The bias is one extra number the neuron adds at the end. The neuron adds up all the products and the bias to get a weighted sum. Then it applies an activation function to that sum, and the result is the output of the neuron.

Here is the running example for the whole module. The task is: given two numbers, output half of the larger one. For the input numbers 1 and 2, the larger is 2, so the right answer is 1. We call the two inputs $x_1 = 1$ and $x_2 = 2$. Our first neuron has weight $w_1 = 1$ for the first input, weight $w_2 = 0.5$ for the second input, and bias $b = -1$. These three numbers stay fixed in every lesson of this module, so you can always check your work against them.

The neuron computes its weighted sum $z$ in three small steps.

1. Multiply the first input by its weight: 1 times 1 is 1.
2. Multiply the second input by its weight: 0.5 times 2 is 1.
3. Add the products and the bias: 1 plus 1 minus 1 is 1.

So the weighted sum is $z = 1$. The activation function we use here is ReLU, which stands for rectified linear unit. ReLU keeps a positive number as it is and turns a negative number into 0. Because 1 is positive, ReLU leaves it alone. The output of the neuron is 1. The diagram shows the path of the two inputs through the neuron.

:::flow
title: One neuron with inputs 1 and 2
Input x1 = 1 -> Weighted sum: times weight 1
Input x2 = 2 -> Weighted sum: times weight 0.5
Bias = -1 -> Weighted sum: added once
Weighted sum -> ReLU: z = 1
ReLU -> Output: 1
:::

Press Next to follow the arithmetic one step at a time. The panel shows the running total.

:::scenario
title: The neuron computes its output
state: x1=1, x2=2, w1=1, w2=0.5, b=-1, z=?
step: Multiply the first input by the first weight. 1 times 1 is 1.
state: product1=1
step: Multiply the second input by the second weight. 0.5 times 2 is 1.
state: product2=1
step: Add the two products. 1 plus 1 is 2.
state: sum=2
step: Add the bias. 2 plus -1 is 1. This is the weighted sum z.
state: z=1
step: Apply ReLU. 1 is positive, so the output stays 1.
state: output=1
:::

Now change one input and watch the neuron react. Keep the same weights and bias but use the inputs 2 and 1. The products are 2 and 0.5, the sum is 2.5, and with the bias the weighted sum is 1.5. ReLU keeps 1.5. Now use the inputs 0 and 1. The products are 0 and 0.5, and with the bias the weighted sum is -0.5. ReLU turns -0.5 into 0, so the neuron outputs 0. The neuron is silent for that input. This on-or-off behaviour is what the word activation means.

## How it works

Every neuron, in every network, computes the same two formulas. First the weighted sum:

$$z = w_1 x_1 + w_2 x_2 + b$$

In words: the weighted sum equals the first weight times the first input, plus the second weight times the second input, plus the bias. If a neuron has 10 inputs, the formula has 10 products instead of 2. If you did the lesson on [the dot product](/courses/math-from-zero/vectors-and-matrices/dot-product), you can see that the weighted sum is the dot product of the weight vector and the input vector, plus the bias.

Second, the activation:

$$a = f(z)$$

In words: the output equals the activation function applied to the weighted sum. The letter $a$ stands for activation. The function $f$ is fixed before training and never changes. Only the weights and the bias change when the network learns.

The table shows the two activation functions you meet in this module, with the numbers from the running example.

| Function | Rule in words | f(1) | f(0.5) | f(-1.5) | Where it is used |
| --- | --- | --- | --- | --- | --- |
| ReLU | keep positive numbers, turn negative numbers into 0 | 1 | 0.5 | 0 | hidden neurons, almost always |
| Sigmoid | squeeze any number into the range 0 to 1 | 0.731 | 0.622 | 0.182 | the output neuron of a yes-or-no classifier |

ReLU is the simple one: $\\mathrm{ReLU}(z) = \\max(0, z)$. In words: ReLU of z is the larger of 0 and z. Its graph is a flat line at 0 for negative inputs and a straight line with slope 1 for positive inputs. That bend at 0 is the only thing a hidden neuron adds beyond plain multiplication and addition. The next lesson shows why the bend matters.

Sigmoid is the smooth one: $\\sigma(z) = 1 / (1 + e^{-z})$. In words: sigmoid of z is 1 divided by 1 plus e to the power of minus z, where e is the number 2.718. For z equal to 0 the result is 0.5. For large positive z the result is close to 1, and for large negative z it is close to 0. Because the output is always between 0 and 1, you can read it as a probability. You met this function in [Predict a category: logistic regression](/courses/ai-foundations/first-models/classification). A logistic regression model is one sigmoid neuron.

### Why the bias is needed

A neuron with no bias outputs 0 whenever all its inputs are 0, because every product is 0. The bias lets the neuron have a different resting value. It also moves the point where ReLU switches on. With bias -1, our neuron needs a weighted sum of products above 1 before it outputs anything. With bias 0 it would switch on at any positive sum. Training moves the bias, like it moves the weights.

### The neuron in Python

The whole neuron fits in a short Python function. The function takes a list of inputs, a list of weights and a bias. It loops over the inputs, adds up the products, adds the bias, and applies ReLU.

:::code
lang: python
file: neuron.py
def relu(z):
    return max(0, z)

def neuron(inputs, weights, bias):
    z = bias
    for x, w in zip(inputs, weights):
        z = z + w * x
    return relu(z)

print(neuron([1, 2], [1, 0.5], -1))
print(neuron([2, 1], [1, 0.5], -1))
print(neuron([0, 1], [1, 0.5], -1))
:::

Run the file. The output matches the three cases from the example.

:::code
lang: text
1
1.5
0
:::

The function zip pairs each input with its weight, so the loop sees 1 with 1, then 2 with 0.5. The variable z starts at the bias and grows by one product each time round the loop. This is the whole neuron. There is no more inside it.

### Where the weights come from

In this lesson the weights 1 and 0.5 and the bias -1 were given to you. In a real network nobody chooses them. Training starts from small random numbers and changes them a little at a time until the network's outputs match the targets. The lessons on [loss and gradient descent](/courses/ai-foundations/neural-networks/loss-and-descent) and [backpropagation](/courses/ai-foundations/neural-networks/backpropagation) show exactly how those changes are computed, on this same neuron with these same numbers.

## Try it

:::exercise
title: Compute a second neuron by hand
task: A second neuron has weights -1 and 1 and bias -0.5. Compute its ReLU output for the inputs 1 and 2, then for the inputs 2 and 1. Then compute the sigmoid output for the first case, using the table in the lesson or a calculator.
hint: Write the three steps each time: product one, product two, then add the bias. Apply ReLU last. For sigmoid, you need 1 divided by 1 plus e to the power of minus z.
lang: text
solution:
Inputs 1 and 2:
  -1 times 1 = -1
   1 times 2 = 2
  -1 + 2 - 0.5 = 0.5
  ReLU(0.5) = 0.5

Inputs 2 and 1:
  -1 times 2 = -2
   1 times 1 = 1
  -2 + 1 - 0.5 = -1.5
  ReLU(-1.5) = 0

Sigmoid for the first case:
  sigmoid(0.5) = 1 / (1 + e^-0.5) = 1 / (1 + 0.607) = 0.622
:::

:::exercise
title: Add a sigmoid option to the Python neuron
task: Copy neuron.py. Add a function sigmoid(z) and give neuron a third argument that chooses between relu and sigmoid. Check that neuron([1, 2], [1, 0.5], -1, sigmoid) prints about 0.731.
hint: The math module has math.exp(x), which computes e to the power of x. Pass the function itself as the argument, without brackets.
lang: python
solution:
import math

def relu(z):
    return max(0, z)

def sigmoid(z):
    return 1 / (1 + math.exp(-z))

def neuron(inputs, weights, bias, activation):
    z = bias
    for x, w in zip(inputs, weights):
        z = z + w * x
    return activation(z)

print(neuron([1, 2], [1, 0.5], -1, relu))
print(neuron([1, 2], [1, 0.5], -1, sigmoid))
:::

## Common mistakes

- Mistake: you add the bias before multiplying, so the bias gets multiplied by a weight. Fix: multiply each input by its weight first, add the products, and add the bias once at the end.
- Mistake: you think ReLU rounds numbers or caps them at 1. Fix: ReLU only replaces negative numbers with 0; 1.5 stays 1.5 and 100 stays 100.
- Mistake: you think the activation function has weights that training changes. Fix: the activation function is a fixed rule; only the weights and the bias change during training.
- Mistake: you think a neuron with output 0 is broken. Fix: a ReLU neuron outputs 0 for every input whose weighted sum is negative; that is its normal off state.
- Mistake: you think the word neuron means the model works like a brain. Fix: an artificial neuron is only the formula in this lesson; the name is a loose borrowing.

## Check your understanding

:::quiz
title: Check: one neuron
q: A neuron has weights 2 and 3 and bias -4. Its inputs are 1 and 1. What is the ReLU output?
- 0
* 1
- 5
- 9
why: The weighted sum is 2 times 1 plus 3 times 1 minus 4, which is 1, and ReLU keeps 1.
q: The same neuron gets inputs 1 and 0. What is the ReLU output?
* 0
- -2
- 2
- 1
why: The weighted sum is 2 minus 4, which is -2, and ReLU turns -2 into 0.
q: Which number does the bias change?
- The input values
- The weight values
* The weighted sum, by a fixed amount, for every input
- The activation function
why: The bias is added once to the weighted sum, so it shifts every output of the neuron by the same amount.
q: You want an output neuron whose value you can read as a probability between 0 and 1. Which activation do you choose?
- ReLU
* Sigmoid
- No activation
why: Sigmoid squeezes every number into the range 0 to 1; ReLU has no upper limit.
q: A neuron has 100 inputs. How many weights and how many biases does it have?
- 100 weights and 100 biases
* 100 weights and 1 bias
- 1 weight and 100 biases
why: Each input has its own weight, and the neuron adds exactly one bias at the end.
:::

## Go further

The 3Blue1Brown video in the links draws neurons as circles that light up, which is a good picture to keep in mind. The Wikipedia page on the artificial neuron lists more activation functions than the two in this lesson; you do not need them yet. The next lesson, [Layers and the forward pass](/courses/ai-foundations/neural-networks/layers-and-forward-pass), places the neuron from this lesson next to the one from the exercise, adds an output neuron, and computes the whole 2-2-1 network by hand.
`,
      links: [
        { label: 'But what is a neural network? (3Blue1Brown)', url: 'https://www.youtube.com/watch?v=aircAruvnKk', kind: 'video' },
        { label: 'Artificial neuron (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Artificial_neuron', kind: 'article' },
        { label: 'Rectifier, ReLU (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Rectifier_(neural_networks)', kind: 'article' },
        { label: 'Neural Networks and Deep Learning, chapter 1 (Nielsen)', url: 'http://neuralnetworksanddeeplearning.com/chap1.html', kind: 'course' },
      ],
    },
    {
      slug: 'layers-and-forward-pass',
      title: 'Layers and the forward pass',
      summary: 'After this lesson you can compute the output of a 2-2-1 network by hand and write the same computation as a matrix multiply.',
      minutes: 22,
      objectives: [
        'Explain what a layer, a hidden layer and the forward pass are.',
        'Compute the output of the 2-2-1 network by hand for a given input.',
        'Write the hidden layer as a weight matrix times the input vector plus a bias vector.',
        'Explain why a network without activation functions is only one straight-line formula.',
      ],
      keyTerms: ['neural-network', 'layer', 'hidden-layer', 'forward-pass', 'weight-matrix', 'linear-layer', 'parameter'],
      body: `
## What this lesson covers

This lesson connects 3 neurons into a small network with 2 inputs, 2 hidden neurons and 1 output neuron. People call this shape a 2-2-1 network. You compute its output by hand for the running example, input 1 and 2. Then you see that the hidden layer is one matrix multiply, so the whole network is a short chain of matrix operations. At the end you can trace any input through the network and say what comes out.

## Why it matters

Running an input through a network to get a prediction is called the forward pass. It is what happens every time you use a trained model: every chatbot reply, every image label, every price estimate is one forward pass. Training adds more steps around it, but the forward pass sits at the centre. The 9 numbers you compute with here are the same 9 numbers that the next three lessons train. The next lesson, [Loss and gradient descent for a network](/courses/ai-foundations/neural-networks/loss-and-descent), measures how wrong this forward pass is and takes the first step to fix it.

:::video
id: aircAruvnKk
why: Watch the first 12 minutes. 3Blue1Brown shows a network with 784 inputs and 2 hidden layers for handwritten digits. The structure is the same as the 2-2-1 network here, only wider and deeper. Listen for the words weight, bias and layer.
:::

## The idea with an example

> **Analogy.** A network is a chain of judging panels. The first panel has 2 judges who both look at the same 2 contestants and each write down one score. The second panel has 1 judge who never sees the contestants. That judge only sees the 2 scores from the first panel and combines them into the final result. The first panel is the hidden layer: its scores are never shown to the audience. The final judge is the output layer.

A layer is a group of neurons that all read the same inputs. A hidden layer is any layer between the input and the output. The 2-2-1 network has one hidden layer with 2 neurons and one output layer with 1 neuron. The input numbers are not neurons; they are the data.

Here are the 9 parameters of the network, fixed for the whole module. The hidden neurons are the two neurons from the last lesson. The output neuron is new.

| Neuron | Reads | Weights | Bias | Activation |
| --- | --- | --- | --- | --- |
| Hidden 1 | x1, x2 | 1, 0.5 | -1 | ReLU |
| Hidden 2 | x1, x2 | -1, 1 | -0.5 | ReLU |
| Output | a1, a2 | 0.5, 1 | -0.5 | none |

The output neuron has no activation function because the task is to predict a number, and a number can be anything. If the task were a yes-or-no question, the output neuron would use sigmoid. We write the hidden outputs as $a_1$ and $a_2$ and the network's prediction as $\\hat{y}$, which reads as y hat.

The diagram shows the three layers and the path of one input through them.

:::arch
title: The 2-2-1 network
layer: Input | x1 = 1, x2 = 2
layer: Hidden | Hidden 1, Hidden 2
layer: Output | Output neuron
flow: x1 = 1 -> Hidden 1 -> Output neuron
note: Hidden 1 = weights 1 and 0.5, bias -1, ReLU
note: Hidden 2 = weights -1 and 1, bias -0.5, ReLU
note: Output neuron = weights 0.5 and 1, bias -0.5, no activation
:::

Now the forward pass for the input 1 and 2. Both hidden neurons read the same inputs. Hidden 1 computes 1 times 1 plus 0.5 times 2 minus 1, which is 1. ReLU keeps 1, so $a_1 = 1$. Hidden 2 computes -1 times 1 plus 1 times 2 minus 0.5, which is 0.5. ReLU keeps 0.5, so $a_2 = 0.5$. The output neuron reads 1 and 0.5. It computes 0.5 times 1 plus 1 times 0.5 minus 0.5, which is 0.5. So the prediction is $\\hat{y} = 0.5$.

The right answer for input 1 and 2 is 1, half of the larger number. The network says 0.5. It is wrong by 0.5. That is fine for now. The parameters were not trained; they were chosen so the arithmetic is easy. The next three lessons fix them.

:::scenario
title: Forward pass for input 1 and 2
state: x1=1, x2=2, a1=?, a2=?, prediction=?
step: Hidden 1 computes its weighted sum: 1 times 1 plus 0.5 times 2 minus 1 equals 1.
state: z1=1
step: Hidden 1 applies ReLU. 1 is positive, so a1 is 1.
state: a1=1
step: Hidden 2 computes its weighted sum: -1 times 1 plus 1 times 2 minus 0.5 equals 0.5.
state: z2=0.5
step: Hidden 2 applies ReLU. 0.5 is positive, so a2 is 0.5.
state: a2=0.5
step: The output neuron reads a1 and a2: 0.5 times 1 plus 1 times 0.5 minus 0.5 equals 0.5.
state: prediction=0.5
step: Compare with the target. The target is 1, so the prediction is 0.5 too low.
state: target=1, error=-0.5
:::

## How it works

A forward pass follows the same steps for a network of any size.

1. Place the input numbers in the input layer.
2. For each neuron in the first hidden layer, compute its weighted sum from the inputs and apply its activation function.
3. Treat the outputs of that layer as the inputs of the next layer. Repeat step 2 for every layer.
4. The outputs of the last layer are the prediction.

Each layer reads only the layer before it. Hidden 2 never sees the output neuron, and the output neuron never sees $x_1$ or $x_2$. Information flows one way, from input to output. That is why it is called the forward pass.

### The hidden layer as a matrix

Both hidden neurons do a weighted sum of the same inputs. You can stack their weights into one table with one row per neuron. That table is the weight matrix $W$ of the layer. You met the idea in [Matrix multiplication by hand](/courses/math-from-zero/vectors-and-matrices/matrix-multiplication), where a tiny network layer was the last example.

$$W = \\begin{bmatrix} 1 & 0.5 \\\\ -1 & 1 \\end{bmatrix}, \\quad b = \\begin{bmatrix} -1 \\\\ -0.5 \\end{bmatrix}, \\quad x = \\begin{bmatrix} 1 \\\\ 2 \\end{bmatrix}$$

In words: W is a 2 by 2 matrix whose first row holds the weights of Hidden 1 and whose second row holds the weights of Hidden 2. The vector b holds the two biases. The vector x holds the two inputs. The whole hidden layer is then one line:

$$a = \\mathrm{ReLU}(Wx + b)$$

In words: the hidden activations equal ReLU applied to the weight matrix times the input vector plus the bias vector. Multiply row 1 of W by x: 1 times 1 plus 0.5 times 2 is 2. Multiply row 2 of W by x: -1 times 1 plus 1 times 2 is 1. So Wx is the vector 2 and 1. Add b to get 1 and 0.5. Apply ReLU to each number to get $a$ equal to 1 and 0.5, the same numbers as before. The matrix form is not a new computation. It is the same arithmetic written on one line, and it is how every library computes a layer.

The output layer is a row vector $v$ of weights 0.5 and 1 and a single bias $c$ of -0.5:

$$\\hat{y} = v \\cdot a + c$$

In words: the prediction equals the dot product of the output weights with the hidden activations, plus the output bias. That is 0.5 times 1 plus 1 times 0.5 minus 0.5, which is 0.5.

| Layer | Shape of weights | Count of weights | Count of biases | Parameters |
| --- | --- | --- | --- | --- |
| Hidden | 2 rows by 2 columns | 4 | 2 | 6 |
| Output | 1 row by 2 columns | 2 | 1 | 3 |
| Whole network | | 6 | 3 | 9 |

A parameter is any number that training changes. The 2-2-1 network has 9. A network with 784 inputs, a hidden layer of 16 and an output of 10 has 784 times 16 plus 16 plus 16 times 10 plus 10 parameters, which is 12,730. A model described as 7B has about 7 billion. The count grows fast, but the arithmetic per layer stays the same: multiply, add, activate.

### Why the hidden layer needs ReLU

Suppose you remove ReLU from the hidden layer. Then the prediction is $v \\cdot (Wx + b) + c$, which you can multiply out into one straight-line formula. Compute it: $v$ times $W$ gives the row -0.5 and 1.25, and $v$ times $b$ plus $c$ gives -1.5. So the network without ReLU is $\\hat{y} = -0.5 x_1 + 1.25 x_2 - 1.5$, a single linear regression like the one in [Predict a number: linear regression](/courses/ai-foundations/first-models/linear-regression). Two layers collapsed into one. No matter how many layers you stack, without activation functions they collapse into one line.

For the input 1 and 2, this line gives -0.5 plus 2.5 minus 1.5, which is 0.5, the same as the real network. That is because both hidden sums were positive, so ReLU changed nothing. Now try the input 1 and 0. Hidden 1 gets 1 minus 1, which is 0. Hidden 2 gets -1 minus 0.5, which is -1.5, and ReLU turns it into 0. The real network outputs 0 plus 0 minus 0.5, which is -0.5. The straight line gives -0.5 plus 0 minus 1.5, which is -2. The two now disagree. ReLU bends the network's rule, and the bend is what lets a network learn a rule such as half of the larger number, which no single straight line can express.

### The forward pass in Python

The code computes the layer with plain lists so you can see every multiply. It uses the neuron function from the last lesson.

:::code
lang: python
file: forward.py
def relu(z):
    return max(0, z)

def neuron(inputs, weights, bias, activation=relu):
    z = bias
    for x, w in zip(inputs, weights):
        z = z + w * x
    return activation(z)

W = [[1, 0.5], [-1, 1]]
b = [-1, -0.5]
v = [0.5, 1]
c = -0.5

def forward(x):
    a = [neuron(x, W[0], b[0]), neuron(x, W[1], b[1])]
    y_hat = neuron(a, v, c, activation=lambda z: z)
    return a, y_hat

print(forward([1, 2]))
print(forward([1, 0]))
:::

:::code
lang: text
([1, 0.5], 0.5)
([0, 0], -0.5)
:::

The lambda on the output neuron is a function that returns its input unchanged, which is the same as no activation. The first line of output shows the hidden activations 1 and 0.5 and the prediction 0.5, as computed by hand. The second line shows the input 1 and 0, where both hidden neurons are off.

## Try it

:::exercise
title: Run the forward pass for a new input by hand
task: Use the same 9 parameters. Compute the hidden activations and the prediction for the input 2 and 1. Then say what the target is, using the rule half of the larger number. Check your answer by adding print(forward([2, 1])) to forward.py.
hint: Hidden 2 has weights -1 and 1, so its weighted sum for 2 and 1 is -2 plus 1 minus 0.5. Think about what ReLU does with that.
lang: text
solution:
Hidden 1: 1 times 2 + 0.5 times 1 - 1 = 1.5, ReLU gives a1 = 1.5
Hidden 2: -1 times 2 + 1 times 1 - 0.5 = -1.5, ReLU gives a2 = 0
Output: 0.5 times 1.5 + 1 times 0 - 0.5 = 0.25
Prediction = 0.25
Target = half of the larger of 2 and 1 = 1
The program prints ([1.5, 0], 0.25)
:::

:::exercise
title: Count the parameters of a bigger network
task: A network has 3 inputs, a hidden layer of 4 neurons, a second hidden layer of 4 neurons, and 2 output neurons. Count its weights, its biases and its total parameters. Write the shape of each weight matrix.
hint: Each layer has one weight per input per neuron, and one bias per neuron. The second hidden layer reads the 4 outputs of the first.
lang: text
solution:
Hidden layer 1: weights 4 by 3 = 12, biases 4, total 16
Hidden layer 2: weights 4 by 4 = 16, biases 4, total 20
Output layer:   weights 2 by 4 = 8,  biases 2, total 10
Weights 36, biases 10, parameters 46
:::

## Common mistakes

- Mistake: you feed the raw inputs x1 and x2 into the output neuron. Fix: the output neuron reads only the hidden activations a1 and a2; each layer reads the layer before it.
- Mistake: you apply ReLU to the output neuron of a regression network. Fix: a network that predicts a number usually has no activation on its output, so it can predict negative numbers too.
- Mistake: you think a bigger hidden layer always means a better network. Fix: more neurons mean more parameters to train and more risk of overfitting; the right size depends on the data.
- Mistake: you think stacking linear layers without activations makes the network more powerful. Fix: without activation functions, any stack of layers collapses into one straight-line formula.
- Mistake: you write the weight matrix with one column per neuron instead of one row. Fix: in this module, and in PyTorch, each row of W holds the weights of one neuron, so W has as many rows as the layer has neurons.

## Check your understanding

:::quiz
title: Check: layers and the forward pass
q: In the 2-2-1 network, what does the output neuron read as its inputs?
- The raw inputs x1 and x2
* The hidden activations a1 and a2
- The weights of the hidden layer
- The target y
why: Each layer reads the outputs of the layer before it, and the hidden layer sits before the output.
q: With the module's parameters, the hidden activations for some input are a1 = 2 and a2 = 0. What is the prediction?
- 2
- 1
* 0.5
- -0.5
why: The output neuron computes 0.5 times 2 plus 1 times 0 minus 0.5, which is 0.5.
q: Why does the network need ReLU in the hidden layer?
- To keep the numbers small
- To make the forward pass faster
* Without it, the two layers collapse into one straight-line formula
- To make the output a probability
why: Multiplying out two linear layers gives one linear formula; the bend of ReLU is what lets the network represent curved rules.
q: A layer has 5 inputs and 3 neurons. What is the shape of its weight matrix, written as rows by columns?
- 5 by 3
* 3 by 5
- 3 by 3
- 5 by 5
why: There is one row per neuron and one column per input, so 3 rows and 5 columns.
q: What is a forward pass?
- One update of the weights
* Running an input through every layer, in order, to get a prediction
- Computing the loss for the whole data set
- Choosing random starting weights
why: The forward pass is the computation from input to prediction; updating weights is a different step that comes later.
:::

## Go further

Michael Nielsen's free book in the links explains the same network shape with handwritten digits and has a diagram of every layer. The PyTorch page on nn.Linear shows that the library stores exactly the weight matrix and bias vector from this lesson. The next lesson, [Loss and gradient descent for a network](/courses/ai-foundations/neural-networks/loss-and-descent), turns the error of 0.5 into a loss number and makes the first change to the parameters.
`,
      links: [
        { label: 'Neural Networks and Deep Learning, chapter 1 (Nielsen)', url: 'http://neuralnetworksanddeeplearning.com/chap1.html', kind: 'course' },
        { label: 'nn.Linear (PyTorch docs)', url: 'https://pytorch.org/docs/stable/generated/torch.nn.Linear.html', kind: 'docs' },
        { label: 'Feedforward neural network (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Feedforward_neural_network', kind: 'article' },
        { label: 'TensorFlow Playground: see a tiny network learn in the browser', url: 'https://playground.tensorflow.org/', kind: 'course' },
      ],
    },
    {
      slug: 'loss-and-descent',
      title: 'Loss and gradient descent for a network',
      summary: 'After this lesson you can compute the loss of a network, take one gradient descent step on its output parameters by hand, and explain learning rate, epoch and batch.',
      minutes: 22,
      objectives: [
        'Compute the squared error loss of the 2-2-1 network for one example and the mean squared error for a batch.',
        'Compute the gradient of the loss for the three output parameters by hand.',
        'Apply the update rule with a learning rate and check that the loss falls.',
        'Explain what an epoch and a batch are and count the updates in a training run.',
      ],
      keyTerms: ['loss-function', 'mean-squared-error', 'gradient', 'gradient-descent', 'learning-rate', 'epoch', 'batch'],
      body: `
## What this lesson covers

This lesson turns the wrong prediction from the last lesson into a number called the loss, and then makes the loss smaller. You compute the loss for the running example, find how the loss changes when each output parameter changes, and move the three output parameters one small step. You see the loss fall from 0.25 to 0.15. You also learn the three words that describe a training run: learning rate, epoch and batch. At the end you can do one step of training by hand.

## Why it matters

Training is nothing more than this step, repeated. A language model with billions of parameters is trained by the same rule you apply here to 3 numbers: compute the loss, find the slope of the loss for each parameter, and move each parameter a little against the slope. You did this for one variable in [Minimising a function by following the slope](/courses/math-from-zero/change-and-gradients/follow-the-slope). This lesson does it for parameters inside a network. The next lesson, [Backpropagation](/courses/ai-foundations/neural-networks/backpropagation), extends the step to the 6 hidden parameters, which are harder to reach.

:::video
id: IHZwWFHWa-w
why: Watch the first 10 minutes. 3Blue1Brown explains the loss, which he calls the cost, and the idea of nudging every weight downhill. The 13,000-dimensional picture he describes is the 9-dimensional picture of this lesson, only bigger.
:::

## The idea with an example

> **Analogy.** You are in the shower and the water is too cold. You do not know the right tap position, but you know the direction: warmer. So you turn the tap a little towards hot, feel the water, and turn again. How far from comfortable the water feels is the loss. The direction you turn is the sign of the gradient. How far you turn each time is the learning rate. Turn too little and you shiver for a long time. Turn too much and you scald yourself, then overshoot back to cold.

A loss function is a formula that takes a prediction and a target and gives one number that says how wrong the prediction is. For predicting a number, the usual loss is the squared error: the prediction minus the target, squared. You met it as mean squared error in [Measuring error and splitting data](/courses/ai-foundations/first-models/measuring-error). Squaring makes the loss positive whether the prediction is too high or too low, and it makes big mistakes count much more than small ones.

Take the running example. The input is 1 and 2, the target is $y = 1$, and the network predicts $\\hat{y} = 0.5$. The loss is:

$$L = (\\hat{y} - y)^2 = (0.5 - 1)^2 = 0.25$$

In words: the loss equals the prediction minus the target, squared, which is minus 0.5 squared, which is 0.25. A perfect prediction gives a loss of 0. The loss can never be negative. Our goal is to change the 9 parameters so the loss gets closer to 0.

The flow diagram shows where the loss sits in the learning loop from [The learning loop](/courses/ai-foundations/what-ai-is/the-learning-loop).

:::flow
title: One training step
Input 1, 2 -> Network: forward pass
Network -> Prediction 0.5: output neuron
Prediction 0.5 -> Loss 0.25: compare with target 1
Loss 0.25 -> Gradients: slope for each parameter
Gradients -> Update: move against the slope
Update -> Network: new parameters
:::

### One parameter at a time

Start with the easiest parameter, the output bias $c$, which is -0.5. The prediction is $\\hat{y} = v_1 a_1 + v_2 a_2 + c$. If you raise $c$ by a small amount, the prediction rises by the same amount, because $c$ is added straight on. So the slope of the prediction with respect to $c$ is 1. In words: a change in the output bias changes the prediction by the same amount.

Now the slope of the loss. The loss is the error squared, and the derivative of a square is 2 times the thing inside, by the power rule and the chain rule from [Derivative rules you need](/courses/math-from-zero/change-and-gradients/derivative-rules).

$$\\frac{\\partial L}{\\partial \\hat{y}} = 2(\\hat{y} - y) = 2(0.5 - 1) = -1$$

In words: the slope of the loss with respect to the prediction is 2 times the prediction minus the target, which is -1. The slope is negative, which means that raising the prediction lowers the loss. That matches common sense: the prediction 0.5 is below the target 1, so raising it helps.

To get the slope of the loss with respect to $c$, multiply the two slopes along the path from $c$ to $L$: the slope of $L$ with respect to $\\hat{y}$ times the slope of $\\hat{y}$ with respect to $c$. That is -1 times 1, which is -1. We call this number the gradient of the loss for $c$ and write it $g_c = -1$.

The update rule moves the parameter against its gradient, scaled by the learning rate $\\eta$, which is a small positive number you choose:

$$c_{\\text{new}} = c - \\eta \\, g_c$$

In words: the new value of c equals the old value minus the learning rate times the gradient. With learning rate 0.05, the new bias is -0.5 minus 0.05 times -1, which is -0.5 plus 0.05, which is -0.45. The bias went up, as it should. The new prediction is 0.5 plus 0.05, which is 0.55, and the new loss is 0.45 squared, which is 0.2025. The loss fell from 0.25 to 0.2025 by changing one number.

:::scenario
title: One gradient step on the output bias
state: c=-0.5, prediction=0.5, target=1, loss=0.25
step: Compute the slope of the loss with respect to the prediction: 2 times 0.5 minus 1, which is -1.
state: dL/dprediction=-1
step: Compute the slope of the prediction with respect to c. The bias is added straight on, so the slope is 1.
state: dprediction/dc=1
step: Multiply the two slopes to get the gradient for c: -1 times 1 is -1.
state: g_c=-1
step: Apply the update rule with learning rate 0.05: -0.5 minus 0.05 times -1 equals -0.45.
state: c=-0.45
step: Run the forward pass again. The prediction is now 0.55 and the loss is 0.45 squared, which is 0.2025.
state: prediction=0.55, loss=0.2025
:::

## How it works

Gradient descent for a network follows four steps for every parameter at once.

1. Run the forward pass and compute the loss.
2. For each parameter, compute the gradient: the slope of the loss with respect to that parameter.
3. Move each parameter by minus the learning rate times its gradient.
4. Repeat from step 1.

Step 2 is the hard part, and for the output parameters you can do it the way you did for $c$. The output weight $v_1$ multiplies $a_1$, so raising $v_1$ by a small amount raises the prediction by $a_1$ times that amount. The slope of the prediction with respect to $v_1$ is $a_1 = 1$. Likewise the slope with respect to $v_2$ is $a_2 = 0.5$. Multiply each by the slope of the loss with respect to the prediction, which is -1.

| Parameter | Old value | Slope of prediction | Gradient (times -1) | New value with learning rate 0.05 |
| --- | --- | --- | --- | --- |
| v1 | 0.5 | a1 = 1 | -1 | 0.5 + 0.05 = 0.55 |
| v2 | 1 | a2 = 0.5 | -0.5 | 1 + 0.025 = 1.025 |
| c | -0.5 | 1 | -1 | -0.5 + 0.05 = -0.45 |

Now run the forward pass with the three new output parameters and the old hidden ones. The hidden activations are still 1 and 0.5. The prediction is 0.55 times 1 plus 1.025 times 0.5 minus 0.45, which is 0.55 plus 0.5125 minus 0.45, which is 0.6125. The loss is 0.3875 squared, which is 0.15. One step on 3 parameters took the loss from 0.25 to 0.15. The 6 hidden parameters have not moved yet. To move them you need their gradients, and the path from a hidden weight to the loss passes through ReLU and the output neuron. The next lesson computes those.

### The learning rate

The learning rate sets how far each step goes. It is the most important number you choose when you train a model. The table shows what happens on the running example when all 9 parameters move, using the gradients from the next lesson.

| Learning rate | Prediction after one step | Loss after one step | What happened |
| --- | --- | --- | --- |
| 0.005 | 0.549 | 0.203 | too small: the loss barely moves |
| 0.05 | 1.0025 | 0.000006 | good: almost exactly on target |
| 0.1 | 1.535 | 0.286 | too large: overshot the target, loss went up |
| 0.5 | 6.875 | 34.5 | far too large: the network is now much worse |

There is no formula for the right learning rate. People try values such as 0.1, 0.01 and 0.001 and watch the loss. If the loss goes up or jumps around, the learning rate is too large. If it falls very slowly, it is too small.

### Batches and the mean loss

A real data set has many examples, not one. Here is the data set for the running task, half of the larger number, with 8 examples.

| x1 | x2 | Target y |
| --- | --- | --- |
| 1 | 2 | 1 |
| 2 | 1 | 1 |
| 0 | 2 | 1 |
| 2 | 0 | 1 |
| 1 | 1 | 0.5 |
| 0 | 1 | 0.5 |
| 1 | 0 | 0.5 |
| 0 | 0 | 0 |

A batch is the group of examples the network processes before one update. The loss of a batch is the mean of the losses of its examples, which is the mean squared error (MSE). Take a batch of 2: the example 1, 2 with loss 0.25, and the example 1, 0. For 1, 0 the last lesson found the prediction -0.5, and the target is 0.5, so the loss is 1. The MSE of the batch is 0.25 plus 1, divided by 2, which is 0.625.

$$\\text{MSE} = \\frac{1}{n} \\sum_{i=1}^{n} (\\hat{y}_i - y_i)^2$$

In words: the mean squared error equals the sum, over all n examples in the batch, of each prediction minus its target squared, divided by n. The gradient of a mean is the mean of the gradients. For $c$, the first example gives -1 and the second gives 2 times -0.5 minus 0.5, which is -2. The batch gradient for $c$ is -1.5, and one update uses that number.

An epoch is one pass over the whole data set. With 8 examples and a batch size of 4, one epoch is 2 updates. With a batch size of 1, one epoch is 8 updates. With a batch size of 8, the whole data set is one batch and one epoch is 1 update. Training runs for many epochs. The PyTorch lesson trains this network for 300 epochs with the whole data set as one batch, so 300 updates.

### The step in Python

The code computes the loss and takes the step on the 3 output parameters.

:::code
lang: python
file: step.py
a = [1, 0.5]          # hidden activations for input 1, 2
v = [0.5, 1]
c = -0.5
y = 1
lr = 0.05

y_hat = v[0] * a[0] + v[1] * a[1] + c
loss = (y_hat - y) ** 2
print("before:", y_hat, loss)

d_loss = 2 * (y_hat - y)         # slope of loss w.r.t. prediction
g_v = [d_loss * a[0], d_loss * a[1]]
g_c = d_loss * 1
v = [v[0] - lr * g_v[0], v[1] - lr * g_v[1]]
c = c - lr * g_c

y_hat = v[0] * a[0] + v[1] * a[1] + c
loss = (y_hat - y) ** 2
print("after: ", y_hat, round(loss, 4))
:::

:::code
lang: text
before: 0.5 0.25
after:  0.6125 0.1502
:::

The abbreviation w.r.t. in the comment means with respect to. The variable d_loss holds the one slope that every output gradient shares. Each gradient is that slope times the slope of the prediction with respect to the parameter.

## Try it

:::exercise
title: Take the step for a different example
task: Use the input 2 and 1, whose forward pass you computed last lesson: hidden activations 1.5 and 0, prediction 0.25, target 1. Compute the loss, the gradients for v1, v2 and c, and the new values with learning rate 0.05. Then compute the new prediction and loss.
hint: The slope of the loss with respect to the prediction is 2 times 0.25 minus 1. The slope of the prediction with respect to v2 is a2, which is 0, so v2 does not move.
lang: text
solution:
Loss = (0.25 - 1)^2 = 0.5625
dL/dprediction = 2 times (0.25 - 1) = -1.5
g_v1 = -1.5 times 1.5 = -2.25, new v1 = 0.5 + 0.1125 = 0.6125
g_v2 = -1.5 times 0 = 0, new v2 = 1
g_c = -1.5, new c = -0.5 + 0.075 = -0.425
New prediction = 0.6125 times 1.5 + 1 times 0 - 0.425 = 0.49375
New loss = (0.49375 - 1)^2 = 0.2563
:::

:::exercise
title: Count the updates
task: A data set has 1,000 examples. You train for 20 epochs with a batch size of 50. How many updates happen? How many if you change the batch size to 10?
hint: Updates per epoch equals examples divided by batch size.
lang: text
solution:
1,000 / 50 = 20 updates per epoch, times 20 epochs = 400 updates
1,000 / 10 = 100 updates per epoch, times 20 epochs = 2,000 updates
:::

## Common mistakes

- Mistake: you add the learning rate times the gradient instead of subtracting it. Fix: the gradient points uphill; to lower the loss, move against it, so subtract.
- Mistake: you think a negative gradient means the parameter is bad. Fix: the sign only says which direction lowers the loss; a negative gradient means increase the parameter.
- Mistake: you pick a large learning rate so training finishes faster. Fix: a step that is too large overshoots and the loss goes up; watch the loss and lower the rate if it rises.
- Mistake: you think one epoch is one update. Fix: one epoch is one pass over all the data, which is one update per batch.
- Mistake: you use the loss of a single example to judge the whole model. Fix: judge the model by the mean loss over a batch or over the whole data set.

## Check your understanding

:::quiz
title: Check: loss and gradient descent
q: The prediction is 3 and the target is 1. What is the squared error loss?
- 2
* 4
- -2
- 0.5
why: 3 minus 1 is 2, and 2 squared is 4.
q: For that same example, what is the slope of the loss with respect to the prediction?
- -4
- 2
* 4
- 1
why: The slope is 2 times the prediction minus the target, which is 2 times 2, which is 4; positive means lowering the prediction lowers the loss.
q: A parameter has value 0.8 and gradient 2. The learning rate is 0.1. What is its new value?
- 1.0
* 0.6
- 0.78
- 0.82
why: 0.8 minus 0.1 times 2 is 0.6.
q: You train and the loss goes 0.5, 0.9, 1.7, 3.2. What is the most likely cause?
- The batch is too small
- The network has too few parameters
* The learning rate is too large
- The data set has too many examples
why: A loss that grows at each step is the sign of steps that overshoot the minimum, which a smaller learning rate fixes.
q: A data set has 200 examples and the batch size is 25. How many updates happen in 3 epochs?
- 8
- 25
* 24
- 600
why: 200 divided by 25 is 8 updates per epoch, and 3 epochs give 24.
:::

## Go further

The StatQuest video in the links walks through gradient descent with a different example and the same update rule. The Wikipedia page on stochastic gradient descent explains what the word stochastic adds: using a small random batch instead of the whole data set. The next lesson, [Backpropagation](/courses/ai-foundations/neural-networks/backpropagation), computes the gradients for the 6 hidden parameters, which this lesson left untouched, and shows why one backward pass is enough for all of them.
`,
      links: [
        { label: 'Gradient descent, step by step (StatQuest)', url: 'https://www.youtube.com/watch?v=sDv4f4s2SB8', kind: 'video' },
        { label: 'Stochastic gradient descent (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Stochastic_gradient_descent', kind: 'article' },
        { label: 'Mean squared error (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Mean_squared_error', kind: 'article' },
        { label: 'Neural Networks and Deep Learning, chapter 1, gradient descent section (Nielsen)', url: 'http://neuralnetworksanddeeplearning.com/chap1.html#learning_with_gradient_descent', kind: 'course' },
      ],
    },
    {
      slug: 'backpropagation',
      title: 'Backpropagation',
      summary: 'After this lesson you can compute the gradient of every parameter in the 2-2-1 network with one backward pass and explain why that is cheap.',
      minutes: 24,
      objectives: [
        'Explain backpropagation as passing blame backwards through the network with the chain rule.',
        'Compute the gradients of all 9 parameters of the 2-2-1 network by hand for one example.',
        'Apply one full gradient step and check that the loss falls from 0.25 to almost 0.',
        'Explain why one backward pass costs about as much as one forward pass, whatever the size of the network.',
      ],
      keyTerms: ['backpropagation', 'chain-rule', 'gradient', 'partial-derivative', 'forward-pass', 'dead-neuron'],
      body: `
## What this lesson covers

This lesson finds the gradients of the 6 hidden parameters that the last lesson could not reach. The method is called backpropagation. It starts at the loss and walks backwards through the network, one layer at a time, multiplying slopes with the chain rule. You do the full backward pass by hand on the running example, get all 9 gradients, take one step, and watch the loss fall from 0.25 to 0.000006. At the end you can explain why this is the only practical way to train a network with many parameters.

## Why it matters

Backpropagation is the reason neural networks can be trained at all. Every model you will meet, from the 2-2-1 network to a language model, learns by this one algorithm. When you call loss.backward() in PyTorch in the next lesson, [Training in PyTorch](/courses/ai-foundations/neural-networks/training-in-pytorch), the library runs exactly the steps in this lesson, on the same numbers, and returns the same 9 gradients. If you understand the hand version, nothing the library does is a mystery.

:::video
id: Ilg3gGewQ5U
why: Watch all 13 minutes. 3Blue1Brown gives the intuition of nudging each weight in proportion to its activation and its blame. The lesson below does the same nudges with exact numbers.
:::

## The idea with an example

> **Analogy.** A cake comes out of a three-station bakery too flat. The inspector at the end measures the problem: the cake is 0.5 centimetres too low. She tells the oven station how much the flatness depends on oven time. The oven station passes the blame further back: it tells the mixing station how much the oven result depended on the batter. Each station multiplies the blame it received by its own influence and passes the product backwards. Nobody needs to bake a new cake to find out who to adjust. That is backpropagation.

In the last lesson you found the gradient of an output parameter by multiplying two slopes: the slope of the loss with respect to the prediction, and the slope of the prediction with respect to the parameter. A hidden weight sits further back, so its path to the loss has more slopes in it. The chain rule from [Derivative rules you need](/courses/math-from-zero/change-and-gradients/derivative-rules) says that the slope along a path is the product of the slopes of its parts. Backpropagation is the chain rule, organised so that no product is computed twice.

Here is the state of the running example after the forward pass. The input is 1 and 2, the target is 1. The hidden sums are $z_1 = 1$ and $z_2 = 0.5$, the activations are $a_1 = 1$ and $a_2 = 0.5$, and the prediction is 0.5. The loss is 0.25. The slope of the loss with respect to the prediction is $2(0.5 - 1) = -1$. That one number is where the backward pass starts.

Take the first hidden weight, $w_{11} = 1$, which multiplies $x_1$ inside Hidden 1. The path from $w_{11}$ to the loss has four parts.

1. $w_{11}$ affects $z_1$. The slope is $x_1 = 1$, because $z_1$ contains the product $w_{11} x_1$.
2. $z_1$ affects $a_1$ through ReLU. Because $z_1$ is positive, ReLU is the line with slope 1. The slope is 1.
3. $a_1$ affects the prediction. The slope is $v_1 = 0.5$, because the prediction contains the product $v_1 a_1$.
4. The prediction affects the loss. The slope is -1.

Multiply the four slopes: 1 times 1 times 0.5 times -1 is -0.5. So the gradient for $w_{11}$ is -0.5. In words: raising $w_{11}$ a little raises $z_1$ by the same amount, raises $a_1$ by the same amount, raises the prediction by half that amount, and lowers the loss by that half. The diagram shows the backward direction.

:::flow
title: Blame flows backwards from the loss
Loss 0.25 -> Prediction: slope -1
Prediction -> Output params: times a1, a2, 1
Prediction -> Hidden a1, a2: times v1, v2
Hidden a1, a2 -> Hidden z1, z2: times ReLU slope
Hidden z1, z2 -> Hidden params: times x1, x2, 1
:::

The trick is that the products share parts. The first three slopes for $w_{11}$ are the same as the first three for $w_{12}$ and for $b_1$. So you compute the blame for $z_1$ once, which is -1 times 0.5 times 1, which is -0.5, and then multiply by $x_1$, $x_2$ or 1 to get the three gradients of Hidden 1. Press Next to follow the whole backward pass.

:::scenario
title: The backward pass for input 1 and 2
state: dL/dprediction=-1, a1=1, a2=0.5, v1=0.5, v2=1, x1=1, x2=2
step: Output parameters. Multiply -1 by a1, a2 and 1 to get the gradients of v1, v2 and c.
state: g_v1=-1, g_v2=-0.5, g_c=-1
step: Blame for the hidden activations. Multiply -1 by the output weights v1 and v2.
state: dL/da1=-0.5, dL/da2=-1
step: Through ReLU. Both z1 and z2 are positive, so the slope is 1 and the blame passes unchanged.
state: dL/dz1=-0.5, dL/dz2=-1
step: Hidden 1 parameters. Multiply dL/dz1 by x1, x2 and 1.
state: g_w11=-0.5, g_w12=-1, g_b1=-0.5
step: Hidden 2 parameters. Multiply dL/dz2 by x1, x2 and 1.
state: g_w21=-1, g_w22=-2, g_b2=-1
step: Done. All 9 gradients came from one pass backwards. No forward pass was repeated.
state: gradients=9 of 9
:::

## How it works

Backpropagation for a network of any depth follows these steps.

1. Run the forward pass and keep every intermediate value: each weighted sum and each activation. You need them later.
2. Compute the slope of the loss with respect to the prediction. For squared error it is 2 times prediction minus target.
3. For the last layer, multiply that slope by each input of the layer to get the gradient of each weight, and by 1 to get the gradient of the bias.
4. Pass the blame back to the previous layer's activations: multiply the slope by each weight of the last layer.
5. Pass the blame through the activation function: multiply by its slope at the stored weighted sum. For ReLU the slope is 1 if the sum was positive and 0 if it was negative.
6. Repeat steps 3 to 5 for each earlier layer until you reach the input.

The table shows every gradient for the running example, and the parameter values after one step with learning rate 0.05.

| Parameter | Old value | Path of slopes | Gradient | New value |
| --- | --- | --- | --- | --- |
| v1 | 0.5 | -1 times a1 = 1 | -1 | 0.55 |
| v2 | 1 | -1 times a2 = 0.5 | -0.5 | 1.025 |
| c | -0.5 | -1 times 1 | -1 | -0.45 |
| w11 | 1 | -1 times v1 times 1 times x1 | -0.5 | 1.025 |
| w12 | 0.5 | -1 times v1 times 1 times x2 | -1 | 0.55 |
| b1 | -1 | -1 times v1 times 1 times 1 | -0.5 | -0.975 |
| w21 | -1 | -1 times v2 times 1 times x1 | -1 | -0.95 |
| w22 | 1 | -1 times v2 times 1 times x2 | -2 | 1.1 |
| b2 | -0.5 | -1 times v2 times 1 times 1 | -1 | -0.45 |

Now run the forward pass with the 9 new values. Hidden 1: 1.025 times 1 plus 0.55 times 2 minus 0.975, which is 1.15. Hidden 2: -0.95 times 1 plus 1.1 times 2 minus 0.45, which is 0.8. Both are positive, so the activations are 1.15 and 0.8. Output: 0.55 times 1.15 plus 1.025 times 0.8 minus 0.45, which is 0.6325 plus 0.82 minus 0.45, which is 1.0025. The target is 1. The loss is 0.0025 squared, which is 0.000006. One step took the loss from 0.25 to almost nothing. The step was this effective because all 9 gradients pointed the same way for this one example. On the full data set the steps are smaller, as the next lesson shows.

In symbols, the gradient of a hidden weight is a chain of partial derivatives:

$$\\frac{\\partial L}{\\partial w_{11}} = \\frac{\\partial L}{\\partial \\hat{y}} \\cdot \\frac{\\partial \\hat{y}}{\\partial a_1} \\cdot \\frac{\\partial a_1}{\\partial z_1} \\cdot \\frac{\\partial z_1}{\\partial w_{11}} = (-1)(0.5)(1)(1) = -0.5$$

In words: the gradient of the loss with respect to w11 equals the slope of the loss with respect to the prediction, times the slope of the prediction with respect to a1, times the slope of a1 with respect to z1, times the slope of z1 with respect to w11. Each factor is a partial derivative, which you met in [Many variables: partial derivatives and the gradient](/courses/math-from-zero/change-and-gradients/gradients-many-variables). Each one is a small local fact about one part of the network. Backpropagation multiplies them along the path.

### When ReLU blocks the blame

Step 5 hides an important case. Try the input 2 and 1 from the exercises. Hidden 2 had weighted sum -1.5, so ReLU output 0 and its slope there is 0. Whatever blame arrives at $a_2$, multiplying by 0 kills it. The gradients of $w_{21}$, $w_{22}$ and $b_2$ are all 0 for that example. Hidden 2 does not learn from the input 2 and 1. A neuron whose weighted sum is negative for every example is a dead neuron: it outputs 0, gets gradient 0, and never changes again. A learning rate that is too large often pushes neurons into this state, which is one reason training can stall at a fixed loss.

### Why backpropagation is cheap

There is a slower way to get a gradient. Nudge one parameter by a tiny amount, say 0.001, run the forward pass again, and see how much the loss changed. Divide the change in loss by 0.001. That gives the gradient of that one parameter, and it costs one forward pass. For 9 parameters it costs 9 forward passes. For a model with 7 billion parameters it costs 7 billion forward passes for a single update.

Backpropagation computes all the gradients in one backward pass, and the backward pass does about the same amount of arithmetic as the forward pass. The reason is sharing: the blame for $z_1$ is computed once and reused for 3 gradients, and in a big layer the blame for each neuron is reused for thousands of weights. The table compares the two methods.

| Network | Parameters | Forward passes to nudge each one | Passes with backpropagation |
| --- | --- | --- | --- |
| 2-2-1 | 9 | 9 | about 2 |
| 784-16-10 digit classifier | 12,730 | 12,730 | about 2 |
| 7B language model | 7,000,000,000 | 7,000,000,000 | about 2 |

The column on the right never changes. That is why the algorithm, published for neural networks in 1986, made modern deep learning possible.

### The backward pass in Python

The code runs the forward pass, stores the sums, and then applies the six steps. Compare each printed number with the table.

:::code
lang: python
file: backward.py
x = [1, 2]
y = 1
W = [[1, 0.5], [-1, 1]]
b = [-1, -0.5]
v = [0.5, 1]
c = -0.5

# forward pass, keeping the sums
z = [W[0][0] * x[0] + W[0][1] * x[1] + b[0],
     W[1][0] * x[0] + W[1][1] * x[1] + b[1]]
a = [max(0, z[0]), max(0, z[1])]
y_hat = v[0] * a[0] + v[1] * a[1] + c
loss = (y_hat - y) ** 2

# backward pass
d_pred = 2 * (y_hat - y)
g_v = [d_pred * a[0], d_pred * a[1]]
g_c = d_pred
d_a = [d_pred * v[0], d_pred * v[1]]
d_z = [d_a[0] * (1 if z[0] > 0 else 0),
       d_a[1] * (1 if z[1] > 0 else 0)]
g_W = [[d_z[0] * x[0], d_z[0] * x[1]],
       [d_z[1] * x[0], d_z[1] * x[1]]]
g_b = [d_z[0], d_z[1]]

print("loss", loss)
print("g_v", g_v, "g_c", g_c)
print("g_W", g_W, "g_b", g_b)
:::

:::code
lang: text
loss 0.25
g_v [-1.0, -0.5] g_c -1.0
g_W [[-0.5, -1.0], [-1.0, -2.0]] g_b [-0.5, -1.0]
:::

The expression 1 if z[0] > 0 else 0 is the slope of ReLU. Change x to [2, 1] and run again: the second row of g_W and the second entry of g_b become 0, as the dead neuron section predicts.

## Try it

:::exercise
title: Backpropagate a different example by hand
task: Use the input 2 and 1 with target 1. From the earlier exercises, z1 = 1.5, z2 = -1.5, a1 = 1.5, a2 = 0 and the prediction is 0.25. Compute all 9 gradients. Then check with backward.py by changing x to [2, 1].
hint: Start with the slope of the loss with respect to the prediction, which is 2 times 0.25 minus 1. Remember that the ReLU slope for z2 is 0.
lang: text
solution:
dL/dprediction = 2 times (0.25 - 1) = -1.5
g_v1 = -1.5 times 1.5 = -2.25
g_v2 = -1.5 times 0 = 0
g_c = -1.5
dL/da1 = -1.5 times 0.5 = -0.75, ReLU slope 1, so dL/dz1 = -0.75
dL/da2 = -1.5 times 1 = -1.5, ReLU slope 0, so dL/dz2 = 0
g_w11 = -0.75 times 2 = -1.5
g_w12 = -0.75 times 1 = -0.75
g_b1 = -0.75
g_w21 = 0, g_w22 = 0, g_b2 = 0
The program prints g_W [[-1.5, -0.75], [0, 0]] g_b [-0.75, 0]
:::

:::exercise
title: Check one gradient by nudging
task: In backward.py, add 0.001 to W[0][0] and run only the forward pass again. Divide the change in the loss by 0.001. Compare with g_W[0][0], which is -0.5.
hint: Compute the loss before and after the nudge, with everything else unchanged. The result is close to -0.5 but not exact, because the nudge is not infinitely small.
lang: python
solution:
def forward_loss(W, b, v, c, x, y):
    z = [W[0][0] * x[0] + W[0][1] * x[1] + b[0],
         W[1][0] * x[0] + W[1][1] * x[1] + b[1]]
    a = [max(0, z[0]), max(0, z[1])]
    y_hat = v[0] * a[0] + v[1] * a[1] + c
    return (y_hat - y) ** 2

x, y = [1, 2], 1
W, b, v, c = [[1, 0.5], [-1, 1]], [-1, -0.5], [0.5, 1], -0.5
before = forward_loss(W, b, v, c, x, y)
W[0][0] = W[0][0] + 0.001
after = forward_loss(W, b, v, c, x, y)
print((after - before) / 0.001)   # prints about -0.49975
:::

## Common mistakes

- Mistake: you forget to store the weighted sums during the forward pass and cannot tell whether ReLU was on or off. Fix: keep every z; the backward pass needs the sign of each one.
- Mistake: you pass blame back to the hidden activations using the hidden weights instead of the output weights. Fix: the blame for a1 is the slope of the prediction with respect to a1, which is the output weight v1.
- Mistake: you think backpropagation is a different learning rule from gradient descent. Fix: backpropagation only computes the gradients; gradient descent then uses them in the update rule.
- Mistake: you add the gradients of a weight along different paths wrongly or forget a path. Fix: in a network with more than one output, or with layers that feed several neurons, the gradient of a parameter is the sum over all paths to the loss; in the 2-2-1 network each hidden parameter has one path.
- Mistake: you think a loss that stops falling means the network has learned everything. Fix: it can mean that neurons have died and pass no gradient; try a smaller learning rate and restart.

## Check your understanding

:::quiz
title: Check: backpropagation
q: What does backpropagation compute?
- The prediction for an input
* The gradient of the loss with respect to every parameter
- The best learning rate
- The loss for the whole data set
why: Backpropagation is the method for getting all the gradients; the forward pass computes the prediction and the update rule uses the gradients.
q: The slope of the loss with respect to the prediction is -2. The output weight on a1 is 0.5, and z1 = 3. What is the blame that reaches z1?
- -2
- -0.5
* -1
- 0
why: Multiply -2 by the output weight 0.5 to get -1 at a1, and ReLU at a positive sum has slope 1, so -1 reaches z1.
q: In the same situation, z2 = -3 and the output weight on a2 is 1. What is the gradient of w21?
- -2
- -2 times x1
* 0
- -1
why: ReLU at a negative sum has slope 0, so no blame passes through, and every gradient of Hidden 2 is 0 for this example.
q: Why is backpropagation faster than nudging each parameter and re-running the forward pass?
- It skips the forward pass
- It only computes gradients for the output layer
* One backward pass computes every gradient, reusing shared slopes, for about the cost of one forward pass
- It uses a larger learning rate
why: The nudging method needs one forward pass per parameter; backpropagation needs one backward pass in total.
q: Which stored value from the forward pass does the backward pass need to find the gradient of a hidden weight w12?
- The target only
* The input x2 and the sign of z1
- The learning rate
- The loss from the previous epoch
why: The gradient of w12 is the blame at z1, which needs the ReLU slope from the sign of z1, times the input x2 that w12 multiplies.
:::

## Go further

The second chapter of Nielsen's book in the links derives the four backpropagation equations for any depth, with the same matrix notation as this module. The CS231n notes walk through backpropagation on a computational graph with worked numbers. The 3Blue1Brown calculus video does the chain for one path, as this lesson did for w11. The next lesson, [Training in PyTorch](/courses/ai-foundations/neural-networks/training-in-pytorch), hands all of this arithmetic to a library and trains the same network on the 8-example data set.
`,
      links: [
        { label: 'Backpropagation calculus (3Blue1Brown)', url: 'https://www.youtube.com/watch?v=tIeHLnjs5U8', kind: 'video' },
        { label: 'Neural Networks and Deep Learning, chapter 2: how backpropagation works (Nielsen)', url: 'http://neuralnetworksanddeeplearning.com/chap2.html', kind: 'course' },
        { label: 'CS231n notes: backpropagation, intuitions', url: 'https://cs231n.github.io/optimization-2/', kind: 'course' },
        { label: 'Learning representations by back-propagating errors (Rumelhart, Hinton, Williams, 1986)', url: 'https://www.nature.com/articles/323533a0', kind: 'paper' },
      ],
    },
    {
      slug: 'training-in-pytorch',
      title: 'Training in PyTorch',
      summary: 'After this lesson you can build the 2-2-1 network in PyTorch, check its gradients against your hand results, train it on a tiny data set, and read the loss curve.',
      minutes: 25,
      objectives: [
        'Explain what a tensor is and create one with a given shape.',
        'Run autograd on the 2-2-1 network and check that it returns the hand-computed gradients.',
        'Write a training loop with nn.Module, MSELoss and SGD and run it on 8 examples.',
        'Read a loss curve and choose a better learning rate when it is too large or too small.',
      ],
      keyTerms: ['pytorch', 'tensor', 'autograd', 'training-loop', 'optimizer', 'loss-curve', 'epoch'],
      body: `
## What this lesson covers

This lesson hands the arithmetic of the last four lessons to a library called PyTorch. You build the same 2-2-1 network with the same 9 starting parameters, ask PyTorch for the gradients, and see the same 9 numbers you computed by hand. Then you write the five-line training loop that every PyTorch model uses, train the network on the 8-example data set for 300 epochs, and read the loss curve. At the end you can train a small network on your own computer and tell whether the training went well.

## Why it matters

Nobody trains a model by hand. PyTorch is the library behind most research papers and most open models, including the language models you meet in [Language as numbers](/courses/ai-foundations/language-as-numbers/tokens). The training loop in this lesson is the same loop that trains them, with bigger tensors. Because you have done every step by hand, each line of the loop names a step you already know: forward pass, loss, backward pass, update. This lesson is the bridge from understanding to building. The project track, [Build the AI Ecosystem](/courses/build-ai-ecosystem/set-up-your-workshop/the-project-plan), assumes you can run code like this.

:::video
id: V_xro1bcAuA
why: Watch the first 40 minutes, up to the end of the tensor basics. The course is long; you only need the parts on creating tensors, their shapes and simple arithmetic. Come back to the training loop sections after this lesson.
:::

## The idea with an example

> **Analogy.** A spreadsheet recalculates every cell when you change one number, because it recorded which cell depends on which. PyTorch is a spreadsheet for networks, with one extra trick: it also records the slope of every dependency. So after you type in the forward pass as ordinary arithmetic, you can ask for the gradient of the final cell, the loss, with respect to any input cell. That request is loss.backward(), and the answer is the backward pass from the last lesson, done for you.

PyTorch stores numbers in tensors. A tensor is a grid of numbers with a shape. A single number has shape [], a vector of 2 numbers has shape [2], and a 2 by 2 matrix has shape [2, 2]. The tensors in this lesson hold exactly the vectors and matrices from [Layers and the forward pass](/courses/ai-foundations/neural-networks/layers-and-forward-pass).

First install the library. Open a terminal inside a virtual environment, as in [Packages and pip](/courses/start-here/python-for-data/packages-and-pip), and type pip install torch. The download is large, about 200 MB. If your computer is slow or the install fails, open a notebook on Google Colab instead, as in [Notebooks: Jupyter and Colab](/courses/start-here/python-for-data/notebooks); PyTorch is already installed there. Then try the first file.

:::code
lang: python
file: tensors.py
import torch

x = torch.tensor([1.0, 2.0])
print(x)
print(x.shape)
print(x * 2)

W = torch.tensor([[1.0, 0.5], [-1.0, 1.0]])
print(W.shape)
print(W @ x)
:::

:::code
lang: text
tensor([1., 2.])
torch.Size([2])
tensor([2., 4.])
torch.Size([2, 2])
tensor([2., 1.])
:::

The last line is the matrix times the vector from the forward-pass lesson: row 1 gives 2 and row 2 gives 1. The @ symbol is matrix multiplication. Write the numbers with a decimal point, as 1.0 rather than 1, so PyTorch stores them as decimals; gradients need decimals.

### Autograd checks your hand work

Now build the full network with the module's parameters and mark each parameter with requires_grad=True. That flag tells PyTorch to record every operation that touches the tensor, so it can run the backward pass later.

:::code
lang: python
file: autograd_check.py
import torch

x = torch.tensor([1.0, 2.0])
y = torch.tensor(1.0)

W = torch.tensor([[1.0, 0.5], [-1.0, 1.0]], requires_grad=True)
b = torch.tensor([-1.0, -0.5], requires_grad=True)
v = torch.tensor([0.5, 1.0], requires_grad=True)
c = torch.tensor(-0.5, requires_grad=True)

a = torch.relu(W @ x + b)
y_hat = v @ a + c
loss = (y_hat - y) ** 2
print("prediction", y_hat.item())
print("loss", loss.item())

loss.backward()
print("grad W", W.grad)
print("grad b", b.grad)
print("grad v", v.grad)
print("grad c", c.grad)
:::

:::code
lang: text
prediction 0.5
loss 0.25
grad W tensor([[-0.5000, -1.0000],
        [-1.0000, -2.0000]])
grad b tensor([-0.5000, -1.0000])
grad v tensor([-1.0000, -0.5000])
grad c tensor(-1.)
:::

Compare with the gradient table in [Backpropagation](/courses/ai-foundations/neural-networks/backpropagation). All 9 numbers match. The three lines before loss.backward() are the forward pass, written as the matrix formula from the forward-pass lesson. The call loss.backward() is the whole backward pass. After it, every tensor that had requires_grad=True holds its gradient in its grad attribute. The method item() turns a tensor with one number into a plain Python number for printing.

:::scenario
title: What PyTorch does in autograd_check.py
state: recorded operations=0, grads=none
step: Line by line, the forward pass runs: matrix multiply, add, ReLU, dot product, add, subtract, square. PyTorch records each operation and its inputs.
state: recorded operations=7, prediction=0.5, loss=0.25
step: loss.backward() starts at the loss with slope 1 and walks the recorded operations in reverse, multiplying slopes, exactly as in the hand backward pass.
state: dL/dprediction=-1
step: At the dot product, it drops gradients into v.grad and passes blame to a. At ReLU it multiplies by 1 or 0. At the matrix multiply it fills W.grad and b.grad.
state: W.grad, b.grad, v.grad, c.grad=filled
step: The script prints the four grad tensors. They equal the 9 hand-computed gradients.
state: match=9 of 9
:::

## How it works

A PyTorch training program has three parts: the data as tensors, the model as an nn.Module, and the training loop. The diagram shows how a batch moves through them.

:::arch
title: A PyTorch training run
layer: Data | X shape 8 by 2, Y shape 8 by 1
layer: Model | Linear 2 to 2, ReLU, Linear 2 to 1
layer: Training | MSELoss, backward, SGD step
flow: X shape 8 by 2 -> Linear 2 to 2 -> ReLU -> Linear 2 to 1 -> MSELoss -> backward -> SGD step -> Linear 2 to 2
note: Linear 2 to 2 = the hidden layer: weight matrix 2 by 2 and bias vector of 2
note: MSELoss = mean squared error over the 8 examples
note: SGD step = parameter minus learning rate times gradient, for all 9 parameters
:::

The table maps each line of the loop to the lesson where you did it by hand.

| Line in the loop | What it does | Lesson where you did it by hand |
| --- | --- | --- |
| optimizer.zero_grad() | clears the old gradients | none: PyTorch adds new gradients to old ones unless you clear them |
| y_hat = model(X) | forward pass for the whole batch | Layers and the forward pass |
| loss = loss_fn(y_hat, Y) | mean squared error of the batch | Loss and gradient descent |
| loss.backward() | backward pass, fills every grad | Backpropagation |
| optimizer.step() | update rule on every parameter | Loss and gradient descent |

Here is the complete program. It defines the model as a class, copies in the module's 9 starting parameters so the run matches the hand lessons, and trains for 300 epochs with the whole data set as one batch.

:::code
lang: python
file: train.py
import torch
from torch import nn

class TinyNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.hidden = nn.Linear(2, 2)
        self.out = nn.Linear(2, 1)

    def forward(self, x):
        a = torch.relu(self.hidden(x))
        return self.out(a)

X = torch.tensor([[1.0, 2.0], [2.0, 1.0], [0.0, 2.0], [2.0, 0.0],
                  [1.0, 1.0], [0.0, 1.0], [1.0, 0.0], [0.0, 0.0]])
Y = torch.tensor([[1.0], [1.0], [1.0], [1.0], [0.5], [0.5], [0.5], [0.0]])

model = TinyNet()
with torch.no_grad():
    model.hidden.weight.copy_(torch.tensor([[1.0, 0.5], [-1.0, 1.0]]))
    model.hidden.bias.copy_(torch.tensor([-1.0, -0.5]))
    model.out.weight.copy_(torch.tensor([[0.5, 1.0]]))
    model.out.bias.copy_(torch.tensor([-0.5]))

loss_fn = nn.MSELoss()
optimizer = torch.optim.SGD(model.parameters(), lr=0.05)

for epoch in range(1, 301):
    optimizer.zero_grad()
    y_hat = model(X)
    loss = loss_fn(y_hat, Y)
    loss.backward()
    optimizer.step()
    if epoch in (1, 2, 5, 10, 50, 100, 200, 300):
        print(f"epoch {epoch:3d}  loss {loss.item():.4f}")

with torch.no_grad():
    print(model(torch.tensor([[1.0, 2.0]])).item())
    print(model(torch.tensor([[1.0, 0.0]])).item())
:::

:::code
lang: text
epoch   1  loss 0.4844
epoch   2  loss 0.3464
epoch   5  loss 0.1548
epoch  10  loss 0.0769
epoch  50  loss 0.0206
epoch 100  loss 0.0117
epoch 200  loss 0.0070
epoch 300  loss 0.0051
0.9763408899307251
0.38279324769973755
:::

Read the program from the top. The class TinyNet is an nn.Module, the PyTorch name for a model. Its two nn.Linear layers hold a weight matrix and a bias vector each, which is the matrix form of a layer from the forward-pass lesson. The forward method is the forward pass; PyTorch calls it when you write model(X). The data X has shape 8 by 2, one row per example, and Y has shape 8 by 1. The block under torch.no_grad() copies in the 9 starting values; in normal use you skip it and keep the random starting values that nn.Linear chooses. The line with torch.optim.SGD builds the optimizer, which holds the list of parameters and the learning rate 0.05. SGD stands for stochastic gradient descent, which is the update rule from the loss lesson.

The first printed loss, 0.4844, is the mean squared error of the 8 examples before any update. It is higher than the 0.25 of the running example because the other 7 examples are predicted worse. After 300 epochs the loss is 0.0051. The last two lines show the trained network at work: for input 1 and 2 it predicts 0.976, close to the target 1, and for input 1 and 0 it predicts 0.383, where the target is 0.5. The network has learned the rule half of the larger number well, but not perfectly, from 8 examples.

### Reading the loss curve

The list of losses against epochs is the loss curve. It is the first thing to look at after any training run.

:::bars
title: Loss over 300 epochs with learning rate 0.05
unit: mean squared error
Epoch 1: 0.484
Epoch 2: 0.346
Epoch 5: 0.155
Epoch 10: 0.077
Epoch 50: 0.021
Epoch 100: 0.012
Epoch 300: 0.005
:::

A healthy curve falls fast at first and then flattens. The table shows what the same program prints with other learning rates, so you can recognise the three unhealthy shapes.

| Learning rate | Loss at epochs 1, 2, 5, 10, 300 | Shape | Diagnosis |
| --- | --- | --- | --- |
| 0.005 | 0.48, 0.47, 0.42, 0.36, 0.03 | falls slowly, still falling at the end | too small; raise it or train longer |
| 0.05 | 0.48, 0.35, 0.15, 0.08, 0.005 | falls fast, then flattens | good |
| 0.5 | 0.48, 1.11, 0.12, 0.12, 0.12 | jumps up, then a flat line that never moves | too large; both hidden neurons died and pass no gradient |
| 1.0 | 0.48, 9.45, 30.4, 30.4, 30.4 | explodes, then flat | far too large |

The flat line at 0.1211 for learning rate 0.5 is the dead neuron case from the backpropagation lesson. The first big step pushed both hidden weighted sums negative for every example. ReLU then outputs 0 everywhere, the gradients of the hidden layer are 0, and the output layer can only learn a constant. A loss that drops to a fixed value and stays there, from early on, is a sign to lower the learning rate and restart.

### Three habits that prevent most bugs

1. Call optimizer.zero_grad() at the start of every loop. PyTorch adds each new gradient to the stored one, so without this line the gradients of every past step pile up.
2. Keep the shapes straight. X is 8 by 2 and the model expects 2 inputs per row; Y is 8 by 1 to match the model's 1 output per row. A shape mismatch is the most common PyTorch error, and the message names both shapes.
3. Wrap evaluation in torch.no_grad(). Predicting does not need gradients, and recording them wastes memory.

## Try it

:::exercise
title: Try three learning rates
task: Run train.py three times with lr set to 0.005, 0.5 and 1.0. Write down the loss at epochs 1, 2, 10 and 300 for each, and name the shape of each curve using the table in the lesson.
hint: Change only the number in torch.optim.SGD(model.parameters(), lr=0.05). Keep the copied-in starting parameters so your numbers match the lesson.
lang: text
solution:
lr 0.005: 0.4844, 0.4692, 0.3621, 0.0305  -> falls slowly, too small
lr 0.5:   0.4844, 1.1096, 0.1211, 0.1211  -> jumps then flat, too large, dead neurons
lr 1.0:   0.4844, 9.4509, 30.4356, 30.4356 -> explodes then flat, far too large
Learning rate 0.05 from the lesson reaches 0.0051 and is the best of the four.
:::

:::exercise
title: Check the exercise gradients with autograd
task: In autograd_check.py change x to torch.tensor([2.0, 1.0]). Run it and compare the printed gradients with your hand results from the backpropagation exercise.
hint: Hidden 2 is a dead neuron for this input, so expect a row of zeros.
lang: text
solution:
prediction 0.25
loss 0.5625
grad W tensor([[-1.5000, -0.7500],
        [ 0.0000,  0.0000]])
grad b tensor([-0.7500,  0.0000])
grad v tensor([-2.2500, -0.0000])
grad c tensor(-1.5000)
These match the hand results: -1.5, -0.75, -0.75 for Hidden 1, zeros for Hidden 2, -2.25, 0, -1.5 for the output.
:::

## Common mistakes

- Mistake: you forget optimizer.zero_grad() and the loss behaves strangely after the first few epochs. Fix: clear the gradients at the start of every loop; PyTorch accumulates them by design.
- Mistake: you write torch.tensor([1, 2]) with whole numbers and get an error about gradients or about Long tensors. Fix: write 1.0 and 2.0 so the tensor holds decimals.
- Mistake: you call loss.backward() but never optimizer.step(), so the gradients are computed and nothing changes. Fix: the backward pass only fills the grad attributes; the optimizer step applies the update rule.
- Mistake: you judge the run by the loss at the last epoch only. Fix: look at the whole curve; a flat line from epoch 5 and a curve that is still falling need different fixes.
- Mistake: you give Y the shape [8] while the model outputs shape [8, 1], and the loss silently computes the wrong thing. Fix: match the shapes exactly, with one row per example in both X and Y.

## Check your understanding

:::quiz
title: Check: training in PyTorch
q: What does loss.backward() do?
- Runs the forward pass again
* Computes the gradient of the loss for every tensor that has requires_grad set to True
- Updates the parameters
- Prints the loss
why: backward is the backward pass; it fills the grad attributes and changes no parameter values.
q: Which line of the training loop applies the update rule p minus learning rate times gradient?
- optimizer.zero_grad()
- loss = loss_fn(y_hat, Y)
- loss.backward()
* optimizer.step()
why: The optimizer holds the parameters and the learning rate, and step() moves every parameter against its gradient.
q: Your loss curve reads 0.48, 1.11, 0.12, 0.12, 0.12, 0.12 and never changes again. What is the most likely cause?
- The data set is too small
* The learning rate is too large and the hidden neurons died
- Too few epochs
- The model has too many parameters
why: A jump followed by a flat line that starts early is the signature of neurons pushed into the ReLU off state by an oversized step.
q: You remove optimizer.zero_grad() from the loop. What happens?
- Nothing; the line is optional
- The forward pass fails
* The gradients of every step add up, so the updates grow wrong over time
- Training becomes faster
why: PyTorch accumulates gradients into grad, so without clearing, each step uses the sum of all past gradients.
q: X has shape [8, 2]. The model is nn.Linear(2, 2) then ReLU then nn.Linear(2, 1). What is the shape of model(X)?
- [8, 2]
- [2, 1]
* [8, 1]
- [1]
why: Each of the 8 rows passes through the layers and ends as 1 output, so the result is 8 rows by 1 column.
:::

## Go further

The PyTorch tutorials in the links cover tensors and autograd in more depth, with the same vocabulary as this lesson. Karpathy's micrograd video builds autograd from scratch in 100 lines of Python; after the backpropagation lesson you are ready for it, and it will make loss.backward() feel like something you could have written. This module is complete: you can now compute, train and run a network. The next module, [Language as numbers](/courses/ai-foundations/language-as-numbers/tokens), shows how text becomes the numbers that a network like this one can read.
`,
      links: [
        { label: 'Tensors tutorial (PyTorch docs)', url: 'https://pytorch.org/tutorials/beginner/basics/tensorqs_tutorial.html', kind: 'docs' },
        { label: 'Autograd tutorial (PyTorch docs)', url: 'https://pytorch.org/tutorials/beginner/basics/autogradqs_tutorial.html', kind: 'docs' },
        { label: 'Optimizing model parameters (PyTorch docs)', url: 'https://pytorch.org/tutorials/beginner/basics/optimization_tutorial.html', kind: 'docs' },
        { label: 'micrograd: building autograd from scratch (Karpathy)', url: 'https://www.youtube.com/watch?v=VMj-3S1tku0', kind: 'video' },
        { label: 'Google Colab', url: 'https://colab.research.google.com/', kind: 'docs' },
      ],
    },
  ],
}
