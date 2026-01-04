import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { markdownFiles } from '../content/contentMap'
import { filePathToRoute } from '../content/pathUtils'

export default function MarkdownPage() {
  const { '*': slug } = useParams()
  const [content, setContent] = useState<string>('Loading...')

  useEffect(() => {
    if (!slug) return

    const filePath = Object.keys(markdownFiles).find(path =>
      filePathToRoute(path).endsWith(slug)
    )

    if (!filePath) {
      setContent('File not found.')
      return
    }

    // ⚠️ Important: call the function first
    console.log('filePath', filePath)
    markdownFiles[filePath]().then(setContent)
  }, [slug])

  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
}
