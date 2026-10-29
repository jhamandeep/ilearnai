import { lazy, Suspense } from 'react'
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Courses, TrackPage } from './pages/Courses'
import { Glossary, TermPage } from './pages/Glossary'
import { NotFound } from './pages/NotFound'

import { AuthProvider, RequireAuth } from './lib/auth'
import { Account } from './pages/Account'

// Markdown + KaTeX and the labs are the heavy chunks, so they load on demand.
const ExplainerPreview = lazy(() => import('./pages/ExplainerPreview').then(module => ({ default: module.ExplainerPreview })))
const CodePractice = lazy(() => import('./pages/CodePractice').then(module => ({ default: module.CodePractice })))
const Dashboard = lazy(() => import('./pages/Dashboard').then(module => ({ default: module.Dashboard })))
const ForWork = lazy(() => import('./pages/ForWork').then(module => ({ default: module.ForWork })))
const IndustryPage = lazy(() => import('./pages/ForWork').then(module => ({ default: module.IndustryPage })))
const WorkCasePage = lazy(() => import('./pages/ForWork').then(module => ({ default: module.WorkCasePage })))
const Certifications = lazy(() => import('./pages/Certifications').then(m => ({ default: m.Certifications })))
const AIInfrastructure = lazy(() => import('./pages/AIInfrastructure').then(m => ({ default: m.AIInfrastructure })))
const Ask = lazy(() => import('./pages/Ask').then(module => ({ default: module.Ask })))
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
const Hub = lazy(() => import('./pages/Hub').then((m) => ({ default: m.Hub })))
const Path = lazy(() => import('./pages/Path').then((m) => ({ default: m.Path })))
const Practice = lazy(() => import('./pages/Practice').then((m) => ({ default: m.Practice })))
const PracticePaper = lazy(() => import('./pages/Practice').then((m) => ({ default: m.PracticePaper })))
const Placement = lazy(() => import('./pages/Practice').then((m) => ({ default: m.Placement })))

function Loading() {
  return <p className="meta">Loading…</p>
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider><Suspense fallback={<Loading />}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/for-work" element={<ForWork />} />
              <Route path="/for-work/:industry" element={<IndustryPage />} />
              <Route path="/for-work/:industry/:useCase" element={<WorkCasePage />} />
              <Route path="/code" element={<CodePractice />} />
              <Route path="/preview/narrated-explainer" element={<ExplainerPreview />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:track" element={<TrackPage />} />
              <Route path="/labs" element={<Labs />} />
              <Route path="/path" element={<Path />} />
              <Route path="/style" element={<StyleGuide />} />
              <Route path="/ask" element={<Ask />} />
              <Route path="/certifications" element={<Certifications />} />
              <Route path="/ai-infrastructure" element={<AIInfrastructure />} />
              <Route path="/login" element={<Account />} />
              <Route path="/signup" element={<Account register />} />
              <Route element={<RequireAuth><Outlet /></RequireAuth>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/courses/:track/:module/:lesson/:activity" element={<LessonPage />} />
              <Route path="/courses/:track/:module/:lesson" element={<LessonPage />} />
              <Route path="/papers" element={<Papers />} />
              <Route path="/papers/:slug" element={<PaperPage />} />
              <Route path="/glossary" element={<Glossary />} />
              <Route path="/glossary/:slug" element={<TermPage />} />
              <Route path="/labs/:slug" element={<LabPage />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/knowledge-graph" element={<Topography />} />
              <Route path="/hierarchy" element={<Hierarchy />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/roadmaps" element={<Roadmaps />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/hub" element={<Hub />} />
              <Route path="/practice" element={<Practice />} />
              <Route path="/practice/placement" element={<Placement />} />
              <Route path="/practice/:track/:paper" element={<PracticePaper />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense></AuthProvider>
    </BrowserRouter>
  )
}
