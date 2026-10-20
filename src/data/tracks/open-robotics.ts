import type { Track } from '../types'

export const track: Track = {
  slug: 'open-robotics',
  title: 'Open Robotics',
  tagline: 'Preview. Vision-language-action models and the sim-to-real gap.',
  description:
    'A preview track on embodied AI: how a robot sees, estimates its state, acts, and learns from demonstrations. Content is added weekly.',
  accent: 'var(--accent-robotics)',
  status: 'preview',
  modules: [
    {
      slug: 'vla',
      title: 'Vision-language-action models',
      description: 'From web-scale pretraining to motor commands.',
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

The model writes one action. The action is a vector of 7 numbers. Each number is a small change for one joint or for the gripper. For example, the output could be (0.01, -0.02, 0.00, 0.0, 0.0, 0.1, 1.0). The first three numbers move the gripper 1 cm along x and 2 cm along y. The last number closes the gripper.

The control loop then repeats:

1. Read a new camera image.
2. Run the model to get the next action.
3. Send the action to the motors.
4. Wait for the next control tick, often 10 times per second.

After 50 ticks, the block is in the bowl. The model never planned the full path. It chose one small step at a time.

## How it works

A VLA model starts from a vision-language model (VLM). A VLM is a network pretrained to connect images and text. RT-2 started from PaLI-X. OpenVLA started from Prismatic, a 7-billion-weight VLM built on Llama 2.

The developers then fine-tune the VLM on robot episodes. An episode is a sequence of (image, instruction, action) triples recorded while a person teleoperates the robot. The model learns to predict the action from the image and the instruction.

The output must be text-like for a language model. The developers convert each action number to a token. The procedure is:

1. Clip each action dimension to a range, for example -1 to 1.
2. Split the range into 256 equal bins.
3. Replace the number with the bin index, an integer from 0 to 255.
4. Map each integer to a reserved token in the vocabulary.

A 7-dimensional action becomes 7 tokens. If the model predicts a chunk of 5 future steps, it writes 35 tokens per control tick. The loss is the normal next-token cross-entropy loss, so the training code does not change.

Note: the next lesson covers action tokens in more detail.

At test time, the model outputs 7 tokens. The driver converts each token back to the bin centre. The result is the action vector.

The main limits are speed and data. A 7-billion-weight model runs at about 5 to 10 actions per second on one high-end graphics card. Fine motor tasks need faster control. Robot data is also small. Open X-Embodiment, the largest open set, has about 1 million episodes. Web text has trillions of tokens.

## Common mistakes

- Mistake: treat the VLA model as a planner that outputs a full trajectory. Fix: the model outputs one action or a short chunk, and the loop runs again after each step.
- Mistake: fine-tune only on the new task data. Fix: mix in the original robot data, or the model forgets its general skills.
- Mistake: run the model at a control rate it cannot reach. Fix: measure the model latency and set the control tick to that value or slower.
- Mistake: evaluate only on scenes from the training set. Fix: test with new objects, new positions, and new lighting to measure generalisation.

## Check your understanding

- What are the two main inputs to a VLA model? Camera images and a text instruction.
- How many action tokens does a 7-dimensional action with 256 bins produce? 7 tokens, one per dimension.
- Why does a VLA model start from a vision-language model? The VLM already connects images and words, so the robot inherits that knowledge.

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

The bin width is the range divided by the number of bins:

$$w = \\frac{0.05 - (-0.05)}{256} = \\frac{0.1}{256} \\approx 0.00039 \\text{ m}$$

Here $w$ is the width of one bin in metres. The maximum rounding error is half a bin, about 0.2 mm. That is fine for a block in a bowl. It is too coarse to insert a 0.1 mm pin.

Now convert the value 0.012 m to a token:

1. Shift the value to start at zero: 0.012 + 0.05 = 0.062.
2. Divide by the bin width: 0.062 / 0.00039 = 158.7.
3. Round down: bin index 158.
4. Add the index to the start of the reserved token range to get the token id.

To convert back, take the bin centre: (158 + 0.5) × 0.00039 - 0.05 = 0.0118 m. The error is 0.2 mm.

Now add chunking. Instead of one action per tick, the model predicts a chunk of 10 future actions. The control loop runs the model once, then plays the 10 actions over 10 ticks. At 10 ticks per second, the model runs once per second. A model with 500 ms of latency can now keep up.

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

Note: a diffusion head needs 10 or more denoising steps, so the model latency rises. Chunking makes up for the extra time.

## Common mistakes

- Mistake: use the full min and max of the data as the bin range. Fix: use percentiles, or one outlier makes all other bins too coarse.
- Mistake: set the chunk size larger than the time the scene stays the same. Fix: keep the chunk short enough that the robot reacts to a moved object.
- Mistake: forget to store the bin ranges with the checkpoint. Fix: save the ranges in the model config, or the decoded actions are wrong.
- Mistake: compare policies at different control rates. Fix: run both at the same tick rate and the same chunk size.

## Check your understanding

- What is the maximum rounding error with 256 bins over a 0.1 m range? About 0.2 mm, half of one bin.
- Why does chunking help a slow model? The model runs once per chunk, so it has more time per call.
- What problem does a diffusion head solve that bins do not? It can represent two valid actions without averaging them into an invalid one.

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

## The idea with an example

A lab records episodes with teleoperation. A person moves a controller, and the robot copies the motion. The system logs the camera image and the action at 10 frames per second.

Suppose one episode lasts 30 seconds. That is 300 frames. The lab records 500 episodes per day. After 20 days it has 10,000 episodes, 3 million frames, and about 83 hours of robot time.

Now compare this with Open X-Embodiment. That dataset pools 22 robot types from 21 labs. It has over 1 million episodes and 527 skills. One lab cannot record that alone, so pooling is the only way to reach that size.

The RT-X experiment trained one model on all robots and tested on each robot. The pooled model beat the single-robot model on 5 of 6 labs tested. The pooled model had a mean success rate about 50 percent higher in the small-data labs.

## How it works

Cross-embodiment training means one model learns from robots with different arms, cameras, and grippers. The method is simple:

1. Convert every dataset to the same format: image, instruction, action vector.
2. Pad or map the action vector to a common 7-dimensional layout.
3. Sample batches with a weight per dataset, so large datasets do not drown small ones.
4. Train one model on the mixture.
5. Fine-tune on the target robot with a small set of its own episodes.

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

Caution: a policy that scores 90 percent on seen objects and 20 percent on unseen objects has memorised the training set. Report both numbers.

Distribution shift is the gap between training conditions and test conditions. Lighting, camera angle, and table height all shift. Record data under many conditions to reduce the shift.

## Common mistakes

- Mistake: record all episodes from one camera position. Fix: move the camera a little between sessions so the policy does not depend on exact pixels.
- Mistake: report success on 5 trials. Fix: run at least 20 trials per condition and report the standard error.
- Mistake: let the person who trained the policy also judge success. Fix: write a clear success rule before the test, and have a second person score.
- Mistake: mix the test objects into the training set. Fix: keep a list of held-out objects and never record with them.

## Check your understanding

- How many frames does a 30-second episode at 10 frames per second hold? 300 frames.
- What does cross-embodiment training mean? One model trains on data from many different robot types.
- Why is a 5 percent gap between two policies at 20 trials not meaningful? The standard error is about 10 percent, larger than the gap.

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

A block corner sits at 0.1 m to the right, 0.05 m down, and 0.5 m in front of the camera. In camera coordinates, the point is $(X, Y, Z) = (0.1, 0.05, 0.5)$.

Project the point to a pixel:

1. Divide X and Y by Z: 0.1 / 0.5 = 0.2 and 0.05 / 0.5 = 0.1.
2. Multiply by the focal length: 0.2 × 500 = 100 and 0.1 × 500 = 50.
3. Add the principal point: 320 + 100 = 420 and 240 + 50 = 290.

The corner appears at pixel (420, 290).

Now move the block to 1.0 m away. Step 1 gives 0.1 and 0.05. Step 2 gives 50 and 25. The pixel is (370, 265). The block moved half as far from the centre, because it is twice as far from the camera.

## How it works

The pinhole model is:

$$u = f_x \\frac{X}{Z} + c_x, \\qquad v = f_y \\frac{Y}{Z} + c_y$$

Here $(u, v)$ is the pixel, $(X, Y, Z)$ is the point in camera coordinates in metres, $f_x$ and $f_y$ are the focal lengths in pixels, and $(c_x, c_y)$ is the principal point. The four numbers $f_x$, $f_y$, $c_x$, $c_y$ are the intrinsic parameters. They form the intrinsic matrix $K$:

$$K = \\begin{pmatrix} f_x & 0 & c_x \\\\ 0 & f_y & c_y \\\\ 0 & 0 & 1 \\end{pmatrix}$$

The focal length in pixels depends on the lens and the sensor. A wide lens has a small focal length. A zoom lens has a large one.

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

## Common mistakes

- Mistake: use the focal length in millimetres from the lens box. Fix: use the focal length in pixels from calibration.
- Mistake: calibrate with photos only at the image centre. Fix: cover the edges and corners, because distortion is largest there.
- Mistake: change the camera resolution after calibration. Fix: recalibrate, or scale the intrinsic parameters by the same factor.
- Mistake: swap the row and column order of a pixel. Fix: define $u$ as the column and $v$ as the row, and keep this everywhere.

## Check your understanding

- Where does the point (0.2, 0.0, 1.0) appear with f = 500 and principal point (320, 240)? At pixel (420, 240).
- What four numbers are the intrinsic parameters? $f_x$, $f_y$, $c_x$, $c_y$.
- What does a reprojection error of 0.3 pixels mean? The model predicts corner positions within 0.3 pixels of the detected ones, which is a good calibration.

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

A cup is 0.5 m away. The left camera sees the cup at column 400. The right camera sees it at column 340. The difference is the disparity, $d = 60$ pixels.

Depth from disparity is:

$$Z = \\frac{f \\, b}{d} = \\frac{500 \\times 0.06}{60} = 0.5 \\text{ m}$$

Here $Z$ is depth in metres, $f$ is the focal length in pixels, $b$ is the baseline in metres, and $d$ is the disparity in pixels.

Now move the cup to 2.0 m. The disparity is 500 × 0.06 / 2.0 = 15 pixels. If the matcher is off by 1 pixel, the depth becomes 500 × 0.06 / 14 = 2.14 m. The error is 14 cm. At 0.5 m, the same 1-pixel error gives 0.508 m, an error of 8 mm. Stereo error grows with the square of the distance.

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

Caution: a depth sensor returns zero or a wrong value on glass, mirrors, and shiny metal. Check the invalid-pixel rate before you trust a grasp.

## Common mistakes

- Mistake: use a structured light sensor outdoors. Fix: use stereo or time of flight, because sunlight hides the pattern.
- Mistake: trust stereo depth at 5 m with a 6 cm baseline. Fix: compute the error at that range first, or use a larger baseline.
- Mistake: treat a learned relative depth as metres. Fix: calibrate the scale with a known object or use a metric model.
- Mistake: build point clouds from pixels with depth zero. Fix: mask invalid pixels before projection.

## Check your understanding

- What is the depth for f = 500 pixels, b = 0.1 m, d = 25 pixels? 2.0 m.
- Why does stereo fail on a blank wall? There is no texture to match between the two images.
- What does depth zero usually mean in a depth image? The sensor failed to measure that pixel.

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

## The idea with an example

A mobile robot moves along a line. At time 0 it is at position 0 with velocity 1 m/s. We estimate its position once per second.

Step 1, predict. The motion model says the robot moves 1 m per second. The predicted position is 1.0 m. The wheels slip a little, so the prediction has a variance. We set the process noise variance to $Q = 0.04$, which is a standard deviation of 0.2 m. The prediction variance is $P = 0.04$.

Step 2, measure. A camera reports the position as 1.3 m. The camera has a measurement noise variance of $R = 0.09$, a standard deviation of 0.3 m.

Step 3, compute the Kalman gain:

$$K = \\frac{P}{P + R} = \\frac{0.04}{0.04 + 0.09} = 0.31$$

Here $K$ is the gain, $P$ is the prediction variance, and $R$ is the measurement variance.

Step 4, update the estimate:

$$\\hat{x} = 1.0 + K (1.3 - 1.0) = 1.0 + 0.31 \\times 0.3 = 1.09 \\text{ m}$$

The estimate moves 31 percent of the way to the measurement. The prediction is more trusted because its variance is smaller.

Step 5, update the variance:

$$P' = (1 - K) P = 0.69 \\times 0.04 = 0.028$$

The variance dropped. Two sources of information are better than one.

Now suppose the camera was very precise, with $R = 0.01$. Then $K = 0.04 / 0.05 = 0.8$, and the estimate is 1.24 m. The filter trusts the better source.

## How it works

The Kalman filter repeats two steps at each tick:

1. Predict: move the state forward with the motion model, and add the process noise $Q$ to the variance.
2. Update: compute the gain $K$, correct the state with the measurement, and shrink the variance.

In more than one dimension, the state is a vector $x$, the variance is a matrix $P$, and the equations use matrices. The prediction is $x' = F x$, where $F$ is the motion model matrix. The measurement is $z = H x + \\text{noise}$, where $H$ selects which parts of the state the sensor sees. The gain is $K = P H^T (H P H^T + R)^{-1}$. The structure is the same as the 1D case: the gain is the prediction variance divided by the total variance.

To choose the noise values:

1. Hold the robot still and record the sensor for 60 seconds.
2. Compute the variance of the readings. This is $R$.
3. Drive the robot a known distance 10 times with the motion model only.
4. Compute the variance of the end-point error. This is $Q$ per step.

Note: the filter assumes Gaussian noise and a linear model. For a rotating robot, the extended Kalman filter linearises the model at the current estimate. Visual SLAM systems such as ORB-SLAM3 use related optimisation instead of a filter for the map.

## Common mistakes

- Mistake: set $R$ to a tiny value to make the filter follow the sensor. Fix: measure $R$ from real data, or the filter copies sensor noise.
- Mistake: set $Q$ to zero. Fix: use a nonzero $Q$, or the filter stops trusting new measurements over time.
- Mistake: feed the same measurement twice. Fix: timestamp each measurement and use each one once.
- Mistake: ignore the latency of the camera. Fix: apply the measurement at the time it was taken, not the time it arrived.

## Check your understanding

- What is the gain when P = 0.1 and R = 0.1? 0.5, so the estimate is the average of prediction and measurement.
- What happens to the variance after an update? It decreases, because the filter has more information.
- Why does a zero process noise cause problems? The variance shrinks to zero and the filter ignores all new measurements.

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

We use gains $K_p = 0.5$, $K_i = 0.1$, and $K_d = 0.2$. The time step is 0.1 s. The command is in volts.

Step 1, time 0.0 s. Position 0. Error = 90. Integral = 90 × 0.1 = 9. Derivative = (90 - 90) / 0.1 = 0, because the previous error was also 90.

Command = 0.5 × 90 + 0.1 × 9 + 0.2 × 0 = 45 + 0.9 + 0 = 45.9 V.

Step 2, time 0.1 s. The joint moved to 30 degrees. Error = 60. Integral = 9 + 60 × 0.1 = 15. Derivative = (60 - 90) / 0.1 = -300.

Command = 0.5 × 60 + 0.1 × 15 + 0.2 × (-300) = 30 + 1.5 - 60 = -28.5 V.

The derivative term is large and negative. It brakes the joint because the error is falling fast.

Step 3, time 0.2 s. The joint is at 50 degrees. Error = 40. Integral = 15 + 4 = 19. Derivative = (40 - 60) / 0.1 = -200.

Command = 20 + 1.9 - 40 = -18.1 V.

The joint slows as it nears the target. Without the derivative term, the command at step 2 would be 31.5 V, and the joint would pass 90 and come back.

## How it works

The PID law is:

$$u(t) = K_p e(t) + K_i \\int_0^t e(\\tau) \\, d\\tau + K_d \\frac{de(t)}{dt}$$

Here $u$ is the command, $e$ is the error, $K_p$ is the proportional gain, $K_i$ is the integral gain, and $K_d$ is the derivative gain.

Each term has one job:

- The proportional term pushes harder when the error is larger. Alone, it leaves a small steady error against gravity or friction.
- The integral term sums the error over time. It removes the steady error. Too much causes slow oscillation.
- The derivative term resists fast change. It reduces overshoot. It also amplifies sensor noise.

Manual tuning procedure:

1. Set $K_i$ and $K_d$ to zero.
2. Raise $K_p$ until the joint oscillates with a steady amplitude. Note this value and the period.
3. Set $K_p$ to half of that value.
4. Raise $K_d$ until the overshoot is below 10 percent.
5. Raise $K_i$ until the steady error goes to zero in about 1 second.

Integral windup happens when the motor hits its limit. The error stays large, the integral grows, and the joint overshoots when the limit clears. Fix it by clamping the integral to a maximum value.

Caution: test a new gain set with a small setpoint change first. A gain that is 10 times too large can damage the arm.

## Common mistakes

- Mistake: tune on the bench and deploy with a heavier gripper. Fix: retune after any change of mass or load.
- Mistake: compute the derivative from a noisy raw sensor. Fix: filter the measurement first, or compute the derivative of the measurement rather than the error.
- Mistake: let the integral grow without limit. Fix: clamp the integral and reset it on a large setpoint change.
- Mistake: run the loop at a variable rate. Fix: use a fixed timer, because the integral and derivative assume a known time step.

## Check your understanding

- What is the proportional command when $K_p = 0.5$ and the error is 20? 10.
- Which term removes a steady error from gravity? The integral term.
- What causes integral windup? The motor saturates while the error stays large, so the integral grows too much.

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

## The idea with an example

A person drives a toy car along a lane 100 times. Each run has 50 steps. At each step the logger saves the camera image and the steering angle. The dataset has 5,000 pairs.

We train a network to predict the steering angle from the image. The loss is mean squared error. After training, the network matches the person on 98 percent of the training images.

Now the car drives itself. At step 1, it picks an angle that is a little off. At step 2, the car is 2 cm further left than any training image. The network has never seen that view. Its error is larger. At step 3, the car is 6 cm left. By step 20, it leaves the lane.

This is compounding error. The policy makes a small mistake, lands in a state it never saw, and makes a bigger mistake. If the error per step is $\\epsilon$, the total cost after $T$ steps can grow as $T^2 \\epsilon$. With $T = 50$ and $\\epsilon = 0.01$, the bound is 25 times worse than a policy with linear growth.

DAgger fixes this. We let the trained policy drive. The person watches and labels the correct steering angle at each step, but does not control the car. These new pairs show the states the policy actually visits. We add them to the dataset and retrain. After 3 rounds, the car stays in the lane.

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

DAgger needs an expert who can label states after the fact. For a human teleoperator this is costly. Two cheaper substitutes are common. The first is to add small noise to the expert's actions during recording, so the dataset already contains recovery moves. The second is to record many demonstrations from varied start positions.

Note: generative adversarial imitation learning trains a reward from demonstrations instead of copying actions. It avoids compounding error but needs a simulator and many interactions.

## Common mistakes

- Mistake: judge a policy by its loss on held-out demonstration pairs. Fix: run the policy on the robot, because low loss does not prevent drift.
- Mistake: record only perfect demonstrations. Fix: include recoveries from small errors so the policy learns to correct.
- Mistake: use mean squared error for actions with two valid choices. Fix: use a diffusion or token head, or the policy outputs the average of the two.
- Mistake: let the expert correct the car during DAgger collection. Fix: let the policy drive and only record the expert's label.

## Check your understanding

- What is behaviour cloning? Supervised learning from observation-action pairs recorded from an expert.
- Why does a cloned policy drift? Small errors lead to unseen states where the error is larger.
- What does DAgger add to the dataset? Expert labels for the states the learned policy itself visits.

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

On the real robot, the carpet friction is 0.6 and the motors respond 20 ms late. The policy falls on the first step.

Now train again with domain randomisation. At the start of each episode, the simulator draws:

- Friction from a uniform range 0.4 to 1.2.
- Motor delay from 0 to 40 ms.
- Robot mass from 90 to 110 percent of the nominal value.
- A random push of up to 5 N once per second.

The policy sees 4,096 different robots in each batch. It learns a gait that works across all of them. On the real carpet, it walks. The real robot is one more sample from the range.

The compute budget is simple to estimate. One policy update needs 4,096 robots × 24 steps = 98,304 steps. The simulator runs 200,000 steps per second. One update takes 0.5 s. A policy that needs 1,500 updates trains in about 12 minutes.

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

The policy must work for every draw, so it learns to be robust rather than exact. The cost is some performance: a policy for one exact robot is faster than one for a range.

System identification is the other method. Measure the real parameter and set it in the simulator. For example, command a motor step and record the response time. Set that delay in the simulator. Use identification for parameters that you can measure well, and randomisation for the rest.

Perception randomisation changes the images. Random textures, lights, and camera positions make the policy ignore them. The original domain randomisation paper trained an object detector on cartoon-like scenes and ran it on a real camera with no real images at all.

A transfer test measures the gap directly:

1. Run the policy in simulation for 20 episodes and record the success rate.
2. Run the same policy on the real robot for 20 episodes.
3. The difference is the gap. A gap under 10 percent is good.

Caution: a policy that works in simulation can damage a real robot. Add joint limits and a kill switch before the first real run.

## Common mistakes

- Mistake: tune the simulator until one policy transfers, then change the robot. Fix: randomise ranges, so the policy survives later hardware changes.
- Mistake: randomise every parameter with a wide range at once. Fix: start with dynamics ranges, confirm the policy learns, then add perception ranges.
- Mistake: compare only the final success rate. Fix: log the same metrics in simulation and on the robot, such as foot slip and torque, to find which source causes the gap.
- Mistake: ignore sensor latency in simulation. Fix: delay observations by the measured camera and network latency.

## Check your understanding

- What is the sim-to-real gap? The drop in policy performance from the simulator to the real robot.
- What does domain randomisation change? Simulator parameters, drawn at random for each episode.
- When should you use system identification instead of randomisation? When you can measure the parameter accurately on the real robot.

## Go further

The domain randomisation paper is the clear origin of the method, with images only. The Learning to Walk in Minutes paper shows thousands of parallel robots on one graphics card. MuJoCo and its documentation give you a free, accurate simulator. Isaac Lab is the framework behind many parallel training results. The /labs/agent-control-room lab shows how per-step reliability compounds over a long episode.
`,
        },
      ],
    },
  ],
}
