import { useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { tracks, lessonRoutes } from '../data/tracks'
import { labs } from '../data/labs'
import { featuredVideos } from '../data/featuredVideos'
import { videos } from '../data/videos'
import { useAuth } from '../lib/auth'
import { TrackCard } from './Courses'
import { CourseArtwork } from '../components/CourseArtwork'
import { VideoThumbnail } from '../components/VideoThumbnail'
import { HomeKnowledgeMap } from '../components/HomeKnowledgeMap'
import { ImmersiveHero } from '../components/ImmersiveHero'
import { ArtworkMotionContext } from '../lib/artworkMotion'
import { doneCount, isDone, placement, useProgressVersion } from '../lib/progress'

const sections = [
  ['knowledge-map', 'Knowledge map'],
  ['ai-for-your-work', 'AI for your work'],
  ['learn-the-basics', 'Learn the basics'],
  ['advance-your-skills', 'Advance your skills'],
  ['try-a-lab', 'Try a lab'],
  ['explore-resources', 'Explore resources'],
  ['faqs', 'FAQs'],
]
const faqs = [
  ['Do I need coding experience?', 'No. AI for your work explains benefits, use cases, and practical implementation for your field and role without coding. If you want to build AI systems, Start Here introduces computers, Python, and the tools you need.'],
  ['How do I find the right course?', 'Follow the learning path from Level 0, or take the placement test to find a suitable starting level. Each track lists its prerequisites, audience, and the projects you can build.'],
  ['Are the courses and labs free?', 'All ilearnai lessons, quizzes, practice papers, and browser labs are free. Some linked tools and third-party services may have their own pricing. Create a free account to access learning content and save your progress.'],
  ['Where is my learning progress saved?', 'Completed lessons and quiz results are saved to your account. Sign in on another device to continue learning. Changes made while offline wait in this browser until they can sync.'],
  ['What can I build as I learn?', 'The Build the AI Ecosystem track takes you through a chat application, retrieval over your documents, agents with tools, fine-tuning, and deployment. Later tracks explore production engineering, inference, and research.'],
]

export function Home() {
  const { user, preview } = useAuth()
  const motion = useContext(ArtworkMotionContext)
  const page = useRef<HTMLDivElement>(null)
  useProgressVersion()
  const [activeSection, setActiveSection] = useState('knowledge-map')
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.setAttribute('data-arrived', 'true'); observer.unobserve(entry.target) }
    }), { threshold: .08 })
    page.current?.querySelectorAll('.section-head, .home-map-heading, .feature-banner, .home-ask-section, .faq-section').forEach(element => observer.observe(element))
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    let frame: number | undefined
    const update = () => {
      if (frame !== undefined) return
      frame = requestAnimationFrame(() => {
        frame = undefined
        const reached = sections.filter(([id]) => { const element = document.getElementById(id); return element && element.getBoundingClientRect().top <= 190 })
        setActiveSection((reached.at(-1) ?? sections[0])[0])
      })
    }
    const observer = new IntersectionObserver(update, { rootMargin: '-160px 0px -45% 0px', threshold: 0 })
    sections.forEach(([id]) => { const element = document.getElementById(id); if (element) observer.observe(element) })
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    update()
    return () => { observer.disconnect(); window.removeEventListener('scroll', update); window.removeEventListener('resize', update); if (frame !== undefined) cancelAnimationFrame(frame) }
  }, [])
  const rec = placement()
  const done = tracks.reduce((n, t) => n + doneCount(lessonRoutes(t)), 0)
  const next = tracks.flatMap((t) => t.modules.flatMap((m) => m.lessons.map((l) => ({ title: l.title, route: `/courses/${t.slug}/${m.slug}/${l.slug}` })))).find((l) => !isDone(l.route))
  const basics = ['start-here', 'math-from-zero', 'ai-foundations']
  const advanced = ['ai-engineering', 'inference-engineering', 'ai-research']
  return (
    <div ref={page} className="experience-home" data-motion={motion.playing ? 'on' : 'off'}>
      <section className="experience-intro" aria-labelledby="skills-title">
        <div><p className="eyebrow"><span className="experience-dot" /> OPEN MINDS. REAL POSSIBILITIES.</p><h1 id="skills-title">Understand AI.<br /><span>Shape what’s next.</span></h1></div>
        <div className="experience-intro-aside"><p>Big ideas, made clear. Discover what AI can do for your work—and learn to build what comes next.</p><div className="hero-actions work-home-actions"><Link className="btn btn-primary" to="/courses">Find your starting point <span aria-hidden="true">↗</span></Link><Link className="text-cta" to="/for-work">Explore AI for your work <span aria-hidden="true">↗</span></Link></div></div>
        {done > 0 && next && <Link to={next.route} className="btn btn-primary cover-continue">Continue: {next.title} <span aria-hidden="true">→</span></Link>}
      </section>
      <ImmersiveHero />
      <div className="experience-scroll"><span aria-hidden="true">+</span><span>MADE TO EXPLORE. FREE TO LEARN.</span><a href="#knowledge-map">SCROLL TO DISCOVER <span aria-hidden="true">↓</span></a><span aria-hidden="true">+</span></div>
      <nav className="section-links" aria-label="Jump to a section">
        {sections.map(([id, label]) => <a href={`#${id}`} key={id} aria-current={activeSection === id ? 'location' : undefined} onClick={() => setActiveSection(id)}>{label}</a>)}
      </nav>

      <HomeKnowledgeMap />

      <section id="ai-for-your-work" className="skills-section home-work-section"><div className="section-head section-head-split"><h2>Your field.<br />Your role.<br />Your next step.</h2><div><p>You do not need to become an AI engineer to understand its value. Explore practical uses in banking, healthcare, retail, education, manufacturing, and more.</p><p>Guidance for leaders, managers, team members, architects, delivery, risk, and operations.</p><Link to="/for-work" className="text-cta">Explore 12 industries and 36 use cases ↗</Link></div></div><div className="home-work-grid">{[['banking', 'Banking', 'Better service and case preparation', '▥'], ['healthcare', 'Healthcare', 'More time for people, less administration', '+'], ['retail', 'Retail & commerce', 'Clearer product information and stock plans', '▱'], ['manufacturing', 'Manufacturing', 'Inspection and maintenance support', '▦'], ['education', 'Education & training', 'Useful materials and educator support', '▤'], ['technology', 'Technology & IT', 'Better preparation, testing, and support', '⌘']].map(([slug, title, detail, icon]) => <Link key={slug} to={`/for-work/${slug}`}><span aria-hidden="true">{icon}</span><div><h3>{title}</h3><p>{detail}</p></div><span aria-hidden="true">↗</span></Link>)}</div></section>

      <section id="learn-the-basics" className="skills-section">
        <div className="section-head section-head-split"><h2>Learn the basics</h2><p>Build a foundation in computers, mathematics, and AI. Start from zero and learn one clear idea at a time.</p></div>
        <div className="grid course-grid">{basics.map((slug) => { const t = tracks.find((t) => t.slug === slug)!; return <TrackCard key={slug} t={t} /> })}</div>
      </section>

      <section className="feature-banner" aria-labelledby="build-title">
        <div className="feature-copy"><span className="feature-label">Learn through projects</span><h2 id="build-title">Turn what you learn<br />into something real.</h2><p>Build a chatbot, search your own documents, give an agent tools, and deploy an AI service. Follow a guided project track from the first step.</p><Link to="/courses/build-ai-ecosystem" className="btn btn-primary">Start building <span aria-hidden="true">↗</span></Link></div>
        <CourseArtwork topic="ai-agents" />
      </section>

      <section id="advance-your-skills" className="skills-section">
        <div className="section-head section-head-split"><h2>Advance your skills</h2><div><p>Take the next step. Learn to evaluate, scale, and deploy AI systems, then explore the research behind them.</p><Link to="/courses" className="text-cta">Explore all courses <span aria-hidden="true">↗</span></Link></div></div>
        <div className="grid course-grid">{advanced.map((slug) => { const t = tracks.find((t) => t.slug === slug)!; return <TrackCard key={slug} t={t} /> })}</div>
      </section>

      <section id="try-a-lab" className="skills-section">
        <div className="section-head section-head-split"><h2>Explore an idea.<br />Open a lab.</h2><p>Choose an interactive lab when you’re ready to experiment. Each lab opens in its own workspace with an explanation and controls.</p></div>
        <div className="home-lab-links">{['gradient-descent', 'transformer-flow', 'tokenizer'].map((slug, i) => { const lab = labs.find(l => l.slug === slug)!; return <Link key={slug} to={`/labs/${slug}`}><span className="lab-index">0{i + 1}</span><h3>{lab.title}</h3><p>{lab.blurb}</p><strong>Open lab ↗</strong></Link> })}</div><Link className="text-cta" to="/labs">Explore all labs ↗</Link>
      </section>

      <section className="feature-banner placement-banner" aria-labelledby="placement-title"><div className="feature-copy"><span className="feature-label">Find your starting point</span><h2 id="placement-title">A learning path<br />that meets you where you are.</h2><p>New to AI or ready for your next challenge? Follow four levels from foundations to advanced systems, or take a placement test to find your level.</p><div className="hero-actions"><Link to="/path" className="btn btn-primary">Explore the path <span aria-hidden="true">↗</span></Link><Link to="/practice/placement" className="btn btn-ghost">{rec ? 'Retake placement test' : 'Find your level'} <span aria-hidden="true">→</span></Link></div></div><CourseArtwork topic="ai-systems" /></section>

      <section id="explore-resources" className="skills-section">
        <div className="section-head section-head-split"><h2>Keep exploring</h2><p>Watch a free lecture, read a research paper, or find the tools and datasets for your next project.</p></div>
        <h3 className="featured-videos-heading">Top picks: talks and deep dives</h3><p className="meta">Our editorial picks on AI’s direction, language models, and how systems are built.</p>
        <div className="grid course-grid">{featuredVideos.map((video) => <a className="card resource-video" href={video.url} key={video.url} target="_blank" rel="noreferrer"><div className="resource-image"><VideoThumbnail id={video.id} title={video.title} external /></div><span className="meta">{video.channel}{video.minutes ? ` · ${video.minutes} min` : ''}</span><h3>{video.title}</h3><p>{video.why}</p><span className="journey-action">Watch video <span aria-hidden="true">↗</span></span></a>)}</div>
        <div className="resource-destinations"><Link to="/certifications">Certification and preparation guide ↗</Link><Link to="/ai-infrastructure">AI infrastructure and computer requirements ↗</Link><Link to="/videos">All {videos.length} videos, playlists, and channels <span aria-hidden="true">↗</span></Link><Link to="/resources">Full resource library, organized by level and track <span aria-hidden="true">↗</span></Link><Link to="/papers">Papers with reading notes <span aria-hidden="true">↗</span></Link><Link to="/hub">Models, datasets, and tools <span aria-hidden="true">↗</span></Link><Link to="/glossary">AI glossary <span aria-hidden="true">↗</span></Link><Link to="/knowledge-graph">Explore the knowledge map <span aria-hidden="true">↗</span></Link></div>
      </section>

      <section className="home-ask-section"><div><p className="eyebrow">A little guidance goes a long way</p><h2>Find your way.<br />Ask a question.</h2><p>Find the right course, understand a concept, or get help with your learning progress.</p><Link className="btn btn-primary" to="/ask">Ask ilearnai →</Link></div><CourseArtwork topic="robotics" /></section>
      <section id="faqs" className="skills-section faq-section"><h2>Your questions,<br />answered.</h2><div className="faq-list">{faqs.map(([question, answer], i) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{preview && i === 2 ? 'All lessons, quizzes, practice papers, and browser labs are free and open to explore. Some external services may charge separately.' : preview && !user && i === 3 ? 'Your completed activities, quiz results, and learning progress save in this browser. Use the same browser to continue; clearing site data removes this draft progress.' : answer}</p></details>)}</div></section>
      <section className="experience-outro"><p className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</p><Link to="/courses">Stay curious.<br /><span>Go further.</span><b aria-hidden="true">↗</b></Link><div><span>{tracks.length} learning tracks. Your own pace.</span><Link to="/ask">Need a little direction? Ask ilearnai ↗</Link></div></section>
    </div>
  )
}
