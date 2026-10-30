import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import type { AtlasData, AtlasItem } from './knowledgeAtlasModel'
import type { SpatialGraphHandle } from './spatialGraphScene'

export type AtlasState = { playing: boolean; motion: boolean; visible: boolean }
export type AtlasScene = SpatialGraphHandle & { data: (data: AtlasData) => void; update: (state: AtlasState) => void; dispose: () => void }
type Callbacks = { select: (id: string) => void; interact: () => void; zoom: (value: number) => void; unavailable: () => void }
type ObjectEntry = { item: AtlasItem; group: THREE.Group; target: THREE.Vector3; scale: number; targetScale: number; button: HTMLButtonElement; active: boolean; root: boolean }
const desktop = [[-2.9,1.25,.5],[-2.9,-.85,.3],[2.75,1.25,-.2],[2.95,-.8,.75],[1.3,-2.05,-.2],[-1.25,-2.05,.55]]
const portrait = [[-1.4,2.25,.3],[-1.6,.05,.4],[1.4,2.25,0],[1.6,.05,.4],[1.3,-2.15,.2],[-1.3,-2.15,.6]]

/** A navigable sculpture. Area paths represent membership; idea paths are
 * supplied exclusively from the selected resource's real graph neighbours. */
export function createKnowledgeAtlas(host: HTMLElement, labelLayer: HTMLElement, initial: AtlasState, callbacks: Callbacks): AtlasScene | null {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('webgl2', { alpha: true, antialias: true, powerPreference: 'low-power' })
  if (!context) return null
  const renderer = new THREE.WebGLRenderer({ canvas, context, alpha: true, antialias: true })
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5))
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.2
  const scene = new THREE.Scene(), world = new THREE.Group()
  world.position.y = .3; scene.add(world)
  const camera = new THREE.PerspectiveCamera(40, 1, .1, 100)
  camera.position.set(0, .05, 8.8)
  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true; controls.dampingFactor = .12; controls.minDistance = 3; controls.maxDistance = 35; controls.cursorStyle = 'grab'
  controls.minPolarAngle = .4; controls.maxPolarAngle = Math.PI - .4

  // A local studio environment avoids a network dependency for the artwork.
  const envCanvas = document.createElement('canvas'); envCanvas.width = 512; envCanvas.height = 256
  const ec = envCanvas.getContext('2d')!
  const gradient = ec.createLinearGradient(0, 0, 0, 256)
  gradient.addColorStop(0, '#fefeff'); gradient.addColorStop(.45, '#d2d0ec'); gradient.addColorStop(.5, '#ffffff'); gradient.addColorStop(.65, '#9ea7d7'); gradient.addColorStop(1, '#eff1ff')
  ec.fillStyle = gradient; ec.fillRect(0, 0, 512, 256); ec.fillStyle = '#ffffff'; ec.fillRect(30, 20, 65, 155); ec.fillRect(310, 0, 110, 105)
  const texture = new THREE.CanvasTexture(envCanvas); texture.mapping = THREE.EquirectangularReflectionMapping; texture.colorSpace = THREE.SRGBColorSpace
  const generator = new THREE.PMREMGenerator(renderer), environment = generator.fromEquirectangular(texture)
  scene.environment = environment.texture; texture.dispose(); generator.dispose()
  const key = new THREE.DirectionalLight(0xffffff, 3); key.position.set(-4, 5, 7); scene.add(key)
  const rim = new THREE.DirectionalLight(0xa7b7ff, 2); rim.position.set(5, -1, -2); scene.add(rim)
  scene.add(new THREE.HemisphereLight(0xf9f6ff, 0xc4c8dd, 2))
  const primary = new THREE.MeshPhysicalMaterial({ color: '#6255d9', metalness: .58, roughness: .19, clearcoat: 1, clearcoatRoughness: .12 })
  const pearl = new THREE.MeshPhysicalMaterial({ color: '#dfdef5', metalness: .3, roughness: .21, clearcoat: 1 })
  const pale = new THREE.MeshPhysicalMaterial({ color: '#8d9edd', metalness: .4, roughness: .25, clearcoat: 1 })
  const linkMaterial = new THREE.MeshPhysicalMaterial({ color: '#a6a8dd', metalness: .35, roughness: .35, transparent: true, opacity: .55, depthWrite: false })
  const pulseMaterial = new THREE.MeshBasicMaterial({ color: '#786ae1' })
  const shellMaterial = new THREE.MeshPhysicalMaterial({ color: '#dedcf6', metalness: .05, roughness: .15, transparent: true, opacity: .12, depthWrite: false })
  const core = new THREE.Group(); world.add(core)
  for (let j = 0; j < 3; j++) {
    const points = []
    for (let i = 0; i <= 160; i++) {
      const a = i / 160 * Math.PI * 2, r = .82 + Math.sin(3 * a + j * .8) * .16
      points.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r * 1.12, Math.sin(2 * a + j * 1.8) * .45))
    }
    const strand = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 180, .095, 14, false), j === 0 ? primary : j === 1 ? pearl : pale)
    strand.rotation.y = j * Math.PI / 3; strand.rotation.z = j * .16; core.add(strand)
  }
  core.add(new THREE.Mesh(new THREE.SphereGeometry(.6, 32, 24), shellMaterial))
  const dustGeometry = new THREE.SphereGeometry(.025, 8, 6), dust = new THREE.InstancedMesh(dustGeometry, pearl, 130)
  const dummy = new THREE.Object3D()
  for (let i = 0; i < 130; i++) {
    const a = i * 2.399963, r = 1.2 + ((i * 41) % 149) / 149 * 1.65
    dummy.position.set(Math.cos(a) * r, Math.sin(a) * r * .77, Math.sin(i * 4.2) * .6 - .7)
    dummy.scale.setScalar(.4 + (i % 5) * .14); dummy.updateMatrix(); dust.setMatrixAt(i, dummy.matrix)
  }
  world.add(dust)
  function sculpture(shape: number) {
    const group = new THREE.Group()
    if (shape === 0) {
      group.add(new THREE.Mesh(new THREE.SphereGeometry(.22, 24, 20), pearl))
      const ring = new THREE.Mesh(new THREE.TorusGeometry(.33, .025, 8, 64), primary); ring.rotation.x = .7; group.add(ring)
    } else if (shape === 1) group.add(new THREE.Mesh(new THREE.OctahedronGeometry(.3), primary))
    else if (shape === 2) {
      for (let i = 0; i < 3; i++) { const ring = new THREE.Mesh(new THREE.TorusGeometry(.25, .035, 10, 56), i % 2 ? pearl : primary); ring.rotation.x = i * Math.PI / 3; ring.rotation.y = i * .8; group.add(ring) }
    } else if (shape === 3) {
      for (let i = 0; i < 4; i++) { const cube = new THREE.Mesh(new THREE.BoxGeometry(.22, .22, .22), i % 2 ? pearl : primary); cube.position.set((i % 2 - .5) * .27, (Math.floor(i / 2) - .5) * .27, 0); cube.rotation.y = .4; group.add(cube) }
    } else if (shape === 4) {
      for (let i = 0; i < 3; i++) { const disc = new THREE.Mesh(new THREE.CylinderGeometry(.24, .24, .07, 32), i === 1 ? primary : pearl); disc.position.y = (i - 1) * .15; disc.rotation.x = .3; group.add(disc) }
    } else {
      for (let i = 0; i < 3; i++) {
        const orb = new THREE.Mesh(new THREE.SphereGeometry(.105, 16, 12), i === 1 ? pearl : primary); orb.position.set((i - 1) * .23, Math.sin(i * 1.5) * .15, 0); group.add(orb)
        if (i < 2) { const bar = new THREE.Mesh(new THREE.CylinderGeometry(.026, .026, .27, 10), pale); bar.position.set((i - .5) * .23, .08, 0); bar.rotation.z = -Math.PI / 2 + i * .7; group.add(bar) }
      }
    }
    return group
  }
  function disposeGroup(group: THREE.Group) { group.traverse(object => { if (object instanceof THREE.Mesh) object.geometry.dispose() }); world.remove(group) }
  const objects = new Map<string, ObjectEntry>()
  const pulseGeometry = new THREE.SphereGeometry(.045, 10, 8)
  const links = Array.from({ length: 6 }, (_, index) => {
    const curve = new THREE.CubicBezierCurve3(new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3())
    const geometry = new THREE.TubeGeometry(new THREE.LineCurve3(new THREE.Vector3(), new THREE.Vector3(1, 0, 0)), 40, .024, 8, false)
    const mesh = new THREE.Mesh(geometry, linkMaterial), pulse = new THREE.Mesh(pulseGeometry, pulseMaterial)
    mesh.frustumCulled = false; world.add(mesh, pulse)
    return { index, curve, mesh, pulse, target: null as ObjectEntry | null }
  })
  const point = new THREE.Vector3(), tangent = new THREE.Vector3(), normal = new THREE.Vector3(), binormal = new THREE.Vector3(), upAxis = new THREE.Vector3(0, 0, 1)
  function updateLinks() {
    const origin = model.root ? objects.get(model.root.id)?.group.position ?? new THREE.Vector3() : new THREE.Vector3()
    for (const link of links) {
      link.mesh.visible = !!link.target
      if (!link.target) { link.pulse.visible = false; continue }
      const end = link.target.group.position, sign = link.index % 2 ? 1 : -1
      link.curve.v0.copy(origin); link.curve.v3.copy(end)
      link.curve.v1.copy(origin).lerp(end, .34).add(new THREE.Vector3(0, .25 * sign, .7))
      link.curve.v2.copy(origin).lerp(end, .7).add(new THREE.Vector3(0, -.15 * sign, .4))
      const positions = link.mesh.geometry.attributes.position
      for (let i = 0; i <= 40; i++) {
        link.curve.getPoint(i / 40, point); link.curve.getTangent(i / 40, tangent)
        normal.crossVectors(tangent, upAxis).normalize(); binormal.crossVectors(tangent, normal).normalize()
        for (let j = 0; j <= 8; j++) {
          const angle = j / 8 * Math.PI * 2, c = Math.cos(angle) * .024, s = Math.sin(angle) * .024
          positions.setXYZ(i * 9 + j, point.x + normal.x * c + binormal.x * s, point.y + normal.y * c + binormal.y * s, point.z + normal.z * c + binormal.z * s)
        }
      }
      positions.needsUpdate = true; link.mesh.geometry.computeVertexNormals()
    }
  }
  let state = initial, model: AtlasData = { key: 'overview', root: null, items: [], totalNodes: 0, totalEdges: 0 }
  let disposed = false, lost = false, frame = 0, last = 0, elapsed = 0, rendering = false, frameCount = 0
  let width = 1, height = 1, compact = false, stretch = 1, coreScale = 1, fitDistance = 8.8, zoomValue = 100
  let hoverX = 0, hoverY = 0, activeX = 0, activeY = 0, hovered: string | null = null
  let cameraTarget: THREE.Vector3 | null = null
  let restoreFocus: string | undefined
  const projected = new THREE.Vector3(), raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2()
  function wake() { if (!frame && !disposed && !lost && state.visible) frame = requestAnimationFrame(render) }
  function stop() { cancelAnimationFrame(frame); frame = 0; last = 0 }
  function arrange() {
    const active = model.items.map(item => objects.get(item.id)!)
    active.forEach((entry, index) => {
      let coords = (compact ? portrait : desktop)[index]
      if (model.root && active.length <= 3) coords = (compact ? [[-1.4,2.25,0],[1.45,-.1,.1],[-.9,-2.15,.3]] : [[-2.5,1.45,0],[2.3,.7,.3],[.65,-1.65,.4]])[index]
      entry.target.set(coords[0] * stretch, coords[1], coords[2]); entry.targetScale = 1
    })
    if (model.root) { const entry = objects.get(model.root.id)!; entry.target.set(compact ? 0 : -.25, model.items.length > 3 ? .55 : .2, .6); entry.targetScale = 1.85 }
    for (const entry of objects.values()) if (!entry.active) entry.targetScale = 0
    links.forEach((link, index) => { link.target = active[index] ?? null })
    host.dataset.arrangement = compact ? 'portrait' : 'landscape'
  }
  function fit() {
    fitDistance = Math.max(compact ? 11.4 : 8.8, (compact ? 2.2 : 3.9 * stretch) / (Math.tan(THREE.MathUtils.degToRad(20)) * camera.aspect))
    cameraTarget = new THREE.Vector3(0, compact ? .3 : .05, fitDistance)
    controls.target.set(0, 0, 0)
    if (!state.motion) { camera.position.copy(cameraTarget); cameraTarget = null; controls.update() }
    wake()
  }
  function resize() {
    width = Math.max(1, host.clientWidth); height = Math.max(1, host.clientHeight); compact = width < 650
    stretch = compact ? 1 : Math.min(1.45, Math.max(1, width / height / 1.5))
    host.dataset.compact = String(compact)
    labelLayer.dataset.compact = String(compact)
    renderer.setSize(width, height); camera.aspect = width / height; camera.updateProjectionMatrix()
    arrange(); fit()
  }
  function placeLabels() {
    const occupied: { x: number; y: number; w: number; h: number }[] = []
    const entries = [...objects.values()].filter(entry => entry.active).sort((a, b) => Number(b.root) - Number(a.root))
    for (const entry of entries) {
      const button = entry.button
      if (entry.root && entry.item.area) { button.hidden = true; continue }
      button.hidden = false
      button.style.maxWidth = `${compact ? Math.min(158, (width - 36) / 2) : 224}px`
      // Labels follow navigation and camera changes, but stay still while the
      // sculpture breathes or reacts to the pointer around its resting pose.
      projected.copy(entry.group.position).add(world.position).project(camera)
      const w = button.offsetWidth || 120, h = button.offsetHeight || 48
      const x = Math.max(w / 2 + 8, Math.min(width - w / 2 - 8, (projected.x + 1) / 2 * width)) - w / 2
      const y = Math.max(6, Math.min(height - h - 10, (1 - projected.y) / 2 * height + (entry.root ? 48 : 26)))
      const showing = projected.z > -1 && projected.z < 1 && projected.x > -1.15 && projected.x < 1.15 && projected.y > -1.15 && projected.y < 1.15 && !occupied.some(box => x < box.x + box.w + 4 && x + w + 4 > box.x && y < box.y + box.h + 4 && y + h + 4 > box.y)
      button.hidden = !showing
      if (showing) {
        button.style.transform = `translate3d(${x}px,${y}px,0)`; occupied.push({ x, y, w, h })
        if (restoreFocus === entry.item.id) { button.focus({ preventScroll: true }); restoreFocus = undefined }
      }
    }
  }
  function render(now: number) {
    frame = 0; if (disposed || lost || !state.visible) return
    rendering = true
    const dt = last ? Math.min((now - last) / 1000, .05) : 1 / 60; last = now
    const moving = state.playing && state.motion
    if (moving) elapsed += dt
    const amount = state.motion ? 1 - Math.exp(-dt * 6) : 1
    const previousX = activeX, previousY = activeY
    activeX += ((moving ? hoverX : 0) - activeX) * amount; activeY += ((moving ? hoverY : 0) - activeY) * amount
    world.rotation.y = Math.sin(elapsed * .22) * .055 + activeX * .1; world.rotation.x = Math.sin(elapsed * .17) * .035 + activeY * .06
    let morphing = false
    for (const [id, entry] of objects) {
      const targetScale = entry.targetScale * (hovered === id ? 1.16 : 1)
      const changing = entry.group.position.distanceTo(entry.target) > .002 || Math.abs(entry.scale - targetScale) > .002
      entry.group.position.lerp(entry.target, amount); entry.scale += (targetScale - entry.scale) * amount
      entry.group.scale.setScalar(Math.max(.0001, entry.scale)); entry.group.rotation.y = elapsed * .12 + entry.item.shape * .4; entry.group.rotation.z = Math.sin(elapsed * .33 + entry.item.shape) * .07
      if (!changing) { entry.group.position.copy(entry.target); entry.scale = targetScale }
      morphing ||= changing
      if (!entry.active && entry.scale < .003) { disposeGroup(entry.group); entry.button.remove(); objects.delete(id) }
    }
    const desiredCore = model.root ? .001 : model.items.length ? 1 : .001
    if (Math.abs(coreScale - desiredCore) > .002) morphing = true
    coreScale += (desiredCore - coreScale) * amount; core.scale.setScalar(coreScale); core.rotation.y = elapsed * .08; core.rotation.z = Math.sin(elapsed * .12) * .08
    dust.visible = !model.root && !!model.items.length; dust.rotation.z = elapsed * .015
    if (morphing || frameCount < 2) updateLinks()
    for (const link of links) { link.pulse.visible = moving && !!link.target; if (link.pulse.visible) link.pulse.position.copy(link.curve.getPoint((elapsed * .12 + link.index * .17) % 1)) }
    if (cameraTarget) { camera.position.lerp(cameraTarget, amount); if (camera.position.distanceTo(cameraTarget) < .01) { camera.position.copy(cameraTarget); cameraTarget = null } }
    controls.enableDamping = state.motion
    const changed = controls.update(dt)
    renderer.render(scene, camera); placeLabels()
    host.dataset.frame = String(++frameCount); host.dataset.camera = [...camera.position.toArray(), world.rotation.x, world.rotation.y].map(n => n.toFixed(4)).join(',')
    const nextZoom = Math.round(fitDistance / camera.position.distanceTo(controls.target) * 100)
    if (nextZoom !== zoomValue) { zoomValue = nextZoom; callbacks.zoom(nextZoom) }
    rendering = false
    if (moving || morphing || cameraTarget || changed || Math.abs(previousX - activeX) > .0001 || Math.abs(previousY - activeY) > .0001) wake()
  }
  function interact() { cameraTarget = null; callbacks.interact() }
  const change = () => { if (!rendering) wake() }
  controls.addEventListener('start', interact); controls.addEventListener('change', change)
  const wheel = (event: WheelEvent) => { if (!event.ctrlKey && !event.metaKey) event.stopImmediatePropagation() }
  canvas.addEventListener('wheel', wheel, { capture: true, passive: true })
  const move = (event: PointerEvent) => { if (!state.playing || !state.motion || event.pointerType === 'touch') return; const bounds = host.getBoundingClientRect(); hoverX = (event.clientX - bounds.left) / bounds.width - .5; hoverY = (event.clientY - bounds.top) / bounds.height - .5; wake() }
  const leave = () => { hoverX = 0; hoverY = 0; wake() }
  host.parentElement?.addEventListener('pointermove', move); host.parentElement?.addEventListener('pointerleave', leave)
  const rotate = (x: number, y: number) => { interact(); controls.rotateLeft(x); controls.rotateUp(y); controls.update(); wake() }
  const zoom = (factor: number) => { interact(); const delta = camera.position.clone().sub(controls.target); delta.setLength(THREE.MathUtils.clamp(delta.length() / factor, 3, 35)); camera.position.copy(controls.target).add(delta); controls.update(); wake() }
  const keydown = (event: KeyboardEvent) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', '+', '=', '-', 'Home'].includes(event.key)) return
    event.preventDefault(); callbacks.interact()
    if (event.key === 'Home') fit()
    else if (event.key === '+' || event.key === '=') zoom(1.35)
    else if (event.key === '-') zoom(1 / 1.35)
    else rotate(event.key === 'ArrowLeft' ? .15 : event.key === 'ArrowRight' ? -.15 : 0, event.key === 'ArrowUp' ? .12 : event.key === 'ArrowDown' ? -.12 : 0)
  }
  const pointers = new Set<number>(); let press: { id: number; x: number; y: number } | null = null, multiTouch = false
  const down = (event: PointerEvent) => { pointers.add(event.pointerId); if (pointers.size > 1) multiTouch = true; if (!event.button) press = { id: event.pointerId, x: event.clientX, y: event.clientY } }
  const release = (event: PointerEvent) => {
    pointers.delete(event.pointerId)
    if (!multiTouch && press?.id === event.pointerId && Math.hypot(event.clientX - press.x, event.clientY - press.y) < 5) {
      const box = canvas.getBoundingClientRect(); pointer.set((event.clientX - box.left) / box.width * 2 - 1, 1 - (event.clientY - box.top) / box.height * 2)
      raycaster.setFromCamera(pointer, camera)
      const entries = [...objects.values()].filter(entry => entry.active), hits = raycaster.intersectObjects(entries.map(entry => entry.group), true)
      if (hits[0]) { const entry = entries.find(entry => entry.group === hits[0].object.parent); if (entry) callbacks.select(entry.item.id) }
    }
    press = null; if (!pointers.size) multiTouch = false
  }
  const cancel = () => { press = null; pointers.clear(); multiTouch = false }
  const contextLost = (event: Event) => { event.preventDefault(); lost = true; stop(); callbacks.unavailable() }
  canvas.tabIndex = 0; canvas.setAttribute('role', 'group'); canvas.setAttribute('aria-label', 'Interactive 3D knowledge map. Drag or use arrow keys to rotate, plus and minus to zoom, Home to fit.')
  canvas.addEventListener('keydown', keydown); canvas.addEventListener('pointerdown', down); canvas.addEventListener('pointerup', release); canvas.addEventListener('pointercancel', cancel); canvas.addEventListener('webglcontextlost', contextLost)
  host.append(canvas)
  const observer = new ResizeObserver(resize); observer.observe(host); resize()
  return {
    data(next) {
      const focused = labelLayer.contains(document.activeElement) ? (document.activeElement as HTMLElement).dataset.spatialNode : undefined
      restoreFocus = focused === next.root?.id && next.root?.area ? undefined : focused
      model = next
      for (const entry of objects.values()) { entry.active = false; entry.button.hidden = true }
      for (const item of [...(next.root ? [next.root] : []), ...next.items]) {
        let entry = objects.get(item.id)
        if (!entry) {
          const group = sculpture(item.shape); group.scale.setScalar(.001); world.add(group)
          const button = document.createElement('button'); button.type = 'button'; button.className = 'atlas-node-label spatial-node-label'; button.dataset.spatialNode = item.id
          button.addEventListener('click', () => callbacks.select(item.id))
          button.addEventListener('focus', () => { if (!item.area) callbacks.interact() })
          button.addEventListener('pointerenter', () => { hovered = item.id; wake() })
          button.addEventListener('pointerleave', () => { if (hovered === item.id) hovered = null; wake() })
          labelLayer.append(button)
          entry = { item, group, button, target: new THREE.Vector3(), scale: .001, targetScale: 1, active: true, root: false }; objects.set(item.id, entry)
        }
        entry.item = item; entry.active = true; entry.root = next.root?.id === item.id
        entry.button.dataset.atlasArea = item.area ? 'true' : ''; if (!item.area) delete entry.button.dataset.atlasArea
        entry.button.setAttribute('aria-label', item.area ? `Explore ${item.label}` : `${item.label}, ${item.subtitle.toLowerCase()}`)
        entry.button.setAttribute('aria-pressed', String(entry.root && !item.area)); entry.button.title = item.label
        const title = document.createElement('span'); title.textContent = item.label
        const subtitle = document.createElement('small'); subtitle.textContent = item.subtitle
        entry.button.replaceChildren(title, subtitle); entry.button.hidden = false
      }
      arrange(); updateLinks(); fit()
      host.dataset.renderedAppearance = 'light'; host.dataset.totalNodes = String(next.totalNodes); host.dataset.totalEdges = String(next.totalEdges)
      host.dataset.renderedNodes = String(next.items.length + Number(!!next.root)); host.dataset.renderedEdges = String(next.items.length)
      host.dataset.atlasKey = next.key
      wake()
    },
    update(next) { state = next; if (!state.visible) stop(); else wake() }, fit, zoom, rotate,
    dispose() {
      disposed = true; stop(); observer.disconnect(); controls.dispose()
      canvas.removeEventListener('keydown', keydown); canvas.removeEventListener('pointerdown', down); canvas.removeEventListener('pointerup', release); canvas.removeEventListener('pointercancel', cancel); canvas.removeEventListener('webglcontextlost', contextLost); canvas.removeEventListener('wheel', wheel, true)
      host.parentElement?.removeEventListener('pointermove', move); host.parentElement?.removeEventListener('pointerleave', leave)
      for (const entry of objects.values()) disposeGroup(entry.group)
      disposeGroup(core); dust.dispose(); dustGeometry.dispose(); pulseGeometry.dispose()
      for (const link of links) link.mesh.geometry.dispose()
      for (const material of [primary, pearl, pale, linkMaterial, pulseMaterial, shellMaterial]) material.dispose()
      environment.dispose(); renderer.dispose(); renderer.forceContextLoss(); canvas.remove(); labelLayer.replaceChildren()
    },
  }
}
