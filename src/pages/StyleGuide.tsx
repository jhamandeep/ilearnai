import { Link } from 'react-router-dom'
import { unapproved } from '../lib/ste'

const rules: { title: string; text: string; bad: string; good: string }[] = [
  { title: 'Keep sentences short', text: 'Use no more than 20 words in an instruction and 25 words in a description. If a sentence is longer, split it.', bad: 'The KV cache stores the keys and values for each previous token so that the model does not have to recompute them at every decoding step, which would otherwise make decoding quadratic in the sequence length.', good: 'The KV cache stores the keys and values for each previous token. The model reads them instead of computing them again. Without the cache, decode cost grows with the square of the sequence length.' },
  { title: 'One topic per paragraph', text: 'Write at most six sentences in a paragraph. Start a new paragraph when the topic changes.', bad: '(a 12-sentence paragraph that covers memory, latency and cost)', good: '(three paragraphs: one on memory, one on latency, one on cost)' },
  { title: 'Use the active voice', text: 'Say who does the action. The passive hides the actor and adds words.', bad: 'The weights are read from memory by the GPU at each step.', good: 'The GPU reads the weights from memory at each step.' },
  { title: 'Use the present tense', text: 'Describe how things work in the present tense. Use the past tense only for history.', bad: 'The scheduler will then pick the next batch.', good: 'The scheduler then picks the next batch.' },
  { title: 'Give one instruction per sentence', text: 'Use the imperative. Put the condition before the instruction.', bad: 'Reduce the learning rate and then restart if the loss rises.', good: 'If the loss rises, reduce the learning rate. Then restart the training.' },
  { title: 'Use one term with one meaning', text: 'Choose a word for each concept and keep it. Do not switch between synonyms for style.', bad: 'The model has 70B parameters. The weights take 140 GB. These coefficients are loaded once.', good: 'The model has 70B weights. The weights take 140 GB. The server loads the weights once.' },
  { title: 'Spell out abbreviations on first use', text: 'Write the full term, then the abbreviation in parentheses. After that, use the abbreviation.', bad: 'GQA reduces the KV cache.', good: 'Grouped-query attention (GQA) reduces the key-value (KV) cache.' },
  { title: 'Do not use idioms, slang or humour', text: 'They do not translate and they hide the meaning.', bad: 'It turns out the trick is to batch under the hood.', good: 'The server batches the requests internally.' },
  { title: 'Avoid long noun clusters', text: 'Use no more than three nouns in a row. Add a preposition to show the relation.', bad: 'attention key cache memory budget', good: 'the memory budget for the attention key cache' },
  { title: 'Use articles and simple connectors', text: 'Write "the" and "a". Prefer "and", "but", "because", "if", "then".', bad: 'Scheduler picks batch, however GPU idles.', good: 'The scheduler picks a batch, but the GPU is idle.' },
  { title: 'Prefer simple verb forms', text: 'Replace -ing forms with a verb when you can.', bad: 'Batching the requests is improving throughput.', good: 'Batch the requests. Throughput improves.' },
  { title: 'Use callouts for notes and risks', text: 'Put "Note:" before extra information. Put "Caution:" before a mistake that costs money or time.', bad: 'Also, be careful because the test set might leak into training.', good: 'Caution: Keep the test set out of the training data.' },
  { title: 'Use lists and tables', text: 'Use a numbered list for a procedure, one step per item. Use a bullet list for parallel facts. Use a table for numbers.', bad: 'First embed the query, then search, then rerank, then build the prompt.', good: '1. Embed the query. 2. Search the index. 3. Rerank the top 50. 4. Build the prompt.' },
  { title: 'Explain every symbol', text: 'After an equation, give the meaning of each symbol in one sentence.', bad: '$L = E + A/N^\\alpha + B/D^\\beta$.', good: '$L = E + A/N^\\alpha + B/D^\\beta$. $L$ is the loss, $N$ the number of weights, $D$ the number of training tokens. $E$, $A$, $B$, $\\alpha$ and $\\beta$ are fitted constants.' },
]

export function StyleGuide() {
  return (
    <>
      <header className="page-head">
        <h1>How this site is written: ASD-STE100</h1>
        <p className="lede">
          ASD-STE100 is the Simplified Technical English specification from the AeroSpace and Defence Industries Association of Europe. It
          was made for aircraft maintenance manuals. We use it for lessons because it makes technical text easy to read, easy to translate,
          and hard to misunderstand.
        </p>
      </header>
      <section className="lesson">
        <h2>The rules we apply</h2>
        <p>The specification has about 60 writing rules and a dictionary of approved words. These are the rules that matter most for lesson text. Every lesson on this site follows them. The <Link to="/labs/ste-checker">STE checker lab</Link> tests your own text against the ones a machine can check.</p>
        <ol className="rules">
          {rules.map((r) => (
            <li key={r.title}>
              <div>
                <strong>{r.title}.</strong> {r.text}
                <div className="example">
                  <span className="bad">{r.bad}</span>
                  <span className="good">{r.good}</span>
                </div>
              </div>
            </li>
          ))}
        </ol>
        <h2>Lesson structure</h2>
        <p>Every lesson uses the same seven sections, in the same order, so that you always know where you are.</p>
        <ol>
          <li><strong>What this lesson covers.</strong> Two to four sentences.</li>
          <li><strong>Why it matters.</strong> Where the concept shows up in real systems.</li>
          <li><strong>The idea with an example.</strong> A worked example with real numbers, step by step.</li>
          <li><strong>How it works.</strong> The mechanism, the equation, and a procedure you can do by hand.</li>
          <li><strong>Common mistakes.</strong> Each one with a fix.</li>
          <li><strong>Check your understanding.</strong> Three questions with one-line answers.</li>
          <li><strong>Go further.</strong> The free videos, papers and documents in the sidebar.</li>
        </ol>
        <h2>Words we replace</h2>
        <p>A short list of common unapproved words and the approved alternative. The full STE dictionary has about 900 approved words and lists the unapproved ones with their replacements.</p>
        <table>
          <thead><tr><th>Do not write</th><th>Write</th></tr></thead>
          <tbody>{Object.entries(unapproved).map(([bad, good]) => <tr key={bad}><td>{bad}</td><td>{good}</td></tr>)}</tbody>
        </table>
        <h2>Where to read the specification</h2>
        <p>The specification is free. Request it from the ASD-STE100 site at <a href="https://www.asd-ste100.org/" target="_blank" rel="noreferrer">asd-ste100.org</a>. The site also publishes the dictionary changes for each issue.</p>
      </section>
    </>
  )
}
