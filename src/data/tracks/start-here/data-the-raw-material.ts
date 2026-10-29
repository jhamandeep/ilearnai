import type { Module } from '../../types'

export const mod: Module = {
  slug: 'data-the-raw-material',
  title: 'Data, the raw material of AI',
  description: 'Learn what a data set is, the kinds of data a model can read, how to clean a table with pandas, and the rules that say which data you may use.',
  level: 'foundations',
  lessons: [
    {
      slug: 'what-data-is',
      title: 'What data is',
      summary: 'Read a table as a data set: rows are examples, columns are features, and one column is the label a model learns to predict.',
      minutes: 20,
      before: [{ label: 'Tables with pandas and arrays with NumPy', to: '/courses/start-here/python-for-data/tables-with-pandas' }],
      objectives: [
        'Explain what a data set, an example, a feature and a label are, with the house table as the case.',
        'Read the shape of a table and say how many examples and features it holds.',
        'Build the 6-row house table as a pandas DataFrame and compute the mean price.',
        'Choose which column is the label for a given prediction task.',
      ],
      keyTerms: ['dataset', 'row', 'column', 'feature', 'label', 'DataFrame', 'pandas'],
      body: `
## What this lesson covers

This lesson teaches the one idea under all of artificial intelligence (AI): a model learns from a table of examples. You learn the four words that describe such a table. The words are data set, row, feature and label. At the end you can build a 6-row table of house prices in pandas and read its shape.

## Why it matters

Every AI system in this course starts from data. A data set is a collection of recorded facts, stored so that a computer can read them. The model you train later in the [learning loop](/courses/ai-foundations/what-ai-is/the-learning-loop) lesson reads the same house table you build here. If you can name the parts of a table, you can read any data set in the field. The next lesson, [Kinds of data](/courses/start-here/data-the-raw-material/kinds-of-data), shows that text, pictures and sound also become tables of numbers.

:::video
id: PeMlggyqz0Y
why: Watch all 2 minutes. Count how many times the speaker says "data". Every method in the video starts from a table like the one in this lesson.
:::

## The idea with an example

> **Analogy.** Think of a recipe card box in a kitchen. Each card is one recipe. Every card has the same slots: name, cooking time, number of people, price per portion. The box is the data set. One card is one row. One slot is one column. If you want to guess the price of a new recipe from its other slots, the price slot is the label.

Now replace recipes with houses. An estate agent wrote down 6 houses that sold last year. For each house, she recorded the floor area in square metres, the number of bedrooms, the city, whether it has a garden, and the sale price in pounds. This is the table you carry through the whole module.

| id | size_m2 | bedrooms | city | garden | price |
| --- | --- | --- | --- | --- | --- |
| 1 | 50 | 1 | Leeds | no | 150000 |
| 2 | 70 | 2 | Leeds | yes | 210000 |
| 3 | 90 | 3 | York | yes | 260000 |
| 4 | 120 | 4 | York | yes | 380000 |
| 5 | 60 | 2 | Leeds | no | 170000 |
| 6 | 100 | 3 | York | no | 300000 |

Read the table one word at a time. A row is one line across the table, and it describes one thing. Row 3 describes one house: 90 square metres, 3 bedrooms, in York, with a garden, sold for 260,000 pounds. In AI we also call a row an example, because the model learns from it as a pupil learns from a worked example. The table has 6 rows, so the data set has 6 examples.

A column is one line down the table, and it holds one kind of fact for every row. The column size_m2 holds the floor area of every house. In AI we call a column that describes the thing a feature. The table has 4 feature columns: size_m2, bedrooms, city and garden. The id column is not a feature. It is only a row number, and it tells you nothing about the house itself.

The label is the one column you want the model to predict. Here the question is "what will a house sell for?", so the label is price. A model looks at the 4 features of a house and makes a guess at the label. When you later measure how good the model is, you compare its guess with the real price in the table.

The diagram shows the path from the raw table to a prediction.

:::flow
title: From a table to a prediction
Table of 6 rows -> Features: 4 columns per row
Table of 6 rows -> Label: the price column
Features -> Model: learns a rule
Label -> Model: shows the right answer
Model -> Prediction: price for a new house
:::

Press Next to read one row the way a model does.

:::scenario
title: Reading row 3 of the house table
state: row=3, size_m2=90, bedrooms=3, city=York, garden=yes, price=260000
step: Pick row 3. The row is one example, one house that sold.
step: Read the 4 features. Size is 90 square metres. There are 3 bedrooms. The city is York. It has a garden.
state: features=[90 3 York yes]
step: Read the label. The house sold for 260000 pounds.
state: label=260000
step: Keep features and label apart. The model sees the features and must guess the label.
step: Repeat for all 6 rows. The model sees 6 examples with 4 features each.
state: examples=6, features=4
:::

## How it works

A data set has a shape. The shape is 2 numbers: the number of rows and the number of columns. The house table has shape 6 by 6 when you count the id column, or 6 by 5 without it. Say the shape out loud as "6 rows and 5 columns". When people say a data set has 10,000 examples, they mean it has 10,000 rows.

:::anim
title: One row becomes features and a label, and 6 rows become a data set
text hdr "One house · five recorded values" @ 480,50 size: 24 color: grey
rect c_size @ 120,120 size: 156x76 "size_m2|90" color: blue
rect c_bed @ 300,120 size: 156x76 "bedrooms|3" color: blue
rect c_city @ 480,120 size: 156x76 "city|York" color: blue
rect c_gar @ 660,120 size: 156x76 "garden|yes" color: blue
rect c_price @ 840,120 size: 156x76 "price|260000" color: purple
text featureTitle "Features · what we know" @ 335,195 size: 22 color: blue
rect f_size @ 110,245 size: 128x60 "90 m²" color: blue
rect f_bed @ 260,245 size: 128x60 "3 beds" color: blue
rect f_city @ 410,245 size: 128x60 "York" color: blue
rect f_gar @ 560,245 size: 128x60 "Garden" color: blue
rect price @ 800,245 size: 184x60 "£260,000" color: purple
text labelTitle "Label · what to predict" @ 800,195 size: 22 color: purple
box xbox "X: 4 features" @ 180,355 size: 230x76 icon: none color: blue
box model "Model" @ 480,355 size: 180x76 icon: model color: teal
box ybox "y: the label" @ 800,355 size: 210x76 icon: none color: purple
num ex = 0 @ 160,470 prefix: "examples = " size: 26 color: blue
num feat = 0 @ 460,470 prefix: "features = " size: 26 color: blue
num meanp = 0 @ 780,470 prefix: "mean £" size: 26 color: purple

step: Row 3 is one example: one house that sold, written across the table in 5 cells.
  show hdr, c_size, c_bed, c_city, c_gar, c_price
  pulse c_size, c_bed, c_city, c_gar, c_price
step: The 4 cells that describe the house are features. Together they form X.
  show featureTitle
  morph c_size -> f_size
  & morph c_bed -> f_bed
  & morph c_city -> f_city
  & morph c_gar -> f_gar
  show xbox
step: The price is the column we want to predict. It is the label, y.
  show labelTitle
  morph c_price -> price
  show ybox
step: A model reads the features, learns a rule, and compares its guess with the label.
  show model
  arrow xbox -> model : features
  arrow ybox -> model : right answer
  restore ybox
step: Repeat for all 6 rows. The data set has 6 examples with 4 features: shape (6, 4).
  show ex, feat
  count ex -> 6 (2s)
  & count feat -> 4 (2s)
  label xbox "X: shape (6, 4)"
  & label ybox "y: shape (6,)"
step: Add the 6 prices and divide by 6. The mean price, 245,000 pounds, is a first guess for any house.
  show meanp
  count meanp -> 245000 (2.5s)
  highlight meanp
:::

Here are the steps to turn any table into a data set a model can learn from.

1. Decide what one row stands for. In the house table, one row is one house.
2. List the columns and give each a short name with no spaces. Use size_m2, not "Size (m2)".
3. Choose the label column from the question you want to answer. For "what is the price?" the label is price.
4. Call every other column that describes the thing a feature. Drop id columns and other columns that only count rows.
5. Write down the shape. The house table has 6 examples and 4 features.

The table below names the parts of the house table in both everyday words and AI words.

| Part of the table | Everyday word | AI word | In the house table |
| --- | --- | --- | --- |
| The whole table | table | data set | 6 houses |
| One line across | row | example | house 3: 90 m2, 3 bedrooms, York, garden, 260000 |
| One line down | column | feature | size_m2, bedrooms, city, garden |
| The column to predict | target | label | price |
| Rows by columns | size | shape | 6 by 5 |

Now build the table in Python. The pandas library is a Python package for tables. A DataFrame is the pandas name for one table with named columns. You met both in the [Tables with pandas](/courses/start-here/python-for-data/tables-with-pandas) lesson. The code below builds the house table from a dictionary. Each key is a column name. Each value is the list of that column, top to bottom.

:::code
lang: python
file: houses.py
import pandas as pd

houses = pd.DataFrame({
    "size_m2": [50, 70, 90, 120, 60, 100],
    "bedrooms": [1, 2, 3, 4, 2, 3],
    "city": ["Leeds", "Leeds", "York", "York", "Leeds", "York"],
    "garden": ["no", "yes", "yes", "yes", "no", "no"],
    "price": [150000, 210000, 260000, 380000, 170000, 300000],
})

print(houses.shape)
print(houses)
print(houses["price"].mean())
:::

Run the file with python houses.py. The output looks like this.

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
245000.0
:::

Read the output line by line. The shape (6, 5) says 6 rows and 5 columns. Pandas prints its own row numbers on the left, from 0 to 5, so you do not need an id column. The last line is the mean price. The mean is the sum of all values divided by how many there are. The 6 prices add up to 1,470,000 pounds. Divide by 6 and you get 245,000 pounds.

Write the mean as a formula and in words:

$$\\text{mean} = \\frac{150000 + 210000 + 260000 + 380000 + 170000 + 300000}{6} = 245000$$

In words: add the 6 prices, then divide the total by 6, and the result is 245,000 pounds. The mean is the first number a data scientist looks at, because it gives a first guess at the label. If you knew nothing about a new house, 245,000 pounds is a fair guess.

Split the table into features and label with 2 lines of pandas. By habit, people call the features X with a capital letter and the label y with a small letter.

:::code
lang: python
X = houses.drop(columns=["price"])
y = houses["price"]
print(X.shape, y.shape)
:::

The output is (6, 4) (6,). X has 6 rows and 4 feature columns. The label y has 6 values and no second number, because it is a single column. Every model in the next track takes X and y in this form.

## Try it

:::exercise
title: Add a seventh house
task: A seventh house sold in Leeds. It has 80 square metres, 3 bedrooms and no garden. It sold for 230,000 pounds. Add it to the DataFrame as a new row. Print the new shape and the new mean price. Check by hand: the new total is 1,700,000 pounds, and 1,700,000 divided by 7 is about 242,857.
hint: Build a second DataFrame with one row, then join the two tables with pd.concat([houses, new_row], ignore_index=True).
lang: python
solution:
import pandas as pd

houses = pd.DataFrame({
    "size_m2": [50, 70, 90, 120, 60, 100],
    "bedrooms": [1, 2, 3, 4, 2, 3],
    "city": ["Leeds", "Leeds", "York", "York", "Leeds", "York"],
    "garden": ["no", "yes", "yes", "yes", "no", "no"],
    "price": [150000, 210000, 260000, 380000, 170000, 300000],
})

new_row = pd.DataFrame({
    "size_m2": [80], "bedrooms": [3], "city": ["Leeds"],
    "garden": ["no"], "price": [230000],
})
houses = pd.concat([houses, new_row], ignore_index=True)

print(houses.shape)          # (7, 5)
print(houses["price"].mean())  # 242857.14...
:::

## Common mistakes

- Mistake: you count the id column as a feature. Fix: an id only numbers the rows. It says nothing about the house, so drop it before you train a model.
- Mistake: you mix up rows and columns when you read a shape. Fix: a shape always lists rows first, then columns. (6, 5) means 6 rows and 5 columns.
- Mistake: you keep the label inside the features. Fix: use drop(columns=["price"]) to build X. A model that sees the price does not learn; it copies.
- Mistake: you think more columns always help. Fix: a column helps only when it describes the thing you predict. The agent's phone number does not predict the price.
- Mistake: you write a column name with spaces, like "size m2". Fix: use one word with underscores, like size_m2, so code like houses["size_m2"] works.

## Check your understanding

:::quiz
title: Check: parts of a data set
q: In the house table, what does one row stand for?
- One kind of fact, such as the city, for all houses
* One house that sold, with all its facts
- The mean of one column
why: A row runs across the table and describes one thing, here one house. A column runs down and holds one kind of fact.
q: You want a model to predict the number of bedrooms from the other columns. Which column is the label?
- price
- size_m2
* bedrooms
why: The label is the column you ask the model to predict. The question changes which column is the label.
q: A DataFrame has shape (1200, 9). How many examples does it hold?
* 1200
- 9
- 10800
why: The first number of a shape is the number of rows, and each row is one example.
q: Compute the mean size of the 6 houses. The sizes are 50, 70, 90, 120, 60 and 100 square metres.
- 70.0
* 81.67
- 490.0
why: The sizes add up to 490. Divide by 6 and you get 81.67 square metres.
q: Which line builds the features X from the DataFrame houses?
- X = houses["price"]
* X = houses.drop(columns=["price"])
- X = houses.shape
why: The features are every column except the label. drop removes the price column and keeps the rest.
:::

## Go further

Read the first page of the pandas user guide in the links. It shows the same DataFrame ideas with more rows. The Wikipedia page on data sets gives examples from other fields, such as weather and medicine. The next lesson, [Kinds of data](/courses/start-here/data-the-raw-material/kinds-of-data), adds a new idea: numbers, categories, text, pictures and sound all become columns of numbers before a model reads them.
`,
      links: [
        { label: 'pandas: 10 minutes to pandas', url: 'https://pandas.pydata.org/docs/user_guide/10min.html', kind: 'docs' },
        { label: 'Wikipedia: Data set', url: 'https://en.wikipedia.org/wiki/Data_set', kind: 'article' },
        { label: 'Wikipedia: Feature (machine learning)', url: 'https://en.wikipedia.org/wiki/Feature_(machine_learning)', kind: 'article' },
        { label: 'Google Machine Learning Crash Course', url: 'https://developers.google.com/machine-learning/crash-course', kind: 'course' },
      ],
    },
    {
      slug: 'kinds-of-data',
      title: 'Kinds of data',
      summary: 'Sort every column into numbers, categories, text, images or audio, and see how each kind becomes numbers before a model reads it.',
      minutes: 21,
      objectives: [
        'Classify each column of the house table as numerical, categorical or text.',
        'Explain how a picture is a grid of numbers and a sound is a list of numbers.',
        'Choose between structured and unstructured for a given source of data.',
        'Convert a yes/no column to 0 and 1 with pandas.',
      ],
      keyTerms: ['numerical data', 'categorical data', 'structured data', 'unstructured data', 'pixel', 'dtype'],
      body: `
## What this lesson covers

This lesson sorts data into kinds. A column can hold numbers, categories, or free text. A file can hold a picture or a sound. You learn that a model can read only numbers, so every kind of data becomes numbers first. At the end you can look at any column and say which kind it is and how it turns into numbers.

## Why it matters

A model is a machine that does arithmetic. It can multiply 90 by 2. It cannot multiply the word "York" by 2. Before you train a model you must know the kind of each column, because the kind decides how you turn it into numbers. The same rule explains how a model can read a photo or a voice recording. Later tracks build on this: tokens turn text into numbers, and pixels turn pictures into numbers. The next lesson, [Cleaning data](/courses/start-here/data-the-raw-material/cleaning-data), uses the kinds you learn here to spot values that do not fit their column.

:::video
id: zsjvFFKOm3c
why: Watch all 2 minutes. A database table is structured data: fixed columns, one kind per column. Notice that every column has a declared type, like the dtype you print in this lesson.
:::

## The idea with an example

> **Analogy.** A postal sorting office does not read letters. It sorts them by a number, the postcode. A letter with a handwritten address must first get a postcode before the machine can route it. Data works the same way. Numbers go straight to the model. Everything else must first get its "postcode", its form as numbers.

Return to the house table from the last lesson. The estate agent added a description of each house in plain words, and a small photo of each front door. Here is the table with the new text column.

| id | size_m2 | bedrooms | city | garden | description | price |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 50 | 1 | Leeds | no | Small flat near the station | 150000 |
| 2 | 70 | 2 | Leeds | yes | Bright flat with a shared garden | 210000 |
| 3 | 90 | 3 | York | yes | Family house, quiet street | 260000 |
| 4 | 120 | 4 | York | yes | Large house with a new kitchen | 380000 |
| 5 | 60 | 2 | Leeds | no | Flat above a shop | 170000 |
| 6 | 100 | 3 | York | no | Terraced house near the river | 300000 |

Look at one column at a time and ask one question: can you do arithmetic with it?

The column size_m2 holds numbers you can add and compare. 90 is more than 70, and 90 plus 10 is 100. This is numerical data: values that are amounts. The column bedrooms is also numerical, but it only takes whole numbers. You cannot have 2.5 bedrooms. Numerical data that counts things is called a count. Numerical data that measures things, like size, can take any value, such as 72.5 square metres.

The column city holds names from a short fixed list: Leeds or York. You cannot add Leeds to York. This is categorical data: a value chosen from a small set of options. The column garden is categorical too, with the 2 options yes and no. A categorical column with only 2 options is often called binary, which means "two-valued".

The column description holds free text. Each value is a short sentence that a person wrote, and no 2 are alike. Text is not categorical, because the set of possible sentences is not small and fixed. A model reads text only after a step that splits it into pieces and gives each piece a number. That step is called tokenising, and a later track explains it.

The photo of the front door is not even in the table. It is a separate file. Yet a photo is also numbers. A digital picture is a grid of tiny squares. Each square is called a pixel, and each pixel holds a number for its brightness. In a grey picture, 0 means black and 255 means white. The grid below is a 4 by 4 grey picture of a bright door with a dark handle on the right.

:::matrix
title: A 4 by 4 grey picture as numbers, 0 is black and 255 is white
cols: col 0, col 1, col 2, col 3
row 0: 200, 200, 200, 200
row 1: 200, 190, 60, 200
row 2: 200, 190, 60, 200
row 3: 200, 200, 200, 200
:::

A colour picture is 3 such grids, one each for red, green and blue. A photo of 1,000 by 1,000 pixels in colour is 3,000,000 numbers. Sound follows the same idea in one dimension. A microphone measures air pressure thousands of times per second. A recording is a long list of those measurements, often 44,100 numbers for each second of sound.

Press Next to see one photo become numbers.

:::scenario
title: Turning the door photo into numbers
state: input=photo of a door, numbers=0
step: Start with a photo of the front door of house 3.
step: Cut the photo into a grid of 4 rows and 4 columns. Each cell is one pixel.
state: grid=4 by 4, pixels=16
step: Measure the brightness of each pixel from 0 (black) to 255 (white).
state: numbers=16
step: Read the grid row by row into one long list of 16 numbers.
state: list=[200 200 200 200 200 190 60 200 ...]
step: The model now reads 16 numbers, not a picture. The dark handle is the two 60s.
:::

The diagram sorts the house data into structured and unstructured parts.

:::flow
title: Every kind of data becomes numbers
Numbers -> Model: used as they are
Categories -> Codes: Leeds=0 York=1
Codes -> Model: now numbers
Text -> Tokens: split and number
Tokens -> Model: now numbers
Photo -> Pixels: grid of brightness
Pixels -> Model: now numbers
:::

## How it works

Data comes in 2 big families. Structured data has a fixed layout: rows and columns, with one kind per column. The house table without the description is structured. A spreadsheet and a database table are structured. Unstructured data has no fixed layout: free text, photos, sound and video. The description column, the door photos, and a voice note from the agent are unstructured. Most of the data in the world is unstructured, and modern AI is the first set of tools that handles it well.

:::anim
title: Every kind of data becomes numbers before the model reads it
rect c_size @ 150,100 size: 170x56 "size_m2 = 90"
rect c_city @ 150,190 size: 170x56 "city = York"
rect c_gar @ 150,280 size: 170x56 "garden = yes"
rect c_photo @ 150,410 size: 170x56 "door photo"
rect k_city @ 490,190 size: 200x56 "Leeds 0, York 1"
rect k_gar @ 490,280 size: 200x56 "no 0, yes 1"
rect p00 @ 420,340 size: 44x40 "200" color: white
rect p01 @ 468,340 size: 44x40 "200" color: white
rect p02 @ 516,340 size: 44x40 "200" color: white
rect p03 @ 564,340 size: 44x40 "200" color: white
rect p10 @ 420,384 size: 44x40 "200" color: white
rect p11 @ 468,384 size: 44x40 "190" color: #d0d0d0
rect p12 @ 516,384 size: 44x40 "60" color: #555555
rect p13 @ 564,384 size: 44x40 "200" color: white
rect p20 @ 420,428 size: 44x40 "200" color: white
rect p21 @ 468,428 size: 44x40 "190" color: #d0d0d0
rect p22 @ 516,428 size: 44x40 "60" color: #555555
rect p23 @ 564,428 size: 44x40 "200" color: white
rect p30 @ 420,472 size: 44x40 "200" color: white
rect p31 @ 468,472 size: 44x40 "200" color: white
rect p32 @ 516,472 size: 44x40 "200" color: white
rect p33 @ 564,472 size: 44x40 "200" color: white
box model "Model" @ 800,100 size: 180x64 icon: model
num pix = 0 @ 800,300 prefix: "pixels = " size: 26
num mean = 0 @ 800,380 prefix: "mean = " digits: 2 size: 26 color: yellow
text note "Every value is now a number,|so the model can do arithmetic" @ 800,470 size: 16 color: grey

step: A model does arithmetic, so it reads only numbers. The size 90 goes in as it is.
  show c_size, model
  arrow c_size -> model : 90
step: York is a category from a fixed list. It becomes one 0/1 code per option: Leeds 0, York 1.
  show c_city, k_city
  arrow c_city -> k_city : code
  arrow k_city -> model : 0, 1
step: The binary column garden maps no to 0 and yes to 1.
  show c_gar, k_gar
  arrow c_gar -> k_gar : map
  arrow k_gar -> model : 1
step: The door photo is not in the table. Cut it into a grid of 4 by 4 pixels.
  show c_photo, pix
  show p00, p01, p02, p03, p10, p11, p12, p13, p20, p21, p22, p23, p30, p31, p32, p33 (1.5s)
  & count pix -> 16 (1.5s)
  arrow c_photo -> p10 : pixels
step: Each pixel holds a brightness from 0 (black) to 255 (white). The dark handle is the two 60s.
  highlight p12, p22
  pulse p12, p22
step: The 16 numbers go to the model as one list. Their mean, 173.75, says the door is bright.
  show mean, note
  restore p12, p22
  arrow p03 -> model : 16 numbers
  & count mean -> 173.75 (2s)
  highlight model
:::

Here is how to work out the kind of a column.

1. Ask: is the value an amount you can add? If yes, it is numerical. Check whether it counts (whole numbers) or measures (any decimal).
2. Ask: is the value one option from a short fixed list? If yes, it is categorical. Write down the list of options.
3. Ask: is the value free text that a person wrote? If yes, it is text. It needs tokenising before a model reads it.
4. Ask: is the value a file, such as a photo or a recording? If yes, it is an image or audio. It becomes a grid or a list of numbers.
5. For every column that is not numerical, write down how it becomes numbers.

The table collects the kinds with their house-table examples and their path to numbers.

| Kind | House example | Options or range | How it becomes numbers |
| --- | --- | --- | --- |
| Numerical, measured | size_m2 = 90 | any value, like 72.5 | used as it is |
| Numerical, count | bedrooms = 3 | whole numbers 0, 1, 2, ... | used as it is |
| Categorical | city = York | Leeds, York | one code per option: Leeds 0, York 1 |
| Categorical, binary | garden = yes | yes, no | no 0, yes 1 |
| Text | "Family house, quiet street" | any sentence | split into tokens, one number each |
| Image | door photo | any picture | grid of pixels, 0 to 255 |
| Audio | agent's voice note | any sound | list of pressure values per second |

Pandas keeps a dtype for every column. The dtype is the data type, the kind of value that pandas stores in that column. Print the dtypes to check your own sorting.

:::code
lang: python
file: kinds.py
import pandas as pd

houses = pd.DataFrame({
    "size_m2": [50, 70, 90, 120, 60, 100],
    "bedrooms": [1, 2, 3, 4, 2, 3],
    "city": ["Leeds", "Leeds", "York", "York", "Leeds", "York"],
    "garden": ["no", "yes", "yes", "yes", "no", "no"],
    "price": [150000, 210000, 260000, 380000, 170000, 300000],
})

print(houses.dtypes)
print(houses["city"].unique())
:::

:::code
lang: text
size_m2      int64
bedrooms     int64
city        object
garden      object
price        int64
dtype: object
['Leeds' 'York']
:::

Read the output. int64 means a whole number stored in 64 bits, so these columns are numerical. object is the pandas word for text, so city and garden are not numbers yet. The unique method lists the different values in a column. City has 2 options, which confirms that it is categorical.

Now give the categorical columns numbers. For a binary column, map one option to 0 and the other to 1. For a column with more options, one way is to make one new 0/1 column per option. Pandas does this with get_dummies.

:::code
lang: python
houses["garden"] = houses["garden"].map({"no": 0, "yes": 1})
city_codes = pd.get_dummies(houses["city"], dtype=int)
print(houses[["garden"]].head(3))
print(city_codes.head(3))
:::

:::code
lang: text
   garden
0       0
1       1
2       1
   Leeds  York
0      1     0
1      1     0
2      0     1
:::

House 1 is in Leeds, so its Leeds column is 1 and its York column is 0. Every value in the table is now a number, and a model can read it. A picture goes through the same change with NumPy, the Python package for grids of numbers. A grid of 4 rows and 4 columns has shape (4, 4). You met shape in the last lesson for tables; it means the same thing here.

:::code
lang: python
import numpy as np

door = np.array([
    [200, 200, 200, 200],
    [200, 190,  60, 200],
    [200, 190,  60, 200],
    [200, 200, 200, 200],
])
print(door.shape)      # (4, 4)
print(door.mean())     # 173.75
print(door.flatten())  # one list of 16 numbers
:::

The mean brightness is 173.75: the 16 values add up to 2,780, and 2,780 divided by 16 is 173.75. A bright door gives a high mean. A model for pictures learns from numbers like these.

## Try it

:::exercise
title: Sort the columns of a new table
task: A school keeps a table with these columns: student_id, age, class_name (one of A, B, C), height_cm, favourite_book_review (a paragraph), passed_exam (yes or no). For each column, write its kind: numerical count, numerical measured, categorical, binary categorical, text, or id. Then build a 3-row DataFrame with the columns age, class_name and passed_exam, map passed_exam to 0 and 1, and print the dtypes.
hint: Ask the 4 questions from How it works for each column. An id is not a feature. yes/no is binary.
lang: python
solution:
# student_id: id, not a feature
# age: numerical count (whole years)
# class_name: categorical (A, B, C)
# height_cm: numerical measured (any decimal)
# favourite_book_review: text
# passed_exam: binary categorical (yes, no)

import pandas as pd

pupils = pd.DataFrame({
    "age": [11, 12, 11],
    "class_name": ["A", "B", "A"],
    "passed_exam": ["yes", "no", "yes"],
})
pupils["passed_exam"] = pupils["passed_exam"].map({"no": 0, "yes": 1})
print(pupils.dtypes)
# age             int64
# class_name     object
# passed_exam     int64
:::

## Common mistakes

- Mistake: you treat a numeric code as an amount. A postcode or an id number is a label, not a size. Fix: ask whether adding two values means anything. If not, the column is categorical even when it looks like a number.
- Mistake: you give categories the codes 1, 2, 3 and let the model think option 3 is "more" than option 1. Fix: use one 0/1 column per option with get_dummies when the options have no natural order.
- Mistake: you think a photo is one thing the model "sees". Fix: a photo is a grid of brightness numbers. The model does arithmetic on the grid.
- Mistake: you call the description column categorical because it holds words. Fix: categorical means a short fixed list of options. Free sentences are text.

## Check your understanding

:::quiz
title: Check: kinds of data
q: The column bedrooms holds the values 1, 2, 3, 4, 2, 3. What kind of data is it?
- Categorical, because there are only 4 different values
* Numerical count, because 4 bedrooms is 2 more than 2 bedrooms
- Text, because a person typed it
why: You can add and compare the values, and they count things in whole numbers, so they are numerical counts.
q: Which data is unstructured?
- The size_m2 column
- A spreadsheet of sales by month
* A folder of door photos
why: A photo has no fixed rows and columns of named facts. Structured data has a fixed layout of columns.
q: A grey picture has 3 rows and 5 columns of pixels. How many numbers does it hold?
- 8
* 15
- 45
why: A grid of 3 rows by 5 columns has 3 times 5, which is 15 pixels, and each pixel is one number.
q: After houses["garden"].map({"no": 0, "yes": 1}), what value does house 2 have in the garden column?
- "yes"
- 0
* 1
why: House 2 has a garden, and the map sends yes to 1.
q: A column holds the values "red", "green", "blue" and nothing else. How should it become numbers for a model?
- Use the lengths of the words: 3, 5, 4
* Make one 0/1 column per colour
- Leave it as text; models read words
why: The options have no natural order, so one 0/1 column per option avoids a false ranking.
:::

## Go further

The NumPy beginner guide in the links shows how grids of numbers work with more examples. The Wikipedia page on digital images explains pixels and colour channels. The next lesson, [Cleaning data](/courses/start-here/data-the-raw-material/cleaning-data), returns to the house table with some damaged rows and shows how to fix missing values, duplicates, outliers and messy text with pandas.
`,
      links: [
        { label: 'NumPy: the absolute basics for beginners', url: 'https://numpy.org/doc/stable/user/absolute_beginners.html', kind: 'docs' },
        { label: 'pandas: get_dummies', url: 'https://pandas.pydata.org/docs/reference/api/pandas.get_dummies.html', kind: 'docs' },
        { label: 'Wikipedia: Digital image', url: 'https://en.wikipedia.org/wiki/Digital_image', kind: 'article' },
        { label: 'Wikipedia: Unstructured data', url: 'https://en.wikipedia.org/wiki/Unstructured_data', kind: 'article' },
      ],
    },
    {
      slug: 'cleaning-data',
      title: 'Cleaning data',
      summary: 'Find and fix the four common faults in a table, missing values, duplicates, outliers and inconsistent formats, with pandas.',
      minutes: 23,
      objectives: [
        'Explain the four common faults in a data set and give one example of each from the house table.',
        'Run isna, drop_duplicates, fillna and str methods in pandas to repair a table.',
        'Compute how one outlier changes the mean of a column.',
        'Choose between dropping a row and filling a value when data is missing.',
      ],
      keyTerms: ['data cleaning', 'missing value', 'duplicate row', 'outlier', 'inconsistent format', 'median'],
      body: `
## What this lesson covers

This lesson teaches data cleaning. Data cleaning is the work of finding and fixing faults in a table before a model reads it. You meet the 4 most common faults: missing values, duplicate rows, outliers and inconsistent formats. You fix each one in the house table with pandas. At the end you can take a messy table and turn it into one a model can trust.

## Why it matters

A model learns whatever the table says. If the table says a 85 square metre house sold for 2,600,000 pounds, the model believes it. People who build AI systems spend more time on cleaning than on any other task. Clean data with a simple model beats dirty data with a clever model. This lesson also gives you the habit of looking at your data before you use it. The next lesson, [Where data comes from and the rules](/courses/start-here/data-the-raw-material/data-rules-and-ethics), asks where the table came from and whether you may use it.

:::video
id: SzZ6GpcfoQY
why: Watch the first 5 minutes. The speaker computes a mean from a handful of numbers. Keep the house prices in mind, and notice how one far-away value would pull that mean.
:::

## The idea with an example

> **Analogy.** Imagine a class register that a tired teacher filled in by hand. One pupil appears twice. One line has no age. One name is written "ANNA" and another "anna ". One pupil's age reads 110 instead of 11. Before you can report the average age, you must fix the register. The register is the table. The fixes are data cleaning.

The estate agent's assistant typed the house sales into a spreadsheet. He made the 4 classic mistakes. Here is the raw table with 8 rows.

| id | size_m2 | bedrooms | city | garden | price |
| --- | --- | --- | --- | --- | --- |
| 1 | 50 | 1 | Leeds | no | 150000 |
| 2 | 70 | 2 | Leeds | yes | 210000 |
| 3 | 90 |  | York | yes | 260000 |
| 4 | 120 | 4 | YORK | yes | 380000 |
| 5 | 60 | 2 | leeds  | no | 170000 |
| 6 | 100 | 3 | York | no | 300000 |
| 7 | 70 | 2 | Leeds | yes | 210000 |
| 8 | 85 | 3 | York | yes | 2600000 |

Find the 4 faults. Row 3 has an empty bedrooms cell. That is a missing value: a cell with no value at all. Pandas shows a missing value as NaN, which stands for "not a number". Row 7 is an exact copy of row 2. That is a duplicate row: the same example recorded twice. Rows 4 and 5 write the city as YORK and as leeds with a space after it. That is an inconsistent format: the same fact written in different ways, so the computer sees 4 cities instead of 2. Row 8 has a price of 2,600,000 pounds for an 85 square metre house. That is an outlier: a value far away from all the others. Here the assistant typed one zero too many; the real price was 260,000.

The outlier matters most, because one wrong value moves the mean a long way. The 7 distinct prices add up to 4,070,000 pounds, and 4,070,000 divided by 7 is 581,429 pounds. With the fixed price of 260,000, the total is 1,730,000, and the mean is 247,143 pounds. One extra zero more than doubled the mean price.

:::bars
title: Mean price of the 7 houses
unit: pounds
With the typing error: 581429
After the fix: 247143
Median, with the error: 260000
:::

The third bar shows the median. The median is the middle value when you sort the numbers. Sort the 7 prices with the error: 150000, 170000, 210000, 260000, 300000, 380000, 2600000. The middle one, the fourth, is 260,000. The outlier does not move the median at all, because the median only cares about the order. This is why data scientists print both the mean and the median when they first look at a column. A big gap between them is a sign of an outlier.

The diagram shows the cleaning pipeline you follow in this lesson.

:::flow
title: The cleaning pipeline
Raw table -> Look: info, describe, isna
Look -> Fix formats: strip, title case
Fix formats -> Drop duplicates: 8 rows to 7
Drop duplicates -> Fill missing: bedrooms of row 3
Fill missing -> Check outliers: price per m2
Check outliers -> Clean table: 7 rows
:::

Press Next to clean the house table one fault at a time.

:::scenario
title: Cleaning the raw house table
state: rows=8, cities=4, missing=1, max_price=2600000
step: Look at the table. There are 8 rows, 4 different spellings of city, 1 missing cell, and a very large max price.
step: Fix the formats. Remove spaces around each city and write it in title case. YORK becomes York and leeds becomes Leeds.
state: cities=2
step: Drop duplicate rows. Row 7 is a copy of row 2 and goes away.
state: rows=7
step: Fill the missing bedrooms. Houses of 85 to 100 m2 in this table have 3 bedrooms, so fill row 3 with 3.
state: missing=0
step: Check outliers. Row 8 costs 30588 pounds per m2, ten times the others. The agent confirms the price was 260000. Fix it.
state: max_price=380000
step: The table is clean. 7 rows, 2 cities, no missing cells, no outliers.
:::

## How it works

Follow the same 6 steps for every new table. Always look before you change anything, and always write down what you changed.

:::anim
title: Cleaning the raw house table, one fault at a time
rect r1 @ 330,100 size: 460x40 "1: 50 m2, 1 bed, Leeds, no, 150000"
rect r2 @ 330,146 size: 460x40 "2: 70 m2, 2 beds, Leeds, yes, 210000"
rect r3 @ 330,192 size: 460x40 "3: 90 m2, NaN beds, York, yes, 260000" color: red
rect r4 @ 330,238 size: 460x40 "4: 120 m2, 4 beds, YORK, yes, 380000" color: orange
rect r5 @ 330,284 size: 460x40 "5: 60 m2, 2 beds, 'leeds ', no, 170000" color: orange
rect r6 @ 330,330 size: 460x40 "6: 100 m2, 3 beds, York, no, 300000"
rect r7 @ 330,376 size: 460x40 "7: 70 m2, 2 beds, Leeds, yes, 210000" color: purple
rect r8 @ 330,422 size: 460x40 "8: 85 m2, 3 beds, York, yes, 2600000" color: red
num rows = 8 @ 800,110 prefix: "rows = " size: 26
num cities = 4 @ 800,170 prefix: "cities = " size: 26
num missing = 1 @ 800,230 prefix: "missing = " size: 26
num mean = 535000 @ 800,310 prefix: "mean = " size: 24 color: yellow
num median = 235000 @ 800,370 prefix: "median = " size: 24
num perm2 = 0 @ 800,450 prefix: "row 8 per m2 = " size: 20 color: red

step: Look first. The raw table has 8 rows. The mean, 535,000, is more than twice the median, 235,000.
  show r1, r2, r3, r4, r5, r6, r7, r8
  show rows, cities, missing, mean, median
  pulse mean, median
step: Fix formats. strip and title turn YORK and leeds into York and Leeds. 4 spellings become 2.
  highlight r4, r5
  label r4 "4: 120 m2, 4 beds, York, yes, 380000"
  & label r5 "5: 60 m2, 2 beds, Leeds, no, 170000"
  count cities -> 2
  color r4, r5 blue
step: Drop duplicates. Row 7 is an exact copy of row 2 and goes away. 7 rows remain.
  restore r4, r5
  highlight r2, r7
  hide r7
  move r8 -> 330,376
  & count rows -> 7
  & count mean -> 581429
  & count median -> 260000
  restore r2
step: Fill the missing value. Houses of 85 to 100 square metres have 3 bedrooms, so row 3 gets 3.
  highlight r3
  label r3 "3: 90 m2, 3 beds, York, yes, 260000"
  count missing -> 0
  color r3 blue
  restore r3
step: Check outliers. Row 8 costs 30,588 pounds per square metre, 10 times the other houses.
  show perm2
  highlight r8
  count perm2 -> 30588 (2s)
step: The agent confirms the real price was 260,000. Fix it. The mean falls to 247,143, close to the median.
  label r8 "8: 85 m2, 3 beds, York, yes, 260000"
  hide perm2
  count mean -> 247143 (2.5s)
  color r8 blue
  restore r8
step: Look again. 7 rows, 2 cities, no missing cells, mean and median close. The table is clean.
  color r1, r2, r3, r4, r5, r6, r8 green
  pulse rows, cities, missing
:::

1. Look. Print the shape, the dtypes, the count of missing values per column, and describe() for the numeric columns. Compare the mean with the median.
2. Fix formats. Make the same fact look the same everywhere: remove extra spaces, use one case for words, one unit for numbers, one date format.
3. Drop duplicates. Remove rows that are exact copies. Decide first whether 2 equal rows could be 2 real events.
4. Handle missing values. Either drop the row, or fill the cell with a sensible value. Write down which you did and why.
5. Check outliers. Compute a ratio that should be stable, like price per square metre. Look up any value far from the rest. Fix it if you can confirm the true value. Otherwise drop the row.
6. Look again. Print the same summary as in step 1. Confirm the faults are gone and the shape is what you expect.

The table lists each fault, the pandas tool that finds it, and the tool that fixes it.

| Fault | Example in the house table | Find it with | Fix it with |
| --- | --- | --- | --- |
| Missing value | bedrooms of row 3 is NaN | isna().sum() | fillna(value) or dropna() |
| Duplicate row | row 7 equals row 2 | duplicated().sum() | drop_duplicates() |
| Inconsistent format | YORK, leeds with a space | unique() | str.strip() and str.title() |
| Outlier | price 2600000 for 85 m2 | describe(), a ratio column | confirm and correct, or drop |

Now run the steps in code. The first block builds the raw table and looks at it. In Python, the value None in a list becomes NaN in pandas.

:::code
lang: python
file: clean.py
import pandas as pd

raw = pd.DataFrame({
    "size_m2": [50, 70, 90, 120, 60, 100, 70, 85],
    "bedrooms": [1, 2, None, 4, 2, 3, 2, 3],
    "city": ["Leeds", "Leeds", "York", "YORK", "leeds ", "York", "Leeds", "York"],
    "garden": ["no", "yes", "yes", "yes", "no", "no", "yes", "yes"],
    "price": [150000, 210000, 260000, 380000, 170000, 300000, 210000, 2600000],
})

print(raw.shape)
print(raw.isna().sum())
print(raw["city"].unique())
print(raw["price"].describe())
:::

:::code
lang: text
(8, 5)
size_m2     0
bedrooms    1
city        0
garden      0
price       0
dtype: int64
['Leeds' 'York' 'YORK' 'leeds ']
count    8.000000e+00
mean     5.350000e+05
std      8.396513e+05
min      1.500000e+05
50%      2.350000e+05
max      2.600000e+06
:::

Read the summary. isna().sum() counts the missing cells in each column: 1 in bedrooms. unique() shows 4 spellings of 2 cities. describe() prints the mean as 5.35e+05, which is 535,000 in scientific notation. The line marked 50% is the median, 235,000. The mean is more than twice the median, which points to an outlier. The max of 2.6e+06, or 2,600,000, confirms it.

The second block fixes the formats and removes the duplicate. The str accessor applies a text method to every value in a column. strip removes spaces at both ends. title writes the first letter in capitals and the rest in small letters.

:::code
lang: python
houses = raw.copy()
houses["city"] = houses["city"].str.strip().str.title()
print(houses["city"].unique())          # ['Leeds' 'York']

print(houses.duplicated().sum())        # 1
houses = houses.drop_duplicates().reset_index(drop=True)
print(houses.shape)                     # (7, 5)
:::

Note the order. Fix the formats first, then drop duplicates. If a duplicate row has a different spelling of the city, pandas does not see it as a duplicate until the spelling matches.

The third block handles the missing value and the outlier. For the missing bedrooms, look at houses of a similar size. The 85 and 100 square metre houses both have 3 bedrooms, so 3 is a sensible fill for a 90 square metre house. For the outlier, compute price per square metre. A typical house in the table costs about 3,000 pounds per square metre. Row 8 costs 2,600,000 divided by 85, which is about 30,588 pounds per square metre, 10 times more. The agent confirms the real price was 260,000, so you correct it.

:::code
lang: python
houses["bedrooms"] = houses["bedrooms"].fillna(3).astype(int)

houses["per_m2"] = houses["price"] / houses["size_m2"]
print(houses["per_m2"].round())
houses.loc[houses["price"] > 1000000, "price"] = 260000
houses = houses.drop(columns=["per_m2"])

print(houses.isna().sum().sum())        # 0
print(houses["price"].mean())           # 247142.857...
print(houses["price"].median())         # 260000.0
:::

The last 3 lines are step 6, look again. No cell is missing. The mean is now 247,143 pounds and the median is 260,000 pounds. They are close, as you expect when there is no outlier. Write the mean as a formula and in words:

$$\\text{mean} = \\frac{1730000}{7} \\approx 247143$$

In words: the 7 clean prices add up to 1,730,000 pounds, and 1,730,000 divided by 7 is about 247,143 pounds.

The choice between fillna and dropna depends on how much you lose. Dropping row 3 would throw away 1 of 7 houses, which is 14 percent of the data, because of 1 missing cell. Filling keeps the row and costs you one guessed value. With a big table and a small number of missing rows, dropping is fine. With a small table, fill when you have a sensible rule, and write the rule down.

## Try it

:::exercise
title: Clean a pupil register
task: Build a DataFrame with the columns name and age from these 5 rows: ("Anna", 11), ("Ben", 12), ("ANNA", 11), ("Chloe", None), ("Dev", 110). Clean it: make the names title case, drop the duplicate, fill the missing age with the median of the other ages, and fix the age 110 to 11 after you confirm it with the teacher. Print the final table and its mean age. The clean mean is 11.25.
hint: Fix formats first, then drop_duplicates, then fillna with pupils["age"].median(), then use .loc with a condition like pupils["age"] > 100.
lang: python
solution:
import pandas as pd

pupils = pd.DataFrame({
    "name": ["Anna", "Ben", "ANNA", "Chloe", "Dev"],
    "age": [11, 12, 11, None, 110],
})
pupils["name"] = pupils["name"].str.strip().str.title()
pupils = pupils.drop_duplicates().reset_index(drop=True)
pupils.loc[pupils["age"] > 100, "age"] = 11
pupils["age"] = pupils["age"].fillna(pupils["age"].median())
print(pupils)
print(pupils["age"].mean())   # 11.25
:::

Note that the solution fixes the outlier before it fills the missing value. If you fill first, the median includes the value 110, and it may give you a wrong fill. The order of the steps matters whenever one step uses a number computed from the column.

## Common mistakes

- Mistake: you clean first and look later. Fix: always print shape, isna().sum(), unique() and describe() before you change a value. You cannot fix a fault you have not seen.
- Mistake: you delete every row that has an outlier. Fix: an outlier can be a true rare value or a typing error. Check the source first. Delete only what you cannot confirm.
- Mistake: you fill a missing value with 0. Fix: 0 bedrooms is a real claim about the house, and a wrong one. Fill with a value that could be true, such as the median or a value from similar rows.
- Mistake: you drop duplicates before you fix formats. Fix: pandas only sees rows as equal when every cell matches. Clean the text first.
- Mistake: you change the data and do not write down what you did. Fix: keep the cleaning in a script like clean.py, so anyone can run it again and see each step.

## Check your understanding

:::quiz
title: Check: cleaning data
q: A column holds the values 10, 12, 11, 13 and 120. What is the most likely story?
- 120 is the correct mean of the column
* 120 is an outlier, perhaps a typing error for 12
- The column has a missing value
why: Four values sit between 10 and 13 and one is ten times larger. That pattern points to an outlier that you should check at the source.
q: The 5 prices 100, 200, 300, 400 and 5000 have which mean and which median?
- Mean 300, median 300
* Mean 1200, median 300
- Mean 1200, median 5000
why: The total is 6000, and 6000 divided by 5 is 1200. The sorted middle value is 300. The outlier moves the mean but not the median.
q: Why do you run str.strip() and str.title() on the city column before drop_duplicates()?
* So that two rows with "York" and "YORK" count as equal
- So that pandas can sort the table
- Because drop_duplicates() only works on text columns
why: drop_duplicates() only removes rows whose cells match exactly. Different spellings hide duplicates until you make the format consistent.
q: Your table has 10,000 rows and 12 of them have a missing age. What is a reasonable choice?
* Drop the 12 rows, because you lose almost nothing
- Fill every missing age with 0
- Delete the whole age column
why: 12 of 10,000 rows is about 0.1 percent of the data. Dropping them is safe and avoids a guessed value.
q: What does raw.isna().sum() return?
- The number of rows in the table
* The number of missing cells in each column
- The mean of each column
why: isna() marks each missing cell as True, and sum() counts the True values column by column.
:::

## Go further

The pandas guide on missing data in the links explains NaN and fillna in depth. The Wikipedia pages on data cleansing and outliers give the history of the words. The next lesson, [Where data comes from and the rules](/courses/start-here/data-the-raw-material/data-rules-and-ethics), asks a different question about the house table: who collected it, who is in it, and whether you may use it.
`,
      links: [
        { label: 'pandas: Working with missing data', url: 'https://pandas.pydata.org/docs/user_guide/missing_data.html', kind: 'docs' },
        { label: 'pandas: DataFrame.drop_duplicates', url: 'https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.drop_duplicates.html', kind: 'docs' },
        { label: 'Wikipedia: Data cleansing', url: 'https://en.wikipedia.org/wiki/Data_cleansing', kind: 'article' },
        { label: 'Wikipedia: Outlier', url: 'https://en.wikipedia.org/wiki/Outlier', kind: 'article' },
      ],
    },
    {
      slug: 'data-rules-and-ethics',
      title: 'Where data comes from and the rules',
      summary: 'Trace a data set to its source, check the licence, remove personal data, count for bias, and write a datasheet that records all four answers.',
      minutes: 22,
      objectives: [
        'Explain the four questions to ask before you use a data set: source, licence, personal data and bias.',
        'Choose whether a given licence lets you train a model on a data set for a given purpose.',
        'Run pandas code that removes personal data columns and counts rows per group.',
        'Write a one-page datasheet for the house table as a JSON file.',
      ],
      keyTerms: ['data licence', 'personal data', 'consent', 'anonymisation', 'data bias', 'datasheet'],
      body: `
## What this lesson covers

This lesson teaches the rules around a data set. Before a model reads a table, you must know where the table came from, whether you may use it, whether it names real people, and which people or things it leaves out. You learn 4 questions that cover all of this. At the end you can write a short document, called a datasheet, that answers the 4 questions for the house table.

## Why it matters

A model learns everything in its table and nothing outside it. If the table holds a person's name and phone number, the model can repeat them to a stranger. If the table was copied from a website that forbids copying, you can lose the right to use your model. If the table holds only houses in 2 cities, the model fails in the third city. The teams that build real AI systems check these points before they train, and the law requires some of the checks. In the next track, the [learning loop](/courses/ai-foundations/what-ai-is/the-learning-loop) lesson trains a model on the house table. This lesson makes sure that the table is one you are allowed to use. Much later, the [Build a dataset](/courses/build-ai-ecosystem/train-your-own/build-a-dataset) lesson asks you to collect your own table, and the 4 questions return there in full.

## The idea with an example

> **Analogy.** Think of a borrowed camera at a party. You can take photos with it. But the camera belongs to someone else, the photos show real guests, and you only photographed the people near the cake. Before you print the photos in a magazine, you ask 3 things. Whose camera is it, and did they say you may publish? Did the guests agree to appear? Does the album show the whole party, or only one corner? A data set raises the same 3 questions, plus one more: did you write the answers down?

Return to the estate agent. The 6-row house table you cleaned in the last lesson was not her first file. Her first file had 3 more columns, because she typed it from her sales book. Here it is. The names and phone numbers are invented for this lesson.

| id | address | seller | phone | size_m2 | bedrooms | city | garden | price |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 12 Mill Lane | A. Khan | 07700 900101 | 50 | 1 | Leeds | no | 150000 |
| 2 | 4 Park Row | B. Shaw | 07700 900102 | 70 | 2 | Leeds | yes | 210000 |
| 3 | 7 Castle St | C. Lee | 07700 900103 | 90 | 3 | York | yes | 260000 |
| 4 | 22 River Rd | D. Rossi | 07700 900104 | 120 | 4 | York | yes | 380000 |
| 5 | 3 Shop Row | E. Novak | 07700 900105 | 60 | 2 | Leeds | no | 170000 |
| 6 | 9 Bridge St | F. Obi | 07700 900106 | 100 | 3 | York | no | 300000 |

Ask the first question: where did the data come from? The agent typed the rows from her own sales book. She then checked each price against the Land Registry, the public office in England and Wales that records every house sale. So the table has 2 sources: a private book and a public register. Each source has its own rules.

Ask the second question: what is the licence? A data licence is a written permission from the owner of the data that says what you may do with it. The Land Registry publishes its prices under the Open Government Licence. That licence says you may copy the data, change it, share it and build products on it, as long as you say where it came from. The names and phone numbers in the sales book have no such licence. The sellers gave them to the agent so that she could sell their houses, and for nothing else. No licence means you may not share them.

Ask the third question: does the table hold personal data? Personal data is any fact that identifies a living person, alone or together with other facts. A name identifies a person. A phone number identifies a person. An address identifies a house, and the Land Registry links the house to the person who sold it, so an address with a sale date also points to one person. Laws such as the General Data Protection Regulation (GDPR) in Europe and the United Kingdom set strict rules for personal data. The simplest rule is to collect only what you need and to remove the rest. So you drop seller and phone, and you replace the address with the city. Removing the facts that point to one person is called anonymisation. City alone cannot identify anyone, because thousands of houses sold in Leeds last year.

Consent is the related word. Consent means that a person agreed to a use of their data after you told them what the use was. The sellers agreed that the sale price goes into the public register, because the law tells them so when they sell. They did not agree that their phone number goes into a training set for a model. Consent covers the use the person agreed to and no other use.

Ask the fourth question: who or what is missing? Count the rows per group. There are 3 houses in Leeds, 3 in York and 0 in any other city. Every house is between 50 and 120 square metres. Every sale happened in one year. A model trained on this table has never seen London, a 30 square metre flat, or a price from 10 years ago. This is data bias: the table does not match the world the model will meet. Data bias is not about the model being wrong on purpose. It is about the table being a narrow sample of the world.

Put a number on it. In the table, a house costs about 3,000 pounds per square metre: 150,000 divided by 50 is 3,000, and 300,000 divided by 100 is 3,000. A model learns that rule. Now show the model a 70 square metre flat in London that sold for 600,000 pounds. The model predicts about 3,000 times 70, which is 210,000 pounds. The error is 390,000 pounds. The model is not broken. The table never told it about London.

:::bars
title: Price per square metre by city
unit: pounds
Leeds, in the table: 2944
York, in the table: 3019
London, not in the table: 8571
:::

The diagram shows the 4 checks in the order you run them.

:::flow
title: Four checks before a table reaches a model
Raw file -> Source check: who collected it and why
Source check -> Licence check: may you use it for this
Licence check -> Personal data check: drop names and phones
Personal data check -> Bias check: count rows per group
Bias check -> Datasheet: write the answers down
Datasheet -> Model: trains on a table you may use
:::

Press Next to run the 4 checks on the agent's file.

:::scenario
title: Checking the house file before training
state: columns=9, personal=3, licence=unknown, cities=2
step: Ask where the file came from. The agent typed it from her sales book and checked the prices against the Land Registry.
state: source=sales book + Land Registry
step: Check the licence. The prices are open data under the Open Government Licence. The names and phones come from private contracts and have no licence to share.
state: licence=OGL for prices, none for names
step: Find personal data. The columns seller, phone and address point to real people. Drop seller and phone. Replace address with city.
state: columns=6, personal=0
step: Count rows per group. 3 in Leeds, 3 in York, 0 anywhere else. All sizes between 50 and 120 square metres.
state: cities=2, size_range=50 to 120
step: Write a datasheet with these answers and the date. Only then build the DataFrame from the first lesson.
state: datasheet=written
:::

## How it works

Run the same 6 steps for every data set, whether you typed it yourself, downloaded it, or got it from a colleague.

:::anim
title: Four checks before the house file may reach a model
rect address @ 116,110 size: 92x44 "address" color: red
rect seller @ 220,110 size: 92x44 "seller" color: red
rect phone @ 324,110 size: 92x44 "phone" color: red
rect size @ 428,110 size: 92x44 "size_m2"
rect beds @ 532,110 size: 92x44 "bedrooms"
rect city @ 636,110 size: 92x44 "city"
rect garden @ 740,110 size: 92x44 "garden"
rect price @ 844,110 size: 92x44 "price"
box book "Sales book" @ 200,250 icon: file
box registry "Land Registry" @ 480,250 icon: database
box sheet "Datasheet" @ 790,250 icon: file
box model "Model" @ 790,400 icon: model
num leeds = 0 @ 150,400 prefix: "Leeds: " suffix: " rows" size: 24
num york = 0 @ 350,400 prefix: "York: " suffix: " rows" size: 24
num london = 0 @ 550,400 prefix: "London: " suffix: " rows" size: 24 color: red
num pl = 0 @ 150,470 suffix: " per m2" size: 20
num py = 0 @ 350,470 suffix: " per m2" size: 20
num plon = 0 @ 550,470 suffix: " per m2" size: 20 color: red

step: The agent's first file has 8 columns. Three of them point to real people.
  show address, seller, phone, size, beds, city, garden, price
  pulse address, seller, phone
step: Check the source. Names come from her private sales book. Prices were checked against the public Land Registry.
  show book, registry
  arrow a1 = book -> seller : typed
  arrow a2 = registry -> price : checked
step: Check the licence. Land Registry prices are open under the OGL. The names and phones have no licence.
  label registry "Land Registry|Open Government Licence"
  label book "Sales book|no licence to share"
  color price green
  highlight seller, phone
step: Find personal data. Drop seller and phone. Replace the address with the city, which identifies nobody.
  hide a1, a2, book, registry
  hide address, seller, phone
  move size -> 116,110
  & move beds -> 220,110
  & move city -> 324,110
  & move garden -> 428,110
  & move price -> 532,110
  color city green
step: Count for bias. 3 rows in Leeds, 3 in York, 0 anywhere else. All sizes sit between 50 and 120.
  show leeds, york, london
  count leeds -> 3
  & count york -> 3
  & count london -> 0
  pulse london
step: Price per square metre is about 3,000 in both cities. A London flat costs 8,571. The table never saw London.
  show pl, py, plon
  count pl -> 2944 (2s)
  & count py -> 3019 (2s)
  & count plon -> 8571 (2s)
step: Write the datasheet: source, licence, columns removed, rows per group, known gaps. Only then may the model train.
  show sheet, model
  arrow city -> sheet : 5 columns
  arrow sheet -> model : a table you may use
  highlight sheet
:::

1. Find the source. Write down who collected the data, when, how and why. A table collected to sell houses was not collected to train a model, and it shows.
2. Read the licence. Look for a file named LICENSE, a page called Terms, or a licence name next to the download link. No licence means all rights reserved, so you must ask the owner in writing.
3. Find personal data. Go column by column and ask whether the value points to one living person, alone or with another column. Drop what you do not need. Replace what you need with a coarser value, such as city instead of address.
4. Count for bias. For every categorical column, count the rows per option. For every numerical column, print the minimum and the maximum. Compare the counts with the world the model will meet. Write down every group with 0 or few rows.
5. Write the datasheet. A datasheet is a short document that records the answers to steps 1 to 4, plus the intended use of the data and the date. The name comes from the datasheets that come with electronic parts, which list what a part can and cannot do.
6. Repeat when the table changes. Every time you add rows or columns, update the counts and the datasheet.

The table shows the licences you meet most often and what each one allows.

| Licence | What you may do | Must you credit the source? | May you train a model on it? |
| --- | --- | --- | --- |
| Public domain or CC0 | anything | no | yes |
| CC BY 4.0 | copy, change, share, sell | yes | yes, with credit |
| Open Government Licence | copy, change, share, sell | yes | yes, with credit |
| CC BY-NC 4.0 | copy, change, share, but not for money | yes | only for non-commercial work |
| Terms of service, all rights reserved | only what the owner writes, often nothing | depends | only with written permission |

Bias also comes in more than one kind. The second table names the 4 kinds you meet most, each with a house example.

| Kind of bias | What goes wrong | House example |
| --- | --- | --- |
| Coverage bias | some groups have 0 or few rows | no city except Leeds and York |
| Historical bias | the past decisions in the table were unfair | prices in one area kept low by old rules |
| Measurement bias | a value was measured in a slanted way | the agent rounds every size up to sell faster |
| Label bias | the label does not mean what you think | the asking price was typed instead of the sale price |

Now run steps 3 and 4 in pandas. The code builds the raw file, drops the personal columns, and counts rows per city. The method value_counts counts how many rows hold each option of a column.

:::code
lang: python
file: rules.py
import pandas as pd

raw = pd.DataFrame({
    "address": ["12 Mill Lane", "4 Park Row", "7 Castle St", "22 River Rd", "3 Shop Row", "9 Bridge St"],
    "seller": ["A. Khan", "B. Shaw", "C. Lee", "D. Rossi", "E. Novak", "F. Obi"],
    "phone": ["07700 900101", "07700 900102", "07700 900103", "07700 900104", "07700 900105", "07700 900106"],
    "size_m2": [50, 70, 90, 120, 60, 100],
    "bedrooms": [1, 2, 3, 4, 2, 3],
    "city": ["Leeds", "Leeds", "York", "York", "Leeds", "York"],
    "garden": ["no", "yes", "yes", "yes", "no", "no"],
    "price": [150000, 210000, 260000, 380000, 170000, 300000],
})

personal = ["address", "seller", "phone"]
houses = raw.drop(columns=personal)

print(houses.columns.tolist())
print(houses["city"].value_counts())
print(houses["size_m2"].min(), houses["size_m2"].max())
print((houses["price"] / houses["size_m2"]).round())
:::

:::code
lang: text
['size_m2', 'bedrooms', 'city', 'garden', 'price']
city
Leeds    3
York     3
Name: count, dtype: int64
50 120
0    3000.0
1    3000.0
2    2889.0
3    3167.0
4    2833.0
5    3000.0
dtype: float64
:::

Read the output. The first line confirms that the 3 personal columns are gone and the 5 columns from the first lesson remain. The count per city is 3 and 3, with no third city. The sizes run from 50 to 120. The last block prints the price per square metre for each house, and all 6 values sit between 2,833 and 3,167. That narrow band is the rule the model will learn, and it is only true for these 2 cities.

Write the per-square-metre figure for Leeds as a formula and in words:

$$\\text{Leeds per m}^2 = \\frac{3000 + 3000 + 2833}{3} \\approx 2944$$

In words: add the 3 Leeds values and divide by 3, which gives about 2,944 pounds per square metre. York gives about 3,019. The London flat gives 600,000 divided by 70, about 8,571. The gap between 3,000 and 8,571 is the size of the bias.

Now write the datasheet. Keep it as a JSON file next to the data, so that anyone who opens the folder sees it. You met JSON in the [Reading and writing files](/courses/start-here/python-for-data/files-csv-json) lesson. A dictionary with 9 keys is enough for a small table.

:::code
lang: python
file: datasheet.py
import json

datasheet = {
    "name": "houses-leeds-york-2025",
    "source": "Sales book of one estate agent. Prices checked against HM Land Registry price paid data.",
    "collected": "Sales from January to December 2025. Typed in March 2026.",
    "licence": "Prices: Open Government Licence v3. Names and phones: private, removed.",
    "personal_data": "Removed address, seller and phone. Kept city only.",
    "rows": 6,
    "groups": {"Leeds": 3, "York": 3},
    "known_gaps": "No city except Leeds and York. Sizes 50 to 120 m2 only. One year only.",
    "intended_use": "Teaching. Not for real valuations.",
}

with open("datasheet.json", "w") as f:
    json.dump(datasheet, f, indent=2)
print(json.dumps(datasheet, indent=2)[:120])
:::

The last line prints the first 120 characters so you can see the file took shape. The key known_gaps is the most useful line in the whole file. When someone later asks why the model fails in London, the datasheet already holds the answer. When a lawyer asks where the prices came from, the source and licence lines answer. A datasheet costs 10 minutes to write and saves days later.

## Try it

:::exercise
title: Prepare the pupil register for sharing
task: The school from the last lesson wants to share its pupil table with a company that builds an AI tutor. The columns are name, date_of_birth, class_name, height_cm and passed_exam. The parents agreed that the school keeps the table to run the school. Decide which columns are personal data. Decide whether the parents' consent covers this new use. Then, in Python, drop the personal columns, print value_counts for class_name, and write a datasheet dictionary with the keys name, source, licence, personal_data, rows, groups, known_gaps and intended_use.
hint: name alone identifies a child. date_of_birth together with class_name can also point to one child in a small school. Consent covers the use the parents agreed to, which was running the school, not training a tutor. The school must ask again.
lang: python
solution:
import json
import pandas as pd

# Personal data: name (direct), date_of_birth with class_name (together).
# Consent: parents agreed to school use only. The school must ask again
# before it shares the table with the company.

pupils = pd.DataFrame({
    "name": ["Anna", "Ben", "Chloe", "Dev"],
    "date_of_birth": ["2014-03-02", "2013-11-20", "2014-07-15", "2014-01-09"],
    "class_name": ["A", "B", "A", "A"],
    "height_cm": [142.0, 150.5, 139.0, 145.0],
    "passed_exam": ["yes", "no", "yes", "yes"],
})

shared = pupils.drop(columns=["name", "date_of_birth"])
print(shared["class_name"].value_counts())   # A 3, B 1

datasheet = {
    "name": "pupils-one-school-2026",
    "source": "School register, typed by the office in 2026.",
    "licence": "Private. Shared only after new consent from parents.",
    "personal_data": "Removed name and date_of_birth. Kept class_name.",
    "rows": 4,
    "groups": {"A": 3, "B": 1},
    "known_gaps": "One school only. Class B has 1 row. No class C.",
    "intended_use": "Testing an AI tutor. Not for grading real pupils.",
}
print(json.dumps(datasheet, indent=2))
:::

## Common mistakes

- Mistake: you think that a table you can download is free to use. Fix: a page you can read is still owned by someone. Look for the licence. No licence means all rights reserved, so ask the owner in writing.
- Mistake: you delete the name column and call the table anonymous. Fix: an address with a sale date, or a date of birth with a class name, can still point to one person. Check every pair of columns, not only the obvious ones.
- Mistake: you check for bias by looking at the mean only. Fix: count rows per group with value_counts. A group with 0 rows does not show up in any mean.
- Mistake: you think that more rows fix bias. Fix: 10,000 houses in Leeds still say nothing about London. Add rows from the missing groups, or state in the datasheet that the model does not cover them.
- Mistake: you write the datasheet at the end, from memory. Fix: write it the day you collect the data, and update it every time the table changes.

## Check your understanding

:::quiz
title: Check: data rules
q: A data set on a website shows the licence CC BY 4.0. May you train a model on it for a product you sell?
* Yes, if you credit the source
- No, BY means that business use is not allowed
- Only after you pay the owner a fee
why: CC BY allows copying, changing and selling, on the one condition that you credit the source. The NC mark, not BY, forbids commercial use.
q: Which column of the raw house file is not personal data on its own?
- seller
- phone
* size_m2
why: A floor area of 90 square metres matches thousands of houses, so it does not point to one person. A name or a phone number does.
q: The house table has 3 Leeds rows and 3 York rows. A model trained on it predicts 210,000 pounds for a 70 square metre flat in London, which sold for 600,000. What is the best description of the problem?
- The model has a bug in its code
- The London flat is an outlier that you should drop
* The table has no London rows, so the model has never seen London prices
why: The model learned the only rule the table showed, about 3,000 pounds per square metre. The gap is coverage bias in the data, not a code fault.
q: You remove the seller names but keep the full address and the sale date. Is the table anonymous?
- Yes, because the names are gone
* No, because the address and date still identify the seller through the public register
- Yes, because an address is about a house, not a person
why: Anonymisation means that no column, alone or with another, points to one person. Address plus sale date does, through the Land Registry.
q: The sellers agreed that their sale price appears in the public register. Does that consent cover putting their phone numbers into a training set?
* No, consent covers only the use the person agreed to
- Yes, consent to one use covers every later use
- Yes, because the phone number was already in the agent's file
why: Consent is tied to the use that was explained to the person. A new use needs a new agreement.
q: Which of these belongs in a datasheet?
- The weights of the trained model
* Who collected the data, when, under which licence, and which groups are missing
- The cleaned table itself
why: A datasheet describes the data set: its source, licence, personal data, counts per group and intended use. The data and the model live in other files.
:::

## Go further

Read the Datasheets for Datasets paper in the links. It lists the full set of questions that a datasheet should answer, and the house datasheet in this lesson is a small version of it. The Creative Commons page explains each licence mark in plain words, and the Open Government Licence page is the licence the Land Registry uses. The Wikipedia page on personal data gives the legal definitions in several countries. This lesson ends the Start Here track. The next track, [Mathematics for AI from Zero](/courses/math-from-zero/numbers-and-functions/numbers-you-will-meet), gives you the numbers and functions a model is made of, and the [learning loop](/courses/ai-foundations/what-ai-is/the-learning-loop) lesson after it trains the first model on the house table you have now checked.
`,
      links: [
        { label: 'Datasheets for Datasets (Gebru et al.)', url: 'https://arxiv.org/abs/1803.09010', kind: 'paper' },
        { label: 'Creative Commons: About CC licenses', url: 'https://creativecommons.org/share-your-work/cclicenses/', kind: 'docs' },
        { label: 'UK Open Government Licence v3', url: 'https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/', kind: 'docs' },
        { label: 'Wikipedia: Personal data', url: 'https://en.wikipedia.org/wiki/Personal_data', kind: 'article' },
        { label: 'Wikipedia: Algorithmic bias', url: 'https://en.wikipedia.org/wiki/Algorithmic_bias', kind: 'article' },
      ],
    },
  ],
}
