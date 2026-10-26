import type { Module } from '../../types'

export const mod: Module = {
  slug: 'python-for-data',
  title: 'Python for working with data',
  description: 'Read and write files, CSV and JSON; read an error message; install packages; use a notebook; and load a table with pandas and NumPy.',
  level: 'foundations',
  lessons: [
    {
      slug: 'files-csv-json',
      title: 'Reading and writing files',
      summary: 'After this lesson you can write a CSV file from Python, read it back row by row, and save nested data as JSON.',
      minutes: 24,
      before: [
        { label: 'Lists and dictionaries', to: '/courses/start-here/first-python/lists-and-dicts' },
        { label: 'Repeating with loops', to: '/courses/start-here/first-python/loops' },
      ],
      objectives: [
        'Write text to a file with open and read it back.',
        'Explain what a CSV file is and read its rows with the csv module.',
        'Compute the mean of one column read from a CSV file.',
        'Explain what JSON is and save a list of dictionaries with the json module.',
      ],
      keyTerms: ['file', 'path', 'csv', 'json', 'file-extension'],
      body: `
## What this lesson covers

This lesson teaches your programs to remember. Until now, every value you made in Python disappeared when the program ended. Here you learn to write values to a file on the disk and read them back later. You learn the two file formats that carry most data in AI work: CSV for tables and JSON for nested data. At the end you can save a 6-row table of house prices as a CSV file, read it back, and compute the mean price.

## Why it matters

Every AI model learns from data, and data lives in files. A data set of 10,000 houses is a CSV file. The settings of a model are often a JSON file. The answer that an AI model sends back over the internet is JSON text. If you can read and write these two formats, you can feed any data into a model and save what comes out. The [Errors and how to read them](/courses/start-here/python-for-data/errors-and-debugging) lesson comes next. File work is where most beginners meet their first real error, so this lesson prepares you for that one.

:::video
id: nLRL_NcnK-4
why: Open the chapter list under the video and pick the chapter named File I/O. Watch the first 20 minutes of it. The lecturer writes a CSV file and reads it back, which is the same job as this lesson.
:::

## The idea with an example

> **Analogy.** A file is a notebook on a shelf. To write in it, you take it down, open it, write some lines, and close it. To read it, you open it again and read line by line. If you forget to close it, the ink may not dry, and the last lines may be lost. Python works in the same way: open, read or write, close.

A file is a named block of information on the disk. Memory empties when a program ends, but a file stays. Python has one built-in function for files, named open. You give it a path, and it hands you back a file object. A file object is a Python value that you can read from or write to. When you finish, the file must be closed. The with statement does the closing for you, so you never forget.

Here is the running example for this lesson and for the rest of the module. An estate agent recorded 6 houses that sold last year. For each house she wrote down the floor area in square metres, the number of bedrooms, the city, whether it has a garden, and the price in pounds.

| size_m2 | bedrooms | city | garden | price |
| --- | --- | --- | --- | --- |
| 50 | 1 | Leeds | no | 150000 |
| 70 | 2 | Leeds | yes | 210000 |
| 90 | 3 | York | yes | 260000 |
| 120 | 4 | York | yes | 380000 |
| 60 | 2 | Leeds | no | 170000 |
| 100 | 3 | York | no | 300000 |

You want this table on the disk. The usual format for a table is a CSV file. CSV stands for comma-separated values. A CSV file is plain text with one row per line and commas between the values. The first line holds the column names. The 6 houses become a file of 7 lines.

:::code
lang: text
file: houses.csv
size_m2,bedrooms,city,garden,price
50,1,Leeds,no,150000
70,2,Leeds,yes,210000
90,3,York,yes,260000
120,4,York,yes,380000
60,2,Leeds,no,170000
100,3,York,no,300000
:::

You can create this file in a text editor and save it next to your Python files. You can also write it from Python, which is what the first program does. The flow diagram shows the trip of the data from your program to the disk and back.

:::flow
title: Data goes to the disk and comes back
Python list -> open for write: w mode
open for write -> houses.csv: writes 7 lines
houses.csv -> open for read: r mode
open for read -> Python list: one row per line
:::

Press Next to follow one write and one read, step by step.

:::scenario
title: Write houses.csv and read it back
state: file=none, rows=0
step: Python calls open("houses.csv", "w"). The operating system creates an empty file.
state: file=empty
step: The program writes the header line and 6 data lines. Each line ends with a newline character.
state: file=7 lines
step: The with block ends. Python closes the file. The lines are now safe on the disk.
state: file=closed, 7 lines
step: Python calls open("houses.csv") again, this time to read. The csv module reads one line at a time.
state: rows=1
step: Each line becomes a list of 5 strings. After 7 lines the loop ends and the file closes again.
state: rows=7, file=closed
:::

## How it works

### Writing and reading plain text

The open function takes 2 arguments. The first is the path of the file. The second is the mode. The mode "w" means write, and it creates the file or empties an existing one. The mode "r" means read, and it is the default. The mode "a" means append, and it adds to the end. The table lists the three modes.

:::anim
title: Six houses go to the disk as text and come back as numbers
box prog "write_houses.py" @ 150,150 icon: python size: 220x64
box disk "houses.csv on the disk" @ 480,150 icon: disk size: 240x64
box reader "mean_price.py" @ 480,430 icon: python size: 220x64
num lines = 0 @ 790,150 suffix: " lines" size: 26
text closed "closed: the 7 lines are safe" @ 480,215 size: 16 color: grey
text row "row['price'] = '150000'|a string, not a number" @ 790,300 size: 17 color: yellow
text conv "int(row['price']) = 150000" @ 790,365 size: 17 color: green
num total = 0 @ 790,430 prefix: "total = " size: 24
num mean = 0 @ 790,485 prefix: "mean = " size: 22 color: green

step: The program calls open with mode w. The operating system creates an empty file on the disk.
  show prog, disk, lines
  arrow prog -> disk : open('houses.csv', 'w')
step: The loop writes the header line and 6 data lines. Each line ends with a newline character.
  send prog -> disk : 50,1,Leeds,no,150000 (2.5s)
  & count lines -> 7 (2.5s)
step: The with block ends and Python closes the file. The 7 lines are now safe on the disk.
  show closed
  highlight disk
step: A second program opens the file to read. csv.DictReader turns each line into a dictionary of strings.
  show reader
  restore disk
  arrow disk -> reader : csv.DictReader(f)
step: Look at the quotes. The price is the string '150000'. The program converts it with int before it adds.
  show row
  wait 1
  show conv
step: The loop adds the 6 prices one by one. The total counts up to 1,470,000.
  show total
  send disk -> reader : 6 rows (3s)
  & count total -> 1470000 (3s)
step: Divide by the count, 6 houses. The mean is 245,000 pounds, the same as by hand.
  show mean
  count mean -> 245000
  pulse mean
:::

| Mode | Name | What it does to an existing file |
| --- | --- | --- |
| "r" | read | leaves it as it is; fails if the file does not exist |
| "w" | write | empties it and starts again |
| "a" | append | keeps it and adds new text at the end |

The program below writes the 7 lines of houses.csv. The write method writes one string. The string "\\n" is the newline character, which ends the line. Without it, all 7 lines land on one line.

:::code
lang: python
file: write_houses.py
rows = [
    "size_m2,bedrooms,city,garden,price",
    "50,1,Leeds,no,150000",
    "70,2,Leeds,yes,210000",
    "90,3,York,yes,260000",
    "120,4,York,yes,380000",
    "60,2,Leeds,no,170000",
    "100,3,York,no,300000",
]

with open("houses.csv", "w") as f:
    for row in rows:
        f.write(row + "\\n")

print("wrote", len(rows), "lines")
:::

Read the with line slowly. It opens the file for writing and names the file object f. The indented block runs with the file open. When the block ends, Python closes the file. Run the program with python write_houses.py. A new file named houses.csv appears in the same folder as the program.

Reading plain text is the mirror image. The read method returns the whole file as one string. A for loop over the file object gives one line at a time, which is better for big files. Each line still has its newline at the end, so you call strip to remove it.

:::code
lang: python
file: read_lines.py
with open("houses.csv") as f:
    for line in f:
        print(line.strip())
:::

### Reading a table with the csv module

You could split each line on the commas with line.split(","). That breaks when a value itself contains a comma, such as a city named "Newcastle, Upon Tyne". The csv module in the standard library handles those cases. The standard library is the set of packages that come with Python. You load a package with the import statement at the top of the file.

The csv module offers 2 readers. The reader gives each row as a list of strings. The DictReader gives each row as a dictionary, with the header line as the keys. The DictReader is the one you will use most, because row["price"] is clearer than row[4].

:::code
lang: python
file: read_houses.py
import csv

with open("houses.csv") as f:
    reader = csv.DictReader(f)
    houses = list(reader)

print(len(houses), "houses")
print(houses[0])
:::

:::code
lang: text
6 houses
{'size_m2': '50', 'bedrooms': '1', 'city': 'Leeds', 'garden': 'no', 'price': '150000'}
:::

Look at the quotes in the output. The price is the string '150000', not the number 150000. A CSV file holds no types; everything in it is text. If you add two prices as strings, you get '150000210000', which is the two strings glued together. You must convert each value with int or float before you do arithmetic. The next program converts the prices and computes the mean. The mean is the sum of the values divided by how many values there are.

:::code
lang: python
file: mean_price.py
import csv

total = 0
count = 0
with open("houses.csv") as f:
    for row in csv.DictReader(f):
        total = total + int(row["price"])
        count = count + 1

print("total:", total)
print("mean:", total / count)
:::

:::code
lang: text
total: 1470000
mean: 245000.0
:::

Check the numbers by hand. The 6 prices add up to 150000 + 210000 + 260000 + 380000 + 170000 + 300000, which is 1,470,000 pounds. Divide by 6 and you get 245,000 pounds. The program agrees. In words: add the prices, then divide by the count of houses.

### Nested data with JSON

A table is flat: every row has the same columns. Real data is often nested. A house might have a list of past sale prices, or a dictionary of room sizes. CSV cannot hold a list inside a cell. For that you use JSON. JSON stands for JavaScript Object Notation. It is a text format that looks almost the same as Python lists and dictionaries written out. The table shows how the pieces match.

| Python | JSON | Example |
| --- | --- | --- |
| dict | object with curly braces | {"city": "York"} |
| list | array with square brackets | [50, 70, 90] |
| str | string in double quotes | "Leeds" |
| int or float | number | 150000 |
| True or False | true or false | true |
| None | null | null |

The json module turns Python values into JSON text and back. The function json.dump writes a value to a file. The function json.load reads a file and returns the value. There are also json.dumps and json.loads, with an s, which work on strings instead of files. The s stands for string. The program below takes the list of house dictionaries from the CSV file and saves it as JSON. It also adds a nested list to the first house.

:::code
lang: python
file: houses_json.py
import csv
import json

with open("houses.csv") as f:
    houses = list(csv.DictReader(f))

for house in houses:
    house["price"] = int(house["price"])
    house["size_m2"] = int(house["size_m2"])

houses[0]["past_prices"] = [120000, 135000]

with open("houses.json", "w") as f:
    json.dump(houses, f, indent=2)

with open("houses.json") as f:
    again = json.load(f)

print(again[0]["past_prices"][1])
print(type(again[0]["price"]))
:::

:::code
lang: text
135000
<class 'int'>
:::

The argument indent=2 makes the file easy to read, with 2 spaces of indentation per level. Open houses.json in a text editor and look at it. Notice the last line of output. JSON keeps the difference between a number and a string, so the price comes back as an int. CSV does not keep it. That is the main reason to pick JSON for anything that is not a flat table.

Here is the start of the file that the program wrote.

:::code
lang: json
file: houses.json
[
  {
    "size_m2": 50,
    "bedrooms": "1",
    "city": "Leeds",
    "garden": "no",
    "price": 150000,
    "past_prices": [
      120000,
      135000
    ]
  },
:::

The bedrooms value is still a string, "1", because the program converted only price and size_m2. The file shows you exactly which values are numbers and which are text. Quotes mean text.

### Where the file goes

The path "houses.csv" has no folder in it. Python then looks in the current folder, which is the folder your terminal was in when you ran the program. If you run the program from a different folder, Python looks in that folder and does not find the file. That is the most common error in this lesson, and the next lesson shows you how to read it. To be safe, keep the data file and the program in the same folder, and run the program from that folder.

## Try it

:::exercise
title: Count the houses with a garden
task: Write a program that reads houses.csv with csv.DictReader and counts the houses where garden is "yes". Print the count and the mean price of only those houses. Check by hand: 3 houses have a garden, and their prices add up to 850,000 pounds, so the mean is about 283,333.
hint: Inside the loop, use an if statement on row["garden"]. Keep two running totals: a count and a sum of prices. Convert the price with int before you add it.
lang: python
solution:
import csv

count = 0
total = 0
with open("houses.csv") as f:
    for row in csv.DictReader(f):
        if row["garden"] == "yes":
            count = count + 1
            total = total + int(row["price"])

print("with garden:", count)
print("mean price:", total / count)
:::

:::exercise
title: Save your own settings as JSON
task: Make a dictionary named settings with three keys: "name" with your name, "lessons_done" with a list of two lesson names, and "dark_mode" with True or False. Save it to settings.json with json.dump. Then open the file in a text editor. Find how JSON writes True.
hint: Use open("settings.json", "w") inside a with statement, then json.dump(settings, f, indent=2).
lang: python
solution:
import json

settings = {
    "name": "Ada",
    "lessons_done": ["files-csv-json", "loops"],
    "dark_mode": True,
}

with open("settings.json", "w") as f:
    json.dump(settings, f, indent=2)

# In the file, True appears as true, in lower case, without quotes.
:::

## Common mistakes

- Mistake: you open a file with mode "w" to look at it, and the file is now empty. Fix: mode "w" erases the file at once; use the default mode "r" to read, and "a" to add.
- Mistake: you add prices from a CSV file and get "150000210000". Fix: CSV values are strings; convert with int(row["price"]) before arithmetic.
- Mistake: you write 7 rows and they all land on one line. Fix: add "\\n" at the end of every string you write.
- Mistake: Python says the file does not exist, but you can see it in the folder. Fix: your terminal is in a different folder; run cd to the folder that holds the file, or give the full path.
- Mistake: you store a list inside a CSV cell and it comes back as the text "[1, 2]". Fix: CSV holds flat tables only; use JSON for nested data.

## Check your understanding

:::quiz
title: Check: files, CSV and JSON
q: A program opens notes.txt with mode "w" and writes one line. The file already held 100 lines. How many lines does it hold now?
- 101
* 1
- 100
why: Mode "w" empties the file before writing; mode "a" would have given 101 lines.
q: csv.DictReader reads the row 90,3,York,yes,260000 from houses.csv. What is row["price"]?
- The int 260000
* The string "260000"
- The float 260000.0
why: A CSV file holds only text, so every value arrives as a string until you convert it.
q: You forget int and run total = total + row["price"] in the loop, with total starting at 0. What happens on the first row?
- Python adds the numbers and prints 1470000
- Python glues the strings together into one long string
* Python stops with a TypeError, because it cannot add an int and a str
why: total is the int 0 and row["price"] is the string "150000"; the plus sign cannot join an int and a str, so convert with int first.
q: Which format can store a list of past prices inside one house record?
- CSV
* JSON
- Both equally well
why: CSV is a flat table with one value per cell; JSON holds lists and dictionaries inside each other.
q: What does the with statement do for a file?
- It reads all the lines at once
* It closes the file when the indented block ends
- It converts the strings to numbers
why: The with statement guarantees the close, even if an error happens inside the block.
q: After json.dump writes the Python value True to a file, what text is in the file?
- "True" with quotes
- True
* true
why: JSON writes booleans as true and false in lower case, with no quotes.
:::

## Go further

The Python tutorial section on reading and writing files in the links is short and covers every mode. The csv and json module pages are the official reference for every option used here. Wikipedia explains the history of both formats. The next lesson, [Errors and how to read them](/courses/start-here/python-for-data/errors-and-debugging), uses the same houses.csv file and shows you what Python prints when the file is missing, when a key is misspelled, and when a string meets a number.
`,
      links: [
        { label: 'Reading and writing files (Python tutorial)', url: 'https://docs.python.org/3/tutorial/inputoutput.html#reading-and-writing-files', kind: 'docs' },
        { label: 'csv module (Python docs)', url: 'https://docs.python.org/3/library/csv.html', kind: 'docs' },
        { label: 'json module (Python docs)', url: 'https://docs.python.org/3/library/json.html', kind: 'docs' },
        { label: 'Comma-separated values (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Comma-separated_values', kind: 'article' },
        { label: 'JSON (Wikipedia)', url: 'https://en.wikipedia.org/wiki/JSON', kind: 'article' },
      ],
    },
    {
      slug: 'errors-and-debugging',
      title: 'Errors and how to read them',
      summary: 'After this lesson you can read a Python traceback from the bottom up, name the common error types, and catch an error with try and except.',
      minutes: 24,
      before: [
        { label: 'Reading and writing files', to: '/courses/start-here/python-for-data/files-csv-json' },
        { label: 'Functions', to: '/courses/start-here/first-python/functions' },
      ],
      objectives: [
        'Read a traceback from the bottom up and find the line in your own file.',
        'Name the 8 most common error types and say what each one means.',
        'Write a try block with an except block that catches one named exception.',
        'Use print to find the value that a program actually holds.',
      ],
      keyTerms: ['error', 'traceback', 'exception', 'try-except', 'bug'],
      body: `
## What this lesson covers

This lesson teaches you to read what Python prints when a program stops. That message is called a traceback, and most beginners never read it. You learn to read it from the bottom up, to recognise the 8 error types you meet most, and to catch an error with try and except when you expect it. At the end you can take a broken program that reads houses.csv, read its error, and fix it in under a minute.

## Why it matters

A program that reads data and trains a model is 100 lines of code that talk to files, packages and the internet. Something in that chain fails every day. The difference between a beginner and a working programmer is not fewer errors. It is the time it takes to read one. An error is the most useful message a program can give you, because it names the exact file and line to look at. The next lesson, [Packages and pip](/courses/start-here/python-for-data/packages-and-pip), starts with the error that appears when a package is missing. You will know how to read it.

:::video
id: rfscVS0vtbw
why: Open the chapter list under the video and pick the chapter named Try / Except. Watch the 6 minutes of it. The video shows the same try and except blocks as this lesson, with user input instead of a file.
:::

## The idea with an example

> **Analogy.** A traceback is a trail of footprints left by a person who fell. The last footprint is where they fell, and a note beside it says why: a loose stone, a wet step. The earlier footprints show the path they took to get there. To find the loose stone, you look at the last footprint first, then walk back along the trail until you reach a part of the path you built yourself.

An error is a problem that stops a program. Python finds it while running a line, cannot continue, and stops. It then prints a traceback. A traceback is the list of lines that shows the path from the start of the program to the line that failed. The last line of the traceback names the kind of error and says what went wrong.

Here is the running example. Ada wrote the program from the last lesson that computes the mean house price. She made one typing mistake: she wrote house.csv instead of houses.csv. The file on the disk is named houses.csv.

:::code
lang: python
file: mean_price.py
import csv

total = 0
count = 0
with open("house.csv") as f:
    for row in csv.DictReader(f):
        total = total + int(row["price"])
        count = count + 1

print("mean:", total / count)
:::

She runs python mean_price.py and Python prints this.

:::code
lang: text
Traceback (most recent call last):
  File "/Users/ada/ilearnai/mean_price.py", line 5, in <module>
    with open("house.csv") as f:
FileNotFoundError: [Errno 2] No such file or directory: 'house.csv'
:::

Read it from the bottom. The last line says FileNotFoundError, and then the name of the file that Python looked for: house.csv. Now go up one block. It names the file mean_price.py, line 5, and prints that line: the open call. The problem is on line 5, and the problem is the name of the file. Ada looks at the folder, sees houses.csv, fixes the string, and the program runs. The flow diagram shows what Python does from the moment a line fails.

:::flow
title: What Python does when a line fails
Line 5 fails -> Exception: raised with a message
Exception -> except block?: is there a handler
except block? -> Handler runs: yes, program continues
except block? -> Traceback printed: no, program stops
:::

Press Next to read the traceback one piece at a time.

:::scenario
title: Reading the traceback from the bottom up
state: line=unknown, cause=unknown
step: Read the last line first. It names the error: FileNotFoundError. It also shows the file name Python looked for: house.csv.
state: cause=file house.csv not found
step: Go up one block. It says File mean_price.py, line 5. The line of code is printed under it.
state: line=5, cause=file house.csv not found
step: Ask: is this a file I wrote? Yes, mean_price.py is Ada's file. So this is the line to fix.
state: line=5, file=mine
step: Compare the string "house.csv" with the real file name houses.csv. One letter is missing.
state: fix=add the letter s
step: Change the string and run again. The traceback is gone and the program prints the mean.
state: output=mean: 245000.0
:::

## How it works

### The shape of a traceback

Every traceback has the same three parts. The table names them from the top down, but you read them from the bottom up.

:::anim
title: Read a traceback from the bottom up to the nearest line that is yours
rect hdr @ 360,110 size: 520x54 "Traceback (most recent call last):" color: grey
rect b1a @ 360,180 size: 520x54 "File mean_price.py, line 12, in <module>"
rect b1b @ 360,250 size: 520x54 "print('mean:', mean_price('houses.csv'))"
rect b2a @ 360,320 size: 520x54 "File mean_price.py, line 8, in mean_price"
rect b2b @ 360,390 size: 520x54 "total = total + int(row['Price'])"
rect err @ 360,460 size: 520x54 "KeyError: 'Price'" color: red
dot ptr @ 75,460 r: 9 color: yellow
text t1 "a dictionary has no|key named Price" @ 790,460 size: 17 color: red
text t2 "line 8 was running|when it failed" @ 790,355 size: 17
text t3 "mean_price.py is yours:|the line to fix" @ 790,355 size: 17 color: yellow
text t4 "the caller only called;|it is not wrong" @ 790,215 size: 17 color: grey
text t5 "one letter fixed:|the program runs" @ 790,460 size: 17 color: green

step: Python prints a traceback with 3 parts: a header, one block per call, and the error line last.
  show hdr
  show b1a, b1b
  show b2a, b2b
  show err
step: Read the last line first. KeyError: 'Price' means a dictionary has no key named Price.
  show ptr
  highlight err
  show t1
step: Go up one block. Line 8, inside the function mean_price, is the line that was running when it failed.
  move ptr -> 75,355
  restore err
  highlight b2a, b2b
  show t2
step: Is mean_price.py a file you wrote? Yes. So this is the line to fix.
  hide t2
  show t3
  pulse b2b
step: The block above only called the function on line 12. It is not wrong, so leave it.
  move ptr -> 75,215
  dim b1a, b1b
  show t4
step: Compare the key Price with the header in the file: price. Fix the capital P and run again.
  hide ptr, t1, t3, t4
  restore b1a, b1b, b2a, b2b
  label b2b "total = total + int(row['price'])"
  color b2b green
  label err "mean: 245000.0"
  color err green
  show t5
:::

| Part | Where | What it tells you |
| --- | --- | --- |
| Header | first line, Traceback (most recent call last) | a traceback follows; the last block is the newest |
| Blocks | one or more pairs of lines | a file name, a line number, and the line of code that was running |
| Error line | last line | the error type, a colon, and a message with the detail |

When a program calls a function, the traceback gets one block per call. The first block is the line in the main program that called the function. The last block is the line inside the function that failed. Here is the same program with the loop moved into a function, and a second mistake: the key is written "Price" with a capital P, but the header in the file says price.

:::code
lang: python
file: mean_price.py
import csv

def mean_price(path):
    total = 0
    count = 0
    with open(path) as f:
        for row in csv.DictReader(f):
            total = total + int(row["Price"])
            count = count + 1
    return total / count

print("mean:", mean_price("houses.csv"))
:::

:::code
lang: text
Traceback (most recent call last):
  File "/Users/ada/ilearnai/mean_price.py", line 12, in <module>
    print("mean:", mean_price("houses.csv"))
  File "/Users/ada/ilearnai/mean_price.py", line 8, in mean_price
    total = total + int(row["Price"])
KeyError: 'Price'
:::

Bottom up again. KeyError: 'Price' means a dictionary was asked for a key named Price and has no such key. One block up: line 8, inside the function mean_price. That is the line to fix. The block above it, line 12, only called the function; it is not wrong. When a traceback is 10 blocks long, most of the blocks are inside packages you did not write. Scan upward until you reach the nearest block in a file that is yours. That line is almost always the one to fix.

### The 8 errors you meet most

Each error type has a name that ends in Error. The name tells you the kind of problem before you read the message. Learn these 8 and you can read most tracebacks at a glance.

| Error | What it means | A line that causes it |
| --- | --- | --- |
| SyntaxError | Python cannot read the line as Python | print("hi" with a missing bracket |
| IndentationError | the spaces at the start of a line are wrong | a line inside a for loop with no indent |
| NameError | you used a name that was never defined | print(totl) when the variable is total |
| TypeError | a value of the wrong type met an operation | 0 + "150000" |
| ValueError | the type is right but the value is not | int("yes") |
| KeyError | a dictionary has no such key | row["Price"] when the key is price |
| IndexError | a list has no such position | houses[6] when the list has 6 items |
| FileNotFoundError | the path names a file that does not exist | open("house.csv") |

Two more appear often. ZeroDivisionError means you divided by 0; in the running example it appears when the file has a header but no rows, so count is 0. ModuleNotFoundError means an import named a package that is not installed; the next lesson is about that one.

The first 2 errors in the table are different from the rest. A SyntaxError or IndentationError is found before the program runs at all, so no line of your program has run yet. The traceback has a small arrow, a caret, under the place where Python got confused. The other errors happen while the program runs. Everything before the failing line has already happened, including any files it wrote.

### Catching an error with try and except

Sometimes an error is expected. A user may type a file name that does not exist. A CSV file may hold the word "unknown" in a price column. You do not want the whole program to stop. Python lets you catch the error with 2 blocks. The try block holds the risky line. The except block names the error and holds the code to run instead. Python calls an error that happens while the program runs an exception. The except block catches the exception.

:::code
lang: python
file: safe_open.py
import csv

path = input("Which file? ")
try:
    with open(path) as f:
        houses = list(csv.DictReader(f))
    print("read", len(houses), "houses")
except FileNotFoundError:
    print("There is no file named", path)
    houses = []
:::

The flow of control follows numbered steps.

1. Python runs the lines inside try, one at a time.
2. If every line succeeds, Python skips the except block.
3. If a line raises FileNotFoundError, Python stops the try block at that line and jumps to the except block.
4. If a line raises some other error, such as KeyError, this except block does not match. The error continues upward, and the program stops with a traceback.

Step 4 is why you name the exception. The line except: on its own, with no name, catches everything, including the errors you did not expect. That hides bugs. Name the one error you can handle, and let the others stop the program so that you can read them.

The same pattern handles a bad value in the data. Suppose the price of one house is the text "unknown". The call int("unknown") raises ValueError. You can skip that row and count the rest.

:::code
lang: python
file: skip_bad_rows.py
import csv

total = 0
count = 0
skipped = 0
with open("houses.csv") as f:
    for row in csv.DictReader(f):
        try:
            total = total + int(row["price"])
            count = count + 1
        except ValueError:
            skipped = skipped + 1

print("mean:", total / count, "skipped:", skipped)
:::

With the clean file, the output is mean: 245000.0 skipped: 0. Change one price to unknown in the file and run again. The mean uses 5 houses, and skipped is 1.

### Print debugging

Not every bug stops the program. Sometimes the program runs and prints the wrong number. A bug is a mistake in a program that makes it do the wrong thing. The simplest tool for a silent bug is print. Put a print line before the line you suspect and print the value and its type. The function repr shows a string with its quotes, so that you can see a hidden space.

:::code
lang: python
file: debug_print.py
import csv

with open("houses.csv") as f:
    for row in csv.DictReader(f):
        print(repr(row["price"]), type(row["price"]))
        break
:::

:::code
lang: text
'150000' <class 'str'>
:::

The output shows the value is a string, not a number. That one line answers the question "why does my total look wrong?" in 2 seconds. Remove the print line when you are done. The steps for any bug are the same.

1. Read the traceback from the bottom up, or, if there is none, decide which line gives the wrong value.
2. Print the values that line uses, with repr and type.
3. Compare what you see with what you expected.
4. Fix one thing. Run again. Repeat.

## Try it

:::exercise
title: Fix three broken lines
task: Each line below has one bug. Type each one into Python, read the traceback, name the error type, and write a fixed version. Line 1: prices = [150000, 210000, 260000] then print(prices[3]). Line 2: price = "150000" then print(price + 1000). Line 3: house = {"city": "York"} then print(house["City"]).
hint: Lists start at position 0, so a list of 3 has positions 0, 1 and 2. A string and an int cannot be added. Dictionary keys are case-sensitive.
lang: python
solution:
# Line 1: IndexError. A list of 3 has positions 0, 1, 2.
prices = [150000, 210000, 260000]
print(prices[2])

# Line 2: TypeError. Convert the string first.
price = "150000"
print(int(price) + 1000)

# Line 3: KeyError. The key is "city" in lower case.
house = {"city": "York"}
print(house["city"])
:::

:::exercise
title: Catch a bad input
task: Write a program that asks the user for a house size in square metres with input, converts it with int, and prints the size multiplied by 2,500 as a rough price. If the user types something that is not a whole number, print "Please type a whole number" instead of stopping.
hint: Put the int call inside a try block. The error to catch is ValueError.
lang: python
solution:
text = input("Size in square metres: ")
try:
    size = int(text)
    print("Rough price:", size * 2500)
except ValueError:
    print("Please type a whole number")
:::

## Common mistakes

- Mistake: you read the first line of the traceback and stop. Fix: the first line is only a header; read the last line first, then go up to the nearest line in your own file.
- Mistake: you fix the line that called the function instead of the line inside it. Fix: the last block of the traceback is the line that failed; the blocks above it only show how the program got there.
- Mistake: you write except: with no error name to make the error go away. Fix: name the one error you expect, such as except ValueError, so that other errors still stop the program and show you a traceback.
- Mistake: you change 3 things at once and the program still fails, and now you do not know which change helped. Fix: change one thing, run, read, repeat.
- Mistake: you think a SyntaxError means a line of your program ran and failed. Fix: a SyntaxError is found before anything runs; look for a missing bracket, quote or colon at or before the caret.

## Check your understanding

:::quiz
title: Check: errors and debugging
q: A traceback has 3 blocks. The top one is in your file main.py, the middle one is in pandas, and the bottom one is also in pandas. Where do you look first?
- The bottom block, because that is where the error happened
* The last line to learn the error type, then the block in main.py, because that is the nearest line you wrote
- The top block, because tracebacks are read top down
why: The error happened inside pandas, but the cause is almost always in the arguments your own line passed to it.
q: Which error does int("yes") raise?
- TypeError
* ValueError
- KeyError
why: The argument is a string, which is the right type for int, but its value cannot become a number.
q: Which error does the line 0 + "150000" raise?
* TypeError
- ValueError
- SyntaxError
why: An int and a str met the plus operation, and Python cannot add two different types.
q: A try block catches FileNotFoundError. Inside it, a line raises KeyError. What happens?
- The except block runs
* The program stops with a traceback for KeyError
- Python ignores the KeyError and continues
why: An except block catches only the error it names; other errors travel upward and stop the program.
q: houses.csv has a header line and no data rows. The mean program divides total by count. Which error appears?
- IndexError
- FileNotFoundError
* ZeroDivisionError
why: The loop never runs, count stays 0, and total / 0 cannot be computed.
q: A program runs with no error but prints a mean of 24500.0 instead of 245000.0. What is the best next step?
- Add except: around the loop
* Print the values inside the loop with repr and type and compare them with the file
- Reinstall Python
why: A silent wrong result is a bug, not an exception; printing the real values shows where they differ from what you expect.
:::

## Go further

The Python tutorial page on errors and exceptions in the links shows the full try, except, else and finally pattern. The list of built-in exceptions is the complete reference for every error name. Read it only when you meet a new one. The next lesson, [Packages and pip](/courses/start-here/python-for-data/packages-and-pip), explains the ModuleNotFoundError you get when you import pandas before you install it, and how to install it in a clean way.
`,
      links: [
        { label: 'Errors and exceptions (Python tutorial)', url: 'https://docs.python.org/3/tutorial/errors.html', kind: 'docs' },
        { label: 'Built-in exceptions (Python docs)', url: 'https://docs.python.org/3/library/exceptions.html', kind: 'docs' },
        { label: 'Traceback (Wikipedia: Stack trace)', url: 'https://en.wikipedia.org/wiki/Stack_trace', kind: 'article' },
        { label: 'Debugging (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Debugging', kind: 'article' },
      ],
    },
    {
      slug: 'packages-and-pip',
      title: 'Packages and pip',
      summary: 'After this lesson you can import a package from the standard library, install one with pip inside a virtual environment, and record it in requirements.txt.',
      minutes: 23,
      before: [
        { label: 'Errors and how to read them', to: '/courses/start-here/python-for-data/errors-and-debugging' },
      ],
      objectives: [
        'Explain what a package is and import one in three different ways.',
        'Name 5 packages in the standard library and say what each does.',
        'Create and activate a virtual environment on Windows, macOS or Linux.',
        'Install pandas with pip and record it in requirements.txt.',
      ],
      keyTerms: ['package', 'import', 'standard-library', 'pip', 'virtual-environment', 'requirements-file'],
      body: `
## What this lesson covers

This lesson explains where the functions you import come from. You learn what a package is, which packages come with Python, and how to add the ones that do not. You learn the tool pip, which installs packages, and the virtual environment, which keeps the packages of one project apart from another. At the end you can install pandas in a clean environment and read houses.csv in 2 lines.

## Why it matters

Nobody writes an AI system from zero. You read a table with pandas, train a model with PyTorch, call a model with a provider's library, and serve it with FastAPI. Each of those is a package that someone else wrote and that you install with pip. A project with the wrong package versions is the most common reason a program works on one computer and fails on another. The virtual environment and the requirements file in this lesson prevent that. The next lesson, [Notebooks: Jupyter and Colab](/courses/start-here/python-for-data/notebooks), starts by installing the notebook package with the exact commands you learn here.

:::video
id: rfscVS0vtbw
why: Open the chapter list under the video and pick the chapter named Modules and pip. Watch the 12 minutes of it. The video shows the import statement and the pip command on screen. It does not show a virtual environment, which this lesson adds.
:::

## The idea with an example

> **Analogy.** A package is a kitchen appliance. Python comes with a basic set in the box: a kettle, a toaster, some knives. That set is the standard library. For bread you buy a bread maker and plug it in. That is pip install. A virtual environment is a separate kitchen for each project, so the bread maker you bought for one project does not clutter the counter of another.

A package is a folder of Python code that you did not write in your file, bundled so that any program can use it. You bring a package into your file with the import statement. In the last 2 lessons you wrote import csv and import json. Those 2 packages came with Python. The set of packages that comes with Python is the standard library. There is nothing to install; the import line is enough.

Here is the running example. Ada wants the mean price of the 6 houses in houses.csv. With the csv module she wrote 9 lines. With the pandas package she writes 3 lines.

:::code
lang: python
file: mean_pandas.py
import pandas as pd

houses = pd.read_csv("houses.csv")
print(houses["price"].mean())
:::

She runs it and Python stops at the first line.

:::code
lang: text
Traceback (most recent call last):
  File "/Users/ada/ilearnai/mean_pandas.py", line 1, in <module>
    import pandas as pd
ModuleNotFoundError: No module named 'pandas'
:::

Read it from the bottom, as the last lesson taught. ModuleNotFoundError means the import named a package that is not installed. Pandas is not in the standard library. Ada must install it. The right way takes 3 commands in the terminal: make a virtual environment, activate it, install the package. The diagram shows where each layer sits once the install is done.

:::arch
title: Where an imported function comes from
layer: Your code | mean_pandas.py
layer: Installed packages | pandas, numpy
layer: Standard library | csv, json, math
layer: Interpreter | Python 3
flow: mean_pandas.py -> pandas -> numpy -> pandas -> mean_pandas.py
note: pandas = installed with pip into the .venv folder; it uses numpy underneath
:::

Press Next to follow Ada through the install.

:::scenario
title: Install pandas in a virtual environment
state: folder=ilearnai, venv=none, pandas=not installed
step: Ada opens a terminal in the folder ilearnai and runs python -m venv .venv. A folder named .venv appears.
state: venv=created
step: She activates it. The prompt now starts with (.venv), which shows the environment is on.
state: venv=active
step: She runs pip install pandas. pip downloads pandas and numpy and puts them inside .venv.
state: pandas=installed in .venv
step: She runs python mean_pandas.py. The import works and the program prints 245000.0.
state: output=245000.0
step: She runs pip freeze > requirements.txt to record the exact versions for later.
state: requirements.txt=pandas==2.2.3 and 4 more lines
:::

## How it works

### Three ways to import

The import statement has 3 forms. All 3 load the same code; they differ in the name you use afterwards.

:::anim
title: Where import looks for pandas, and how pip puts it there
box prog "mean_pandas.py" @ 150,290 icon: python size: 220x64
box stdlib "Standard library|csv, json, math" @ 480,150 icon: package size: 240x64
box venv ".venv|empty" @ 480,430 icon: package size: 240x64
box pypi "PyPI|500,000 packages" @ 790,430 icon: cloud size: 220x64
box req "requirements.txt" @ 790,290 icon: file size: 220x64
text err "ModuleNotFoundError:|No module named 'pandas'" @ 790,150 size: 18 color: red
num pkgs = 0 @ 480,500 suffix: " packages in .venv" size: 20
text out "prints 245000.0" @ 150,390 size: 20 color: green

step: Line 1 says import pandas as pd. Python looks for a package named pandas in the standard library.
  show prog, stdlib
  arrow prog -> stdlib : import pandas
step: The box holds csv, json and math, but no pandas. Python stops with ModuleNotFoundError.
  color stdlib red
  show err
  pulse err
step: Ada runs python -m venv .venv. A private, empty folder of packages appears for this project.
  hide err
  color stdlib blue
  show venv, pkgs
step: She activates it and runs pip install pandas. pip asks PyPI, an index of 500,000 packages.
  show pypi
  arrow venv -> pypi : pip install pandas
step: PyPI sends pandas, numpy and 4 small packages that pandas needs. pip puts all 6 inside .venv.
  arrow pypi -> venv : pandas, numpy + 4 more (2.5s)
  & count pkgs -> 6 (2.5s)
  label venv ".venv|pandas, numpy, ..."
step: Run the program again. The import finds pandas in .venv, and the program prints 245000.0.
  arrow prog -> venv : import pandas
  highlight venv
  show out
step: pip freeze writes the 6 names and versions to requirements.txt, so a new computer can repeat the install.
  show req
  arrow venv -> req : pip freeze
:::

| Form | Example | How you call a function after it |
| --- | --- | --- |
| import package | import math | math.sqrt(16) |
| import package as short name | import pandas as pd | pd.read_csv("houses.csv") |
| from package import name | from math import sqrt | sqrt(16) |

The second form is a habit of the data world. Almost every program writes import pandas as pd and import numpy as np. Use the same short names so that other people can read your code. The third form is handy when you need one function many times. Avoid from package import star, which loads every name and makes it hard to see where a name came from. Imports go at the top of a file, before any other line.

### The standard library

The standard library is large. The table lists the packages you will use in this course. None of them needs an install.

| Package | What it does | One line you will write |
| --- | --- | --- |
| csv | reads and writes CSV files | csv.DictReader(f) |
| json | reads and writes JSON | json.load(f) |
| math | square roots, logarithms, pi | math.sqrt(2) |
| random | random numbers and choices | random.choice(["Leeds", "York"]) |
| os | the operating system: folders, environment variables | os.environ["API_KEY"] |
| pathlib | paths that work on every operating system | Path("data") / "houses.csv" |
| datetime | dates and times | datetime.date.today() |

Before you install anything, ask whether the standard library already does the job. For a 6-row CSV file, the csv module is enough. For a table of 100,000 rows that you want to filter and group, pandas is the right tool, and it is not in the box.

### pip and the Python Package Index

The Python Package Index (PyPI) is a website that holds more than 500,000 packages. pip is the command that downloads a package from PyPI and installs it where the Python interpreter can find it. The main commands fit in one table.

| Command | What it does |
| --- | --- |
| pip install pandas | installs the newest version of pandas and everything it needs |
| pip install pandas==2.2.3 | installs exactly version 2.2.3 |
| pip list | shows every installed package with its version |
| pip freeze > requirements.txt | writes the list to a file, one package per line |
| pip install -r requirements.txt | installs every package in the file |
| pip uninstall pandas | removes it |

On some computers the command pip points at a different Python than the command python. The safe form is python -m pip install pandas, which uses the pip that belongs to the python you run. If pip install gives a strange error, try the long form first.

### Virtual environments

A virtual environment is a private folder of installed packages for one project. Without one, every pip install goes into one shared place. Project A needs pandas version 1, project B needs version 2, and one of them breaks. With a virtual environment, each project has its own folder, and the 2 versions never meet.

The commands differ a little between operating systems. Run them in the terminal, inside the folder of the project.

:::code
lang: bash
file: macOS and Linux
cd ~/Documents/ilearnai
python3 -m venv .venv
source .venv/bin/activate
python -m pip install pandas
python mean_pandas.py
:::

:::code
lang: bash
file: Windows (PowerShell)
cd $HOME\\Documents\\ilearnai
python -m venv .venv
.venv\\Scripts\\activate
python -m pip install pandas
python mean_pandas.py
:::

The 4 steps are the same on every system.

1. python -m venv .venv creates a folder named .venv. The folder holds a copy of the Python command and an empty place for packages. The name .venv is a habit; the dot hides the folder in file listings.
2. The activate command switches the terminal to that environment. The prompt changes to show (.venv) at the start. From now on, python and pip in this terminal mean the ones inside .venv.
3. pip install puts packages into .venv only.
4. deactivate switches the terminal back. Closing the terminal does the same. The folder and its packages stay on the disk.

You must activate the environment in every new terminal. If you run the program and see ModuleNotFoundError for a package you installed yesterday, the cause is almost always an inactive environment. Look for (.venv) in the prompt.

If Windows refuses to run the activate script with a message about execution policy, run this command once in PowerShell: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser. Then try again.

### requirements.txt

A requirements file is a plain text file that lists the packages a project needs. You create it with pip freeze. Ada's file after the install looks like this.

:::code
lang: text
file: requirements.txt
numpy==2.1.3
pandas==2.2.3
python-dateutil==2.9.0.post0
pytz==2024.2
six==1.16.0
tzdata==2024.2
:::

Ada asked for pandas only, but 6 lines appear. Pandas needs numpy and 4 small packages, and pip installed them too. The double equals sign pins the exact version. A second person, or Ada on a new laptop, runs 3 commands: create a venv, activate it, and pip install -r requirements.txt. They get the same 6 packages at the same versions, and the program runs the same way. Keep requirements.txt next to your code. Never copy the .venv folder itself; it is large and tied to one computer. The [Git and GitHub](/courses/start-here/builders-tools/git-and-github) lesson shows how to tell Git to ignore it.

## Try it

:::exercise
title: Set up the course environment
task: In your ilearnai folder, create a virtual environment named .venv and activate it. Install pandas. Run python -c "import pandas; print(pandas.__version__)" to confirm the install. Then write requirements.txt with pip freeze and open it in a text editor. Count the lines.
hint: Look for (.venv) at the start of the prompt before you run pip. If the import fails, the environment is not active.
lang: bash
solution:
cd ~/Documents/ilearnai
python3 -m venv .venv
source .venv/bin/activate
python -m pip install pandas
python -c "import pandas; print(pandas.__version__)"
python -m pip freeze > requirements.txt
# The file holds about 6 lines: pandas, numpy and their helpers.
:::

:::exercise
title: Use the standard library before you install anything
task: Without installing anything, write a program that prints the square root of 2 with the math package, picks a random city from the list ["Leeds", "York"] with the random package, and prints today's date with the datetime package.
hint: You need 3 import lines. The functions are math.sqrt, random.choice and datetime.date.today.
lang: python
solution:
import math
import random
import datetime

print(math.sqrt(2))
print(random.choice(["Leeds", "York"]))
print(datetime.date.today())
:::

## Common mistakes

- Mistake: you installed pandas yesterday, and today the import fails with ModuleNotFoundError. Fix: the new terminal has no active environment; run the activate command and look for (.venv) in the prompt.
- Mistake: you run pip install in one environment and python in another. Fix: use python -m pip install so that both commands belong to the same Python.
- Mistake: you name your own file pandas.py or csv.py, and the import loads your file instead of the package. Fix: never name a file after a package; rename it to mean_pandas.py.
- Mistake: you copy the .venv folder to another computer or into Git. Fix: share requirements.txt instead, and let the other computer build its own .venv.
- Mistake: you install a package for every small task. Fix: check the standard library first; csv, json, math, random, os and pathlib cover a lot.

## Check your understanding

:::quiz
title: Check: packages and pip
q: Your program says ModuleNotFoundError: No module named 'pandas'. Which is the most likely cause?
- pandas does not exist
* pandas is not installed in the environment that is running the program
- The import line is misspelled
why: The message says the package is not where this Python looks; install it in the active environment, or activate the right one.
q: After the line import pandas as pd, how do you call read_csv?
- pandas.read_csv("houses.csv")
* pd.read_csv("houses.csv")
- read_csv("houses.csv")
why: The as pd part gives the package the short name pd, and that is the only name the file knows.
q: Which package needs no pip install?
- pandas
- numpy
* json
why: json is part of the standard library that ships with Python.
q: Project A needs pandas 1.5 and project B needs pandas 2.2 on the same laptop. What makes both work?
- Install both versions with one pip command
* Give each project its own virtual environment
- Rename one of the projects
why: Each virtual environment holds its own copy of the installed packages, so the two versions never meet.
q: A friend clones your project and runs pip install -r requirements.txt. What do they get?
- Only pandas, because that is what you typed
* Every package in the file at the exact pinned versions
- The newest version of every package
why: The file lists each package with ==version, and pip installs exactly those.
q: What does pip freeze do?
* Prints the installed packages with their versions
- Stops a package from being updated
- Deletes the virtual environment
why: pip freeze lists what is installed in a form you can save as requirements.txt.
:::

## Go further

The Python packaging guide in the links walks through venv and pip with screenshots for each operating system. The venv and pip pages are the official references. The pandas install page shows the one command you need and the alternatives. The next lesson, [Notebooks: Jupyter and Colab](/courses/start-here/python-for-data/notebooks), installs one more package, the notebook, and shows the tool where most AI code is written first.
`,
      links: [
        { label: 'Installing packages with pip and venv (Python Packaging User Guide)', url: 'https://packaging.python.org/en/latest/tutorials/installing-packages/', kind: 'docs' },
        { label: 'venv module (Python docs)', url: 'https://docs.python.org/3/library/venv.html', kind: 'docs' },
        { label: 'pip documentation', url: 'https://pip.pypa.io/en/stable/', kind: 'docs' },
        { label: 'pandas installation guide', url: 'https://pandas.pydata.org/docs/getting_started/install.html', kind: 'docs' },
        { label: 'The Python Standard Library (index)', url: 'https://docs.python.org/3/library/index.html', kind: 'docs' },
      ],
    },
    {
      slug: 'notebooks',
      title: 'Notebooks: Jupyter and Colab',
      summary: 'After this lesson you can run code in notebook cells, explain why run order matters, choose between a notebook and a file, and open a free GPU in Colab.',
      minutes: 22,
      before: [
        { label: 'Packages and pip', to: '/courses/start-here/python-for-data/packages-and-pip' },
      ],
      objectives: [
        'Install Jupyter, start it, and run code in a cell.',
        'Explain what the kernel holds and why the order you run cells matters.',
        'Choose between a notebook and a .py file for a given task.',
        'Open a notebook in Google Colab and turn on a free GPU.',
      ],
      keyTerms: ['notebook', 'cell', 'kernel', 'colab', 'package'],
      body: `
## What this lesson covers

This lesson introduces the notebook, the tool where most data and AI code is written first. A notebook is a document of cells. Each cell holds a few lines of code or some text, and you run the cells one at a time. You learn the one idea that makes notebooks both useful and dangerous: the variables stay alive between cells, so the order you run them matters. At the end you can explore houses.csv in a notebook on your own computer, and open the same notebook in Google Colab with a free graphics processor.

## Why it matters

When you train a model, you load data once and then try 20 small things on it: a plot, a filter, a different setting. In a .py file every try reloads the data from the start. In a notebook the data stays in memory and each try is one cell. That is why nearly every AI tutorial, paper and course comes as a notebook. Colab adds a free graphics processing unit (GPU), the chip that makes training fast, so you can train your first model without buying hardware. The next lesson, [Tables with pandas and arrays with NumPy](/courses/start-here/python-for-data/tables-with-pandas), is best done in a notebook, cell by cell.

:::video
id: HW29067qVWk
why: Watch the first 15 minutes. The presenter installs Jupyter, starts it from the terminal, and runs cells. Watch for the number in brackets to the left of each cell; this lesson explains what it means.
:::

## The idea with an example

> **Analogy.** A .py file is a recipe you cook from start to finish every time. A notebook is a kitchen bench with the ingredients already out. You chop the onions once, and they stay on the bench. You can taste the sauce, add salt, taste again. The danger is the same as in a real kitchen. If you throw away the onions and forget, the next step fails. If a friend walks in and does the steps in a different order, the dish is not the same.

A notebook is a file with the extension .ipynb. It holds cells. A code cell holds Python; a text cell holds notes and headings. You run a code cell by clicking in it and pressing Shift and Enter. The output appears under the cell. The Python process that runs the cells is the kernel. The kernel starts when you open the notebook, and it holds every variable until you restart it.

Here is the running example. Ada opens a notebook next to houses.csv and writes 3 cells.

:::code
lang: python
file: cell 1
import pandas as pd
:::

:::code
lang: python
file: cell 2
houses = pd.read_csv("houses.csv")
houses
:::

:::code
lang: python
file: cell 3
houses["price"].mean()
:::

She runs them in order. Cell 1 shows nothing. Cell 2 shows the table, because a notebook prints the last value of a cell without a print call. Cell 3 shows 245000.0. The left margin now reads In [1], In [2] and In [3]. The number is the order in which the cells ran, not their position on the page.

:::anim
title: The page shows page order, but the kernel holds run order
text pg "The page" @ 300,70 size: 16 color: grey
rect c1 @ 300,130 size: 460x56 "In [ ]   import pandas as pd"
rect c2 @ 300,210 size: 460x56 "In [ ]   houses = pd.read_csv('houses.csv')"
rect c3 @ 300,290 size: 460x56 "In [ ]   houses['price'].mean()"
num mean = 0 @ 300,360 prefix: "Out: " digits: 1 size: 22 color: green
text kt "The kernel: one Python process" @ 790,70 size: 16 color: grey
box kernel "Kernel" @ 790,130 icon: kernel size: 200x64
rect kpd @ 790,210 size: 200x50 "pd = pandas" color: teal
rect kh @ 790,290 size: 200x50 "houses = 6 rows" color: teal
text warn "the margin reads In [1], In [4], In [5]|but houses has only 3 rows" @ 300,450 size: 18 color: yellow

step: The page shows 3 cells in page order. The kernel, one Python process, starts empty.
  show pg, c1, c2, c3
  show kt, kernel
step: Run cell 1. The kernel loads pandas. The margin shows In [1].
  label c1 "In [1]   import pandas as pd"
  arrow c1 -> kernel : run
  show kpd
step: Run cell 2. The kernel reads houses.csv into houses, 6 rows. The margin shows In [2].
  label c2 "In [2]   houses = pd.read_csv('houses.csv')"
  arrow c2 -> kernel : run
  show kh
step: Run cell 3. The kernel computes the mean of the 6 prices: 245000.0. The margin shows In [3].
  label c3 "In [3]   houses['price'].mean()"
  arrow c3 -> kernel : run
  show mean
  count mean -> 245000
step: Ada edits cell 2 to houses = houses[houses['city'] == 'York'] and runs it. In [4]. Only 3 rows are left.
  label c2 "In [4]   houses = houses[...]  York rows only"
  send c2 -> kernel : run
  label kh "houses = 3 rows (York)"
  color kh orange
step: Run cell 3 again. In [5]. The mean is now 313333.3, the mean of the 3 York prices.
  label c3 "In [5]   houses['price'].mean()"
  send c3 -> kernel : run
  count mean -> 313333.3
step: The margin reads 1, 4, 5 from the top. A reader cannot tell what ran, but the kernel remembers.
  show warn
  pulse kh
step: Restart and Run All empties the kernel. Every cell runs again from the top, and the numbers start at 1.
  hide kpd, kh, mean, warn
  label c1 "In [ ]   import pandas as pd"
  label c2 "In [ ]   houses = houses[...]  York rows only"
  label c3 "In [ ]   houses['price'].mean()"
  wait 0.6
  label c1 "In [1]   import pandas as pd"
  send c1 -> kernel : run
  show kpd
:::

The diagram shows the parts that make this work. The page in the browser sends the cell to a small server, the server passes it to the kernel, and the kernel sends the output back.

:::arch
title: What runs behind a notebook
layer: Browser | Notebook page
layer: Server | Jupyter server
layer: Python | Kernel
layer: Disk | houses.ipynb, houses.csv
flow: Notebook page -> Jupyter server -> Kernel -> houses.csv -> Kernel -> Jupyter server -> Notebook page
note: Kernel = one Python process that keeps every variable until you restart it
:::

Now the dangerous part. Ada changes cell 2 so that it keeps only the York houses, and runs cell 2 again. Then she runs cell 3 again. Press Next to watch the variables.

:::scenario
title: Running cells out of order
state: kernel=empty
step: Run cell 1. The kernel loads pandas. The margin shows In [1].
state: pd=loaded
step: Run cell 2. The kernel reads the file into houses. The margin shows In [2].
state: pd=loaded, houses=6 rows
step: Run cell 3. The kernel computes the mean of all 6 prices: 245000.0. The margin shows In [3].
state: houses=6 rows, mean=245000.0
step: Edit cell 2 to houses = houses[houses["city"] == "York"] and run it. The margin shows In [4]. Only 3 houses are left.
state: houses=3 rows (York)
step: Run cell 3 again. The margin shows In [5]. The mean is now 313333.3, the mean of 260000, 380000 and 300000.
state: houses=3 rows, mean=313333.3
step: Run cell 2 again by mistake. It filters the 3 York houses to York again, so nothing changes. But if cell 2 had read the file again, houses would be back to 6 rows. The page looks the same; the kernel does not.
state: houses=3 rows, page=looks unchanged
:::

The last step is the lesson. The page shows cells in page order, but the kernel holds the result of run order. A reader who opens the notebook later cannot see what happened. The fix is one menu item: Kernel, then Restart and Run All. It empties the kernel and runs every cell from the top. If the notebook works after that, it works for everyone.

## How it works

### Install and start Jupyter

Jupyter is a package. Install it into the virtual environment from the last lesson and start it from the terminal.

:::code
lang: bash
source .venv/bin/activate
python -m pip install notebook
jupyter notebook
:::

The last command prints a web address such as http://localhost:8888 and opens it in your browser. The page lists the files in the folder where you ran the command. Click New, then Python 3, and a blank notebook opens. Keep the terminal window open; closing it stops the server. On Windows the activate line is .venv\\Scripts\\activate; the other 2 lines are the same.

Visual Studio Code can open .ipynb files too. Install the Python and Jupyter extensions, open a notebook file, and pick the .venv kernel in the top right corner. The cells, the kernel and the run order work in exactly the same way.

### The keys you need

| Action | Keys or click |
| --- | --- |
| Run the cell and move to the next | Shift and Enter |
| Run the cell and stay | Ctrl and Enter |
| Insert a cell below | press Esc, then B |
| Delete the selected cell | press Esc, then D twice |
| Turn a cell into text | press Esc, then M |
| Turn a cell into code | press Esc, then Y |
| Restart the kernel and run every cell | menu Kernel, Restart and Run All |

The Esc key switches from typing inside a cell to commanding the notebook. Enter switches back. A text cell uses Markdown, a plain way to write headings with a hash sign and lists with a dash. Use text cells to say what each code cell does and what you saw.

### Reading the number in brackets

The In [n] label is the most useful thing on the page. The table shows how to read it.

| Label | Meaning |
| --- | --- |
| In [ ] | this cell has never run since the kernel started |
| In [*] | this cell is running now |
| In [7] | this cell was the 7th cell to run |
| numbers go 1, 2, 3 down the page | the notebook ran in page order; a reader can trust it |
| numbers jump around, such as 5, 2, 9 | the notebook ran out of order; restart and run all before you trust it |

### Notebook or file?

Both run the same Python. Choose by the job.

| Use a notebook when | Use a .py file when |
| --- | --- |
| you explore data and look at each step | the program runs on its own, with no one watching |
| you want a plot right under the code | another program or a server needs to import it |
| you teach or share a worked example | you need tests and version control to work well |
| you train a model once on Colab | you run the same job every day |

A common path is to explore in a notebook, then move the lines that worked into a .py file with functions. The [Functions](/courses/start-here/first-python/functions) lesson gave you the tool for that move. Git, which you meet in the [builders' tools](/courses/start-here/builders-tools/git-and-github) module, shows a notebook as a hard-to-read JSON file, which is one more reason to move finished code out.

### Google Colab

Colab is a free website from Google that runs a Jupyter notebook on Google's computers. Nothing is installed on your computer. Go to colab.research.google.com, sign in with a Google account, and click New notebook. Pandas, NumPy and PyTorch are already installed. To install anything else, start a cell with an exclamation mark, which runs a terminal command: !pip install some-package.

To turn on the free GPU, open the Runtime menu, choose Change runtime type, and pick T4 GPU. Run the cell below to check that the notebook sees it.

:::code
lang: python
import torch
print(torch.cuda.is_available())
:::

The output is True when the GPU is on. CUDA is the name of the software that lets PyTorch use the GPU. Two limits matter. A free session stops after a few hours, or after about 90 minutes of no activity, and the kernel is then empty. The files you uploaded to the session are gone with it. Save results to Google Drive, or download them, before you walk away. To get houses.csv into Colab, click the folder icon on the left and drag the file in, or mount your Drive with the Mount Drive button in the same panel.

## Try it

:::exercise
title: Break the run order on purpose, then fix it
task: Start a notebook next to houses.csv. Write the 3 cells from this lesson and run them in order. Then insert a new cell between cell 2 and cell 3 with the line houses = houses[houses["garden"] == "yes"], run it, and run cell 3. Write down the mean. Then choose Kernel, Restart and Run All, and write down the mean again. Explain why the two numbers differ.
hint: The first mean uses only the 3 houses with a garden. After the restart, every cell runs from the top in page order, and the new cell is above cell 3, so the filter still applies. Check the labels in brackets.
lang: text
solution:
After the filter cell: the mean is 283333.3, the mean of 210000, 260000 and 380000.
After Restart and Run All: the mean is still 283333.3, because the filter cell is now above cell 3 in page order.
To get back to 245000.0, delete the filter cell (or move it below cell 3) and run Restart and Run All again.
The labels now read 1, 2, 3 down the page, so a reader can trust the result.
:::

:::exercise
title: Open a notebook in Colab with a GPU
task: Open colab.research.google.com and create a new notebook. Turn on the T4 GPU under Runtime, Change runtime type. Run a cell with import torch and print(torch.cuda.is_available()). Then drag houses.csv into the Files panel and run pd.read_csv("houses.csv") in a new cell.
hint: If the GPU option is greyed out, wait a minute and try again; free GPUs are shared. The Files panel is the folder icon on the left edge.
lang: python
solution:
import torch
print(torch.cuda.is_available())   # True when the GPU is on

import pandas as pd
houses = pd.read_csv("houses.csv")
houses
:::

## Common mistakes

- Mistake: a cell says NameError for a variable you can see defined 2 cells above. Fix: the cell above has In [ ] and never ran; run the cells from the top, or use Restart and Run All.
- Mistake: you delete the cell that made a variable, and the variable is still there. Fix: deleting a cell does not touch the kernel; restart the kernel to start clean.
- Mistake: you share a notebook that works for you and fails for a friend. Fix: run Restart and Run All before you share; if it fails for you, it was never working.
- Mistake: you put a 300-line program in one cell. Fix: one idea per cell, with a text cell above it; move finished code into a .py file.
- Mistake: you close the Colab tab, come back later, and your data is gone. Fix: the session ended; save results to Drive or download them, and keep the cells that reload the data at the top.

## Check your understanding

:::quiz
title: Check: notebooks
q: The margin of a notebook shows In [3], In [1], In [2] from top to bottom. What does this tell you?
- The notebook has 3 errors
* The cells ran out of page order, so the result may not match what a reader expects
- The kernel has restarted 3 times
why: The number is the run order; the top cell ran last, which a fresh reader would not reproduce.
q: You run cell 2, which reads houses.csv into houses. Then you delete cell 2. What does the kernel hold?
* houses with 6 rows, exactly as before
- Nothing; deleting the cell deletes the variable
- An error
why: The kernel keeps every variable until it is restarted; the page and the kernel are separate.
q: Which task is a better fit for a .py file than a notebook?
- Looking at a plot of price against size
* A program that reloads houses.csv every night and writes a report with no one watching
- Trying 5 filters on the table to see which rows remain
why: A job that runs on its own needs no cells or outputs; a file is simpler to schedule and to test.
q: What does Restart and Run All prove when it succeeds?
- The notebook uses the GPU
* The notebook works from an empty kernel in page order, so it works for anyone
- The notebook has no text cells
why: It empties the kernel and runs every cell from the top, which is exactly what a new reader would do.
q: In Colab, a cell starts with an exclamation mark: !pip install chromadb. What does the exclamation mark do?
- It marks the cell as important
* It runs the rest of the line as a terminal command instead of Python
- It installs the package on your own computer
why: The exclamation mark hands the line to the shell of the Colab computer, which is where pip runs.
q: A free Colab session has been idle for 2 hours. What happens to the variable houses?
- It is saved to Google Drive
* It is gone, because the session ended and the kernel was stopped
- It is kept for 30 days
why: Free sessions end after idle time, and a stopped kernel keeps nothing; only files you saved elsewhere survive.
:::

## Go further

The Jupyter documentation in the links covers installation and the interface in more depth. The Colab FAQ page explains the limits of free sessions. Read the notebook page on Wikipedia for the history of the idea. The next lesson, [Tables with pandas and arrays with NumPy](/courses/start-here/python-for-data/tables-with-pandas), is written as a sequence of cells, so open a notebook before you start it.
`,
      links: [
        { label: 'Project Jupyter documentation', url: 'https://docs.jupyter.org/en/latest/', kind: 'docs' },
        { label: 'Google Colab FAQ', url: 'https://research.google.com/colaboratory/faq.html', kind: 'docs' },
        { label: 'Jupyter notebooks in VS Code', url: 'https://code.visualstudio.com/docs/datascience/jupyter-notebooks', kind: 'docs' },
        { label: 'Notebook interface (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Notebook_interface', kind: 'article' },
      ],
    },
    {
      slug: 'tables-with-pandas',
      title: 'Tables with pandas and arrays with NumPy',
      summary: 'After this lesson you can load a CSV file into a DataFrame, filter and group its rows, draw a simple plot, and turn a column into a NumPy array with a shape.',
      minutes: 25,
      before: [
        { label: 'Notebooks: Jupyter and Colab', to: '/courses/start-here/python-for-data/notebooks' },
        { label: 'Reading and writing files', to: '/courses/start-here/python-for-data/files-csv-json' },
      ],
      objectives: [
        'Load a CSV file into a pandas DataFrame and read its shape and columns.',
        'Filter rows with a condition and compute the mean of a column.',
        'Group rows by a column with groupby and compute one mean per group.',
        'Draw a scatter plot of two columns.',
        'Convert a column to a NumPy array and read its shape.',
      ],
      keyTerms: ['pandas', 'dataframe', 'numpy', 'array', 'shape', 'csv'],
      body: `
## What this lesson covers

This lesson teaches the two packages that hold almost all data in AI work. pandas holds tables, and its table is called a DataFrame. NumPy holds arrays, which are grids of numbers, and every model takes its input as an array. You learn to load houses.csv into a DataFrame, filter it, group it, plot it, and then pull its numbers out as an array with a shape. At the end you can answer "what is the mean price per city?" in one line.

## Why it matters

Before anyone trains a model, they look at the data. They count the rows, check the columns, compute a few means, and draw a plot. All of that is pandas. Then they hand the numbers to the model as an array. That is NumPy. The next module, [Data, the raw material of AI](/courses/start-here/data-the-raw-material/what-data-is), builds the same house table in pandas and names its parts in AI words: examples, features and labels. Later, in the [Linear regression](/courses/ai-foundations/first-models/linear-regression) lesson, the array you build here goes into your first model.

## The idea with an example

> **Analogy.** A DataFrame is a spreadsheet that you control by typing instead of clicking. Each column has a name and a type. You ask for a column by name, you keep the rows that pass a test, and you ask for a summary per group. A NumPy array is what is left when you strip away the names and keep only the grid of numbers, the way a calculator sees it.

pandas is a package for tables. By habit you import it as pd. A DataFrame is one table in memory: rows, named columns, and a type for each column. NumPy is a package for arrays, imported as np. An array is a grid of numbers of one type, with a shape. pandas is built on top of NumPy; every column of a DataFrame is a NumPy array with a name attached.

Here is the running example. Open a notebook next to houses.csv, the file from the first lesson, and run this cell.

:::code
lang: python
import pandas as pd

houses = pd.read_csv("houses.csv")
print(houses.shape)
houses
:::

:::code
lang: text
(6, 5)
   size_m2  bedrooms   city garden   price
0       50         1  Leeds     no  150000
1       70         2  Leeds    yes  210000
2       90         3   York    yes  260000
3      120         4   York    yes  380000
4       60         2  Leeds     no  170000
5      100         3   York     no  300000
:::

One line replaced the open, the csv.DictReader and the loop. The shape (6, 5) says 6 rows and 5 columns. The column of numbers on the left, 0 to 5, is the index, which pandas adds to number the rows. Notice that read_csv converted the prices to numbers on its own; it looks at each column and guesses the type. The flow diagram shows the path of the data through this lesson.

:::flow
title: From a CSV file to a model-ready array
houses.csv -> DataFrame: pd.read_csv
DataFrame -> Filtered rows: houses[condition]
DataFrame -> Group means: groupby("city")
DataFrame -> NumPy array: to_numpy()
NumPy array -> Model: shape (6, 2)
:::

The question for the running example is "what is the mean price in each city?". Press Next to watch groupby answer it.

:::scenario
title: groupby computes one mean per city
state: rows=6, groups=none
step: Run houses.groupby("city"). pandas splits the 6 rows into 2 groups by the value in the city column.
state: Leeds=rows 0 1 4, York=rows 2 3 5
step: Pick the price column of each group with ["price"].
state: Leeds=150000 210000 170000, York=260000 380000 300000
step: Call .mean(). pandas adds the prices in each group and divides by the count. Leeds: 530000 divided by 3.
state: Leeds=176666.67
step: York: 940000 divided by 3.
state: Leeds=176666.67, York=313333.33
step: pandas returns a small table with one row per city. York houses cost about 137,000 pounds more on average.
state: result=2 rows
:::

## How it works

### Look at the table

The first 4 things to run on any new DataFrame are in the table below. Run each one in its own cell.

:::anim
title: groupby splits the 6 rows by city, then mean works on each group
text q "houses.groupby('city')['price'].mean()" @ 620,70 size: 20 color: yellow
rect r0 @ 170,120 size: 200x44 "0   Leeds   150000"
rect r1 @ 170,180 size: 200x44 "1   Leeds   210000"
rect r2 @ 170,240 size: 200x44 "2   York   260000"
rect r3 @ 170,300 size: 200x44 "3   York   380000"
rect r4 @ 170,360 size: 200x44 "4   Leeds   170000"
rect r5 @ 170,420 size: 200x44 "5   York   300000"
text hL "Leeds" @ 480,120 size: 22 color: blue
text hY "York" @ 760,120 size: 22 color: orange
num sumL = 0 @ 480,370 prefix: "sum = " size: 22 color: blue
num sumY = 0 @ 760,370 prefix: "sum = " size: 22 color: orange
num meanL = 0 @ 480,420 prefix: "mean = " digits: 2 size: 24 color: blue
num meanY = 0 @ 760,420 prefix: "mean = " digits: 2 size: 24 color: orange
text note "York costs about 137,000 pounds|more on average" @ 620,480 size: 18 color: grey

step: The table has 6 rows. The question is: what is the mean price in each city?
  show r0, r1, r2, r3, r4, r5
  show q
step: groupby('city') splits the rows by the value in the city column: 3 Leeds rows and 3 York rows.
  show hL, hY
  color r0, r1, r4 blue
  color r2, r3, r5 orange
  move r0 -> 480,170 (1.5s)
  & move r1 -> 480,230 (1.5s)
  & move r4 -> 480,290 (1.5s)
  & move r2 -> 760,170 (1.5s)
  & move r3 -> 760,230 (1.5s)
  & move r5 -> 760,290 (1.5s)
step: ['price'] keeps only the price column of each group.
  label r0 "150000"
  & label r1 "210000"
  & label r4 "170000"
  & label r2 "260000"
  & label r3 "380000"
  & label r5 "300000"
step: mean() first adds the prices in each group. Leeds: 530,000. York: 940,000.
  show sumL, sumY
  count sumL -> 530000 (2s)
  & count sumY -> 940000 (2s)
step: Then it divides each sum by the count, 3. Leeds: 176,666.67. York: 313,333.33.
  show meanL, meanY
  count meanL -> 176666.67 (2s)
  & count meanY -> 313333.33 (2s)
step: pandas returns a small table with one row per city, and no loop. York costs about 137,000 pounds more.
  hide sumL, sumY
  pulse meanL, meanY
  show note
:::

| Line | What it shows | For houses |
| --- | --- | --- |
| houses.shape | rows and columns | (6, 5) |
| houses.columns | the column names | size_m2, bedrooms, city, garden, price |
| houses.dtypes | the type of each column | int64 for the numbers, object for the text |
| houses.head(3) | the first 3 rows | rows 0, 1 and 2 |
| houses.describe() | count, mean, min and max of every number column | mean price 245000 |

The type int64 is a whole number stored in 64 bits. The type object is what pandas calls a text column. If a number column shows object, the file has some text in it, such as the word unknown, and you must clean it. The [Cleaning data](/courses/start-here/data-the-raw-material/cleaning-data) lesson in the next module covers that.

### Select a column and compute

Square brackets with a column name give one column. pandas calls one column a Series. A Series has the same methods as the whole table.

:::code
lang: python
print(houses["price"].mean())
print(houses["price"].max())
print(houses["size_m2"].sum())
:::

:::code
lang: text
245000.0
380000
490
:::

In words: the mean price is the 6 prices added up, 1,470,000, divided by 6. The largest price is 380,000. The sizes add up to 490 square metres. Arithmetic between columns works row by row, in one line, with no loop. The line below makes a new column, price per square metre.

:::code
lang: python
houses["price_per_m2"] = houses["price"] / houses["size_m2"]
houses[["size_m2", "price", "price_per_m2"]]
:::

:::code
lang: text
   size_m2   price  price_per_m2
0       50  150000   3000.000000
1       70  210000   3000.000000
2       90  260000   2888.888889
3      120  380000   3166.666667
4       60  170000   2833.333333
5      100  300000   3000.000000
:::

Check row 0 by hand: 150,000 divided by 50 is 3,000. pandas did the same division 6 times, once per row. The double square brackets select a list of columns, so you see only 3 of the 6.

### Filter rows

A comparison on a column gives a column of True and False, one per row. Put it inside square brackets and pandas keeps the rows where it is True.

:::code
lang: python
york = houses[houses["city"] == "York"]
print(york.shape)
print(york["price"].mean())

big = houses[(houses["size_m2"] >= 90) & (houses["garden"] == "yes")]
print(big.shape)
:::

:::code
lang: text
(3, 6)
313333.3333333333
(2, 6)
:::

The first filter keeps rows 2, 3 and 5, so 3 rows and 6 columns, because price_per_m2 is now a column too. The mean of those 3 prices is 313,333. The second filter joins 2 conditions with the ampersand, which means and. Each condition sits in its own round brackets. Rows 2 and 3 pass: 90 and 120 square metres, both with a garden.

### Group and summarise

The groupby method answers the question "per city" or "per anything". The steps are always the same.

1. Split the rows into groups by the values of one column: groupby("city").
2. Pick the column to summarise: ["price"].
3. Pick the summary: .mean(), .count(), .max() or .sum().

:::code
lang: python
houses.groupby("city")["price"].mean()
:::

:::code
lang: text
city
Leeds    176666.666667
York     313333.333333
Name: price, dtype: float64
:::

Two groups, two means, and no loop. Replace mean with count to see 3 houses in each city, or group by garden to compare houses with and without one. The houses with a garden have a mean price of 283,333, and the houses without, 206,667.

### A simple plot

A plot is the fastest way to see a pattern. pandas draws with the matplotlib package, so install it once with python -m pip install matplotlib. In Colab it is already there. The cell below draws one point per house, with the size on the horizontal axis and the price on the vertical axis.

:::code
lang: python
import matplotlib.pyplot as plt

houses.plot.scatter(x="size_m2", y="price")
plt.show()
:::

The 6 points rise from the bottom left to the top right. Larger houses cost more. That rising line is the pattern a model will learn in the first lesson on [linear regression](/courses/ai-foundations/first-models/linear-regression). You have now looked at the data before modelling it, which is the habit this lesson exists to teach.

### From a DataFrame to a NumPy array

A model does not read column names. It reads a grid of numbers. The method to_numpy strips the names and returns a NumPy array. An array has a shape, which is the size along each dimension.

:::code
lang: python
import numpy as np

prices = houses["price"].to_numpy()
print(prices)
print(prices.shape)
print(prices / 1000)

X = houses[["size_m2", "bedrooms"]].to_numpy()
print(X.shape)
print(X[2])
print(X[:, 0])
:::

:::code
lang: text
[150000 210000 260000 380000 170000 300000]
(6,)
[150. 210. 260. 380. 170. 300.]
(6, 2)
[90  3]
[ 50  70  90 120  60 100]
:::

Read the shapes. The shape (6,) with one number means a list of 6 values, a 1-dimensional array. The shape (6, 2) means 6 rows and 2 columns, a 2-dimensional array. The line prices / 1000 divides all 6 numbers in one step; this is called vectorised arithmetic, and it is why NumPy is fast. X[2] is row 2: the house with 90 square metres and 3 bedrooms. X[:, 0] is every row, column 0: all 6 sizes. The colon means all.

| Expression | Shape | Meaning |
| --- | --- | --- |
| prices | (6,) | 6 numbers in a line: a vector |
| X | (6, 2) | 6 rows and 2 columns: a matrix |
| X[2] | (2,) | one row, 2 numbers |
| X[:, 0] | (6,) | one column, 6 numbers |
| X.mean(axis=0) | (2,) | the mean of each column: 81.67 and 2.5 |

The last line of the table computes 2 means at once. The axis=0 argument means go down the rows, so you get one number per column. The mean size is 490 divided by 6, about 81.67 square metres, and the mean number of bedrooms is 15 divided by 6, which is 2.5. These 2 names, vector and matrix, come back in the [mathematics track](/courses/math-from-zero/vectors-and-matrices/what-a-vector-is), where you learn what you can do with them. In AI code, an array like X, with one row per example and one column per feature, is the input to nearly every model.

## Try it

:::exercise
title: Three questions in three lines
task: In a notebook with houses loaded, answer 3 questions, each in one line. 1: What is the mean price of the houses with a garden? 2: How many houses are in each city? 3: What is the largest price per square metre, and in which city? Check by hand: the garden mean is 283,333, each city has 3 houses, and the largest price per square metre is 3,166.67 in York.
hint: Use a filter for question 1, groupby with count for question 2, and sort_values on price_per_m2 with ascending=False for question 3.
lang: python
solution:
houses["price_per_m2"] = houses["price"] / houses["size_m2"]

print(houses[houses["garden"] == "yes"]["price"].mean())      # 283333.33
print(houses.groupby("city")["price"].count())                 # Leeds 3, York 3
print(houses.sort_values("price_per_m2", ascending=False).head(1))  # row 3, York, 3166.67
:::

:::exercise
title: Shapes by hand
task: Without running code, write the shape of each expression. a: houses[["size_m2", "bedrooms", "price"]].to_numpy(). b: houses["bedrooms"].to_numpy(). c: houses[houses["city"] == "Leeds"][["size_m2"]].to_numpy(). Then run them and check.
hint: Count rows first, then columns. A single column name in single brackets gives 1 dimension; a list of names in double brackets gives 2 dimensions, even with one name.
lang: text
solution:
a: (6, 3)   six rows, three columns
b: (6,)     one dimension with six numbers
c: (3, 1)   three Leeds rows, one column, two dimensions because of the double brackets
:::

## Common mistakes

- Mistake: you write houses["price"].mean without the round brackets and see a strange message instead of a number. Fix: mean is a method, so call it: houses["price"].mean().
- Mistake: you write houses["size_m2" > 90] and get an error. Fix: the condition is on the column, so the column goes first: houses[houses["size_m2"] > 90].
- Mistake: you join two conditions with the word and and get an error about ambiguous truth. Fix: use the ampersand and put each condition in round brackets.
- Mistake: you confuse shape (6,) with shape (6, 1). Fix: (6,) is a line of 6 numbers; (6, 1) is a grid with 6 rows and 1 column; models often want the grid.
- Mistake: you loop over the rows with a for loop to add two columns. Fix: write houses["a"] + houses["b"]; pandas does the whole column in one step and runs much faster.

## Check your understanding

:::quiz
title: Check: pandas and NumPy
q: houses has shape (6, 5). What is the shape of houses[houses["garden"] == "yes"]?
- (6, 5)
* (3, 5)
- (3,)
why: The filter keeps the 3 rows where garden is yes and all 5 columns.
q: Which line gives the mean price for each city?
- houses["city"]["price"].mean()
* houses.groupby("city")["price"].mean()
- houses["price"].mean("city")
why: groupby splits the rows by city, then ["price"].mean() summarises each group.
q: prices is a NumPy array of 6 prices. What does prices / 1000 do?
- It divides only the first price
* It divides all 6 prices in one step and returns a new array
- It raises an error because an array is not a number
why: NumPy applies arithmetic to every item of an array at once.
q: X = houses[["size_m2", "bedrooms"]].to_numpy(). What is X[:, 1]?
- The second house, both columns
* All 6 bedroom counts
- The first house
why: The colon means every row, and column 1 is the second column, bedrooms.
q: houses["price"].dtypes shows object instead of int64. What is the most likely cause?
- The column has more than 1,000 rows
* At least one value in the column is text, such as "unknown"
- The file has no header line
why: pandas keeps a column as text when any value cannot become a number.
q: What is houses.groupby("garden")["price"].mean() for the houses without a garden? Their prices are 150000, 170000 and 300000.
- 283333.33
- 245000.0
* 206666.67
why: 150000 + 170000 + 300000 is 620000, and 620000 divided by 3 is 206666.67.
:::

## Go further

The pandas page 10 minutes to pandas in the links is the best next read; it shows every method from this lesson with a larger table. The NumPy guide for absolute beginners explains shapes and axes with pictures. Keep both pages open while you work. The next module, [Data, the raw material of AI](/courses/start-here/data-the-raw-material/what-data-is), takes the same house table and names its rows and columns in the words of machine learning: examples, features and labels.
`,
      links: [
        { label: '10 minutes to pandas', url: 'https://pandas.pydata.org/docs/user_guide/10min.html', kind: 'docs' },
        { label: 'NumPy: the absolute basics for beginners', url: 'https://numpy.org/doc/stable/user/absolute_beginners.html', kind: 'docs' },
        { label: 'pandas read_csv reference', url: 'https://pandas.pydata.org/docs/reference/api/pandas.read_csv.html', kind: 'docs' },
        { label: 'matplotlib quick start guide', url: 'https://matplotlib.org/stable/users/explain/quick_start.html', kind: 'docs' },
      ],
    },
  ],
}
