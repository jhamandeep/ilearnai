import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

const scenes = [
  { label: 'Start with an input', text: 'Give the model some data, such as a question or a photo.', value: 'A question', icon: '01' },
  { label: 'Let the model work', text: 'The model uses patterns it learned from examples.', value: 'Learned patterns', icon: '02' },
  { label: 'Explore the output', text: 'The model produces a result. Check it before you use it.', value: 'An answer', icon: '03' },
]

export function ConceptPreview() {
  const host = useRef<HTMLElement>(null)
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [visible, setVisible] = useState(false)
  const [foreground, setForeground] = useState(true)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.25 })
    if (host.current) observer.observe(host.current)
    const visibility = () => setForeground(!document.hidden)
    visibility()
    document.addEventListener('visibilitychange', visibility)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', visibility) }
  }, [])
  useEffect(() => {
    if (!playing || !visible || !foreground) return
    const timer = window.setInterval(() => setStep((s) => (s + 1) % scenes.length), 2200)
    return () => window.clearInterval(timer)
  }, [playing, visible, foreground])
  return (
    <figure className={`concept-preview ${playing && visible && foreground ? 'is-playing' : ''}`} ref={host}>
      <figcaption><span className="eyebrow">See the idea in motion</span><span className="concept-count">0{step + 1} <span>/ 03</span></span></figcaption>
      <div className="concept-canvas">
        <div className="concept-grid" aria-hidden="true" />
        <div className="concept-orbit" aria-hidden="true"><span /><span /><span /></div>
        <div className="concept-flow" aria-label="Input passes through a model to produce an output">
          {['Input', 'Model', 'Output'].map((label, i) => (
            <div key={label} className={`concept-part ${step === i ? 'is-active' : ''}`}>
              <div className="concept-node"><span className="concept-node-number">{scenes[i].icon}</span><strong>{label}</strong><span className="concept-value">{scenes[i].value}</span></div>
              {i < 2 && <span className={`concept-connector ${step > i ? 'is-past' : ''}`} aria-hidden="true"><i />→</span>}
            </div>
          ))}
        </div>
      </div>
      <div className="concept-narration" aria-live={playing ? 'off' : 'polite'}><span className="concept-step">0{step + 1}</span><div><strong>{scenes[step].label}</strong><p>{scenes[step].text}</p></div></div>
      <div className="concept-controls">
        <button type="button" className="btn btn-sm" onClick={() => setPlaying((p) => !p)} aria-pressed={playing}><span aria-hidden="true">{playing ? 'Ⅱ' : '▷'}</span> {playing ? 'Pause' : 'Play'}</button>
        <div className="concept-progress" aria-label="Animation scenes">{scenes.map((scene, i) => <button type="button" key={scene.label} className={step === i ? 'active' : ''} onClick={() => { setStep(i); setPlaying(false) }} aria-label={`Scene ${i + 1}: ${scene.label}`} aria-current={step === i ? 'step' : undefined}><span /></button>)}</div>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setStep((s) => (s + 1) % scenes.length); setPlaying(false) }}>Next <span aria-hidden="true">→</span></button>
      </div>
      <Link className="concept-link" to="/courses/ai-foundations">Explore AI Foundations <span aria-hidden="true">↗</span></Link>
    </figure>
  )
}
