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
  return <><header className="page-head"><h1>Knowledge map</h1><p className="lede">Connect concepts with lessons, original research, and labs. Search for an idea, select its dot, then follow the connections.</p></header><KnowledgeMap selected={params.get('node')} onSelect={select} /></>
}
