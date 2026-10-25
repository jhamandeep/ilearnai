import type { Module } from '../../types'

export const mod: Module = {
  slug: 'first-python',
  title: 'Your first Python',
  description: 'Install Python, run a file from the terminal, and learn the five ideas every program uses: variables, collections, decisions, loops and functions.',
  level: 'foundations',
  lessons: [
    {
      slug: 'install-and-run',
      title: 'Install Python and run your first file',
      summary: 'After this lesson you can install Python 3, open a terminal, create a file named hello.py and run it.',
      minutes: 25,
      objectives: [
        'Install Python 3 on Windows, macOS or Linux and confirm the version in the terminal.',
        'Open a terminal and move to the folder that holds your files.',
        'Create a plain text file named hello.py and run it with the python command.',
        'Read a simple error message and find the line it points to.',
      ],
      keyTerms: ['Python', 'terminal', 'interpreter', 'file', 'path', 'bug'],
      before: [{ label: 'What a program is', to: '/courses/start-here/how-a-computer-works/what-a-program-is' }],
      body: `
## What this lesson covers

This lesson gets Python onto your computer and runs your first program. You learn what the terminal is and how to type a command into it. You create a file named hello.py with one line of code and run it. At the end you can also recognise an error message and know what to do with it.

## Why it matters

Every lesson after this one asks you to run code. Every AI program you build later, from a chat app to a training script, starts the same way: a Python file and a terminal command. If the install goes wrong today, every later lesson becomes harder. So take the time now. The next lesson, [Variables and types](/courses/start-here/first-python/variables-and-types), assumes you can run a file and see its output.

:::video
id: YYXdXT2l-Gg
why: Watch the part for your operating system. The video shows the download page, the install screens and the first run of the python command. Pause and copy each step on your own computer.
:::

## The idea with an example

> **Analogy.** The Python interpreter is a cook who reads recipes written in a special language. Your file is the recipe card. The terminal is the hatch between you and the kitchen. You pass the card through the hatch with a short note that says: cook this. The cook reads the card line by line, does each step, and passes the result back through the hatch.

Python is a programming language. A programming language is a language with exact rules that people can write and a computer can carry out. The Python interpreter is the program that reads your Python file and carries out each line. When people say install Python, they mean install the interpreter. Without it, a .py file is only text.

The terminal is a program where you type commands as text and the computer answers with text. It has no buttons. You type a command, press Enter, and read the reply. Programmers use the terminal every day, because it is faster than clicking and because it works the same way on a laptop and on a server in the cloud. Here is the running example for this lesson.

1. You open the terminal.
2. You type python --version and press Enter. The terminal answers with a line such as Python 3.12.4.
3. You create a text file named hello.py that holds the single line print("Hello, Ada").
4. You type python hello.py and press Enter. The terminal shows Hello, Ada.

The diagram shows the path from your fingers to the screen.

:::flow
title: What happens when you run python hello.py
Terminal -> Operating system: runs the python command
Operating system -> Interpreter: starts it with hello.py
Interpreter -> hello.py: reads line 1
Interpreter -> Terminal: prints Hello, Ada
:::

Press Next to follow the run one step at a time.

:::scenario
title: Running hello.py
state: folder=Documents/ilearnai, screen=empty
step: You type python hello.py in the terminal and press Enter.
state: command=python hello.py
step: The operating system finds the Python interpreter and starts it. It gives the interpreter the file name hello.py.
state: interpreter=running
step: The interpreter looks for hello.py in the current folder and opens it.
state: file=open, line=1
step: The interpreter reads line 1: print("Hello, Ada"). It carries out the instruction and sends the text to the terminal.
state: screen=Hello, Ada
step: There are no more lines. The interpreter stops. The terminal waits for your next command.
state: interpreter=stopped
:::

Notice the third step. The interpreter looks for the file in the current folder. The current folder is the folder the terminal is working in right now. If you are in the wrong folder, the interpreter says it cannot find the file. Most problems in this lesson come from that one fact.

## How it works

### Step 1: install Python

Python has two major versions. Python 2 is old and no longer supported. Python 3 is the current version, and every lesson on this site uses it. Any version from 3.10 up is fine. The table gives the steps for each operating system.

| Operating system | Steps |
| --- | --- |
| Windows | Open python.org/downloads in a browser. Click the yellow Download button. Run the installer. Tick the box Add python.exe to PATH before you click Install Now. |
| macOS | Open python.org/downloads. Click the Download button. Open the .pkg file and click Continue until it finishes. |
| Linux (Ubuntu) | Python 3 is usually already installed. If not, open a terminal and type sudo apt install python3. |

The Windows tick box matters. PATH is the list of folders where the operating system looks for commands. If you do not tick the box, the terminal says that python is not recognised. If you missed it, run the installer again and choose Modify, then tick the box.

### Step 2: open the terminal

| Operating system | How to open the terminal |
| --- | --- |
| Windows | Press the Windows key, type terminal, and open Terminal or Windows PowerShell. |
| macOS | Press Command and Space, type terminal, and press Enter. |
| Linux | Press Control, Alt and T, or search for Terminal in the applications menu. |

A terminal shows a prompt. The prompt is a short line that ends with a symbol such as a dollar sign or a greater-than sign. It means the terminal is ready for a command. Type the command after the prompt and press Enter.

### Step 3: check the version

Type the command below and press Enter.

:::code
lang: bash
python --version
:::

The expected reply is one line.

:::code
lang: text
Python 3.12.4
:::

The numbers on your screen may differ. Any number that starts with 3 is good. If the reply starts with 2, or if the terminal says the command is not found, type python3 --version instead. On macOS and many Linux systems the command is python3. From now on, use whichever of python and python3 worked for you. The lessons write python.

### Step 4: move to your folder

In the lesson on files you created a folder named ilearnai inside Documents. The terminal must work in that folder. The command cd, short for change directory, moves the terminal to a folder. The command pwd, short for print working directory, shows the current folder.

:::code
lang: bash
cd Documents/ilearnai
pwd
:::

On Windows the second command is also pwd in PowerShell. The reply is the absolute path of your folder, for example /Users/ada/Documents/ilearnai or C:\\Users\\ada\\Documents\\ilearnai. If the terminal says there is no such folder, create it first, then try again.

### Step 5: create hello.py

A Python file is a plain text file with the extension .py. Open a plain text editor. On Windows use Notepad. On macOS open TextEdit, choose Format, then Make Plain Text. On any system you can install Visual Studio Code, a free editor made for code. Type exactly this one line.

:::code
lang: python
file: hello.py
print("Hello, Ada")
:::

Save the file as hello.py inside Documents/ilearnai. Check the name after you save. Some editors add .txt, so hello.py becomes hello.py.txt, and the interpreter then cannot find it.

The line has three parts. The word print is a built-in function. A function is a named piece of code that does a job. The parentheses hold what you give to the function. The text inside the double quotes is a string, which means a piece of text. The whole line tells the interpreter: show this text in the terminal.

### Step 6: run it

:::code
lang: bash
python hello.py
:::

:::code
lang: text
Hello, Ada
:::

You have written and run a program. The interpreter read one line and did one thing. Longer programs are the same idea with more lines. The interpreter reads them from top to bottom, one at a time.

### What an error looks like

Now break the program on purpose. Change the line so that the closing parenthesis is missing, save, and run it again.

:::code
lang: python
file: hello.py
print("Hello, Ada"
:::

:::code
lang: text
  File "hello.py", line 1
    print("Hello, Ada"
         ^
SyntaxError: '(' was never closed
:::

Read it from the bottom. The last line names the kind of error, SyntaxError, and says what is wrong: a parenthesis was never closed. A syntax error means the text does not follow the rules of the language, so the interpreter cannot even start. The lines above say which file and which line. The small arrow points near the problem. A mistake in a program is called a bug. Every programmer makes bugs, and the error message is the first tool for fixing them. Put the parenthesis back, save, and run the program again to confirm that it works.

Here is a second common error. Type the command without the file in the right folder.

:::code
lang: text
python: can't open file 'hello.py': [Errno 2] No such file or directory
:::

This is not a bug in your code. The interpreter cannot find the file. Either the terminal is in the wrong folder, or the file has a different name. Type pwd to check the folder and ls (or dir on Windows) to list the files in it.

| Message | Meaning | Fix |
| --- | --- | --- |
| python is not recognized, or command not found | the operating system cannot find the interpreter | reinstall with Add to PATH ticked, or use python3 |
| No such file or directory | the interpreter cannot find your file | cd to the right folder; check the file name |
| SyntaxError | the code breaks a rule of the language | read the line number and look near the arrow |
| NameError: name 'pritn' is not defined | a word is misspelt | fix the spelling |

## Try it

:::exercise
title: Three lines of output
task: Change hello.py so it prints three lines. Line 1 is your own name. Line 2 is the text Python works. Line 3 is the result of 7 + 5, printed as a number, not as text. Run the file and check that the third line shows 12.
hint: Each print call is one line of code. Text goes inside double quotes. A calculation goes without quotes, so the interpreter computes it.
lang: python
solution:
print("Ada")
print("Python works")
print(7 + 5)
:::

:::exercise
title: Read an error
task: Add a fourth line to hello.py that reads print(hello). Note that there are no quotes. Run the file. Write down the kind of error, the line number, and what you think it means. Then remove the line.
hint: Without quotes, the interpreter thinks hello is a name for a stored value. No such name exists yet.
lang: text
solution:
NameError: name 'hello' is not defined
Line 4.
The interpreter looked for a stored value called hello and found none.
Adding quotes turns it into text, and the error goes away.
:::

## Common mistakes

- Mistake: you type python hello.py and the terminal says it cannot open the file. Fix: type pwd to see the current folder, then cd into the folder that holds the file.
- Mistake: the editor saved the file as hello.py.txt. Fix: turn on visible file extensions in the lesson on files, then rename the file to hello.py.
- Mistake: you type the code into the terminal instead of into a file. Fix: the terminal runs commands; the code lives in the file. Type code in the editor, save, then run the file from the terminal.
- Mistake: you use curly quotes copied from a word processor, and Python reports a SyntaxError. Fix: type the quotes in a plain text editor; code needs straight double quotes.
- Mistake: you ignore the error message and change code at random. Fix: read the last line of the error first, then the line number, then look at that line.

## Check your understanding

:::quiz
title: Check: install and run
q: What does the command python hello.py do?
- Opens hello.py in a text editor
* Starts the Python interpreter and tells it to run the file hello.py
- Installs Python into the file hello.py
why: The command runs the interpreter; the file name tells it which program to read.
q: The terminal says: No such file or directory. What is the most likely cause?
- A missing parenthesis in the code
* The terminal is in a folder that does not hold the file
- Python 2 is installed
why: This message comes from the interpreter when it cannot find the file in the current folder.
q: Which line is correct Python that prints the number 12?
- print(7 + 5
- print "7 + 5"
* print(7 + 5)
why: A print call needs an opening and a closing parenthesis, and an expression without quotes is computed.
q: An error message ends with SyntaxError: '(' was never closed. Where do you look first?
- At the top of the file, because errors come from the first line
* At the line number given in the message, near the arrow
- In the terminal settings
why: The message names the file and the line, and the arrow points near the mistake.
q: You run python --version and the reply is Python 2.7.18. What do you do?
- Nothing; version 2 works for this course
* Try python3 --version, or install Python 3 from python.org
- Reinstall the operating system
why: This site uses Python 3; many systems have both versions, and the command python3 selects the new one.
:::

## Go further

The official Python downloads page in the links is the only place to get the installer. The tutorial section Using the Python Interpreter explains the python command in more detail. The Visual Studio Code page shows how to run a Python file inside the editor, which many people prefer after a few days. The next lesson, [Variables and types](/courses/start-here/first-python/variables-and-types), uses hello.py to store values under names and do arithmetic with them.
`,
      links: [
        { label: 'Python downloads', url: 'https://www.python.org/downloads/', kind: 'docs' },
        { label: 'Using the Python Interpreter (Python tutorial)', url: 'https://docs.python.org/3/tutorial/interpreter.html', kind: 'docs' },
        { label: 'Python in Visual Studio Code', url: 'https://code.visualstudio.com/docs/python/python-tutorial', kind: 'docs' },
        { label: 'Python (programming language), Wikipedia', url: 'https://en.wikipedia.org/wiki/Python_(programming_language)', kind: 'article' },
      ],
    },
    {
      slug: 'variables-and-types',
      title: 'Variables and types',
      summary: 'After this lesson you can store values under names, tell the four basic types apart, print them, and convert between them.',
      minutes: 24,
      objectives: [
        'Explain what a variable is and write an assignment such as price = 1.2.',
        'Name the four basic types int, float, str and bool and give an example of each.',
        'Print several values on one line and use type() to check a value.',
        'Convert between a string and a number with int(), float() and str().',
      ],
      keyTerms: ['variable', 'data type', 'integer', 'float', 'string', 'boolean', 'Python'],
      body: `
## What this lesson covers

This lesson teaches the first idea of programming: a variable, which is a name for a stored value. You learn the four basic kinds of value in Python: whole numbers, decimal numbers, text and true-or-false. You learn how to print values, how to ask Python what type a value has, and how to turn text into a number. At the end you can write a file that computes the cost of 3 apples and prints a sentence about it.

## Why it matters

Every program stores values and gives them names. A training script stores the learning rate as a float and the number of steps as an integer. A chat program stores your question as a string. Most beginner errors come from a value having the wrong type, for example text where a number was expected. If you can see types clearly now, those errors become easy to read later. The next lesson, [Lists and dictionaries](/courses/start-here/first-python/lists-and-dicts), stores many values under one name.

:::video
id: rfscVS0vtbw
start: 906
why: Watch from 15:06 to about 38:00. The instructor creates variables, prints strings and does arithmetic with numbers, the same ideas as this lesson. Type along in your own file.
:::

## The idea with an example

> **Analogy.** A variable is a labelled jar on a shelf. You write a label such as price, put a value in the jar, and later ask for the jar by its label. You can empty the jar and put a new value in, and the label stays the same. The kind of thing in the jar is its type: a jar can hold flour or coins, and you cannot do the same things with both.

A variable is a name for a stored value. The line price = 1.2 creates a variable named price and stores the value 1.2 in it. The single equals sign means store the right side under the name on the left. It does not mean the two sides are equal in the school sense. Read it as: price becomes 1.2.

Here is the running example for this module. Ada runs a small shop. One item is apples. The price of apples is 1.2, and the shop has 3 of them in a bag. Apples are in stock. Four facts, four values, four variables.

:::code
lang: python
file: basket.py
name = "apples"
price = 1.2
count = 3
in_stock = True
cost = price * count
print(name, "cost", cost)
:::

:::code
lang: text
apples cost 3.5999999999999996
:::

Each of the first four lines stores one value. The fifth line computes 1.2 times 3 and stores the result under the name cost. The asterisk means multiply. The last line prints three things separated by spaces. The flow shows what the interpreter does with the line cost = price * count.

:::flow
title: What the line cost = price * count does
Interpreter -> Memory: reads price, gets 1.2
Memory -> Interpreter: reads count, gets 3
Interpreter -> CPU: multiplies 1.2 by 3
CPU -> Memory: stores 3.6 under cost
:::

The output surprises most people. The cost shows as 3.5999999999999996 and not 3.6. This is not a bug in your code. Decimal numbers inside a computer are stored in binary, and 1.2 has no exact binary form, in the same way that one third has no exact decimal form. The stored value is very slightly less than 1.2, and 3 times it is very slightly less than 3.6. The error is in the 16th digit. For money and for printing, round the result with round(cost, 2), which gives 3.6.

Press Next to watch the memory as each line runs.

:::scenario
title: The interpreter runs basket.py
state: memory=empty
step: Line 1 stores the text apples under the name name.
state: name=apples
step: Line 2 stores the decimal number 1.2 under the name price.
state: price=1.2
step: Line 3 stores the whole number 3 under the name count.
state: count=3
step: Line 4 stores the value True under the name in_stock.
state: in_stock=True
step: Line 5 reads price and count, multiplies them, and stores the result under cost.
state: cost=3.6
step: Line 6 reads name and cost and prints them with the word cost between them.
state: screen=apples cost 3.6
:::

## How it works

### The four basic types

Every value has a type. The type is the kind of value, and it decides what you can do with the value. Python has four basic types, and the running example uses all four.

| Type | Python name | Example from the shop | What you can do with it |
| --- | --- | --- | --- |
| whole number | int | count = 3 | add, subtract, multiply, divide, compare |
| decimal number | float | price = 1.2 | the same as int, with a decimal point |
| text | str | name = "apples" | join with +, measure with len, compare |
| true or false | bool | in_stock = True | combine with and, or, not; use in decisions |

An integer, type int, is a whole number such as 3, 0 or -7. A float, type float, is a number with a decimal point, such as 1.2 or 3.0. The name is short for floating-point number. A string, type str, is text between quotes, such as "apples". A boolean, type bool, is one of the two values True and False, written with a capital first letter.

The function type tells you the type of any value. Add these lines to basket.py and run it.

:::code
lang: python
print(type(name))
print(type(price))
print(type(count))
print(type(in_stock))
:::

:::code
lang: text
<class 'str'>
<class 'float'>
<class 'int'>
<class 'bool'>
:::

The word class in the output means type. Use type whenever a program behaves strangely. It often shows that a value is a string when you expected a number.

### Names

A variable name is a word you choose. The rules are short. A name holds letters, digits and underscores. It cannot start with a digit. It cannot contain spaces or hyphens. Upper and lower case are different, so Price and price are two different names. Python has about 35 reserved words such as if, for and True, and you cannot use them as names. Good names say what the value means: price, not p; count, not c. Long names join words with underscores: in_stock, total_price.

### Numbers and arithmetic

Python does arithmetic with the usual symbols. The table shows each one with numbers from the shop.

| Symbol | Meaning | Example | Result |
| --- | --- | --- | --- |
| + | add | 3 + 2 | 5 |
| - | subtract | 3 - 2 | 1 |
| * | multiply | 1.2 * 3 | 3.6 |
| / | divide | 7 / 2 | 3.5 |
| // | divide and drop the remainder | 7 // 2 | 3 |
| % | the remainder | 7 % 2 | 1 |
| ** | power | 2 ** 3 | 8 |

Two rules matter. First, a single slash always gives a float, even for 6 / 2, which gives 3.0. Second, when an int meets a float, the result is a float, so 1.2 * 3 is a float. Multiplication and division happen before addition and subtraction, as in school, and parentheses change the order: (1 + 2) * 3 is 9.

### Changing a variable

A variable can take a new value at any time. The new value replaces the old one. Many programs use a line like count = count + 1. Read it in two halves. First the interpreter computes the right side with the old count, which is 3, and gets 4. Then it stores 4 under count. Python has a short form: count += 1 means the same thing.

:::code
lang: python
count = 3
count = count + 1
print(count)
:::

:::code
lang: text
4
:::

### Strings

A string is a sequence of characters. You can write it with double quotes or single quotes; this site uses double quotes. The plus sign joins two strings. The function len gives the number of characters, which is an int. A string that looks like a number is still text.

:::code
lang: python
name = "apples"
print(name + " and pears")
print(len(name))
print("3" + "4")
:::

:::code
lang: text
apples and pears
6
34
:::

The last line shows the trap. The strings "3" and "4" joined with + give "34", not 7, because + on strings means join. To do arithmetic, you need numbers.

### Converting between types

Three functions convert values. int("3") turns the text "3" into the number 3. float("1.2") turns "1.2" into 1.2. str(3.6) turns the number 3.6 into the text "3.6". You need these every time a value arrives as text, which is what the keyboard and most files give you. The function input reads a line of text that the user types. It always returns a string, even when the user types digits.

:::code
lang: python
file: ask.py
price = 1.2
answer = input("How many apples? ")
count = int(answer)
print("That costs", round(price * count, 2))
:::

:::code
lang: text
How many apples? 3
That costs 3.6
:::

Without int, the line price * count would fail, because Python cannot multiply a float by a string. The error would say: can't multiply sequence by non-int of type 'float'. When you see an error about types, think: which value is text that should be a number?

Adding a string and a number also fails. The line print("Cost: " + cost) gives a TypeError, because cost is a float. Either convert with str(cost), or give print two separate values with a comma, as the running example does.

## Try it

:::exercise
title: A second item
task: Add a second item to basket.py: bread, price 2.5, count 2. Compute the cost of the bread and the total cost of both items. Print the total rounded to 2 decimal places. The expected total is 8.6.
hint: Use new names such as bread_price and bread_count so that the apple values are not replaced. The total is apple cost plus bread cost.
lang: python
solution:
name = "apples"
price = 1.2
count = 3
cost = price * count

bread_price = 2.5
bread_count = 2
bread_cost = bread_price * bread_count

total = cost + bread_cost
print("Total:", round(total, 2))
:::

:::exercise
title: Predict the type
task: On paper, write the type of each value: 7, 7.0, "7", 7 / 7, 7 // 7, len("seven"), 3 > 2. Then check each one in a file with type().
hint: A slash gives a float. Two slashes give an int. Comparisons give booleans.
lang: text
solution:
7          int
7.0        float
"7"        str
7 / 7      float (the value is 1.0)
7 // 7     int (the value is 1)
len("seven")  int (the value is 5)
3 > 2      bool (the value is True)
:::

## Common mistakes

- Mistake: you read price = 1.2 as a statement that price equals 1.2 and think a later price = 2.0 is a contradiction. Fix: the equals sign means store; the second line replaces the first value.
- Mistake: you type "3" + "4" and expect 7. Fix: quotes make text; remove the quotes or convert with int.
- Mistake: you treat the value from input as a number and get a TypeError. Fix: input always gives a string; wrap it in int or float.
- Mistake: you write true or false in lower case and get a NameError. Fix: the booleans are True and False with a capital letter.
- Mistake: you see 3.5999999999999996 and think the computer is broken. Fix: floats are stored in binary and are not exact; round the value when you print it.

## Check your understanding

:::quiz
title: Check: variables and types
q: What does the line count = 3 do?
- Checks whether count is 3
* Stores the value 3 under the name count
- Prints the number 3
why: A single equals sign assigns the value on the right to the name on the left.
q: After price = 1.2 and count = 3, what is the type of price * count?
- int
* float
- str
why: When an int meets a float in arithmetic, the result is a float.
q: What does print("3" + "4") show?
- 7
* 34
- An error
why: The plus sign joins two strings; it only adds when both values are numbers.
q: The user types 5 at an input prompt. Which line turns the reply into a number you can multiply?
- count = answer
* count = int(answer)
- count = str(answer)
why: input returns a string, and int converts a string of digits into a whole number.
q: After x = 10 and x = x - 4, what is x?
- 10
* 6
- 4
why: The right side uses the old value of x, which is 10, and the result 6 replaces it.
q: Which name is a valid Python variable name?
- 2nd_price
- total price
* total_price
why: Names cannot start with a digit or contain spaces; underscores join words.
:::

## Go further

The Python tutorial section An Informal Introduction to Python in the links walks through numbers and strings with many small examples you can type. The page on floating-point arithmetic explains why 1.2 times 3 is not exactly 3.6, and you can read its first section now. The next lesson, [Lists and dictionaries](/courses/start-here/first-python/lists-and-dicts), stores all the items in the shop under one name instead of one variable per item.
`,
      links: [
        { label: 'An Informal Introduction to Python (Python tutorial)', url: 'https://docs.python.org/3/tutorial/introduction.html', kind: 'docs' },
        { label: 'Built-in types (Python docs)', url: 'https://docs.python.org/3/library/stdtypes.html', kind: 'docs' },
        { label: 'Floating-Point Arithmetic: Issues and Limitations', url: 'https://docs.python.org/3/tutorial/floatingpoint.html', kind: 'docs' },
        { label: 'Learn Python, full course (freeCodeCamp)', url: 'https://www.youtube.com/watch?v=rfscVS0vtbw', kind: 'video' },
      ],
    },
    {
      slug: 'lists-and-dicts',
      title: 'Lists and dictionaries',
      summary: 'After this lesson you can store many values under one name with a list, look values up by key with a dictionary, and read, add and count items in both.',
      minutes: 24,
      objectives: [
        'Write a list and read an item by its index, starting from 0.',
        'Add an item to a list with append and count items with len.',
        'Write a dictionary and look up a value by its key.',
        'Choose between a list and a dictionary for a given set of data.',
      ],
      keyTerms: ['list', 'index', 'dictionary', 'variable', 'string', 'data type'],
      body: `
## What this lesson covers

This lesson teaches the two containers that hold most data in Python. A list is an ordered collection of values, such as the prices of the items in a shop. A dictionary is a set of key-value pairs, such as the price of each item by its name. You learn to read an item by position or by key, to add items, and to count them. At the end you can store the whole shop in two variables instead of ten.

## Why it matters

Data in AI comes in groups. A sentence is a list of words. A training set is a list of examples. The reply from an AI service is a dictionary with keys such as model, content and usage. Almost every line of AI code reads from a list or a dictionary, so this lesson gives you a habit you will use daily. The next lesson, [Decisions with if and else](/courses/start-here/first-python/decisions), makes the program choose between actions based on the values in these containers.

:::video
id: rfscVS0vtbw
start: 3790
why: Watch from 1:03:10 to about 1:19:00 for lists and list functions. Then jump to 2:07:17 for dictionaries, about 6 minutes. Type the examples into your own file.
:::

## The idea with an example

> **Analogy.** A list is a row of numbered shelves in a storeroom. Shelf 0 holds the first thing, shelf 1 the second, and so on. To fetch something, you say the shelf number. A dictionary is a wall of labelled drawers. Each drawer has a name on the front, such as bread, and you open it by name. You do not care where on the wall the drawer sits.

In the last lesson Ada's shop had one item per variable. A shop with 50 items would need 50 variables, and a loop could not visit them. A list solves this. A list is an ordered collection of values written between square brackets and separated by commas. Here are the three items of the running example and their prices as two lists.

:::code
lang: python
file: shop.py
items = ["apples", "bread", "milk"]
prices = [1.2, 2.5, 0.99]
print(items[0], "costs", prices[0])
print(items[2], "costs", prices[2])
print(len(items), "items")
:::

:::code
lang: text
apples costs 1.2
milk costs 0.99
3 items
:::

The number in square brackets after a list name is the index. The index is the position of an item, counted from 0, not from 1. So items[0] is "apples", items[1] is "bread" and items[2] is "milk". There is no items[3]. The function len gives the number of items, which is 3. The highest index is always one less than the length.

| Index | 0 | 1 | 2 |
| --- | --- | --- | --- |
| items | "apples" | "bread" | "milk" |
| prices | 1.2 | 2.5 | 0.99 |

Two parallel lists work, but you must keep them in step. A dictionary holds the same facts in a way that cannot fall out of step. A dictionary is a collection of key-value pairs written between curly brackets. Each pair is a key, a colon, and a value. You look a value up by its key.

:::code
lang: python
file: shop.py
prices = {"apples": 1.2, "bread": 2.5, "milk": 0.99}
print("bread costs", prices["bread"])
prices["eggs"] = 3.0
print(len(prices), "items")
:::

:::code
lang: text
bread costs 2.5
4 items
:::

The flow shows how the interpreter answers prices["bread"].

:::flow
title: How prices["bread"] finds a value
Interpreter -> Dictionary: asks for the key bread
Dictionary -> Key bread: finds the matching key
Key bread -> Value 2.5: follows the pair
Value 2.5 -> Interpreter: returns 2.5
:::

Press Next to build the list and the dictionary one step at a time.

:::scenario
title: Building the shop
state: items=empty list, prices=empty dict
step: The line items = [] creates an empty list.
state: items=[]
step: The call items.append("apples") adds apples at the end. The list now has 1 item at index 0.
state: items=[apples]
step: The call items.append("bread") adds bread at index 1.
state: items=[apples, bread]
step: The line prices = {} creates an empty dictionary.
state: prices={}
step: The line prices["apples"] = 1.2 adds a pair: key apples, value 1.2.
state: prices={apples: 1.2}
step: The line prices["bread"] = 2.5 adds a second pair. Both len(items) and len(prices) are now 2.
state: prices={apples: 1.2, bread: 2.5}, len=2
:::

## How it works

### Working with a list

A list has a small set of actions you use all the time. The table shows them with the items list from the running example, where items is ["apples", "bread", "milk"].

| Action | Code | Result |
| --- | --- | --- |
| read by index | items[1] | "bread" |
| read from the end | items[-1] | "milk" |
| count items | len(items) | 3 |
| add at the end | items.append("eggs") | items becomes ["apples", "bread", "milk", "eggs"] |
| replace an item | items[0] = "pears" | items becomes ["pears", "bread", "milk"] |
| remove by value | items.remove("bread") | items becomes ["apples", "milk"] |
| check membership | "milk" in items | True |
| take a part | items[0:2] | ["apples", "bread"] |

Three details deserve a closer look. A negative index counts from the end, so items[-1] is the last item and items[-2] the one before. The notation items[0:2] is a slice. It gives the items from index 0 up to but not including index 2, so 2 items. The word in asks whether a value appears anywhere in the list and gives a boolean.

The line items.append("eggs") has a new shape. The dot means: do this action on this list. An action attached to a value with a dot is called a method. append is a method of lists. It changes the list in place and returns nothing, so write items.append("eggs") on its own line, never items = items.append("eggs").

A list can hold values of any type, and the types can be mixed. A list can hold other lists, which is how a table is stored: a list of rows, where each row is a list of values. You will meet that shape in the data module.

### Working with a dictionary

The dictionary actions mirror the list actions, with a key in place of an index. The table uses prices, which is {"apples": 1.2, "bread": 2.5, "milk": 0.99}.

| Action | Code | Result |
| --- | --- | --- |
| read by key | prices["milk"] | 0.99 |
| add or replace | prices["eggs"] = 3.0 | a new pair, or a new value for an existing key |
| count pairs | len(prices) | 3 |
| check a key | "bread" in prices | True |
| read safely | prices.get("tea", 0) | 0, because there is no key tea |
| remove a pair | del prices["milk"] | the milk pair is gone |
| all keys | list(prices.keys()) | ["apples", "bread", "milk"] |
| all values | list(prices.values()) | [1.2, 2.5, 0.99] |

Keys must be unique. Writing prices["apples"] = 1.5 does not add a second apples key; it replaces the value 1.2 with 1.5. Keys are usually strings, but integers work too. Values can be anything, including lists and other dictionaries. Reading a key that does not exist, such as prices["tea"], stops the program with a KeyError. When a key might be missing, use the get method with a fallback value, as the table shows.

### Nesting

Real data nests. A dictionary value can be a list, and a list item can be a dictionary. Here is the shop as a list of dictionaries, one per item, with three facts each.

:::code
lang: python
file: shop.py
shop = [
    {"name": "apples", "price": 1.2, "count": 3},
    {"name": "bread", "price": 2.5, "count": 2},
    {"name": "milk", "price": 0.99, "count": 1},
]
print(shop[1]["name"], "costs", shop[1]["price"])
print(len(shop), "items")
:::

:::code
lang: text
bread costs 2.5
3 items
:::

Read shop[1]["name"] from left to right. First shop[1] picks the second dictionary. Then ["name"] picks the value under the key name in that dictionary. The answer is "bread". This shape, a list of dictionaries, is the most common shape in data work. A table in a file becomes a list of rows, and each row becomes a dictionary from column name to value.

### Choosing between a list and a dictionary

| Question | Use a list | Use a dictionary |
| --- | --- | --- |
| Does order matter? | yes, such as the words of a sentence | no, such as settings |
| How do you find an item? | by position, or by walking through all of them | by a name you know |
| Can the same value appear twice? | yes | keys cannot repeat; values can |
| Typical AI example | the tokens of a prompt; a batch of examples | the reply from a model; a configuration |

The rule of thumb is short. If you think in terms of first, second, third, use a list. If you think in terms of the price of bread, use a dictionary.

## Try it

:::exercise
title: Shop inventory
task: Write stock.py. Make a dictionary named stock where the keys are the three items apples, bread and milk and the values are the counts 3, 2 and 1. Add a fourth item, eggs, with count 12. Print the count of bread, the number of items, and whether tea is in stock. Then make a list named low that holds the names of the items with a count below 3 by writing them by hand. Print it.
hint: A count is an int, so no quotes around 3. The membership test is the word in. For now, build the low list by hand with square brackets; the loops lesson shows how to build it automatically.
lang: python
solution:
stock = {"apples": 3, "bread": 2, "milk": 1}
stock["eggs"] = 12
print("bread:", stock["bread"])
print(len(stock), "items")
print("tea" in stock)
low = ["bread", "milk"]
print(low)
:::

:::exercise
title: Predict the output
task: On paper, predict what each print shows. Then run the code to check. The list is colours = ["red", "green", "blue", "black"].
hint: Count indexes from 0. A slice stops before its second number.
lang: python
solution:
colours = ["red", "green", "blue", "black"]
print(colours[1])        # green
print(colours[-1])       # black
print(colours[1:3])      # ['green', 'blue']
print(len(colours))      # 4
print("blue" in colours) # True
colours.append("white")
print(len(colours))      # 5
:::

## Common mistakes

- Mistake: you ask for items[3] in a list of 3 items and get an IndexError. Fix: indexes start at 0, so the last index is len minus 1; use items[-1] for the last item.
- Mistake: you write items = items.append("eggs") and items becomes None. Fix: append changes the list in place; call it on its own line.
- Mistake: you read prices["tea"] for a key that does not exist and the program stops with a KeyError. Fix: check with the word in first, or use prices.get("tea", 0).
- Mistake: you use a list of names and a list of prices and they fall out of step after one remove. Fix: use a dictionary so each name sits next to its own price.
- Mistake: you write a dictionary with an equals sign between key and value, such as {"apples" = 1.2}. Fix: a colon separates a key from its value.

## Check your understanding

:::quiz
title: Check: lists and dictionaries
q: In the list prices = [1.2, 2.5, 0.99], what is prices[1]?
- 1.2
* 2.5
- 0.99
why: Indexes start at 0, so index 1 is the second item.
q: After items = ["apples", "bread"] and items.append("milk"), what is len(items)?
- 2
* 3
- 4
why: append adds one item at the end, so the list grows from 2 items to 3.
q: You have the price of each item and want to find the price of bread quickly by name. Which container fits?
- A list of prices
* A dictionary from name to price
- A string
why: A dictionary looks up a value by its key; a list only knows positions.
q: What does prices["tea"] do when there is no key tea?
- Returns 0
- Returns None
* Stops the program with a KeyError
why: Reading a missing key is an error; use get with a fallback when a key might be missing.
q: With shop = [{"name": "apples", "price": 1.2}, {"name": "bread", "price": 2.5}], what is shop[0]["price"]?
* 1.2
- 2.5
- "apples"
why: shop[0] is the first dictionary, and ["price"] picks its price value.
q: What does items[1:3] give for items = ["a", "b", "c", "d"]?
- ["b", "c", "d"]
* ["b", "c"]
- ["a", "b", "c"]
why: A slice starts at the first index and stops before the second index.
:::

## Go further

The Python tutorial section on lists and the section on data structures in the links show every list and dictionary method with examples. Read the parts on lists and dictionaries, and skip the rest for now. The next lesson, [Decisions with if and else](/courses/start-here/first-python/decisions), teaches the program to act differently depending on a value, for example to warn when the stock of an item is low.
`,
      links: [
        { label: 'Lists (Python tutorial)', url: 'https://docs.python.org/3/tutorial/introduction.html#lists', kind: 'docs' },
        { label: 'Data Structures: lists and dictionaries (Python tutorial)', url: 'https://docs.python.org/3/tutorial/datastructures.html', kind: 'docs' },
        { label: 'Associative array, Wikipedia', url: 'https://en.wikipedia.org/wiki/Associative_array', kind: 'article' },
      ],
    },
    {
      slug: 'decisions',
      title: 'Decisions with if and else',
      summary: 'After this lesson you can write a comparison, combine conditions with and, or and not, and make a program choose between actions with if, elif and else.',
      minutes: 22,
      objectives: [
        'Write a comparison such as total > 4 and say whether it is True or False.',
        'Combine conditions with and, or and not and predict the result.',
        'Write an if, elif and else block with correct indentation.',
        'Predict which lines run for a given value.',
      ],
      keyTerms: ['condition', 'boolean', 'indentation', 'variable', 'float', 'list'],
      body: `
## What this lesson covers

This lesson teaches the program to choose. You learn how a comparison such as total > 4 gives a boolean, which is a value that is either True or False. You learn the words and, or and not. Then you learn the if statement, which runs a block of code only when a condition is True, and its partners elif and else. At the end you can write a program that prints a different message for a small, a medium and a large order.

## Why it matters

Every useful program makes decisions. A chat app checks whether the user typed quit. A training script checks whether the loss stopped falling. An agent checks whether a tool call succeeded before it continues. All of these are if statements. This lesson also introduces indentation, the way Python marks which lines belong together, and you will use it in every loop and function from here on. The next lesson, [Repeating with loops](/courses/start-here/first-python/loops), puts an if inside a loop to check every item in a list.

:::video
id: rfscVS0vtbw
start: 6006
why: Watch from 1:40:06 to about 2:00:00. The instructor writes if statements and comparisons, the same ideas as this lesson. Type the examples and change the values to see which lines run.
:::

## The idea with an example

> **Analogy.** A decision in a program is a fork in a road with a sign. The sign asks a yes-or-no question, such as: is the basket worth more than 4? If yes, you take the left road. If no, you take the right road. Both roads join again further on, and the walk continues. The program reads the sign once, takes one road, and never walks the other.

A condition is a test that gives True or False. The comparison total > 4 is a condition. It asks whether the value of total is greater than 4. If total is 4.69, the answer is True. If total is 3.6, the answer is False. These two values, True and False, are booleans, and a boolean is the type of every answer to a yes-or-no question.

Here is the running example. Ada's shop gives free delivery on orders over 4. The three prices are 1.2, 2.5 and 0.99, and the total is 4.69. The program decides whether to print the free delivery message.

:::code
lang: python
file: delivery.py
total = 1.2 + 2.5 + 0.99
print("Total:", round(total, 2))
if total > 4:
    print("Free delivery")
else:
    print("Delivery costs 1.5")
print("Thank you")
:::

:::code
lang: text
Total: 4.69
Free delivery
Thank you
:::

Four lines deserve a close look. The line if total > 4: ends with a colon. The line below it starts with 4 spaces. Those spaces are the indentation, and they mark the block of lines that belong to the if. The line else: also ends with a colon and has its own indented block. The last print has no indentation, so it is outside both blocks and runs every time. The flow shows the two roads.

:::flow
title: The fork in delivery.py
Compute total -> Is total over 4: 4.69
Is total over 4 -> Free delivery: yes
Is total over 4 -> Delivery costs 1.5: no
Free delivery -> Thank you: join
Delivery costs 1.5 -> Thank you: join
:::

Press Next to follow the interpreter through the file.

:::scenario
title: The interpreter runs delivery.py
state: total=none
step: Line 1 adds the three prices and stores 4.69 under total.
state: total=4.69
step: Line 2 prints the total.
state: screen=Total: 4.69
step: Line 3 tests the condition total > 4. The value is 4.69, so the test gives True.
state: condition=True
step: Because the condition is True, the interpreter runs the indented block under if and prints Free delivery.
state: screen=Free delivery
step: The interpreter skips the else block without reading it.
state: skipped=else block
step: Line 8 has no indentation, so it runs. The program prints Thank you and ends.
state: screen=Thank you
:::

Now change line 1 so the total is 3.6. The test gives False. The interpreter skips the if block and runs the else block. The output is Total: 3.6, then Delivery costs 1.5, then Thank you. One program, two behaviours, chosen by one condition.

## How it works

### Comparisons

Python has six comparison operators. Each one takes two values and gives a boolean. The examples use total = 4.69 and count = 3 from the shop.

| Operator | Meaning | Example | Result |
| --- | --- | --- | --- |
| == | equal to | count == 3 | True |
| != | not equal to | count != 3 | False |
| > | greater than | total > 4 | True |
| < | less than | total < 4 | False |
| >= | greater than or equal to | count >= 3 | True |
| <= | less than or equal to | count <= 2 | False |

The double equals sign is the one that beginners mix up most. One equals sign stores a value: count = 3. Two equals signs compare: count == 3. Python refuses a single equals sign inside an if, and the error says: invalid syntax. Comparisons also work on strings. The test name == "apples" is True when name holds exactly that text, with the same case.

You can store a boolean in a variable, and you can print a comparison directly.

:::code
lang: python
total = 4.69
free = total > 4
print(free)
print(type(free))
print(total == 4.69, total < 1)
:::

:::code
lang: text
True
<class 'bool'>
True False
:::

### Combining conditions with and, or and not

Three words combine booleans. The word and gives True only when both sides are True. The word or gives True when at least one side is True. The word not flips a boolean. The table shows every case.

| a | b | a and b | a or b | not a |
| --- | --- | --- | --- | --- |
| True | True | True | True | False |
| True | False | False | True | False |
| False | True | False | True | True |
| False | False | False | False | True |

In the shop, free delivery might need an order over 4 and a customer in the city. With total = 4.69 and in_city = False, the test total > 4 and in_city is True and False, which is False. The test total > 4 or in_city is True or False, which is True. The test not in_city is True. Use parentheses when you mix and with or, so that the order is clear: (total > 4 and in_city) or total > 20.

### The if statement

The general shape has four rules.

1. Write if, then a condition, then a colon.
2. Indent every line of the block by 4 spaces. The block is the code that runs when the condition is True.
3. Add zero or more elif lines, each with its own condition and block. The word elif is short for else if. Python checks them in order and runs the first block whose condition is True.
4. Add an optional else line with a block that runs when no condition was True.

Here is the shop with three sizes of order.

:::code
lang: python
file: size.py
total = 4.69
if total >= 20:
    print("Large order: free delivery and a gift")
elif total > 4:
    print("Medium order: free delivery")
else:
    print("Small order: delivery costs 1.5")
:::

:::code
lang: text
Medium order: free delivery
:::

The interpreter tests total >= 20 first. It is False, so it tests total > 4. That is True, so it runs the second block and skips the rest. Exactly one block runs, even if several conditions are True, because testing stops at the first match. The order of the tests matters. If the two tests were swapped, a total of 25 would print the medium message, because 25 > 4 is True and testing stops there.

### Indentation

Python uses indentation where other languages use brackets. The rule is strict. Every line in a block has the same number of leading spaces, and the standard is 4. The block ends at the first line that returns to the previous level. Press the space bar 4 times, or set your editor to insert 4 spaces when you press Tab. Never mix tabs and spaces in one file. If the indentation is wrong, the interpreter stops with an IndentationError before it runs anything.

Blocks can nest. An if inside an if is indented 8 spaces. Each level adds 4.

:::code
lang: python
total = 4.69
in_city = True
if total > 4:
    print("Free delivery")
    if in_city:
        print("Arrives today")
print("Thank you")
:::

:::code
lang: text
Free delivery
Arrives today
Thank you
:::

### Conditions on lists and strings

Comparisons are not the only conditions. The word in gives True when a value is inside a list, a dictionary or a string. An empty list, an empty string and the number 0 count as False in an if. Everything else counts as True. The test if items: means: if the list has at least one item.

:::code
lang: python
items = ["apples", "bread", "milk"]
if "milk" in items:
    print("Milk is on the list")
if not items:
    print("The list is empty")
else:
    print(len(items), "items to buy")
:::

:::code
lang: text
Milk is on the list
3 items to buy
:::

## Try it

:::exercise
title: Stock warning
task: Write stock_check.py. Store an item name and its count. Print one of three messages: Out of stock when the count is 0, Low stock when the count is 1 to 4, and In stock otherwise. Test it with the counts 0, 3 and 12 by changing the variable and running the file three times.
hint: Test for 0 first with ==. Then test count < 5 with elif. The else catches everything else. Each block is one indented print.
lang: python
solution:
name = "bread"
count = 3
if count == 0:
    print(name, "- Out of stock")
elif count < 5:
    print(name, "- Low stock")
else:
    print(name, "- In stock")
:::

:::exercise
title: Predict the booleans
task: On paper, write True or False for each expression, with total = 4.69, count = 3 and in_city = False. Then check in a file with print.
hint: Work out each comparison first, then apply not, then and, then or.
lang: text
solution:
total > 4                      True
count == 3 and in_city         False
count == 3 or in_city          True
not in_city                    True
total < 5 and count >= 3       True
total > 10 or not in_city      True
:::

## Common mistakes

- Mistake: you write if count = 3: with one equals sign and get a SyntaxError. Fix: compare with two equals signs; one equals sign stores a value.
- Mistake: you forget the colon at the end of the if line. Fix: every if, elif and else line ends with a colon.
- Mistake: you indent the block with 2 spaces on one line and 4 on the next and get an IndentationError. Fix: use exactly 4 spaces for every line in a block.
- Mistake: you put the broad test first, such as if total > 4 before elif total >= 20, so the large order never matches. Fix: test the most specific condition first.
- Mistake: you write if x > 5 or 10: and expect it to test both numbers. Fix: each side of or needs a full comparison: x > 5 or x > 10.

## Check your understanding

:::quiz
title: Check: decisions
q: What does the comparison 3 >= 3 give?
- 3
* True
- False
why: Greater than or equal to includes the equal case, and a comparison always gives a boolean.
q: With total = 3.6, which line does delivery.py print after the total?
- Free delivery
* Delivery costs 1.5
- Nothing
why: The condition total > 4 is False, so the else block runs.
q: Which line is a correct test for whether count is 3?
- if count = 3:
* if count == 3:
- if count == 3
why: A comparison uses two equals signs, and an if line ends with a colon.
q: With a = True and b = False, what is a and not b?
* True
- False
- An error
why: not b is True, and True and True is True.
q: In an if, elif, else chain with conditions that are all True, how many blocks run?
- All of them
* Only the first one
- None
why: Python tests the conditions in order and stops at the first True one.
q: A line after an if block has no indentation. When does it run?
- Only when the condition is True
- Only when the condition is False
* Every time, because it is outside the block
why: Indentation marks the block; an unindented line belongs to the main program.
:::

## Go further

The Python tutorial section on control flow in the links covers if statements, and the page on comparisons in the Python reference lists every operator. The Wikipedia page on Boolean algebra shows where and, or and not come from. The next lesson, [Repeating with loops](/courses/start-here/first-python/loops), repeats a block for every item in a list, and puts an if inside the loop to check each item.
`,
      links: [
        { label: 'if statements (Python tutorial)', url: 'https://docs.python.org/3/tutorial/controlflow.html#if-statements', kind: 'docs' },
        { label: 'Comparisons (Python reference)', url: 'https://docs.python.org/3/reference/expressions.html#comparisons', kind: 'docs' },
        { label: 'Boolean algebra, Wikipedia', url: 'https://en.wikipedia.org/wiki/Boolean_algebra', kind: 'article' },
      ],
    },
    {
      slug: 'loops',
      title: 'Repeating with loops',
      summary: 'After this lesson you can repeat a block for every item in a list with for, count with range, repeat until a condition changes with while, and build a running total.',
      minutes: 24,
      objectives: [
        'Write a for loop that visits every item in a list.',
        'Use range to repeat a block a fixed number of times.',
        'Write a while loop that stops when a condition becomes False.',
        'Compute a running total, a count and a largest value with an accumulator.',
      ],
      keyTerms: ['loop', 'accumulator', 'list', 'condition', 'indentation', 'variable'],
      body: `
## What this lesson covers

This lesson teaches repetition. A loop is a statement that runs a block of code many times. You learn the for loop, which runs once per item in a list, and the while loop, which runs as long as a condition stays True. You learn the accumulator pattern, where a variable such as a running total grows on every pass. At the end you can add up the prices in Ada's shop, count the items, and find the most expensive one, with code that works for 3 items or 3 million.

## Why it matters

Training an AI model is a loop. The program takes a batch of examples, computes an error, adjusts the model, and repeats, often millions of times. Reading a file is a loop over its lines. An agent is a loop that plans, acts and observes until it has an answer. If you understand the running total in this lesson, you understand the shape of every one of those loops. The next lesson, [Functions](/courses/start-here/first-python/functions), wraps the loop in a name so you can reuse it.

:::video
id: rfscVS0vtbw
start: 8924
why: Watch from 2:28:44 for about 8 minutes on for loops, then from 2:13:21 for about 4 minutes on while loops. Run each example and change the list.
:::

## The idea with an example

> **Analogy.** A cashier adds up a basket. She starts with 0 on the till. She picks up the first item, adds its price to the till, and puts it aside. She picks up the next item and does the same. When no items remain, the number on the till is the total. She does the same small action for every item, and she never needs to know in advance how many items there are.

A for loop does what the cashier does. It takes a list and runs a block of code once for each item. Each time through, a variable holds the current item. One pass through the block is called an iteration. Here is the running example, the three prices in Ada's shop: 1.2, 2.5 and 0.99.

:::code
lang: python
file: total.py
prices = [1.2, 2.5, 0.99]
total = 0
for price in prices:
    total = total + price
    print("Added", price, "total is now", round(total, 2))
print("Final total:", round(total, 2))
:::

:::code
lang: text
Added 1.2 total is now 1.2
Added 2.5 total is now 3.7
Added 0.99 total is now 4.69
Final total: 4.69
:::

Read the loop line as: for each price in prices, do the block below. The variable price is new. Python creates it and sets it to the first item, 1.2, runs the block, sets it to 2.5, runs the block, sets it to 0.99, runs the block, and stops. The block is the two indented lines, exactly as in an if statement. The last print is not indented, so it runs once, after the loop.

The variable total is an accumulator. An accumulator is a variable that a loop updates on every pass. It starts at 0 before the loop. Inside the loop, the line total = total + price reads the old total, adds the current price, and stores the result back. After three passes it holds 4.69. The flow shows the loop as a circle with an exit.

:::flow
title: How the for loop runs
Start -> Next item: total = 0
Next item -> Add to total: an item remains
Add to total -> Next item: go back
Next item -> Print final: no items remain
:::

Press Next to watch total and price on every iteration.

:::scenario
title: Adding up the basket
state: prices=[1.2, 2.5, 0.99], total=0
step: The line total = 0 sets the accumulator before the loop.
state: total=0
step: Iteration 1: price is set to the first item, 1.2. The block adds it. total is 0 + 1.2.
state: price=1.2, total=1.2
step: Iteration 2: price is set to 2.5. The block adds it. total is 1.2 + 2.5.
state: price=2.5, total=3.7
step: Iteration 3: price is set to 0.99. The block adds it. total is 3.7 + 0.99.
state: price=0.99, total=4.69
step: No items remain. The loop ends. The unindented print shows the final total.
state: screen=Final total: 4.69
:::

## How it works

### The for loop

The general shape is: for, a new variable name, the word in, a list, a colon, and an indented block. Python runs the block once per item. The name after for is your choice. Pick a singular noun for one item of a plural list: for price in prices, for item in items, for row in rows. The loop also works on a string, where each item is one character, and on a dictionary, where each item is a key.

:::code
lang: python
items = ["apples", "bread", "milk"]
for item in items:
    print("Buy", item)

prices = {"apples": 1.2, "bread": 2.5, "milk": 0.99}
for name in prices:
    print(name, "costs", prices[name])
:::

:::code
lang: text
Buy apples
Buy bread
Buy milk
apples costs 1.2
bread costs 2.5
milk costs 0.99
:::

### Repeating a fixed number of times with range

Sometimes there is no list, only a number of repeats. The function range makes the numbers for you. range(3) gives 0, 1 and 2: three numbers, starting at 0 and stopping before 3. This matches list indexes, where a list of 3 items has indexes 0, 1 and 2. The table shows the common forms.

| Call | Numbers it gives | How many |
| --- | --- | --- |
| range(3) | 0, 1, 2 | 3 |
| range(1, 4) | 1, 2, 3 | 3 |
| range(0, 10, 2) | 0, 2, 4, 6, 8 | 5 |
| range(len(prices)) | 0, 1, 2 when prices has 3 items | len(prices) |

:::code
lang: python
for i in range(3):
    print("Step", i)

prices = [1.2, 2.5, 0.99]
for i in range(len(prices)):
    print("Index", i, "holds", prices[i])
:::

:::code
lang: text
Step 0
Step 1
Step 2
Index 0 holds 1.2
Index 1 holds 2.5
Index 2 holds 0.99
:::

The second loop walks the indexes instead of the items. Use it when you need the position as well as the value. The name i is the usual choice for an index. A training loop is often written for step in range(1000), which runs the block 1,000 times.

### The while loop

A while loop repeats as long as a condition is True. It checks the condition before every pass. When the check gives False, the loop ends. Use while when you do not know in advance how many passes you need. Here Ada keeps adding the cheapest item, apples at 1.2, until the total passes 4.

:::code
lang: python
file: fill.py
total = 0
count = 0
while total <= 4:
    total = total + 1.2
    count = count + 1
print(count, "apples make", round(total, 2))
:::

:::code
lang: text
4 apples make 4.8
:::

The check runs four times with True: at 0, 1.2, 2.4 and 3.6. Each time, the block adds 1.2 and counts 1. After the fourth pass, total is 4.8, the check gives False, and the loop stops. Both total and count are accumulators.

A while loop has one danger. If nothing in the block changes the condition, the loop never ends. This is an infinite loop. The program hangs and the terminal does not return. Press Control and C in the terminal to stop it. Always check that the block moves the condition towards False.

| Loop | Use it when | Example |
| --- | --- | --- |
| for item in a list | you have a collection to walk through | add up prices, print every item |
| for i in range(n) | you know the number of repeats | run 1,000 training steps |
| while condition | you repeat until something changes | keep asking until the user types quit |

### Three accumulator patterns

Almost every loop uses one of three accumulators. The code shows all three on the prices list.

:::code
lang: python
file: patterns.py
prices = [1.2, 2.5, 0.99]

total = 0
for price in prices:
    total = total + price

cheap_count = 0
for price in prices:
    if price < 2:
        cheap_count = cheap_count + 1

largest = prices[0]
for price in prices:
    if price > largest:
        largest = price

print("total", round(total, 2), "cheap", cheap_count, "largest", largest)
:::

:::code
lang: text
total 4.69 cheap 2 largest 2.5
:::

The first loop is the running total. The second is a counter: it starts at 0 and grows by 1 only when the if inside the loop is True. Note the double indentation: the if is inside the for, so its block sits 8 spaces in. The third is the find-the-largest algorithm from the lesson on programs. The accumulator largest starts at the first item, not at 0, and is replaced whenever a bigger item appears. Starting largest at 0 would be a bug for a list of negative numbers.

A fourth pattern builds a new list. Start with an empty list and append inside the loop. This collects the names of items with a low count, which the last lesson asked you to write by hand.

:::code
lang: python
stock = {"apples": 3, "bread": 2, "milk": 1, "eggs": 12}
low = []
for name in stock:
    if stock[name] < 3:
        low.append(name)
print(low)
:::

:::code
lang: text
['bread', 'milk']
:::

### Leaving a loop early

The word break ends a loop at once. The word continue skips the rest of the current pass and moves to the next item. A common use is a chat loop that runs until the user types quit.

:::code
lang: python
while True:
    text = input("Say something, or quit: ")
    if text == "quit":
        break
    print("You said", text)
print("Bye")
:::

The condition while True is always True, so only break can end the loop. This is the shape of every chat program you will write later: read, check for an exit word, respond, repeat.

## Try it

:::exercise
title: Average price
task: Write average.py. Store the prices 1.2, 2.5, 0.99 and 3.0 in a list. Use one loop to compute the total and the count of items. Print the average rounded to 2 decimal places. The expected answer is 1.92. Do not use the built-in sum or len for this exercise.
hint: Two accumulators in one loop: total grows by the price, count grows by 1. The average is total divided by count after the loop.
lang: python
solution:
prices = [1.2, 2.5, 0.99, 3.0]
total = 0
count = 0
for price in prices:
    total = total + price
    count = count + 1
average = total / count
print("Average:", round(average, 2))
:::

:::exercise
title: Trace a while loop
task: On paper, trace this loop and write the value of n after each pass and the final output. n = 20. while n > 1: n = n // 2. Then print n. Then run it to check.
hint: Two slashes divide and drop the remainder. Write the check and the new n for each pass.
lang: text
solution:
Pass 1: check 20 > 1 is True, n becomes 10
Pass 2: check 10 > 1 is True, n becomes 5
Pass 3: check 5 > 1 is True, n becomes 2
Pass 4: check 2 > 1 is True, n becomes 1
Check 1 > 1 is False, the loop ends
Output: 1
:::

## Common mistakes

- Mistake: you set total = 0 inside the loop, so it resets on every pass and ends as the last price. Fix: set the accumulator once, before the loop.
- Mistake: you write for price in prices and then use prices inside the block when you mean the current item. Fix: inside the block, the loop variable price holds the current item.
- Mistake: you expect range(3) to give 1, 2, 3. Fix: range starts at 0 and stops before the end number, so it gives 0, 1, 2.
- Mistake: your while loop never ends because the block does not change the condition. Fix: make sure something inside the block moves the condition towards False; press Control and C to stop a stuck program.
- Mistake: you start the largest accumulator at 0 and get a wrong answer for negative numbers. Fix: start it at the first item of the list.

## Check your understanding

:::quiz
title: Check: loops
q: How many times does the block under for price in [1.2, 2.5, 0.99]: run?
- 1
* 3
- 4
why: A for loop runs once per item, and the list has 3 items.
q: What does for i in range(4): print(i) show?
- 1 2 3 4
* 0 1 2 3
- 0 1 2 3 4
why: range starts at 0 and stops before 4.
q: With total = 0 and the loop total = total + price over [1.2, 2.5, 0.99], what is total after the second iteration?
- 1.2
* 3.7
- 4.69
why: After two passes the accumulator holds 1.2 plus 2.5.
q: A loop starts with n = 1 and runs while n < 100 with the block n = n * 10. How many passes does it make?
* 2
- 3
- 100
why: n goes 1, 10, 100; the check is True at 1 and 10 and False at 100.
q: You want to ask the user for input until they type quit. Which loop fits best?
- for i in range(10)
- for item in items
* while True with break
why: The number of questions is unknown, so a while loop that breaks on quit is the right shape.
q: Which is the correct start value for a running largest over a list of numbers?
- 0
* The first item of the list
- 100
why: The first item is always a valid candidate; 0 fails when every number is negative.
:::

## Go further

The Python tutorial sections on for statements and on the range function in the links give more forms, including loops over two lists at once. The Wikipedia page on control flow shows that every language has the same three ideas: sequence, decision and loop. The next lesson, [Functions](/courses/start-here/first-python/functions), takes the running total loop, gives it a name, and lets you call it on any list with one line.
`,
      links: [
        { label: 'for statements (Python tutorial)', url: 'https://docs.python.org/3/tutorial/controlflow.html#for-statements', kind: 'docs' },
        { label: 'The range function (Python tutorial)', url: 'https://docs.python.org/3/tutorial/controlflow.html#the-range-function', kind: 'docs' },
        { label: 'Control flow, Wikipedia', url: 'https://en.wikipedia.org/wiki/Control_flow', kind: 'article' },
      ],
    },
    {
      slug: 'functions',
      title: 'Functions',
      summary: 'After this lesson you can define a function with def, give it parameters, return a value, call it from anywhere, and explain which variables it can see.',
      minutes: 24,
      objectives: [
        'Define a function with def, a name, parameters and an indented body.',
        'Return a value with return and store it in a variable at the call site.',
        'Explain the difference between a parameter and an argument, and between print and return.',
        'Explain scope: why a variable made inside a function is not visible outside it.',
      ],
      keyTerms: ['function', 'parameter', 'return value', 'scope', 'indentation', 'list', 'loop'],
      body: `
## What this lesson covers

This lesson teaches the last of the five ideas: the function. A function is a named block of code that you define once and call as many times as you like. You learn the def line, parameters, the return line, and how to call a function with arguments. You also learn scope, which says where a variable is visible. At the end you can turn the running total loop into basket_total(prices) and use it on any list in one line.

## Why it matters

You have already used functions: print, len, type, int and round are all functions that someone else wrote. From this lesson on, you write your own. Every AI library is a collection of functions: one loads a model, one tokenises text, one runs a training step. Your own programs will be the same: small functions with clear names that you test one at a time. The next module, Python for working with data, starts with [Reading and writing files](/courses/start-here/python-for-data/files-csv-json), and its code sits inside functions from the first line.

:::video
id: nLRL_NcnK-4
why: Watch the first lecture, Functions and Variables, which is the first hour of this video. The teacher defines a function with def, calls it, and returns a value, with the same care as this lesson. Stop when lecture 1 on conditionals begins.
:::

## The idea with an example

> **Analogy.** A function is a recipe card with a name. The card for pancakes lists what you need, the ingredients, and the steps. When you want pancakes you do not rewrite the steps; you say: make pancakes with 2 eggs. The ingredients you hand over are the parameters. The plate that comes back is the return value. The same card works for 2 eggs or 6, and anyone in the kitchen can use it.

In the loops lesson the running total took five lines. If a program needs the total of three different baskets, you would copy the five lines three times. A function lets you write them once, give them a name, and run them with one line each time. Here is the running example.

:::code
lang: python
file: basket.py
def basket_total(prices):
    total = 0
    for price in prices:
        total = total + price
    return total

ada = [1.2, 2.5, 0.99]
sam = [3.0, 0.5]
print("Ada pays", round(basket_total(ada), 2))
print("Sam pays", round(basket_total(sam), 2))
:::

:::code
lang: text
Ada pays 4.69
Sam pays 3.5
:::

The first five lines define the function. The line def basket_total(prices): starts with the word def, which is short for define, then the name of the function, then a parameter in parentheses, then a colon. A parameter is a name that receives a value when the function is called. The indented block is the body. It is the running total loop from the last lesson. The line return total ends the function and hands the value of total back to whoever called it.

Nothing runs when the interpreter reads the definition. It only remembers that a function named basket_total exists. The body runs when a line calls the function. The call basket_total(ada) runs the body with prices set to the list ada. The value passed in a call is called an argument. The call itself then stands for the returned value, 4.69, so round can use it and print can show it.

:::flow
title: What happens in one call of basket_total
Main program -> Function body: calls with ada, prices = ada
Function body -> Loop: adds 3 prices
Loop -> Return: total = 4.69
Return -> Main program: hands back 4.69
:::

Press Next to follow the first call.

:::scenario
title: Calling basket_total(ada)
state: ada=[1.2, 2.5, 0.99], function=defined
step: The interpreter reads the def block and remembers the function. It does not run the body.
state: basket_total=remembered
step: The main program reaches print and must evaluate basket_total(ada). It jumps into the body with prices set to the list ada.
state: prices=[1.2, 2.5, 0.99]
step: The body sets total to 0 and runs the loop over prices.
state: total=0
step: After three iterations total is 4.69.
state: total=4.69
step: The line return total ends the body and hands 4.69 back. The names prices and total are deleted.
state: returned=4.69, prices=gone, total=gone
step: Back in the main program, round turns 4.69 into 4.69 and print shows Ada pays 4.69.
state: screen=Ada pays 4.69
:::

## How it works

### The parts of a function

| Part | In the example | What it is |
| --- | --- | --- |
| def | def | the word that starts a definition |
| name | basket_total | how you call the function; same rules as variable names |
| parameter | prices | a name that receives a value at each call |
| body | the 4 indented lines | the code that runs on each call |
| return | return total | ends the body and gives a value back |
| call | basket_total(ada) | runs the body with an argument |
| argument | ada | the value passed to the parameter |

The steps when a call happens are always the same.

1. The interpreter evaluates each argument.
2. It creates the parameters as new variables and sets them to the arguments, in order.
3. It runs the body from the top.
4. When it meets return, it stops the body and hands the value back. If the body ends without return, it hands back None.
5. The call expression is replaced by the returned value, and the calling line continues.

### More than one parameter

A function can take several parameters, separated by commas. The call must pass the arguments in the same order. A parameter can have a default value, written with an equals sign in the def line, and a call can leave it out.

:::code
lang: python
file: cost.py
def item_cost(price, count, discount=0):
    cost = price * count
    return cost - discount

print(item_cost(1.2, 3))
print(item_cost(2.5, 2, 1))
print(item_cost(price=0.99, count=1))
:::

:::code
lang: text
3.5999999999999996
4.0
0.99
:::

The first call passes two arguments, and discount keeps its default of 0. The second call passes all three. The third call names each argument, which makes long calls easier to read, and the order no longer matters. You will see named arguments all the time in AI code, such as model="claude-sonnet-5-5" or temperature=0.7.

### return is not print

The two words confuse almost every beginner, so compare them side by side. print shows a value on the screen and gives nothing back to the program. return gives a value back to the program and shows nothing. A function that prints a total is useful once. A function that returns the total lets you store it, add it to another total, compare it, or print it, so return is almost always what you want.

:::code
lang: python
def show_total(prices):
    print(sum(prices))

def get_total(prices):
    return sum(prices)

a = show_total([1, 2])
b = get_total([1, 2])
print(a)
print(b + 10)
:::

:::code
lang: text
3
None
13
:::

The call show_total prints 3 but returns None, so a is None. The call get_total returns 3, so b + 10 is 13. The function sum is a built-in that adds a list, and it is what you use in real code instead of the loop. The loop in basket_total showed how sum works inside.

### Scope: where a variable lives

Scope is the part of a program where a name is visible. Variables created inside a function body, including its parameters, are local. They exist only while the call runs and vanish when the function returns. The main program cannot see them. Variables created at the top level of the file are global, and a function can read them. This is why total inside basket_total does not clash with a total in the main program: they are two different boxes. The rule to follow for now is short. Pass values into a function through parameters and get values out through return. Do not reach for global variables from inside a function. Functions written this way are independent, and you can test each one on its own.

:::code
lang: python
def double(n):
    result = n * 2
    return result

print(double(4))
print(result)
:::

:::code
lang: text
8
Traceback (most recent call last):
  File "scope.py", line 6, in <module>
    print(result)
NameError: name 'result' is not defined
:::

The first print works, because double returns 8. The second fails, because result was local to the call and no longer exists. The error is a NameError, the same kind you met in the first lesson. Read the traceback from the bottom: the name is not defined on line 6.

### Why name your recipes

Functions earn their place for four reasons. Reuse: write the total once and call it for every basket. Naming: a call such as basket_total(ada) says what it does; five loop lines do not. Testing: you can call a function with a small list and check the answer before you use it on real data. Change: fix a bug in one place and every call is fixed. Programs of any size are built from functions that call other functions, and reading a large program means reading its function names first.

| Built-in function | What it does | Example | Result |
| --- | --- | --- | --- |
| print | shows values on the screen | print("hi", 3) | shows hi 3 |
| len | counts items or characters | len([1, 2, 3]) | 3 |
| sum | adds a list of numbers | sum([1.2, 2.5]) | 3.7 |
| max | the largest item | max([1.2, 2.5, 0.99]) | 2.5 |
| min | the smallest item | min([1.2, 2.5, 0.99]) | 0.99 |
| round | rounds to a number of decimals | round(4.69, 1) | 4.7 |
| sorted | a new list in order | sorted([2.5, 1.2]) | [1.2, 2.5] |

The find-the-largest loop from the loops lesson is max. The running total is sum. You wrote them by hand to see the mechanism. From now on, use the built-ins and write your own functions for the jobs Python does not already do.

## Try it

:::exercise
title: Count the cheap items
task: Write cheap.py with a function count_cheap(prices, limit) that returns how many prices in the list are below limit. Test it on [1.2, 2.5, 0.99, 3.0] with limit 2, which should give 2, and with limit 5, which should give 4. Print both results.
hint: Start a counter at 0. Loop over prices. Inside the loop, an if compares the price with limit and adds 1 to the counter. Return the counter after the loop.
lang: python
solution:
def count_cheap(prices, limit):
    count = 0
    for price in prices:
        if price < limit:
            count = count + 1
    return count

basket = [1.2, 2.5, 0.99, 3.0]
print(count_cheap(basket, 2))
print(count_cheap(basket, 5))
:::

:::exercise
title: A greeting with a default
task: Write a function greet(name, greeting="Hello") that returns a string such as Hello, Ada! Call it three times: with only a name, with a name and the greeting Welcome, and with named arguments in the other order. Print each result.
hint: Join the parts with +. The return value is a string, so build it with greeting + ", " + name + "!".
lang: python
solution:
def greet(name, greeting="Hello"):
    return greeting + ", " + name + "!"

print(greet("Ada"))
print(greet("Sam", "Welcome"))
print(greet(greeting="Hi", name="Lee"))
:::

## Common mistakes

- Mistake: you define a function and nothing happens when you run the file. Fix: a definition only stores the function; add a line that calls it.
- Mistake: you use print inside the function and then try to use the result in arithmetic, and get None. Fix: return the value; print it at the call site if you want to see it.
- Mistake: you put code after the return line in the body and it never runs. Fix: return ends the function; move the code before it or outside the function.
- Mistake: you try to read a variable that was created inside a function from the main program and get a NameError. Fix: return the value from the function and store it in a variable at the call.
- Mistake: you pass arguments in the wrong order, such as item_cost(3, 1.2), and get a wrong answer with no error. Fix: match the order of the parameters, or use named arguments.

## Check your understanding

:::quiz
title: Check: functions
q: In def basket_total(prices):, what is prices?
- An argument
* A parameter
- A return value
why: A parameter is the name in the definition; the argument is the value passed in a call.
q: What does the line return total do?
- Prints total on the screen
* Ends the function and hands the value of total back to the caller
- Deletes total
why: return stops the body and makes the call expression equal to the returned value.
q: A function body has a print but no return. What does x = f(5) store in x?
- The printed value
* None
- An error
why: A function without return gives back None, even if it printed something.
q: With def item_cost(price, count, discount=0):, which call is valid?
- item_cost(1.2)
* item_cost(1.2, 3)
- item_cost()
why: price and count have no defaults, so a call must pass at least those two.
q: A variable total is created inside a function. After the call, print(total) in the main program gives what?
- The last value of total
- 0
* A NameError, because total was local to the function
why: Local variables vanish when the function returns; only the returned value survives.
q: Which built-in function does the same job as a running total loop?
- len
* sum
- max
why: sum adds every number in a list, which is what the total accumulator computes.
:::

## Go further

The Python tutorial section Defining Functions in the links covers default values, named arguments and the docstring, which is a description you can put at the top of a function body. The CS50P lecture in the video shows the same ideas with a teacher at a whiteboard. You now have all five ideas of programming: variables, collections, decisions, loops and functions. Every program in this site is made of them. The next module, Python for working with data, begins with [Reading and writing files](/courses/start-here/python-for-data/files-csv-json), where your functions read real data from the disk.
`,
      links: [
        { label: 'Defining Functions (Python tutorial)', url: 'https://docs.python.org/3/tutorial/controlflow.html#defining-functions', kind: 'docs' },
        { label: 'Built-in Functions (Python docs)', url: 'https://docs.python.org/3/library/functions.html', kind: 'docs' },
        { label: "Harvard CS50's Introduction to Programming with Python", url: 'https://www.youtube.com/watch?v=nLRL_NcnK-4', kind: 'video' },
        { label: 'Scope (computer science), Wikipedia', url: 'https://en.wikipedia.org/wiki/Scope_(computer_science)', kind: 'article' },
      ],
    },
  ],
}
