import type { Track } from '../types'

export const track: Track = {
  slug: 'open-robotics',
  title: 'Open Robotics',
  tagline: 'Preview. Vision-language-action models and the sim-to-real gap.',
  description:
    'A preview track on embodied AI: how a robot sees, estimates its state, acts, and learns from demonstrations. Content is added weekly.',
  accent: 'var(--accent-robotics)',
  status: 'preview',
  level: 'advanced',
  order: 10,
  audience: 'AI engineers who want to move from language models to robots that act in the world.',
  outcome: 'Explain the modern robot learning stack and read current robotics papers.',
  prerequisites: ['ai-research'],
  modules: [
    {
      slug: 'vla',
      title: 'Vision-language-action models',
      description: 'From web-scale pretraining to motor commands.',
      level: 'advanced',
      lessons: [
        {
          slug: 'what-is-a-vla',
          title: 'What a VLA model is',
          summary: 'A vision-language-action model reads camera frames and an instruction and writes robot actions as tokens.',
          minutes: 12,
          objectives: [
            'Explain the three inputs and one output of a vision-language-action model.',
            'Describe why a model pretrained on web data helps a robot follow new instructions.',
            'Compute the number of action tokens for a 7-dimensional action and a 5-step chunk.',
            'Name the main limits of a VLA model on real hardware.',
          ],
          keyTerms: ['vision-language-action model', 'action token', 'policy', 'control loop', 'generalisation'],
          links: [
            { label: 'RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control', url: 'https://arxiv.org/abs/2307.15818', kind: 'paper' },
            { label: 'RT-1: Robotics Transformer for Real-World Control at Scale', url: 'https://arxiv.org/abs/2212.06817', kind: 'paper' },
            { label: 'OpenVLA: An Open-Source Vision-Language-Action Model', url: 'https://arxiv.org/abs/2406.09246', kind: 'paper' },
            { label: 'OpenVLA code and checkpoints', url: 'https://github.com/openvla/openvla', kind: 'repo' },
            { label: 'LeRobot: open robot learning in PyTorch', url: 'https://github.com/huggingface/lerobot', kind: 'repo' },
          ],
          body: `
## What this lesson covers

A vision-language-action (VLA) model is a neural network that controls a robot. It reads camera images and a text instruction. It writes the next robot action. This lesson explains the inputs, the output, and why web data makes the robot more general.

## Why it matters

Classic robot programs work only for the objects and positions that the programmer planned for. A VLA model can follow an instruction for an object it has never touched. RT-2 moved a can to a picture of a dog without any robot data for that pair. This is the main reason that large robotics labs now train VLA models instead of hand-written controllers.

A VLA model also replaces several separate modules. A classic stack has a detector, a planner, and a controller. A VLA model does the three jobs with one network and one training loop.

## The idea with an example

Consider a robot arm with a camera above the table. The instruction is "put the red block in the bowl". The arm has 7 degrees of freedom: 3 for position, 3 for rotation, and 1 for the gripper.

The model takes three inputs:

- The current camera image, resized to 224 by 224 pixels.
- The instruction, split into text tokens.
- Sometimes the previous actions, so the model knows what it did last.

The table lists the size of each input and of the output in this example.

| Signal | Role | Size in the example |
|---|---|---|
| Camera image | Input | 224 by 224 pixels with 3 colour values each |
| Instruction | Input | About 8 text tokens |
| Previous actions | Optional input | 7 numbers per past step |
| Action | Output | 7 numbers, one per joint or gripper |

The model writes one action. The action is a vector of 7 numbers. Each number is a small change for one joint or for the gripper. For example, the output could be (0.01, -0.02, 0.00, 0.0, 0.0, 0.1, 1.0). The first three numbers move the gripper 1 cm along x and 2 cm along y. The last number closes the gripper.

The diagram shows the path from the camera and the instruction to the motors.

:::flow
title: One pass through a VLA model
Camera -> Vision encoder: 224 by 224 image
Instruction -> Language model: text tokens
Vision encoder -> Language model: image tokens
Language model -> Action tokens: 7 tokens
Action tokens -> Driver: bin centres
Driver -> Motors: 7 joint commands
:::

The control loop then repeats:

1. Read a new camera image.
2. Run the model to get the next action.
3. Send the action to the motors.
4. Wait for the next control tick, often 10 times per second.

After 50 ticks, the block is in the bowl. The model never planned the full path. It chose one small step at a time.

The timing diagram shows one control tick at 10 ticks per second.

:::timeline
title: One control tick at 10 ticks per second
unit: ms
lane Camera
lane Model
lane Motors
Camera: capture frame @0-10
Camera -> Model: image @10-12
Model: encode image and text @12-40
Model: write 7 action tokens @40-90
Model -> Motors: action vector @90-92
Motors: move 1 cm @92-100
:::

Press Next to follow the block from the table to the bowl.

:::scenario
title: Put the red block in the bowl in 50 ticks
state: tick=0, gripper x=0.00 m, gripper y=0.00 m, gripper=open, block=on the table
step: Tick 1. The camera takes a frame. The model writes the action (0.01, -0.02, 0.00, 0.0, 0.0, 0.1, 0.0). The gripper moves 1 cm along x and 2 cm along y.
state: tick=1, gripper x=0.01 m, gripper y=-0.02 m
step: Ticks 2 to 20. The model reads a new frame each tick and repeats a small step. The gripper reaches the block.
state: tick=20, gripper x=0.20 m, gripper y=-0.40 m
step: Tick 21. The last number of the action is 1.0. The gripper closes on the block.
state: tick=21, gripper=closed, block=in the gripper
step: Ticks 22 to 49. Each action moves the gripper a little toward the bowl. The model never plans the full path.
state: tick=49, gripper x=0.05 m, gripper y=0.10 m
step: Tick 50. The last number of the action is 0.0. The gripper opens and the block is in the bowl.
state: tick=50, gripper=open, block=in the bowl
:::

## How it works

A VLA model starts from a vision-language model (VLM). A VLM is a network pretrained to connect images and text. RT-2 started from PaLI-X. OpenVLA started from Prismatic, a 7-billion-weight VLM built on Llama 2.

:::anim
title: One pass through a VLA model, from camera frame to motors
box cam "Camera" @ 150,150 icon: camera size: 180x64
box instr "Instruction" @ 150,290 icon: prompt size: 180x64
box venc "Vision encoder" @ 440,150 icon: model size: 200x64
box llm "Language model" @ 440,290 icon: model size: 200x64
box drv "Driver" @ 740,290 icon: controller size: 180x64
box motors "Motors" @ 740,430 icon: arm size: 180x64
text task "put the red block in the bowl" @ 150,350 size: 16 color: yellow
num toks = 0 @ 740,150 suffix: " action tokens" size: 24
text act "(0.01, -0.02, 0.00, 0.0, 0.0, 0.1, 1.0)" @ 740,215 size: 15 color: grey
text tick "10 ticks per second" @ 440,430 size: 18 color: grey

step: The camera takes a 224 by 224 image. The vision encoder turns it into image tokens.
  show cam, venc
  arrow cam -> venc : 224 by 224 image
step: The instruction "put the red block in the bowl" becomes about 8 text tokens.
  show instr, task, llm
  arrow instr -> llm : 8 text tokens
step: The image tokens join the text tokens inside the language model.
  arrow venc -> llm : image tokens
step: The language model writes 7 action tokens, one per joint and one for the gripper.
  show toks, drv
  arrow llm -> drv : 7 tokens
  & count toks -> 7
step: The driver converts each token to its bin centre. The result is an action of 7 numbers.
  show act
  highlight drv
step: The motors move the gripper 1 cm along x and 2 cm along y, then close it.
  show motors
  restore drv
  arrow drv -> motors : 7 joint commands
step: A new frame arrives and the loop repeats, 10 times per second.
  show tick
  send cam -> venc : next frame
  send llm -> drv : 7 tokens
:::

The developers then fine-tune the VLM on robot episodes. An episode is a sequence of (image, instruction, action) triples recorded while a person teleoperates the robot. The model learns to predict the action from the image and the instruction.

The output must be text-like for a language model. The developers convert each action number to a token. The procedure is:

1. Clip each action dimension to a range, for example -1 to 1.
2. Split the range into 256 equal bins.
3. Replace the number with the bin index, an integer from 0 to 255.
4. Map each integer to a reserved token in the vocabulary.

A 7-dimensional action becomes 7 tokens. If the model predicts a chunk of 5 future steps, it writes 35 tokens per control tick. The loss is the normal next-token cross-entropy loss, so the training code does not change.

The bars compare the number of action tokens per control tick for three chunk sizes.

:::bars
title: Action tokens per control tick for a 7-dimensional action
unit: tokens
One action: 7
Chunk of 5 steps: 35
Chunk of 10 steps: 70
:::

Note: the next lesson covers action tokens in more detail.

At test time, the model outputs 7 tokens. The driver converts each token back to the bin centre. The result is the action vector.

The main limits are speed and data. A 7-billion-weight model runs at about 5 to 10 actions per second on one high-end graphics card. Fine motor tasks need faster control. Robot data is also small. Open X-Embodiment, the largest open set, has about 1 million episodes. Web text has trillions of tokens.

The snippet shows the conversion for the example action with a range of -1 to 1 and 256 bins. Run it with NumPy installed.

:::code
lang: python
file: action_tokens.py
import numpy as np

action = np.array([0.01, -0.02, 0.00, 0.0, 0.0, 0.1, 1.0])
low, high, bins = -1.0, 1.0, 256
first_token = 32000  # start of the reserved token range

# encode: clip, scale to 0..1, pick a bin index, add the offset
clipped = np.clip(action, low, high)
index = np.floor((clipped - low) / (high - low) * bins).astype(int)
index = np.minimum(index, bins - 1)
tokens = first_token + index
print("tokens:", tokens.tolist())

# decode: take the bin centre of each index
centre = low + (index + 0.5) * (high - low) / bins
print("decoded:", np.round(centre, 4).tolist())
print("tokens per tick for a chunk of 5:", 5 * len(action))
:::

:::code
lang: text
tokens: [32129, 32125, 32128, 32128, 32128, 32140, 32255]
decoded: [0.0117, -0.0195, 0.0039, 0.0039, 0.0039, 0.0977, 0.9961]
tokens per tick for a chunk of 5: 35
:::

## Try it

:::exercise
title: Count the control ticks
task: The gripper starts at x = 0.00 m, y = 0.00 m. The block is at x = 0.20 m, y = -0.40 m. At each tick the policy moves the gripper at most 1 cm along x and at most 2 cm along y toward the block. Write a loop that counts the ticks until the gripper is within 1 mm of the block. The answer is 20. Then halve both step sizes and run again. Predict the count before you run it.
hint: At each tick move each coordinate by the smaller of the step size and the remaining distance. Stop when both remaining distances are below 0.001 m.
lang: python
solution:
import numpy as np

def ticks_to_reach(step, target):
    gripper = np.zeros(2)
    ticks = 0
    while np.max(np.abs(target - gripper)) > 0.001:
        remaining = target - gripper
        move = np.sign(remaining) * np.minimum(np.abs(remaining), step)
        gripper = gripper + move
        ticks = ticks + 1
    return ticks

target = np.array([0.20, -0.40])
print(ticks_to_reach(np.array([0.01, 0.02]), target))   # 20
print(ticks_to_reach(np.array([0.005, 0.01]), target))  # 40
:::

## Common mistakes

- Mistake: treat the VLA model as a planner that outputs a full trajectory. Fix: the model outputs one action or a short chunk, and the loop runs again after each step.
- Mistake: fine-tune only on the new task data. Fix: mix in the original robot data, or the model forgets its general skills.
- Mistake: run the model at a control rate it cannot reach. Fix: measure the model latency and set the control tick to that value or slower.
- Mistake: evaluate only on scenes from the training set. Fix: test with new objects, new positions, and new lighting to measure generalisation.

## Check your understanding

Answer the questions with the example robot arm in mind.

:::quiz
title: Check: what a VLA model is
q: What are the two main inputs to a VLA model at each control tick?
- A full 3D map and a planned path
* A camera image and a text instruction
- A joint angle list and a reward
- A depth image and a grasp pose
why: The model reads the current image and the instruction, and sometimes the previous actions, then writes the next action.
q: How many action tokens does a 7-dimensional action with 256 bins produce for a chunk of 5 steps?
- 7
- 256
* 35
- 1280
why: Each dimension becomes one token, so one action is 7 tokens and a chunk of 5 is 5 times 7, or 35 tokens.
q: The model needs 200 ms per call and predicts one action per call. What is the highest control rate the loop can hold?
- 10 actions per second
* 5 actions per second
- 20 actions per second
- 200 actions per second
why: One call takes 0.2 s, so the loop can run at most 1 / 0.2, or 5 times per second.
q: Why does a VLA model start from a pretrained vision-language model?
- The VLM already knows the robot's joint limits
* The VLM already connects images and words, so the robot inherits that knowledge
- The VLM runs faster than a model trained from scratch
- The VLM output is already a 7-number action
why: Web pretraining gives the model concepts such as "dog" or "red block" that the small robot dataset never covers.
q: What does the model output at one control tick?
- The full path from the gripper to the bowl
* One action or a short chunk of actions
- A success probability for the task
- A new instruction for the planner
why: The loop runs the model again after each step, so the model never has to plan the whole trajectory.
:::

## Go further

Read the RT-2 paper for the first clear demonstration of web knowledge transfer to a robot. Read the RT-1 paper for the earlier transformer-only design. The OpenVLA paper and repository show a full open training recipe. LeRobot lets you train and run small policies on a low-cost arm at home. See also the /labs/tokenizer lab to see how text tokens form before you study action tokens.
`,
        },
        {
          slug: 'action-tokens-and-chunking',
          title: 'Action tokens and action chunking',
          summary: 'Discrete action bins, action chunks, and diffusion heads give a language model a way to write continuous motion.',
          minutes: 14,
          objectives: [
            'Convert a continuous action value to a bin index and back.',
            'Compute the quantisation error for a given number of bins.',
            'Explain why action chunking reduces jitter and latency problems.',
            'Compare discrete tokens with a diffusion action head.',
          ],
          keyTerms: ['action token', 'quantisation', 'action chunk', 'diffusion policy', 'temporal ensembling'],
          links: [
            { label: 'Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware (ACT)', url: 'https://arxiv.org/abs/2304.13705', kind: 'paper' },
            { label: 'Diffusion Policy: Visuomotor Policy Learning via Action Diffusion', url: 'https://arxiv.org/abs/2303.04137', kind: 'paper' },
            { label: 'pi0: A Vision-Language-Action Flow Model for General Robot Control', url: 'https://arxiv.org/abs/2410.24164', kind: 'paper' },
            { label: 'Octo: An Open-Source Generalist Robot Policy', url: 'https://arxiv.org/abs/2405.12213', kind: 'paper' },
            { label: 'LeRobot policies (ACT, Diffusion Policy, VLA)', url: 'https://github.com/huggingface/lerobot', kind: 'repo' },
          ],
          body: `
## What this lesson covers

A robot action is a vector of continuous numbers. A language model writes discrete tokens. This lesson explains how to convert between the two. It also explains action chunking, a method to predict several future steps at once.

## Why it matters

The conversion sets the precision of the robot. Too few bins and the gripper cannot make small moves. Too many bins and the model must learn a large vocabulary from little data. Action chunking decides how often the model runs and how smooth the motion is. Both choices show up in every modern policy: RT-2, OpenVLA, ACT, Diffusion Policy, and pi0.

## The idea with an example

Take one action dimension: the change in gripper height. The allowed range is -0.05 m to +0.05 m. We use 256 bins.

:::anim
title: The value 0.012 m becomes bin 158, token 32158, and 0.0118 m again
line range from 110,300 to 620,300 color: grey
text lo "-0.05 m" @ 110,340 size: 16 color: grey
text mid "0" @ 365,340 size: 16 color: grey
text hi "+0.05 m" @ 620,340 size: 16 color: grey
text bins "256 bins, each 0.00039 m wide" @ 365,230 size: 17 color: grey
dot v @ 426,300 r: 9 color: yellow label: "0.012 m"
dot c @ 426,300 r: 9 color: green label: "bin centre 0.0118 m"
num shifted = 0.012 @ 790,120 prefix: "shifted = " digits: 3 size: 22
num quot = 0 @ 790,185 prefix: "/ 0.00039 = " digits: 1 size: 22
num idx = 0 @ 790,250 prefix: "bin index = " size: 22
num tok = 32000 @ 790,315 prefix: "token id = " size: 22
num dec = 0 @ 790,380 prefix: "decoded = " suffix: " m" digits: 4 size: 22 color: green
num err = 0 @ 790,445 prefix: "error = " suffix: " mm" digits: 1 size: 22 color: red

step: One action dimension, the change in gripper height, has a range from -0.05 m to +0.05 m.
  draw range
  show lo, mid, hi
step: The range splits into 256 equal bins. Each bin is 0.00039 m wide.
  show bins
step: The value to encode is 0.012 m, a little above the middle of the range.
  show v
step: Shift the value so the range starts at zero: 0.012 + 0.05 = 0.062.
  show shifted
  count shifted -> 0.062
  & label lo "0"
  & label mid "0.05"
  & label hi "0.1 m"
step: Divide by the bin width: 0.062 / 0.00039 = 158.7. Round down to bin index 158.
  show quot, idx
  count quot -> 158.7
  count idx -> 158
step: Add the index to the start of the reserved token range, 32000. The token id is 32158.
  show tok
  count tok -> 32158
step: Decode with the bin centre: (158 + 0.5) x 0.00039 - 0.05 = 0.0118 m.
  hide v
  show c, dec
  count dec -> 0.0118
step: The decoded value sits 0.0002 m from the original. The error is 0.2 mm, half a bin at most.
  show err
  count err -> 0.2
  pulse c
:::

The bin width is the range divided by the number of bins:

$$w = \\frac{0.05 - (-0.05)}{256} = \\frac{0.1}{256} \\approx 0.00039 \\text{ m}$$

Here $w$ is the width of one bin in metres. The maximum rounding error is half a bin, about 0.2 mm. That is fine for a block in a bowl. It is too coarse to insert a 0.1 mm pin.

The bars compare the maximum rounding error for three bin counts with the pin tolerance.

:::bars
title: Maximum rounding error over a 0.1 m range
unit: mm
64 bins: 0.78
256 bins: 0.2
1024 bins: 0.05
Pin tolerance: 0.1
:::

Now convert the value 0.012 m to a token:

1. Shift the value to start at zero: 0.012 + 0.05 = 0.062.
2. Divide by the bin width: 0.062 / 0.00039 = 158.7.
3. Round down: bin index 158.
4. Add the index to the start of the reserved token range to get the token id.

To convert back, take the bin centre: (158 + 0.5) × 0.00039 - 0.05 = 0.0118 m. The error is 0.2 mm.

Press Next to follow the value 0.012 m through the conversion and back.

:::scenario
title: Convert 0.012 m to a token and back
state: value=0.012 m, bin width=0.00039 m, bin index=none, decoded=none
step: Shift the value so the range starts at zero. 0.012 + 0.05 = 0.062.
state: shifted=0.062 m
step: Divide by the bin width. 0.062 / 0.00039 = 158.7.
state: quotient=158.7
step: Round down. The bin index is 158.
state: bin index=158
step: Add the index to the start of the reserved token range. If that range starts at 32000, the token id is 32158.
state: token id=32158
step: Decode with the bin centre. (158 + 0.5) x 0.00039 - 0.05 = 0.0118 m.
state: decoded=0.0118 m
step: Compare with the original value. The error is 0.0002 m, or 0.2 mm.
state: error=0.2 mm
:::

Now add chunking. Instead of one action per tick, the model predicts a chunk of 10 future actions. The control loop runs the model once, then plays the 10 actions over 10 ticks. At 10 ticks per second, the model runs once per second. A model with 500 ms of latency can now keep up.

The timing diagram shows one chunk of 10 actions with a model that needs 500 ms per call.

:::timeline
title: Action chunking with a 500 ms model at 10 ticks per second
unit: ms
lane Camera
lane Model
lane Driver
Camera -> Model: frame 1 @0-10
Model: predict chunk 1 @10-510
Model -> Driver: 10 actions @510-520
Driver: play actions 1 to 10 @520-1520
Camera -> Model: frame 2 @1010-1020
Model: predict chunk 2 @1020-1520
Model -> Driver: next 10 actions @1520-1530
Driver: play actions 11 to 20 @1530-2530
:::

## How it works

Quantisation into bins is the method of RT-2 and OpenVLA. The procedure for a full action vector is:

1. Collect all training actions and find the 1st and 99th percentile for each dimension.
2. Use these percentiles as the range, so rare extreme values do not waste bins.
3. Split each range into 256 bins.
4. Replace each dimension with its bin index.
5. Train with next-token cross-entropy loss over the sequence of indices.

Action chunking is the method of ACT. The model outputs a chunk of $k$ actions, where $k$ is the chunk size, often 10 to 100. Chunking helps for three reasons. It reduces the number of model calls. It reduces jitter because the model commits to a short plan. It helps the model learn long pauses, which a one-step policy often skips.

Temporal ensembling smooths the join between chunks. At each tick, several past chunks each predicted an action for the current time. The driver averages them with weights that favour the newest prediction.

Diffusion Policy and pi0 replace tokens with a continuous head. The model starts from random noise with the shape of the chunk. It removes the noise in several steps until a clean action chunk remains. This avoids bins and handles cases where two different actions are both correct. For example, a robot can go left or right around a cup. A bin model may average to the middle and hit the cup. A diffusion head picks one side.

The table compares the three output heads.

| Policy | Output head | Chunk size | Two valid actions |
|---|---|---|---|
| RT-2 and OpenVLA | 256 bins per dimension | 1 | May average to the middle |
| ACT | Continuous chunk with an L1 loss | 10 to 100 | May average to the middle |
| Diffusion Policy and pi0 | Denoising head, 10 or more steps | 16 to 50 | Picks one side |

Note: a diffusion head needs 10 or more denoising steps, so the model latency rises. Chunking makes up for the extra time.

The snippet encodes the value 0.012 m from the example and decodes it again.

:::code
lang: python
file: quantise.py
low, high, bins = -0.05, 0.05, 256
width = (high - low) / bins

def encode(value):
    index = int((min(max(value, low), high) - low) / width)
    return min(index, bins - 1)

def decode(index):
    return low + (index + 0.5) * width

value = 0.012
index = encode(value)
back = decode(index)
print(f"bin width: {width:.6f} m")
print(f"index: {index}, token id: {32000 + index}")
print(f"decoded: {back:.4f} m, error: {abs(back - value) * 1000:.2f} mm")
:::

:::code
lang: text
bin width: 0.000391 m
index: 158, token id: 32158
decoded: 0.0119 m, error: 0.09 mm
:::

Note: the error for this one value is 0.09 mm. The maximum error over all values is half a bin, 0.2 mm.

## Try it

:::exercise
title: Measure the rounding error for three bin counts
task: Use the range -0.05 m to 0.05 m from the example. For 64, 256, and 1024 bins, encode and decode 10,000 evenly spaced values. Report the maximum error in millimetres for each bin count. Compare your numbers with the bars in this lesson: 0.78, 0.2, and 0.05 mm.
hint: The maximum error is close to half the bin width. Use numpy.linspace for the values and numpy.floor for the index.
lang: python
solution:
import numpy as np

low, high = -0.05, 0.05
values = np.linspace(low, high, 10000)

for bins in [64, 256, 1024]:
    width = (high - low) / bins
    index = np.minimum(np.floor((values - low) / width), bins - 1)
    decoded = low + (index + 0.5) * width
    error_mm = np.max(np.abs(decoded - values)) * 1000
    print(f"{bins} bins: max error {error_mm:.2f} mm")
:::

## Common mistakes

- Mistake: use the full min and max of the data as the bin range. Fix: use percentiles, or one outlier makes all other bins too coarse.
- Mistake: set the chunk size larger than the time the scene stays the same. Fix: keep the chunk short enough that the robot reacts to a moved object.
- Mistake: forget to store the bin ranges with the checkpoint. Fix: save the ranges in the model config, or the decoded actions are wrong.
- Mistake: compare policies at different control rates. Fix: run both at the same tick rate and the same chunk size.

## Check your understanding

:::quiz
title: Check: action tokens and chunking
q: What is the maximum rounding error with 256 bins over a 0.1 m range?
- About 0.4 mm, one full bin
* About 0.2 mm, half of one bin
- About 0.1 m divided by 256 squared
- Zero, because the bin centre is exact
why: The bin width is 0.1 / 256, about 0.39 mm, and a value can be at most half a bin from its bin centre.
q: You switch from 256 bins to 1024 bins over the same range. What happens to the maximum rounding error?
- It doubles
- It stays the same
* It falls to one quarter
- It falls to one half
why: Four times as many bins gives bins one quarter as wide, so the half-bin error also falls to one quarter.
q: Why does action chunking help a model with 500 ms of latency?
- The model becomes faster per call
* The model runs once per chunk, so it has more time per call
- The driver can skip the camera between chunks
- The chunk removes the need for bins
why: With a chunk of 10 actions at 10 ticks per second, the model only has to finish one call per second.
q: What problem does a diffusion head solve that bins do not?
- It needs no training data from the robot
- It removes the need for a vision encoder
* It can represent two valid actions without averaging them into an invalid one
- It always runs faster than a token head
why: A bin head trained with cross-entropy may average left and right into the middle, while a diffusion head samples one side.
q: Why use the 1st and 99th percentiles of the data as the bin range instead of the minimum and maximum?
* One extreme outlier would make all other bins too coarse
- Percentiles make the model output more tokens
- The minimum and maximum are not stored in the dataset
- The language model cannot handle negative numbers
why: A single rare value far from the rest would stretch the range and waste most bins on values that never occur.
:::

## Go further

Read the ACT paper for action chunking and temporal ensembling with low-cost hardware. Read the Diffusion Policy paper for the continuous action head. The pi0 paper combines a VLM backbone with a flow-matching action head. The Octo paper shows a smaller open generalist policy. All of these are implemented in the LeRobot repository, so you can read the code next to the paper.
`,
        },
        {
          slug: 'robot-data-and-generalisation',
          title: 'Robot data, cross-embodiment, and generalisation',
          summary: 'Robot datasets are small, so VLA models pool episodes from many robots and measure success on unseen objects.',
          minutes: 13,
          objectives: [
            'Estimate the size of a robot dataset in episodes, hours, and frames.',
            'Explain what cross-embodiment training is and why it helps.',
            'Design an evaluation that separates seen and unseen objects.',
            'Compute a success rate with a confidence interval from a small number of trials.',
          ],
          keyTerms: ['episode', 'teleoperation', 'cross-embodiment', 'success rate', 'distribution shift'],
          links: [
            { label: 'Open X-Embodiment: Robotic Learning Datasets and RT-X Models', url: 'https://arxiv.org/abs/2310.08864', kind: 'paper' },
            { label: 'DROID: A Large-Scale In-The-Wild Robot Manipulation Dataset', url: 'https://arxiv.org/abs/2403.12945', kind: 'paper' },
            { label: 'BridgeData V2: A Dataset for Robot Learning at Scale', url: 'https://arxiv.org/abs/2308.12952', kind: 'paper' },
            { label: 'LeRobot datasets on the Hugging Face Hub', url: 'https://huggingface.co/lerobot', kind: 'docs' },
            { label: 'Hugging Face datasets documentation', url: 'https://huggingface.co/docs/datasets', kind: 'docs' },
          ],
          body: `
## What this lesson covers

A VLA model learns from episodes recorded on real robots. This lesson explains how big these datasets are, how labs pool data from many robot types, and how to measure whether a policy generalises.

## Why it matters

Robot data is the limit on robot learning. A language model sees trillions of tokens. The largest open robot dataset has about one million episodes. Every hour of teleoperation costs a person and a robot. So the choice of what to record, and how to test, decides whether a project works.

:::video
id: bkVCAk9Nsss
why: Watch the first 20 minutes. Chelsea Finn motivates multi-task learning with robot examples, which is the idea behind training one model on many robots and tasks.
:::

## The idea with an example

A lab records episodes with teleoperation. A person moves a controller, and the robot copies the motion. The system logs the camera image and the action at 10 frames per second.

Suppose one episode lasts 30 seconds. That is 300 frames. The lab records 500 episodes per day. After 20 days it has 10,000 episodes, 3 million frames, and about 83 hours of robot time.

Press Next to follow the dataset as it grows over 20 days.

:::scenario
title: Twenty days of teleoperation
state: day=0, episodes=0, frames=0, robot hours=0
step: A person teleoperates for one day. The system logs 500 episodes of 30 seconds at 10 frames per second.
state: day=1, episodes=500, frames=150000, robot hours=4.2
step: Each episode holds 300 frames. So one day gives 150000 frames and about 4.2 hours of robot time.
step: After 10 days the dataset has 5000 episodes.
state: day=10, episodes=5000, frames=1500000, robot hours=41.7
step: After 20 days the dataset has 10000 episodes and 3 million frames.
state: day=20, episodes=10000, frames=3000000, robot hours=83.3
step: Open X-Embodiment has 100 times more episodes. One lab cannot record that alone.
:::

Now compare this with Open X-Embodiment. That dataset pools 22 robot types from 21 labs. It has over 1 million episodes and 527 skills. One lab cannot record that alone, so pooling is the only way to reach that size.

The bars compare the two dataset sizes.

:::bars
title: Episodes after 20 days versus Open X-Embodiment
unit: episodes
One lab after 20 days: 10000
Open X-Embodiment: 1000000 (22 robot types from 21 labs)
:::

The RT-X experiment trained one model on all robots and tested on each robot. The pooled model beat the single-robot model on 5 of 6 labs tested. The pooled model had a mean success rate about 50 percent higher in the small-data labs.

## How it works

Cross-embodiment training means one model learns from robots with different arms, cameras, and grippers. The method is simple:

1. Convert every dataset to the same format: image, instruction, action vector.
2. Pad or map the action vector to a common 7-dimensional layout.
3. Sample batches with a weight per dataset, so large datasets do not drown small ones.
4. Train one model on the mixture.
5. Fine-tune on the target robot with a small set of its own episodes.

:::anim
title: Episodes from 21 labs train one shared model
box labA "Lab A episodes" @ 150,150 icon: dataset size: 180x64
box labB "Lab B episodes" @ 150,290 icon: dataset size: 180x64
box labC "Lab 21 episodes" @ 150,430 icon: dataset size: 180x64
box conv "Converter" @ 440,220 size: 170x64
box samp "Sampler" @ 440,360 size: 170x64
box model "Shared model" @ 740,290 icon: model size: 200x64
box robot "Target robot" @ 740,430 icon: robot size: 200x64
num eps = 0 @ 740,150 suffix: " episodes" size: 26
text fmt "image, instruction,|7-dimensional action" @ 440,130 size: 16 color: grey
text res "beats the single-robot model|in 5 of 6 labs" @ 440,470 size: 16 color: green

step: One lab records 10,000 episodes in 20 days. That is small for a general policy.
  show labA, eps
  count eps -> 10000
step: Twenty-one labs with 22 robot types pool their episodes. Together they hold 1 million.
  show labB, labC
  count eps -> 1000000 (2s)
step: A converter puts every episode in one format: image, instruction, and a 7-dimensional action.
  show conv, fmt
  arrow labA -> conv : images and actions
  & arrow labB -> conv : images and actions
  & arrow labC -> conv : images and actions
step: A sampler gives each dataset a weight, so the large sets do not drown the small ones.
  show samp
  arrow conv -> samp : common format
step: One shared model trains on the mixed batches. A reach-and-grasp motion looks alike on most arms.
  show model
  arrow samp -> model : mixed batches
  highlight model
step: A small set of the target robot's own episodes fine-tunes the shared model.
  show robot
  restore model
  arrow model -> robot : fine-tune
step: In RT-X, the pooled model beats the single-robot model in 5 of 6 labs.
  show res
  pulse robot
:::

The diagram shows how episodes from two labs reach one model.

:::flow
title: Cross-embodiment training
Lab A episodes -> Converter: images and actions
Lab B episodes -> Converter: images and actions
Converter -> Common format: 7-dimensional action
Common format -> Sampler: weight per dataset
Sampler -> Shared model: mixed batches
Shared model -> Target robot: fine-tune on its episodes
:::

The model learns common structure. A reach-and-grasp motion looks similar on most arms. The cameras differ, but the vision backbone already handles many image styles from web pretraining.

Generalisation is the ability to succeed on cases outside the training data. Evaluate it with separate test levels:

| Level | What changes | Example |
|---|---|---|
| Seen | Nothing | Same red block, same position |
| Position | Object location | Red block moved 10 cm |
| Object | Object instance | Blue block, never seen |
| Scene | Background or lighting | New tablecloth |
| Instruction | Wording or concept | "the block next to the apple" |

Success rate is the number of successful trials divided by the number of trials. With small trial counts the uncertainty is large. For 20 trials and 15 successes, the rate is 0.75. The standard error is:

$$\\sigma = \\sqrt{\\frac{p(1-p)}{n}} = \\sqrt{\\frac{0.75 \\times 0.25}{20}} \\approx 0.097$$

Here $p$ is the success rate and $n$ is the number of trials. So the result is 75 percent plus or minus about 10 percent. A difference of 5 percent between two policies at 20 trials is noise.

The bars show how the standard error falls as the number of trials rises.

:::bars
title: Standard error of a 75 percent success rate
unit: percent
5 trials: 19.4
20 trials: 9.7
50 trials: 6.1
100 trials: 4.3
:::

Caution: a policy that scores 90 percent on seen objects and 20 percent on unseen objects has memorised the training set. Report both numbers.

Distribution shift is the gap between training conditions and test conditions. Lighting, camera angle, and table height all shift. Record data under many conditions to reduce the shift.

The snippet computes the dataset size from the example and the standard error for four trial counts.

:::code
lang: python
file: dataset_and_error.py
import math

episodes_per_day, seconds, fps, days = 500, 30, 10, 20
episodes = episodes_per_day * days
frames = episodes * seconds * fps
hours = episodes * seconds / 3600
print(f"{episodes} episodes, {frames} frames, {hours:.1f} robot hours")

p = 0.75
for n in [5, 20, 50, 100]:
    se = math.sqrt(p * (1 - p) / n)
    print(f"{n} trials: {p:.0%} +/- {se:.1%}")
:::

:::code
lang: text
10000 episodes, 3000000 frames, 83.3 robot hours
5 trials: 75% +/- 19.4%
20 trials: 75% +/- 9.7%
50 trials: 75% +/- 6.1%
100 trials: 75% +/- 4.3%
:::

## Try it

:::exercise
title: Plan the number of trials
task: Your policy has a success rate near 75 percent. You want to show that it beats a baseline by 10 percent. Compute the number of trials that brings the standard error to 5 percent, so that the gap is twice the error. Then compute the trials for an error of 2 percent. Do it on paper first, then check with Python.
hint: Solve the standard error formula for n. The result is n = p (1 - p) divided by the squared error.
lang: python
solution:
p = 0.75
for target in [0.05, 0.02]:
    n = p * (1 - p) / (target * target)
    print(f"error {target:.0%}: about {n:.0f} trials")
# error 5%: about 75 trials
# error 2%: about 469 trials
:::

## Common mistakes

- Mistake: record all episodes from one camera position. Fix: move the camera a little between sessions so the policy does not depend on exact pixels.
- Mistake: report success on 5 trials. Fix: run at least 20 trials per condition and report the standard error.
- Mistake: let the person who trained the policy also judge success. Fix: write a clear success rule before the test, and have a second person score.
- Mistake: mix the test objects into the training set. Fix: keep a list of held-out objects and never record with them.

## Check your understanding

:::quiz
title: Check: robot data and generalisation
q: How many frames does a 30-second episode at 10 frames per second hold?
- 30
* 300
- 3000
- 40
why: Thirty seconds times 10 frames per second gives 300 frames.
q: What does cross-embodiment training mean?
- One robot trains on data from many cameras
* One model trains on data from many different robot types
- One policy transfers from simulation to a real robot
- One model trains on web images and then on robot images
why: The model learns from arms, grippers, and cameras of many labs, mapped to one common action format.
q: Two policies score 70 percent and 75 percent on 20 trials each. What should you conclude?
- The second policy is better
- The first policy memorised the training set
* The gap is inside the noise, so you need more trials
- The test objects were seen in training
why: The standard error at 20 trials is about 10 percent, which is larger than the 5 percent gap.
q: A policy scores 90 percent on seen objects and 20 percent on unseen objects. What is the most likely explanation?
- The unseen objects are too heavy for the gripper
* The policy memorised the training scenes and does not generalise
- The camera moved between the two tests
- The success rule was unclear
why: A large gap between seen and unseen results is the signature of a policy that depends on exact training pixels.
q: Why does the sampler use a weight per dataset during cross-embodiment training?
- To make every batch come from the target robot
* So that large datasets do not drown small ones
- To remove episodes with low success
- To match the frame rate of every robot
why: Without weights, a dataset with 10 times more episodes would fill 10 times more of each batch and the small robots would be ignored.
:::

## Go further

Read the Open X-Embodiment paper for the pooling method and the RT-X results. DROID and BridgeData V2 show how to record diverse data in many scenes. The LeRobot datasets on the Hugging Face Hub give you real episodes to inspect, and the datasets documentation explains the storage format. The /labs/agent-control-room lab shows how per-step success rates multiply over a long task.
`,
        },
      ],
    },
    {
      slug: 'perception-and-state',
      title: 'Perception and state estimation',
      description: 'Cameras, depth, and the Kalman filter that turns noisy readings into a state.',
      level: 'advanced',
      lessons: [
        {
          slug: 'cameras-and-the-pinhole-model',
          title: 'Cameras and the pinhole model',
          summary: 'The pinhole model maps a 3D point to a pixel with the focal length and the principal point.',
          minutes: 13,
          objectives: [
            'Project a 3D point to a pixel with the pinhole equation.',
            'Explain the four intrinsic parameters of a camera.',
            'Describe what calibration measures and how to run it.',
            'Convert a pixel and a known depth back to a 3D point.',
          ],
          keyTerms: ['pinhole model', 'focal length', 'principal point', 'intrinsic matrix', 'calibration', 'extrinsic matrix'],
          links: [
            { label: 'OpenCV camera calibration tutorial', url: 'https://docs.opencv.org/4.x/dc/dbb/tutorial_py_calibration.html', kind: 'docs' },
            { label: 'OpenCV documentation', url: 'https://docs.opencv.org/4.x/', kind: 'docs' },
            { label: 'MIT OpenCourseWare on YouTube', url: 'https://www.youtube.com/@MITOpenCourseWare', kind: 'video' },
          ],
          body: `
## What this lesson covers

A camera turns a 3D scene into a 2D image. This lesson explains the pinhole model, the simplest equation for that step. You learn the four intrinsic parameters and how calibration finds them.

## Why it matters

A robot must know where an object is in metres, not in pixels. The pinhole model is the link. Every depth camera, every pose estimator, and every grasp planner uses it. If the parameters are wrong by 2 percent, a grasp at 50 cm misses by 1 cm.

## The idea with an example

A camera has an image of 640 by 480 pixels. Its focal length is 500 pixels. Its principal point is at (320, 240), the centre of the image.

:::anim
title: A block corner at 0.5 m lands on pixel (420, 290)
rect img @ 330,290 size: 320x240 color: grey
text cap "image: 640 by 480 pixels" @ 330,140 size: 16 color: grey
dot pp @ 330,290 r: 6 color: grey label: "c = (320, 240)"
dot px @ 330,290 r: 9 color: yellow
vector off from 330,290 to 380,315 color: yellow
text xyz "corner at X = 0.1, Y = 0.05, Z = 0.5 m" @ 330,450 size: 17 color: yellow
num nz = 0.5 @ 790,110 prefix: "Z = " suffix: " m" digits: 1 size: 22
num nxz = 0 @ 790,170 prefix: "X/Z = " digits: 2 size: 22
num nyz = 0 @ 790,210 prefix: "Y/Z = " digits: 2 size: 22
num nfx = 0 @ 790,275 prefix: "f X/Z = " size: 22
num nfy = 0 @ 790,315 prefix: "f Y/Z = " size: 22
num nu = 320 @ 790,380 prefix: "u = " size: 22 color: yellow
num nv = 240 @ 790,420 prefix: "v = " size: 22 color: yellow

step: The image is 640 by 480 pixels. The principal point (320, 240) sits at its centre.
  show img, cap, pp
step: A block corner sits 0.1 m right, 0.05 m down, and 0.5 m in front of the camera.
  show xyz, nz
step: Divide X and Y by Z: 0.1 / 0.5 = 0.2 and 0.05 / 0.5 = 0.1.
  show nxz, nyz
  count nxz -> 0.2
  & count nyz -> 0.1
step: Multiply by the focal length of 500 pixels: 100 and 50 pixels from the centre.
  show nfx, nfy
  count nfx -> 100
  & count nfy -> 50
step: Add the principal point: u = 320 + 100 = 420 and v = 240 + 50 = 290.
  show px, nu, nv
  move px -> 380,315
  & draw off
  & count nu -> 420
  & count nv -> 290
step: Move the block to Z = 1.0 m. Every offset halves and the pixel becomes (370, 265).
  count nz -> 1.0 (2s)
  & count nxz -> 0.1 (2s)
  & count nyz -> 0.05 (2s)
  & count nfx -> 50 (2s)
  & count nfy -> 25 (2s)
  & count nu -> 370 (2s)
  & count nv -> 265 (2s)
  & move px -> 355,302 (2s)
  & vector off -> 355,302 (2s)
  & label xyz "corner at X = 0.1, Y = 0.05, Z = 1.0 m"
step: Twice as far from the camera means half as far from the image centre.
  pulse px
:::

A block corner sits at 0.1 m to the right, 0.05 m down, and 0.5 m in front of the camera. In camera coordinates, the point is $(X, Y, Z) = (0.1, 0.05, 0.5)$.

Project the point to a pixel:

1. Divide X and Y by Z: 0.1 / 0.5 = 0.2 and 0.05 / 0.5 = 0.1.
2. Multiply by the focal length: 0.2 × 500 = 100 and 0.1 × 500 = 50.
3. Add the principal point: 320 + 100 = 420 and 240 + 50 = 290.

The corner appears at pixel (420, 290).

Now move the block to 1.0 m away. Step 1 gives 0.1 and 0.05. Step 2 gives 50 and 25. The pixel is (370, 265). The block moved half as far from the centre, because it is twice as far from the camera.

Press Next to follow the corner from metres to pixels.

:::scenario
title: Project a block corner to a pixel
state: X=0.1 m, Y=0.05 m, Z=0.5 m, u=none, v=none
step: Divide X and Y by Z. 0.1 / 0.5 = 0.2 and 0.05 / 0.5 = 0.1.
state: X/Z=0.2, Y/Z=0.1
step: Multiply by the focal length of 500 pixels. 0.2 x 500 = 100 and 0.1 x 500 = 50.
state: f X/Z=100, f Y/Z=50
step: Add the principal point (320, 240). The pixel is (420, 290).
state: u=420, v=290
step: Move the block to Z = 1.0 m. The first step now gives 0.1 and 0.05.
state: Z=1.0 m, X/Z=0.1, Y/Z=0.05
step: Multiply by 500 and add the principal point. The pixel is (370, 265). The block is twice as far, so it is half as far from the centre.
state: f X/Z=50, f Y/Z=25, u=370, v=265
:::

The bars compare the horizontal offset from the image centre at three depths.

:::bars
title: Horizontal offset of the corner from the image centre
unit: pixels
Depth 0.5 m: 100
Depth 1.0 m: 50
Depth 2.0 m: 25
:::

## How it works

The pinhole model is:

$$u = f_x \\frac{X}{Z} + c_x, \\qquad v = f_y \\frac{Y}{Z} + c_y$$

Here $(u, v)$ is the pixel, $(X, Y, Z)$ is the point in camera coordinates in metres, $f_x$ and $f_y$ are the focal lengths in pixels, and $(c_x, c_y)$ is the principal point. The four numbers $f_x$, $f_y$, $c_x$, $c_y$ are the intrinsic parameters. They form the intrinsic matrix $K$:

$$K = \\begin{pmatrix} f_x & 0 & c_x \\\\ 0 & f_y & c_y \\\\ 0 & 0 & 1 \\end{pmatrix}$$

The grid shows the same matrix with the values of the example camera.

:::matrix
title: Intrinsic matrix K of the example camera
cols: column 1, column 2, column 3
row 1: 500, 0, 320
row 2: 0, 500, 240
row 3: 0, 0, 1
:::

The focal length in pixels depends on the lens and the sensor. A wide lens has a small focal length. A zoom lens has a large one.

The table lists the four intrinsic parameters of the example camera.

| Parameter | Symbol | Example value | Meaning |
|---|---|---|---|
| Horizontal focal length | $f_x$ | 500 pixels | Scale from X/Z to pixels along $u$ |
| Vertical focal length | $f_y$ | 500 pixels | Scale from Y/Z to pixels along $v$ |
| Principal point column | $c_x$ | 320 pixels | Column where the optical axis meets the sensor |
| Principal point row | $c_y$ | 240 pixels | Row where the optical axis meets the sensor |

Real lenses also bend straight lines near the edge of the image. This is distortion. Calibration measures the intrinsic parameters and the distortion together. The procedure is:

1. Print a chessboard pattern with known square size, for example 25 mm.
2. Take 20 or more photos of the board at different angles and distances.
3. Detect the inner corners in each photo.
4. Run the calibration solver, for example cv.calibrateCamera in OpenCV.
5. Check the reprojection error. A good result is under 0.5 pixels.

The reprojection error is the distance between the detected corners and the corners that the model predicts.

To go from a pixel back to 3D, you need the depth $Z$. Then:

$$X = \\frac{(u - c_x) Z}{f_x}, \\qquad Y = \\frac{(v - c_y) Z}{f_y}$$

With the first example, pixel (420, 290) and depth 0.5 m, we get X = (420 - 320) × 0.5 / 500 = 0.1 m. This matches.

The extrinsic matrix is a rotation and a translation. It moves a point from robot coordinates to camera coordinates. Hand-eye calibration finds it. The next lessons use the depth $Z$ from a depth sensor.

The diagram shows the full path from robot coordinates to a pixel.

:::flow
title: From a point in robot coordinates to a pixel
Robot coordinates -> Extrinsic matrix: rotate and translate
Extrinsic matrix -> Camera coordinates: (X, Y, Z) in metres
Camera coordinates -> Divide by Z: (X/Z, Y/Z)
Divide by Z -> Intrinsic matrix: scale by f, shift by c
Intrinsic matrix -> Pixel: (u, v)
:::

The snippet projects the block corner with the intrinsic matrix and converts the pixel back to metres. Run it with NumPy installed.

:::code
lang: python
file: pinhole.py
import numpy as np

K = np.array([[500.0, 0.0, 320.0],
              [0.0, 500.0, 240.0],
              [0.0, 0.0, 1.0]])

def project(point, K):
    x = K @ point          # (f X + c Z, f Y + c Z, Z)
    return x[:2] / x[2]    # divide by Z

def unproject(u, v, Z, K):
    X = (u - K[0, 2]) * Z / K[0, 0]
    Y = (v - K[1, 2]) * Z / K[1, 1]
    return np.array([X, Y, Z])

corner = np.array([0.1, 0.05, 0.5])
print("pixel at 0.5 m:", project(corner, K))
print("pixel at 1.0 m:", project(np.array([0.1, 0.05, 1.0]), K))
print("back to metres:", unproject(420, 290, 0.5, K))
:::

:::code
lang: text
pixel at 0.5 m: [420. 290.]
pixel at 1.0 m: [370. 265.]
back to metres: [0.1  0.05 0.5 ]
:::

## Try it

:::exercise
title: Project a cube face
task: A 10 cm cube sits on the optical axis of the example camera. Its front face is at Z = 0.45 m and its back face is at Z = 0.55 m. Project the four corners of each face with f = 500 and principal point (320, 240). Report the width of each face in pixels. Predict which face looks larger before you compute.
hint: The front face corners are at X = plus or minus 0.05 m and Y = plus or minus 0.05 m with Z = 0.45 m. The width is the difference between the u values of the left and right corners.
lang: python
solution:
import numpy as np

K = np.array([[500.0, 0.0, 320.0], [0.0, 500.0, 240.0], [0.0, 0.0, 1.0]])

def project(point):
    x = K @ point
    return x[:2] / x[2]

for Z in [0.45, 0.55]:
    corners = [np.array([sx * 0.05, sy * 0.05, Z]) for sx in (-1, 1) for sy in (-1, 1)]
    pixels = np.array([project(c) for c in corners])
    width = pixels[:, 0].max() - pixels[:, 0].min()
    print(f"face at {Z} m: width {width:.1f} px")
# face at 0.45 m: width 111.1 px
# face at 0.55 m: width 90.9 px
:::

## Common mistakes

- Mistake: use the focal length in millimetres from the lens box. Fix: use the focal length in pixels from calibration.
- Mistake: calibrate with photos only at the image centre. Fix: cover the edges and corners, because distortion is largest there.
- Mistake: change the camera resolution after calibration. Fix: recalibrate, or scale the intrinsic parameters by the same factor.
- Mistake: swap the row and column order of a pixel. Fix: define $u$ as the column and $v$ as the row, and keep this everywhere.

## Check your understanding

:::quiz
title: Check: the pinhole model
q: Where does the point (0.2, 0.0, 1.0) appear with f = 500 and principal point (320, 240)?
- Pixel (100, 0)
* Pixel (420, 240)
- Pixel (520, 240)
- Pixel (320, 340)
why: X / Z = 0.2, times 500 gives 100, plus 320 gives u = 420, and Y = 0 keeps v at 240.
q: Which four numbers are the intrinsic parameters?
- Rotation, translation, focal length, and distortion
* The two focal lengths and the two principal point coordinates
- Width, height, frame rate, and exposure
- Baseline, disparity, depth, and focal length
why: The intrinsic matrix K holds fx, fy, cx, and cy, which map camera coordinates to pixels.
q: What does a reprojection error of 0.3 pixels after calibration mean?
- The lens has 0.3 percent distortion
- The camera is 0.3 mm from its nominal position
* The model predicts corner positions within 0.3 pixels of the detected ones, which is good
- The chessboard squares were 0.3 mm too large
why: Reprojection error measures the pixel distance between detected and predicted corners, and under 0.5 pixels is a good result.
q: You halve the camera resolution from 640 by 480 to 320 by 240 without recalibrating. What happens to the intrinsic parameters?
- They stay correct because the lens did not change
* They are twice too large, so projected pixels land in the wrong place
- Only the principal point changes
- Only the distortion changes
why: Focal length and principal point are in pixels, so every parameter must be scaled by the same factor as the image.
q: A pixel is at (420, 290) and the depth is 1.0 m instead of 0.5 m. What is X?
- 0.1 m
* 0.2 m
- 0.05 m
- 0.4 m
why: X = (u - cx) Z / fx = 100 times 1.0 divided by 500, which is 0.2 m, twice the value at half the depth.
:::

## Go further

The OpenCV calibration tutorial walks through the chessboard procedure with code. The full OpenCV documentation covers distortion models and stereo. MIT OpenCourseWare has full courses on computer vision and robotics with lectures on image formation.
`,
        },
        {
          slug: 'depth-sensing',
          title: 'Depth sensing: stereo, structured light, and learned depth',
          summary: 'A depth sensor gives each pixel a distance, and each method has a different error pattern.',
          minutes: 14,
          objectives: [
            'Compute depth from stereo disparity with the baseline and the focal length.',
            'Compare stereo, structured light, time-of-flight, and learned depth.',
            'Estimate the depth error at a given distance for a stereo pair.',
            'Build a point cloud from a depth image and the intrinsic parameters.',
          ],
          keyTerms: ['depth image', 'disparity', 'baseline', 'stereo', 'time of flight', 'point cloud'],
          links: [
            { label: 'Depth Anything: Unleashing the Power of Large-Scale Unlabeled Data', url: 'https://arxiv.org/abs/2401.10891', kind: 'paper' },
            { label: 'Intel RealSense SDK (librealsense)', url: 'https://github.com/IntelRealSense/librealsense', kind: 'repo' },
            { label: 'Open3D: a modern library for 3D data processing', url: 'https://github.com/isl-org/Open3D', kind: 'repo' },
            { label: 'OpenCV documentation', url: 'https://docs.opencv.org/4.x/', kind: 'docs' },
          ],
          body: `
## What this lesson covers

A depth image stores a distance for each pixel. This lesson explains the main ways to measure depth, with a worked stereo example. It also shows how to turn a depth image into a point cloud.

## Why it matters

A VLA model can work from colour images alone, but a grasp planner needs metres. Depth sensors give those metres. Each sensor type fails in different places: glass, black objects, sunlight, or far distances. A robot engineer must know which one to pick for a table, a warehouse, or a street.

## The idea with an example

A stereo camera has two lenses 6 cm apart. The distance between the lenses is the baseline, $b = 0.06$ m. Each lens has a focal length of 500 pixels.

:::anim
title: Depth of a cup from the disparity of a stereo pair
box camL "Left camera" @ 200,450 icon: camera size: 150x64
box camR "Right camera" @ 460,450 icon: camera size: 150x64
text base "b = 6 cm" @ 330,450 size: 16 color: grey
dot cup @ 330,290 r: 10 color: yellow label: "cup"
vector rayL from 200,418 to 330,290 color: blue
vector rayR from 460,418 to 330,290 color: blue
num colL = 0 @ 790,110 prefix: "left column = " size: 22
num colR = 0 @ 790,155 prefix: "right column = " size: 22
num disp = 0 @ 790,230 prefix: "disparity d = " suffix: " px" size: 26 color: yellow
num depth = 0 @ 790,305 prefix: "Z = f b / d = " suffix: " m" digits: 2 size: 26
text err "a 1-pixel error moves|the cup by 14 cm" @ 790,400 size: 17 color: red
text near "at 0.5 m the same|error is 8 mm" @ 790,470 size: 16 color: grey

step: Two lenses sit 6 cm apart. This distance is the baseline. Each has a focal length of 500 pixels.
  show camL, camR, base
step: A cup stands 0.5 m in front. Each camera sees it along its own ray.
  show cup
  draw rayL
  & draw rayR
step: The left camera sees the cup at column 400. The right camera sees it at column 340.
  show colL, colR
  count colL -> 400
  & count colR -> 340
step: The difference is the disparity: 400 - 340 = 60 pixels.
  show disp
  count disp -> 60
step: Depth is f times b over d: 500 x 0.06 / 60 = 0.5 m.
  show depth
  count depth -> 0.5
step: Move the cup to 2.0 m. The rays turn almost parallel and the disparity drops to 15 pixels.
  hide colL, colR
  move cup -> 330,100 (2s)
  & vector rayL -> 330,100 (2s)
  & vector rayR -> 330,100 (2s)
  & count disp -> 15 (2s)
  & count depth -> 2.0 (2s)
step: The matcher is off by one pixel and reports 14. The depth becomes 2.14 m, an error of 14 cm.
  count disp -> 14
  & count depth -> 2.14
  color depth red
  show err
step: At 0.5 m the same one-pixel error gives 8 mm. Stereo error grows with the square of distance.
  show near
:::

A cup is 0.5 m away. The left camera sees the cup at column 400. The right camera sees it at column 340. The difference is the disparity, $d = 60$ pixels.

Depth from disparity is:

$$Z = \\frac{f \\, b}{d} = \\frac{500 \\times 0.06}{60} = 0.5 \\text{ m}$$

Here $Z$ is depth in metres, $f$ is the focal length in pixels, $b$ is the baseline in metres, and $d$ is the disparity in pixels.

Now move the cup to 2.0 m. The disparity is 500 × 0.06 / 2.0 = 15 pixels. If the matcher is off by 1 pixel, the depth becomes 500 × 0.06 / 14 = 2.14 m. The error is 14 cm. At 0.5 m, the same 1-pixel error gives 0.508 m, an error of 8 mm. Stereo error grows with the square of the distance.

Press Next to follow the cup through the depth calculation at two distances.

:::scenario
title: Depth of a cup from a stereo pair
state: baseline=0.06 m, focal length=500 px, disparity=none, depth=none, error=none
step: The left camera sees the cup at column 400 and the right camera at column 340. Subtract the columns. The disparity is 60 pixels.
state: disparity=60 px
step: Multiply the focal length by the baseline and divide by the disparity. 500 x 0.06 / 60 = 0.5 m.
state: depth=0.5 m
step: Move the cup to 2.0 m. The disparity falls to 500 x 0.06 / 2.0 = 15 pixels.
state: disparity=15 px, depth=2.0 m
step: The matcher is off by one pixel and reports 14 pixels. The depth becomes 500 x 0.06 / 14 = 2.14 m.
state: disparity=14 px, depth=2.14 m, error=14 cm
step: Back at 0.5 m, the same one-pixel error gives 59 pixels and 0.508 m. The error is only 8 mm.
state: disparity=59 px, depth=0.508 m, error=8 mm
:::

The bars compare the depth error from a one-pixel disparity error at four distances.

:::bars
title: Depth error from a 1-pixel disparity error with a 6 cm baseline
unit: mm
0.5 m: 8
1.0 m: 34
2.0 m: 143
4.0 m: 615
:::

## How it works

There are four common methods:

| Method | How it works | Good at | Weak at |
|---|---|---|---|
| Stereo | Match pixels between two cameras | Outdoor, cheap | Blank walls, far objects |
| Structured light | Project a pattern, read its distortion | Indoor, fine detail | Sunlight, range over 3 m |
| Time of flight | Time a light pulse to return | Fast, long range | Glass, mirrors, black surfaces |
| Learned depth | A network predicts depth from one image | Any scene, no sensor | Absolute scale, thin objects |

Stereo matching finds, for each left pixel, the right pixel with the most similar neighbourhood. Blank walls have no texture, so the match is unsure. Active stereo adds a projected dot pattern to fix this. The Intel RealSense D400 series uses this method.

A learned depth model such as Depth Anything predicts depth from a single colour image. It learns from millions of images. The output is relative depth: the order of near and far is right, but the scale is unknown. You need one known distance, or a metric variant, to get metres.

To build a point cloud from a depth image:

1. For each pixel $(u, v)$, read the depth $Z$.
2. Compute $X = (u - c_x) Z / f_x$ and $Y = (v - c_y) Z / f_y$.
3. Store $(X, Y, Z)$ as one point.
4. Skip pixels with depth zero, because zero marks a failed measurement.
5. Apply the extrinsic matrix to move the points into robot coordinates.

A 640 by 480 depth image gives up to 307,200 points. Downsample with a voxel grid of 5 mm for planning.

The diagram shows the path from a depth image to the planner.

:::flow
title: From a depth image to a point cloud
Depth image -> Mask: drop pixels with depth zero
Mask -> Back-project: X = (u - cx) Z / fx
Back-project -> Camera points: up to 307200 points
Camera points -> Extrinsic matrix: rotate and translate
Extrinsic matrix -> Robot points: metres in the robot frame
Robot points -> Voxel grid: one point per 5 mm cell
Voxel grid -> Planner: downsampled cloud
:::

Caution: a depth sensor returns zero or a wrong value on glass, mirrors, and shiny metal. Check the invalid-pixel rate before you trust a grasp.

The snippet computes depth from disparity and the error from a one-pixel matching mistake at four distances.

:::code
lang: python
file: stereo_depth.py
f, b = 500.0, 0.06  # focal length in pixels, baseline in metres

def depth(disparity):
    return f * b / disparity

print("cup at disparity 60:", depth(60), "m")
for Z in [0.5, 1.0, 2.0, 4.0]:
    d = f * b / Z
    error = depth(d - 1) - Z
    print(f"{Z} m: disparity {d:.1f} px, 1-pixel error {error * 1000:.0f} mm")
:::

:::code
lang: text
cup at disparity 60: 0.5 m
0.5 m: disparity 60.0 px, 1-pixel error 8 mm
1.0 m: disparity 30.0 px, 1-pixel error 34 mm
2.0 m: disparity 15.0 px, 1-pixel error 143 mm
4.0 m: disparity 7.5 px, 1-pixel error 615 mm
:::

## Try it

:::exercise
title: Build a point cloud from a depth image
task: Make a 480 by 640 depth image filled with 0.5 m. Set a 100 by 100 square in the top-left corner to 0 to mark failed pixels. Build the point cloud with f = 500 and principal point (320, 240). Report the number of valid points and the X value of the pixel at column 420, row 290. The answers are 297,200 points and 0.1 m.
hint: Use numpy.meshgrid to get u and v for every pixel. Then apply X = (u - cx) Z / fx and Y = (v - cy) Z / fy and keep only pixels with depth above zero.
lang: python
solution:
import numpy as np

fx, fy, cx, cy = 500.0, 500.0, 320.0, 240.0
depth = np.full((480, 640), 0.5)
depth[:100, :100] = 0.0

v, u = np.meshgrid(np.arange(480), np.arange(640), indexing="ij")
valid = depth > 0
Z = depth[valid]
X = (u[valid] - cx) * Z / fx
Y = (v[valid] - cy) * Z / fy
cloud = np.stack([X, Y, Z], axis=1)
print("points:", len(cloud))
print("X at (420, 290):", (420 - cx) * depth[290, 420] / fx)
:::

## Common mistakes

- Mistake: use a structured light sensor outdoors. Fix: use stereo or time of flight, because sunlight hides the pattern.
- Mistake: trust stereo depth at 5 m with a 6 cm baseline. Fix: compute the error at that range first, or use a larger baseline.
- Mistake: treat a learned relative depth as metres. Fix: calibrate the scale with a known object or use a metric model.
- Mistake: build point clouds from pixels with depth zero. Fix: mask invalid pixels before projection.

## Check your understanding

:::quiz
title: Check: depth sensing
q: What is the depth for f = 500 pixels, b = 0.1 m, and d = 25 pixels?
- 0.5 m
- 1.25 m
* 2.0 m
- 4.0 m
why: Z = f b / d = 500 times 0.1 divided by 25, which is 2.0 m.
q: Why does stereo matching fail on a blank wall?
- The wall is too far for the baseline
* There is no texture to match between the two images
- The wall reflects the projected pattern
- Both cameras see the wall at the same column
why: The matcher looks for a similar neighbourhood in the other image, and every patch of a blank wall looks the same.
q: What does depth zero usually mean in a depth image?
- The point is exactly at the lens
* The sensor failed to measure that pixel
- The point is beyond the maximum range
- The pixel is at the principal point
why: Sensors write zero for pixels with no valid match or return, so you must mask them before projection.
q: You double the baseline from 6 cm to 12 cm. What happens to the depth error from a one-pixel disparity mistake at 2 m?
- It doubles
* It falls to about half
- It stays the same
- It falls to one quarter
why: Disparity doubles to 30 pixels, so one pixel is a smaller fraction of it and the depth error roughly halves.
q: Which sensor should you choose for a robot that works on a sunny patio?
- Structured light, because it gives fine detail
* Stereo or time of flight, because sunlight hides a projected pattern
- Learned depth, because it gives metric depth without a sensor
- Any sensor, because sunlight does not affect depth
why: Structured light needs its own pattern to be visible, and the sun washes it out.
:::

## Go further

The librealsense repository documents how active stereo works in a common robot sensor. Open3D gives you tools to build, filter, and view point clouds. The Depth Anything paper explains learned depth from one image. The OpenCV documentation covers stereo rectification and block matching.
`,
        },
        {
          slug: 'state-estimation-and-kalman-filter',
          title: 'State estimation and the Kalman filter',
          summary: 'A Kalman filter combines a prediction and a noisy measurement with weights set by their variances.',
          minutes: 16,
          objectives: [
            'Explain what state estimation is and why sensors alone are not enough.',
            'Compute one Kalman update by hand in one dimension.',
            'Explain the Kalman gain as a weight between prediction and measurement.',
            'Choose process noise and measurement noise values from sensor data.',
          ],
          keyTerms: ['state', 'state estimation', 'Kalman filter', 'Kalman gain', 'variance', 'process noise', 'measurement noise'],
          links: [
            { label: 'Kalman and Bayesian Filters in Python (free book with notebooks)', url: 'https://github.com/rlabbe/Kalman-and-Bayesian-Filters-in-Python', kind: 'repo' },
            { label: 'ORB-SLAM3: an accurate open-source library for visual-inertial SLAM', url: 'https://arxiv.org/abs/2007.11898', kind: 'paper' },
            { label: 'MIT OpenCourseWare on YouTube', url: 'https://www.youtube.com/@MITOpenCourseWare', kind: 'video' },
            { label: 'ROS 2 documentation', url: 'https://docs.ros.org/en/rolling/', kind: 'docs' },
          ],
          body: `
## What this lesson covers

The state of a robot is the set of numbers that describe it now: position, velocity, joint angles. Sensors measure the state with noise. This lesson explains the Kalman filter, the standard method to combine a prediction with a noisy measurement.

## Why it matters

A wheel encoder drifts. A camera pose jumps by centimetres from frame to frame. A controller that acts on raw readings shakes or wanders. The Kalman filter gives a smooth, best-guess state and a measure of its uncertainty. Every drone, every self-driving car, and most robot arms run one.

:::video
id: HZGCoVF3YvM
why: Watch the whole video. The Kalman update is Bayes theorem for a Gaussian belief: the prediction is the prior and the measurement is the evidence.
:::

## The idea with an example

A mobile robot moves along a line. At time 0 it is at position 0 with velocity 1 m/s. We estimate its position once per second.

:::anim
title: One Kalman predict and update on a line
line track from 110,300 to 650,300 color: grey
text t0 "0 m" @ 110,340 size: 16 color: grey
text t1 "1 m" @ 326,340 size: 16 color: grey
text t2 "2 m" @ 542,340 size: 16 color: grey
dot robot @ 110,300 r: 11 color: blue label: "estimate"
dot meas @ 391,300 r: 8 color: yellow label: "camera 1.3 m"
vector gap from 326,250 to 391,250 color: grey dashed label: "1.3 - 1.0 = 0.3"
num nx = 0 @ 790,110 prefix: "estimate = " suffix: " m" digits: 2 size: 24 color: blue
num np = 0 @ 790,175 prefix: "P = " digits: 3 size: 22 color: blue
num nr = 0 @ 790,240 prefix: "R = " digits: 2 size: 22 color: yellow
num nk = 0 @ 790,320 prefix: "K = P / (P + R) = " digits: 2 size: 22
text note "K = 0.31: move 31 percent|of the way to the camera" @ 790,400 size: 16 color: grey

step: The robot starts at 0 m and moves at 1 m/s. We estimate its position once per second.
  draw track
  show t0, t1, t2, robot, nx
step: Predict: the motion model moves the estimate to 1.0 m. Wheel slip adds variance Q = 0.04.
  show np
  move robot -> 326,300 (1.5s)
  & count nx -> 1.0 (1.5s)
  & count np -> 0.04 (1.5s)
step: Measure: the camera reports 1.3 m. Its variance R = 0.09 is larger, so it earns less trust.
  show meas, nr
  count nr -> 0.09
  draw gap
step: The Kalman gain is P over P plus R: 0.04 / 0.13 = 0.31.
  show nk
  count nk -> 0.31
step: Update: the estimate moves 31 percent of the way to the measurement, to 1.09 m.
  show note
  move robot -> 345,300 (1.5s)
  & count nx -> 1.09 (1.5s)
step: The variance shrinks: (1 - 0.31) x 0.04 = 0.028. Two sources beat one.
  count np -> 0.028
  pulse np
step: Predict again: the estimate becomes 2.09 m and the variance grows to 0.028 + 0.04 = 0.068.
  hide meas, gap, note, nk
  move robot -> 561,300 (1.5s)
  & count nx -> 2.09 (1.5s)
  & count np -> 0.068 (1.5s)
:::

Step 1, predict. The motion model says the robot moves 1 m per second. The predicted position is 1.0 m. The wheels slip a little, so the prediction has a variance. We set the process noise variance to $Q = 0.04$, which is a standard deviation of 0.2 m. The prediction variance is $P = 0.04$.

Step 2, measure. A camera reports the position as 1.3 m. The camera has a measurement noise variance of $R = 0.09$, a standard deviation of 0.3 m.

Step 3, compute the Kalman gain:

$$K = \\frac{P}{P + R} = \\frac{0.04}{0.04 + 0.09} = 0.31$$

Here $K$ is the gain, $P$ is the prediction variance, and $R$ is the measurement variance.

The table lists the four numbers in the example.

| Symbol | Name | Value in the example | Where it comes from |
|---|---|---|---|
| $Q$ | Process noise variance | 0.04 | Wheel slip, measured from drive tests |
| $P$ | Prediction variance | 0.04 | Grows by $Q$ at each predict step |
| $R$ | Measurement noise variance | 0.09 | Camera jitter, measured with the robot still |
| $K$ | Kalman gain | 0.31 | $P / (P + R)$ |

Step 4, update the estimate:

$$\\hat{x} = 1.0 + K (1.3 - 1.0) = 1.0 + 0.31 \\times 0.3 = 1.09 \\text{ m}$$

The estimate moves 31 percent of the way to the measurement. The prediction is more trusted because its variance is smaller.

Step 5, update the variance:

$$P' = (1 - K) P = 0.69 \\times 0.04 = 0.028$$

The variance dropped. Two sources of information are better than one.

Press Next to follow the estimate and its variance through one cycle.

:::scenario
title: One predict and update cycle in one dimension
state: estimate=0.0 m, variance=0, gain=none, measurement=none
step: Predict. The motion model moves the robot 1 m. The process noise adds 0.04 to the variance.
state: estimate=1.0 m, variance=0.04
step: Measure. The camera reports 1.3 m with a measurement variance of 0.09.
state: measurement=1.3 m
step: Compute the gain. 0.04 / (0.04 + 0.09) = 0.31.
state: gain=0.31
step: Update the estimate. 1.0 + 0.31 x (1.3 - 1.0) = 1.09 m. The estimate moves 31 percent of the way to the measurement.
state: estimate=1.09 m
step: Update the variance. 0.69 x 0.04 = 0.028. The variance is smaller than before.
state: variance=0.028
step: Predict again for the next second. The estimate becomes 2.09 m and the variance becomes 0.028 + 0.04 = 0.068.
state: estimate=2.09 m, variance=0.068, gain=none, measurement=none
:::

Now suppose the camera was very precise, with $R = 0.01$. Then $K = 0.04 / 0.05 = 0.8$, and the estimate is 1.24 m. The filter trusts the better source.

The bars compare the gain for three camera variances with the same prediction variance of 0.04.

:::bars
title: Kalman gain for three measurement variances
R = 0.09: 0.31 (estimate 1.09 m)
R = 0.04: 0.5 (estimate 1.15 m)
R = 0.01: 0.8 (estimate 1.24 m)
:::

## How it works

The Kalman filter repeats two steps at each tick:

1. Predict: move the state forward with the motion model, and add the process noise $Q$ to the variance.
2. Update: compute the gain $K$, correct the state with the measurement, and shrink the variance.

The diagram shows the loop of predict and update.

:::flow
title: The Kalman filter loop
Motion model -> Predict: move x by F and add Q
Predict -> Gain: predicted x and P
Sensor -> Gain: measurement z and R
Gain -> Update: K = P / (P + R)
Update -> Estimate: new x and smaller P
Estimate -> Predict: next tick
:::

In more than one dimension, the state is a vector $x$, the variance is a matrix $P$, and the equations use matrices. The prediction is $x' = F x$, where $F$ is the motion model matrix. The measurement is $z = H x + \\text{noise}$, where $H$ selects which parts of the state the sensor sees. The gain is $K = P H^T (H P H^T + R)^{-1}$. The structure is the same as the 1D case: the gain is the prediction variance divided by the total variance.

To choose the noise values:

1. Hold the robot still and record the sensor for 60 seconds.
2. Compute the variance of the readings. This is $R$.
3. Drive the robot a known distance 10 times with the motion model only.
4. Compute the variance of the end-point error. This is $Q$ per step.

Note: the filter assumes Gaussian noise and a linear model. For a rotating robot, the extended Kalman filter linearises the model at the current estimate. Visual SLAM systems such as ORB-SLAM3 use related optimisation instead of a filter for the map.

The snippet runs the 1D filter from the example for five ticks. The first line of output matches the worked numbers.

:::code
lang: python
file: kalman_1d.py
Q, R = 0.04, 0.09          # process and measurement noise variances
x, P = 0.0, 0.0            # estimate and its variance at time 0
velocity = 1.0             # metres per second from the motion model
measurements = [1.3, 2.2, 2.9, 4.1, 5.0]

for tick, z in enumerate(measurements, start=1):
    # predict: move the state and grow the variance
    x = x + velocity
    P = P + Q
    # update: weigh the measurement by the Kalman gain
    K = P / (P + R)
    x = x + K * (z - x)
    P = (1 - K) * P
    print(f"tick {tick}: z={z:.2f} K={K:.2f} estimate={x:.3f} variance={P:.4f}")
:::

:::code
lang: text
tick 1: z=1.30 K=0.31 estimate=1.092 variance=0.0277
tick 2: z=2.20 K=0.43 estimate=2.139 variance=0.0386
tick 3: z=2.90 K=0.47 estimate=3.027 variance=0.0420
tick 4: z=4.10 K=0.48 estimate=4.062 variance=0.0429
tick 5: z=5.00 K=0.48 estimate=5.032 variance=0.0432
:::

Note: the gain settles near 0.48 after a few ticks. The filter reaches a steady balance between the motion model and the camera.

## Try it

:::exercise
title: Compute the second tick by hand
task: After tick 1 the estimate is 1.09 m with variance 0.028. The robot moves another 1 m and the camera reports 2.2 m. Compute the predicted estimate and variance, the gain, the updated estimate, and the updated variance. Use Q = 0.04 and R = 0.09. Round to two decimals. Then check your numbers against the code block above.
hint: Predict first: add 1.0 to the estimate and 0.04 to the variance. Then the gain is P divided by P plus R.
lang: text
solution:
Predict:  estimate = 1.09 + 1.0 = 2.09 m,  variance = 0.028 + 0.04 = 0.068
Gain:     K = 0.068 / (0.068 + 0.09) = 0.43
Update:   estimate = 2.09 + 0.43 x (2.2 - 2.09) = 2.09 + 0.047 = 2.14 m
Variance: (1 - 0.43) x 0.068 = 0.039
The filter moves 43 percent of the way to the camera, more than at tick 1,
because the prediction variance grew while the camera variance stayed the same.
:::

## Common mistakes

- Mistake: set $R$ to a tiny value to make the filter follow the sensor. Fix: measure $R$ from real data, or the filter copies sensor noise.
- Mistake: set $Q$ to zero. Fix: use a nonzero $Q$, or the filter stops trusting new measurements over time.
- Mistake: feed the same measurement twice. Fix: timestamp each measurement and use each one once.
- Mistake: ignore the latency of the camera. Fix: apply the measurement at the time it was taken, not the time it arrived.

## Check your understanding

:::quiz
title: Check: the Kalman filter
q: What is the gain when P = 0.1 and R = 0.1?
- 0.1
* 0.5
- 1.0
- 0.2
why: K = P / (P + R) = 0.1 / 0.2 = 0.5, so the estimate is the average of prediction and measurement.
q: The prediction is 1.0 m with P = 0.04 and the camera reports 1.3 m with R = 0.01. What is the updated estimate?
- 1.09 m
- 1.15 m
* 1.24 m
- 1.30 m
why: K = 0.04 / 0.05 = 0.8, so the estimate is 1.0 + 0.8 times 0.3, which is 1.24 m.
q: What happens to the variance after an update step?
- It grows by Q
- It stays the same
* It decreases, because the filter has more information
- It becomes equal to R
why: The update multiplies P by (1 - K), which is below 1, so two sources of information give a tighter estimate.
q: Why does a process noise of zero cause problems?
- The gain becomes 1 and the filter copies the sensor
* The variance shrinks to zero and the filter ignores all new measurements
- The prediction step stops moving the state
- The filter cannot start without a measurement
why: With Q = 0 the variance only shrinks, so the gain falls to zero and the filter stops listening to the camera.
q: A camera frame arrives 100 ms after it was taken. How should the filter use it?
- Discard it, because old measurements are useless
- Apply it at the time it arrived
* Apply it at the time it was taken
- Double its variance and apply it now
why: The measurement describes the state at capture time, so applying it later would pull the estimate toward an old position.
:::

## Go further

The free book Kalman and Bayesian Filters in Python builds the filter in notebooks from this 1D case up to the full matrix form. The ROS 2 documentation shows how the robot_localization package fuses wheel, inertial, and GPS data. The ORB-SLAM3 paper shows how a camera and an inertial sensor combine for full pose estimation. MIT OpenCourseWare has lectures on estimation and control.
`,
        },
      ],
    },
    {
      slug: 'control-and-learning',
      title: 'Control and learning',
      description: 'PID control, imitation learning, and how to cross the sim-to-real gap.',
      level: 'advanced',
      lessons: [
        {
          slug: 'pid-control',
          title: 'PID control',
          summary: 'A PID controller sets the motor command from the error, its integral, and its rate of change.',
          minutes: 14,
          objectives: [
            'Compute a PID command by hand for three time steps.',
            'Explain the effect of each gain on overshoot and steady-state error.',
            'Tune a PID loop with a simple manual procedure.',
            'Describe integral windup and how to stop it.',
          ],
          keyTerms: ['setpoint', 'error', 'proportional gain', 'integral gain', 'derivative gain', 'overshoot', 'integral windup'],
          links: [
            { label: 'Feedback Systems by Astrom and Murray (free textbook)', url: 'https://fbswiki.org/', kind: 'course' },
            { label: 'Underactuated Robotics (MIT, free)', url: 'https://underactuated.mit.edu/', kind: 'course' },
            { label: 'ROS 2 Control documentation', url: 'https://control.ros.org/', kind: 'docs' },
            { label: 'MIT OpenCourseWare on YouTube', url: 'https://www.youtube.com/@MITOpenCourseWare', kind: 'video' },
          ],
          body: `
## What this lesson covers

A controller turns a desired value into a motor command. This lesson explains the proportional-integral-derivative (PID) controller, the most common one. You compute three steps by hand and learn a tuning procedure.

## Why it matters

A VLA model outputs a target position 10 times per second. The motor driver must reach that target between ticks. A PID loop does that job at 1,000 times per second. If the gains are wrong, the arm shakes, overshoots, or never reaches the target. PID loops also hold drone altitude, wheel speed, and gripper force.

## The idea with an example

A joint must move to 90 degrees. It starts at 0 degrees. The setpoint is the desired value, 90. The error is the setpoint minus the current value.

:::anim
title: Three PID steps toward a setpoint of 90 degrees
text tm "time 0.0 s" @ 480,40 size: 24 color: grey
axes plot @ 100,115 size: 420x250 x: 0,0.3 y: 0,120 xlabel: "Time (seconds)" ylabel: "Joint angle (°)"
line arc on plot from 0,90 to 0.3,90 color: purple dashed: true
text a90 "Target: 90°" @ 430,95 size: 22 color: purple
dot target on plot @ 0.3,90 r: 7 color: purple
dot joint on plot @ 0,0 r: 10 color: blue
line path1 on plot from 0,0 to 0.1,30 color: blue
line path2 on plot from 0.1,30 to 0.2,50 color: blue
line overshoot on plot from 0.1,30 to 0.25,105 color: orange
dot ghost on plot @ 0.1,30 r: 8 color: orange
text ghostNote "Without D: overshoot" @ 300,440 size: 22 color: orange
num nerr = 0 @ 740,100 prefix: "error = " suffix: "°" size: 30 color: blue
text pLabel "P · pull toward target" @ 740,165 size: 22 color: blue
num nP = 0 @ 740,202 prefix: "0.5 × e = " suffix: " V" digits: 1 size: 28 color: blue
text iLabel "I · add past errors" @ 740,262 size: 22 color: purple
num nI = 0 @ 740,299 prefix: "0.1 × sum = " suffix: " V" digits: 1 size: 28 color: purple
text dLabel "D · brake fast changes" @ 740,359 size: 22 color: orange
num nD = 0 @ 740,396 prefix: "0.2 × rate = " suffix: " V" digits: 1 size: 28 color: orange
rect command @ 740,480 size: 340x76 color: blue
num ncmd = 45.9 @ 740,480 prefix: "motor: " suffix: " V" digits: 1 size: 30 color: blue
text sum "45 + 0.9 + 0" @ 340,480 size: 28 color: blue

step: The joint starts at 0 degrees. The setpoint is 90. The error is 90 - 0 = 90.
  show plot, a90, target, joint, tm, nerr
  draw arc
  count nerr -> 90
step: Step 1: the P term is 45, the I term 0.9, the D term 0. Command 45.9 V.
  show pLabel, iLabel, dLabel, nP, nI, nD
  count nP -> 45
  & count nI -> 0.9
  show sum, command
  morph sum -> ncmd
step: The joint moves to 30 degrees. The error falls to 60.
  label tm "time 0.1 s"
  move joint -> 0.1,30 (1.5s)
  & draw path1 (1.5s)
  & count nerr -> 60 (1.5s)
step: Step 2: P = 30, I = 1.5. The error fell fast, so D = 0.2 x (-300) = -60.
  count nP -> 30
  & count nI -> 1.5
  count nD -> -60
  color nD red
step: The command is 30 + 1.5 - 60 = -28.5 V. The derivative term brakes the joint.
  count ncmd -> -28.5
  pulse nD
step: The joint moves to 50 degrees. Error 40, P 20, I 1.9, D -40. Command -18.1 V.
  label tm "time 0.2 s"
  move joint -> 0.2,50 (1.5s)
  & draw path2 (1.5s)
  & count nerr -> 40 (1.5s)
  & count nP -> 20 (1.5s)
  & count nI -> 1.9 (1.5s)
  & count nD -> -40 (1.5s)
  & count ncmd -> -18.1 (1.5s)
step: Without the D term, the step-2 command is 31.5 V and the joint passes 90 and comes back.
  show ghost, ghostNote
  move ghost -> 0.25,105 (2s)
  & draw overshoot (2s)
  move ghost -> 0.3,90
:::

We use gains $K_p = 0.5$, $K_i = 0.1$, and $K_d = 0.2$. The time step is 0.1 s. The command is in volts.

The bars compare the three gains.

:::bars
title: The three gains in the example
Proportional gain Kp: 0.5
Integral gain Ki: 0.1
Derivative gain Kd: 0.2
:::

Step 1, time 0.0 s. Position 0. Error = 90. Integral = 90 × 0.1 = 9. Derivative = (90 - 90) / 0.1 = 0, because the previous error was also 90.

Command = 0.5 × 90 + 0.1 × 9 + 0.2 × 0 = 45 + 0.9 + 0 = 45.9 V.

Step 2, time 0.1 s. The joint moved to 30 degrees. Error = 60. Integral = 9 + 60 × 0.1 = 15. Derivative = (60 - 90) / 0.1 = -300.

Command = 0.5 × 60 + 0.1 × 15 + 0.2 × (-300) = 30 + 1.5 - 60 = -28.5 V.

The derivative term is large and negative. It brakes the joint because the error is falling fast.

The bars compare the size of the three terms at step 2.

:::bars
title: The three terms at step 2
unit: V
Proportional term: 30
Integral term: 1.5
Derivative term: -60
:::

Step 3, time 0.2 s. The joint is at 50 degrees. Error = 40. Integral = 15 + 4 = 19. Derivative = (40 - 60) / 0.1 = -200.

Command = 20 + 1.9 - 40 = -18.1 V.

The joint slows as it nears the target. Without the derivative term, the command at step 2 would be 31.5 V, and the joint would pass 90 and come back.

Press Next to follow the error and the three terms through the three steps.

:::scenario
title: Three PID steps toward 90 degrees
state: time=0.0 s, position=0 deg, error=90, P term=0 V, I term=0 V, D term=0 V, command=0 V
step: Step 1. The error is 90. The integral is 90 x 0.1 = 9. The derivative is 0 because the previous error was also 90.
state: P term=45 V, I term=0.9 V, D term=0 V, command=45.9 V
step: The joint moves to 30 degrees. The error falls to 60. The integral grows to 15. The derivative is (60 - 90) / 0.1 = -300.
state: time=0.1 s, position=30 deg, error=60, P term=30 V, I term=1.5 V, D term=-60 V, command=-28.5 V
step: The derivative term brakes the joint. The command is negative although the error is still positive.
step: The joint moves to 50 degrees. The error is 40. The integral is 19. The derivative is (40 - 60) / 0.1 = -200.
state: time=0.2 s, position=50 deg, error=40, P term=20 V, I term=1.9 V, D term=-40 V, command=-18.1 V
step: The joint slows as it nears the target. Without the derivative term the command at step 2 would be 31.5 V.
:::

## How it works

The PID law is:

$$u(t) = K_p e(t) + K_i \\int_0^t e(\\tau) \\, d\\tau + K_d \\frac{de(t)}{dt}$$

Here $u$ is the command, $e$ is the error, $K_p$ is the proportional gain, $K_i$ is the integral gain, and $K_d$ is the derivative gain.

The diagram shows how the three terms combine into one motor command.

:::flow
title: The PID loop
Setpoint -> Error: 90 degrees
Sensor -> Error: measured position
Error -> P term: Kp times e
Error -> I term: Ki times the sum of e
Error -> D term: Kd times the change of e
P term -> Sum
I term -> Sum
D term -> Sum
Sum -> Motor: command in volts
Motor -> Sensor: new position
:::

Each term has one job:

- The proportional term pushes harder when the error is larger. Alone, it leaves a small steady error against gravity or friction.
- The integral term sums the error over time. It removes the steady error. Too much causes slow oscillation.
- The derivative term resists fast change. It reduces overshoot. It also amplifies sensor noise.

The table sums up the three terms.

| Term | Gain | Responds to | Too little | Too much |
|---|---|---|---|---|
| Proportional | $K_p$ | The current error | Slow response | Oscillation |
| Integral | $K_i$ | The sum of past errors | A steady error remains | Slow oscillation and windup |
| Derivative | $K_d$ | The rate of change of the error | Overshoot | Noise in the command |

Manual tuning procedure:

1. Set $K_i$ and $K_d$ to zero.
2. Raise $K_p$ until the joint oscillates with a steady amplitude. Note this value and the period.
3. Set $K_p$ to half of that value.
4. Raise $K_d$ until the overshoot is below 10 percent.
5. Raise $K_i$ until the steady error goes to zero in about 1 second.

Integral windup happens when the motor hits its limit. The error stays large, the integral grows, and the joint overshoots when the limit clears. Fix it by clamping the integral to a maximum value.

Caution: test a new gain set with a small setpoint change first. A gain that is 10 times too large can damage the arm.

The snippet reproduces the three hand-computed steps. The measured positions are given as a list, so the output matches the example.

:::code
lang: python
file: pid_steps.py
Kp, Ki, Kd, dt = 0.5, 0.1, 0.2, 0.1
setpoint = 90.0
positions = [0.0, 30.0, 50.0]   # measured at the three steps
integral = 0.0
prev_error = setpoint - positions[0]

for step, position in enumerate(positions, start=1):
    error = setpoint - position
    integral = integral + error * dt
    derivative = (error - prev_error) / dt
    command = Kp * error + Ki * integral + Kd * derivative
    prev_error = error
    print(f"step {step}: error={error:.0f} P={Kp * error:.1f} "
          f"I={Ki * integral:.1f} D={Kd * derivative:.1f} command={command:.1f} V")
:::

:::code
lang: text
step 1: error=90 P=45.0 I=0.9 D=0.0 command=45.9 V
step 2: error=60 P=30.0 I=1.5 D=-60.0 command=-28.5 V
step 3: error=40 P=20.0 I=1.9 D=-40.0 command=-18.1 V
:::

## Try it

:::exercise
title: Watch the derivative term fight overshoot
task: Replace the fixed position list with a simulated joint. At each step the velocity changes by (8 times the command minus 2 times the velocity) times dt, and the position changes by velocity times dt. Clamp the command to plus or minus 48 V. Run 60 steps with the example gains and report the peak position. Then set Kd to 0 and run again. Predict which run overshoots more before you run it.
hint: Keep the PID lines from the code block. Add velocity and position variables and update them after the command. Track the maximum position with max.
lang: python
solution:
def run(Kp, Ki, Kd, steps=60, dt=0.1):
    position, velocity, integral, prev_error = 0.0, 0.0, 0.0, 90.0
    peak = 0.0
    for _ in range(steps):
        error = 90.0 - position
        integral = integral + error * dt
        derivative = (error - prev_error) / dt
        command = Kp * error + Ki * integral + Kd * derivative
        command = max(-48.0, min(48.0, command))   # the driver limit
        prev_error = error
        velocity = velocity + (8.0 * command - 2.0 * velocity) * dt
        position = position + velocity * dt
        peak = max(peak, position)
    return peak

print(f"Kd = 0.2: peak {run(0.5, 0.1, 0.2):.1f} degrees")   # about 102
print(f"Kd = 0.0: peak {run(0.5, 0.1, 0.0):.1f} degrees")   # about 114
:::

## Common mistakes

- Mistake: tune on the bench and deploy with a heavier gripper. Fix: retune after any change of mass or load.
- Mistake: compute the derivative from a noisy raw sensor. Fix: filter the measurement first, or compute the derivative of the measurement rather than the error.
- Mistake: let the integral grow without limit. Fix: clamp the integral and reset it on a large setpoint change.
- Mistake: run the loop at a variable rate. Fix: use a fixed timer, because the integral and derivative assume a known time step.

## Check your understanding

:::quiz
title: Check: PID control
q: What is the proportional command when Kp = 0.5 and the error is 20?
- 40
* 10
- 0.025
- 20.5
why: The proportional term is the gain times the error, 0.5 times 20, which is 10.
q: Which term removes a steady error caused by gravity?
- The proportional term
* The integral term
- The derivative term
- The setpoint
why: The integral sums the error over time, so a small constant error keeps growing the command until the error vanishes.
q: At step 2 of the example the error falls from 90 to 60 in 0.1 s. What is the derivative term with Kd = 0.2?
- 6 V
- -6 V
* -60 V
- -300 V
why: The derivative is (60 - 90) / 0.1 = -300 per second, and 0.2 times -300 is -60 V.
q: What causes integral windup?
- The derivative term amplifies sensor noise
- The proportional gain is too small
* The motor saturates while the error stays large, so the integral grows too much
- The loop runs at a variable rate
why: When the command hits its limit the error cannot fall, and the integral keeps accumulating until the joint overshoots.
q: The joint oscillates with a steady amplitude at Kp = 2.0 during manual tuning. What is the next step?
- Raise Kp to 4.0 and add Ki
* Set Kp to about 1.0, then raise Kd until the overshoot is under 10 percent
- Set Kp to zero and tune Ki alone
- Keep Kp at 2.0 and raise Ki
why: The procedure halves the gain that caused steady oscillation, then adds derivative action before integral action.
:::

## Go further

The free textbook Feedback Systems by Astrom and Murray covers PID tuning and stability with full mathematics. Underactuated Robotics from MIT goes from PID to optimal control for walking and manipulation. The ROS 2 Control documentation shows how real robot drivers run PID loops. MIT OpenCourseWare has full control courses on YouTube.
`,
        },
        {
          slug: 'imitation-learning',
          title: 'Imitation learning',
          summary: 'Imitation learning trains a policy to copy demonstrations, and DAgger fixes the drift that copying causes.',
          minutes: 14,
          objectives: [
            'Explain behaviour cloning as supervised learning on demonstrations.',
            'Compute how error compounds over a trajectory of T steps.',
            'Describe the DAgger procedure and why it fixes compounding error.',
            'Choose a loss function for discrete and continuous actions.',
          ],
          keyTerms: ['demonstration', 'behaviour cloning', 'compounding error', 'DAgger', 'covariate shift'],
          links: [
            { label: 'A Reduction of Imitation Learning and Structured Prediction to No-Regret Online Learning (DAgger)', url: 'https://arxiv.org/abs/1011.0686', kind: 'paper' },
            { label: 'Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware (ACT)', url: 'https://arxiv.org/abs/2304.13705', kind: 'paper' },
            { label: 'Generative Adversarial Imitation Learning', url: 'https://arxiv.org/abs/1606.03476', kind: 'paper' },
            { label: 'LeRobot: train a policy from your own demonstrations', url: 'https://github.com/huggingface/lerobot', kind: 'repo' },
            { label: 'Stanford Online on YouTube', url: 'https://www.youtube.com/@stanfordonline', kind: 'video' },
          ],
          body: `
## What this lesson covers

Imitation learning trains a policy from demonstrations. A demonstration is a recorded sequence of observations and the actions a person took. This lesson covers behaviour cloning, the compounding error problem, and DAgger, a method that fixes it.

## Why it matters

Every VLA model in this track is trained by imitation. The fine-tuning step of RT-2 and OpenVLA is behaviour cloning. The ACT policy and Diffusion Policy are behaviour cloning with better output heads. If you understand why pure cloning drifts, you understand why these papers record data the way they do.

:::video
id: FgzM3zpZ55o
why: Watch the first 30 minutes. Emma Brunskill places imitation learning next to reinforcement learning and explains why learning from demonstrations is the cheap starting point.
:::

## The idea with an example

A person drives a toy car along a lane 100 times. Each run has 50 steps. At each step the logger saves the camera image and the steering angle. The dataset has 5,000 pairs.

:::anim
title: A cloned policy drifts out of the lane, then DAgger fixes it
line edgeT from 110,240 to 650,240 color: grey
line edgeB from 110,360 to 650,360 color: grey
line centre from 110,300 to 650,300 color: grey dashed
text lane "lane, 20 cm each side of the centre" @ 380,400 size: 16 color: grey
dot expert @ 110,300 r: 9 color: green label: "expert"
dot car @ 110,300 r: 9 color: yellow label: "clone"
dot car2 @ 110,300 r: 9 color: blue label: "after DAgger"
num pairs = 0 @ 790,110 suffix: " pairs" size: 24
num st = 0 @ 790,180 prefix: "step " size: 22
num off = 0 @ 790,240 prefix: "offset = " suffix: " cm" size: 22 color: yellow
text seen "a view no training|image shows" @ 790,320 size: 16 color: red
text lab "the person labels|the correct angle|at every visited state" @ 790,400 size: 16 color: green

step: A person drives 100 runs of 50 steps. Every logged image shows the car near the lane centre.
  draw edgeT, edgeB, centre
  show lane, expert, pairs
  move expert -> 650,300 (2.5s)
  & count pairs -> 5000 (2.5s)
step: Now the clone drives. At step 1 its steering is a little off: 1 cm left of centre.
  hide expert
  show car, st, off
  move car -> 121,297
  & count st -> 1
  & count off -> 1
step: At step 2 the car is 2 cm left, a view no training image shows. The error grows.
  show seen
  move car -> 132,294
  & count st -> 2
  & count off -> 2
  color car orange
step: At step 3 it is 6 cm left. Each mistake lands the car in a stranger state.
  move car -> 142,282
  & count st -> 3
  & count off -> 6
step: By step 20 the car is 40 cm left and out of the lane. This is compounding error.
  move car -> 326,180 (2.5s)
  & count st -> 20 (2.5s)
  & count off -> 40 (2.5s)
  color car red
step: DAgger round 1: the policy drives and the person labels the correct angle at every visited state.
  hide seen, car, off
  show lab, car2
  count st -> 1 (0.3s)
  move car2 -> 326,180 (2s)
  & count st -> 20 (2s)
  count pairs -> 5050
step: After 3 rounds the dataset holds 150 extra pairs. The car stays in the lane for all 50 steps.
  count pairs -> 5150
  move car2 -> 110,300 (0.6s)
  & count st -> 0 (0.6s)
  show off
  move car2 -> 650,294 (3s)
  & count st -> 50 (3s)
  & count off -> 2 (3s)
:::

We train a network to predict the steering angle from the image. The loss is mean squared error. After training, the network matches the person on 98 percent of the training images.

Now the car drives itself. At step 1, it picks an angle that is a little off. At step 2, the car is 2 cm further left than any training image. The network has never seen that view. Its error is larger. At step 3, the car is 6 cm left. By step 20, it leaves the lane.

This is compounding error. The policy makes a small mistake, lands in a state it never saw, and makes a bigger mistake. If the error per step is $\\epsilon$, the total cost after $T$ steps can grow as $T^2 \\epsilon$. With $T = 50$ and $\\epsilon = 0.01$, the bound is 25 times worse than a policy with linear growth.

The bars compare the two error bounds for 50 steps and an error of 0.01 per step.

:::bars
title: Total error bound after 50 steps
Linear growth, T times epsilon: 0.5
Quadratic growth, T squared times epsilon: 25
:::

DAgger fixes this. We let the trained policy drive. The person watches and labels the correct steering angle at each step, but does not control the car. These new pairs show the states the policy actually visits. We add them to the dataset and retrain. After 3 rounds, the car stays in the lane.

Press Next to watch the drift and the DAgger fix.

:::scenario
title: A cloned policy drifts, then DAgger fixes it
state: step=0, offset from centre=0 cm, view seen in training=yes, in lane=yes, dataset=5000 pairs
step: The car starts at the lane centre. The view matches the training images. The policy picks an angle that is a little off.
state: step=1, offset from centre=1 cm
step: The car is 2 cm left of any training image. The policy has never seen this view. Its error is larger.
state: step=2, offset from centre=2 cm, view seen in training=no
step: The error grows at each step. The car is 6 cm left.
state: step=3, offset from centre=6 cm
step: By step 20 the car leaves the lane. One small mistake became a failure.
state: step=20, offset from centre=40 cm, in lane=no
step: DAgger round 1. The policy drives and the person labels the correct angle at each step. The new pairs cover the views the policy visits.
state: dataset=5000 + 50 new pairs
step: After 3 rounds the dataset covers the drifted views. The car stays in the lane for all 50 steps.
state: step=50, offset from centre=2 cm, view seen in training=yes, in lane=yes, dataset=5000 + 150 new pairs
:::

## How it works

Behaviour cloning is supervised learning:

1. Record demonstrations as (observation, action) pairs.
2. Choose a loss. Use cross-entropy for discrete action tokens. Use mean squared error or a diffusion loss for continuous actions.
3. Train the policy to minimise the loss on the pairs.
4. Evaluate on the real robot, not only on held-out pairs.

The gap between training states and test states is covariate shift. The policy sees its own states at test time, not the expert's states.

The DAgger procedure is:

1. Train a policy on the expert demonstrations.
2. Run the policy and record the observations it visits.
3. Ask the expert to label the correct action for each visited observation.
4. Add the new pairs to the dataset.
5. Retrain on the full dataset. Repeat from step 2.

The diagram shows one round of DAgger.

:::flow
title: One DAgger round
Expert demos -> Dataset: 5000 pairs
Dataset -> Train: all pairs
Train -> Policy: new weights
Policy -> Drive: steering angles
Drive -> Expert labels: visited images
Expert labels -> Dataset: new pairs
:::

DAgger needs an expert who can label states after the fact. For a human teleoperator this is costly. Two cheaper substitutes are common. The first is to add small noise to the expert's actions during recording, so the dataset already contains recovery moves. The second is to record many demonstrations from varied start positions.

The table compares the three ways to get recovery data.

| Method | Who drives during recording | Who labels | Cost |
|---|---|---|---|
| DAgger | The learned policy | The expert, after the fact | High, one label per visited state |
| Noise injection | The expert, with small added noise | The expert, by driving | Low, no extra pass |
| Varied starts | The expert, from many start positions | The expert, by driving | Medium, more demonstrations |

Note: generative adversarial imitation learning trains a reward from demonstrations instead of copying actions. It avoids compounding error but needs a simulator and many interactions.

The snippet simulates the toy car. The expert steers back to the centre. The clone copies the expert only on offsets it saw in training and guesses elsewhere.

:::code
lang: python
file: drift.py
def expert(offset):
    return -offset                 # steer straight back to the centre

def cloned(offset, seen):
    # the clone copies the expert only on offsets it saw in training
    return -offset if abs(offset) <= seen else 0.2 * offset

def drive(policy, steps=50, drift=1.0):
    offset = 0.0
    for step in range(1, steps + 1):
        offset = offset + drift        # a bump pushes the car 1 cm left
        offset = offset + policy(offset)
        if abs(offset) > 20:
            return f"left the lane at step {step}"
    return f"in lane after {steps} steps, offset {offset:.1f} cm"

print("expert:", drive(expert))
print("clone: ", drive(lambda x: cloned(x, seen=0.5)))
:::

:::code
lang: text
expert: in lane after 50 steps, offset 0.0 cm
clone:  left the lane at step 9
:::

## Try it

:::exercise
title: Add DAgger to the drift simulation
task: Extend the code block. After each failed drive, let the expert label every offset the clone visited. Model this by setting seen to the largest offset the clone reached in that drive. Retrain means: use the new seen value. Run up to 3 rounds and print the result of each round. Predict how many rounds the car needs before it stays in the lane.
hint: Make drive return the list of offsets it visited. After each round set seen to the maximum absolute offset in that list.
lang: python
solution:
def cloned(offset, seen):
    return -offset if abs(offset) <= seen else 0.2 * offset

def drive(seen, steps=50, drift=1.0):
    offset, visited = 0.0, []
    for step in range(1, steps + 1):
        offset = offset + drift
        offset = offset + cloned(offset, seen)
        visited.append(abs(offset))
        if abs(offset) > 20:
            return False, visited
    return True, visited

seen = 0.5
for round_number in range(1, 4):
    ok, visited = drive(seen)
    print(f"round {round_number}: seen={seen:.1f} cm, stays in lane={ok}")
    if ok:
        break
    seen = max(visited)   # the expert labels every visited offset
# round 1: seen=0.5 cm, stays in lane=False
# round 2: seen=25.0 cm, stays in lane=True
:::

## Common mistakes

- Mistake: judge a policy by its loss on held-out demonstration pairs. Fix: run the policy on the robot, because low loss does not prevent drift.
- Mistake: record only perfect demonstrations. Fix: include recoveries from small errors so the policy learns to correct.
- Mistake: use mean squared error for actions with two valid choices. Fix: use a diffusion or token head, or the policy outputs the average of the two.
- Mistake: let the expert correct the car during DAgger collection. Fix: let the policy drive and only record the expert's label.

## Check your understanding

:::quiz
title: Check: imitation learning
q: What is behaviour cloning?
- Reinforcement learning with a reward from demonstrations
* Supervised learning from observation-action pairs recorded from an expert
- Copying the weights of one policy into another
- Training a policy in simulation and running it on a real robot
why: Behaviour cloning treats each demonstration step as a labelled example and minimises a supervised loss.
q: Why does a cloned policy drift off the lane?
- The loss function was mean squared error
* Small errors lead to unseen states where the error is larger
- The expert drove too fast during recording
- The camera resolution was too low
why: Each mistake moves the car into a view the training set does not cover, and the next mistake is bigger.
q: The error per step is 0.01 and a run has 100 steps. What is the quadratic bound on total error?
- 1
- 10
* 100
- 0.01
why: The bound is T squared times epsilon, 10,000 times 0.01, which is 100, while a linear bound would give only 1.
q: What does DAgger add to the dataset?
- More demonstrations from the expert driving perfectly
- Rewards for each visited state
* Expert labels for the states the learned policy itself visits
- Random noise added to the expert's actions
why: The policy drives, the expert only labels, so the new pairs cover the states that cause drift.
q: Which loss should you avoid for a task where the robot may go left or right around a cup?
- Cross-entropy on action tokens
- A diffusion loss
* Mean squared error on the continuous action
- An L1 loss on an action chunk with a diffusion head
why: Mean squared error pulls the output to the average of left and right, which drives the gripper into the cup.
:::

## Go further

Read the DAgger paper for the procedure and the proof of its linear error bound. The ACT paper shows practical behaviour cloning on a low-cost arm. The GAIL paper shows the adversarial alternative. LeRobot lets you record demonstrations with a cheap arm and train a policy the same day. Stanford Online has full lectures on imitation learning in its reinforcement learning courses.
`,
        },
        {
          slug: 'sim-to-real',
          title: 'Sim-to-real transfer',
          summary: 'A policy trained in simulation works on a real robot when the simulator randomises what it cannot match.',
          minutes: 14,
          objectives: [
            'Explain the sim-to-real gap and its three main sources.',
            'Apply domain randomisation to a list of simulator parameters.',
            'Estimate the number of simulated steps needed for a given training budget.',
            'Design a transfer test that measures the gap directly.',
          ],
          keyTerms: ['simulator', 'sim-to-real gap', 'domain randomisation', 'system identification', 'reinforcement learning'],
          links: [
            { label: 'Domain Randomization for Transferring Deep Neural Networks from Simulation to the Real World', url: 'https://arxiv.org/abs/1703.06907', kind: 'paper' },
            { label: 'Learning to Walk in Minutes Using Massively Parallel Deep Reinforcement Learning', url: 'https://arxiv.org/abs/2109.11978', kind: 'paper' },
            { label: 'MuJoCo physics simulator', url: 'https://github.com/google-deepmind/mujoco', kind: 'repo' },
            { label: 'Isaac Lab: GPU-parallel robot learning', url: 'https://github.com/isaac-sim/IsaacLab', kind: 'repo' },
            { label: 'MuJoCo documentation', url: 'https://mujoco.readthedocs.io/', kind: 'docs' },
          ],
          body: `
## What this lesson covers

A simulator runs a robot in software, thousands of times faster than real time. A policy trained there often fails on the real robot. This lesson explains that gap, and the methods that close it: domain randomisation and system identification.

## Why it matters

Real robot data is slow and costs money. A simulator on one graphics card can run 4,096 robots at once and collect a year of experience in an hour. Walking robots, drone racers, and in-hand manipulation policies now train almost fully in simulation. The sim-to-real gap is the one thing between that cheap data and a working robot.

## The idea with an example

A four-legged robot must learn to walk. In simulation, the ground friction is set to 1.0 and the motor delay is zero. Training takes 20 minutes on one graphics card. The policy walks in simulation.

:::anim
title: A walking policy moves from a fixed simulator to a real carpet
box sim "Simulator" @ 200,290 icon: gpu size: 200x64
box pol "Policy" @ 480,290 icon: model size: 170x64
box real "Real robot" @ 760,290 icon: robot size: 200x64
text simp "friction 1.0|motor delay 0 ms" @ 200,400 size: 17 color: blue
text realp "carpet friction 0.6|motor delay 20 ms" @ 760,400 size: 17 color: yellow
text res "falls on the first step" @ 760,470 size: 18 color: red
text ok "walks on the carpet" @ 760,470 size: 18 color: green
num mins = 0 @ 480,150 suffix: " min of training" size: 22
num robots = 1 @ 200,150 suffix: " robots per batch" size: 22
num steps = 0 @ 480,470 suffix: " steps per update" size: 20 color: grey

step: The simulator runs one robot with friction 1.0 and zero motor delay.
  show sim, simp, robots
step: The policy trains for 20 minutes on one graphics card and walks in simulation.
  show pol, mins
  arrow sim -> pol : experience
  & count mins -> 20 (1.4s)
step: On the real carpet the friction is 0.6 and the motors respond 20 ms late.
  show real, realp
step: The policy meets conditions it never saw. It falls on the first step.
  arrow pol -> real : gait
  color real red
  show res
step: Train again with domain randomisation: every episode draws friction from 0.4 to 1.2 and delay from 0 to 40 ms.
  hide res
  color real blue
  label simp "friction 0.4 to 1.2|motor delay 0 to 40 ms|mass 90 to 110 percent|push up to 5 N"
  count mins -> 0 (0.5s)
step: The policy sees 4,096 different robots in each batch and learns one gait that works for all of them.
  count robots -> 4096 (2s)
  & send sim -> pol : 4096 variants (2s)
  count mins -> 20
step: One update needs 4,096 x 24 = 98,304 steps. At 200,000 steps per second that is 0.5 s.
  show steps
  count steps -> 98304
step: On the carpet the real robot is one more sample from the range. The policy walks.
  send pol -> real : gait
  color real green
  show ok
:::

On the real robot, the carpet friction is 0.6 and the motors respond 20 ms late. The policy falls on the first step.

Now train again with domain randomisation. At the start of each episode, the simulator draws:

- Friction from a uniform range 0.4 to 1.2.
- Motor delay from 0 to 40 ms.
- Robot mass from 90 to 110 percent of the nominal value.
- A random push of up to 5 N once per second.

The table lists each randomised parameter next to the fixed simulator value and the real value.

| Parameter | Fixed simulator | Real robot | Randomised range |
|---|---|---|---|
| Ground friction | 1.0 | 0.6 on carpet | 0.4 to 1.2 |
| Motor delay | 0 ms | 20 ms | 0 to 40 ms |
| Robot mass | 100 percent of nominal | Unknown, changes with the battery | 90 to 110 percent |
| External push | None | Bumps and slopes | Up to 5 N once per second |

The policy sees 4,096 different robots in each batch. It learns a gait that works across all of them. On the real carpet, it walks. The real robot is one more sample from the range.

Press Next to follow the two training runs from the simulator to the carpet.

:::scenario
title: From a fixed simulator to a real carpet
state: friction=1.0, motor delay=0 ms, training time=0 min, result=none
step: Train in the fixed simulator for 20 minutes. The policy walks in simulation.
state: training time=20 min, result=walks in simulation
step: Run the policy on the real robot. The carpet friction is 0.6 and the motors respond 20 ms late. The policy falls on the first step.
state: friction=0.6, motor delay=20 ms, result=falls on the first step
step: Train again with domain randomisation. Each episode draws friction from 0.4 to 1.2 and delay from 0 to 40 ms.
state: friction=0.4 to 1.2, motor delay=0 to 40 ms, training time=0 min, result=none
step: The policy sees 4096 different robots in each batch. It learns a gait that works across all of them.
state: training time=20 min, result=walks in simulation
step: Run it on the real carpet. The real robot is one more sample from the range. It walks.
state: friction=0.6, motor delay=20 ms, result=walks on the carpet
:::

The compute budget is simple to estimate. One policy update needs 4,096 robots × 24 steps = 98,304 steps. The simulator runs 200,000 steps per second. One update takes 0.5 s. A policy that needs 1,500 updates trains in about 12 minutes.

The timing diagram shows one policy update.

:::timeline
title: One policy update with 4096 parallel robots
unit: s
lane Simulator
lane Learner
Simulator: step 4096 robots 24 times @0-0.5
Simulator -> Learner: 98304 transitions @0.5-0.52
Learner: gradient update @0.52-0.6
Learner -> Simulator: new weights @0.6-0.62
Simulator: next rollout @0.62-1.12
:::

The bars compare the steps per second from one real robot and from the simulator.

:::bars
title: Robot steps per second
unit: steps
One real robot at 50 Hz: 50
Simulator with 4096 robots: 200000
:::

## How it works

The gap has three sources:

| Source | Example | Fix |
|---|---|---|
| Dynamics | Friction, mass, motor delay | Randomise or identify |
| Perception | Lighting, textures, camera noise | Randomise images |
| Modelling | Cables, soft contact, wear | Measure and add to the model |

Domain randomisation is the procedure:

1. List the parameters the simulator cannot match exactly.
2. Set a range for each one that contains the real value.
3. Draw new values at the start of each episode.
4. Train the policy on the full mixture.
5. Narrow a range only if the policy cannot learn with it.

The diagram shows how the ranges feed the training loop and the real robot.

:::flow
title: Domain randomisation in the training loop
Parameter ranges -> Draw per episode: friction, delay, mass
Draw per episode -> Simulator: 4096 robot variants
Simulator -> Policy: observations
Policy -> Simulator: actions
Simulator -> Update: 98304 steps of experience
Update -> Policy: new weights
Policy -> Real robot: one more sample from the range
:::

The policy must work for every draw, so it learns to be robust rather than exact. The cost is some performance: a policy for one exact robot is faster than one for a range.

System identification is the other method. Measure the real parameter and set it in the simulator. For example, command a motor step and record the response time. Set that delay in the simulator. Use identification for parameters that you can measure well, and randomisation for the rest.

Perception randomisation changes the images. Random textures, lights, and camera positions make the policy ignore them. The original domain randomisation paper trained an object detector on cartoon-like scenes and ran it on a real camera with no real images at all.

A transfer test measures the gap directly:

1. Run the policy in simulation for 20 episodes and record the success rate.
2. Run the same policy on the real robot for 20 episodes.
3. The difference is the gap. A gap under 10 percent is good.

Caution: a policy that works in simulation can damage a real robot. Add joint limits and a kill switch before the first real run.

The snippet draws randomised parameters for three episodes and computes the training budget from the example.

:::code
lang: python
file: randomise.py
import numpy as np

rng = np.random.default_rng(0)

def draw_parameters():
    return {
        "friction": rng.uniform(0.4, 1.2),
        "motor_delay_ms": rng.uniform(0, 40),
        "mass_scale": rng.uniform(0.9, 1.1),
        "push_newtons": rng.uniform(0, 5),
    }

for episode in range(3):
    p = draw_parameters()
    print(episode, {k: round(v, 2) for k, v in p.items()})

robots, steps, sim_rate, updates = 4096, 24, 200_000, 1500
per_update = robots * steps
seconds = per_update / sim_rate
print(f"{per_update} steps per update, {seconds:.2f} s each, "
      f"{updates * seconds / 60:.0f} min total")
:::

:::code
lang: text
0 {'friction': 0.91, 'motor_delay_ms': 10.79, 'mass_scale': 0.91, 'push_newtons': 0.08}
1 {'friction': 1.05, 'motor_delay_ms': 36.51, 'mass_scale': 1.02, 'push_newtons': 3.65}
2 {'friction': 0.83, 'motor_delay_ms': 37.4, 'mass_scale': 1.06, 'push_newtons': 0.01}
98304 steps per update, 0.49 s each, 12 min total
:::

## Try it

:::exercise
title: Estimate a training budget
task: A smaller graphics card runs 2,048 robots at 100,000 steps per second. Each update uses 48 steps per robot and the policy needs 3,000 updates. Compute the steps per update, the seconds per update, and the total training time in minutes. Do it on paper first. Then write the three lines of Python and compare.
hint: Steps per update is robots times steps. Seconds per update is that number divided by the simulator rate. Total time is updates times seconds per update.
lang: python
solution:
robots, steps, sim_rate, updates = 2048, 48, 100_000, 3000
per_update = robots * steps                 # 98304 steps
seconds = per_update / sim_rate             # 0.98 s
print(per_update, round(seconds, 2), round(updates * seconds / 60), "min")
# 98304 0.98 49 min
:::

## Common mistakes

- Mistake: tune the simulator until one policy transfers, then change the robot. Fix: randomise ranges, so the policy survives later hardware changes.
- Mistake: randomise every parameter with a wide range at once. Fix: start with dynamics ranges, confirm the policy learns, then add perception ranges.
- Mistake: compare only the final success rate. Fix: log the same metrics in simulation and on the robot, such as foot slip and torque, to find which source causes the gap.
- Mistake: ignore sensor latency in simulation. Fix: delay observations by the measured camera and network latency.

## Check your understanding

:::quiz
title: Check: sim-to-real transfer
q: What is the sim-to-real gap?
- The time a simulator needs to match real time
* The drop in policy performance from the simulator to the real robot
- The number of parameters the simulator cannot model
- The difference between two simulators
why: The gap is measured directly as the success rate in simulation minus the success rate on the real robot.
q: What does domain randomisation change?
- The real robot's motors, to match the simulator
* Simulator parameters, drawn at random for each episode
- The policy network size
- The reward function at each step
why: Each episode draws friction, delay, mass, and pushes from ranges that contain the real values, so the policy learns to be robust.
q: The simulator runs 200,000 steps per second with 4,096 robots and 24 steps per update. How long does one update take?
- 0.05 s
* About 0.5 s
- About 5 s
- 24 s
why: 4,096 times 24 is 98,304 steps, divided by 200,000 per second gives about 0.49 s.
q: When should you use system identification instead of randomisation?
- When the policy fails to learn in simulation
* When you can measure the parameter accurately on the real robot
- When the parameter changes with the battery level
- When the simulator has no setting for it
why: A measured value such as motor delay goes straight into the simulator, and randomisation is kept for values you cannot pin down.
q: A policy scores 95 percent in simulation and 60 percent on the real robot. What is the best next step?
- Train longer in the same simulator
* Log the same metrics in both, such as foot slip and torque, to find which source causes the gap
- Narrow all randomisation ranges
- Remove the kill switch so the robot can recover
why: A 35 percent gap needs a diagnosis by source, dynamics, perception, or modelling, before you change the training.
:::

## Go further

The domain randomisation paper is the clear origin of the method, with images only. The Learning to Walk in Minutes paper shows thousands of parallel robots on one graphics card. MuJoCo and its documentation give you a free, accurate simulator. Isaac Lab is the framework behind many parallel training results. The /labs/agent-control-room lab shows how per-step reliability compounds over a long episode.
`,
        },
      ],
    },
  ],
}
