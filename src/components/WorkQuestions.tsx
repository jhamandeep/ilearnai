import { useState } from 'react'
import { workQuestion } from '../data/work/questions'
import type { WorkCase } from '../data/work/types'

export function WorkQuestions({ caseKey, item }: { caseKey: string; item: WorkCase }) {
  const question = workQuestion(caseKey)
  const [choice, setChoice] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  if (!question) return null
  return <section className="work-questions" id="questions" data-work-question={caseKey}>
    <header><p className="eyebrow">Make the decision yourself</p><h2>What would you do?</h2><p>Use the example above. Choose an answer to see the reasoning.</p></header>
    <fieldset><legend>{question.prompt}</legend>{question.options.map((option, index) => <label key={option} className={choice === index ? 'selected' : ''}><input type="radio" name={`decision-${caseKey}`} checked={choice === index} onChange={() => { setChoice(index); setChecked(false) }} /><span>{option}</span></label>)}</fieldset>
    <button type="button" className="btn btn-primary btn-sm" disabled={choice === null} onClick={() => setChecked(true)}>Check my answer</button>
    {checked && <div className="work-question-feedback" role="status" data-correct={choice === question.correct}><strong>{choice === question.correct ? 'That’s the supported decision.' : 'Revisit the evidence.'}</strong><p>{choice !== question.correct && question.options[question.correct]} {question.explanation}</p><a href="#walkthrough">Review the walkthrough ↑</a></div>}
    <div className="work-answer-grid"><article><h3>How could we start?</h3><p>{item.pilot}</p></article><article><h3>How would we know it helped?</h3><p>{item.metric}</p></article></div>
  </section>
}
