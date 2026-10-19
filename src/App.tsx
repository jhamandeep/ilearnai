import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './lib/auth'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Courses, TrackPage } from './pages/Courses'
import { Glossary, TermPage } from './pages/Glossary'
import { Pricing } from './pages/Pricing'
import { SignIn } from './pages/SignIn'
import { NotFound } from './pages/NotFound'

// Markdown + KaTeX and the labs are the heavy chunks, so they load on demand.
const LessonPage = lazy(() => import('./pages/Lesson').then((m) => ({ default: m.LessonPage })))
const Papers = lazy(() => import('./pages/Papers').then((m) => ({ default: m.Papers })))
const PaperPage = lazy(() => import('./pages/Papers').then((m) => ({ default: m.PaperPage })))
const Labs = lazy(() => import('./pages/Labs').then((m) => ({ default: m.Labs })))
const LabPage = lazy(() => import('./pages/Labs').then((m) => ({ default: m.LabPage })))

function Loading() {
  return <p className="meta">Loading…</p>
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:track" element={<TrackPage />} />
              <Route path="/courses/:track/:module/:lesson" element={<LessonPage />} />
              <Route path="/papers" element={<Papers />} />
              <Route path="/papers/:slug" element={<PaperPage />} />
              <Route path="/glossary" element={<Glossary />} />
              <Route path="/glossary/:slug" element={<TermPage />} />
              <Route path="/labs" element={<Labs />} />
              <Route path="/labs/:slug" element={<LabPage />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  )
}
