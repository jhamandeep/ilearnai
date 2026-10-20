import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Courses, TrackPage } from './pages/Courses'
import { Glossary, TermPage } from './pages/Glossary'
import { NotFound } from './pages/NotFound'

// Markdown + KaTeX and the labs are the heavy chunks, so they load on demand.
const LessonPage = lazy(() => import('./pages/Lesson').then((m) => ({ default: m.LessonPage })))
const Papers = lazy(() => import('./pages/Papers').then((m) => ({ default: m.Papers })))
const PaperPage = lazy(() => import('./pages/Papers').then((m) => ({ default: m.PaperPage })))
const Labs = lazy(() => import('./pages/Labs').then((m) => ({ default: m.Labs })))
const LabPage = lazy(() => import('./pages/Labs').then((m) => ({ default: m.LabPage })))
const Blog = lazy(() => import('./pages/Blog').then((m) => ({ default: m.Blog })))
const BlogPost = lazy(() => import('./pages/Blog').then((m) => ({ default: m.BlogPost })))
const Topography = lazy(() => import('./pages/Topography').then((m) => ({ default: m.Topography })))
const Hierarchy = lazy(() => import('./pages/Hierarchy').then((m) => ({ default: m.Hierarchy })))
const Resources = lazy(() => import('./pages/Resources').then((m) => ({ default: m.Resources })))
const Roadmaps = lazy(() => import('./pages/Roadmaps').then((m) => ({ default: m.Roadmaps })))
const Videos = lazy(() => import('./pages/Videos').then((m) => ({ default: m.Videos })))
const StyleGuide = lazy(() => import('./pages/StyleGuide').then((m) => ({ default: m.StyleGuide })))

function Loading() {
  return <p className="meta">Loading…</p>
}

export default function App() {
  return (
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
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/knowledge-graph" element={<Topography />} />
              <Route path="/hierarchy" element={<Hierarchy />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/roadmaps" element={<Roadmaps />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/style" element={<StyleGuide />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
    </BrowserRouter>
  )
}
