import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { answerSiteQuestion, type HelpAnswer } from '../lib/siteHelp'
import { findLesson } from '../data/tracks'
import { useAuth } from '../lib/auth'

export default function AskMeConversation({ onNavigate }: { onNavigate: () => void }) {
  const { pathname } = useLocation()
  const { preview, user } = useAuth()
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<{ question: string; answer: HelpAnswer }[]>([])
  const messages = useRef<HTMLDivElement>(null)
  const field = useRef<HTMLInputElement>(null)
  const segments = pathname.split('/')
  const current = segments[1] === 'courses' && segments.length >= 5 ? findLesson(segments[2], segments[3], segments[4]) : undefined
  useEffect(() => { field.current?.focus() }, [])
  useEffect(() => {
    const list = messages.current, last = list?.lastElementChild
    if (list && last) list.scrollTo({ top: list.scrollTop + last.getBoundingClientRect().top - list.getBoundingClientRect().top - 16, behavior: 'instant' })
  }, [history])
  function ask(question: string) {
    const value = question.trim().slice(0, 500)
    if (!value) return
    const answer: HelpAnswer = current && /^(explain this lesson|what am i learning)[?.!]*$/i.test(value)
      ? { kind: 'topic', title: current.lesson.title, text: current.lesson.summary, links: [{ title: 'Explore this lesson', to: segments.slice(0, 5).join('/') }, { title: 'Course contents', to: `/courses/${current.track.slug}` }] }
      : answerSiteQuestion(value, { preview, signedIn: !!user })
    setHistory(previous => [...previous.slice(-11), { question: value, answer }]); setInput(''); field.current?.focus()
  }
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); ask(input) }
  return <>
    <div className="askme-messages" ref={messages} role="log" aria-label="Ask me conversation" aria-live="polite" aria-relevant="additions">
      {!history.length && <div className="askme-welcome"><p className="eyebrow">Find your next step</p><h3>What would you like to explore?</h3><p>Find a course, understand an AI term, choose a certification, or get help using this site.</p><div className="askme-suggestions">{[...(current ? ['Explain this lesson'] : []), 'Choose a certification', 'What computer do I need?', 'How can AI help in my work?', 'How is my progress saved?'].map(question => <button type="button" onClick={() => ask(question)} key={question}>{question}<span aria-hidden="true">↗</span></button>)}</div></div>}
      {history.map(({ question, answer }, i) => <div className="askme-exchange" key={i}><p className="askme-question"><span className="sr-only">You: </span>{question}</p><article className="askme-answer"><small>From the ilearnai site guide</small><h3>{answer.title}</h3><p>{answer.text}</p><div>{answer.links.map(link => <Link key={link.to} to={link.to} onClick={onNavigate}>{link.title} <span aria-hidden="true">→</span></Link>)}</div></article></div>)}
    </div>
    {history.length > 0 && <button type="button" className="askme-clear" onClick={() => { setHistory([]); field.current?.focus() }}>Clear conversation</button>}
    <form className="askme-form" onSubmit={submit}><label className="sr-only" htmlFor="askme-input">Ask me a question</label><input ref={field} id="askme-input" autoComplete="off" maxLength={500} value={input} onChange={e => setInput(e.target.value)} placeholder="Ask about a course or AI…" /><button type="submit" disabled={!input.trim()} aria-label="Send question">↑</button></form>
    <p className="askme-footnote">Built-in answers. No generative AI connection. Questions stay in this page.</p>
  </>
}
