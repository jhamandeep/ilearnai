import type { Module } from '../../types'

export const mod: Module = {
  slug: 'chat-application',
  title: 'Chat application',
  description: 'Build a chat loop that remembers the conversation, stream the reply word by word, count tokens and cost, ask for JSON that your code can trust, and put it all behind a web page.',
  level: 'beginner',
  lessons: [
    {
      slug: 'chat-loop',
      title: 'A chat loop in the terminal',
      summary: 'After this lesson you can write a terminal chat program that keeps the whole conversation in a messages list and sends it on every turn.',
      minutes: 20,
      before: [{ label: 'Call a model', to: '/courses/build-ai-ecosystem/set-up-your-workshop/call-a-model' }],
      objectives: [
        'Explain why a model forgets everything between two API calls.',
        'Write a chat loop that appends the user turn and the model turn to one messages list.',
        'Choose a system prompt that fixes the role and the tone of the assistant.',
        'Predict the length of the messages list after a given number of turns.',
      ],
      keyTerms: ['messages list', 'role', 'system prompt', 'turn', 'chat loop', 'context window'],
      links: [
        { label: 'Messages API reference (Claude docs)', url: 'https://docs.anthropic.com/en/api/messages', kind: 'docs' },
        { label: 'System prompts (Claude docs)', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/system-prompts', kind: 'docs' },
        { label: 'Anthropic Python SDK', url: 'https://github.com/anthropics/anthropic-sdk-python', kind: 'repo' },
        { label: 'Python while loops (Python docs)', url: 'https://docs.python.org/3/reference/compound_stmts.html#while', kind: 'docs' },
      ],
      body: `
## What this lesson covers

This lesson teaches the chat loop. A chat loop is a program that reads what you type and sends it to the model with everything said before. It prints the reply and waits for your next line. You add a chat folder to your aiworkshop repository and write chat/loop.py. After the lesson you can hold a conversation with a model in your terminal, and the model remembers your name from one turn to the next.

## Why it matters

The model has no memory of its own. Every call to the application programming interface (API) starts from nothing. If you want the model to remember that your name is Sam, your program must send that fact again on every call. The messages list is how your program does this. Every chat product you have used, every agent and every retrieval system in this track keeps a list like it. The next lesson, [Streaming and token counting](/courses/build-ai-ecosystem/chat-application/streaming-and-tokens), makes the same loop print the reply as it arrives and tells you what each turn costs.

Your aiworkshop repository already has an app folder from the module [Set up your workshop](/courses/build-ai-ecosystem/set-up-your-workshop/call-a-model). This module adds a chat folder. The running example for the whole module is a small assistant for Rosa's Bakery. The menu and opening hours of the same bakery fill the data folder later in the track.

:::video
id: s7wmiS2mSXY
why: Watch all 3 minutes. Every turn of your chat loop is one API call, and this video shows what an API call is from the outside.
:::

## The idea with an example

> **Analogy.** Imagine a helpdesk where a different clerk answers every time you call. Each clerk has never heard of you. If you want the clerk to know what you said in the last 3 calls, you must read them the full transcript first. Then you ask your new question. The transcript is the messages list. Reading it aloud is what your program does on every turn. The clerk is the model.

Take one concrete conversation with the bakery assistant. Turn 1: you type "My name is Sam. Do you sell croissants?" The model answers "Yes, Sam. We bake plain and almond croissants every morning." Turn 2: you type "What is my name?" The model answers "Your name is Sam." The model can answer turn 2 only because your program sent turn 1 again, inside the messages list.

A turn is one line from you plus one reply from the model. Each turn adds 2 entries to the messages list. After turn 1 the list has 2 entries. After turn 2 it has 4. After 10 turns it has 20. The list only grows. Nothing in it is ever changed or removed by the loop.

:::flow
title: One turn of the chat loop
You -> Your program: type a line
Your program -> Messages list: append user entry
Messages list -> API: send the whole list
API -> Your program: reply text
Your program -> Messages list: append assistant entry
Your program -> You: print the reply
:::

Press Next to watch the list grow across the 2 turns of the example.

:::scenario
title: The messages list during two turns
state: entries=0, turn=0
step: The program starts with an empty messages list and a system prompt that says the assistant works for Rosa's Bakery.
state: entries=1, turn=1
step: You type "My name is Sam. Do you sell croissants?" The program appends a user entry with that text.
state: sent=1 entry
step: The program sends the system prompt and the list of 1 entry to the API.
state: entries=2
step: The model replies "Yes, Sam. We bake plain and almond croissants every morning." The program appends an assistant entry with the reply and prints it.
state: entries=3, turn=2
step: You type "What is my name?" The program appends a second user entry.
state: sent=3 entries
step: The program sends the list of 3 entries. The model reads all 3, finds the name in the first one and replies "Your name is Sam."
state: entries=4
step: The program appends the reply. The list now holds 4 entries: user, assistant, user, assistant.
:::

Notice what the model never sees: the earlier replies that your program did not append. If you forget to append the assistant entry, the model sees a list of only user lines. It then has no record of what it said and often repeats itself.

## How it works

Each entry in the messages list is a dictionary with 2 keys. The role says who spoke. The content holds the text. There are 2 roles inside the list: user for you and assistant for the model. A third kind of text, the system prompt, travels outside the list in its own field. The system prompt is an instruction that sets the role and tone of the assistant for the whole conversation.

| Where it lives | Role | Who writes it | Example |
| --- | --- | --- | --- |
| system field | none | you, once, before the loop | You are the assistant for Rosa's Bakery. Answer in at most 3 sentences. |
| messages list | user | the person at the keyboard | My name is Sam. Do you sell croissants? |
| messages list | assistant | the model, copied by your program | Yes, Sam. We bake plain and almond croissants every morning. |

The API has 2 rules about the list. The first entry must have the role user. The roles should alternate: user, assistant, user, assistant. Your loop keeps both rules true as long as it appends the model reply before it reads the next line.

Why does the model need the assistant entries at all? A conversation is more than your questions. When you ask "Which of those is cheaper?", the word those points at a list the model wrote. Without its own earlier reply in the list, the model has nothing to point at. The assistant entries are the half of the memory that the model wrote itself. Your program is the only place that stores them.

The loop has these steps:

1. Build the client and set the model id to claude-sonnet-5-5.
2. Create an empty messages list and write the system prompt.
3. Read one line from the keyboard. If the line is exit or quit, stop.
4. Append a user entry with the line.
5. Send the system prompt and the whole list to the API.
6. Collect the text blocks of the reply into one string.
7. Append an assistant entry with that string, print it, and go back to step 3.

Here is the complete program. Create the chat folder, an empty file chat/__init__.py, and then chat/loop.py.

:::code
lang: python
file: chat/loop.py
import anthropic

client = anthropic.Anthropic()
MODEL = "claude-sonnet-5-5"
SYSTEM = "You are the assistant for Rosa's Bakery. Answer in at most 3 sentences."

def ask(messages: list) -> str:
    response = client.messages.create(
        model=MODEL,
        max_tokens=2048,
        system=SYSTEM,
        messages=messages,
    )
    return "".join(block.text for block in response.content if block.type == "text")

def main() -> None:
    messages = []
    print("Rosa's Bakery assistant. Type exit to stop.")
    while True:
        line = input("you: ").strip()
        if line in ("exit", "quit"):
            break
        if not line:
            continue
        messages.append({"role": "user", "content": line})
        reply = ask(messages)
        messages.append({"role": "assistant", "content": reply})
        print("bakery:", reply)
    print(f"Conversation over. {len(messages)} entries in the list.")

if __name__ == "__main__":
    main()
:::

Run it from the root of the repository, with your virtual environment active and ANTHROPIC_API_KEY set in your .env file.

:::code
lang: bash
python -m chat.loop
:::

:::code
lang: text
Rosa's Bakery assistant. Type exit to stop.
you: My name is Sam. Do you sell croissants?
bakery: Yes, Sam. We bake plain and almond croissants every morning.
you: What is my name?
bakery: Your name is Sam.
you: exit
Conversation over. 4 entries in the list.
:::

Four details matter in this code. First, the function ask receives the whole list, not only the last line. Second, the reply can hold several content blocks, and some of them are not text. The code loops over the blocks and keeps only the ones whose type is text. Third, the program appends the assistant entry as plain text. A plain string is enough for a chat; later modules append whole content blocks when tools are involved. Fourth, the empty line check stops the program from sending an empty message, which the API rejects.

A chat product with a web window looks like it remembers you. It does the same thing this program does: it stores the list on its own server and sends the list on every call. There is no memory inside the model that your program could ask for. This is good news for you. Your program owns the whole conversation, so it can save the list to a file, print it, cut it short or clear it. The reset command in the exercise is the simplest of those operations.

The while True loop runs until the break statement. The input function waits for you to press Enter. The strip call removes spaces at both ends of the line. These three Python pieces are all the loop needs.

There is one cost to this design. The list grows with every turn, and the model reads the whole list every time. The context window is the maximum amount of text the model can read in one call. For claude-sonnet-5-5 it is very large, so a terminal chat never fills it. But a long conversation costs more per turn than a short one, because every turn resends every earlier entry. The next lesson shows you the exact numbers. A later module, [Memory](/courses/build-ai-ecosystem/agents-and-tools/memory), shows how to shorten the list without losing the important facts.

## Try it

:::exercise
title: Add a reset command
task: Add a command named reset to chat/loop.py. When you type reset, the program empties the messages list and prints "Memory cleared." Test it: tell the assistant your name, type reset, then ask "What is my name?" The assistant must now say it does not know.
hint: Put a new if check next to the exit check. Assign a new empty list to messages, or call messages.clear().
lang: python
solution:
# inside the while loop, after the exit check:
        if line == "reset":
            messages.clear()
            print("Memory cleared.")
            continue
# Test:
# you: My name is Sam.
# bakery: Hello Sam, welcome to Rosa's Bakery.
# you: reset
# Memory cleared.
# you: What is my name?
# bakery: I am sorry, I do not know your name yet.
:::

## Common mistakes

- Mistake: send only the newest line to the API and expect the model to remember the earlier turns. Fix: append every line to the messages list and send the whole list each time.
- Mistake: print the reply but forget to append it as an assistant entry. Fix: append the reply before you read the next line, so the roles stay user, assistant, user, assistant.
- Mistake: put the system prompt in the messages list as a user entry on every turn. Fix: pass it once in the system field; it then applies to the whole conversation.
- Mistake: read response.content[0].text and crash when the first block is not text. Fix: loop over the blocks and keep the ones with type equal to text.
- Mistake: send an empty line and get an error about empty content. Fix: skip blank lines with a continue statement.

## Check your understanding

:::quiz
title: Check: the chat loop
q: After 7 complete turns, how many entries does the messages list hold?
- 7
* 14
- 8
why: Each turn appends one user entry and one assistant entry, so 7 turns give 14 entries.
q: Your program appends the user line, calls the API, prints the reply, and forgets to append it. On the next turn, what does the model see?
- The full conversation, because the API stores it
* Only user entries, with no record of what it said before
- An error, because the list is too short
why: The API keeps nothing between calls; the model sees exactly the list your program sends.
q: You want the assistant to always answer in at most 3 sentences. Where does that instruction belong?
* In the system field, written once before the loop
- As the last user entry on every turn
- In the model id
why: The system prompt sets rules for the whole conversation and travels outside the list.
q: Why does the code loop over response.content instead of reading the first block?
- The first block is always empty
* A reply can hold several blocks, and not all of them are text
- The API returns the blocks in random order
why: Checking block.type keeps the program correct when the reply holds non-text blocks.
q: A conversation reaches 40 turns. What happens to the cost of turn 41 compared with turn 1?
- It is the same, because only the new line is sent
* It is higher, because every earlier entry is sent again
- It is lower, because the model has learned the conversation
why: The whole list travels on every call, so a long list means more input text per turn.
:::

## Go further

The Messages API reference lists every field a call can carry. The system prompt guide shows how a few sentences change the behaviour of the assistant. The Python while loop page in the official docs explains break and continue in full. The next lesson, [Streaming and token counting](/courses/build-ai-ecosystem/chat-application/streaming-and-tokens), keeps this exact loop and adds two things. The reply appears word by word, and the program prints what every turn costs.
`,
    },
    {
      slug: 'streaming-and-tokens',
      title: 'Streaming and token counting',
      summary: 'After this lesson you can print a reply as it arrives, read the stream events, count the tokens of a request before you send it, and compute what a turn costs.',
      minutes: 22,
      objectives: [
        'Explain what a stream event is and name the 6 kinds the API sends.',
        'Write a chat loop that prints each text delta as it arrives.',
        'Run count_tokens on a messages list before you send it.',
        'Compute the cost of one turn from the token counts and the price per million tokens.',
      ],
      keyTerms: ['streaming', 'stream event', 'text delta', 'token', 'token counting', 'usage', 'max tokens'],
      links: [
        { label: 'Streaming Messages (Claude docs)', url: 'https://docs.anthropic.com/en/docs/build-with-claude/streaming', kind: 'docs' },
        { label: 'Token counting (Claude docs)', url: 'https://docs.anthropic.com/en/docs/build-with-claude/token-counting', kind: 'docs' },
        { label: 'Model pricing (Claude docs)', url: 'https://docs.anthropic.com/en/docs/about-claude/pricing', kind: 'docs' },
        { label: 'Server-sent events (MDN)', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events', kind: 'docs' },
      ],
      body: `
## What this lesson covers

This lesson adds two things to the chat loop. Streaming shows the reply word by word while the model writes it, instead of a long pause and then a wall of text. Token counting tells you how much text you send and receive, so you can compute the cost of every turn. You write chat/stream.py in the aiworkshop repository. After the lesson your terminal chat feels fast, and it prints the cost after every reply.

## Why it matters

A reply of 300 words takes a model about 5 seconds to write. Without streaming, the person waits 5 seconds and sees nothing. With streaming the first word appears after half a second, and the person reads while the model writes. Every chat product you have used works this way. The web page in the last lesson of this module and the deployed service in [Ship it](/courses/build-ai-ecosystem/ship-it/dockerise) both need it.

Tokens are the unit of cost. The API bills you per token in and per token out, not per message or per minute. If you cannot count tokens, you cannot predict a bill, set a limit or explain why a long conversation costs more. The lesson [Cost control](/courses/build-ai-ecosystem/ship-it/cost-control) at the end of this track builds a monthly budget on the numbers you learn to read here.

## The idea with an example

> **Analogy.** A radio reporter at a football match speaks as the game happens. You hear "the striker runs, shoots, and scores" while it happens. A newspaper reporter writes the full report and you read it the next morning. The streamed reply is the radio. The normal reply is the newspaper. Both carry the same words; only the timing differs. Tokens are the word count at the bottom of the article: the number the editor pays by.

Take one concrete turn with the bakery assistant. You type "Describe your 3 best-selling breads in one sentence each." The program first asks the API to count the tokens of the request. The system prompt and your line together make 44 tokens. A token is a piece of text, on average about 4 characters of English or three quarters of a word. Then the program sends the request as a stream.

The first piece of text arrives after 0.5 seconds. Pieces keep arriving for 2.4 seconds more. Each piece is a text delta: a few characters that the program prints at once, without a newline. When the last piece arrives the API sends a final event with the output count: 96 tokens. The program then computes the cost. At the time of writing, claude-sonnet-5-5 costs 2 USD per million input tokens and 10 USD per million output tokens. Check the pricing page, because prices change.

Input cost is 44 tokens times 2 USD divided by 1,000,000, which is 0.000088 USD. Output cost is 96 tokens times 10 USD divided by 1,000,000, which is 0.00096 USD. The turn costs 0.001048 USD, about one tenth of a cent. Ten thousand turns like it cost about 10.48 USD. Output tokens cost 5 times more than input tokens, and in this turn they are also more numerous, so they make 92 percent of the cost.

:::timeline
title: One streamed turn, in seconds
lane You
lane Your program
lane API
You -> Your program: type the line @0
Your program -> API: count_tokens @0
API -> Your program: 44 tokens @0.2
Your program -> API: stream request @0.2
API: reads the 44 tokens @0.2-0.7
API -> Your program: first text delta @0.7
API: writes 96 tokens @0.7-3.1
Your program: prints each delta @0.7-3.1
API -> Your program: message_stop @3.1
Your program -> You: cost line @3.1
:::

Press Next to follow the events of this turn one by one.

:::scenario
title: The events of one streamed reply
state: tokens_in=0, tokens_out=0, printed=0 chars
step: The program calls count_tokens with the system prompt and the messages list. The API answers 44. Nothing is generated yet.
state: tokens_in=44
step: The program opens the stream. The first event is message_start. It carries the input count, 44, which matches the count from before.
state: block=text
step: The event content_block_start says a text block begins. The program prints nothing yet.
state: printed=14 chars
step: A content_block_delta event arrives with the text "Our sourdough". The program prints it with no newline and flushes the output.
state: printed=412 chars
step: About 40 more delta events arrive over 2.4 seconds. Each one adds a few characters. The program prints each at once.
state: block=closed
step: The event content_block_stop says the text block is complete.
state: tokens_out=96, stop_reason=end_turn
step: The event message_delta carries the output count, 96, and the stop reason end_turn.
state: cost=0.001048 USD
step: The event message_stop closes the reply. The program computes 44 times 2 plus 96 times 10, divides by 1,000,000, and prints the cost.
:::

## How it works

Streaming uses a long-lived HTTP response. Instead of one body that arrives at the end, the server sends many small events, one after another, on the same connection. The Python software development kit (SDK) reads them for you and turns each into a Python object with a type field. A stream event is one such object. There are 6 kinds.

| Event type | How often | What it carries |
| --- | --- | --- |
| message_start | once, first | the message id and the input token count |
| content_block_start | once per block | the type of the block, for example text |
| content_block_delta | many times | a text delta: a few characters of the reply |
| content_block_stop | once per block | nothing; the block is complete |
| message_delta | once, near the end | the stop reason and the output token count |
| message_stop | once, last | nothing; the reply is complete |

The SDK gives you two ways to read a stream. The simple way is stream.text_stream, which yields only the text of each delta and skips every other event. The detailed way is to loop over the stream itself and check event.type. Both ways let you call stream.get_final_message() at the end to get the complete reply with its usage field. Usage is the part of a reply that reports the token counts: input_tokens and output_tokens.

The streamed loop has these steps:

1. Append the user entry to the messages list, as before.
2. Call client.messages.count_tokens with the same model, system prompt and list. Print the number.
3. Open client.messages.stream in a with block.
4. For each piece of text in stream.text_stream, print it with end set to an empty string and flush set to True.
5. After the loop, call stream.get_final_message() and read usage.input_tokens and usage.output_tokens.
6. Compute the cost and print it. Append the assistant entry and go back to step 1.

Here is the complete program. It reuses the system prompt from the last lesson.

:::code
lang: python
file: chat/stream.py
import anthropic

client = anthropic.Anthropic()
MODEL = "claude-sonnet-5-5"
SYSTEM = "You are the assistant for Rosa's Bakery. Answer in at most 3 sentences."
PRICE_IN = 2.00    # USD per million input tokens, check the pricing page
PRICE_OUT = 10.00  # USD per million output tokens

def cost(tokens_in: int, tokens_out: int) -> float:
    return (tokens_in * PRICE_IN + tokens_out * PRICE_OUT) / 1_000_000

def ask_stream(messages: list) -> tuple[str, int, int]:
    count = client.messages.count_tokens(model=MODEL, system=SYSTEM, messages=messages)
    print(f"[sending {count.input_tokens} tokens]")
    print("bakery: ", end="", flush=True)
    with client.messages.stream(model=MODEL, max_tokens=2048, system=SYSTEM, messages=messages) as stream:
        for text in stream.text_stream:
            print(text, end="", flush=True)
        final = stream.get_final_message()
    print()
    reply = "".join(block.text for block in final.content if block.type == "text")
    return reply, final.usage.input_tokens, final.usage.output_tokens

def main() -> None:
    messages = []
    total = 0.0
    while True:
        line = input("you: ").strip()
        if line in ("exit", "quit"):
            break
        if not line:
            continue
        messages.append({"role": "user", "content": line})
        reply, tokens_in, tokens_out = ask_stream(messages)
        messages.append({"role": "assistant", "content": reply})
        turn_cost = cost(tokens_in, tokens_out)
        total += turn_cost
        print(f"[in {tokens_in}, out {tokens_out}, turn {turn_cost:.6f} USD, total {total:.6f} USD]")

if __name__ == "__main__":
    main()
:::

:::code
lang: bash
python -m chat.stream
:::

:::code
lang: text
you: Describe your 3 best-selling breads in one sentence each.
[sending 44 tokens]
bakery: Our sourdough has a crisp crust and a slow 24-hour rise. Our rye is dense,
dark and keeps for a week. Our seeded loaf is soft inside with sunflower and
pumpkin seeds on top.
[in 44, out 96, turn 0.001048 USD, total 0.001048 USD]
you: Which one is cheapest?
[sending 152 tokens]
bakery: The rye is the cheapest at 3.50 per loaf.
[in 152, out 14, turn 0.000444 USD, total 0.001492 USD]
:::

Look at the second turn. You typed 5 words, but the program sent 152 tokens. The 44 tokens of turn 1 and the 96 tokens of the reply make 140. About 12 tokens for the new line and message framing bring the total to 152. This is the growth you learned about in the last lesson, now in numbers. Each turn resends the whole list, so the input count of a turn is close to the sum of everything said so far.

Three details matter in this code. First, print with end set to an empty string, so the deltas join on one line. Set flush to True as well, so each delta appears at once instead of waiting in a buffer. Second, the count from count_tokens and the input_tokens in usage are the same number, because they count the same request. You can skip the count call and read usage after the reply. But count_tokens lets you refuse a request that is too large before you pay for it. Third, max_tokens is a limit on the output only. If the model reaches it, the stop reason in message_delta is max_tokens and the reply is cut off. For a chat, 2048 is enough; raise it for long documents.

When you need the other events, loop over the stream directly. This short version prints the type of every event and the text of every delta.

:::code
lang: python
file: chat/events.py
import anthropic

client = anthropic.Anthropic()
messages = [{"role": "user", "content": "Say hello in 5 words."}]
with client.messages.stream(model="claude-sonnet-5-5", max_tokens=256, messages=messages) as stream:
    for event in stream:
        if event.type == "content_block_delta" and event.delta.type == "text_delta":
            print(repr(event.delta.text))
        elif event.type == "message_delta":
            print("stop_reason:", event.delta.stop_reason, "output_tokens:", event.usage.output_tokens)
        else:
            print(event.type)
:::

:::code
lang: text
message_start
content_block_start
'Hello'
', nice'
' to meet'
' you!'
content_block_stop
stop_reason: end_turn output_tokens: 8
message_stop
:::

The deltas do not match words one to one. A delta can be half a word, a word with its leading space, or a punctuation mark. Your program must not assume anything about where a delta starts or ends. It prints what it gets.

## Try it

:::exercise
title: Guard the budget
task: Add a budget of 0.01 USD to chat/stream.py. Before each turn, use count_tokens to compute the input cost. If the total so far plus the input cost is above the budget, print "Budget reached." and stop the loop instead of calling the model. Test it by pasting a long paragraph several times.
hint: The function cost already computes the price. Call it with tokens_out set to 0 for the estimate. Put the check between count_tokens and the stream call, so you must move the count call into main or return the count from a helper.
lang: python
solution:
BUDGET = 0.01

# in main, before ask_stream:
        count = client.messages.count_tokens(model=MODEL, system=SYSTEM, messages=messages)
        estimate = cost(count.input_tokens, 0)
        if total + estimate > BUDGET:
            print("Budget reached.")
            messages.pop()   # remove the line we did not send
            break
# then call ask_stream as before.
:::

## Common mistakes

- Mistake: print each delta with the default end, so every piece lands on its own line. Fix: pass end set to an empty string and flush set to True.
- Mistake: read response.usage on the stream object before it has finished. Fix: call stream.get_final_message() after the for loop and read usage from the result.
- Mistake: compute cost in dollars per token and get a number too large by a million. Fix: prices are per million tokens, so divide by 1,000,000.
- Mistake: assume one delta is one word and split on spaces. Fix: treat a delta as an arbitrary piece of text and print it as it is.
- Mistake: set max_tokens to 100 to save money and get replies cut off mid sentence. Fix: check the stop reason; if it is max_tokens, raise the limit.

## Check your understanding

:::quiz
title: Check: streaming and tokens
q: A turn sends 300 input tokens and receives 500 output tokens at 2 USD and 10 USD per million. What does the turn cost?
- 0.0008 USD
* 0.0056 USD
- 0.056 USD
- 5.6 USD
why: 300 times 2 is 600, 500 times 10 is 5,000, the sum 5,600 divided by 1,000,000 is 0.0056 USD.
q: Which event tells you the final output token count of a streamed reply?
- message_start
- content_block_stop
* message_delta
why: The message_delta event near the end carries the stop reason and the output usage; message_start carries only the input count.
q: Your streamed output appears all at once after 3 seconds instead of word by word. What is the most likely cause?
- The model does not support streaming
* print is buffering the deltas because flush is not set to True
- count_tokens is slowing the request
why: Without flush, Python holds the printed text in a buffer and shows it later; the deltas did arrive in time.
q: Turn 1 sent 44 tokens and got 96 back. Roughly how many input tokens does turn 2 send if you type a 10-token line?
- About 10
- About 54
* About 150
why: Turn 2 resends the 44 tokens, the 96-token reply and the new line, so the count is close to 150.
q: Why call count_tokens before the stream call when usage reports the same number afterwards?
* You can refuse an oversized request before you pay for it
- Usage is often wrong
- The stream call fails without it
why: Counting first lets your code enforce a limit; after the call the tokens are already billed.
:::

## Go further

The streaming guide in the Claude docs lists every event with its fields, including the events for tool use that a later module reads. The token counting page explains what the count includes. The pricing page has the current prices for every model; copy the two numbers into PRICE_IN and PRICE_OUT when they change. The MDN page on server-sent events shows the raw format that the SDK reads for you. The next lesson, [Structured output](/courses/build-ai-ecosystem/chat-application/structured-output), stops asking for prose and asks for JSON that your code can check.
`,
    },
    {
      slug: 'structured-output',
      title: 'Structured output',
      summary: 'After this lesson you can ask a model for JSON, define the expected shape with a pydantic model, validate the reply, and retry with the error message when it fails.',
      minutes: 22,
      objectives: [
        'Explain why free text from a model is hard for code to use and JSON is easy.',
        'Write a pydantic model and put its JSON schema into the system prompt.',
        'Validate a reply with model_validate_json and read the error it raises.',
        'Write a retry loop that sends the validation error back to the model, with a maximum of 3 attempts.',
      ],
      keyTerms: ['structured output', 'JSON schema', 'pydantic', 'validation', 'retry', 'stop reason'],
      links: [
        { label: 'Structured outputs (Claude docs)', url: 'https://docs.anthropic.com/en/docs/build-with-claude/structured-outputs', kind: 'docs' },
        { label: 'Pydantic models (Pydantic docs)', url: 'https://docs.pydantic.dev/latest/concepts/models/', kind: 'docs' },
        { label: 'JSON Schema: getting started', url: 'https://json-schema.org/learn/getting-started-step-by-step', kind: 'docs' },
        { label: 'The json module (Python docs)', url: 'https://docs.python.org/3/library/json.html', kind: 'docs' },
      ],
      body: `
## What this lesson covers

This lesson teaches structured output. Structured output is a reply in a fixed shape, such as a JavaScript Object Notation (JSON) object with named fields, instead of a paragraph of prose. You describe the shape with a pydantic model, you put the shape into the prompt, and you check every reply against it. When a reply fails the check, you send the error back and ask again. You write chat/order.py in the aiworkshop repository. After the lesson the bakery assistant turns a customer message into an order that your code can price and store.

## Why it matters

A chat reply is for a person to read. A program cannot read "Sure, that is 12 croissants for Friday morning" and know the quantity. It needs a number in a field named quantity. Every part of the system you build later depends on this move from prose to data. The retrieval module asks a model to grade answers and needs a score, not a sentence. The agents module receives tool arguments as JSON. The evaluation scripts in [Evaluating RAG](/courses/build-ai-ecosystem/retrieval-rag/evaluate-rag) parse hundreds of replies with no human in the loop. One malformed reply in a hundred breaks all of that unless you validate and retry.

## The idea with an example

> **Analogy.** A customer at the counter says "Hi, this is Sam, I need a dozen croissants and two sourdough loaves on Friday, nine in the morning." The baker does not write that sentence in the order book. The order book has columns: name, item, quantity, day, time. The baker fills the columns and, when a column makes no sense, asks the customer again. The columns are the schema. The baker filling them is the model. The baker checking each column is validation. Asking again is the retry.

Take the exact message from the analogy. You want this JSON back:

:::code
lang: json
{
  "customer": "Sam",
  "items": [
    {"name": "croissant", "quantity": 12},
    {"name": "sourdough loaf", "quantity": 2}
  ],
  "pickup_day": "Friday",
  "pickup_time": "09:00"
}
:::

Your code defines 4 rules. The customer is a string. Each item has a string name and an integer quantity greater than 0. The pickup day is one of the 7 day names, spelled in full. The pickup time has the form hh:mm with 2 digits on each side of the colon. On the first attempt the model writes "pickup_time": "9am". The validator rejects it, because "9am" does not match the time pattern. Your code sends the error text back to the model. On the second attempt the model writes "09:00" and the order passes.

:::flow
title: Ask, check, retry
Your code -> Model: message and JSON schema
Model -> Your code: JSON text
Your code -> Validator: check the text against the model
Validator -> Your code: Order object, or an error
Your code -> Model: the error, ask again
Model -> Your code: corrected JSON text
:::

Press Next to follow the two attempts.

:::scenario
title: Two attempts to take one order
state: attempt=1, messages=1, valid=no
step: Your code puts the schema into the system prompt and sends the customer message as the only user entry.
state: reply=JSON with pickup_time 9am
step: The model replies with a JSON object. Every field is present, but pickup_time is "9am".
state: error=pickup_time should match pattern
step: Validation fails on one field. The error names the field and the rule it broke.
state: messages=3, attempt=2
step: Your code appends the reply as an assistant entry and the error as a user entry that asks for JSON again.
state: reply=JSON with pickup_time 09:00
step: The model reads its own reply and the error, and replies with "09:00" this time.
state: valid=yes, items=2, croissants=12
step: Validation passes. Your code receives an Order object with 2 items and reads order.items[0].quantity, which is 12.
:::

Two things make the retry work. The model sees its own wrong reply, so it knows what to change. And the error text is specific: it names the field and the rule. A vague message such as "try again" works far less often.

A good schema removes most retries before they happen. Most replies pass on the first attempt. The ones that fail are almost always a format detail, such as a time written as 9am. Without the pattern rule, that reply would pass validation, and your code would fail later when it tries to turn 9am into a clock time. Validation moves the failure to the place where you can see it and fix it.

## How it works

Pydantic is a Python library that turns a class with typed fields into a validator. You write the fields once. Pydantic gives you 3 things from that one class. The first is a JSON schema to show the model. The second is a parser that turns JSON text into a Python object. The third is an error message when the text does not fit. A JSON schema is a standard description of the fields, their types and their rules, written as JSON itself.

| Field | Type | Rule | Valid example | Rejected example |
| --- | --- | --- | --- | --- |
| customer | string | required | Sam | missing |
| items | list of items | required, each item has name and quantity | 2 items | an empty string |
| items[n].quantity | integer | greater than 0 | 12 | 0, or "a dozen" |
| pickup_day | one of 7 names | spelled in full | Friday | Fri |
| pickup_time | string | pattern hh:mm | 09:00 | 9am |

The program has these steps:

1. Define OrderItem and Order as pydantic models with the rules above.
2. Build the system prompt: ask for one JSON object only, no prose, no code fences, and paste the schema from Order.model_json_schema().
3. Send the customer message. Collect the text of the reply.
4. Cut the text from the first opening brace to the last closing brace. A stray sentence or a code fence around the JSON then does not break parsing.
5. Call Order.model_validate_json on that text. If it passes, return the Order object.
6. If it raises ValidationError, append the reply and the error to the messages list and go back to step 3, at most 3 times.
7. After 3 failures, raise an error so the caller knows no order was taken.

Install pydantic first and add it to requirements.txt.

:::code
lang: bash
pip install pydantic
echo "pydantic" >> requirements.txt
:::

:::code
lang: python
file: chat/order.py
import json
from typing import Literal
import anthropic
from pydantic import BaseModel, Field, ValidationError

client = anthropic.Anthropic()
MODEL = "claude-sonnet-5-5"
Day = Literal["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

class OrderItem(BaseModel):
    name: str
    quantity: int = Field(gt=0)

class Order(BaseModel):
    customer: str
    items: list[OrderItem]
    pickup_day: Day
    pickup_time: str = Field(pattern=r"^[0-2][0-9]:[0-5][0-9]$", description="24-hour time, hh:mm")

SYSTEM = ("You take orders for Rosa's Bakery. Reply with one JSON object only, "
          "no prose and no code fences. The object must match this JSON schema:\\n"
          + json.dumps(Order.model_json_schema()))

def take_order(request: str, attempts: int = 3) -> Order:
    messages = [{"role": "user", "content": request}]
    for attempt in range(1, attempts + 1):
        response = client.messages.create(model=MODEL, max_tokens=1024, system=SYSTEM, messages=messages)
        text = "".join(block.text for block in response.content if block.type == "text")
        raw = text[text.find("{"): text.rfind("}") + 1]
        try:
            return Order.model_validate_json(raw)
        except ValidationError as error:
            print(f"attempt {attempt} failed with {error.error_count()} error(s)")
            messages.append({"role": "assistant", "content": text})
            messages.append({"role": "user", "content": f"That was not valid:\\n{error}\\nReply again with one JSON object only."})
    raise ValueError(f"no valid order after {attempts} attempts")

if __name__ == "__main__":
    order = take_order("Hi, this is Sam. I need a dozen croissants and two sourdough loaves on Friday, nine in the morning.")
    print(order)
    print("first item:", order.items[0].name, "x", order.items[0].quantity)
:::

:::code
lang: bash
python -m chat.order
:::

:::code
lang: text
attempt 1 failed with 1 error(s)
customer='Sam' items=[OrderItem(name='croissant', quantity=12), OrderItem(name='sourdough loaf', quantity=2)] pickup_day='Friday' pickup_time='09:00'
first item: croissant x 12
:::

Four details matter in this code. First, model_validate_json does both jobs in one call: it parses the JSON text and checks every rule. Broken JSON and a broken rule both raise the same ValidationError, so one except clause covers both. Second, the slice from the first brace to the last brace is a cheap guard. Models sometimes add a sentence before the JSON, and the guard removes it. Third, the error object prints as a readable list that names each bad field, and that text goes straight back to the model. Fourth, the attempts limit is a stop condition. Without it a model that never gets the format right would loop until your budget runs out.

The quantity in the example started as the words "a dozen". The model turned it into 12 because the schema says quantity is an integer. This is the main reason to show the schema in the prompt: the model sees the types and converts on its own. The rule gt equal to 0 catches a different mistake, an item with a quantity of 0, which a schema type alone would allow.

The schema is long. Order.model_json_schema() for this model prints about 60 lines of JSON, and it travels in the system prompt on every call. It adds a few hundred tokens to each request. That is fine for an order taker that runs a few times a minute. If you take thousands of orders a day, keep the schema short: drop descriptions you do not need and avoid deeply nested models.

A stop reason of max_tokens is a special failure. The JSON is cut off in the middle, so it never parses. The retry loop handles it, but the better fix is a larger max_tokens, because the retry would be cut off at the same place. Check response.stop_reason when you debug a loop that fails 3 times in a row.

## Try it

:::exercise
title: Add a note field and a total
task: Add an optional field named note to Order, a string that defaults to None, for requests such as "no nuts". Then write a function total(order) that prices the order with a dictionary of unit prices: croissant 2.80, sourdough loaf 6.50. Unknown items cost 0. Run the example order and print the total, which is 46.60.
hint: An optional field is written as note: str | None = None. For the total, loop over order.items and look up item.name in the prices dictionary with a default of 0.
lang: python
solution:
class Order(BaseModel):
    customer: str
    items: list[OrderItem]
    pickup_day: Day
    pickup_time: str = Field(pattern=r"^[0-2][0-9]:[0-5][0-9]$", description="24-hour time, hh:mm")
    note: str | None = None

PRICES = {"croissant": 2.80, "sourdough loaf": 6.50}

def total(order: Order) -> float:
    return sum(PRICES.get(item.name, 0) * item.quantity for item in order.items)

# 12 * 2.80 + 2 * 6.50 = 33.60 + 13.00 = 46.60
:::

## Common mistakes

- Mistake: ask for JSON in the prompt but give no schema, then get different field names on every run. Fix: paste Order.model_json_schema() into the system prompt so the names and types are fixed.
- Mistake: call json.loads on the whole reply and crash on a sentence before the braces. Fix: slice from the first brace to the last brace, or use the structured outputs feature of the API.
- Mistake: retry with the message "try again" and get the same error. Fix: send the validation error text, which names the field and the rule.
- Mistake: retry forever. Fix: cap the attempts at 3 and raise an error after that.
- Mistake: see 3 failures in a row and blame the model when the stop reason is max_tokens. Fix: check stop_reason and raise max_tokens so the JSON is not cut off.

## Check your understanding

:::quiz
title: Check: structured output
q: The model returns {"customer": "Sam", "items": [{"name": "rye", "quantity": 0}], "pickup_day": "Friday", "pickup_time": "10:00"}. What happens?
- It passes, because every field is present and the types match
* Validation fails on quantity, because the rule requires a value greater than 0
- Validation fails on pickup_time
why: The type is correct but the Field rule gt equal to 0 rejects 0.
q: Why does the retry message include the text of the ValidationError?
- The API requires an error message in a retry
* The model needs to know which field broke which rule to fix it
- It makes the reply shorter
why: A specific error gives the model what it needs to change; a vague message leaves it guessing.
q: Why does the code append the wrong reply as an assistant entry before the retry?
* So the model sees what it wrote and corrects it instead of starting over
- Because the API rejects two user entries in a row
- To keep the token count low
why: The retry works best when the model can compare its own reply with the error.
q: A loop fails 3 times and every reply ends mid-field. What is the most likely cause?
- The schema has too many fields
- Pydantic is not installed
* max_tokens is too small and the stop reason is max_tokens
why: A cut-off reply never parses; raising max_tokens fixes it, a retry does not.
q: What does model_validate_json do that json.loads does not?
- It removes code fences
* It checks the parsed data against the fields and rules of the model
- It calls the API
why: json.loads only turns text into a dictionary; pydantic checks types, required fields and rules like gt and pattern.
:::

## Go further

The pydantic docs explain Field rules such as gt, pattern and max_length and how optional fields work. The JSON Schema guide shows what model_json_schema() produces. The structured outputs page in the Claude docs describes a feature where the API itself enforces the schema. The SDK exposes it as client.messages.parse with output_format set to your pydantic class. Try it once you understand the manual version, because the manual version is what you use with any model and any API. The next lesson, [A web UI](/courses/build-ai-ecosystem/chat-application/web-ui), puts the chat loop behind a web page. The server there validates the request body with the same pydantic library.
`,
    },
    {
      slug: 'web-ui',
      title: 'A web UI',
      summary: 'After this lesson you can run a FastAPI server with a /chat endpoint and a single HTML page that sends the conversation with fetch and shows the reply.',
      minutes: 24,
      objectives: [
        'Explain how a browser, a FastAPI server and the model API pass one message along and back.',
        'Write a POST /chat endpoint that validates its body with pydantic and calls the model.',
        'Write one HTML page that keeps the messages list in JavaScript and calls the endpoint with fetch.',
        'Run the server locally with uvicorn and test the endpoint with curl and with the page.',
      ],
      keyTerms: ['endpoint', 'FastAPI', 'fetch', 'request', 'response', 'server', 'client'],
      links: [
        { label: 'FastAPI first steps', url: 'https://fastapi.tiangolo.com/tutorial/first-steps/', kind: 'docs' },
        { label: 'FastAPI request body', url: 'https://fastapi.tiangolo.com/tutorial/body/', kind: 'docs' },
        { label: 'Using the Fetch API (MDN)', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch', kind: 'docs' },
        { label: 'Uvicorn', url: 'https://www.uvicorn.org/', kind: 'docs' },
      ],
      body: `
## What this lesson covers

This lesson moves the chat loop from the terminal to a web page. You write a small server with FastAPI, a Python library for building web services. The server has one endpoint named /chat. An endpoint is one URL path that the server answers. You also write one HTML page with a text box, a Send button and a few lines of JavaScript that call the endpoint with fetch. After the lesson you open http://127.0.0.1:8000 in your browser and chat with the bakery assistant from there.

## Why it matters

A terminal program runs on one computer for one person. A web server answers many people from one place, and each of them needs only a browser. Every later module in this track adds endpoints to the server you start here: /ask for retrieval, an agent route, a health check. The module [Ship it](/courses/build-ai-ecosystem/ship-it/dockerise) packages this exact server in a container and puts it on a public URL. If you understand one endpoint well, every other endpoint is a copy with a different function inside.

:::video
id: 7t2alSnE2-I
why: Watch the first 25 minutes. They cover installing FastAPI, the first route, and the automatic docs page, which is everything this lesson uses.
:::

## The idea with an example

> **Analogy.** A restaurant has a dining room, a waiter and a kitchen. You sit in the dining room and give the waiter a written order. The waiter checks that the order makes sense, carries it to the kitchen, waits, and brings the dish back to your table. The browser is the dining room. The FastAPI server is the waiter. The model API is the kitchen. The waiter keeps no record of your past orders; you keep your own list at the table and hand over the whole list each time.

Take one concrete turn. You type "Do you sell rye?" in the page and press Send. The JavaScript in the page appends a user entry to a list it keeps in memory, so the list now holds 1 entry. It then sends an HTTP POST request to /chat with the list as JSON in the body. The server receives the body, checks that it has the right shape, and calls the model with the list, exactly as chat/loop.py did. The model answers "Yes, we bake a dark rye every day. It is 3.50 per loaf." The server returns that text as JSON. The page appends an assistant entry, so the list holds 2 entries, and shows the reply under your line.

:::arch
title: The chat page, the server and the model
layer: Users | Browser
layer: Service | FastAPI app, Chat handler
layer: Models | Claude API
flow: Browser -> FastAPI app -> Chat handler -> Claude API -> Chat handler -> FastAPI app -> Browser
note: Chat handler = validates the body, calls the model, returns the reply
:::

Press Next to follow the turn through the 3 parts.

:::scenario
title: One turn through the web page
state: list=0 entries, page=empty
step: You type "Do you sell rye?" and press Send. The JavaScript appends a user entry to its list and shows your line on the page.
state: list=1 entry, request=POST /chat
step: The JavaScript calls fetch with method POST, a JSON content type header, and the list as the body.
state: server=body valid
step: FastAPI reads the body and checks it against the ChatRequest model: a list of entries, each with a role and a content string.
state: model=called with 1 entry
step: The chat handler calls client.messages.create with the system prompt and the list, as in the terminal loop.
state: reply=Yes, we bake a dark rye every day...
step: The model answers. The handler collects the text blocks and returns a dictionary with the reply and the token counts.
state: status=200, body=JSON
step: FastAPI turns the dictionary into a JSON response with status 200, which means success.
state: list=2 entries
step: The JavaScript reads the JSON, appends an assistant entry to its list and shows the reply on the page. The next turn sends both entries.
:::

Notice where the messages list lives: in the browser, in a JavaScript variable. The server stores nothing between requests. This matches the model API, which also stores nothing. Two browser tabs are two separate conversations. A page reload empties the list.

## How it works

Four pieces take part in every turn. The client is the program that sends a request; here it is the browser. The server is the program that waits for requests and answers them; here it is FastAPI run by uvicorn. A request carries a method, a path, headers and a body. A response carries a status code and a body. Both bodies are JSON in this lesson.

The status code is a 3-digit number that says how the request went. 200 means success. 422 means the body did not match the model. 500 means your code raised an error, for example when the API key is missing. The browser does not throw on a 422 or a 500; your JavaScript must check res.ok or the status when it matters.

| Piece | Method and path | Body it sends | Body it receives |
| --- | --- | --- | --- |
| GET / | GET / | nothing | the HTML page |
| POST /chat | POST /chat | a JSON object with a messages list | a JSON object with reply, input_tokens and output_tokens |
| Claude API | POST, made by the handler | system prompt and the list | content blocks and usage |

The server has these steps:

1. Install fastapi and uvicorn and add both to requirements.txt.
2. Define two pydantic models: Message with role and content, and ChatRequest with a list of Message.
3. Write a GET / route that returns the HTML file.
4. Write a POST /chat route whose parameter is a ChatRequest. FastAPI validates the body before your code runs.
5. Inside the route, turn the models into plain dictionaries, call the model API, and return a dictionary.
6. Start the server with uvicorn and open the page.

:::code
lang: bash
pip install fastapi uvicorn
echo "fastapi" >> requirements.txt
echo "uvicorn" >> requirements.txt
mkdir -p app/static
:::

Here is the server. If app/main.py already exists from the first module, replace its content.

:::code
lang: python
file: app/main.py
import anthropic
from fastapi import FastAPI
from fastapi.responses import FileResponse
from pydantic import BaseModel

app = FastAPI(title="Rosa's Bakery chat")
client = anthropic.Anthropic()
MODEL = "claude-sonnet-5-5"
SYSTEM = "You are the assistant for Rosa's Bakery. Answer in at most 3 sentences."

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: list[Message]

@app.get("/")
def index():
    return FileResponse("app/static/index.html")

@app.post("/chat")
def chat(body: ChatRequest):
    messages = [m.model_dump() for m in body.messages]
    response = client.messages.create(model=MODEL, max_tokens=2048, system=SYSTEM, messages=messages)
    reply = "".join(block.text for block in response.content if block.type == "text")
    return {
        "reply": reply,
        "input_tokens": response.usage.input_tokens,
        "output_tokens": response.usage.output_tokens,
    }
:::

The decorator app.post("/chat") tells FastAPI that the function below answers POST requests on the path /chat. The parameter type ChatRequest tells FastAPI to parse the JSON body into that model. A body with a missing field gets a response with status 422 and a list of errors, and your function never runs. This is the same pydantic validation as the last lesson, now applied to what the browser sends. The method model_dump turns a pydantic object back into a plain dictionary, which is what the Anthropic client expects.

Now the page. It is one HTML file with 3 parts: a heading and a log area, a form with a text box, and a script.

:::code
lang: html
file: app/static/index.html
<!doctype html>
<html>
<head><meta charset="utf-8"><title>Rosa's Bakery chat</title></head>
<body>
<h1>Rosa's Bakery</h1>
<div id="log"></div>
<form id="form"><input id="box" size="60" autocomplete="off"><button>Send</button></form>
<script>
const history = [];
const log = document.getElementById("log");
function show(who, text) {
  const p = document.createElement("p");
  p.textContent = who + ": " + text;
  log.appendChild(p);
}
document.getElementById("form").onsubmit = async (event) => {
  event.preventDefault();
  const box = document.getElementById("box");
  const text = box.value.trim();
  if (!text) return;
  box.value = "";
  history.push({ role: "user", content: text });
  show("you", text);
  const res = await fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: history }),
  });
  const data = await res.json();
  history.push({ role: "assistant", content: data.reply });
  show("bakery", data.reply);
};
</script>
</body>
</html>
:::

The script does in JavaScript what chat/loop.py does in Python. The array named history is the messages list. The function show adds one paragraph to the page. The onsubmit handler runs when you press Send or Enter. It stops the browser from reloading the page, appends the user entry, and calls fetch. The fetch call sends the request and returns a promise, so the code waits with await. JSON.stringify turns the array into JSON text for the body, and res.json() turns the response body back into an object. Then the handler appends the assistant entry and shows the reply.

Start the server from the root of the repository, with the virtual environment active.

:::code
lang: bash
uvicorn app.main:app --reload
:::

:::code
lang: text
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Application startup complete.
:::

The flag --reload restarts the server when you save a file, which is what you want while you develop. Open http://127.0.0.1:8000 in your browser and type a question. Open http://127.0.0.1:8000/docs as well. FastAPI builds this page on its own from your routes and models, and you can send a test request from it without the HTML page.

You can also test the endpoint from a second terminal with curl, which sends a request and prints the response body.

:::code
lang: bash
curl -s -X POST http://127.0.0.1:8000/chat -H "Content-Type: application/json" -d '{"messages": [{"role": "user", "content": "Do you sell rye?"}]}'
:::

:::code
lang: text
{"reply":"Yes, we bake a dark rye every day. It is 3.50 per loaf.","input_tokens":38,"output_tokens":19}
:::

Three details matter here. First, the browser and the server must agree on the field names: the page sends messages, the ChatRequest model expects messages. Change one and FastAPI answers 422. Second, the API key never reaches the browser. The server reads it from the environment, and the page only sees replies. Keep it that way; a key in a web page is a key for everyone. Third, this endpoint waits for the whole reply before it answers. Streaming to a browser is possible with a streaming response and the events from the earlier lesson. The Claude docs show the pattern. A plain endpoint is the right first step.

## Try it

:::exercise
title: Show the cost under each reply
task: The server already returns input_tokens and output_tokens. Change the page so that under every bakery reply it shows a small line such as "38 in, 19 out, 0.000266 USD". Use the prices from the streaming lesson: 2 USD per million input tokens and 10 USD per million output tokens.
hint: After res.json(), compute the cost in JavaScript with the same formula as the Python cost function. Call show a second time with the text, or add a second paragraph with a smaller font.
lang: javascript
solution:
// after: const data = await res.json();
const cost = (data.input_tokens * 2 + data.output_tokens * 10) / 1000000;
history.push({ role: "assistant", content: data.reply });
show("bakery", data.reply);
show("cost", data.input_tokens + " in, " + data.output_tokens + " out, " + cost.toFixed(6) + " USD");
:::

## Common mistakes

- Mistake: keep the messages list in a global variable on the server, so every visitor shares one conversation. Fix: keep the list in the browser and send it with every request, as the page does.
- Mistake: send the body with fetch but forget the Content-Type header, so FastAPI cannot parse it. Fix: set the header to application/json and use JSON.stringify for the body.
- Mistake: put the API key into the HTML page or the JavaScript. Fix: the key stays on the server, read from the environment; the browser only ever sees replies.
- Mistake: run uvicorn from inside the app folder and get a module not found error. Fix: run it from the root of the repository, where the app package is.
- Mistake: see a 422 response and look for a bug in the model call. Fix: a 422 means the body did not match ChatRequest; compare the field names and types on both sides.

## Check your understanding

:::quiz
title: Check: the web UI
q: The page sends {"history": [...]} instead of {"messages": [...]}. What does the server answer?
- 200 with an empty reply
* 422, because the body does not match ChatRequest
- 500, because the model call fails
why: FastAPI validates the body with pydantic before the route runs, and a missing required field is a 422 error.
q: Two people open the page in two browsers and chat at the same time. What do they see?
- One shared conversation, because the server keeps the list
* Two separate conversations, because each browser keeps its own list
- An error, because the server allows one connection
why: The list lives in the JavaScript of each page; the server stores nothing between requests.
q: Which part of the system calls the Claude API?
- The browser, through fetch
* The chat route in app/main.py, on the server
- Uvicorn
why: The browser talks only to your server; the server holds the key and talks to the model.
q: What does await fetch(...) return once the server answers?
- The reply text as a string
* A response object; you call res.json() to read the body
- The messages list
why: fetch resolves to a response; the body must be read with a second call such as json().
q: You press Send and the page reloads with an empty log. What is missing?
* event.preventDefault() in the submit handler
- The Content-Type header
- The system prompt
why: A form submits and reloads the page by default; preventDefault stops that so the script can handle it.
:::

## Go further

The FastAPI first steps and request body pages explain the decorator, the body model and the docs page in more depth. The MDN fetch guide covers headers, errors and reading a response body. The uvicorn site lists the flags you need when you move from --reload on your laptop to a server. This lesson completes the chat folder and the first endpoint of the app folder in your aiworkshop repository. The next module, [Retrieval over your own documents](/courses/build-ai-ecosystem/retrieval-rag/why-rag), gives the assistant the bakery files so it answers from facts instead of guesses.
`,
    },
  ],
}
