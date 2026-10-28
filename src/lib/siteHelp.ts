import { answerWorkQuestion } from './workHelp'
import { tracks } from '../data/tracks'
import { glossary } from '../data/glossary'
import { labs } from '../data/labs'

export interface HelpLink { title: string; to: string; detail?: string }
export interface HelpAnswer { title: string; text: string; links: HelpLink[]; kind: 'help' | 'topic' | 'search' | 'fallback' }
interface Guide { title: string; terms: string[]; text: string; links: HelpLink[] }
const guide: Guide[] = [
  { title: 'Write and run Python', terms: ['python workspace', 'run python', 'coding', 'code editor', 'python practice', 'workspace'], text: 'Open the Python workspace for guided exercises. Read a worked example, edit the code, and use Run code & check to see output and feedback. Python runs in your browser after downloading the runtime. Stop cancels a run. Drafts and exercise progress stay in this browser, separately from course completion.', links: [{ title: 'Open Python workspace', to: '/code' }, { title: 'Learn Python fundamentals', to: '/courses/start-here' }] },
  { title: 'Explore open-source tools and visualizations', terms: ['github', 'open source', 'opensource', 'visualizations', 'visualisation', 'repositories'], text: 'The resource library includes GitHub projects, open-source tools, and interactive visualizations. Each newly curated project explains what it helps with, its setup, and a first task. Find Transformer Explainer, CNN Explainer, Netron, micrograd, Streamlit, Gradio, and more. External projects open on their own websites.', links: [{ title: 'Open-source projects', to: '/resources?collection=open-source' }, { title: 'Interactive visualizations', to: '/resources?kind=visualization' }, { title: 'GitHub and repositories', to: '/resources?kind=repo' }] },
  { title: 'Find your starting point', terms: ['start', 'beginner', 'begin', 'new', 'recommend', 'choose', 'first', 'coding experience'], text: 'Choose AI for your work to explore benefits and implementation in your industry without coding. To build technical skills, Start Here introduces computers, Python, tools, and data. Use the placement test if you already have experience.', links: [{ title: 'AI for your work', to: '/for-work' }, { title: 'Start Here', to: '/courses/start-here' }, { title: 'See the learning path', to: '/path' }, { title: 'Take the placement test', to: '/practice/placement' }] },
  { title: 'Your learning progress', terms: ['progress', 'saved', 'sync', 'offline', 'device', 'resume', 'continue', 'dashboard'], text: 'My learning shows completed lessons, course progress, and where to continue. Mark each activity complete when you finish it; finish every activity to complete a lesson. Progress saves to your account. Unsaved changes wait in this browser if the connection drops; use Retry on your dashboard to sync them.', links: [{ title: 'Open my learning', to: '/dashboard' }] },
  { title: 'Finish a lesson', terms: ['complete', 'completion', 'finish', 'mark', 'checkmark'], text: 'Open a lesson and work through its activity list: reading, animations, videos, practice, quizzes, and resources. Use Mark complete in each activity. Submit quiz answers before marking a quiz complete. You can revisit any activity or mark it incomplete.', links: [{ title: 'Browse courses', to: '/courses' }, { title: 'View my progress', to: '/dashboard' }] },
  { title: 'Sign in and create an account', terms: ['login', 'log in', 'sign in', 'signup', 'sign up', 'register', 'account'], text: 'Create a free account with your name, email, and a password of at least 10 characters. You can browse course outlines without an account. Sign in to open lessons, use labs, and save progress. Your account menu includes My learning and Sign out.', links: [{ title: 'Create an account', to: '/signup' }, { title: 'Sign in', to: '/login' }] },
  { title: 'Password help', terms: ['password', 'forgot', 'reset password', 'recover'], text: 'Passwords need 10–128 characters. Check that you are using the email you registered with. This draft does not yet have email verification or a password-reset service. Ask ilearnai cannot view or change your password.', links: [{ title: 'Open sign in', to: '/login' }] },
  { title: 'Free learning', terms: ['free', 'price', 'pricing', 'cost', 'paid', 'subscription', 'payment', 'pay'], text: 'ilearnai courses, quizzes, practice papers, and browser labs are free. An account saves your progress. Some external tools, cloud services, and linked third-party courses may charge separately.', links: [{ title: 'Explore free courses', to: '/courses' }, { title: 'Explore labs', to: '/labs' }] },
  { title: 'Find videos', terms: ['video', 'videos', 'watch', 'youtube', 'lecture'], text: 'The video library groups videos, playlists, and channels by level, track, and topic. Courses also have dedicated video activities. If a video cannot play inline, use its original source link.', links: [{ title: 'Open video library', to: '/videos' }] },
  { title: 'Try a hands-on lab', terms: ['lab', 'labs', 'simulation', 'simulator', 'calculator', 'interactive'], text: 'Labs let you change inputs and inspect the results. Try gradient descent, attention, tokenization, inference memory, or agent workflows. Lab calculations run in your browser. Sign in before opening a lab.', links: [{ title: 'Browse all labs', to: '/labs' }, { title: 'Try gradient descent', to: '/labs/gradient-descent' }] },
  { title: 'Practice and quizzes', terms: ['quiz', 'quizzes', 'practice', 'exam', 'test', 'assessment', 'placement'], text: 'Lesson quizzes explain each answer after you check your work. Practice papers use questions from the lessons, and the placement test suggests a starting level. Your results save to your account.', links: [{ title: 'Open practice papers', to: '/practice' }, { title: 'Find my level', to: '/practice/placement' }] },
  { title: 'Find resources and research', terms: ['resource', 'resources', 'paper', 'papers', 'reading', 'documentation', 'dataset', 'models'], text: 'Resources groups useful links by level, track, and topic. Papers includes research summaries and reading notes. The AI hub links datasets, models, notebooks, and tools. Each lesson also has a dedicated resources activity.', links: [{ title: 'Resource library', to: '/resources' }, { title: 'Research papers', to: '/papers' }, { title: 'AI hub', to: '/hub' }] },
  { title: 'Find your way around', terms: ['navigation', 'navigate', 'menu', 'where', 'page', 'website', 'site', 'help'], text: 'Use AI for your work for industry use cases, Catalogue for technical courses, Learning paths for a guided sequence, and My learning to continue. The menu button opens the navigation on smaller screens. Use the search bar or ask for a specific topic here.', links: [{ title: 'Catalogue', to: '/courses' }, { title: 'Learning paths', to: '/path' }, { title: 'My learning', to: '/dashboard' }] },
  { title: 'Course completion and credentials', terms: ['certificate', 'certification', 'badge', 'achievement', 'credential'], text: 'ilearnai tracks your lesson and course completion in My learning. This draft does not issue an accredited certificate or a Google credential. Linked third-party courses have their own credential requirements.', links: [{ title: 'My learning', to: '/dashboard' }] },
  { title: 'How Ask ilearnai works', terms: ['chatbot', 'assistant', 'llm', 'static', 'ask ilearnai', 'chatgpt'], text: 'Ask ilearnai matches your question to built-in help, course outlines, lesson summaries, lab descriptions, and glossary definitions. It can guide you to useful pages and explain indexed terms. It does not generate new answers or access your account details.', links: [{ title: 'Browse the glossary', to: '/glossary' }, { title: 'Browse courses', to: '/courses' }] },
]
const stop = new Set('a an the is are was were what how where why which who when can could would should do does did i me my we you your it this that these those to for of in on at and or with about please tell explain show find need want know learn learning course courses topic related anything'.split(' '))
const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim()
const hasPhrase = (text: string, phrase: string) => ` ${normalize(text).replaceAll('-', ' ')} `.includes(` ${normalize(phrase).replaceAll('-', ' ')} `)
const tokens = (value: string) => normalize(value).split(/[\s-]+/).filter(word => word && !stop.has(word))
const aliases: Record<string, string> = { llm: 'large language model', genai: 'generative ai', rag: 'retrieval augmented generation', ai: 'artificial intelligence', gd: 'gradient descent', ml: 'machine learning' }

export function answerSiteQuestion(question: string, access: { preview?: boolean; signedIn?: boolean } = {}): HelpAnswer {
  const helpAnswer = (item: Guide): HelpAnswer => {
    const base = { ...item, kind: 'help' as const }
    if (!access.preview) return base
    if (item.title === 'Sign in and create an account' || item.title === 'Password help') return { kind: 'help', title: 'Explore without signing in', text: 'All courses, lessons, labs, and resources are open in this draft. You do not need an account or password. Open My learning to see your progress.', links: [{ title: 'My learning', to: '/dashboard' }, { title: 'Browse courses', to: '/courses' }] }
    if (item.title === 'Your learning progress' && !access.signedIn) return { ...base, text: 'Mark activities complete as you go. My learning shows your progress and the next unfinished activity. Progress and quiz results save in this browser, without an account. Use the same browser to continue; clearing site data removes this draft progress.' }
    if (item.title === 'Try a hands-on lab') return { ...base, text: 'Open any lab without signing in. Change inputs to explore gradient descent, attention, tokenization, inference memory, and agent workflows. Calculations and animations run in your browser.' }
    if (item.title === 'Free learning') return { ...base, text: 'All ilearnai courses, quizzes, practice papers, and labs are free and open without an account in this draft. Some external tools, cloud services, and third-party courses may charge separately.' }
    if (item.title === 'Practice and quizzes' && !access.signedIn) return { ...base, text: 'Lesson quizzes explain each answer after you check your work. Practice papers use questions from the lessons, and the placement test suggests a starting level. Your results save in this browser.' }
    return base
  }
  const workAnswer = answerWorkQuestion(question.slice(0, 500))
  if (workAnswer) return workAnswer
  const query = normalize(question.slice(0, 500))
  const words = tokens(query)
  if (!words.length) return { kind: 'help', title: 'How can I help you explore?', text: 'Ask for a topic such as attention or RAG, or ask how to find courses, save progress, or open a lab.', links: [{ title: 'Explore the catalogue', to: '/courses' }, { title: 'Follow the learning path', to: '/path' }] }
  const expanded = [...new Set([...words, ...words.flatMap(word => tokens(aliases[word] ?? ''))])]
  const candidates = glossary.map(term => {
    const title = normalize(term.term), slug = normalize(term.slug.replaceAll('-', ' '))
    const exact = title === query || slug === query || words.some(word => aliases[word] && normalize(aliases[word]) === title)
    const phrase = title.length > 2 && (` ${query} `).includes(` ${title} `)
    const titleWords = tokens(`${term.term} ${term.slug}`)
    const overlap = expanded.filter(word => titleWords.includes(word)).length
    return { term, score: exact ? 100 : phrase ? 75 + titleWords.length : overlap >= 2 ? 15 + overlap : 0 }
  }).filter(item => item.score > 0).sort((a, b) => b.score - a.score)
  // Navigation questions with a topic should still return topic-specific links.
  const directHelp = guide.map(item => ({ item, score: item.terms.reduce((sum, term) => sum + ((` ${query} `).includes(` ${term} `) ? term.includes(' ') ? 4 : 2 : 0), 0) })).sort((a, b) => b.score - a.score)[0]
  const specificHelp = /\b(progress|password|login|signup|account|register|saved|sync|offline|dashboard|certificate|credential|free|price|pricing|payment|completion|complete|mark|beginner|start|placement|navigation|menu)\b/.test(query)
  const codingNavigation = /\b(run python|python workspace|code editor|python practice|coding)\b/.test(query)
  if (directHelp?.score > 0 && (specificHelp || codingNavigation || !candidates.length && words.length <= 3)) return helpAnswer(directHelp.item)
  if (candidates.length && candidates[0].score >= 17) {
    const { term } = candidates[0]
    const relatedLessons = tracks.flatMap(track => track.modules.flatMap(module => module.lessons.filter(lesson => hasPhrase(`${lesson.title} ${lesson.keyTerms.join(' ')}`, term.term)).slice(0, 1).map(lesson => ({ title: lesson.title, to: `/courses/${track.slug}/${module.slug}/${lesson.slug}`, detail: track.title })))).slice(0, 2)
    const relatedLabs = labs.filter(lab => hasPhrase(`${lab.title} ${lab.blurb}`, term.term)).slice(0, 1).map(lab => ({ title: lab.title, to: `/labs/${lab.slug}`, detail: 'Interactive lab' }))
    return { kind: 'topic', title: term.term, text: term.short, links: [{ title: `Read about ${term.term}`, to: `/glossary/${term.slug}` }, ...relatedLabs, ...relatedLessons] }
  }
  const items: (HelpLink & { text: string; category: string })[] = [
    ...tracks.map(track => ({ title: track.title, to: `/courses/${track.slug}`, text: `${track.tagline} ${track.description}`, detail: 'Course', category: 'course' })),
    ...tracks.flatMap(track => track.modules.flatMap(module => module.lessons.map(lesson => ({ title: lesson.title, to: `/courses/${track.slug}/${module.slug}/${lesson.slug}`, text: lesson.summary, detail: track.title, category: 'lesson' })))),
    ...labs.map(lab => ({ title: lab.title, to: `/labs/${lab.slug}`, text: lab.blurb, detail: 'Interactive lab', category: 'lab' })),
  ]
  const ranked = items.map(item => { const title = tokens(item.title), body = tokens(item.text); const matched = expanded.filter(word => title.includes(word) || body.includes(word)); return { item, score: matched.length >= Math.min(2, words.length) ? matched.reduce((sum, word) => sum + (title.includes(word) ? 5 : 1), 0) : 0 } }).filter(item => item.score >= 3).sort((a, b) => b.score - a.score).slice(0, 4)
  if (ranked.length) return { kind: 'search', title: 'Here’s where to explore that', text: ranked[0].item.text, links: ranked.map(({ item }) => ({ title: item.title, to: item.to, detail: item.detail })) }
  if (directHelp?.score > 0) return helpAnswer(directHelp.item)
  return { kind: 'fallback', title: 'I don’t have a built-in answer for that yet.', text: 'Try a specific AI topic, a course name, or a question about using ilearnai. You can also explore the catalogue or glossary below.', links: [{ title: 'Browse courses', to: '/courses' }, { title: 'Browse AI terms', to: '/glossary' }, { title: 'Explore resources', to: '/resources' }] }
}
