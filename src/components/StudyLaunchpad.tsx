import { Link } from 'react-router-dom'

export function StudyLaunchpad() {
  return <section className="study-launchpad" aria-label="Choose a learning space">
    <Link to="/for-work"><span className="study-launch-icon" aria-hidden="true">✧</span><div><strong>Apply AI to your work</strong><p>Explore an industry. See a useful workflow.</p></div><span aria-hidden="true">↗</span></Link>
    <Link to="/courses/complete-ai"><span className="study-launch-icon" aria-hidden="true">▦</span><div><strong>Build the full foundation</strong><p>24 core topics, from reasoning to responsible AI.</p></div><span aria-hidden="true">↗</span></Link>
    <Link to="/code"><span className="study-launch-icon" aria-hidden="true">⌘</span><div><strong>Make something work</strong><p>Write Python. Run it. Understand the result.</p></div><span aria-hidden="true">↗</span></Link>
  </section>
}
