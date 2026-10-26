import type { Module } from '../../types'

export const mod: Module = {
  slug: 'builders-tools',
  title: 'Tools every builder uses',
  description: 'The terminal, Git and GitHub, APIs and JSON, keys and environment variables, and Docker: the five tools you use in every AI project.',
  level: 'foundations',
  lessons: [
    {
      slug: 'terminal-commands',
      title: 'The terminal: the twelve commands you need',
      summary: 'After this lesson you can move around your computer, make and inspect files, and join commands with a pipe, all from the terminal.',
      minutes: 22,
      objectives: [
        'Explain what the shell does when you type a command and press Enter.',
        'Run the twelve commands pwd, ls, cd, mkdir, touch, cat, cp, mv, rm, which, echo and head.',
        'Write the output of one command into a file with > and into another command with a pipe.',
        'Explain how the PATH variable lets the shell find the python program.',
      ],
      keyTerms: ['shell', 'command', 'working-directory', 'path', 'pipe', 'path-variable', 'folder'],
      body: `
## What this lesson covers

This lesson teaches you the terminal, the text window where you type commands to the computer. You learn twelve commands that cover almost all daily work: moving between folders, making files, looking inside them, copying, moving and deleting. You also learn two small symbols, the greater-than sign and the vertical bar, that join commands together. At the end you can build a small project folder without touching the mouse.

## Why it matters

Every tool in the rest of this module runs from the terminal: Git, the requests library, environment variables and Docker. Every AI project you build later starts with a command such as python train.py or docker run. If the terminal feels strange, each of those steps feels strange too. If the terminal feels normal, they become routine. The next lesson, [Git and GitHub](/courses/start-here/builders-tools/git-and-github), uses the folder you build here and adds a history to it.

:::video
id: I4EWvMFj37g
why: Watch all 100 seconds. The video names the shell, shows commands such as ls and cd, and shows a pipe. You will see each of these again in this lesson.
:::

## The idea with an example

> **Analogy.** A terminal is a conversation with a very literal assistant who cannot see your screen. The assistant stands in one room of your house at a time. You say "list what is here", and the assistant reads out the items in that room. You say "go to the kitchen", and the assistant walks there. The assistant never guesses. If you say "open the red folder" and there is no red folder, the assistant says so and waits.

The terminal is a program that shows a text window. Inside the window runs the shell, the program that reads what you type and runs it. On macOS the terminal app is called Terminal and the shell is called zsh. On Linux the shell is usually bash. On Windows, install Git for Windows and use the Git Bash window, so that the commands in this lesson work the same way. A command is one instruction: a program name, then optional arguments, then the Enter key.

The shell always stands in one folder, called the working directory. Every command that names a file looks in that folder first. Here is the running example for this lesson. You make a project folder called weather, put a data file and a Python file in it, and check your work. You use only the terminal.

:::flow
title: What happens when you type a command
You -> Shell: ls notes
Shell -> PATH folders: find the program ls
PATH folders -> Shell: /bin/ls
Shell -> ls program: run with argument notes
ls program -> Screen: prints the file names
:::

Open the terminal. The shell shows a prompt, often a dollar sign or a percent sign, and waits. Type pwd and press Enter. The name means print working directory. The shell prints something like /Users/ada. That is your home folder, the room where the assistant starts. Now follow the steps below. The panel shows where the shell stands after each one.

:::scenario
title: Build the weather folder from the terminal
state: directory=/Users/ada, files=none yet
step: Type mkdir weather and press Enter. The shell makes a new empty folder called weather inside the home folder.
state: files=weather/
step: Type cd weather. The shell moves into the folder. pwd now prints /Users/ada/weather.
state: directory=/Users/ada/weather
step: Type touch app.py. The shell creates an empty file called app.py in the working directory.
state: files=app.py
step: Type echo "city,temp" > cities.csv. The shell writes the text city,temp into a new file called cities.csv.
state: files=app.py cities.csv
step: Type ls. The shell lists the two files: app.py and cities.csv.
step: Type cat cities.csv. The shell prints the one line inside the file: city,temp.
:::

Six commands made a folder, entered it, created two files and checked them. The mouse did nothing. Notice the pattern in every line: the first word is the program, the rest are arguments. In mkdir weather, the program is mkdir and the argument is weather. In echo "city,temp" > cities.csv, the program is echo and the argument is the text. The greater-than sign sends the output into a file instead of the screen.

## How it works

The shell does the same four things for every command. First, it splits your line into words. Second, it finds the program named by the first word. Third, it runs that program with the other words as arguments. Fourth, it prints whatever the program outputs and shows the prompt again.

:::anim
title: What the shell does with one command
text cmd "cat cities.csv" @ 480,110 size: 26 color: yellow
rect w1 @ 430,110 size: 90x44 "cat" color: blue
rect w2 @ 580,110 size: 170x44 "cities.csv" color: blue
box shell "Shell" @ 170,330 icon: terminal
text pathtxt "PATH = /usr/local/bin:/usr/bin:/bin" @ 640,270 size: 16 color: grey
rect f1 @ 420,330 size: 170x50 "/usr/local/bin"
rect f2 @ 630,330 size: 130x50 "/usr/bin"
rect f3 @ 810,330 size: 110x50 "/bin"
box prog "cat program" @ 480,460 icon: program
box file "cities.csv" @ 790,460 icon: file
box screen "Screen" @ 170,460 icon: screen
text wd "working directory: /Users/ada/weather" @ 790,395 size: 15 color: grey

step: You type cat cities.csv and press Enter. The shell reads the whole line.
  show cmd, shell
  pulse shell
step: First, the shell splits the line into words: the program name cat, then one argument, cities.csv.
  show w1, w2
  move w1 -> 420,200
  & move w2 -> 580,200
step: Second, it finds the program. It checks each PATH folder in order: not here, not here, found in /bin.
  show pathtxt, f1, f2, f3
  arrow shell -> f1 : cat?
  color f1 grey
  arrow f1 -> f2 : cat?
  color f2 grey
  arrow f2 -> f3 : cat?
  color f3 green
  label f3 "/bin/cat"
step: Third, it runs the program /bin/cat and passes the argument cities.csv to it.
  show prog
  arrow f3 -> prog : run
  move w2 -> 480,460 (1.5s)
  hide w2, w1, f1, f2
step: The program looks for cities.csv in the working directory, /Users/ada/weather, and reads its one line.
  show wd, file
  arrow prog -> file : open
  arrow file -> prog : city,temp
step: Fourth, the shell prints the output on the screen and shows the prompt again.
  show screen
  arrow prog -> screen : city,temp
  highlight screen
:::

### The twelve commands

The table lists the commands with the running example. Type each one in your weather folder.

| Command | What it does | Example | Result |
| --- | --- | --- | --- |
| pwd | prints the working directory | pwd | /Users/ada/weather |
| ls | lists the files in a folder | ls -l | the files with sizes and dates |
| cd | changes the working directory | cd .. | moves up to /Users/ada |
| mkdir | makes a folder | mkdir data | a new folder data |
| touch | makes an empty file | touch notes.txt | a new 0-byte file |
| cat | prints the contents of a file | cat cities.csv | city,temp |
| cp | copies a file | cp cities.csv backup.csv | a second identical file |
| mv | moves or renames a file | mv backup.csv data/old.csv | the file moves into data |
| rm | deletes a file, for ever | rm data/old.csv | the file is gone |
| which | shows where a program lives | which python3 | /usr/bin/python3 |
| echo | prints text | echo hello | hello |
| head | prints the first lines of a file | head -2 cities.csv | the first 2 lines |

Two of these need extra care. The command rm does not move a file to a trash can. It deletes the file at once, and no undo exists. Type the name slowly and read it before you press Enter. The command cd .. means go to the parent folder, the folder that contains the current one. The two dots always mean the parent. A single dot means the current folder.

### Paths: absolute and relative

A path is the address of a file or folder, written as the folder names from the top down. The lesson [Files, folders and the operating system](/courses/start-here/how-a-computer-works/files-folders-os) introduced it. The shell accepts two kinds. An absolute path starts at the root, the top of the whole disk, and begins with a slash: /Users/ada/weather/app.py. A relative path starts from the working directory and has no leading slash: app.py or data/old.csv. The same file has one absolute path but a different relative path from every folder.

Here is the running example again. When the working directory is /Users/ada/weather, the file app.py has the relative path app.py. When the working directory is /Users/ada, the same file has the relative path weather/app.py. The command python app.py fails from the home folder, with the message No such file or directory, because no app.py exists there. This is the most common terminal error. The fix is always the same: run pwd, read the answer, and cd to the right place.

On Windows, absolute paths start with a drive letter and use backslashes, such as C:\\Users\\ada\\weather. Git Bash accepts both forms, so /c/Users/ada/weather also works. A tilde is a short name for your home folder on every system: cd ~ takes you home from anywhere.

### The greater-than sign and the pipe

Every program writes its output to a place called standard output, which is the screen by default. Two symbols change where that output goes. The greater-than sign writes the output into a file. The vertical bar, called a pipe, sends the output into the input of the next command.

:::code
lang: bash
file: in the weather folder
echo "city,temp" > cities.csv
echo "Lima,19" >> cities.csv
echo "Oslo,4" >> cities.csv
echo "Cairo,31" >> cities.csv
cat cities.csv | head -2
cat cities.csv | wc -l
:::

:::code
lang: text
city,temp
Lima,19
4
:::

Read the six lines slowly. A single greater-than sign creates the file, or empties it if it exists. A double greater-than sign appends to the end. After four echo commands, cities.csv has 4 lines. The fifth command pipes those 4 lines into head -2, which prints only the first 2. The sixth command pipes them into wc -l, where wc means word count and -l asks for lines; it prints 4. Nothing was saved in between. The pipe moved the text straight from one program to the next.

### How the shell finds a program: PATH

When you type python3, the shell must find a file called python3 somewhere on the disk. It does not search the whole disk. It reads an environment variable called PATH, a list of folders separated by colons. The shell checks each folder in order and runs the first match. A typical value is /usr/local/bin:/usr/bin:/bin. The command which python3 prints the folder where the shell found the program. The command echo, with the argument PATH written after a dollar sign, prints the whole list.

This explains a message that every beginner meets: command not found. It means that no folder in PATH contains a program with that name. Either the program is not installed, or its folder is not in the list. Installers for Python and Git usually add their folder to PATH for you. When they do not, the installer documentation tells you which line to add. The lesson [Keys, secrets and environment variables](/courses/start-here/builders-tools/secrets-and-env) returns to environment variables in general.

### Three habits that save time

1. Press the Tab key after typing the first letters of a file name. The shell completes the name. Press Tab twice to see all matches.
2. Press the up arrow to bring back the previous command. Edit it and press Enter.
3. Type clear to clean the screen. Type exit to close the shell.

## Try it

:::exercise
title: Build and inspect a project folder
task: In your home folder, make a folder called weather with a folder data inside it. Put a file cities.csv in data with the 4 lines from the lesson. Make an empty app.py next to the data folder. Then, from inside the weather folder, print the first 2 lines of the data file and count its lines. Finally, list the whole tree with ls data and ls.
hint: Use mkdir -p weather/data to make both folders in one command. Use echo with a double greater-than sign to append lines. Remember that head and wc need the relative path data/cities.csv.
lang: bash
solution:
cd ~
mkdir -p weather/data
cd weather
touch app.py
echo "city,temp" > data/cities.csv
echo "Lima,19" >> data/cities.csv
echo "Oslo,4" >> data/cities.csv
echo "Cairo,31" >> data/cities.csv
head -2 data/cities.csv
cat data/cities.csv | wc -l
ls data
ls
:::

:::exercise
title: Find your Python
task: Use which to find where python3 lives on your computer. Then print your PATH and find that folder in the list. Write down the position of the folder in the list, counting from 1.
hint: On Windows Git Bash, the program may be called python instead of python3. The folders in PATH are separated by colons.
lang: bash
solution:
which python3
echo $PATH
# Example output: /usr/bin/python3, and /usr/bin is the second folder in PATH.
:::

## Common mistakes

- Mistake: you run python app.py from the wrong folder and see No such file or directory. Fix: type pwd, read the answer, and cd into the folder that holds app.py.
- Mistake: you use a single greater-than sign to add a line and the file loses its old content. Fix: a single sign replaces the file; a double sign appends to it.
- Mistake: you type rm and expect the file to go to the trash. Fix: rm deletes the file at once; read the name twice before you press Enter.
- Mistake: you see command not found and reinstall the program three times. Fix: the program is usually installed; its folder is missing from PATH. Run which and check the installer notes.
- Mistake: you type a file name with a space and the shell treats it as two arguments. Fix: put the name in double quotes, or avoid spaces in file names.

## Check your understanding

:::quiz
title: Check: the terminal
q: The working directory is /Users/ada. You type cd weather and then cd data. What does pwd print?
- /Users/ada
- /Users/ada/data
* /Users/ada/weather/data
why: Each cd moves relative to the current folder, so the shell ends up two levels down.
q: The file cities.csv has 4 lines. What does cat cities.csv | head -2 | wc -l print?
- 4
* 2
- 1
why: head keeps the first 2 lines, and wc -l counts those 2 lines.
q: You run echo "Oslo,4" > cities.csv on a file that already has 3 lines. How many lines does it have now?
* 1
- 3
- 4
why: A single greater-than sign replaces the whole file with the new output; only the double sign appends.
q: You type python3 and the shell prints command not found. Which statement is most likely true?
- The file app.py does not exist
- You are in the wrong working directory
* No folder in PATH contains a program called python3
why: The shell finds programs by searching the PATH folders; a missing program or a missing folder in PATH gives this message.
q: Which command renames notes.txt to readme.txt?
- cp notes.txt readme.txt
* mv notes.txt readme.txt
- touch readme.txt
why: mv moves a file to a new name or place; cp would leave the original in place as well.
:::

## Go further

The links below include the free Linux command line book, which goes deeper into every command here, and the official Bash guide. You do not need to read them now. The next lesson, [Git and GitHub](/courses/start-here/builders-tools/git-and-github), takes the weather folder you built and gives it a history. You can then see every change and never lose work again.
`,
      links: [
        { label: 'The Linux Command Line (free book)', url: 'https://linuxcommand.org/tlcl.php', kind: 'article' },
        { label: 'Bash Reference Manual', url: 'https://www.gnu.org/software/bash/manual/bash.html', kind: 'docs' },
        { label: 'Git for Windows (includes Git Bash)', url: 'https://gitforwindows.org/', kind: 'docs' },
        { label: 'Linux in 100 Seconds', url: 'https://www.youtube.com/watch?v=rrB13utjYV4', kind: 'video' },
      ],
    },
    {
      slug: 'git-and-github',
      title: 'Git and GitHub',
      summary: 'After this lesson you can save snapshots of a project with Git, read its history, work on a branch, and keep a copy on GitHub.',
      minutes: 24,
      objectives: [
        'Explain why version control beats copies of files with names such as final_v3.',
        'Run git init, git add, git commit and git log on a folder.',
        'Create a branch, make a commit on it and merge it back into main.',
        'Push a repository to GitHub, clone it, and pull new commits.',
        'Write a .gitignore file that keeps secrets and junk out of the repository.',
      ],
      keyTerms: ['version-control', 'repository', 'commit', 'branch', 'remote', 'gitignore'],
      body: `
## What this lesson covers

This lesson teaches Git, the tool that records every saved version of a project. It also teaches GitHub, the website that stores a copy of that record online. You learn eight commands: init, add, commit, log, branch, push, clone and pull. You also learn the .gitignore file, which keeps secrets and junk out of the record. At the end you can turn any folder into a repository, save your work in steps, and share it.

## Why it matters

Every AI project on this site lives in a Git repository. When you fine-tune a model in a later track, you will change a training script twenty times. Git lets you see which change made the loss go down, and go back when a change made it worse. GitHub is also where you download other people's code and where you show your own. The next lesson, [APIs and JSON](/courses/start-here/builders-tools/apis-and-json), adds a Python file to this repository that talks to a server. First you need a safe place to keep that file.

:::video
id: hwP7WQkmECE
why: Watch all 100 seconds. The video shows commits as snapshots and branches as separate lines of work. The same two pictures appear in this lesson with real commands.
:::

## The idea with an example

> **Analogy.** Git is a photo album for your project. Every time you reach a point worth keeping, you take a photo of every file and write a caption. The album keeps the photos in order with the date and your name. You can open any old photo and see the project exactly as it was. A branch is a second album for an experiment. If the experiment works, you paste its photos into the main album. If it fails, you throw the second album away and the main album is untouched.

Version control is a system that records every saved version of a project. Without it, people keep copies: report_final.docx, report_final_v2.docx, report_final_v2_REAL.docx. Nobody knows which copy is current or what changed between them. Git replaces the copies with one folder and a hidden history.

Here is the running example. You continue the weather folder from the last lesson. It holds app.py, which is empty, and data/cities.csv, which has 4 lines. You turn the folder into a repository, make three commits, try an experiment on a branch, and push the result to GitHub. Each commit has a short id. Real ids are 40 characters long; this lesson shows the first 7, which is what git log shows too.

:::flow
title: The three places a file passes through
Working folder -> Staging area: git add app.py
Staging area -> Local history: git commit -m "message"
Local history -> GitHub: git push
GitHub -> Local history: git pull
:::

A file moves through three places. The working folder is where you edit. The staging area is a waiting room where you choose which changes go into the next snapshot. The local history is the album of commits, stored in a hidden folder called .git. GitHub is a fourth place, a copy of the history on a server. Press Next to make the first commits.

:::scenario
title: The first three commits of the weather project
state: commits=0, branch=main, staged=nothing
step: In the weather folder, run git init. Git creates the hidden .git folder. The repository exists but has no commits.
state: commits=0
step: Run git add app.py data/cities.csv. Both files enter the staging area. Nothing is saved yet.
state: staged=app.py data/cities.csv
step: Run git commit -m "Add empty app and city data". Git saves a snapshot with id a1f3c9e. The staging area empties.
state: commits=1 (a1f3c9e), staged=nothing
step: Edit app.py so it prints the contents of data/cities.csv. Run git status. Git reports app.py as modified.
state: modified=app.py
step: Run git add app.py and then git commit -m "Print the city table". Git saves commit b7d02e4, whose parent is a1f3c9e.
state: commits=2 (b7d02e4), staged=nothing
step: Create .gitignore with the line .env inside. Add it and commit with the message "Ignore secrets". That is commit c92e1a0.
state: commits=3 (c92e1a0)
step: Run git log --oneline. Git prints the three commits, newest first: c92e1a0, b7d02e4, a1f3c9e.
:::

Three commits, three captions, one folder. The command git log --oneline shows one line per commit with the short id and the message. Each commit remembers its parent, so the history is a chain. If you delete every line of app.py tomorrow by accident, the command git restore app.py brings back the version from the last commit.

## How it works

Git works in a fixed rhythm: edit, add, commit, repeat. The table lists the eight commands of this lesson with the running example.

:::anim
title: A file passes through three places, and the commits form a chain
box work "Working folder" @ 170,150 icon: file
box stage "Staging area" @ 480,150 icon: queue
box hist "History (.git)" @ 790,150 icon: database
rect app @ 170,260 size: 150x50 "app.py" color: blue
rect csv @ 170,330 size: 160x50 "data/cities.csv" color: blue
rect c1 @ 790,260 size: 120x50 "a1f3c9e" color: yellow
rect c2 @ 790,340 size: 120x50 "b7d02e4" color: yellow
rect c3 @ 790,420 size: 120x50 "c92e1a0" color: yellow
box hub "GitHub (origin)" @ 480,450 icon: cloud
text log "git log --oneline:|newest first" @ 715,300 size: 15 color: grey anchor: end

step: A file passes through three places. You edit in the working folder, which holds app.py and data/cities.csv.
  show work, stage, hist, app, csv
step: git add copies both files into the staging area, the waiting room. Nothing is saved yet.
  arrow work -> stage : git add
  & move app -> 480,260
  & move csv -> 480,330
step: git commit saves a snapshot of the staged files. Commit a1f3c9e enters the history; the staging area empties.
  arrow stage -> hist : git commit -m
  & move app -> 790,260
  & move csv -> 790,260
  hide app, csv
  show c1
step: You edit app.py and add it again. git status reports it as modified, waiting in the staging area.
  label app "app.py, edited"
  color app orange
  move app -> 170,260 (0.1s)
  show app
  wait 0.5
  send work -> stage : git add app.py
  & move app -> 480,260
step: The second commit b7d02e4 remembers its parent a1f3c9e, so the history is a chain.
  send stage -> hist : git commit -m
  & move app -> 790,340
  hide app
  show c2
  arrow c2 -> c1 : parent
step: A third commit, c92e1a0, adds .gitignore. git log --oneline prints the chain, newest first.
  show c3
  arrow c3 -> c2 : parent
  show log
step: git push sends the chain to GitHub, the remote copy named origin. git pull brings new commits back.
  show hub
  arrow c3 -> hub : git push
  arrow hub -> c3 : git pull
  highlight hub
:::

| Command | What it does | Example |
| --- | --- | --- |
| git init | turns the current folder into a repository | git init |
| git add | puts changed files into the staging area | git add app.py |
| git commit | saves a snapshot of the staged files with a message | git commit -m "Print the city table" |
| git log | lists the commits, newest first | git log --oneline |
| git branch | creates or lists branches | git branch add-chart |
| git push | sends local commits to the remote | git push origin main |
| git clone | copies a remote repository to your computer | git clone https://github.com/ada/weather.git |
| git pull | brings new commits from the remote to your computer | git pull |

Two helpers appear in almost every session. The command git status tells you which files are modified, staged or untracked. Run it whenever you are unsure. The command git diff shows the exact lines that changed since the last commit. Set your name and email once before the first commit, because Git writes them into every snapshot.

:::code
lang: bash
file: one-time setup, then the first commit
git config --global user.name "Ada Lovelace"
git config --global user.email "ada@example.com"
cd ~/weather
git init
git add app.py data/cities.csv
git commit -m "Add empty app and city data"
git log --oneline
:::

:::code
lang: text
Initialized empty Git repository in /Users/ada/weather/.git/
[main (root-commit) a1f3c9e] Add empty app and city data
 2 files changed, 4 insertions(+)
a1f3c9e Add empty app and city data
:::

### Branches

A branch is a named line of commits. A new repository has one branch, usually called main. When you want to try something without risk, you make a second branch, commit on it, and merge it back when it works. In the running example you want to add a chart to app.py but you are not sure it will work.

:::code
lang: bash
file: an experiment on a branch
git switch -c add-chart
# edit app.py, add the chart code
git add app.py
git commit -m "Draw a bar chart of temperatures"
git switch main
git merge add-chart
git log --oneline
:::

The first command creates the branch add-chart and moves you onto it. The commit d44e7b1 lands on add-chart; main still ends at c92e1a0. When you switch back to main, app.py returns to the version without the chart, because main does not have the new commit. The merge brings d44e7b1 into main. If the chart had been a failure, you could run git branch -D add-chart and main would never know.

The timeline shows the two lines of work over the whole example.

:::timeline
title: Commits on main and on the add-chart branch
lane main
lane add-chart
main: a1f3c9e @0-1
main: b7d02e4 @1-2
main: c92e1a0 @2-3
main -> add-chart: git switch -c @3
add-chart: d44e7b1 @3-5
add-chart -> main: git merge @5
main: merge @5-6
:::

### GitHub: the remote copy

GitHub is a website that stores repositories. A copy of your repository on GitHub is called a remote, and Git names it origin by default. The remote is a backup, a place to share, and the way a team works on one project. Make an account at github.com, press New repository, name it weather and leave it empty. GitHub then shows the two commands to connect your folder.

:::code
lang: bash
file: connect the folder to GitHub, then push
git remote add origin https://github.com/ada/weather.git
git push -u origin main
:::

After the push, open github.com/ada/weather in the browser. The three files and the four commits are there. From now on, git push sends new commits up and git pull brings new commits down. On another computer, git clone https://github.com/ada/weather.git creates a full copy with the whole history. The first push asks for a login; GitHub gives you a personal access token to type instead of your password.

### The .gitignore file

Git tracks every file you add, and git add . adds everything in the folder. Some files must never enter the history. A .gitignore file lists them, one path or pattern per line. Git skips matching files when you add.

:::code
lang: text
file: .gitignore
.env
.venv/
__pycache__/
*.pyc
data/large/
:::

The first line is the important one. The next lesson but one, [Keys, secrets and environment variables](/courses/start-here/builders-tools/secrets-and-env), puts an API key in a file called .env. A key that reaches GitHub is public within minutes, and people run programs that scan every new commit for keys. Write the .gitignore file in your first commit, before the key exists. The other lines skip the virtual environment folder, the cache files Python makes, and large data files that do not belong in a code repository.

### Reading the history

The command git log --oneline prints the chain. The command git show b7d02e4 prints the message and every changed line of one commit. The command git diff a1f3c9e c92e1a0 prints every line that differs between two commits. When a training run in a later track suddenly gets worse, these three commands tell you which change did it.

## Try it

:::exercise
title: Turn the weather folder into a repository
task: In your weather folder from the last lesson, make the three commits from the running example, including a .gitignore that contains the line .env. Then make a branch called add-greeting, change app.py so it prints the word Welcome, commit on the branch, merge it into main and print the history. The history must show 4 commits.
hint: The rhythm is add, commit, repeat. Use git status whenever you are unsure what is staged. Use git switch -c to create and move to the branch in one command.
lang: bash
solution:
cd ~/weather
git init
git add app.py data/cities.csv
git commit -m "Add empty app and city data"
echo 'print(open("data/cities.csv").read())' > app.py
git add app.py
git commit -m "Print the city table"
echo ".env" > .gitignore
git add .gitignore
git commit -m "Ignore secrets"
git switch -c add-greeting
echo 'print("Welcome")' >> app.py
git add app.py
git commit -m "Print a welcome line"
git switch main
git merge add-greeting
git log --oneline
:::

:::exercise
title: Push to GitHub and clone it back
task: Create an empty repository called weather on GitHub. Connect your folder to it and push. Then, in a different folder such as ~/tmp, clone the repository and run git log --oneline inside the clone. The clone must show the same 4 commits.
hint: GitHub shows the exact git remote add line after you create the repository. The clone address ends in .git.
lang: bash
solution:
cd ~/weather
git remote add origin https://github.com/YOUR-NAME/weather.git
git push -u origin main
mkdir -p ~/tmp
cd ~/tmp
git clone https://github.com/YOUR-NAME/weather.git
cd weather
git log --oneline
:::

## Common mistakes

- Mistake: you edit a file and run git commit, and Git says nothing to commit. Fix: a commit saves only staged files; run git add first.
- Mistake: you write a commit message such as "changes" or "fix". Fix: say what changed and why, in one line, such as "Print the city table".
- Mistake: you run git add . before writing .gitignore and your .env file enters the history. Fix: write .gitignore in the first commit; if a key is already committed, revoke the key at the provider.
- Mistake: you commit a 2 GB data file and every clone takes an hour. Fix: keep large data out of Git; list the folder in .gitignore and share the data another way.
- Mistake: you work for a week without pushing and your laptop breaks. Fix: push at the end of every session; the remote is your backup.

## Check your understanding

:::quiz
title: Check: Git and GitHub
q: You change app.py and run git commit -m "Update app" without git add. What happens?
- Git saves the change
* Git saves nothing and says there are no staged changes
- Git deletes the change
why: The commit takes the files in the staging area, and git add is the command that puts them there.
q: The history on main is a1f3c9e, b7d02e4, c92e1a0. You create branch test, make one commit, and switch back to main. How many commits does git log show on main?
* 3
- 4
- 1
why: A commit on a branch stays on that branch until you merge it; main still ends at c92e1a0.
q: Which line in .gitignore protects an API key stored in a file called .env?
- *.pyc
* .env
- data/
why: Git skips any file that matches a line in .gitignore, so the line .env stops that file from ever being added.
q: Your colleague pushed 2 commits to GitHub. Which command brings them to your computer?
- git push
- git clone
* git pull
why: pull fetches new commits from the remote and merges them into your branch; clone is only for making a new copy.
q: A key was in a commit that you pushed 10 minutes ago. What is the first thing to do?
- Delete the commit locally
* Revoke the key at the provider and make a new one
- Make the repository private
why: Scanners copy keys from public commits within minutes; a revoked key is useless to them, and the other steps come after.
:::

## Go further

The links include the free Pro Git book, the GitHub documentation and a one-hour crash course video. Chapter 2 of Pro Git covers everything in this lesson with more detail. The next lesson, [APIs and JSON](/courses/start-here/builders-tools/apis-and-json), writes a real app.py that fetches the temperature of a city from a server. You commit that file to this repository.
`,
      links: [
        { label: 'Pro Git book (free)', url: 'https://git-scm.com/book/en/v2', kind: 'article' },
        { label: 'GitHub Docs: Get started', url: 'https://docs.github.com/en/get-started', kind: 'docs' },
        { label: 'Git and GitHub crash course', url: 'https://www.youtube.com/watch?v=RGOj5yH7evk', kind: 'video' },
        { label: 'gitignore documentation', url: 'https://git-scm.com/docs/gitignore', kind: 'docs' },
      ],
    },
    {
      slug: 'apis-and-json',
      title: 'APIs and JSON',
      summary: 'After this lesson you can call a web API from Python with the requests library, check the status code, and read the JSON it returns.',
      minutes: 24,
      objectives: [
        'Explain what an API is and how it differs from a web page.',
        'Name the four HTTP methods and the meaning of status codes 200, 401, 404, 429 and 500.',
        'Run a GET request with the requests library and print the status code and headers.',
        'Read a value out of a nested JSON response with Python dictionaries and lists.',
        'Explain what a rate limit is and what to do when you hit one.',
      ],
      keyTerms: ['api', 'endpoint', 'http-method', 'status-code', 'header', 'rate-limit', 'request', 'response'],
      body: `
## What this lesson covers

This lesson teaches you how a Python program asks a server for data. The address a program calls is an application programming interface (API). You learn the shape of a request and the meaning of the number that comes back with every response. You also learn how to read the data, which almost always arrives in a format called JSON. At the end you can fetch the current temperature of any city with 8 lines of Python.

## Why it matters

Every AI model you use from Python, whether from Anthropic, OpenAI, Hugging Face or a local server, sits behind an API. Your chat application in a later track is a program that builds a request, sends it, checks the status code and reads the JSON answer. That is exactly this lesson with a different address. The next lesson, [Keys, secrets and environment variables](/courses/start-here/builders-tools/secrets-and-env), adds the one thing a model API needs that a weather API does not: a secret key.

:::video
id: s7wmiS2mSXY
why: Watch all 3 minutes. The video uses a restaurant waiter as its picture of an API. Keep that picture in mind, because this lesson uses the same one with real requests.
:::

## The idea with an example

> **Analogy.** An API is a waiter. You do not walk into the kitchen of a restaurant. You tell the waiter what you want, in the words on the menu, and the waiter brings back a plate or a reason why not. The menu is the API documentation. It lists what you may ask for and how to ask. The kitchen is the server. The plate is the response.

A website has pages for people to read. An API has endpoints for programs to call. An endpoint is one address that does one job. The lesson [How a web page reaches you](/courses/start-here/how-a-computer-works/how-the-internet-works) showed a browser sending a request and a server returning a page. An API call is the same exchange with two differences: a program sends the request, and the response is data instead of a page.

Here is the running example. Open-Meteo is a free weather API that needs no account. You ask it for the current temperature in Lima, Peru, which sits at latitude -12.05 and longitude -77.04. The whole request is one address.

https://api.open-meteo.com/v1/forecast?latitude=-12.05&longitude=-77.04&current=temperature_2m

Read the address in four parts. The scheme https says to use encrypted HTTP. The host api.open-meteo.com names the server. The path /v1/forecast is the endpoint. Everything after the question mark is the parameters: three name and value pairs separated by ampersands. Paste the address into a browser and you see the answer, a block of text in curly braces. That text is JSON.

:::anim
title: One API call: the request goes out, the response comes back, one number comes out
text url "GET /v1/forecast?latitude=-12.05&longitude=-77.04&current=temperature_2m" @ 480,90 size: 15 color: yellow
box app "app.py" @ 170,180 icon: code
box lib "requests library" @ 480,180 icon: tool
box srv "Open-Meteo" @ 790,180 icon: server
rect bd @ 170,320 size: 150x50 "JSON body" color: blue
rect hd @ 480,320 size: 290x50 "Content-Type: application/json" color: blue
rect st @ 790,320 size: 150x50 "status 200" color: green
rect j1 @ 170,450 size: 110x50 "data"
rect j2 @ 420,450 size: 130x50 "current"
rect j3 @ 670,450 size: 190x50 "temperature_2m"
num temp = 0 @ 870,450 suffix: " C" digits: 1 size: 28 color: yellow

step: app.py builds the address from three parameters and hands it to the requests library.
  show app, url, lib
  arrow app -> lib : requests.get(url, params)
step: requests opens a connection and sends GET /v1/forecast across the internet to the Open-Meteo server.
  show srv
  arrow lib -> srv : GET /v1/forecast (2s)
step: The server looks up the forecast for latitude -12.05, longitude -77.04 and builds a JSON answer.
  highlight srv
  wait 1
  restore srv
step: The response comes back in three parts: a body, a Content-Type header and the status code 200.
  arrow srv -> lib : response (2s)
  show bd, hd, st
step: Check the status first. 200 means it worked, so the body holds data, not an error message.
  highlight st
  arrow lib -> app : Response object
step: response.json() turns the body into a Python dictionary. Follow the keys from the outside in: current.
  show j1
  arrow bd -> j1 : response.json()
  show j2
  arrow j1 -> j2 : ["current"]
step: Inside current, the key temperature_2m holds 19.3. app.py prints Lima: 19.3 C.
  show j3
  arrow j2 -> j3 : ["temperature_2m"]
  show temp
  count temp -> 19.3
  highlight temp
:::

:::flow
title: One API call from Python
app.py -> requests: GET the forecast address
requests -> Internet: HTTP request
Internet -> Open-Meteo: deliver it
Open-Meteo -> requests: status 200 and JSON body
requests -> app.py: a Response object
:::

The response has three parts: a status code, headers and a body. The status code is a 3-digit number that says whether the request worked. The headers are name and value pairs about the message, such as the format of the body. The body is the data. Press Next to follow the running example through all three.

:::scenario
title: Fetch the temperature in Lima
state: status=none, body=none
step: app.py builds the address with the three parameters and calls requests.get on it.
step: The requests library opens a connection to api.open-meteo.com and sends GET /v1/forecast with the parameters.
state: method=GET, waiting=yes
step: The server looks up the forecast for latitude -12.05 and longitude -77.04 and builds a JSON answer.
step: The server sends back status 200, a header Content-Type: application/json, and a body of about 300 characters.
state: status=200, content_type=application/json, waiting=no
step: app.py calls response.json(). The library turns the JSON text into a Python dictionary.
state: data=dictionary with keys latitude, longitude, current_units, current
step: app.py reads data["current"]["temperature_2m"] and gets 19.3. It prints: Lima: 19.3 C.
state: temperature=19.3
:::

Six steps, one number. The temperature was inside a dictionary inside a dictionary. That nesting is the normal shape of an API answer, and the rest of the lesson shows how to read it.

## How it works

### Methods: the verb of a request

Every HTTP request starts with a method, a verb that says what kind of action you want. The table lists the four you will meet.

| Method | Meaning | Example | Changes the server? |
| --- | --- | --- | --- |
| GET | give me data | GET /v1/forecast?latitude=-12.05 | no |
| POST | here is data, make something | POST /v1/messages with a chat message | yes |
| PUT | replace this thing | PUT /users/42 with a new profile | yes |
| DELETE | remove this thing | DELETE /files/report.pdf | yes |

The weather call is a GET because you only read. A call to a model API is a POST, because you send a message and the server creates an answer. Parameters for a GET go after the question mark in the address. Data for a POST goes in the body of the request, usually as JSON.

### Status codes: the one number to check first

Every response carries a 3-digit status code. The first digit tells you the kind of result.

| Code | Name | What it means | What to do |
| --- | --- | --- | --- |
| 200 | OK | it worked | read the body |
| 400 | Bad Request | your parameters are wrong | read the error message in the body |
| 401 | Unauthorized | your key is missing or wrong | check the key (next lesson) |
| 404 | Not Found | the endpoint or item does not exist | check the path for typos |
| 429 | Too Many Requests | you hit a rate limit | wait and retry |
| 500 | Internal Server Error | the server failed | retry later, it is not your fault |

Codes that start with 2 are success. Codes that start with 4 are your mistake. Codes that start with 5 are the server's problem. Check the code before you read the body, because the body of a 404 is an error message, not the data you wanted. In the running example, a typo such as /v1/forcast returns 404.

### The requests library

Python can send HTTP requests with the requests library. Install it once with pip install requests, as the lesson [Packages and pip](/courses/start-here/python-for-data/packages-and-pip) explains. Here is the full running example.

:::code
lang: python
file: app.py
import requests

url = "https://api.open-meteo.com/v1/forecast"
params = {"latitude": -12.05, "longitude": -77.04, "current": "temperature_2m"}

response = requests.get(url, params=params)
print("status:", response.status_code)
print("type:", response.headers["Content-Type"])

data = response.json()
temp = data["current"]["temperature_2m"]
print("Lima:", temp, "C")
:::

:::code
lang: text
status: 200
type: application/json
Lima: 19.3 C
:::

Read it line by line. The params dictionary holds the three parameters; requests adds them after the question mark for you and handles the spelling of special characters. The function requests.get sends the request and waits for the answer. The result is a Response object with three useful parts: status_code, headers and the body. The method response.json() reads the body as JSON and returns Python values. The method response.text returns the raw body as a string, which is useful when something goes wrong.

### JSON: the shape of the answer

JavaScript Object Notation (JSON) is a text format for data. It has only six kinds of value: objects in curly braces, lists in square brackets, strings in double quotes, numbers, true or false, and null. The lesson [Reading and writing files](/courses/start-here/python-for-data/files-csv-json) introduced it. An object becomes a Python dictionary, a list becomes a Python list, and null becomes None. Here is the body of the running example, shortened.

:::code
lang: json
file: the body of the response
{
  "latitude": -12.0,
  "longitude": -77.0,
  "timezone": "GMT",
  "current_units": {"time": "iso8601", "temperature_2m": "°C"},
  "current": {
    "time": "2026-10-25T14:00",
    "interval": 900,
    "temperature_2m": 19.3
  }
}
:::

To reach the temperature, follow the keys from the outside in. The outer object has a key current. Its value is another object. That object has a key temperature_2m. Its value is 19.3. In Python that is data["current"]["temperature_2m"]. When a value is a list, use a number index: data["hourly"]["temperature_2m"][0] would give the first hourly value in a longer response. When you are unsure of the shape, print data.keys() and go one level at a time.

### Headers

Headers travel with both requests and responses. You already read one response header, Content-Type, which says the body is JSON. The request header you will send most often is Authorization, which carries an API key. The second is Content-Type, which says that the body you send is JSON. In requests, both go in a dictionary passed as headers. The model API call in a later track looks like this shape; the next lesson fills in the key.

:::code
lang: python
file: the shape of a POST with headers (not runnable without a key)
headers = {"Authorization": "Bearer YOUR-KEY", "Content-Type": "application/json"}
body = {"model": "example-model", "input": "Hello"}
response = requests.post("https://api.example.com/v1/answers", headers=headers, json=body)
print(response.status_code)
:::

### Rate limits

A rate limit is a cap on how many requests one client may send in a period. Open-Meteo allows about 10,000 calls per day without an account. A model API might allow 50 requests per minute on a new account. When you go over, the server answers 429 and often adds a header Retry-After with a number of seconds. The right response is to wait that long and try again, not to send the request faster. A loop that calls an API 1,000 times must sleep between calls or it will hit the limit within a minute.

### Errors to expect

Four things go wrong in practice. The network is down, and requests raises a ConnectionError. The server is slow, and the call waits for ever unless you pass timeout=10, which gives up after 10 seconds. The status is not 200, and response.json() contains an error message instead of data. The shape of the data changed, and a key is missing, which raises a KeyError. The lesson [Errors and how to read them](/courses/start-here/python-for-data/errors-and-debugging) shows how to read each of these.

## Try it

:::exercise
title: Fetch the temperature of three cities
task: Extend app.py so that it fetches the current temperature for Lima (-12.05, -77.04), Oslo (59.91, 10.75) and Cairo (30.04, 31.24) and prints one line per city. Check the status code each time and print a warning instead of a temperature when it is not 200. Then commit the file to your weather repository.
hint: Put the three cities in a dictionary that maps the name to a pair of numbers. Loop over the items and build params inside the loop. Use time.sleep(1) between calls to stay polite.
lang: python
solution:
import time
import requests

cities = {"Lima": (-12.05, -77.04), "Oslo": (59.91, 10.75), "Cairo": (30.04, 31.24)}
url = "https://api.open-meteo.com/v1/forecast"

for name, (lat, lon) in cities.items():
    params = {"latitude": lat, "longitude": lon, "current": "temperature_2m"}
    response = requests.get(url, params=params, timeout=10)
    if response.status_code != 200:
        print(name, "failed with status", response.status_code)
        continue
    temp = response.json()["current"]["temperature_2m"]
    print(name + ":", temp, "C")
    time.sleep(1)
:::

:::exercise
title: Read a nested answer
task: On paper. The JSON below is the answer from a book API. Write the Python expression that gives the second author's name, and the expression that gives the year.
On paper, the JSON is: an object with key title whose value is "Deep Learning", key year whose value is 2016, and key authors whose value is a list of two objects, each with a key name. The first name is "Ian Goodfellow" and the second is "Yoshua Bengio".
hint: Lists use number indexes starting at 0. Objects use key names in square brackets.
lang: python
solution:
data["authors"][1]["name"]   # "Yoshua Bengio"
data["year"]                 # 2016
:::

## Common mistakes

- Mistake: you call response.json() on a 404 and get a KeyError later. Fix: check response.status_code first; the body of an error response is an error message.
- Mistake: you build the address by hand with plus signs and spaces and the server returns 400. Fix: pass a params dictionary and let requests encode it.
- Mistake: you loop over 1,000 calls with no pause and get 429 after the first 50. Fix: add time.sleep between calls and retry after the number of seconds in the Retry-After header.
- Mistake: you forget timeout and your program hangs for ever when the server is slow. Fix: pass timeout=10 to every call.
- Mistake: you read data["current"]["temperature"] and get a KeyError. Fix: the key is temperature_2m; print data["current"].keys() and copy the exact spelling.

## Check your understanding

:::quiz
title: Check: APIs and JSON
q: Your program asks a model API to create an answer from a chat message. Which method does it use?
- GET
* POST
- DELETE
why: POST sends data in the body so the server can create something; GET only reads.
q: A call returns status 429. What is the best next step?
- Fix the spelling of the endpoint path
- Check your API key
* Wait the number of seconds in Retry-After and try again
why: 429 means too many requests, a rate limit, and the server tells you how long to wait.
q: The response body is an object with key current whose value is an object with key temperature_2m. Which expression gives the temperature?
- data["temperature_2m"]
* data["current"]["temperature_2m"]
- data["current", "temperature_2m"]
why: Nested JSON becomes nested dictionaries, and each level needs its own pair of square brackets.
q: You misspell the endpoint as /v1/forcast. Which status code do you expect?
- 200
- 500
* 404
why: 404 means the address does not exist on the server, which is what a typo in the path produces.
q: Which part of a request carries an API key?
- The status code
* A header such as Authorization
- The scheme https
why: Headers carry information about the request, such as who is sending it; the status code only exists in the response.
:::

## Go further

The links include the requests library guide, the Open-Meteo documentation with every parameter you can ask for, and the Mozilla pages on HTTP status codes. The next lesson, [Keys, secrets and environment variables](/courses/start-here/builders-tools/secrets-and-env), gives your program a key for an API that charges money. It shows how to keep that key off GitHub.
`,
      links: [
        { label: 'Requests: Quickstart', url: 'https://requests.readthedocs.io/en/latest/user/quickstart/', kind: 'docs' },
        { label: 'Open-Meteo API documentation', url: 'https://open-meteo.com/en/docs', kind: 'docs' },
        { label: 'MDN: HTTP response status codes', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status', kind: 'docs' },
        { label: 'RESTful APIs in 100 Seconds', url: 'https://www.youtube.com/watch?v=-MTSQjw5DrM', kind: 'video' },
        { label: 'Python json module', url: 'https://docs.python.org/3/library/json.html', kind: 'docs' },
      ],
    },
    {
      slug: 'secrets-and-env',
      title: 'Keys, secrets and environment variables',
      summary: 'After this lesson you can store an API key in a .env file, read it from Python with os.environ, and keep it out of Git for ever.',
      minutes: 20,
      objectives: [
        'Explain what an API key is and why it must never appear in code.',
        'Set an environment variable in the shell and read it in Python with os.environ.',
        'Write a .env file, load it with python-dotenv, and list it in .gitignore.',
        'Explain what happens when a key leaks and what to do in the first 5 minutes.',
      ],
      keyTerms: ['api-key', 'secret', 'environment-variable', 'dotenv-file', 'gitignore', 'path-variable'],
      body: `
## What this lesson covers

This lesson teaches you how to keep a secret. An API key is a long string that proves to a server that a request comes from your account. You learn where to store a key so that your program can read it but Git cannot. The tool for this is the environment variable, a named value that the operating system hands to a program when it starts. At the end you can put a key in a .env file, load it in Python and be sure that it never reaches GitHub.

## Why it matters

Every model API charges money per request and identifies you with a key. A leaked key lets a stranger spend your money, and leaks happen through one careless commit. Every project in the later tracks starts with the pattern from this lesson: a .env file, a .gitignore line and three lines of Python. If you learn it once now, you never lose a key. The next lesson, [Docker in plain words](/courses/start-here/builders-tools/docker-in-plain-words), packs your program into a box, and the box receives its key through the same environment variables.

## The idea with an example

> **Analogy.** An API key is a hotel key card. The card opens your room and charges the minibar to your bill. You do not write your room number and a copy of the card on a note and pin it to the lobby wall. You keep the card in your pocket and show it at the door. The code is the lobby wall, because anyone can read it once it is on GitHub. The environment is your pocket.

A secret is any value that must stay private because it gives access or costs money. API keys, passwords and tokens are secrets. The rule for secrets has two halves. The code never contains the secret. The code reads the secret from its surroundings at the moment it runs.

Here is the running example. A pretend model provider, Example AI, gives you a key when you sign up. The key is sk-live-7f3a9c2e4b8d1a6f5e0c3b9d2a7f4e1c, 40 characters long. You want app.py from the weather repository to call Example AI and turn the temperatures into a one-line summary. The call needs the key in an Authorization header. The question is where the string lives.

:::anim
title: Two places for the key: in the code, or in the environment
text t1 "Way 1: the key in the code" @ 480,70 size: 18 color: grey
box code1 "app.py" @ 130,150 icon: code
box hub "GitHub" @ 350,150 icon: cloud
box scan "Scanner" @ 570,150 icon: robot
num bill = 0 @ 790,150 prefix: "USD " size: 30 color: red
text t2 "Way 2: the key in the environment" @ 480,340 size: 18 color: grey
box env ".env" @ 130,430 icon: key
box osenv "os.environ" @ 350,430 icon: env
box code2 "app.py" @ 570,430 icon: code
box ai "Example AI" @ 790,430 icon: model
rect key @ 480,270 size: 170x44 "sk-live-7f3a..." color: yellow
text gi ".gitignore holds .env|so git skips the file" @ 130,370 size: 14 color: grey

step: Way 1. You write the 40-character key at the top of app.py. The program works at once.
  show t1, code1, key
  move key -> 130,210
step: You add, commit and push, as every day. The key travels to GitHub inside a public commit.
  show hub
  arrow code1 -> hub : git push
  & move key -> 350,210
step: Within minutes a scanning program reads every new commit, finds the pattern sk-live and copies the key.
  show scan
  arrow hub -> scan : scans new commits
  & move key -> 570,210
  color key red
step: The scanner sends requests with your key. Your account shows USD 140 that you did not spend.
  show bill
  pulse scan
  count bill -> 140 (2s)
  pulse bill
step: Way 2. You delete the line from app.py and put MODEL_API_KEY=sk-live-7f3a... in a .env file.
  show t2, env
  dim code1, hub, scan, bill
  hide key
  color key yellow
  move key -> 130,330 (0.1s)
  show key
  move key -> 130,490
step: load_dotenv() copies the line into os.environ. app.py asks for the name MODEL_API_KEY and gets the value.
  show osenv, code2
  arrow env -> osenv : load_dotenv()
  & move key -> 350,490
  arrow osenv -> code2 : os.environ.get
  & move key -> 570,490
step: app.py sends the key in an Authorization header to Example AI. Git skips .env, so GitHub holds no key.
  show ai
  arrow code2 -> ai : Authorization header
  show gi
  highlight env
:::

:::flow
title: How the key reaches the program
.env file -> dotenv library: reads MODEL_API_KEY=sk-live-...
dotenv library -> Environment: sets the variable
Environment -> app.py: os.environ reads it
app.py -> Example AI: Authorization header
:::

Three places are possible: inside app.py, in a file next to it, or in the environment. The scenario compares the first and the last.

:::scenario
title: Two ways to store the key
state: key_in_code=no, key_in_env=no, key_on_github=no
step: Way 1. You write api_key = "sk-live-7f3a..." at the top of app.py. It works at once.
state: key_in_code=yes
step: You run git add . and git commit and git push, as you do every day. The key is now in a public commit.
state: key_on_github=yes
step: Within minutes, a scanning program finds the pattern sk-live and tries it. Your account shows USD 140 of requests you did not make.
state: money_lost=USD 140
step: Way 2. You delete the line from app.py and put MODEL_API_KEY=sk-live-7f3a... in a file called .env. You add the line .env to .gitignore.
state: key_in_code=no, key_in_env=yes, key_on_github=no
step: app.py calls load_dotenv() and then os.environ["MODEL_API_KEY"]. It gets the same string and works at once.
step: You commit and push. Git skips .env. GitHub holds the code and no key.
state: key_on_github=no, money_lost=USD 0
:::

Both ways work on your computer. Only one of them survives a push. The 140 dollars is not an invented number; scanners copy keys within minutes of a public commit, and the bills that follow are often larger.

## How it works

### Environment variables

Every running program receives a set of name and value pairs called its environment. The operating system fills it with values such as HOME, your home folder, and PATH. The lesson [The terminal](/courses/start-here/builders-tools/terminal-commands) explained PATH, the list of folders the shell searches for programs. You can add your own. The table shows the three ways to set one and where it lives.

| Way | Command or file | Lives for | Good for |
| --- | --- | --- | --- |
| In the shell | export MODEL_API_KEY=sk-live-7f3a... | this terminal window only | a quick test |
| In a .env file | MODEL_API_KEY=sk-live-7f3a... in .env | this project folder | daily work |
| On a server | the host's secret store | the deployed service | production |

In Python, the environment is the dictionary os.environ. Reading a variable is one line.

:::code
lang: python
file: read_key.py
import os

key = os.environ.get("MODEL_API_KEY")
if key is None:
    print("MODEL_API_KEY is not set")
else:
    print("key found, length", len(key), "starts with", key[:8])
:::

Run it in the shell twice to see both branches.

:::code
lang: bash
python3 read_key.py
export MODEL_API_KEY=sk-live-7f3a9c2e4b8d1a6f5e0c3b9d2a7f4e1c
python3 read_key.py
:::

:::code
lang: text
MODEL_API_KEY is not set
key found, length 40 starts with sk-live-
:::

Use os.environ.get rather than os.environ["NAME"]. The first returns None when the name is missing; the second raises a KeyError. A clear message such as MODEL_API_KEY is not set saves ten minutes of confusion. Notice that the program prints only the length and the first 8 characters. Never print a whole key, because terminal output ends up in screenshots and logs.

### The .env file

The export command works only in the window where you typed it. Close the window and the variable is gone. A .env file keeps the value in the project folder. It is a plain text file with one NAME=value line per secret, and nothing else.

:::code
lang: text
file: .env
MODEL_API_KEY=sk-live-7f3a9c2e4b8d1a6f5e0c3b9d2a7f4e1c
WEATHER_UNITS=celsius
:::

The small library python-dotenv reads this file and copies each line into os.environ. Install it once with pip install python-dotenv. Then the program needs two more lines.

:::code
lang: python
file: app.py (the top of the file)
import os
import requests
from dotenv import load_dotenv

load_dotenv()
key = os.environ.get("MODEL_API_KEY")
if key is None:
    raise SystemExit("Set MODEL_API_KEY in .env first")

headers = {"Authorization": "Bearer " + key}
# the rest of the program uses headers in requests.post(...)
:::

The function load_dotenv looks for a .env file in the working directory and its parents. It sets each variable unless the variable already exists, so a value from export wins over the file. Everything after that is the same as the shell version. The code holds the name of the secret, never the value.

### Keeping the file out of Git

The .env file is on your disk, next to app.py, and git add . would add it. The .gitignore file from the lesson [Git and GitHub](/courses/start-here/builders-tools/git-and-github) is the fence. Confirm that it contains the line .env, then run git status. The file .env must not appear under untracked files. If it appears, the fence is broken.

Other people who clone the repository need to know which names to fill in. The habit is a second file, .env.example, that lists the names with empty values. This file is safe to commit.

:::code
lang: text
file: .env.example
MODEL_API_KEY=
WEATHER_UNITS=celsius
:::

A new colleague copies .env.example to .env, pastes in their own key, and runs the program. The real .env never leaves anyone's computer.

### What happens when a key leaks

A key leaks when it appears anywhere public: a commit, a screenshot, a chat message, a notebook you share, or a log file. Programs run by criminals scan every public commit on GitHub for strings that look like keys. They find a new key within 1 to 5 minutes and start using it. By the time you notice, the bill can be hundreds of dollars.

Do these four things, in this order, in the first 5 minutes.

1. Revoke the key. Open the provider's dashboard and delete the key. Every request with it now gets status 401.
2. Create a new key and put it in .env. Only .env, not the code.
3. Remove the key from the place where it leaked. For a commit, deleting the line and committing again is not enough, because the old commit still holds it. Tools such as git filter-repo rewrite history, but the revoke in step 1 is what makes the leak harmless.
4. Check the usage page for requests you did not make, and set a spending limit on the account.

The order matters. A revoked key is worthless, so step 1 ends the damage. Everything after it is cleanup.

### Where the key goes on a server

When you deploy a program in a later track, the server has no .env file and no terminal where you typed export. Every container host offers a secret store, a page or a command where you type the name and the value once. The host injects them as environment variables when your program starts. Your Python code does not change: os.environ.get("MODEL_API_KEY") works the same on your laptop and in the cloud. That is the whole point of reading from the environment.

## Try it

:::exercise
title: Move a key into .env
task: In your weather folder, create a .env file with the line MODEL_API_KEY=test-key-12345. Install python-dotenv. Write check_key.py that loads the file and prints the length of the key and its first 4 characters, or a clear message when it is missing. Then run git status and confirm that .env is not listed. Commit check_key.py and a .env.example file.
hint: The three lines are from dotenv import load_dotenv, load_dotenv() and os.environ.get. If git status shows .env, add the line .env to .gitignore before you commit.
lang: python
solution:
import os
from dotenv import load_dotenv

load_dotenv()
key = os.environ.get("MODEL_API_KEY")
if key is None:
    print("MODEL_API_KEY is not set. Copy .env.example to .env and fill it in.")
else:
    print("key found: length", len(key), "starts with", key[:4])
:::

:::exercise
title: Plan a leak response
task: On paper. You discover that a commit you pushed yesterday contains your real key. Write the four actions in the correct order and say why the first one comes first.
hint: Ask which action makes the key useless to a stranger.
lang: text
solution:
1. Revoke the key at the provider. A revoked key gets 401 everywhere, so the damage stops.
2. Create a new key and store it only in .env.
3. Remove the key from the repository history with git filter-repo, and from any screenshot or log.
4. Read the usage page for unknown requests and set a spending limit.
Revoke first because every other step takes time, and the key is being used during that time.
:::

## Common mistakes

- Mistake: you put the key in app.py to test quickly and plan to remove it later. Fix: write the .env file first; the quick test takes 30 seconds longer and the key never enters a commit.
- Mistake: you print the key to check that it loaded. Fix: print its length and first 4 characters; terminal output ends up in screenshots and logs.
- Mistake: you delete the key from the code after a leak and think the problem is solved. Fix: the old commit still holds it; revoke the key at the provider first.
- Mistake: you share a notebook or a screenshot that shows the .env file. Fix: treat a picture of a key as a leak; revoke and replace.
- Mistake: you use os.environ["MODEL_API_KEY"] and get a KeyError with no explanation. Fix: use os.environ.get and print a message that names the missing variable.

## Check your understanding

:::quiz
title: Check: secrets and environment variables
q: You run export MODEL_API_KEY=abc in one terminal window and python3 app.py in a second window. What does os.environ.get("MODEL_API_KEY") return in app.py?
- "abc"
* None
- An error
why: export sets the variable only in the window where you typed it; the second window has its own environment.
q: Which file is safe to commit to GitHub?
- .env
* .env.example
- Both
why: .env.example holds the names with empty values; .env holds the real secrets and must be in .gitignore.
q: Your key leaked in a public commit 10 minutes ago. Which action comes first?
- Delete the line from the code and push
- Make the repository private
* Revoke the key at the provider
why: Revoking makes the key worthless at once; the other steps do not stop a key that is already copied.
q: Both .env and the shell set MODEL_API_KEY, to different values. After load_dotenv(), which value does the program see?
* The shell value, because load_dotenv does not replace an existing variable
- The .env value, because files win
- Neither, because the conflict raises an error
why: By default load_dotenv sets a variable only when it is not already set.
q: Your program runs on a cloud host where no .env file exists. What is the usual way to give it the key?
- Write the key into the Dockerfile
* Set it in the host's secret store, which injects it as an environment variable
- Email the key to the server
why: Hosts inject secrets as environment variables, so the same os.environ.get line works everywhere.
:::

## Go further

The links include the python-dotenv documentation, the Python os.environ reference, and the GitHub guide on removing sensitive data from a repository. The next lesson, [Docker in plain words](/courses/start-here/builders-tools/docker-in-plain-words), packs app.py, its libraries and Python itself into one image that runs the same on any computer. The key goes in through the environment.
`,
      links: [
        { label: 'python-dotenv documentation', url: 'https://pypi.org/project/python-dotenv/', kind: 'docs' },
        { label: 'Python docs: os.environ', url: 'https://docs.python.org/3/library/os.html#os.environ', kind: 'docs' },
        { label: 'GitHub: Removing sensitive data from a repository', url: 'https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository', kind: 'docs' },
        { label: 'OWASP Secrets Management Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html', kind: 'article' },
      ],
    },
    {
      slug: 'docker-in-plain-words',
      title: 'Docker in plain words',
      summary: 'After this lesson you can explain the difference between an image and a container, run your first container, and write a Dockerfile for a Python script.',
      minutes: 24,
      objectives: [
        'Explain the problem "it works on my machine" and how Docker solves it.',
        'Explain the difference between a Docker image and a container with an everyday analogy.',
        'Run docker run hello-world and read what each line of the output means.',
        'Write a 5-line Dockerfile for a Python script, build the image and run the container.',
        'Pass an environment variable into a container with the -e flag.',
      ],
      keyTerms: ['docker', 'docker-image', 'container', 'dockerfile', 'base-image', 'environment-variable'],
      body: `
## What this lesson covers

This lesson explains Docker, a tool that packs a program together with everything it needs to run. Docker then runs that package the same way on any computer. You learn the two words that confuse everyone, image and container, and the difference between them. You run your first container and then write a Dockerfile for the weather script from this module. At the end you can hand your program to another person, or to a cloud server, as one package that runs without setup.

## Why it matters

The AI system you build in the project track ends as a service that runs on a server in the cloud. The server does not have your Python version, your libraries or your files. Docker is how you send all of those together. Almost every model server, vector database and training job in the field ships as a Docker image. The lesson [A Docker image for your service](/courses/build-ai-ecosystem/ship-it/dockerise) in the project track builds a production image; this lesson gives you the ideas and the first working example.

:::video
id: Gjnup-PuquQ
why: Watch all 100 seconds. The video shows a Dockerfile, an image and a container in that order, which is the order this lesson follows. Do not worry about the words volume or compose yet.
:::

## The idea with an example

> **Analogy.** A Docker image is a frozen ready meal in a sealed box. The box holds the food, the sauce and the instructions. It does not matter whose kitchen heats it; the meal comes out the same. A container is that meal once you have heated it and put it on a plate. From one box in the freezer you can make many plates, one after another, and each plate is separate. The Dockerfile is the recipe the factory used to fill the box.

Here is the problem Docker solves. You write app.py on your laptop with Python 3.12 and the requests library. You send the file to a colleague. Their computer has Python 3.8 and no requests. The program fails with an import error. You say the sentence every programmer has said: it works on my machine. The program is fine; the surroundings differ.

Docker fixes this by shipping the surroundings with the program. An image is a read-only package that holds a small operating system, a Python interpreter, your libraries and your files. A container is a running copy of an image, with its own files and its own processes, kept apart from the rest of the computer. The image is the box; the container is the plate.

Here is the running example. You take app.py from the weather repository, the version that fetches three temperatures with requests. You write a Dockerfile, build an image called weather, and run it. Then your colleague runs the same image and gets the same three lines of output on a computer with no Python at all.

:::anim
title: From Dockerfile to image to container
text cmdb "docker build -t weather ." @ 480,110 size: 22 color: yellow
box df "Dockerfile" @ 170,290 icon: file
box hub "Docker Hub" @ 170,430 icon: cloud
num sz = 0 @ 480,190 prefix: "image weather: " suffix: " MB" size: 22
rect l1 @ 480,430 size: 230x36 "FROM python:3.12-slim" color: blue
rect l2 @ 480,390 size: 230x36 "WORKDIR /app" color: blue
rect l3 @ 480,350 size: 230x36 "COPY . ." color: blue
rect l4 @ 480,310 size: 230x36 "RUN pip install requests" color: blue
rect l5 @ 480,270 size: 230x36 "CMD python app.py" color: green
box col "Colleague's PC" @ 760,130 icon: user
box c1 "Container 1" @ 760,270 size: 220x64 icon: container
box c2 "Container 2" @ 760,410 size: 220x64 icon: container
text o1 "Lima: 19.3 C   Oslo: 4.1 C   Cairo: 31.0 C" @ 760,335 size: 14 color: green
text o2 "Lima: 19.3 C   Oslo: 4.1 C   Cairo: 31.0 C" @ 760,475 size: 14 color: green
text o3 "the same three lines, no Python installed" @ 760,195 size: 14 color: green

step: The Dockerfile has 5 lines. docker build -t weather . reads them from top to bottom.
  show df, cmdb
  pulse df
step: FROM pulls the base image python:3.12-slim, about 150 MB, from Docker Hub. It is the first layer.
  show hub, sz, l1
  arrow hub -> l1 : docker pull
  & count sz -> 150
step: WORKDIR, COPY and RUN each add a layer: the folder /app, your files, and the requests library.
  show l2
  show l3
  arrow df -> l3 : COPY . .
  show l4
  & count sz -> 160
step: CMD is the last layer. It names the command to run later, not now. The image is complete and read-only.
  show l5
  highlight l5
  wait 0.5
  restore l5
step: docker run weather starts container 1, a fresh copy of the image, and runs python app.py inside it.
  show c1
  arrow l4 -> c1 : docker run weather
step: app.py prints three temperatures. The program ends and the container stops. The image did not change.
  show o1
  label c1 "Container 1: stopped"
  color c1 grey
step: docker run weather again: a second, separate container starts from the same image and prints three new lines.
  show c2
  arrow l1 -> c2 : docker run weather
  show o2
  label c2 "Container 2: stopped"
  color c2 grey
step: Your colleague runs the same image on a computer with no Python. Python 3.12 travels inside the image.
  show col
  arrow l5 -> col : docker run weather
  show o3
  highlight l1
:::

:::arch
title: Where a container sits on a computer
layer: Your program | app.py, requests library
layer: Container | Python 3.12, small Linux files
layer: Docker | Docker engine
layer: Computer | Operating system, CPU and memory
flow: app.py -> Python 3.12 -> Docker engine -> Operating system -> Docker engine -> Python 3.12 -> app.py
note: Docker engine = starts and stops containers and shares the computer between them
:::

The container holds everything above the Docker engine. It shares the CPU, the memory and the core of the operating system with the computer, which is why it starts in about a second. A virtual machine, by contrast, carries a whole operating system and takes minutes. Press Next to follow the running example from recipe to plate.

:::scenario
title: From Dockerfile to a running container
state: images=none, containers=none
step: You write a Dockerfile with 5 lines: FROM python:3.12-slim, WORKDIR /app, COPY . ., RUN pip install requests, CMD python app.py.
step: You run docker build -t weather . in the folder. Docker downloads the base image python:3.12-slim, about 150 MB, then runs each line and saves the result.
state: images=python:3.12-slim (150 MB), weather (160 MB)
step: You run docker run weather. Docker starts a container from the image and runs python app.py inside it.
state: containers=1 running
step: app.py fetches the three temperatures and prints Lima: 19.3 C, Oslo: 4.1 C, Cairo: 31.0 C. The program ends and the container stops.
state: containers=1 stopped
step: You run docker run weather again. A second, separate container starts from the same image and prints three new lines.
state: containers=2 stopped
step: Your colleague runs docker run weather on a computer with no Python. It prints the same three lines, because Python 3.12 is inside the image.
:::

One image, three containers, no setup on the second computer. The image did not change when the containers ran. Each container began as a fresh copy of the image, did its job and stopped.

## How it works

### Install Docker and run hello-world

Install Docker Desktop on Windows or macOS, or the docker package on Linux. Open a terminal and run the smallest possible test.

:::code
lang: bash
docker run hello-world
:::

:::code
lang: text
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.
:::

Read the output as a story. Docker looked for an image called hello-world on your computer and did not find it. It pulled the image from Docker Hub, a public library of images. It started a container from the image. The container printed a message and stopped. That is the whole life of a container in four lines.

### Images and containers: the words

The table puts the two words side by side with the running example.

| Question | Image | Container |
| --- | --- | --- |
| What is it? | a read-only package of files | a running copy of an image |
| In the analogy | the frozen meal in the box | the meal on the plate |
| How do you make one? | docker build from a Dockerfile, or docker pull | docker run from an image |
| How many? | one weather image | as many containers as you run |
| Does it change? | never; you build a new one | yes, while it runs, then it is gone |
| Command to list | docker images | docker ps -a |

A container has its own file system that starts as a copy of the image. Files it writes stay inside it and vanish when you remove it. This surprises people. If a container must keep data, you attach a folder from the computer, which the project track covers. For a script that prints results, nothing needs to be kept.

### The Dockerfile

A Dockerfile is a text file of instructions for building an image. The file is named Dockerfile, with a capital D and no extension, and lives in the project folder. The weather script needs 5 lines.

:::code
lang: dockerfile
file: Dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY . .
RUN pip install requests
CMD ["python", "app.py"]
:::

Each line is one instruction, and Docker runs them from top to bottom.

1. FROM picks the base image, the image you start from. The image python:3.12-slim holds a small Linux and Python 3.12. Everything else goes on top of it.
2. WORKDIR sets the working directory inside the image to /app, and creates it. Later commands run there.
3. COPY . . copies the files from the current folder on your computer into /app in the image. The first dot is the source, the second is the destination.
4. RUN executes a shell command while building and saves the result. Here it installs the requests library inside the image.
5. CMD names the command that runs when a container starts. It runs once per container, not during the build.

The difference between RUN and CMD is the one people mix up most. RUN happens at build time and changes the image. CMD happens at run time and starts the program. An image has many RUN lines and one CMD line.

### Build and run

:::code
lang: bash
file: in the weather folder, next to the Dockerfile
docker build -t weather .
docker run weather
:::

:::code
lang: text
Lima: 19.3 C
Oslo: 4.1 C
Cairo: 31.0 C
:::

The flag -t weather gives the image a name. The final dot tells Docker to use the current folder as the build context, the set of files that COPY may read. The first build takes a minute because it downloads the base image. The second build takes seconds, because Docker saves each instruction as a layer and reuses layers whose inputs did not change. That is why RUN pip install comes before a line that copies code that changes often. In a bigger project you copy requirements.txt first, install, and copy the code last.

### Passing the environment in

The container has its own environment. Your shell variables and your .env file are not inside it. The lesson [Keys, secrets and environment variables](/courses/start-here/builders-tools/secrets-and-env) explained why the key stays out of the code; it must also stay out of the image. The flag -e sets a variable for one container.

:::code
lang: bash
docker run -e MODEL_API_KEY=sk-live-7f3a9c2e4b8d1a6f5e0c3b9d2a7f4e1c weather
docker run --env-file .env weather
:::

The first command sets one variable. The second reads every line of your .env file and sets them all. Inside, os.environ.get works exactly as it did on your laptop. Never write the key into the Dockerfile with an ENV line, because anyone who has the image can read it. Also add .env to a file called .dockerignore, so that COPY . . does not copy the secret into the image.

### The commands you need

| Command | What it does |
| --- | --- |
| docker build -t name . | builds an image from the Dockerfile in this folder |
| docker run name | starts a container from the image |
| docker run -e NAME=value name | starts it with one environment variable |
| docker images | lists the images on this computer |
| docker ps -a | lists all containers, running and stopped |
| docker rm container-id | deletes a stopped container |
| docker rmi name | deletes an image |
| docker pull name | downloads an image from Docker Hub without running it |

The flow shows the four commands that move a program from a folder on your disk to a running container, and the image that sits in the middle.

:::flow
title: Folder to image to container
Project folder -> Image: docker build -t weather .
Docker Hub -> Image: docker pull (base image)
Image -> Container: docker run weather
Container -> Screen: three lines of output
:::

### What Docker does not do

Docker does not make a program faster. Docker does not replace Git; the Dockerfile lives in the repository like any other file. Docker does not share your GPU by default; AI training images need an extra flag for that. And Docker does not fix a program that fails on your own machine. It makes a working program work everywhere else.

## Try it

:::exercise
title: Build and run the weather image
task: In your weather folder, write the 5-line Dockerfile from the lesson and a .dockerignore file that lists .env and .git. Build an image called weather and run it. The container must print the three temperatures. Then run docker ps -a and count the stopped containers.
hint: The build command ends with a dot. If the build fails on pip install, check that the line is RUN and not CMD. If app.py is not found, check that COPY . . is before CMD.
lang: dockerfile
solution:
FROM python:3.12-slim
WORKDIR /app
COPY . .
RUN pip install requests
CMD ["python", "app.py"]

# then in the shell:
# echo ".env" > .dockerignore
# echo ".git" >> .dockerignore
# docker build -t weather .
# docker run weather
# docker ps -a
:::

:::exercise
title: Pass a variable into a container
task: Write hello_env.py that prints the value of a variable called GREETING, or the word none if it is not set. Build an image called hello-env from a 3-line Dockerfile with no RUN line. Run it twice: once with no flag and once with -e GREETING=hola. The two runs must print none and hola.
hint: The Dockerfile needs only FROM, COPY and CMD. No library is installed, so no RUN line is needed.
lang: dockerfile
solution:
FROM python:3.12-slim
COPY hello_env.py .
CMD ["python", "hello_env.py"]

# hello_env.py:
# import os
# print(os.environ.get("GREETING", "none"))
#
# docker build -t hello-env .
# docker run hello-env
# docker run -e GREETING=hola hello-env
:::

## Common mistakes

- Mistake: you use the words image and container for the same thing. Fix: the image is the package you build once; the container is a running copy you can start many times.
- Mistake: you put pip install in a CMD line and nothing is installed when the program starts. Fix: RUN happens at build time and saves the result; CMD only starts the program.
- Mistake: you write the API key into the Dockerfile with ENV. Fix: pass it at run time with -e or --env-file; anyone who has the image can read an ENV line.
- Mistake: you forget the final dot in docker build and see a message about a missing path. Fix: the dot names the current folder as the build context.
- Mistake: you expect a file written by the container to appear on your disk. Fix: a container's files vanish when it is removed; mount a folder from the computer when you need to keep output.

## Check your understanding

:::quiz
title: Check: Docker in plain words
q: You run docker run weather three times. How many images and how many containers exist afterwards?
- 3 images and 3 containers
* 1 image and 3 containers
- 1 image and 1 container
why: run starts a new container from the same image each time; the image is never copied or changed.
q: Which Dockerfile line installs the requests library into the image?
- CMD pip install requests
* RUN pip install requests
- COPY pip install requests
why: RUN executes a command at build time and saves the result in the image; CMD only sets the command for run time.
q: Your colleague has no Python installed. Why does docker run weather still work?
- Docker installs Python on their computer first
* The image contains Python 3.12 from the base image
- Docker runs the program on your computer instead
why: FROM python:3.12-slim puts the interpreter inside the image, so the container needs nothing from the host.
q: Which is the safe way to give a container an API key?
- An ENV line in the Dockerfile
- Writing the key in app.py before building
* The -e flag or --env-file when you run it
why: Values passed at run time are not stored in the image, so the image can be shared without leaking the key.
q: What does a container start with when it begins running?
* A fresh copy of the image's files
- The files left by the previous container
- An empty file system
why: Every container starts from the image; changes made by one container do not affect the next one.
:::

## Go further

The links include the official Docker getting-started guide, the Dockerfile reference and a 1-hour crash course video. You have now met the five tools that every builder uses: the terminal, Git, APIs, secrets and Docker. The next module, [Data, the raw material of AI](/courses/start-here/data-the-raw-material/what-data-is), leaves the tools and looks at what the tools carry: the data that every model learns from.
`,
      links: [
        { label: 'Docker: Get started guide', url: 'https://docs.docker.com/get-started/', kind: 'docs' },
        { label: 'Dockerfile reference', url: 'https://docs.docker.com/reference/dockerfile/', kind: 'docs' },
        { label: 'Docker crash course (1 hour)', url: 'https://www.youtube.com/watch?v=pg19Z8LL06w', kind: 'video' },
        { label: 'python image on Docker Hub', url: 'https://hub.docker.com/_/python', kind: 'docs' },
      ],
    },
  ],
}
