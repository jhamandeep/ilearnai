import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import { RichBlock, preprocessRich, richKinds, type RichKind } from './rich'
import type { ComponentProps } from 'react'

function Code(props: ComponentProps<'code'>) {
  const { className, children, ...rest } = props
  const lang = /language-(\w+)/.exec(className ?? '')?.[1]
  if (lang && (richKinds as readonly string[]).includes(lang)) {
    return <RichBlock kind={lang as RichKind} src={String(children)} />
  }
  return <code className={className} {...rest}>{children}</code>
}

function Pre(props: ComponentProps<'pre'>) {
  const child = props.children as { props?: { className?: string } } | undefined
  const lang = /language-(\w+)/.exec(child?.props?.className ?? '')?.[1]
  if (lang && (richKinds as readonly string[]).includes(lang)) return <>{props.children}</>
  return <pre {...props} />
}

function SectionHeading({ children, className, id }: ComponentProps<'h2'>) {
  const text = String(children).toLowerCase()
  const tone = /common mistakes|limitations|what to avoid/.test(text) ? 'caution'
    : /try it|check your understanding|practice/.test(text) ? 'practice'
    : /example/.test(text) ? 'example'
    : /why it matters|what this lesson covers|how it works/.test(text) ? 'idea' : undefined
  return <h2 className={className} id={id} data-learning-tone={tone}>{children}</h2>
}

export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose">
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]} components={{ code: Code, pre: Pre, h2: SectionHeading }}>
        {preprocessRich(children)}
      </ReactMarkdown>
    </div>
  )
}
