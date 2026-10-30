import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import type { AtlasData, AtlasItem } from './knowledgeAtlasModel'
import type { SpatialGraphHandle } from './spatialGraphScene'

export type AtlasState = { playing: boolean; motion: boolean; visible: boolean }
export type AtlasScene = SpatialGraphHandle & { data: (data: AtlasData) => void; update: (state: AtlasState) => void; dispose: () => void }
type Callbacks = { select: (id: string) => void; interact: () => void; zoom: (value: number) => void; unavailable: () => void }
type Label = { item: AtlasItem; button: HTMLButtonElement; position: THREE.Vector3 }
const palette = ['#5e7baa', '#a0659b', '#8060c8', '#c18569', '#637ba9', '#9e6d9a'].map(color => new THREE.Color(color))
const random = (index: number) => { const value = Math.sin(index * 127.1 + 311.7) * 43758.5453; return value - Math.floor(value) }
const empty: AtlasData = { key: 'overview', root: null, items: [], totalNodes: 0, totalEdges: 0, nodes: [], edges: [], groups: [], areaId: null, selected: null }

/** Each star is a real catalogue entry; each filament is a real graph edge.
 * Grouping and camera movement reveal detail without inventing relationships. */
export function createKnowledgeAtlas(host: HTMLElement, labelLayer: HTMLElement, initial: AtlasState, callbacks: Callbacks): AtlasScene | null {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('webgl2', { alpha: true, antialias: true, powerPreference: 'low-power' })
  if (!context) return null
  const renderer = new THREE.WebGLRenderer({ canvas, context, alpha: true, antialias: true })
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.7)); renderer.setClearColor(0xffffff, 0)
  canvas.tabIndex = 0; canvas.setAttribute('role', 'group'); canvas.setAttribute('aria-label', 'Interactive 3D knowledge constellation')
  host.append(canvas)
  const scene = new THREE.Scene(), world = new THREE.Group(), camera = new THREE.OrthographicCamera(-8, 8, 5, -5, .1, 100)
  camera.position.set(0, 0, 30); scene.add(world)
  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = false; controls.minZoom = .55; controls.maxZoom = 3; controls.minPolarAngle = .55; controls.maxPolarAngle = Math.PI - .55
  const wheel = (event: WheelEvent) => { if (!event.ctrlKey && !event.metaKey) event.stopImmediatePropagation() }
  canvas.addEventListener('wheel', wheel, { capture: true, passive: true })
  let state = initial, model = empty, width = 1, height = 1, compact = false, disposed = false, lost = false, rendering = false
  let frame = 0, frames = 0, last = 0, elapsed = 0, areaIndex = -1, currentHeight = 10, targetHeight = 10, navigating = false, zoomValue = 100
  let pointerX = 0, pointerY = 0, activeX = 0, activeY = 0
  let positions = new Float32Array(0), targets = new Float32Array(0), groupIndices: number[] = [], links: [number, number][] = [], lookup = new Map<string, number>()
  let linePositions = new Float32Array(0), pulsePositions = new Float32Array(0), pulseAlpha = new Float32Array(0)
  let centres: THREE.Vector3[] = [], labels: Label[] = []
  const centreTarget = new THREE.Vector3(), cameraTarget = new THREE.Vector3(0, 0, 30), projected = new THREE.Vector3()
  const vertex = `attribute float aSize; attribute float aAlpha; varying vec3 vColor; varying float vAlpha; uniform float uTime; uniform float uDpr;
    void main(){vColor=color;vAlpha=aAlpha;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);float twinkle=.9+.1*sin(uTime*.65+position.x*4.+position.y*7.);gl_PointSize=aSize*uDpr*twinkle;}`
  const fragment = `varying vec3 vColor; varying float vAlpha;void main(){float r=length(gl_PointCoord-.5)*2.;if(r>1.)discard;float core=1.-smoothstep(.16,.38,r);float halo=pow(1.-r,3.)*.35;gl_FragColor=vec4(vColor,(core+halo)*vAlpha);}`
  const material = new THREE.ShaderMaterial({ vertexShader: vertex, fragmentShader: fragment, transparent: true, depthWrite: false, vertexColors: true, uniforms: { uTime: { value: 0 }, uDpr: { value: renderer.getPixelRatio() } } })
  const lineMaterial = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, vertexColors: true,
    vertexShader: 'attribute float aAlpha; varying float vAlpha; varying vec3 vColor; void main(){vAlpha=aAlpha;vColor=color;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader: 'varying float vAlpha; varying vec3 vColor;void main(){gl_FragColor=vec4(vColor,vAlpha);}',
  })
  const stars = new THREE.Points(new THREE.BufferGeometry(), material), threads = new THREE.LineSegments(new THREE.BufferGeometry(), lineMaterial), pulses = new THREE.Points(new THREE.BufferGeometry(), material)
  stars.frustumCulled = threads.frustumCulled = pulses.frustumCulled = false; world.add(stars, threads, pulses)
  const segments = 7
  const colorFor = (index: number) => palette[(model.groups[groupIndices[index]]?.shape ?? 0) % palette.length]
  const attribute = (geometry: THREE.BufferGeometry, name: string, values: Float32Array, size: number) => geometry.setAttribute(name, new THREE.BufferAttribute(values, size))

  function allocate() {
    lookup = new Map(model.nodes.map((node, index) => [node.id, index]))
    const membership = new Map(model.groups.flatMap((group, index) => group.members.map(node => [node.id, index] as const)))
    groupIndices = model.nodes.map(node => membership.get(node.id) ?? 0)
    links = model.edges.flatMap(edge => { const a = lookup.get(edge.source), b = lookup.get(edge.target); return a === undefined || b === undefined ? [] : [[a, b] as [number, number]] })
    positions = new Float32Array(model.nodes.length * 3); targets = new Float32Array(positions.length)
    stars.geometry.dispose(); stars.geometry = new THREE.BufferGeometry()
    attribute(stars.geometry, 'position', positions, 3); attribute(stars.geometry, 'color', new Float32Array(positions.length), 3)
    attribute(stars.geometry, 'aSize', new Float32Array(model.nodes.length), 1); attribute(stars.geometry, 'aAlpha', new Float32Array(model.nodes.length), 1)
    linePositions = new Float32Array(links.length * segments * 6)
    threads.geometry.dispose(); threads.geometry = new THREE.BufferGeometry()
    attribute(threads.geometry, 'position', linePositions, 3); attribute(threads.geometry, 'color', new Float32Array(linePositions.length), 3); attribute(threads.geometry, 'aAlpha', new Float32Array(linePositions.length / 3), 1)
    const count = Math.min(60, links.length)
    pulsePositions = new Float32Array(count * 3); pulseAlpha = new Float32Array(count)
    pulses.geometry.dispose(); pulses.geometry = new THREE.BufferGeometry()
    const pulseColors = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) colorFor(links[(i * 37) % links.length][0]).toArray(pulseColors, i * 3)
    attribute(pulses.geometry, 'position', pulsePositions, 3); attribute(pulses.geometry, 'color', pulseColors, 3)
    attribute(pulses.geometry, 'aSize', new Float32Array(count).fill(9), 1); attribute(pulses.geometry, 'aAlpha', pulseAlpha, 1)
  }
  function pointOnEdge(a: number, b: number, amount: number, output: Float32Array, offset: number) {
    for (let axis = 0; axis < 3; axis++) output[offset + axis] = positions[a * 3 + axis] + (positions[b * 3 + axis] - positions[a * 3 + axis]) * amount
    output[offset + 2] += Math.sin(amount * Math.PI) * .4
  }
  function updateLines() {
    links.forEach(([a, b], index) => { for (let j = 0; j < segments; j++) { const offset = (index * segments + j) * 6; pointOnEdge(a, b, j / segments, linePositions, offset); pointOnEdge(a, b, (j + 1) / segments, linePositions, offset + 3) } })
    if (threads.geometry.attributes.position) threads.geometry.attributes.position.needsUpdate = true
  }
  function emphasis() {
    const connected = new Set(model.edges.flatMap(edge => edge.source === model.selected ? [edge.target] : edge.target === model.selected ? [edge.source] : []))
    const alpha = stars.geometry.attributes.aAlpha, size = stars.geometry.attributes.aSize, color = stars.geometry.attributes.color
    model.nodes.forEach((node, index) => {
      const active = areaIndex < 0 || groupIndices[index] === areaIndex, important = node.id === model.selected || connected.has(node.id)
      alpha.setX(index, model.selected ? important ? 1 : .045 : active ? .78 : .025)
      size.setX(index, important ? 17 : node.kind === 'concept' ? 12 : 5 + random(index) * 6)
      const tint = colorFor(index); color.setXYZ(index, tint.r, tint.g, tint.b)
    })
    const lineAlpha = threads.geometry.attributes.aAlpha, lineColor = threads.geometry.attributes.color
    links.forEach(([a, b], index) => {
      const highlighted = model.nodes[a].id === model.selected || model.nodes[b].id === model.selected
      const active = areaIndex < 0 ? groupIndices[a] === groupIndices[b] : groupIndices[a] === areaIndex && groupIndices[b] === areaIndex
      const opacity = model.selected ? highlighted ? .55 : .006 : active ? .11 : .012, tint = colorFor(a)
      for (let j = 0; j < segments * 2; j++) { const at = index * segments * 2 + j; lineAlpha.setX(at, opacity); lineColor.setXYZ(at, tint.r, tint.g, tint.b) }
    })
    for (const attr of [alpha, size, color, lineAlpha, lineColor]) attr.needsUpdate = true
  }
  function arrange() {
    areaIndex = model.groups.findIndex(group => group.id === model.areaId)
    const column = 13.7 * width / height * .245
    const layout = compact ? [[-column,4.2],[column,4.2],[-column,0],[column,0],[-column,-4.2],[column,-4.2]] : [[-5,2],[-4.2,-1.9],[-.3,1.1],[4.4,2.1],[4.5,-2.2],[-.1,-2.6]]
    centres = model.groups.map((_, index) => {
      if (model.groups.length === 6) return new THREE.Vector3(...layout[index], 0)
      const columns = compact ? 2 : Math.min(3, model.groups.length), rows = Math.ceil(model.groups.length / columns)
      return new THREE.Vector3(((index % columns) - (columns - 1) / 2) * (compact ? column * 2 : 5), ((rows - 1) / 2 - Math.floor(index / columns)) * 3.5, 0)
    })
    model.groups.forEach((group, groupIndex) => group.members.forEach((node, k) => {
      const index = lookup.get(node.id)!, t = k / group.members.length, angle = t * Math.PI * 5.7 + group.shape * .65
      const radius = .4 + random(index + 24) * 1.4, spread = compact ? Math.min(1.6, 13.7 * width / height / 11) : 1
      targets[index * 3] = centres[groupIndex].x + (Math.sin(angle) * radius + (t - .5) * 1.8) * spread
      targets[index * 3 + 1] = centres[groupIndex].y + Math.cos(angle) * radius * .56 + (random(index + 10) - .5) * .7
      targets[index * 3 + 2] = (random(index + 9) - .5) * 2
    }))
    if (areaIndex >= 0) {
      const x = (compact ? 8.7 : 6.6) * width / height * (compact ? .25 : .31)
      const spots = compact ? [[-x,2.1],[x,2.1],[-x,0],[x,0],[-x,-2.1],[x,-2.1]] : [[-x,1.35],[0,1.7],[x,1.35],[-x,-1.35],[0,-1.7],[x,-1.35]]
      model.items.forEach((item, i) => { const at = lookup.get(item.id); if (at === undefined) return; targets[at * 3] = centres[areaIndex].x + spots[i][0]; targets[at * 3 + 1] = centres[areaIndex].y + spots[i][1]; targets[at * 3 + 2] = .3 })
      centreTarget.copy(centres[areaIndex]); targetHeight = compact ? 8.7 : 6.6
    } else { centreTarget.set(0, 0, 0); targetHeight = compact ? 13.7 : Math.max(8.8, 17 * height / width) }
    for (const label of labels) {
      const group = model.groups.findIndex(group => group.id === label.item.id), index = lookup.get(label.item.id)
      if (group >= 0) label.position.copy(centres[group]); else if (index !== undefined) label.position.fromArray(targets, index * 3)
    }
    emphasis(); fit()
  }
  function project() {
    camera.left = -currentHeight * width / height / 2; camera.right = -camera.left; camera.top = currentHeight / 2; camera.bottom = -camera.top
    camera.updateProjectionMatrix(); camera.updateMatrixWorld()
  }
  function placeLabels() {
    const occupied: { x: number; y: number; w: number; h: number }[] = []
    for (const label of labels) {
      const button = label.button; button.hidden = false
      button.style.maxWidth = `${width < 600 ? Math.min(158, (width - 46) / 2) : compact ? 230 : 250}px`
      projected.copy(label.position).project(camera)
      const w = button.offsetWidth, h = button.offsetHeight
      const x = Math.max(w / 2 + 8, Math.min(width - w / 2 - 8, (projected.x + 1) / 2 * width)) - w / 2
      const y = Math.max(12, Math.min(height - h - 14, (1 - projected.y) / 2 * height - h / 2))
      // Manual orbit/zoom can move labels together. Keep selected labels first,
      // then suppress collisions; all resources remain in the area library.
      const inBounds = Math.abs(projected.x) < 1.2 && Math.abs(projected.y) < 1.2
      const collision = occupied.some(box => x < box.x + box.w + 3 && x + w + 3 > box.x && y < box.y + box.h + 3 && y + h + 3 > box.y)
      button.hidden = !inBounds || collision
      if (!button.hidden) { button.style.transform = `translate3d(${x}px,${y}px,0)`; occupied.push({ x, y, w, h }) }
    }
  }
  function setLabels() {
    const focused = labelLayer.contains(document.activeElement) ? (document.activeElement as HTMLElement).dataset.spatialNode : undefined
    labelLayer.replaceChildren()
    labels = [...model.items].sort((a, b) => Number(b.id === model.selected) - Number(a.id === model.selected)).map(item => {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'atlas-node-label spatial-node-label'; button.dataset.spatialNode = item.id
      if (item.area) button.dataset.atlasArea = 'true'
      button.setAttribute('aria-label', item.area ? `Explore ${item.label}` : `${item.label}, ${item.subtitle.toLowerCase()}`); button.setAttribute('aria-pressed', String(item.id === model.selected)); button.title = item.label
      const beacon = document.createElement('i'); beacon.className = 'atlas-beacon'; beacon.setAttribute('aria-hidden', 'true')
      const title = document.createElement('span'); title.textContent = item.label
      const subtitle = document.createElement('small'); subtitle.textContent = item.subtitle
      button.append(beacon, title, subtitle); button.onclick = () => callbacks.select(item.id)
      labelLayer.append(button)
      return { item, button, position: new THREE.Vector3() }
    })
    labelLayer.dataset.compact = String(compact)
    if (focused) (labels.find(label => label.item.id === focused)?.button ?? host.closest('.knowledge-atlas')?.querySelector<HTMLButtonElement>('.atlas-navigation button'))?.focus({ preventScroll: true })
  }
  function stop() { cancelAnimationFrame(frame); frame = 0; last = 0 }
  function wake() { if (!frame && !disposed && !lost && state.visible && !document.hidden) frame = requestAnimationFrame(render) }
  function render(now: number) {
    frame = 0; if (disposed || lost || !state.visible || document.hidden) return
    rendering = true
    const dt = last ? Math.min((now - last) / 1000, .05) : 1 / 60; last = now
    const moving = state.playing && state.motion, amount = state.motion ? 1 - Math.exp(-dt * 7) : 1
    if (moving) elapsed += dt
    let changing = false
    for (let i = 0; i < positions.length; i++) { const delta = targets[i] - positions[i]; if (Math.abs(delta) > .002) changing = true; positions[i] += delta * amount }
    if (changing || frames < 2 || !state.motion) { stars.geometry.attributes.position.needsUpdate = true; updateLines() }
    if (navigating) {
      camera.position.lerp(cameraTarget, amount); controls.target.lerp(centreTarget, amount); currentHeight += (targetHeight - currentHeight) * amount
      navigating = Math.abs(currentHeight - targetHeight) > .002 || camera.position.distanceTo(cameraTarget) > .002 || controls.target.distanceTo(centreTarget) > .002
      if (!navigating) { currentHeight = targetHeight; camera.position.copy(cameraTarget); controls.target.copy(centreTarget) }
    }
    const previousX = activeX, previousY = activeY
    activeX += ((moving ? pointerX : 0) - activeX) * amount; activeY += ((moving ? pointerY : 0) - activeY) * amount
    world.rotation.y = Math.sin(elapsed * .12) * .025 + activeX * .07; world.rotation.x = Math.cos(elapsed * .1) * .018 + activeY * .035
    material.uniforms.uTime.value = elapsed
    for (let i = 0; i < pulseAlpha.length; i++) {
      const [a, b] = links[(i * 37) % links.length]
      pointOnEdge(a, b, (elapsed * .09 + random(i)) % 1, pulsePositions, i * 3)
      pulseAlpha[i] = moving ? areaIndex < 0 ? .55 : groupIndices[a] === areaIndex ? .8 : .025 : 0
    }
    pulses.geometry.attributes.position.needsUpdate = true; pulses.geometry.attributes.aAlpha.needsUpdate = true
    project(); controls.update(); renderer.render(scene, camera); placeLabels()
    host.dataset.frame = String(++frames); host.dataset.camera = [...camera.position.toArray(), camera.zoom, world.rotation.x, world.rotation.y].map(n => n.toFixed(4)).join(',')
    const nextZoom = Math.round(camera.zoom * 100)
    if (nextZoom !== zoomValue) { zoomValue = nextZoom; callbacks.zoom(nextZoom) }
    rendering = false
    if (moving || changing || navigating || Math.abs(previousX - activeX) > .0001 || Math.abs(previousY - activeY) > .0001) wake()
  }
  function fit() { cameraTarget.copy(centreTarget).add(new THREE.Vector3(0, 0, 30)); camera.zoom = 1; navigating = true; wake() }
  const interact = () => { navigating = false; callbacks.interact() }
  const change = () => { if (!rendering) wake() }
  const zoom = (factor: number) => { interact(); camera.zoom = THREE.MathUtils.clamp(camera.zoom * factor, controls.minZoom, controls.maxZoom); project(); wake() }
  const rotate = (x: number, y: number) => { interact(); controls.rotateLeft(x); controls.rotateUp(y); controls.update(); wake() }
  controls.addEventListener('start', interact); controls.addEventListener('change', change)
  const keydown = (event: KeyboardEvent) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', '+', '=', '-', 'Home'].includes(event.key)) return
    event.preventDefault(); callbacks.interact()
    if (event.key === 'Home') fit()
    else if (event.key === '+' || event.key === '=') zoom(1.35)
    else if (event.key === '-') zoom(1 / 1.35)
    else rotate(event.key === 'ArrowLeft' ? .15 : event.key === 'ArrowRight' ? -.15 : 0, event.key === 'ArrowUp' ? .12 : event.key === 'ArrowDown' ? -.12 : 0)
  }
  const move = (event: PointerEvent) => { if (event.pointerType === 'touch' || !state.playing) return; const bounds = host.getBoundingClientRect(); pointerX = (event.clientX - bounds.left) / bounds.width - .5; pointerY = (event.clientY - bounds.top) / bounds.height - .5; wake() }
  const leave = () => { pointerX = 0; pointerY = 0; wake() }
  const visibility = () => { if (document.hidden) stop(); else wake() }
  const contextLost = (event: Event) => { event.preventDefault(); if (disposed) return; lost = true; stop(); callbacks.unavailable() }
  const raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2(), pointers = new Set<number>()
  let press: { x: number; y: number; id: number } | null = null, multiple = false
  const down = (event: PointerEvent) => { pointers.add(event.pointerId); if (pointers.size > 1) multiple = true; if (event.button === 0) press = { x: event.clientX, y: event.clientY, id: event.pointerId } }
  const release = (event: PointerEvent) => {
    pointers.delete(event.pointerId)
    if (!multiple && press?.id === event.pointerId && Math.hypot(event.clientX - press.x, event.clientY - press.y) < 5) {
      const bounds = canvas.getBoundingClientRect(); pointer.set((event.clientX - bounds.left) / bounds.width * 2 - 1, 1 - (event.clientY - bounds.top) / bounds.height * 2)
      raycaster.params.Points.threshold = currentHeight / height / camera.zoom * 7; raycaster.setFromCamera(pointer, camera)
      const hit = raycaster.intersectObject(stars)[0], node = hit?.index === undefined ? undefined : model.nodes[hit.index]
      if (node) callbacks.select(node.id)
    }
    press = null; if (!pointers.size) multiple = false
  }
  const cancel = (event: PointerEvent) => { pointers.delete(event.pointerId); press = null; if (!pointers.size) multiple = false }
  canvas.addEventListener('keydown', keydown); canvas.addEventListener('webglcontextlost', contextLost)
  canvas.addEventListener('pointerdown', down); canvas.addEventListener('pointerup', release); canvas.addEventListener('pointercancel', cancel)
  host.parentElement?.addEventListener('pointermove', move); host.parentElement?.addEventListener('pointerleave', leave); document.addEventListener('visibilitychange', visibility)
  const resize = () => {
    width = Math.max(1, host.clientWidth); height = Math.max(1, host.clientHeight); compact = width < 850
    host.dataset.arrangement = compact ? 'portrait' : 'landscape'
    renderer.setSize(width, height); labelLayer.dataset.compact = String(compact)
    if (model.nodes.length) { arrange(); wake() }
  }
  const observer = new ResizeObserver(resize); observer.observe(host); resize()
  return {
    data(next) {
      const rebuild = model.nodes !== next.nodes || model.edges !== next.edges
      model = next
      if (rebuild) allocate()
      setLabels(); arrange()
      if (rebuild) { positions.set(targets); currentHeight = targetHeight; camera.position.copy(cameraTarget); controls.target.copy(centreTarget); updateLines() }
      host.dataset.renderedAppearance = 'light'; host.dataset.totalNodes = String(next.totalNodes); host.dataset.totalEdges = String(next.totalEdges)
      host.dataset.renderedNodes = String(next.nodes.length); host.dataset.renderedEdges = String(links.length); host.dataset.labeledNodes = String(next.items.length); host.dataset.atlasKey = next.key
      wake()
    },
    update(next) { const changed = state.playing !== next.playing || state.motion !== next.motion || state.visible !== next.visible; state = next; if (!state.visible) stop(); else if (changed) wake() }, fit, zoom, rotate,
    dispose() {
      disposed = true; stop(); observer.disconnect(); controls.dispose()
      canvas.removeEventListener('keydown', keydown); canvas.removeEventListener('webglcontextlost', contextLost); canvas.removeEventListener('wheel', wheel, true)
      canvas.removeEventListener('pointerdown', down); canvas.removeEventListener('pointerup', release); canvas.removeEventListener('pointercancel', cancel)
      host.parentElement?.removeEventListener('pointermove', move); host.parentElement?.removeEventListener('pointerleave', leave); document.removeEventListener('visibilitychange', visibility)
      stars.geometry.dispose(); threads.geometry.dispose(); pulses.geometry.dispose(); material.dispose(); lineMaterial.dispose(); renderer.dispose(); renderer.forceContextLoss(); canvas.remove(); labelLayer.replaceChildren()
    },
  }
}
