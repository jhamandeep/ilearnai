import { Link, useParams } from 'react-router-dom'
import { posts, findPost } from '../data/blog'
import { findTrack } from '../data/tracks'
import { Markdown } from '../components/Markdown'
import { NotFound } from './NotFound'

const fmt = (d: string) => new Date(d + 'T00:00:00').toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })

export function Blog() {
  return (
    <>
      <header className="page-head">
        <h1>Field notes</h1>
        <p className="lede">Short posts on research, systems, inference and the mathematics underneath.</p>
      </header>
      <ul className="paper-list">
        {posts.map((p) => (
          <li key={p.slug}>
            <span className="meta">{fmt(p.date)} · {findTrack(p.track)?.title} · {p.minutes} min</span>
            <Link to={`/blog/${p.slug}`}><strong>{p.title}</strong></Link>
            <p>{p.summary}</p>
          </li>
        ))}
      </ul>
    </>
  )
}

export function BlogPost() {
  const { slug } = useParams()
  const post = slug ? findPost(slug) : undefined
  if (!post) return <NotFound />
  return (
    <article className="lesson">
      <nav className="crumbs"><Link to="/blog">Field notes</Link> / {fmt(post.date)}</nav>
      <header className="page-head">
        <h1>{post.title}</h1>
        <p className="lede">{post.summary}</p>
        <span className="meta">{fmt(post.date)} · {findTrack(post.track)?.title} · {post.minutes} min read</span>
      </header>
      <Markdown>{post.body}</Markdown>
    </article>
  )
}
