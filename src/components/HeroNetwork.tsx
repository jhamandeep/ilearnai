// Decorative animated concept network behind the hero. Pure SVG + CSS, no JS per frame.
const pts = [
  [60, 40], [180, 90], [320, 50], [460, 110], [600, 60], [740, 120], [120, 200], [280, 220], [420, 190], [560, 240], [700, 210], [820, 180],
]
const links = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [1, 6], [1, 7], [3, 8], [4, 9], [5, 10], [5, 11], [6, 7], [7, 8], [8, 9], [9, 10], [10, 11]]

export function HeroNetwork() {
  return (
    <svg className="hero-net" viewBox="0 0 880 280" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      {links.map(([a, b], i) => (
        <line key={i} x1={pts[a][0]} y1={pts[a][1]} x2={pts[b][0]} y2={pts[b][1]} className="hero-link" style={{ animationDelay: `${(i * 0.37) % 4}s` }} />
      ))}
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 5 : 3.5} className="hero-node" style={{ animationDelay: `${(i * 0.53) % 5}s` }} />
      ))}
      {links.slice(0, 6).map(([a, b], i) => (
        <circle key={'p' + i} r={2.5} className="hero-packet">
          <animateMotion dur={`${4 + i}s`} repeatCount="indefinite" path={`M ${pts[a][0]} ${pts[a][1]} L ${pts[b][0]} ${pts[b][1]}`} />
        </circle>
      ))}
    </svg>
  )
}
