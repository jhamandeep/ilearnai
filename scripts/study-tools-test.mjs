// Interaction checks in a simulated DOM; no browser or external embeds are loaded.
import assert from 'node:assert/strict'
import { Window } from 'happy-dom'
import { createServer } from 'vite'
import { createElement, act } from 'react'
import { StaticRouter } from 'react-router-dom'

const window = new Window({ url: 'http://localhost/', settings: { disableIframePageLoading: true, disableJavaScriptFileLoading: true, enableJavaScriptEvaluation: false } })
for (const name of ['window', 'document', 'HTMLElement', 'Node', 'Event', 'MouseEvent', 'KeyboardEvent', 'localStorage']) globalThis[name] = name === 'window' ? window : name === 'document' ? window.document : window[name]
globalThis.IS_REACT_ACT_ENVIRONMENT = true
const { createRoot } = await import('react-dom/client')
const vite = await createServer({ cacheDir: 'node_modules/.vite-study-tools-test', server: { middlewareMode: true, hmr: false }, appType: 'custom', logLevel: 'error' })
const container = document.createElement('div'); document.body.append(container)
const root = createRoot(container)
const oldFetch = globalThis.fetch
try {
  const { StudyTools } = await vite.ssrLoadModule('/src/components/StudyTools.tsx')
  const { AuthContext } = await vite.ssrLoadModule('/src/lib/auth.tsx')
  const { track } = await vite.ssrLoadModule('/src/data/tracks/complete-ai.ts')
  const lessons = track.modules[0].lessons
  let user = null, index = 0
  const route = () => `/courses/${track.slug}/${track.modules[0].slug}/${lessons[index].slug}`
  const render = () => act(() => root.render(createElement(StaticRouter, { location: route() }, createElement(AuthContext.Provider, { value: { preview: true, user, loading: false, syncStatus: 'saved', serviceError: '' } }, createElement(StudyTools, { lesson: lessons[index], route: route(), key: `${route()}/${user?.id ?? 'guest'}` })))))
  const click = element => act(() => { assert.ok(element, 'Missing control'); element.click() })
  const tab = name => [...container.querySelectorAll('[role="tab"]')].find(button => button.textContent === name)
  const button = text => [...container.querySelectorAll('button')].find(button => button.textContent.includes(text))
  const storage = () => Object.fromEntries(Array.from({ length: localStorage.length }, (_, i) => { const key = localStorage.key(i); return [key, localStorage.getItem(key)] }))
  await render()
  assert.ok(container.textContent.includes(lessons[0].summary))
  assert.equal(tab('Summary').tabIndex, 0)
  await act(async () => {
    tab('Summary').dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    await vite.ssrLoadModule('/src/components/StudyLibrary.tsx')
  })
  assert.equal(tab('Resources').getAttribute('aria-selected'), 'true')
  assert.equal(document.activeElement, tab('Resources'))
  assert.equal(tab('Summary').tabIndex, -1)
  await click(tab('Flashcards'))
  assert.equal(button('I remembered this').disabled, true)
  const beforeCards = storage()
  const firstCard = container.querySelector('.study-flashcard').textContent
  await click(container.querySelector('.study-flashcard'))
  assert.equal(container.querySelector('.study-flashcard').getAttribute('aria-pressed'), 'true')
  assert.notEqual(container.querySelector('.study-flashcard').textContent, firstCard)
  await click(button('I remembered this'))
  assert.match(container.querySelector('.study-card-meta').textContent, /Card 2.*1 remembered/)
  assert.equal(container.querySelector('.study-flashcard').getAttribute('aria-pressed'), 'false')
  assert.deepEqual(storage(), beforeCards, 'Recall practice must not mark course activities complete')

  await click(tab('Notes'))
  const editNote = async value => {
    const textarea = container.querySelector('textarea')
    await act(() => { Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set.call(textarea, value); textarea.dispatchEvent(new window.Event('input', { bubbles: true })) })
  }
  const guestKey = `ilearnai:note:guest:${route()}`
  await editNote('Apply rules only when the required facts are present.')
  assert.equal(localStorage.getItem(guestKey), 'Apply rules only when the required facts are present.')
  assert.match(container.querySelector('[role="status"]').textContent, /Saved/)
  index = 1; await render(); await click(tab('Notes'))
  assert.equal(container.querySelector('textarea').value, '', 'Different lessons need separate notes')
  await editNote('A second lesson note.')
  index = 0; await render(); await click(tab('Notes'))
  assert.equal(container.querySelector('textarea').value, localStorage.getItem(guestKey), 'Returning restores the saved note')
  user = { id: 'other-learner', name: 'Another learner' }; await render(); await click(tab('Notes'))
  assert.equal(container.querySelector('textarea').value, '', 'Account notes must not expose guest notes')
  user = null; await render(); await click(tab('Notes'))
  const realStorage = globalThis.localStorage
  try {
    globalThis.localStorage = { getItem: () => null, setItem: () => { throw new Error('Storage unavailable') } }
    await editNote('Still editable without storage.')
    assert.match(container.querySelector('[role="status"]').textContent, /Storage is unavailable/)
    assert.equal(container.querySelector('textarea').value, 'Still editable without storage.')
    assert.equal(button('Download notes').disabled, false)
  } finally { globalThis.localStorage = realStorage }

  globalThis.fetch = () => { throw new Error('Static Ask must not make a network request') }
  await click(tab('Ask'))
  assert.match(container.textContent, /no live AI model is connected/)
  await click(button('Where can I practise?'))
  assert.ok(container.querySelector('.study-answer a[href="/code"]'), 'Coding help must link to the local workspace')
  await click(container.querySelector('.study-prompts button'))
  assert.ok(container.querySelector('.study-answer p').textContent.length > 30)
  await act(() => tab('Ask').dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Home', bubbles: true })))
  assert.equal(document.activeElement, tab('Summary'))
  assert.equal(container.querySelector('[role="tabpanel"]').getAttribute('aria-labelledby'), tab('Summary').id)
  console.log('PASS: study tabs and keyboard focus, flashcard reveal/next without progress writes, notes persistence and lesson/account isolation, storage failure recovery, and static Ask without a network request. Browser appearance not tested.')
} finally {
  globalThis.fetch = oldFetch
  await act(() => root.unmount()); await vite.close(); await window.happyDOM.close()
  delete globalThis.IS_REACT_ACT_ENVIRONMENT
}
