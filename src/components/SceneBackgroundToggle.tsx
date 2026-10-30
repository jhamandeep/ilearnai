import type { SceneAppearance } from '../lib/sceneAppearance'

export function SceneBackgroundToggle({ appearance, onChange, label }: { appearance: SceneAppearance; onChange: (value: SceneAppearance) => void; label: string }) {
  return <div className="scene-background-toggle" data-appearance={appearance} role="group" aria-label={`${label} background`}>
    <span className="scene-background-label">Background</span>
    <div className="scene-background-options">{(['light', 'dark'] as const).map(value => <button type="button" key={value} aria-pressed={appearance === value} onClick={() => onChange(value)}><i className={`scene-background-swatch is-${value}`} aria-hidden="true" />{value === 'light' ? 'Light' : 'Dark'}</button>)}</div>
  </div>
}
