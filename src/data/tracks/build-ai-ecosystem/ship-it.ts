import type { Module } from '../../types'

export const mod: Module = {
  slug: 'ship-it',
  title: 'Ship it: deploy, monitor, cost',
  description: 'Put the aiworkshop service in a container, deploy it to a public URL, watch it with logs and traces, control the bill, and demo the whole ecosystem.',
  level: 'beginner',
  lessons: [
    {
      slug: 'dockerise',
      title: 'A Docker image for your service',
      summary: 'Write a Dockerfile for the aiworkshop FastAPI service, build an image, run it with environment variables, and add a health check.',
      minutes: 22,
      objectives: [
        'Write a Dockerfile that packages the aiworkshop service with its Python dependencies.',
        'Build an image, run a container from it, and pass an API key with an environment variable.',
        'Explain what an image layer is and why the order of Dockerfile lines changes build time.',
        'Add a health check endpoint and a HEALTHCHECK instruction, and read the container status.',
      ],
      keyTerms: ['base image', 'image layer', 'build context', 'health check', 'port mapping', 'container registry'],
      links: [
        { label: 'Dockerfile reference', url: 'https://docs.docker.com/reference/dockerfile/', kind: 'docs' },
        { label: 'Docker build cache', url: 'https://docs.docker.com/build/cache/', kind: 'docs' },
        { label: 'docker run reference', url: 'https://docs.docker.com/reference/cli/docker/container/run/', kind: 'docs' },
        { label: 'FastAPI in containers', url: 'https://fastapi.tiangolo.com/deployment/docker/', kind: 'docs' },
      ],
      body: `
## What this lesson covers

You learn to package the aiworkshop service as a Docker image. A Docker image is a frozen copy of your program, its Python version and every library it needs. You write a Dockerfile, build the image, run it on your computer and give it your API key safely. At the end the service answers on http://localhost:8000 from inside a container, with a health check that reports whether it is alive.

## Why it matters

Up to now the aiworkshop service runs only on your computer, inside your virtual environment. A cloud server does not have your virtual environment. It does not have your Python version, your installed packages or your folder layout. A Docker image carries all of that with it. The next lesson, [Deploy to a cloud](/courses/build-ai-ecosystem/ship-it/deploy), sends this exact image to a server and gets a public URL. Without the image there is nothing to send.

:::video
id: Gjnup-PuquQ
why: Watch all 2 minutes. It names the problem, "it works on my machine", and shows the image and container idea that this lesson builds.
:::

## The idea with an example

> **Analogy.** A lunchbox holds a complete meal: the food, the fork, the napkin, the sauce. You can carry it to any table and eat the same meal. A Docker image is a lunchbox for a program. It holds the code, the Python interpreter, the libraries and the start command. Any computer with Docker installed can open the box and run the same program. A container is one opened lunchbox: a running copy of the image.

Here is the running example for this lesson. Your repository looks like this after the earlier modules:

:::code
lang: text
aiworkshop/
  app/           FastAPI service: main.py with /chat and /ask
  chat/          chat loop and streaming helpers
  rag/           loader, chunker, embedder, retriever
  agents/        tool definitions and the agent loop
  data/          documents and the vector store files
  eval/          test questions and grading scripts
  train/         dataset builder and LoRA notebook
  requirements.txt
  .env.example
:::

The service starts with one command: uvicorn app.main:app --host 0.0.0.0 --port 8000. Uvicorn is the web server program that runs a FastAPI app. The service needs one secret, ANTHROPIC_API_KEY, which it reads from an environment variable. An environment variable is a named value that the operating system gives to a program when it starts.

You want one file that tells Docker how to build the lunchbox. That file is the Dockerfile. Here is the complete Dockerfile for aiworkshop:

:::code
lang: dockerfile
file: Dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')"

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
:::

Read it line by line. FROM picks the base image, the starting point that already contains Linux and Python 3.12. The word slim means a small variant without build tools. WORKDIR sets the folder inside the image where later commands run. COPY requirements.txt copies one file from your computer into the image. RUN pip install executes a command inside the image during the build. COPY . . copies the rest of your repository. EXPOSE documents that the program listens on port 8000. HEALTHCHECK tells Docker how to test that the service is alive. CMD is the command that runs when a container starts.

The diagram shows the path from your folder to a running container.

:::flow
title: From Dockerfile to a running service
Dockerfile -> docker build: reads each instruction
docker build -> Image: writes one layer per line
Image -> docker run: starts a container
docker run -> Container: runs uvicorn on port 8000
Container -> Browser: answers on localhost:8000
:::

Now build the image. Open a terminal in the aiworkshop folder and run the build command. The -t flag gives the image a tag, a human name such as aiworkshop:0.1. The dot at the end names the build context, the folder that Docker sends to the build.

:::code
lang: bash
docker build -t aiworkshop:0.1 .
:::

The first build downloads the base image and installs every package. On a normal home connection it takes about 60 to 120 seconds. The output ends like this:

:::code
lang: text
[+] Building 94.3s (11/11) FINISHED
 => [1/5] FROM docker.io/library/python:3.12-slim        12.1s
 => [2/5] WORKDIR /app                                    0.1s
 => [3/5] COPY requirements.txt .                         0.0s
 => [4/5] RUN pip install --no-cache-dir -r requirements  78.6s
 => [5/5] COPY . .                                        0.4s
 => exporting to image                                    2.9s
 => => naming to docker.io/library/aiworkshop:0.1
:::

Check the size with docker images. The python:3.12-slim base image is about 150 megabytes (MB). After pip installs fastapi, uvicorn, the anthropic client, chromadb and their dependencies, the aiworkshop image is about 420 MB. The full python:3.12 image, without slim, is about 1,000 MB before you add anything. The bars compare the three.

:::bars
title: Image size by base image choice
unit: MB
python:3.12-slim alone: 150
aiworkshop on slim: 420
python:3.12 full alone: 1000
:::

Now run a container. The -p flag sets a port mapping: it connects port 8000 on your computer to port 8000 inside the container. The -e flag sets an environment variable inside the container. The --name flag names the container so you can refer to it later.

:::code
lang: bash
docker run --name aiw -p 8000:8000 -e ANTHROPIC_API_KEY=sk-ant-your-key aiworkshop:0.1
:::

Uvicorn prints that it listens on http://0.0.0.0:8000. Open a second terminal and send a request:

:::code
lang: bash
curl -s -X POST http://localhost:8000/chat -H "Content-Type: application/json" -d '{"message": "Say hello in five words."}'
:::

:::code
lang: text
{"reply": "Hello there, nice to meet you.", "model": "claude-sonnet-5-5", "input_tokens": 19, "output_tokens": 9}
:::

The same program that ran in your virtual environment now runs in a container. The step player walks the whole example.

:::scenario
title: Build and run aiworkshop in a container
state: image=none, container=none, health=unknown
step: Run docker build with the tag aiworkshop:0.1. Docker reads the Dockerfile and executes the 5 instructions in order.
state: image=aiworkshop:0.1 (420 MB)
step: Run docker run with -p 8000:8000 and -e ANTHROPIC_API_KEY. Docker starts a container from the image and runs uvicorn.
state: container=aiw (running), health=starting
step: After 30 seconds Docker runs the HEALTHCHECK command. It fetches /health and gets status 200.
state: health=healthy
step: Send a POST to /chat with curl. The request enters through the port mapping and the service answers.
step: Press Ctrl+C in the first terminal. The container stops, and the image stays on disk for the next run.
state: container=aiw (exited), health=unknown
:::

## How it works

A Docker image is a stack of image layers. Each instruction in the Dockerfile that changes files makes one layer. A layer is a read-only set of file changes, like one commit in Git. Docker stores every layer and reuses it when the instruction and its inputs have not changed. This reuse is the build cache.

The order of lines matters because of the cache. When a layer changes, Docker rebuilds that layer and every layer after it. In the aiworkshop Dockerfile the requirements.txt copy and the pip install come before COPY . . of the code. You change code many times a day and change requirements rarely. So a code change invalidates only the last COPY layer. The 78 second pip install layer stays cached and the rebuild takes about 3 seconds.

| Instruction | What it does | Makes a layer? |
| --- | --- | --- |
| FROM python:3.12-slim | Start from a base image with Linux and Python | Yes, the base layers |
| WORKDIR /app | Set the working folder for later instructions | Yes, a tiny one |
| COPY requirements.txt . | Copy one file from the build context | Yes |
| RUN pip install -r requirements.txt | Run a command during the build | Yes, often the largest |
| COPY . . | Copy the rest of the repository | Yes, changes most often |
| EXPOSE 8000 | Document the port the program uses | No, metadata only |
| HEALTHCHECK | Define a command that tests the container | No, metadata only |
| CMD | Set the command that runs at container start | No, metadata only |

The general procedure for any Python service is:

1. Pick a slim base image that matches the Python version you tested with.
2. Copy only the dependency file and install it, so this expensive layer is cached.
3. Copy the code.
4. Declare the port and the start command.
5. Add a health check so Docker and the cloud host can tell a live service from a dead one.
6. Build, run, test with curl, and fix problems one at a time.

A health check needs an endpoint. An endpoint is one URL path that the service answers. Add this to app/main.py, next to /chat and /ask:

:::code
lang: python
file: app/main.py (add to the existing file)
@app.get("/health")
def health():
    return {"status": "ok", "version": "0.1"}
:::

The HEALTHCHECK instruction runs the Python one-liner every 30 seconds. If the request fails 3 times in a row, Docker marks the container unhealthy. You read the status with docker ps:

:::code
lang: bash
docker ps --format "table {{.Names}}\\t{{.Status}}\\t{{.Ports}}"
:::

:::code
lang: text
NAMES   STATUS                    PORTS
aiw     Up 2 minutes (healthy)    0.0.0.0:8000->8000/tcp
:::

Two rules keep secrets out of the image. First, never COPY a .env file with a real key into an image. Anyone who gets the image can read every file in it. Second, create a .dockerignore file that lists what the build must not send. The .dockerignore file works like .gitignore but for the build context. Here is the one for aiworkshop:

:::code
lang: text
file: .dockerignore
.env
.git
.venv
__pycache__
*.pyc
data/vectors/
train/checkpoints/
:::

The data/vectors/ and train/checkpoints/ folders can hold hundreds of MB. Keeping them out makes the build context small and the build fast. The deployed service will load the vector store from a mounted volume or rebuild it at start, which the deploy lesson covers.

When the image works, you can push it to a container registry. A container registry is a server that stores images, like GitHub stores code. Docker Hub and GitHub Container Registry are free for public images. The cloud hosts in the next lesson build the image for you from the Dockerfile, so you do not need to push yet. But knowing the commands helps:

:::code
lang: bash
docker tag aiworkshop:0.1 yourname/aiworkshop:0.1
docker push yourname/aiworkshop:0.1
:::

Three useful commands to remember. docker logs aiw prints what the container has written. docker exec -it aiw bash opens a shell inside the running container so you can look around. docker rm -f aiw removes the container when you are done; the image stays.

## Try it

:::exercise
title: Make the rebuild fast
task: Build the image once and time it. Then change one line in app/main.py, for example the version string in /health, and build again. Write down both times. Then move the line COPY . . above the COPY requirements.txt line, change the version string once more, and build a third time. Explain the difference in a sentence.
hint: Watch the output of the third build. Every layer after the first changed layer prints a time instead of the word CACHED. The pip install layer is the one to watch.
lang: bash
solution:
# Build 1: about 90 seconds, every layer runs.
time docker build -t aiworkshop:0.1 .

# Edit app/main.py, then build 2: about 3 seconds.
# Layers 1 to 4 print CACHED. Only COPY . . and the export run.
time docker build -t aiworkshop:0.2 .

# Move COPY . . above COPY requirements.txt, edit app/main.py, build 3:
# about 90 seconds again. The code layer now comes first, so the change
# invalidates it and every layer after it, including the pip install.
time docker build -t aiworkshop:0.3 .

# Conclusion: put the files that change least often first.
:::

## Common mistakes

- Mistake: the container starts but curl from your computer gets "connection refused". Fix: run uvicorn with --host 0.0.0.0, not 127.0.0.1, because 127.0.0.1 inside the container is not your computer.
- Mistake: the image is 1.2 GB and the build takes 5 minutes. Fix: use the slim base image and a .dockerignore file that excludes .venv, .git and data folders.
- Mistake: a code change triggers a full pip install. Fix: copy requirements.txt and run pip install before COPY . . so the install layer stays cached.
- Mistake: the API key is baked into the image with COPY .env. Fix: never copy .env; pass the key at run time with -e or with the host's secret store.
- Mistake: docker ps shows (unhealthy) but the service answers. Fix: check that the /health path in the HEALTHCHECK matches the route in main.py and that the port matches.

## Check your understanding

:::quiz
title: Check: Docker images for a service
q: You change one line in app/main.py and rebuild. Which layers does Docker rebuild in the aiworkshop Dockerfile?
- Every layer, from FROM to CMD
* Only the COPY . . layer and the metadata after it
- Only the pip install layer
- No layers, because the image already exists
why: The cache reuses every layer up to the first changed one. COPY . . is the first instruction whose inputs changed, so Docker rebuilds from there.
q: What is the difference between an image and a container?
- An image runs; a container is the file on disk
* An image is the frozen package; a container is one running copy of it
- They are two names for the same thing
- A container is the Dockerfile; an image is the output of docker run
why: The image is the lunchbox, read-only and reusable. Each docker run opens it as a new container.
q: The slim base image is 150 MB and your image is 420 MB. About how much do your installed packages and code add?
- 150 MB
* 270 MB
- 420 MB
- 570 MB
why: 420 minus 150 is 270 MB. The packages, mostly chromadb and its dependencies, make up almost all of that.
q: Why does the lesson pass the API key with -e instead of copying .env into the image?
- Because -e makes the container start faster
- Because .env files are not valid inside Linux
* Because anyone with the image can read every file inside it, so a copied key leaks
- Because Docker refuses to copy hidden files
why: An image is distributed and stored in registries. A secret inside it is a secret for everyone who downloads it.
q: The health check runs every 30 seconds with 3 retries. What is the shortest time after a crash before Docker marks the container unhealthy?
- 3 seconds
- 30 seconds
* About 90 seconds
- 3 minutes
why: Docker needs 3 failed checks in a row. At one check every 30 seconds that is about 90 seconds.
:::

## Go further

The Dockerfile reference in the links lists every instruction, and the build cache page explains the layer rules in detail. The FastAPI deployment guide shows the same pattern for any FastAPI app. The next lesson, [Deploy to a cloud](/courses/build-ai-ecosystem/ship-it/deploy), takes this image, builds it on a cloud host, and gives your service a public HTTPS address that anyone can call.
`,
    },
    {
      slug: 'deploy',
      title: 'Deploy to a cloud',
      summary: 'Send the aiworkshop container to a host such as Fly.io or Render, set the API key as a secret, and get a public HTTPS URL.',
      minutes: 22,
      objectives: [
        'Deploy the aiworkshop image to a container host and reach it at a public URL.',
        'Explain what HTTPS and a TLS certificate do and why the host gives you one for free.',
        'Store the API key in the host secret store instead of a file.',
        'Read the deploy logs, check the health status, and roll back to the previous release.',
      ],
      keyTerms: ['container host', 'TLS certificate', 'secret store', 'rollout', 'rollback', 'edge'],
      links: [
        { label: 'Fly.io: Launch a Python app', url: 'https://fly.io/docs/python/', kind: 'docs' },
        { label: 'Fly.io: Secrets', url: 'https://fly.io/docs/apps/secrets/', kind: 'docs' },
        { label: 'Render: Deploy from a Dockerfile', url: 'https://render.com/docs/docker', kind: 'docs' },
        { label: 'Render: Blueprint spec (render.yaml)', url: 'https://render.com/docs/blueprint-spec', kind: 'docs' },
      ],
      body: `
## What this lesson covers

You take the image from the last lesson and run it on a computer that you do not own, in a data centre, with a public address. You learn what a container host does, how your service gets HTTPS, where the API key lives, and how to undo a bad release. At the end a friend on another continent can type your URL and get an answer from your service.

## Why it matters

A service on localhost helps only you. The goal of this track is a complete AI system, and a system that nobody else can reach is not complete. Deployment also forces good habits: the server has no .env file, no debugger and no one watching the terminal. Everything you set up here, the health check, the secret store, the logs, is what the next lesson, [Observability](/courses/build-ai-ecosystem/ship-it/observability), builds on.

:::video
id: pg19Z8LL06w
why: Watch from the start to the first running container, about 25 minutes. It repeats the build and run steps and then shows pushing an image to a registry, which is what a host does for you.
:::

## The idea with an example

> **Analogy.** You cooked in your kitchen for a year. Now you rent a stall at a market. The market owner gives you a numbered pitch, electricity, a sign with your name and a security guard at the gate. You bring your packed kitchen, your lunchbox from the last lesson. The market is the container host. The sign is your domain name. The guard who checks that visitors are who they say they are is HTTPS.

A container host is a company that runs your container on its servers and gives it a public address. You give it a Dockerfile or an image. It builds, starts, restarts and exposes the container. You pay for the memory and processor time the container uses. This lesson uses Fly.io as the running example and shows the Render equivalent, because both have a free or very cheap tier and both read your Dockerfile with no changes.

Here is the whole deployment on Fly.io in 4 commands. First install the flyctl command line tool from the Fly.io docs and sign up. Then, in the aiworkshop folder:

:::code
lang: bash
fly launch --name aiworkshop --region ams --no-deploy
fly secrets set ANTHROPIC_API_KEY=sk-ant-your-key
fly deploy
fly status
:::

fly launch reads the Dockerfile, asks a few questions, and writes a file called fly.toml with the app settings. The --no-deploy flag stops it from deploying before you set the secret. fly secrets set stores the key in the host secret store. A secret store is an encrypted place on the host that injects values as environment variables when the container starts. The key never sits in a file in your repository or your image. fly deploy builds the image on Fly's servers, starts it, and waits for the health check to pass. fly status shows the result.

The deploy output looks like this:

:::code
lang: text
==> Building image with Docker
--> Building image done
==> Pushing image to fly
--> Pushing image done
image: registry.fly.io/aiworkshop:deployment-01JXYZ
image size: 421 MB
Updating existing machines in 'aiworkshop' with rolling strategy
  [1/1] Checking that 3287e4f0 is up and running
  [1/1] Machine 3287e4f0 update finished: success
Visit your newly deployed app at https://aiworkshop.fly.dev/
:::

Now test from any computer:

:::code
lang: bash
curl -s https://aiworkshop.fly.dev/health
curl -s -X POST https://aiworkshop.fly.dev/chat -H "Content-Type: application/json" -d '{"message": "Where are you running?"}'
:::

:::code
lang: text
{"status":"ok","version":"0.1"}
{"reply":"I run inside a container on a server in Amsterdam.","model":"claude-sonnet-5-5","input_tokens":21,"output_tokens":12}
:::

Notice the address starts with https. HTTPS is HTTP with encryption. The browser and your server agree on a secret code before they talk, so nobody between them can read the API key or the user's question. The encryption needs a TLS certificate, a signed file that proves the server really is aiworkshop.fly.dev. Transport Layer Security (TLS) is the name of the encryption protocol. Fly.io and Render request this certificate for you and renew it every few months. You do nothing.

The diagram shows where your container now sits.

:::arch
title: aiworkshop after the first deploy
layer: Users | Browser, Terminal
layer: Edge | HTTPS proxy, Health checker
layer: Service | FastAPI app, Secret store
layer: Models | Claude API
flow: Browser -> HTTPS proxy -> FastAPI app -> Claude API -> FastAPI app -> HTTPS proxy -> Browser
note: HTTPS proxy = ends the encryption and forwards plain HTTP to port 8000
note: Health checker = calls /health every 30 seconds and restarts a dead container
note: Secret store = injects ANTHROPIC_API_KEY at container start
:::

The edge is the part of the host that faces the internet: the HTTPS proxy and the health checker. Your container never talks HTTPS itself. The proxy ends the encryption and forwards plain HTTP to port 8000 inside the container. That is why the Dockerfile and uvicorn did not change.

The step player follows one request from a browser in Tokyo to your container in Amsterdam and back.

:::scenario
title: One request to the deployed service
state: location=Tokyo browser, encrypted=no, status=none
step: The user types the URL. The browser looks up aiworkshop.fly.dev and gets the IP address of the Fly edge.
state: location=Fly edge
step: The browser and the edge agree on an encryption key using the TLS certificate. From now on the connection is encrypted.
state: encrypted=yes
step: The edge decrypts the request and forwards plain HTTP to port 8000 of the container in Amsterdam. Travel time Tokyo to Amsterdam is about 120 ms each way.
state: location=container, encrypted=no inside the host
step: The FastAPI app reads ANTHROPIC_API_KEY from its environment, calls the Claude API and gets a reply in about 1,400 ms.
state: status=200
step: The reply travels back through the edge, which encrypts it again, and reaches the browser. Total time about 1,700 ms.
state: location=Tokyo browser, encrypted=yes
:::

## How it works

Every container host does the same 6 jobs. The names differ, the jobs do not.

1. Build: read your Dockerfile and produce an image, or accept an image you pushed to a registry.
2. Schedule: pick a server with free memory and start the container there.
3. Expose: give the container a public hostname and a TLS certificate.
4. Inject: pass secrets and configuration as environment variables.
5. Check: call the health endpoint and restart the container when it fails.
6. Roll out: replace the old container with the new one on each deploy, and keep the old image for rollback.

The table compares three hosts for a small Python service in 2026. Prices change, so treat them as approximate and check the pricing pages.

| Host | How it gets your code | Smallest paid plan | Free tier | HTTPS | Secrets |
| --- | --- | --- | --- | --- | --- |
| Fly.io | Builds your Dockerfile, or you push an image | shared-cpu-1x, 256 MB, about USD 2 per month | Small free allowance | Automatic | fly secrets set |
| Render | Builds your Dockerfile from a Git repository | Starter, 512 MB, about USD 7 per month | Free web service that sleeps after 15 min idle | Automatic | Dashboard or render.yaml with sync false |
| AWS App Runner | Pulls an image from Amazon ECR | Pay per vCPU-second, about USD 5 to 15 per month for light use | None for this service | Automatic | AWS Secrets Manager |

The aiworkshop image needs about 350 MB of memory at rest and about 600 MB while chromadb loads the vector store. Pick at least 512 MB. On Fly.io, set it in fly.toml. Here is the file fly launch wrote, with the memory and health check filled in:

:::code
lang: text
file: fly.toml
app = "aiworkshop"
primary_region = "ams"

[build]

[env]
  MODEL = "claude-sonnet-5-5"
  LOG_LEVEL = "INFO"

[http_service]
  internal_port = 8000
  force_https = true
  auto_stop_machines = "stop"
  auto_start_machines = true
  min_machines_running = 0

[[http_service.checks]]
  interval = "30s"
  timeout = "5s"
  grace_period = "10s"
  method = "GET"
  path = "/health"

[[vm]]
  size = "shared-cpu-1x"
  memory = "512mb"
:::

The [env] section holds configuration that is not secret: the model name and the log level. Secrets go only through fly secrets set. The auto_stop_machines setting stops the container when nobody uses it and starts it on the next request. This costs a cold start of about 2 to 4 seconds for the first request after idle time, but a month of a service nobody uses costs almost nothing.

Render does the same with a file called render.yaml in the repository root. Render reads it when you connect your GitHub repository:

:::code
lang: yaml
file: render.yaml
services:
  - type: web
    name: aiworkshop
    runtime: docker
    plan: starter
    region: frankfurt
    healthCheckPath: /health
    envVars:
      - key: MODEL
        value: claude-sonnet-5-5
      - key: ANTHROPIC_API_KEY
        sync: false
:::

The line sync: false tells Render that you will type the value in the dashboard, so the key never enters Git. After you connect the repository, every push to the main branch triggers a new deploy.

A deploy is a rollout. The host starts the new container, waits for its health check to pass, then routes traffic to it and stops the old one. If the new container never becomes healthy, the host keeps the old one and reports a failed deploy. This is why the health check from the last lesson matters so much: it is the signal the host uses to decide.

When a deploy passes the health check but the service misbehaves, you roll back. A rollback starts the previous image again. On Fly.io:

:::code
lang: bash
fly releases
fly deploy --image registry.fly.io/aiworkshop:deployment-01JXYZ
:::

:::code
lang: text
VERSION  STATUS    DESCRIPTION   USER            DATE
v3       complete  Release       you@example.com 2 minutes ago
v2       complete  Release       you@example.com 1 hour ago
v1       complete  Release       you@example.com 1 day ago
:::

The first command lists releases with their image names. The second deploys an older image. Render has a Rollback button on each deploy in the dashboard. Both take about 30 seconds.

Three commands tell you what the service is doing right now:

:::code
lang: bash
fly status
fly logs
fly ssh console
:::

fly status shows the machine, its region, and its health. fly logs streams the stdout of your container, which is where uvicorn and your Python logging write. fly ssh console opens a shell inside the container, like docker exec did on your computer.

One more detail for aiworkshop. The vector store files in data/vectors/ are not in the image because .dockerignore excludes them. On the first start the service must rebuild them from data/documents/, which takes about 40 seconds for 200 pages. Add a startup step in app/main.py that checks whether the store exists and builds it when it does not. For a bigger store, attach a persistent volume with fly volumes create and mount it at /app/data/vectors. The Fly.io docs in the links show the exact commands.

## Try it

:::exercise
title: Deploy, break, roll back
task: Deploy aiworkshop with fly deploy and confirm /health returns status ok. Then change the /health endpoint in app/main.py so that it returns version 0.2, deploy again, and confirm the new version from the public URL. Finally, roll back to the first release with fly deploy --image and confirm /health shows version 0.1 again. Write down how many seconds each of the three deploys took.
hint: Use fly releases to find the image name of the first release. The deploy time appears in the last lines of fly deploy output. The rebuild is fast because only the COPY . . layer changes.
lang: bash
solution:
# 1. First deploy and check
fly deploy
curl -s https://aiworkshop.fly.dev/health
# {"status":"ok","version":"0.1"}

# 2. Edit app/main.py: "version": "0.2". Deploy and check.
fly deploy
curl -s https://aiworkshop.fly.dev/health
# {"status":"ok","version":"0.2"}

# 3. Roll back to the first image
fly releases
fly deploy --image registry.fly.io/aiworkshop:deployment-01JXYZ
curl -s https://aiworkshop.fly.dev/health
# {"status":"ok","version":"0.1"}

# Typical times: 95 s, 40 s, 30 s. The second deploy skips the pip
# layer. The rollback skips the build entirely.
:::

## Common mistakes

- Mistake: the deploy fails with "health check timed out" although the app works locally. Fix: check that internal_port in fly.toml matches the uvicorn port, 8000, and that /health exists.
- Mistake: the container crashes at start with a KeyError on ANTHROPIC_API_KEY. Fix: set the secret before the first deploy, with fly secrets set or the Render dashboard.
- Mistake: the app is killed with an out of memory error while loading the vector store. Fix: raise memory to 512 MB or 1 GB; the store needs more memory at start than at rest.
- Mistake: the first request after idle time takes 4 seconds and users complain. Fix: set min_machines_running = 1, and accept the small monthly cost, or keep auto stop and explain the cold start.
- Mistake: a key is committed to Git by accident in fly.toml or render.yaml. Fix: revoke the key at the provider at once, create a new one, and keep secrets only in the secret store.

## Check your understanding

:::quiz
title: Check: deploying a container
q: Your Dockerfile runs uvicorn on plain HTTP, yet users reach the service over HTTPS. Who does the encryption?
- Uvicorn, because FastAPI adds HTTPS by default
* The host's edge proxy, which ends TLS and forwards plain HTTP to port 8000
- The browser, which encrypts the request on its own
- Nobody, the padlock is only a label
why: The edge terminates TLS with the host's certificate. Your container never sees encrypted traffic.
q: A new deploy never passes its health check. What does a container host do?
- Routes all traffic to the new container anyway
- Deletes both the old and the new container
* Keeps the old container serving traffic and reports the deploy as failed
- Restarts your laptop
why: A rollout only switches traffic after the health check passes. A failed check protects the running version.
q: Where should ANTHROPIC_API_KEY live for the deployed service?
- In the [env] section of fly.toml
- In a .env file copied into the image
* In the host's secret store, set with fly secrets set or the Render dashboard
- In the first line of app/main.py
why: fly.toml and the image are shared and stored. The secret store is encrypted and injects the value only at start.
q: Fly.io charges about USD 2 per month for a 256 MB machine and about USD 4 for 512 MB. Your container needs 600 MB at start. What is the smallest size that works, and about what does it cost per month if it runs all the time?
- 256 MB, about USD 2
- 512 MB, about USD 4
* 1 GB, about USD 8, because 512 MB is below the 600 MB peak
- Any size, because memory does not matter for containers
why: The host kills a container that exceeds its memory. 600 MB at start needs the next size above 512 MB.
q: A request from Tokyo to a container in Amsterdam takes about 1,700 ms, and the model call is 1,400 ms of that. What is the biggest share of the remaining 300 ms?
* Network travel between Tokyo and the edge, about 120 ms each way
- Python parsing the JSON body
- Reading the API key from the environment
- The health check running at the same time
why: Crossing continents costs about 120 ms per direction. Parsing JSON and reading a variable take well under 1 ms.
:::

## Go further

The Fly.io Python guide and the secrets page in the links cover everything from this lesson plus volumes and custom domains. The Render Docker and Blueprint pages show the same ideas with a dashboard. Your service now has a public URL, but you cannot see what it does once you close fly logs. The next lesson, [Observability](/courses/build-ai-ecosystem/ship-it/observability), adds structured logs, traces and alerts so you know when it is slow or broken before a user tells you.
`,
    },
    {
      slug: 'observability',
      title: 'Observability: logs, traces and alerts',
      summary: 'Log every prompt and response as structured JSON, trace one request through its spans, read latency percentiles, and alert when the error rate rises.',
      minutes: 24,
      objectives: [
        'Write structured JSON logs from the aiworkshop service with a trace id on every line.',
        'Trace one request through its spans and read the result as a timeline.',
        'Compute p50, p95 and p99 latency from a list of request times.',
        'Define an alert rule for error rate and latency and explain what each number means.',
      ],
      keyTerms: ['observability', 'structured log', 'trace', 'span', 'trace id', 'error rate', 'alert', 'p99 latency'],
      links: [
        { label: 'OpenTelemetry: Observability primer', url: 'https://opentelemetry.io/docs/concepts/observability-primer/', kind: 'docs' },
        { label: 'OpenTelemetry Python: Getting started', url: 'https://opentelemetry.io/docs/languages/python/getting-started/', kind: 'docs' },
        { label: 'Python logging HOWTO', url: 'https://docs.python.org/3/howto/logging.html', kind: 'docs' },
        { label: 'Fly.io: Logs', url: 'https://fly.io/docs/monitoring/logging-overview/', kind: 'docs' },
      ],
      body: `
## What this lesson covers

Observability is the ability to tell what a running system does from the outside, using the data it emits. You add three kinds of data to aiworkshop: structured logs, traces and a few numbers for a dashboard. You then write a small alert check. At the end you can answer, for any request, what the user asked, which model answered, how long each part took and whether anything failed.

## Why it matters

A deployed AI service fails in quiet ways. The model answers slowly for one in twenty users. A retrieval step returns nothing and the model guesses. A tool call loops. None of these shows up as a crash. Without logs and traces you learn about them from an angry message, days later. With them you see the slow span and the empty retrieval the same minute. The next lesson, [Cost control](/courses/build-ai-ecosystem/ship-it/cost-control), reads the token counts you log here to compute the bill.

:::video
id: 3c-iBn73dDE
why: Watch the part on docker logs and container output, about 10 minutes, in the first hour. It shows where the lines your Python program prints end up, which is where this lesson starts.
:::

## The idea with an example

> **Analogy.** A car has a dashboard: a speedometer, a fuel gauge and a few warning lights. You do not open the engine to know how fast you drive. The dashboard shows it. Logs are the trip diary: every stop, every refuel, written down. A trace is the route of one journey, with the time spent on each road. An alert is the warning light: it only turns on when a number crosses a line.

Here is the running example. A user calls /ask on the deployed service with the question "What is the refund period?". The /ask endpoint does 4 things: it embeds the question, it searches the vector store, it builds a prompt from the 5 best chunks, and it calls the Claude API. The whole request takes 1,620 milliseconds (ms). Which step took the time? Today you cannot tell. After this lesson the service prints these lines for that one request:

:::code
lang: text
{"time": "2026-10-25T09:14:02", "level": "INFO", "msg": "span", "trace_id": "7f3a9c21d4e8b056", "span": "embed", "ms": 88.4}
{"time": "2026-10-25T09:14:02", "level": "INFO", "msg": "span", "trace_id": "7f3a9c21d4e8b056", "span": "search", "ms": 41.2, "hits": 5}
{"time": "2026-10-25T09:14:02", "level": "INFO", "msg": "span", "trace_id": "7f3a9c21d4e8b056", "span": "build_prompt", "ms": 2.1, "prompt_tokens": 1180}
{"time": "2026-10-25T09:14:04", "level": "INFO", "msg": "span", "trace_id": "7f3a9c21d4e8b056", "span": "model", "ms": 1470.8, "model": "claude-sonnet-5-5", "input_tokens": 1203, "output_tokens": 96}
{"time": "2026-10-25T09:14:04", "level": "INFO", "msg": "request", "trace_id": "7f3a9c21d4e8b056", "path": "/ask", "status": 200, "ms": 1620.3}
:::

Each line is a structured log: a JSON object with named fields instead of a free sentence. Every line carries the same trace_id, a random identifier for one request. The 4 span lines are the parts of the request, each with its duration. The last line is the whole request. Now you can see that the model call took 1,471 of the 1,620 ms, 91 percent. Retrieval took 130 ms. Nothing else matters for speed.

The timeline draws those numbers.

:::timeline
title: One /ask request traced through its spans
unit: ms
lane Edge
lane FastAPI
lane Vector store
lane Claude API
Edge -> FastAPI: POST /ask @0
FastAPI: embed question @5-93
FastAPI -> Vector store: search top 5 @93
Vector store: similarity search @93-134
Vector store -> FastAPI: 5 chunks @134
FastAPI: build prompt @134-136
FastAPI -> Claude API: 1203 input tokens @136
Claude API: generate 96 tokens @136-1607
Claude API -> FastAPI: reply @1607
FastAPI -> Edge: 200 OK @1620
:::

The step player shows how the trace id travels with the request and ties the lines together.

:::scenario
title: How one trace id ties five log lines together
state: trace_id=none, lines=0
step: The request enters the FastAPI middleware. The middleware makes a random 16-character trace id and stores it in a context variable.
state: trace_id=7f3a9c21d4e8b056
step: The embed span starts and ends. Its log line reads the trace id from the context variable and includes it.
state: lines=1
step: The search span, the build_prompt span and the model span each do the same. Each line carries the same trace id.
state: lines=4
step: The middleware logs the whole request with its status and total time, then clears the context variable.
state: lines=5
step: Later you search the logs for trace_id 7f3a9c21d4e8b056 and get exactly these 5 lines, in order.
:::

## How it works

Observability rests on three kinds of data. The table defines them with the aiworkshop example.

| Kind | What it is | Example in aiworkshop | Question it answers |
| --- | --- | --- | --- |
| Log | One event, written as a JSON line | The model span line with 1,471 ms and 96 output tokens | What happened in this request? |
| Trace | All the spans of one request, joined by a trace id | The 5 lines with trace_id 7f3a9c21d4e8b056 | Where did the time go? |
| Metric | One number over many requests | p99 latency of /ask over the last 5 minutes | Is the service healthy right now? |

A span is one timed piece of work with a name and a start and end time. A trace is the set of spans that belong to one request. The trace id is the string that joins them. These are the words the OpenTelemetry standard uses, and the code below uses the same words so you can switch to the OpenTelemetry library later without relearning.

The general procedure is:

1. Replace print with the logging module and a JSON formatter, so every line has the same fields.
2. Make a trace id for each request in a middleware and store it in a context variable, so every log line inside that request can read it.
3. Wrap each step of the request in a span that logs its duration.
4. Log the prompt, the model, the token counts and the status, because these are the fields you will search.
5. Compute latency percentiles and error rate from the request lines.
6. Alert when a percentile or the error rate crosses a threshold you chose in advance.

Here is the logging code. Put it in a new file app/observe.py:

:::code
lang: python
file: app/observe.py
import contextvars
import json
import logging
import time
from contextlib import contextmanager

trace_id_var = contextvars.ContextVar("trace_id", default="-")
log = logging.getLogger("aiworkshop")


class JsonFormatter(logging.Formatter):
    def format(self, record):
        data = {
            "time": self.formatTime(record, "%Y-%m-%dT%H:%M:%S"),
            "level": record.levelname,
            "msg": record.getMessage(),
            "trace_id": trace_id_var.get(),
        }
        data.update(getattr(record, "fields", {}))
        return json.dumps(data)


def setup_logging(level="INFO"):
    handler = logging.StreamHandler()
    handler.setFormatter(JsonFormatter())
    root = logging.getLogger()
    root.handlers = [handler]
    root.setLevel(level)


@contextmanager
def span(name, **fields):
    start = time.perf_counter()
    try:
        yield fields
    finally:
        ms = round((time.perf_counter() - start) * 1000, 1)
        log.info("span", extra={"fields": {"span": name, "ms": ms, **fields}})
:::

A context variable is a value that belongs to one request even when many requests run at the same time. The formatter reads it, so every line gets the right trace id without passing it to every function. The span function is a context manager: the code inside the with block runs, and the finally part logs the duration however the block ends. The yield returns the fields dictionary so the block can add results, such as the number of hits.

Now the middleware in app/main.py. A middleware is a function that runs before and after every request:

:::code
lang: python
file: app/main.py (add near the top)
import time
import uuid
from fastapi import FastAPI, Request
from app.observe import log, setup_logging, span, trace_id_var

setup_logging()
app = FastAPI()


@app.middleware("http")
async def trace_requests(request: Request, call_next):
    tid = request.headers.get("x-trace-id") or uuid.uuid4().hex[:16]
    token = trace_id_var.set(tid)
    start = time.perf_counter()
    status = 500
    try:
        response = await call_next(request)
        status = response.status_code
        response.headers["x-trace-id"] = tid
        return response
    finally:
        ms = round((time.perf_counter() - start) * 1000, 1)
        log.info("request", extra={"fields": {"path": request.url.path, "status": status, "ms": ms}})
        trace_id_var.reset(token)
:::

The middleware also returns the trace id to the caller in a response header. When a user reports a bad answer, ask for that header value and you find the exact 5 lines. If the caller sends its own x-trace-id, the service reuses it, so a trace can continue across two services.

Finally, wrap the steps of /ask in spans:

:::code
lang: python
file: app/main.py (inside the /ask handler)
with span("embed"):
    vector = embed(question)
with span("search") as f:
    chunks = store.search(vector, k=5)
    f["hits"] = len(chunks)
with span("build_prompt") as f:
    prompt = build_prompt(question, chunks)
    f["prompt_tokens"] = count_tokens(prompt)
with span("model", model=MODEL) as f:
    reply = client.messages.create(model=MODEL, max_tokens=400,
                                   messages=[{"role": "user", "content": prompt}])
    f["input_tokens"] = reply.usage.input_tokens
    f["output_tokens"] = reply.usage.output_tokens
:::

Log the prompt text too, at DEBUG level, so you can turn it on when you investigate and off in normal operation. Prompts can contain personal data, so keep the retention short and tell users in your privacy note.

Now the numbers. One request time tells you little. Latency percentiles summarise many. Sort the request times from fastest to slowest. The p50, or median, is the time in the middle: half of requests are faster. The p95 is the time that 95 percent of requests beat. The p99 is the time that 99 percent beat; only 1 in 100 is slower. The p99 is also called the tail latency. Averages hide the tail, percentiles show it.

Here is a 20-request sample from /ask, sorted, in ms: 1,180, 1,210, 1,240, 1,290, 1,310, 1,350, 1,390, 1,420, 1,470, 1,520, 1,580, 1,620, 1,690, 1,750, 1,830, 1,940, 2,110, 2,400, 3,150, 6,800. The p50 is between the 10th and 11th value, about 1,550. The p95 is the 19th value, 3,150. The p99 is the 20th value, 6,800. The average is 1,862, which describes no real request.

:::bars
title: Latency of /ask from 20 requests
unit: ms
p50: 1550
average: 1862
p95: 3150
p99: 6800
:::

The formula for the position of percentile p in a sorted list of n values is: index equals the ceiling of p divided by 100 times n, minus 1. In words: multiply the fraction by the count, round up, and subtract 1 because Python counts from 0. This script computes percentiles and the error rate from a log file:

:::code
lang: python
file: eval/latency.py
import json
import math
import sys


def percentile(values, p):
    values = sorted(values)
    index = math.ceil(p / 100 * len(values)) - 1
    return values[max(index, 0)]


times, errors, total = [], 0, 0
for line in open(sys.argv[1]):
    row = json.loads(line)
    if row.get("msg") != "request":
        continue
    total += 1
    times.append(row["ms"])
    if row["status"] >= 500:
        errors += 1

print("requests", total)
print("p50", percentile(times, 50), "ms")
print("p95", percentile(times, 95), "ms")
print("p99", percentile(times, 99), "ms")
print("error rate", round(errors / total, 4))
:::

Run it on the logs you saved from the host:

:::code
lang: bash
fly logs --no-tail > logs.txt
python eval/latency.py logs.txt
:::

:::code
lang: text
requests 20
p50 1580 ms
p95 3150 ms
p99 6800 ms
error rate 0.05
:::

The error rate is the share of requests that fail with a status of 500 or higher. Here 1 of 20 failed, so the error rate is 0.05 or 5 percent. For an AI service a good target is below 1 percent.

An alert is a rule plus a destination. The rule compares a metric with a threshold over a window. The destination is where the message goes: email, a chat channel or a phone. Write the rules down before the incident, not during. Here are the two rules for aiworkshop:

:::code
lang: yaml
file: eval/alerts.yaml
alerts:
  - name: high-error-rate
    metric: error_rate
    window: 5m
    threshold: 0.02
    notify: email
  - name: slow-tail
    metric: p99_ms
    window: 15m
    threshold: 5000
    notify: email
:::

Read the first rule as: if more than 2 percent of requests in any 5-minute window fail, send an email. The second says: if the slowest 1 percent of requests in 15 minutes take over 5 seconds, send an email. A small script that runs every minute, reads the last window of logs, and compares with these thresholds is a complete alerting system for a hobby service. Hosted tools such as Grafana Cloud, Datadog or Fly's built-in metrics do the same job with a dashboard, and all of them accept OpenTelemetry data. When you outgrow the script, install the opentelemetry-sdk package and replace the span function with its tracer. The names stay the same.

## Try it

:::exercise
title: Compute the percentiles by hand, then by code
task: Here are 10 request times in ms from /chat: 920, 1,400, 880, 2,300, 1,050, 990, 7,200, 1,120, 1,010, 1,300. Sort them. Compute the p50, the p90 and the average by hand with the ceiling formula. Then check your answers with the percentile function from the lesson. Finally, say which of the three numbers a user who complains about slowness is most likely to have seen.
hint: Sorted: 880, 920, 990, 1,010, 1,050, 1,120, 1,300, 1,400, 2,300, 7,200. For p50 the position is ceiling of 0.5 times 10 minus 1, which is 4. Python index 4 is the 5th value.
lang: python
solution:
import math

times = [920, 1400, 880, 2300, 1050, 990, 7200, 1120, 1010, 1300]


def percentile(values, p):
    values = sorted(values)
    index = math.ceil(p / 100 * len(values)) - 1
    return values[max(index, 0)]


print("p50", percentile(times, 50))      # 1050
print("p90", percentile(times, 90))      # 2300
print("average", sum(times) / len(times))  # 1817.0

# The complaining user most likely saw the 7,200 ms request, the p100.
# The p90 of 2,300 says 1 in 10 users waits over 2.3 seconds.
# The average of 1,817 matches no real request in the list.
:::

## Common mistakes

- Mistake: logging with print, so lines have no level, no time and no trace id. Fix: use the logging module with the JSON formatter and search by field.
- Mistake: reporting the average latency. Fix: report p50, p95 and p99, because the average hides the slow tail that users notice.
- Mistake: logging full prompts and replies at INFO level in production. Fix: log token counts and ids at INFO, and the text at DEBUG with a short retention.
- Mistake: an alert on every single 500 error. Fix: alert on a rate over a window, such as 2 percent over 5 minutes, so one flaky request does not wake you.
- Mistake: measuring only the whole request. Fix: wrap each step in a span, so you know whether retrieval or the model is slow.

## Check your understanding

:::quiz
title: Check: logs, traces and alerts
q: A user reports a wrong answer and gives you the x-trace-id from the response header. What do you do first?
- Restart the container
* Search the logs for that trace id to see the spans, the hits and the model call for that one request
- Compute the p99 for the day
- Ask the user to try again later
why: The trace id joins every log line of that request. It shows exactly what the service did, including how many chunks it found.
q: In the traced /ask request, retrieval took 130 ms and the model took 1,471 ms. Which change speeds up the request most?
- Switch the vector store to a faster library
- Embed the question in parallel with the search
* Shorten the prompt or stream the model answer, because the model call is 91 percent of the time
- Remove the trace id header
why: Optimise the biggest span first. Retrieval is under 10 percent of the total.
q: 200 requests ran in the last 5 minutes and 6 returned status 500. The alert threshold is 0.02. Does the high-error-rate alert fire?
- No, 6 errors is below the threshold
* Yes, the error rate is 6 divided by 200, which is 0.03, above 0.02
- Only if the p99 is also above 5,000 ms
- Not enough information
why: 6 / 200 = 0.03, or 3 percent, above the 2 percent threshold. Each rule fires on its own.
q: Why does the lesson report p99 rather than the average?
- The average is harder to compute
* The average hides the slow tail; p99 shows the time that 1 in 100 users still waits longer than
- p99 is always smaller than the average
- Logging tools cannot compute an average
why: A few very slow requests barely move the average but define the user's worst experience. Percentiles show them.
q: Why does the code store the trace id in a context variable instead of a global variable?
- Global variables are slower in Python
* Many requests run at the same time, and a context variable keeps one value per request
- Context variables are encrypted
- FastAPI does not allow global variables
why: A global would be overwritten by the next request. A context variable follows one request through its awaits.
:::

## Go further

The OpenTelemetry primer in the links defines logs, traces and metrics the same way this lesson does, and the Python getting-started guide replaces the hand-written span with the real tracer in about 20 lines. The Python logging HOWTO explains formatters and levels. You can now see every token the service uses, and the next lesson, [Cost control](/courses/build-ai-ecosystem/ship-it/cost-control), turns those token counts into a monthly bill and cuts it with a cache, model routing and rate limits.
`,
    },
    {
      slug: 'cost-control',
      title: 'Cost control: caching, routing, limits and budgets',
      summary: 'Compute the monthly bill of aiworkshop from token counts, then cut it with a response cache, model routing, a rate limit and a daily budget.',
      minutes: 24,
      objectives: [
        'Compute the cost of one request and of a month of requests from token counts and prices.',
        'Add a response cache with Redis and measure the cache hit rate.',
        'Route easy questions to a cheaper model and hard ones to a stronger model.',
        'Write a rate limit and a daily budget cap that stop runaway spending.',
      ],
      keyTerms: ['response cache', 'cache hit rate', 'model routing', 'rate limit', 'token bucket', 'budget cap', 'cost per request'],
      links: [
        { label: 'Claude API pricing', url: 'https://docs.anthropic.com/en/docs/about-claude/pricing', kind: 'docs' },
        { label: 'Redis: SET with expiry', url: 'https://redis.io/docs/latest/commands/set/', kind: 'docs' },
        { label: 'Redis: Python client (redis-py)', url: 'https://redis.io/docs/latest/develop/clients/redis-py/', kind: 'docs' },
        { label: 'Fly.io: Pricing', url: 'https://fly.io/docs/about/pricing/', kind: 'docs' },
      ],
      body: `
## What this lesson covers

You learn to compute what aiworkshop costs per request and per month, and then to make it cheaper without making it worse. You add four controls: a response cache, model routing, a rate limit and a budget cap. Every control comes with the numbers it saves. At the end you can state the monthly bill for 10,000 requests a day and defend each line of it.

## Why it matters

An AI service is unusual because every request costs real money. A web page costs a fraction of a cent to serve. A model call with 1,200 input tokens and 300 output tokens costs about 0.8 cents, 100 times more. At 10,000 requests a day that is about USD 2,400 a month, before hosting. A bug that loops, or a stranger who scripts your public URL, can spend that in a night. The controls in this lesson are what make the capstone, [the full ecosystem](/courses/build-ai-ecosystem/ship-it/capstone), safe to leave running.

:::video
id: G1rOthIU-uo
why: Watch all 2 minutes. Redis is the fast key-value store you use for the cache and the budget counter in this lesson.
:::

## The idea with an example

> **Analogy.** Your electricity bill has a meter, a tariff and a fuse. The meter counts what you use. The tariff says what each unit costs, and the night tariff is cheaper. The fuse cuts the power when something draws too much. Token counts are the meter. Prices per million tokens are the tariff, and a cheaper model is the night tariff. A rate limit and a budget cap are the fuse.

Here is the running example. The logs from the last lesson show that a typical aiworkshop request uses 1,200 input tokens and 300 output tokens. The service answers 10,000 requests a day. Model prices are quoted per million tokens, with one price for input and a higher price for output. The approximate 2026 prices for the two Claude models you use are in the table. Check the pricing page in the links before you rely on them.

| Model | Input, USD per million tokens | Output, USD per million tokens | Good for |
| --- | --- | --- | --- |
| claude-sonnet-5-5 | 3.00 | 15.00 | Reasoning, long documents, tool use |
| claude-haiku-5-5 | 1.00 | 5.00 | Short answers, classification, routing |

Compute the cost of one request on the Sonnet model. Input: 1,200 tokens divided by 1,000,000 times USD 3.00 equals USD 0.0036. Output: 300 divided by 1,000,000 times USD 15.00 equals USD 0.0045. Total: USD 0.0081, about 0.8 cents. That is the cost per request.

Now the month. 10,000 requests times USD 0.0081 equals USD 81 a day. Times 30 days equals USD 2,430 a month. Add hosting: a 1 GB Fly machine at about USD 8 and a small Redis at about USD 10. The total is about USD 2,448 a month. The model is 99 percent of the bill. Every saving must come from the model line.

Here is the same arithmetic as code, so you can change the inputs:

:::code
lang: python
file: eval/cost.py
PRICES = {  # USD per million tokens, approximate 2026 values
    "claude-sonnet-5-5": {"input": 3.00, "output": 15.00},
    "claude-haiku-5-5": {"input": 1.00, "output": 5.00},
}


def request_cost(model, input_tokens, output_tokens):
    p = PRICES[model]
    return input_tokens / 1e6 * p["input"] + output_tokens / 1e6 * p["output"]


def monthly_cost(model, per_day, input_tokens, output_tokens, hit_rate=0.0, days=30):
    paid = per_day * (1 - hit_rate)
    return paid * request_cost(model, input_tokens, output_tokens) * days


one = request_cost("claude-sonnet-5-5", 1200, 300)
print("one request:", round(one, 4), "USD")
print("month, no cache:", round(monthly_cost("claude-sonnet-5-5", 10000, 1200, 300)), "USD")
print("month, 30% cache hits:", round(monthly_cost("claude-sonnet-5-5", 10000, 1200, 300, 0.3)), "USD")
print("month, all on haiku:", round(monthly_cost("claude-haiku-5-5", 10000, 1200, 300)), "USD")
:::

:::code
lang: text
one request: 0.0081 USD
month, no cache: 2430 USD
month, 30% cache hits: 1701 USD
month, all on haiku: 810 USD
:::

Now apply the four controls, one at a time, to the same 10,000 requests a day. The cache answers 30 percent of requests from memory, so only 7,000 are paid: USD 1,701. Routing sends 70 percent of the remaining requests to Haiku, which costs USD 0.0027 per request, and 30 percent to Sonnet. Per paid request that is 0.7 times 0.0027 plus 0.3 times 0.0081, which is USD 0.0043. 7,000 times 0.0043 times 30 equals USD 907. The rate limit and budget do not lower the normal bill, but they put a ceiling on the worst day.

:::bars
title: Monthly model cost for 10,000 requests a day
unit: USD per month
Sonnet, no controls: 2430
Sonnet with 30 percent cache: 1701
Cache plus routing 70 percent Haiku: 907
Everything on Haiku: 810
:::

The step player walks one request through all four controls.

:::scenario
title: One request through the cost controls
state: client=203.0.113.9, tokens left=9, spent today=41.20, cache=miss
step: The request arrives. The rate limiter looks up the client address and finds 9 tokens in its bucket. It takes 1 and lets the request through.
state: tokens left=8
step: The budget check reads today's spend from Redis, USD 41.20, and compares it with the cap of USD 100. The request continues.
step: The cache computes a key from the model name and the exact prompt and asks Redis. Nothing is stored, a miss.
state: cache=miss
step: The router reads the question. It is 9 words with no document attached, so it picks claude-haiku-5-5.
state: model=haiku
step: The model answers with 1,200 input and 300 output tokens. The service adds USD 0.0027 to today's spend and stores the answer in Redis for 24 hours.
state: spent today=41.2027, cache=stored
step: The same question arrives from another user 10 minutes later. The cache returns the stored answer in 2 ms and nothing is spent.
state: cache=hit
:::

## How it works

Cost control is a pipeline of checks in front of the model call. Each check is cheap, a Redis call of about 1 ms, and each one either answers, routes or rejects before any tokens are bought.

:::flow
title: The cost pipeline in front of the model
Request -> Rate limiter: 1 token from the bucket
Rate limiter -> Budget check: spend below the cap?
Budget check -> Cache: key from model and prompt
Cache -> Router: on a miss, pick a model
Router -> Model: haiku or sonnet
Model -> Cache: store the answer 24 h
:::

The general procedure is:

1. Measure first. Read input and output tokens from the logs and compute the cost per request and per month.
2. Cache exact repeats. Store each answer under a key made from the model and the prompt, with an expiry.
3. Route by difficulty. Send short, factual questions to the cheap model and long or reasoning questions to the strong one.
4. Limit each client. Give every client a bucket of tokens that refills slowly, and reject with status 429 when it is empty.
5. Cap the day. Count spend in Redis and refuse new model calls when the daily cap is reached.
6. Re-measure. Compute the cache hit rate and the model mix each week and adjust.

A response cache stores the answer to a prompt so the next identical prompt gets the stored answer. The cache hit rate is the share of requests the cache answers. In a support bot, the same 50 questions make up a large share of traffic, and hit rates of 20 to 40 percent are normal. In a free-form chat the hit rate is near zero, and the cache is not worth its memory. The key must include the model name, because two models give different answers, and the exact prompt text. Here is the cache with Redis:

:::code
lang: python
file: app/cache.py
import hashlib
import os

import redis

r = redis.Redis.from_url(os.environ.get("REDIS_URL", "redis://localhost:6379/0"))
TTL_SECONDS = 24 * 60 * 60


def cache_key(model, prompt):
    digest = hashlib.sha256((model + "\\n" + prompt).encode()).hexdigest()
    return "answer:" + digest


def cached_answer(model, prompt, call_model):
    key = cache_key(model, prompt)
    hit = r.get(key)
    if hit is not None:
        r.incr("stats:hits")
        return hit.decode(), True
    r.incr("stats:misses")
    answer = call_model(model, prompt)
    r.set(key, answer, ex=TTL_SECONDS)
    return answer, False
:::

The sha256 function turns a long prompt into a fixed 64-character key, so Redis keys stay small. The ex argument sets a time to live of 24 hours, after which Redis deletes the entry. The two counters give you the hit rate: hits divided by hits plus misses. Start Redis locally with docker run -p 6379:6379 redis:7 and point REDIS_URL at it. On Fly.io, the Upstash Redis add-on gives you a REDIS_URL secret.

Model routing picks the model per request. A simple rule works surprisingly well. Count the words in the question, check for a document or for reasoning words, and decide:

:::code
lang: python
file: app/router.py
REASONING_WORDS = {"why", "compare", "explain", "analyse", "analyze", "plan", "prove", "debug"}


def pick_model(question, has_document=False):
    words = question.lower().split()
    if has_document or len(words) > 60:
        return "claude-sonnet-5-5"
    if REASONING_WORDS & set(words):
        return "claude-sonnet-5-5"
    return "claude-haiku-5-5"


print(pick_model("What is the refund period?"))
print(pick_model("Explain why the refund period differs by country."))
:::

:::code
lang: text
claude-haiku-5-5
claude-sonnet-5-5
:::

Log the chosen model in the model span, then check in the eval set from the retrieval module that answer quality holds. If Haiku's answers score lower on the eval set, move the questions it fails to Sonnet by adding words to the set or lowering the word limit. Routing is a trade: about 65 percent cheaper on routed requests in exchange for a small quality check every week.

A rate limit caps how many requests one client may make in a period. The token bucket is the standard way to write one. Each client has a bucket that holds up to 10 tokens and gains 1 token every 6 seconds, so 10 per minute. A request takes 1 token. An empty bucket means the request is rejected with status 429, Too Many Requests. The bucket lets a client burst 10 requests at once but holds the average at 10 per minute. Here it is as a FastAPI dependency:

:::code
lang: python
file: app/limits.py
import time

from fastapi import HTTPException, Request

CAPACITY = 10
REFILL_PER_SECOND = 10 / 60
buckets = {}


def rate_limit(request: Request):
    client = request.client.host
    now = time.time()
    tokens, last = buckets.get(client, (CAPACITY, now))
    tokens = min(CAPACITY, tokens + (now - last) * REFILL_PER_SECOND)
    if tokens < 1:
        raise HTTPException(status_code=429, detail="Too many requests. Try again in a minute.")
    buckets[client] = (tokens - 1, now)
:::

Add it to the endpoint with dependencies=[Depends(rate_limit)]. The dictionary lives in one process, which is fine for one container. With two or more containers, move the bucket into Redis so all containers share it.

A budget cap is the fuse. It counts the day's spend and refuses model calls above a limit. Set the cap from the normal bill: USD 81 a day in the example, so a cap of USD 100 lets normal traffic through and stops a runaway at 23 percent over. The code adds each request's cost to a Redis counter that expires at midnight:

:::code
lang: python
file: app/budget.py
import datetime
import os

from fastapi import HTTPException

from app.cache import r

DAILY_CAP_USD = float(os.environ.get("DAILY_CAP_USD", "100"))


def today_key():
    return "spend:" + datetime.date.today().isoformat()


def check_budget():
    spent = float(r.get(today_key()) or 0)
    if spent >= DAILY_CAP_USD:
        raise HTTPException(status_code=503, detail="Daily budget reached. Service resumes tomorrow.")


def record_spend(cost_usd):
    key = today_key()
    r.incrbyfloat(key, cost_usd)
    r.expire(key, 2 * 24 * 60 * 60)
:::

Call check_budget before the model call and record_spend after it, with the cost from request_cost in eval/cost.py. Status 503 tells clients that the service is unavailable for now, not that they did something wrong. Also set a spend limit in the provider's console as a second fuse; the Claude console has one under billing.

The table sums up the four controls for the running example.

| Control | What it does | Saving at 10,000 requests a day | Cost of the control |
| --- | --- | --- | --- |
| Response cache, 30 percent hits | Answers repeats from Redis in 2 ms | USD 729 a month | Redis, about USD 10 a month |
| Model routing, 70 percent to Haiku | Cheaper model for easy questions | USD 794 a month on top of the cache | A weekly eval run |
| Rate limit, 10 per minute per client | Stops one client from flooding | Caps the worst client at 14,400 a day | None |
| Budget cap, USD 100 a day | Stops all model calls above the cap | Caps the worst day at USD 100 | None |

## Try it

:::exercise
title: Price a new traffic mix
task: Your service grows to 25,000 requests a day. The average request is now 2,000 input tokens and 400 output tokens because users attach longer documents. The cache hits 20 percent of requests. Of the paid requests, 50 percent go to Haiku and 50 percent to Sonnet. Use the prices in the lesson. Compute the model cost per month in USD, rounded to the nearest dollar, and say whether a daily cap of USD 100 would block normal traffic.
hint: Compute the cost of one request on each model first. Then take the weighted average over the 50-50 mix. Then multiply by paid requests per day, 25,000 times 0.8, and by 30 days.
lang: python
solution:
def request_cost(inp, out, price_in, price_out):
    return inp / 1e6 * price_in + out / 1e6 * price_out

sonnet = request_cost(2000, 400, 3.00, 15.00)   # 0.006 + 0.006 = 0.012
haiku = request_cost(2000, 400, 1.00, 5.00)     # 0.002 + 0.002 = 0.004
mix = 0.5 * sonnet + 0.5 * haiku                # 0.008

paid_per_day = 25000 * (1 - 0.20)               # 20000
per_day = paid_per_day * mix                    # 160 USD
per_month = per_day * 30                        # 4800 USD

print("per request, mixed:", mix)
print("per day:", per_day)
print("per month:", round(per_month))
# A cap of 100 USD a day blocks normal traffic at 160 USD a day.
# Raise the cap to about 200 USD, 25 percent above normal.
:::

## Common mistakes

- Mistake: estimating cost from the number of requests alone. Fix: multiply input and output tokens by their separate prices; output tokens cost 5 times more.
- Mistake: a cache key made from the prompt only. Fix: include the model name, and any system prompt, so a model change does not serve stale answers.
- Mistake: routing everything to the cheap model to save money. Fix: route by difficulty and check the eval set weekly; a wrong answer costs more than the tokens.
- Mistake: a rate limit per container when you run 3 containers. Fix: keep the buckets in Redis so every container sees the same count.
- Mistake: a budget cap equal to the normal daily spend. Fix: set the cap 20 to 30 percent above a normal day, so busy days pass and runaways stop.

## Check your understanding

:::quiz
title: Check: cost control
q: A request uses 2,000 input tokens and 500 output tokens on a model priced at USD 3.00 and USD 15.00 per million tokens. What does it cost?
- USD 0.0075
* USD 0.0135
- USD 0.045
- USD 0.135
why: Input: 2,000 / 1,000,000 times 3.00 = 0.006. Output: 500 / 1,000,000 times 15.00 = 0.0075. Total 0.0135.
q: The service answers 10,000 requests a day at USD 0.0081 each. A cache reaches a 40 percent hit rate. What is the monthly model cost over 30 days?
- USD 2,430
- USD 972
* USD 1,458
- USD 810
why: Paid requests are 6,000 a day. 6,000 times 0.0081 is 48.60 a day. Times 30 is 1,458.
q: Redis shows stats:hits = 3,200 and stats:misses = 12,800. What is the cache hit rate?
- 25 percent of misses
* 20 percent
- 40 percent
- 80 percent
why: Hit rate is hits over hits plus misses: 3,200 / 16,000 = 0.20.
q: A token bucket holds 10 tokens and refills at 10 per minute. A client sends 15 requests in 2 seconds. What happens?
- All 15 succeed
- All 15 are rejected
* The first 10 succeed and the next 5 get status 429
- The client is blocked for a day
why: The bucket starts full at 10. Each request takes 1. Refill in 2 seconds is a third of a token, so requests 11 to 15 find an empty bucket.
q: Why does the budget cap return status 503 instead of 429?
* 503 means the service is unavailable for now, which is true for every client; 429 blames one client for too many requests
- 503 is cheaper to send
- 429 is reserved for authentication
- Browsers cannot display 429
why: Status codes carry meaning. The cap is a service-wide condition, not a misbehaving client.
:::

## Go further

The Claude pricing page in the links has the current prices and the prompt caching discount, which lowers input cost for a repeated system prompt. The Redis SET and redis-py pages cover expiry and counters. The Fly.io pricing page lets you price the hosting line. You now have a service that is deployed, observed and under budget. The final lesson, [Capstone: the full ecosystem](/courses/build-ai-ecosystem/ship-it/capstone), draws the whole system you built, gives you a launch checklist and a 5-minute demo, and points to Level 2.
`,
    },
    {
      slug: 'capstone',
      title: 'Capstone: the full ecosystem',
      summary: 'See the complete aiworkshop system in one picture, verify it with a launch checklist, demo it in 5 minutes, and choose what to learn next.',
      minutes: 25,
      objectives: [
        'Draw the complete aiworkshop architecture and trace one request through every part.',
        'Run a launch checklist that verifies each part of the system with one command.',
        'Demo the system in 5 minutes with a script that shows chat, retrieval, an agent, the cache and the logs.',
        'Choose the next track on this site based on which part of the system you want to understand deeper.',
      ],
      keyTerms: ['smoke test', 'launch checklist', 'demo script', 'runbook', 'observability', 'response cache'],
      links: [
        { label: 'Docker docs: Get started', url: 'https://docs.docker.com/get-started/', kind: 'docs' },
        { label: 'Fly.io: Going to production', url: 'https://fly.io/docs/apps/going-to-production/', kind: 'docs' },
        { label: 'OpenTelemetry: Observability primer', url: 'https://opentelemetry.io/docs/concepts/observability-primer/', kind: 'docs' },
        { label: 'Claude API pricing', url: 'https://docs.anthropic.com/en/docs/about-claude/pricing', kind: 'docs' },
      ],
      body: `
## What this lesson covers

This is the last lesson of the project track. You built aiworkshop over six modules: a chat service, retrieval over your documents, an agent with tools, a fine-tuned model, and a deployed container with logs and cost controls. This lesson puts every part in one picture, walks one request through all of them, and gives you a checklist and a demo script. It ends with a map from each part of the system to the Level 2 track that explains it deeper.

## Why it matters

A system you can draw is a system you understand. A system you can verify with a checklist is a system you can leave running. A system you can demo in 5 minutes is a system you can show to a friend, a teacher or an employer. The checklist and the demo are also what you will reuse on every future project. The last table tells you where to go next, because after this lesson you are no longer a beginner.

:::video
id: PziYflu8cB8
why: Watch all 2 minutes. Kubernetes is what people use when one container is not enough. You do not need it yet, but you should recognise the word.
:::

## The idea with an example

> **Analogy.** A restaurant has a front door, a host who seats people, a kitchen, suppliers and a storeroom. A guest sees only the door and the plate. The owner sees the whole floor plan and knows what happens when a supplier is late. You are now the owner of aiworkshop. This lesson is the floor plan.

Here is the complete system you built. Read it layer by layer, from the users at the top to the data at the bottom.

:::arch
title: The complete aiworkshop ecosystem
layer: Users | Browser, Terminal
layer: Edge | HTTPS, Rate limiter
layer: Service | FastAPI app, Agent runner, Cache
layer: Models | Claude API, Local model, Fine-tuned model
layer: Data | Vector store, Documents, Logs and traces
flow: Browser -> HTTPS -> Rate limiter -> FastAPI app -> Cache -> Vector store -> FastAPI app -> Claude API -> FastAPI app -> Logs and traces -> HTTPS -> Browser
note: Browser = the single HTML page from the chat module, or any client with curl
note: HTTPS = the host edge that ends TLS and forwards to port 8000
note: Rate limiter = the token bucket, 10 requests per minute per client
note: FastAPI app = the container from the Dockerfile: /chat, /ask, /agent, /health
note: Agent runner = the plan, act, observe loop with tools and guardrails
note: Cache = Redis: exact-match answers for 24 hours, daily spend counter
note: Claude API = claude-sonnet-5-5 for hard questions, claude-haiku-5-5 for easy ones
note: Local model = Ollama on your computer for free tests and offline use
note: Fine-tuned model = the LoRA model from the training module, served with Ollama or vLLM
note: Vector store = Chroma with the embedded chunks of your documents
note: Documents = the PDFs and text files in data/documents
note: Logs and traces = JSON lines with a trace id, read with fly logs or eval/latency.py
:::

Each box came from one module. The Browser and FastAPI app are from the chat module. The Vector store and Documents are from the retrieval module. The Agent runner is from the agents module. The Fine-tuned model is from the training module. HTTPS, Rate limiter, Cache and Logs and traces are from this module. The Claude API and the Local model are from the first module, where you called a model for the first time.

Now follow one real request through every part. A user opens the page and asks: "What is the refund period, and draft a reply email to a customer who missed it?" This is a two-part question: a fact from the documents and a writing task. The step player shows what happens.

:::scenario
title: One request through the whole ecosystem
state: trace_id=none, model=none, hits=0, spent today=41.20, cache=miss, latency=0 ms
step: The browser sends POST /ask over HTTPS. The host edge ends the encryption and forwards plain HTTP to the container on port 8000.
state: latency=12 ms
step: The rate limiter finds 7 tokens in the bucket for this client address and takes 1. The budget check reads USD 41.20 against the cap of USD 100 and passes.
state: latency=14 ms
step: The middleware makes trace id 9b2e41c7a0d35f68. The cache hashes the model name and the prompt and asks Redis. Nothing stored: a miss.
state: trace_id=9b2e41c7a0d35f68, cache=miss, latency=16 ms
step: The router sees the word draft and a two-part question of 18 words. It picks claude-sonnet-5-5.
state: model=claude-sonnet-5-5
step: The service embeds the question in 88 ms and searches the vector store. It finds 5 chunks; the best one is the refund policy section with a 14-day period.
state: hits=5, latency=146 ms
step: The prompt builder joins the 5 chunks and the question into 1,340 input tokens and calls the Claude API. The model answers in 1,610 ms with 210 output tokens, citing chunk refund-policy-3.
state: latency=1756 ms
step: The service records the cost, 0.00402 plus 0.00315 is USD 0.00717, adds it to the day's spend, and stores the answer in Redis for 24 hours.
state: spent today=41.2072, cache=stored
step: Five span lines and one request line, all with the trace id, go to stdout, where fly logs collects them. The reply returns through the edge to the browser with the x-trace-id header.
state: latency=1790 ms
:::

The request touched 11 of the 12 boxes. Only the Agent runner stayed idle, because /ask does not use tools. The /agent endpoint would use it to, for example, read the customer's order from a file tool before drafting the email.

## How it works

Shipping a system is a procedure, and the procedure is a checklist. A launch checklist is a table of every part, how to verify it, and whether it is done. The verify column is the important one: each row has one command or one observation that proves the row. A row you cannot verify is a wish, not a check. The verification of a whole system with a few quick requests is called a smoke test, from the idea of switching a machine on and watching for smoke.

| What | How to verify | Done? |
| --- | --- | --- |
| Image builds and is small | docker build completes; docker images shows under 500 MB | |
| Container runs locally | docker run with -p 8000:8000 and -e key; curl /health returns ok | |
| No secret in the image or Git | git grep sk-ant returns nothing; .env is in .gitignore and .dockerignore | |
| Deployed with a public URL | fly status shows a healthy machine; curl https://aiworkshop.fly.dev/health returns ok | |
| HTTPS works | The browser shows the padlock; http is redirected to https | |
| Secret in the secret store | fly secrets list shows ANTHROPIC_API_KEY; fly.toml contains no key | |
| Chat endpoint answers | POST /chat returns a reply with model and token counts | |
| Retrieval answers with citations | POST /ask returns an answer that cites a chunk id from your documents | |
| Agent runs a tool and stops | POST /agent with a file question shows one tool call in the logs and a final answer | |
| Fine-tuned model serves | ollama run aiworkshop-ft answers in the style of your dataset | |
| Logs are structured with a trace id | fly logs shows JSON lines; each line has trace_id | |
| Latency known | python eval/latency.py logs.txt prints p50, p95, p99 | |
| Alerts defined | eval/alerts.yaml exists with an error rate and a p99 rule | |
| Cache works | The same POST /chat twice: the second returns in under 50 ms and stats:hits grows | |
| Rate limit works | 15 fast requests from one terminal: the last 5 return 429 | |
| Budget cap set | DAILY_CAP_USD is set; the provider console has a spend limit | |
| Rollback tested | fly releases lists at least 2; you deployed an older image once | |
| Eval set passes | python eval/run.py scores at or above the number from the retrieval module | |

Print this table, or copy it into a file called CHECKLIST.md in the repository, and tick each row with the command next to it. The whole pass takes about 20 minutes the first time and 5 minutes after that.

The demo script is the smoke test with a story. It shows the system to a person in 5 minutes, one command per part. Put it in the repository as demo.sh so you can run it from any computer with curl:

:::code
lang: bash
file: demo.sh
#!/usr/bin/env bash
URL=https://aiworkshop.fly.dev
H="Content-Type: application/json"

echo "1. Health, version and HTTPS"
curl -s $URL/health; echo

echo "2. Chat with the model"
curl -s -X POST $URL/chat -H "$H" -d '{"message": "In one sentence, what can you do?"}'; echo

echo "3. Retrieval over my documents, with a citation"
curl -s -X POST $URL/ask -H "$H" -d '{"question": "What is the refund period?"}'; echo

echo "4. An agent that uses a tool"
curl -s -X POST $URL/agent -H "$H" -d '{"task": "List the files in data/documents and count them."}'; echo

echo "5. The cache: same question again, watch the time"
time curl -s -X POST $URL/ask -H "$H" -d '{"question": "What is the refund period?"}' > /dev/null

echo "6. The rate limit: 12 fast requests, the last ones get 429"
for i in 1 2 3 4 5 6 7 8 9 10 11 12; do
  curl -s -o /dev/null -w "%{http_code} " $URL/health
done; echo

echo "7. The logs: one traced request"
fly logs --no-tail | grep request | tail -n 3
:::

Make it executable with chmod +x demo.sh and run it with ./demo.sh. The expected output, shortened:

:::code
lang: text
1. Health, version and HTTPS
{"status":"ok","version":"0.3"}
2. Chat with the model
{"reply":"I answer questions, search your documents, and run small tasks with tools.","model":"claude-haiku-5-5","input_tokens":22,"output_tokens":17}
3. Retrieval over my documents, with a citation
{"answer":"The refund period is 14 days from delivery [refund-policy-3].","sources":["refund-policy-3","refund-policy-4"],"model":"claude-haiku-5-5"}
4. An agent that uses a tool
{"answer":"There are 6 files in data/documents.","steps":2,"tools_used":["list_files"]}
5. The cache: same question again, watch the time
real    0m0.041s
6. The rate limit: 12 fast requests, the last ones get 429
200 200 200 200 200 200 200 200 200 200 429 429
7. The logs: one traced request
{"time":"2026-10-25T10:02:11","level":"INFO","msg":"request","trace_id":"9b2e41c7a0d35f68","path":"/ask","status":200,"ms":1790.4}
:::

While the script runs, say one sentence per step. Step 1: it is deployed, with HTTPS and a health check. Step 2: it talks to a model and reports tokens. Step 3: it answers from my documents and cites them. Step 4: it can use tools and stops after 2 steps. Step 5: the second time costs nothing and takes 41 ms instead of 1,790. Step 6: a flood is stopped at 10 per minute. Step 7: every request is traced, and I can find any one of them by id. That is the whole ecosystem in 7 sentences.

The timeline shows how the 5 minutes divide.

:::timeline
title: The 5-minute demo
unit: s
lane You
lane Service
You: health, chat and ask @0-60
Service: 3 model calls @5-55
You: agent with a tool @60-120
Service: tool call and 2 model calls @65-110
You: cache and rate limit @120-180
Service: Redis hits, 2 rejections @125-150
You: show the logs and the trace id @180-240
You: questions and the architecture picture @240-300
:::

One more document completes the repository: a runbook. A runbook is a short file that says what to do when something goes wrong, written before it goes wrong. For aiworkshop, 5 entries are enough:

:::code
lang: text
file: RUNBOOK.md
Health check failing
  fly status; fly logs | grep -i error. Usually a crash at start. Check the secret exists.
  Fix: fly secrets set ANTHROPIC_API_KEY=...; fly deploy.

Error rate above 2 percent
  python eval/latency.py logs.txt. Look at the status 500 lines and their trace ids.
  Fix: find the first failing span. If it is the model, check the provider status page.

p99 above 5 seconds
  Check the model span. If it is slow, route more to haiku or lower max_tokens.
  If search is slow, the vector store did not load into memory: raise memory to 1 GB.

Daily budget reached (503)
  fly logs | grep 429 to see whether one client flooded. Raise DAILY_CAP_USD only if traffic is real.

Bad deploy
  fly releases; fly deploy --image registry.fly.io/aiworkshop:deployment-<previous>.
:::

With the checklist, the demo script and the runbook in the repository, aiworkshop is a complete, documented system. The table shows the final layout:

:::code
lang: text
aiworkshop/
  app/           main.py, observe.py, cache.py, router.py, limits.py, budget.py
  chat/          chat loop, streaming, structured output
  rag/           loader, chunker, embedder, retriever
  agents/        tools, agent loop, memory, mcp server, guardrails
  data/          documents/ and vectors/ (vectors ignored by Git and Docker)
  eval/          questions, grader, latency.py, cost.py, alerts.yaml
  train/         dataset.jsonl, lora notebook, compare.py
  Dockerfile  .dockerignore  fly.toml  render.yaml
  requirements.txt  .env.example  demo.sh  CHECKLIST.md  RUNBOOK.md
:::

## Try it

:::exercise
title: Run the checklist and record the numbers
task: Run every row of the launch checklist against your deployed aiworkshop and tick the rows that pass. For each row that fails, write one line in RUNBOOK.md on how you fixed it. Then run demo.sh and record four numbers: the image size in MB, the p99 latency of /ask in ms, the time of the cached request in ms, and the cost of one /ask request in USD from the token counts in the logs.
hint: The image size comes from docker images. The p99 comes from eval/latency.py on fly logs output. The cached time is in the output of step 5 of the demo. The cost is input tokens times 3.00 plus output tokens times 15.00, divided by one million, for a Sonnet request.
lang: text
solution:
Example record from one reader's run:

Checklist: 17 of 18 rows pass. The agent row failed because the
list_files tool was not registered in the deployed container. Fix:
the agents/ folder was in .dockerignore by mistake. Removed the line,
redeployed, row passes. Added to RUNBOOK.md under "Agent returns no tool".

Numbers:
  image size            418 MB
  p99 latency of /ask   4,210 ms over 140 requests
  cached request        38 ms
  one /ask request      1,340 input tokens, 210 output tokens on Sonnet
                        = 0.00402 + 0.00315 = USD 0.0072
:::

## Common mistakes

- Mistake: demoing from your laptop with localhost, so the audience cannot tell it is deployed. Fix: use the public URL in demo.sh and show the padlock.
- Mistake: a checklist row like "monitoring works" with no command. Fix: every row names one command and the output that proves it.
- Mistake: running the demo for the first time in front of people. Fix: run demo.sh twice before, so the cache is warm and the cold start has passed.
- Mistake: writing the runbook after the first incident. Fix: write 5 entries now from the failures you already saw in this module.
- Mistake: treating the capstone as the end. Fix: pick one box in the architecture you understand least and start the matching Level 2 track.

## Check your understanding

:::quiz
title: Check: the full ecosystem
q: In the traced request, which boxes of the architecture did the request not touch?
- The Cache and the Vector store
- HTTPS and the Rate limiter
* The Agent runner, the Local model and the Fine-tuned model
- Logs and traces
why: /ask uses retrieval and the Claude API. The agent runner serves /agent, and the local and fine-tuned models serve offline tests and the training module's endpoint.
q: The demo shows the second identical /ask request taking 41 ms instead of 1,790 ms. Which part made the difference?
- The rate limiter
- HTTPS
* The response cache in Redis
- The fine-tuned model
why: The cache returned the stored answer without any embedding, search or model call.
q: One /ask request used 1,340 input tokens and 210 output tokens on Sonnet at USD 3.00 and USD 15.00 per million. What did it cost?
- USD 0.0040
* USD 0.0072
- USD 0.0165
- USD 0.072
why: 1,340 / 1,000,000 times 3.00 = 0.00402. 210 / 1,000,000 times 15.00 = 0.00315. Total 0.00717, about 0.0072.
q: A checklist row says "the service is fast". Why does the lesson reject this row?
- Speed does not matter for AI services
* It has no command and no number; a good row says how to verify, such as p99 under 5,000 ms from eval/latency.py
- Fast is a Level 2 topic
- Checklists may only contain commands that start with fly
why: A row you cannot verify is a wish. Each row needs an action and an observable result.
q: Users report slow answers and the model span is normal, but the search span jumped from 40 ms to 900 ms after a deploy. Which runbook entry fits?
- Health check failing
- Daily budget reached
* p99 above 5 seconds, the vector store did not load into memory
- Bad deploy, roll back the TLS certificate
why: A slow search span after a deploy points to the vector store reading from disk, usually because the container has too little memory.
:::

## Go further

You built the complete ecosystem that the [AI ecosystem map](/courses/ai-foundations/what-ai-is/the-ai-ecosystem-map) lesson promised at the start of Level 1. Every box in the architecture is also a field of study. The table maps each box to the track on this site that goes deeper, so you can choose by curiosity or by what broke most often.

| You want to understand | Box in the architecture | Next track |
| --- | --- | --- |
| Better prompts, RAG, agents and evals for real products | FastAPI app, Agent runner, Vector store | [AI Engineering](/courses/ai-engineering) |
| Caches, queues, databases, scaling past one container | Edge, Cache, Logs and traces | [System Design](/courses/system-design) |
| The mathematics behind embeddings, loss and gradients | Fine-tuned model, Vector store | [ML Math](/courses/ml-math) |
| Serving models fast and cheap on your own GPUs | Local model, Fine-tuned model | [Inference Engineering](/courses/inference-engineering) |
| Reading the papers behind transformers, RLHF and LoRA | Claude API, Fine-tuned model | [AI Research](/courses/ai-research) |

The Fly.io going-to-production page in the links lists what changes when real users arrive. The Docker get-started guide fills the gaps this module skipped. Keep aiworkshop running, keep demo.sh working, and come back to add one box at a time.
`,
    },
  ],
}
