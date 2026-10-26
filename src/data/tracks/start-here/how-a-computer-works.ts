import type { Module } from '../../types'

export const mod: Module = {
  slug: 'how-a-computer-works',
  title: 'How a computer works',
  description: 'Input, processing, storage and output; files and the operating system; how a web page reaches you; and what a program is.',
  level: 'foundations',
  lessons: [
    {
      slug: 'input-process-store-output',
      title: 'What a computer does',
      summary: 'After this lesson you can name the four jobs of a computer and explain what bits and bytes are.',
      minutes: 20,
      objectives: [
        'Name the four jobs of a computer: input, processing, storage and output.',
        'Explain what the CPU, memory and disk each do, with a kitchen analogy.',
        'Explain what a bit and a byte are.',
        'Convert a small number such as 12 into binary by hand.',
      ],
      keyTerms: ['computer', 'input', 'output', 'CPU', 'memory', 'disk', 'bit', 'byte'],
      body: `
## What this lesson covers

This lesson explains what a computer does, in four words: input, processing, storage and output. You learn the three main parts inside the box: the processor, the memory and the disk. You also learn the smallest unit of information, the bit, and how 8 bits make a byte. At the end you can describe what happens when you type 7 + 5 into a calculator app and press the equals key.

## Why it matters

Every artificial intelligence (AI) system is a program that runs on a computer. A program is a list of instructions for a computer. When you train an AI model later in this site, you will hear people talk about memory, processors and gigabytes. These words describe real, physical parts. If you know what the parts do, those later lessons become easy to follow. The next lesson, [Files, folders and the operating system](/courses/start-here/how-a-computer-works/files-folders-os), builds on the idea of storage from this lesson.

:::video
id: mCq8-xTH7jA
why: Watch all 5 minutes. The video shows the same four jobs that this lesson describes: input, storage, processing and output. Listen for the word binary near the end.
:::

## The idea with an example

> **Analogy.** A computer is a kitchen. An order slip arrives from a customer: that is the input. The cook reads the slip and does the work: that is the processing. The cook keeps ingredients close on the counter for the current dish, and keeps the rest in the pantry: those are the two kinds of storage. The finished dish goes out to the customer: that is the output.

A computer is a machine that takes in information, changes it by following instructions, and gives information back. The word for taking in information is input. The word for giving back information is output. Everything a computer does fits this pattern.

Here is the running example for this lesson. You open a calculator app. You press the keys 7, then +, then 5, then =. The screen shows 12. Four things happen, and each one matches one of the four jobs.

1. Input: the keyboard sends the key presses 7, +, 5 and = to the computer.
2. Processing: the central processing unit (CPU) adds 7 and 5. The CPU is the chip that follows instructions and does arithmetic. In the kitchen, the CPU is the cook.
3. Storage: the computer keeps the numbers 7 and 5 in its memory while the CPU works. Memory, also called random-access memory (RAM), is fast, small storage for the current job. In the kitchen, memory is the counter.
4. Output: the screen draws the number 12.

The diagram shows the path of the key presses through the machine.

:::flow
title: The path of 7 + 5 through a computer
Keyboard -> CPU: key presses 7 + 5 =
CPU -> Memory: stores 7 and 5
Memory -> CPU: returns 7 and 5
CPU -> Screen: result 12
:::

Press Next to follow the same example one step at a time. The panel on the right shows what the memory holds after each step.

:::scenario
title: The calculator adds 7 and 5
state: memory=empty, screen=blank
step: You press the key 7. The keyboard sends the input to the CPU.
state: memory=7, screen=7
step: You press + and then 5. The CPU stores both numbers in memory.
state: memory=7 and 5, screen=5
step: You press =. The CPU reads 7 and 5 from memory and adds them.
state: memory=7 and 5 and 12
step: The CPU sends 12 to the screen. The screen draws the output.
state: screen=12
step: You close the app. The memory for the app is cleared. Nothing was saved to the disk.
state: memory=empty, screen=blank
:::

Notice the last step. The memory is cleared when the app closes. Memory holds information only while the computer is on and the program runs. If you want to keep information after you close the app, the computer must write it to the disk. The disk is slow, large storage that keeps information when the power is off. In the kitchen, the disk is the pantry. A calculator does not save its result, so nothing goes to the disk.

## How it works

Every part of a computer belongs to one of the four jobs. The table lists the common parts.


:::anim
title: 7 + 5 = 12 through the four jobs of a computer
box kb "Keyboard" @ 130,290 icon: none
box cpu "CPU" @ 420,290 icon: cpu
box mem "Memory" @ 420,450 icon: memory
box screen "Screen" @ 710,290 icon: screen
box disk "Disk" @ 130,450 icon: disk
rect m1 @ 600,450 size: 70x50 "7"
rect m2 @ 680,450 size: 70x50 "5"
text jin "1 Input" @ 130,210 size: 18 color: yellow
text jproc "2 Processing" @ 420,210 size: 18 color: yellow
text jstore "3 Storage" @ 420,380 size: 18 color: yellow
text jout "4 Output" @ 710,210 size: 18 color: yellow
num sum = 0 @ 420,140 prefix: "7 + 5 = " size: 28 color: green
num shown = 0 @ 710,140 size: 40 color: green
text note "Memory clears when the app closes.|Nothing went to the disk." @ 770,450 size: 16 color: grey

step: You press 7, +, 5 and =. The keyboard sends the key presses to the CPU. That is input.
  show kb, cpu, jin
  arrow kb -> cpu : "7 + 5 ="
step: The CPU stores 7 and 5 in memory, two cells on the counter. That is storage.
  show mem, jstore
  arrow cpu -> mem : "7 and 5"
  show m1, m2
step: The CPU reads 7 and 5 back from memory and adds them. That is processing.
  arrow mem -> cpu : "7 and 5"
  show jproc, sum
  highlight cpu
  count sum -> 12
step: The CPU sends 12 to the screen. The screen draws the number. That is output.
  restore cpu
  show screen, jout
  arrow cpu -> screen : "12"
  show shown
  count shown -> 12
step: You close the app. The memory cells clear. Nothing was written to the disk, so nothing is kept.
  show disk
  dim disk
  hide m1, m2
  show note
:::

| Job | Parts | Kitchen analogy |
| --- | --- | --- |
| Input | keyboard, mouse, touch screen, microphone, camera | the order slip |
| Processing | CPU, and a graphics processing unit (GPU) for pictures and AI | the cook |
| Storage | memory (RAM) for the current job; disk (SSD or hard disk) for long-term | the counter and the pantry |
| Output | screen, speaker, printer | the finished dish |

The GPU appears in the table because it matters for AI. A graphics processing unit (GPU) is a second processor that does thousands of small calculations at the same time. It was built to draw pictures on screens. AI training uses it because AI also needs millions of small calculations.

### Bits and bytes

All information inside a computer is stored as bits. A bit is the smallest unit of information. It is a single switch that is either off or on. We write off as 0 and on as 1. A computer has billions of these switches.

One bit can show only 2 choices. To show more, computers group bits. A byte is a group of 8 bits. With 8 switches you can make 256 different patterns, because 2 multiplied by itself 8 times is 256. So one byte can hold any whole number from 0 to 255. One byte is also enough to hold one letter of English text. The letter A is stored as the number 65, which is the pattern 01000001.

Here is how the number 12 from the running example becomes bits. Each position in a byte has a value. From right to left the values are 1, 2, 4, 8, 16, 32, 64 and 128. Each value is double the one before it. To write 12, you choose the positions that add up to 12. The positions 8 and 4 add up to 12, so those two switches are on and the others are off.

| Position value | 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Switch for 12 | 0 | 0 | 0 | 0 | 1 | 1 | 0 | 0 |

So the number 12 is the byte 00001100. The number 7 is 00000111, because 4 + 2 + 1 = 7. The number 5 is 00000101, because 4 + 1 = 5. When the CPU adds 7 and 5, it adds these patterns of switches and gets 00001100, which is 12. This counting system with only 0 and 1 is called binary.

### Big numbers of bytes

Files and memory are measured in bytes. The numbers get large, so people use prefixes.

| Unit | Short form | Size | An everyday example |
| --- | --- | --- | --- |
| kilobyte | KB | about 1,000 bytes | one page of plain text |
| megabyte | MB | about 1,000,000 bytes | one photo from a phone is about 3 MB |
| gigabyte | GB | about 1,000,000,000 bytes | one hour of video is about 1 GB |
| terabyte | TB | about 1,000 GB | a large external disk |

A typical laptop in 2026 has 16 GB of memory and 512 GB of disk. The memory is small but fast. The disk is large but slow. The bars compare the time to read 1 GB from each kind of storage.

:::bars
title: Time to read 1 GB
unit: seconds
Memory (RAM): 0.1
Solid-state disk: 2
Hard disk: 10
Internet download: 80
:::

### Why the CPU needs memory

The CPU is very fast. It can do billions of additions per second. The disk is far too slow to feed it. So the computer copies the information for the current job from the disk into memory first. The CPU then reads from memory. When the job is done, the computer writes the result back to the disk if you ask it to save. In the kitchen, the cook does not walk to the pantry for every pinch of salt. The cook puts the ingredients for the current dish on the counter.

This copy step explains a common experience. When you open a large program, you wait a few seconds. During that wait, the computer copies the program from the disk into memory. When the program is in memory, it runs fast.

## Try it

:::exercise
title: Write a number in binary
task: Use paper. Write the number 19 as a byte of 8 bits. Then write the number 100. Use the position values 128, 64, 32, 16, 8, 4, 2 and 1. For each number, pick the positions that add up to the number.
hint: Start from the largest position value that is not bigger than the number. For 19, the largest such value is 16. Subtract it and continue with the remainder, which is 3.
lang: text
solution:
19 = 16 + 2 + 1
Positions: 128 64 32 16 8 4 2 1
Switches:    0  0  0  1 0 0 1 1
19 is 00010011

100 = 64 + 32 + 4
Positions: 128 64 32 16 8 4 2 1
Switches:    0  1  1  0 0 1 0 0
100 is 01100100
:::

:::exercise
title: Find the four jobs on your own computer
task: Look at the computer or phone in front of you. Write down one input part, one output part, and the amount of memory and disk it has. On Windows, open Settings, then System, then About. On a Mac, open the Apple menu, then About This Mac. On a phone, open Settings, then About phone or General.
hint: The screen is an output part. A touch screen is both an input and an output part. The memory line often says RAM.
lang: text
solution:
Example answer for a laptop:
Input: keyboard, touchpad, camera, microphone
Output: screen, speakers
Memory: 16 GB
Disk: 512 GB
:::

## Common mistakes

- Mistake: you think memory and disk are the same thing because both are called storage. Fix: memory is fast and empties when the power goes off; the disk is slow and keeps your files.
- Mistake: you think a bigger disk makes the computer faster. Fix: more memory and a faster CPU make it faster; a bigger disk only lets you keep more files.
- Mistake: you think a bit can hold a letter. Fix: a bit holds only 0 or 1; you need a byte, which is 8 bits, to hold one letter.
- Mistake: you think the screen does the computing. Fix: the screen only shows output; the CPU does the work.
- Mistake: you think 1 KB is exactly 1,000 bytes in every program. Fix: some programs count 1 KB as 1,024 bytes, because 1,024 is 2 multiplied by itself 10 times. The difference is small and does not matter in this course.

## Check your understanding

:::quiz
title: Check: what a computer does
q: You press the key 5 on the keyboard. Which of the four jobs is this?
- Processing
* Input
- Storage
- Output
why: The keyboard brings information into the computer, which is the input job.
q: Which part does the arithmetic when the calculator adds 7 and 5?
- The screen
- The disk
* The CPU
- The keyboard
why: The central processing unit follows instructions and does arithmetic; the other parts only move or show information.
q: You turn the computer off and on again. Which information survives?
- Everything that was in memory
* Only the information written to the disk
- Nothing
why: Memory empties when the power goes off; the disk keeps its contents.
q: Which byte is the number 10?
- 00000110
* 00001010
- 00010000
why: 10 is 8 + 2, so the switches for 8 and 2 are on: 00001010.
q: A photo is 3 MB. About how many photos fit on a 30 GB disk?
- 100
- 1,000
* 10,000
why: 30 GB is 30,000 MB, and 30,000 divided by 3 is 10,000.
q: Why does a computer copy a program from the disk into memory before it runs?
- The disk is too small
* The disk is too slow for the CPU, and memory is fast
- Programs cannot be stored on a disk
why: The CPU works billions of times per second, and only memory can deliver information at that speed.
:::

## Go further

The Wikipedia pages on the central processing unit and on the byte in the links go deeper on the parts in this lesson. Read the first section of each. Code.org has a short series of videos that shows the same ideas with real hardware. The next lesson, [Files, folders and the operating system](/courses/start-here/how-a-computer-works/files-folders-os), explains how the disk is organised and what the software called the operating system does.
`,
      links: [
        { label: 'Central processing unit (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Central_processing_unit', kind: 'article' },
        { label: 'Byte (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Byte', kind: 'article' },
        { label: 'Binary number (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Binary_number', kind: 'article' },
        { label: 'How Computers Work series (Code.org)', url: 'https://code.org/curriculum/course/how-computers-work', kind: 'course' },
      ],
    },
    {
      slug: 'files-folders-os',
      title: 'Files, folders and the operating system',
      summary: 'After this lesson you can read a file path, recognise a file extension, and say what an operating system does.',
      minutes: 20,
      objectives: [
        'Explain what a file, a folder and a path are.',
        'Read a file extension and say what kind of file it marks.',
        'Describe the three jobs of an operating system.',
        'Compare Windows, macOS and Linux and write the same path for each.',
      ],
      keyTerms: ['file', 'folder', 'path', 'file extension', 'operating system', 'Linux'],
      body: `
## What this lesson covers

This lesson explains how a computer organises the information on its disk. You learn what a file is, what a folder is, and how a path names the exact place of a file. You also meet the operating system, the program that runs all the other programs. At the end you can find any file on your computer by its path, on Windows, macOS or Linux.

## Why it matters

Every program you write will be a file. Every data set you train an AI model on will be files in folders. When a program says it cannot find a file, the cause is almost always a wrong path. The next module, [Install Python and run your first file](/courses/start-here/first-python/install-and-run), asks you to create a file and run it from a folder. This lesson gives you the words and the habits for that.

:::video
id: rrB13utjYV4
why: Watch all 100 seconds. It explains Linux, the third operating system in this lesson, and shows a terminal for the first time. You do not need to remember the commands yet.
:::

## The idea with an example

> **Analogy.** The disk is a filing cabinet. A file is one sheet of paper with a name. A folder is a cardboard folder that holds sheets and other folders. A path is the set of directions to one sheet: which drawer, which folder inside it, which folder inside that, and finally which sheet.

A file is a named block of information stored on the disk. Each file has a name and contents. The contents can be text, a picture, a sound, or a program. A folder, also called a directory, is a container that holds files and other folders. The folder inside a folder makes a tree, with one root at the top.

Here is the running example. A learner called Ada writes a text file named notes.txt. She saves it in her Documents folder. The Documents folder is inside her personal folder, which is named ada. The personal folder is inside a folder that holds all the users of the computer.

:::flow
title: The folders above notes.txt
Root -> Users: top folder
Users -> ada: Ada's home folder
ada -> Documents: her documents
Documents -> notes.txt: the file
:::

A path is the full address of the file, written as the folder names from the root down to the file. Each operating system writes the path a little differently. The three lines below name the same file on three systems.

:::code
lang: text
Windows:  C:\\Users\\ada\\Documents\\notes.txt
macOS:    /Users/ada/Documents/notes.txt
Linux:    /home/ada/Documents/notes.txt
:::

Windows starts with a drive letter, C:, and separates folders with a backslash. macOS and Linux start with a single forward slash, which is the root, and separate folders with forward slashes. On Linux the personal folders live under home instead of Users. The rest of the idea is the same.

:::anim
title: The operating system follows a path and opens notes.txt
rect root @ 130,130 size: 120x50 "/"
rect users @ 290,130 size: 120x50 "Users"
rect ada @ 450,130 size: 120x50 "ada"
rect docs @ 610,130 size: 120x50 "Documents"
rect notes @ 770,130 size: 120x50 "notes.txt" color: yellow
text path "/" @ 450,220 size: 20 color: yellow
box editor "Text editor" @ 150,330 icon: file
box os "Operating system" @ 450,330 icon: none
box mem "Memory" @ 150,460 icon: memory
box disk "Disk" @ 450,460 icon: disk
num bytes = 0 @ 300,400 suffix: " bytes" size: 22 color: green
text note "Programs never touch the disk.|They ask the operating system." @ 770,330 size: 16 color: grey

step: Ada double-clicks notes.txt. The text editor asks the operating system to open the file by its path.
  show editor, os
  arrow editor -> os : "open notes.txt"
step: The operating system starts at the root, the single slash at the top of the tree.
  show root, path
  highlight root
step: It follows the path one folder at a time: Users, then ada, then Documents.
  restore root
  show users
  arrow root -> users
  & label path "/Users"
  show ada
  arrow users -> ada
  & label path "/Users/ada"
  show docs
  arrow ada -> docs
  & label path "/Users/ada/Documents"
step: In Documents it finds the file. The path led to exactly one file: notes.txt.
  show notes
  arrow docs -> notes
  & label path "/Users/ada/Documents/notes.txt"
  highlight notes
step: The contents live on the disk. The operating system asks the disk driver to read the file.
  show disk, note
  arrow os -> disk : "read"
step: The disk copies the 40 bytes of notes.txt into memory, where the CPU can reach them fast.
  show mem, bytes
  arrow disk -> mem : "copy"
  & count bytes -> 40
step: The editor reads the text from memory and draws it on the screen. Ada can now edit it.
  arrow mem -> editor : "text"
  label editor "Text editor|shows notes.txt"
  highlight editor
:::

Press Next to follow what the computer does when Ada double-clicks notes.txt.

:::scenario
title: Ada opens notes.txt
state: app=none, file=on disk
step: Ada double-clicks notes.txt in the Documents folder.
step: The operating system looks at the extension .txt and finds the app registered for text files.
state: app=text editor starting
step: The operating system starts the text editor and gives it the path to the file.
state: app=text editor
step: The text editor asks the operating system to read the file. The operating system copies it from the disk into memory.
state: file=in memory
step: The text editor shows the text on the screen. Ada can now edit it.
state: screen=shows notes
:::

## How it works

### File names and extensions

The part of a file name after the last dot is the file extension. In notes.txt, the extension is txt. The extension tells the operating system and you what kind of contents to expect. It is only a label. You can rename a file and give it a wrong extension, and the contents stay the same. Programs may then fail to open it.

| Extension | Kind of file | Program that opens it |
| --- | --- | --- |
| .txt | plain text | any text editor |
| .py | a Python program | the Python interpreter, a text editor |
| .csv | a table, one row per line, values separated by commas | a spreadsheet, Python |
| .json | structured data for programs | a text editor, Python |
| .jpg or .png | a picture | an image viewer |
| .pdf | a document with fixed layout | a PDF reader |
| .zip | a compressed bundle of files | an archive tool |

Two kinds of file matter most for this course. A plain text file holds only letters, digits and punctuation, stored as one byte per character. A Python program is a plain text file. A word processor document, such as a .docx file, is not plain text. It also holds fonts, colours and page layout, so the Python interpreter cannot read it. Always write code in a plain text editor, not in a word processor. Good free editors are Notepad on Windows, TextEdit in plain text mode on macOS, and Visual Studio Code on all three systems.

The size of a file is the number of bytes in it. The file notes.txt with one line of 40 characters is about 40 bytes. A photo is a few million bytes. A trained AI model is a file too, and a large one is many billions of bytes. The disk, the memory and the internet connection all set limits on which files you can use.

Windows hides extensions by default. To see them, open File Explorer, click View, and turn on File name extensions. macOS also hides some extensions. In Finder, open Settings, then Advanced, and turn on Show all filename extensions. Turn these on now. You will need to see the .py extension in the next module.

### The operating system

The operating system (OS) is the program that starts when you turn the computer on and runs all other programs. It has three main jobs.

1. It manages the hardware. It knows how to talk to the disk, the screen, the keyboard and the network. Other programs ask the OS instead of talking to the hardware directly.
2. It manages files. It keeps the tree of folders, finds a file from its path, and reads or writes its contents.
3. It manages programs. It starts them, gives each one some memory, shares the CPU between them, and stops them.

The layered picture shows how the parts fit. A program never touches the disk itself. It asks the OS, and the OS does the work.

:::arch
title: Where the operating system sits
layer: Apps | Text editor, Browser, Python
layer: Operating system | File manager, Memory manager, Drivers
layer: Hardware | CPU, Memory, Disk, Screen
flow: Text editor -> File manager -> Drivers -> Disk -> Drivers -> File manager -> Text editor
note: Drivers = small programs that know how to talk to one piece of hardware
:::

### Windows, macOS and Linux

Three operating systems matter for this site. Windows, made by Microsoft, runs on most office and home computers. macOS, made by Apple, runs on Mac computers. Linux is a free operating system that anyone can copy and change. Linux runs on most servers, which are the computers in data centres that serve web pages and AI models. When you rent a computer in the cloud to train a model, it almost always runs Linux.

| Topic | Windows | macOS | Linux |
| --- | --- | --- | --- |
| Path separator | backslash | forward slash | forward slash |
| Root of the disk | C: | / | / |
| Your personal folder | C:\\Users\\name | /Users/name | /home/name |
| Case in file names | Notes.txt and notes.txt are the same file | the same by default | different files |
| Where it runs | most laptops and desktops | Apple computers | servers, cloud, Raspberry Pi, Android phones |
| Cost | paid, comes with the computer | comes with a Mac | free |

The case row matters for programmers. On Linux, Notes.txt and notes.txt are two different files. A program that works on Windows can fail on a Linux server because of one capital letter. Use lowercase file names to avoid the problem.

### Two special folders

Two names appear in paths again and again. The home folder is your personal folder: C:\\Users\\ada, /Users/ada or /home/ada. Programs often write the home folder as a tilde, which is the character ~. The current folder is the folder a program is working in right now. A path that starts from the root is an absolute path. A path that starts from the current folder is a relative path. If the current folder is Documents, then the relative path notes.txt names the same file as the absolute path /Users/ada/Documents/notes.txt.

The current folder explains most file-not-found errors. Suppose Ada's current folder is her home folder, and she asks a program to open notes.txt. The program looks for /Users/ada/notes.txt. That file does not exist, because the real file is one folder deeper, in Documents. The fix is to give the full path, or to change the current folder to Documents first. In the next module you learn the terminal command that changes the current folder. It is called cd, which is short for change directory.

## Try it

:::exercise
title: Make a folder for this course
task: Create a folder named ilearnai inside your Documents folder. Inside it, create a plain text file named notes.txt and type one line of text into it. Then write down the absolute path of notes.txt for your operating system.
hint: On Windows, right-click in Documents, choose New, then Folder. For the file, open Notepad, type a line, and save as notes.txt inside ilearnai. On macOS, use TextEdit and choose Format, then Make Plain Text, before you save. On Linux, use any text editor.
lang: text
solution:
Windows:  C:\\Users\\YOURNAME\\Documents\\ilearnai\\notes.txt
macOS:    /Users/YOURNAME/Documents/ilearnai/notes.txt
Linux:    /home/YOURNAME/Documents/ilearnai/notes.txt

Replace YOURNAME with your user name.
:::

:::exercise
title: Read a path
task: Read the path /home/sam/projects/robot/main.py on paper. Answer four questions. What is the file name? What is the extension? What is the home folder? Which operating system is this?
hint: Read the path from left to right. The first slash is the root. The last part is the file.
lang: text
solution:
File name: main.py
Extension: py, so it is a Python program
Home folder: /home/sam
Operating system: Linux, because personal folders live under /home
:::

## Common mistakes

- Mistake: you save a file and later cannot find it. Fix: look at the Save dialog and note the folder before you click Save; keep course files in one folder such as Documents/ilearnai.
- Mistake: you type a path with the wrong slash and the program says the file does not exist. Fix: use backslashes on Windows and forward slashes on macOS and Linux.
- Mistake: you name a file hello.py.txt because the editor added .txt. Fix: turn on visible extensions and check the full name after you save.
- Mistake: you think the extension changes the contents. Fix: the extension is a label; renaming photo.jpg to photo.txt does not turn the picture into text.
- Mistake: you think Linux is only for experts. Fix: Linux runs most servers and most AI training, and the commands you learn later work the same on macOS.

## Check your understanding

:::quiz
title: Check: files, folders and the OS
q: Which path names a file on macOS?
- C:\\Users\\ada\\notes.txt
* /Users/ada/notes.txt
- /home/ada/notes.txt
why: macOS puts personal folders under /Users and uses forward slashes; /home is the Linux form.
q: A file is named report.final.csv. What is its extension?
- final
* csv
- report
why: The extension is the part after the last dot.
q: Your program asks to read a file. Which part actually moves the bytes from the disk?
- The text editor
- The CPU alone
* The operating system
why: Programs ask the operating system for files; the operating system talks to the hardware.
q: On which system are Data.csv and data.csv two different files?
- Windows
- macOS by default
* Linux
why: Linux treats upper and lower case letters in file names as different.
q: The current folder is /home/ada/Documents. What does the relative path ilearnai/notes.txt name?
* /home/ada/Documents/ilearnai/notes.txt
- /home/ada/ilearnai/notes.txt
- /ilearnai/notes.txt
why: A relative path is added to the end of the current folder.
:::

## Go further

The Wikipedia pages on operating systems and on paths in the links give the history and the details. The Linux Foundation page explains why Linux runs the cloud. The next lesson, [How a web page reaches you](/courses/start-here/how-a-computer-works/how-the-internet-works), leaves your own computer and explains how two computers talk to each other over the internet.
`,
      links: [
        { label: 'Operating system (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Operating_system', kind: 'article' },
        { label: 'Path (computing) (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Path_(computing)', kind: 'article' },
        { label: 'Filename extension (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Filename_extension', kind: 'article' },
        { label: 'What is Linux? (Linux Foundation)', url: 'https://www.linuxfoundation.org/', kind: 'article' },
      ],
    },
    {
      slug: 'how-the-internet-works',
      title: 'How a web page reaches you',
      summary: 'After this lesson you can trace a web page from the address you type to the screen, and explain what the cloud is.',
      minutes: 21,
      objectives: [
        'Explain the roles of client and server in a request and a response.',
        'Read a URL and name its parts.',
        'Describe what an IP address and the domain name system do.',
        'State the difference between HTTP and HTTPS.',
        'Explain what people mean by the cloud.',
      ],
      keyTerms: ['client', 'server', 'request', 'response', 'URL', 'IP address', 'HTTP', 'cloud'],
      body: `
## What this lesson covers

This lesson follows one web page from the moment you type its address to the moment it appears on your screen. You learn the words client, server, request, response, URL, IP address, HTTP and HTTPS. You also learn what the cloud is, in plain words. At the end you can draw the whole trip on paper.

## Why it matters

Almost every AI system you will build talks over the internet. When a program asks an AI model for an answer, it sends a request to a server and waits for a response. That is exactly what your browser does for a web page. When you deploy your own AI service later in this site, you become the server. The next lesson, [What a program is](/courses/start-here/how-a-computer-works/what-a-program-is), explains the instructions that run on both sides.

:::video
id: s7wmiS2mSXY
why: Watch the first 2 minutes. The video uses a waiter who carries orders between a table and a kitchen. The table is the client, the kitchen is the server, and the waiter carries the request and the response.
:::

## The idea with an example

> **Analogy.** Ordering a pizza by phone works like the web. You are the customer. The pizza shop is the server. You look up the shop's phone number in a directory. You call and give your order: that is the request. The shop makes the pizza and delivers it: that is the response. The shop serves many customers, and each customer gets only what they asked for.

The internet is a set of computers connected by cables, radio and satellites. Your home router connects your devices to a cable that leads to your internet provider. The provider connects to larger cables that cross countries and oceans. Along the way, machines called routers pass each message one hop closer to its destination. A message is cut into small pieces called packets, and each packet finds its own way. The receiving computer puts the packets back together. You never see any of this. You only see the page.

Two kinds of computers take part in a web page. The client is the computer that asks for something. Your laptop or phone is the client. The server is the computer that answers. A server is an ordinary computer in a building called a data centre. It runs all day and waits for requests.

Here is the running example. You open a browser and type www.wikipedia.org, then press Enter. About half a second later the page appears. In that half second, five things happen.

1. The browser reads the address you typed. The address is a uniform resource locator (URL).
2. The browser asks the domain name system (DNS) for the IP address of www.wikipedia.org. An IP address is the number that identifies one computer on the internet, such as 208.80.154.224. DNS is the directory that turns names into numbers.
3. The browser sends a request to that IP address. The request says: give me the page at the path /.
4. The server reads the request, finds the page, and sends a response. The response holds the text of the page.
5. The browser reads the text and draws the page.

The timeline shows the trip with realistic times. The unit is milliseconds, and 1 millisecond is one thousandth of a second.

:::timeline
title: One request for www.wikipedia.org
unit: ms
lane Browser
lane DNS
lane Server
Browser -> DNS: what is the IP of www.wikipedia.org? @0
DNS: look up name @0-20
DNS -> Browser: 208.80.154.224 @20
Browser -> Server: GET / @30
Server: find page @60-90
Server -> Browser: 200 OK and the page @90
Browser: draw page @120-200
:::

Press Next to follow the same trip step by step.

:::scenario
title: A web page reaches your screen
state: address=www.wikipedia.org, ip=unknown, page=none
step: You type www.wikipedia.org and press Enter.
step: The browser asks DNS for the IP address of the name.
state: ip=208.80.154.224
step: The browser sends an HTTP request to the server at that IP address. The request asks for the path /.
state: request=GET /
step: The server finds the page and sends an HTTP response. The response starts with the status code 200, which means OK.
state: response=200 OK, page=received
step: The browser reads the response and draws the page on the screen.
state: screen=Wikipedia home page
:::

## How it works

### The parts of a URL

A URL is the full address of one thing on the web. Read it from left to right. Take the example https://www.wikipedia.org/wiki/Computer.


:::anim
title: One request for www.wikipedia.org, in milliseconds
box browser "Browser" @ 130,330 icon: browser
box dns "DNS" @ 130,150 icon: dns
box router "Home router" @ 420,330 icon: router
box server "Web server" @ 710,330 icon: server
box files "Files" @ 710,150 icon: file
num clock = 0 @ 420,150 suffix: " ms" size: 36 color: green
text url "www.wikipedia.org" @ 130,430 size: 18 color: yellow
text note "Most of the time is travel.|The server works for only 30 ms." @ 420,460 size: 16 color: grey

step: You type www.wikipedia.org and press Enter. The browser needs the IP address of that name.
  show browser, url, clock
step: The browser asks DNS, the directory of the internet. DNS answers with the number 208.80.154.224.
  show dns
  arrow browser -> dns : "IP of www.wikipedia.org?"
  arrow dns -> browser : "208.80.154.224"
  & count clock -> 20
step: The browser sends the request GET / to that address, through the home router and across the internet.
  show router, server
  arrow browser -> router : "GET /"
  arrow router -> server : "GET /"
  & count clock -> 60
step: The server reads the request, finds the page in its files, and builds the response.
  show files
  highlight server
  arrow server -> files : "find /"
  arrow files -> server : "page"
  & count clock -> 90
step: The response travels back the same way. It starts with the status code 200, which means OK.
  restore server
  arrow server -> router : "200 OK"
  arrow router -> browser : "200 OK"
  & count clock -> 120
step: The browser reads the text and draws the page. The clock stops at 200 milliseconds.
  label url "Wikipedia home page"
  & color url green
  count clock -> 200
  show note
  highlight browser
:::

| Part | Example | What it means |
| --- | --- | --- |
| scheme | https | the rules for the conversation, here HTTP with encryption |
| host or domain name | www.wikipedia.org | the name of the server |
| path | /wiki/Computer | which page on that server |
| query (optional) | ?search=cat | extra details after a question mark |

The domain name is for humans. Computers need the IP address. DNS is a world-wide set of servers that answer the question: what is the IP address of this name? Your browser asks DNS first, then uses the number. In the pizza analogy, DNS is the phone directory.

### Request and response

HTTP stands for hypertext transfer protocol. A protocol is a fixed set of rules for a conversation, so that two computers that have never met can still understand each other. HTTP has two halves. The client sends a request. The server sends back a response. A request has a method, a path and optional extra lines called headers. The most common method is GET, which means give me this page. Another common method is POST, which means here is some data for you. A response has a status code and a body. The table lists the status codes you will see most.

| Status code | Meaning | When you see it |
| --- | --- | --- |
| 200 | OK | the page or data arrived |
| 301 | moved | the page has a new address, and the browser follows it |
| 404 | not found | the path does not exist on that server |
| 500 | server error | the server has a bug or is overloaded |

The diagram shows the parts of the system a request travels through.

:::arch
title: A web page from client to server and back
layer: Client | Browser
layer: Network | Home router, Internet, DNS
layer: Server | Web server, Files
flow: Browser -> Home router -> Internet -> Web server -> Files -> Web server -> Internet -> Home router -> Browser
note: Home router = the box in your home that connects your devices to the internet
:::

### HTTP and HTTPS

Plain HTTP sends the request and response as readable text. Any computer on the path, such as the one in a coffee shop, can read it. HTTPS is HTTP with encryption. Encryption scrambles the text so that only the browser and the server can read it. The S stands for secure. Browsers show a padlock icon for HTTPS. Every site that asks for a password must use HTTPS. Every AI service you build later must also use HTTPS, because requests carry private data and secret keys.

### The cloud

The cloud is a marketing word for computers that belong to a company and that you rent over the internet. The computers sit in data centres: large buildings full of servers, with cooling and backup power. Companies such as Amazon, Microsoft and Google rent them by the hour. When a file is in the cloud, it is on a disk in one of those buildings. When an AI model runs in the cloud, it runs on a server there, and your request travels to it exactly as the Wikipedia request did. There is no cloud in the sky. There is only someone else's computer.

### A program can be a client too

A browser is not the only client. Any program can send a request. Later in this site you write a Python program that sends a request to an AI model server. The request is a POST with your question in the body. The response holds the model's answer. The trip is the same as for the Wikipedia page: DNS, a request over HTTPS, work on the server, a response back. The only difference is that a program, not a person, reads the response. Each such request also costs money, because the company that runs the server charges for the work. That is why you will later learn to count requests and to cache answers.

Distance sets the speed. Light in a glass cable travels about 200 kilometres per millisecond. A request from London to a server in New York travels about 5,600 kilometres, so one way takes at least 28 ms and the round trip at least 56 ms. No engineering can beat that limit. A server in the same city answers much faster. This is one reason that companies put servers in many countries.

The bars compare the time a request spends on each part of the trip. The server work is often the smallest part. Most of the time is travel.

:::bars
title: Where the half second goes
unit: ms
DNS lookup: 20
Travel to server: 30
Server work: 30
Travel back: 30
Drawing the page: 80
:::

## Try it

:::exercise
title: Read three URLs
task: Take these three URLs and write down the scheme, the host and the path for each: https://docs.python.org/3/tutorial/index.html, http://example.com/, and https://en.wikipedia.org/wiki/URL. Then say which one is not encrypted.
hint: The scheme is everything before ://. The host runs until the next slash. The path is everything from that slash on.
lang: text
solution:
1. scheme https, host docs.python.org, path /3/tutorial/index.html
2. scheme http, host example.com, path /
3. scheme https, host en.wikipedia.org, path /wiki/URL
The second URL uses plain http, so it is not encrypted.
:::

:::exercise
title: Watch a request happen
task: Open a browser. Open the developer tools with the key F12 on Windows or Linux, or Option, Command and I on macOS. Click the tab named Network. Then load https://example.com/. Find the first line in the list. Write down the method, the status code and the time in milliseconds.
hint: If the list is empty, reload the page while the Network tab is open.
lang: text
solution:
Example answer:
Method: GET
Status: 200
Time: 85 ms
Your time will differ. It depends on your distance from the server.
:::

## Common mistakes

- Mistake: you think the website lives inside your browser. Fix: the page lives on a server; the browser only asks for it and draws it.
- Mistake: you think the cloud is a special kind of storage with no physical place. Fix: the cloud is a server in a data centre, and your data sits on its disk.
- Mistake: you type a password into a page that starts with http:// and no padlock. Fix: only trust pages that use https://.
- Mistake: you think a 404 error means the internet is down. Fix: 404 means the server answered but has no page at that path; check the spelling of the URL.
- Mistake: you think a server is a special machine. Fix: a server is an ordinary computer that runs a program that waits for requests; your laptop can be a server.

## Check your understanding

:::quiz
title: Check: how a web page reaches you
q: Your phone loads a weather page. Which computer is the client?
* Your phone
- The weather company's server
- The DNS server
why: The client is the computer that asks; the server is the computer that answers.
q: What does DNS do?
- It encrypts the request
* It turns a domain name into an IP address
- It stores the web page
why: Computers find each other by IP address, and DNS translates the human name into that number.
q: In https://shop.example.com/cart?item=42, what is the path?
- shop.example.com
* /cart
- item=42
why: The path starts at the first slash after the host and ends before the question mark.
q: A server responds with status code 404. What happened?
- The server is down
* The server has no page at that path
- The page arrived
why: 404 means not found; the server answered but could not find the path.
q: A request takes 20 ms for DNS, 30 ms to travel, 30 ms of server work and 30 ms to travel back. How long until the response arrives?
- 60 ms
- 80 ms
* 110 ms
why: Add the four parts: 20 + 30 + 30 + 30 = 110 ms.
q: Why does an AI service need HTTPS?
- HTTPS makes the server faster
* HTTPS encrypts the request, which carries private data and secret keys
- HTTP cannot carry text
why: Without encryption any computer on the path can read the request, including the secret key.
:::

## Go further

The MDN page on HTTP in the links is the standard reference for the web and starts gently. The Wikipedia pages on the domain name system and on cloud computing fill in the history. The next lesson, [What a program is](/courses/start-here/how-a-computer-works/what-a-program-is), turns to the instructions that the client and the server both follow.
`,
      links: [
        { label: 'HTTP (MDN Web Docs)', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP', kind: 'docs' },
        { label: 'Domain Name System (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Domain_Name_System', kind: 'article' },
        { label: 'IP address (Wikipedia)', url: 'https://en.wikipedia.org/wiki/IP_address', kind: 'article' },
        { label: 'Cloud computing (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Cloud_computing', kind: 'article' },
      ],
    },
    {
      slug: 'what-a-program-is',
      title: 'What a program is',
      summary: 'After this lesson you can explain why a computer needs exact instructions and what a programming language is for.',
      minutes: 19,
      objectives: [
        'Explain what a program is and why its instructions must be exact.',
        'Write a short list of exact steps for a simple task on paper.',
        'Describe what a programming language is and name three.',
        'State the difference between an interpreter and a compiler.',
      ],
      keyTerms: ['program', 'instruction', 'algorithm', 'programming language', 'interpreter', 'compiler', 'bug'],
      body: `
## What this lesson covers

This lesson explains what a program is: a list of exact instructions that a computer follows one at a time. You learn why the instructions must be far more exact than instructions for a person. You learn what a programming language is and why Python is the one this site uses. You also learn, in one paragraph, the difference between an interpreter and a compiler. There is no code yet. That starts in the next module.

## Why it matters

Everything in AI is a program. A model that writes text is a program. The code that trains it is a program. The service that answers your questions is a program. If you understand what a program is and how a computer reads it, writing your first one in [Install Python and run your first file](/courses/start-here/first-python/install-and-run) will feel natural. This lesson also gives you the single most useful habit of a programmer: thinking in exact steps.

:::video
id: 3LPJfIKxwWc
why: Watch from the start to about minute 40. Harvard's first lecture explains binary, algorithms and the idea of exact instructions with a phone book and a sandwich. The rest of the lecture uses a visual tool called Scratch, which you can skip.
:::

## The idea with an example

> **Analogy.** A recipe tells a cook how to make a dish. A good cook fills in the gaps: the recipe says add salt, and the cook knows how much. A computer is a cook with no judgement at all. It does exactly what the recipe says, nothing more and nothing less. If the recipe says add salt and does not say how much, the computer stops and reports an error.

A program is a list of instructions for a computer. An instruction is one small action, such as add these two numbers or show this text on the screen. The computer reads the instructions in order, from the first line to the last, and does each one. It does not guess. It does not skip ahead. It does not notice that a step makes no sense.

Here is the running example. You want to find the largest of three numbers: 4, 9 and 2. For a person, the instruction find the largest is enough. A computer needs every step. Here is a version written for a computer, in English.

1. Set a value called largest to the first number, which is 4.
2. Look at the second number, 9. Is it bigger than largest? Yes. Set largest to 9.
3. Look at the third number, 2. Is it bigger than largest? No. Leave largest as 9.
4. Report largest. The answer is 9.

Every step says exactly what to compare and exactly what to change. A list of exact steps like this is called an algorithm. An algorithm is a method that solves a problem, written as steps that leave nothing to judgement. The same algorithm works for any three numbers, or for a million numbers, because the steps do not depend on the particular values.

:::flow
title: The find-the-largest algorithm
Start -> Set largest: largest = first number
Set largest -> Compare: look at the next number
Compare -> Set largest: bigger, so replace
Compare -> Next number: not bigger, so keep
Next number -> Compare: more numbers remain
Next number -> Report: no numbers remain
:::

Press Next to run the algorithm on 4, 9 and 2 one step at a time.

:::scenario
title: Find the largest of 4 9 2
state: numbers=4 9 2, largest=none
step: Set largest to the first number.
state: largest=4
step: Look at 9. Compare it with largest. 9 is bigger than 4.
state: compare=9 greater than 4
step: Replace largest with 9.
state: largest=9
step: Look at 2. Compare it with largest. 2 is not bigger than 9.
state: compare=2 not greater than 9
step: No numbers remain. Report largest, which is 9.
state: answer=9
:::

## How it works

### Why computers need exactness

The CPU understands only a small set of basic actions: move a number, add two numbers, compare two numbers, jump to another instruction. Every program, including an AI model, is built from billions of these tiny actions. The CPU has no idea what the numbers mean. It does not know that 9 is a price or an age. So a program must spell out every step in terms of these actions. When a step is missing or wrong, the result is a bug. A bug is a mistake in a program that makes it do the wrong thing. Every programmer writes bugs every day. Finding and fixing them is a normal part of the work.


:::anim
title: The computer runs find-the-largest on 4, 9 and 2
rect l1 @ 250,150 size: 320x44 "largest = numbers[0]"
rect l2 @ 250,210 size: 320x44 "for n in numbers:"
rect l3 @ 250,270 size: 320x44 "if n > largest:"
rect l4 @ 250,330 size: 320x44 "largest = n"
rect l5 @ 250,390 size: 320x44 "print(largest)"
text prog "The program, five lines" @ 250,90 size: 16 color: grey
text nums "numbers = [4, 9, 2]" @ 700,90 size: 16 color: grey
rect c1 @ 620,150 size: 70x50 "4"
rect c2 @ 700,150 size: 70x50 "9"
rect c3 @ 780,150 size: 70x50 "2"
dot ptr @ 620,205 r: 8 color: yellow label: "n"
num largest = 0 @ 700,300 prefix: "largest = " size: 28 color: green
text cmp "4 > 4? no" @ 700,370 size: 20 color: red
text out "Output: 9" @ 700,440 size: 26 color: green

step: A program is a list of instructions. The computer reads them in order, one line at a time.
  show prog, l1, l2, l3, l4, l5
  show nums, c1, c2, c3
step: Line 1 runs: set largest to the first number, 4.
  highlight l1
  show largest
  count largest -> 4
  pulse c1
step: Line 2 starts the loop. n is the first number, 4. Line 3 asks: is 4 bigger than 4? No.
  restore l1
  highlight l2
  show ptr
  highlight l3
  show cmp
step: n moves to the next number, 9. Is 9 bigger than largest, 4? Yes.
  restore l3
  move ptr -> 700,205
  label cmp "9 > 4? yes"
  & color cmp green
  highlight l3
step: Line 4 runs: largest becomes 9.
  restore l3
  highlight l4
  count largest -> 9
  pulse c2
step: n moves to the last number, 2. Is 2 bigger than 9? No, so line 4 does not run.
  restore l4
  move ptr -> 780,205
  label cmp "2 > 9? no"
  & color cmp red
  highlight l3
step: No numbers remain. Line 5 reports largest. The screen shows 9.
  restore l3, l2
  hide ptr, cmp
  highlight l5
  show out
  pulse out
:::

Exactness has an upside. A computer follows the same steps the same way every time, at billions of steps per second, without getting tired. A person who found the largest of a million numbers would take days and make mistakes. A computer takes less than a thousandth of a second and makes none, as long as the instructions are right.

### Programming languages

Writing instructions as patterns of 0 and 1 for the CPU is possible, but very slow for humans. A programming language is a language that people can read and write, with exact rules, that a computer can turn into CPU actions. The text you write in a programming language is called source code, or code. Here is how the find-the-largest algorithm looks in a programming language called Python. You do not need to understand it yet. Notice only that it is short, exact and readable.

| Line | Python | In English |
| --- | --- | --- |
| 1 | numbers = [4, 9, 2] | the three numbers |
| 2 | largest = numbers[0] | set largest to the first number |
| 3 | for n in numbers: | for each number n in the list |
| 4 | if n > largest: | if n is bigger than largest |
| 5 | largest = n | replace largest with n |
| 6 | print(largest) | report largest |

There are hundreds of programming languages. Each one makes a different trade between being easy for people and being fast for the machine. The table lists the ones you will hear about most.

| Language | Where it is used | Why it matters for you |
| --- | --- | --- |
| Python | AI, data analysis, scripts, servers | the language of almost all AI work and of this site |
| JavaScript | web pages in the browser, some servers | the language of every interactive web page |
| C and C++ | operating systems, games, the fast parts of AI libraries | very fast, but hard to write |
| SQL | asking questions of databases | you will use it to pull training data |
| Bash | commands typed in the terminal | you will use it to run programs and move files |

This site teaches Python because AI tools are written for it, because its code reads almost like English, and because beginners learn it fastest. Everything you learn about instructions, decisions and repetition transfers to other languages later.

### Interpreter and compiler

A computer cannot run Python source code directly. Something must translate it into CPU actions. There are two ways. An interpreter reads the source code one line at a time and carries out each line right away, like a live translator at a meeting. A compiler reads the whole source code first and translates it into a finished machine program, like a translator who produces a printed book. The finished program then runs on its own. Python uses an interpreter. You write a file, hand it to the Python interpreter, and the interpreter runs it line by line. C uses a compiler. Interpreted languages are easier to try out. Compiled languages usually run faster. For learning, and for most AI work, the interpreter wins.

The diagram shows the path of a Python file from your editor to the screen.

:::arch
title: How a Python program runs
layer: You | Text editor
layer: Translation | Python interpreter
layer: Machine | CPU, Memory, Screen
flow: Text editor -> Python interpreter -> CPU -> Memory -> CPU -> Screen
note: Python interpreter = reads one line of code and turns it into CPU actions
:::

### Three building blocks

Every program, in every language, is built from three kinds of steps. A sequence is steps done one after another. A decision is a step that chooses between two paths based on a comparison, such as if n is bigger than largest. A repetition is a step that repeats other steps, such as for each number in the list. The find-the-largest algorithm uses all three. The next module teaches each one in Python, in this order: sequences in [Variables and types](/courses/start-here/first-python/variables-and-types), decisions in [Decisions with if and else](/courses/start-here/first-python/decisions), and repetition in [Repeating with loops](/courses/start-here/first-python/loops).

## Try it

:::exercise
title: Write exact instructions
task: On paper, write exact instructions for a computer to find the total of the three numbers 4, 9 and 2. Use the style of the find-the-largest algorithm: one small action per step, a named value that you update, and a final report step.
hint: Start a value called total at 0. Then add each number to it in turn. You need one step for each number.
lang: text
solution:
1. Set total to 0.
2. Add the first number, 4, to total. total is now 4.
3. Add the second number, 9, to total. total is now 13.
4. Add the third number, 2, to total. total is now 15.
5. Report total. The answer is 15.
:::

:::exercise
title: Find the bug
task: A friend writes this algorithm to find the smallest of 4, 9 and 2. Step 1: set smallest to 0. Step 2: for each number, if the number is smaller than smallest, replace smallest with it. Step 3: report smallest. The algorithm reports 0, which is wrong. Find the bug and fix it.
hint: Which number does the algorithm compare against first? Is 0 one of the numbers?
lang: text
solution:
The bug is in step 1. smallest starts at 0, but 0 is not in the list.
No number in the list is smaller than 0, so smallest never changes.
Fix: in step 1, set smallest to the first number, 4.
Then 9 is not smaller, 2 is smaller, and the algorithm reports 2.
:::

## Common mistakes

- Mistake: you write an instruction such as pick the best one and expect the computer to know what best means. Fix: write the comparison you mean, such as pick the one with the largest number.
- Mistake: you think a bug means the computer is broken. Fix: a bug is a mistake in the instructions; the computer did exactly what the instructions said.
- Mistake: you think you must learn many languages. Fix: learn Python well; the ideas transfer, and the AI world uses Python.
- Mistake: you think an interpreter and a compiler produce different answers. Fix: both translate the same instructions; they differ in when the translation happens.
- Mistake: you think programs must be long to be useful. Fix: the find-the-largest program is 6 lines and works for a million numbers.

## Check your understanding

:::quiz
title: Check: what a program is
q: Why does a computer need more exact instructions than a person?
- Computers read more slowly than people
* The CPU only does small basic actions and has no judgement
- Computers cannot read English
why: The CPU moves, adds, compares and jumps; everything else must be spelled out from those actions.
q: You run the find-the-largest algorithm on the numbers 3, 8, 8 and 1. What does it report?
- 3
* 8
- 1
why: largest starts at 3, becomes 8 at the second number, and never changes again because 8 is not bigger than 8 and 1 is smaller.
q: A program gives a wrong answer. What is the most likely cause?
- The CPU made an arithmetic error
* The instructions contain a bug
- The disk is full
why: CPUs almost never make arithmetic errors; wrong answers come from wrong instructions.
q: What does an interpreter do?
- It turns the whole program into a machine program before running it
* It reads the source code one line at a time and runs each line right away
- It checks the spelling of the code
why: An interpreter translates and runs as it goes; a compiler translates everything first.
q: Which three building blocks appear in every program?
- Files, folders and paths
* Sequence, decision and repetition
- Input, CPU and screen
why: Steps in order, choices between paths, and repeated steps build every program in every language.
:::

## Go further

The Wikipedia pages on computer programs and on algorithms in the links give the history, from punched cards to today. The CS50 lecture in the video is the best 40 minutes you can spend before you write code. You are now ready for the next module. In [Install Python and run your first file](/courses/start-here/first-python/install-and-run), you install the Python interpreter and run a 1-line program.
`,
      links: [
        { label: 'Computer program (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Computer_program', kind: 'article' },
        { label: 'Algorithm (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Algorithm', kind: 'article' },
        { label: 'Interpreter (computing) (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Interpreter_(computing)', kind: 'article' },
        { label: 'CS50x Lecture 0 notes (Harvard)', url: 'https://cs50.harvard.edu/x/notes/0/', kind: 'course' },
      ],
    },
  ],
}
