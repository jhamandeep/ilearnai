import { lazy, Suspense, useId, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import type { Lesson } from '../data/types'
import { lessonTerms, firstSectionParagraph } from '../lib/lessonGuidance'
import { answerSiteQuestion } from '../lib/siteHelp'
import { quizzesIn } from '../lib/quiz'
import { useAuth } from '../lib/auth'
import { Markdown } from './Markdown'
import type { LibraryTab } from './StudyLibrary'

const StudyLibrary = lazy(() => import('./StudyLibrary'))
const tabs = ['Summary', 'Resources', 'Papers', 'Videos', 'Tools', 'Flashcards', 'Notes', 'Ask'] as const
type Tab = typeof tabs[number]
function readNote(key: string) { try { return localStorage.getItem(key) ?? '' } catch { return '' } }

export function StudyTools({ lesson, route }: { lesson: Lesson; route: string }) {
  const { user, preview } = useAuth()
  const noteKey = `ilearnai:note:${user?.id ?? 'guest'}:${route}`
  const [tab, setTab] = useState<Tab>('Summary')
  const [note, setNote] = useState(() => readNote(noteKey))
  const [saveStatus, setSaveStatus] = useState('Notes stay in this browser.')
  const [card, setCard] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [remembered, setRemembered] = useState<number[]>([])
  const [query, setQuery] = useState('')
  const [asked, setAsked] = useState('')
  const id = useId()
  const terms = lessonTerms(lesson)
  const questions = quizzesIn(lesson.body)
  const flashcards = [...terms.map(term => ({ front: `What is ${term.term}?`, back: term.short })), ...questions.slice(0, 4).map(question => ({ front: question.text, back: `${question.options[question.answer]} ${question.why}` }))]
  const current = flashcards[card]
  const answer = asked ? answerSiteQuestion(asked, { preview, signedIn: !!user }) : null
  const example = firstSectionParagraph(lesson.body, 'The idea with an example')
  const application = firstSectionParagraph(lesson.body, 'Why it matters')
  function move(delta: number) { setCard(value => (value + delta + flashcards.length) % flashcards.length); setFlipped(false) }
  function save(value: string) {
    setNote(value)
    try { localStorage.setItem(noteKey, value); setSaveStatus('Saved in this browser.') } catch { setSaveStatus('Storage is unavailable. Download your notes to keep them.') }
  }
  function download() {
    const url = URL.createObjectURL(new Blob([`${lesson.title}\n${window.location.origin}${route}\n\n${note}`], { type: 'text/plain;charset=utf-8' }))
    const link = document.createElement('a'); link.href = url; link.download = `${lesson.slug}-notes.txt`; document.body.append(link); link.click(); link.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  function submit(event: FormEvent) { event.preventDefault(); setAsked(query.trim()) }
  return <aside className="study-tools" id="lesson-study-tools" aria-label="Lesson study tools" tabIndex={-1}>
    <div className="study-tools-heading"><span className="study-spark" aria-hidden="true">✧</span><div><strong>Your study space</strong><small>Understand it. Explore it. Make it yours.</small></div></div>
    <div className="study-tool-tabs" role="tablist" aria-label="Study tools">{tabs.map((name, index) => <button key={name} type="button" id={`${id}-tab-${index}`} role="tab" aria-selected={tab === name} aria-controls={`${id}-panel`} tabIndex={tab === name ? 0 : -1} onKeyDown={event => { if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) { event.preventDefault(); const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length; setTab(tabs[next]); document.getElementById(`${id}-tab-${next}`)?.focus() } }} onClick={() => setTab(name)}>{name}</button>)}</div>
    <div key={tab} className="study-tool-panel" id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${tabs.indexOf(tab)}`} tabIndex={0}>
      {(['Resources', 'Papers', 'Videos', 'Tools'] as string[]).includes(tab) && <Suspense fallback={<p role="status">Opening your study library…</p>}><StudyLibrary lesson={lesson} route={route} tab={tab as LibraryTab} /></Suspense>}
      {tab === 'Summary' && <><p className="study-overline">The idea in one place</p><h2>{lesson.title}</h2><p>{lesson.summary}</p><h3>By the end, you can</h3><ul className="study-outcomes">{lesson.objectives.map(objective => <li key={objective}>{objective}</li>)}</ul>{example && <div className="study-example"><span>Keep this example in mind</span><Markdown>{example}</Markdown></div>}<details className="study-application"><summary>Where this becomes useful</summary><Markdown>{application}</Markdown></details><Link className="study-inline-link" to={`${route}/reading`}>Read the full explanation →</Link></>}
      {tab === 'Flashcards' && <><p className="study-overline">Recall before you reveal</p><h2>A little practice goes a long way.</h2>{current ? <><div className="study-card-meta"><span>Card {card + 1} of {flashcards.length}</span><span>{remembered.length} remembered</span></div><button className={`study-flashcard ${flipped ? 'is-flipped' : ''}`} type="button" aria-pressed={flipped} aria-label={flipped ? 'Answer shown. Show question' : 'Reveal the answer'} onClick={() => setFlipped(value => !value)}><small>{flipped ? 'The answer' : 'Think it through'}</small><strong>{flipped ? current.back : current.front}</strong><span>{flipped ? 'Show question ↶' : 'Reveal answer ↗'}</span></button><div className="study-card-controls"><button type="button" aria-label="Previous flashcard" onClick={() => move(-1)}>←</button><button type="button" disabled={!flipped} onClick={() => { setRemembered(value => value.includes(card) ? value : [...value, card]); move(1) }}>I remembered this</button><button type="button" aria-label="Next flashcard" onClick={() => move(1)}>→</button></div><p className="study-small">Practice only. These cards use the lesson’s definitions and quiz explanations; they do not mark activities complete.</p></> : <p>This lesson has no indexed cards yet. Use its objectives to test your recall.</p>}</>}
      {tab === 'Notes' && <><p className="study-overline">Make the idea yours</p><h2>What will you use?</h2><label htmlFor={`${id}-note`}>Your notes for this lesson</label><textarea id={`${id}-note`} value={note} maxLength={10000} onChange={event => save(event.target.value)} placeholder="The idea in my words…\n\nAn example from my work…\n\nOne thing I want to try…" /><div className="study-note-status"><span role="status">{saveStatus}</span><small>{note.length}/10,000</small></div><button className="btn btn-ghost btn-sm" type="button" disabled={!note.trim()} onClick={download}>Download notes ↓</button><p className="study-small">Notes are kept on this device, separately from your course progress. Clearing site data removes them.</p></>}
      {tab === 'Ask' && <><p className="study-overline">A little help, right here</p><h2>Find an answer or a next step.</h2><p className="study-small">Built-in course guidance. Answers come from this portal’s content; no live AI model is connected.</p><div className="study-prompts">{terms.slice(0, 2).map(term => <button type="button" key={term.slug} onClick={() => { const question = `What is ${term.term}?`; setQuery(question); setAsked(question) }}>{term.term} <span>↗</span></button>)}<button type="button" onClick={() => { setQuery('Where can I run Python?'); setAsked('Where can I run Python?') }}>Where can I practise? <span>↗</span></button></div><form onSubmit={submit}><label htmlFor={`${id}-ask`}>Ask about a topic or navigation</label><div className="study-ask-input"><input id={`${id}-ask`} value={query} onChange={event => setQuery(event.target.value)} maxLength={500} placeholder="Try a term from this lesson" /><button type="submit" disabled={!query.trim()} aria-label="Find an answer">↑</button></div></form>{answer && <div className="study-answer" role="status"><h3>{answer.title}</h3><p>{answer.text}</p>{answer.links.map(link => <Link key={link.to} to={link.to}>{link.title} →</Link>)}</div>}</>}
    </div>
    <Link className="study-map-link" to={`/knowledge-graph?node=${encodeURIComponent(`lesson:${route.replace(/^\/courses\//, '')}`)}`}><span aria-hidden="true">◎</span><span><strong>Connect the ideas</strong><small>See this lesson on the knowledge map →</small></span></Link>
  </aside>
}
