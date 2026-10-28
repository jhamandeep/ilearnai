import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './google-style.css'
import './skills-style.css'
import './work-style.css'
import './brand-style.css'
import './learning-guide-style.css'
import './workspace-style.css'
import './study-style.css'
import './course-workspace.css'
import './course-artwork.css'
import './gradient-lab.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
