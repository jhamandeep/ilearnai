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

export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose">
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]} components={{ code: Code, pre: Pre }}>
        {preprocessRich(children)}
      </ReactMarkdown>
    </div>
  )
}
