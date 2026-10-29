import { lazy, Suspense, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { useLocation } from 'react-router-dom'
import { BrandMark } from './Brand'

const Conversation = lazy(() => import('./AskMeConversation'))

export function AskMe() {
  const { pathname } = useLocation()
  const dialog = useRef<HTMLDialogElement>(null)
  const launcher = useRef<HTMLButtonElement>(null)
  const [opened, setOpened] = useState(false)
  const [loaded, setLoaded] = useState(false)
  useEffect(() => { if (dialog.current?.open) dialog.current.close() }, [pathname])
  function keepFocus(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== 'Tab') return
    const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]')).filter(element => element.getClientRects().length > 0)
    const first = controls[0], last = controls.at(-1)
    if (first && last && (event.shiftKey ? document.activeElement === first : document.activeElement === last)) {
      event.preventDefault(); (event.shiftKey ? last : first).focus()
    }
  }
  function close() { dialog.current?.close(); setOpened(false); launcher.current?.focus() }
  return <div className="askme" data-surface={['/', '/login', '/signup'].includes(pathname) ? 'theme' : 'learning'} hidden={pathname === '/ask'}>
    <button ref={launcher} type="button" className="askme-launcher" aria-label="Open Ask me" aria-haspopup="dialog" aria-expanded={opened} aria-controls="askme-dialog" onClick={() => { setLoaded(true); dialog.current?.showModal(); dialog.current?.querySelector('input')?.focus(); setOpened(true) }}><BrandMark /><span>Ask me</span></button>
    <dialog ref={dialog} id="askme-dialog" className="askme-dialog" aria-labelledby="askme-title" onKeyDown={keepFocus} onClose={() => { setOpened(false); launcher.current?.focus() }} onClick={e => { if (e.target === dialog.current) { const bounds = dialog.current.getBoundingClientRect(); if (e.clientX < bounds.left || e.clientX > bounds.right || e.clientY < bounds.top || e.clientY > bounds.bottom) close() } }}>
      <header className="askme-heading"><BrandMark /><div><h2 id="askme-title">Ask me</h2><p>Your ilearnai guide</p></div><button type="button" aria-label="Close Ask me" onClick={close}>✕</button></header>
      {loaded && <Suspense fallback={<p className="askme-loading" role="status">Opening your site guide…</p>}><Conversation onNavigate={close} /></Suspense>}
    </dialog>
  </div>
}
