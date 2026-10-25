import { createContext } from 'react'

// Lets inline blocks (quizzes) know which lesson they sit in, so results can
// be stored per lesson. nextQuizIndex hands each quiz block in a lesson a
// stable number in document order.
export interface LessonCtx {
  route: string
  nextQuizIndex: () => number
}

export const LessonContext = createContext<LessonCtx | null>(null)

export function makeLessonCtx(route: string): LessonCtx {
  let i = 0
  return { route, nextQuizIndex: () => i++ }
}
