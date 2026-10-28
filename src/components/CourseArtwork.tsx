const topics = ['foundations', 'mathematics', 'neural-networks', 'ai-agents', 'optimization', 'ai-learning', 'ai-systems', 'inference', 'research', 'robotics', 'complete-ai']
function artworkSource(topic: string) { if (topic === 'complete-ai') return '/images/complete-ai.svg'; return `/images/${topic === 'ai-learning' || topic === 'ai-systems' ? topic : `skills-${topic}`}.jpg` }
export function CourseArtwork({ seed = 1, topic }: { seed?: number; topic?: string }) {
  const name = topic ?? topics[((seed - 1) % topics.length + topics.length) % topics.length]
  return <div className={`course-artwork artwork-${name}`} aria-hidden="true"><img src={artworkSource(name)} alt="" width={1672} height={941} loading="lazy" /></div>
}
