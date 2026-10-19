import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="narrow">
      <h1>Not found</h1>
      <p>That page does not exist. <Link to="/">Go home</Link>.</p>
    </div>
  )
}
