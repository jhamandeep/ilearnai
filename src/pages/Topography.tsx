import { useSearchParams } from 'react-router-dom'
import KnowledgeMap from '../components/KnowledgeMap'

export function Topography() {
  const [params, setParams] = useSearchParams()
  function select(id: string | null) {
    setParams(previous => {
      const next = new URLSearchParams(previous)
      if (id) next.set('node', id); else next.delete('node')
      return next
    }, { replace: true, preventScrollReset: true })
  }
  return <><header className="page-head"><h1>Knowledge map</h1><p className="lede">AI concepts, practical lessons, research, and labs—connected.</p></header><KnowledgeMap selected={params.get('node')} onSelect={select} /></>
}
