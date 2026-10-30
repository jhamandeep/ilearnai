import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import type { ConceptKind } from '../data/types'
import { spatialGraphPalette, spatialGraphLightPalette } from './spatialGraphPalette'
import type { SceneAppearance } from './spatialGraphPalette'

export type SpatialNode = { id: string; label: string; kind: ConceptKind; track?: string; x?: number; y?: number }
export type SpatialEdge = { source: string; target: string }
export type SpatialState = { selected: string | null; playing: boolean; motion: boolean; visible: boolean; appearance: SceneAppearance }
export type SpatialGraphHandle = { fit: () => void; zoom: (factor: number) => void; rotate: (x: number, y: number) => void }
export type SpatialGraphScene = SpatialGraphHandle & { data: (nodes: SpatialNode[], edges: SpatialEdge[]) => void; update: (state: SpatialState) => void; dispose: () => void }
type Callbacks = { select: (id: string) => void; interact: () => void; zoom: (value: number) => void; unavailable: () => void }
const radii: Record<ConceptKind, number> = { concept: .24, lesson: .095, paper: .17, lab: .19, term: .055 }
function hash(value: string) { let n = 0; for (const c of value) n = (n * 31 + c.charCodeAt(0)) >>> 0; return (n % 10007) / 10007 }

/** A real, instanced 3D graph: every visible resource and connection is rendered. */
export function createSpatialGraph(host: HTMLElement, labelLayer: HTMLElement, initial: SpatialState, callbacks: Callbacks): SpatialGraphScene | null {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('webgl2', { alpha: true, antialias: true, powerPreference: 'low-power' })
  if (!context) return null
  const renderer = new THREE.WebGLRenderer({ canvas, context, alpha: true, antialias: true })
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5))
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(42, 1, .1, 500)
  const generator = new THREE.PMREMGenerator(renderer), room = new RoomEnvironment()
  const environment = generator.fromScene(room, .04)
  scene.environment = environment.texture; scene.environmentIntensity = .6
  room.dispose(); generator.dispose()
  const light = new THREE.DirectionalLight(0xe6edff, 3); light.position.set(-4, 8, 12); scene.add(light)
  const rim = new THREE.DirectionalLight(0x526aff, 4); rim.position.set(7, -2, -6); scene.add(rim)
  scene.add(new THREE.HemisphereLight(0xc9d9ff, 0x0b1129, 1.1))
  const geometry = new THREE.SphereGeometry(1, 20, 14)
  const material = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: .52, roughness: .25, clearcoat: .8 })
  const edgeMaterial = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: .47, depthWrite: false })
  const signalMaterial = new THREE.MeshBasicMaterial({ color: 0xb9d9ff })
  const signalGeometry = new THREE.SphereGeometry(.035, 8, 6)
  const signals = new THREE.InstancedMesh(signalGeometry, signalMaterial, 24); signals.frustumCulled = false; scene.add(signals)
  const focusGeometry = new THREE.TorusGeometry(1, .035, 8, 64)
  const focusMaterial = new THREE.MeshBasicMaterial({ color: 0xcdd8ff, transparent: true, opacity: .85 })
  const focusRing = new THREE.Mesh(focusGeometry, focusMaterial); focusRing.visible = false; scene.add(focusRing)
  let nodes: SpatialNode[] = [], edges: SpatialEdge[] = [], points: THREE.Vector3[] = [], base: THREE.Vector3[] = []
  let mesh: THREE.InstancedMesh | undefined, lines: THREE.LineSegments | undefined
  let edgeGeometry: THREE.BufferGeometry | undefined, edgePositions = new Float32Array(), edgeColors = new Float32Array()
  let edgeIndices: [number, number][] = [], lookup = new Map<string, number>(), neighbours = new Set<string>()
  let labels: { button: HTMLButtonElement; index: number }[] = []
  let state = initial, disposed = false, lost = false, frame = 0, last = 0, elapsed = 0, rendering = false
  let width = 1, height = 1, fitDistance = 30, zoomValue = 100, frameCount = 0
  let focusTarget: { center: THREE.Vector3; position: THREE.Vector3 } | null = null
  const dummy = new THREE.Object3D(), color = new THREE.Color(), projected = new THREE.Vector3()
  let restoreFocus: string | undefined
  const raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2()
  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true; controls.dampingFactor = .12; controls.autoRotateSpeed = .7
  controls.minDistance = 1; controls.maxDistance = 180; controls.cursorStyle = 'grab'
  camera.position.set(0, 5, 30)

  function stop() { cancelAnimationFrame(frame); frame = 0; last = 0 }
  function wake() { if (!frame && !disposed && !lost && state.visible) frame = requestAnimationFrame(render) }
  function makeLabels() {
    restoreFocus = labelLayer.contains(document.activeElement) ? (document.activeElement as HTMLElement).dataset.spatialNode : undefined
    labelLayer.replaceChildren()
    const candidates = nodes.map((node, index) => ({ node, index })).filter(({ node }) => nodes.length <= 16 || node.kind === 'concept' || node.id === state.selected || neighbours.has(node.id))
      .sort((a, b) => Number(b.node.id === state.selected) - Number(a.node.id === state.selected) || Number(neighbours.has(b.node.id)) - Number(neighbours.has(a.node.id)) || Number(b.node.kind === 'concept') - Number(a.node.kind === 'concept'))
    labels = candidates.slice(0, 55).map(({ node, index }) => {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'spatial-node-label'
      button.dataset.spatialNode = node.id; button.textContent = node.label
      button.title = node.label
      button.setAttribute('aria-label', `${node.label}, ${node.kind}`); button.setAttribute('aria-pressed', String(node.id === state.selected))
      button.addEventListener('click', () => { callbacks.interact(); callbacks.select(node.id) })
      button.addEventListener('focus', () => callbacks.interact())
      labelLayer.append(button); return { button, index }
    })
  }
  function highlight() {
    const light = state.appearance === 'light'
    const palette = light ? spatialGraphLightPalette : spatialGraphPalette
    neighbours = new Set(edges.flatMap(edge => edge.source === state.selected ? [edge.target] : edge.target === state.selected ? [edge.source] : []))
    nodes.forEach((node, i) => {
      color.set(palette[node.kind]); if (state.selected && node.id !== state.selected && !neighbours.has(node.id)) { if (light) color.lerp(new THREE.Color('#cdd3e7'), .83); else color.multiplyScalar(.11) }
      mesh?.setColorAt(i, color)
    })
    if (mesh?.instanceColor) mesh.instanceColor.needsUpdate = true
    edgeIndices.forEach(([a, b], i) => {
      color.set(state.selected ? nodes[a].id === state.selected || nodes[b].id === state.selected ? light ? '#344bb4' : '#9cb8ff' : light ? '#cbd1e3' : '#111b39' : light ? '#667aa6' : '#4c629c')
      edgeColors.set([color.r, color.g, color.b, color.r, color.g, color.b], i * 6)
    })
    if (edgeGeometry) edgeGeometry.attributes.color.needsUpdate = true
    makeLabels()
  }
  function applyAppearance() {
    const light = state.appearance === 'light'
    material.metalness = light ? .08 : .52; material.roughness = light ? .63 : .25; material.clearcoat = light ? .12 : .8
    scene.environmentIntensity = light ? .35 : .6
    edgeMaterial.opacity = light ? .62 : .47
    signalMaterial.color.set(light ? '#344ecc' : '#b9d9ff')
    focusMaterial.color.set(light ? '#304cc8' : '#cdd8ff')
    host.dataset.renderedAppearance = state.appearance
    highlight()
  }
  function focus(ids?: Set<string>) {
    if (!points.length) return
    // Small chapter journeys retain their whole sequence when a lesson is
    // selected. The full knowledge map can zoom into a topic's neighbourhood.
    if (nodes.length <= 16) ids = undefined
    const bounds = new THREE.Box3().setFromPoints(points.filter((_, i) => !ids || ids.has(nodes[i].id)))
    if (bounds.isEmpty()) return
    const center = bounds.getCenter(new THREE.Vector3())
    // Fit the projected points, rather than a diagonal bounding sphere that leaves
    // a wide graph stranded in the middle of a landscape stage.
    const inverseRotation = camera.quaternion.clone().invert()
    const tanY = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)), tanX = tanY * camera.aspect
    const distance = Math.max(3.8, ...points.filter((_, i) => !ids || ids.has(nodes[i].id)).map(point => {
      const local = point.clone().sub(center).applyQuaternion(inverseRotation)
      return Math.max((Math.abs(local.x) + .6) / tanX, (Math.abs(local.y) + .6) / tanY) + local.z
    })) * 1.15
    if (!ids) fitDistance = distance
    const direction = camera.position.clone().sub(controls.target).normalize()
    focusTarget = { center, position: center.clone().addScaledVector(direction, distance) }
    if (!state.motion) { controls.target.copy(center); camera.position.copy(focusTarget.position); focusTarget = null; controls.update() }
    wake()
  }
  function drawObjects() {
    nodes.forEach((node, i) => {
      const phase = hash(node.id) * Math.PI * 2
      points[i].copy(base[i]); points[i].y += Math.sin(elapsed * .42 + phase) * (nodes.length <= 16 ? .12 : .08)
      points[i].z += Math.sin(elapsed * .3 + phase) * .08
      const scale = nodes.length <= 16 ? .38 : radii[node.kind]
      dummy.position.copy(points[i]); dummy.scale.setScalar(scale * (node.id === state.selected ? 1.35 : 1)); dummy.updateMatrix()
      mesh?.setMatrixAt(i, dummy.matrix)
    })
    if (mesh) mesh.instanceMatrix.needsUpdate = true
    edgeIndices.forEach(([a, b], i) => edgePositions.set([...points[a].toArray(), ...points[b].toArray()], i * 6))
    if (edgeGeometry) edgeGeometry.attributes.position.needsUpdate = true
    signals.visible = state.playing && edgeIndices.length > 0
    if (signals.visible) {
      for (let i = 0; i < 24; i++) {
        const [a, b] = edgeIndices[(i * 97) % edgeIndices.length], t = (elapsed * .13 + i * .137) % 1
        dummy.position.copy(points[a]).lerp(points[b], t); dummy.scale.setScalar(Math.sin(t * Math.PI)); dummy.updateMatrix(); signals.setMatrixAt(i, dummy.matrix)
      }
      signals.instanceMatrix.needsUpdate = true
    }
    const selected = state.selected ? lookup.get(state.selected) : undefined
    focusRing.visible = selected !== undefined
    if (selected !== undefined) { focusRing.position.copy(points[selected]); focusRing.quaternion.copy(camera.quaternion); focusRing.scale.setScalar(nodes.length <= 16 ? .65 : radii[nodes[selected].kind] * 2.1) }
  }
  function projectLabels() {
    const occupied: { x: number; y: number; w: number }[] = []
    for (const { button, index } of labels) {
      projected.copy(points[index]).project(camera)
      const x = (projected.x + 1) / 2 * width + 10, y = (1 - projected.y) / 2 * height - 12
      const w = Math.min(nodes[index].label.length * 7.2 + 22, width < 500 ? 170 : 220)
      const selected = nodes[index].id === state.selected
      const left = Math.max(8, Math.min(width - w - 8, x))
      const visible = projected.z < 1 && projected.z > -1 && x > 0 && x < width + 10 && y > 10 && y < height - 45 && (selected || !occupied.some(box => left < box.x + box.w + 12 && left + w + 12 > box.x && Math.abs(y - box.y) < 36))
      button.hidden = !visible
      if (visible) { button.style.transform = `translate3d(${left}px,${y}px,0)`; button.style.maxWidth = `${w}px`; occupied.push({ x: left, y, w }) }
      if (visible && restoreFocus === nodes[index].id) { button.focus({ preventScroll: true }); restoreFocus = undefined }
    }
  }
  function render(now: number) {
    frame = 0
    if (disposed || lost || !state.visible) return
    rendering = true
    const dt = last ? Math.min((now - last) / 1000, .05) : 1 / 60; last = now
    if (state.playing) elapsed += dt
    controls.autoRotate = state.playing && (!state.selected || nodes.length <= 16) && !focusTarget
    controls.enableDamping = state.motion
    if (focusTarget) {
      const factor = state.motion ? 1 - Math.exp(-dt * 6) : 1
      controls.target.lerp(focusTarget.center, factor); camera.position.lerp(focusTarget.position, factor)
      if (camera.position.distanceTo(focusTarget.position) < .02) { camera.position.copy(focusTarget.position); controls.target.copy(focusTarget.center); focusTarget = null }
    }
    const changed = controls.update(dt)
    drawObjects(); renderer.render(scene, camera); projectLabels()
    host.dataset.frame = String(++frameCount)
    host.dataset.camera = camera.position.toArray().map(n => n.toFixed(3)).join(',')
    const nextZoom = Math.round(fitDistance / Math.max(.01, camera.position.distanceTo(controls.target)) * 100)
    if (nextZoom !== zoomValue) { zoomValue = nextZoom; callbacks.zoom(nextZoom) }
    rendering = false
    if (state.playing || focusTarget || changed) wake()
  }
  function resize() {
    width = Math.max(1, host.clientWidth); height = Math.max(1, host.clientHeight)
    renderer.setSize(width, height); camera.aspect = width / height; camera.updateProjectionMatrix()
    focus(state.selected ? new Set([state.selected, ...neighbours]) : undefined); wake()
  }
  function interact() { focusTarget = null; callbacks.interact() }
  const onChange = () => { if (!rendering) wake() }
  controls.addEventListener('start', interact); controls.addEventListener('change', onChange)
  // Scrolling the page remains native. Ctrl/Command + wheel zooms the scene.
  const wheel = (event: WheelEvent) => { if (!event.ctrlKey && !event.metaKey) event.stopImmediatePropagation() }
  canvas.addEventListener('wheel', wheel, { capture: true, passive: true })
  let press: { x: number; y: number; id: number } | null = null
  let multiTouch = false
  const pointers = new Set<number>()
  const down = (event: PointerEvent) => { pointers.add(event.pointerId); if (pointers.size > 1) multiTouch = true; if (event.button === 0) press = { x: event.clientX, y: event.clientY, id: event.pointerId } }
  const up = (event: PointerEvent) => {
    pointers.delete(event.pointerId)
    if (!multiTouch && press?.id === event.pointerId && Math.hypot(event.clientX - press.x, event.clientY - press.y) < 5 && mesh) {
      const box = canvas.getBoundingClientRect(); pointer.set((event.clientX - box.left) / box.width * 2 - 1, 1 - (event.clientY - box.top) / box.height * 2)
      raycaster.setFromCamera(pointer, camera)
      const hit = raycaster.intersectObject(mesh)[0]
      if (hit?.instanceId !== undefined) callbacks.select(nodes[hit.instanceId].id)
    }
    press = null; if (!pointers.size) multiTouch = false
  }
  const cancel = () => { press = null; pointers.clear(); multiTouch = false }
  const rotate = (x: number, y: number) => { interact(); controls.rotateLeft(x); controls.rotateUp(y); controls.update(); wake() }
  const zoom = (factor: number) => { interact(); const delta = camera.position.clone().sub(controls.target); const distance = THREE.MathUtils.clamp(delta.length() / factor, 1, 180); camera.position.copy(controls.target).add(delta.setLength(distance)); controls.update(); wake() }
  const key = (event: KeyboardEvent) => {
    if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-','Home'].includes(event.key)) return
    event.preventDefault(); callbacks.interact()
    if (event.key === 'Home') focus()
    else if (['+','='].includes(event.key)) zoom(1.35)
    else if (event.key === '-') zoom(1 / 1.35)
    else rotate(event.key === 'ArrowLeft' ? .15 : event.key === 'ArrowRight' ? -.15 : 0, event.key === 'ArrowUp' ? .12 : event.key === 'ArrowDown' ? -.12 : 0)
  }
  const contextLost = (event: Event) => { event.preventDefault(); lost = true; stop(); callbacks.unavailable() }
  canvas.tabIndex = 0; canvas.setAttribute('role', 'group'); canvas.setAttribute('aria-label', 'Interactive 3D map. Drag to rotate. Arrow keys rotate, plus and minus zoom, Home fits the map.')
  canvas.addEventListener('pointerdown', down); canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', cancel)
  canvas.addEventListener('keydown', key); canvas.addEventListener('webglcontextlost', contextLost)
  const observer = new ResizeObserver(resize); observer.observe(host)
  host.append(canvas); resize()
  applyAppearance()
  return {
    data(nextNodes, nextEdges) {
      if (mesh) { scene.remove(mesh); mesh.dispose() }
      if (lines) scene.remove(lines)
      edgeGeometry?.dispose()
      nodes = nextNodes; lookup = new Map(nodes.map((node, i) => [node.id, i]))
      edges = nextEdges.filter(edge => lookup.has(edge.source) && lookup.has(edge.target))
      const hasLayout = nodes.every(node => Number.isFinite(node.x) && Number.isFinite(node.y))
      const xs = nodes.map(node => node.x ?? 0), ys = nodes.map(node => node.y ?? 0)
      const midX = (Math.min(...xs, 0) + Math.max(...xs, 0)) / 2, midY = (Math.min(...ys, 0) + Math.max(...ys, 0)) / 2
      const scale = 18 / Math.max(1, Math.max(...xs, 0) - Math.min(...xs, 0), Math.max(...ys, 0) - Math.min(...ys, 0))
      base = nodes.map((node, i) => {
        if (!hasLayout) { const a = i / nodes.length * Math.PI * 2 - Math.PI / 2; return new THREE.Vector3(Math.cos(a) * 3.4, Math.sin(a) * 2, Math.sin(a * 2) * 1.1) }
        return new THREE.Vector3(((node.x ?? 0) - midX) * scale, -((node.y ?? 0) - midY) * scale, (hash(node.track ?? node.id) - .5) * 7 + (hash(node.id) - .5) * 2.5)
      })
      points = base.map(point => point.clone())
      mesh = new THREE.InstancedMesh(geometry, material, nodes.length); mesh.frustumCulled = false
      // A conservative bound includes the bounded drift and keeps raycasting accurate.
      mesh.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 100)
      scene.add(mesh)
      edgeIndices = edges.map(edge => [lookup.get(edge.source)!, lookup.get(edge.target)!])
      edgePositions = new Float32Array(edges.length * 6); edgeColors = new Float32Array(edges.length * 6)
      edgeGeometry = new THREE.BufferGeometry(); edgeGeometry.setAttribute('position', new THREE.BufferAttribute(edgePositions, 3)); edgeGeometry.setAttribute('color', new THREE.BufferAttribute(edgeColors, 3))
      lines = new THREE.LineSegments(edgeGeometry, edgeMaterial); lines.frustumCulled = false; scene.add(lines)
      host.dataset.renderedNodes = String(mesh.count); host.dataset.renderedEdges = String(edges.length)
      highlight(); focus(state.selected ? new Set([state.selected, ...neighbours]) : undefined); wake()
    },
    update(next) {
      const changed = next.selected !== state.selected, appearanceChanged = next.appearance !== state.appearance; state = next
      if (appearanceChanged) applyAppearance()
      if (changed) { if (!appearanceChanged) highlight(); focus(state.selected ? new Set([state.selected, ...neighbours]) : undefined) }
      if (!state.visible) stop(); else wake()
    },
    fit() { focus() }, zoom, rotate,
    dispose() {
      disposed = true; stop(); observer.disconnect(); controls.dispose()
      canvas.removeEventListener('pointerdown', down); canvas.removeEventListener('pointerup', up); canvas.removeEventListener('pointercancel', cancel)
      canvas.removeEventListener('keydown', key); canvas.removeEventListener('wheel', wheel, true); canvas.removeEventListener('webglcontextlost', contextLost)
      mesh?.dispose(); geometry.dispose(); material.dispose(); edgeGeometry?.dispose(); edgeMaterial.dispose()
      signals.dispose(); signalGeometry.dispose(); signalMaterial.dispose(); focusGeometry.dispose(); focusMaterial.dispose(); environment.dispose()
      renderer.dispose(); renderer.forceContextLoss(); canvas.remove(); labelLayer.replaceChildren()
    },
  }
}
