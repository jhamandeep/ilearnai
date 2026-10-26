import type { Module } from '../../types'

export const mod: Module = {
  slug: 'set-up-your-workshop',
  title: 'Set up your workshop',
  description: 'Draw the system you will build, create the aiworkshop repository, add a virtual environment and an API key, and call a model three ways.',
  level: 'beginner',
  lessons: [
    {
      slug: 'the-project-plan',
      title: 'The project plan and architecture',
      summary: 'After this lesson you can draw the final aiworkshop system, name each part, and create the repository folders that the next five modules fill.',
      minutes: 20,
      objectives: [
        'Explain the five layers of the final aiworkshop system and what each one does.',
        'Trace one customer question through the finished system in order.',
        'Create the aiworkshop folder layout with one folder per module.',
        'Explain why a folder with an __init__.py file is a Python package.',
      ],
      keyTerms: ['project repository', 'system architecture', 'repository layout', '__init__.py', 'component', 'large language model', 'server'],
      links: [
        { label: 'Building effective agents (Anthropic)', url: 'https://www.anthropic.com/research/building-effective-agents', kind: 'article' },
        { label: 'Python tutorial: modules and packages', url: 'https://docs.python.org/3/tutorial/modules.html#packages', kind: 'docs' },
        { label: 'Anthropic cookbook: worked examples', url: 'https://github.com/anthropics/anthropic-cookbook', kind: 'repo' },
        { label: 'Claude API: getting started', url: 'https://docs.anthropic.com/en/api/getting-started', kind: 'docs' },
      ],
      body: `
## What this lesson covers

This lesson shows you the whole system before you build any part of it. You see the final architecture of aiworkshop, the one project that this track builds. You learn what each of the six modules adds, and you create the folder layout that the later lessons fill with code. At the end you can point at any box in the diagram and say which module builds it and which folder holds it.

## Why it matters

A builder who knows the final shape makes better decisions at every step. When the chat module asks you to keep a messages list, you will know that the agent module reuses that list. When the retrieval module stores chunks in a vector store, you will know that the web service in module 6 reads from it. Every lesson in this track adds one piece to one repository. The piece only makes sense when you know where it fits. The next lesson, [Environment, keys and the first commit](/courses/build-ai-ecosystem/set-up-your-workshop/environment-and-keys), turns the empty folders from this lesson into a working project with a virtual environment and an API key.

:::video
id: LCEmiRjPEtQ
why: Watch the first 15 minutes. Karpathy describes the large language model as a new kind of computer that your program talks to. The chat app, the retrieval system and the agent you build in this track are the kind of apps he calls partial autonomy apps.
:::

## The idea with an example

> **Analogy.** A builder who starts a house does not begin with a wall. They begin with a drawing of the finished house: the rooms, the doors, the pipes. Then they pour the foundation, raise the frame, add the roof, fit the plumbing and finally paint. Each step uses the step before it. The drawing in this lesson is the plan of the house. The six modules are the six building steps. The repository is the plot of land, and every module adds one room.

The running example for the whole track is a small bakery. The bakery has a menu, opening hours, an allergen list and a list of suppliers. Those four facts live in four text files. The system you build answers questions about them, in a terminal, in a browser and through an agent that reads the files on its own. Here is one question that the finished system answers: "Does the walnut loaf contain nuts, and what does it cost?"

The finished system has five layers. A layer is a group of parts that do the same kind of work. The top layer is the users: a browser or a terminal. The second layer is the service: the FastAPI app that receives the question, the chat loop that keeps the conversation, and the agent loop that decides which tool to call. The third layer is the knowledge: a retriever that finds the right chunks of text, a vector store that holds those chunks with their embeddings, and the data files themselves. The fourth layer is the models: the Claude API in the cloud, a local model that runs on your computer, and the model you fine-tune in module 5. The fifth layer is operations: the Docker image, the logs and traces, and the cost controls that keep the bill small.

:::arch
title: The aiworkshop system at the end of module 6
layer: Users | Browser, Terminal
layer: Service | FastAPI app, Chat loop, Agent loop
layer: Knowledge | Retriever, Vector store, Data files
layer: Models | Claude API, Local model, Fine-tuned model
layer: Operations | Docker image, Logs and traces, Cost controls
flow: Browser -> FastAPI app -> Retriever -> Vector store -> Retriever -> FastAPI app -> Claude API -> FastAPI app -> Browser
note: Vector store = the chunks of the four bakery files and their embeddings
:::

Follow the question about the walnut loaf through the diagram. The browser sends the question to the FastAPI app. The app hands it to the retriever. The retriever turns the question into an embedding, which is a list of numbers that captures its meaning, and asks the vector store for the 3 most similar chunks. The store returns a chunk from allergens.txt that says "Walnut loaf: contains tree nuts" and a chunk from menu.txt that says "Walnut loaf 4.50". The app builds a prompt from the question and the two chunks and sends it to the Claude API. The model writes the answer: "Yes, the walnut loaf contains tree nuts. It costs 4.50." The app sends the answer back to the browser. Press Next to follow the same path one step at a time.

:::scenario
title: One question travels through the finished system
state: question=walnut loaf nuts and price, chunks=0, answer=none
step: A customer types the question into the web page. The browser sends it to the FastAPI app as an HTTP request.
state: location=FastAPI app
step: The app passes the question to the retriever. The retriever computes an embedding of the question.
state: location=retriever, embedding=384 numbers
step: The retriever asks the vector store for the 3 chunks whose embeddings are most similar. The store returns 2 useful chunks and 1 weak one.
state: chunks=3, best=allergens.txt and menu.txt
step: The app builds a prompt: the system rules, the 3 chunks, and the question. It sends the prompt to the Claude API.
state: location=Claude API, prompt=about 320 tokens
step: The model reads the chunks and writes the answer in about 25 tokens.
state: answer=Yes, contains tree nuts, costs 4.50
step: The app logs the request with a trace id, then returns the answer to the browser. The page shows it.
state: location=browser, logged=yes
:::

Notice which parts the question did not visit. It did not visit the agent loop, because a simple question needs no tools. It did not visit the local model, because the app chose the cloud model for this request. The architecture holds more parts than any one request uses. That is normal. A system is the set of paths a request can take, not one path.

## How it works

The architecture becomes real as a repository. A project repository is one folder, tracked by git, that holds all the code and data for a project. The repository for this track is named aiworkshop. Each module adds one folder to it. The table lists the folders, the module that fills each one, and what the folder holds when the track ends.

:::anim
title: The walnut loaf question crosses the system, folder by folder
box user "Browser" @ 130,140 icon: browser
box api "FastAPI app|app/" @ 420,140 icon: server
box llm "Claude API|chat/" @ 710,140 icon: model
box ret "Retriever|rag/" @ 420,290 icon: vector
box vdb "Vector store|data/" @ 710,290 icon: database
box agent "Agent loop|agents/" @ 130,290 size: 180x64 icon: agent
text q "Does the walnut loaf contain nuts,|and what does it cost?" @ 60,215 size: 15 color: yellow anchor: start
num chunks = 0 @ 710,420 suffix: " chunks" size: 24
num ptok = 0 @ 420,420 prefix: "prompt: " suffix: " tokens" size: 22
num atok = 0 @ 710,460 prefix: "answer: " suffix: " tokens" size: 22 color: green
text ans "Yes, it contains tree nuts.|It costs 4.50." @ 130,440 size: 16 color: green

step: A customer types the walnut loaf question. The browser sends it to the FastAPI app, which lives in app/.
  show user, q, api
  arrow user -> api : question
step: The app hands the question to the retriever in rag/.
  show ret
  arrow api -> ret : question
step: The retriever turns the question into an embedding and asks the vector store in data/ for similar chunks.
  show vdb
  arrow ret -> vdb : embedding
step: The store returns the 3 closest chunks: one from allergens.txt, one from menu.txt, one weak.
  show chunks
  arrow vdb -> ret : 3 chunks
  & count chunks -> 3
step: The retriever passes the chunks up. The app builds a prompt of about 320 tokens from them and the question.
  show ptok
  arrow ret -> api : chunks
  & count ptok -> 320
step: The app sends the prompt to the Claude API, called from chat/. The model writes about 25 tokens.
  show llm
  arrow api -> llm : prompt
  show atok
  count atok -> 25
step: The answer returns to the app and then to the browser. The page shows it.
  arrow llm -> api : answer
  arrow api -> user : answer
  show ans
step: The agent loop in agents/ stays unused: a simple question needs no tools. A system holds more paths than one request uses.
  show agent
  dim agent
  highlight ans
:::

| Folder | Module that fills it | What it holds at the end |
| --- | --- | --- |
| chat/ | 2, Chat application | the first model calls, the chat loop, streaming and structured output |
| app/ | 2, Chat application | the FastAPI service with /chat and /ask, and one HTML page |
| rag/ | 3, Retrieval | the loader, the chunker, the embedder and the retriever |
| agents/ | 4, Agents and tools | tool definitions, the agent loop, memory, an MCP server and guardrails |
| train/ | 5, Train your own | the dataset builder and the LoRA notebook |
| eval/ | 3 and 5 | test questions and grading scripts |
| data/ | this module | the four bakery text files, and later the vector store files |
| root files | this module and 6 | requirements.txt, .env.example, .gitignore, Dockerfile |

The data folder is the only one this module fills with content. The four files are small on purpose. A small data set lets you check every answer by eye. When the retriever returns the wrong chunk in module 3, you will know, because you can read all four files in two minutes.

Here is the layout as a tree. Create it now with the commands below the tree. The commands work on macOS and Linux. On Windows, use the same mkdir commands in PowerShell, and create the empty files with New-Item instead of touch.

:::code
lang: text
aiworkshop/
  app/__init__.py
  chat/__init__.py
  rag/__init__.py
  agents/__init__.py
  train/__init__.py
  eval/__init__.py
  data/
  README.md
:::

:::code
lang: bash
mkdir aiworkshop
cd aiworkshop
mkdir app chat rag agents train eval data
touch app/__init__.py chat/__init__.py rag/__init__.py
touch agents/__init__.py train/__init__.py eval/__init__.py
echo "# aiworkshop: a bakery assistant built in six modules" > README.md
ls
:::

:::code
lang: text
README.md  agents  app  chat  data  eval  rag  train
:::

Each code folder gets an empty file named __init__.py. A folder that holds an __init__.py file is a Python package. A package is a folder of Python files that other files can import by name. With the file in place, a script in the agents folder can write from chat.client import ask and Python finds the chat folder. Without the file, some Python tools treat the folder as plain files and the import fails. The file can stay empty. Its presence is the signal.

Every lesson that adds code tells you the folder and the file name. For example, the tool calling lesson in module 4 writes agents/tools.py. Run every script from the root of the repository, the aiworkshop folder, with the form python -m agents.call_tool. The -m flag tells Python to run a module by its dotted name. Python then adds the current folder to its search path, so the packages import correctly.

### What each module adds to the diagram

The six modules build the diagram from the bottom up and from the inside out.

1. Set up your workshop, this module. The repository, the virtual environment, the API key, and the first call to a model. In the diagram: the Claude API box and the Local model box, with nothing in front of them.
2. Chat application. A chat loop that keeps a messages list, streaming output, structured output with a schema, and a FastAPI service with one web page. In the diagram: the Terminal, the Browser, the FastAPI app and the Chat loop.
3. Retrieval. Loading and chunking the bakery files, embedding the chunks, storing them, and answering with citations. In the diagram: the whole Knowledge layer.
4. Agents and tools. Tools over the data folder, the agent loop, memory, an MCP server and guardrails. In the diagram: the Agent loop.
5. Train your own. A dataset of 200 examples, a LoRA fine-tune on a free Colab GPU, and serving the result. In the diagram: the Fine-tuned model.
6. Ship it. A Docker image, a deploy to a public URL, logs and traces, and cost controls. In the diagram: the whole Operations layer.

The order matters. You cannot retrieve before you can call a model. You cannot give an agent tools before you can retrieve, because the search tool is the retriever. You cannot deploy before the service exists. Each module needs only the modules before it.

### Why one repository and not six

A beginner course often gives one separate example per topic. This track does not, for three reasons. First, the real work in AI engineering is connecting parts, not writing any single part. A chat loop is 30 lines. A chat loop that calls a retriever that reads a store that an agent also searches is a system, and systems are where the hard problems live. Second, a single repository forces every part to share one messages format, one data folder and one key. You learn the shared conventions once. Third, at the end you own one thing you can show: a URL that answers questions about documents, with a trace for every request.

## Try it

:::exercise
title: Create the bakery data files
task: Inside the data folder, create the four text files that the whole track uses. Give each file at least 4 lines. Use the names menu.txt, opening_hours.txt, allergens.txt and suppliers.txt. Include a walnut loaf at 4.50 and an almond croissant at 3.20 in the menu, and list both under tree nuts in the allergens file. Then run the ls command on the data folder and count 4 files.
hint: Open a plain text editor, type the lines, and save each file into aiworkshop/data. Keep one fact per line, because the chunker in module 3 splits on lines.
lang: text
solution:
data/menu.txt
Sourdough loaf 3.80
Walnut loaf 4.50
Almond croissant 3.20
Plain croissant 2.40
Cinnamon bun 2.90

data/opening_hours.txt
Monday to Friday: 07:00 to 17:00
Saturday: 08:00 to 14:00
Sunday: closed
Public holidays: closed

data/allergens.txt
Walnut loaf: contains tree nuts, gluten
Almond croissant: contains tree nuts, gluten, dairy, egg
Plain croissant: contains gluten, dairy, egg
Sourdough loaf: contains gluten
Cinnamon bun: contains gluten, dairy, egg

data/suppliers.txt
Flour: Mill Street Flour, delivery Monday
Butter: Green Field Dairy, delivery Tuesday and Friday
Nuts: Orchard Nut Company, delivery Wednesday
Eggs: Hillside Farm, delivery daily
:::

:::exercise
title: Trace a second question
task: On paper, trace the question "What time do you open on Saturday?" through the architecture diagram. Write the boxes it visits in order. Then write which file the retriever should find a chunk in, and what the model answers.
hint: The path is the same as the walnut loaf example. Only the file that holds the answer changes.
lang: text
solution:
Browser -> FastAPI app -> Retriever -> Vector store -> Retriever -> FastAPI app -> Claude API -> FastAPI app -> Browser
Chunk comes from opening_hours.txt: "Saturday: 08:00 to 14:00"
Answer: "We open at 08:00 on Saturday and close at 14:00."
:::

## Common mistakes

- Mistake: you create a separate folder for each lesson, so later lessons cannot import earlier code. Fix: keep one aiworkshop repository and add folders inside it exactly as the table shows.
- Mistake: you forget the __init__.py files, and an import such as from chat.client import ask fails in some tools. Fix: create the empty file in every code folder before you write any script.
- Mistake: you run a script from inside its folder, such as cd agents and then python call_tool.py, and the imports fail. Fix: run from the aiworkshop root with python -m agents.call_tool.
- Mistake: you fill the data folder with a 200 page PDF on day one. Fix: use the four small bakery files; you need to check every answer by eye while you learn.
- Mistake: you think every request visits every box in the diagram. Fix: a request takes one path through the system; the diagram shows all the possible paths.

## Check your understanding

:::quiz
title: Check: the project plan
q: A question needs only the menu file and no tool calls. Which layer does the request skip?
- The Service layer
- The Models layer
* The Agent loop inside the Service layer
why: A plain question goes from the app to the retriever and the model; the agent loop runs only when the model needs tools.
q: Which folder does the tool calling lesson in module 4 write its code into?
- chat/
- rag/
* agents/
- app/
why: The table assigns tool definitions, the agent loop, memory, MCP and guardrails to the agents folder.
q: You run cd rag and then python retriever.py, and Python reports that it cannot find the chat package. What is the fix?
- Reinstall Python
* Return to the aiworkshop root and run python -m rag.retriever
- Delete the __init__.py files
why: The -m form from the root puts the repository on the search path, so every package imports.
q: Why do the six modules have to run in this order?
- The site enforces it
* Each module builds on parts the earlier modules made, such as the retriever that the agent uses as a tool
- Later modules are harder to read
why: The dependencies are real: no retrieval without a model call, no search tool without a retriever, no deploy without a service.
q: Which file holds the answer to "Which day does the nut supplier deliver?"
- allergens.txt
- menu.txt
* suppliers.txt
why: The suppliers file lists Orchard Nut Company with a Wednesday delivery.
:::

## Go further

The Anthropic article on building effective agents shows the same layers from the point of view of someone who has built many of them. Read the section on workflows versus agents; you build both in module 4. The Python tutorial page on packages explains __init__.py in more depth. The Anthropic cookbook holds worked examples of most parts of the diagram, and you can read them after each module. The next lesson, [Environment, keys and the first commit](/courses/build-ai-ecosystem/set-up-your-workshop/environment-and-keys), adds a virtual environment, a requirements file, an API key and the first git commit to the folders you created here.
`,
    },
    {
      slug: 'environment-and-keys',
      title: 'Environment, keys and the first commit',
      summary: 'After this lesson you have a virtual environment, a requirements file, an API key stored in a .env file that git never sees, and a first commit.',
      minutes: 22,
      objectives: [
        'Create and activate a virtual environment inside the aiworkshop folder.',
        'Write a requirements file and install from it.',
        'Create an API key, store it in a .env file and load it into a program without printing it.',
        'Write a .gitignore that keeps the key and the environment out of git, then make the first commit.',
      ],
      keyTerms: ['virtual environment', 'requirements file', '.env file', 'API key', 'environment variable', 'git commit', '.gitignore'],
      links: [
        { label: 'Python docs: venv', url: 'https://docs.python.org/3/library/venv.html', kind: 'docs' },
        { label: 'pip user guide: requirements files', url: 'https://pip.pypa.io/en/stable/user_guide/#requirements-files', kind: 'docs' },
        { label: 'Pro Git: getting a Git repository', url: 'https://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository', kind: 'docs' },
        { label: 'python-dotenv', url: 'https://github.com/theskumar/python-dotenv', kind: 'repo' },
        { label: 'Anthropic Console', url: 'https://console.anthropic.com/', kind: 'docs' },
      ],
      body: `
## What this lesson covers

This lesson turns the empty folders from the last lesson into a working project. You create a virtual environment, write a requirements file, get an API key from a model provider, store it in a .env file and load it into a Python program. Then you tell git which files to ignore and make the first commit. At the end a script named check_setup.py prints "key found" without ever printing the key.

## Why it matters

Every later lesson starts with two assumptions: the virtual environment is active, and the key is in the environment. If either one is wrong, the first line of every script fails. The time you spend here saves an hour of confusion in module 2. The key also has a price attached. A leaked key lets a stranger spend your money, so the habit of keeping it out of git starts on day one. The next lesson, [Call a model](/courses/build-ai-ecosystem/set-up-your-workshop/call-a-model), uses this key to make the first request.

:::video
id: hwP7WQkmECE
why: Watch all 100 seconds. It shows what a commit is and why a repository keeps every version. This lesson makes your first commit at the end.
:::

## The idea with an example

> **Analogy.** A workshop needs three things before the first cut: a clean bench with only the tools for this job, a list of those tools so you can set up the same bench again, and a locked drawer for the one expensive item. The virtual environment is the clean bench. The requirements file is the tool list. The .env file is the locked drawer, and .gitignore is the rule that the drawer never leaves the room.

The running example is the aiworkshop folder you created in the last lesson. It has seven folders and a README. Here is the full sequence of commands for macOS and Linux. The Windows lines differ only in the activate command, which the next section lists.

:::code
lang: bash
cd aiworkshop
python3 -m venv .venv
source .venv/bin/activate
python --version
pip install anthropic python-dotenv
pip list
:::

:::code
lang: text
Python 3.12.3
Package        Version
-------------- -------
anthropic      0.76.0
python-dotenv  1.1.0
...
:::

Three things happened. The venv command created a folder named .venv inside aiworkshop. That folder holds a private copy of Python and an empty place for packages. The activate command told the terminal to use that private copy, and the prompt now starts with (.venv). The pip install command put two packages into .venv and nowhere else. The anthropic package is the official client library for the Claude API. The python-dotenv package reads a .env file into the environment.

Now the key. An API key is a long secret string that identifies your account to a provider. The provider counts every request made with the key and bills the account. For the Claude API, open the Anthropic Console in your browser, sign in, open the API Keys page and create a key named aiworkshop. The console shows the key once. Copy it into the .env file right away. A Claude API key starts with sk-ant- and is about 100 characters long.

:::code
lang: text
file: .env
ANTHROPIC_API_KEY=sk-ant-api03-REPLACE-WITH-YOUR-REAL-KEY
:::

Press Next to follow what happens when a program needs the key.

:::scenario
title: How the key reaches the program
state: console=key created, .env=empty, os.environ=no key
step: You create the key in the Anthropic Console. The console shows it once and then hides it forever.
state: clipboard=sk-ant-...
step: You paste the key into .env as ANTHROPIC_API_KEY=sk-ant-... and save the file.
state: .env=has key, clipboard=cleared
step: You run python check_setup.py. The first line of the script calls load_dotenv, which reads .env and copies each line into the environment.
state: os.environ=has ANTHROPIC_API_KEY
step: The script asks os.environ.get for the key and finds a string of about 100 characters.
state: key_present=True, length=108
step: The script prints "key found, 108 characters" and never prints the key itself.
state: screen=key found, 108 characters
:::

The key moves through three places: the console, the file and the environment. Git must see none of them. The last section of this lesson makes that rule explicit.

## How it works

The scene below follows the key from the console to the request header, and shows the one door that .gitignore keeps shut. The sections after it build each step by hand.

:::anim
title: The key reaches the program and never reaches git
box console "Anthropic Console" @ 160,140 size: 200x64 icon: browser
box envf ".env file" @ 460,140 icon: key
box osenv "os.environ" @ 760,140 icon: memory
box files "README, code,|.env.example" @ 160,290 size: 200x64 icon: files
box git "git commit" @ 460,290 icon: disk
box client "anthropic client" @ 760,290 icon: python
box gitignore ".gitignore" @ 460,440 icon: guard
box api "Claude API" @ 760,440 icon: model
text keytxt "sk-ant-api03-..." @ 160,215 size: 18 color: yellow
num chars = 0 @ 600,215 prefix: "key found, " suffix: " characters" size: 19 color: green
arrow block from envf to git ".env: blocked" color: red dashed

step: You create a key in the Anthropic Console. The console shows it once, then hides it forever.
  show console, keytxt
step: You paste the key into the .env file as ANTHROPIC_API_KEY=... and save the file.
  show envf
  arrow console -> envf : paste once
step: python check_setup.py starts. Its first line, load_dotenv, reads .env and copies each line into os.environ.
  show osenv
  arrow envf -> osenv : load_dotenv
step: The script asks os.environ for the key, finds 108 characters, and prints the length, never the key.
  hide keytxt
  show chars
  count chars -> 108
step: The anthropic client reads the same variable and sends the key to the Claude API in a request header.
  show client, api
  arrow osenv -> client : ANTHROPIC_API_KEY
  arrow client -> api : header
step: git add . stages README, the code and .env.example for the first commit.
  show files, git
  arrow files -> git : git add .
step: .gitignore blocks .env, so the commit never holds the key. A committed key is a leaked key.
  show gitignore
  arrow gitignore -> git : rule: .env
  show block
  pulse gitignore
:::

### The virtual environment

A virtual environment is a private folder of installed packages for one project. Without one, pip installs every package into the shared Python on your computer. Two projects then fight over versions, and a package installed for one breaks the other. With one, each project has its own set. You activate the environment each time you open a terminal for the project. The activation line differs by operating system.

| Operating system | Create | Activate | Prompt after activation |
| --- | --- | --- | --- |
| macOS and Linux | python3 -m venv .venv | source .venv/bin/activate | (.venv) $ |
| Windows PowerShell | python -m venv .venv | .venv\\Scripts\\Activate.ps1 | (.venv) PS> |
| Windows Command Prompt | python -m venv .venv | .venv\\Scripts\\activate.bat | (.venv) C:\\> |

If PowerShell refuses to run the activate script, run Set-ExecutionPolicy -Scope CurrentUser RemoteSigned once, answer Y, and try again. If the prompt does not show (.venv), the environment is not active, and pip will install into the wrong place.

### The requirements file

A requirements file is a text file, named requirements.txt, with one package per line. Anyone with the file can rebuild the same environment with one command. The Dockerfile in module 6 copies this exact file into the image, so keep it current. Write it by hand, then install from it to check that it works.

:::code
lang: text
file: requirements.txt
anthropic
python-dotenv
:::

:::code
lang: bash
pip install -r requirements.txt
:::

When a later lesson needs a new package, it tells you to add a line. The agents module, for example, appends sentence-transformers and numpy. Add the line, run the install command again, and the environment matches the file. The file is the truth. The environment is a copy of it.

### The key in the environment

An environment variable is a named value that the operating system gives to a program when the program starts. The anthropic package looks for one named ANTHROPIC_API_KEY. You could set it in the terminal before every run, but you would forget. The .env file solves this: it is a plain text file of NAME=value lines that load_dotenv copies into the environment at the start of the program. Here is the check script. Save it at the root of the repository.

:::code
lang: python
file: check_setup.py
import os
from dotenv import load_dotenv

load_dotenv()

key = os.environ.get("ANTHROPIC_API_KEY")
if key is None:
    print("no key: create a .env file with ANTHROPIC_API_KEY=...")
elif not key.startswith("sk-ant-"):
    print("key found but it does not start with sk-ant-, check for a copy error")
else:
    print(f"key found, {len(key)} characters")
:::

:::code
lang: bash
python check_setup.py
:::

:::code
lang: text
key found, 108 characters
:::

The script never prints the key. Printing a key is the most common way to leak it, because terminal output ends up in screenshots, in chat messages and in log files. Print the length or the first 7 characters, never the whole string. When the anthropic package starts, it reads the same environment variable on its own, so the next lesson needs only the load_dotenv line and no other key handling.

### The example file

Other people, and your future self on a new computer, need to know which variables the project expects. So the repository holds a second file, .env.example, with the names and fake values. This file is safe to commit. The real .env is not.

:::code
lang: text
file: .env.example
ANTHROPIC_API_KEY=sk-ant-your-key-here
:::

### Keep secrets and junk out of git

Git tracks every file you add. A .gitignore file is a list of names that git must never track, one pattern per line. The aiworkshop repository needs four patterns at the start.

:::code
lang: text
file: .gitignore
.venv/
.env
__pycache__/
*.pyc
:::

The table says why each line is there.

| Pattern | What it matches | Why it stays out of git |
| --- | --- | --- |
| .venv/ | the whole virtual environment | hundreds of megabytes that requirements.txt can rebuild |
| .env | the file with your real key | a committed key is a leaked key, even if you delete it later |
| __pycache__/ | folders of compiled Python files | generated on every run; never hand written |
| *.pyc | single compiled files | same reason |

The second line is the one that matters most. Git keeps every version of every file forever. If you commit .env once and delete it in the next commit, the key is still in the history, and anyone who clones the repository can read it. Public repositories are scanned by bots within minutes of a push, and a leaked key is used within hours. Write the .gitignore before the first commit, not after.

### The first commit

A git commit is a saved snapshot of every tracked file, with a message that says what changed. The three commands below create the repository, stage every file that .gitignore allows, and save the snapshot.

:::code
lang: bash
git init
git add .
git status
git commit -m "Set up the aiworkshop repository"
:::

:::code
lang: text
On branch main
Changes to be committed:
  new file:   .env.example
  new file:   .gitignore
  new file:   README.md
  new file:   agents/__init__.py
  new file:   app/__init__.py
  new file:   chat/__init__.py
  new file:   check_setup.py
  new file:   data/allergens.txt
  new file:   data/menu.txt
  new file:   data/opening_hours.txt
  new file:   data/suppliers.txt
  new file:   eval/__init__.py
  new file:   rag/__init__.py
  new file:   requirements.txt
  new file:   train/__init__.py
:::

Read the status output before you commit, every time. The list must not contain .env and must not contain anything under .venv. If it does, the .gitignore file has a typo. Fix the file and run git status again. The diagram sums up the three places the key lives and the one place it must never reach.

:::flow
title: Where the key goes and where it never goes
Console -> .env file: you paste it once
.env file -> Environment: load_dotenv copies it
Environment -> anthropic client: reads ANTHROPIC_API_KEY
anthropic client -> Claude API: sends it in a request header
.gitignore -> git: blocks .env from every commit
:::

If git ever shows .env as a new file, stop. Do not commit. If you already committed and pushed a key, go to the console, delete the key, and create a new one. Deleting the commit is not enough.

## Try it

:::exercise
title: Prove that the key is invisible to git
task: Run git status and confirm that .env is not listed. Then run the command git check-ignore -v .env and read the output. Then temporarily rename .gitignore to gitignore.bak, run git status again, and watch .env appear. Rename the file back and run git status one more time.
hint: The check-ignore command prints the file and the line of .gitignore that matched it. When the rule is gone, git treats .env as an ordinary untracked file.
lang: text
solution:
$ git check-ignore -v .env
.gitignore:2:.env    .env

$ mv .gitignore gitignore.bak
$ git status
Untracked files:
  .env
  gitignore.bak

$ mv gitignore.bak .gitignore
$ git status
nothing to commit, working tree clean
:::

:::exercise
title: Rebuild the environment from the file
task: Deactivate the environment with the command deactivate. Delete the .venv folder. Create a new one, activate it, and install from requirements.txt. Then run python check_setup.py and confirm that it still prints "key found".
hint: On macOS and Linux the delete command is rm -rf .venv. On Windows it is Remove-Item -Recurse .venv. The .env file is not inside .venv, so the key survives.
lang: bash
solution:
deactivate
rm -rf .venv
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python check_setup.py
# key found, 108 characters
:::

## Common mistakes

- Mistake: you run pip install before activate, and the package lands in the system Python. Fix: look for (.venv) at the start of the prompt before every pip command.
- Mistake: you paste the key with a space or a quote around it, and the check script reports a wrong prefix. Fix: the line is NAME=value with no spaces and no quotes.
- Mistake: you print the key to check it, and the key ends up in a screenshot. Fix: print the length or the first 7 characters only.
- Mistake: you commit first and write .gitignore second, so .env is already in the history. Fix: write .gitignore before git init, and if a key was committed, revoke it in the console.
- Mistake: you install a package but forget to add it to requirements.txt, and the Docker build in module 6 fails. Fix: edit the file first, then run pip install -r requirements.txt.

## Check your understanding

:::quiz
title: Check: environment and keys
q: Your prompt shows no (.venv) and you run pip install anthropic. Where does the package go?
- Into the .venv folder
* Into the shared Python on your computer
- Nowhere, pip refuses
why: pip installs into whichever Python is active, and without activation that is the system Python.
q: You committed .env by accident, then deleted the file and committed again. Is the key safe?
- Yes, the file is gone
- Yes, as long as the repository is private
* No, the key is still in the history, so revoke it and create a new one
why: Git keeps every version; deleting a file in a later commit does not remove it from earlier ones.
q: Which file is safe to commit?
- .env
* .env.example
- .venv/pyvenv.cfg
why: The example file holds only variable names and fake values, so it tells others what to set without revealing anything.
q: A teammate clones the repository on a new laptop. Which two steps rebuild your setup?
- Copy your .venv folder and your .env file to them
* Install from requirements.txt and create their own .env with their own key
- Run git pull twice
why: The requirements file rebuilds the packages, and each person uses a personal key that never travels through git.
q: check_setup.py prints "key found but it does not start with sk-ant-". What is the most likely cause?
- The anthropic package is missing
* The line in .env has quotes, a space or part of the key missing
- The key has expired
why: The script found a value, so .env loaded; the content of the value is wrong, which points to a copy error.
:::

## Go further

The Python venv documentation explains what the activate script changes. The pip guide shows how to pin exact versions in requirements.txt, which you will want before module 6. The Pro Git chapter in the links covers init, add and commit in more detail, and the python-dotenv README lists the other ways to load variables. The next lesson, [Call a model](/courses/build-ai-ecosystem/set-up-your-workshop/call-a-model), uses the key you stored here to send the first prompt and compares three ways to call a model.
`,
    },
    {
      slug: 'call-a-model',
      title: 'Call a model',
      summary: 'After this lesson you can send one prompt to a model three ways, through the Anthropic SDK, through an OpenAI-compatible endpoint and through Ollama on your own computer, and compare what comes back.',
      minutes: 25,
      objectives: [
        'Write a Python script that calls the Claude API with the Anthropic SDK and prints the text and the token usage.',
        'Write the same call against an OpenAI-compatible endpoint by changing a base URL and a model name.',
        'Run a local model with Ollama and call it from Python.',
        'Compute the cost of one request from the token counts and compare the three ways on speed, cost and privacy.',
      ],
      keyTerms: ['SDK', 'Messages API', 'max_tokens', 'OpenAI-compatible endpoint', 'Ollama', 'local model', 'token usage', 'base URL'],
      links: [
        { label: 'Messages API reference (Claude docs)', url: 'https://docs.anthropic.com/en/api/messages', kind: 'docs' },
        { label: 'Anthropic Python SDK', url: 'https://github.com/anthropics/anthropic-sdk-python', kind: 'repo' },
        { label: 'Ollama REST API', url: 'https://github.com/ollama/ollama/blob/main/docs/api.md', kind: 'docs' },
        { label: 'Ollama Python library', url: 'https://github.com/ollama/ollama-python', kind: 'repo' },
        { label: 'OpenAI chat completions reference', url: 'https://platform.openai.com/docs/api-reference/chat', kind: 'docs' },
      ],
      body: `
## What this lesson covers

This lesson sends the first prompt from the aiworkshop repository to a model. You call a model three ways: the Claude API through the official Anthropic software development kit (SDK), any provider that speaks the OpenAI-compatible format, and a local model that runs on your own computer through Ollama. All three receive the same prompt. You compare the answers, the time, the token counts and the cost. At the end the chat folder holds four small scripts that every later module builds on.

## Why it matters

Every part of the final system, the chat loop, the retriever, the agent and the web service, ends in one call to a model. If you understand that one call, the rest is plumbing around it. You also learn early that the model is a replaceable part. The same prompt can go to a cloud model for quality or to a local model for privacy and zero cost per request. Module 5 serves your own fine-tuned model through Ollama, so the third way in this lesson is the way you will reach your own model later. The next module, [A chat loop in the terminal](/courses/build-ai-ecosystem/chat-application/chat-loop), wraps the first script in a loop that remembers the conversation.

:::video
id: WxYC9-hBM_g
why: Watch the first 10 minutes. It installs Ollama and pulls a model, which is the third way in this lesson. You do not need the parts about the web interface.
:::

## The idea with an example

> **Analogy.** You want a short welcome sign for the bakery window. You can ask three writers. The first is a professional agency in another city: you send a letter, pay per word, and get a polished line back in a second. The second is the same request sent through a standard order form that many agencies accept, so you can switch agency by changing the address on the form. The third is a friend who sits in your back room: free per sign, nobody outside the shop sees the request, but the friend is slower and a little less polished. The prompt is the letter. The three ways to call a model are the three writers.

The running example is one prompt: "Write one sentence that welcomes a customer to a small bakery called Crumb." The model gets the prompt, writes a sentence, and reports how many tokens it read and wrote. A token is a piece of text, about three quarters of a word. Here is the first way, the Anthropic SDK. Install nothing new, because the anthropic package is already in requirements.txt.

:::code
lang: python
file: chat/hello_claude.py
import time
from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()
client = Anthropic()
MODEL = "claude-sonnet-5-5"
PROMPT = "Write one sentence that welcomes a customer to a small bakery called Crumb."

start = time.time()
response = client.messages.create(
    model=MODEL,
    max_tokens=200,
    messages=[{"role": "user", "content": PROMPT}],
)
seconds = time.time() - start

text = "".join(block.text for block in response.content if block.type == "text")
print(text)
print(f"input tokens: {response.usage.input_tokens}")
print(f"output tokens: {response.usage.output_tokens}")
print(f"time: {seconds:.1f} s")
:::

:::code
lang: bash
python -m chat.hello_claude
:::

:::code
lang: text
Welcome to Crumb, where every loaf is baked fresh this morning and every customer leaves with something warm.
input tokens: 23
output tokens: 24
time: 1.4 s
:::

Read the output with the numbers in hand. The prompt was 23 tokens. The answer was 24 tokens. The price list for claude-sonnet-5-5 says 2 dollars per million input tokens and 10 dollars per million output tokens. So this request cost 23 times 2 divided by 1,000,000, plus 24 times 10 divided by 1,000,000. That is 0.000046 plus 0.00024, which is about 0.0003 dollars. A thousand such requests cost about 30 cents. The time was 1.4 seconds, most of it the round trip to a server in another country.

Press Next to follow the request from your script to the model and back.

:::scenario
title: One request to the Claude API
state: messages=1 user message, key=loaded, response=none
step: load_dotenv reads .env. The Anthropic client reads ANTHROPIC_API_KEY from the environment and keeps it in memory.
state: client=ready
step: messages.create packs the model name, max_tokens and the messages list into a JSON request and sends it over HTTPS with the key in a header.
state: request=about 23 input tokens, in flight
step: The API checks the key, counts the input tokens and starts the model. The model writes one token at a time until the sentence ends.
state: output=24 tokens, stop_reason=end_turn
step: The API returns a JSON response. The SDK turns it into a Python object with a content list and a usage object.
state: response.content=1 text block, usage=23 in and 24 out
step: Your script joins the text blocks, prints the sentence, and prints the usage and the time.
state: screen=sentence, 23, 24, 1.4 s
:::

Two details in the script deserve a second look. The content field is a list of blocks, not a string. Today it holds one text block. In module 4 the same list holds tool use blocks, and some models add thinking blocks in front of the text. The loop that keeps only the text blocks works in every case. The second detail is max_tokens. It is the most output tokens the model may write. The model stops when the sentence ends or when it reaches that number, whichever comes first. A sentence needs about 30 tokens, so 200 is safe. The chat loop in the next module raises it to 2,048 for longer answers.

## How it works

### The three ways

All three ways do the same job: send a messages list, get a text answer. They differ in who runs the model, what the request looks like on the wire, and what it costs.

:::anim
title: One prompt, three ways: the cloud, the OpenAI-compatible form, and your own computer
box script "Your script" @ 480,120 icon: script
text prompt "Write one sentence that welcomes|a customer to a small bakery|called Crumb." @ 760,120 size: 15 color: yellow
box claude "Claude API|Anthropic servers" @ 180,290 size: 220x64 icon: model
box ollama "Ollama|localhost:11434" @ 780,290 size: 220x64 icon: hardware
num tin = 0 @ 180,370 prefix: "in: " suffix: " tokens" size: 21
num tout = 0 @ 180,404 prefix: "out: " suffix: " tokens" size: 21
num secs = 0 @ 180,438 prefix: "time: " suffix: " s" digits: 1 size: 21
num cost = 0 @ 180,472 prefix: "cost: " suffix: " dollars" digits: 4 size: 21 color: green
num tin2 = 0 @ 780,370 prefix: "in: " suffix: " tokens" size: 21
num tout2 = 0 @ 780,404 prefix: "out: " suffix: " tokens" size: 21
num secs2 = 0 @ 780,438 prefix: "time: " suffix: " s" digits: 1 size: 21
num cost2 = 0 @ 780,472 prefix: "cost: " suffix: " dollars" digits: 4 size: 21 color: green
text note "base_url = http://localhost:11434/v1" @ 480,420 size: 16 color: grey

step: Your script holds one prompt: a welcome sentence for a small bakery called Crumb.
  show script, prompt
step: The Anthropic SDK packs the prompt into a JSON request and sends it over HTTPS, key in a header.
  show claude
  arrow script -> claude : HTTPS + key
step: The API counts 23 input tokens. The model writes 24 output tokens, one at a time.
  show tin, tout
  count tin -> 23
  count tout -> 24 (2.5s)
step: The response returns after 1.4 seconds. The SDK turns the JSON into a Python object.
  show secs
  arrow claude -> script : response
  & count secs -> 1.4
step: Cost: 23 input tokens at 2 dollars per million, plus 24 output at 10 dollars per million. About 0.0003 dollars.
  show cost
  count cost -> 0.0003 (2s)
step: The same messages list goes to Ollama on your own computer, port 11434. Nothing leaves your disk.
  show ollama
  arrow script -> ollama : messages list
step: Its own tokenizer counts 31 input tokens. It writes 14 tokens in 2.6 seconds, and the cost is zero.
  show tin2, tout2, secs2, cost2
  count tin2 -> 31
  count tout2 -> 14 (2s)
  & count secs2 -> 2.6 (2s)
  arrow ollama -> script : response
step: The OpenAI-compatible script reaches the same server through /v1. Change the base URL, not the code.
  show note
  send script -> ollama : messages list
  highlight ollama
:::

| | Anthropic SDK | OpenAI-compatible endpoint | Ollama, local |
| --- | --- | --- | --- |
| Who runs the model | Anthropic servers | the provider at the base URL | your computer |
| Package | anthropic | openai | ollama |
| Method | client.messages.create | client.chat.completions.create | ollama.chat |
| Where the text is | response.content[i].text | choices[0].message.content | response.message.content |
| Switch model by | the model string | the base URL and the model string | the model string |
| Cost per request | fraction of a cent | depends on the provider, or zero when the URL is local | zero |
| Privacy | prompt leaves your computer | prompt leaves your computer unless the URL is local | prompt stays on your disk |
| Needs | an API key | a base URL, a key and a model name | Ollama installed and a model pulled |

The first way is the one you use for most of this track. The Messages API is the Claude API endpoint that takes a messages list and returns content blocks, and the SDK is the Python package that calls it with typed objects, retries and error classes. The second way exists because many providers, and Ollama itself, accept the request format that the OpenAI chat completions API made common. One script with a changeable base URL can reach all of them. The base URL is the address that the client sends every request to. The third way is a model file on your disk, run by the Ollama program, which answers on port 11434 of your own computer.

### Way 2: the OpenAI-compatible call

Add two packages to requirements.txt, openai and ollama, and install them.

:::code
lang: bash
echo "openai" >> requirements.txt
echo "ollama" >> requirements.txt
pip install -r requirements.txt
:::

The script reads the base URL, the key and the model name from the environment, so you change providers by editing .env, not code. The defaults point at the Ollama program on your own computer, which accepts this format at the path /v1 and ignores the key. That lets you run the script with no second paid account. To use a hosted provider instead, set the three variables to the values from that provider's documentation.

:::code
lang: python
file: chat/hello_compatible.py
import os
import time
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI(
    base_url=os.environ.get("COMPAT_BASE_URL", "http://localhost:11434/v1"),
    api_key=os.environ.get("COMPAT_API_KEY", "ollama"),
)
MODEL = os.environ.get("COMPAT_MODEL", "llama3.2")
PROMPT = "Write one sentence that welcomes a customer to a small bakery called Crumb."

start = time.time()
completion = client.chat.completions.create(
    model=MODEL,
    max_tokens=200,
    messages=[{"role": "user", "content": PROMPT}],
)
seconds = time.time() - start

print(completion.choices[0].message.content)
print(f"input tokens: {completion.usage.prompt_tokens}")
print(f"output tokens: {completion.usage.completion_tokens}")
print(f"time: {seconds:.1f} s")
:::

The shape is close to the first script, and the differences are exactly the differences in the table. The answer sits in choices[0].message.content. The usage fields are named prompt_tokens and completion_tokens. The client takes a base URL. Everything else, the messages list with a role and a content string, is the same idea.

### Way 3: a local model with Ollama

Ollama is a free program that downloads open models and runs them on your computer. Install it from the Ollama website, then pull a small model. The model llama3.2 has 3 billion parameters and takes about 2 gigabytes (GB) of disk. It runs on a laptop with 8 GB of memory.

:::code
lang: bash
ollama pull llama3.2
ollama run llama3.2 "Say hello in five words."
:::

:::code
lang: text
Hello there, nice to meet you!
:::

Ollama starts a server on your computer that listens on port 11434. The ollama Python package talks to that server. The script is the shortest of the three.

:::code
lang: python
file: chat/hello_ollama.py
import time
import ollama

MODEL = "llama3.2"
PROMPT = "Write one sentence that welcomes a customer to a small bakery called Crumb."

start = time.time()
response = ollama.chat(model=MODEL, messages=[{"role": "user", "content": PROMPT}])
seconds = time.time() - start

print(response.message.content)
print(f"input tokens: {response.prompt_eval_count}")
print(f"output tokens: {response.eval_count}")
print(f"time: {seconds:.1f} s")
:::

:::code
lang: text
Welcome to Crumb, where we bake with love every day!
input tokens: 31
output tokens: 14
time: 2.6 s
:::

The input token count differs from the Claude run, 31 against 23, although the prompt is the same. Each model has its own tokenizer, the program that cuts text into tokens, so the same sentence becomes a different number of tokens. Token counts are only comparable within one model.

### Compare the three

Write one script that runs all three and prints a table. It imports nothing new; it calls the same three methods.

:::code
lang: python
file: chat/compare.py
import time
import ollama
from anthropic import Anthropic
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
PROMPT = "Write one sentence that welcomes a customer to a small bakery called Crumb."

def via_claude():
    r = Anthropic().messages.create(model="claude-sonnet-5-5", max_tokens=200,
                                    messages=[{"role": "user", "content": PROMPT}])
    text = "".join(b.text for b in r.content if b.type == "text")
    return text, r.usage.input_tokens, r.usage.output_tokens

def via_compatible():
    c = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")
    r = c.chat.completions.create(model="llama3.2", max_tokens=200,
                                  messages=[{"role": "user", "content": PROMPT}])
    return r.choices[0].message.content, r.usage.prompt_tokens, r.usage.completion_tokens

def via_ollama():
    r = ollama.chat(model="llama3.2", messages=[{"role": "user", "content": PROMPT}])
    return r.message.content, r.prompt_eval_count, r.eval_count

for name, fn in [("claude", via_claude), ("compatible", via_compatible), ("ollama", via_ollama)]:
    start = time.time()
    text, tokens_in, tokens_out = fn()
    print(f"{name:11s} {time.time() - start:4.1f} s  in={tokens_in:3d} out={tokens_out:3d}  {text[:60]}")
:::

:::code
lang: text
claude       1.4 s  in= 23 out= 24  Welcome to Crumb, where every loaf is baked fresh this morn
compatible   2.5 s  in= 31 out= 16  Welcome to Crumb Bakery, where warm bread and friendly smil
ollama       2.4 s  in= 31 out= 14  Welcome to Crumb, where we bake with love every day!
:::

The timeline shows where the time goes. The cloud call spends most of its time on the network and on a queue at the provider, and the model itself is fast. The local calls spend no time on the network, but a 3 billion parameter model on a laptop writes tokens more slowly than a large model on a data centre GPU.

:::timeline
title: Where 1.4 s and 2.4 s go
lane Script
lane Claude API
lane Ollama
Script -> Claude API: request @0
Claude API: queue and read @0-4
Claude API: write 24 tokens @4-12
Claude API -> Script: response @14
Script -> Ollama: request @14
Ollama: load and read @14-20
Ollama: write 14 tokens @20-37
Ollama -> Script: response @38
:::

The units on the timeline are tenths of a second. Your numbers will differ with your network, your laptop and the load on the provider, and the same prompt gives a different sentence each run. The pattern holds: cloud calls are fast and cost a fraction of a cent; local calls are free, private and slower, with shorter and plainer answers from a small model.

### Which way to use when

Use the Anthropic SDK when the answer quality matters and the prompt may leave your computer. That is most of this track. Use the OpenAI-compatible script when you want to swap providers without touching code, or to reach Ollama from code that was written for a hosted provider. Use Ollama directly when the data must stay on your disk, when you have no internet, or when you want to run a model you trained yourself. Module 5 does exactly that with the fine-tuned model. The service in module 6 adds a routing rule that sends easy requests to a cheap model and hard ones to a strong one, which only works because this lesson made the model a replaceable part.

## Try it

:::exercise
title: Change the prompt and watch the numbers
task: Edit PROMPT in chat/hello_claude.py so that the model writes three sentences instead of one. Run the script. Write down the new output token count and compute the cost of the request with the prices 2 dollars and 10 dollars per million tokens. Then set max_tokens to 20, run again, and read the stop_reason field by printing response.stop_reason.
hint: Three sentences are about 70 output tokens. With max_tokens at 20 the model is cut off, and stop_reason changes from end_turn to max_tokens.
lang: python
solution:
PROMPT = "Write three sentences that welcome a customer to a small bakery called Crumb."
# output tokens: about 70
# cost: 25 * 2 / 1_000_000 + 70 * 10 / 1_000_000 = 0.00005 + 0.0007 = about 0.00075 dollars

# with max_tokens=20:
print(response.stop_reason)
# max_tokens   (the text ends mid sentence)
:::

:::exercise
title: Make the compatible script reach the cloud
task: The script chat/hello_compatible.py reads COMPAT_BASE_URL, COMPAT_API_KEY and COMPAT_MODEL from .env. Pick one hosted provider that offers an OpenAI-compatible endpoint, find its base URL and a model name in its documentation, create a key, and add the three lines to .env. Run the script without changing any code. Then remove the three lines and confirm that the script falls back to Ollama.
hint: Many providers publish a base URL that ends in /v1. The key goes in .env, never in the script. If the provider rejects max_tokens, its documentation names the parameter it expects instead.
lang: text
solution:
# .env, three new lines (example values, replace with the provider's own)
COMPAT_BASE_URL=https://api.example-provider.com/v1
COMPAT_API_KEY=your-provider-key
COMPAT_MODEL=the-model-name-from-their-docs

# run
python -m chat.hello_compatible
# the answer comes from the hosted model; remove the lines and it comes from llama3.2 again
:::

## Common mistakes

- Mistake: you read response.content as a string and get an error. Fix: it is a list of blocks; loop over it and keep the blocks whose type is text.
- Mistake: you set max_tokens to 10 to save money and get half a sentence. Fix: max_tokens is a ceiling, not a target; give room for the whole answer and check stop_reason.
- Mistake: the Ollama script fails with a connection refused error. Fix: the Ollama server is not running; start the Ollama app or run ollama serve, and pull the model first.
- Mistake: you compare token counts between Claude and llama3.2 and conclude one prompt is longer. Fix: each model has its own tokenizer; compare counts only within one model.
- Mistake: you paste the key into the script as a string so it works without .env. Fix: load_dotenv and the environment variable keep the key out of code and out of git.

## Check your understanding

:::quiz
title: Check: call a model
q: A request to claude-sonnet-5-5 uses 500 input tokens and 100 output tokens. At 2 and 10 dollars per million tokens, what does it cost?
- 0.0006 dollars
* 0.002 dollars
- 0.02 dollars
why: 500 times 2 over a million is 0.001, and 100 times 10 over a million is 0.001; the sum is 0.002 dollars.
q: You want the same script to reach a hosted provider today and Ollama tomorrow without editing code. Which way fits?
- The Anthropic SDK
* The OpenAI-compatible script with the base URL in .env
- Ollama directly
why: The base URL and model name live in the environment, so a change to .env moves the request to a different server.
q: response.stop_reason is max_tokens. What happened?
- The API rejected the key
- The model finished the sentence early
* The model hit the max_tokens ceiling before it finished
why: max_tokens is the most output tokens allowed, and the stop reason reports that the limit ended the answer.
q: A clinic wants a model to summarise patient notes, and the notes must never leave the building. Which way do you choose?
- The Anthropic SDK, because quality is highest
* Ollama with a local model, because the prompt stays on the disk
- The OpenAI-compatible script pointed at a hosted provider
why: Only the local model keeps the data on the clinic's own computer; both other ways send the prompt over the internet.
q: The same prompt is 23 tokens for Claude and 31 tokens for llama3.2. Why?
- The Ollama script added a system prompt
* Each model has its own tokenizer, so it cuts the same text into a different number of pieces
- Local models count characters, not tokens
why: Tokenizers differ between model families; the count is a property of the model, not of the text alone.
:::

## Go further

The Messages API reference lists every field a request can carry, including the system prompt and the tools that module 4 uses. The Anthropic Python SDK README shows streaming, which the next module adds. The Ollama API document describes the local server that both of the last two scripts talk to, and the Ollama Python repository shows the ollama.chat options. The next module, [A chat loop in the terminal](/courses/build-ai-ecosystem/chat-application/chat-loop), takes chat/hello_claude.py and wraps it in a loop that keeps the messages list between turns.
`,
    },
  ],
}
