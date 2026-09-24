import { markdownFiles } from '../content/contentMap'
import { useEffect, useState } from 'react'
import parse from 'html-react-parser';
import { data } from 'react-router-dom';

const TARGET_FOLDER = 'Timeline'

type TimelineFile = {
    path: string
    name: string
    content: string
}

type TimelineGroup = {
    group: string
    date: number | string
    content: string
}

type ContentGroup = {
    date: number
    content: string
}

function LoadTimelineData({ files }: { files: TimelineFile[] }) {
    const timeline: TimelineGroup[] = []

    files.forEach(file => {
        const content: ContentGroup[] = file.content
            .split(/(?=:-?\d+:)/)
            .map((item: string) => item.trim())
            .filter((item: string) => item.length > 0)
            .map((item: string) => {
                const match = item.match(/^:(-?\d+):\s*(.*)$/s)

                if (!match) {
                    return null
                }

                return {
                    date: Number(match[1]),
                    content: match[2],
                }
            })
            .filter((item): item is ContentGroup => item !== null)

        content.forEach(item => {
            item.content = item.content.replace(/\*\*(.*?)\*\*/g,
                '<strong>$1</strong>')

            file.name = file.name.replace(/\s+/g, '-')

            console.log(file.name)

            timeline.push({
                group: file.name,
                date: item.date,
                content: item.content,
            })
        })
    })

    timeline.sort((a, b) => Number(a.date) - Number(b.date))

    return (
        <div className="timeline">
            {timeline.map((item, index) => (
                <div className="" key={`${item.date}-${index}`}>
                    <div className={`timeline-${item.group}`}>
                        <span className='timeline-date'>{item.date}</span>: {parse(item.content)}
                    </div>
                </div>
            ))}
        </div>
    )
}


export default function TimelineIndexPage() {
    const [timelineFiles, setTimelineFiles] = useState<TimelineFile[]>([])

        useEffect(() => {
            async function loadTimelineFiles() {
            const files: TimelineFile[] = []

            for (const [path, loader] of Object.entries(markdownFiles)) {
                const relativePath = path.replace('/src/content/', '')

                if (!relativePath.startsWith(`${TARGET_FOLDER}/`)) {
                    continue
                }

                const content = await loader()
                const name = path.split('/').pop()?.replace(/\.md$/, '') ?? ''

                files.push({
                    path,
                    name,
                    content,
                })
            }

            setTimelineFiles(files)
            }

            loadTimelineFiles()
        }, [])

    return <LoadTimelineData files={timelineFiles} />
}
