// DOM interaction checks only. External frames and scripts never load here.
import assert from 'node:assert/strict'
import { Window } from 'happy-dom'
import { createServer } from 'vite'
import { createElement, act } from 'react'

const window = new Window({ url: 'http://localhost/', settings: { disableIframePageLoading: true, disableCSSFileLoading: true, disableJavaScriptFileLoading: true, enableJavaScriptEvaluation: false } })
for (const name of ['window', 'document', 'HTMLElement', 'Node', 'Event', 'MouseEvent']) globalThis[name] = name === 'window' ? window : name === 'document' ? window.document : window[name]
globalThis.IS_REACT_ACT_ENVIRONMENT = true
const { createRoot } = await import('react-dom/client')
const vite = await createServer({ cacheDir: 'node_modules/.vite-video-interaction-check', server: { middlewareMode: true, hmr: false }, appType: 'custom', logLevel: 'error' })
const container = document.createElement('div')
document.body.append(container)
const root = createRoot(container)
try {
  const { ChapterVideos } = await vite.ssrLoadModule('/src/components/ChapterVideos.tsx')
  const { chapterVideoGuides, chapterVideo } = await vite.ssrLoadModule('/src/data/learning/chapterVideos.ts')
  const render = props => act(() => root.render(createElement(ChapterVideos, props)))
  const click = element => act(() => { assert.ok(element, 'Missing clickable control'); element.click() })
  let played = 0, previews = 0
  for (const [key, guide] of Object.entries(chapterVideoGuides)) {
    const [track, module] = key.split('/')
    await render({ track, module })
    assert.equal(container.querySelectorAll('iframe').length, 0, `${key}: player leaked across chapters`)
    for (const item of guide.picks) {
      const video = chapterVideo(item.ref)
      const card = container.querySelector(`[data-video-ref="${item.ref}"]`)
      assert.ok(card.querySelector('.video-thumbnail'), `${key}: missing preview`)
      const preview = card.querySelector('.thumb-btn')
      assert.equal(preview.tagName, 'BUTTON', `${key}: preview navigates to another page`)
      await click(preview)
      const frame = container.querySelector('iframe')
      if (video.id && video.embeddable !== false) {
        assert.equal(container.querySelectorAll('iframe').length, 1, `${key}: more than one player`)
        assert.equal(frame.closest('[data-video-ref]').getAttribute('data-video-ref'), item.ref, `${key}: video moved to another card`)
        const url = new URL(frame.src)
        assert.equal(url.pathname, `/embed/${video.id}`, `${key}: preview played a different recording`)
        assert.equal(url.searchParams.has('list'), false, 'A single recording must not start a playlist')
        assert.equal(url.searchParams.has('playlist'), false, 'Do not queue another recording automatically')
        assert.equal(frame.title, video.title)
        assert.ok(card.querySelector('h3 button'), 'The title must not navigate away')
        played++
      } else {
        assert.equal(frame, null, `${key}: unavailable preview must stop the previous player`)
        assert.ok(card.querySelector('[role="status"]'), `${key}: explain external playback`)
      }
      assert.equal(window.location.href, 'http://localhost/', 'A preview changed the page URL')
      previews++
    }
  }
  const props = { track: 'ai-foundations', module: 'what-ai-is' }
  await render(props)
  await click(container.querySelector('h3 button'))
  assert.ok(container.querySelector('iframe'), 'A video title should play its recording here')
  await click([...container.querySelectorAll('button')].find(button => button.textContent === 'Close video'))
  assert.equal(container.querySelector('iframe'), null)
  await click(container.querySelector('.thumb-btn'))
  await render({ track: 'start-here', module: 'first-python' })
  await render(props)
  assert.equal(container.querySelector('iframe'), null, 'Returning to a chapter must not restart an old video')
  await render({ ...props, compact: true })
  const details = container.querySelector('details')
  await act(() => { details.open = true; details.dispatchEvent(new window.Event('toggle')) })
  await click(container.querySelector('.thumb-btn'))
  assert.ok(container.querySelector('iframe'))
  await act(() => { details.open = false; details.dispatchEvent(new window.Event('toggle')) })
  assert.equal(container.querySelector('iframe'), null, 'Collapsing a sequence must stop hidden playback')
  console.log(`PASS: ${previews} previews across ${Object.keys(chapterVideoGuides).length} chapters; ${played} inline selections match their video IDs; one player at a time; titles, close, chapter navigation and collapse behave correctly. External playback was not tested.`)
} finally {
  await act(() => root.unmount())
  await vite.close()
  await window.happyDOM.close()
  delete globalThis.IS_REACT_ACT_ENVIRONMENT
}
