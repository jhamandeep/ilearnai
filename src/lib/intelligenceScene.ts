import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'

type State = { playing: boolean; formation: number }
export type IntelligenceScene = { update: (state: State) => void; dispose: () => void }

/** Original procedural sculpture: no remote textures, models, or tracking. */
export function createIntelligenceScene(host: HTMLElement, initial: State, onReady: (ready: boolean) => void): IntelligenceScene {
  const canvas = document.createElement('canvas')
  // Detect support before constructing Three's renderer (and leave the poster intact).
  const context = canvas.getContext('webgl2', { alpha: true, antialias: true, powerPreference: 'low-power' })
  if (!context) return { update() {}, dispose() {} }
  const renderer = new THREE.WebGLRenderer({ canvas, context, alpha: true, antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(37, 1, .1, 80)
  camera.position.set(0, 0, 19)
  const pmrem = new THREE.PMREMGenerator(renderer)
  const room = new RoomEnvironment()
  let environment = pmrem.fromScene(room, .04)
  scene.environment = environment.texture
  scene.environmentIntensity = .8
  room.dispose(); pmrem.dispose()
  scene.add(new THREE.HemisphereLight(0xe4eaff, 0x0a0c22, .7))
  const key = new THREE.DirectionalLight(0xffffff, 3)
  key.position.set(-4, 7, 6); scene.add(key)
  const rim = new THREE.DirectionalLight(0x3764ff, 4)
  rim.position.set(5, -1, -4); scene.add(rim)

  const blue = new THREE.MeshPhysicalMaterial({ color: 0x0615d8, metalness: .25, roughness: .24, clearcoat: 1, clearcoatRoughness: .12 })
  const silver = new THREE.MeshPhysicalMaterial({ color: 0xdfe5f4, metalness: .85, roughness: .23, clearcoat: .6 })
  const ink = new THREE.MeshPhysicalMaterial({ color: 0x171a26, metalness: .7, roughness: .22, clearcoat: 1 })
  const violet = new THREE.MeshPhysicalMaterial({ color: 0x777bf6, metalness: .48, roughness: .25, clearcoat: 1 })
  const materials = [blue, silver, ink, blue, violet]
  const geometries = [new THREE.TorusGeometry(.55, .22, 20, 48), new RoundedBoxGeometry(.82, .82, .82, 3, .16), new THREE.SphereGeometry(.44, 24, 16)]
  const group = new THREE.Group(); scene.add(group)
  const coreGeometry = new THREE.TorusKnotGeometry(1.65, .49, 192, 24, 2, 3)
  const core = new THREE.Mesh(coreGeometry, blue)
  core.rotation.set(.2, -.25, -.4); group.add(core)

  const count = 28
  const nodes = Array.from({ length: count }, (_, i) => {
    const mesh = new THREE.Mesh(geometries[i % 3], materials[i % materials.length])
    mesh.rotation.set(i * .7, i * 1.3, i * .4)
    const scale = .6 + (i % 5) * .17
    mesh.scale.setScalar(scale)
    group.add(mesh)
    return mesh
  })
  const targets = [0, 1, 2].map(mode => nodes.map((_, i) => {
    const theta = i * 2.39996
    if (mode === 0) { const r = 3.3 + (i % 3) * .55; return new THREE.Vector3(Math.cos(theta) * r * 1.35, Math.sin(theta) * r * .83, Math.sin(i * 1.8) * 1.6 - .4) }
    if (mode === 1) { const theta = i * .46; return new THREE.Vector3(Math.cos(theta) * 4.4, (i / (count - 1) - .5) * 6.7, Math.sin(theta) * 2) }
    return new THREE.Vector3((i % 7 - 3) * 1.45, (Math.floor(i / 7) - 1.5) * 1.5, (i % 2) * 1.1 - .5)
  }))
  nodes.forEach((mesh, i) => mesh.position.copy(targets[initial.formation][i]))

  // Fine connections give the sculpture an AI-network silhouette without competing with the forms.
  const connectionData = new Float32Array(count * 6)
  const connectionGeometry = new THREE.BufferGeometry()
  connectionGeometry.setAttribute('position', new THREE.BufferAttribute(connectionData, 3))
  const connectionMaterial = new THREE.LineBasicMaterial({ color: 0x7f92e8, transparent: true, opacity: .2 })
  const connections = new THREE.LineSegments(connectionGeometry, connectionMaterial); group.add(connections)
  const pointer = new THREE.Vector2()
  let state = initial, visible = true, lost = false, disposed = false, frame = 0, last = 0, elapsed = 0
  let width = 1, height = 1

  function render(now = 0) {
    frame = 0
    if (disposed || lost) return
    const dt = last ? Math.min((now - last) / 1000, .04) : 0
    last = now
    if (state.playing && visible) elapsed += dt
    const smooth = state.playing ? 1 - Math.exp(-dt * 3.6) : 1
    nodes.forEach((mesh, i) => {
      mesh.position.lerp(targets[state.formation][i], smooth)
      if (state.playing && visible) { mesh.rotation.x += dt * .12; mesh.rotation.y += dt * .16 }
      const next = nodes[(i + 3) % count].position
      connectionData.set([mesh.position.x, mesh.position.y, mesh.position.z, next.x, next.y, next.z], i * 6)
    })
    connectionGeometry.attributes.position.needsUpdate = true
    connections.visible = state.formation === 0
    const targetScale = state.formation === 0 ? 1 : state.formation === 1 ? .68 : .01
    core.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), smooth)
    core.rotation.y = -.25 + elapsed * .09
    core.rotation.z = -.4 + Math.sin(elapsed * .15) * .15
    if (state.playing) {
      group.rotation.y += (pointer.x * .18 + Math.sin(elapsed * .14) * .12 - group.rotation.y) * Math.max(smooth, .02)
      group.rotation.x += (-pointer.y * .09 - group.rotation.x) * Math.max(smooth, .02)
    }
    group.position.y = .35 + Math.sin(elapsed * .4) * .08
    renderer.render(scene, camera)
    if (state.playing && visible) frame = requestAnimationFrame(render)
  }
  function wake() { if (!frame && !lost && !disposed) { last = 0; frame = requestAnimationFrame(render) } }
  function stop() { cancelAnimationFrame(frame); frame = 0; last = 0 }
  function resize() {
    width = Math.max(host.clientWidth, 1); height = Math.max(host.clientHeight, 1)
    renderer.setSize(width, height)
    camera.aspect = width / height
    // Frame the entire composition on narrow screens, never crop the learning controls.
    camera.position.z = camera.aspect < 1 ? 25 : 18
    group.scale.setScalar(camera.aspect < 1 ? Math.max(.48, camera.aspect * .88) : 1)
    camera.updateProjectionMatrix(); wake()
  }
  function move(event: PointerEvent) {
    if (!state.playing || event.pointerType === 'touch') return
    const box = host.getBoundingClientRect()
    pointer.set((event.clientX - box.left) / width * 2 - 1, (event.clientY - box.top) / height * 2 - 1)
  }
  function leave() { pointer.set(0, 0) }
  function contextLost(event: Event) { event.preventDefault(); lost = true; stop(); onReady(false) }
  function contextRestored() {
    const generator = new THREE.PMREMGenerator(renderer), freshRoom = new RoomEnvironment()
    environment.dispose(); environment = generator.fromScene(freshRoom, .04); scene.environment = environment.texture
    freshRoom.dispose(); generator.dispose()
    lost = false; onReady(true); resize()
  }
  canvas.addEventListener('webglcontextlost', contextLost)
  canvas.addEventListener('webglcontextrestored', contextRestored)
  // Parent includes the transparent caption area, so the whole scene responds to the pointer.
  const surface = host.parentElement!
  surface.addEventListener('pointermove', move); surface.addEventListener('pointerleave', leave)
  const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(host)
  const observer = new IntersectionObserver(entries => { visible = entries.some(entry => entry.isIntersecting); if (visible) wake(); else stop() })
  observer.observe(host)
  host.appendChild(canvas)
  resize(); onReady(true)
  return {
    update(next) { const changed = state.formation !== next.formation; state = next; if (!state.playing) stop(); if (visible || changed) wake() },
    dispose() {
      disposed = true; stop(); observer.disconnect(); resizeObserver.disconnect()
      surface.removeEventListener('pointermove', move); surface.removeEventListener('pointerleave', leave)
      canvas.removeEventListener('webglcontextlost', contextLost); canvas.removeEventListener('webglcontextrestored', contextRestored)
      geometries.forEach(item => item.dispose()); coreGeometry.dispose(); materials.forEach(item => item.dispose())
      connectionGeometry.dispose(); connectionMaterial.dispose(); environment.dispose(); renderer.dispose(); renderer.forceContextLoss(); canvas.remove()
    },
  }
}
