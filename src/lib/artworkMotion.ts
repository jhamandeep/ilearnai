import { createContext } from 'react'
export const ArtworkMotionContext = createContext({ playing: false, paused: false, reduced: false, toggle: () => {} })
